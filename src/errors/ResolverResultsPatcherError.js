// @ts-check

import { inline, dropLowest } from 'ne-tag-fns'
import BaseError from './BaseError.js'
import { inspect } from 'util'

import type { ResolverResultsPatcher } from '../types'

const isFn = o => /Function\]/.test(Object.prototype.toString.call(o))

/**
 * The `ResolverResultsPatcherError` can occur as the `ExtendedResolver` is
 * finishing and the final results are passed to a patcher function for final
 * inspection or modification. If an error is thrown at this time, the values
 * passed to the function are captured here for review by the programmer using
 * them
 *
 * @class ResolverResultsPatcherError
 */
export class ResolverResultsPatcherError extends BaseError {
  /**
   * The `ResolverResultsPatcher` function that failed.
   *
   * @type {ResolverResultsPatcher}
   */
  patcher;

  /**
   * The `this` value passed to the function as it was executed. Note that
   * this value is irrelevant if the function passed was a big arrow function
   *
   * @type {unknown}
   */
  context;

  /**
   * The `results` value before the internal patcher that failed was thrown.
   * This does not include the results of the erroring function in question as
   * no value was ever reached before the exception was thrown (in theory)
   *
   * @type {unknown}
   */
  results;

  /**
   * Creates a new instance of `ResolverResultsPatcherError`.
   *
   * @constructor
   *
   * @param {string|Error} error the actual thrown error or error message
   * @param {ResolverResultsPatcher} patcher the function called during the
   * time of the error
   * @param {unknown} context the `this` arg applied to the call when the error
   * occurred; use `resolverResultsPatcherError.wasBigArrowFunction` to check
   * if the `this` arg would have had any results
   * @param {unknown} results the final results from the `ExtendedResolver`
   * execution that were passed to the patcher function
   */
  constructor(error, patcher, context, results) {
    super(error)

    this.patcher = patcher
    this.context = context
    this.results = results
  }

  /**
   * Description of the ResolverResultsPatcherError error and likely cause
   * and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */
  toString() {
    return dropLowest`
      The patcher function failed to execute against the results of the
      'ExtendedResolver' execution. The patcher function had a name of
      '${this.patcher && this.patcher.name || null}'.

      The context of the patcher was:
      ${inspect(this.context, {colors: true, depth: 8})}

      The results passed to the function were:
      ${inspect(this.results, {colors: true, depth: 8})}

      Original Stack Trace
      ${this.error.toString()}

    `
  }

  /**
   * Modify the `valueOf()` function to mirror the `toString()` functionality
   *
   * @return {string} an identical string to `.toString()`
   */
  valueOf() {
    return this.toString()
  }

  /**
   * A programmatic attempt to determine if the function that failed was a
   * big arrow function. This means the function was pre-bound and the
   * `context` set at the time of execution would have been ignored.
   *
   * @function wasBigArrowFunction
   *
   * @return {boolean} true if the failed function was a big arrow or
   * pre-bound function; false if the `context` value should have been passed
   * successfully to the execution context
   */
  get wasBigArrowFunction() {
    const patcher = this.patcher

    if (patcher && isFn(patcher)) {
      return typeof patcher.prototype === 'undefined'
    }

    return false
  }
}

export default ResolverResultsPatcherError
