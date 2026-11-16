import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { SettingsGroup } from '@/components/ui/settings-group';
import { IconTileSize, Spacing } from '@/constants/theme';
import { formatDate, formatTime, toISODate, toTimeString } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';

import type { ComingUpItem } from '../lib/overview';
import { openPractice } from '../lib/practice-route';
import type { CareerStrings } from '../strings';

export type ComingUpListProps = {
  items: readonly ComingUpItem[];
  strings: CareerStrings;
};

const SHORT_DATE: Intl.DateTimeFormatOptions = { weekday: 'short', year: undefined };

export function interviewWhen(at: string, strings: CareerStrings): string {
  const date = new Date(at);
  return strings.interviewWhen(formatDate(toISODate(date), SHORT_DATE), formatTime(toTimeString(date)));
}

/** Follow-ups due and interviews ahead; an interview offers a practice run with Tali. */
export function ComingUpList({ items, strings }: ComingUpListProps) {
  const open = (id: string) => router.push({ pathname: '/career/application/[id]', params: { id } });
  return (
    <SettingsGroup>
      {items.map((item) =>
        item.type === 'interview' ? (
          // The practice button sits under the row, not inside it: a pressable row is one element
          // to screen readers, which would hide a button nested in it.
          <View key={`interview-${item.application.id}`}>
            <ListRow
              icon="event"
              tone="violet"
              title={strings.interviewRow(item.application.company, item.application.kind)}
              subtitle={`${item.application.title} · ${interviewWhen(item.at, strings)}`}
              onPress={() => open(item.application.id)}
            />
            <View style={styles.action}>
              <Button
                title={strings.practise}
                icon="record_voice_over"
                variant="secondary"
                size="small"
                material="solid"
                onPress={() => {
                  tapFeedback();
                  openPractice(item.application, strings);
                }}
              />
            </View>
          </View>
        ) : (
          <ListRow
            key={`follow-up-${item.application.id}`}
            icon="send"
            tone={item.overdue ? 'red' : 'teal'}
            title={strings.followUpRow(item.application.company)}
            subtitle={`${item.application.title} · ${item.overdue ? strings.followUpOverdue(formatDate(item.day, SHORT_DATE)) : strings.followUpDue(formatDate(item.day, SHORT_DATE))}`}
            onPress={() => open(item.application.id)}
          />
        ),
      )}
    </SettingsGroup>
  );
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    // Lined up with the row's text: the row's padding, its icon and the gap after it.
    paddingLeft: Spacing.three + IconTileSize - 4 + Spacing.three,
    paddingRight: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
