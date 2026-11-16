# Mock interview (design)

Owner's brief, 2026-11-15/16: a conversational AI mock interview where Tali or Tala interviews the learner one question at a time,
adapting to what they say, then scores the interview and explains the score. A new tool in the Career tab's Tools row. Text first;
voice is a later phase.

## What the learner gets

1. **Career → Tools → Mock interview** (also: a job application's Practise button and its evening-before reminder; the résumé
   screen's "Practise an interview" row).
2. **Setup:** position (any title), interview type (9), experience level (5), difficulty (3), interviewer style (5), length
   (quick 4 / standard 7 / full 10 main questions), interviewer (Tali or Tala), an optional pasted job description, and a switch
   for using the résumé and portfolio. Opens pre-filled to repeat an interview or to practise past weak questions.
3. **The interview:** a chat. The interviewer opens, asks one question, reads the answer and either follows up on exactly what was
   said or moves on. A progress bar counts main questions. Pause keeps the place; End asks for the evaluation of what was answered.
   Every message is saved as it happens, so closing the app loses nothing; an answer the interviewer never replied to can be sent again.
4. **The evaluation (the score):** overall score out of 100 with a plain rating (Excellent 85+, Good 70+, Getting there 50+, Needs
   improvement below), a score and a reason for nine categories, the strongest and weakest answers, every answer next to a stronger
   version, skills to improve with the Talino courses that teach them, next steps, and the whole transcript. A repeat of the same
   position shows how each category moved.
5. **History:** past interviews, an unfinished one to continue, and a progress card (latest score, change, last eight scores).

## How it works

- **Server:** `src/app/api/interview+api.ts` (Gemini through the same infrastructure as `/api/coach`: key, model chain, global cost
  cap, RevenueCat plan check). Modes `turn` and `report`. The instructions are built on the server (`lib/prompt.ts`) from the
  checked setup (`sanitizeSetup`), so a modified app can't rewrite them. The résumé, job description and every answer are shown
  to the model as data.
- **A turn is structured** (`TURN_SCHEMA`): `reply`, `kind` (opening / question / follow_up / comment / closing), `topic`, `notes`.
  `kind` drives the progress bar and tells the model to move on after two follow-ups; the closing ends the interview. `notes` is the
  model's own running memory of the answers: only the last 14 messages are sent with a turn, the notes carry the rest, so a long
  interview doesn't lose what was said early on.
- **The score is earned and explained** (`lib/report.ts`): the overall is the average of the category scores (never a separate
  number), an answer's verdict follows its 1-5 score, an answer with no reason is dropped, feedback pointing at an answer that
  doesn't exist is dropped (not clamped onto another), a recommended course that doesn't exist is dropped, and fewer than two
  answers is refused (`too_short`) instead of scored. The "confidence" category is read from the words only and says so.
- **Honesty about the learner:** the prompts forbid assuming experience, employers, skills or qualifications that aren't in the
  profile; the stronger answers use only what the learner said, with `[placeholders]` where they must add something real.
- **Allowance:** `lib/limits.ts`: an interview is counted once, on its opening, in `ai_chats` under the app name `talinointerview`
  (no new SQL: the shared function accepts any 3-20 letter name). Free 1 new interview per rolling 24 h, any purchase 10 (server
  variables `INTERVIEW_FREE_DAILY_LIMIT` / `INTERVIEW_PRO_DAILY_LIMIT`). Answers and the evaluation of an interview already begun are
  free; a failed call gives the interview back. Max 40 answers per interview.
- **On the phone only:** migration v-last adds `interviews`, `interview_messages`, `interview_reports` (SQLite, the same private
  treatment as Tali's chats): not in the backup (`EXCLUDED_TABLES`), not synced, cleared by Delete all data. Nothing is stored on
  a server except allowance ids and counts. Talino has no accounts, so "associated with the authenticated user" is: this phone, plus
  the RevenueCat customer id and device id the allowance already uses.
- **Language:** each interview has a `language` and a `companion` in its setup. The server holds the conversation in Tagalog when
  asked. The app's Tagalog is switched off (`TAGALOG_ENABLED`), so the picker stays hidden and the interface text is English only
  (owner: no new Filipino text).

## Voice (next phase, not built)

The architecture is ready for it: a turn is plain text in, plain text out, and the answer box is one component.
- **Speech to text:** record with `expo-audio` (installed; needs the microphone permission string added in `app.json`), send the audio
  to a server mode that asks Gemini to transcribe it (Gemini accepts audio as inline data), and put the text in the same `send`.
- **The interviewer's voice:** `expo-speech` (the phone's own voice) reads the reply today for free. Kokoro recordings are
  pre-made for lessons, so they cannot speak new text. A server-side voice would be a new paid service and needs the owner's say-so.
- **A true real-time voice call** (Gemini Live) needs a WebSocket and short-lived tokens that this server doesn't have. Text-to-speech
  alone is not that, and the first voice release should say it is "speak your answer, hear the question", not a live call.

## Not built / limits

- Courses are recommended, not individual lessons (the catalogue is 580 lessons; the course list fits in the prompt, the lesson
  list doesn't).
- Interviews are not in the iCloud / file backup (private, like Tali's chats): a new phone starts with no history.
- The hosted route (`carmind.expo.app`-style host for Talino) must be redeployed with EAS Hosting before a release build can reach
  `/api/interview`.
- Tests: `src/features/interview/**` (logic, repo, components), `src/lib/server/interview-route.test.ts`, and the opt-in
  `interview.live.test.ts` (`LIVE_INTERVIEW=1`, spends the owner's Gemini key).
