/**
 * The maths of the crop screen (components/photo-cropper): where the frame sits, how far the photo may be moved and
 * zoomed, and which pixels of the photo end up inside the frame. Pure, so it is tested without a screen. The
 * functions the gestures call are worklets (they run on the UI thread, per frame).
 */
export type Size = { width: number; height: number };

/** The most the photo can be zoomed in, as a multiple of "just covers the frame". */
export const MAX_CROP_ZOOM = 5;

/** The frame: as large as the area allows with `margin` kept free on every side, in the given width ÷ height. */
export function frameSize(area: Size | null, aspect: number, margin: number): Size {
  if (!area) return { width: 0, height: 0 };
  const width = Math.max(0, Math.min(area.width - margin * 2, (area.height - margin * 2) * aspect));
  return { width, height: width / aspect };
}

/** The scale at which the photo just covers the frame (zoom 1): its short side fills the frame, so no edge is ever empty. */
export function coverScale(image: Size, frame: Size): number {
  if (image.width <= 0 || image.height <= 0 || frame.width <= 0 || frame.height <= 0) return 1;
  return Math.max(frame.width / image.width, frame.height / image.height);
}

/** Keeps the photo covering the frame on one axis: it can move by half of what overhangs, either way. `base` is the photo's size at zoom 1. */
export function clampOffset(offset: number, zoom: number, base: number, frame: number): number {
  'worklet';
  const room = Math.max(0, (base * zoom - frame) / 2);
  // `+ 0` turns a negative zero into zero.
  return Math.min(room, Math.max(-room, offset)) + 0;
}

export function clampZoom(zoom: number): number {
  'worklet';
  return Math.min(MAX_CROP_ZOOM, Math.max(1, zoom));
}

export type CropRect = { originX: number; originY: number; width: number; height: number };

/**
 * The part of the photo (in its own pixels) that sits inside the frame, in whole pixels that never leave the photo.
 * `x` / `y` are how far the photo was moved from the centre of the frame, in points; `zoom` is the multiple of the
 * cover scale.
 */
export function cropRect({ image, frame, zoom, x, y }: { image: Size; frame: Size; zoom: number; x: number; y: number }): CropRect {
  const scale = coverScale(image, frame) * zoom;
  const width = Math.min(image.width, frame.width / scale);
  const height = Math.min(image.height, frame.height / scale);
  // The frame's centre is the photo's centre, moved the opposite way to the pan.
  const originX = image.width / 2 - x / scale - width / 2;
  const originY = image.height / 2 - y / scale - height / 2;
  const w = Math.min(image.width, Math.max(1, Math.round(width)));
  const h = Math.min(image.height, Math.max(1, Math.round(height)));
  return {
    originX: Math.min(image.width - w, Math.max(0, Math.round(originX))),
    originY: Math.min(image.height - h, Math.max(0, Math.round(originY))),
    width: w,
    height: h,
  };
}

/**
 * An SVG path that fills `area` except a rounded rectangle (the frame) cut out of its middle, for the dimmed part outside
 * the frame (`fillRule="evenodd"`). `radius` of half the frame's width makes the hole a circle.
 */
export function holePath(area: Size, frame: Size, radius: number): string {
  const left = (area.width - frame.width) / 2;
  const top = (area.height - frame.height) / 2;
  const right = left + frame.width;
  const bottom = top + frame.height;
  const r = Math.max(0, Math.min(radius, frame.width / 2, frame.height / 2));
  return [
    `M0 0H${area.width}V${area.height}H0Z`,
    `M${left + r} ${top}H${right - r}A${r} ${r} 0 0 1 ${right} ${top + r}V${bottom - r}A${r} ${r} 0 0 1 ${right - r} ${bottom}H${left + r}A${r} ${r} 0 0 1 ${left} ${bottom - r}V${top + r}A${r} ${r} 0 0 1 ${left + r} ${top}Z`,
  ].join('');
}
