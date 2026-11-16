import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';

export type DraftLineProps = {
  label: string;
  text: string;
  used: boolean;
  useLabel: string;
  usedLabel: string;
  onUse: () => void;
};

/** One piece of Tali's draft: what it wrote, and a button that applies just that piece. Nothing changes until it is tapped. */
export function DraftLine({ label, text, used, useLabel, usedLabel, onUse }: DraftLineProps) {
  return (
    <View style={styles.line}>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
        {label}
      </ThemedText>
      <ThemedText type="body" selectable>
        {text}
      </ThemedText>
      <Button title={used ? usedLabel : useLabel} icon={used ? 'check' : undefined} variant="secondary" size="small" disabled={used} onPress={onUse} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    gap: Spacing.one,
  },
  caps: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
