import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { getMyProfile } from "@/lib/api/candidates";
import { useAuth } from "@/hooks/use-auth";

import { mapProfileToFormValues } from "./mappers";
import { useScoringPolicyQuery } from "./queries";
import {
  assessmentFormSchema,
  defaultAssessmentFormValues,
  STEP_FIELDS,
  STEP_IDS,
  type AssessmentFormValues,
  type StepId,
} from "./schema";

type WizardStage = { kind: "step"; index: number } | { kind: "review" };

interface AssessmentWizardContextValue {
  form: UseFormReturn<AssessmentFormValues>;
  /** The steps for the chosen university — no Post-UTME step where its formula has no Post-UTME term. */
  steps: StepId[];
  /** False for universities whose formula has no Post-UTME term (FUTA, FUNAAB, FUOYE). */
  asksPostUtme: boolean;
  stepIndex: number;
  totalSteps: number;
  currentStepId: StepId;
  isReviewing: boolean;
  isFirstStep: boolean;
  goNext: () => Promise<void>;
  goBack: () => void;
  goToStep: (id: StepId) => void;
}

const AssessmentWizardContext = createContext<AssessmentWizardContextValue | null>(null);

export function AssessmentWizardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: { ...defaultAssessmentFormValues, fullName: user?.fullName ?? "" },
    mode: "onChange",
  });

  const profileQuery = useQuery({ queryKey: ["myProfile"], queryFn: getMyProfile });

  useEffect(() => {
    if (profileQuery.data && !form.formState.isDirty) {
      form.reset({ ...defaultAssessmentFormValues, ...mapProfileToFormValues(profileQuery.data) });
    }
    // Only ever runs once the profile resolves, and only while the candidate hasn't started typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQuery.data]);

  // FUTA, FUNAAB and FUOYE score without Post-UTME, so their candidates never see that step.
  // Until the chosen university's policy has loaded, the step is shown.
  const targetUniversityId = form.watch("targetUniversityId");
  const policyQuery = useScoringPolicyQuery(targetUniversityId);
  const asksPostUtme = policyQuery.data ? policyQuery.data.postUtmeWeighting > 0 : true;
  const steps = useMemo<StepId[]>(
    () => (asksPostUtme ? [...STEP_IDS] : STEP_IDS.filter((id) => id !== "postUtme")),
    [asksPostUtme],
  );

  useEffect(() => {
    if (!asksPostUtme && form.getValues("postUtmeScore") !== null)
      form.setValue("postUtmeScore", null);
  }, [asksPostUtme, form]);

  const [stage, setStage] = useState<WizardStage>({ kind: "step", index: 0 });

  const goNext = async () => {
    if (stage.kind === "review") return;
    const currentId = steps[stage.index] ?? steps[0];
    const valid = await form.trigger(STEP_FIELDS[currentId], { shouldFocus: true });
    if (!valid) return;
    if (stage.index >= steps.length - 1) {
      setStage({ kind: "review" });
    } else {
      setStage({ kind: "step", index: stage.index + 1 });
    }
  };

  const goBack = () => {
    if (stage.kind === "review") {
      setStage({ kind: "step", index: steps.length - 1 });
      return;
    }
    if (stage.index === 0) return;
    setStage({ kind: "step", index: stage.index - 1 });
  };

  const goToStep = (id: StepId) => {
    const index = steps.indexOf(id);
    if (index >= 0) setStage({ kind: "step", index });
  };

  const stepIndex =
    stage.kind === "step" ? Math.min(stage.index, steps.length - 1) : steps.length - 1;

  const value = useMemo<AssessmentWizardContextValue>(
    () => ({
      form,
      steps,
      asksPostUtme,
      stepIndex,
      totalSteps: steps.length,
      currentStepId: steps[stepIndex] ?? steps[0],
      isReviewing: stage.kind === "review",
      isFirstStep: stage.kind === "step" && stage.index === 0,
      goNext,
      goBack,
      goToStep,
    }),
    // form and stepIndex are the only values that change identity across renders that matter here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, stage, steps],
  );

  return (
    <AssessmentWizardContext.Provider value={value}>{children}</AssessmentWizardContext.Provider>
  );
}

export function useAssessmentWizard(): AssessmentWizardContextValue {
  const ctx = useContext(AssessmentWizardContext);
  if (!ctx) throw new Error("useAssessmentWizard must be used within an AssessmentWizardProvider");
  return ctx;
}
