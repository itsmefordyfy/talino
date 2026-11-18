/** The Software Architecture with AI course's three projects, which a saved record can be attached to (`coach/lib/architecture.ts` reads the same ids). */
export const ARCHITECTURE_PROJECT_IDS = ['software-architecture-ai-p1', 'software-architecture-ai-p2', 'software-architecture-ai-p3'] as const;
export type ArchitectureProjectId = (typeof ARCHITECTURE_PROJECT_IDS)[number];

export const isArchitectureProjectId = (value: unknown): value is ArchitectureProjectId => typeof value === 'string' && (ARCHITECTURE_PROJECT_IDS as readonly string[]).includes(value);
