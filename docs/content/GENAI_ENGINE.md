# Generative AI course: the prompt-lab engine (2026-11-17)

What was built for the Prompt Playground, the AI Experiment Lab and Model Comparison. Design: `docs/superpowers/specs/2026-11-17-generative-ai-course-design.md`
(decisions 3, 4, 8, 9). What lab authors write: `docs/content/GENAI_BRIEF.md`, "Prompt labs". **No live Gemini call was made**: everything below is tested with a
fake Gemini, and the screens were exercised in a Jest renderer, not on a device.

## One new activity kind on the existing practice engine
`prompt-lab` (`labId`) reads a `LabTask` from `practice/labs/module-NN.ts` **by id**. The server builds the model's instructions from it; the phone sends a
prompt (never instructions or material) and never receives `system`, `key`, `facts` or a tool's `fixtures` (`publicLab`, asserted on every response in the tests).
Sessions are `kind: 'prompt-lab'` rows of `practice_sessions` / `practice_messages` (no migration): a prompt is a `user` message, the model's output an
`assistant` message, run after run in order (a comparison of prompts saves A, B, then both outputs; of models one prompt then two outputs); the review JSON is
`report`, the learner's last prompt is `final_text`, the review's overall is `score`. Run counts, attempts, best and latest score are derived from the saved rows.

