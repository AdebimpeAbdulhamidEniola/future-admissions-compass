import type {
  AggregateScoreResult,
  CandidateProfile,
  CatchmentResult,
  CourseRecommendation,
  OLevelGrade,
  VerificationIssue,
  VerificationResult,
} from "@/types/domain";
import { mockCourses } from "./courses";
import { mockCatchmentRules, mockRequirements, mockScoringPolicies } from "./policies";
import { mockUniversities } from "./universities";

const GRADE_POINTS: Record<OLevelGrade, number> = {
  A1: 10, B2: 9, B3: 8, C4: 7, C5: 6, C6: 5, D7: 0, E8: 0, F9: 0,
};

const CREDIT_GRADES: OLevelGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6"];

export function verifyEligibility(profile: CandidateProfile): VerificationResult {
  const requirement = mockRequirements.find((r) => r.courseId === profile.targetCourseId);
  const issues: VerificationIssue[] = [];

  const subjects = profile.utmeSubjects.filter((s) => s !== "Use of English");
  const required = requirement?.requiredUtmeSubjects ?? [];
  const allowed = [...required, ...(requirement?.optionalUtmeSubjects ?? [])];

  const missing = required.filter((s) => !subjects.includes(s));
  const invalid = subjects.filter((s) => !allowed.includes(s));

  missing.forEach((s) =>
    issues.push({
      code: "UTME_SUBJECT_MISSING",
      severity: "ERROR",
      message: `${s} is a compulsory UTME subject for this course but is not in your combination.`,
      field: "utmeSubjects",
    }),
  );
  invalid.forEach((s) =>
    issues.push({
      code: "UTME_SUBJECT_NOT_ACCEPTED",
      severity: "WARNING",
      message: `${s} is not among the subjects accepted for this course, so it will not count.`,
      field: "utmeSubjects",
    }),
  );

  const credits = profile.oLevelResults.filter((r) => CREDIT_GRADES.includes(r.grade));
  const creditSubjects = credits.map((r) => r.subject);
  const missingCredits = (requirement?.requiredOLevelSubjects ?? []).filter(
    (s) => !creditSubjects.includes(s),
  );
  const minimumCredits = requirement?.minimumCredits ?? 5;

  missingCredits.forEach((s) =>
    issues.push({
      code: "OLEVEL_CREDIT_MISSING",
      severity: "ERROR",
      message: `You need at least a credit (C6 or better) in ${s}.`,
      field: "oLevelResults",
    }),
  );
  if (credits.length < minimumCredits) {
    issues.push({
      code: "OLEVEL_CREDIT_COUNT",
      severity: "ERROR",
      message: `This course requires ${minimumCredits} credit passes; you currently have ${credits.length}.`,
      field: "oLevelResults",
    });
  }

  const utmePassed = missing.length === 0;
  const oLevelPassed = missingCredits.length === 0 && credits.length >= minimumCredits;

  return {
    eligible: utmePassed && oLevelPassed,
    checkedAt: new Date().toISOString(),
    utmeSubjectCheck: { passed: utmePassed, missing, invalid },
    oLevelCheck: { passed: oLevelPassed, missingCredits, creditCount: credits.length },
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
      explanation: `Candidates from ELDS states compete for a reserved ${rule.eldsQuotaPercent}% of places at ${uniName}, usually at a lower cut-off than merit candidates.`,
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

export function computeAggregate(profile: CandidateProfile): AggregateScoreResult {
  const policy = mockScoringPolicies.find((p) => p.universityId === profile.targetUniversityId)!;
  const course = mockCourses.find((c) => c.id === profile.targetCourseId)!;
  const catchment = classifyCatchment(profile);

  const utmePercent = (profile.utmeScore / policy.utmeMaxScore) * 100;
  const postUtmePercent = ((profile.postUtmeScore ?? 0) / policy.postUtmeMaxScore) * 100;
  const oLevelPoints = profile.oLevelResults
    .slice(0, 5)
    .reduce((sum, r) => sum + GRADE_POINTS[r.grade], 0);
  const oLevelPercent = (oLevelPoints / 50) * 100;

  const breakdown: AggregateScoreResult["breakdown"] = [
    {
      component: "UTME",
      rawScore: profile.utmeScore,
      weighting: policy.utmeWeighting,
      contribution: round((utmePercent * policy.utmeWeighting) / 100),
    },
    {
      component: "POST_UTME",
      rawScore: profile.postUtmeScore ?? 0,
      weighting: policy.postUtmeWeighting,
      contribution: round((postUtmePercent * policy.postUtmeWeighting) / 100),
    },
    {
      component: "OLEVEL",
      rawScore: oLevelPoints,
      weighting: policy.oLevelWeighting,
      contribution: round((oLevelPercent * policy.oLevelWeighting) / 100),
    },
  ];

  const aggregate = round(breakdown.reduce((s, b) => s + b.contribution, 0));
  const applicableCutOff =
    catchment.status === "MERIT"
      ? course.meritCutOff
      : catchment.status === "CATCHMENT"
        ? course.catchmentCutOff
        : course.eldsCutOff;

  return {
    aggregate,
    breakdown,
    formulaDescription: `UTME ${policy.utmeWeighting}% + Post-UTME ${policy.postUtmeWeighting}% + O'Level ${policy.oLevelWeighting}%`,
    applicableCutOff,
    cutOffType: catchment.status,
    meetsCutOff: aggregate >= applicableCutOff,
    margin: round(aggregate - applicableCutOff),
  };
}

export function recommendCourses(profile: CandidateProfile): CourseRecommendation[] {
  const score = computeAggregate(profile);
  const catchment = classifyCatchment(profile);

  return mockCourses
    .filter((c) => c.id !== profile.targetCourseId)
    .map((course) => {
      const university = mockUniversities.find((u) => u.id === course.universityId)!;
      const cutOff =
        catchment.status === "MERIT"
          ? course.meritCutOff
          : catchment.status === "CATCHMENT"
            ? course.catchmentCutOff
            : course.eldsCutOff;
      const headroom = score.aggregate - cutOff;
      const matchProbability = clamp(0.5 + headroom / 30, 0.02, 0.97);
      const rationale = [
        headroom >= 0
          ? `Your aggregate of ${score.aggregate} is ${round(headroom)} point(s) above the ${cutOff} cut-off.`
          : `Your aggregate of ${score.aggregate} is ${Math.abs(round(headroom))} point(s) short of the ${cutOff} cut-off.`,
        `${university.name} applies a ${catchment.status.toLowerCase()} cut-off in your case.`,
      ];
      return {
        rank: 0,
        courseId: course.id,
        courseName: course.name,
        universityCode: university.code,
        faculty: course.faculty,
        matchProbability: round(matchProbability, 2),
        requiredAggregate: cutOff,
        rationale,
      };
    })
    .sort((a, b) => b.matchProbability - a.matchProbability)
    .slice(0, 8)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

function round(n: number, dp = 1) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
