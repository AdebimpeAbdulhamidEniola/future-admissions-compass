# JAMB Data Dossier

Backend seed-data specification for the PlaceRight IDSS. The complete 210-course catalog (35 per university, 5 per faculty × 7 faculties, across 6 universities), each university's scoring formula, and national policy — sourced and confidence-flagged. OAU's course list is final, and all 35 courses now have Confirmed cut-offs from OAU's own faculty documents (2023/2024 cycle — one cycle old, not 2025/2026).

- **Compiled:** 2026-08-13
- **Target cycle:** 2025/26–2026/27 UTME
- **Scope:** 210 courses · 35/university · 7 faculties · 6 universities
- **Status:** cut-offs & formulas complete for all 6 universities · UI, OAU, and FUNAAB cut-offs/catchment (and, for FUNAAB, formula too) are now Confirmed off official university pages · UI's and OAU's figures are one cycle old (2024/25 and 2023/24 respectively, not 2025/26) · FUOYE's UTME floors are largely cross-confirmed against its own current-cycle admission-requirements document · FUOYE's Law faculty is now confirmed real (user-verified) · FUTA's formula is flagged Doubting pending direct verification of whether it includes a scored Post-UTME component

**Confidence key:** **Confirmed** — read directly off an official university page/PDF. **Likely** — consistent across independent secondary sources, official page unreachable. **Uncertain** — conflicting sources, roughly balanced. **Doubting** — the dossier's existing sourced answer, but someone with direct knowledge has disputed it and the primary source couldn't be reached to settle it either way; treat as actively contested, not just unverified. **Absent** — genuinely doesn't exist at that university (faculty gap, or a course name that turned out not to be real there).

> **Why cut-off scales aren't comparable across universities:** not a data error — it's the exact problem the thesis is about (Ch.1.2). UI, UNILAG, and OAU publish a 0–100 aggregate on their own formula. FUNAAB publishes the raw UTME/JAMB floor (0–400) per course, with no aggregate published at all — even though FUNAAB's own Confirmed formula computes a 0–100 composite score internally; the per-course cut-offs it publishes are apparently a simpler raw-JAMB screening threshold, not that composite (worth re-checking once the backend actually seeds FUNAAB). FUTA has both a 0–100 aggregate scale and a separate unofficial "estimated competitive JAMB score" floating around. FUOYE has both a UTME floor (0–400) and its own 0–100 aggregate. Every course below states which scale its number is on.

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

**Cut-offs — Confirmed**, read directly from the University of Ibadan's own official website (ui.edu.ng, "UI Releases Cut Off Marks for 2024/2025 Admission Exercises," signed by the Registrar and Secretary to Senate, G.O. Saliu). This is the 2024/2025 cycle — one cycle older than the 2025/26 target, same caveat as OAU — and cut-offs moved meaningfully between cycles for several courses (e.g. Computer Science 63.5→71, Law 70.875→67.25, Agricultural and Environmental Engineering 56.875→50), so treat the table below as directionally reliable, not exact for the current cycle.

**Formula** — still **Likely**: `Aggregate = (JAMB ÷ 8) + (Post-UTME ÷ 2)`, out of 100. O'Level is a pass/fail eligibility gate only, not part of the number. The official page gives cut-off numbers only — the formula itself remains secondary-sourced.

**Correction — "Forest Resources Management" is the real name.** This dossier previously claimed no course by that name exists at UI and renamed it to "Forest Production and Products." That was wrong: UI's own official cut-off page lists "Forest Resources Management" verbatim. Reverted below. (The other rename, "Agronomy" → "Crop and Horticultural Sciences," is independently confirmed correct by this same source — "Crop and Horticultural Sciences" appears verbatim, "Agronomy" does not.)

**New finding — at UI, Catchment cut-off equals Merit cut-off; only ELDS is discounted, and only for some competitive courses.** Every row in the official table gives three columns (Merit / Catch / ELDS), and Catch is identical to Merit in every single course — UI does not appear to give catchment candidates any cut-off advantage at all. ELDS is discounted only on a subset of competitive courses (e.g. Medicine 78.125/78.125/76.25; Law 67.25/67.25/66.75; Civil Engineering 61.625/61.625/53.625); most non-competitive courses show all three columns identical (50/50/50). This is a materially different pattern from UNILAG and OAU, where catchment carries a real, per-state discount — don't assume UI works the same way when building the catchment/ELDS logic.

**Still unresolved — actual catchment/ELDS state names.** The official page gives cut-off numbers only, no state names at all. UI's catchment/ELDS state list therefore remains **Uncertain** — still the app's original unverified guess (Oyo, Ogun, Osun, Ondo, Ekiti, Kwara).

