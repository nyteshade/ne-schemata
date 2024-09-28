// @ts-check

import BaseError from './BaseError.js';

/**
 * The InvalidObjectError class represents an error that occurs when a non-object
 * value is provided as the target object to the `at` or `atNicely` functions.
 * This error provides details about the type of the value that caused the error.
 */
export class InvalidObjectError extends BaseError {
  /** @type {string} */
  valueType;

  /**
   * Creates a new `InvalidObjectError` instance.
   *
   * @param {string} valueType the type of object incorrectly received
   * @param {string?} message an optional message instead of the default which
   * indicates the type of value incorrectly received.
   */
  constructor(valueType, message) {
    super(message || `Invalid object: Received type ${valueType}`);
    this.valueType = valueType;
  }

  /**
   * A nicely formatted variant of this error instance.
   *
   * @returns {string}
   */
  toString() {
    return `${this.constructor.name}: ${this.message} (type: ${this.valueType})`;
  }
}

export default InvalidObjectError
