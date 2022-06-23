// @flow

const debug_log = require('debug')('schemata:normal')
const debug_trace = require('debug')('schemata:trace')

import type {
  ASTNode,
  BuildSchemaOptions,
  DirectiveNode,
  EnumValueNode,
  ExecutionResult,
  FieldNode,
  GraphQLFieldResolver,
  GraphQLResolveInfo,
  GraphQLScalarTypeConfig,
  NamedTypeNode,
  ObjMap,
  ParseOptions,
  ScalarTypeDefinitionNode,
  Source,
} from 'graphql'

import {
  defaultFieldResolver,
  extendSchema,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  printSchema,
  printType,
  typeFromAST,
} from 'graphql'

import type {
  ConflictResolvers,
  DirectiveMergeResolver,
  EnumMergeResolver,
  FieldMergeResolver,
  MergeOptionsConfig,
  ResolverArgs,
  ResolverArgsTransformer,
  ResolverMap,
  ScalarMergeResolver,
  SchemaSource,
  UnionMergeResolver,
} from './types'

import { ExtendedResolverMap } from './ExtendedResolverMap'
import { ExtendedResolver } from './ExtendedResolver'
import { inline } from 'ne-tag-fns'
import merge from 'deepmerge'
import Util from 'util'

import {
  forEachOf,
  forEachField,
  ALL,
  TYPES,
  INTERFACES,
  ENUMS,
  UNIONS,
  SCALARS,
  ROOT_TYPES,
  HIDDEN,
} from './forEachOf'

import type { ForEachOfResolver, ForEachFieldResolver } from './forEachOf'

/**
 * A small `String` extension that makes working with SDL/IDL text far easier
 * in both your own libraries as well as in a nodeJS REPL. Built-in to what
 * appears to be a normal String for all intents and purposes, are the ability
 * to transform the string into a set of AST nodes, a built schema or back to
 * the SDL string.
 *
 * @class  Schemata
 */
export class Schemata extends String {
  /**
   * Creates a new `String`, presumably of SDL or IDL. The getter `.valid`
   * will provide some indication as to whether or not the code is valid.
   *
   * @constructor
   * @memberOf Schemata
   *
   * @param {SchemaSource} typeDefs an instance of Schemata, a string of SDL,
   * a Source instance of SDL, a GraphQLSchema or ASTNode that can be printed
   * as an SDL string
   * @param {ResolverMap} resolvers an object containing field resolvers for
   * for the schema represented with this string. [Optional]
   * @param {boolean} buildResolvers if this flag is set to true, build a set
   * of resolvers after the rest of the instance is initialized and set the
   * results on the `.resolvers` property of the newly created instance. If
   * buildResolvers is the string "all", then a resolver for each field not
   * defined will be returned with a `defaultFieldResolver` as its value
   * @param {boolean} flattenResolvers if true, and if `buildResolvers` is true,
   * then make an attempt to flatten the root types to the base of the
   * resolver map object.
   */
  constructor(
    typeDefs: SchemaSource,
    resolvers: ?ResolverMap = null,
    buildResolvers: boolean | string = false,
    flattenResolvers: boolean = false
  ) {
    super(normalizeSource(typeDefs))

    resolvers =
      resolvers ||
      (typeDefs instanceof Schemata && typeDefs.resolvers) ||
      (typeDefs instanceof GraphQLSchema &&
        stripResolversFromSchema(typeDefs)) ||
      null

    this[GRAPHIQL_FLAG] = true
    this[TYPEDEFS_KEY] = normalizeSource(typeDefs)
    this[MAP] = new WeakMap()
    this[MAP].set(
      wmkSchema,
      typeDefs instanceof GraphQLSchema ? typeDefs : null
    )
    this[MAP].set(wmkResolvers, resolvers)
    this[MAP].set(
      wmkPreboundResolvers,
      typeDefs instanceof Schemata ? typeDefs.prevResolverMaps : []
    )

    // Mark a schema passed to use in the constructor as an executable schema
    // to prevent any replacement of the value by getters that generate a
    // schema from the SDL
    if (this[MAP].get(wmkSchema)) {
      this[MAP].get(wmkSchema)[EXE] = true
      this[MAP].get(wmkSchema)[Symbol.for('constructor-supplied-schema')] = true
    }

    // If buildResolvers is true, after the rest is already set and done, go
    // ahead and build a new set of resolver functions for this instance
    if (buildResolvers) {
      if (buildResolvers === 'all') {
        this[MAP].set(
          wmkResolvers,
          this.buildResolverForEachField(flattenResolvers)
        )
      }
      else {
        this[MAP].set(wmkResolvers, this.buildResolvers(flattenResolvers))
      }
    }
  }

  /**
   * Symbol.species ensures that any String methods used on this instance will
   * result in a Schemata instance rather than a String. NOTE: this does not
   * work as expected in current versions of node. This bit of code here is
   * basically a bit of future proofing for when Symbol.species starts working
   * with String extended classes
   *
   * @type {Function}
   */
  static get [Symbol.species](): Function {
    return Schemata
  }

  /**
   * Redefine the iterator for Schemata instances so that they simply show the
   * contents of the SDL/typeDefs.
   *
   * @type {Function}
   */
  get [Symbol.iterator](): Function {
    return function*() {
      yield this.toString()
    }.bind(this)
  }

  /**
   * Ensures that instances of Schemata report internally as Schemata object.
   * Specifically using things like `Object.prototype.toString`.
   *
   * @type {string}
   */
  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  /**
   * Returns the AST nodes for this snippet of SDL. It will throw an error
   * if the string is not valid SDL/IDL.
   *
   * @return {ASTNode} any valid ASTNode supported by GraphQL
   */
  get ast(): ASTNode {
    return this.constructor.parse(this.sdl, false)
  }

  /**
   * Retrieves the `graphiql` flag, which defaults to true. This flag can
   * make setting up an endpoint from a Schemata instance easier with
   * express-graphql
   *
   * @type {boolean}
   */
  get graphiql(): boolean {
    return this[GRAPHIQL_FLAG]
  }

  /**
   * Setter to alter the default 'true' flag to make an Schemata instance a
   * valid single argument to functions like `graphqlHTTP()` from express
   * GraphQL.
   *
   * NOTE: this flag means nothing to the Schemata class but might be useful in
   * your project.
   *
   * @type {boolean} true if graphiql should be started; false otherwise
   */
  set graphiql(value: boolean): void {
    this[GRAPHIQL_FLAG] = value
  }

  /**
   * Returns a GraphQLSchema object. Note this will fail and throw an error
   * if there is not at least one Query, Subscription or Mutation type defined.
   * If there is no stored schema, and there are resolvers, an executable
   * schema is returned instead.
   *
   * @return {GraphQLSchema} an instance of GraphQLSchema if valid SDL
   */
  get schema(): GraphQLSchema {
    const Class = this.constructor
    const resolvers = this.resolvers
    let schema

    // If we have a generated schema already and this instance has a
    // resolvers object that is not falsey, check to see if the object
    // has the executable schema flag set or not. If so, simply return
    // the pre-existing object rather than create a new one.
    if (this[MAP].get(wmkSchema)) {
      schema = this[MAP].get(wmkSchema)

      if (resolvers) {
        // check for the executable schema flag
        if (schema && schema[EXE]) {
          return schema
        }
      }
      else if (schema) {
        return schema
      }
    }

    // Attempt to generate a schema using the SDL for this instance. Throw
    // an error if the SDL is insufficient to generate a GraphQLSchema object
    try {
      debug_log('[get .schema] creating schema from SDL')
      this[MAP].set(wmkSchema, (schema = Class.buildSchema(this.sdl, true)))

      // Now try to handle and ObjectTypeExtensions
      let ast = this.ast

      ast.definitions = [].concat(ast.definitions.filter(
        i => i.kind == 'ObjectTypeExtension'
      ))

      try {
        this[MAP].set(wmkSchema, (schema = extendSchema(schema, ast)))
      }
      catch (error) {
        debug_log('[get .schema] failed to handle extended types')
        debug_trace('[get .schema] ERROR!', error)
      }

    }
    catch (error) {
      debug_log('[get .schema] failed to create schema')
      debug_trace('[get .schema] ERROR!', error)
      return null
    }

    // Only iterate over the fields if there are resolvers set
    if (resolvers) {
      forEachField(
        schema,
        (
          type,
          typeName,
          typeDirectives,
          field,
          fieldName,
          fieldArgs,
          fieldDirectives,
          schema,
          context
        ) => {
          if (!resolvers) {
            return
          }

          if (isRootType(type) && resolvers[fieldName]) {
            field.resolve = resolvers[fieldName]
            field.astNode.resolve = resolvers[fieldName]
          }

          if (resolvers[typeName] && resolvers[typeName][fieldName]) {
            field.resolve = resolvers[typeName][fieldName]
            field.astNode.resolve = resolvers[typeName][fieldName]
          }
        }
      )

      schema[EXE] = true
    }

    // Set the generated schema in the weak map using the weak map key
    this[MAP].set(wmkSchema, schema)

    return schema
  }

