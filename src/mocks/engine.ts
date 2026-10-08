import type {
  AdmissionRequirement,
  AggregateScoreResult,
  AssessmentContext,
  CandidateProfile,
  CatchmentResult,
  CatchmentRule,
  CatchmentStatus,
  Course,
  CourseRecommendation,
  CutOffBasis,
  OLevelGrade,
  OLevelResult,
  ScoringPolicy,
  VerificationIssue,
  VerificationResult,
} from "@/types/domain";
import { mockCourses } from "./courses";
import { mockCatchmentRules, mockRequirements, mockScoringPolicies } from "./policies";
import { mockUniversities } from "./universities";

// Generic fallback table. Only used when a university's ScoringPolicy.oLevelGradePoints is unset.
const GENERIC_GRADE_POINTS: Record<OLevelGrade, number> = {
  A1: 10,
  B2: 9,
  B3: 8,
  C4: 7,
  C5: 6,
  C6: 5,
  D7: 0,
  E8: 0,
  F9: 0,
};

const CREDIT_GRADES: OLevelGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6"];

/**
 * A university's O'Level grade table isn't always the generic one — FUNAAB's confirmed formula
 * (helpdesk.funaab.edu.ng, Article ID 30) uses A1=6..C6=1 (max 30), not the generic A1=10..C6=5
 * (max 50). Normalizing by each table's own max (best possible score across 5 subjects) keeps
 * the resulting percentage correct regardless of which table is in play.
 */
function resolveGradePointsTable(policy: ScoringPolicy): Record<OLevelGrade, number> {
  if (!policy.oLevelGradePoints) return GENERIC_GRADE_POINTS;
  return { ...GENERIC_GRADE_POINTS, ...policy.oLevelGradePoints };
}

const GRADE_ORDER: OLevelGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

/**
 * One result per subject (keyed case-insensitively), keeping the best grade. A candidate who
 * combines two sittings lists the same subject twice; only the better grade counts.
 */
function bestResultsBySubject(results: OLevelResult[]): Map<string, OLevelResult> {
  const best = new Map<string, OLevelResult>();
  for (const result of results) {
    const key = result.subject.toLowerCase();
    const existing = best.get(key);
    if (!existing || GRADE_ORDER.indexOf(result.grade) < GRADE_ORDER.indexOf(existing.grade)) {
      best.set(key, result);
    }
  }
  return best;
}

/**
 * Mirrors the backend: every compulsory subject present, one subject from each "one of" group,
 * and no subject outside the accepted list. Unmet groups are reported as "A or B" in `missing`.
 */
function checkUtmeSubjects(utmeSubjects: string[], requirement: AdmissionRequirement) {
  const subjects = utmeSubjects.filter((s) => s !== "Use of English");
  const groups = requirement.utmeSubjectGroups ?? [];
  const allowed = [
    ...requirement.requiredUtmeSubjects,
    ...requirement.optionalUtmeSubjects,
    ...groups.flat(),
  ];
  const missing = [
    ...requirement.requiredUtmeSubjects.filter((s) => !subjects.includes(s)),
    ...groups
      .filter((group) => !group.some((s) => subjects.includes(s)))
      .map((g) => g.join(" or ")),
  ];
  const invalid = subjects.filter((s) => !allowed.includes(s));
  return { passed: missing.length === 0 && invalid.length === 0, missing, invalid };
}

interface UsedSubstitution {
  subject: string;
  usedSubject: string;
  countsTowardPoints: boolean;
}

/**
 * Every required O'Level subject needs a credit (C6 or better) — either in the subject itself or
 * in one of the alternatives the course accepts in its place (AdmissionRequirement.oLevelSubstitutions).
 */
