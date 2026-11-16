import { describe, expect, test } from '@jest/globals';

import { callMethod, CLASS_SPECS, constructorCall, createInstance, MAX_OBJECTS, type ObjectInstance } from './classes';

const dog = CLASS_SPECS[0]!;
const car = CLASS_SPECS[1]!;

describe('classes and objects', () => {
  test('an object gets its own values and a numbered id', () => {
    const first = createInstance(dog, { name: 'Rex', age: '3' }, []);
    if (!first.ok) throw new Error('expected ok');
    expect(first.instance).toEqual({ id: 'dog1', values: { name: 'Rex', age: 3 } });
    const second = createInstance(dog, { name: 'Bella', age: '5' }, [first.instance]);
    expect(second.ok && second.instance.id).toBe('dog2');
  });

  test('bad input is refused with the field to fix', () => {
    expect(createInstance(dog, { name: '', age: '3' }, [])).toEqual({ ok: false, field: 'name', reason: 'empty' });
    expect(createInstance(dog, { name: 'Rex', age: 'old' }, [])).toEqual({ ok: false, field: 'age', reason: 'notNumber' });
    const full: ObjectInstance[] = Array.from({ length: MAX_OBJECTS }, (_, index) => ({ id: `dog${index + 1}`, values: { name: 'x', age: 1 } }));
    expect(createInstance(dog, { name: 'Rex', age: '3' }, full)).toMatchObject({ ok: false, reason: 'full' });
  });

  test('a method changes only the object it was called on', () => {
    const a: ObjectInstance = { id: 'dog1', values: { name: 'Rex', age: 3 } };
    const b: ObjectInstance = { id: 'dog2', values: { name: 'Bella', age: 5 } };
    const outcome = callMethod(dog, [a, b], 'dog1', 'birthday()');
    expect(outcome.instances[0]?.values.age).toBe(4);
    expect(outcome.instances[1]).toBe(b);
    expect(a.values.age).toBe(3);
    expect(outcome.result).toContain('Rex');
  });

  test('methods read the object own values', () => {
    const rex: ObjectInstance = { id: 'dog1', values: { name: 'Rex', age: 3 } };
    const bella: ObjectInstance = { id: 'dog2', values: { name: 'Bella', age: 5 } };
    expect(callMethod(dog, [rex, bella], 'dog1', 'speak()').result).toBe('Rex says Woof!');
    expect(callMethod(dog, [rex, bella], 'dog2', 'speak()').result).toBe('Bella says Woof!');
    const vehicle: ObjectInstance = { id: 'car1', values: { make: 'Honda', speed: 0 } };
    const fast = callMethod(car, [vehicle], 'car1', 'accelerate()');
    expect(fast.instances[0]?.values.speed).toBe(10);
    expect(callMethod(car, fast.instances, 'car1', 'describe()').result).toBe('A Honda going 10 km/h');
  });

  test('the constructor call is written out', () => {
    expect(constructorCall(dog, { name: 'Rex', age: 3 })).toBe('new Dog("Rex", 3)');
  });

  test('an unknown object or method changes nothing', () => {
    const rex: ObjectInstance = { id: 'dog1', values: { name: 'Rex', age: 3 } };
    expect(callMethod(dog, [rex], 'dog9', 'speak()')).toEqual({ instances: [rex], result: '' });
    expect(callMethod(dog, [rex], 'dog1', 'fly()')).toEqual({ instances: [rex], result: '' });
  });
});
