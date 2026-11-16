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

/// The phone's answer to a command: `{"ok":true}` or `{"ok":false,"reason":"…"}` (the same shape the phone's `WatchResult` has).
struct CommandResult {
  let ok: Bool
  let reason: String?

  static func failed(_ reason: String) -> CommandResult { CommandResult(ok: false, reason: reason) }

  static func parse(_ json: String) -> CommandResult {
    guard let data = json.data(using: .utf8), let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return .failed("failed") }
    return CommandResult(ok: object["ok"] as? Bool ?? false, reason: object["reason"] as? String)
  }
}