function checkOLevelCredits(results: OLevelResult[], requirement: AdmissionRequirement) {
  const best = bestResultsBySubject(results);
  const hasCredit = (subject: string) => {
    const result = best.get(subject.toLowerCase());
    return result !== undefined && CREDIT_GRADES.includes(result.grade);
  };
  const substitutionRules = requirement.oLevelSubstitutions ?? [];

  const missingCredits: string[] = [];
  const substitutions: UsedSubstitution[] = [];
  for (const subject of requirement.requiredOLevelSubjects) {
    if (hasCredit(subject)) continue;
    const rule = substitutionRules.find((r) => r.subject.toLowerCase() === subject.toLowerCase());
    const usedSubject = rule?.alternatives.find(hasCredit);
    if (rule && usedSubject) {
      substitutions.push({ subject, usedSubject, countsTowardPoints: rule.countsTowardPoints });
    } else {
      missingCredits.push(subject);
    }
  }

  const creditCount = [...best.values()].filter((r) => CREDIT_GRADES.includes(r.grade)).length;
  return {
    passed: missingCredits.length === 0 && creditCount >= requirement.minimumCredits,
    missingCredits,
    creditCount,
    substitutions,
  };
}

const SCORED_OLEVEL_SUBJECTS = 5;

/**
 * O'Level points over exactly 5 subjects. Per the dossier (UNILAG and FUNAAB sections) these are
 * the course's own required combination for the candidate's stream, not their 5 best credits
 * overall. Where a course requires fewer than 5 named subjects (e.g. "English, Maths, Economics +
 * 2 relevant subjects"), the remaining slots are filled with the candidate's best other results —
 * the rule base doesn't yet say which subjects count as "relevant" per course.
 *
 * A substitute (e.g. Agriculture for Biology) fills its required subject's slot, scoring its own
 * grade only when the substitution counts toward points; FUNAAB's doesn't, so that slot scores 0.
 * Two sittings cost policy.twoSittingDeductionPoints off the total.
 */
function scoreOLevel(
  profile: CandidateProfile,
  requirement: AdmissionRequirement,
  policy: ScoringPolicy,
) {
  const gradePoints = resolveGradePointsTable(policy);
  const best = bestResultsBySubject(profile.oLevelResults);
  const { substitutions } = checkOLevelCredits(profile.oLevelResults, requirement);

  const used = new Set<string>();
  let points = 0;
  const required = requirement.requiredOLevelSubjects.slice(0, SCORED_OLEVEL_SUBJECTS);
  for (const subject of required) {
    const substitution = substitutions.find((s) => s.subject === subject);
    if (substitution) {
      const key = substitution.usedSubject.toLowerCase();
      used.add(key);
      if (substitution.countsTowardPoints) points += gradePoints[best.get(key)!.grade];
      continue;
    }
    const own = best.get(subject.toLowerCase());
    used.add(subject.toLowerCase());
    if (own) points += gradePoints[own.grade];
  }

  const fillers = [...best.entries()]
    .filter(([key]) => !used.has(key))
    .map(([, result]) => gradePoints[result.grade])
    .sort((a, b) => b - a)
    .slice(0, Math.max(0, SCORED_OLEVEL_SUBJECTS - required.length));
  points += fillers.reduce((sum, p) => sum + p, 0);

  if (profile.oLevelSittings === 2 && policy.twoSittingDeductionPoints) {
    points = Math.max(0, points - policy.twoSittingDeductionPoints);
  }

  const maxPoints = Math.max(...Object.values(gradePoints)) * SCORED_OLEVEL_SUBJECTS;
  return { points, percent: (points / maxPoints) * 100 };
}

