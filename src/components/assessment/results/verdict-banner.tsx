import { CheckCircle2, PartyPopper, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AssessmentReport } from "@/types/domain";

import { CATCHMENT_LABEL, marginTone } from "./constants";

export function VerdictBanner({ report }: { report: AssessmentReport }) {
  const { verification, score, context } = report;
  const eligible = verification.eligible;
  const meetsCutOff = score?.meetsCutOff ?? null;
  const aboveCutOff = eligible && meetsCutOff === true;
  const belowCutOff = eligible && meetsCutOff === false;

  const tone = !eligible ? "ineligible" : score ? marginTone(score.margin) : "success";

  const summary = (() => {
    if (aboveCutOff && score) {
      return `You're eligible for ${context.courseName} at ${context.universityName}, and your aggregate of ${score.aggregate.toFixed(1)} clears the ${CATCHMENT_LABEL[score.cutOffType]} cut-off by ${Math.abs(score.margin).toFixed(1)} points.`;
    }
    if (belowCutOff && score) {
      return `Your UTME subjects and O'Level credits satisfy the requirements, but your aggregate of ${score.aggregate.toFixed(1)} is ${Math.abs(score.margin).toFixed(1)} points below the ${CATCHMENT_LABEL[score.cutOffType]} cut-off.`;
    }
    if (eligible) {
      return "Your UTME subjects and O'Level credits meet this course's requirements. Add your Post-UTME score to see your full aggregate and cut-off position.";
    }
    const failed = verification.issues.filter((i) => i.severity === "ERROR").length;
    return `${failed} requirement${failed === 1 ? "" : "s"} for this course ${failed === 1 ? "is" : "are"} not yet met — see the breakdown below for exactly what would need to change.`;
  })();

  return (
    <Card
      role="status"
      aria-live="polite"
      className={cn(
        "avoid-break overflow-hidden p-0",
        tone === "success" && "border-success/40",
        tone === "caution" && "border-caution/40",
        tone === "ineligible" && "border-ineligible/40",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-5 py-3 text-sm font-medium",
          tone === "success" && "bg-success/10 text-success",
          tone === "caution" && "bg-caution/10 text-caution-foreground",
          tone === "ineligible" && "bg-ineligible/10 text-ineligible",
        )}
      >
        {tone === "success" ? (
          <PartyPopper className="size-4" aria-hidden />
        ) : eligible ? (
          <CheckCircle2 className="size-4" aria-hidden />
        ) : (
          <XCircle className="size-4" aria-hidden />
        )}
        <Badge variant={eligible ? "success" : "ineligible"} className="uppercase tracking-wide">
          {eligible ? "Eligible" : "Not eligible"}
        </Badge>
        {belowCutOff && (
          <Badge variant={tone === "caution" ? "caution" : "ineligible"}>Below cut-off</Badge>
        )}
      </div>

      <div className="space-y-2 px-5 py-5">
        <p className="text-sm text-muted-foreground">{context.candidateName}</p>
        <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
          {context.courseName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {context.universityName} ({context.universityCode})
        </p>
        <p className="pt-1 text-sm leading-relaxed text-foreground">{summary}</p>
      </div>
    </Card>
  );
}
