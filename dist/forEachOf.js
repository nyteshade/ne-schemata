"use strict";

require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.UNIONS = exports.TypeMap = exports.TYPES = exports.SCALARS = exports.ROOT_TYPES = exports.INTERFACES = exports.INPUT_TYPES = exports.HIDDEN = exports.ENUMS = exports.ALL = void 0;
exports.forEachField = forEachField;
exports.forEachOf = forEachOf;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.map.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.string.starts-with.js");
var _graphql = require("graphql");
// Create constants for each of the types allowed, over which one might
// iterate. These can be bitmasked to include multiple types; i.e. for both
// type and enums, pass TYPES | ENUMS for the types parameter. It
// defaults to simply types.
var ALL = exports.ALL = 1;
var TYPES = exports.TYPES = 2;
var INTERFACES = exports.INTERFACES = 4;
var ENUMS = exports.ENUMS = 8;
var UNIONS = exports.UNIONS = 16;
var SCALARS = exports.SCALARS = 32;
var ROOT_TYPES = exports.ROOT_TYPES = 64;
var INPUT_TYPES = exports.INPUT_TYPES = 128;
var HIDDEN = exports.HIDDEN = 256;
var Masks = [ALL, TYPES, INTERFACES, UNIONS, ENUMS, SCALARS, ROOT_TYPES, INPUT_TYPES];

// Create a mapping from the constant to the GraphQL type class.
var TypeMap = exports.TypeMap = new Map();
TypeMap.set(TYPES, _graphql.GraphQLObjectType);
TypeMap.set(ROOT_TYPES, _graphql.GraphQLObjectType);
TypeMap.set(INTERFACES, _graphql.GraphQLInterfaceType);
TypeMap.set(INPUT_TYPES, _graphql.GraphQLInputObjectType);
TypeMap.set(ENUMS, _graphql.GraphQLEnumType);
TypeMap.set(UNIONS, _graphql.GraphQLUnionType);
TypeMap.set(SCALARS, _graphql.GraphQLScalarType);

/**
 * Iterates over the values contained in a Schema's typeMap. If a desired
 * value is encountered, the supplied callback will be invoked. The values are
 * the constants ALL, TYPES, INTERFACES, ENUMS, UNIONS and SCALARS. Optionally
 * HIDDEN is another value that can be bitmasked together for a varied result.
 * HIDDEN exposes the values in the schema typemap that begin with a double
 * underscore.
 *
 * The signature for the function callback is as follows:
 * (
 *   type: mixed,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>
 *   schema: GraphQLSchema,
 *   context: mixed,
 * ) => void
 *
 * Where:
 *   `type`           - the object instance from within the `GraphQLSchema`
 *   `typeName`       - the name of the object; "Query" for type Query and
 *                      so on.
 *   `typeDirectives` - an array of directives applied to the object or an
 *                      empty array if there are none applied.
 *   `schema`         - an instance of `GraphQLSchema` over which to iterate
 *   `context`        - usually an object, and usually the same object,
 *                      passed to the call to `makeExecutableSchema()`
 *                      or `graphql()`
 *
 * @param {Function} fn a function with a signature defined above
 * @param {mixed} context usually an object but any mixed value the denotes
 * some shared context as is used with the schema during normal runtime.
 * @param {Number} types a bitmask of one or more of the constants defined
 * above. These can be OR'ed together and default to TYPES.
 * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
 * over and returned.
 */
function forEachOf(schema, fn, context) {
  var types = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ALL;
  [_graphql.GraphQLObjectType, _graphql.GraphQLInterfaceType, _graphql.GraphQLEnumType, _graphql.GraphQLUnionType, _graphql.GraphQLScalarType].forEach(function (t) {
    if (!t) return;
    if (!Object.getOwnPropertySymbols(t.prototype).includes(Symbol.toStringTag)) {
      Object.defineProperties(t.prototype, (0, _defineProperty2["default"])({}, Symbol.toStringTag, {
        get: function get() {
          return this.constructor.name;
        }
      }));
    }
  });
  var typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(function (typeName) {
    var type = typeMap[typeName];
    var hidden = (0, _graphql.getNamedType)(type).name.startsWith('__');
    var showHidden = (types & HIDDEN) === HIDDEN;
    var directives = type && type.astNode && type.astNode.directives || [];
    var doIt = (types & ALL) === ALL;
    Masks.forEach(function (mask) {
      if (doIt) {
        return;
      } else if ((mask & ROOT_TYPES) === ROOT_TYPES && (type === schema.getQueryType() || type === schema.getSubscriptionType() || type === schema.getMutationType())) {
        doIt = true;
        return;
      } else {
        doIt = (types & mask) === mask && type instanceof TypeMap.get(mask);
      }
    });

    // Prevent hidden items from being shown unless asked for
    doIt = doIt && (!hidden || hidden && showHidden);
    if (doIt) fn(type, typeName, directives, schema, context);
  });
}

/**
 * An extension of `forEachOf` that targets the fields of the types in the
 * schema's typeMap. This function provides more detail and allows greater
 * access to any associated `context` than the function of the same name
 * provided by the `graphql-tools` library.
 *
 * The signature for the callback function is as follows
 *
 * (
 *   type: mixed,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>,
 *   field: mixed,
 *   fieldName: string,
 *   fieldArgs: Array<GraphQLArgument>,
 *   fieldDirectives: Array<GraphQLDirective>,
 *   schema: GraphQLSchema,
 *   context: mixed
 * ) => void
 *
 * Where
 *
 * Where:
 *   `type`           - the object instance from within the `GraphQLSchema`
 *   `typeName`       - the name of the object; "Query" for type Query and so on
 *   `typeDirectives` - an array of directives applied to the object or an empty
 *                      array if there are none applied.
 *   `field`          - the field in question from the type
 *   `fieldName`      - the name of the field as a string
 *   `fieldArgs`      - an array of arguments for the field in question
 *   `fieldDirectives`- an array of directives applied to the field or an empty
 *                      array should there be no applied directives
 *   `schema`         - an instance of `GraphQLSchema` over which to iterate
 *   `context`        - usually an object, and usually the same object, passed
 *                      to the call to `makeExecutableSchema()` or `graphql()`
 *
 * @param {GraphQLSchema} schema
 * @param {Function} fn a function with a signature defined above
 * @param {mixed} context usually an object but any mixed value the denotes
 * some shared context as is used with the schema during normal runtime.
 */
function forEachField(schema, fn, context) {
  var types = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ALL;
  forEachOf(schema, function (type, typeName, _, context, directives) {
    if (!type._fields) {
      return;
    }
    Object.keys(type._fields).forEach(function (fieldName) {
      var field = type._fields[fieldName];
      var fieldDirectives = field.astNode && field.astNode.directives || [];
      var fieldArgs = field.args || [];
      fn(type, typeName, directives, field, fieldName, fieldArgs, fieldDirectives, schema, context);
    });
  }, context, types);
}
var _default = exports["default"] = forEachOf;