"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BaseError = void 0;
var _neTagFns = require("ne-tag-fns");
var _util = require("util");
// @ts-check
// $FlowFixMe[prop-missing]
// $FlowFixMe[incompatible-call]

/**
 * The BaseError class provides a simply stock way to wrap errors in a more
 * concise error type for use within the project. All normal error fields are
 * passed through to the wrapped error class if the default error contains
 * the requested property; failing that, it is passed on to the subclass.
 *
 * It is highly recommended
 */
class BaseError extends Error {
  /**
   * The error this error wraps.
   *
   * @type {Error}
   */

  /**
   * Creates a new BaseError type that wraps either an existing error or
   * uses this error instantiation with the given error message.
   *
   * @constructor
   * @param {Error | string} error the error or message used to create an
   * instance
   */
  constructor(error) {
    super(error.message || error, error?.fileName, error?.lineNumber);
    this.error = error instanceof String ? this : error;
    if (this.toString === Error.prototype.toString) {
      console.error((0, _neTagFns.inline)`
        Class \`${this.constructor.name}\` does not correctly implement or
        override the \`toString()\` function in order to describe the cause
        of this named error. Please remedy this.
      `);
    }
    if (_util.inspect.custom) {
      this[_util.inspect.custom] = (depth, options) => this.toString();
    } else {
      this.inspect = (depth, options) => this.toString();
    }
    return new Proxy(this, {
      get(target, property, receiver) {
        if (this.error && this.error.hasOwnProperty(property)) {
          return this.error[property];
        } else {
          return Reflect.get(target, property, receiver);
        }
      }
    });
  }

