// @flow

import { inline } from 'ne-tag-fns'

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
export class BaseError extends Error {
  /**
   * The error this error wraps.
   *
   * @type {Error}
   */
  error: Error

  constructor(error: Error | string) {
    super(error.message || error, error.fileName, error.lineNumber)

    this.error = error instanceof String ? this : error

    if (this.toString === Error.prototype.toString) {
      console.error(inline`
        Class \`${this.constructor.name}\` does not correctly implement or
        override the \`toString()\` function in order to describe the cause
        of this named error. Please remedy this.
      `)
    }

    return new Proxy(this, {
      get(target, property, receiver) {
        if (this.error.hasOwnProperty(property)) {
          return this.error[property]
        }
        else {
          return Reflect.get(target, property, receiver)
        }
      }
    })
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
}

export default BaseError
