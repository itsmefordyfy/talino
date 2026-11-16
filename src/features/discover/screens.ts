import type { ScreenPresets } from '@/navigation/presets';

import type { ScreenEntry } from '../screen-registry';
import { discoverStrings } from './strings';

/** Discover's stack screens: the filters and the sort open as sheets, a learning path is a page. */
export function discoverScreens(presets: ScreenPresets): ScreenEntry[] {
  const strings = discoverStrings[presets.language];
  return [
    { name: 'discover-filters', options: presets.pageSheet(strings.filtersTitle) },
    { name: 'discover-sort', options: presets.pageSheet(strings.sortTitle) },
    { name: 'path/[id]', options: presets.push('') },
  ];
}
