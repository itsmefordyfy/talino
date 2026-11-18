import { describe, expect, test } from '@jest/globals';

import { DIAGRAM_LIMITS, parseMermaidSubset } from '@/features/visuals/diagrams';
import { MERMAID_MAX_CHARS } from '@/features/visuals/diagrams/mermaid';

import { DIAGRAM_TEMPLATES, defaultTemplate } from './diagram-templates';

describe('workbench templates', () => {
  test('there is a template for each diagram the course teaches', () => {
    expect(DIAGRAM_TEMPLATES.map((template) => template.id)).toEqual(['c4-context', 'c4-container', 'c4-component', 'sequence', 'data-flow', 'er', 'class']);
    expect(new Set(DIAGRAM_TEMPLATES.map((template) => template.label)).size).toBe(DIAGRAM_TEMPLATES.length);
  });

  test.each(DIAGRAM_TEMPLATES.map((template) => [template.id, template] as const))('%s parses and fits the diagram limits', (_id, template) => {
    expect(template.source.length).toBeLessThanOrEqual(MERMAID_MAX_CHARS);
    const result = parseMermaidSubset(template.source);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    if (result.spec.kind === 'flow' || result.spec.kind === 'architecture') {
      expect(result.spec.nodes.length).toBeLessThanOrEqual(DIAGRAM_LIMITS.maxNodes);
      expect(result.spec.edges.length).toBeGreaterThan(1);
    }
  });

  test('the templates draw as the kind they are named for', () => {
    const kind = (id: string) => {
      const result = parseMermaidSubset(DIAGRAM_TEMPLATES.find((template) => template.id === id)!.source);
      return result.ok ? result.spec.kind : null;
    };
    expect(['c4-context', 'c4-container', 'c4-component'].map(kind)).toEqual(['architecture', 'architecture', 'architecture']);
    expect(kind('sequence')).toBe('sequence');
    expect(kind('data-flow')).toBe('flow');
    expect(kind('er')).toBe('er');
    expect(kind('class')).toBe('class');
  });

  test('each is about TindaTrack and the starting one is the context diagram', () => {
    for (const template of DIAGRAM_TEMPLATES) expect(template.source).toMatch(/TindaTrack|Store|Sale/);
    expect(defaultTemplate().id).toBe('c4-context');
  });
});
