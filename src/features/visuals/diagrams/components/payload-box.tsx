import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PayloadTone = 'neutral' | 'ok' | 'danger' | 'warn' | 'info';

export type Payload = {
  /** What it is: "Request", "Response", "Row". Always shown, so the tone is never the only signal. */
  title: string;
  lines: readonly string[];
  tone?: PayloadTone;
};

const TONES: Record<PayloadTone, { border: ThemeColor; ink: ThemeColor }> = {
  neutral: { border: 'border', ink: 'textSecondary' },
  ok: { border: 'statusOk', ink: 'statusOk' },
  danger: { border: 'statusDanger', ink: 'statusDanger' },
  warn: { border: 'statusWarn', ink: 'statusWarn' },
  info: { border: 'primary', ink: 'primaryText' },
};

export type PayloadBoxProps = Payload;

/** A labelled block of monospace lines: an HTTP request, a JSON body, a table row. Text is selectable so it can be copied. */
export function PayloadBox({ title, lines, tone = 'neutral' }: PayloadBoxProps) {
  const theme = useTheme();
  const look = TONES[tone];
  return (
    <View accessible accessibilityLabel={`${title}. ${lines.join('. ')}`} style={[styles.box, { borderColor: theme[look.border], backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="caption" themeColor={look.ink} style={styles.title}>
        {title}
      </ThemedText>
      {lines.map((line, index) => (
        <ThemedText key={index} type="code" selectable>
          {line}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: 1.5,
  },
  title: { textTransform: 'uppercase', letterSpacing: 0.6 },
});
