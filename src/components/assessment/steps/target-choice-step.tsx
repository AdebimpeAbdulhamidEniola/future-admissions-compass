import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { Combobox } from "../combobox";
import { QueryError } from "../query-error";
import { useCourseRequirementQuery, useCoursesQuery, useUniversitiesQuery } from "../queries";
import { useAssessmentWizard } from "../wizard-context";
import { UniversityLogo } from "@/components/brand/university-logo";

export function TargetChoiceStep() {
  const { form } = useAssessmentWizard();
  const universitiesQuery = useUniversitiesQuery();
  const universities = universitiesQuery.data ?? [];

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
        <p className="mt-1 text-sm text-muted-foreground">
          Pick the university and course you're aiming for.
        </p>
      </div>

      <FormField
        control={form.control}
        name="targetUniversityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>University</FormLabel>
            {universitiesQuery.isError && (
              <QueryError
                title="We couldn't load the universities"
                error={universitiesQuery.error}
                onRetry={() => void universitiesQuery.refetch()}
                retrying={universitiesQuery.isFetching}
              />
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {universitiesQuery.isPending &&
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[74px] rounded-xl" />
                ))}
              {universities.map((university) => {
                const isSelected = field.value === university.id;

                return (
                  <button
                    key={university.id}
                    type="button"
                    onClick={() => field.onChange(university.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors hover:border-primary/60",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <UniversityLogo
                        code={university.code}
                        name={university.name}
                        className="size-10"
                      />
                      <div>
                        <p className="font-medium text-foreground">{university.name}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {university.locationState} State
                        </p>
                      </div>
                    </div>
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
                options={(coursesQuery.data ?? []).map((course) => ({
                  value: course.id,
                  label: course.name,
                }))}
                value={field.value}
                onChange={field.onChange}
                disabled={!universityId || coursesQuery.isPending || coursesQuery.isError}
                placeholder={
                  !universityId
                    ? "Choose a university first"
                    : coursesQuery.isPending
                      ? "Loading courses…"
                      : "Search for a course"
                }
                emptyText="No courses found."
              />
            </FormControl>
            {universityId && coursesQuery.isError && (
              <QueryError
                title="We couldn't load the courses for this university"
                error={coursesQuery.error}
                onRetry={() => void coursesQuery.refetch()}
                retrying={coursesQuery.isFetching}
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedCourse && requirementQuery.isPending && <Skeleton className="h-40 rounded-xl" />}

      {selectedCourse && requirementQuery.isError && (
        <QueryError
          title={`We couldn't load the requirements for ${selectedCourse.name}`}
          error={requirementQuery.error}
          onRetry={() => void requirementQuery.refetch()}
          retrying={requirementQuery.isFetching}
        />
      )}

      {selectedCourse && requirementQuery.data && (
        <Card className="p-4">
          <p className="font-medium text-foreground">{selectedCourse.name} — requirements</p>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                Required UTME subjects
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {requirementQuery.data.requiredUtmeSubjects.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                Required O'Level subjects
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {requirementQuery.data.requiredOLevelSubjects.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                Minimum credits
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {requirementQuery.data.minimumCredits}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Cut-offs</dt>
              <dd className="mt-1 text-sm text-foreground">
                Merit {selectedCourse.meritCutOff ?? "not yet confirmed"} · Catchment{" "}
                {selectedCourse.catchmentCutOff ?? "not yet confirmed"} · ELDS{" "}
                {selectedCourse.eldsCutOff ?? "not yet confirmed"}
              </dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}
