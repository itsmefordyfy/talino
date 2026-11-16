import type { ScreenEntry } from '../screen-registry';
import type { ScreenPresets } from '@/navigation/presets';

import { interviewStrings } from './strings';

/** The mock interview's stack screens: the home pushes, the setup and the interview push over it, the evaluation replaces the interview. */
export function interviewScreens(presets: ScreenPresets): ScreenEntry[] {
  const strings = interviewStrings[presets.language];
  return [
    { name: 'interview/index', options: presets.push(strings.title) },
    { name: 'interview/setup', options: presets.push(strings.setupTitle) },
    { name: 'interview/[id]', options: presets.push(strings.chatTitle) },
    { name: 'interview/report/[id]', options: presets.push(strings.reportTitle) },
  ];
}
