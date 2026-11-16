/**
 * When an automatic backup runs. Edits come in bursts (a lesson saves progress, a streak, a badge), so a
 * backup waits for things to settle: `settleMs` after the last change, but never longer than `maxWaitMs`
 * after the first change of a burst (a learner who keeps working still gets backed up). Pure apart from
 * the timers, which are handed in so tests can run it without waiting.
 */
export const SETTLE_MS = 15_000;
export const MAX_WAIT_MS = 60_000;

/** Milliseconds from `now` until the next run for a burst that began at `firstChange` and last changed at `lastChange`. */
export function nextRunDelay(input: { now: number; firstChange: number; lastChange: number; settleMs?: number; maxWaitMs?: number }): number {
  const settleAt = input.lastChange + (input.settleMs ?? SETTLE_MS);
  const deadline = input.firstChange + (input.maxWaitMs ?? MAX_WAIT_MS);
  return Math.max(0, Math.min(settleAt, deadline) - input.now);
}

export type Timers = {
  now(): number;
  setTimeout(callback: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
};

const realTimers: Timers = { now: () => Date.now(), setTimeout: (callback, ms) => setTimeout(callback, ms), clearTimeout: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>) };

export type BackupScheduler = {
  /** Something changed: a backup will follow once it settles. */
  markChanged(): void;
  /** Run now if anything is waiting (the app is going to the background). */
  flush(): void;
  dispose(): void;
  readonly running: boolean;
  readonly waiting: boolean;
};

export type SchedulerOptions = { run: () => Promise<void>; settleMs?: number; maxWaitMs?: number; timers?: Timers };

/** One run at a time; a change during a run schedules another once it ends. */
export function createBackupScheduler({ run, settleMs = SETTLE_MS, maxWaitMs = MAX_WAIT_MS, timers = realTimers }: SchedulerOptions): BackupScheduler {
  let handle: unknown = null;
  let firstChange: number | null = null;
  let lastChange = 0;
  let running = false;
  let disposed = false;

  const clear = () => {
    if (handle !== null) timers.clearTimeout(handle);
    handle = null;
  };

  const schedule = () => {
    clear();
    if (disposed || running || firstChange === null) return;
    handle = timers.setTimeout(() => {
      handle = null;
      void execute();
    }, nextRunDelay({ now: timers.now(), firstChange, lastChange, settleMs, maxWaitMs }));
  };

  const execute = async () => {
    if (disposed || running || firstChange === null) return;
    running = true;
    // Whatever changes from here on belongs to the next run.
    firstChange = null;
    try {
      await run();
    } catch {
      // The run records its own failure; a later change or launch tries again.
    } finally {
      running = false;
      if (!disposed && firstChange !== null) schedule();
    }
  };

  return {
    markChanged() {
      const now = timers.now();
      firstChange ??= now;
      lastChange = now;
      schedule();
    },
    flush() {
      if (firstChange === null || running) return;
      clear();
      void execute();
    },
    dispose() {
      disposed = true;
      clear();
    },
    get running() {
      return running;
    },
    get waiting() {
      return firstChange !== null;
    },
  };
}
