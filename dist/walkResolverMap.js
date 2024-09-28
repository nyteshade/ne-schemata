"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultEntryInspector = exports.DefaultAsyncEntryInspector = void 0;
exports.asyncWalkResolverMap = asyncWalkResolverMap;
exports.default = void 0;
exports.mergeResolvers = mergeResolvers;
exports.walkResolverMap = walkResolverMap;
var _errors = require("./errors");
var _typework = require("./utils/typework");
var _propAt = _interopRequireDefault(require("./propAt"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// @ts-check

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
const DefaultEntryInspector = (key, value, path, map) => {
  return {
    [key]: value
  };
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
const DefaultAsyncEntryInspector = async (key, value, path, map) => {
  return {
    [key]: value
  };
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
 * @param {Array<string>} path as `walkResolverMap` calls itself recursively,
 * path is appended to and added as a parameter to determine where in the tree
 * the current execution is working
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
exports.DefaultAsyncEntryInspector = DefaultAsyncEntryInspector;
function walkResolverMap(object, inspector = DefaultEntryInspector, wrap = true, path = []) {
  let product = {};
  path.reduce((prev, cur) => {
    if (!(0, _propAt.default)(product, prev.concat(cur))) {
      (0, _propAt.default)(product, prev.concat(cur), {});
    }
    prev.push(cur);
    return prev;
  }, []);
  for (let [key, value] of Object.entries(object)) {
    const isObject = value instanceof Object;
    const isFunction = isObject && (0, _typework.isFn)(value);
    if (isObject && !isFunction) {
      const newPath = path.concat(key);
      (0, _propAt.default)(product, newPath, walkResolverMap(value, inspector, wrap, newPath));
    } else {
      if (!isObject && !isFunction) {
        // In the case that we have a string mapping to a non-function and a
        // non-object, we can do one of two things. Either we can throw an error
        // or by default we simply wrap the value in a function that returns
        // that value
        if (!wrap) {
          throw new _errors.ResolverMapStumble(new Error(`Invalid ResolverMap entry at ${path.join('.')}.${key}: value is ` + `neither an object nor a function`));
        } else {
          value = () => value;
        }
      }
      let entry = inspector(key, value, path, object);
      if (entry !== undefined) {
        (0, _propAt.default)(product, path.concat(key), entry[key]);
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
 * @param {Array<string>} path as `walkResolverMap` calls itself recursively,
  * path is appended to and added as a parameter to determine where in the tree
  * the current execution is working
 * @param {Array<error>} skips if supplied, this array will have an appended
 * error for each sub async walk error caught.
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
async function asyncWalkResolverMap(object, inspector = DefaultAsyncEntryInspector, wrap = true, path = [], skips) {
  let product = {};
  path.reduce((prev, cur) => {
    if (!(0, _propAt.default)(product, prev.concat(cur))) {
      (0, _propAt.default)(product, prev.concat(cur), {});
    }
    prev.push(cur);
    return prev;
  }, []);
  for (let [key, value] of Object.entries(object)) {
    const isObject = value instanceof Object;
    const isFunction = isObject && (0, _typework.isFn)(value);
    if (isObject && !isFunction) {
      try {
        (0, _propAt.default)(product, path.concat(key), await asyncWalkResolverMap(value, inspector, wrap, path, skips));
      } catch (stumble) {
        if (skips && Array.isArray(skips)) {
          skips.push(new _errors.ResolverMapStumble(stumble, {
            key,
            value,
            source: object,
            destination: product
          }));
        }
      }
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
        (0, _propAt.default)(product, path.concat(key), entry[key]);
      }
    }
  }
  return product;
}

/**
 * Type definition for a property within a ResolverMap. It encapsulates the
 * property's name, value, the path to reach it within the object, and the
 * object itself.
 *
 * 
 * @type {ResolverProperty}
 */

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
function mergeResolvers(existingResolvers, newResolvers, conflictResolver = (e, c) => c.value) {
  // Recursive function to walk and merge the resolver maps
  const walkAndMerge = (current, incoming, path = []) => {
    for (const key of Object.keys(incoming)) {
      const newPath = path.concat(key);

      // Check if the key exists in the current object
      if (Reflect.has(current, key)) {
        const existingValue = current[key];
        const incomingValue = incoming[key];
        if (existingValue && typeof existingValue === 'object' && !Array.isArray(existingValue) && !(0, _typework.isFn)(existingValue)) {
          // If both are objects, we need to go deeper
          walkAndMerge(existingValue, incomingValue, newPath);
        } else {
          // Conflict detected, call the user-supplied conflict resolution function
          const existingProp = {
            name: key,
            value: existingValue,
            path,
            object: existingResolvers
          };
          const incomingProp = {
            name: key,
            value: incomingValue,
            path,
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
var _default = exports.default = walkResolverMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXJyb3JzIiwicmVxdWlyZSIsIl90eXBld29yayIsIl9wcm9wQXQiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiRGVmYXVsdEVudHJ5SW5zcGVjdG9yIiwia2V5IiwidmFsdWUiLCJwYXRoIiwibWFwIiwiZXhwb3J0cyIsIkRlZmF1bHRBc3luY0VudHJ5SW5zcGVjdG9yIiwid2Fsa1Jlc29sdmVyTWFwIiwib2JqZWN0IiwiaW5zcGVjdG9yIiwid3JhcCIsInByb2R1Y3QiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyIiwiYXQiLCJjb25jYXQiLCJwdXNoIiwiT2JqZWN0IiwiZW50cmllcyIsImlzT2JqZWN0IiwiaXNGdW5jdGlvbiIsImlzRm4iLCJuZXdQYXRoIiwiUmVzb2x2ZXJNYXBTdHVtYmxlIiwiRXJyb3IiLCJqb2luIiwiZW50cnkiLCJ1bmRlZmluZWQiLCJhc3luY1dhbGtSZXNvbHZlck1hcCIsInNraXBzIiwic3R1bWJsZSIsIkFycmF5IiwiaXNBcnJheSIsInNvdXJjZSIsImRlc3RpbmF0aW9uIiwibWVyZ2VSZXNvbHZlcnMiLCJleGlzdGluZ1Jlc29sdmVycyIsIm5ld1Jlc29sdmVycyIsImNvbmZsaWN0UmVzb2x2ZXIiLCJjIiwid2Fsa0FuZE1lcmdlIiwiY3VycmVudCIsImluY29taW5nIiwia2V5cyIsIlJlZmxlY3QiLCJoYXMiLCJleGlzdGluZ1ZhbHVlIiwiaW5jb21pbmdWYWx1ZSIsImV4aXN0aW5nUHJvcCIsIm5hbWUiLCJpbmNvbWluZ1Byb3AiLCJfZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uL3NyYy93YWxrUmVzb2x2ZXJNYXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCB0eXBlIHsgUmVzb2x2ZXJNYXAsIEVudHJ5SW5zcGVjdG9yLCBBc3luY0VudHJ5SW5zcGVjdG9yIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IFJlc29sdmVyTWFwU3R1bWJsZSB9IGZyb20gJy4vZXJyb3JzJ1xuaW1wb3J0IHsgaXNGbiwgZ2V0VHlwZSB9IGZyb20gJy4vdXRpbHMvdHlwZXdvcmsnXG5pbXBvcnQgYXQgZnJvbSAnLi9wcm9wQXQnXG5cbi8qKlxuICogQSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBFbnRyeUluc3BlY3RvciB0eXBlIGZvciB1c2UgYXMgYSBkZWZhdWx0XG4gKiB0byBgd2Fsa1Jlc29sdmVyTWFwYC4gV2hpbGUgbm90IGltbWVkaWF0ZWx5IHVzZWZ1bCwgYSBkZWZhdWx0IGltcGxlbWVudGF0aW9uXG4gKiBjYXVzZXMgYHdhbGtSZXNvbHZlck1hcGAgdG8gd3JhcCBhbnkgbm9uLWZ1bmN0aW9uIGFuZCBub24tb2JqZWN0IHZhbHVlc1xuICogd2l0aCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbm9uLWNvbXBsaWFudCB2YWx1ZSBhbmQgdGhlcmVmb3JlIGhhcyBzb21lXG4gKiBpbnRyaW5zaWMgdmFsdWUuXG4gKlxuICogQG1ldGhvZCBEZWZhdWx0RW50cnlJbnNwZWN0b3JcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGNvbnN0IERlZmF1bHRFbnRyeUluc3BlY3RvcjogRW50cnlJbnNwZWN0b3IgPSAoXG4gIGtleSxcbiAgdmFsdWUsXG4gIHBhdGgsXG4gIG1hcFxuKSA9PiB7XG4gIHJldHVybiB7IFtrZXldOiB2YWx1ZSB9XG59XG5cbi8qKlxuICogQSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBFbnRyeUluc3BlY3RvciB0eXBlIGZvciB1c2UgYXMgYSBkZWZhdWx0XG4gKiB0byBgYXN5bmNXYWxrUmVzb2x2ZXJNYXBgLiBXaGlsZSBub3QgaW1tZWRpYXRlbHkgdXNlZnVsLCBhIGRlZmF1bHRcbiAqIGltcGxlbWVudGF0aW9uIGNhdXNlcyBgYXN5bmNXYWxrUmVzb2x2ZXJNYXBgIHRvIHdyYXAgYW55IG5vbi1mdW5jdGlvbiBhbmRcbiAqIG5vbi1vYmplY3QgdmFsdWVzIHdpdGggYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG5vbi1jb21wbGlhbnQgdmFsdWUgYW5kXG4gKiB0aGVyZWZvcmUgaGFzIHNvbWUgaW50cmluc2ljIHZhbHVlLlxuICpcbiAqIEBtZXRob2QgRGVmYXVsdEVudHJ5SW5zcGVjdG9yXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXN5bmNFbnRyeUluc3BlY3RvcjogQXN5bmNFbnRyeUluc3BlY3RvciA9IGFzeW5jIChcbiAga2V5LFxuICB2YWx1ZSxcbiAgcGF0aCxcbiAgbWFwXG4pID0+IHtcbiAgcmV0dXJuIHsgW2tleV06IHZhbHVlIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGBSZXNvbHZlck1hcGAgb2JqZWN0LCB3YWxrIGl0cyBwcm9wZXJ0aWVzIGFuZCBhbGxvdyBleGVjdXRpb25cbiAqIHdpdGggZWFjaCBrZXksIHZhbHVlIHBhaXIuIElmIHRoZSBzdXBwbGllZCBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgYSBnaXZlblxuICogZW50cnkgcmV0dXJucyBudWxsIGluc3RlYWQgb2YgYW4gb2JqZWN0IHdpdGggdGhlIGZvcm1hdCBge2tleTogdmFsdWV9YFxuICogdGhlbiB0aGF0IGVudHJ5IHdpbGwgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBmaW5hbCBvdXRwdXQuXG4gKlxuICogQG1ldGhvZCB3YWxrUmVzb2x2ZXJNYXBcbiAqXG4gKiBAcGFyYW0ge1Jlc29sdmVyTWFwfSBvYmplY3QgYW4gb2JqZWN0IGNvbmZvcm1pbmcgdG8gdHlwZSBgUmVzb2x2ZXJNYXBgXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHdyYXAgZGVmYXVsdHMgdG8gdHJ1ZS4gQW4gZW50cnkgd2hvc2UgdmFsdWUgaXMgbmVpdGhlciBhXG4gKiBmdW5jdGlvbiBub3IgYW4gb2JqZWN0IHdpbGwgYmUgd3JhcHBlZCBpbiBhIGZ1bmN0aW9uIHJldHVybmluZyB0aGUgdmFsdWUuIElmXG4gKiBmYWxzZSBpcyBzdXBwbGllZCBoZXJlLCBhIGBSZXNvbHZlck1hcFN0dW1ibGVgIGVycm9yIHdpbGwgYmUgdGhyb3duIGluc3RlYWRcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gcGF0aCBhcyBgd2Fsa1Jlc29sdmVyTWFwYCBjYWxscyBpdHNlbGYgcmVjdXJzaXZlbHksXG4gKiBwYXRoIGlzIGFwcGVuZGVkIHRvIGFuZCBhZGRlZCBhcyBhIHBhcmFtZXRlciB0byBkZXRlcm1pbmUgd2hlcmUgaW4gdGhlIHRyZWVcbiAqIHRoZSBjdXJyZW50IGV4ZWN1dGlvbiBpcyB3b3JraW5nXG4gKiBAcmV0dXJuIHtSZXNvbHZlck1hcH0gdXBvbiBzdWNjZXNzZnVsIGNvbXBsZXRpb24sIGEgYFJlc29sdmVyTWFwYCBvYmplY3QsXG4gKiBtb2RpZmllZCBhcyBzcGVjaWZpZWQsIHdpbGwgYmUgcmV0dXJuZWQgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhbGtSZXNvbHZlck1hcChcbiAgb2JqZWN0OiBSZXNvbHZlck1hcCxcbiAgaW5zcGVjdG9yOiBFbnRyeUluc3BlY3RvciA9IERlZmF1bHRFbnRyeUluc3BlY3RvcixcbiAgd3JhcDogYm9vbGVhbiA9IHRydWUsXG4gIHBhdGg6IEFycmF5PHN0cmluZz4gPSBbXVxuKTogUmVzb2x2ZXJNYXAge1xuICBsZXQgcHJvZHVjdCA9IHt9XG5cbiAgcGF0aC5yZWR1Y2UoKHByZXYsIGN1cikgPT4ge1xuICAgIGlmICghYXQocHJvZHVjdCwgcHJldi5jb25jYXQoY3VyKSkpIHtcbiAgICAgIGF0KHByb2R1Y3QsIHByZXYuY29uY2F0KGN1ciksIHt9KVxuICAgIH1cbiAgICBwcmV2LnB1c2goY3VyKVxuXG4gICAgcmV0dXJuIHByZXZcbiAgfSwgW10pXG5cbiAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBjb25zdCBpc09iamVjdDogYm9vbGVhbiA9IHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0XG4gICAgY29uc3QgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGlzT2JqZWN0ICYmIGlzRm4odmFsdWUpXG5cbiAgICBpZiAoaXNPYmplY3QgJiYgIWlzRnVuY3Rpb24pIHtcbiAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLmNvbmNhdChrZXkpXG4gICAgICBhdChcbiAgICAgICAgcHJvZHVjdCxcbiAgICAgICAgbmV3UGF0aCxcbiAgICAgICAgd2Fsa1Jlc29sdmVyTWFwKHZhbHVlLCBpbnNwZWN0b3IsIHdyYXAsIG5ld1BhdGgpXG4gICAgICApXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbikge1xuICAgICAgICAvLyBJbiB0aGUgY2FzZSB0aGF0IHdlIGhhdmUgYSBzdHJpbmcgbWFwcGluZyB0byBhIG5vbi1mdW5jdGlvbiBhbmQgYVxuICAgICAgICAvLyBub24tb2JqZWN0LCB3ZSBjYW4gZG8gb25lIG9mIHR3byB0aGluZ3MuIEVpdGhlciB3ZSBjYW4gdGhyb3cgYW4gZXJyb3JcbiAgICAgICAgLy8gb3IgYnkgZGVmYXVsdCB3ZSBzaW1wbHkgd3JhcCB0aGUgdmFsdWUgaW4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnNcbiAgICAgICAgLy8gdGhhdCB2YWx1ZVxuICAgICAgICBpZiAoIXdyYXApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmVzb2x2ZXJNYXBTdHVtYmxlKG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBJbnZhbGlkIFJlc29sdmVyTWFwIGVudHJ5IGF0ICR7cGF0aC5qb2luKCcuJyl9LiR7a2V5fTogdmFsdWUgaXMgYCArXG4gICAgICAgICAgICBgbmVpdGhlciBhbiBvYmplY3Qgbm9yIGEgZnVuY3Rpb25gXG4gICAgICAgICAgKSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9ICgpID0+IHZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGVudHJ5ID0gaW5zcGVjdG9yKGtleSwgdmFsdWUsIHBhdGgsIG9iamVjdClcblxuICAgICAgaWYgKGVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXQocHJvZHVjdCwgcGF0aC5jb25jYXQoa2V5KSwgZW50cnlba2V5XSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcHJvZHVjdFxufVxuXG4vKipcbiAqIEdpdmVuIGEgYFJlc29sdmVyTWFwYCBvYmplY3QsIHdhbGsgaXRzIHByb3BlcnRpZXMgYW5kIGFsbG93IGV4ZWN1dGlvblxuICogd2l0aCBlYWNoIGtleSwgdmFsdWUgcGFpci4gSWYgdGhlIHN1cHBsaWVkIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBhIGdpdmVuXG4gKiBlbnRyeSByZXR1cm5zIG51bGwgaW5zdGVhZCBvZiBhbiBvYmplY3Qgd2l0aCB0aGUgZm9ybWF0IGB7a2V5OiB2YWx1ZX1gXG4gKiB0aGVuIHRoYXQgZW50cnkgd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlIGZpbmFsIG91dHB1dC5cbiAqXG4gKiBAbWV0aG9kIGFzeW5jV2Fsa1Jlc29sdmVyTWFwXG4gKlxuICogQHBhcmFtIHtSZXNvbHZlck1hcH0gb2JqZWN0IGFuIG9iamVjdCBjb25mb3JtaW5nIHRvIHR5cGUgYFJlc29sdmVyTWFwYFxuICogQHBhcmFtIHtib29sZWFufSB3cmFwIGRlZmF1bHRzIHRvIHRydWUuIEFuIGVudHJ5IHdob3NlIHZhbHVlIGlzIG5laXRoZXIgYVxuICogZnVuY3Rpb24gbm9yIGFuIG9iamVjdCB3aWxsIGJlIHdyYXBwZWQgaW4gYSBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIHZhbHVlLiBJZlxuICogZmFsc2UgaXMgc3VwcGxpZWQgaGVyZSwgYSBgUmVzb2x2ZXJNYXBTdHVtYmxlYCBlcnJvciB3aWxsIGJlIHRocm93biBpbnN0ZWFkXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IHBhdGggYXMgYHdhbGtSZXNvbHZlck1hcGAgY2FsbHMgaXRzZWxmIHJlY3Vyc2l2ZWx5LFxuICAqIHBhdGggaXMgYXBwZW5kZWQgdG8gYW5kIGFkZGVkIGFzIGEgcGFyYW1ldGVyIHRvIGRldGVybWluZSB3aGVyZSBpbiB0aGUgdHJlZVxuICAqIHRoZSBjdXJyZW50IGV4ZWN1dGlvbiBpcyB3b3JraW5nXG4gKiBAcGFyYW0ge0FycmF5PGVycm9yPn0gc2tpcHMgaWYgc3VwcGxpZWQsIHRoaXMgYXJyYXkgd2lsbCBoYXZlIGFuIGFwcGVuZGVkXG4gKiBlcnJvciBmb3IgZWFjaCBzdWIgYXN5bmMgd2FsayBlcnJvciBjYXVnaHQuXG4gKiBAcmV0dXJuIHtSZXNvbHZlck1hcH0gdXBvbiBzdWNjZXNzZnVsIGNvbXBsZXRpb24sIGEgYFJlc29sdmVyTWFwYCBvYmplY3QsXG4gKiBtb2RpZmllZCBhcyBzcGVjaWZpZWQsIHdpbGwgYmUgcmV0dXJuZWQgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzeW5jV2Fsa1Jlc29sdmVyTWFwKFxuICBvYmplY3Q6IFJlc29sdmVyTWFwLFxuICBpbnNwZWN0b3I6IEFzeW5jRW50cnlJbnNwZWN0b3IgPSBEZWZhdWx0QXN5bmNFbnRyeUluc3BlY3RvcixcbiAgd3JhcDogYm9vbGVhbiA9IHRydWUsXG4gIHBhdGg6IEFycmF5PHN0cmluZz4gPSBbXSxcbiAgc2tpcHM6IEFycmF5PGVycm9yPlxuKTogUmVzb2x2ZXJNYXAge1xuICBsZXQgcHJvZHVjdCA9IHt9XG5cbiAgcGF0aC5yZWR1Y2UoKHByZXYsIGN1cikgPT4ge1xuICAgIGlmICghYXQocHJvZHVjdCwgcHJldi5jb25jYXQoY3VyKSkpIHtcbiAgICAgIGF0KHByb2R1Y3QsIHByZXYuY29uY2F0KGN1ciksIHt9KVxuICAgIH1cbiAgICBwcmV2LnB1c2goY3VyKVxuXG4gICAgcmV0dXJuIHByZXZcbiAgfSwgW10pXG5cbiAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBjb25zdCBpc09iamVjdDogYm9vbGVhbiA9IHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0XG4gICAgY29uc3QgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGlzT2JqZWN0ICYmIGlzRm4odmFsdWUpXG5cbiAgICBpZiAoaXNPYmplY3QgJiYgIWlzRnVuY3Rpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF0KFxuICAgICAgICAgIHByb2R1Y3QsXG4gICAgICAgICAgcGF0aC5jb25jYXQoa2V5KSxcbiAgICAgICAgICBhd2FpdCBhc3luY1dhbGtSZXNvbHZlck1hcCh2YWx1ZSwgaW5zcGVjdG9yLCB3cmFwLCBwYXRoLCBza2lwcylcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKHN0dW1ibGUpIHtcbiAgICAgICAgaWYgKHNraXBzICYmIEFycmF5LmlzQXJyYXkoc2tpcHMpKSB7XG4gICAgICAgICAgc2tpcHMucHVzaChuZXcgUmVzb2x2ZXJNYXBTdHVtYmxlKHN0dW1ibGUsIHtcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgc291cmNlOiBvYmplY3QsXG4gICAgICAgICAgICBkZXN0aW5hdGlvbjogcHJvZHVjdFxuICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbikge1xuICAgICAgICAvLyBJbiB0aGUgY2FzZSB0aGF0IHdlIGhhdmUgYSBzdHJpbmcgbWFwcGluZyB0byBhIG5vbi1mdW5jdGlvbiBhbmQgYVxuICAgICAgICAvLyBub24tb2JqZWN0LCB3ZSBjYW4gZG8gb25lIG9mIHR3byB0aGluZ3MuIEVpdGhlciB3ZSBjYW4gdGhyb3cgYW4gZXJyb3JcbiAgICAgICAgLy8gb3IgYnkgZGVmYXVsdCB3ZSBzaW1wbHkgd3JhcCB0aGUgdmFsdWUgaW4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnNcbiAgICAgICAgLy8gdGhhdCB2YWx1ZVxuICAgICAgICBpZiAoIXdyYXApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmVzb2x2ZXJNYXBTdHVtYmxlKG5ldyBFcnJvcignSW52YWxpZCBSZXNvbHZlck1hcCcpKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gKCkgPT4gdmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZW50cnkgPSBhd2FpdCBpbnNwZWN0b3Ioa2V5LCB2YWx1ZSwgcGF0aCwgb2JqZWN0KVxuXG4gICAgICBpZiAoZW50cnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdChwcm9kdWN0LCBwYXRoLmNvbmNhdChrZXkpLCBlbnRyeVtrZXldKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwcm9kdWN0XG59XG5cbi8qKlxuICogVHlwZSBkZWZpbml0aW9uIGZvciBhIHByb3BlcnR5IHdpdGhpbiBhIFJlc29sdmVyTWFwLiBJdCBlbmNhcHN1bGF0ZXMgdGhlXG4gKiBwcm9wZXJ0eSdzIG5hbWUsIHZhbHVlLCB0aGUgcGF0aCB0byByZWFjaCBpdCB3aXRoaW4gdGhlIG9iamVjdCwgYW5kIHRoZVxuICogb2JqZWN0IGl0c2VsZi5cbiAqXG4gKiBAZmxvd1xuICogQHR5cGUge1Jlc29sdmVyUHJvcGVydHl9XG4gKi9cbmV4cG9ydCB0eXBlIFJlc29sdmVyUHJvcGVydHkgPSB7XG4gIG5hbWU6IHN0cmluZyxcbiAgdmFsdWU6IHVua25vd24sXG4gIHBhdGg6IEFycmF5PHN0cmluZz4sXG4gIG9iamVjdDogT2JqZWN0XG59XG5cbi8qKlxuICogTWVyZ2VzIHR3byByZXNvbHZlciBvYmplY3RzIHJlY3Vyc2l2ZWx5LiBJbiBjYXNlIG9mIGNvbmZsaWN0aW5nIGtleXMsIHRoZVxuICogcHJvdmlkZWQgYGNvbmZsaWN0UmVzb2x2ZXJgIGZ1bmN0aW9uIGlzIGNhbGxlZCB0byBkZXRlcm1pbmUgdGhlXG4gKiByZXN1bHRpbmcgdmFsdWUuXG4gKlxuICogQGZsb3dcbiAqIEBwYXJhbSB7T2JqZWN0fSBleGlzdGluZ1Jlc29sdmVycyAtIFRoZSBvcmlnaW5hbCBzZXQgb2YgcmVzb2x2ZXJzLlxuICogQHBhcmFtIHtPYmplY3R9IG5ld1Jlc29sdmVycyAtIFRoZSBzZXQgb2YgbmV3IHJlc29sdmVycyB0byBiZSBtZXJnZWQgaW50b1xuICogdGhlIGV4aXN0aW5nIG9uZXMuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb25mbGljdFJlc29sdmVyIC0gQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIGNvbmZsaWN0c1xuICogYmV0d2VlbiBleGlzdGluZyBhbmQgbmV3IHJlc29sdmVyIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbWVyZ2VkIHNldCBvZiByZXNvbHZlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVJlc29sdmVycyhcbiAgZXhpc3RpbmdSZXNvbHZlcnM6IE9iamVjdCxcbiAgbmV3UmVzb2x2ZXJzOiBPYmplY3QsXG4gIGNvbmZsaWN0UmVzb2x2ZXI6IChcbiAgICBleGlzdGluZzogUmVzb2x2ZXJQcm9wZXJ0eSxcbiAgICBjb25mbGljdDogUmVzb2x2ZXJQcm9wZXJ0eVxuICApID0+IG1peGVkID0gKGUsYykgPT4gYy52YWx1ZVxuKSB7XG4gIC8vIFJlY3Vyc2l2ZSBmdW5jdGlvbiB0byB3YWxrIGFuZCBtZXJnZSB0aGUgcmVzb2x2ZXIgbWFwc1xuICBjb25zdCB3YWxrQW5kTWVyZ2UgPSAoY3VycmVudCwgaW5jb21pbmcsIHBhdGggPSBbXSkgPT4ge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGluY29taW5nKSkge1xuICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGguY29uY2F0KGtleSk7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBrZXkgZXhpc3RzIGluIHRoZSBjdXJyZW50IG9iamVjdFxuICAgICAgaWYgKFJlZmxlY3QuaGFzKGN1cnJlbnQsIGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZSA9IGN1cnJlbnRba2V5XTtcbiAgICAgICAgY29uc3QgaW5jb21pbmdWYWx1ZSA9IGluY29taW5nW2tleV07XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nVmFsdWUgJiYgdHlwZW9mIGV4aXN0aW5nVmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGV4aXN0aW5nVmFsdWUpICYmICFpc0ZuKGV4aXN0aW5nVmFsdWUpKSB7XG4gICAgICAgICAgLy8gSWYgYm90aCBhcmUgb2JqZWN0cywgd2UgbmVlZCB0byBnbyBkZWVwZXJcbiAgICAgICAgICB3YWxrQW5kTWVyZ2UoZXhpc3RpbmdWYWx1ZSwgaW5jb21pbmdWYWx1ZSwgbmV3UGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ29uZmxpY3QgZGV0ZWN0ZWQsIGNhbGwgdGhlIHVzZXItc3VwcGxpZWQgY29uZmxpY3QgcmVzb2x1dGlvbiBmdW5jdGlvblxuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUHJvcDogUmVzb2x2ZXJQcm9wZXJ0eSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGtleSwgdmFsdWU6IGV4aXN0aW5nVmFsdWUsIHBhdGgsIG9iamVjdDogZXhpc3RpbmdSZXNvbHZlcnNcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaW5jb21pbmdQcm9wOiBSZXNvbHZlclByb3BlcnR5ID0ge1xuICAgICAgICAgICAgbmFtZToga2V5LCB2YWx1ZTogaW5jb21pbmdWYWx1ZSwgcGF0aCwgb2JqZWN0OiBuZXdSZXNvbHZlcnNcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFtrZXldID0gY29uZmxpY3RSZXNvbHZlcihleGlzdGluZ1Byb3AsIGluY29taW5nUHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIGNvbmZsaWN0LCBqdXN0IHNldCB0aGUgdmFsdWUgZnJvbSB0aGUgaW5jb21pbmcgb2JqZWN0XG4gICAgICAgIGN1cnJlbnRba2V5XSA9IGluY29taW5nW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRcbiAgfVxuXG4gIHJldHVybiB3YWxrQW5kTWVyZ2UoZXhpc3RpbmdSZXNvbHZlcnMsIG5ld1Jlc29sdmVycywg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
//# sourceMappingURL=walkResolverMap.js.map