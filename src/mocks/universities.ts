import type { University } from "@/types/domain";

export const mockUniversities: University[] = [
  { id: "uni-ui", code: "UI", name: "University of Ibadan", locationState: "Oyo" },
  { id: "uni-unilag", code: "UNILAG", name: "University of Lagos", locationState: "Lagos" },
  { id: "uni-oau", code: "OAU", name: "Obafemi Awolowo University", locationState: "Osun" },
  {
    id: "uni-futa",
    code: "FUTA",
    name: "Federal University of Technology, Akure",
    locationState: "Ondo",
  },
  {
    id: "uni-funaab",
    code: "FUNAAB",
    name: "Federal University of Agriculture, Abeokuta",
    locationState: "Ogun",
  },
  { id: "uni-fuoye", code: "FUOYE", name: "Federal University Oye-Ekiti", locationState: "Ekiti" },
];

export const universityByCode = Object.fromEntries(
  mockUniversities.map((u) => [u.code, u]),
) as Record<University["code"], University>;
