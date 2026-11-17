import { describe, expect, test } from '@jest/globals';

import { ALL_TEST_LABS, LAB_CLASSIFY, LAB_COMPARE_MODELS, LAB_COMPARE_PROMPTS, LAB_MARKERS, LAB_SUMMARY, LAB_TOOLS } from '../lab-test-support';
import type { LabTask } from '../types';
import { labProblems, MAX_MATERIAL_CHARS } from './lab-rules';

/** The rules the real catalog is held to, tried on invented labs: a well-formed one passes and each rule has a lab that breaks it. */
const FIXED = (lab: LabTask): LabTask => ({ ...lab, id: lab.id });
const problems = (lab: LabTask) => labProblems(lab).join(' | ');

describe('well-formed labs', () => {
  test.each(ALL_TEST_LABS.map((lab) => [lab.id, lab] as const))('%s has no problems', (_id, lab) => {
    expect(labProblems(FIXED(lab))).toEqual([]);
  });
});

describe('the shape of a lab', () => {
  test('the id must be lab-NN-kebab', () => {
    for (const id of ['lab-1-short', 'prompt-01-x', 'lab-01-Upper', 'lab-01-', 'lab-01-two--dashes']) expect(problems({ ...LAB_SUMMARY, id })).toMatch(/not lab-NN-kebab/);
  });
  test('3 to 6 criteria with unique kebab ids', () => {
    expect(problems({ ...LAB_SUMMARY, criteria: LAB_SUMMARY.criteria.slice(0, 2) })).toMatch(/3 to 6 criteria/);
    expect(problems({ ...LAB_SUMMARY, criteria: [...LAB_SUMMARY.criteria, ...LAB_SUMMARY.criteria] })).toMatch(/3 to 6 criteria|unique/);
    expect(problems({ ...LAB_SUMMARY, criteria: LAB_SUMMARY.criteria.map((criterion) => ({ ...criterion, id: 'same' })) })).toMatch(/unique kebab-case/);
    expect(problems({ ...LAB_SUMMARY, criteria: LAB_SUMMARY.criteria.map((criterion) => ({ ...criterion, id: 'Not Kebab' })) })).toMatch(/unique kebab-case/);
  });
  test('3 to 5 tips and 2 to 4 verify items', () => {
    expect(problems({ ...LAB_SUMMARY, tips: ['one', 'two'] })).toMatch(/3 to 5 tips/);
    expect(problems({ ...LAB_SUMMARY, tips: ['1', '2', '3', '4', '5', '6'] })).toMatch(/3 to 5 tips/);
    expect(problems({ ...LAB_SUMMARY, verify: ['one'] })).toMatch(/2 to 4 verify/);
    expect(problems({ ...LAB_SUMMARY, verify: ['1', '2', '3', '4', '5'] })).toMatch(/2 to 4 verify/);
  });
  test('maxRuns is a whole number from 2 to 8, and a comparison needs 4 or more', () => {
    for (const maxRuns of [1, 9, 2.5]) expect(problems({ ...LAB_SUMMARY, maxRuns })).toMatch(/maxRuns/);
    expect(problems({ ...LAB_COMPARE_PROMPTS, maxRuns: 3 })).toMatch(/comparison lab needs maxRuns of 4/);
    expect(problems({ ...LAB_COMPARE_MODELS, maxRuns: 2 })).toMatch(/comparison lab needs maxRuns of 4/);
    expect(labProblems({ ...LAB_COMPARE_MODELS, maxRuns: 8 })).toEqual([]);
  });
  test('empty required text is a problem', () => {
    expect(problems({ ...LAB_SUMMARY, system: '  ' })).toMatch(/system is empty/);
    expect(problems({ ...LAB_SUMMARY, starterPrompt: '' })).toMatch(/starterPrompt is empty/);
    expect(problems({ ...LAB_SUMMARY, example: { prompt: '', outcome: 'x' } })).toMatch(/example.prompt is empty/);
  });
});

