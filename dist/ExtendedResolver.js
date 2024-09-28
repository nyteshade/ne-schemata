"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolver = void 0;
var _graphql = require("graphql");
var _Schemata = require("./Schemata");
var _errors = require("./errors");
// @ts-check

const original = Symbol('Original Resolver');
const listing = Symbol('List of Resolvers');
const patcher = Symbol('Resolver Result Patcher');

// $FlowIgnore[method-unbinding]
const isFn = o => /Function\]/.test(Object.prototype.toString.call(o));

/**
 * Higher order, or wrapped, GraphQL field resolvers are a technique that
 * is becoming increasingly common these days. This class attempts to wrap
 * that in such a manner that it allows a bit of extensibility.
 *
 * @extends Function
 */
class ExtendedResolver extends Function {
  /**
   * Creates a new instance of `ExtendedResolver` for use with GraphQL. If
   * the supplied resolver is already an instance of `ExtendedResolver`, its
   * internal nested resolvers are copied, alongside the rest of the custom
   * properties that make up an instance of `ExtendedResolver`
   *
   * @since 1.9
   *
   * @param {GraphQLFieldResolver} resolver a normal GraphQLFieldResolver
   * function. By default, the `defaultFieldResolver` is used if no other
   * value is supplied
   */
  constructor(resolver = _graphql.defaultFieldResolver) {
    super();
    if (resolver instanceof ExtendedResolver) {
      this[listing] = Array.from(resolver[listing]);
      this[original] = resolver[original];
      this[patcher] = resolver[patcher];
    } else {
      this[listing] = [resolver];
      this[original] = resolver;
      this[patcher] = null;
    }
    return new Proxy(this, ExtendedResolver.handler);
  }

  // Properties

  /**
   * Returns a handle to the internal array of ordered resolver
   * functions, should indepth modification be necessary.
   *
   * @return  {Array<GraphQLFieldResolver>} the internal list of
   * resolvers to execute in order as though it were a single resolver
   */
  get order() {
    return this[listing];
  }

  /**
   * An accessor that writes a new resolver to the internal list of
   * resolvers that combine into a single resolver for inclusion elsewhere.
   *
   * TODO come up with some ideas on how to handle setting of this list
   * when the list no longer contains the original. Throw error? Log? Add it
   * to the end? Allow all in some configurable manner?
   *
   * @param  {Array<GraphQLFieldResolver>} value the new array
   */
  set order(value) {
    this[listing] = value;
  }

  /**
   * Retrieve the internal result value patcher function. By default, this
   * value is null and nonexistent. When present, it is a function that will
   * be called after all internal resolvers have done their work but before
   * those results are returned to the calling function.
   *
   * The function takes as its only parameter the culmination of results from
   * the internal resolvers work. Whatever is returned from this function is
   * returned as the final results.
   *
   * @return {ResolverResultsPatcher} a function or null
   */
  get resultPatcher() {
    return this[patcher];
  }

  /**
   * Sets the internal patcher function.
   *
   * @see resultPatcher getter above
   * @param {ResolverResultsPatcher} value a new patcher function
   */
  set resultPatcher(value) {
    this[patcher] = value;
  }

  /**
   * A getter that retrieves the original resolver from within the
   * `ExtendedResolver` instance.
   *
   * @method original
   * @readonly
   *
   * @return {GraphQLFieldResolver} the originally wrapped field resolver
   */
  get original() {
    return this[original];
  }

  /**
   * The dynamic index of the original resolver inside the internal listing.
   * As prepended and appended resolvers are added to the `ExtendedResolver`,
   * this value will change.
   *
   * @method originalIndex
   * @readonly
   *
   * @return {number} the numeric index of the original resolver within the
   * internal listing. -1 indicates that the original resolver is missing
   * which, in and of itself, indicates an invalid state.
   */
  get originalIndex() {
    return this[listing].indexOf(this[original]);
  }

  // Methods

  /**
   * Guaranteed to insert the supplied field resolver after any other prepended
   * field resolvers and before the original internal field resolver.
   *
   * @param {GraphQLFieldResolver} preresolver a field resolver to run before
   * the original field resolver executes.
   */
  prepend(preresolver) {
    if (preresolver && isFn(preresolver)) {
      let index = this[listing].indexOf(this[original]);
      index = ~index ? index : 0;
      this[listing].splice(index, 0, preresolver);
    }
  }

  /**
   * Inserts the supplied field resolver function after the original resolver
   * but before any previously added post resolvers. If you simply wish to
   * push another entry to the list, use `.push`
   *
   * @param {GraphQLFieldResolver} postresolver a field resolver that should
   * run after the original but before other postresolvers previously added.
   */
  append(postresolver) {
    if (postresolver && isFn(postresolver)) {
      let index = this[listing].indexOf(this[original]);
      index = ~index ? index + 1 : this[listing].length;
      this[listing].splice(index, 0, postresolver);
    }
  }

  /**
   * Simply adds a field resolver to the end of the list rather than trying
   * to put it as close to the original resolver as possible.
   *
   * @param {GraphQLFieldResolver} postresolver a field resolver that should
   * run after the original
   */
  push(postresolver) {
    if (postresolver && isFn(postresolver)) {
      this[listing].push(postresolver);
    }
  }

  /**
   * The `.toString()` functionality of the ExtendedResolver dutifily lists the
   * source of each function to be executed in order.
   *
   * @method toString
   *
   * @return {string} a combined toString() functionality for each item in
   * order
   */
  toString() {
    let strings = [];
    for (let fn of this.order) {
      strings.push(`Function: ${fn.name}`);
      strings.push(`---------${'-'.repeat(fn.name.length ? fn.name.length + 1 : 0)}`);
      strings.push(fn.toString());
      strings.push('');
    }
    return strings.join('\n');
  }

  /**
   * After having to repeatedly console.log the toString output, this function
   * now does that easier for me so I don't end up with carpal tunnel earlier
   * than necessary.
   *
   * @method show
   */
  show() {
    console.log(this.toString());
  }

  // Symbols

  /**
   * Ensure that when inspected with Object.prototype.toString.call/apply
   * that instances of ExtendedResolver return `'[object ExtendedResolver]'`
   *
   * @type {Symbol}
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }

  // Statics

  /**
   * Shorthand static initializer that allows the ExtendedResolver class to
   * be instantiated using `ExtendedResolver.from()` rather than the normal
   * `new ExtendedResolver()`. Additionally it offers a way to set a result
   * patcher after initialization has occurred
   *
   * @param {GraphQLFieldResolver} resolver the resolver to initialize the
   * class instance with.
   * @param {ResolverResultsPatcher} patcher an optional function matching the
   * `ResolverResultsPatcher` signature to set to the new instance after it is
   * created.
   * @return {ExtendedResolver} a newly minted instance of the class
   * `ExtendedResolver`
   */
  static from(resolver, patcher) {
    let newResolver = new ExtendedResolver(resolver);
    if (patcher) {
      newResolver.resultPatcher = patcher;
    }
    return newResolver;
  }

