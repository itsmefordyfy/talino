/**
 * The prompt lab's two modes of `/api/practice` (Generative AI course): `lab-run`, a live run of the learner's prompt on the lab's material, and
 * `lab-review`, the prompt coach's review of the latest run. Server only. The lab is read from the catalog by id; its framing, key, facts and tool
 * fixtures stay here (a tool is answered from its fixtures and nothing else), the material is the catalog's and never the phone's, and everything a
 * model says is untrusted: capped, checked, and refused when it repeats the lab's own text. Design: docs/content/GENAI_ENGINE.md.
 */

import { PRACTICE_APP } from '@/features/practice/lib/limits';
import { checkLabPrompts, outputsPerRun, promptsPerRun } from '@/features/practice/lib/lab-input';
import { keyChecksFor } from '@/features/practice/lib/lab-check';
import { buildLabReviewPrompt, buildLabRunMessage, buildLabRunSystem, formatLabReviewData, labTemperature } from '@/features/practice/lib/lab-prompt';
import { LAB_REVIEW_SCHEMA, parseLabReview } from '@/features/practice/lib/lab-review';
import { buildLabOutput, type LabOutput } from '@/features/practice/lib/lab-run';
import { MAX_CALLS_PER_ROUND, MAX_TOOL_ROUNDS, runLabTool, sanitizeToolSteps, toolDeclarations, type ToolStep } from '@/features/practice/lib/lab-tools';
import { cleanText, MAX_LAB_OUTPUT_CHARS, MAX_LAB_PROMPT_CHARS, whole } from '@/features/practice/lib/sanitize';
import type { LabTask } from '@/features/practice/types';

import { ask, tokensOf, type Body } from './ai-ask';
import { completeChat } from './ai-chat-quota';
import { compareModels, functionCallsOf, modelPartsOf } from './gemini';
import { begin, type Common } from './practice-allowance';

/** Room for a reply and, in a model that thinks first, for its thinking. */
const MAX_OUTPUT_TOKENS = 3000;

type Tokens = { input: number; output: number };

/** What the learner wrote, as one prompt or (for a comparison of prompts) two; anything else the phone sent is ignored. */
function promptsOf(body: Body, lab: LabTask): string[] {
  if (lab.compare === 'prompts') return (Array.isArray(body.prompts) ? body.prompts.slice(0, 2) : []).map((prompt) => cleanText(prompt, MAX_LAB_PROMPT_CHARS));
  return [cleanText(body.prompt, MAX_LAB_PROMPT_CHARS)];
}

const refusedPrompt = (reason: string): Response => Response.json({ error: reason === 'bad_prompts' ? 'bad_request' : reason }, { status: 400 });

type Ran = { output: LabOutput; tokens: Tokens } | Response;

/** One model call, or the tool-use rounds, for one prompt. A failed call has already given the session back (inside `ask`). */
async function runOne(lab: LabTask, common: Common, giveBack: () => Promise<void>, prompt: string, label: 'A' | 'B', model?: string): Promise<Ran> {
  const system = buildLabRunSystem(lab);
  const user = { role: 'user', parts: [{ text: buildLabRunMessage(lab, prompt) }] };
  const json = lab.output.format === 'json';
  const started = Date.now();
  const tokens: Tokens = { input: 0, output: 0 };
  const add = (found: ReturnType<typeof tokensOf>) => {
    tokens.input += found.input ?? 0;
    tokens.output += found.output ?? 0;
  };
  // Function calling can't be combined with a JSON response type, so a tool lab asks for JSON in words (the run rules do) and the check reads it either way.
  const generationConfig = { temperature: labTemperature(lab), maxOutputTokens: MAX_OUTPUT_TOKENS, ...(json && lab.experiment !== 'tool-use' ? { responseMimeType: 'application/json' } : {}) };

  if (lab.experiment !== 'tool-use' || !lab.tools || lab.tools.length === 0) {
    const answer = await ask(common.apiKey, { systemInstruction: { parts: [{ text: system }] }, contents: [user], generationConfig }, giveBack, 'practice', { model });
    if (answer instanceof Response) return answer;
    add(tokensOf(answer.result));
    const output = buildLabOutput({ lab, label, text: answer.text, tokens, latencyMs: Date.now() - started, model: lab.compare === 'models' ? (answer.result.model ?? model) : undefined });
    return output ? { output, tokens } : unusable(giveBack);
  }

  const contents: Record<string, unknown>[] = [user];
  const steps: ToolStep[] = [];
  let text = '';
  for (let round = 1; round <= MAX_TOOL_ROUNDS; round += 1) {
    // The last round may only answer: the model has had its look-ups.
    const last = round === MAX_TOOL_ROUNDS;
    const answer = await ask(
      common.apiKey,
      {
        systemInstruction: { parts: [{ text: system }] },
        contents,
        tools: [{ functionDeclarations: toolDeclarations(lab.tools) }],
        toolConfig: { functionCallingConfig: { mode: last ? 'NONE' : 'AUTO' } },
        generationConfig,
      },
      giveBack,
      'practice',
      { allowToolCalls: true, model },
    );
    if (answer instanceof Response) return answer;
    add(tokensOf(answer.result));
    const calls = functionCallsOf(answer.result.data);
    if (calls.length === 0 || last) {
      text = answer.text;
      break;
    }
    // The model's own parts go back as they came (a thought signature is part of them), then one answer per call, from the fixtures only.
    contents.push({ role: 'model', parts: modelPartsOf(answer.result.data) });
    contents.push({
      role: 'user',
      parts: calls.map((call, index) => {
        const step = index < MAX_CALLS_PER_ROUND ? runLabTool(lab, call.name, call.args) : { tool: call.name, arguments: {}, result: { error: 'not found' } };
        if (index < MAX_CALLS_PER_ROUND) steps.push(step);
        return { functionResponse: { name: call.name, response: step.result } };
      }),
    });
  }
  const output = buildLabOutput({ lab, label, text, tokens, latencyMs: Date.now() - started, steps });
  return output ? { output, tokens } : unusable(giveBack);
}

