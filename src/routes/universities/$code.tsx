import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpDown, Scale, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { COMPONENT_COLOR, COMPONENT_LABEL } from "@/components/assessment/results/constants";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCatchmentRule,
  getCourseRequirements,
  getScoringPolicy,
  listCourses,
  listUniversities,
} from "@/lib/api/catalog";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/domain";

export const Route = createFileRoute("/universities/$code")({
  head: ({ params }) => ({
    meta: [{ title: `${params.code} — PlaceRight` }],
  }),
  component: UniversityDetailRoute,
});

type SortKey = "name" | "faculty" | "meritCutOff" | "catchmentCutOff" | "eldsCutOff";
const MAX_COMPARE = 3;

function SortableHead({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: "asc" | "desc";
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const isActive = activeKey === sortKey;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium uppercase tracking-wide hover:text-foreground",
          isActive && "text-foreground",
        )}
      >
        {label}
        <ArrowUpDown className={cn("size-3", isActive ? "opacity-100" : "opacity-30")} />
        {isActive && (
          <span className="sr-only">
            , sorted {direction === "asc" ? "ascending" : "descending"}
          </span>
        )}
      </button>
    </TableHead>
  );
}

function UniversityDetailRoute() {
  const { code } = Route.useParams();

  const universitiesQuery = useQuery({ queryKey: ["universities"], queryFn: listUniversities });
  const university = universitiesQuery.data?.find((u) => u.code === code.toUpperCase());

  const coursesQuery = useQuery({
    queryKey: ["courses", university?.id],
    queryFn: () => listCourses(university!.id),
    enabled: !!university,
  });
  const policyQuery = useQuery({
    queryKey: ["scoringPolicy", university?.id],
    queryFn: () => getScoringPolicy(university!.id),
    enabled: !!university,
  });
  const catchmentQuery = useQuery({
    queryKey: ["catchmentRule", university?.id],
    queryFn: () => getCatchmentRule(university!.id),
    enabled: !!university,
  });

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const courses = useMemo(() => coursesQuery.data ?? [], [coursesQuery.data]);

  const visibleCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? courses.filter(
          (c) => c.name.toLowerCase().includes(term) || c.faculty.toLowerCase().includes(term),
        )
      : courses;
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name" || sortKey === "faculty") {
        return a[sortKey].localeCompare(b[sortKey]) * dir;
      }
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return sorted;
  }, [courses, search, sortDir, sortKey]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleSelected(courseId: string) {
    setSelectedIds((prev) => {
      if (prev.includes(courseId)) return prev.filter((id) => id !== courseId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, courseId];
    });
  }

  const selectedCourses = courses.filter((c) => selectedIds.includes(c.id));

  if (universitiesQuery.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-12">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="font-display text-xl font-semibold text-foreground">
            University not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            "{code}" doesn't match any university we track.{" "}
            <Link to="/universities" className="text-primary underline">
              Back to the university list
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const policy = policyQuery.data;
  const catchmentRule = catchmentQuery.data;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:py-14">
        <div>
          <Link
            to="/universities"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All universities
          </Link>
          <div className="mt-3 flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 font-display text-lg font-semibold text-primary">
              {university.code}
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                {university.name}
              </h1>
              <p className="text-sm text-muted-foreground">{university.locationState} State</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Scoring formula</CardTitle>
          </CardHeader>
          <CardContent>
            {policy ? (
              <>
                <div className="flex h-8 w-full overflow-hidden rounded-full bg-muted">
                  {[
                    { component: "UTME" as const, weighting: policy.utmeWeighting },
                    { component: "POST_UTME" as const, weighting: policy.postUtmeWeighting },
                    { component: "OLEVEL" as const, weighting: policy.oLevelWeighting },
                  ].map((seg) => (
                    <div
                      key={seg.component}
                      className="flex h-full items-center justify-center border-r-2 border-card text-[11px] font-medium text-white last:border-r-0"
                      style={{
                        width: `${seg.weighting}%`,
                        background: COMPONENT_COLOR[seg.component],
                      }}
                    >
                      {seg.weighting >= 12 ? `${seg.weighting}%` : ""}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: COMPONENT_COLOR.UTME }}
                    />
                    {COMPONENT_LABEL.UTME} {policy.utmeWeighting}% (out of {policy.utmeMaxScore})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: COMPONENT_COLOR.POST_UTME }}
                    />
                    {COMPONENT_LABEL.POST_UTME} {policy.postUtmeWeighting}% (out of{" "}
                    {policy.postUtmeMaxScore})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: COMPONENT_COLOR.OLEVEL }}
                    />
                    {COMPONENT_LABEL.OLEVEL} {policy.oLevelWeighting}%
                  </span>
                </div>
              </>
            ) : (
              <Skeleton className="h-8 w-full rounded-full" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Catchment states</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {catchmentRule ? (
              <>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Catchment states ({catchmentRule.meritQuotaPercent}% merit ·{" "}
                    {catchmentRule.catchmentQuotaPercent}% catchment ·{" "}
                    {catchmentRule.eldsQuotaPercent}% ELDS quota)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {catchmentRule.catchmentStates.map((state) => (
                      <Badge key={state} variant="secondary">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    ELDS states (nationwide list)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {catchmentRule.eldsStates.map((state) => (
                      <Badge key={state} variant="outline">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Skeleton className="h-16 w-full" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Courses</CardTitle>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search course or faculty"
                  className="pl-8"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={selectedIds.length < 2}
                onClick={() => setCompareOpen(true)}
              >
                <Scale className="size-4" />
                Compare selected ({selectedIds.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {coursesQuery.isPending ? (
              <Skeleton className="h-48 w-full" />
            ) : visibleCourses.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No courses match "{search}".
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <span className="sr-only">Compare</span>
                      </TableHead>
                      <SortableHead
                        label="Course"
                        sortKey="name"
                        activeKey={sortKey}
                        direction={sortDir}
                        onSort={toggleSort}
                      />
                      <SortableHead
                        label="Faculty"
                        sortKey="faculty"
                        activeKey={sortKey}
                        direction={sortDir}
                        onSort={toggleSort}
                      />
                      <SortableHead
                        label="Merit"
                        sortKey="meritCutOff"
                        activeKey={sortKey}
                        direction={sortDir}
                        onSort={toggleSort}
                        className="text-right"
                      />
                      <SortableHead
                        label="Catchment"
                        sortKey="catchmentCutOff"
                        activeKey={sortKey}
                        direction={sortDir}
                        onSort={toggleSort}
                        className="text-right"
                      />
                      <SortableHead
                        label="ELDS"
                        sortKey="eldsCutOff"
                        activeKey={sortKey}
                        direction={sortDir}
                        onSort={toggleSort}
                        className="text-right"
                      />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleCourses.map((course) => {
                      const checked = selectedIds.includes(course.id);
                      const disableCheck = !checked && selectedIds.length >= MAX_COMPARE;
                      return (
                        <TableRow key={course.id}>
                          <TableCell>
                            <Checkbox
                              checked={checked}
                              disabled={disableCheck}
                              onCheckedChange={() => toggleSelected(course.id)}
                              aria-label={`Select ${course.name} to compare`}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {course.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{course.faculty}</TableCell>
                          <TableCell className="text-numeral text-right">
                            {course.meritCutOff}
                          </TableCell>
                          <TableCell className="text-numeral text-right">
                            {course.catchmentCutOff}
                          </TableCell>
                          <TableCell className="text-numeral text-right">
                            {course.eldsCutOff}
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
      </main>

      <SiteFooter />

      <CourseComparisonDialog
        open={compareOpen}
        onOpenChange={setCompareOpen}
        courses={selectedCourses}
      />
    </div>
  );
}

function CourseComparisonDialog({
  open,
  onOpenChange,
  courses,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
}) {
  const requirementQueries = useQueries({
    queries: courses.map((course) => ({
      queryKey: ["courseRequirement", course.id],
      queryFn: () => getCourseRequirements(course.id),
      enabled: open,
    })),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare courses</DialogTitle>
          <DialogDescription>Requirements and cut-offs, side by side.</DialogDescription>
        </DialogHeader>

        {requirementQueries.some((q) => q.isPending) ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Requirement</TableHead>
                  {courses.map((course) => (
                    <TableHead key={course.id} className="min-w-40">
                      {course.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">Faculty</TableCell>
                  {courses.map((c) => (
                    <TableCell key={c.id}>{c.faculty}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">Merit cut-off</TableCell>
                  {courses.map((c) => (
                    <TableCell key={c.id} className="text-numeral">
                      {c.meritCutOff}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">
                    Catchment cut-off
                  </TableCell>
                  {courses.map((c) => (
                    <TableCell key={c.id} className="text-numeral">
                      {c.catchmentCutOff}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">ELDS cut-off</TableCell>
                  {courses.map((c) => (
                    <TableCell key={c.id} className="text-numeral">
                      {c.eldsCutOff}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="align-top font-medium text-muted-foreground">
                    Required UTME subjects
                  </TableCell>
                  {requirementQueries.map((q, i) => (
                    <TableCell key={courses[i]?.id} className="align-top text-sm">
                      {q.data?.requiredUtmeSubjects.join(", ") || "—"}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="align-top font-medium text-muted-foreground">
                    Required O'Level subjects
                  </TableCell>
                  {requirementQueries.map((q, i) => (
                    <TableCell key={courses[i]?.id} className="align-top text-sm">
                      {q.data?.requiredOLevelSubjects.join(", ") || "—"}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">
                    Minimum credits
                  </TableCell>
                  {requirementQueries.map((q, i) => (
                    <TableCell key={courses[i]?.id} className="text-numeral">
                      {q.data?.minimumCredits ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
