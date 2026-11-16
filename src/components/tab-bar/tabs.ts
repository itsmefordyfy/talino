import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import type { Strings } from '@/constants/strings';

export type TabName = 'index' | 'courses' | 'slot' | 'career' | 'me';

export type Tab = {
  name: TabName;
  href: '/' | '/courses' | '/slot' | '/career' | '/me';
  /** Which interface string names the tab. */
  label: keyof Strings['tabs'];
  /** The same rounded Material Symbol on both platforms. */
  icon: MaterialSymbolName;
};

/** The tabs, in order, shared by the iOS and Android tab bars so they never drift apart. */
export const TABS: readonly Tab[] = [
  { name: 'index', href: '/', label: 'today', icon: 'hub' },
  { name: 'courses', href: '/courses', label: 'courses', icon: 'school' },
  /** Tali's slot: an empty disabled tab under FloatingTaliButton; Tali opens as a sheet (/tali). */
  { name: 'slot', href: '/slot', label: 'coach', icon: 'forum' },
  { name: 'career', href: '/career', label: 'career', icon: 'work' },
  { name: 'me', href: '/me', label: 'me', icon: 'person' },
];