  /**
   * All BaseError children will show `[object <class name>]` as their internal
   * class naming when used with `Object.prototype.toString.call` or `apply`.
   *
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
exports.BaseError = BaseError;
var _default = exports.default = BaseError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbmVUYWdGbnMiLCJyZXF1aXJlIiwiX3V0aWwiLCJCYXNlRXJyb3IiLCJFcnJvciIsImNvbnN0cnVjdG9yIiwiZXJyb3IiLCJtZXNzYWdlIiwiZmlsZU5hbWUiLCJsaW5lTnVtYmVyIiwiU3RyaW5nIiwidG9TdHJpbmciLCJwcm90b3R5cGUiLCJjb25zb2xlIiwiaW5saW5lIiwibmFtZSIsImluc3BlY3QiLCJjdXN0b20iLCJkZXB0aCIsIm9wdGlvbnMiLCJQcm94eSIsImdldCIsInRhcmdldCIsInByb3BlcnR5IiwicmVjZWl2ZXIiLCJoYXNPd25Qcm9wZXJ0eSIsIlJlZmxlY3QiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImV4cG9ydHMiLCJfZGVmYXVsdCIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3JzL0Jhc2VFcnJvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcbi8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF1cblxuaW1wb3J0IHsgaW5saW5lIH0gZnJvbSAnbmUtdGFnLWZucydcbmltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJ1xuXG4vKipcbiAqIFRoZSBCYXNlRXJyb3IgY2xhc3MgcHJvdmlkZXMgYSBzaW1wbHkgc3RvY2sgd2F5IHRvIHdyYXAgZXJyb3JzIGluIGEgbW9yZVxuICogY29uY2lzZSBlcnJvciB0eXBlIGZvciB1c2Ugd2l0aGluIHRoZSBwcm9qZWN0LiBBbGwgbm9ybWFsIGVycm9yIGZpZWxkcyBhcmVcbiAqIHBhc3NlZCB0aHJvdWdoIHRvIHRoZSB3cmFwcGVkIGVycm9yIGNsYXNzIGlmIHRoZSBkZWZhdWx0IGVycm9yIGNvbnRhaW5zXG4gKiB0aGUgcmVxdWVzdGVkIHByb3BlcnR5OyBmYWlsaW5nIHRoYXQsIGl0IGlzIHBhc3NlZCBvbiB0byB0aGUgc3ViY2xhc3MuXG4gKlxuICogSXQgaXMgaGlnaGx5IHJlY29tbWVuZGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKlxuICAgKiBUaGUgZXJyb3IgdGhpcyBlcnJvciB3cmFwcy5cbiAgICpcbiAgICogQHR5cGUge0Vycm9yfVxuICAgKi9cbiAgZXJyb3I7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQmFzZUVycm9yIHR5cGUgdGhhdCB3cmFwcyBlaXRoZXIgYW4gZXhpc3RpbmcgZXJyb3Igb3JcbiAgICogdXNlcyB0aGlzIGVycm9yIGluc3RhbnRpYXRpb24gd2l0aCB0aGUgZ2l2ZW4gZXJyb3IgbWVzc2FnZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RXJyb3IgfCBzdHJpbmd9IGVycm9yIHRoZSBlcnJvciBvciBtZXNzYWdlIHVzZWQgdG8gY3JlYXRlIGFuXG4gICAqIGluc3RhbmNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvcikge1xuICAgIHN1cGVyKGVycm9yLm1lc3NhZ2UgfHwgZXJyb3IsIGVycm9yPy5maWxlTmFtZSwgZXJyb3I/LmxpbmVOdW1iZXIpXG5cbiAgICB0aGlzLmVycm9yID0gZXJyb3IgaW5zdGFuY2VvZiBTdHJpbmcgPyB0aGlzIDogZXJyb3JcblxuICAgIGlmICh0aGlzLnRvU3RyaW5nID09PSBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoaW5saW5lYFxuICAgICAgICBDbGFzcyBcXGAke3RoaXMuY29uc3RydWN0b3IubmFtZX1cXGAgZG9lcyBub3QgY29ycmVjdGx5IGltcGxlbWVudCBvclxuICAgICAgICBvdmVycmlkZSB0aGUgXFxgdG9TdHJpbmcoKVxcYCBmdW5jdGlvbiBpbiBvcmRlciB0byBkZXNjcmliZSB0aGUgY2F1c2VcbiAgICAgICAgb2YgdGhpcyBuYW1lZCBlcnJvci4gUGxlYXNlIHJlbWVkeSB0aGlzLlxuICAgICAgYClcbiAgICB9XG5cbiAgICBpZiAoaW5zcGVjdC5jdXN0b20pIHtcbiAgICAgIHRoaXNbaW5zcGVjdC5jdXN0b21dID0gKGRlcHRoLCBvcHRpb25zKSA9PiB0aGlzLnRvU3RyaW5nKClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmluc3BlY3QgPSAoZGVwdGgsIG9wdGlvbnMpID0+IHRoaXMudG9TdHJpbmcoKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xuICAgICAgZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmVycm9yICYmIHRoaXMuZXJyb3IuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JbcHJvcGVydHldXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGwgQmFzZUVycm9yIGNoaWxkcmVuIHdpbGwgc2hvdyBgW29iamVjdCA8Y2xhc3MgbmFtZT5dYCBhcyB0aGVpciBpbnRlcm5hbFxuICAgKiBjbGFzcyBuYW1pbmcgd2hlbiB1c2VkIHdpdGggYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbGAgb3IgYGFwcGx5YC5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZUVycm9yXG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUQsT0FBQTtBQUxBO0FBQ0E7QUFDQTs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTUUsU0FBUyxTQUFTQyxLQUFLLENBQUM7RUFDbkM7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0VDLFdBQVdBLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQ0MsT0FBTyxJQUFJRCxLQUFLLEVBQUVBLEtBQUssRUFBRUUsUUFBUSxFQUFFRixLQUFLLEVBQUVHLFVBQVUsQ0FBQztJQUVqRSxJQUFJLENBQUNILEtBQUssR0FBR0EsS0FBSyxZQUFZSSxNQUFNLEdBQUcsSUFBSSxHQUFHSixLQUFLO0lBRW5ELElBQUksSUFBSSxDQUFDSyxRQUFRLEtBQUtQLEtBQUssQ0FBQ1EsU0FBUyxDQUFDRCxRQUFRLEVBQUU7TUFDOUNFLE9BQU8sQ0FBQ1AsS0FBSyxDQUFDLElBQUFRLGdCQUFNO0FBQzFCLGtCQUFrQixJQUFJLENBQUNULFdBQVcsQ0FBQ1UsSUFBSTtBQUN2QztBQUNBO0FBQ0EsT0FBTyxDQUFDO0lBQ0o7SUFFQSxJQUFJQyxhQUFPLENBQUNDLE1BQU0sRUFBRTtNQUNsQixJQUFJLENBQUNELGFBQU8sQ0FBQ0MsTUFBTSxDQUFDLEdBQUcsQ0FBQ0MsS0FBSyxFQUFFQyxPQUFPLEtBQUssSUFBSSxDQUFDUixRQUFRLENBQUMsQ0FBQztJQUM1RCxDQUFDLE1BQ0k7TUFDSCxJQUFJLENBQUNLLE9BQU8sR0FBRyxDQUFDRSxLQUFLLEVBQUVDLE9BQU8sS0FBSyxJQUFJLENBQUNSLFFBQVEsQ0FBQyxDQUFDO0lBQ3BEO0lBRUEsT0FBTyxJQUFJUyxLQUFLLENBQUMsSUFBSSxFQUFFO01BQ3JCQyxHQUFHQSxDQUFDQyxNQUFNLEVBQUVDLFFBQVEsRUFBRUMsUUFBUSxFQUFFO1FBQzlCLElBQUksSUFBSSxDQUFDbEIsS0FBSyxJQUFJLElBQUksQ0FBQ0EsS0FBSyxDQUFDbUIsY0FBYyxDQUFDRixRQUFRLENBQUMsRUFBRTtVQUNyRCxPQUFPLElBQUksQ0FBQ2pCLEtBQUssQ0FBQ2lCLFFBQVEsQ0FBQztRQUM3QixDQUFDLE1BQ0k7VUFDSCxPQUFPRyxPQUFPLENBQUNMLEdBQUcsQ0FBQ0MsTUFBTSxFQUFFQyxRQUFRLEVBQUVDLFFBQVEsQ0FBQztRQUNoRDtNQUNGO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0UsS0FBS0csTUFBTSxDQUFDQyxXQUFXLElBQUk7SUFDekIsT0FBTyxJQUFJLENBQUN2QixXQUFXLENBQUNVLElBQUk7RUFDOUI7QUFDRjtBQUFDYyxPQUFBLENBQUExQixTQUFBLEdBQUFBLFNBQUE7QUFBQSxJQUFBMkIsUUFBQSxHQUFBRCxPQUFBLENBQUFFLE9BQUEsR0FFYzVCLFNBQVMiLCJpZ25vcmVMaXN0IjpbXX0=
//# sourceMappingURL=BaseError.js.map