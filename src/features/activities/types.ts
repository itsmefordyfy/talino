import type { CodeTests, SqlExpectation, SqlRunResult } from '@/features/code-runner';
import type { Audience } from '@/features/courses/content/levels';
import type { MatrixResult } from '@/features/productivity/lib/matrix';
import type { PlanningAnswer, PlanningChallenge, ScheduleResult } from '@/features/productivity/types';

export type { CodeTests, SqlExpectation };

export const ACTIVITY_KINDS = ['tap-reveal', 'predict-output', 'fix-bug', 'arrange', 'fill-blank', 'match', 'scenario', 'code-challenge', 'sql-challenge', 'roleplay', 'message-review', 'prompt-lab', 'workflow-builder', 'planning'] as const;
export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

/** How much help the learner gets: guided offers hints early, independent keeps only the last two. */
export type Guidance = 'guided' | 'standard' | 'independent';

/** Shared by every kind. Ids are kebab-case and unique across all activities. */
export type ActivityBase = {
  id: string;
  /** The experience levels this activity is written for (an extra challenge for advanced learners, a gentler warm-up for beginners). No range = everyone. */
  audience?: Audience;
  title: string;
  /** What to do, in a sentence or two. `**bold**` and `` `code` `` are drawn as such. */
  prompt: string;
  /** From a gentle nudge to nearly the answer; shown one at a time, in order. */
  hints: string[];
  /** Shown once the activity is solved: why the answer is the answer. */
  explanation: string;
  /** One light line of narrative above the prompt. */
  story?: string;
  /** The skill this teaches, e.g. "loops". */
  concept: string;
  /** The concept's name in another language, for display only: `concept` stays English because adaptive practice keys its stats on it. */
  conceptLabel?: string;
};

export type TapRevealActivity = ActivityBase & {
  kind: 'tap-reveal';
  cards: { front: string; back: string }[];
};

export type PredictOutputActivity = ActivityBase & {
  kind: 'predict-output';
  language: string;
  code: string;
  /**
   * The printed output, lines joined with "\n". Required unless `language` is javascript, where it is
   * computed by running the snippet (and, if given, must agree with the run: validateActivity checks).
   */
  expected?: string;
  /** Pick one instead of typing. One of them must equal the output. */
  choices?: string[];
  /** Why a specific wrong choice (or typed answer) is wrong, keyed by that answer text. */
  wrongNotes?: Record<string, string>;
};

export type FixOption = {
  /** The replacement for the buggy line (its indentation is kept from the original). */
  line: string;
  correct: boolean;
  /** Why this fix works or does not. */
  why: string;
};

export type FixBugActivity = ActivityBase & {
  kind: 'fix-bug';
  language: string;
  code: string;
  /** 1-based line of the bug. */
  bugLine: number;
  /** Shown as choices, or, with `typed`, used to recognise typed lines (correct ones accepted, wrong ones explained). */
  fixes: FixOption[];
  /** The learner types the corrected line instead of choosing it. */
  typed?: boolean;
  /** Why tapping some other line is wrong; defaults to a generic sentence. */
  lineNote?: string;
  /** JavaScript only: a corrected program that passes these tests is accepted even if it matches no listed fix. */
  tests?: CodeTests;
};

export type ArrangeActivity = ActivityBase & {
  kind: 'arrange';
  language: string;
  /** The program's lines in the right order, with their indentation. */
  solution: string[];
  /** Other accepted orders (e.g. independent lines swapped): each a permutation of `solution`. */
  alternatives?: string[][];
  /** Why the line at each position of `solution` goes there; used to explain the first wrong line. */
  reasons?: string[];
  /** JavaScript only: every accepted order must pass these (checked by validateActivity). */
  tests?: CodeTests;
};

export type BlankSpec = {
  /** Accepted answers; the first is the canonical one. */
  answers: string[];
  /** Why a wrong answer is wrong. */
  feedback?: string;
};

export type FillBlankActivity = ActivityBase & {
  kind: 'fill-blank';
  language: string;
  /** Code with `___` where a blank goes. */
  code: string;
  blanks: BlankSpec[];
  /** Words to pick from (include distractors). Without a bank the learner types each blank. */
  bank?: string[];
  /** JavaScript only: the program with the canonical answers filled in must pass these (checked by validateActivity). */
  tests?: CodeTests;
};

export type MatchPair = { term: string; definition: string; /** Shown when the definition is wrongly paired with another term. */ note?: string };

