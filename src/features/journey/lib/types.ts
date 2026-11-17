import type { MaterialSymbolName } from '@/components/ui/material-symbols';

import type { JourneyFocusId, JourneyLevelId } from './focus-ids';

/**
 * The learning journey as DATA: stages, milestones, the courses and projects behind each one, and the rules for unlocking. Nothing here
 * is drawn or computed; `data/journey.ts` fills it in, `engine.ts` reads it with the learner's real progress, and the screens draw what the
 * engine says. The shape is plain JSON on purpose, so the same definition could one day be delivered from a server (like the regional
 * content) without a new build. Steps point at courses and projects that already exist; the engine never invents progress of its own.
 */

/** A step of a milestone. Completion always comes from what the learner really did. */
export type JourneyStep =
  /** Every lesson of the course done (the course's own projects are separate `build` steps). */
  | { kind: 'learn'; courseId: string; optional?: boolean }
  /** A project of a course passed its review: the practical challenge. */
  | { kind: 'build'; courseId: string; projectId: string; optional?: boolean }
  /** Something done in the app itself, outside any course. */
  | { kind: 'action'; action: JourneyAction; optional?: boolean };

/** `portfolio`: at least one project on the learner's portfolio. `resume`: at least one résumé created. */
export type JourneyAction = 'portfolio' | 'resume';

export type MilestoneKind = 'learn' | 'challenge' | 'capstone';

export type JourneyMilestone = {
  id: string;
  kind: MilestoneKind;
  title: string;
  /** One line for the map. */
  summary: string;
  /** Why it matters and how it prepares the next one (shown in the details). */
  why: string;
  /** What the learner will be able to do afterwards. */
  objectives: readonly string[];
  icon: MaterialSymbolName;
  steps: readonly JourneyStep[];
  /** Milestone ids that must be finished first. Absent: the one before it in the journey. `[]`: open from the start. */
  requires?: readonly string[];
  /** Required for learners leaning this way; optional for everyone else (still visible, never blocking). */
  audience?: readonly JourneyFocusId[];
  /** Beside the main road: serves one audience (freelancers, teachers, job seekers, working developers). Optional unless `audience` matches. */
  side?: boolean;
  /** With `audience`: also required for a learner who has not said where they are heading. */
  assumeForAll?: boolean;
  /**
   * Added after learners were already on the journey. It never pulls anyone back: a learner who has begun a later milestone and not this one
   * finds it standing aside (shown as skipped, still open), so adding a course to an existing journey never changes a place already reached.
   */
  lateAddition?: boolean;
};

/** A level of the journey (Beginner, Intermediate, Advanced, Expert): its milestones, in the order their content builds on each other. */
export type JourneyStage = {
  id: string;
  level: JourneyLevelId;
  /** "Beginner". */
  title: string;
  /** Who it is for, in one line. */
  forWhom: string;
  /** Short line under the title ("Know what AI is, and what it isn't"). */
  tagline: string;
  /** Why this stage comes here. */
  why: string;
  icon: MaterialSymbolName;
  milestones: readonly JourneyMilestone[];
};

export type JourneyDestination = {
  title: string;
  summary: string;
  /** What the learner will be able to build and launch at the end. */
  abilities: readonly string[];
};

export type JourneyDefinition = {
  id: string;
  title: string;
  stages: readonly JourneyStage[];
  destination: JourneyDestination;
};

/* ---------------------------------------------------------------- what the engine is given and returns */

/** What the engine needs to know about one course; absent when the course isn't in the app (yet). */
export type CourseSnapshot = {
  title: string;
  lessonsDone: number;
  lessonsTotal: number;
  started: boolean;
  complete: boolean;
  nextLessonId: string | null;
  nextLessonTitle: string | null;
  /** Minutes of lessons not yet done. */
  minutesLeft: number;
  /** The learner can open it (a subscription or the free starter). */
  owned: boolean;
  /** Correct answers over questions answered in its quizzes, 0 to 1; null before any quiz. */
  quizAverage: number | null;
  /** The course's own short description, for the map and the course's timeline. */
  description?: string;
  /** The next lesson's number in its course ("Lesson 5"). */
  nextLessonNumber?: number | null;
  /** When the learner last finished a lesson of it (ISO), to tell which of several started courses was worked on most recently. */
  lastActiveAt?: string | null;
};

