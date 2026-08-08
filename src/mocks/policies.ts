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

export const mockRequirements: AdmissionRequirement[] = mockCourses.map((c) => requirementFor(c.id));

export const mockScoringPolicies: ScoringPolicy[] = [
  { id: "sp-ui", universityId: "uni-ui", utmeWeighting: 50, postUtmeWeighting: 30, oLevelWeighting: 20, utmeMaxScore: 400, postUtmeMaxScore: 100 },
  { id: "sp-unilag", universityId: "uni-unilag", utmeWeighting: 60, postUtmeWeighting: 40, oLevelWeighting: 0, utmeMaxScore: 400, postUtmeMaxScore: 100 },
  { id: "sp-oau", universityId: "uni-oau", utmeWeighting: 50, postUtmeWeighting: 30, oLevelWeighting: 20, utmeMaxScore: 400, postUtmeMaxScore: 100 },
  { id: "sp-futa", universityId: "uni-futa", utmeWeighting: 50, postUtmeWeighting: 20, oLevelWeighting: 30, utmeMaxScore: 400, postUtmeMaxScore: 100 },
  { id: "sp-funaab", universityId: "uni-funaab", utmeWeighting: 60, postUtmeWeighting: 20, oLevelWeighting: 20, utmeMaxScore: 400, postUtmeMaxScore: 100 },
  { id: "sp-fuoye", universityId: "uni-fuoye", utmeWeighting: 70, postUtmeWeighting: 10, oLevelWeighting: 20, utmeMaxScore: 400, postUtmeMaxScore: 100 },
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
  { id: "cr-fuoye", universityId: "uni-fuoye", catchmentStates: ["Ekiti", "Ondo", "Osun", "Oyo", "Kwara", "Kogi"], eldsStates: ELDS_STATES, meritQuotaPercent: 45, catchmentQuotaPercent: 35, eldsQuotaPercent: 20 },
];
