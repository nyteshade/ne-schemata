import { defaultFieldResolver } from 'graphql'
import { stripResolversFromSchema } from './Schemata.mjs'
import {
  WrappedResolverExecutionError,
  ResolverResultsPatcherError
} from './errors/index.mjs'

const original = Symbol('Original Resolver')
const listing = Symbol('List of Resolvers')
const patcher = Symbol('Resolver Result Patcher')

/**
 * Type guard to check if a value is a function.
 *
 * @param {*} o - The value to check
 * @return {boolean} True if the value is a function
 */
const isFn = (o) => /Function\]/.test(Object.prototype.toString.call(o))

/**
 * Higher order, or wrapped, GraphQL field resolvers are a technique that
 * is becoming increasingly common these days. This class attempts to wrap
 * that in such a manner that it allows a bit of extensibility.
 *
 * This implementation follows a standard middleware pattern where resolvers
 * can:
 * - Return undefined/null to continue to the next resolver
 * - Return a value to short-circuit and return immediately
 * - Throw to trigger error handling
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
   * @param {Function} [resolver=defaultFieldResolver] - A normal
   *   GraphQL field resolver function. By default, the `defaultFieldResolver`
   *   is used if no other value is supplied.
   */
  constructor(resolver = defaultFieldResolver) {
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
   * functions, should in-depth modification be necessary.
   *
   * @return {Array<Function>} The internal list of
   *   resolvers to execute in order as though it were a single resolver
   */
  get order() {
    return this[listing]
  }

  /**
   * An accessor that writes a new resolver to the internal list of
   * resolvers that combine into a single resolver for inclusion elsewhere.
   *
   * @todo Come up with some ideas on how to handle setting of this list
   *   when the list no longer contains the original. Throw error? Log? Add it
   *   to the end? Allow all in some configurable manner?
   *
   * @param {Array<Function>} value - The new array
   */
  set order(value) {
    this[listing] = value
  }

  /**
   * Retrieve the internal result value patcher function. By default, this
   * value is null and nonexistent. When present, it is a function that will
   * be called after all internal resolvers have done their work but before
   * those results are returned to the calling function.
   *
   * The function receives (results, source, args, context, info) and its
   * return value becomes the final result.
   *
   * @return {Function|null} A patcher function or null
   */
  get resultPatcher() {
    return this[patcher]
  }

  /**
   * Sets the internal patcher function.
   *
   * @see resultPatcher getter above
   * @param {Function|null} value - A new patcher function
   */
  set resultPatcher(value) {
    this[patcher] = value
  }

  /**
   * A getter that retrieves the original resolver from within the
   * `ExtendedResolver` instance.
   *
   * @return {Function} The originally wrapped field resolver
   */
  get original() {
    return this[original]
  }

  /**
   * The dynamic index of the original resolver inside the internal listing.
   * As prepended and appended resolvers are added to the `ExtendedResolver`,
   * this value will change.
   *
   * @return {number} The numeric index of the original resolver within the
   *   internal listing. -1 indicates that the original resolver is missing
   *   which, in and of itself, indicates an invalid state.
   */
  get originalIndex() {
    return this[listing].indexOf(this[original])
  }

  // Methods

  /**
   * Guaranteed to insert the supplied field resolver after any other prepended
   * field resolvers and before the original internal field resolver.
   *
   * @param {Function} preresolver - A field resolver to run before
   *   the original field resolver executes.
   */
  prepend(preresolver) {
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
   * @param {Function} postresolver - A field resolver that should
   *   run after the original but before other postresolvers previously added.
   */
  append(postresolver) {
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
   * @param {Function} postresolver - A field resolver that should
   *   run after the original
   */
  push(postresolver) {
    if (postresolver && isFn(postresolver)) {
      this[listing].push(postresolver)
    }
  }

  /**
   * The `.toString()` functionality of the ExtendedResolver dutifully lists
   * the source of each function to be executed in order.
   *
   * @return {string} A combined toString() output for each item in order
   */
  toString() {
    let strings = []

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
   * now does that easier so you don't end up with carpal tunnel earlier
   * than necessary.
   */
  show() {
    console.log(this.toString())
  }

  // Symbols

  /**
   * Ensure that when inspected with Object.prototype.toString.call/apply
   * that instances of ExtendedResolver return `'[object ExtendedResolver]'`
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  // Statics

  /**
   * Shorthand static initializer that allows the ExtendedResolver class to
   * be instantiated using `ExtendedResolver.from()` rather than the normal
   * `new ExtendedResolver()`. Additionally it offers a way to set a result
   * patcher after initialization has occurred.
   *
   * @param {Function} resolver - The resolver to initialize the
   *   class instance with.
   * @param {Function} [patcher] - An optional function to set as the
   *   result patcher on the new instance.
   * @return {ExtendedResolver} A newly minted instance of the class
   */
  static from(resolver, patcher) {
    let newResolver = new ExtendedResolver(resolver)

    if (patcher) {
      newResolver.resultPatcher = patcher
    }

    return newResolver
  }

  /**
   * Similar to the `.from` static initializer, the `.wrap` initializer
   * takes an original field resolver, an optional patcher as in `.from`
   * as well as arrays of `prepends` and `appends` field resolvers which
   * will be slotted in the appropriate locations.
   *
   * @param {Function} original - A field resolver function that
   *   is to be wrapped as the basis for the resulting `ExtendedResolver`
   * @param {Function|Array<Function>} [prepends=[]] - Either
   *   a single field resolver or an array of them to prepend before the
   *   original field resolver executes.
   * @param {Function|Array<Function>} [appends=[]] - Either
   *   a single field resolver or an array of them to append after the
   *   original field resolver executes.
   * @param {Function} [patcher=null] - An optional function that allows
   *   you to patch the results of the total field resolver culmination
   *   before allowing the calling code to see them.
   * @return {ExtendedResolver} The wrapped resolver instance
   */
  static wrap(
    original,
    prepends = [],
    appends = [],
    patcher = null
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
   * @param {Function} originalResolver - The original resolver to wrap.
   * @param {Object} newSchema - The new, grander, schema with all fields.
   *   This should be a GraphQLSchema instance.
   * @param {Function} [patcher] - A function that will allow you to
   *   modify the results.
   * @return {ExtendedResolver} The wrapped resolver with schema injection
   */
  static SchemaInjector(
    originalResolver,
    newSchema,
    patcher = undefined
  ) {
    return ExtendedResolver.wrap(
      originalResolver,
      [
        function SchemaInjector(
          source,
          args,
          context,
          info
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
      [],
      patcher
    )
  }

  /**
   * All instances of `ExtendedResolver` are Proxies to the instantiated
   * class with a specially defined `.apply` handler to make their custom
   * execution flow work.
   *
   * This implements a standard middleware pattern where each resolver can:
   * - Continue to the next resolver by returning undefined or not returning
   * - Short-circuit by returning a value (skips remaining resolvers)
   * - Throw to indicate an error
   *
   * @type {Object}
   */
  static get handler() {
    return {
      /**
       * Execute resolvers in sequence with standard middleware pattern.
       * Each resolver receives (source, args, context, info) and can:
       * - Return undefined/null to continue to next resolver
       * - Return a value to short-circuit and return that value immediately
       * - Throw to trigger error handling
       *
       * @param {Object} target - This should always be the object context
       * @param {*} thisArg - The `this` object for the context of the
       *   function calls
       * @param {Array} args - The standard GraphQL resolver args:
       *   [source, args, context, info]
       * @return {*} The final resolver result
       */
      async apply(target, thisArg, args) {
        // Ensure we have a proper array of arguments
        const resolverArgs = Array.isArray(args)
          ? args
          : Array.from(args || [])

        // Standard GraphQL resolver signature: (source, args, context, info)
        const [source, fieldArgs, context, info] = resolverArgs

        let finalResult = undefined
        let hasResult = false

        // Execute each resolver in order
        for (let i = 0; i < target[listing].length; i++) {
          const fn = target[listing][i]

          try {
            const result = await fn.apply(
              thisArg || target,
              [source, fieldArgs, context, info]
            )

            // If resolver returns a value, it short-circuits the chain
            if (result !== undefined && result !== null) {
              finalResult = result
              hasResult = true
              break
            }
            // If undefined/null, continue to next resolver
          }
          catch (error) {
            throw new WrappedResolverExecutionError(
              error,
              this,
              i,
              [source, fieldArgs, context, info],
              thisArg || target
            )
          }
        }

        // If no resolver returned a result, use a default empty object
        if (!hasResult) {
          finalResult = {}
        }

        // Apply result patcher if present
        if (target[patcher] && typeof target[patcher] === 'function') {
          try {
            finalResult = await target[patcher].call(
              thisArg || target,
              finalResult,
              source,
              fieldArgs,
              context,
              info
            )
          }
          catch (error) {
            throw new ResolverResultsPatcherError(
              error,
              target[patcher],
              (thisArg || target),
              finalResult
            )
          }
        }

        return finalResult
      },
    }
  }
}
