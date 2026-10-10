import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  applyUniversityImport,
  previewUniversityImport,
  type SheetRows,
  type WorkbookSheets,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/http";
import type { ImportFieldChange, ImportPreview } from "@/types/domain";

export const Route = createFileRoute("/admin/import")({
  component: AdminImportRoute,
});

const TEMPLATE_URL = "/templates/university-import-template.xlsx";

const ACTION_BADGE = {
  create: { label: "New", variant: "success" },
  update: { label: "Changed", variant: "caution" },
  unchanged: { label: "Unchanged", variant: "secondary" },
} as const;

/** One sheet as plain cell values; dates become ISO strings so the grid is JSON-safe. */
async function readSheet(file: File, name: string, position: number): Promise<SheetRows> {
  // Prefer the sheet by name ("University" / "Courses"); fall back to its position.
  const rows = await readXlsxFile(file, { sheet: name }).catch(() =>
    readXlsxFile(file, { sheet: position }),
  );
  return rows.map((row) =>
    row.map((cell) => {
      if (cell instanceof Date) return cell.toISOString();
      if (cell === undefined) return null;
      return cell as string | number | boolean | null;
    }),
  );
}

async function readWorkbook(file: File): Promise<WorkbookSheets> {
  const [university, courses] = await Promise.all([
    readSheet(file, "University", 1),
    readSheet(file, "Courses", 2),
  ]);
  return { university, courses };
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value
      .map((item) => {
        if (Array.isArray(item)) return item.join(" or ");
        if (item && typeof item === "object") {
          const sub = item as {
            subject?: string;
            alternatives?: string[];
            countsTowardPoints?: boolean;
          };
          return `${sub.subject} → ${sub.alternatives?.join(" or ")}${sub.countsTowardPoints === false ? " (0 points)" : ""}`;
        }
        return String(item);
      })
      .join("; ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}=${String(v)}`)
      .join("; ");
  }
  return String(value);
}

function ChangeList({ changes }: { changes: ImportFieldChange[] }) {
  if (changes.length === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <ul className="space-y-0.5">
      {changes.map((change) => (
        <li key={change.field} className="text-xs">
          <span className="font-medium text-foreground">{change.field}:</span>{" "}
          <span className="text-muted-foreground line-through">{formatValue(change.from)}</span> →{" "}
          <span className="text-foreground">{formatValue(change.to)}</span>
        </li>
      ))}
    </ul>
  );
}

function AdminImportRoute() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<WorkbookSheets | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);

  const previewMutation = useMutation({
    mutationFn: previewUniversityImport,
    onSuccess: setPreview,
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "Couldn't check the file."),
  });

  const applyMutation = useMutation({
    mutationFn: applyUniversityImport,
    onSuccess: (result) => {
      toast.success(
        `Imported ${result.universityCode}: ${result.created} course(s) added, ${result.updated} changed, ${result.unchanged} unchanged.`,
      );
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["universities"] });
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
      setRows(null);
      setPreview(null);
      setFileName(null);
      if (fileInput.current) fileInput.current.value = "";
    },
    onError: (error) =>
      toast.error(error instanceof ApiError ? error.message : "The import failed."),
  });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setPreview(null);
    setFileName(file.name);
    try {
      const workbook = await readWorkbook(file);
      setRows(workbook);
      previewMutation.mutate(workbook);
    } catch {
      setRows(null);
      toast.error(
        "That file couldn't be read. Upload an .xlsx file with a University sheet and a Courses sheet.",
      );
    }
  }

  const changedCourses = preview?.courses.filter((c) => c.action !== "unchanged").length ?? 0;
  const nothingToDo =
    preview?.valid === true && preview.universityAction === "unchanged" && changedCourses === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Import from Excel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload one workbook per university: a <b>University</b> sheet with its scoring rules and
          catchment states, and a <b>Courses</b> sheet with one row per course. Cut-off columns are
          optional — a blank cell keeps the current cut-off, and <code>none</code> clears it. You'll
          see every change before anything is saved, and courses not in the file are never removed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Choose a file</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild>
            <a href={TEMPLATE_URL} download>
              <Download className="mr-1.5 size-4" />
              Download template (UI example)
            </a>
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <Button onClick={() => fileInput.current?.click()} disabled={previewMutation.isPending}>
            {previewMutation.isPending ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Upload className="mr-1.5 size-4" />
            )}
            Upload .xlsx
          </Button>
          {fileName && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileSpreadsheet className="size-4" />
              {fileName}
            </span>
          )}
        </CardContent>
      </Card>

      {preview && !preview.valid && (
        <Card className="border-ineligible/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="size-5 text-ineligible" />
              2. Fix {preview.errors.length} problem{preview.errors.length === 1 ? "" : "s"} and
              upload again
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Sheet</TableHead>
                  <TableHead className="w-16">Row</TableHead>
                  <TableHead className="w-20">Column</TableHead>
                  <TableHead>Problem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.errors.map((error, i) => (
                  <TableRow key={i}>
                    <TableCell>{error.sheet}</TableCell>
                    <TableCell className="text-numeral">{error.row}</TableCell>
                    <TableCell>{error.column}</TableCell>
                    <TableCell>{error.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {preview?.valid && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
                <CheckCircle2 className="size-5 text-success" />
                2. Review the changes for {preview.universityCode}
                {preview.universityAction === "create" && (
                  <Badge variant="success">New university</Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {preview.courses.filter((c) => c.action === "create").length} course(s) to add ·{" "}
                {preview.courses.filter((c) => c.action === "update").length} to change ·{" "}
                {preview.courses.filter((c) => c.action === "unchanged").length} unchanged ·{" "}
                {preview.untouchedCourses.length} existing course(s) not in the file will be kept as
                they are.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="mb-2 text-sm font-medium text-foreground">University rules</h2>
                {preview.universityChanges.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No changes.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Current</TableHead>
                          <TableHead>New</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.universityChanges.map((change) => (
                          <TableRow key={change.field}>
                            <TableCell className="font-medium">{change.field}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatValue(change.from)}
                            </TableCell>
                            <TableCell>{formatValue(change.to)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <div>
                <h2 className="mb-2 text-sm font-medium text-foreground">Courses</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-14">Row</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead className="w-28">Action</TableHead>
                        <TableHead>What changes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.courses.map((course) => (
                        <TableRow key={course.row}>
                          <TableCell className="text-numeral">{course.row}</TableCell>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell>
                            <Badge variant={ACTION_BADGE[course.action].variant}>
                              {ACTION_BADGE[course.action].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {course.action === "create" ? (
                              <span className="text-xs text-muted-foreground">New course</span>
                            ) : (
                              <ChangeList changes={course.changes} />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <p className="text-sm text-muted-foreground">
              After importing new cut-offs, retrain the recommender (<code>npm run ml:train</code>)
              and restart the API.
            </p>
            <Button
              onClick={() => rows && applyMutation.mutate(rows)}
              disabled={!rows || nothingToDo || applyMutation.isPending}
            >
              {applyMutation.isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {nothingToDo ? "Nothing to import" : "Confirm import"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