export type JourneyFacts = {
  courses: ReadonlyMap<string, CourseSnapshot>;
  /** Titles of the projects that exist, by id. A project missing here isn't in the app. */
  projectTitles: ReadonlyMap<string, string>;
  passedProjects: ReadonlySet<string>;
  /** Projects whose lesson day is done, so they can be started. */
  openProjects: ReadonlySet<string>;
  actions: Readonly<Record<JourneyAction, boolean>>;
};

/** What the learner told Talino about themselves; only what changes the journey. */
export type JourneyLearner = {
  experience: 'complete-beginner' | 'beginner' | 'intermediate' | 'advanced' | 'professional' | null;
  assessment: 'new' | 'foundations' | 'comfortable' | 'strong' | null;
  /** Where the learner is heading, from the welcome's goals and interests (or their own choice). Empty: not said. */
  focus: readonly JourneyFocusId[];
  /** The level the learner chose to start at (Customize journey); null works it out. */
  chosenStart: JourneyLevelId | null;
};

/** Where the learner starts, and why: their own choice, what they said about their experience, the skill check, or courses they have finished well. */
export type StartLevel = { index: number; level: JourneyLevelId; reason: 'chosen' | 'experience' | 'assessment' | 'completed' | 'default' };

export type MilestoneStatus = 'done' | 'current' | 'available' | 'locked' | 'skipped' | 'soon';

export type StepState = {
  key: string;
  kind: JourneyStep['kind'];
  title: string;
  courseId: string | null;
  projectId: string | null;
  action: JourneyAction | null;
  done: boolean;
  /** 0 to 1. */
  fraction: number;
  /** The course or project isn't in the app yet; the step never blocks. */
  soon: boolean;
  optional: boolean;
  /** "3 of 12 lessons", "Passed", "Not started". */
  progressText: { done: number; total: number } | null;
  owned: boolean;
};

/** Where "Start" or "Continue" leads for a milestone. */
export type MilestoneNext =
  | { type: 'lesson'; lessonId: string; courseId: string; title: string }
  | { type: 'project'; projectId: string; title: string }
  | { type: 'action'; action: JourneyAction };

export type MilestoneState = {
  id: string;
  def: JourneyMilestone;
  stageId: string;
  stageIndex: number;
  /** Position in the whole journey, from 0. */
  index: number;
  status: MilestoneStatus;
  /** Counts towards the learner's progress (not optional, skipped or coming soon). */
  required: boolean;
  /** Its course is finished (every counting lesson done); the project may still be to pass. */
  learned: boolean;
  optional: boolean;
  steps: readonly StepState[];
  stepsDone: number;
  stepsTotal: number;
  /** 0 to 1, over the steps that count. */
  fraction: number;
  started: boolean;
  /** What must be finished first, when locked (milestone ids that really block). */
  blockedBy: readonly string[];
  next: MilestoneNext | null;
  minutesLeft: number;
};

export type StageState = {
  id: string;
  def: JourneyStage;
  index: number;
  milestones: readonly MilestoneState[];
  /** Required milestones finished / required in total. */
  done: number;
  total: number;
  fraction: number;
  complete: boolean;
};

export type JourneyState = {
  stages: readonly StageState[];
  milestones: readonly MilestoneState[];
  current: MilestoneState | null;
  currentStage: StageState | null;
  /** Required milestones done / required in total, and the share of the journey done counting partial progress. */
  done: number;
  total: number;
  fraction: number;
  /** Every required milestone is done. */
  complete: boolean;
  /** The level the learner starts at; the milestones of earlier levels they haven't begun are skipped (and can still be taken). */
  start: StartLevel;
};
