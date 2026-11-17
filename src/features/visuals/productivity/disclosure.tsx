import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type DisclosureProps = {
  title: string;
  /** Spoken as the button's label with the state ("Show: …" / "Hide: …"). */
  showLabel: string;
  hideLabel: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

/** A titled section that opens and closes. The chevron and the expanded state say which, so it never rests on colour. */
export function Disclosure({ title, showLabel, hideLabel, defaultOpen = false, children }: DisclosureProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={[styles.box, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? hideLabel : showLabel}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          tapFeedback();
          setOpen(!open);
        }}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}>
        <ThemedText type="bodySemiBold" style={styles.title}>
          {title}
        </ThemedText>
        <Icon name={open ? 'expand_less' : 'expand_more'} size={24} color="textSecondary" />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  header: { minHeight: MinTouchSize, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  title: { flex: 1 },
  body: { gap: Spacing.two, paddingHorizontal: Spacing.three, paddingBottom: Spacing.three },
  pressed: { opacity: 0.6 },
});
