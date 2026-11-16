import { describe, expect, test } from '@jest/globals';

import { markdownToBlocks } from './markdown';

describe('markdownToBlocks', () => {
  test('headings, paragraphs, lists and code', () => {
    const blocks = markdownToBlocks('## Plan\nStart small,\nthen grow.\n\n- One\n- Two\n  more\n1. First\n2. Second\n\n```python\nprint(1)\n```\nDone **now**.');
    expect(blocks).toEqual([
      { type: 'heading', text: 'Plan' },
      { type: 'paragraph', text: 'Start small, then grow.' },
      { type: 'list', ordered: false, items: ['One', 'Two more'] },
      { type: 'list', ordered: true, items: ['First', 'Second'] },
      { type: 'code', language: 'python', code: 'print(1)' },
      { type: 'paragraph', text: 'Done **now**.' },
    ]);
  });

  test('an unclosed fence keeps its code', () => {
    expect(markdownToBlocks('```\nconst a = 1;')).toEqual([{ type: 'code', language: 'code', code: 'const a = 1;' }]);
  });

  test('a diagram fence becomes a diagram block, and other fences stay code', () => {
    const blocks = markdownToBlocks('Here:\n```diagram\n{"kind":"flow"}\n```\n```mermaid\nflowchart TD\nA-->B\n```\n```js\nlet x = 1\n```');
    expect(blocks.map((block) => block.type)).toEqual(['paragraph', 'diagram', 'diagram', 'code']);
    expect(blocks[1]).toMatchObject({ format: 'json', source: '{"kind":"flow"}' });
    expect(blocks[2]).toMatchObject({ format: 'mermaid' });
  });

  test('a pipe table becomes a table block, with ragged rows padded to the header', () => {
    const blocks = markdownToBlocks('Compare:\n\n| Tool | Best for |\n| --- | :-: |\n| Cursor | Editing code |\n| Claude Code |\n| Codex | Tasks | extra |\n\nPick one.');
    expect(blocks).toEqual([
      { type: 'paragraph', text: 'Compare:' },
      { type: 'table', headers: ['Tool', 'Best for'], rows: [['Cursor', 'Editing code'], ['Claude Code', ''], ['Codex', 'Tasks']] },
      { type: 'paragraph', text: 'Pick one.' },
    ]);
  });

  test('a lone line with pipes is not a table, and a table cut off after its header still draws', () => {
    expect(markdownToBlocks('a | b | c')).toEqual([{ type: 'paragraph', text: 'a | b | c' }]);
    expect(markdownToBlocks('| A | B |\n| - | - |')).toEqual([{ type: 'table', headers: ['A', 'B'], rows: [] }]);
  });

  test('single-asterisk italics and Markdown links draw as plain words, but **bold**, `code` and maths are left alone', () => {
    const [paragraph] = markdownToBlocks('Say *"This failed"* to the AI, see [the docs](https://example.com/a) and **keep** `*args` and 2 * 3 * 4 as is.');
    expect(paragraph).toEqual({ type: 'paragraph', text: 'Say "This failed" to the AI, see the docs (https://example.com/a) and **keep** `*args` and 2 * 3 * 4 as is.' });
  });

  test('a > quote becomes a tip, and a horizontal rule is dropped', () => {
    expect(markdownToBlocks('Try this:\n\n> "Make a tip calculator"\n> in one file\n\n---\n\nThen run it.')).toEqual([
      { type: 'paragraph', text: 'Try this:' },
      { type: 'tip', text: '"Make a tip calculator" in one file' },
      { type: 'paragraph', text: 'Then run it.' },
    ]);
    expect(markdownToBlocks('***\n___\n- - -')).toEqual([]);
  });

  test('a numbered list keeps counting through nested bullets and blank lines between items', () => {
    const blocks = markdownToBlocks('1. **Schema**\n   * Prompt: make a table\n   * Output: SQL\n\n2. **Backend**\n   * Prompt: add an endpoint\n\n3. **Frontend**');
    expect(blocks).toEqual([{ type: 'list', ordered: true, items: ['**Schema** — Prompt: make a table — Output: SQL', '**Backend** — Prompt: add an endpoint', '**Frontend**'] }]);
  });

  test('a bullet list is not glued to the paragraph after it, and a separate list still starts fresh', () => {
    expect(markdownToBlocks('- one\n- two\n\nDone.\n\n1. first')).toEqual([
      { type: 'list', ordered: false, items: ['one', 'two'] },
      { type: 'paragraph', text: 'Done.' },
      { type: 'list', ordered: true, items: ['first'] },
    ]);
  });

  test('a ```json block that is really a diagram is drawn as one; other json stays code', () => {
    const diagram = '{"kind":"flow","title":"t","summary":"s","nodes":[],"edges":[]}';
    expect(markdownToBlocks('```json\n' + diagram + '\n```')).toEqual([{ type: 'diagram', format: 'json', source: diagram }]);
    expect(markdownToBlocks('```json\n{"name":"x"}\n```')[0]).toMatchObject({ type: 'code', language: 'json' });
    expect(markdownToBlocks('```json\n{bad\n```')[0]).toMatchObject({ type: 'code' });
  });
});

