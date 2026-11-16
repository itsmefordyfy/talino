import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { FormActions } from '@/components/ui/form-actions';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { FEEDBACK_EMAIL } from '@/constants/support';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { successFeedback, tapFeedback } from '@/lib/haptics';
import { closeScreen } from '@/lib/navigation';

import { PhotoAttachments } from '../components/photo-attachments';
import { addPhotos, FEEDBACK_KINDS, FEEDBACK_MAX_MESSAGE, FEEDBACK_MAX_PHOTOS, feedbackProblems, type FeedbackKind } from '../feedback';
import { useSendFeedback } from '../hooks/use-send-feedback';
import { pickPhotos } from '../lib/pick-photos';
import { feedbackStrings } from '../strings';

/** The countdown shows only near the end, so a short note isn't watched by a number. */
const COUNT_FROM = FEEDBACK_MAX_MESSAGE - 200;

/**
 * Send feedback: its type, the message and screenshots if they help, then the phone's mail app opens with it
 * all filled in (the screenshots attached), addressed to support, plus the app version and phone to trace a bug. Talino sends nothing itself.
 */
export function FeedbackScreen() {
  const f = useLocalized(feedbackStrings);
  const { send, sending } = useSendFeedback();
  const [kind, setKind] = useState<FeedbackKind>('bug');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  // Problems show after the first Submit, then follow the typing.
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);

  const problems = tried ? feedbackProblems(message) : [];
  const messageError = problems.includes('message_missing') ? f.messageMissing : problems.includes('message_long') ? f.messageLong(FEEDBACK_MAX_MESSAGE) : null;

  const submit = async () => {
    tapFeedback();
    setTried(true);
    if (feedbackProblems(message).length > 0) return;
    const result = await send({ kind, message: message.trim(), photos });
    // No mail app: the form stays as written, for another try.
    if (result !== 'sent') return;
    successFeedback();
    setSent(true);
  };

  const left = FEEDBACK_MAX_MESSAGE - message.trim().length;

  const add = async () => {
    const picked = await pickPhotos(FEEDBACK_MAX_PHOTOS - photos.length);
    setPhotos((current) => addPhotos(current, picked, FEEDBACK_MAX_PHOTOS));
  };

  return (
    <Screen
      footer={
        <FormActions>
          {sent ? <Button title={f.done} icon="check" onPress={closeScreen} /> : <Button title={f.submit} icon="mail" loading={sending} disabled={sending} onPress={() => void submit()} />}
        </FormActions>
      }>
      {sent && <Notice tone="success" message={f.handedToMail} />}
      <ThemedText type="secondary" themeColor="textSecondary">
        {f.intro}
      </ThemedText>
      <ChipSelect label={f.type} options={FEEDBACK_KINDS.map((value) => ({ value, label: f.kinds[value] }))} value={kind} onChange={setKind} />
      <TextField
        label={f.message}
        value={message}
        onChangeText={setMessage}
        placeholder={f.placeholders[kind]}
        multiline
        maxLength={FEEDBACK_MAX_MESSAGE}
        error={messageError}
        hint={messageError ? undefined : message.trim().length >= COUNT_FROM ? f.charactersLeft(Math.max(0, left)) : undefined}
      />
      <View style={styles.field}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {f.photos}
        </ThemedText>
        <PhotoAttachments uris={photos} max={FEEDBACK_MAX_PHOTOS} onAdd={() => void add()} onRemove={(uri) => setPhotos((current) => current.filter((photo) => photo !== uri))} />
      </View>
      <ThemedText type="caption" themeColor="textTertiary" style={styles.footnote}>
        {f.whatsSent(FEEDBACK_EMAIL)}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  footnote: {
    paddingHorizontal: Spacing.one,
  },
});
