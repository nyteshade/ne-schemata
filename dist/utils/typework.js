"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFn = exports.getType = void 0;
exports.protoChain = protoChain;
// @ts-check

// Internal shorthand for the magic toString() function
const _toString = Object.prototype.toString;

/**
 * Leverages JavaScript's internal type system which can be accessed by
 * either using `call` or `apply` on the `Object.prototype.toString`
 * function.
 *
 * @param {mixed} obj - any object or value
 *
 * @return {string} the name of the class or function used for the type
 * of object internally. Note that while null and undefined have actual
 * types internally there is no accessible `Null` or `Undefined` class
 */
const getType = obj => /t (\w+)/.exec(_toString.call(obj))?.[1];

/**
 * Fetches the internal type of the object in question and then returns
 * true if that is literally equivalent to `Function.name`
 *
 * @param {mixed} obj - any object or value
 *
 * @returns {boolean}  - true if the internal type of the object matches
 * `Function.name`
 */
exports.getType = getType;
const isFn = obj => Function.name === getType(obj);

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
exports.isFn = isFn;
function protoChain(object) {
  if (object === null || object === undefined) {
    return [getType(object)];
  }
  let chain = [Object.getPrototypeOf(object)];
  let current = chain[0];
  while (current != null) {
    current = Object.getPrototypeOf(current);
    chain.push(current);
  }
  const results = chain.map(c => c?.constructor?.name || c).filter(c => !!c);
  Object.defineProperties(results, {
    isa: {
      value: function isa(type) {
        let derived = getType(type);
        switch (derived) {
          case [Function.name]:
            derived = type.name;
            break;
          default:
            break;
        }
        return this.includes(derived) || type?.name && this.includes(type.name);
      }
    },
    actual: {
      get: function () {
        let evalOrBust = o => {
          try {
            return eval(o);
          } catch {
            return o;
          }
        };
        let revert = o => {
          switch (o) {
            case 'Null':
              return null;
            case 'Undefined':
              return undefined;
            default:
              return o;
          }
        };
        return this.map(revert).map(evalOrBust);
      }
    }
  });
  return results;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfdG9TdHJpbmciLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImdldFR5cGUiLCJvYmoiLCJleGVjIiwiY2FsbCIsImV4cG9ydHMiLCJpc0ZuIiwiRnVuY3Rpb24iLCJuYW1lIiwicHJvdG9DaGFpbiIsIm9iamVjdCIsInVuZGVmaW5lZCIsImNoYWluIiwiZ2V0UHJvdG90eXBlT2YiLCJjdXJyZW50IiwicHVzaCIsInJlc3VsdHMiLCJtYXAiLCJjIiwiY29uc3RydWN0b3IiLCJmaWx0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiaXNhIiwidmFsdWUiLCJ0eXBlIiwiZGVyaXZlZCIsImluY2x1ZGVzIiwiYWN0dWFsIiwiZ2V0IiwiZXZhbE9yQnVzdCIsIm8iLCJldmFsIiwicmV2ZXJ0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3R5cGV3b3JrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1jaGVja1xuXG4vLyBJbnRlcm5hbCBzaG9ydGhhbmQgZm9yIHRoZSBtYWdpYyB0b1N0cmluZygpIGZ1bmN0aW9uXG5jb25zdCBfdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbi8qKlxuICogTGV2ZXJhZ2VzIEphdmFTY3JpcHQncyBpbnRlcm5hbCB0eXBlIHN5c3RlbSB3aGljaCBjYW4gYmUgYWNjZXNzZWQgYnlcbiAqIGVpdGhlciB1c2luZyBgY2FsbGAgb3IgYGFwcGx5YCBvbiB0aGUgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgXG4gKiBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge21peGVkfSBvYmogLSBhbnkgb2JqZWN0IG9yIHZhbHVlXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgY2xhc3Mgb3IgZnVuY3Rpb24gdXNlZCBmb3IgdGhlIHR5cGVcbiAqIG9mIG9iamVjdCBpbnRlcm5hbGx5LiBOb3RlIHRoYXQgd2hpbGUgbnVsbCBhbmQgdW5kZWZpbmVkIGhhdmUgYWN0dWFsXG4gKiB0eXBlcyBpbnRlcm5hbGx5IHRoZXJlIGlzIG5vIGFjY2Vzc2libGUgYE51bGxgIG9yIGBVbmRlZmluZWRgIGNsYXNzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUeXBlID0gb2JqID0+IC90IChcXHcrKS8uZXhlYyhfdG9TdHJpbmcuY2FsbChvYmopKT8uWzFdXG5cbi8qKlxuICogRmV0Y2hlcyB0aGUgaW50ZXJuYWwgdHlwZSBvZiB0aGUgb2JqZWN0IGluIHF1ZXN0aW9uIGFuZCB0aGVuIHJldHVybnNcbiAqIHRydWUgaWYgdGhhdCBpcyBsaXRlcmFsbHkgZXF1aXZhbGVudCB0byBgRnVuY3Rpb24ubmFtZWBcbiAqXG4gKiBAcGFyYW0ge21peGVkfSBvYmogLSBhbnkgb2JqZWN0IG9yIHZhbHVlXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59ICAtIHRydWUgaWYgdGhlIGludGVybmFsIHR5cGUgb2YgdGhlIG9iamVjdCBtYXRjaGVzXG4gKiBgRnVuY3Rpb24ubmFtZWBcbiAqL1xuZXhwb3J0IGNvbnN0IGlzRm4gPSBvYmogPT4gRnVuY3Rpb24ubmFtZSA9PT0gZ2V0VHlwZShvYmopXG5cbi8qKlxuICogR2l2ZW4gYW4gaW5wdXQgb2YgYW55IHR5cGUsIGBwcm90b0NoYWluYCBjb25zdHJ1Y3RzIGFuIGFycmF5IHJlcHJlc2VudGluZ1xuICogdGhlIHByb3RvdHlwZSBjaGFpbiBvZiB0aGUgaW5wdXQuIFRoaXMgYXJyYXkgY29uc2lzdHMgb2YgY29uc3RydWN0b3IgbmFtZXNcbiAqIGZvciBlYWNoIHR5cGUgaW4gdGhlIGNoYWluLiBUaGUgcmVzdWx0aW5nIGFycmF5IGFsc28gaW5jbHVkZXMgYSBub24tc3RhbmRhcmRcbiAqIGBpc2FgIG1ldGhvZCB0aGF0IGNoZWNrcyBpZiBhIGdpdmVuIGNvbnN0cnVjdG9yIG5hbWUgaXMgcGFydCBvZiB0aGUgY2hhaW4uXG4gKiBBZGRpdGlvbmFsbHksIGFuIGBhY3R1YWxgIGdldHRlciBpcyBkZWZpbmVkIHRvIGF0dGVtcHQgZXZhbHVhdGlvbiBvZiB0aGVcbiAqIHByb3RvdHlwZSBjaGFpbiBuYW1lcyB0byB0aGVpciBhY3R1YWwgdHlwZSByZWZlcmVuY2VzLCB3aGVyZSBwb3NzaWJsZS5cbiAqXG4gKiBAZmxvd1xuICogQHBhcmFtIHttaXhlZH0gb2JqZWN0IC0gVGhlIGlucHV0IHZhbHVlIGZvciB3aGljaCB0aGUgcHJvdG90eXBlIGNoYWluIGlzXG4gKiBkZXNpcmVkLlxuICogQHJldHVybnMge0FycmF5PHN0cmluZz4gJiB7IGlzYTogRnVuY3Rpb24sIGFjdHVhbDogQXJyYXk8YW55PiB9fSBBblxuICogYXJyYXkgb2YgY29uc3RydWN0b3IgbmFtZXNcbiAqICAgICAgICAgIHdpdGggYXBwZW5kZWQgYGlzYWAgbWV0aG9kIGFuZCBgYWN0dWFsYCBnZXR0ZXIuXG4gKlxuICogQG5vdGUgVGhlIGBpc2FgIG1ldGhvZCBhbGxvd3MgY2hlY2tpbmcgaWYgYSBnaXZlbiB0eXBlIG5hbWUgaXMgaW4gdGhlXG4gKiBwcm90b3R5cGUgY2hhaW4uIFRoZSBgYWN0dWFsYCBnZXR0ZXIgYXR0ZW1wdHMgdG8gY29udmVydCB0eXBlIG5hbWVzIGJhY2tcbiAqIHRvIHRoZWlyIGV2YWx1YXRlZCB0eXBlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3RvQ2hhaW4ob2JqZWN0OiB1bmtub3duKTogQXJyYXk8c3RyaW5nPiB7XG4gIGlmIChvYmplY3QgPT09IG51bGwgfHwgb2JqZWN0ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIFtnZXRUeXBlKG9iamVjdCldIH1cblxuICBsZXQgY2hhaW4gPSBbIE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpIF1cbiAgbGV0IGN1cnJlbnQgPSBjaGFpblswXVxuXG4gIHdoaWxlKGN1cnJlbnQgIT0gbnVsbCkge1xuICAgIGN1cnJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY3VycmVudClcbiAgICBjaGFpbi5wdXNoKGN1cnJlbnQpXG4gIH1cblxuICBjb25zdCByZXN1bHRzID0gY2hhaW5cbiAgICAubWFwKGMgPT4gYz8uY29uc3RydWN0b3I/Lm5hbWUgfHwgYylcbiAgICAuZmlsdGVyKGMgPT4gISFjKVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHJlc3VsdHMsIHtcbiAgICBpc2E6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc2EodHlwZSkge1xuICAgICAgICBsZXQgZGVyaXZlZCA9IGdldFR5cGUodHlwZSlcbiAgICAgICAgc3dpdGNoKGRlcml2ZWQpIHtcbiAgICAgICAgICBjYXNlIFtGdW5jdGlvbi5uYW1lXTpcbiAgICAgICAgICAgIGRlcml2ZWQgPSB0eXBlLm5hbWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoaXMuaW5jbHVkZXMoZGVyaXZlZCkgfHxcbiAgICAgICAgICB0eXBlPy5uYW1lICYmIHRoaXMuaW5jbHVkZXModHlwZS5uYW1lKVxuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcblxuICAgIGFjdHVhbDoge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGV2YWxPckJ1c3QgPSBvID0+IHsgdHJ5IHsgcmV0dXJuIChldmFsKG8pKSB9IGNhdGNoIHsgcmV0dXJuIG8gfSB9XG4gICAgICAgIGxldCByZXZlcnQgPSBvID0+IHtcbiAgICAgICAgICBzd2l0Y2gobykge1xuICAgICAgICAgICAgY2FzZSAnTnVsbCc6IHJldHVybiBudWxsXG4gICAgICAgICAgICBjYXNlICdVbmRlZmluZWQnOiByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gb1xuICAgICAgICB9fVxuICAgICAgICByZXR1cm4gdGhpcy5tYXAocmV2ZXJ0KS5tYXAoZXZhbE9yQnVzdClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHJlc3VsdHNcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVB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
//# sourceMappingURL=typework.js.map