import { afterEach, describe, expect, jest, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { compareSql, createSqlSandbox, runnerStrings, validateSelect } from './index';
import { makeSandbox, type SqlDatabase, type SqlSandbox } from './sql';

const mockOpen = jest.fn<(name: string) => Promise<unknown>>();
jest.mock('expo-sqlite', () => ({ openDatabaseAsync: (name: string) => mockOpen(name) }));

const SETUP = `
CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL, grade INTEGER, city TEXT);
INSERT INTO students VALUES (1, 'Ada', 90, 'Manila'), (2, 'Ben', 75, 'Cebu'), (3, 'Cy', 82, 'Manila'), (4, 'Di', NULL, 'Davao');
CREATE TABLE tiny (n INTEGER);
INSERT INTO tiny VALUES (1);
`;

const opened: SqlSandbox[] = [];
async function sandbox(setup = SETUP, extra?: Partial<SqlDatabase>) {
  const db = await createTestDatabase();
  const driver: SqlDatabase = { execAsync: (sql) => db.execAsync(sql), getAllAsync: (sql) => db.getAllAsync(sql), closeAsync: async () => db.close(), ...extra };
  const box = await makeSandbox(driver, setup);
  opened.push(box);
  return box;
}
afterEach(async () => {
  while (opened.length) await opened.pop()!.close();
});

describe('validateSelect', () => {
  const ok = (q: string) => expect(validateSelect(q)).toEqual({ ok: true });
  const bad = (q: string, reason?: RegExp) => {
    const r = validateSelect(q);
    expect(r.ok).toBe(false);
    if (reason && !r.ok) expect(r.reason).toMatch(reason);
  };

  test('accepts ordinary reads', () => {
    ok('SELECT * FROM students');
    ok('select name from students where grade > 80 order by name;');
    ok('  SELECT 1  ; ');
    ok('SELECT name, COUNT(*) AS n FROM students GROUP BY city HAVING n > 1');
    ok('WITH top AS (SELECT * FROM students WHERE grade > 80) SELECT name FROM top');
    ok('SELECT REPLACE(name, "a", "b") FROM students');
    ok("SELECT 'a;b' AS semi, \"x;y\" FROM students");
    ok('SELECT a.name FROM students a JOIN students b ON a.id = b.id UNION SELECT 1, 2 LIMIT 5');
    ok('SELECT /* inline */ 1 -- trailing');
    ok("SELECT 'DROP TABLE students'");
    ok('SELECT updated_at, created_by, delete_flag FROM t');
    ok('SELECT "insert" FROM students');
  });
  test('rejects stacked statements, however they are hidden', () => {
    bad('SELECT 1; SELECT 2', /one statement/i);
    bad('SELECT 1; DROP TABLE students', /one statement/i);
    bad('SELECT 1;;', /one statement/i);
    bad('SELECT 1; -- comment\nSELECT 2', /one statement/i);
    bad('SELECT 1 /* ; */; DELETE FROM students', /one statement/i);
    bad('SELECT 1;\n\n  DELETE FROM students');
  });
  test('rejects anything that is not a SELECT', () => {
    for (const q of [
      'INSERT INTO students VALUES (9, "x", 1, "y")', 'UPDATE students SET grade = 0', 'DELETE FROM students', 'DROP TABLE students', 'ALTER TABLE students ADD COLUMN x',
      'CREATE TABLE t (a)', 'REPLACE INTO students VALUES (1, "x", 1, "y")', 'VACUUM', 'PRAGMA table_info(students)', "ATTACH DATABASE 'x.db' AS x", 'DETACH x',
      'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT a', 'EXPLAIN SELECT 1', 'REINDEX', 'ANALYZE', 'VALUES (1)', '(SELECT 1)', '5', 'SELEC 1',
    ]) bad(q);
  });
  test('rejects writes hidden behind WITH, comments and odd spacing', () => {
    bad('WITH x AS (SELECT 1) INSERT INTO students SELECT * FROM x');
    bad('WITH x AS (SELECT 1) DELETE FROM students');
    bad('WITH x AS (SELECT 1) UPDATE students SET grade = 1');
    bad('WITH x AS (SELECT 1) REPLACE INTO students SELECT 1');
    bad('SELECT 1 FROM students WHERE id IN (DELETE FROM students)');
    bad('/* hi */ DROP TABLE students');
    bad('-- c\nDROP TABLE students');
    bad('SELECT 1 /* unfinished');
    bad("SELECT 'unfinished");
    bad('SELECT "unfinished');
    bad('SELECT [unfinished');
    bad('select load_extension("x")', /LOAD_EXTENSION/);
    bad('SELECT LOAD_EXTENSION(\'/lib/evil\')');
    bad('SELECT zeroblob(1000000000)');
    bad('SELECT randomblob(1000000000)');
    bad('SELECT readfile("/etc/passwd")');
    bad('WITH RECURSIVE r(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM r) SELECT * FROM r', /recursive/i);
    bad('WITH');
  });
  test('rejects empty, huge and odd input', () => {
    bad('');
    bad('   ');
    bad(';');
    bad('-- only a comment');
    bad('/* nothing */');
    bad('SELECT ' + '1,'.repeat(3000) + '1');
    bad('SELECT 1\u0000; DROP TABLE x');
    expect(validateSelect(undefined as unknown as string).ok).toBe(false);
    expect(validateSelect(5 as unknown as string).ok).toBe(false);
  });
  test('a keyword inside a string or a quoted name is just text', () => {
    ok("SELECT * FROM students WHERE name = 'DELETE'");
    ok('SELECT "PRAGMA" FROM students');
    ok("SELECT 'it''s; fine'");
  });
});

describe('createSqlSandbox (core on a real SQLite)', () => {
  test('runs a query and returns columns and rows for display', async () => {
    const box = await sandbox();
    const result = await box.run('SELECT name, grade FROM students ORDER BY id');
    expect(result).toEqual({ ok: true, columns: ['name', 'grade'], rows: [['Ada', 90], ['Ben', 75], ['Cy', 82], ['Di', null]], error: null, truncated: false });
    expect((await box.run('SELECT COUNT(*) AS n, AVG(grade) AS avg FROM students;')).rows).toEqual([[4, (90 + 75 + 82) / 3]]);
  });
  test('joins, aggregates, subqueries and CTEs work', async () => {
    const box = await sandbox();
    expect((await box.run('SELECT city, COUNT(*) AS n FROM students GROUP BY city HAVING n > 1')).rows).toEqual([['Manila', 2]]);
    expect((await box.run('WITH good AS (SELECT * FROM students WHERE grade > 80) SELECT name FROM good ORDER BY name')).rows).toEqual([['Ada'], ['Cy']]);
    expect((await box.run('SELECT name FROM students WHERE grade = (SELECT MAX(grade) FROM students)')).rows).toEqual([['Ada']]);
    expect((await box.run("SELECT REPLACE(name, 'a', 'A') FROM students WHERE id = 1")).rows).toEqual([['AdA']]);
  });
  test('an empty result is still a successful result', async () => {
    const box = await sandbox();
    expect(await box.run('SELECT * FROM students WHERE id = 99')).toMatchObject({ ok: true, rows: [], truncated: false, error: null });
  });
  test('SQLite errors come back as plain text, not exceptions', async () => {
    const box = await sandbox();
    const missing = await box.run('SELECT * FROM nope');
    expect(missing.ok).toBe(false);
    expect(missing.error).toMatch(/no such table: nope/);
    const syntax = await box.run('SELECT FROM students');
    expect(syntax).toMatchObject({ ok: false, columns: [], rows: [] });
    expect(syntax.error).toMatch(/syntax error/);
    expect((await box.run('SELECT nope FROM students')).error).toMatch(/no such column/);
  });
  test('invalid queries are refused without touching the data', async () => {
    const box = await sandbox();
    for (const q of ['DELETE FROM students', 'DROP TABLE students', 'SELECT 1; DELETE FROM students', 'UPDATE students SET grade = 0', "INSERT INTO students VALUES (9, 'z', 1, 'q')", 'PRAGMA query_only = OFF']) {
      const result = await box.run(q);
      expect(result.ok).toBe(false);
      expect(result.error).toBeTruthy();
    }
    expect((await box.run('SELECT COUNT(*) FROM students')).rows).toEqual([[4]]);
  });
  test('the database itself is read-only, even if a write got past validation', async () => {
    const db = await createTestDatabase();
    const box = await makeSandbox({ execAsync: (s) => db.execAsync(s), getAllAsync: (s) => db.getAllAsync(s), closeAsync: async () => db.close() }, SETUP);
    opened.push(box);
    await expect(db.execAsync("INSERT INTO students VALUES (9, 'x', 1, 'y')")).rejects.toThrow(/readonly|read-only/i);
    await expect(db.execAsync('DROP TABLE students')).rejects.toThrow(/readonly|read-only/i);
  });
  test('rows are capped at 200 and flagged as truncated', async () => {
    const values = Array.from({ length: 450 }, (_, i) => `(${i})`).join(',');
    const box = await sandbox(`CREATE TABLE big (n INTEGER); INSERT INTO big VALUES ${values};`);
    const all = await box.run('SELECT n FROM big ORDER BY n');
    expect(all.rows).toHaveLength(200);
    expect(all.rows[199]).toEqual([199]);
    expect(all.truncated).toBe(true);
    const exact = await box.run('SELECT n FROM big WHERE n < 200');
    expect(exact.rows).toHaveLength(200);
    expect(exact.truncated).toBe(false);
    const limited = await box.run('SELECT n FROM big ORDER BY n LIMIT 5');
    expect(limited.rows).toHaveLength(5);
    expect(limited.truncated).toBe(false);
    expect((await box.run('SELECT n FROM big ORDER BY n LIMIT 300')).rows).toHaveLength(200);
  });
  test('a runaway cross join is cut off by the row cap instead of returning millions', async () => {
    const values = Array.from({ length: 300 }, (_, i) => `(${i})`).join(',');
    const box = await sandbox(`CREATE TABLE big (n INTEGER); INSERT INTO big VALUES ${values};`);
    const result = await box.run('SELECT a.n, b.n, c.n FROM big a, big b, big c');
    expect(result.rows).toHaveLength(200);
    expect(result.truncated).toBe(true);
  });
  test('only CREATE and INSERT may seed the sandbox', async () => {
    for (const setup of ['DROP TABLE x', "ATTACH DATABASE 'x' AS y", 'PRAGMA foreign_keys = OFF', 'CREATE TABLE a (n); DELETE FROM a', 'SELECT 1', 'UPDATE a SET n = 1']) {
      const db = await createTestDatabase();
      await expect(makeSandbox({ execAsync: (s) => db.execAsync(s), getAllAsync: (s) => db.getAllAsync(s) }, setup)).rejects.toThrow(/setup/i);
      db.close();
    }
  });
  test('each sandbox is separate and closing is safe to repeat', async () => {
    const a = await sandbox('CREATE TABLE only_a (x INTEGER); INSERT INTO only_a VALUES (1);');
    const b = await sandbox('CREATE TABLE only_b (x INTEGER);');
    expect((await a.run('SELECT * FROM only_a')).ok).toBe(true);
    expect((await b.run('SELECT * FROM only_a')).ok).toBe(false);
    await a.close();
    await a.close();
    expect((await a.run('SELECT 1')).ok).toBe(false);
  });
  test('blobs and numbers display safely', async () => {
    const box = await sandbox();
    expect((await box.run("SELECT x'0102' AS b, 1.5 AS f, NULL AS n, 'é' AS s")).rows).toEqual([['[blob 2 bytes]', 1.5, null, 'é']]);
  });
  test('a streaming driver (queryRaw) is used when present, with exact columns', async () => {
    const calls: string[] = [];
    const box = await sandbox(SETUP, {
      queryRaw: async (sql, limit) => {
        calls.push(`${sql}|${limit}`);
        return { columns: ['name', 'name'], rows: [['Ada', 'Ada']] };
      },
    });
    expect(await box.run('SELECT name, name FROM students -- hi\n;')).toMatchObject({ ok: true, columns: ['name', 'name'], rows: [['Ada', 'Ada']] });
    expect(calls).toEqual(['SELECT name, name FROM students|201']);
  });
});

describe('createSqlSandbox (the expo-sqlite wrapper)', () => {
  test('opens an in-memory database, seeds it, streams rows and finalizes statements', async () => {
    const node = await createTestDatabase();
    const finalized: string[] = [];
    const log: string[] = [];
    const fake = {
      execAsync: (sql: string) => (log.push(sql.trim().split(/\s+/).slice(0, 2).join(' ')), node.execAsync(sql)),
      getAllAsync: (sql: string) => node.getAllAsync(sql),
      closeAsync: async () => void (log.push('close'), node.close()),
      prepareAsync: async (sql: string) => {
        const rows = (await node.getAllAsync(sql)) as Record<string, unknown>[];
        return {
          getColumnNamesAsync: async () => (rows[0] ? Object.keys(rows[0]) : []),
          executeForRawResultAsync: async () => (async function* () { for (const row of rows) yield Object.values(row); })(),
          finalizeAsync: async () => void finalized.push(sql),
        };
      },
    };
    mockOpen.mockResolvedValueOnce(fake);
    const box = await createSqlSandbox(SETUP);
    expect(mockOpen).toHaveBeenCalledWith(':memory:');
    const result = await box.run('SELECT name FROM students WHERE grade > 80 ORDER BY name');
    expect(result).toEqual({ ok: true, columns: ['name'], rows: [['Ada'], ['Cy']], error: null, truncated: false });
    expect(finalized).toHaveLength(1);
    expect((await box.run('SELECT * FROM missing')).error).toMatch(/no such table/);
    await box.close();
    expect(log).toContain('close');
  });
});

describe('compareSql', () => {
  const result = (columns: string[], rows: unknown[][], extra: Partial<Parameters<typeof compareSql>[0]> = {}) => ({ ok: true, columns, rows, error: null, truncated: false, ...extra });

  test('a matching result passes', () => {
    expect(compareSql(result(['name'], [['Ada'], ['Cy']]), { columns: ['name'], rows: [['Ada'], ['Cy']], ordered: true })).toEqual({ pass: true, feedback: 'Correct! Your query returned the expected rows.' });
  });
  test('column names are compared ignoring case; AS names matter; column count is explained', () => {
    expect(compareSql(result(['NAME'], [['Ada']]), { columns: ['name'], rows: [['Ada']], ordered: true }).pass).toBe(true);
    const wrongName = compareSql(result(['name', 'avg_grade'], [['Ada', 1]]), { columns: ['name', 'average'], rows: [['Ada', 1]], ordered: true });
    expect(wrongName.pass).toBe(false);
    expect(wrongName.feedback).toBe('Column 2 should be called "average" but is called "avg_grade". Check the column order and any AS names.');
    expect(compareSql(result(['name', 'grade'], [['Ada', 1]]), { columns: ['name'], rows: [['Ada']], ordered: true }).feedback).toBe('Expected 1 column (name) but your query returned 2 columns (name, grade).');
    expect(compareSql(result([], [['Ada', 1]]), { rows: [['Ada']], ordered: true }).feedback).toBe('Expected 1 column but your query returned 2 columns.');
  });
  test('row count mismatches say how many', () => {
    expect(compareSql(result(['n'], [[1]]), { columns: ['n'], rows: [[1], [2], [3]], ordered: true }).feedback).toBe('Your query returned 1 row, but the expected result has 3 rows.');
    expect(compareSql(result(['n'], []), { columns: ['n'], rows: [[1]], ordered: false }).feedback).toBe('Your query returned 0 rows, but the expected result has 1 row.');
    expect(compareSql(result(['n'], [[1], [2]], { truncated: true }), { columns: ['n'], rows: [[1], [2]], ordered: true }).feedback).toMatch(/more than 200 rows/);
  });
  test('ordered: names the first differing row, and spots a right-but-misordered result', () => {
    const wrong = compareSql(result(['name', 'grade'], [['Ada', 90], ['Ben', 70]]), { columns: ['name', 'grade'], rows: [['Ada', 90], ['Ben', 75]], ordered: true });
    expect(wrong).toEqual({ pass: false, feedback: "Row 2 should be ('Ben', 75) but is ('Ben', 70)." });
    const order = compareSql(result(['n'], [[2], [1]]), { columns: ['n'], rows: [[1], [2]], ordered: true });
    expect(order.pass).toBe(false);
    expect(order.feedback).toMatch(/right but not in the expected order.*ORDER BY/);
  });
  test('unordered: any order passes, duplicates count', () => {
    expect(compareSql(result(['n'], [[3], [1], [2]]), { rows: [[1], [2], [3]], ordered: false }).pass).toBe(true);
    expect(compareSql(result(['n'], [[1], [1], [2]]), { rows: [[1], [2], [2]], ordered: false }).feedback).toMatch(/should not be there: \(1\)/);
    expect(compareSql(result(['n'], [[1], [9]]), { rows: [[1], [2]], ordered: false }).feedback).toBe('Your result has a row that should not be there: (9).');
  });
  test('NULL, text, numbers (with tolerance) and booleans compare sensibly', () => {
    expect(compareSql(result(['a', 'b', 'c'], [[null, 'x', 0.1 + 0.2]]), { rows: [[null, 'x', 0.3]], ordered: true }).pass).toBe(true);
    expect(compareSql(result(['a'], [['1']]), { rows: [[1]], ordered: true }).pass).toBe(false);
    expect(compareSql(result(['a'], [[1]]), { rows: [[true]], ordered: true }).pass).toBe(true);
    expect(compareSql(result(['a'], [[null]]), { rows: [['NULL']], ordered: true }).pass).toBe(false);
    expect(compareSql(result(['a'], [['Ada']]), { rows: [['ada']], ordered: true }).pass).toBe(false);
    expect(compareSql(result(['a'], [[null]]), { rows: [[1]], ordered: true }).feedback).toBe('Row 1 should be (1) but is (NULL).');
  });
  test('a failed query explains the problem instead of comparing', () => {
    expect(compareSql({ ok: false, columns: [], rows: [], error: 'no such table: nope', truncated: false }, { rows: [[1]], ordered: true })).toEqual({
      pass: false,
      feedback: 'Your query has a problem: no such table: nope',
    });
  });
  test('works end to end with a real sandbox', async () => {
    const box = await sandbox();
    const good = await box.run('SELECT name FROM students WHERE city = \'Manila\' ORDER BY name');
    expect(compareSql(good, { columns: ['name'], rows: [['Ada'], ['Cy']], ordered: true }).pass).toBe(true);
    const bad = await box.run("SELECT name FROM students WHERE city = 'Cebu'");
    expect(compareSql(bad, { columns: ['name'], rows: [['Ada'], ['Cy']], ordered: true }).feedback).toMatch(/returned 1 row/);
  });
});

describe('Tagalog SQL messages', () => {
  test('validation and comparison speak Tagalog', async () => {
    const fil = runnerStrings.fil;
    expect(validateSelect('', fil)).toEqual({ ok: false, reason: fil.sql.writeSelect });
    expect(validateSelect('DROP TABLE students', fil)).toMatchObject({ ok: false, reason: expect.stringContaining('SELECT query lang') });
    const box = await sandbox();
    const result = await box.run('SELECT name FROM students');
    const expected = { columns: ['name'], rows: [['Ada']], ordered: true };
    expect(compareSql(result, expected, fil).feedback).toBe('4 row ang ibinalik ng query mo, pero 1 row ang inaasahang result.');
    const all = await box.run('SELECT name FROM students ORDER BY id');
    expect(compareSql(all, { columns: ['name'], rows: [['Ada'], ['Ben'], ['Cy'], ['Di']], ordered: true }, fil)).toEqual({ pass: true, feedback: fil.sql.correct });
  });
});
