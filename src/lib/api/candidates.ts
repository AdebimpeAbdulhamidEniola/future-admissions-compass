import { http, mockDelay, mockFailure, USE_MOCKS } from "@/lib/http";
import { mockCandidateProfile } from "@/mocks/candidates";
import type { CandidateProfile } from "@/types/domain";

// In-memory mock store so the wizard can write then read back.
let current: CandidateProfile | null = mockCandidateProfile;

export async function createProfile(
  payload: Omit<CandidateProfile, "id">,
): Promise<CandidateProfile> {
  if (USE_MOCKS) {
    current = { ...payload, id: `cand-${Date.now()}` };
    return mockDelay(current);
  }
  return http.post<CandidateProfile>("/candidates/profile", payload);
}

export async function getMyProfile(): Promise<CandidateProfile> {
  if (USE_MOCKS) {
    if (!current) return mockFailure(404, "You have not created a candidate profile yet.", "Not Found");
    return mockDelay(current);
  }
  return http.get<CandidateProfile>("/candidates/me");
}

export async function updateMyProfile(
  payload: Partial<CandidateProfile>,
): Promise<CandidateProfile> {
  if (USE_MOCKS) {
    if (!current) return mockFailure(404, "You have not created a candidate profile yet.", "Not Found");
    current = { ...current, ...payload };
    return mockDelay(current);
  }
  return http.patch<CandidateProfile>("/candidates/me", payload);
}
