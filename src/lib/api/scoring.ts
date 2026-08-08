import { http, mockDelay, mockFailure, USE_MOCKS } from "@/lib/http";
import { computeAggregate } from "@/mocks/engine";
import type { AggregateScoreResult, CandidateProfile } from "@/types/domain";

export type AggregatePayload = { candidate: CandidateProfile };

export async function aggregate(payload: AggregatePayload): Promise<AggregateScoreResult> {
  if (USE_MOCKS) {
    if (payload.candidate.postUtmeScore === null) {
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
