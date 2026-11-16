import { describe, expect, test } from '@jest/globals';

import { focusFrom } from './focus';

describe('focusFrom', () => {
  test('says nothing when the learner pointed nowhere', () => {
    expect(focusFrom({ goals: ['from-scratch', 'explore-cs'], interests: ['not-sure'] }, null)).toEqual([]);
  });

  test('reads direction from goals and interests, once each', () => {
    expect(focusFrom({ goals: ['mobile', 'freelance'], interests: ['react-native', 'ai-apps'] }, null).sort()).toEqual(['ai', 'freelance', 'mobile']);
  });

  test("the learner's own choice wins, and a bad one is ignored", () => {
    expect(focusFrom({ goals: ['mobile'], interests: [] }, ['web'])).toEqual(['web']);
    expect(focusFrom({ goals: ['mobile'], interests: [] }, [])).toEqual(['mobile']);
    expect(focusFrom({ goals: [], interests: [] }, ['nonsense'] as never)).toEqual([]);
  });
});
