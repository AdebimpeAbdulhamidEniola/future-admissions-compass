# UniMatch Path

PROMPT 0 — Master brief (paste this first)

Build the frontend only of an Intelligent Decision Support System (IDSS) for university admission placement in Nigeria. A separate NestJS + PostgreSQL backend is being built by me, so do not add Supabase, do not add any database, do not add any auth provider, and do not write server code. Everything must run against a mock data layer that I can later swap for real HTTP calls by flipping one flag.

What the product does

Nigerian UTME candidates applying to six federal universities in Southwest Nigeria — University of Ibadan (UI), University of Lagos (UNILAG), Obafemi Awolowo University (OAU), Federal University of Technology Akure (FUTA), Federal University of Agriculture Abeokuta (FUNAAB), and Federal University Oye-Ekiti (FUOYE) — enter their exam results and get four things back:

Eligibility verdict — does their UTME subject combination and O'Level result set satisfy the requirements for their chosen course? Pass/fail with the specific reason for each failure.

Aggregate score — composite score computed with that university's own weighting formula (UTME %, Post-UTME %, O'Level %), shown beside the published cut-off.

Catchment classification — Merit / Catchment Area / ELDS, with a plain-English explanation of what it means for their chances.

Alternative course recommendations — if they fall below the cut-off, a ranked list of other courses with a match-confidence score.

There is also an admin side for updating policy data each admission cycle: subject rules, cut-offs, scoring weightings, catchment/ELDS mappings.

Tech constraints

React + TypeScript + Vite, Tailwind, shadcn/ui, React Router, TanStack Query, react-hook-form + Zod, lucide-react icons, Recharts for charts.

No Supabase. No backend. No localStorage-dependent business logic.

All data access goes through src/lib/api/ — one module per domain (auth.ts, candidates.ts, eligibility.ts, scoring.ts, catchment.ts, recommendations.ts, admin.ts).

Each function in those modules has the shape:

ts

if (USE_MOCKS) return mockDelay(mockResult);
  return http.post<VerificationResult>('/eligibility/verify', payload);

where USE_MOCKS comes from import.meta.env.VITE_USE_MOCKS !== 'false' and http is a thin fetch wrapper reading import.meta.env.VITE_API_BASE_URL, attaching a Bearer token from an in-memory auth store, and normalising NestJS error envelopes ({ statusCode, message, error }) into a typed ApiError.

Put all TypeScript interfaces in src/types/domain.ts. They are the contract between me and the backend, so keep them clean and exported.

Mock fixtures live in src/mocks/ — realistic Nigerian names, real states, plausible scores. Simulate 400–900ms latency and include at least one mock path that fails so I can see error states.

Domain types (use exactly these names)

ts

type UniversityCode = 'UI' | 'UNILAG' | 'OAU' | 'FUTA' | 'FUNAAB' | 'FUOYE';
type OLevelGrade = 'A1'|'B2'|'B3'|'C4'|'C5'|'C6'|'D7'|'E8'|'F9';
type CatchmentStatus = 'MERIT' | 'CATCHMENT' | 'ELDS';

interface University { id: string; code: UniversityCode; name: string; locationState: string; }
interface Course { id: string; universityId: string; name: string; faculty: string; meritCutOff: number; catchmentCutOff: number; eldsCutOff: number; }
interface AdmissionRequirement { id: string; courseId: string; requiredUtmeSubjects: string[]; optionalUtmeSubjects: string[]; requiredOLevelSubjects: string[]; minimumCredits: number; }
interface ScoringPolicy { id: string; universityId: string; utmeWeighting: number; postUtmeWeighting: number; oLevelWeighting: number; utmeMaxScore: number; postUtmeMaxScore: number; }
interface OLevelResult { subject: string; grade: OLevelGrade; }
interface CandidateProfile { id: string; fullName: string; email: string; stateOfOrigin: string; lga: string; schoolLocationState: string; utmeScore: number; postUtmeScore: number | null; utmeSubjects: string[]; oLevelResults: OLevelResult[]; targetCourseId: string; targetUniversityId: string; }
interface VerificationIssue { code: string; severity: 'ERROR' | 'WARNING'; message: string; field?: string; }
interface VerificationResult { eligible: boolean; checkedAt: string; utmeSubjectCheck: { passed: boolean; missing: string[]; invalid: string[] }; oLevelCheck: { passed: boolean; missingCredits: string[]; creditCount: number }; issues: VerificationIssue[]; }
interface AggregateScoreResult { aggregate: number; breakdown: { component: 'UTME'|'POST_UTME'|'OLEVEL'; rawScore: number; weighting: number; contribution: number }[]; formulaDescription: string; applicableCutOff: number; cutOffType: CatchmentStatus; meetsCutOff: boolean; margin: number; }
interface CatchmentResult { status: CatchmentStatus; reason: string; explanation: string; quotaSharePercent: number; }
interface CourseRecommendation { rank: number; courseId: string; courseName: string; universityCode: UniversityCode; faculty: string; matchProbability: number; requiredAggregate: number; rationale: string[]; }
interface AssessmentReport { id: string; createdAt: string; candidateId: string; verification: VerificationResult; score: AggregateScoreResult | null; catchment: CatchmentResult; recommendations: CourseRecommendation[]; }

