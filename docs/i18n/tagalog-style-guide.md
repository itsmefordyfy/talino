# Talino in Tagalog: style guide and glossary

Every Tagalog string, lesson, message and prompt in Talino follows this guide, so the app sounds like
one friendly Filipino learning companion and not a translation engine. The owner's brief (2026-11-14):
natural, modern, conversational Filipino; Taglish where it helps; English technical terms kept.

Language code in the app: `fil` (shown to learners as **Tagalog**). A phone set to Filipino (`fil`) or
Tagalog (`tl`) starts in Tagalog.

## Two registers: UI labels vs. everything else (owner, 2026-11-14)

- **UI labels are short, familiar and easy to scan**: screen titles, headings, tab and menu names, buttons, section headings, status labels, form labels,
  chips, notification titles. Filipino users already say these in English in every app, so **keep the English word when it is shorter, clearer or what
  people expect**, and use Tagalog only when it is just as short and natural. Never lengthen a label to avoid an English word.
  Examples (not mandatory, judge each by context): Home, Explore, Continue, My Courses, Search, Settings, Profile, Progress, Achievements, Start,
  Try again, View all, Save, Cancel, Submit, Next, Back, Done, Learning Path. Prefer one or two words. A button or tab should fit on one line on a small
  phone: `src/lib/ui-labels.test.ts` enforces it (a label of 20 characters or fewer may be at most 4 characters or 35% longer in Tagalog, and never more than
  22 characters). Abbreviate only when the meaning is obvious.
- **Everything else stays natural and complete**: descriptions, explanations, empty-state text, errors, reminders, Tali's lines and all lesson content are
  conversational Filipino/Taglish, in full sentences, as described above. The brevity rule is only for labels.
- Technical terms stay English: coding, AI, prompt, debugging, app, website, database, API, dashboard, deployment, quiz, lesson.
- Labels carry the same meaning as the English; an accessibility label (screen reader) may be longer and clearer than the visible text.

## Voice

- Talk like a friendly kuya/ate who is also a developer, not like a textbook or a government form.
  Warm, short, encouraging, a little playful. Never childish, never preachy, never stiff.
- Address the learner as **ka / mo / ikaw** ("Natapos mo na…", "Kaya mo 'yan!"). Do not use "po"
  or "ninyo" in Tali's voice or in the interface (it is a peer, not a clerk). Exception: legal or
  error text that must be neutral may drop the pronoun.
- Use **natin / tayo** when Tali learns along ("Simulan na natin!", "Tara, tingnan natin").
- Common, spoken Tagalog: *ayos*, *galing*, *sige*, *tara*, *okay lang 'yan*, *kaya mo 'yan*, *naku*
  (rarely). No deep or archaic Tagalog (no *pagsulong*, *kasanayan sa pagkatuto*, *nakumpleto*,
  *matagumpay*, *paglalakbay sa pag-aaral*).
- Prefer a short natural sentence to a literal one. Change the sentence shape when the English shape is
  unnatural in Tagalog. Keep the same meaning, the same facts, the same level of detail.
