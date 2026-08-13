import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus, TrendingUp, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminCourses, adminUniversities } from "@/lib/api/admin";
import { ApiError } from "@/lib/http";
import type { Course, University } from "@/types/domain";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCoursesRoute,
});

const ALL = "all";

function CutoffInput({
  course,
  field,
}: {
  course: Course;
  field: "meritCutOff" | "catchmentCutOff" | "eldsCutOff";
}) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(String(course[field]));

  useEffect(() => setValue(String(course[field])), [course, field]);

  const mutation = useMutation({
    mutationFn: (next: number) => adminCourses.update(course.id, { [field]: next }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success(`${course.name} updated`);
    },
    onError: () => {
      toast.error("Couldn't save that cut-off. Try again.");
      setValue(String(course[field]));
    },
  });

  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        const next = Number(value);
        if (!Number.isFinite(next) || next === course[field]) {
          setValue(String(course[field]));
          return;
        }
        mutation.mutate(next);
      }}
      className="text-numeral h-8 w-20 text-right"
    />
  );
}

const courseSchema = z.object({
  universityId: z.string().min(1, "Select a university"),
  name: z.string().trim().min(2, "Enter a course name"),
  faculty: z.string().trim().min(2, "Enter a faculty"),
  meritCutOff: z.number().min(0).max(400),
  catchmentCutOff: z.number().min(0).max(400),
  eldsCutOff: z.number().min(0).max(400),
});
type CourseValues = z.infer<typeof courseSchema>;

function CourseFormDialog({
  course,
  universities,
  trigger,
}: {
  course?: Course;
  universities: University[];
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = !!course;

  const defaults: CourseValues = course
    ? {
        universityId: course.universityId,
        name: course.name,
        faculty: course.faculty,
        meritCutOff: course.meritCutOff,
        catchmentCutOff: course.catchmentCutOff,
        eldsCutOff: course.eldsCutOff,
      }
    : {
        universityId: "",
        name: "",
        faculty: "",
        meritCutOff: 60,
        catchmentCutOff: 57,
        eldsCutOff: 54,
      };

  const form = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) form.reset(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const mutation = useMutation({
    mutationFn: (values: CourseValues) =>
      isEdit ? adminCourses.update(course.id, values) : adminCourses.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success(isEdit ? "Course updated" : "Course added");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Couldn't save. Try again.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit course" : "Add course"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this course's details." : "Add a new course to a university."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
            <FormField
              control={form.control}
              name="universityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universities.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.code} — {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { name: "meritCutOff", label: "Merit" },
                  { name: "catchmentCutOff", label: "Catchment" },
                  { name: "eldsCutOff", label: "ELDS" },
                ] as const
              ).map((f) => (
                <FormField
                  key={f.name}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{f.label}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={Number.isNaN(field.value) ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCourseButton({ course }: { course: Course }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => adminCourses.remove(course.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success("Course deleted");
    },
    onError: () => toast.error("Couldn't delete. Try again."),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="size-3.5 text-ineligible" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {course.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the course and its cut-offs from the catalog. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-ineligible text-ineligible-foreground hover:bg-ineligible/90"
            onClick={() => mutation.mutate()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function BulkCutoffUpdate({ courses }: { courses: Course[] }) {
  const [delta, setDelta] = useState("0");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (d: number) => {
      await Promise.all(
        courses.map((c) =>
          adminCourses.update(c.id, {
            meritCutOff: Math.max(0, c.meritCutOff + d),
            catchmentCutOff: Math.max(0, c.catchmentCutOff + d),
            eldsCutOff: Math.max(0, c.eldsCutOff + d),
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success(
        `Cut-offs updated for ${courses.length} course${courses.length === 1 ? "" : "s"}`,
      );
      setOpen(false);
    },
    onError: () => toast.error("Couldn't apply the bulk update. Try again."),
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={courses.length === 0}>
          <TrendingUp className="size-4" />
          Bulk update cut-offs ({courses.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bulk cut-off adjustment</AlertDialogTitle>
          <AlertDialogDescription>
            Applies to all {courses.length} course{courses.length === 1 ? "" : "s"} matching your
            current filters — adjusts merit, catchment, and ELDS cut-offs by the same amount for a
            new admission cycle.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2">
          <label htmlFor="bulk-delta" className="text-sm text-muted-foreground">
            Adjustment
          </label>
          <Input
            id="bulk-delta"
            type="number"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            className="w-24"
            placeholder="e.g. -2"
          />
          <span className="text-sm text-muted-foreground">
            points (use a negative number to lower)
          </span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending || !Number.isFinite(Number(delta)) || Number(delta) === 0}
            onClick={() => mutation.mutate(Number(delta))}
          >
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Apply
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminCoursesRoute() {
  const universitiesQuery = useQuery({
    queryKey: ["admin", "universities"],
    queryFn: adminUniversities.list,
  });
  const coursesQuery = useQuery({ queryKey: ["admin", "courses"], queryFn: adminCourses.list });

  const universities = useMemo(() => universitiesQuery.data ?? [], [universitiesQuery.data]);
  const courses = useMemo(() => coursesQuery.data ?? [], [coursesQuery.data]);
  const universityById = useMemo(() => new Map(universities.map((u) => [u.id, u])), [universities]);

  const [universityFilter, setUniversityFilter] = useState(ALL);
  const [facultyFilter, setFacultyFilter] = useState(ALL);

  const faculties = useMemo(() => [...new Set(courses.map((c) => c.faculty))].sort(), [courses]);

  const filtered = courses.filter(
    (c) =>
      (universityFilter === ALL || c.universityId === universityFilter) &&
      (facultyFilter === ALL || c.faculty === facultyFilter),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {courses.length} tracked across the catalog.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BulkCutoffUpdate courses={filtered} />
          <CourseFormDialog
            universities={universities}
            trigger={
              <Button size="sm">
                <Plus className="size-4" />
                Add course
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={universityFilter} onValueChange={setUniversityFilter}>
          <SelectTrigger className="h-8 w-auto min-w-40 text-xs">
            <SelectValue placeholder="University" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All universities</SelectItem>
            {universities.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={facultyFilter} onValueChange={setFacultyFilter}>
          <SelectTrigger className="h-8 w-auto min-w-40 text-xs">
            <SelectValue placeholder="Faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All faculties</SelectItem>
            {faculties.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {coursesQuery.isPending || universitiesQuery.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead className="text-right">Merit</TableHead>
                    <TableHead className="text-right">Catchment</TableHead>
                    <TableHead className="text-right">ELDS</TableHead>
                    <TableHead className="w-20 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium text-foreground">{course.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {universityById.get(course.universityId)?.code ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{course.faculty}</TableCell>
                      <TableCell className="text-right">
                        <CutoffInput course={course} field="meritCutOff" />
                      </TableCell>
                      <TableCell className="text-right">
                        <CutoffInput course={course} field="catchmentCutOff" />
                      </TableCell>
                      <TableCell className="text-right">
                        <CutoffInput course={course} field="eldsCutOff" />
                      </TableCell>
                      <TableCell className="text-right">
                        <CourseFormDialog
                          course={course}
                          universities={universities}
                          trigger={
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          }
                        />
                        <DeleteCourseButton course={course} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
