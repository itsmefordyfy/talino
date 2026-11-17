import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { noteMood } from '@/features/companion/lib/messages';
import { Tali } from '@/components/brand/tali';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { findVisual, VisualAutoplay } from '@/features/visuals';
import { DiagramFromJson, DiagramFromMermaid } from '@/features/visuals/diagrams';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import type { LessonBlock, SourceLink } from '../content/types';
import { comparisonTable } from '../lib/ai-tools';
import { copyText } from '@/lib/clipboard';
import { formatDate } from '@/lib/dates';
import { demoStrings } from '../demo-strings';
import { courseStrings } from '../strings';
import { CopyBlock } from './copy-block';
import { demoLabelUnit, demoTextUnit, detailsBodyUnit, detailsSummaryUnit, itemUnit, versionTextUnit } from '../lib/speech-segments';
import { InlineText } from './inline-text';
import { SpeakFrame, SpokenText, useListenFollow, useSpeakingInside, useUnitSpeaking } from './listen-follow';

export type LessonBlocksProps = {
  blocks: readonly LessonBlock[];
  /** Draws an interactive activity block. Supplied by the lesson screen, which knows the lesson and course (and records the attempts). */
  renderActivity?: (activity: Extract<LessonBlock, { type: 'activity' }>['activity']) => ReactNode;
  /**
   * "Show everything" draws blocks written for other levels too; this names who such a block is for ("For Advanced and Professional")
   * so a beginner knows what they are looking at. Return null for a block that needs no label.
   */
  audienceLabel?: (block: LessonBlock) => string | null;
};

/** A lesson card's body, block by block. */
export function LessonBlocks({ blocks, renderActivity, audienceLabel }: LessonBlocksProps) {
  return (
    <View style={styles.stack}>
      {blocks.map((block, index) => {
        const label = audienceLabel?.(block) ?? null;
        return label ? (
          <View key={index} style={styles.labelled}>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.audienceLabel}>
              {label}
            </ThemedText>
            <Block block={block} renderActivity={renderActivity} />
          </View>
        ) : (
          <Block key={index} block={block} renderActivity={renderActivity} />
        );
      })}
    </View>
  );
}

