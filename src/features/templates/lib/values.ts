import type { Placeholder } from './fill';

export type ValueSources = {
  name: string;
  headline: string | null;
  /** Résumé skills, the learner's own first. */
  skills: readonly string[];
  /** Passed Talino projects, oldest first. */
  talinoProjects: readonly { title: string; link: string | null }[];
  /** Projects the learner added to the résumé themselves. */
  ownProjects: readonly string[];
  portfolioLink: string | null;
  course: string | null;
};

const MAX_SKILLS = 5;

/** "A, B and C". */
function joinList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? '';
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

/** The values the templates are filled with; null where the learner hasn't given Talino one yet. */
export function templateValues(sources: ValueSources): Record<Placeholder, string | null> {
  // The newest reviewed project is the one most worth pointing at.
  const latest = sources.talinoProjects[sources.talinoProjects.length - 1];
  const skills = sources.skills.slice(0, MAX_SKILLS);
  return {
    name: sources.name.trim() || null,
    headline: sources.headline?.trim() || null,
    skills: skills.length > 0 ? joinList(skills) : null,
    topProject: latest?.title ?? sources.ownProjects[0] ?? null,
    topProjectLink: latest?.link ?? null,
    portfolioLink: sources.portfolioLink,
    course: sources.course,
  };
}
