import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useState } from "react";

import { listEvaluationEvents, type EvaluationEventFilters } from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EvaluationEvent, EvaluationModule, EvaluationOutcome } from "@/types/domain";

export const Route = createFileRoute("/admin/evaluation-logs")({
  component: AdminEvaluationLogsRoute,
});

const ALL = "all";
const PAGE_SIZE = 20;

const MODULE_LABEL: Record<EvaluationModule, string> = {
  VERIFICATION: "Verification",
  SCORING: "Scoring",
  CATCHMENT: "Catchment",
  RECOMMENDATION: "Recommendation",
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toCsv(events: EvaluationEvent[]): string {
  const header = "timestamp,candidateId,module,outcome,latencyMs";
  const rows = events.map((e) =>
    [e.timestamp, e.candidateId, e.module, e.outcome, e.latencyMs].join(","),
  );
  return [header, ...rows].join("\n");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function AdminEvaluationLogsRoute() {
  const [module, setModule] = useState<EvaluationModule | typeof ALL>(ALL);
  const [outcome, setOutcome] = useState<EvaluationOutcome | typeof ALL>(ALL);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  function buildFilters(page: number, pageSize: number): EvaluationEventFilters {
    return {
      ...(module !== ALL ? { module } : {}),
      ...(outcome !== ALL ? { outcome } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo: `${dateTo}T23:59:59.999Z` } : {}),
      page,
      pageSize,
    };
  }

  const query = useQuery({
    queryKey: ["admin", "evaluation-logs", module, outcome, dateFrom, dateTo, page],
    queryFn: () => listEvaluationEvents(buildFilters(page, PAGE_SIZE)),
  });

  async function handleExport() {
    const all = await listEvaluationEvents(buildFilters(1, 100000));
    downloadCsv(toCsv(all.items), `evaluation-events-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function resetToFirstPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  function handleModuleChange(value: string) {
    setModule(value as EvaluationModule | typeof ALL);
    setPage(1);
  }

  function handleOutcomeChange(value: string) {
    setOutcome(value as EvaluationOutcome | typeof ALL);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Evaluation logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every verification, scoring, catchment, and recommendation event.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => void handleExport()}>
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-module">
              Module
            </label>
            <Select value={module} onValueChange={handleModuleChange}>
              <SelectTrigger id="filter-module" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All modules</SelectItem>
                {(Object.keys(MODULE_LABEL) as EvaluationModule[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {MODULE_LABEL[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-outcome">
              Outcome
            </label>
            <Select value={outcome} onValueChange={handleOutcomeChange}>
              <SelectTrigger id="filter-outcome" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All outcomes</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILURE">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-from">
              From
            </label>
            <Input
              id="filter-from"
              type="date"
              value={dateFrom}
              onChange={(e) => resetToFirstPage(setDateFrom)(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="filter-to">
              To
            </label>
            <Input
              id="filter-to"
              type="date"
              value={dateTo}
              onChange={(e) => resetToFirstPage(setDateTo)(e.target.value)}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Events</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isPending ? (
            <Skeleton className="h-96 w-full" />
          ) : (query.data?.items ?? []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No events match these filters.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead className="text-right">Latency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(query.data?.items ?? []).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{event.candidateId}</TableCell>
                        <TableCell>{MODULE_LABEL[event.module]}</TableCell>
                        <TableCell>
                          <Badge variant={event.outcome === "SUCCESS" ? "success" : "ineligible"}>
                            {event.outcome === "SUCCESS" ? "Success" : "Failure"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-numeral text-right">
                          {event.latencyMs}ms
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Page {page} of {totalPages} &middot; {total} events
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
