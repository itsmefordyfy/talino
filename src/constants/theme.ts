/**
 * Talino's design system, "Modern Tech Academy" (the owner's redesign brief, 2026-11-13).
 *
 * Brand: Electric Violet #7957F5 (primary actions, the active tab, important progress), Bright Indigo
 * #536DFE (secondary highlights, learning), Fresh Mint #55D6BE (success, completion, positive progress).
 * Light: #F8FAFC screens, white cards, #111827 text, #64748B secondary text, #EDE9FE soft lavender for
 * selected states, #E5E7EB borders. Dark is its own palette, not an inversion: #111827 screens, #1F2937
 * cards, #F8FAFC text, #9CA3AF secondary text, #9278FF accent, #374151 borders.
 *
 * Type: Plus Jakarta Sans for the whole interface, JetBrains Mono for code only.
 *
 * Contrast (WCAG 2.1, measured): white on violet 4.7:1, `primaryText` on white / soft lavender 5.4:1 / 4.8:1,
 * mint is a fill only (dark ink on it 9.9:1) and its text ink is #0F766E (5.5:1), dark `primaryText` on the
 * dark card 5.0:1. Bright Indigo is a fill for tiles and bars; its text ink is #3F54E8.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** The brand palette; screens use the role tokens below, never these directly. */
