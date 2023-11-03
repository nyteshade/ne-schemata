// @flow

import type { ResolverMap, EntryInspector, AsyncEntryInspector } from './types'
import { ResolverMapStumble } from './errors'
import { isFn, getType } from './utils/typework'
import at from './propAt'

/**
 * A default implementation of the EntryInspector type for use as a default
 * to `walkResolverMap`. While not immediately useful, a default implementation
 * causes `walkResolverMap` to wrap any non-function and non-object values
 * with a function that returns the non-compliant value and therefore has some
 * intrinsic value.
 *
 * @method DefaultEntryInspector
 * @type {Function}
 */
export const DefaultEntryInspector: EntryInspector = (
  key,
  value,
  path,
  map
) => {
  return { [key]: value }
}

/**
 * A default implementation of the EntryInspector type for use as a default
 * to `asyncWalkResolverMap`. While not immediately useful, a default
 * implementation causes `asyncWalkResolverMap` to wrap any non-function and
 * non-object values with a function that returns the non-compliant value and
 * therefore has some intrinsic value.
 *
 * @method DefaultEntryInspector
 * @type {Function}
 */
export const DefaultAsyncEntryInspector: AsyncEntryInspector = async (
  key,
  value,
  path,
  map
) => {
  return { [key]: value }
}

/**
 * Given a `ResolverMap` object, walk its properties and allow execution
 * with each key, value pair. If the supplied function for handling a given
 * entry returns null instead of an object with the format `{key: value}`
 * then that entry will not be included in the final output.
 *
 * @method walkResolverMap
 *
 * @param {ResolverMap} object an object conforming to type `ResolverMap`
 * @param {boolean} wrap defaults to true. An entry whose value is neither a
 * function nor an object will be wrapped in a function returning the value. If
 * false is supplied here, a `ResolverMapStumble` error will be thrown instead
 * @param {Array<string>} path as `walkResolverMap` calls itself recursively,
 * path is appended to and added as a parameter to determine where in the tree
 * the current execution is working
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
export function walkResolverMap(
  object: ResolverMap,
  inspector: EntryInspector = DefaultEntryInspector,
  wrap: boolean = true,
  path: Array<string> = []
): ResolverMap {
  let product = {}

  path.reduce((prev, cur) => {
    if (!at(product, prev.concat(cur))) {
      at(product, prev.concat(cur), {})
    }
    prev.push(cur)

    return prev
  }, [])

  for (let [key, value] of Object.entries(object)) {
    const isObject: boolean = value instanceof Object
    const isFunction: boolean = isObject && isFn(value)

    if (isObject && !isFunction) {
      const newPath = path.concat(key)
      at(
        product,
        newPath,
        walkResolverMap(value, inspector, wrap, newPath)
      )
    }
    else {
      if (!isObject && !isFunction) {
        // In the case that we have a string mapping to a non-function and a
        // non-object, we can do one of two things. Either we can throw an error
        // or by default we simply wrap the value in a function that returns
        // that value
        if (!wrap) {
          throw new ResolverMapStumble(new Error(
            `Invalid ResolverMap entry at ${path.join('.')}.${key}: value is ` +
            `neither an object nor a function`
          ))
        }
        else {
          value = () => value
        }
      }

      let entry = inspector(key, value, path, object)

      if (entry !== undefined) {
        at(product, path.concat(key), entry[key])
      }
    }
  }

  return product
}

/**
 * Given a `ResolverMap` object, walk its properties and allow execution
 * with each key, value pair. If the supplied function for handling a given
 * entry returns null instead of an object with the format `{key: value}`
 * then that entry will not be included in the final output.
 *
 * @method asyncWalkResolverMap
 *
 * @param {ResolverMap} object an object conforming to type `ResolverMap`
 * @param {boolean} wrap defaults to true. An entry whose value is neither a
 * function nor an object will be wrapped in a function returning the value. If
 * false is supplied here, a `ResolverMapStumble` error will be thrown instead
 * @param {Array<string>} path as `walkResolverMap` calls itself recursively,
  * path is appended to and added as a parameter to determine where in the tree
  * the current execution is working
 * @param {Array<error>} skips if supplied, this array will have an appended
 * error for each sub async walk error caught.
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
export async function asyncWalkResolverMap(
  object: ResolverMap,
  inspector: AsyncEntryInspector = DefaultAsyncEntryInspector,
  wrap: boolean = true,
  path: Array<string> = [],
  skips: Array<error>
): ResolverMap {
  let product = {}

  path.reduce((prev, cur) => {
    if (!at(product, prev.concat(cur))) {
      at(product, prev.concat(cur), {})
    }
    prev.push(cur)

    return prev
  }, [])

  for (let [key, value] of Object.entries(object)) {
    const isObject: boolean = value instanceof Object
    const isFunction: boolean = isObject && isFn(value)

    if (isObject && !isFunction) {
      try {
        at(
          product,
          path.concat(key),
          await asyncWalkResolverMap(value, inspector, wrap, path, skips)
        )
      }
      catch (stumble) {
        if (skips && Array.isArray(skips)) {
          skips.push(new ResolverMapStumble(stumble, {
            key,
            value,
            source: object,
            destination: product
          }))
        }
      }
    }
    else {
      if (!isObject && !isFunction) {
        // In the case that we have a string mapping to a non-function and a
        // non-object, we can do one of two things. Either we can throw an error
        // or by default we simply wrap the value in a function that returns
        // that value
        if (!wrap) {
          throw new ResolverMapStumble(new Error('Invalid ResolverMap'))
        }
        else {
          value = () => value
        }
      }

      let entry = await inspector(key, value, path, object)

      if (entry !== undefined) {
        at(product, path.concat(key), entry[key])
      }
    }
  }

  return product
}

/**
 * Type definition for a property within a ResolverMap. It encapsulates the
 * property's name, value, the path to reach it within the object, and the
 * object itself.
 *
 * @flow
 * @type {ResolverProperty}
 */
