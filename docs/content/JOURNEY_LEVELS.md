# The learning journey's four levels: how the catalog was sorted

Home's journey (`src/features/journey/data/journey.ts`) places every course in one of four levels. This records how they were placed
(2026-11-16, a lesson-by-lesson audit of all 58 courses), the overlaps found, and the topics with no course yet.

## Rules used

- A course's level is what it assumes and teaches about **building with AI**, never who it is written for. A professional developer
  can still be a beginner at AI tools; the courses already adapt to programming experience inside their lessons.
- Order inside a level follows real prerequisites between courses (`catalog/meta.ts` plus ones the content clearly needs).
- Launch, store, pricing and business courses (`publish-to-app-stores`, `app-monetization`, `launch-marketing`, `mini-sell-your-app`,
  `freelance-ai-dev`, `ai-software-business`) are technically easy but need a finished product, so they sit at **Expert**.
- Courses for one audience are **side steps** (optional unless the learner heads that way): `freelancer`, `educator`, `experienced`,
  `developer`, `freelance-ai-dev`.
- Moved from their stored `level` field: `educator` (to beginner); `mini-ai-data`, `mini-python-ai`, `debugging-with-ai`, `mini-ai-qa`,
  `deploy-with-vercel`, `build-mobile-app-ai`, `developer` (to intermediate); `ai-code-review`, `improve-existing-ai`,
  `mini-ai-engineering` (to advanced); `ai-architecture`, `ai-dev-advanced`, `managing-ai-projects`, `build-saas-ai` and the launch and
  business courses (to expert). The stored `level` field itself was not changed (the Courses tab's filters still use it).
- Borderline calls the owner may flip: `ai-dev-chatgpt` / `ai-dev-claude` could open Intermediate; the launch courses could end
  Intermediate for earlier wins; `ai-architecture` could end Advanced.

## Overlaps (recommendations only: merging would lose learners' progress)

- AI basics three times: `starter`, `ai-dev-intro` (01, 05), `choose-ai-tool` (could become a module of `ai-dev-intro`).
- Prompting in six places; `ai-dev-advanced-02` is the only advanced prompting lesson.
- First website: `ai-coding-beginners-p1` and `build-website-ai-p2` are near-duplicate projects.
- `builder` overlaps `ai-coding-beginners`, `build-with-lovable`, `idea-to-product`, `mini-sell-your-app` (kept as the no-code track).
- Planning: `ai-project-planning` and `idea-to-product` overlap most (one should own scope and estimates, the other validation).
- `mini-ai-qa` could be a module of `ai-testing-qa`; `mini-ai-engineering` a module of `build-ai-app`.
- `mini-sell-your-app` is essentially a short `launch-marketing` + `app-monetization`.
- `ai-dev-advanced` lessons 01, 03, 04, 05, 07, 09, 10 condense `context-engineering`, `spec-driven-dev`, `ai-architecture`,
  `multi-agent-dev`, `mcp-dev`, `ai-testing-qa`, `ai-code-review` (it is the Expert capstone for that reason).
- `deploy-with-vercel` (one vendor) and `ai-deployment` (general) both kept; `freelancer` (VA work) and `freelance-ai-dev` (selling
  software) both kept.

## Gaps: owner topics with no course yet

RAG and knowledge systems (closest: `mini-ai-engineering-03`, `build-ai-app-06`), multimodal AI features, autonomous agents inside
products (`mini-ai-engineering-04`, `build-ai-app-07`), AI system architecture (`ai-dev-advanced-06`), scaling AI apps
(`production-ai-apps-03`, `-11`), enterprise AI (`experienced-02`, `ai-coding-security-07`, `build-saas-ai-06`), CI/CD
(`ai-deployment-05`, `production-ai-apps-07`, `managing-ai-projects-03`), authentication (modules only: `build-fullstack-ai-05`,
`ai-backend-dev-04`), advanced prompt engineering (`ai-dev-advanced-02`), advanced mobile, evaluating AI features (scattered).
A new course goes into the journey by adding a step to the right milestone; `journey-data.test.ts` fails until it has a place.
