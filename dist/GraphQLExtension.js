"use strict";

require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.error.cause.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.deregister = deregister;
exports.graphQLExtensionHandler = graphQLExtensionHandler;
exports.importGraphQL = importGraphQL;
exports.register = register;
exports.resolvedPath = resolvedPath;
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _Schemata = require("./Schemata");
var _dynamicImport = require("./dynamicImport");
var _fs = require("fs");
var _promises = require("fs/promises");
var _path = require("path");
var _util = require("util");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Resolves the given path to an existing file by attempting to append provided or
 * default file extensions, and returns the resolved file path.
 *
 * The function performs a series of checks and transformations on the `givenPath`
 * input to ascertain its validity and attempt to resolve it to an existing file.
 * Initially, it discerns whether `givenPath` already has a file extension. If it
 * does, and the file exists, it returns the resolved path. If not, it iterates
 * through a list of file extensions (provided in `tryExts` or defaults to
 * ['.js', '.ts']), appending each extension to `givenPath`, checking the existence
 * of the resultant file, and returning the path upon successful resolution.
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
  _resolvedPath = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(givenPath) {
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
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          tryExts = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : ['.js', '.ts'];
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
  (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var path;
    return _regenerator["default"].wrap(function _callee$(_context) {
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
  _importGraphQL = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(filename) {
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
    return _regenerator["default"].wrap(function _callee3$(_context3) {
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
          schemata.resolvers = resolvers = (_jsModule$resolvers = jsModule === null || jsModule === void 0 ? void 0 : jsModule.resolvers) !== null && _jsModule$resolvers !== void 0 ? _jsModule$resolvers : (0, _typeof2["default"])(jsModule) == 'object' && jsModule;
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