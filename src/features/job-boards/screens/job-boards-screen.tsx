import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';

import { BoardLogo } from '../components/board-logo';
import { boardsIn, GROUP_TONES, JOB_GROUPS, type JobBoard, type JobGroup } from '../content';
import { jobBoardStrings } from '../strings';

type Filter = JobGroup | 'all';

/** Where to look for work: tech, Philippine, remote and freelance boards, each opening in the in-app browser with a few tips on how to get hired there. */
export function JobBoardsScreen() {
  const strings = useLocalized(jobBoardStrings);
  const [filter, setFilter] = useState<Filter>('all');
  const [failed, setFailed] = useState(false);
  const groups = filter === 'all' ? JOB_GROUPS : JOB_GROUPS.filter((group) => group === filter);
  const options = [{ value: 'all' as const, label: strings.groups.all }, ...JOB_GROUPS.map((group) => ({ value: group, label: strings.groups[group], tone: GROUP_TONES[group] }))];

  const open = async (board: JobBoard) => {
    tapFeedback();
    setFailed(false);
    try {
      await WebBrowser.openBrowserAsync(board.url);
    } catch (error) {
      reportError(error, 'career', { step: 'job-board', board: board.id });
      setFailed(true);
    }
  };

  return (
    <Screen>
      <View style={styles.intro}>
        <ThemedText type="title" accessibilityRole="header">
          {strings.headline}
        </ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          {strings.intro}
        </ThemedText>
      </View>
      <ChipSelect<Filter> options={options} value={filter} onChange={setFilter} />
      {failed && <Notice tone="warning" message={strings.openError} />}
      {groups.map((group) => {
        const boards = boardsIn(group);
        return (
          <Section key={group} title={strings.groupTitles[group]} actionLabel={strings.count(boards.length)}>
            <View style={styles.list}>
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} onOpen={() => void open(board)} />
              ))}
            </View>
          </Section>
        );
      })}
      <Notice tone="info" message={strings.caution} />
    </Screen>
  );
}

function BoardCard({ board, onOpen }: { board: JobBoard; onOpen: () => void }) {
  const strings = useLocalized(jobBoardStrings);
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <Card>
      <View style={styles.row}>
        <BoardLogo boardId={board.id} />
        <View style={styles.text}>
          <ThemedText type="cardTitle">{board.name}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {board.blurb}
          </ThemedText>
        </View>
        <IconButton icon="open_in_new" accessibilityLabel={strings.open(board.name)} onPress={onOpen} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={expanded ? strings.hideStrategy : `${strings.strategy}: ${board.name}`}
        onPress={() => {
          tapFeedback();
          setExpanded((value) => !value);
        }}
        style={[styles.strategyRow, { borderTopColor: theme.border }]}>
        <ThemedText type="secondarySemiBold" themeColor="primaryText">
          {strings.strategy}
        </ThemedText>
        <Icon name={expanded ? 'expand_less' : 'expand_more'} size={22} color="primaryText" />
      </Pressable>
      {expanded && (
        <View style={styles.tips}>
          {board.note && (
            <ThemedText type="secondarySemiBold" themeColor="textSecondary">
              {board.note}
            </ThemedText>
          )}
          {board.strategy.map((tip) => (
            <View key={tip} style={styles.tip}>
              <Icon name="check" size={18} color="primaryText" />
              <ThemedText type="secondary" style={styles.tipText}>
                {tip}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  strategyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tips: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  tip: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
  },
});
