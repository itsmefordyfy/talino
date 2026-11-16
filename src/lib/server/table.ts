/**
 * Server-only: a few rows in Supabase through its REST API (PostgREST), with the server's secret key.
 * Talino's tables (`talino_*`, supabase/migrations/20261113000000_talino.sql) allow no public access:
 * only these routes read and write them. Without SUPABASE_URL + SUPABASE_SECRET_KEY, development and
 * tests keep rows in this instance's memory with the same calls; production answers `unavailable`
 * (the route then says so) rather than pretending a certificate or a portfolio was saved.
 */

type Row = Record<string, unknown>;
export type Filter = Record<string, string | number | boolean>;

export class TableUnavailableError extends Error {
  constructor(reason: string) {
    super(`Talino storage unavailable: ${reason}`);
    this.name = 'TableUnavailableError';
  }
}

const configured = () => Boolean(process.env.SUPABASE_SECRET_KEY && (process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL));
// On globalThis: the dev server bundles each API route on its own, and a page must see rows another route wrote.
const memoryHolder = globalThis as typeof globalThis & { __talinoTables?: Map<string, Row[]> };
const memory = (memoryHolder.__talinoTables ??= new Map<string, Row[]>());

function inMemory(): boolean {
  if (configured()) return false;
  if (process.env.NODE_ENV === 'production') throw new TableUnavailableError('not_configured');
  return true;
}

const matches = (row: Row, filter: Filter) => Object.entries(filter).every(([key, value]) => row[key] === value);

async function rest(path: string, init: { method: string; body?: unknown; prefer?: string }): Promise<Row[]> {
  const base = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  let response: Response;
  try {
    response = await fetch(`${base}/rest/v1/${path}`, {
      method: init.method,
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY ?? '',
        authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY ?? ''}`,
        'content-type': 'application/json',
        ...(init.prefer ? { prefer: init.prefer } : {}),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(6000),
    });
  } catch {
    throw new TableUnavailableError('unreachable');
  }
  if (!response.ok) {
    console.error(JSON.stringify({ event: 'table_failed', path: path.split('?')[0], status: response.status }));
    throw new TableUnavailableError(`status_${response.status}`);
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as Row[]) : [];
}

const query = (filter: Filter) =>
  Object.entries(filter)
    .map(([key, value]) => `${encodeURIComponent(key)}=eq.${encodeURIComponent(String(value))}`)
    .join('&');

export function table(name: string) {
  return {
    async select(filter: Filter, options: { limit?: number; order?: string } = {}): Promise<Row[]> {
      if (inMemory()) return (memory.get(name) ?? []).filter((row) => matches(row, filter)).slice(0, options.limit ?? 1000);
      const order = options.order ? `&order=${encodeURIComponent(options.order)}` : '';
      return rest(`${name}?select=*&${query(filter)}${order}&limit=${options.limit ?? 1000}`, { method: 'GET' });
    },
    async insert(row: Row): Promise<Row> {
      if (inMemory()) {
        const rows = memory.get(name) ?? [];
        rows.push({ ...row });
        memory.set(name, rows);
        return row;
      }
      const [saved] = await rest(name, { method: 'POST', body: row, prefer: 'return=representation' });
      return saved ?? row;
    },
    async update(filter: Filter, changes: Row): Promise<number> {
      if (inMemory()) {
        let count = 0;
        for (const row of memory.get(name) ?? []) {
          if (matches(row, filter)) {
            Object.assign(row, changes);
            count += 1;
          }
        }
        return count;
      }
      return (await rest(`${name}?${query(filter)}`, { method: 'PATCH', body: changes, prefer: 'return=representation' })).length;
    },
    async remove(filter: Filter): Promise<number> {
      if (inMemory()) {
        const rows = memory.get(name) ?? [];
        const kept = rows.filter((row) => !matches(row, filter));
        memory.set(name, kept);
        return rows.length - kept.length;
      }
      return (await rest(`${name}?${query(filter)}`, { method: 'DELETE', prefer: 'return=representation' })).length;
    },
  };
}

/** Tests only. */
export function resetTableMemory(): void {
  memory.clear();
}

/** A random id of `length` characters from an alphabet without look-alikes (no 0/O, 1/l/I). */
export function randomId(length = 10): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join('');
}

/** SHA-256 of a secret as hex, so edit tokens and keys are never stored as given. */
export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** HTML-escapes text for the public pages. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
