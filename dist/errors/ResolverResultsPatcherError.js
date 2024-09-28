"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ResolverResultsPatcherError = void 0;
var _neTagFns = require("ne-tag-fns");
var _BaseError = _interopRequireDefault(require("./BaseError.js"));
var _util = require("util");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// @ts-check

const isFn = o => /Function\]/.test(Object.prototype.toString.call(o));

/**
 * The `ResolverResultsPatcherError` can occur as the `ExtendedResolver` is
 * finishing and the final results are passed to a patcher function for final
 * inspection or modification. If an error is thrown at this time, the values
 * passed to the function are captured here for review by the programmer using
 * them
 *
 * @class ResolverResultsPatcherError
 */
class ResolverResultsPatcherError extends _BaseError.default {
  /**
   * The `ResolverResultsPatcher` function that failed.
   *
   * @type {ResolverResultsPatcher}
   */

  /**
   * The `this` value passed to the function as it was executed. Note that
   * this value is irrelevant if the function passed was a big arrow function
   *
   * @type {unknown}
   */

  /**
   * The `results` value before the internal patcher that failed was thrown.
   * This does not include the results of the erroring function in question as
   * no value was ever reached before the exception was thrown (in theory)
   *
   * @type {unknown}
   */

  /**
   * Creates a new instance of `ResolverResultsPatcherError`.
   *
   * @constructor
   *
   * @param {string|Error} error the actual thrown error or error message
   * @param {ResolverResultsPatcher} patcher the function called during the
   * time of the error
   * @param {unknown} context the `this` arg applied to the call when the error
   * occurred; use `resolverResultsPatcherError.wasBigArrowFunction` to check
   * if the `this` arg would have had any results
   * @param {unknown} results the final results from the `ExtendedResolver`
   * execution that were passed to the patcher function
   */
  constructor(error, patcher, context, results) {
    super(error);
    this.patcher = patcher;
    this.context = context;
    this.results = results;
  }

  /**
   * Description of the ResolverResultsPatcherError error and likely cause
   * and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */
  toString() {
    return (0, _neTagFns.dropLowest)`
      The patcher function failed to execute against the results of the
      'ExtendedResolver' execution. The patcher function had a name of
      '${this.patcher && this.patcher.name || null}'.

      The context of the patcher was:
      ${(0, _util.inspect)(this.context, {
      colors: true,
      depth: 8
    })}

      The results passed to the function were:
      ${(0, _util.inspect)(this.results, {
      colors: true,
      depth: 8
    })}

      Original Stack Trace
      ${this.error.toString()}

    `;
  }

  /**
   * Modify the `valueOf()` function to mirror the `toString()` functionality
   *
   * @return {string} an identical string to `.toString()`
   */
  valueOf() {
    return this.toString();
  }

