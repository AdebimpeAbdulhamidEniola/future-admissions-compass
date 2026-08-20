// Domain contract shared with the NestJS backend. Keep clean and exported.

export type UniversityCode = "UI" | "UNILAG" | "OAU" | "FUTA" | "FUNAAB" | "FUOYE";
export type OLevelGrade = "A1" | "B2" | "B3" | "C4" | "C5" | "C6" | "D7" | "E8" | "F9";
export type CatchmentStatus = "MERIT" | "CATCHMENT" | "ELDS";

export interface University {
  id: string;
  code: UniversityCode;
  name: string;
  locationState: string;
}

export interface Course {
  id: string;
  universityId: string;
  name: string;
  faculty: string;
  meritCutOff: number;
  catchmentCutOff: number;
  eldsCutOff: number;
}

export interface AdmissionRequirement {
  id: string;
  courseId: string;
  requiredUtmeSubjects: string[];
  optionalUtmeSubjects: string[];
  requiredOLevelSubjects: string[];
  minimumCredits: number;
}

export interface ScoringPolicy {
  id: string;
  universityId: string;
  utmeWeighting: number;
  postUtmeWeighting: number;
  oLevelWeighting: number;
  utmeMaxScore: number;
  postUtmeMaxScore: number;
}

export interface OLevelResult {
  subject: string;
  grade: OLevelGrade;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  stateOfOrigin: string;
  lga: string;
  schoolLocationState: string;
  utmeScore: number;
  postUtmeScore: number | null;
  utmeSubjects: string[];
  oLevelResults: OLevelResult[];
  targetCourseId: string;
  targetUniversityId: string;
}

export interface VerificationIssue {
  code: string;
  severity: "ERROR" | "WARNING";
  message: string;
  field?: string;
}

export interface VerificationResult {
  eligible: boolean;
  checkedAt: string;
  utmeSubjectCheck: { passed: boolean; missing: string[]; invalid: string[] };
  oLevelCheck: { passed: boolean; missingCredits: string[]; creditCount: number };
  issues: VerificationIssue[];
}

export interface AggregateScoreResult {
  aggregate: number;
  breakdown: {
    component: "UTME" | "POST_UTME" | "OLEVEL";
    rawScore: number;
    weighting: number;
    contribution: number;
  }[];
  formulaDescription: string;
  applicableCutOff: number;
  cutOffType: CatchmentStatus;
  meetsCutOff: boolean;
  margin: number;
}

export interface CatchmentResult {
  status: CatchmentStatus;
  reason: string;
  explanation: string;
  quotaSharePercent: number;
}

export interface CourseRecommendation {
  rank: number;
  courseId: string;
  courseName: string;
  universityCode: UniversityCode;
  faculty: string;
  matchProbability: number;
  requiredAggregate: number;
  rationale: string[];
}

export interface AssessmentContext {
  candidateName: string;
  stateOfOrigin: string;
  courseId: string;
  courseName: string;
  faculty: string;
  universityId: string;
  universityCode: UniversityCode;
  universityName: string;
  catchmentStates: string[];
  requiredUtmeSubjects: string[];
  optionalUtmeSubjects: string[];
  requiredOLevelSubjects: string[];
  minimumCredits: number;
  cutOffs: { merit: number; catchment: number; elds: number };
  quotaPercents: { merit: number; catchment: number; elds: number };
}

export interface AssessmentReport {
  id: string;
  createdAt: string;
  candidateId: string;
  verification: VerificationResult;
  score: AggregateScoreResult | null;
  catchment: CatchmentResult;
  recommendations: CourseRecommendation[];
  context: AssessmentContext;
}

// --- Auth / admin support types ---

export type UserRole = "CANDIDATE" | "ADMIN";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CatchmentRule {
  id: string;
  universityId: string;
  catchmentStates: string[];
  eldsStates: string[];
  meritQuotaPercent: number;
  catchmentQuotaPercent: number;
  eldsQuotaPercent: number;
}

export interface AdminMetrics {
  totalCandidates: number;
  assessmentsRun: number;
  eligibilityPassRate: number;
  averageAggregate: number;
  byUniversity: { code: UniversityCode; assessments: number; passRate: number }[];
  precision: number;
  recall: number;
  accuracy: number;
  meanResponseLatencyMs: number;
  latencyTargetMs: number;
  latencyTimeSeries: {
    date: string;
    verificationMs: number;
    scoringMs: number;
    catchmentMs: number;
    recommendationMs: number;
  }[];
  recommenderConfusionMatrix: {
    predicted: "MATCH" | "NO_MATCH";
    actual: "MATCH" | "NO_MATCH";
    count: number;
  }[];
  aggregateScoreHistogram: { bucket: string; count: number }[];
}

export interface AdminLogEntry {
  id: string;
  createdAt: string;
  actor: string;
  action: string;
  entity: string;
  summary: string;
}

export type EvaluationModule = "VERIFICATION" | "SCORING" | "CATCHMENT" | "RECOMMENDATION";
export type EvaluationOutcome = "SUCCESS" | "FAILURE";

export interface EvaluationEvent {
  id: string;
  timestamp: string;
  candidateId: string;
  module: EvaluationModule;
  outcome: EvaluationOutcome;
  latencyMs: number;
}
