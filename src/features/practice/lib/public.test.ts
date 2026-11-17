import { describe, expect, test } from '@jest/globals';

import { ALL_TEST_LABS, LAB_CLASSIFY, LAB_MARKERS, LAB_TOOLS } from '../lab-test-support';
import { PRIVATE_MARKERS, SCENARIO, TASK } from '../test-support';
import { publicLab, publicScenario, publicTask } from './public';

describe('the public view of an item', () => {
  test('a scenario carries nothing private', () => {
    const text = JSON.stringify(publicScenario(SCENARIO));
    for (const marker of Object.values(PRIVATE_MARKERS)) expect(text).not.toContain(marker);
    expect(text).not.toContain('strongSigns');
    expect(text).not.toContain('traps');
    expect(text).not.toContain('reactions');
    expect(publicScenario(SCENARIO)).toMatchObject({ id: SCENARIO.id, setting: SCENARIO.setting, opening: SCENARIO.opening, partner: { name: 'Dana', role: 'client' } });
  });
  test('a task carries nothing private', () => {
    const text = JSON.stringify(publicTask(TASK));
    for (const marker of Object.values(PRIVATE_MARKERS)) expect(text).not.toContain(marker);
    expect(text).not.toContain('mustInclude');
    expect(publicTask(TASK)).toMatchObject({ id: TASK.id, brief: TASK.brief, received: TASK.received });
  });
});

describe('the public view of a prompt lab', () => {
  test.each(ALL_TEST_LABS.map((lab) => [lab.id, lab] as const))('%s carries nothing the model alone may know', (_id, lab) => {
    const view = publicLab(lab);
    const text = JSON.stringify(view);
    for (const marker of Object.values(LAB_MARKERS)) expect(text).not.toContain(marker);
    for (const key of ['"system"', '"key"', '"facts"', '"fixtures"']) expect(text).not.toContain(key);
    expect(Object.keys(view)).not.toEqual(expect.arrayContaining(['system']));
    expect(view).toMatchObject({ id: lab.id, title: lab.title, starterPrompt: lab.starterPrompt, maxRuns: lab.maxRuns });
  });

  test('gives the learner what they need: the checklist, the tips, the example, the verify list and the shape of the answer', () => {
    const view = publicLab(LAB_CLASSIFY);
    expect(view.criteria.map((criterion) => criterion.label)).toEqual(LAB_CLASSIFY.criteria.map((criterion) => criterion.label));
    expect(view.tips).toEqual(LAB_CLASSIFY.tips);
    expect(view.example).toEqual(LAB_CLASSIFY.example);
    expect(view.verify).toEqual(LAB_CLASSIFY.verify);
    expect(view.output).toMatchObject({ format: 'json' });
    expect(view.output.format === 'json' && view.output.fields.map((field) => field.name)).toEqual(['category', 'urgent', 'tags', 'reason']);
    expect(view.material).toBe(LAB_CLASSIFY.material);
  });

  test('a tool is shown by name, description and parameters only', () => {
    const view = publicLab(LAB_TOOLS);
    expect(view.tools?.map((tool) => tool.name)).toEqual(['order_status', 'store_hours']);
    expect(view.tools?.[0]).toEqual({ name: 'order_status', description: expect.any(String), params: [{ name: 'order_id', type: 'string', description: expect.any(String) }] });
  });
});
