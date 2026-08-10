import { MapPin } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { AssessmentContext, CatchmentResult, CatchmentStatus } from "@/types/domain";

import { CATCHMENT_COLOR, CATCHMENT_LABEL } from "./constants";

const ORDER: CatchmentStatus[] = ["MERIT", "CATCHMENT", "ELDS"];

export function CatchmentCard({
  catchment,
  context,
}: {
  catchment: CatchmentResult;
  context: AssessmentContext;
}) {
  const data = ORDER.map((status) => ({
    status,
    label: CATCHMENT_LABEL[status],
    value:
      status === "MERIT"
        ? context.quotaPercents.merit
        : status === "CATCHMENT"
          ? context.quotaPercents.catchment
          : context.quotaPercents.elds,
  }));
  const activeShare = data.find((d) => d.status === catchment.status)?.value ?? 0;

  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Catchment classification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold"
            style={{
              borderColor: CATCHMENT_COLOR[catchment.status],
              color: CATCHMENT_COLOR[catchment.status],
            }}
          >
            <span
              className="size-2 rounded-full"
              style={{ background: CATCHMENT_COLOR[catchment.status] }}
              aria-hidden
            />
            {CATCHMENT_LABEL[catchment.status]}
          </span>
        </div>

        <div className="space-y-1.5 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            Your state of origin:{" "}
            <span className="font-medium text-foreground">{context.stateOfOrigin}</span>
          </p>
          <p className="text-muted-foreground">
            {context.universityName}'s catchment states:{" "}
            {context.catchmentStates.map((state, i) => (
              <span key={state}>
                <span
                  className={
                    state === context.stateOfOrigin
                      ? "font-semibold text-foreground underline"
                      : undefined
                  }
                >
                  {state}
                </span>
                {i < context.catchmentStates.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{catchment.explanation}</p>

        <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex size-40 shrink-0 items-center justify-center">
            <ChartContainer
              config={{ value: { label: "Quota share" } }}
              className="aspect-square size-40"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={48}
                  outerRadius={68}
                  strokeWidth={3}
                  stroke="var(--card)"
                >
                  {data.map((d) => (
                    <Cell
                      key={d.status}
                      fill={CATCHMENT_COLOR[d.status]}
                      fillOpacity={d.status === catchment.status ? 1 : 0.3}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-numeral text-2xl font-semibold text-foreground">
                {activeShare}%
              </span>
              <span className="text-[10px] text-muted-foreground">your share</span>
            </div>
          </div>

          <ul className="w-full space-y-1.5 text-sm">
            {data.map((d) => (
              <li key={d.status} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: CATCHMENT_COLOR[d.status] }}
                    aria-hidden
                  />
                  {d.label}
                  {d.status === catchment.status && (
                    <span className="text-xs font-medium text-foreground">(you)</span>
                  )}
                </span>
                <span className="text-numeral font-medium text-foreground">{d.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
