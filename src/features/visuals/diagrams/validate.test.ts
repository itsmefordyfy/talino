import { describe, expect, test } from '@jest/globals';

import { describeDiagram } from './describe';
import { DIAGRAM_LIMITS } from './types';
import { validateDiagram } from './validate';

const flow = {
  kind: 'flow',
  title: 'Login',
  summary: 'A user logs in.',
  nodes: [
    { id: 'start', label: 'Start', shape: 'circle' },
    { id: 'check', label: 'Password correct?', shape: 'diamond', note: 'The server compares hashes.' },
    { id: 'home', label: 'Home' },
  ],
  edges: [
    { from: 'start', to: 'check' },
    { from: 'check', to: 'home', label: 'yes' },
  ],
};

const sequence = {
  kind: 'sequence',
  title: 'Request',
  summary: 'The browser asks, the server answers.',
  participants: [
    { id: 'b', label: 'Browser' },
    { id: 's', label: 'Server' },
  ],
  messages: [
    { from: 'b', to: 's', label: 'GET /users' },
    { from: 's', to: 'b', label: '200 OK', dashed: true },
  ],
};

const classDiagram = {
  kind: 'class',
  title: 'Animals',
  summary: 'Dog inherits from Animal.',
  classes: [
    { id: 'animal', label: 'Animal', attributes: ['name: string'], methods: ['speak(): string'] },
    { id: 'dog', label: 'Dog' },
  ],
  relations: [{ from: 'dog', to: 'animal', type: 'inherits' }],
};

const er = {
  kind: 'er',
  title: 'Shop',
  summary: 'A user places orders.',
  entities: [
    { id: 'user', label: 'User', attributes: [{ name: 'id', type: 'int', key: 'PK' }] },
    { id: 'order', label: 'Order', attributes: [{ name: 'user_id', key: 'FK' }] },
  ],
  relationships: [{ from: 'user', to: 'order', fromCardinality: 'one', toCardinality: 'zero-or-many', label: 'places' }],
};

describe('validateDiagram: valid input', () => {
  test.each([
    ['flow', flow],
    ['sequence', sequence],
    ['class', classDiagram],
    ['er', er],
    ['architecture', { ...flow, kind: 'architecture' }],
  ])('accepts a %s diagram', (_name, input) => {
    const result = validateDiagram(input);
    expect(result.ok).toBe(true);
  });

  test('returns a normalized copy and drops unknown properties', () => {
    const result = validateDiagram({ ...flow, evil: '<script>', nodes: [{ id: 'a', label: ' Trim me ', onclick: 'x' }], edges: [] });
    expect(result.ok).toBe(true);
    if (result.ok && result.spec.kind === 'flow') {
      expect(result.spec.nodes).toEqual([{ id: 'a', label: 'Trim me' }]);
      expect('evil' in result.spec).toBe(false);
    }
  });

  test('allows generic types such as List<String> in class members', () => {
    const result = validateDiagram({ ...classDiagram, classes: [{ id: 'a', label: 'A', attributes: ['items: List<String>'] }], relations: [] });
    expect(result.ok).toBe(true);
  });

  test('allows loops in a flowchart', () => {
    const result = validateDiagram({ ...flow, edges: [...flow.edges, { from: 'home', to: 'start' }] });
    expect(result.ok).toBe(true);
  });
});

