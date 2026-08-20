# JAMB Data Dossier

Backend seed-data specification for the PlaceRight IDSS. The complete 210-course catalog (35 per university, 5 per faculty × 7 faculties, across 6 universities), each university's scoring formula, and national policy — sourced and confidence-flagged. OAU's course list is final; its cut-off/formula research was stopped mid-run and hasn't been re-run.

- **Compiled:** 2026-08-13
- **Target cycle:** 2025/26–2026/27 UTME
- **Scope:** 210 courses · 35/university · 7 faculties · 6 universities
- **Status:** cut-offs & formulas complete for UI, UNILAG, FUTA, FUNAAB, FUOYE · OAU partial

**Confidence key:** **Confirmed** — read directly off an official university page/PDF. **Likely** — consistent across independent secondary sources, official page unreachable. **Uncertain** — conflicting sources. **Absent** — genuinely doesn't exist at that university (faculty gap, or a course name that turned out not to be real there).

> **Why cut-off scales aren't comparable across universities:** not a data error — it's the exact problem the thesis is about (Ch.1.2). UI and UNILAG publish a 0–100 aggregate on their own formula. FUNAAB publishes the raw UTME/JAMB floor (0–400) per course, with no aggregate published at all. FUTA has both a 0–100 aggregate scale and a separate unofficial "estimated competitive JAMB score" floating around. FUOYE has both a UTME floor (0–400) and its own 0–100 aggregate. Every course below states which scale its number is on.

---

## National policy

*Applies to all six universities.*

**JAMB national minimum cut-off** — **Confirmed**
150 out of 400 for the 2026/2027 cycle (Polytechnics/NCE sit at 100). OAU, UI, and UNILAG all set their own institutional floor at 200.
*Sources: Channels Television · The Nation · Legit.ng*

**Merit / Catchment / ELDS quota split** — **Likely**
Repeated almost everywhere: 45% Merit / 35% Catchment / 20% ELDS. A minority of sources cite 45/25/20/10 with a Vice-Chancellor's-discretion slice instead. No primary NUC/FCC document reachable to confirm either.
*Sources: The Guardian Nigeria · Allschool.ng · SchoolBegin · ismyschool.net*

**Official ELDS state list** — **Uncertain**
The 23-state list repeated most often: Adamawa, Bauchi, Bayelsa, Benue, Borno, Cross River, Ebonyi, Gombe, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara, Nasarawa, Niger, Plateau, Rivers, Sokoto, Taraba, Yobe, Zamfara. One source traces its origin to a 2023 social-media post, not JAMB/NUC.
*Sources: ismyschool.net · Legit.ng · schoolbeginners.com*

---

## University of Ibadan (UI · Oyo State)

**Formula** — **Likely**: `Aggregate = (JAMB ÷ 8) + (Post-UTME ÷ 2)`, out of 100 (corrected from an earlier ÷75 estimate). O'Level is a pass/fail eligibility gate only, not part of the number. Sourced from UI's own official 2025/26 cut-off PDF (numbers only; the formula itself is secondary-sourced). Two course names in the original list don't exist verbatim at UI — swapped for their real equivalents below.

