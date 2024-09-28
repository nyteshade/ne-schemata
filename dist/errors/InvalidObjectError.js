"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.InvalidObjectError = void 0;
var _BaseError = _interopRequireDefault(require("./BaseError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// @ts-check

/**
 * The InvalidObjectError class represents an error that occurs when a non-object
 * value is provided as the target object to the `at` or `atNicely` functions.
 * This error provides details about the type of the value that caused the error.
 */
class InvalidObjectError extends _BaseError.default {
  /** @type {string} */

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
exports.InvalidObjectError = InvalidObjectError;
var _default = exports.default = InvalidObjectError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfQmFzZUVycm9yIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJJbnZhbGlkT2JqZWN0RXJyb3IiLCJCYXNlRXJyb3IiLCJjb25zdHJ1Y3RvciIsInZhbHVlVHlwZSIsIm1lc3NhZ2UiLCJ0b1N0cmluZyIsIm5hbWUiLCJleHBvcnRzIiwiX2RlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3JzL0ludmFsaWRPYmplY3RFcnJvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IEJhc2VFcnJvciBmcm9tICcuL0Jhc2VFcnJvci5qcyc7XG5cbi8qKlxuICogVGhlIEludmFsaWRPYmplY3RFcnJvciBjbGFzcyByZXByZXNlbnRzIGFuIGVycm9yIHRoYXQgb2NjdXJzIHdoZW4gYSBub24tb2JqZWN0XG4gKiB2YWx1ZSBpcyBwcm92aWRlZCBhcyB0aGUgdGFyZ2V0IG9iamVjdCB0byB0aGUgYGF0YCBvciBgYXROaWNlbHlgIGZ1bmN0aW9ucy5cbiAqIFRoaXMgZXJyb3IgcHJvdmlkZXMgZGV0YWlscyBhYm91dCB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgdGhhdCBjYXVzZWQgdGhlIGVycm9yLlxuICovXG5leHBvcnQgY2xhc3MgSW52YWxpZE9iamVjdEVycm9yIGV4dGVuZHMgQmFzZUVycm9yIHtcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gIHZhbHVlVHlwZTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgSW52YWxpZE9iamVjdEVycm9yYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlVHlwZSB0aGUgdHlwZSBvZiBvYmplY3QgaW5jb3JyZWN0bHkgcmVjZWl2ZWRcbiAgICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIGFuIG9wdGlvbmFsIG1lc3NhZ2UgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCB3aGljaFxuICAgKiBpbmRpY2F0ZXMgdGhlIHR5cGUgb2YgdmFsdWUgaW5jb3JyZWN0bHkgcmVjZWl2ZWQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZVR5cGUsIG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlIHx8IGBJbnZhbGlkIG9iamVjdDogUmVjZWl2ZWQgdHlwZSAke3ZhbHVlVHlwZX1gKTtcbiAgICB0aGlzLnZhbHVlVHlwZSA9IHZhbHVlVHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG5pY2VseSBmb3JtYXR0ZWQgdmFyaWFudCBvZiB0aGlzIGVycm9yIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX06ICR7dGhpcy5tZXNzYWdlfSAodHlwZTogJHt0aGlzLnZhbHVlVHlwZX0pYDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnZhbGlkT2JqZWN0RXJyb3JcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBQUEsVUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQXVDLFNBQUFELHVCQUFBRSxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBRnZDOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNRyxrQkFBa0IsU0FBU0Msa0JBQVMsQ0FBQztFQUNoRDs7RUFHQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFQyxXQUFXQSxDQUFDQyxTQUFTLEVBQUVDLE9BQU8sRUFBRTtJQUM5QixLQUFLLENBQUNBLE9BQU8sSUFBSSxpQ0FBaUNELFNBQVMsRUFBRSxDQUFDO0lBQzlELElBQUksQ0FBQ0EsU0FBUyxHQUFHQSxTQUFTO0VBQzVCOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFDRUUsUUFBUUEsQ0FBQSxFQUFHO0lBQ1QsT0FBTyxHQUFHLElBQUksQ0FBQ0gsV0FBVyxDQUFDSSxJQUFJLEtBQUssSUFBSSxDQUFDRixPQUFPLFdBQVcsSUFBSSxDQUFDRCxTQUFTLEdBQUc7RUFDOUU7QUFDRjtBQUFDSSxPQUFBLENBQUFQLGtCQUFBLEdBQUFBLGtCQUFBO0FBQUEsSUFBQVEsUUFBQSxHQUFBRCxPQUFBLENBQUFSLE9BQUEsR0FFY0Msa0JBQWtCIiwiaWdub3JlTGlzdCI6W119
//# sourceMappingURL=InvalidObjectError.js.map