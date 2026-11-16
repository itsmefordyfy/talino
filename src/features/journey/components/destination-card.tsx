import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import type { JourneyDestination } from '../lib/types';
import { journeyStrings } from '../strings';

export type DestinationCardProps = {
  destination: JourneyDestination;
  reached: boolean;
};

/** The end of the road: where the journey leads, and what the learner will be able to build once they get there. */
export function DestinationCard({ destination, reached }: DestinationCardProps) {
  const text = useLocalized(journeyStrings).map;
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: reached ? theme.statusOkSoft : theme.primarySoft, borderColor: reached ? theme.success : theme.primary }]}>
      <View style={styles.head}>
        <Tali size={72} tight mood={reached ? 'celebrating' : 'inspired'} />
        <View style={styles.headText}>
          <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
            {reached ? text.destinationReached : text.destinationEyebrow}
          </ThemedText>
          <ThemedText type="section" accessibilityRole="header">
            {destination.title}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="secondary" themeColor="textSecondary">
        {destination.summary}
      </ThemedText>
      <ThemedText type="secondarySemiBold">{text.destinationLead}</ThemedText>
      {destination.abilities.map((ability) => (
        <View key={ability} style={styles.ability}>
          <Icon name="check_circle" size={18} color="primary" filled />
          <ThemedText type="secondary" style={styles.abilityText}>
            {ability}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  headText: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  ability: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  abilityText: {
    flex: 1,
  },
});
