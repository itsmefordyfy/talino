"""Cut Tali's poses out of the owner's character sheet.

The sheet (2026-11-14) is an opaque image: its "transparent" checkerboard is painted in, and each pose has
its name on a lavender label under it. So the background is found, not read:
  1. background = the bright, colourless pixels connected to the sheet's border (the art's dark outlines
     and the labels stop the fill, so a white mug or an eye stays), plus checkerboard trapped inside a loop of the art;
  2. each pose is cut off just above its row of labels (found from the labels' lavender colour);
  3. marks without an outline (sparks, ?, zzz, a flame) go with the pose they sit nearest;
  4. the edge, where the art was blended into the checkerboard, gets the art's own colour and an alpha equal to its share of
     art, so no pale fringe shows on a dark screen (2026-11-15: the old one-pixel un-mix left a dotted halo);
  5. each pose is enlarged 3x (Lanczos for colour, a smooth redrawn contour for the edge), since the sheet gives a pose only
     ~270 px and the app draws one up to 720 px; saved as lossless WebP.

usage: python tali-poses.py <sheet.png> <out-dir> [<report.json>]   (needs pillow, numpy, scipy)
"""
import json, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

SHEET, OUT = sys.argv[1], sys.argv[2]
REPORT = sys.argv[3] if len(sys.argv) > 3 else None

# Row by row, left to right, as the labels read on the sheet.
ROWS = [
    ['happy', 'excited', 'curious', 'thinking', 'surprised'],
    ['confident', 'focused', 'coding', 'learning', 'explaining'],
    ['teaching', 'celebrating', 'encouraging', 'supportive', 'determined'],
    ['tired', 'confused', 'proud', 'inspired', 'accomplished'],
]
BRIGHT, GREY = 236, 9      # background: every channel at least BRIGHT, channels within GREY of each other
BUST_MIN = 9000            # pixels; anything smaller is a mark
PAD = 12                   # transparent margin around every pose
LABEL_GAP = 2              # rows left out above a label (its soft glow)
EIGHT = np.ones((3, 3), bool)
EDGE_GAP = 12              # pixels: a trapped gap this close to the outside background is a gap in the hair, not part of the art
                           # (12 since 2026-11-15: the crescents between Tala's lower curls sit 9-10 px in; 16 finds nothing more)

rgb = np.array(Image.open(SHEET).convert('RGB')).astype(np.int32)
H, W, _ = rgb.shape
hi, lo = rgb.max(axis=2), rgb.min(axis=2)

# 2. Labels: lavender (blue clearly above red, still light). A label row is one with a long run of it.
lavender = (rgb[..., 2] >= 245) & (rgb[..., 2] - rgb[..., 0] >= 8) & (rgb[..., 0] >= 200) & (rgb[..., 1] >= 195)
ll, ln = ndi.label(ndi.binary_opening(lavender, structure=np.ones((5, 25), bool)), structure=EIGHT)
# Long names split a label in two around the text, so find the four label ROWS: wide lavender pieces, grouped by height on the sheet.
pieces = sorted((sl[0].start, sl[0].stop) for sl in ndi.find_objects(ll) if sl[1].stop - sl[1].start >= 80)
bands = []
for y0, y1 in pieces:
    if bands and y0 <= bands[-1][1] + 4:
        bands[-1][1] = max(bands[-1][1], y1)
    else:
        bands.append([y0, y1])
assert len(bands) == len(ROWS), f'found {len(bands)} label rows'

