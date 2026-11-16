# Catalog audit for the AI-first direction (2026-11-14)

**Owner's decision:** Talino teaches people how to use AI to build software and to bring AI into their own workflow, even with
little or no coding knowledge. Identity: *"Learn to build software with AI, even if you don't know how to code."* It is not a
programming academy: **no standalone course on a programming language, framework or backend technology** (React, React Native,
Next.js, Supabase, Node.js, Python, JavaScript, TypeScript...). Technologies appear inside lessons as the tool, never as the subject.

## What happened to the earlier plan

The previous plan added 54 courses (a full "zero to professional developer" curriculum). 13 were written and passing every check
and 18 more were part-written when the work stopped. Under the new direction **all 54 were dropped from the catalog**; none had
shipped, so no learner progress depends on them. Their files are kept, outside the build, in
`docs/content/archive-programming-courses/` as reusable raw material for supporting lessons in context.

## The 19 existing courses

| Course | Decision | Why |
|---|---|---|
| AI Basics for Tech (starter) | **Keep**, first step of the flagship path | AI fundamentals, free |
| Developer: Get Hired with AI | **Keep**, category Careers with AI | AI-assisted job search and portfolio; developers are an audience |
| Freelancer & VA with AI | **Keep**, Building and Monetizing | freelancers are an audience |
| Builder: Your Own App or Website | **Keep, reposition as the vibe-coding flagship** | it *is* "Vibe Coding for Absolute Beginners": the proposed duplicate was not created |
| Experienced Developer: Code with AI | **Keep**, AI-Assisted Workflows | developers becoming more productive |
| Educator: Teach Tech with AI | **Keep**, Careers with AI | existing progress; not a growth priority |
| Python for AI (mini) | **Keep id and progress, retitled "Build Your First AI Script"** | it teaches calling AI from code; Python is the tool, not the subject |
| AI Engineering Basics (mini) | **Keep**, Advanced AI Engineering | AI features, RAG, tools, evals |
| AI for QA Testers (mini) | **Keep**, Workflows | AI-assisted testing for QA people |
| AI for Data Analysts (mini) | **Keep**, Careers with AI | AI in an analyst's workflow |
| AI Automation with No-Code Tools (mini) | **Keep**, Building and Monetizing | automation to sell |
| Selling Your Vibe-Coded App (mini) | **Keep**, Building and Monetizing | monetisation |
| Introduction to AI for Software Developers | **Keep** = "Introduction to AI-Assisted Software Development" | |
| Mastering ChatGPT / Claude / Claude Code / Cursor / OpenAI Codex | **Keep**, AI Coding Tools | exactly the owner's list |
| Advanced AI-Powered Software Engineering | **Keep**, Advanced AI Software Engineering | |

## New courses (36, in `content/catalog/syllabus-ai-*.ts`)

**A. AI Coding Fundamentals (5):** Coding with AI for Complete Beginners; Prompt Engineering for Software Development (includes
Communicating Requirements to AI); Understanding AI-Generated Code (the place where HTML, CSS, JavaScript, React, Python, databases,
APIs and sign-in are taught *in context*, as reading comprehension of what AI generates); Debugging and Troubleshooting with AI;
AI Coding Best Practices.
**B. Vibe Coding and App Building (7):** Build a Website with AI; Build a Mobile App with AI; Build a Full-Stack Application with
AI; Build an AI-Powered Application; Build a SaaS Product with AI; Turn an Idea into a Working Product; Improve and Expand
Existing Applications with AI. (Vibe Coding for Absolute Beginners = the existing Builder course.)
**C. AI Coding Tools (3 new + the 5 existing):** Mastering GitHub Copilot; Gemini for Software Development; Choosing the Right AI
Coding Tool.
**D. AI-Assisted Development Workflows (10):** Context Engineering; Spec-Driven Development; AI-Assisted Project Planning; UI and
UX; Backend; Database Design; API Integration; Code Review; Testing and QA; Deployment.
**E. Advanced AI Software Engineering (7 new + Advanced AI-Powered Software Engineering):** AI Agents and Agentic Coding;
Multi-Agent Development Workflows; MCP for Software Development; AI-Assisted Software Architecture; Building Production-Ready
Applications with AI; AI Coding Security and Best Practices; Managing Complex AI Development Projects.
**F. Building and Monetizing Software with AI (4 new + Selling Your Vibe-Coded App, Freelancer & VA, No-Code Automation):**
App Monetization and Subscriptions; Launching and Marketing AI-Built Products; Freelancing as an AI-Powered Developer; Starting an
AI-Assisted Software Business.

## Merges (the owner's list had overlaps)

- *Debugging with AI* (A) + *AI-Assisted Debugging and Troubleshooting* (D) -> **Debugging and Troubleshooting with AI** (one course).
- *Communicating Requirements to AI* -> inside **Prompt Engineering for Software Development**.
- *Context Engineering* (D) + *Advanced Context Management* (E) -> **Context Engineering** (one course, advanced).
- *Working with Existing Codebases* (D) -> inside **Improve and Expand Existing Applications with AI**.
- *Validate Software Ideas with AI* + *Build MVPs with AI* (F) -> inside **Turn an Idea into a Working Product**.
- *Build and Launch Your First SaaS* (F) -> **Build a SaaS Product with AI** (it runs through launch).
- *Create AI-Powered Products* (F) -> **Build an AI-Powered Application** (B).
- *Build and Sell Mobile Applications* (F) -> **Build a Mobile App with AI** + **App Monetization and Subscriptions** + the existing
  **Selling Your Vibe-Coded App**.
- *Vibe Coding for Absolute Beginners* (B) -> the existing **Builder** course.
- *Introduction to AI-Assisted Software Development* (A) -> the existing **Introduction to AI for Software Developers**.

## How the five learner levels fit

The levels (complete beginner ... professional) are programming experience, not AI-tool experience. Each course adapts through
optional `audience` ranges on lesson blocks, quiz questions, activities, project steps and rubrics (docs/content/ADAPTATION_BRIEF.md),
and nothing is ever locked: learners can change level, take the skill check, or "Show everything".

## Written so far, and what is still to write

The 36 new courses exist as syllabus entries (titles, levels, categories, prerequisites, every lesson topic) and are written by
the content pipeline (docs/content/WRITING_BRIEF.md); a course appears in the app when its file passes every check and is
registered. See the final report for the current count.
