import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminScoringPolicies, adminUniversities } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import type { ScoringPolicy } from "@/types/domain";

export const Route = createFileRoute("/admin/scoring-policies")({
  component: AdminScoringPoliciesRoute,
});

function PolicyRow({
  policy,
  universityLabel,
}: {
  policy: ScoringPolicy;
  universityLabel: string;
}) {
  const queryClient = useQueryClient();
  const [utme, setUtme] = useState(policy.utmeWeighting);
  const [postUtme, setPostUtme] = useState(policy.postUtmeWeighting);
  const [oLevel, setOLevel] = useState(policy.oLevelWeighting);

  useEffect(() => {
    setUtme(policy.utmeWeighting);
    setPostUtme(policy.postUtmeWeighting);
    setOLevel(policy.oLevelWeighting);
  }, [policy]);

  const total = utme + postUtme + oLevel;
  const isValid = total === 100;
  const isDirty =
    utme !== policy.utmeWeighting ||
    postUtme !== policy.postUtmeWeighting ||
    oLevel !== policy.oLevelWeighting;

  const mutation = useMutation({
    mutationFn: () =>
      adminScoringPolicies.update(policy.id, {
        utmeWeighting: utme,
        postUtmeWeighting: postUtme,
        oLevelWeighting: oLevel,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "scoring-policies"] });
      toast.success(`${universityLabel} scoring policy saved`);
    },
    onError: () => toast.error("Couldn't save. Try again."),
  });

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{universityLabel}</TableCell>
      <TableCell>
        <Input
          type="number"
          value={utme}
          onChange={(e) => setUtme(Number(e.target.value))}
          className="text-numeral h-8 w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={postUtme}
          onChange={(e) => setPostUtme(Number(e.target.value))}
          className="text-numeral h-8 w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={oLevel}
          onChange={(e) => setOLevel(Number(e.target.value))}
          className="text-numeral h-8 w-20"
        />
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "text-numeral flex items-center gap-1.5 text-sm font-semibold",
            isValid ? "text-success" : "text-ineligible",
          )}
        >
          {!isValid && <AlertTriangle className="size-3.5 shrink-0" />}
          {total}%
        </span>
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant="outline"
          disabled={!isValid || !isDirty || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
          Save
        </Button>
      </TableCell>
    </TableRow>
  );
}

function AdminScoringPoliciesRoute() {
  const universitiesQuery = useQuery({
    queryKey: ["admin", "universities"],
    queryFn: adminUniversities.list,
  });
  const policiesQuery = useQuery({
    queryKey: ["admin", "scoring-policies"],
    queryFn: adminScoringPolicies.list,
  });

  const universities = useMemo(() => universitiesQuery.data ?? [], [universitiesQuery.data]);
  const policies = policiesQuery.data ?? [];
  const universityById = useMemo(() => new Map(universities.map((u) => [u.id, u])), [universities]);

  const isLoading = universitiesQuery.isPending || policiesQuery.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Scoring policies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          UTME, Post-UTME, and O'Level weightings for each university. The three must always sum to
          exactly 100%.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Scoring policies</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>University</TableHead>
                    <TableHead>UTME %</TableHead>
                    <TableHead>Post-UTME %</TableHead>
                    <TableHead>O'Level %</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-20 text-right">Save</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <PolicyRow
                      key={policy.id}
                      policy={policy}
                      universityLabel={universityById.get(policy.universityId)?.code ?? "Unknown"}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
