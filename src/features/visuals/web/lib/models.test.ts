import { describe, expect, test } from '@jest/globals';

import { validateDiagram } from '../../diagrams/validate';
import { webStrings } from '../strings';
import { API_SCENARIO_IDS, apiTraceSpec, buildApiTrace, runApiScenario } from './api-trace';
import { AUTH_OUTCOMES, AUTH_SEQUENCES, authSpec, buildAuthSteps } from './auth-flow';
import { buildClientServerSteps, CLIENT_SERVER_IDS, clientServerSpec } from './client-server';
import { buildJoinSteps, DB, describeJoinStep, PLANS, sqlFor } from './joins';
import { answerJob, gradeAnswer, JOB_IDS, JOB_PLACE, nextJob, nodesFor, START } from './where-runs';

const s = webStrings.en;

function expectValid(spec: unknown) {
  const result = validateDiagram(spec);
  if (!result.ok) throw new Error(result.errors.join(', '));
}

describe('API request trace', () => {
  test('the diagram is a valid spec', () => {
    expectValid(apiTraceSpec(s.apiTrace));
  });

  test.each(API_SCENARIO_IDS)('%s has seven stages that light real nodes and edges', (id) => {
    const steps = buildApiTrace(id, s.apiTrace);
    const spec = apiTraceSpec(s.apiTrace);
    const nodeIds = spec.kind === 'flow' ? spec.nodes.map((node) => node.id) : [];
    expect(steps).toHaveLength(7);
    for (const step of steps) {
      expect(step.caption.length).toBeGreaterThan(10);
      for (const node of step.nodes ?? []) expect(nodeIds).toContain(node);
      for (const edge of step.edges ?? []) expect(edge).toBeLessThan(spec.kind === 'flow' ? spec.edges.length : 0);
    }
    // user, frontend, request, backend, database (or skipped), response, frontend again
    expect(steps.map((step) => step.nodes?.[step.nodes.length - 1])).toEqual(['user', 'frontend', 'request', 'backend', id === 'invalid' ? 'backend' : 'database', 'response', 'frontend']);
  });

  test('statuses come from the real handler', () => {
    expect(runApiScenario('get-user').result.response.status).toBe(200);
    expect(runApiScenario('create-user').result.response.status).toBe(201);
    expect(runApiScenario('not-found').result.response.status).toBe(404);
    expect(runApiScenario('invalid').result.response.status).toBe(400);
    expect(JSON.parse(runApiScenario('get-user').result.response.body ?? '{}')).toEqual({ id: 5, name: 'Maya' });
    expect(runApiScenario('create-user').result.response.headers).toContain('Location: /users/6');
  });

  test('payloads show the request and the response', () => {
    const steps = buildApiTrace('create-user', s.apiTrace);
    expect(steps[2].payloads?.[0].lines[0]).toBe('POST /users HTTP/1.1');
    expect(steps[2].payloads?.[0].lines).toContain('{"name":"Ben"}');
    expect(steps[5].payloads?.[0].lines[0]).toBe('HTTP/1.1 201 Created');
    expect(steps[5].payloads?.[0].tone).toBe('ok');
    expect(steps[4].payloads?.[0].lines[0]).toContain('INSERT INTO users');
  });

  test('a 404 reaches the database with no rows; a 400 never reaches it', () => {
    const notFound = buildApiTrace('not-found', s.apiTrace);
    expect(notFound[4].payloads?.[0].lines.join(' ')).toContain('0 rows');
    expect(notFound[5].payloads?.[0].tone).toBe('danger');
    const invalid = buildApiTrace('invalid', s.apiTrace);
    expect(invalid[4].nodes).toEqual(['backend']);
    expect(invalid[4].edges).toEqual([]);
    expect(invalid[4].caption).toMatch(/does not even contact the database/);
    expect(invalid[5].payloads?.[0].lines[0]).toBe('HTTP/1.1 400 Bad Request');
  });
});

