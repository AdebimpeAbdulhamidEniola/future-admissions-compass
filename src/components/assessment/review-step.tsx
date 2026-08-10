import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { createAssessment } from "@/lib/api/assessments";
import { ApiError } from "@/lib/http";

import { PROCESSING_STAGES, PROCESSING_STAGE_DURATION_MS } from "./constants";
import { buildCandidateProfile } from "./mappers";
import { ProcessingOverlay } from "./processing-overlay";
import { useCoursesQuery, useUniversitiesQuery } from "./queries";
import type { StepId } from "./schema";
import { useAssessmentWizard } from "./wizard-context";

function runStagedAnimation(onStage: (index: number) => void): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;
    onStage(0);
    const interval = setInterval(() => {
      index += 1;
      if (index >= PROCESSING_STAGES.length) {
        clearInterval(interval);
        resolve();
        return;
      }
      onStage(index);
    }, PROCESSING_STAGE_DURATION_MS);
  });
}

function EditButton({ step }: { step: StepId }) {
  const { goToStep } = useAssessmentWizard();
  return (
    <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={() => goToStep(step)}>
      Edit
    </Button>
  );
}

export function ReviewStep() {
  const { form, goBack } = useAssessmentWizard();
  const { user } = useAuth();
  const navigate = useNavigate();

  const values = form.watch();
  const universitiesQuery = useUniversitiesQuery();
  const coursesQuery = useCoursesQuery(values.targetUniversityId);

  const university = universitiesQuery.data?.find((item) => item.id === values.targetUniversityId);
  const course = coursesQuery.data?.find((item) => item.id === values.targetCourseId);

  const [processing, setProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const mutation = useMutation({ mutationFn: createAssessment });

  async function handleSubmit() {
    if (!user) return;
    setProcessing(true);
    setStageIndex(0);
    const candidate = buildCandidateProfile(values, user);

    try {
      const [report] = await Promise.all([mutation.mutateAsync({ candidate }), runStagedAnimation(setStageIndex)]);
      await navigate({ to: "/assessment/$id", params: { id: report.id } });
    } catch (error) {
      setProcessing(false);
      toast.error(
        error instanceof ApiError ? error.message : "Something went wrong while generating your assessment. Try again.",
      );
    }
  }

  if (processing) {
    return <ProcessingOverlay activeIndex={stageIndex} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Review your details</h2>
        <p className="mt-1 text-sm text-muted-foreground">Check everything below, then submit for your assessment.</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">Personal details</p>
          <EditButton step="personal" />
        </div>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Full name</dt>
            <dd className="text-foreground">{values.fullName || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">State of origin</dt>
            <dd className="text-foreground">{values.stateOfOrigin || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">LGA</dt>
            <dd className="text-foreground">{values.lga || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">School state</dt>
            <dd className="text-foreground">{values.schoolLocationState || "—"}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">Target choice</p>
          <EditButton step="target" />
        </div>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">University</dt>
            <dd className="text-foreground">{university?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Course</dt>
            <dd className="text-foreground">{course?.name ?? "—"}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">UTME details</p>
          <EditButton step="utme" />
        </div>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Score</dt>
            <dd className="text-foreground">{Number.isNaN(values.utmeScore) ? "—" : values.utmeScore}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Subjects</dt>
            <dd className="text-foreground">
              Use of English, {values.utmeElective1 || "—"}, {values.utmeElective2 || "—"}, {values.utmeElective3 || "—"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">O'Level results</p>
          <EditButton step="olevel" />
        </div>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {values.oLevelRows.map((row, index) => (
            <li key={`${row.subject}-${row.sitting}-${index}`} className="text-foreground">
              {row.subject || "—"}: <span className="font-medium">{row.grade || "—"}</span>
              {values.secondSittingEnabled && (
                <span className="text-muted-foreground"> ({row.sitting === "SECOND" ? "2nd sitting" : "1st sitting"})</span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">Post-UTME</p>
          <EditButton step="postUtme" />
        </div>
        <p className="mt-2 text-sm text-foreground">
          {values.postUtmeScore === null
            ? "Not provided — aggregate will use UTME and O'Level only."
            : values.postUtmeScore}
        </p>
      </Card>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={goBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={mutation.isPending}>
          Submit assessment
        </Button>
      </div>
    </div>
  );
}