export function verifyEligibility(profile: CandidateProfile): VerificationResult {
  const requirement = mockRequirements.find((r) => r.courseId === profile.targetCourseId);
  const policy = mockScoringPolicies.find((p) => p.universityId === profile.targetUniversityId);
  const university = mockUniversities.find((u) => u.id === profile.targetUniversityId);
  // Use Case 2's exception: a course with no rule base can't be verified (mirrors the backend).
  if (!requirement) {
    throw new Error(
      "No admission requirement is configured for this course yet, so eligibility can't be checked. An administrator needs to add one.",
    );
  }
  const issues: VerificationIssue[] = [];

  const utme = checkUtmeSubjects(profile.utmeSubjects, requirement);
  utme.missing.forEach((s) =>
    issues.push({
      code: "UTME_SUBJECT_MISSING",
      severity: "ERROR",
      message: s.includes(" or ")
        ? `You need ${s} in your UTME combination for this course.`
        : `${s} is a compulsory UTME subject for this course but is not in your combination.`,
      field: "utmeSubjects",
    }),
  );
  utme.invalid.forEach((s) =>
    issues.push({
      code: "UTME_SUBJECT_NOT_ACCEPTED",
      severity: "ERROR",
      message: `${s} is not among the UTME subjects accepted for this course. All three subjects besides Use of English must be on the course's list.`,
      field: "utmeSubjects",
    }),
  );

  const oLevel = checkOLevelCredits(profile.oLevelResults, requirement);
  oLevel.missingCredits.forEach((s) =>
    issues.push({
      code: "OLEVEL_CREDIT_MISSING",
      severity: "ERROR",
      message: `You need at least a credit (C6 or better) in ${s}.`,
      field: "oLevelResults",
    }),
  );
  if (oLevel.creditCount < requirement.minimumCredits) {
    issues.push({
      code: "OLEVEL_CREDIT_COUNT",
      severity: "ERROR",
      message: `This course requires ${requirement.minimumCredits} credit passes; you currently have ${oLevel.creditCount}.`,
      field: "oLevelResults",
    });
  }
  oLevel.substitutions.forEach((sub) =>
    issues.push({
      code: "OLEVEL_SUBSTITUTE_USED",
      severity: "WARNING",
      message: sub.countsTowardPoints
        ? `Your ${sub.usedSubject} credit is accepted in place of ${sub.subject} for this course.`
        : `Your ${sub.usedSubject} credit is accepted in place of ${sub.subject} for eligibility, but it adds no points to your O'Level score at this university.`,
      field: "oLevelResults",
    }),
  );
  if (profile.oLevelSittings === 2 && policy?.twoSittingDeductionPoints) {
    issues.push({
      code: "OLEVEL_TWO_SITTINGS",
      severity: "WARNING",
      message: `You combined two O'Level sittings. ${university?.name ?? "This university"} takes your best grade in each subject, then deducts ${policy.twoSittingDeductionPoints} point(s) from your O'Level score.`,
      field: "oLevelResults",
    });
  }

  // Some universities disqualify below a minimum Post-UTME percentage regardless of JAMB score
  // (e.g. UNILAG, Likely 12% — see docs/jamb-data-dossier.md). Only checked when the candidate
  // has actually sat Post-UTME; a null score is "can't score yet," handled elsewhere, not a fail.
  let postUtmePassed = true;
  if (policy?.minPostUtmePercent != null && profile.postUtmeScore !== null) {
    const postUtmePercent = (profile.postUtmeScore / policy.postUtmeMaxScore) * 100;
    postUtmePassed = postUtmePercent >= policy.minPostUtmePercent;
    if (!postUtmePassed) {
      issues.push({
        code: "POST_UTME_BELOW_MINIMUM",
        severity: "ERROR",
        message: `This university disqualifies candidates scoring below ${policy.minPostUtmePercent}% in Post-UTME screening, regardless of JAMB score.`,
        field: "postUtmeScore",
      });
    }
  }

  return {
    eligible: utme.passed && oLevel.passed && postUtmePassed,
    checkedAt: new Date().toISOString(),
    utmeSubjectCheck: { passed: utme.passed, missing: utme.missing, invalid: utme.invalid },
    oLevelCheck: {
      passed: oLevel.passed,
      missingCredits: oLevel.missingCredits,
      creditCount: oLevel.creditCount,
    },
    issues,
  };
}

