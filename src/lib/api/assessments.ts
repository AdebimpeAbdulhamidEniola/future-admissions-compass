import { http, mockDelay, mockFailure, USE_MOCKS } from "@/lib/http";
import {
  buildAssessmentContext,
  classifyCatchment,
  computeAggregate,
  recommendCourses,
  verifyEligibility,
} from "@/mocks/engine";
import type { AssessmentReport, CandidateProfile } from "@/types/domain";

const store: AssessmentReport[] = [];

export type CreateAssessmentPayload = { candidate: CandidateProfile };

export async function createAssessment(
  payload: CreateAssessmentPayload,
): Promise<AssessmentReport> {
  if (USE_MOCKS) {
    const candidate = payload.candidate;
    const verification = verifyEligibility(candidate);
    const report: AssessmentReport = {
      id: `asm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      candidateId: candidate.id,
      verification,
      score: candidate.postUtmeScore === null ? null : computeAggregate(candidate),
      catchment: classifyCatchment(candidate),
      recommendations: recommendCourses(candidate),
      context: buildAssessmentContext(candidate),
    };
    store.unshift(report);
    return mockDelay(report);
  }
  return http.post<AssessmentReport>("/assessments", payload);
}

export async function listAssessments(): Promise<AssessmentReport[]> {
  if (USE_MOCKS) return mockDelay(store);
  return http.get<AssessmentReport[]>("/assessments");
}

export async function getAssessment(id: string): Promise<AssessmentReport> {
  if (USE_MOCKS) {
    const found = store.find((a) => a.id === id);
    if (!found) return mockFailure(404, "That assessment report could not be found.", "Not Found");
    return mockDelay(found);
  }
  return http.get<AssessmentReport>(`/assessments/${id}`);
}
