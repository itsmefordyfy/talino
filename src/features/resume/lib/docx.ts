import type { ResumeContent } from './document';
import { contactLine, docBlocks, photoOf, SPACING } from './render';
import { ACCENT_HEX, PAPER_TWIPS, TEMPLATES, WORD_FONTS, type ResumeStyle } from './templates';
import { makeZip, readZipEntry, type Inflate } from './zip';

/** Text made safe for XML: markup escaped, and the control characters XML forbids dropped. */
export function xmlText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"';

/** The picture's size on the page: 0.9 inch square, in EMU (914400 to the inch), drawn as a circle. */
const PHOTO_EMU = 822960;

/** An inline picture in its own paragraph, pointing at the image part by relationship id. */
function photoParagraph(align?: 'center'): string {
  const size = `cx="${PHOTO_EMU}" cy="${PHOTO_EMU}"`;
  const drawing = `<w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent ${size}/><wp:docPr id="1" name="Profile photo" descr="Profile photo"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="photo.jpg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId3"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext ${size}/></a:xfrm><a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>`;
  return `<w:p><w:pPr><w:spacing w:before="0" w:after="80"/>${align ? `<w:jc w:val="${align}"/>` : ''}</w:pPr><w:r>${drawing}</w:r></w:p>`;
}
const TWIPS_PER_POINT = 20;
const MARGIN = 1080; // 0.75 inch

type RunLook = { bold?: boolean; italic?: boolean; size?: number; color?: string; caps?: boolean };

function run(text: string, look: RunLook = {}): string {
  const props = [look.bold ? '<w:b/>' : '', look.italic ? '<w:i/>' : '', look.caps ? '<w:caps/>' : '', look.color ? `<w:color w:val="${look.color}"/>` : '', look.size ? `<w:sz w:val="${look.size}"/>` : ''].join('');
  return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}<w:t xml:space="preserve">${xmlText(text)}</w:t></w:r>`;
}

type ParagraphLook = { align?: 'center'; before?: number; after?: number; keepNext?: boolean; border?: string; borderSize?: number; tabAt?: number; bullet?: boolean };

function paragraph(runs: string, look: ParagraphLook = {}): string {
  const props = [
    look.keepNext ? '<w:keepNext/>' : '',
    look.border ? `<w:pBdr><w:bottom w:val="single" w:sz="${look.borderSize ?? 6}" w:space="1" w:color="${look.border}"/></w:pBdr>` : '',
    look.tabAt ? `<w:tabs><w:tab w:val="right" w:pos="${look.tabAt}"/></w:tabs>` : '',
    look.bullet ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : '',
    `<w:spacing w:before="${look.before ?? 0}" w:after="${look.after ?? 40}"/>`,
    look.align ? `<w:jc w:val="${look.align}"/>` : '',
  ].join('');
  return `<w:p><w:pPr>${props}</w:pPr>${runs}</w:p>`;
}

/** The résumé as a Word document: the same blocks, order, accent, font and paper as the preview and the PDF. */
export function buildDocx(content: ResumeContent, style: ResumeStyle): Uint8Array {
  const template = TEMPLATES[style.template];
  const space = SPACING[style.density];
  const accent = ACCENT_HEX[style.accent].slice(1);
  const { width: pageWidth, height: pageHeight } = PAPER_TWIPS[style.paper];
  const textWidth = pageWidth - 2 * MARGIN;
  const body = Math.round(space.body * 2); // half-points
  const align = template.centered ? ('center' as const) : undefined;
  const sectionGap = Math.round(space.section * TWIPS_PER_POINT);
  const entryGap = Math.round(space.entry * TWIPS_PER_POINT);

  // The header ends with a rule, as on the page: black on the classic template, the accent on the others.
  const headerRule = { border: template.heading === 'rule' ? '111111' : accent, borderSize: template.heading === 'rule' ? 12 : 16 };
  const contact = contactLine(content);
  const last = contact.length > 0 ? 'contact' : content.headline ? 'headline' : 'name';
  const closing = (part: typeof last) => (part === last ? { ...headerRule, after: 80 } : {});
  const photo = photoOf(content, style);
  const parts: string[] = [...(photo ? [photoParagraph(align)] : []), paragraph(run(content.name, { bold: true, size: 46, color: accent }), { align, after: 20, ...closing('name') })];
  if (content.headline) parts.push(paragraph(run(content.headline, { bold: true, size: 25 }), { align, after: 40, ...closing('headline') }));
  if (contact.length > 0) parts.push(paragraph(run(contact.join(' | '), { size: body - 2, color: '333333' }), { align, after: 40, ...closing('contact') }));

  for (const block of docBlocks(content, style)) {
    parts.push(paragraph(run(block.heading, { bold: true, caps: true, size: 23, color: template.heading === 'rule' ? undefined : accent }), { before: sectionGap, after: 60, keepNext: true, border: template.heading === 'bar' ? accent : '999999' }));
    for (const line of block.paragraphs) parts.push(paragraph(run(line)));
    for (const line of block.bullets) parts.push(paragraph(run(line), { bullet: true, after: 20 }));
    for (const entry of block.entries) {
      parts.push(paragraph(run(entry.title, { bold: true }) + (entry.dates ? `<w:r><w:tab/></w:r>${run(entry.dates, { color: '333333' })}` : ''), { tabAt: textWidth, keepNext: true, before: entryGap, after: 0 }));
      if (entry.subtitle) parts.push(paragraph(run(entry.subtitle, { italic: true, color: '333333' }), { keepNext: entry.bullets.length > 0, after: 20 }));
      for (const line of entry.bullets) parts.push(paragraph(run(line), { bullet: true, after: 20 }));
      if (entry.link) parts.push(paragraph(run(entry.link, { size: body - 2, color: '333333' })));
    }
  }

  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${parts.join('')}<w:sectPr><w:pgSz w:w="${pageWidth}" w:h="${pageHeight}"/><w:pgMar w:top="${MARGIN}" w:right="${MARGIN}" w:bottom="${MARGIN}" w:left="${MARGIN}" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const font = WORD_FONTS[style.font];
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}" w:eastAsia="${font}"/><w:sz w:val="${body}"/><w:szCs w:val="${body}"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>`;
  const numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="260"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;
  const encoder = new TextEncoder();
  const file = (name: string, text: string) => ({ name, data: encoder.encode(text) });
  return makeZip([
    file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>'),
    file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'),
    file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>' + (photo ? '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/photo.jpg"/>' : '') + '</Relationships>'),
    file('word/document.xml', document),
    file('word/styles.xml', styles),
    file('word/numbering.xml', numbering),
    ...(photo ? [{ name: 'word/media/photo.jpg', data: Uint8Array.from(atob(photo), (char) => char.charCodeAt(0)) }] : []),
  ]);
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/**
 * The text of a Word (.docx) file: paragraphs on their own lines, tabs kept. Null when the bytes are not a readable
 * .docx. Used by the server to read an uploaded résumé; the file itself is never kept.
 */
export async function extractDocxText(bytes: Uint8Array, inflate: Inflate): Promise<string | null> {
  const data = await readZipEntry(bytes, 'word/document.xml', inflate);
  if (!data) return null;
  const xml = new TextDecoder().decode(data);
  return xml
    .replace(/<w:tab\s*\/>/g, '\t')
    .replace(/<w:br\s*\/>|<w:cr\s*\/>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
      if (code[0] === '#') {
        const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(point) && point > 0 && point < 0x110000 ? String.fromCodePoint(point) : '';
      }
      return ENTITIES[code.toLowerCase()] ?? match;
    })
    .replace(/[  ]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

