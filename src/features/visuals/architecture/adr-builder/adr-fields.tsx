import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { IconButton } from '@/components/ui/icon-button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { ADR_LIMITS, ADR_STATUSES, addOption, realOptions, removeOption, renameOption, type AdrDraft, type AdrOption } from '@/features/architecture/lib/adr';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { Panel } from '../../fundamentals/parts';
import { adrStrings } from '../../../architecture/adr/strings';
import { ListEditor } from './list-editor';

export type AdrFieldsProps = { draft: AdrDraft; onChange: (next: AdrDraft) => void };

/** The guided fields of a decision record, top to bottom in the order a reader meets them. Pure form: the checks and the Markdown are drawn elsewhere. */
export function AdrFields({ draft, onChange }: AdrFieldsProps) {
  const t = useLocalized(adrStrings);
  const set = (patch: Partial<AdrDraft>) => onChange({ ...draft, ...patch });
  const setOption = (index: number, patch: Partial<AdrOption>) => set({ options: draft.options.map((option, at) => (at === index ? { ...option, ...patch } : option)) });
  const named = realOptions(draft);
  const chosen = named.find((option) => option.name.trim().toLowerCase() === draft.decision.chosen.trim().toLowerCase())?.name ?? null;

  return (
    <View style={styles.stack}>
      <TextField label={t.titleLabel} value={draft.title} onChangeText={(title) => set({ title })} placeholder={t.titlePlaceholder} maxLength={ADR_LIMITS.title} />
      <ChipSelect wrap label={t.statusLabel} value={draft.status} onChange={(status) => set({ status })} options={ADR_STATUSES.map((status) => ({ value: status, label: t.status[status] }))} />
      <TextField label={t.dateLabel} value={draft.date} onChangeText={(date) => set({ date })} placeholder={t.datePlaceholder} maxLength={10} autoCorrect={false} autoCapitalize="none" />
      <TextField label={t.contextLabel} hint={t.contextHint} value={draft.context} onChangeText={(context) => set({ context })} multiline maxLength={ADR_LIMITS.context} />

      <Section title={t.driversLabel} hint={t.driversHint}>
        <ListEditor
          items={draft.drivers}
          onChange={(drivers) => set({ drivers })}
          max={ADR_LIMITS.drivers}
          itemMax={ADR_LIMITS.item}
          placeholder={t.driverPlaceholder}
          addLabel={t.driverAdd}
          itemLabel={(n) => t.itemLabel(t.driverItem, n)}
          removeLabel={(n) => t.removeItem(t.driverItem, n)}
        />
      </Section>

      <Section title={t.optionsLabel} hint={t.optionsHint}>
        {draft.options.map((option, index) => (
          <Panel key={index} label={t.optionNumber(index + 1)}>
            <View style={styles.optionHead}>
              <TextField
                style={styles.optionName}
                label={t.optionNameLabel(index + 1)}
                value={option.name}
                onChangeText={(name) => onChange(renameOption(draft, index, name))}
                placeholder={t.optionNamePlaceholder}
                maxLength={ADR_LIMITS.optionName}
              />
              {draft.options.length > ADR_LIMITS.options.min ? (
                <IconButton
                  icon="delete"
                  color="textSecondary"
                  background="backgroundSelected"
                  accessibilityLabel={t.optionRemove(index + 1)}
                  style={styles.optionRemove}
                  onPress={() => {
                    tapFeedback();
                    onChange(removeOption(draft, index));
                  }}
                />
              ) : null}
            </View>
            <ListEditor
              label={t.optionPros}
              items={option.pros}
              onChange={(pros) => setOption(index, { pros })}
              max={ADR_LIMITS.proscons}
              itemMax={ADR_LIMITS.item}
              placeholder={t.proPlaceholder}
              addLabel={t.proAdd}
              itemLabel={(n) => `${t.optionNumber(index + 1)}: ${t.itemLabel(t.proItem, n)}`}
              removeLabel={(n) => `${t.optionNumber(index + 1)}: ${t.removeItem(t.proItem, n)}`}
            />
            <ListEditor
              label={t.optionCons}
              items={option.cons}
              onChange={(cons) => setOption(index, { cons })}
              max={ADR_LIMITS.proscons}
              itemMax={ADR_LIMITS.item}
              placeholder={t.conPlaceholder}
              addLabel={t.conAdd}
              itemLabel={(n) => `${t.optionNumber(index + 1)}: ${t.itemLabel(t.conItem, n)}`}
              removeLabel={(n) => `${t.optionNumber(index + 1)}: ${t.removeItem(t.conItem, n)}`}
            />
          </Panel>
        ))}
        {draft.options.length < ADR_LIMITS.options.max ? (
          <Button
            size="small"
            variant="outline"
            icon="add"
            title={t.optionAdd}
            style={styles.add}
            onPress={() => {
              tapFeedback();
              onChange(addOption(draft));
            }}
          />
        ) : (
          <ThemedText type="secondary" themeColor="textSecondary">
            {t.optionsFull}
          </ThemedText>
        )}
      </Section>

      <Section title={t.decisionLabel}>
        {named.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">
            {t.decisionNeedOptions}
          </ThemedText>
        ) : (
          <ChipSelect wrap label={t.decisionChoose} value={chosen} onChange={(name) => set({ decision: { ...draft.decision, chosen: name } })} options={named.map((option) => ({ value: option.name, label: option.name }))} />
        )}
        <TextField label={t.reasonLabel} hint={t.reasonHint} value={draft.decision.reason} onChangeText={(reason) => set({ decision: { ...draft.decision, reason } })} multiline maxLength={ADR_LIMITS.reason} />
      </Section>

      <Section title={t.consequencesLabel}>
        <ListEditor
          label={t.goodLabel}
          items={draft.consequences.good}
          onChange={(good) => set({ consequences: { ...draft.consequences, good } })}
          max={ADR_LIMITS.consequences}
          itemMax={ADR_LIMITS.item}
          placeholder={t.goodPlaceholder}
          addLabel={t.goodAdd}
          itemLabel={(n) => t.itemLabel(t.goodItem, n)}
          removeLabel={(n) => t.removeItem(t.goodItem, n)}
        />
        <ListEditor
          label={t.badLabel}
          items={draft.consequences.bad}
          onChange={(bad) => set({ consequences: { ...draft.consequences, bad } })}
          max={ADR_LIMITS.consequences}
          itemMax={ADR_LIMITS.item}
          placeholder={t.badPlaceholder}
          addLabel={t.badAdd}
          itemLabel={(n) => t.itemLabel(t.badItem, n)}
          removeLabel={(n) => t.removeItem(t.badItem, n)}
        />
      </Section>

      <TextField label={t.notesLabel} hint={t.notesHint} value={draft.notes} onChangeText={(notes) => set({ notes })} multiline maxLength={ADR_LIMITS.notes} />
    </View>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {title}
      </ThemedText>
      {hint ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {hint}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  section: { gap: Spacing.two },
  optionHead: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  optionName: { flex: 1 },
  // Lines the remove button up with the name's box, under its label.
  optionRemove: { marginTop: Spacing.four - Spacing.half },
  add: { alignSelf: 'flex-start' },
});
