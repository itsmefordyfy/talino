import type { GoalId, InterestId } from '../../../onboarding/lib/options';
import { NOT_SURE } from '../../../onboarding/lib/options';
import type { CourseFacts } from '../catalog-facts';
import { FLAT_RARITY, LEVEL_INDEX, matchTarget, mentions, type TopicTarget } from './match';

/**
 * What onboarding's answers mean in catalog terms. Every goal and interest is described by categories, technology ids
 * (`content/catalog/technologies.ts`), learning-goal ids and tag words, never by a course id: the recommendations find the
 * courses by matching these against each course's metadata, so adding or renaming a course needs no change here.
 *
 * Talino teaches software building with AI (2026-11-14): there are no courses about a language or a framework. An interest
 * that names one (JavaScript, React, Flutter, Swift…) is flagged `usedAsTool`: it lifts the AI-first courses that use that
 * technology as a tool (the course lists it in its metadata), and `topicCoverage` reports it as `related` ("covered in
 * context"), never as a course of its own and never as "coming soon" for a course that will not exist. Where no course lists
 * the technology at all, `near` points at the nearest categories and words.
 */

export type GoalTarget = TopicTarget & {
  /** Someone with this goal wants to go further: courses above beginner level get a small lift for them. */
  stretch?: boolean;
};

export type InterestTarget = TopicTarget & {
  /** A language, framework or computer-science topic with no course of its own: AI-first courses use it, and coverage says so. */
  usedAsTool?: boolean;
};

export const GOAL_TARGETS: Record<GoalId, GoalTarget> = {
  'from-scratch': { goals: ['learn-programming'], categories: ['ai-coding-fundamentals'], tags: ['beginner', 'prompts', 'first app'] },
  'software-engineer': { goals: ['become-developer', 'get-job'], categories: ['ai-coding-fundamentals', 'ai-workflows', 'advanced-ai-engineering', 'ai-coding-tools'] },
  frontend: { goals: ['build-website'], categories: ['vibe-coding'], technologies: ['html-css', 'react', 'javascript', 'typescript', 'tailwind', 'nextjs'], tags: ['frontend', 'website'] },
  backend: { categories: ['ai-workflows'], technologies: ['rest', 'postgresql', 'auth', 'nodejs', 'express', 'supabase', 'mongodb', 'aspnet-core'], tags: ['backend', 'api', 'database'] },
  'full-stack': { goals: ['build-website', 'build-sell-app'], categories: ['vibe-coding', 'ai-workflows'], technologies: ['react', 'postgresql', 'supabase', 'auth', 'nodejs', 'typescript', 'nextjs'], tags: ['full stack', 'deployment', 'web app', 'backend'] },
  mobile: { goals: ['build-mobile-app'], categories: ['vibe-coding'], technologies: ['expo', 'react-native', 'flutter'], tags: ['mobile', 'iphone', 'android'] },
  ai: { goals: ['learn-ai-dev'], categories: ['ai-coding-tools', 'advanced-ai-engineering'], technologies: ['llm', 'ai-agents', 'rag', 'claude-code', 'cursor', 'codex', 'mcp', 'openai', 'claude'], tags: ['ai app', 'agents', 'agentic', 'ai coding'] },
  // There is no data-science course; the nearest are the data analyst and database courses and Python for AI.
  'data-science': { technologies: ['python', 'sql', 'postgresql'], tags: ['data analyst', 'data cleaning', 'charts', 'insights', 'analytics', 'database'] },
  // The catalog has no game course; the nearest are the courses that build a first app by directing AI.
  'game-dev': { categories: ['ai-coding-fundamentals'], tags: ['game', 'game development'], near: { categories: ['vibe-coding'], tags: ['prototype', 'first app', 'vibe coding', 'mobile app'] } },
  'improve-skills': {
    categories: ['ai-workflows', 'advanced-ai-engineering', 'ai-coding-tools'],
    technologies: ['claude-code', 'cursor', 'codex'],
    tags: ['refactoring', 'code review', 'architecture', 'existing codebase', 'legacy code', 'context engineering', 'spec driven development', 'agentic coding', 'coding agent', 'multi agent', 'mcp'],
    stretch: true,
  },
  'interview-prep': { goals: ['get-job'], categories: ['careers'], tags: ['interview', 'coding interview', 'job search', 'portfolio'] },
  'build-startup': { goals: ['build-sell-app'], categories: ['build-and-monetize', 'ai-workflows'], tags: ['startup', 'launch', 'mvp', 'sell an app', 'saas'] },
  // Computer science through AI: reading and explaining the code AI writes, and how software is put together.
  'explore-cs': { goals: ['learn-programming'], categories: ['ai-coding-fundamentals', 'ai-workflows', 'advanced-ai-engineering'], tags: ['reading code', 'explain code', 'architecture'] },
  freelance: { goals: ['freelance'], categories: ['build-and-monetize'], tags: ['freelance', 'virtual assistant', 'clients', 'proposals', 'upwork'] },
  teach: { goals: ['teach'], tags: ['teaching', 'teacher', 'classroom', 'lesson plans', 'educator', 'instructor'] },
};

