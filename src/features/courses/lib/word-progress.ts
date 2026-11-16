/**
 * How many of a sentence's words have been said, so the words already spoken can be lit up as the voice goes (follow-along reading,
 * word by word). Pure.
 *
 * A recording has the exact start and end of each SENTENCE (the timing file), not of each word (the speech engine used to make it
 * gives no word times), so the position inside a sentence is estimated: every word takes time in proportion to its length, and a
 * comma, colon or full stop adds a pause. That is accurate to a word or so inside one sentence, which is all the eye needs, and it
 * can never drift across a lesson because every sentence starts again from its real start time. The phone's own voice reports the
 * real position of each word (iOS), and that is used instead where it exists. A recording made with word times (`saidOffsetAtTime`,
 * from Kokoro's own phoneme durations) needs no estimate at all. A live Gemini sentence is its own audio clip, so its
 * playback time is the real position in the sentence (the words inside it are still weighed by length: Gemini gives no word times).
 */
const PAUSE_AFTER: Record<string, number> = { ',': 3, ';': 4, ':': 4, '—': 3, '.': 6, '!': 6, '?': 6, ')': 1 };

type Word = { start: number; end: number; weight: number };

function wordsOf(text: string): Word[] {
  const words: Word[] = [];
  for (const match of text.matchAll(/\S+/g)) {
    const word = match[0];
    const last = word[word.length - 1];
    words.push({ start: match.index, end: match.index + word.length, weight: word.length + (PAUSE_AFTER[last] ?? 0) });
  }
  return words;
}

/**
 * The offset in `text` up to which words count as said, when `fraction` (0 to 1) of the sentence has been spoken. A word counts the
 * moment the voice reaches it, so the word being spoken is already lit. 0 for nothing yet (only possible before the first word), the
 * whole text length once the sentence is done.
 */
export function saidOffset(text: string, fraction: number): number {
  if (!Number.isFinite(fraction)) return 0;
  if (fraction >= 1) return text.length;
  const words = wordsOf(text);
  if (words.length === 0) return 0;
  const total = words.reduce((sum, word) => sum + word.weight, 0);
  const reached = Math.max(0, fraction) * total;
  let before = 0;
  let offset = 0;
  for (const word of words) {
    if (before <= reached) offset = word.end;
    else break;
    before += word.weight;
  }
  return offset;
}

/**
 * The offset in `text` up to which words count as said when the recording says exactly when each word starts (`starts`, seconds, one per
 * whitespace-separated word, as the timing file's `words`): the word being spoken is already lit. Null when the recording gives no word
 * times for this text (or they are not one per word: the text on screen changed), so the caller falls back to the estimate above.
 */
export function saidOffsetAtTime(text: string, starts: readonly number[] | undefined, seconds: number): number | null {
  if (!starts || !Number.isFinite(seconds)) return null;
  const words = wordsOf(text);
  if (words.length === 0 || words.length !== starts.length) return null;
  let lit = 0;
  for (let index = 1; index < words.length; index += 1) {
    if (starts[index] <= seconds) lit = index;
    else break;
  }
  return words[lit].end;
}

/** Where the voice is inside the sentence being spoken as a fraction 0 to 1, or null when it can't say (then the whole sentence is lit, as before). */
export function activeFraction(input: {
  mode: 'recording' | 'sentences' | 'phone' | null;
  position: number;
  activeSegment: number | null;
  timing: { segments: readonly (readonly [number, number])[] } | null;
  /** The voices that speak a sentence at a time: how far through the sentence the voice is (the phone's own word markers, or a live clip's playback time). */
  spokenFraction: number | null;
}): number | null {
  if (input.mode === 'phone' || input.mode === 'sentences') return input.spokenFraction;
  if (input.mode !== 'recording' || input.timing === null || input.activeSegment === null) return null;
  const pair = input.timing.segments[input.activeSegment];
  if (!pair) return null;
  const [start, end] = pair;
  if (!(end > start)) return 1;
  return Math.min(1, Math.max(0, (input.position - start) / (end - start)));
}
