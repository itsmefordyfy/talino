/**
 * The data model of the Time Management and Productivity course's tools and its graded planning activity
 * (spec: docs/superpowers/specs/2026-11-17-productivity-course-design.md). Plain data and types only, so the activity validator,
 * the lesson content and the tools all share one definition. Times are whole minutes since midnight (9:30 AM = 570).
 */

/** The four boxes of the Eisenhower matrix: do now, schedule it, hand it off, let it go. */
export const QUADRANTS = ['do', 'plan', 'delegate', 'drop'] as const;
export type Quadrant = (typeof QUADRANTS)[number];

export type Priority = 'high' | 'medium' | 'low';

/** What a learner may decide about a task that does not fit in the day. */
export const DECISION_ACTIONS = ['defer', 'delegate', 'decline', 'automate'] as const;
export type DecisionAction = (typeof DECISION_ACTIONS)[number];

/** A task of a sorting exercise. `expected` is the best box; `alsoAcceptable` are boxes a reasonable person might choose, with `why` explaining the call. */
export type MatrixTaskSpec = {
  id: string;
  title: string;
  /** One line of context that decides urgency or importance ("the client call is in two hours"). */
  detail?: string;
  expected: Quadrant;
  alsoAcceptable?: Quadrant[];
  why: string;
};

export type MatrixPlacements = Record<string, Quadrant | undefined>;

/** Something the learner must do in the day. `minutes` is the estimate. A task with a `deadline` must end by then. */
export type ScheduleTask = {
  id: string;
  title: string;
  minutes: number;
  priority: Priority;
  /** Minutes since midnight by which it must be finished. */
  deadline?: number;
  /** Not negotiable today: it must be in the plan, and in time. Never deferred. */
  mustDo?: boolean;
  /** What counts as a sensible decision if the task cannot fit. Defaults to every action. */
  okActions?: DecisionAction[];
};

export const FIXED_KINDS = ['meeting', 'class', 'personal', 'meal', 'rest', 'commute', 'interruption'] as const;
export type FixedKind = (typeof FIXED_KINDS)[number];

/** A commitment that is already in the day and cannot move: a meeting, a class, a meal, school pick-up. */
export type FixedBlock = { id: string; title: string; start: number; minutes: number; kind: FixedKind };

/** What the learner places in the day. */
export type BlockKind = 'task' | 'break' | 'buffer';
export type Block = { id: string; kind: BlockKind; taskId?: string; title: string; start: number; minutes: number };

export type Decision = { taskId: string; action: DecisionAction };

/** The day's rules. Every scenario may tune them; a scenario that leaves one out gets the default. */
export type ScheduleRules = {
  /** The longest stretch of work (tasks and meetings) allowed without a break. */
  maxFocusRun: number;
  /** A gap or break of at least this long ends a stretch of work. */
  minBreakMinutes: number;
  /** Total break and rest time the day must hold (explicit breaks plus meals and rest blocks). */
  minBreakTotal: number;
  /** The most task minutes a day may hold. */
  maxPlannedMinutes: number;
  /** Free or buffer time that must be left unplanned, because a day with no slack breaks on the first surprise. */
  minSlack: number;
};

export const DEFAULT_RULES: ScheduleRules = { maxFocusRun: 120, minBreakMinutes: 10, minBreakTotal: 30, maxPlannedMinutes: 360, minSlack: 20 };

export type Interruption = { id: string; title: string; start: number; minutes: number; /** What happened, shown when it arrives. */ note: string };

export type ScheduleScenario = {
  /** A short name for the day ("Friday at the co-working space"). */
  dayLabel: string;
  windowStart: number;
  windowEnd: number;
  fixed: FixedBlock[];
  tasks: ScheduleTask[];
  rules?: Partial<ScheduleRules>;
  /** Arrives after the learner's first plan: the plan must be rebuilt around it. */
  interruption?: Interruption;
};

export type ScheduleAnswer = { blocks: Block[]; decisions: Decision[]; /** The learner has rebuilt the plan after the interruption (true when the scenario has none). */ afterInterruption: boolean };

export type PlanDimension = 'prioritization' | 'timeAllocation' | 'realisticPlanning' | 'interruptions' | 'decisionMaking';
export const PLAN_DIMENSIONS: readonly PlanDimension[] = ['prioritization', 'timeAllocation', 'realisticPlanning', 'interruptions', 'decisionMaking'];

export type FindingLevel = 'blocker' | 'issue' | 'good';
/** What a check found, as a code and parameters; the screen turns it into words (`productivity/strings.ts`). */
export type Finding = {
  code:
    | 'overlap'
    | 'outsideWindow'
    | 'mustDoMissing'
    | 'mustDoLate'
    | 'deadlineMissed'
    | 'noBreak'
    | 'tooLittleBreak'
    | 'focusRunTooLong'
    | 'overPacked'
    | 'noSlack'
    | 'tooShort'
    | 'tooLong'
    | 'inversion'
    | 'lowBeforeHigh'
    | 'interruptionUnhandled'
    | 'interruptionOverlap'
    | 'decisionMissing'
    | 'decisionPoor'
    | 'mustDoDeferred'
    | 'allFit'
    | 'ruleKept';
  level: FindingLevel;
  dimension: PlanDimension;
  /** Task or block titles and numbers the sentence needs. */
  params: Record<string, string | number>;
};

export type ScheduleResult = {
  /** Every dimension that applies, 0 to 100 (the interruption dimension only exists when the scenario has one). */
  scores: Partial<Record<PlanDimension, number>>;
  overall: number;
  /** Hard failures. A plan with any of them never passes, whatever it scores. */
  blockers: Finding[];
  findings: Finding[];
  passed: boolean;
  /** Task minutes planned, break and rest minutes in the day, free minutes left. */
  totals: { planned: number; rest: number; slack: number };
};

/** The pass line for a dimension and for the whole plan. */
export const DIMENSION_PASS = 60;
export const OVERALL_PASS = 70;

export type PrioritizeChallenge = { mode: 'prioritize'; tasks: MatrixTaskSpec[]; /** The share of tasks that must land in an acceptable box (default 0.75). */ passRatio?: number };
export type ScheduleChallenge = { mode: 'schedule'; scenario: ScheduleScenario; /** A reference plan that meets the scenario's own rules; the validator runs it. */ solution: { blocks: Block[]; decisions: Decision[] } };
export type PlanningChallenge = PrioritizeChallenge | ScheduleChallenge;

/** The learner's answer to a planning activity. */
export type PlanningAnswer = { mode: 'prioritize'; placements: MatrixPlacements } | ({ mode: 'schedule' } & ScheduleAnswer);
