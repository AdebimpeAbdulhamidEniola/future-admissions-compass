import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
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
          Enter your UTME score and subjects, O'Level grades, state of origin and your target
          university and course. It takes about five minutes, and you can edit it any time.
        </p>
        <Card className="mt-8 border-border p-6">
          <h2 className="font-display text-lg font-semibold">What you'll get</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Whether your UTME subjects and O'Level results meet the course requirements</li>
            <li>· Your aggregate score against the cut-off that applies to you</li>
            <li>· Your catchment category (Merit, Catchment or ELDS) and what it means</li>
            <li>· Other courses at the same university you qualify for, if you fall short</li>
          </ul>
        </Card>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/assessment/new">
              Start your assessment
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">
              <LayoutDashboard className="mr-1.5 size-4" />
              Go to dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
