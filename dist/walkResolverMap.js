'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultAsyncEntryInspector = exports.DefaultEntryInspector = undefined;
exports.walkResolverMap = walkResolverMap;
exports.asyncWalkResolverMap = asyncWalkResolverMap;

var _errors = require('./errors');

var _propAt = require('./propAt');

var _propAt2 = _interopRequireDefault(_propAt);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isFn = o => /Function\]/.test(Object.prototype.toString.call(o));

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
const DefaultAsyncEntryInspector = exports.DefaultAsyncEntryInspector = async (key, value, path, map) => {
  return { [key]: value };
};

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

  for (let [key, value] of Object.entries(object)) {
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
async function asyncWalkResolverMap(object, inspector = DefaultAsyncEntryInspector, wrap = true, path = []) {
  let product = {};

  path.reduce((prev, cur, index) => {
    if (!(0, _propAt2.default)(product, prev.concat(cur))) {
      (0, _propAt2.default)(product, prev.concat(cur), {});
    }
    prev.push(cur);

    return prev;
  }, []);

  for (let [key, value] of Object.entries(object)) {
    const isObject = value instanceof Object;
    const isFunction = isObject && isFn(value);

    if (isObject && !isFunction) {
      (0, _propAt2.default)(product, path.concat(key), (await asyncWalkResolverMap(value, inspector, wrap, path)));
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

      let entry = await inspector(key, value, path, object);

      if (entry !== undefined) {
        (0, _propAt2.default)(product, path.concat(key), entry[key]);
      }
    }
  }

  return product;
}

exports.default = walkResolverMap;
//# sourceMappingURL=walkResolverMap.js.map