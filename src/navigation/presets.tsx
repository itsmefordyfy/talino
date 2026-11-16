import { router, type NativeStackNavigationOptions } from 'expo-router';

import { headerCloseOptions } from '@/components/header-close-button';
import { SheetHeader } from '@/components/sheet-header';
import { PageSheetDetent, SheetCornerRadius, type ThemeColors } from '@/constants/theme';
import type { CompanionId } from '@/features/companion/lib/companions';
import type { Language } from '@/lib/i18n';

/**
 * How a screen is presented, shared by every feature's `screens` list so all forms open the same
 * way: `pageSheet` for forms and editors (iOS's page sheet; an Android form sheet of the same shape
 * with `SheetHeader`), `push` for a page in the stack, `fullScreen` for something with its own close.
 */
export type ScreenPresets = {
  pageSheet: (title: string) => NativeStackNavigationOptions;
  push: (title: string) => NativeStackNavigationOptions;
  fullScreen: () => NativeStackNavigationOptions;
  language: Language;
  /** The coach the learner chose, for titles that name her or him. */
  companion: CompanionId;
};

export function makeScreenPresets(colors: ThemeColors, language: Language, companion: CompanionId = 'tali'): ScreenPresets {
  return {
    language,
    companion,
    // Every sheet has the round X in its header (owner, 2026-11-16: "on all bottom sheets, put a close
    // button on the header"), not the shared back chevron; dragging down still closes it too.
    pageSheet: (title) =>
      process.env.EXPO_OS === 'android'
        ? {
            title,
            presentation: 'formSheet',
            sheetAllowedDetents: [PageSheetDetent],
            sheetCornerRadius: SheetCornerRadius,
            header: SheetHeader,
            headerLeft: undefined,
            ...headerCloseOptions({ onPress: closeSheet }, 'left'),
            contentStyle: { backgroundColor: colors.background },
          }
        : { title, presentation: 'modal', unstable_headerLeftItems: undefined, ...headerCloseOptions({ onPress: closeSheet }, 'left') },
    push: (title) => ({ title }),
    fullScreen: () => ({ presentation: 'fullScreenModal', headerShown: false }),
  };
}

/** Closes the sheet on top: the same as dragging it down, so a form's leave guard still asks first. */
function closeSheet() {
  router.back();
}
