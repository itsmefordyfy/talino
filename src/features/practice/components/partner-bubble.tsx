import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TypingDots } from '@/components/ui/typing-dots';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PartnerAvatarProps = { name: string; size?: number };

/** The partner's first letter on a soft circle: a simulated person has no face to show, and a real or famous one must never be implied. */
export function PartnerAvatar({ name, size = 40 }: PartnerAvatarProps) {
  const theme = useTheme();
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.primarySoft }]}>
      <ThemedText type="cardTitle" themeColor="primary">
        {name.trim().charAt(0).toUpperCase()}
      </ThemedText>
    </View>
  );
}

export type PartnerBubbleProps = {
  name: string;
  text: string;
  /** Speaking scenarios: a button that reads this line aloud. Absent for ordinary role-plays. */
  speech?: { speaking: boolean; onPress: () => void; hearLabel: string; stopLabel: string };
};

/** The partner's line on the left, named, with the optional "Hear the reply" button under it. Plain text: a person talking, not a document. */
export function PartnerBubble({ name, text, speech }: PartnerBubbleProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <PartnerAvatar name={name} />
      <View style={styles.column}>
        <View style={[styles.bubble, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]} accessible accessibilityLabel={`${name}: ${text}`}>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {name}
          </ThemedText>
          <ThemedText type="body" selectable>
            {text}
          </ThemedText>
        </View>
        {speech && <Button title={speech.speaking ? speech.stopLabel : speech.hearLabel} icon={speech.speaking ? 'stop' : 'volume_up'} size="small" variant="ghost" onPress={speech.onPress} style={styles.hear} />}
      </View>
    </View>
  );
}

export type PartnerThinkingProps = { name: string; label: string };

/** While the partner is replying: their avatar and three moving dots (still with Reduce Motion), announced once as `label`. */
export function PartnerThinking({ name, label }: PartnerThinkingProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, styles.centered]}>
      <PartnerAvatar name={name} />
      <View style={[styles.thinking, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <TypingDots label={label} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  centered: { alignItems: 'center' },
  column: { flex: 1, gap: Spacing.one, alignItems: 'flex-start' },
  bubble: {
    alignSelf: 'stretch',
    gap: Spacing.half,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.large,
    borderTopLeftRadius: Radius.small,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  hear: { marginLeft: -Spacing.two },
  thinking: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.large,
    borderTopLeftRadius: Radius.small,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
