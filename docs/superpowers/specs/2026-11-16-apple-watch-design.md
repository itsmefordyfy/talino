# Talino on Apple Watch (v1)

Owner's request, 2026-11-16: "for apple watch, what we can do in talino", then "work on this and follow design
patterns" with Apple's *Designing for watchOS* page. The owner picked no variant, so every choice below is Claude's
call and can be changed. Sized as **a project** (a new native target plus a phone bridge), built in the owner's usual
Watch way (CarMind, Pawfetti, Ulamin, Bubblie).

## Intent
Talino is a habit and career app. A wrist is bad for reading a lesson and good for three things: seeing the streak and
the week without opening anything, being nudged at the right moment, and steering audio the phone is already playing.
v1 does exactly those and nothing that needs typing or reading.

## Goals
1. **Glance**: streak (and whether today is done), the last seven days, progress toward the weekly lesson goal, the next
   lesson (course, day, title). Read-only.
2. **Complication** on watch faces and in the Smart Stack: streak and weekly goal (circular, rectangular, corner, inline).
3. **Reminder buttons** on the daily-lesson notification (Start now, In 1 hour). The notification already mirrors to a
   paired Watch; the buttons also show on the wrist.
4. **Listen remote**: while the phone reads a lesson, the glance shows it with play/pause and back/forward a sentence.

## Non-goals (v1) and anti-goals
- No lessons, quizzes, code runner, résumé, certificates, Tali chat, career tracker or flashcards on the Watch
  (reading/typing; v2 candidates: a quiz question at a time, an applications counter).
- No free-text or dictation input. No Watch-side database: **the phone stays the brain**, nothing is written from Swift.
- Never a guilt mechanic: a missed day is a gap, not a loss (the phone app's own rule for `WeekCard`).
- Nothing that makes Free worse: **no part of v1 is Pro**, because it is a view of the learner's own progress and a
  remote for audio they already have access to. (Pro-gating belongs to a future write feature, as in CarMind.)

## Constraints
- Same build switch as every app: `TALINO_WATCH=1` at prebuild adds `@bacons/apple-targets` (already wired in
  `app.config.js`; `npm run ios:watch`, `release:ios:watch`). Unflagged App Store builds are unchanged.
- Owner steps before a flagged release: App IDs `com.fordytechsolutions.talino.watchkitapp` and `.watchkitapp.widget`
  (both with App Group `group.com.fordytechsolutions.talino`).
- English only on the Watch and on the notification buttons (owner rule: no Filipino text written by Claude). Titles
  of courses and lessons arrive already in the learner's language from the phone.
- A suspended, idle iPhone app can't answer the Watch: the Watch shows the last snapshot (kept on the Watch) and says
  "Open Talino on your iPhone" only when a control needs the phone. Playing audio keeps the app alive, so the Listen
  remote works whenever it is shown.

## Approaches considered
1. **Notification buttons only** (no Watch app): cheapest, but nothing to look at between reminders, no complication.
2. **Watch app + complication + a phone bridge** (CarMind's pattern, chosen): the glance and complication carry the
   habit; the same bridge carries the Listen remote. Cost: a native module, two targets, App IDs.
3. **Standalone Watch app with its own progress copy**: works with the phone away, but progress then lives in two places
   (against the offline-first rule: one source of truth, SQLite on the phone). Rejected.

## Design (watchOS HIG, applied)
Apple's three words: **glanceable, lightweight, holistic**.
- *Glanceable:* the first screen answers "is my streak safe, how is the week" in one look: a big streak number with the
  flame, seven day dots, a goal ring. No menus above it.
- *Lightweight:* one scrolling screen, one level deep, no navigation hierarchy. Listen controls appear only while audio
  is playing or paused.
- *Holistic:* the phone owns the data and the notifications; the Watch mirrors it and sends only "set this state"
  commands (`listen.play`, `listen.pause`, `listen.skip`) with a command id, remembered by the phone, so a retry never
  repeats a skip.
- Layout: system text styles (Dynamic Type), `@ScaledMetric` for the big figure, 44 pt minimum targets, full-width
  solid primary buttons (a custom `ButtonStyle`, because pastel brand tints make watchOS bordered buttons unreadable),
  the system's list/scroll behaviour and the Digital Crown untouched, content clear of the corners.
- Always On: `isLuminanceReduced` dims accent colours and hides the "updated" line; nothing animates.
- Colour: Talino's violet `#7957F5` as the fill, amber only for the streak flame (the app's own rule), mint for a
  completed day. Icons are SF Symbols (Apple's recommendation on watchOS; separate process, no app fonts), the same
  exception the playbook already makes for widgets.
- Accessibility: every element has a label; the dots read as "5 of 7 days"; the ring as "3 of 5 lessons".
- Complication: `accessoryCircular` goal ring with the streak inside, `accessoryRectangular` streak + goal + next lesson,
  `accessoryCorner` flame with a label, `accessoryInline` one line; Smart Stack relevance rises while today is not done
  and the daily-reminder time is near (v1: while today is not done).

## Data and commands
Snapshot (JSON, `v: 1`, pushed by the phone after any learning change, on app open, and when the Watch asks):
`sentAt`, `day` (the phone's local ISO date), `streak {current, best, doneToday}`, `week {dots[7], done, target}`,
`next {course, lesson, day, started} | null`, `listen {state, lesson, course, canSkip} | null`, `handled[]`.
The Watch shows streak freshness correctly after midnight with the phone away: `effectiveStreak(snapshotDay, current,
doneToday, today)` (a streak survives one unfinished day, then reads 0). That rule is shared Swift code with a compiled
check, and mirrors `computeStreak`.
Commands: `snapshot.request`, `listen.play`, `listen.pause`, `listen.skip {by: 1 | -1}`.

## Reminder buttons
The daily reminder gets category `daily-lesson` with **Start now** (opens the app on the lesson, as a tap does) and
**In 1 hour** (schedules one `daily-later:` reminder an hour on, no app launch). Whether the buttons act while the app is
closed is a known iOS-by-device behaviour and is **not verified here**.

## Left to the builder
Exact spacing, the ring's size, the placeholder entry for the gallery, and the debug launch arguments for the Watch
simulator (as in the other apps).
