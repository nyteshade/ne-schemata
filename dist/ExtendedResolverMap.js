"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolverMap = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Schemata = require("./Schemata");

var _Symbol$iterator;

_Symbol$iterator = Symbol.iterator;

/**
 * A class that stores information about a set of resolvers and their
 * associated GraphQLSchema (or the sdl to make one), such that when
 * multiple SDL/Schema merges occur the subsequently merged Schemas have
 * a history of the unbound resolver functiosn from previous merges (in order)
 *
 * @class ExtendedResovlerMap
 */
var ExtendedResolverMap = /*#__PURE__*/function () {
  /**
   * The constructor takes an object with at least SDL or a GraphQLSchema and
   * a resolver map object of untainted and unbound resolver functions
   *
   * @constructor
   * @param {ExtendedResolverMapConfig} config an object conforming to the
   * flow type `ExtendedResolverMapConfig` as defined above.
   */
  function ExtendedResolverMap(config) {
    (0, _classCallCheck2["default"])(this, ExtendedResolverMap);
    (0, _defineProperty2["default"])(this, "schema", void 0);
    (0, _defineProperty2["default"])(this, "sdl", void 0);
    (0, _defineProperty2["default"])(this, "resolvers", void 0);
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


  (0, _createClass2["default"])(ExtendedResolverMap, [{
    key: _Symbol$iterator,
    get: function get() {
      return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _i, _Object$keys, key;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _i = 0, _Object$keys = Object.keys(this.resolvers);

              case 1:
                if (!(_i < _Object$keys.length)) {
                  _context.next = 8;
                  break;
                }

                key = _Object$keys[_i];
                _context.next = 5;
                return {
                  key: key,
                  value: this.resolvers[key]
                };

              case 5:
                _i++;
                _context.next = 1;
                break;

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }).bind(this);
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

  }], [{
    key: "from",
    value: function from(config) {
      if (config instanceof _Schemata.Schemata) {
        var schema = config.schema,
            sdl = config.sdl;
        var resolvers = config.buildResolvers();
        return new ExtendedResolverMap({
          schema: schema,
          sdl: sdl,
          resolvers: resolvers
        });
      } else {
        return new ExtendedResolverMap(config);
      }
    }
  }]);
  return ExtendedResolverMap;
}();

exports.ExtendedResolverMap = ExtendedResolverMap;