| Faculty | Course | Merit | Catch | ELDS | Note |
|---|---|---:|---:|---:|---|
| Clinical Sciences | Medicine and Surgery | 78.125 | 78.125 | 76.25 | |
| Clinical Sciences | Dentistry | 69.125 | 69.125 | 63.625 | |
| Clinical Sciences | Nursing Science | 71.875 | 71.875 | 63.375 | |
| Clinical Sciences | Physiotherapy | 64.75 | 64.75 | 61.125 | |
| Clinical Sciences | Pharmacy | 68 | 68 | 65.625 | |
| Law | Law | 67.25 | 67.25 | 66.75 | Only 1 real program |
| Engineering & Technology | Civil Engineering | 61.625 | 61.625 | 53.625 | |
| Engineering & Technology | Mechanical Engineering | 68 | 68 | 55.125 | |
| Engineering & Technology | Electrical and Electronic Engineering | 67 | 67 | 50.25 | |
| Engineering & Technology | Agricultural and Environmental Engineering | 50 | 50 | 50 | |
| Engineering & Technology | Petroleum Engineering | 61.25 | 61.25 | 53.625 | |
| Arts | English | 57.125 | 57.125 | 55.25 | |
| Arts | History | 50 | 50 | 50 | |
| Arts | Linguistics and African Languages | 58.125 | 58.125 | 51.625 | Listed simply as "Linguistics" |
| Arts | Theatre Arts | 55.75 | 55.75 | 53.125 | |
| Arts | Religious Studies | 50 | 50 | 50 | |
| Arts | Music | 50 | 50 | 50 | Law-shortfall reallocation |
| Social & Management Sciences | Economics | 58.5 | 58.5 | 52.375 | |
| Social & Management Sciences | Political Science | 55.875 | 55.875 | 55.375 | |
| Social & Management Sciences | Psychology | 53.75 | 53.75 | 53.75 | |
| Social & Management Sciences | Sociology | 50.5 | 50.5 | 50.5 | |
| Social & Management Sciences | Geography | 50 | 50 | 50 | |
| Science | Chemistry | 50 | 50 | 50 | |
| Science | Physics | 51 | 51 | 51 | |
| Science | Microbiology | 52.75 | 52.75 | 52.125 | |
| Science | Computer Science | 71 | 71 | 60.875 | |
| Science | Mathematics | 52 | 52 | 52 | |
| Science | Statistics | 50 | 50 | 50 | Law-shortfall reallocation |
| Science | Botany | 50 | 50 | 50 | Law-shortfall reallocation |
| Agriculture | Agricultural Economics | 50.375 | 50.375 | 50.375 | Listed as "Agric. Economics" |
| Agriculture | Crop and Horticultural Sciences | 50 | 50 | 50 | Confirmed real name (not "Agronomy") |
| Agriculture | Animal Science | 50 | 50 | 50 | |
| Agriculture | Crop Protection and Environmental Biology | 50 | 50 | 50 | |
| Agriculture | Aquaculture and Fisheries Management | 50 | 50 | 50 | Faculty of Renewable Natural Resources |
| Agriculture | Forest Resources Management | 50 | 50 | 50 | **Corrected name** (was "Forest Production and Products") — Faculty of Renewable Natural Resources |

**Bonus real UI programmes found in the official source that aren't in the current 35-course scope**: an entire **Faculty of Education** (21 programmes, nearly all at the 50 floor except Education and English at 57.75/57.75/52.375); **Environmental Design Management** — Architecture (51), Estate Management (50), Urban and Regional Planning (50), Quantity Surveying (50); more of **Renewable Natural Resources** — Wildlife & Ecotourism Management (50), Social and Environmental Forestry (50); more of **Technology** — Food Technology (51), Industrial and Production Engineering (50.25), Wood Products Engineering (50), Automotive Engineering (54.125); and a standalone **Veterinary Medicine** (60/60/60).

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

**Complete — Confirmed, but for the 2023/2024 cycle, not 2025/2026.** Sourced from OAU's own faculty-issued cut-off documents (College of Health Sciences; Faculty of Pharmacy; Faculty of Law; Faculty of Technology; Faculty of Arts; Faculty of Social Sciences; Faculty of Science; Faculty of Agriculture; Faculty of Administration — most signed and dated by their respective Deans). These are official OAU-produced figures, not aggregator guesses, but they're one admission cycle old — treat as directionally reliable (which courses run high vs. low, roughly how catchment/ELDS discount the merit cut-off) rather than exact for the current 2025/2026 cycle. All 35 courses in scope now have a Confirmed merit cut-off. OAU's aggregate is confirmed to be a **0–100 scale** (like UI and UNILAG), not the raw 0–400 UTME score, resolving that ambiguity for the "why cut-off scales aren't comparable" note at the top of this dossier.

**Formula — Likely**: `50% JAMB (÷8) + 40% Post-UTME (raw score, out of 40) + 10% O'Level` (best-5-of-course-required-subjects average, A1=10…C6=5, D7/E8/F9=0, then ÷5), out of 100. This confirms one of the two candidate formulas this dossier previously listed as disputed (`50% JAMB/40% Post-UTME/10% O'Level` vs. `JAMB÷8 + Post-UTME÷2`) — the 50/40/10 version, not the other. Internally consistent: max JAMB component 400÷8=50, max Post-UTME 40 (its own raw score, out of a 40-question exam), max O'Level 10÷5×5=10 core-subject average already scaled to 10 — the three max out at 50+40+10=100. Matches the "average of UTME & O/L points" fragment already confirmed from the Faculty of Administration document, and extends it with the missing Post-UTME term and exact point values. Sourced from informal community explainers (Facebook admissions groups, smartjamb.com), not an OAU official page — hence **Likely**, not **Confirmed**, same tier as UI/UNILAG/FUTA/FUNAAB/FUOYE's formulas.

**Catchment states — Confirmed, independently, across all eight documents**: every one of them uses the same six states — **Ekiti, Lagos, Ogun, Ondo, Osun, Oyo** — matching UI/UNILAG's catchment area exactly (column order varies per faculty document, but the set of six is identical every time).

**ELDS — partially confirmed, and inconsistent in structure across faculties.** College of Health Sciences and the Faculty of Law publish a *separate ELDS cut-off per state* (like catchment); Faculty of Technology, Faculty of Social Sciences, Faculty of Science, Faculty of Agriculture, and Faculty of Administration instead publish a single flat ELDS figure that applies uniformly across states. States seen with real per-state ELDS cut-offs: Kogi, Kano, Kwara, Ebonyi, Cross River, Benue, Nasarawa, Rivers — a smaller, different set than the national 23-state ELDS guess in this dossier's "National policy" section, and not necessarily the full OAU ELDS list (only the states that appear in these documents). Don't treat this as OAU's complete ELDS list — it's a confirmed sample, not a confirmed total.

**Faculty of Administration resolves the Accounting/Business Administration open question**: both sit under a separate **Faculty of Administration**, not Faculty of Social Sciences — confirmed by that faculty's own cut-off document (Accounting appears there as "Management & Accounting"). The Faculty of Administration document also notes: *"Generated from the average of UTME & O/L points"* (a real, confirmed formula fragment — the only one of these eight documents that states any part of its calculation) and *"Mathematics is a compulsory UTME subject requirement for admission into all departments in the Faculty of Administration."*

