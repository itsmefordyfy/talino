import type { CourseLevel } from '../types';

/**
 * The AI-Assisted Software Development path (owner's brief, 2026-11-14): seven courses, in order, with
 * one lesson per syllabus topic. The course files follow this list; `lib/path-rules.ts` checks the
 * lesson count, the level and the order against it, so a course can't quietly drop a topic.
 */
export type SyllabusCourse = { id: string; title: string; level: CourseLevel; topics: string[] };

export const AI_DEV_SYLLABUS: readonly SyllabusCourse[] = [
  {
    id: 'ai-dev-intro',
    title: 'Introduction to AI for Software Developers',
    level: 'beginner',
    topics: [
      'Understanding generative AI and large language models',
      'How AI coding assistants work',
      'AI-assisted vs. traditional software development',
      'Understanding AI hallucinations and limitations',
      'Choosing the right AI tool for a development task',
      'Responsible AI usage and secure coding practices',
      'Building an effective AI-assisted development workflow',
    ],
  },
  {
    id: 'ai-dev-chatgpt',
    title: 'Mastering ChatGPT for Software Development',
    level: 'beginner',
    topics: [
      'ChatGPT fundamentals for developers',
      'Prompt engineering for coding',
      'Generating components and functions',
      'Debugging errors with ChatGPT',
      'Understanding unfamiliar codebases',
      'Refactoring and optimizing code',
      'Generating unit and integration tests',
      'Code documentation and technical writing',
      'Using ChatGPT for architecture planning',
      'Working with files, projects, and coding-related capabilities',
      'Advanced workflows for full-stack development',
    ],
  },
  {
    id: 'ai-dev-claude',
    title: 'Mastering Claude for Software Development',
    level: 'beginner',
    topics: [
      'Introduction to Claude and its capabilities',
      'Writing effective coding prompts',
      'Using Claude for code analysis',
      'Understanding large codebases',
      'Generating React and React Native components',
      'Backend and API development',
      'Debugging and troubleshooting',
      'Refactoring and code optimization',
      'Architecture discussions and technical decisions',
      'Working with long-context development tasks',
      'Reviewing AI-generated code',
    ],
  },
  {
    id: 'ai-dev-claude-code',
    title: 'Mastering Claude Code',
    level: 'intermediate',
    topics: [
      'Introduction to Claude Code',
      'Installing and configuring Claude Code',
      'Understanding terminal-based AI development',
      'Navigating and analyzing existing repositories',
      'Using CLAUDE.md effectively',
      'Giving Claude Code project-level instructions',
      'Planning before implementation',
      'Implementing complete features',
      'Debugging and fixing existing applications',
      'Running tests and validating changes',
      'Git workflows and pull request preparation',
      'Working with subagents and parallel tasks',
      'MCP integration and custom workflows',
      'Permissions, security, and safe autonomous execution',
      'Advanced agentic development workflows',
    ],
  },
  {
    id: 'ai-dev-cursor',
    title: 'Mastering Cursor',
    level: 'intermediate',
    topics: [
      'Introduction to Cursor',
      'Setting up Cursor for development',
      'Understanding Tab, Chat, and Agent workflows',
      'Using Composer and agent capabilities',
      'Project rules and configuration',
      'Using codebase indexing and context',
      'Generating and modifying multiple files',
      'Debugging through AI-assisted workflows',
      'Working with existing projects',
      'Codebase exploration and architecture analysis',
      'AI-assisted testing and refactoring',
      'Git integration',
      'Advanced Cursor workflows',
    ],
  },
  {
    id: 'ai-dev-codex',
    title: 'Mastering OpenAI Codex',
    level: 'intermediate',
    topics: [
      'Understanding Codex and coding agents',
      'Setting up and configuring Codex',
      'Delegating coding tasks to an AI agent',
      'Understanding repository context',
      'Planning and implementing features',
      'Running tests and reviewing changes',
      'Working with Git and pull requests',
      'Parallel coding tasks and agent workflows',
      'Reviewing AI-generated implementations',
      'Safe and reliable agentic development',
    ],
  },
  {
    id: 'ai-dev-advanced',
    title: 'Advanced AI-Powered Software Engineering',
    level: 'advanced',
    topics: [
      'Context engineering for AI coding',
      'Advanced prompt engineering',
      'Spec-driven development',
      'AI-assisted system architecture',
      'Multi-agent software development',
      'Model selection and task routing',
      'MCP servers and integrations',
      'AI-assisted debugging and root-cause analysis',
      'Automated testing with AI',
      'AI code review and security analysis',
      'Managing AI development costs and token usage',
      'Building repeatable AI development workflows',
    ],
  },
];