describe('material and facts', () => {
  test('material is capped at 3,000 characters', () => {
    expect(problems({ ...LAB_SUMMARY, material: 'a '.repeat(MAX_MATERIAL_CHARS) })).toMatch(/limit is 3000/);
    expect(labProblems({ ...LAB_SUMMARY, material: `${LAB_SUMMARY.material} ${'b'.repeat(500)}` })).toEqual([]);
  });
  test.each(['summarization', 'classification', 'document-analysis', 'structured-output'] as const)('a %s lab needs material', (experiment) => {
    expect(problems({ ...LAB_SUMMARY, experiment, material: undefined })).toMatch(/needs material/);
  });
  test('a playground, text-generation or tool-use lab needs none', () => {
    expect(labProblems({ ...LAB_COMPARE_PROMPTS })).toEqual([]);
    expect(labProblems({ ...LAB_TOOLS })).toEqual([]);
  });
  test('a summarization or document-analysis lab needs 3 to 8 facts', () => {
    expect(problems({ ...LAB_SUMMARY, facts: undefined })).toMatch(/3 to 8 facts/);
    expect(problems({ ...LAB_SUMMARY, facts: ['one', 'two'] })).toMatch(/3 to 8 facts/);
    expect(problems({ ...LAB_SUMMARY, experiment: 'document-analysis', facts: Array.from({ length: 9 }, (_, index) => `fact ${index}`) })).toMatch(/3 to 8 facts/);
  });
});

