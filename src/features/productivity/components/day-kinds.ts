import type { IconName } from '@/components/ui/icon';
import type { Tone } from '@/constants/theme';

import type { BlockKind, FixedKind, Priority } from '../types';

/** One icon and one tone per kind of block, so a kind is told apart by its icon and its label, never by colour alone. */
export const FIXED_ICONS: Record<FixedKind, IconName> = { meeting: 'groups', class: 'school', personal: 'person', meal: 'restaurant', rest: 'self_improvement', commute: 'directions_car', interruption: 'bolt' };
export const FIXED_TONES: Record<FixedKind, Tone> = { meeting: 'indigo', class: 'indigo', personal: 'violet', meal: 'mint', rest: 'mint', commute: 'neutral', interruption: 'amber' };
export const BLOCK_ICONS: Record<BlockKind, IconName> = { task: 'task_alt', break: 'coffee', buffer: 'hourglass_empty' };
export const BLOCK_TONES: Record<BlockKind, Tone> = { task: 'violet', break: 'mint', buffer: 'neutral' };
export const PRIORITY_ICONS: Record<Priority, IconName> = { high: 'priority_high', medium: 'flag', low: 'schedule' };
