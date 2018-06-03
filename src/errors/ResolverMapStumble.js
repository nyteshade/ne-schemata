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
