import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MasteryCertificateSwatches as M, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { journeyCertificateStrings } from '../journey-strings';
import { masterySealSvg } from '../lib/certificate-art';
import { JOURNEY_CERTIFICATE_LEVELS, JOURNEY_CERTIFICATE_PROGRAM, JOURNEY_LEVEL_NAMES } from '../lib/journey-certificate';
import { SIGNATURE_ASPECT, SIGNATURE_DATA_URI, SIGNER_NAME, SIGNER_TITLE } from '../lib/signature';

export type JourneyCertificateCardProps = {
  learnerName: string;
  issued: string;
};

const SEAL = masterySealSvg('card-mastery');
const NIGHT = [M.night, M.nightDeep] as const;
const GOLD = [M.goldDeep, M.goldLight, M.goldDeep] as const;

/**
 * The AI Expert certificate, Talino's highest: night indigo and gold instead of the white paper of a course certificate, "AI EXPERT"
 * as the title, the four levels as gold medallions, and a gold seal. The same design as its PDF (`journeyCertificateHtml`).
 */
export function JourneyCertificateCard({ learnerName, issued }: JourneyCertificateCardProps) {
  const strings = useLocalized(journeyCertificateStrings);
  return (
    <LinearGradient colors={NIGHT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.paper}>
      <View style={styles.frame} pointerEvents="none" />
      <View style={[styles.frame, styles.frameInner]} pointerEvents="none" />
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <View key={corner} style={[styles.corner, styles[corner]]} pointerEvents="none">
          <Icon name="auto_awesome" size={16} tint={M.gold} filled />
        </View>
      ))}

      <View style={styles.content}>
        <View style={styles.brand} accessible accessibilityLabel={`Talino. ${strings.highest}`}>
          <Icon name="auto_awesome" size={16} tint={M.gold} filled />
          <ThemedText type="secondarySemiBold" style={styles.ivory}>
            Talino
          </ThemedText>
        </View>

        <View accessible accessibilityRole="header" accessibilityLabel={strings.label} style={styles.heading}>
          <ThemedText type="caption" style={[styles.gold, styles.eyebrow]}>
            {strings.eyebrow}
          </ThemedText>
          <ThemedText type="hero" style={[styles.ivory, styles.title]} numberOfLines={1} adjustsFontSizeToFit>
            {strings.heading}
          </ThemedText>
        </View>

        <ThemedText type="secondary" style={[styles.soft, styles.center, styles.lead]}>
          {strings.certify}
        </ThemedText>
        <ThemedText type="title" style={[styles.ivory, styles.center]} numberOfLines={2} adjustsFontSizeToFit selectable>
          {learnerName}
        </ThemedText>
        <LinearGradient colors={GOLD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.rule} />
        <ThemedText type="secondary" style={[styles.soft, styles.center]}>
          {strings.completed}
        </ThemedText>
        <ThemedText type="section" style={[styles.gold, styles.center, styles.program]}>
          {JOURNEY_CERTIFICATE_PROGRAM}
        </ThemedText>

        <View style={styles.levels}>
          {JOURNEY_CERTIFICATE_LEVELS.map((level) => (
            <View key={level} style={styles.level} accessible accessibilityLabel={strings.levelDone(JOURNEY_LEVEL_NAMES[level])}>
              <View style={styles.medal}>
                <Icon name="check" size={18} tint={M.nightDeep} />
              </View>
              <ThemedText type="caption" style={[styles.ivory, styles.center, styles.bold]} numberOfLines={1} adjustsFontSizeToFit>
                {JOURNEY_LEVEL_NAMES[level]}
              </ThemedText>
            </View>
          ))}
        </View>
        <ThemedText type="caption" style={[styles.soft, styles.center]}>
          {strings.levelsLine}
        </ThemedText>

        <View style={styles.signRow}>
          <View style={styles.column}>
            <View style={styles.value}>
              <ThemedText type="secondarySemiBold" style={[styles.ivory, styles.center]} numberOfLines={1} adjustsFontSizeToFit>
                {issued}
              </ThemedText>
            </View>
            <View style={styles.line}>
              <ThemedText type="caption" style={[styles.soft, styles.center]}>
                {strings.dateIssued}
              </ThemedText>
            </View>
          </View>
          <SvgXml xml={SEAL} width={SEAL_WIDTH} height={SEAL_WIDTH * (160 / 140)} accessibilityLabel={strings.sealLabel} />
          <View style={styles.column} accessible accessibilityLabel={`${SIGNER_NAME}, ${SIGNER_TITLE}`}>
            <View style={styles.value}>
              {/* The signature is black ink; tinted ivory so it reads on the night background. */}
              <Image source={{ uri: SIGNATURE_DATA_URI }} tintColor={M.ivory} contentFit="contain" style={styles.signature} />
            </View>
            <View style={styles.line}>
              <ThemedText type="caption" style={[styles.ivory, styles.center, styles.bold]} numberOfLines={1} adjustsFontSizeToFit>
                {SIGNER_NAME}
              </ThemedText>
              <ThemedText type="caption" style={[styles.soft, styles.center]} numberOfLines={1} adjustsFontSizeToFit>
                {SIGNER_TITLE}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const SEAL_WIDTH = 76;
const FRAME_INSET = Spacing.two + Spacing.half;
const MEDAL = 34;

const styles = StyleSheet.create({
  paper: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(13, 10, 46, 0.2), 0 16px 32px -12px rgba(13, 10, 46, 0.55)',
  },
  frame: {
    position: 'absolute',
    top: FRAME_INSET,
    right: FRAME_INSET,
    bottom: FRAME_INSET,
    left: FRAME_INSET,
    borderWidth: 1.5,
    borderColor: M.gold,
  },
  frameInner: {
    top: FRAME_INSET + Spacing.one,
    right: FRAME_INSET + Spacing.one,
    bottom: FRAME_INSET + Spacing.one,
    left: FRAME_INSET + Spacing.one,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: M.goldLight,
  },
  corner: {
    position: 'absolute',
  },
  tl: { top: FRAME_INSET + Spacing.two, left: FRAME_INSET + Spacing.two },
  tr: { top: FRAME_INSET + Spacing.two, right: FRAME_INSET + Spacing.two },
  bl: { bottom: FRAME_INSET + Spacing.two, left: FRAME_INSET + Spacing.two },
  br: { bottom: FRAME_INSET + Spacing.two, right: FRAME_INSET + Spacing.two },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five + Spacing.two,
    paddingHorizontal: Spacing.five,
    gap: Spacing.one,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  heading: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  eyebrow: {
    fontWeight: 700,
    letterSpacing: 3,
  },
  title: {
    letterSpacing: 6,
  },
  lead: {
    marginTop: Spacing.two,
  },
  rule: {
    alignSelf: 'center',
    width: '72%',
    height: 2,
    marginVertical: Spacing.two,
  },
  program: {
    fontWeight: 800,
  },
  levels: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    gap: Spacing.one,
  },
  level: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  medal: {
    width: MEDAL,
    height: MEDAL,
    borderRadius: MEDAL / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: M.gold,
    borderWidth: 2,
    borderColor: M.goldLight,
  },
  // Top-aligned, so the date's line and the signature's line sit at the same height whatever is written under them.
  signRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  column: {
    flex: 1,
  },
  value: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.one,
  },
  signature: {
    height: 42,
    aspectRatio: SIGNATURE_ASPECT,
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: M.gold,
    paddingTop: Spacing.one,
  },
  ivory: {
    color: M.ivory,
  },
  soft: {
    color: M.ivorySoft,
  },
  gold: {
    color: M.gold,
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 700,
  },
});
