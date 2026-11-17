import SwiftUI
import WatchKit

/// The one screen: is the streak safe, how is the week going, what is next, and (only while the phone is reading a lesson) its controls.
/// Everything is read-only except Listen's three buttons, and everything follows watchOS's rules: system text styles that grow with Dynamic
/// Type, 44 pt touch targets, the standard scrolling and Digital Crown, and a dimmed, quiet look when the display is Always On.
struct GlanceView: View {
  let snapshot: WatchSnapshot
  let reachable: Bool

  @Environment(\.isLuminanceReduced) private var dimmed
  @ScaledMetric(relativeTo: .largeTitle) private var streakSize: CGFloat = 44
  @ObservedObject private var speaker = WatchSpeaker.shared
  @State private var busy = false
  @State private var notice: String?
  /// "Play on": the iPhone or this Apple Watch, asked when a lesson is about to play.
  @State private var choosingOutput = false

  var body: some View {
    // Once a minute, so the streak and the week turn over at midnight even if the app stays open.
    TimelineView(.everyMinute) { context in
      let today = StreakMath.iso(context.date)
      let streak = StreakMath.effective(snapshotDay: snapshot.day, current: snapshot.streak.current, doneToday: snapshot.streak.doneToday, today: today)
      let dots = StreakMath.dots(snapshot.week.dots, snapshotDay: snapshot.day, today: today)
      ScrollViewReader { proxy in
        ScrollView {
          VStack(alignment: .leading, spacing: 8) {
            if speaker.isActive {
              watchListenPanel
            } else if let listen = snapshot.listen {
              listenPanel(listen)
            }
            streakHeader(current: streak.current, doneToday: streak.doneToday)
            weekPanel(dots: dots, today: context.date)
            goalPanel.id("goal")
            if let next = snapshot.next { nextPanel(next).id("next") }
            footer(now: context.date).id("footer")
          }
          .padding(.horizontal, 4)
        }
        .onAppear { debugScroll(proxy) }
      }
    }
    // One voice at a time: if the phone starts reading after the lesson was handed to the Watch, the Watch goes quiet. A snapshot built before
    // the handover (the phone was still reading then) is older than the hand-over, so it is not mistaken for that.
    .onChange(of: snapshot.sentAt) { _, sentAt in
      if speaker.isActive, snapshot.listen != nil, sentAt > speaker.startedAt + 500 { speaker.stop() }
    }
    .confirmationDialog("Play lesson on", isPresented: $choosingOutput, titleVisibility: .visible) {
      Button("iPhone") { startOnPhone() }
      Button("Apple Watch") { startOnWatch() }
      Button("Cancel", role: .cancel) {}
    }
  }

  #if DEBUG
  /// Simulator checks only (it can't be scrolled): `-scrollTo goal|next|footer` brings that part into view. Compiled out of release builds.
  private func debugScroll(_ proxy: ScrollViewProxy) {
    guard let id = UserDefaults.standard.string(forKey: "scrollTo") else { return }
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { proxy.scrollTo(id, anchor: .bottom) }
  }
  #else
  private func debugScroll(_ proxy: ScrollViewProxy) {}
  #endif

  // MARK: Streak

  private func streakHeader(current: Int, doneToday: Bool) -> some View {
    VStack(alignment: .leading, spacing: 2) {
      HStack(alignment: .firstTextBaseline, spacing: 6) {
        Image(systemName: "flame.fill").font(.title2).foregroundStyle(dimmed ? Color.secondary : talinoAmber).accessibilityHidden(true)
        if current > 0 {
          Text("\(current)").font(.system(size: streakSize, weight: .bold, design: .rounded)).monospacedDigit()
          Text("day streak").font(.footnote).foregroundStyle(.secondary)
        } else {
          Text("No streak yet").font(.headline)
        }
      }
      HStack(spacing: 4) {
        if doneToday { Image(systemName: "checkmark.circle.fill").foregroundStyle(dimmed ? Color.secondary : talinoMint).accessibilityHidden(true) }
        Text(doneToday ? "Done for today" : current > 0 ? "Finish a lesson to keep it" : "Finish a lesson to start one")
          .font(.footnote).foregroundStyle(.secondary)
      }
    }
    .accessibilityElement(children: .combine)
    .accessibilityLabel(current > 0 ? "\(current) day streak. \(doneToday ? "Done for today." : "Finish a lesson to keep it.")" : "No streak yet. Finish a lesson to start one.")
  }

  // MARK: The week

