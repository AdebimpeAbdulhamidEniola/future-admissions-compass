import { http, mockDelay, USE_MOCKS } from "@/lib/http";
import { recommendCourses } from "@/mocks/engine";
import type { CandidateProfile, CourseRecommendation } from "@/types/domain";

export type RecommendPayload = { candidate: CandidateProfile; limit?: number };

export async function recommend(payload: RecommendPayload): Promise<CourseRecommendation[]> {
  if (USE_MOCKS) {
    const all = recommendCourses(payload.candidate);
    return mockDelay(payload.limit ? all.slice(0, payload.limit) : all);
  }
  return http.post<CourseRecommendation[]>("/recommendations", payload);
}
