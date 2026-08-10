import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useAssessmentWizard } from "../wizard-context";

export function PostUtmeStep() {
  const { form } = useAssessmentWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Post-UTME</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          If you've already sat your Post-UTME screening, enter your score. This step is optional.
        </p>
      </div>

      <FormField
        control={form.control}
        name="postUtmeScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Post-UTME score (optional)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="0–100"
                value={field.value === null || Number.isNaN(field.value) ? "" : field.value}
                onChange={(event) => {
                  const raw = event.target.value;
                  field.onChange(raw === "" ? null : event.target.valueAsNumber);
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Leaving this blank means your aggregate will be computed from your UTME and O'Level results only.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}
