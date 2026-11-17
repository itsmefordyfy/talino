import { describe, expect, test } from '@jest/globals';

import { imagePromptStrings } from '../image-prompt-strings';
import { AVOID_IDS, buildImagePrompt, choiceCount, COMPOSITION_IDS, contradictionsOf, EMPTY_CHOICES, LIGHT_IDS, MAX_LIGHTS, MAX_STYLES, MOOD_IDS, sketchOf, specificityChecklist, specificityLevel, START_CHOICES, STYLE_IDS, SUBJECT_IDS, limitPicks, type ImageChoices } from './image-prompt';

const t = imagePromptStrings.en;
const prompt = (choices: ImageChoices) => buildImagePrompt(choices, t.phrases);
const passed = (choices: ImageChoices) => specificityChecklist(choices).filter((item) => item.passed).map((item) => item.id);

const FULL: ImageChoices = { subject: 'bread', styles: ['photo'], composition: 'closeup', lights: ['golden'], mood: 'cozy', avoid: 'text' };

describe('limiting picks', () => {
  test('keeps the newest picks, so choosing past the maximum drops the oldest', () => {
    expect(limitPicks(['photo', 'sketch'], MAX_STYLES)).toEqual(['photo', 'sketch']);
    expect(limitPicks(['photo', 'sketch', 'flat', 'render'], MAX_STYLES)).toEqual(['sketch', 'flat', 'render']);
    expect(limitPicks(['morning', 'golden', 'studio'], MAX_LIGHTS)).toEqual(['golden', 'studio']);
  });

  test('counts every choice', () => {
    expect(choiceCount(EMPTY_CHOICES)).toBe(0);
    expect(choiceCount(START_CHOICES)).toBe(2);
    expect(choiceCount({ ...FULL, styles: ['photo', 'sketch'], lights: ['golden', 'studio'] })).toBe(8);
  });
});

describe('the prompt text', () => {
  test('is empty with nothing chosen and builds in the fixed order with the thing to avoid last', () => {
    expect(prompt(EMPTY_CHOICES)).toBe('');
    expect(prompt(START_CHOICES)).toBe('A golden sourdough loaf on a wooden table, photograph.');
    expect(prompt(FULL)).toBe('A golden sourdough loaf on a wooden table, photograph, close-up shot, golden hour light, cozy mood. Avoid text and logos.');
  });

  test('joins two styles or lights, and an avoid on its own still reads', () => {
    expect(prompt({ ...START_CHOICES, styles: ['photo', 'watercolor'] })).toBe('A golden sourdough loaf on a wooden table, photograph and watercolor painting.');
    expect(prompt({ ...EMPTY_CHOICES, avoid: 'blur' })).toBe('Avoid blur.');
  });

  test('every option has a label and a phrase, and the phrases appear in the prompt', () => {
    for (const id of SUBJECT_IDS) expect(prompt({ ...EMPTY_CHOICES, subject: id }).toLowerCase()).toContain(t.phrases.subject[id].toLowerCase());
    for (const id of STYLE_IDS) expect(prompt({ ...EMPTY_CHOICES, styles: [id] }).toLowerCase()).toContain(t.phrases.style[id].toLowerCase());
    for (const id of COMPOSITION_IDS) expect(prompt({ ...EMPTY_CHOICES, composition: id }).toLowerCase()).toContain(t.phrases.composition[id].toLowerCase());
    for (const id of LIGHT_IDS) expect(prompt({ ...EMPTY_CHOICES, lights: [id] }).toLowerCase()).toContain(t.phrases.light[id].toLowerCase());
    for (const id of MOOD_IDS) expect(prompt({ ...EMPTY_CHOICES, mood: id }).toLowerCase()).toContain(t.phrases.mood[id].toLowerCase());
    for (const id of AVOID_IDS) expect(prompt({ ...EMPTY_CHOICES, avoid: id }).toLowerCase()).toContain(t.phrases.avoid[id].toLowerCase());
    for (const [group, ids] of [['subject', SUBJECT_IDS], ['style', STYLE_IDS], ['composition', COMPOSITION_IDS], ['light', LIGHT_IDS], ['mood', MOOD_IDS], ['avoid', AVOID_IDS]] as const) {
      const options = t.options[group] as Record<string, string>;
      for (const id of ids) expect(options[id].length).toBeGreaterThan(2);
    }
  });
});

