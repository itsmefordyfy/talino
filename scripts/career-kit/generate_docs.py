"""Makes the career kit's Word templates (.docx) into assets/career-kit/: résumé, portfolio sheet, proposal and invoice, three looks each.

Why Word: a .docx opens and edits in Microsoft Word, Pages (iPhone, iPad, Mac), Google Docs and Canva (it imports Word files), so a learner is
never tied to one app. Everything is a normal editable paragraph or table (no text in images), uses fonts every one of those apps has (Arial),
and keeps the brand colours of Talino. The text is placeholder text for the learner to replace.

  python3 -m venv /tmp/kitvenv && /tmp/kitvenv/bin/pip install python-docx python-pptx
  /tmp/kitvenv/bin/python scripts/career-kit/generate_docs.py
"""
from pathlib import Path

from docx import Document
from docx.enum.table import WD_ROW_HEIGHT_RULE, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = Path(__file__).resolve().parents[2] / 'assets' / 'career-kit'
FONT = 'Arial'

VIOLET, INDIGO, NAVY, INK, SLATE = '7957F5', '536DFE', '1E2A5A', '1F2430', '64748B'
LAVENDER, LINE, GOLD, MINT, WHITE, FOREST = 'F5F3FF', 'D8DCE6', 'FBBF24', '5EEAD4', 'FFFFFF', '1F4D3A'


def rgb(hex_):
    return RGBColor(int(hex_[0:2], 16), int(hex_[2:4], 16), int(hex_[4:6], 16))


# ---- low-level helpers ------------------------------------------------------------------------------------------------------------

def new_doc(margin_cm=1.6):
    doc = Document()
    section = doc.sections[0]
    section.page_width, section.page_height = Cm(21.0), Cm(29.7)  # A4
    section.left_margin = section.right_margin = Cm(margin_cm)
    section.top_margin = section.bottom_margin = Cm(margin_cm)
    normal = doc.styles['Normal']
    normal.font.name = FONT
    normal.font.size = Pt(10)
    normal.element.rPr.rFonts.set(qn('w:eastAsia'), FONT)
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.space_before = Pt(0)
    return doc


def shade(cell, hex_):
    tc_pr = cell._tc.get_or_add_tcPr()
    for old in tc_pr.findall(qn('w:shd')):
        tc_pr.remove(old)
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_)
    tc_pr.append(shd)


def cell_margins(cell, top=0, bottom=0, left=0, right=0):
    tc_pr = cell._tc.get_or_add_tcPr()
    mar = OxmlElement('w:tcMar')
    for side, value in (('top', top), ('left', left), ('bottom', bottom), ('right', right)):
        node = OxmlElement(f'w:{side}')
        node.set(qn('w:w'), str(int(value * 567)))  # cm -> twips
        node.set(qn('w:type'), 'dxa')
        mar.append(node)
    tc_pr.append(mar)


def borders(table, color=None, size=4, inside=False):
    """No borders (color None) or a thin line round the table (and between cells with inside=True)."""
    tbl_pr = table._tbl.tblPr
    old = tbl_pr.find(qn('w:tblBorders'))
    if old is not None:
        tbl_pr.remove(old)
    b = OxmlElement('w:tblBorders')
    for side in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        node = OxmlElement(f'w:{side}')
        shown = color is not None and (inside or side in ('top', 'left', 'bottom', 'right'))
        node.set(qn('w:val'), 'single' if shown else 'nil')
        if shown:
            node.set(qn('w:sz'), str(size))
            node.set(qn('w:color'), color)
        b.append(node)
    tbl_pr.append(b)


def cell_border(cell, side, color, size=6):
    tc_pr = cell._tc.get_or_add_tcPr()
    b = tc_pr.find(qn('w:tcBorders'))
    if b is None:
        b = OxmlElement('w:tcBorders')
        tc_pr.append(b)
    node = OxmlElement(f'w:{side}')
    node.set(qn('w:val'), 'single')
    node.set(qn('w:sz'), str(size))
    node.set(qn('w:color'), color)
    b.append(node)


def widths(table, cms):
    """Sets the width three ways (the table, its grid and every cell), because Word reads the cells, while Pages and Google Docs read the grid."""
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_pr = table._tbl.tblPr
    for old in tbl_pr.findall(qn('w:tblW')):
        tbl_pr.remove(old)
    tbl_w = OxmlElement('w:tblW')
    tbl_w.set(qn('w:w'), str(int(sum(cms) * 567)))
    tbl_w.set(qn('w:type'), 'dxa')
    tbl_pr.append(tbl_w)
    layout = OxmlElement('w:tblLayout')
    layout.set(qn('w:type'), 'fixed')
    tbl_pr.append(layout)
    for column, width in zip(table.columns, cms):
        column.width = Cm(width)
    for row in table.rows:
        for cell, width in zip(row.cells, cms):
            cell.width = Cm(width)


