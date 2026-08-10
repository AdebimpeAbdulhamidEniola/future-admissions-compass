import type { CatchmentStatus } from "@/types/domain";

export const CATCHMENT_LABEL: Record<CatchmentStatus, string> = {
  MERIT: "Merit",
  CATCHMENT: "Catchment area",
  ELDS: "ELDS",
};

/** Fixed hue per catchment category — reused everywhere Merit/Catchment/ELDS appear together. */
export const CATCHMENT_COLOR: Record<CatchmentStatus, string> = {
  MERIT: "var(--chart-1)",
  CATCHMENT: "var(--chart-3)",
  ELDS: "var(--chart-4)",
};

export type ScoreComponent = "UTME" | "POST_UTME" | "OLEVEL";

export const COMPONENT_LABEL: Record<ScoreComponent, string> = {
  UTME: "UTME",
  POST_UTME: "Post-UTME",
  OLEVEL: "O'Level",
};

/** Fixed hue per score component — reused wherever the UTME/Post-UTME/O'Level split appears. */
export const COMPONENT_COLOR: Record<ScoreComponent, string> = {
  UTME: "var(--chart-1)",
  POST_UTME: "var(--chart-2)",
  OLEVEL: "var(--chart-4)",
};

/** How far below cut-off still reads as "so close" (amber) vs clearly short (rose). */
export const CLOSE_MARGIN_THRESHOLD = 3;

export function marginTone(margin: number): "success" | "caution" | "ineligible" {
  if (margin >= 0) return "success";
  return margin >= -CLOSE_MARGIN_THRESHOLD ? "caution" : "ineligible";
}