  /**
   * A programmatic attempt to determine if the function that failed was a
   * big arrow function. This means the function was pre-bound and the
   * `context` set at the time of execution would have been ignored.
   *
   * @function wasBigArrowFunction
   *
   * @return {boolean} true if the failed function was a big arrow or
   * pre-bound function; false if the `context` value should have been passed
   * successfully to the execution context
   */
  get wasBigArrowFunction() {
    const patcher = this.patcher;
    if (patcher && isFn(patcher)) {
      return typeof patcher.prototype === 'undefined';
    }
    return false;
  }
}
exports.ResolverResultsPatcherError = ResolverResultsPatcherError;
var _default = exports.default = ResolverResultsPatcherError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbmVUYWdGbnMiLCJyZXF1aXJlIiwiX0Jhc2VFcnJvciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfdXRpbCIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImlzRm4iLCJvIiwidGVzdCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIlJlc29sdmVyUmVzdWx0c1BhdGNoZXJFcnJvciIsIkJhc2VFcnJvciIsImNvbnN0cnVjdG9yIiwiZXJyb3IiLCJwYXRjaGVyIiwiY29udGV4dCIsInJlc3VsdHMiLCJkcm9wTG93ZXN0IiwibmFtZSIsImluc3BlY3QiLCJjb2xvcnMiLCJkZXB0aCIsInZhbHVlT2YiLCJ3YXNCaWdBcnJvd0Z1bmN0aW9uIiwiZXhwb3J0cyIsIl9kZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9SZXNvbHZlclJlc3VsdHNQYXRjaGVyRXJyb3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCB7IGlubGluZSwgZHJvcExvd2VzdCB9IGZyb20gJ25lLXRhZy1mbnMnXG5pbXBvcnQgQmFzZUVycm9yIGZyb20gJy4vQmFzZUVycm9yLmpzJ1xuaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnXG5cbmltcG9ydCB0eXBlIHsgUmVzb2x2ZXJSZXN1bHRzUGF0Y2hlciB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jb25zdCBpc0ZuID0gbyA9PiAvRnVuY3Rpb25cXF0vLnRlc3QoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pKVxuXG4vKipcbiAqIFRoZSBgUmVzb2x2ZXJSZXN1bHRzUGF0Y2hlckVycm9yYCBjYW4gb2NjdXIgYXMgdGhlIGBFeHRlbmRlZFJlc29sdmVyYCBpc1xuICogZmluaXNoaW5nIGFuZCB0aGUgZmluYWwgcmVzdWx0cyBhcmUgcGFzc2VkIHRvIGEgcGF0Y2hlciBmdW5jdGlvbiBmb3IgZmluYWxcbiAqIGluc3BlY3Rpb24gb3IgbW9kaWZpY2F0aW9uLiBJZiBhbiBlcnJvciBpcyB0aHJvd24gYXQgdGhpcyB0aW1lLCB0aGUgdmFsdWVzXG4gKiBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uIGFyZSBjYXB0dXJlZCBoZXJlIGZvciByZXZpZXcgYnkgdGhlIHByb2dyYW1tZXIgdXNpbmdcbiAqIHRoZW1cbiAqXG4gKiBAY2xhc3MgUmVzb2x2ZXJSZXN1bHRzUGF0Y2hlckVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNvbHZlclJlc3VsdHNQYXRjaGVyRXJyb3IgZXh0ZW5kcyBCYXNlRXJyb3Ige1xuICAvKipcbiAgICogVGhlIGBSZXNvbHZlclJlc3VsdHNQYXRjaGVyYCBmdW5jdGlvbiB0aGF0IGZhaWxlZC5cbiAgICpcbiAgICogQHR5cGUge1Jlc29sdmVyUmVzdWx0c1BhdGNoZXJ9XG4gICAqL1xuICBwYXRjaGVyO1xuXG4gIC8qKlxuICAgKiBUaGUgYHRoaXNgIHZhbHVlIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24gYXMgaXQgd2FzIGV4ZWN1dGVkLiBOb3RlIHRoYXRcbiAgICogdGhpcyB2YWx1ZSBpcyBpcnJlbGV2YW50IGlmIHRoZSBmdW5jdGlvbiBwYXNzZWQgd2FzIGEgYmlnIGFycm93IGZ1bmN0aW9uXG4gICAqXG4gICAqIEB0eXBlIHt1bmtub3dufVxuICAgKi9cbiAgY29udGV4dDtcblxuICAvKipcbiAgICogVGhlIGByZXN1bHRzYCB2YWx1ZSBiZWZvcmUgdGhlIGludGVybmFsIHBhdGNoZXIgdGhhdCBmYWlsZWQgd2FzIHRocm93bi5cbiAgICogVGhpcyBkb2VzIG5vdCBpbmNsdWRlIHRoZSByZXN1bHRzIG9mIHRoZSBlcnJvcmluZyBmdW5jdGlvbiBpbiBxdWVzdGlvbiBhc1xuICAgKiBubyB2YWx1ZSB3YXMgZXZlciByZWFjaGVkIGJlZm9yZSB0aGUgZXhjZXB0aW9uIHdhcyB0aHJvd24gKGluIHRoZW9yeSlcbiAgICpcbiAgICogQHR5cGUge3Vua25vd259XG4gICAqL1xuICByZXN1bHRzO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGBSZXNvbHZlclJlc3VsdHNQYXRjaGVyRXJyb3JgLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8RXJyb3J9IGVycm9yIHRoZSBhY3R1YWwgdGhyb3duIGVycm9yIG9yIGVycm9yIG1lc3NhZ2VcbiAgICogQHBhcmFtIHtSZXNvbHZlclJlc3VsdHNQYXRjaGVyfSBwYXRjaGVyIHRoZSBmdW5jdGlvbiBjYWxsZWQgZHVyaW5nIHRoZVxuICAgKiB0aW1lIG9mIHRoZSBlcnJvclxuICAgKiBAcGFyYW0ge3Vua25vd259IGNvbnRleHQgdGhlIGB0aGlzYCBhcmcgYXBwbGllZCB0byB0aGUgY2FsbCB3aGVuIHRoZSBlcnJvclxuICAgKiBvY2N1cnJlZDsgdXNlIGByZXNvbHZlclJlc3VsdHNQYXRjaGVyRXJyb3Iud2FzQmlnQXJyb3dGdW5jdGlvbmAgdG8gY2hlY2tcbiAgICogaWYgdGhlIGB0aGlzYCBhcmcgd291bGQgaGF2ZSBoYWQgYW55IHJlc3VsdHNcbiAgICogQHBhcmFtIHt1bmtub3dufSByZXN1bHRzIHRoZSBmaW5hbCByZXN1bHRzIGZyb20gdGhlIGBFeHRlbmRlZFJlc29sdmVyYFxuICAgKiBleGVjdXRpb24gdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGUgcGF0Y2hlciBmdW5jdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3IsIHBhdGNoZXIsIGNvbnRleHQsIHJlc3VsdHMpIHtcbiAgICBzdXBlcihlcnJvcilcblxuICAgIHRoaXMucGF0Y2hlciA9IHBhdGNoZXJcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG4gICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0c1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2NyaXB0aW9uIG9mIHRoZSBSZXNvbHZlclJlc3VsdHNQYXRjaGVyRXJyb3IgZXJyb3IgYW5kIGxpa2VseSBjYXVzZVxuICAgKiBhbmQgZml4LlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGEgc3RyaW5nIGRlbm90aW5nIHRoZSBwdXJwb3NlL2NhdXNlIG9mIHRoaXMgZXJyb3IgY2xhc3NcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBkcm9wTG93ZXN0YFxuICAgICAgVGhlIHBhdGNoZXIgZnVuY3Rpb24gZmFpbGVkIHRvIGV4ZWN1dGUgYWdhaW5zdCB0aGUgcmVzdWx0cyBvZiB0aGVcbiAgICAgICdFeHRlbmRlZFJlc29sdmVyJyBleGVjdXRpb24uIFRoZSBwYXRjaGVyIGZ1bmN0aW9uIGhhZCBhIG5hbWUgb2ZcbiAgICAgICcke3RoaXMucGF0Y2hlciAmJiB0aGlzLnBhdGNoZXIubmFtZSB8fCBudWxsfScuXG5cbiAgICAgIFRoZSBjb250ZXh0IG9mIHRoZSBwYXRjaGVyIHdhczpcbiAgICAgICR7aW5zcGVjdCh0aGlzLmNvbnRleHQsIHtjb2xvcnM6IHRydWUsIGRlcHRoOiA4fSl9XG5cbiAgICAgIFRoZSByZXN1bHRzIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24gd2VyZTpcbiAgICAgICR7aW5zcGVjdCh0aGlzLnJlc3VsdHMsIHtjb2xvcnM6IHRydWUsIGRlcHRoOiA4fSl9XG5cbiAgICAgIE9yaWdpbmFsIFN0YWNrIFRyYWNlXG4gICAgICAke3RoaXMuZXJyb3IudG9TdHJpbmcoKX1cblxuICAgIGBcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RpZnkgdGhlIGB2YWx1ZU9mKClgIGZ1bmN0aW9uIHRvIG1pcnJvciB0aGUgYHRvU3RyaW5nKClgIGZ1bmN0aW9uYWxpdHlcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBhbiBpZGVudGljYWwgc3RyaW5nIHRvIGAudG9TdHJpbmcoKWBcbiAgICovXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcHJvZ3JhbW1hdGljIGF0dGVtcHQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBmdW5jdGlvbiB0aGF0IGZhaWxlZCB3YXMgYVxuICAgKiBiaWcgYXJyb3cgZnVuY3Rpb24uIFRoaXMgbWVhbnMgdGhlIGZ1bmN0aW9uIHdhcyBwcmUtYm91bmQgYW5kIHRoZVxuICAgKiBgY29udGV4dGAgc2V0IGF0IHRoZSB0aW1lIG9mIGV4ZWN1dGlvbiB3b3VsZCBoYXZlIGJlZW4gaWdub3JlZC5cbiAgICpcbiAgICogQGZ1bmN0aW9uIHdhc0JpZ0Fycm93RnVuY3Rpb25cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZmFpbGVkIGZ1bmN0aW9uIHdhcyBhIGJpZyBhcnJvdyBvclxuICAgKiBwcmUtYm91bmQgZnVuY3Rpb247IGZhbHNlIGlmIHRoZSBgY29udGV4dGAgdmFsdWUgc2hvdWxkIGhhdmUgYmVlbiBwYXNzZWRcbiAgICogc3VjY2Vzc2Z1bGx5IHRvIHRoZSBleGVjdXRpb24gY29udGV4dFxuICAgKi9cbiAgZ2V0IHdhc0JpZ0Fycm93RnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcGF0Y2hlciA9IHRoaXMucGF0Y2hlclxuXG4gICAgaWYgKHBhdGNoZXIgJiYgaXNGbihwYXRjaGVyKSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBwYXRjaGVyLnByb3RvdHlwZSA9PT0gJ3VuZGVmaW5lZCdcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvbHZlclJlc3VsdHNQYXRjaGVyRXJyb3JcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBQUEsU0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsVUFBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsS0FBQSxHQUFBSCxPQUFBO0FBQThCLFNBQUFFLHVCQUFBRSxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBSjlCOztBQVFBLE1BQU1HLElBQUksR0FBR0MsQ0FBQyxJQUFJLFlBQVksQ0FBQ0MsSUFBSSxDQUFDQyxNQUFNLENBQUNDLFNBQVMsQ0FBQ0MsUUFBUSxDQUFDQyxJQUFJLENBQUNMLENBQUMsQ0FBQyxDQUFDOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNTSwyQkFBMkIsU0FBU0Msa0JBQVMsQ0FBQztFQUN6RDtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0VDLFdBQVdBLENBQUNDLEtBQUssRUFBRUMsT0FBTyxFQUFFQyxPQUFPLEVBQUVDLE9BQU8sRUFBRTtJQUM1QyxLQUFLLENBQUNILEtBQUssQ0FBQztJQUVaLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0VBQ3hCOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFUixRQUFRQSxDQUFBLEVBQUc7SUFDVCxPQUFPLElBQUFTLG9CQUFVO0FBQ3JCO0FBQ0E7QUFDQSxTQUFTLElBQUksQ0FBQ0gsT0FBTyxJQUFJLElBQUksQ0FBQ0EsT0FBTyxDQUFDSSxJQUFJLElBQUksSUFBSTtBQUNsRDtBQUNBO0FBQ0EsUUFBUSxJQUFBQyxhQUFPLEVBQUMsSUFBSSxDQUFDSixPQUFPLEVBQUU7TUFBQ0ssTUFBTSxFQUFFLElBQUk7TUFBRUMsS0FBSyxFQUFFO0lBQUMsQ0FBQyxDQUFDO0FBQ3ZEO0FBQ0E7QUFDQSxRQUFRLElBQUFGLGFBQU8sRUFBQyxJQUFJLENBQUNILE9BQU8sRUFBRTtNQUFDSSxNQUFNLEVBQUUsSUFBSTtNQUFFQyxLQUFLLEVBQUU7SUFBQyxDQUFDLENBQUM7QUFDdkQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDUixLQUFLLENBQUNMLFFBQVEsQ0FBQyxDQUFDO0FBQzdCO0FBQ0EsS0FBSztFQUNIOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFDRWMsT0FBT0EsQ0FBQSxFQUFHO0lBQ1IsT0FBTyxJQUFJLENBQUNkLFFBQVEsQ0FBQyxDQUFDO0VBQ3hCOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDRSxJQUFJZSxtQkFBbUJBLENBQUEsRUFBRztJQUN4QixNQUFNVCxPQUFPLEdBQUcsSUFBSSxDQUFDQSxPQUFPO0lBRTVCLElBQUlBLE9BQU8sSUFBSVgsSUFBSSxDQUFDVyxPQUFPLENBQUMsRUFBRTtNQUM1QixPQUFPLE9BQU9BLE9BQU8sQ0FBQ1AsU0FBUyxLQUFLLFdBQVc7SUFDakQ7SUFFQSxPQUFPLEtBQUs7RUFDZDtBQUNGO0FBQUNpQixPQUFBLENBQUFkLDJCQUFBLEdBQUFBLDJCQUFBO0FBQUEsSUFBQWUsUUFBQSxHQUFBRCxPQUFBLENBQUF0QixPQUFBLEdBRWNRLDJCQUEyQiIsImlnbm9yZUxpc3QiOltdfQ==
//# sourceMappingURL=ResolverResultsPatcherError.js.map