/** Every AI tool the path covers. */
export const AI_DEV_TOOL_COURSES: Partial<Record<string, string>> = {
  'ai-dev-chatgpt': 'chatgpt',
  'ai-dev-claude': 'claude',
  'ai-dev-claude-code': 'claude-code',
  'ai-dev-cursor': 'cursor',
  'ai-dev-codex': 'codex',
};

/**
 * The owner's table of AI-assisted topics for existing programming courses (2026-11-14). Talino has no
 * standalone JavaScript, React, Node, SQL, Git, DevOps or API course, and appending lessons to the
 * career courses would un-finish courses (and certificates) learners already completed, so each topic
 * is taught in these path lessons instead. `pattern` must appear in each lesson's text (tested).
 */
export const STACK_COVERAGE: readonly { topic: string; teaches: string; pattern: RegExp; lessons: string[] }[] = [
  { topic: 'JavaScript / TypeScript', teaches: 'Generate functions, explain code, debug errors', pattern: /JavaScript|TypeScript/, lessons: ['ai-dev-chatgpt-03', 'ai-dev-chatgpt-04'] },
  { topic: 'React', teaches: 'Generate components, hooks and tests', pattern: /React/, lessons: ['ai-dev-chatgpt-03', 'ai-dev-chatgpt-07', 'ai-dev-claude-05'] },
  { topic: 'React Native', teaches: 'Build screens and debug mobile issues', pattern: /React Native|Expo/, lessons: ['ai-dev-claude-05', 'ai-dev-claude-07'] },
  { topic: 'Node.js / Express', teaches: 'Generate APIs, middleware and backend tests', pattern: /Express/, lessons: ['ai-dev-claude-06'] },
  { topic: 'Database / SQL', teaches: 'Generate queries, optimise SQL, understand schemas', pattern: /SQL/, lessons: ['ai-dev-chatgpt-05', 'ai-dev-chatgpt-06', 'ai-dev-claude-06'] },
  { topic: 'Git and GitHub', teaches: 'AI-assisted commits, pull requests and code reviews', pattern: /pull request/i, lessons: ['ai-dev-claude-code-11', 'ai-dev-cursor-12', 'ai-dev-codex-07'] },
  { topic: 'Software architecture', teaches: 'Plan systems and evaluate architecture with AI', pattern: /architecture/i, lessons: ['ai-dev-chatgpt-09', 'ai-dev-claude-09', 'ai-dev-advanced-04'] },
  { topic: 'Testing and QA', teaches: 'Generate test cases and investigate failures', pattern: /test/i, lessons: ['ai-dev-chatgpt-07', 'ai-dev-claude-code-10', 'ai-dev-advanced-09'] },
  { topic: 'DevOps', teaches: 'AI-assisted CI/CD configuration and troubleshooting', pattern: /\bCI\b|GitHub Actions|pipeline/, lessons: ['ai-dev-advanced-12'] },
  { topic: 'API development', teaches: 'Generate API integrations and documentation', pattern: /\bAPI\b/, lessons: ['ai-dev-chatgpt-08', 'ai-dev-claude-06'] },
];

/** Existing courses that lead into the path: their course page offers these path courses to go further. */
export const PATH_NEXT_STEPS: Partial<Record<string, string[]>> = {
  starter: ['ai-dev-intro'],
  developer: ['ai-dev-intro', 'ai-dev-chatgpt', 'ai-dev-claude-code'],
  experienced: ['ai-dev-claude-code', 'ai-dev-cursor', 'ai-dev-advanced'],
  'mini-ai-qa': ['ai-dev-advanced'],
  'mini-ai-engineering': ['ai-dev-advanced'],
};