  /**
   * Similar to the `.from` static initializer, the `.wrap` initializer
   * takes an original field resolver, an optional patcher as in `.from`
   * as well as an array of `prepends` and `appends` field resolvers which
   * will be slotted in the appropriate locations.
   *
   * @param  {GraphQLFieldResolver} original a field resolver function that
   * is to be wrapped as the basis for the resulting `ExtendedResolver`
   * @param {ResolverResultsPatcher} patcher an optional function that allows
   * the user to patch the results of the total field resolver culmination
   * before allowing the calling code to see them.
   * @param {GraphQLFieldResolver|Array<GraphQLFieldResolver>} prepends either
   * a single GraphQLFieldResolver or an array of them to prepend before the
   * original field resolver executes
   * @param {GraphQLFieldResolver|Array<GraphQLFieldResolver>} appends either
   * a single GraphQLFieldResolver or an array of them to prepend after the
   * original field resolver executes
   * @return {[type]}          [description]
   */
  static wrap(original, prepends = [], appends = [], patcher = null) {
    let resolver = ExtendedResolver.from(original);
    if (patcher && isFn(patcher)) {
      resolver.resultPatcher = patcher;
    }
    if (prepends) {
      if (!Array.isArray(prepends)) {
        prepends = [prepends];
      }
      if (prepends.length) {
        prepends.forEach(fn => resolver.prepend(fn));
      }
    }
    if (appends) {
      if (!Array.isArray(appends)) {
        appends = [appends];
      }
      if (appends.length) {
        appends.forEach(fn => resolver.append(fn));
      }
    }
    return resolver;
  }

  /**
   * In the process of schema stitching, it is possible and likely that
   * a given schema has been extended or enlarged during the merging process
   * with another schema. Neither of the old schemas have any idea of the
   * layout of the newer, grander, schema. Therefore it is necessary to
   * inject the new GraphQLSchema as part of the info parameters received
   * by the resolver for both sides of the stitched schema in order to
   * prevent errors.
   *
   * This static method takes the original resolver, wraps it with a
   * prepended resolver that injects the new schema; also supplied as the
   * second parameter. The result is a newly minted `ExtendedResolver` that
   * should do the job in question.
   *
   * @param {GraphQLFieldResolver} originalResolver the original resolver todo
   * wrap.
   * @param {GraphQLSchema} newSchema the new, grander, schema with all fields
   * @param {ResolverResultsPatcher} patcher a function that will allow you to
   * modify the
   */
  static SchemaInjector(originalResolver, newSchema, patcher = undefined) {
    return ExtendedResolver.wrap(originalResolver, [function SchemaInjector(source, args, context, info) {
      if (arguments.length === 3 && context.schema) {
        context.schema = newSchema;
        context.rootValue = (0, _Schemata.stripResolversFromSchema)(newSchema);
      } else if (arguments.length === 4 && info.schema) {
        info.schema = newSchema;
        info.rootValue = (0, _Schemata.stripResolversFromSchema)(newSchema);
      }
    }], [], patcher);
  }

