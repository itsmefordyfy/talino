import { ApiError, postJson } from '@/lib/api';

import type { PortfolioPayload } from '../lib/build-portfolio';

export type PublishInput = {
  /** Null the first time: the server picks the slug and returns the edit token once. */
  slug: string | null;
  editToken: string | null;
  portfolio: PortfolioPayload;
  talent: boolean;
  contactEmail: string;
};

/** Publishes or updates the page. The edit token comes back only when the page is new. */
export async function publishPortfolio(input: PublishInput): Promise<{ slug: string; editToken: string | null }> {
  const request = {
    action: 'publish',
    slug: input.slug ?? undefined,
    editToken: input.editToken ?? undefined,
    portfolio: input.portfolio,
    talent: input.talent,
    contactEmail: input.contactEmail,
  };
  // Screenshots travel in the same request (up to a few megabytes), so a slow connection gets a longer wait than the default.
  const body = await postJson('/api/portfolio', request, { timeoutMs: 90_000 });
  if (typeof body.slug !== 'string' || body.slug === '') throw new ApiError('unknown');
  return { slug: body.slug, editToken: typeof body.editToken === 'string' ? body.editToken : null };
}

export async function removePortfolio(slug: string, editToken: string): Promise<void> {
  const body = await postJson('/api/portfolio', { action: 'remove', slug, editToken });
  if (body.removed !== true) throw new ApiError('unknown');
}

export type PortfolioError = 'offline' | 'unavailable' | 'forbidden' | 'unknown';

export function portfolioError(error: unknown): PortfolioError {
  if (!(error instanceof ApiError)) return 'unknown';
  if (error.code === 'network') return 'offline';
  if (error.code === 'unavailable' || error.code === 'forbidden') return error.code;
  return 'unknown';
}
