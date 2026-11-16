import { describe, expect, test } from '@jest/globals';

import { isValidLink, parseSubmission, serializeSubmission } from './submission';

describe('submission', () => {
  test('round trip and older plain text', () => {
    expect(parseSubmission(serializeSubmission({ link: ' https://a.dev ', note: 'hi ' }))).toEqual({ link: 'https://a.dev', note: 'hi' });
    expect(parseSubmission('my proposal')).toEqual({ link: '', note: 'my proposal' });
    expect(parseSubmission(null)).toEqual({ link: '', note: '' });
  });
  test('links', () => {
    expect(isValidLink('https://github.com/a/b')).toBe(true);
    expect(isValidLink('http://github.com/a/b')).toBe(false);
    expect(isValidLink('github.com/a/b')).toBe(false);
  });
});
