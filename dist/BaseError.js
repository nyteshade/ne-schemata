"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.BaseError = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _neTagFns = require("ne-tag-fns");

var _util = require("util");

var _Symbol$toStringTag;

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n        Class `", "` does not correctly implement or\n        override the `toString()` function in order to describe the cause\n        of this named error. Please remedy this.\n      "], ["\n        Class \\`", "\\` does not correctly implement or\n        override the \\`toString()\\` function in order to describe the cause\n        of this named error. Please remedy this.\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

_Symbol$toStringTag = Symbol.toStringTag;

/**
 * The BaseError class provides a simply stock way to wrap errors in a more
 * concise error type for use within the project. All normal error fields are
 * passed through to the wrapped error class if the default error contains
 * the requested property; failing that, it is passed on to the subclass.
 *
 * It is highly recommended
 */
var BaseError = /*#__PURE__*/function (_Error) {
  (0, _inherits2["default"])(BaseError, _Error);

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
  function BaseError(error) {
    var _this;

    (0, _classCallCheck2["default"])(this, BaseError);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BaseError).call(this, error.message || error, error.fileName, error.lineNumber));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "error", void 0);
    _this.error = error instanceof String ? (0, _assertThisInitialized2["default"])(_this) : error;

    if (_this.toString === Error.prototype.toString) {
      console.error((0, _neTagFns.inline)(_templateObject(), _this.constructor.name));
    }

    if (_util.inspect.custom) {
      _this[_util.inspect.custom] = function (depth, options) {
        return _this.toString();
      };
    } else {
      _this.inspect = function (depth, options) {
        return _this.toString();
      };
    }

    return (0, _possibleConstructorReturn2["default"])(_this, new Proxy((0, _assertThisInitialized2["default"])(_this), {
      get: function get(target, property, receiver) {
        if (this.error && this.error.hasOwnProperty(property)) {
          return this.error[property];
        } else {
          return Reflect.get(target, property, receiver);
        }
      }
    }));
  }
  /**
   * All BaseError children will show `[object <class name>]` as their internal 
   * class naming when used with `Object.prototype.toString.call` or `apply`.
   * 
   * @type {String}
   */


  (0, _createClass2["default"])(BaseError, [{
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    }
  }]);
  return BaseError;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

exports.BaseError = BaseError;
var _default = BaseError;
exports["default"] = _default;