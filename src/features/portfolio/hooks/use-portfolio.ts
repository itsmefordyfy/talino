import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { monthYear, useProfilePhoto, useResumeSources } from '@/features/resume';
import { publicUrl } from '@/lib/api';

import { clearPortfolioState, readPortfolioOptions, readPortfolioState, savePortfolioOptions, savePortfolioState, type PortfolioOptions, type PortfolioState } from '../api/portfolio-state';
import { buildPortfolio, type PortfolioPayload } from '../lib/build-portfolio';
import { useProjects } from './use-projects';

export const portfolioKeys = { state: ['portfolio', 'state'] as const, options: ['portfolio', 'options'] as const };

export function usePortfolioOptions() {
  return useDbQuery(portfolioKeys.options, readPortfolioOptions);
}

export function useSavePortfolioOptions() {
  return useDbMutation((db, options: PortfolioOptions) => savePortfolioOptions(db, options));
}

export function usePortfolioState() {
  return useDbQuery(portfolioKeys.state, readPortfolioState);
}

/** The public page's address once published; null before, or in a build that knows no server. */
export function portfolioUrl(state: PortfolioState | null | undefined): string | null {
  return state ? publicUrl(`/p/${state.slug}`) : null;
}

export function usePortfolioLink(): string | null {
  return portfolioUrl(usePortfolioState().data);
}

/** The résumé's sources turned into exactly what the public page will show. */
export function usePortfolioPreview() {
  const sources = useResumeSources();
  const projects = useProjects();
  const options = usePortfolioOptions();
  const photo = useProfilePhoto();
  const portfolio: PortfolioPayload | null = sources.achievements && !projects.isPending && !options.isPending
    ? buildPortfolio({
        name: sources.name,
        profile: sources.profile,
        achievements: sources.achievements,
        customProjects: projects.data ?? [],
        photo: options.data?.showPhoto ? photo.data : null,
        ownSkills: sources.items.filter((item) => item.kind === 'skill').map((item) => item.title),
        formatIssued: (iso) => monthYear(iso) ?? '',
      })
    : null;
  // Earned but not yet verified: left off the public page, which only shows checkable certificates.
  return { isPending: sources.isPending || projects.isPending, isError: sources.isError || projects.isError, refetch: () => { sources.refetch(); void projects.refetch(); }, profile: sources.profile, portfolio };
}

export function useSavePortfolioState() {
  return useDbMutation((db, state: PortfolioState) => savePortfolioState(db, state));
}

export function useClearPortfolioState() {
  return useDbMutation((db) => clearPortfolioState(db));
}
