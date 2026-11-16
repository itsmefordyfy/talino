/** What brought the learner to the paywall: it picks the headline, so the page leads with the thing they just reached for. */
export const PAYWALL_REASONS = ['default', 'courses', 'tali', 'resume', 'backup', 'kit'] as const;
export type PaywallReason = (typeof PAYWALL_REASONS)[number];

export function paywallReason(value: unknown): PaywallReason {
  return PAYWALL_REASONS.find((reason) => reason === value) ?? 'default';
}
