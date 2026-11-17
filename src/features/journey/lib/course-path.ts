import type { MaterialSymbolName } from '@/components/ui/material-symbols';

import type { JourneyLevelId } from './focus-ids';
import type { JourneyFacts, JourneyState, MilestoneState } from './types';

/**
 * The journey as COURSES (owner's brief, 2026-11-16: "the main journey is organized around courses; the timeline inside each course
 * represents its lessons"). Pure, and derived from the engine's `JourneyState` plus the learner's real lesson counts: nothing is stored,
 * so a restart, a restored backup or another phone with the same progress rows gives the same path.
 *
 * The engine still decides what is required, skipped and waiting (milestones keep their `requires`, directions, start level). This
 * only turns each course of each milestone into its own node and answers the questions Home asks about courses:
 *
 * - COMPLETED: every lesson done (the project is separate; it is shown at the end of the course's timeline).
 * - CURRENT: the first required, unfinished course of the engine's current milestone. Only one. (An action milestone with no course,
 *   "Show your work", is its own node and can be the current one.)
 * - No course is ever locked (owner, 2026-11-16: "the user should be able to choose any course"): the journey says which one is next, it
 *   never holds the others back. A course the learner doesn't own is still marked Pro and opens the paywall at its first lesson.
 * - IN PROGRESS: a course that was started and isn't finished, wherever it sits. The Courses tab can open any course, and the learner's
 *   progress in it is never hidden or overwritten.
 * - SKIPPED: untouched courses of levels before the learner's starting level (dashed, still open).
 * - AVAILABLE: everything else that is open.
 */

export type PathNodeStatus = 'completed' | 'current' | 'in-progress' | 'available' | 'skipped';

export type PathNode = {
  /** The course id, or the milestone id for an action node. Unique in the path. */
  key: string;
  kind: 'course' | 'action';
  courseId: string | null;
  milestoneId: string;
  stageIndex: number;
  level: JourneyLevelId;
  /** Position in the whole path, from 0 (layout and links use it). */
  index: number;
  indexInStage: number;
  title: string;
  /** The course's own short description ("" before the catalog supplied one). */
  description: string;
  icon: MaterialSymbolName;
  status: PathNodeStatus;
  optional: boolean;
  /** The learner can open its lessons (a subscription, or the free starter). An action node is always owned. */
  owned: boolean;
  lessonsDone: number;
  lessonsTotal: number;
  /** 0 to 1, from lessons done. */
  fraction: number;
  /** 0 to 100, rounded. */
  percent: number;
  started: boolean;
  nextLessonId: string | null;
  nextLessonTitle: string | null;
  /** The lesson's number in its course (its "day"), for "Lesson 5". */
  nextLessonNumber: number | null;
  minutesLeft: number;
  lastActiveAt: string | null;
  hasProject: boolean;
  projectPassed: boolean;
};

export type StagePath = {
  stageIndex: number;
  /** Required courses (not optional, not skipped) finished, and how many there are. */
  coursesDone: number;
  coursesTotal: number;
  /** 0 to 1 over the required courses, partial progress counted. */
  fraction: number;
};

export type CoursePath = {
  nodes: readonly PathNode[];
  stages: readonly StagePath[];
  /** The journey's own place (the engine's current milestone). */
  current: PathNode | null;
  /** Where Home's Continue leads: the journey's course when started, else the started course worked on most recently, else the current one. */
  resume: PathNode | null;
  /** Other started, unfinished courses, in journey order: beside the resume target, never replacing it. */
  alsoInProgress: readonly PathNode[];
  /** Prerequisites that reach back past the node before: pairs of node indexes (from, to) for the extra synapses. */
  links: readonly (readonly [number, number])[];
};

const percentOf = (fraction: number) => Math.round(Math.max(0, Math.min(1, fraction)) * 100);