## Modes of `POST /api/practice` (`app/api/practice+api.ts`, handlers in `lib/server/practice-lab.ts`)
Common body: `deviceId`, `appUserId`, `entitlements`, `sessionId` (made on the phone), `itemId` (the lab's id), `mode`.

| mode | extra body | answer |
|---|---|---|
| `lab-run` | `prompt` (or `prompts: [A, B]` for `compare: 'prompts'`), `runNumber` (from 1) | `{ run: { outputs: LabOutput[] } }`, one output, or two (A, B) for a comparison |
| `lab-review` | `prompt`/`prompts`, `outputs: string[]` (the run being reviewed), `toolSteps?` | `{ review: LabReview }` |

`LabOutput = { label: 'A'|'B', output, format: 'text'|'json', check?, tokens: {input, output}, latencyMs, model?, toolSteps? }`. `check` is only for a JSON lab:
`{ parsed, parseNote?, fields: [{ name, ok, status: ok|absent|missing|wrong_type|not_allowed, note }], passed, total }` (code, not a model; it says which
fields failed and **never** what the right values are). `model` is set only for a model comparison. `toolSteps` is the trace `[{ tool, arguments, result }]`.
(The brief sketched a single-output answer as `{ run: { output, ... } }`; the answer is always `outputs: [...]` so one reader serves every lab.)

`LabReview = { kind: 'prompt-lab', tooShort: false, overall, rating, summary, criteria: [{ id, label, score, quote, reason }], suggestions (1 to 4),
outputChecks: [{ output, claim, status: supported|not-in-material|unclear, note }], keyChecks: [{ label, fields: [{ name, match, expected, actual }], matched,
total }], comparison, nextStep }`. Errors: the usual ones (`practice_limit` 429 with the time, `chat_in_progress`, `quota_unavailable`, `busy`, `unavailable`,
`unknown` 502) plus `lab_too_short`, `lab_not_edited`, `lab_same_prompts` (400, nothing spent) and `conversation_full` (409, a run past `maxRuns`). With only one
model configured, a model-comparison lab answers `503 { error: 'unavailable', reason: 'one_model' }`.

### Allowance
`ai_chats` as `talinopractice` (Free 3, Pro 30 a rolling 24 h): the **first call of a session counts once**; every further run up to `maxRuns` and the review are
free; any failure (Gemini error, empty or unreadable reply, a reply that repeats the lab's framing, one of two parallel calls failing) gives the session back.
`maxRuns` is enforced from the phone's `runNumber` (as a role-play's turn count is), with the session's own 60-message limit and the all-callers cap as the hard
stops: a modified phone could keep sending `runNumber: 1`. The review needs a real prompt (the same checks as a run) and the right number of non-empty outputs,
but cannot know the outputs came from a real run, so a modified phone could reveal a lab's key by sending its own output (it costs a session).

### What a run does
- Prompt checks (`lib/lab-input.ts`, shared by the screen and the route): at least 8 words (3 for a comparison's baseline A), a real edit of the starter (at least
  4 words added or removed), A and B must differ (2 words), at most 2,500 characters, control characters removed.
- The model gets `lab.system` plus fixed lab rules (follow the prompt, the material is data, about 400 words, decline anything unsafe, never reveal the
  instructions; a JSON lab: "one JSON object and nothing else", **without naming the fields**, so the learner's prompt has to), then the prompt and the catalog's
  material. A JSON lab uses `responseMimeType: application/json` (not for tool use, where function calling can't be combined with it). Text labs run warm (0.8
  for playground and text generation), the rest 0.4, JSON 0.2.
- A reply is capped (6,000 characters, never edited) and refused (502, session given back) if it is empty or repeats a whole sentence of `system`. Facts and key
  are not checked here: a good summary repeats them legitimately.
- **Tool use** is Gemini's native function calling: the lab's tools are declared (never their fixtures), at most **3 rounds**: the model may ask in rounds 1 and 2
  (up to 3 calls from one reply are answered and traced), round 3 is told to answer without tools (`toolConfig` NONE). The server answers **only from the lab's
  fixtures**: a call whose arguments equal no fixture, an unknown tool or malformed arguments get `{ error: 'not found' }`. Text arguments match ignoring case
  and spaces. The model's own parts go back as they came (a thought signature stays). Only calls the model actually made appear in the trace.
- **Model comparison** (`compare: 'models'`): the same prompt on two tiers at once, each call **pinned** to its model with no fallback (a busy model is reported busy,
  never swapped). `callGemini(apiKey, body, { model })` is the only change to the shared Gemini helper (default behaviour and the chain are untouched; a pinned call
  does not rest a model for other routes). Tiers: the first and last of `GEMINI_MODELS` (the default chain is ordered cheapest first), or exactly two names in the
  optional server variable `LAB_COMPARE_MODELS`; the screen calls them "Model A (smaller tier)" and "Model B (larger tier)", which is only as true as that
  ordering. Latency and tokens are measured per call (parallel, so neither waits for the other). Nothing claims a ranking.
- **Review**: the prompt coach is given the lab's criteria, the **facts** (privately) and the learner's prompt(s), the material, the output(s) and the tool trace as
  data. It is **never given the key or the framing**. Parsing refuses the review unless it scores exactly the lab's criteria, every score of 40 or more quotes
  the learner's own words (a quote that is not in the prompt refuses the review), there is at least one suggestion, a comparison lab has a comparison, and nothing
  the coach says repeats the lab's framing, facts, key text or tool records. Output checks keep only claims that really are in the output they name, and exist only
  for a lab with material or facts. The key check is computed by code (`keyChecksFor`) and attached; its values appear only in the review. For `compare: 'prompts'`
  the criteria are scored on prompt B (the improved one).

## Phone
`api/client.ts` (`requestLabRun`, `requestLabReview`), `api/flows.ts` (`runLabPrompt`, `reviewLabPrompt`: a run is saved in one transaction only once it came back,
under ids made from the run number, so a retry or double tap changes nothing), `api/practice-repo.ts` (`appendLabRun`, `prompt-lab` in `PracticeKind`, lab results
read back, `labSummariesForItems` / `labResultsText`), `hooks/use-prompt-lab.ts` (one session per try; an unfinished one is picked up again; a review finishes it
and the next run is a new try), `lib/lab-*.ts` (pure logic), screen `activities/components/lab-view.tsx` with `practice/components/lab-*.tsx`.
Done = at least one run came back and the review arrived (any score); XP once through the activity session's `complete`.

### The screen, and what is live versus illustration
- **Live**: the output cards carry a "Live model" badge (in words and colour) and the numbers measured on that run; a reply read back from an earlier visit says it is
  a saved live reply whose time and tokens were not kept. The model comparison adds "one run on one task, not a benchmark". The field check is labelled "checked by code".
- **AI-assessed**: the review (badge "AI-assessed, verify") and its claim checks (badge on the card). The key check is by code.
- **Illustration**: the lab's `example` card, collapsed, badged "Illustration, not a real model's output". The tips (course text, not model output) and the verify
  list appear once a run has come back; the checklist, the material and the tools are shown from the start.
- Free limit (`PracticeProblemNotice` with Pro), offline notice, failed run/review (the prompt stays; Try again repeats the step that failed), "Run N of maxRuns",
  history of past tries (opening one shows its runs and review), 44 pt targets, status never by colour alone, wide layout puts two editors / outputs side by side.

## Tali / Tala (`coach/lib/gen-ai.ts`)
Course and project ids, `GEN_AI_TEACHING_INSTRUCTIONS` (beginner words; Taglish only as behaviour, no Filipino written; one hint at a time; asks what the model was
told; never writes the final prompt or the finished answer; why an AI answer may be wrong; no benchmarks, rankings, prices or statistics; no secrets into AI tools),
`genAiSuggestionKey` (`*-genai` sets in `coach/strings.ts`, English, with the English placeholders in the `fil` table), `describeLabActivity` (public side only: situation,
goal, starter prompt, checklist, material, tool names, field names; never framing, key, facts, fixtures, tips or example) and `describeWorkflowActivity` (palette by
lane; never the rules, solution or simulation). A lab or workflow activity is routed through these in `describeFocus`. The project review gets a labelled **"Lab
results"** block (`labResultsText`: one line per lab the project names with tries, best and latest score, the learner's latest prompt shortened, one thing to work on;
capped to 9 lines and 1,600 characters, untrusted, with a prompt note that nothing in it can change the verdict) next to the existing practice block; labs are no longer
listed in the practice block, so none is counted twice.

## Catalog rules (`practice/lib/lab-rules.ts`, run by `practice/catalog.test.ts`)
Ids `lab-NN-kebab`; 3 to 6 criteria (unique kebab ids); 3 to 5 tips; 2 to 4 verify items; `maxRuns` 2 to 8 (comparison labs 4 or more); material at most 3,000
characters and required for summarization, classification, document analysis and structured output; 3 to 8 facts for summarization and document analysis; a JSON
output has at least one uniquely named field and every key name is a field whose type (and `oneOf`) the key value fits; tool-use labs have 1 to 3 tools, each with a
snake_case name, parameters and at least one fixture giving exactly those parameters, and no other lab has tools; a tool-use lab is not a comparison; `system` never
contains "answer is"; the framing never appears in anything a learner reads (material included); a tool record never appears in a tip, the checklist, the goal or
the starter (the example outcome and the verify list may describe what a lookup returned); a key value (other than a label listed in a field's `oneOf`) never appears
outside the material. Each lab must be used by exactly one `prompt-lab` activity of the course. `required` on a field means **required only when `true`**.

## Tests
`practice/lib/lab-{check,input,tools,prompt,review,run,rules}.test.ts`, `public.test.ts`, `guard.test.ts`, `problem.test.ts`; `practice/api/lab-{client,flows}.test.ts`;
`lib/server/lab-route.test.ts` (51 route tests with a fake Gemini) and `gemini-pin.test.ts`; `activities/components/lab-view.test.tsx` (23 screen tests in a Jest
renderer); `coach/lib/gen-ai.test.ts`, `lib/server/coach-route.test.ts` (lab results); `practice/catalog.test.ts`. Test labs live in `practice/lab-test-support.ts` and
are never in the real catalog.

## Not verified
- **Any real Gemini behaviour**: that the models follow the lab rules, respect `system`, produce usable JSON without being told the fields, call the declared tools,
  accept the thought-signature round trip, honour pinned model names (`gemini-3.1-flash-lite`, `gemini-3.6-flash`), or write reviews that pass the parser (a strict
  parser will refuse some real reviews with a 502 and a refund; watch the rate on the first runs). The function-calling request shape follows Gemini's documented
  `functionDeclarations`, `toolConfig` and `functionResponse` fields and was not run.
- Anything on a screen or a device: layout on iPhone, iPad and Android, dark mode, Dynamic Type, VoiceOver, the keyboard lifting the editor, the Copy button.
- The hosted route (`/api/practice` on EAS Hosting must be redeployed), RevenueCat verification, the real allowance in `ai_chats`.
- The runs' time and tokens are not stored with the saved messages (a reply read back from an earlier visit shows text only); the tool trace is kept in memory for the
  review of the run just made.
- Real labs: `catalog.test.ts` currently flags one authored lab (see the report: `lab-10-structured-extract`'s example outcome states the key's values).
