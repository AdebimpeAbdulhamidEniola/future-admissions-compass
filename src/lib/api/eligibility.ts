import { http, mockDelay, USE_MOCKS } from "@/lib/http";
import { verifyEligibility } from "@/mocks/engine";
import type { CandidateProfile, VerificationResult } from "@/types/domain";

export type VerifyEligibilityPayload = {
  candidate: CandidateProfile;
};

export async function verify(payload: VerifyEligibilityPayload): Promise<VerificationResult> {
  if (USE_MOCKS) return mockDelay(verifyEligibility(payload.candidate));
  return http.post<VerificationResult>("/eligibility/verify", payload);
}
