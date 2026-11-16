export type RunLimits = {
  /** Statements, loop turns and calls the program may use before it is stopped (default 300_000). */
  maxSteps?: number;
  /** Characters of console output kept (default 20_000). */
  maxOutputChars?: number;
  /** Nested function calls allowed (default 200). */
  maxCallDepth?: number;
};

/** `line` and `column` are 1-based, or null when unknown. */
export type RunError = { name: string; message: string; line: number | null; column: number | null };

export type RunResult = {
  ok: boolean;
  /** One entry per console.log call, formatted like Node. */
  output: string[];
  error: RunError | null;
  steps: number;
  /** JSON-safe value of the last expression statement (undefined when there is none). */
  returned: unknown;
};

export type TestCase = { label?: string; args?: unknown[]; expected: unknown; hidden?: boolean };

export type CodeTests = { kind: 'function'; fn: string; cases: TestCase[] } | { kind: 'output'; expected: string[] };

export type TestReport = {
  passed: number;
  total: number;
  /** 0..1, for partial credit. */
  fraction: number;
  results: { label: string; pass: boolean; expected: unknown; actual: unknown; error: string | null; hidden: boolean }[];
  error: RunError | null;
  output: string[];
};

export type SqlRunResult = { ok: boolean; columns: string[]; rows: unknown[][]; error: string | null; truncated: boolean };

export type SqlExpectation = { columns?: string[]; rows: unknown[][]; ordered: boolean };
