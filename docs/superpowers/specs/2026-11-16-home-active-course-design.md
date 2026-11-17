# Home: the active course's lesson timeline, with course switching

Owner's brief, 2026-11-16 (follows the course-node Home of the same day). Decisions below are mine, made under the owner's standing "decide and document" rule; none is irreversible.

## Intent

Home becomes the place that answers three questions at a glance: what am I learning, where did I leave off, what is next. By default Home shows **one course's lessons** (the active course), not every course on the journey. Learners switch courses from Home, and an alternative view shows the progression of all courses (the existing level-and-course map).

## Goals

- Default view "My course": active course header (title, level, description, progress bar, "8 of 16 lessons completed", "50%", the lesson Continue opens, a Continue button), then that course's connected lesson timeline (completed, current, upcoming, locked; number, title, duration; the current lesson prominent with Continue).
- A course switcher on the header ("My Learning": started courses, the journey's next course, finished courses). Choosing one replaces the timeline in place, with that course's own progress. No navigation to Discover or a course page.
- Second view "All courses": what Home was (resume card, levels, course nodes). Tapping a course there makes it the active course and returns to "My course" (through the dive, as before).
- Never reset or copy progress when switching. Starting or continuing a course makes it active. A finished course shows its completed state and suggests the next eligible course.

## Non-goals

No change to the journey engine, the course catalog, the lesson/quiz rules, the database or sync. No new dependency. No server state.

## Approaches considered

1. **Persist only the learner's explicit choice.** Simple, but doing a lesson in another course (from the Courses tab) would leave Home showing the old one: wrong for "starting a course makes it active".
2. **Derive the active course purely from activity** (the course worked on most recently). Always right after a lesson, but the switcher would do nothing: a chosen course with no lesson yet would snap back.
3. **A stamped choice resolved against activity (chosen).** The choice is saved with the time it was made. The course with the latest finished lesson wins if that lesson is newer than the choice; otherwise the choice stands; with no choice, the journey's own resume rule applies. Both "I picked it" and "I just worked on it" are respected, restart and restore give the same Home, and nothing needs migrating.

## Rules (pure, tested: `lib/active-course.ts`)

- Active = latest-worked course if its last lesson is newer than the saved choice, else the saved choice if it is still a course in the journey, else `path.resume`, else the first course.
- Never an action node (portfolio, résumé) and never a made-up course. A journey whose courses are all done keeps the last-worked course, shown complete, with the next step suggested.
- My Learning lists: in progress (the active course first), up next (the journey's current course when not started), finished. Locked and untouched skipped courses are not listed (they are in All courses and Discover); the active course is always listed.
- The choice is phone-only (`settings.homeCourse`, not in the backup whitelist): another phone resolves from the restored lesson rows, which is the same answer unless the learner picked a different course there.

## What was removed

The separate `course-journey/[id]` screen: the same timeline now lives on Home, so there is one implementation. Its dive transition is kept and now carries the learner from a course node on the map to the course view.

## Follow-ups (owner, 2026-11-16 and 2026-11-17)

- No course is ever locked in All courses; the journey only says which is next. The dive transition and the opening animations were removed.
- Start on a course's own page makes it the Home course and goes to Home.
- **Declutter:** Home was confusing and crowded. My course is now a small bar (course name = switch, progress, an All courses pill) over a timeline whose one large card is the lesson being worked on, with the single Continue. Finished lessons fold into one row, the next three lessons are short rows, the rest fold into "N more lessons" (`lib/timeline-view.ts`). All courses lost its resume card; it keeps Tali's line, level progress, streak and customize, and gains a My course back button. Why: the first design repeated the same facts in three places (hero card, resume card, current-lesson card) and showed every lesson at full size, so the lesson to do next was often below the fold.