def full_height(table, cm):
    """Makes the (single) row at least this tall, so a shaded column runs the whole page instead of stopping with its text."""
    row = table.rows[0]
    row.height = Cm(cm)
    row.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST


def para(container, text='', size=10, bold=False, color=INK, align=None, before=0, after=0, italic=False, first=False):
    """A paragraph in a document or a cell; `first=True` reuses the cell's empty first paragraph."""
    p = container.paragraphs[0] if first and container.paragraphs and not container.paragraphs[0].text else container.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    if align:
        p.alignment = align
    if text:
        run = p.add_run(text)
        run.font.name = FONT
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = rgb(color)
    return p


def bullet(container, text, size=10, color=INK, before=0):
    p = para(container, '', before=before)
    p.paragraph_format.left_indent = Cm(0.45)
    p.paragraph_format.first_line_indent = Cm(-0.45)
    run = p.add_run('•  ' + text)
    run.font.name = FONT
    run.font.size = Pt(size)
    run.font.color.rgb = rgb(color)
    return p


def rule(container, color=LINE, before=4, after=4):
    p = para(container, '', before=before, after=after)
    p_pr = p._p.get_or_add_pPr()
    bdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '6')
    bottom.set(qn('w:space'), '1')
    bottom.set(qn('w:color'), color)
    bdr.append(bottom)
    p_pr.append(bdr)
    return p


def heading(container, text, color, size=11, before=10, after=3):
    return para(container, text.upper(), size=size, bold=True, color=color, before=before, after=after)


def save(doc, name):
    OUT.mkdir(parents=True, exist_ok=True)
    doc.core_properties.author = 'Talino AI'
    doc.core_properties.title = name
    doc.save(OUT / f'{name}.docx')
    print('wrote', name)


# ---- shared résumé content ---------------------------------------------------------------------------------------------------------

CONTACT = 'City, Philippines  |  you@email.com  |  +63 900 000 0000  |  linkedin.com/in/yourname'
SUMMARY = ('Junior developer who builds small web apps with AI-assisted tools and checks everything they write. '
           'Delivered a working project in {{weeks}} weeks. Looking for a first role where I can keep learning and ship useful things.')
SKILLS = [('Languages', 'JavaScript, TypeScript, Python'), ('Frameworks', 'React, React Native, Node.js'),
          ('Tools', 'Git, GitHub, VS Code, Figma'), ('AI tools', 'ChatGPT, Claude, Cursor, GitHub Copilot')]
PROJECTS = [('Project Name', 'One line on the problem it solves and the result (for example, “cut manual booking by half”).', 'github.com/yourname/project'),
            ('Second Project', 'One line on what you built and who uses it.', 'yourname.dev/project')]
JOBS = [('Job Title', 'Company Name', 'March 2025 – Present',
         ['Write achievement-focused bullets that begin with strong action verbs.', 'Add a number where you honestly can: time saved, users, speed.', 'Keep each bullet to one or two lines.']),
        ('Previous Job Title', 'Company Name', 'June 2023 – February 2025',
         ['Describe what changed because you were there.', 'Mention the tools you used.'])]
EDU = [('Course or Degree', 'School Name', '2019 – 2023')]


def resume_body(container, accent, name_color=INK, compact=False):
    heading(container, 'Professional summary', accent, before=0)
    para(container, SUMMARY.replace('{{weeks}}', 'X'), after=2)
    heading(container, 'Projects', accent)
    for title, text, link in PROJECTS:
        para(container, title, bold=True, before=3)
        para(container, text, size=9.5, color=SLATE)
        para(container, link, size=9, color=accent)
    heading(container, 'Experience', accent)
    for role, company, dates, bullets in JOBS:
        para(container, f'{role}  ·  {company}', bold=True, before=4)
        para(container, dates, size=9, color=SLATE, after=1)
        for item in bullets:
            bullet(container, item, size=9.5)
    heading(container, 'Education', accent)
    for degree, school, years in EDU:
        para(container, f'{degree}  ·  {school}', bold=True, before=2)
        para(container, years, size=9, color=SLATE)
    heading(container, 'Certificates', accent)
    bullet(container, 'Certificate name, issuer, year (for example, a Talino course certificate)', size=9.5)


