import { Award } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseRecommendation } from "@/types/domain";

export function RecommendationsSection({
  recommendations,
  ineligible,
}: {
  recommendations: CourseRecommendation[];
  ineligible: boolean;
}) {
  if (recommendations.length === 0) return null;

  return (
    <Card className="avoid-break">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="size-4 text-muted-foreground" aria-hidden />
          <CardTitle className="font-display text-lg">Alternative courses to consider</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          {ineligible
            ? "While you work on the requirements above, here are courses your current UTME subjects and O'Level credits already support:"
            : "Your aggregate doesn't clear this course's cut-off. Here are alternatives where you have a stronger chance:"}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {recommendations.slice(0, 5).map((rec) => (
            <li key={rec.courseId} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    {rec.rank}. {rec.courseName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {rec.universityCode} · {rec.faculty} · needs {rec.requiredAggregate}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {Math.round(rec.matchProbability * 100)}% match
                </Badge>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {rec.rationale.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
