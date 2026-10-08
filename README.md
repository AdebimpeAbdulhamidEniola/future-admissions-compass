# PlaceRight

An Intelligent Decision Support System for university admission placement in Nigeria. Candidates applying to six federal universities in Southwest Nigeria — University of Ibadan (UI), University of Lagos (UNILAG), Obafemi Awolowo University (OAU), Federal University of Technology Akure (FUTA), Federal University of Agriculture Abeokuta (FUNAAB), and Federal University Oye-Ekiti (FUOYE) — get four things back from their UTME/O'Level results:

1. **Eligibility verdict** — does their UTME subject combination and O'Level result set satisfy the requirements for their chosen course?
2. **Aggregate score** — composite score computed with that university's own weighting formula, shown beside the published cut-off.
3. **Catchment classification** — Merit / Catchment Area / ELDS, with a plain-English explanation of what it means for their chances.
4. **Alternative course recommendations** — if they meet the subject/O'Level requirements but fall below the cut-off, a ranked list of other courses they qualify for, with a match probability from a Decision Tree model.

There's also an admin area for managing policy data each admission cycle (subject rules, cut-offs, scoring weightings, catchment/ELDS mappings) and an evaluation dashboard (precision/recall/accuracy/latency, event logs).

This repository is the **frontend only** — a React + TanStack Start app. It runs entirely against an in-memory mock data layer by default, designed to be swapped for a real backend by flipping one environment variable.

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Switching from mocks to a real backend

Copy `.env.example` to `.env` and set:

```sh
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:3000   # your backend's base URL
```

With `VITE_USE_MOCKS` unset or anything other than `"false"`, the app runs entirely on mock data (`src/mocks/`) with simulated network latency — no backend required. Every function in `src/lib/api/*` is written as:

```ts
if (USE_MOCKS) return mockDelay(mockResult);
return http.post<VerificationResult>("/eligibility/verify", payload);
```

so setting the flag to `false` switches every data call over to real HTTP requests via the `http` client in `src/lib/http.ts`, with no other code changes needed. That client attaches a `Bearer` token from the in-memory auth store and expects errors in a Nest-style envelope: `{ statusCode, message, error }`.

## Full local end-to-end setup (both repos)

The backend lives in a separate repo: `AdebimpeAbdulhamidEniola/fututre_admission_compass_be`. To run the real, non-mocked app end-to-end:

1. **Backend** (in the backend repo):
   ```sh
   git clone https://github.com/AdebimpeAbdulhamidEniola/fututre_admission_compass_be.git
   cd fututre_admission_compass_be
   npm install
   cp .env.example .env   # fill in DATABASE_URL (a real Postgres instance) and JWT_SECRET (e.g. `openssl rand -hex 32`)
   npm run db:migrate
   npm run db:seed        # loads all 6 universities, 210 courses, real cut-offs/formulas
   npm run ml:train       # optional: trains the Decision Tree recommender (the server trains one on startup if missing)
   npm run dev             # listens on :3000 by default
   ```
2. **Frontend** (in this repo):
   ```sh
   cp .env.example .env    # already has VITE_USE_MOCKS=false and VITE_API_BASE_URL=http://localhost:3000
   npm i
   npm run dev
   ```
3. **Smoke test the candidate flow** (recommendations ride along inside `/assessments`):
   - Register a new account (`POST /auth/register` via the sign-up form) — confirms auth is wired.
   - Browse universities/courses (confirms `/universities`, `/universities/:id/courses` are wired, and that IDs now come from the real seeded database, not the old mock course list).
   - Fill out the assessment wizard for any seeded course and submit — this calls `POST /assessments`, which internally runs eligibility verification, aggregate scoring, catchment classification and (for an eligible candidate below the cut-off) the Decision Tree recommender against the real Postgres data, then returns and persists the combined report.
   - Open the results page and revisit `/assessment/:id` — confirms `GET /assessments/:id` round-trips correctly.
