import { getType, isFn, protoChain } from '../../dist/utils';

describe('getType', () => {
  test('should return the correct type for primitives', () => {
    expect(getType('string')).toBe('String');
    expect(getType(123)).toBe('Number');
    expect(getType(true)).toBe('Boolean');
    expect(getType(Symbol('sym'))).toBe('Symbol');
  });

  test('should return the correct type for null and undefined', () => {
    expect(getType(null)).toBe('Null');
    expect(getType(undefined)).toBe('Undefined');
  });

  test('should return the correct type for objects', () => {
    expect(getType({})).toBe('Object');
    expect(getType([])).toBe('Array');
    expect(getType(() => {})).toBe('Function');
    expect(getType(new Date())).toBe('Date');
  });

  test('should handle objects with custom toString', () => {
    const customObject = {
      toString: () => '[object Custom]'
    };
    expect(getType(customObject)).toBe('Object');
  });
});

describe('isFn', () => {
  test('should return true for functions', () => {
    expect(isFn(() => {})).toBeTruthy();
    expect(isFn(function() {})).toBeTruthy();
    expect(isFn(class {})).toBeTruthy();
  });

  test('should return false for non-functions', () => {
    expect(isFn({})).toBeFalsy();
    expect(isFn(123)).toBeFalsy();
    expect(isFn('string')).toBeFalsy();
    expect(isFn(null)).toBeFalsy();
    expect(isFn(undefined)).toBeFalsy();
  });
});

describe('protoChain', () => {
  test('should handle null and undefined', () => {
    expect(protoChain(null)).toEqual(['Null']);
    expect(protoChain(undefined)).toEqual(['Undefined']);
  });

  test('should handle objects with a prototype chain', () => {
    class Grandparent {}
    class Parent extends Grandparent {}
    class Child extends Parent {}

    const child = new Child();
    const chain = protoChain(child);

    expect(chain).toContain('Child');
    expect(chain).toContain('Parent');
    expect(chain).toContain('Grandparent');
    expect(chain).toContain('Object');
  });

  test('should handle objects without constructor', () => {
    const obj = Object.create(null);
    const chain = protoChain(obj);
    expect(chain).toEqual([]);
  });

  test('isa method should correctly identify types in the chain', () => {
    class MyClass {}

    const myObj = new MyClass();
    const chain = protoChain(myObj);

    expect(chain.isa(MyClass)).toBeTruthy();
    expect(chain.isa(Object)).toBeTruthy();
    expect(chain.isa('String')).toBeFalsy();
  });

  test('actual getter should attempt to evaluate types', () => {
    class MyClass {}

    const myObj = new MyClass();
    const chain = protoChain(myObj);
    const actual = chain.actual

    // Assuming eval works correctly in the environment
    expect(actual.includes('MyClass')).toBeTruthy();
    expect(actual.includes(Object)).toBeTruthy();
  });

  // More tests can be added for additional scenarios, edge cases, and error handling.
});
