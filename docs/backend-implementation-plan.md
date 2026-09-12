# Backend Implementation Plan (Express.js)

A stage-by-stage plan for building the PlaceRight backend in Express.js so it satisfies the contract this frontend already expects. Each stage is independently shippable: after it, you can flip `VITE_USE_MOCKS=false` for a growing slice of the app and the rest keeps running on mocks.

> The contract itself is not up for renegotiation here — it's fixed by `src/types/domain.ts`, `src/lib/http.ts`, and the endpoint list in the root `README.md`. This doc only sequences the work to build it. `src/mocks/*.ts` is the reference implementation for every business rule below (eligibility, scoring, catchment, recommendations) — port that logic rather than re-deriving it. Note: `domain.ts` currently has a comment calling this "the NestJS backend" — that's stale relative to this plan; update it once the Express backend exists.

## Ground rules the frontend already assumes

- **Error shape**: every non-2xx response must be JSON `{ statusCode, message, error }` (`message` can be a string or string array — `http.ts` joins arrays with `", "`). This is a Nest-ism but nothing here requires Nest; just match the envelope.
- **Auth**: `Authorization: Bearer <token>` on every request once logged in. No cookies, no refresh-token flow implied by the client.
- **Base URL**: single `VITE_API_BASE_URL`, no versioned path prefix expected (e.g. plain `/auth/login`, not `/api/v1/auth/login`) unless you also update the frontend.
- **Content type**: JSON in, JSON out, always `Content-Type: application/json`.
- **CORS**: the frontend is a separate origin (Vite dev server) — CORS must be configured from stage 0.

## Stage 0 — Project scaffold

**Goal:** an Express app that boots, has the error envelope wired, and passes a health check.

- `npm init`, TypeScript (`tsc`, `ts-node-dev` or `tsx` for dev reload), Express, `cors`, `helmet`, `dotenv`.
- Central error handler middleware producing `{ statusCode, message, error }` for every thrown error, including a fallback 500 handler and a 404 handler for unmatched routes.
- A small `ApiError` class on the server side mirroring the client's (`statusCode`, `message`, `error`) so route handlers can `throw new ApiError(404, "Course not found", "Not Found")`.
- Request logging (`morgan` or `pino-http`) and a `GET /health` route.
- `.env` handling for `PORT`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.
- Nothing else. Verify: `curl localhost:3000/health` returns 200, and an unknown route returns the envelope shape, not Express's default HTML error page.

## Stage 1 — Data layer

**Goal:** persistence for every entity in `domain.ts`, seeded from the JAMB data dossier.

- Pick a database (Postgres is the natural fit given the relational shape: universities → courses → requirements/scoring-policies/catchment-rules). Use an ORM/query builder (Prisma, Drizzle, or Knex) — whichever the team is comfortable with.
- Tables map close to 1:1 with these `domain.ts` interfaces: `University`, `Course`, `AdmissionRequirement`, `ScoringPolicy`, `CatchmentRule`, `CandidateProfile`, `AssessmentReport`, plus an `AuthUser`/`users` table (with password hash, not in the DTO), `AdminLogEntry`, `EvaluationEvent`.
- Write a seed script that loads `docs/jamb-data-dossier.md`'s data (universities, 210 courses, requirements, scoring policies, catchment rules). Since OAU's cut-off/formula data is explicitly incomplete in the dossier, seed what exists and leave the rest editable via the admin endpoints built in Stage 5 — don't block this stage on finishing that research.
- No HTTP routes yet. Verify: seed script runs cleanly and a manual query confirms row counts (6 universities, ~210 courses, one scoring policy + catchment rule per university).

## Stage 2 — Auth

