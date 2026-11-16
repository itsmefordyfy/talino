# Career kit templates

`assets/career-kit` holds the 15 template files the app bundles and lets a Pro learner download: résumé, portfolio, proposal and invoice as Word (`.docx`),
the case-study deck as PowerPoint (`.pptx`), three looks each. They open and edit in Word, Pages, Google Docs, Canva, PowerPoint, Keynote and Google Slides.

They are generated, so a change to the text or the layout is a change to a script, then a regenerate (not a hand edit of a binary):

```bash
python3 -m venv /tmp/kitvenv && /tmp/kitvenv/bin/pip install python-docx python-pptx     # one time
/tmp/kitvenv/bin/python scripts/career-kit/generate_docs.py     # the 12 Word files
/tmp/kitvenv/bin/python scripts/career-kit/generate_decks.py    # the 3 PowerPoint files
```

Rules the files follow: Arial (every one of those apps has it), only normal editable paragraphs and tables (no text in images), placeholder text only,
Talino's colours, Philippine pesos (₱), A4 for documents and 16:9 for slides. A new look needs its file name (`<prefix>-<look id>.docx|pptx`), an entry in
`src/features/career-kit/content.ts` and a `require` line in `files.ts`; `content.test.ts` fails if the three disagree.

Checked here only with macOS Quick Look (it ignores some table widths). Open each file in Word, Pages and Google Docs once after changing a generator.