export const Palette = {
  violet: '#7957F5',
  indigo: '#536DFE',
  mint: '#55D6BE',
  /** The streak's flame and the XP spark: the one warm color, kept small. */
  amber: '#FBBF24',
  ink: '#111827',
  paper: '#F8FAFC',
  white: '#FFFFFF',
  border: '#E5E7EB',
  lavender: '#EDE9FE',
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    textSecondary: '#64748B',
    textTertiary: '#7A8699',
    background: Palette.paper,
    backgroundElement: Palette.white,
    /** A pressed or selected row, a secondary button, an input's fill. */
    backgroundSelected: '#F1F5F9',
    /** The selected tab's soft capsule (Android's drawn tab bar; iOS draws its own). */
    tabSelected: Palette.lavender,
    border: Palette.border,
    /** Electric Violet: primary buttons, the active tab, key highlights. White ink on it. */
    primary: Palette.violet,
    primaryText: '#6A47EA',
    onPrimary: Palette.white,
    /** Soft Lavender: selected states and quiet highlights. */
    primarySoft: Palette.lavender,
    toggleOn: Palette.violet,
    toggleOff: '#CBD5E1',
    /** Bright Indigo: the second accent (learning, the coach). */
    secondary: Palette.indigo,
    secondaryText: '#3F54E8',
    /** Fresh Mint: success, completion, positive progress. */
    statusOk: '#0F766E',
    statusOkSoft: '#D5F5EF',
    statusWarn: '#92400E',
    statusWarnSoft: '#FEF3C7',
    statusDanger: '#B91C1C',
    statusDangerSoft: '#FEE2E2',
    danger: '#B91C1C',
    success: Palette.mint,
    overlay: 'rgba(17, 24, 39, 0.4)',
    shadowCard: '0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 16px rgba(17, 24, 39, 0.05)',
    shadowRaised: '0 8px 28px rgba(17, 24, 39, 0.12)',
    /** Code blocks and the editor: a quiet slate panel with violet, indigo and mint syntax. */
    codeBackground: '#F1F5F9',
    codeBorder: '#E2E8F0',
    codeText: '#1E293B',
    codeKeyword: '#6A47EA',
    codeString: '#0F766E',
    codeNumber: '#B45309',
    codeComment: '#64748B',
    codeFunction: '#3F54E8',
    codePunctuation: '#475569',
    /** Listen: the sentence being spoken (ink on it measures 10.9:1, and it still stands out on a lavender card) and the bar beside the part it is in. */
    listenHighlight: '#D3C6FD',
    listenAccent: '#6A47EA',
    /** Text already spoken: a step softer than the ink, never under 4.5:1 on the page, a card or the lavender intro. */
    listenRead: '#4B5565',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#9CA3AF',
    textTertiary: '#7C8594',
    background: '#111827',
    backgroundElement: '#1F2937',
    backgroundSelected: '#2A3544',
    tabSelected: '#2B2850',
    border: '#374151',
    // A step darker than the accent, so white ink keeps 4.7:1; the accent itself is `primaryText`.
    primary: Palette.violet,
    primaryText: '#9F8AFF',
    onPrimary: Palette.white,
    primarySoft: '#2B2850',
    toggleOn: Palette.violet,
    toggleOff: '#4B5563',
    secondary: '#6D84FF',
    secondaryText: '#8C9EFF',
    statusOk: '#55D6BE',
    statusOkSoft: '#12332F',
    statusWarn: '#FCD34D',
    statusWarnSoft: '#3A2E10',
    statusDanger: '#FCA5A5',
    statusDangerSoft: '#3D1B1B',
    danger: '#FCA5A5',
    success: Palette.mint,
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadowCard: '0 1px 2px rgba(0, 0, 0, 0.3)',
    shadowRaised: '0 8px 28px rgba(0, 0, 0, 0.5)',
    codeBackground: '#0B1220',
    codeBorder: '#2A3544',
    codeText: '#E2E8F0',
    codeKeyword: '#B39DFF',
    codeString: '#55D6BE',
    codeNumber: '#FBBF24',
    codeComment: '#8B95A7',
    codeFunction: '#8C9EFF',
    codePunctuation: '#9CA3AF',
    listenHighlight: '#4B4090',
    listenAccent: '#9F8AFF',
    listenRead: '#A9B2C1',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ThemeColors = { [K in ThemeColor]: string };

/**
 * Plus Jakarta Sans for the interface and JetBrains Mono for code, on both platforms, bundled by the
 * expo-font plugin in app.json (a file per weight: Plus Jakarta 400-800, JetBrains Mono 400-700). A new
 * weight means adding its file to the plugin and a native rebuild. `rounded` is the same face (the
 * shared components' name for the one used by big numbers).
 */
export const Fonts = {
  sans: 'Plus Jakarta Sans',
  rounded: 'Plus Jakarta Sans',
  mono: 'JetBrains Mono',
} as const;

/**
 * The type scale: one entry per role, the only place sizes and weights live. Titles Bold / ExtraBold,
 * section headings SemiBold, body Regular, labels Medium / SemiBold. Text scales with the phone's text
 * size (Dynamic Type / font scale); `maxScale` caps the roles that would break their layout first.
 */
export const Typography = {
  hero: { fontFamily: Fonts.rounded, fontSize: 32, lineHeight: 40, fontWeight: 800, letterSpacing: -0.5 },
  title: { fontFamily: Fonts.sans, fontSize: 26, lineHeight: 33, fontWeight: 700, letterSpacing: -0.4 },
  section: { fontFamily: Fonts.sans, fontSize: 20, lineHeight: 27, fontWeight: 600, letterSpacing: -0.2 },
  cardTitle: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 22, fontWeight: 600 },
  body: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 23, fontWeight: 400 },
  bodySemiBold: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 23, fontWeight: 600 },
  secondary: { fontFamily: Fonts.sans, fontSize: 13, lineHeight: 19, fontWeight: 400 },
  secondarySemiBold: { fontFamily: Fonts.sans, fontSize: 13, lineHeight: 19, fontWeight: 600 },
  caption: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.1 },
  button: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 20, fontWeight: 600 },
  link: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 22, fontWeight: 600 },
  /** Large statistics (XP, the streak, a course's percent). */
  stat: { fontFamily: Fonts.rounded, fontSize: 32, lineHeight: 40, fontWeight: 800, letterSpacing: -0.4 },
  /** A number inside a card or row. */
  statSmall: { fontFamily: Fonts.rounded, fontSize: 20, lineHeight: 26, fontWeight: 700 },
  /** Code in lessons, the chat and snippets: JetBrains Mono, never used for ordinary text. */
  code: { fontFamily: Fonts.mono, fontSize: 13, lineHeight: 20, fontWeight: 400 },
  /** Inline code inside a sentence. */
  codeInline: { fontFamily: Fonts.mono, fontSize: 13, lineHeight: 22, fontWeight: 500 },
  /** The Talino wordmark. */
  wordmark: { fontFamily: Fonts.rounded, fontSize: 28, lineHeight: 34, fontWeight: 800, letterSpacing: -0.4 },
} as const;

