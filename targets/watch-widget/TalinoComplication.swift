import SwiftUI
import WidgetKit

/// The slice of the phone's snapshot the complication shows (the Watch app saves the whole JSON; extra keys are ignored).
private struct Slice: Decodable {
  struct Streak: Decodable { let current: Int; let doneToday: Bool }
  struct Week: Decodable { let done: Int; let target: Int }
  struct Next: Decodable { let lesson: String }
  let day: String
  let streak: Streak
  let week: Week
  let next: Next?
}

struct ComplicationEntry: TimelineEntry {
  let date: Date
  /// False until the Watch has been sent anything: the complication then says to open Talino instead of showing a made-up zero.
  let hasData: Bool
  let streak: Int
  let doneToday: Bool
  let weekDone: Int
  let weekTarget: Int
  let nextLesson: String?

  /// A streak still to keep is worth a place in the Smart Stack; once today is done there is nothing to prompt.
  var relevance: TimelineEntryRelevance? {
    hasData && !doneToday ? TimelineEntryRelevance(score: 50, duration: 6 * 60 * 60) : nil
  }
}

struct Provider: TimelineProvider {
  private static let group = "group.com.fordytechsolutions.talino"

  func placeholder(in context: Context) -> ComplicationEntry {
    ComplicationEntry(date: .now, hasData: true, streak: 7, doneToday: false, weekDone: 3, weekTarget: 5, nextLesson: "Your first prompt")
  }

  func getSnapshot(in context: Context, completion: @escaping (ComplicationEntry) -> Void) {
    completion(context.isPreview ? placeholder(in: context) : entry(at: .now))
  }

  /// Now, and the next midnight: that is when "done today" turns back into "not yet" with the Watch app closed. The Watch app also
  /// reloads this whenever the phone sends something new.
  func getTimeline(in context: Context, completion: @escaping (Timeline<ComplicationEntry>) -> Void) {
    let now = Date()
    let midnight = Calendar.current.nextDate(after: now, matching: DateComponents(hour: 0, minute: 0), matchingPolicy: .nextTime) ?? now.addingTimeInterval(6 * 3600)
    completion(Timeline(entries: [entry(at: now), entry(at: midnight)], policy: .after(midnight.addingTimeInterval(3600))))
  }

  private func entry(at date: Date) -> ComplicationEntry {
    guard let json = UserDefaults(suiteName: Provider.group)?.string(forKey: "snapshot"), let slice = try? JSONDecoder().decode(Slice.self, from: Data(json.utf8)) else {
      return ComplicationEntry(date: date, hasData: false, streak: 0, doneToday: false, weekDone: 0, weekTarget: 1, nextLesson: nil)
    }
    // The figures as of the entry's own day (see StreakMath): the phone may have been away past midnight.
    let effective = StreakMath.effective(snapshotDay: slice.day, current: slice.streak.current, doneToday: slice.streak.doneToday, today: StreakMath.iso(date))
    return ComplicationEntry(date: date, hasData: true, streak: effective.current, doneToday: effective.doneToday, weekDone: slice.week.done, weekTarget: max(1, slice.week.target), nextLesson: slice.next?.lesson)
  }
}

struct ComplicationView: View {
  @Environment(\.widgetFamily) private var family
  let entry: ComplicationEntry

  private var streakWords: String { entry.streak == 1 ? "1-day streak" : "\(entry.streak)-day streak" }

  var body: some View {
    switch family {
    case .accessoryCircular:
      // The weekly goal as a ring, the streak inside it: the two figures the learner watches, in one glance.
      Gauge(value: Double(min(entry.weekDone, entry.weekTarget)), in: 0...Double(entry.weekTarget)) {
        Image(systemName: "flame.fill")
      } currentValueLabel: {
        Text(entry.hasData ? "\(entry.streak)" : "–").monospacedDigit()
      }
      .gaugeStyle(.accessoryCircular)
      .widgetAccentable()
      .accessibilityLabel(entry.hasData ? "\(streakWords), \(entry.weekDone) of \(entry.weekTarget) lessons this week" : "Talino")
    case .accessoryRectangular:
      VStack(alignment: .leading, spacing: 2) {
        if entry.hasData {
          Label(streakWords, systemImage: "flame.fill").font(.headline).widgetAccentable().lineLimit(1)
          Gauge(value: Double(min(entry.weekDone, entry.weekTarget)), in: 0...Double(entry.weekTarget)) { EmptyView() }
            .gaugeStyle(.linearCapacity)
          Text(entry.doneToday ? "Done today · \(entry.weekDone) of \(entry.weekTarget) this week" : (entry.nextLesson ?? "\(entry.weekDone) of \(entry.weekTarget) this week")).font(.caption2).lineLimit(1)
        } else {
          Label("Talino", systemImage: "flame.fill").font(.headline).widgetAccentable()
          Text("Open Talino on your iPhone").font(.caption2)
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    case .accessoryCorner:
      Image(systemName: "flame.fill")
        .font(.title3)
        .widgetAccentable()
        .widgetLabel(entry.hasData ? "\(streakWords) · \(entry.weekDone)/\(entry.weekTarget)" : "Talino")
    default:
      // Inline: a single line of text with a symbol.
      if entry.hasData { Label(streakWords, systemImage: "flame.fill") } else { Label("Talino", systemImage: "flame.fill") }
    }
  }
}

@main
struct TalinoComplication: Widget {
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: "TalinoComplication", provider: Provider()) { entry in
      // In the Smart Stack (watchOS 10) the background is shown: a dark violet says whose it is; on a face it is ignored.
      ComplicationView(entry: entry).containerBackground(Color(red: 0x24 / 255, green: 0x1B / 255, blue: 0x52 / 255), for: .widget)
    }
    .configurationDisplayName("Talino")
    .description("Your streak and this week's lessons.")
    .supportedFamilies([.accessoryCircular, .accessoryRectangular, .accessoryCorner, .accessoryInline])
  }
}