| Faculty | Course | Merit cut-off (2023/24) | Note |
|---|---|---:|---|
| Clinical Sciences | Medicine and Surgery | 84.325 | **Confirmed** (College of Health Sciences doc, signed by the Provost) |
| Clinical Sciences | Dentistry / Dental Surgery | 80.125 | **Confirmed** |
| Clinical Sciences | Nursing Science | 79.225 | **Confirmed** |
| Clinical Sciences | Medical Rehabilitation (Physiotherapy/OT) | 73.5 | **Confirmed**, listed as "Medical Rehab" |
| Clinical Sciences | Pharmacy | 76.150 | **Confirmed** (separate Faculty of Pharmacy document, signed by the Dean) |
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
| Social & Management Sciences | Accounting | 71.67 | **Confirmed, and reassign faculty** — real programme is "Management & Accounting" under a separate **Faculty of Administration**, not Faculty of Social Sciences. See finding above. |
| Social & Management Sciences | Business Administration | 65.5 | **Confirmed, same reassignment** — also Faculty of Administration, not Social Sciences |
| Social & Management Sciences | Political Science | 65.35 | **Confirmed** (Faculty of Social Sciences) |
| Social & Management Sciences | Sociology and Anthropology | 52.53 | **Confirmed** (Faculty of Social Sciences) |
| Science | Chemistry | 50.00 | **Confirmed** (Faculty of Science doc, signed by the Dean) |
| Science | Physics | 50.00 | **Confirmed** |
| Science | Microbiology | 62.07 | **Confirmed** — resolves the earlier conflict (170 UTME threshold vs. 234 aggregate); this is the real 2023/24 aggregate figure |
| Science | Zoology | 50.00 | **Confirmed** |
| Science | Mathematics | 50.00 | **Confirmed** |
| Science | Botany | 50.00 | **Confirmed** |
| Science | Geology | 50.00 | **Confirmed** |
| Agriculture | Agricultural Economics | 51.93 | **Confirmed** (Faculty of Agriculture doc, signed by the Dean) |
| Agriculture | Animal Sciences | 50.40 | **Confirmed** |
| Agriculture | Crop Production and Protection | 56.08 | **Confirmed** |
| Agriculture | Soil Science and Land Resources Management | 56.38 | **Confirmed** |
| Agriculture | Agricultural Extension and Rural Development | 52.33 | **Confirmed**, listed as "Agric. Ext. & Rural Development" |

**OAU's 35-course scope is now fully sourced** — every course above has a Confirmed 2023/2024 merit cut-off. The only remaining gaps are the current-cycle (2025/26) figures and the disputed formula/weighting.

**Bonus real OAU programmes found in these documents that aren't in the current 35-course scope** (useful if the scope expands later, or as substitutes if a listed course turns out not to exist): Human Nutrition & Dietetics (Merit 63.925, Clinical Sciences); Aerospace Engineering (76.55), Computer Engineering (73.62), Computer Science With Economics (71.30), Computer Science With Mathematics (73.67), Food Science & Technology (55.90), Materials Science & Engineering (52.52), Information and Communication Technology (65), Information Systems (65), Cyber Security (65), Software Engineering (65) — all Faculty of Technology; French (55.125), German (65.975), Portuguese (53.375), Literature in English (53.975), Yoruba (54.275) — all Faculty of Arts; Demography & Social Statistics (55.05), Entrepreneurship (50.63), Geography (54.83), Mass Communication (69.18), Film Production (51.63), Broadcast Journalism (53.18), Information Science & Media Studies (52.75) — all Faculty of Social Sciences; Applied Geophysics (50.00), Engr. Physics (50.00), Ind. Chemistry (50.00), Statistics (50.00) — all Faculty of Science; Family, Nutrition & Consumer Sciences (53.03) — Faculty of Agriculture; International Relations (66.92), Local Government & Dev. Studies (60.0), Public Administration (55.72) — Faculty of Administration.

**Catchment & ELDS detail (2023/2024, Confirmed)** — full per-state breakdown for the courses above, since OAU (unlike UNILAG) publishes both catchment *and* ELDS per state for some faculties:

*College of Health Sciences:*

| Programme | Merit | Osun | Ogun | Ekiti | Ondo | Oyo | Lagos | ELDS states (cut-off) |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Medicine and Surgery | 84.325 | 83.2 | 82.325 | 82.175 | 82.175 | 80.5 | 75.75 | Kwara 77.575 · Kogi 79.05 · Ebonyi 75.1 |
| Dentistry / Dental Surgery | 80.125 | 76.125 | 78.85 | 72.725 | 76.45 | 78.45 | 75.25 | Kwara 71.35 |
| Nursing Science | 79.225 | 77.525 | 77.1 | 76 | 76.55 | 76.725 | 74.25 | Kogi 70.2 · Cross River 70.9 · Kwara 70.725 · Ebonyi 73.225 · Benue 70.775 |
| Medical Rehab | 73.5 | 73.025 | 70.375 | 71.05 | 69.65 | 72.075 | 67.9 | Kogi 70.775 · Kano 72.525 · Kwara 67.775 · Ebonyi 71.1 |
| Human Nutrition & Dietetics *(not in current scope)* | 63.925 | 61.55 | 52.7 | 58.525 | 55.6 | 59.825 | 61.775 | Kwara 56.55 · Plateau 57 · Kano 53.675 |

*Faculty of Pharmacy* (separate document, its own Dean — catchment/ELDS given as a flat list rather than per-programme, since Pharmacy is a single programme):

| Merit | Ekiti | Lagos | Ogun | Ondo | Osun | Oyo | ELDS states (cut-off) |
|---:|---:|---:|---:|---:|---:|---:|---|
| 76.150 | 72.075 | 70.450 | 73.900 | 72.425 | 74.900 | 73.900 | Benue 69.175 · Cross River 69.325 · Ebonyi 68.375 · Kaduna 57.125 · Kogi 69.625 · Kwara 69.150 |

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

