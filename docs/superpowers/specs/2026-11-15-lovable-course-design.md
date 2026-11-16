# Course: Build Web and Mobile Apps with Lovable (design)

Owner's brief, 2026-11-15: "create course for building web and mobile app using Lovable". Everything below the brief is Claude's call.

## Intent
A beginner course (`build-with-lovable`, `kind: 'standard'`, 13 lessons) that takes someone who has never coded from an idea to an app that is live on the web, works well on a phone, has
real data and sign-in, passes a basic security check, and can be installed from the home screen. It teaches the **tool as the learner uses it** (plan, prompt, review, change one thing at a time,
fix, publish), in line with the direction in `docs/content/WRITING_BRIEF.md`: Talino teaches how to build software with AI, not a framework.

## The honest answer to "mobile" (verified 2026-11-15 on Lovable's own FAQ)
Lovable builds **web applications**; the FAQ says it does not support native iOS or Android apps and "does not generate React Native projects". A phone app comes from (1) making the published web app
**mobile-friendly** and installable as a **PWA**, or (2) **wrapping** it with a tool such as **Capacitor, outside Lovable**, and submitting it to the App Store or Google Play. The Lovable *mobile app* is a
client for building on a phone, a different thing. The course says all of this plainly in lesson 1 and again where it matters; it never implies Lovable exports a native app. The existing
"Build a Mobile App with AI" course (Expo, native) is where a learner goes for a true native app.

## Goals
- Learner ships one real app, live on a `lovable.app` address (or their own domain), usable on a phone, saved to a home screen.
- Learner knows Lovable's three modes (Chat, Plan, Build), writes change prompts that say what, where and what must stay untouched, and can recover from a bad change (version history, debugging prompts).
- Learner understands, in plain words, tables, sign-in and who-can-see-what (row-level security), and checks security before publishing.

## Non-goals and anti-goals
- Not a tutorial on React, Tailwind, TanStack or Supabase: they appear only because Lovable uses them (brief: "technologies are the tool, not the subject").
- No price figures (plans are described in words), no screenshots of Lovable (none we may use; diagrams describe workflows), no claim that cannot be traced to an official page.
- Does not repeat "Build a Website with AI" (tool-agnostic site building), "Build a Mobile App with AI" (native, Expo), "App Monetization" (payments in depth) or "AI-Assisted Deployment": it points to them.

## Lessons (titles are the syllabus's, in order)
1. What Lovable builds, and what "mobile app" means with it  2. Plan your app before you prompt  3. Your first prompt: build, preview, read  4. Chat, Plan and Build: the right mode for the job
5. Change one thing at a time  6. Make it work well on a phone  7. Save data with the built-in backend  8. Sign-in and who can see what  9. When it breaks: fix it with Lovable
10. Check security before you publish  11. Publish, share and use your own domain  12. Own your code, install it on a phone, and take it to the stores  13. Project: launch your app on the web and on a home screen

## Constraints (the checker enforces them: `lib/standard-rules.ts`, `lib/path-rules.ts`, `catalog.test.ts`)
`volatile: true`, so at least 60% of lessons carry a dated, officially sourced `version` note (host `lovable.dev` is allowed; `capacitorjs.com` is added by this change); level pieces in every lesson and
project (`docs/content/ADAPTATION_BRIEF.md`); 500 to 900 words of teaching per lesson; every quiz question answerable from the lesson; code blocks parse; activities validated.

## Facts verified for this design (Lovable docs, read 2026-11-15)
Modes (Chat discusses and costs a fraction of a credit; Plan writes a plan and never changes code; Build implements; approving a plan switches to Build) `features/plan-mode`; prompting advice (what to build, where, what must stay untouched;
one change at a time; ask clarifying questions; real content; atomic UI words) `prompting/prompting-one`; built-in backend (database, users, storage, edge functions, jobs, secrets, logs; Supabase foundation; region fixed at enabling; removing the
database deletes its data) `features/cloud`; publish (Publish, then Publish changes; `your-app.lovable.app`; Quick security scan; custom domains need a paid plan) `features/publish`; Git sync (two-way, one repo per project, export-only, pushing does not publish or
deploy functions) `integrations/git-sync-overview`; security (secrets never in frontend code, row-level security, server-side checks, critical findings first) `tips-tricks/security-best-practices`; hosting elsewhere and the stack (React + Vite, and TanStack Start for apps created from
2026-05-13) `tips-tricks/external-deployment-hosting`, `introduction/faq`. The writer must re-open the pages it cites.

## Approach (alternatives considered)
1. One writer agent writes the whole course file from the brief (chosen: one voice, one file, the repo's established process).
2. Several agents write parts: faster, but the parts need stitching and the checker works on one file.
3. Write only an outline: leaves the owner with nothing teachable.
The result is reviewed by the catalog checks (`CHECK_COURSE=build-with-lovable`), then by me against the facts above.