export type ResolverProperty = {
  name: string,
  value: mixed,
  path: Array<string>,
  object: Object
}

/**
 * Merges two resolver objects recursively. In case of conflicting keys, the
 * provided `conflictResolver` function is called to determine the
 * resulting value.
 *
 * @flow
 * @param {Object} existingResolvers - The original set of resolvers.
 * @param {Object} newResolvers - The set of new resolvers to be merged into
 * the existing ones.
 * @param {function} conflictResolver - A function that resolves conflicts
 * between existing and new resolver properties.
 * @returns {Object} The merged set of resolvers.
 */
export function mergeResolvers(
  existingResolvers: Object,
  newResolvers: Object,
  conflictResolver: (
    existing: ResolverProperty,
    conflict: ResolverProperty
  ) => mixed = (e,c) => c.value
) {
  // Recursive function to walk and merge the resolver maps
  const walkAndMerge = (current, incoming, path = []) => {
    for (const key of Object.keys(incoming)) {
      const newPath = path.concat(key);

      // Check if the key exists in the current object
      if (Reflect.has(current, key)) {
        const existingValue = current[key];
        const incomingValue = incoming[key];

        if (existingValue && typeof existingValue === 'object' && !Array.isArray(existingValue) && !isFn(existingValue)) {
          // If both are objects, we need to go deeper
          walkAndMerge(existingValue, incomingValue, newPath);
        } else {
          // Conflict detected, call the user-supplied conflict resolution function
          const existingProp: ResolverProperty = {
            name: key, value: existingValue, path, object: existingResolvers
          }
          const incomingProp: ResolverProperty = {
            name: key, value: incomingValue, path, object: newResolvers
          }
          current[key] = conflictResolver(existingProp, incomingProp);
        }
      } else {
        // No conflict, just set the value from the incoming object
        current[key] = incoming[key];
      }
    }

    return current
  }

  return walkAndMerge(existingResolvers, newResolvers, [])
}

export default walkResolverMap
