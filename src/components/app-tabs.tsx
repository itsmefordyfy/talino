import { NativeTabs } from 'expo-router/native-tabs';
import type { ColorValue } from 'react-native';

import { openTali } from '@/components/tab-bar/floating-tali-button';
import { TABS, type Tab } from '@/components/tab-bar/tabs';
import { MaterialSymbols, type MaterialSymbolName } from '@/components/ui/material-symbols';
import { TabIconSize } from '@/constants/theme';
import { useChromeLayout } from '@/hooks/use-chrome-layout';
import { useTabBarOnTop } from '@/hooks/use-tab-bar-on-top';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

/**
 * Material Symbols as a tab icon family. The tab bar asks for 24pt images; this draws them at
 * TabIconSize instead, so the icons read as large as the system's own.
 */
const TabSymbols = {
  getImageSource: (name: MaterialSymbolName, _size: number, color: ColorValue) => MaterialSymbols.getImageSource(name, TabIconSize, color),
};

/**
 * Draws nothing at the tab icon's size. An iPad's top bar sizes each item to its content, so Tali's slot (no icon on a phone, where the
 * bottom bar gives every item the same width) would collapse and leave Tali's round button over its neighbours: this holds its width.
 */
const SlotSymbols = {
  getImageSource: (name: MaterialSymbolName, _size: number, _color: ColorValue) => MaterialSymbols.getImageSource(name, TabIconSize, '#00000001'),
};

/**
 * The system tab bar (Liquid Glass on iOS 26), each tab with its icon and name (five tabs read faster with names; Claude's call, 2026-11-13). The active tab takes the primary ink and a soft indigo indicator. Settings is the gear in each tab's header.
 * disableAutomaticContentInsets: every tab screen pads for the status bar and tab bar itself
 * (useScreenPadding). No custom labelStyle font: on iOS it replaces the tab bar's own title font.
 */
export default function AppTabs() {
  const colors = useTheme();
  const strings = useStrings();
  const { vertical } = useChromeLayout();
  // Tali's round button floats over the middle slot on every device (iPad top bar, Duo side bar, phone bottom bar): owner, 2026-11-16.
  const barOnTop = useTabBarOnTop();
  // On a bar along a side or across the top the slot would collapse without an icon (items size to their content), so it holds its width.
  const holdsSlot = vertical || barOnTop;
  const trigger = (tab: Tab) =>
    // Tali's slot: no icon or name (FloatingTaliButton sits on it), never selected (`disabled` doesn't dim it), and a tap anywhere on it opens Tali, like the button.
    tab.name === 'slot' ? (
      <NativeTabs.Trigger key={tab.name} name={tab.name} disabled disableAutomaticContentInsets accessibilityLabel={strings.tabs[tab.label]} listeners={{ tabPress: openTali }}>
        <NativeTabs.Trigger.Label hidden />
        {holdsSlot && <NativeTabs.Trigger.Icon src={<NativeTabs.Trigger.VectorIcon family={SlotSymbols} name={tab.icon} />} renderingMode="template" />}
      </NativeTabs.Trigger>
    ) : (
    <NativeTabs.Trigger key={tab.name} name={tab.name} disableAutomaticContentInsets accessibilityLabel={strings.tabs[tab.label]}>
      {/* Icons only (owner's call, 2026-11-14, as in Pawfetti), on an iPad too (owner, 2026-11-16: "make the tabs same as in the iphone"); the name stays for screen readers. */}
      <NativeTabs.Trigger.Label hidden />
      {/* A function's output, not a component: a trigger only reads an Icon that is its direct child. */}
      <NativeTabs.Trigger.Icon src={<NativeTabs.Trigger.VectorIcon family={TabSymbols} name={tab.icon} />} renderingMode="template" md={tab.icon} />
    </NativeTabs.Trigger>
    );
  return (
    // No sidebarAdaptable (owner, 2026-11-16: the iPad's tabs are the iPhone's, icons only): a sidebar is unreadable without names.
    <NativeTabs backgroundColor={colors.background} indicatorColor={colors.primarySoft} tintColor={colors.primaryText}>
      {TABS.map(trigger)}
    </NativeTabs>
  );
}
