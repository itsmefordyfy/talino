import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';

import type { ActivitySession } from '../hooks/use-activity-session';
import { useActivityDraft } from '../lib/draft';
import type { ScenarioActivity } from '../types';
import { ActivityFrame, CheckBar } from './activity-frame';
import { ChoiceCard, type ChoiceState } from './choice-card';
import { RichText } from './rich-text';

export type ScenarioViewProps = { activity: ScenarioActivity; session: ActivitySession };

/** A situation and a few things you could do. Each choice has its own consequence; one is the best. */
export function ScenarioView({ activity, session }: ScenarioViewProps) {
  const { text, done } = session;
  // Kept while the app is open: going back to the lesson and returning leaves the choice and the options already tried as they were.
  const [picked, setPicked] = useActivityDraft<number | null>(activity.id, 'picked', null);
  // Options already tried keep their consequence on screen and stay closed, so each try is a new choice.
  const [tried, setTried] = useActivityDraft<number[]>(activity.id, 'tried', []);

  return (
    <ActivityFrame session={session}>
      <Card tone="backgroundSelected" accessibilityLabel={`${text.situation}. ${activity.situation}`}>
        <ThemedText type="caption" themeColor="textSecondary">
          {text.situation}
        </ThemedText>
        <RichText type="body" text={activity.situation} />
      </Card>
      <View style={styles.options} accessibilityRole="radiogroup">
        {activity.options.map((option, index) => {
          const isTried = tried.includes(index) || (done && index === picked);
          // A tried option shows how it went (strong, reasonable, trouble); an untried pick is just chosen.
          const state: ChoiceState = isTried ? (option.quality === 'best' ? 'correct' : option.quality === 'acceptable' ? 'partial' : 'incorrect') : picked === index ? 'selected' : 'idle';
          return (
            <ChoiceCard
              key={index}
              title={option.text}
              detail={isTried ? option.consequence : undefined}
              mode="single"
              state={state}
              disabled={done || (tried.includes(index) && picked !== index)}
              muted={tried.includes(index) && picked !== index && !done}
              onPress={() => setPicked(index)}
            />
          );
        })}
      </View>
      <CheckBar
        session={session}
        label={text.decide}
        canCheck={picked !== null}
        onCheck={() => {
          if (picked === null) return;
          setTried((current) => (current.includes(picked) ? current : [...current, picked]));
          void session.check({ kind: 'scenario', option: picked });
        }}
        onRetry={() => setPicked(null)}
      />
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  options: { gap: Spacing.two },
});
