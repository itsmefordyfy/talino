import { LAB_EXPERIMENTS, type LabTask } from '../types';

/**
 * The rules every prompt lab in the catalog must meet (docs/content/GENAI_BRIEF.md, "Prompt labs"), as a pure check the catalog test runs on the real
 * labs and on invented bad ones. Returns one sentence per problem; empty means the lab is well formed. A lab that breaks the privacy rules could leak
 * what the model alone may know, so those are checked as hard as the shape.
 */

const ID = /^lab-\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TOOL_NAME = /^[a-z][a-z0-9_]*$/;
const NEEDS_MATERIAL = ['summarization', 'classification', 'document-analysis', 'structured-output'];
const NEEDS_FACTS = ['summarization', 'document-analysis'];
export const MAX_MATERIAL_CHARS = 3000;
/** A private line shorter than this is a common phrase, not a leak. */
const MIN_PRIVATE_CHARS = 12;

const squash = (text: string): string =>
  text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/** What a learner may read besides the material: the material is the one place a fact or a key value legitimately appears. */
function publicFields(lab: LabTask, describesResults = true): string[] {
  return [
    lab.title,
    lab.situation,
    lab.goal,
    lab.starterPrompt,
    ...lab.criteria.map((criterion) => criterion.label),
    ...lab.tips,
    lab.example.prompt,
    ...(describesResults ? [lab.example.outcome, ...lab.verify] : []),
    ...(lab.tools ?? []).flatMap((tool) => [tool.name, tool.description, ...tool.params.flatMap((param) => [param.name, param.description])]),
  ];
}

