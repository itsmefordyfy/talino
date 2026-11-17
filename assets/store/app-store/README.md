# Talino App Store artwork

Rendered from HTML layouts with headless Chrome, one layout per ratio, at each export's exact pixel size, saved as opaque RGB PNG (App Store Connect rejects alpha). Devices are drawn in CSS around real simulator captures: a capture is placed at its own aspect ratio, never redrawn or stretched.

## What goes where in App Store Connect

| Folder | Files | Slot |
|---|---|---|
| `screenshots/1206x2622/` | 10 PNGs | iPhone with Dynamic Island (medium display) |
| `screenshots/1179x2556/` | 10 PNGs | Same group, the other accepted size (upload one size per group) |
| `screenshots/1320x2868/` | 10 PNGs | iPhone with Dynamic Island (large display) |
| `screenshots/ipad-2064x2752/` | 10 PNGs | iPad 13" (upload this or the 2048 x 2732 set) |
| `screenshots/ipad-2048x2732/` | 10 PNGs | iPad 13", the other accepted size |
| `screenshots/duo-inner-2007x2853/` | 10 PNGs | iPhone Duo, inner display (portrait canvas, even when the capture is landscape) |
| `screenshots/apple-watch-series12-416x496/` | 5 PNGs | Apple Watch (the raw Series 12 46mm captures, 416 x 496: the only thing the Apple Watch slot takes) |
| `screenshots/apple-watch-framed-1206x2622/`, `-1179x2556/`, `-1320x2868/` | 5 PNGs each | Marketing images only (Watch captures in a drawn Apple Watch under the headline), for the iPhone-size slots, the site and ads |
| `header/talino-header-21x9-3840x1646.png` | 1 | Product page header, 21:9 (iOS 27+) |
| `header/talino-header-universal-16x9-5244x2950.png` | 1 | 16:9 (PNG only), header and search results |
| `search-results/*-3x2-3840x2560.png`, `*-3x2-1920x1280.png` | 4 + 4 | Search results, 3:2 (pick one message per page) |
| `search-results/*-16x9-5244x2950.png` | 4 | Search results, 16:9 |

The ten screenshots (headline / support line are in `source/layouts/screenshots.html`): `01-journey`, `02-discover`, `03-lesson`, `04-practice`, `05-tali`, `06-career`, `07-resume`, `08-portfolio`, `09-job-boards`, `10-profile`. Search messages: `01-learn-ai`, `02-career-coach`, `03-tali`, `04-resume` (texts in `promo.html`).
The five Watch slides (`source/layouts/screenshots-watch.html?id=<id>`): `01-streak`, `02-weekly-goal`, `03-next-lesson`, `04-listen-playing`, `05-listen-paused`.

## Capture contract

