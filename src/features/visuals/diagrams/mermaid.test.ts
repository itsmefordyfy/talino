import { describe, expect, test } from '@jest/globals';

import { parseMermaidSubset } from './mermaid';
import type { DiagramSpec } from './types';

function parse(text: string): DiagramSpec {
  const result = parseMermaidSubset(text);
  if (!result.ok) throw new Error(result.errors.join(' | '));
  return result.spec;
}

function errors(text: string): string {
  const result = parseMermaidSubset(text);
  expect(result.ok).toBe(false);
  return result.ok ? '' : result.errors.join(' | ');
}

describe('parseMermaidSubset: flowchart', () => {
  test('nodes, shapes, labels and a direction', () => {
    const spec = parse(`flowchart LR
      A[Start] --> B{Is it valid?}
      B -->|yes| C(Save)
      B -->|no| D((Stop))
      C --> E[(Database)]
      D -.-> A`);
    expect(spec.kind).toBe('flow');
    if (spec.kind !== 'flow') return;
    expect(spec.direction).toBe('LR');
    expect(spec.nodes.map((node) => [node.id, node.label, node.shape])).toEqual([
      ['A', 'Start', 'box'],
      ['B', 'Is it valid?', 'diamond'],
      ['C', 'Save', 'rounded'],
      ['D', 'Stop', 'circle'],
      ['E', 'Database', 'database'],
    ]);
    expect(spec.edges).toEqual([
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C', label: 'yes' },
      { from: 'B', to: 'D', label: 'no' },
      { from: 'C', to: 'E' },
      { from: 'D', to: 'A', dashed: true },
    ]);
    expect(spec.summary).toMatch(/^Flowchart with 5 steps/);
  });

  test('graph TD, chains, semicolons, comments and quoted labels', () => {
    const spec = parse(`graph TD
      %% a comment
      A["Hello, world"] --> B --> C; C --> A
      B -- maybe --> D`);
    if (spec.kind !== 'flow') throw new Error('kind');
    expect(spec.direction).toBe('TD');
    expect(spec.nodes.map((node) => node.label)).toEqual(['Hello, world', 'B', 'C', 'D']);
    expect(spec.edges).toHaveLength(4);
    expect(spec.edges[3]).toEqual({ from: 'B', to: 'D', label: 'maybe' });
  });

  test('a later label overrides the id and a title can come from front matter', () => {
    const spec = parse(`---
title: My flow
---
flowchart TD
A --> B
A[First]`);
    expect(spec.title).toBe('My flow');
    if (spec.kind === 'flow') expect(spec.nodes[0].label).toBe('First');
  });

  test('bidirectional arrows', () => {
    const spec = parse('flowchart TD\nA <--> B');
    if (spec.kind === 'flow') expect(spec.edges[0].bidirectional).toBe(true);
  });

  test('friendly errors', () => {
    expect(errors('flowchart RL\nA --> B')).toMatch(/direction/);
    expect(errors('flowchart TD\nsubgraph x\nA-->B\nend')).toMatch(/subgraph/);
    expect(errors('flowchart TD\nA --- B')).toMatch(/only arrows/);
    expect(errors('flowchart TD\nA --> B & C')).toMatch(/&/);
    expect(errors('flowchart TD\nA[Open --> B')).toMatch(/closing/);
    expect(errors('flowchart TD\nclick A callback')).toMatch(/click/);
    expect(errors('flowchart TD\nstyle A fill:#f00')).toMatch(/style/);
    expect(errors('flowchart TD\nA([Stadium]) --> B')).toMatch(/shape/);
    expect(errors('flowchart TD\nA[<script>alert(1)</script>] --> B')).toMatch(/HTML or script/);
  });
});