export type MatchActivity = ActivityBase & {
  kind: 'match';
  pairs: MatchPair[];
  /**
   * The two lists' headings when they aren't terms and meanings, e.g. "Situations" / "What was missing". A match should make the
   * learner apply an idea (a situation to the concept it shows), never re-ask a list printed just above it.
   */
  labels?: { terms: string; meanings: string };
};

export type ScenarioQuality = 'best' | 'acceptable' | 'poor';

export type ScenarioOption = {
  text: string;
  /** What happens if the learner picks this. */
  consequence: string;
  quality: ScenarioQuality;
};

export type ScenarioActivity = ActivityBase & {
  kind: 'scenario';
  situation: string;
  options: ScenarioOption[];
};

/** A tiny robot on a grid. The learner's program calls the commands; the final world is checked. */
export type RobotWorld = {
  width: number;
  height: number;
  start: { x: number; y: number };
  /** The cell the robot must end on. */
  goal: { x: number; y: number };
  walls: { x: number; y: number }[];
  /** Items to collect with `pickUp()` (the robot must stand on one). All must be collected. */
  items: { x: number; y: number }[];
  /** Commands the program may call; they are the only functions provided. */
  commands: RobotCommand[];
};

export const ROBOT_COMMANDS = ['moveRight', 'moveLeft', 'moveUp', 'moveDown', 'pickUp'] as const;
export type RobotCommand = (typeof ROBOT_COMMANDS)[number];

export type RobotTests = { kind: 'robot'; world: RobotWorld };
export type ChallengeTests = CodeTests | RobotTests;

export type CodeChallengeActivity = ActivityBase & {
  kind: 'code-challenge';
  language: 'javascript';
  starter: string;
  tests: ChallengeTests;
  /** A reference solution; validateActivity runs it against `tests`. */
  solution: string;
};

export type SqlChallengeActivity = ActivityBase & {
  kind: 'sql-challenge';
  /** CREATE TABLE / INSERT statements that build the practice database. */
  setup: string;
  starter?: string;
  expected: SqlExpectation;
  /** A reference query; validateDeep runs it against `expected`. */
  solution: string;
};

/**
 * A live conversation with a simulated person (Soft Skills course). The scenario is `practice/scenarios` by id. Done when the learner
 * has had at least the scenario's `minTurns` turns and the debrief was delivered; the score is stored, XP is paid once. `prompt`
 * and `hints` coach the approach (never a model answer).
 */
export type RoleplayActivity = ActivityBase & {
  kind: 'roleplay';
  scenarioId: string;
};

/** A message the learner writes and the message coach reviews against a `MessageTask` (`practice/scenarios`) by id. */
export type MessageReviewActivity = ActivityBase & {
  kind: 'message-review';
  taskId: string;
};

/**
 * The Prompt Playground, an AI Experiment Lab task or a Model Comparison (Generative AI course): the learner edits a prompt and runs it on a live
 * model against a `LabTask` (`practice/labs`) by id. Done when at least one run came back and the review of the learner's prompt was delivered;
 * XP once; the score is stored but completing never depends on it. `hints` coach the approach and never hold a model prompt.
 */
export type PromptLabActivity = ActivityBase & {
  kind: 'prompt-lab';
  labId: string;
};

/**
 * The Productivity Challenge (Time Management and Productivity course): sort a fictional workload into the Eisenhower matrix (`mode: 'prioritize'`) or build a
 * day from tasks, fixed commitments and an optional interruption (`mode: 'schedule'`). Checked by rules in `features/productivity` (never by a model); a
 * schedule that overlaps, runs past the day, drops a must-do task, has no break or no slack never passes. The scenario is data in the lesson, with a
 * reference solution that `validateActivity` runs against the scenario's own rules.
 */
export type PlanningActivity = ActivityBase & {
  kind: 'planning';
  challenge: PlanningChallenge;
};

/** Lanes of the Workflow Builder, in the order work flows through them. */
export const WORKFLOW_LANES = ['input', 'ai', 'tool', 'human', 'output'] as const;
export type WorkflowLane = (typeof WORKFLOW_LANES)[number];

export type WorkflowPart = {
  id: string;
  lane: WorkflowLane;
  /** A short name for the step ("Draft a reply with AI"). */
  label: string;
  /** One sentence on what happens in this step. */
  detail: string;
};

