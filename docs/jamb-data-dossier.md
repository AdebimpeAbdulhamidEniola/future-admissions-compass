# JAMB Data Dossier

Backend seed-data specification for the PlaceRight IDSS. The complete 210-course catalog (35 per university, 5 per faculty × 7 faculties, across 6 universities), each university's scoring formula, and national policy — sourced and confidence-flagged. OAU's course list is final; roughly two-thirds of its courses now have Confirmed cut-offs (2023/2024 cycle) from OAU's own faculty documents — the rest (Science, Agriculture, Medicine/Dentistry/Pharmacy) are still unsourced.

- **Compiled:** 2026-08-13
- **Target cycle:** 2025/26–2026/27 UTME
- **Scope:** 210 courses · 35/university · 7 faculties · 6 universities
- **Status:** cut-offs & formulas complete for UI, UNILAG, FUTA, FUNAAB, FUOYE · OAU partially confirmed (2023/24 cycle; Science and Agriculture still unsourced)

**Confidence key:** **Confirmed** — read directly off an official university page/PDF. **Likely** — consistent across independent secondary sources, official page unreachable. **Uncertain** — conflicting sources. **Absent** — genuinely doesn't exist at that university (faculty gap, or a course name that turned out not to be real there).

> **Why cut-off scales aren't comparable across universities:** not a data error — it's the exact problem the thesis is about (Ch.1.2). UI, UNILAG, and OAU publish a 0–100 aggregate on their own formula. FUNAAB publishes the raw UTME/JAMB floor (0–400) per course, with no aggregate published at all. FUTA has both a 0–100 aggregate scale and a separate unofficial "estimated competitive JAMB score" floating around. FUOYE has both a UTME floor (0–400) and its own 0–100 aggregate. Every course below states which scale its number is on.

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

**Cut-off figures below are now Confirmed** — cross-checked against UNILAG's own official publication, ["UNILAG Releases 2025/2026 UTME Merit Cut-Off Marks"](https://unilag.edu.ng/unilag-releases-2025-2026-utme-merit-cut-off-marks/) (unilag.edu.ng, 3 October 2025). Every Merit figure already in this dossier matches that source exactly. The scoring **formula/weighting** itself is still **Likely** — the official page publishes cut-off marks only, not the weighting breakdown.

**Formula** — **Likely**: `50% UTME (÷8) + 30% Post-UTME (÷2) + 20% O'Level` (5 subjects, A1=4.0…C6=2.0, averaged), out of 100. This corrects an earlier 60/40/0 guess — O'Level does count. Candidates below 12% in Post-UTME screening are disqualified regardless of JAMB score.

**Correction — which 5 O'Level subjects count**: earlier drafts of this dossier assumed "best 5 credits" (whichever 5 subjects score highest, regardless of relevance). That's wrong — the 5 subjects are the course's own *required* combination for the candidate's stream, i.e. the same list already captured per-course in `AdmissionRequirement.requiredOLevelSubjects`, not an independently-chosen best-5. Concretely:
- **Science courses** (Medicine, Engineering, pure/applied Sciences, etc.): English Language, Mathematics, Physics, Chemistry, Biology.
- **Arts courses**: English Language, Literature-in-English, Government or History, plus 1–2 further Arts/Social-Science subjects specific to the course (e.g. Law wants English, Literature, Government, CRS/IRS).
- **Commercial/Social-Science courses** (Accounting, Business Administration, Economics, etc.): English Language, Mathematics, Economics, plus 1–2 further Commercial/Social-Science subjects (Commerce, Principles of Accounts, Government, Business Studies).

The scoring engine should average the grades of *these* subjects, not the candidate's 5 highest-graded credits overall.

| Faculty | Course | Cut-off | Note |
|---|---|---:|---|
| Clinical Sciences | Medicine and Surgery | 85.025 | |
| Clinical Sciences | Dentistry and Dental Surgery | 76.65 | Listed as "Dental Science" |
| Clinical Sciences | Nursing Science | 79.8 | |
| Clinical Sciences | Physiotherapy | 74.725 | |
| Clinical Sciences | Medical Laboratory Science | 74.375 | |
| Clinical Sciences | Pharmacy | 76.4 | Agriculture-shortfall reallocation |
| Law | Law | 78.225 | Only 1 real program |
| Engineering & Technology | Civil Engineering | 75.625 | **Corrected name** — official source lists this as "Civil Engineering," not "Civil and Environmental Engineering"; no combined Civil/Environmental program exists at UNILAG |
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

