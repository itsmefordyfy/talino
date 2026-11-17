/**
 * The image prompt builder: choose a subject, styles, composition, lighting, mood and one thing to avoid, and read the prompt they make and how specific it
 * is. Everything is local and deterministic. No image is generated, and the rough sketch drawn from the choices is a diagram of the idea, never a result.
 */

export const SUBJECT_IDS = ['bread', 'baker', 'storefront'] as const;
export const STYLE_IDS = ['photo', 'watercolor', 'flat', 'sketch', 'render'] as const;
export const COMPOSITION_IDS = ['closeup', 'wide', 'topdown', 'centered'] as const;
export const LIGHT_IDS = ['morning', 'studio', 'golden', 'candle'] as const;
export const MOOD_IDS = ['cozy', 'energetic', 'calm', 'mysterious'] as const;
export const AVOID_IDS = ['text', 'blur', 'crowd', 'people'] as const;

export type SubjectId = (typeof SUBJECT_IDS)[number];
export type StyleId = (typeof STYLE_IDS)[number];
export type CompositionId = (typeof COMPOSITION_IDS)[number];
export type LightId = (typeof LIGHT_IDS)[number];
export type MoodId = (typeof MOOD_IDS)[number];
export type AvoidId = (typeof AVOID_IDS)[number];

/** A subject with a person in it can't also say "no people". */
export const SUBJECT_HAS_PEOPLE: Record<SubjectId, boolean> = { bread: false, baker: true, storefront: false };

export const MAX_STYLES = 3;
export const MAX_LIGHTS = 2;

export type ImageChoices = {
  subject: SubjectId | null;
  styles: StyleId[];
  composition: CompositionId | null;
  lights: LightId[];
  mood: MoodId | null;
  avoid: AvoidId | null;
};

export const EMPTY_CHOICES: ImageChoices = { subject: null, styles: [], composition: null, lights: [], mood: null, avoid: null };

/** A small starting point so the first screen is not blank: a subject and a style. */
export const START_CHOICES: ImageChoices = { ...EMPTY_CHOICES, subject: 'bread', styles: ['photo'] };

/** Keeps the newest `max` picks: a chip row that appends each new pick passes its whole list through this, so choosing past the limit drops the oldest. */
export const limitPicks = <T>(items: readonly T[], max: number): T[] => items.slice(-max);

export const choiceCount = (choices: ImageChoices): number =>
  (choices.subject ? 1 : 0) + choices.styles.length + (choices.composition ? 1 : 0) + choices.lights.length + (choices.mood ? 1 : 0) + (choices.avoid ? 1 : 0);

/** The words for each option (from the strings), so the prompt text is built in the learner's language. */
export type ImagePhrases = {
  subject: Record<SubjectId, string>;
  style: Record<StyleId, string>;
  composition: Record<CompositionId, string>;
  light: Record<LightId, string>;
  mood: Record<MoodId, string>;
  avoid: Record<AvoidId, string>;
  /** "Avoid:" in front of the thing to avoid. */
  avoidLead: string;
  /** Joins two styles or two lights ("and"). */
  and: string;
};

const sentence = (text: string) => (text === '' ? '' : text.charAt(0).toUpperCase() + text.slice(1));

/** The prompt: the chosen parts joined by commas, then what to avoid. Empty when nothing is chosen. */
export function buildImagePrompt(choices: ImageChoices, words: ImagePhrases): string {
  const joined = (items: readonly string[]) => items.join(` ${words.and} `);
  const parts = [
    choices.subject ? words.subject[choices.subject] : '',
    choices.styles.length > 0 ? joined(choices.styles.map((id) => words.style[id])) : '',
    choices.composition ? words.composition[choices.composition] : '',
    choices.lights.length > 0 ? joined(choices.lights.map((id) => words.light[id])) : '',
    choices.mood ? words.mood[choices.mood] : '',
  ].filter(Boolean);
  const main = parts.join(', ');
  const avoid = choices.avoid ? `${words.avoidLead} ${words.avoid[choices.avoid]}` : '';
  if (main && avoid) return `${sentence(main)}. ${avoid}.`;
  if (main) return `${sentence(main)}.`;
  return avoid ? `${avoid}.` : '';
}

export type Contradiction = { kind: 'style' | 'light' | 'avoid'; a: string; b: string };

