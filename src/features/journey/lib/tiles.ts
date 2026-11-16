/**
 * The neural layer is drawn in horizontal tiles, and only the tiles near the screen are mounted. One canvas as tall as the whole
 * journey (about 9,000 pt) cost a full-height bitmap and was redrawn whole on every animation frame (measured 2026-11-16: 79% CPU and
 * 1.3 GB idle on Home). Pure, so the windowing is tested.
 */

export const TILE_HEIGHT = 800;
/** Screens of map kept mounted above and below what is visible, so a quick fling never shows an empty band. */
export const OVERSCAN = 1;

export type Tile = { index: number; top: number; height: number };
export type TileRange = { first: number; last: number };

export function tilesFor(height: number): Tile[] {
  const count = Math.max(0, Math.ceil(height / TILE_HEIGHT));
  return Array.from({ length: count }, (_, index) => ({ index, top: index * TILE_HEIGHT, height: Math.min(TILE_HEIGHT, height - index * TILE_HEIGHT) }));
}

/**
 * The tiles to mount for a scroll position. `offset` is how far the map's top is above the screen's top (negative while the map is still
 * below the fold); `viewport` is the screen's height.
 */
export function visibleTiles(offset: number, viewport: number, count: number): TileRange {
  if (count <= 0) return { first: 0, last: -1 };
  const top = offset - viewport * OVERSCAN;
  const bottom = offset + viewport * (1 + OVERSCAN);
  const first = Math.max(0, Math.floor(top / TILE_HEIGHT));
  const last = Math.min(count - 1, Math.floor(bottom / TILE_HEIGHT));
  return first > last ? { first: Math.min(first, count - 1), last: Math.min(first, count - 1) } : { first, last };
}

/** Whether a vertical span (an element's top and bottom) reaches into a tile, with a margin for stroke widths and glows. */
export function spansTile(top: number, bottom: number, tile: Tile, margin = 120): boolean {
  return bottom >= tile.top - margin && top <= tile.top + tile.height + margin;
}

/**
 * A tiny store for the mounted range: the screen tells it the scroll position on every scroll event, and it tells its one listener
 * only when the range really changes (once per tile crossed), so scrolling doesn't re-render the map.
 */
export function createTileWindow(initial: TileRange = { first: 0, last: 2 }) {
  let range = initial;
  let count = initial.last + 1;
  let place = { offset: 0, viewport: 900 };
  const listeners = new Set<() => void>();
  const update = (next: TileRange) => {
    if (next.first === range.first && next.last === range.last) return;
    range = next;
    for (const listener of listeners) listener();
  };
  return {
    get: () => range,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update,
    /** The screen scrolled: `offset` is how far the map's top is above the screen's top. */
    scroll: (offset: number, viewport: number) => {
      place = { offset, viewport };
      update(visibleTiles(offset, viewport, count));
    },
    /** The map's height changed (a level folded or opened). */
    setCount: (next: number) => {
      count = next;
      update(visibleTiles(place.offset, place.viewport, count));
    },
  };
}
export type TileWindow = ReturnType<typeof createTileWindow>;
