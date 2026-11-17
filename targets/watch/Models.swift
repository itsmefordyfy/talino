import Foundation

/// What the phone pushes (src/features/watch/types.ts). `v` is the shape's version: a phone newer than this Watch app says so instead of guessing.
struct WatchSnapshot: Codable, Equatable {
  struct Streak: Codable, Equatable { let current: Int; let best: Int; let doneToday: Bool }
  struct Week: Codable, Equatable { let dots: [Bool]; let done: Int; let target: Int }
  struct Next: Codable, Equatable { let course: String; let lesson: String; let day: Int; let started: Bool }
  struct Listen: Codable, Equatable {
    let state: String
    let lesson: String
    let course: String
    let canSkip: Bool
    /// The sentence being said, shown on the wrist; the phone sends none when it can't say which.
    let sentence: String?
    let index: Int?
    let count: Int?
    var isPaused: Bool { state == "paused" }
    var isLoading: Bool { state == "loading" }
  }

  let v: Int
  /// Epoch milliseconds when the phone built it.
  let sentAt: Double
  /// The phone's local calendar day, `YYYY-MM-DD`.
  let day: String
  let streak: Streak
  let week: Week
  let next: Next?
  let listen: Listen?
  let handled: [String]?

  var sentDate: Date { Date(timeIntervalSince1970: sentAt / 1000) }
}

/// A lesson the phone hands over so the Watch can speak and show it itself (src/features/watch/types.ts `WatchLesson`).
struct WatchLesson: Codable, Equatable {
  let lessonId: String
  let title: String
  let course: String
  /// `en` or `fil`: picks the voice.
  let language: String
  let sentences: [String]
  /// For each sentence, its place among the phone's spoken segments (empty ones are left out), so handing back resumes at the right one.
  let at: [Int]
  /// The sentence to start with.
  let segment: Int
}

/// The phone's answer to a command: `{"ok":true}` or `{"ok":false,"reason":"…"}` (the same shape the phone's `WatchResult` has).
struct CommandResult {
  let ok: Bool
  let reason: String?
  /// Set by a handover (`listen.toWatch`): the lesson to speak here.
  let lesson: WatchLesson?

  static func failed(_ reason: String) -> CommandResult { CommandResult(ok: false, reason: reason, lesson: nil) }

  static func parse(_ json: String) -> CommandResult {
    guard let data = json.data(using: .utf8), let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return .failed("failed") }
    var lesson: WatchLesson?
    if let raw = object["lesson"], let bytes = try? JSONSerialization.data(withJSONObject: raw) { lesson = try? JSONDecoder().decode(WatchLesson.self, from: bytes) }
    return CommandResult(ok: object["ok"] as? Bool ?? false, reason: object["reason"] as? String, lesson: lesson)
  }
}
