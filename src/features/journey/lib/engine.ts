import type { JourneyFocusId } from './focus-ids';
import type {
  CourseSnapshot,
  JourneyDefinition,
  JourneyFacts,
  JourneyLearner,
  JourneyMilestone,
  JourneyState,
  JourneyStep,
  MilestoneNext,
  MilestoneState,
  MilestoneStatus,
  StageState,
  StartLevel,
  StepState,
} from './types';

/**
 * The journey read against what the learner has really done. Pure: nothing is stored here and nothing is awarded for opening a screen.
 * Every status comes from course and project progress, so changing preferences, adding courses or restoring a backup can never lose
 * or invent progress, and the learner's place is simply "the first required milestone not finished yet that is open to them".
 *
 * Rules, in one place:
 * - A milestone is DONE when every step that counts is done (a step marked `optional`, or a course not in the app yet, never counts).
 * - The learner works on ONE course at a time (owner, 2026-11-16: "all the future courses should be locked"): the current milestone is the
 *   first whose course isn't finished, and every milestone after it is locked until that course is. A finished course whose project is
 *   still to pass stays open behind the learner and never blocks. Before the current one, a milestone needs each milestone it requires
 *   learned, skipped or waived. A waived milestone (optional for this learner, or coming
 *   soon) stands aside, and whatever came after it requires what IT required, so skipping a side road never traps the learner.
 * - The learner starts at a level (`startLevel`): their own choice, else their experience, the skill check and courses they finished
 *   with good quiz scores. Milestones of earlier levels they haven't begun are skipped: shown as skipped, not counted, still open.
 * - A milestone for a direction the learner isn't heading in (`audience`) is optional: visible, never blocking, never counted.
 */

const FROM_EXPERIENCE: Readonly<Record<NonNullable<JourneyLearner['experience']>, number>> = {
  'complete-beginner': 0,
  beginner: 0,
  intermediate: 1,
  // Programming experience is not AI-building experience: a seasoned developer starts at Advanced, and can choose Expert (or earlier).
  advanced: 2,
  professional: 2,
};

/** A finished course with at least this quiz average shows the learner can start at its level. */
export const DEMONSTRATED_QUIZ = 0.75;

/**
 * The level the learner starts at. Their own choice wins. Otherwise: their stated experience, moved by the skill check (a "new" result
 * starts one level earlier; "comfortable" or "strong" at least at Intermediate), and raised to the highest level where they have finished
 * a course with a good quiz average (they have shown they can work there).
 */
export function startLevel(definition: JourneyDefinition, facts: JourneyFacts, learner: JourneyLearner): StartLevel {
  const levels = definition.stages.map((stage) => stage.level);
  const at = (index: number, reason: StartLevel['reason']): StartLevel => {
    const clamped = Math.max(0, Math.min(levels.length - 1, index));
    return { index: clamped, level: levels[clamped] ?? 'beginner', reason };
  };
  if (learner.chosenStart) {
    const chosen = levels.indexOf(learner.chosenStart);
    if (chosen >= 0) return at(chosen, 'chosen');
  }
  let index = learner.experience ? FROM_EXPERIENCE[learner.experience] : 0;
  let reason: StartLevel['reason'] = learner.experience && index > 0 ? 'experience' : 'default';
  if (learner.assessment === 'new' && index > 0) {
    index -= 1;
    reason = 'assessment';
  } else if ((learner.assessment === 'comfortable' || learner.assessment === 'strong') && index < 1) {
    index = 1;
    reason = 'assessment';
  }
  definition.stages.forEach((stage, stageIndex) => {
    if (stageIndex <= index) return;
    const shown = stage.milestones.some((milestone) =>
      milestone.steps.some((step) => {
        if (step.kind !== 'learn') return false;
        const course = facts.courses.get(step.courseId);
        return !!course && course.lessonsTotal > 0 && course.lessonsDone >= course.lessonsTotal && (course.quizAverage ?? 0) >= DEMONSTRATED_QUIZ;
      }),
    );
    if (shown) {
      index = stageIndex;
      reason = 'completed';
    }
  });
  return at(index, reason);
}

/** Whether a milestone is required for this learner (otherwise it is shown as optional). */
export function isRequiredFor(milestone: JourneyMilestone, focus: readonly JourneyFocusId[]): boolean {
  if (!milestone.audience || milestone.audience.length === 0) return milestone.side !== true;
  if (milestone.audience.some((id) => focus.includes(id))) return true;
  // Said nothing about where they are heading: the journey's own plan holds, for the milestones meant for everyone.
  return focus.length === 0 && milestone.assumeForAll === true;
}

function courseOf(facts: JourneyFacts, courseId: string): CourseSnapshot | null {
  return facts.courses.get(courseId) ?? null;
}

