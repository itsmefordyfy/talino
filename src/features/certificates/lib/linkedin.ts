/**
 * LinkedIn's "Add to profile" link for a certification, filled in (name, issuer, date, link, number).
 * The learner confirms on LinkedIn; nothing is posted for them.
 */
export function linkedInAddUrl(input: { name: string; issuedAt: string; url: string | null; certId: string | null }): string {
  const date = new Date(input.issuedAt);
  const params = new URLSearchParams({ startTask: 'CERTIFICATION_NAME', name: input.name, organizationName: 'Talino', issueYear: String(date.getFullYear()), issueMonth: String(date.getMonth() + 1) });
  if (input.url) params.set('certUrl', input.url);
  if (input.certId) params.set('certId', input.certId);
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