export type TypographyRole = keyof typeof Typography;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Modern but not childish (the 2026-11-13 redesign): cards 18, buttons 14, inputs 12, chips 12, sheets 28. */
export const Radius = {
  small: 10,
  chip: 12,
  input: 12,
  medium: 14,
  button: 14,
  large: 18,
  card: 18,
  sheet: 28,
  pill: 999,
} as const;

/** Minimum touch target (Apple HIG / Material) for every pressable. */
export const MinTouchSize = 44;
/** Primary and secondary buttons' height. */
export const ButtonHeight = 52;
export const ButtonHeightSmall = 36;
/** Text fields' height (one line). */
export const InputHeight = 50;

/** Icon sizes: one step per use, so glyphs stay the same weight everywhere. */
export const IconSize = {
  small: 16,
  medium: 20,
  large: 24,
  /** The icon in a tile's soft circle (quick log, summary cards). */
  tile: 26,
} as const;

/** The round soft tile an activity's icon sits on. */
export const IconTileSize = 44;

/** Space above a sheet's title, so it clears the rounded top corners; shared by every sheet. */
export const SheetTopInset = Spacing.five;

/**
 * Height of the tab bar above the home indicator: iOS's system bar, or Android's floating capsule
 * (app-tabs.android) plus the gap under it.
 */
export const TabBarHeight = Platform.select({ ios: 50, android: 72 }) ?? 0;
/** Tab bar icons, on both platforms (a Material Symbol leaves a margin inside its square). */
export const TabIconSize = 28;
/** Space under Android's floating tab bar, above the gesture bar (iOS's system bar sets its own). */
export const TabBarGap = 10;
/** Android's tab bar, laid out like iOS 26's (Pawfetti's measurements of an iPhone 17 Pro Max). */
export const TabBarSideInset = 21;
export const TabCapsuleInset = 4;
export const TabCapsuleOverhang = 3.75;
export const TabBarInnerInset = TabCapsuleInset + TabCapsuleOverhang;
/** Tali's button in the tab bar's middle slot (Pawfetti's camera button, with Tali's face). */
export const FloatingTaliSize = 64;
/** How far Tali's button reaches down into the tab bar; the rest rises above it. */
export const FloatingTaliDock = 38;
/**
 * Where the vertical middle of an iPad's top tab bar sits, from the top of the screen (measured on the iPad Air, mini and Pro: the
 * status bar is 24 pt and the floating bar is about 46 pt tall, 8 pt below it). Tali's button is centered on it.
 */
export const TopTabBarCenter = 55;
/**
 * Where the middle slot of the iPhone Duo's side tab bar sits (measured on both displays, closed and open, 2026-11-16): its centre is about
 * 47 pt in from the edge the bar is on and 156 pt above the bottom of the window.
 */
export const SideBarCenterInset = 47;
export const SideBarCenterFromBottom = 156;
/** Tali's button on a top or side bar: a little smaller than the phone's 64, so it clears the neighbouring tabs (the bar is about 46 pt tall, its items 48 pt apart). */
export const TopTaliSize = 52;
/** Space tab screens leave at the bottom, so their last content clears the tab bar and Tali's button above it. */
export const BottomTabInset = TabBarHeight + (FloatingTaliSize - FloatingTaliDock) + Spacing.three;
/** How much of the screen a page sheet covers on Android, as the iPhone's page sheet does. */
export const PageSheetDetent = 0.98;
/** The top corners of a sheet on Android, matching the iPhone's iOS 26 sheets. */
export const SheetCornerRadius = Radius.sheet + 8;

/** The widest a short bottom sheet gets: on a wide window it stays centered at this width. */
export const SheetMaxWidth = 640;
export const MaxContentWidth = 720;
/** The width a tab's content may take on a wide window (the iPhone Duo's open screen is 951 pt wide), where 720 left wide margins. */
export const WideContentMaxWidth = 1100;
/**
 * The content width from which the tabs switch to their two-column layouts (the iPhone Duo's open screen, a phone on its
 * side, an iPad). Below it they keep the one-column phone layout, so a phone held upright never changes.
 */
export const TwoUpMinWidth = 640;
/**
 * The window width from which a screen with a list beside its content (a lesson and its course outline) shows both
 * side by side: an iPad in landscape or a large portrait window. Narrower it keeps the one-column phone layout, so an iPad
 * Mini or Air held upright reads as comfortably as before instead of squeezing two panes.
 */
