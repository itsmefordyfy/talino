import { usePortfolioLink } from '@/features/portfolio';
import { useResumeSources } from '@/features/resume';

import type { Placeholder } from '../lib/fill';
import { templateValues } from '../lib/values';

/** The template values from the résumé's sources and the published portfolio's link. */
export function useTemplateValues() {
  const sources = useResumeSources();
  const portfolioLink = usePortfolioLink();
  const achievements = sources.achievements;
  const ownSkills = sources.items.filter((item) => item.kind === 'skill').map((item) => item.title);
  const values: Record<Placeholder, string | null> | null = achievements
    ? templateValues({
        name: sources.name,
        headline: sources.profile?.headline ?? null,
        skills: [...ownSkills, ...achievements.skills.filter((skill) => !ownSkills.some((own) => own.toLowerCase() === skill.toLowerCase()))],
        talinoProjects: achievements.projects,
        ownProjects: sources.items.filter((item) => item.kind === 'project').map((item) => item.title),
        portfolioLink,
        course: achievements.currentCourse,
      })
    : null;
  return { isPending: sources.isPending, isError: sources.isError, refetch: sources.refetch, values };
}
