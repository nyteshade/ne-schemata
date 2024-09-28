"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ResolverMapStumble = void 0;
var _neTagFns = require("ne-tag-fns");
var _BaseError = _interopRequireDefault(require("./BaseError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// @ts-check

/**
 * An error that can occur while walking a resolver map. ResolverMap types
 * are defined as `ResolverMap = { [name: string]: Function | ResolverMap }`.
 *
 * When a non-function and non-string based key are found, an error of this
 * type may be thrown based on walking parameters.
 *
 * @class ResolverMapStumble
 */
class ResolverMapStumble extends _BaseError.default {
  /**
   * A context object can be anything that adds more info about the problem
   *
   * @type {any}
   */

  /**
   * Creates a new instance of ResolverMapStumble
   *
   * @param {Error|string} error - the error or message to wrap this instance
   * around
   * @param {any?} context - any additional information that helps describe or
   * provide enlightenment around the problem at hand.
   */
  constructor(error, context) {
    super(error);
    if (context) {
      this.context = context;
    }
  }

  /**
   * Description of the ResolverMapStumble error and likely cause and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */
  toString() {
    return (0, _neTagFns.inline)`
      This Error represents a scenario wherein while walking a resolver map
      object, a key was found not to point to either a nested resolver map or
      a resolver function. This is not allowed.
    `;
  }
}
exports.ResolverMapStumble = ResolverMapStumble;
var _default = exports.default = ResolverMapStumble;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbmVUYWdGbnMiLCJyZXF1aXJlIiwiX0Jhc2VFcnJvciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJSZXNvbHZlck1hcFN0dW1ibGUiLCJCYXNlRXJyb3IiLCJjb25zdHJ1Y3RvciIsImVycm9yIiwiY29udGV4dCIsInRvU3RyaW5nIiwiaW5saW5lIiwiZXhwb3J0cyIsIl9kZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9SZXNvbHZlck1hcFN0dW1ibGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCB7IGlubGluZSB9IGZyb20gJ25lLXRhZy1mbnMnXG5pbXBvcnQgQmFzZUVycm9yIGZyb20gJy4vQmFzZUVycm9yLmpzJztcblxuLyoqXG4gKiBBbiBlcnJvciB0aGF0IGNhbiBvY2N1ciB3aGlsZSB3YWxraW5nIGEgcmVzb2x2ZXIgbWFwLiBSZXNvbHZlck1hcCB0eXBlc1xuICogYXJlIGRlZmluZWQgYXMgYFJlc29sdmVyTWFwID0geyBbbmFtZTogc3RyaW5nXTogRnVuY3Rpb24gfCBSZXNvbHZlck1hcCB9YC5cbiAqXG4gKiBXaGVuIGEgbm9uLWZ1bmN0aW9uIGFuZCBub24tc3RyaW5nIGJhc2VkIGtleSBhcmUgZm91bmQsIGFuIGVycm9yIG9mIHRoaXNcbiAqIHR5cGUgbWF5IGJlIHRocm93biBiYXNlZCBvbiB3YWxraW5nIHBhcmFtZXRlcnMuXG4gKlxuICogQGNsYXNzIFJlc29sdmVyTWFwU3R1bWJsZVxuICovXG5leHBvcnQgY2xhc3MgUmVzb2x2ZXJNYXBTdHVtYmxlIGV4dGVuZHMgQmFzZUVycm9yIHtcbiAgLyoqXG4gICAqIEEgY29udGV4dCBvYmplY3QgY2FuIGJlIGFueXRoaW5nIHRoYXQgYWRkcyBtb3JlIGluZm8gYWJvdXQgdGhlIHByb2JsZW1cbiAgICpcbiAgICogQHR5cGUge2FueX1cbiAgICovXG4gIGNvbnRleHQ7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgUmVzb2x2ZXJNYXBTdHVtYmxlXG4gICAqXG4gICAqIEBwYXJhbSB7RXJyb3J8c3RyaW5nfSBlcnJvciAtIHRoZSBlcnJvciBvciBtZXNzYWdlIHRvIHdyYXAgdGhpcyBpbnN0YW5jZVxuICAgKiBhcm91bmRcbiAgICogQHBhcmFtIHthbnk/fSBjb250ZXh0IC0gYW55IGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gdGhhdCBoZWxwcyBkZXNjcmliZSBvclxuICAgKiBwcm92aWRlIGVubGlnaHRlbm1lbnQgYXJvdW5kIHRoZSBwcm9ibGVtIGF0IGhhbmQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvciwgY29udGV4dCkge1xuICAgIHN1cGVyKGVycm9yKVxuICAgIGlmIChjb250ZXh0KSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc2NyaXB0aW9uIG9mIHRoZSBSZXNvbHZlck1hcFN0dW1ibGUgZXJyb3IgYW5kIGxpa2VseSBjYXVzZSBhbmQgZml4LlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGEgc3RyaW5nIGRlbm90aW5nIHRoZSBwdXJwb3NlL2NhdXNlIG9mIHRoaXMgZXJyb3IgY2xhc3NcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBpbmxpbmVgXG4gICAgICBUaGlzIEVycm9yIHJlcHJlc2VudHMgYSBzY2VuYXJpbyB3aGVyZWluIHdoaWxlIHdhbGtpbmcgYSByZXNvbHZlciBtYXBcbiAgICAgIG9iamVjdCwgYSBrZXkgd2FzIGZvdW5kIG5vdCB0byBwb2ludCB0byBlaXRoZXIgYSBuZXN0ZWQgcmVzb2x2ZXIgbWFwIG9yXG4gICAgICBhIHJlc29sdmVyIGZ1bmN0aW9uLiBUaGlzIGlzIG5vdCBhbGxvd2VkLlxuICAgIGBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvbHZlck1hcFN0dW1ibGVcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBQUEsU0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsVUFBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQXVDLFNBQUFFLHVCQUFBQyxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBSHZDOztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1HLGtCQUFrQixTQUFTQyxrQkFBUyxDQUFDO0VBQ2hEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0VBR0U7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFQyxXQUFXQSxDQUFDQyxLQUFLLEVBQUVDLE9BQU8sRUFBRTtJQUMxQixLQUFLLENBQUNELEtBQUssQ0FBQztJQUNaLElBQUlDLE9BQU8sRUFBRTtNQUNYLElBQUksQ0FBQ0EsT0FBTyxHQUFHQSxPQUFPO0lBQ3hCO0VBQ0Y7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUNFQyxRQUFRQSxDQUFBLEVBQUc7SUFDVCxPQUFPLElBQUFDLGdCQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7RUFDSDtBQUNGO0FBQUNDLE9BQUEsQ0FBQVAsa0JBQUEsR0FBQUEsa0JBQUE7QUFBQSxJQUFBUSxRQUFBLEdBQUFELE9BQUEsQ0FBQVIsT0FBQSxHQUVjQyxrQkFBa0IiLCJpZ25vcmVMaXN0IjpbXX0=
//# sourceMappingURL=ResolverMapStumble.js.map