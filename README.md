# PlaceRight

An Intelligent Decision Support System for university admission placement in Nigeria. Candidates applying to six federal universities in Southwest Nigeria — University of Ibadan (UI), University of Lagos (UNILAG), Obafemi Awolowo University (OAU), Federal University of Technology Akure (FUTA), Federal University of Agriculture Abeokuta (FUNAAB), and Federal University Oye-Ekiti (FUOYE) — get four things back from their UTME/O'Level results:

1. **Eligibility verdict** — does their UTME subject combination and O'Level result set satisfy the requirements for their chosen course?
2. **Aggregate score** — composite score computed with that university's own weighting formula, shown beside the published cut-off.
3. **Catchment classification** — Merit / Catchment Area / ELDS, with a plain-English explanation of what it means for their chances.
4. **Alternative course recommendations** — if they fall below the cut-off, a ranked list of other courses with a match-confidence score.

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
POST /auth/register          POST /auth/login              GET  /auth/me
GET  /universities           GET  /universities/:id/courses
GET  /universities/:id/scoring-policy
GET  /universities/:id/catchment-rule
GET  /courses/:id/requirements
POST /candidates/profile     GET  /candidates/me            PATCH /candidates/me
POST /eligibility/verify     POST /scoring/aggregate         POST /catchment/classify
POST /recommendations
POST /assessments             GET  /assessments               GET /assessments/:id
GET/POST/PATCH/DELETE  /admin/universities /admin/courses /admin/requirements
                        /admin/scoring-policies /admin/catchment-rules
GET  /admin/metrics            GET  /admin/logs
GET  /admin/evaluation-events  (paginated, filterable by module/outcome/date)
```

Every request/response shape is defined in `src/types/domain.ts`. A full seed-data specification (real per-university cut-offs, scoring formulas, and catchment/ELDS data, sourced and confidence-flagged) lives in [`docs/jamb-data-dossier.md`](docs/jamb-data-dossier.md).

## Design notes

Mobile-first — the target users are 17–20 year-olds, many on mid-range Android phones over patchy mobile data. Palette: deep forest green primary, warm ivory background, muted clay for warnings, deep amber for "close to cut-off". Failure states use a dignified deep rose, never alarm-red — being ineligible isn't an error the user committed. Every verdict is paired with an explanation; skeleton loaders (not spinners) are used for every async surface.
