import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { NIGERIA_STATES } from "@/components/assessment/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminCatchmentRules, adminUniversities } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import type { CatchmentRule } from "@/types/domain";

export const Route = createFileRoute("/admin/catchment-rules")({
  component: AdminCatchmentRulesRoute,
});

function AdminCatchmentRulesRoute() {
  const universitiesQuery = useQuery({
    queryKey: ["admin", "universities"],
    queryFn: adminUniversities.list,
  });
  const rulesQuery = useQuery({
    queryKey: ["admin", "catchment-rules"],
    queryFn: adminCatchmentRules.list,
  });
  const queryClient = useQueryClient();

  const universities = universitiesQuery.data ?? [];
  const rules = rulesQuery.data ?? [];
  const [pendingCell, setPendingCell] = useState<string | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "catchment-rules"] });

  const catchmentMutation = useMutation({
    mutationFn: ({ rule, state }: { rule: CatchmentRule; state: string }) => {
      const next = rule.catchmentStates.includes(state)
        ? rule.catchmentStates.filter((s) => s !== state)
        : [...rule.catchmentStates, state];
      return adminCatchmentRules.update(rule.id, { catchmentStates: next });
    },
    onSuccess: () => invalidate(),
    onError: () => toast.error("Couldn't update that mapping. Try again."),
    onSettled: () => setPendingCell(null),
  });

  const eldsMutation = useMutation({
    mutationFn: async (state: string) => {
      const inList = rules.every((r) => r.eldsStates.includes(state));
      await Promise.all(
        rules.map((r) => {
          const next = inList
            ? r.eldsStates.filter((s) => s !== state)
            : [...new Set([...r.eldsStates, state])];
          return adminCatchmentRules.update(r.id, { eldsStates: next });
        }),
      );
    },
    onSuccess: () => {
      invalidate();
      toast.success("ELDS state list updated");
    },
    onError: () => toast.error("Couldn't update the ELDS list. Try again."),
    onSettled: () => setPendingCell(null),
  });

  const isLoading = universitiesQuery.isPending || rulesQuery.isPending;
  const eldsStates = rules[0]?.eldsStates ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Catchment rules</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle a state to add or remove it from a university's catchment area. Changes save
          immediately.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">State × university catchment areas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div className="max-h-[32rem] overflow-auto rounded-lg border border-border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead className="sticky left-0 z-20 bg-card">State</TableHead>
                    {universities.map((u) => (
                      <TableHead key={u.id} className="text-center">
                        {u.code}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {NIGERIA_STATES.map((state) => (
                    <TableRow key={state}>
                      <TableCell className="sticky left-0 bg-card font-medium text-foreground">
                        {state}
                      </TableCell>
                      {rules.map((rule) => {
                        const cellId = `${rule.id}-${state}`;
                        return (
                          <TableCell key={rule.id} className="text-center">
                            <Checkbox
                              checked={rule.catchmentStates.includes(state)}
                              disabled={catchmentMutation.isPending && pendingCell === cellId}
                              onCheckedChange={() => {
                                setPendingCell(cellId);
                                catchmentMutation.mutate({ rule, state });
                              }}
                              aria-label={`${state} in catchment area for ${rule.universityId}`}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">ELDS states</CardTitle>
          <p className="text-sm text-muted-foreground">
            Educationally Less Developed States — this list applies nationwide, across all six
            universities.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {NIGERIA_STATES.map((state) => {
                const active = eldsStates.includes(state);
                return (
                  <button
                    key={state}
                    type="button"
                    disabled={eldsMutation.isPending && pendingCell === state}
                    onClick={() => {
                      setPendingCell(state);
                      eldsMutation.mutate(state);
                    }}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
                      active
                        ? "border-caution bg-caution/10 text-caution"
                        : "border-border text-muted-foreground hover:border-caution/50 hover:text-foreground",
                    )}
                  >
                    {state}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
