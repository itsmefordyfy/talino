import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { PayloadBox, stableSteps } from '../../diagrams';
import { StepControls } from '../../components/step-controls';
import { useStepper } from '../../components/use-stepper';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { buildGeneration, PROMPT_IDS, type GenStep, type PromptId } from '../lib/next-token';
import { visibleToken } from '../lib/tokenizer';
import { aiStrings } from '../strings';
import { StageStrip } from './stage-strip';
import { TokenChips } from './token-chips';

type TempKey = '0.2' | '0.7' | '1.5';
const TEMPS: readonly TempKey[] = ['0.2', '0.7', '1.5'];

/** A piece of text as a person reads it: no dot for the space, and punctuation named ("." is a full stop). */
function plainPiece(token: string, names: Record<string, string>): { word: string; name: string | null } {
  const word = token.trim();
  return { word, name: names[word] ?? null };
}

function stageOf(step: GenStep): number {
  switch (step.kind) {
    case 'input': return 0;
    case 'tokens': return 1;
    case 'model': return 2;
    case 'predict': return 3;
    case 'output': return 4;
  }
}

/** Text in, tokens, the model, probabilities for the next token, one pick at a time, text out: a simplified illustration with fixed numbers. */
export function ModelIoVisual({ compact }: VisualProps) {
  const all = useLocalized(aiStrings);
  const s = all.modelIo;
  const theme = useTheme();
  const [prompt, setPrompt] = useState<PromptId>('sky');
  const [temp, setTemp] = useState<TempKey>('0.7');
  const [seed, setSeed] = useState(1);
  const steps = stableSteps(s, `${prompt}:${temp}:${seed}`, () => buildGeneration(prompt, Number(temp), seed));
  const stepper = useStepper(steps, { intervalMs: 1500 });
  const step = stepper.step;
  const predictNumber = steps.slice(0, stepper.index + 1).filter((item) => item.kind === 'predict').length;

  let caption: string;
  switch (step.kind) {
    case 'input': caption = s.captions.input; break;
    case 'tokens': caption = s.captions.tokens(step.tokens.length); break;
    case 'model': caption = s.captions.model; break;
    case 'predict': {
      const picked = step.candidates[step.chosen];
      caption = s.captions.predict(plainPiece(picked.token, s.punctuation).word, picked.p, predictNumber);
      break;
    }
    case 'output': caption = s.captions.output(step.tokenCount); break;
  }

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.stack}>
          <ChipSelect label={s.promptLabel} wrap value={prompt} onChange={setPrompt} options={PROMPT_IDS.map((id) => ({ value: id, label: s.prompts[id] }))} />
          <ChipSelect label={s.temperatureLabel} wrap value={temp} onChange={setTemp} options={TEMPS.map((key) => ({ value: key, label: s.temperatures[key] }))} />
          <ThemedText type="caption" themeColor="textSecondary">
            {s.temperatureNote[temp]}
          </ThemedText>
          <View style={styles.row}>
            <Button
              title={s.roll}
              icon="casino"
              size="small"
              variant="secondary"
              onPress={() => {
                tapFeedback();
                setSeed(seed + 1);
              }}
            />
          </View>
          <StepControls stepper={stepper} />
        </View>
      }>
      <View style={styles.stack}>
        <StageStrip stages={s.stages} active={stageOf(step)} describe={s.stageLabel} />
        {step.kind === 'input' && <PayloadBox title={s.inputTitle} lines={[step.text]} />}
        {step.kind === 'tokens' && (
          <View style={styles.stack}>
            <ThemedText type="secondarySemiBold">{s.tokensTitle}</ThemedText>
            <TokenChips tokens={step.tokens} describe={(token) => `${visibleToken(token.text)}, ${token.id}`} />
            <ThemedText type="caption" themeColor="textSecondary">
              {s.spaceNote}
            </ThemedText>
          </View>
        )}
        {step.kind === 'model' && <PayloadBox title={s.modelBox} lines={[]} tone="info" />}
        {step.kind === 'predict' && (
          <View style={styles.stack}>
            <ThemedText type="secondarySemiBold">{s.candidatesTitle}</ThemedText>
            <ThemedText type="body">
              <ThemedText type="secondary" themeColor="textSecondary">{`${s.soFar} `}</ThemedText>
              {`${s.prompts[prompt]}${step.generated}`}
              <ThemedText type="body" themeColor="primary">{' ▌'}</ThemedText>
            </ThemedText>
            {step.candidates.map((candidate, index) => {
              const on = index === step.chosen;
              const piece = plainPiece(candidate.token, s.punctuation);
              return (
                <View key={candidate.token} accessible accessibilityLabel={`${piece.name ?? piece.word}, ${Math.round(candidate.p * 100)} percent${on ? `, ${s.picked}` : ''}`} style={styles.candidate}>
                  <View style={styles.token}>
                    <ThemedText type={on ? 'bodySemiBold' : 'body'}>{piece.word}</ThemedText>
                    {piece.name && (
                      <ThemedText type="caption" themeColor="textSecondary">
                        {piece.name}
                      </ThemedText>
                    )}
                  </View>
                  <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
                    <View style={[styles.fill, { width: `${Math.max(2, candidate.p * 100)}%`, backgroundColor: on ? theme.primary : theme.textTertiary }]} />
                  </View>
                  <ThemedText type={on ? 'secondarySemiBold' : 'secondary'} tabular style={styles.percent}>
                    {`${Math.round(candidate.p * 100)}%`}
                  </ThemedText>
                  {on && (
                    <ThemedText type="caption" themeColor="primary">
                      {`✓ ${s.picked}`}
                    </ThemedText>
                  )}
                </View>
              );
            })}
            <ThemedText type="caption" themeColor="textSecondary">
              {s.legend}
            </ThemedText>
            <ThemedText type="secondary">
              {(() => {
                const chosen = step.candidates[step.chosen];
                const piece = plainPiece(chosen.token, s.punctuation);
                const top = step.candidates.every((candidate) => candidate.p <= chosen.p);
                return s.spinNote(piece.name ? `${piece.word} (${piece.name})` : piece.word, chosen.p, top);
              })()}
            </ThemedText>
          </View>
        )}
        {step.kind === 'output' && <PayloadBox title={s.outputTitle} lines={[step.text]} tone="ok" />}
        <ThemedText type="caption" themeColor="textSecondary">
          {all.illustration}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two + 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  candidate: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  token: { width: 86 },
  track: { flex: 1, height: 10, borderRadius: Radius.pill, overflow: 'hidden' },
  fill: { height: 10, borderRadius: Radius.pill },
  percent: { width: 38, textAlign: 'right' },
});
