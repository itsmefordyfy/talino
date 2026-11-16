import { requireOptionalNativeModule } from 'expo';
import * as Device from 'expo-device';
import { useRef, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';

import { FEEDBACK_EMAIL } from '@/constants/support';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { appVersion } from '@/lib/app-version';

import { feedbackEmail, feedbackMailto, type DeviceDetails, type Feedback } from '../feedback';
import { feedbackStrings } from '../strings';

/**
 * expo-mail-composer's native code. A build made before it was added doesn't have it, and importing it there throws, so it is only loaded once
 * it is known to be there; until then the mail app opens by link and cannot carry photos.
 */
const hasMailComposer = requireOptionalNativeModule('ExpoMailComposer') !== null;

/** `sent`: handed to the mail app (it can't tell whether Send was pressed). `cancelled`: the learner backed out, or one was already opening. `failed`: no mail app. */
export type FeedbackResult = 'sent' | 'cancelled' | 'failed';

function deviceDetails(): DeviceDetails {
  return { appVersion: appVersion(), system: `${Platform.OS === 'ios' ? 'iOS' : 'Android'} ${Device.osVersion ?? ''}`.trim(), model: Device.modelName };
}

const confirm = (title: string, message: string, action: string, cancel: string) =>
  new Promise<boolean>((resolve) =>
    Alert.alert(title, message, [
      { text: cancel, style: 'cancel', onPress: () => resolve(false) },
      { text: action, onPress: () => resolve(true) },
    ]),
  );

/**
 * Opens the phone's mail composer with the feedback filled in, addressed to support, and the screenshots attached: the learner checks and sends it
 * from there, so nothing leaves Talino unseen and no server or key is involved (as in CarMind). Where the composer isn't available (no mail account
 * set up in Mail, or a build made before expo-mail-composer was added) the mail app opens by link, which can't carry attachments, so the learner is
 * told before the photos are left behind. Without any mail app, the learner gets the address. One at a time: a second tap while the mail app opens
 * does nothing.
 */
export function useSendFeedback() {
  const strings = useLocalized(feedbackStrings);
  const language = useLanguage();
  const [sending, setSending] = useState(false);
  const busy = useRef(false);

  const send = async (feedback: Feedback): Promise<FeedbackResult> => {
    if (busy.current) return 'cancelled';
    busy.current = true;
    setSending(true);
    try {
      const email = feedbackEmail(feedback, deviceDetails(), language, new Date());
      const photos = feedback.photos ?? [];
      const MailComposer = hasMailComposer ? await import('expo-mail-composer') : null;
      if (MailComposer && (await MailComposer.isAvailableAsync())) {
        const { status } = await MailComposer.composeAsync({ recipients: [FEEDBACK_EMAIL], subject: email.subject, body: email.body, attachments: [...photos] });
        return status === MailComposer.MailComposerStatus.CANCELLED ? 'cancelled' : 'sent';
      }
      if (photos.length > 0 && !(await confirm(strings.cantAttachTitle, MailComposer ? strings.cantAttachNoMail : strings.cantAttachOld, strings.openMail, strings.cancel))) return 'cancelled';
      await Linking.openURL(feedbackMailto(FEEDBACK_EMAIL, email));
      return 'sent';
    } catch {
      // No mail app at all: the address, so the learner can write from anywhere.
      Alert.alert(strings.noMailTitle, strings.noMail(FEEDBACK_EMAIL));
      return 'failed';
    } finally {
      busy.current = false;
      setSending(false);
    }
  };

  return { send, sending };
}
