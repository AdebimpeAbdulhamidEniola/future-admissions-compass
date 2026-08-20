import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { getMetrics } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/metrics")({
  component: AdminMetricsRoute,
});

function StatCard({
  label,
  value,
  isLoading,
  hint,
}: {
  label: string;
  value: string;
  isLoading: boolean;
  hint?: string | undefined;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-20" />
      ) : (
        <p className="text-numeral mt-1 text-3xl font-semibold text-foreground">{value}</p>
      )}
      {hint && !isLoading && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

const MODULE_LABEL = {
  verificationMs: "Verification",
  scoringMs: "Scoring",
  catchmentMs: "Catchment",
  recommendationMs: "Recommendation",
} as const;

/** Fixed hue per module — same order used wherever these four modules appear together. */
const MODULE_COLOR: Record<keyof typeof MODULE_LABEL, string> = {
  verificationMs: "var(--chart-1)",
  scoringMs: "var(--chart-2)",
  catchmentMs: "var(--chart-3)",
  recommendationMs: "var(--chart-4)",
};

function LatencyChart({ data }: { data: { date: string }[] }) {
  const config = Object.fromEntries(
    Object.entries(MODULE_LABEL).map(([key, label]) => [
      key,
      { label, color: MODULE_COLOR[key as keyof typeof MODULE_COLOR] },
    ]),
  );

  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Response latency, last 30 days</CardTitle>
        <p className="text-sm text-muted-foreground">
          Per-module mean latency against the 1.2s target.
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-72 w-full">
          <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => v.slice(5)}
              minTickGap={32}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} width={36} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ReferenceLine
              y={1200}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              label={{
                value: "1.2s target",
                position: "insideTopRight",
                fontSize: 11,
                fill: "var(--muted-foreground)",
              }}
            />
            {(Object.keys(MODULE_LABEL) as (keyof typeof MODULE_LABEL)[]).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={MODULE_COLOR[key]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {(Object.keys(MODULE_LABEL) as (keyof typeof MODULE_LABEL)[]).map((key) => (
            <span key={key} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ background: MODULE_COLOR[key] }}
                aria-hidden
              />
              {MODULE_LABEL[key]}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ConfusionMatrix({
  matrix,
}: {
  matrix: { predicted: "MATCH" | "NO_MATCH"; actual: "MATCH" | "NO_MATCH"; count: number }[];
}) {
  const max = Math.max(...matrix.map((m) => m.count), 1);
  const get = (predicted: "MATCH" | "NO_MATCH", actual: "MATCH" | "NO_MATCH") =>
    matrix.find((m) => m.predicted === predicted && m.actual === actual)?.count ?? 0;

  const cells: { predicted: "MATCH" | "NO_MATCH"; actual: "MATCH" | "NO_MATCH" }[] = [
    { predicted: "MATCH", actual: "MATCH" },
    { predicted: "MATCH", actual: "NO_MATCH" },
    { predicted: "NO_MATCH", actual: "MATCH" },
    { predicted: "NO_MATCH", actual: "NO_MATCH" },
  ];

  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Recommender confusion matrix</CardTitle>
        <p className="text-sm text-muted-foreground">
          Predicted vs. actual cut-off outcome for recommended courses.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 text-sm">
          <div />
          <p className="pb-1 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Actual match
          </p>
          <p className="pb-1 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Actual no match
          </p>
          {(["MATCH", "NO_MATCH"] as const).map((predicted) => (
            <>
              <p
                key={`${predicted}-label`}
                className="flex items-center justify-end pr-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Pred. {predicted === "MATCH" ? "match" : "no match"}
              </p>
              {cells
                .filter((c) => c.predicted === predicted)
                .map((c) => {
                  const count = get(c.predicted, c.actual);
                  const opacity = 0.12 + (count / max) * 0.75;
                  const isDiagonal = c.predicted === c.actual;
                  return (
                    <div
                      key={`${c.predicted}-${c.actual}`}
                      className={cn(
                        "text-numeral flex aspect-square items-center justify-center rounded-md text-lg font-semibold",
                        isDiagonal ? "text-primary-foreground" : "text-foreground",
                      )}
                      style={{
                        background: isDiagonal
                          ? `color-mix(in oklch, var(--success) ${opacity * 100}%, transparent)`
                          : `color-mix(in oklch, var(--ineligible) ${opacity * 100}%, transparent)`,
                      }}
                    >
                      {count}
                    </div>
                  );
                })}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentsByUniversityChart({ data }: { data: { code: string; assessments: number }[] }) {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Assessments per university</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ assessments: { label: "Assessments" } }}
          className="aspect-auto h-64 w-full"
        >
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="code" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} width={36} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="assessments"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ScoreHistogram({ data }: { data: { bucket: string; count: number }[] }) {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Aggregate score distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Across the synthetic 1,000-profile dataset.</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ count: { label: "Candidates" } }}
          className="aspect-auto h-64 w-full"
        >
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="bucket" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} width={36} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AdminMetricsRoute() {
  const query = useQuery({ queryKey: ["admin", "metrics"], queryFn: getMetrics });
  const isLoading = query.isPending;
  const m = query.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Evaluation metrics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          System-performance evaluation against the synthetic candidate dataset.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Precision"
          value={m ? `${(m.precision * 100).toFixed(1)}%` : ""}
          isLoading={isLoading}
        />
        <StatCard
          label="Recall"
          value={m ? `${(m.recall * 100).toFixed(1)}%` : ""}
          isLoading={isLoading}
        />
        <StatCard
          label="Accuracy"
          value={m ? `${(m.accuracy * 100).toFixed(1)}%` : ""}
          isLoading={isLoading}
        />
        <StatCard
          label="Mean response latency"
          value={m ? `${m.meanResponseLatencyMs}ms` : ""}
          hint={m ? `Target ${(m.latencyTargetMs / 1000).toFixed(1)}s` : undefined}
          isLoading={isLoading}
        />
      </div>

      {isLoading || !m ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 w-full lg:col-span-2" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full lg:col-span-2" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <LatencyChart data={m.latencyTimeSeries} />
          </div>
          <ConfusionMatrix matrix={m.recommenderConfusionMatrix} />
          <AssessmentsByUniversityChart data={m.byUniversity} />
          <div className="lg:col-span-2">
            <ScoreHistogram data={m.aggregateScoreHistogram} />
          </div>
        </div>
      )}
    </div>
  );
}