/**
 * `require`: every part in `parts` is in the workflow. `forbid`: none of them is. `before`: `parts` is `[a, b]`, and when both are in the workflow `a` comes
 * first (a rule about order never forces a part in; add a `require` for that). `message` is what the learner reads when the rule is broken: why, not just what.
 */
export type WorkflowRule = { id: string; kind: 'require' | 'forbid' | 'before'; parts: string[]; message: string };

/**
 * The AI Workflow Builder (Generative AI course): the learner picks and orders steps (input, AI processing, tool or action, human review, output) from a
 * palette that includes tempting wrong steps, and the rules are checked by code (no model call). Once it passes, `simulation` plays a sample request through
 * the chosen steps; it is hand-written and the screen labels it "Simulated run, not a real model". Done when the workflow satisfies every rule.
 */
export type WorkflowBuilderActivity = ActivityBase & {
  kind: 'workflow-builder';
  /** The business situation and what the workflow must achieve (2 to 4 sentences). */
  situation: string;
  parts: WorkflowPart[];
  rules: WorkflowRule[];
  /** One valid order of part ids; `validateActivity` checks it satisfies every rule. */
  solution: string[];
  minSteps: number;
  maxSteps: number;
  /** The sample request, and what each step of the *solution* does with it (keyed by part id), and the final output. Hand-written. */
  simulation: { input: string; steps: Record<string, string>; output: string };
};

export type Activity =
  | TapRevealActivity
  | PredictOutputActivity
  | FixBugActivity
  | ArrangeActivity
  | FillBlankActivity
  | MatchActivity
  | ScenarioActivity
  | CodeChallengeActivity
  | SqlChallengeActivity
  | RoleplayActivity
  | MessageReviewActivity
  | PromptLabActivity
  | WorkflowBuilderActivity
  | PlanningActivity;

/** What the learner submitted, per kind. */
export type ActivityAnswer =
  | { kind: 'tap-reveal'; opened: number[] }
  | { kind: 'predict-output'; text: string }
  | { kind: 'fix-bug'; line: number; fix?: string }
  | { kind: 'arrange'; order: string[] }
  | { kind: 'fill-blank'; values: string[] }
  /** term index to definition index (indexes into `pairs`; a definition is named by the index of the pair it belongs to). */
  | { kind: 'match'; pairs: Record<number, number> }
  | { kind: 'scenario'; option: number }
  | { kind: 'code-challenge'; code: string }
  | { kind: 'sql-challenge'; query: string }
  /** Part ids in the learner's order. */
  | { kind: 'workflow-builder'; order: string[] }
  | ({ kind: 'planning' } & PlanningAnswer);

export type CaseOutcome = { label: string; pass: boolean; hidden: boolean; message: string };

export type CheckDetail =
  | { kind: 'tap-reveal'; remaining: number }
  | { kind: 'predict-output'; actualLines: number; expectedLines: number }
  | { kind: 'fix-bug'; stage: 'line' | 'fix' | 'done' }
  | { kind: 'arrange'; /** 0-based index of the first line out of place, or null. */ firstWrong: number | null; inPlace: boolean[] }
  | { kind: 'fill-blank'; blanks: { correct: boolean; feedback: string }[] }
  | { kind: 'match'; right: number[]; wrong: number[] }
  | { kind: 'scenario'; quality: ScenarioQuality }
  | { kind: 'code-challenge'; passed: number; total: number; cases: CaseOutcome[]; output: string[]; error: string | null; world?: RobotOutcome }
  | { kind: 'sql-challenge'; result: SqlRunResult | null }
  | { kind: 'workflow-builder'; /** Ids of the rules the workflow breaks, in rule order. */ broken: string[]; steps: number }
  | { kind: 'planning'; mode: 'prioritize'; matrix: MatrixResult }
  | { kind: 'planning'; mode: 'schedule'; schedule: ScheduleResult };

export type CheckResult = {
  correct: boolean;
  /** 0..1 when some of it is right. */
  partial?: number;
  /** Set on a step forward that is not a try at the whole answer (the right line was tapped, one more pair matched): not counted as a wrong try. */
  progress?: true;
  feedback: string;
  detail?: CheckDetail;
};

/** Where the robot ended up, for drawing. */
export type RobotOutcome = {
  position: { x: number; y: number };
  collected: { x: number; y: number }[];
  path: { x: number; y: number }[];
  /** Set when the robot stopped early: it hit a wall, the edge, or picked up nothing. */
  stoppedAt: number | null;
  reachedGoal: boolean;
};
