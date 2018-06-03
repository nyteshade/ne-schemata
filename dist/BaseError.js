'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseError = undefined;

var _neTagFns = require('ne-tag-fns');

/**
 * The BaseError class provides a simply stock way to wrap errors in a more
 * concise error type for use within the project. All normal error fields are
 * passed through to the wrapped error class if the default error contains
 * the requested property; failing that, it is passed on to the subclass.
 *
 * It is highly recommended
 *
 * @type {[type]}
 */
class BaseError extends Error {

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

    return new Proxy(this, {
      get(target, property, receiver) {
        if (this.error.hasOwnProperty(property)) {
          return this.error[property];
        } else {
          return Reflect.get(target, property, receiver);
        }
      }
    });
  }
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