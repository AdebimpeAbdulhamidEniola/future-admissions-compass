import { Info } from "lucide-react";

/** Required on the landing page and the results page. */
export function DisclaimerCallout({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3 rounded-xl border border-border bg-secondary/60 p-4 text-sm text-muted-foreground ${className}`}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <p>
        This is a guidance tool. It is not affiliated with JAMB, the NUC, or any university, and its
        output is not an admission decision.
      </p>
    </div>
  );
}
