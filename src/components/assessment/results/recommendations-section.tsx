import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Award } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { CourseRecommendation } from "@/types/domain";

const ALL = "all";

function matchRingColor(matchProbability: number) {
  if (matchProbability >= 0.8) return "var(--success)";
  if (matchProbability >= 0.6) return "var(--caution)";
  return "var(--ineligible)";
}

function MatchProbabilityRing({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${matchRingColor(value)} ${percent}%, transparent ${percent}%)`,
        }}
        aria-hidden
      />
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background text-center text-[11px] font-semibold text-foreground">
        <span>{percent}%</span>
      </div>
    </div>
  );
}

/** The candidate's score for this course on its own basis (older reports only have the target aggregate). */
function scoreFor(rec: CourseRecommendation, candidateAggregate: number) {
  return rec.candidateScore ?? candidateAggregate;
}

export function RecommendationsSection({
  recommendations,
  candidateAggregate,
  viewAllAssessmentId,
}: {
  recommendations: CourseRecommendation[];
  candidateAggregate: number;
  /** When set, shows a "view all" link to the standalone /assessment/$id/recommendations page. */
  viewAllAssessmentId?: string;
}) {
  const [sortBy, setSortBy] = useState<"match" | "margin">("match");
  const [universityFilter, setUniversityFilter] = useState<string>(ALL);
  const [facultyFilter, setFacultyFilter] = useState<string>(ALL);

  const universityOptions = useMemo(
    () => [...new Set(recommendations.map((r) => r.universityCode))].sort(),
    [recommendations],
  );
  const facultyOptions = useMemo(
    () => [...new Set(recommendations.map((r) => r.faculty))].sort(),
    [recommendations],
  );

  const visibleRecommendations = useMemo(() => {
    const filtered = recommendations.filter(
      (r) =>
        (universityFilter === ALL || r.universityCode === universityFilter) &&
        (facultyFilter === ALL || r.faculty === facultyFilter),
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "match") {
        return b.matchProbability - a.matchProbability;
      }
      const aMargin = scoreFor(a, candidateAggregate) - a.requiredAggregate;
      const bMargin = scoreFor(b, candidateAggregate) - b.requiredAggregate;
      return bMargin - aMargin;
    });
  }, [candidateAggregate, facultyFilter, recommendations, sortBy, universityFilter]);

  const maxConfidence = recommendations.reduce(
    (max, rec) => Math.max(max, rec.matchProbability),
    0,
  );
  const filtersActive = universityFilter !== ALL || facultyFilter !== ALL;

  if (recommendations.length === 0) return null;

  return (
    <Card className="avoid-break">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-muted-foreground" aria-hidden />
            <CardTitle className="font-display text-lg">Alternative courses to consider</CardTitle>
          </div>
          {viewAllAssessmentId && (
            <Link
              to="/assessment/$id/recommendations"
              params={{ id: viewAllAssessmentId }}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Your score doesn't clear this course's cut-off. These are other courses your UTME subjects
          and O'Level credits qualify you for, and whose cut-off your score already meets, at the
          same university, scored with its formula and ranked by a decision-tree model's estimate of
          your chance of admission:
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="h-8 w-auto min-w-32 text-xs">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All universities</SelectItem>
                {universityOptions.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger className="h-8 w-auto min-w-32 text-xs">
                <SelectValue placeholder="Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All faculties</SelectItem>
                {facultyOptions.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={sortBy}
              onValueChange={(value) => value && setSortBy(value as "match" | "margin")}
              className="ml-auto rounded-full border border-border bg-background p-1"
            >
              <ToggleGroupItem value="match" className="px-3 py-1 text-xs">
                Match probability
              </ToggleGroupItem>
              <ToggleGroupItem value="margin" className="px-3 py-1 text-xs">
                Cut-off margin
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border bg-muted/30 px-2 py-1">
              Showing {Math.min(5, visibleRecommendations.length)} of{" "}
              {visibleRecommendations.length}
              {filtersActive ? ` (filtered from ${recommendations.length})` : ""}
            </span>
            <span className="rounded-full border border-border bg-muted/30 px-2 py-1">
              Candidate aggregate: {candidateAggregate || "—"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {maxConfidence < 0.25 ? (
          <div className="rounded-xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
            We couldn't find a confident alternative course for this profile right now. Try a
            different target course or run an assessment for another university.
          </div>
        ) : visibleRecommendations.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
            No alternatives match these filters. Try clearing the university or faculty filter
            above.
          </div>
        ) : (
          <ul className="space-y-4">
            {visibleRecommendations.slice(0, 5).map((rec) => {
              const candidateScore = scoreFor(rec, candidateAggregate);
              const margin = Math.round(candidateScore - rec.requiredAggregate);
              const isStrong = margin >= 0;
              const utmeBasis = rec.cutOffBasis === "UTME";
              return (
                <li key={rec.courseId} className="rounded-3xl border border-border p-4 shadow-sm">
                  <div className="flex items-start gap-4 sm:items-center">
                    <MatchProbabilityRing value={rec.matchProbability} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {rec.rank}. {rec.courseName}
                        </p>
                        <Badge variant={isStrong ? "success" : "secondary"} className="text-[11px]">
                          {Math.abs(margin)} {margin >= 0 ? "points ahead" : "points short"}
                        </Badge>
                        {rec.lowConfidence && (
                          <Badge variant="outline" className="text-[11px]">
                            Low confidence
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {rec.universityCode} · {rec.faculty}
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                          <p className="text-muted-foreground">
                            {utmeBasis ? "JAMB cut-off" : "Required aggregate"}
                          </p>
                          <p className="font-semibold text-foreground">{rec.requiredAggregate}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                          <p className="text-muted-foreground">
                            {utmeBasis
                              ? "Your UTME score"
                              : `Your aggregate at ${rec.universityCode}`}
                          </p>
                          <p className="font-semibold text-foreground">{candidateScore || "—"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                    {rec.rationale.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <span className="mt-0.5 block h-1.5 w-1.5 rounded-full bg-foreground" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
