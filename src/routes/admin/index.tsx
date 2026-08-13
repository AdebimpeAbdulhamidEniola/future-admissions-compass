import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import {
  adminCourses,
  adminRequirements,
  adminScoringPolicies,
  adminUniversities,
  getLogs,
} from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewRoute,
});

function StatCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: number;
  isLoading: boolean;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-16" />
      ) : (
        <p className="text-numeral mt-1 text-3xl font-semibold text-foreground">{value}</p>
      )}
    </Card>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AdminOverviewRoute() {
  const universitiesQuery = useQuery({
    queryKey: ["admin", "universities"],
    queryFn: adminUniversities.list,
  });
  const coursesQuery = useQuery({ queryKey: ["admin", "courses"], queryFn: adminCourses.list });
  const requirementsQuery = useQuery({
    queryKey: ["admin", "requirements"],
    queryFn: adminRequirements.list,
  });
  const policiesQuery = useQuery({
    queryKey: ["admin", "scoring-policies"],
    queryFn: adminScoringPolicies.list,
  });
  const logsQuery = useQuery({ queryKey: ["admin", "logs"], queryFn: getLogs });

  const isLoading =
    universitiesQuery.isPending ||
    coursesQuery.isPending ||
    requirementsQuery.isPending ||
    policiesQuery.isPending;

  const universities = universitiesQuery.data ?? [];
  const courses = coursesQuery.data ?? [];
  const requirements = requirementsQuery.data ?? [];
  const policies = policiesQuery.data ?? [];

  const coursesMissingRequirements = courses.filter(
    (c) => !requirements.some((r) => r.courseId === c.id),
  );
  const universitiesMissingPolicy = universities.filter(
    (u) => !policies.some((p) => p.universityId === u.id),
  );
  const hasWarnings = coursesMissingRequirements.length > 0 || universitiesMissingPolicy.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Current state of the catalog and scoring policy data behind PlaceRight.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Universities" value={universities.length} isLoading={isLoading} />
        <StatCard label="Courses" value={courses.length} isLoading={isLoading} />
        <StatCard label="Requirement rules" value={requirements.length} isLoading={isLoading} />
        <StatCard label="Scoring policies" value={policies.length} isLoading={isLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Data integrity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : !hasWarnings ? (
            <p className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="size-4" />
              Every course has a requirement rule and every university has a scoring policy.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {coursesMissingRequirements.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-caution">
                  <AlertTriangle className="size-4 shrink-0" />"{c.name}" has no admission
                  requirement rule.
                </li>
              ))}
              {universitiesMissingPolicy.map((u) => (
                <li key={u.id} className="flex items-center gap-2 text-caution">
                  <AlertTriangle className="size-4 shrink-0" />
                  {u.name} has no scoring policy.
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Recent policy changes</CardTitle>
        </CardHeader>
        <CardContent>
          {logsQuery.isPending ? (
            <Skeleton className="h-32 w-full" />
          ) : (logsQuery.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No changes recorded yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {(logsQuery.data ?? []).slice(0, 8).map((log) => (
                <li key={log.id} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                  <div>
                    <p className="text-foreground">{log.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.actor} · {log.entity}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(log.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