*Faculty of Science* (signed, Prof. O.A. Adesina, 19/09/2024 — ELDS is a single flat figure here too):

| Course | Merit | Osun | Oyo | Ondo | Ogun | Lagos | Ekiti | ELDS (flat) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Applied Geophysics *(bonus)* | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Biochemistry | 59.97 | 51.72 | 51.55 | 50.82 | 52.30 | 56.20 | 55.15 | 51.62 |
| Botany | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Chemistry | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Engr. Physics *(bonus)* | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Geology | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Ind. Chemistry *(bonus)* | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Mathematics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Microbiology | 62.07 | 54.17 | 52.52 | 52.37 | 52.40 | 50.00 | 52.82 | 53.30 |
| Physics | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Statistics *(bonus)* | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Zoology | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |

*Faculty of Agriculture* (signed, Prof. A.A. Tijani, 20/09/2024 — ELDS is a single flat figure here too, and every course's catchment happens to sit at the 50.00 floor for this cycle):

| Course | Merit | Osun | Oyo | Ondo | Ogun | Lagos | Ekiti | ELDS (flat) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Agricultural Economics | 51.93 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Agric. Ext. & Rural Development | 52.33 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Animal Sciences | 50.40 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Crop Production & Protection | 56.08 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Soil Science & Land Resources Mgt. | 56.38 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |
| Family, Nut. & Consumer Sciences *(bonus)* | 53.03 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 | 50.00 |

*Faculty of Administration* (signed 20/09/2024 — resolves the Accounting/Business Administration placement question; states "Generated from the average of UTME & O/L points" and that Mathematics is compulsory UTME-wise for every department here; ELDS is a single flat figure):

| Course | Merit | Ekiti | Oyo | Ogun | Osun | Ondo | Lagos | ELDS (flat) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Management & Accounting *(= "Accounting" in this dossier's scope)* | 71.67 | 68.57 | 70.57 | 69.37 | 70.57 | 61.17 | 63.37 | 51.77 |
| Business Administration | 65.5 | 59.27 | 62.0 | 61.57 | 62.75 | 56.52 | 52.12 | 51.57 |
| International Relations *(bonus)* | 66.92 | 58.15 | 64.9 | 64.83 | 63.35 | 59.55 | 54.68 | 53.67 |
| Local Government & Dev. Studies *(bonus)* | 60.0 | 50.0 | 50.0 | 50.0 | 50.0 | 50.0 | 50.0 | 50.0 |
| Public Administration *(bonus)* | 55.72 | 50.0 | 53.82 | 53.6 | 55.55 | 53.77 | 54.7 | 50.0 |

**Data-model implication**: like UNILAG, OAU's catchment cut-off (and, for several of its faculties, its ELDS cut-off too) is not a single number per course — it varies by state. Same open schema decision as flagged in the UNILAG section applies here.

---

## Federal University of Technology, Akure (FUTA · Ondo State)

**Formula** — **Doubting** (downgraded from Likely): `75% JAMB (÷400×75) + 25% O'Level` (5 subjects, grade-point average), no Post-UTME term. FUTA runs a "Post-UTME/DE screening exercise" every cycle (registration, CAPS/O'Level upload, eligibility checks) — cross-confirmed by two independent aggregator sources for the 2026/27 cycle, both stating explicitly that this screening is not a written/CBT test and doesn't add a scored component: *"Since FUTA does not conduct a written Post-UTME, your aggregate is calculated based on your JAMB score and O'Level grades."* However, the user has been separately told FUTA does run a real Post-UTME that counts toward the aggregate (JAMB + Post-UTME + O'Level, not just JAMB + O'Level) — a live, direct FUTA source could not be fetched to settle this (futa.edu.ng and its subdomains are blocked by this environment's network policy). Flagging as **Doubting** rather than picking a side: don't treat either version as settled until someone can read futa.edu.ng or an official FUTA PDF directly. The "JAMB÷8 + Post-UTME÷2" formula still repeated by other aggregator sites is possibly a stale, pre-CAPS-era formula — or possibly still current, if the user's information is right. Two incompatible cut-off scales circulate regardless of which formula is correct (a 0–100 aggregate, and an unofficial "estimated competitive JAMB score" out of 400) — both shown since neither is officially confirmed. As with UNILAG, the 5 O'Level subjects are the course's required combination for the candidate's stream (science/arts/commercial), not the candidate's best 5 credits overall — relevant here since FUTA is almost entirely Science/Engineering/Agriculture courses, so English/Mathematics/Physics/Chemistry/Biology applies to nearly the whole catalog.

**General JAMB floor — Likely, new data point**: 180 and above (lower than UI/UNILAG/OAU's 200 floor). This is FUTA's eligibility threshold to sit the Post-UTME *screening*, distinct from the per-department aggregate cut-offs in the table below.

**FUTA's real structure is 7 "Schools," not "Faculties," and doesn't map cleanly onto this dossier's faculty categories.** Per the Campusdesk source, FUTA actually runs: School of Agriculture and Agricultural Technology (SAAT), School of Engineering and Engineering Technology (SEET), School of Earth and Mineral Sciences (SEMS), School of Environmental Technology (SET — includes Architecture, not Engineering), School of Computing (SOC — separate from Science), School of Sciences (SOS), and School of Health and Health Technology (SHHT). That's 7 real schools, none of them named "Law," "Arts," or "Social & Management Sciences" — consistent with this dossier's existing note that FUTA has no Law or Arts faculty, but **no school resembling "Social & Management Sciences" appears in this source at all**, which raises an open question about the five courses this dossier currently files there (Business Information Technology, Entrepreneurship Management Technology, Logistics and Transport Technology, Project Management Technology, Procurement Management Technology) — they may sit under a school this source simply didn't cover (e.g. a School of Logistics/Innovation/Management Technology), not necessarily nonexistent. Needs verification before seeding.

**O'Level subject requirements by school (Likely, new data)** — useful directly for `AdmissionRequirement.requiredOLevelSubjects`:
- **SEET (Engineering) & SOC (Computing)**: English, Mathematics, Physics, Chemistry, + 1 other Science subject
- **SOS (Sciences)**: English, Mathematics, Physics, Chemistry, + Biology or Agricultural Science (department-dependent)
- **SAAT (Agriculture)**: English, Mathematics, Biology or Agricultural Science, Chemistry, + Physics or 1 other Science subject
- **SET (Environmental Technology)**: English, Mathematics, Physics, + 2 other relevant subjects (Geography, Fine Arts, or Technical Drawing depending on course)
- **SEMS (Earth & Mineral Sciences)**: English, Mathematics, Physics, + Chemistry or Geography
- **SHHT (Health Technology)**: English, Mathematics, Biology, Chemistry, Physics

**Two figures conflict with this dossier's existing data** — flagging both, not resolving in either direction:
- **Forestry and Wood Technology**: this dossier has 47.5; the new source gives **57.5**.
- **Chemical Engineering and Mechatronics Engineering** — both entirely absent from this newer, apparently more complete departmental list (every other SEET department is covered). This dossier previously listed them as "no figure found despite repeated search" / "no figure found; department confirmed to exist" — their absence here is suggestive that they may not currently run as standalone FUTA departments, but isn't proof either way.

"Financial Management" was replaced with "Procurement Management Technology" (confirmed real; the former doesn't exist at FUTA) — though see the "Social & Management Sciences" open question above, since neither appears in the newer source.

| Faculty | Course | Aggregate (0–100) | Est. JAMB (0–400) | Note |
|---|---|---:|---:|---|
| Clinical Sciences | Medicine and Surgery (MBBS) | — | ~250–260 | **Admission suspended 2026/27** |
| Clinical Sciences | Nursing Science | 75.00 | 220–240 | New program, 2025/26 |
| Clinical Sciences | Human Anatomy | 59.5 | ~260 | |
| Clinical Sciences | Physiology | 57.25 | 230 | |
| Law | — | — | — | No Law faculty exists |
| Engineering & Technology | Civil Engineering | 71.87 | 235 | **Corrected name** — real programme is "Civil and Environmental Engineering" |
| Engineering & Technology | Mechanical Engineering | 73.75 | 240 | |
| Engineering & Technology | Electrical/Electronics Engineering | 74.37 | 245 | |
| Engineering & Technology | Chemical Engineering | — | — | Absent from the newer, more complete departmental list too — see finding above |
| Engineering & Technology | Agricultural Engineering | 55.12 | 210 | **Corrected name** — real programme is "Agricultural and Environmental Engineering" |
| Engineering & Technology | Computer Engineering | 69.62 | 250 | Law/Arts-shortfall reallocation |
| Engineering & Technology | Industrial and Production Engineering | 47.5 | — | Law/Arts-shortfall reallocation |
| Engineering & Technology | Metallurgical and Materials Engineering | 54.87 | — | Law/Arts-shortfall reallocation |
| Engineering & Technology | Mining Engineering | 54.75 | — | Law/Arts-shortfall reallocation |
| Engineering & Technology | Mechatronics Engineering | — | — | Absent from the newer, more complete departmental list too — see finding above |
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
| Agriculture | Forestry and Wood Technology | 47.5 | 190 | **Conflict** — newer source gives 57.5 instead; see finding above |
| Agriculture | Agricultural Extension and Communication Technology | 47.5 | 190 | |
| Agriculture | Agricultural and Resource Economics | 47.5 | — | Law/Arts-shortfall reallocation |

**Bonus real FUTA programmes found in the newer source that aren't in the current 35-course scope** (School of Earth and Mineral Sciences, School of Environmental Technology, and School of Computing are barely represented in the current scope, so most of these are from those three schools): Applied Geophysics (47.5), Applied Geology (47.5), Marine Science and Technology (47.5), Meteorology (47.5), Remote Sensing and GIS (47.5) — all SEMS; Architecture (72.87), Building (56.62), Estate Management (47.5), Industrial Design (53.25), Quantity Surveying (57), Surveying and Geoinformatics (64.25), Urban and Regional Planning (52.87) — all SET; Information and Communication Technology (49.75, SEET — distinct from SOC's own "Information Technology" at 63.75); Information Systems (63.75), Software Engineering (63.75) — SOC; Ecotourism and Wildlife Management (47.5), Fisheries and Aquaculture Technology (47.5) — SAAT; Biomedical Technology (47.5) — SHHT.

**Catchment** — **Uncertain**: found Ondo, Ekiti, Osun, Oyo, Lagos (Lagos replacing the app's current Ogun/Edo guess), aggregator-only. Not addressed by the newer source either.

---

## Federal University of Agriculture, Abeokuta (FUNAAB · Ogun State)

**Formula — Confirmed**, read directly from FUNAAB's own official Help Desk knowledgebase (helpdesk.funaab.edu.ng, Article ID 30, "How Does FUNAAB Calculate Points for UTME Candidates"). This **overturns** the dossier's previous "50% JAMB + 20% O'Level + 30% screening" entry — there is **no Post-UTME/screening component at all**:

`Final Composite Score = O'Level Composite (%) + UTME Composite (%)`, a straight **50:50 split**, out of 100.

- **UTME component (50% max)**: `UTME Score ÷ 8` (max 400÷8 = 50)
- **O'Level component (50% max)**: sum of grade points for the 5 core required subjects (max 30 points) `× (5/3)` (max 30×5/3 = 50). Grade scale: A1=6, B2=5, B3=4, C4=3, C5=2, C6=1, all others=0.
- **Required 5 subjects, by stream** (matches the general rule already established for UNILAG/OAU/FUTA, but stated explicitly by FUNAAB itself): **Core Sciences** — English, Mathematics, Physics, Chemistry, Biology. **Management Science** — English, Mathematics, Economics, plus the best 2 relevant subjects.
- **Two O'Level results (WAEC + NECO)**: the better grade is taken per subject, but **1 point is deducted** from the total.
- **Agriculture in lieu of Biology**: accepted for eligibility, but the Agriculture grade itself does **not** count toward O'Level points — a genuine edge case worth handling explicitly in the scoring engine, not silently substituting it in.

Confidence upgraded from Likely to **Confirmed** — this is the only one of the six universities' formulas read directly off the institution's own page rather than inferred from aggregator convergence.

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

**UTME floors upgraded — cross-confirmed against FUOYE's own Admission Requirements document (2026/2027 cycle, the current target cycle).** This is a different kind of source than the cut-off-marks blog posts used elsewhere: it's FUOYE's own per-course UTME and O'Level subject-combination requirements list, with a "MIN. SCORE" (JAMB/UTME floor) column, covering essentially the whole university across 14 faculties/colleges. It resolves several of this table's previously-flagged "minor conflict" UTME floors in favor of one specific value (shown below), and surfaces two new conflicts. **This document is also the authoritative source for `AdmissionRequirement.requiredUtmeSubjects`/`requiredOLevelSubjects` per course** — the exact Major/Minor subject lists it gives are far more granular than this dossier's general science/arts/commercial rule (e.g. Water Resources Management and Agrometeorology's UTME major is just Mathematics/Chemistry/Physics, no Biology, unlike most other Agriculture courses) — reference the source document directly when seeding `AdmissionRequirement` rather than relying on the general rule alone.

**Two new conflicts surfaced**: Linguistics and Languages (this dossier has 180; the new source gives 170) and Religious Studies (this dossier has 160; the new source gives 150).

**Law faculty — resolved, Confirmed real.** The new admission-requirements document is exhaustive across 14 faculties/colleges and never mentions Law, which previously raised real doubt. However, the user has directly confirmed FUOYE does have a Law faculty — the admission-requirements document's silence on it is now understood to be a gap in that source's coverage, not evidence Law doesn't exist. The existing Law entry (UTME floor 150) stays, but its cut-off figure itself is still only Uncertain (prior 150/220/260 conflict, no resolving source found) — only its existence is now settled.

**Two significant new real courses found**: **Medicine and Surgery** (MIN. SCORE 280, its own "College of Medicine," not part of "Basic Medical Sciences") and **Doctor of Pharmacy** (MIN. SCORE 230, "Faculty of Pharmacy") — neither is in the current 35-course scope, and Medicine and Surgery in particular is a major omission given it's a flagship course at every other university in this dossier.

**FUOYE's real faculty structure is finer-grained than this dossier's assumed categories**: "Science" is really two faculties — **Life Sciences** (Biochemistry, Microbiology, Plant Science and Biotechnology, Animal and Environmental Biology, Environmental Management and Toxicology) and **Physical Sciences** (Chemistry, Industrial Chemistry, Geology, Geophysics, Mathematics, Statistics, Physics). "Social & Management Sciences" is really two faculties too — **Social Sciences** (Political Science, Economics and Development Studies, plus bonus Criminology and Security Studies, Demography and Social Statistics, Peace and Conflict Studies, Psychology, Sociology) and **Management Sciences** (Accounting, Business Administration, plus bonus Finance, Public Administration). "Engineering & Technology" is really two faculties — **Engineering** (Agricultural, Civil, Electrical and Electronics, Mechanical, Mechatronics, Materials and Metallurgical) and **Computer and Information Engineering** (Computer Engineering, System Engineering, Information and Communication Engineering) — plus a wholly separate **Faculty of Computing** (Computer Science, Cyber Security, Software Engineering, Data Science and Analytic). There's also a **Faculty of Communication and Media Studies** (Mass Communication, Broadcasting, Public Relations, Journalism and Media Studies), a full **Faculty of Education** (~16 departments), and a **Faculty of Environmental Design and Management** (Architecture, Building, Estate Management, Quantity Surveying, Surveying and Geoinformatics, Urban and Regional Planning) — none of which this dossier's current 35-course FUOYE scope represents at all.

| Faculty | Course | UTME floor (0–400) | Aggregate (0–100) | Note |
|---|---|---:|---:|---|
| Clinical Sciences | Anatomy | 180 | 63.3 | **Confirmed** by new source |
| Clinical Sciences | Physiology | 180 | 61.5 | **Confirmed** by new source |
| Clinical Sciences | Nursing Science | 240 | 74.6 | Resolved (new source): 240, not 220–240 |
| Clinical Sciences | Medical Laboratory Science | 230 | 72.3 | Resolved (new source): 230, not 220–230 |
| Clinical Sciences | Radiography and Radiation Science | 220 | 71.3 | Resolved (new source): 220, not 200–220 |
| Law | Law | 150 | — | **Confirmed real** (user-verified) — absent from the admission-requirements document, but that's a gap in that source, not evidence against the faculty; the cut-off figure itself is still Uncertain (prior 150/220/260 conflict) |
| Engineering & Technology | Civil Engineering | 190 | 65.0 | Resolved (new source): 190, not 190–200 |
| Engineering & Technology | Mechanical Engineering | 180 | 65.0 | **Confirmed** by new source |
| Engineering & Technology | Electrical and Electronic Engineering | 190 | 63.3 | Resolved (new source): 190, not 190–200 |
| Engineering & Technology | Computer Engineering | 180 | 64.3 | Resolved (new source): 180, not 180–200 |
| Engineering & Technology | Mechatronics Engineering | 180 | 65.0 | Resolved (new source): 180, not 180–200 |
| Arts | English and Literary Studies | 180 | 66.3 | **Confirmed** by new source |
| Arts | History and International Studies | 180 | 67.8 | **Confirmed** by new source |
| Arts | Linguistics and Languages | 180 | 65.3 | **New conflict** — new source gives 170 |
| Arts | Philosophy | 160 | 57.2 | **Confirmed** by new source; aggregate is a 2023 figure |
| Arts | Religious Studies | 160 | 55.0 | **New conflict** — new source gives 150; aggregate is a 2023 figure |
| Social & Management Sciences | Economics | 180 | 63.75 | **Confirmed** by new source, listed as "Economics and Development Studies" |
| Social & Management Sciences | Political Science | 180 | 62.5 | **Confirmed** by new source |
| Social & Management Sciences | Accounting | 200 | 65.15 | **Confirmed** by new source; aggregate is a 2023 figure |
| Social & Management Sciences | Business Administration | 200 | 65.45 | **Confirmed** by new source; aggregate is a 2023 figure |
| Social & Management Sciences | Mass Communication | 200 | 66.3 | Resolved (new source): 200, not 200–220 |
| Science | Computer Science | 200 | 61.95 | **Confirmed** by new source; aggregate is a 2023 figure |
| Science | Biochemistry | 180 | 64.4 | **Confirmed** by new source |
| Science | Microbiology | 180 | 65.75 | **Confirmed** by new source |
| Science | Physics | 150 | 56.5 | Resolved (new source): 150, not 150–160 |
| Science | Chemistry | 150 | 62.5 | Resolved (new source): 150, not 150–160 |
| Science | Mathematics | 150 | 55.5 | Resolved (new source): 150, not 150–160; Law-shortfall reallocation |
| Science | Statistics | 150 | 54.5 | Resolved (new source): 150, not 150–160; Law-shortfall reallocation |
| Agriculture | Animal Production and Health | 150 | 57.7 | **Confirmed** by new source; aggregate is a 2023 figure |
| Agriculture | Crop Science and Horticulture | 150 | 57.65 | **Confirmed** by new source; aggregate is a 2023 figure |
| Agriculture | Agricultural Economics and Extension | 150 | 61.15 | **Confirmed** by new source; aggregate is a 2023 figure |
| Agriculture | Soil Science and Land Resources Management | 150 | 56.65 | **Confirmed** by new source; aggregate is a 2023 figure |
| Agriculture | Fisheries and Aquaculture | 150 | 57.15 | **Confirmed** by new source; aggregate is a 2023 figure |
| Agriculture | Food Science and Technology | 180 | 60.9 | **Confirmed** by new source; aggregate is a 2023 figure; Law-shortfall reallocation |
| Agriculture | Water Resources Management and Agrometeorology | 150 | 57.3 | **Confirmed** by new source; aggregate is a 2023 figure; Law-shortfall reallocation |

**Bonus real FUOYE programmes found in the new admission-requirements source** (from the finer-grained faculty structure described above): Medicine and Surgery (280, College of Medicine) and Doctor of Pharmacy (230, Faculty of Pharmacy) — both major omissions from the current scope; System Engineering (150) and Information and Communication Engineering (150) — Computer and Information Engineering; Cyber Security (180), Software Engineering (160), Data Science and Analytic (150) — Computing; Agricultural Engineering (150), Materials and Metallurgical Engineering (150) — Engineering; Plant Science and Biotechnology (150), Animal and Environmental Biology (150), Environmental Management and Toxicology (150) — Life Sciences; Industrial Chemistry (150), Geology (150), Geophysics (150) — Physical Sciences; Finance (180), Public Administration (170) — Management Sciences; Criminology and Security Studies (210), Demography and Social Statistics (150), Peace and Conflict Studies (150), Psychology (150), Sociology (160) — Social Sciences; Mass Communication's siblings — Broadcasting (160), Public Relations (160), Journalism and Media Studies (160); Architecture (170), Building (150), Estate Management (150), Quantity Surveying (150), Surveying and Geoinformatics (150), Urban and Regional Planning — Environmental Design and Management; and an entire Faculty of Education (~16 departments, mostly at 150).

**Catchment vs. ELDS** — **Likely**: catchment is Ekiti, Ondo, Osun, Oyo. Kwara and Kogi, which the app currently lists as catchment, actually belong on FUOYE's ELDS list instead.

---

## Faculty-shortfall pattern across all six

Law is a single real program everywhere (UI, UNILAG, OAU, FUOYE) or entirely absent (FUTA, FUNAAB) — never 5 courses. FUOYE's Law faculty is confirmed real (user-verified) despite being absent from its own admission-requirements document; its cut-off figure remains Uncertain. Arts is absent at FUTA and FUNAAB. Agriculture is absent at UNILAG. Every shortfall was absorbed by a faculty confirmed to have real surplus departments at that specific university, never invented.

---

## Before this gets seeded

- [ ] **OAU** — all 35 courses in scope now have Confirmed 2023/2024 merit cut-offs, sourced from OAU's own faculty documents (College of Health Sciences, Faculty of Pharmacy, Law, Technology, Arts, Social Sciences, Science, Agriculture, Administration). Formula is now Likely (`50% JAMB÷8 + 40% Post-UTME raw score + 10% O'Level`, A1=10…C6=5 ÷5 — see OAU section) rather than Uncertain, but is community-sourced, not an OAU official page. All figures are one cycle old (2023/24, not 2025/26) — re-verify before seeding for the current cycle if a more recent OAU document turns up.
- [x] ~~**OAU Accounting / Business Administration faculty placement**~~ — resolved: both sit under a separate **Faculty of Administration** at OAU (Accounting appears there as "Management & Accounting"), not Faculty of Social Sciences. This dossier still files them under "Social & Management Sciences" for scope-list consistency with the other five universities — that's a deliberate simplification, not an error, but flag it if the backend ever needs OAU's real faculty structure.
- [ ] **UI catchment & ELDS states** — still the app's original unverified guess; UI's own official cut-off page gives numbers only, no state names. (UNILAG's and OAU's catchment states are now Confirmed — see their sections above; ELDS is Confirmed as a *sample*, not a complete list, for OAU only.) Note UI's own pattern is unusual: Catchment cut-off = Merit cut-off everywhere (no discount at all), only ELDS is discounted, and only on some courses — don't assume UI's catchment/ELDS mechanics mirror UNILAG/OAU's once the actual states are found.
- [ ] **ELDS state list** — the national 23-state list traces to a 2023 social-media post, not JAMB/NUC. OAU's own documents confirm real ELDS cut-offs for a smaller, different set of states (Kogi, Kano, Kwara, Ebonyi, Cross River, Benue, Nasarawa, Rivers) — see OAU section — which doesn't fully validate or fully contradict the national 23-state guess, since it's only a sample.
- [x] ~~**UI course names**~~ — resolved by UI's own official cut-off page: "Agronomy" was correctly renamed to "Crop and Horticultural Sciences" (confirmed real), but "Forest Resources Management" was wrongly renamed to "Forest Production and Products" — reverted, since "Forest Resources Management" is itself the real, confirmed name.
- [ ] **UI cut-offs are 2024/2025 cycle, not 2025/2026** — several courses shifted meaningfully between cycles in the past (Computer Science 63.5→71, Law 70.875→67.25, Agricultural and Environmental Engineering 56.875→50) — re-verify against a newer UI page before seeding if one becomes available.
- [ ] **UNILAG** — three entries (Religious Studies, European Languages, Actuarial Science and Insurance) are each really two-to-three separate admission tracks with no single combined cut-off. Decide how to model this.
- [ ] **Catchment (and, for OAU, ELDS) cut-off model** — both UNILAG and OAU publish a distinct catchment cut-off per state (Ekiti/Lagos/Ogun/Ondo/Osun/Oyo), not one figure per course; OAU additionally does this for ELDS in 2 of its 5 sourced faculties. `Course.catchmentCutOff` currently models a single value — decide whether to simplify (lowest/average of the six) or extend the schema to a per-state cut-off. See the UNILAG and OAU sections above for the full findings and example figures.
- [ ] **FUTA** — "Financial Management" isn't a real FUTA program; replaced with "Procurement Management Technology." Chemical Engineering and Mechatronics Engineering are absent from two independent sources now, not just unfound — worth treating as likely nonexistent rather than "not yet located." MBBS admission is suspended for 2026/27. Forestry and Wood Technology has a genuine conflict (47.5 vs. 57.5) between sources.
- [ ] **FUTA "Social & Management Sciences" faculty** — doesn't appear at all in FUTA's real 7-school structure (SAAT, SEET, SEMS, SET, SOC, SOS, SHHT) per a newer, more complete source. The 5 courses this dossier files there (Business Information Technology, Entrepreneurship Management Technology, Logistics and Transport Technology, Project Management Technology, Procurement Management Technology) may belong to an uncovered school rather than being invented — needs verification, similar to the OAU Accounting/Business Administration question that was resolved earlier.
- [ ] **FUTA general JAMB floor** — newly found at 180 (vs. 200 at UI/UNILAG/OAU) — only Likely confidence, not yet cross-checked against futa.edu.ng directly.
- [ ] **FUTA O'Level requirements by school** — now documented (see FUTA section) and should feed `AdmissionRequirement.requiredOLevelSubjects` directly once seeding begins.
- [ ] **FUOYE** — most previously-flagged UTME-floor conflicts are now resolved against FUOYE's own 2026/2027 admission-requirements document (see FUOYE section); two new conflicts surfaced (Linguistics and Languages, Religious Studies); the aggregate-scale figures are mostly still dated 2023.
- [x] ~~**FUOYE Law faculty — open question.**~~ Resolved (user-verified): FUOYE does have a Law faculty, despite its absence from the otherwise-exhaustive 14-faculty/college admission-requirements document. The cut-off figure itself (150) is still Uncertain — prior 150/220/260 conflict, no resolving source found yet.
- [ ] **FUOYE `AdmissionRequirement` seeding** — FUOYE's own admission-requirements document gives exact per-course UTME major/minor and O'Level major/minor subject combinations, more granular than this dossier's general science/arts/commercial rule. Use it directly as the seed source for `AdmissionRequirement.requiredUtmeSubjects`/`optionalUtmeSubjects`/`requiredOLevelSubjects` rather than the general rule alone.
- [ ] **Thesis document** — Chapter 1.4's "35 courses across seven faculties" wording needs updating to reflect the confirmed 210-course (35-per-university) scope.
- [x] ~~**O'Level scoring component (UNILAG, OAU, FUTA, FUNAAB, FUOYE)**~~ — implemented in both engines (`engine.ts`, backend and frontend): `computeAggregate` now scores only the candidate's results matching `AdmissionRequirement.requiredOLevelSubjects`, not an arbitrary first-5. Grade-point scale is now per-university via `ScoringPolicy.oLevelGradePoints`: FUNAAB (Confirmed) and FUOYE (Likely) both use A1=6..C6=1 (max 30), distinct from the generic A1=10..C6=5 (max 50) used everywhere else. UNILAG's A1=4.0..C6=2.0 and OAU's A1=10..C6=5 both share the same min/max ratio (0.5) as the generic table, so no override was needed for them under the engine's normalize-by-own-max approach — but UNILAG's exact intermediate B2/B3/C4/C5 values are still inferred (linear), not directly confirmed by a source. **Still not implemented**: FUNAAB's two edge cases (1-point deduction for two O'Level sittings/boards; Agriculture-in-lieu-of-Biology not counting toward points) and FUOYE's 10%-sitting-bonus component — none of these fit the current schema and need real design work, not a one-line fix.
- [x] ~~**UNILAG's 12%-Post-UTME-disqualification rule**~~ — was undocumented-in-code despite being in the dossier text. Implemented as `ScoringPolicy.minPostUtmePercent` (nullable), checked in `verifyEligibility()` as an eligibility gate (not a scoring penalty) in both engines.
- [x] ~~**Frontend mock `ScoringPolicy` weights**~~ — were stale placeholders for UI, UNILAG, OAU, FUTA, and FUOYE (matching neither the old nor the dossier-confirmed formulas); only FUNAAB had ever been corrected. All six now match the backend's dossier-sourced weights exactly, including OAU's `postUtmeMaxScore: 40` (Post-UTME is its own raw score out of 40, not a percentage of 100).

---

*Compiled from web research for the PlaceRight seed-data build. Every cut-off and formula above traces to the source cited beside it — where a figure couldn't be found or sources conflicted, that's stated plainly rather than guessed.*