# 1. Background: bright neutral pixels reachable from the border. Each label's box is a wall, because things standing on a
#    label (the white mug) have no outline along their bottom edge and the fill would pour in from below.
candidate = (lo >= BRIGHT) & (hi - lo <= GREY)
walls = np.zeros((H, W), bool)
wide = [sl for sl in ndi.find_objects(ll) if sl[1].stop - sl[1].start >= 80]
for y0, y1 in bands:
    for c in range(5):
        # A long name splits its label into pieces: the wall is the box around all of this cell's pieces, for the whole label row.
        mine = [sl for sl in wide if y0 <= sl[0].start < y1 and c * W // 5 <= (sl[1].start + sl[1].stop) // 2 < (c + 1) * W // 5]
        walls[max(y0 - 3, 0):y1, max(min(sl[1].start for sl in mine) - 8, 0):max(sl[1].stop for sl in mine) + 8] = True
cl, cn = ndi.label(candidate & ~walls, structure=EIGHT)
border = np.unique(np.concatenate([cl[0], cl[-1], cl[:, 0], cl[:, -1]]))
background = np.isin(cl, border[border > 0])
# How far each pixel is from the outside background: slivers of checkerboard left between two locks of hair sit right next to it.
near_outside = ndi.distance_transform_edt(~background) <= EDGE_GAP
# Background trapped inside a loop of the art (between a raised arm and the head) is still checkerboard: perfectly grey, in
# two flat tones. Real white parts (mug, pages, board, speech bubble) carry a little tint or shading.
spread = hi - lo
for i, sl in enumerate(ndi.find_objects(cl), 1):
    if i in border:
        continue
    inside = cl[sl] == i
    if inside.sum() >= 150 and (spread[sl][inside] >= 3).mean() < 0.10 and (lo[sl][inside] <= 249).mean() >= 0.45:
        background[sl] |= inside
    # A small gap between two strands of hair (the female sheet's long wavy hair has several) is the same checkerboard, only too
    # small and too mixed with the strands' soft edges for the test above. It is told from a real white (an eye, a tooth, the mug)
    # by the checkerboard's two light-grey tones (never the 253-255 of true white) and by lying against the outside background.
    elif 12 <= inside.sum() < 200 and (lo[sl][inside] <= 249).mean() >= 0.40 and lo[sl][inside].mean() <= 250 and near_outside[sl][inside].any() and min(inside.shape) <= 40:
        # ...and only when what surrounds it is hair and its dark outline all the way round (purple or navy: blue clearly above
        # green), so the laptop's bezel, a book's pages and a lens's glare, which touch skin, grey or lavender, are never taken.
        pad = (slice(max(sl[0].start - 4, 0), sl[0].stop + 4), slice(max(sl[1].start - 4, 0), sl[1].stop + 4))
        whole = cl[pad] == i
        ring = ndi.binary_dilation(whole, structure=EIGHT, iterations=3) & ~whole & ~background[pad]
        px = rgb[pad][ring]
        # The outline is near black (0,0,5), too dark to show blue above green, so it is counted by darkness (2026-11-15: without
        # this a crescent ringed by hair and outline scored 66% and stayed white).
        hair = ((px.max(axis=1) < 200) & (px[:, 2] - px[:, 1] >= 20)) | (px.max(axis=1) < 70)
        if hair.size and hair.mean() >= 0.85:
            background[sl] |= inside

# 1b. Checkerboard showing through a gap in the outline (owner, 2026-11-15: "remove the whites on the background"): the strip
#     between Tala's outermost lock and her hair, the hole inside the trophy's handle. Each is a pale, colourless patch held off
#     the outside only by a thin outline, so the fill above never reaches it. Taken as background when: mostly (60%) the
#     checkerboard's neutral tones and light, at least a third of its border within 5 px of the outside, small (a speech bubble is ~2,500 px, these at most
#     ~200), not bordered by the board's bright violet (the code board's inner border line is drawn white), and not standing on a
#     label's cut line (slivers by the pot and the book).
#     ...except the glass of the right lens (owner, 2026-11-15, Focused: "the eyeglass is cutoff"). Where that lens reaches past
#     the face the sheet draws see-through glass, i.e. the same checkerboard, so this step took it: half the lens went, and in
#     Focused (119 px, so a "strip") the frame went with it. A patch is glass when it sits inside a near-complete ring of the
#     glasses' near-black frame (radius 11-17 px) AND another such ring sits one lens to its left (the other lens, always whole
#     on the face): a lock of hair can curl into a ring, never into a pair. Measured on both sheets as the weaker of the two
#     rings: every lens 0.68-1.00, and each one under 0.9 lies within 5 px of skin; hair strips at most 0.67 (by Tala's book,
#     8 px from skin) and 0.51-0.55 beside a hand; the trophy's handle 0.44. The glass is then kept as the sheet draws it.
FRAME = ndi.maximum_filter((hi < 70).astype(float), 3)    # the frame and outlines (hair shading is lighter), with a pixel of slack
LENS_R = list(range(11, 18))
def ring_kernel(r):
    yy, xx = np.mgrid[-r - 1:r + 2, -r - 1:r + 2]
    k = (np.abs(np.sqrt(yy ** 2 + xx ** 2) - r) <= 0.5).astype(float)
    return k / k.sum()
rings = np.stack([ndi.convolve(FRAME, ring_kernel(r), mode='constant') for r in LENS_R])   # share of each circle that is frame
any_ring = rings.max(axis=0)
skin = (rgb[..., 0] >= 200) & (rgb[..., 0] - rgb[..., 2] >= 35) & (rgb[..., 1] >= 140) & (rgb[..., 1] <= 225) & (rgb[..., 2] >= 100) & ~background
to_skin = ndi.distance_transform_edt(~ndi.binary_opening(skin, structure=np.ones((3, 3), bool)))
def lens_glass(sl, inside):
    y, x = (sl[0].start + sl[0].stop) // 2, (sl[1].start + sl[1].stop) // 2
    best, cx, cy, cr = 0.0, 0, 0, 0
    for k, r in enumerate(LENS_R):                         # the ring around it: its centre well inside the circle
        yy, xx = np.mgrid[max(y - r, 0):min(y + r + 1, H), max(x - r, 0):min(x + r + 1, W)]
        ok = (yy - y) ** 2 + (xx - x) ** 2 <= (r - 3) ** 2
        j = rings[k][yy[ok], xx[ok]].argmax()
        if rings[k][yy[ok], xx[ok]][j] > best:
            best, cx, cy, cr = float(rings[k][yy[ok], xx[ok]][j]), int(xx[ok][j]), int(yy[ok][j]), r
    if best == 0 or cx - 33 <= 0:
        return None
    other = float(any_ring[max(cy - 10, 0):cy + 11, max(cx - 52, 0):cx - 33].max())   # the other lens, 34-52 px to the left
    pair = min(best, other)
    return (cx, cy, cr) if pair >= 0.9 or (pair >= 0.6 and to_skin[sl][inside].min() <= 5) else None
near_out = ndi.distance_transform_edt(~background) <= 5
cuts = [y0 - LABEL_GAP for y0, _ in bands]
strips = np.zeros((H, W), bool)
glass, kept_glass = np.zeros((H, W), bool), []
pale_l, _ = ndi.label((lo >= 200) & (hi - lo <= 30) & ~background, structure=EIGHT)
for i, sl in enumerate(ndi.find_objects(pale_l), 1):
    inside = pale_l[sl] == i
    area = int(inside.sum())
    if not 15 <= area <= 400 or any(0 <= cut - sl[0].stop <= 12 for cut in cuts):
        continue
    px = rgb[sl][inside]
    if (px.max(axis=1) - px.min(axis=1) <= 6).mean() < 0.6 or px.min(axis=1).mean() < 232:
        continue
    pad = tuple(slice(max(s.start - 3, 0), s.stop + 3) for s in sl)
    whole = pale_l[pad] == i
    ring = ndi.binary_dilation(whole, structure=EIGHT, iterations=2) & ~whole
    edge = rgb[pad][ring]
    vivid = ((edge[:, 2] >= 215) & (edge[:, 2] - edge[:, 1] >= 90)).mean()
    if near_out[pad][ring].mean() >= 0.33 and vivid < 0.1:
        lens = lens_glass(sl, inside)
        if lens:
            glass[sl] |= inside
            kept_glass.append([(sl[1].start + sl[1].stop) // 2, (sl[0].start + sl[0].stop) // 2, area, *lens])
            background[sl] |= inside                       # see-through, but never a strip: the frame stays
            continue
        background[sl] |= inside
        if area >= 80:
            strips[sl] |= inside
# The glass is see-through (owner, 2026-11-15: "remove the white background behind the glass"). Tala's sheet draws her face's
# edge inside the lens, so her glass is just the patch. Tali's draws none: the eye white and the skin fade into the glass's same
# pale grey, so a cut by colour leaves teeth along the eye. There the face edge is redrawn: a straight line fitted to where face
# meets glass (the glass past the face is a circular segment), everything inside the lens beyond it is glass (hair seen through
# the glass and the frame stay), and a ~2 px anti-aliased outline in the frame's colour runs along it, as on the rest of the
# figure. A lens "has its edge drawn" when the dark line next to the glass inside the frame is at least half as long as the bare
# face next to it: Tala 0.55 and up, Tali at most 0.41 (and Tala's Accomplished and Inspired, 0.23 and 0.08, whose lens has no
# edge either).
EDGE_DRAWN = 0.5
OUTLINE = 2.0                                             # sheet pixels
redrawn = np.zeros((H, W), bool)                          # the inside of every lens whose face edge was redrawn
if kept_glass:
    framed = hi < 70
    hairish = (hi < 200) & (rgb[..., 2] - rgb[..., 1] >= 20)
    gl, _ = ndi.label(glass, structure=EIGHT)
    for gx, gy, area, cx, cy, r in kept_glass:
        win = (slice(max(cy - r - 3, 0), cy + r + 4), slice(max(cx - r - 3, 0), cx + r + 4))
        yy, xx = np.mgrid[win]
        d = np.sqrt((yy - cy) ** 2 + (xx - cx) ** 2)
        m = gl[win] == gl[gy, gx] if gl[gy, gx] else glass[win] & (d < r)
        nb = ndi.binary_dilation(m, structure=EIGHT, iterations=2) & ~m & ~background[win]
        contour = int((nb & framed[win] & (d < r - 2.5)).sum())
        bare = nb & ~framed[win] & (d < r - 1.5)
        if bare.sum() < 6 or contour >= EDGE_DRAWN * bare.sum():
            continue
        # The face edge: the chord between the two ends of the glass where it meets the frame (the glass past the face is the
        # circular segment beyond it), with its normal pointing into the glass.
        rim_pts = m & (d >= r - 4)
        if rim_pts.sum() < 2:
            continue
        ang = np.arctan2(yy[rim_pts] - cy, xx[rim_pts] - cx)
        mean = np.arctan2(np.sin(ang).mean(), np.cos(ang).mean())
        rel = np.angle(np.exp(1j * (ang - mean)))
        ends = [mean + rel.min(), mean + rel.max()]
        p0, p1 = [np.array([cx + (r - 1.5) * np.cos(t), cy + (r - 1.5) * np.sin(t)]) for t in ends]
        tang = (p1 - p0) / max(np.linalg.norm(p1 - p0), 1e-6)
        n = np.array([-tang[1], tang[0]])
        if (np.array([cx + r * np.cos(mean), cy + r * np.sin(mean)]) - p0) @ n < 0:
            n = -n
        s = (xx - p0[0]) * n[0] + (yy - p0[1]) * n[1]          # signed distance from the face edge, + into the glass
        lens_in = d < r - 1.0
        frame = framed[win] & (d >= r - 2.5)
        sub, bg = rgb[win], background[win]
        # Glass on the face side of the edge goes back to the face: a smooth blend of the light face colours around it (eye white,
        # skin; copying the single nearest pixel brought the iris and lashes along as speckles).
        regain = m & (s <= 0.5)
        light = ~bg & ~m & ~framed[win] & ~hairish[win]
        if regain.any() and light.any():
            w = ndi.gaussian_filter(light.astype(np.float64), 2.5)
            blend = np.stack([ndi.gaussian_filter(np.where(light, sub[..., c], 0).astype(np.float64), 2.5) for c in range(3)], axis=2)
            _, (fy, fx) = ndi.distance_transform_edt(~light, return_indices=True)
            fill = np.where((w > 0.05)[..., None], blend / np.maximum(w, 1e-6)[..., None], sub[fy, fx])
            sub[regain] = np.rint(fill[regain]).astype(sub.dtype)
            bg[regain] = False
        redrawn[win] |= lens_in
        open_glass = lens_in & ~frame & ~hairish[win]
        bg[open_glass & (s >= 0.5)] = True
        glass[win] |= open_glass & (s >= 0.5)
        glass[win] &= ~(open_glass & (s < 0.5))
        bg[open_glass & (s < 0.5)] = False
        ink = np.median(sub[frame], axis=0)                # the frame's own colour
        # The outline: solid from OUTLINE px inside the edge to the edge, blended into the face on its inner side and into the
        # sheet's grey on its outer side (step 4 reads that blend as the share of art, so the edge is anti-aliased).
        band = open_glass & (s < 0.5) & (s > -OUTLINE - 0.8)
        inner = np.clip((s[band] + OUTLINE + 0.8) / 0.8, 0, 1)[:, None]
        outer = np.clip(0.5 - s[band], 0, 1)[:, None]
        col = inner * ink + (1 - inner) * sub[band]
        sub[band] = np.rint(outer * col + (1 - outer) * 250.0).astype(sub.dtype)
    hi, lo = rgb.max(axis=2), rgb.min(axis=2)
# The outline that held a hair strip off the outside is left floating as a thin dark arc beside the hair (owner, same day: "just
# remove the black lines here"), so thin art (under ~6 px across) within 6 px of a removed strip goes too. The hair's own outline is
# part of a thick mass and survives the opening; lens glass is never a strip, so the glasses keep their frame.
art = ~background
thin = art & ~ndi.binary_opening(art, structure=ndi.generate_binary_structure(2, 1), iterations=3)
background |= thin & ndi.binary_dilation(strips, structure=EIGHT, iterations=6)

# 1c. Narrow checkerboard streaks between curls deeper in the hair (Tala's lower locks, 13-22 px in from the outside): ringed by
#     hair and its outline, checkerboard tones, at most 100 px (the strip by her neck in Focused is 73) and 10 px across. The hoodie's drawstrings, also white in purple,
#     sit 29 px or more in, so the 24 px reach leaves them alone. The lens glass kept in 1b is left alone too: Tala's is a thin
#     sliver against her hair, which looks just like one of these streaks.
reach = ndi.distance_transform_edt(~background)
streak_l, _ = ndi.label((lo >= 225) & (hi - lo <= 15) & ~background & ~ndi.binary_dilation(glass | redrawn, structure=EIGHT, iterations=2), structure=EIGHT)
for i, sl in enumerate(ndi.find_objects(streak_l), 1):
    inside = streak_l[sl] == i
    n = int(inside.sum())
    if not 10 <= n <= 100 or min(inside.shape) > 10 or reach[sl][inside].min() > 24:
        continue
    v = lo[sl][inside]
    if (v <= 249).mean() < 0.25 or v.mean() > 251:
        continue
    pad = (slice(max(sl[0].start - 4, 0), sl[0].stop + 4), slice(max(sl[1].start - 4, 0), sl[1].stop + 4))
    whole = streak_l[pad] == i
    ring = ndi.binary_dilation(whole, structure=EIGHT, iterations=3) & ~whole & ~background[pad]
    px = rgb[pad][ring]
    hair = ((px.max(axis=1) < 200) & (px[:, 2] - px[:, 1] >= 20)) | (px.max(axis=1) < 70)
    if hair.size and hair.mean() >= 0.75:
        background[sl] |= inside

# Each pose owns a cell: a fifth of the width, from under the previous row of labels down to its own.
foreground = ~background
cells = {}
for r, (y0, y1) in enumerate(bands):
    top = 0 if r == 0 else bands[r - 1][1] + 6
    cut = y0 - LABEL_GAP
    foreground[cut:(H if r == len(bands) - 1 else y1 + 6)] = False
    for c, name in enumerate(ROWS[r]):
        cells[name] = (c * W // len(ROWS[r]), top, (c + 1) * W // len(ROWS[r]), cut)

# 3. Shapes: the big one in each cell is the pose, the rest are its marks. Specks are dropped.
fl, fn = ndi.label(foreground, structure=EIGHT)
sizes = ndi.sum(foreground, fl, range(1, fn + 1))
boxes = ndi.find_objects(fl)
masks, report = {}, {}
for name, (left, top, right, cut) in cells.items():
    inside = [i for i in range(1, fn + 1) if sizes[i - 1] >= 12 and left <= (boxes[i - 1][1].start + boxes[i - 1][1].stop) / 2 < right and top <= (boxes[i - 1][0].start + boxes[i - 1][0].stop) / 2 < cut]
    main = max(inside, key=lambda i: sizes[i - 1])
    assert sizes[main - 1] >= BUST_MIN, (name, sizes[main - 1])
    keep = [i for i in inside if i == main or sizes[i - 1] >= 30]
    masks[name] = np.isin(fl, keep)
    ys, xs = np.where(masks[name])
    my, mx = boxes[main - 1]
    report[name] = {'box': [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1], 'main_box': [mx.start, my.start, mx.stop, my.stop], 'marks': len(keep) - 1, 'cell': [left, top, right, cut],
                    'touches_cell_edge': bool(xs.min() <= left or xs.max() >= right - 1 or ys.min() <= top)}

# 3b. The book in `learning` (owner, 2026-11-15: "remove these white lines on the reading book"): the sheet's code symbol on the cover
#     is drawn as broken white strokes (and Tali's copy has a yellow fleck and a white shine on the spine), which read as stray lines
#     at app size. Small light or yellow marks ringed by the cover's violet, away from its outline, take the nearest cover colour. Only this
#     pose, only marks inside the cover (the hoodie's drawstrings sit in darker purple and the pages are ringed by the outline).
if 'learning' in cells:
    left, top, right, cut = cells['learning']
    box = (slice(top, cut), slice(left, right))
    sub = rgb[box]
    s_lo, s_hi = sub.min(axis=2), sub.max(axis=2)
    marks = ((s_lo >= 140) & (s_hi - s_lo <= 70)) | ((sub[..., 0] >= 190) & (sub[..., 1] >= 140) & (sub[..., 2] <= 130))
    vivid_px = (sub[..., 2] >= 140) & (sub[..., 2] - sub[..., 1] >= 55)
    ml, _ = ndi.label(marks & masks['learning'][box], structure=EIGHT)
    paint = np.zeros(marks.shape, bool)
    for i, sl in enumerate(ndi.find_objects(ml), 1):
        inside = ml[sl] == i
        if inside.sum() > 250:
            continue
        pad = tuple(slice(max(s.start - 3, 0), s.stop + 3) for s in sl)
        whole = ml[pad] == i
        ring = ndi.binary_dilation(whole, structure=EIGHT, iterations=2) & ~whole
        # Open cover all round: a bit of the pages' edge or a mark by the laptop touches the dark outline and is left alone.
        if vivid_px[pad][ring].mean() >= 0.7 and (sub[pad][ring].max(axis=1) < 70).mean() < 0.03:
            paint[pad] |= ndi.binary_dilation(whole, structure=EIGHT, iterations=2)
    if paint.any():
        _, (py, px_) = ndi.distance_transform_edt(paint | ~vivid_px, return_indices=True)
        sub[paint] = sub[py[paint], px_[paint]]
        # A light blur over the painted spots only, so the cover's shading carries across them.
        soft = np.stack([ndi.uniform_filter(sub[..., c].astype(np.float64), 5) for c in range(3)], axis=2)
        sub[paint] = np.rint(soft[paint]).astype(sub.dtype)
    report['learning']['book_marks_painted'] = int(paint.sum())

# 4. The edge. Where the art meets the background the sheet blended its outline into the painted checkerboard, so the outermost
#    pixel is a pale grey: kept as it is, it reads on a dark screen as a dotted white halo round the figure. So:
#    a. a rim pixel that is almost all checkerboard (light and colourless) is dropped, unless the art behind it is itself white
#       (a mug, a page, a lens's glare);
#    b. every pixel within two of the background takes the art's own colour there (the strongest art pixel next to it: the dark
#       outline, nearly everywhere), and everything outside the pose its nearest colour, so neither the halo nor the enlargement
#       can bring grey into the edge;
#    c. the edge is drawn where the art covers half a pixel: each rim pixel's share of art is read from its colour (below),
#       and step 5 redraws that line smooth and crisp at the larger size. (A yes/no cut of the rim instead takes a slightly
#       different pixel on each row, which shows as fine teeth along a leaf or a lock of hair.)
everything = np.zeros((H, W), bool)
for m in masks.values():
    everything |= m
core = ndi.binary_erosion(everything, structure=EIGHT, iterations=2)
rim = everything & ndi.binary_dilation(~everything, structure=EIGHT)
_, (ny, nx) = ndi.distance_transform_edt(~core, return_indices=True)
white_art = rgb[ny, nx].min(axis=2) >= 205
drop = rim & (lo >= 205) & (hi - lo <= 20) & ~white_art
for m in masks.values():
    m &= ~drop
everything &= ~drop
P = rgb.astype(np.float64)
B = np.full(3, 250.0)                                     # the checkerboard's light grey (median 250-251 on both sheets)
# Pixels within two of the background are where the sheet blended art and checkerboard: P = c*F + (1-c)*B. F, the art's own
# colour there, is the strongest art pixel within two steps (the most unlike the grey: the dark outline, or a spark's yellow).
# Only real background counts: the straight cut above each label (a mug's base, a desk) was never blended with anything.
band = everything & (ndi.distance_transform_edt(~(background | drop)) <= 2)
strength = np.where(everything, np.sqrt(((P - B) ** 2).sum(axis=2)), -1.0)
F, best = P.copy(), strength.copy()
for dy in range(-2, 3):
    for dx in range(-2, 3):
        s = np.roll(strength, (dy, dx), axis=(0, 1))
        take = s > best
        best = np.where(take, s, best)
        F = np.where(take[..., None], np.roll(P, (dy, dx), axis=(0, 1)), F)
span = ((F - B) ** 2).sum(axis=2)
c = (((P - B) * (F - B)).sum(axis=2) / np.maximum(span, 1e-6)).clip(0, 1)
# With no strong colour within two steps the art at the edge is itself near white (a mug, a page, a lens's glare): there is
# nothing to measure, so it is kept whole.
mixed = band & (span >= 60 ** 2)
cover = np.where(mixed, c, np.where(everything, 1.0, 0.0))
colour = np.where(mixed[..., None], F, P)                 # a mixed pixel shows the art's colour; its share of art is the alpha

# 5. Size. Each pose is only ~270 px wide on the sheet and the app draws one up to 240 pt (720 px on a 3x phone), so it is
#    enlarged once, here: colour with Lanczos and a light unsharp mask; the shape with a smooth cubic, then pulled back into a
#    crisp edge about one output pixel wide, so the contour is an even curve instead of the sheet's pixel steps. This adds no
#    detail the sheet doesn't have: for truly sharp art, ask for the sheet at 3x or larger and re-run.
SCALE = 3
SOFTEN = 0.4                                              # sheet pixels: evens out the sheet's own noise, too little to lose a thin line
def enlarge(rgb_part, shape):
    h, w = shape.shape
    size = (w * SCALE, h * SCALE)
    col = Image.fromarray(np.rint(rgb_part).clip(0, 255).astype(np.uint8), 'RGB').resize(size, Image.LANCZOS)
    col = col.filter(ImageFilter.UnsharpMask(radius=2.0, percent=60, threshold=2))
    soft = ndi.gaussian_filter(shape, SOFTEN)
    cov = np.array(Image.fromarray(soft.astype(np.float32), 'F').resize(size, Image.BICUBIC)).astype(np.float64)
    a = ((cov - 0.5) * SCALE / 1.4 + 0.5).clip(0, 1)
    a = a * a * (3 - 2 * a)                               # smoothstep: an even, anti-aliased edge
    return np.dstack([np.array(col), np.rint(a * 255)]).astype(np.uint8)

# One square canvas for all twenty, centred on the body and standing on one baseline (the cut above the label).
half = up = 0
for name, r in report.items():
    x0, y0, x1, y1 = r['box']
    cx = (r['main_box'][0] + r['main_box'][2]) // 2
    r['cx'] = cx
    half, up = max(half, cx - x0, x1 - cx), max(up, y1 - y0)
side = max(2 * half, up) + 2 * PAD
side += side % 2
for name, r in report.items():
    cx, y1 = r['cx'], r['box'][3]
    cx0, cy0 = cx - side // 2, y1 + PAD - side
    sx0, sy0, sx1, sy1 = max(cx0, 0), max(cy0, 0), min(cx0 + side, W), min(cy0 + side, H)
    oy, ox = sy0 - cy0, sx0 - cx0
    shape = np.zeros((side, side))
    solid = np.zeros((side, side), bool)
    shape[oy:oy + sy1 - sy0, ox:ox + sx1 - sx0] = np.where(masks[name][sy0:sy1, sx0:sx1], cover[sy0:sy1, sx0:sx1], 0)
    solid[oy:oy + sy1 - sy0, ox:ox + sx1 - sx0] = masks[name][sy0:sy1, sx0:sx1]
    paint = np.zeros((side, side, 3))
    paint[oy:oy + sy1 - sy0, ox:ox + sx1 - sx0] = colour[sy0:sy1, sx0:sx1]
    # Outside the pose, the nearest of its own colours, so the enlargement never pulls grey or black into the edge.
    _, (qy, qx) = ndi.distance_transform_edt(~solid, return_indices=True)
    out = enlarge(paint[qy, qx], shape)
    out[out[..., 3] == 0] = 0
    file = f'{OUT}/{name}.webp'
    big = Image.fromarray(out, 'RGBA')
    big.save(file, 'WEBP', lossless=True, quality=100, method=6, exact=True)
    assert np.array_equal(np.array(Image.open(file).convert('RGBA')), out), name
    r['canvas'] = [cx0, cy0, cx0 + side, cy0 + side]
    # components/brand/tali.tsx `tight` crops TIGHT_CROP_TOP rows off the top of the 310 px canvas: nothing may reach into them.
    assert side != 310 or np.where(out[..., 3] > 0)[0].min() >= 80 * SCALE, f'{name} reaches above the tight crop line'
    r['size'] = [side * SCALE, side * SCALE]
print(json.dumps({k: {'box': v['box'], 'marks': v['marks'], 'edge': v['touches_cell_edge']} for k, v in report.items()}))
print('canvas', side, 'saved at', side * SCALE)
print('lens glass (see-through)', len(kept_glass), json.dumps(kept_glass))
if REPORT:
    json.dump(report, open(REPORT, 'w'), indent=1)
