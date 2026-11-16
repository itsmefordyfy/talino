import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

export type ClassMember = { text: string; /** A short tag after the member: "overrides", "abstract", "private". */ tag?: string; highlight?: boolean };

export type ClassBoxProps = {
  name: string;
  /** Shown above the name in guillemets, e.g. interface or abstract. */
  stereotype?: string;
  fields?: readonly ClassMember[];
  methods?: readonly ClassMember[];
  tone?: Tone;
  /** The class being looked at now. */
  active?: boolean;
  /** The class that provides the method. */
  provider?: boolean;
  dim?: boolean;
  /** Dashed outline: an interface or abstract class (never instantiated itself). */
  dashed?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** A UML-style class box: name, then fields, then methods, with a tag for overrides and a dashed border for abstract types. */
export function ClassBox({ name, stereotype, fields = [], methods = [], tone = 'indigo', active = false, provider = false, dim = false, dashed = false, style }: ClassBoxProps) {
  const theme = useTheme();
  const tones = useTones();
  const colors = tones[provider ? 'mint' : active ? 'amber' : tone];
  const label = [stereotype ? `${stereotype}` : null, name, ...fields.map((field) => field.text), ...methods.map((method) => `${method.text}${method.tag ? ` ${method.tag}` : ''}`)].filter(Boolean).join(', ');
  return (
    <View accessible accessibilityLabel={label} style={[styles.box, { backgroundColor: theme.backgroundElement, borderColor: active || provider ? colors.ink : theme.border, borderStyle: dashed ? 'dashed' : 'solid' }, (active || provider) && styles.strong, dim && styles.dim, style]}>
      <View style={[styles.head, { backgroundColor: colors.soft }]}>
        {stereotype ? (
          <ThemedText type="caption" style={{ color: colors.ink }}>{`«${stereotype}»`}</ThemedText>
        ) : null}
        <ThemedText type="secondarySemiBold" style={{ color: colors.ink }}>{name}</ThemedText>
      </View>
      {fields.length > 0 ? (
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          {fields.map((field) => (
            <ThemedText key={field.text} type="code" themeColor={field.highlight ? 'primary' : 'codeText'}>{`${field.text}${field.tag ? `  ${field.tag}` : ''}`}</ThemedText>
          ))}
        </View>
      ) : null}
      {methods.length > 0 ? (
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          {methods.map((method) => (
            <ThemedText key={method.text} type="code" themeColor={method.highlight ? 'primary' : 'codeText'}>{`${method.highlight ? '▶ ' : ''}${method.text}${method.tag ? `  ${method.tag}` : ''}`}</ThemedText>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5, overflow: 'hidden' },
  strong: { borderWidth: 3 },
  dim: { opacity: 0.55 },
  head: { alignItems: 'center', paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  section: { gap: 1, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two, borderTopWidth: StyleSheet.hairlineWidth },
});