| Faculty | Course | Cut-off (Merit) | Note |
|---|---|---:|---|
| Clinical Sciences | Medicine and Surgery | 78.875 | |
| Clinical Sciences | Dentistry | 68.625 | |
| Clinical Sciences | Nursing Science | 71.375 | |
| Clinical Sciences | Physiotherapy | 65.125 | |
| Clinical Sciences | Pharmacy | 69.125 | |
| Law | Law | 70.875 | Only 1 real program |
| Engineering & Technology | Civil Engineering | 63.25 | |
| Engineering & Technology | Mechanical Engineering | 70.5 | |
| Engineering & Technology | Electrical and Electronic Engineering | 70 | |
| Engineering & Technology | Agricultural and Environmental Engineering | 56.875 | |
| Engineering & Technology | Petroleum Engineering | 62.75 | |
| Arts | English | 56.5 | |
| Arts | History | 50 | |
| Arts | Linguistics and African Languages | 56.875 | Listed as "Linguistics" |
| Arts | Theatre Arts | 56 | |
| Arts | Religious Studies | 50 | |
| Arts | Music | 50 | Law-shortfall reallocation |
| Social & Management Sciences | Economics | 58.125 | |
| Social & Management Sciences | Political Science | 55.375 | |
| Social & Management Sciences | Psychology | 54.5 | |
| Social & Management Sciences | Sociology | 51 | |
| Social & Management Sciences | Geography | 50 | |
| Science | Chemistry | 50 | |
| Science | Physics | 51 | |
| Science | Microbiology | 50.5 | |
| Science | Computer Science | 63.5 | |
| Science | Mathematics | 51 | |
| Science | Statistics | 50 | Law-shortfall reallocation |
| Science | Botany | 50 | Law-shortfall reallocation |
| Agriculture | Agricultural Economics | 51.375 | Listed as "Agric. Economics" |
| Agriculture | Crop and Horticultural Sciences | 50 | **Renamed** from "Agronomy" — no program by that exact name exists at UI |
| Agriculture | Animal Science | 50 | |
| Agriculture | Crop Protection and Environmental Biology | 50 | |
| Agriculture | Aquaculture and Fisheries Management | 50 | Faculty of Renewable Natural Resources |
| Agriculture | Forest Production and Products | 50 | **Renamed** from "Forest Resources Management" — no program by that exact name exists; Faculty of Renewable Natural Resources |

**Catchment/ELDS** — **Uncertain**: app currently guesses Oyo, Ogun, Osun, Ondo, Ekiti, Kwara; not yet independently verified. UI publishes separate, lower cut-offs for Catchment/ELDS on competitive courses (e.g. Law 70.875 merit / 67.625 ELDS) — only Merit is shown above.

---

## University of Lagos (UNILAG · Lagos State)

**Formula** — **Likely**: `50% UTME (÷8) + 30% Post-UTME (÷2) + 20% O'Level` (best 5 subjects, A1=4.0…C6=2.0, averaged), out of 100. This corrects an earlier 60/40/0 guess — O'Level does count. Candidates below 12% in Post-UTME screening are disqualified regardless of JAMB score.

| Faculty | Course | Cut-off | Note |
|---|---|---:|---|
| Clinical Sciences | Medicine and Surgery | 85.025 | |
| Clinical Sciences | Dentistry and Dental Surgery | 76.65 | Listed as "Dental Science" |
| Clinical Sciences | Nursing Science | 79.8 | |
| Clinical Sciences | Physiotherapy | 74.725 | |
| Clinical Sciences | Medical Laboratory Science | 74.375 | |
| Clinical Sciences | Pharmacy | 76.4 | Agriculture-shortfall reallocation |
| Law | Law | 78.225 | Only 1 real program |
| Engineering & Technology | Civil and Environmental Engineering | 75.625 | |
| Engineering & Technology | Mechanical Engineering | 78.525 | |
| Engineering & Technology | Electrical and Electronics Engineering | 79.5 | |
| Engineering & Technology | Chemical Engineering | 72.8 | |
| Engineering & Technology | Surveying and Geoinformatics Engineering | 58.125 | |
| Engineering & Technology | Metallurgical and Materials Engineering | 59.8 | Agriculture-shortfall reallocation |
| Arts | English | 68.175 | |
| Arts | History and Strategic Studies | 70.725 | |
| Arts | Philosophy | 66.075 | |
| Arts | Linguistics, African and Asian Studies | 72.55 | Flagship "Linguistics" track; dept also runs Yoruba (64.1) and Chinese (68.95) |
| Arts | Religious Studies | 54.625 | **Split program** — CRS 54.625 / IRS 54.675, no combined figure |
| Arts | European Languages and Integrated Studies | 60.225 | **Split program** — French 60.225 / German 60.95 / Russian 58.775; Agriculture-shortfall reallocation |
| Social & Management Sciences | Accounting | 75.7 | |
| Social & Management Sciences | Business Administration | 69.3 | |
| Social & Management Sciences | Actuarial Science and Insurance | 64.925 | **Split program** — Actuarial Science 64.925 / Insurance 65.85 |
| Social & Management Sciences | Banking and Finance | 70.35 | Law-shortfall reallocation |
| Social & Management Sciences | Industrial Relations and Personnel Management | 60.775 | Law-shortfall reallocation |
| Social & Management Sciences | Economics | 73.475 | Law-shortfall reallocation |
| Social & Management Sciences | Psychology | 69.7 | Law-shortfall reallocation |
| Social & Management Sciences | Political Science | 68.15 | Law-shortfall reallocation |
| Science | Computer Science | 83.425 | |
| Science | Physics | 60.25 | |
| Science | Chemistry | 59.5 | |
| Science | Mathematics | 63.675 | |
| Science | Biochemistry | 69.4 | Agriculture-shortfall reallocation |
| Science | Botany | 51.45 | Agriculture-shortfall reallocation |
| Science | Zoology | 57.25 | Agriculture-shortfall reallocation |
| Science | Marine Sciences / Marine Biology | 55.45 | Closest real substitute for Agriculture |

