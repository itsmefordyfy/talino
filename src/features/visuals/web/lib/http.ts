/**
 * A tiny in-memory REST API: one collection of records, handled by pure functions. The HTTP explorer and
 * the CRUD visual both run on it, so what they show (status codes, headers, what changed) is computed,
 * not scripted. Simplified: no authentication, no real network, ids count up.
 */

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export type HttpMethod = (typeof METHODS)[number];

export type FieldType = 'string' | 'boolean';
export type RecordValue = string | boolean;
export type ApiRecord = { id: number } & Record<string, RecordValue | number>;

export type ResourceSpec = {
  /** Path segment, e.g. `users` for `/users` and `/users/5`. */
  name: string;
  fields: Readonly<Record<string, FieldType>>;
  /** Fields a POST or PUT must carry. */
  required: readonly string[];
};

export type Store = { spec: ResourceSpec; items: readonly ApiRecord[]; nextId: number };

export type ApiRequest = { method: HttpMethod; path: string; body?: Readonly<Record<string, RecordValue>> | null };

export type ChangeKind = 'none' | 'created' | 'replaced' | 'updated' | 'deleted';

export type ApiResponse = {
  status: number;
  statusText: string;
  headers: readonly string[];
  /** JSON text, or null when there is no body (204). */
  body: string | null;
};

export type ApiResult = {
  response: ApiResponse;
  store: Store;
  change: ChangeKind;
  /** The record that was created, changed or removed (or read). */
  affectedId: number | null;
};

export const STATUS_TEXT: Readonly<Record<number, string>> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  404: 'Not Found',
  405: 'Method Not Allowed',
};

export function createStore(spec: ResourceSpec, items: readonly ApiRecord[]): Store {
  return { spec, items, nextId: items.reduce((max, item) => Math.max(max, item.id), 0) + 1 };
}

export const USERS_SPEC: ResourceSpec = { name: 'users', fields: { name: 'string' }, required: ['name'] };
export const TASKS_SPEC: ResourceSpec = { name: 'tasks', fields: { title: 'string', done: 'boolean' }, required: ['title'] };

export const SAMPLE_USERS: readonly ApiRecord[] = [
  { id: 1, name: 'Maya' },
  { id: 2, name: 'Ben' },
  { id: 3, name: 'Ana' },
];

export const SAMPLE_TASKS: readonly ApiRecord[] = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Call Sam', done: true },
];

function json(value: unknown): string {
  return JSON.stringify(value);
}

function reply(status: number, body: unknown | null, extraHeaders: readonly string[] = []): ApiResponse {
  return {
    status,
    statusText: STATUS_TEXT[status] ?? 'Unknown',
    headers: body === null ? [...extraHeaders] : ['Content-Type: application/json', ...extraHeaders],
    body: body === null ? null : json(body),
  };
}

const unchanged = (store: Store, response: ApiResponse): ApiResult => ({ response, store, change: 'none', affectedId: null });

/** Checks a body against the resource: only known fields of the right type are kept. Returns an error text or the clean values. */
function cleanBody(spec: ResourceSpec, body: ApiRequest['body'], mustHave: readonly string[]): { error: string } | { values: Record<string, RecordValue> } {
  const values: Record<string, RecordValue> = {};
  const given = body ?? {};
  for (const [field, type] of Object.entries(spec.fields)) {
    if (!Object.prototype.hasOwnProperty.call(given, field)) continue;
    const value = given[field];
    if (typeof value !== type) return { error: `${field} must be a ${type}` };
    if (type === 'string' && (value as string).trim().length === 0) return { error: `${field} must not be empty` };
    values[field] = type === 'string' ? (value as string).trim() : value;
  }
  for (const field of mustHave) if (!(field in values)) return { error: `${field} is required` };
  return { values };
}

/** Parses `/users` or `/users/5`: the resource name and the id (null for the collection, NaN for a malformed id). */
function parsePath(path: string): { resource: string; id: number | null } | null {
  const match = /^\/([a-z]+)(?:\/([^/]+))?$/.exec(path);
  if (!match) return null;
  if (match[2] === undefined) return { resource: match[1], id: null };
  return { resource: match[1], id: /^\d+$/.test(match[2]) ? Number(match[2]) : Number.NaN };
}

