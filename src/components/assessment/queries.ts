import { useQuery } from "@tanstack/react-query";

import { getCourseRequirements, listCourses, listUniversities } from "@/lib/api/catalog";

export function useUniversitiesQuery() {
  return useQuery({ queryKey: ["universities"], queryFn: listUniversities });
}

export function useCoursesQuery(universityId: string) {
  return useQuery({
    queryKey: ["courses", universityId],
    queryFn: () => listCourses(universityId),
    enabled: universityId.length > 0,
  });
}

export function useCourseRequirementQuery(courseId: string) {
  return useQuery({
    queryKey: ["courseRequirement", courseId],
    queryFn: () => getCourseRequirements(courseId),
    enabled: courseId.length > 0,
  });
}
