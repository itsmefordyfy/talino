#!/usr/bin/env python3
"""
Renders the Talino App Store artwork from the HTML layouts with headless Chrome, at each export's
exact pixel size, then saves an opaque RGB PNG (App Store Connect rejects alpha channels) and
checks its size and mode. Run from anywhere:

    python3 assets/store/app-store/source/render.py                 # everything
    python3 assets/store/app-store/source/render.py iphone ipad     # groups: iphone, ipad, duo, watch, header, search
    python3 assets/store/app-store/source/render.py --captures DIR --out DIR   # test elsewhere

Captures are read from <captures>/<set>/<id>.png, set = iphone | ipad | duo | watch (see ../README.md).
An export whose capture is missing is skipped with a message. Needs Google Chrome (macOS path
below) and Pillow. Fonts and art are bundled in source/art: no network.
"""
import argparse
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import quote

from PIL import Image

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
SOURCE = Path(__file__).resolve().parent
ROOT = SOURCE.parent
LAYOUTS = SOURCE / 'layouts'

SCREENSHOT_IDS = [
    '01-journey', '02-discover', '03-lesson', '04-practice', '05-tali',
    '06-career', '07-resume', '08-portfolio', '09-job-boards', '10-profile',
]
# set -> [(export folder, size)]. iPhone with Dynamic Island: 1206 x 2622 and 1179 x 2556 are the two
# accepted sizes of the medium display group (upload one), 1320 x 2868 the large display. iPad 13":
# 2064 x 2752 and 2048 x 2732. iPhone Duo inner display: 2007 x 2853 (portrait canvas, even for a
# landscape capture).
SCREENSHOT_SETS = {
    'iphone': [(f'{w}x{h}', (w, h)) for w, h in [(1206, 2622), (1179, 2556), (1320, 2868)]],
    'ipad': [(f'ipad-{w}x{h}', (w, h)) for w, h in [(2064, 2752), (2048, 2732)]],
    'duo': [('duo-inner-2007x2853', (2007, 2853))],
}

# The Apple Watch app (captures/watch, 416 x 496) inside a drawn Apple Watch, headline layout like the
# iPhone shots: marketing images at the iPhone sizes (the Apple Watch slot itself takes the raw captures).
WATCH_IDS = ['01-streak', '02-weekly-goal', '03-next-lesson', '04-listen-playing', '05-listen-paused']
WATCH_SIZES = [(f'apple-watch-framed-{w}x{h}', (w, h)) for w, h in [(1206, 2622), (1179, 2556), (1320, 2868)]]

HEADERS = [
    ('header-21x9', 'talino-header-21x9', (3840, 1646)),
    ('universal-16x9', 'talino-header-universal-16x9', (5244, 2950)),
]
# message id -> the iPhone capture it shows
SEARCH_MESSAGES = {
    '01-learn-ai': '01-journey',
    '02-career-coach': '06-career',
    '03-tali': '05-tali',
    '04-resume': '07-resume',
}
SEARCH_SIZES = [('3x2', (3840, 2560)), ('3x2', (1920, 1280)), ('16x9', (5244, 2950))]

GROUPS = ['iphone', 'ipad', 'duo', 'watch', 'header', 'search']


