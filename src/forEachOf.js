// @ts-check

import {
  getNamedType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLScalarType,
  GraphQLType,
  GraphQLSchema,
} from 'graphql'

/**
 * @typedef {(
 *   type: unknown,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>,
 *   schema: GraphQLSchema,
 *   context: unknown
 * ) => void} ForEachOfResolver
 */

 /**
  * @typedef {(
  *   type: unknown,
  *   typeName: string,
  *   typeDirectives: Array<GraphQLDirective>,
  *   field: unknown,
  *   fieldName: string,
  *   fieldArgs: Array<GraphQLArgument>,
  *   fieldDirectives: Array<GraphQLDirective>,
  *   schema: GraphQLSchema,
  *   context: unknown
  *  ) => void} ForEachFieldResolver
  */

// Create constants for each of the types allowed, over which one might
// iterate. These can be bitmasked to include multiple types; i.e. for both
// type and enums, pass TYPES | ENUMS for the types parameter. It
// defaults to simply types.
const ALL = 1
const TYPES = 2
const INTERFACES = 4
const ENUMS = 8
const UNIONS = 16
const SCALARS = 32
const ROOT_TYPES = 64
const INPUT_TYPES = 128
const HIDDEN = 256
const Masks = [
  ALL, TYPES, INTERFACES, UNIONS, ENUMS, SCALARS,
  ROOT_TYPES, INPUT_TYPES
]
export type BitmaskedType =
  ALL | TYPES | INTERFACES | ENUMS | UNIONS | SCALARS | ROOT_TYPES | INPUT_TYPES | HIDDEN

// Create a mapping from the constant to the GraphQL type class.
const TypeMap: Map<number, GraphQLType> = new Map()
TypeMap.set(TYPES, GraphQLObjectType)
TypeMap.set(ROOT_TYPES, GraphQLObjectType)
TypeMap.set(INTERFACES, GraphQLInterfaceType)
TypeMap.set(INPUT_TYPES, GraphQLInputObjectType)
TypeMap.set(ENUMS, GraphQLEnumType)
TypeMap.set(UNIONS, GraphQLUnionType)
TypeMap.set(SCALARS, GraphQLScalarType)

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
 *   type: unknown,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>
 *   schema: GraphQLSchema,
 *   context: unknown,
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
 * @param {GraphQLSchema} schema the schema to parse
 * @param {ForEachOfResolver} fn a function with a signature defined above
 * @param {unknown} context usually an object but any mixed value the denotes
 * some shared context as is used with the schema during normal runtime.
 * @param {number} types a bitmask of one or more of the constants defined
 * above. These can be OR'ed together and default to TYPES.
 * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
 * over and returned.
 */
function forEachOf(schema, fn, context, types = ALL) {
  [
    GraphQLObjectType, GraphQLInterfaceType, GraphQLEnumType,
    GraphQLUnionType, GraphQLScalarType
  ].forEach(t => {
    if (!t) return;

    if (
      !Object.getOwnPropertySymbols(t.prototype).includes(Symbol.toStringTag)
    ) {
      Object.defineProperties(t.prototype, {
        [Symbol.toStringTag]: { get() { return this.constructor.name } }
      })
    }
  })

  const typeMap = schema.getTypeMap();

  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];
    const hidden = getNamedType(type).name.startsWith('__')
    const showHidden = (types & HIDDEN) === HIDDEN
    const directives = type && type.astNode && type.astNode.directives || []
    let doIt = (types & ALL) === ALL

    Masks.forEach(mask => {
      if (doIt) {
        return
      }
      else if (
        (mask & ROOT_TYPES) === ROOT_TYPES
        &&
        (
          type === schema.getQueryType()
          || type === schema.getSubscriptionType()
          || type === schema.getMutationType()
        )
      ) {
        doIt = true
        return
      }
      else {
        doIt =
          ((types & mask) === mask) &&
          type instanceof TypeMap.get(mask)
      }
    })

    // Prevent hidden items from being shown unless asked for
    doIt = doIt && (!hidden || (hidden && showHidden))

    if (doIt)
      fn(type, typeName, directives, schema, context)
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
 *   type: unknown,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>,
 *   field: unknown,
 *   fieldName: string,
 *   fieldArgs: Array<GraphQLArgument>,
 *   fieldDirectives: Array<GraphQLDirective>,
 *   schema: GraphQLSchema,
 *   context: unknown
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
 * @param {ForEachFieldResolver} fn a function with a signature defined above
 * @param {unknown} context usually an object but any mixed value the denotes
 * some shared context as is used with the schema during normal runtime.
 */
function forEachField(schema, fn, context, types = ALL) {
  forEachOf(
    schema,
    (type, typeName, _, context, directives) => {
      if (!type._fields) {
        return
      }

      Object.keys(type._fields).forEach(fieldName => {
        let field = type._fields[fieldName]
        let fieldDirectives = field.astNode && field.astNode.directives || []
        let fieldArgs = field.args || []

        fn(
          type,
          typeName,
          directives,
          field,
          fieldName,
          fieldArgs,
          fieldDirectives,
          schema,
          context
        )
      })
    },
    context,
    types
  )
}

export {
  ALL,
  TYPES,
  INTERFACES,
  ENUMS,
  UNIONS,
  SCALARS,
  ROOT_TYPES,
  INPUT_TYPES,
  HIDDEN,

  TypeMap,

  forEachOf,
  forEachField
}

export default forEachOf
