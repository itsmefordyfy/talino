/**
 * Splits text into pieces the phone's voice accepts (iOS refuses an utterance longer than `Speech.maxSpeechInputLength`, about 4000
 * characters). Cuts at line breaks first, then sentence ends, then, only for a single endless run, at a space or hard, so words and
 * sentences are never cut in the middle when they don't have to be. Pure.
 */
export function chunkForSpeech(text: string, max = 3500): string[] {
  const limit = Math.max(50, Math.floor(max));
  const pieces: string[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    if (trimmed.length <= limit) {
      pieces.push(trimmed);
      continue;
    }
    // A very long line: by sentence, and a sentence longer than the limit by space.
    let rest = trimmed;
    while (rest.length > limit) {
      const window = rest.slice(0, limit);
      const sentence = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
      const space = window.lastIndexOf(' ');
      const cut = sentence > limit * 0.3 ? sentence + 1 : space > limit * 0.3 ? space : limit;
      pieces.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) pieces.push(rest);
  }
  const chunks: string[] = [];
  for (const piece of pieces) {
    const last = chunks[chunks.length - 1];
    if (last !== undefined && last.length + 1 + piece.length <= limit) chunks[chunks.length - 1] = `${last}\n${piece}`;
    else chunks.push(piece);
  }
  return chunks;
}
