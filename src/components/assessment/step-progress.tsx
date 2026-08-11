import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { STEP_IDS, STEP_LABELS } from "./schema";
import { useAssessmentWizard } from "./wizard-context";

export function StepProgress() {
  const { stepIndex, isReviewing } = useAssessmentWizard();

  return (
    <nav aria-label="Assessment progress">
      <ol className="flex items-center">
        {STEP_IDS.map((id, index) => {
          const isDone = isReviewing || index < stepIndex;
          const isCurrent = !isReviewing && index === stepIndex;
          const isLast = index === STEP_IDS.length - 1;
          const status = isDone ? "completed" : isCurrent ? "current step" : "not started";

          return (
            <li
              key={id}
              aria-current={isCurrent ? "step" : undefined}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  aria-label={`${STEP_LABELS[id]}, ${status}`}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                    isDone && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isDone && !isCurrent && "border-border text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="size-4" aria-hidden /> : index + 1}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "hidden text-center text-xs sm:block",
                    isDone || isCurrent ? "text-foreground font-medium" : "text-muted-foreground",
                  )}
                >
                  {STEP_LABELS[id]}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn("mx-2 h-px flex-1", isDone ? "bg-primary" : "bg-border")}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-sm text-muted-foreground sm:hidden">
        {isReviewing
          ? "Review your details"
          : `Step ${stepIndex + 1} of ${STEP_IDS.length}: ${STEP_LABELS[STEP_IDS[stepIndex] ?? STEP_IDS[0]]}`}
      </p>
    </nav>
  );
}
