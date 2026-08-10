import type { OLevelGrade } from "@/types/domain";

export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT (Abuja)",
] as const;

export const COMPULSORY_UTME_SUBJECT = "Use of English";

export const UTME_ELECTIVE_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature in English",
  "Government",
  "Economics",
  "Further Mathematics",
  "Technical Drawing",
  "Christian Religious Studies",
  "History",
  "Yoruba",
  "Geography",
  "Commerce",
  "Agricultural Science",
] as const;

export const OLEVEL_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Literature in English",
  "Government",
  "Agricultural Science",
  "Further Mathematics",
  "Geography",
  "Civic Education",
  "Commerce",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Christian Religious Studies",
  "Technical Drawing",
  "Home Economics",
  "Food and Nutrition",
] as const;

export const OLEVEL_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"] as const;

export const CREDIT_GRADES: ReadonlySet<string> = new Set(["A1", "B2", "B3", "C4", "C5", "C6"]);

export const GRADE_POINTS: Record<OLevelGrade, number> = {
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

export const MAX_OLEVEL_ROWS = 9;

export const UTME_LOW_SCORE_WARNING_THRESHOLD = 140;

export const PROCESSING_STAGES = [
  "Verifying subject combination",
  "Computing aggregate",
  "Classifying catchment",
  "Generating recommendations",
] as const;

export const PROCESSING_STAGE_DURATION_MS = 650;
