import type { Artifact } from '../types';

/** The most characters of saved work the project review reads (the server caps it again: a modified app can send anything). */
export const MAX_ARTIFACT_SUMMARY_CHARS = 5000;
const PER_ARTIFACT_CHARS = 1200;
const MAX_ARTIFACTS = 8;

const KIND_LABEL = { diagram: 'Diagram (Mermaid text)', adr: 'Decision record', matrix: 'Trade-off matrix' } as const;

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

/**
 * What the app tells the project review about the learner's saved architecture work for that project: each artifact's kind, title and (clipped) content, newest
 * first. It is the learner's own work on this phone, sent as labelled context; the review still judges the submission. Empty when nothing is saved for the project.
 */
export function artifactsSummaryText(artifacts: readonly Artifact[]): string {
  const lines: string[] = [];
  let used = 0;
  for (const artifact of artifacts.slice(0, MAX_ARTIFACTS)) {
    const entry = `### ${KIND_LABEL[artifact.kind]}: ${artifact.title}\n${clip(artifact.content.replace(/\r/g, ''), PER_ARTIFACT_CHARS)}`;
    if (used + entry.length > MAX_ARTIFACT_SUMMARY_CHARS) break;
    lines.push(entry);
    used += entry.length;
  }
  return lines.join('\n\n');
}
