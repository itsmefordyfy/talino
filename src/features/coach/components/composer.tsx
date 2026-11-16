import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ComposerProps = {
  placeholder: string;
  sendLabel: string;
  disabled?: boolean;
  initialText?: string;
  onSend: (text: string) => void;
};

/** The message box and its send button, pinned above the keyboard by the screen's footer. */
export function Composer({ placeholder, sendLabel, disabled = false, initialText = '', onSend }: ComposerProps) {
  const theme = useTheme();
  const [text, setText] = useState(initialText);
  const canSend = !disabled && text.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    onSend(text);
    setText('');
  };
  return (
    <View style={[styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        multiline
        maxLength={4000}
        editable={!disabled}
        accessibilityLabel={placeholder}
        style={[styles.input, { color: theme.text }]}
      />
      <IconButton icon="arrow_upward" accessibilityLabel={sendLabel} onPress={send} disabled={!canSend} background={canSend ? 'primary' : 'backgroundSelected'} color={canSend ? 'onPrimary' : 'textTertiary'} iconSize={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
    paddingVertical: Spacing.one,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 21,
    maxHeight: 120,
    paddingVertical: Spacing.two + 2,
  },
});