export function classifyCatchment(profile: CandidateProfile): CatchmentResult {
  const rule = mockCatchmentRules.find((r) => r.universityId === profile.targetUniversityId);
  const university = mockUniversities.find((u) => u.id === profile.targetUniversityId);
  const uniName = university?.name ?? "this university";

  if (rule && rule.eldsStates.includes(profile.stateOfOrigin)) {
    return {
      status: "ELDS",
      reason: `${profile.stateOfOrigin} is on the Educationally Less Developed States list.`,
      explanation: `Candidates from ELDS states compete for a reserved ${rule.eldsQuotaPercent}% of places at ${uniName}, usually at a lower cut-off than merit candidates. You are still considered for merit places first.`,
      quotaSharePercent: rule.eldsQuotaPercent,
    };
  }
  if (
    rule &&
    (rule.catchmentStates.includes(profile.stateOfOrigin) ||
      rule.catchmentStates.includes(profile.schoolLocationState))
  ) {
    return {
      status: "CATCHMENT",
      reason: `${profile.stateOfOrigin} falls inside the catchment area of ${uniName}.`,
      explanation: `About ${rule.catchmentQuotaPercent}% of places go to catchment candidates, so your cut-off is slightly lower than the merit cut-off. You are still considered for merit places first.`,
      quotaSharePercent: rule.catchmentQuotaPercent,
    };
  }
  return {
    status: "MERIT",
    reason: `${profile.stateOfOrigin} is outside both the catchment and ELDS lists for ${uniName}.`,
    explanation: `You will be considered on merit only — roughly ${rule?.meritQuotaPercent ?? 45}% of places, open to candidates nationwide. This is the most competitive route, so your aggregate must clear the full merit cut-off.`,
    quotaSharePercent: rule?.meritQuotaPercent ?? 45,
  };
}

/** Which of the candidate's two states actually matched the catchment list — mirrors classifyCatchment's own matching order. */
function matchedCatchmentState(
  profile: CandidateProfile,
  rule: CatchmentRule | undefined,
): string | null {
  if (!rule) return null;
  if (rule.catchmentStates.includes(profile.stateOfOrigin)) return profile.stateOfOrigin;
  if (rule.catchmentStates.includes(profile.schoolLocationState))
    return profile.schoolLocationState;
  return null;
}

/**
 * Resolves the cut-off that actually applies to this candidate. Some universities (e.g. UNILAG, OAU)
 * publish a distinct cut-off per catchment/ELDS state rather than one flat figure per course — this
 * looks up the candidate's matched state first, falling back to the course's university-wide default.
 */
function resolveCutOff(
  course: Course,
  status: CatchmentStatus,
  profile: CandidateProfile,
  rule: CatchmentRule | undefined,
): { value: number | null; state: string | null } {
  if (status === "MERIT") return { value: course.meritCutOff, state: null };
  if (status === "ELDS") {
    const state = profile.stateOfOrigin;
    const specific = course.eldsCutOffByState?.[state];
    return specific !== undefined
      ? { value: specific, state }
      : { value: course.eldsCutOff, state: null };
  }
  const state = matchedCatchmentState(profile, rule);
  const specific = state ? course.catchmentCutOffByState?.[state] : undefined;
  return specific !== undefined && state !== null
    ? { value: specific, state }
    : { value: course.catchmentCutOff, state: null };
}

interface ApplicableCutOff {
  value: number;
  type: CatchmentStatus;
  basis: CutOffBasis;
  state: string | null;
}

/**
 * The cut-off this candidate is actually judged against. Catchment and ELDS candidates are
 * considered for merit places first, so clearing the merit cut-off is enough for them; otherwise
 * their own status's cut-off applies, falling back to the merit cut-off when the university
 * publishes no separate catchment/ELDS figure for the course (UNILAG, FUTA, FUOYE mostly don't).
 * A course with no 0–100 cut-off at all but a raw JAMB cut-off (Course.utmeCutOff — FUNAAB) is
 * judged on the candidate's UTME score instead. Null when nothing is published yet.
 */
function resolveApplicableCutOff(
  course: Course,
  status: CatchmentStatus,
  profile: CandidateProfile,
  rule: CatchmentRule | undefined,
  aggregate: number,
): ApplicableCutOff | null {
  const merit = course.meritCutOff;
  const meritCutOff = (value: number): ApplicableCutOff => ({
    value,
    type: "MERIT",
    basis: "AGGREGATE",
    state: null,
  });
  if (status === "MERIT") {
    if (merit !== null) return meritCutOff(merit);
  } else {
    if (merit !== null && aggregate >= merit) return meritCutOff(merit);
    const resolved = resolveCutOff(course, status, profile, rule);
    if (resolved.value !== null) {
      return { value: resolved.value, type: status, basis: "AGGREGATE", state: resolved.state };
    }
    if (merit !== null) return meritCutOff(merit);
  }
  if (course.utmeCutOff != null) {
    return { value: course.utmeCutOff, type: status, basis: "UTME", state: null };
  }
  return null;
}