- Contractions as people write them: *'yan, 'yon, 'to, sa'yo, ko'y, di, hindi pa*. Use `'` (straight or
  curly, match the surrounding file; the English tables use the curly `’`).
- Exclamation marks are fine for celebration, but not on every line. Errors are calm, never scolding.
- Numbers, dates, currency, code and URLs are not translated. "3 of 5" → "3 sa 5".

### Examples (the owner's own)

| Avoid | Use |
|---|---|
| Simulan ang iyong paglalakbay sa pag-aaral. | Simulan na natin ang pag-aaral! |
| Matagumpay mong nakumpleto ang aralin. | Ayos! Natapos mo na ang lesson! |
| Subukan muli ang iyong sagot. | Subukan mo ulit! |
| Tingnan ang iyong progreso. | Tingnan kung gaano na kalayo ang narating mo! |
| Hindi tama ang iyong sagot. | Hindi pa iyan ang tamang sagot. Subukan natin ulit! |

Tali: "Hello! Ready ka na bang matuto ng bago?" · "Tara, simulan natin ang lesson!" · "Nice! Tama ang
sagot mo!" · "Okay lang 'yan! Alamin natin kung saan nagkamali." · "Galing! One step closer ka na sa
goal mo!" · "May hint ako para sa'yo. Subukan mo ito!"

## Taglish rules

Taglish is the natural register for learning tech in the Philippines, so use it on purpose:

- **Keep in English** (never translate): programming and software terms and the names of things:
  variable, function, loop, array, object, class, string, boolean, database, query, table, API, endpoint,
  request, response, server, client, framework, library, package, component, props, state, hook, route,
  repository/repo, commit, branch, pull request, merge, deploy/deployment, debug/debugging, bug, error,
  test, code, script, terminal, command, prompt, token, model, AI, artificial intelligence, machine
  learning, LLM, Authentication, authorization, SQL, JSON, HTML, CSS, JavaScript, Python, Git, GitHub,
  Expo, React, Tali, Talino, ChatGPT, Claude, Gemini, résumé/CV, portfolio, freelancer, VA,
  Upwork, LinkedIn, README, URL, link, email, app, website, notification, streak, XP, level, badge,
  certificate (see glossary: use English for the app-feature words learners see on other apps too).
- **Everyday words** are Tagalog: learn, finish, try again, next, back, save, delete, settings,
  progress, help, today, tomorrow, questions, answers, steps (see glossary).
- Mixing inside one sentence is natural: "Ang variable ay parang lalagyan ng impormasyon." / "I-save mo
  muna ang code bago mo i-run."
- **Verbs from English** take Tagalog affixes with a hyphen: *i-save, i-run, i-copy, mag-deploy,
  nag-debug, i-commit, i-push, mag-install, i-click, i-tap, mag-login*. Never glue without the hyphen
  and never conjugate by hand in strange ways: use the verb as *i-/mag-/nag-/mag-* + English stem.
- Do not translate a term into an awkward Tagalog coinage (*talaan ng datos*, *salalayan*, *pag-aayos ng
  kamalian*). If the English term is what a Filipino developer says out loud, keep it.
- First time a concept appears in a lesson, explain it in plain Tagalog in the same sentence or the next
  ("Ang variable ay parang lalagyan ng impormasyon. Maaari mong gamitin ito para mag-store ng pangalan,
  edad, o iba pang data sa iyong program.").
- Be consistent inside one lesson: do not call the same thing *function* in one paragraph and
  *tungkulin* in another. Use the glossary.

## Glossary (use these exact choices everywhere)

| English | Tagalog / Taglish in Talino | Notes |
|---|---|---|
| lesson | lesson | keep English (learners say "lesson") |
| course | course | keep |
| quiz | quiz | keep |
| question / answer | tanong / sagot | |
| correct / incorrect | tama / mali ("hindi pa tama") | gentle: "Hindi pa iyan ang tamang sagot." |
| try again | Subukan mo ulit | |
| hint | hint | keep |
| explanation | paliwanag | |
| exercise / practice | practice / pagsasanay | "practice" in buttons; "exercise" as "exercise" |
| activity | activity | keep |
| project | project | keep |
| progress | progress | keep ("Tingnan ang progress mo") |
| skills | skills | keep |
| streak | streak | keep ("7-day streak") |
| badge | badge | keep |
| certificate | certificate | keep |
| coach | coach | "AI career coach" stays; Tali = "ang coach mo" |
| career | career | keep |
| job application | job application | keep |
| proposal | proposal | keep |
| interview | interview | keep |
| reminder | paalala / reminder | "paalala" in sentences, "Reminder" for the setting label |
| notification | notification | keep |
| settings | Settings | keep (tab/menu); "mga setting" in prose |
| profile | profile | keep |
| name | pangalan | |
| goal | goal | keep |
| level | level | keep |
| free | libre | "Libre" for price labels; "free" never alone |
| buy / purchase | bilhin / purchase | "Bilhin", "Mga purchase" |
| restore purchases | I-restore ang mga purchase | |
| subscription / All-Access | subscription / All-Access | keep brand term |
| day | araw | "Day 3" → "Araw 3" in lesson lists; "day streak" stays |
| today / tomorrow / yesterday | ngayon / bukas / kahapon | "Today" tab → "Ngayon" |
| minutes | minuto / min | "15 min" |
| done / finished | tapos na / natapos | "Tapos na!" |
| continue / next | Magpatuloy / Susunod | buttons: "Tuloy" / "Susunod" |
| back / close / cancel | Bumalik / Isara / Kanselahin | back button: "Bumalik" |
| save / delete / edit | I-save / Burahin / I-edit | |
| share / copy | I-share / I-copy | |
| search / filter / sort | Maghanap / I-filter / Ayusin ("I-sort") | |
| loading | Nilo-load… | |
| error / something went wrong | may problema / Nagkaproblema | "Nagkaproblema. Subukan ulit mamaya." |
| offline / online | offline / online | keep |
| internet connection | internet | |
| data | data | keep |
| on this phone | sa phone na ito | |
| learn | matuto / mag-aral | |
| teach | magturo | |
| learner (the user) | ikaw (second person); "learner" in third person | |
| mentor | mentor | |
| mock interview | mock interview | keep |
| résumé | résumé | keep |
| freelancing | freelancing | keep |
| virtual assistant | virtual assistant (VA) | keep |
| beginner / intermediate / advanced | beginner / intermediate / advanced | keep |
| Tali (the coach) | Tali | never translated |
| Today / Courses / Tali / Career / Me (tabs) | Ngayon / Courses / Tali / Career / Ako | |

## Content (lessons, quizzes, activities)

- Translate prose: paragraphs, headings, list items, tips, warnings, key takeaways, quiz questions,
  choices and explanations, activity titles, prompts, hints, stories, scenario text, project steps,
  rubric items.
- **Never translate or alter**: code, commands, file names, identifiers, API names, URLs, regular
  expressions, SQL, JSON, expected program output, numbers that are answers, ids, `kind`/`type`/`language`
  fields, `answer` indexes, `correct`/`quality` flags, `tests`, `solution`, `starter`, `setup`, `expected`,
  `bank`, `blanks.answers`, `choices` of a *predict-output* activity (they are program output), `bugLine`,
  `minutes`, `unlockAfterDay`, dates, source links.
- **Prompts for an AI assistant** (the `prompt` block, "paste this into ChatGPT"): translate the
  prompt into Tagalog/Taglish too, because a Tagalog learner will paste it and read the answer. Keep any
  placeholder in `[BRACKETS]` or `{braces}` exactly.
- Keep `**bold**` and `` `inline code` `` markers exactly; translate the words inside bold, keep code
  inside backticks as it is.
- Do not shorten. Do not drop an important explanation. Same number of blocks, same order, same quiz
  questions, same choices order, same hints count.
- Keep difficulty and meaning. Facts stay technically accurate. If a fact depends on a product, keep
  the product name and the date as in English.
- Filipino context in examples (peso, Grab, Jollibee, Lazada, GCash) is welcome; keep it as the English
  has it.

## Tali (the companion)

Tali is a young developer learning alongside the student. In Tagalog she sounds like a friendly
Filipino study buddy: "Hi! Ready ka na bang matuto ng bago?", "Tara, simulan natin ang lesson!". She
encourages without giving the answer away, celebrates without overdoing it, and uses Taglish for tech.
Her mood names (happy, thinking…) are not translated.

## Checks before you finish a Tagalog file

1. Read it aloud as a Filipino student: does it sound like something a friend would say?
2. No leftover English sentences (only the technical terms above, names and code).
3. Same keys, same shape, same placeholders (`${name}`, `{n}`), same number of list items as English.
4. Glossary terms are consistent across the file.
5. Grammar and spelling: *ng / nang*, *sa / kay*, *may / mayroon*, *rin / din*, *pa / na*, hyphen with
   English verbs, 'yan/'yon/'to spelled the same way everywhere.
