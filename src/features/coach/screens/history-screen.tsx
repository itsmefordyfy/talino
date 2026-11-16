import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { SwipeableRow } from '@/components/ui/swipeable-row';
import { Radius, Spacing } from '@/constants/theme';
import { emptyLine } from '@/features/companion/lib/messages';
import { useLanguage, useLocalized, useStrings } from '@/hooks/use-strings';
import { formatDate } from '@/lib/dates';

import { useChatList, useDeleteChat } from '../hooks/use-coach';
import { modeInfo } from '../lib/modes';
import { coachStrings } from '../strings';

/** Saved chats with Tali (on this phone only); open one to carry on, or delete it. */
export function CoachHistoryScreen() {
  const strings = useLocalized(coachStrings);
  const { common } = useStrings();
  const language = useLanguage();
  const chats = useChatList();
  const remove = useDeleteChat();
  if (chats.isPending) return <LoadingState />;
  if (chats.isError) return <ErrorState onRetry={() => void chats.refetch()} />;
  if (chats.data.length === 0) {
    return (
      <Screen>
        <EmptyState illustration={<Tali size={144} mood="curious" tight />} title={strings.emptyHistory} message={emptyLine('history', language).text} action={<Button title={strings.startChat} onPress={() => router.back()} />} />
      </Screen>
    );
  }
  // Swipe a chat left to reveal Delete (like iOS Mail); the question still comes first, since a deleted chat can't be brought back.
  return (
    <Screen>
      <View style={styles.list}>
        {chats.data.map((chat) => (
          <SwipeableRow
            key={chat.id}
            radius={Radius.card}
            removeLabel={strings.deleteChat}
            accessibilityLabel={chat.title}
            onRemove={() =>
              Alert.alert(strings.deleteChat, chat.title, [
                { text: common.cancel, style: 'cancel' },
                { text: strings.deleteChat, style: 'destructive', onPress: () => remove.mutate(chat.id) },
              ])
            }>
            <Card padded={false}>
              <ListRow
                title={chat.title}
                subtitle={`${modeInfo(chat.mode, language)?.label ?? ''} · ${formatDate(chat.updated_at.slice(0, 10))}`}
                icon="forum"
                onPress={() => router.dismissTo({ pathname: '/tali', params: { chat: chat.id } })}
              />
            </Card>
          </SwipeableRow>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
});
