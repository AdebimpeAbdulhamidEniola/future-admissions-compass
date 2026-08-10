import { z } from "zod";

import { MAX_OLEVEL_ROWS, OLEVEL_GRADES } from "./constants";

const isValidGrade = (value: string): boolean => (OLEVEL_GRADES as readonly string[]).includes(value);

export const oLevelRowSchema = z.object({
  subject: z.string().min(1, "Select a subject"),
  grade: z.string().refine(isValidGrade, { message: "Select a grade" }),
  sitting: z.enum(["FIRST", "SECOND"]),
});

export type OLevelRowValue = z.infer<typeof oLevelRowSchema>;

const stateSchema = z.string().min(1, "Select a state");

export const assessmentFormSchema = z
  .object({
    // Personal details
    fullName: z.string().trim().min(2, "Enter your full name"),
    stateOfOrigin: stateSchema,
    lga: z.string().trim().min(2, "Enter your LGA"),
    schoolLocationState: stateSchema,

    // Target choice
    targetUniversityId: z.string().min(1, "Choose a university"),
    targetCourseId: z.string().min(1, "Choose a course"),

    // UTME details
    utmeScore: z
      .number()
      .finite("Enter your UTME score")
      .int("Score must be a whole number")
      .min(0, "Score cannot be negative")
      .max(400, "Score cannot exceed 400"),
    utmeElective1: z.string().min(1, "Select a subject"),
    utmeElective2: z.string().min(1, "Select a subject"),
    utmeElective3: z.string().min(1, "Select a subject"),

    // O'Level results
    secondSittingEnabled: z.boolean(),
    oLevelRows: z
      .array(oLevelRowSchema)
      .min(1, "Add at least one result")
      .max(MAX_OLEVEL_ROWS, `Maximum of ${MAX_OLEVEL_ROWS} results`),

    // Post-UTME
    postUtmeScore: z.number().finite().min(0).max(100).nullable(),
  })
  .superRefine((values, ctx) => {
    const electives = [values.utmeElective1, values.utmeElective2, values.utmeElective3];
    if (new Set(electives).size !== electives.length) {
      ctx.addIssue({
        code: "custom",
        message: "Choose three different subjects",
        path: ["utmeElective2"],
      });
    }

    const seen = new Set<string>();
    values.oLevelRows.forEach((row, index) => {
      const key = `${row.subject}__${row.sitting}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          message: "This subject is already listed for this sitting",
          path: ["oLevelRows", index, "subject"],
        });
      }
      seen.add(key);
    });
  });

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;

export const STEP_IDS = ["personal", "target", "utme", "olevel", "postUtme"] as const;
export type StepId = (typeof STEP_IDS)[number];

export const STEP_LABELS: Record<StepId, string> = {
  personal: "Personal details",
  target: "Target choice",
  utme: "UTME details",
  olevel: "O'Level results",
  postUtme: "Post-UTME",
};

export const STEP_FIELDS: Record<StepId, (keyof AssessmentFormValues)[]> = {
  personal: ["fullName", "stateOfOrigin", "lga", "schoolLocationState"],
  target: ["targetUniversityId", "targetCourseId"],
  utme: ["utmeScore", "utmeElective1", "utmeElective2", "utmeElective3"],
  olevel: ["secondSittingEnabled", "oLevelRows"],
  postUtme: ["postUtmeScore"],
};

export const defaultAssessmentFormValues: AssessmentFormValues = {
  fullName: "",
  stateOfOrigin: "",
  lga: "",
  schoolLocationState: "",
  targetUniversityId: "",
  targetCourseId: "",
  utmeScore: Number.NaN,
  utmeElective1: "",
  utmeElective2: "",
  utmeElective3: "",
  secondSittingEnabled: false,
  oLevelRows: [
    { subject: "English Language", grade: "", sitting: "FIRST" },
    { subject: "Mathematics", grade: "", sitting: "FIRST" },
  ],
  postUtmeScore: null,
};
