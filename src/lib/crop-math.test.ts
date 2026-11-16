import { describe, expect, test } from '@jest/globals';

import { clampOffset, clampZoom, coverScale, cropRect, frameSize, holePath, MAX_CROP_ZOOM } from './crop-math';

describe('frameSize', () => {
  test('is as wide as the area allows, leaving the margin on every side', () => {
    expect(frameSize({ width: 400, height: 900 }, 1, 20)).toEqual({ width: 360, height: 360 });
  });

  test('is limited by the height when the area is short', () => {
    expect(frameSize({ width: 900, height: 400 }, 1, 20)).toEqual({ width: 360, height: 360 });
  });

  test('follows the aspect ratio', () => {
    expect(frameSize({ width: 400, height: 900 }, 2, 20)).toEqual({ width: 360, height: 180 });
  });

  test('is empty before the area is measured or when there is no room', () => {
    expect(frameSize(null, 1, 20)).toEqual({ width: 0, height: 0 });
    expect(frameSize({ width: 30, height: 30 }, 1, 20)).toEqual({ width: 0, height: 0 });
  });
});

describe('coverScale', () => {
  const frame = { width: 300, height: 300 };

  test('scales a landscape photo until its short side fills the frame', () => {
    expect(coverScale({ width: 3000, height: 1500 }, frame)).toBeCloseTo(0.2);
  });

  test('scales a portrait photo until its short side fills the frame', () => {
    expect(coverScale({ width: 1500, height: 3000 }, frame)).toBeCloseTo(0.2);
  });

  test('enlarges a photo smaller than the frame', () => {
    expect(coverScale({ width: 150, height: 150 }, frame)).toBeCloseTo(2);
  });

  test('is 1 when there is nothing to measure yet', () => {
    expect(coverScale({ width: 0, height: 0 }, frame)).toBe(1);
    expect(coverScale({ width: 100, height: 100 }, { width: 0, height: 0 })).toBe(1);
  });
});

describe('clampOffset', () => {
  test('keeps the photo covering the frame: at most half the overhang either way', () => {
    // 600 wide at zoom 1 in a 300 frame: 150 of room each side.
    expect(clampOffset(500, 1, 600, 300)).toBe(150);
    expect(clampOffset(-500, 1, 600, 300)).toBe(-150);
    expect(clampOffset(40, 1, 600, 300)).toBe(40);
  });

  test('grows the room with the zoom', () => {
    expect(clampOffset(500, 2, 600, 300)).toBe(450);
  });

  test('allows no movement along a side that already fits exactly', () => {
    expect(clampOffset(80, 1, 300, 300)).toBe(0);
    expect(clampOffset(-80, 1, 300, 300)).toBe(0);
  });
});

describe('clampZoom', () => {
  test('never goes below the photo just covering the frame, or above the maximum', () => {
    expect(clampZoom(0.4)).toBe(1);
    expect(clampZoom(2.5)).toBe(2.5);
    expect(clampZoom(50)).toBe(MAX_CROP_ZOOM);
  });
});

describe('cropRect', () => {
  const frame = { width: 300, height: 300 };

  test('a centred, unzoomed landscape photo crops the middle square', () => {
    // 3000 x 1500 at 0.2 fills the frame's height: the frame shows 1500 x 1500 of the photo.
    expect(cropRect({ image: { width: 3000, height: 1500 }, frame, zoom: 1, x: 0, y: 0 })).toEqual({ originX: 750, originY: 0, width: 1500, height: 1500 });
  });

  test('zooming in shows a smaller part around the centre', () => {
    expect(cropRect({ image: { width: 3000, height: 1500 }, frame, zoom: 2, x: 0, y: 0 })).toEqual({ originX: 1125, originY: 375, width: 750, height: 750 });
  });

  test('dragging the photo right moves the crop left', () => {
    // 150 pt right at 0.2 scale is 750 px: the crop reaches the photo's left edge.
    expect(cropRect({ image: { width: 3000, height: 1500 }, frame, zoom: 1, x: 150, y: 0 })).toEqual({ originX: 0, originY: 0, width: 1500, height: 1500 });
    // A smaller drag moves it part of the way.
    expect(cropRect({ image: { width: 3000, height: 1500 }, frame, zoom: 1, x: 50, y: 0 }).originX).toBe(500);
  });

  test('dragging the photo up moves the crop down', () => {
    expect(cropRect({ image: { width: 1500, height: 3000 }, frame, zoom: 1, x: 0, y: -150 })).toEqual({ originX: 0, originY: 1500, width: 1500, height: 1500 });
  });

  test('stays inside the photo even when asked for an offset past the edge', () => {
    const wild = cropRect({ image: { width: 3000, height: 1500 }, frame, zoom: 1, x: 9999, y: -9999 });
    expect(wild).toEqual({ originX: 0, originY: 0, width: 1500, height: 1500 });
  });

  test('rounds to whole pixels that never leave the photo', () => {
    const rect = cropRect({ image: { width: 1001, height: 777 }, frame: { width: 280, height: 280 }, zoom: 1.37, x: 13.3, y: -7.7 });
    for (const value of Object.values(rect)) expect(Number.isInteger(value)).toBe(true);
    expect(rect.originX).toBeGreaterThanOrEqual(0);
    expect(rect.originY).toBeGreaterThanOrEqual(0);
    expect(rect.originX + rect.width).toBeLessThanOrEqual(1001);
    expect(rect.originY + rect.height).toBeLessThanOrEqual(777);
    expect(rect.width).toBeGreaterThan(0);
  });

  test('a photo smaller than the frame is cropped whole', () => {
    expect(cropRect({ image: { width: 100, height: 100 }, frame, zoom: 1, x: 0, y: 0 })).toEqual({ originX: 0, originY: 0, width: 100, height: 100 });
  });

  test('keeps a rectangular frame\'s shape', () => {
    const rect = cropRect({ image: { width: 2000, height: 2000 }, frame: { width: 400, height: 200 }, zoom: 1, x: 0, y: 0 });
    expect(rect.width / rect.height).toBeCloseTo(2);
  });
});

describe('holePath', () => {
  test('cuts a centred hole out of the area', () => {
    expect(holePath({ width: 400, height: 800 }, { width: 200, height: 200 }, 0)).toBe(
      'M0 0H400V800H0Z' + 'M100 300H300A0 0 0 0 1 300 300V500A0 0 0 0 1 300 500H100A0 0 0 0 1 100 500V300A0 0 0 0 1 100 300Z',
    );
  });

  test('a radius of half the width makes the hole a circle', () => {
    expect(holePath({ width: 400, height: 800 }, { width: 200, height: 200 }, 100)).toContain('A100 100 0 0 1 300 400');
  });

  test('never rounds more than a circle', () => {
    expect(holePath({ width: 400, height: 800 }, { width: 200, height: 200 }, 500)).toContain('A100 100 0 0 1');
  });
});