export const SplitMinWidth = 900;
/**
 * The window width from which Discover puts its filters in a column beside the results. The column plus two columns of cards needs
 * more than a list beside a lesson does: at 951 pt (the open iPhone Duo) every card title was cut, so the iPad Air / Pro in
 * portrait and landscape get it and the Duo and an iPad mini keep the Filters sheet with two columns of cards.
 */
export const SideFiltersMinWidth = 1000;
/** The width of the list column beside a lesson (the course outline). */
export const SidePaneWidth = 300;
/** The side inset from which the system's bars are taken to run along that edge (iPhone Duo). */
export const VerticalChromeMinInset = 56;

/**
 * The accents, each with a fill (`solid`, the brief's color), a soft tile (`soft`) and an ink for
 * text and icons on either (`ink`, 4.5:1 or more on `soft`, cards and the background). The palette is
 * deliberately small: violet, indigo and mint are the brand, amber is only the streak's flame, red is
 * for problems and neutral is for the rest. The older names (peach, sage, rose, lime, plum, lavender,
 * teal, sky) are kept so no screen breaks, and now point at that small set.
 */
const ToneSets = {
  light: {
    violet: { ink: '#6A47EA', soft: '#EDE9FE', solid: '#7957F5' },
    indigo: { ink: '#3F54E8', soft: '#E4E8FF', solid: '#536DFE' },
    mint: { ink: '#0F766E', soft: '#D5F5EF', solid: '#55D6BE' },
    amber: { ink: '#92400E', soft: '#FEF3C7', solid: '#FBBF24' },
    red: { ink: '#B91C1C', soft: '#FEE2E2', solid: '#F4A9A2' },
    neutral: { ink: '#475569', soft: '#F1F5F9', solid: '#CBD5E1' },
  },
  dark: {
    violet: { ink: '#B39DFF', soft: '#2B2850', solid: '#7957F5' },
    indigo: { ink: '#8C9EFF', soft: '#1E2750', solid: '#536DFE' },
    mint: { ink: '#55D6BE', soft: '#12332F', solid: '#55D6BE' },
    amber: { ink: '#F2C266', soft: '#3A2E14', solid: '#C9993B' },
    red: { ink: '#FF8A80', soft: '#3D1D1B', solid: '#C4544B' },
    neutral: { ink: '#CBD5E1', soft: '#243040', solid: '#4B5563' },
  },
} as const;

type ToneColors = { readonly ink: string; readonly soft: string; readonly solid: string };
type ToneSet = Record<keyof (typeof ToneSets)['light'], ToneColors>;

const withAliases = (set: ToneSet) => ({
  ...set,
  lavender: set.violet,
  plum: set.violet,
  rose: set.violet,
  sky: set.indigo,
  teal: set.mint,
  sage: set.mint,
  lime: set.mint,
  peach: set.neutral,
});

export const Tones = { light: withAliases(ToneSets.light), dark: withAliases(ToneSets.dark) } as const;

export type Tone = keyof typeof Tones.light;

/**
 * Each area's accent, used for its icon tile, chips and indicators. Learning is indigo, the coach and
 * quizzes violet, finished things mint; the streak is the only amber.
 */
export const FeatureTones = {
  lesson: 'indigo',
  quiz: 'violet',
  project: 'mint',
  badge: 'violet',
  streak: 'amber',
  certificate: 'violet',
  coach: 'violet',
  career: 'indigo',
  income: 'mint',
  resume: 'indigo',
  portfolio: 'violet',
  note: 'neutral',
} as const satisfies Record<string, Tone>;

export type Feature = keyof typeof FeatureTones;

/**
 * The colors of the career kit's drawn document previews. A document keeps its own look in light and dark mode (like a printed page),
 * so these are fixed, like the logo and the covers: paper, its text lines, and the accents the template styles use.
 */
export const KitSwatches = {
  paper: '#FFFFFF',
  line: '#D8DCE6',
  navy: '#1E2A5A',
  forest: '#1F4D3A',
  ink: '#1F2430',
  gold: '#F4C542',
  violet: '#6A47EA',
  slate: '#64748B',
} as const;
export type KitSwatch = Exclude<keyof typeof KitSwatches, 'paper' | 'line'>;

