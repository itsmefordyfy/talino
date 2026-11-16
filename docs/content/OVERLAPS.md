> **Superseded on 2026-11-14.** This file records the earlier plan of 54 language, framework and backend courses, which the owner
> dropped when Talino's direction became AI-first. The current audit, merges and syllabus are in `AI_FIRST_AUDIT.md`. Kept for the
> reasoning about overlaps between AI courses (items 2 and 3).

# Overlap decisions for the 2026-11-14 catalog expansion

The owner's brief asked for 54 new courses next to 19 existing ones and said: compare, reuse, merge or skip where a
separate course would only duplicate. Every proposed course was compared with the existing catalog and with the other
proposals. **No proposed course was skipped or merged**, because each one has a distinct job once its scope is fixed;
the `scope` sentence of every syllabus entry (`content/catalog/syllabus-*.ts`) records that job so a writer does not
repeat a neighbour. Existing courses were **not extended** (see the first decision).

## Decisions

1. **Existing courses keep their lessons.** Adding lessons to a shipped course would un-finish it for learners who completed it
   (and invalidate their certificate), and the career courses are written as dated daily programmes. Where an existing
   course touches a new subject, the new course is the deep version and the older one is its introduction; the course pages
   link them through learning paths and "build on" prerequisites instead of by copying lessons.
2. **Claude and Claude Code stay separate** (existing path courses, untouched), and neither is repeated in the new AI courses:
   the new Agents and Multi-Agent courses teach *building* agents; the Claude Code, Codex and Cursor courses teach *using*
   coding agents.
3. **ChatGPT for developers, Generative AI, LLMs, Integration, Chatbots, RAG, Agents** form a ladder with one job each:
   - *Large Language Models Explained* (concepts, no code) comes before *Generative AI for Developers* (first API calls and the
     whole feature survey), then *AI Model Integration* (production plumbing: keys, streaming, retries, cost), *Building AI
     Chatbots* (the conversation product), *Vector Databases and Embeddings* then *RAG* (answering from your own data),
     *Agents* then *Multi-Agent Systems*, and *AI Application Evaluation and Safety* across all of them.
   - *AI Engineering Basics* (existing mini-course) stays the five-lesson introduction; RAG, Agents and Evaluation are the deep
     versions, and their `scope` says they go beyond it.
   - *Introduction to AI for Software Developers* (existing) teaches the *use* of AI coding tools; *LLMs Explained* teaches
     how the models work, with different lessons.
4. **Testing is three courses on purpose:** *Software Testing and QA* (the discipline: design techniques, exploratory testing,
   bug reports, plans), *Unit Testing and Integration Testing* (code-level, Jest and friends) and *API Testing and
   Automation* (a seven-lesson mini-course that assumes REST). *AI for QA Testers* (existing) adds AI help on top.
5. **React Native and Expo** have related but distinct objectives, as the brief asked: React Native teaches the components,
   styling, lists, device features and performance; Expo and Expo Router teaches the toolchain (dev builds, file-based
   routing, EAS, deep links). Mobile App Architecture applies Clean Architecture to phones; Offline-First is about data
   and sync; Building and Publishing Your First Mobile App is the guided journey to the stores. Flutter is an alternative to
   the React Native route, never a sequel.
6. **HTML and CSS vs Responsive Web Design vs Tailwind:** the first teaches the languages including Flexbox and Grid,
   Responsive Web Design is mobile-first, fluid and container-query design, Tailwind is the utility-class approach.
7. **Full-stack:** *Next.js Full-Stack Development* teaches the framework; *Building Full-Stack Web Applications* is the
   capstone on the classic React + Express + PostgreSQL stack, so the two are different architectures, not repeats.
8. **Backend:** *REST API Development* is design (framework-neutral), *Node.js and Express* and *ASP.NET Core Web API* are
   implementations, *Authentication and Authorization* is the sign-in deep dive, and *Supabase* and *Firebase* are the
   hosted-backend alternatives that reuse those ideas.
9. **Software engineering:** *OOP* (the four ideas), *Clean Code and SOLID* (writing), *Design Patterns* (solutions),
   *Clean Architecture* (whole applications), *System Design Fundamentals* (large systems). Each assumes the one before and
   does not teach it again.
10. **Career:** *Developer: Get Hired with AI* (existing) is the job search and portfolio projects with AI; *Technical
    Interview Preparation* and *System Design Interview Preparation* are performance practice; *Building a Professional
    Developer Portfolio* (six lessons) shows any projects well and works with Talino's Portfolio and Résumé tools. *Freelancer
    & VA with AI* (existing) is the broad online-work market; *Freelancing and Remote Software Development* is specific to
    building software for clients and remote teams. *Becoming a Senior Software Engineer* is the role; *Experienced
    Developer: Code with AI* is the AI habits.
11. **Python:** *Python Programming Masterclass* never depends on AI; *Python for AI* (existing mini) is its follow-on.
    *Programming Fundamentals* teaches the universal ideas in JavaScript because the in-app code runner executes JavaScript.
12. **Problem Solving and Computational Thinking** is a six-lesson, language-free course that precedes Programming
    Fundamentals; its ideas return there as code, not as repeated lessons.

## What stayed as is

AI Basics for Tech, the five career courses, the six mini-courses and the seven AI-Assisted Development courses are
unchanged (ids, lessons, quizzes and projects). They only gained a `level` where they had none and a metadata row.
