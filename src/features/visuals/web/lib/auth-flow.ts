import type { DiagramSpec, Payload, StagedStep } from '../../diagrams';
import type { WebStrings } from '../strings';

export const AUTH_OUTCOMES = ['granted', 'bad-password', 'expired', 'no-token', 'forbidden'] as const;
export type AuthOutcome = (typeof AUTH_OUTCOMES)[number];

type MessageKey = keyof WebStrings['auth']['messages'];
type Participant = 'browser' | 'server' | 'db';

/** Each message: who sends it to whom, and whether it is a reply (drawn dashed). */
const MESSAGES: Record<MessageKey, { from: Participant; to: Participant; dashed?: boolean }> = {
  login: { from: 'browser', to: 'server' },
  findUser: { from: 'server', to: 'db' },
  userRow: { from: 'db', to: 'server', dashed: true },
  compare: { from: 'server', to: 'server' },
  badPassword: { from: 'server', to: 'browser', dashed: true },
  issue: { from: 'server', to: 'browser', dashed: true },
  useToken: { from: 'browser', to: 'server' },
  useTokenOld: { from: 'browser', to: 'server' },
  verify: { from: 'server', to: 'server' },
  profile: { from: 'server', to: 'browser', dashed: true },
  expired: { from: 'server', to: 'browser', dashed: true },
  loginAgain: { from: 'browser', to: 'browser' },
  noToken: { from: 'browser', to: 'server' },
  lookToken: { from: 'server', to: 'server' },
  notLoggedIn: { from: 'server', to: 'browser', dashed: true },
  adminCall: { from: 'browser', to: 'server' },
  verifyOk: { from: 'server', to: 'server' },
  permission: { from: 'server', to: 'server' },
  forbidden: { from: 'server', to: 'browser', dashed: true },
};

const LOGIN: MessageKey[] = ['login', 'findUser', 'userRow', 'compare'];

export const AUTH_SEQUENCES: Record<AuthOutcome, readonly MessageKey[]> = {
  granted: [...LOGIN, 'issue', 'useToken', 'verify', 'profile'],
  'bad-password': [...LOGIN, 'badPassword'],
  expired: ['useTokenOld', 'verify', 'expired', 'loginAgain'],
  'no-token': ['noToken', 'lookToken', 'notLoggedIn'],
  forbidden: ['adminCall', 'verifyOk', 'permission', 'forbidden'],
};

/** Messages where the (made-up) token is on the wire, so the example is shown. */
const TOKEN_ON_WIRE: ReadonlySet<MessageKey> = new Set(['issue', 'useToken', 'useTokenOld', 'adminCall']);

export function authSpec(outcome: AuthOutcome, s: WebStrings['auth']): DiagramSpec {
  const keys = AUTH_SEQUENCES[outcome];
  return {
    kind: 'sequence',
    title: s.outcomes[outcome],
    summary: s.summary,
    participants: [
      { id: 'browser', label: s.participants.browser, shape: 'actor', note: s.participantNotes.browser },
      { id: 'server', label: s.participants.server, note: s.participantNotes.server },
      { id: 'db', label: s.participants.db, shape: 'database', note: s.participantNotes.db },
    ],
    messages: keys.map((key) => ({ from: MESSAGES[key].from, to: MESSAGES[key].to, label: s.messages[key], ...(MESSAGES[key].dashed ? { dashed: true } : {}) })),
  };
}

export function buildAuthSteps(outcome: AuthOutcome, s: WebStrings['auth']): StagedStep[] {
  const token: Payload = { title: s.tokenTitle, lines: s.tokenLines, tone: 'info' };
  return AUTH_SEQUENCES[outcome].map((key, index) => {
    const message = MESSAGES[key];
    return {
      caption: s.captions[key],
      nodes: [...new Set([message.from, message.to])],
      edges: [index],
      ...(TOKEN_ON_WIRE.has(key) ? { payloads: [token] } : {}),
    };
  });
}
