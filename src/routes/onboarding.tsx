import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";
import { RequireAuth } from "@/components/auth/guards";
import { useAuth } from "@/hooks/use-auth";

const TITLE = "Set up your results — PlaceRight";
const DESCRIPTION =
  "Enter your UTME score, subject combination, O'Level grades and target course so PlaceRight can assess your placement chances.";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: OnboardingRoute,
});

function OnboardingRoute() {
  return (
    <RequireAuth>
      <Onboarding />
    </RequireAuth>
  );
}

function Onboarding() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-success">
          <CheckCircle2 className="size-3.5" /> Signed in as {user?.fullName}
        </p>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground">
          Next: your exam results
        </h1>
        <p className="mt-3 text-muted-foreground">
          This is where the results-entry wizard will live — UTME score and subjects, O'Level grades,
          state of origin and LGA, then your target university and course.
        </p>
        <Card className="mt-8 border-border p-6">
          <h2 className="font-display text-lg font-semibold">Coming in the next step</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Results-entry wizard and candidate profile</li>
            <li>· Eligibility verdict with per-rule reasons</li>
            <li>· Aggregate score against your applicable cut-off</li>
            <li>· Catchment classification and ranked alternatives</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