export function labProblems(lab: LabTask): string[] {
  const problems: string[] = [];
  const add = (message: string) => problems.push(message);
  const blank = (text: unknown) => typeof text !== 'string' || text.trim() === '';

  if (!ID.test(lab.id)) add(`id "${lab.id}" is not lab-NN-kebab.`);
  if (lab.kind !== 'lab') add('kind is not "lab".');
  if (!(LAB_EXPERIMENTS as readonly string[]).includes(lab.experiment)) add(`experiment "${lab.experiment}" is unknown.`);
  for (const [name, value] of [['title', lab.title], ['situation', lab.situation], ['goal', lab.goal], ['starterPrompt', lab.starterPrompt], ['system', lab.system], ['example.prompt', lab.example?.prompt], ['example.outcome', lab.example?.outcome]] as const) if (blank(value)) add(`${name} is empty.`);
  if (!['gentle', 'realistic', 'demanding'].includes(lab.difficulty)) add(`difficulty "${lab.difficulty}" is unknown.`);

  // The checklist, the tips and the verify list.
  if (lab.criteria.length < 3 || lab.criteria.length > 6) add(`needs 3 to 6 criteria, has ${lab.criteria.length}.`);
  const criterionIds = lab.criteria.map((criterion) => criterion.id);
  if (new Set(criterionIds).size !== criterionIds.length || criterionIds.some((id) => !KEBAB.test(id))) add('criterion ids must be unique kebab-case.');
  if (lab.criteria.some((criterion) => blank(criterion.label))) add('a criterion has an empty label.');
  if (lab.tips.length < 3 || lab.tips.length > 5) add(`needs 3 to 5 tips, has ${lab.tips.length}.`);
  if (lab.verify.length < 2 || lab.verify.length > 4) add(`needs 2 to 4 verify items, has ${lab.verify.length}.`);
  if ([...lab.tips, ...lab.verify].some(blank)) add('a tip or a verify item is empty.');

  // Runs and comparisons.
  if (!Number.isInteger(lab.maxRuns) || lab.maxRuns < 2 || lab.maxRuns > 8) add(`maxRuns must be a whole number from 2 to 8, is ${lab.maxRuns}.`);
  if (lab.compare !== undefined && lab.compare !== 'prompts' && lab.compare !== 'models') add(`compare "${String(lab.compare)}" is unknown.`);
  if (lab.compare && lab.maxRuns < 4) add('a comparison lab needs maxRuns of 4 or more.');
  if (lab.compare && lab.experiment === 'tool-use') add('a tool-use lab cannot be a comparison (the trace is of one run).');

  // The material.
  if (lab.material !== undefined && lab.material.length > MAX_MATERIAL_CHARS) add(`material is ${lab.material.length} characters; the limit is ${MAX_MATERIAL_CHARS}.`);
  if (NEEDS_MATERIAL.includes(lab.experiment) && blank(lab.material)) add(`a ${lab.experiment} lab needs material.`);
  if (NEEDS_FACTS.includes(lab.experiment) && (!lab.facts || lab.facts.length < 3 || lab.facts.length > 8)) add(`a ${lab.experiment} lab needs 3 to 8 facts.`);
  if (lab.facts && lab.facts.some(blank)) add('a fact is empty.');

  // Structured output and its key.
  const fields = lab.output.format === 'json' ? lab.output.fields : [];
  if (lab.output.format === 'json') {
    if (fields.length < 1) add('a JSON lab needs at least one field.');
    const names = fields.map((field) => field.name);
    if (new Set(names).size !== names.length || names.some(blank)) add('field names must be unique and not empty.');
    for (const field of fields) if (field.oneOf && (field.type !== 'string' && field.type !== 'string[]' ? true : field.oneOf.length === 0 || field.oneOf.some(blank))) add(`field "${field.name}" has a oneOf that does not fit its type or is empty.`);
  }
  if (lab.key) {
    if (lab.output.format !== 'json') add('a key needs a JSON output.');
    for (const [name, value] of Object.entries(lab.key)) {
      const field = fields.find((candidate) => candidate.name === name);
      if (!field) {
        add(`key "${name}" is not a field of the output.`);
        continue;
      }
      const type = Array.isArray(value) ? 'string[]' : typeof value;
      if (type !== field.type) add(`key "${name}" is ${type} but the field is ${field.type}.`);
      const picked = Array.isArray(value) ? value : [value];
      if (field.oneOf && picked.some((item) => typeof item !== 'string' || !field.oneOf?.map((option) => option.toLowerCase()).includes(item.toLowerCase()))) add(`key "${name}" is not one of the field's allowed values.`);
    }
  }

  // Tools.
  const tools = lab.tools ?? [];
  if (lab.experiment === 'tool-use') {
    if (tools.length < 1 || tools.length > 3) add(`a tool-use lab needs 1 to 3 tools, has ${tools.length}.`);
  } else if (tools.length > 0) add('only a tool-use lab has tools.');
  if (new Set(tools.map((tool) => tool.name)).size !== tools.length) add('two tools share a name.');
  for (const tool of tools) {
    if (!TOOL_NAME.test(tool.name)) add(`tool "${tool.name}" needs a snake_case name.`);
    if (blank(tool.description) || tool.params.length === 0) add(`tool "${tool.name}" needs a description and at least one parameter.`);
    if (tool.fixtures.length < 1) add(`tool "${tool.name}" needs at least one fixture.`);
    const paramNames = tool.params.map((param) => param.name).sort().join(',');
    if (tool.fixtures.some((fixture) => Object.keys(fixture.args).sort().join(',') !== paramNames)) add(`a fixture of tool "${tool.name}" does not give exactly the tool's parameters.`);
  }

  // The model's side stays the model's.
  if (/\banswer is\b/i.test(lab.system)) add('system must not contain the answer ("answer is").');
  const readable = publicFields(lab).map(squash);
  // The example's outcome and the verify list describe what a good run ends with, so they may say what a tool returned (the learner sees that in the trace anyway); the framing and a key value they may not.
  const material = lab.material ? [squash(lab.material)] : [];
  const appearsIn = (text: string, haystacks: readonly string[]) => text.length >= MIN_PRIVATE_CHARS && haystacks.some((haystack) => haystack.includes(text));
  // The framing and the tools' records appear nowhere a learner reads, material included. A key value may appear in the material (it is read from there) and
  // nowhere else a learner reads before the review: a tip or an example that states it gives the answer away. A fact only restates the material, so it is not checked.
  const framing = [lab.system];
  const records = [...tools.flatMap((tool) => tool.fixtures.flatMap((fixture) => [...Object.values(fixture.args), ...Object.values(fixture.result)].filter((value): value is string => typeof value === 'string')))];
  // A label the field lists in `oneOf` is public by design (the learner chooses among them), so it is not a spoiler.
  const options = new Set(fields.flatMap((field) => field.oneOf ?? []).map(squash));
  const keyValues = Object.values(lab.key ?? {})
    .flatMap((value) => (Array.isArray(value) ? value : typeof value === 'string' ? [value] : []))
    .filter((value) => !options.has(squash(value)));
  for (const text of framing) if (appearsIn(squash(text), [...readable, ...material])) add(`private text is repeated in a field the learner reads: "${text.slice(0, 40)}".`);
  for (const text of records) if (appearsIn(squash(text), [...publicFields(lab, false).map(squash), ...material])) add(`private text is repeated in a field the learner reads: "${text.slice(0, 40)}".`);
  for (const text of keyValues) if (appearsIn(squash(text), readable)) add(`a key value is repeated in a tip, the example, the checklist or another field the learner reads: "${text.slice(0, 40)}".`);
  return problems;
}