**Goal:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me` working end-to-end with the frontend's `auth-store.ts`.

- Password hashing (bcrypt/argon2). `RegisterPayload` → `{ fullName, email, phone, password }`. `LoginPayload` → `{ email, password }`.
- Issue a JWT on register/login; response body is `AuthSession` = `{ accessToken, user: AuthUser }` where `AuthUser` = `{ id, fullName, email, phone?, role }`. `role` is `"CANDIDATE" | "ADMIN"` — registration always creates `CANDIDATE`; admin users are seeded/promoted out-of-band (no public admin-signup endpoint is in the contract).
- Auth middleware: verify `Authorization: Bearer`, attach `req.user`, 401 via the standard error envelope when missing/invalid.
- `GET /auth/me` returns the current `AuthUser` from the token.
- A second middleware, `requireAdmin`, for later stages — 403 envelope when `req.user.role !== "ADMIN"`.
- Verify: register → login → call `/auth/me` with the returned token → matches what `src/hooks/useAuth` (check that hook) expects when swapped off mocks.

## Stage 3 — Public catalog endpoints (read-only)

**Goal:** the university/course explorer works against real data.

- `GET /universities`
- `GET /universities/:id/courses`
- `GET /universities/:id/scoring-policy`
- `GET /universities/:id/catchment-rule`
- `GET /courses/:id/requirements`
- All public (no auth required) — this matches the "explore before you register" flow implied by `src/routes/universities/`.
- 404 via the envelope for unknown IDs.
- Verify: point `VITE_API_BASE_URL` at this server with `VITE_USE_MOCKS=false` and browse the university explorer pages in the running frontend — this is the first stage worth a real browser check.

## Stage 4 — Candidate profile + the assessment engine

**Goal:** the core value proposition — verify eligibility, score, classify catchment, recommend, and persist an `AssessmentReport`.

This is the largest stage; split it into sub-steps but ship together since they compose into one flow.

1. **Candidate profile** — `POST /candidates/profile`, `GET /candidates/me`, `PATCH /candidates/me`, all authenticated as `CANDIDATE`. Body/response shape is `CandidateProfile`.
2. **Eligibility** — `POST /eligibility/verify`. Port `verifyEligibility()` from `src/mocks/engine.ts` verbatim: check required UTME subjects (excluding "Use of English", which is implicit), flag subjects not on the accepted list as warnings, check O-Level credits (`A1`–`C6` count, `D7`/`E8`/`F9` don't) against `requiredOLevelSubjects` and `minimumCredits`. Return `VerificationResult`.
3. **Scoring** — `POST /scoring/aggregate`. Apply the university's `ScoringPolicy` weightings to UTME/Post-UTME/O-Level components, compare against the course's merit/catchment/ELDS cut-offs. Return `AggregateScoreResult` with a `breakdown` per component — this is what makes the result screen's explanation legible, don't skip fields.
   - **O-Level component**: grade the course's *required* subject combination (`AdmissionRequirement.requiredOLevelSubjects`, per the candidate's stream — science/arts/commercial), not the candidate's 5 highest-graded credits overall. "Best 5" was an earlier, incorrect assumption — see the correction note in `docs/jamb-data-dossier.md`'s UNILAG section for the full per-stream breakdown and which universities weight O-Level into the aggregate at all (UNILAG, OAU-disputed, FUTA, FUNAAB, FUOYE; UI uses O-Level only as an eligibility gate, not in the number).
4. **Catchment** — `POST /catchment/classify`. Port `classifyCatchment()`: ELDS state match first, then catchment-state-or-school-location match, else merit. Return `CatchmentResult` with the quota percentage and human-readable `reason`/`explanation` (these strings are shown directly in the UI — keep them informative, not just codes).
5. **Recommendations** — `POST /recommendations`. When a candidate falls short of the cut-off, rank alternative courses by match confidence. Port the mock's ranking heuristic first; refining the matching quality can happen later without breaking the contract (`CourseRecommendation[]` shape is fixed).
6. **Assessments** — `POST /assessments` runs verification + scoring + catchment + recommendations together for a candidate and persists an `AssessmentReport` (including the `AssessmentContext` snapshot — course/university names, cut-offs, quota percents at the time of the run, so historical reports don't drift if admin data changes later). `GET /assessments` lists the current candidate's reports; `GET /assessments/:id` fetches one.
- Every one of these endpoints also gets an `EvaluationEvent` written (module, outcome, latencyMs) — needed for Stage 6's metrics, so wire it in now rather than retrofitting.
- Verify: run a full assessment through the actual wizard UI (`src/routes/assessment/`) end-to-end against this backend, for at least one eligible and one ineligible candidate, across two different universities (to catch scoring-formula differences).

## Stage 5 — Admin CRUD

**Goal:** policy data (subjects, cut-offs, weightings, catchment/ELDS mappings) is editable without redeploying.

- `GET/POST/PATCH/DELETE` for `/admin/universities`, `/admin/courses`, `/admin/requirements`, `/admin/scoring-policies`, `/admin/catchment-rules`.
- All routes behind `requireAdmin`.
- Every mutation writes an `AdminLogEntry` (`actor`, `action`, `entity`, `summary`) — this feeds the admin activity log UI directly, not just an audit trail nobody reads.
- Validate payloads server-side even though the frontend has Zod schemas (`src/lib/validation/`) — never trust client-side validation alone.
- Verify: edit a course's cut-off through the admin UI, then re-run an assessment from Stage 4 and confirm the new cut-off is what gets applied.

## Stage 6 — Metrics & evaluation dashboard

**Goal:** `GET /admin/metrics`, `GET /admin/logs`, `GET /admin/evaluation-events`.

- `AdminMetrics` is a large aggregate shape (per-university pass rates, precision/recall/accuracy, latency time series, a recommender confusion matrix, an aggregate-score histogram). Compute it from the `EvaluationEvent` and `AssessmentReport` data accumulated since Stage 4 — this is why event logging couldn't be deferred.
- `GET /admin/logs` returns `AdminLogEntry[]` from Stage 5's writes.
- `GET /admin/evaluation-events` is paginated and filterable by `module`, `outcome`, and date range.
- This stage is naturally hollow until Stage 4 has been running for a while in a real or seeded-history environment — consider a script to backfill synthetic evaluation events for demo purposes rather than blocking on organic traffic.
- Verify: the admin metrics dashboard renders real numbers, and filtering the evaluation log by module/outcome/date narrows results correctly.

## Stage 7 — Hardening

**Goal:** production-readiness pass, not new endpoints.

- Rate limiting on `/auth/*` and the assessment-engine endpoints.
- Input validation on every route (a schema library — Zod on the server too, mirroring `src/lib/validation/` — or `express-validator`).
- Structured logging + request IDs for tracing an assessment through verify → score → classify → recommend.
- Confirm the error envelope is consistent everywhere, including validation failures (`message` as a string array is explicitly supported by the client — use it for multi-field validation errors) and thrown-but-unhandled exceptions (must not leak stack traces in production).
- Load-test the assessment endpoints against the latency targets implied by `AdminMetrics.latencyTargetMs` / `latencyTimeSeries`.
- Verify: `VITE_USE_MOCKS=false` end-to-end for the whole app, including error states (wrong password, invalid course ID, expired token) — the frontend already has UI for the rose-colored ineligible/error states, so confirm the backend actually triggers them correctly rather than 500ing.

## Suggested repo layout

```
backend/
  src/
    app.ts                  Express app wiring (middleware, routes, error handler)
    server.ts               entrypoint
    config/                 env loading
    db/                     schema, migrations, seed scripts
    middleware/             auth, requireAdmin, error handler
    modules/
      auth/
      candidates/
      catalog/               universities, courses, requirements
      eligibility/
      scoring/
      catchment/
      recommendations/
      assessments/
      admin/
      evaluation/
    lib/
      jwt.ts
      errors.ts              ApiError
```

Each `modules/<name>/` folder holds that domain's router, controller/service logic, and (once ported) the corresponding logic from `src/mocks/engine.ts` or `src/mocks/policies.ts`.

## Where to look when porting logic

| Backend concern | Reference in this repo |
|---|---|
| Eligibility rules | `src/mocks/engine.ts` → `verifyEligibility` |
| Catchment classification | `src/mocks/engine.ts` → `classifyCatchment` |
| Scoring/aggregate formula | `src/mocks/engine.ts` (scoring section) + `src/mocks/policies.ts` |
| Recommendation ranking | `src/mocks/engine.ts` (recommendation section) |
| Seed data | `docs/jamb-data-dossier.md` |
| Full request/response types | `src/types/domain.ts` |
| Error envelope + auth header format | `src/lib/http.ts` |
| Full endpoint list | root `README.md`, "Endpoints the app expects from a real backend" |