/**
 * Runs one request against the store and returns the response and the store after it. Status codes follow
 * common REST practice: 200 for reads and updates, 201 + Location for a create, 204 with no body for a
 * delete, 400 for a body the server cannot accept, 404 when there is no such record or resource, and
 * 405 (with an Allow header) when the method does not fit the path.
 */
export function handleRequest(store: Store, request: ApiRequest): ApiResult {
  const route = parsePath(request.path);
  const { spec } = store;
  if (route === null || route.resource !== spec.name || (route.id !== null && Number.isNaN(route.id))) {
    return unchanged(store, reply(404, { error: `No resource at ${request.path}` }));
  }
  const collection = route.id === null;
  const found = collection ? undefined : store.items.find((item) => item.id === route.id);
  const allow = collection ? 'GET, POST' : 'GET, PUT, PATCH, DELETE';
  const notAllowed = (): ApiResult => unchanged(store, reply(405, { error: `${request.method} is not allowed on ${request.path}` }, [`Allow: ${allow}`]));

  switch (request.method) {
    case 'GET': {
      if (collection) return { response: reply(200, store.items), store, change: 'none', affectedId: null };
      if (!found) return unchanged(store, reply(404, { error: `${spec.name.replace(/s$/, '')} ${route.id} not found` }));
      return { response: reply(200, found), store, change: 'none', affectedId: found.id };
    }
    case 'POST': {
      if (!collection) return notAllowed();
      const clean = cleanBody(spec, request.body, spec.required);
      if ('error' in clean) return unchanged(store, reply(400, { error: clean.error }));
      const created: ApiRecord = { id: store.nextId, ...defaults(spec), ...clean.values };
      const next: Store = { ...store, items: [...store.items, created], nextId: store.nextId + 1 };
      return { response: reply(201, created, [`Location: /${spec.name}/${created.id}`]), store: next, change: 'created', affectedId: created.id };
    }
    case 'PUT':
    case 'PATCH': {
      if (collection) return notAllowed();
      if (!found) return unchanged(store, reply(404, { error: `${spec.name.replace(/s$/, '')} ${route.id} not found` }));
      const replace = request.method === 'PUT';
      const clean = cleanBody(spec, request.body, replace ? spec.required : []);
      if ('error' in clean) return unchanged(store, reply(400, { error: clean.error }));
      if (!replace && Object.keys(clean.values).length === 0) return unchanged(store, reply(400, { error: 'Send at least one field to change' }));
      // PUT swaps the whole record (fields it leaves out go back to their defaults); PATCH changes only what is sent.
      const updated: ApiRecord = replace ? { id: found.id, ...defaults(spec), ...clean.values } : { ...found, ...clean.values };
      const next: Store = { ...store, items: store.items.map((item) => (item.id === found.id ? updated : item)) };
      return { response: reply(200, updated), store: next, change: replace ? 'replaced' : 'updated', affectedId: found.id };
    }
    case 'DELETE': {
      if (collection) return notAllowed();
      if (!found) return unchanged(store, reply(404, { error: `${spec.name.replace(/s$/, '')} ${route.id} not found` }));
      const next: Store = { ...store, items: store.items.filter((item) => item.id !== found.id) };
      return { response: reply(204, null), store: next, change: 'deleted', affectedId: found.id };
    }
  }
}

function defaults(spec: ResourceSpec): Record<string, RecordValue> {
  const out: Record<string, RecordValue> = {};
  for (const [field, type] of Object.entries(spec.fields)) if (type === 'boolean') out[field] = false;
  return out;
}

/** The request as it travels, for display: the request line, a few headers and the JSON body. */
export function requestLines(request: ApiRequest): string[] {
  const lines = [`${request.method} ${request.path} HTTP/1.1`, 'Host: api.example.com', 'Accept: application/json'];
  if (request.body && Object.keys(request.body).length > 0) lines.push('Content-Type: application/json', '', json(request.body));
  else if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') lines.push('Content-Type: application/json', '', '{}');
  return lines;
}

export function responseLines(response: ApiResponse): string[] {
  const lines = [`HTTP/1.1 ${response.status} ${response.statusText}`, ...response.headers];
  if (response.body !== null) lines.push('', response.body);
  return lines;
}

export type StatusClass = '2xx' | '4xx' | '5xx' | 'other';

export function statusClass(status: number): StatusClass {
  if (status >= 200 && status < 300) return '2xx';
  if (status >= 400 && status < 500) return '4xx';
  if (status >= 500 && status < 600) return '5xx';
  return 'other';
}
