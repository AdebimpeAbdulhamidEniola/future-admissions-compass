import { http, mockDelay, USE_MOCKS } from "@/lib/http";
import { classifyCatchment } from "@/mocks/engine";
import type { CandidateProfile, CatchmentResult } from "@/types/domain";

export type ClassifyPayload = { candidate: CandidateProfile };

export async function classify(payload: ClassifyPayload): Promise<CatchmentResult> {
  if (USE_MOCKS) return mockDelay(classifyCatchment(payload.candidate));
  return http.post<CatchmentResult>("/catchment/classify", payload);
}
