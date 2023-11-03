// @flow

import BaseError from '../BaseError';
/**
 * The InvalidPathError class represents an error that occurs when an invalid
 * path is provided to the `at` or `atNicely` functions. This error provides
 * details about the path that caused the error.
 */
export class InvalidPathError extends BaseError {
  path: string | Array<string>;

  constructor(path: string | Array<string>, message?: string) {
    super(message || `Invalid path: ${Array.isArray(path) ? path.join('.') : path}`)
    this.path = path
  }

  toString() {
    return (
      `${this.constructor.name}: ${this.message} (path: ` +
      `${Array.isArray(this.path) ? this.path.join('.') : this.path})`
    )
  }
}

export default {
  InvalidPathError
}