/** Mirrors the backend: refuse rather than silently comparing against null. */
function requireApplicableCutOff(
  cutOff: ApplicableCutOff | null,
  courseName: string,
  status: CatchmentStatus,
) {
  if (cutOff === null) {
    throw new Error(
      `No confirmed ${status.toLowerCase()} cut-off is available yet for "${courseName}" — see docs/jamb-data-dossier.md.`,
    );
  }
  return cutOff;
}

function compareWithCutOff(cutOff: ApplicableCutOff, aggregate: number, utmeScore: number) {
  const score = cutOff.basis === "UTME" ? utmeScore : aggregate;
  return { meetsCutOff: score >= cutOff.value, margin: round(score - cutOff.value) };
}

/** True when this university's formula has a Post-UTME term, so a missing score blocks the aggregate. */
function needsPostUtmeScore(policy: Pick<ScoringPolicy, "postUtmeWeighting">) {
  return policy.postUtmeWeighting > 0;
}

/** Whether an aggregate can be computed yet: false only when the formula needs a Post-UTME score the candidate doesn't have. */
export function canComputeAggregate(profile: CandidateProfile) {
  if (profile.postUtmeScore !== null) return true;
  const policy = mockScoringPolicies.find((p) => p.universityId === profile.targetUniversityId);
  return !policy || !needsPostUtmeScore(policy);
}

/**
 * The aggregate itself, on a 0–100 scale (mirrors the backend's scoreCandidate). postUtme is
 * passed in so the same candidate can be scored under another university's formula. Components
 * with a 0% weighting are left out of the breakdown.
 */
function scoreCandidate(
  profile: CandidateProfile,
  policy: ScoringPolicy,
  requirement: AdmissionRequirement,
  postUtme: { rawScore: number; percent: number },
) {
  const utmePercent = (profile.utmeScore / policy.utmeMaxScore) * 100;
  const { points: oLevelPoints, percent: oLevelPercent } = scoreOLevel(
    profile,
    requirement,
    policy,
  );
  const sittings = profile.oLevelSittings ?? 1;

  const breakdown: AggregateScoreResult["breakdown"] = [
    {
      component: "UTME" as const,
      rawScore: profile.utmeScore,
      weighting: policy.utmeWeighting,
      contribution: round((utmePercent * policy.utmeWeighting) / 100),
    },
    {
      component: "POST_UTME" as const,
      rawScore: postUtme.rawScore,
      weighting: policy.postUtmeWeighting,
      contribution: round((postUtme.percent * policy.postUtmeWeighting) / 100),
    },
    {
      component: "OLEVEL" as const,
      rawScore: oLevelPoints,
      weighting: policy.oLevelWeighting,
      contribution: round((oLevelPercent * policy.oLevelWeighting) / 100),
    },
  ].filter((b) => b.weighting > 0);

  // FUOYE (Likely): 10 points for a single sitting, 6 for two — added straight onto the aggregate.
  const bonus = policy.sittingBonus;
  if (bonus) {
    breakdown.push({
      component: "SITTING_BONUS",
      rawScore: sittings,
      weighting: bonus.oneSitting,
      contribution: sittings === 2 ? bonus.twoSittings : bonus.oneSitting,
    });
  }

  const formulaParts = [
    `UTME ${policy.utmeWeighting}%`,
    ...(policy.postUtmeWeighting > 0 ? [`Post-UTME ${policy.postUtmeWeighting}%`] : []),
    ...(policy.oLevelWeighting > 0 ? [`O'Level ${policy.oLevelWeighting}%`] : []),
    ...(bonus
      ? [`sitting bonus ${bonus.oneSitting}% (${bonus.twoSittings} for two sittings)`]
      : []),
  ];

  return {
    aggregate: round(breakdown.reduce((s, b) => s + b.contribution, 0)),
    breakdown,
    formulaDescription: formulaParts.join(" + "),
  };
}

