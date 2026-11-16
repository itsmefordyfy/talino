"""Makes the career kit's case-study decks (.pptx, 16:9, six slides, three looks) into assets/career-kit/.

A .pptx opens and edits in PowerPoint, Keynote, Google Slides and Canva. Every piece of text is a normal editable text box (no text in
images), in Arial, which all of those apps have. Placeholder text only, for the learner to replace.

  /tmp/kitvenv/bin/python scripts/career-kit/generate_decks.py        (see generate_docs.py for the one-time setup)
"""
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

OUT = Path(__file__).resolve().parents[2] / 'assets' / 'career-kit'
FONT = 'Arial'
W, H = Inches(13.333), Inches(7.5)


def rgb(h):
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


THEMES = {
    # name: background, ink (main text), muted text, accent, accent text, card fill, big-number colour
    'bold': dict(bg='FFFFFF', ink='1F2430', muted='64748B', accent='7957F5', on_accent='FFFFFF', card='FEF3C7', hot='FBBF24', hot_ink='1F2430', number='7957F5'),
    'clean': dict(bg='FFFFFF', ink='1F2430', muted='64748B', accent='64748B', on_accent='FFFFFF', card='F1F5F9', hot='1F2430', hot_ink='FFFFFF', number='1F2430'),
    'dark': dict(bg='1F2430', ink='FFFFFF', muted='B6BDD0', accent='7957F5', on_accent='FFFFFF', card='2B3245', hot='5EEAD4', hot_ink='123B36', number='5EEAD4'),
}


def background(slide, color):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = rgb(color)


def box(slide, x, y, w, h, fill, shape=MSO_SHAPE.RECTANGLE, radius=None):
    shp = slide.shapes.add_shape(shape, x, y, w, h)
    shp.fill.solid()
    shp.fill.fore_color.rgb = rgb(fill)
    shp.line.fill.background()
    shp.shadow.inherit = False
    if radius is not None and shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        shp.adjustments[0] = radius
    return shp


def text(slide, x, y, w, h, value, size=18, bold=False, color='1F2430', align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, name=None):
    tb = slide.shapes.add_textbox(x, y, w, h)
    if name:
        tb.name = name
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    lines = value if isinstance(value, list) else [value]
    for index, line in enumerate(lines):
        p = tf.paragraphs[0] if index == 0 else tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = line
        run.font.name = FONT
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = rgb(color)
        if index:
            p.space_before = Pt(6)
    return tb


def label(slide, t, value, x=Inches(0.8), y=Inches(0.55)):
    text(slide, x, y, Inches(8), Inches(0.4), value.upper(), size=12, bold=True, color=t['accent'] if t['bg'] != '1F2430' else '5EEAD4')


def title_slide(prs, t, look):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    background(s, t['bg'])
    if look == 'bold':
        box(s, 0, 0, Inches(7.4), H, t['accent'])
        box(s, Inches(7.4), 0, Inches(0.35), H, t['hot'])
        text(s, Inches(0.8), Inches(0.7), Inches(6), Inches(0.4), 'CASE STUDY', size=13, bold=True, color='FBBF24')
        text(s, Inches(0.8), Inches(2.2), Inches(6.2), Inches(2.6), ['Project', 'Name'], size=54, bold=True, color='FFFFFF')
        text(s, Inches(0.8), Inches(5.3), Inches(6), Inches(0.8), 'One line on what it does and who it is for.', size=18, color='EDE9FE')
        text(s, Inches(8.4), Inches(2.6), Inches(4.3), Inches(2.4), ['My role', 'Date', 'Your Name'], size=20, color=t['ink'])
    elif look == 'clean':
        text(s, Inches(1.0), Inches(2.3), Inches(11), Inches(0.4), 'CASE STUDY', size=13, bold=True, color=t['muted'])
        text(s, Inches(1.0), Inches(2.8), Inches(11), Inches(1.4), 'Project Name', size=48, bold=True, color=t['ink'])
        box(s, Inches(1.0), Inches(4.35), Inches(1.2), Emu(38000), t['ink'])
        text(s, Inches(1.0), Inches(4.6), Inches(10), Inches(0.9), 'One line on what it does and who it is for.', size=20, color=t['muted'])
        text(s, Inches(1.0), Inches(6.3), Inches(10), Inches(0.5), 'Your Name  ·  My role  ·  Date', size=14, color=t['muted'])
    else:
        box(s, Inches(0.8), Inches(2.0), Emu(60000), Inches(2.4), t['accent'])
        text(s, Inches(1.2), Inches(1.9), Inches(10), Inches(0.4), 'CASE STUDY', size=13, bold=True, color='5EEAD4')
        text(s, Inches(1.2), Inches(2.4), Inches(11), Inches(1.5), 'Project Name', size=54, bold=True, color='FFFFFF')
        text(s, Inches(1.2), Inches(3.9), Inches(10), Inches(0.8), 'One line on what it does and who it is for.', size=20, color=t['muted'])
        text(s, Inches(1.2), Inches(6.2), Inches(10), Inches(0.5), 'Your Name  ·  My role  ·  Date', size=14, color=t['muted'])
    return s