  /**
   * Sets a GraphQLSchema object on the internal weak map store. If the value
   * supplied is not truthy (i.e. null, undefined, or even false) then this
   * method deletes any stored schema in the internal map. Otherwise, the
   * supplied value is set on the map and subsequent get calls to `.schema`
   * will return the value supplied.
   *
   * If there are bound resolvers on the supplied schema, a symbol denoting
   * that the schema is an executable schema will be set to prevent it from
   * being overwritten on subsequent get operations. The bound resolvers will
   * be merged with the Schemata's resolvers object.
   *
   * If resolvers are subsequently set on the `Schemata` instance and the
   * supplied schema does not have resolvers bound to it, subsequent get
   * requests for the internal `.schema` may auto-generate a new one with
   * bound resolvers. You have been warned. =)
   *
   * @param {GraphQLSchema} schema an instance of GraphQLSchema instance to
   * store on the internal weak map. Any schema stored here will be modified
   * by methods that do so.
   */
  set schema(schema: ?GraphQLSchema): void {
    debug_log('[set .schema]: ', schema ? 'truthy' : 'falsey')
    debug_trace('[set .schema] ', schema)

    if (!schema) {
      this[MAP].delete(wmkSchema)
    }
    else {
      let schemaResolvers = stripResolversFromSchema(schema)

      if (Object.keys(schemaResolvers).length) {
        schema[EXE] = true

        merge((this.resolvers = this.resolvers || {}), schemaResolvers)
      }

      this[MAP].set(wmkSchema, schema)
    }
  }

  /**
   * Retrieves the `schemaDirectives` value, which defaults to true. This
   * value can make setting up an endpoint from a Schemata instance easier
   * with apollo-server or graphql-yoga or compatible variants. See
   * https://www.apollographql.com/docs/graphql-tools/schema-directives.html
   * if you are using this value with apollo-server.
   *
   * @type {Object}
   */
  get schemaDirectives(): boolean {
    return this[SCHEMA_DIRECTIVES]
  }

  /**
   * Retrieves the `schemaDirectives` value, which defaults to true. This
   * value can make setting up an endpoint from a Schemata instance easier
   * with apollo-server or graphql-yoga or compatible variants. See
   * https://www.apollographql.com/docs/graphql-tools/schema-directives.html
   * if you are using this value with apollo-server.
   *
   * @type {Object}
   */
  set schemaDirectives(value: {string: Function}) {
    this[SCHEMA_DIRECTIVES] = value
  }

  /**
   * When a Schemata instance is merged with another GraphQLSchema, its
   * resolvers get stored before they are wrapped in a function that updates
   * the schema object it receives. This allows them to be wrapped safely at
   * a later date should this instance be merged with another.
   *
   * @return {Array<ExtendedResolverMap>} an array of `ExtendedResolverMap`
   * object instances
   */
  get prevResolverMaps(): Array<ExtendedResolverMap> {
    return this[MAP].get(wmkPreboundResolvers)
  }

  /**
   * Sets the pre-bound resolver map objects as an array of
   * `ExtendedResolverMap` object instances on this instance of Schemata
   *
   * @param {Array<ExtendedResolverMap>} maps an array of `ExtendedResolverMap`
   * object instances
   */
  set prevResolverMaps(maps: Array<ExtendedResolverMap>): void {
    this[MAP].set(wmkPreboundResolvers, maps)
  }

  /**
   * Returns a GraphQLSchema object, pre-bound, to the associated resolvers
   * methods in `.resolvers`. If there are no resolvers, this is essentially
   * the same as asking for a schema instance using `.schema`. If the SDL
   * this instance is built around is insufficient to generate a GraphQLSchema
   * instance, then an error will be thrown.
   *
   * @deprecated use `.schema` instead; this simply proxies to that
   * @return {GraphQLSchema} an instance of GraphQLSchema with pre-bound
   * resolvers
   */
  get executableSchema(): GraphQLSchema {
    return this.schema
  }

  /**
   * Returns the string this instance was generated with.
   *
   * @return {string} the string this class instance represents
   */
  get sdl(): string {
    return this[TYPEDEFS_KEY]
  }

  /**
   * Rewrites the typeDefs or SDL without any `extend type` definitions
   * and returns the modified instance.
   *
   * @return {Schemata} the instance of Schemata this method was called
   * on with modified typeDefs in place.
   */
  flattenSDL(): Schemata {
    if (this.schema) {
      this[TYPEDEFS_KEY] = printSchema(this.schema)
    }

    return this
  }

  /**
   * Returns the regenerated SDL representing the Schema object on this
   * Schemata instance. It does not modify the schemata object instance
   * in any way.
   *
   * @return {String} the regenerated schema SDL from the actual
   * schema object on this schemata instance.
   */
  get flatSDL(): String {
    let sdl = this[TYPEDEFS_KEY]

    if (this.schema) {
      sdl = printSchema(this.schema)
    }

    return sdl
  }

  /**
   * A synonym or alias for `.sdl`. Placed here for the express purpose of
   * destructuing when used with Apollo's makeExecutableSchema or other
   * libraries expecting values of the same name
   *
   * i.e.
   *   // sdl.typeDefs and sdl.resolvers will be where the function expects
   *   let schema = require('graphql-tools').makeExecutableSchema(sdl)
   *
   * @return {string} a string of SDL/IDL for use with graphql
   */
  get typeDefs(): string {
    return this.sdl
  }

  /**
   * Walks the types defined in the sdl for this instance of Schemata and
   * returns an object mapping for those definitions. Given a schema such as
   * ```
   * type A {
   *   a: String
   *   b: [String]
   *   c: [String]!
   * }
   * type Query {
   *   As(name: String): [A]
   * }
   * ```
   * a JavaScript object with properties such as the following will be
   * returned
   * ```
   * {
   *   Query: {
   *     As: { type: '[A]', args: [{ name: 'String' }] }
   *   },
   *   A: {
   *     a: { type: 'String', args: [] },
   *     b: { type: '[String]', args: [] },
   *     c: { type: '[String]!', args: [] }
   *   }
   * }
   * ```
   */
  get types(): Object {
    let types = {}

    this.forEachTypeField((t,tn,td,f,fn,fa,fd,schema,c) => {
      let ast = parse(printType(t)).definitions[0]
      let fieldAST = ast.fields.filter((o,i,a) => o.name.value == fn)
      let fieldType = fieldAST.length && typeFromAST(schema, fieldAST[0].type)
      let args = []

      if (fa && fa.length) {
        for (let {name, type} of fa) {
          args.push({ [name]: type.toString() })
        }
      }

      (types[tn] = types[tn] || {})[fn] = {
        type: fieldType.toString(),
        args: args
      }
    })

    return types
  }

  /**
   * An internal call to buildResolvers(true), thereby requesting a flattened
   * resolver map with Query, Mutation and Subscription fields exposed as root
   * objects the way the Facebook reference implementation expects
   *
   * @return {Object} an object of functions or an empty object otherwise
   */
  get rootValue(): ResolverMap {
    return this.buildResolvers(true)
  }

  /**
   * Returns any resolvers function object associated with this instance.
   *
   * @return {Object} an object containing field resolvers or null if none
   * are stored within
   */
  get resolvers(): ResolverMap {
    return this[MAP].get(wmkResolvers)
  }

  /**
   * A method to fetch a particular field resolver from the schema represented
   * by this Schemata instance.
   *
   * @param {string} type the name of the type desired
   * @param {string} field the name of the field containing the resolver
   * @return {Function} the function resolver for the type and field in
   * question
   */
  schemaResolverFor(type: string, field: string): ?Function {
    if (!this.resolvers || !Object.keys(this.resolvers).length || !this.valid) {
      return null
    }

    let _type = this.schema.getType(type)
    let _field = (_type.getFields() && _type.getFields()[field]) || null
    let resolve = (_field && _field.resolve) || null

    return resolve
  }

