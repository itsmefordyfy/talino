import SwiftUI

/// Talino's colours on the wrist (src/constants/theme.ts): violet is the one fill, amber belongs to the streak's flame only, mint marks a day done.
let talinoViolet = Color(red: 0x79 / 255, green: 0x57 / 255, blue: 0xF5 / 255)
/// Violet for text on black: the fill violet is 3.3:1 there, this lighter one (the dark theme's `primaryText`) is 7:1.
let talinoVioletText = Color(red: 0x9F / 255, green: 0x8A / 255, blue: 0xFF / 255)
let talinoAmber = Color(red: 0xFB / 255, green: 0xBF / 255, blue: 0x24 / 255)
let talinoMint = Color(red: 0x55 / 255, green: 0xD6 / 255, blue: 0xBE / 255)

/// A full-width solid button. watchOS's bordered buttons with a pastel tint come out dim with unreadable text, so every action draws its own fill (white on violet is 4.7:1).
struct PrimaryButtonStyle: ButtonStyle {
  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.headline)
      .foregroundStyle(.white)
      .frame(maxWidth: .infinity, minHeight: 44)
      .background(talinoViolet.opacity(configuration.isPressed ? 0.7 : 1), in: RoundedRectangle(cornerRadius: 22, style: .continuous))
      .opacity(isEnabled ? 1 : 0.4)
  }
}

/// A round control (back, forward) at the 44 pt minimum touch target.
struct RoundControlStyle: ButtonStyle {
  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.body.weight(.semibold))
      .foregroundStyle(.primary)
      .frame(width: 44, height: 44)
      .background(Color.white.opacity(configuration.isPressed ? 0.28 : 0.16), in: Circle())
      .opacity(isEnabled ? 1 : 0.4)
  }
}

/// A rounded panel on the black screen, the way watchOS lists draw their rows.
struct Panel<Content: View>: View {
  @ViewBuilder let content: Content

  var body: some View {
    content
      .frame(maxWidth: .infinity, alignment: .leading)
      .padding(10)
      .background(Color.white.opacity(0.12), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
  }
}
