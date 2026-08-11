import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listCourses, listUniversities } from "@/lib/api/catalog";

const TITLE = "Universities — PlaceRight";

export const Route = createFileRoute("/universities/")({
  head: () => ({
    meta: [{ title: TITLE }],
  }),
  component: UniversitiesRoute,
});

function useUniversitySummaries() {
  return useQuery({
    queryKey: ["universities", "summaries"],
    queryFn: async () => {
      const universities = await listUniversities();
      return Promise.all(
        universities.map(async (university) => {
          const courses = await listCourses(university.id);
          const lowestCutOff =
            courses.length > 0 ? Math.min(...courses.map((c) => c.eldsCutOff)) : null;
          return { university, courseCount: courses.length, lowestCutOff };
        }),
      );
    },
  });
}

function UniversitiesRoute() {
  const { data, isPending, isError } = useUniversitySummaries();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Universities
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse all six federal universities in the catalog — each one's scoring formula, catchment
          states, and every course tracked with its three cut-offs.
        </p>

        {isError ? (
          <Card className="mt-8 border-border p-6">
            <h2 className="font-display text-lg font-semibold">
              We couldn't load the university list
            </h2>
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
                  </Card>
                ))
              : data?.map(({ university, courseCount, lowestCutOff }) => (
                  <Link
                    key={university.id}
                    to="/universities/$code"
                    params={{ code: university.code }}
                    className="block"
                  >
                    <Card className="h-full gap-4 border-border p-5 transition-colors hover:border-primary/50">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-semibold text-primary">
                        {university.code}
                      </span>
                      <div>
                        <h2 className="font-display text-lg leading-snug font-semibold text-foreground">
                          {university.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {university.locationState} State · {courseCount} courses tracked
                        </p>
                      </div>
                      {lowestCutOff !== null && (
                        <p className="text-sm text-muted-foreground">
                          Lowest cut-off{" "}
                          <span className="text-numeral text-xl font-semibold text-foreground">
                            {lowestCutOff}
                          </span>
                        </p>
                      )}
                    </Card>
                  </Link>
                ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
