import { describe, expect, test } from '@jest/globals';

import { CATEGORY_IDS, LEARNING_GOAL_IDS } from '../../content/types';
import { getTechnology } from '../../content/catalog/technologies';
import { GOAL_IDS, INTEREST_IDS, NOT_SURE } from '../../../onboarding/lib/options';
import { buildCourseFacts } from '../catalog-facts';
import { makeCourse } from '../fixtures.test-helpers';
import { recommendCourses } from './recommend';
import { FACTS, idsOf, signalsFor } from './recommendations.test-helpers';
import { GOAL_TARGETS, INTEREST_TARGETS, goalCoverage, topicCoverage, type TopicInterestId } from './profile-mapping';

const TOPIC_INTERESTS = INTEREST_IDS.filter((id): id is TopicInterestId => id !== NOT_SURE);

describe('mapping onboarding answers to catalog attributes', () => {
  test('every goal and every interest of onboarding is mapped', () => {
    for (const goal of GOAL_IDS) expect(GOAL_TARGETS[goal]).toBeDefined();
    for (const interest of TOPIC_INTERESTS) expect(INTEREST_TARGETS[interest]).toBeDefined();
    expect(Object.keys(GOAL_TARGETS).sort()).toEqual([...GOAL_IDS].sort());
    expect(Object.keys(INTEREST_TARGETS).sort()).toEqual([...TOPIC_INTERESTS].sort());
  });

  test('targets only use categories, goals and technology ids that exist (a target has no field for course ids)', () => {
    for (const target of [...Object.values(GOAL_TARGETS), ...Object.values(INTEREST_TARGETS)]) {
      const categories = [...(target.categories ?? []), ...(target.near?.categories ?? [])];
      for (const category of categories) expect(CATEGORY_IDS).toContain(category);
      for (const goal of target.goals ?? []) expect(LEARNING_GOAL_IDS).toContain(goal);
      for (const technology of [...(target.technologies ?? []), ...(target.near?.technologies ?? [])]) expect(getTechnology(technology)).toBeDefined();
    }
  });
});

/** Languages, frameworks and computer-science topics: no course is about them, AI-first courses use them as tools. */
const TOOL_INTERESTS = Object.entries(INTEREST_TARGETS)
  .filter(([, target]) => target.usedAsTool)
  .map(([interest]) => interest as TopicInterestId);

