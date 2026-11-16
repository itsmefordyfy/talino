import { useState } from 'react';

import { ChipSelect } from '@/components/ui/chip-select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ThemedText } from '@/components/themed-text';
import { useLocalized } from '@/hooks/use-strings';
import { View } from 'react-native';
import { Spacing } from '@/constants/theme';

import { PayloadBox, stableSteps, stableValue, StagedVisual } from '../../diagrams';
import type { VisualProps } from '../../types';
import { QUESTION_IDS, type QuestionId } from '../lib/rag';
import { aiStrings } from '../strings';
import { buildRagSteps, KB_LINES, ragSpec } from '../lib/workflows';

type Retrieval = 'on' | 'off';

/** RAG: question, embed, search, retrieve, prompt, model, grounded answer. Retrieval can be switched off to compare with a guess. */
export function RagVisual({ compact }: VisualProps) {
  const all = useLocalized(aiStrings);
  const s = all.rag;
  const [question, setQuestion] = useState<QuestionId>('returns');
  const [retrieval, setRetrieval] = useState<Retrieval>('on');
  const steps = stableSteps(s, `${question}:${retrieval}`, () => buildRagSteps(question, retrieval === 'on', s));
  const spec = stableValue(s, 'spec', () => ragSpec(s));
  return (
    <StagedVisual
      title={s.title}
      description={s.description}
      compact={compact}
      spec={spec}
      steps={steps}
      intervalMs={1800}
      options={
        <View style={{ gap: Spacing.three }}>
          <ChipSelect label={s.questionLabel} wrap value={question} onChange={setQuestion} options={QUESTION_IDS.map((id) => ({ value: id, label: s.questions[id] }))} />
          <View style={{ gap: Spacing.one }}>
            <ThemedText type="secondarySemiBold">{s.retrievalLabel}</ThemedText>
            <SegmentedControl accessibilityLabel={s.retrievalLabel} value={retrieval} onChange={setRetrieval} options={[{ value: 'on', label: s.retrieval.on }, { value: 'off', label: s.retrieval.off }]} />
          </View>
        </View>
      }
      extra={
        compact ? null : (
          <View style={{ gap: Spacing.two }}>
            <PayloadBox title={s.kbTitle} lines={KB_LINES} />
            <ThemedText type="caption" themeColor="textSecondary">
              {all.illustration}
            </ThemedText>
          </View>
        )
      }
    />
  );
}
