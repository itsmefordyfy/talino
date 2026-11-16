import type { Language } from '@/lib/i18n';

import type { CategoryId, CourseLevel, LearningGoalId } from '../types';
import { CATEGORIES, LEARNING_GOALS, LEVEL_LABELS, type CategoryDef } from './categories';
import type { LearningPathDef } from './paths';

/**
 * Tagalog (`fil`) names and descriptions of the catalog's categories, levels, learning goals and learning paths. The
 * English stays in `categories.ts` and `paths.ts` (ids are stored and used for filtering, so they never change); these
 * tables are keyed by the same ids, and `catalog-text.test.ts` fails when one is missing. Technology names are product
 * and tech terms (React, Docker, REST APIs…) and stay in English in both languages. Voice and glossary:
 * `docs/i18n/tagalog-style-guide.md`.
 */
export const CATEGORY_TEXT_FIL: Record<CategoryId, { label: string; description: string }> = {
  'ai-coding-fundamentals': { label: 'AI Coding Fundamentals', description: 'Magsimula dito: paano humingi ng software sa AI, basahin ang ginawa nito, at ayusin ito nang magkasama.' },
  'vibe-coding': { label: 'Vibe Coding at App Building', description: 'Gawing gumaganang website, mobile app o produkto ang isang ideya sa pamamagitan ng pag-direct sa AI.' },
  'ai-coding-tools': { label: 'AI Coding Tools', description: 'Makuha ang pinakamarami sa ChatGPT, Claude, Claude Code, Cursor, Codex, Copilot at Gemini.' },
  'ai-workflows': { label: 'AI-Assisted Development Workflows', description: 'Ilagay ang AI sa bawat hakbang: planning, design, backend, data, review, testing at deployment.' },
  'advanced-ai-engineering': { label: 'Advanced AI Software Engineering', description: 'Mga coding agent, MCP, context engineering, architecture at production-grade na trabaho.' },
  'build-and-monetize': { label: 'Build at Kumita gamit ang AI', description: 'I-launch, i-presyo, ibenta at palaguin ang ginawa mo, bilang produkto, freelancer o negosyo.' },
  careers: { label: 'Careers with AI', description: 'Dalhin ang AI sa trabaho mo: mga developer, guro, analyst at naghahanap ng trabaho.' },
};

export const LEVEL_LABELS_FIL: Record<CourseLevel, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

export const GOAL_LABELS_FIL: Record<LearningGoalId, string> = {
  'learn-programming': 'Matuto ng programming',
  'build-website': 'Gumawa ng website',
  'build-mobile-app': 'Gumawa ng mobile app',
  'learn-ai-dev': 'Matuto ng AI development',
  'become-developer': 'Maging software developer',
  'get-job': 'Makakuha ng dev job',
  freelance: 'Mag-freelance',
  'build-sell-app': 'Gumawa at magbenta ng app',
  teach: 'Magturo ng technology',
};

export const PATH_TEXT_FIL: Record<string, { title: string; description: string }> = {
  'master-ai': { title: 'Master AI-Powered Development', description: 'Ang pangunahing path: mula sa una mong pahinang gawa ng AI hanggang sa pag-direct ng mga coding agent, at bawat hakbang ay inilalagay sa sarili mong workflow.' },
  'first-app': { title: 'Buuin ang Una Mong App gamit ang AI', description: 'Hindi ka pa nag-code? Humingi sa AI ng website at phone app, unawain ang ginawa nito, ayusin ang itsura, at ayusin ito kapag nasira.' },
  'first-mobile-app': { title: 'Buuin ang Una Mong Mobile App gamit ang AI', description: 'Mula ideya hanggang app sa sarili mong phone: magplano ng mga screen, mag-prompt sa AI, ayusin ang design, lutasin ang mga problema, at pag-isipan kung paano kumita rito.' },
  'idea-to-launch': { title: 'Mula Ideya Hanggang Na-launch na Produkto', description: 'I-validate ang ideya, i-plano, bumuo ng kumpletong application o SaaS gamit ang AI, i-deploy, i-launch at kumita rito.' },
  'ai-coding-tools': { title: 'AI Coding Tools, Mastered', description: 'Kilalanin nang husto ang bawat pangunahing tool at piliin ang tama: ChatGPT, Claude, Gemini, Copilot, Claude Code, Cursor at Codex.' },
  'ai-assisted-developer': { title: 'AI-Assisted Developer', description: 'Ang pitong-kursong path sa ChatGPT, Claude, Claude Code, Cursor at Codex, tapos advanced na AI-powered engineering.' },
  'developer-workflows': { title: 'AI sa Developer Workflow Mo', description: 'Para sa mga nagtatrabahong developer: prompts, pagbasa at pag-review ng AI code, debugging, testing at pagpapabuti ng totoong proyekto gamit ang AI.' },
  'ai-products': { title: 'Bumuo ng AI-Powered na Produkto', description: 'Ilagay ang AI sa loob ng sarili mong produkto: models, prompts, chat, sarili mong data, actions, guardrails, at mga serbisyo sa paligid nito.' },
  'agentic-engineer': { title: 'Agentic Software Engineer', description: 'I-direct ang mga coding agent sa propesyonal na antas: agents, subagents, MCP, context, architecture, security at pamamahala ng komplikadong trabaho.' },
  'freelance-with-ai': { title: 'Mag-freelance at Magbenta gamit ang AI', description: 'Mag-alok ng AI-powered na serbisyo sa pagbuo: humanap ng client, mag-scope at mag-presyo nang tapat, mag-deliver, at palaguin ang maliit na software business.' },
  'build-and-sell': { title: 'Gumawa at Magbenta ng Sarili Mong App (Walang Code)', description: 'Gawing app na babayaran ng tao ang isang ideya, gamit ang mga AI builder sa halip na ikaw mismo ang mag-code.' },
};

// ---- Lookups by language (English comes from categories.ts and paths.ts; Tagalog from the tables above) ----

/** A category's name and one-line description in the learner's language. */
export function categoryText(category: CategoryId, language: Language): { label: string; description: string } {
  if (language === 'fil') return CATEGORY_TEXT_FIL[category];
  const def = CATEGORIES.find((entry) => entry.id === category);
  return { label: def?.label ?? category, description: def?.description ?? '' };
}

export function categoryLabel(category: CategoryId, language: Language): string {
  return categoryText(category, language).label;
}

/** Every category with its name and description in the learner's language (icons and ids unchanged). */
export function localizedCategories(language: Language): CategoryDef[] {
  return CATEGORIES.map((category) => ({ ...category, ...categoryText(category.id, language) }));
}

export function levelLabel(level: CourseLevel, language: Language): string {
  return language === 'fil' ? LEVEL_LABELS_FIL[level] : LEVEL_LABELS[level];
}

export function goalLabel(goal: LearningGoalId, language: Language): string {
  if (language === 'fil') return GOAL_LABELS_FIL[goal];
  return LEARNING_GOALS.find((entry) => entry.id === goal)?.label ?? goal;
}

/** A learning path's title and description in the learner's language. A path without a Tagalog entry falls back to its English text. */
export function pathText(path: LearningPathDef, language: Language): { title: string; description: string } {
  if (language === 'fil') return PATH_TEXT_FIL[path.id] ?? { title: path.title, description: path.description };
  return { title: path.title, description: path.description };
}
