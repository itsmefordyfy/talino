# Generative AI: From Fundamentals to Real-World Applications: status (2026-11-17)

**State: written, registered, wired and passing its checks in code; the live lab engine is built and tested with a fake Gemini only. Never run against live Gemini, never seen on a device, not narrated.**
Design: `docs/superpowers/specs/2026-11-17-generative-ai-course-design.md`. Writer brief: `docs/content/GENAI_BRIEF.md`. Engine: `docs/content/GENAI_ENGINE.md`.

## What exists
- Course `generative-ai-applications` (beginner, category `ai-coding-fundamentals`): **12 modules, 67 lessons, 4 projects, 346 quiz questions, 68 "AI in Action" demos, 7 dated `version` notes**.
  Lesson `minutes` add up to about 25.6 hours (the brief estimated 15-20; the lessons are fuller than the estimate, the number is the sum of their own estimates, projects not counted).
  Modules: 1 Introduction (5), 2 How it works (6), 3 Prompt engineering (7), 4 Image generation (5), 5 Video and audio (5, P1), 6 Multimodal (5), 7 RAG (6, P2), 8 Agents (6),
  9 Business (5, P3), 10 Building apps (6, P4), 11 Responsible AI (6), 12 Real world and future (5).
  Projects: P1 AI Content Creation Studio (opens after day 28), P2 AI Knowledge Assistant (39), P3 AI Business Automation (50), P4 AI-Powered Application (56). Each carries Objectives, Required tools,
  Guided prompts, Deliverables, Evaluation criteria and Common mistakes as steps, a text submission, a rubric with extras per level, and `practiceItemIds` (the labs its steps use).
- Activities in lessons: 54 prompt labs, 16 workflow builders, 61 scenarios, 41 match, 21 arrange, 19 tap-reveal, 2 fill-blank.
- **54 prompt labs** (`practice/labs/module-01..12.ts`): text-generation 13, structured-output 12, document-analysis 12, classification 7, summarization 4, playground 3, tool-use 3. Comparison labs: 7 `compare: 'prompts'`
  and 2 `compare: 'models'` (1.3, 12.3). All material is fictional; image, audio and video labs work on text a tool extracted or on the text of a prompt/script (nothing live is generated in those media).
- Files: `catalog/syllabus-genai.ts`, `catalog/courses/generative-ai-applications.ts` + `generative-ai-applications/module-01..12.ts` + `skills.ts` (10 skills: modules 1-2 share `genai-foundations`, 4-5 `genai-media`),
  `catalog/genai-module.test.ts` (per-module check `CHECK_GENAI_MODULE=n`, `CHECK_GENAI_MIN_LABS`; whole course `CHECK_COURSE=generative-ai-applications npx jest check-one`), `practice/labs/`.
- Wiring: registered (`registered.json`, `courses.generated.ts`, `course-index.data.ts`), cover (`neural`, violet), world "The Spark Studio", learning path `generative-ai` ("Generative AI for Everyone", with prompt engineering, choose-an-AI-tool
  and AI engineering basics), a **side, late-addition** journey milestone "Generative AI, in practice" in Beginner (the road to the AI Expert certificate is unchanged), What's New item `generativeAi`, store texts, Kokoro scripts
  exported (`scripts/audio/out/genai-lessons.txt`, 67 lessons, 480,913 characters, about 8.9 hours per voice) and `scripts/audio/run-genai.sh`.
- New learning features (details in the design and the engine doc): `prompt-lab` activity (Prompt Playground, Experiment Lab, Model Comparison; live), `workflow-builder` activity (local rules, labelled simulated run), `demo` lesson block (always badged
  "Illustration"), four visuals (`ai-context-window`, `ai-prompt-anatomy`, `ai-image-prompt-builder`, `ai-agent-loop`), Tali/Tala (`coach/lib/gen-ai.ts`, labs and workflows through public fields only, "Lab results" block in the project review).
- Persistence: **no migration**. Lab sessions use `practice_sessions` / `practice_messages` (`kind: 'prompt-lab'`); activity progress, quiz results, project submissions and XP use the existing tables.

## Checked
tsc clean; eslint clean on the touched areas; whole-course and per-module checks pass; full `npx jest`: 4,056 pass, 3 fail, none from this work (`ui-labels` Tagalog labels; `strings-parity` `activityStrings` and `storeStrings`, already failing before). Android bundle export: see the report.

## Not done, and why
- **Tagalog / Taglish: none written** (standing owner rule, `TAGALOG_ENABLED` false, Kokoro has no Filipino voice). Tali/Tala's instructions still say to answer in Taglish when the learner writes it (behaviour, not authored text).
- **Kokoro recordings not generated** (scripts exported; `nohup caffeinate -i scripts/audio/run-genai.sh > scripts/audio/out/run-genai.log 2>&1 &`; upload is the owner's). The phone's own voice reads lessons until then. Gemini TTS was not used.
- **No live Gemini call was made** (the owner's prepaid key): lab runs, reviews, tool-use rounds, JSON replies and the model-comparison tiers are tested with a fake only. The hosted `/api/practice` must be redeployed with EAS Hosting. The "Model A (smaller tier)" label is only as true as the order of `GEMINI_MODELS`.
- **Image, video and audio are not generated in the app**: those lessons teach concepts and workflow honestly, the exercises run in the learner's own tools, and the labs work on text.
- **Not seen on a screen:** the lab screen, the workflow builder, the demo block, the four visuals, the course page, journey milestone, Android, web, dark mode, VoiceOver (no dev client was installed on the simulator and no taps are possible here).
- **Content was checked by structure rules and read by its writers, not reviewed by a person.** A subject-matter review is advisable. Unsourced hedged statements the writers flagged: tokens per word, "details in the middle of long inputs are used less reliably", the Philippines' national privacy law and commission (lesson 59),
  "Hugging Face is a place where people publish and share models", memory features storing text. Version notes (module 1, module 10) were read from the vendors' pages on 2026-11-17 and can change. Quiz answer lengths were rebalanced to pass the "longest answer" rule; some quizzes may read unnaturally.
- Lesson length: shared teaching runs about 750 to 1,450 words (brief: 600 to 1,000), longest in lessons 55, 62 and 67.
- Learning-path goals: the course lists `learn-ai-dev` and `freelance`; the recommendation tests pass, but its rank for a real learner was not looked at.
