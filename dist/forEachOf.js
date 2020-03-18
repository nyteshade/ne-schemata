"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEachOf = forEachOf;
exports.forEachField = forEachField;
exports["default"] = exports.TypeMap = exports.HIDDEN = exports.INPUT_TYPES = exports.ROOT_TYPES = exports.SCALARS = exports.UNIONS = exports.ENUMS = exports.INTERFACES = exports.TYPES = exports.ALL = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _graphql = require("graphql");

// Create constants for each of the types allowed, over which one might
// iterate. These can be bitmasked to include multiple types; i.e. for both
// type and enums, pass TYPES | ENUMS for the types parameter. It
// defaults to simply types.
var ALL = 1;
exports.ALL = ALL;
var TYPES = 2;
exports.TYPES = TYPES;
var INTERFACES = 4;
exports.INTERFACES = INTERFACES;
var ENUMS = 8;
exports.ENUMS = ENUMS;
var UNIONS = 16;
exports.UNIONS = UNIONS;
var SCALARS = 32;
exports.SCALARS = SCALARS;
var ROOT_TYPES = 64;
exports.ROOT_TYPES = ROOT_TYPES;
var INPUT_TYPES = 128;
exports.INPUT_TYPES = INPUT_TYPES;
var HIDDEN = 256;
exports.HIDDEN = HIDDEN;
var Masks = [ALL, TYPES, INTERFACES, UNIONS, ENUMS, SCALARS, ROOT_TYPES, INPUT_TYPES]; // Create a mapping from the constant to the GraphQL type class.

var TypeMap = new Map();
exports.TypeMap = TypeMap;
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
    }); // Prevent hidden items from being shown unless asked for

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

var _default = forEachOf;
exports["default"] = _default;