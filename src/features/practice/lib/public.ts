import type { LabTask, LabTool, MessageTask, RoleplayScenario } from '../types';

/**
 * What the screens may show about an item: the learner has read the setting, the goal, the partner's name and role, and the brief.
 * The partner's personality, hidden motives and reactions, the rubric, the traps and what a complete answer contains are for the
 * server's instructions only. (The catalog file ships in the app because the screens need the public part, so this is a filter for
 * the screens and for anything handed to Tali; the server never returns a private field.)
 */

export type PublicScenario = Pick<RoleplayScenario, 'id' | 'kind' | 'title' | 'setting' | 'goal' | 'opening' | 'minTurns' | 'maxTurns' | 'criteria' | 'difficulty' | 'speaking'> & {
  partner: Pick<RoleplayScenario['partner'], 'role' | 'name' | 'title'>;
};

export type PublicTask = Pick<MessageTask, 'id' | 'kind' | 'title' | 'situation' | 'brief' | 'channel' | 'received' | 'targetWords' | 'criteria' | 'difficulty'>;

export const publicScenario = (scenario: RoleplayScenario): PublicScenario => ({
  id: scenario.id,
  kind: scenario.kind,
  title: scenario.title,
  setting: scenario.setting,
  goal: scenario.goal,
  opening: scenario.opening,
  minTurns: scenario.minTurns,
  maxTurns: scenario.maxTurns,
  criteria: scenario.criteria,
  difficulty: scenario.difficulty,
  ...(scenario.speaking ? { speaking: true } : {}),
  partner: { role: scenario.partner.role, name: scenario.partner.name, title: scenario.partner.title },
});

export const publicTask = (task: MessageTask): PublicTask => ({
  id: task.id,
  kind: task.kind,
  title: task.title,
  situation: task.situation,
  brief: task.brief,
  channel: task.channel,
  ...(task.received ? { received: task.received } : {}),
  targetWords: task.targetWords,
  criteria: task.criteria,
  difficulty: task.difficulty,
});

/**
 * What the screens may show about a prompt lab: the situation, the goal, the material, the starter prompt, the checklist, the tips, the example, the
 * verify list, the shape of the answer asked for and the names and descriptions of the tools. Never `system`, `key`, `facts` or a tool's fixtures:
 * those are the server's (the key's values are returned only by a review, by code). The catalog file ships in the app because the screens need this
 * part, so this is a filter for the screens and for anything handed to Tali.
 */
export type PublicLab = Pick<LabTask, 'id' | 'kind' | 'title' | 'experiment' | 'situation' | 'goal' | 'material' | 'starterPrompt' | 'compare' | 'maxRuns' | 'output' | 'criteria' | 'tips' | 'example' | 'verify' | 'difficulty'> & {
  tools?: Pick<LabTool, 'name' | 'description' | 'params'>[];
};

export const publicLab = (lab: LabTask): PublicLab => ({
  id: lab.id,
  kind: lab.kind,
  title: lab.title,
  experiment: lab.experiment,
  situation: lab.situation,
  goal: lab.goal,
  ...(lab.material ? { material: lab.material } : {}),
  starterPrompt: lab.starterPrompt,
  ...(lab.compare ? { compare: lab.compare } : {}),
  maxRuns: lab.maxRuns,
  output: lab.output.format === 'json' ? { format: 'json', fields: lab.output.fields.map((field) => ({ name: field.name, type: field.type, ...(field.required ? { required: true } : {}), ...(field.oneOf ? { oneOf: [...field.oneOf] } : {}) })) } : { format: 'text' },
  criteria: lab.criteria.map((criterion) => ({ id: criterion.id, label: criterion.label })),
  tips: [...lab.tips],
  example: { prompt: lab.example.prompt, outcome: lab.example.outcome },
  verify: [...lab.verify],
  difficulty: lab.difficulty,
  ...(lab.tools ? { tools: lab.tools.map((tool) => ({ name: tool.name, description: tool.description, params: tool.params.map((param) => ({ ...param })) })) } : {}),
});
