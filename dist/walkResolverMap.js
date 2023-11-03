"use strict";

require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultEntryInspector = exports.DefaultAsyncEntryInspector = void 0;
exports.asyncWalkResolverMap = asyncWalkResolverMap;
exports["default"] = void 0;
exports.mergeResolvers = mergeResolvers;
exports.protoChain = protoChain;
exports.walkResolverMap = walkResolverMap;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.object.entries.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.join.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.reflect.has.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _errors = require("./errors");
var _propAt = _interopRequireDefault(require("./propAt"));
var isFn = function isFn(o) {
  return /Function\]/.test(Object.prototype.toString.call(o));
};
var getType = function getType(o) {
  var _exec;
  return (_exec = /t (\w+)/.exec(Object.prototype.toString.call(o))) === null || _exec === void 0 ? void 0 : _exec[1];
};

/**
 * Given an input of any type, `protoChain` constructs an array representing
 * the prototype chain of the input. This array consists of constructor names
 * for each type in the chain. The resulting array also includes a non-standard
 * `isa` method that checks if a given constructor name is part of the chain.
 * Additionally, an `actual` getter is defined to attempt evaluation of the
 * prototype chain names to their actual type references, where possible.
 *
 * 
 * @param {mixed} object - The input value for which the prototype chain is
 * desired.
 * @returns {Array<string> & { isa: Function, actual: Array<any> }} An
 * array of constructor names
 *          with appended `isa` method and `actual` getter.
 *
 * @note The `isa` method allows checking if a given type name is in the
 * prototype chain. The `actual` getter attempts to convert type names back
 * to their evaluated types.
 */
function protoChain(object) {
  if (object === null || object === undefined) {
    return [getType(object)];
  }
  var chain = [Object.getPrototypeOf(object)];
  var current = chain[0];
  while (current != null) {
    current = Object.getPrototypeOf(current);
    chain.push(current);
  }
  var results = chain.map(function (c) {
    var _c$constructor;
    return (c === null || c === void 0 ? void 0 : (_c$constructor = c.constructor) === null || _c$constructor === void 0 ? void 0 : _c$constructor.name) || c;
  }).filter(function (c) {
    return !!c;
  });
  Object.defineProperties(results, {
    isa: {
      value: function isa(type) {
        var derived = getType(type);
        switch (derived) {
          case [Function.name]:
            derived = type.name;
            break;
          default:
            break;
        }
        return this.includes(derived);
      }
    },
    actual: {
      get: function get() {
        var evalOrBust = function evalOrBust(o) {
          try {
            return eval(o);
          } catch (_unused) {
            return o;
          }
        };
        var revert = function revert(o) {
          switch (o) {
            case 'Null':
              return null;
            case 'Undefined':
              return undefined;
            default:
              return o;
          }
        };
        console.log(this.map(revert));
        console.log(this.map(revert).map(evalOrBust));
        return this.map(revert).map(evalOrBust);
      }
    }
  });
  return results;
}

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
  return (0, _defineProperty2["default"])({}, key, value);
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
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(key, value, path, map) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _defineProperty2["default"])({}, key, value));
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
    var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      _value = _Object$entries$_i[1];
    var isObject = _value instanceof Object;
    var isFunction = isObject && isFn(_value);
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
  _asyncWalkResolverMap = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(object) {
    var inspector,
      wrap,
      path,
      skips,
      product,
      _loop2,
      _i3,
      _Object$entries2,
      _args3 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context3) {
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
          _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
            var _Object$entries2$_i, key, _value2, isObject, isFunction, entry;
            return _regenerator["default"].wrap(function _loop2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  _Object$entries2$_i = (0, _slicedToArray2["default"])(_Object$entries2[_i3], 2), key = _Object$entries2$_i[0], _value2 = _Object$entries2$_i[1];
                  isObject = _value2 instanceof Object;
                  isFunction = isObject && isFn(_value2);
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
        if (existingValue && (0, _typeof2["default"])(existingValue) === 'object' && !Array.isArray(existingValue) && !isFn(existingValue)) {
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