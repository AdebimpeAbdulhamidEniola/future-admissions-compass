import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { ReviewStep } from "./review-step";
import { StepProgress } from "./step-progress";
import { OLevelResultsStep } from "./steps/olevel-results-step";
import { PersonalDetailsStep } from "./steps/personal-details-step";
import { PostUtmeStep } from "./steps/post-utme-step";
import { TargetChoiceStep } from "./steps/target-choice-step";
import { UtmeDetailsStep } from "./steps/utme-details-step";
import { AssessmentWizardProvider, useAssessmentWizard } from "./wizard-context";

const STEP_COMPONENTS = {
  personal: PersonalDetailsStep,
  target: TargetChoiceStep,
  utme: UtmeDetailsStep,
  olevel: OLevelResultsStep,
  postUtme: PostUtmeStep,
};

function AssessmentWizardBody() {
  const { form, currentStepId, stepIndex, totalSteps, isReviewing, isFirstStep, goNext, goBack } = useAssessmentWizard();
  const StepComponent = STEP_COMPONENTS[currentStepId];
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <Form {...form}>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <StepProgress />
        <Card className="mt-8 p-6 sm:p-8">
          {isReviewing ? (
            <ReviewStep />
          ) : (
            <>
              <StepComponent />
              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <Button type="button" variant="outline" onClick={goBack} disabled={isFirstStep}>
                  <ChevronLeft className="mr-1.5 size-4" />
                  Back
                </Button>
                <Button type="button" onClick={goNext}>
                  {isLastStep ? "Review" : "Next"}
                  <ChevronRight className="ml-1.5 size-4" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </Form>
  );
}

export function AssessmentWizard() {
  return (
    <AssessmentWizardProvider>
      <AssessmentWizardBody />
    </AssessmentWizardProvider>
  );
}
