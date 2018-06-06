'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrappedResolverExecutionError = undefined;

var _neTagFns = require('ne-tag-fns');

var _BaseError = require('../BaseError');

const isFn = o => /Function\]/.test(Object.prototype.toString.call(o));

/**
 * ExtendedResolvers wrap several functions including the original GraphQL
 * field resolver itself. If an exception is thrown by any of the internal
 * methods, this error can help resolve those problems.
 *
 * @class WrappedResolverExecutionError
 */
class WrappedResolverExecutionError extends _BaseError.BaseError {

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
   * @param {Array<mixed>} args the arguments passed to the function at the time
   * @param {mixed} context the `thisArg` set on the function call at the time
   * @param {mixed} results the results up to the time of failure
   */


  /**
   * The `this` value passed to the function as it was executed. Note that
   * this value is irrelevant if the function passed was a big arrow function
   *
   * @type {mixed}
   */


  /**
   * The index of the function that failed. This will help the programmer
   * determine the function that caused the error.
   *
   * @type {number}
   */
  constructor(error, resolver, index, args, context, results) {
    super(error);

    this.resolver = resolver;
    this.index = index;
    this.args = args;
    this.context = context;
    this.results = results;
  }

  /**
   * Description of the WrappedResolverExecutionError error and likely cause
   * and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */


  /**
   * The `results` value before the internal resolver that failed was thrown.
   * This does not include the results of the erroring function in question as
   * no value was ever reached before the exception was thrown (in theory)
   *
   * @type {mixed}
   */


  /**
   * The arguments passed to the function in question that failed.
   *
   * @type {Array<mixed>}
   */

  /**
   * The `ExtendedResolver` object that caused the issue
   *
   * @type {ExtendedResolver}
   */
  toString() {
    let fn = this.resolver && this.resolver.order[this.index];

    return _neTagFns.dropLowest`
      The ExtendedResolver execution failed. The resolver that failed was at
      index ${this.index}. The function had a name of '${fn.name}'.

      Was the function likely a big arrow function? ${this.wasBigArrowFunction}

      Arguments at the time were:
      ${this.args}

      Context at the time was:
      ${this.context}

      Results before the function was called
      ${this.results}
    `;
  }

  /**
   * A programmatic attempt to determine if the function that failed was a
   * big arrow function. This means the function was pre-bound and the
   * `context` set at the time of execution would have been ignored.
   *
   * @function wasBigArrowFunction
   *
   * @return {boolean} true if the failed function resolver was a big arrow or
   * pre-bound function; false if the `context` value should have been passed
   * successfully to the execution context
   */
  get wasBigArrowFunction() {
    const resolver = this.resolver && this.resolver.listing[this.index];

    if (resolver && isFn(resolver)) {
      return typeof resolver.prototype === 'undefined';
    }

    return false;
  }
}

exports.WrappedResolverExecutionError = WrappedResolverExecutionError;
exports.default = WrappedResolverExecutionError;
//# sourceMappingURL=WrappedResolverExecutionError.js.map