/**
 * Runs async jobs one after another, in the order they were added, even when one fails. Used where two quick taps would otherwise start
 * two database transactions on the one connection at the same time (the second then fails and its change is lost).
 */
export function createSerialQueue(): <T>(job: () => Promise<T>) => Promise<T> {
  let tail: Promise<unknown> = Promise.resolve();
  return (job) => {
    const run = tail.then(job, job);
    tail = run.catch(() => undefined);
    return run;
  };
}