  /**
   * All instances of `ExtendedResolver` are Proxies to the instantiated
   * class with a specially defined `.apply` handler to make their custom
   * execution flow work.
   *
   * @type {Object}
   */
  static get handler() {
    return {
      /**
       * Reduce the results of each resolver in the list, including
       * the original resolver. Calling each in order with the same
       * parameters and returning the coalesced results
       *
       * @param {mixed} target this should always be the object context
       * @param {mixed} thisArg the `this` object for the context of the
       * function calls
       * @param {Array<mixed>} args the arguments object as seen in all
       * graphql resolvers
       * @return {mixed} either null or some value as would have been returned
       * from the call of a graphql field resolver
       */
      async apply(target, thisArg, args) {
        // Ensure we have arguments as an array so we can concat results in
        // each pass of the reduction process
        let myArgs = Array.isArray(args) ? args : Array.from(args && args || []);
        let results = {};
        let result;
        for (let fn of target[listing]) {
          try {
            result = await fn.apply(thisArg || target, myArgs.concat(results));
          } catch (error) {
            throw new _errors.WrappedResolverExecutionError(error, this, target[listing].indexOf(fn), myArgs.concat(results), thisArg || target);
          }
          if (results && results instanceof Object && result && result instanceof Object) {
            Object.assign(results, result);
          } else {
            results = result;
          }
        }
        if (target[patcher] && target[patcher] instanceof Function) {
          try {
            results = await target[patcher].call(thisArg || target, results);
          } catch (error) {
            throw new _errors.ResolverResultsPatcherError(error, target[patcher], thisArg || target, results);
          }
        }
        return results;
      }
    };
  }
}
exports.ExtendedResolver = ExtendedResolver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZ3JhcGhxbCIsInJlcXVpcmUiLCJfU2NoZW1hdGEiLCJfZXJyb3JzIiwib3JpZ2luYWwiLCJTeW1ib2wiLCJsaXN0aW5nIiwicGF0Y2hlciIsImlzRm4iLCJvIiwidGVzdCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkV4dGVuZGVkUmVzb2x2ZXIiLCJGdW5jdGlvbiIsImNvbnN0cnVjdG9yIiwicmVzb2x2ZXIiLCJkZWZhdWx0RmllbGRSZXNvbHZlciIsIkFycmF5IiwiZnJvbSIsIlByb3h5IiwiaGFuZGxlciIsIm9yZGVyIiwidmFsdWUiLCJyZXN1bHRQYXRjaGVyIiwib3JpZ2luYWxJbmRleCIsImluZGV4T2YiLCJwcmVwZW5kIiwicHJlcmVzb2x2ZXIiLCJpbmRleCIsInNwbGljZSIsImFwcGVuZCIsInBvc3RyZXNvbHZlciIsImxlbmd0aCIsInB1c2giLCJzdHJpbmdzIiwiZm4iLCJuYW1lIiwicmVwZWF0Iiwiam9pbiIsInNob3ciLCJjb25zb2xlIiwibG9nIiwidG9TdHJpbmdUYWciLCJuZXdSZXNvbHZlciIsIndyYXAiLCJwcmVwZW5kcyIsImFwcGVuZHMiLCJpc0FycmF5IiwiZm9yRWFjaCIsIlNjaGVtYUluamVjdG9yIiwib3JpZ2luYWxSZXNvbHZlciIsIm5ld1NjaGVtYSIsInVuZGVmaW5lZCIsInNvdXJjZSIsImFyZ3MiLCJjb250ZXh0IiwiaW5mbyIsImFyZ3VtZW50cyIsInNjaGVtYSIsInJvb3RWYWx1ZSIsInN0cmlwUmVzb2x2ZXJzRnJvbVNjaGVtYSIsImFwcGx5IiwidGFyZ2V0IiwidGhpc0FyZyIsIm15QXJncyIsInJlc3VsdHMiLCJyZXN1bHQiLCJjb25jYXQiLCJlcnJvciIsIldyYXBwZWRSZXNvbHZlckV4ZWN1dGlvbkVycm9yIiwiYXNzaWduIiwiUmVzb2x2ZXJSZXN1bHRzUGF0Y2hlckVycm9yIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uL3NyYy9FeHRlbmRlZFJlc29sdmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1jaGVja1xuXG5pbXBvcnQgeyBkZWZhdWx0RmllbGRSZXNvbHZlciB9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgeyBzdHJpcFJlc29sdmVyc0Zyb21TY2hlbWEgfSBmcm9tICcuL1NjaGVtYXRhJ1xuaW1wb3J0IHtcbiAgV3JhcHBlZFJlc29sdmVyRXhlY3V0aW9uRXJyb3IsXG4gIFJlc29sdmVyUmVzdWx0c1BhdGNoZXJFcnJvclxufSBmcm9tICcuL2Vycm9ycydcblxuaW1wb3J0IHR5cGUgeyBSZXNvbHZlclJlc3VsdHNQYXRjaGVyIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7XG4gIEdyYXBoUUxGaWVsZFJlc29sdmVyLFxuICBHcmFwaFFMUmVzb2x2ZUluZm8sXG4gIEdyYXBoUUxTY2hlbWEsXG59IGZyb20gJ2dyYXBocWwnXG5cbmNvbnN0IG9yaWdpbmFsID0gU3ltYm9sKCdPcmlnaW5hbCBSZXNvbHZlcicpXG5jb25zdCBsaXN0aW5nID0gU3ltYm9sKCdMaXN0IG9mIFJlc29sdmVycycpXG5jb25zdCBwYXRjaGVyID0gU3ltYm9sKCdSZXNvbHZlciBSZXN1bHQgUGF0Y2hlcicpXG5cbi8vICRGbG93SWdub3JlW21ldGhvZC11bmJpbmRpbmddXG5jb25zdCBpc0ZuID0gKG86IGFueSkgPT4gL0Z1bmN0aW9uXFxdLy50ZXN0KE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSlcblxuLyoqXG4gKiBIaWdoZXIgb3JkZXIsIG9yIHdyYXBwZWQsIEdyYXBoUUwgZmllbGQgcmVzb2x2ZXJzIGFyZSBhIHRlY2huaXF1ZSB0aGF0XG4gKiBpcyBiZWNvbWluZyBpbmNyZWFzaW5nbHkgY29tbW9uIHRoZXNlIGRheXMuIFRoaXMgY2xhc3MgYXR0ZW1wdHMgdG8gd3JhcFxuICogdGhhdCBpbiBzdWNoIGEgbWFubmVyIHRoYXQgaXQgYWxsb3dzIGEgYml0IG9mIGV4dGVuc2liaWxpdHkuXG4gKlxuICogQGV4dGVuZHMgRnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEV4dGVuZGVkUmVzb2x2ZXIgZXh0ZW5kcyBGdW5jdGlvbiB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGBFeHRlbmRlZFJlc29sdmVyYCBmb3IgdXNlIHdpdGggR3JhcGhRTC4gSWZcbiAgICogdGhlIHN1cHBsaWVkIHJlc29sdmVyIGlzIGFscmVhZHkgYW4gaW5zdGFuY2Ugb2YgYEV4dGVuZGVkUmVzb2x2ZXJgLCBpdHNcbiAgICogaW50ZXJuYWwgbmVzdGVkIHJlc29sdmVycyBhcmUgY29waWVkLCBhbG9uZ3NpZGUgdGhlIHJlc3Qgb2YgdGhlIGN1c3RvbVxuICAgKiBwcm9wZXJ0aWVzIHRoYXQgbWFrZSB1cCBhbiBpbnN0YW5jZSBvZiBgRXh0ZW5kZWRSZXNvbHZlcmBcbiAgICpcbiAgICogQHNpbmNlIDEuOVxuICAgKlxuICAgKiBAcGFyYW0ge0dyYXBoUUxGaWVsZFJlc29sdmVyfSByZXNvbHZlciBhIG5vcm1hbCBHcmFwaFFMRmllbGRSZXNvbHZlclxuICAgKiBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGBkZWZhdWx0RmllbGRSZXNvbHZlcmAgaXMgdXNlZCBpZiBubyBvdGhlclxuICAgKiB2YWx1ZSBpcyBzdXBwbGllZFxuICAgKi9cbiAgY29uc3RydWN0b3IocmVzb2x2ZXI6IEdyYXBoUUxGaWVsZFJlc29sdmVyID0gZGVmYXVsdEZpZWxkUmVzb2x2ZXIpIHtcbiAgICBzdXBlcigpXG5cbiAgICBpZiAocmVzb2x2ZXIgaW5zdGFuY2VvZiBFeHRlbmRlZFJlc29sdmVyKSB7XG4gICAgICB0aGlzW2xpc3RpbmddID0gQXJyYXkuZnJvbShyZXNvbHZlcltsaXN0aW5nXSlcbiAgICAgIHRoaXNbb3JpZ2luYWxdID0gcmVzb2x2ZXJbb3JpZ2luYWxdXG4gICAgICB0aGlzW3BhdGNoZXJdID0gcmVzb2x2ZXJbcGF0Y2hlcl1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzW2xpc3RpbmddID0gW3Jlc29sdmVyXVxuICAgICAgdGhpc1tvcmlnaW5hbF0gPSByZXNvbHZlclxuICAgICAgdGhpc1twYXRjaGVyXSA9IG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIEV4dGVuZGVkUmVzb2x2ZXIuaGFuZGxlcilcbiAgfVxuXG4gIC8vIFByb3BlcnRpZXNcblxuICAvKipcbiAgICogUmV0dXJucyBhIGhhbmRsZSB0byB0aGUgaW50ZXJuYWwgYXJyYXkgb2Ygb3JkZXJlZCByZXNvbHZlclxuICAgKiBmdW5jdGlvbnMsIHNob3VsZCBpbmRlcHRoIG1vZGlmaWNhdGlvbiBiZSBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEByZXR1cm4gIHtBcnJheTxHcmFwaFFMRmllbGRSZXNvbHZlcj59IHRoZSBpbnRlcm5hbCBsaXN0IG9mXG4gICAqIHJlc29sdmVycyB0byBleGVjdXRlIGluIG9yZGVyIGFzIHRob3VnaCBpdCB3ZXJlIGEgc2luZ2xlIHJlc29sdmVyXG4gICAqL1xuICBnZXQgb3JkZXIoKTogQXJyYXk8R3JhcGhRTEZpZWxkUmVzb2x2ZXI+IHtcbiAgICByZXR1cm4gdGhpc1tsaXN0aW5nXVxuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFjY2Vzc29yIHRoYXQgd3JpdGVzIGEgbmV3IHJlc29sdmVyIHRvIHRoZSBpbnRlcm5hbCBsaXN0IG9mXG4gICAqIHJlc29sdmVycyB0aGF0IGNvbWJpbmUgaW50byBhIHNpbmdsZSByZXNvbHZlciBmb3IgaW5jbHVzaW9uIGVsc2V3aGVyZS5cbiAgICpcbiAgICogVE9ETyBjb21lIHVwIHdpdGggc29tZSBpZGVhcyBvbiBob3cgdG8gaGFuZGxlIHNldHRpbmcgb2YgdGhpcyBsaXN0XG4gICAqIHdoZW4gdGhlIGxpc3Qgbm8gbG9uZ2VyIGNvbnRhaW5zIHRoZSBvcmlnaW5hbC4gVGhyb3cgZXJyb3I/IExvZz8gQWRkIGl0XG4gICAqIHRvIHRoZSBlbmQ/IEFsbG93IGFsbCBpbiBzb21lIGNvbmZpZ3VyYWJsZSBtYW5uZXI/XG4gICAqXG4gICAqIEBwYXJhbSAge0FycmF5PEdyYXBoUUxGaWVsZFJlc29sdmVyPn0gdmFsdWUgdGhlIG5ldyBhcnJheVxuICAgKi9cbiAgc2V0IG9yZGVyKHZhbHVlOiBBcnJheTxHcmFwaFFMRmllbGRSZXNvbHZlcj4pIHtcbiAgICB0aGlzW2xpc3RpbmddID0gdmFsdWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgaW50ZXJuYWwgcmVzdWx0IHZhbHVlIHBhdGNoZXIgZnVuY3Rpb24uIEJ5IGRlZmF1bHQsIHRoaXNcbiAgICogdmFsdWUgaXMgbnVsbCBhbmQgbm9uZXhpc3RlbnQuIFdoZW4gcHJlc2VudCwgaXQgaXMgYSBmdW5jdGlvbiB0aGF0IHdpbGxcbiAgICogYmUgY2FsbGVkIGFmdGVyIGFsbCBpbnRlcm5hbCByZXNvbHZlcnMgaGF2ZSBkb25lIHRoZWlyIHdvcmsgYnV0IGJlZm9yZVxuICAgKiB0aG9zZSByZXN1bHRzIGFyZSByZXR1cm5lZCB0byB0aGUgY2FsbGluZyBmdW5jdGlvbi5cbiAgICpcbiAgICogVGhlIGZ1bmN0aW9uIHRha2VzIGFzIGl0cyBvbmx5IHBhcmFtZXRlciB0aGUgY3VsbWluYXRpb24gb2YgcmVzdWx0cyBmcm9tXG4gICAqIHRoZSBpbnRlcm5hbCByZXNvbHZlcnMgd29yay4gV2hhdGV2ZXIgaXMgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzXG4gICAqIHJldHVybmVkIGFzIHRoZSBmaW5hbCByZXN1bHRzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtSZXNvbHZlclJlc3VsdHNQYXRjaGVyfSBhIGZ1bmN0aW9uIG9yIG51bGxcbiAgICovXG4gIGdldCByZXN1bHRQYXRjaGVyKCk6IFJlc29sdmVyUmVzdWx0c1BhdGNoZXIge1xuICAgIHJldHVybiB0aGlzW3BhdGNoZXJdXG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW50ZXJuYWwgcGF0Y2hlciBmdW5jdGlvbi5cbiAgICpcbiAgICogQHNlZSByZXN1bHRQYXRjaGVyIGdldHRlciBhYm92ZVxuICAgKiBAcGFyYW0ge1Jlc29sdmVyUmVzdWx0c1BhdGNoZXJ9IHZhbHVlIGEgbmV3IHBhdGNoZXIgZnVuY3Rpb25cbiAgICovXG4gIHNldCByZXN1bHRQYXRjaGVyKHZhbHVlOiBSZXNvbHZlclJlc3VsdHNQYXRjaGVyKSB7XG4gICAgdGhpc1twYXRjaGVyXSA9IHZhbHVlXG4gIH1cblxuICAvKipcbiAgICogQSBnZXR0ZXIgdGhhdCByZXRyaWV2ZXMgdGhlIG9yaWdpbmFsIHJlc29sdmVyIGZyb20gd2l0aGluIHRoZVxuICAgKiBgRXh0ZW5kZWRSZXNvbHZlcmAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBtZXRob2Qgb3JpZ2luYWxcbiAgICogQHJlYWRvbmx5XG4gICAqXG4gICAqIEByZXR1cm4ge0dyYXBoUUxGaWVsZFJlc29sdmVyfSB0aGUgb3JpZ2luYWxseSB3cmFwcGVkIGZpZWxkIHJlc29sdmVyXG4gICAqL1xuICBnZXQgb3JpZ2luYWwoKTogR3JhcGhRTEZpZWxkUmVzb2x2ZXIge1xuICAgIHJldHVybiB0aGlzW29yaWdpbmFsXVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkeW5hbWljIGluZGV4IG9mIHRoZSBvcmlnaW5hbCByZXNvbHZlciBpbnNpZGUgdGhlIGludGVybmFsIGxpc3RpbmcuXG4gICAqIEFzIHByZXBlbmRlZCBhbmQgYXBwZW5kZWQgcmVzb2x2ZXJzIGFyZSBhZGRlZCB0byB0aGUgYEV4dGVuZGVkUmVzb2x2ZXJgLFxuICAgKiB0aGlzIHZhbHVlIHdpbGwgY2hhbmdlLlxuICAgKlxuICAgKiBAbWV0aG9kIG9yaWdpbmFsSW5kZXhcbiAgICogQHJlYWRvbmx5XG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWVyaWMgaW5kZXggb2YgdGhlIG9yaWdpbmFsIHJlc29sdmVyIHdpdGhpbiB0aGVcbiAgICogaW50ZXJuYWwgbGlzdGluZy4gLTEgaW5kaWNhdGVzIHRoYXQgdGhlIG9yaWdpbmFsIHJlc29sdmVyIGlzIG1pc3NpbmdcbiAgICogd2hpY2gsIGluIGFuZCBvZiBpdHNlbGYsIGluZGljYXRlcyBhbiBpbnZhbGlkIHN0YXRlLlxuICAgKi9cbiAgZ2V0IG9yaWdpbmFsSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpc1tsaXN0aW5nXS5pbmRleE9mKHRoaXNbb3JpZ2luYWxdKVxuICB9XG5cbiAgLy8gTWV0aG9kc1xuXG4gIC8qKlxuICAgKiBHdWFyYW50ZWVkIHRvIGluc2VydCB0aGUgc3VwcGxpZWQgZmllbGQgcmVzb2x2ZXIgYWZ0ZXIgYW55IG90aGVyIHByZXBlbmRlZFxuICAgKiBmaWVsZCByZXNvbHZlcnMgYW5kIGJlZm9yZSB0aGUgb3JpZ2luYWwgaW50ZXJuYWwgZmllbGQgcmVzb2x2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7R3JhcGhRTEZpZWxkUmVzb2x2ZXJ9IHByZXJlc29sdmVyIGEgZmllbGQgcmVzb2x2ZXIgdG8gcnVuIGJlZm9yZVxuICAgKiB0aGUgb3JpZ2luYWwgZmllbGQgcmVzb2x2ZXIgZXhlY3V0ZXMuXG4gICAqL1xuICBwcmVwZW5kKHByZXJlc29sdmVyOiBHcmFwaFFMRmllbGRSZXNvbHZlcikge1xuICAgIGlmIChwcmVyZXNvbHZlciAmJiBpc0ZuKHByZXJlc29sdmVyKSkge1xuICAgICAgbGV0IGluZGV4ID0gdGhpc1tsaXN0aW5nXS5pbmRleE9mKHRoaXNbb3JpZ2luYWxdKVxuXG4gICAgICBpbmRleCA9IH5pbmRleCA/IGluZGV4IDogMFxuXG4gICAgICB0aGlzW2xpc3RpbmddLnNwbGljZShpbmRleCwgMCwgcHJlcmVzb2x2ZXIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydHMgdGhlIHN1cHBsaWVkIGZpZWxkIHJlc29sdmVyIGZ1bmN0aW9uIGFmdGVyIHRoZSBvcmlnaW5hbCByZXNvbHZlclxuICAgKiBidXQgYmVmb3JlIGFueSBwcmV2aW91c2x5IGFkZGVkIHBvc3QgcmVzb2x2ZXJzLiBJZiB5b3Ugc2ltcGx5IHdpc2ggdG9cbiAgICogcHVzaCBhbm90aGVyIGVudHJ5IHRvIHRoZSBsaXN0LCB1c2UgYC5wdXNoYFxuICAgKlxuICAgKiBAcGFyYW0ge0dyYXBoUUxGaWVsZFJlc29sdmVyfSBwb3N0cmVzb2x2ZXIgYSBmaWVsZCByZXNvbHZlciB0aGF0IHNob3VsZFxuICAgKiBydW4gYWZ0ZXIgdGhlIG9yaWdpbmFsIGJ1dCBiZWZvcmUgb3RoZXIgcG9zdHJlc29sdmVycyBwcmV2aW91c2x5IGFkZGVkLlxuICAgKi9cbiAgYXBwZW5kKHBvc3RyZXNvbHZlcjogR3JhcGhRTEZpZWxkUmVzb2x2ZXIpIHtcbiAgICBpZiAocG9zdHJlc29sdmVyICYmIGlzRm4ocG9zdHJlc29sdmVyKSkge1xuICAgICAgbGV0IGluZGV4ID0gdGhpc1tsaXN0aW5nXS5pbmRleE9mKHRoaXNbb3JpZ2luYWxdKVxuXG4gICAgICBpbmRleCA9IH5pbmRleCA/IGluZGV4ICsgMSA6IHRoaXNbbGlzdGluZ10ubGVuZ3RoXG5cbiAgICAgIHRoaXNbbGlzdGluZ10uc3BsaWNlKGluZGV4LCAwLCBwb3N0cmVzb2x2ZXIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNpbXBseSBhZGRzIGEgZmllbGQgcmVzb2x2ZXIgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCByYXRoZXIgdGhhbiB0cnlpbmdcbiAgICogdG8gcHV0IGl0IGFzIGNsb3NlIHRvIHRoZSBvcmlnaW5hbCByZXNvbHZlciBhcyBwb3NzaWJsZS5cbiAgICpcbiAgICogQHBhcmFtIHtHcmFwaFFMRmllbGRSZXNvbHZlcn0gcG9zdHJlc29sdmVyIGEgZmllbGQgcmVzb2x2ZXIgdGhhdCBzaG91bGRcbiAgICogcnVuIGFmdGVyIHRoZSBvcmlnaW5hbFxuICAgKi9cbiAgcHVzaChwb3N0cmVzb2x2ZXI6IEdyYXBoUUxGaWVsZFJlc29sdmVyKSB7XG4gICAgaWYgKHBvc3RyZXNvbHZlciAmJiBpc0ZuKHBvc3RyZXNvbHZlcikpIHtcbiAgICAgIHRoaXNbbGlzdGluZ10ucHVzaChwb3N0cmVzb2x2ZXIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBgLnRvU3RyaW5nKClgIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIEV4dGVuZGVkUmVzb2x2ZXIgZHV0aWZpbHkgbGlzdHMgdGhlXG4gICAqIHNvdXJjZSBvZiBlYWNoIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGluIG9yZGVyLlxuICAgKlxuICAgKiBAbWV0aG9kIHRvU3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYSBjb21iaW5lZCB0b1N0cmluZygpIGZ1bmN0aW9uYWxpdHkgZm9yIGVhY2ggaXRlbSBpblxuICAgKiBvcmRlclxuICAgKi9cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBsZXQgc3RyaW5nczogQXJyYXk8c3RyaW5nPiA9IFtdXG5cbiAgICBmb3IgKGxldCBmbiBvZiB0aGlzLm9yZGVyKSB7XG4gICAgICBzdHJpbmdzLnB1c2goYEZ1bmN0aW9uOiAke2ZuLm5hbWV9YClcbiAgICAgIHN0cmluZ3MucHVzaChcbiAgICAgICAgYC0tLS0tLS0tLSR7Jy0nLnJlcGVhdChmbi5uYW1lLmxlbmd0aCA/IGZuLm5hbWUubGVuZ3RoICsgMSA6IDApfWBcbiAgICAgIClcbiAgICAgIHN0cmluZ3MucHVzaChmbi50b1N0cmluZygpKVxuICAgICAgc3RyaW5ncy5wdXNoKCcnKVxuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmdzLmpvaW4oJ1xcbicpXG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgaGF2aW5nIHRvIHJlcGVhdGVkbHkgY29uc29sZS5sb2cgdGhlIHRvU3RyaW5nIG91dHB1dCwgdGhpcyBmdW5jdGlvblxuICAgKiBub3cgZG9lcyB0aGF0IGVhc2llciBmb3IgbWUgc28gSSBkb24ndCBlbmQgdXAgd2l0aCBjYXJwYWwgdHVubmVsIGVhcmxpZXJcbiAgICogdGhhbiBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBtZXRob2Qgc2hvd1xuICAgKi9cbiAgc2hvdygpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnRvU3RyaW5nKCkpXG4gIH1cblxuICAvLyBTeW1ib2xzXG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IHdoZW4gaW5zcGVjdGVkIHdpdGggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsL2FwcGx5XG4gICAqIHRoYXQgaW5zdGFuY2VzIG9mIEV4dGVuZGVkUmVzb2x2ZXIgcmV0dXJuIGAnW29iamVjdCBFeHRlbmRlZFJlc29sdmVyXSdgXG4gICAqXG4gICAqIEB0eXBlIHtTeW1ib2x9XG4gICAqL1xuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZVxuICB9XG5cbiAgLy8gU3RhdGljc1xuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgc3RhdGljIGluaXRpYWxpemVyIHRoYXQgYWxsb3dzIHRoZSBFeHRlbmRlZFJlc29sdmVyIGNsYXNzIHRvXG4gICAqIGJlIGluc3RhbnRpYXRlZCB1c2luZyBgRXh0ZW5kZWRSZXNvbHZlci5mcm9tKClgIHJhdGhlciB0aGFuIHRoZSBub3JtYWxcbiAgICogYG5ldyBFeHRlbmRlZFJlc29sdmVyKClgLiBBZGRpdGlvbmFsbHkgaXQgb2ZmZXJzIGEgd2F5IHRvIHNldCBhIHJlc3VsdFxuICAgKiBwYXRjaGVyIGFmdGVyIGluaXRpYWxpemF0aW9uIGhhcyBvY2N1cnJlZFxuICAgKlxuICAgKiBAcGFyYW0ge0dyYXBoUUxGaWVsZFJlc29sdmVyfSByZXNvbHZlciB0aGUgcmVzb2x2ZXIgdG8gaW5pdGlhbGl6ZSB0aGVcbiAgICogY2xhc3MgaW5zdGFuY2Ugd2l0aC5cbiAgICogQHBhcmFtIHtSZXNvbHZlclJlc3VsdHNQYXRjaGVyfSBwYXRjaGVyIGFuIG9wdGlvbmFsIGZ1bmN0aW9uIG1hdGNoaW5nIHRoZVxuICAgKiBgUmVzb2x2ZXJSZXN1bHRzUGF0Y2hlcmAgc2lnbmF0dXJlIHRvIHNldCB0byB0aGUgbmV3IGluc3RhbmNlIGFmdGVyIGl0IGlzXG4gICAqIGNyZWF0ZWQuXG4gICAqIEByZXR1cm4ge0V4dGVuZGVkUmVzb2x2ZXJ9IGEgbmV3bHkgbWludGVkIGluc3RhbmNlIG9mIHRoZSBjbGFzc1xuICAgKiBgRXh0ZW5kZWRSZXNvbHZlcmBcbiAgICovXG4gIHN0YXRpYyBmcm9tKFxuICAgIHJlc29sdmVyOiBHcmFwaFFMRmllbGRSZXNvbHZlcixcbiAgICBwYXRjaGVyPzogUmVzb2x2ZXJSZXN1bHRzUGF0Y2hlclxuICApOiBFeHRlbmRlZFJlc29sdmVyIHtcbiAgICBsZXQgbmV3UmVzb2x2ZXIgPSBuZXcgRXh0ZW5kZWRSZXNvbHZlcihyZXNvbHZlcilcblxuICAgIGlmIChwYXRjaGVyKSB7XG4gICAgICBuZXdSZXNvbHZlci5yZXN1bHRQYXRjaGVyID0gcGF0Y2hlclxuICAgIH1cblxuICAgIHJldHVybiBuZXdSZXNvbHZlclxuICB9XG5cbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8gdGhlIGAuZnJvbWAgc3RhdGljIGluaXRpYWxpemVyLCB0aGUgYC53cmFwYCBpbml0aWFsaXplclxuICAgKiB0YWtlcyBhbiBvcmlnaW5hbCBmaWVsZCByZXNvbHZlciwgYW4gb3B0aW9uYWwgcGF0Y2hlciBhcyBpbiBgLmZyb21gXG4gICAqIGFzIHdlbGwgYXMgYW4gYXJyYXkgb2YgYHByZXBlbmRzYCBhbmQgYGFwcGVuZHNgIGZpZWxkIHJlc29sdmVycyB3aGljaFxuICAgKiB3aWxsIGJlIHNsb3R0ZWQgaW4gdGhlIGFwcHJvcHJpYXRlIGxvY2F0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtICB7R3JhcGhRTEZpZWxkUmVzb2x2ZXJ9IG9yaWdpbmFsIGEgZmllbGQgcmVzb2x2ZXIgZnVuY3Rpb24gdGhhdFxuICAgKiBpcyB0byBiZSB3cmFwcGVkIGFzIHRoZSBiYXNpcyBmb3IgdGhlIHJlc3VsdGluZyBgRXh0ZW5kZWRSZXNvbHZlcmBcbiAgICogQHBhcmFtIHtSZXNvbHZlclJlc3VsdHNQYXRjaGVyfSBwYXRjaGVyIGFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgYWxsb3dzXG4gICAqIHRoZSB1c2VyIHRvIHBhdGNoIHRoZSByZXN1bHRzIG9mIHRoZSB0b3RhbCBmaWVsZCByZXNvbHZlciBjdWxtaW5hdGlvblxuICAgKiBiZWZvcmUgYWxsb3dpbmcgdGhlIGNhbGxpbmcgY29kZSB0byBzZWUgdGhlbS5cbiAgICogQHBhcmFtIHtHcmFwaFFMRmllbGRSZXNvbHZlcnxBcnJheTxHcmFwaFFMRmllbGRSZXNvbHZlcj59IHByZXBlbmRzIGVpdGhlclxuICAgKiBhIHNpbmdsZSBHcmFwaFFMRmllbGRSZXNvbHZlciBvciBhbiBhcnJheSBvZiB0aGVtIHRvIHByZXBlbmQgYmVmb3JlIHRoZVxuICAgKiBvcmlnaW5hbCBmaWVsZCByZXNvbHZlciBleGVjdXRlc1xuICAgKiBAcGFyYW0ge0dyYXBoUUxGaWVsZFJlc29sdmVyfEFycmF5PEdyYXBoUUxGaWVsZFJlc29sdmVyPn0gYXBwZW5kcyBlaXRoZXJcbiAgICogYSBzaW5nbGUgR3JhcGhRTEZpZWxkUmVzb2x2ZXIgb3IgYW4gYXJyYXkgb2YgdGhlbSB0byBwcmVwZW5kIGFmdGVyIHRoZVxuICAgKiBvcmlnaW5hbCBmaWVsZCByZXNvbHZlciBleGVjdXRlc1xuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHN0YXRpYyB3cmFwKFxuICAgIG9yaWdpbmFsOiBHcmFwaFFMRmllbGRSZXNvbHZlcixcbiAgICBwcmVwZW5kcz86IEdyYXBoUUxGaWVsZFJlc29sdmVyIHwgQXJyYXk8R3JhcGhRTEZpZWxkUmVzb2x2ZXI+ID0gW10sXG4gICAgYXBwZW5kcz86IEdyYXBoUUxGaWVsZFJlc29sdmVyIHwgQXJyYXk8R3JhcGhRTEZpZWxkUmVzb2x2ZXI+ID0gW10sXG4gICAgcGF0Y2hlcj86IFJlc29sdmVyUmVzdWx0c1BhdGNoZXIgPSBudWxsXG4gICkge1xuICAgIGxldCByZXNvbHZlciA9IEV4dGVuZGVkUmVzb2x2ZXIuZnJvbShvcmlnaW5hbClcblxuICAgIGlmIChwYXRjaGVyICYmIGlzRm4ocGF0Y2hlcikpIHtcbiAgICAgIHJlc29sdmVyLnJlc3VsdFBhdGNoZXIgPSBwYXRjaGVyXG4gICAgfVxuXG4gICAgaWYgKHByZXBlbmRzKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJlcGVuZHMpKSB7XG4gICAgICAgIHByZXBlbmRzID0gW3ByZXBlbmRzXVxuICAgICAgfVxuXG4gICAgICBpZiAocHJlcGVuZHMubGVuZ3RoKSB7XG4gICAgICAgIHByZXBlbmRzLmZvckVhY2goZm4gPT4gcmVzb2x2ZXIucHJlcGVuZChmbikpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFwcGVuZHMpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcHBlbmRzKSkge1xuICAgICAgICBhcHBlbmRzID0gW2FwcGVuZHNdXG4gICAgICB9XG5cbiAgICAgIGlmIChhcHBlbmRzLmxlbmd0aCkge1xuICAgICAgICBhcHBlbmRzLmZvckVhY2goZm4gPT4gcmVzb2x2ZXIuYXBwZW5kKGZuKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzb2x2ZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBJbiB0aGUgcHJvY2VzcyBvZiBzY2hlbWEgc3RpdGNoaW5nLCBpdCBpcyBwb3NzaWJsZSBhbmQgbGlrZWx5IHRoYXRcbiAgICogYSBnaXZlbiBzY2hlbWEgaGFzIGJlZW4gZXh0ZW5kZWQgb3IgZW5sYXJnZWQgZHVyaW5nIHRoZSBtZXJnaW5nIHByb2Nlc3NcbiAgICogd2l0aCBhbm90aGVyIHNjaGVtYS4gTmVpdGhlciBvZiB0aGUgb2xkIHNjaGVtYXMgaGF2ZSBhbnkgaWRlYSBvZiB0aGVcbiAgICogbGF5b3V0IG9mIHRoZSBuZXdlciwgZ3JhbmRlciwgc2NoZW1hLiBUaGVyZWZvcmUgaXQgaXMgbmVjZXNzYXJ5IHRvXG4gICAqIGluamVjdCB0aGUgbmV3IEdyYXBoUUxTY2hlbWEgYXMgcGFydCBvZiB0aGUgaW5mbyBwYXJhbWV0ZXJzIHJlY2VpdmVkXG4gICAqIGJ5IHRoZSByZXNvbHZlciBmb3IgYm90aCBzaWRlcyBvZiB0aGUgc3RpdGNoZWQgc2NoZW1hIGluIG9yZGVyIHRvXG4gICAqIHByZXZlbnQgZXJyb3JzLlxuICAgKlxuICAgKiBUaGlzIHN0YXRpYyBtZXRob2QgdGFrZXMgdGhlIG9yaWdpbmFsIHJlc29sdmVyLCB3cmFwcyBpdCB3aXRoIGFcbiAgICogcHJlcGVuZGVkIHJlc29sdmVyIHRoYXQgaW5qZWN0cyB0aGUgbmV3IHNjaGVtYTsgYWxzbyBzdXBwbGllZCBhcyB0aGVcbiAgICogc2Vjb25kIHBhcmFtZXRlci4gVGhlIHJlc3VsdCBpcyBhIG5ld2x5IG1pbnRlZCBgRXh0ZW5kZWRSZXNvbHZlcmAgdGhhdFxuICAgKiBzaG91bGQgZG8gdGhlIGpvYiBpbiBxdWVzdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtHcmFwaFFMRmllbGRSZXNvbHZlcn0gb3JpZ2luYWxSZXNvbHZlciB0aGUgb3JpZ2luYWwgcmVzb2x2ZXIgdG9kb1xuICAgKiB3cmFwLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWF9IG5ld1NjaGVtYSB0aGUgbmV3LCBncmFuZGVyLCBzY2hlbWEgd2l0aCBhbGwgZmllbGRzXG4gICAqIEBwYXJhbSB7UmVzb2x2ZXJSZXN1bHRzUGF0Y2hlcn0gcGF0Y2hlciBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBhbGxvdyB5b3UgdG9cbiAgICogbW9kaWZ5IHRoZVxuICAgKi9cbiAgc3RhdGljIFNjaGVtYUluamVjdG9yKFxuICAgIG9yaWdpbmFsUmVzb2x2ZXI6IEdyYXBoUUxGaWVsZFJlc29sdmVyLFxuICAgIG5ld1NjaGVtYTogR3JhcGhRTFNjaGVtYSxcbiAgICBwYXRjaGVyPzogUmVzb2x2ZXJSZXN1bHRzUGF0Y2hlciA9IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXR1cm4gRXh0ZW5kZWRSZXNvbHZlci53cmFwKFxuICAgICAgb3JpZ2luYWxSZXNvbHZlcixcbiAgICAgIFtcbiAgICAgICAgZnVuY3Rpb24gU2NoZW1hSW5qZWN0b3IoXG4gICAgICAgICAgc291cmNlOiBhbnksXG4gICAgICAgICAgYXJnczogYW55LFxuICAgICAgICAgIGNvbnRleHQ6IHsgW2FyZ3VtZW50OiBzdHJpbmddOiBhbnkgfSxcbiAgICAgICAgICBpbmZvOiBHcmFwaFFMUmVzb2x2ZUluZm9cbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgY29udGV4dC5zY2hlbWEpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2NoZW1hID0gbmV3U2NoZW1hXG4gICAgICAgICAgICBjb250ZXh0LnJvb3RWYWx1ZSA9IHN0cmlwUmVzb2x2ZXJzRnJvbVNjaGVtYShuZXdTY2hlbWEpXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgJiYgaW5mby5zY2hlbWEpIHtcbiAgICAgICAgICAgIGluZm8uc2NoZW1hID0gbmV3U2NoZW1hXG4gICAgICAgICAgICBpbmZvLnJvb3RWYWx1ZSA9IHN0cmlwUmVzb2x2ZXJzRnJvbVNjaGVtYShuZXdTY2hlbWEpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFsgXSxcbiAgICAgIHBhdGNoZXJcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogQWxsIGluc3RhbmNlcyBvZiBgRXh0ZW5kZWRSZXNvbHZlcmAgYXJlIFByb3hpZXMgdG8gdGhlIGluc3RhbnRpYXRlZFxuICAgKiBjbGFzcyB3aXRoIGEgc3BlY2lhbGx5IGRlZmluZWQgYC5hcHBseWAgaGFuZGxlciB0byBtYWtlIHRoZWlyIGN1c3RvbVxuICAgKiBleGVjdXRpb24gZmxvdyB3b3JrLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgc3RhdGljIGdldCBoYW5kbGVyKCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogUmVkdWNlIHRoZSByZXN1bHRzIG9mIGVhY2ggcmVzb2x2ZXIgaW4gdGhlIGxpc3QsIGluY2x1ZGluZ1xuICAgICAgICogdGhlIG9yaWdpbmFsIHJlc29sdmVyLiBDYWxsaW5nIGVhY2ggaW4gb3JkZXIgd2l0aCB0aGUgc2FtZVxuICAgICAgICogcGFyYW1ldGVycyBhbmQgcmV0dXJuaW5nIHRoZSBjb2FsZXNjZWQgcmVzdWx0c1xuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IHRhcmdldCB0aGlzIHNob3VsZCBhbHdheXMgYmUgdGhlIG9iamVjdCBjb250ZXh0XG4gICAgICAgKiBAcGFyYW0ge21peGVkfSB0aGlzQXJnIHRoZSBgdGhpc2Agb2JqZWN0IGZvciB0aGUgY29udGV4dCBvZiB0aGVcbiAgICAgICAqIGZ1bmN0aW9uIGNhbGxzXG4gICAgICAgKiBAcGFyYW0ge0FycmF5PG1peGVkPn0gYXJncyB0aGUgYXJndW1lbnRzIG9iamVjdCBhcyBzZWVuIGluIGFsbFxuICAgICAgICogZ3JhcGhxbCByZXNvbHZlcnNcbiAgICAgICAqIEByZXR1cm4ge21peGVkfSBlaXRoZXIgbnVsbCBvciBzb21lIHZhbHVlIGFzIHdvdWxkIGhhdmUgYmVlbiByZXR1cm5lZFxuICAgICAgICogZnJvbSB0aGUgY2FsbCBvZiBhIGdyYXBocWwgZmllbGQgcmVzb2x2ZXJcbiAgICAgICAqL1xuICAgICAgYXN5bmMgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdzKSB7XG4gICAgICAgIC8vIEVuc3VyZSB3ZSBoYXZlIGFyZ3VtZW50cyBhcyBhbiBhcnJheSBzbyB3ZSBjYW4gY29uY2F0IHJlc3VsdHMgaW5cbiAgICAgICAgLy8gZWFjaCBwYXNzIG9mIHRoZSByZWR1Y3Rpb24gcHJvY2Vzc1xuICAgICAgICBsZXQgbXlBcmdzID0gQXJyYXkuaXNBcnJheShhcmdzKVxuICAgICAgICAgID8gYXJnc1xuICAgICAgICAgIDogQXJyYXkuZnJvbSgoYXJncyAmJiBhcmdzKSB8fCBbXSlcblxuXG4gICAgICAgIGxldCByZXN1bHRzID0ge31cbiAgICAgICAgbGV0IHJlc3VsdFxuXG4gICAgICAgIGZvciAobGV0IGZuIG9mIHRhcmdldFtsaXN0aW5nXSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBmbi5hcHBseShcbiAgICAgICAgICAgICAgdGhpc0FyZyB8fCB0YXJnZXQsXG4gICAgICAgICAgICAgIG15QXJncy5jb25jYXQocmVzdWx0cylcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgV3JhcHBlZFJlc29sdmVyRXhlY3V0aW9uRXJyb3IoXG4gICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICB0YXJnZXRbbGlzdGluZ10uaW5kZXhPZihmbiksXG4gICAgICAgICAgICAgIG15QXJncy5jb25jYXQocmVzdWx0cyksXG4gICAgICAgICAgICAgIHRoaXNBcmcgfHwgdGFyZ2V0XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHJlc3VsdHMgJiZcbiAgICAgICAgICAgIHJlc3VsdHMgaW5zdGFuY2VvZiBPYmplY3QgJiZcbiAgICAgICAgICAgIHJlc3VsdCAmJlxuICAgICAgICAgICAgcmVzdWx0IGluc3RhbmNlb2YgT2JqZWN0XG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHJlc3VsdHMsIHJlc3VsdClcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldFtwYXRjaGVyXSAmJiB0YXJnZXRbcGF0Y2hlcl0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHRzID0gYXdhaXQgdGFyZ2V0W3BhdGNoZXJdLmNhbGwodGhpc0FyZyB8fCB0YXJnZXQsIHJlc3VsdHMpXG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlc29sdmVyUmVzdWx0c1BhdGNoZXJFcnJvcihcbiAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgIHRhcmdldFtwYXRjaGVyXSxcbiAgICAgICAgICAgICAgKHRoaXNBcmcgfHwgdGFyZ2V0KSxcbiAgICAgICAgICAgICAgcmVzdWx0c1xuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9LFxuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxJQUFBQSxRQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFDQSxJQUFBRSxPQUFBLEdBQUFGLE9BQUE7QUFKQTs7QUFnQkEsTUFBTUcsUUFBUSxHQUFHQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7QUFDNUMsTUFBTUMsT0FBTyxHQUFHRCxNQUFNLENBQUMsbUJBQW1CLENBQUM7QUFDM0MsTUFBTUUsT0FBTyxHQUFHRixNQUFNLENBQUMseUJBQXlCLENBQUM7O0FBRWpEO0FBQ0EsTUFBTUcsSUFBSSxHQUFJQyxDQUFNLElBQUssWUFBWSxDQUFDQyxJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDQyxRQUFRLENBQUNDLElBQUksQ0FBQ0wsQ0FBQyxDQUFDLENBQUM7O0FBRTdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTU0sZ0JBQWdCLFNBQVNDLFFBQVEsQ0FBQztFQUM3QztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDRUMsV0FBV0EsQ0FBQ0MsUUFBOEIsR0FBR0MsNkJBQW9CLEVBQUU7SUFDakUsS0FBSyxDQUFDLENBQUM7SUFFUCxJQUFJRCxRQUFRLFlBQVlILGdCQUFnQixFQUFFO01BQ3hDLElBQUksQ0FBQ1QsT0FBTyxDQUFDLEdBQUdjLEtBQUssQ0FBQ0MsSUFBSSxDQUFDSCxRQUFRLENBQUNaLE9BQU8sQ0FBQyxDQUFDO01BQzdDLElBQUksQ0FBQ0YsUUFBUSxDQUFDLEdBQUdjLFFB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
//# sourceMappingURL=ExtendedResolver.js.map