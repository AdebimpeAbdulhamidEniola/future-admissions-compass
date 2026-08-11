import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { RequireAuth } from "@/components/auth/guards";
import { RecommendationsSection } from "@/components/assessment/results/recommendations-section";
import { DisclaimerCallout } from "@/components/layout/disclaimer-callout";
import { SiteHeader } from "@/components/layout/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getAssessment } from "@/lib/api/assessments";

export const Route = createFileRoute("/assessment/$id/recommendations")({
  head: () => ({
    meta: [{ title: "Alternative courses — PlaceRight" }],
  }),
  component: RecommendationsRoute,
});

function RecommendationsRoute() {
  return (
    <RequireAuth>
      <RecommendationsPage />
    </RequireAuth>
  );
}

function RecommendationsPage() {
  const { id } = Route.useParams();
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["assessment", id], queryFn: () => getAssessment(id) });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8 sm:py-12">
        <Link
          to="/assessment/$id"
          params={{ id }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to results
        </Link>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        )}

        {!isLoading && (isError || !report) && (
          <div className="py-12 text-center">
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
        )}

        {report && (
          <>
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Alternative courses for {report.context.candidateName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Every course below is ranked against your current UTME, O'Level and Post-UTME
                results — not just {report.context.courseName} at {report.context.universityName}.
              </p>
            </div>

            {report.recommendations.length > 0 ? (
              <RecommendationsSection
                recommendations={report.recommendations}
                candidateAggregate={report.score?.aggregate ?? 0}
                ineligible={!report.verification.eligible}
              />
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                No alternative courses are available for this assessment yet.
              </div>
            )}

            <DisclaimerCallout />
          </>
        )}
      </main>
    </div>
  );
}
