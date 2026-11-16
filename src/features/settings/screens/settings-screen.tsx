import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SettingsGroup } from '@/components/ui/settings-group';
import { TimeField } from '@/components/ui/time-field';
import { Toggle } from '@/components/ui/toggle';
import { Spacing } from '@/constants/theme';
import { useDbMutation } from '@/db/use-db-mutation';
import { backupStrings, clearLocalSnapshots, createBackupContext } from '@/features/backup';
import { useDemoData } from '@/features/demo';
import { demoStrings } from '@/features/demo/strings';
import { CompanionPicker } from '@/features/companion/components/companion-picker';
import { requestNotificationPermission } from '@/features/notifications';
import { feedbackStrings } from '@/features/feedback';
import { onboardingStrings } from '@/features/onboarding';
import { whatsNewStrings } from '@/features/whats-new/strings';
import { PlanCard, useMockStoreControls } from '@/features/store';
import { useLocalized } from '@/hooks/use-strings';
import { appVersion } from '@/lib/app-version';
import { openFacebookPage, openLegalPage } from '@/lib/legal';
import { tapFeedback } from '@/lib/haptics';
import type { AppearancePreference } from '@/lib/appearance';
import { isLanguage, LANGUAGE_LABELS, SHOWN_LANGUAGES } from '@/lib/i18n';
import { parseTime } from '@/lib/dates';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { deleteAllData } from '../api/reset';
import { aboutStrings } from '../about-strings';
import { openStoreReview, storeReviewUrl } from '../lib/store-review';
import {
  appearanceChanged,
  careerRemindersToggled,
  dailyReminderTimeChanged,
  dailyReminderToggled,
  languageChanged,
  selectLanguage,
  selectAppearance,
  selectCareerReminders,
  selectDailyReminder,
  selectDailyReminderTime,
  selectSpeechRate,
  settingsReset,
  devUnlockAllToggled,
  selectDevUnlockAll,
  speechRateChanged,
} from '../settings-slice';
import { settingsStrings } from '../strings';

