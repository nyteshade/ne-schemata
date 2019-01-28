"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WrappedResolverExecutionError = void 0;

var _neTagFns = require("ne-tag-fns");

var _BaseError2 = require("../BaseError");

var _util = require("util");

var _prettyError = _interopRequireDefault(require("pretty-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      The ExtendedResolver execution failed. The resolver that failed was at\n      index ", ". The function had a name of '", "'.\n\n      Was the function likely a big arrow function? ", "\n\n      Arguments at the time were:\n      ", "\n\n      Context at the time was:\n      ", "\n\n      Results before the function was called\n      ", "\n\n      Original Stack Trace\n      ", "\n    "]);

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
 * ExtendedResolvers wrap several functions including the original GraphQL
 * field resolver itself. If an exception is thrown by any of the internal
 * methods, this error can help resolve those problems.
 *
 * @class WrappedResolverExecutionError
 */

var WrappedResolverExecutionError =
/*#__PURE__*/
function (_BaseError) {
  _inherits(WrappedResolverExecutionError, _BaseError);

  /**
   * The `ExtendedResolver` object that caused the issue
   *
   * @type {ExtendedResolver}
   */

  /**
   * The index of the function that failed. This will help the programmer
   * determine the function that caused the error.
   *
   * @type {number}
   */

  /**
   * The arguments passed to the function in question that failed.
   *
   * @type {Array<mixed>}
   */

  /**
   * The `this` value passed to the function as it was executed. Note that
   * this value is irrelevant if the function passed was a big arrow function
   *
   * @type {mixed}
   */

  /**
   * The `results` value before the internal resolver that failed was thrown.
   * This does not include the results of the erroring function in question as
   * no value was ever reached before the exception was thrown (in theory)
   *
   * @type {mixed}
   */

  /**
   * Creates a new error instance of `WrappedResolverExecutionError`. The
   * arguments resolver, index, args and context all help the programmer
   * debug the issue in question should the error be thrown.
   *
   * @method constructor
   *
   * @param {Error|string} error the error thrown at the time of the problem
   * @param {ExtendedResolver} resolver the `ExtendedResolver` instance
   * @param {number} index the index of the wrapped resolver that threw up
   * @param {Array<mixed>} args the arguments passed to the function at the time
   * @param {mixed} context the `thisArg` set on the function call at the time
   * @param {mixed} results the results up to the time of failure
   */
  function WrappedResolverExecutionError(error, resolver, index, args, context, results) {
    var _this;

    _classCallCheck(this, WrappedResolverExecutionError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WrappedResolverExecutionError).call(this, error));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "resolver", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "index", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "args", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "context", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "results", void 0);

    _this.resolver = resolver;
    _this.index = index;
    _this.args = args;
    _this.context = context;
    _this.results = results;
    return _this;
  }
  /**
   * Description of the WrappedResolverExecutionError error and likely cause
   * and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */


  _createClass(WrappedResolverExecutionError, [{
    key: "toString",
    value: function toString() {
      var fn = this.resolver && this.resolver.order && this.resolver.order[this.index];
      return (0, _neTagFns.dropLowest)(_templateObject(), this.index, fn && fn.name, this.wasBigArrowFunction ? '\x1b[33mtrue\x1b[0m' : '\x1b[31mfalse\x1b[0m', (0, _util.inspect)(this.args, {
        colors: true,
        depth: 8
      }), (0, _util.inspect)(this.context, {
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
     * @return {boolean} true if the failed function resolver was a big arrow or
     * pre-bound function; false if the `context` value should have been passed
     * successfully to the execution context
     */

  }, {
    key: "wasBigArrowFunction",
    get: function get() {
      var resolver = this.resolver && this.resolver.order && this.resolver.order[this.index];

      if (resolver && isFn(resolver)) {
        return typeof resolver.prototype === 'undefined';
      }

      return false;
    }
  }]);

  return WrappedResolverExecutionError;
}(_BaseError2.BaseError);

exports.WrappedResolverExecutionError = WrappedResolverExecutionError;
var _default = WrappedResolverExecutionError;
exports.default = _default;