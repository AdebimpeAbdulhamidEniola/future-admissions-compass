import { http, mockDelay, mockFailure, USE_MOCKS } from "@/lib/http";
import { computeAggregate } from "@/mocks/engine";
import { mockScoringPolicies } from "@/mocks/policies";
import type { AggregateScoreResult, CandidateProfile } from "@/types/domain";

export type AggregatePayload = { candidate: CandidateProfile };

export async function aggregate(payload: AggregatePayload): Promise<AggregateScoreResult> {
  if (USE_MOCKS) {
    // Only formulas with a Post-UTME term need the score — FUNAAB, FUTA and FUOYE have none.
    const policy = mockScoringPolicies.find((p) => p.universityId === payload.candidate.targetUniversityId);
    if (payload.candidate.postUtmeScore === null && (policy?.postUtmeWeighting ?? 0) > 0) {
      return mockFailure(
        422,
        "This university's formula includes a Post-UTME component, so an aggregate cannot be computed yet.",
        "Unprocessable Entity",
      );
    }
    return mockDelay(computeAggregate(payload.candidate));
  }
  return http.post<AggregateScoreResult>("/scoring/aggregate", payload);
}
