import { describe, expect, test } from '@jest/globals';

import { profileCompleteness, type ProfileFields } from './profile-completeness';

const full: ProfileFields = { name: 'Ana', headline: 'Developer', summary: 'I build mobile apps with React Native and love small, useful tools.', email: 'a@b.co', location: 'Naga', website: '', linkedin: 'ana', github: '' };

describe('profileCompleteness', () => {
  test('a full profile is 100 with nothing missing', () => {
    expect(profileCompleteness(full)).toEqual({ percent: 100, missing: [] });
  });

  test('an empty one is 0 and asks for the name first', () => {
    const empty = { name: '', headline: '', summary: '', email: '', location: '', website: '', linkedin: '', github: '' };
    expect(profileCompleteness(empty)).toMatchObject({ percent: 0, missing: ['name', 'headline', 'summary', 'email', 'location', 'links'] });
  });

  test('a one-line summary doesn’t count, and any one link does', () => {
    expect(profileCompleteness({ ...full, summary: 'Developer.' }).missing).toEqual(['summary']);
    expect(profileCompleteness({ ...full, linkedin: '', github: 'ana' }).missing).toEqual([]);
    expect(profileCompleteness({ ...full, linkedin: '' }).missing).toEqual(['links']);
  });
});
