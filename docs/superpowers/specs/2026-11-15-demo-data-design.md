# Career demo data (Developer switch): design

Status: waiting for the owner's approval (revised 2026-11-15 after "make it a separate, Career-only toggle"). Size: small change.

## Intent

The owner wants to see how Talino looks **when the Career tab has data** (applications, income, goals,
résumé) without entering it by hand. A separate **Career demo data** toggle in Settings → Developer fills
Career with a believable learner, **Ford, from Naga City, Philippines**, and removes it again.

## Goals

- One toggle, **Career demo data**, in the existing Developer group, its own row (not tied to "Unlock all").
- On: Career is full: every application stage, an upcoming interview and follow-ups due, income over six
  months, goals at different progress, and a résumé for Ford (location "Naga City, Philippines").
- Off: exactly the demo rows disappear. Your own lessons, progress, name, goal and any real Career entries are
  never changed.

## Non-goals / anti-goals

- Only Career and résumé. Home, Courses, Me and the learner's name stay real (no Ford override, no welcome skip).
- Development builds only (same rule as the Developer group). Hydrates to off in release.
- Demo rows must never reach a backup, a restore, or a notification.

## Approaches considered

1. **Tagged demo rows in the Career tables (picked).** Every demo row has an id starting `demo-`. On inserts
   the demo rows; off deletes `WHERE id LIKE 'demo-%'` and nothing else. Real data around it is untouched and
   shows alongside, which is also what the Career screens look like with real use. Costs: the exclusions below.
2. A second demo database for Career with its own provider. Cleaner isolation, but the Me tab, Home and the
   backup read Career tables through the main database, so they would disagree with the Career screens.
3. Swap the whole app to a demo database. Hides your real lessons and progress while it is on, which a
   Career-only toggle exists to avoid.

## Design

- **On/off state:** a marker row `demo:career` in `app_state` is the only source of truth (no Redux flag), so
  Delete all data (which clears `app_state`), "Show the welcome again" and a restore can never leave the
  switch disagreeing with the database. Turning on twice never duplicates rows. (Builder's call, 2026-11-15.)
- **Toggle on:** insert (in one transaction, ids `demo-*`, dates relative to today): about 12 applications
  across every stage (job and freelance; sources like OnlineJobs.ph, Kalibrr, Upwork, LinkedIn; one interview in
  two days; two follow-ups due; two wins, both freelance gigs; two closed), about 10 income entries over six months (PHP and some
  USD, linked to the freelance wins), three goals at different progress (income, applications, interviews), and a
  résumé: demo documents with Ford's name, headline, "Naga City, Philippines", summary, experience, education and
  skills. The single résumé profile row (`me`) is **never touched** (it
  can't carry a `demo-` id, and it would reach backups); Ford's details live in the demo documents and items.
- **Toggle off:** delete the `demo-*` rows and their `deleted_rows` markers, then the marker. Edits you made to a demo row simply go with it.
- **Excluded while any demo row exists:** backup and restore skip `demo-*` rows (and the automatic backup does
  not run on a demo-only change); career reminders ignore them, so no fake notification is scheduled.
- **Pro:** unchanged. Pro-only Career screens still need the existing "Unlock all" switch.
- **UI:** a `Toggle` row in the Developer group. Strings in `features/settings/strings.ts` (English and
  Filipino). The data lives in `features/career/demo/` (seed + remove); the settings row only calls it.

## Tests

- Seed test (existing node:sqlite helpers): counts, every application stage, an upcoming interview, income
  totals, résumé location; on twice changes nothing; off leaves non-demo rows untouched; the exclusion helpers (`demo-` filter) used by backup and reminders.
- Checked in the simulator: Career tab with the toggle on and off, Settings toggle, résumé screen, that real
  data is still there after off.

## Left to the builder

Invented company and role names (no real companies), exact wording of notes, and how the backup layer applies
the `demo-` filter (a single place if it has one, otherwise paused while demo rows exist).
