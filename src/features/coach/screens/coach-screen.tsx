import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { HeaderActions } from '@/components/header-actions';
import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { GlassIconButton } from '@/components/ui/glass-icon-button';
import { HeaderControl } from '@/components/ui/header-control';
import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { getCourse } from '@/features/courses';
import { selectLearnerName } from '@/features/settings/settings-slice';
import { openPaywall, useAccess } from '@/features/store';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useAppSelector } from '@/store/hooks';

import { Composer } from '../components/composer';
import { MessageBubble } from '../components/message-bubble';
import { ThinkingBubble } from '../components/thinking-bubble';
import { useCoachChat, useCoachUsage } from '../hooks/use-coach';
import { suggestionKey } from '../lib/code-course';
import { focusFromParam, focusTitle, type CoachFocus } from '../lib/focus';
import { allModes, modeInfo } from '../lib/modes';
import { formatReturnTime } from '../lib/return-time';
import { coachStrings } from '../strings';

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * The Tali tab: pick what Tali helps with, then chat. A chat opened from elsewhere (a lesson's "Ask
 * Tali", a course's role, a reminder) arrives with `prompt`, `mode` or `chat` in the address.
 */
export function CoachScreen() {
  const params = useLocalSearchParams<{ prompt?: string; mode?: string; chat?: string; focus?: string }>();
  const requestedMode = first(params.mode);
  const [session, setSession] = useState(() => ({ key: 0, chatId: first(params.chat) ?? null, mode: modeInfo(requestedMode) ? (requestedMode as string) : 'general', prompt: first(params.prompt) ?? '', focus: focusFromParam(first(params.focus)) }));
  const strings = useLocalized(coachStrings);

  // "New chat" and a different kind of help start clean: what was open in a lesson belongs to the chat that began there.
  const startNew = (mode = session.mode) => setSession((current) => ({ key: current.key + 1, chatId: null, mode, prompt: '', focus: mode === current.mode ? current.focus : null }));

  // A new link (another prompt, mode or lesson) starts a new chat with it.
  const linkKey = `${first(params.prompt) ?? ''}|${requestedMode ?? ''}|${first(params.chat) ?? ''}|${first(params.focus) ?? ''}`;
  const [seenLink, setSeenLink] = useState(linkKey);
  if (linkKey !== seenLink) {
    setSeenLink(linkKey);
    setSession((current) => ({ key: current.key + 1, chatId: first(params.chat) ?? null, mode: modeInfo(requestedMode) ? (requestedMode as string) : current.mode, prompt: first(params.prompt) ?? '', focus: focusFromParam(first(params.focus)) }));
  }

  // History and New chat live in the sheet's header, to the right of the close X (owner, 2026-11-18). They are ONE header item with a small gap
  // between them: as two items the header put its own wide spacing between them and each carried its own padding (owner: "big gaps"). On iOS the
  // item hides the system's shared glass (the recipe of the X, `headerCloseOptions`), so each stays one round button; Android's SheetHeader draws the slot.
  const buttons = (
    <HeaderControl>
      <HeaderActions>
        <GlassIconButton icon="history" color="text" accessibilityLabel={strings.history} onPress={() => router.push('/coach-history')} />
        <GlassIconButton icon="add_comment" color="text" accessibilityLabel={strings.newChat} onPress={() => startNew()} />
      </HeaderActions>
    </HeaderControl>
  );
  const headerRight =
    process.env.EXPO_OS === 'ios'
      ? { unstable_headerRightItems: () => [{ type: 'custom' as const, element: buttons, hidesSharedBackground: true }] }
      : { headerRight: () => buttons };

  return (
    <>
      <Stack.Screen options={headerRight} />
      <ChatView key={session.key} chatId={session.chatId} mode={session.mode} prompt={session.prompt} focus={session.focus} onNewChat={startNew} />
    </>
  );
}

type ChatViewProps = { chatId: string | null; mode: string; prompt: string; focus: CoachFocus | null; onNewChat: (mode: string) => void };

function ChatView({ chatId, mode: initialMode, prompt, focus, onNewChat }: ChatViewProps) {
  const strings = useLocalized(coachStrings);
  const language = useLanguage();
  const name = useAppSelector(selectLearnerName);
  const chat = useCoachChat({ chatId, mode: initialMode, focus });
  const usage = useCoachUsage();
  const access = useAccess();
  const info = modeInfo(chat.mode, language);
  const roleCourse = info?.courseId ? getCourse(info.courseId) : null;
  const roleLocked = !!roleCourse && !access.owns(roleCourse.id);
  const quota = chat.quota ?? usage.data ?? null;
  const freeLeft = quota?.plan === 'free' ? quota.remaining : null;
  const limitReached = chat.error?.code === 'chat_limit' || (chat.turns.length === 0 && freeLeft === 0);
  const returnsAt = formatReturnTime(chat.error?.quota?.resetsAt ?? quota?.resetsAt ?? null, new Date(), strings);
  const started = chat.turns.length > 0;
  const online = useIsOnline();
  const about = focusTitle(focus);
  // A lesson, question, exercise or project that sent the learner here gets questions about it; otherwise the mode's own.
  const suggestions = (about && (strings.focusSuggestions[suggestionKey(focus, about.kind)] ?? strings.focusSuggestions[about.kind])) || strings.suggestions[chat.mode] || strings.suggestions.role;

  const footer = (
    <View style={styles.footer}>
      {quota?.plan === 'free' && !limitReached && (
        <View style={styles.allowance}>
          <ThemedText type="caption" themeColor="textSecondary">
            {strings.chatsLeft(quota.remaining, quota.limit)}
          </ThemedText>
          <Button title={strings.getMore} size="small" variant="ghost" onPress={() => void openPaywall('tali')} />
        </View>
      )}
      {!online && <OfflineNotice feature={strings.title} meanwhile={strings.offlineMeanwhile} />}
      {/* At the chat limit the limit card is the way forward, so there is no message box to type into (owner, 2026-11-16). */}
      {!limitReached && <Composer placeholder={strings.placeholder} sendLabel={strings.send} initialText={prompt} disabled={!online || chat.pending !== null || roleLocked} onSend={(text) => void chat.send(text)} />}
    </View>
  );

  return (
    <Screen footer={footer}>
      {!started && (
        <ChipSelect
          value={chat.mode}
          options={allModes(language).map((mode) => ({ value: mode.id, label: mode.label, icon: mode.icon as MaterialSymbolName }))}
          onChange={(mode) => onNewChat(mode)}
        />
      )}
      {!started && (
        <View style={styles.welcome}>
          <Tali size={208} mood="happy" tight />
          <ThemedText type="section" style={styles.center}>
            {strings.welcome(name.split(' ')[0] ?? '')}
          </ThemedText>
          {about && (
            <ThemedText type="secondarySemiBold" themeColor="primaryText" style={styles.center} numberOfLines={2}>
              {strings.focusChip[about.kind as keyof typeof strings.focusChip](about.title)}
            </ThemedText>
          )}
          {info && !about && (
            <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
              {info.description}
            </ThemedText>
          )}
          {!roleLocked && !limitReached && online && (
            <View style={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <Button key={suggestion} title={suggestion} variant="outline" size="small" onPress={() => void chat.send(suggestion)} />
              ))}
            </View>
          )}
          <ThemedText type="caption" themeColor="textTertiary" style={styles.center}>
            {strings.privacy}
          </ThemedText>
        </View>
      )}
      {roleLocked && roleCourse && info && (
        <Card>
          <ThemedText type="cardTitle">{strings.roleLockedTitle(info.label)}</ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.cardBody}>
            {strings.roleLockedBody(roleCourse.title)}
          </ThemedText>
          <Button title={strings.openCourse} onPress={() => router.push({ pathname: '/course/[id]', params: { id: roleCourse.id } })} />
        </Card>
      )}
      {chat.turns.map((turn, index) => (
        <MessageBubble key={index} role={turn.role} text={turn.text} />
      ))}
      {chat.pending !== null && <ThinkingBubble label={strings.thinking} />}
      {limitReached && (
        <Card>
          <View style={styles.limitHead}>
            <Tali size={96} mood="tired" />
            <ThemedText type="cardTitle" style={styles.flex}>
              {strings.limitTitle}
            </ThemedText>
          </View>
          <ThemedText type="body" themeColor="textSecondary" style={styles.cardBody}>
            {quota?.plan === 'pro' ? strings.fairUseBody(returnsAt) : strings.limitBody(returnsAt)}
          </ThemedText>
          {quota?.plan !== 'pro' && <Button title={strings.seeCourses} onPress={() => void openPaywall('tali')} />}
        </Card>
      )}
      {chat.error && chat.error.code !== 'chat_limit' && (
        <View style={styles.error}>
          <Notice tone={chat.error.code === 'network' ? 'info' : 'warning'} message={strings.errors[chat.error.code] ?? strings.errors.unknown} />
          {chat.error.code !== 'conversation_full' && chat.error.code !== 'course_required' && <Button title={strings.retry} variant="secondary" size="small" onPress={() => void chat.retry()} />}
          {chat.error.code === 'conversation_full' && <Button title={strings.newChat} variant="secondary" size="small" onPress={() => onNewChat(chat.mode)} />}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.one,
  },
  allowance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  welcome: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  center: {
    textAlign: 'center',
  },
  suggestions: {
    alignSelf: 'stretch',
    gap: Spacing.two,
  },
  limitHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  cardBody: {
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  error: {
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
});
