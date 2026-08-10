import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { PROCESSING_STAGES } from "./constants";

interface ProcessingOverlayProps {
  activeIndex: number;
}

export function ProcessingOverlay({ activeIndex }: ProcessingOverlayProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Generating your assessment</h2>
        <p className="mt-1 text-sm text-muted-foreground">This takes just a few seconds.</p>
      </div>
      <ul className="w-full max-w-sm space-y-3 text-left">
        {PROCESSING_STAGES.map((stage, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <li key={stage} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                  isDone && "border-success bg-success text-success-foreground",
                  isActive && "border-primary text-primary",
                  !isDone && !isActive && "border-border text-muted-foreground",
                )}
              >
                {isDone ? (
                  <Check className="size-3.5" />
                ) : isActive ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : null}
              </span>
              <span className={cn("text-sm", isDone || isActive ? "text-foreground" : "text-muted-foreground")}>
                {stage}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
