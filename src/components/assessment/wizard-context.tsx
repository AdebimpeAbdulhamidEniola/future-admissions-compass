import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { getMyProfile } from "@/lib/api/candidates";
import { useAuth } from "@/hooks/use-auth";

import { mapProfileToFormValues } from "./mappers";
import { assessmentFormSchema, defaultAssessmentFormValues, STEP_FIELDS, STEP_IDS, type AssessmentFormValues, type StepId } from "./schema";

type WizardStage = { kind: "step"; index: number } | { kind: "review" };

interface AssessmentWizardContextValue {
  form: UseFormReturn<AssessmentFormValues>;
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

  const [stage, setStage] = useState<WizardStage>({ kind: "step", index: 0 });

  const goNext = async () => {
    if (stage.kind === "review") return;
    const currentId = STEP_IDS[stage.index] ?? STEP_IDS[0];
    const valid = await form.trigger(STEP_FIELDS[currentId], { shouldFocus: true });
    if (!valid) return;
    if (stage.index >= STEP_IDS.length - 1) {
      setStage({ kind: "review" });
    } else {
      setStage({ kind: "step", index: stage.index + 1 });
    }
  };

  const goBack = () => {
    if (stage.kind === "review") {
      setStage({ kind: "step", index: STEP_IDS.length - 1 });
      return;
    }
    if (stage.index === 0) return;
    setStage({ kind: "step", index: stage.index - 1 });
  };

  const goToStep = (id: StepId) => {
    const index = STEP_IDS.indexOf(id);
    if (index >= 0) setStage({ kind: "step", index });
  };

  const stepIndex = stage.kind === "step" ? stage.index : STEP_IDS.length - 1;

  const value = useMemo<AssessmentWizardContextValue>(
    () => ({
      form,
      stepIndex,
      totalSteps: STEP_IDS.length,
      currentStepId: STEP_IDS[stepIndex] ?? STEP_IDS[0],
      isReviewing: stage.kind === "review",
      isFirstStep: stage.kind === "step" && stage.index === 0,
      goNext,
      goBack,
      goToStep,
    }),
    // form and stepIndex are the only values that change identity across renders that matter here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, stage],
  );

  return <AssessmentWizardContext.Provider value={value}>{children}</AssessmentWizardContext.Provider>;
}

export function useAssessmentWizard(): AssessmentWizardContextValue {
  const ctx = useContext(AssessmentWizardContext);
  if (!ctx) throw new Error("useAssessmentWizard must be used within an AssessmentWizardProvider");
  return ctx;
}
