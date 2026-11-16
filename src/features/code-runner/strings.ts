import { defineStrings } from '@/lib/i18n';

/**
 * The sentences the sandbox itself writes for the learner (limits, unsupported syntax, test labels, SQL
 * checks). Errors that mirror JavaScript's own (`x is not defined`, `Cannot read properties of null`) stay in
 * English on purpose: they are what any JavaScript tool says. Every function here takes the table as an
 * optional last argument and defaults to English, so callers that don't care keep working.
 */
export const runnerStrings = defineStrings({
  en: {
    codeMustBeText: 'The code must be text',
    programTooLong: 'This program is too long for the playground',
    threwError: 'Your program threw an error',
    cannotRun: (detail: string) => `The playground could not run this code (${detail})`,
    ranTooLong: 'Your program ran too long (possible infinite loop)',
    tooMuchOutput: 'Your program printed too much output',
    unsupported: (what: string) => `${what} isn't supported in the Talino playground yet`,
    importExport: "Importing and exporting isn't supported in the Talino playground yet",
    nestedTooDeep: 'This code is nested too deeply to read',
    couldNotRunCode: 'The code could not be run',
    needsFunction: (name: string) => `Your code needs a function named ${name}`,
    programStopped: 'The program stopped.',
    lineLabel: (n: number) => `Line ${n}`,
    testLabel: (n: number) => `Test ${n}`,
    hiddenTestLabel: (n: number) => `Hidden test ${n}`,
    sql: {
      writeSelect: 'Write a SELECT query first.',
      tooLong: 'That query is too long for the playground.',
      badCharacter: 'The query contains a character that is not allowed.',
      commentOpen: 'A /* comment is never closed.',
      textOpen: 'A text value (in quotes) is never closed.',
      nameOpen: 'A quoted name is never closed.',
      bracketOpen: 'A [bracketed name] is never closed.',
      oneStatement: 'Only one statement can run at a time. Remove everything after the first ;',
      onlySelect: (start: string) => `Only SELECT queries can run here, but this starts with ${start}.`,
      recursive: "Recursive queries (WITH RECURSIVE) aren't available in the playground.",
      replaceFunction: 'REPLACE can only be used as a function here, like REPLACE(text, from, to). This playground only reads data.',
      forbidden: (word: string) => `${word} isn't allowed here. The playground only runs SELECT queries that read data.`,
      withNeedsSelect: 'A WITH query must end in a SELECT.',
      unreadable: 'That query could not be read.',
      sandboxClosed: 'The sandbox is closed.',
      queryFailed: 'The query failed.',
      couldNotStart: 'The SQL practice database could not start.',
      problem: (error: string) => `Your query has a problem: ${error}`,
      couldNotRun: 'it could not run',
      columnCount: (expected: number, names: string, got: number, gotNames: string) =>
        `Expected ${expected} ${expected === 1 ? 'column' : 'columns'} (${names}) but your query returned ${got} ${got === 1 ? 'column' : 'columns'} (${gotNames}).`,
      columnName: (n: number, expected: string, got: string) => `Column ${n} should be called "${expected}" but is called "${got}". Check the column order and any AS names.`,
      columnCountOnly: (expected: number, got: number) => `Expected ${expected} ${expected === 1 ? 'column' : 'columns'} but your query returned ${got} ${got === 1 ? 'column' : 'columns'}.`,
      rowCount: (got: number, truncated: boolean, max: number, want: number) =>
        `Your query returned ${truncated ? `more than ${max} ${max === 1 ? 'row' : 'rows'}` : `${got} ${got === 1 ? 'row' : 'rows'}`}, but the expected result has ${want} ${want === 1 ? 'row' : 'rows'}.`,
      orderOnly: (n: number, want: string, got: string) => `The rows are right but not in the expected order (row ${n} should be ${want} but is ${got}). Check your ORDER BY.`,
      rowWrong: (n: number, want: string, got: string) => `Row ${n} should be ${want} but is ${got}.`,
      extraRow: (row: string) => `Your result has a row that should not be there: ${row}.`,
      correct: 'Correct! Your query returned the expected rows.',
    },
  },
  fil: {
    codeMustBeText: 'Dapat text ang code',
    programTooLong: 'Masyadong mahaba ang program na ito para sa playground',
    threwError: 'Nag-throw ng error ang program mo',
    cannotRun: (detail: string) => `Hindi na-run ng playground ang code na ito (${detail})`,
    ranTooLong: 'Masyadong matagal tumakbo ang program mo (baka infinite loop)',
    tooMuchOutput: 'Masyadong maraming output ang na-print ng program mo',
    unsupported: (what: string) => `Hindi pa supported ang ${what} sa Talino playground`,
    importExport: 'Hindi pa supported ang import at export sa Talino playground',
    nestedTooDeep: 'Masyadong malalim ang pagkaka-nest ng code na ito kaya hindi mabasa',
    couldNotRunCode: 'Hindi na-run ang code',
    needsFunction: (name: string) => `Kailangan ng function na may pangalang ${name} sa code mo`,
    programStopped: 'Huminto ang program.',
    lineLabel: (n: number) => `Line ${n}`,
    testLabel: (n: number) => `Test ${n}`,
    hiddenTestLabel: (n: number) => `Hidden test ${n}`,
    sql: {
      writeSelect: 'Magsulat muna ng SELECT query.',
      tooLong: 'Masyadong mahaba ang query na ito para sa playground.',
      badCharacter: 'May character sa query na hindi puwede.',
      commentOpen: 'May /* comment na hindi naisara.',
      textOpen: 'May text value (nasa quotes) na hindi naisara.',
      nameOpen: 'May pangalang nasa quotes na hindi naisara.',
      bracketOpen: 'May [bracketed name] na hindi naisara.',
      oneStatement: 'Isang statement lang ang puwedeng i-run kada beses. Burahin ang lahat ng nasa likod ng unang ;',
      onlySelect: (start: string) => `SELECT query lang ang puwedeng i-run dito, pero ${start} ang simula ng sa'yo.`,
      recursive: 'Hindi available sa playground ang recursive query (WITH RECURSIVE).',
      replaceFunction: 'Bilang function lang puwedeng gamitin ang REPLACE dito, tulad ng REPLACE(text, from, to). Nagbabasa lang ng data ang playground na ito.',
      forbidden: (word: string) => `Hindi puwede ang ${word} dito. SELECT query lang na nagbabasa ng data ang tumatakbo sa playground.`,
      withNeedsSelect: 'Dapat magtapos sa SELECT ang isang WITH query.',
      unreadable: 'Hindi mabasa ang query na iyan.',
      sandboxClosed: 'Sarado na ang sandbox.',
      queryFailed: 'Hindi gumana ang query.',
      couldNotStart: 'Hindi nagsimula ang SQL practice database.',
      problem: (error: string) => `May problema sa query mo: ${error}`,
      couldNotRun: 'hindi ito na-run',
      columnCount: (expected: number, names: string, got: number, gotNames: string) => `${expected} column ang inaasahan (${names}), pero ${got} column ang ibinalik ng query mo (${gotNames}).`,
      columnName: (n: number, expected: string, got: string) => `Dapat "${expected}" ang pangalan ng column ${n}, pero "${got}" ang nakalagay. Tingnan ang pagkakasunod-sunod ng columns at ang mga AS name.`,
      columnCountOnly: (expected: number, got: number) => `${expected} column ang inaasahan, pero ${got} column ang ibinalik ng query mo.`,
      rowCount: (got: number, truncated: boolean, max: number, want: number) =>
        `${truncated ? `Mahigit ${max} row` : `${got} row`} ang ibinalik ng query mo, pero ${want} row ang inaasahang result.`,
      orderOnly: (n: number, want: string, got: string) => `Tama ang mga row pero hindi pa sa tamang pagkakasunod-sunod (dapat ${want} ang row ${n}, pero ${got} ang nakalagay). Tingnan ang ORDER BY mo.`,
      rowWrong: (n: number, want: string, got: string) => `Dapat ${want} ang row ${n}, pero ${got} ang nakalagay.`,
      extraRow: (row: string) => `May row sa result mo na hindi dapat nandoon: ${row}.`,
      correct: 'Tama! Ang inaasahang mga row ang ibinalik ng query mo.',
    },
  },
});

export type RunnerText = (typeof runnerStrings)['en'];

export const defaultRunnerText: RunnerText = runnerStrings.en;
