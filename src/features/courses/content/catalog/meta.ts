import type { Course, CourseMeta } from '../types';
import { CATALOG_SYLLABUS } from './syllabus';

/**
 * The catalog metadata of every course, in one place. Search, filters, sorting, categories, learning paths and the
 * recommendations all read this table (through `lib/catalog.ts`); no screen keeps its own list.
 *
 * The 54 courses added on 2026-11-14 are built from their syllabus entry, so a course's category, tags, technologies,
 * goals and prerequisites are typed once. The 19 courses that existed before are listed here by hand, so their own files
 * (and their progress ids) stay as they were. Lesson counts, minutes, skills and objectives are never copied: they are
 * read from the course.
 */
const FIRST_RELEASE = '2026-11-13';
const AI_PATH_RELEASE = '2026-11-14';
const CATALOG_RELEASE = '2026-11-14';

const EXISTING: Record<string, CourseMeta> = {
  starter: {
    category: 'ai-coding-fundamentals',
    tags: ['ai basics', 'prompting', 'responsible ai', 'checking ai output', 'free', 'beginner', 'ai safety'],
    technologies: ['llm', 'chatgpt'],
    goals: ['learn-ai-dev', 'become-developer', 'learn-programming'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  developer: {
    category: 'careers',
    tags: ['job search', 'junior developer', 'resume', 'portfolio', 'github', 'first job', 'ai coding assistant'],
    technologies: ['git', 'github', 'python', 'llm'],
    goals: ['get-job', 'become-developer', 'learn-ai-dev'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  freelancer: {
    category: 'build-and-monetize',
    tags: ['freelance', 'virtual assistant', 'va', 'upwork', 'onlinejobs.ph', 'fiverr', 'proposals', 'pricing', 'clients'],
    technologies: ['llm'],
    goals: ['freelance'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  builder: {
    category: 'vibe-coding',
    tags: ['vibe coding', 'no code', 'app builder', 'website', 'prototype', 'non programmer', 'ai app builder'],
    technologies: ['llm'],
    goals: ['build-website', 'build-mobile-app', 'build-sell-app', 'learn-ai-dev'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  experienced: {
    category: 'ai-workflows',
    tags: ['code with ai', 'refactoring', 'code review', 'legacy code', 'agentic workflows', 'ai policy', 'senior developer', 'testing with ai'],
    technologies: ['llm', 'git', 'claude-code', 'cursor', 'codex'],
    goals: ['learn-ai-dev', 'become-developer'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  educator: {
    category: 'careers',
    tags: ['teaching', 'teacher', 'professor', 'instructor', 'lesson plans', 'assignments', 'academic honesty', 'rubrics', 'classroom'],
    technologies: ['llm'],
    goals: ['teach', 'learn-ai-dev'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  'mini-python-ai': {
    category: 'vibe-coding',
    tags: ['python for ai', 'api call', 'json', 'command line', 'rate limits', 'virtual environment'],
    technologies: ['python', 'llm', 'rest'],
    goals: ['learn-ai-dev', 'learn-programming'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  'mini-ai-engineering': {
    category: 'advanced-ai-engineering',
    tags: ['ai engineer', 'prompt design', 'rag', 'tool calling', 'function calling', 'agents', 'evaluation', 'evals'],
    technologies: ['llm', 'rag', 'ai-agents', 'python'],
    goals: ['learn-ai-dev', 'become-developer', 'get-job'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  'mini-ai-qa': {
    category: 'ai-workflows',
    tags: ['qa tester', 'test cases', 'bug reports', 'edge cases', 'test data', 'testing ai features', 'playwright'],
    technologies: ['playwright', 'llm'],
    goals: ['learn-ai-dev', 'get-job'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  'mini-ai-data': {
    category: 'careers',
    tags: ['data analyst', 'data cleaning', 'sql', 'charts', 'reports', 'automation', 'privacy', 'insights'],
    technologies: ['python', 'sql', 'llm'],
    goals: ['learn-ai-dev', 'get-job'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  'mini-no-code-automation': {
    category: 'build-and-monetize',
    tags: ['automation', 'no code', 'zapier', 'make', 'workflows', 'triggers', 'actions', 'ai step', 'clients'],
    technologies: ['llm'],
    goals: ['freelance', 'build-sell-app', 'learn-ai-dev'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  'mini-sell-your-app': {
    category: 'build-and-monetize',
    tags: ['sell an app', 'pricing', 'landing page', 'waitlist', 'payments', 'launch', 'marketing', 'customers', 'entrepreneurship', 'startup'],
    technologies: ['llm'],
    goals: ['build-sell-app', 'freelance'],
    prerequisites: [],
    published: FIRST_RELEASE,
    availability: 'available',
  },
  'ai-dev-intro': {
    category: 'ai-coding-fundamentals',
    tags: ['ai coding', 'hallucinations', 'responsible ai', 'secure coding', 'workflow', 'llm', 'ai assisted development'],
    technologies: ['llm', 'chatgpt', 'claude', 'cursor', 'codex', 'claude-code'],
    goals: ['learn-ai-dev', 'become-developer'],
    prerequisites: [],
    published: AI_PATH_RELEASE,
    availability: 'available',
  },
  'ai-dev-chatgpt': {
    category: 'ai-coding-tools',
    tags: ['chatgpt', 'prompt engineering', 'debugging', 'refactoring', 'tests', 'documentation', 'architecture planning', 'full stack'],
    technologies: ['chatgpt', 'openai', 'javascript', 'react', 'sql'],
    goals: ['learn-ai-dev', 'become-developer'],
    prerequisites: ['ai-dev-intro'],
    published: AI_PATH_RELEASE,
    availability: 'available',
  },
  'ai-dev-claude': {
    category: 'ai-coding-tools',
    tags: ['claude', 'code analysis', 'long context', 'react native components', 'backend', 'code review', 'architecture'],
    technologies: ['claude', 'react', 'react-native', 'express', 'sql'],
    goals: ['learn-ai-dev', 'become-developer'],
    prerequisites: ['ai-dev-intro'],
    published: AI_PATH_RELEASE,
    availability: 'available',
  },
  'ai-dev-claude-code': {
    category: 'ai-coding-tools',
    tags: ['claude code', 'terminal', 'claude.md', 'subagents', 'mcp', 'permissions', 'pull requests', 'agentic development'],
    technologies: ['claude-code', 'claude', 'mcp', 'git', 'github'],
    goals: ['learn-ai-dev', 'become-developer'],
    prerequisites: ['ai-dev-intro'],
    published: AI_PATH_RELEASE,
    availability: 'available',
  },
  'ai-dev-cursor': {
    category: 'ai-coding-tools',
    tags: ['cursor', 'ai editor', 'agent', 'composer', 'rules', 'codebase indexing', 'tab completion', 'refactoring'],
    technologies: ['cursor', 'git'],
    goals: ['learn-ai-dev', 'become-developer'],
    prerequisites: ['ai-dev-intro'],
    published: AI_PATH_RELEASE,
    availability: 'available',
  },
  'ai-dev-codex': {
    category: 'ai-coding-tools',
    tags: ['codex', 'coding agent', 'delegation', 'pull requests', 'parallel tasks', 'cloud agent', 'agents.md'],
    technologies: ['codex', 'openai', 'git', 'github'],
    goals: ['learn-ai-dev', 'become-developer'],
    prerequisites: ['ai-dev-intro'],
    published: AI_PATH_RELEASE,
    availability: 'available',
  },
  'ai-dev-advanced': {
    category: 'advanced-ai-engineering',
    tags: ['context engineering', 'spec driven development', 'multi agent', 'mcp', 'model routing', 'token cost', 'ai code review', 'capstone'],
    technologies: ['claude-code', 'cursor', 'codex', 'mcp', 'ai-agents', 'llm'],
    goals: ['learn-ai-dev', 'become-developer', 'get-job'],
    prerequisites: ['ai-dev-claude-code', 'ai-dev-cursor'],
    published: AI_PATH_RELEASE,
    availability: 'available',
  },
};

const FROM_SYLLABUS: Record<string, CourseMeta> = Object.fromEntries(
  CATALOG_SYLLABUS.map((entry) => [
    entry.id,
    {
      category: entry.category,
      tags: entry.tags,
      technologies: entry.technologies,
      goals: entry.goals,
      prerequisites: entry.prerequisites,
      published: CATALOG_RELEASE,
      availability: 'available',
    } satisfies CourseMeta,
  ]),
);

/** Every course's metadata, by course id. */
export const COURSE_META: Readonly<Record<string, CourseMeta>> = { ...EXISTING, ...FROM_SYLLABUS };

const FALLBACK: CourseMeta = { category: 'careers', tags: [], technologies: [], goals: [], prerequisites: [], published: FIRST_RELEASE, availability: 'available' };

/** A course's metadata; a course added without a row still works everywhere (a general category, no tags). The tests list any course missing one. */
export function courseMeta(course: Pick<Course, 'id'>): CourseMeta {
  return COURSE_META[course.id] ?? FALLBACK;
}
