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
 * @type {EntryInspector}
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
 * @type {AsyncEntryInspector}
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
 * @param {EntryInspector} [inspector=DefaultEntryInspector] the inspector that
 * is used to walk the file
 * @param {boolean} [wrap=true] defaults to true. An entry whose value is
 * neither a function nor an object will be wrapped in a function returning
 * the value. If false is supplied here, a `ResolverMapStumble` error will
 * be thrown instead
 * @param {string[]} path as `walkResolverMap` calls itself recursively,
 * path is appended to and added as a parameter to determine where in the tree
 * the current execution is working
 * @return {ResolverMap} upon successful completion, a `ResolverMap` object,
 * modified as specified, will be returned instead.
 */
exports.DefaultAsyncEntryInspector = DefaultAsyncEntryInspector;
function walkResolverMap(object, inspector, wrap, path) {
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
 * @param {AsyncEntryInspector} [inspector=DefaultAsyncEntryInspector] the
 * inspector callback
 * @param {boolean} wrap defaults to true. An entry whose value is neither a
 * function nor an object will be wrapped in a function returning the value. If
 * false is supplied here, a `ResolverMapStumble` error will be thrown instead
 * @param {string[]} path as `walkResolverMap` calls itself recursively,
  * path is appended to and added as a parameter to determine where in the tree
  * the current execution is working
 * @param {Error[]} skips if supplied, this array will have an appended
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
 * @typedef {{
 *   name: string,
 *   value: unknown,
 *   path: Array<string>,
 *   object: Object
 * }} ResolverProperty
 */

/**
 * Merges two resolver objects recursively. In case of conflicting keys, the
 * provided `conflictResolver` function is called to determine the
 * resulting value.
 *
 * @param {Object} existingResolvers - The original set of resolvers.
 * @param {Object} newResolvers - The set of new resolvers to be merged into
 * the existing ones.
 * @param {Function} conflictResolver - A function that resolves conflicts
 * between existing and new resolver properties.
 * @returns {Object} The merged set of resolvers.
 */
function mergeResolvers(existingResolvers, newResolvers, conflictResolver) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXJyb3JzIiwicmVxdWlyZSIsIl90eXBld29yayIsIl9wcm9wQXQiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiRGVmYXVsdEVudHJ5SW5zcGVjdG9yIiwia2V5IiwidmFsdWUiLCJwYXRoIiwibWFwIiwiZXhwb3J0cyIsIkRlZmF1bHRBc3luY0VudHJ5SW5zcGVjdG9yIiwid2Fsa1Jlc29sdmVyTWFwIiwib2JqZWN0IiwiaW5zcGVjdG9yIiwid3JhcCIsInByb2R1Y3QiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyIiwiYXQiLCJjb25jYXQiLCJwdXNoIiwiT2JqZWN0IiwiZW50cmllcyIsImlzT2JqZWN0IiwiaXNGdW5jdGlvbiIsImlzRm4iLCJuZXdQYXRoIiwiUmVzb2x2ZXJNYXBTdHVtYmxlIiwiRXJyb3IiLCJqb2luIiwiZW50cnkiLCJ1bmRlZmluZWQiLCJhc3luY1dhbGtSZXNvbHZlck1hcCIsInNraXBzIiwic3R1bWJsZSIsIkFycmF5IiwiaXNBcnJheSIsInNvdXJjZSIsImRlc3RpbmF0aW9uIiwibWVyZ2VSZXNvbHZlcnMiLCJleGlzdGluZ1Jlc29sdmVycyIsIm5ld1Jlc29sdmVycyIsImNvbmZsaWN0UmVzb2x2ZXIiLCJ3YWxrQW5kTWVyZ2UiLCJjdXJyZW50IiwiaW5jb21pbmciLCJrZXlzIiwiUmVmbGVjdCIsImhhcyIsImV4aXN0aW5nVmFsdWUiLCJpbmNvbWluZ1ZhbHVlIiwiZXhpc3RpbmdQcm9wIiwibmFtZSIsImluY29taW5nUHJvcCIsIl9kZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vc3JjL3dhbGtSZXNvbHZlck1hcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IHR5cGUgeyBSZXNvbHZlck1hcCwgRW50cnlJbnNwZWN0b3IsIEFzeW5jRW50cnlJbnNwZWN0b3IgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgUmVzb2x2ZXJNYXBTdHVtYmxlIH0gZnJvbSAnLi9lcnJvcnMnXG5pbXBvcnQgeyBpc0ZuLCBnZXRUeXBlIH0gZnJvbSAnLi91dGlscy90eXBld29yaydcbmltcG9ydCBhdCBmcm9tICcuL3Byb3BBdCdcblxuLyoqXG4gKiBBIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIEVudHJ5SW5zcGVjdG9yIHR5cGUgZm9yIHVzZSBhcyBhIGRlZmF1bHRcbiAqIHRvIGB3YWxrUmVzb2x2ZXJNYXBgLiBXaGlsZSBub3QgaW1tZWRpYXRlbHkgdXNlZnVsLCBhIGRlZmF1bHQgaW1wbGVtZW50YXRpb25cbiAqIGNhdXNlcyBgd2Fsa1Jlc29sdmVyTWFwYCB0byB3cmFwIGFueSBub24tZnVuY3Rpb24gYW5kIG5vbi1vYmplY3QgdmFsdWVzXG4gKiB3aXRoIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBub24tY29tcGxpYW50IHZhbHVlIGFuZCB0aGVyZWZvcmUgaGFzIHNvbWVcbiAqIGludHJpbnNpYyB2YWx1ZS5cbiAqXG4gKiBAbWV0aG9kIERlZmF1bHRFbnRyeUluc3BlY3RvclxuICogQHR5cGUge0VudHJ5SW5zcGVjdG9yfVxuICovXG5leHBvcnQgY29uc3QgRGVmYXVsdEVudHJ5SW5zcGVjdG9yID0gKGtleSwgdmFsdWUsIHBhdGgsIG1hcCkgPT4ge1xuICByZXR1cm4geyBba2V5XTogdmFsdWUgfVxufVxuXG4vKipcbiAqIEEgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgRW50cnlJbnNwZWN0b3IgdHlwZSBmb3IgdXNlIGFzIGEgZGVmYXVsdFxuICogdG8gYGFzeW5jV2Fsa1Jlc29sdmVyTWFwYC4gV2hpbGUgbm90IGltbWVkaWF0ZWx5IHVzZWZ1bCwgYSBkZWZhdWx0XG4gKiBpbXBsZW1lbnRhdGlvbiBjYXVzZXMgYGFzeW5jV2Fsa1Jlc29sdmVyTWFwYCB0byB3cmFwIGFueSBub24tZnVuY3Rpb24gYW5kXG4gKiBub24tb2JqZWN0IHZhbHVlcyB3aXRoIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBub24tY29tcGxpYW50IHZhbHVlIGFuZFxuICogdGhlcmVmb3JlIGhhcyBzb21lIGludHJpbnNpYyB2YWx1ZS5cbiAqXG4gKiBAbWV0aG9kIERlZmF1bHRFbnRyeUluc3BlY3RvclxuICogQHR5cGUge0FzeW5jRW50cnlJbnNwZWN0b3J9XG4gKi9cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXN5bmNFbnRyeUluc3BlY3RvciA9IGFzeW5jIChrZXksIHZhbHVlLCBwYXRoLCBtYXApID0+IHtcbiAgcmV0dXJuIHsgW2tleV06IHZhbHVlIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGBSZXNvbHZlck1hcGAgb2JqZWN0LCB3YWxrIGl0cyBwcm9wZXJ0aWVzIGFuZCBhbGxvdyBleGVjdXRpb25cbiAqIHdpdGggZWFjaCBrZXksIHZhbHVlIHBhaXIuIElmIHRoZSBzdXBwbGllZCBmdW5jdGlvbiBmb3IgaGFuZGxpbmcgYSBnaXZlblxuICogZW50cnkgcmV0dXJucyBudWxsIGluc3RlYWQgb2YgYW4gb2JqZWN0IHdpdGggdGhlIGZvcm1hdCBge2tleTogdmFsdWV9YFxuICogdGhlbiB0aGF0IGVudHJ5IHdpbGwgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBmaW5hbCBvdXRwdXQuXG4gKlxuICogQG1ldGhvZCB3YWxrUmVzb2x2ZXJNYXBcbiAqXG4gKiBAcGFyYW0ge1Jlc29sdmVyTWFwfSBvYmplY3QgYW4gb2JqZWN0IGNvbmZvcm1pbmcgdG8gdHlwZSBgUmVzb2x2ZXJNYXBgXG4gKiBAcGFyYW0ge0VudHJ5SW5zcGVjdG9yfSBbaW5zcGVjdG9yPURlZmF1bHRFbnRyeUluc3BlY3Rvcl0gdGhlIGluc3BlY3RvciB0aGF0XG4gKiBpcyB1c2VkIHRvIHdhbGsgdGhlIGZpbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3dyYXA9dHJ1ZV0gZGVmYXVsdHMgdG8gdHJ1ZS4gQW4gZW50cnkgd2hvc2UgdmFsdWUgaXNcbiAqIG5laXRoZXIgYSBmdW5jdGlvbiBub3IgYW4gb2JqZWN0IHdpbGwgYmUgd3JhcHBlZCBpbiBhIGZ1bmN0aW9uIHJldHVybmluZ1xuICogdGhlIHZhbHVlLiBJZiBmYWxzZSBpcyBzdXBwbGllZCBoZXJlLCBhIGBSZXNvbHZlck1hcFN0dW1ibGVgIGVycm9yIHdpbGxcbiAqIGJlIHRocm93biBpbnN0ZWFkXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRoIGFzIGB3YWxrUmVzb2x2ZXJNYXBgIGNhbGxzIGl0c2VsZiByZWN1cnNpdmVseSxcbiAqIHBhdGggaXMgYXBwZW5kZWQgdG8gYW5kIGFkZGVkIGFzIGEgcGFyYW1ldGVyIHRvIGRldGVybWluZSB3aGVyZSBpbiB0aGUgdHJlZVxuICogdGhlIGN1cnJlbnQgZXhlY3V0aW9uIGlzIHdvcmtpbmdcbiAqIEByZXR1cm4ge1Jlc29sdmVyTWFwfSB1cG9uIHN1Y2Nlc3NmdWwgY29tcGxldGlvbiwgYSBgUmVzb2x2ZXJNYXBgIG9iamVjdCxcbiAqIG1vZGlmaWVkIGFzIHNwZWNpZmllZCwgd2lsbCBiZSByZXR1cm5lZCBpbnN0ZWFkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2Fsa1Jlc29sdmVyTWFwKG9iamVjdCwgaW5zcGVjdG9yLCB3cmFwLCBwYXRoKTogUmVzb2x2ZXJNYXAge1xuICBsZXQgcHJvZHVjdCA9IHt9XG5cbiAgcGF0aC5yZWR1Y2UoKHByZXYsIGN1cikgPT4ge1xuICAgIGlmICghYXQocHJvZHVjdCwgcHJldi5jb25jYXQoY3VyKSkpIHtcbiAgICAgIGF0KHByb2R1Y3QsIHByZXYuY29uY2F0KGN1ciksIHt9KVxuICAgIH1cbiAgICBwcmV2LnB1c2goY3VyKVxuXG4gICAgcmV0dXJuIHByZXZcbiAgfSwgW10pXG5cbiAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBjb25zdCBpc09iamVjdDogYm9vbGVhbiA9IHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0XG4gICAgY29uc3QgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGlzT2JqZWN0ICYmIGlzRm4odmFsdWUpXG5cbiAgICBpZiAoaXNPYmplY3QgJiYgIWlzRnVuY3Rpb24pIHtcbiAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLmNvbmNhdChrZXkpXG4gICAgICBhdChcbiAgICAgICAgcHJvZHVjdCxcbiAgICAgICAgbmV3UGF0aCxcbiAgICAgICAgd2Fsa1Jlc29sdmVyTWFwKHZhbHVlLCBpbnNwZWN0b3IsIHdyYXAsIG5ld1BhdGgpXG4gICAgICApXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbikge1xuICAgICAgICAvLyBJbiB0aGUgY2FzZSB0aGF0IHdlIGhhdmUgYSBzdHJpbmcgbWFwcGluZyB0byBhIG5vbi1mdW5jdGlvbiBhbmQgYVxuICAgICAgICAvLyBub24tb2JqZWN0LCB3ZSBjYW4gZG8gb25lIG9mIHR3byB0aGluZ3MuIEVpdGhlciB3ZSBjYW4gdGhyb3cgYW4gZXJyb3JcbiAgICAgICAgLy8gb3IgYnkgZGVmYXVsdCB3ZSBzaW1wbHkgd3JhcCB0aGUgdmFsdWUgaW4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnNcbiAgICAgICAgLy8gdGhhdCB2YWx1ZVxuICAgICAgICBpZiAoIXdyYXApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmVzb2x2ZXJNYXBTdHVtYmxlKG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBJbnZhbGlkIFJlc29sdmVyTWFwIGVudHJ5IGF0ICR7cGF0aC5qb2luKCcuJyl9LiR7a2V5fTogdmFsdWUgaXMgYCArXG4gICAgICAgICAgICBgbmVpdGhlciBhbiBvYmplY3Qgbm9yIGEgZnVuY3Rpb25gXG4gICAgICAgICAgKSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9ICgpID0+IHZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGVudHJ5ID0gaW5zcGVjdG9yKGtleSwgdmFsdWUsIHBhdGgsIG9iamVjdClcblxuICAgICAgaWYgKGVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXQocHJvZHVjdCwgcGF0aC5jb25jYXQoa2V5KSwgZW50cnlba2V5XSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcHJvZHVjdFxufVxuXG4vKipcbiAqIEdpdmVuIGEgYFJlc29sdmVyTWFwYCBvYmplY3QsIHdhbGsgaXRzIHByb3BlcnRpZXMgYW5kIGFsbG93IGV4ZWN1dGlvblxuICogd2l0aCBlYWNoIGtleSwgdmFsdWUgcGFpci4gSWYgdGhlIHN1cHBsaWVkIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBhIGdpdmVuXG4gKiBlbnRyeSByZXR1cm5zIG51bGwgaW5zdGVhZCBvZiBhbiBvYmplY3Qgd2l0aCB0aGUgZm9ybWF0IGB7a2V5OiB2YWx1ZX1gXG4gKiB0aGVuIHRoYXQgZW50cnkgd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlIGZpbmFsIG91dHB1dC5cbiAqXG4gKiBAbWV0aG9kIGFzeW5jV2Fsa1Jlc29sdmVyTWFwXG4gKlxuICogQHBhcmFtIHtSZXNvbHZlck1hcH0gb2JqZWN0IGFuIG9iamVjdCBjb25mb3JtaW5nIHRvIHR5cGUgYFJlc29sdmVyTWFwYFxuICogQHBhcmFtIHtBc3luY0VudHJ5SW5zcGVjdG9yfSBbaW5zcGVjdG9yPURlZmF1bHRBc3luY0VudHJ5SW5zcGVjdG9yXSB0aGVcbiAqIGluc3BlY3RvciBjYWxsYmFja1xuICogQHBhcmFtIHtib29sZWFufSB3cmFwIGRlZmF1bHRzIHRvIHRydWUuIEFuIGVudHJ5IHdob3NlIHZhbHVlIGlzIG5laXRoZXIgYVxuICogZnVuY3Rpb24gbm9yIGFuIG9iamVjdCB3aWxsIGJlIHdyYXBwZWQgaW4gYSBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIHZhbHVlLiBJZlxuICogZmFsc2UgaXMgc3VwcGxpZWQgaGVyZSwgYSBgUmVzb2x2ZXJNYXBTdHVtYmxlYCBlcnJvciB3aWxsIGJlIHRocm93biBpbnN0ZWFkXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRoIGFzIGB3YWxrUmVzb2x2ZXJNYXBgIGNhbGxzIGl0c2VsZiByZWN1cnNpdmVseSxcbiAgKiBwYXRoIGlzIGFwcGVuZGVkIHRvIGFuZCBhZGRlZCBhcyBhIHBhcmFtZXRlciB0byBkZXRlcm1pbmUgd2hlcmUgaW4gdGhlIHRyZWVcbiAgKiB0aGUgY3VycmVudCBleGVjdXRpb24gaXMgd29ya2luZ1xuICogQHBhcmFtIHtFcnJvcltdfSBza2lwcyBpZiBzdXBwbGllZCwgdGhpcyBhcnJheSB3aWxsIGhhdmUgYW4gYXBwZW5kZWRcbiAqIGVycm9yIGZvciBlYWNoIHN1YiBhc3luYyB3YWxrIGVycm9yIGNhdWdodC5cbiAqIEByZXR1cm4ge1Jlc29sdmVyTWFwfSB1cG9uIHN1Y2Nlc3NmdWwgY29tcGxldGlvbiwgYSBgUmVzb2x2ZXJNYXBgIG9iamVjdCxcbiAqIG1vZGlmaWVkIGFzIHNwZWNpZmllZCwgd2lsbCBiZSByZXR1cm5lZCBpbnN0ZWFkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXN5bmNXYWxrUmVzb2x2ZXJNYXAoXG4gIG9iamVjdCxcbiAgaW5zcGVjdG9yID0gRGVmYXVsdEFzeW5jRW50cnlJbnNwZWN0b3IsXG4gIHdyYXAgPSB0cnVlLFxuICBwYXRoID0gW10sXG4gIHNraXBzXG4pIHtcbiAgbGV0IHByb2R1Y3QgPSB7fVxuXG4gIHBhdGgucmVkdWNlKChwcmV2LCBjdXIpID0+IHtcbiAgICBpZiAoIWF0KHByb2R1Y3QsIHByZXYuY29uY2F0KGN1cikpKSB7XG4gICAgICBhdChwcm9kdWN0LCBwcmV2LmNvbmNhdChjdXIpLCB7fSlcbiAgICB9XG4gICAgcHJldi5wdXNoKGN1cilcblxuICAgIHJldHVybiBwcmV2XG4gIH0sIFtdKVxuXG4gIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XG4gICAgY29uc3QgaXNPYmplY3Q6IGJvb2xlYW4gPSB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdFxuICAgIGNvbnN0IGlzRnVuY3Rpb246IGJvb2xlYW4gPSBpc09iamVjdCAmJiBpc0ZuKHZhbHVlKVxuXG4gICAgaWYgKGlzT2JqZWN0ICYmICFpc0Z1bmN0aW9uKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhdChcbiAgICAgICAgICBwcm9kdWN0LFxuICAgICAgICAgIHBhdGguY29uY2F0KGtleSksXG4gICAgICAgICAgYXdhaXQgYXN5bmNXYWxrUmVzb2x2ZXJNYXAodmFsdWUsIGluc3BlY3Rvciwgd3JhcCwgcGF0aCwgc2tpcHMpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGNhdGNoIChzdHVtYmxlKSB7XG4gICAgICAgIGlmIChza2lwcyAmJiBBcnJheS5pc0FycmF5KHNraXBzKSkge1xuICAgICAgICAgIHNraXBzLnB1c2gobmV3IFJlc29sdmVyTWFwU3R1bWJsZShzdHVtYmxlLCB7XG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHNvdXJjZTogb2JqZWN0LFxuICAgICAgICAgICAgZGVzdGluYXRpb246IHByb2R1Y3RcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICghaXNPYmplY3QgJiYgIWlzRnVuY3Rpb24pIHtcbiAgICAgICAgLy8gSW4gdGhlIGNhc2UgdGhhdCB3ZSBoYXZlIGEgc3RyaW5nIG1hcHBpbmcgdG8gYSBub24tZnVuY3Rpb24gYW5kIGFcbiAgICAgICAgLy8gbm9uLW9iamVjdCwgd2UgY2FuIGRvIG9uZSBvZiB0d28gdGhpbmdzLiBFaXRoZXIgd2UgY2FuIHRocm93IGFuIGVycm9yXG4gICAgICAgIC8vIG9yIGJ5IGRlZmF1bHQgd2Ugc2ltcGx5IHdyYXAgdGhlIHZhbHVlIGluIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zXG4gICAgICAgIC8vIHRoYXQgdmFsdWVcbiAgICAgICAgaWYgKCF3cmFwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJlc29sdmVyTWFwU3R1bWJsZShuZXcgRXJyb3IoJ0ludmFsaWQgUmVzb2x2ZXJNYXAnKSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9ICgpID0+IHZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGVudHJ5ID0gYXdhaXQgaW5zcGVjdG9yKGtleSwgdmFsdWUsIHBhdGgsIG9iamVjdClcblxuICAgICAgaWYgKGVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXQocHJvZHVjdCwgcGF0aC5jb25jYXQoa2V5KSwgZW50cnlba2V5XSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcHJvZHVjdFxufVxuXG4vKipcbiAqIFR5cGUgZGVmaW5pdGlvbiBmb3IgYSBwcm9wZXJ0eSB3aXRoaW4gYSBSZXNvbHZlck1hcC4gSXQgZW5jYXBzdWxhdGVzIHRoZVxuICogcHJvcGVydHkncyBuYW1lLCB2YWx1ZSwgdGhlIHBhdGggdG8gcmVhY2ggaXQgd2l0aGluIHRoZSBvYmplY3QsIGFuZCB0aGVcbiAqIG9iamVjdCBpdHNlbGYuXG4gKlxuICogQHR5cGVkZWYge3tcbiAqICAgbmFtZTogc3RyaW5nLFxuICogICB2YWx1ZTogdW5rbm93bixcbiAqICAgcGF0aDogQXJyYXk8c3RyaW5nPixcbiAqICAgb2JqZWN0OiBPYmplY3RcbiAqIH19IFJlc29sdmVyUHJvcGVydHlcbiAqL1xuXG4vKipcbiAqIE1lcmdlcyB0d28gcmVzb2x2ZXIgb2JqZWN0cyByZWN1cnNpdmVseS4gSW4gY2FzZSBvZiBjb25mbGljdGluZyBrZXlzLCB0aGVcbiAqIHByb3ZpZGVkIGBjb25mbGljdFJlc29sdmVyYCBmdW5jdGlvbiBpcyBjYWxsZWQgdG8gZGV0ZXJtaW5lIHRoZVxuICogcmVzdWx0aW5nIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBleGlzdGluZ1Jlc29sdmVycyAtIFRoZSBvcmlnaW5hbCBzZXQgb2YgcmVzb2x2ZXJzLlxuICogQHBhcmFtIHtPYmplY3R9IG5ld1Jlc29sdmVycyAtIFRoZSBzZXQgb2YgbmV3IHJlc29sdmVycyB0byBiZSBtZXJnZWQgaW50b1xuICogdGhlIGV4aXN0aW5nIG9uZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25mbGljdFJlc29sdmVyIC0gQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIGNvbmZsaWN0c1xuICogYmV0d2VlbiBleGlzdGluZyBhbmQgbmV3IHJlc29sdmVyIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbWVyZ2VkIHNldCBvZiByZXNvbHZlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVJlc29sdmVycyhleGlzdGluZ1Jlc29sdmVycywgbmV3UmVzb2x2ZXJzLCBjb25mbGljdFJlc29sdmVyKSB7XG4gIC8vIFJlY3Vyc2l2ZSBmdW5jdGlvbiB0byB3YWxrIGFuZCBtZXJnZSB0aGUgcmVzb2x2ZXIgbWFwc1xuICBjb25zdCB3YWxrQW5kTWVyZ2UgPSAoY3VycmVudCwgaW5jb21pbmcsIHBhdGggPSBbXSkgPT4ge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGluY29taW5nKSkge1xuICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGguY29uY2F0KGtleSk7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBrZXkgZXhpc3RzIGluIHRoZSBjdXJyZW50IG9iamVjdFxuICAgICAgaWYgKFJlZmxlY3QuaGFzKGN1cnJlbnQsIGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZSA9IGN1cnJlbnRba2V5XTtcbiAgICAgICAgY29uc3QgaW5jb21pbmdWYWx1ZSA9IGluY29taW5nW2tleV07XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nVmFsdWUgJiYgdHlwZW9mIGV4aXN0aW5nVmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGV4aXN0aW5nVmFsdWUpICYmICFpc0ZuKGV4aXN0aW5nVmFsdWUpKSB7XG4gICAgICAgICAgLy8gSWYgYm90aCBhcmUgb2JqZWN0cywgd2UgbmVlZCB0byBnbyBkZWVwZXJcbiAgICAgICAgICB3YWxrQW5kTWVyZ2UoZXhpc3RpbmdWYWx1ZSwgaW5jb21pbmdWYWx1ZSwgbmV3UGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ29uZmxpY3QgZGV0ZWN0ZWQsIGNhbGwgdGhlIHVzZXItc3VwcGxpZWQgY29uZmxpY3QgcmVzb2x1dGlvbiBmdW5jdGlvblxuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUHJvcDogUmVzb2x2ZXJQcm9wZXJ0eSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGtleSwgdmFsdWU6IGV4aXN0aW5nVmFsdWUsIHBhdGgsIG9iamVjdDogZXhpc3RpbmdSZXNvbHZlcnNcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaW5jb21pbmdQcm9wOiBSZXNvbHZlclByb3BlcnR5ID0ge1xuICAgICAgICAgICAgbmFtZToga2V5LCB2YWx1ZTogaW5jb21pbmdWYWx1ZSwgcGF0aCwgb2JqZWN0OiBuZXdSZXNvbHZlcnNcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFtrZXldID0gY29uZmxpY3RSZXNvbHZlcihleGlzdGluZ1Byb3AsIGluY29taW5nUHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIGNvbmZsaWN0LCBqdXN0IHNldCB0aGUgdmFsdWUgZnJvbSB0aGUgaW5jb21pbmcgb2JqZWN0XG4gICAgICAgIGN1cnJlbnRba2V5XSA9IGluY29taW5nW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRcbiAgfVxuXG4gIHJldHVybiB3YWxrQW5kTWVyZ2UoZXhpc3RpbmdSZXNvbHZlcnMsIG5ld1Jlc29sdmVycywgW10pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHdhbGtSZXNvbHZlck1hcFxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBR0EsSUFBQUEsT0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsT0FBQSxHQUFBQyxzQkFBQSxDQUFBSCxPQUFBO0FBQXlCLFNBQUFHLHVCQUFBQyxDQUFBLFdBQUFBLENBQUEsSUFBQUEs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
//# sourceMappingURL=walkResolverMap.js.map