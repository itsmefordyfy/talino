import { defineStrings } from '@/lib/i18n';

// Owner rule (2026-11-15): no Filipino is written, so `fil` is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  noteTitle: 'Your saved architecture work',
  noteNone: 'Nothing is attached to this project yet. Save a diagram, decision record or matrix in the tools and choose this project, and the mentor reads it when she reviews your submission.',
  noteSome: (counts: { diagrams: number; records: number; matrices: number }) => {
    const parts = [
      counts.diagrams > 0 ? (counts.diagrams === 1 ? '1 diagram' : `${counts.diagrams} diagrams`) : null,
      counts.records > 0 ? (counts.records === 1 ? '1 decision record' : `${counts.records} decision records`) : null,
      counts.matrices > 0 ? (counts.matrices === 1 ? '1 trade-off matrix' : `${counts.matrices} trade-off matrices`) : null,
    ].filter((part): part is string => part !== null);
    return `Attached: ${parts.join(', ')}. The mentor reads them with your submission, so make sure your written submission matches what you drew and decided.`;
  },
};

export const architectureStrings = defineStrings({ en, fil: en });
