import SwiftUI

struct ContentView: View {
  @StateObject private var link = PhoneLink.shared
  @Environment(\.scenePhase) private var scenePhase

  var body: some View {
    NavigationStack {
      Group {
        if link.unreadable {
          NoticeView(symbol: "arrow.triangle.2.circlepath", title: "Update Talino", message: "The Talino app on your iPhone is newer than this Watch app. Update it from the Watch app on your iPhone.")
        } else if let snapshot = link.snapshot {
          GlanceView(snapshot: snapshot, reachable: link.reachable)
        } else {
          NoticeView(symbol: "iphone", title: "Talino", message: "Open Talino on your iPhone to see your streak here.")
        }
      }
      .navigationTitle("Talino")
      .containerBackground(talinoViolet.gradient.opacity(0.35), for: .navigation)
    }
    .onAppear(perform: debugSnapshot)
    // Back in front: the phone may have moved on while the Watch app was closed.
    .onChange(of: scenePhase) { _, phase in
      if phase == .active { PhoneLink.shared.requestSnapshot() }
    }
  }

  #if DEBUG
  /// Simulator checks only (the Watch simulator can't be tapped and has no phone app to push from): `-snapshotb64 <base64 of a snapshot JSON>`
  /// stands in for the phone. Compiled out of release builds.
  private func debugSnapshot() {
    guard let encoded = UserDefaults.standard.string(forKey: "snapshotb64"), let data = Data(base64Encoded: encoded), let json = String(data: data, encoding: .utf8) else { return }
    PhoneLink.shared.accept(json, remember: false)
  }
  #else
  private func debugSnapshot() {}
  #endif
}

/// A screen that is only words: the cases with nothing to show, each with a next step.
struct NoticeView: View {
  let symbol: String
  let title: String
  let message: String

  var body: some View {
    VStack(spacing: 6) {
      Image(systemName: symbol).font(.title2).foregroundStyle(talinoViolet).accessibilityHidden(true)
      Text(title).font(.headline).multilineTextAlignment(.center)
      Text(message).font(.footnote).multilineTextAlignment(.center).foregroundStyle(.secondary)
    }
    .padding()
    // Fills the screen so the words sit in its middle, whatever sits above them (the clock).
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
    .accessibilityElement(children: .combine)
  }
}
