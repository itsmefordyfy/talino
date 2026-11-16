import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { GUIDE_HEIGHT } from '../lib/layout';
import type { TaliLine } from '../lib/tali-lines';
import { journeyStrings } from '../strings';

export type TaliGuideProps = {
  line: TaliLine;
  coachName: string;
  top: number;
  onAsk: () => void;
};

/** Tali beside the learner's place on the road, saying one thing about where they actually are. Tap to ask about this step. */
export function TaliGuide({ line, coachName, top, onAsk }: TaliGuideProps) {
  const text = useLocalized(journeyStrings);
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${coachName}: ${line.text}. ${text.header.askTali(coachName)}`}
      onPress={() => {
        tapFeedback();
        onAsk();
      }}
      style={({ pressed }) => [styles.guide, { top, height: GUIDE_HEIGHT - 20, backgroundColor: theme.backgroundElement, borderColor: theme.border, boxShadow: theme.shadowCard }, pressed && styles.pressed]}>
      <Tali size={84} tight mood={line.mood} />
      <View style={styles.text}>
        <ThemedText type="bodySemiBold" numberOfLines={3}>
          {line.text}
        </ThemedText>
        <View style={styles.ask}>
          <ThemedText type="caption" themeColor="primaryText" style={styles.askText}>
            {text.header.askTali(coachName)}
          </ThemedText>
          <Icon name="chevron_right" size={16} color="primary" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  guide: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  text: {
    flex: 1,
    gap: Spacing.one,
  },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  askText: {
    fontWeight: '700',
  },
});
