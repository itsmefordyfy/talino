import { describe, expect, test } from '@jest/globals';

import { focusFrom } from './focus';

describe('focusFrom', () => {
  test('says nothing when the learner pointed nowhere', () => {
    expect(focusFrom({ goals: ['from-scratch', 'explore-cs'], interests: ['not-sure'] }, null)).toEqual([]);
  });

  test('reads direction from goals and interests, once each', () => {
    expect(focusFrom({ goals: ['mobile', 'freelance'], interests: ['react-native', 'ai-apps'] }, null).sort()).toEqual(['ai', 'freelance', 'mobile']);
  });

  test('every direction a goal or an interest points at is read, including the plain AI interest and backend work', () => {
    expect(focusFrom({ goals: [], interests: ['ai'] }, null)).toEqual(['ai']);
    expect(focusFrom({ goals: ['data-science'], interests: [] }, null)).toEqual(['ai']);
    expect(focusFrom({ goals: [], interests: ['backend', 'express'] }, null)).toEqual(['web']);
    expect(focusFrom({ goals: ['frontend'], interests: ['nextjs'] }, null)).toEqual(['web']);
  });

  test("the learner's own choice wins, and a bad one is ignored", () => {
    expect(focusFrom({ goals: ['mobile'], interests: [] }, ['web'])).toEqual(['web']);
    expect(focusFrom({ goals: ['mobile'], interests: [] }, [])).toEqual(['mobile']);
    expect(focusFrom({ goals: [], interests: [] }, ['nonsense'] as never)).toEqual([]);
  });
});
