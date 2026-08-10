import { AlertTriangle, Check, Lock, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdmissionRequirement } from "@/types/domain";
import { cn } from "@/lib/utils";

import { COMPULSORY_UTME_SUBJECT, UTME_ELECTIVE_SUBJECTS, UTME_LOW_SCORE_WARNING_THRESHOLD } from "../constants";
import { useCourseRequirementQuery } from "../queries";
import { useAssessmentWizard } from "../wizard-context";

type MatchStatus = "match" | "miss" | "neutral";

function getMatchStatus(subject: string, requirement: AdmissionRequirement | undefined): MatchStatus {
  if (!subject || !requirement) return "neutral";
  const isMatch = requirement.requiredUtmeSubjects.includes(subject) || requirement.optionalUtmeSubjects.includes(subject);
  return isMatch ? "match" : "miss";
}

const ELECTIVE_FIELD_NAMES = ["utmeElective1", "utmeElective2", "utmeElective3"] as const;

export function UtmeDetailsStep() {
  const { form } = useAssessmentWizard();
  const courseId = form.watch("targetCourseId");
  const requirementQuery = useCourseRequirementQuery(courseId);
  const requirement = requirementQuery.data;

  const utmeScore = form.watch("utmeScore");
  const electiveValues = form.watch(ELECTIVE_FIELD_NAMES);

  const missingRequired = requirement
    ? requirement.requiredUtmeSubjects.filter((subject) => !electiveValues.includes(subject))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">UTME details</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter your UTME score and the four subjects you sat.</p>
      </div>

      <FormField
        control={form.control}
        name="utmeScore"
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-medium text-foreground">UTME score</label>
            <FormControl>
              <Input
                type="number"
                min={0}
                max={400}
                placeholder="0–400"
                value={Number.isNaN(field.value) ? "" : field.value}
                onChange={(event) => field.onChange(event.target.valueAsNumber)}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
            {!Number.isNaN(utmeScore) && utmeScore < UTME_LOW_SCORE_WARNING_THRESHOLD && (
              <p className="flex items-center gap-1.5 text-sm text-warning">
                <AlertTriangle className="size-4" />
                This is below the {UTME_LOW_SCORE_WARNING_THRESHOLD} benchmark most universities expect. You can still
                continue.
              </p>
            )}
          </FormItem>
        )}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">UTME subjects</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex h-9 items-center justify-between rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5" />
              {COMPULSORY_UTME_SUBJECT}
            </span>
            <Badge variant="secondary">Compulsory</Badge>
          </div>

          {ELECTIVE_FIELD_NAMES.map((name, index) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => {
                const otherValues = electiveValues.filter((_, i) => i !== index);
                const status = getMatchStatus(field.value, requirement);

                return (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            status === "match" && "border-success text-success",
                            status === "miss" && "border-ineligible text-ineligible",
                          )}
                        >
                          <SelectValue placeholder={`Subject ${index + 2}`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UTME_ELECTIVE_SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject} disabled={otherValues.includes(subject)}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {status !== "neutral" && (
                      <p
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          status === "match" ? "text-success" : "text-ineligible",
                        )}
                      >
                        {status === "match" ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                        {status === "match" ? "Matches this course's requirements" : "Not required or accepted for this course"}
                      </p>
                    )}
                  </FormItem>
                );
              }}
            />
          ))}
        </div>

        {requirement && missingRequired.length > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-warning">
            <AlertTriangle className="size-4" />
            Still missing: {missingRequired.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
