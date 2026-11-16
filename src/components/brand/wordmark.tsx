import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing, Spark } from '@/constants/theme';

/** "Talino" with the spark, for the welcome and the paywall (the app was "Talino" until 2026-11-15). */
export function Wordmark() {
  return (
    <View style={styles.row} accessible accessibilityRole="header" accessibilityLabel="Talino">
      <Icon name="auto_awesome" size={26} tint={Spark} filled />
      <ThemedText type="wordmark">Talino</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
