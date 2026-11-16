# Apple Watch v1 plan

Spec: `docs/superpowers/specs/2026-11-16-apple-watch-design.md`. Logic (snapshot, command parsing, command handling,
ledger, reminder actions) is test-first; SwiftUI is verified by compiling against the watchOS SDK and, where the
simulators allow, by looking at it.

- [ ] 1. `src/lib/result-ledger.ts` (+ test): remembers a command's answer by id.
- [ ] 2. `src/features/watch/types.ts`, `lib/snapshot.ts` (+ test): the snapshot from streak, week, next lesson, listen.
- [ ] 3. `lib/parse-command.ts` (+ test): validates what the Watch sends.
- [ ] 4. `commands.ts` (+ test): listen.play / pause / skip against a fake listener; repeat by id changes nothing.
- [ ] 5. `modules/talino-watch` (Swift WatchConnectivity module + `index.ts`), `bridge.ts`, `watch-sync.tsx`, mounted in `app-hosts.tsx`.
- [ ] 6. Reminder buttons: `notifications/lib/reminder-actions.ts` (+ test), category on the daily reminders, handler in the router.
- [ ] 7. `targets/watch` (glance, listen card, phone link) and `targets/watch-widget` (complication) with `StreakMath.swift` and a compiled check.
- [ ] 8. Verify: lint, tsc, jest, `swiftc -typecheck` for both targets against the watchOS SDK, flagged prebuild, Watch target build, simulator look.
- [ ] 9. Docs: CLAUDE.md (Current state), `docs/BUILD_AND_RELEASE.md` (App IDs), playbook lessons if anything new.
