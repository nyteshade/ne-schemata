"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncTryCatch = asyncTryCatch;
exports.ifParsedPath = ifParsedPath;
exports.ifThen = ifThen;
exports.ifThenElse = ifThenElse;
exports.isParsedPath = isParsedPath;
exports.tryCatch = tryCatch;
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
function ifThenElse(condition, then, otherwise) {
  if (condition) {
    if (then !== undefined) {
      if (typeof then === 'function') return then(condition);
      return then;
    }
  }
  if (otherwise !== undefined) {
    if (typeof otherwise === 'function') return otherwise(condition);
    return otherwise;
  }
  return undefined;
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
function ifThen(condition, then) {
  return ifThenElse(condition, then);
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
function tryCatch(tryFn, catchFn, thisArg, ...args) {
  try {
    if (tryFn && typeof tryFn === 'function') return tryFn.apply(thisArg, ...args);
  } catch (error) {
    if (catchFn && typeof catchFn === 'function') return catchFn.apply(thisArg, [error, ...args]);
  }
  return undefined;
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
async function asyncTryCatch(tryFn, catchFn, thisArg, ...args) {
  try {
    return await tryFn?.apply(thisArg, ...args);
  } catch (error) {
    if (catchFn && typeof catchFn === 'function') {
      try {
        return await catchFn.apply(thisArg, [error, ...args]);
      } catch (ignored) {
        return error;
      }
    }
  }
  return undefined;
}

/**
 * Checks to see if the supplied value is compatible with output from node's
 * path.parse() function.
 *
 * @param {any} value any JavaScript value
 * @returns true if the supplied value is an object with the expected keys of
 * a result from a call to node's `node:path` `parse()` function call.
 */
function isParsedPath(value) {
  return (
    // Is truthy
    value && (
    // Is of type object or an instanceof Object
    typeof value === 'object' || value instanceof Object) &&
    // Contains the expected keys of a parsed path object result
    ['root', 'dir', 'base', 'ext', 'name'].every(key => Reflect.has(value, key))
  );
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
function ifParsedPath(value, then = parsed => format(parsed), otherwise) {
  return ifThenElse(isParsedPath(value), then, otherwise, undefined, value);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpZlRoZW5FbHNlIiwiY29uZGl0aW9uIiwidGhlbiIsIm90aGVyd2lzZSIsInVuZGVmaW5lZCIsImlmVGhlbiIsInRyeUNhdGNoIiwidHJ5Rm4iLCJjYXRjaEZuIiwidGhpc0FyZyIsImFyZ3MiLCJhcHBseSIsImVycm9yIiwiYXN5bmNUcnlDYXRjaCIsImlnbm9yZWQiLCJpc1BhcnNlZFBhdGgiLCJ2YWx1ZSIsIk9iamVjdCIsImV2ZXJ5Iiwia2V5IiwiUmVmbGVjdCIsImhhcyIsImlmUGFyc2VkUGF0aCIsInBhcnNlZCIsImZvcm1hdCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb25kaXRpb25hbHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFeGVjdXRlcyBhIGZ1bmN0aW9uIG9yIHJldHVybnMgYSB2YWx1ZSBiYXNlZCBvbiBhIGNvbmRpdGlvbi4gSWYgdGhlIGNvbmRpdGlvblxuICogaXMgdHJ1ZSwgdGhlIGB0aGVuYCBmdW5jdGlvbiBvciB2YWx1ZSBpcyBleGVjdXRlZCBvciByZXR1cm5lZC4gSWYgdGhlXG4gKiBjb25kaXRpb24gaXMgZmFsc2UsIHRoZSBgb3RoZXJ3aXNlYCBmdW5jdGlvbiBvciB2YWx1ZSBpcyBleGVjdXRlZCBvclxuICogcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb24gLSBUaGUgY29uZGl0aW9uIHRvIGV2YWx1YXRlLlxuICogQHBhcmFtIHtGdW5jdGlvbnxhbnl9IHRoZW4gLSBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvciB2YWx1ZSB0byByZXR1cm4gaWZcbiAqIHRoZSBjb25kaXRpb24gaXMgdHJ1ZS4gSWYgYSBmdW5jdGlvbiwgdGhlIGNvbmRpdGlvbiBpcyBwYXNzZWQgYXMgYW4gYXJndW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufGFueX0gW290aGVyd2lzZV0gLSBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvciB2YWx1ZSB0b1xuICogcmV0dXJuIGlmIHRoZSBjb25kaXRpb24gaXMgZmFsc2UuIElmIGEgZnVuY3Rpb24sIHRoZSBjb25kaXRpb24gaXMgcGFzc2VkIGFzXG4gKiBhbiBhcmd1bWVudC5cbiAqXG4gKiBAcmV0dXJucyB7YW55fSBUaGUgcmVzdWx0IG9mIHRoZSBgdGhlbmAgb3IgYG90aGVyd2lzZWAgZnVuY3Rpb24sIG9yIHRoZVxuICogYHRoZW5gIG9yIGBvdGhlcndpc2VgIHZhbHVlLCBiYXNlZCBvbiB0aGUgY29uZGl0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCByZXN1bHQgPSBpZlRoZW5FbHNlKHRydWUsICgpID0+ICdZZXMnLCAoKSA9PiAnTm8nKVxuICogY29uc29sZS5sb2cocmVzdWx0KSAvLyBPdXRwdXRzOiAnWWVzJ1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IGlmVGhlbkVsc2UoZmFsc2UsICdZZXMnLCAnTm8nKVxuICogY29uc29sZS5sb2cocmVzdWx0KSAvLyBPdXRwdXRzOiAnTm8nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZlRoZW5FbHNlKGNvbmRpdGlvbiwgdGhlbiwgb3RoZXJ3aXNlKSB7XG4gIGlmIChjb25kaXRpb24pIHtcbiAgICBpZiAodGhlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiB0aGVuKGNvbmRpdGlvbilcblxuICAgICAgcmV0dXJuIHRoZW5cbiAgICB9XG4gIH1cblxuICBpZiAob3RoZXJ3aXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIG90aGVyd2lzZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBvdGhlcndpc2UoY29uZGl0aW9uKVxuXG4gICAgcmV0dXJuIG90aGVyd2lzZVxuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZFxufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgZnVuY3Rpb24gb3IgcmV0dXJucyBhIHZhbHVlIGJhc2VkIG9uIGEgY29uZGl0aW9uLiBJZiB0aGUgY29uZGl0aW9uXG4gKiBpcyB0cnVlLCB0aGUgYHRoZW5gIGZ1bmN0aW9uIG9yIHZhbHVlIGlzIGV4ZWN1dGVkIG9yIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uIC0gVGhlIGNvbmRpdGlvbiB0byBldmFsdWF0ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb258YW55fSB0aGVuIC0gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb3IgdmFsdWUgdG8gcmV0dXJuIGlmXG4gKiB0aGUgY29uZGl0aW9uIGlzIHRydWUuIElmIGEgZnVuY3Rpb24sIHRoZSBjb25kaXRpb24gaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50LlxuICpcbiAqIEByZXR1cm5zIHthbnl9IFRoZSByZXN1bHQgb2YgdGhlIGB0aGVuYCBmdW5jdGlvbiBvciB0aGUgYHRoZW5gIHZhbHVlLCBiYXNlZFxuICogb24gdGhlIGNvbmRpdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcmVzdWx0ID0gaWZUaGVuKHRydWUsICgpID0+ICdZZXMnKVxuICogY29uc29sZS5sb2cocmVzdWx0KSAvLyBPdXRwdXRzOiAnWWVzJ1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IGlmVGhlbihmYWxzZSwgJ1llcycpXG4gKiBjb25zb2xlLmxvZyhyZXN1bHQpIC8vIE91dHB1dHM6IHVuZGVmaW5lZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaWZUaGVuKGNvbmRpdGlvbiwgdGhlbikge1xuICByZXR1cm4gaWZUaGVuRWxzZShjb25kaXRpb24sIHRoZW4pXG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYSBmdW5jdGlvbiBhbmQgY2F0Y2hlcyBhbnkgZXJyb3JzIHRoYXQgb2NjdXIsIG9wdGlvbmFsbHkgaGFuZGxpbmdcbiAqIHRoZW0gd2l0aCBhIHByb3ZpZGVkIGNhdGNoIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyeUZuIC0gVGhlIGZ1bmN0aW9uIHRvIGF0dGVtcHQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9uP30gW2NhdGNoRm5dIC0gVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBhbnkgZXJyb3JzIHRocm93blxuICogYnkgdHJ5Rm4uIFJlY2VpdmVzIHRoZSBlcnJvciBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gKiBAcGFyYW0ge2FueT99IFt0aGlzQXJnXSAtIFRoZSB2YWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gY2FsbGluZyB0cnlGblxuICogYW5kIGNhdGNoRm4uXG4gKiBAcGFyYW0ge2FueVtdP30gYXJncyAtIEFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIHBhc3MgdG8gdHJ5Rm4gYW5kIGNhdGNoRm4uXG4gKlxuICogQHJldHVybnMge2FueX0gVGhlIHJlc3VsdCBvZiB0cnlGbiBpZiBpdCBzdWNjZWVkcywgb3IgdGhlIHJlc3VsdCBvZiBjYXRjaEZuXG4gKiBpZiBhbiBlcnJvciBvY2N1cnMuIElmIGJvdGggZnVuY3Rpb25zIGZhaWwsIHJldHVybnMgdW5kZWZpbmVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiBmdW5jdGlvbiByaXNreU9wZXJhdGlvbigpIHtcbiAqICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHRocm93IG5ldyBFcnJvcignRmFpbGVkJylcbiAqICAgcmV0dXJuICdTdWNjZXNzJ1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIGhhbmRsZUZhaWx1cmUoZXJyb3IpIHtcbiAqICAgY29uc29sZS5lcnJvcignT3BlcmF0aW9uIGZhaWxlZDonLCBlcnJvcilcbiAqICAgcmV0dXJuICdEZWZhdWx0IHZhbHVlJ1xuICogfVxuICpcbiAqIGNvbnN0IHJlc3VsdCA9IHRyeUNhdGNoKHJpc2t5T3BlcmF0aW9uLCBoYW5kbGVGYWlsdXJlKVxuICogY29uc29sZS5sb2cocmVzdWx0KSAvLyBPdXRwdXRzOiAnU3VjY2Vzcycgb3IgJ0RlZmF1bHQgdmFsdWUnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnlDYXRjaCh0cnlGbiwgY2F0Y2hGbiwgdGhpc0FyZywgLi4uYXJncykge1xuICB0cnkge1xuICAgIGlmICh0cnlGbiAmJiB0eXBlb2YgdHJ5Rm4gPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdHJ5Rm4uYXBwbHkodGhpc0FyZywgLi4uYXJncylcbiAgfVxuICBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoY2F0Y2hGbiAmJiB0eXBlb2YgY2F0Y2hGbiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBjYXRjaEZuLmFwcGx5KHRoaXNBcmcsIFtlcnJvciwgLi4uYXJnc10pXG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkXG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uIGFuZCBjYXRjaGVzIGFueSBlcnJvcnMgdGhhdCBvY2N1cixcbiAqIG9wdGlvbmFsbHkgaGFuZGxpbmcgdGhlbSB3aXRoIGEgcHJvdmlkZWQgY2F0Y2ggZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJ5Rm4gLSBUaGUgYXN5bmNocm9ub3VzIGZ1bmN0aW9uIHRvIGF0dGVtcHQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9uP30gW2NhdGNoRm5dIC0gVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBhbnkgZXJyb3JzIHRocm93blxuICogYnkgdHJ5Rm4uIFJlY2VpdmVzIHRoZSBlcnJvciBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gKiBAcGFyYW0ge2FueT99IFt0aGlzQXJnXSAtIFRoZSB2YWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gY2FsbGluZyB0cnlGblxuICogYW5kIGNhdGNoRm4uXG4gKiBAcGFyYW0ge2FueVtdP30gYXJncyAtIEFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIHBhc3MgdG8gdHJ5Rm4gYW5kIGNhdGNoRm4uXG4gKlxuICogQHJldHVybnMge1Byb21pc2U8YW55Pn0gVGhlIHJlc3VsdCBvZiB0cnlGbiBpZiBpdCBzdWNjZWVkcywgb3IgdGhlIHJlc3VsdFxuICogb2YgY2F0Y2hGbiBpZiBhbiBlcnJvciBvY2N1cnMuIElmIGJvdGggZnVuY3Rpb25zIGZhaWwsIHJldHVybnMgdGhlIGVycm9yXG4gKiBmcm9tIHRyeUZuLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBJZiB3ZSBkb24ndCBjYXJlIGFib3V0IGNhdGNoaW5nXG4gKiBhc3luYyBmdW5jdGlvbiBmZXRjaERhdGEoKSB7XG4gKiAgIC8vIFNpbXVsYXRlIGEgZmV0Y2ggb3BlcmF0aW9uXG4gKiAgIHJldHVybiAnZGF0YSdcbiAqIH1cbiAqIGF3YWl0IGFzeW5jVHJ5Q2F0Y2goZmV0Y2hEYXRhKSAvLyByZWNlaXZlcyB1bmRlZmluZWQgaWYgaXQgZmFpbHNcbiAqXG4gKiBAZXhhbXBsZVxuICogYXN5bmMgZnVuY3Rpb24gZmV0Y2hEYXRhKCkge1xuICogICAvLyBTaW11bGF0ZSBhIGZldGNoIG9wZXJhdGlvblxuICogICByZXR1cm4gJ2RhdGEnXG4gKiB9XG4gKlxuICogYXN5bmMgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IpIHtcbiAqICAgY29uc29sZS5lcnJvcignRXJyb3Igb2NjdXJyZWQ6JywgZXJyb3IpXG4gKiAgIHJldHVybiAnZGVmYXVsdCBkYXRhJ1xuICogfVxuICpcbiAqIGFzeW5jVHJ5Q2F0Y2goZmV0Y2hEYXRhLCBoYW5kbGVFcnJvcikudGhlbihyZXN1bHQgPT4ge1xuICogICBjb25zb2xlLmxvZyhyZXN1bHQpIC8vIE91dHB1dHM6ICdkYXRhJyBvciAnZGVmYXVsdCBkYXRhJ1xuICogfSlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzeW5jVHJ5Q2F0Y2godHJ5Rm4sIGNhdGNoRm4sIHRoaXNBcmcsIC4uLmFyZ3MpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgdHJ5Rm4/LmFwcGx5KHRoaXNBcmcsIC4uLmFyZ3MpXG4gIH1cbiAgY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGNhdGNoRm4gJiYgdHlwZW9mIGNhdGNoRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBjYXRjaEZuLmFwcGx5KHRoaXNBcmcsIFtlcnJvciwgLi4uYXJnc10pXG4gICAgICB9XG4gICAgICBjYXRjaCAoaWdub3JlZCkgeyByZXR1cm4gZXJyb3IgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWRcbn1cblxuLyoqXG4gKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBzdXBwbGllZCB2YWx1ZSBpcyBjb21wYXRpYmxlIHdpdGggb3V0cHV0IGZyb20gbm9kZSdzXG4gKiBwYXRoLnBhcnNlKCkgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHthbnl9IHZhbHVlIGFueSBKYXZhU2NyaXB0IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzdXBwbGllZCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZXhwZWN0ZWQga2V5cyBvZlxuICogYSByZXN1bHQgZnJvbSBhIGNhbGwgdG8gbm9kZSdzIGBub2RlOnBhdGhgIGBwYXJzZSgpYCBmdW5jdGlvbiBjYWxsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQYXJzZWRQYXRoKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgLy8gSXMgdHJ1dGh5XG4gICAgdmFsdWUgJiZcblxuICAgIC8vIElzIG9mIHR5cGUgb2JqZWN0IG9yIGFuIGluc3RhbmNlb2YgT2JqZWN0XG4gICAgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpICYmXG5cbiAgICAvLyBDb250YWlucyB0aGUgZXhwZWN0ZWQga2V5cyBvZiBhIHBhcnNlZCBwYXRoIG9iamVjdCByZXN1bHRcbiAgICBbJ3Jvb3QnLCAnZGlyJywgJ2Jhc2UnLCAnZXh0JywgJ25hbWUnXS5ldmVyeShcbiAgICAgIGtleSA9PiBSZWZsZWN0Lmhhcyh2YWx1ZSwga2V5KVxuICAgIClcbiAgKVxufVxuXG4vKipcbiAqIFNob3J0aGFuZCBsb2dpYyB0byBydW4gYSBmdW5jdGlvbiBvciByZXR1cm4gYSB2YWx1ZSBpZiBgdmFsdWVgIGlzIGNvbXBhdGlibGVcbiAqIHdpdGggbm9kZSdzIHBhdGgucGFyc2UoKSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge2FueX0gdmFsdWUgdGhlIHZhbHVlIHRvIGNoZWNrIGZvciBwYXRoLnBhcnNlKCkgZXF1aXZhbGVuY3lcbiAqIEBwYXJhbSB7ZnVuY3Rpb258YW55fSB0aGVuIGEgZnVuY3Rpb24gb3Igbm9uLXVuZGVmaW5lZCB2YWx1ZSB0byByZXR1cm5cbiAqIGluIHRoZSBjYXNlIHRoYXQgYHZhbHVlYCBpcyBwYXRoLnBhcnNlKCkgb3V0cHV0IGNvbXBhdGlibGUuIElmIGB0aGVuYCBpc1xuICogYSBmdW5jdGlvbiwgYHZhbHVlYCBpcyBwYXNzZWQgdG8gaXQgYW5kIGl0cyByZXN1bHQgaXMgcmV0dXJuZWQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufGFueX0gb3RoZXJ3aXNlIGlmIGB2YWx1ZWAgaXMgbm90IHBhdGgucGFyc2UoKSBvdXRwdXRcbiAqIGNvbXBhdGlibGUsIGBvdGhlcndpc2VgIGlzIHJldHVybmVkIHVubGVzcyBpdCdzIGEgZnVuY3Rpb24gaW4gd2hpY2ggY2FzZVxuICogYHZhbHVlYCBpcyBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uIGFuZCB0aGUgcmVzdWx0IG9mIHRoZSBjYWxsIGlzIHJldHVybmVkLlxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlmUGFyc2VkUGF0aChcbiAgdmFsdWUsXG4gIHRoZW4gPSAocGFyc2VkKSA9PiBmb3JtYXQocGFyc2VkKSxcbiAgb3RoZXJ3aXNlXG4pIHtcbiAgcmV0dXJuIGlmVGhlbkVsc2UoaXNQYXJzZWRQYXRoKHZhbHVlKSwgdGhlbiwgb3RoZXJ3aXNlLCB1bmRlZmluZWQsIHZhbHVlKVxufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU0EsVUFBVUEsQ0FBQ0MsU0FBUyxFQUFF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
//# sourceMappingURL=conditionals.js.map