**Catchment/ELDS** — **Uncertain**: app currently guesses Lagos, Ogun, Oyo, Osun, Ondo, Ekiti; not yet independently verified.

---

## Obafemi Awolowo University (OAU · Osun State)

**Research stopped mid-run** — only the course list is final for OAU; cut-offs and formula weren't re-researched.

| Faculty | Course |
|---|---|
| Clinical Sciences | Medicine and Surgery |
| Clinical Sciences | Dentistry / Dental Surgery |
| Clinical Sciences | Nursing Science |
| Clinical Sciences | Medical Rehabilitation (Physiotherapy/OT) |
| Clinical Sciences | Pharmacy |
| Law | Law |
| Engineering & Technology | Civil Engineering |
| Engineering & Technology | Mechanical Engineering |
| Engineering & Technology | Electronic and Electrical Engineering |
| Engineering & Technology | Chemical Engineering |
| Engineering & Technology | Agricultural and Environmental Engineering |
| Arts | English Language |
| Arts | History |
| Arts | Linguistics and African Languages |
| Arts | Philosophy |
| Arts | Religious Studies |
| Arts | Dramatic Arts |
| Arts | Music |
| Social & Management Sciences | Economics |
| Social & Management Sciences | Accounting |
| Social & Management Sciences | Business Administration |
| Social & Management Sciences | Political Science |
| Social & Management Sciences | Sociology and Anthropology |
| Science | Chemistry |
| Science | Physics |
| Science | Microbiology |
| Science | Zoology |
| Science | Mathematics |
| Science | Botany |
| Science | Geology |
| Agriculture | Agricultural Economics |
| Agriculture | Animal Sciences |
| Agriculture | Crop Production and Protection |
| Agriculture | Soil Science and Land Resources Management |
| Agriculture | Agricultural Extension and Rural Development |

**Cut-offs / formula** — **Uncertain**: Microbiology has two conflicting figures (170 UTME threshold vs. 234 aggregate). Formula disputed: 50% JAMB/40% Post-UTME/10% O'Level vs. JAMB÷8 + Post-UTME÷2. The rest of the 35 courses have no cut-off sourced yet.

---

## Federal University of Technology, Akure (FUTA · Ondo State)

**Formula** — **Likely**: `75% JAMB (÷400×75) + 25% O'Level` (best 5, grade-point average). FUTA runs no written Post-UTME anymore — screening is JAMB score + O'Level via CAPS only. The "JAMB÷8 + Post-UTME÷2" formula still repeated by aggregator sites is a stale, pre-CAPS-era formula. Two incompatible cut-off scales circulate (a 0–100 aggregate, and an unofficial "estimated competitive JAMB score" out of 400) — both shown since neither is officially confirmed.

