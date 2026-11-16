import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type VisualFrameProps = {
  title: string;
  /** Read by screen readers: what the visual shows and how to use it. */
  description: string;
  /** The picture or interactive area. */
  children: ReactNode;
  /** Controls under the picture (StepControls, buttons that change the state). */
  controls?: ReactNode;
  /** The sentence that explains the current state, shown under the picture and announced when it changes. */
  caption?: string;
  /** Inside a lesson card: tighter padding, no title row. */
  compact?: boolean;
};

/** The shared card every interactive visual sits in: a title, the picture, its controls and a live caption. */
export function VisualFrame({ title, description, children, controls, caption, compact = false }: VisualFrameProps) {
  const theme = useTheme();
  return (
    <View accessible={false} accessibilityLabel={`${title}. ${description}`} style={[styles.frame, compact && styles.compact, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {!compact && (
        <ThemedText type="cardTitle" accessibilityRole="header">
          {title}
        </ThemedText>
      )}
      <View style={[styles.stage, { backgroundColor: theme.codeBackground, borderColor: theme.codeBorder }]}>{children}</View>
      {caption ? (
        <ThemedText type="body" accessibilityLiveRegion="polite">
          {caption}
        </ThemedText>
      ) : null}
      {controls}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  compact: {
    padding: Spacing.two + 2,
    gap: Spacing.two + 2,
  },
  stage: {
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
