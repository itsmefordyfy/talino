import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { MasteryCertificateSwatches as M, Radius, Spacing } from '@/constants/theme';
// By path, not the certificates index: that index exports the certificate screens, which read this feature's journey hook.
import { journeyCertificateStrings } from '@/features/certificates/journey-strings';
import { masterySealSvg } from '@/features/certificates/lib/certificate-art';
import { JOURNEY_CERTIFICATE_ID, journeyCertificateStatus } from '@/features/certificates/lib/journey-certificate';
import { openPaywall, useAccess } from '@/features/store';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { JourneyState } from '../lib/types';

export type CertificatePromoProps = { state: JourneyState };

const SEAL = masterySealSvg('promo-mastery');
const NIGHT = [M.night, M.nightDeep] as const;

const open = () => {
  tapFeedback();
  router.push({ pathname: '/certificate/[courseId]', params: { courseId: JOURNEY_CERTIFICATE_ID } });
};

/**
 * The AI Expert certificate at the very end of the journey. Until it is earned: a dashed "almost here" card with the four levels'
 * progress, and Get full access for a learner without Pro (the later levels need it). Once earned: a night-and-gold card that opens it.
 */
export function CertificatePromo({ state }: CertificatePromoProps) {
  const strings = useLocalized(journeyCertificateStrings);
  const theme = useTheme();
  const access = useAccess();
  const status = journeyCertificateStatus({ complete: state.complete, stages: state.stages.map((stage) => ({ level: stage.def.level, complete: stage.complete, done: stage.done, total: stage.total })) });

  if (status.earned) {
    return (
      <LinearGradient colors={NIGHT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, styles.earned]}>
        <SvgXml xml={SEAL} width={88} height={88 * (160 / 140)} accessibilityLabel={strings.sealLabel} />
        <ThemedText type="caption" style={[styles.goldText, styles.eyebrow]}>
          {strings.highest}
        </ThemedText>
        <ThemedText type="section" style={[styles.ivory, styles.center]} accessibilityRole="header">
          {strings.earnedTitle}
        </ThemedText>
        <ThemedText type="secondary" style={[styles.soft, styles.center]}>
          {strings.earnedBody}
        </ThemedText>
        <Button title={strings.view} icon="workspace_premium" onPress={open} style={styles.button} />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, styles.locked, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={[styles.badge, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <Icon name="workspace_premium" size={40} color="textTertiary" />
        </View>
        <ThemedText type="section" style={styles.center} accessibilityRole="header">
          {strings.almostTitle}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary" style={styles.center}>
          {strings.almostBody}
        </ThemedText>
        <View style={styles.levels} accessible accessibilityLabel={strings.levelsProgress(status.levelsComplete)}>
          {status.levels.map((level) => (
            <View key={level.level} style={styles.level}>
              <View style={[styles.dot, { backgroundColor: level.complete ? M.gold : theme.backgroundSelected, borderColor: level.complete ? M.goldDeep : theme.border }]}>
                {level.complete && <Icon name="check" size={14} tint={M.nightDeep} />}
              </View>
              <ThemedText type="caption" themeColor={level.complete ? 'text' : 'textTertiary'} numberOfLines={1} adjustsFontSizeToFit>
                {level.name}
              </ThemedText>
            </View>
          ))}
        </View>
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {strings.levelsProgress(status.levelsComplete)}
        </ThemedText>
      </View>
      {/* Like the reference: the way to unlock the rest sits right under the card, only for someone who doesn't have Pro yet. */}
      {access.known && !access.allAccess && <Button title={strings.fullAccess} icon="chevron_right" onPress={() => openPaywall('courses')} />}
    </View>
  );
}

const DOT = 26;

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.three,
  },
  card: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  locked: {
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  earned: {
    borderWidth: 1.5,
    borderColor: M.gold,
  },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  levels: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  level: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: 700,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  ivory: {
    color: M.ivory,
  },
  soft: {
    color: M.ivorySoft,
  },
  goldText: {
    color: M.gold,
  },
});
