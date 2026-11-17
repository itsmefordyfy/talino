import { describe, expect, test } from '@jest/globals';

import type { MessageTask, PracticeItem, RoleplayScenario } from '@/features/practice/types';

import type { MessageReviewActivity, RoleplayActivity } from '../types';
import { defineActivity, validateActivity, validateStructure } from './validate';

const scenario: RoleplayScenario = {
  id: 'comm-late-reply-client',
  kind: 'roleplay',
  title: 'A late reply',
  setting: 'You are late.',
  goal: 'Agree a date.',
  partner: { role: 'client', name: 'Dana', title: 'Owner', personality: 'brisk', private: 'secret', reactions: { good: 'warms', poor: 'cools' } },
  opening: 'Where is it?',
  minTurns: 3,
  maxTurns: 8,
  criteria: ['clarity', 'tone', 'accountability'],
  strongSigns: ['owns the delay'],
  traps: ['excuses'],
  difficulty: 'realistic',
};
const task: MessageTask = {
  id: 'comm-delay-email',
  kind: 'message',
  title: 'Delay email',
  situation: 'You are late.',
  brief: 'Write to Dana.',
  channel: 'email',
  mustInclude: ['new date', 'apology'],
  targetWords: { min: 60, max: 150 },
  criteria: ['clarity', 'tone'],
  difficulty: 'realistic',
};
const catalog = new Map<string, PracticeItem>([
  [scenario.id, scenario],
  [task.id, task],
]);
const lookup = (id: string) => catalog.get(id);

const roleplay = (overrides: Partial<RoleplayActivity> = {}): RoleplayActivity => ({
  id: 'late-reply-practice',
  kind: 'roleplay',
  title: 'Talk to Dana',
  prompt: 'Agree a new date with Dana.',
  hints: ['Start with the facts.', 'Offer a concrete next step.'],
  explanation: 'A calm, specific reply rebuilds trust.',
  concept: 'handling delays',
  scenarioId: scenario.id,
  ...overrides,
});
const review = (overrides: Partial<MessageReviewActivity> = {}): MessageReviewActivity => ({
  id: 'delay-email-practice',
  kind: 'message-review',
  title: 'Write to Dana',
  prompt: 'Write the email.',
  hints: ['Say what happened.', 'Give the new date.'],
  explanation: 'Clear and accountable.',
  concept: 'writing about delays',
  taskId: task.id,
  ...overrides,
});

const text = (problems: string[]) => problems.join(' | ');

describe('role-play and message-review activities', () => {
  test('valid ones pass', () => {
    expect(validateActivity(roleplay(), lookup)).toEqual([]);
    expect(validateActivity(review(), lookup)).toEqual([]);
  });

  test('a scenario or task that is not in the catalog is a problem', () => {
    expect(text(validateActivity(roleplay({ scenarioId: 'no-such-one' }), lookup))).toContain('no-such-one');
    expect(text(validateActivity(review({ taskId: 'no-such-one' }), lookup))).toContain('no-such-one');
  });

  test('the id must name an item of the right kind', () => {
    expect(text(validateActivity(roleplay({ scenarioId: task.id }), lookup))).toContain('role-play scenario');
    expect(text(validateActivity(review({ taskId: scenario.id }), lookup))).toContain('message task');
  });

  test('needs at least two hints and none empty', () => {
    expect(text(validateActivity(roleplay({ hints: ['Only one.'] }), lookup))).toContain('at least 2 hints');
    expect(text(validateActivity(review({ hints: ['Fine.', ' '] }), lookup))).toContain('a hint is empty');
  });

  test('an empty or malformed id is caught by structure alone, without the catalog', () => {
    expect(text(validateStructure(roleplay({ scenarioId: '' })))).toContain('scenarioId');
    expect(text(validateStructure(review({ taskId: 'Not Kebab' })))).toContain('taskId');
    // Whether the id resolves is `validateActivity`'s job, so authoring a lesson never fails while the catalog is still being written.
    expect(validateStructure(roleplay({ scenarioId: 'not-yet-written' }))).toEqual([]);
  });

  test('defineActivity returns a well-formed one unchanged', () => {
    const value = roleplay();
    expect(defineActivity(value)).toBe(value);
  });
});
