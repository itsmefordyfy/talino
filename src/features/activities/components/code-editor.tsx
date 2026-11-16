import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputSelectionChangeEvent } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { breakLigatures, highlight } from '@/lib/highlight';

import { insertAtSelection } from '../lib/text';
import { activityStrings } from '../strings';
import { CODE_FONT_SCALE_CAP, TOKEN_COLOR } from './code-lines';

export type CodeEditorProps = {
  value: string;
  onChangeText: (value: string) => void;
  /** The highlighter's language label ("javascript", "sql"). */
  language?: string;
  /** Lines the editor is at least tall for. */
  minLines?: number;
  editable?: boolean;
  accessibilityLabel?: string;
  /** The quick-insert row above the keyboard (Tab and the brackets); on by default. */
  toolbar?: boolean;
  placeholder?: string;
};

const SYMBOLS = ['(', ')', '{', '}', '[', ']', '"', ';'] as const;
const INDENT = '  ';
/** Extra room after the longest line, so the input never wraps a line the highlight layer did not. */
const RIGHT_ROOM = Spacing.four;

/**
 * A code editor: a transparent-text TextInput laid exactly over a syntax-highlighted Text, with the same
 * font, line height and no padding on either layer, so the colors stay under the letters as you type. Line
 * numbers sit in a fixed gutter; long lines scroll sideways rather than wrap (a wrapped line would
 * misalign the numbers). A quick-insert row supplies Tab (two spaces) and the brackets that are slow to
 * reach on a phone keyboard.
 */
export function CodeEditor({ value, onChangeText, language = 'javascript', minLines = 6, editable = true, accessibilityLabel, toolbar = true, placeholder }: CodeEditorProps) {
  const theme = useTheme();
  const strings = useLocalized(activityStrings);
  const selection = useRef({ start: value.length, end: value.length });
  const [forced, setForced] = useState<{ start: number; end: number } | null>(null);

  const lineCount = Math.max(minLines, value.split('\n').length);
  const gutter = Array.from({ length: lineCount }, (_, index) => String(index + 1)).join('\n');
  const tokens = highlight(value, language);
  // A trailing newline adds an empty last line that Text would not draw; a space keeps the layers the same height.
  const tail = value.endsWith('\n') || value === '' ? ' ' : '';
  // Pad the highlight layer to the minimum height with empty lines so a short program still fills the editor.
  const filler = '\n'.repeat(Math.max(0, minLines - value.split('\n').length));

  const insert = (text: string) => {
    tapFeedback();
    const next = insertAtSelection(value, selection.current, text);
    selection.current = { start: next.cursor, end: next.cursor };
    setForced({ start: next.cursor, end: next.cursor });
    onChangeText(next.value);
  };

  const onSelection = (event: TextInputSelectionChangeEvent) => {
    selection.current = event.nativeEvent.selection;
    if (forced) setForced(null);
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.editor, { backgroundColor: theme.codeBackground, borderColor: theme.codeBorder }]}>
        <View style={[styles.gutter, { borderColor: theme.codeBorder }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={[styles.metrics, styles.gutterText, { color: theme.codeComment }]} maxFontSizeMultiplier={CODE_FONT_SCALE_CAP}>
            {gutter}
          </Text>
        </View>
        <ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.layers}>
            <Text style={[styles.metrics, styles.codeText, { color: theme.codeText }]} maxFontSizeMultiplier={CODE_FONT_SCALE_CAP} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {tokens.map((token, index) => (
                <Text key={index} style={{ color: theme[TOKEN_COLOR[token.kind]] }}>
                  {breakLigatures(token.text)}
                </Text>
              ))}
              {tail}
              {filler}
            </Text>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              onSelectionChange={onSelection}
              selection={forced ?? undefined}
              multiline
              scrollEnabled={false}
              editable={editable}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="ascii-capable"
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              selectionColor={theme.primary}
              cursorColor={theme.primary}
              placeholder={placeholder}
              placeholderTextColor={theme.codeComment}
              maxFontSizeMultiplier={CODE_FONT_SCALE_CAP}
              accessibilityLabel={accessibilityLabel ?? strings.codeEditor}
              // The text is drawn by the layer below; this one only carries the caret, the selection and the typing.
              style={[styles.metrics, styles.input]}
            />
          </View>
        </ScrollView>
      </View>
      {toolbar && editable && (
        <ScrollView horizontal keyboardShouldPersistTaps="always" showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbar}>
          <Key label={strings.tabKey} accessibilityLabel={strings.insertSpaces} onPress={() => insert(INDENT)} wide />
          {SYMBOLS.map((symbol) => (
            <Key key={symbol} label={symbol} accessibilityLabel={strings.insertSymbol(symbol)} onPress={() => insert(symbol)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function Key({ label, accessibilityLabel, onPress, wide = false }: { label: string; accessibilityLabel: string; onPress: () => void; wide?: boolean }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      // Keep the keyboard up: the press must not take focus from the editor.
      focusable={false}
      style={({ pressed }) => [styles.key, wide && styles.keyWide, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }, pressed && styles.pressed]}>
      <ThemedText type="code" style={styles.keyLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const LINE = Typography.code.lineHeight;

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  editor: {
    flexDirection: 'row',
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  gutter: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  gutterText: { textAlign: 'right', minWidth: 20 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  // The two layers share this box: same origin, no padding of their own.
  layers: {
    flexGrow: 1,
    paddingVertical: Spacing.three,
    paddingLeft: Spacing.three,
    paddingRight: RIGHT_ROOM,
  },
  // Identical text metrics for the gutter, the highlight and the input.
  metrics: {
    fontFamily: Typography.code.fontFamily,
    fontSize: Typography.code.fontSize,
    lineHeight: LINE,
    fontWeight: Typography.code.fontWeight,
    letterSpacing: 0,
    includeFontPadding: false,
  },
  codeText: {},
  input: {
    position: 'absolute',
    top: Spacing.three,
    bottom: Spacing.three,
    left: Spacing.three,
    right: 0,
    padding: 0,
    margin: 0,
    color: 'transparent',
    backgroundColor: 'transparent',
  },
  toolbar: { gap: Spacing.two, paddingRight: Spacing.three },
  key: {
    minWidth: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  keyWide: { minWidth: 64 },
  keyLabel: { fontWeight: 600 },
  pressed: { opacity: 0.7 },
});