export function computeAggregate(profile: CandidateProfile): AggregateScoreResult {
  const policy = mockScoringPolicies.find((p) => p.universityId === profile.targetUniversityId);
  const course = mockCourses.find((c) => c.id === profile.targetCourseId);
  const requirement = mockRequirements.find((r) => r.courseId === profile.targetCourseId);
  if (!policy || !course || course.universityId !== profile.targetUniversityId) {
    throw new Error("targetCourseId does not belong to targetUniversityId");
  }
  if (!requirement) {
    throw new Error("No admission requirement is configured for this course yet.");
  }
  if (needsPostUtmeScore(policy) && profile.postUtmeScore === null) {
    throw new Error(
      "This university's formula includes a Post-UTME component, so an aggregate cannot be computed yet.",
    );
  }

  const catchment = classifyCatchment(profile);
  const rule = mockCatchmentRules.find((r) => r.universityId === profile.targetUniversityId);
  const postUtmeRaw = profile.postUtmeScore ?? 0;
  const { aggregate, breakdown, formulaDescription } = scoreCandidate(
    profile,
    policy,
    requirement,
    {
      rawScore: postUtmeRaw,
      percent: (postUtmeRaw / policy.postUtmeMaxScore) * 100,
    },
  );

  const cutOff = requireApplicableCutOff(
    resolveApplicableCutOff(course, catchment.status, profile, rule, aggregate),
    course.name,
    catchment.status,
  );
  const { meetsCutOff, margin } = compareWithCutOff(cutOff, aggregate, profile.utmeScore);

  return {
    aggregate,
    breakdown,
    formulaDescription,
    applicableCutOff: cutOff.value,
    cutOffType: cutOff.type,
    cutOffBasis: cutOff.basis,
    meetsCutOff,
    margin,
  };
}

/** ELDS state of origin first, then catchment by state of origin or school location, else merit. */
function classifyStatus(
  profile: CandidateProfile,
  rule: CatchmentRule | undefined,
): CatchmentStatus {
  if (!rule) return "MERIT";
  if (rule.eldsStates.includes(profile.stateOfOrigin)) return "ELDS";
  if (
    rule.catchmentStates.includes(profile.stateOfOrigin) ||
    rule.catchmentStates.includes(profile.schoolLocationState)
  ) {
    return "CATCHMENT";
  }
  return "MERIT";
}

/**
 * How the candidate stands for another course (mirrors the backend's evaluateCourse): null when
 * they don't meet its requirements, can't be scored under its formula, or it has no cut-off.
 */
function evaluateCourse(profile: CandidateProfile, postUtmePercent: number | null, course: Course) {
  const requirement = mockRequirements.find((r) => r.courseId === course.id);
  const policy = mockScoringPolicies.find((p) => p.universityId === course.universityId);
  if (!requirement || !policy) return null;
  if (!checkUtmeSubjects(profile.utmeSubjects, requirement).passed) return null;
  if (!checkOLevelCredits(profile.oLevelResults, requirement).passed) return null;
  if (needsPostUtmeScore(policy) && postUtmePercent === null) return null;
  if (
    policy.minPostUtmePercent != null &&
    postUtmePercent !== null &&
    postUtmePercent < policy.minPostUtmePercent
  ) {
    return null;
  }

  const rule = mockCatchmentRules.find((r) => r.universityId === course.universityId);
  const status = classifyStatus(profile, rule);
  const percent = needsPostUtmeScore(policy) ? (postUtmePercent ?? 0) : 0;
  const { aggregate } = scoreCandidate(profile, policy, requirement, {
    rawScore: round((percent / 100) * policy.postUtmeMaxScore),
    percent,
  });
  const cutOff = resolveApplicableCutOff(course, status, profile, rule, aggregate);
  if (!cutOff) return null;
  const { meetsCutOff, margin } = compareWithCutOff(cutOff, aggregate, profile.utmeScore);
  return { course, status, aggregate, cutOff, meetsCutOff, margin };
}

/**
 * Mock stand-in for the backend's Decision Tree recommender: same trigger (eligible but below the
 * cut-off), same eligibility filter and per-university scoring, but the match probability is a
 * simple logistic curve over the cut-off margin instead of a trained model — the browser mocks
 * don't ship ml-cart or a training set.
 */
