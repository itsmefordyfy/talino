# Tagalog review notes

Written 2026-11-14 with the first Tagalog pass. Claude wrote every Tagalog string and lesson (voice: `tagalog-style-guide.md`),
checked them by machine (shape, protected fields, leftover English, banned stiff words) and by reading, but **no native speaker
has reviewed them yet**. Have a Filipino developer or teacher read the app once, and settle the items below.

## Decisions to confirm

- **Language code and name:** stored as `fil`, shown as "Tagalog". **Tagalog is the default for every fresh install** (owner, 2026-11-14), with English one tap away on the welcome screen and in Settings.
- **No "po"**: Tali and the interface speak to the learner as a peer ("ka/mo"). Say so if a more respectful register is wanted.
- **`kuwento` / `kwento`**: the app mixes both (`adventure.storyLabel` is "Ang kwento"). Pick one.
- **Game ranks and badge names stay English** (Bug Hunter, Logic Master, Code Explorer, Talino Master...) as game titles.
- **Public pages stay English:** the certificate page (`/c/<id>`), portfolio page and teacher page, the résumé and cover-letter
  templates, and badge titles on the résumé, because employers read them.
- **Certificate screen:** the document in the app keeps the course title as the English record; the screen's own words are Tagalog.

## Wording a native reader should look at

- Tali: "Gising ka pa pala, Ford!" (late night), "Gets na gets mo 'to." (streak of 3+), "Mahirap 'to, 'no?" (after two misses),
  "Nandito ka na ulit" (welcome back), "mga namali mo" (missed quiz), "Gusto mo bang mag-explore ng bago".
- Lesson intro line "Ang goal natin: ..." assumes objectives start with a verb or an English term.
- `coach.at` / `tomorrowAt`: "ng 3:20 PM", "bukas ng 3:20 PM" ("Babalik si Tali ng 3:20 PM").
- `certificates.completed` / `masterLine` assume the name goes first and the course after it; check the layout and PDF.
- `me.shareMessage` is a rewrite, not a literal translation of the English share text.
- `common.add` "Magdagdag" may be long on small buttons.
- Activity kind names: "Hulaan ang output", "Pagtambalin", "Punan ang mga patlang" ("patlang" is formal; "blank" is the Taglish option).
- `Na-hire`, `Na-apply`, "Sarado" as career stage labels.
- Lesson 1 starter: "Hindi nito lakas ang mga kasalukuyang fact at pribadong kaalaman" (q2 explanation) and the intro `why`
  ("Nakabatay sa malinaw na pagkaunawa...") have unusual word order.
- Starter lesson 3 uses "i-verify" / "ma-verify", "na-expose", "na-leak", "i-anonymise", "mag-disclose".
- Concept Lab: "Dagdagan" / "Bawasan" on the neural-network buttons, "Hagis ng dice", "I-detach ang HEAD", "kapitbahay" for nearest neighbours.
- Weekday summary "tuwing Lun, Miy, sa umaga": check how the UI joins the pieces.

## What is and isn't in Tagalog (2026-11-14)

In Tagalog: all interface text (every `defineStrings` table), Tali's companion lines, Tali's chat and project reviews
(the server prompt tells Gemini to answer in natural Tagalog/Taglish, keep technical terms, keep hints, quizzes and
feedback in Tagalog, and never switch language at random), badges, the course-recommendation quiz, the AI placement check,
level and world names, daily reminders, screen titles, the Concept Lab explainers (all six folders), code-runner and activity
feedback, and the full free **starter course** (7 lessons, quizzes, activities, the laptop tasks and the project).

Still English, and labelled "English lang muna" on the course card, the course page and each lesson: **every other course**
(the five career courses, six mini-courses, the AI-Assisted Development path and the wider catalog, about 5 MB of lesson
text). Tali can explain any of those lessons in Tagalog on request. To translate a course, follow `content/fil/index.ts`.

## ai-coding-beginners (Coding with AI for Complete Beginners, 12 lessons and the project)

Claude wrote it by hand (2026-11-14); no native speaker has read it yet. Please confirm:

- **Loop wording (lesson 1, used in all 12):** the steps stay English as the loop's name ("ask, read, run, fix", matching the diagram, which is code and can't be translated) but become verbs with Tagalog affixes in prose: "**I-ask** mo... **Basahin** mo... **I-run** mo... **i-fix o baguhin** mo". Is "i-ask" (rather than "magtanong") natural for a request to an AI?
- **Plain-words analogies (every lesson, beginner pieces):** builder, texting a friend, recipe card and cook, moving house, tailor, doctor and thermometer, save slots in a video game, order slip, shop window, market stall, house key, recipe notebook. Check they read as everyday Filipino images ("sastre", "kabinet", "palengke", "pwesto", "karatula", "bulletin board sa plaza").
- **Unusual or formal-leaning words:** "bitag" (trap) in lessons 2 and 8, "hudyat" (signal) in lesson 6 advanced, "nakapugad" (nested) for nested tags in lesson 4, "sakuna" (disaster) in lesson 7 `why`, "hayagan" (openly) in lesson 11. Replace if they sound bookish.
- **"Mukhang siguradong-sigurado" / "kumpiyansa":** used for "sounds confident" (lessons 1, 3, 12). Is "kumpiyansa" common enough, or prefer "sigurado"?
- **Written as spoken contractions:** "nagde-decide", "nagve-verify", "magche-check", "nagda-draft". The hyphen after the prefix follows the style guide; confirm the spelling of "nagde-decide" / "magde-decide" (decide + affix) and "ma-verify" / "i-verify".
- **Commit messages and prompts are in Tagalog** (lesson 7 "Unang version ng page", the prompts the learner pastes). The AI's example reply (lesson 3's page, which is code) stays English, so a learner who pastes the Tagalog prompt may get a Tagalog page; that is fine for the lesson but the sample code shows English text. Say if the prompt should ask for English page text.
- **Scenario options that are prompts** (lessons 3, 5, 6) were translated into Taglish ("Gawan mo ako ng website para sa bike shop ko."). Check they sound like what a real person would type.
- **Product and UI names left English on purpose:** the GitHub, Google Forms, Chrome and ChatGPT button/menu names (New repository, Upload files, Settings, Pages, Inspect, Console, "Improve the model for everyone", Temporary Chat), and the two follow-on course names in lesson 12 ("Build a Website with AI", "Prompt Engineering for Software Development") because those courses are not translated yet.
- **Source link labels** (the dated version notes) are Tagalog renderings of the official pages' English titles ("MDN: Paggawa ng content ng una mong website"); the urls are unchanged. Check they don't read oddly.
- **Arrange activities keep English steps** (lessons 3, 7, 10, 12): the parity checker protects an arrange activity's `solution`/`alternatives` lines (they are code in the other courses), so only the prompt, reasons, hints and explanation are Tagalog. A Tagalog learner sees English step cards to reorder. Likewise the **predict-output choices** in lessons 3, 5 and 9 ("Only What we sell", "Both lines", "a mix of blue and green"). This needs a decision on the checker (see the handover report), not a wording fix.
- **Level pieces (beginner / intermediate / advanced blocks, quiz questions, task extras, project steps and rubric items) are translated in the lesson files but not registered yet**, because the parity checker only compares the shared part. See `content/fil/ai-coding-beginners.ts` (`INCLUDE_LEVEL_PIECES`). The advanced pieces are the densest Taglish (diff, blast radius, invariant, hypothesis, specificity): check they stay readable.
