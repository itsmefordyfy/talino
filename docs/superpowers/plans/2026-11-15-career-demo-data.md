# Career demo data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A development-only **Career demo data** toggle in Settings → Developer that fills the Career tab (applications, income, goals, résumé) with a believable learner, Ford from Naga City, Philippines, and removes exactly those rows when switched off.

**Architecture:** Every demo row has an id starting `demo-` in the real database's Career tables; a marker row `demo:career` in `app_state` is the only on/off state. Backup and career reminders skip `demo-` ids. The toggle runs through `useDbMutation(..., { notify: false })` so it never starts a backup.

**Tech Stack:** Expo SDK 58, expo-sqlite, TanStack Query (`useDbQuery` / `useDbMutation`), Jest with `createTestDatabase()` (node:sqlite), Redux not involved.

**Spec:** `docs/superpowers/specs/2026-11-15-demo-data-design.md`

## Global Constraints

- Development builds only: the row renders inside the existing `__DEV__ && (...)` Developer group, and the seed refuses to run when `!__DEV__`.
- Demo ids start with `demo-` (constant `DEMO_ID_PREFIX`); only rows with that prefix are ever deleted by the toggle.
- Demo never touches `resume_profile` (the single `me` row), `learner_profile`, settings, name or lessons; Ford exists only in demo résumé documents and items.
- Demo rows never reach a backup, a restore decision (`hasOwnLearningData`) or a notification.
- Dates are relative to "now" (seed takes a `Date`), never hard-coded.
- Strings in `features/settings/strings.ts`, English and Filipino; no literal UI text in components.
- Tests sit beside their source as `name.test.ts`, import from `@jest/globals`, never under `src/app/`.
- No commits unless the owner asks (project rule). Steps below therefore have no commit step.
- Invented company and role names only; no real companies.

## Review Focus

- Turning on twice, or a double tap on the toggle: one set of rows, not two (Task 2).
- A real application and a real income linked to it exist when demo is turned off: both survive, link intact (Task 2).
- Delete all data or "Show the welcome again" while demo is on: the switch must match the database afterwards, not a stale flag (Task 2, `app_state` marker).
- A phone with only demo rows must still count as "no learning data" so a cloud backup is offered to restore (Task 3).
- Demo follow-ups and the interview in two days must never schedule a notification (Task 3).

---

### Task 1: Demo id helpers

**Files:**
- Create: `src/lib/demo.ts`
- Test: `src/lib/demo.test.ts`

**Interfaces:**
- Produces: `DEMO_ID_PREFIX = 'demo-'`, `demoId(name: string): string`, `isDemoId(id: unknown): boolean`.

