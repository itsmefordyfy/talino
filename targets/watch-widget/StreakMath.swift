import Foundation

/// The streak as the Watch should show it **now**, from what the phone last said.
///
/// The phone's figure is right on the day it was sent. With the phone away past midnight it goes stale, and showing "7 days" for a
/// streak that ended yesterday would be a lie. This mirrors the phone's `computeStreak` (a streak counts up to today, or up to
/// yesterday while today isn't done yet): one unfinished day is still alive, a second one ends it. A copy of this file sits in
/// targets/watch-widget (the complication is its own process); scripts/watch-checks compiles and checks it.
enum StreakMath {
  /// Whole calendar days from `from` to `to` (both `YYYY-MM-DD`), or nil when either does not read.
  static func daysBetween(_ from: String, _ to: String, calendar: Calendar = .current) -> Int? {
    guard let a = date(from, calendar), let b = date(to, calendar) else { return nil }
    return calendar.dateComponents([.day], from: a, to: b).day
  }

  static func date(_ iso: String, _ calendar: Calendar = .current) -> Date? {
    let parts = iso.split(separator: "-").compactMap { Int($0) }
    guard parts.count == 3 else { return nil }
    return calendar.date(from: DateComponents(year: parts[0], month: parts[1], day: parts[2]))
  }

  static func iso(_ date: Date, _ calendar: Calendar = .current) -> String {
    let c = calendar.dateComponents([.year, .month, .day], from: date)
    return String(format: "%04d-%02d-%02d", c.year ?? 0, c.month ?? 0, c.day ?? 0)
  }

  /// The streak and whether today is done, as of `today`.
  static func effective(snapshotDay: String, current: Int, doneToday: Bool, today: String, calendar: Calendar = .current) -> (current: Int, doneToday: Bool) {
    // A date that doesn't read, or a Watch clock behind the phone's: trust the phone's figures as they are.
    guard let gap = daysBetween(snapshotDay, today, calendar: calendar), gap >= 0 else { return (current, doneToday) }
    if gap == 0 { return (current, doneToday) }
    // Done on the snapshot's day, so the streak reaches that day; the next day is simply not done yet.
    if gap == 1 && doneToday { return (current, false) }
    return (0, false)
  }

  /// The week's dots re-aligned to `today`: the snapshot's last seven days shifted left by the days that have passed.
  static func dots(_ dots: [Bool], snapshotDay: String, today: String, calendar: Calendar = .current) -> [Bool] {
    guard dots.count == 7, let gap = daysBetween(snapshotDay, today, calendar: calendar), gap > 0 else { return dots }
    if gap >= 7 { return Array(repeating: false, count: 7) }
    return Array(dots.dropFirst(gap)) + Array(repeating: false, count: gap)
  }
}
