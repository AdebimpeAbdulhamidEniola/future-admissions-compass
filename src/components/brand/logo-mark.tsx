import { cn } from "@/lib/utils";

/**
 * PlaceRight mark: a location pin ("place") holding a check mark ("right"), on the brand's deep
 * forest green. Same artwork as public/logo.svg and the favicon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-9 shrink-0", className)}
      role="img"
      aria-label="PlaceRight"
    >
      <rect width="64" height="64" rx="16" fill="#103b28" />
      <path
        d="M32 11c-9.1 0-16.5 7.2-16.5 16.1 0 12.1 16.5 25.9 16.5 25.9s16.5-13.8 16.5-25.9C48.5 18.2 41.1 11 32 11z"
        fill="#f9f6ee"
      />
      <path
        d="M24.5 27.5l5.6 5.6L40 23"
        fill="none"
        stroke="#af8112"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
