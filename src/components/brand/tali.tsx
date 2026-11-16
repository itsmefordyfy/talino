import { Image } from 'expo-image';

import { type CompanionId } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useAppSelector } from '@/store/hooks';

/**
 * Tali's poses, from the owner's official character sheet (2026-11-14, the third and current one): a young
 * developer with wavy purple hair and round glasses, in a violet hoodie with headphones, at a desk with a
 * laptop, a mug and a plant. Each file is cut from `docs/brand/tali-sheet.png` by `scripts/tali-poses.py`
 * (the edge given the art's own colour and a smooth, anti-aliased alpha so no pale fringe shows on dark
 * screens, then enlarged 3x so it stays crisp at hero sizes) and named after the label printed under it. All
 * twenty share one square (310 sheet px, saved at 930 px), centred on the body and standing on one baseline,
 * so changing the expression never makes Tali jump.
 *
 * - `happy`: an open hand and a smile; the default, welcomes.
 * - `excited`: fists up, laughing; a right answer, a good result.
 * - `curious`: a hand on the chin and a question mark; questions, empty screens.
 * - `thinking`: looking up, hand on the chin; Tali writing an answer, weighing something.
 * - `surprised`: an open mouth and exclamation marks.
 * - `confident`: a wink and a pointing hand; the store, tips.
 * - `focused`: a frown at the laptop; heads-down work.
 * - `coding`: typing, with a code bubble.
 * - `learning`: reading a book; nothing started yet.
 * - `explaining`: an open hand and a speech bubble; hints, suggestions, "ask Tali".
 * - `teaching`: pointing at a code board.
 * - `celebrating`: both fists in the air; a passed quiz, a new badge.
 * - `encouraging`: a thumbs up; try again, keep going.
 * - `supportive`: a heart made with both hands; invites, thanks.
 * - `determined`: a fist and a flame; work that needs another pass.
 * - `tired`: a yawn; a limit reached for today.
 * - `confused`: scratching the head; a wrong answer.
 * - `proud`: arms crossed, eyes closed; a passed review.
 * - `inspired`: a light bulb; ideas, interests.
 * - `accomplished`: holding a trophy; a finished course.
 */
const POSES = {
  happy: require('@/assets/images/tali/happy.webp'),
  excited: require('@/assets/images/tali/excited.webp'),
  curious: require('@/assets/images/tali/curious.webp'),
  thinking: require('@/assets/images/tali/thinking.webp'),
  surprised: require('@/assets/images/tali/surprised.webp'),
  confident: require('@/assets/images/tali/confident.webp'),
  focused: require('@/assets/images/tali/focused.webp'),
  coding: require('@/assets/images/tali/coding.webp'),
  learning: require('@/assets/images/tali/learning.webp'),
  explaining: require('@/assets/images/tali/explaining.webp'),
  teaching: require('@/assets/images/tali/teaching.webp'),
  celebrating: require('@/assets/images/tali/celebrating.webp'),
  encouraging: require('@/assets/images/tali/encouraging.webp'),
  supportive: require('@/assets/images/tali/supportive.webp'),
  determined: require('@/assets/images/tali/determined.webp'),
  tired: require('@/assets/images/tali/tired.webp'),
  confused: require('@/assets/images/tali/confused.webp'),
  proud: require('@/assets/images/tali/proud.webp'),
  inspired: require('@/assets/images/tali/inspired.webp'),
  accomplished: require('@/assets/images/tali/accomplished.webp'),
} as const;

/**
 * Tala, the female version of the coach (owner's second character sheet, 2026-11-14, `docs/brand/tala-sheet.png`): the same twenty poses
 * cut by the same script into `assets/images/tala`, on a 328 px canvas, saved at 984 px (her hair is taller and wider than Tali's). The learner picks
 * Tali or Tala in the welcome (`settings.companion`).
 */
const TALA_POSES: Record<TaliMood, number> = {
  happy: require('@/assets/images/tala/happy.webp'),
  excited: require('@/assets/images/tala/excited.webp'),
  curious: require('@/assets/images/tala/curious.webp'),
  thinking: require('@/assets/images/tala/thinking.webp'),
  surprised: require('@/assets/images/tala/surprised.webp'),
  confident: require('@/assets/images/tala/confident.webp'),
  focused: require('@/assets/images/tala/focused.webp'),
  coding: require('@/assets/images/tala/coding.webp'),
  learning: require('@/assets/images/tala/learning.webp'),
  explaining: require('@/assets/images/tala/explaining.webp'),
  teaching: require('@/assets/images/tala/teaching.webp'),
  celebrating: require('@/assets/images/tala/celebrating.webp'),
  encouraging: require('@/assets/images/tala/encouraging.webp'),
  supportive: require('@/assets/images/tala/supportive.webp'),
  determined: require('@/assets/images/tala/determined.webp'),
  tired: require('@/assets/images/tala/tired.webp'),
  confused: require('@/assets/images/tala/confused.webp'),
  proud: require('@/assets/images/tala/proud.webp'),
  inspired: require('@/assets/images/tala/inspired.webp'),
  accomplished: require('@/assets/images/tala/accomplished.webp'),
};

export type TaliMood = keyof typeof POSES;

/** Every pose Tali has, in the order the tests list them. */
export const TALI_MOODS = Object.keys(POSES) as TaliMood[];

/**
 * Rows of empty canvas above the tallest pose (of 310): `tight` crops them away. `scripts/tali-poses.py` checks that no pose
 * reaches above this line, so a taller new pose fails the script instead of being clipped.
 */
export const TIGHT_CROP_TOP = 80;
/** Each coach's square canvas and the rows of empty canvas above her or his tallest pose (what `tight` crops away). */
const CANVAS: Record<CompanionId, { side: number; cropTop: number }> = {
  tali: { side: 310, cropTop: TIGHT_CROP_TOP },
  tala: { side: 328, cropTop: 104 },
};

export type TaliProps = {
  size?: number;
  /** Drops the empty space above the figure (the picture is `size` wide and about three-quarters as tall), for heroes and empty states where the gap looks like dead space. */
  tight?: boolean;
  mood?: TaliMood;
  /** Which coach to draw; by default the one the learner chose (`settings.companion`). The welcome passes one to show both. */
  companion?: CompanionId;
  /** Read by screen readers when the picture carries meaning; decorative by default. */
  accessibilityLabel?: string;
};

/**
 * Tali, Talino's coach (the business plan's mascot). Pick the pose that matches the moment (see `POSES`). Never animated: the owner asked for a still mascot (2026-11-13).
 * The picture is always fitted whole inside a `size` square (`contain`), whatever its shape, so no ear or chin is ever cropped.
 */
export function Tali({ size = 64, mood = 'happy', tight = false, companion, accessibilityLabel }: TaliProps) {
  const chosen = useAppSelector(selectCompanion);
  const who = companion ?? chosen;
  const source = who === 'tala' ? TALA_POSES[mood] : POSES[mood];
  if (tight) {
    // The cropped rows are transparent, so `cover` aligned to the bottom only removes air; nothing of the figure is cut.
    const { side, cropTop } = CANVAS[who];
    const height = Math.round((size * (side - cropTop)) / side);
    return <Image source={source} style={{ width: size, height }} contentFit="cover" contentPosition="bottom" accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} />;
  }
  return <Image source={source} style={{ width: size, height: size }} contentFit="contain" accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} />;
}
