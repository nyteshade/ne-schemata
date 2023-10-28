"use strict";

require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolver = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.array.index-of.js");
require("core-js/modules/es.array.splice.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.join.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.string.repeat.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
var _graphql = require("graphql");
var _Schemata = require("./Schemata");
var _errors = require("./errors");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var original = Symbol('Original Resolver');
var listing = Symbol('List of Resolvers');
var patcher = Symbol('Resolver Result Patcher');
var isFn = function isFn(o) {
  return /Function\]/.test(Object.prototype.toString.call(o));
};

/**
 * Higher order, or wrapped, GraphQL field resolvers are a technique that
 * is becoming increasingly common these days. This class attempts to wrap
 * that in such a manner that it allows a bit of extensibility.
 *
 * @extends Function
 */
var ExtendedResolver = exports.ExtendedResolver = /*#__PURE__*/function (_Function, _Symbol$toStringTag) {
  (0, _inherits2["default"])(ExtendedResolver, _Function);
  var _super = _createSuper(ExtendedResolver);
  /**
   * Creates a new instance of `ExtendedResolver` for use with GraphQL. If
   * the supplied resolver is already an instance of `ExtendedResolver`, its
   * internal nested resolvers are copied, alongside the rest of the custom
   * properties that make up an instance of `ExtendedResolver`
   *
   * @since 1.9
   *
   * @param {GraphQLFieldResolver} resolver a normal GraphQLFieldResolver
   * function. By default, the `defaultFieldResolver` is used if no other
   * value is supplied
   */
  function ExtendedResolver() {
    var _this;
    var resolver = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _graphql.defaultFieldResolver;
    (0, _classCallCheck2["default"])(this, ExtendedResolver);
    _this = _super.call(this);
    if (resolver instanceof ExtendedResolver) {
      _this[listing] = Array.from(resolver[listing]);
      _this[original] = resolver[original];
      _this[patcher] = resolver[patcher];
    } else {
      _this[listing] = [resolver];
      _this[original] = resolver;
      _this[patcher] = null;
    }
    return (0, _possibleConstructorReturn2["default"])(_this, new Proxy((0, _assertThisInitialized2["default"])(_this), ExtendedResolver.handler));
  }

  // Properties

  /**
   * Returns a handle to the internal array of ordered resolver
   * functions, should indepth modification be necessary.
   *
   * @return  {Array<GraphQLFieldResolver>} the internal list of
   * resolvers to execute in order as though it were a single resolver
   */
  (0, _createClass2["default"])(ExtendedResolver, [{
    key: "order",
    get: function get() {
      return this[listing];
    }

    /**
     * An accessor that writes a new resolver to the internal list of
     * resolvers that combine into a single resolver for inclusion elsewhere.
     *
     * TODO come up with some ideas on how to handle setting of this list
     * when the list no longer contains the original. Throw error? Log? Add it
     * to the end? Allow all in some configurable manner?
     *
     * @param  {Array<GraphQLFieldResolver>} value the new array
     */,
    set: function set(value) {
      this[listing] = value;
    }

    /**
     * Retrieve the internal result value patcher function. By default, this
     * value is null and nonexistent. When present, it is a function that will
     * be called after all internal resolvers have done their work but before
     * those results are returned to the calling function.
     *
     * The function takes as its only parameter the culmination of results from
     * the internal resolvers work. Whatever is returned from this function is
     * returned as the final results.
     *
     * @return {ResolverResultsPatcher} a function or null
     */
  }, {
    key: "resultPatcher",
    get: function get() {
      return this[patcher];
    }

    /**
     * Sets the internal patcher function.
     *
     * @see resultPatcher getter above
     * @param {ResolverResultsPatcher} value a new patcher function
     */,
    set: function set(value) {
      this[patcher] = value;
    }

    /**
     * A getter that retrieves the original resolver from within the
     * `ExtendedResolver` instance.
     *
     * @method original
     * @readonly
     *
     * @return {GraphQLFieldResolver} the originally wrapped field resolver
     */
  }, {
    key: "original",
    get: function get() {
      return this[original];
    }

    /**
     * The dynamic index of the original resolver inside the internal listing.
     * As prepended and appended resolvers are added to the `ExtendedResolver`,
     * this value will change.
     *
     * @method originalIndex
     * @readonly
     *
     * @return {number} the numeric index of the original resolver within the
     * internal listing. -1 indicates that the original resolver is missing
     * which, in and of itself, indicates an invalid state.
     */
  }, {
    key: "originalIndex",
    get: function get() {
      return this[listing].indexOf(this[original]);
    }

    // Methods

    /**
     * Guaranteed to insert the supplied field resolver after any other prepended
     * field resolvers and before the original internal field resolver.
     *
     * @param {GraphQLFieldResolver} preresolver a field resolver to run before
     * the original field resolver executes.
     */
  }, {
    key: "prepend",
    value: function prepend(preresolver) {
      if (preresolver && isFn(preresolver)) {
        var index = this[listing].indexOf(this[original]);
        index = ~index ? index : 0;
        this[listing].splice(index, 0, preresolver);
      }
    }

    /**
     * Inserts the supplied field resolver function after the original resolver
     * but before any previously added post resolvers. If you simply wish to
     * push another entry to the list, use `.push`
     *
     * @param {GraphQLFieldResolver} postresolver a field resolver that should
     * run after the original but before other postresolvers previously added.
     */
  }, {
    key: "append",
    value: function append(postresolver) {
      if (postresolver && isFn(postresolver)) {
        var index = this[listing].indexOf(this[original]);
        index = ~index ? index + 1 : this[listing].length;
        this[listing].splice(index, 0, postresolver);
      }
    }

    /**
     * Simply adds a field resolver to the end of the list rather than trying
     * to put it as close to the original resolver as possible.
     *
     * @param {GraphQLFieldResolver} postresolver a field resolver that should
     * run after the original
     */
  }, {
    key: "push",
    value: function push(postresolver) {
      if (postresolver && isFn(postresolver)) {
        this[listing].push(postresolver);
      }
    }

    /**
     * The `.toString()` functionality of the ExtendedResolver dutifily lists the
     * source of each function to be executed in order.
     *
     * @method toString
     *
     * @return {string} a combined toString() functionality for each item in
     * order
     */
  }, {
    key: "toString",
    value: function toString() {
      var strings = [];
      var _iterator = _createForOfIteratorHelper(this.order),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var fn = _step.value;
          strings.push("Function: ".concat(fn.name));
          strings.push("---------".concat('-'.repeat(fn.name.length ? fn.name.length + 1 : 0)));
          strings.push(fn.toString());
          strings.push('');
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return strings.join('\n');
    }

    /**
     * After having to repeatedly console.log the toString output, this function
     * now does that easier for me so I don't end up with carpal tunnel earlier
     * than necessary.
     *
     * @method show
     */
  }, {
    key: "show",
    value: function show() {
      console.log(this.toString());
    }

    // Symbols

    /**
     * Ensure that when inspected with Object.prototype.toString.call/apply
     * that instances of ExtendedResolver return `'[object ExtendedResolver]'`
     *
     * @type {Symbol}
     */
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    }

    // Statics

    /**
     * Shorthand static initializer that allows the ExtendedResolver class to
     * be instantiated using `ExtendedResolver.from()` rather than the normal
     * `new ExtendedResolver()`. Additionally it offers a way to set a result
     * patcher after initialization has occurred
     *
     * @param {GraphQLFieldResolver} resolver the resolver to initialize the
     * class instance with.
     * @param {ResolverResultsPatcher} patcher an optional function matching the
     * `ResolverResultsPatcher` signature to set to the new instance after it is
     * created.
     * @return {ExtendedResolver} a newly minted instance of the class
     * `ExtendedResolver`
     */
  }], [{
    key: "from",
    value: function from(resolver, patcher) {
      var newResolver = new ExtendedResolver(resolver);
      if (patcher) {
        newResolver.resultPatcher = patcher;
      }
      return newResolver;
    }

    /**
     * Similar to the `.from` static initializer, the `.wrap` initializer
     * takes an original field resolver, an optional patcher as in `.from`
     * as well as an array of `prepends` and `appends` field resolvers which
     * will be slotted in the appropriate locations.
     *
     * @param  {GraphQLFieldResolver} original a field resolver function that
     * is to be wrapped as the basis for the resulting `ExtendedResolver`
     * @param {ResolverResultsPatcher} patcher an optional function that allows
     * the user to patch the results of the total field resolver culmination
     * before allowing the calling code to see them.
     * @param {GraphQLFieldResolver|Array<GraphQLFieldResolver>} prepends either
     * a single GraphQLFieldResolver or an array of them to prepend before the
     * original field resolver executes
     * @param {GraphQLFieldResolver|Array<GraphQLFieldResolver>} appends either
     * a single GraphQLFieldResolver or an array of them to prepend after the
     * original field resolver executes
     * @return {[type]}          [description]
     */
  }, {
    key: "wrap",
    value: function wrap(original) {
      var prepends = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var appends = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var patcher = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var resolver = ExtendedResolver.from(original);
      if (patcher && isFn(patcher)) {
        resolver.resultPatcher = patcher;
      }
      if (prepends) {
        if (!Array.isArray(prepends)) {
          prepends = [prepends];
        }
        if (prepends.length) {
          prepends.forEach(function (fn) {
            return resolver.prepend(fn);
          });
        }
      }
      if (appends) {
        if (!Array.isArray(appends)) {
          appends = [appends];
        }
        if (appends.length) {
          appends.forEach(function (fn) {
            return resolver.append(fn);
          });
        }
      }
      return resolver;
    }

    /**
     * In the process of schema stitching, it is possible and likely that
     * a given schema has been extended or enlarged during the merging process
     * with another schema. Neither of the old schemas have any idea of the
     * layout of the newer, grander, schema. Therefore it is necessary to
     * inject the new GraphQLSchema as part of the info parameters received
     * by the resolver for both sides of the stitched schema in order to
     * prevent errors.
     *
     * This static method takes the original resolver, wraps it with a
     * prepended resolver that injects the new schema; also supplied as the
     * second parameter. The result is a newly minted `ExtendedResolver` that
     * should do the job in question.
     *
     * @param {GraphQLFieldResolver} originalResolver the original resolver todo
     * wrap.
     * @param {GraphQLSchema} newSchema the new, grander, schema with all fields
     * @param {ResolverResultsPatcher} patcher a function that will allow you to
     * modify the
     */
  }, {
    key: "SchemaInjector",
    value: function SchemaInjector(originalResolver, newSchema) {
      var patcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return ExtendedResolver.wrap(originalResolver, [function SchemaInjector(source, args, context, info) {
        if (arguments.length === 3 && context.schema) {
          context.schema = newSchema;
          context.rootValue = (0, _Schemata.stripResolversFromSchema)(newSchema);
        } else if (arguments.length === 4 && info.schema) {
          info.schema = newSchema;
          info.rootValue = (0, _Schemata.stripResolversFromSchema)(newSchema);
        }
      }], [], patcher);
    }

    /**
     * All instances of `ExtendedResolver` are Proxies to the instantiated
     * class with a specially defined `.apply` handler to make their custom
     * execution flow work.
     *
     * @type {Object}
     */
  }, {
    key: "handler",
    get: function get() {
      return {
        /**
         * Reduce the results of each resolver in the list, including
         * the original resolver. Calling each in order with the same
         * parameters and returning the coalesced results
         *
         * @param {mixed} target this should always be the object context
         * @param {mixed} thisArg the `this` object for the context of the
         * function calls
         * @param {Array<mixed>} args the arguments object as seen in all
         * graphql resolvers
         * @return {mixed} either null or some value as would have been returned
         * from the call of a graphql field resolver
         */
        apply: function apply(target, thisArg, args) {
          var _this2 = this;
          return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
            var myArgs, results, result, _iterator2, _step2, fn;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  // Ensure we have arguments as an array so we can concat results in
                  // each pass of the reduction process
                  myArgs = Array.isArray(args) ? args : Array.from(args && args || []);
                  results = {};
                  _iterator2 = _createForOfIteratorHelper(target[listing]);
                  _context.prev = 3;
                  _iterator2.s();
                case 5:
                  if ((_step2 = _iterator2.n()).done) {
                    _context.next = 19;
                    break;
                  }
                  fn = _step2.value;
                  _context.prev = 7;
                  _context.next = 10;
                  return fn.apply(thisArg || target, myArgs.concat(results));
                case 10:
                  result = _context.sent;
                  _context.next = 16;
                  break;
                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](7);
                  throw new _errors.WrappedResolverExecutionError(_context.t0, _this2, target[listing].indexOf(fn), myArgs.concat(results), thisArg || target);
                case 16:
                  if (results && results instanceof Object && result && result instanceof Object) {
                    Object.assign(results, result);
                  } else {
                    results = result;
                  }
                case 17:
                  _context.next = 5;
                  break;
                case 19:
                  _context.next = 24;
                  break;
                case 21:
                  _context.prev = 21;
                  _context.t1 = _context["catch"](3);
                  _iterator2.e(_context.t1);
                case 24:
                  _context.prev = 24;
                  _iterator2.f();
                  return _context.finish(24);
                case 27:
                  if (!(target[patcher] && target[patcher] instanceof Function)) {
                    _context.next = 37;
                    break;
                  }
                  _context.prev = 28;
                  _context.next = 31;
                  return target[patcher].call(thisArg || target, results);
                case 31:
                  results = _context.sent;
                  _context.next = 37;
                  break;
                case 34:
                  _context.prev = 34;
                  _context.t2 = _context["catch"](28);
                  throw new _errors.ResolverResultsPatcherError(_context.t2, target[patcher], thisArg || target, results);
                case 37:
                  return _context.abrupt("return", results);
                case 38:
                case "end":
                  return _context.stop();
              }
            }, _callee, null, [[3, 21, 24, 27], [7, 13], [28, 34]]);
          }))();
        }
      };
    }
  }]);
  return ExtendedResolver;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Function), Symbol.toStringTag);