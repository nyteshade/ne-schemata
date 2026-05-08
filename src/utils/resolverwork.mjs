import { protoChain } from './typework.mjs'

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
 * This symbol marks a subscription resolver on a field resolver object.
 * In modern GraphQL, subscription fields have both `resolve` and `subscribe`
 * functions. The subscribe function returns an AsyncIterator that yields
 * values, and the resolve function processes those values.
 *
 * Usage:
 *   resolvers.Subscription.onUserCreated = {
 *     [SUBSCRIBE]: async function*() { yield { onUserCreated: user } },
 *     resolve: (payload) => payload.onUserCreated
 *   }
 *
 * Or for field-level subscription in the resolver map:
 *   resolvers.Subscription = {
 *     onUserCreated: {
 *       subscribe: async function*() { ... },
 *       resolve: (payload) => payload
 *     }
 *   }
 *
 * @type {Symbol}
 */
export const SUBSCRIBE = Symbol.for('Resolver.subscribe')

/**
 * Marks a field as deprecated with an optional reason. This aligns with
 * the modern GraphQL @deprecated(reason: String) directive.
 *
 * @type {Symbol}
 */
export const DEPRECATED = Symbol.for('Resolver.deprecated')

/**
 * Specifies the deprecation reason for a field. Used with DEPRECATED symbol.
 *
 * @type {Symbol}
 */
export const DEPRECATION_REASON = Symbol.for('Resolver.deprecationReason')

/**
 * Marks a custom scalar with a @specifiedBy URL pointing to its specification.
 *
 * @type {Symbol}
 */
export const SPECIFIED_BY_URL = Symbol.for('Resolver.specifiedByURL')

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

    // Check for deprecated marker
    if (resolver[DEPRECATED] || resolver.__deprecated) {
      item.isDeprecated = true
      item.deprecationReason = resolver[DEPRECATION_REASON] ||
        resolver.__deprecationReason ||
        'No longer supported'
      include = true
      if (deleteFields) {
        delete resolver[DEPRECATED];
        delete resolver.__deprecated;
        delete resolver[DEPRECATION_REASON];
        delete resolver.__deprecationReason;
      }
    }

    // Check for specifiedBy URL (for scalars)
    if (resolver[SPECIFIED_BY_URL] || resolver.__specifiedByURL) {
      item.specifiedByURL = resolver[SPECIFIED_BY_URL] || resolver.__specifiedByURL
      include = true
      if (deleteFields) {
        delete resolver[SPECIFIED_BY_URL];
        delete resolver.__specifiedByURL;
      }
    }

    // Only add item to result if it has more than just the type property
    if (include) {
      item.applyTo = function applyTo(schema, overwrite = false) {
        if (Reflect.has(schema._typeMap, this.type)) {
          let type = schema._typeMap[this.type]
          let {
            resolveType,
            isTypeOf,
            description,
            fieldDescriptions,
            isDeprecated,
            deprecationReason,
            specifiedByURL
          } = this

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

          // Apply deprecation to type if applicable
          if (isDeprecated && Reflect.has(type, 'isDeprecated')) {
            type.isDeprecated = true
            if (deprecationReason && Reflect.has(type, 'deprecationReason')) {
              type.deprecationReason = deprecationReason
            }
          }

          // Apply specifiedBy URL to scalars
          if (specifiedByURL && Reflect.has(type, 'specifiedByURL')) {
            if (!type.specifiedByURL || overwrite) {
              type.specifiedByURL = specifiedByURL
            }
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