describe('validateDiagram: invalid input', () => {
  const errorsOf = (input: unknown): string[] => {
    const result = validateDiagram(input);
    expect(result.ok).toBe(false);
    return result.ok ? [] : result.errors;
  };

  test.each([null, undefined, 5, 'flow', [], true])('rejects %p', (input) => {
    expect(errorsOf(input).length).toBeGreaterThan(0);
  });

  test('unknown kind', () => {
    expect(errorsOf({ ...flow, kind: 'pie' }).join(' ')).toMatch(/kind must be one of/);
  });

  test('missing title and summary', () => {
    const errors = errorsOf({ kind: 'flow', nodes: flow.nodes, edges: [] });
    expect(errors.join(' ')).toMatch(/title is required/);
    expect(errors.join(' ')).toMatch(/summary is required/);
  });

  test('missing or invalid ids', () => {
    expect(errorsOf({ ...flow, nodes: [{ label: 'x' }] }).join(' ')).toMatch(/nodes\[0\]\.id/);
    expect(errorsOf({ ...flow, nodes: [{ id: 'has space', label: 'x' }] }).join(' ')).toMatch(/letters, digits/);
    expect(errorsOf({ ...flow, nodes: [{ id: 'a'.repeat(33), label: 'x' }] }).join(' ')).toMatch(/1 to 32/);
  });

  test('duplicate ids are reported once', () => {
    const errors = errorsOf({ ...flow, nodes: [{ id: 'a', label: 'A' }, { id: 'a', label: 'B' }], edges: [] });
    expect(errors.filter((message) => message.includes('used twice'))).toHaveLength(1);
  });

  test('dangling edges', () => {
    const errors = errorsOf({ ...flow, edges: [{ from: 'start', to: 'nowhere' }] });
    expect(errors.join(' ')).toMatch(/does not match any node id/);
  });

  test('self loops and repeated arrows', () => {
    expect(errorsOf({ ...flow, edges: [{ from: 'start', to: 'start' }] }).join(' ')).toMatch(/itself/);
    expect(errorsOf({ ...flow, edges: [{ from: 'start', to: 'check' }, { from: 'start', to: 'check' }] }).join(' ')).toMatch(/repeats/);
  });

  test('oversize', () => {
    const many = Array.from({ length: DIAGRAM_LIMITS.maxNodes + 1 }, (_, i) => ({ id: `n${i}`, label: `N${i}` }));
    expect(errorsOf({ ...flow, nodes: many, edges: [] }).join(' ')).toMatch(/too many items/);
    const edges = Array.from({ length: DIAGRAM_LIMITS.maxEdges + 1 }, () => ({ from: 'start', to: 'check' }));
    expect(errorsOf({ ...flow, edges }).join(' ')).toMatch(/too many items/);
    expect(errorsOf({ ...flow, nodes: [{ id: 'a', label: 'x'.repeat(61) }], edges: [] }).join(' ')).toMatch(/too long/);
    expect(errorsOf({ ...flow, summary: 'x'.repeat(401) }).join(' ')).toMatch(/summary is too long/);
  });

  test('plain text only', () => {
    for (const label of ['<script>alert(1)</script>', 'a<br>b', '</b>', 'javascript:alert(1)', 'line\nbreak', 'tab\there', 'bidi‮text', '<!-- x -->', 'data:text/html;base64,AAA']) {
      expect(errorsOf({ ...flow, nodes: [{ id: 'a', label }], edges: [] }).length).toBeGreaterThan(0);
    }
  });

  test('wrong types', () => {
    expect(errorsOf({ ...flow, nodes: 'nope' }).join(' ')).toMatch(/nodes must be a list/);
    expect(errorsOf({ ...flow, nodes: [{ id: 'a', label: 5 }], edges: [] }).join(' ')).toMatch(/label must be a string/);
    expect(errorsOf({ ...flow, nodes: [{ id: 'a', label: 'A', shape: 'star' }], edges: [] }).join(' ')).toMatch(/shape must be one of/);
    expect(errorsOf({ ...flow, edges: [{ from: 'start', to: 'check', dashed: 'yes' }] }).join(' ')).toMatch(/true or false/);
    expect(errorsOf({ ...flow, direction: 'RL' }).join(' ')).toMatch(/direction/);
  });

  test('class inheritance loops are refused', () => {
    const looped = {
      ...classDiagram,
      classes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }],
      relations: [
        { from: 'a', to: 'b', type: 'inherits' },
        { from: 'b', to: 'c', type: 'inherits' },
        { from: 'c', to: 'a', type: 'implements' },
      ],
    };
    expect(errorsOf(looped).join(' ')).toMatch(/loop/);
    expect(errorsOf({ ...classDiagram, relations: [{ from: 'dog', to: 'dog', type: 'inherits' }] }).join(' ')).toMatch(/itself/);
    expect(errorsOf({ ...classDiagram, relations: [{ from: 'dog', to: 'animal', type: 'likes' }] }).join(' ')).toMatch(/type must be one of/);
  });

  test('ER problems', () => {
    expect(errorsOf({ ...er, relationships: [{ ...er.relationships[0], toCardinality: 'many' }] }).join(' ')).toMatch(/toCardinality/);
    expect(errorsOf({ ...er, relationships: [{ ...er.relationships[0], to: 'user' }] }).join(' ')).toMatch(/itself/);
    expect(errorsOf({ ...er, entities: [{ id: 'user', label: 'U', attributes: [{ name: 'id', key: 'XX' }] }, er.entities[1]] }).join(' ')).toMatch(/PK/);
  });

  test('sequence problems', () => {
    expect(errorsOf({ ...sequence, messages: [{ from: 'b', to: 'zzz', label: 'hi' }] }).join(' ')).toMatch(/participant/);
    expect(errorsOf({ ...sequence, messages: [] }).join(' ')).toMatch(/at least 1/);
  });
});

