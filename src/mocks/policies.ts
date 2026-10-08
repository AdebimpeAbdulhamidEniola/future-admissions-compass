import type { AdmissionRequirement, ScoringPolicy, CatchmentRule } from "@/types/domain";
import { mockCourses } from "./courses";

const SCIENCE_CORE = ["Mathematics", "Physics", "Chemistry"];

function requirementFor(courseId: string): AdmissionRequirement {
  const course = mockCourses.find((c) => c.id === courseId)!;
  const isMedical = course.name.includes("Medicine") || course.name.includes("Veterinary");
  const isEngineering = /Engineering|Architecture|Technology/.test(course.faculty + course.name);
  const isLaw = course.name === "Law";
  const isArts = course.faculty === "Arts";
  const isSocial = /Social Sciences|Management Sciences/.test(course.faculty);

  if (isMedical) {
    return {
      id: `req-${courseId}`,
      courseId,
      requiredUtmeSubjects: ["Biology", "Chemistry", "Physics"],
      optionalUtmeSubjects: ["Mathematics"],
      requiredOLevelSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"],
      minimumCredits: 5,
    };
  }
  if (isEngineering) {
    return {
      id: `req-${courseId}`,
      courseId,
      requiredUtmeSubjects: SCIENCE_CORE,
      optionalUtmeSubjects: ["Further Mathematics", "Technical Drawing"],
      requiredOLevelSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
      minimumCredits: 5,
    };
  }
  if (isLaw) {
    return {
      id: `req-${courseId}`,
      courseId,
      requiredUtmeSubjects: ["Literature in English", "Government"],
      optionalUtmeSubjects: ["Christian Religious Studies", "History", "Economics"],
      requiredOLevelSubjects: ["English Language", "Literature in English", "Government"],
      minimumCredits: 5,
    };
  }
  if (isArts) {
    return {
      id: `req-${courseId}`,
      courseId,
      requiredUtmeSubjects: ["Literature in English"],
      optionalUtmeSubjects: ["History", "Government", "Christian Religious Studies", "Yoruba"],
      requiredOLevelSubjects: ["English Language", "Literature in English"],
      minimumCredits: 5,
    };
  }
  if (isSocial) {
    return {
      id: `req-${courseId}`,
      courseId,
      requiredUtmeSubjects: ["Mathematics", "Economics"],
      optionalUtmeSubjects: ["Government", "Geography", "Commerce"],
      requiredOLevelSubjects: ["English Language", "Mathematics", "Economics"],
      minimumCredits: 5,
    };
  }
  return {
    id: `req-${courseId}`,
    courseId,
    requiredUtmeSubjects: ["Mathematics", "Physics"],
    optionalUtmeSubjects: ["Chemistry", "Biology", "Agricultural Science"],
    requiredOLevelSubjects: ["English Language", "Mathematics", "Physics"],
    minimumCredits: 5,
  };
}

/**
 * University-specific substitutions (mirrors the backend seed): FUNAAB accepts Agriculture in lieu
 * of Biology for eligibility but scores it as zero (Confirmed); FUTA's agriculture and science
 * schools accept Biology or Agricultural Science interchangeably (Likely).
 */
function withSubstitutions(requirement: AdmissionRequirement): AdmissionRequirement {
  const course = mockCourses.find((c) => c.id === requirement.courseId)!;
  if (!requirement.requiredOLevelSubjects.includes("Biology")) return requirement;
  if (course.universityId === "uni-funaab") {
    return {
      ...requirement,
      oLevelSubstitutions: [{ subject: "Biology", alternatives: ["Agricultural Science"], countsTowardPoints: false }],
    };
  }
  if (course.universityId === "uni-futa") {
    return {
      ...requirement,
      oLevelSubstitutions: [{ subject: "Biology", alternatives: ["Agricultural Science"], countsTowardPoints: true }],
    };
  }
  return requirement;
}

export const mockRequirements: AdmissionRequirement[] = mockCourses.map((c) => withSubstitutions(requirementFor(c.id)));

