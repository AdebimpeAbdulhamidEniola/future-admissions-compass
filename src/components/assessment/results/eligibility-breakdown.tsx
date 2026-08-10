import { CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AssessmentContext, VerificationResult } from "@/types/domain";

function SubCheck({
  title,
  passed,
  children,
}: {
  title: string;
  passed: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-foreground">{title}</p>
        <Badge variant={passed ? "success" : "ineligible"} className="gap-1">
          {passed ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
          {passed ? "Passed" : "Failed"}
        </Badge>
      </div>
      {children}
    </div>
  );
}

function IssueRow({ issue, meaning }: { issue: string; meaning: string }) {
  return (
    <div className="rounded-lg border border-ineligible/30 bg-ineligible/5 p-3">
      <p className="flex items-start gap-1.5 text-sm font-medium text-ineligible">
        <XCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {issue}
      </p>
      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>{meaning}</span>
      </p>
    </div>
  );
}

export function EligibilityBreakdown({
  verification,
  context,
}: {
  verification: VerificationResult;
  context: AssessmentContext;
}) {
  const { utmeSubjectCheck, oLevelCheck } = verification;
  const requiredCredits = context.minimumCredits;
  const creditProgress = Math.min(100, (oLevelCheck.creditCount / requiredCredits) * 100);

  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-display text-lg">Eligibility breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Two checks decide whether you qualify for {context.courseName}.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <SubCheck title="UTME subject combination" passed={utmeSubjectCheck.passed}>
          {utmeSubjectCheck.passed ? (
            <p className="text-sm text-muted-foreground">
              Your combination includes every subject {context.universityCode} requires for this
              course: {context.requiredUtmeSubjects.join(", ")}.
            </p>
          ) : (
            <div className="space-y-2">
              {utmeSubjectCheck.missing.map((subject) => (
                <IssueRow
                  key={subject}
                  issue={`Missing compulsory subject: ${subject}`}
                  meaning={`Without ${subject} in your UTME combination, your application for ${context.courseName} cannot be processed, regardless of your score.`}
                />
              ))}
            </div>
          )}
          {utmeSubjectCheck.invalid.length > 0 && (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                {utmeSubjectCheck.invalid.join(", ")}{" "}
                {utmeSubjectCheck.invalid.length === 1 ? "isn't" : "aren't"} accepted for this
                course, so {utmeSubjectCheck.invalid.length === 1 ? "it won't" : "they won't"} count
                toward the requirement above — this isn't a failure by itself.
              </span>
            </p>
          )}
        </SubCheck>

        <Separator />

        <SubCheck title="O'Level credits" passed={oLevelCheck.passed}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Credit passes</span>
              <span
                className={cn(
                  "text-numeral font-medium",
                  oLevelCheck.creditCount >= requiredCredits ? "text-success" : "text-ineligible",
                )}
              >
                {oLevelCheck.creditCount} / {requiredCredits} required
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  oLevelCheck.creditCount >= requiredCredits ? "bg-success" : "bg-ineligible",
                )}
                style={{ width: `${creditProgress}%` }}
              />
            </div>
          </div>

          {oLevelCheck.missingCredits.length > 0 && (
            <div className="space-y-2">
              {oLevelCheck.missingCredits.map((subject) => (
                <IssueRow
                  key={subject}
                  issue={`No credit pass recorded in ${subject}`}
                  meaning={`${context.courseName} requires at least a C6 in ${subject}. A pass below C6 (D7–F9) doesn't count as a credit.`}
                />
              ))}
            </div>
          )}

          {oLevelCheck.missingCredits.length === 0 && oLevelCheck.creditCount < requiredCredits && (
            <IssueRow
              issue={`${oLevelCheck.creditCount} credit passes recorded — ${requiredCredits} required`}
              meaning={`Every compulsory subject has a credit, but you're ${requiredCredits - oLevelCheck.creditCount} credit pass(es) short of the overall minimum. A credit in any relevant subject would close the gap.`}
            />
          )}

          {oLevelCheck.passed && (
            <p className="text-sm text-muted-foreground">
              You have {oLevelCheck.creditCount} credit passes, including{" "}
              {context.requiredOLevelSubjects.join(", ")}.
            </p>
          )}
        </SubCheck>
      </CardContent>
    </Card>
  );
}
