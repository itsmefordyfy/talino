import { describe, expect, test } from '@jest/globals';

import { extractJson, fallbackSummary, parseDiagramJson } from './from-text';
import { DIAGRAM_SPEC_PROMPT } from './prompt';
import { DIAGRAM_KINDS, DIAGRAM_LIMITS } from './types';

const flow = { kind: 'flow', title: 'T', summary: 'A short flow.', nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], edges: [{ from: 'a', to: 'b' }] };

describe('parseDiagramJson', () => {
  test('accepts an object, JSON text and a fenced JSON block', () => {
    expect(parseDiagramJson(flow).ok).toBe(true);
    expect(parseDiagramJson(JSON.stringify(flow)).ok).toBe(true);
    expect(parseDiagramJson(`Here you go:\n\`\`\`json\n${JSON.stringify(flow)}\n\`\`\`\nHope it helps`).ok).toBe(true);
  });

  test('rejects broken JSON, huge text and invalid diagrams without throwing', () => {
    expect(parseDiagramJson('{not json')).toMatchObject({ ok: false, errors: ['The diagram data is not valid JSON'] });
    expect(parseDiagramJson('x'.repeat(50000)).ok).toBe(false);
    expect(parseDiagramJson(JSON.stringify({ ...flow, kind: 'nope' })).ok).toBe(false);
    expect(parseDiagramJson(undefined).ok).toBe(false);
  });

  test('extractJson', () => {
    expect(extractJson('```json\n{"a":1}\n```')).toBe('{"a":1}');
    expect(extractJson('  {"a":1}  ')).toBe('{"a":1}');
  });
});

describe('fallbackSummary', () => {
  test('returns only a plain, clipped summary string', () => {
    expect(fallbackSummary({ summary: '  Two\nsteps. ' })).toBe('Two steps.');
    expect(fallbackSummary(JSON.stringify({ kind: 'bad', summary: 'Still readable.' }))).toBe('Still readable.');
    expect(fallbackSummary({ summary: 'x'.repeat(1000) })?.length).toBe(400);
    expect(fallbackSummary({ summary: 5 })).toBeNull();
    expect(fallbackSummary('not json')).toBeNull();
    expect(fallbackSummary(null)).toBeNull();
  });
});

describe('DIAGRAM_SPEC_PROMPT', () => {
  test('names every kind and the real limits', () => {
    for (const kind of DIAGRAM_KINDS) expect(DIAGRAM_SPEC_PROMPT).toContain(`"${kind}"`);
    expect(DIAGRAM_SPEC_PROMPT).toContain(String(DIAGRAM_LIMITS.maxNodes));
    expect(DIAGRAM_SPEC_PROMPT).toContain(String(DIAGRAM_LIMITS.maxEdges));
    expect(DIAGRAM_SPEC_PROMPT).toContain(String(DIAGRAM_LIMITS.maxLabel));
    expect(DIAGRAM_SPEC_PROMPT).toContain(String(DIAGRAM_LIMITS.maxTitle));
    expect(DIAGRAM_SPEC_PROMPT).toContain(String(DIAGRAM_LIMITS.maxSummary));
    expect(DIAGRAM_SPEC_PROMPT).toMatch(/Never invent facts/);
    expect(DIAGRAM_SPEC_PROMPT).toMatch(/summary/);
  });

  test('mentions every relation type and cardinality the validator accepts', () => {
    for (const word of ['inherits', 'implements', 'composes', 'aggregates', 'associates', 'depends', 'one', 'zero-or-one', 'one-or-many', 'zero-or-many', 'diamond', 'database', 'actor']) {
      expect(DIAGRAM_SPEC_PROMPT).toContain(word);
    }
  });
});