function Block({ block, renderActivity }: { block: LessonBlock; renderActivity?: LessonBlocksProps['renderActivity'] }) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  const language = useLanguage();
  // While a lesson is listened to, the part being spoken is marked; `unit` says which part of the lesson this block is (null: not spoken).
  const unit = useListenFollow()?.unitOfBlock(block) ?? null;
  // A visual or diagram is shown and played while the voice is describing it.
  const speaking = useUnitSpeaking(unit);
  switch (block.type) {
    case 'paragraph':
      return (
        <SpeakFrame unit={unit}>
          <SpokenText unit={unit} type="body" text={block.text} style={styles.reading} keyTerms />
        </SpeakFrame>
      );
    case 'heading':
      return (
        <SpeakFrame unit={unit} marker="none">
          <SpokenText unit={unit} type="section" text={block.text} accessibilityRole="header" style={styles.heading} />
        </SpeakFrame>
      );
    case 'list':
      return (
        <View style={styles.list}>
          {block.items.map((item, index) => {
            const itemId = unit ? itemUnit(unit, index) : null;
            return (
              <SpeakFrame key={index} unit={itemId} style={styles.listItem}>
                <ThemedText type="body" themeColor="primaryText" style={styles.marker}>
                  {block.ordered ? `${index + 1}.` : '•'}
                </ThemedText>
                <SpokenText unit={itemId} type="body" text={item} style={[styles.reading, styles.listText]} keyTerms />
              </SpeakFrame>
            );
          })}
        </View>
      );
    case 'code':
      return (
        <SpeakFrame unit={unit}>
          <CopyBlock kind="code" text={block.code} language={block.language} label={block.label ?? strings.codeLabel(block.language)} />
        </SpeakFrame>
      );
    case 'prompt':
      return (
        <SpeakFrame unit={unit}>
          <CopyBlock kind="prompt" text={block.text} label={block.label ?? strings.promptLabel} />
        </SpeakFrame>
      );
    case 'visual': {
      const visual = findVisual(block.id, language);
      if (!visual) return null;
      return (
        <SpeakFrame unit={unit} style={styles.visual}>
          <VisualAutoplay active={speaking}>
            <visual.Component compact />
          </VisualAutoplay>
          {block.caption ? (
            <ThemedText type="secondary" themeColor="textSecondary">
              {block.caption}
            </ThemedText>
          ) : null}
        </SpeakFrame>
      );
    }
    case 'diagram':
      return (
        <SpeakFrame unit={unit} style={styles.visual}>
          <VisualAutoplay active={speaking}>{block.format === 'mermaid' ? <DiagramFromMermaid source={String(block.source)} /> : <DiagramFromJson json={block.source} />}</VisualAutoplay>
          {block.caption ? (
            <ThemedText type="secondary" themeColor="textSecondary">
              {block.caption}
            </ThemedText>
          ) : null}
        </SpeakFrame>
      );
    case 'activity':
      return renderActivity ? <>{renderActivity(block.activity)}</> : null;
    case 'details':
      return <Details unit={unit} summary={block.summary} body={block.body} />;
    case 'takeaways':
      return <Takeaways unit={unit} items={block.items} />;
    case 'table':
      return (
        <SpeakFrame unit={unit}>
          <ComparisonTable headers={block.headers} rows={block.rows} caption={block.caption} />
        </SpeakFrame>
      );
    case 'demo':
      return <Demo unit={unit} title={block.title} prompt={block.prompt} output={block.output} notice={block.notice} />;
    case 'toolComparison': {
      const table = comparisonTable(block.tools, language);
      if (table.rows.length === 0) return null;
      const checked = table.checked ? strings.toolsChecked(formatDate(table.checked)) : null;
      return (
        <SpeakFrame unit={unit} style={styles.visual}>
          <ComparisonTable headers={table.headers} rows={table.rows} caption={[block.caption?.replace(/\.?$/, '.'), checked].filter(Boolean).join(' ')} />
          <Button title={strings.openToolsGuide} icon="compare_arrows" variant="secondary" size="small" onPress={() => router.push('/ai-tools')} />
        </SpeakFrame>
      );
    }
    case 'version':
      return (
        <SpeakFrame unit={unit}>
          <VersionNote unit={unit} text={block.text} checked={block.checked} sources={block.sources} plans={block.plans} />
        </SpeakFrame>
      );
    case 'tip':
    case 'warning': {
      const warning = block.type === 'warning';
      return (
        <SpeakFrame unit={unit}>
          <View style={[styles.callout, { backgroundColor: warning ? theme.statusWarnSoft : theme.statusOkSoft }]}>
            {/* Tali points the note out: explaining for a tip, surprised for a warning. */}
            <Tali size={44} tight mood={noteMood(block.type)} />
            <View style={styles.calloutText}>
              <ThemedText type="secondarySemiBold" style={{ color: warning ? theme.statusWarn : theme.statusOk }}>
                {warning ? strings.warning : strings.tip}
              </ThemedText>
              <SpokenText unit={unit} type="body" text={block.text} keyTerms />
            </View>
          </View>
        </SpeakFrame>
      );
    }
  }
}

/**
 * A statement about a product that can change: when it was checked, against which official pages (each
 * opens in the in-app browser), and which plans it needs. The learner always sees it is dated.
 */
