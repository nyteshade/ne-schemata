// @flow

import { inline } from 'ne-tag-fns'
import { BaseError } from '../BaseError'

/**
 * An error that can occur while walking a resolver map. ResolverMap types
 * are defined as `ResolverMap = { [name: string]: Function | ResolverMap }`.
 *
 * When a non-function and non-string based key are found, an error of this
 * type may be thrown based on walking parameters.
 *
 * @class ResolverMapStumble
 */
export class ResolverMapStumble extends BaseError {
  /** A context object can be anything that adds more info about the problem */
  context: any

  /**
   * Creates a new instance of ResolverMapStumble
   *
   * @param {Error|string} error - the error or message to wrap this instance
   * around
   * @param {any} context - any additional information that helps describe or
   * provide enlightenment around the problem at hand.
   */
  constructor(error: Error | string, context?: any) {
    super(error)
    if (context) {
      this.context = context
    }
  }

  /**
   * Description of the ResolverMapStumble error and likely cause and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */
  toString(): string {
    return inline`
      This Error represents a scenario wherein while walking a resolver map
      object, a key was found not to point to either a nested resolver map or
      a resolver function. This is not allowed.
    `
  }
}

export default ResolverMapStumble
