import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { whatsNewSeen } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { releaseVersion } from '@/lib/app-version';
import { tapFeedback } from '@/lib/haptics';
import { useAppDispatch } from '@/store/hooks';

import { notesFor, notesToShow } from '../lib/release-notes';
import { whatsNewStrings } from '../strings';

/** The release notes of this version: what each addition is, in a line or two, with Continue to close. */
export function WhatsNewView() {
  const s = useLocalized(whatsNewStrings);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const version = releaseVersion();
  const shown = notesToShow(version);

  // Seen the moment it opens: swiping the sheet away counts as much as the button. Only this version's own notes count: Settings shows
  // the newest notes for a version that has none (a development build), and that must not hide a later version's notes.
  const own = notesFor(version).length > 0;
  useEffect(() => {
    if (own) dispatch(whatsNewSeen(version));
  }, [dispatch, own, version]);

  const footer = (
    <Button
      title={s.gotIt}
      onPress={() => {
        tapFeedback();
        router.back();
      }}
    />
  );

  return (
    <Screen footer={footer}>
      <View style={styles.body}>
        <ThemedText type="caption" themeColor="textSecondary" accessibilityRole="header">
          {s.version(shown.version)}
        </ThemedText>
        <ThemedText type="title">{s.headline}</ThemedText>
        {shown.notes.length === 0 ? (
          <ThemedText type="body" themeColor="textSecondary">
            {s.empty}
          </ThemedText>
        ) : (
          <Card>
            <View style={styles.list}>
              {shown.notes.map((note) => (
                <View key={note.id} style={styles.row}>
                  <View style={[styles.well, { backgroundColor: theme.primarySoft }]}>
                    <Icon name={note.icon} size={22} color="primary" />
                  </View>
                  <View style={styles.words}>
                    <ThemedText type="bodySemiBold">{s.items[note.id].title}</ThemedText>
                    <ThemedText type="secondary" themeColor="textSecondary">
                      {s.items[note.id].body}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}
      </View>
    </Screen>
  );
}

const WELL = 40;

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  well: {
    width: WELL,
    height: WELL,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  words: {
    flex: 1,
    gap: Spacing.half,
  },
});
