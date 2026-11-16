import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { CertificateSwatches as C, Radius, Spacing, Spark } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { cornerSvg, sealSvg } from '../lib/certificate-art';
import { SIGNATURE_ASPECT, SIGNATURE_DATA_URI, SIGNER_NAME, SIGNER_TITLE } from '../lib/signature';
import { certificateStrings } from '../strings';

export type CertificateCardProps = {
  learnerName: string;
  courseTitle: string;
  master: boolean;
  issued: string;
};

const CORNER = cornerSvg('card-corner');
const SEAL = sealSvg('card-seal');
const RULE = [C.violetLight, C.indigo] as const;

/**
 * The certificate as the app shows it: the same design as the PDF (lib/certificate-html.ts), in a phone-shaped card. It is
 * a document, so it keeps its paper colors in dark mode, like the career kit's previews.
 */
export function CertificateCard({ learnerName, courseTitle, master, issued }: CertificateCardProps) {
  const strings = useLocalized(certificateStrings);
  return (
    <View style={styles.paper}>
      <View style={styles.frame} pointerEvents="none" />
      <View style={[styles.frame, styles.frameInner]} pointerEvents="none" />
      <SvgXml xml={CORNER} width={CORNER_SIZE} height={CORNER_SIZE} style={styles.cornerTop} />
      <SvgXml xml={CORNER} width={CORNER_SIZE} height={CORNER_SIZE} style={styles.cornerBottom} />

      <View style={styles.content}>
        <View style={styles.brand} accessible accessibilityLabel="Talino">
          <Icon name="auto_awesome" size={16} tint={Spark} filled />
          <ThemedText type="secondarySemiBold" style={styles.ink}>
            Talino
          </ThemedText>
        </View>

        <View accessible accessibilityRole="header" accessibilityLabel={strings.label} style={styles.heading}>
          <ThemedText type="hero" style={[styles.violet, styles.title]} numberOfLines={1} adjustsFontSizeToFit>
            {strings.headingTitle}
          </ThemedText>
          <ThemedText type="caption" style={[styles.ink, styles.subtitle]}>
            {strings.headingSubtitle}
          </ThemedText>
        </View>

        <ThemedText type="secondary" style={[styles.soft, styles.center, styles.lead]}>
          {strings.certify}
        </ThemedText>
        <ThemedText type="title" style={[styles.ink, styles.center]} numberOfLines={2} adjustsFontSizeToFit selectable>
          {learnerName}
        </ThemedText>
        <LinearGradient colors={RULE} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.rule} />
        <ThemedText type="secondary" style={[styles.soft, styles.center]}>
          {master ? strings.masterLine : strings.completed}
        </ThemedText>
        <ThemedText type="section" style={[styles.ink, styles.center, styles.course]}>
          {courseTitle}
        </ThemedText>
        <ThemedText type="caption" style={[styles.soft, styles.center]}>
          {strings.detail}
        </ThemedText>

        <View style={styles.signRow}>
          <View style={styles.column}>
            <View style={styles.value}>
              <ThemedText type="secondarySemiBold" style={[styles.ink, styles.center]} numberOfLines={1} adjustsFontSizeToFit>
                {issued}
              </ThemedText>
            </View>
            <View style={styles.line}>
              <ThemedText type="caption" style={[styles.ink, styles.center]}>
                {strings.dateIssued}
              </ThemedText>
            </View>
          </View>
          <SvgXml xml={SEAL} width={SEAL_WIDTH} height={SEAL_WIDTH * (140 / 120)} accessibilityLabel={strings.sealLabel} />
          <View style={styles.column} accessible accessibilityLabel={`${SIGNER_NAME}, ${SIGNER_TITLE}`}>
            <View style={styles.value}>
              <Image source={{ uri: SIGNATURE_DATA_URI }} tintColor={C.ink} contentFit="contain" style={styles.signature} />
            </View>
            <View style={styles.line}>
              <ThemedText type="caption" style={[styles.ink, styles.center, styles.bold]} numberOfLines={1} adjustsFontSizeToFit>
                {SIGNER_NAME}
              </ThemedText>
              <ThemedText type="caption" style={[styles.soft, styles.center]} numberOfLines={1} adjustsFontSizeToFit>
                {SIGNER_TITLE}
              </ThemedText>
            </View>
          </View>
        </View>

      </View>
    </View>
  );
}

const CORNER_SIZE = 72;
const SEAL_WIDTH = 64;
const FRAME_INSET = Spacing.two + Spacing.half;

const styles = StyleSheet.create({
  paper: {
    backgroundColor: C.paper,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(17, 24, 39, 0.06), 0 12px 28px -12px rgba(46, 35, 132, 0.28)',
  },
  frame: {
    position: 'absolute',
    top: FRAME_INSET,
    right: FRAME_INSET,
    bottom: FRAME_INSET,
    left: FRAME_INSET,
    borderWidth: 1,
    borderColor: C.rule,
  },
  frameInner: {
    top: FRAME_INSET + Spacing.one,
    right: FRAME_INSET + Spacing.one,
    bottom: FRAME_INSET + Spacing.one,
    left: FRAME_INSET + Spacing.one,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cornerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cornerBottom: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: [{ rotate: '180deg' }],
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five + Spacing.three,
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
  },
  title: {
    letterSpacing: 4,
  },
  subtitle: {
    fontWeight: 700,
    letterSpacing: 3,
  },
  lead: {
    marginTop: Spacing.three,
  },
  rule: {
    alignSelf: 'center',
    width: '72%',
    height: 2,
    marginVertical: Spacing.two,
  },
  course: {
    fontWeight: 800,
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
    borderTopColor: C.inkSoft,
    paddingTop: Spacing.one,
  },
  ink: {
    color: C.ink,
  },
  soft: {
    color: C.inkSoft,
  },
  violet: {
    color: C.violet,
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 700,
  },
});
