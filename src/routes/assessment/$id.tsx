import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { RequireAuth } from "@/components/auth/guards";
import { AggregateScoreCard } from "@/components/assessment/results/aggregate-score-card";
import { CatchmentCard } from "@/components/assessment/results/catchment-card";
import { CutoffComparisonChart } from "@/components/assessment/results/cutoff-comparison-chart";
import { EligibilityBreakdown } from "@/components/assessment/results/eligibility-breakdown";
import { RecommendationsSection } from "@/components/assessment/results/recommendations-section";
import { ResultsFooter } from "@/components/assessment/results/results-footer";
import { VerdictBanner } from "@/components/assessment/results/verdict-banner";
import { DisclaimerCallout } from "@/components/layout/disclaimer-callout";
import { SiteHeader } from "@/components/layout/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getAssessment } from "@/lib/api/assessments";

export const Route = createFileRoute("/assessment/$id")({
  head: () => ({
    meta: [{ title: "Your assessment — PlaceRight" }],
  }),
  component: AssessmentResultRoute,
});

function AssessmentResultRoute() {
  return (
    <RequireAuth>
      <AssessmentResult />
    </RequireAuth>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-12">
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

function AssessmentResult() {
  const { id } = Route.useParams();
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["assessment", id], queryFn: () => getAssessment(id) });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="print:hidden">
          <SiteHeader />
        </div>
        <ResultsSkeleton />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-background">
        <div className="print:hidden">
          <SiteHeader />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="font-display text-xl font-semibold text-foreground">
            Assessment not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This assessment may have expired.{" "}
            <Link to="/assessment/new" className="text-primary underline">
              Start a new one
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const { verification, score, catchment, recommendations, context } = report;
  const showRecommendations = !verification.eligible || (score !== null && !score.meetsCutOff);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8 sm:py-12 print:px-0 print:py-6">
        <VerdictBanner report={report} />
        <EligibilityBreakdown verification={verification} context={context} />
        <AggregateScoreCard score={score} context={context} />
        {score && <CutoffComparisonChart score={score} context={context} />}
        <CatchmentCard catchment={catchment} context={context} />
        {showRecommendations && (
          <RecommendationsSection
            recommendations={recommendations}
            candidateAggregate={score?.aggregate ?? 0}
            ineligible={!verification.eligible}
            viewAllAssessmentId={report.id}
          />
        )}
        <DisclaimerCallout />
      </main>

      <ResultsFooter />
    </div>
  );
}
