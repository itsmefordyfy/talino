import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import type { KitSwatch } from '@/constants/theme';

/**
 * Talino's career kit: editable templates for the documents a tech career needs, as real files the learner downloads and keeps. A Word
 * file (.docx) opens and edits in Microsoft Word, Pages, Google Docs and Canva, and a PowerPoint file (.pptx) in PowerPoint, Keynote,
 * Google Slides and Canva, so nobody is tied to one app and nothing is a link that can go dead. Each template comes in three looks, each
 * its own file. The files are made by `scripts/career-kit/generate_docs.py` and `generate_decks.py` into `assets/career-kit`, and are
 * bundled with the app (`files.ts`), so a download works offline. Written by Claude, 2026-11-15.
 */
export const KIT_KINDS = ['resume', 'portfolio', 'case-study', 'proposal', 'invoice'] as const;
export type KitKind = (typeof KIT_KINDS)[number];

/** How a look arranges the page: the drawn preview follows it. */
export type KitLayout = 'sidebar' | 'header' | 'minimal' | 'hero' | 'cards' | 'split';

/** The file types of the kit: what they are called, and what the share sheet needs to offer the right apps. */
export const KIT_FORMATS = {
  docx: { label: 'Word', extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uti: 'org.openxmlformats.wordprocessingml.document' },
  pptx: { label: 'PowerPoint', extension: 'pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', uti: 'org.openxmlformats.presentationml.presentation' },
} as const;
export type KitFormat = keyof typeof KIT_FORMATS;

export type KitStyle = {
  id: string;
  name: string;
  layout: KitLayout;
  accent: KitSwatch;
};

export type KitTemplate = {
  id: string;
  kind: KitKind;
  icon: MaterialSymbolName;
  format: KitFormat;
  /** The start of each look's file name: `<filePrefix>-<style id>.<format>` in `assets/career-kit`. */
  filePrefix: string;
  /** What the downloaded file is called on the phone. */
  downloadName: string;
  styles: readonly KitStyle[];
};

export const KIT_TEMPLATES: readonly KitTemplate[] = [
  {
    id: 'developer-resume',
    kind: 'resume',
    icon: 'description',
    format: 'docx',
    filePrefix: 'resume',
    downloadName: 'Talino Resume',
    styles: [
      { id: 'sidebar', name: 'Sidebar', layout: 'sidebar', accent: 'navy' },
      { id: 'header', name: 'Header', layout: 'header', accent: 'violet' },
      { id: 'minimal', name: 'Minimal', layout: 'minimal', accent: 'ink' },
    ],
  },
  {
    id: 'portfolio-sheet',
    kind: 'portfolio',
    icon: 'folder_open',
    format: 'docx',
    filePrefix: 'portfolio',
    downloadName: 'Talino Portfolio',
    styles: [
      { id: 'spotlight', name: 'Spotlight', layout: 'hero', accent: 'violet' },
      { id: 'grid', name: 'Project grid', layout: 'cards', accent: 'forest' },
      { id: 'story', name: 'Story', layout: 'split', accent: 'navy' },
    ],
  },
  {
    id: 'case-study-deck',
    kind: 'case-study',
    icon: 'slideshow',
    format: 'pptx',
    filePrefix: 'case-study',
    downloadName: 'Talino Case Study',
    styles: [
      { id: 'bold', name: 'Bold', layout: 'hero', accent: 'violet' },
      { id: 'clean', name: 'Clean', layout: 'minimal', accent: 'slate' },
      { id: 'dark', name: 'Dark', layout: 'header', accent: 'ink' },
    ],
  },
  {
    id: 'client-proposal',
    kind: 'proposal',
    icon: 'article',
    format: 'docx',
    filePrefix: 'proposal',
    downloadName: 'Talino Proposal',
    styles: [
      { id: 'tiers', name: 'Three tiers', layout: 'cards', accent: 'violet' },
      { id: 'one-page', name: 'One page', layout: 'split', accent: 'navy' },
      { id: 'letter', name: 'Letter', layout: 'minimal', accent: 'forest' },
    ],
  },
  {
    id: 'freelance-invoice',
    kind: 'invoice',
    icon: 'receipt_long',
    format: 'docx',
    filePrefix: 'invoice',
    downloadName: 'Talino Invoice',
    styles: [
      { id: 'classic', name: 'Classic', layout: 'header', accent: 'navy' },
      { id: 'modern', name: 'Modern', layout: 'sidebar', accent: 'violet' },
      { id: 'compact', name: 'Compact', layout: 'minimal', accent: 'ink' },
    ],
  },
];

export function getKitTemplate(id: string | undefined): KitTemplate | undefined {
  return KIT_TEMPLATES.find((template) => template.id === id);
}

export function templatesOfKind(kind: KitKind | 'all'): KitTemplate[] {
  return kind === 'all' ? [...KIT_TEMPLATES] : KIT_TEMPLATES.filter((template) => template.kind === kind);
}

/** The key of a look's bundled file (`files.ts`): `resume-sidebar`. */
export function kitFileKey(template: Pick<KitTemplate, 'filePrefix'>, style: Pick<KitStyle, 'id'>): string {
  return `${template.filePrefix}-${style.id}`;
}

/** The file name on disk in `assets/career-kit`: `resume-sidebar.docx`. */
export function kitAssetName(template: Pick<KitTemplate, 'filePrefix' | 'format'>, style: Pick<KitStyle, 'id'>): string {
  return `${kitFileKey(template, style)}.${KIT_FORMATS[template.format].extension}`;
}

/** What the downloaded file is called when it is saved or shared: `Talino Resume - Sidebar.docx`. */
export function kitDownloadName(template: Pick<KitTemplate, 'downloadName' | 'format'>, style: Pick<KitStyle, 'name'>): string {
  return `${template.downloadName} - ${style.name}.${KIT_FORMATS[template.format].extension}`;
}
