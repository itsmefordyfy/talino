import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { ResumeContent } from '../lib/document';
import { contactLine, docBlocks, photoOf, SPACING } from '../lib/render';
import { ACCENT_HEX, PAPER_INK, TEMPLATES, type FontId, type ResumeStyle } from '../lib/templates';

export type DocumentPreviewProps = {
  content: ResumeContent;
  style: ResumeStyle;
  /** Read by screen readers instead of the page's many lines. */
  accessibilityLabel: string;
};

/** The system fonts the print and Word files use (the app's own fonts aren't in a PDF), as this phone names them. */
const FONT_FAMILY: Record<FontId, string> = Platform.select({
  ios: { sans: 'Helvetica Neue', serif: 'Georgia', mono: 'Menlo' },
  default: { sans: 'sans-serif', serif: 'serif', mono: 'monospace' },
});

/** One bullet with a hanging indent: a wrapped line sits under the words, not under the dot, as in the PDF and Word. */
function Bullet({ line, textStyle }: { line: string; textStyle: TextStyle }) {
  return (
    <View style={styles.bullet}>
      <Text style={[textStyle, styles.dot]}>•</Text>
      <Text selectable style={[textStyle, styles.bulletText]}>
        {line}
      </Text>
    </View>
  );
}

/**
 * A sheet of paper showing exactly what prints: the same block list, order, accent, font and density as the PDF and the
 * Word file. It is white with dark ink in both light and dark mode, because paper is.
 */
export function DocumentPreview({ content, style, accessibilityLabel }: DocumentPreviewProps) {
  const theme = useTheme();
  const template = TEMPLATES[style.template];
  const space = SPACING[style.density];
  const accent = ACCENT_HEX[style.accent];
  const family = FONT_FAMILY[style.font];
  // Points on paper become density-independent pixels at a reading size slightly larger than print.
  const size = space.body + 1.5;
  const text = { fontFamily: family, fontSize: size, lineHeight: size * space.line, color: PAPER_INK.ink };
  const muted = { ...text, color: PAPER_INK.muted };
  const align = template.centered ? ('center' as const) : ('left' as const);
  const headingStyle = [
    styles.heading,
    { fontFamily: family, fontSize: size + 1, color: template.heading === 'rule' ? PAPER_INK.ink : accent, marginTop: space.section + 4 },
    template.heading === 'bar' && { borderBottomWidth: 2, borderBottomColor: accent },
    template.heading === 'rule' && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: PAPER_INK.rule },
    template.heading === 'caps' && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: PAPER_INK.rule, letterSpacing: 1.2 },
    template.heading !== 'plain' && { textTransform: 'uppercase' as const },
  ];
  const contact = contactLine(content);
  const photo = photoOf(content, style);
  // The classic template closes its header with a black rule; every other one uses its accent.
  const classic = template.heading === 'rule';

  return (
    <View style={[styles.page, { borderColor: theme.border }]} accessible accessibilityLabel={accessibilityLabel}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.header, { borderBottomColor: classic ? PAPER_INK.ink : accent, borderBottomWidth: classic ? 1.5 : 2, paddingBottom: space.entry + 4 }, photo !== '' && !template.centered && styles.headerRow]}>
          {/* A centred template puts the picture above the name; the others put it at the end of the header, as the PDF does. */}
          {photo !== '' && template.centered && <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={[styles.photo, styles.photoCentered]} contentFit="cover" accessibilityIgnoresInvertColors />}
          <View style={photo !== '' && !template.centered ? styles.headerText : undefined}>
            <Text selectable style={[text, styles.name, { fontSize: size * 2.1, lineHeight: size * 2.4, color: accent, textAlign: align }]}>
              {content.name || ' '}
            </Text>
            {content.headline !== '' && <Text style={[text, styles.role, { fontSize: size + 2, textAlign: align }]}>{content.headline}</Text>}
            {contact.length > 0 && <Text style={[muted, { fontSize: size - 1, textAlign: align }]}>{contact.join(' | ')}</Text>}
          </View>
          {photo !== '' && !template.centered && <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photo} contentFit="cover" accessibilityIgnoresInvertColors />}
        </View>
        {docBlocks(content, style).map((block) => (
          <View key={block.section}>
            <Text style={headingStyle}>{block.heading}</Text>
            {block.paragraphs.map((line) => (
              <Text key={line} selectable style={text}>
                {line}
              </Text>
            ))}
            {block.bullets.map((line) => (
              <Bullet key={line} line={line} textStyle={text} />
            ))}
            {block.entries.map((entry) => (
              <View key={entry.id} style={{ marginTop: space.entry + 2 }}>
                <View style={styles.entryHead}>
                  <Text selectable style={[text, styles.bold, styles.entryTitle]}>
                    {entry.title}
                  </Text>
                  {entry.dates ? <Text style={[muted, styles.dates, { fontSize: size - 1 }]}>{entry.dates}</Text> : null}
                </View>
                {entry.subtitle !== '' && <Text style={[muted, styles.italic]}>{entry.subtitle}</Text>}
                {entry.bullets.map((line) => (
                  <Bullet key={line} line={line} textStyle={text} />
                ))}
                {entry.link !== '' && <Text style={[muted, { fontSize: size - 1 }]}>{entry.link}</Text>}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER_INK.page,
    borderRadius: 6,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.four + Spacing.one,
    paddingTop: Spacing.four + Spacing.one,
    paddingBottom: Spacing.five,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0 6px 20px rgba(15, 23, 42, 0.1)',
  },
  header: {
    marginBottom: Spacing.one,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  photoCentered: {
    alignSelf: 'center',
    marginBottom: Spacing.two,
  },
  name: {
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  role: {
    fontWeight: '600',
    marginTop: Spacing.half,
    marginBottom: Spacing.one,
  },
  entryHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: Spacing.three,
  },
  entryTitle: {
    flex: 1,
  },
  dates: {
    flexShrink: 0,
    textAlign: 'right',
  },
  italic: {
    fontStyle: 'italic',
  },
  bullet: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingLeft: Spacing.one,
  },
  dot: {
    width: Spacing.two,
  },
  bulletText: {
    flex: 1,
  },
  heading: {
    fontWeight: '700',
    paddingBottom: 2,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
  },
  regular: {
    fontWeight: '400',
  },
});
