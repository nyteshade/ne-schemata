"use strict";

require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.proto.js");
require("core-js/modules/es.array.reverse.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultEntryInspector = exports.DefaultAsyncEntryInspector = void 0;
exports.asyncWalkResolverMap = asyncWalkResolverMap;
exports["default"] = void 0;
exports.mergeResolvers = mergeResolvers;
exports.walkResolverMap = walkResolverMap;
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.object.entries.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.array.join.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.reflect.has.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _errors = require("./errors");
var _typework = require("./utils/typework");
var _propAt = _interopRequireDefault(require("./propAt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * A default implementation of the EntryInspector type for use as a default
 * to `walkResolverMap`. While not immediately useful, a default implementation
 * causes `walkResolverMap` to wrap any non-function and non-object values
 * with a function that returns the non-compliant value and therefore has some
 * intrinsic value.
 *
 * @method DefaultEntryInspector
 * @type {Function}
 */
var DefaultEntryInspector = exports.DefaultEntryInspector = function DefaultEntryInspector(key, value, path, map) {
  return _defineProperty({}, key, value);
};

/**
 * A default implementation of the EntryInspector type for use as a default
 * to `asyncWalkResolverMap`. While not immediately useful, a default
 * implementation causes `asyncWalkResolverMap` to wrap any non-function and
 * non-object values with a function that returns the non-compliant value and
 * therefore has some intrinsic value.
 *
 * @method DefaultEntryInspector
 * @type {Function}
 */
var DefaultAsyncEntryInspector = exports.DefaultAsyncEntryInspector = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(key, value, path, map) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", _defineProperty({}, key, value));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function DefaultAsyncEntryInspector(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Given a `ResolverMap` object, walk its properties and allow execution
 * with each key, value pair. If the supplied function for handling a given
 * entry returns null instead of an object with the format `{key: value}`
 * then that entry will not be included in the final output.
 *
 * @method walkResolverMap
 *
 * @param {ResolverMap} object an object conforming to type `ResolverMap`
 * @param {boolean} wrap defaults to true. An entry whose value is neither a
 * function nor an object will be wrapped in a function returning the value. If
 * false is supplied here, a `ResolverMapStumble` error will be thrown instead
 * @param {Array<string>} path as `walkResolverMap` calls itself recursively,
 * path is appended to and added as a parameter to determine where in the tree
 * the current execution is working
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
function walkResolverMap(object) {
  var inspector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultEntryInspector;
  var wrap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var product = {};
  path.reduce(function (prev, cur) {
    if (!(0, _propAt["default"])(product, prev.concat(cur))) {
      (0, _propAt["default"])(product, prev.concat(cur), {});
    }
    prev.push(cur);
    return prev;
  }, []);
  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      _value = _Object$entries$_i[1];
    var isObject = _value instanceof Object;
    var isFunction = isObject && (0, _typework.isFn)(_value);
    if (isObject && !isFunction) {
      var newPath = path.concat(key);
      (0, _propAt["default"])(product, newPath, walkResolverMap(_value, inspector, wrap, newPath));
    } else {
      if (!isObject && !isFunction) {
        // In the case that we have a string mapping to a non-function and a
        // non-object, we can do one of two things. Either we can throw an error
        // or by default we simply wrap the value in a function that returns
        // that value
        if (!wrap) {
          throw new _errors.ResolverMapStumble(new Error("Invalid ResolverMap entry at ".concat(path.join('.'), ".").concat(key, ": value is ") + "neither an object nor a function"));
        } else {
          _value = function value() {
            return _value;
          };
        }
      }
      var entry = inspector(key, _value, path, object);
      if (entry !== undefined) {
        (0, _propAt["default"])(product, path.concat(key), entry[key]);
      }
    }
  };
  for (var _i = 0, _Object$entries = Object.entries(object); _i < _Object$entries.length; _i++) {
    _loop();
  }
  return product;
}

/**
 * Given a `ResolverMap` object, walk its properties and allow execution
 * with each key, value pair. If the supplied function for handling a given
 * entry returns null instead of an object with the format `{key: value}`
 * then that entry will not be included in the final output.
 *
 * @method asyncWalkResolverMap
 *
 * @param {ResolverMap} object an object conforming to type `ResolverMap`
 * @param {boolean} wrap defaults to true. An entry whose value is neither a
 * function nor an object will be wrapped in a function returning the value. If
 * false is supplied here, a `ResolverMapStumble` error will be thrown instead
 * @param {Array<string>} path as `walkResolverMap` calls itself recursively,
  * path is appended to and added as a parameter to determine where in the tree
  * the current execution is working
 * @param {Array<error>} skips if supplied, this array will have an appended
 * error for each sub async walk error caught.
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
function asyncWalkResolverMap(_x5) {
  return _asyncWalkResolverMap.apply(this, arguments);
}
/**
 * Type definition for a property within a ResolverMap. It encapsulates the
 * property's name, value, the path to reach it within the object, and the
 * object itself.
 *
 * 
 * @type {ResolverProperty}
 */
function _asyncWalkResolverMap() {
  _asyncWalkResolverMap = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(object) {
    var inspector,
      wrap,
      path,
      skips,
      product,
      _loop2,
      _i3,
      _Object$entries2,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          inspector = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : DefaultAsyncEntryInspector;
          wrap = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : true;
          path = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : [];
          skips = _args3.length > 4 ? _args3[4] : undefined;
          product = {};
          path.reduce(function (prev, cur) {
            if (!(0, _propAt["default"])(product, prev.concat(cur))) {
              (0, _propAt["default"])(product, prev.concat(cur), {});
            }
            prev.push(cur);
            return prev;
          }, []);
          _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2() {
            var _Object$entries2$_i, key, _value2, isObject, isFunction, entry;
            return _regeneratorRuntime().wrap(function _loop2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2), key = _Object$entries2$_i[0], _value2 = _Object$entries2$_i[1];
                  isObject = _value2 instanceof Object;
                  isFunction = isObject && (0, _typework.isFn)(_value2);
                  if (!(isObject && !isFunction)) {
                    _context2.next = 19;
                    break;
                  }
                  _context2.prev = 4;
                  _context2.t0 = _propAt["default"];
                  _context2.t1 = product;
                  _context2.t2 = path.concat(key);
                  _context2.next = 10;
                  return asyncWalkResolverMap(_value2, inspector, wrap, path, skips);
                case 10:
                  _context2.t3 = _context2.sent;
                  (0, _context2.t0)(_context2.t1, _context2.t2, _context2.t3);
                  _context2.next = 17;
                  break;
                case 14:
                  _context2.prev = 14;
                  _context2.t4 = _context2["catch"](4);
                  if (skips && Array.isArray(skips)) {
                    skips.push(new _errors.ResolverMapStumble(_context2.t4, {
                      key: key,
                      value: _value2,
                      source: object,
                      destination: product
                    }));
                  }
                case 17:
                  _context2.next = 29;
                  break;
                case 19:
                  if (!(!isObject && !isFunction)) {
                    _context2.next = 25;
                    break;
                  }
                  if (wrap) {
                    _context2.next = 24;
                    break;
                  }
                  throw new _errors.ResolverMapStumble(new Error('Invalid ResolverMap'));
                case 24:
                  _value2 = function value() {
                    return _value2;
                  };
                case 25:
                  _context2.next = 27;
                  return inspector(key, _value2, path, object);
                case 27:
                  entry = _context2.sent;
                  if (entry !== undefined) {
                    (0, _propAt["default"])(product, path.concat(key), entry[key]);
                  }
                case 29:
                case "end":
                  return _context2.stop();
              }
            }, _loop2, null, [[4, 14]]);
          });
          _i3 = 0, _Object$entries2 = Object.entries(object);
        case 8:
          if (!(_i3 < _Object$entries2.length)) {
            _context3.next = 13;
            break;
          }
          return _context3.delegateYield(_loop2(), "t0", 10);
        case 10:
          _i3++;
          _context3.next = 8;
          break;
        case 13:
          return _context3.abrupt("return", product);
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee2);
  }));
  return _asyncWalkResolverMap.apply(this, arguments);
}
/**
 * Merges two resolver objects recursively. In case of conflicting keys, the
 * provided `conflictResolver` function is called to determine the
 * resulting value.
 *
 * 
 * @param {Object} existingResolvers - The original set of resolvers.
 * @param {Object} newResolvers - The set of new resolvers to be merged into
 * the existing ones.
 * @param {function} conflictResolver - A function that resolves conflicts
 * between existing and new resolver properties.
 * @returns {Object} The merged set of resolvers.
 */
