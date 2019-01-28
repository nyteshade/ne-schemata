"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walkResolverMap = walkResolverMap;
exports.asyncWalkResolverMap = asyncWalkResolverMap;
exports.default = exports.DefaultAsyncEntryInspector = exports.DefaultEntryInspector = void 0;

var _errors = require("./errors");

var _propAt = _interopRequireDefault(require("./propAt"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isFn = function isFn(o) {
  return /Function\]/.test(Object.prototype.toString.call(o));
};
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


var DefaultEntryInspector = function DefaultEntryInspector(key, value, path, map) {
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


exports.DefaultEntryInspector = DefaultEntryInspector;

var DefaultAsyncEntryInspector =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(key, value, path, map) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", _defineProperty({}, key, value));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
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
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */


exports.DefaultAsyncEntryInspector = DefaultAsyncEntryInspector;

function walkResolverMap(object) {
  var inspector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultEntryInspector;
  var wrap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var product = {};
  path.reduce(function (prev, cur, index) {
    if (!(0, _propAt.default)(product, prev.concat(cur))) {
      (0, _propAt.default)(product, prev.concat(cur), {});
    }

    prev.push(cur);
    return prev;
  }, []);

  var _arr = Object.entries(object);

  var _loop = function _loop() {
    var _arr$_i = _slicedToArray(_arr[_i], 2),
        key = _arr$_i[0],
        _value = _arr$_i[1];

    var isObject = _value instanceof Object;
    var isFunction = isObject && isFn(_value);

    if (isObject && !isFunction) {
      (0, _propAt.default)(product, path.concat(key), walkResolverMap(_value, inspector, wrap, path));
    } else {
      if (!isObject && !isFunction) {
        // In the case that we have a string mapping to a non-function and a
        // non-object, we can do one of two things. Either we can throw an error
        // or by default we simply wrap the value in a function that returns
        // that value
        if (!wrap) {
          throw new _errors.ResolverMapStumble(new Error('Invalid ResolverMap'));
        } else {
          _value = function value() {
            return _value;
          };
        }
      }

      var entry = inspector(key, _value, path, object);

      if (entry !== undefined) {
        (0, _propAt.default)(product, path.concat(key), entry[key]);
      }
    }
  };

  for (var _i = 0; _i < _arr.length; _i++) {
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
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */


function asyncWalkResolverMap(_x5) {
  return _asyncWalkResolverMap.apply(this, arguments);
}

function _asyncWalkResolverMap() {
  _asyncWalkResolverMap = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(object) {
    var inspector,
        wrap,
        path,
        product,
        _arr2,
        _loop2,
        _i2,
        _args3 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            inspector = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : DefaultAsyncEntryInspector;
            wrap = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : true;
            path = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : [];
            product = {};
            path.reduce(function (prev, cur, index) {
              if (!(0, _propAt.default)(product, prev.concat(cur))) {
                (0, _propAt.default)(product, prev.concat(cur), {});
              }

              prev.push(cur);
              return prev;
            }, []);
            _arr2 = Object.entries(object);
            _loop2 =
            /*#__PURE__*/
            regeneratorRuntime.mark(function _loop2() {
              var _arr2$_i, key, _value2, isObject, isFunction, entry;

              return regeneratorRuntime.wrap(function _loop2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _arr2$_i = _slicedToArray(_arr2[_i2], 2), key = _arr2$_i[0], _value2 = _arr2$_i[1];
                      isObject = _value2 instanceof Object;
                      isFunction = isObject && isFn(_value2);

                      if (!(isObject && !isFunction)) {
                        _context2.next = 13;
                        break;
                      }

                      _context2.t0 = _propAt.default;
                      _context2.t1 = product;
                      _context2.t2 = path.concat(key);
                      _context2.next = 9;
                      return asyncWalkResolverMap(_value2, inspector, wrap, path);

                    case 9:
                      _context2.t3 = _context2.sent;
                      (0, _context2.t0)(_context2.t1, _context2.t2, _context2.t3);
                      _context2.next = 23;
                      break;

                    case 13:
                      if (!(!isObject && !isFunction)) {
                        _context2.next = 19;
                        break;
                      }

                      if (wrap) {
                        _context2.next = 18;
                        break;
                      }

                      throw new _errors.ResolverMapStumble(new Error('Invalid ResolverMap'));

                    case 18:
                      _value2 = function value() {
                        return _value2;
                      };

                    case 19:
                      _context2.next = 21;
                      return inspector(key, _value2, path, object);

                    case 21:
                      entry = _context2.sent;

                      if (entry !== undefined) {
                        (0, _propAt.default)(product, path.concat(key), entry[key]);
                      }

                    case 23:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop2, this);
            });
            _i2 = 0;

          case 8:
            if (!(_i2 < _arr2.length)) {
              _context3.next = 13;
              break;
            }

            return _context3.delegateYield(_loop2(), "t0", 10);

          case 10:
            _i2++;
            _context3.next = 8;
            break;

          case 13:
            return _context3.abrupt("return", product);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }));
  return _asyncWalkResolverMap.apply(this, arguments);
}

var _default = walkResolverMap;
exports.default = _default;