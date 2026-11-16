import type { Language } from '@/lib/language';

import { aiVisuals, aiVisualsFil } from './ai';
import { dsaVisuals, dsaVisualsFil } from './dsa';
import { fundamentalsVisuals, fundamentalsVisualsFil } from './fundamentals';
import { oopVisuals, oopVisualsFil } from './oop';
import { softwareEngineeringVisuals, softwareEngineeringVisualsFil } from './software-engineering';
import type { VisualDefinition } from './types';
import { webVisuals, webVisualsFil } from './web';

/**
 * Every interactive visual in Talino. Each area of visuals lives in its own folder and exports a list;
 * this file only concatenates them, so areas never edit each other's files.
 */
const AREAS: readonly (readonly VisualDefinition[])[] = [fundamentalsVisuals, oopVisuals, dsaVisuals, webVisuals, softwareEngineeringVisuals, aiVisuals];

export const VISUALS: readonly VisualDefinition[] = AREAS.flat();

const AREAS_FIL: readonly (readonly VisualDefinition[])[] = [fundamentalsVisualsFil, oopVisualsFil, dsaVisualsFil, webVisualsFil, softwareEngineeringVisualsFil, aiVisualsFil];
const VISUALS_FIL: readonly VisualDefinition[] = AREAS_FIL.flat();

/** Every visual with its title, summary and description in `language` (the interactive part reads its own language). */
export function visualsFor(language: Language): readonly VisualDefinition[] {
  return language === 'fil' ? VISUALS_FIL : VISUALS;
}

export function findVisual(id: string, language: Language = 'en'): VisualDefinition | null {
  return visualsFor(language).find((visual) => visual.id === id) ?? null;
}
