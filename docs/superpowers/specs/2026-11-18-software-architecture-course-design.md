# Software Architecture with AI: design (2026-11-18)

Owner's brief (pasted 2026-11-18): a complete course, "Software Architecture with AI: Design Scalable, Secure, and Production-Ready Systems", for intermediate to professional
developers: 12 modules, 36 to 45 lessons, 15 to 20 hours, 3 projects, editable architecture diagrams, a course-aware Architecture Assistant, Tali as an architecture mentor, the
architecture standards (C4, ADRs, UML, DDD, Clean Architecture, 12-Factor), the five learner levels, persistence of submissions, diagrams and ADRs, idempotent seeding, no change to
existing courses, "make routine decisions independently", and (mid-session) "use Kokoro TTS here". The owner opted out of questions, so this records the decisions instead (brainstorming gate: opted out).

## Intent and the why
AI makes architectural decisions silently when nobody states them. The learner is a developer who can build; the scarce skill is deciding how the whole system is shaped, writing the decision down
and testing what an assistant proposes. The course is **practised, not recited**: every lesson applies an idea to one growing system (TindaTrack), and AI is the critic and drafting partner, never the decider.

## Goals, non-goals, anti-goals
- Goals: one catalog course (44 lessons, 12 modules, about 16 hours, 3 projects) in the existing catalog; four tools (diagram workbench with C4, trade-off matrix, ADR builder, architecture assistant)
  that keep the learner's own work; saved diagrams and ADRs that persist, back up and reach Tali's project review; Tali that mentors architecture by hints and trade-offs; live prompt labs for reviewing designs.
- Non-goals: a new app tab, a new AI service or server route, a second TTS vendor, running learner code, a Tagalog edition (standing owner rule), cloud pricing or product comparisons.
- Anti-goals: recommending microservices or Kubernetes by default; a "winner" the matrix declares from a 2% margin; AI output presented as verified; invented statistics or company claims; diagrams as images.

## Decisions (mine, recorded; the owner can overrule any)
1. **Course id `software-architecture-ai`**, `kind: 'standard'`, level `intermediate` (the lowest level the brief names; the five-level pieces carry professionals up), category `advanced-ai-engineering`, goal `learn-ai-dev`
   only (adding `become-developer` or `get-job` would let it outrank the career and web courses in the recommendation tests), `volatile: false` (concepts hold across providers; the few product facts are dated, sourced `version` notes).
2. **44 lessons, not 36 to 45 spread evenly**: modules 3 and 5 to 6 carry the most bullets (5, 4 and 4 lessons). **Projects after lessons 26, 34 and 44** (P1 needs modules 1 to 7, P2 needs scalability and security, P3 is the capstone);
   the standard rule that the last project opens after 70% of the lessons holds (day 44 of 44).
3. **Overlap with `ai-architecture`** (AI-Assisted Software Architecture, the shorter introduction): it stays unchanged and is the introduction; this course is the deep version with different lessons, a different running example
   (TindaTrack, not Hiwa Booking) and the tools. Recorded as `docs/content/OVERLAPS.md` entry 14. `prerequisites` is empty (advice only).
4. **Diagrams are text, never images.** The existing diagram engine (`features/visuals/diagrams`) already parses a safe Mermaid subset into a validated `DiagramSpec` and draws it. This work adds **C4 views** (`C4Context`, `C4Container`,
   `C4Component`) to that parser, mapped to the existing `architecture` diagram kind (people and external systems and boundaries become colour groups). Sequence, data-flow (a flowchart with database nodes), class and ER diagrams already exist.
   Mermaid itself is never loaded (no dependency, no WebView, nothing evaluated): the text is parsed, bounded (6,000 characters, 200 lines, 24 nodes) and drawn natively.
5. **Tools are `visual` blocks** (category `architecture`): `arch-diagram-workbench` (pick a template or write source, live render with line-level errors, copy, save, compare two versions), `arch-tradeoff-matrix` (weighted scoring, margin and a
   "too close to call" message instead of a winner), `arch-adr-builder` (fields to a Markdown record, rule-based checks, copy, save) and `arch-assistant` (describe an application, pick a request, open Tali). Pure logic lives in
   `features/architecture/lib` with tests; components in `features/visuals/architecture`.