def resume_sidebar():
    doc = new_doc(margin_cm=0.9)
    table = doc.add_table(rows=1, cols=2)
    borders(table)
    widths(table, [6.0, 12.2])
    full_height(table, 27.0)
    left, right = table.rows[0].cells
    shade(left, NAVY)
    cell_margins(left, top=0.9, bottom=0.9, left=0.6, right=0.5)
    cell_margins(right, top=0.9, bottom=0.6, left=0.8, right=0.4)
    para(left, '[ Your photo ]', size=9, color='C7CCE0', align=WD_ALIGN_PARAGRAPH.CENTER, first=True, after=6)
    para(left, 'Your Name', size=17, bold=True, color=WHITE, after=1)
    para(left, 'Junior Developer', size=10, color=MINT, after=8)
    for label, lines in (('Contact', ['City, Philippines', 'you@email.com', '+63 900 000 0000', 'linkedin.com/in/yourname', 'github.com/yourname']),):
        para(left, label.upper(), size=9, bold=True, color=GOLD, before=4, after=2)
        for line in lines:
            para(left, line, size=9, color='E6E9F5')
    para(left, 'SKILLS', size=9, bold=True, color=GOLD, before=10, after=2)
    for label, items in SKILLS:
        para(left, label, size=9, bold=True, color=WHITE, before=3)
        para(left, items, size=9, color='E6E9F5')
    para(left, 'LANGUAGES', size=9, bold=True, color=GOLD, before=10, after=2)
    para(left, 'English, Filipino', size=9, color='E6E9F5')
    resume_body(right, VIOLET)
    save(doc, 'resume-sidebar')


def resume_header():
    doc = new_doc(margin_cm=0.9)
    band = doc.add_table(rows=1, cols=2)
    borders(band)
    widths(band, [14.6, 3.6])
    name, photo = band.rows[0].cells
    shade(name, VIOLET)
    shade(photo, VIOLET)
    cell_margins(name, top=0.8, bottom=0.8, left=0.9, right=0.3)
    cell_margins(photo, top=0.8, bottom=0.8, left=0.2, right=0.6)
    para(name, 'Your Name', size=24, bold=True, color=WHITE, first=True)
    para(name, 'Junior Developer  |  AI-assisted building', size=11, color='EDE9FE', after=4)
    para(name, CONTACT, size=8.5, color='EDE9FE')
    para(photo, '[ Photo ]', size=9, color='EDE9FE', align=WD_ALIGN_PARAGRAPH.CENTER, first=True)
    body = doc.add_table(rows=1, cols=1)
    borders(body)
    widths(body, [18.2])
    cell = body.rows[0].cells[0]
    cell_margins(cell, top=0.5, bottom=0.5, left=0.9, right=0.9)
    resume_body(cell, VIOLET)
    # Skills as one clean block under the header.
    heading(cell, 'Skills', VIOLET)
    for label, items in SKILLS:
        p = para(cell, '', before=1)
        r1 = p.add_run(label + ':  ')
        r1.font.bold, r1.font.size, r1.font.name = True, Pt(9.5), FONT
        r2 = p.add_run(items)
        r2.font.size, r2.font.name, r2.font.color.rgb = Pt(9.5), FONT, rgb(SLATE)
    save(doc, 'resume-header')


def resume_minimal():
    doc = new_doc(margin_cm=1.9)
    top = doc.add_table(rows=1, cols=2)
    borders(top)
    widths(top, [14.0, 3.2])
    name, photo = top.rows[0].cells
    para(name, 'Your Name', size=26, bold=True, color=INK, first=True)
    para(name, 'Junior Developer  |  AI-assisted building', size=11, color=SLATE, after=3)
    para(name, CONTACT, size=8.5, color=SLATE)
    shade(photo, LAVENDER)
    cell_margins(photo, top=0.9, bottom=0.9, left=0.1, right=0.1)
    para(photo, '[ Photo ]', size=9, color=SLATE, align=WD_ALIGN_PARAGRAPH.CENTER, first=True)
    rule(doc, color=INK, before=8, after=2)
    resume_body(doc, INK)
    heading(doc, 'Skills', INK)
    for label, items in SKILLS:
        p = para(doc, '', before=1)
        r1 = p.add_run(label + ':  ')
        r1.font.bold, r1.font.size, r1.font.name = True, Pt(9.5), FONT
        r2 = p.add_run(items)
        r2.font.size, r2.font.name, r2.font.color.rgb = Pt(9.5), FONT, rgb(SLATE)
    save(doc, 'resume-minimal')


# ---- portfolio sheet ----------------------------------------------------------------------------------------------------------------

PROJECT_CARDS = [('Project One', 'The problem it solves, in one line.', 'What you built: two or three words on the stack.', 'Result: one honest number or outcome.'),
                 ('Project Two', 'The problem it solves, in one line.', 'What you built: two or three words on the stack.', 'Result: one honest number or outcome.'),
                 ('Project Three', 'The problem it solves, in one line.', 'What you built: two or three words on the stack.', 'Result: one honest number or outcome.'),
                 ('Project Four', 'The problem it solves, in one line.', 'What you built: two or three words on the stack.', 'Result: one honest number or outcome.')]