def content_slide(prs, t, look, tag, heading, points):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    background(s, t['bg'])
    if look == 'bold':
        box(s, 0, 0, W, Inches(1.5), t['accent'])
        text(s, Inches(0.8), Inches(0.28), Inches(8), Inches(0.4), tag.upper(), size=12, bold=True, color='FBBF24')
        text(s, Inches(0.8), Inches(0.62), Inches(11.5), Inches(0.8), heading, size=30, bold=True, color='FFFFFF')
        top = Inches(2.1)
    else:
        label(s, t, tag)
        text(s, Inches(0.8), Inches(0.95), Inches(11.5), Inches(0.9), heading, size=32, bold=True, color=t['ink'])
        top = Inches(2.2)
    return s, top


def bullets(slide, t, top, lines, left=Inches(0.8), width=Inches(11.6)):
    text(slide, left, top, width, Inches(4), ['•  ' + line for line in lines], size=20, color=t['ink'])


def build(look):
    t = THEMES[look]
    prs = Presentation()
    prs.slide_width, prs.slide_height = W, H
    title_slide(prs, t, look)

    s, top = content_slide(prs, t, look, 'The problem', 'Who has the problem, and why it hurts', [])
    bullets(s, t, top, ['Who has it: one specific kind of person.', 'What they do today instead, and why that is slow or costly.', 'What it costs them: time, money, customers.'])
    text(s, Inches(0.8), Inches(6.2), Inches(11.5), Inches(0.5), 'Say it in their words, not yours.', size=14, color=t['muted'])

    s, top = content_slide(prs, t, look, 'What I built', 'The solution, in one screenshot and three points', [])
    box(s, Inches(0.8), top, Inches(5.6), Inches(3.9), t['card'], MSO_SHAPE.ROUNDED_RECTANGLE, 0.04)
    text(s, Inches(0.8), top, Inches(5.6), Inches(3.9), 'Drop a screenshot here', size=14, color=t['muted'], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    bullets(s, t, top, ['What it lets the user do in one minute.', 'The one feature that matters most.', 'What you left out on purpose, and why.'], left=Inches(6.9), width=Inches(5.8))

    s, top = content_slide(prs, t, look, 'How it works', 'Three steps from start to finish', [])
    for index, step in enumerate(('Step one', 'Step two', 'Step three')):
        x = Inches(0.8 + index * 4.0)
        box(s, x, top, Inches(3.7), Inches(3.4), t['card'], MSO_SHAPE.ROUNDED_RECTANGLE, 0.05)
        badge = box(s, x + Inches(0.3), top + Inches(0.3), Inches(0.7), Inches(0.7), t['accent'] if look != 'clean' else t['ink'], MSO_SHAPE.OVAL)
        text(s, x + Inches(0.3), top + Inches(0.3), Inches(0.7), Inches(0.7), str(index + 1), size=22, bold=True, color=t['on_accent'] if look != 'clean' else 'FFFFFF', align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        text(s, x + Inches(0.3), top + Inches(1.2), Inches(3.1), Inches(0.5), step, size=20, bold=True, color=t['ink'])
        text(s, x + Inches(0.3), top + Inches(1.8), Inches(3.1), Inches(1.4), 'One or two lines on what happens here.', size=16, color=t['muted'])

    s, top = content_slide(prs, t, look, 'The result', 'What changed because of it', [])
    for index in range(3):
        x = Inches(0.8 + index * 4.0)
        box(s, x, top, Inches(3.7), Inches(3.2), t['card'], MSO_SHAPE.ROUNDED_RECTANGLE, 0.05)
        text(s, x + Inches(0.3), top + Inches(0.5), Inches(3.1), Inches(1.2), 'XX%', size=54, bold=True, color=t['number'])
        text(s, x + Inches(0.3), top + Inches(1.9), Inches(3.1), Inches(1.0), 'What this number means, in plain words. Only use a number that is true.', size=15, color=t['muted'])

    s, top = content_slide(prs, t, look, 'What I learned', 'What I learned and what is next', [])
    bullets(s, t, top, ['One thing I would do differently.', 'One skill this project taught me.', 'What I would build next.'])
    box(s, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.0), t['hot'], MSO_SHAPE.ROUNDED_RECTANGLE, 0.2)
    text(s, Inches(1.1), Inches(5.6), Inches(11.1), Inches(1.0), 'Your Name  ·  you@email.com  ·  linkedin.com/in/yourname  ·  yourname.dev', size=16, bold=True, color=t['hot_ink'], anchor=MSO_ANCHOR.MIDDLE)

    OUT.mkdir(parents=True, exist_ok=True)
    prs.core_properties.author = 'Talino AI'
    prs.core_properties.title = f'Case study - {look}'
    prs.save(OUT / f'case-study-{look}.pptx')
    print('wrote case-study-' + look)


if __name__ == '__main__':
    for look in ('bold', 'clean', 'dark'):
        build(look)
