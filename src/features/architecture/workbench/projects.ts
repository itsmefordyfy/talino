/** The three Software Architecture with AI projects a saved diagram or matrix can be attached to (`projectId` of the saved row). */
export const ARCHITECTURE_PROJECT_IDS = ['software-architecture-ai-p1', 'software-architecture-ai-p2', 'software-architecture-ai-p3'] as const;
export type ArchitectureProjectId = (typeof ARCHITECTURE_PROJECT_IDS)[number];

export const projectShortName = (projectId: string | null): string | null => {
  const index = ARCHITECTURE_PROJECT_IDS.findIndex((id) => id === projectId);
  return index === -1 ? null : `P${index + 1}`;
};