Endpoints the mock layer should mirror (so my NestJS controllers match)

POST   /auth/register              POST /auth/login              GET  /auth/me
GET    /universities               GET  /universities/:id/courses
GET    /courses/:id/requirements
POST   /candidates/profile         GET  /candidates/me           PATCH /candidates/me
POST   /eligibility/verify         POST /scoring/aggregate       POST /catchment/classify
POST   /recommendations            POST /assessments             GET  /assessments  GET /assessments/:id
GET/POST/PATCH/DELETE  /admin/universities  /admin/courses  /admin/requirements  /admin/scoring-policies  /admin/catchment-rules
GET    /admin/metrics              GET  /admin/logs

Visual direction

This is a public-service tool for 17–20 year olds, many on mid-range Android phones over patchy mobile data, some with low computer literacy. So: mobile-first, generous tap targets, plain English, no jargon without a tooltip. But it should not look like a generic dashboard template.

Palette: deep forest green #0F3D2E as primary (a quiet nod to Nigerian green, not a flag pastiche), warm ivory #FAF7F0 page background, muted clay #C2703D for warnings, deep amber #B8860B for "close to cut-off", and a restrained emerald for success. Failure states use a dignified deep rose, never alarm-red — being ineligible is not an error the user committed.

Typography: a serif display face (Fraunces or Instrument Serif) for page titles and big numbers, Inter for everything else. Big numbers matter here — the aggregate score should be the largest thing on the results page.

Cards with soft 1px borders and very subtle shadows, generous whitespace, 12px radius. No glassmorphism, no gradients-on-everything, no purple.

Every verdict is paired with an explanation. Never show a bare "Not Eligible" — always show why, and what to do about it.

Include skeleton loaders (not spinners) for every async surface, and empty states with a clear next action.

For this first prompt, set up the project shell only: routing, layout, theme tokens, the api + mocks scaffolding, the types file, an in-memory auth store, and a landing page. Do not build the inner pages yet.

PROMPT 1 — Landing + auth

Build the public landing page and the auth screens.

Landing (/): hero explaining in one sentence that the tool tells a candidate whether they qualify, what their real aggregate score is, and what else they could study — before they waste their JAMB choice. Add: a "how it works" strip with the four modules as numbered steps; a row of the six university logos-as-initials cards showing name, state, and current lowest cut-off from mock data; a short "why this exists" section citing that UI admitted 4,430 of 46,919 applicants in 2026 (≈9.4%); a footer disclaimer in a bordered callout — "This is a guidance tool. It is not affiliated with JAMB, the NUC, or any university, and its output is not an admission decision." That disclaimer must also appear on the results page.

/login and /register: react-hook-form + Zod. Register collects full name, email, phone (Nigerian format validation), password. Both call the mocked auth API, store a fake JWT in the in-memory auth store, and redirect to /onboarding. Add a RequireAuth route wrapper and a RequireAdmin wrapper. Ship a visible "Continue as demo candidate" button that logs in with a pre-filled mock profile — I need it for my project defence.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b751189c-59d3-4acb-8b63-c6fbb5085eec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
