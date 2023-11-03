// @flow

import BaseError from '../BaseError';

/**
 * The InvalidObjectError class represents an error that occurs when a non-object
 * value is provided as the target object to the `at` or `atNicely` functions.
 * This error provides details about the type of the value that caused the error.
 */
export class InvalidObjectError extends BaseError {
  valueType: string;

  constructor(valueType: string, message?: string) {
    super(message || `Invalid object: Received type ${valueType}`);
    this.valueType = valueType;
  }

  toString() {
    return `${this.constructor.name}: ${this.message} (type: ${this.valueType})`;
  }
}

export default {
  InvalidObjectError
}
