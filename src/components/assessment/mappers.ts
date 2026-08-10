import type { AuthUser } from "@/types/domain";
import type { CandidateProfile, OLevelGrade, OLevelResult } from "@/types/domain";

import { COMPULSORY_UTME_SUBJECT, GRADE_POINTS } from "./constants";
import type { AssessmentFormValues, OLevelRowValue } from "./schema";

/** Dedupes O'Level rows by subject, keeping the best grade across sittings, in first-seen order. */
export function mergeOLevelRows(rows: OLevelRowValue[]): OLevelResult[] {
  const bestBySubject = new Map<string, OLevelGrade>();
  const order: string[] = [];

  for (const row of rows) {
    const grade = row.grade as OLevelGrade;
    const existing = bestBySubject.get(row.subject);
    if (existing === undefined) {
      order.push(row.subject);
      bestBySubject.set(row.subject, grade);
    } else if (GRADE_POINTS[grade] > GRADE_POINTS[existing]) {
      bestBySubject.set(row.subject, grade);
    }
  }

  return order.map((subject) => {
    const grade = bestBySubject.get(subject);
    return { subject, grade: grade as OLevelGrade };
  });
}

export function buildCandidateProfile(values: AssessmentFormValues, user: AuthUser): CandidateProfile {
  return {
    id: user.id,
    fullName: values.fullName,
    email: user.email,
    stateOfOrigin: values.stateOfOrigin,
    lga: values.lga,
    schoolLocationState: values.schoolLocationState,
    utmeScore: values.utmeScore,
    postUtmeScore: values.postUtmeScore,
    utmeSubjects: [COMPULSORY_UTME_SUBJECT, values.utmeElective1, values.utmeElective2, values.utmeElective3],
    oLevelResults: mergeOLevelRows(values.oLevelRows),
    targetCourseId: values.targetCourseId,
    targetUniversityId: values.targetUniversityId,
  };
}

/** Prefills the wizard from an existing candidate profile (e.g. the seeded demo candidate). */
export function mapProfileToFormValues(profile: CandidateProfile): Partial<AssessmentFormValues> {
  const [, ...electiveSubjects] = profile.utmeSubjects;
  const [utmeElective1, utmeElective2, utmeElective3] = electiveSubjects;

  return {
    fullName: profile.fullName,
    stateOfOrigin: profile.stateOfOrigin,
    lga: profile.lga,
    schoolLocationState: profile.schoolLocationState,
    targetUniversityId: profile.targetUniversityId,
    targetCourseId: profile.targetCourseId,
    utmeScore: profile.utmeScore,
    utmeElective1: utmeElective1 ?? "",
    utmeElective2: utmeElective2 ?? "",
    utmeElective3: utmeElective3 ?? "",
    secondSittingEnabled: false,
    ...(profile.oLevelResults.length > 0
      ? {
          oLevelRows: profile.oLevelResults.map((result) => ({
            subject: result.subject,
            grade: result.grade,
            sitting: "FIRST" as const,
          })),
        }
      : {}),
    postUtmeScore: profile.postUtmeScore,
  };
}
