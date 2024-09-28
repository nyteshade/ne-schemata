"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WrappedResolverExecutionError = void 0;
var _neTagFns = require("ne-tag-fns");
var _BaseError = _interopRequireDefault(require("./BaseError.js"));
var _util = require("util");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// @ts-check

const isFn = o => /Function\]/.test(Object.prototype.toString.call(o));

/**
 * ExtendedResolvers wrap several functions including the original GraphQL
 * field resolver itself. If an exception is thrown by any of the internal
 * methods, this error can help resolve those problems.
 *
 * @class WrappedResolverExecutionError
 */
class WrappedResolverExecutionError extends _BaseError.default {
  /**
   * The `ExtendedResolver` object that caused the issue
   *
   * @type {ExtendedResolver}
   */

  /**
   * The index of the function that failed. This will help the programmer
   * determine the function that caused the error.
   *
   * @type {number}
   */

  /**
   * The arguments passed to the function in question that failed.
   *
   * @type {unknown[]}
   */

  /**
   * The `this` value passed to the function as it was executed. Note that
   * this value is irrelevant if the function passed was a big arrow function
   *
   * @type {unknown}
   */

  /**
   * The `results` value before the internal resolver that failed was thrown.
   * This does not include the results of the erroring function in question as
   * no value was ever reached before the exception was thrown (in theory)
   *
   * @type {unknown}
   */

  /**
   * Creates a new error instance of `WrappedResolverExecutionError`. The
   * arguments resolver, index, args and context all help the programmer
   * debug the issue in question should the error be thrown.
   *
   * @method constructor
   *
   * @param {Error|string} error the error thrown at the time of the problem
   * @param {ExtendedResolver} resolver the `ExtendedResolver` instance
   * @param {number} index the index of the wrapped resolver that threw up
   * @param {unknown[]} args the arguments passed to the function at the time
   * @param {unknown} context the `thisArg` set on the function call at the time
   * @param {unknown} results the results up to the time of failure
   */
  constructor(error, resolver, index, args, context, results) {
    super(error);
    this.resolver = resolver;
    this.index = index;
    this.args = args;
    this.context = context;
    this.results = results;
  }

  /**
   * Description of the WrappedResolverExecutionError error and likely cause
   * and fix.
   *
   * @return {string} a string denoting the purpose/cause of this error class
   */
  toString() {
    let fn = this.resolver && this.resolver.order && this.resolver.order[this.index];
    return (0, _neTagFns.dropLowest)`
      The ExtendedResolver execution failed. The resolver that failed was at
      index ${this.index}. The function had a name of '${fn && fn.name}'.

      Was the function likely a big arrow function? ${this.wasBigArrowFunction ? '\x1b[33mtrue\x1b[0m' : '\x1b[31mfalse\x1b[0m'}

      Arguments at the time were:
      ${(0, _util.inspect)(this.args, {
      colors: true,
      depth: 8
    })}

      Context at the time was:
      ${(0, _util.inspect)(this.context, {
      colors: true,
      depth: 8
    })}

      Results before the function was called
      ${(0, _util.inspect)(this.results, {
      colors: true,
      depth: 8
    })}

      Original Stack Trace
      ${this.error.toString()}
    `;
  }

  /**
   * Modify the `valueOf()` function to mirror the `toString()` functionality
   *
   * @return {string} an identical string to `.toString()`
   */
  valueOf() {
    return this.toString();
  }

