/** What a profile needs to read well on a résumé and a portfolio, in the order to ask for it. */
export const PROFILE_CHECKS = ['name', 'headline', 'summary', 'email', 'location', 'links'] as const;
export type ProfileCheck = (typeof PROFILE_CHECKS)[number];

export type ProfileFields = {
  name: string;
  headline: string;
  summary: string;
  email: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

const filled = (value: string) => value.trim() !== '';

/** How complete the profile is (0 to 100) and what is still missing, first thing to add first. */
export function profileCompleteness(fields: ProfileFields): { percent: number; missing: ProfileCheck[] } {
  const done: Record<ProfileCheck, boolean> = {
    name: filled(fields.name),
    headline: filled(fields.headline),
    summary: fields.summary.trim().length >= 40,
    email: filled(fields.email),
    location: filled(fields.location),
    links: filled(fields.website) || filled(fields.linkedin) || filled(fields.github),
  };
  const missing = PROFILE_CHECKS.filter((check) => !done[check]);
  return { percent: Math.round(((PROFILE_CHECKS.length - missing.length) / PROFILE_CHECKS.length) * 100), missing };
}
