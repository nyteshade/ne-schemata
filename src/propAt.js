// @ts-check

import { InvalidPathError } from './errors'

export const DoNotSet = Symbol.for('DoNotSet')

/**
 * This function takes an array of values that are used with `eval` to
 * dynamically, and programmatically, access the value of an object in a nested
 * fashion. It can take either a string with values separated by periods
 * (including array indices as numbers) or an array equivalent were
 * `.split('.')` to have been called on said string.
 *
 * Examples:
 * ```
 *   // Calling `at` with either set of arguments below results in the same
 *   // values.
 *   let object = { cats: [{ name: 'Sally' }, { name: 'Rose' }] }
 *
 *   at(object, 'cats.1.name') => Rose
 *   at(object, ['cats', 1, 'name']) => Rose
 *
 *   // Values can be altered using the same notation
 *   at(object, 'cats.1.name', 'Brie') => Brie
 *
 *   // Values cannot normally be accessed beyond existence. The following
 *   // will throw an error. A message to console.error will be written showing
 *   // the attempted path before the error is again rethrown
 *   at(object, 'I.do.not.exist') => ERROR
 *
 *   // However, if you want the function to play nice, `undefined` can be
 *   // returned instead of throwing an error if true is specified as the
 *   // fourth parameter
 *   at(object, 'I.do.not.exist', undefined, true) => undefined
 * ```
 *
 * @method at
 *
 * @param {Object} object an object that can be accessed using bracket notation
 * to access its inner property value. Anything extending object, including
 * arrays and functions, should work in this manner.
 * @param {string|string[]} path a period denoted path (numeric indicies
 * are allowed) or an array of individual strings. See above for more details
 * @param {unknown} setTo (optional) if this value is supplied, the path accessed
 * will be modified to this value before it is returned
 * @param {boolean} playNice (optional) by default if one tries to access a
 * path that fails somewhere in the middle and results in accessing a property
 * on an undefined or null value then an exception is thrown. Passing true here
 * will cause the function to simply return undefined.
 * @return {unknown} either the requested value or undefined as long as no
 * invalid access was requested. Otherwise an error is thrown if try to deeply
 * reach into a space where no value exists.
 */
export function at(
  object: Object,
  path: string | string[],
  setTo?: unknown = DoNotSet,
  playNice?: boolean = false
): unknown {
  if (typeof object !== 'object' || object === null || object === undefined) {
    throw new TypeError(`The first argument must be an object`)
  }

  if (typeof path === 'string') {
    if (path.includes('.')) {
      path = path.split('.')
    }
    else {
      path = [path]
    }
  }

  let target = object;

  // Iterate through the path, except the last key
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (key in target) {
      target = target[key];
    } else if (playNice) {
      return undefined;
    } else {
      throw new InvalidPathError(`Invalid path: ${path.slice(0, i + 1).join('.')}`);
    }
  }

  const lastKey = path[path.length - 1];

  // Handle setTo, if provided
  if (setTo !== DoNotSet) {
    // Ensure the path is valid before setting the value
    if (!(Reflect.has(target, lastKey)) && !playNice) {
      throw new InvalidPathError(`Invalid path: ${path.join('.')}`);
    }
    target[lastKey] = setTo;
  }

  if (!Reflect.has(target, lastKey) && !playNice) {
    throw new InvalidPathError(`Invalid path: ${path.join('.')}`)
  }

  // Return the value at the specified path, or undefined if playNice is true and the path is invalid
  return Reflect.has(target, lastKey)
    ? target[lastKey]
    : undefined
}

/**
 * `atNicely()` is a shorthand version of calling `at()` but specifying `true`
 * for the argument `playNice`. This can make reads normally performed with
 * calls to `at()` where you want to prevent errors from being thrown with
 * invalid paths
 *
 * @method atNicely
 *
 * @param {Object} object an object that can be accessed using bracket notation
 * to access its inner property value. Anything extending object, including
 * arrays and functions, should work in this manner.
 * @param {string|string[]} path a period denoted path (numeric indicies
 * are allowed) or an array of individual strings. See above for more details
 * @param {unknown} setTo (optional) if this value is supplied, the path accessed
 * will be modified to this value before it is returned
 * @return {unknown} either the requested value or undefined
 */
export function atNicely(
  object: Object,
  path: string | string[],
  setTo?: unknown
): unknown {
  return at(object, path, setTo, true)
}

/**
 * Default export is atNicely; as long as you know what you want, this leaves
 * cleaner code in your repository. Simply add this to the top of your module
 * ```
 * const at = require('./propAt').default
 * // or
 * import at from './propAt'
 *
 * // of course if you prefer, you may still do the following
 * const at = require('./propAt').at;
 * // or
 * import { at } from './propAt'
 * ```
 */
export default atNicely
