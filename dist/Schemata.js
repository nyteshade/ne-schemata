"use strict";

require("core-js/modules/es.array.join.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.proto.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.reverse.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.object.freeze.js");
require("core-js/modules/es.object.define-properties.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultConflictResolvers = void 0;
exports.DefaultDirectiveMergeResolver = DefaultDirectiveMergeResolver;
exports.DefaultEnumMergeResolver = DefaultEnumMergeResolver;
exports.DefaultFieldMergeResolver = DefaultFieldMergeResolver;
exports.DefaultMergeOptions = void 0;
exports.DefaultScalarMergeResolver = DefaultScalarMergeResolver;
exports.DefaultUnionMergeResolver = DefaultUnionMergeResolver;
exports.SCHEMA_DIRECTIVES = exports.MAP = exports.GRAPHIQL_FLAG = exports.EXE = void 0;
exports.SchemaInjectorConfig = SchemaInjectorConfig;
exports.isRootType = exports["default"] = exports.TYPEDEFS_KEY = exports.Schemata = void 0;
exports.normalizeSource = normalizeSource;
exports.runInjectors = runInjectors;
exports.stripResolversFromSchema = stripResolversFromSchema;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.function.bind.js");
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.find.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.string.ends-with.js");
require("core-js/modules/es.array.index-of.js");
require("core-js/modules/es.array.splice.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.some.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.map.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/es.weak-set.js");
require("core-js/modules/es.symbol.species.js");
require("core-js/modules/es.array.species.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
var _promises = require("fs/promises");
var _path = require("path");
var _graphql = require("graphql");
var _GraphQLExtension = require("./GraphQLExtension");
var _dynamicImport = require("./dynamicImport");
var _resolverwork = require("./utils/resolverwork");
var _ExtendedResolverMap = require("./ExtendedResolverMap");
var _ExtendedResolver = require("./ExtendedResolver");
var _neTagFns = require("ne-tag-fns");
var _walkResolverMap = require("./walkResolverMap");
var _deepmerge = _interopRequireDefault(require("deepmerge"));
var _util = _interopRequireDefault(require("util"));
var _forEachOf2 = require("./forEachOf");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
var _Symbol$species, _Symbol$iterator, _Symbol$toStringTag, _Util$inspect$custom;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
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
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
var debug_log = require('debug')('schemata:normal');
var debug_trace = require('debug')('schemata:trace');
var _generateSchema = /*#__PURE__*/new WeakSet();
_Symbol$species = Symbol.species;
_Symbol$iterator = Symbol.iterator;
_Symbol$toStringTag = Symbol.toStringTag;
_Util$inspect$custom = _util["default"].inspect.custom;
/**
 * A small `String` extension that makes working with SDL/IDL text far easier
 * in both your own libraries as well as in a nodeJS REPL. Built-in to what
 * appears to be a normal String for all intents and purposes, are the ability
 * to transform the string into a set of AST nodes, a built schema or back to
 * the SDL string.
 *
 * @class  Schemata
 */
var Schemata = exports.Schemata = /*#__PURE__*/function (_String) {
  _inherits(Schemata, _String);
  var _super = _createSuper(Schemata);
  /**
   * Creates a new `String`, presumably of SDL or IDL. The getter `.valid`
   * will provide some indication as to whether or not the code is valid.
   *
   * @constructor
   * @memberOf Schemata
   *
   * @param {SchemaSource} typeDefs an instance of Schemata, a string of SDL,
   * a Source instance of SDL, a GraphQLSchema or ASTNode that can be printed
   * as an SDL string
   * @param {ResolverMap} resolvers an object containing field resolvers for
   * for the schema represented with this string. [Optional]
   * @param {boolean} buildResolvers if this flag is set to true, build a set
   * of resolvers after the rest of the instance is initialized and set the
   * results on the `.resolvers` property of the newly created instance. If
   * buildResolvers is the string "all", then a resolver for each field not
   * defined will be returned with a `defaultFieldResolver` as its value
   * @param {boolean} flattenResolvers if true, and if `buildResolvers` is true,
   * then make an attempt to flatten the root types to the base of the
   * resolver map object.
   */
  function Schemata(typeDefs) {
    var _this;
    var _resolvers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var buildResolvers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var flattenResolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    _classCallCheck(this, Schemata);
    _this = _super.call(this, normalizeSource(typeDefs));
    /**
       * Returns a GraphQLSchema object. Note this will fail and throw an error
       * if there is not at least one Query, Subscription or Mutation type defined.
       * If there is no stored schema, and there are resolvers, an executable
       * schema is returned instead.
       *
       * @return {GraphQLSchema} an instance of GraphQLSchema if valid SDL
       */
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _generateSchema);
    _resolvers = _resolvers || typeDefs instanceof Schemata && typeDefs.resolvers || typeDefs instanceof _graphql.GraphQLSchema && stripResolversFromSchema(typeDefs) || null;
    _this[GRAPHIQL_FLAG] = true;
    _this[TYPEDEFS_KEY] = normalizeSource(typeDefs);
    _this[MAP] = new WeakMap();
    _this[MAP].set(wmkSchema, typeDefs instanceof _graphql.GraphQLSchema ? typeDefs : null);
    _this[MAP].set(wmkResolvers, _resolvers);
    _this[MAP].set(wmkPreboundResolvers, typeDefs instanceof Schemata ? typeDefs.prevResolverMaps : []);

    // Mark a schema passed to use in the constructor as an executable schema
    // to prevent any replacement of the value by getters that generate a
    // schema from the SDL
    if (_this[MAP].get(wmkSchema)) {
      _this[MAP].get(wmkSchema)[EXE] = true;
      _this[MAP].get(wmkSchema)[Symbol["for"]('constructor-supplied-schema')] = true;
    }

    // If buildResolvers is true, after the rest is already set and done, go
    // ahead and build a new set of resolver functions for this instance
    if (buildResolvers) {
      if (buildResolvers === 'all') {
        _this[MAP].set(wmkResolvers, _this.buildResolverForEachField(flattenResolvers));
      } else {
        _this[MAP].set(wmkResolvers, _this.buildResolvers(flattenResolvers));
      }
    }
    return _this;
  }

  /**
   * Symbol.species ensures that any String methods used on this instance will
   * result in a Schemata instance rather than a String. NOTE: this does not
   * work as expected in current versions of node. This bit of code here is
   * basically a bit of future proofing for when Symbol.species starts working
   * with String extended classes
   *
   * @type {Function}
   */
  _createClass(Schemata, [{
    key: _Symbol$iterator,
    get:
    /**
     * Redefine the iterator for Schemata instances so that they simply show the
     * contents of the SDL/typeDefs.
     *
     * @type {Function}
     */
    function get() {
      return /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.toString();
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }).bind(this);
    }

    /**
     * Ensures that instances of Schemata report internally as Schemata object.
     * Specifically using things like `Object.prototype.toString`.
     *
     * @type {string}
     */
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    }

    /**
     * Returns the AST nodes for this snippet of SDL. It will throw an error
     * if the string is not valid SDL/IDL.
     *
     * @return {ASTNode} any valid ASTNode supported by GraphQL
     */
  }, {
    key: "ast",
    get: function get() {
      return this.constructor.parse(this.sdl, false);
    }

    /**
     * Retrieves the `graphiql` flag, which defaults to true. This flag can
     * make setting up an endpoint from a Schemata instance easier with
     * express-graphql
     *
     * @type {boolean}
     */
  }, {
    key: "graphiql",
    get: function get() {
      return this[GRAPHIQL_FLAG];
    }

    /**
     * Setter to alter the default 'true' flag to make an Schemata instance a
     * valid single argument to functions like `graphqlHTTP()` from express
     * GraphQL.
     *
     * NOTE: this flag means nothing to the Schemata class but might be useful in
     * your project.
     *
     * @type {boolean} true if graphiql should be started; false otherwise
     */
  }, {
    key: "graphiql",
    set: function set(value) {
      this[GRAPHIQL_FLAG] = value;
    }

    /**
     * Returns a GraphQLSchema object. Note this will fail and throw an error
     * if there is not at least one Query, Subscription or Mutation type defined.
     * If there is no stored schema, and there are resolvers, an executable
     * schema is returned instead.
     *
     * @return {GraphQLSchema} an instance of GraphQLSchema if valid SDL
     */
  }, {
    key: "schema",
    get: function get() {
      return _classPrivateMethodGet(this, _generateSchema, _generateSchema2).call(this);
    }

    /**
     * Sets a GraphQLSchema object on the internal weak map store. If the value
     * supplied is not truthy (i.e. null, undefined, or even false) then this
     * method deletes any stored schema in the internal map. Otherwise, the
     * supplied value is set on the map and subsequent get calls to `.schema`
     * will return the value supplied.
     *
     * If there are bound resolvers on the supplied schema, a symbol denoting
     * that the schema is an executable schema will be set to prevent it from
     * being overwritten on subsequent get operations. The bound resolvers will
     * be merged with the Schemata's resolvers object.
     *
     * If resolvers are subsequently set on the `Schemata` instance and the
     * supplied schema does not have resolvers bound to it, subsequent get
     * requests for the internal `.schema` may auto-generate a new one with
     * bound resolvers. You have been warned. =)
     *
     * @param {GraphQLSchema} schema an instance of GraphQLSchema instance to
     * store on the internal weak map. Any schema stored here will be modified
     * by methods that do so.
     */
  }, {
    key: "schema",
    set: function set(schema) {
      debug_log('[set .schema]: ', schema ? 'truthy' : 'falsey');
      debug_trace('[set .schema] ', schema);
      if (!schema) {
        this[MAP]["delete"](wmkSchema);
      } else {
        var schemaResolvers = stripResolversFromSchema(schema);
        if (Object.keys(schemaResolvers).length) {
          schema[EXE] = true;
          (0, _deepmerge["default"])(this.resolvers = this.resolvers || {}, schemaResolvers);
        }
        this[MAP].set(wmkSchema, schema);
      }
    }

    /**
     * Retrieves the `schemaDirectives` value, which defaults to true. This
     * value can make setting up an endpoint from a Schemata instance easier
     * with apollo-server or graphql-yoga or compatible variants. See
     * https://www.apollographql.com/docs/graphql-tools/schema-directives.html
     * if you are using this value with apollo-server.
     *
     * @type {Object}
     */
  }, {
    key: "schemaDirectives",
    get: function get() {
      return this[SCHEMA_DIRECTIVES];
    }

    /**
     * Retrieves the `schemaDirectives` value, which defaults to true. This
     * value can make setting up an endpoint from a Schemata instance easier
     * with apollo-server or graphql-yoga or compatible variants. See
     * https://www.apollographql.com/docs/graphql-tools/schema-directives.html
     * if you are using this value with apollo-server.
     *
     * @type {Object}
     */
  }, {
    key: "schemaDirectives",
    set: function set(value) {
      this[SCHEMA_DIRECTIVES] = value;
    }

    /**
     * When a Schemata instance is merged with another GraphQLSchema, its
     * resolvers get stored before they are wrapped in a function that updates
     * the schema object it receives. This allows them to be wrapped safely at
     * a later date should this instance be merged with another.
     *
     * @return {Array<ExtendedResolverMap>} an array of `ExtendedResolverMap`
     * object instances
     */
  }, {
    key: "prevResolverMaps",
    get: function get() {
      return this[MAP].get(wmkPreboundResolvers);
    }

    /**
     * Sets the pre-bound resolver map objects as an array of
     * `ExtendedResolverMap` object instances on this instance of Schemata
     *
     * @param {Array<ExtendedResolverMap>} maps an array of `ExtendedResolverMap`
     * object instances
     */
  }, {
    key: "prevResolverMaps",
    set: function set(maps) {
      this[MAP].set(wmkPreboundResolvers, maps);
    }

    /**
     * Returns a GraphQLSchema object, pre-bound, to the associated resolvers
     * methods in `.resolvers`. If there are no resolvers, this is essentially
     * the same as asking for a schema instance using `.schema`. If the SDL
     * this instance is built around is insufficient to generate a GraphQLSchema
     * instance, then an error will be thrown.
     *
     * @deprecated use `.schema` instead; this simply proxies to that
     * @return {GraphQLSchema} an instance of GraphQLSchema with pre-bound
     * resolvers
     */
  }, {
    key: "executableSchema",
    get: function get() {
      return this.schema;
    }

    /**
     * Returns the string this instance was generated with.
     *
     * @return {string} the string this class instance represents
     */
  }, {
    key: "sdl",
    get: function get() {
      return this[TYPEDEFS_KEY];
    }

    /**
     * Rewrites the typeDefs or SDL without any `extend type` definitions
     * and returns the modified instance.
     *
     * @return {Schemata} the instance of Schemata this method was called
     * on with modified typeDefs in place.
     */
  }, {
    key: "flattenSDL",
    value: function flattenSDL() {
      if (this.schema) {
        this[TYPEDEFS_KEY] = (0, _graphql.printSchema)(this.schema);
      }
      return this;
    }

    /**
     * Returns the regenerated SDL representing the Schema object on this
     * Schemata instance. It does not modify the schemata object instance
     * in any way.
     *
     * @return {string} the regenerated schema SDL from the actual
     * schema object on this schemata instance.
     */
  }, {
    key: "flatSDL",
    get: function get() {
      var sdl = this[TYPEDEFS_KEY];
      if (this.schema) {
        sdl = (0, _graphql.printSchema)(this.schema);
      }
      return sdl;
    }

    /**
     * A synonym or alias for `.sdl`. Placed here for the express purpose of
     * destructuing when used with Apollo's makeExecutableSchema or other
     * libraries expecting values of the same name
     *
     * i.e.
     *   // sdl.typeDefs and sdl.resolvers will be where the function expects
     *   let schema = require('graphql-tools').makeExecutableSchema(sdl)
     *
     * @return {string} a string of SDL/IDL for use with graphql
     */
  }, {
    key: "typeDefs",
    get: function get() {
      return this.sdl;
    }

    /**
     * Walks the types defined in the sdl for this instance of Schemata and
     * returns an object mapping for those definitions. Given a schema such as
     * ```
     * type A {
     *   a: String
     *   b: [String]
     *   c: [String]!
     * }
     * type Query {
     *   As(name: String): [A]
     * }
     * ```
     * a JavaScript object with properties such as the following will be
     * returned
     * ```
     * {
     *   Query: {
     *     As: { type: '[A]', args: [{ name: 'String' }] }
     *   },
     *   A: {
     *     a: { type: 'String', args: [] },
     *     b: { type: '[String]', args: [] },
     *     c: { type: '[String]!', args: [] }
     *   }
     * }
     * ```
     */
  }, {
    key: "types",
    get: function get() {
      var types = {};
      this.forEachTypeField(function (t, tn, td, f, fn, fa, fd, schema, c) {
        var ast = (0, _graphql.parse)((0, _graphql.printType)(t)).definitions[0];
        var fieldAST = ast.fields.filter(function (o, i, a) {
          return o.name.value == fn;
        });
        var fieldType = fieldAST.length && (0, _graphql.typeFromAST)(schema, fieldAST[0].type);
        var args = [];
        if (fa !== null && fa !== void 0 && fa.length) {
          var _iterator = _createForOfIteratorHelper(fa),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _step$value = _step.value,
                name = _step$value.name,
                type = _step$value.type;
              args.push(_defineProperty({}, name, type.toString()));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        (types[tn] = types[tn] || {})[fn] = {
          type: fieldType.toString(),
          args: args
        };
      });
      return types;
    }

    /**
     * An internal call to buildResolvers(true), thereby requesting a flattened
     * resolver map with Query, Mutation and Subscription fields exposed as root
     * objects the way the Facebook reference implementation expects
     *
     * @return {Object} an object of functions or an empty object otherwise
     */
  }, {
    key: "rootValue",
    get: function get() {
      return this.buildResolvers(true);
    }

    /**
     * Returns any resolvers function object associated with this instance.
     *
     * @return {Object} an object containing field resolvers or null if none
     * are stored within
     */
  }, {
    key: "resolvers",
    get: function get() {
      return this[MAP].get(wmkResolvers);
    }

    /**
     * Parses the resolvers object, if present, for any items that need to
     * be applied after the schema is constructed.
     *
     * @return {Array<Object>} an array of objects to process or an empty
     * array if there is nothing to work on
     */
  }, {
    key: "resolverInfo",
    get: function get() {
      return (0, _resolverwork.extractResolverInfo)(this.resolvers);
    }

    /**
     * A method to fetch a particular field resolver from the schema represented
     * by this Schemata instance.
     *
     * @param {string} type the name of the type desired
     * @param {string} field the name of the field containing the resolver
     * @return {Function} the function resolver for the type and field in
     * question
     */
  }, {
    key: "schemaResolverFor",
    value: function schemaResolverFor(type, field) {
      if (!this.resolvers || !Object.keys(this.resolvers).length || !this.valid) {
        return null;
      }
      var _type = this.schema.getType(type);
      var _field = _type.getFields() && _type.getFields()[field] || null;
      var resolve = (_field === null || _field === void 0 ? void 0 : _field.resolve) || null;
      return resolve;
    }

    /**
     * Builds a schema based on the SDL in the instance and then parses it to
     * fetch a named field in a named type. If either the type or field are
     * missing or if the SDL cannot be built as a schema, null is returned.
     *
     * @param {string} type the name of a type
     * @param {string} field the name of a field contained in the above type
     * @return {FieldNode} the field reference in the type and field supplied
     */
  }, {
    key: "schemaFieldByName",
    value: function schemaFieldByName(type, field) {
      if (!this.validSchema || !this.schema) {
        return null;
      }
      var _type = this.schema.getType(type);
      var _field = _type.getFields() && _type.getFields()[field] || null;
      return _field;
    }

    /**
     * For SDL that doesn't properly build into a GraphQLSchema, it can still be
     * parsed and searched for a type by name.
     *
     * @param {string} type the name of a type
     * @return {FieldNode} the field reference in the type and field supplied
     */
  }, {
    key: "astTypeByName",
    value: function astTypeByName(type) {
      if (!this.validSDL) {
        return null;
      }
      var _type = this.ast.definitions.find(function (f) {
        return f.name.value === type;
      });
      return _type;
    }

    /**
     * For SDL that doesn't properly build into a GraphQLSchema, it can still be
     * searched for a type and field.
     *
     * @param {string} type the name of a type
     * @param {string} field the name of a field contained in the above type
     * @return {FieldNode} the field reference in the type and field supplied
     */
  }, {
    key: "astFieldByName",
    value: function astFieldByName(type, field) {
      if (!this.validSDL) {
        return null;
      }
      var _type = this.ast.definitions.find(function (f) {
        return f.name.value === type;
      });
      var _field = (_type === null || _type === void 0 ? void 0 : _type.fields.find(function (f) {
        return f.name.value === field;
      })) || null;
      return _field;
    }

    /**
     * Walks the AST for this SDL string and checks for the names of the fields
     * of each of the root types; Query, Mutation and Subscription. If there are
     * no root types defined, false is returned.
     *
     * If there is at least one root type *and* some resolvers *and* at least one
     * of the fields of at least one root type is present in the root of the
     * resolvers map, true is returned. Otherwise, false.
     *
     * @return {boolean} true if the defined resolvers have at least one root
     * type field as a resolver on the root of the resolver map; false otherwise.
     */
  }, {
    key: "hasFlattenedResolvers",
    get: function get() {
      var asts = this.validSDL && this.ast.definitions || null;
      if (!asts || !this.resolvers) {
        return false;
      }
      var query = asts.find(function (f) {
        return f.name.value == 'Query';
      });
      var mutation = asts.find(function (f) {
        return f.name.value == 'Mutation';
      });
      var subscription = asts.find(function (f) {
        return f.name.value == 'Subscription';
      });
      var resolvers = this.resolvers;
      if (!query && !mutation && !subscription) {
        return false;
      }
      for (var _i = 0, _arr = [query, mutation, subscription]; _i < _arr.length; _i++) {
        var type = _arr[_i];
        if (!(type !== null && type !== void 0 && type.fields)) {
          continue;
        }
        var _iterator2 = _createForOfIteratorHelper(type.fields),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var field = _step2.value;
            if (field.name.value in resolvers) {
              return true;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      return false;
    }

    /**
     * Merging Schematas are a common feature in the modern world of GraphQL.
     * Especially when there are multiple teams working in tandem. This feature
     * supports merging of types, extended types, interfaces, enums, unions,
     * input object types and directives for all of the above.
     *
     * @param {SchemaSource} schemaLanguage an instance of Schemata, a string of
     * SDL, a Source instance of SDL, a GraphQLSchema or ASTNode that can be
     * printed as an SDL string
     * @param {ConflictResolvers} conflictResolvers an object containing up to
     * four methods, each describing how to handle a conflict when an associated
     * type of conflict occurs. If no object or method are supplied, the right
     * hande value always takes precedence over the existing value; replacing it
     * @return {Schemata} a new instance of Schemata
     */
  }, {
    key: "mergeSDL",
    value: function mergeSDL(schemaLanguage) {
      var _this2 = this;
      var conflictResolvers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultConflictResolvers;
      var source = normalizeSource(schemaLanguage, true);
      if (!source) {
        throw new Error((0, _neTagFns.inline)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        The call to mergeSDL(schemaLanguage, conflictResolvers) received an\n        invalid value for schemaLanguage. Please check your code and try again.\n        Received ", ".\n      "])), schemaLanguage));
      }
      var lAST = this.ast;
      var rAST = source.ast;
      var _scalarFns = {};

      // Ensure we have default behavior with any custom behavior assigned
      // atop the default ones should only a partial custom be supplied.
      conflictResolvers = (0, _deepmerge["default"])(DefaultConflictResolvers, conflictResolvers);
      var _iterator3 = _createForOfIteratorHelper(rAST.definitions),
        _step3;
      try {
        var _loop = function _loop() {
          var _rType;
          var rType = _step3.value;
          var lType = lAST.definitions.find(function (a) {
            return a.name.value == rType.name.value;
          });
          if ((_rType = rType) !== null && _rType !== void 0 && (_rType = _rType.kind) !== null && _rType !== void 0 && _rType.endsWith('Extension')) {
            rType = (0, _deepmerge["default"])({}, rType);
            rType.kind = rType.kind.substring(0, rType.kind.length - 9) + 'Definition';
          }
          if (!lType) {
            lAST.definitions.push(rType);
            return 1; // continue
          }
          switch (lType.kind) {
            case 'EnumTypeDefinition':
              combineTypeAndSubType('directives', lType, rType, conflictResolvers);
              combineTypeAndSubType('values', lType, rType, conflictResolvers);
              break;
            case 'UnionTypeDefinition':
              combineTypeAndSubType('directives', lType, rType, conflictResolvers);
              combineTypeAndSubType('types', lType, rType, conflictResolvers);
              break;
            case 'ScalarTypeDefinitionNode':
              {
                var lScalar;
                var lScalarConfig;
                var rScalar;
                var rScalarConfig;
                var resolver;
                combineTypeAndSubType('directives', lType, rType, conflictResolvers);
                if (_this2.schema) {
                  var _lScalar;
                  lScalar = _this2.schema.getType(lType.name.value);
                  lScalarConfig = ((_lScalar = lScalar) === null || _lScalar === void 0 ? void 0 : _lScalar._scalarConfig) || null;
                }
                if (source.schema) {
                  var _rScalar;
                  rScalar = source.schema.getType(rType.name.value);
                  rScalarConfig = ((_rScalar = rScalar) === null || _rScalar === void 0 ? void 0 : _rScalar._scalarConfig) || null;
                }
                resolver = (conflictResolvers.scalarMergeResolver || DefaultConflictResolvers.scalarMergeResolver)(lType, lScalarConfig, rType, rScalarConfig);
                if (resolver) {
                  _scalarFns[lType.name.value] = _scalarFns[lType.name.value] || {};
                  _scalarFns[lType.name.value] = resolver;
                }
                break;
              }
            case 'ObjectTypeDefinition':
            case 'ObjectTypeDefinitionExtension':
            case 'InterfaceTypeDefinition':
            case 'InterfaceTypeDefinitionExtension':
            case 'InputObjectTypeDefinition':
            case 'InputObjectTypeDefinitionExtension':
            default:
              combineTypeAndSubType('directives', lType, rType, conflictResolvers);
              combineTypeAndSubType('fields', lType, rType, conflictResolvers);
              break;
          }
        };
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          if (_loop()) continue;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var merged = Schemata.from(this.constructor.gql.print(lAST));
      if (Object.keys(_scalarFns).length) {
        for (var _i2 = 0, _Object$keys = Object.keys(_scalarFns); _i2 < _Object$keys.length; _i2++) {
          var typeName = _Object$keys[_i2];
          merged.schema.getType(typeName)._scalarConfig = _scalarConfig[typeName];
        }
      }
      return merged;
    }

    /**
     * Paring down Schematas can be handy for certain types of schema stitching.
     * The SDL passed in and any associated resolvers will be removed from
     * a copy of the SDL in this Schemata instance represents and the resolver
     * map passed in.
     *
     * @param {SchemaSource} schemaLanguage an instance of Schemata, a string of
     * SDL, a Source instance of SDL, a GraphQLSchema or ASTNode that can be
     * printed as an SDL string
     * @param {ResolverMap} resolverMap an object containing resolver functions,
     * from either those set on this instance or those in the resolverMap added in
     * @return {Schemata} a new Schemata instance with the changed values set
     * on it
     */
  }, {
    key: "pareSDL",
    value: function pareSDL(schemaLanguage) {
      var resolverMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var source = normalizeSource(schemaLanguage, true);
      if (!source) {
        throw new Error((0, _neTagFns.inline)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        In the call to pareSDL(schemaLanguage), the supplied value for\n        `schemaLanguage` could not be parsed.\n      "], ["\n        In the call to pareSDL(schemaLanguage), the supplied value for\n        \\`schemaLanguage\\` could not be parsed.\n      "]))));
      }
      if (schemaLanguage instanceof _graphql.GraphQLSchema && !resolverMap) {
        resolverMap = stripResolversFromSchema(schemaLanguage);
      }
      var resolvers = (0, _deepmerge["default"])({}, resolverMap || this.resolvers || {});
      var lAST = this.ast;
      var rAST = source.ast;
      var _iterator4 = _createForOfIteratorHelper(rAST.definitions),
        _step4;
      try {
        var _loop2 = function _loop2() {
          var _rType2;
          var rType = _step4.value;
          var lType = lAST.definitions.find(function (a) {
            return a.name.value == rType.name.value;
          });
          if ((_rType2 = rType) !== null && _rType2 !== void 0 && (_rType2 = _rType2.kind) !== null && _rType2 !== void 0 && _rType2.endsWith('Extension')) {
            var len = 'Extension'.length;
            rType = (0, _deepmerge["default"])({}, rType);
            rType.kind = rType.kind.substring(0, rType.kind.length - len) + 'Definition';
          }
          if (!lType) {
            lAST.definitions.push(rType);
            return 1; // continue
          }
          switch (lType.kind) {
            case 'EnumTypeDefinition':
              pareTypeAndSubType('directives', lType, rType, resolvers);
              pareTypeAndSubType('values', lType, rType, resolvers);
              if (!lType.values.length) {
                var index = lAST.definitions.indexOf(lType);
                if (index !== -1) {
                  lAST.definitions.splice(index, 1);
                }
              }
              break;
            case 'UnionTypeDefinition':
              pareTypeAndSubType('directives', lType, rType, resolvers);
              pareTypeAndSubType('types', lType, rType, resolvers);
              if (!lType.types.length) {
                var _index = lAST.definitions.indexOf(lType);
                if (_index !== -1) {
                  lAST.definitions.splice(_index, 1);
                }
              }
              break;
            case 'ScalarTypeDefinitionNode':
              {
                var _index2 = lAST.definitions.indexOf(lType);
                if (_index2 !== -1) {
                  lAST.definitions.splice(_index2, 1);
                }
                break;
              }
            case 'ObjectTypeDefinition':
            case 'ObjectTypeDefinitionExtension':
            case 'InterfaceTypeDefinition':
            case 'InterfaceTypeDefinitionExtension':
            case 'InputObjectTypeDefinition':
            case 'InputObjectTypeDefinitionExtension':
            default:
              pareTypeAndSubType('directives', lType, rType, resolvers);
              pareTypeAndSubType('fields', lType, rType, resolvers);
              if (!lType.fields.length) {
                var _index3 = lAST.definitions.indexOf(lType);
                if (_index3 !== -1) {
                  lAST.definitions.splice(_index3, 1);
                }
              }
              break;
          }
        };
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          if (_loop2()) continue;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      var result = Schemata.from(this.constructor.gql.print(lAST), resolvers);
      _classPrivateMethodGet(result, _generateSchema, _generateSchema2).call(result);
      return result;
    }

    /**
     * A new Schemata object instance with merged schema definitions as its
     * contents as well as merged resolvers and newly bound executable schema are
     * all created in this step and passed back. The object instance itself is
     * not modified
     *
     * Post merge, the previously stored and merged resolvers map are are applied
     * and a new executable schema is built from the ashes of the old.
     *
     * @param {GraphQLSchema} schema an instance of GraphQLSchema to merge
     * @param {ConflictResolvers} conflictResolvers an object containing up to
     * four methods, each describing how to handle a conflict when an associated
     * type of conflict occurs. If no object or method are supplied, the right
     * hande value always takes precedence over the existing value; replacing it
     * @return {Schemata} a new instance of Schemata with a merged schema string,
     * merged resolver map and newly bound executable schema attached are all
     * initiated
     */
  }, {
    key: "merge",
    value: function merge(schema) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultMergeOptions;
      if (!schema) {
        throw new Error((0, _neTagFns.inline)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n        In the call to mergeSchema(schema), ", " was received as a value\n        and the code could not proceed because of it. Please check your code\n        and try again\n      "])), schema));
      }

      // Step0: Ensure we have all the defaults for config and schema
      schema = normalizeSource(schema, true);
      if (config !== DefaultMergeOptions) {
        var mergedConfig = (0, _deepmerge["default"])({}, DefaultMergeOptions);
        config = (0, _deepmerge["default"])(mergedConfig, config);
      }

      // Step1: Merge SDL; quit at this point if there are no resolvers
      var left = Schemata.from(this, undefined, true);
      var right = Schemata.from(schema, undefined, true);
      var merged = left.mergeSDL(right, config.conflictResolvers);

      // If neither schemata instance has a resolver, there is no reason
      // to continue. Return the merged schemas and call it a day.
      if ((!left.resolvers || !Object.keys(left.resolvers).length) && (!right.resolvers || !Object.keys(right.resolvers).length)) {
        return merged;
      }

      // Step2: Backup resolvers from left, right, or both
      var prevMaps = (left.prevResolverMaps || []).concat(right.prevResolverMaps || [], _ExtendedResolverMap.ExtendedResolverMap.from(left), _ExtendedResolverMap.ExtendedResolverMap.from(right));
      merged.prevResolverMaps = prevMaps;

      // Step3: Merge resolvers
      var mergeResolvers = {};
      if (prevMaps !== null && prevMaps !== void 0 && prevMaps.length) {
        mergeResolvers = prevMaps.reduce(function (p, c, i, a) {
          return (0, _deepmerge["default"])(p, c.resolvers || {});
        }, {});
      } else {
        (0, _deepmerge["default"])(mergeResolvers, left.resolvers);
        (0, _deepmerge["default"])(mergeResolvers, right.resolvers);
      }
      merged.resolvers = mergeResolvers;

      // Step 4: Trigger a new schema creation
      if (config.createMissingResolvers) {
        merged.resolvers = merged.buildResolverForEachField();
      }
      merged.clearSchema();
      _classPrivateMethodGet(merged, _generateSchema, _generateSchema2).call(merged);

      // Step5: Wrap resolvers
      if (config.injectMergedSchema) {
        merged.forEachField(function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) {
          if (field.resolve) {
            field.resolve = _ExtendedResolver.ExtendedResolver.SchemaInjector(field.resolve, merged.schema);
            if (!merged.resolvers[typeName]) {
              merged.resolvers[typeName] = {};
            }
            merged.resolvers[typeName][fieldName] = field.resolve;
          }
        });

        // Do this once more to ensure we are using the modified resolvers
        merged.clearSchema();
        _classPrivateMethodGet(merged, _generateSchema, _generateSchema2).call(merged);
      }

      // Step6: Return final merged product
      return merged;
    }

    /**
     * Shortcut for the merge() function; mergeSDL still exists as an entity of
     * itself, but merge() will invoke that function as needed to do its job and
     * if there aren't any resolvers to consider, the functions act identically.
     *
     * @see merge
     *
     * @param {GraphQLSchema} schema an instance of GraphQLSchema to merge
     * @param {ConflictResolvers} conflictResolvers an object containing up to
     * four methods, each describing how to handle a conflict when an associated
     * type of conflict occurs. If no object or method are supplied, the right
     * hande value always takes precedence over the existing value; replacing it
     * @return {Schemata} a new instance of Schemata with a merged schema string,
     * merged resolver map and newly bound executable schema attached are all
     * initiated
     */
  }, {
    key: "mergeSchema",
    value: function mergeSchema(schema) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultMergeOptions;
      return this.merge(schema, config);
    }

    /**
     * Given a schema, based on the Schemata this object is based on, walk it and
     * build up a resolver map. This function will always return a non-null
     * object. It will be empty if there are either no resolvers to be found
     * in the schema or if a valid schema cannot be created.
     *
     * @param {boolean|ResolverMap} flattenRootResolversOrFirstParam if this
     * value is boolean, and if this value is true, the resolvers from Query,
     * Mutation and Subscription types will be flattened to the root of the
     * object. If the first parametr is an Object, it will be merged in normally
     * with merge.
     * @param {Array<ResolverMap>} ...extendWith an unlimited array of objects
     * that can be used to extend the built resolver map.
     * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
     */
  }, {
    key: "buildResolvers",
    value: function buildResolvers(flattenRootResolversOrFirstParam) {
      var schemata = Schemata.from(this.sdl, this.resolvers);
      var resolvers = (0, _deepmerge["default"])({}, stripResolversFromSchema(schemata.schema) || schemata.resolvers || {});

      // Next check to see if we are flattening or simply extending
      if (typeof flattenRootResolversOrFirstParam === 'boolean') {
        for (var _i3 = 0, _arr2 = ['Query', 'Mutation', 'Subscription']; _i3 < _arr2.length; _i3++) {
          var rootType = _arr2[_i3];
          if (flattenRootResolversOrFirstParam) {
            if (resolvers[rootType]) {
              for (var _i4 = 0, _Object$keys2 = Object.keys(resolvers[rootType]); _i4 < _Object$keys2.length; _i4++) {
                var field = _Object$keys2[_i4];
                resolvers[field] = resolvers[rootType][field];
                delete resolvers[rootType][field];
              }
              delete resolvers[rootType];
            }
          } else {
            for (var _i5 = 0, _Object$keys3 = Object.keys(resolvers); _i5 < _Object$keys3.length; _i5++) {
              var _field2 = _Object$keys3[_i5];
              try {
                debug_log('[buildResolvers()] finding field in schema');
                if (schemata.schemaFieldByName(rootType, _field2)) {
                  resolvers[rootType] = resolvers[rootType] || {};
                  resolvers[rootType][_field2] = resolvers[_field2];
                  delete resolvers[_field2];
                }
              } catch (error) {
                debug_log((0, _neTagFns.inline)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n                [buildResolvers()] Falling back to `astFieldByName()`\n              "], ["\n                [buildResolvers()] Falling back to \\`astFieldByName()\\`\n              "]))));
                debug_trace((0, _neTagFns.inline)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n                [buildResolvers()] Falling back to `astFieldByName()` due to\n              "], ["\n                [buildResolvers()] Falling back to \\`astFieldByName()\\` due to\n              "]))), error);
                if (schemata.astFieldByName(rootType, _field2)) {
                  resolvers[rootType] = resolvers[rootType] || {};
                  resolvers[rootType][_field2] = resolvers[_field2];
                  delete resolvers[_field2];
                }
              }
            }
          }
        }
      } else {
        resolvers = (0, _deepmerge["default"])(resolvers || {}, flattenRootResolversOrFirstParam || {});
      }

      // Finally extend with any remaining arguments
      for (var _len = arguments.length, extendWith = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        extendWith[_key - 1] = arguments[_key];
      }
      if (extendWith.length) {
        var _iterator5 = _createForOfIteratorHelper(extendWith),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var item = _step5.value;
            resolvers = (0, _deepmerge["default"])(resolvers || {}, item || {});
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      return resolvers;
    }

    /**
     * From time to time it makes more sense to wrap every possible resolver
     * mapping in given schema. Getting a handle to each fields resolver and
     * or substituting missing ones with GraphQL's defaultFieldResolver can
     * be a tiresome affair. This method walks the schema for you and returns
     * any previously defined resolvers alongside defaultFieldResolvers for
     * each possible field of every type in the schema.
     *
     * If a schema cannot be generated from the SDL represented by the instance
     * of Schemata, then an error is thrown.
     *
     * @param {boolean|ResolverMap} flattenRootResolversOrFirstParam if this
     * value is boolean, and if this value is true, the resolvers from Query,
     * Mutation and Subscription types will be flattened to the root of the
     * object. If the first parametr is an ResolverMap, it will be merged in
     * normally with merge.
     * @param {Array<ResolverMap>} ...extendWith an unlimited array of objects
     * that can be used to extend the built resolver map.
     * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
     */
  }, {
    key: "buildResolverForEachField",
    value: function buildResolverForEachField(flattenRootResolversOrFirstParam) {
      if (!this.schema) {
        throw new Error((0, _neTagFns.inline)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n        buildResolverForEachField() cannot be called unless there is enough\n        valid SDL in the instance to construct a schema. Please check your\n        code!\n      "]))));
      }
      var interim = Schemata.from(this.sdl, this.resolvers);
      var r = {};
      interim.forEachField(function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) {
        // Ensure the path to the type in question exists before continuing
        // onward
        (r[typeName] = r[typeName] || {})[fieldName] = r[typeName][fieldName] || {};
        r[typeName][fieldName] = field.resolve || _graphql.defaultFieldResolver;
      });
      interim.resolvers = r;
      for (var _len2 = arguments.length, extendWith = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        extendWith[_key2 - 1] = arguments[_key2];
      }
      return interim.buildResolvers.apply(interim, [flattenRootResolversOrFirstParam].concat(extendWith));
    }

    /**
     * A method to determine if an executable schema is attached to this Schemata
     * instance. It does so by walking the schema fields via `buildResolvers()`
     * and reporting whether there is anything inside the results or not.
     *
     * @return {boolean} true if there is at least one resolver on at least one
     * field of a type in this Schemata instance's schema.
     */
  }, {
    key: "hasAnExecutableSchema",
    get: function get() {
      return Object.keys(this.buildResolvers()).length > 0;
    }

    /**
     * If the `.sdl` property is valid SDL/IDL and can generate valid AST nodes
     * this function will return true. It will return false otherwise.
     *
     * @return {boolean} true if the string can be parsed; false otherwise
     */
  }, {
    key: "validSDL",
    get: function get() {
      try {
        this.constructor.gql.parse(this.sdl);
        debug_log('[get .validSDL] true');
        return true;
      } catch (e) {
        debug_log('[get .validSDL] false');
        debug_trace('[get .validSDL] ', e);
        return false;
      }
    }

    /**
     * If the `.schema` property is valid SDL/IDL and can generate a valid
     * GraphQLSchema, this function will return true. It will return false
     * otherwise.
     *
     * @return {boolean} true if the string can be parsed into a schema; false
     * otherwise
     */
  }, {
    key: "validSchema",
    get: function get() {
      try {
        _classPrivateMethodGet(this, _generateSchema, _generateSchema2).call(this);
        debug_log('[get .validSchema] true');
        return true;
      } catch (e) {
        debug_log('[get .validSchema] false');
        debug_trace('[get .validSchema] ', e);
        return false;
      }
    }

    /**
     * Returns true if the string underlying this instance represents valid SDL
     * that can be both converted to AST nodes or a valid GraphQLSchema instance
     *
     * @return {boolean} true if it is valid for both `parse()` as well as the
     * `buildSchema()` function
     */
  }, {
    key: "valid",
    get: function get() {
      return this.validSDL && this.validSchema;
    }

    /**
     * If the internal resolvers object needs to be changed after creation, this
     * method allows a way to do so. Setting the value to `null` is equivalent
     * to removing any stored value. Finally the contents are stored in a weak
     * map so its contents are not guaranteed over a long period of time.
     *
     * @param {ResolverMap} resolvers an object containing field resolvers for
     * this string instance.
     */
  }, {
    key: "resolvers",
    set: function set(resolvers) {
      this[MAP].set(wmkResolvers, resolvers);
      this.clearSchema();
    }

    /**
     * Removes the resolver map associated with this Schemata instance
     */
  }, {
    key: "clearResolvers",
    value: function clearResolvers() {
      this.resolvers = null;
    }

    /**
     * Removes the schema stored with this Schemata instance
     */
  }, {
    key: "clearSchema",
    value: function clearSchema() {
      this.schema = null;
    }

    /**
     * Returns the underlying string passed or generated in the constructor when
     * inspected in the nodeJS REPL.
     *
     * @return {string} the SDL/IDL string this class was created on
     */
  }, {
    key: _Util$inspect$custom,
    value: function value(depth, options) {
      return this.sdl;
    }

    /**
     * The same as `inspect()`, `toString()`, and `valueOf()`. This method
     * returns the underlying string this class instance was created on.
     *
     * @return {string} [description]
     */
  }, {
    key: "toString",
    value: function toString() {
      return this.sdl;
    }

    /**
     * The same as `inspect()`, `toString()`, and `valueOf()`. This method
     * returns the underlying string this class instance was created on.
     *
     * @return {string} [description]
     */
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.sdl;
    }

    /**
     * Iterates over the values contained in a Schema's typeMap. If a desired
     * value is encountered, the supplied callback will be invoked. The values are
     * the constants ALL, TYPES, INTERFACES, ENUMS, UNIONS and SCALARS. Optionally
     * HIDDEN is another value that can be bitmasked together for a varied result.
     * HIDDEN exposes the values in the schema typemap that begin with a double
     * underscore.
     *
     * The signature for the function callback is as follows:
     * (
     *   type: mixed,
     *   typeName: string,
     *   typeDirectives: Array<GraphQLDirective>
     *   schema: GraphQLSchema,
     *   context: mixed,
     * ) => void
     *
     * Where:
     *   `type`           - the object instance from within the `GraphQLSchema`
     *   `typeName`       - the name of the object; "Query" for type Query and
     *                      so on.
     *   `typeDirectives` - an array of directives applied to the object or an
     *                      empty array if there are none applied.
     *   `schema`         - an instance of `GraphQLSchema` over which to iterate
     *   `context`        - usually an object, and usually the same object,
     *                      passed to the call to `makeExecutableSchema()`
     *                      or `graphql()`
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {Number} types a bitmask of one or more of the constants defined
     * above. These can be OR'ed together and default to TYPES.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
     * over and returned.
     */
  }, {
    key: "forEachOf",
    value: function forEachOf(fn, context) {
      var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _forEachOf2.TYPES;
      var suppliedSchema = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachOf)(schema, fn, context, types);
      return schema;
    }

    /**
     * Shortcut to `forEachOf()` specific to types.
     *
     * @see #forEachOf
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this Schemata
     * @return {GraphQLSchema} a new schema is generated from this Schemata,
     * iterated over and returned.
     */
  }, {
    key: "forEachType",
    value: function forEachType(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.TYPES, suppliedSchema);
    }

    /**
     * Shortcut to `forEachOf()` specific to input object types.
     *
     * @see #forEachOf
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this Schemata
     * @return {GraphQLSchema} a new schema is generated from this Schemata,
     * iterated
     * over and returned.
     */
  }, {
    key: "forEachInputObjectType",
    value: function forEachInputObjectType(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, INPUT_TYPES, suppliedSchema);
    }

    /**
     * Shortcut to `forEachOf()` specific to unions.
     *
     * @see #forEachOf
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
     * over and returned.
     */
  }, {
    key: "forEachUnion",
    value: function forEachUnion(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.UNIONS, suppliedSchema);
    }

    /**
     * Shortcut to `forEachOf()` specific to enums.
     *
     * @see #forEachOf
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
     * over and returned.
     */
  }, {
    key: "forEachEnum",
    value: function forEachEnum(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.ENUMS, suppliedSchema);
    }

    /**
     * Shortcut to `forEachOf()` specific to interfaces.
     *
     * @see #forEachOf
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
     * over and returned.
     */
  }, {
    key: "forEachInterface",
    value: function forEachInterface(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.INTERFACES, suppliedSchema);
    }

    /**
     * Shortcut to `forEachOf()` specific to types.
     *
     * @see #forEachOf
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} a new schema is generated from this SDL,
     * iterated over and returned.
     */
  }, {
    key: "forEachScalar",
    value: function forEachScalar(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.SCALARS, suppliedSchema);
    }

    /**
     * Shortcut to `forEachOf()` specific to all root types; Query, Mutation and
     * Subscription that exist within the schema.
     *
     * @see #forEachOf
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
     * over and returned.
     */
  }, {
    key: "forEachRootType",
    value: function forEachRootType(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.ROOT_TYPES, suppliedSchema);
    }

    /**
     * An extension of `forEachOf` that targets the fields of the types in the
     * schema's typeMap. This function provides more detail and allows greater
     * access to any associated `context` than the function of the same name
     * provided by the `graphql-tools` library.
     *
     * The signature for the callback function is as follows
     *
     * (
     *   type: mixed,
     *   typeName: string,
     *   typeDirectives: Array<GraphQLDirective>,
     *   field: mixed,
     *   fieldName: string,
     *   fieldArgs: Array<GraphQLArgument>,
     *   fieldDirectives: Array<GraphQLDirective>,
     *   schema: GraphQLSchema,
     *   context: mixed
     * ) => void
     *
     * Where
     *
     * Where:
     *   `type`           - the object instance from within the `GraphQLSchema`
     *   `typeName`       - the name of the object; "Query" for type Query and
     *                      so on
     *   `typeDirectives` - an array of directives applied to the object or an
     *                      empty array if there are none applied.
     *   `field`          - the field in question from the type
     *   `fieldName`      - the name of the field as a string
     *   `fieldArgs`      - an array of arguments for the field in question
     *   `fieldDirectives`- an array of directives applied to the field or an
     *                      empty array should there be no applied directives
     *   `schema`         - an instance of `GraphQLSchema` over which to iterate
     *   `context`        - usually an object, and usually the same object, passed
     *                      to the call to `makeExecutableSchema()` or `graphql()`
     *
     * @param {Function} fn a function with a signature defined above
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
     * over and returned.
     */
  }, {
    key: "forEachField",
    value: function forEachField(fn, context) {
      var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _forEachOf2.ALL;
      var suppliedSchema = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, types);
      return schema;
    }

    /**
     * `forEachField()` shortcut focusing on GraphQLObjectTypes specifically.
     *
     * @param {ForEachFieldResolver} fn a callback function that is invoked for
     * each field of any GraphQLObjectType found
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
     * to facilitate the task
     */
  }, {
    key: "forEachTypeField",
    value: function forEachTypeField(fn, context) {
      var suppliedSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, _forEachOf2.TYPES);
      return schema;
    }

    /**
     * `forEachField()` shortcut focusing on GraphQLInterfaceType specifically.
     *
     * @param {ForEachFieldResolver} fn a callback function that is invoked for
     * each field of any GraphQLObjectType found
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
     * to facilitate the task
     */
  }, {
    key: "forEachInterfaceField",
    value: function forEachInterfaceField(fn, context) {
      var suppliedSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, _forEachOf2.INTERFACES);
      return schema;
    }

    /**
     * `forEachField()` shortcut focusing on GraphQLInputObjectType specifically.
     *
     * @param {ForEachFieldResolver} fn a callback function that is invoked for
     * each field of any GraphQLObjectType found
     * @param {mixed} context usually an object but any mixed value the denotes
     * some shared context as is used with the schema during normal runtime.
     * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
     * than the one created or stored internally generated from this SDL
     * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
     * to facilitate the task
     */
  }, {
    key: "forEachInputObjectField",
    value: function forEachInputObjectField(fn, context) {
      var suppliedSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, INPUT_TYPES);
      return schema;
    }

    /**
     * Wrapper for `require('graphql').graphqlSync()` that automatically passes
     * in the internal `.schema` reference as the first parameter.
     *
     * @param {string|Source} query A GraphQL language formatted string
     * representing the requested operation.
     * @param {mixed} contextValue a bit of shared context to pass to resolvers
     * @param {Object} variableValues A mapping of variable name to runtime value
     * to use for all variables defined in the requestString.
     * @param {ResolverMap|null} rootValue provided as the first argument to
     * resolver functions on the top level type (e.g. the query object type).
     * @param {string} operationName The name of the operation to use if
     * requestString contains multiple possible operations. Can be omitted if
     * requestString contains only one operation.
     * @param {GraphQLFieldResolver<any, any>} fieldResolver A resolver function
     * to use when one is not provided by the schema. If not provided, the
     * default field resolver is used (which looks for a value or method on the
     * source value with the field's name).
     * @return {ExecutionResult} the requested results. An error is thrown if
     * the results could not be fulfilled or invalid input/output was specified.
     */
  }, {
    key: "run",
    value: function run(query, contextValue, variableValues, rootValue, operationName, fieldResolver, typeResolver) {
      return this.constructor.gql.graphqlSync({
        schema: this.schema,
        source: query,
        rootValue: this.resolvers || rootValue,
        contextValue: contextValue,
        variableValues: variableValues,
        operationName: operationName,
        fieldResolver: fieldResolver,
        typeResolver: typeResolver
      });
    }

    /**
     * Wrapper for `require('graphql').graphql()` that automatically passes
     * in the internal `.schema` reference as the first parameter.
     *
     * @param {string|Source} query A GraphQL language formatted string
     * representing the requested operation.
     * @param {mixed} contextValue a bit of shared context to pass to resolvers
     * @param {Object} variableValues A mapping of variable name to runtime value
     * to use for all variables defined in the requestString.
     * @param {ResolverMap|null} The value provided as the first argument to
     * resolver functions on the top level type (e.g. the query object type).
     * @param {string} operationName The name of the operation to use if
     * requestString contains multiple possible operations. Can be omitted if
     * requestString contains only one operation.
     * @param {GraphQLFieldResolver<any, any>} fieldResolver A resolver function
     * to use when one is not provided by the schema. If not provided, the
     * default field resolver is used (which looks for a value or method on the
     * source value with the field's name).
     * @return {Promise<ExecutionResult>} a Promise contianing the requested
     * results
     */
  }, {
    key: "runAsync",
    value: (function () {
      var _runAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(query, contextValue, variableValues, rootValue, operationName, fieldResolver, typeResolver) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", this.constructor.gql.graphql({
                schema: this.schema,
                source: query,
                rootValue: this.resolvers || rootValue,
                contextValue: contextValue,
                variableValues: variableValues,
                operationName: operationName,
                fieldResolver: fieldResolver,
                typeResolver: typeResolver
              }));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function runAsync(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
        return _runAsync.apply(this, arguments);
      }
      return runAsync;
    }()
    /**
     * A little wrapper used to catch any errors thrown when building a schema
     * from the string SDL representation of a given instance.
     *
     * @param {SchemaSource} sdl an instance of Schemata, a string of SDL, a
     * Source instance of SDL, a GraphQLSchema or ASTNode that can be printed as
     * an SDL string
     * @param {boolean} showError true if the error should be thrown, false if
     * the error should be silently suppressed
     * @param {BuildSchemaOptions&ParseOptions} schemaOpts for advanced users,
     * passing through additional buildSchema() options can be done here
     * @return {GraphQLSchema|null} null if an error occurs and errors are not
     * surfaced or a valid GraphQLSchema object otherwise
     */
    )
  }], [{
    key: _Symbol$species,
    get: function get() {
      return Schemata;
    }
  }, {
    key: "buildSchema",
    value: function buildSchema(sdl) {
      var showError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var schemaOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      try {
        debug_log('[static buildSchema()] normalizing source');
        var source = normalizeSource(sdl);
        debug_log('[static buildSchema()] building schema');
        return this.gql.buildSchema(source, schemaOpts);
      } catch (e) {
        debug_log('[static buildSchema()] failed to build!');
        debug_trace('[static buildSchema()] ', e);
        if (showError) {
          throw e;
        }
        return null;
      }
    }

    /**
     * A little wrapper used to catch any errors thrown when parsing Schemata for
     * ASTNodes. If showError is true, any caught errors are thrown once again.
     *
     * @param {SchemaSource} sdl an instance of Schemata, a string of SDL, a
     * Source instance of SDL, a GraphQLSchema or ASTNode that can be printed as
     * an SDL string
     * @param {boolean} showError if true, any caught errors will be thrown once
     * again
     * @param {boolean} enhance a generator keyed with `Symbol.iterator` is set
     * on the resulting astNode object allowing the resulting `.ast` value to
     * be iterable. The code iterates over each definition of the resulting
     * DocumentNode. This behavior defaults to true and should not have any ill
     * effects on code expecting vanilla ASTNode objects
     * @return {ASTNode|null} null if an error occurs and errors are suppressed,
     * a top level Document ASTNode otherwise
     */
  }, {
    key: "parse",
    value: function parse(sdl) {
      var showError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var enhance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      try {
        debug_log('[static parse()] normalizing source');
        var source = normalizeSource(sdl);
        debug_log('[static parse()] parsing');
        var node = this.gql.parse(source);
        if (enhance) {
          debug_log('[static parse()] enhancing');
          node[Symbol.iterator] = /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
            var _iterator6, _step6, _node;
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  _iterator6 = _createForOfIteratorHelper(this.definitions);
                  _context3.prev = 1;
                  _iterator6.s();
                case 3:
                  if ((_step6 = _iterator6.n()).done) {
                    _context3.next = 9;
                    break;
                  }
                  _node = _step6.value;
                  _context3.next = 7;
                  return _node;
                case 7:
                  _context3.next = 3;
                  break;
                case 9:
                  _context3.next = 14;
                  break;
                case 11:
                  _context3.prev = 11;
                  _context3.t0 = _context3["catch"](1);
                  _iterator6.e(_context3.t0);
                case 14:
                  _context3.prev = 14;
                  _iterator6.f();
                  return _context3.finish(14);
                case 17:
                case "end":
                  return _context3.stop();
              }
            }, _callee3, this, [[1, 11, 14, 17]]);
          });
        }
        return node;
      } catch (e) {
        debug_log('[static parse()] failed to parse');
        debug_trace('[static parse()] ', e);
        if (showError) {
          throw e;
        }
        return null;
      }
    }

    /**
     * A little wrapper used to catch any errors thrown when printing an ASTNode
     * to string form using `require('graphql').print()`. If `showError` is true
     * any thrown errors will be rethrown, otherwise null is returned instead.
     *
     * Should all go as planned, an instance of Schemata wrapped with the printed
     * SDL will be returned.
     *
     * @since 1.7
     *
     * @param {ASTNode|GraphQLSchema} ast an ASTNode, usually a
     * DocumentNode generated with some version of `require('graphql').parse()`.
     * If an instance of GraphQLSchema is supplied, `printSchema()` is used
     * instead of `print()`
     * @param {boolean} showError if true, any caught errors will be thrown once
     * again
     * @return {Schemata|null} null if an error occurs (and showError is false)
     * or an instance of Schemata wrapping the resulting SDL string from the
     * print operation
     */
  }, {
    key: "print",
    value: function print(ast) {
      var showError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      try {
        var source;
        if (ast instanceof _graphql.GraphQLSchema) {
          debug_log('[static print()] printing schema');
          source = this.gql.printSchema(ast);
        } else {
          debug_log('[static print()] printing ASTNode');
          source = this.gql.print(ast);
        }
        debug_log('[static print()] creating new Schemata from print');
        return Schemata.from(source);
      } catch (e) {
        debug_log('[static print()] failed to print');
        debug_trace('[static print()] ', e);
        if (showError) {
          throw e;
        }
        return null;
      }
    }

    /**
     * A simple pass thru used within the class to reference graphql methods
     * and classes.
     *
     * @return {mixed} the results of `require('graphql')`
     */
  }, {
    key: "gql",
    get: function get() {
      return require('graphql');
    }

    /**
     * Shorthand way of invoking `new Schemata()`
     *
     * @param {SchemaSource} typeDefs an instance of Schemata, a string of SDL,
     * a Source instance of SDL, a GraphQLSchema or ASTNode that can be printed
     * as an SDL string
     * @param {ResolverMap} resolvers an object containing field resolvers for
     * for the schema represented with this string. [Optional]
     * @param {boolean} buildResolvers if this flag is set to true, build a set
     * of resolvers after the rest of the instance is initialized and set the
     * results on the `.resolvers` property of the newly created instance. If
     * buildResolvers is the string "all", then a resolver for each field not
     * defined will be returned with a `defaultFieldResolver` as its value
     * @param {boolean} flattenResolvers if true, and if `buildResolvers` is true,
     * then make an attempt to flatten the root types to the base of the
     * resolver map object.
     * @return {Schemata} an instance of Schemata
     */
  }, {
    key: "from",
    value: function from(typeDefs) {
      var resolvers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var buildResolvers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var flattenResolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      return new this(typeDefs, resolvers, buildResolvers, flattenResolvers);
    }

    /**
     * Shorthand way of invoking `new Schemata()` after the function reads the
     * contents of the file specified at the supplied path.
     *
     * @param {string} path path to the file to read the contents of
     * @return {Schemata} an instance of Schemata
     */
  }, {
    key: "fromContentsOf",
    value: (function () {
      var _fromContentsOf = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(path) {
        var parsed, contents;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _dynamicImport.pathParse)(path);
            case 2:
              parsed = _context4.sent;
              _context4.next = 5;
              return (0, _promises.readFile)(parsed.fullPath);
            case 5:
              contents = _context4.sent.toString();
              return _context4.abrupt("return", Schemata.from(contents));
            case 7:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function fromContentsOf(_x8) {
        return _fromContentsOf.apply(this, arguments);
      }
      return fromContentsOf;
    }())
  }, {
    key: "buildFromDir",
    value: function () {
      var _buildFromDir = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(path, conflictResolver) {
        var rePath, gqExts, files, schemata, resolvers, _iterator7, _step7, file, _yield$importGraphQL, newSchemata, _newResolvers;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              rePath = (0, _path.resolve)(path);
              gqExts = ['.graphql', '.gql', '.sdl', '.typedefs'];
              _context6.t0 = Array;
              _context6.next = 5;
              return (0, _promises.readdir)(rePath, {
                recursive: true
              });
            case 5:
              _context6.t1 = _context6.sent;
              _context6.next = 8;
              return _context6.t0.from.call(_context6.t0, _context6.t1).reduce( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(ap, c) {
                  var previous, parsed;
                  return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                    while (1) switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return ap;
                      case 2:
                        previous = _context5.sent;
                        _context5.next = 5;
                        return (0, _dynamicImport.pathParse)((0, _path.join)(rePath, c));
                      case 5:
                        parsed = _context5.sent;
                        if (!parsed.isDir && gqExts.some(function (ext) {
                          return parsed.ext === ext;
                        })) {
                          previous.push(parsed.fullPath);
                        }
                        return _context5.abrupt("return", previous);
                      case 8:
                      case "end":
                        return _context5.stop();
                    }
                  }, _callee5);
                }));
                return function (_x11, _x12) {
                  return _ref.apply(this, arguments);
                };
              }(), []);
            case 8:
              files = _context6.sent;
              schemata = null;
              resolvers = {};
              _iterator7 = _createForOfIteratorHelper(files);
              _context6.prev = 12;
              _iterator7.s();
            case 14:
              if ((_step7 = _iterator7.n()).done) {
                _context6.next = 31;
                break;
              }
              file = _step7.value;
              _context6.prev = 16;
              _context6.next = 19;
              return (0, _GraphQLExtension.importGraphQL)(file);
            case 19:
              _yield$importGraphQL = _context6.sent;
              newSchemata = _yield$importGraphQL.schemata;
              _newResolvers = _yield$importGraphQL.resolvers;
              if (newSchemata) {
                schemata = !schemata ? newSchemata : schemata.mergeSDL(newSchemata);
              }
              if (_newResolvers) {
                resolvers = (0, _walkResolverMap.mergeResolvers)(resolvers, _newResolvers, function (e, n) {
                  console.log('CONFLICT');
                  return n.value;
                });
              }
              _context6.next = 29;
              break;
            case 26:
              _context6.prev = 26;
              _context6.t2 = _context6["catch"](16);
              console.error(_context6.t2);
            case 29:
              _context6.next = 14;
              break;
            case 31:
              _context6.next = 36;
              break;
            case 33:
              _context6.prev = 33;
              _context6.t3 = _context6["catch"](12);
              _iterator7.e(_context6.t3);
            case 36:
              _context6.prev = 36;
              _iterator7.f();
              return _context6.finish(36);
            case 39:
              if (schemata && resolvers) {
                schemata.resolvers = resolvers;
              }
              return _context6.abrupt("return", schemata);
            case 41:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[12, 33, 36, 39], [16, 26]]);
      }));
      function buildFromDir(_x9, _x10) {
        return _buildFromDir.apply(this, arguments);
      }
      return buildFromDir;
    }()
    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available type within the schema.
     *
     * @type {number}
     */
  }, {
    key: "ALL",
    get: function get() {
      return _forEachOf2.ALL;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available type within the schema.
     *
     * @type {number}
     */
  }, {
    key: "TYPES",
    get: function get() {
      return _forEachOf2.TYPES;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available interface within the schema.
     *
     * @type {number}
     */
  }, {
    key: "INTERFACES",
    get: function get() {
      return _forEachOf2.INTERFACES;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available enum within the schema.
     *
     * @type {number}
     */
  }, {
    key: "ENUMS",
    get: function get() {
      return _forEachOf2.ENUMS;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available union within the schema.
     *
     * @type {number}
     */
  }, {
    key: "UNIONS",
    get: function get() {
      return _forEachOf2.UNIONS;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available scalar within the schema.
     *
     * @type {number}
     */
  }, {
    key: "SCALARS",
    get: function get() {
      return _forEachOf2.SCALARS;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available root type; Query, Mutation and Subscription
     *
     * @type {number}
     */
  }, {
    key: "ROOT_TYPES",
    get: function get() {
      return _forEachOf2.ROOT_TYPES;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available GraphQLInputObjectType within the schema.
     *
     * @type {number}
     */
  }, {
    key: "INPUT_TYPES",
    get: function get() {
      return INPUT_TYPES;
    }

    /**
     * Constant used with `forEachOf()` that signifies you also wish to
     * iterate over the meta types. These are denoted by a leading double
     * underscore.
     *
     * Can be OR'ed together such as `Schemata.TYPES | Schemata.HIDDEN`
     *
     * @type {number}
     */
  }, {
    key: "HIDDEN",
    get: function get() {
      return _forEachOf2.HIDDEN;
    }
  }]);
  return Schemata;
}( /*#__PURE__*/_wrapNativeSuper(String));
/**
 * Given an type, determine if the type is a root type; i.e. one of Query,
 * Mutation or Subscription as defined in the `graphql` library.
 *
 * @param  {mixed} t a GraphQL AST or object type denoting a schema type
 * @return {Boolean} true if the type supplied is a root type; false otherwise
 */
function _generateSchema2() {
  var Class = this.constructor;
  var resolvers = this.resolvers;
  var schema;

  // If we have a generated schema already and this instance has a
  // resolvers object that is not falsey, check to see if the object
  // has the executable schema flag set or not. If so, simply return
  // the pre-existing object rather than create a new one.
  if (this[MAP].get(wmkSchema)) {
    schema = this[MAP].get(wmkSchema);
    if (resolvers) {
      var _schema2;
      // check for the executable schema flag
      if ((_schema2 = schema) !== null && _schema2 !== void 0 && _schema2[EXE]) {
        return schema;
      }
    } else if (schema) {
      return schema;
    }
  }

  // Attempt to generate a schema using the SDL for this instance. Throw
  // an error if the SDL is insufficient to generate a GraphQLSchema object
  try {
    debug_log('[get .schema] creating schema from SDL');
    this[MAP].set(wmkSchema, schema = Class.buildSchema(this.sdl, true));

    // Now try to handle and ObjectTypeExtensions
    var ast = this.ast;
    ast.definitions = [].concat(ast.definitions.filter(function (i) {
      return i.kind == 'ObjectTypeExtension';
    }));
    try {
      this[MAP].set(wmkSchema, schema = (0, _graphql.extendSchema)(schema, ast));
    } catch (error) {
      debug_log('[get .schema] failed to handle extended types');
      debug_trace('[get .schema] ERROR!', error);
    }
  } catch (error) {
    debug_log('[get .schema] failed to create schema');
    debug_trace('[get .schema] ERROR!', error);
    return null;
  }

  // Only iterate over the fields if there are resolvers set
  if (resolvers) {
    (0, _forEachOf2.forEachField)(schema, function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) {
      var _resolvers$typeName;
      if (isRootType(type) && resolvers[fieldName]) {
        field.resolve = resolvers[fieldName];
        field.astNode.resolve = resolvers[fieldName];
      }
      if (resolvers !== null && resolvers !== void 0 && (_resolvers$typeName = resolvers[typeName]) !== null && _resolvers$typeName !== void 0 && _resolvers$typeName[fieldName]) {
        field.resolve = resolvers[typeName][fieldName];
        field.astNode.resolve = resolvers[typeName][fieldName];
      }
    });
    this.resolverInfo.forEach(function (resolverInfo) {
      resolverInfo.applyTo(schema);
    });
    schema[EXE] = true;
  }

  // Set the generated schema in the weak map using the weak map key
  this[MAP].set(wmkSchema, schema);
  return schema;
}
var isRootType = exports.isRootType = function isRootType(t) {
  if (t === undefined || t === null || !t) {
    return false;
  }
  return t instanceof _graphql.GraphQLObjectType && ['Query', 'Mutation', 'Subscription'].includes(t.name);
};

/**
 * Loops over the `resolverInjectors` in the supplied config object and
 * lets each supplied function have a pass to inspect or modify the parameters
 * that will be used to bind future resolver functions.
 *
 * @param {MergeOptionsConfig} config a config object with an array of
 * `ResolverArgsTransformer` functions
 * @param {ResolverArgs} args an object with `source`, `args`, `context`
 * and `info`
 * @return {ResolverArgs} a resulting object with `source`, `args`,
 * `context` and `info`
 */
function runInjectors(config, resolverArgs) {
  var args;
  if (!Array.isArray(config.resolverInjectors)) {
    config.resolverInjectors = [config.resolverInjectors];
  }
  var _iterator8 = _createForOfIteratorHelper(config.resolverInjectors),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var injector = _step8.value;
      args = injector(resolverArgs);
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  return args;
}

/**
 * The merge options config takes the arguments passed into a given `resolve()`
 * function, allowing the implementor to modify the values before passing them
 * back out.
 *
 * This function takes a schema to inject into the info object, or fourth
 * parameter, passed to any resolver. Any `extraConfig` object added in will
 * have its resolverInjectors added to the list to be processed.
 *
 * @param {GraphQLSchema} schema the GraphQLSchema object being inserted
 * @param {MergeOptionsConfig} extraConfig an optional extraConfig option to
 * merge with the resulting output
 * @return {MergeOptionsConfig} a MergeOptionsConfig object that contains at
 * least a single `ResolverArgsTransformer` which injects the supplied `schema`
 * into the `info` object.
 */
function SchemaInjectorConfig(schema, extraConfig) {
  var baseConfig = {
    resolverInjectors: [function __schema_injector__(_ref2) {
      var source = _ref2.source,
        args = _ref2.args,
        context = _ref2.context,
        info = _ref2.info;
      info.schema = schema || info.schema;
      return {
        source: source,
        args: args,
        context: context,
        info: info
      };
    }]
  };
  if (extraConfig) {
    if (extraConfig.resolverInjectors) {
      if (!Array.isArray(extraConfig.resolverInjectors)) {
        baseConfig.resolverInjectors.push(extraConfig.resolverInjectors);
      } else {
        baseConfig.resolverInjectors = baseConfig.resolverInjectors.concat(extraConfig.resolverInjectors);
      }
    }
  }
  return baseConfig;
}

/**
 * Walk the supplied GraphQLSchema instance and retrieve the resolvers stored
 * on it. These values are then returned with a [typeName][fieldName] pathing
 *
 * @param {GraphQLSchema} schema an instance of GraphQLSchema
 * @return {ResolverMap} an object containing a mapping of typeName.fieldName
 * that links to the resolve() function it is associated within the supplied
 * schema
 */
function stripResolversFromSchema(schema) {
  var resolvers = {};
  if (!schema) {
    return null;
  }
  (0, _forEachOf2.forEachField)(schema, function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, _schema, context) {
    if (field.resolve) {
      resolvers[typeName] = resolvers[typeName] || {};
      resolvers[typeName][fieldName] = resolvers[typeName][fieldName] || {};
      resolvers[typeName][fieldName] = field.resolve;
    }
  });
  return resolvers;
}

/** @type {Symbol} a unique symbol used as a key to all instance sdl strings */
var TYPEDEFS_KEY = exports.TYPEDEFS_KEY = Symbol('internal-typedefs-key');

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
var GRAPHIQL_FLAG = exports.GRAPHIQL_FLAG = Symbol["for"]('internal-graphiql-key');

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
var SCHEMA_DIRECTIVES = exports.SCHEMA_DIRECTIVES = Symbol["for"]('internal-directives-key');

/** @type {Symbol} a unique symbol used as a key to all instance `WeakMap`s */
var MAP = exports.MAP = Symbol('internal-weak-map-key');

/** @type {Symbol} a key used to store the __executable__ flag on a schema */
var EXE = exports.EXE = Symbol('executable-schema');

/** @type {Object} a key used to store a resolver object in a WeakMap */
var wmkResolvers = Object(Symbol('GraphQL Resolvers storage key'));

/** @type {Object} a key used to store an internal schema in a WeakMap */
var wmkSchema = Object(Symbol('GraphQLSchema storage key'));

/**
 * This is a `Symbol` key to a `WeakSet` of `ExtendedResolverMap` instances,
 * each of which have at least three properties:
 *
 *  - schema
 *  - sdl
 *  - resolvers
 *
 * One of these are created and added to the set whenever a mergeSchema is
 * performed. On each subsequent mergeSDL/Schema a new instance is added such
 * that new versions exist to be wrapped anew
 *
 * @type {[type]}
 */
var wmkPreboundResolvers = Object(Symbol('Resolvers pre-merge-wrapped'));

/**
 * The default field resolver blindly takes returns the right field. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {FieldNode} leftField The field causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {FieldNode} rightField the field cause the conflict
 *
 * @return {FieldNode} the field that should be used after resolution
 */
function DefaultFieldMergeResolver(leftType, leftField, rightType, rightField) {
  return rightField;
}

/**
 * The default directive resolver blindly takes returns the right field. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {DirectiveNode} leftDirective The field causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {DirectiveNode} rightDirective the field cause the conflict
 *
 * @return {DirectiveNode} the directive that should be used after resolution
 */
function DefaultDirectiveMergeResolver(leftType, leftDirective, rightType, rightDirective) {
  return rightDirective;
}

/**
 * The default field resolver blindly takes returns the right field. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {DirectiveNode} leftDirective The field causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {DirectiveNode} rightDirective the field cause the conflict
 *
 * @return {DirectiveNode} the directive that should be used after resolution
 */
function DefaultEnumMergeResolver(leftType, leftValue, rightType, rightValue) {
  return rightValue;
}

/**
 * The default union resolver blindly takes returns the right type. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {NamedTypeNode} leftUnion The named node causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {NamedTypeNode} rightUnion the named node cause the conflict
 *
 * @return {NamedTypeNode} the directive that should be used after resolution
 */
function DefaultUnionMergeResolver(leftType, leftUnion, rightType, rightUnion) {
  return rightUnion;
}

/**
 * The default scalar merge resolver returns the right config when there is
 * one, otherwise the left one or null will be the default result. This is
 * slightly different behavior since resolvers for scalars are not always
 * available.
 *
 * @param {GraphQLScalarTypeConfig} leftConfig *if* there is a resolver defined
 * for the existing ScalarTypeDefinitionNode it will be provided here. If this
 * value is null, there is no availabe config with serialize(), parseValue() or
 * parseLiteral() to work with.
 * @param {ScalarTypeDefinitionNode} rightScalar the definition node found when
 * parsing ASTNodes. This is to be merged value that conflicts with the
 * existing value
 * @param {GraphQLScalarTypeConfig} rightConfig *if* there is a resolver
 * defined for the existing ScalarTypeDefinitionNode it will be provided here.
 * If this value is null, there is no availabe config with serialize(),
 * parseValue() or parseLiteral() to work with.
 * @return {GraphQLScalarTypeConfig} whichever type config or resolver was
 * desired should be returned here.
 *
 * @see https://www.apollographql.com/docs/graphql-tools/scalars.html
 * @see http://graphql.org/graphql-js/type/#graphqlscalartype
 */
function DefaultScalarMergeResolver(leftScalar, leftConfig, rightScalar, rightConfig) {
  var _ref3;
  return (_ref3 = rightConfig || leftConfig) !== null && _ref3 !== void 0 ? _ref3 : null;
}

/**
 * In order to facilitate merging, there needs to be some contingency plan
 * for what to do when conflicts arise. This object specifies one of each
 * type of resolver. Each simply takes the right-hand value.
 *
 * @type {Object}
 */
var DefaultConflictResolvers = exports.DefaultConflictResolvers = {
  /** A handler for resolving fields in matching types */
  fieldMergeResolver: DefaultFieldMergeResolver,
  /** A handler for resolving directives in matching types */
  directiveMergeResolver: DefaultDirectiveMergeResolver,
  /** A handler for resolving conflicting enum values */
  enumValueMergeResolver: DefaultEnumMergeResolver,
  /** A handler for resolving type values in unions */
  typeValueMergeResolver: DefaultUnionMergeResolver,
  /** A handler for resolving scalar configs in custom scalars */
  scalarMergeResolver: DefaultScalarMergeResolver
};

/**
 * A `MergeOptionsConfig` object with an empty array of
 * `ResolverArgsTransformer` instances
 *
 * @type {MergeOptionsConfig}
 */
var DefaultMergeOptions = exports.DefaultMergeOptions = {
  conflictResolvers: DefaultConflictResolvers,
  resolverInjectors: [],
  injectMergedSchema: true,
  createMissingResolvers: false
};
var subTypeResolverMap = new Map();
subTypeResolverMap.set('fields', 'fieldMergeResolver');
subTypeResolverMap.set('directives', 'directiveMergeResolver');
subTypeResolverMap.set('values', 'enumValueMergeResolver');
subTypeResolverMap.set('types', 'typeValueMergeResolver');
subTypeResolverMap.set('scalars', 'scalarMergeResolver');

/**
 * Compares and combines a subset of ASTNode fields. Designed to work on all
 * the various types that might have a merge conflict.
 *
 * @param {string} subTypeName the name of the field type; one of the following
 * values: 'fields', 'directives', 'values', 'types'
 * @param {ASTNode} lType the lefthand type containing the subtype to compare
 * @param {ASTNode} lSubType the lefthand subtype; fields, directive, value or
 * named union type
 * @param {ASTNode} rType the righthand type containing the subtype to compare
 * @param {ASTNode} rSubType the righthand subtype; fields, directive, value or
 * named union type
 */
function combineTypeAndSubType(subTypeName, lType, rType) {
  var conflictResolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DefaultConflictResolvers;
  if (rType[subTypeName]) {
    var _iterator9 = _createForOfIteratorHelper(rType[subTypeName]),
      _step9;
    try {
      var _loop3 = function _loop3() {
        var rSubType = _step9.value;
        var lSubType = lType[subTypeName].find(function (f) {
          return f.name.value == rSubType.name.value;
        });
        if (!lSubType) {
          lType[subTypeName].push(rSubType);
          return 1; // continue
        }
        var resolver = subTypeResolverMap.get(subTypeName) || 'fieldMergeResolver';
        var resultingSubType = conflictResolvers[resolver](lType, lSubType, rType, rSubType);
        var index = lType.fields.indexOf(lSubType);
        lType[subTypeName].splice(index, 1, resultingSubType);
      };
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        if (_loop3()) continue;
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
  }
}

/**
 * Compares a subset of ASTNode fields. Designed to work on all the various
 * types that might have a merge conflict.
 *
 * @param {string} subTypeName the name of the field type; one of the following
 * values: 'fields', 'directives', 'values', 'types'
 * @param {ASTNode} lType the lefthand type containing the subtype to compare
 * @param {ASTNode} lSubType the lefthand subtype; fields, directive, value or
 * named union type
 * @param {ASTNode} rType the righthand type containing the subtype to compare
 * @param {ASTNode} rSubType the righthand subtype; fields, directive, value or
 * named union type
 */
function pareTypeAndSubType(subTypeName, lType, rType) {
  var resolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _iterator10 = _createForOfIteratorHelper(rType[subTypeName]),
    _step10;
  try {
    var _loop4 = function _loop4() {
      var _resolvers$lType$name;
      var rSubType = _step10.value;
      var lSubType = lType[subTypeName].find(function (f) {
        return f.name.value == rSubType.name.value;
      });
      if (!lSubType) {
        return 1; // continue
      }
      var index = lType.fields.indexOf(lSubType);
      lType[subTypeName].splice(index, 1);
      if (resolvers !== null && resolvers !== void 0 && (_resolvers$lType$name = resolvers[lType.name.value]) !== null && _resolvers$lType$name !== void 0 && _resolvers$lType$name[lSubType.name.value]) {
        delete resolvers[lType.name.value][lSubType.name.value];
      } else if (resolvers[lSubType.name.value]) {
        delete resolvers[lSubType.name.value];
      }
    };
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      if (_loop4()) continue;
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
}

/**
 * Small function that sorts through the typeDefs value supplied which can be
 * any one of a Schemata instance, GraphQLSchema instance, Source instance or a
 * string.
 *
 * @param {SchemaSource} typeDefs an instance of Schemata, a string of SDL,
 * a Source instance of SDL, a GraphQLSchema or ASTNode that can be printed
 * as an SDL string
 * @return {string} a string representing the thing supplied as typeDefs
 */
function normalizeSource(typeDefs) {
  var wrap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!typeDefs) {
    throw new Error((0, _neTagFns.inline)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n      normalizeSource(typeDefs): typeDefs was invalid when passed to the\n      function `normalizeSource`. Please check your code and try again.\n\n      (received: ", ")\n    "], ["\n      normalizeSource(typeDefs): typeDefs was invalid when passed to the\n      function \\`normalizeSource\\`. Please check your code and try again.\n\n      (received: ", ")\n    "])), typeDefs));
  }
  if (typeDefs instanceof Schemata && typeDefs.valid && wrap) {
    return typeDefs;
  }
  var source = (typeDefs.body || typeDefs.sdl || typeof typeDefs === 'string' && typeDefs || _typeof(typeDefs) === 'object' && Schemata.print(typeDefs) || (typeDefs instanceof _graphql.GraphQLSchema ? (0, _graphql.printSchema)(typeDefs) : typeDefs.toString())).toString().trim();
  return wrap ? Schemata.from(source) : source;
}
var _default = exports["default"] = Schemata;