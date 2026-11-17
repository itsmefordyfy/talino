import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { PartnerAvatar } from './partner-bubble';
import type { PublicScenario } from '../lib/public';
import type { PracticeUiText } from '../strings';

export type ScenarioCardProps = {
  scenario: PublicScenario;
  text: PracticeUiText;
  /** While talking: the situation folds away so the chat has the room (the goal and the partner stay). */
  compact?: boolean;
};

/**
 * What the learner may read before and during a role-play: the situation, their goal and who they are talking to. Only public fields
 * (`publicScenario`) ever reach this card; the partner's private side lives on the server.
 */
export function ScenarioCard({ scenario, text, compact = false }: ScenarioCardProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const showSetting = !compact || open;
  return (
    <Card style={styles.card}>
      <View style={styles.eyebrowRow}>
        <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
          {text.scenario}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          {text.difficulty[scenario.difficulty] ?? scenario.difficulty}
        </ThemedText>
      </View>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {scenario.title}
      </ThemedText>

      <View style={styles.partner} accessible accessibilityLabel={`${text.talkingWith} ${scenario.partner.name}, ${scenario.partner.title}`}>
        <PartnerAvatar name={scenario.partner.name} />
        <View style={styles.partnerText}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {text.talkingWith}
          </ThemedText>
          <ThemedText type="bodySemiBold">{scenario.partner.name}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {scenario.partner.title}
          </ThemedText>
        </View>
      </View>

      {showSetting && (
        <View style={styles.block}>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {text.setting}
          </ThemedText>
          <ThemedText type="body">{scenario.setting}</ThemedText>
        </View>
      )}

      <View style={[styles.goal, { backgroundColor: theme.primarySoft }]} accessible accessibilityLabel={`${text.yourGoal}: ${scenario.goal}`}>
        <Icon name="flag" size={18} color="primary" />
        <View style={styles.partnerText}>
          <ThemedText type="secondarySemiBold" themeColor="primaryText">
            {text.yourGoal}
          </ThemedText>
          <ThemedText type="body">{scenario.goal}</ThemedText>
        </View>
      </View>

      {compact ? (
        <Button title={open ? text.hideScenario : text.showScenario} icon={open ? 'expand_less' : 'expand_more'} size="small" variant="ghost" onPress={() => setOpen((value) => !value)} style={styles.toggle} />
      ) : (
        <ThemedText type="caption" themeColor="textSecondary">
          {text.repliesHint(scenario.minTurns, scenario.maxTurns)}
        </ThemedText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.6 },
  partner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  partnerText: { flex: 1 },
  block: { gap: Spacing.one },
  goal: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  toggle: { alignSelf: 'flex-start', marginLeft: -Spacing.two },
});
