import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Minus, Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { OLEVEL_SUBJECTS, UTME_ELECTIVE_SUBJECTS } from "@/components/assessment/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminCourses, adminRequirements, adminUniversities } from "@/lib/api/admin";
import { ApiError } from "@/lib/http";
import { cn } from "@/lib/utils";
import type { AdmissionRequirement, Course, University } from "@/types/domain";

export const Route = createFileRoute("/admin/requirements")({
  component: AdminRequirementsRoute,
});

function ChipMultiSelect({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() =>
              onChange(active ? value.filter((v) => v !== option) : [...value, option])
            }
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function CreditsStepper({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="text-numeral w-6 text-center text-lg font-semibold text-foreground">
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        disabled={value >= 9}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}

type DraftRequirement = {
  requiredUtmeSubjects: string[];
  optionalUtmeSubjects: string[];
  requiredOLevelSubjects: string[];
  minimumCredits: number;
};

function toDraft(r: AdmissionRequirement): DraftRequirement {
  return {
    requiredUtmeSubjects: r.requiredUtmeSubjects,
    optionalUtmeSubjects: r.optionalUtmeSubjects,
    requiredOLevelSubjects: r.requiredOLevelSubjects,
    minimumCredits: r.minimumCredits,
  };
}

function previewText(draft: DraftRequirement) {
  const required = draft.requiredUtmeSubjects.join(", ") || "no other compulsory subjects";
  const optional =
    draft.optionalUtmeSubjects.length > 0 ? draft.optionalUtmeSubjects.join(", ") : null;
  const credits = draft.requiredOLevelSubjects.join(", ") || "no specific subjects";

  return (
    `A candidate must offer Use of English plus ${required} in UTME` +
    (optional ? `, with ${optional} also accepted for any remaining subject.` : ".") +
    ` They must hold O'Level credits in ${credits}, with at least ${draft.minimumCredits} credit pass${draft.minimumCredits === 1 ? "" : "es"} overall.`
  );
}

function RequirementSheet({
  requirement,
  course,
  courses,
  open,
  onOpenChange,
}: {
  requirement?: AdmissionRequirement | undefined;
  course?: Course | undefined;
  courses: Course[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!requirement;

  const [courseId, setCourseId] = useState(course?.id ?? "");
  const [draft, setDraft] = useState<DraftRequirement>(
    requirement
      ? toDraft(requirement)
      : {
          requiredUtmeSubjects: [],
          optionalUtmeSubjects: [],
          requiredOLevelSubjects: [],
          minimumCredits: 5,
        },
  );

  useEffect(() => {
    if (!open) return;
    setCourseId(course?.id ?? "");
    setDraft(
      requirement
        ? toDraft(requirement)
        : {
            requiredUtmeSubjects: [],
            optionalUtmeSubjects: [],
            requiredOLevelSubjects: [],
            minimumCredits: 5,
          },
    );
  }, [open, requirement, course]);

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? adminRequirements.update(requirement.id, draft)
        : adminRequirements.create({ courseId, ...draft }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "requirements"] });
      toast.success(isEdit ? "Requirement rule updated" : "Requirement rule added");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Couldn't save. Try again.");
    },
  });

  const canSave = isEdit ? true : courseId.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full space-y-6 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? `Edit requirements — ${course?.name ?? ""}` : "Add requirement rule"}
          </SheetTitle>
          <SheetDescription>
            Define which UTME subjects and O'Level credits this course requires.
          </SheetDescription>
        </SheetHeader>

        {!isEdit && (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Course</p>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Required UTME subjects</p>
          <ChipMultiSelect
            options={UTME_ELECTIVE_SUBJECTS}
            value={draft.requiredUtmeSubjects}
            onChange={(next) => setDraft((d) => ({ ...d, requiredUtmeSubjects: next }))}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Optional / also-accepted UTME subjects
          </p>
          <ChipMultiSelect
            options={UTME_ELECTIVE_SUBJECTS.filter((s) => !draft.requiredUtmeSubjects.includes(s))}
            value={draft.optionalUtmeSubjects}
            onChange={(next) => setDraft((d) => ({ ...d, optionalUtmeSubjects: next }))}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Required O'Level credit subjects
          </p>
          <ChipMultiSelect
            options={OLEVEL_SUBJECTS}
            value={draft.requiredOLevelSubjects}
            onChange={(next) => setDraft((d) => ({ ...d, requiredOLevelSubjects: next }))}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Minimum O'Level credits overall
          </p>
          <CreditsStepper
            value={draft.minimumCredits}
            onChange={(next) => setDraft((d) => ({ ...d, minimumCredits: next }))}
          />
        </div>

        <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          {previewText(draft)}
        </div>

        <SheetFooter>
          <Button disabled={mutation.isPending || !canSave} onClick={() => mutation.mutate()}>
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function AdminRequirementsRoute() {
  const universitiesQuery = useQuery({
    queryKey: ["admin", "universities"],
    queryFn: adminUniversities.list,
  });
  const coursesQuery = useQuery({ queryKey: ["admin", "courses"], queryFn: adminCourses.list });
  const requirementsQuery = useQuery({
    queryKey: ["admin", "requirements"],
    queryFn: adminRequirements.list,
  });

  const universities = useMemo(() => universitiesQuery.data ?? [], [universitiesQuery.data]);
  const courses = useMemo(() => coursesQuery.data ?? [], [coursesQuery.data]);
  const requirements = requirementsQuery.data ?? [];

  const universityById = useMemo(() => new Map(universities.map((u) => [u.id, u])), [universities]);
  const courseById = useMemo(() => new Map(courses.map((c) => [c.id, c])), [courses]);
  const coursesWithoutRule = courses.filter((c) => !requirements.some((r) => r.courseId === c.id));

  const [sheetTarget, setSheetTarget] = useState<{
    requirement?: AdmissionRequirement | undefined;
    course?: Course | undefined;
  } | null>(null);

  const isLoading =
    universitiesQuery.isPending || coursesQuery.isPending || requirementsQuery.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Requirements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {requirements.length} subject-combination rules across the catalog.
          </p>
        </div>
        <Button
          size="sm"
          disabled={coursesWithoutRule.length === 0}
          onClick={() => setSheetTarget({})}
        >
          <Plus className="size-4" />
          Add rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Requirement rules</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Required UTME</TableHead>
                    <TableHead>Required O'Level</TableHead>
                    <TableHead className="text-right">Min credits</TableHead>
                    <TableHead className="w-16 text-right">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map((r) => {
                    const course = courseById.get(r.courseId);
                    const university = course ? universityById.get(course.universityId) : undefined;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium text-foreground">
                          {course?.name ?? "Unknown course"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {university?.code ?? "—"}
                        </TableCell>
                        <TableCell className="max-w-56 text-sm text-muted-foreground">
                          {r.requiredUtmeSubjects.join(", ") || "—"}
                        </TableCell>
                        <TableCell className="max-w-56 text-sm text-muted-foreground">
                          {r.requiredOLevelSubjects.join(", ") || "—"}
                        </TableCell>
                        <TableCell className="text-numeral text-right">
                          {r.minimumCredits}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSheetTarget({ requirement: r, course })}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <RequirementSheet
        requirement={sheetTarget?.requirement}
        course={sheetTarget?.course}
        courses={coursesWithoutRule}
        open={sheetTarget !== null}
        onOpenChange={(open) => !open && setSheetTarget(null)}
      />
    </div>
  );
}
