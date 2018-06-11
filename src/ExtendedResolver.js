import { defaultFieldResolver } from 'graphql'
import { stripResolversFromSchema } from './Schemata'
import {
  WrappedResolverExecutionError,
  ResolverResultsPatcherError
} from './errors'

import type {
  GraphQLFieldResolver,
  GraphQLResolveInfo,
  GraphQLSchema,
} from 'graphql'

const original = Symbol('Original Resolver')
const listing = Symbol('List of Resolvers')
const patcher = Symbol('Resolver Result Patcher')

const isFn = o => /Function\]/.test(Object.prototype.toString.call(o))

/**
 * The ResolverResultsPatcher is an asynchronous function, or a function that
 * returns a promise, which receives the final value of all the extended
 * resolvers combined work as a parameter. The results of this function will
 * be the final value returned to the GraphQL engine.
 *
 * @type {AsyncFunction}
 */
export type ResolverResultsPatcher = (results: mixed) => Promise<mixed>

/**
 * Higher order, or wrapped, GraphQL field resolvers are a technique that
 * is becoming increasingly common these days. This class attempts to wrap
 * that in such a manner that it allows a bit of extensibility.
 *
 * @extends Function
 */
export class ExtendedResolver extends Function {
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
  constructor(resolver: GraphQLFieldResolver = defaultFieldResolver) {
    super()

    if (resolver instanceof ExtendedResolver) {
      this[listing] = Array.from(resolver[listing])
      this[original] = resolver[original]
      this[patcher] = resolver[patcher]
    }
    else {
      this[listing] = [resolver]
      this[original] = resolver
      this[patcher] = null
    }

    return new Proxy(this, ExtendedResolver.handler)
  }

  // Properties

  /**
   * Returns a handle to the internal array of ordered resolver
   * functions, should indepth modification be necessary.
   *
   * @return  {Array<GraphQLFieldResolver>} the internal list of
   * resolvers to execute in order as though it were a single resolver
   */
  get order(): Array<GraphQLFieldResolver> {
    return this[listing]
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
  set order(value: Array<GraphQLFieldResolver>) {
    this[listing] = value
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
  get resultPatcher(): ResolverResultsPatcher {
    return this[patcher]
  }

  /**
   * Sets the internal patcher function.
   *
   * @see resultPatcher getter above
   * @param {ResolverResultsPatcher} value a new patcher function
   */
  set resultPatcher(value: ResolverResultsPatcher) {
    this[patcher] = value
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
  get original(): GraphQLFieldResolver {
    return this[original]
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
  get originalIndex(): number {
    return this[listing].indexOf(this[original])
  }

  // Methods

  /**
   * Guaranteed to insert the supplied field resolver after any other prepended
   * field resolvers and before the original internal field resolver.
   *
   * @param {GraphQLFieldResolver} preresolver a field resolver to run before
   * the original field resolver executes.
   */
  prepend(preresolver: GraphQLFieldResolver) {
    if (preresolver && isFn(preresolver)) {
      let index = this[listing].indexOf(this[original])

      index = ~index ? index : 0

      this[listing].splice(index, 0, preresolver)
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
  append(postresolver: GraphQLFieldResolver) {
    if (postresolver && isFn(postresolver)) {
      let index = this[listing].indexOf(this[original])

      index = ~index ? index + 1 : this[listing].length

      this[listing].splice(index, 0, postresolver)
    }
  }

  /**
   * Simply adds a field resolver to the end of the list rather than trying
   * to put it as close to the original resolver as possible.
   *
   * @param {GraphQLFieldResolver} postresolver a field resolver that should
   * run after the original
   */
  push(postresolver: GraphQLFieldResolver) {
    if (postresolver && isFn(postresolver)) {
      this[listing].push(postresolver)
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
  toString(): string {
    let strings: Array<string> = []

    for (let fn of this.order) {
      strings.push(`Function: ${fn.name}`)
      strings.push(
        `---------${'-'.repeat(fn.name.length ? fn.name.length + 1 : 0)}`
      )
      strings.push(fn.toString())
      strings.push('')
    }

    return strings.join('\n')
  }

  /**
   * After having to repeatedly console.log the toString output, this function
   * now does that easier for me so I don't end up with carpal tunnel earlier
   * than necessary.
   *
   * @method show
   */
  show(): void {
    console.log(this.toString())
  }

  // Symbols

  /**
   * Ensure that when inspected with Object.prototype.toString.call/apply
   * that instances of ExtendedResolver return `'[object ExtendedResolver]'`
   *
   * @type {Symbol}
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name
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
  static from(
    resolver: GraphQLFieldResolver,
    patcher?: ResolverResultsPatcher
  ): ExtendedResolver {
    let newResolver = new ExtendedResolver(resolver)

    if (patcher) {
      newResolver.resultPatcher = patcher
    }

    return newResolver
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
  static wrap(
    original: GraphQLFieldResolver,
    prepends?: GraphQLFieldResolver | Array<GraphQLFieldResolver> = [],
    appends?: GraphQLFieldResolver | Array<GraphQLFieldResolver> = [],
    patcher?: ResolverResultsPatcher = null
  ) {
    let resolver = ExtendedResolver.from(original)

    if (patcher && isFn(patcher)) {
      resolver.resultPatcher = patcher
    }

    if (prepends) {
      if (!Array.isArray(prepends)) {
        prepends = [prepends]
      }

      if (prepends.length) {
        prepends.forEach(fn => resolver.prepend(fn))
      }
    }

    if (appends) {
      if (!Array.isArray(appends)) {
        appends = [appends]
      }

      if (appends.length) {
        appends.forEach(fn => resolver.append(fn))
      }
    }

    return resolver
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
  static SchemaInjector(
    originalResolver: GraphQLFieldResolver,
    newSchema: GraphQLSchema,
    patcher?: ResolverResultsPatcher = undefined
  ) {
    return ExtendedResolver.wrap(
      originalResolver,
      [
        function SchemaInjector(
          source: any,
          args: any,
          context: { [argument: string]: any },
          info: GraphQLResolveInfo
        ) {
          if (arguments.length === 3 && context.schema) {
            context.schema = newSchema
            context.rootValue = stripResolversFromSchema(newSchema)
          }
          else if (arguments.length === 4 && info.schema) {
            info.schema = newSchema
            info.rootValue = stripResolversFromSchema(newSchema)
          }
        },
      ],
      [ ],
      patcher
    )
  }

  /**
   * All instances of `ExtendedResolver` are Proxies to the instantiated
   * class with a specially defined `.apply` handler to make their custom
   * execution flow work.
   *
   * @type {Object}
   */
  static get handler(): Object {
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
        let myArgs = Array.isArray(args)
          ? args
          : Array.from((args && args) || [])


        let results = {}
        let result

        for (let fn of target[listing]) {
          try {
            result = await fn.apply(
              thisArg || target,
              myArgs.concat(results)
            )
          }
          catch (error) {
            throw new WrappedResolverExecutionError(
              error,
              this,
              target[listing].indexOf(fn),
              myArgs.concat(results),
              thisArg || target
            );
          }

          if (
            results &&
            results instanceof Object &&
            result &&
            result instanceof Object
          ) {
            Object.assign(results, result)
          }
          else {
            results = result
          }
        }

        if (target[patcher] && target[patcher] instanceof Function) {
          try {
            results = await target[patcher].call(thisArg || target, results)
          }
          catch (error) {
            throw new ResolverResultsPatcherError(
              error,
              target[patcher],
              (thisArg || target),
              results
            )
          }
        }

        return results
      },
    }
  }
}
