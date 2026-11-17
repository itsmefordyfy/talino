import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Spacing } from '@/constants/theme';
import { tapFeedback } from '@/lib/haptics';

import type { PublicLab } from '../lib/public';
import type { PracticeText } from '../strings';

export type CollapsibleCardProps = {
  title: string;
  /** Said with the title and drawn under it, so what the card is cannot be missed (for an illustration). */
  badge?: string;
  openLabel: string;
  closeLabel: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

/** A card whose body the learner opens and closes. The whole header is one 44 pt target and says whether it is open. */
export function CollapsibleCard({ title, badge, openLabel, closeLabel, defaultOpen = false, children }: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${open ? closeLabel : openLabel}`}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          tapFeedback();
          setOpen((current) => !current);
        }}
        style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {title}
          </ThemedText>
          {badge ? <Badge label={badge} color="statusWarn" background="statusWarnSoft" /> : null}
        </View>
        <ThemedText type="secondarySemiBold" themeColor="primaryText">
          {open ? closeLabel : openLabel}
        </ThemedText>
        <Icon name={open ? 'expand_less' : 'expand_more'} size={22} color="textSecondary" />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </Card>
  );
}

export type LabGuideProps = { lab: PublicLab; text: PracticeText };

/** The checklist the review scores, shown while the learner writes. Not interactive: it is read, not ticked. */
export function LabChecklist({ lab, text }: LabGuideProps) {
  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {text.lab.checklistTitle}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.lab.checklistNote}
      </ThemedText>
      {lab.criteria.map((criterion) => (
        <View key={criterion.id} style={styles.bullet}>
          <Icon name="radio_button_unchecked" size={18} color="textSecondary" />
          <ThemedText type="body" style={styles.fill}>
            {criterion.label}
          </ThemedText>
        </View>
      ))}
    </Card>
  );
}

/** Ways to improve the prompt, written by the course (never model output). Shown once a run has come back. */
export function LabTips({ lab, text }: LabGuideProps) {
  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {text.lab.tipsTitle}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.lab.tipsNote}
      </ThemedText>
      {lab.tips.map((tip, index) => (
        <View key={index} style={styles.bullet}>
          <Icon name="lightbulb" size={18} color="primary" />
          <ThemedText type="body" style={styles.fill}>
            {tip}
          </ThemedText>
        </View>
      ))}
    </Card>
  );
}

/** What to check in any answer to this task. */
export function LabVerify({ lab, text }: LabGuideProps) {
  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {text.lab.verifyTitle}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.lab.verifyNote}
      </ThemedText>
      {lab.verify.map((item, index) => (
        <View key={index} style={styles.bullet}>
          <Icon name="fact_check" size={18} color="primary" />
          <ThemedText type="body" style={styles.fill}>
            {item}
          </ThemedText>
        </View>
      ))}
    </Card>
  );
}

/** The hand-written example, collapsed, and always badged as an illustration: it was never produced by a model. */
export function LabExample({ lab, text }: LabGuideProps) {
  return (
    <CollapsibleCard title={text.lab.exampleTitle} badge={text.lab.exampleBadge} openLabel={text.lab.showExample} closeLabel={text.lab.hideExample}>
      <View style={styles.block}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {text.lab.examplePrompt}
        </ThemedText>
        <ThemedText type="body" selectable>
          {lab.example.prompt}
        </ThemedText>
      </View>
      <View style={styles.block}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {text.lab.exampleOutcome}
        </ThemedText>
        <ThemedText type="body" selectable>
          {lab.example.outcome}
        </ThemedText>
      </View>
    </CollapsibleCard>
  );
}

/** The tools a tool-use lab's model may call: names and descriptions only (what each holds stays on the server). */
export function LabTools({ lab, text }: LabGuideProps) {
  if (!lab.tools || lab.tools.length === 0) return null;
  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {text.lab.toolsTitle}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.lab.toolsNote}
      </ThemedText>
      {lab.tools.map((tool) => (
        <View key={tool.name} style={styles.bullet}>
          <Icon name="build" size={18} color="primary" />
          <View style={styles.fill}>
            <ThemedText type="bodySemiBold">{`${tool.name}(${tool.params.map((param) => param.name).join(', ')})`}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {tool.description}
            </ThemedText>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: MinTouchSize },
  headerText: { flex: 1, gap: Spacing.one },
  body: { gap: Spacing.three },
  block: { gap: Spacing.one },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  fill: { flex: 1 },
});