describe('parseMermaidSubset: sequence', () => {
  test('participants, aliases and messages', () => {
    const spec = parse(`sequenceDiagram
      participant B as Browser
      actor U as User
      U->>B: Click
      B->>S: GET /users
      S-->>B: 200 OK`);
    if (spec.kind !== 'sequence') throw new Error('kind');
    expect(spec.participants).toEqual([
      { id: 'B', label: 'Browser' },
      { id: 'U', label: 'User', shape: 'actor' },
      { id: 'S', label: 'S' },
    ]);
    expect(spec.messages[2]).toEqual({ from: 'S', to: 'B', label: '200 OK', dashed: true });
  });

  test('unsupported lines are friendly errors', () => {
    expect(errors('sequenceDiagram\nA->>B: hi\nloop Every minute\nA->>B: x\nend')).toMatch(/loop/);
    expect(errors('sequenceDiagram\nNote over A,B: x')).toMatch(/Note/);
    expect(errors('sequenceDiagram\nA->B: x')).toMatch(/can't read/);
  });
});

describe('parseMermaidSubset: class diagram', () => {
  test('classes, members and relations', () => {
    const spec = parse(`classDiagram
      class Animal {
        +String name
        +speak() String
      }
      class Dog
      Animal <|-- Dog
      Dog : +fetch() void
      <<interface>> Walker
      Dog ..|> Walker
      Dog *-- Tail
      Dog o-- Toy : plays
      Dog --> Owner
      Dog ..> Vet`);
    if (spec.kind !== 'class') throw new Error('kind');
    const animal = spec.classes.find((box) => box.id === 'Animal');
    expect(animal?.attributes).toEqual(['+String name']);
    expect(animal?.methods).toEqual(['+speak() String']);
    expect(spec.classes.find((box) => box.id === 'Dog')?.methods).toEqual(['+fetch() void']);
    expect(spec.classes.find((box) => box.id === 'Walker')?.stereotype).toBe('interface');
    expect(spec.relations).toEqual([
      { from: 'Dog', to: 'Animal', type: 'inherits' },
      { from: 'Dog', to: 'Walker', type: 'implements' },
      { from: 'Dog', to: 'Tail', type: 'composes' },
      { from: 'Dog', to: 'Toy', type: 'aggregates', label: 'plays' },
      { from: 'Dog', to: 'Owner', type: 'associates' },
      { from: 'Dog', to: 'Vet', type: 'depends' },
    ]);
  });

  test('inheritance loops are refused by validation, unclosed blocks are friendly', () => {
    expect(errors('classDiagram\nA <|-- B\nB <|-- A')).toMatch(/loop/);
    expect(errors('classDiagram\nclass A {\n+x')).toMatch(/closing/);
    expect(errors('classDiagram\nnamespace X {')).toMatch(/can't read/);
  });
});

describe('parseMermaidSubset: ER diagram', () => {
  test('relationship cardinalities and attribute blocks', () => {
    const spec = parse(`erDiagram
      USER ||--o{ ORDER : places
      ORDER }|--|{ PRODUCT : contains
      USER |o--o| PROFILE : "has one"
      USER {
        int id PK
        string email "unique"
        int team_id FK
      }`);
    if (spec.kind !== 'er') throw new Error('kind');
    expect(spec.relationships).toEqual([
      { from: 'USER', to: 'ORDER', fromCardinality: 'one', toCardinality: 'zero-or-many', label: 'places' },
      { from: 'ORDER', to: 'PRODUCT', fromCardinality: 'one-or-many', toCardinality: 'one-or-many', label: 'contains' },
      { from: 'USER', to: 'PROFILE', fromCardinality: 'zero-or-one', toCardinality: 'zero-or-one', label: 'has one' },
    ]);
    expect(spec.entities.find((entity) => entity.id === 'USER')?.attributes).toEqual([
      { name: 'id', type: 'int', key: 'PK' },
      { name: 'email', type: 'string' },
      { name: 'team_id', type: 'int', key: 'FK' },
    ]);
  });

  test('errors', () => {
    expect(errors('erDiagram\nA ||==o{ B : x')).toMatch(/can't read/);
    expect(errors('erDiagram\nA {\nint id')).toMatch(/closing/);
  });
});

describe('parseMermaidSubset: everything else', () => {
  test('unsupported diagram types and bad input', () => {
    expect(errors('pie title Pets\n"Dogs": 3')).toMatch(/isn't a supported diagram type/);
    expect(errors('gantt\nsection x')).toMatch(/supported/);
    expect(errors('')).toMatch(/empty/);
    expect(errors('   \n %% only a comment')).toMatch(/empty/);
    expect(errors('sequenceDiagram foo')).toMatch(/supported/);
  });

  test('size limits and non-strings', () => {
    expect(errors(`flowchart TD\n${'A-->B\n'.repeat(1500)}`)).toMatch(/too long/);
    expect(errors(`flowchart TD\n${'\n'.repeat(250)}A-->B`)).toMatch(/too many lines/);
    expect(parseMermaidSubset(42 as unknown as string).ok).toBe(false);
  });

  test('the 24-node limit still applies', () => {
    const lines = Array.from({ length: 30 }, (_, i) => `N${i} --> N${i + 1}`).join('\n');
    expect(errors(`flowchart TD\n${lines}`)).toMatch(/too many items/);
  });

  test('never evaluates or throws on hostile text', () => {
    for (const text of ['flowchart TD\nA[`${process.exit(1)}`] --> B', 'flowchart TD\n__proto__ --> constructor', 'classDiagram\nclass __proto__', '%%{init: {"securityLevel":"loose"}}%%\nflowchart TD\nA-->B', 'flowchart TD\nA[a'.repeat(50)]) {
      expect(() => parseMermaidSubset(text)).not.toThrow();
    }
    expect(parseMermaidSubset('flowchart TD\n__proto__ --> constructor').ok).toBe(true);
  });

  test('options set the title and summary', () => {
    const result = parseMermaidSubset('flowchart TD\nA-->B', { title: 'Mine', summary: 'My summary.' });
    expect(result.ok && result.spec.title).toBe('Mine');
    expect(result.ok && result.spec.summary).toBe('My summary.');
  });
});

describe('parseMermaidSubset: C4', () => {
  const context = `C4Context
    title Booking system context
    Person(customer, "Customer", "Books a haircut")
    System(app, "Booking App", "Lets customers book and pay a deposit")
    System_Ext(wallet, "E-wallet", "Takes the deposit")
    Rel(customer, app, "Books with")
    Rel(app, wallet, "Charges deposits through", "HTTPS")`;

  test('a context diagram becomes an architecture diagram with people and external groups', () => {
    const spec = parse(context);
    expect(spec.kind).toBe('architecture');
    if (spec.kind !== 'architecture') return;
    expect(spec.title).toBe('Booking system context');
    expect(spec.nodes.map((node) => [node.id, node.shape, node.group])).toEqual([
      ['customer', 'actor', 'People'],
      ['app', 'box', undefined],
      ['wallet', 'box', 'External'],
    ]);
    expect(spec.edges).toEqual([
      { from: 'customer', to: 'app', label: 'Books with' },
      { from: 'app', to: 'wallet', label: 'Charges deposits through (HTTPS)' },
    ]);
  });

  test('a container diagram keeps technology in the note and groups by boundary', () => {
    const spec = parse(`C4Container
      Person(owner, "Owner")
      System_Boundary(sys, "Booking App") {
        Container(web, "Web app", "React", "The booking screens")
        Container(api, "API", "Node.js", "Booking rules")
        ContainerDb(db, "Database", "PostgreSQL", "Bookings")
      }
      Rel(owner, web, "Uses")
      Rel(web, api, "Calls", "JSON/HTTPS")
      Rel(api, db, "Reads and writes", "SQL")`);
    if (spec.kind !== 'architecture') throw new Error('expected architecture');
    expect(spec.nodes.find((node) => node.id === 'db')).toEqual({ id: 'db', label: 'Database', shape: 'database', note: '[PostgreSQL] Bookings', group: 'Booking App' });
    expect(spec.nodes.find((node) => node.id === 'api')?.group).toBe('Booking App');
    expect(spec.edges).toHaveLength(3);
  });

  test('layout calls are ignored and friendly errors name the line', () => {
    expect(parseMermaidSubset(`${context}\n    UpdateLayoutConfig($c4ShapeInRow="3")\n    LAYOUT_WITH_LEGEND()`).ok).toBe(true);
    expect(errors('C4Context\n  System(app "no commas")')).toMatch(/Line 2/);
    expect(errors('C4Context\n  System(app, "A")\n  }')).toMatch(/closes nothing/);
    expect(errors('C4Context\n  System_Boundary(b, "B") {\n  System(a, "A")')).toMatch(/missing its closing/);
    expect(errors('C4Context\n  Rel(a, b)')).toMatch(/needs two ids and a label/);
    expect(errors('C4Context\n  System(a, "A")\n  Rel(a, zzz, "Uses")')).toMatch(/zzz/);
    expect(errors('C4Deployment\n  Node(a, "A")')).toMatch(/isn't a supported diagram type/);
  });
});
