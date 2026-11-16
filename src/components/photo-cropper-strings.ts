import { defineStrings } from '@/lib/i18n';

const en = {
  title: 'Move and zoom',
  hint: 'Drag to move the photo and pinch to zoom. What is inside the frame is what you keep.',
  frameLabel: 'Photo crop area. Drag to move, pinch to zoom.',
};

/** The crop screen's words. English only for now: the Filipino table repeats it. */
export const photoCropperStrings = defineStrings({ en, fil: en });
