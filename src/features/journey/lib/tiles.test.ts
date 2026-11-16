import { describe, expect, jest, test } from '@jest/globals';

import { createTileWindow, spansTile, TILE_HEIGHT, tilesFor, visibleTiles } from './tiles';

describe('tiles', () => {
  test('cover the whole height with no gap, the last one cut to fit', () => {
    const tiles = tilesFor(TILE_HEIGHT * 2 + 100);
    expect(tiles.map((tile) => tile.top)).toEqual([0, TILE_HEIGHT, TILE_HEIGHT * 2]);
    expect(tiles[2]!.height).toBe(100);
    expect(tilesFor(0)).toEqual([]);
  });

  test('only the tiles around the screen are mounted', () => {
    // Scrolled 3000 pt into a 10-tile map on an 850 pt screen: one screen of overscan each way.
    const range = visibleTiles(3000, 850, 10);
    expect(range.first).toBe(Math.floor((3000 - 850) / TILE_HEIGHT));
    expect(range.last).toBe(Math.floor((3000 + 1700) / TILE_HEIGHT));
    expect(range.last - range.first + 1).toBeLessThanOrEqual(4);
  });

  test('at the top, and with the map still below the fold, the first tiles are mounted', () => {
    expect(visibleTiles(-400, 850, 10)).toEqual({ first: 0, last: 1 });
    expect(visibleTiles(0, 850, 10).first).toBe(0);
  });

  test('never past the last tile, even scrolled far down', () => {
    expect(visibleTiles(99999, 850, 5)).toEqual({ first: 4, last: 4 });
  });

  test('an element is drawn in every tile it reaches into', () => {
    const tile = { index: 1, top: TILE_HEIGHT, height: TILE_HEIGHT };
    expect(spansTile(TILE_HEIGHT - 50, TILE_HEIGHT + 10, tile)).toBe(true);
    expect(spansTile(0, 100, tile)).toBe(false);
  });

  test('the store tells its listener only when the range changes', () => {
    const store = createTileWindow({ first: 0, last: 2 });
    const listener = jest.fn();
    store.subscribe(listener);
    store.update({ first: 0, last: 2 });
    expect(listener).not.toHaveBeenCalled();
    store.update({ first: 1, last: 3 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.get()).toEqual({ first: 1, last: 3 });
  });

  test('scrolling only notifies when a tile boundary is crossed', () => {
    const store = createTileWindow();
    store.setCount(12);
    const listener = jest.fn();
    store.subscribe(listener);
    for (let y = 0; y < 300; y += 10) store.scroll(y, 850);
    expect(listener.mock.calls.length).toBeLessThanOrEqual(1);
    store.scroll(5000, 850);
    expect(store.get().first).toBeGreaterThan(0);
  });
});
