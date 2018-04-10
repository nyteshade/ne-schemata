'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEachField = exports.forEachOf = exports.TypeMap = exports.HIDDEN = exports.INPUT_TYPES = exports.ROOT_TYPES = exports.SCALARS = exports.UNIONS = exports.ENUMS = exports.INTERFACES = exports.TYPES = exports.ALL = undefined;

var _graphql = require('graphql');

// Create constants for each of the types allowed, over which one might
// iterate. These can be bitmasked to include multiple types; i.e. for both
// type and enums, pass TYPES | ENUMS for the types parameter. It
// defaults to simply types.
const ALL = 1;

const TYPES = 2;
const INTERFACES = 4;
const ENUMS = 8;
const UNIONS = 16;
const SCALARS = 32;
const ROOT_TYPES = 64;
const INPUT_TYPES = 128;
const HIDDEN = 256;
const Masks = [ALL, TYPES, INTERFACES, UNIONS, ENUMS, SCALARS, ROOT_TYPES, INPUT_TYPES];

// Create a mapping from the constant to the GraphQL type class.
const TypeMap = new Map();
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
function forEachOf(schema, fn, context, types = ALL) {
  [_graphql.GraphQLObjectType, _graphql.GraphQLInterfaceType, _graphql.GraphQLEnumType, _graphql.GraphQLUnionType, _graphql.GraphQLScalarType].forEach(t => {
    if (!t) return;

    if (!Object.getOwnPropertySymbols(t.prototype).includes(Symbol.toStringTag)) {
      Object.defineProperties(t.prototype, {
        [Symbol.toStringTag]: { get() {
            return this.constructor.name;
          } }
      });
    }
  });

  const typeMap = schema.getTypeMap();

  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];
    const hidden = (0, _graphql.getNamedType)(type).name.startsWith('__');
    const showHidden = (types & HIDDEN) === HIDDEN;
    const directives = type && type.astNode && type.astNode.directives || [];
    let doIt = (types & ALL) === ALL;

    Masks.forEach(mask => {
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
function forEachField(schema, fn, context, types = ALL) {
  forEachOf(schema, (type, typeName, _, context, directives) => {
    if (!type._fields) {
      return;
    }

    Object.keys(type._fields).forEach(fieldName => {
      let field = type._fields[fieldName];
      let fieldDirectives = field.astNode && field.astNode.directives || [];
      let fieldArgs = field.args || [];

      fn(type, typeName, directives, field, fieldName, fieldArgs, fieldDirectives, schema, context);
    });
  }, context, types);
}

exports.ALL = ALL;
exports.TYPES = TYPES;
exports.INTERFACES = INTERFACES;
exports.ENUMS = ENUMS;
exports.UNIONS = UNIONS;
exports.SCALARS = SCALARS;
exports.ROOT_TYPES = ROOT_TYPES;
exports.INPUT_TYPES = INPUT_TYPES;
exports.HIDDEN = HIDDEN;
exports.TypeMap = TypeMap;
exports.forEachOf = forEachOf;
exports.forEachField = forEachField;
exports.default = forEachOf;
//# sourceMappingURL=forEachOf.js.map