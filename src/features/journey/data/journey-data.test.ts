import { describe, expect, test } from '@jest/globals';

import symbols from '@/components/ui/material-symbols.json';
import { COURSES } from '@/features/courses/content';
import { CATALOG_SYLLABUS } from '@/features/courses/content/catalog';
import { JOURNEY_COMPLETE_BADGE, JOURNEY_STAGE_BADGES } from '@/features/courses/lib/badges';

import { JOURNEY_FOCUS_IDS } from '../lib/focus-ids';
import { AI_BUILDER_JOURNEY } from './journey';

const stages = AI_BUILDER_JOURNEY.stages;
const milestones = stages.flatMap((stage) => stage.milestones);
const courseById = new Map(COURSES.map((course) => [course.id, course]));
const syllabusIds = new Set(CATALOG_SYLLABUS.map((entry) => entry.id));

describe('the journey definition is real', () => {
  test('four levels in order, with unique ids', () => {
    expect(stages.map((stage) => stage.level)).toEqual(['beginner', 'intermediate', 'advanced', 'expert']);
    expect(new Set(stages.map((stage) => stage.id)).size).toBe(stages.length);
    expect(new Set(milestones.map((milestone) => milestone.id)).size).toBe(milestones.length);
  });

  test('every course in the catalog has exactly one place in the journey (a new course must be placed by its level)', () => {
    const placed = milestones.flatMap((milestone) => milestone.steps.flatMap((step) => (step.kind === 'learn' ? [step.courseId] : [])));
    expect(placed.filter((id, index) => placed.indexOf(id) !== index)).toEqual([]);
    expect(COURSES.map((course) => course.id).filter((id) => !placed.includes(id))).toEqual([]);
  });

  test('every level has a real road: several required milestones and a practical challenge in most', () => {
    for (const stage of stages) {
      const road = stage.milestones.filter((milestone) => !milestone.side);
      expect(road.length).toBeGreaterThanOrEqual(6);
      expect(road.filter((milestone) => milestone.steps.some((step) => step.kind === 'build')).length).toBeGreaterThanOrEqual(road.length - 1);
    }
  });

  test('every course a step names is in the catalog, or on the syllabus as coming soon', () => {
    const unknown: string[] = [];
    for (const milestone of milestones) {
      for (const step of milestone.steps) {
        if (step.kind === 'action') continue;
        if (!courseById.has(step.courseId) && !syllabusIds.has(step.courseId)) unknown.push(`${milestone.id}: ${step.courseId}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  test('every project a step names exists in the course it says', () => {
    const wrong: string[] = [];
    for (const milestone of milestones) {
      for (const step of milestone.steps) {
        if (step.kind !== 'build') continue;
        const course = courseById.get(step.courseId);
        // A course that isn't written yet has no projects to check.
        if (course && !course.projects.some((project) => project.id === step.projectId)) wrong.push(`${milestone.id}: ${step.courseId}/${step.projectId}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  test('no course or project is counted by two different milestones', () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const milestone of milestones) {
      for (const step of milestone.steps) {
        const key = step.kind === 'learn' ? `learn:${step.courseId}` : step.kind === 'build' ? `build:${step.projectId}` : `action:${step.action}`;
        const owner = seen.get(key);
        if (owner && owner !== milestone.id) clashes.push(`${key} in ${owner} and ${milestone.id}`);
        seen.set(key, milestone.id);
      }
    }
    expect(clashes).toEqual([]);
  });

  test('rules point only at earlier milestones, so there is no loop', () => {
    const order = new Map(milestones.map((milestone, index) => [milestone.id, index]));
    const bad: string[] = [];
    for (const milestone of milestones) {
      for (const id of milestone.requires ?? []) {
        const at = order.get(id);
        if (at === undefined || at >= order.get(milestone.id)!) bad.push(`${milestone.id} requires ${id}`);
      }
    }
    expect(bad).toEqual([]);
  });

  test('every milestone can be read: title, summary, why, objectives, a step that counts, a real icon', () => {
    const icons = symbols as Record<string, number>;
    for (const stage of stages) {
      expect(stage.title.length).toBeGreaterThan(0);
      expect(icons[stage.icon]).toBeDefined();
    }
    for (const milestone of milestones) {
      expect(milestone.title.length).toBeGreaterThan(0);
      expect(milestone.summary.length).toBeGreaterThan(0);
      expect(milestone.why.length).toBeGreaterThan(20);
      expect(milestone.objectives.length).toBeGreaterThanOrEqual(2);
      expect(milestone.steps.some((step) => !step.optional)).toBe(true);
      expect(icons[milestone.icon]).toBeDefined();
      for (const id of milestone.audience ?? []) expect(JOURNEY_FOCUS_IDS).toContain(id);
    }
  });

  test('the first milestone is open from the start and the journey ends at a capstone', () => {
    expect(milestones[0]!.requires).toEqual([]);
    expect(milestones[milestones.length - 1]!.kind).toBe('capstone');
  });

  test('the journey reuses a good share of the real catalog and mixes courses with challenges', () => {
    const learn = milestones.filter((milestone) => milestone.kind === 'learn').length;
    const challenge = milestones.filter((milestone) => milestone.kind === 'challenge').length;
    expect(learn).toBeGreaterThan(15);
    expect(challenge).toBeGreaterThanOrEqual(6);
  });
});

describe('achievements', () => {
  test('every stage has its badge, and the badge ids line up', () => {
    expect(JOURNEY_STAGE_BADGES.map((badge) => badge.stageId)).toEqual(stages.map((stage) => stage.id));
    expect(JOURNEY_COMPLETE_BADGE).toContain(':');
  });
});
