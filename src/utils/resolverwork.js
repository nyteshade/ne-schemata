// @ts-check

import type { ResolverInfo, ResolverMap } from '../types'
import { protoChain } from './typework'

/**
 * This constant type when applied to a ResolverMap object, will be picked up
 * by `extractResolverInfo` and be applied to the type on the executableSchema
 * type's `isTypeOf` property
 *
 * @type {Symbol}
 */
export const IS_TYPE_OF = Symbol.for('Resolver.isTypeOf')

/**
 * This constant type when applied to a ResolverMap object, will be picked up
 * by `extractResolverInfo` and be applied to the type on the executableSchema
 * type's `resolveType` property
 *
 * @type {Symbol}
 */
export const RESOLVE_TYPE = Symbol.for('Resolver.resolveType')

/**
 * A programmatic way to define a description outside of SDL. This is handy
 * when provided as a getter on the schema's type object. The getter gets invoked
 * each time the description field is accessed allowing dynamic content to be
 * presented instead of static content. Note that long running function work
 * here can slow down all items viewing the description
 *
 * @type {Symbol}
 */
export const DESCRIPTION = Symbol.for('Resolver.description')

/**
 * Unlike `DESCRIPTION` which defines the description of the type, this symbol
 * should always point to an object whose keys are the field names and whose
 * values are the descriptions. String constant values will be converted to a
 * function that returns the constant.
 *
 * @type {Symbol}
 */
export const FIELD_DESCRIPTIONS = Symbol.for('Resolver.fieldDescriptions')

/**
 * Walks a resolvers object and returns an array of objects with specific properties.
 *
 * @param {ResolverMap} resolvers - The resolvers object to walk.
 * @param {boolean} [deleteFields=false] - Whether to delete fields that are collected.
 * @returns {ResolverInfo[]} - The array of objects with specified properties.
 */
export function extractResolverInfo(resolvers, deleteFields = false) {
  const result = [];

  for (const [type, resolver] of Object.entries(resolvers)) {
    const item = { type };
    let include = false

    // Check for isTypeOf or __isTypeOf function
    if (resolver[IS_TYPE_OF] || resolver.__isTypeOf) {
      item.isTypeOf = resolver[IS_TYPE_OF] || resolver.__isTypeOf;
      include = true
      if (deleteFields) {
        delete resolver[IS_TYPE_OF];
        delete resolver.__isTypeOf;
      }
    }

    // Check for resolveType or __resolveType function
    if (resolver[RESOLVE_TYPE] || resolver.__resolveType) {
      item.resolveType = resolver[RESOLVE_TYPE] || resolver.__resolveType;
      include = true
      if (deleteFields) {
        delete resolver[RESOLVE_TYPE];
        delete resolver.__resolveType;
      }
    }

    // Check for description field
    if (resolver[DESCRIPTION]) {
      item.description = typeof resolver[DESCRIPTION] === 'string'
        ? () => resolver[DESCRIPTION]
        : resolver[DESCRIPTION];
      include = true
      if (deleteFields) {
        delete resolver[DESCRIPTION];
      }
    }

    // Check for the field descriptions field
    if (
      resolver[FIELD_DESCRIPTIONS] &&
      protoChain(resolver[FIELD_DESCRIPTIONS]).isa(Object)
    ) {
      item.fieldDescriptions = resolver[FIELD_DESCRIPTIONS]
      include = true
      if (deleteFields) {
        delete resolver[FIELD_DESCRIPTIONS];
      }
    }

    // Only add item to result if it has more than just the type property
    if (include) {
      item.applyTo = function applyTo(schema, overwrite = false) {
        if (Reflect.has(schema._typeMap, this.type)) {
          let { resolveType, isTypeOf, description, fieldDescriptions } = this
          let type = schema._typeMap[this.type]

          if (resolveType && Reflect.has(type, 'resolveType')) {
            if (!type.resolveType || overwrite) {
              type.resolveType = resolveType
            }
          }

          if (isTypeOf && Reflect.has(type, 'isTypeOf')) {
            if (!type.isTypeOf || overwrite) {
              type.isTypeOf = isTypeOf
            }
          }

          if (description && Reflect.has(type, 'description')) {
            if (!type.description || overwrite) {
              Object.defineProperty(type, 'description', {
                get: description,
                configurable: true,
                enumerable: true
              })
            }
          }

          if (fieldDescriptions && Reflect.has(type, '_fields')) {
            Object.entries(fieldDescriptions).forEach(([field, description]) => {
              if (!type._fields[field]?.description || overwrite) {
                const getter = protoChain(description).isa(Function)
                  ? description
                  : () => description

                Object.defineProperty(type._fields[field], 'description', {
                  get: getter,
                  configurable: true,
                  enumerable: true
                })
              }
            })
          }
        }
      }

      result.push(item);
    }
  }

  if (result.length) {
    result.applyTo = function applyTo(schema, overwrite = false) {
      result.forEach(info => info.applyTo(schema, overwrite))
    }
  }

  return result;
}

export default extractResolverInfo
