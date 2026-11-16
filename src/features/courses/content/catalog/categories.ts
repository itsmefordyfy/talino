import type { CategoryId, CourseLevel, LearningGoalId } from '../types';

/** A category of the catalog: its name, a one-line description for beginners, and its icon. */
export type CategoryDef = { id: CategoryId; label: string; description: string; icon: string };

export const CATEGORIES: readonly CategoryDef[] = [
  { id: 'ai-coding-fundamentals', label: 'AI Coding Fundamentals', description: 'Start here: how to ask AI for software, read what it makes, and fix it together.', icon: 'auto_awesome' },
  { id: 'vibe-coding', label: 'Vibe Coding and App Building', description: 'Turn an idea into a working website, mobile app or product by directing AI.', icon: 'rocket_launch' },
  { id: 'ai-coding-tools', label: 'AI Coding Tools', description: 'Get the most from ChatGPT, Claude, Claude Code, Cursor, Codex, Copilot and Gemini.', icon: 'smart_toy' },
  { id: 'ai-workflows', label: 'AI-Assisted Development Workflows', description: 'Put AI into every step: planning, design, backend, data, review, testing and deployment.', icon: 'account_tree' },
  { id: 'advanced-ai-engineering', label: 'Advanced AI Software Engineering', description: 'Coding agents, MCP, context engineering, architecture and production-grade work.', icon: 'psychology' },
  { id: 'build-and-monetize', label: 'Building and Monetizing Software with AI', description: 'Launch, price, sell and grow what you build, as a product, a freelancer or a business.', icon: 'storefront' },
  { id: 'careers', label: 'Careers with AI', description: 'Bring AI into your job: developers, educators, analysts and job seekers.', icon: 'work' },
];

const categoryById = new Map(CATEGORIES.map((category) => [category.id, category]));

export function getCategory(id: string): CategoryDef | undefined {
  return categoryById.get(id as CategoryId);
}

export const LEVEL_LABELS: Record<CourseLevel, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

/** The learning goals offered as a filter, in the order a newcomer would think of them. */
export const LEARNING_GOALS: readonly { id: LearningGoalId; label: string }[] = [
  { id: 'learn-programming', label: 'Learn programming' },
  { id: 'build-website', label: 'Build a website' },
  { id: 'build-mobile-app', label: 'Build a mobile app' },
  { id: 'learn-ai-dev', label: 'Learn AI development' },
  { id: 'become-developer', label: 'Become a software developer' },
  { id: 'get-job', label: 'Get a developer job' },
  { id: 'freelance', label: 'Start freelancing' },
  { id: 'build-sell-app', label: 'Build and sell an application' },
  { id: 'teach', label: 'Teach technology' },
];