describe('structured output', () => {
  const fields = LAB_CLASSIFY.output.format === 'json' ? LAB_CLASSIFY.output.fields : [];
  test('a JSON lab needs at least one field, with unique names', () => {
    expect(problems({ ...LAB_CLASSIFY, output: { format: 'json', fields: [] }, key: undefined })).toMatch(/at least one field/);
    expect(problems({ ...LAB_CLASSIFY, output: { format: 'json', fields: [fields[0], fields[0]] }, key: undefined })).toMatch(/unique/);
  });
  test('every key name must be a field, with the field’s type and an allowed value', () => {
    expect(problems({ ...LAB_CLASSIFY, key: { ...LAB_CLASSIFY.key, invented: 'x' } })).toMatch(/key "invented" is not a field/);
    expect(problems({ ...LAB_CLASSIFY, key: { ...LAB_CLASSIFY.key, urgent: 'yes' } })).toMatch(/key "urgent" is string but the field is boolean/);
    expect(problems({ ...LAB_CLASSIFY, key: { ...LAB_CLASSIFY.key, category: 'complaint' } })).toMatch(/not one of the field's allowed values/);
  });
  test('a key needs a JSON output', () => {
    expect(problems({ ...LAB_CLASSIFY, output: { format: 'text' } })).toMatch(/key needs a JSON output/);
  });
  test('oneOf only fits text and lists of text', () => {
    expect(problems({ ...LAB_CLASSIFY, output: { format: 'json', fields: [{ name: 'urgent', type: 'boolean', oneOf: ['x'] }] }, key: undefined })).toMatch(/oneOf/);
  });
});

describe('tools', () => {
  const tool = (LAB_TOOLS.tools ?? [])[0];
  test('a tool-use lab needs 1 to 3 tools; any other lab has none', () => {
    expect(problems({ ...LAB_TOOLS, tools: [] })).toMatch(/1 to 3 tools/);
    expect(problems({ ...LAB_TOOLS, tools: [tool, { ...tool, name: 'b_tool' }, { ...tool, name: 'c_tool' }, { ...tool, name: 'd_tool' }] })).toMatch(/1 to 3 tools/);
    expect(problems({ ...LAB_SUMMARY, tools: [tool] })).toMatch(/only a tool-use lab has tools/);
  });
  test('every tool has at least one fixture, a snake_case name and fixtures that give exactly its parameters', () => {
    expect(problems({ ...LAB_TOOLS, tools: [{ ...tool, fixtures: [] }] })).toMatch(/at least one fixture/);
    expect(problems({ ...LAB_TOOLS, tools: [{ ...tool, name: 'Order-Status' }] })).toMatch(/snake_case/);
    expect(problems({ ...LAB_TOOLS, tools: [{ ...tool, fixtures: [{ args: { wrong: '1' }, result: { ok: true } }] }] })).toMatch(/does not give exactly the tool's parameters/);
    expect(problems({ ...LAB_TOOLS, tools: [tool, tool] })).toMatch(/share a name/);
  });
  test('a comparison cannot be a tool-use lab', () => {
    expect(problems({ ...LAB_TOOLS, compare: 'models', maxRuns: 4 })).toMatch(/tool-use lab cannot be a comparison/);
  });
});

describe('the model’s side stays the model’s', () => {
  test('system must not contain the answer', () => {
    expect(problems({ ...LAB_SUMMARY, system: 'Be helpful. The answer is Thursday.' })).toMatch(/"answer is"/);
    expect(labProblems({ ...LAB_SUMMARY, system: 'Be helpful. Answers should be short.' })).toEqual([]);
  });
  test('the framing is never repeated in a field the learner reads, material included', () => {
    const system = 'Answer only from the material and name the owner of each task.';
    expect(problems({ ...LAB_SUMMARY, system, tips: [...LAB_SUMMARY.tips.slice(0, 2), `Remember: ${system}`] })).toMatch(/private text is repeated/);
    expect(problems({ ...LAB_SUMMARY, system, material: `${LAB_SUMMARY.material} ${system}` })).toMatch(/private text is repeated/);
  });
  test('a tool’s records are never repeated in a tip, the checklist or the goal; the example’s outcome and the verify list may say what a lookup returned', () => {
    expect(problems({ ...LAB_TOOLS, tips: [...LAB_TOOLS.tips.slice(0, 2), `Expect ${LAB_MARKERS.fixtureResult}.`] })).toMatch(/private text is repeated/);
    expect(problems({ ...LAB_TOOLS, goal: `Get ${LAB_MARKERS.fixtureOther} from the tool` })).toMatch(/private text is repeated/);
    expect(labProblems({ ...LAB_TOOLS, verify: [`The reply matches ${LAB_MARKERS.fixtureHours}.`, ...LAB_TOOLS.verify.slice(1)] })).toEqual([]);
    expect(labProblems({ ...LAB_TOOLS, example: { prompt: 'Look up order 1042.', outcome: `It returns: ${LAB_MARKERS.fixtureResult}` } })).toEqual([]);
  });
  test('a key value may sit in the material, but not in the tips, the example, the checklist or the goal; a fact may (it only restates the material)', () => {
    const key = { ...LAB_CLASSIFY, key: { ...LAB_CLASSIFY.key, reason: 'The parcel was held at the customs office in Cebu' } };
    expect(labProblems(key)).toEqual([]);
    expect(problems({ ...key, tips: [...key.tips.slice(0, 2), 'Look for: the parcel was held at the customs office in Cebu.'] })).toMatch(/a key value is repeated/);
    expect(problems({ ...key, example: { prompt: 'x y z', outcome: 'It says the parcel was held at the customs office in Cebu.' } })).toMatch(/a key value is repeated/);
    // A label the field lists in oneOf is public by design.
    expect(labProblems({ ...LAB_CLASSIFY, example: { prompt: 'Classify the ticket as billing, shipping or other.', outcome: 'It answers shipping and flags the ticket as urgent.' } })).toEqual([]);
    expect(labProblems({ ...LAB_SUMMARY, example: { prompt: LAB_SUMMARY.example.prompt, outcome: `Bullets such as: ${LAB_SUMMARY.facts?.[1]}.` } })).toEqual([]);
  });
});