**Catchment states — Confirmed**: the official cut-off publication lists per-course catchment cut-offs for exactly six states — **Ekiti, Lagos, Ogun, Ondo, Osun, Oyo** — matching the app's existing guess. ELDS is not mentioned anywhere on the page (no ELDS column, no ELDS states, no ELDS cut-offs) — UNILAG's ELDS quota/state-list treatment remains unconfirmed and should stay on the national ELDS list from the "National policy" section above until a UNILAG-specific source turns up.

**Data-model finding — catchment cut-off is not a single number per course.** The official source publishes a *separate* catchment cut-off for **each of the six catchment states**, per course, and they differ meaningfully — e.g. Medicine and Surgery: Merit 85.025, but Ekiti 79.975 / Lagos 79.75 / Ogun 83.8 / Ondo 81.325 / Osun 81.775 / Oyo 81.575. This dossier and the current domain model (`Course.catchmentCutOff` as a single value) assume one catchment cut-off per course — that's a simplification of what UNILAG actually publishes. Before seeding, decide whether to: (a) keep the single-value simplification (e.g. take the lowest or an average of the six state figures), or (b) extend the schema to store a cut-off per catchment state. Representative per-state catchment cut-offs, for reference:

| Course | Merit | Ekiti | Lagos | Ogun | Ondo | Osun | Oyo |
|---|---:|---:|---:|---:|---:|---:|---:|
| Medicine and Surgery | 85.025 | 79.975 | 79.75 | 83.8 | 81.325 | 81.775 | 81.575 |
| Law | 78.225 | 73.625 | 75.9 | 76.55 | 75.75 | 76.35 | 74.525 |
| Computer Science | 83.425 | 80.125 | 79.6 | 82.025 | 77.5 | 79.2 | 78.1 |
| Accounting | 75.7 | 69.475 | 71.4 | 73.825 | 68.8 | 72.325 | 71 |
| Civil Engineering | 75.625 | 65.525 | 74.5 | 72.075 | 65.575 | 72.375 | 71.05 |

