/** What the Software Architecture with AI course's tools keep: the learner's own diagrams, decision records and trade-off matrices. */
export const ARTIFACT_KINDS = ['diagram', 'adr', 'matrix'] as const;
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  /** A diagram's Mermaid text; an ADR's or a matrix's JSON (read back defensively by the tool that wrote it). */
  content: string;
  /** The architecture project (`software-architecture-ai-p1`…) the learner attached it to, if any. */
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Longest title and content kept, so one tool can never fill the database. */
export const MAX_ARTIFACT_TITLE = 120;
export const MAX_ARTIFACT_CONTENT = 20_000;
/** Most artifacts of each kind kept; saving past it asks the learner to delete one. */
export const MAX_ARTIFACTS_PER_KIND = 60;

export const isArtifactKind = (value: unknown): value is ArtifactKind => typeof value === 'string' && (ARTIFACT_KINDS as readonly string[]).includes(value);