ABOUT = 'Two or three sentences: who you are, what you build, and the kind of work you want. Keep it about the people you help.'


def contact_block(container, color):
    heading(container, 'Contact', color)
    para(container, 'you@email.com  |  +63 900 000 0000')
    para(container, 'linkedin.com/in/yourname  |  github.com/yourname  |  yourname.dev', color=SLATE)
    para(container, 'Available for new work: remote or on-site, Philippines and abroad.', size=9, color=SLATE, before=3)


def portfolio_spotlight():
    doc = new_doc(margin_cm=0.9)
    hero = doc.add_table(rows=1, cols=1)
    borders(hero)
    widths(hero, [18.2])
    cell = hero.rows[0].cells[0]
    shade(cell, VIOLET)
    cell_margins(cell, top=1.6, bottom=1.6, left=1.2, right=1.2)
    para(cell, 'PORTFOLIO', size=9, bold=True, color=GOLD, first=True, after=4)
    para(cell, 'I build useful things', size=30, bold=True, color=WHITE)
    para(cell, 'with code and AI.', size=30, bold=True, color=WHITE, after=8)
    para(cell, 'Your Name  ·  Junior Developer  ·  City, Philippines', size=11, color='EDE9FE')
    body = doc.add_table(rows=1, cols=1)
    borders(body)
    widths(body, [18.2])
    b = body.rows[0].cells[0]
    cell_margins(b, top=0.6, bottom=0.5, left=1.2, right=1.2)
    heading(b, 'About', VIOLET, before=2)
    para(b, ABOUT)
    heading(b, 'Selected projects', VIOLET)
    for title, problem, stack, result in PROJECT_CARDS[:3]:
        para(b, title, size=12, bold=True, before=6)
        para(b, problem)
        para(b, stack, size=9.5, color=SLATE)
        para(b, result, size=9.5, color=VIOLET)
        para(b, 'Link: yourname.dev/project', size=9, color=SLATE)
    heading(b, 'Skills', VIOLET)
    para(b, 'JavaScript · TypeScript · Python · React · Node.js · Git · AI-assisted development')
    contact_block(b, VIOLET)
    save(doc, 'portfolio-spotlight')


