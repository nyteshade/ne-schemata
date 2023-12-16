"use strict";

require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.object.proto.js");
require("core-js/modules/es.array.reverse.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.array.is-array.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.deregister = deregister;
exports.graphQLExtensionHandler = graphQLExtensionHandler;
exports.importGraphQL = importGraphQL;
exports.register = register;
exports.resolvedPath = resolvedPath;
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
var _Schemata = require("./Schemata");
var _dynamicImport = require("./dynamicImport");
var _fs = require("fs");
var _promises = require("fs/promises");
var _path = require("path");
var _util = require("util");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * Resolves the given path to an existing file by attempting to append provided or
 * default file extensions, and returns the resolved file path.
 *
 * The function performs a series of checks and transformations on the `givenPath`
 * input to ascertain its validity and attempt to resolve it to an existing file.
 * Initially, it discerns whether `givenPath` already has a file extension. If it
 * does, and the file exists, it returns the resolved path. If not, it iterates
 * through a list of file extensions (provided in `tryExts` or defaults to
 * ['.js', '.ts', '.mjs', '.cjs']), appending each extension to `givenPath`, 
 * checking the existence of the resultant file, and returning the path upon 
 * successful resolution.
 *
 * Utilizes functions from the 'fs', 'fs/promises', and 'path' modules of Node.js,
 * as well as a custom `Schemata` import. It employs the `promisify` utility to
 * handle callback-based `fs` functions in a promise oriented manner.
 *
 * @param {string} givenPath - The file path to be resolved. Should be a string
 * representing a relative or absolute path to a file, with or without a file extension.
 * @param {Array<string>} [tryExts=['.js', '.ts']] - An optional array of string
 * file extensions to attempt appending to `givenPath` if it lacks an extension.
 * Defaults to ['.js', '.ts'].
 * @returns {Promise<string|null>} A promise that resolves to a string representing
 * the path to an existing file, or null if no file could be resolved.
 * @throws Will throw an error if any of the filesystem operations fail, for instance
 * due to insufficient permissions.
 *
 * @example
 * // Assume a file named 'example.js' exists in the current directory
 * // Outputs: '/absolute/path/to/example.js'
 * resolvedPath('./example').then(resolved => console.log(resolved));
 *
 * // Outputs: null (if 'example.ts' doesn't exist)
 * resolvedPath('./example.ts').then(resolved => console.log(resolved));
 */
function resolvedPath(_x) {
  return _resolvedPath.apply(this, arguments);
}
/**
 * Adds the ability to `require` or `import` files ending in a `.graphql`
 * extension. The exports returned from such an import consist of four
 * major values and one default value.
 *
 * values:
 *   astNode   - an ASTNode document object representing the SDL contents
 *               of the .graphql file contents. Null if the text is invalid
 *   resovlers - if there is an adjacent file with the same name, ending in
 *               .js and it exports either a `resolvers` key or an object by
 *               default, this value will be set on the sdl object as its set
 *               resolvers/rootObj
 *   schema    - a GraphQLSchema instance object if the contents of the .graphql
 *               file represent both valid SDL and contain at least one root
 *               type such as Query, Mutation or Subscription
 *   sdl       - the string of SDL wrapped in an instance of Schemata
 *   typeDefs  - the raw string used that `sdl` wraps
 *   default   - the sdl string wrapped in an instance of Schemata is the
 *               default export
 *
 * @param {Module} module a node JS Module instance
 * @param {string} filename a fully qualified path to the file being imported
 */
function _resolvedPath() {
  _resolvedPath = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(givenPath) {
    var tryExts,
      hasext,
      exists,
      nopath,
      resolved,
      parsed,
      useFilepath,
      _iterator,
      _step,
      ext,
      tryPath,
      tryTrue,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          tryExts = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : ['.js', '.ts', '.mjs', '.cjs'];
          hasext = function hasext(filepath) {
            return !!(0, _path.parse)(String(filepath)).ext;
          };
          exists = (0, _util.promisify)(_fs.exists);
          nopath = function nopath(fp) {
            var parsed = (0, _path.parse)(fp);
            return !!(parsed.root || parsed.dir);
          };
          resolved = (0, _path.resolve)(givenPath);
          parsed = _objectSpread(_objectSpread({}, (0, _path.parse)(resolved)), {
            base: ''
          });
          useFilepath = null;
          _context2.t0 = hasext(resolved);
          if (!_context2.t0) {
            _context2.next = 12;
            break;
          }
          _context2.next = 11;
          return exists(resolved);
        case 11:
          _context2.t0 = _context2.sent;
        case 12:
          if (!_context2.t0) {
            _context2.next = 16;
            break;
          }
          useFilepath = resolved;
          _context2.next = 37;
          break;
        case 16:
          _iterator = _createForOfIteratorHelper(tryExts);
          _context2.prev = 17;
          _iterator.s();
        case 19:
          if ((_step = _iterator.n()).done) {
            _context2.next = 29;
            break;
          }
          ext = _step.value;
          tryPath = (0, _path.format)(_objectSpread(_objectSpread({}, parsed), {
            ext: ext
          }));
          _context2.next = 24;
          return exists(tryPath);
        case 24:
          tryTrue = _context2.sent;
          if (!tryTrue) {
            _context2.next = 27;
            break;
          }
          return _context2.abrupt("return", tryPath);
        case 27:
          _context2.next = 19;
          break;
        case 29:
          _context2.next = 34;
          break;
        case 31:
          _context2.prev = 31;
          _context2.t1 = _context2["catch"](17);
          _iterator.e(_context2.t1);
        case 34:
          _context2.prev = 34;
          _iterator.f();
          return _context2.finish(34);
        case 37:
          return _context2.abrupt("return", useFilepath);
        case 38:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[17, 31, 34, 37]]);
  }));
  return _resolvedPath.apply(this, arguments);
}
function graphQLExtensionHandler(module, filename) {
  _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var path;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return importGraphQL(filename);
        case 3:
          module.exports = _context.sent;
          _context.next = 14;
          break;
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          _context.next = 11;
          return resolvedPath(filename, ['.graphql', '.gql', '.sdl']);
        case 11:
          path = _context.sent;
          process.nextTick(function () {
            if (path) {
              delete require.cache[path];
            }
          });
          module.exports = undefined;
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }))();
}

