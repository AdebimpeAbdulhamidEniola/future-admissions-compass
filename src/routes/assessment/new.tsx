import { createFileRoute } from "@tanstack/react-router";

import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import { RequireAuth } from "@/components/auth/guards";

export const Route = createFileRoute("/assessment/new")({
  head: () => ({
    meta: [{ title: "New assessment — PlaceRight" }],
  }),
  component: AssessmentNewRoute,
});

function AssessmentNewRoute() {
  return (
    <RequireAuth>
      <AssessmentWizard />
    </RequireAuth>
  );
}