  /**
   * Builds a schema based on the SDL in the instance and then parses it to
   * fetch a named field in a named type. If either the type or field are
   * missing or if the SDL cannot be built as a schema, null is returned.
   *
   * @param {string} type the name of a type
   * @param {string} field the name of a field contained in the above type
   * @return {FieldNode} the field reference in the type and field supplied
   */
  schemaFieldByName(type: string, field: string): FieldNode {
    if (!this.validSchema || !this.schema) {
      return null
    }

    let _type = this.schema.getType(type)
    let _field = (_type.getFields() && _type.getFields()[field]) || null

    return _field
  }

  /**
   * For SDL that doesn't properly build into a GraphQLSchema, it can still be
   * parsed and searched for a type by name.
   *
   * @param {string} type the name of a type
   * @return {FieldNode} the field reference in the type and field supplied
   */
  astTypeByName(type: string): ASTNode {
    if (!this.validSDL) {
      return null
    }

    let _type = this.ast.definitions.find(f => f.name.value === type)

    return _type
  }

  /**
   * For SDL that doesn't properly build into a GraphQLSchema, it can still be
   * searched for a type and field.
   *
   * @param {string} type the name of a type
   * @param {string} field the name of a field contained in the above type
   * @return {FieldNode} the field reference in the type and field supplied
   */
  astFieldByName(type: string, field: string): FieldNode {
    if (!this.validSDL) {
      return null
    }

    let _type = this.ast.definitions.find(f => f.name.value === type)
    let _field =
      (_type && _type.fields.find(f => f.name.value === field)) || null

    return _field
  }

