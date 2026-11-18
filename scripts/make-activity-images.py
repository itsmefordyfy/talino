"""Small PNGs of the coaches for the Lock Screen: the Live Activity's card (a widget has little memory, so 256 px instead of the 930 px
poses) and the now-playing artwork (on the dark card color, since a transparent picture would sit on black there). Run from the repo root:
python3 scripts/make-activity-images.py"""
from PIL import Image


def content(img):
    """The picture cropped to what is drawn (the poses sit low in their canvas), padded back to a square."""
    img = img.crop(img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    side = max(img.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.alpha_composite(img, ((side - img.width) // 2, (side - img.height) // 2))
    return square

CARD = (0x2B, 0x28, 0x50, 255)
for coach in ("tali", "tala"):
    for name, pose in (("going", "determined"), ("done", "celebrating")):
        img = Image.open(f"assets/images/{coach}/{pose}.webp").convert("RGBA")
        img = content(img)
        img.thumbnail((256, 256), Image.LANCZOS)
        img.save(f"assets/images/activity/{coach}-{name}.png", optimize=True)
    art = content(Image.open(f"assets/images/{coach}/determined.webp").convert("RGBA"))
    art.thumbnail((560, 560), Image.LANCZOS)
    canvas = Image.new("RGBA", (600, 600), CARD)
    canvas.alpha_composite(art, ((600 - art.width) // 2, (600 - art.height) // 2))
    canvas.convert("RGB").save(f"assets/images/activity/{coach}-art.png", optimize=True)
