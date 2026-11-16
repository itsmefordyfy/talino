import { describe, expect, test } from '@jest/globals';

import { pageText, readableUrl, safeUrl } from './fetch-page';

describe('safeUrl', () => {
  test('public https only', () => {
    expect(safeUrl('https://github.com/a/b')).not.toBeNull();
    expect(safeUrl('http://example.com')).toBeNull();
    expect(safeUrl('https://localhost/x')).toBeNull();
    expect(safeUrl('https://127.0.0.1/x')).toBeNull();
    expect(safeUrl('https://[::1]/x')).toBeNull();
    expect(safeUrl('https://user:pw@example.com')).toBeNull();
    expect(safeUrl('https://printer.local')).toBeNull();
    expect(safeUrl('not a url')).toBeNull();
  });
});

describe('readableUrl', () => {
  test('a GitHub repo is read through its README', () => {
    expect(readableUrl(new URL('https://github.com/ana/todo-ai'))).toBe('https://raw.githubusercontent.com/ana/todo-ai/HEAD/README.md');
    expect(readableUrl(new URL('https://github.com/ana/todo-ai/tree/main'))).toBe('https://raw.githubusercontent.com/ana/todo-ai/main/README.md');
    expect(readableUrl(new URL('https://ana.dev/'))).toBe('https://ana.dev/');
  });
});

describe('pageText', () => {
  test('drops scripts, styles and tags', () => {
    expect(pageText('<html><style>p{}</style><script>x()</script><p>Hello &amp; welcome</p></html>')).toBe('Hello & welcome');
  });
});
