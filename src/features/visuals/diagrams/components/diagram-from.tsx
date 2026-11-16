import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { fallbackSummary, parseDiagramJson } from '../from-text';
import { parseMermaidSubset } from '../mermaid';
import { diagramStrings } from '../strings';
import type { DiagramResult } from '../types';
import { DiagramView, type DiagramViewProps } from './diagram-view';

type ViewOptions = Omit<DiagramViewProps, 'spec'>;

export type DiagramFallbackProps = { summary: string | null; errors?: readonly string[]; showErrors?: boolean };

/** What replaces a diagram that is missing or invalid: a calm notice and, when there is one, its plain-text summary. */
export function DiagramFallback({ summary, errors, showErrors = false }: DiagramFallbackProps) {
  const t = useLocalized(diagramStrings);
  return (
    <View style={styles.fallback}>
      <Notice tone="info" message={t.fallbackTitle} />
      <ThemedText type="body">{summary ?? t.fallbackEmpty}</ThemedText>
      {showErrors && errors?.slice(0, 3).map((error) => (
        <ThemedText key={error} type="caption" themeColor="textSecondary">
          {error}
        </ThemedText>
      ))}
    </View>
  );
}

function Rendered({ result, summary, options, showErrors }: { result: DiagramResult; summary: string | null; options: ViewOptions; showErrors: boolean }) {
  if (result.ok) return <DiagramView spec={result.spec} {...options} />;
  return <DiagramFallback summary={summary} errors={result.errors} showErrors={showErrors} />;
}

export type DiagramFromJsonProps = ViewOptions & {
  /** A parsed object or JSON text (a ```json fence is fine), usually from the AI mentor. Validated before anything is drawn. */
  json: unknown;
  showErrors?: boolean;
};

/** Validates untrusted JSON, then draws it; if it is not a valid diagram, shows its plain `summary` (if any) instead. */
export function DiagramFromJson({ json, showErrors = false, ...options }: DiagramFromJsonProps) {
  return <Rendered result={parseDiagramJson(json)} summary={fallbackSummary(json)} options={options} showErrors={showErrors} />;
}

export type DiagramFromMermaidProps = ViewOptions & {
  source: string;
  title?: string;
  summary?: string;
  showErrors?: boolean;
};

/** Parses the supported Mermaid subset, then draws it; unsupported Mermaid shows the friendly reason. */
export function DiagramFromMermaid({ source, title, summary, showErrors = true, ...options }: DiagramFromMermaidProps) {
  const result = parseMermaidSubset(source, { title, summary });
  return <Rendered result={result} summary={summary ?? null} options={options} showErrors={showErrors} />;
}

const styles = StyleSheet.create({
  fallback: { gap: Spacing.two },
});