describe('client and server', () => {
  test.each(CLIENT_SERVER_IDS)('%s: valid diagram, one step per caption, edges exist', (id) => {
    const spec = clientServerSpec(id, s.clientServer);
    expectValid(spec);
    const steps = buildClientServerSteps(id, s.clientServer);
    expect(steps).toHaveLength(s.clientServer.steps[id].length);
    const ids = spec.kind === 'architecture' ? spec.nodes.map((node) => node.id) : [];
    for (const step of steps) {
      for (const node of step.nodes ?? []) expect(ids).toContain(node);
      for (const edge of step.edges ?? []) expect(edge).toBeLessThan(spec.kind === 'architecture' ? spec.edges.length : 0);
    }
  });

  test('the client always asks first', () => {
    for (const id of CLIENT_SERVER_IDS) {
      const spec = clientServerSpec(id, s.clientServer);
      if (spec.kind !== 'architecture') throw new Error('kind');
      expect(spec.nodes.find((node) => node.id === spec.edges[0].from)?.group).toBe('Client');
    }
  });
});

describe('auth flow', () => {
  test.each(AUTH_OUTCOMES)('%s: valid sequence, a step and caption per message', (outcome) => {
    const spec = authSpec(outcome, s.auth);
    expectValid(spec);
    const steps = buildAuthSteps(outcome, s.auth);
    expect(steps).toHaveLength(AUTH_SEQUENCES[outcome].length);
    expect(spec.kind === 'sequence' && spec.messages.length).toBe(steps.length);
    steps.forEach((step, i) => {
      expect(step.edges).toEqual([i]);
      expect(step.caption.length).toBeGreaterThan(10);
    });
  });

  test('the story each outcome tells', () => {
    const last = (outcome: (typeof AUTH_OUTCOMES)[number]) => {
      const keys = AUTH_SEQUENCES[outcome];
      return keys[keys.length - 1];
    };
    expect(last('granted')).toBe('profile');
    expect(last('bad-password')).toBe('badPassword');
    expect(s.auth.messages.badPassword).toContain('401');
    expect(s.auth.messages.forbidden).toContain('403');
    expect(last('expired')).toBe('loginAgain');
    expect(AUTH_SEQUENCES['no-token']).not.toContain('login');
    expect(AUTH_SEQUENCES.forbidden).toContain('verifyOk');
  });

  test('the made-up token is shown only where it travels, and is labelled made up', () => {
    const steps = buildAuthSteps('granted', s.auth);
    const withToken = steps.filter((step) => step.payloads);
    expect(withToken).toHaveLength(2);
    expect(withToken[0].payloads?.[0].title).toMatch(/made up/);
  });
});

describe('where does it run', () => {
  test('every job has a place and both frontend and backend answers exist', () => {
    expect(JOB_IDS).toHaveLength(10);
    expect(new Set(Object.values(JOB_PLACE))).toEqual(new Set(['frontend', 'backend', 'both']));
    for (const id of JOB_IDS) expect(s.where.jobs[id].reason.length).toBeGreaterThan(10);
  });

  test('security rules: secrets, hashing, databases and permissions are backend', () => {
    for (const id of ['hash-password', 'db-query', 'api-secret', 'permissions', 'recheck-input'] as const) expect(JOB_PLACE[id]).toBe('backend');
    expect(JOB_PLACE['live-check']).toBe('both');
    expect(JOB_PLACE.layout).toBe('frontend');
  });

  test('the quiz counts the first answer only and finishes after the last job', () => {
    let state = START;
    state = nextJob(state);
    expect(state.index).toBe(0);
    for (let i = 0; i < JOB_IDS.length; i += 1) {
      const right = JOB_PLACE[JOB_IDS[i]];
      state = answerJob(state, right);
      state = answerJob(state, right === 'frontend' ? 'backend' : 'frontend');
      expect(state.picked).toBe(right);
      state = nextJob(state);
    }
    expect(state.finished).toBe(true);
    expect(state.right).toBe(10);
    expect(answerJob(state, 'both')).toBe(state);
  });

  test('a wrong answer does not score', () => {
    const state = answerJob(START, 'backend');
    expect(state.right).toBe(0);
    expect(gradeAnswer('tap-button', 'frontend')).toBe(true);
    expect(nodesFor('both')).toEqual(['frontend', 'backend']);
    expect(nodesFor('backend')).toEqual(['backend']);
  });
});

