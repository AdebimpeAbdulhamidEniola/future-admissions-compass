import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Calculator, Compass, MapPinned } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { listCourses, listUniversities } from "@/lib/api/catalog";

const TITLE = "PlaceRight — Know if you qualify before you pick your JAMB course";
const DESCRIPTION =
  "Check UTME eligibility, compute your real aggregate score against each university's own formula, see your catchment status, and find courses you can actually get into across six federal universities in Southwest Nigeria.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    icon: BadgeCheck,
    title: "Eligibility check",
    body: "We compare your UTME subject combination and O'Level credits against the exact requirements of your chosen course — and tell you which rule failed, not just that it failed.",
  },
  {
    icon: Calculator,
    title: "Aggregate score",
    body: "Each university weights UTME, Post-UTME and O'Level differently. We apply the right formula and show your score beside the published cut-off.",
  },
  {
    icon: MapPinned,
    title: "Catchment status",
    body: "Merit, Catchment Area or ELDS — with a plain-English explanation of what that means for the cut-off you are actually judged against.",
  },
  {
    icon: Compass,
    title: "Alternatives",
    body: "Below the cut-off? Get a ranked list of courses you are more likely to be offered, each with a match confidence and the reason behind it.",
  },
];

function useUniversityCards() {
  return useQuery({
    queryKey: ["landing", "universities-with-cutoffs"],
    queryFn: async () => {
      const universities = await listUniversities();
      const withCutOffs = await Promise.all(
        universities.map(async (university) => {
          const courses = await listCourses(university.id);
          const lowestCutOff = Math.min(...courses.map((c) => c.eldsCutOff));
          return { university, lowestCutOff, courseCount: courses.length };
        }),
      );
      return withCutOffs;
    },
  });
}

function Landing() {
  const { data, isPending, isError } = useUniversityCards();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            2026 admission cycle · six federal universities
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-6xl">
            Find out whether you qualify — before you waste your JAMB choice.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Enter your UTME and O'Level results once. PlaceRight tells you if you meet the
            requirements for your course, what your real aggregate score is under that university's
            own formula, and what else you could study if you fall short.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 text-base" asChild>
              <Link to="/register">
                Check my chances <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 text-base" asChild>
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-card/60">
          <div className="mx-auto w-full max-w-6xl px-4 py-16">
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              How it works
            </h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <Card className="h-full gap-3 border-border p-5 shadow-none">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-numeral text-3xl text-primary/40">
                        {index + 1}
                      </span>
                      <step.icon className="size-5 text-primary" aria-hidden />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Universities */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Universities covered
            </h2>
            <p className="text-sm text-muted-foreground">
              Lowest cut-off shown is the most accessible course on record this cycle.
            </p>
          </div>

          {isError ? (
            <Card className="mt-8 border-border p-6">
              <h3 className="font-display text-lg font-semibold">
                We couldn't load the university list
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This is usually a connection problem. Reload the page to try again.
              </p>
            </Card>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isPending
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="gap-4 border-border p-5">
                      <Skeleton className="size-12 rounded-xl" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/5" />
                    </Card>
                  ))
                : data?.map(({ university, lowestCutOff, courseCount }) => (
                    <Card key={university.id} className="gap-4 border-border p-5">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-semibold text-primary">
                        {university.code}
                      </span>
                      <div>
                        <h3 className="font-display text-lg leading-snug font-semibold text-foreground">
                          {university.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {university.locationState} State · {courseCount} courses tracked
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Lowest cut-off{" "}
                        <span className="text-numeral text-xl font-semibold text-foreground">
                          {lowestCutOff}
                        </span>
                      </p>
                    </Card>
                  ))}
            </div>
          )}
        </section>

        {/* Why this exists */}
        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[auto_1fr] lg:items-center">
            <p className="text-numeral text-6xl font-semibold sm:text-7xl">9.4%</p>
            <div className="max-w-2xl space-y-3">
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">Why this exists</h2>
              <p className="text-base leading-relaxed text-primary-foreground/85">
                In 2026 the University of Ibadan admitted 4,430 candidates out of 46,919 applicants —
                roughly 9.4%. Most of those who missed out were never told, in advance and in plain
                language, that their subject combination or aggregate score put the course out of
                reach. PlaceRight closes that gap before the choice is submitted, not after.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
