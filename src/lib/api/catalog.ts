import { http, mockDelay, USE_MOCKS } from "@/lib/http";
import { mockUniversities } from "@/mocks/universities";
import { mockCourses } from "@/mocks/courses";
import { mockRequirements } from "@/mocks/policies";
import type { AdmissionRequirement, Course, University } from "@/types/domain";

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
