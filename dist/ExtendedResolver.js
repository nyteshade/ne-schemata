"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolver = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _graphql = require("graphql");

var _Schemata = require("./Schemata");

var _errors = require("./errors");

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


var ExtendedResolver =
/*#__PURE__*/
function (_Function) {
  (0, _inherits2.default)(ExtendedResolver, _Function);

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
    (0, _classCallCheck2.default)(this, ExtendedResolver);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ExtendedResolver).call(this));

    if (resolver instanceof ExtendedResolver) {
      _this[listing] = Array.from(resolver[listing]);
      _this[original] = resolver[original];
      _this[patcher] = resolver[patcher];
    } else {
      _this[listing] = [resolver];
      _this[original] = resolver;
      _this[patcher] = null;
    }

    return (0, _possibleConstructorReturn2.default)(_this, new Proxy((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), ExtendedResolver.handler));
  } // Properties

  /**
   * Returns a handle to the internal array of ordered resolver
   * functions, should indepth modification be necessary.
   *
   * @return  {Array<GraphQLFieldResolver>} the internal list of
   * resolvers to execute in order as though it were a single resolver
   */


  (0, _createClass2.default)(ExtendedResolver, [{
    key: "prepend",
    // Methods

    /**
     * Guaranteed to insert the supplied field resolver after any other prepended
     * field resolvers and before the original internal field resolver.
     *
     * @param {GraphQLFieldResolver} preresolver a field resolver to run before
     * the original field resolver executes.
     */
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.order[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var fn = _step.value;
          strings.push("Function: ".concat(fn.name));
          strings.push("---------".concat('-'.repeat(fn.name.length ? fn.name.length + 1 : 0)));
          strings.push(fn.toString());
          strings.push('');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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
    } // Symbols

    /**
     * Ensure that when inspected with Object.prototype.toString.call/apply
     * that instances of ExtendedResolver return `'[object ExtendedResolver]'`
     *
     * @type {Symbol}
     */

  }, {
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
     */
    ,
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
     */
    ,
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
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      return this.constructor.name;
    } // Statics

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
        apply: function () {
          var _apply = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee(target, thisArg, args) {
            var myArgs, results, result, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, fn;

            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // Ensure we have arguments as an array so we can concat results in
                    // each pass of the reduction process
                    myArgs = Array.isArray(args) ? args : Array.from(args && args || []);
                    results = {};
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context.prev = 5;
                    _iterator2 = target[listing][Symbol.iterator]();

                  case 7:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                      _context.next = 22;
                      break;
                    }

                    fn = _step2.value;
                    _context.prev = 9;
                    _context.next = 12;
                    return fn.apply(thisArg || target, myArgs.concat(results));

                  case 12:
                    result = _context.sent;
                    _context.next = 18;
                    break;

                  case 15:
                    _context.prev = 15;
                    _context.t0 = _context["catch"](9);
                    throw new _errors.WrappedResolverExecutionError(_context.t0, this, target[listing].indexOf(fn), myArgs.concat(results), thisArg || target);

                  case 18:
                    if (results && results instanceof Object && result && result instanceof Object) {
                      Object.assign(results, result);
                    } else {
                      results = result;
                    }

                  case 19:
                    _iteratorNormalCompletion2 = true;
                    _context.next = 7;
                    break;

                  case 22:
                    _context.next = 28;
                    break;

                  case 24:
                    _context.prev = 24;
                    _context.t1 = _context["catch"](5);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context.t1;

                  case 28:
                    _context.prev = 28;
                    _context.prev = 29;

                    if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                      _iterator2.return();
                    }

                  case 31:
                    _context.prev = 31;

                    if (!_didIteratorError2) {
                      _context.next = 34;
                      break;
                    }

                    throw _iteratorError2;

                  case 34:
                    return _context.finish(31);

                  case 35:
                    return _context.finish(28);

                  case 36:
                    if (!(target[patcher] && target[patcher] instanceof Function)) {
                      _context.next = 46;
                      break;
                    }

                    _context.prev = 37;
                    _context.next = 40;
                    return target[patcher].call(thisArg || target, results);

                  case 40:
                    results = _context.sent;
                    _context.next = 46;
                    break;

                  case 43:
                    _context.prev = 43;
                    _context.t2 = _context["catch"](37);
                    throw new _errors.ResolverResultsPatcherError(_context.t2, target[patcher], thisArg || target, results);

                  case 46:
                    return _context.abrupt("return", results);

                  case 47:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[5, 24, 28, 36], [9, 15], [29,, 31, 35], [37, 43]]);
          }));

          function apply(_x, _x2, _x3) {
            return _apply.apply(this, arguments);
          }

          return apply;
        }()
      };
    }
  }]);
  return ExtendedResolver;
}((0, _wrapNativeSuper2.default)(Function));

exports.ExtendedResolver = ExtendedResolver;