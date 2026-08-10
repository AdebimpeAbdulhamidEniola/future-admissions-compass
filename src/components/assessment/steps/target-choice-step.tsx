import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { listCourses } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { Combobox } from "../combobox";
import { useCourseRequirementQuery, useCoursesQuery, useUniversitiesQuery } from "../queries";
import { useAssessmentWizard } from "../wizard-context";

export function TargetChoiceStep() {
  const { form } = useAssessmentWizard();
  const universitiesQuery = useUniversitiesQuery();
  const universities = universitiesQuery.data ?? [];

  const facultyCountQueries = useQueries({
    queries: universities.map((university) => ({
      queryKey: ["courses", university.id],
      queryFn: () => listCourses(university.id),
    })),
  });

  const universityId = form.watch("targetUniversityId");
  const courseId = form.watch("targetCourseId");

  const coursesQuery = useCoursesQuery(universityId);
  const requirementQuery = useCourseRequirementQuery(courseId);

  const selectedCourse = coursesQuery.data?.find((course) => course.id === courseId);

  // Clear the course whenever it no longer belongs to the currently selected university's
  // course list (e.g. the candidate switched universities after already picking a course).
  useEffect(() => {
    if (!coursesQuery.data) return;
    if (courseId && !coursesQuery.data.some((course) => course.id === courseId)) {
      form.setValue("targetCourseId", "", { shouldValidate: false });
    }
  }, [coursesQuery.data, courseId, form]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Target choice</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick the university and course you're aiming for.</p>
      </div>

      <FormField
        control={form.control}
        name="targetUniversityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>University</FormLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {universities.map((university, index) => {
                const courseResult = facultyCountQueries[index];
                const facultyCount = courseResult?.data
                  ? new Set(courseResult.data.map((course) => course.faculty)).size
                  : undefined;
                const isSelected = field.value === university.id;

                return (
                  <button
                    key={university.id}
                    type="button"
                    onClick={() => field.onChange(university.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors hover:border-primary/60",
                      isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card",
                    )}
                  >
                    <p className="font-medium text-foreground">{university.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{university.locationState} State</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {facultyCount === undefined ? <Skeleton className="h-3 w-20" /> : `${facultyCount} faculties`}
                    </p>
                  </button>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="targetCourseId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course</FormLabel>
            <FormControl>
              <Combobox
                options={(coursesQuery.data ?? []).map((course) => ({ value: course.id, label: course.name }))}
                value={field.value}
                onChange={field.onChange}
                disabled={!universityId}
                placeholder={universityId ? "Search for a course" : "Choose a university first"}
                emptyText="No courses found."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedCourse && requirementQuery.data && (
        <Card className="p-4">
          <p className="font-medium text-foreground">{selectedCourse.name} — requirements</p>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Required UTME subjects</dt>
              <dd className="mt-1 text-sm text-foreground">{requirementQuery.data.requiredUtmeSubjects.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Required O'Level subjects</dt>
              <dd className="mt-1 text-sm text-foreground">{requirementQuery.data.requiredOLevelSubjects.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Minimum credits</dt>
              <dd className="mt-1 text-sm text-foreground">{requirementQuery.data.minimumCredits}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Cut-offs</dt>
              <dd className="mt-1 text-sm text-foreground">
                Merit {selectedCourse.meritCutOff} · Catchment {selectedCourse.catchmentCutOff} · ELDS{" "}
                {selectedCourse.eldsCutOff}
              </dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}