/**
 * The certificate's colors (owner's request 2026-11-15: a classic certificate of completion). Like a printed page it keeps
 * its own look in light and dark mode, and the app card, the PDF and the drawn seal and corners all use these, so they match.
 * Ink on paper 16:1, inkSoft 7:1, violet 5.6:1, so every line reads as body text.
 */
export const CertificateSwatches = {
  paper: '#FFFFFF',
  ink: '#111827',
  inkSoft: '#4B5563',
  violet: '#6A47EA',
  violetLight: '#7957F5',
  indigo: '#536DFE',
  deep: '#2E2384',
  amber: '#F5B71F',
  rule: '#D9D3F5',
} as const;

/**
 * The AI Expert certificate (the whole journey, Talino's highest): a night-indigo document with gold, so it never looks like a
 * course certificate. Fixed in light and dark mode, like the paper certificate.
 */
export const MasteryCertificateSwatches = {
  night: '#1B1550',
  nightDeep: '#0D0A2E',
  violet: '#7957F5',
  indigo: '#536DFE',
  gold: '#E9B949',
  goldLight: '#F8DC8E',
  goldDeep: '#A97A1F',
  ivory: '#FFF8E8',
  ivorySoft: '#CFC7EA',
} as const;

/** The one gradient (a hero card, the certificate's frame): violet into indigo, fixed in light and dark like the logo. */
export const BrandGradient = ['#7957F5', '#536DFE'] as const;
/** The streak's flame and the XP spark. */
export const Spark = Palette.amber;

/**
 * A course's cover art (the owner's request 2026-11-14: "a cover photo representing the course"): a
 * gradient from this small set, fixed in light and dark like the logo, so every cover stays inside
 * the brand. The second stop is the deep one: white text sits on it at 5:1 or more.
 */
export const CoverPalettes = {
  violet: ['#9A7DFF', '#6A47EA'],
  indigo: ['#7A8FFF', '#3F54E8'],
  mint: ['#3CC9AE', '#0F766E'],
  dusk: ['#7957F5', '#3F54E8'],
  ocean: ['#536DFE', '#127A6E'],
  night: ['#4B3BB8', '#1E2A6B'],
} as const;

export type CoverPalette = keyof typeof CoverPalettes;

/** The colors the cover scenes are drawn with: white glass and paper, a dark code screen, and small brand accents. */
export const CoverInk = {
  paper: '#FFFFFF',
  paperLine: '#DCD6FB',
  paperLineSoft: '#ECE9FD',
  glass: 'rgba(255, 255, 255, 0.2)',
  glassStrong: 'rgba(255, 255, 255, 0.34)',
  line: 'rgba(255, 255, 255, 0.6)',
  dot: 'rgba(255, 255, 255, 0.16)',
  glow: 'rgba(255, 255, 255, 0.14)',
  screen: '#1B1640',
  screenBar: '#2A2360',
  screenLine: 'rgba(255, 255, 255, 0.28)',
  violet: Palette.violet,
  indigo: Palette.indigo,
  lilac: '#B39DFF',
  sky: '#8C9EFF',
  mint: Palette.mint,
  mintDeep: '#0F9F8A',
  amber: Palette.amber,
  coral: '#FF8A80',
} as const;

/** The backdrop of screens that show a photo on its own (the crop screen): black in both themes, like a camera. */
export const PhotoBackdrop = '#000000';

/** Fixed ink for text on the brand gradient or a photo. */
export const HeroInk = {
  text: '#FFFFFF',
  muted: 'rgba(255, 255, 255, 0.82)',
  glassBorder: 'rgba(255, 255, 255, 0.28)',
  glass: 'rgba(255, 255, 255, 0.18)',
  chip: 'rgba(17, 24, 39, 0.55)',
  onLight: '#111827',
} as const;

/** Motion: short and quiet (a press, a progress bar filling). Always skipped with Reduce Motion. */
export const Motion = {
  press: 110,
  quick: 180,
  progress: 650,
} as const;

/** A QR code needs dark modules on light paper to scan, in light and dark mode alike. */
export const QrPaper = '#FFFFFF';
