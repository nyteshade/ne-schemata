"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BaseError = void 0;

var _neTagFns = require("ne-tag-fns");

var _util = require("util");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        Class `", "` does not correctly implement or\n        override the `toString()` function in order to describe the cause\n        of this named error. Please remedy this.\n      "], ["\n        Class \\`", "\\` does not correctly implement or\n        override the \\`toString()\\` function in order to describe the cause\n        of this named error. Please remedy this.\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Symbol$toStringTag = Symbol.toStringTag;

/**
 * The BaseError class provides a simply stock way to wrap errors in a more
 * concise error type for use within the project. All normal error fields are
 * passed through to the wrapped error class if the default error contains
 * the requested property; failing that, it is passed on to the subclass.
 *
 * It is highly recommended
 */
var BaseError =
/*#__PURE__*/
function (_Error) {
  _inherits(BaseError, _Error);

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

    _classCallCheck(this, BaseError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseError).call(this, error.message || error, error.fileName, error.lineNumber));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "error", void 0);

    _this.error = error instanceof String ? _assertThisInitialized(_assertThisInitialized(_this)) : error;

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

    return _possibleConstructorReturn(_this, new Proxy(_assertThisInitialized(_assertThisInitialized(_this)), {
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


  _createClass(BaseError, [{
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    }
  }]);

  return BaseError;
}(_wrapNativeSuper(Error));

exports.BaseError = BaseError;
var _default = BaseError;
exports.default = _default;