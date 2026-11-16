export const STAGES = ['commit', 'build', 'test', 'deploy'] as const;
export type Stage = (typeof STAGES)[number];
export type StageStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
export type Check = 'pass' | 'fail';

export type PipelineConfig = { build: Check; test: Check };

export type PipelineStep = {
  statuses: Readonly<Record<Stage, StageStatus>>;
  /** The stage this step is about, or null for the start. */
  stage: Stage | null;
  /** What just happened, as a key the component turns into a sentence. */
  event: 'start' | 'running' | 'passed' | 'failed' | 'stopped' | 'live';
};

const pending = (): Record<Stage, StageStatus> => ({ commit: 'pending', build: 'pending', test: 'pending', deploy: 'pending' });

/**
 * The pipeline run as a list of steps: each stage runs, then passes or fails. The commit stage always
 * passes (the push itself). A failing build or test stops the pipeline: every later stage is skipped,
 * and nothing is deployed.
 */
export function buildPipelineRun(config: PipelineConfig): PipelineStep[] {
  const steps: PipelineStep[] = [{ statuses: pending(), stage: null, event: 'start' }];
  let statuses = pending();
  for (const stage of STAGES) {
    statuses = { ...statuses, [stage]: 'running' };
    steps.push({ statuses, stage, event: 'running' });
    const outcome: Check = stage === 'build' ? config.build : stage === 'test' ? config.test : 'pass';
    if (outcome === 'fail') {
      statuses = { ...statuses, [stage]: 'failed' };
      const rest = STAGES.slice(STAGES.indexOf(stage) + 1);
      for (const later of rest) statuses = { ...statuses, [later]: 'skipped' };
      steps.push({ statuses, stage, event: 'failed' });
      steps.push({ statuses, stage, event: 'stopped' });
      return steps;
    }
    statuses = { ...statuses, [stage]: 'passed' };
    steps.push({ statuses, stage, event: stage === 'deploy' ? 'live' : 'passed' });
  }
  return steps;
}
