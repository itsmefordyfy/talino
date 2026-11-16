/** Average glyph width as a share of the font size (Plus Jakarta Sans measures about 0.52 to 0.55 on mixed text). Deliberately a little wide, so text never overflows its box. */
export const CHAR_WIDTH = 0.56;

export function textWidth(text: string, fontSize: number): number {
  return Math.ceil(text.length * fontSize * CHAR_WIDTH);
}

/** Breaks text into lines of at most `maxChars` characters, at spaces where possible and inside a word only when it is longer than a line. */
export function wrapText(text: string, maxChars: number): string[] {
  const limit = Math.max(4, Math.floor(maxChars));
  const lines: string[] = [];
  let current = '';
  const push = () => {
    if (current.length > 0) lines.push(current);
    current = '';
  };
  for (const word of text.split(/\s+/).filter(Boolean)) {
    let rest = word;
    while (rest.length > limit) {
      if (current.length > 0) push();
      lines.push(rest.slice(0, limit - 1) + '-');
      rest = rest.slice(limit - 1);
    }
    if (current.length === 0) current = rest;
    else if (current.length + 1 + rest.length <= limit) current += ` ${rest}`;
    else {
      push();
      current = rest;
    }
  }
  push();
  return lines.length > 0 ? lines : [''];
}

export function maxLineLength(lines: readonly string[]): number {
  return lines.reduce((max, line) => Math.max(max, line.length), 0);
}
