import { shareBytes, sharePdf } from '@/lib/share-file';

import type { ResumeContent } from '../lib/document';
import { buildDocx } from '../lib/docx';
import { exportFileBase } from '../lib/export-name';
import { docHtml, SPACING } from '../lib/render';
import { PAPER_POINTS, type ResumeStyle } from '../lib/templates';

/** Prints the résumé to a PDF at its paper size and opens the share sheet. False when sharing isn't available on this phone. */
export function exportPdf(content: ResumeContent, style: ResumeStyle, documentName: string): Promise<boolean> {
  const { vertical, horizontal } = SPACING[style.density].margin;
  return sharePdf(docHtml(content, style), `${exportFileBase(content.name, documentName)}.pdf`, { ...PAPER_POINTS[style.paper], margins: { top: vertical, bottom: vertical, left: horizontal, right: horizontal } });
}

/** Makes the Word file and opens the share sheet. False when sharing isn't available on this phone. */
export function exportDocx(content: ResumeContent, style: ResumeStyle, documentName: string): Promise<boolean> {
  return shareBytes(buildDocx(content, style), `${exportFileBase(content.name, documentName)}.docx`, {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uti: 'org.openxmlformats.wordprocessingml.document',
  });
}
