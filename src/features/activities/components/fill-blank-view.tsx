import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Fonts, MinTouchSize, Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import { BLANK } from '../lib/text';
import type { ActivityText } from '../strings';
import type { FillBlankActivity } from '../types';
import { ActivityFrame, CheckBar } from './activity-frame';
import { CodeLine } from './code-lines';

export type FillBlankViewProps = { activity: FillBlankActivity; session: ActivitySession };

/** Code with gaps. With a word bank: tap a blank, then a word. Without: type into each blank. */
export function FillBlankView({ activity, session }: FillBlankViewProps) {
  const theme = useTheme();
  const { text, done, result } = session;
  const bank = activity.bank;
  const [slots, setSlots] = useState<(number | null)[]>(() => activity.blanks.map(() => null));
  const [typed, setTyped] = useState<string[]>(() => activity.blanks.map(() => ''));
  const [active, setActive] = useState<number | null>(null);
  const [checkedKey, setCheckedKey] = useState<string | null>(null);

  const values = bank ? slots.map((slot) => (slot === null ? '' : bank[slot])) : typed;
  const detail = result?.detail?.kind === 'fill-blank' && checkedKey === values.join('\u0000') ? result.detail : null;

  const tapSlot = (index: number) => {
    if (done) return;
    tapFeedback();
    if (slots[index] !== null) {
      setSlots((current) => current.map((slot, i) => (i === index ? null : slot)));
      setActive(index);
    } else setActive(active === index ? null : index);
  };

  const tapWord = (wordIndex: number) => {
    if (done || slots.includes(wordIndex)) return;
    const target = active ?? slots.findIndex((slot) => slot === null);
    if (target < 0) return;
    tapFeedback();
    const next = slots.map((slot, i) => (i === target ? wordIndex : slot));
    setSlots(next);
    const after = next.findIndex((slot, i) => slot === null && i > target);
    const any = next.findIndex((slot) => slot === null);
    setActive(after !== -1 ? after : any !== -1 ? any : null);
  };

  let counter = 0;

  return (
    <ActivityFrame session={session}>
      <ThemedText type="secondarySemiBold" themeColor="textSecondary">
        {bank ? text.pickWord : text.typeWord}
      </ThemedText>
      <View style={[styles.code, { backgroundColor: theme.codeBackground, borderColor: theme.codeBorder }]}>
        {activity.code.split('\n').map((line, lineIndex) => {
          const parts = line.split(BLANK);
          return (
            <View key={lineIndex} style={styles.line}>
              {parts.map((part, partIndex) => {
                const slotIndex = partIndex < parts.length - 1 ? counter++ : null;
                return (
                  <View key={partIndex} style={styles.segment}>
                    {part !== '' && <CodeLine code={part} language={activity.language} />}
                    {slotIndex !== null && (
                      <Slot
                        index={slotIndex}
                        value={values[slotIndex]}
                        typedMode={!bank}
                        active={active === slotIndex}
                        text={text}
                        mark={detail ? detail.blanks[slotIndex]?.correct : undefined}
                        disabled={done}
                        onPress={() => tapSlot(slotIndex)}
                        onType={(value) => setTyped((current) => current.map((item, i) => (i === slotIndex ? value : item)))}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>

      {bank && (
        <View style={styles.bank}>
          <ThemedText type="caption" themeColor="textSecondary">
            {text.wordBank}
          </ThemedText>
          <View style={styles.words}>
            {bank.map((word, index) => {
              const used = slots.includes(index);
              return (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityLabel={word}
                  accessibilityState={{ disabled: used || done }}
                  disabled={used || done}
                  onPress={() => tapWord(index)}
                  style={({ pressed }) => [styles.word, { backgroundColor: used ? theme.backgroundSelected : theme.primarySoft, borderColor: used ? theme.border : theme.primary }, pressed && styles.pressed]}>
                  <Text style={[styles.wordText, { color: used ? theme.textTertiary : theme.primaryText }]}>{word}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <CheckBar
        session={session}
        canCheck={values.every((value) => value.trim() !== '')}
        onCheck={() => {
          setCheckedKey(values.join('\u0000'));
          void session.check({ kind: 'fill-blank', values });
        }}
        onRetry={
          bank
            ? () => {
                // Keep what was right, empty what was wrong.
                const wrong = result?.detail?.kind === 'fill-blank' ? result.detail.blanks : [];
                setSlots((current) => current.map((slot, i) => (wrong[i]?.correct ? slot : null)));
                setActive(null);
              }
            : undefined
        }
      />
    </ActivityFrame>
  );
}

type SlotProps = {
  text: ActivityText;
  index: number;
  value: string;
  typedMode: boolean;
  active: boolean;
  mark?: boolean;
  disabled: boolean;
  onPress: () => void;
  onType: (value: string) => void;
};

function Slot({ text, index, value, typedMode, active, mark, disabled, onPress, onType }: SlotProps) {
  const theme = useTheme();
  const border = mark === true ? theme.statusOk : mark === false ? theme.statusDanger : active ? theme.primary : theme.codeComment;
  const common = { backgroundColor: mark === true ? theme.statusOkSoft : mark === false ? theme.statusDangerSoft : active ? theme.primarySoft : theme.backgroundElement, borderColor: border };
  const label = text.blankLabel(index + 1);

  if (typedMode) {
    return (
      <View style={[styles.slot, common]}>
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onType}
          editable={!disabled}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          keyboardType="ascii-capable"
          placeholder={BLANK}
          placeholderTextColor={theme.codeComment}
          selectionColor={theme.primary}
          style={[styles.slotInput, { color: theme.text, width: Math.max(64, value.length * 9 + 24) }]}
        />
        {mark !== undefined && <Icon name={mark ? 'check' : 'close'} size={14} color={mark ? 'statusOk' : 'statusDanger'} />}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}. ${text.clearBlank}` : label}
      accessibilityState={{ selected: active, disabled }}
      onPress={onPress}
      style={({ pressed }) => [styles.slot, common, pressed && styles.pressed]}>
      <Text style={[styles.slotText, { color: value ? theme.text : theme.codeComment }]}>{value || BLANK}</Text>
      {mark !== undefined && <Icon name={mark ? 'check' : 'close'} size={14} color={mark ? 'statusOk' : 'statusDanger'} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  code: { gap: Spacing.one, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three },
  line: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', minHeight: Typography.code.lineHeight },
  segment: { flexDirection: 'row', alignItems: 'center' },
  slot: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, minWidth: 64, minHeight: MinTouchSize - 8, justifyContent: 'center', paddingHorizontal: Spacing.two, marginVertical: 2, borderRadius: Radius.small, borderCurve: 'continuous', borderWidth: 1.5, borderStyle: 'dashed' },
  slotText: { fontFamily: Fonts.mono, fontSize: Typography.code.fontSize, fontWeight: 600 },
  slotInput: { fontFamily: Fonts.mono, fontSize: Typography.code.fontSize, padding: 0, textAlign: 'center', minHeight: MinTouchSize - 12 },
  bank: { gap: Spacing.two },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  word: { minHeight: MinTouchSize - 4, justifyContent: 'center', paddingHorizontal: Spacing.three, borderRadius: Radius.chip, borderCurve: 'continuous', borderWidth: 1.5 },
  wordText: { fontFamily: Fonts.mono, fontSize: Typography.code.fontSize, fontWeight: 600 },
  pressed: { opacity: 0.7 },
});
