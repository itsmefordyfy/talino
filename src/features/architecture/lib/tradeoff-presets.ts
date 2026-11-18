import { blankMatrix, MATRIX_LIMITS, type MatrixState } from './tradeoff';

/**
 * Starting matrices for TindaTrack, an inventory and sales app for small stores. They name the options and the qualities worth weighing and nothing else:
 * every weight is the neutral middle and no option is scored, so a preset can never lead the learner to a conclusion. The learner sets what matters.
 */
export type TradeoffPresetId = 'blank' | 'style' | 'database' | 'api';

export type TradeoffPreset = { id: TradeoffPresetId; label: string; build: () => MatrixState };

const make = (question: string, options: string[], criteria: string[]): MatrixState => ({
  question,
  options: options.map((name, index) => ({ id: `o${index + 1}`, name })),
  criteria: criteria.map((name, index) => ({ id: `c${index + 1}`, name, weight: MATRIX_LIMITS.neutralWeight, scores: {} })),
});

export const TRADEOFF_PRESETS: readonly TradeoffPreset[] = [
  { id: 'blank', label: 'Blank', build: blankMatrix },
  {
    id: 'style',
    label: 'Monolith or microservices',
    build: () =>
      make(
        'How should TindaTrack be structured as it grows from one store to many?',
        ['Single monolith', 'Modular monolith', 'Microservices'],
        ['Time to the first release', 'Skills of the current team', 'Ease of changing one part safely', 'Effort to run and monitor', 'Monthly running cost', 'Scaling one part on its own'],
      ),
  },
  {
    id: 'database',
    label: 'Managed or self-hosted database',
    build: () =>
      make(
        'Where should TindaTrack keep its stores, products and sales?',
        ['Managed database service', 'Self-hosted database'],
        ['Effort to set up', 'Monthly cost', 'Control over tuning', 'Backups and recovery', 'Operations skills the team has', 'Where the data must be kept'],
      ),
  },
  {
    id: 'api',
    label: 'REST or GraphQL',
    build: () =>
      make(
        'How should the TindaTrack screens talk to the server?',
        ['REST', 'GraphQL'],
        ['Fit with the screens the stores use', 'Time for the team to learn it', 'Caching and speed on slow connections', 'Room for new clients later', 'Tools the team already knows', 'Control over how much data each screen gets'],
      ),
  },
];

export const findPreset = (id: string): TradeoffPreset | undefined => TRADEOFF_PRESETS.find((preset) => preset.id === id);