- [ ] **Step 1: Write the failing test** `demo.test.ts`: `demoId('app-1')` equals `'demo-app-1'`; `isDemoId('demo-app-1')` is true; `isDemoId('app-1')`, `isDemoId('Demo-x')`, `isDemoId(null)` and `isDemoId(42)` are false.
- [ ] **Step 2: Run** `npx jest src/lib/demo.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 3: Implement** the three exports in `src/lib/demo.ts` (a shared lib so backup and career both import it without importing each other).
- [ ] **Step 4: Run** the same command. Expected: PASS.

### Task 2: Seed, remove and state for the Career demo

**Files:**
- Create: `src/features/career/demo/career-demo.ts`
- Test: `src/features/career/demo/career-demo.test.ts`

**Interfaces:**
- Consumes: `DEMO_ID_PREFIX`/`demoId` (Task 1); `readAppState`/`writeAppState`/`clearAppState` (`@/db/app-state`); `runInTransaction` (`@/db/transaction`); `toISODate`/`addDays`/`ISODate` (`@/lib/dates`); `emptyContent` and `ResumeContent` (`@/features/resume/lib/document`); `defaultStyle`, `TemplateId` (`@/features/resume/lib/templates`); `goalProgress` (`../lib/goal-progress`).
- Produces: `CAREER_DEMO_KEY = 'demo:career'`, `isCareerDemoOn(db: SQLiteDatabase): Promise<boolean>`, `seedCareerDemo(db: SQLiteDatabase, now: Date): Promise<void>`, `removeCareerDemo(db: SQLiteDatabase): Promise<void>`.

- [ ] **Step 1: Write the failing tests** (`createTestDatabase()`, `NOW = new Date(2026, 10, 15, 10, 0)`):
  - `seeds Career`: after `seedCareerDemo`, `readApplications` has 12 rows whose ids all start `demo-`; stage counts are saved 2, applied 3, interview 2, offer 1, won 2, closed 2; 8 `job` and 4 `freelance`; both `won` are `freelance`; sources include `onlinejobs`, `kalibrr`, `upwork`, `jobstreet`, `linkedin`, `referral`.
  - `has something to do now`: exactly one interview `interview_at` falls within the next 48 hours of `NOW`; at least two active-stage rows have `follow_up_on` on or before `2026-11-15`; every `applied_on` is within the 60 days before `NOW` and never in the future.
  - `income`: `readIncome` has 10 rows, 8 `PHP` and 2 `USD`, `received_on` spread over the 180 days before `NOW` (none in the future), and the two `won` applications each have at least one linked income row.
  - `goals`: three goals (metrics `income`, `applications`, `interviews`); `goalProgress` gives three different values, none of them equal.
  - `resume`: `resume_documents` has 2 rows (templates `developer` and `freelancer`) whose parsed `content.name` is `Ford` and `content.location` is `Naga City, Philippines`; `resume_items` has at least 5 demo rows including `experience`, `education` and `skill`; `resume_profile` has no rows after seeding.
  - `isCareerDemoOn` is false before, true after seeding, false after `removeCareerDemo`.
  - `seeding twice changes nothing`: row counts identical after a second `seedCareerDemo`.
  - `removing leaves real data`: seed, then save one real application (`id: 'real-1'`) and one real income linked to it; `removeCareerDemo`; both real rows remain with the link intact, and `applications`, `income`, `career_goals`, `resume_items`, `resume_documents` contain no `demo-` ids; `deleted_rows` has no `demo-` ids.
  - `delete all data`: seed, run `deleteAllData` (`@/features/settings/api/reset`), `isCareerDemoOn` is false.
- [ ] **Step 2: Run** `npx jest src/features/career/demo`. Expected: FAIL (module missing).
- [ ] **Step 3: Implement** the four exports in `career-demo.ts`. `seedCareerDemo` returns early if the marker exists, otherwise inserts everything inside one `runInTransaction` and writes the marker last, using `INSERT` with explicit `created_at`/`updated_at` timestamps derived from each row's date (so Career's `updated_at DESC` order looks natural). Résumé content is built from `emptyContent()` overrides and stored as JSON with `JSON.stringify(defaultStyle(template))`. `removeCareerDemo` deletes `WHERE id LIKE 'demo-%'` from `applications`, `income`, `career_goals`, `resume_items`, `resume_documents`, then deletes `deleted_rows` where `row_id LIKE 'demo-%'`, then `clearAppState`, in one transaction. Seed content (names, notes) is the builder's, within the counts above.
- [ ] **Step 4: Run** the same command. Expected: PASS.

### Task 3: Backup and reminders skip demo rows

**Files:**
- Modify: `src/features/backup/api/local-rows.ts` (`readLocalRows`, `readLocalTombstones`, `hasOwnLearningData`)
- Modify: `src/features/career/lib/reminder-plan.ts` (`planCareerReminders`)
- Test: `src/features/backup/api/local-rows.test.ts` (new), `src/features/career/lib/reminder-plan.test.ts` (add)

**Interfaces:**
- Consumes: `DEMO_ID_PREFIX`, `isDemoId` (Task 1); `seedCareerDemo` (Task 2).
- Produces: unchanged signatures; behavior only.

- [ ] **Step 1: Write the failing tests:**
  - `local-rows.test.ts` `readLocalTables skips demo rows`: seed the demo plus one real application; `readLocalTables(db)` has only the real application and no `demo-` key in any table; `readLocalTombstones` after `removeCareerDemo`-free state has none starting `demo-` (insert a `deleted_rows` row for `demo-x` and one for `real-x`; only `real-x` is returned).
  - `hasOwnLearningData is false with only demo rows`; becomes true after adding one real income row.
  - `reminder-plan.test.ts` `never plans reminders for demo applications`: an active application with id `demo-a1`, a follow-up today and an interview tomorrow plans nothing; the same row with id `a1` still plans them.
- [ ] **Step 2: Run** `npx jest src/features/backup/api/local-rows.test.ts src/features/career/lib/reminder-plan.test.ts`. Expected: FAIL on the new tests.
- [ ] **Step 3: Implement.** In `readLocalRows` add `WHERE <spec.key> NOT LIKE 'demo-%'` (derive the pattern from `DEMO_ID_PREFIX`). In `readLocalTombstones` filter out ids starting with the prefix. In `hasOwnLearningData` query each table's key from `BACKUP_TABLES` with the same exclusion (a table not in `BACKUP_TABLES` keeps the old query). In `planCareerReminders` skip rows where `isDemoId(row.id)`.
- [ ] **Step 4: Run** the same command plus `npx jest src/features/backup`. Expected: PASS, and the existing backup tests unchanged.

### Task 4: The toggle in Settings

**Files:**
- Create: `src/features/career/demo/use-career-demo.ts`
- Modify: `src/features/career/index.ts` (export `useCareerDemo`)
- Modify: `src/features/settings/screens/settings-screen.tsx` (Developer group), `src/features/settings/strings.ts`

**Interfaces:**
- Consumes: `isCareerDemoOn`, `seedCareerDemo`, `removeCareerDemo` (Task 2); `useDbQuery`, `useDbMutation` (`@/db`).
- Produces: `useCareerDemo(): { on: boolean; toggling: boolean; setOn: (on: boolean) => void }`.

- [ ] **Step 1: Implement `useCareerDemo`.** `on` comes from `useDbQuery(['career-demo'], isCareerDemoOn)` (false while loading); `setOn(next)` runs `useDbMutation<boolean>((db, on) => (on ? seedCareerDemo(db, new Date()) : removeCareerDemo(db)), { notify: false })`; it ignores calls while `toggling`, and does nothing when `!__DEV__`.
- [ ] **Step 2: Add strings** in both `en` and `fil` of `settingsStrings`: `careerDemo` ("Career demo data" / "Career demo data"), `careerDemoDetail` (English: "Development builds only. Fills Career with Ford’s job hunt and freelance income, from Naga City, Philippines. Your own data isn’t changed; turning it off removes only the demo entries."; Filipino equivalent).
- [ ] **Step 3: Add the row** in the Developer group, after "Unlock all": `<ListRow title={strings.careerDemo} titleLines={2} subtitle={strings.careerDemoDetail} icon="work" trailing={<Toggle value={demo.on} onValueChange={demo.setOn} accessibilityLabel={strings.careerDemo} />} />` (check the icon name exists in the Material Symbols map; pick the closest existing one otherwise).
- [ ] **Step 4: Run** `npm run check` (lint, typecheck, all tests). Expected: PASS.

### Task 5: See it, record it

**Files:**
- Modify: `CLAUDE.md` (a dated entry under the Talino decisions), `docs/superpowers/specs/2026-11-15-demo-data-design.md` (status: implemented)

- [ ] **Step 1: Run on the simulator** (`npm run ios`; load `mobile-app-playbook:cross-platform-testing` for the method): Settings → Developer → Career demo data on; open Career, Applications, Income, a goal, Résumé; screenshot each. Then off; confirm they are empty again, and that a real application added beforehand is still there.
- [ ] **Step 2: Write the CLAUDE.md entry** (what it is, the marker-only state, the exclusions, and what was and was not seen).
- [ ] **Step 3: Report** what was run (`npm run check`), what was seen on the simulator, and what was not (Android, dark mode, real Free/Pro gating of Career screens).
