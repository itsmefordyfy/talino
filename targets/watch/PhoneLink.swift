import Foundation
import WatchConnectivity
import WidgetKit

/// The Watch's end of the link: the phone's latest snapshot, whether the phone can be reached, and commands to it (Listen's play,
/// pause and skip). Nothing is queued for later: a Listen button only makes sense while the phone is reading, so a command the
/// phone can't take now is simply not done and the Watch says to open Talino.
final class PhoneLink: NSObject, ObservableObject, WCSessionDelegate {
  static let shared = PhoneLink()

  @Published var snapshot: WatchSnapshot?
  @Published var reachable = false
  /// A snapshot the Watch can't read (the phone app is newer than this one).
  @Published var unreadable = false

  private static let storeKey = "snapshot"
  /// Where the complication reads the latest snapshot (see targets/watch-widget); a group is per device, so this is not a phone link.
  private static let group = "group.com.fordytechsolutions.talino"
  private static let replyTimeout: TimeInterval = 8

  override init() {
    super.init()
    if let json = UserDefaults.standard.string(forKey: PhoneLink.storeKey) { accept(json, remember: false) }
    guard WCSession.isSupported() else { return }
    WCSession.default.delegate = self
    WCSession.default.activate()
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    DispatchQueue.main.async {
      self.reachable = session.isReachable
      if let json = session.receivedApplicationContext["s"] as? String { self.accept(json) }
      self.requestSnapshot()
    }
  }

  func sessionReachabilityDidChange(_ session: WCSession) {
    DispatchQueue.main.async {
      self.reachable = session.isReachable
      if session.isReachable { self.requestSnapshot() }
    }
  }

  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    guard let json = applicationContext["s"] as? String else { return }
    DispatchQueue.main.async { self.accept(json) }
  }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    guard let json = message["s"] as? String else { return }
    DispatchQueue.main.async { self.accept(json) }
  }

  func accept(_ json: String, remember: Bool = true) {
    guard let snapshot = try? JSONDecoder().decode(WatchSnapshot.self, from: Data(json.utf8)), snapshot.v == 1 else {
      unreadable = true
      return
    }
    unreadable = false
    self.snapshot = snapshot
    if remember {
      UserDefaults.standard.set(json, forKey: PhoneLink.storeKey)
      UserDefaults(suiteName: PhoneLink.group)?.set(json, forKey: PhoneLink.storeKey)
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  /// Asks the phone to push a fresh snapshot (it may have changed while the Watch app was closed).
  func requestSnapshot() {
    Task { _ = await send("snapshot.request") }
  }

  /// Sends a command and waits for the phone's answer, at most `timeout` seconds. Reuse `id` to retry the same command: the phone
  /// answers a repeat with the first result and never skips twice.
  func send(_ type: String, fields: [String: Any] = [:], id: String = UUID().uuidString, timeout: TimeInterval = PhoneLink.replyTimeout) async -> CommandResult {
    guard WCSession.isSupported(), WCSession.default.activationState == .activated, WCSession.default.isReachable else { return .failed("unreachable") }
    var command = fields
    command["id"] = id
    command["type"] = type
    guard let data = try? JSONSerialization.data(withJSONObject: command), let json = String(data: data, encoding: .utf8) else { return .failed("failed") }

    return await withCheckedContinuation { continuation in
      let gate = ResumeOnce(continuation)
      WCSession.default.sendMessage(["id": id, "c": json], replyHandler: { reply in
        gate.resume(CommandResult.parse(reply["r"] as? String ?? ""))
      }, errorHandler: { _ in
        gate.resume(.failed("unreachable"))
      })
      DispatchQueue.global().asyncAfter(deadline: .now() + timeout) { gate.resume(.failed("unreachable")) }
    }
  }
}

/// A continuation answered by the reply, the error or the timeout, whichever comes first.
private final class ResumeOnce: @unchecked Sendable {
  private var continuation: CheckedContinuation<CommandResult, Never>?
  private let lock = NSLock()

  init(_ continuation: CheckedContinuation<CommandResult, Never>) { self.continuation = continuation }

  func resume(_ result: CommandResult) {
    lock.lock()
    let pending = continuation
    continuation = nil
    lock.unlock()
    pending?.resume(returning: result)
  }
}
