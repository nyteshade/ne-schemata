import { describe, it, expect } from 'vitest'
import {
  IS_TYPE_OF,
  RESOLVE_TYPE,
  DESCRIPTION,
  FIELD_DESCRIPTIONS,
  extractResolverInfo
} from '../../dist/utils';

describe('extractResolverInfo', () => {
  const mockSchema = {
    _typeMap: {
      SomeType: {
        name: 'SomeType',
        resolveType: undefined,
        isTypeOf: undefined,
        description: '',
        _fields: {
          someField: {
            description: '',
          },
        },
      },
    },
  };

  it('extracts isTypeOf functions from resolver map', () => {
    const resolvers = {
      SomeType: {
        [IS_TYPE_OF]: () => true,
      },
    };

    const result = extractResolverInfo(resolvers);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'SomeType',
          isTypeOf: expect.any(Function),
        }),
      ])
    );
  });

  it('extracts resolveType functions from resolver map', () => {
    const resolvers = {
      SomeType: {
        [RESOLVE_TYPE]: () => 'SomeType',
      },
    };

    const result = extractResolverInfo(resolvers);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'SomeType',
          resolveType: expect.any(Function),
        }),
      ])
    );
  });

  it('extracts descriptions from resolver map', () => {
    const resolvers = {
      SomeType: {
        [DESCRIPTION]: 'Some description',
      },
    };

    const result = extractResolverInfo(resolvers);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'SomeType',
          description: expect.any(Function),
        }),
      ])
    );
  });

  it('extracts field descriptions from resolver map', () => {
    const resolvers = {
      SomeType: {
        [FIELD_DESCRIPTIONS]: {
          someField: 'Some field description',
        },
      },
    };

    const result = extractResolverInfo(resolvers);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'SomeType',
          fieldDescriptions: expect.any(Object),
        }),
      ])
    );
  });

  it('applies extracted info to the schema', () => {
    const resolvers = {
      SomeType: {
        [IS_TYPE_OF]: () => true,
        [RESOLVE_TYPE]: () => 'SomeType',
        [DESCRIPTION]: 'Some description',
        [FIELD_DESCRIPTIONS]: {
          someField: 'Some field description',
        },
      },
    };

    const result = extractResolverInfo(resolvers);
    result.applyTo(mockSchema, true);

    const type = mockSchema._typeMap.SomeType;
    expect(type.isTypeOf).toBeDefined();
    expect(type.resolveType).toBeDefined();
    expect(type.description).toBeDefined();
    expect(type._fields.someField.description).toBeDefined();
  });

  // Additional tests can be added here to cover more edge cases and scenarios
});
