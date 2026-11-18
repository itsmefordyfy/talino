import { describe, expect, test } from '@jest/globals';

import { internationalClientsCourse } from '../courses/content/catalog/courses/international-clients';
import { softSkillsWorkplaceCourse as course } from '../courses/content/catalog/courses/soft-skills-workplace';
import { timeManagementProductivityCourse } from '../courses/content/catalog/courses/time-management-productivity';
import { COURSES as ALL_COURSES } from '../courses/content';
import { PRACTICE_ITEMS, findLab, findPracticeItem } from './catalog';
import { labProblems } from './lib/lab-rules';
import { PARTNER_ROLES, PRACTICE_CRITERIA } from './types';

/** The courses that use the engine: every role-play and message task belongs to exactly one activity of one of them (lab tasks belong to the Generative AI and Software Architecture courses and are checked below). */
const COURSES = [course, internationalClientsCourse, timeManagementProductivityCourse];
const usage = new Map<string, string[]>();
for (const lesson of COURSES.flatMap((one) => one.lessons)) {
  for (const block of lesson.body) {
    if (block.type !== 'activity') continue;
    const activity = block.activity;
    if (activity.kind === 'roleplay' || activity.kind === 'message-review') {
      const id = activity.kind === 'roleplay' ? activity.scenarioId : activity.taskId;
      usage.set(id, [...(usage.get(id) ?? []), activity.id]);
    }
  }
}