4. **Smoke test the admin flow** (Stage 5/6, needs an `ADMIN`-role user — the register endpoint only ever creates `CANDIDATE`s, so promote one directly in the database, e.g. `UPDATE users SET role = 'ADMIN' WHERE email = '...'`, or via `npm run db:studio` in the backend):
   - Sign in as that admin and open the admin area — list/create/edit/delete a course or university, confirming `/admin/*` CRUD and that each mutation appears in the logs.
   - Open the evaluation dashboard — `totalCandidates`, `assessmentsRun`, `eligibilityPassRate`, `averageAggregate`, `byUniversity`, and the latency time series should reflect whatever candidate activity you generated in step 3. `precision`/`recall`/`accuracy` and the confusion matrix are the Decision Tree recommender's scores on its held-out test data.

Things worth knowing going in:
- **FUNAAB publishes only raw JAMB cut-offs (0–400)**, so FUNAAB candidates are judged on their UTME score against that cut-off; their 0–100 aggregate is still shown.
- A blank Post-UTME score only blocks the aggregate for universities whose formula includes Post-UTME (UI, UNILAG, OAU): `/scoring/aggregate` 422s and `/assessments` stores `score: null` there. FUNAAB, FUTA and FUOYE score without one.

Neither of us has actually run this end-to-end yet — this sandbox can't reach the npm registry to install dependencies or start either server, so this is the first real test.

## Folder structure

```
src/
  components/
    assessment/   Assessment wizard steps, results-screen sections, schema/mappers
    auth/          RequireAuth / RequireAdmin route guards
    layout/        Site header, offline banner
    ui/            shadcn/ui primitives
  hooks/           useAuth and other shared hooks
  lib/
    api/           One module per domain — the full backend contract (see below)
    validation/    Zod schemas shared across forms
    auth-store.ts  In-memory session store (no localStorage)
    http.ts        Fetch wrapper: base URL, auth header, error normalization
  mocks/           Mock fixtures and the eligibility/scoring/catchment/recommendation engine
  routes/          TanStack Router file-based routes
    admin/         Admin CRUD, metrics dashboard, evaluation logs
    assessment/    Wizard + results pages
    universities/  Public university/course explorer
  types/
    domain.ts      Every shared TypeScript interface — the contract with the backend
```

## Endpoints the app expects from a real backend

```
POST /auth/register          POST /auth/login              GET  /auth/me                  ✅ implemented
GET  /universities           GET  /universities/:id/courses                               ✅ implemented
GET  /universities/:id/scoring-policy
GET  /universities/:id/catchment-rule
GET  /courses/:id/requirements
POST /candidates/profile     GET  /candidates/me            PATCH /candidates/me           ✅ implemented
POST /eligibility/verify     POST /scoring/aggregate         POST /catchment/classify       ✅ implemented
POST /assessments             GET  /assessments               GET /assessments/:id          ✅ implemented (bundles verification+score+catchment+recommendations)
POST /recommendations                                                                       ✅ implemented (ml-cart Decision Tree) — the UI uses the copy bundled inside /assessments
GET/POST/PATCH/DELETE  /admin/universities /admin/courses /admin/requirements                ✅ implemented (Stage 5)
                        /admin/scoring-policies /admin/catchment-rules
GET  /admin/metrics            GET  /admin/logs                                             ✅ implemented (Stage 6) — precision/recall/accuracy/recommenderConfusionMatrix
GET  /admin/evaluation-events  (paginated, filterable by module/outcome/date)                come from the recommender's held-out test split
```

✅ = implemented on the backend at `AdebimpeAbdulhamidEniola/fututre_admission_compass_be`, matching the frontend's expected request/response shape exactly (verified field-by-field against `src/types/domain.ts`). The full endpoint list above is implemented, including Stage 8 (the ML Decision Tree recommender). Stage 7 (hardening) and some seed data are what's left; see the backend's own README.

Every request/response shape is defined in `src/types/domain.ts`. A full seed-data specification (real per-university cut-offs, scoring formulas, and catchment/ELDS data, sourced and confidence-flagged) lives in [`docs/jamb-data-dossier.md`](docs/jamb-data-dossier.md).

## Design notes

Mobile-first — the target users are 17–20 year-olds, many on mid-range Android phones over patchy mobile data. Palette: deep forest green primary, warm ivory background, muted clay for warnings, deep amber for "close to cut-off". Failure states use a dignified deep rose, never alarm-red — being ineligible isn't an error the user committed. Every verdict is paired with an explanation; skeleton loaders (not spinners) are used for every async surface.