def portfolio_grid():
    doc = new_doc(margin_cm=1.5)
    para(doc, 'Your Name', size=26, bold=True, color=FOREST, first=False)
    para(doc, 'Junior Developer  ·  City, Philippines', size=11, color=SLATE, after=4)
    para(doc, ABOUT, after=6)
    heading(doc, 'Projects', FOREST, before=4)
    grid = doc.add_table(rows=2, cols=2)
    borders(grid, color=LINE, size=6, inside=True)
    widths(grid, [8.9, 8.9])
    for index, (title, problem, stack, result) in enumerate(PROJECT_CARDS):
        cell = grid.rows[index // 2].cells[index % 2]
        cell_margins(cell, top=0.4, bottom=0.5, left=0.45, right=0.4)
        if index in (0, 3):
            shade(cell, 'EEF6F1')
        para(cell, '[ Screenshot ]', size=8.5, color=SLATE, align=WD_ALIGN_PARAGRAPH.CENTER, first=True, after=6, before=18)
        para(cell, title, size=12, bold=True, color=FOREST, before=18)
        para(cell, problem, size=9.5)
        para(cell, stack, size=9, color=SLATE)
        para(cell, result, size=9, color=FOREST)
        para(cell, 'yourname.dev/project', size=8.5, color=SLATE, after=8)
    heading(doc, 'Skills', FOREST, before=10)
    para(doc, 'JavaScript · TypeScript · Python · React · Node.js · Git · AI-assisted development')
    contact_block(doc, FOREST)
    save(doc, 'portfolio-grid')


def portfolio_story():
    doc = new_doc(margin_cm=1.2)
    table = doc.add_table(rows=1, cols=2)
    borders(table)
    widths(table, [10.4, 7.6])
    full_height(table, 26.6)
    left, right = table.rows[0].cells
    cell_margins(left, top=0.8, bottom=0.6, left=0.7, right=0.8)
    shade(right, NAVY)
    cell_margins(right, top=0.9, bottom=0.8, left=0.7, right=0.6)
    para(left, 'Your Name', size=26, bold=True, color=NAVY, first=True)
    para(left, 'Junior Developer  ·  City, Philippines', size=11, color=SLATE, after=6)
    para(left, ABOUT, after=4)
    heading(left, 'How I got here', NAVY)
    for year, line in (('2021', 'Where it started: what first got you into tech.'), ('2023', 'The first thing you built, and what you learned.'),
                       ('2025', 'Your most recent project or role.'), ('Now', 'What you are looking for next.')):
        p = para(left, '', before=4)
        r1 = p.add_run(year + '   ')
        r1.font.bold, r1.font.size, r1.font.name, r1.font.color.rgb = True, Pt(10), FONT, rgb(VIOLET)
        r2 = p.add_run(line)
        r2.font.size, r2.font.name = Pt(10), FONT
    heading(left, 'Skills', NAVY, before=12)
    para(left, 'JavaScript · TypeScript · Python · React · Node.js · Git · AI-assisted development')
    para(right, '[ Your photo ]', size=9, color='C7CCE0', align=WD_ALIGN_PARAGRAPH.CENTER, first=True, after=14, before=40)
    para(right, 'SELECTED PROJECTS', size=9, bold=True, color=GOLD, after=4)
    for title, problem, stack, result in PROJECT_CARDS[:3]:
        para(right, title, size=11, bold=True, color=WHITE, before=7)
        para(right, problem, size=9, color='E6E9F5')
        para(right, result, size=9, color=MINT)
    para(right, 'CONTACT', size=9, bold=True, color=GOLD, before=16, after=2)
    para(right, 'you@email.com', size=9, color='E6E9F5')
    para(right, '+63 900 000 0000', size=9, color='E6E9F5')
    para(right, 'linkedin.com/in/yourname', size=9, color='E6E9F5')
    save(doc, 'portfolio-story')


# ---- client proposal ----------------------------------------------------------------------------------------------------------------

PROBLEM = 'In the client’s own words: what is not working today, and what it costs them (time, money, customers).'
DELIVER = ['Deliverable one: what they will receive, in plain words.', 'Deliverable two.', 'Deliverable three.']
EXCLUDED = ['Something that is not included, so nobody is surprised later.', 'Another item that is out of scope.']
MILESTONES = [('Week 1', 'Plan and first draft'), ('Week 2', 'Build and review'), ('Week 3', 'Revisions and handover')]


def proposal_sections(container, accent):
    heading(container, 'The problem', accent, before=8)
    para(container, PROBLEM)
    heading(container, 'What I will deliver', accent)
    for d in DELIVER:
        bullet(container, d)
    heading(container, 'Not included', accent)
    for d in EXCLUDED:
        bullet(container, d, color=SLATE)
    heading(container, 'Timeline', accent)
    for week, what in MILESTONES:
        p = para(container, '', before=2)
        r1 = p.add_run(week + '   ')
        r1.font.bold, r1.font.size, r1.font.name, r1.font.color.rgb = True, Pt(10), FONT, rgb(accent)
        r2 = p.add_run(what)
        r2.font.size, r2.font.name = Pt(10), FONT
    heading(container, 'How we will work', accent)
    bullet(container, 'Two rounds of revisions are included.')
    bullet(container, 'I reply within one working day; updates every Friday.')
    bullet(container, '50% to start, 50% on delivery.')


def proposal_tiers():
    doc = new_doc(margin_cm=1.6)
    band = doc.add_table(rows=1, cols=1)
    borders(band)
    widths(band, [17.8])
    cell = band.rows[0].cells[0]
    shade(cell, VIOLET)
    cell_margins(cell, top=1.0, bottom=1.0, left=1.0, right=1.0)
    para(cell, 'PROJECT PROPOSAL', size=9, bold=True, color=GOLD, first=True, after=4)
    para(cell, 'Project Title', size=26, bold=True, color=WHITE)
    para(cell, 'Prepared for: Client Name   ·   Prepared by: Your Name   ·   Date', size=10, color='EDE9FE', before=6)
    proposal_sections(doc, VIOLET)
    heading(doc, 'Investment', VIOLET, before=12)
    tiers = doc.add_table(rows=1, cols=3)
    borders(tiers, color=LINE, size=6, inside=True)
    widths(tiers, [5.9, 5.9, 5.9])
    data = [('Starter', '₱X,XXX', ['Core deliverable', '1 round of revisions', 'Email support'], False),
            ('Standard', '₱X,XXX', ['Everything in Starter', '2 rounds of revisions', 'Weekly check-in', 'Handover guide'], True),
            ('Premium', '₱X,XXX', ['Everything in Standard', '3 rounds of revisions', '30 days of support'], False)]
    for cell, (name, price, items, hot) in zip(tiers.rows[0].cells, data):
        cell_margins(cell, top=0.5, bottom=0.6, left=0.4, right=0.4)
        if hot:
            shade(cell, VIOLET)
        ink = WHITE if hot else INK
        para(cell, ('RECOMMENDED' if hot else ' '), size=7.5, bold=True, color=GOLD if hot else WHITE, first=True)
        para(cell, name, size=13, bold=True, color=ink, before=2)
        para(cell, price, size=18, bold=True, color=ink if hot else VIOLET, before=2, after=4)
        for item in items:
            bullet(cell, item, size=9, color=ink)
    heading(doc, 'Next step', VIOLET, before=12)
    para(doc, 'Reply to confirm the package and I will send the start invoice. This proposal is valid for 14 days.')
    para(doc, 'Signature: ____________________     Date: ____________', before=14, color=SLATE)
    save(doc, 'proposal-tiers')


def proposal_one_page():
    doc = new_doc(margin_cm=1.2)
    band = doc.add_table(rows=1, cols=2)
    borders(band)
    widths(band, [12.0, 6.6])
    left, right = band.rows[0].cells
    for c in (left, right):
        shade(c, NAVY)
        cell_margins(c, top=0.7, bottom=0.7, left=0.9, right=0.7)
    para(left, 'Project Proposal', size=22, bold=True, color=WHITE, first=True)
    para(left, 'Project Title', size=11, color=MINT, before=2)
    para(right, 'Prepared for', size=8, color='C7CCE0', first=True)
    para(right, 'Client Name', size=10, bold=True, color=WHITE, after=3)
    para(right, 'Prepared by', size=8, color='C7CCE0')
    para(right, 'Your Name  ·  Date', size=10, bold=True, color=WHITE)
    body = doc.add_table(rows=1, cols=2)
    borders(body)
    widths(body, [11.0, 7.6])
    a, b = body.rows[0].cells
    cell_margins(a, top=0.2, bottom=0.2, left=0.9, right=0.7)
    cell_margins(b, top=0.2, bottom=0.2, left=0.7, right=0.7)
    shade(b, LAVENDER)
    heading(a, 'The problem', NAVY, before=6)
    para(a, PROBLEM, size=9.5)
    heading(a, 'What I will deliver', NAVY, before=8)
    for d in DELIVER:
        bullet(a, d, size=9.5)
    heading(a, 'Not included', NAVY, before=8)
    for d in EXCLUDED:
        bullet(a, d, size=9.5, color=SLATE)
    heading(a, 'How we will work', NAVY, before=8)
    bullet(a, 'Two rounds of revisions are included.', size=9.5)
    bullet(a, 'I reply within one working day.', size=9.5)
    heading(b, 'Timeline', NAVY, before=6)
    for week, what in MILESTONES:
        para(b, week, size=9.5, bold=True, color=VIOLET, before=4)
        para(b, what, size=9.5)
    heading(b, 'Investment', NAVY, before=12)
    para(b, '₱X,XXX', size=22, bold=True, color=NAVY)
    para(b, '50% to start, 50% on delivery.', size=9, color=SLATE)
    heading(b, 'Next step', NAVY, before=12)
    para(b, 'Reply to confirm and I will send the start invoice. Valid for 14 days.', size=9.5)
    para(b, 'Signature: ______________', size=9, color=SLATE, before=12)
    save(doc, 'proposal-one-page')


def proposal_letter():
    doc = new_doc(margin_cm=2.4)
    para(doc, 'Your Name', size=13, bold=True, color=FOREST, first=False)
    para(doc, 'City, Philippines  |  you@email.com  |  +63 900 000 0000', size=9, color=SLATE, after=2)
    rule(doc, color=FOREST, before=2, after=10)
    para(doc, 'Date', color=SLATE)
    para(doc, 'Client Name', bold=True, before=8)
    para(doc, 'Company or Organisation')
    para(doc, 'Subject: Proposal for Project Title', bold=True, size=11, color=FOREST, before=14, after=8)
    para(doc, 'Dear Client Name,', after=6)
    para(doc, 'Thank you for talking with me about ' + 'your project. ' + PROBLEM, after=6)
    para(doc, 'Here is what I propose.', after=2)
    proposal_sections(doc, FOREST)
    heading(doc, 'Investment', FOREST)
    para(doc, '₱X,XXX in total: 50% to start and 50% on delivery. This proposal is valid for 14 days.')
    para(doc, 'If this looks right, reply to this letter and I will send the start invoice. I am happy to adjust the scope to fit your budget.', before=8)
    para(doc, 'Sincerely,', before=12)
    para(doc, 'Your Name', bold=True, before=16)
    save(doc, 'proposal-letter')


# ---- invoice -----------------------------------------------------------------------------------------------------------------------

ROWS = [('Service or deliverable', '1', '₱X,XXX.00', '₱X,XXX.00'), ('Service or deliverable', '1', '₱X,XXX.00', '₱X,XXX.00'),
        ('Service or deliverable', '1', '₱X,XXX.00', '₱X,XXX.00'), ('Service or deliverable', '1', '₱X,XXX.00', '₱X,XXX.00')]


def items_table(doc, head_fill, head_ink, line, rows=ROWS, size=9.5):
    table = doc.add_table(rows=1 + len(rows), cols=4)
    borders(table, color=line, size=4, inside=True)
    widths(table, [9.2, 1.8, 3.3, 3.5])
    for cell, label in zip(table.rows[0].cells, ('Description', 'Qty', 'Rate', 'Amount')):
        shade(cell, head_fill)
        cell_margins(cell, top=0.18, bottom=0.18, left=0.25, right=0.25)
        para(cell, label, size=9, bold=True, color=head_ink, first=True, align=WD_ALIGN_PARAGRAPH.LEFT if label == 'Description' else WD_ALIGN_PARAGRAPH.RIGHT)
    for row, values in zip(table.rows[1:], rows):
        for index, (cell, value) in enumerate(zip(row.cells, values)):
            cell_margins(cell, top=0.2, bottom=0.2, left=0.25, right=0.25)
            para(cell, value, size=size, first=True, align=WD_ALIGN_PARAGRAPH.LEFT if index == 0 else WD_ALIGN_PARAGRAPH.RIGHT)
    return table


def totals(doc, accent, fill=None):
    table = doc.add_table(rows=3, cols=2)
    borders(table)
    widths(table, [14.0, 3.8])
    for row, (label, value, big) in zip(table.rows, (('Subtotal', '₱X,XXX.00', False), ('Tax (if any)', '₱0.00', False), ('Total due', '₱X,XXX.00', True))):
        a, b = row.cells
        for c in (a, b):
            cell_margins(c, top=0.15, bottom=0.15, left=0.25, right=0.25)
            if big and fill:
                shade(c, fill)
        ink = WHITE if (big and fill) else (accent if big else INK)
        para(a, label, size=11 if big else 10, bold=big, color=ink, first=True, align=WD_ALIGN_PARAGRAPH.RIGHT)
        para(b, value, size=11 if big else 10, bold=big, color=ink, first=True, align=WD_ALIGN_PARAGRAPH.RIGHT)


def payment_block(container, accent):
    heading(container, 'Payment details', accent, before=10)
    para(container, 'Bank: Bank Name   ·   Account name: Your Name   ·   Account no.: 0000 0000 0000')
    para(container, 'GCash: 0900 000 0000', before=1)
    para(container, 'Payment terms: due within 7 days of the issue date. Thank you for your business.', size=9, color=SLATE, before=4)


def invoice_classic():
    doc = new_doc(margin_cm=1.4)
    band = doc.add_table(rows=1, cols=2)
    borders(band)
    widths(band, [10.5, 7.3])
    left, right = band.rows[0].cells
    for c in (left, right):
        shade(c, NAVY)
        cell_margins(c, top=0.8, bottom=0.8, left=0.8, right=0.8)
    para(left, 'Your Business Name', size=16, bold=True, color=WHITE, first=True)
    para(left, 'Your Name', size=10, color='C7CCE0', before=2)
    para(left, 'City, Philippines  ·  you@email.com  ·  +63 900 000 0000', size=8.5, color='C7CCE0', before=2)
    para(right, 'INVOICE', size=22, bold=True, color=WHITE, align=WD_ALIGN_PARAGRAPH.RIGHT, first=True)
    para(right, 'No. INV-0001', size=10, color=MINT, align=WD_ALIGN_PARAGRAPH.RIGHT, before=2)
    para(right, 'Issued: [Invoice Date]   ·   Due: [Due Date]', size=8.5, color='C7CCE0', align=WD_ALIGN_PARAGRAPH.RIGHT, before=2)
    para(doc, '', after=6)
    bill = doc.add_table(rows=1, cols=1)
    borders(bill)
    widths(bill, [17.8])
    cell = bill.rows[0].cells[0]
    cell_margins(cell, top=0.2, bottom=0.2, left=0.4, right=0.4)
    para(cell, 'BILL TO', size=8.5, bold=True, color=VIOLET, first=True)
    para(cell, 'Client / Company Name', size=11, bold=True, before=2)
    para(cell, 'Client Address', color=SLATE)
    para(cell, 'client@email.com', color=SLATE)
    para(doc, '', after=4)
    items_table(doc, NAVY, WHITE, LINE)
    para(doc, '', after=4)
    totals(doc, NAVY, fill=NAVY)
    payment_block(doc, NAVY)
    save(doc, 'invoice-classic')


def invoice_modern():
    doc = new_doc(margin_cm=1.0)
    table = doc.add_table(rows=1, cols=2)
    borders(table)
    widths(table, [5.8, 12.8])
    full_height(table, 27.0)
    side, main = table.rows[0].cells
    shade(side, VIOLET)
    cell_margins(side, top=1.0, bottom=1.0, left=0.7, right=0.5)
    cell_margins(main, top=1.0, bottom=0.8, left=0.9, right=0.6)
    para(side, 'INVOICE', size=20, bold=True, color=WHITE, first=True)
    para(side, 'INV-0001', size=10, color=GOLD, before=2, after=10)
    for label, value in (('Issued', '[Invoice Date]'), ('Due', '[Due Date]')):
        para(side, label.upper(), size=8, bold=True, color='DDD6FE', before=4)
        para(side, value, size=10, color=WHITE)
    para(side, 'BILL TO', size=8, bold=True, color='DDD6FE', before=14)
    para(side, 'Client / Company Name', size=10, bold=True, color=WHITE)
    para(side, 'Client Address', size=9, color='EDE9FE')
    para(side, 'client@email.com', size=9, color='EDE9FE')
    para(side, 'PAYMENT', size=8, bold=True, color='DDD6FE', before=14)
    para(side, 'Bank Name', size=9, color=WHITE)
    para(side, 'Your Name', size=9, color=WHITE)
    para(side, '0000 0000 0000', size=9, color=WHITE)
    para(side, 'GCash 0900 000 0000', size=9, color=WHITE, before=3)
    para(main, 'Your Business Name', size=16, bold=True, color=INK, first=True)
    para(main, 'Your Name  ·  City, Philippines', size=9.5, color=SLATE, before=2)
    para(main, 'you@email.com  ·  +63 900 000 0000', size=9.5, color=SLATE, after=14)
    inner = main.add_table(rows=1 + len(ROWS), cols=3)
    borders(inner, color=LINE, size=4, inside=False)
    widths(inner, [6.6, 1.6, 3.4])
    for cell, label in zip(inner.rows[0].cells, ('Description', 'Qty', 'Amount')):
        shade(cell, LAVENDER)
        cell_margins(cell, top=0.15, bottom=0.15, left=0.2, right=0.2)
        para(cell, label, size=9, bold=True, color=VIOLET, first=True, align=WD_ALIGN_PARAGRAPH.LEFT if label == 'Description' else WD_ALIGN_PARAGRAPH.RIGHT)
    for row, values in zip(inner.rows[1:], ROWS):
        for index, (cell, value) in enumerate(zip(row.cells, (values[0], values[1], values[3]))):
            cell_margins(cell, top=0.2, bottom=0.2, left=0.2, right=0.2)
            para(cell, value, size=9.5, first=True, align=WD_ALIGN_PARAGRAPH.LEFT if index == 0 else WD_ALIGN_PARAGRAPH.RIGHT)
    para(main, 'Subtotal   ₱X,XXX.00', size=10, align=WD_ALIGN_PARAGRAPH.RIGHT, before=10)
    para(main, 'Tax (if any)   ₱0.00', size=10, align=WD_ALIGN_PARAGRAPH.RIGHT)
    para(main, 'Total due   ₱X,XXX.00', size=14, bold=True, color=VIOLET, align=WD_ALIGN_PARAGRAPH.RIGHT, before=4)
    para(main, 'Payment terms: due within 7 days of the issue date. Thank you for your business.', size=9, color=SLATE, before=18)
    save(doc, 'invoice-modern')


def invoice_compact():
    doc = new_doc(margin_cm=1.7)
    top = doc.add_table(rows=1, cols=2)
    borders(top)
    widths(top, [11.0, 6.6])
    a, b = top.rows[0].cells
    para(a, 'Your Business Name', size=14, bold=True, first=True)
    para(a, 'Your Name  ·  City, Philippines', size=9, color=SLATE, before=2)
    para(a, 'you@email.com  ·  +63 900 000 0000', size=9, color=SLATE)
    para(b, 'Invoice INV-0001', size=14, bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT, first=True)
    para(b, 'Issued [Invoice Date]  ·  Due [Due Date]', size=9, color=SLATE, align=WD_ALIGN_PARAGRAPH.RIGHT, before=2)
    rule(doc, color=INK, before=6, after=6)
    para(doc, 'BILL TO', size=8.5, bold=True, color=SLATE)
    para(doc, 'Client / Company Name  ·  Client Address  ·  client@email.com', size=10, before=2, after=8)
    rows = ROWS + [('Service or deliverable', '1', '₱X,XXX.00', '₱X,XXX.00')] * 4
    items_table(doc, 'F1F5F9', INK, LINE, rows=rows, size=9)
    para(doc, '', after=4)
    totals(doc, INK)
    payment_block(doc, INK)
    save(doc, 'invoice-compact')


if __name__ == '__main__':
    for build in (resume_sidebar, resume_header, resume_minimal, portfolio_spotlight, portfolio_grid, portfolio_story, proposal_tiers, proposal_one_page, proposal_letter,
                  invoice_classic, invoice_modern, invoice_compact):
        build()
