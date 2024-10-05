"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DoNotSet = void 0;
exports.at = at;
exports.atNicely = atNicely;
exports.default = void 0;
var _errors = require("./errors");
// @ts-check

const DoNotSet = exports.DoNotSet = Symbol.for('DoNotSet');

/**
 * This function takes an array of values that are used with `eval` to
 * dynamically, and programmatically, access the value of an object in a nested
 * fashion. It can take either a string with values separated by periods
 * (including array indices as numbers) or an array equivalent were
 * `.split('.')` to have been called on said string.
 *
 * Examples:
 * ```
 *   // Calling `at` with either set of arguments below results in the same
 *   // values.
 *   let object = { cats: [{ name: 'Sally' }, { name: 'Rose' }] }
 *
 *   at(object, 'cats.1.name') => Rose
 *   at(object, ['cats', 1, 'name']) => Rose
 *
 *   // Values can be altered using the same notation
 *   at(object, 'cats.1.name', 'Brie') => Brie
 *
 *   // Values cannot normally be accessed beyond existence. The following
 *   // will throw an error. A message to console.error will be written showing
 *   // the attempted path before the error is again rethrown
 *   at(object, 'I.do.not.exist') => ERROR
 *
 *   // However, if you want the function to play nice, `undefined` can be
 *   // returned instead of throwing an error if true is specified as the
 *   // fourth parameter
 *   at(object, 'I.do.not.exist', undefined, true) => undefined
 * ```
 *
 * @method at
 *
 * @param {Object} object an object that can be accessed using bracket notation
 * to access its inner property value. Anything extending object, including
 * arrays and functions, should work in this manner.
 * @param {string|string[]} path a period denoted path (numeric indicies
 * are allowed) or an array of individual strings. See above for more details
 * @param {unknown} [setTo=DoNotSet] (optional) if this value is supplied, the
 * path accessed will be modified to this value before it is returned
 * @param {boolean} [playNice=false] (optional) by default if one tries to access a
 * path that fails somewhere in the middle and results in accessing a property
 * on an undefined or null value then an exception is thrown. Passing true here
 * will cause the function to simply return undefined.
 * @return {unknown} either the requested value or undefined as long as no
 * invalid access was requested. Otherwise an error is thrown if try to deeply
 * reach into a space where no value exists.
 */
function at(object, path, setTo = DoNotSet, playNice = false) {
  if (typeof object !== 'object' || object === null || object === undefined) {
    throw new TypeError(`The first argument must be an object`);
  }
  if (typeof path === 'string') {
    if (path.includes('.')) {
      path = path.split('.');
    } else {
      path = [path];
    }
  }
  let target = object;

  // Iterate through the path, except the last key
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (key in target) {
      target = target[key];
    } else if (playNice) {
      return undefined;
    } else {
      throw new _errors.InvalidPathError(`Invalid path: ${path.slice(0, i + 1).join('.')}`);
    }
  }
  const lastKey = path[path.length - 1];

  // Handle setTo, if provided
  if (setTo !== DoNotSet) {
    // Ensure the path is valid before setting the value
    if (!Reflect.has(target, lastKey) && !playNice) {
      throw new _errors.InvalidPathError(`Invalid path: ${path.join('.')}`);
    }
    target[lastKey] = setTo;
  }
  if (!Reflect.has(target, lastKey) && !playNice) {
    throw new _errors.InvalidPathError(`Invalid path: ${path.join('.')}`);
  }

  // Return the value at the specified path, or undefined if playNice is true and the path is invalid
  return Reflect.has(target, lastKey) ? target[lastKey] : undefined;
}

/**
 * `atNicely()` is a shorthand version of calling `at()` but specifying `true`
 * for the argument `playNice`. This can make reads normally performed with
 * calls to `at()` where you want to prevent errors from being thrown with
 * invalid paths
 *
 * @method atNicely
 *
 * @param {Object} object an object that can be accessed using bracket notation
 * to access its inner property value. Anything extending object, including
 * arrays and functions, should work in this manner.
 * @param {string|string[]} path a period denoted path (numeric indicies
 * are allowed) or an array of individual strings. See above for more details
 * @param {unknown?} setTo (optional) if this value is supplied, the path accessed
 * will be modified to this value before it is returned
 * @return {unknown} either the requested value or undefined
 */
