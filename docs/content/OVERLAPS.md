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
13. **International clients (2026-11-17):** *Finding International Clients* (`international-clients`) owns **winning a first client abroad**: market, niche, where clients are, portfolio,
    profile, research, outreach, proposals, communication, discovery and negotiation, contract and onboarding, practised with AI role-play. *Freelancer & VA with AI* (existing) keeps the broad
    toolkit (tools, pricing models, scams in brief, BIR and taxes, getting paid, delivery); *Freelancing with AI Development* keeps software scoping, contracts and retainers; *Soft Skills for the
    Modern Workplace* keeps general communication. The new course points to those lessons by name instead of repeating them, states no platform fee, policy or price, and gives no legal or tax advice.

14. **Software architecture (2026-11-18):** *AI-Assisted Software Architecture* (`ai-architecture`, existing, unchanged) stays the shorter introduction (what architecture is when AI builds, options, trade-offs, decision records, reviewing an AI-proposed design).
    *Software Architecture with AI* (`software-architecture-ai`) is the deep version for working developers: requirements and measurable quality attributes, the architecture styles and a method to choose, components and boundaries, data modeling and multi-tenancy, APIs and integration, cloud concepts,
    scaling and reliability on evidence, security by design, C4 diagrams, UML sequence and class views and ADRs, prompting Claude, ChatGPT and Gemini, directing coding agents, and production review, with four tools and three projects. It uses a different running example (TindaTrack, not Hiwa Booking), does not repeat the older lessons
    (it recalls them by name) and *System Design Fundamentals*, *Clean Architecture* and *Design Patterns* from the earlier plan were never built, so nothing else overlaps. *Object-Oriented Programming* (the four ideas, SOLID) is advised first, never required.

15. **How Large Language Models Work (2026-11-18):** the mechanism course between *AI Fundamentals for Everyone* (what AI is and how to use it, no inner workings) and the developer courses. It owns **why an LLM behaves as it does**: training data and parameters, tokens and embeddings, the Transformer and attention, next-token generation with temperature, top-k and top-p, pretraining, fine-tuning, RLHF and DPO, context windows, hallucination and cutoffs, retrieval and vector search, multimodal models, agents and function calling. *Generative AI: From Fundamentals to Real-World Applications* keeps **using** these ideas (prompting, labs, workflows, building: its module 2 "How generative AI works", module 7 RAG and module 8 agents are the practical short versions) and the new course recalls those lessons by name instead of repeating them; *AI Fundamentals for Everyone* keeps the everyday-life version of "What are LLMs / hallucinations" and the new course goes one level inside. No code and no advanced mathematics; it teaches no prompt writing, tool tour or build steps (prompt engineering and the build courses own those). Sibling topics are advice, never locks (`prerequisites` is `ai-fundamentals-everyone`, advice only).

16. **Building AI Agents (2026-11-18):** the build step of the AI ladder: *AI Fundamentals for Everyone* (understand AI) → *How Large Language Models Work* (the mechanism) → *AI Automation for Business and Everyday Work* (automate with other people's tools) → **`building-ai-agents`** (write the agent itself) → a later *Advanced AI Agent Development* course (not built). It owns **building an agent that calls an LLM API**: what an agent is and its parts, connecting to OpenAI and Anthropic models, structured output, keys, errors and cost, tool and function calling, short- and long-term memory, retrieval-augmented generation with embeddings and pgvector, planning, ReAct and bounded multi-step runs, multi-agent coordination, the frameworks (LangChain, LangGraph, CrewAI, Microsoft Agent Framework, vendor SDKs) and when to skip them, eight practical builds, and security, evaluation, observability and deployment.
    It does not repeat *How Large Language Models Work* (module 10 there explains agents and function calling as an idea with no code; here the learner builds them), *AI Automation for Business and Everyday Work* (module 7 there is no-code agents with other people's platforms), *Generative AI: From Fundamentals to Real-World Applications* (modules 7 and 8 there are the practical short versions of RAG and agents without a build), or *AI-Assisted Software Architecture* and *Software Architecture with AI* (system design; this course only uses their diagram tools). It is also **not** the course on *using* coding agents: *AI Agents and Agentic Coding*, *Multi-Agent Development with Claude Code and Codex* and *Model Context Protocol* teach supervising and extending Claude Code, Cursor and Codex, and stay unchanged; module 8 here builds a multi-agent system rather than directing one. *Programming Fundamentals* and *How Large Language Models Work* are advice, never locks (`prerequisites`).

## What stayed as is

AI Basics for Tech, the five career courses, the six mini-courses and the seven AI-Assisted Development courses are
unchanged (ids, lessons, quizzes and projects). They only gained a `level` where they had none and a metadata row.
