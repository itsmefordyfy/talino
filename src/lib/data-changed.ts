/**
 * Says the owner's data changed (a database write, a saved setting), so a cloud backup, when it
 * exists, knows to run. Kept in lib, below the database and the store that call it.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

export function notifyDataChanged(): void {
  for (const listener of listeners) listener();
}

export function onDataChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
