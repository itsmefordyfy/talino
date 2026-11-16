/**
 * Following along with the audio: where a part of the lesson sits in the reading area decides whether to scroll. A part that is
 * comfortably in view is left alone (a scroll after every sentence is tiring), and one that drifts toward the bottom or off the
 * screen is brought to a little above the middle. All measurements are in px from the top of the reading area.
 */
export type FollowPlace = 'comfortable' | 'visible' | 'hidden';

/** The reading position: clear of a header drawn over the content at the top, and well above the bottom edge. */
const COMFORT_TOP = 0.16;
const COMFORT_BOTTOM = 0.7;
/** Where a part is brought to, and, for a tall one, where its start is. */
const TARGET = 0.36;
const TARGET_TALL = 0.2;
/** A part taller than this share of the screen can't sit wholly in the comfortable zone: only its start is judged. */
const TALL = 0.5;

export type FollowBox = { top: number; bottom: number; height: number };

const isTall = ({ top, bottom, height }: FollowBox) => bottom - top > height * TALL;

export function followPlace(box: FollowBox): FollowPlace {
  const { top, bottom, height } = box;
  if (isTall(box)) {
    if (top >= height * 0.08 && top <= height * 0.4) return 'comfortable';
  } else if (top >= height * COMFORT_TOP && bottom <= height * COMFORT_BOTTOM) return 'comfortable';
  return bottom > 0 && top < height ? 'visible' : 'hidden';
}

/** The scroll offset that brings the part to the reading position (never above the start of the content). */
export function followTarget(box: FollowBox & { offset: number }): number {
  const { offset, top, height } = box;
  return Math.max(0, offset + top - height * (isTall(box) ? TARGET_TALL : TARGET));
}
