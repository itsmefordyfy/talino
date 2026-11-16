import { describe, expect, test } from '@jest/globals';

import { createStore, handleRequest, requestLines, responseLines, statusClass, SAMPLE_TASKS, SAMPLE_USERS, TASKS_SPEC, USERS_SPEC, type ApiRequest } from './http';

const users = () => createStore(USERS_SPEC, SAMPLE_USERS);
const tasks = () => createStore(TASKS_SPEC, SAMPLE_TASKS);
const send = (store = users(), request: ApiRequest) => handleRequest(store, request);

describe('GET', () => {
  test('the collection and one record', () => {
    const list = send(undefined, { method: 'GET', path: '/users' });
    expect(list.response.status).toBe(200);
    expect(JSON.parse(list.response.body ?? '[]')).toHaveLength(3);
    expect(list.change).toBe('none');
    const one = send(undefined, { method: 'GET', path: '/users/2' });
    expect(JSON.parse(one.response.body ?? '{}')).toEqual({ id: 2, name: 'Ben' });
    expect(one.affectedId).toBe(2);
  });

  test('a missing record is a 404 and changes nothing', () => {
    const store = users();
    const result = send(store, { method: 'GET', path: '/users/99' });
    expect(result.response.status).toBe(404);
    expect(result.store).toBe(store);
  });

  test('unknown resources, malformed ids and paths are 404', () => {
    for (const path of ['/orders', '/users/abc', '/users/1/extra', 'users', '/users/-1', '/']) {
      expect(send(undefined, { method: 'GET', path }).response.status).toBe(404);
    }
  });
});

describe('POST', () => {
  test('creates a record with the next id, 201 and a Location header', () => {
    const result = send(undefined, { method: 'POST', path: '/users', body: { name: ' Zoe ' } });
    expect(result.response.status).toBe(201);
    expect(result.response.headers).toContain('Location: /users/4');
    expect(result.store.items).toHaveLength(4);
    expect(result.store.items[3]).toEqual({ id: 4, name: 'Zoe' });
    expect(result.change).toBe('created');
  });

  test('ids are never reused after a delete', () => {
    let store = users();
    store = send(store, { method: 'DELETE', path: '/users/3' }).store;
    const created = send(store, { method: 'POST', path: '/users', body: { name: 'New' } });
    expect(created.store.items.at(-1)?.id).toBe(4);
  });

  test('an invalid body is a 400 and nothing is saved', () => {
    const bodies: ApiRequest['body'][] = [undefined, null, {}, { name: '' }, { name: '   ' }, { name: true }];
    for (const body of bodies) {
      const result = send(undefined, { method: 'POST', path: '/users', body });
      expect(result.response.status).toBe(400);
      expect(result.store.items).toHaveLength(3);
    }
  });

  test('POST to one record is 405 with an Allow header', () => {
    const result = send(undefined, { method: 'POST', path: '/users/1', body: { name: 'X' } });
    expect(result.response.status).toBe(405);
    expect(result.response.headers).toContain('Allow: GET, PUT, PATCH, DELETE');
  });
});

describe('PUT and PATCH', () => {
  test('PUT replaces the whole record, resetting fields it leaves out', () => {
    const result = send(tasks(), { method: 'PUT', path: '/tasks/2', body: { title: 'Call Sam today' } });
    expect(result.response.status).toBe(200);
    expect(result.store.items[1]).toEqual({ id: 2, title: 'Call Sam today', done: false });
    expect(result.change).toBe('replaced');
  });

  test('PATCH changes only the fields sent', () => {
    const result = send(tasks(), { method: 'PATCH', path: '/tasks/1', body: { done: true } });
    expect(result.store.items[0]).toEqual({ id: 1, title: 'Buy milk', done: true });
    expect(result.change).toBe('updated');
  });

  test('bad bodies and wrong types are 400, missing records 404, the collection 405', () => {
    expect(send(tasks(), { method: 'PUT', path: '/tasks/1', body: { done: true } }).response.status).toBe(400);
    expect(send(tasks(), { method: 'PATCH', path: '/tasks/1', body: {} }).response.status).toBe(400);
    expect(send(tasks(), { method: 'PATCH', path: '/tasks/1', body: { done: 'yes' } }).response.status).toBe(400);
    expect(send(tasks(), { method: 'PATCH', path: '/tasks/9', body: { done: true } }).response.status).toBe(404);
    expect(send(tasks(), { method: 'PUT', path: '/tasks', body: { title: 'x' } }).response.status).toBe(405);
  });

  test('unknown fields are ignored, never stored', () => {
    const result = send(users(), { method: 'PATCH', path: '/users/1', body: { name: 'Maya P', admin: true } as never });
    expect(result.store.items[0]).toEqual({ id: 1, name: 'Maya P' });
  });
});

describe('DELETE', () => {
  test('204 with no body removes the record', () => {
    const result = send(undefined, { method: 'DELETE', path: '/users/2' });
    expect(result.response.status).toBe(204);
    expect(result.response.body).toBeNull();
    expect(result.store.items.map((item) => item.id)).toEqual([1, 3]);
    expect(result.change).toBe('deleted');
  });

  test('deleting twice: the second is a 404', () => {
    const first = send(undefined, { method: 'DELETE', path: '/users/2' });
    expect(send(first.store, { method: 'DELETE', path: '/users/2' }).response.status).toBe(404);
  });

  test('DELETE on the collection is 405', () => {
    expect(send(undefined, { method: 'DELETE', path: '/users' }).response.status).toBe(405);
  });
});

describe('display helpers', () => {
  test('request and response lines', () => {
    expect(requestLines({ method: 'GET', path: '/users/1' })[0]).toBe('GET /users/1 HTTP/1.1');
    expect(requestLines({ method: 'POST', path: '/users', body: { name: 'Zoe' } })).toContain('{"name":"Zoe"}');
    expect(requestLines({ method: 'POST', path: '/users', body: null })).toContain('{}');
    const result = send(undefined, { method: 'GET', path: '/users/1' });
    expect(responseLines(result.response)[0]).toBe('HTTP/1.1 200 OK');
    expect(responseLines(send(undefined, { method: 'DELETE', path: '/users/1' }).response)).toEqual(['HTTP/1.1 204 No Content']);
  });

  test('statusClass', () => {
    expect([200, 201, 404, 405, 500, 302].map(statusClass)).toEqual(['2xx', '2xx', '4xx', '4xx', '5xx', 'other']);
  });

  test('the store is never mutated', () => {
    const store = users();
    const snapshot = JSON.stringify(store);
    send(store, { method: 'POST', path: '/users', body: { name: 'Q' } });
    send(store, { method: 'DELETE', path: '/users/1' });
    send(store, { method: 'PATCH', path: '/users/1', body: { name: 'Q' } });
    expect(JSON.stringify(store)).toBe(snapshot);
  });
});
