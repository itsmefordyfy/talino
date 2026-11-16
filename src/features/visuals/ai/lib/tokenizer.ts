/**
 * A toy tokenizer for teaching: a tiny, made-up list of word pieces and a greedy "longest piece that
 * fits" rule. Real tokenizers (byte-pair encoding and others) learn tens of thousands of pieces from
 * data, differ from model to model, and give different splits, so the numbers here mean nothing outside
 * this illustration. Deterministic and reversible: joining the pieces gives back the text.
 */

/** The made-up vocabulary. Order gives the (made-up) id. Pieces with a leading space stand for "a space then a word", as in real tokenizers. */
export const VOCAB: readonly string[] = [
  ' the', ' a', ' to', ' and', ' of', ' is', ' in', ' it', ' I', ' you', ' like', ' my',
  ' cat', ' dog', ' code', ' learn', ' token', ' model', ' data', ' AI', ' happy', ' big',
  ' blue', ' clear', ' dark', ' grey', ' falling', ' read', ' play', ' cook', ' sleep', ' fun', ' hard', ' useful', ' slow',
  ' books', ' comics', ' games', ' guitar', ' dinner', ' rice', ' things', ' new', ' late', ' bright', ' calm', ' cold', ' great', ' rewarding',
  'The', 'I', 'Learning', 'token', 'ization', 'un', 'believ', 'able', 'ing', 'ed', 'er', 'ly', 'tion', 'pre', 'dict', 'ize', 'code', 'learn', 'cat', 'dog',
  's', 'a', 'e', 'i', 'o', 'u', 't', 'n',
  '.', ',', '!', '?', ' ',
];

const IDS = new Map(VOCAB.map((piece, i) => [piece, i + 1] as const));
const LONGEST = VOCAB.reduce((max, piece) => Math.max(max, piece.length), 1);

export type Token = {
  text: string;
  /** Made-up id for a piece in the vocabulary; for a single character that is not in it, 10000 plus its code point. */
  id: number;
  /** True when no vocabulary piece fitted and the single character was used. */
  fallback: boolean;
};

export const MAX_INPUT_CHARS = 80;

/** Splits text into tokens: at each place take the longest vocabulary piece that matches, else one character. */
export function tokenize(text: string): Token[] {
  const chars = Array.from(text.slice(0, MAX_INPUT_CHARS * 2));
  const tokens: Token[] = [];
  let i = 0;
  while (i < chars.length) {
    let taken: string | null = null;
    for (let length = Math.min(LONGEST, chars.length - i); length >= 1; length -= 1) {
      const candidate = chars.slice(i, i + length).join('');
      if (IDS.has(candidate)) {
        taken = candidate;
        break;
      }
    }
    if (taken === null) {
      const single = chars[i];
      tokens.push({ text: single, id: 10000 + (single.codePointAt(0) ?? 0), fallback: true });
      i += 1;
    } else {
      tokens.push({ text: taken, id: IDS.get(taken) as number, fallback: false });
      i += Array.from(taken).length;
    }
  }
  return tokens;
}

/** A piece with its spaces made visible, for drawing: a leading or lone space shows as a middle dot. */
export function visibleToken(text: string): string {
  return text.replace(/ /g, '·');
}

export function detokenize(tokens: readonly Token[]): string {
  return tokens.map((token) => token.text).join('');
}
