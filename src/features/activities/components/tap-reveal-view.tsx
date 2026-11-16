import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import { stripInlineMarkup } from '../lib/text';
import type { TapRevealActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { RichText } from './rich-text';

export type TapRevealViewProps = { activity: TapRevealActivity; session: ActivitySession };

/** Cards that show a question or term; tapping reveals the explanation. Solved when every card was opened. */
export function TapRevealView({ activity, session }: TapRevealViewProps) {
  const theme = useTheme();
  const { text } = session;
  const [opened, setOpened] = useState<number[]>([]);

  const open = (index: number) => {
    if (opened.includes(index)) return;
    tapFeedback();
    const next = [...opened, index];
    setOpened(next);
    if (next.length === activity.cards.length) void session.check({ kind: 'tap-reveal', opened: next });
  };

  return (
    <ActivityFrame session={session}>
      <ThemedText type="caption" themeColor="textSecondary" accessibilityLiveRegion="polite">
        {text.revealedCount(opened.length, activity.cards.length)}
      </ThemedText>
      <View style={styles.cards}>
        {activity.cards.map((card, index) => {
          const isOpen = opened.includes(index);
          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={isOpen ? `${stripInlineMarkup(card.front)}. ${stripInlineMarkup(card.back)}` : `${stripInlineMarkup(card.front)}. ${text.tapToReveal}`}
              accessibilityState={{ expanded: isOpen }}
              onPress={() => open(index)}
              style={({ pressed }) => [styles.card, { backgroundColor: isOpen ? theme.primarySoft : theme.backgroundElement, borderColor: isOpen ? theme.primary : theme.border }, pressed && styles.pressed]}>
              <View style={styles.front}>
                <RichText type="bodySemiBold" text={card.front} style={styles.frontText} />
                <Icon name={isOpen ? 'check_circle' : 'touch_app'} size={20} color={isOpen ? 'primary' : 'textSecondary'} />
              </View>
              {isOpen ? (
                <RichText type="body" text={card.back} />
              ) : (
                <ThemedText type="caption" themeColor="textSecondary">
                  {text.tapToReveal}
                </ThemedText>
              )}
            </Pressable>
          );
        })}
      </View>
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  cards: { gap: Spacing.two },
  card: { gap: Spacing.two, minHeight: MinTouchSize + 8, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: 1.5 },
  front: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  frontText: { flex: 1 },
  pressed: { opacity: 0.75 },
});
