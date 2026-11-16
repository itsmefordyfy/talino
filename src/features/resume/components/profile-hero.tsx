import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ProfileAvatar } from '@/components/profile-avatar';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { photoStrings } from '../photo-strings';

const AVATAR = 104;
const BADGE = 34;

export type ProfileHeroProps = {
  name: string;
  headline: string;
  photo: string | null;
  /** 0 to 100, with its sentence ("Profile 67% complete"). */
  percent: number;
  label: string;
  /** The one thing still to add ("Next: add your city"), or null when the profile is complete. */
  next: string | null;
  /** Taps on the next thing: the screen scrolls to where it is added. */
  onNext?: () => void;
  /** A picture is being picked or saved. */
  busy: boolean;
  /** Why the picture couldn't be added, in words. */
  problem: string | null;
  onChoosePhoto: () => void;
  onRemovePhoto: () => void;
};

/**
 * Who this profile is, in one place: the picture (tap it to add or change it), the name and headline, and how close the profile is to
 * done with the one next thing to add (tap it to jump there). One avatar, not two: the header and the picture card used to show the
 * same face twice, with the picture's card mostly empty space.
 */
export function ProfileHero({ name, headline, photo, percent, label, next, onNext, busy, problem, onChoosePhoto, onRemovePhoto }: ProfileHeroProps) {
  const theme = useTheme();
  const text = useLocalized(photoStrings);
  return (
    <Card style={styles.hero}>
      <Pressable accessibilityRole="button" accessibilityLabel={photo ? text.change : text.add} accessibilityState={{ busy }} disabled={busy} onPress={onChoosePhoto} style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
        <ProfileAvatar name={name} photo={photo} size={AVATAR} />
        <View style={[styles.badge, { backgroundColor: theme.primary, borderColor: theme.backgroundElement }]}>{busy ? <ActivityIndicator size="small" color={theme.onPrimary} /> : <Icon name={photo ? 'edit' : 'photo_camera'} size={18} color="onPrimary" />}</View>
      </Pressable>

      <View style={styles.identity}>
        <ThemedText type="section" numberOfLines={1} style={styles.center}>
          {name.trim() || ' '}
        </ThemedText>
        {headline.trim() !== '' && (
          <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2} style={styles.center}>
            {headline}
          </ThemedText>
        )}
      </View>

      {/* No separate "Add a photo" button (owner, 2026-11-16: redundant): the picture itself, with its camera badge, is the control. Only removing needs a button. */}
      {photo !== null && (
        <View style={styles.photoActions}>
          <Button title={text.remove} icon="delete" variant="ghost" size="small" disabled={busy} onPress={onRemovePhoto} />
        </View>
      )}
      {problem !== null && <Notice tone="warning" message={problem} style={styles.stretch} />}
      {photo === null && problem === null && (
        <ThemedText type="caption" themeColor="textTertiary" style={styles.center}>
          {text.footer}
        </ThemedText>
      )}

      <View style={styles.progress}>
        <ThemedText type="bodySemiBold">{label}</ThemedText>
        <ProgressBar fraction={percent / 100} accessibilityLabel={label} done={percent === 100} />
        {next !== null && onNext ? (
          <Pressable accessibilityRole="button" accessibilityLabel={next} onPress={onNext} hitSlop={8} style={({ pressed }) => [styles.next, pressed && styles.pressed]}>
            <ThemedText type="secondarySemiBold" themeColor="primaryText" style={styles.nextText}>
              {next}
            </ThemedText>
            <Icon name="arrow_forward" size={18} color="primaryText" />
          </Pressable>
        ) : (
          next !== null && (
            <ThemedText type="secondary" themeColor="textSecondary">
              {next}
            </ThemedText>
          )
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarButton: {
    width: AVATAR,
    height: AVATAR,
  },
  pressed: {
    opacity: 0.7,
  },
  // The camera badge sits on the avatar's lower right, ringed in the card's colour so it reads as a separate control.
  badge: {
    position: 'absolute',
    right: -Spacing.half,
    bottom: -Spacing.half,
    width: BADGE,
    height: BADGE,
    borderRadius: Radius.pill,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    alignSelf: 'stretch',
    gap: Spacing.half,
  },
  center: {
    textAlign: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  progress: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    minHeight: 32,
  },
  nextText: {
    flex: 1,
  },
});
