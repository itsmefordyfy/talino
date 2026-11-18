# The Talino backup file

A Talino backup is a single UTF-8 JSON document, extension `.talino-backup`. Talino writes the same file for its
automatic backup (a snapshot in `backups/`, uploaded to iCloud on iPhone) and for a backup file the learner makes
(Pro). It is plain readable text. The code is in `src/features/backup` (`lib/format.ts` reads and writes it,
`lib/schema.ts` lists the tables, `lib/merge.ts` has the restore rules).

## Layout

```json
{
  "format": "talino-backup",
  "version": 1,
  "app": "talino",
  "appVersion": "1.0.0",
  "schemaVersion": 4,
  "createdAt": "2026-11-13T12:00:00.000Z",
  "platform": "ios",
  "profileId": "3f9c…",
  "label": "Before my interview",
  "counts": { "lessons": 12, "activities": 30, "projects": 1, "badges": 4, "certificates": 0,
              "applications": 3, "income": 2, "goals": 1, "learningDays": 9, "resumeItems": 4 },
  "settings": { "language": "en", "appearance": "dark", "learnerName": "Ada", … },
  "tables": {
    "lesson_progress": [ { "lesson_id": "…", "course_id": "…", … } ],
    "…": [],
    "deleted_rows": [ { "table_name": "applications", "row_id": "…", "deleted_at": "2026-11-12T09:30:00.000Z" } ]
  },
  "checksum": "sha256:<64 hex digits>"
}
```

| Field | Meaning |
| --- | --- |
| `format`, `app` | Always `"talino-backup"` and `"talino"`. Anything else is "not a Talino backup". |
| `version` | The file format's version (1). A file with a higher version is refused with "made by a newer Talino". |
| `appVersion` | The app's version that wrote it. Shown to the learner, never used to decide anything. |
| `schemaVersion` | The database's `user_version` when it was written. Higher than the running app's: refused ("update Talino first"). Lower is fine: missing columns get their defaults. |
| `createdAt` | ISO timestamp (UTC). |
| `platform` | `ios`, `android` or `web`. |
| `profileId` | A random id made once per install (kept in the key-value store). It holds no personal data and only lets the app say whether a backup came from this same install. |
| `label` | Optional note the learner typed for a backup file. |
| `counts` | A summary for the preview and the history list. It is recomputed from `tables` when a file is read; the file's own numbers are never trusted. |
| `settings` | The whitelisted learner choices (below). |
| `tables` | Rows as JSON objects, only the columns that exist in the app's schema, plus `deleted_rows`. |
| `checksum` | `sha256:` and the hex SHA-256 of the canonical JSON (keys sorted at every level, no whitespace) of `{ format, version, app, schemaVersion, createdAt, platform, profileId, settings, tables }`. |

## What is in it

