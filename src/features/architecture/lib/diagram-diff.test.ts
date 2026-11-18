import { describe, expect, test } from '@jest/globals';

import { parseMermaidSubset, type DiagramSpec } from '@/features/visuals/diagrams';

import { diffDiagrams, diffSources } from './diagram-diff';

const spec = (source: string): DiagramSpec => {
  const result = parseMermaidSubset(source);
  if (!result.ok) throw new Error(result.errors.join('; '));
  return result.spec;
};

describe('diffDiagrams', () => {
  const base = spec('flowchart LR\n  A[Web] -->|calls| B[API]\n  B --> C[(Database)]');

  test('the same diagram has no differences, and moving lines around changes nothing', () => {
    const same = spec('flowchart LR\n  B --> C[(Database)]\n  A[Web] -->|calls| B[API]');
    const diff = diffDiagrams(base, same);
    expect(diff).toMatchObject({ comparable: true, identical: true });
  });

  test('added and removed nodes and arrows are found by id', () => {
    const next = spec('flowchart LR\n  A[Web] -->|calls| B[API]\n  B --> D[Cache]\n  B --> C[(Database)]');
    const diff = diffDiagrams(base, next);
    expect(diff).toMatchObject({ comparable: true, identical: false });
    if (!diff.comparable) return;
    expect(diff.nodes.added).toEqual([{ id: 'D', label: 'Cache' }]);
    expect(diff.nodes.removed).toEqual([]);
    expect(diff.arrows.added).toEqual([{ from: 'B', to: 'D', label: '' }]);

    const back = diffDiagrams(next, base);
    if (!back.comparable) throw new Error('comparable');
    expect(back.nodes.removed).toEqual([{ id: 'D', label: 'Cache' }]);
    expect(back.arrows.removed).toEqual([{ from: 'B', to: 'D', label: '' }]);
  });

  test('a changed name or arrow label is relabelled, not removed and added', () => {
    const next = spec('flowchart LR\n  A[Web app] -->|requests| B[API]\n  B --> C[(Database)]');
    const diff = diffDiagrams(base, next);
    if (!diff.comparable) throw new Error('comparable');
    expect(diff.nodes.relabelled).toEqual([{ id: 'A', before: 'Web', after: 'Web app' }]);
    expect(diff.nodes.added).toEqual([]);
    expect(diff.arrows.relabelled).toEqual([{ from: 'A', to: 'B', before: 'calls', after: 'requests' }]);
    expect(diff.arrows.added).toEqual([]);
  });

  test('an arrow turned around is one removed and one added', () => {
    const diff = diffDiagrams(spec('flowchart TD\n  A --> B'), spec('flowchart TD\n  B --> A'));
    if (!diff.comparable) throw new Error('comparable');
    expect(diff.arrows.removed).toEqual([{ from: 'A', to: 'B', label: '' }]);
    expect(diff.arrows.added).toEqual([{ from: 'B', to: 'A', label: '' }]);
  });

  test('a flowchart and a C4 view compare as nodes and arrows; a sequence and an ER diagram do not compare', () => {
    const c4 = spec('C4Context\n  Person(u, "Owner")\n  System(s, "TindaTrack")\n  Rel(u, s, "Uses")');
    const flow = spec('flowchart TD\n  u[Owner] -->|Uses| s[TindaTrack]');
    expect(diffDiagrams(flow, c4)).toMatchObject({ comparable: true, identical: true });
    const sequence = spec('sequenceDiagram\n  A->>B: hi');
    const er = spec('erDiagram\n  A ||--o{ B : has');
    expect(diffDiagrams(sequence, er)).toEqual({ comparable: false, kindA: 'sequence', kindB: 'er' });
  });

  test('sequence messages between the same two parts are matched in order', () => {
    const a = spec('sequenceDiagram\n  A->>B: first\n  B-->>A: ok');
    const b = spec('sequenceDiagram\n  A->>B: first\n  A->>B: second\n  B-->>A: ok');
    const diff = diffDiagrams(a, b);
    if (!diff.comparable) throw new Error('comparable');
    expect(diff.arrows.added).toEqual([{ from: 'A', to: 'B', label: 'second' }]);
    expect(diff.arrows.relabelled).toEqual([]);
  });

  test('class relations and ER relationships are arrows with their words', () => {
    const classes = diffDiagrams(spec('classDiagram\n  Animal <|-- Dog'), spec('classDiagram\n  Animal <|-- Dog\n  Dog *-- Tail'));
    if (!classes.comparable) throw new Error('comparable');
    expect(classes.nodes.added).toEqual([{ id: 'Tail', label: 'Tail' }]);
    expect(classes.arrows.added).toEqual([{ from: 'Dog', to: 'Tail', label: 'composes' }]);
    const er = diffDiagrams(spec('erDiagram\n  Store ||--o{ Sale : makes'), spec('erDiagram\n  Store ||--o{ Sale : records'));
    if (!er.comparable) throw new Error('comparable');
    expect(er.arrows.relabelled).toEqual([{ from: 'Store', to: 'Sale', before: 'makes', after: 'records' }]);
  });
});

describe('diffSources', () => {
  test('compares two sources and names the first one that does not parse', () => {
    const ok = diffSources('flowchart TD\n A --> B', 'flowchart TD\n A --> B\n B --> C');
    expect(ok.ok).toBe(true);
    const badA = diffSources('flowchart TD\n A -- B', 'flowchart TD\n A --> B');
    expect(badA).toMatchObject({ ok: false, side: 'a' });
    const badB = diffSources('flowchart TD\n A --> B', 'nonsense');
    expect(badB).toMatchObject({ ok: false, side: 'b' });
    if (!badB.ok) expect(badB.errors[0]).toMatch(/supported/);
  });
});