"Financial Management" was replaced with "Procurement Management Technology" (confirmed real; the former doesn't exist at FUTA).

| Faculty | Course | Aggregate (0–100) | Est. JAMB (0–400) | Note |
|---|---|---:|---:|---|
| Clinical Sciences | Medicine and Surgery (MBBS) | — | ~250–260 | **Admission suspended 2026/27** |
| Clinical Sciences | Nursing Science | 75.00 | 220–240 | New program, 2025/26 |
| Clinical Sciences | Human Anatomy | 59.5 | ~260 | |
| Clinical Sciences | Physiology | 57.25 | 230 | |
| Law | — | — | — | No Law faculty exists |
| Engineering & Technology | Civil Engineering | 71.87 | 235 | |
| Engineering & Technology | Mechanical Engineering | 73.75 | 240 | |
| Engineering & Technology | Electrical/Electronics Engineering | 74.37 | 245 | |
| Engineering & Technology | Chemical Engineering | — | — | No figure found despite repeated search |
| Engineering & Technology | Agricultural Engineering | 55.12 | 210 | |
| Engineering & Technology | Computer Engineering | 69.62 | 250 | Law/Arts-shortfall reallocation |
| Engineering & Technology | Industrial and Production Engineering | 47.5 | — | Law/Arts-shortfall reallocation |
| Engineering & Technology | Metallurgical and Materials Engineering | 54.87 | — | Law/Arts-shortfall reallocation |
| Engineering & Technology | Mining Engineering | 54.75 | — | Law/Arts-shortfall reallocation |
| Engineering & Technology | Mechatronics Engineering | — | — | No figure found; department confirmed to exist |
| Arts | — | — | — | No Arts/Humanities faculty exists |
| Social & Management Sciences | Business Information Technology | — | 210 | Estimate only |
| Social & Management Sciences | Entrepreneurship Management Technology | — | 190 | Estimate only |
| Social & Management Sciences | Logistics and Transport Technology | — | 190 | Estimate only |
| Social & Management Sciences | Project Management Technology | — | 200 | Estimate only |
| Social & Management Sciences | Procurement Management Technology | — | — | Replaces "Financial Management"; new 2025/26, no cut-off found yet |
| Science | Physics | 47.5 | 200 | |
| Science | Chemistry | 47.5 | — | |
| Science | Mathematics | 59 | 200 | |
| Science | Statistics | 47.5 | 200 | |
| Science | Biochemistry | 63.37 | 225 | |
| Science | Biology | 47.5 | — | |
| Science | Microbiology | 63 | 220 | Law/Arts-shortfall reallocation |
| Science | Biotechnology | 47.5 | — | Law/Arts-shortfall reallocation |
| Science | Computer Science | 69 | 220–240 | Law/Arts-shortfall reallocation |
| Science | Cybersecurity | 63.75 | 240 | Law/Arts-shortfall reallocation |
| Agriculture | Animal Production and Health | 55.37 | 200 | |
| Agriculture | Crop, Soil and Pest Management | 47.5 | 195 | |
| Agriculture | Food Science and Technology | 58.12 | 215 | |
| Agriculture | Forestry and Wood Technology | 47.5 | 190 | |
| Agriculture | Agricultural Extension and Communication Technology | 47.5 | 190 | |
| Agriculture | Agricultural and Resource Economics | 47.5 | — | Law/Arts-shortfall reallocation |

**Catchment** — **Uncertain**: found Ondo, Ekiti, Osun, Oyo, Lagos (Lagos replacing the app's current Ogun/Edo guess), aggregator-only.

---

## Federal University of Agriculture, Abeokuta (FUNAAB · Ogun State)

**Formula** — **Likely**: `50% JAMB (÷8) + 20% O'Level (5-subject grade points × ⅔) + 30% screening`, out of 100. FUNAAB's own portal doesn't publish this weighting anywhere reachable; three independent aggregators converge on it, superseding an earlier "60/40 simple split" claim.

All 35 cut-offs confirmed directly from FUNAAB's own live 2026/27 admission portal.

| Faculty | Course | Cut-off (JAMB, 0–400) | Note |
|---|---|---:|---|
| Clinical Sciences | Veterinary Medicine (DVM) | 200 | Only 1 real program |
| Law | — | — | No Law faculty exists |
| Engineering & Technology | Agricultural Engineering | 200 | |
| Engineering & Technology | Civil Engineering | 200 | |
| Engineering & Technology | Electrical and Electronics Engineering | 200 | |
| Engineering & Technology | Mechanical Engineering | 200 | |
| Engineering & Technology | Mechatronic Engineering | 200 | |
| Arts | — | — | No Arts faculty exists |
| Social & Management Sciences | Agricultural Economics and Farm Management | 160 | COLAMRUD |
| Social & Management Sciences | Agricultural Extension and Rural Development | 160 | COLAMRUD |
| Social & Management Sciences | Agricultural Administration | 160 | COLAMRUD |
| Social & Management Sciences | Cooperative Studies | 160 | COLAMRUD |
| Social & Management Sciences | Development Studies | 160 | COLAMRUD |
| Social & Management Sciences | Accounting | 200 | COLENDS |
| Social & Management Sciences | Banking and Finance | 200 | COLENDS |
| Social & Management Sciences | Business Administration | 200 | COLENDS |
| Social & Management Sciences | Economics | 200 | COLENDS |
| Science | Computer Science | 200 | |
| Science | Physics | 200 | |
| Science | Chemistry | 180 | |
| Science | Biochemistry | 200 | |
| Science | Microbiology | 200 | |
| Science | Mathematics | 200 | |
| Science | Statistics | 200 | |
| Science | Cyber Security | 200 | |
| Science | Data Science | 200 | |
| Science | Information Technology | 200 | |
| Science | Software Engineering | 200 | |
| Agriculture | Animal Production and Health | 160 | |
| Agriculture | Crop Protection | 160 | |
| Agriculture | Soil Science and Land Management | 160 | |
| Agriculture | Aquaculture and Fisheries Management | 160 | |
| Agriculture | Forest Resource Management | 160 | |
| Agriculture | Animal Breeding and Genetics | 160 | |
| Agriculture | Plant Breeding and Seed Technology | 160 | |
| Agriculture | Horticulture | 160 | |
| Agriculture | Wildlife and Eco-tourism Management | 160 | |

**Catchment** — **Confirmed**: Ogun, Oyo, Osun, Ondo, Ekiti, Lagos, verbatim from funaab.edu.ng.

---

## Federal University Oye-Ekiti (FUOYE · Ekiti State)

**Formula** — **Likely**: `60% UTME (÷400×60) + 30% O'Level (best 5, A1=6…C6=1) + 10% sitting bonus` (10pts one sitting, 6pts two), out of 100. General minimum aggregate to qualify: 50/100.

Two scales shown (UTME floor 0–400, FUOYE's own aggregate 0–100) — this dual scale is exactly what caused the earlier Law 150/220/260 conflict.

| Faculty | Course | UTME floor (0–400) | Aggregate (0–100) | Note |
|---|---|---:|---:|---|
| Clinical Sciences | Anatomy | 180 | 63.3 | |
| Clinical Sciences | Physiology | 180 | 61.5 | |
| Clinical Sciences | Nursing Science | 220–240 | 74.6 | Sources conflict on UTME figure |
| Clinical Sciences | Medical Laboratory Science | 220–230 | 72.3 | Minor conflict |
| Clinical Sciences | Radiography and Radiation Science | 200–220 | 71.3 | Minor conflict |
| Law | Law | 150 | — | Only 1 real program; 150 best-corroborated (260 likely confused with Medicine) |
| Engineering & Technology | Civil Engineering | 190–200 | 65.0 | Minor conflict |
| Engineering & Technology | Mechanical Engineering | 180 | 65.0 | Confirmed |
| Engineering & Technology | Electrical and Electronic Engineering | 190–200 | 63.3 | Minor conflict |
| Engineering & Technology | Computer Engineering | 180–200 | 64.3 | Minor conflict |
| Engineering & Technology | Mechatronics Engineering | 180–200 | 65.0 | Minor conflict |
| Arts | English and Literary Studies | 180 | 66.3 | |
| Arts | History and International Studies | 180 | 67.8 | |
| Arts | Linguistics and Languages | 180 | 65.3 | |
| Arts | Philosophy | 160 | 57.2 | Aggregate is a 2023 figure |
| Arts | Religious Studies | 160 | 55.0 | Aggregate is a 2023 figure |
| Social & Management Sciences | Economics | 180 | 63.75 | Listed as "Economics and Development Studies" |
| Social & Management Sciences | Political Science | 180 | 62.5 | Confirmed |
| Social & Management Sciences | Accounting | 200 | 65.15 | Aggregate is a 2023 figure |
| Social & Management Sciences | Business Administration | 200 | 65.45 | Aggregate is a 2023 figure |
| Social & Management Sciences | Mass Communication | 200–220 | 66.3 | Minor conflict |
| Science | Computer Science | 200 | 61.95 | UTME confirmed; aggregate is a 2023 figure |
| Science | Biochemistry | 180 | 64.4 | Confirmed |
| Science | Microbiology | 180 | 65.75 | |
| Science | Physics | 150–160 | 56.5 | Minor conflict |
| Science | Chemistry | 150–160 | 62.5 | Minor conflict |
| Science | Mathematics | 150–160 | 55.5 | Minor conflict; Law-shortfall reallocation |
| Science | Statistics | 150–160 | 54.5 | Minor conflict; Law-shortfall reallocation |
| Agriculture | Animal Production and Health | 150 | 57.7 | UTME confirmed; aggregate is a 2023 figure |
| Agriculture | Crop Science and Horticulture | 150 | 57.65 | Aggregate is a 2023 figure |
| Agriculture | Agricultural Economics and Extension | 150 | 61.15 | Aggregate is a 2023 figure |
| Agriculture | Soil Science and Land Resources Management | 150 | 56.65 | Aggregate is a 2023 figure |
| Agriculture | Fisheries and Aquaculture | 150 | 57.15 | Aggregate is a 2023 figure |
| Agriculture | Food Science and Technology | 180 | 60.9 | Aggregate is a 2023 figure; Law-shortfall reallocation |
| Agriculture | Water Resources Management and Agrometeorology | 150 | 57.3 | Aggregate is a 2023 figure; Law-shortfall reallocation |

**Catchment vs. ELDS** — **Likely**: catchment is Ekiti, Ondo, Osun, Oyo. Kwara and Kogi, which the app currently lists as catchment, actually belong on FUOYE's ELDS list instead.

---

## Faculty-shortfall pattern across all six

Law is a single real program everywhere (UI, UNILAG, OAU, FUOYE) or entirely absent (FUTA, FUNAAB) — never 5 courses. Arts is absent at FUTA and FUNAAB. Agriculture is absent at UNILAG. Every shortfall was absorbed by a faculty confirmed to have real surplus departments at that specific university, never invented.

---

## Before this gets seeded

- [ ] **OAU** — cut-off/formula research was stopped mid-run; only the course list is final.
- [ ] **UI / UNILAG / OAU catchment & ELDS states** — still the app's original unverified guesses.
- [ ] **ELDS state list** — the 23-state list traces to a 2023 social-media post, not JAMB/NUC.
- [ ] **UI** — two courses ("Agronomy," "Forest Resources Management") don't exist under those names; swapped for real equivalents ("Crop and Horticultural Sciences," "Forest Production and Products"). Confirm this is acceptable.
- [ ] **UNILAG** — three entries (Religious Studies, European Languages, Actuarial Science and Insurance) are each really two-to-three separate admission tracks with no single combined cut-off. Decide how to model this.
- [ ] **FUTA** — "Financial Management" isn't a real FUTA program; replaced with "Procurement Management Technology." Chemical Engineering and Mechatronics Engineering cut-offs remain genuinely unfound. MBBS admission is suspended for 2026/27.
- [ ] **FUOYE** — several courses have small (10–20 point) conflicts between two secondary sources on the UTME-floor scale; the aggregate-scale figures are mostly dated 2023.
- [ ] **Thesis document** — Chapter 1.4's "35 courses across seven faculties" wording needs updating to reflect the confirmed 210-course (35-per-university) scope.

---

*Compiled from web research for the PlaceRight seed-data build. Every cut-off and formula above traces to the source cited beside it — where a figure couldn't be found or sources conflicted, that's stated plainly rather than guessed.*
