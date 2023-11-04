// @flow

import type { ResolverInfo, ResolverMap } from '../types'

/**
 * Walks a resolvers object and returns an array of objects with specific properties.
 *
 * @param {Object} resolvers - The resolvers object to walk.
 * @param {boolean} [deleteFields=false] - Whether to delete fields that are collected.
 * @returns {Array} - The array of objects with specified properties.
 */
export function extractResolverInfo(
  resolvers: ResolverMap,
  deleteFields: boolean = false
): Array<ResolverInfo> {
  const result = [];

  for (const [type, resolver] of Object.entries(resolvers)) {
    const item = { type };
    let include = false

    // Check for isTypeOf or __isTypeOf function
    if (resolver.isTypeOf || resolver.__isTypeOf) {
      item.isTypeOf = resolver.isTypeOf || resolver.__isTypeOf;
      include = true
      if (deleteFields) {
        delete resolver.isTypeOf;
        delete resolver.__isTypeOf;
      }
    }

    // Check for resolveType or __resolveType function
    if (resolver.resolveType || resolver.__resolveType) {
      item.resolveType = resolver.resolveType || resolver.__resolveType;
      include = true
      if (deleteFields) {
        delete resolver.resolveType;
        delete resolver.__resolveType;
      }
    }

    // Check for description field
    if (resolver.description) {
      item.description = typeof resolver.description === 'string'
        ? () => resolver.description
        : resolver.description;
      include = true
      if (deleteFields) {
        delete resolver.description;
      }
    }

    // Only add item to result if it has more than just the type property
    if (include) {
      item.applyTo = function applyTo(schema, overwrite = false) {
        if (Reflect.has(schema._typeMap, this.type)) {
          let { resolveType, isTypeOf, description } = this
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
        }
      }

      result.push(item);
    }
  }

  return result;
}

export default extractResolverInfo