function mergeResolvers(existingResolvers, newResolvers) {
  var conflictResolver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (e, c) {
    return c.value;
  };
  // Recursive function to walk and merge the resolver maps
  var walkAndMerge = function walkAndMerge(current, incoming) {
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    for (var _i2 = 0, _Object$keys = Object.keys(incoming); _i2 < _Object$keys.length; _i2++) {
      var key = _Object$keys[_i2];
      var newPath = path.concat(key);

      // Check if the key exists in the current object
      if (Reflect.has(current, key)) {
        var existingValue = current[key];
        var incomingValue = incoming[key];
        if (existingValue && _typeof(existingValue) === 'object' && !Array.isArray(existingValue) && !(0, _typework.isFn)(existingValue)) {
          // If both are objects, we need to go deeper
          walkAndMerge(existingValue, incomingValue, newPath);
        } else {
          // Conflict detected, call the user-supplied conflict resolution function
          var existingProp = {
            name: key,
            value: existingValue,
            path: path,
            object: existingResolvers
          };
          var incomingProp = {
            name: key,
            value: incomingValue,
            path: path,
            object: newResolvers
          };
          current[key] = conflictResolver(existingProp, incomingProp);
        }
      } else {
        // No conflict, just set the value from the incoming object
        current[key] = incoming[key];
      }
    }
    return current;
  };
  return walkAndMerge(existingResolvers, newResolvers, []);
}
var _default = exports["default"] = walkResolverMap;