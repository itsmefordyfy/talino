import AVFoundation
import Foundation

/// The voice of a lesson when the learner chose Apple Watch (owner, 2026-11-16): the phone hands over the lesson's sentences (`WatchLesson`)
/// and the Watch speaks them itself, one at a time, with the system voice, while showing the one being said. It is the same idea as the
/// phone's own voice in Listen (a sentence is the unit: pausing carries on from the start of it). Only one device talks: the phone is
/// stopped before the Watch starts (the `listen.toWatch` command), and the Watch stops before the phone is told to carry on (`listen.resume`).
@MainActor
final class WatchSpeaker: NSObject, ObservableObject, AVSpeechSynthesizerDelegate {
  static let shared = WatchSpeaker()

  /// The lesson being read here; nil when the Watch is not the one reading.
  @Published private(set) var lesson: WatchLesson?
  /// The sentence now being said (an index into `lesson.sentences`).
  @Published private(set) var index = 0
  /// True while a sentence is being said; false while paused.
  @Published private(set) var isSpeaking = false
  /// When this lesson was handed over (epoch ms), so an older snapshot from the phone is not mistaken for the phone having started again.
  private(set) var startedAt: Double = 0

  private let synthesizer = AVSpeechSynthesizer()
  private var current: AVSpeechUtterance?

  var isActive: Bool { lesson != nil }
  var sentence: String? { lesson.flatMap { $0.sentences.indices.contains(index) ? $0.sentences[index] : nil } }
  var count: Int { lesson?.sentences.count ?? 0 }

  override init() {
    super.init()
    synthesizer.delegate = self
  }

  /// Starts a lesson from its own start sentence, replacing whatever was being read here.
  func start(_ lesson: WatchLesson) {
    cancelSpeech()
    self.lesson = lesson
    index = min(max(0, lesson.segment), max(0, lesson.sentences.count - 1))
    startedAt = Date().timeIntervalSince1970 * 1000
    activateAudio()
    speakCurrent()
  }

  /// Pauses: the sentence being said is dropped and carries on from its start, like the phone's voice.
  func pause() {
    guard isActive else { return }
    cancelSpeech()
  }

  func resume() {
    guard isActive, !isSpeaking else { return }
    speakCurrent()
  }

  /// The sentence before or after, said at once when it was speaking (and only shown when paused).
  func skip(_ by: Int) {
    guard let lesson else { return }
    let wasSpeaking = isSpeaking
    cancelSpeech()
    index = min(max(0, index + by), lesson.sentences.count - 1)
    if wasSpeaking { speakCurrent() }
  }

  /// Ends the reading here (Stop, handing the voice back, or the lesson's last sentence).
  func stop() {
    cancelSpeech()
    lesson = nil
    index = 0
    deactivateAudio()
  }

  /// Where the phone should carry on when the voice goes back to it: this sentence's place among its segments.
  var phoneSegment: Int {
    guard let lesson, lesson.at.indices.contains(index) else { return 0 }
    return lesson.at[index]
  }

  // MARK: Speaking

  private func speakCurrent() {
    guard let sentence else { return stop() }
    let utterance = AVSpeechUtterance(string: sentence)
    utterance.voice = AVSpeechSynthesisVoice(language: lesson?.language == "fil" ? "fil-PH" : "en-US")
    utterance.rate = AVSpeechUtteranceDefaultSpeechRate
    current = utterance
    isSpeaking = true
    synthesizer.speak(utterance)
  }

  private func cancelSpeech() {
    current = nil
    isSpeaking = false
    if synthesizer.isSpeaking || synthesizer.isPaused { synthesizer.stopSpeaking(at: .immediate) }
  }

  nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
    Task { @MainActor in
      // A cancelled sentence never gets here (it reports `didCancel`), and an old one is ignored: only the sentence still current moves on.
      guard utterance === self.current, let lesson = self.lesson else { return }
      if self.index + 1 < lesson.sentences.count {
        self.index += 1
        self.speakCurrent()
      } else {
        self.stop()
      }
    }
  }

  // MARK: Audio session

  /// Spoken audio that plays on the watch's speaker or its connected Bluetooth headphones, and carries on with the wrist down (the app declares background audio).
  private func activateAudio() {
    let session = AVAudioSession.sharedInstance()
    try? session.setCategory(.playback, mode: .spokenAudio)
    try? session.setActive(true)
  }

  private func deactivateAudio() {
    try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
  }
}
