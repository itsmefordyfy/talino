import type { NativeStackNavigationOptions } from 'expo-router';

import type { ScreenPresets } from '@/navigation/presets';

import { careerScreens } from './career/screens';
import { coreScreens } from './core-screens';
import { discoverScreens } from './discover/screens';
import { interviewScreens } from './interview/screens';
import { resumeScreens } from './resume/screens';

export type ScreenEntry = { name: string; options: NativeStackNavigationOptions };
export type ScreenRegister = (presets: ScreenPresets) => ScreenEntry[];

/** Each feature's stack screens; add a feature's `xxxScreens` here. */
export const appScreenRegistry: readonly ScreenRegister[] = [coreScreens, careerScreens, resumeScreens, discoverScreens, interviewScreens];