  private func weekPanel(dots: [Bool], today: Date) -> some View {
    let initials = Self.weekdayInitials(endingOn: today)
    return Panel {
      HStack(spacing: 0) {
        ForEach(0..<7, id: \.self) { index in
          let done = index < dots.count && dots[index]
          VStack(spacing: 3) {
            ZStack {
              Circle().fill(done ? (dimmed ? Color.secondary : talinoMint) : Color.white.opacity(0.14))
              if done { Image(systemName: "checkmark").font(.system(size: 9, weight: .bold)).foregroundStyle(.black) }
              // Today gets a ring, so "where am I in the week" is clear at a glance.
              if index == 6 { Circle().strokeBorder(Color.white.opacity(dimmed ? 0.4 : 0.9), lineWidth: 1.5) }
            }
            .frame(width: 16, height: 16)
            Text(initials[index]).font(.system(size: 10)).foregroundStyle(.secondary)
          }
          .frame(maxWidth: .infinity)
        }
      }
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel("\(dots.filter { $0 }.count) of 7 days this week")
  }

  /// One-letter weekday names for the seven days ending on `date`, oldest first, in the Watch's own language.
  static func weekdayInitials(endingOn date: Date) -> [String] {
    let calendar = Calendar.current
    let symbols = calendar.veryShortWeekdaySymbols
    return (0..<7).map { offset in
      let day = calendar.date(byAdding: .day, value: offset - 6, to: date) ?? date
      return symbols[calendar.component(.weekday, from: day) - 1]
    }
  }

  // MARK: Weekly goal

  private var goalPanel: some View {
    let target = max(1, snapshot.week.target)
    let done = snapshot.week.done
    return Panel {
      VStack(alignment: .leading, spacing: 4) {
        Text("Weekly goal").font(.footnote).foregroundStyle(.secondary)
        Gauge(value: Double(min(done, target)), in: 0...Double(target)) { EmptyView() }
          .gaugeStyle(.linearCapacity)
          .tint(dimmed ? Color.secondary : talinoViolet)
        Text("\(done) of \(target) lessons").font(.headline).monospacedDigit()
      }
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel("Weekly goal: \(done) of \(target) lessons")
  }

  // MARK: Next lesson

  private func nextPanel(_ next: WatchSnapshot.Next) -> some View {
    Panel {
      VStack(alignment: .leading, spacing: 2) {
        Text(next.started ? "Up next" : "Start here").font(.footnote).foregroundStyle(.secondary)
        Text(next.lesson).font(.headline).lineLimit(3)
        Text("\(next.course) · Day \(next.day)").font(.caption2).foregroundStyle(.secondary).lineLimit(2)
        // Not while a lesson is already being read (on either device): its own panel has the controls.
        if snapshot.listen == nil && !speaker.isActive {
          Button { choosingOutput = true } label: { Label("Listen", systemImage: "headphones") }
            .buttonStyle(PrimaryButtonStyle())
            .disabled(busy)
            .padding(.top, 4)
            .accessibilityHint("Choose to play the lesson on your iPhone or on this watch")
        }
      }
    }
  }

  // MARK: Listen

  private func listenPanel(_ listen: WatchSnapshot.Listen) -> some View {
    Panel {
      VStack(alignment: .leading, spacing: 6) {
        Label("Listening", systemImage: "headphones").font(.footnote).foregroundStyle(dimmed ? Color.secondary : talinoVioletText)
        Text(listen.lesson.isEmpty ? "Your lesson" : listen.lesson).font(.headline).lineLimit(2)
        if !listen.course.isEmpty { Text(listen.course).font(.caption2).foregroundStyle(.secondary).lineLimit(1) }
        // What is being said, so the lesson can be followed on the wrist.
        if let sentence = listen.sentence, !sentence.isEmpty { sentenceText(sentence, index: listen.index ?? 0, count: listen.count ?? 0) }
        HStack(spacing: 6) {
          Button { send("listen.skip", by: -1) } label: { Image(systemName: "backward.fill") }
            .buttonStyle(RoundControlStyle())
            .disabled(!listen.canSkip || busy)
            .accessibilityLabel("Back a sentence")
          Button { send(listen.isPaused ? "listen.play" : "listen.pause") } label: {
            if listen.isLoading { ProgressView() } else { Image(systemName: listen.isPaused ? "play.fill" : "pause.fill") }
          }
          .buttonStyle(PrimaryButtonStyle())
          .disabled(listen.isLoading || busy)
          .accessibilityLabel(listen.isPaused ? "Play" : "Pause")
          Button { send("listen.skip", by: 1) } label: { Image(systemName: "forward.fill") }
            .buttonStyle(RoundControlStyle())
            .disabled(!listen.canSkip || busy)
            .accessibilityLabel("Forward a sentence")
        }
        Button { moveToWatch() } label: { Label("Play on Apple Watch", systemImage: "applewatch") }
          .buttonStyle(RoundTextStyle())
          .disabled(busy)
          .accessibilityHint("The iPhone goes quiet and this watch reads the lesson")
      }
    }
  }

  /// The lesson being read by this Apple Watch: the sentence now being said, big enough to read, with the same controls and a way back to the iPhone.
  private var watchListenPanel: some View {
    Panel {
      VStack(alignment: .leading, spacing: 6) {
        Label("On Apple Watch", systemImage: "applewatch").font(.footnote).foregroundStyle(dimmed ? Color.secondary : talinoVioletText)
        if let lesson = speaker.lesson {
          Text(lesson.title.isEmpty ? "Your lesson" : lesson.title).font(.headline).lineLimit(2)
          if !lesson.course.isEmpty { Text(lesson.course).font(.caption2).foregroundStyle(.secondary).lineLimit(1) }
        }
        if let sentence = speaker.sentence { sentenceText(sentence, index: speaker.index + 1, count: speaker.count) }
        HStack(spacing: 6) {
          Button { speaker.skip(-1) } label: { Image(systemName: "backward.fill") }
            .buttonStyle(RoundControlStyle())
            .accessibilityLabel("Back a sentence")
          Button { speaker.isSpeaking ? speaker.pause() : speaker.resume() } label: { Image(systemName: speaker.isSpeaking ? "pause.fill" : "play.fill") }
            .buttonStyle(PrimaryButtonStyle())
            .accessibilityLabel(speaker.isSpeaking ? "Pause" : "Play")
          Button { speaker.skip(1) } label: { Image(systemName: "forward.fill") }
            .buttonStyle(RoundControlStyle())
            .accessibilityLabel("Forward a sentence")
        }
        Button { moveToPhone() } label: { Label("Play on iPhone", systemImage: "iphone") }
          .buttonStyle(RoundTextStyle())
          .disabled(busy)
          .accessibilityHint("This watch goes quiet and the iPhone carries on from here")
        Button(role: .destructive) { speaker.stop() } label: { Label("Stop", systemImage: "stop.fill") }
          .buttonStyle(RoundTextStyle())
      }
    }
  }

  /// The sentence being said, in the body size, with its place in the lesson.
  private func sentenceText(_ sentence: String, index: Int, count: Int) -> some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(sentence).font(.body).fixedSize(horizontal: false, vertical: true)
      if index > 0 && count > 0 { Text("\(index) of \(count)").font(.caption2).foregroundStyle(.secondary).monospacedDigit() }
    }
    .accessibilityElement(children: .combine)
  }

