import { describe, expect, test } from '@jest/globals';

import { reviewUrlFor } from './store-review';

describe('reviewUrlFor', () => {
  test('hides the row until the store address is set', () => {
    expect(reviewUrlFor(null, 'ios')).toBeNull();
    expect(reviewUrlFor(undefined, 'android')).toBeNull();
    expect(reviewUrlFor('', 'ios')).toBeNull();
  });
  test('opens the write-review box on the App Store and the reviews on Google Play', () => {
    expect(reviewUrlFor('https://apps.apple.com/app/id123', 'ios')).toBe('https://apps.apple.com/app/id123?action=write-review');
    expect(reviewUrlFor('https://play.google.com/store/apps/details?id=x', 'android')).toBe('https://play.google.com/store/apps/details?id=x&showAllReviews=true');
  });
});