function stepState(step: JourneyStep, milestoneId: string, index: number, facts: JourneyFacts): StepState {
  const key = `${milestoneId}:${index}`;
  const optional = step.optional === true;
  if (step.kind === 'learn') {
    const course = courseOf(facts, step.courseId);
    if (!course) return { key, kind: 'learn', title: step.courseId, courseId: step.courseId, projectId: null, action: null, done: false, fraction: 0, soon: true, optional, progressText: null, owned: false };
    const done = course.lessonsTotal > 0 && course.lessonsDone >= course.lessonsTotal;
    return {
      key,
      kind: 'learn',
      title: course.title,
      courseId: step.courseId,
      projectId: null,
      action: null,
      done,
      fraction: course.lessonsTotal > 0 ? Math.min(1, course.lessonsDone / course.lessonsTotal) : 0,
      soon: false,
      optional,
      progressText: { done: course.lessonsDone, total: course.lessonsTotal },
      owned: course.owned,
    };
  }
  if (step.kind === 'build') {
    const title = facts.projectTitles.get(step.projectId);
    const course = courseOf(facts, step.courseId);
    if (title === undefined || !course) return { key, kind: 'build', title: step.projectId, courseId: step.courseId, projectId: step.projectId, action: null, done: false, fraction: 0, soon: true, optional, progressText: null, owned: false };
    const done = facts.passedProjects.has(step.projectId);
    return { key, kind: 'build', title, courseId: step.courseId, projectId: step.projectId, action: null, done, fraction: done ? 1 : 0, soon: false, optional, progressText: { done: done ? 1 : 0, total: 1 }, owned: course.owned };
  }
  const done = facts.actions[step.action] === true;
  return { key, kind: 'action', title: step.action, courseId: null, projectId: null, action: step.action, done, fraction: done ? 1 : 0, soon: false, optional, progressText: { done: done ? 1 : 0, total: 1 }, owned: true };
}

/** Where "Start" or "Continue" leads: the first step that counts and isn't done. */
function nextFor(steps: readonly StepState[], facts: JourneyFacts): MilestoneNext | null {
  const open = steps.find((step) => !step.done && !step.soon && !step.optional);
  if (!open) return null;
  if (open.kind === 'action' && open.action) return { type: 'action', action: open.action };
  const course = open.courseId ? courseOf(facts, open.courseId) : null;
  // A project that hasn't opened yet (its lesson day isn't done) leads back to the course's next lesson; with no lesson left it is the project.
  if (open.kind === 'build' && open.projectId && (facts.openProjects.has(open.projectId) || !course?.nextLessonId)) return { type: 'project', projectId: open.projectId, title: open.title };
  if (course?.nextLessonId && open.courseId) return { type: 'lesson', lessonId: course.nextLessonId, courseId: open.courseId, title: course.nextLessonTitle ?? course.title };
  return null;
}

type Base = {
  def: JourneyMilestone;
  stageId: string;
  stageIndex: number;
  index: number;
  steps: StepState[];
  stepsDone: number;
  stepsTotal: number;
  fraction: number;
  done: boolean;
  learned: boolean;
  soon: boolean;
  started: boolean;
  required: boolean;
  skipped: boolean;
  minutesLeft: number;
  next: MilestoneNext | null;
};

