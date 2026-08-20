import type {
  AdminMetrics,
  EvaluationEvent,
  EvaluationModule,
  EvaluationOutcome,
} from "@/types/domain";

const MODULES: EvaluationModule[] = ["VERIFICATION", "SCORING", "CATCHMENT", "RECOMMENDATION"];
const DAY_MS = 24 * 60 * 60 * 1000;

/** Simple deterministic PRNG so the synthetic dataset is stable across reloads. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260814);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)] as T;
}

const BASE_NOW = new Date("2026-08-14T09:00:00.000Z").getTime();

export const mockLatencyTimeSeries: AdminMetrics["latencyTimeSeries"] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date(BASE_NOW - (29 - i) * DAY_MS).toISOString().slice(0, 10);
    return {
      date,
      verificationMs: Math.round(310 + rand() * 180),
      scoringMs: Math.round(260 + rand() * 150),
      catchmentMs: Math.round(180 + rand() * 120),
      recommendationMs: Math.round(620 + rand() * 420),
    };
  },
);

export const mockConfusionMatrix: AdminMetrics["recommenderConfusionMatrix"] = [
  { predicted: "MATCH", actual: "MATCH", count: 712 },
  { predicted: "MATCH", actual: "NO_MATCH", count: 94 },
  { predicted: "NO_MATCH", actual: "MATCH", count: 61 },
  { predicted: "NO_MATCH", actual: "NO_MATCH", count: 588 },
];

export const mockAggregateScoreHistogram: AdminMetrics["aggregateScoreHistogram"] = [
  { bucket: "0-9", count: 4 },
  { bucket: "10-19", count: 11 },
  { bucket: "20-29", count: 28 },
  { bucket: "30-39", count: 63 },
  { bucket: "40-49", count: 142 },
  { bucket: "50-59", count: 246 },
  { bucket: "60-69", count: 312 },
  { bucket: "70-79", count: 218 },
  { bucket: "80-89", count: 97 },
  { bucket: "90-100", count: 31 },
];

const OUTCOMES: EvaluationOutcome[] = ["SUCCESS", "FAILURE"];

function generateEvaluationEvents(count: number): EvaluationEvent[] {
  const events: EvaluationEvent[] = [];
  for (let i = 0; i < count; i++) {
    const module = pick(MODULES);
    const outcome = rand() < 0.82 ? "SUCCESS" : pick(OUTCOMES);
    const baseLatency =
      module === "RECOMMENDATION"
        ? 620
        : module === "VERIFICATION"
          ? 310
          : module === "SCORING"
            ? 260
            : 180;
    const timestamp = new Date(BASE_NOW - rand() * 30 * DAY_MS).toISOString();
    events.push({
      id: `eval-${i + 1}`,
      timestamp,
      candidateId: `cand-synth-${String(Math.floor(rand() * 1000) + 1).padStart(4, "0")}`,
      module,
      outcome,
      latencyMs: Math.round(baseLatency + rand() * baseLatency * 1.4),
    });
  }
  return events.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export const mockEvaluationEvents: EvaluationEvent[] = generateEvaluationEvents(480);