  // MARK: Where the voice plays

  /// Starts the lesson Home leads with on the iPhone.
  private func startOnPhone() {
    run("listen.start") { _ in }
  }

  /// Starts the lesson Home leads with on this watch: the phone sends the lesson (and is not reading anything).
  private func startOnWatch() {
    run("listen.toWatch") { result in
      if let lesson = result.lesson { speaker.start(lesson) } else { notice = Self.message(for: "no_lesson") }
    }
  }

  /// The lesson the iPhone is reading goes to this watch, from the sentence it was at: the phone is silenced before the watch speaks.
  private func moveToWatch() {
    run("listen.toWatch") { result in
      if let lesson = result.lesson { speaker.start(lesson) } else { notice = Self.message(for: "no_lesson") }
    }
  }

  /// This watch goes quiet first, then the iPhone is asked to carry on from the same sentence. If the phone can't be reached, the watch keeps reading.
  private func moveToPhone() {
    guard let lesson = speaker.lesson else { return }
    let segment = speaker.phoneSegment
    guard PhoneLink.shared.reachable else {
      notice = Self.message(for: "unreachable")
      return
    }
    speaker.stop()
    run("listen.resume", fields: ["lessonId": lesson.lessonId, "segment": segment]) { _ in }
  }

  /// Sends one Listen command. The phone's answer comes back as a haptic (a click when it worked, a failure buzz when it did not) and,
  /// when it did not, a line of words under the controls. The new state itself arrives in the phone's next snapshot.
  private func send(_ type: String, by: Int? = nil) {
    run(type, fields: by.map { ["by": $0] } ?? [:]) { _ in }
  }

  /// Sends a command; `done` runs on success with the phone's answer (a handover carries a lesson in it).
  private func run(_ type: String, fields: [String: Any] = [:], done: @escaping (CommandResult) -> Void) {
    guard !busy else { return }
    busy = true
    notice = nil
    Task {
      let result = await PhoneLink.shared.send(type, fields: fields)
      await MainActor.run {
        busy = false
        if result.ok {
          WKInterfaceDevice.current().play(.click)
          done(result)
        } else {
          WKInterfaceDevice.current().play(.failure)
          notice = Self.message(for: result.reason)
        }
      }
    }
  }

  static func message(for reason: String?) -> String {
    switch reason {
    case "unreachable": return "Open Talino on your iPhone."
    case "nothing_playing": return "Nothing is playing now."
    case "cannot_skip": return "This voice can't skip yet."
    case "no_lesson": return "No lesson to play yet."
    default: return "Couldn't reach Talino."
    }
  }

  // MARK: Footer

  @ViewBuilder
  private func footer(now: Date) -> some View {
    if let notice {
      Text(notice).font(.footnote).foregroundStyle(.secondary).padding(.horizontal, 4)
    } else if !dimmed && now.timeIntervalSince(snapshot.sentDate) > 3600 {
      // Old news is said to be old: the phone sends when something changes, and a closed phone app can't.
      (Text("Updated ") + Text(snapshot.sentDate, style: .relative) + Text(" ago")).font(.caption2).foregroundStyle(.secondary).padding(.horizontal, 4)
    }
  }
}
