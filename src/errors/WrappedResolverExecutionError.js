// @ts-check

import { inline, dropLowest } from 'ne-tag-fns'
import BaseError from './BaseError.js'
import { inspect } from 'util'

const isFn = (o) => /Function\]/.test(Object.prototype.toString.call(o))

/**
 * ExtendedResolvers wrap several functions including the original GraphQL
 * field resolver itself. If an exception is thrown by any of the internal
 * methods, this error can help resolve those problems.
 *
 * @class WrappedResolverExecutionError
 */
export class WrappedResolverExecutionError extends BaseError {
  /**
   * The `ExtendedResolver` object that caused the issue
   *
   * @type {ExtendedResolver}
   */
  resolver: ExtendedResolver

  /**
   * The index of the function that failed. This will help the programmer
   * determine the function that caused the error.
   *
   * @type {number}
   */
  index;

  /**
   * The arguments passed to the function in question that failed.
   *
   * @type {unknown[]}
   */
  args;

  /**
   * The `this` value passed to the function as it was executed. Note that
   * this value is irrelevant if the function passed was a big arrow function
   *
   * @type {unknown}
   */
  context;

  /**
   * The `results` value before the internal resolver that failed was thrown.
   * This does not include the results of the erroring function in question as
   * no value was ever reached before the exception was thrown (in theory)
   *
   * @type {unknown}
   */
  results

  /**
   * Creates a new error instance of `WrappedResolverExecutionError`. The
   * arguments resolver, index, args and context all help the programmer
   * debug the issue in question should the error be thrown.
   *
   * @method constructor
   *
   * @param {Error|string} error the error thrown at the time of the problem
   * @param {ExtendedResolver} resolver the `ExtendedResolver` instance
   * @param {number} index the index of the wrapped resolver that threw up
   * @param {unknown[]} args the arguments passed to the function at the time
   * @param {unknown} context the `thisArg` set on the function call at the time
   * @param {unknown} results the results up to the time of failure
   */
  constructor(error, resolver, index, args, context, results) {
    super(error)

    this.resolver = resolver
    this.index = index
    this.args = args
    this.context = context
    this.results = results
  }

  /**
   * Description of the WrappedResolverExecutionError error and likely cause
   * and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */
  toString() {
    let fn: Function = (
      this.resolver &&
      this.resolver.order &&
      this.resolver.order[this.index]
    )

    return dropLowest`
      The ExtendedResolver execution failed. The resolver that failed was at
      index ${this.index}. The function had a name of '${fn && fn.name}'.

      Was the function likely a big arrow function? ${
        (this.wasBigArrowFunction
          ? '\x1b[33mtrue\x1b[0m'
          : '\x1b[31mfalse\x1b[0m'
        )
      }

      Arguments at the time were:
      ${inspect(this.args, {colors: true, depth: 8})}

      Context at the time was:
      ${inspect(this.context, {colors: true, depth: 8})}

      Results before the function was called
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
   * @type {boolean}
   */
  get wasBigArrowFunction() {
    const resolver = (
      this.resolver &&
      this.resolver.order &&
      this.resolver.order[this.index]
    )

    if (resolver && isFn(resolver)) {
      return typeof resolver.prototype === 'undefined'
    }

    return false
  }
}

export default WrappedResolverExecutionError
