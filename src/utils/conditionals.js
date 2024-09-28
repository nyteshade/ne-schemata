/**
 * Executes a function or returns a value based on a condition. If the condition
 * is true, the `then` function or value is executed or returned. If the
 * condition is false, the `otherwise` function or value is executed or
 * returned.
 *
 * @param {boolean} condition - The condition to evaluate.
 * @param {Function|any} then - The function to execute or value to return if
 * the condition is true. If a function, the condition is passed as an argument.
 * @param {Function|any} [otherwise] - The function to execute or value to
 * return if the condition is false. If a function, the condition is passed as
 * an argument.
 *
 * @returns {any} The result of the `then` or `otherwise` function, or the
 * `then` or `otherwise` value, based on the condition.
 *
 * @example
 * const result = ifThenElse(true, () => 'Yes', () => 'No')
 * console.log(result) // Outputs: 'Yes'
 *
 * const result = ifThenElse(false, 'Yes', 'No')
 * console.log(result) // Outputs: 'No'
 */
export function ifThenElse(condition, then, otherwise) {
  if (condition) {
    if (then !== undefined) {
      if (typeof then === 'function')
        return then(condition)

      return then
    }
  }

  if (otherwise !== undefined) {
    if (typeof otherwise === 'function')
      return otherwise(condition)

    return otherwise
  }

  return undefined
}

/**
 * Executes a function or returns a value based on a condition. If the condition
 * is true, the `then` function or value is executed or returned.
 *
 * @param {boolean} condition - The condition to evaluate.
 * @param {Function|any} then - The function to execute or value to return if
 * the condition is true. If a function, the condition is passed as an argument.
 *
 * @returns {any} The result of the `then` function or the `then` value, based
 * on the condition.
 *
 * @example
 * const result = ifThen(true, () => 'Yes')
 * console.log(result) // Outputs: 'Yes'
 *
 * const result = ifThen(false, 'Yes')
 * console.log(result) // Outputs: undefined
 */
export function ifThen(condition, then) {
  return ifThenElse(condition, then)
}

/**
 * Executes a function and catches any errors that occur, optionally handling
 * them with a provided catch function.
 *
 * @param {Function} tryFn - The function to attempt.
 * @param {Function?} [catchFn] - The function to handle any errors thrown
 * by tryFn. Receives the error as the first argument.
 * @param {any?} [thisArg] - The value to use as `this` when calling tryFn
 * and catchFn.
 * @param {any[]?} args - Additional arguments to pass to tryFn and catchFn.
 *
 * @returns {any} The result of tryFn if it succeeds, or the result of catchFn
 * if an error occurs. If both functions fail, returns undefined.
 *
 * @example
 * function riskyOperation() {
 *   if (Math.random() > 0.5) throw new Error('Failed')
 *   return 'Success'
 * }
 *
 * function handleFailure(error) {
 *   console.error('Operation failed:', error)
 *   return 'Default value'
 * }
 *
 * const result = tryCatch(riskyOperation, handleFailure)
 * console.log(result) // Outputs: 'Success' or 'Default value'
 */
export function tryCatch(tryFn, catchFn, thisArg, ...args) {
  try {
    if (tryFn && typeof tryFn === 'function')
      return tryFn.apply(thisArg, ...args)
  }
  catch (error) {
    if (catchFn && typeof catchFn === 'function')
      return catchFn.apply(thisArg, [error, ...args])
  }

  return undefined
}

/**
 * Executes an asynchronous function and catches any errors that occur,
 * optionally handling them with a provided catch function.
 *
 * @param {Function} tryFn - The asynchronous function to attempt.
 * @param {Function?} [catchFn] - The function to handle any errors thrown
 * by tryFn. Receives the error as the first argument.
 * @param {any?} [thisArg] - The value to use as `this` when calling tryFn
 * and catchFn.
 * @param {any[]?} args - Additional arguments to pass to tryFn and catchFn.
 *
 * @returns {Promise<any>} The result of tryFn if it succeeds, or the result
 * of catchFn if an error occurs. If both functions fail, returns the error
 * from tryFn.
 *
 * @example
 * // If we don't care about catching
 * async function fetchData() {
 *   // Simulate a fetch operation
 *   return 'data'
 * }
 * await asyncTryCatch(fetchData) // receives undefined if it fails
 *
 * @example
 * async function fetchData() {
 *   // Simulate a fetch operation
 *   return 'data'
 * }
 *
 * async function handleError(error) {
 *   console.error('Error occurred:', error)
 *   return 'default data'
 * }
 *
 * asyncTryCatch(fetchData, handleError).then(result => {
 *   console.log(result) // Outputs: 'data' or 'default data'
 * })
 */
export async function asyncTryCatch(tryFn, catchFn, thisArg, ...args) {
  try {
    return await tryFn?.apply(thisArg, ...args)
  }
  catch (error) {
    if (catchFn && typeof catchFn === 'function') {
      try {
        return await catchFn.apply(thisArg, [error, ...args])
      }
      catch (ignored) { return error }
    }
  }

  return undefined
}

/**
 * Checks to see if the supplied value is compatible with output from node's
 * path.parse() function.
 *
 * @param {any} value any JavaScript value
 * @returns true if the supplied value is an object with the expected keys of
 * a result from a call to node's `node:path` `parse()` function call.
 */
export function isParsedPath(value) {
  return (
    // Is truthy
    value &&

    // Is of type object or an instanceof Object
    (typeof value === 'object' || value instanceof Object) &&

    // Contains the expected keys of a parsed path object result
    ['root', 'dir', 'base', 'ext', 'name'].every(
      key => Reflect.has(value, key)
    )
  )
}

/**
 * Shorthand logic to run a function or return a value if `value` is compatible
 * with node's path.parse() function.
 *
 * @param {any} value the value to check for path.parse() equivalency
 * @param {function|any} then a function or non-undefined value to return
 * in the case that `value` is path.parse() output compatible. If `then` is
 * a function, `value` is passed to it and its result is returned.
 * @param {function|any} otherwise if `value` is not path.parse() output
 * compatible, `otherwise` is returned unless it's a function in which case
 * `value` is passed to the function and the result of the call is returned.
 * @returns
 */
export function ifParsedPath(
  value,
  then = (parsed) => format(parsed),
  otherwise
) {
  return ifThenElse(isParsedPath(value), then, otherwise, undefined, value)
}