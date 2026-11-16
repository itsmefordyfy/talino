import { describe, expect, test } from '@jest/globals';

import { certificateHtml } from './certificate-html';
import { SIGNATURE_DATA_URI, SIGNER_NAME, SIGNER_TITLE } from './signature';

const input = { learnerName: 'Ana Reyes', courseTitle: 'AI Engineering Basics', issued: 'November 14, 2026', master: false };

describe('certificateHtml', () => {
  test('is signed by the founder, for a course and for Talino Master', () => {
    for (const master of [false, true]) {
      const html = certificateHtml({ ...input, master });
      expect(html).toContain(SIGNER_NAME);
      expect(html).toContain(SIGNER_TITLE);
      expect(html).toContain(SIGNATURE_DATA_URI);
    }
  });

  test('the signature is a PNG data URI', () => {
    expect(SIGNATURE_DATA_URI.startsWith('data:image/png;base64,iVBOR')).toBe(true);
  });

  test('reads as a certificate: the learner, the course, the date and the seal', () => {
    const html = certificateHtml(input);
    expect(html).toContain('This is to certify that');
    expect(html).toContain('Ana Reyes');
    expect(html).toContain('has successfully completed');
    expect(html).toContain('AI Engineering Basics');
    expect(html).toContain('November 14, 2026');
    expect(html).toContain('class="seal"');
  });

  test('says Talino, never the old name Talino AI', () => {
    expect(certificateHtml(input)).not.toMatch(/Talino\s*(<[^>]+>\s*)*AI\b/);
  });

  test('escapes the name and the course title', () => {
    const html = certificateHtml({ ...input, learnerName: '<b>Ana</b> & Co', courseTitle: 'Fish "&" Chips' });
    expect(html).toContain('&lt;b&gt;Ana&lt;/b&gt; &amp; Co');
    expect(html).toContain('Fish &quot;&amp;&quot; Chips');
    expect(html).not.toContain('<b>Ana</b>');
  });

  test('carries no verification link, number or QR code', () => {
    const html = certificateHtml(input);
    expect(html).not.toContain('Certificate no.');
    expect(html).not.toContain('Verify');
    expect(html).not.toContain('class="qr"');
  });

  test('Talino Master has its own line', () => {
    expect(certificateHtml({ ...input, master: true })).toContain('completed every Talino career course');
  });
});