describe('topicCoverage is derived from what the catalog really teaches', () => {
  test('topics that have an AI-first course of their own', () => {
    const expected: Partial<Record<TopicInterestId, string>> = {
      backend: 'ai-backend-dev',
      apis: 'ai-api-integration',
      databases: 'ai-database-design',
      'db-management': 'ai-database-design',
      architecture: 'ai-architecture',
      'system-design': 'ai-architecture',
      cybersecurity: 'ai-coding-security',
      'ai-apps': 'build-ai-app',
    };
    for (const [interest, courseId] of Object.entries(expected) as [TopicInterestId, string][]) {
      expect(topicCoverage(interest, FACTS)).toEqual({ interest, status: 'course', courseId });
    }
    for (const interest of ['ai', 'ai-coding', 'genai', 'llm'] as const) {
      const coverage = topicCoverage(interest, FACTS);
      expect(coverage.status).toBe('course');
      expect(FACTS.some((facts) => facts.id === coverage.courseId)).toBe(true);
    }
    expect(topicCoverage('ai-coding', FACTS).courseId).toBe('choose-ai-tool');
  });

  test('a language or framework is never "a course", and never "coming soon": it is covered in context by the courses that use it', () => {
    expect(TOOL_INTERESTS).toEqual(expect.arrayContaining(['javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'go', 'swift', 'kotlin', 'sql', 'html-css', 'react', 'nextjs', 'nodejs', 'express', 'react-native', 'expo', 'flutter', 'ios', 'android']));
    for (const interest of TOOL_INTERESTS) {
      const coverage = topicCoverage(interest, FACTS);
      expect(coverage.status).toBe('related');
      expect(FACTS.some((facts) => facts.id === coverage.courseId)).toBe(true);
    }
  });

  test('the course pointed at really uses the technology, when any course lists it', () => {
    const listing = (technology: string, courseId: string | null) => expect(FACTS.find((facts) => facts.id === courseId)?.technologies).toContain(technology);
    listing('react', topicCoverage('react', FACTS).courseId);
    listing('html-css', topicCoverage('html-css', FACTS).courseId);
    listing('python', topicCoverage('python', FACTS).courseId);
    listing('react-native', topicCoverage('react-native', FACTS).courseId);
    listing('expo', topicCoverage('expo', FACTS).courseId);
    expect(topicCoverage('react-native', FACTS).courseId).toBe('build-mobile-app-ai');
    expect(topicCoverage('python', FACTS).courseId).toBe('mini-python-ai');
    expect(topicCoverage('sql', FACTS).courseId).toBe('mini-ai-data');
  });

  test('a language no course lists points at the nearest course instead: Swift and Kotlin at the mobile course, PHP and Go at the backend one', () => {
    expect(topicCoverage('swift', FACTS).courseId).toBe('build-mobile-app-ai');
    expect(topicCoverage('kotlin', FACTS).courseId).toBe('build-mobile-app-ai');
    expect(topicCoverage('php', FACTS).courseId).toBe('ai-backend-dev');
    expect(topicCoverage('go', FACTS).courseId).toBe('ai-backend-dev');
    expect(topicCoverage('flutter', FACTS).courseId).toBe('build-mobile-app-ai');
  });

  test('machine learning has no course: it points at the nearest one and says so', () => {
    const coverage = topicCoverage('ml', FACTS);
    expect(coverage.status).toBe('related');
    expect(coverage.courseId).not.toBeNull();
  });

  test('it updates itself when a course about a topic that has none is added', () => {
    const before = topicCoverage('networking', FACTS);
    expect(before.status).toBe('related');
    const course = { ...makeCourse('ai-assisted-networking', 6, [], 'standard'), title: 'Networking Basics for AI Builders', level: 'beginner' as const };
    const withNetworking = buildCourseFacts([...FACTS.map((facts) => facts.course), course]);
    // A topic with no course of its own stays "related" (to the course that now says it), never "a course".
    expect(topicCoverage('networking', withNetworking).status).toBe('related');
  });

  test('a topic with no matching course at all is "soon" with no course', () => {
    const tiny = buildCourseFacts([makeCourse('only-one', 5, [], 'standard')]);
    expect(topicCoverage('flutter', tiny)).toEqual({ interest: 'flutter', status: 'soon', courseId: null });
    expect(topicCoverage('backend', tiny)).toEqual({ interest: 'backend', status: 'soon', courseId: null });
  });
});

describe('onboarding answers lift the AI-first courses that use what they name', () => {
  const rankFor = (interests: TopicInterestId[]) => idsOf(recommendCourses(signalsFor({ experience: 'intermediate', interests }), FACTS));

  test('an interest in a language lifts the courses that list it, not a course about it', () => {
    expect(rankFor(['react']).indexOf('build-website-ai')).toBeLessThan(5);
    expect(rankFor(['react-native']).indexOf('build-mobile-app-ai')).toBeLessThan(3);
    expect(rankFor(['python']).indexOf('mini-python-ai')).toBeLessThan(3);
    expect(rankFor(['sql']).indexOf('mini-ai-data')).toBeLessThan(3);
    expect(rankFor(['expo']).indexOf('build-mobile-app-ai')).toBeLessThan(3);
  });

  test('every interest lifts something: its first picks are real courses of the catalog', () => {
    for (const interest of TOPIC_INTERESTS) {
      const picks = recommendCourses(signalsFor({ experience: 'intermediate', interests: [interest] }), FACTS).slice(0, 3);
      expect(picks.some((entry) => entry.relevance > 0)).toBe(true);
    }
  });

  test('a goal with no course, game development, is coming soon', () => {
    expect(goalCoverage('game-dev', FACTS).status).toBe('soon');
    for (const goal of GOAL_IDS.filter((id) => id !== 'game-dev')) expect(goalCoverage(goal, FACTS).status).toBe('course');
  });
});
