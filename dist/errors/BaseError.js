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
   * @type {String}
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
exports.BaseError = BaseError;
var _default = exports.default = BaseError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbmVUYWdGbnMiLCJyZXF1aXJlIiwiX3V0aWwiLCJCYXNlRXJyb3IiLCJFcnJvciIsImNvbnN0cnVjdG9yIiwiZXJyb3IiLCJtZXNzYWdlIiwiZmlsZU5hbWUiLCJsaW5lTnVtYmVyIiwiU3RyaW5nIiwidG9TdHJpbmciLCJwcm90b3R5cGUiLCJjb25zb2xlIiwiaW5saW5lIiwibmFtZSIsImluc3BlY3QiLCJjdXN0b20iLCJkZXB0aCIsIm9wdGlvbnMiLCJQcm94eSIsImdldCIsInRhcmdldCIsInByb3BlcnR5IiwicmVjZWl2ZXIiLCJoYXNPd25Qcm9wZXJ0eSIsIlJlZmxlY3QiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImV4cG9ydHMiLCJfZGVmYXVsdCIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3JzL0Jhc2VFcnJvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcbi8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF1cblxuaW1wb3J0IHsgaW5saW5lIH0gZnJvbSAnbmUtdGFnLWZucydcbmltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJ1xuXG4vKipcbiAqIFRoZSBCYXNlRXJyb3IgY2xhc3MgcHJvdmlkZXMgYSBzaW1wbHkgc3RvY2sgd2F5IHRvIHdyYXAgZXJyb3JzIGluIGEgbW9yZVxuICogY29uY2lzZSBlcnJvciB0eXBlIGZvciB1c2Ugd2l0aGluIHRoZSBwcm9qZWN0LiBBbGwgbm9ybWFsIGVycm9yIGZpZWxkcyBhcmVcbiAqIHBhc3NlZCB0aHJvdWdoIHRvIHRoZSB3cmFwcGVkIGVycm9yIGNsYXNzIGlmIHRoZSBkZWZhdWx0IGVycm9yIGNvbnRhaW5zXG4gKiB0aGUgcmVxdWVzdGVkIHByb3BlcnR5OyBmYWlsaW5nIHRoYXQsIGl0IGlzIHBhc3NlZCBvbiB0byB0aGUgc3ViY2xhc3MuXG4gKlxuICogSXQgaXMgaGlnaGx5IHJlY29tbWVuZGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKlxuICAgKiBUaGUgZXJyb3IgdGhpcyBlcnJvciB3cmFwcy5cbiAgICpcbiAgICogQHR5cGUge0Vycm9yfVxuICAgKi9cbiAgZXJyb3I6IEVycm9yXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQmFzZUVycm9yIHR5cGUgdGhhdCB3cmFwcyBlaXRoZXIgYW4gZXhpc3RpbmcgZXJyb3Igb3JcbiAgICogdXNlcyB0aGlzIGVycm9yIGluc3RhbnRpYXRpb24gd2l0aCB0aGUgZ2l2ZW4gZXJyb3IgbWVzc2FnZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvcjogRXJyb3IgfCBzdHJpbmcpIHtcbiAgICBzdXBlcihlcnJvci5tZXNzYWdlIHx8IGVycm9yLCBlcnJvcj8uZmlsZU5hbWUsIGVycm9yPy5saW5lTnVtYmVyKVxuXG4gICAgdGhpcy5lcnJvciA9IGVycm9yIGluc3RhbmNlb2YgU3RyaW5nID8gdGhpcyA6IGVycm9yXG5cbiAgICBpZiAodGhpcy50b1N0cmluZyA9PT0gRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGlubGluZWBcbiAgICAgICAgQ2xhc3MgXFxgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9XFxgIGRvZXMgbm90IGNvcnJlY3RseSBpbXBsZW1lbnQgb3JcbiAgICAgICAgb3ZlcnJpZGUgdGhlIFxcYHRvU3RyaW5nKClcXGAgZnVuY3Rpb24gaW4gb3JkZXIgdG8gZGVzY3JpYmUgdGhlIGNhdXNlXG4gICAgICAgIG9mIHRoaXMgbmFtZWQgZXJyb3IuIFBsZWFzZSByZW1lZHkgdGhpcy5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgaWYgKGluc3BlY3QuY3VzdG9tKSB7XG4gICAgICB0aGlzW2luc3BlY3QuY3VzdG9tXSA9IChkZXB0aCwgb3B0aW9ucykgPT4gdGhpcy50b1N0cmluZygpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5pbnNwZWN0ID0gKGRlcHRoLCBvcHRpb25zKSA9PiB0aGlzLnRvU3RyaW5nKClcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICAgICAgICBpZiAodGhpcy5lcnJvciAmJiB0aGlzLmVycm9yLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yW3Byb3BlcnR5XVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQWxsIEJhc2VFcnJvciBjaGlsZHJlbiB3aWxsIHNob3cgYFtvYmplY3QgPGNsYXNzIG5hbWU+XWAgYXMgdGhlaXIgaW50ZXJuYWxcbiAgICogY2xhc3MgbmFtaW5nIHdoZW4gdXNlZCB3aXRoIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGxgIG9yIGBhcHBseWAuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2VFcnJvclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSxJQUFBQSxTQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxLQUFBLEdBQUFELE9BQUE7QUFMQTtBQUNBO0FBQ0E7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1FLFNBQVMsU0FBU0MsS0FBSyxDQUFDO0VBQ25DO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0VBR0U7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0VDLFdBQVdBLENBQUNDLEtBQXFCLEVBQUU7SUFDakMsS0FBSyxDQUFDQSxLQUFLLENBQUNDLE9BQU8sSUFBSUQsS0FBSyxFQUFFQSxLQUFLLEVBQUVFLFFBQVEsRUFBRUYsS0FBSyxFQUFFRyxVQUFVLENBQUM7SUFFakUsSUFBSSxDQUFDSCxLQUFLLEdBQUdBLEtBQUssWUFBWUksTUFBTSxHQUFHLElBQUksR0FBR0osS0FBSztJQUVuRCxJQUFJLElBQUksQ0FBQ0ssUUFBUSxLQUFLUCxLQUFLLENBQUNRLFNBQVMsQ0FBQ0QsUUFBUSxFQUFFO01BQzlDRSxPQUFPLENBQUNQLEtBQUssQ0FBQyxJQUFBUSxnQkFBTTtBQUMxQixrQkFBa0IsSUFBSSxDQUFDVCxXQUFXLENBQUNVLElBQUk7QUFDdkM7QUFDQTtBQUNBLE9BQU8sQ0FBQztJQUNKO0lBRUEsSUFBSUMsYUFBTyxDQUFDQyxNQUFNLEVBQUU7TUFDbEIsSUFBSSxDQUFDRCxhQUFPLENBQUNDLE1BQU0sQ0FBQyxHQUFHLENBQUNDLEtBQUssRUFBRUMsT0FBTyxLQUFLLElBQUksQ0FBQ1IsUUFBUSxDQUFDLENBQUM7SUFDNUQsQ0FBQyxNQUNJO01BQ0gsSUFBSSxDQUFDSyxPQUFPLEdBQUcsQ0FBQ0UsS0FBSyxFQUFFQyxPQUFPLEtBQUssSUFBSSxDQUFDUixRQUFRLENBQUMsQ0FBQztJQUNwRDtJQUVBLE9BQU8sSUFBSVMsS0FBSyxDQUFDLElBQUksRUFBRTtNQUNyQkMsR0FBR0EsQ0FBQ0MsTUFBTSxFQUFFQyxRQUFRLEVBQUVDLFFBQVEsRUFBRTtRQUM5QixJQUFJLElBQUksQ0FBQ2xCLEtBQUssSUFBSSxJQUFJLENBQUNBLEtBQUssQ0FBQ21CLGNBQWMsQ0FBQ0YsUUFBUSxDQUFDLEVBQUU7VUFDckQsT0FBTyxJQUFJLENBQUNqQixLQUFLLENBQUNpQixRQUFRLENBQUM7UUFDN0IsQ0FBQyxNQUNJO1VBQ0gsT0FBT0csT0FBTyxDQUFDTCxHQUFHLENBQUNDLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxRQUFRLENBQUM7UUFDaEQ7TUFDRjtJQUNGLENBQUMsQ0FBQztFQUNKOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFLEtBQUtHLE1BQU0sQ0FBQ0MsV0FBVyxJQUFJO0lBQ3pCLE9BQU8sSUFBSSxDQUFDdkIsV0FBVyxDQUFDVSxJQUFJO0VBQzlCO0FBQ0Y7QUFBQ2MsT0FBQSxDQUFBMUIsU0FBQSxHQUFBQSxTQUFBO0FBQUEsSUFBQTJCLFFBQUEsR0FBQUQsT0FBQSxDQUFBRSxPQUFBLEdBRWM1QixTQUFTIiwiaWdub3JlTGlzdCI6W119
//# sourceMappingURL=BaseError.js.map