describe('contradictions', () => {
  test('a photo is not also a watercolor, a sketch, a flat drawing or a 3D render', () => {
    for (const other of ['watercolor', 'flat', 'sketch', 'render'] as const) {
      expect(contradictionsOf({ ...START_CHOICES, styles: ['photo', other] })).toEqual([{ kind: 'style', a: 'photo', b: other }]);
    }
    expect(contradictionsOf({ ...START_CHOICES, styles: ['watercolor', 'sketch'] })).toEqual([]);
    expect(contradictionsOf({ ...START_CHOICES, styles: ['watercolor', 'render'] })).toHaveLength(1);
  });

  test('candlelight cannot be morning daylight or studio light', () => {
    expect(contradictionsOf({ ...FULL, lights: ['candle', 'morning'] })).toEqual([{ kind: 'light', a: 'candle', b: 'morning' }]);
    expect(contradictionsOf({ ...FULL, lights: ['candle', 'studio'] })).toHaveLength(1);
    expect(contradictionsOf({ ...FULL, lights: ['candle', 'golden'] })).toEqual([]);
  });

  test('asking to avoid people while the subject has a person in it', () => {
    expect(contradictionsOf({ ...FULL, subject: 'baker', avoid: 'people' })).toEqual([{ kind: 'avoid', a: 'baker', b: 'people' }]);
    expect(contradictionsOf({ ...FULL, subject: 'bread', avoid: 'people' })).toEqual([]);
    expect(contradictionsOf({ ...FULL, subject: 'baker', avoid: 'blur' })).toEqual([]);
  });

  test('every contradiction has words in the strings', () => {
    expect(t.contradiction.style('a', 'b')).toContain('a');
    expect(t.contradiction.light('a', 'b')).toContain('b');
    expect(t.contradiction.avoid('x')).toContain('x');
  });
});

describe('the checklist', () => {
  test('empty: nothing passes, not even "no contradictions"', () => {
    expect(passed(EMPTY_CHOICES)).toEqual([]);
    expect(specificityLevel(EMPTY_CHOICES)).toEqual({ passed: 0, total: 6, level: 'empty' });
  });

  test('each check passes when its part is chosen', () => {
    expect(passed(START_CHOICES)).toEqual(['subject', 'style', 'consistent']);
    expect(passed(FULL)).toEqual(['subject', 'style', 'composition', 'light', 'avoid', 'consistent']);
    expect(specificityLevel(FULL)).toEqual({ passed: 6, total: 6, level: 'specific' });
  });

  test('a contradiction costs the "consistent" check even when everything is named', () => {
    const clash: ImageChoices = { ...FULL, styles: ['photo', 'watercolor'] };
    expect(passed(clash)).toEqual(['subject', 'style', 'composition', 'light', 'avoid']);
    expect(specificityLevel(clash)).toMatchObject({ passed: 5, level: 'specific' });
    expect(specificityLevel({ ...EMPTY_CHOICES, avoid: 'blur' })).toMatchObject({ passed: 2, level: 'vague' });
  });

  test('levels by score', () => {
    expect(specificityLevel(START_CHOICES)).toMatchObject({ passed: 3, level: 'fair' });
    expect(specificityLevel({ ...EMPTY_CHOICES, mood: 'calm' })).toMatchObject({ level: 'vague' });
  });
});

describe('the rough sketch', () => {
  test('is a diagram of the choices: where the subject goes, where the light comes from, the mood colour', () => {
    const sketch = sketchOf(FULL);
    expect(sketch.subject).toEqual({ x: 0.15, y: 0.15, w: 0.7, h: 0.7 });
    expect(sketch.light).toHaveLength(1);
    expect(sketch.palette).toBe('amber');
    expect(sketch.horizon).toBeNull();
  });

  test('nothing chosen draws nothing specific; a wide shot has a horizon and a small subject low in the frame', () => {
    expect(sketchOf(EMPTY_CHOICES)).toEqual({ subject: null, horizon: null, light: [], palette: 'neutral' });
    const wide = sketchOf({ ...EMPTY_CHOICES, composition: 'wide' });
    expect(wide.horizon).not.toBeNull();
    expect(wide.subject!.w).toBeLessThan(0.3);
  });

  test('every box and light spot stays inside the unit square', () => {
    for (const composition of COMPOSITION_IDS) {
      const box = sketchOf({ ...EMPTY_CHOICES, composition }).subject!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.w).toBeLessThanOrEqual(1);
      expect(box.y + box.h).toBeLessThanOrEqual(1);
    }
    for (const light of LIGHT_IDS) {
      const [spot] = sketchOf({ ...EMPTY_CHOICES, lights: [light] }).light;
      expect(spot.x - spot.r).toBeGreaterThanOrEqual(0);
      expect(spot.x + spot.r).toBeLessThanOrEqual(1);
      expect(spot.y - spot.r).toBeGreaterThanOrEqual(0);
      expect(spot.y + spot.r).toBeLessThanOrEqual(1);
    }
  });
});

describe('honesty', () => {
  test('the strings say no image is generated and that the sketch is not a result', () => {
    expect(t.noImage).toMatch(/no image is generated/i);
    expect(t.sketchTitle).toMatch(/rough sketch/i);
    expect(t.sketchNote).toMatch(/not an image/i);
    expect(t.description).toMatch(/no image is generated/i);
  });
});
