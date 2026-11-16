import { describe, expect, test } from '@jest/globals';

import { collectAchievements, uniqueText, type AchievementInput } from './achievements';

const courses: AchievementInput['courses'] = [
  { id: 'starter', title: 'AI Basics for Tech', projects: [{ id: 'starter-p1', title: 'Prompt kit', summary: 'A prompt library.' }] },
  { id: 'developer', title: 'AI Developer', projects: [{ id: 'developer-p1', title: 'AI app', summary: 'An app that calls a model.' }] },
];

function input(overrides: Partial<AchievementInput> = {}): AchievementInput {
  return {
    courses,
    progress: [
      { courseId: 'starter', started: true, fraction: 1, skills: [{ label: 'Prompting', fraction: 1 }, { label: 'Ethics', fraction: 0.5 }] },
      { courseId: 'developer', started: true, fraction: 0.3, skills: [{ label: 'prompting', fraction: 0.6 }, { label: 'APIs', fraction: 0.6 }] },
    ],
    passedProjects: [
      { projectId: 'developer-p1', courseId: 'developer', link: 'https://app.example.com', reviewedAt: '2026-11-10T00:00:00Z' },
      { projectId: 'starter-p1', courseId: 'starter', link: null, reviewedAt: '2026-11-01T00:00:00Z' },
      { projectId: 'gone-p9', courseId: 'gone', link: null, reviewedAt: null },
    ],
    certificates: [
      { course_id: 'master', issued_at: '2026-11-12T08:00:00Z', verify_url: null },
      { course_id: 'starter', issued_at: '2026-11-02T08:00:00Z', verify_url: 'https://talino.example/c/1' },
    ],
    badges: [
      { id: 'first-project', title: 'First project shipped' },
      { id: 'first-income', title: 'First earnings' },
    ],
    masterTitle: 'Talino Master',
    ...overrides,
  };
}

describe('collectAchievements', () => {
  test('passed projects in the order they were reviewed, with their course; unknown ones dropped', () => {
    expect(collectAchievements(input()).projects).toEqual([
      { title: 'Prompt kit', course: 'AI Basics for Tech', summary: 'A prompt library.', link: null },
      { title: 'AI app', course: 'AI Developer', summary: 'An app that calls a model.', link: 'https://app.example.com' },
    ]);
  });

  test('certificates by issue date, Talino Master by name', () => {
    expect(collectAchievements(input()).certificates).toEqual([
      { title: 'AI Basics for Tech', issued: '2026-11-02', url: 'https://talino.example/c/1' },
      { title: 'Talino Master', issued: '2026-11-12', url: null },
    ]);
  });

  test('the AI Expert certificate reads as its title and the journey, with its date', () => {
    const base = input();
    const withJourney = collectAchievements(input({ certificates: [...base.certificates, { course_id: 'ai-journey', issued_at: '2026-12-01T08:00:00Z', verify_url: null }] }));
    expect(withJourney.certificates.at(-1)).toEqual({ title: 'Certified AI Expert, Talino AI Builder Journey', issued: '2026-12-01', url: null });
  });

  test('skills at 0.6 or more, each once', () => {
    expect(collectAchievements(input()).skills).toEqual(['Prompting', 'APIs']);
  });

  test('the career tracker’s badges stay private', () => {
    expect(collectAchievements(input()).badges).toEqual([{ id: 'first-project', title: 'First project shipped' }]);
  });

  test('the current course is the one furthest along; none before starting', () => {
    expect(collectAchievements(input()).currentCourse).toBe('AI Basics for Tech');
    expect(collectAchievements(input({ progress: [] })).currentCourse).toBeNull();
  });
});

describe('uniqueText', () => {
  test('trims, drops blanks and keeps the first spelling', () => {
    expect(uniqueText([' React ', 'react', '', 'SQL'])).toEqual(['React', 'SQL']);
  });
});
