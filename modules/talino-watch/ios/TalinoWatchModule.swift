import ExpoModulesCore
import WatchConnectivity

/// The phone's end of the Watch link.
///
/// State goes both ways it can: `updateApplicationContext` (the system keeps the latest for when the Watch next
/// opens) and, when the Watch is reachable, a live `sendMessage`. Live delivery is the one that always arrives in
/// the simulator; queued transfers don't (Pawfetti, 2026-10-25). Commands come in as messages with a reply handler:
/// JS answers through `reply`, and if it doesn't within a few seconds the Watch gets "failed" instead of waiting.
final class WatchLink: NSObject, WCSessionDelegate {
  static let shared = WatchLink()

  weak var module: TalinoWatchModule?
  /// Guarded by `lock`: written on the JS thread by `push`, read on the WatchConnectivity queue when the Watch becomes reachable.
  private var lastState: String?
  private var replies: [String: ([String: Any]) -> Void] = [:]
  private let lock = NSLock()
  private static let failed = "{\"ok\":false,\"reason\":\"failed\"}"
  private static let replyTimeout: TimeInterval = 8

  func activate() {
    guard WCSession.isSupported() else { return }
    let session = WCSession.default
    session.delegate = self
    if session.activationState != .activated { session.activate() }
  }

  func push(_ json: String) {
    lock.lock()
    lastState = json
    lock.unlock()
    guard WCSession.isSupported(), WCSession.default.activationState == .activated else { return }
    let session = WCSession.default
    let message = ["s": json]
    // Throws while the Watch app isn't installed through the companion mechanism (a simulator install by hand); the live message below still works.
    try? session.updateApplicationContext(message)
    if session.isReachable { session.sendMessage(message, replyHandler: nil, errorHandler: nil) }
  }

  func status() -> [String: Any] {
    guard WCSession.isSupported() else { return ["supported": false] }
    let session = WCSession.default
    return [
      "supported": true,
      "activated": session.activationState == .activated,
      "paired": session.isPaired,
      "installed": session.isWatchAppInstalled,
      "reachable": session.isReachable,
    ]
  }

  func reply(id: String, json: String) {
    lock.lock()
    let handler = replies.removeValue(forKey: id)
    lock.unlock()
    handler?(["r": json])
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    sendLastState(session)
  }
  func sessionDidBecomeInactive(_ session: WCSession) {}
  func sessionDidDeactivate(_ session: WCSession) { session.activate() }

  /// The Watch opened: give it what it missed while it was away.
  func sessionReachabilityDidChange(_ session: WCSession) {
    sendLastState(session)
  }

  private func sendLastState(_ session: WCSession) {
    lock.lock()
    let state = lastState
    lock.unlock()
    if session.isReachable, let state = state { session.sendMessage(["s": state], replyHandler: nil, errorHandler: nil) }
  }

  /// A command the Watch could not send live and handed to the system's queue (`transferUserInfo`): the system delivers it, waking
  /// this app in the background if it is not running. There is no one to reply to: the Watch also keeps the command until the phone has
  /// answered it live, and the app remembers every command id, so getting it twice does nothing twice. If the app's JavaScript is not
  /// up yet the event is lost, which is fine for the same reason: the Watch sends it again once the app is reachable.
  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    guard let id = userInfo["id"] as? String, let json = userInfo["c"] as? String, let module = module else { return }
    module.sendEvent("onCommand", ["id": id, "json": json])
  }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
    guard let id = message["id"] as? String, let json = message["c"] as? String, let module = module else {
      replyHandler(["r": WatchLink.failed])
      return
    }
    lock.lock()
    // A second message with an id that is still waiting would orphan the first reply handler; answer it at once instead.
    let alreadyWaiting = replies[id] != nil
    if !alreadyWaiting { replies[id] = replyHandler }
    lock.unlock()
    if alreadyWaiting {
      replyHandler(["r": WatchLink.failed])
      return
    }
    module.sendEvent("onCommand", ["id": id, "json": json])
    DispatchQueue.global().asyncAfter(deadline: .now() + WatchLink.replyTimeout) { [weak self] in
      self?.reply(id: id, json: WatchLink.failed)
    }
  }
}

public class TalinoWatchModule: Module {
  public func definition() -> ModuleDefinition {
    Name("TalinoWatch")

    Events("onCommand")

    OnCreate {
      WatchLink.shared.module = self
      WatchLink.shared.activate()
    }

    Function("pushState") { (json: String) in
      WatchLink.shared.push(json)
    }

    Function("status") { () -> [String: Any] in
      WatchLink.shared.status()
    }

    Function("reply") { (id: String, json: String) in
      WatchLink.shared.reply(id: id, json: json)
    }
  }
}
