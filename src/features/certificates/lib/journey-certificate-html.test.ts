import { describe, expect, test } from '@jest/globals';

import { MasteryCertificateSwatches } from '@/constants/theme';

import { certificateHtml } from './certificate-html';
import { journeyCertificateHtml } from './journey-certificate-html';
import { SIGNATURE_DATA_URI, SIGNER_NAME } from './signature';

describe('journeyCertificateHtml (the AI Expert certificate PDF)', () => {
  const html = journeyCertificateHtml({ learnerName: 'Ana <Reyes>', issued: 'November 16, 2026' });

  test('certifies the learner as an AI Expert for the whole journey, every level named', () => {
    expect(html).toContain('AI EXPERT');
    expect(html).toContain('CERTIFICATE OF MASTERY');
    expect(html).toContain('Talino AI Builder Journey');
    for (const level of ['Beginner', 'Intermediate', 'Advanced', 'Expert']) expect(html).toContain(`>${level}<`);
    expect(html).toContain('November 16, 2026');
  });

  test('escapes the name, and is signed by the founder with the gold seal', () => {
    expect(html).toContain('Ana &lt;Reyes&gt;');
    expect(html).not.toContain('Ana <Reyes>');
    expect(html).toContain(SIGNER_NAME);
    expect(html).toContain(SIGNATURE_DATA_URI);
    expect(html).toContain('class="seal"');
  });

  test('looks unlike a course certificate: night and gold, not white paper', () => {
    expect(html).toContain(MasteryCertificateSwatches.nightDeep);
    expect(html).toContain(MasteryCertificateSwatches.gold);
    const course = certificateHtml({ learnerName: 'Ana', courseTitle: 'X', issued: 'Today', master: false });
    expect(course).not.toContain('AI EXPERT');
  });
});
