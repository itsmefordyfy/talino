# iPad support (2026-11-16)

Owner's brief: Talino as a universal app. iPhone stays a compact learning companion; iPad becomes a spacious study and
career workspace, not a stretched phone layout. Decisions below were made without a Q&A round because the owner asked for
independent decisions; each is recorded so it can be reversed.

## Configuration

- `ios.supportsTablet: true`, `ios.requireFullScreen: false` (Split View, Slide Over, Stage Manager resizing).
- `orientation` stays `portrait` (iPhone and Android keep portrait; a lesson on a phone on its side was never designed).
  `UISupportedInterfaceOrientations~ipad` lists all four, so an iPad rotates freely.
- `TARGETED_DEVICE_FAMILY` becomes `1,2` (checked in the regenerated project). Needs a prebuild and a native rebuild.

## Rules (read from the window, never from a device name)

- `useViewport()` is the window size (it follows Split View / Stage Manager), `IS_IPAD` is `Platform.isPad`.
- `useTwoUp()` (content width >= 640) decides two columns on a tab. `useSplitView()` (window width >= 900) decides a list
  beside its content (a lesson and its course outline). Below those a layout is exactly the phone's.
- `Screen` takes `wide` to allow `WideContentMaxWidth` (1100) instead of 720.
- Mobile cards are never stretched across the window: text columns stay near 720 pt, grids add columns.

## Navigation

- The system tab bar floats across the top of an iPad (iPadOS 18+). Its tabs are the iPhone's: the same five icons, no names
  (owner, 2026-11-16: "make the tabs same as in the iphone"). No `sidebarAdaptable`: a sidebar is unreadable without names.
- Tali's round button (the iPhone's center tab, owner 2026-11-16) is centered on the iPad's top bar over the middle slot, which
  keeps its width with a transparent icon. The iPhone Duo's side bar gets the same button over its middle slot (owner, 2026-11-16).
- Tab screens add no room at the bottom for a bar that is not at the bottom (`useTabBarOnTop`).

## Screens

- **Lesson:** course outline (300 pt) beside the lesson when the window is wide. A tap on another lesson replaces this
  one. Quiz, practice and result stages sit in the same pane.
- **Home (journey):** see the implementation notes in `CLAUDE.md` (current state).
- Career, Me, Settings: two columns when wide. Discover and the résumé editor already adapted (Duo work).

## Productivity features: what is in, what is not

- **Scribble (Apple Pencil handwriting into text fields):** UIKit gives it to every `TextInput` and Talino disables it nowhere.
  No annotation or drawing feature exists in the app, and none is added just for iPad.
- **Hardware keyboard:** React Native 0.88 declares `onKeyDown` on views but the iOS renderer does not implement it, so
  shortcuts need `UIKeyCommand` in a local Expo module. See "Keyboard shortcuts" in `CLAUDE.md` for whether that was done.
  Typing, Tab between fields and Return in single-line fields work through the system as on any app.
- **Pointer and trackpad:** work through the system's default behaviour; no custom hover effects.
- **Drag and drop:** no workflow here needs it (résumé import uses the file picker; the sortable list is touch-first), so none
  is added.

## Out of scope

Android tablets. Filipino text (English only, owner's standing rule).

## Tests

Pure logic is tested with Jest (`use-split-view` thresholds, outline states). Layouts are verified on the iPhone 18 Pro, iPad
mini (A17 Pro), iPad Air 11/13 and iPad Pro 11/13 simulators, portrait and landscape, with the results listed in `CLAUDE.md`.
