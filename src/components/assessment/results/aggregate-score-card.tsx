import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AggregateScoreResult, AssessmentContext } from "@/types/domain";

import { CATCHMENT_LABEL, COMPONENT_COLOR, COMPONENT_LABEL, marginTone } from "./constants";

function formulaSentence(score: AggregateScoreResult, universityName: string) {
  const parts = score.breakdown.map((b) => `${COMPONENT_LABEL[b.component]} at ${b.weighting}%`);
  const joined =
    parts.length <= 1
      ? (parts[0] ?? "")
      : parts.length === 2
        ? `${parts[0]} and ${parts[1]}`
        : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
  return `${universityName} weights ${joined}.`;
}

export function AggregateScoreCard({
  score,
  context,
}: {
  score: AggregateScoreResult | null;
  context: AssessmentContext;
}) {
  if (!score) {
    return (
      <Card className="avoid-break p-6">
        <CardTitle className="font-display text-lg">Aggregate score</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          Not available yet — add your Post-UTME score to see your full aggregate against{" "}
          {context.universityName}'s cut-offs.
        </p>
      </Card>
    );
  }

  const tone = marginTone(score.margin);
  const trackMax = Math.max(100, score.aggregate, score.applicableCutOff);

  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Aggregate score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p
            className={cn(
              "text-numeral text-6xl font-serif font-semibold leading-none sm:text-7xl",
              tone === "success" && "text-success",
              tone === "caution" && "text-caution",
              tone === "ineligible" && "text-ineligible",
            )}
          >
            {score.aggregate.toFixed(1)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {score.meetsCutOff ? (
              <>
                <span className="font-medium text-success">
                  {Math.abs(score.margin).toFixed(1)} points above
                </span>{" "}
                the {CATCHMENT_LABEL[score.cutOffType]} cut-off of {score.applicableCutOff}.
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "font-medium",
                    tone === "caution" ? "text-caution" : "text-ineligible",
                  )}
                >
                  {Math.abs(score.margin).toFixed(1)} points below
                </span>{" "}
                the {CATCHMENT_LABEL[score.cutOffType]} cut-off of {score.applicableCutOff}.
              </>
            )}
          </p>
        </div>

        <div className="pt-6">
          <div className="relative">
            <div className="flex h-8 w-full overflow-hidden rounded-full bg-muted sm:h-9">
              {score.breakdown.map((b) => (
                <div
                  key={b.component}
                  className="flex h-full items-center justify-center border-r-2 border-card text-[11px] font-medium text-white last:border-r-0"
                  style={{
                    width: `${(b.contribution / trackMax) * 100}%`,
                    background: COMPONENT_COLOR[b.component],
                  }}
                  title={`${COMPONENT_LABEL[b.component]}: ${b.contribution.toFixed(1)} pts`}
                >
                  {b.contribution / trackMax > 0.09 ? b.contribution.toFixed(0) : ""}
                </div>
              ))}
            </div>
            <div
              className="absolute -top-1 bottom-0 w-0.5 bg-foreground"
              style={{ left: `${(score.applicableCutOff / trackMax) * 100}%` }}
              aria-hidden
            />
            <div
              className="absolute -top-6 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-foreground"
              style={{ left: `${(score.applicableCutOff / trackMax) * 100}%` }}
            >
              Cut-off · {score.applicableCutOff}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {score.breakdown.map((b) => (
              <span key={b.component} className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ background: COMPONENT_COLOR[b.component] }}
                  aria-hidden
                />
                {COMPONENT_LABEL[b.component]} · {b.contribution.toFixed(1)} pts
              </span>
            ))}
          </div>
        </div>

        <p className="border-t border-border pt-4 text-sm text-muted-foreground">
          {formulaSentence(score, context.universityName)}
        </p>
      </CardContent>
    </Card>
  );
}