*Source: [unilag.edu.ng, 3 October 2025](https://unilag.edu.ng/unilag-releases-2025-2026-utme-merit-cut-off-marks/) — full table covers all ~78 UNILAG programs across 9 faculties (Arts, College of Medicine, Education, Engineering, Environmental Sciences, Law, Management Sciences, Pharmacy, Science, Social Sciences), not just the 28 in this dossier's 35-course-per-university scope.*

---

## Obafemi Awolowo University (OAU · Osun State)

**Partial upgrade — Confirmed, but for the 2023/2024 cycle, not 2025/2026.** Sourced from OAU's own faculty-issued cut-off documents (College of Health Sciences; Faculty of Law; Faculty of Technology; Faculty of Arts; Faculty of Social Sciences — the last two signed and dated by their respective Deans). These are official OAU-produced figures, not aggregator guesses, but they're one admission cycle old — treat as directionally reliable (which courses run high vs. low, roughly how catchment/ELDS discount the merit cut-off) rather than exact for the current 2025/2026 cycle. Formula/weighting is still **Uncertain** — none of these documents states a formula, only final cut-offs. OAU's aggregate is confirmed to be a **0–100 scale** (like UI and UNILAG), not the raw 0–400 UTME score, resolving that ambiguity for the "why cut-off scales aren't comparable" note at the top of this dossier.

**Catchment states — Confirmed, independently, across all five documents**: every one of them uses the same six states — **Ekiti, Lagos, Ogun, Ondo, Osun, Oyo** — matching UI/UNILAG's catchment area exactly (column order varies per faculty document, but the set of six is identical every time).

**ELDS — partially confirmed, and inconsistent in structure across faculties.** College of Health Sciences and the Faculty of Law publish a *separate ELDS cut-off per state* (like catchment); Faculty of Technology and Faculty of Social Sciences instead publish a single flat ELDS figure that applies uniformly across states. States seen with real ELDS cut-offs: Kogi, Kano, Kwara, Ebonyi, Cross River, Benue, Nasarawa, Rivers — a smaller, different set than the national 23-state ELDS guess in this dossier's "National policy" section, and not necessarily the full OAU ELDS list (only the states that appear in these five documents). Don't treat this as OAU's complete ELDS list — it's a confirmed sample, not a confirmed total.

| Faculty | Course | Merit cut-off (2023/24) | Note |
|---|---|---:|---|
| Clinical Sciences | Medicine and Surgery | — | Not covered in sourced documents |
| Clinical Sciences | Dentistry / Dental Surgery | — | Not covered in sourced documents |
| Clinical Sciences | Nursing Science | 79.225 | **Confirmed** (College of Health Sciences doc) |
| Clinical Sciences | Medical Rehabilitation (Physiotherapy/OT) | 73.5 | **Confirmed**, listed as "Medical Rehab" |
| Clinical Sciences | Pharmacy | — | Not covered in sourced documents |
| Law | Law | 75.325 | **Confirmed** |
| Engineering & Technology | Civil Engineering | 70.85 | **Confirmed** — OAU's own faculty is named "Faculty of Technology," not "Engineering & Technology" |
| Engineering & Technology | Mechanical Engineering | 72.07 | **Confirmed** |
| Engineering & Technology | Electronic and Electrical Engineering | 70.87 | **Confirmed**, listed as "Electrical/Electronics Engineering" |
| Engineering & Technology | Chemical Engineering | 68.28 | **Confirmed** |
| Engineering & Technology | Agricultural and Environmental Engineering | 53.12 | **Corrected name** — real programme is "Agricultural Engineering," no "and Environmental" |
| Arts | English Language | 64.825 | **Confirmed** |
| Arts | History | 62.625 | **Confirmed** |
| Arts | Linguistics and African Languages | 65.725 | **Confirmed**, listed simply as "Linguistics" |
| Arts | Philosophy | 51.4 | **Confirmed** |
| Arts | Religious Studies | 62.05 | **Confirmed** |
| Arts | Dramatic Arts | 65.8 | **Confirmed** |
| Arts | Music | 51.125 | **Confirmed** |
| Social & Management Sciences | Economics | 65.63 | **Confirmed** (Faculty of Social Sciences doc) |
| Social & Management Sciences | Accounting | — | **Open question** — not listed under this faculty's own cut-off document; may sit in a separate Faculty of Administration at OAU, not Social Sciences. Needs verification before seeding. |
| Social & Management Sciences | Business Administration | — | Same open question as Accounting above |
| Social & Management Sciences | Political Science | 65.35 | **Confirmed** |
| Social & Management Sciences | Sociology and Anthropology | 52.53 | **Confirmed** |
| Science | Chemistry | — | Not covered in sourced documents |
| Science | Physics | — | Not covered in sourced documents |
| Science | Microbiology | — | Not covered in sourced documents — still has the two conflicting figures noted previously (170 UTME threshold vs. 234 aggregate) |
| Science | Zoology | — | Not covered in sourced documents |
| Science | Mathematics | — | Not covered in sourced documents |
| Science | Botany | — | Not covered in sourced documents |
| Science | Geology | — | Not covered in sourced documents |
| Agriculture | Agricultural Economics | — | Not covered in sourced documents |
| Agriculture | Animal Sciences | — | Not covered in sourced documents |
| Agriculture | Crop Production and Protection | — | Not covered in sourced documents |
| Agriculture | Soil Science and Land Resources Management | — | Not covered in sourced documents |
| Agriculture | Agricultural Extension and Rural Development | — | Not covered in sourced documents |

**Bonus real OAU programmes found in these documents that aren't in the current 35-course scope** (useful if the scope expands later, or as substitutes if a listed course turns out not to exist): Human Nutrition & Dietetics (Merit 63.925); Aerospace Engineering (76.55), Computer Engineering (73.62), Computer Science With Economics (71.30), Computer Science With Mathematics (73.67), Food Science & Technology (55.90), Materials Science & Engineering (52.52), Information and Communication Technology (65), Information Systems (65), Cyber Security (65), Software Engineering (65) — all Faculty of Technology; French (55.125), German (65.975), Portuguese (53.375), Literature in English (53.975), Yoruba (54.275) — all Faculty of Arts; Demography & Social Statistics (55.05), Entrepreneurship (50.63), Geography (54.83), Mass Communication (69.18), Film Production (51.63), Broadcast Journalism (53.18), Information Science & Media Studies (52.75) — all Faculty of Social Sciences.

**Catchment & ELDS detail (2023/2024, Confirmed)** — full per-state breakdown for the courses above, since OAU (unlike UNILAG) publishes both catchment *and* ELDS per state for some faculties:

*College of Health Sciences:*

| Programme | Merit | Osun | Ogun | Ekiti | Ondo | Oyo | Lagos | ELDS states (cut-off) |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Medical Rehab | 73.5 | 73.025 | 70.375 | 71.05 | 69.65 | 72.075 | 67.9 | Kogi 70.775 · Kano 72.525 · Kwara 67.775 · Ebonyi 71.1 |
| Nursing Science | 79.225 | 77.525 | 77.1 | 76 | 76.55 | 76.725 | 74.25 | Kogi 70.2 · Cross River 70.9 · Kwara 70.725 · Ebonyi 73.225 · Benue 70.775 |
| Human Nutrition & Dietetics *(not in current scope)* | 63.925 | 61.55 | 52.7 | 58.525 | 55.6 | 59.825 | 61.775 | Kwara 56.55 · Plateau 57 · Kano 53.675 |

*Faculty of Law:*

| Merit | Oyo | Osun | Ogun | Ondo | Ekiti | Lagos | ELDS states (cut-off) |
|---:|---:|---:|---:|---:|---:|---:|---|
| 75.325 | 73.95 | 74.725 | 73.25 | 73.775 | 73 | 69 | Benue 73.325 · Cross River 59.3 · Ebonyi 67.025 · Kwara 73.8 · Kogi 74.25 · Nasarawa 56.425 · Rivers 64.325 |

*Faculty of Technology* (ELDS is a single flat figure here, not per-state):

| Department | Merit | Ekiti | Lagos | Ogun | Ondo | Osun | Oyo | ELDS (flat) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Civil Engineering | 70.85 | 58.85 | 62.82 | 62.22 | 54.8 | 69.00 | 69.07 | 59.00 |
| Mechanical Engineering | 72.07 | 62.60 | 54.87 | 66.37 | 53.92 | 70.65 | 66.62 | 56.00 |
| Electrical/Electronics Engineering | 70.87 | 57.15 | 61.37 | 66.72 | 52.30 | 68.15 | 68.07 | 59.57 |
| Chemical Engineering | 68.28 | 63.17 | 63.17 | 61.15 | 62.02 | 65.72 | 57.95 | 59.17 |
| Agricultural Engineering | 53.12 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |

*Faculty of Arts* (state order for the catchment columns wasn't visible in the source document — figures shown in source order, **Likely** Ekiti/Lagos/Ogun/Ondo/Osun/Oyo to match the other faculties, not independently confirmed):

| Programme | Merit | Catchment 1 | Catchment 2 | Catchment 3 | Catchment 4 | Catchment 5 | Catchment 6 | ELDS (flat) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Dramatic Arts | 65.8 | 64.375 | 61.925 | 63.4 | 51.525 | 62.85 | 53.275 | 50 |
| English Language | 64.825 | 63.225 | 60.675 | 56.325 | 56.45 | 58.025 | 59.325 | 50 |
| History | 62.625 | 57.475 | 54.2 | 60.125 | 50 | 61.325 | 50 | 50 |
| Linguistics | 65.725 | 65 | 63.7 | 56.9 | 57 | 58.55 | 59.4 | 50 |
| Music | 51.125 | 50 | 50 | 50 | 50 | 50 | 50 | 50 |
| Philosophy | 51.4 | 50 | 50 | 50 | 50 | 50 | 50 | 50 |
| Religious Studies | 62.05 | 50 | 50 | 50 | 50 | 50 | 50 | 50 |

*Faculty of Social Sciences* (ELDS is a single flat figure here too):

| Programme | Merit | Osun | Oyo | Ekiti | Ondo | Lagos | Ogun | ELDS (flat) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Economics | 65.63 | 63.0 | 59.80 | 55.80 | 53.33 | 57.05 | 61.43 | 51.93 |
| Political Science | 65.35 | 62.38 | 62.93 | 58.35 | 58.15 | 64.15 | 61.15 | 54.50 |
| Sociology & Anthropology | 52.53 | 50 | 50 | 50 | 50 | 50 | 50 | 50 |

**Data-model implication**: like UNILAG, OAU's catchment cut-off (and, for two of its five faculties, its ELDS cut-off too) is not a single number per course — it varies by state. Same open schema decision as flagged in the UNILAG section applies here.

---

## Federal University of Technology, Akure (FUTA · Ondo State)

**Formula** — **Likely**: `75% JAMB (÷400×75) + 25% O'Level` (5 subjects, grade-point average). FUTA runs no written Post-UTME anymore — screening is JAMB score + O'Level via CAPS only. The "JAMB÷8 + Post-UTME÷2" formula still repeated by aggregator sites is a stale, pre-CAPS-era formula. Two incompatible cut-off scales circulate (a 0–100 aggregate, and an unofficial "estimated competitive JAMB score" out of 400) — both shown since neither is officially confirmed. As with UNILAG, the 5 O'Level subjects are the course's required combination for the candidate's stream (science/arts/commercial), not the candidate's best 5 credits overall — relevant here since FUTA is almost entirely Science/Engineering/Agriculture courses, so English/Mathematics/Physics/Chemistry/Biology applies to nearly the whole catalog.

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

**Formula** — **Likely**: `50% JAMB (÷8) + 20% O'Level (5-subject grade points × ⅔) + 30% screening`, out of 100. FUNAAB's own portal doesn't publish this weighting anywhere reachable; three independent aggregators converge on it, superseding an earlier "60/40 simple split" claim. Same correction as UNILAG applies to the "5-subject" component: the required combination per the course's stream (science/agriculture courses here mean English, Mathematics, Physics/Agricultural Science, Chemistry, Biology — see UNILAG section above for the general rule), not the candidate's best 5 credits.

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

**Formula** — **Likely**: `60% UTME (÷400×60) + 30% O'Level (5 subjects, A1=6…C6=1) + 10% sitting bonus` (10pts one sitting, 6pts two), out of 100. General minimum aggregate to qualify: 50/100. Same correction as UNILAG applies: the 5 O'Level subjects are the course's required combination for the candidate's stream (science/arts/commercial — see UNILAG section above), not the candidate's best 5 credits overall.

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

- [ ] **OAU** — Clinical Sciences (partial), Law, Engineering & Technology, Arts (partial), and Social & Management Sciences (partial) now have Confirmed 2023/2024 cut-offs; Science and Agriculture (all 12 courses) plus Medicine/Dentistry/Pharmacy and Accounting/Business Administration remain unsourced. Formula/weighting is still Uncertain. All figures are one cycle old (2023/24, not 2025/26) — re-verify before seeding for the current cycle if a more recent OAU document turns up.
- [ ] **OAU Accounting / Business Administration faculty placement** — not listed under OAU's own Faculty of Social Sciences cut-off document; may belong to a separate Faculty of Administration. Needs verification before seeding, since the dossier currently files them under "Social & Management Sciences."
- [ ] **UI catchment & ELDS states** — still the app's original unverified guess. (UNILAG's and OAU's catchment states are now Confirmed — see their sections above; ELDS is Confirmed as a *sample*, not a complete list, for OAU only.)
- [ ] **ELDS state list** — the national 23-state list traces to a 2023 social-media post, not JAMB/NUC. OAU's own documents confirm real ELDS cut-offs for a smaller, different set of states (Kogi, Kano, Kwara, Ebonyi, Cross River, Benue, Nasarawa, Rivers) — see OAU section — which doesn't fully validate or fully contradict the national 23-state guess, since it's only a sample.
- [ ] **UI** — two courses ("Agronomy," "Forest Resources Management") don't exist under those names; swapped for real equivalents ("Crop and Horticultural Sciences," "Forest Production and Products"). Confirm this is acceptable.
- [ ] **UNILAG** — three entries (Religious Studies, European Languages, Actuarial Science and Insurance) are each really two-to-three separate admission tracks with no single combined cut-off. Decide how to model this.
- [ ] **Catchment (and, for OAU, ELDS) cut-off model** — both UNILAG and OAU publish a distinct catchment cut-off per state (Ekiti/Lagos/Ogun/Ondo/Osun/Oyo), not one figure per course; OAU additionally does this for ELDS in 2 of its 5 sourced faculties. `Course.catchmentCutOff` currently models a single value — decide whether to simplify (lowest/average of the six) or extend the schema to a per-state cut-off. See the UNILAG and OAU sections above for the full findings and example figures.
- [ ] **FUTA** — "Financial Management" isn't a real FUTA program; replaced with "Procurement Management Technology." Chemical Engineering and Mechatronics Engineering cut-offs remain genuinely unfound. MBBS admission is suspended for 2026/27.
- [ ] **FUOYE** — several courses have small (10–20 point) conflicts between two secondary sources on the UTME-floor scale; the aggregate-scale figures are mostly dated 2023.
- [ ] **Thesis document** — Chapter 1.4's "35 courses across seven faculties" wording needs updating to reflect the confirmed 210-course (35-per-university) scope.
- [ ] **O'Level scoring component (UNILAG, OAU, FUTA, FUNAAB, FUOYE)** — corrected from "best 5 credits" to "the course's required subject combination per stream" (science/arts/commercial). Confirm the scoring engine implementation reads from `AdmissionRequirement.requiredOLevelSubjects` per course rather than picking a candidate's top 5 grades.

---

*Compiled from web research for the PlaceRight seed-data build. Every cut-off and formula above traces to the source cited beside it — where a figure couldn't be found or sources conflicted, that's stated plainly rather than guessed.*
