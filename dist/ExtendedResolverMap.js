'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolverMap = undefined;

var _Schemata = require('./Schemata');

/**
 * A class that stores information about a set of resolvers and their
 * associated GraphQLSchema (or the sdl to make one), such that when
 * multiple SDL/Schema merges occur the subsequently merged Schemas have
 * a history of the unbound resolver functiosn from previous merges (in order)
 *
 * @class ExtendedResovlerMap
 */
class ExtendedResolverMap {

  /**
   * The constructor takes an object with at least SDL or a GraphQLSchema and
   * a resolver map object of untainted and unbound resolver functions
   *
   * @constructor
   * @param {ExtendedResolverMapConfig} config an object conforming to the
   * flow type `ExtendedResolverMapConfig` as defined above.
   */
  constructor(config) {
    this.schema = config.schema;
    this.sdl = config.sdl;
    this.resolvers = config.resolvers;
  }

  /**
   * A useful iterator on instances of ExtendedResolverMap that yields a
   * key and value for each entry found in the resolvers object set on this
   * instance
   *
   * @return {Function} a bound generator function that iterates over the
   * key/value props of the internal .resovlers property
   */
  get [Symbol.iterator]() {
    return function* () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(this.resolvers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let key = _step.value;

          yield { key, value: this.resolvers[key] };
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }.bind(this);
  }

  /**
   * A shorthand way to create a new instance of `ExtendedResolverMap`. In
   * the case that an instance of Schemata is passed in, the schema
   * property is first attempted as
   *
   * @param {SchemataConfigUnion} config the same config object passed
   * to the constructor or an instance of Schemata
   * @return {ExtendedResolverMap} a new instance of `ExtendedResolverMap`
   */
  static from(config) {
    if (config instanceof _Schemata.Schemata) {
      const schema = config.schema,
            sdl = config.sdl;

      const resolvers = config.buildResolvers();

      return new ExtendedResolverMap({ schema, sdl, resolvers });
    } else {
      return new ExtendedResolverMap(config);
    }
  }
}
exports.ExtendedResolverMap = ExtendedResolverMap;
//# sourceMappingURL=ExtendedResolverMap.js.map