/** Style pairs that cannot both describe one picture: a photograph is none of the drawn or modelled looks, and a painting is not a 3D model. */
const STYLE_CONFLICTS: readonly (readonly [StyleId, StyleId])[] = [
  ['photo', 'watercolor'],
  ['photo', 'flat'],
  ['photo', 'sketch'],
  ['photo', 'render'],
  ['watercolor', 'render'],
  ['flat', 'render'],
  ['sketch', 'render'],
];
/** Candlelight is dim and warm: it can't also be morning daylight or bright studio light. */
const LIGHT_CONFLICTS: readonly (readonly [LightId, LightId])[] = [
  ['candle', 'morning'],
  ['candle', 'studio'],
];

export function contradictionsOf(choices: ImageChoices): Contradiction[] {
  const found: Contradiction[] = [];
  for (const [a, b] of STYLE_CONFLICTS) if (choices.styles.includes(a) && choices.styles.includes(b)) found.push({ kind: 'style', a, b });
  for (const [a, b] of LIGHT_CONFLICTS) if (choices.lights.includes(a) && choices.lights.includes(b)) found.push({ kind: 'light', a, b });
  if (choices.avoid === 'people' && choices.subject && SUBJECT_HAS_PEOPLE[choices.subject]) found.push({ kind: 'avoid', a: choices.subject, b: 'people' });
  return found;
}

export const CHECK_IDS = ['subject', 'style', 'composition', 'light', 'avoid', 'consistent'] as const;
export type CheckId = (typeof CHECK_IDS)[number];
export type CheckItem = { id: CheckId; passed: boolean };

/** Is each thing said? "Consistent" passes when something is chosen and nothing contradicts. */
export function specificityChecklist(choices: ImageChoices): CheckItem[] {
  const clash = contradictionsOf(choices).length > 0;
  const passed: Record<CheckId, boolean> = {
    subject: choices.subject !== null,
    style: choices.styles.length > 0,
    composition: choices.composition !== null,
    light: choices.lights.length > 0,
    avoid: choices.avoid !== null,
    consistent: choiceCount(choices) > 0 && !clash,
  };
  return CHECK_IDS.map((id) => ({ id, passed: passed[id] }));
}

export type SpecificityLevel = 'empty' | 'vague' | 'fair' | 'specific';

export function specificityLevel(choices: ImageChoices): { passed: number; total: number; level: SpecificityLevel } {
  const items = specificityChecklist(choices);
  const passed = items.filter((item) => item.passed).length;
  const level: SpecificityLevel = choiceCount(choices) === 0 ? 'empty' : passed >= 5 ? 'specific' : passed >= 3 ? 'fair' : 'vague';
  return { passed, total: items.length, level };
}

/** The sketch is drawn in a unit square; `subject` is the box where the subject goes and `light` where the light comes from (null: not chosen). */
export type Sketch = {
  subject: { x: number; y: number; w: number; h: number } | null;
  /** A horizon line for a wide shot. */
  horizon: number | null;
  light: { x: number; y: number; r: number }[];
  /** Which tone paints it (the mood). */
  palette: 'violet' | 'amber' | 'indigo' | 'mint' | 'neutral';
};

const SUBJECT_BOX: Record<CompositionId, { x: number; y: number; w: number; h: number }> = {
  closeup: { x: 0.15, y: 0.15, w: 0.7, h: 0.7 },
  wide: { x: 0.38, y: 0.55, w: 0.24, h: 0.2 },
  topdown: { x: 0.25, y: 0.25, w: 0.5, h: 0.5 },
  centered: { x: 0.3, y: 0.3, w: 0.4, h: 0.4 },
};
const LIGHT_SPOT: Record<LightId, { x: number; y: number; r: number }> = {
  morning: { x: 0.14, y: 0.16, r: 0.1 },
  studio: { x: 0.5, y: 0.16, r: 0.14 },
  golden: { x: 0.86, y: 0.2, r: 0.12 },
  candle: { x: 0.5, y: 0.88, r: 0.05 },
};
const MOOD_PALETTE: Record<MoodId, Sketch['palette']> = { cozy: 'amber', energetic: 'mint', calm: 'indigo', mysterious: 'violet' };

/** A rough diagram of the idea from the choices. Never a rendering of the subject: a box where it goes, a spot where the light comes from, a mood colour. */
export function sketchOf(choices: ImageChoices): Sketch {
  return {
    subject: choices.composition ? SUBJECT_BOX[choices.composition] : null,
    horizon: choices.composition === 'wide' ? 0.65 : null,
    light: choices.lights.map((id) => LIGHT_SPOT[id]),
    palette: choices.mood ? MOOD_PALETTE[choices.mood] : 'neutral',
  };
}
