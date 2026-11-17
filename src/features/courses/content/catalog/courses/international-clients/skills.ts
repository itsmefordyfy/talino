import type { Course } from '../../../types';

/** The skill meter of Finding International Clients: one skill per module, so every module builds exactly one. */
export const SKILLS: Course['skills'] = [
  { id: 'market-research', label: 'Market research' },
  { id: 'niche-positioning', label: 'Niche and positioning' },
  { id: 'finding-clients', label: 'Finding clients' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'profile', label: 'Profile' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'client-communication', label: 'Client communication' },
  { id: 'negotiation', label: 'Discovery and negotiation' },
  { id: 'client-delivery', label: 'Contracts and onboarding' },
];