describe('JOINs', () => {
  test('one-to-many INNER: users without orders are dropped, the rest repeat per order', () => {
    const steps = buildJoinSteps(PLANS['one-to-many'], 'inner');
    expect(steps).toHaveLength(4);
    const final = steps[steps.length - 1];
    expect(final.result).toEqual([
      ['Maya', 101, 'Mar 1'],
      ['Maya', 102, 'Mar 4'],
      ['Ben', 103, 'Mar 5'],
    ]);
    expect(steps[1]).toMatchObject({ kind: 'matched', added: 2, rowIndex: 0 });
    expect(steps[1].active.orders).toEqual([0, 1]);
    expect(steps[3]).toMatchObject({ kind: 'unmatched', added: 0 });
  });

  test('one-to-many LEFT keeps users with no orders, with NULLs', () => {
    const final = buildJoinSteps(PLANS['one-to-many'], 'left').at(-1);
    expect(final?.result).toHaveLength(4);
    expect(final?.result[3]).toEqual(['Ana', null, null]);
  });

  test('many-to-many goes through the third table', () => {
    const inner = buildJoinSteps(PLANS['many-to-many'], 'inner').at(-1);
    expect(inner?.result).toEqual([
      ['Notebook', 101, 2],
      ['Notebook', 103, 1],
      ['Pen', 101, 3],
      ['Bag', 102, 1],
    ]);
    const left = buildJoinSteps(PLANS['many-to-many'], 'left').at(-1);
    expect(left?.result).toContainEqual(['Stapler', null, null]);
    expect(left?.result).toHaveLength(5);
  });

  test('result row counts match what a nested loop gives', () => {
    for (const relation of ['one-to-many', 'many-to-many'] as const) {
      const plan = PLANS[relation];
      const inner = buildJoinSteps(plan, 'inner').at(-1)?.result.length ?? 0;
      const left = buildJoinSteps(plan, 'left').at(-1)?.result.length ?? 0;
      expect(left).toBeGreaterThanOrEqual(inner);
      expect(left).toBeGreaterThanOrEqual(DB[plan.tables[0]].rows.length);
    }
  });

  test('the SQL matches the plan', () => {
    expect(sqlFor(PLANS['one-to-many'], 'left')).toEqual(['SELECT users.name, orders.id, orders.placed', 'FROM users', 'LEFT JOIN orders ON orders.user_id = users.id']);
    expect(sqlFor(PLANS['many-to-many'], 'inner')).toHaveLength(4);
  });

  test('foreign keys really point at existing primary keys', () => {
    const userIds = DB.users.rows.map((row) => row.id);
    for (const order of DB.orders.rows) expect(userIds).toContain(order.user_id);
    const orderIds = DB.orders.rows.map((row) => row.id);
    const productIds = DB.products.rows.map((row) => row.id);
    for (const item of DB.order_items.rows) {
      expect(orderIds).toContain(item.order_id);
      expect(productIds).toContain(item.product_id);
    }
  });
});

describe('join captions', () => {
  test('say what each step really did', () => {
    const plan = PLANS['one-to-many'];
    const inner = buildJoinSteps(plan, 'inner');
    expect(describeJoinStep(inner[0], plan, 'inner', s.db.step)).toBe(s.db.step.start);
    expect(describeJoinStep(inner[1], plan, 'inner', s.db.step)).toBe('Row id 1 of users matches 2 rows in orders, so 2 result rows are made.');
    expect(describeJoinStep(inner[3], plan, 'inner', s.db.step)).toBe('Row id 3 of users has no match in orders. An INNER JOIN drops it.');
    const left = buildJoinSteps(plan, 'left');
    expect(describeJoinStep(left[3], plan, 'left', s.db.step)).toContain('LEFT JOIN keeps it, with NULL');
  });
});
