"use strict";

require("core-js/modules/es.array.join.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.define-properties.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamicImport = dynamicImport;
exports.findNearestPackageJson = findNearestPackageJson;
exports.pathParse = pathParse;
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _promises = require("fs/promises");
var _path = require("path");
var _GraphQLExtension = require("./GraphQLExtension.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/**
 * Searches for the nearest package.json file by walking up the directory tree.
 *
 * @param {string} startDir - The directory to start the search from.
 * @returns {Promise<string|null>} - A promise that resolves to the path to the nearest package.json,
 * or null if not found.
 */
function findNearestPackageJson(_x) {
  return _findNearestPackageJson.apply(this, arguments);
}
/**
 * Dynamically imports a module using require or await import() based on the module system in use.
 *
 * @param {string} modulePath - The path to the module to be imported.
 * @returns {Promise<any>} - A promise that resolves to the imported module.
 */
function _findNearestPackageJson() {
  _findNearestPackageJson = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(startDir) {
    var dir, potentialPath;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          dir = startDir;
        case 1:
          if (!(dir !== (0, _path.parse)(dir).root)) {
            _context.next = 14;
            break;
          }
          potentialPath = (0, _path.join)(dir, 'package.json');
          _context.prev = 3;
          _context.next = 6;
          return (0, _promises.access)(potentialPath);
        case 6:
          return _context.abrupt("return", potentialPath);
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](3);
          dir = (0, _path.dirname)(dir);
        case 12:
          _context.next = 1;
          break;
        case 14:
          return _context.abrupt("return", null);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 9]]);
  }));
  return _findNearestPackageJson.apply(this, arguments);
}
function dynamicImport(_x2) {
  return _dynamicImport.apply(this, arguments);
}
/**
 * Asynchronously parses a given file or directory path to provide detailed path information along with
 * the resolved full path and a directory indicator.
 *
 * This function receives a single string argument representing a file or directory path, which it
 * subsequently resolves to an absolute path using Node.js's `path.resolve`. It then parses the
 * resolved path using `path.parse` to extract path components such as the root, directory, base,
 * extension, and name. Additionally, it performs a filesystem stat operation on the resolved path
 * using `fs.promises.stat` to determine whether the path represents a directory. The function
 * amalgamates these pieces of information into a single object, which it returns.
 *
 * The returned object extends the object returned by `path.parse` with three additional properties:
 * - `base`: Overridden to an empty string.
 * - `fullPath`: The absolute, resolved path.
 * - `isDir`: A boolean indicating whether the path represents a directory.
 *
 * This function is asynchronous and returns a promise that resolves to the aforementioned object.
 *
 * @param {string} path - The file or directory path to be parsed. Accepts both relative and absolute paths.
 * @returns {Promise<Object>} A promise that resolves to an object encapsulating detailed path information,
 * the resolved full path, and a directory indicator.
 * @throws Will throw an error if the filesystem stat operation fails, for instance due to insufficient
 * permissions or a nonexistent path.
 *
 * @example
 * pathParse('./someDir')
 *   .then(info => console.log(info))
 *   .catch(error => console.error('An error occurred:', error));
 */
function _dynamicImport() {
  _dynamicImport = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(modulePath) {
    var packageJsonPath, packageJson, isESM;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return findNearestPackageJson(__dirname);
        case 2:
          packageJsonPath = _context2.sent;
          if (!packageJsonPath) {
            _context2.next = 17;
            break;
          }
          _context2.t0 = JSON;
          _context2.next = 7;
          return (0, _promises.readFile)(packageJsonPath, 'utf-8');
        case 7:
          _context2.t1 = _context2.sent;
          packageJson = _context2.t0.parse.call(_context2.t0, _context2.t1);
          isESM = packageJson.type === 'module';
          if (!isESM) {
            _context2.next = 14;
            break;
          }
          return _context2.abrupt("return", function (specifier) {
            return new Promise(function (r) {
              return r("".concat(specifier));
            }).then(function (s) {
              return _interopRequireWildcard(require(s));
            });
          }(modulePath));
        case 14:
          return _context2.abrupt("return", Promise.resolve(require(modulePath)));
        case 15:
          _context2.next = 18;
          break;
        case 17:
          return _context2.abrupt("return", Promise.resolve(require(modulePath)));
        case 18:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _dynamicImport.apply(this, arguments);
}
function pathParse(_x3) {
  return _pathParse.apply(this, arguments);
}
function _pathParse() {
  _pathParse = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(path) {
    var fullPath, baseParsed, pathStat;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          fullPath = (0, _path.resolve)(path);
          baseParsed = (0, _path.parse)(fullPath);
          _context3.next = 4;
          return (0, _promises.stat)(fullPath);
        case 4:
          pathStat = _context3.sent;
          return _context3.abrupt("return", _objectSpread(_objectSpread({}, baseParsed), {
            base: '',
            fullPath: fullPath,
            isDir: pathStat.isDirectory()
          }));
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _pathParse.apply(this, arguments);
}