  /**
   * A programmatic attempt to determine if the function that failed was a
   * big arrow function. This means the function was pre-bound and the
   * `context` set at the time of execution would have been ignored.
   *
   * @type {boolean}
   */
  get wasBigArrowFunction() {
    const resolver = this.resolver && this.resolver.order && this.resolver.order[this.index];
    if (resolver && isFn(resolver)) {
      return typeof resolver.prototype === 'undefined';
    }
    return false;
  }
}
exports.WrappedResolverExecutionError = WrappedResolverExecutionError;
var _default = exports.default = WrappedResolverExecutionError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbmVUYWdGbnMiLCJyZXF1aXJlIiwiX0Jhc2VFcnJvciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfdXRpbCIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImlzRm4iLCJvIiwidGVzdCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIldyYXBwZWRSZXNvbHZlckV4ZWN1dGlvbkVycm9yIiwiQmFzZUVycm9yIiwiY29uc3RydWN0b3IiLCJlcnJvciIsInJlc29sdmVyIiwiaW5kZXgiLCJhcmdzIiwiY29udGV4dCIsInJlc3VsdHMiLCJmbiIsIm9yZGVyIiwiZHJvcExvd2VzdCIsIm5hbWUiLCJ3YXNCaWdBcnJvd0Z1bmN0aW9uIiwiaW5zcGVjdCIsImNvbG9ycyIsImRlcHRoIiwidmFsdWVPZiIsImV4cG9ydHMiLCJfZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvV3JhcHBlZFJlc29sdmVyRXhlY3V0aW9uRXJyb3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCB7IGlubGluZSwgZHJvcExvd2VzdCB9IGZyb20gJ25lLXRhZy1mbnMnXG5pbXBvcnQgQmFzZUVycm9yIGZyb20gJy4vQmFzZUVycm9yLmpzJ1xuaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnXG5cbmNvbnN0IGlzRm4gPSAobykgPT4gL0Z1bmN0aW9uXFxdLy50ZXN0KE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSlcblxuLyoqXG4gKiBFeHRlbmRlZFJlc29sdmVycyB3cmFwIHNldmVyYWwgZnVuY3Rpb25zIGluY2x1ZGluZyB0aGUgb3JpZ2luYWwgR3JhcGhRTFxuICogZmllbGQgcmVzb2x2ZXIgaXRzZWxmLiBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGFueSBvZiB0aGUgaW50ZXJuYWxcbiAqIG1ldGhvZHMsIHRoaXMgZXJyb3IgY2FuIGhlbHAgcmVzb2x2ZSB0aG9zZSBwcm9ibGVtcy5cbiAqXG4gKiBAY2xhc3MgV3JhcHBlZFJlc29sdmVyRXhlY3V0aW9uRXJyb3JcbiAqL1xuZXhwb3J0IGNsYXNzIFdyYXBwZWRSZXNvbHZlckV4ZWN1dGlvbkVycm9yIGV4dGVuZHMgQmFzZUVycm9yIHtcbiAgLyoqXG4gICAqIFRoZSBgRXh0ZW5kZWRSZXNvbHZlcmAgb2JqZWN0IHRoYXQgY2F1c2VkIHRoZSBpc3N1ZVxuICAgKlxuICAgKiBAdHlwZSB7RXh0ZW5kZWRSZXNvbHZlcn1cbiAgICovXG4gIHJlc29sdmVyOiBFeHRlbmRlZFJlc29sdmVyXG5cbiAgLyoqXG4gICAqIFRoZSBpbmRleCBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmYWlsZWQuIFRoaXMgd2lsbCBoZWxwIHRoZSBwcm9ncmFtbWVyXG4gICAqIGRldGVybWluZSB0aGUgZnVuY3Rpb24gdGhhdCBjYXVzZWQgdGhlIGVycm9yLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgaW5kZXg7XG5cbiAgLyoqXG4gICAqIFRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbiBpbiBxdWVzdGlvbiB0aGF0IGZhaWxlZC5cbiAgICpcbiAgICogQHR5cGUge3Vua25vd25bXX1cbiAgICovXG4gIGFyZ3M7XG5cbiAgLyoqXG4gICAqIFRoZSBgdGhpc2AgdmFsdWUgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbiBhcyBpdCB3YXMgZXhlY3V0ZWQuIE5vdGUgdGhhdFxuICAgKiB0aGlzIHZhbHVlIGlzIGlycmVsZXZhbnQgaWYgdGhlIGZ1bmN0aW9uIHBhc3NlZCB3YXMgYSBiaWcgYXJyb3cgZnVuY3Rpb25cbiAgICpcbiAgICogQHR5cGUge3Vua25vd259XG4gICAqL1xuICBjb250ZXh0O1xuXG4gIC8qKlxuICAgKiBUaGUgYHJlc3VsdHNgIHZhbHVlIGJlZm9yZSB0aGUgaW50ZXJuYWwgcmVzb2x2ZXIgdGhhdCBmYWlsZWQgd2FzIHRocm93bi5cbiAgICogVGhpcyBkb2VzIG5vdCBpbmNsdWRlIHRoZSByZXN1bHRzIG9mIHRoZSBlcnJvcmluZyBmdW5jdGlvbiBpbiBxdWVzdGlvbiBhc1xuICAgKiBubyB2YWx1ZSB3YXMgZXZlciByZWFjaGVkIGJlZm9yZSB0aGUgZXhjZXB0aW9uIHdhcyB0aHJvd24gKGluIHRoZW9yeSlcbiAgICpcbiAgICogQHR5cGUge3Vua25vd259XG4gICAqL1xuICByZXN1bHRzXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZXJyb3IgaW5zdGFuY2Ugb2YgYFdyYXBwZWRSZXNvbHZlckV4ZWN1dGlvbkVycm9yYC4gVGhlXG4gICAqIGFyZ3VtZW50cyByZXNvbHZlciwgaW5kZXgsIGFyZ3MgYW5kIGNvbnRleHQgYWxsIGhlbHAgdGhlIHByb2dyYW1tZXJcbiAgICogZGVidWcgdGhlIGlzc3VlIGluIHF1ZXN0aW9uIHNob3VsZCB0aGUgZXJyb3IgYmUgdGhyb3duLlxuICAgKlxuICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7RXJyb3J8c3RyaW5nfSBlcnJvciB0aGUgZXJyb3IgdGhyb3duIGF0IHRoZSB0aW1lIG9mIHRoZSBwcm9ibGVtXG4gICAqIEBwYXJhbSB7RXh0ZW5kZWRSZXNvbHZlcn0gcmVzb2x2ZXIgdGhlIGBFeHRlbmRlZFJlc29sdmVyYCBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggdGhlIGluZGV4IG9mIHRoZSB3cmFwcGVkIHJlc29sdmVyIHRoYXQgdGhyZXcgdXBcbiAgICogQHBhcmFtIHt1bmtub3duW119IGFyZ3MgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uIGF0IHRoZSB0aW1lXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB0aGUgYHRoaXNBcmdgIHNldCBvbiB0aGUgZnVuY3Rpb24gY2FsbCBhdCB0aGUgdGltZVxuICAgKiBAcGFyYW0ge3Vua25vd259IHJlc3VsdHMgdGhlIHJlc3VsdHMgdXAgdG8gdGhlIHRpbWUgb2YgZmFpbHVyZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3IsIHJlc29sdmVyLCBpbmRleCwgYXJncywgY29udGV4dCwgcmVzdWx0cykge1xuICAgIHN1cGVyKGVycm9yKVxuXG4gICAgdGhpcy5yZXNvbHZlciA9IHJlc29sdmVyXG4gICAgdGhpcy5pbmRleCA9IGluZGV4XG4gICAgdGhpcy5hcmdzID0gYXJnc1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzXG4gIH1cblxuICAvKipcbiAgICogRGVzY3JpcHRpb24gb2YgdGhlIFdyYXBwZWRSZXNvbHZlckV4ZWN1dGlvbkVycm9yIGVycm9yIGFuZCBsaWtlbHkgY2F1c2VcbiAgICogYW5kIGZpeC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBhIHN0cmluZyBkZW5vdGluZyB0aGUgcHVycG9zZS9jYXVzZSBvZiB0aGlzIGVycm9yIGNsYXNzXG4gICAqL1xuICB0b1N0cmluZygpIHtcbiAgICBsZXQgZm46IEZ1bmN0aW9uID0gKFxuICAgICAgdGhpcy5yZXNvbHZlciAmJlxuICAgICAgdGhpcy5yZXNvbHZlci5vcmRlciAmJlxuICAgICAgdGhpcy5yZXNvbHZlci5vcmRlclt0aGlzLmluZGV4XVxuICAgIClcblxuICAgIHJldHVybiBkcm9wTG93ZXN0YFxuICAgICAgVGhlIEV4dGVuZGVkUmVzb2x2ZXIgZXhlY3V0aW9uIGZhaWxlZC4gVGhlIHJlc29sdmVyIHRoYXQgZmFpbGVkIHdhcyBhdFxuICAgICAgaW5kZXggJHt0aGlzLmluZGV4fS4gVGhlIGZ1bmN0aW9uIGhhZCBhIG5hbWUgb2YgJyR7Zm4gJiYgZm4ubmFtZX0nLlxuXG4gICAgICBXYXMgdGhlIGZ1bmN0aW9uIGxpa2VseSBhIGJpZyBhcnJvdyBmdW5jdGlvbj8gJHtcbiAgICAgICAgKHRoaXMud2FzQmlnQXJyb3dGdW5jdGlvblxuICAgICAgICAgID8gJ1xceDFiWzMzbXRydWVcXHgxYlswbSdcbiAgICAgICAgICA6ICdcXHgxYlszMW1mYWxzZVxceDFiWzBtJ1xuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIEFyZ3VtZW50cyBhdCB0aGUgdGltZSB3ZXJlOlxuICAgICAgJHtpbnNwZWN0KHRoaXMuYXJncywge2NvbG9yczogdHJ1ZSwgZGVwdGg6IDh9KX1cblxuICAgICAgQ29udGV4dCBhdCB0aGUgdGltZSB3YXM6XG4gICAgICAke2luc3BlY3QodGhpcy5jb250ZXh0LCB7Y29sb3JzOiB0cnVlLCBkZXB0aDogOH0pfVxuXG4gICAgICBSZXN1bHRzIGJlZm9yZSB0aGUgZnVuY3Rpb24gd2FzIGNhbGxlZFxuICAgICAgJHtpbnNwZWN0KHRoaXMucmVzdWx0cywge2NvbG9yczogdHJ1ZSwgZGVwdGg6IDh9KX1cblxuICAgICAgT3JpZ2luYWwgU3RhY2sgVHJhY2VcbiAgICAgICR7dGhpcy5lcnJvci50b1N0cmluZygpfVxuICAgIGBcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RpZnkgdGhlIGB2YWx1ZU9mKClgIGZ1bmN0aW9uIHRvIG1pcnJvciB0aGUgYHRvU3RyaW5nKClgIGZ1bmN0aW9uYWxpdHlcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBhbiBpZGVudGljYWwgc3RyaW5nIHRvIGAudG9TdHJpbmcoKWBcbiAgICovXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcHJvZ3JhbW1hdGljIGF0dGVtcHQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBmdW5jdGlvbiB0aGF0IGZhaWxlZCB3YXMgYVxuICAgKiBiaWcgYXJyb3cgZnVuY3Rpb24uIFRoaXMgbWVhbnMgdGhlIGZ1bmN0aW9uIHdhcyBwcmUtYm91bmQgYW5kIHRoZVxuICAgKiBgY29udGV4dGAgc2V0IGF0IHRoZSB0aW1lIG9mIGV4ZWN1dGlvbiB3b3VsZCBoYXZlIGJlZW4gaWdub3JlZC5cbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgd2FzQmlnQXJyb3dGdW5jdGlvbigpIHtcbiAgICBjb25zdCByZXNvbHZlciA9IChcbiAgICAgIHRoaXMucmVzb2x2ZXIgJiZcbiAgICAgIHRoaXMucmVzb2x2ZXIub3JkZXIgJiZcbiAgICAgIHRoaXMucmVzb2x2ZXIub3JkZXJbdGhpcy5pbmRleF1cbiAgICApXG5cbiAgICBpZiAocmVzb2x2ZXIgJiYgaXNGbihyZXNvbHZlcikpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgcmVzb2x2ZXIucHJvdG90eXBlID09PSAndW5kZWZpbmVkJ1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdyYXBwZWRSZXNvbHZlckV4ZWN1dGlvbkVycm9yXG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFHLEtBQUEsR0FBQUgsT0FBQTtBQUE4QixTQUFBRSx1QkFBQUUsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLEtBQUFFLE9BQUEsRUFBQUYsQ0FBQTtBQUo5Qjs7QUFNQSxNQUFNRyxJQUFJLEdBQUlDLENBQUMsSUFBSyxZQUFZLENBQUNDLElBQUksQ0FBQ0MsTUFBTSxDQUFDQyxTQUFTLENBQUNDLFFBQVEsQ0FBQ0MsSUFBSSxDQUFDTCxDQUFDLENBQUMsQ0FBQzs7QUFFeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNTSw2QkFBNkIsU0FBU0Msa0JBQVMsQ0FBQztFQUMzRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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
//# sourceMappingURL=WrappedResolverExecutionError.js.map