  /**
   * Walks the AST for this SDL string and checks for the names of the fields
   * of each of the root types; Query, Mutation and Subscription. If there are
   * no root types defined, false is returned.
   *
   * If there is at least one root type *and* some resolvers *and* at least one
   * of the fields of at least one root type is present in the root of the
   * resolvers map, true is returned. Otherwise, false.
   *
   * @return {boolean} true if the defined resolvers have at least one root
   * type field as a resolver on the root of the resolver map; false otherwise.
   */
  get hasFlattenedResolvers(): boolean {
    let asts = (this.validSDL && this.ast.definitions) || null

    if (!asts || !this.resolvers) {
      return false
    }

    let query = asts.find(f => f.name.value == 'Query')
    let mutation = asts.find(f => f.name.value == 'Mutation')
    let subscription = asts.find(f => f.name.value == 'Subscription')
    let resolvers = this.resolvers

    if (!query && !mutation && !subscription) {
      return false
    }

    for (let type of [query, mutation, subscription]) {
      if (!type || !type.fields) {
        continue
      }

      for (let field of type.fields) {
        if (field.name.value in resolvers) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Merging Schematas are a common feature in the modern world of GraphQL.
   * Especially when there are multiple teams working in tandem. This feature
   * supports merging of types, extended types, interfaces, enums, unions,
   * input object types and directives for all of the above.
   *
   * @param {SchemaSource} schemaLanguage an instance of Schemata, a string of
   * SDL, a Source instance of SDL, a GraphQLSchema or ASTNode that can be
   * printed as an SDL string
   * @param {ConflictResolvers} conflictResolvers an object containing up to
   * four methods, each describing how to handle a conflict when an associated
   * type of conflict occurs. If no object or method are supplied, the right
   * hande value always takes precedence over the existing value; replacing it
   * @return {Schemata} a new instance of Schemata
   */
  mergeSDL(
    schemaLanguage: SchemaSource,
    conflictResolvers: ?ConflictResolvers = DefaultConflictResolvers
  ): Schemata {
    let source = normalizeSource(schemaLanguage, true)

    if (!source) {
      throw new Error(inline`
        The call to mergeSDL(schemaLanguage, conflictResolvers) received an
        invalid value for schemaLanguage. Please check your code and try again.
        Received ${schemaLanguage}.
      `)
    }

    let lAST = this.ast
    let rAST = source.ast
    let _scalarFns = {}

    // Ensure we have default behavior with any custom behavior assigned
    // atop the default ones should only a partial custom be supplied.
    conflictResolvers = merge(DefaultConflictResolvers, conflictResolvers)

    for (let rType of rAST.definitions) {
      let lType = lAST.definitions.find(a => a.name.value == rType.name.value)

      if (
        rType.kind &&
        rType.kind.endsWith &&
        rType.kind.endsWith('Extension')
      ) {
        rType = merge({}, rType)
        rType.kind =
          rType.kind.substring(0, rType.kind.length - 9) + 'Definition'
      }

      if (!lType) {
        lAST.definitions.push(rType)
        continue
      }

      switch (lType.kind) {
      default:
      case 'ObjectTypeDefinition':
      case 'ObjectTypeDefinitionExtension':
      case 'InterfaceTypeDefinition':
      case 'InterfaceTypeDefinitionExtension':
      case 'InputObjectTypeDefinition':
      case 'InputObjectTypeDefinitionExtension':
        combineTypeAndSubType('directives', lType, rType, conflictResolvers)
        combineTypeAndSubType('fields', lType, rType, conflictResolvers)
        break

      case 'EnumTypeDefinition':
        combineTypeAndSubType('directives', lType, rType, conflictResolvers)
        combineTypeAndSubType('values', lType, rType, conflictResolvers)
        break

      case 'UnionTypeDefinition':
        combineTypeAndSubType('directives', lType, rType, conflictResolvers)
        combineTypeAndSubType('types', lType, rType, conflictResolvers)
        break

      case 'ScalarTypeDefinitionNode':
        let lScalar, lScalarConfig, rScalar, rScalarConfig, resolver

        combineTypeAndSubType('directives', lType, rType, conflictResolvers)

        if (this.schema) {
          lScalar = this.schema.getType(lType.name.value)
          lScalarConfig = (lScalar && lScalar._scalarConfig) || null
        }

        if (source.schema) {
          rScalar = source.schema.getType(rType.name.value)
          rScalarConfig = (rScalar && rScalar._scalarConfig) || null
        }

        resolver = (conflictResolvers.scalarMergeResolver ||
            DefaultConflictResolvers.scalarMergeResolver)(
          lType,
          lScalarConfig,
          rType,
          rScalarConfig
        )

        if (resolver) {
          _scalarFns[lType.name.value] = _scalarFns[lType.name.value] || {}
          _scalarFns[lType.name.value] = resolver
        }

        break
      }
    }

    let merged = Schemata.from(this.constructor.gql.print(lAST))

    if (Object.keys(_scalarFns).length) {
      for (let typeName of Object.keys(_scalarFns)) {
        merged.schema.getType(typeName)._scalarConfig = _scalarConfig[typeName]
      }
    }

    return merged
  }

  /**
   * Paring down Schematas can be handy for certain types of schema stitching.
   * The SDL passed in and any associated resolvers will be removed from
   * a copy of the SDL in this Schemata instance represents and the resolver
   * map passed in.
   *
   * @param {SchemaSource} schemaLanguage an instance of Schemata, a string of
   * SDL, a Source instance of SDL, a GraphQLSchema or ASTNode that can be
   * printed as an SDL string
   * @param {ResolverMap} resolverMap an object containing resolver functions,
   * from either those set on this instance or those in the resolverMap added in
   * @return {Schemata} a new Schemata instance with the changed values set
   * on it
   */
  pareSDL(
    schemaLanguage: SchemaSource,
    resolverMap: ?ResolverMap = null
  ): Schemata {
    let source = normalizeSource(schemaLanguage, true)
    if (!source) {
      throw new Error(inline`
        In the call to pareSDL(schemaLanguage), the supplied value for
        \`schemaLanguage\` could not be parsed.
      `)
    }

    if (schemaLanguage instanceof GraphQLSchema && !resolverMap) {
      resolverMap = stripResolversFromSchema(schemaLanguage)
    }

    let resolvers = merge({}, resolverMap || this.resolvers || {})
    let lAST = this.ast
    let rAST = source.ast

    for (let rType of rAST.definitions) {
      let lType = lAST.definitions.find(a => a.name.value == rType.name.value)

      if (
        rType.kind &&
        rType.kind.endsWith &&
        rType.kind.endsWith('Extension')
      ) {
        let len = 'Extension'.length

        rType = merge({}, rType)
        rType.kind =
          rType.kind.substring(0, rType.kind.length - len) + 'Definition'
      }

      if (!lType) {
        lAST.definitions.push(rType)
        continue
      }

      switch (lType.kind) {
      default:
      case 'ObjectTypeDefinition':
      case 'ObjectTypeDefinitionExtension':
      case 'InterfaceTypeDefinition':
      case 'InterfaceTypeDefinitionExtension':
      case 'InputObjectTypeDefinition':
      case 'InputObjectTypeDefinitionExtension':
        pareTypeAndSubType('directives', lType, rType, resolvers)
        pareTypeAndSubType('fields', lType, rType, resolvers)

        if (!lType.fields.length) {
          let index = lAST.definitions.indexOf(lType)

          if (index !== -1) {
            lAST.definitions.splice(index, 1)
          }
        }
        break

      case 'EnumTypeDefinition':
        pareTypeAndSubType('directives', lType, rType, resolvers)
        pareTypeAndSubType('values', lType, rType, resolvers)

        if (!lType.values.length) {
          let index = lAST.definitions.indexOf(lType)

          if (index !== -1) {
            lAST.definitions.splice(index, 1)
          }
        }
        break

      case 'UnionTypeDefinition':
        pareTypeAndSubType('directives', lType, rType, resolvers)
        pareTypeAndSubType('types', lType, rType, resolvers)

        if (!lType.types.length) {
          let index = lAST.definitions.indexOf(lType)

          if (index !== -1) {
            lAST.definitions.splice(index, 1)
          }
        }
        break

      case 'ScalarTypeDefinitionNode':
        let index = lAST.definitions.indexOf(lType)

        if (index !== -1) {
          lAST.definitions.splice(index, 1)
        }
        break
      }
    }

    let result = Schemata.from(this.constructor.gql.print(lAST), resolvers)
    result.schema

    return result
  }

  /**
   * A new Schemata object instance with merged schema definitions as its
   * contents as well as merged resolvers and newly bound executable schema are
   * all created in this step and passed back. The object instance itself is
   * not modified
   *
   * Post merge, the previously stored and merged resolvers map are are applied
   * and a new executable schema is built from the ashes of the old.
   *
   * @param {GraphQLSchema} schema an instance of GraphQLSchema to merge
   * @param {ConflictResolvers} conflictResolvers an object containing up to
   * four methods, each describing how to handle a conflict when an associated
   * type of conflict occurs. If no object or method are supplied, the right
   * hande value always takes precedence over the existing value; replacing it
   * @return {Schemata} a new instance of Schemata with a merged schema string,
   * merged resolver map and newly bound executable schema attached are all
   * initiated
   */
  merge(
    schema: SchemaSource,
    config?: MergeOptionsConfig = DefaultMergeOptions
  ): Schemata {
    if (!schema) {
      throw new Error(inline`
        In the call to mergeSchema(schema), ${schema} was received as a value
        and the code could not proceed because of it. Please check your code
        and try again
      `)
    }

    // Step0: Ensure we have all the defaults for config and schema
    schema = normalizeSource(schema, true)

    if (config !== DefaultMergeOptions) {
      let mergedConfig = merge({}, DefaultMergeOptions)
      config = merge(mergedConfig, config)
    }

    // Step1: Merge SDL; quit at this point if there are no resolvers
    let left = Schemata.from(this, undefined, true)
    let right = Schemata.from(schema, undefined, true)
    let merged = left.mergeSDL(right, config.conflictResolvers)

    // If neither schemata instance has a resolver, there is no reason
    // to continue. Return the merged schemas and call it a day.
    if (
      (!left.resolvers || !Object.keys(left.resolvers).length) &&
      (!right.resolvers || !Object.keys(right.resolvers).length)
    ) {
      return merged
    }

    // Step2: Backup resolvers from left, right, or both
    let lResolvers = left.resolvers
    let rResolvers = right.resolvers
    let prevMaps = (left.prevResolverMaps || []).concat(
      right.prevResolverMaps || [],
      ExtendedResolverMap.from(left),
      ExtendedResolverMap.from(right)
    )
    merged.prevResolverMaps = prevMaps

    // Step3: Merge resolvers
    let mergeResolvers = {}

    if (prevMaps && prevMaps.length) {
      mergeResolvers = prevMaps.reduce((p, c, i, a) => {
        return merge(p, c.resolvers || {})
      }, {})
    }
    else {
      merge(mergeResolvers, left.resolvers)
      merge(mergeResolvers, right.resolvers)
    }
    merged.resolvers = mergeResolvers

    // Step 4: Trigger a new schema creation
    if (config.createMissingResolvers) {
      merged.resolvers = merged.buildResolverForEachField()
    }
    merged.clearSchema()
    merged.schema

    // Step5: Wrap resolvers
    if (config.injectMergedSchema) {
      merged.forEachField(
        (
          type,
          typeName,
          typeDirectives,
          field,
          fieldName,
          fieldArgs,
          fieldDirectives,
          schema,
          context
        ) => {
          if (field.resolve) {
            field.resolve = ExtendedResolver.SchemaInjector(
              field.resolve,
              merged.schema
            )

            if (!merged.resolvers[typeName]) {
              merged.resolvers[typeName] = {}
            }

            merged.resolvers[typeName][fieldName] = field.resolve
          }
        }
      )

      // Do this once more to ensure we are using the modified resolvers
      merged.clearSchema()
      merged.schema
    }

    // Step6: Return final merged product
    return merged
  }

  /**
   * Shortcut for the merge() function; mergeSDL still exists as an entity of
   * itself, but merge() will invoke that function as needed to do its job and
   * if there aren't any resolvers to consider, the functions act identically.
   *
   * @see merge
   *
   * @param {GraphQLSchema} schema an instance of GraphQLSchema to merge
   * @param {ConflictResolvers} conflictResolvers an object containing up to
   * four methods, each describing how to handle a conflict when an associated
   * type of conflict occurs. If no object or method are supplied, the right
   * hande value always takes precedence over the existing value; replacing it
   * @return {Schemata} a new instance of Schemata with a merged schema string,
   * merged resolver map and newly bound executable schema attached are all
   * initiated
   */
  mergeSchema(
    schema: GraphQLSchema | Schemata,
    config?: MergeOptionsConfig = DefaultMergeOptions
  ): Schemata {
    return this.merge(schema, config)
  }

  /**
   * Given a schema, based on the Schemata this object is based on, walk it and
   * build up a resolver map. This function will always return a non-null
   * object. It will be empty if there are either no resolvers to be found
   * in the schema or if a valid schema cannot be created.
   *
   * @param {boolean|ResolverMap} flattenRootResolversOrFirstParam if this
   * value is boolean, and if this value is true, the resolvers from Query,
   * Mutation and Subscription types will be flattened to the root of the
   * object. If the first parametr is an Object, it will be merged in normally
   * with merge.
   * @param {Array<ResolverMap>} ...extendWith an unlimited array of objects
   * that can be used to extend the built resolver map.
   * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
   */
  buildResolvers(
    flattenRootResolversOrFirstParam: boolean | ResolverMap,
    ...extendWith: Array<ResolverMap>
  ): ResolverMap {
    let schemata = Schemata.from(this.sdl, this.resolvers)
    let resolvers = merge(
      {},
      stripResolversFromSchema(schemata.schema) || schemata.resolvers || {}
    )

    // Next check to see if we are flattening or simply extending
    if (typeof flattenRootResolversOrFirstParam === 'boolean') {
      for (let rootType of ['Query', 'Mutation', 'Subscription']) {
        if (flattenRootResolversOrFirstParam) {
          if (resolvers[rootType]) {
            for (let field of Object.keys(resolvers[rootType])) {
              resolvers[field] = resolvers[rootType][field]
              delete resolvers[rootType][field]
            }

            delete resolvers[rootType]
          }
        }
        else {
          for (let field of Object.keys(resolvers)) {
            try {
              debug_log('[buildResolvers()] finding field in schema')
              if (schemata.schemaFieldByName(rootType, field)) {
                resolvers[rootType] = resolvers[rootType] || {}
                resolvers[rootType][field] = resolvers[field]
                delete resolvers[field]
              }
            }
            catch (error) {
              debug_log(inline`
                [buildResolvers()] Falling back to \`astFieldByName()\`
              `)
              debug_trace(
                inline`
                [buildResolvers()] Falling back to \`astFieldByName()\` due to
              `,
                error
              )

              if (schemata.astFieldByName(rootType, field)) {
                resolvers[rootType] = resolvers[rootType] || {}
                resolvers[rootType][field] = resolvers[field]
                delete resolvers[field]
              }
            }
          }
        }
      }
    }
    else {
      resolvers = merge(resolvers || {}, flattenRootResolversOrFirstParam || {})
    }

    // Finally extend with any remaining arguments
    if (extendWith.length) {
      for (let item of extendWith) {
        resolvers = merge(resolvers || {}, item || {})
      }
    }

    return resolvers
  }

  /**
   * From time to time it makes more sense to wrap every possible resolver
   * mapping in given schema. Getting a handle to each fields resolver and
   * or substituting missing ones with GraphQL's defaultFieldResolver can
   * be a tiresome affair. This method walks the schema for you and returns
   * any previously defined resolvers alongside defaultFieldResolvers for
   * each possible field of every type in the schema.
   *
   * If a schema cannot be generated from the SDL represented by the instance
   * of Schemata, then an error is thrown.
   *
   * @param {boolean|ResolverMap} flattenRootResolversOrFirstParam if this
   * value is boolean, and if this value is true, the resolvers from Query,
   * Mutation and Subscription types will be flattened to the root of the
   * object. If the first parametr is an ResolverMap, it will be merged in
   * normally with merge.
   * @param {Array<ResolverMap>} ...extendWith an unlimited array of objects
   * that can be used to extend the built resolver map.
   * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
   */
  buildResolverForEachField(
    flattenRootResolversOrFirstParam: boolean | ResolverMap,
    ...extendWith: Array<ResolverMap>
  ): ResolverMap {
    if (!this.schema) {
      throw new Error(inline`
        buildResolverForEachField() cannot be called unless there is enough
        valid SDL in the instance to construct a schema. Please check your
        code!
      `)
    }

    let interim = Schemata.from(this.sdl, this.resolvers)
    let r = {}

    interim.forEachField(
      (
        type,
        typeName,
        typeDirectives,
        field,
        fieldName,
        fieldArgs,
        fieldDirectives,
        schema,
        context
      ) => {
        // Ensure the path to the type in question exists before continuing
        // onward
        (r[typeName] = r[typeName] || {})[fieldName] =
          (r[typeName][fieldName] || {})

        r[typeName][fieldName] = field.resolve || defaultFieldResolver
      }
    )

    interim.resolvers = r

    return interim.buildResolvers(
      flattenRootResolversOrFirstParam,
      ...extendWith
    )
  }

  /**
   * A method to determine if an executable schema is attached to this Schemata
   * instance. It does so by walking the schema fields via `buildResolvers()`
   * and reporting whether there is anything inside the results or not.
   *
   * @return {boolean} true if there is at least one resolver on at least one
   * field of a type in this Schemata instance's schema.
   */
  get hasAnExecutableSchema(): boolean {
    return Object.keys(this.buildResolvers()).length > 0
  }

  /**
   * If the `.sdl` property is valid SDL/IDL and can generate valid AST nodes
   * this function will return true. It will return false otherwise.
   *
   * @return {boolean} true if the string can be parsed; false otherwise
   */
  get validSDL(): boolean {
    try {
      this.constructor.gql.parse(this.sdl)
      debug_log('[get .validSDL] true')
      return true
    }
    catch (e) {
      debug_log('[get .validSDL] false')
      debug_trace('[get .validSDL] ', e)
      return false
    }
  }

  /**
   * If the `.schema` property is valid SDL/IDL and can generate a valid
   * GraphQLSchema, this function will return true. It will return false
   * otherwise.
   *
   * @return {boolean} true if the string can be parsed into a schema; false
   * otherwise
   */
  get validSchema(): boolean {
    try {
      this.schema
      debug_log('[get .validSchema] true')
      return true
    }
    catch (e) {
      debug_log('[get .validSchema] false')
      debug_trace('[get .validSchema] ', e)
      return false
    }
  }

  /**
   * Returns true if the string underlying this instance represents valid SDL
   * that can be both converted to AST nodes or a valid GraphQLSchema instance
   *
   * @return {boolean} true if it is valid for both `parse()` as well as the
   * `buildSchema()` function
   */
  get valid(): boolean {
    return this.validSDL && this.validSchema
  }

  /**
   * If the internal resolvers object needs to be changed after creation, this
   * method allows a way to do so. Setting the value to `null` is equivalent
   * to removing any stored value. Finally the contents are stored in a weak
   * map so its contents are not guaranteed over a long period of time.
   *
   * @param {ResolverMap} resolvers an object containing field resolvers for
   * this string instance.
   */
  set resolvers(resolvers: ?ResolverMap): void {
    this[MAP].set(wmkResolvers, resolvers)
    this.clearSchema()
  }

  /**
   * Removes the resolver map associated with this Schemata instance
   */
  clearResolvers(): void {
    this.resolvers = null
  }

  /**
   * Removes the schema stored with this Schemata instance
   */
  clearSchema(): void {
    this.schema = null
  }

  /**
   * Returns the underlying string passed or generated in the constructor when
   * inspected in the nodeJS REPL.
   *
   * @return {string} the SDL/IDL string this class was created on
   */
  [Util.inspect.custom](depth, options): string {
    return this.sdl
  }

  /**
   * The same as `inspect()`, `toString()`, and `valueOf()`. This method
   * returns the underlying string this class instance was created on.
   *
   * @return {string} [description]
   */
  toString(): string {
    return this.sdl
  }

  /**
   * The same as `inspect()`, `toString()`, and `valueOf()`. This method
   * returns the underlying string this class instance was created on.
   *
   * @return {string} [description]
   */
  valueOf(): string {
    return this.sdl
  }

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
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachOf(
    fn: ForEachOfResolver,
    context: mixed,
    types: number = TYPES,
    suppliedSchema: ?GraphQLSchema = null
  ): GraphQLSchema {
    let schema = suppliedSchema || this.schema

    forEachOf(schema, fn, context, types)

    return schema
  }

  /**
   * Shortcut to `forEachOf()` specific to types.
   *
   * @see #forEachOf
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this Schemata
   * @return {GraphQLSchema} a new schema is generated from this Schemata,
   * iterated over and returned.
   */
  forEachType(
    fn: ForEachOfResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema
  ): GraphQLSchema {
    return this.forEachOf(fn, context, TYPES, suppliedSchema)
  }

  /**
   * Shortcut to `forEachOf()` specific to input object types.
   *
   * @see #forEachOf
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this Schemata
   * @return {GraphQLSchema} a new schema is generated from this Schemata,
   * iterated
   * over and returned.
   */
  forEachInputObjectType(
    fn: ForEachOfResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema
  ): GraphQLSchema {
    return this.forEachOf(fn, context, INPUT_TYPES, suppliedSchema)
  }

  /**
   * Shortcut to `forEachOf()` specific to unions.
   *
   * @see #forEachOf
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachUnion(
    fn: ForEachOfResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema
  ): GraphQLSchema {
    return this.forEachOf(fn, context, UNIONS, suppliedSchema)
  }

  /**
   * Shortcut to `forEachOf()` specific to enums.
   *
   * @see #forEachOf
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachEnum(
    fn: ForEachOfResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema
  ): GraphQLSchema {
    return this.forEachOf(fn, context, ENUMS, suppliedSchema)
  }

  /**
   * Shortcut to `forEachOf()` specific to interfaces.
   *
   * @see #forEachOf
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachInterface(
    fn: ForEachOfResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema
  ): GraphQLSchema {
    return this.forEachOf(fn, context, INTERFACES, suppliedSchema)
  }

  /**
   * Shortcut to `forEachOf()` specific to types.
   *
   * @see #forEachOf
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL,
   * iterated over and returned.
   */
  forEachScalar(
    fn: ForEachOfResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema
  ): GraphQLSchema {
    return this.forEachOf(fn, context, SCALARS, suppliedSchema)
  }

  /**
   * Shortcut to `forEachOf()` specific to all root types; Query, Mutation and
   * Subscription that exist within the schema.
   *
   * @see #forEachOf
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachRootType(
    fn: ForEachOfResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema
  ): GraphQLSchema {
    return this.forEachOf(fn, context, ROOT_TYPES, suppliedSchema)
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
   *   `typeName`       - the name of the object; "Query" for type Query and
   *                      so on
   *   `typeDirectives` - an array of directives applied to the object or an
   *                      empty array if there are none applied.
   *   `field`          - the field in question from the type
   *   `fieldName`      - the name of the field as a string
   *   `fieldArgs`      - an array of arguments for the field in question
   *   `fieldDirectives`- an array of directives applied to the field or an
   *                      empty array should there be no applied directives
   *   `schema`         - an instance of `GraphQLSchema` over which to iterate
   *   `context`        - usually an object, and usually the same object, passed
   *                      to the call to `makeExecutableSchema()` or `graphql()`
   *
   * @param {Function} fn a function with a signature defined above
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachField(
    fn: ForEachFieldResolver,
    context: mixed,
    types: number = ALL,
    suppliedSchema: ?GraphQLSchema = null
  ): GraphQLSchema {
    let schema = suppliedSchema || this.schema

    forEachField(schema, fn, context, types)

    return schema
  }

  /**
   * `forEachField()` shortcut focusing on GraphQLObjectTypes specifically.
   *
   * @param {ForEachFieldResolver} fn a callback function that is invoked for
   * each field of any GraphQLObjectType found
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
   * to facilitate the task
   */
  forEachTypeField(
    fn: ForEachFieldResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema = null
  ): GraphQLSchema {
    let schema = suppliedSchema || this.schema

    forEachField(schema, fn, context, TYPES)

    return schema
  }

  /**
   * `forEachField()` shortcut focusing on GraphQLInterfaceType specifically.
   *
   * @param {ForEachFieldResolver} fn a callback function that is invoked for
   * each field of any GraphQLObjectType found
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
   * to facilitate the task
   */
  forEachInterfaceField(
    fn: ForEachFieldResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema = null
  ): GraphQLSchema {
    let schema = suppliedSchema || this.schema

    forEachField(schema, fn, context, INTERFACES)

    return schema
  }

  /**
   * `forEachField()` shortcut focusing on GraphQLInputObjectType specifically.
   *
   * @param {ForEachFieldResolver} fn a callback function that is invoked for
   * each field of any GraphQLObjectType found
   * @param {mixed} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
   * to facilitate the task
   */
  forEachInputObjectField(
    fn: ForEachFieldResolver,
    context: mixed,
    suppliedSchema: ?GraphQLSchema = null
  ): GraphQLSchema {
    let schema = suppliedSchema || this.schema

    forEachField(schema, fn, context, INPUT_TYPES)

    return schema
  }

  /**
   * Wrapper for `require('graphql').graphqlSync()` that automatically passes
   * in the internal `.schema` reference as the first parameter.
   *
   * @param {string|Source} query A GraphQL language formatted string
   * representing the requested operation.
   * @param {mixed} contextValue a bit of shared context to pass to resolvers
   * @param {Object} variableValues A mapping of variable name to runtime value
   * to use for all variables defined in the requestString.
   * @param {ResolverMap|null} rootValue provided as the first argument to
   * resolver functions on the top level type (e.g. the query object type).
   * @param {string} operationName The name of the operation to use if
   * requestString contains multiple possible operations. Can be omitted if
   * requestString contains only one operation.
   * @param {GraphQLFieldResolver<any, any>} fieldResolver A resolver function
   * to use when one is not provided by the schema. If not provided, the
   * default field resolver is used (which looks for a value or method on the
   * source value with the field's name).
   * @return {ExecutionResult} the requested results. An error is thrown if
   * the results could not be fulfilled or invalid input/output was specified.
   */
  run(
    query: string | Source,
    contextValue?: mixed,
    variableValues?: ?ObjMap<mixed>,
    rootValue?: mixed,
    operationName?: ?string,
    fieldResolver?: ?GraphQLFieldResolver<any, any>,
    typeResolver?: ?GraphQLTypeResolver<any, any>
  ): ExecutionResult {
    return this.constructor.gql.graphqlSync({
      schema: this.schema,
      source: query,
      rootValue: this.resolvers || rootValue,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
      typeResolver
    })
  }

  /**
   * Wrapper for `require('graphql').graphql()` that automatically passes
   * in the internal `.schema` reference as the first parameter.
   *
   * @param {string|Source} query A GraphQL language formatted string
   * representing the requested operation.
   * @param {mixed} contextValue a bit of shared context to pass to resolvers
   * @param {Object} variableValues A mapping of variable name to runtime value
   * to use for all variables defined in the requestString.
   * @param {ResolverMap|null} The value provided as the first argument to
   * resolver functions on the top level type (e.g. the query object type).
   * @param {string} operationName The name of the operation to use if
   * requestString contains multiple possible operations. Can be omitted if
   * requestString contains only one operation.
   * @param {GraphQLFieldResolver<any, any>} fieldResolver A resolver function
   * to use when one is not provided by the schema. If not provided, the
   * default field resolver is used (which looks for a value or method on the
   * source value with the field's name).
   * @return {Promise<ExecutionResult>} a Promise contianing the requested
   * results
   */
  async runAsync(
    query: string | Source,
    contextValue?: mixed,
    variableValues?: ?ObjMap<mixed>,
    rootValue?: mixed,
    operationName?: ?string,
    fieldResolver?: ?GraphQLFieldResolver<any, any>,
    typeResolver?: ?GraphQLTypeResolver<any, any>
  ): Promise<ExecutionResult> {
    return this.constructor.gql.graphql({
      schema: this.schema,
      source: query,
      rootValue: this.resolvers || rootValue,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
      typeResolver
    })
  }

  /**
   * A little wrapper used to catch any errors thrown when building a schema
   * from the string SDL representation of a given instance.
   *
   * @param {SchemaSource} sdl an instance of Schemata, a string of SDL, a
   * Source instance of SDL, a GraphQLSchema or ASTNode that can be printed as
   * an SDL string
   * @param {boolean} showError true if the error should be thrown, false if
   * the error should be silently suppressed
   * @param {BuildSchemaOptions&ParseOptions} schemaOpts for advanced users,
   * passing through additional buildSchema() options can be done here
   * @return {GraphQLSchema|null} null if an error occurs and errors are not
   * surfaced or a valid GraphQLSchema object otherwise
   */
  static buildSchema(
    sdl: SchemaSource,
    showError: boolean = false,
    schemaOpts: BuildSchemaOptions & ParseOptions = undefined
  ): ?GraphQLSchema {
    try {
      debug_log('[static buildSchema()] normalizing source')
      let source = normalizeSource(sdl)

      debug_log('[static buildSchema()] building schema')
      return this.gql.buildSchema(source, schemaOpts)
    }
    catch (e) {
      debug_log('[static buildSchema()] failed to build!')
      debug_trace('[static buildSchema()] ', e)
      if (showError) {
        throw e
      }
      return null
    }
  }

  /**
   * A little wrapper used to catch any errors thrown when parsing Schemata for
   * ASTNodes. If showError is true, any caught errors are thrown once again.
   *
   * @param {SchemaSource} sdl an instance of Schemata, a string of SDL, a
   * Source instance of SDL, a GraphQLSchema or ASTNode that can be printed as
   * an SDL string
   * @param {boolean} showError if true, any caught errors will be thrown once
   * again
   * @param {boolean} enhance a generator keyed with `Symbol.iterator` is set
   * on the resulting astNode object allowing the resulting `.ast` value to
   * be iterable. The code iterates over each definition of the resulting
   * DocumentNode. This behavior defaults to true and should not have any ill
   * effects on code expecting vanilla ASTNode objects
   * @return {ASTNode|null} null if an error occurs and errors are suppressed,
   * a top level Document ASTNode otherwise
   */
  static parse(
    sdl: SchemaSource,
    showError: boolean = false,
    enhance: boolean = true
  ): ?ASTNode {
    try {
      debug_log('[static parse()] normalizing source')
      let source = normalizeSource(sdl)

      debug_log('[static parse()] parsing')
      let node = this.gql.parse(source)

      if (enhance) {
        debug_log('[static parse()] enhancing')
        node[Symbol.iterator] = function*() {
          for (let node of this.definitions) {
            yield node
          }
        }
      }

      return node
    }
    catch (e) {
      debug_log('[static parse()] failed to parse')
      debug_trace('[static parse()] ', e)
      if (showError) {
        throw e
      }
      return null
    }
  }

  /**
   * A little wrapper used to catch any errors thrown when printing an ASTNode
   * to string form using `require('graphql').print()`. If `showError` is true
   * any thrown errors will be rethrown, otherwise null is returned instead.
   *
   * Should all go as planned, an instance of Schemata wrapped with the printed
   * SDL will be returned.
   *
   * @since 1.7
   *
   * @param {ASTNode|GraphQLSchema} ast an ASTNode, usually a
   * DocumentNode generated with some version of `require('graphql').parse()`.
   * If an instance of GraphQLSchema is supplied, `printSchema()` is used
   * instead of `print()`
   * @param {boolean} showError if true, any caught errors will be thrown once
   * again
   * @return {Schemata|null} null if an error occurs (and showError is false)
   * or an instance of Schemata wrapping the resulting SDL string from the
   * print operation
   */
  static print(
    ast: ASTNode | GraphQLSchema,
    showError: boolean = false
  ): ?Schemata {
    try {
      let source

      if (ast instanceof GraphQLSchema) {
        debug_log('[static print()] printing schema')
        source = this.gql.printSchema(ast)
      }
      else {
        debug_log('[static print()] printing ASTNode')
        source = this.gql.print(ast)
      }

      debug_log('[static print()] creating new Schemata from print')
      return Schemata.from(source)
    }
    catch (e) {
      debug_log('[static print()] failed to print')
      debug_trace('[static print()] ', e)
      if (showError) {
        throw e
      }
      return null
    }
  }

  /**
   * A simple pass thru used within the class to reference graphql methods
   * and classes.
   *
   * @return {mixed} the results of `require('graphql')`
   */
  static get gql(): mixed {
    return require('graphql')
  }

  /**
   * Shorthand way of invoking `new Schemata()`
   *
   * @param {SchemaSource} typeDefs an instance of Schemata, a string of SDL,
   * a Source instance of SDL, a GraphQLSchema or ASTNode that can be printed
   * as an SDL string
   * @param {ResolverMap} resolvers an object containing field resolvers for
   * for the schema represented with this string. [Optional]
   * @param {boolean} buildResolvers if this flag is set to true, build a set
   * of resolvers after the rest of the instance is initialized and set the
   * results on the `.resolvers` property of the newly created instance. If
   * buildResolvers is the string "all", then a resolver for each field not
   * defined will be returned with a `defaultFieldResolver` as its value
   * @param {boolean} flattenResolvers if true, and if `buildResolvers` is true,
   * then make an attempt to flatten the root types to the base of the
   * resolver map object.
   * @return {Schemata} an instance of Schemata
   */
  static from(
    typeDefs: SchemaSource,
    resolvers: ?ResolverMap = null,
    buildResolvers: boolean | string = false,
    flattenResolvers: boolean = false
  ): Schemata {
    return new this(typeDefs, resolvers, buildResolvers, flattenResolvers)
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available type within the schema.
   *
   * @type {number}
   */
  static get ALL(): number {
    return ALL
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available type within the schema.
   *
   * @type {number}
   */
  static get TYPES(): number {
    return TYPES
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available interface within the schema.
   *
   * @type {number}
   */
  static get INTERFACES(): number {
    return INTERFACES
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available enum within the schema.
   *
   * @type {number}
   */
  static get ENUMS(): number {
    return ENUMS
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available union within the schema.
   *
   * @type {number}
   */
  static get UNIONS(): number {
    return UNIONS
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available scalar within the schema.
   *
   * @type {number}
   */
  static get SCALARS(): number {
    return SCALARS
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available root type; Query, Mutation and Subscription
   *
   * @type {number}
   */
  static get ROOT_TYPES(): number {
    return ROOT_TYPES
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available GraphQLInputObjectType within the schema.
   *
   * @type {number}
   */
  static get INPUT_TYPES(): number {
    return INPUT_TYPES
  }

  /**
   * Constant used with `forEachOf()` that signifies you also wish to
   * iterate over the meta types. These are denoted by a leading double
   * underscore.
   *
   * Can be OR'ed together such as `Schemata.TYPES | Schemata.HIDDEN`
   *
   * @type {number}
   */
  static get HIDDEN(): number {
    return HIDDEN
  }
}

/**
 * Given an type, determine if the type is a root type; i.e. one of Query,
 * Mutation or Subscription as defined in the `graphql` library.
 *
 * @param  {mixed} t a GraphQL AST or object type denoting a schema type
 * @return {Boolean} true if the type supplied is a root type; false otherwise
 */
export const isRootType = t => {
  if (t === undefined || t === null || !t) {
    return false
  }

  let name = typeof t.name === 'string' ? t.name : t.name.value

  return (
    t instanceof GraphQLObjectType &&
    (t.name === 'Query' || t.name === 'Mutation' || t.name === 'Subscription')
  )
}

/**
 * Loops over the `resolverInjectors` in the supplied config object and
 * lets each supplied function have a pass to inspect or modify the parameters
 * that will be used to bind future resolver functions.
 *
 * @param {MergeOptionsConfig} config a config object with an array of
 * `ResolverArgsTransformer` functions
 * @param {ResolverArgs} args an object with `source`, `args`, `context`
 * and `info`
 * @return {ResolverArgs} a resulting object with `source`, `args`,
 * `context` and `info`
 */
export function runInjectors(
  config: MergeOptionsConfig,
  resolverArgs: ResolverArgs
): ResolverArgs {
  let args: ResolverArgs

  if (!Array.isArray(config.resolverInjectors)) {
    config.resolverInjectors = [config.resolverInjectors]
  }

  for (let injector of config.resolverInjectors) {
    args = injector(resolverArgs)
  }

  return args
}

/**
 * The merge options config takes the arguments passed into a given `resolve()`
 * function, allowing the implementor to modify the values before passing them
 * back out.
 *
 * This function takes a schema to inject into the info object, or fourth
 * parameter, passed to any resolver. Any `extraConfig` object added in will
 * have its resolverInjectors added to the list to be processed.
 *
 * @param {GraphQLSchema} schema the GraphQLSchema object being inserted
 * @param {MergeOptionsConfig} extraConfig an optional extraConfig option to
 * merge with the resulting output
 * @return {MergeOptionsConfig} a MergeOptionsConfig object that contains at
 * least a single `ResolverArgsTransformer` which injects the supplied `schema`
 * into the `info` object.
 */
export function SchemaInjectorConfig(
  schema: GraphQLSchema,
  extraConfig?: MergeOptionsConfig
): MergeOptionsConfig {
  let baseConfig = {
    resolverInjectors: [
      function __schema_injector__({ source, args, context, info }) {
        info.schema = schema || info.schema
        return { source, args, context, info }
      },
    ],
  }

  if (extraConfig) {
    if (extraConfig.resolverInjectors) {
      if (!Array.isArray(extraConfig.resolverInjectors)) {
        baseConfig.resolverInjectors.push(extraConfig.resolverInjectors)
      }
      else {
        baseConfig.resolverInjectors = baseConfig.resolverInjectors.concat(
          extraConfig.resolverInjectors
        )
      }
    }
  }

  return baseConfig
}

/**
 * Walk the supplied GraphQLSchema instance and retrieve the resolvers stored
 * on it. These values are then returned with a [typeName][fieldName] pathing
 *
 * @param {GraphQLSchema} schema an instance of GraphQLSchema
 * @return {ResolverMap} an object containing a mapping of typeName.fieldName
 * that links to the resolve() function it is associated within the supplied
 * schema
 */
export function stripResolversFromSchema(schema: GraphQLSchema): ?ResolverMap {
  let resolvers = {}

  if (!schema) {
    return null
  }

  forEachField(
    schema,
    (
      type,
      typeName,
      typeDirectives,
      field,
      fieldName,
      fieldArgs,
      fieldDirectives,
      _schema,
      context
    ) => {
      if (field.resolve) {
        resolvers[typeName] = resolvers[typeName] || {}
        resolvers[typeName][fieldName] = resolvers[typeName][fieldName] || {}
        resolvers[typeName][fieldName] = field.resolve
      }
    }
  )

  return resolvers
}

/** @type {Symbol} a unique symbol used as a key to all instance sdl strings */
export const TYPEDEFS_KEY = Symbol('internal-typedefs-key')

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
export const GRAPHIQL_FLAG = Symbol.for('internal-graphiql-key')

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
export const SCHEMA_DIRECTIVES = Symbol.for('internal-directives-key')

/** @type {Symbol} a unique symbol used as a key to all instance `WeakMap`s */
export const MAP = Symbol('internal-weak-map-key')

/** @type {Symbol} a key used to store the __executable__ flag on a schema */
export const EXE = Symbol('executable-schema')

/** @type {Object} a key used to store a resolver object in a WeakMap */
const wmkResolvers = Object(Symbol('GraphQL Resolvers storage key'))

/** @type {Object} a key used to store an internal schema in a WeakMap */
const wmkSchema = Object(Symbol('GraphQLSchema storage key'))

/**
 * This is a `Symbol` key to a `WeakSet` of `ExtendedResolverMap` instances,
 * each of which have at least three properties:
 *
 *  - schema
 *  - sdl
 *  - resolvers
 *
 * One of these are created and added to the set whenever a mergeSchema is
 * performed. On each subsequent mergeSDL/Schema a new instance is added such
 * that new versions exist to be wrapped anew
 *
 * @type {[type]}
 */
const wmkPreboundResolvers = Object(Symbol('Resolvers pre-merge-wrapped'))

/**
 * The default field resolver blindly takes returns the right field. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {FieldNode} leftField The field causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {FieldNode} rightField the field cause the conflict
 *
 * @return {FieldNode} the field that should be used after resolution
 */
export function DefaultFieldMergeResolver(
  leftType: ASTNode,
  leftField: FieldNode,
  rightType: ASTNode,
  rightField: FieldNode
): FieldNode {
  return rightField
}

/**
 * The default directive resolver blindly takes returns the right field. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {DirectiveNode} leftDirective The field causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {DirectiveNode} rightDirective the field cause the conflict
 *
 * @return {DirectiveNode} the directive that should be used after resolution
 */
export function DefaultDirectiveMergeResolver(
  leftType: ASTNode,
  leftDirective: DirectiveNode,
  rightType: ASTNode,
  rightDirective: DirectiveNode
): DirectiveNode {
  return rightDirective
}

/**
 * The default field resolver blindly takes returns the right field. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {DirectiveNode} leftDirective The field causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {DirectiveNode} rightDirective the field cause the conflict
 *
 * @return {DirectiveNode} the directive that should be used after resolution
 */
export function DefaultEnumMergeResolver(
  leftType: ASTNode,
  leftValue: EnumValueNode,
  rightType: ASTNode,
  rightValue: EnumValueNode
): EnumValueNode {
  return rightValue
}

/**
 * The default union resolver blindly takes returns the right type. This
 * resolver is used when one is not specified.
 *
 * @param {ASTNode} leftType The matching left type indicating conflict
 * @param {NamedTypeNode} leftUnion The named node causing the conflict
 * @param {ASTNode} rightType The matching right type indicating conflict
 * @param {NamedTypeNode} rightUnion the named node cause the conflict
 *
 * @return {NamedTypeNode} the directive that should be used after resolution
 */
export function DefaultUnionMergeResolver(
  leftType: ASTNode,
  leftUnion: NamedTypeNode,
  rightType: ASTNode,
  rightUnion: NamedTypeNode
): NamedTypeNode {
  return rightUnion
}

/**
 * The default scalar merge resolver returns the right config when there is
 * one, otherwise the left one or null will be the default result. This is
 * slightly different behavior since resolvers for scalars are not always
 * available.
 *
 * @param {GraphQLScalarTypeConfig} leftConfig *if* there is a resolver defined
 * for the existing ScalarTypeDefinitionNode it will be provided here. If this
 * value is null, there is no availabe config with serialize(), parseValue() or
 * parseLiteral() to work with.
 * @param {ScalarTypeDefinitionNode} rightScalar the definition node found when
 * parsing ASTNodes. This is to be merged value that conflicts with the
 * existing value
 * @param {GraphQLScalarTypeConfig} rightConfig *if* there is a resolver
 * defined for the existing ScalarTypeDefinitionNode it will be provided here.
 * If this value is null, there is no availabe config with serialize(),
 * parseValue() or parseLiteral() to work with.
 * @return {GraphQLScalarTypeConfig} whichever type config or resolver was
 * desired should be returned here.
 *
 * @see https://www.apollographql.com/docs/graphql-tools/scalars.html
 * @see http://graphql.org/graphql-js/type/#graphqlscalartype
 */
export function DefaultScalarMergeResolver(
  leftScalar: ScalarTypeDefinitionNode,
  leftConfig: GraphQLScalarTypeConfig,
  rightScalar: ScalarTypeDefinitionNode,
  rightConfig: GraphQLScalarTypeConfig
): GraphQLScalarTypeConfig {
  return rightConfig ? rightConfig : leftConfig || null
}

/**
 * In order to facilitate merging, there needs to be some contingency plan
 * for what to do when conflicts arise. This object specifies one of each
 * type of resolver. Each simply takes the right-hand value.
 *
 * @type {Object}
 */
export const DefaultConflictResolvers: ConflictResolvers = {
  /** A handler for resolving fields in matching types */
  fieldMergeResolver: DefaultFieldMergeResolver,

  /** A handler for resolving directives in matching types */
  directiveMergeResolver: DefaultDirectiveMergeResolver,

  /** A handler for resolving conflicting enum values */
  enumValueMergeResolver: DefaultEnumMergeResolver,

  /** A handler for resolving type values in unions */
  typeValueMergeResolver: DefaultUnionMergeResolver,

  /** A handler for resolving scalar configs in custom scalars */
  scalarMergeResolver: DefaultScalarMergeResolver,
}

/**
 * A `MergeOptionsConfig` object with an empty array of
 * `ResolverArgsTransformer` instances
 *
 * @type {MergeOptionsConfig}
 */
export const DefaultMergeOptions: MergeOptionsConfig = {
  conflictResolvers: DefaultConflictResolvers,
  resolverInjectors: [],
  injectMergedSchema: true,
  createMissingResolvers: false,
}

const subTypeResolverMap: Map<string, Function> = new Map()
subTypeResolverMap.set('fields', 'fieldMergeResolver')
subTypeResolverMap.set('directives', 'directiveMergeResolver')
subTypeResolverMap.set('values', 'enumValueMergeResolver')
subTypeResolverMap.set('types', 'typeValueMergeResolver')
subTypeResolverMap.set('scalars', 'scalarMergeResolver')

/**
 * Compares and combines a subset of ASTNode fields. Designed to work on all
 * the various types that might have a merge conflict.
 *
 * @param {string} subTypeName the name of the field type; one of the following
 * values: 'fields', 'directives', 'values', 'types'
 * @param {ASTNode} lType the lefthand type containing the subtype to compare
 * @param {ASTNode} lSubType the lefthand subtype; fields, directive, value or
 * named union type
 * @param {ASTNode} rType the righthand type containing the subtype to compare
 * @param {ASTNode} rSubType the righthand subtype; fields, directive, value or
 * named union type
 */
function combineTypeAndSubType(
  subTypeName: string,
  lType: ASTNode,
  rType: ASTNode,
  conflictResolvers: ConflictResolvers = DefaultConflictResolvers
): void {
  if (rType[subTypeName]) {
    for (let rSubType of rType[subTypeName]) {
      let lSubType = lType[subTypeName].find(
        f => f.name.value == rSubType.name.value
      )

      if (!lSubType) {
        lType[subTypeName].push(rSubType)
        continue
      }

      let resolver = subTypeResolverMap.get(subTypeName) || 'fieldMergeResolver'
      let resultingSubType = conflictResolvers[resolver](
        lType,
        lSubType,
        rType,
        rSubType
      )
      let index = lType.fields.indexOf(lSubType)

      lType[subTypeName].splice(index, 1, resultingSubType)
    }
  }
}

/**
 * Compares a subset of ASTNode fields. Designed to work on all the various
 * types that might have a merge conflict.
 *
 * @param {string} subTypeName the name of the field type; one of the following
 * values: 'fields', 'directives', 'values', 'types'
 * @param {ASTNode} lType the lefthand type containing the subtype to compare
 * @param {ASTNode} lSubType the lefthand subtype; fields, directive, value or
 * named union type
 * @param {ASTNode} rType the righthand type containing the subtype to compare
 * @param {ASTNode} rSubType the righthand subtype; fields, directive, value or
 * named union type
 */
function pareTypeAndSubType(
  subTypeName: string,
  lType: ASTNode,
  rType: ASTNode,
  resolvers: ResolverMap = {}
): void {
  for (let rSubType of rType[subTypeName]) {
    let lSubType = lType[subTypeName].find(
      f => f.name.value == rSubType.name.value
    )

    if (!lSubType) {
      continue
    }

    let index = lType.fields.indexOf(lSubType)
    lType[subTypeName].splice(index, 1)

    if (
      resolvers[lType.name.value] &&
      resolvers[lType.name.value][lSubType.name.value]
    ) {
      delete resolvers[lType.name.value][lSubType.name.value]
    }
    else if (resolvers[lSubType.name.value]) {
      delete resolvers[lSubType.name.value]
    }
  }
}

/**
 * Small function that sorts through the typeDefs value supplied which can be
 * any one of a Schemata instance, GraphQLSchema instance, Source instance or a
 * string.
 *
 * @param {SchemaSource} typeDefs an instance of Schemata, a string of SDL,
 * a Source instance of SDL, a GraphQLSchema or ASTNode that can be printed
 * as an SDL string
 * @return {string} a string representing the thing supplied as typeDefs
 */
export function normalizeSource(
  typeDefs: SchemaSource,
  wrap: boolean = false
): string | Schemata {
  if (!typeDefs) {
    throw new Error(inline`
      normalizeSource(typeDefs): typeDefs was invalid when passed to the
      function \`normalizeSource\`. Please check your code and try again.

      (received: ${typeDefs})
    `)
  }

  if (typeDefs instanceof Schemata && typeDefs.valid && wrap) {
    return typeDefs
  }

  let source = (
    typeDefs.body ||
    typeDefs.sdl ||
    (typeof typeDefs === 'string' && typeDefs) ||
    (typeof typeDefs === 'object' && Schemata.print(typeDefs)) ||
    (typeDefs instanceof GraphQLSchema
      ? printSchema(typeDefs)
      : typeDefs.toString())
  ).toString().trim()

  return wrap ? Schemata.from(source) : source
}

export default Schemata
