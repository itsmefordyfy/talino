import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { InputHeight, MinTouchSize, Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  /** What the field is, for screen readers. */
  label: string;
  clearLabel: string;
};

/** The catalog search box: a magnifier, the text, and a clear button once there is some. Updates on every keystroke. */
export function SearchField({ value, onChangeText, placeholder, label, clearLabel }: SearchFieldProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Icon name="search" size={20} color="textSecondary" />
      <TextInput
        accessibilityLabel={label}
        accessibilityRole="search"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        selectionColor={theme.primary}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        style={[styles.input, { color: theme.text }]}
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={clearLabel}
          hitSlop={4}
          onPress={() => {
            tapFeedback();
            onChangeText('');
          }}
          style={({ pressed }) => [styles.clear, { backgroundColor: theme.backgroundSelected }, pressed && styles.pressed]}>
          <Icon name="close" size={16} color="textSecondary" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: InputHeight,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.input,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    includeFontPadding: false,
  },
  clear: {
    width: MinTouchSize - 12,
    height: MinTouchSize - 12,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