export function recommendCourses(profile: CandidateProfile): CourseRecommendation[] {
  if (!verifyEligibility(profile).eligible || !canComputeAggregate(profile)) return [];
  const score = computeAggregate(profile);
  if (score.meetsCutOff) return [];

  const targetPolicy = mockScoringPolicies.find(
    (p) => p.universityId === profile.targetUniversityId,
  );
  const postUtmePercent =
    profile.postUtmeScore !== null && targetPolicy
      ? (profile.postUtmeScore / targetPolicy.postUtmeMaxScore) * 100
      : null;

  return (
    mockCourses
      // Same university only — each university applies its own formula and cut-offs (mirrors the backend).
      .filter(
        (c) => c.universityId === profile.targetUniversityId && c.id !== profile.targetCourseId,
      )
      .map((course) => evaluateCourse(profile, postUtmePercent, course))
      .filter((e): e is NonNullable<ReturnType<typeof evaluateCourse>> => e !== null)
      .map((e) => {
        const university = mockUniversities.find((u) => u.id === e.course.universityId)!;
        const utmeBasis = e.cutOff.basis === "UTME";
        const normalizedMargin = utmeBasis ? e.margin / 4 : e.margin;
        const matchProbability = 1 / (1 + Math.exp(-normalizedMargin / 2.5));
        const candidateScore = utmeBasis ? profile.utmeScore : e.aggregate;
        const what = utmeBasis ? "UTME score" : "aggregate";
        const rationale = [
          e.margin >= 0
            ? `Your ${what} of ${candidateScore} is ${round(e.margin)} point(s) above the ${e.cutOff.value} cut-off.`
            : `Your ${what} of ${candidateScore} is ${Math.abs(round(e.margin))} point(s) short of the ${e.cutOff.value} cut-off.`,
          `${university.name} classifies you as ${e.status.toLowerCase()} and its formula gives you ${e.aggregate}/100.`,
        ];
        return {
          rank: 0,
          courseId: e.course.id,
          courseName: e.course.name,
          universityCode: university.code,
          faculty: e.course.faculty,
          matchProbability: round(matchProbability, 2),
          requiredAggregate: e.cutOff.value,
          candidateScore,
          cutOffBasis: e.cutOff.basis,
          lowConfidence: false,
          rationale,
          margin: e.margin,
        };
      })
      .sort((a, b) => b.matchProbability - a.matchProbability || b.margin - a.margin)
      .slice(0, 8)
      .map(({ margin: _margin, ...r }, i) => ({ ...r, rank: i + 1 }))
  );
}

export function buildAssessmentContext(profile: CandidateProfile): AssessmentContext {
  const course = mockCourses.find((c) => c.id === profile.targetCourseId)!;
  const university = mockUniversities.find((u) => u.id === profile.targetUniversityId)!;
  const requirement = mockRequirements.find((r) => r.courseId === profile.targetCourseId)!;
  const rule = mockCatchmentRules.find((r) => r.universityId === profile.targetUniversityId);

  return {
    candidateName: profile.fullName,
    stateOfOrigin: profile.stateOfOrigin,
    courseId: course.id,
    courseName: course.name,
    faculty: course.faculty,
    universityId: university.id,
    universityCode: university.code,
    universityName: university.name,
    catchmentStates: rule?.catchmentStates ?? [],
    requiredUtmeSubjects: requirement.requiredUtmeSubjects,
    optionalUtmeSubjects: requirement.optionalUtmeSubjects,
    requiredOLevelSubjects: requirement.requiredOLevelSubjects,
    minimumCredits: requirement.minimumCredits,
    cutOffs: {
      merit: resolveCutOff(course, "MERIT", profile, rule).value,
      catchment: resolveCutOff(course, "CATCHMENT", profile, rule).value,
      elds: resolveCutOff(course, "ELDS", profile, rule).value,
    },
    utmeCutOff: course.utmeCutOff ?? null,
    cutOffStates: {
      catchment: resolveCutOff(course, "CATCHMENT", profile, rule).state,
      elds: resolveCutOff(course, "ELDS", profile, rule).state,
    },
    quotaPercents: {
      merit: rule?.meritQuotaPercent ?? 45,
      catchment: rule?.catchmentQuotaPercent ?? 35,
      elds: rule?.eldsQuotaPercent ?? 20,
    },
  };
}

function round(n: number, dp = 1) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