/**
 * Registers the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files with
 * the same name.
 */
function register() {
  require.extensions = require.extensions || {};
  require.extensions['.graphql'] = graphQLExtensionHandler;
  require.extensions['.sdl'] = graphQLExtensionHandler;
  require.extensions['.gql'] = graphQLExtensionHandler;
}

/**
 * Deregisters the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and restores the original `.js` extension handler.
 */
function deregister() {
  delete require.extensions['.graphql'];
  delete require.extensions['.sdl'];
  delete require.extensions['.gql'];
}
function importGraphQL(_x2) {
  return _importGraphQL.apply(this, arguments);
}
/**
 * Sets up custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files
 * with the same name.
 *
 * @type {Function}
 */
function _importGraphQL() {
  _importGraphQL = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(filename) {
    var tryExts,
      remext,
      filepath,
      content,
      schemata,
      astNode,
      schema,
      resolversPath,
      resolvers,
      _jsModule$resolvers,
      jsModule,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          tryExts = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : ['.graphql', '.gql', '.sdl'];
          remext = function remext(fn) {
            return (0, _path.format)(_objectSpread(_objectSpread({}, (0, _path.parse)(fn)), {
              base: '',
              ext: ''
            }));
          };
          _context3.next = 4;
          return resolvedPath(filename, tryExts);
        case 4:
          filepath = _context3.sent;
          if (filepath) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", null);
        case 7:
          _context3.next = 9;
          return (0, _promises.readFile)(filepath);
        case 9:
          content = _context3.sent.toString();
          schemata = new _Schemata.Schemata(content);
          astNode = schemata.ast;
          schema = schemata.schema;
          resolversPath = null;
          resolvers = null;
          _context3.prev = 15;
          _context3.next = 18;
          return resolvedPath(remext(filepath));
        case 18:
          resolversPath = _context3.sent;
          if (!resolversPath) {
            _context3.next = 25;
            break;
          }
          _context3.next = 22;
          return (0, _dynamicImport.dynamicImport)(resolversPath);
        case 22:
          jsModule = _context3.sent;
          schemata.resolvers = resolvers = (_jsModule$resolvers = jsModule === null || jsModule === void 0 ? void 0 : jsModule.resolvers) !== null && _jsModule$resolvers !== void 0 ? _jsModule$resolvers : _typeof(jsModule) == 'object' && jsModule;
          if (schemata.resolvers) {
            schemata.clearSchema();
            schema = schemata.schema;
          }
        case 25:
          _context3.next = 30;
          break;
        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](15);
          console.error(_context3.t0);
        case 30:
          return _context3.abrupt("return", {
            astNode: astNode,
            resolvers: resolvers,
            schema: schema,
            sdl: schemata.sdl,
            schemata: schemata,
            typeDefs: schemata,
            filePath: filepath,
            resolversPath: resolversPath
          });
        case 31:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[15, 27]]);
  }));
  return _importGraphQL.apply(this, arguments);
}
var _default = exports["default"] = register;