`source/captures/<set>/<id>.png`, `<set>` is `iphone` (1206 x 2622 or 1320 x 2868), `ipad` (13", 2064 x 2752), `duo` (inner display, 2007 x 2853 or 2853 x 2007) or `watch` (Series 12 46mm, 416 x 496, untouched; the simulator clock stays in), `<id>` one of the ten above (the five Watch ids for `watch`). Orientation is read from the image size: a landscape iPad or Duo capture is drawn landscape under the headline in the same portrait canvas. Headers use `iphone/01-journey` and `ipad/02-discover` (a device whose capture is missing is left out); search results use `iphone/01-journey`, `06-career`, `05-tali`, `07-resume`. Any export whose capture is missing is skipped with a message.

## Render

```bash
python3 assets/store/app-store/source/render.py                      # everything
python3 assets/store/app-store/source/render.py iphone ipad duo     # groups: iphone, ipad, duo, watch, header, search
python3 assets/store/app-store/source/render.py --captures DIR --out DIR   # read/write somewhere else (testing)
```

Needs Google Chrome (macOS path in `render.py`) and Pillow. About 1.5 s per image. Each output is checked for exact size and no alpha.

## How it's made

- `source/layouts/` the editable layouts: `screenshots.html?set=iphone|ipad|duo&id=<id>`, `screenshots-watch.html?id=<id>` (the Watch capture in a drawn watch: thin aluminium case, crown, side button, dark band stubs; the case follows the capture's aspect ratio) and `promo.html?id=header-21x9|universal-16x9|search-3x2|search-16x9&message=<id>` (header comment explains the safe areas), sharing `kit.css` / `kit.js`. 1rem is 1% of the canvas width, so one layout serves every size of its ratio.
- `source/art/` the app icon, Tali's poses (cropped to the figure; never drawn larger than their own pixel height, `tali()` in `kit.js` enforces it) and Plus Jakarta Sans, copied from the app's bundled fonts (no network).
- `source/render.py` the renderer.
- Colours: violet `#7957F5`, indigo `#536DFE`, mint `#55D6BE`, amber sparks from the icon.


## Apple Watch: every size App Store Connect accepts (2026-11-16)

Five screens in each folder under `screenshots/` (same ids: `01-streak`, `02-weekly-goal`, `03-next-lesson`, `04-listen-playing`, `05-listen-paused`), opaque RGB PNGs at the exact size:

| Folder | Size | Watch | How it was made |
|---|---|---|---|
| `apple-watch-ultra4-422x514` | 422 x 514 | Ultra 4 / Ultra 3 (49 mm) | captured on the Apple Watch Ultra 4 simulator |
| `apple-watch-ultra2-410x502` | 410 x 502 | Ultra / Ultra 2 (49 mm) | captured on the Apple Watch Ultra 2 simulator |
| `apple-watch-series12-416x496` | 416 x 496 | Series 12 / 11 / 10 (46 mm) | captured on the Apple Watch Series 12 (46mm) simulator |
| `apple-watch-series9-396x484` | 396 x 484 | Series 9 / 8 / 7 (45 mm) | captured on the Apple Watch Series 9 (45mm) simulator |
| `apple-watch-series6-368x448` | 368 x 448 | Series 6 / SE (44 mm) | captured on the Apple Watch SE 3 (44mm) simulator, which has the same 368 x 448 screen |
| `apple-watch-series3-312x390` | 312 x 390 | Series 3 (42 mm) | **resampled** from the 368 x 448 capture: no simulator can run a Series 3 on the installed watchOS 27 runtime |

Raw captures: `source/captures/watch/` (Series 12) and `source/captures/watch-<model>/`. How: build the Watch target (`xcodebuild -project ios/Talino.xcodeproj -target TalinoWatch -sdk watchsimulator -configuration Debug build`), `xcrun simctl install` it, then launch it with `-snapshotb64 <base64 snapshot JSON>` (and `-scrollTo goal|next`); wait about 14 s and `simctl io screenshot`. Only the 416 x 496 set has framed marketing versions (`apple-watch-framed-*`).


## Refresh for the redesigned Home, Discover and tab bar (2026-11-18)

Every iPhone, iPad and iPhone Duo capture was retaken on 2026-11-18 (the app's UI changed on 17/18 November: Home has two tabs, Active Course and Roadmap, with 01-journey now the **Roadmap** tab; the roadmap header card was redesigned and each level is colour coded, Beginner mint, Intermediate blue, Advanced violet, Expert gold; Discover's For you tab only recommends courses related to the learner's interests; the round Tali button sits on the centre of the tab bar; the Settings audio speed control and "Included with Pro" on course details are gone). The previous captures are kept in `source/captures/iphone-2026-11-16`, `ipad-2026-11-16` and `duo-2026-11-16`.

- **Learner:** **Clifford Francisco** (owner's call, 2026-11-18; this replaces "Mika Santos" and the 16 November note that the owner chose to keep Mika). The greeting reads "Good evening, Clifford" because it follows the Mac's real clock (the status bar is 9:41 by `simctl status_bar override`; patching `Date` over Metro's debugger did not change the greeting, so it is left as the app draws it). Résumé "Clifford Francisco: Frontend Developer", clifford@example.com, cliffordfrancisco.dev, github.com/cliffordfrancisco, certificate "Clifford Francisco", portfolio Recime, Budget Buddy and Bicol Eats, a 7-day streak, three courses under way (Introduction to AI for Software Developers 2 of 7, Developer: Get Hired with AI 12 of 20, AI Basics for Tech finished with its certificate), 21 lessons, 8 badges, career demo data.
- **Seed:** this time the app's own Developer switch was used, not a hand-written seed: `seedDemoData` from `src/features/demo/demo-data.ts` (Ford's career/learning sample) was called over Metro's debugger on each simulator, then renamed with SQL `replace()` (Ford to Mika to Clifford; the portfolio rows replaced by the three above; `learning_days` older than 6 days removed so the streak is 7; `learner_profile.interests` = ai, mobile, freelance, `weekly_goal` 7), plus Redux: language `en`, learner name, `devUnlockAll` on, `homeCourse` `developer`, `reminderDays` 1-5. Still not in the repo as a script (it is five lines of JS per simulator; see CLAUDE.md).
- **Devices:** iPhone 18 Pro 1206 x 2622; iPad Pro 13-inch (M5) 2064 x 2752 portrait, run through `clean-captures.py` (resize grip, 439-449 px per image); **iPhone Duo inner display 2853 x 2007 landscape, with the Duo unfolded** (the simulator boots closed; the inner display is the "Display class 0" port of `simctl io <udid> enumerate`, shown black while the Duo is closed; the owner opened it in Device Hub, then `simctl io <udid> screenshot --display=<that port UUID>`).
- **Screens per slide:** 01 Home, Roadmap tab; 02 Discover, For you tab; 03 and 04 lesson `prompt-engineering-dev-07` (Day 7) and its quiz; 05 Tali sheet over Home; 06 Career; 07 résumé `demo-resume-developer`; 08 Portfolio; 09 Job boards; 10 Profile.
- **Also retaken for the website** (not store slides): certificate (`/certificate/starter`), the Developer course page, Settings (coach picker, unused), and Home in dark mode (`simctl ui appearance dark`, Roadmap tab). Web copies are in `fordytech-marketing/public/talino/media` (v3 phones, v2 iPad and Duo).
- **Rendered again:** `render.py iphone ipad duo header search`, so the iPhone sets (1206 x 2622, 1179 x 2556, 1320 x 2868), iPad (2064 x 2752, 2048 x 2732), Duo (2007 x 2853), both headers and all search results use the new captures. The 1320 x 2868 slides are still the 1206 x 2622 captures scaled up (no Pro Max capture). The Apple Watch images were not touched.
- **Known oddities left as the app draws them:** Profile "This week 9 of 7 lessons" (the seed puts nine lessons in the current week), Tali's welcome on a 1206 px phone ends with Free's "2 of 2 free chats left" line, Discover reads "All 65" (the catalog grew from 58 courses since the 16 November captures).
- **Checked:** all 74 renders are exact size and RGB (no alpha). Looked at by eye: the three capture sets, the 1206 x 2622, 2064 x 2752 and Duo slides, both headers, the 3840 x 2560 and 5244 x 2950 search images. Not looked at one by one: 1179 x 2556, 1320 x 2868, 2048 x 2732 and 1920 x 1280 (same layouts).
- **Open point for the owner:** the slide, header and search copy says "58 courses" (`layouts/screenshots.html`, `layouts/promo.html`) but Discover in the captures now reads "All 65". Change the copy or accept it before uploading.
