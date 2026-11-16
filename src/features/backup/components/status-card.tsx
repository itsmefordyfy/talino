import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconSize, Spacing, type ThemeColor } from '@/constants/theme';

import type { StatusKey } from '../lib/status';

type Look = { icon: IconName; color: ThemeColor; /** The explanation goes in its own card under the group, not in the status row. */ attention: boolean };

const LOOK: Record<StatusKey, Look> = {
  synced: { icon: 'check_circle', color: 'statusOk', attention: false },
  backing_up: { icon: 'cloud_sync', color: 'primary', attention: false },
  backing_up_queued: { icon: 'cloud_upload', color: 'statusWarn', attention: true },
  saved_on_phone: { icon: 'smartphone', color: 'primary', attention: true },
  unavailable_ios: { icon: 'cloud_off', color: 'textSecondary', attention: true },
  unavailable_other: { icon: 'cloud_off', color: 'textSecondary', attention: true },
  disabled_user_off: { icon: 'cloud_off', color: 'textSecondary', attention: false },
  disabled_signed_out: { icon: 'cloud_off', color: 'statusWarn', attention: true },
  failed_full: { icon: 'error', color: 'danger', attention: true },
  failed_offline: { icon: 'cloud_off', color: 'statusWarn', attention: true },
  failed_timeout: { icon: 'cloud_off', color: 'statusWarn', attention: true },
  failed_unavailable: { icon: 'cloud_off', color: 'statusWarn', attention: true },
  failed_failed: { icon: 'error', color: 'danger', attention: true },
  restore_completed: { icon: 'check_circle', color: 'statusOk', attention: false },
  none_yet: { icon: 'cloud_off', color: 'textSecondary', attention: false },
};

/** Whether the status needs its own explanation card (something to fix or to know), as opposed to one calm line. */
export function statusNeedsCard(key: StatusKey): boolean {
  return LOOK[key].attention;
}

export type StatusRowProps = { statusKey: StatusKey; title: string; body: string; detail?: string };

/**
 * The automatic backup's status as the last row of its group (Pawfetti's layout): an icon, a word, the time or the
 * explanation under it, so the meaning never rests on color alone. A status that needs more than a line is
 * explained in `StatusMessage` under the group.
 */
export function StatusRow({ statusKey, title, body, detail }: StatusRowProps) {
  const { icon, color, attention } = LOOK[statusKey];
  return (
    <View accessible accessibilityLabel={`${title}. ${attention ? '' : `${body} `}${detail ?? ''}`.trim()} style={styles.row}>
      <Icon name={icon} size={IconSize.large} color={color} />
      <View style={styles.text}>
        <ThemedText type="bodySemiBold">{title}</ThemedText>
        {!attention && (
          <ThemedText type="secondary" themeColor="textSecondary">
            {body}
          </ThemedText>
        )}
        {detail ? (
          <ThemedText type="secondary" themeColor="textSecondary" tabular>
            {detail}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

export type StatusMessageProps = { statusKey: StatusKey; body: string };

/** The plain explanation of a status that needs one (iCloud off, storage full, no connection): a card under the group, nothing when the status is calm. */
export function StatusMessage({ statusKey, body }: StatusMessageProps) {
  if (!statusNeedsCard(statusKey)) return null;
  return (
    <Card>
      <ThemedText type="secondary" themeColor="textSecondary">
        {body}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three },
  text: { flex: 1, gap: Spacing.half },
});
