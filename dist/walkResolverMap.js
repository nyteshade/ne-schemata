'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncWalkResolverMap = exports.DefaultAsyncEntryInspector = exports.DefaultEntryInspector = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
let asyncWalkResolverMap = exports.asyncWalkResolverMap = (() => {
  var _ref4 = _asyncToGenerator(function* (object, inspector = DefaultAsyncEntryInspector, wrap = true, path = []) {
    let product = {};

    path.reduce(function (prev, cur, index) {
      if (!(0, _propAt2.default)(product, prev.concat(cur))) {
        (0, _propAt2.default)(product, prev.concat(cur), {});
      }
      prev.push(cur);

      return prev;
    }, []);

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.entries(object)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        let _ref5 = _step2.value;

        var _ref6 = _slicedToArray(_ref5, 2);

        let key = _ref6[0];
        let value = _ref6[1];

        const isObject = value instanceof Object;
        const isFunction = isObject && isFn(value);

        if (isObject && !isFunction) {
          (0, _propAt2.default)(product, path.concat(key), (yield asyncWalkResolverMap(value, inspector, wrap, path)));
        } else {
          if (!isObject && !isFunction) {
            // In the case that we have a string mapping to a non-function and a
            // non-object, we can do one of two things. Either we can throw an error
            // or by default we simply wrap the value in a function that returns
            // that value
            if (!wrap) {
              throw new _errors.ResolverMapStumble(new Error('Invalid ResolverMap'));
            } else {
              value = function (_value) {
                function value() {
                  return _value.apply(this, arguments);
                }

                value.toString = function () {
                  return _value.toString();
                };

                return value;
              }(function () {
                return value;
              });
            }
          }

          let entry = yield inspector(key, value, path, object);

          if (entry !== undefined) {
            (0, _propAt2.default)(product, path.concat(key), entry[key]);
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return product;
  });

  return function asyncWalkResolverMap(_x5) {
    return _ref4.apply(this, arguments);
  };
})();

exports.walkResolverMap = walkResolverMap;

var _errors = require('./errors');

var _propAt = require('./propAt');

var _propAt2 = _interopRequireDefault(_propAt);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const isFn = o => /Function\]/.test(Object.prototype.toString.call(o));

/**
 * An `EntryInspector` is a function passed to `walkResolverMap` that is
 * invoked for each encountered pair along the way as it traverses the
 * `ResolverMap` in question. The default behavior is to simply return the
 * supplied entry back.
 *
 * If false, null or undefined is returned instead of an object with a string
 * mapping to a Function, then that property will not be included in the final
 * results of `walkResolverMap`.
 *
 * @type {Function}
 *
 * @param {{[string]: Function}} entry the key value pair supplied on each call
 * @param {[string]} path an array of strings indicating the path currently
 * being executed
 * @param {ResolverMap} map the map in question should it be needed
 */


/**
 * An `AsyncEntryInspector` is a function passed to `asyncWalkResolverMap`
 * that is invoked for each encountered pair along the way as it traverses the
 * `ResolverMap` in question. The default behavior is to simply return the
 * supplied entry back.
 *
 * If false, null or undefined is returned instead of an object with a string
 * mapping to a Function, then that property will not be included in the final
 * results of `asyncWalkResolverMap`.
 *
 * @type {Function}
 *
 * @param {{[string]: Function}} entry the key value pair supplied on each call
 * @param {[string]} path an array of strings indicating the path currently
 * being executed
 * @param {ResolverMap} map the map in question should it be needed
 */


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
const DefaultEntryInspector = exports.DefaultEntryInspector = (key, value, path, map) => {
  return { [key]: value };
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
const DefaultAsyncEntryInspector = exports.DefaultAsyncEntryInspector = (() => {
  var _ref = _asyncToGenerator(function* (key, value, path, map) {
    return { [key]: value };
  });

  return function DefaultAsyncEntryInspector(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

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
function walkResolverMap(object, inspector = DefaultEntryInspector, wrap = true, path = []) {
  let product = {};

  path.reduce((prev, cur, index) => {
    if (!(0, _propAt2.default)(product, prev.concat(cur))) {
      (0, _propAt2.default)(product, prev.concat(cur), {});
    }
    prev.push(cur);

    return prev;
  }, []);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(object)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let _ref2 = _step.value;

      var _ref3 = _slicedToArray(_ref2, 2);

      let key = _ref3[0];
      let value = _ref3[1];

      const isObject = value instanceof Object;
      const isFunction = isObject && isFn(value);

      if (isObject && !isFunction) {
        (0, _propAt2.default)(product, path.concat(key), walkResolverMap(value, inspector, wrap, path));
      } else {
        if (!isObject && !isFunction) {
          // In the case that we have a string mapping to a non-function and a
          // non-object, we can do one of two things. Either we can throw an error
          // or by default we simply wrap the value in a function that returns
          // that value
          if (!wrap) {
            throw new _errors.ResolverMapStumble(new Error('Invalid ResolverMap'));
          } else {
            value = () => value;
          }
        }

        let entry = inspector(key, value, path, object);

        if (entry !== undefined) {
          (0, _propAt2.default)(product, path.concat(key), entry[key]);
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return product;
}exports.default = walkResolverMap;
//# sourceMappingURL=walkResolverMap.js.map