6. **The Architecture Assistant is Tali with a course focus**, not a new service: a new coach focus `architecture` (`coach/lib/architecture.ts`) carries the assistant's rules (state assumptions, name missing information, explain the reasoning,
   prefer the simplest design, never recommend microservices, Kubernetes or an expensive service without a requirement that needs it, hints before answers, never present a recommendation as guaranteed) and the nine request types (requirements analysis,
   architecture recommendation, component decomposition, database design, API architecture, security recommendations, scalability assessment, cost considerations, trade-off comparison). It reuses the coach route, its daily chat allowance and its
   diagram reply format (`DIAGRAM_SPEC_PROMPT`), so there is no extra model call unless the learner sends the prepared prompt. The same instructions apply in every lesson and project of this course (`lesson`, `quiz`, `activity` and `project` focus).
7. **Tali knows** the course and lesson (existing lesson focus), the learner's level (existing profile context), the project's steps and rubric (existing), the learner's saved diagrams and decision records for the project
   (new: the app sends a labelled, capped summary with the review request, `artifacts`, treated as untrusted data like `practice` and `labs`), and previous feedback (the review's saved feedback is shown to her by the existing project flow).
   Her instructions say recommendations are hypotheses and that she may be wrong.
8. **Persistence: one append-only migration (v11) `architecture_artifacts`** (id, kind `diagram|adr|matrix`, title, content, optional project id, timestamps) with a deletion tombstone trigger. It is project work, so it is **in the backup**
   (`BACKUP_TABLES`, merged by id, newer wins) and in "reset all data". Saves are idempotent by id made on the phone, bounded (20,000 characters, 60 per kind). Project submissions, quiz results, activity progress and XP use the existing tables unchanged.
9. **Prompt labs reuse the live practice engine** (`prompt-lab`, `/api/practice`, allowance `talinopractice`); labs live in `practice/labs/architecture/` (ids `arch-NN-…`), fictional design documents as `material`. No server change.
10. **Honesty rules for content** (the brief's lists are in `docs/content/ARCHITECTURE_BRIEF.md`): no invented numbers, benchmarks, prices or company claims; cloud taught as concepts with provider equivalents only where certain; product facts only in dated, sourced version notes.
11. **Kokoro narration only** (owner, 2026-11-18, and the standing rule): lesson scripts exported with `scripts/audio`, `run-software-architecture.sh` written; recordings are a Mac job and the upload is the owner's. Gemini speech is never used.
12. **English only.** New strings are English; where a typed table needs `fil`, the English text is a placeholder and is listed as pending, not translated.

## Curriculum
44 lessons in 12 modules: `catalog/syllabus-architecture.ts` is the contract. Lesson shape (checked by `catalog/architecture-module.test.ts` on top of the standard rules): opening paragraph, "A real situation", "How it works" (with a diagram or
visual), "AI in Action" (a labelled illustration with a flaw to catch), "Try it with AI" (the learner decides first), "Next steps", takeaways last; two or more activity kinds; a plain-language block and a depth block (five levels); scenario quiz; a task and
a harder `taskExtra`. Projects: P1 Design a Multi-Tenant SaaS Architecture, P2 Scale an Existing Application, P3 Build an AI-Assisted Architecture Blueprint with a proof of concept (rubrics in the brief).

## Approaches considered (diagram editing)
1. **Embed real Mermaid in a WebView.** Rejected: a new dependency, evaluation of learner text, a second renderer inconsistent with the rest of the app, no offline guarantee.
2. **Edit the `DiagramSpec` JSON.** Rejected: hostile for learners and not the format they will meet in their repositories.
3. **Edit Mermaid text (a bounded safe subset incl. C4), parsed by the existing engine.** Chosen: the format developers actually keep in docs, no new dependency, validated, drawn natively, copyable.

## Constraints
Existing learners' progress, enrolments and journey places never move (a new catalog entry, a late-added side milestone). The owner's prepaid Gemini key is used by no new code path (labs and the assistant go through existing routes;
**no live call was made by this work**). No secrets, no new dependency.

## Tests and verification
Jest for every pure part (C4 parsing, trade-off scoring, ADR checks and Markdown, repo on `node:sqlite`, review summary, coach focus and cleaning, module and whole-course checks); tsc and lint; the tools seen on the simulator where it can be run. Everything not seen is
listed in `docs/content/ARCHITECTURE_STATUS.md`.
