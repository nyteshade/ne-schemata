"use strict";

require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ResolverResultsPatcherError = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.function.name.js");
var _neTagFns = require("ne-tag-fns");
var _BaseError2 = require("../BaseError");
var _util = require("util");
var _prettyError = _interopRequireDefault(require("pretty-error"));
var _templateObject;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var isFn = function isFn(o) {
  return /Function\]/.test(Object.prototype.toString.call(o));
};
var pe = new _prettyError["default"]();

/**
 * The `ResolverResultsPatcherError` can occur as the `ExtendedResolver` is
 * finishing and the final results are passed to a patcher function for final
 * inspection or modification. If an error is thrown at this time, the values
 * passed to the function are captured here for review by the programmer using
 * them
 *
 * @class ResolverResultsPatcherError
 */
var ResolverResultsPatcherError = exports.ResolverResultsPatcherError = /*#__PURE__*/function (_BaseError) {
  (0, _inherits2["default"])(ResolverResultsPatcherError, _BaseError);
  var _super = _createSuper(ResolverResultsPatcherError);
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
    (0, _classCallCheck2["default"])(this, ResolverResultsPatcherError);
    _this = _super.call(this, error);
    /**
     * The `ResolverResultsPatcher` function that failed.
     *
     * @type {Function}
     */
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "patcher", void 0);
    /**
     * The `this` value passed to the function as it was executed. Note that
     * this value is irrelevant if the function passed was a big arrow function
     *
     * @type {mixed}
     */
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "context", void 0);
    /**
     * The `results` value before the internal patcher that failed was thrown.
     * This does not include the results of the erroring function in question as
     * no value was ever reached before the exception was thrown (in theory)
     *
     * @type {mixed}
     */
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "results", void 0);
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
  (0, _createClass2["default"])(ResolverResultsPatcherError, [{
    key: "toString",
    value: function toString() {
      return (0, _neTagFns.dropLowest)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n      The patcher function failed to execute against the results of the\n      'ExtendedResolver' execution. The patcher function had a name of\n      '", "'.\n\n      The context of the patcher was:\n      ", "\n\n      The results passed to the function were:\n      ", "\n\n      Original Stack Trace\n      ", "\n\n    "])), this.patcher && this.patcher.name || null, (0, _util.inspect)(this.context, {
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
var _default = exports["default"] = ResolverResultsPatcherError;