export type TopicInterestId = Exclude<InterestId, typeof NOT_SURE>;

export const INTEREST_TARGETS: Record<TopicInterestId, InterestTarget> = {
  // Languages: used by the AI-first courses as the code the AI writes; none has a course of its own.
  javascript: { usedAsTool: true, technologies: ['javascript'], tags: ['javascript'], near: { technologies: ['react', 'html-css'] } },
  typescript: { usedAsTool: true, technologies: ['typescript'], tags: ['typescript'], near: { technologies: ['javascript', 'react', 'nextjs'], tags: ['full stack', 'web app'] } },
  python: { usedAsTool: true, technologies: ['python'], tags: ['python'] },
  java: { usedAsTool: true, tags: ['java'], near: { categories: ['ai-coding-fundamentals'], tags: ['reading code', 'explain code', 'backend', 'api'] } },
  csharp: { usedAsTool: true, technologies: ['csharp', 'aspnet-core'], tags: ['c#'], near: { categories: ['ai-workflows'], technologies: ['rest'], tags: ['backend', 'api'] } },
  cpp: { usedAsTool: true, tags: ['c++', 'cpp'], near: { categories: ['ai-coding-fundamentals'], tags: ['reading code', 'explain code', 'debugging'] } },
  php: { usedAsTool: true, tags: ['php'], near: { categories: ['ai-workflows'], tags: ['backend', 'server', 'api'] } },
  go: { usedAsTool: true, tags: ['golang'], near: { categories: ['ai-workflows'], tags: ['backend', 'server', 'api'] } },
  swift: { usedAsTool: true, tags: ['swift', 'swiftui'], near: { categories: ['vibe-coding'], technologies: ['expo', 'react-native'], tags: ['iphone', 'ios'] } },
  kotlin: { usedAsTool: true, tags: ['kotlin'], near: { categories: ['vibe-coding'], technologies: ['expo', 'react-native'], tags: ['android'] } },
  sql: { usedAsTool: true, technologies: ['sql', 'postgresql'], tags: ['sql'] },
  // Web
  'html-css': { usedAsTool: true, technologies: ['html-css'], tags: ['html', 'css'] },
  react: { usedAsTool: true, technologies: ['react'], tags: ['react'] },
  nextjs: { usedAsTool: true, technologies: ['nextjs'], tags: ['next js'], near: { technologies: ['react'], tags: ['full stack', 'website', 'deployment'] } },
  nodejs: { usedAsTool: true, technologies: ['nodejs'], tags: ['node js'], near: { categories: ['ai-workflows'], technologies: ['express', 'rest'], tags: ['backend', 'api'] } },
  express: { usedAsTool: true, technologies: ['express'], near: { categories: ['ai-workflows'], technologies: ['rest', 'nodejs'], tags: ['backend', 'api'] } },
  // These have AI-assisted courses of their own (AI-Assisted Backend Development, API Integration, Database Design).
  backend: { categories: ['ai-workflows'], technologies: ['rest', 'auth', 'postgresql', 'nodejs', 'express'], tags: ['backend', 'server'] },
  apis: { technologies: ['rest'], tags: ['api', 'api integration', 'rest'] },
  databases: { categories: ['ai-workflows'], technologies: ['postgresql', 'supabase', 'mongodb', 'firebase', 'sqlite'], tags: ['database'] },
  // Mobile
  'react-native': { usedAsTool: true, technologies: ['react-native'], tags: ['mobile app', 'iphone', 'android'] },
  expo: { usedAsTool: true, technologies: ['expo'], tags: ['mobile app', 'app store'] },
  flutter: { usedAsTool: true, technologies: ['flutter', 'dart'], tags: ['flutter'], near: { categories: ['vibe-coding'], technologies: ['react-native', 'expo'], tags: ['mobile app', 'iphone', 'android'] } },
  ios: { usedAsTool: true, near: { categories: ['vibe-coding'], technologies: ['expo', 'react-native'], tags: ['iphone', 'ios', 'app store'] } },
  android: { usedAsTool: true, near: { categories: ['vibe-coding'], technologies: ['expo', 'react-native'], tags: ['android', 'google play'] } },
  // AI
  ai: { categories: ['ai-coding-tools', 'advanced-ai-engineering'], technologies: ['llm', 'ai-agents', 'rag', 'claude-code', 'cursor', 'codex'], tags: ['ai app', 'agents', 'ai coding'] },
  'ai-coding': { categories: ['ai-coding-tools'], technologies: ['claude-code', 'cursor', 'codex', 'copilot', 'chatgpt', 'claude', 'gemini'], tags: ['ai coding', 'ai assisted', 'vibe coding', 'coding agent'] },
  genai: { technologies: ['llm', 'openai', 'gemini', 'chatgpt'], tags: ['genai', 'generative ai', 'prompt engineering', 'prompts'] },
  // No machine-learning course: the nearest are the AI engineering, Python for AI and data analyst courses.
  ml: { usedAsTool: true, tags: ['machine learning'], near: { categories: ['advanced-ai-engineering'], technologies: ['python', 'llm'], tags: ['data analyst', 'ai engineer', 'evaluation'] } },
  llm: { technologies: ['llm'], tags: ['language model', 'language models', 'llm'] },
  'ai-apps': { categories: ['advanced-ai-engineering'], technologies: ['openai', 'claude', 'ai-agents', 'rag'], tags: ['chatbot', 'assistant', 'ai app', 'ai product'] },
  rag: { usedAsTool: true, technologies: ['rag', 'vector-db'], tags: ['retrieval', 'rag'] },
  // Computer science
  dsa: { usedAsTool: true, tags: ['data structures', 'algorithms', 'big o'], near: { categories: ['ai-coding-fundamentals'], tags: ['reading code', 'explain code', 'interview'] } },
  oop: { usedAsTool: true, tags: ['oop', 'object oriented'], near: { categories: ['ai-coding-fundamentals', 'advanced-ai-engineering'], tags: ['reading code', 'architecture', 'refactoring'] } },
  architecture: { categories: ['advanced-ai-engineering'], tags: ['software architecture', 'architecture', 'clean architecture'] },
  'system-design': { categories: ['advanced-ai-engineering'], tags: ['system design', 'scalability', 'architecture'] },
  'db-management': { categories: ['ai-workflows'], technologies: ['postgresql', 'supabase', 'mongodb'], tags: ['database design', 'database', 'schema'] },
  networking: { usedAsTool: true, tags: ['networking', 'tcp', 'dns'], near: { categories: ['ai-workflows'], technologies: ['rest', 'cloud'], tags: ['api', 'deployment', 'http'] } },
  cybersecurity: { categories: ['advanced-ai-engineering'], technologies: ['owasp'], tags: ['cybersecurity', 'security', 'secure coding'] },
};

