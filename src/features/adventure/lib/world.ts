import type { Course, CourseProgress, Lesson, Project } from '@/features/courses/data';

/**
 * A course seen as a *learning world*: chapters of consecutive lessons (missions) and, at the end,
 * the course's project(s) as the boss challenge. Pure: everything comes from the course data and the
 * real `CourseProgress`, so the map can never disagree with the lessons (a mission is current only
 * when the course's own sequential rule says it is the next lesson, and never otherwise).
 */

/** About this many lessons to a chapter; the lessons are split as evenly as that allows. */
export const CHAPTER_SIZE = 5;

export type MissionState = 'done' | 'current' | 'locked';

export type Mission = {
  lesson: Lesson;
  state: MissionState;
  chapterIndex: number;
  /** For a locked mission: the lesson to finish first (the one just before it that is not done). */
  finishFirst: Lesson | null;
};

export type Chapter = {
  index: number;
  id: string;
  /** From the data: the label of the skill most of its lessons build; null when its lessons name none. */
  title: string | null;
  skillId: string | null;
  /** 1 normally; 2, 3 ... when a skill is the best title for more than one chapter of the world. */
  part: number;
  missions: Mission[];
  done: number;
  total: number;
  /** 0 to 1. */
  fraction: number;
  state: MissionState;
};

export type BossProject = { project: Project; state: MissionState; open: boolean; passed: boolean };

export type Boss = {
  projects: BossProject[];
  /** `done` when every project passed review; `current` when every lesson is done and one is still to do; otherwise `locked`. */
  state: MissionState;
  /** Projects whose lesson day is already done (they can be started before the last lesson). */
  open: number;
  passed: number;
};

export type WorldNext = { kind: 'mission'; lesson: Lesson } | { kind: 'boss'; project: Project } | null;

export type World = {
  courseId: string;
  chapters: Chapter[];
  boss: Boss | null;
  missionsDone: number;
  missionsTotal: number;
  /** Lessons and projects together, 0 to 1 (the course's own figure). */
  fraction: number;
  percent: number;
  complete: boolean;
  next: WorldNext;
};

/** Sizes of the chapters for `count` lessons: as even as possible, larger ones first (7 -> 4, 3). */
export function chapterSizes(count: number, size = CHAPTER_SIZE): number[] {
  if (count <= 0) return [];
  const chapters = Math.ceil(count / size);
  const base = Math.floor(count / chapters);
  const extra = count % chapters;
  return Array.from({ length: chapters }, (_, index) => base + (index < extra ? 1 : 0));
}

type Titled = { skillId: string | null; title: string | null };

/** The skill most of a group's lessons build. A lesson's first skill is its main one and counts double; ties go to the course's own skill order. */
function rankSkills(course: Pick<Course, 'skills'>, lessons: readonly Lesson[]): string[] {
  const weight = new Map<string, number>();
  for (const lesson of lessons) {
    lesson.skills.forEach((id, position) => {
      if (!course.skills.some((skill) => skill.id === id)) return;
      weight.set(id, (weight.get(id) ?? 0) + (position === 0 ? 2 : 1));
    });
  }
  const order = new Map(course.skills.map((skill, index) => [skill.id, index]));
  return [...weight.keys()].sort((a, b) => (weight.get(b) ?? 0) - (weight.get(a) ?? 0) || (order.get(a) ?? 0) - (order.get(b) ?? 0));
}

/**
 * Chapter titles, never invented: each is the label of a skill from the course data. Where the best
 * skill already titled an earlier chapter, the next best unused one is taken; when none is left the
 * skill repeats and the chapter's `part` says which part of it this is.
 */
export function chapterTitles(course: Pick<Course, 'skills'>, groups: readonly (readonly Lesson[])[]): (Titled & { part: number })[] {
  const used = new Map<string, number>();
  return groups.map((lessons) => {
    const ranked = rankSkills(course, lessons);
    const fresh = ranked.find((id) => !used.has(id));
    const skillId = fresh ?? ranked[0] ?? null;
    if (!skillId) return { skillId: null, title: null, part: 1 };
    const part = (used.get(skillId) ?? 0) + 1;
    used.set(skillId, part);
    return { skillId, title: course.skills.find((skill) => skill.id === skillId)?.label ?? null, part };
  });
}