describe('the Soft Skills practice catalog', () => {
  test('has role-plays and message tasks in every module, with unique ids', () => {
    expect(new Set(PRACTICE_ITEMS.map((item) => item.id)).size).toBe(PRACTICE_ITEMS.length);
    expect(PRACTICE_ITEMS.filter((item) => item.kind === 'roleplay').length).toBeGreaterThanOrEqual(20);
    expect(PRACTICE_ITEMS.filter((item) => item.kind === 'message').length).toBeGreaterThanOrEqual(15);
    // Time Management and Productivity holds practice only where it helps (its own MODULE_REQUIREMENTS in productivity-module.test.ts), so it is left out of this every-module rule.
    for (const one of COURSES.filter((candidate) => candidate !== timeManagementProductivityCourse)) {
      for (const module of one.modules ?? []) {
        const days = new Set(one.lessons.filter((lesson) => lesson.day >= module.firstDay && lesson.day <= module.lastDay).map((lesson) => lesson.id));
        const used = one.lessons.filter((lesson) => days.has(lesson.id)).some((lesson) => lesson.body.some((block) => block.type === 'activity' && (block.activity.kind === 'roleplay' || block.activity.kind === 'message-review')));
        expect({ course: one.id, module: module.id, used }).toEqual({ course: one.id, module: module.id, used: true });
      }
    }
  });

  test('every item is used by exactly one activity and every activity names an item that exists', () => {
    for (const item of PRACTICE_ITEMS) if (item.kind !== 'lab') expect({ id: item.id, uses: usage.get(item.id)?.length ?? 0 }).toEqual({ id: item.id, uses: 1 });
    for (const id of usage.keys()) expect(findPracticeItem(id)).toBeDefined();
  });

  test('role-plays are well formed: a partner with private motives, sane turn limits, 3 to 6 known criteria', () => {
    for (const item of PRACTICE_ITEMS) {
      if (item.kind === 'lab') continue;
      expect(item.title.trim().length).toBeGreaterThan(5);
      expect(item.criteria.length).toBeGreaterThanOrEqual(3);
      for (const criterion of item.criteria) expect(PRACTICE_CRITERIA).toContain(criterion);
      expect(new Set(item.criteria).size).toBe(item.criteria.length);
      if (item.kind !== 'roleplay') continue;
      expect(item.criteria.length).toBeLessThanOrEqual(6);
      expect(PARTNER_ROLES).toContain(item.partner.role);
      expect(item.partner.name.trim().split(/\s+/)).toHaveLength(1);
      for (const text of [item.setting, item.goal, item.opening, item.partner.personality, item.partner.private, item.partner.reactions.good, item.partner.reactions.poor]) expect(text.trim().length).toBeGreaterThan(15);
      expect(item.minTurns).toBeGreaterThanOrEqual(3);
      expect(item.minTurns).toBeLessThanOrEqual(5);
      expect(item.maxTurns).toBeGreaterThanOrEqual(6);
      expect(item.maxTurns).toBeLessThanOrEqual(12);
      expect(item.strongSigns.length).toBeGreaterThanOrEqual(3);
      expect(item.traps.length).toBeGreaterThanOrEqual(3);
    }
  });

  test('message tasks say what a complete answer contains and how long it is', () => {
    for (const item of PRACTICE_ITEMS) {
      if (item.kind !== 'message') continue;
      expect(item.mustInclude.length).toBeGreaterThanOrEqual(2);
      expect(item.mustInclude.length).toBeLessThanOrEqual(6);
      expect(item.targetWords.min).toBeGreaterThan(10);
      expect(item.targetWords.max).toBeGreaterThan(item.targetWords.min);
      expect(item.brief.trim().length).toBeGreaterThan(10);
    }
  });

  test('the course names only real items in its projects', () => {
    const titles = new Set(PRACTICE_ITEMS.map((item) => item.title));
    expect(course.projects).toHaveLength(3);
    expect(internationalClientsCourse.projects).toHaveLength(3);
    const projects = COURSES.flatMap((one) => one.projects);
    for (const project of projects) expect(project.steps.length).toBeGreaterThanOrEqual(6);
    // Project steps cite items by title; any quoted title that looks like an item must exist.
    const quoted = projects.flatMap((project) => project.steps.flatMap((step) => [...step.text.matchAll(/“([^”]+)”|"([^"]+)"/g)].map((match) => match[1] ?? match[2] ?? '')));
    const missing = quoted.filter((text) => text.length > 12 && !titles.has(text) && PRACTICE_ITEMS.some((item) => item.title.toLowerCase().includes(text.toLowerCase().slice(0, 12))));
    expect(missing).toEqual([]);
  });
});

/** The prompt labs (Generative AI course): `practice/labs/module-NN.ts`. The rules live in `lib/lab-rules.ts`; with no labs written yet these pass over nothing. */
describe('the prompt-lab catalog', () => {
  const labs = PRACTICE_ITEMS.filter((item) => item.kind === 'lab');
  // Prompt labs belong to the Generative AI course (`lab-NN-`) and to Software Architecture with AI (`arch-NN-`).
  const labCourses = ALL_COURSES.filter((entry) => entry.id === 'generative-ai-applications' || entry.id === 'software-architecture-ai');
  const labUsage = new Map<string, string[]>();
  for (const lesson of labCourses.flatMap((entry) => entry.lessons)) {
    for (const block of lesson.body) if (block.type === 'activity' && block.activity.kind === 'prompt-lab') labUsage.set(block.activity.labId, [...(labUsage.get(block.activity.labId) ?? []), block.activity.id]);
  }

  test('ids are unique across the whole practice catalog, and each lab can be found by id', () => {
    expect(new Set(PRACTICE_ITEMS.map((item) => item.id)).size).toBe(PRACTICE_ITEMS.length);
    for (const lab of labs) expect(findLab(lab.id)).toBe(lab);
  });

  test('every lab meets the lab rules (ids, 3 to 6 criteria, 3 to 5 tips, 2 to 4 verify items, maxRuns, material, fields and key, tools and fixtures, nothing private repeated)', () => {
    for (const lab of labs) if (lab.kind === 'lab') expect({ id: lab.id, problems: labProblems(lab) }).toEqual({ id: lab.id, problems: [] });
  });

  test('every lab is used by exactly one prompt-lab activity, and every prompt-lab activity names a lab that exists', () => {
    for (const lab of labs) expect({ id: lab.id, uses: labUsage.get(lab.id)?.length ?? 0 }).toEqual({ id: lab.id, uses: 1 });
    for (const id of labUsage.keys()) expect(findLab(id)).toBeDefined();
  });

  test('a lab that breaks the rules would be caught (the rules are not vacuous)', () => {
    const [first] = labs;
    const broken = first && first.kind === 'lab' ? { ...first, tips: [], system: 'The answer is 42.' } : null;
    if (broken) expect(labProblems(broken).length).toBeGreaterThan(0);
    expect(labProblems({ id: 'bad', kind: 'lab', title: '', experiment: 'summarization', situation: '', goal: '', starterPrompt: '', system: 'The answer is x.', maxRuns: 1, output: { format: 'json', fields: [] }, criteria: [], tips: [], example: { prompt: '', outcome: '' }, verify: [], difficulty: 'gentle' }).length).toBeGreaterThan(8);
  });
});
