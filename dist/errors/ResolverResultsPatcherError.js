"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ResolverResultsPatcherError = void 0;

var _neTagFns = require("ne-tag-fns");

var _BaseError2 = require("../BaseError");

var _util = require("util");

var _prettyError = _interopRequireDefault(require("pretty-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      The patcher function failed to execute against the results of the\n      'ExtendedResolver' execution. The patcher function had a name of\n      '", "'.\n\n      The context of the patcher was:\n      ", "\n\n      The results passed to the function were:\n      ", "\n\n      Original Stack Trace\n      ", "\n\n    "]);

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

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isFn = function isFn(o) {
  return /Function\]/.test(Object.prototype.toString.call(o));
};

var pe = new _prettyError.default();
/**
 * The `ResolverResultsPatcherError` can occur as the `ExtendedResolver` is
 * finishing and the final results are passed to a patcher function for final
 * inspection or modification. If an error is thrown at this time, the values
 * passed to the function are captured here for review by the programmer using
 * them
 *
 * @class ResolverResultsPatcherError
 */

var ResolverResultsPatcherError =
/*#__PURE__*/
function (_BaseError) {
  _inherits(ResolverResultsPatcherError, _BaseError);

  /**
   * The `ResolverResultsPatcher` function that failed.
   *
   * @type {Function}
   */

  /**
   * The `this` value passed to the function as it was executed. Note that
   * this value is irrelevant if the function passed was a big arrow function
   *
   * @type {mixed}
   */

  /**
   * The `results` value before the internal patcher that failed was thrown.
   * This does not include the results of the erroring function in question as
   * no value was ever reached before the exception was thrown (in theory)
   *
   * @type {mixed}
   */

  /**
   * Creates a new instance of `ResolverResultsPatcherError`.
   *
   * @constructor
   *
   * @param {string|Error} error the actual thrown error or error message
   * @param {Function} patcher the function called during the time of the error
   * @param {mixed} context the `this` arg applied to the call when the error
   * occurred; use `resolverResultsPatcherError.wasBigArrowFunction` to check
   * if the `this` arg would have had any results
   * @param {mixed} results the final results from the `ExtendedResolver`
   * execution that were passed to the patcher function
   */
  function ResolverResultsPatcherError(error, patcher, context, results) {
    var _this;

    _classCallCheck(this, ResolverResultsPatcherError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResolverResultsPatcherError).call(this, error));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "patcher", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "context", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "results", void 0);

    _this.patcher = patcher;
    _this.context = context;
    _this.results = results;
    return _this;
  }
  /**
   * Description of the ResolverResultsPatcherError error and likely cause
   * and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */


  _createClass(ResolverResultsPatcherError, [{
    key: "toString",
    value: function toString() {
      return (0, _neTagFns.dropLowest)(_templateObject(), this.patcher && this.patcher.name || null, (0, _util.inspect)(this.context, {
        colors: true,
        depth: 8
      }), (0, _util.inspect)(this.results, {
        colors: true,
        depth: 8
      }), pe.render(this.error));
    }
    /**
     * Modify the `valueOf()` function to mirror the `toString()` functionality
     * 
     * @return {string} an identical string to `.toString()`
     */

  }, {
    key: "valueOf",
    value: function valueOf() {
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

  }, {
    key: "wasBigArrowFunction",
    get: function get() {
      var patcher = this.patcher;

      if (patcher && isFn(patcher)) {
        return typeof patcher.prototype === 'undefined';
      }

      return false;
    }
  }]);

  return ResolverResultsPatcherError;
}(_BaseError2.BaseError);

exports.ResolverResultsPatcherError = ResolverResultsPatcherError;
var _default = ResolverResultsPatcherError;
exports.default = _default;