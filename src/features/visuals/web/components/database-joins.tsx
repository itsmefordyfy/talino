import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipSelect } from '@/components/ui/chip-select';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { PayloadBox, stableSteps } from '../../diagrams';
import { StepControls } from '../../components/step-controls';
import { useStepper } from '../../components/use-stepper';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { buildJoinSteps, DB, describeJoinStep, PLANS, sqlFor, type JoinType, type Relation, type Table } from '../lib/joins';
import { webStrings } from '../strings';
import { MiniTable } from './mini-table';

const RELATIONS: readonly Relation[] = ['one-to-many', 'many-to-many'];
const JOIN_TYPES: readonly JoinType[] = ['inner', 'left'];

function rowsOf(table: Table) {
  return table.rows.map((row) => table.columns.map((column) => row[column.name] ?? null));
}

/** Tables with their keys, and a JOIN run for real one row at a time: matches light up, the result grows. */
export function DatabaseJoinsVisual({ compact }: VisualProps) {
  const s = useLocalized(webStrings).db;
  const [relation, setRelation] = useState<Relation>('one-to-many');
  const [type, setType] = useState<JoinType>('inner');
  const plan = PLANS[relation];
  const steps = stableSteps(s, `${relation}:${type}`, () => buildJoinSteps(plan, type));
  const stepper = useStepper(steps, { intervalMs: 1400 });
  const step = stepper.step;
  const resultColumns = plan.select.map((name) => ({ name }));

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={`${describeJoinStep(step, plan, type, s.step)} ${stepper.index === 0 ? s.notes[relation] : ''}`.trim()}
      controls={
        <View style={styles.stack}>
          <ChipSelect label={s.relationLabel} wrap value={relation} onChange={setRelation} options={RELATIONS.map((value) => ({ value, label: s.relations[value] }))} />
          <ChipSelect label={s.joinLabel} wrap value={type} onChange={setType} options={JOIN_TYPES.map((value) => ({ value, label: s.joins[value] }))} />
          <StepControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stack}>
        {plan.tables.map((name) => (
          <MiniTable key={name} title={name} columns={DB[name].columns} rows={rowsOf(DB[name])} highlight={step.active[name] ?? []} nullText={s.nullText} />
        ))}
        <PayloadBox title={s.sqlTitle} lines={sqlFor(plan, type)} tone="info" />
        <MiniTable title={s.resultTitle} columns={resultColumns} rows={step.result} nullText={s.nullText} emptyText={s.resultEmpty} />
        <ThemedText type="caption" themeColor="textSecondary">
          {s.keyLegend}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
});
