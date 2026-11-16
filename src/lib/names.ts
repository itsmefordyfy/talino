/**
 * A name a parent types for a thing they buy or use again (a milk brand, a diaper brand, a product
 * variant). One tidy form everywhere, so "similac  NeoSure" and "Similac Neosure" are one name.
 */

/** A name as one tidy line: control characters and extra spaces gone, `max` characters at most; undefined when empty. */
export function cleanName(value: unknown, max = 40): string | undefined {
  if (typeof value !== 'string') return undefined;
  const tidy = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max).trim();
  return tidy === '' ? undefined : tidy;
}

/** What names are compared by: tidy, lower case. */
export function nameKey(name: string): string {
  return name.replace(/\s+/g, ' ').trim().toLocaleLowerCase();
}

/**
 * The names in the order given (newest use first), each once whatever its capitalization or
 * spacing, in the spelling of its first (most recent) appearance. `pick` reads the name from a row.
 */
export function distinctNames<T>(rows: readonly T[], pick: (row: T) => string | null | undefined): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const row of rows) {
    const name = pick(row);
    if (!name) continue;
    const key = nameKey(name);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(row);
  }
  return result;
}

/** The saved spelling of a typed name when one matches (so a milk is never saved as two), else the typed name. */
export function canonicalName(typed: string, known: readonly string[]): string {
  const key = nameKey(typed);
  return key === '' ? typed : (known.find((name) => nameKey(name) === key) ?? typed);
}

/** How many names are offered with nothing typed: the latest ones, not the whole history. */
export const RECENT_NAMES = 3;
/** How many names are offered while typing. */
export const MATCHING_NAMES = 6;

/**
 * The names to offer for what is typed, from names already newest first and distinct. Nothing typed
 * (or only spaces): the `RECENT_NAMES` latest. Otherwise the names that contain the typed text, the
 * ones that start with it first, then those with a word that starts with it, then the rest; recency
 * keeps the order within each. Capitalization and surrounding spaces never matter.
 */
export function suggestNames<T extends { name: string; alsoKnownAs?: readonly string[] }>(names: readonly T[], typed: string, limits: { recent?: number; matching?: number } = {}): T[] {
  const key = nameKey(typed);
  if (key === '') return names.slice(0, limits.recent ?? RECENT_NAMES);
  const ranked: { item: T; rank: number; index: number }[] = [];
  names.forEach((item, index) => {
    // The shown name or any other name it is known by (never shown) can match; the best of them ranks it.
    const ranks = [item.name, ...(item.alsoKnownAs ?? [])].map(nameKey).filter((name) => name.includes(key)).map((name) => (name.startsWith(key) ? 0 : name.split(' ').some((word) => word.startsWith(key)) ? 1 : 2));
    if (ranks.length === 0) return;
    ranked.push({ item, rank: Math.min(...ranks), index });
  });
  return ranked
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limits.matching ?? MATCHING_NAMES)
    .map((entry) => entry.item);
}
