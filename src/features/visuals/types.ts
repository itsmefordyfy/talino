import type { ComponentType } from 'react';

/** What a visual explains, for grouping in the Concept Lab and for linking from lessons. */
export type VisualCategory = 'fundamentals' | 'oop' | 'dsa' | 'web' | 'software-engineering' | 'ai' | 'productivity';

export type VisualProps = {
  /** Drawn inside a lesson card, where room is tighter: skip extras, keep the controls. */
  compact?: boolean;
};

/**
 * One interactive visual. `Component` is a real interactive explanation (the learner presses buttons and
 * watches the state change), never a picture. `description` is read by screen readers: what it shows and
 * how to use it. A lesson embeds a visual with the block `{ type: 'visual', id }`.
 */
export type VisualDefinition = {
  /** Kebab-case, unique across all visuals, e.g. `sorting-bubble`. */
  id: string;
  title: string;
  category: VisualCategory;
  /** One sentence for the Concept Lab list. */
  summary: string;
  description: string;
  /** Free-text keywords a lesson or the AI mentor can match ("loop", "http request", "rag"). */
  topics: readonly string[];
  Component: ComponentType<VisualProps>;
};
