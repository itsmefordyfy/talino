import { describe, expect, test } from '@jest/globals';

import { SCENARIO } from '../test-support';
import { canEnd, judgeable, learnerLines, learnerTurns, phaseOf, roleplayComplete, turnsLeft } from './session';

const say = (role: 'user' | 'assistant', text: string) => ({ role, text });
const talk = (turns: number) => Array.from({ length: turns }).flatMap((_, index) => [say('user', `learner ${index + 1}`), say('assistant', `partner ${index + 1}`)]);

describe('role-play session state', () => {
  test('counts the learner turns only', () => {
    expect(learnerTurns([])).toBe(0);
    expect(learnerTurns([say('assistant', 'Opening.')])).toBe(0);
    expect(learnerTurns(talk(2))).toBe(2);
    expect(learnerLines([say('assistant', 'Hi'), say('user', 'one'), say('assistant', 'x'), say('user', 'two')])).toEqual(['one', 'two']);
  });

  test('the learner can end only after minTurns', () => {
    expect(canEnd(SCENARIO, talk(SCENARIO.minTurns - 1))).toBe(false);
    expect(canEnd(SCENARIO, talk(SCENARIO.minTurns))).toBe(true);
    expect(canEnd(SCENARIO, talk(SCENARIO.maxTurns))).toBe(true);
  });

  test('turns left count down to the limit and stop at zero', () => {
    expect(turnsLeft(SCENARIO, [])).toBe(SCENARIO.maxTurns);
    expect(turnsLeft(SCENARIO, talk(2))).toBe(SCENARIO.maxTurns - 2);
    expect(turnsLeft(SCENARIO, talk(SCENARIO.maxTurns + 3))).toBe(0);
  });

  test('the phase is talking, then can-end, then must-end; a partner who ended it must-end at once', () => {
    expect(phaseOf(SCENARIO, [], false)).toBe('talking');
    expect(phaseOf(SCENARIO, talk(SCENARIO.minTurns - 1), false)).toBe('talking');
    expect(phaseOf(SCENARIO, talk(SCENARIO.minTurns), false)).toBe('can-end');
    expect(phaseOf(SCENARIO, talk(SCENARIO.maxTurns), false)).toBe('must-end');
    expect(phaseOf(SCENARIO, talk(1), true)).toBe('must-end');
  });

  test('a role-play counts as done only with enough turns and a debrief that could judge them', () => {
    expect(roleplayComplete(SCENARIO, talk(SCENARIO.minTurns), { tooShort: false })).toBe(true);
    expect(roleplayComplete(SCENARIO, talk(SCENARIO.minTurns - 1), { tooShort: false })).toBe(false);
    expect(roleplayComplete(SCENARIO, talk(SCENARIO.minTurns), null)).toBe(false);
    expect(roleplayComplete(SCENARIO, talk(SCENARIO.minTurns), { tooShort: true })).toBe(false);
  });
});

describe('judgeable', () => {
  test('a debrief needs the full turns and enough said in them', () => {
    const said = (...lines: string[]) => lines.flatMap((text) => [say('user', text), say('assistant', 'Hm.')]);
    const enough = 'I am sorry the draft is late and I can send it by Friday at noon.';
    expect(judgeable(SCENARIO, said(enough, enough, enough))).toBe(true);
    expect(judgeable(SCENARIO, said(enough, enough))).toBe(false);
    expect(judgeable(SCENARIO, said('ok', 'ok', 'fine'))).toBe(false);
    expect(judgeable(SCENARIO, [])).toBe(false);
  });
});
