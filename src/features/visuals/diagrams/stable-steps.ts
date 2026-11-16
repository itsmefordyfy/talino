const cache = new WeakMap<object, Map<string, readonly unknown[]>>();

/**
 * Step lists are computed by pure builders; the stepper restarts whenever it is handed a new list, so a
 * list must keep its identity while its inputs are the same. This returns the same array for the same
 * `owner` (the strings table) and `key` (the scenario), building it once.
 */
export function stableSteps<T>(owner: object, key: string, build: () => readonly T[]): readonly T[] {
  let perOwner = cache.get(owner);
  if (!perOwner) {
    perOwner = new Map();
    cache.set(owner, perOwner);
  }
  const found = perOwner.get(key);
  if (found) return found as readonly T[];
  const made = build();
  perOwner.set(key, made);
  return made;
}

const values = new WeakMap<object, Map<string, object>>();

/** The same idea for a single object (a diagram spec): built once per `owner` and `key`, so it keeps its identity between renders. */
export function stableValue<T extends object>(owner: object, key: string, build: () => T): T {
  let perOwner = values.get(owner);
  if (!perOwner) {
    perOwner = new Map();
    values.set(owner, perOwner);
  }
  const found = perOwner.get(key);
  if (found) return found as T;
  const made = build();
  perOwner.set(key, made);
  return made;
}