/**
 * `course`: a course is about the topic. `related`: no course of its own (a language, a framework), covered in context by the AI-first
 * courses that use it. `soon`: nothing in the catalog is near it (a tiny catalog; never a language the AI courses use).
 */
export type TopicStatus = 'course' | 'related' | 'soon';
export type TopicCoverage = { interest: TopicInterestId; status: TopicStatus; courseId: string | null };

const isTopicInterest = (interest: InterestId): interest is TopicInterestId => interest !== NOT_SURE;
export { isTopicInterest };

const NAMED_BONUS = 1.5;

/** Whether a word or phrase is in the course's title, as whole words ("architecture" is in "AI-Assisted Software Architecture"). */
function titleSays(course: CourseFacts, phrase: string): boolean {
  const words = (text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim()} `;
  return words(course.course.title).includes(words(phrase));
}

function bestMatch(facts: readonly CourseFacts[], target: TopicTarget): CourseFacts | null {
  let best: { facts: CourseFacts; total: number } | null = null;
  for (const course of facts) {
    if (course.availability !== 'available') continue;
    const match = matchTarget(course, target, FLAT_RARITY);
    if (match.total === 0) continue;
    // The course that is named after the topic (its title or id says it) is the one to point at, over one that merely uses it.
    const named = (target.technologies ?? []).some((technology) => mentions(course, technology)) || (target.tags ?? []).some((tag) => titleSays(course, tag));
    const total = match.total + (named ? NAMED_BONUS : 0);
    // The most central match wins; a tie goes to the course more of the catalog builds on, then the gentler level.
    const better =
      !best ||
      total > best.total + 1e-9 ||
      (Math.abs(total - best.total) < 1e-9 && (course.foundation > best.facts.foundation || (course.foundation === best.facts.foundation && LEVEL_INDEX[course.level] < LEVEL_INDEX[best.facts.level])));
    if (better) best = { facts: course, total };
  }
  return best?.facts ?? null;
}

/**
 * Whether the catalog really has a course for an interest, worked out from the courses it is given, so it updates itself
 * as courses are added: `course` (a course is about it), `related` (only a neighbouring course exists) or `soon` (nothing yet).
 */
export function topicCoverage(interest: TopicInterestId, facts: readonly CourseFacts[]): TopicCoverage {
  const target = INTEREST_TARGETS[interest];
  if (target.usedAsTool) {
    // No course teaches a language or framework: the nearest are the AI-first courses that use it as a tool, then the closest ones.
    const uses = bestMatch(facts, { technologies: target.technologies, tags: target.tags });
    const near = uses ?? bestMatch(facts, { technologies: target.near?.technologies, tags: target.near?.tags, categories: target.near?.categories });
    return near ? { interest, status: 'related', courseId: near.id } : { interest, status: 'soon', courseId: null };
  }
  const dedicated = { technologies: target.technologies, tags: target.tags };
  const direct = (target.technologies?.length ?? 0) + (target.tags?.length ?? 0) > 0 ? facts.filter((course) => course.availability === 'available' && matchTarget(course, dedicated, FLAT_RARITY).direct) : [];
  // Among the courses that are about it, one in the topic's own category is the one to point at (a course that merely lists a tool is not).
  const dedicatedBest = direct.length > 0 ? bestMatch(direct, { ...dedicated, categories: target.categories }) : null;
  if (dedicatedBest) return { interest, status: 'course', courseId: dedicatedBest.id };
  const near = bestMatch(facts, { technologies: target.near?.technologies, tags: target.near?.tags });
  if (near) return { interest, status: 'related', courseId: near.id };
  return { interest, status: 'soon', courseId: null };
}

/** A course matches a goal this strongly (a goal hit plus a category, technology or tags) before it counts as "a course for it". */
const STRONG_GOAL_MATCH = 4;

/**
 * Whether the catalog has a course that is really for a goal, derived from the courses given (so it updates itself):
 * `soon` for a goal such as game development that only has neighbouring courses.
 */
export function goalCoverage(goal: GoalId, facts: readonly CourseFacts[]): { goal: GoalId; status: 'course' | 'soon' } {
  const target = GOAL_TARGETS[goal];
  const covered = facts.some((course) => course.availability === 'available' && matchTarget(course, target, FLAT_RARITY).total >= STRONG_GOAL_MATCH);
  return { goal, status: covered ? 'course' : 'soon' };
}