function atNicely(object, path, setTo) {
  return at(object, path, setTo, true);
}

/**
 * Default export is atNicely; as long as you know what you want, this leaves
 * cleaner code in your repository. Simply add this to the top of your module
 * ```
 * const at = require('./propAt').default
 * // or
 * import at from './propAt'
 *
 * // of course if you prefer, you may still do the following
 * const at = require('./propAt').at;
 * // or
 * import { at } from './propAt'
 * ```
 */
var _default = exports.default = atNicely;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXJyb3JzIiwicmVxdWlyZSIsIkRvTm90U2V0IiwiZXhwb3J0cyIsIlN5bWJvbCIsImZvciIsImF0Iiwib2JqZWN0IiwicGF0aCIsInNldFRvIiwicGxheU5pY2UiLCJ1bmRlZmluZWQiLCJUeXBlRXJyb3IiLCJpbmNsdWRlcyIsInNwbGl0IiwidGFyZ2V0IiwiaSIsImxlbmd0aCIsImtleSIsIkludmFsaWRQYXRoRXJyb3IiLCJzbGljZSIsImpvaW4iLCJsYXN0S2V5IiwiUmVmbGVjdCIsImhhcyIsImF0TmljZWx5IiwiX2RlZmF1bHQiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vc3JjL3Byb3BBdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IHsgSW52YWxpZFBhdGhFcnJvciB9IGZyb20gJy4vZXJyb3JzJ1xuXG5leHBvcnQgY29uc3QgRG9Ob3RTZXQgPSBTeW1ib2wuZm9yKCdEb05vdFNldCcpXG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiB0YWtlcyBhbiBhcnJheSBvZiB2YWx1ZXMgdGhhdCBhcmUgdXNlZCB3aXRoIGBldmFsYCB0b1xuICogZHluYW1pY2FsbHksIGFuZCBwcm9ncmFtbWF0aWNhbGx5LCBhY2Nlc3MgdGhlIHZhbHVlIG9mIGFuIG9iamVjdCBpbiBhIG5lc3RlZFxuICogZmFzaGlvbi4gSXQgY2FuIHRha2UgZWl0aGVyIGEgc3RyaW5nIHdpdGggdmFsdWVzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gKiAoaW5jbHVkaW5nIGFycmF5IGluZGljZXMgYXMgbnVtYmVycykgb3IgYW4gYXJyYXkgZXF1aXZhbGVudCB3ZXJlXG4gKiBgLnNwbGl0KCcuJylgIHRvIGhhdmUgYmVlbiBjYWxsZWQgb24gc2FpZCBzdHJpbmcuXG4gKlxuICogRXhhbXBsZXM6XG4gKiBgYGBcbiAqICAgLy8gQ2FsbGluZyBgYXRgIHdpdGggZWl0aGVyIHNldCBvZiBhcmd1bWVudHMgYmVsb3cgcmVzdWx0cyBpbiB0aGUgc2FtZVxuICogICAvLyB2YWx1ZXMuXG4gKiAgIGxldCBvYmplY3QgPSB7IGNhdHM6IFt7IG5hbWU6ICdTYWxseScgfSwgeyBuYW1lOiAnUm9zZScgfV0gfVxuICpcbiAqICAgYXQob2JqZWN0LCAnY2F0cy4xLm5hbWUnKSA9PiBSb3NlXG4gKiAgIGF0KG9iamVjdCwgWydjYXRzJywgMSwgJ25hbWUnXSkgPT4gUm9zZVxuICpcbiAqICAgLy8gVmFsdWVzIGNhbiBiZSBhbHRlcmVkIHVzaW5nIHRoZSBzYW1lIG5vdGF0aW9uXG4gKiAgIGF0KG9iamVjdCwgJ2NhdHMuMS5uYW1lJywgJ0JyaWUnKSA9PiBCcmllXG4gKlxuICogICAvLyBWYWx1ZXMgY2Fubm90IG5vcm1hbGx5IGJlIGFjY2Vzc2VkIGJleW9uZCBleGlzdGVuY2UuIFRoZSBmb2xsb3dpbmdcbiAqICAgLy8gd2lsbCB0aHJvdyBhbiBlcnJvci4gQSBtZXNzYWdlIHRvIGNvbnNvbGUuZXJyb3Igd2lsbCBiZSB3cml0dGVuIHNob3dpbmdcbiAqICAgLy8gdGhlIGF0dGVtcHRlZCBwYXRoIGJlZm9yZSB0aGUgZXJyb3IgaXMgYWdhaW4gcmV0aHJvd25cbiAqICAgYXQob2JqZWN0LCAnSS5kby5ub3QuZXhpc3QnKSA9PiBFUlJPUlxuICpcbiAqICAgLy8gSG93ZXZlciwgaWYgeW91IHdhbnQgdGhlIGZ1bmN0aW9uIHRvIHBsYXkgbmljZSwgYHVuZGVmaW5lZGAgY2FuIGJlXG4gKiAgIC8vIHJldHVybmVkIGluc3RlYWQgb2YgdGhyb3dpbmcgYW4gZXJyb3IgaWYgdHJ1ZSBpcyBzcGVjaWZpZWQgYXMgdGhlXG4gKiAgIC8vIGZvdXJ0aCBwYXJhbWV0ZXJcbiAqICAgYXQob2JqZWN0LCAnSS5kby5ub3QuZXhpc3QnLCB1bmRlZmluZWQsIHRydWUpID0+IHVuZGVmaW5lZFxuICogYGBgXG4gKlxuICogQG1ldGhvZCBhdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHVzaW5nIGJyYWNrZXQgbm90YXRpb25cbiAqIHRvIGFjY2VzcyBpdHMgaW5uZXIgcHJvcGVydHkgdmFsdWUuIEFueXRoaW5nIGV4dGVuZGluZyBvYmplY3QsIGluY2x1ZGluZ1xuICogYXJyYXlzIGFuZCBmdW5jdGlvbnMsIHNob3VsZCB3b3JrIGluIHRoaXMgbWFubmVyLlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBhdGggYSBwZXJpb2QgZGVub3RlZCBwYXRoIChudW1lcmljIGluZGljaWVzXG4gKiBhcmUgYWxsb3dlZCkgb3IgYW4gYXJyYXkgb2YgaW5kaXZpZHVhbCBzdHJpbmdzLiBTZWUgYWJvdmUgZm9yIG1vcmUgZGV0YWlsc1xuICogQHBhcmFtIHt1bmtub3dufSBbc2V0VG89RG9Ob3RTZXRdIChvcHRpb25hbCkgaWYgdGhpcyB2YWx1ZSBpcyBzdXBwbGllZCwgdGhlXG4gKiBwYXRoIGFjY2Vzc2VkIHdpbGwgYmUgbW9kaWZpZWQgdG8gdGhpcyB2YWx1ZSBiZWZvcmUgaXQgaXMgcmV0dXJuZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BsYXlOaWNlPWZhbHNlXSAob3B0aW9uYWwpIGJ5IGRlZmF1bHQgaWYgb25lIHRyaWVzIHRvIGFjY2VzcyBhXG4gKiBwYXRoIHRoYXQgZmFpbHMgc29tZXdoZXJlIGluIHRoZSBtaWRkbGUgYW5kIHJlc3VsdHMgaW4gYWNjZXNzaW5nIGEgcHJvcGVydHlcbiAqIG9uIGFuIHVuZGVmaW5lZCBvciBudWxsIHZhbHVlIHRoZW4gYW4gZXhjZXB0aW9uIGlzIHRocm93bi4gUGFzc2luZyB0cnVlIGhlcmVcbiAqIHdpbGwgY2F1c2UgdGhlIGZ1bmN0aW9uIHRvIHNpbXBseSByZXR1cm4gdW5kZWZpbmVkLlxuICogQHJldHVybiB7dW5rbm93bn0gZWl0aGVyIHRoZSByZXF1ZXN0ZWQgdmFsdWUgb3IgdW5kZWZpbmVkIGFzIGxvbmcgYXMgbm9cbiAqIGludmFsaWQgYWNjZXNzIHdhcyByZXF1ZXN0ZWQuIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24gaWYgdHJ5IHRvIGRlZXBseVxuICogcmVhY2ggaW50byBhIHNwYWNlIHdoZXJlIG5vIHZhbHVlIGV4aXN0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF0KG9iamVjdCwgcGF0aCwgc2V0VG8gPSBEb05vdFNldCwgcGxheU5pY2UgPSBmYWxzZSkge1xuICBpZiAodHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgb2JqZWN0ID09PSBudWxsIHx8IG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0YClcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAocGF0aC5pbmNsdWRlcygnLicpKSB7XG4gICAgICBwYXRoID0gcGF0aC5zcGxpdCgnLicpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcGF0aCA9IFtwYXRoXVxuICAgIH1cbiAgfVxuXG4gIGxldCB0YXJnZXQgPSBvYmplY3Q7XG5cbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBwYXRoLCBleGNlcHQgdGhlIGxhc3Qga2V5XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBwYXRoW2ldO1xuICAgIGlmIChrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXRba2V5XTtcbiAgICB9IGVsc2UgaWYgKHBsYXlOaWNlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBhdGhFcnJvcihgSW52YWxpZCBwYXRoOiAke3BhdGguc2xpY2UoMCwgaSArIDEpLmpvaW4oJy4nKX1gKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBsYXN0S2V5ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuXG4gIC8vIEhhbmRsZSBzZXRUbywgaWYgcHJvdmlkZWRcbiAgaWYgKHNldFRvICE9PSBEb05vdFNldCkge1xuICAgIC8vIEVuc3VyZSB0aGUgcGF0aCBpcyB2YWxpZCBiZWZvcmUgc2V0dGluZyB0aGUgdmFsdWVcbiAgICBpZiAoIShSZWZsZWN0Lmhhcyh0YXJnZXQsIGxhc3RLZXkpKSAmJiAhcGxheU5pY2UpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUGF0aEVycm9yKGBJbnZhbGlkIHBhdGg6ICR7cGF0aC5qb2luKCcuJyl9YCk7XG4gICAgfVxuICAgIHRhcmdldFtsYXN0S2V5XSA9IHNldFRvO1xuICB9XG5cbiAgaWYgKCFSZWZsZWN0Lmhhcyh0YXJnZXQsIGxhc3RLZXkpICYmICFwbGF5TmljZSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkUGF0aEVycm9yKGBJbnZhbGlkIHBhdGg6ICR7cGF0aC5qb2luKCcuJyl9YClcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBwYXRoLCBvciB1bmRlZmluZWQgaWYgcGxheU5pY2UgaXMgdHJ1ZSBhbmQgdGhlIHBhdGggaXMgaW52YWxpZFxuICByZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBsYXN0S2V5KVxuICAgID8gdGFyZ2V0W2xhc3RLZXldXG4gICAgOiB1bmRlZmluZWRcbn1cblxuLyoqXG4gKiBgYXROaWNlbHkoKWAgaXMgYSBzaG9ydGhhbmQgdmVyc2lvbiBvZiBjYWxsaW5nIGBhdCgpYCBidXQgc3BlY2lmeWluZyBgdHJ1ZWBcbiAqIGZvciB0aGUgYXJndW1lbnQgYHBsYXlOaWNlYC4gVGhpcyBjYW4gbWFrZSByZWFkcyBub3JtYWxseSBwZXJmb3JtZWQgd2l0aFxuICogY2FsbHMgdG8gYGF0KClgIHdoZXJlIHlvdSB3YW50IHRvIHByZXZlbnQgZXJyb3JzIGZyb20gYmVpbmcgdGhyb3duIHdpdGhcbiAqIGludmFsaWQgcGF0aHNcbiAqXG4gKiBAbWV0aG9kIGF0TmljZWx5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBhbiBvYmplY3QgdGhhdCBjYW4gYmUgYWNjZXNzZWQgdXNpbmcgYnJhY2tldCBub3RhdGlvblxuICogdG8gYWNjZXNzIGl0cyBpbm5lciBwcm9wZXJ0eSB2YWx1ZS4gQW55dGhpbmcgZXh0ZW5kaW5nIG9iamVjdCwgaW5jbHVkaW5nXG4gKiBhcnJheXMgYW5kIGZ1bmN0aW9ucywgc2hvdWxkIHdvcmsgaW4gdGhpcyBtYW5uZXIuXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcGF0aCBhIHBlcmlvZCBkZW5vdGVkIHBhdGggKG51bWVyaWMgaW5kaWNpZXNcbiAqIGFyZSBhbGxvd2VkKSBvciBhbiBhcnJheSBvZiBpbmRpdmlkdWFsIHN0cmluZ3MuIFNlZSBhYm92ZSBmb3IgbW9yZSBkZXRhaWxzXG4gKiBAcGFyYW0ge3Vua25vd24/fSBzZXRUbyAob3B0aW9uYWwpIGlmIHRoaXMgdmFsdWUgaXMgc3VwcGxpZWQsIHRoZSBwYXRoIGFjY2Vzc2VkXG4gKiB3aWxsIGJlIG1vZGlmaWVkIHRvIHRoaXMgdmFsdWUgYmVmb3JlIGl0IGlzIHJldHVybmVkXG4gKiBAcmV0dXJuIHt1bmtub3dufSBlaXRoZXIgdGhlIHJlcXVlc3RlZCB2YWx1ZSBvciB1bmRlZmluZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF0TmljZWx5KG9iamVjdCwgcGF0aCwgc2V0VG8pIHtcbiAgcmV0dXJuIGF0KG9iamVjdCwgcGF0aCwgc2V0VG8sIHRydWUpXG59XG5cbi8qKlxuICogRGVmYXVsdCBleHBvcnQgaXMgYXROaWNlbHk7IGFzIGxvbmcgYXMgeW91IGtub3cgd2hhdCB5b3Ugd2FudCwgdGhpcyBsZWF2ZXNcbiAqIGNsZWFuZXIgY29kZSBpbiB5b3VyIHJlcG9zaXRvcnkuIFNpbXBseSBhZGQgdGhpcyB0byB0aGUgdG9wIG9mIHlvdXIgbW9kdWxlXG4gKiBgYGBcbiAqIGNvbnN0IGF0ID0gcmVxdWlyZSgnLi9wcm9wQXQnKS5kZWZhdWx0XG4gKiAvLyBvclxuICogaW1wb3J0IGF0IGZyb20gJy4vcHJvcEF0J1xuICpcbiAqIC8vIG9mIGNvdXJzZSBpZiB5b3UgcHJlZmVyLCB5b3UgbWF5IHN0aWxsIGRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbnN0IGF0ID0gcmVxdWlyZSgnLi9wcm9wQXQnKS5hdDtcbiAqIC8vIG9yXG4gKiBpbXBvcnQgeyBhdCB9IGZyb20gJy4vcHJvcEF0J1xuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGF0TmljZWx5XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLElBQUFBLE9BQUEsR0FBQUMsT0FBQTtBQUZBOztBQUlPLE1BQU1DLFFBQVEsR0FBQUMsT0FBQSxDQUFBRCxRQUFBLEdBQUdFLE1BQU0sQ0FBQ0MsR0FBRyxDQUFDLFVBQVUsQ0FBQzs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNDLEVBQUVBLENBQUNDLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEdBQUdQLFFBQVEsRUFBRVEsUUFBUSxHQUFHLEtBQUssRUFBRTtFQUNuRSxJQUFJLE9BQU9ILE1BQU0sS0FBSyxRQUFRLElBQUlBLE1BQU0sS0FBSyxJQUFJLElBQUlBLE1BQU0sS0FBS0ksU0FBUyxFQUFFO0lBQ3pFLE1BQU0sSUFBSUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDO0VBQzdEO0VBRUEsSUFBSSxPQUFPSixJQUFJLEtBQUssUUFBUSxFQUFFO0lBQzVCLElBQUlBLElBQUksQ0FBQ0ssUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQ3RCTCxJQUFJLEdBQUdBLElBQUksQ0FBQ00sS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUN4QixDQUFDLE1BQ0k7TUFDSE4sSUFBSSxHQUFHLENBQUNBLElBQUksQ0FBQztJQUNmO0VBQ0Y7RUFFQSxJQUFJTyxNQUFNLEdBQUdSLE1BQU07O0VBRW5CO0VBQ0EsS0FBSyxJQUFJUyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdSLElBQUksQ0FBQ1MsTUFBTSxHQUFHLENBQUMsRUFBRUQsQ0FBQyxFQUFFLEVBQUU7SUFDeEMsTUFBTUUsR0FBRyxHQUFHVixJQUFJLENBQUNRLENBQUMsQ0FBQztJQUNuQixJQUFJRSxHQUFHLElBQUlILE1BQU0sRUFBRTtNQUNqQkEsTUFBTSxHQUFHQSxNQUFNLENBQUNHLEdBQUcsQ0FBQztJQUN0QixDQUFDLE1BQU0sSUFBSVIsUUFBUSxFQUFFO01BQ25CLE9BQU9DLFNBQVM7SUFDbEIsQ0FBQyxNQUFNO01BQ0wsTUFBTSxJQUFJUSx3QkFBZ0IsQ0FBQyxpQkFBaUJYLElBQUksQ0FBQ1ksS0FBSyxDQUFDLENBQUMsRUFBRUosQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMvRTtFQUNGO0VBRUEsTUFBTUMsT0FBTyxHQUFHZCxJQUFJLENBQUNBLElBQUksQ0FBQ1MsTUFBTSxHQUFHLENBQUMsQ0FBQzs7RUFFckM7RUFDQSxJQUFJUixLQUFLLEtBQUtQLFFBQVEsRUFBRTtJQUN0QjtJQUNBLElBQUksQ0FBRXFCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDVCxNQUFNLEVBQUVPLE9BQU8sQ0FBRSxJQUFJLENBQUNaLFFBQVEsRUFBRTtNQUNoRCxNQUFNLElBQUlTLHdCQUFnQixDQUFDLGlCQUFpQlgsSUFBSSxDQUFDYSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMvRDtJQUNBTixNQUFNLENBQUNPLE9BQU8sQ0FBQyxHQUFHYixLQUFLO0VBQ3pCO0VBRUEsSUFBSSxDQUFDYyxPQUFPLENBQUNDLEdBQUcsQ0FBQ1QsTUFBTSxFQUFFTyxPQUFPLENBQUMsSUFBSSxDQUFDWixRQUFRLEVBQUU7SUFDOUMsTUFBTSxJQUFJUyx3QkFBZ0IsQ0FBQyxpQkFBaUJYLElBQUksQ0FBQ2EsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7RUFDL0Q7O0VBRUE7RUFDQSxPQUFPRSxPQUFPLENBQUNDLEdBQUcsQ0FBQ1QsTUFBTSxFQUFFTyxPQUFPLENBQUMsR0FDL0JQLE1BQU0sQ0FBQ08sT0FBTyxDQUFDLEdBQ2ZYLFNBQVM7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU2MsUUFBUUEsQ0FBQ2xCLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUU7RUFDNUMsT0FBT0gsRUFBRSxDQUFDQyxNQUFNLEVBQUVDLElBQUksRUFBRUMsS0FBSyxFQUFFLElBQUksQ0FBQztBQUN0Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBYkEsSUFBQWlCLFFBQUEsR0FBQXZCLE9BQUEsQ0FBQXdCLE9BQUEsR0FjZUYsUUFBUSIsImlnbm9yZUxpc3QiOltdfQ==
//# sourceMappingURL=propAt.js.map