import { http, mockDelay, USE_MOCKS } from "@/lib/http";
import { mockUniversities } from "@/mocks/universities";
import { mockCourses } from "@/mocks/courses";
import { mockCatchmentRules, mockRequirements, mockScoringPolicies } from "@/mocks/policies";
import type {
  AdmissionRequirement,
  CatchmentRule,
  Course,
  ScoringPolicy,
  University,
} from "@/types/domain";

export async function listUniversities(): Promise<University[]> {
  if (USE_MOCKS) return mockDelay(mockUniversities);
  return http.get<University[]>("/universities");
}

export async function listCourses(universityId: string): Promise<Course[]> {
  if (USE_MOCKS) return mockDelay(mockCourses.filter((c) => c.universityId === universityId));
  return http.get<Course[]>(`/universities/${universityId}/courses`);
}

export async function getCourseRequirements(courseId: string): Promise<AdmissionRequirement> {
  if (USE_MOCKS) {
    return mockDelay(mockRequirements.find((r) => r.courseId === courseId)!);
  }
  return http.get<AdmissionRequirement>(`/courses/${courseId}/requirements`);
}

export async function getScoringPolicy(universityId: string): Promise<ScoringPolicy> {
  if (USE_MOCKS) {
    return mockDelay(mockScoringPolicies.find((p) => p.universityId === universityId)!);
  }
  return http.get<ScoringPolicy>(`/universities/${universityId}/scoring-policy`);
}

export async function getCatchmentRule(universityId: string): Promise<CatchmentRule> {
  if (USE_MOCKS) {
    return mockDelay(mockCatchmentRules.find((r) => r.universityId === universityId)!);
  }
  return http.get<CatchmentRule>(`/universities/${universityId}/catchment-rule`);
}
