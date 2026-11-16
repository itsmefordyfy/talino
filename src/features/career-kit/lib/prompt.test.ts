import { describe, expect, test } from '@jest/globals';

import { KIT_TEMPLATES } from '../content';
import { buildKitPrompt } from './prompt';

const resume = KIT_TEMPLATES.find((template) => template.kind === 'resume')!;
const deck = KIT_TEMPLATES.find((template) => template.kind === 'case-study')!;

describe('the AI prompt for a template', () => {
  test('carries what Talino knows about the learner, and says so plainly for what it does not', () => {
    const text = buildKitPrompt({ template: resume, style: resume.styles[0], title: 'Developer résumé', values: { name: 'Ford', headline: 'Junior developer', skills: 'React and Python', topProject: null } });
    expect(text).toContain('- Name: Ford');
    expect(text).toContain('- Headline: Junior developer');
    expect(text).toContain('- Top skills: React and Python');
    expect(text).toContain('- Best project: [not given yet]');
    expect(text).toContain('- Portfolio link: [not given yet]');
  });

  test('asks the AI to MAKE the file to download (a real .docx or .pptx), names the look, and describes it so the AI can build it', () => {
    const text = buildKitPrompt({ template: resume, style: resume.styles[1], title: 'Developer résumé', values: null });
    expect(text).toContain('Create a "Developer résumé" for me as a downloadable Word file (.docx), the Header look');
    expect(text).toContain('a full-width violet (#7957F5) band');
    const slides = buildKitPrompt({ template: deck, style: deck.styles[0], title: 'Project case study', values: null });
    expect(slides).toContain('as a downloadable PowerPoint file (.pptx)');
    expect(slides).toContain('16:9 PowerPoint deck of 6 slides');
    expect(slides).toContain('Slide 5, the result');
  });

  test('says to fill the attached template when there is one, to use real editable text, and what to do if the chat cannot make files', () => {
    const text = buildKitPrompt({ template: resume, style: resume.styles[0], title: 'Developer résumé', values: null });
    expect(text).toContain('Please make the actual file for me to download, not just text in the chat.');
    expect(text).toContain('If I have attached a template file, fill that one in: keep its design');
    expect(text).toContain('Every piece of text must be real, editable text');
    expect(text).toContain('If you cannot create files in this chat');
  });

  test('every look is described, so no AI is left guessing the design', () => {
    for (const template of KIT_TEMPLATES) {
      for (const style of template.styles) {
        const text = buildKitPrompt({ template, style, title: template.id, values: null });
        expect(text).not.toContain('a clean, modern layout');
        expect(text).toMatch(/with this look: .{40,}/);
      }
    }
  });

  test('still works before the learner’s details have loaded', () => {
    const text = buildKitPrompt({ template: resume, style: resume.styles[0], title: 'Developer résumé', values: null });
    expect(text).toContain('- Name: [not given yet]');
    expect(text.length).toBeGreaterThan(400);
  });

  test('every kind tells the AI not to invent and to ask for what only the learner knows', () => {
    for (const template of KIT_TEMPLATES) {
      const text = buildKitPrompt({ template, style: template.styles[0], title: template.id, values: null });
      expect(text).toContain('Never invent');
      expect(text).toMatch(/You will need .+\./);
      expect(text).toContain('Write in English.');
      expect(text).toContain(`(.${template.format})`);
      expect(text).toMatch(/\n1\. /);
    }
  });

  test('an invoice is never priced by the AI', () => {
    const invoice = KIT_TEMPLATES.find((template) => template.kind === 'invoice')!;
    const text = buildKitPrompt({ template: invoice, style: invoice.styles[0], title: 'Invoice', values: null });
    expect(text).toContain('added up correctly');
    expect(text).toContain('Never invent employers, dates, clients, prices, numbers or links.');
  });

  test('a proposal asks for the price instead of choosing one', () => {
    const proposal = KIT_TEMPLATES.find((template) => template.kind === 'proposal')!;
    expect(buildKitPrompt({ template: proposal, style: proposal.styles[0], title: 'Client proposal', values: null })).toContain('Never choose one for me');
  });
});
