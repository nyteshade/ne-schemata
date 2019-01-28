"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolverMap = void 0;

var _Schemata = require("./Schemata");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Symbol$iterator = Symbol.iterator;

/**
 * A class that stores information about a set of resolvers and their
 * associated GraphQLSchema (or the sdl to make one), such that when
 * multiple SDL/Schema merges occur the subsequently merged Schemas have
 * a history of the unbound resolver functiosn from previous merges (in order)
 *
 * @class ExtendedResovlerMap
 */
var ExtendedResolverMap =
/*#__PURE__*/
function () {
  /**
   * The constructor takes an object with at least SDL or a GraphQLSchema and
   * a resolver map object of untainted and unbound resolver functions
   *
   * @constructor
   * @param {ExtendedResolverMapConfig} config an object conforming to the
   * flow type `ExtendedResolverMapConfig` as defined above.
   */
  function ExtendedResolverMap(config) {
    _classCallCheck(this, ExtendedResolverMap);

    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "sdl", void 0);

    _defineProperty(this, "resolvers", void 0);

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


  _createClass(ExtendedResolverMap, [{
    key: _Symbol$iterator,
    get: function get() {
      return (
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var _arr, _i, key;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _arr = Object.keys(this.resolvers);
                  _i = 0;

                case 2:
                  if (!(_i < _arr.length)) {
                    _context.next = 9;
                    break;
                  }

                  key = _arr[_i];
                  _context.next = 6;
                  return {
                    key: key,
                    value: this.resolvers[key]
                  };

                case 6:
                  _i++;
                  _context.next = 2;
                  break;

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }).bind(this)
      );
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