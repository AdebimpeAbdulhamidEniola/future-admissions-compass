import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { NIGERIA_STATES } from "../constants";
import { useAssessmentWizard } from "../wizard-context";

function StateSelect({ field, placeholder }: { field: { value: string; onChange: (value: string) => void }; placeholder: string }) {
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {NIGERIA_STATES.map((state) => (
          <SelectItem key={state} value={state}>
            {state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PersonalDetailsStep() {
  const { form } = useAssessmentWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Personal details</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tell us a little about who you are and where you're from.</p>
      </div>

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Adebayo Ogunlesi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="stateOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State of origin</FormLabel>
              <StateSelect field={field} placeholder="Select state" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LGA</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ibadan North" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="schoolLocationState"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State where your secondary school was located</FormLabel>
            <StateSelect field={field} placeholder="Select state" />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
