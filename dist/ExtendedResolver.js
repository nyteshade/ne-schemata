"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.function.bind.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.proto.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.array.reverse.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolver = void 0;
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
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
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
  _inherits(ExtendedResolver, _Function);
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
    _classCallCheck(this, ExtendedResolver);
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
    return _possibleConstructorReturn(_this, new Proxy(_assertThisInitialized(_this), ExtendedResolver.handler));
  }

  // Properties

  /**
   * Returns a handle to the internal array of ordered resolver
   * functions, should indepth modification be necessary.
   *
   * @return  {Array<GraphQLFieldResolver>} the internal list of
   * resolvers to execute in order as though it were a single resolver
   */
  _createClass(ExtendedResolver, [{
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
          return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            var myArgs, results, result, _iterator2, _step2, fn;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
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
}( /*#__PURE__*/_wrapNativeSuper(Function), Symbol.toStringTag);