const pad = (value: number) => String(value).padStart(2, '0');
export function SettingsScreen() {
  const strings = useLocalized(settingsStrings);
  const learningProfile = useLocalized(onboardingStrings);
  const backup = useLocalized(backupStrings);
  const about = useLocalized(aboutStrings);
  const whatsNew = useLocalized(whatsNewStrings);
  const feedback = useLocalized(feedbackStrings);
  // Null until the store page is set in app.json, and in a build without the review module: the row hides.
  const reviewUrl = storeReviewUrl();
  const db = useSQLiteContext();
  const dispatch = useAppDispatch();
  const unlockAll = useAppSelector(selectDevUnlockAll);
  const daily = useAppSelector(selectDailyReminder);
  const time = useAppSelector(selectDailyReminderTime);
  const career = useAppSelector(selectCareerReminders);
  const appearance = useAppSelector(selectAppearance);
  const language = useAppSelector(selectLanguage);
  const rate = useAppSelector(selectSpeechRate);
  const mock = useMockStoreControls();
  const demo = useDemoData();
  const demoText = useLocalized(demoStrings);
  const wipe = useDbMutation((database) => deleteAllData(database));
  const [notice, setNotice] = useState<string | null>(null);

  const turnOn = async (on: boolean, apply: (value: boolean) => void) => {
    if (!on) {
      apply(false);
      return;
    }
    const granted = await requestNotificationPermission();
    apply(granted);
    if (!granted) setNotice(strings.remindersOff);
  };

  const confirmDelete = () =>
    Alert.alert(strings.deleteTitle, strings.deleteBody, [
      { text: strings.cancel, style: 'cancel' },
      {
        text: strings.delete,
        style: 'destructive',
        onPress: async () => {
          await wipe.mutateAsync();
          // The snapshots on the phone are the learner's data too (and Android's own backup would carry them back).
          await clearLocalSnapshots(createBackupContext(db)).catch(() => undefined);
          await Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);
          dispatch(settingsReset());
          router.replace('/');
        },
      },
    ]);

  return (
    <Screen>
      {notice && <Notice tone="info" message={notice} />}
      {/* The plan card leads, as CarMind's: the upgrade card on Free, the plan and Manage for a subscriber. */}
      <PlanCard />

      {/* Only when there is a language to choose: Tagalog is switched off for now (`TAGALOG_ENABLED`). */}
      {SHOWN_LANGUAGES.length > 1 && (
        <SettingsGroup title={strings.language} footer={strings.languageFooter}>
          <View style={styles.padded}>
            <SegmentedControl
              accessibilityLabel={strings.language}
              value={language}
              options={SHOWN_LANGUAGES.map((code) => ({ value: code, label: LANGUAGE_LABELS[code] }))}
              onChange={(value) => {
                if (isLanguage(value)) dispatch(languageChanged(value));
              }}
            />
          </View>
        </SettingsGroup>
      )}

      <SettingsGroup title={strings.coach}>
        <View style={styles.padded}>
          <CompanionPicker />
        </View>
      </SettingsGroup>

      <SettingsGroup title={strings.learning}>
        <ListRow title={learningProfile.settingsRow} subtitle={learningProfile.settingsRowDetail} icon="tune" onPress={() => router.push('/learning-profile')} />
        <ListRow title={learningProfile.seeFullPlan} icon="route" onPress={() => router.push('/my-plan')} />
        <ListRow title={strings.dailyReminder} icon="notifications" trailing={<Toggle value={daily} onValueChange={(on) => void turnOn(on, (value) => dispatch(dailyReminderToggled(value)))} accessibilityLabel={strings.dailyReminder} />} />
        {daily && (
          <View style={styles.padded}>
            <TimeField
              label={strings.reminderTime}
              value={`${pad(time.hour)}:${pad(time.minute)}`}
              placeholder="19:00"
              onChange={(value) => {
                const parsed = parseTime(value);
                if (parsed) dispatch(dailyReminderTimeChanged(parsed));
              }}
            />
          </View>
        )}
        <View style={styles.padded}>
          <SegmentedControl
            accessibilityLabel={strings.audioSpeed}
            value={rate < 0.95 ? 'slow' : rate > 1.05 ? 'fast' : 'normal'}
            options={[
              { value: 'slow', label: strings.speeds.slow },
              { value: 'normal', label: strings.speeds.normal },
              { value: 'fast', label: strings.speeds.fast },
            ]}
            onChange={(value) => dispatch(speechRateChanged(value === 'slow' ? 0.85 : value === 'fast' ? 1.15 : 1))}
          />
        </View>
      </SettingsGroup>

      <SettingsGroup title={strings.career}>
        <ListRow title={strings.careerReminders} icon="event" trailing={<Toggle value={career} onValueChange={(on) => void turnOn(on, (value) => dispatch(careerRemindersToggled(value)))} accessibilityLabel={strings.careerReminders} />} />
      </SettingsGroup>

      <SettingsGroup title={strings.appearance}>
        <View style={styles.padded}>
          <SegmentedControl<AppearancePreference>
            accessibilityLabel={strings.appearance}
            value={appearance}
            options={[
              { value: 'system', label: strings.appearances.system },
              { value: 'light', label: strings.appearances.light },
              { value: 'dark', label: strings.appearances.dark },
            ]}
            onChange={(value) => dispatch(appearanceChanged(value))}
          />
        </View>
      </SettingsGroup>

      <SettingsGroup title={strings.data} footer={strings.dataFooter}>
        <ListRow title={backup.settingsRow} subtitle={backup.settingsRowDetail} icon="cloud_sync" onPress={() => router.push('/settings/backup')} />
      </SettingsGroup>

      <SettingsGroup title={strings.about}>
        <ListRow title={feedback.title} subtitle={feedback.rowHint} icon="feedback" onPress={() => router.push('/settings/feedback')} />
        {reviewUrl && (
          <ListRow
            title={about.rate}
            subtitle={about.rateHint}
            icon="star"
            trailing={<Icon name="open_in_new" size={18} color="textTertiary" />}
            showChevron={false}
            onPress={() => {
              tapFeedback();
              void openStoreReview(reviewUrl);
            }}
          />
        )}
        <ListRow title={strings.terms} icon="description" trailing={<Icon name="open_in_new" size={18} color="textTertiary" />} showChevron={false} onPress={() => void openLegalPage('terms')} />
        <ListRow title={strings.privacy} icon="privacy_tip" trailing={<Icon name="open_in_new" size={18} color="textTertiary" />} showChevron={false} onPress={() => void openLegalPage('privacy')} />
        <ListRow title={about.facebook} icon="thumb_up" trailing={<Icon name="open_in_new" size={18} color="textTertiary" />} showChevron={false} onPress={() => void openFacebookPage()} />
        <ListRow title={whatsNew.title} icon="new_releases" onPress={() => router.push('/whats-new')} />
        <ListRow
          title={strings.version}
          icon="info"
          showChevron={false}
          trailing={
            <ThemedText type="secondary" themeColor="textSecondary" selectable>
              {appVersion()}
            </ThemedText>
          }
        />
      </SettingsGroup>

      {__DEV__ && (
        <SettingsGroup title={strings.developer}>
          {mock.usesMockStore && <ListRow title={strings.grantAllAccess} icon="workspace_premium" onPress={mock.grantAllAccess} />}
          {mock.usesMockStore && <ListRow title={strings.resetStore} icon="remove_shopping_cart" onPress={mock.reset} />}
          <ListRow title={strings.unlockAll} titleLines={2} subtitle={strings.unlockAllDetail} icon="lock_open" trailing={<Toggle value={unlockAll} onValueChange={(on) => dispatch(devUnlockAllToggled(on))} accessibilityLabel={strings.unlockAll} />} />
          <ListRow title={demoText.demoData} titleLines={2} subtitle={demoText.demoDataDetail} icon="dataset" trailing={<Toggle value={demo.on} onValueChange={demo.setOn} disabled={demo.toggling} accessibilityLabel={demoText.demoData} />} />
          <ListRow title={strings.deleteAll} icon="delete" iconColor="danger" iconBackground="statusDangerSoft" onPress={confirmDelete} />
          <ListRow
            title={strings.resetWelcome}
            icon="replay"
            onPress={() => {
              dispatch(settingsReset());
              router.replace('/');
            }}
          />
        </SettingsGroup>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
