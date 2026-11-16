export type Cell = string | number | null;
export type Row = Readonly<Record<string, Cell>>;
export type TableName = 'users' | 'orders' | 'products' | 'order_items';
export type Column = { name: string; key?: 'PK' | 'FK' };
export type Table = { name: TableName; columns: readonly Column[]; rows: readonly Row[] };

export const DB: Readonly<Record<TableName, Table>> = {
  users: {
    name: 'users',
    columns: [{ name: 'id', key: 'PK' }, { name: 'name' }],
    rows: [
      { id: 1, name: 'Maya' },
      { id: 2, name: 'Ben' },
      { id: 3, name: 'Ana' },
    ],
  },
  orders: {
    name: 'orders',
    columns: [{ name: 'id', key: 'PK' }, { name: 'user_id', key: 'FK' }, { name: 'placed' }],
    rows: [
      { id: 101, user_id: 1, placed: 'Mar 1' },
      { id: 102, user_id: 1, placed: 'Mar 4' },
      { id: 103, user_id: 2, placed: 'Mar 5' },
    ],
  },
  products: {
    name: 'products',
    columns: [{ name: 'id', key: 'PK' }, { name: 'name' }, { name: 'price' }],
    rows: [
      { id: 1, name: 'Notebook', price: 4 },
      { id: 2, name: 'Pen', price: 1 },
      { id: 3, name: 'Bag', price: 20 },
      { id: 4, name: 'Stapler', price: 6 },
    ],
  },
  order_items: {
    name: 'order_items',
    columns: [{ name: 'order_id', key: 'FK' }, { name: 'product_id', key: 'FK' }, { name: 'qty' }],
    rows: [
      { order_id: 101, product_id: 1, qty: 2 },
      { order_id: 101, product_id: 2, qty: 3 },
      { order_id: 102, product_id: 3, qty: 1 },
      { order_id: 103, product_id: 1, qty: 1 },
    ],
  },
};

export type Relation = 'one-to-many' | 'many-to-many';
export type JoinType = 'inner' | 'left';

type JoinOn = { table: TableName; column: string; withTable: TableName; withColumn: string };

export type JoinPlan = {
  /** The table whose rows are walked one by one, then the tables joined onto it in order. */
  tables: readonly TableName[];
  joins: readonly JoinOn[];
  select: readonly string[];
};

export const PLANS: Readonly<Record<Relation, JoinPlan>> = {
  'one-to-many': {
    tables: ['users', 'orders'],
    joins: [{ table: 'orders', column: 'user_id', withTable: 'users', withColumn: 'id' }],
    select: ['users.name', 'orders.id', 'orders.placed'],
  },
  'many-to-many': {
    tables: ['products', 'order_items', 'orders'],
    joins: [
      { table: 'order_items', column: 'product_id', withTable: 'products', withColumn: 'id' },
      { table: 'orders', column: 'id', withTable: 'order_items', withColumn: 'order_id' },
    ],
    select: ['products.name', 'orders.id', 'order_items.qty'],
  },
};

/** The SQL the plan stands for, one clause per line. */
export function sqlFor(plan: JoinPlan, type: JoinType): string[] {
  const keyword = type === 'inner' ? 'INNER JOIN' : 'LEFT JOIN';
  return [
    `SELECT ${plan.select.join(', ')}`,
    `FROM ${plan.tables[0]}`,
    ...plan.joins.map((join) => `${keyword} ${join.table} ON ${join.table}.${join.column} = ${join.withTable}.${join.withColumn}`),
  ];
}

export type JoinStep = {
  kind: 'start' | 'matched' | 'unmatched';
  /** Index of the first-table row being joined (null at the start). */
  rowIndex: number | null;
  /** Rows (by index) to highlight in each table. */
  active: Readonly<Partial<Record<TableName, readonly number[]>>>;
  /** The result so far, as selected columns. */
  result: readonly (readonly Cell[])[];
  /** Result rows this step added. */
  added: number;
};

type Working = { values: Record<string, Cell>; used: Partial<Record<TableName, number>> };

function prefixed(table: Table, row: Row | null): Record<string, Cell> {
  const out: Record<string, Cell> = {};
  for (const column of table.columns) out[`${table.name}.${column.name}`] = row ? (row[column.name] ?? null) : null;
  return out;
}

/**
 * Joins the plan's tables for real, one row of the first table at a time. Each step shows the rows that
 * matched through the key columns and the result so far. A row with no match is dropped by an INNER JOIN
 * and kept, with NULLs, by a LEFT JOIN.
 */
export function buildJoinSteps(plan: JoinPlan, type: JoinType, db: Readonly<Record<TableName, Table>> = DB): JoinStep[] {
  const first = db[plan.tables[0]];
  const steps: JoinStep[] = [{ kind: 'start', rowIndex: null, active: {}, result: [], added: 0 }];
  const result: Cell[][] = [];
  first.rows.forEach((row, rowIndex) => {
    let working: Working[] = [{ values: prefixed(first, row), used: { [first.name]: rowIndex } }];
    for (const join of plan.joins) {
      const right = db[join.table];
      const next: Working[] = [];
      for (const current of working) {
        const wanted = current.values[`${join.withTable}.${join.withColumn}`];
        const matches = right.rows.flatMap((candidate, index) => (wanted !== null && candidate[join.column] === wanted ? [{ candidate, index }] : []));
        if (matches.length > 0) {
          for (const { candidate, index } of matches) next.push({ values: { ...current.values, ...prefixed(right, candidate) }, used: { ...current.used, [right.name]: index } });
        } else if (type === 'left') {
          next.push({ values: { ...current.values, ...prefixed(right, null) }, used: current.used });
        }
      }
      working = next;
    }
    const last = plan.tables[plan.tables.length - 1];
    const matchedRows = working.filter((item) => item.used[last] !== undefined);
    const active: Partial<Record<TableName, number[]>> = {};
    for (const item of working) {
      for (const [table, index] of Object.entries(item.used) as [TableName, number][]) {
        const list = (active[table] ??= []);
        if (!list.includes(index)) list.push(index);
      }
    }
    active[first.name] = [rowIndex];
    for (const item of working) result.push(plan.select.map((name) => item.values[name] ?? null));
    steps.push({ kind: matchedRows.length > 0 ? 'matched' : 'unmatched', rowIndex, active, result: result.map((line) => [...line]), added: working.length });
  });
  return steps;
}

type StepStrings = {
  start: string;
  matched: (table: string, key: string, count: number, other: string) => string;
  unmatchedInner: (table: string, key: string, other: string) => string;
  unmatchedLeft: (table: string, key: string, other: string) => string;
};

/** The sentence that explains a join step, from what the step actually did. */
export function describeJoinStep(step: JoinStep, plan: JoinPlan, type: JoinType, words: StepStrings, db: Readonly<Record<TableName, Table>> = DB): string {
  if (step.kind === 'start' || step.rowIndex === null) return words.start;
  const table = db[plan.tables[0]];
  const first = table.columns[0].name;
  const key = `${first} ${String(table.rows[step.rowIndex][first])}`;
  const other = plan.tables.slice(1).join(' and ');
  if (step.kind === 'matched') return words.matched(table.name, key, step.added, other);
  return type === 'inner' ? words.unmatchedInner(table.name, key, other) : words.unmatchedLeft(table.name, key, other);
}
