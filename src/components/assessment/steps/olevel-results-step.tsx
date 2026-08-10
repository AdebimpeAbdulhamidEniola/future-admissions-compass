import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { Combobox } from "../combobox";
import { CREDIT_GRADES, MAX_OLEVEL_ROWS, OLEVEL_GRADES, OLEVEL_SUBJECTS } from "../constants";
import { useCourseRequirementQuery } from "../queries";
import { useAssessmentWizard } from "../wizard-context";

export function OLevelResultsStep() {
  const { form } = useAssessmentWizard();
  const courseId = form.watch("targetCourseId");
  const requirementQuery = useCourseRequirementQuery(courseId);
  const requiredCredits = requirementQuery.data?.minimumCredits ?? null;

  const secondSittingEnabled = form.watch("secondSittingEnabled");
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "oLevelRows" });
  const rows = form.watch("oLevelRows");

  const creditCount = (() => {
    const bestBySubject = new Map<string, string>();
    for (const row of rows) {
      if (!row.subject || !row.grade) continue;
      const existing = bestBySubject.get(row.subject);
      if (existing === undefined || (!CREDIT_GRADES.has(existing) && CREDIT_GRADES.has(row.grade))) {
        bestBySubject.set(row.subject, row.grade);
      }
    }
    return [...bestBySubject.values()].filter((grade) => CREDIT_GRADES.has(grade)).length;
  })();

  function handleSecondSittingToggle(checked: boolean) {
    form.setValue("secondSittingEnabled", checked);
    if (!checked) {
      rows.forEach((_, index) => form.setValue(`oLevelRows.${index}.sitting`, "FIRST"));
    }
  }

  function handleAddRow() {
    append({ subject: "", grade: "", sitting: secondSittingEnabled ? "SECOND" : "FIRST" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">O'Level results</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add every subject and grade from your O'Level result(s).</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Switch checked={secondSittingEnabled} onCheckedChange={handleSecondSittingToggle} />
          Second sitting
        </label>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {requiredCredits !== null
              ? `${creditCount} of ${requiredCredits} required credits`
              : `${creditCount} credit${creditCount === 1 ? "" : "s"} so far`}
          </span>
          {requiredCredits !== null && (
            <span className={creditCount >= requiredCredits ? "text-success" : "text-muted-foreground"}>
              {creditCount >= requiredCredits ? "Requirement met" : `${requiredCredits - creditCount} more needed`}
            </span>
          )}
        </div>
        {requiredCredits !== null && requiredCredits > 0 && (
          <Progress value={Math.min(100, (creditCount / requiredCredits) * 100)} className="mt-2" />
        )}
      </div>

      <div className="space-y-3">
        {fields.map((rowField, index) => {
          const row = rows[index];
          const grade = row?.grade ?? "";
          const sitting = row?.sitting ?? "FIRST";
          const isNonCredit = grade.length > 0 && !CREDIT_GRADES.has(grade);
          const usedSubjectsInSitting = rows
            .filter((r, i) => i !== index && r.sitting === sitting)
            .map((r) => r.subject);

          return (
            <div key={rowField.id} className="flex flex-wrap items-start gap-2 rounded-lg border border-border p-3">
              <div className="min-w-48 flex-1">
                <FormField
                  control={form.control}
                  name={`oLevelRows.${index}.subject`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox
                          options={OLEVEL_SUBJECTS.map((subject) => ({
                            value: subject,
                            label: subject,
                            disabled: usedSubjectsInSitting.includes(subject),
                          }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-28">
                <FormField
                  control={form.control}
                  name={`oLevelRows.${index}.grade`}
                  render={({ field }) => (
                    <FormItem>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={cn("w-full", isNonCredit && "border-warning text-warning")}>
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OLEVEL_GRADES.map((gradeOption) => (
                            <SelectItem
                              key={gradeOption}
                              value={gradeOption}
                              className={cn(!CREDIT_GRADES.has(gradeOption) && "text-warning")}
                            >
                              {gradeOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {secondSittingEnabled && (
                <Select
                  value={sitting}
                  onValueChange={(value) => form.setValue(`oLevelRows.${index}.sitting`, value === "SECOND" ? "SECOND" : "FIRST")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST">1st sitting</SelectItem>
                    <SelectItem value="SECOND">2nd sitting</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {isNonCredit && <span className="self-center text-xs text-warning">Non-credit</span>}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove row</span>
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={handleAddRow} disabled={fields.length >= MAX_OLEVEL_ROWS}>
          <Plus className="mr-1.5 size-4" />
          Add result
        </Button>
        <span className="text-xs text-muted-foreground">
          {fields.length} of {MAX_OLEVEL_ROWS} rows
        </span>
      </div>

      <FormField
        control={form.control}
        name="oLevelRows"
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
