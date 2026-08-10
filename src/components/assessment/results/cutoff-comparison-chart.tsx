import { Bar, BarChart, Cell, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { AggregateScoreResult, AssessmentContext, CatchmentStatus } from "@/types/domain";

import { CATCHMENT_LABEL, marginTone } from "./constants";

const STATUS_HEX: Record<"success" | "caution" | "ineligible", string> = {
  success: "var(--success)",
  caution: "var(--caution)",
  ineligible: "var(--ineligible)",
};

export function CutoffComparisonChart({
  score,
  context,
}: {
  score: AggregateScoreResult;
  context: AssessmentContext;
}) {
  const rows: { key: CatchmentStatus; label: string; value: number }[] = [
    { key: "MERIT", label: "Merit", value: context.cutOffs.merit },
    { key: "CATCHMENT", label: "Catchment", value: context.cutOffs.catchment },
    { key: "ELDS", label: "ELDS", value: context.cutOffs.elds },
  ];

  const tone = marginTone(score.margin);
  const maxVal = Math.max(...rows.map((r) => r.value), score.aggregate);
  const domainMax = Math.max(20, Math.ceil((maxVal * 1.15) / 10) * 10);

  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Cut-off comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          How your aggregate stacks up against all three of {context.universityCode}'s cut-offs for
          this course.
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ value: { label: "Cut-off" } }}
          className="aspect-auto h-56 w-full"
        >
          <BarChart data={rows} margin={{ top: 24, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 14}
                  textAnchor="middle"
                  className={cn(
                    "text-xs fill-muted-foreground",
                    rows[payload.index]?.key === score.cutOffType && "fill-foreground font-medium",
                  )}
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis domain={[0, domainMax]} hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ReferenceLine
              y={score.aggregate}
              stroke="var(--foreground)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Your aggregate · ${score.aggregate}`,
                position: "top",
                fill: "var(--foreground)",
                fontSize: 11,
                fontWeight: 500,
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={64}>
              {rows.map((row) => (
                <Cell
                  key={row.key}
                  fill={row.key === score.cutOffType ? STATUS_HEX[tone] : "var(--muted-foreground)"}
                  fillOpacity={row.key === score.cutOffType ? 1 : 0.25}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ background: STATUS_HEX[tone] }}
              aria-hidden
            />
            Applies to you ({CATCHMENT_LABEL[score.cutOffType]})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/25" aria-hidden />
            Other cut-offs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-3 border-t-2 border-dashed border-foreground" aria-hidden />
            Your aggregate
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
