import type { Language } from '@/lib/i18n';

import type { QuizQuestion } from '../content/types';
import { PLACEMENT_QUESTIONS_FIL, PLACEMENT_TIER_LABELS_FIL } from './ai-placement-strings';

/**
 * "Where should I start?" for the AI-Assisted Development path: eight questions in four tiers, each
 * about what a developer does with AI tools (not which product names they know), so the answers stay
 * true as the tools change. The learner starts at the first tier they don't fully pass.
 */
export type PlacementTier = 1 | 2 | 3 | 4;
export type PlacementQuestion = QuizQuestion & { tier: PlacementTier };

export const PLACEMENT_TIERS: Record<PlacementTier, { label: string; courseId: string }> = {
  1: { label: 'Foundations', courseId: 'ai-dev-intro' },
  2: { label: 'Working with chat assistants', courseId: 'ai-dev-chatgpt' },
  3: { label: 'Working with coding agents', courseId: 'ai-dev-claude-code' },
  4: { label: 'Advanced AI engineering', courseId: 'ai-dev-advanced' },
};

export const PLACEMENT_QUESTIONS: readonly PlacementQuestion[] = [
  {
    id: 'ai-placement-q1',
    tier: 1,
    prompt: 'An AI assistant tells you to install a package you have never heard of to fix a bug. What do you do first?',
    choices: ['Install it and run the tests', 'Look it up on the official package registry: does it exist, who publishes it, is it maintained?', 'Ask the assistant whether the package is safe', 'Install it with a flag that skips the warnings'],
    answer: 1,
    explanation: 'Models sometimes invent package names, and attackers register such names with harmful code. Check the registry and the project before anything is installed.',
  },
  {
    id: 'ai-placement-q2',
    tier: 1,
    prompt: 'Why can a coding assistant be wrong about your project while sounding completely sure?',
    choices: ['It predicts likely text from what it was given, and it only knows the parts of your project that are in its context', 'It reads an old copy of your server', 'It runs your code and misreads the output', 'It always answers from a web search'],
    answer: 0,
    explanation: 'A language model writes the most likely continuation of its context. If the relevant code or docs are not in that context, it can fill the gap fluently and wrongly.',
  },
  {
    id: 'ai-placement-q3',
    tier: 2,
    prompt: 'Which request is most likely to get a correct fix for a failing function?',
    choices: ['"Fix my code."', 'The function, the exact error and stack trace, the input that fails, what you expected versus what happened, and your constraints', '"Act as a senior developer and improve this."', 'Only the error message, so the answer stays short'],
    answer: 1,
    explanation: 'The assistant can only reason about what you give it. The failing input, the real error and the expected result turn a guess into a diagnosis.',
  },
  {
    id: 'ai-placement-q4',
    tier: 2,
    prompt: 'An assistant rewrote a 200-line module for you. What is the strongest check before you merge it?',
    choices: ['It compiles without errors', 'Read the diff, run the existing tests, and add tests for the behaviour it touched', 'Ask the assistant whether behaviour changed', 'Check that the new version is shorter'],
    answer: 1,
    explanation: 'Compiling proves little and the model cannot vouch for itself. Tests that pin the behaviour, plus your own reading of the diff, are what catch a quiet change.',
  },
  {
    id: 'ai-placement-q5',
    tier: 3,
    prompt: 'You ask a coding agent to add a feature to a repository it has never seen. What should happen before it edits any file?',
    choices: ['Give it full permissions so it can move fast', 'It explores the code and proposes a plan, the files it will change and how it will test, and you review that plan', 'Paste the whole repository into one prompt', 'Let it start with the README'],
    answer: 1,
    explanation: 'Planning first is cheap and catches wrong assumptions before they spread across files. You approve the plan; then it implements and tests.',
  },
  {
    id: 'ai-placement-q6',
    tier: 3,
    prompt: 'What belongs in a project instructions file for a coding agent?',
    choices: ['The company history, so it understands the mission', 'How to build, test and lint, the project’s conventions, and what it must never touch', 'Your API keys, so it can deploy', 'A list of every file in the repository'],
    answer: 1,
    explanation: 'Agents read the file on every task, so it should hold what they cannot discover cheaply and what they must not do. Secrets never go in it.',
  },
  {
    id: 'ai-placement-q7',
    tier: 4,
    prompt: 'One agent writes code and a second reviews it, with the same model and the same context. What is the main risk?',
    choices: ['It will be too slow', 'The reviewer shares the writer’s blind spots, so you still need independent checks: tests, explicit criteria, a human or a different setup', 'The reviewer will reject everything', 'It always costs less than one agent'],
    answer: 1,
    explanation: 'Two copies of the same reasoning tend to agree on the same mistakes. Independent evidence, above all tests and clear acceptance criteria, is what makes review mean something.',
  },
  {
    id: 'ai-placement-q8',
    tier: 4,
    prompt: 'Token use doubled after you added a long instructions file and many tool integrations. Which change most likely helps without hurting quality?',
    choices: ['Use the largest model for every task', 'Keep standing instructions short, load detailed docs and tools only when a task needs them, and start fresh between unrelated tasks', 'Remove the tests from the context', 'Paste the whole repository each time so nothing is re-read'],
    answer: 1,
    explanation: 'Everything in the context is paid for on every turn. Lean standing context, on-demand detail and a clean slate between tasks cut cost and usually improve focus.',
  },
];

/** The questions in the learner's language (English by default); ids, answers and tiers never change. */
export function placementQuestions(language: Language = 'en'): readonly PlacementQuestion[] {
  if (language !== 'fil') return PLACEMENT_QUESTIONS;
  return PLACEMENT_QUESTIONS.map((question) => ({ ...question, ...PLACEMENT_QUESTIONS_FIL[question.id] }));
}

/** A tier's name in the learner's language. */
export function placementTierLabel(tier: PlacementTier, language: Language = 'en'): string {
  return language === 'fil' ? PLACEMENT_TIER_LABELS_FIL[tier] : PLACEMENT_TIERS[tier].label;
}

export type Placement = {
  /** Where to start: the course of the first tier not fully passed (the last tier when all pass). */
  startCourseId: string;
  startTier: PlacementTier;
  tiers: { tier: PlacementTier; label: string; correct: number; total: number }[];
  /** True when every question was right: the learner may go straight to the advanced course. */
  allPassed: boolean;
};

/** Places a learner from the questions they got wrong (ids), using the order of the tiers. */
export function placeInPath(missedIds: readonly string[], questions: readonly PlacementQuestion[] = PLACEMENT_QUESTIONS, language: Language = 'en'): Placement {
  const missed = new Set(missedIds);
  const tierIds = [1, 2, 3, 4] as const;
  const tiers = tierIds.map((tier) => {
    const inTier = questions.filter((question) => question.tier === tier);
    return { tier, label: placementTierLabel(tier, language), correct: inTier.filter((question) => !missed.has(question.id)).length, total: inTier.length };
  });
  const firstGap = tiers.find((entry) => entry.correct < entry.total);
  const startTier = firstGap?.tier ?? 4;
  return { startCourseId: PLACEMENT_TIERS[startTier].courseId, startTier, tiers, allPassed: !firstGap };
}
