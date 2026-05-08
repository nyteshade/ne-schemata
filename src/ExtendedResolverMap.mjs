import { Schemata } from './Schemata.mjs'

/**
 * A class that stores information about a set of resolvers and their
 * associated GraphQLSchema (or the sdl to make one), such that when
 * multiple SDL/Schema merges occur the subsequently merged Schemas have
 * a history of the unbound resolver functions from previous merges (in order)
 *
 * @class ExtendedResolverMap
 */
export class ExtendedResolverMap {
  /**
   * @type {Object|null} The GraphQL schema object
   */
  schema

  /**
   * @type {string|Schemata|null} The SDL string
   */
  sdl

  /**
   * @type {Object|null} The resolver map object
   */
  resolvers

  /**
   * The constructor takes an object with at least SDL or a GraphQLSchema and
   * a resolver map object of untainted and unbound resolver functions
   *
   * @constructor
   * @param {Object} config - An object with schema, sdl, and/or resolvers
   * @param {Object} [config.schema] - A GraphQLSchema instance
   * @param {string|Schemata} [config.sdl] - SDL string or Schemata instance
   * @param {Object} [config.resolvers] - Resolver map object
   */
  constructor(config) {
    this.schema = config.schema
    this.sdl = config.sdl
    this.resolvers = config.resolvers
  }

  /**
   * A useful iterator on instances of ExtendedResolverMap that yields a
   * key and value for each entry found in the resolvers object set on this
   * instance
   *
   * @return {Generator} A bound generator function that iterates over the
   * key/value props of the internal .resolvers property
   */
  get [Symbol.iterator]() {
    return function*() {
      for (let key of Object.keys(this.resolvers)) {
        yield { key, value: this.resolvers[key] }
      }
    }.bind(this)
  }

  /**
   * A shorthand way to create a new instance of `ExtendedResolverMap`. In
   * the case that an instance of Schemata is passed in, the schema
   * property is first attempted as
   *
   * @param {Object|Schemata} config - The same config object passed
   * to the constructor or an instance of Schemata
   * @return {ExtendedResolverMap} A new instance of `ExtendedResolverMap`
   */
  static from(config) {
    if (config instanceof Schemata) {
      const { schema, sdl } = config
      const resolvers = config.buildResolvers()

      return new ExtendedResolverMap({ schema, sdl, resolvers })
    }
    else {
      return new ExtendedResolverMap(config)
    }
  }
}
