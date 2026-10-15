import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A university's crest from public/universities/<CODE>.png (e.g. public/universities/UI.png).
 * Falls back to the code in a tinted tile when the image is missing or fails to load, so a
 * university without a logo file still looks deliberate.
 */
export function UniversityLogo({
  code,
  name,
  className,
}: {
  code: string;
  name?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const base = "flex size-12 shrink-0 items-center justify-center rounded-xl";

  if (failed) {
    return (
      <span
        className={cn(
          base,
          "bg-primary/10 font-display text-sm font-semibold text-primary",
          className,
        )}
        aria-label={name ? `${name} (${code})` : code}
      >
        {code}
      </span>
    );
  }

  return (
    <span className={cn(base, "overflow-hidden border border-border bg-white p-1", className)}>
      <img
        src={`/universities/${code.toUpperCase()}.png`}
        alt={name ? `${name} logo` : `${code} logo`}
        className="size-full object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