export const mockScoringPolicies: ScoringPolicy[] = [
  // Likely: JAMB(÷8) + Post-UTME(÷2), out of 100. O'Level is a pass/fail eligibility gate only -
  // not part of the number (oLevelWeighting: 0 is deliberate, not a placeholder).
  { id: "sp-ui", universityId: "uni-ui", utmeWeighting: 50, postUtmeWeighting: 50, oLevelWeighting: 0, utmeMaxScore: 400, postUtmeMaxScore: 100 },
  // Likely: 50% UTME(÷8) + 30% Post-UTME(÷2) + 20% O'Level. Candidates below 12% in Post-UTME
  // are disqualified regardless of JAMB score — enforced in verifyEligibility, not the score.
  { id: "sp-unilag", universityId: "uni-unilag", utmeWeighting: 50, postUtmeWeighting: 30, oLevelWeighting: 20, utmeMaxScore: 400, postUtmeMaxScore: 100, minPostUtmePercent: 12 },
  // Likely: 50% JAMB(÷8) + 40% Post-UTME (its own raw score, out of 40 - hence postUtmeMaxScore: 40,
  // not 100) + 10% O'Level, A1=10..C6=5 (matches the engine's generic grade table already).
  { id: "sp-oau", universityId: "uni-oau", utmeWeighting: 50, postUtmeWeighting: 40, oLevelWeighting: 10, utmeMaxScore: 400, postUtmeMaxScore: 40 },
  // Doubting (see docs/jamb-data-dossier.md): 75% JAMB(÷400×75) + 25% O'Level, no Post-UTME -
  // two independent sources say FUTA runs no scored Post-UTME, but this is disputed.
  { id: "sp-futa", universityId: "uni-futa", utmeWeighting: 75, postUtmeWeighting: 0, oLevelWeighting: 25, utmeMaxScore: 400, postUtmeMaxScore: 100 },
  // Confirmed, helpdesk.funaab.edu.ng Article ID 30: straight 50% UTME + 50% O'Level, no
  // Post-UTME/screening term. FUNAAB runs an online screening exercise, but it's an
  // eligibility/verification step, not something that contributes to the aggregate.
  {
    id: "sp-funaab",
    universityId: "uni-funaab",
    utmeWeighting: 50,
    postUtmeWeighting: 0,
    oLevelWeighting: 50,
    utmeMaxScore: 400,
    postUtmeMaxScore: 100,
    oLevelGradePoints: { A1: 6, B2: 5, B3: 4, C4: 3, C5: 2, C6: 1, D7: 0, E8: 0, F9: 0 },
    // Same source: two O'Level results (WAEC + NECO) — best grade per subject, minus 1 point.
    twoSittingDeductionPoints: 1,
  },
  // Likely: 60% UTME(÷400×60) + 30% O'Level (A1=6..C6=1) + 10% sitting bonus, no Post-UTME.
  // The sitting bonus is 10 points for one sitting, 6 for two.
  {
    id: "sp-fuoye",
    universityId: "uni-fuoye",
    utmeWeighting: 60,
    postUtmeWeighting: 0,
    oLevelWeighting: 30,
    utmeMaxScore: 400,
    postUtmeMaxScore: 100,
    oLevelGradePoints: { A1: 6, B2: 5, B3: 4, C4: 3, C5: 2, C6: 1, D7: 0, E8: 0, F9: 0 },
    sittingBonus: { oneSitting: 10, twoSittings: 6 },
  },
];

const ELDS_STATES = [
  "Bayelsa", "Borno", "Ebonyi", "Gombe", "Jigawa", "Kebbi", "Kwara", "Sokoto",
  "Taraba", "Yobe", "Zamfara", "Adamawa",
];

export const mockCatchmentRules: CatchmentRule[] = [
  { id: "cr-ui", universityId: "uni-ui", catchmentStates: ["Oyo", "Ogun", "Osun", "Ondo", "Ekiti", "Kwara"], eldsStates: ELDS_STATES, meritQuotaPercent: 45, catchmentQuotaPercent: 35, eldsQuotaPercent: 20 },
  { id: "cr-unilag", universityId: "uni-unilag", catchmentStates: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"], eldsStates: ELDS_STATES, meritQuotaPercent: 45, catchmentQuotaPercent: 35, eldsQuotaPercent: 20 },
  { id: "cr-oau", universityId: "uni-oau", catchmentStates: ["Osun", "Oyo", "Ogun", "Ondo", "Ekiti", "Lagos"], eldsStates: ELDS_STATES, meritQuotaPercent: 45, catchmentQuotaPercent: 35, eldsQuotaPercent: 20 },
  { id: "cr-futa", universityId: "uni-futa", catchmentStates: ["Ondo", "Ekiti", "Osun", "Oyo", "Ogun", "Edo"], eldsStates: ELDS_STATES, meritQuotaPercent: 45, catchmentQuotaPercent: 35, eldsQuotaPercent: 20 },
  { id: "cr-funaab", universityId: "uni-funaab", catchmentStates: ["Ogun", "Lagos", "Oyo", "Osun", "Ondo", "Ekiti"], eldsStates: ELDS_STATES, meritQuotaPercent: 45, catchmentQuotaPercent: 35, eldsQuotaPercent: 20 },
  // Likely (docs/jamb-data-dossier.md): Kwara and Kogi are on FUOYE's ELDS list, not its catchment.
  { id: "cr-fuoye", universityId: "uni-fuoye", catchmentStates: ["Ekiti", "Ondo", "Osun", "Oyo"], eldsStates: [...ELDS_STATES, "Kogi"], meritQuotaPercent: 45, catchmentQuotaPercent: 35, eldsQuotaPercent: 20 },
];
