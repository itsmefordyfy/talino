import { describe, expect, test } from '@jest/globals';

import { exportFileBase } from './export-name';

describe('exportFileBase', () => {
  test('is the person\'s name in a form every share target accepts', () => {
    expect(exportFileBase('Ana Cruz', 'My résumé')).toBe('ana-cruz-resume');
    expect(exportFileBase('José Ñ. de la Cruz', 'x')).toBe('jose-n-de-la-cruz-resume');
  });

  test('falls back to the résumé\'s own name, then to "my"', () => {
    expect(exportFileBase('', 'Frontend – Acme')).toBe('frontend-acme-resume');
    expect(exportFileBase('', '')).toBe('my-resume');
    expect(exportFileBase('日本語', '日本語')).toBe('my-resume');
  });

  test('is never long', () => {
    expect(exportFileBase('a'.repeat(200), '').length).toBeLessThanOrEqual(48);
  });
});
