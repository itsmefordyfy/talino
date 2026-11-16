#!/usr/bin/env python3
"""
Paints out the iPadOS window-resize grip (a grey arc in the bottom-right corner that the simulator draws on every iPad capture)
so it doesn't end up inside the store artwork. Only the grip's grey stroke inside a 110 px box at the corner is replaced, filled from the pixels around it
(inpainting), so any background is kept, a dimmed sheet backdrop included. Run on the raw captures, not on the rendered exports:

    python3 assets/store/app-store/source/clean-captures.py            # captures/ipad
    python3 assets/store/app-store/source/clean-captures.py captures/duo

It is safe to run twice. It does nothing to a file whose corner has no grey arc.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
BOX = 110  # only this corner is looked at
GREY = (95, 175)  # the grip's stroke is mid grey; its anti-aliased edge is lighter, so the mask is grown below
GROW = 4
RADIUS = 9


def clean(path: Path) -> int:
    """Inpaints the grip: mask its grey pixels (grown by a few pixels), then fill each from the unmasked pixels around it."""
    image = Image.open(path).convert('RGB')
    width, height = image.size
    pixels = image.load()
    x0, y0 = width - BOX, height - BOX
    core = {
        (x, y)
        for y in range(y0, height)
        for x in range(x0, width)
        if abs(pixels[x, y][0] - pixels[x, y][1]) < 8 and abs(pixels[x, y][1] - pixels[x, y][2]) < 8 and GREY[0] < pixels[x, y][0] < GREY[1]
    }
    if len(core) < 40:  # no grip here (or already cleaned)
        return 0
    mask = {
        (x + dx, y + dy)
        for (x, y) in core
        for dx in range(-GROW, GROW + 1)
        for dy in range(-GROW, GROW + 1)
        if x0 <= x + dx < width and y0 <= y + dy < height
    }
    for _ in range(3):  # a thick stroke fills from the outside in
        filled = {}
        for (x, y) in mask:
            near = [
                pixels[nx, ny]
                for ny in range(max(y0, y - RADIUS), min(height, y + RADIUS + 1))
                for nx in range(max(x0, x - RADIUS), min(width, x + RADIUS + 1))
                if (nx, ny) not in mask
            ]
            if near:
                filled[(x, y)] = tuple(sum(c[i] for c in near) // len(near) for i in range(3))
        for point, colour in filled.items():
            pixels[point] = colour
        mask -= set(filled)
        if not mask:
            break
    image.save(path)
    return len(core)


def main() -> None:
    folder = ROOT / (sys.argv[1] if len(sys.argv) > 1 else 'captures/ipad')
    for path in sorted(folder.glob('*.png')):
        print(f'{path.name}: {clean(path)} grip pixels')


if __name__ == '__main__':
    main()
