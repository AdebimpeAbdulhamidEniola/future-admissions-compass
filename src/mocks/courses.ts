import type { Course } from "@/types/domain";

export const mockCourses: Course[] = [
  // University of Ibadan
  { id: "c-ui-med", universityId: "uni-ui", name: "Medicine and Surgery", faculty: "Clinical Sciences", meritCutOff: 78, catchmentCutOff: 75, eldsCutOff: 72 },
  { id: "c-ui-law", universityId: "uni-ui", name: "Law", faculty: "Law", meritCutOff: 74, catchmentCutOff: 71, eldsCutOff: 68 },
  { id: "c-ui-cs", universityId: "uni-ui", name: "Computer Science", faculty: "Science", meritCutOff: 71, catchmentCutOff: 68, eldsCutOff: 65 },
  { id: "c-ui-eco", universityId: "uni-ui", name: "Economics", faculty: "Social Sciences", meritCutOff: 68, catchmentCutOff: 65, eldsCutOff: 62 },
  { id: "c-ui-agric", universityId: "uni-ui", name: "Agricultural Economics", faculty: "Agriculture", meritCutOff: 58, catchmentCutOff: 55, eldsCutOff: 52 },

  // University of Lagos
  { id: "c-unilag-med", universityId: "uni-unilag", name: "Medicine and Surgery", faculty: "Clinical Sciences", meritCutOff: 77, catchmentCutOff: 74, eldsCutOff: 71 },
  { id: "c-unilag-acc", universityId: "uni-unilag", name: "Accounting", faculty: "Management Sciences", meritCutOff: 72, catchmentCutOff: 69, eldsCutOff: 66 },
  { id: "c-unilag-cs", universityId: "uni-unilag", name: "Computer Science", faculty: "Science", meritCutOff: 73, catchmentCutOff: 70, eldsCutOff: 67 },
  { id: "c-unilag-mass", universityId: "uni-unilag", name: "Mass Communication", faculty: "Social Sciences", meritCutOff: 70, catchmentCutOff: 67, eldsCutOff: 64 },
  { id: "c-unilag-bot", universityId: "uni-unilag", name: "Botany", faculty: "Science", meritCutOff: 57, catchmentCutOff: 54, eldsCutOff: 51 },

  // Obafemi Awolowo University
  { id: "c-oau-med", universityId: "uni-oau", name: "Medicine and Surgery", faculty: "Clinical Sciences", meritCutOff: 76, catchmentCutOff: 73, eldsCutOff: 70 },
  { id: "c-oau-law", universityId: "uni-oau", name: "Law", faculty: "Law", meritCutOff: 72, catchmentCutOff: 69, eldsCutOff: 66 },
  { id: "c-oau-eee", universityId: "uni-oau", name: "Electronic and Electrical Engineering", faculty: "Technology", meritCutOff: 70, catchmentCutOff: 67, eldsCutOff: 64 },
  { id: "c-oau-eng", universityId: "uni-oau", name: "English Language", faculty: "Arts", meritCutOff: 61, catchmentCutOff: 58, eldsCutOff: 55 },
  { id: "c-oau-zoo", universityId: "uni-oau", name: "Zoology", faculty: "Science", meritCutOff: 55, catchmentCutOff: 52, eldsCutOff: 49 },

  // FUTA
  { id: "c-futa-ce", universityId: "uni-futa", name: "Computer Engineering", faculty: "Engineering", meritCutOff: 69, catchmentCutOff: 66, eldsCutOff: 63 },
  { id: "c-futa-cs", universityId: "uni-futa", name: "Computer Science", faculty: "Computing", meritCutOff: 68, catchmentCutOff: 65, eldsCutOff: 62 },
  { id: "c-futa-arch", universityId: "uni-futa", name: "Architecture", faculty: "Environmental Technology", meritCutOff: 65, catchmentCutOff: 62, eldsCutOff: 59 },
  { id: "c-futa-stat", universityId: "uni-futa", name: "Statistics", faculty: "Physical Sciences", meritCutOff: 56, catchmentCutOff: 53, eldsCutOff: 50 },
  { id: "c-futa-food", universityId: "uni-futa", name: "Food Science and Technology", faculty: "Agriculture and Agricultural Technology", meritCutOff: 54, catchmentCutOff: 51, eldsCutOff: 48 },

  // FUNAAB
  { id: "c-funaab-vet", universityId: "uni-funaab", name: "Veterinary Medicine", faculty: "Veterinary Medicine", meritCutOff: 67, catchmentCutOff: 64, eldsCutOff: 61 },
  { id: "c-funaab-cs", universityId: "uni-funaab", name: "Computer Science", faculty: "Physical Sciences", meritCutOff: 64, catchmentCutOff: 61, eldsCutOff: 58 },
  { id: "c-funaab-nut", universityId: "uni-funaab", name: "Nutrition and Dietetics", faculty: "Agriculture", meritCutOff: 58, catchmentCutOff: 55, eldsCutOff: 52 },
  { id: "c-funaab-crop", universityId: "uni-funaab", name: "Crop Protection", faculty: "Agriculture", meritCutOff: 51, catchmentCutOff: 48, eldsCutOff: 45 },

  // FUOYE
  { id: "c-fuoye-law", universityId: "uni-fuoye", name: "Law", faculty: "Law", meritCutOff: 66, catchmentCutOff: 63, eldsCutOff: 60 },
  { id: "c-fuoye-cs", universityId: "uni-fuoye", name: "Computer Science", faculty: "Science", meritCutOff: 61, catchmentCutOff: 58, eldsCutOff: 55 },
  { id: "c-fuoye-me", universityId: "uni-fuoye", name: "Mechanical Engineering", faculty: "Engineering", meritCutOff: 59, catchmentCutOff: 56, eldsCutOff: 53 },
  { id: "c-fuoye-pol", universityId: "uni-fuoye", name: "Political Science", faculty: "Social Sciences", meritCutOff: 52, catchmentCutOff: 49, eldsCutOff: 46 },
  { id: "c-fuoye-anim", universityId: "uni-fuoye", name: "Animal Science", faculty: "Agriculture", meritCutOff: 48, catchmentCutOff: 45, eldsCutOff: 42 },
];

export function lowestCutOffFor(universityId: string): number {
  const cutOffs = mockCourses.filter((c) => c.universityId === universityId).map((c) => c.eldsCutOff);
  return Math.min(...cutOffs);
}