/** `passedProjectIds`: the projects whose review passed (`CourseProgress` only counts them, so the caller says which). */
export function buildWorld(course: Course, progress: CourseProgress, passedProjectIds: ReadonlySet<string> = new Set()): World {
  // A course made of modules (Programming Fundamentals) is one chapter per module, titled with it; other courses split evenly and take skill names.
  const modules = course.modules && course.modules.length > 0 ? course.modules : null;
  const groups: Lesson[][] = [];
  if (modules) {
    for (const module of modules) groups.push(course.lessons.filter((lesson) => lesson.day >= module.firstDay && lesson.day <= module.lastDay));
  } else {
    let cursor = 0;
    for (const size of chapterSizes(course.lessons.length)) {
      groups.push(course.lessons.slice(cursor, cursor + size));
      cursor += size;
    }
  }
  const titles: (Titled & { part: number })[] = modules ? modules.map((module) => ({ skillId: null, title: module.title, part: 1 })) : chapterTitles(course, groups);

  const chapters: Chapter[] = groups.map((lessons, index) => {
    const missions: Mission[] = lessons.map((lesson) => {
      const state = toMissionState(progress.lessonState(lesson.id));
      return { lesson, state, chapterIndex: index, finishFirst: state === 'locked' ? firstUnfinishedBefore(course, progress, lesson) : null };
    });
    const done = missions.filter((mission) => mission.state === 'done').length;
    return {
      index,
      id: `${course.id}-ch${index + 1}`,
      title: titles[index].title,
      skillId: titles[index].skillId,
      part: titles[index].part,
      missions,
      done,
      total: missions.length,
      fraction: missions.length === 0 ? 0 : done / missions.length,
      state: done === missions.length ? 'done' : missions.some((mission) => mission.state === 'current') ? 'current' : 'locked',
    };
  });

  const missionsDone = progress.lessonsDone;
  const allLessonsDone = course.lessons.length > 0 && missionsDone === course.lessons.length;
  const boss = buildBoss(course, progress, allLessonsDone, passedProjectIds);
  const nextLesson = progress.nextLesson;
  const nextBoss = boss?.projects.find((entry) => entry.state === 'current') ?? null;
  return {
    courseId: course.id,
    chapters,
    boss,
    missionsDone,
    missionsTotal: course.lessons.length,
    fraction: progress.fraction,
    percent: Math.round(progress.fraction * 100),
    complete: progress.complete,
    next: nextLesson ? { kind: 'mission', lesson: nextLesson } : nextBoss ? { kind: 'boss', project: nextBoss.project } : null,
  };
}

function toMissionState(state: ReturnType<CourseProgress['lessonState']>): MissionState {
  return state === 'next' ? 'current' : state;
}

/** The first lesson before `lesson` that is not done: what a locked mission is waiting for. */
function firstUnfinishedBefore(course: Course, progress: CourseProgress, lesson: Lesson): Lesson | null {
  return course.lessons.find((entry) => entry.day < lesson.day && progress.lessonState(entry.id) !== 'done') ?? null;
}

function buildBoss(course: Course, progress: CourseProgress, allLessonsDone: boolean, passedProjectIds: ReadonlySet<string>): Boss | null {
  if (course.projects.length === 0) return null;
  const projects: BossProject[] = course.projects.map((project) => {
    const passed = passedProjectIds.has(project.id);
    const open = progress.projectOpen(project.id);
    return { project, passed, open, state: passed ? 'done' : allLessonsDone && open ? 'current' : 'locked' };
  });
  const passed = projects.filter((entry) => entry.passed).length;
  return {
    projects,
    passed,
    open: projects.filter((entry) => entry.open).length,
    state: passed === projects.length ? 'done' : allLessonsDone ? 'current' : 'locked',
  };
}

/** All the lessons and projects between a learner and the end of the world, in order (for "what comes next" lists). */
export function remainingMissions(world: World): Mission[] {
  return world.chapters.flatMap((chapter) => chapter.missions).filter((mission) => mission.state !== 'done');
}

/**
 * What to do after finishing `lessonId`: the next mission of the same world, else its boss, else
 * nothing (the world is complete). Used by the completion summary.
 */
export function nextAfter(world: World, lessonId: string): WorldNext {
  const missions = world.chapters.flatMap((chapter) => chapter.missions);
  const index = missions.findIndex((mission) => mission.lesson.id === lessonId);
  const following = index >= 0 ? missions.slice(index + 1).find((mission) => mission.state !== 'done') : undefined;
  if (following) return { kind: 'mission', lesson: following.lesson };
  const boss = world.boss?.projects.find((entry) => !entry.passed);
  return boss ? { kind: 'boss', project: boss.project } : null;
}
