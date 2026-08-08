import type { AuthSession, CandidateProfile, AdminMetrics, AdminLogEntry } from "@/types/domain";

export const DEMO_EMAIL = "demo@idss.ng";
/** Email that always fails on the mock auth path, so error states are reachable. */
export const FAILING_EMAIL = "fail@idss.ng";

export const mockDemoSession: AuthSession = {
  accessToken: "mock.jwt.candidate-adebayo",
  user: {
    id: "user-adebayo",
    fullName: "Adebayo Ogunlesi",
    email: DEMO_EMAIL,
    phone: "08031234567",
    role: "CANDIDATE",
  },
};

export const mockAdminSession: AuthSession = {
  accessToken: "mock.jwt.admin-fatima",
  user: {
    id: "user-fatima",
    fullName: "Fatima Abdulsalam",
    email: "admin@idss.ng",
    phone: "08067654321",
    role: "ADMIN",
  },
};

export const mockCandidateProfile: CandidateProfile = {
  id: "cand-adebayo",
  fullName: "Adebayo Ogunlesi",
  email: DEMO_EMAIL,
  stateOfOrigin: "Oyo",
  lga: "Ibadan North",
  schoolLocationState: "Oyo",
  utmeScore: 286,
  postUtmeScore: 68,
  utmeSubjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
  oLevelResults: [
    { subject: "English Language", grade: "B3" },
    { subject: "Mathematics", grade: "A1" },
    { subject: "Physics", grade: "B2" },
    { subject: "Chemistry", grade: "C4" },
    { subject: "Biology", grade: "C5" },
    { subject: "Economics", grade: "B3" },
  ],
  targetCourseId: "c-ui-cs",
  targetUniversityId: "uni-ui",
};

export const mockAdminMetrics: AdminMetrics = {
  totalCandidates: 1284,
  assessmentsRun: 3172,
  eligibilityPassRate: 0.63,
  averageAggregate: 61.4,
  byUniversity: [
    { code: "UI", assessments: 812, passRate: 0.54 },
    { code: "UNILAG", assessments: 776, passRate: 0.51 },
    { code: "OAU", assessments: 623, passRate: 0.59 },
    { code: "FUTA", assessments: 431, passRate: 0.68 },
    { code: "FUNAAB", assessments: 312, passRate: 0.72 },
    { code: "FUOYE", assessments: 218, passRate: 0.77 },
  ],
};

export const mockAdminLogs: AdminLogEntry[] = [
  { id: "log-1", createdAt: "2026-07-28T09:14:00.000Z", actor: "Fatima Abdulsalam", action: "UPDATE", entity: "Course", summary: "UI Computer Science merit cut-off 70 → 71" },
  { id: "log-2", createdAt: "2026-07-27T15:02:00.000Z", actor: "Fatima Abdulsalam", action: "UPDATE", entity: "ScoringPolicy", summary: "FUOYE UTME weighting 60 → 70" },
  { id: "log-3", createdAt: "2026-07-26T11:47:00.000Z", actor: "Chinedu Okafor", action: "CREATE", entity: "AdmissionRequirement", summary: "Added requirement set for FUNAAB Crop Protection" },
  { id: "log-4", createdAt: "2026-07-24T08:20:00.000Z", actor: "Chinedu Okafor", action: "UPDATE", entity: "CatchmentRule", summary: "Added Kogi to FUOYE catchment states" },
];
