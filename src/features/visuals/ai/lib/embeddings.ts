/**
 * Embeddings, illustrated: each item has a hand-placed 2-D point (a direction and a length). Real
 * embeddings have hundreds or thousands of numbers made by a trained model; these two are placed by
 * hand to show the idea. The cosine similarity between points is computed for real.
 */

export type EmbItem = { id: string; label: string; group: 'animals' | 'fruit' | 'vehicles' | 'tech'; x: number; y: number };

function polar(id: string, label: string, group: EmbItem['group'], degrees: number, radius: number): EmbItem {
  const radians = (degrees * Math.PI) / 180;
  return { id, label, group, x: Math.round(radius * Math.cos(radians) * 100) / 100, y: Math.round(radius * Math.sin(radians) * 100) / 100 };
}

export const ITEMS: readonly EmbItem[] = [
  polar('cat', 'cat', 'animals', 14, 0.9),
  polar('dog', 'dog', 'animals', 27, 0.55),
  polar('puppy', 'puppy', 'animals', 41, 0.85),
  polar('walk-dog', 'Walk my dog', 'animals', 16, 0.26),
  polar('apple', 'apple', 'fruit', 92, 0.9),
  polar('banana', 'banana', 'fruit', 106, 0.55),
  polar('mango', 'mango', 'fruit', 120, 0.85),
  polar('grape', 'grape', 'fruit', 134, 0.35),
  polar('car', 'car', 'vehicles', 182, 0.9),
  polar('truck', 'truck', 'vehicles', 196, 0.55),
  polar('bus', 'bus', 'vehicles', 210, 0.85),
  polar('bicycle', 'bicycle', 'vehicles', 224, 0.55),
  polar('laptop', 'laptop', 'tech', 278, 0.9),
  polar('code', 'code', 'tech', 292, 0.55),
  polar('bug', 'bug', 'tech', 306, 0.85),
  polar('fix-bug', 'Fix the bug', 'tech', 299, 0.3),
];

export function cosine(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dot = a.x * b.x + a.y * b.y;
  const lengths = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y);
  return lengths === 0 ? 0 : dot / lengths;
}

export type Neighbor = { item: EmbItem; similarity: number };

/** The `k` items most similar to the query by cosine similarity (the query itself left out), best first. */
export function nearest(query: EmbItem, items: readonly EmbItem[] = ITEMS, k = 3): Neighbor[] {
  return items
    .filter((item) => item.id !== query.id)
    .map((item) => ({ item, similarity: cosine(query, item) }))
    .sort((a, b) => b.similarity - a.similarity || a.item.id.localeCompare(b.item.id))
    .slice(0, k);
}

export function findItem(id: string): EmbItem {
  return ITEMS.find((item) => item.id === id) ?? ITEMS[0];
}