export function buildCoursePath(state: JourneyState, facts: JourneyFacts): CoursePath {
  type Draft = Omit<PathNode, 'index' | 'indexInStage' | 'status'> & { milestone: MilestoneState; completed: boolean };
  const drafts: Draft[] = [];

  for (const milestone of state.milestones) {
    const level = state.stages[milestone.stageIndex]?.def.level ?? 'beginner';
    const learnSteps = milestone.def.steps.flatMap((step, i) => (step.kind === 'learn' ? [{ step, i }] : []));
    const hasCourses = learnSteps.some(({ step }) => facts.courses.has(step.courseId));
    for (const { step } of learnSteps) {
      const course = facts.courses.get(step.courseId);
      // A course that isn't in the app yet gets no node: it can never block anyone.
      if (!course) continue;
      const total = course.lessonsTotal;
      const fraction = total > 0 ? Math.min(1, course.lessonsDone / total) : 0;
      const projects = milestone.def.steps.flatMap((entry) => (entry.kind === 'build' && entry.courseId === step.courseId ? [entry.projectId] : []));
      drafts.push({
        milestone,
        key: step.courseId,
        kind: 'course',
        courseId: step.courseId,
        milestoneId: milestone.id,
        stageIndex: milestone.stageIndex,
        level,
        title: course.title,
        description: course.description ?? '',
        icon: milestone.def.icon,
        optional: step.optional === true || !milestone.required,
        owned: course.owned,
        lessonsDone: course.lessonsDone,
        lessonsTotal: total,
        fraction,
        percent: percentOf(fraction),
        started: course.started || course.lessonsDone > 0,
        nextLessonId: course.nextLessonId,
        nextLessonTitle: course.nextLessonTitle,
        nextLessonNumber: course.nextLessonNumber ?? null,
        minutesLeft: course.minutesLeft,
        lastActiveAt: course.lastActiveAt ?? null,
        hasProject: projects.length > 0,
        projectPassed: projects.length > 0 && projects.every((id) => facts.passedProjects.has(id)),
        completed: total > 0 && course.lessonsDone >= total,
      });
    }
    // A milestone with no course at all (the portfolio and résumé step) stays on the map as one node, so nothing is removed.
    const actionOnly = !learnSteps.length && milestone.def.steps.some((step) => step.kind === 'action');
    if (actionOnly && !hasCourses && milestone.status !== 'soon') {
      drafts.push({
        milestone,
        key: milestone.id,
        kind: 'action',
        courseId: null,
        milestoneId: milestone.id,
        stageIndex: milestone.stageIndex,
        level,
        title: milestone.def.title,
        description: milestone.def.summary,
        icon: milestone.def.icon,
        optional: milestone.optional,
        owned: true,
        lessonsDone: 0,
        lessonsTotal: 0,
        fraction: milestone.fraction,
        percent: percentOf(milestone.fraction),
        started: milestone.started,
        nextLessonId: null,
        nextLessonTitle: null,
        nextLessonNumber: null,
        minutesLeft: 0,
        lastActiveAt: null,
        hasProject: false,
        projectPassed: false,
        completed: milestone.status === 'done',
      });
    }
  }

  // The current node: the first required, unfinished course of the engine's current milestone (or that milestone's own node when it has no course).
  const currentMilestone = state.current;
  const currentKey = currentMilestone ? currentNodeKey(currentMilestone, drafts) : null;
  const currentIndex = drafts.findIndex((draft) => draft.key === currentKey);

  const counters = new Map<number, number>();
  const nodes: PathNode[] = drafts.map((draft, index) => {
    const indexInStage = counters.get(draft.stageIndex) ?? 0;
    counters.set(draft.stageIndex, indexInStage + 1);
    const { milestone, completed, ...rest } = draft;
    let status: PathNodeStatus;
    if (completed) status = 'completed';
    else if (draft.key === currentKey) status = 'current';
    else if (draft.kind === 'course' && draft.started) status = 'in-progress';
    else if (milestone.status === 'skipped') status = 'skipped';
    else status = 'available';
    return { ...rest, index, indexInStage, status };
  });

  const current = currentIndex >= 0 ? nodes[currentIndex]! : null;
  const unfinished = nodes.filter((node) => node.kind === 'course' && node.started && node.status !== 'completed');
  const resume = pickResume(current, unfinished);
  const alsoInProgress = unfinished.filter((node) => node.key !== resume?.key);

  return { nodes, stages: stageSummaries(state, nodes), current, resume, alsoInProgress, links: linksOf(state, nodes) };
}

/** The key of the node the engine's current milestone points at. */
function currentNodeKey(milestone: MilestoneState, drafts: readonly { key: string; milestoneId: string; kind: 'course' | 'action' }[]): string | null {
  for (const step of milestone.steps) {
    if (step.kind !== 'learn' || step.done || step.soon || step.optional || !step.courseId) continue;
    if (drafts.some((draft) => draft.key === step.courseId)) return step.courseId;
  }
  // No course left to learn there: the milestone's own node (an action milestone), if it has one.
  return drafts.find((draft) => draft.milestoneId === milestone.id && draft.kind === 'action')?.key ?? null;
}

/**
 * The primary place to resume: the journey's current course when the learner has started it; otherwise the started, unfinished course worked
 * on most recently (the latest lesson finished), then the one furthest along, then the earlier on the journey; otherwise the current one to start.
 */
function pickResume(current: PathNode | null, unfinished: readonly PathNode[]): PathNode | null {
  if (current && (current.started || current.kind === 'action')) return current;
  const others = unfinished.filter((node) => node.key !== current?.key);
  if (others.length > 0) {
    return [...others].sort((a, b) => (b.lastActiveAt ?? '').localeCompare(a.lastActiveAt ?? '') || b.fraction - a.fraction || a.index - b.index)[0]!;
  }
  return current;
}

function stageSummaries(state: JourneyState, nodes: readonly PathNode[]): StagePath[] {
  return state.stages.map((stage) => {
    const counted = nodes.filter((node) => node.stageIndex === stage.index && node.kind === 'course' && !node.optional && node.status !== 'skipped');
    const coursesDone = counted.filter((node) => node.status === 'completed').length;
    const sum = counted.reduce((total, node) => total + (node.status === 'completed' ? 1 : node.fraction), 0);
    return { stageIndex: stage.index, coursesDone, coursesTotal: counted.length, fraction: counted.length > 0 ? sum / counted.length : 0 };
  });
}

/** A milestone that requires one further back than the node before it is wired to that milestone's last course. */
function linksOf(state: JourneyState, nodes: readonly PathNode[]): [number, number][] {
  const firstOf = new Map<string, number>();
  const lastOf = new Map<string, number>();
  for (const node of nodes) {
    if (!firstOf.has(node.milestoneId)) firstOf.set(node.milestoneId, node.index);
    lastOf.set(node.milestoneId, node.index);
  }
  const links: [number, number][] = [];
  for (const milestone of state.milestones) {
    const to = firstOf.get(milestone.id);
    if (to === undefined) continue;
    for (const id of milestone.def.requires ?? []) {
      const from = lastOf.get(id);
      if (from !== undefined && from < to - 1 && !links.some(([a, b]) => a === from && b === to)) links.push([from, to]);
    }
  }
  return links;
}

/** Where "continue the journey" leads when a course is finished: the journey's current course, unless that is this one. */
export function courseToContinueAfter(path: CoursePath, key: string): PathNode | null {
  return path.current && path.current.key !== key ? path.current : null;
}
