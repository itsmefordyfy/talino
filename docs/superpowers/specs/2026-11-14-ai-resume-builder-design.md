# AI résumé builder (design, 2026-11-14)

Status: written and built in one pass at the owner's request ("make sensible decisions independently, do not stop
for routine approvals"). The decisions below are mine, not the owner's; change any of them in this file first.

## Intent

A learner with no résumé-writing experience gets a professional, ATS-readable résumé from what they tell Tali
(or from an old résumé they upload), tailored to a job post when they have one, and can edit every word. Talino
already has a basic résumé (`features/resume`: one profile, entries, three fixed goal versions, one tailoring
mode). This extends it; it does not add a second résumé feature.

## Goals

- **Create résumé with AI** reachable from Career and from the résumé screen; guided, step-by-step for a
  first-time user, one tap plus a target job for a returning one (the master profile is reused).
- Upload a PDF or Word résumé (or paste text) to fill the master profile.
- Many résumés (duplicate, rename, edit, delete), each a snapshot that tailoring never overwrites.
- Six templates by audience, with colour, font, density, paper size, section order and visibility.
- Live preview while editing (side by side on wide screens, one tap away on a phone; edits save immediately).
- AI assistant: improve wording, achievement-style bullets, suggested skills, gaps, ATS review; every change is
  a suggestion with a reason that the learner accepts or rejects.
- Export: PDF (Letter or A4) and Word (.docx), both from the same blocks as the preview.

## Non-goals and anti-goals

- No accounts, no cloud copy of a résumé, no server-side storage of text or files (see Constraints).
- No multi-column or graphic templates: hiring software misreads them, and the existing résumé already chose
  one column and standard headings on purpose.
- **Anti-goal: an invented fact.** A résumé that claims a job, degree, certificate, skill or number the learner
  never gave is a failure even if it looks good.
- No web build of the app (Talino is iOS and Android; `web` only hosts the API routes).

## Constraints found in the code

- Talino has **no sign-in**: RevenueCat's anonymous id plus a Keychain device id; learner data is on-device
  SQLite, backed up by the learner's own iCloud or a file. So "belongs to the authenticated user and never
  reaches another user" is met by keeping résumés on the phone; the server holds only quota counters.
- AI goes through Expo Router API routes (Gemini key server-side, All-Access checked with RevenueCat, allowance
  counted in Supabase `ai_chats` under an `app` name, a global cost cap). The existing tailor mode is All-Access.
- Every UI string is a `defineStrings` table with English and Tagalog (a parity test fails otherwise). Résumé
  text stays English (documents for English-language applications, owner's earlier call); the AI's explanations
  follow the app language.
- Append-only migrations; every learner-deletable table gets a tombstone trigger and a backup spec (a test
  compares the spec with `PRAGMA table_info`).

## Approaches considered

1. **On-device documents, stateless AI route (chosen).** Résumés are JSON rows in SQLite; `/api/resume` takes
   the facts, returns structured JSON, stores nothing. Fits the no-accounts model, works offline for everything
   except the AI calls, and backup/restore already know how to carry rows.
2. Supabase accounts and cloud résumés. Rejected: Talino has no accounts by the owner's decision, it would put
   personal data on a server, and it needs auth, RLS and a privacy-policy change.
3. Grow the existing `resume_versions` (three goal rows). Rejected: it cannot hold many résumés, templates or
   styles, and it stores only the AI's summary, not a whole document.

## Decisions

- **Data.** `resume_profile`/`resume_items` stay the **master career profile** (columns added: `career_goal`,
  `level`; items gain `location`, `link` and the `achievement` kind; an entry's bullets are the lines of its
  `description`). New `resume_documents` (id, name, template, style JSON, content JSON, target JSON, timestamps)
  holds each résumé as a snapshot. Old `resume_versions` rows are converted once into documents, then removed.
- **No invention, by construction.** Generating and tailoring return only wording keyed by the learner's own
  entry ids (summary, bullets per entry, skill order); the app assembles the document from the learner's facts,
  so the model cannot add an employer, school or date. Guards on top: a bullet or summary with a number the
  learner never wrote is dropped (their own text is kept); a suggested skill needs evidence found in the
  résumé; the model returns `questions` for what is missing instead of guessing, and the app shows them.
- **Import** extracts facts (copying, not rewriting) into a draft the learner reviews before it joins the
  master profile; duplicates are skipped. The file is read in memory and discarded: PDFs go to Gemini as
  inline data, Word files are unzipped on the server and their text sent. 4 MB limit; paste-text fallback.
- **Subscription.** Manual building, templates, the local ATS check and exporting are free (they run on the
  phone). Every AI action is **All-Access**, as tailoring already was, checked on the server, counted as
  `talinoresume` (40 a rolling 24 hours, not chats). Loosening this is one constant.
- **Templates.** professional, modern, graduate (students and fresh graduates), career-shift, freelancer,
  developer. They differ in section order, heading style, type and accent, all one column.
- **Preview and export share one block list**, so what is previewed is what prints. PDF via `expo-print` at
  Letter (default; the Philippine standard) or A4; Word via a small dependency-free zip writer.
- **Deliberately left out.** Cover letters (separate feature), LinkedIn import, live co-editing, a web build.

## Testing plan

TDD for everything in `lib/`: content parsing, templates, rendering (HTML/text), zip and Word, ATS check,
every AI guard and parser, the one-time conversion, the migration, the backup spec. The route is tested with a
fake Gemini (access, quota, bad input, bad model output, file limits). Screens are checked in the simulator;
what could not be driven is said so in the final report.