describe('validateDiagram: hostile input never throws', () => {
  test('ids named like object internals are plain strings', () => {
    const result = validateDiagram({
      kind: 'flow',
      title: 'T',
      summary: 'S',
      nodes: [
        { id: '__proto__', label: 'Proto' },
        { id: 'constructor', label: 'Ctor' },
        { id: 'toString', label: 'ToString' },
      ],
      edges: [{ from: '__proto__', to: 'constructor' }, { from: 'constructor', to: 'toString' }],
    });
    expect(result.ok).toBe(true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  test('JSON with a __proto__ key does not pollute and is ignored', () => {
    const parsed: unknown = JSON.parse('{"kind":"flow","title":"T","summary":"S","nodes":[{"id":"a","label":"A"}],"edges":[],"__proto__":{"polluted":true}}');
    const result = validateDiagram(parsed);
    expect(result.ok).toBe(true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  test('objects whose getters throw', () => {
    const trap = new Proxy({}, { get: () => { throw new Error('boom'); } });
    expect(() => validateDiagram(trap)).not.toThrow();
    expect(validateDiagram(trap).ok).toBe(false);
    expect(() => validateDiagram({ ...flow, nodes: [trap] })).not.toThrow();
  });

  test('cyclic and enormous structures', () => {
    const cyclic: Record<string, unknown> = { ...flow };
    cyclic.self = cyclic;
    expect(() => validateDiagram(cyclic)).not.toThrow();
    const huge = { ...flow, nodes: Array.from({ length: 100000 }, (_, i) => ({ id: `n${i % 20}`, label: 'x' })) };
    expect(validateDiagram(huge).ok).toBe(false);
  });

  test('random garbage (fuzz-ish)', () => {
    let seed = 7;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const pick = <T,>(list: readonly T[]): T => list[Math.floor(random() * list.length)];
    const atoms: unknown[] = [null, undefined, 0, -1, NaN, 'x', '', 'a'.repeat(100), true, [], {}, [1, 2], { id: 'a' }, { id: 'a', label: 'A' }, { from: 'a', to: 'b' }, Symbol.iterator.toString()];
    for (let i = 0; i < 300; i += 1) {
      const input: Record<string, unknown> = {};
      for (const key of ['kind', 'title', 'summary', 'nodes', 'edges', 'participants', 'messages', 'classes', 'relations', 'entities', 'relationships', 'direction']) {
        if (random() < 0.6) input[key] = random() < 0.5 ? pick(atoms) : [pick(atoms), pick(atoms)];
      }
      if (random() < 0.5) input.kind = pick(['flow', 'sequence', 'class', 'er', 'architecture', 'x']);
      expect(() => validateDiagram(input)).not.toThrow();
      const result = validateDiagram(input);
      if (!result.ok) expect(result.errors.length).toBeLessThanOrEqual(20);
    }
  });
});

describe('describeDiagram', () => {
  const spec = (input: unknown) => {
    const result = validateDiagram(input);
    if (!result.ok) throw new Error(result.errors.join(', '));
    return result.spec;
  };

  test('flowchart', () => {
    expect(describeDiagram(spec(flow))).toBe('Flowchart with 3 steps: Start to Password correct?, Password correct? to Home (yes).');
  });

  test('architecture and a single node', () => {
    expect(describeDiagram(spec({ ...flow, kind: 'architecture' }))).toMatch(/^Architecture diagram with 3 components: /);
    expect(describeDiagram(spec({ kind: 'flow', title: 'T', summary: 'S', nodes: [{ id: 'a', label: 'Only' }] }))).toBe('Flowchart with 1 step: Only.');
  });

  test('sequence', () => {
    const text = describeDiagram(spec(sequence));
    expect(text).toContain('Sequence diagram with 2 participants: Browser, Server.');
    expect(text).toContain('1, Browser sends to Server: GET /users.');
    expect(text).toContain('2, Server replies to Browser: 200 OK.');
  });

  test('class and ER', () => {
    expect(describeDiagram(spec(classDiagram))).toContain('Dog inherits from Animal');
    expect(describeDiagram(spec(er))).toContain('User (exactly one) places Order (zero or many)');
  });
});
