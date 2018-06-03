'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResolverMapStumble = undefined;

var _neTagFns = require('ne-tag-fns');

var _BaseError = require('../BaseError');

/**
 * An error that can occur while walking a resolver map. ResolverMap types
 * are defined as `ResolverMap = { [name: string]: Function | ResolverMap }`.
 *
 * When a non-function and non-string based key are found, an error of this
 * type may be thrown based on walking parameters.
 *
 * @class ResolverMapStumble
 */
class ResolverMapStumble extends _BaseError.BaseError {
  /**
   * Description of the ResolverMapStumble error and likely cause and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */
  toString() {
    return _neTagFns.inline`
      This Error represents a scenario wherein while walking a resolver map
      object, a key was found not to point to either a nested resolver map or
      a resolver function. This is not allowed.
    `;
  }
}

exports.ResolverMapStumble = ResolverMapStumble;
exports.default = ResolverMapStumble;
//# sourceMappingURL=ResolverMapStumble.js.map