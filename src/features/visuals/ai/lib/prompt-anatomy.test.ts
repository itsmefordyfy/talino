import { describe, expect, test } from '@jest/globals';

import { promptAnatomyStrings } from '../prompt-anatomy-strings';
import { ALL_ON, answerProfile, assemblePrompt, BASE_KEYS, CHECK_IDS, CHECK_PART, clarityChecklist, clarityLevel, onCount, PART_IDS, START_SELECTION, togglePart, type PartSelection } from './prompt-anatomy';

const t = promptAnatomyStrings.en;
const texts = Object.fromEntries(PART_IDS.map((id) => [id, t.parts[id].text])) as Record<(typeof PART_IDS)[number], string>;

/** Every on/off combination of the six parts. */
const ALL_SELECTIONS: PartSelection[] = Array.from({ length: 2 ** PART_IDS.length }, (_, bits) => Object.fromEntries(PART_IDS.map((id, index) => [id, (bits >> index) % 2 === 1])) as PartSelection);

describe('building the prompt', () => {
  test('starts with only the task, and a toggle flips one part without touching the others', () => {
    expect(START_SELECTION).toMatchObject({ task: true, role: false, context: false, format: false, constraints: false, example: false });
    const next = togglePart(START_SELECTION, 'format');
    expect(next.format).toBe(true);
    expect(PART_IDS.filter((id) => next[id])).toEqual(['task', 'format']);
    expect(START_SELECTION.format).toBe(false);
    expect(togglePart(next, 'format')).toEqual(START_SELECTION);
  });

  test('assembles the parts that are on, in the fixed order, one line each', () => {
    const { lines, text } = assemblePrompt(ALL_ON, texts);
    expect(lines.map((line) => line.id)).toEqual([...PART_IDS]);
    expect(text.split('\n')).toEqual(PART_IDS.map((id) => texts[id]));
    expect(assemblePrompt(START_SELECTION, texts).text).toBe(texts.task);
    expect(assemblePrompt({ ...START_SELECTION, task: false }, texts)).toEqual({ lines: [], text: '' });
    expect(onCount(ALL_ON)).toBe(6);
  });
});

describe('the checklist', () => {
  test('every check passes exactly when the part that says it is on, for all 64 combinations', () => {
    for (const selection of ALL_SELECTIONS) {
      for (const item of clarityChecklist(selection)) expect(item.passed).toBe(selection[CHECK_PART[item.id]]);
    }
    expect(clarityChecklist(ALL_ON).every((item) => item.passed)).toBe(true);
    expect(clarityChecklist(START_SELECTION).filter((item) => item.passed).map((item) => item.id)).toEqual(['task']);
  });

  test('has a why for every check and a label for every part', () => {
    for (const id of CHECK_IDS) {
      expect(t.checks[id].label.length).toBeGreaterThan(3);
      expect(t.checks[id].missing.length).toBeGreaterThan(10);
    }
    for (const id of PART_IDS) {
      expect(t.parts[id].label.length).toBeGreaterThan(2);
      expect(t.parts[id].text.length).toBeGreaterThan(10);
    }
  });

  test('the level is vague, fair or strong by how many parts are on, and never better than vague without a task', () => {
    expect(clarityLevel(START_SELECTION)).toEqual({ passed: 1, total: 6, level: 'vague' });
    expect(clarityLevel({ ...START_SELECTION, context: true, format: true })).toMatchObject({ passed: 3, level: 'fair' });
    expect(clarityLevel({ ...ALL_ON, example: false })).toMatchObject({ passed: 5, level: 'strong' });
    expect(clarityLevel(ALL_ON)).toMatchObject({ passed: 6, level: 'strong' });
    expect(clarityLevel({ ...ALL_ON, task: false }).level).toBe('vague');
  });
});

describe('how the answer might change (hand-written illustrations)', () => {
  test('there is a note for every combination of context, format and limits, and a special one for no task', () => {
    expect(BASE_KEYS).toHaveLength(8);
    for (const key of BASE_KEYS) expect(t.answers.base[key].length).toBeGreaterThan(30);
    expect(t.answers.base['no-task'].length).toBeGreaterThan(30);
  });

  test('the profile follows the three parts that shape an answer, plus role and example as modifiers', () => {
    for (const selection of ALL_SELECTIONS) {
      const profile = answerProfile(selection);
      if (!selection.task) expect(profile.base).toBe('no-task');
      else expect(profile.base).toBe(`${selection.context ? 1 : 0}${selection.format ? 1 : 0}${selection.constraints ? 1 : 0}`);
      expect(profile.role).toBe(selection.role);
      expect(profile.example).toBe(selection.example);
    }
  });

  test('every one of the 64 combinations has a distinct, non-empty note', () => {
    const notes = new Set<string>();
    for (const selection of ALL_SELECTIONS) {
      const profile = answerProfile(selection);
      const note = [t.answers.base[profile.base], profile.role ? t.answers.role : '', profile.example ? t.answers.example : ''].filter(Boolean).join(' ');
      expect(note.length).toBeGreaterThan(30);
      notes.add(`${profile.base}|${profile.role}|${profile.example}`);
    }
    // 9 bases x 2 x 2 = 36 distinct profiles for 64 selections (no-task ignores context, format and limits).
    expect(notes.size).toBe(36);
  });

  test('says it is an illustration and never claims a real answer', () => {
    expect(t.illustration).toMatch(/illustration/i);
    expect(t.answers.label).toMatch(/illustration/i);
    for (const note of [...Object.values(t.answers.base), t.answers.role, t.answers.example]) expect(note).not.toMatch(/\b(chatgpt|gemini|claude)\b/i);
  });
});
