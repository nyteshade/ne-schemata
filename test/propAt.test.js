import { describe, it, expect, at, beforeEach } from 'vitest'
import { at, atNicely } from '../dist'

describe('at function', () => {
  let obj = null

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: 42,
          d: [1, 2, 3]
        }
      }
    };
  })


  it('should get nested properties', () => {
    expect(at(obj, 'a.b.c')).toBe(42);
    expect(at(obj, ['a', 'b', 'c'])).toBe(42);
  });

  it('should set nested properties', () => {
    at(obj, 'a.b.c', 24);
    expect(obj.a.b.c).toBe(24);
    at(obj, ['a', 'b', 'c'], 42);
    expect(obj.a.b.c).toBe(42);
  });

  it('should handle arrays in the path', () => {
    expect(at(obj, 'a.b.d.1')).toBe(2);
    at(obj, 'a.b.d.1', 4);
    expect(obj.a.b.d[1]).toBe(4);
  });

  it('should throw error for invalid path', () => {
    expect(() => at(obj, 'a.b.z')).toThrow();
    expect(() => at(obj, 'a.x.c')).toThrow();
  });

  it('should return undefined for invalid path with playNice', () => {
    expect(at(obj, 'a.b.z', undefined, true)).toBeUndefined();
    expect(at(obj, 'a.x.c', undefined, true)).toBeUndefined();
  });
});

describe('atNicely function', () => {
  let obj

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: 42
        }
      }
    }
  })

  it('should get nested properties', () => {
    expect(atNicely(obj, 'a.b.c')).toBe(42);
  });

  it('should set nested properties', () => {
    atNicely(obj, 'a.b.c', 24);
    expect(obj.a.b.c).toBe(24);
  });

  it('should return undefined for invalid path', () => {
    expect(atNicely(obj, 'a.b.z')).toBeUndefined();
    expect(atNicely(obj, 'a.x.c')).toBeUndefined();
  });
});
