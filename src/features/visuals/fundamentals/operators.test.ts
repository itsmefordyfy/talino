import { describe, expect, test } from '@jest/globals';

import { evaluate, pythonFloat, typeOfOperand } from './operators';

const js = (a: string, op: Parameters<typeof evaluate>[1], b: string) => evaluate(a, op, b, 'javascript');
const py = (a: string, op: Parameters<typeof evaluate>[1], b: string) => evaluate(a, op, b, 'python');
const shown = (result: ReturnType<typeof evaluate>) => (result.ok ? `${result.display}:${result.type}` : result.reason === 'error' ? result.error : `bad ${result.side}`);

describe('JavaScript operators', () => {
  test("'5' + 3 joins text, '5' - 3 does arithmetic", () => {
    expect(shown(js("'5'", '+', '3'))).toBe('"53":string');
    expect(shown(js("'5'", '-', '3'))).toBe('2:number');
    expect(shown(js("'6'", '*', "'2'"))).toBe('12:number');
  });
  test('floating point and division', () => {
    expect(shown(js('0.1', '+', '0.2'))).toBe('0.30000000000000004:number');
    expect(shown(js('7', '/', '2'))).toBe('3.5:number');
    expect(shown(js('1', '/', '0'))).toBe('Infinity:number');
    expect(shown(js('0', '/', '0'))).toBe('NaN:number');
    expect(shown(js("'abc'", '*', '2'))).toBe('NaN:number');
  });
  test('remainder keeps the sign of the left operand', () => {
    expect(shown(js('-7', '%', '3'))).toBe('-1:number');
    expect(shown(js('7', '%', '3'))).toBe('1:number');
  });
  test('booleans become numbers in arithmetic and text in joins', () => {
    expect(shown(js('true', '+', '1'))).toBe('2:number');
    expect(shown(js('true', '+', "'x'"))).toBe('"truex":string');
  });
  test('loose and strict equality', () => {
    expect(shown(js("'5'", '==', '5'))).toBe('true:boolean');
    expect(shown(js("'5'", '===', '5'))).toBe('false:boolean');
    expect(shown(js('1', '==', 'true'))).toBe('true:boolean');
    expect(shown(js('0', '==', "''"))).toBe('true:boolean');
    expect(shown(js("'a'", '<', "'b'"))).toBe('true:boolean');
    expect(shown(js("'10'", '<', "'9'"))).toBe('true:boolean');
    expect(shown(js("'10'", '<', '9'))).toBe('false:boolean');
  });
  test('`//` is not an operator', () => {
    expect(js('7', '//', '2').ok).toBe(false);
  });
  test('exponent', () => {
    expect(shown(js('2', '**', '10'))).toBe('1024:number');
    expect(shown(js('2', '**', '1024'))).toBe('Infinity:number');
  });
});

describe('Python operators', () => {
  test("'5' + 3 is a TypeError, text repeats with *", () => {
    expect(shown(py("'5'", '+', '3'))).toBe('TypeError: can only concatenate str (not "int") to str');
    expect(shown(py('3', '+', "'5'"))).toBe("TypeError: unsupported operand type(s) for +: 'int' and 'str'");
    expect(shown(py("'ab'", '*', '3'))).toBe("'ababab':str");
    expect(shown(py('3', '*', "'ab'"))).toBe("'ababab':str");
    expect(shown(py("'ab'", '*', '-1'))).toBe("'':str");
    expect(shown(py("'ab'", '*', '1.5'))).toContain("non-int of type 'float'");
    expect(shown(py("'a'", '+', "'b'"))).toBe("'ab':str");
  });
  test('true division is always a float, floor division keeps ints', () => {
    expect(shown(py('7', '/', '2'))).toBe('3.5:float');
    expect(shown(py('6', '/', '3'))).toBe('2.0:float');
    expect(shown(py('7', '//', '2'))).toBe('3:int');
    expect(shown(py('-7', '//', '2'))).toBe('-4:int');
    expect(shown(py('7.5', '//', '2'))).toBe('3.0:float');
    expect(shown(py('1', '//', '0.1'))).toBe('9.0:float');
    expect(shown(py('7', '/', '0'))).toContain('ZeroDivisionError');
    expect(shown(py('7', '//', '0'))).toContain('ZeroDivisionError');
  });
  test('modulo takes the sign of the right operand', () => {
    expect(shown(py('-7', '%', '3'))).toBe('2:int');
    expect(shown(py('7', '%', '-3'))).toBe('-2:int');
    expect(shown(py('7.5', '%', '2'))).toBe('1.5:float');
    expect(shown(py('-7.5', '%', '2'))).toBe('0.5:float');
  });
  test('floats and ints', () => {
    expect(shown(py('0.1', '+', '0.2'))).toBe('0.30000000000000004:float');
    expect(shown(py('1', '+', '2.0'))).toBe('3.0:float');
    expect(shown(py('2', '**', '100'))).toBe('1267650600228229401496703205376:int');
    expect(shown(py('2', '**', '-1'))).toBe('0.5:float');
    expect(shown(py('9999999999999999', '+', '1'))).toBe('10000000000000000:int');
    expect(shown(py('True', '+', '1'))).toBe('2:int');
  });
  test('comparisons', () => {
    expect(shown(py('5', '==', '5.0'))).toBe('True:bool');
    expect(shown(py("'5'", '==', '5'))).toBe('False:bool');
    expect(shown(py('True', '==', '1'))).toBe('True:bool');
    expect(shown(py("'5'", '<', '3'))).toContain('TypeError');
    expect(shown(py("'apple'", '<', "'banana'"))).toBe('True:bool');
    expect(py('1', '===', '1').ok).toBe(false);
  });
  test('negative base with a fractional exponent is complex', () => {
    expect(shown(py('-8', '**', '0.5'))).toContain('complex');
  });
});

describe('reading operands', () => {
  test('numbers, booleans and quoted text; bare words are rejected', () => {
    expect(typeOfOperand('42', 'javascript')).toBe('number');
    expect(typeOfOperand('42', 'python')).toBe('int');
    expect(typeOfOperand('4.0', 'python')).toBe('float');
    expect(typeOfOperand("'42'", 'python')).toBe('str');
    expect(typeOfOperand('"hi"', 'javascript')).toBe('string');
    expect(typeOfOperand('true', 'javascript')).toBe('boolean');
    expect(typeOfOperand('hello', 'javascript')).toBeNull();
    expect(typeOfOperand('', 'javascript')).toBeNull();
    expect(js('hello', '+', '1')).toEqual({ ok: false, reason: 'operand', side: 'left' });
    expect(js('1', '+', 'hello')).toEqual({ ok: false, reason: 'operand', side: 'right' });
  });
  test('Python float repr', () => {
    expect(pythonFloat(2)).toBe('2.0');
    expect(pythonFloat(1e16)).toBe('1e+16');
    expect(pythonFloat(0.00001)).toBe('1e-05');
    expect(pythonFloat(0.0001)).toBe('0.0001');
    expect(pythonFloat(Infinity)).toBe('inf');
    expect(pythonFloat(NaN)).toBe('nan');
  });
});
