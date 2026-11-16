import Foundation

// Compiled with targets/watch/StreakMath.swift: `npm run test:watch-swift`. Plain asserts, no XCTest (swiftc alone, no project).
var failures = 0
func check(_ condition: Bool, _ name: String) {
  if condition { print("ok   \(name)") } else { print("FAIL \(name)"); failures += 1 }
}

var cal = Calendar(identifier: .gregorian)
cal.timeZone = TimeZone(identifier: "Asia/Manila")!
func e(_ day: String, _ current: Int, _ done: Bool, _ today: String) -> (Int, Bool) {
  let r = StreakMath.effective(snapshotDay: day, current: current, doneToday: done, today: today, calendar: cal)
  return (r.current, r.doneToday)
}

check(StreakMath.daysBetween("2026-11-16", "2026-11-17", calendar: cal) == 1, "one day apart")
check(StreakMath.daysBetween("2026-10-31", "2026-11-02", calendar: cal) == 2, "across a month")
check(StreakMath.daysBetween("2026-12-31", "2027-01-01", calendar: cal) == 1, "across a year")
check(StreakMath.daysBetween("nope", "2026-11-02", calendar: cal) == nil, "unreadable date")

check(e("2026-11-16", 5, true, "2026-11-16") == (5, true), "same day, done: as sent")
check(e("2026-11-16", 5, false, "2026-11-16") == (5, false), "same day, not done: still alive")
check(e("2026-11-16", 5, true, "2026-11-17") == (5, false), "next day after a done day: alive, today not done")
check(e("2026-11-16", 5, false, "2026-11-17") == (0, false), "next day after a missed day: ended")
check(e("2026-11-16", 5, true, "2026-11-18") == (0, false), "two days later: ended")
check(e("2026-11-16", 0, false, "2026-11-20") == (0, false), "no streak stays none")
check(e("2026-11-17", 5, true, "2026-11-16") == (5, true), "Watch clock behind the phone: trust the phone")
check(e("garbage", 5, true, "2026-11-16") == (5, true), "unreadable snapshot day: trust the phone")

let week = [true, false, true, true, false, true, true]
check(StreakMath.dots(week, snapshotDay: "2026-11-16", today: "2026-11-16", calendar: cal) == week, "dots unchanged on the same day")
check(StreakMath.dots(week, snapshotDay: "2026-11-16", today: "2026-11-17", calendar: cal) == [false, true, true, false, true, true, false], "dots shift a day")
check(StreakMath.dots(week, snapshotDay: "2026-11-16", today: "2026-11-30", calendar: cal) == Array(repeating: false, count: 7), "a week away clears the dots")

print(failures == 0 ? "all passed" : "\(failures) failed")
exit(failures == 0 ? 0 : 1)
