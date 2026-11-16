import type { LearningGoalId } from '../types';

/**
 * Learning paths: courses in the order to take them, aimed at one outcome. A path is advice, never a lock: every
 * course stays open to anyone who owns it. The course ids are checked against the catalog (`catalog.test.ts`), and a
 * path is never built from a hardcoded list in a screen: screens read `LEARNING_PATHS`.
 */
export type LearningPathDef = {
  id: string;
  title: string;
  /** One or two sentences: who it is for and where it leads. */
  description: string;
  icon: string;
  /** The learner goals this path serves; the recommendations use them to pick "your learning path". */
  goals: LearningGoalId[];
  /** Courses in the order to take them. Every prerequisite of a course is earlier in the list or in `assumes` (tested). */
  courseIds: string[];
  /** Courses the path takes for granted ("Before you start"): shown as advice, never required. */
  assumes?: string[];
  /** Who it is for, in one short line ("Complete beginners who want…"). */
  audience: string;
  /** Three main objectives: what the learner will be able to do. */
  objectives: [string, string, string];
  /** Where it leads, in one sentence: the expected outcome. The level and the duration are computed from its courses, never typed. */
  outcome: string;
};

export const LEARNING_PATHS: readonly LearningPathDef[] = [
  {
    id: 'master-ai',
    title: 'Master AI-Powered Development',
    description: 'The flagship path: from your first AI-built page to directing coding agents, with every step put into your own workflow.',
    icon: 'workspace_premium',
    goals: ['learn-ai-dev', 'become-developer', 'build-sell-app', 'get-job'],
    courseIds: ['starter', 'ai-dev-intro', 'prompt-engineering-dev', 'ai-coding-practices', 'choose-ai-tool', 'ai-dev-claude-code', 'ai-dev-cursor', 'context-engineering', 'spec-driven-dev', 'agentic-coding', 'ai-dev-advanced'],

    audience: 'Anyone who wants to become a confident AI-powered developer, starting from zero.',
    objectives: ['Prompt, read and fix AI-written code with confidence', 'Choose and use the right AI coding tool for each job', 'Direct coding agents with clear context and specs'],
    outcome: 'You build software with AI as your daily partner, from a first page to agent-driven projects.',
  },
  {
    id: 'first-app',
    title: 'Build Your First App with AI',
    description: 'Never coded? Ask AI for a website and a phone app, understand what it made, make it look right and fix it when it breaks.',
    icon: 'rocket_launch',
    goals: ['learn-programming', 'build-website', 'build-mobile-app', 'build-sell-app'],
    courseIds: ['ai-coding-beginners', 'prompt-engineering-dev', 'understanding-ai-code', 'build-website-ai', 'deploy-with-vercel', 'build-with-lovable', 'ai-ui-ux', 'debugging-with-ai', 'build-mobile-app-ai'],

    audience: 'Complete beginners who have never written code.',
    objectives: ['Ask AI for a website and a phone app in plain words', 'Understand, style and publish what the AI made', 'Fix it calmly when something breaks'],
    outcome: 'Your first website and phone app, built with AI and live for others to use.',
  },
  {
    id: 'first-mobile-app',
    title: 'Build Your First Mobile App with AI',
    description: 'Go from an idea to an app on your own phone: plan screens, prompt the AI, polish the design, fix problems and think about earning from it.',
    icon: 'smartphone',
    goals: ['build-mobile-app', 'build-sell-app', 'learn-programming'],
    courseIds: ['ai-coding-beginners', 'prompt-engineering-dev', 'build-with-lovable', 'build-mobile-app-ai', 'publish-to-app-stores', 'debugging-with-ai', 'ai-ui-ux', 'app-monetization'],

    audience: 'Beginners with an app idea for their own phone.',
    objectives: ['Plan the screens of a mobile app', 'Build and polish it by prompting AI', 'Prepare it for the app stores and think about earning from it'],
    outcome: 'A working mobile app on your phone, ready to publish.',
  },
  {
    id: 'idea-to-launch',
    title: 'From Idea to Launched Product',
    description: 'Validate an idea, plan it, build a full application or SaaS with AI, deploy it, launch it and earn from it.',
    icon: 'storefront',
    goals: ['build-sell-app', 'freelance', 'build-website'],
    courseIds: ['idea-to-product', 'ai-project-planning', 'build-website-ai', 'deploy-with-vercel', 'build-fullstack-ai', 'build-saas-ai', 'ai-deployment', 'launch-marketing', 'app-monetization'],
    assumes: ['ai-coding-beginners'],

    audience: 'Builders who know the basics and want to ship a real product.',
    objectives: ['Validate and plan an idea before building', 'Build a full-stack app or SaaS with AI and deploy it', 'Launch, market and earn from it'],
    outcome: 'A launched product with real users and a plan to grow it.',
  },
  {
    id: 'ai-coding-tools',
    title: 'AI Coding Tools, Mastered',
    description: 'Know each major tool well and choose the right one: ChatGPT, Claude, Gemini, Copilot, Claude Code, Cursor and Codex.',
    icon: 'smart_toy',
    goals: ['learn-ai-dev', 'become-developer'],
    courseIds: ['ai-dev-intro', 'choose-ai-tool', 'ai-dev-chatgpt', 'ai-dev-claude', 'ai-dev-gemini', 'ai-dev-copilot', 'ai-dev-claude-code', 'ai-dev-cursor', 'ai-dev-codex', 'ai-dev-advanced'],

    audience: 'Learners who want to master every major AI coding tool.',
    objectives: ['Know what each tool does best', 'Use ChatGPT, Claude, Gemini, Copilot, Claude Code, Cursor and Codex in real work', 'Pick the right tool for each task'],
    outcome: 'You can switch between AI coding tools and choose the best one for any task.',
  },
  {
    id: 'ai-assisted-developer',
    title: 'AI-Assisted Developer',
    description: 'The seven-course path through ChatGPT, Claude, Claude Code, Cursor and Codex, then advanced AI-powered engineering.',
    icon: 'terminal',
    goals: ['learn-ai-dev', 'become-developer'],
    courseIds: ['ai-dev-intro', 'ai-dev-chatgpt', 'ai-dev-claude', 'ai-dev-claude-code', 'ai-dev-cursor', 'ai-dev-codex', 'ai-dev-advanced'],

    audience: 'Developers and students who want AI in their everyday coding.',
    objectives: ['Use chat assistants to plan, explain and debug', 'Work with Claude Code, Cursor and Codex in a real codebase', 'Apply advanced AI-powered engineering habits'],
    outcome: 'You work as an AI-assisted developer, faster and with code you can trust.',
  },
  {
    id: 'developer-workflows',
    title: 'AI in Your Developer Workflow',
    description: 'For working developers: prompts, reading and reviewing AI code, debugging, testing and improving real projects with AI.',
    icon: 'account_tree',
    goals: ['become-developer', 'get-job', 'learn-ai-dev'],
    courseIds: ['prompt-engineering-dev', 'understanding-ai-code', 'debugging-with-ai', 'ai-code-review', 'ai-testing-qa', 'improve-existing-ai', 'experienced'],

    audience: 'Working developers who want AI in every step of their workflow.',
    objectives: ['Write prompts that give dependable code', 'Review, test and debug AI-written code', 'Improve existing projects with AI safely'],
    outcome: 'A professional workflow where AI speeds you up without lowering quality.',
  },
  {
    id: 'ai-products',
    title: 'Build AI-Powered Products',
    description: 'Put AI inside your own products: models, prompts, chat, your own data, actions, guardrails, and the services around them.',
    icon: 'psychology',
    goals: ['learn-ai-dev', 'build-sell-app', 'become-developer'],
    courseIds: ['build-ai-app', 'ai-api-integration', 'ai-backend-dev', 'ai-database-design', 'mini-ai-engineering', 'mini-python-ai'],
    assumes: ['ai-coding-beginners', 'build-website-ai'],

    audience: 'Builders who want AI features inside their own apps.',
    objectives: ['Connect apps to AI models and APIs', 'Use your own data, actions and guardrails', 'Design the backend and database around an AI feature'],
    outcome: 'An app with a real AI feature that you built, understand and can run.',
  },
  {
    id: 'agentic-engineer',
    title: 'Agentic Software Engineer',
    description: 'Direct coding agents at professional level: agents, subagents, MCP, context, architecture, security and managing complex work.',
    icon: 'engineering',
    goals: ['become-developer', 'get-job', 'learn-ai-dev'],
    courseIds: ['ai-dev-intro', 'prompt-engineering-dev', 'ai-coding-practices', 'agentic-coding', 'multi-agent-dev', 'mcp-dev', 'context-engineering', 'spec-driven-dev', 'ai-architecture', 'production-ai-apps', 'ai-coding-security', 'managing-ai-projects'],
    assumes: ['build-website-ai', 'build-fullstack-ai', 'debugging-with-ai', 'ai-testing-qa'],

    audience: 'Experienced builders ready to direct coding agents at a professional level.',
    objectives: ['Run agents, subagents and MCP tools on real work', 'Engineer context, specs and architecture for agents', 'Keep AI-built systems secure and well managed'],
    outcome: 'You lead complex, production-grade work with coding agents.',
  },
  {
    id: 'freelance-with-ai',
    title: 'Freelance and Sell with AI',
    description: 'Offer AI-powered building services: find clients, scope and price honestly, deliver, then grow a small software business.',
    icon: 'payments',
    goals: ['freelance', 'build-sell-app'],
    courseIds: ['freelancer', 'idea-to-product', 'build-website-ai', 'freelance-ai-dev', 'ai-software-business', 'mini-no-code-automation', 'mini-sell-your-app'],
    assumes: ['ai-coding-beginners'],

    audience: 'People who want to earn by building for clients with AI.',
    objectives: ['Find clients and scope work honestly', 'Price, deliver and support AI-built projects', 'Grow a small software business'],
    outcome: 'A freelance offer you can sell, deliver and grow.',
  },
  {
    id: 'build-and-sell',
    title: 'Build and Sell Your Own App (No Code)',
    description: 'Turn an idea into an app people pay for, using AI builders instead of writing code yourself.',
    icon: 'smart_toy',
    goals: ['build-sell-app', 'build-website', 'build-mobile-app'],
    courseIds: ['starter', 'builder', 'mini-no-code-automation', 'mini-sell-your-app'],

    audience: 'Non-programmers who want to sell an app without writing code.',
    objectives: ['Turn an idea into an app with AI builders', 'Automate the busywork around it', 'Set a price and start selling'],
    outcome: 'An app people can pay for, built without writing code yourself.',
  },
];

export function getLearningPath(id: string): LearningPathDef | undefined {
  return LEARNING_PATHS.find((path) => path.id === id);
}
