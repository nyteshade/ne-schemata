// @ts-check

import BaseError from './BaseError.js';

/**
 * The InvalidPathError class represents an error that occurs when an invalid
 * path is provided to the `at` or `atNicely` functions. This error provides
 * details about the path that caused the error.
 */
export class InvalidPathError extends BaseError {
  /** @type {string|string[]} */
  path;

  /**
   * Creates a new instance of `InvalidPathError` for when an invalid path or
   * paths were supplied
   *
   * @param {string|string[]} path the invalid paths supplied
   * @param {string?} message an optional error message to replace the default
   */
  constructor(path, message) {
    super(
      message ??
      `Invalid path: ${Array.isArray(path) ? path.join('.') : path}`
    )
    this.path = path
  }

  /**
   * @returns {string} a nicely formatted string variant of this error instance
   */
  toString() {
    return (
      `${this.constructor.name}: ${this.message} (path: ` +
      `${Array.isArray(this.path) ? this.path.join('.') : this.path})`
    )
  }
}

export default InvalidPathError