Tables: `lesson_progress`, `project_progress`, `learning_days`, `badges`, `certificates`, `activity_progress`,
`challenge_attempts`, `applications`, `income`, `career_goals`, `resume_profile`, `resume_items`, `resume_versions`,
`resume_documents` (the learner's résumés, added with schema version 5; an older backup simply has none),
`learner_profile`, and the tombstones in `deleted_rows`. Settings: `language`, `appearance`, `learnerName`, `goal`,
`onboarded`, `focusCourseId`, `dailyReminder`, `dailyReminderTime`, `reminderDays`, `dailyMinutes`,
`careerReminders`, `speechRate`.

XP, levels and streaks are **not** stored anywhere: they are worked out from the lesson, activity and project rows,
badges and learning days, so they come back with those rows.

**Architecture work** (`architecture_artifacts`, from Software Architecture with AI, schema v11): the learner's saved diagrams (Mermaid text), decision records and trade-off matrices are project work, so they travel with a backup like a portfolio project: merged by id (the newer edit wins) and deleted with a tombstone.

## What is never in it, and why

- **Tali's chats** (`coach_chats`, `coach_messages`): private conversations stay on the phone that had them. The list is
  `EXCLUDED_TABLES` in `lib/schema.ts`; the owner can move a table into `BACKUP_TABLES` to include it.
- **Mock interviews and practice sessions** (`interviews`, `interview_messages`, `interview_reports`, `practice_sessions`, `practice_messages`): the
  learner's own words in private practice conversations, with an honest debrief, stay on the phone that had them.
- **Focus rounds** (`focus_sessions`, the Pomodoro timer of the Time Management and Productivity course): the learner's own working pattern stays on the phone that had it.
- **`app_state`**: it holds the portfolio edit key, the class code and referral data, which are credential-like.
- **`project_progress.review_token`**: a signed assertion tied to the install's store id. Never written, never restored.
- Purchases, RevenueCat ids, the device id, the Keychain id, any address that carries a key, and the phone-only
  setting `autoBackup`.

## Versioning rules

1. A reader accepts any `version` up to the one it knows and any `schemaVersion` up to its own database's.
2. Unknown tables and unknown columns are ignored (so a newer app's file that adds a column still restores the rest);
   a column an older file lacks gets its default.
3. A change that an older reader could misread (a new meaning for a column, a new required column without a default)
   raises `version`; adding an optional table or column does not.
4. Every row is validated against its table before it is trusted: types, sizes, allowed values, one id once.
   A file with a bad row is refused whole ("damaged"), never partly restored. `certificates.verify_url` must be an
   http(s) address. Text longer than 200,000 characters and files over 20 MB are refused.

## Integrity, and what the checksum is not

The checksum detects damage (a cut-off or corrupted file) and accidental edits to the data it covers. It is **not
encryption and not authentication**: anyone who can edit the file can recompute it, so a file from someone else is
checked like any input (that is why every row is validated), and the learner chooses whether to restore it after seeing
a preview. The label, the app version and the counts are outside the checksum on purpose: they are shown, never used
to decide. The file is readable text: keep it somewhere private. Nothing is encrypted at rest, and Talino never sends a
backup to its own servers.

## Restore rules (the merge)

Restore **merges** by default, in one transaction (all or nothing), and is idempotent (restoring the same file twice
changes nothing the second time). It never gives a row a newer `updated_at` than the data it came from.

- `lesson_progress`: the further-along row wins: completed beats not completed, then the better quiz ratio, then the
  newer edit. `task_done` keeps the larger value; the earliest `completed_at` stays.
- `project_progress`: status never moves back (`passed` > `needs_work` > `submitted` > `open`); `steps_done` is the union;
  the newer edit wins the submission; the review (feedback and its date) goes with the status that won.
- `learning_days`: union, with the larger lesson count. `badges`: union, earliest `earned_at`, `seen` kept.
- `certificates`: one per course; the one with a verification id wins, otherwise the newer. This phone's row id stays.
- `activity_progress`: a solved row beats an open one; between two solves the earlier `solved_at` and **its** XP stay, so
  XP never grows by restoring the same solve; attempts, wrong answers and hints keep the larger count.
  `challenge_attempts`: union by id.
- `applications`, `income`, `career_goals`, `resume_*`, `learner_profile`: by id, the newer `updated_at` wins (a tie
  keeps this phone). A finished learner profile beats a half-done one, so a restore that arrives while the welcome is
  open still brings the profile back. An income entry whose application does not exist is restored unlinked.
- **Deleted rows** (`deleted_rows`, written by database triggers when an application, income entry, goal, résumé item or
  version or certificate is deleted): a tombstone at or after a row's last edit blocks the backup's copy and removes a
  local row that was not edited since. A row edited after it was deleted wins and its tombstone is dropped.
- Settings: a fresh install takes them all (and skips the welcome); an install already in use only fills values still at
  their defaults; Replace takes them all. Each value is checked again by the settings slice, so a hostile value falls
  back to the default.

`Replace` first writes a safety snapshot (`backups/before-restore-<time>.talino-backup`, the last three kept), then
empties the backed-up tables and the tombstones and merges the backup into the empty phone, in the same transaction.
"Undo last restore" restores that snapshot in replace mode.