function VersionNote({ unit, text, checked, sources, plans }: { unit: string | null; text: string; checked: string; sources: SourceLink[]; plans?: string }) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  return (
    <View style={[styles.callout, { backgroundColor: theme.backgroundElement, borderColor: theme.border, borderWidth: StyleSheet.hairlineWidth }]}>
      <Icon name="update" size={20} color="primaryText" />
      <View style={styles.calloutText}>
        <ThemedText type="secondarySemiBold" themeColor="primaryText">
          {strings.versionTitle(formatDate(checked))}
        </ThemedText>
        <SpokenText unit={unit ? versionTextUnit(unit) : null} type="body" text={text} />
        {plans ? <InlineText type="secondary" themeColor="textSecondary" text={strings.versionPlans(plans)} /> : null}
        <View style={styles.sources}>
          {sources.map((source) => (
            <Pressable
              key={source.url}
              accessibilityRole="link"
              accessibilityLabel={strings.openSource(source.label)}
              onPress={() => void WebBrowser.openBrowserAsync(source.url)}
              hitSlop={8}
              style={({ pressed }) => [styles.source, pressed && styles.pressed]}>
              <Icon name="open_in_new" size={16} color="primaryText" />
              <ThemedText type="secondarySemiBold" themeColor="primaryText">
                {source.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

/** A deeper explanation behind "Show more": the lesson stays short, and nothing is removed. */
function Details({ unit, summary, body }: { unit: string | null; summary: string; body: string[] }) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  const [open, setOpen] = useState(false);
  // Listening reads the hidden text too: the box opens as the voice gets to it, so what is being said is always on screen.
  const speakingInside = useSpeakingInside(unit);
  const [openedFor, setOpenedFor] = useState(false);
  if (speakingInside && !openedFor) {
    setOpenedFor(true);
    setOpen(true);
  }
  if (!speakingInside && openedFor) setOpenedFor(false);
  return (
    <View style={[styles.details, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`${summary}. ${open ? strings.showLess : strings.showMore}`} onPress={() => setOpen((current) => !current)} style={styles.detailsHeader}>
        <SpeakFrame unit={unit ? detailsSummaryUnit(unit) : null} style={styles.flex}>
          <SpokenText unit={unit ? detailsSummaryUnit(unit) : null} type="bodySemiBold" text={summary} />
        </SpeakFrame>
        <Icon name={open ? 'expand_less' : 'expand_more'} size={22} color="primaryText" />
      </Pressable>
      {open && (
        <View style={styles.detailsBody}>
          {body.map((paragraph, index) => {
            const id = unit ? detailsBodyUnit(unit, index) : null;
            return (
              <SpeakFrame key={index} unit={id}>
                <SpokenText unit={id} type="body" text={paragraph} style={styles.reading} keyTerms />
              </SpeakFrame>
            );
          })}
        </View>
      )}
    </View>
  );
}

/** The lesson's key points, each with a mint check, on one quiet card. */
function Takeaways({ unit, items }: { unit: string | null; items: string[] }) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  return (
    <SpeakFrame unit={unit}>
      <View style={[styles.takeaways, { backgroundColor: theme.statusOkSoft }]}>
        <View style={styles.takeawaysHeader}>
          <Tali size={44} tight mood="proud" />
          <ThemedText type="secondarySemiBold" style={{ color: theme.statusOk }} accessibilityRole="header">
            {strings.takeaways}
          </ThemedText>
        </View>
        {items.map((item, index) => {
          const id = unit ? itemUnit(unit, index) : null;
          return (
            <SpeakFrame key={index} unit={id} style={styles.listItem}>
              <Icon name="check_circle" size={20} tint={theme.statusOk} />
              <SpokenText unit={id} type="body" text={item} style={styles.listText} keyTerms />
            </SpeakFrame>
          );
        })}
      </View>
    </SpeakFrame>
  );
}

type DemoProps = { unit: string | null; title: string; prompt: string; output: string; notice: string };

/**
 * "AI in Action": a hand-written example of a prompt and the kind of answer it gets. It always says it is an illustration (a badge and a line that
 * stay on screen), never draws the answer as a chat reply from a product, and the answer box is labelled "An AI might answer", not "AI".
 */
function Demo({ unit, title, prompt, output, notice }: DemoProps) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  const demo = useLocalized(demoStrings);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyText(prompt)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };
  const label = (part: 'prompt' | 'output' | 'notice', text: string) => (
    <SpeakFrame unit={unit ? demoLabelUnit(unit, part) : null} marker="none">
      <SpokenText unit={unit ? demoLabelUnit(unit, part) : null} type="caption" themeColor="textSecondary" text={text} style={styles.demoLabel} />
    </SpeakFrame>
  );
  return (
    <SpeakFrame unit={unit}>
      <View style={[styles.demo, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]} accessibilityLabel={demo.label(title)}>
        <View style={styles.demoHeader}>
          <Badge label={demo.badge} color="statusWarn" background="statusWarnSoft" />
          <ThemedText type="bodySemiBold" style={styles.flex} accessibilityRole="header">
            {title}
          </ThemedText>
        </View>
        <ThemedText type="secondary" themeColor="textSecondary">
          {demo.disclaimer}
        </ThemedText>

        <View style={[styles.demoAsk, { backgroundColor: theme.primarySoft, borderLeftColor: theme.primary }]}>
          <View style={styles.demoBoxHeader}>
            <Icon name="chat_bubble" size={16} color="primaryText" />
            <View style={styles.flex}>{label('prompt', demo.youAsk)}</View>
            <Button title={copied ? strings.copied : strings.copy} icon={copied ? 'check' : 'content_copy'} size="small" variant="ghost" onPress={copy} accessibilityLabel={demo.copyPrompt(title)} />
          </View>
          <SpeakFrame unit={unit ? demoTextUnit(unit, 'prompt') : null} marker="none">
            <SpokenText unit={unit ? demoTextUnit(unit, 'prompt') : null} type="body" text={prompt} selectable />
          </SpeakFrame>
        </View>

        <View style={[styles.demoAnswer, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
          <View style={styles.demoBoxHeader}>
            <Icon name="auto_awesome" size={16} color="textSecondary" />
            <View style={styles.flex}>{label('output', demo.answer)}</View>
          </View>
          <SpeakFrame unit={unit ? demoTextUnit(unit, 'output') : null} marker="none">
            <SpokenText unit={unit ? demoTextUnit(unit, 'output') : null} type="body" text={output} selectable />
          </SpeakFrame>
        </View>

        <View style={[styles.demoNotice, { backgroundColor: theme.statusOkSoft }]}>
          <View style={styles.demoBoxHeader}>
            <Icon name="lightbulb" size={16} color="statusOk" />
            <View style={styles.flex}>{label('notice', demo.notice)}</View>
          </View>
          <SpeakFrame unit={unit ? demoTextUnit(unit, 'notice') : null} marker="none">
            <SpokenText unit={unit ? demoTextUnit(unit, 'notice') : null} type="body" text={notice} keyTerms />
          </SpeakFrame>
        </View>
      </View>
    </SpeakFrame>
  );
}

/** Narrowest a column may get before the table scrolls sideways instead of squeezing its words. */
const MIN_COLUMN = 110;

/**
 * A comparison table that uses the whole width: its columns share the room (no empty strip beside a two-column table), and only a table
 * with too many columns to fit at a readable width scrolls sideways. The first column is the row label.
 */
function ComparisonTable({ headers, rows, caption }: { headers: string[]; rows: string[][]; caption?: string }) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const fits = width === 0 || headers.length * MIN_COLUMN <= width;
  const cellStyle = fits ? styles.cellFill : styles.cell;
  const box = (
        <View style={[styles.tableBox, fits && styles.tableFill, { borderColor: theme.border }]} accessibilityRole="list">
          <View style={[styles.tableRow, { backgroundColor: theme.primarySoft }]}>
            {headers.map((header, column) => (
              <ThemedText key={column} type="secondarySemiBold" themeColor="primaryText" style={cellStyle}>
                {header}
              </ThemedText>
            ))}
          </View>
          {rows.map((row, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 ? theme.backgroundSelected : theme.backgroundElement }]} accessible accessibilityLabel={row.map((cell, column) => `${headers[column] ?? ''}: ${cell}`).join('. ')}>
              {row.map((cell, column) => (
                <ThemedText key={column} type={column === 0 ? 'secondarySemiBold' : 'secondary'} style={cellStyle}>
                  {cell}
                </ThemedText>
              ))}
            </View>
          ))}
        </View>
  );
  return (
    <View style={styles.table} onLayout={(event) => setWidth(Math.floor(event.nativeEvent.layout.width))}>
      {fits ? (
        box
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {box}
        </ScrollView>
      )}
      {caption ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {caption}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelled: {
    gap: Spacing.one,
  },
  audienceLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sources: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.three,
    rowGap: Spacing.one,
    marginTop: Spacing.one,
  },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    minHeight: MinTouchSize,
  },
  pressed: {
    opacity: 0.6,
  },
  flex: {
    flex: 1,
  },
  visual: {
    gap: Spacing.two,
  },
  details: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  detailsBody: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  demo: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  demoLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  demoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize - Spacing.two,
  },
  // The learner's side of the exchange: a quote bar down the left edge.
  demoAsk: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderLeftWidth: 4,
  },
  demoAnswer: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  demoNotice: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
  },
  takeaways: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
  },
  table: {
    gap: Spacing.two,
  },
  tableBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 132,
    padding: Spacing.two + 2,
  },
  cellFill: {
    flex: 1,
    padding: Spacing.two + 2,
  },
  tableFill: {
    alignSelf: 'stretch',
  },
  stack: {
    gap: Spacing.three,
  },
  reading: {
    lineHeight: 24,
  },
  heading: {
    marginTop: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
  listItem: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  marker: {
    minWidth: 18,
    lineHeight: 24,
  },
  listText: {
    flex: 1,
  },
  callout: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
  },
  calloutText: {
    flex: 1,
    gap: Spacing.half,
  },
});
