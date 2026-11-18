/** Software Architecture with AI: the learner's saved diagrams, decision records and matrices, and what the project review is told about them. */
export * from './types';
export { deleteArtifact, getArtifact, listArtifacts, listArtifactsForProject, saveArtifact, type SaveArtifactInput, type SaveArtifactResult } from './api/artifacts-repo';
export { useArtifact, useArtifacts, useDeleteArtifact, useProjectArtifacts, useSaveArtifact } from './hooks/use-artifacts';
export { artifactsSummaryText, MAX_ARTIFACT_SUMMARY_CHARS } from './lib/review-summary';
export { architectureStrings } from './strings';
export { ProjectArtifactsNote, type ProjectArtifactsNoteProps } from './components/project-artifacts-note';
