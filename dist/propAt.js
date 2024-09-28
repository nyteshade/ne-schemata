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
 * @param {unknown} setTo (optional) if this value is supplied, the path accessed
 * will be modified to this value before it is returned
 * @param {boolean} playNice (optional) by default if one tries to access a
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
 * @param {unknown} setTo (optional) if this value is supplied, the path accessed
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXJyb3JzIiwicmVxdWlyZSIsIkRvTm90U2V0IiwiZXhwb3J0cyIsIlN5bWJvbCIsImZvciIsImF0Iiwib2JqZWN0IiwicGF0aCIsInNldFRvIiwicGxheU5pY2UiLCJ1bmRlZmluZWQiLCJUeXBlRXJyb3IiLCJpbmNsdWRlcyIsInNwbGl0IiwidGFyZ2V0IiwiaSIsImxlbmd0aCIsImtleSIsIkludmFsaWRQYXRoRXJyb3IiLCJzbGljZSIsImpvaW4iLCJsYXN0S2V5IiwiUmVmbGVjdCIsImhhcyIsImF0TmljZWx5IiwiX2RlZmF1bHQiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vc3JjL3Byb3BBdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IHsgSW52YWxpZFBhdGhFcnJvciB9IGZyb20gJy4vZXJyb3JzJ1xuXG5leHBvcnQgY29uc3QgRG9Ob3RTZXQgPSBTeW1ib2wuZm9yKCdEb05vdFNldCcpXG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiB0YWtlcyBhbiBhcnJheSBvZiB2YWx1ZXMgdGhhdCBhcmUgdXNlZCB3aXRoIGBldmFsYCB0b1xuICogZHluYW1pY2FsbHksIGFuZCBwcm9ncmFtbWF0aWNhbGx5LCBhY2Nlc3MgdGhlIHZhbHVlIG9mIGFuIG9iamVjdCBpbiBhIG5lc3RlZFxuICogZmFzaGlvbi4gSXQgY2FuIHRha2UgZWl0aGVyIGEgc3RyaW5nIHdpdGggdmFsdWVzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gKiAoaW5jbHVkaW5nIGFycmF5IGluZGljZXMgYXMgbnVtYmVycykgb3IgYW4gYXJyYXkgZXF1aXZhbGVudCB3ZXJlXG4gKiBgLnNwbGl0KCcuJylgIHRvIGhhdmUgYmVlbiBjYWxsZWQgb24gc2FpZCBzdHJpbmcuXG4gKlxuICogRXhhbXBsZXM6XG4gKiBgYGBcbiAqICAgLy8gQ2FsbGluZyBgYXRgIHdpdGggZWl0aGVyIHNldCBvZiBhcmd1bWVudHMgYmVsb3cgcmVzdWx0cyBpbiB0aGUgc2FtZVxuICogICAvLyB2YWx1ZXMuXG4gKiAgIGxldCBvYmplY3QgPSB7IGNhdHM6IFt7IG5hbWU6ICdTYWxseScgfSwgeyBuYW1lOiAnUm9zZScgfV0gfVxuICpcbiAqICAgYXQob2JqZWN0LCAnY2F0cy4xLm5hbWUnKSA9PiBSb3NlXG4gKiAgIGF0KG9iamVjdCwgWydjYXRzJywgMSwgJ25hbWUnXSkgPT4gUm9zZVxuICpcbiAqICAgLy8gVmFsdWVzIGNhbiBiZSBhbHRlcmVkIHVzaW5nIHRoZSBzYW1lIG5vdGF0aW9uXG4gKiAgIGF0KG9iamVjdCwgJ2NhdHMuMS5uYW1lJywgJ0JyaWUnKSA9PiBCcmllXG4gKlxuICogICAvLyBWYWx1ZXMgY2Fubm90IG5vcm1hbGx5IGJlIGFjY2Vzc2VkIGJleW9uZCBleGlzdGVuY2UuIFRoZSBmb2xsb3dpbmdcbiAqICAgLy8gd2lsbCB0aHJvdyBhbiBlcnJvci4gQSBtZXNzYWdlIHRvIGNvbnNvbGUuZXJyb3Igd2lsbCBiZSB3cml0dGVuIHNob3dpbmdcbiAqICAgLy8gdGhlIGF0dGVtcHRlZCBwYXRoIGJlZm9yZSB0aGUgZXJyb3IgaXMgYWdhaW4gcmV0aHJvd25cbiAqICAgYXQob2JqZWN0LCAnSS5kby5ub3QuZXhpc3QnKSA9PiBFUlJPUlxuICpcbiAqICAgLy8gSG93ZXZlciwgaWYgeW91IHdhbnQgdGhlIGZ1bmN0aW9uIHRvIHBsYXkgbmljZSwgYHVuZGVmaW5lZGAgY2FuIGJlXG4gKiAgIC8vIHJldHVybmVkIGluc3RlYWQgb2YgdGhyb3dpbmcgYW4gZXJyb3IgaWYgdHJ1ZSBpcyBzcGVjaWZpZWQgYXMgdGhlXG4gKiAgIC8vIGZvdXJ0aCBwYXJhbWV0ZXJcbiAqICAgYXQob2JqZWN0LCAnSS5kby5ub3QuZXhpc3QnLCB1bmRlZmluZWQsIHRydWUpID0+IHVuZGVmaW5lZFxuICogYGBgXG4gKlxuICogQG1ldGhvZCBhdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHVzaW5nIGJyYWNrZXQgbm90YXRpb25cbiAqIHRvIGFjY2VzcyBpdHMgaW5uZXIgcHJvcGVydHkgdmFsdWUuIEFueXRoaW5nIGV4dGVuZGluZyBvYmplY3QsIGluY2x1ZGluZ1xuICogYXJyYXlzIGFuZCBmdW5jdGlvbnMsIHNob3VsZCB3b3JrIGluIHRoaXMgbWFubmVyLlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBhdGggYSBwZXJpb2QgZGVub3RlZCBwYXRoIChudW1lcmljIGluZGljaWVzXG4gKiBhcmUgYWxsb3dlZCkgb3IgYW4gYXJyYXkgb2YgaW5kaXZpZHVhbCBzdHJpbmdzLiBTZWUgYWJvdmUgZm9yIG1vcmUgZGV0YWlsc1xuICogQHBhcmFtIHt1bmtub3dufSBzZXRUbyAob3B0aW9uYWwpIGlmIHRoaXMgdmFsdWUgaXMgc3VwcGxpZWQsIHRoZSBwYXRoIGFjY2Vzc2VkXG4gKiB3aWxsIGJlIG1vZGlmaWVkIHRvIHRoaXMgdmFsdWUgYmVmb3JlIGl0IGlzIHJldHVybmVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHBsYXlOaWNlIChvcHRpb25hbCkgYnkgZGVmYXVsdCBpZiBvbmUgdHJpZXMgdG8gYWNjZXNzIGFcbiAqIHBhdGggdGhhdCBmYWlscyBzb21ld2hlcmUgaW4gdGhlIG1pZGRsZSBhbmQgcmVzdWx0cyBpbiBhY2Nlc3NpbmcgYSBwcm9wZXJ0eVxuICogb24gYW4gdW5kZWZpbmVkIG9yIG51bGwgdmFsdWUgdGhlbiBhbiBleGNlcHRpb24gaXMgdGhyb3duLiBQYXNzaW5nIHRydWUgaGVyZVxuICogd2lsbCBjYXVzZSB0aGUgZnVuY3Rpb24gdG8gc2ltcGx5IHJldHVybiB1bmRlZmluZWQuXG4gKiBAcmV0dXJuIHt1bmtub3dufSBlaXRoZXIgdGhlIHJlcXVlc3RlZCB2YWx1ZSBvciB1bmRlZmluZWQgYXMgbG9uZyBhcyBub1xuICogaW52YWxpZCBhY2Nlc3Mgd2FzIHJlcXVlc3RlZC4gT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93biBpZiB0cnkgdG8gZGVlcGx5XG4gKiByZWFjaCBpbnRvIGEgc3BhY2Ugd2hlcmUgbm8gdmFsdWUgZXhpc3RzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXQoXG4gIG9iamVjdDogT2JqZWN0LFxuICBwYXRoOiBzdHJpbmcgfCBzdHJpbmdbXSxcbiAgc2V0VG8/OiB1bmtub3duID0gRG9Ob3RTZXQsXG4gIHBsYXlOaWNlPzogYm9vbGVhbiA9IGZhbHNlXG4pOiB1bmtub3duIHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnIHx8IG9iamVjdCA9PT0gbnVsbCB8fCBvYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdGApXG4gIH1cblxuICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHBhdGguaW5jbHVkZXMoJy4nKSkge1xuICAgICAgcGF0aCA9IHBhdGguc3BsaXQoJy4nKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHBhdGggPSBbcGF0aF1cbiAgICB9XG4gIH1cblxuICBsZXQgdGFyZ2V0ID0gb2JqZWN0O1xuXG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCB0aGUgcGF0aCwgZXhjZXB0IHRoZSBsYXN0IGtleVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gcGF0aFtpXTtcbiAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0W2tleV07XG4gICAgfSBlbHNlIGlmIChwbGF5TmljZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRQYXRoRXJyb3IoYEludmFsaWQgcGF0aDogJHtwYXRoLnNsaWNlKDAsIGkgKyAxKS5qb2luKCcuJyl9YCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbGFzdEtleSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcblxuICAvLyBIYW5kbGUgc2V0VG8sIGlmIHByb3ZpZGVkXG4gIGlmIChzZXRUbyAhPT0gRG9Ob3RTZXQpIHtcbiAgICAvLyBFbnN1cmUgdGhlIHBhdGggaXMgdmFsaWQgYmVmb3JlIHNldHRpbmcgdGhlIHZhbHVlXG4gICAgaWYgKCEoUmVmbGVjdC5oYXModGFyZ2V0LCBsYXN0S2V5KSkgJiYgIXBsYXlOaWNlKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBhdGhFcnJvcihgSW52YWxpZCBwYXRoOiAke3BhdGguam9pbignLicpfWApO1xuICAgIH1cbiAgICB0YXJnZXRbbGFzdEtleV0gPSBzZXRUbztcbiAgfVxuXG4gIGlmICghUmVmbGVjdC5oYXModGFyZ2V0LCBsYXN0S2V5KSAmJiAhcGxheU5pY2UpIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZFBhdGhFcnJvcihgSW52YWxpZCBwYXRoOiAke3BhdGguam9pbignLicpfWApXG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgcGF0aCwgb3IgdW5kZWZpbmVkIGlmIHBsYXlOaWNlIGlzIHRydWUgYW5kIHRoZSBwYXRoIGlzIGludmFsaWRcbiAgcmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgbGFzdEtleSlcbiAgICA/IHRhcmdldFtsYXN0S2V5XVxuICAgIDogdW5kZWZpbmVkXG59XG5cbi8qKlxuICogYGF0TmljZWx5KClgIGlzIGEgc2hvcnRoYW5kIHZlcnNpb24gb2YgY2FsbGluZyBgYXQoKWAgYnV0IHNwZWNpZnlpbmcgYHRydWVgXG4gKiBmb3IgdGhlIGFyZ3VtZW50IGBwbGF5TmljZWAuIFRoaXMgY2FuIG1ha2UgcmVhZHMgbm9ybWFsbHkgcGVyZm9ybWVkIHdpdGhcbiAqIGNhbGxzIHRvIGBhdCgpYCB3aGVyZSB5b3Ugd2FudCB0byBwcmV2ZW50IGVycm9ycyBmcm9tIGJlaW5nIHRocm93biB3aXRoXG4gKiBpbnZhbGlkIHBhdGhzXG4gKlxuICogQG1ldGhvZCBhdE5pY2VseVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHVzaW5nIGJyYWNrZXQgbm90YXRpb25cbiAqIHRvIGFjY2VzcyBpdHMgaW5uZXIgcHJvcGVydHkgdmFsdWUuIEFueXRoaW5nIGV4dGVuZGluZyBvYmplY3QsIGluY2x1ZGluZ1xuICogYXJyYXlzIGFuZCBmdW5jdGlvbnMsIHNob3VsZCB3b3JrIGluIHRoaXMgbWFubmVyLlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBhdGggYSBwZXJpb2QgZGVub3RlZCBwYXRoIChudW1lcmljIGluZGljaWVzXG4gKiBhcmUgYWxsb3dlZCkgb3IgYW4gYXJyYXkgb2YgaW5kaXZpZHVhbCBzdHJpbmdzLiBTZWUgYWJvdmUgZm9yIG1vcmUgZGV0YWlsc1xuICogQHBhcmFtIHt1bmtub3dufSBzZXRUbyAob3B0aW9uYWwpIGlmIHRoaXMgdmFsdWUgaXMgc3VwcGxpZWQsIHRoZSBwYXRoIGFjY2Vzc2VkXG4gKiB3aWxsIGJlIG1vZGlmaWVkIHRvIHRoaXMgdmFsdWUgYmVmb3JlIGl0IGlzIHJldHVybmVkXG4gKiBAcmV0dXJuIHt1bmtub3dufSBlaXRoZXIgdGhlIHJlcXVlc3RlZCB2YWx1ZSBvciB1bmRlZmluZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF0TmljZWx5KFxuICBvYmplY3Q6IE9iamVjdCxcbiAgcGF0aDogc3RyaW5nIHwgc3RyaW5nW10sXG4gIHNldFRvPzogdW5rbm93blxuKTogdW5rbm93biB7XG4gIHJldHVybiBhdChvYmplY3QsIHBhdGgsIHNldFRvLCB0cnVlKVxufVxuXG4vKipcbiAqIERlZmF1bHQgZXhwb3J0IGlzIGF0TmljZWx5OyBhcyBsb25nIGFzIHlvdSBrbm93IHdoYXQgeW91IHdhbnQsIHRoaXMgbGVhdmVzXG4gKiBjbGVhbmVyIGNvZGUgaW4geW91ciByZXBvc2l0b3J5LiBTaW1wbHkgYWRkIHRoaXMgdG8gdGhlIHRvcCBvZiB5b3VyIG1vZHVsZVxuICogYGBgXG4gKiBjb25zdCBhdCA9IHJlcXVpcmUoJy4vcHJvcEF0JykuZGVmYXVsdFxuICogLy8gb3JcbiAqIGltcG9ydCBhdCBmcm9tICcuL3Byb3BBdCdcbiAqXG4gKiAvLyBvZiBjb3Vyc2UgaWYgeW91IHByZWZlciwgeW91IG1heSBzdGlsbCBkbyB0aGUgZm9sbG93aW5nXG4gKiBjb25zdCBhdCA9IHJlcXVpcmUoJy4vcHJvcEF0JykuYXQ7XG4gKiAvLyBvclxuICogaW1wb3J0IHsgYXQgfSBmcm9tICcuL3Byb3BBdCdcbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBhdE5pY2VseVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQSxJQUFBQSxPQUFBLEdBQUFDLE9BQUE7QUFGQTs7QUFJTyxNQUFNQyxRQUFRLEdBQUFDLE9BQUEsQ0FBQUQsUUFBQSxHQUFHRSxNQUFNLENBQUNDLEdBQUcsQ0FBQyxVQUFVLENBQUM7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQyxFQUFFQSxDQUNoQkMsTUFBYyxFQUNkQyxJQUF1QixFQUN2QkMsS0FBZSxHQUFHUCxRQUFRLEVBQzFCUSxRQUFrQixHQUFHLEtBQUssRUFDakI7RUFDVCxJQUFJLE9BQU9ILE1BQU0sS0FBSyxRQUFRLElBQUlBLE1BQU0sS0FBSyxJQUFJLElBQUlBLE1BQU0sS0FBS0ksU0FBUyxFQUFFO0lBQ3pFLE1BQU0sSUFBSUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDO0VBQzdEO0VBRUEsSUFBSSxPQUFPSixJQUFJLEtBQUssUUFBUSxFQUFFO0lBQzVCLElBQUlBLElBQUksQ0FBQ0ssUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQ3RCTCxJQUFJLEdBQUdBLElBQUksQ0FBQ00sS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUN4QixDQUFDLE1BQ0k7TUFDSE4sSUFBSSxHQUFHLENBQUNBLElBQUksQ0FBQztJQUNmO0VBQ0Y7RUFFQSxJQUFJTyxNQUFNLEdBQUdSLE1BQU07O0VBRW5CO0VBQ0EsS0FBSyxJQUFJUyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdSLElBQUksQ0FBQ1MsTUFBTSxHQUFHLENBQUMsRUFBRUQsQ0FBQyxFQUFFLEVBQUU7SUFDeEMsTUFBTUUsR0FBRyxHQUFHVixJQUFJLENBQUNRLENBQUMsQ0FBQztJQUNuQixJQUFJRSxHQUFHLElBQUlILE1BQU0sRUFBRTtNQUNqQkEsTUFBTSxHQUFHQSxNQUFNLENBQUNHLEdBQUcsQ0FBQztJQUN0QixDQUFDLE1BQU0sSUFBSVIsUUFBUSxFQUFFO01BQ25CLE9BQU9DLFNBQVM7SUFDbEIsQ0FBQyxNQUFNO01BQ0wsTUFBTSxJQUFJUSx3QkFBZ0IsQ0FBQyxpQkFBaUJYLElBQUksQ0FBQ1ksS0FBSyxDQUFDLENBQUMsRUFBRUosQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMvRTtFQUNGO0VBRUEsTUFBTUMsT0FBTyxHQUFHZCxJQUFJLENBQUNBLElBQUksQ0FBQ1MsTUFBTSxHQUFHLENBQUMsQ0FBQzs7RUFFckM7RUFDQSxJQUFJUixLQUFLLEtBQUtQLFFBQVEsRUFBRTtJQUN0QjtJQUNBLElBQUksQ0FBRXFCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDVCxNQUFNLEVBQUVPLE9BQU8sQ0FBRSxJQUFJLENBQUNaLFFBQVEsRUFBRTtNQUNoRCxNQUFNLElBQUlTLHdCQUFnQixDQUFDLGlCQUFpQlgsSUFBSSxDQUFDYSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMvRDtJQUNBTixNQUFNLENBQUNPLE9BQU8sQ0FBQyxHQUFHYixLQUFLO0VBQ3pCO0VBRUEsSUFBSSxDQUFDYyxPQUFPLENBQUNDLEdBQUcsQ0FBQ1QsTUFBTSxFQUFFTyxPQUFPLENBQUMsSUFBSSxDQUFDWixRQUFRLEVBQUU7SUFDOUMsTUFBTSxJQUFJUyx3QkFBZ0IsQ0FBQyxpQkFBaUJYLElBQUksQ0FBQ2EsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7RUFDL0Q7O0VBRUE7RUFDQSxPQUFPRSxPQUFPLENBQUNDLEdBQUcsQ0FBQ1QsTUFBTSxFQUFFTyxPQUFPLENBQUMsR0FDL0JQLE1BQU0sQ0FBQ08sT0FBTyxDQUFDLEdBQ2ZYLFNBQVM7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU2MsUUFBUUEsQ0FDdEJsQixNQUFjLEVBQ2RDLElBQXVCLEVBQ3ZCQyxLQUFlLEVBQ047RUFDVCxPQUFPSCxFQUFFLENBQUNDLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsSUFBSSxDQUFDO0FBQ3RDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFiQSxJQUFBaUIsUUFBQSxHQUFBdkIsT0FBQSxDQUFBd0IsT0FBQSxHQWNlRixRQUFRIiwiaWdub3JlTGlzdCI6W119
//# sourceMappingURL=propAt.js.map