'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseError = undefined;

var _neTagFns = require('ne-tag-fns');

var _util = require('util');

/**
 * The BaseError class provides a simply stock way to wrap errors in a more
 * concise error type for use within the project. All normal error fields are
 * passed through to the wrapped error class if the default error contains
 * the requested property; failing that, it is passed on to the subclass.
 *
 * It is highly recommended
 */
class BaseError extends Error {

  /**
   * Creates a new BaseError type that wraps either an existing error or 
   * uses this error instantiation with the given error message. 
   * 
   * @constructor
   */
  constructor(error) {
    super(error.message || error, error.fileName, error.lineNumber);

    this.error = error instanceof String ? this : error;

    if (this.toString === Error.prototype.toString) {
      console.error(_neTagFns.inline`
        Class \`${this.constructor.name}\` does not correctly implement or
        override the \`toString()\` function in order to describe the cause
        of this named error. Please remedy this.
      `);
    }

    if (_util.inspect.custom) {
      this[_util.inspect.custom] = (depth, options) => this.toString();
    } else {
      this.inspect = (depth, options) => this.toString();
    }

    return new Proxy(this, {
      get(target, property, receiver) {
        if (this.error && this.error.hasOwnProperty(property)) {
          return this.error[property];
        } else {
          return Reflect.get(target, property, receiver);
        }
      }
    });
  }

  /**
   * All BaseError children will show `[object <class name>]` as their internal 
   * class naming when used with `Object.prototype.toString.call` or `apply`.
   * 
   * @type {String}
   */

  /**
   * The error this error wraps.
   *
   * @type {Error}
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}

exports.BaseError = BaseError;
exports.default = BaseError;
//# sourceMappingURL=BaseError.js.map