def render(page: str, query: str, size: tuple[int, int], out: Path, out_root: Path, captures: Path) -> bool:
    width, height = size
    with tempfile.TemporaryDirectory() as profile:
        shot = Path(profile) / 'shot.png'
        url = f'{(LAYOUTS / page).as_uri()}?{query}&cap={quote(captures.as_uri(), safe="")}'
        subprocess.run(
            [
                CHROME,
                '--headless=new',
                '--disable-gpu',
                '--hide-scrollbars',
                '--no-first-run',
                f'--user-data-dir={profile}',
                f'--window-size={width},{height}',
                '--force-device-scale-factor=1',
                '--virtual-time-budget=20000',
                f'--screenshot={shot}',
                url,
            ],
            # Chrome's shutdown watchdog can fail with exit code 2 after the screenshot is written.
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        if not shot.exists() or shot.stat().st_size == 0:
            raise SystemExit(f'{out.name}: Chrome wrote no screenshot')
        image = Image.open(shot)
        if image.size != size:
            raise SystemExit(f'{out.name}: rendered {image.size}, expected {size}')
        out.parent.mkdir(parents=True, exist_ok=True)
        # Opaque RGB: App Store Connect refuses images with an alpha channel.
        image.convert('RGB').save(out, optimize=True)
    check = Image.open(out)
    if check.size != size or check.mode != 'RGB' or 'transparency' in check.info:
        raise SystemExit(f'{out.name}: expected opaque RGB {size}, got {check.mode} {check.size}')
    print(f'{out.relative_to(out_root) if out.is_relative_to(out_root) else out}  {width} x {height}  RGB ok')
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description='Render the Talino App Store artwork.')
    parser.add_argument('groups', nargs='*', choices=GROUPS, help='iphone ipad duo watch header search (default: all)')
    parser.add_argument('--captures', type=Path, default=SOURCE / 'captures', help='folder with iphone/, ipad/, duo/, watch/ captures')
    parser.add_argument('--out', type=Path, default=ROOT, help='folder to write screenshots/, header/, search-results/ into')
    parser.add_argument('--only', nargs='*', default=None, help='render only these screenshot ids, e.g. --only 06-career (screenshot groups only)')
    args = parser.parse_args()
    if not Path(CHROME).exists():
        raise SystemExit('Google Chrome is needed at ' + CHROME)
    groups = set(args.groups) or set(GROUPS)
    captures = args.captures.resolve()
    out_root = args.out.resolve()
    done = skipped = 0

    def have(card_set: str, shot_id: str) -> bool:
        return (captures / card_set / f'{shot_id}.png').exists()

    for card_set, exports in SCREENSHOT_SETS.items():
        if card_set not in groups:
            continue
        for folder, size in exports:
            for shot_id in SCREENSHOT_IDS:
                if args.only and shot_id not in args.only:
                    continue
                if not have(card_set, shot_id):
                    print(f'skipped {folder}/{shot_id}.png: no capture {card_set}/{shot_id}.png')
                    skipped += 1
                    continue
                done += render('screenshots.html', f'set={card_set}&id={shot_id}', size, out_root / 'screenshots' / folder / f'{shot_id}.png', out_root, captures)
    if 'watch' in groups:
        for folder, size in WATCH_SIZES:
            for shot_id in WATCH_IDS:
                if args.only and shot_id not in args.only:
                    continue
                if not have('watch', shot_id):
                    print(f'skipped {folder}/{shot_id}.png: no capture watch/{shot_id}.png')
                    skipped += 1
                    continue
                done += render('screenshots-watch.html', f'id={shot_id}', size, out_root / 'screenshots' / folder / f'{shot_id}.png', out_root, captures)
    if 'header' in groups:
        for layout, name, size in HEADERS:
            # The devices are optional in a header (a missing capture is simply left out).
            render('promo.html', f'id={layout}', size, out_root / 'header' / f'{name}-{size[0]}x{size[1]}.png', out_root, captures)
            done += 1
    if 'search' in groups:
        for message, shot_id in SEARCH_MESSAGES.items():
            for ratio, size in SEARCH_SIZES:
                name = f'{message}-{ratio}-{size[0]}x{size[1]}.png'
                if not have('iphone', shot_id):
                    print(f'skipped search-results/{name}: no capture iphone/{shot_id}.png')
                    skipped += 1
                    continue
                done += render('promo.html', f'id=search-{ratio}&message={message}', size, out_root / 'search-results' / name, out_root, captures)
    print(f'{done} rendered, {skipped} skipped')


if __name__ == '__main__':
    sys.exit(main())
