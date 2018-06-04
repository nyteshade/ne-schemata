// @flow

import type { ResolverMap } from './types'
import { ResolverMapStumble } from './errors'
import at from './propAt'
import merge from 'deepmerge'

/**
 * An `EntryInspector` is a function passed to `walkResolverMap` that is
 * invoked for each encountered pair along the way as it traverses the
 * `ResolverMap` in question. The default behavior is to simply return the
 * supplied entry back.
 *
 * If false, null or undefined is returned instead of an object with a string
 * mapping to a Function, then that property will not be included in the final
 * results of `walkResolverMap`.
 *
 * @type {Function}
 *
 * @param {{[string]: Function}} entry the key value pair supplied on each call
 * @param {[string]} path an array of strings indicating the path currently
 * being executed
 * @param {ResolverMap} map the map in question should it be needed
 */
export type EntryInspector = (
  key: string,
  value: Function,
  path: Array<string>,
  map: ResolverMap
) => ?{ [string]: Function }

/**
 * An `AsyncEntryInspector` is a function passed to `asyncWalkResolverMap`
 * that is invoked for each encountered pair along the way as it traverses the
 * `ResolverMap` in question. The default behavior is to simply return the
 * supplied entry back.
 *
 * If false, null or undefined is returned instead of an object with a string
 * mapping to a Function, then that property will not be included in the final
 * results of `asyncWalkResolverMap`.
 *
 * @type {Function}
 *
 * @param {{[string]: Function}} entry the key value pair supplied on each call
 * @param {[string]} path an array of strings indicating the path currently
 * being executed
 * @param {ResolverMap} map the map in question should it be needed
 */
export type AsyncEntryInspector = (
  key: string,
  value: Function,
  path: Array<string>,
  map: ResolverMap
) => ?Promise<{ [string]: Function }>

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
export const DefaultAsyncEntryInspector: EntryInspector = async (
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

  path.reduce((prev, cur, index) => {
    if (!at(product, prev.concat(cur))) {
      at(product, prev.concat(cur), {})
    }
    prev.push(cur)

    return prev
  }, [])

  for (let [key, value] of Object.entries(object)) {
    const isObject: boolean = value instanceof Object
    const isFunction: boolean = isObject && value instanceof Function

    if (isObject && !isFunction) {
      at(
        product,
        path.concat(key),
        walkResolverMap(value, inspector, wrap, path)
      )
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
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
export async function asyncWalkResolverMap(
  object: ResolverMap,
  inspector: AsyncEntryInspector = DefaultAsyncEntryInspector,
  wrap: boolean = true,
  path: Array<string> = []
): ResolverMap {
  let product = {}

  path.reduce((prev, cur, index) => {
    if (!at(product, prev.concat(cur))) {
      at(product, prev.concat(cur), {})
    }
    prev.push(cur)

    return prev
  }, [])

  for (let [key, value] of Object.entries(object)) {
    const isObject: boolean = value instanceof Object
    const isFunction: boolean = isObject && value instanceof Function

    if (isObject && !isFunction) {
      at(
        product,
        path.concat(key),
        await asyncWalkResolverMap(value, inspector, wrap, path)
      )
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

export default walkResolverMap
