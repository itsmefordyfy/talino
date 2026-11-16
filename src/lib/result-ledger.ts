export type LedgerStorage = { read(): string | null; write(value: string): void };

const DEFAULT_CAPACITY = 50;

/**
 * Remembers the answer to each request by its id. A request can arrive twice (the Watch times out and retries while the
 * phone had already saved it), and the second must get the first answer, not a second diaper or bottle. Oldest entries
 * go first once `capacity` is reached. (Copied from Bubblie, 2026-11-16.)
 */
export function createResultLedger<T>(storage: LedgerStorage, capacity = DEFAULT_CAPACITY) {
  const load = (): [string, T][] => {
    try {
      const parsed: unknown = JSON.parse(storage.read() ?? '[]');
      return Array.isArray(parsed) ? (parsed as [string, T][]) : [];
    } catch {
      return [];
    }
  };

  return {
    find(id: string): T | undefined {
      return load().find(([known]) => known === id)?.[1];
    },
    /** Every id it remembers, oldest first: what the phone tells the Watch it has already handled. */
    ids(): string[] {
      return load().map(([known]) => known);
    },
    remember(id: string, result: T): void {
      const entries = load();
      if (entries.some(([known]) => known === id)) return;
      storage.write(JSON.stringify([...entries, [id, result]].slice(-capacity)));
    },
  };
}

export type ResultLedger<T> = ReturnType<typeof createResultLedger<T>>;