export function computeJourney(definition: JourneyDefinition, facts: JourneyFacts, learner: JourneyLearner): JourneyState {
  const start = startLevel(definition, facts, learner);
  const bases: Base[] = [];
  definition.stages.forEach((stage, stageIndex) => {
    for (const def of stage.milestones) {
      const steps = def.steps.map((step, i) => stepState(step, def.id, i, facts));
      const counting = steps.filter((step) => !step.optional && !step.soon);
      const stepsDone = counting.filter((step) => step.done).length;
      const soon = counting.length === 0;
      const done = !soon && stepsDone === counting.length;
      // Its course is finished once every lesson (and in-app step) that counts is done; the project is the practice that completes it.
      const knowledge = counting.filter((step) => step.kind !== 'build');
      const learned = done || (knowledge.length > 0 && knowledge.every((step) => step.done));
      const fraction = soon ? 0 : counting.reduce((sum, step) => sum + step.fraction, 0) / counting.length;
      const started = steps.some((step) => !step.soon && (step.done || step.fraction > 0)) || courseStarted(def, facts);
      const minutesLeft = steps.reduce((sum, step) => (step.kind === 'learn' && !step.done && !step.soon && !step.optional && step.courseId ? sum + (courseOf(facts, step.courseId)?.minutesLeft ?? 0) : sum), 0);
      bases.push({
        def,
        stageId: stage.id,
        stageIndex,
        index: bases.length,
        steps,
        stepsDone,
        stepsTotal: counting.length,
        fraction,
        done,
        learned,
        soon,
        started,
        required: isRequiredFor(def, learner.focus),
        skipped: !done && !started && stageIndex < start.index,
        minutesLeft,
        next: nextFor(steps, facts),
      });
    }
  });

  const byId = new Map(bases.map((base) => [base.def.id, base]));
  const requiresOf = (base: Base): readonly string[] => base.def.requires ?? (base.index > 0 ? [bases[base.index - 1]!.def.id] : []);
  // A milestone that stands aside: optional for this learner, coming soon, or skipped as known ground.
  const waived = (base: Base) => !base.done && (base.soon || !base.required || base.skipped);

  /** What really blocks `base`: the required milestones behind it not finished, looking through the ones that stand aside. */
  const blockers = (base: Base, seen = new Set<string>()): string[] => {
    const out: string[] = [];
    for (const id of requiresOf(base)) {
      const before = byId.get(id);
      if (!before || seen.has(id)) continue;
      seen.add(id);
      if (before.done || before.learned) continue;
      if (waived(before)) out.push(...blockers(before, seen));
      else out.push(id);
    }
    return [...new Set(out)];
  };

  const blockedBy = new Map(bases.map((base) => [base.def.id, blockers(base)]));
  // The learner's place: the first required milestone that is open and unfinished.
  // The learner's place: the first required milestone whose course they haven't finished, among the ones open to them. A finished
  // course with its project still to pass is behind them (open, never blocking).
  const currentBase = bases.find((base) => base.required && !base.learned && !base.soon && !base.skipped && (blockedBy.get(base.def.id) ?? []).length === 0) ?? null;

  const milestones: MilestoneState[] = bases.map((base) => {
    const blocked = blockedBy.get(base.def.id) ?? [];
    let status: MilestoneStatus;
    // Everything after the learner's current milestone waits for it, whatever its own prerequisites say.
    const ahead = currentBase !== null && base.index > currentBase.index;
    if (base.done) status = 'done';
    else if (base.soon) status = 'soon';
    else if (base === currentBase) status = 'current';
    else if (ahead) status = 'locked';
    else if (base.skipped) status = 'skipped';
    else if (blocked.length > 0) status = 'locked';
    else status = 'available';
    const lockedBy = ahead && blocked.length === 0 && currentBase ? [currentBase.def.id] : blocked;
    return {
      id: base.def.id,
      def: base.def,
      stageId: base.stageId,
      stageIndex: base.stageIndex,
      index: base.index,
      status,
      required: base.required && !base.soon && !base.skipped,
      learned: base.learned,
      optional: !base.required,
      steps: base.steps,
      stepsDone: base.stepsDone,
      stepsTotal: base.stepsTotal,
      fraction: base.fraction,
      started: base.started,
      blockedBy: status === 'locked' ? lockedBy : [],
      next: base.next,
      minutesLeft: base.minutesLeft,
    };
  });

  const stages: StageState[] = definition.stages.map((stage, index) => {
    const mine = milestones.filter((milestone) => milestone.stageId === stage.id);
    const required = mine.filter((milestone) => milestone.required);
    const done = required.filter((milestone) => milestone.status === 'done').length;
    const total = required.length;
    const fraction = total > 0 ? required.reduce((sum, milestone) => sum + (milestone.status === 'done' ? 1 : milestone.fraction), 0) / total : 0;
    // A stage with nothing required (all optional or coming soon) is complete once everything that can be done is.
    const everything = mine.filter((milestone) => milestone.status !== 'soon' && milestone.status !== 'skipped');
    const complete = total > 0 ? done === total : everything.length > 0 && everything.every((milestone) => milestone.status === 'done');
    return { id: stage.id, def: stage, index, milestones: mine, done, total, fraction: total > 0 ? fraction : complete ? 1 : 0, complete };
  });

  const required = milestones.filter((milestone) => milestone.required);
  const done = required.filter((milestone) => milestone.status === 'done').length;
  const fraction = required.length > 0 ? required.reduce((sum, milestone) => sum + (milestone.status === 'done' ? 1 : milestone.fraction), 0) / required.length : 0;
  const current = currentBase ? (milestones[currentBase.index] ?? null) : null;
  return {
    stages,
    milestones,
    current,
    currentStage: current ? (stages[current.stageIndex] ?? null) : null,
    done,
    total: required.length,
    fraction,
    complete: required.length > 0 && done === required.length,
    start,
  };
}

/** A course the learner has begun counts as the milestone having begun, even if no step is done yet. A project does not: its course being started says nothing about the project. */
function courseStarted(def: JourneyMilestone, facts: JourneyFacts): boolean {
  return def.steps.some((step) => step.kind === 'learn' && (courseOf(facts, step.courseId)?.started ?? false));
}

/** The stage ids that are complete, for the badges. */
export function completedStageIds(state: JourneyState): string[] {
  return state.stages.filter((stage) => stage.complete).map((stage) => stage.id);
}
