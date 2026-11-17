import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { ListRow } from '@/components/ui/list-row';
import { Section } from '@/components/ui/section';
import { Spacing } from '@/constants/theme';
import { activeLocale } from '@/lib/i18n';

import type { SessionSummary } from '../api/practice-repo';
import type { PracticeText } from '../strings';

export type HistoryListProps = {
  items: readonly SessionSummary[];
  text: PracticeText;
  /** The try whose detail is open under the list, if any. */
  openId: string | null;
  onOpen: (id: string | null) => void;
  onRemove: (id: string) => void;
};

/** "Mar 5, 3:20 PM" in the learner's locale. */
export function formatWhen(iso: string): string {
  const when = new Date(iso);
  if (!Number.isFinite(when.getTime())) return '';
  return `${when.toLocaleDateString(activeLocale(), { month: 'short', day: 'numeric' })}, ${when.toLocaleTimeString(activeLocale(), { hour: 'numeric', minute: '2-digit' })}`;
}

/**
 * The learner's earlier tries at this item, newest first: which try, its score in words, when, and how many turns. Opening one shows its
 * transcript and feedback under the list (the parent draws it). Everything is kept on this phone; nothing here is synced.
 */
export function HistoryList({ items, text, openId, onOpen, onRemove }: HistoryListProps) {
  return (
    <Section title={text.ui.historyTitle}>
      {items.length === 0 ? (
        <Card>
          <ThemedText type="secondary" themeColor="textSecondary">
            {text.ui.historyEmpty}
          </ThemedText>
        </Card>
      ) : (
        <Card padded={false}>
          {items.map((item, index) => {
            const open = item.id === openId;
            const score = item.score === null ? text.ui.historyNoScore : text.ui.historyScore(item.score);
            const parts = [formatWhen(item.startedAt), item.kind === 'roleplay' ? text.ui.historyTurns(item.turns) : item.kind === 'prompt-lab' ? text.lab.historyPrompts(item.turns) : null, text.ui.historyStatus[item.status]].filter(Boolean);
            return (
              <View key={item.id}>
                {index > 0 && <Divider />}
                <ListRow
                  title={`${text.ui.historyAttempt(item.attempt)} · ${score}`}
                  subtitle={parts.join(' · ')}
                  icon={item.kind === 'roleplay' ? 'forum' : item.kind === 'prompt-lab' ? 'experiment' : 'edit_note'}
                  onPress={() => onOpen(open ? null : item.id)}
                  accessibilityLabel={`${text.ui.historyAttempt(item.attempt)}, ${score}, ${parts.join(', ')}`}
                  selected={open}
                  trailing={<ThemedText type="secondarySemiBold" themeColor="primaryText">{open ? text.ui.historyClose : text.ui.historyOpen}</ThemedText>}
                  showChevron={false}
                />
                {open && (
                  <View style={styles.remove}>
                    <Button title={text.ui.historyDelete} icon="delete" size="small" variant="ghost" onPress={() => onRemove(item.id)} />
                  </View>
                )}
              </View>
            );
          })}
        </Card>
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  remove: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.two, alignItems: 'flex-start' },
});