/** A reply that is empty or repeats the lab's own framing is not shown; the session is given back and the learner can run again. */
async function unusable(giveBack: () => Promise<void>): Promise<Response> {
  await giveBack();
  return Response.json({ error: 'unknown' }, { status: 502 });
}

export async function runLab(body: Body, common: Common, lab: LabTask): Promise<Response> {
  const prompts = promptsOf(body, lab);
  // A run needs a prompt of the learner's own, a real edit of the starter: a modified app can't spend a run on nothing.
  const checked = checkLabPrompts(lab, prompts);
  if (!checked.ok) return refusedPrompt(checked.reason);
  // The phone counts the runs, as it counts a role-play's turns; the session's own message count (60) stays as the hard stop.
  const runNumber = whole(body.runNumber, 1, lab.maxRuns + 1);
  if (runNumber > lab.maxRuns) return Response.json({ error: 'conversation_full' }, { status: 409 });
  const models = lab.compare === 'models' ? compareModels() : null;
  if (lab.compare === 'models' && !models) return Response.json({ error: 'unavailable', reason: 'one_model' }, { status: 503 });

  const { refused, giveBack } = await begin(common);
  if (refused) return refused;

  // A comparison runs both at once; each call is its own, so a slow model does not make the other look slow.
  const jobs: Promise<Ran>[] =
    lab.compare === 'models' && models
      ? [runOne(lab, common, giveBack, prompts[0], 'A', models.small), runOne(lab, common, giveBack, prompts[0], 'B', models.large)]
      : prompts.slice(0, promptsPerRun(lab)).map((prompt, index) => runOne(lab, common, giveBack, prompt, index === 0 ? 'A' : 'B'));
  const ran = await Promise.all(jobs);
  const failed = ran.find((result): result is Response => result instanceof Response);
  if (failed) {
    await giveBack();
    return failed;
  }
  const done = ran as { output: LabOutput; tokens: Tokens }[];
  await completeChat(common.keys, common.sessionId, { input: done.reduce((sum, item) => sum + item.tokens.input, 0), output: done.reduce((sum, item) => sum + item.tokens.output, 0) }, PRACTICE_APP);
  return Response.json({ run: { outputs: done.map((item) => item.output) } });
}

export async function reviewLab(body: Body, common: Common, lab: LabTask): Promise<Response> {
  const prompts = promptsOf(body, lab);
  const checked = checkLabPrompts(lab, prompts);
  if (!checked.ok) return refusedPrompt(checked.reason);
  // The outputs are what the phone holds from the run: untrusted, bounded, and exactly as many as the lab produces.
  const outputs = (Array.isArray(body.outputs) ? body.outputs.slice(0, 2) : []).map((output) => cleanText(output, MAX_LAB_OUTPUT_CHARS));
  if (outputs.length !== outputsPerRun(lab) || outputs.some((output) => !output)) return Response.json({ error: 'bad_request' }, { status: 400 });
  const steps = sanitizeToolSteps(lab, body.toolSteps);

  const { refused, giveBack } = await begin(common);
  if (refused) return refused;

  const answer = await ask(
    common.apiKey,
    {
      systemInstruction: { parts: [{ text: buildLabReviewPrompt({ lab, outputs: outputs.length }) }] },
      contents: [{ role: 'user', parts: [{ text: formatLabReviewData({ lab, prompts, outputs, steps }) }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 6000, responseMimeType: 'application/json', responseSchema: LAB_REVIEW_SCHEMA },
    },
    giveBack,
    'practice',
  );
  if (answer instanceof Response) return answer;
  // The key is compared by code, never by the model, and the values travel only inside this review.
  const parsed = parseLabReview(answer.text, { lab, prompts, outputs, keyChecks: keyChecksFor(lab, outputs) });
  if (!parsed) {
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  await completeChat(common.keys, common.sessionId, tokensOf(answer.result), PRACTICE_APP);
  return Response.json({ review: parsed });
}
