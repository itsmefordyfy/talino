import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { formatDate } from '@/lib/dates';

import { AI_TOOLS } from '../content/ai-dev/tools';
import { AI_DEV_TOOL_COURSES } from '../content/ai-dev/syllabus';
import type { AiTool } from '../content/types';
import { courseStrings } from '../strings';

/** The course that teaches a tool in depth, if the path has one. */
const courseFor = (tool: AiTool) => Object.entries(AI_DEV_TOOL_COURSES).find(([, toolId]) => toolId === tool.id)?.[0] ?? null;

/**
 * The path's AI tools comparison as a reference: what each tool is, what it suits, its limits, how it
 * gets context, what it can do on its own, where it works and which plans include it. Read from the
 * one tools file, with the date each entry was checked and links to the official docs.
 */
export function AiToolsScreen() {
  const strings = useLocalized(courseStrings);
  if (AI_TOOLS.length === 0) {
    return (
      <Screen>
        <EmptyState icon="compare_arrows" title={strings.toolsEmpty} />
      </Screen>
    );
  }
  return (
    <Screen>
      <ThemedText type="body" themeColor="textSecondary">
        {strings.toolsIntro}
      </ThemedText>
      {AI_TOOLS.map((tool) => {
        const courseId = courseFor(tool);
        return (
          <Card key={tool.id}>
            <View style={styles.stack}>
              <View style={styles.header}>
                <View style={styles.flex}>
                  <ThemedText type="cardTitle" accessibilityRole="header">
                    {tool.name}
                  </ThemedText>
                  <ThemedText type="secondary" themeColor="textSecondary">{`${tool.kind} · ${tool.maker}`}</ThemedText>
                </View>
                <Badge label={strings.toolsCheckedOn(formatDate(tool.checked))} color="textSecondary" background="backgroundSelected" />
              </View>
              <Facts title={strings.toolsBestFor} items={tool.bestFor} />
              <Facts title={strings.toolsStrengths} items={tool.strengths} />
              <Facts title={strings.toolsLimits} items={tool.limits} />
              <Fact title={strings.toolsContext} text={tool.context} />
              <Fact title={strings.toolsAgent} text={tool.agent} />
              <Fact title={strings.toolsIntegrations} text={tool.integrations} />
              <Fact title={strings.toolsPlans} text={tool.plans} />
              <View>
                <ThemedText type="secondarySemiBold">{strings.toolsDocs}</ThemedText>
                {tool.sources.map((source) => (
                  <ListRow key={source.url} title={source.label} icon="open_in_new" onPress={() => void WebBrowser.openBrowserAsync(source.url)} showChevron={false} />
                ))}
              </View>
              {courseId && <Button title={strings.toolsCourse} icon="school" variant="secondary" size="small" onPress={() => router.push({ pathname: '/course/[id]', params: { id: courseId } })} />}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

function Facts({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.fact}>
      <ThemedText type="secondarySemiBold">{title}</ThemedText>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <ThemedText type="body" themeColor="primaryText">
            •
          </ThemedText>
          <ThemedText type="body" style={styles.flex}>
            {item}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function Fact({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.fact}>
      <ThemedText type="secondarySemiBold">{title}</ThemedText>
      <ThemedText type="body">{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  fact: {
    gap: Spacing.one,
  },
  item: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
