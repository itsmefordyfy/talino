import { defineStrings } from '@/lib/i18n';

import type { AvoidId, CheckId, CompositionId, LightId, MoodId, SpecificityLevel, StyleId, SubjectId } from './lib/image-prompt';

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  title: 'Image prompt builder: describe a picture in words',
  summary: 'Choose a subject, style, composition, light, mood and one thing to avoid, and see how specific your image prompt is.',
  description:
    'An illustration of how to write a clear prompt for an image tool. Choose options for the subject, style, composition, lighting, mood and one thing to avoid. The screen builds the prompt text and checks how specific it is, including contradictions such as a photo that is also a watercolor. No image is generated here: the small drawing is a rough sketch of the idea, not a result.',
  topics: ['image generation', 'image prompt', 'text to image', 'style', 'composition', 'lighting', 'negative prompt', 'midjourney', 'diffusion', 'prompt for images', 'ai art'],
  noImage: 'No image is generated here. This builds the words you would give to an image tool.',
  illustration: 'Illustration: a real image tool may read these words differently, and two runs of the same prompt usually give different pictures.',
  groups: {
    subject: 'Subject (what is in the picture)',
    style: 'Style (pick up to 3)',
    composition: 'Composition (how it is framed)',
    light: 'Lighting (pick up to 2)',
    mood: 'Mood',
    avoid: 'One thing to avoid',
  },
  options: {
    subject: { bread: 'Sourdough loaf', baker: 'Baker at the counter', storefront: 'Bakery storefront' } satisfies Record<SubjectId, string>,
    style: { photo: 'Photograph', watercolor: 'Watercolor', flat: 'Flat illustration', sketch: 'Pencil sketch', render: '3D render' } satisfies Record<StyleId, string>,
    composition: { closeup: 'Close-up', wide: 'Wide shot', topdown: 'Top-down', centered: 'Centered' } satisfies Record<CompositionId, string>,
    light: { morning: 'Soft morning light', studio: 'Bright studio light', golden: 'Golden hour', candle: 'Candlelight' } satisfies Record<LightId, string>,
    mood: { cozy: 'Cozy', energetic: 'Energetic', calm: 'Calm', mysterious: 'Mysterious' } satisfies Record<MoodId, string>,
    avoid: { text: 'Text and logos', blur: 'Blur', crowd: 'Crowded background', people: 'People' } satisfies Record<AvoidId, string>,
  },
  // The words each option adds to the prompt.
  phrases: {
    subject: { bread: 'a golden sourdough loaf on a wooden table', baker: 'a baker smiling behind a bakery counter', storefront: 'a small neighborhood bakery storefront' } satisfies Record<SubjectId, string>,
    style: { photo: 'photograph', watercolor: 'watercolor painting', flat: 'flat illustration', sketch: 'pencil sketch', render: '3D render' } satisfies Record<StyleId, string>,
    composition: { closeup: 'close-up shot', wide: 'wide shot', topdown: 'top-down view', centered: 'centered composition' } satisfies Record<CompositionId, string>,
    light: { morning: 'soft morning light', studio: 'bright studio lighting', golden: 'golden hour light', candle: 'warm candlelight' } satisfies Record<LightId, string>,
    mood: { cozy: 'cozy mood', energetic: 'energetic mood', calm: 'calm mood', mysterious: 'mysterious mood' } satisfies Record<MoodId, string>,
    avoid: { text: 'text and logos', blur: 'blur', crowd: 'a crowded background', people: 'people' } satisfies Record<AvoidId, string>,
    avoidLead: 'Avoid',
    and: 'and',
  },
  promptTitle: 'The prompt you built',
  promptEmpty: 'Nothing chosen yet. Pick a subject and a style to start.',
  promptLabel: (text: string) => `Your image prompt: ${text}`,
  checklistTitle: 'Specificity checklist',
  checks: {
    subject: { label: 'A subject is named', missing: 'Without a subject, the tool decides what the picture is about.' },
    style: { label: 'A style is named', missing: 'Without a style, you get the tool\'s default look: photo, painting or 3D, it is a guess.' },
    composition: { label: 'The composition is stated', missing: 'Without a composition, the tool chooses the framing: close or far, from the side or above.' },
    light: { label: 'The light is described', missing: 'Without light, the mood of the picture is left to chance.' },
    avoid: { label: 'One thing to avoid is stated', missing: 'Naming one thing you do not want (like text or blur) keeps it out of the picture more often.' },
    consistent: { label: 'No contradictions', missing: 'Choose something first, then check that the choices do not fight each other.' },
  } satisfies Record<CheckId, { label: string; missing: string }>,
  yes: 'Yes',
  missing: 'Missing',
  checkRow: (label: string, passed: boolean, why: string) => (passed ? `${label}: yes` : `${label}: missing. ${why}`),
  scoreLabel: (passed: number, total: number) => `${passed} of ${total} checks`,
  levels: { empty: 'Nothing chosen', vague: 'Vague', fair: 'Getting specific', specific: 'Specific' } satisfies Record<SpecificityLevel, string>,
  levelCaption: (level: string, passed: number, total: number) => `${level}: ${passed} of ${total} checks pass.`,
  contradictionTitle: 'These choices fight each other',
  contradiction: {
    style: (a: string, b: string) => `${a} and ${b} describe two different kinds of picture. Keep one, or the tool has to pick for you.`,
    light: (a: string, b: string) => `${a} and ${b} are very different kinds of light. Keep the one you want.`,
    avoid: (subject: string) => `The subject (${subject}) has a person in it, but you also ask to avoid people. Change one of them.`,
  },
  sketchTitle: 'Rough sketch of the idea',
  sketchNote: 'A diagram of your choices, not an image: a box where the subject goes, a spot where the light comes from, and a color for the mood. No picture is generated.',
  sketchLabel: (composition: string, lights: string, mood: string) => `Rough sketch of the idea, not an image. Composition: ${composition}. Light: ${lights}. Mood: ${mood}.`,
  notChosen: 'not chosen',
  clear: 'Clear all',
  start: 'Start again',
};

export const imagePromptStrings = defineStrings({ en, fil: en });
export type ImagePromptText = typeof en;
