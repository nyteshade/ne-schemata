"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultConflictResolvers = void 0;
exports.DefaultDirectiveMergeResolver = DefaultDirectiveMergeResolver;
exports.DefaultEnumMergeResolver = DefaultEnumMergeResolver;
exports.DefaultFieldMergeResolver = DefaultFieldMergeResolver;
exports.DefaultMergeOptions = void 0;
exports.DefaultScalarMergeResolver = DefaultScalarMergeResolver;
exports.DefaultUnionMergeResolver = DefaultUnionMergeResolver;
exports.SCHEMA_DIRECTIVES = exports.MAP = exports.GRAPHIQL_FLAG = exports.EXE = void 0;
exports.SchemaInjectorConfig = SchemaInjectorConfig;
exports.isRootType = exports.default = exports.TYPEDEFS_KEY = exports.Schemata = void 0;
exports.normalizeSource = normalizeSource;
exports.runInjectors = runInjectors;
exports.stripResolversFromSchema = stripResolversFromSchema;
var _promises = require("fs/promises");
var _path = require("path");
var _graphql = require("graphql");
var _GraphQLExtension = require("./GraphQLExtension");
var _utils = require("./utils");
var _resolverwork = require("./utils/resolverwork");
var _ExtendedResolverMap = require("./ExtendedResolverMap");
var _ExtendedResolver = require("./ExtendedResolver");
var _neTagFns = require("ne-tag-fns");
var _walkResolverMap = require("./walkResolverMap");
var _deepmerge = _interopRequireDefault(require("deepmerge"));
var _util = _interopRequireDefault(require("util"));
var _forEachOf = require("./forEachOf");
var _dynamicImport = require("./dynamicImport");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// @ts-check

const debug_log = console.log.bind(console);
const debug_trace = console.trace.bind(console);
/**
 * @typedef {import('./forEachOf').ForEachOfResolver} ForEachOfResolver
 * @typedef {import('./forEachOf').ForEachFieldResolver} ForEachFieldResolver
 * @typedef {import('./forEachOf').BitmaskedType} BitmaskedType
 */

/**
 * A small `String` extension that makes working with SDL/IDL text far easier
 * in both your own libraries as well as in a nodeJS REPL. Built-in to what
 * appears to be a normal String for all intents and purposes, are the ability
 * to transform the string into a set of AST nodes, a built schema or back to
 * the SDL string.
 *
 * @class  Schemata
 */
class Schemata extends String {
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
  constructor(typeDefs, resolvers = null, buildResolvers = false, flattenResolvers = false) {
    super(normalizeSource(typeDefs));
    resolvers = resolvers || typeDefs instanceof Schemata && typeDefs.resolvers || typeDefs instanceof _graphql.GraphQLSchema && stripResolversFromSchema(typeDefs) || null;
    this[GRAPHIQL_FLAG] = true;
    this[TYPEDEFS_KEY] = normalizeSource(typeDefs);
    this[MAP] = new WeakMap();
    this[MAP].set(wmkSchema, typeDefs instanceof _graphql.GraphQLSchema ? typeDefs : null);
    this[MAP].set(wmkResolvers, resolvers);
    this[MAP].set(wmkPreboundResolvers, typeDefs instanceof Schemata ? typeDefs.prevResolverMaps : []);

    // Mark a schema passed to use in the constructor as an executable schema
    // to prevent any replacement of the value by getters that generate a
    // schema from the SDL
    if (this[MAP].get(wmkSchema)) {
      this[MAP].get(wmkSchema)[EXE] = true;
      this[MAP].get(wmkSchema)[Symbol.for('constructor-supplied-schema')] = true;
    }

    // If buildResolvers is true, after the rest is already set and done, go
    // ahead and build a new set of resolver functions for this instance
    if (buildResolvers) {
      if (buildResolvers === 'all') {
        this[MAP].set(wmkResolvers, this.buildResolverForEachField(flattenResolvers));
      } else {
        this[MAP].set(wmkResolvers, this.buildResolvers(flattenResolvers));
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
  static get [Symbol.species]() {
    return Schemata;
  }

  /**
   * Redefine the iterator for Schemata instances so that they simply show the
   * contents of the SDL/typeDefs.
   *
   * @type {Function}
   */
  get [Symbol.iterator]() {
    return function* () {
      yield this.toString();
    }.bind(this);
  }

  /**
   * Ensures that instances of Schemata report internally as Schemata object.
   * Specifically using things like `Object.prototype.toString`.
   *
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }

  /**
   * Returns the AST nodes for this snippet of SDL. It will throw an error
   * if the string is not valid SDL/IDL.
   *
   * @return {ASTNode} any valid ASTNode supported by GraphQL
   */
  get ast() {
    return this.constructor.parse(this.sdl, false);
  }

  /**
   * Retrieves the `graphiql` flag, which defaults to true. This flag can
   * make setting up an endpoint from a Schemata instance easier with
   * express-graphql
   *
   * @type {boolean}
   */
  get graphiql() {
    return this[GRAPHIQL_FLAG];
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
  set graphiql(value) {
    this[GRAPHIQL_FLAG] = value;
  }

  /**
   * Returns a GraphQLSchema object. Note this will fail and throw an error
   * if there is not at least one Query, Subscription or Mutation type defined.
   * If there is no stored schema, and there are resolvers, an executable
   * schema is returned instead.
   *
   * @return {GraphQLSchema} an instance of GraphQLSchema if valid SDL
   */
  get schema() {
    return this.#generateSchema();
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
  set schema(schema) {
    debug_log('[set .schema]: ', schema ? 'truthy' : 'falsey');
    debug_trace('[set .schema] ', schema);
    if (!schema) {
      this[MAP].delete(wmkSchema);
    } else {
      let schemaResolvers = stripResolversFromSchema(schema);
      if (Object.keys(schemaResolvers).length) {
        schema[EXE] = true;
        (0, _deepmerge.default)(this.resolvers = this.resolvers || {}, schemaResolvers);
      }
      this[MAP].set(wmkSchema, schema);
    }
  }

  /**
   * Retrieves the `schemaDirectives` value, which defaults to true. This
   * value can make setting up an endpoint from a Schemata instance easier
   * with apollo-server or graphql-yoga or compatible variants. See
   * https://www.apollographql.com/docs/graphql-tools/schema-directives.html
   * if you are using this value with apollo-server.
   *
   * @type {{[string]: Function}}
   */
  get schemaDirectives() {
    return this[SCHEMA_DIRECTIVES];
  }

  /**
   * Retrieves the `schemaDirectives` value, which defaults to true. This
   * value can make setting up an endpoint from a Schemata instance easier
   * with apollo-server or graphql-yoga or compatible variants. See
   * https://the-guild.dev/graphql/tools/docs/schema-directives
   * if you are using this value with apollo-server.
   *
   * @type {{[string]: Function}}
   */
  set schemaDirectives(value) {
    this[SCHEMA_DIRECTIVES] = value;
  }

  /**
   * When a Schemata instance is merged with another GraphQLSchema, its
   * resolvers get stored before they are wrapped in a function that updates
   * the schema object it receives. This allows them to be wrapped safely at
   * a later date should this instance be merged with another.
   *
   * @return {ExtendedResolverMap[]} an array of `ExtendedResolverMap`
   * object instances
   */
  get prevResolverMaps() {
    return this[MAP].get(wmkPreboundResolvers);
  }

  /**
   * Sets the pre-bound resolver map objects as an array of
   * `ExtendedResolverMap` object instances on this instance of Schemata
   *
   * @param {ExtendedResolverMap[]} maps an array of `ExtendedResolverMap`
   * object instances
   */
  set prevResolverMaps(maps) {
    this[MAP].set(wmkPreboundResolvers, maps);
  }

  /**
   * Returns a GraphQLSchema object, pre-bound, to the associated resolvers
   * methods in `.resolvers`. If there are no resolvers, this is essentially
   * the same as asking for a schema instance using `.schema`. If the SDL
   * this instance is built around is insufficient to generate a GraphQLSchema
   * instance, then an error will be thrown.
   *
   * @deprecated use `.schema` instead; this simply proxies to that
   * @type {GraphQLSchema}
   */
  get executableSchema() {
    return this.schema;
  }

  /**
   * Returns the string this instance was generated with.
   *
   * @type {string}
   */
  get sdl() {
    return this[TYPEDEFS_KEY];
  }

  /**
   * Rewrites the typeDefs or SDL without any `extend type` definitions
   * and returns the modified instance.
   *
   * @type {Schemata}
   */
  flattenSDL() {
    if (this.schema) {
      this[TYPEDEFS_KEY] = (0, _graphql.printSchema)(this.schema);
    }
    return this;
  }

  /**
   * Returns the regenerated SDL representing the Schema object on this
   * Schemata instance. It does not modify the schemata object instance
   * in any way.
   *
   * @type {string}
   */
  get flatSDL() {
    let sdl = this[TYPEDEFS_KEY];
    if (this.schema) {
      sdl = (0, _graphql.printSchema)(this.schema);
    }
    return sdl;
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
   * @type {string}
   */
  get typeDefs() {
    return this.sdl;
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
   *
   * @type {object}
   */
  get types() {
    let types = {};
    this.forEachTypeField((t, tn, td, f, fn, fa, fd, schema, c) => {
      let ast = (0, _graphql.parse)((0, _graphql.printType)(t)).definitions[0];
      let fieldAST = ast.fields.filter((o, i, a) => o.name.value == fn);
      let fieldType = fieldAST.length && (0, _graphql.typeFromAST)(schema, fieldAST[0].type);
      let args = [];
      if (fa?.length) {
        for (let {
          name,
          type
        } of fa) {
          args.push({
            [name]: type.toString()
          });
        }
      }
      (types[tn] = types[tn] || {})[fn] = {
        type: fieldType.toString(),
        args: args
      };
    });
    return types;
  }

  /**
   * An internal call to buildResolvers(true), thereby requesting a flattened
   * resolver map with Query, Mutation and Subscription fields exposed as root
   * objects the way the Facebook reference implementation expects
   *
   * @return {ResolverMap} an object of functions or an empty object otherwise
   */
  get rootValue() {
    return this.buildResolvers(true);
  }

  /**
   * Returns any resolvers function object associated with this instance.
   *
   * @return {ResolverMap} an object containing field resolvers or null if none
   * are stored within
   */
  get resolvers() {
    return this[MAP].get(wmkResolvers);
  }

  /**
   * Parses the resolvers object, if present, for any items that need to
   * be applied after the schema is constructed.
   *
   * @return {ResolverInfo[]} an array of objects to process or an empty
   * array if there is nothing to work on
   */
  get resolverInfo() {
    return (0, _resolverwork.extractResolverInfo)(this.resolvers);
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
  schemaResolverFor(type, field) {
    if (!this.resolvers || !Object.keys(this.resolvers).length || !this.valid) {
      return null;
    }
    let _type = this.schema.getType(type);
    let _field = _type.getFields() && _type.getFields()[field] || null;
    let resolve = _field?.resolve || null;
    return resolve;
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
  schemaFieldByName(type, field) {
    if (!this.validSchema || !this.schema) {
      return null;
    }
    let _type = this.schema.getType(type);
    let _field = _type.getFields() && _type.getFields()[field] || null;
    return _field;
  }

  /**
   * For SDL that doesn't properly build into a GraphQLSchema, it can still be
   * parsed and searched for a type by name.
   *
   * @param {string} type the name of a type
   * @return {ASTNode} the field reference in the type and field supplied
   */
  astTypeByName(type) {
    if (!this.validSDL) {
      return null;
    }
    let _type = this.ast.definitions.find(f => f.name.value === type);
    return _type;
  }

  /**
   * For SDL that doesn't properly build into a GraphQLSchema, it can still be
   * searched for a type and field.
   *
   * @param {string} type the name of a type
   * @param {string} field the name of a field contained in the above type
   * @return {FieldNode} the field reference in the type and field supplied
   */
  astFieldByName(type, field) {
    if (!this.validSDL) {
      return null;
    }
    let _type = this.ast.definitions.find(f => f.name.value === type);
    let _field = _type?.fields.find(f => f.name.value === field) || null;
    return _field;
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
  get hasFlattenedResolvers() {
    let asts = this.validSDL && this.ast.definitions || null;
    if (!asts || !this.resolvers) {
      return false;
    }
    let query = asts.find(f => f.name.value == 'Query');
    let mutation = asts.find(f => f.name.value == 'Mutation');
    let subscription = asts.find(f => f.name.value == 'Subscription');
    let resolvers = this.resolvers;
    if (!query && !mutation && !subscription) {
      return false;
    }
    for (let type of [query, mutation, subscription]) {
      if (!type?.fields) {
        continue;
      }
      for (let field of type.fields) {
        if (field.name.value in resolvers) {
          return true;
        }
      }
    }
    return false;
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
  mergeSDL(schemaLanguage, conflictResolvers = DefaultConflictResolvers) {
    let source = normalizeSource(schemaLanguage, true);
    if (!source) {
      throw new Error((0, _neTagFns.inline)`
        The call to mergeSDL(schemaLanguage, conflictResolvers) received an
        invalid value for schemaLanguage. Please check your code and try again.
        Received ${schemaLanguage}.
      `);
    }
    let lAST = this.ast;
    let rAST = source.ast;
    let _scalarFns = {};

    // Ensure we have default behavior with any custom behavior assigned
    // atop the default ones should only a partial custom be supplied.
    conflictResolvers = (0, _deepmerge.default)(DefaultConflictResolvers, conflictResolvers);
    for (let rType of rAST.definitions) {
      let lType = lAST.definitions.find(a => a.name.value == rType.name.value);
      if (rType?.kind?.endsWith('Extension')) {
        rType = (0, _deepmerge.default)({}, rType);
        rType.kind = rType.kind.substring(0, rType.kind.length - 9) + 'Definition';
      }
      if (!lType) {
        lAST.definitions.push(rType);
        continue;
      }
      switch (lType.kind) {
        case 'EnumTypeDefinition':
          combineTypeAndSubType('directives', lType, rType, conflictResolvers);
          combineTypeAndSubType('values', lType, rType, conflictResolvers);
          break;
        case 'UnionTypeDefinition':
          combineTypeAndSubType('directives', lType, rType, conflictResolvers);
          combineTypeAndSubType('types', lType, rType, conflictResolvers);
          break;
        case 'ScalarTypeDefinitionNode':
          {
            let lScalar;
            let lScalarConfig;
            let rScalar;
            let rScalarConfig;
            let resolver;
            combineTypeAndSubType('directives', lType, rType, conflictResolvers);
            if (this.schema) {
              lScalar = this.schema.getType(lType.name.value);
              lScalarConfig = lScalar?._scalarConfig || null;
            }
            if (source.schema) {
              rScalar = source.schema.getType(rType.name.value);
              rScalarConfig = rScalar?._scalarConfig || null;
            }
            resolver = (conflictResolvers.scalarMergeResolver || DefaultConflictResolvers.scalarMergeResolver)(lType, lScalarConfig, rType, rScalarConfig);
            if (resolver) {
              _scalarFns[lType.name.value] = _scalarFns[lType.name.value] || {};
              _scalarFns[lType.name.value] = resolver;
            }
            break;
          }
        case 'ObjectTypeDefinition':
        case 'ObjectTypeDefinitionExtension':
        case 'InterfaceTypeDefinition':
        case 'InterfaceTypeDefinitionExtension':
        case 'InputObjectTypeDefinition':
        case 'InputObjectTypeDefinitionExtension':
        default:
          combineTypeAndSubType('directives', lType, rType, conflictResolvers);
          combineTypeAndSubType('fields', lType, rType, conflictResolvers);
          break;
      }
    }
    let merged = Schemata.from(this.constructor.gql.print(lAST));
    if (Object.keys(_scalarFns).length) {
      for (let typeName of Object.keys(_scalarFns)) {
        merged.schema.getType(typeName)._scalarConfig = _scalarConfig[typeName];
      }
    }
    return merged;
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
  pareSDL(schemaLanguage, resolverMap = null) {
    let source = normalizeSource(schemaLanguage, true);
    if (!source) {
      throw new Error((0, _neTagFns.inline)`
        In the call to pareSDL(schemaLanguage), the supplied value for
        \`schemaLanguage\` could not be parsed.
      `);
    }
    if (schemaLanguage instanceof _graphql.GraphQLSchema && !resolverMap) {
      resolverMap = stripResolversFromSchema(schemaLanguage);
    }
    let resolvers = (0, _deepmerge.default)({}, resolverMap || this.resolvers || {});
    let lAST = this.ast;
    let rAST = source.ast;
    for (let rType of rAST.definitions) {
      let lType = lAST.definitions.find(a => a.name.value == rType.name.value);
      if (rType?.kind?.endsWith('Extension')) {
        let len = 'Extension'.length;
        rType = (0, _deepmerge.default)({}, rType);
        rType.kind = rType.kind.substring(0, rType.kind.length - len) + 'Definition';
      }
      if (!lType) {
        lAST.definitions.push(rType);
        continue;
      }
      switch (lType.kind) {
        case 'EnumTypeDefinition':
          pareTypeAndSubType('directives', lType, rType, resolvers);
          pareTypeAndSubType('values', lType, rType, resolvers);
          if (!lType.values.length) {
            let index = lAST.definitions.indexOf(lType);
            if (index !== -1) {
              lAST.definitions.splice(index, 1);
            }
          }
          break;
        case 'UnionTypeDefinition':
          pareTypeAndSubType('directives', lType, rType, resolvers);
          pareTypeAndSubType('types', lType, rType, resolvers);
          if (!lType.types.length) {
            let index = lAST.definitions.indexOf(lType);
            if (index !== -1) {
              lAST.definitions.splice(index, 1);
            }
          }
          break;
        case 'ScalarTypeDefinitionNode':
          {
            let index = lAST.definitions.indexOf(lType);
            if (index !== -1) {
              lAST.definitions.splice(index, 1);
            }
            break;
          }
        case 'ObjectTypeDefinition':
        case 'ObjectTypeDefinitionExtension':
        case 'InterfaceTypeDefinition':
        case 'InterfaceTypeDefinitionExtension':
        case 'InputObjectTypeDefinition':
        case 'InputObjectTypeDefinitionExtension':
        default:
          pareTypeAndSubType('directives', lType, rType, resolvers);
          pareTypeAndSubType('fields', lType, rType, resolvers);
          if (!lType.fields.length) {
            let index = lAST.definitions.indexOf(lType);
            if (index !== -1) {
              lAST.definitions.splice(index, 1);
            }
          }
          break;
      }
    }
    let result = Schemata.from(this.constructor.gql.print(lAST), resolvers);
    result.#generateSchema();
    return result;
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
   * @param {SchemaSource} schema an instance of GraphQLSchema to merge
   * @param {MergeOptionsConfig} config an object defining how conflicts should
   * be resolved. This defaults to `DefaultMergeOptions`.
   * @return {Schemata} a new instance of Schemata with a merged schema string,
   * merged resolver map and newly bound executable schema attached are all
   * initiated
   */
  merge(schema, config = DefaultMergeOptions) {
    if (!schema) {
      throw new Error((0, _neTagFns.inline)`
        In the call to mergeSchema(schema), ${schema} was received as a value
        and the code could not proceed because of it. Please check your code
        and try again
      `);
    }

    // Step0: Ensure we have all the defaults for config and schema
    schema = normalizeSource(schema, true);
    if (config !== DefaultMergeOptions) {
      let mergedConfig = (0, _deepmerge.default)({}, DefaultMergeOptions);
      config = (0, _deepmerge.default)(mergedConfig, config);
    }

    // Step1: Merge SDL; quit at this point if there are no resolvers
    let left = Schemata.from(this, undefined, true);
    let right = Schemata.from(schema, undefined, true);
    let merged = left.mergeSDL(right, config.conflictResolvers);

    // If neither schemata instance has a resolver, there is no reason
    // to continue. Return the merged schemas and call it a day.
    if ((!left.resolvers || !Object.keys(left.resolvers).length) && (!right.resolvers || !Object.keys(right.resolvers).length)) {
      return merged;
    }

    // Step2: Backup resolvers from left, right, or both
    let prevMaps = (left.prevResolverMaps || []).concat(right.prevResolverMaps || [], _ExtendedResolverMap.ExtendedResolverMap.from(left), _ExtendedResolverMap.ExtendedResolverMap.from(right));
    merged.prevResolverMaps = prevMaps;

    // Step3: Merge resolvers
    let mergeResolvers = {};
    if (prevMaps?.length) {
      mergeResolvers = prevMaps.reduce((p, c, i, a) => {
        return (0, _deepmerge.default)(p, c.resolvers || {});
      }, {});
    } else {
      (0, _deepmerge.default)(mergeResolvers, left.resolvers);
      (0, _deepmerge.default)(mergeResolvers, right.resolvers);
    }
    merged.resolvers = mergeResolvers;

    // Step 4: Trigger a new schema creation
    if (config.createMissingResolvers) {
      merged.resolvers = merged.buildResolverForEachField();
    }
    merged.clearSchema();
    merged.#generateSchema();

    // Step5: Wrap resolvers
    if (config.injectMergedSchema) {
      merged.forEachField((type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) => {
        if (field.resolve) {
          field.resolve = _ExtendedResolver.ExtendedResolver.SchemaInjector(field.resolve, merged.schema);
          if (!merged.resolvers[typeName]) {
            merged.resolvers[typeName] = {};
          }
          merged.resolvers[typeName][fieldName] = field.resolve;
        }
      });

      // Do this once more to ensure we are using the modified resolvers
      merged.clearSchema();
      merged.#generateSchema();
    }

    // Step6: Return final merged product
    return merged;
  }

  /**
   * Shortcut for the merge() function; mergeSDL still exists as an entity of
   * itself, but merge() will invoke that function as needed to do its job and
   * if there aren't any resolvers to consider, the functions act identically.
   *
   * @see merge
   *
   * @param {GraphQLSchema | Schemata} schema an instance of GraphQLSchema to
   * merge. Can be either a GraphQLSchema or a Schemata instance
   * @param {MergeOptionsConfig} config an object defining how conflicts should
   * be resolved. This defaults to `DefaultMergeOptions`.
   * @return {Schemata} a new instance of Schemata with a merged schema string,
   * merged resolver map and newly bound executable schema attached are all
   * initiated
   */
  mergeSchema(schema, config = DefaultMergeOptions) {
    return this.merge(schema, config);
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
   * @param {ResolverMap[]} extendWith an unlimited array of objects
   * that can be used to extend the built resolver map.
   * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
   */
  buildResolvers(flattenRootResolversOrFirstParam, ...extendWith) {
    let schemata = Schemata.from(this.sdl, this.resolvers);
    let resolvers = (0, _deepmerge.default)({}, stripResolversFromSchema(schemata.schema) || schemata.resolvers || {});

    // Next check to see if we are flattening or simply extending
    if (typeof flattenRootResolversOrFirstParam === 'boolean') {
      for (let rootType of ['Query', 'Mutation', 'Subscription']) {
        if (flattenRootResolversOrFirstParam) {
          if (resolvers[rootType]) {
            for (let field of Object.keys(resolvers[rootType])) {
              resolvers[field] = resolvers[rootType][field];
              delete resolvers[rootType][field];
            }
            delete resolvers[rootType];
          }
        } else {
          for (let field of Object.keys(resolvers)) {
            try {
              debug_log('[buildResolvers()] finding field in schema');
              if (schemata.schemaFieldByName(rootType, field)) {
                resolvers[rootType] = resolvers[rootType] || {};
                resolvers[rootType][field] = resolvers[field];
                delete resolvers[field];
              }
            } catch (error) {
              debug_log((0, _neTagFns.inline)`
                [buildResolvers()] Falling back to \`astFieldByName()\`
              `);
              debug_trace((0, _neTagFns.inline)`
                [buildResolvers()] Falling back to \`astFieldByName()\` due to
              `, error);
              if (schemata.astFieldByName(rootType, field)) {
                resolvers[rootType] = resolvers[rootType] || {};
                resolvers[rootType][field] = resolvers[field];
                delete resolvers[field];
              }
            }
          }
        }
      }
    } else {
      resolvers = (0, _deepmerge.default)(resolvers || {}, flattenRootResolversOrFirstParam || {});
    }

    // Finally extend with any remaining arguments
    if (extendWith.length) {
      for (let item of extendWith) {
        resolvers = (0, _deepmerge.default)(resolvers || {}, item || {});
      }
    }
    return resolvers;
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
   * @param {ResolverMap[]} extendWith an unlimited array of objects
   * that can be used to extend the built resolver map.
   * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
   */
  buildResolverForEachField(flattenRootResolversOrFirstParam, ...extendWith) {
    if (!this.schema) {
      throw new Error((0, _neTagFns.inline)`
        buildResolverForEachField() cannot be called unless there is enough
        valid SDL in the instance to construct a schema. Please check your
        code!
      `);
    }
    let interim = Schemata.from(this.sdl, this.resolvers);
    let r = {};
    interim.forEachField((type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) => {
      // Ensure the path to the type in question exists before continuing
      // onward
      (r[typeName] = r[typeName] || {})[fieldName] = r[typeName][fieldName] || {};
      r[typeName][fieldName] = field.resolve || _graphql.defaultFieldResolver;
    });
    interim.resolvers = r;
    return interim.buildResolvers(flattenRootResolversOrFirstParam, ...extendWith);
  }

  /**
   * A method to determine if an executable schema is attached to this Schemata
   * instance. It does so by walking the schema fields via `buildResolvers()`
   * and reporting whether there is anything inside the results or not.
   *
   * @type {boolean}
   */
  get hasAnExecutableSchema() {
    return Object.keys(this.buildResolvers()).length > 0;
  }

  /**
   * If the `.sdl` property is valid SDL/IDL and can generate valid AST nodes
   * this function will return true. It will return false otherwise.
   *
   * @type {boolean}
   */
  get validSDL() {
    try {
      this.constructor.gql.parse(this.sdl);
      debug_log('[get .validSDL] true');
      return true;
    } catch (e) {
      debug_log('[get .validSDL] false');
      debug_trace('[get .validSDL] ', e);
      return false;
    }
  }

  /**
   * If the `.schema` property is valid SDL/IDL and can generate a valid
   * GraphQLSchema, this function will return true. It will return false
   * otherwise.
   *
   * @type {boolean}
   */
  get validSchema() {
    try {
      this.#generateSchema();
      debug_log('[get .validSchema] true');
      return true;
    } catch (e) {
      debug_log('[get .validSchema] false');
      debug_trace('[get .validSchema] ', e);
      return false;
    }
  }

  /**
   * Returns true if the string underlying this instance represents valid SDL
   * that can be both converted to AST nodes or a valid GraphQLSchema instance
   *
   * @type {boolean}
   */
  get valid() {
    return this.validSDL && this.validSchema;
  }

  /**
   * If the internal resolvers object needs to be changed after creation, this
   * method allows a way to do so. Setting the value to `null` is equivalent
   * to removing any stored value. Finally the contents are stored in a weak
   * map so its contents are not guaranteed over a long period of time.
   *
   * @type {ResolverMap}
   */
  set resolvers(resolvers) {
    this[MAP].set(wmkResolvers, resolvers);
    this.clearSchema();
  }

  /**
   * Removes the resolver map associated with this Schemata instance
   */
  clearResolvers() {
    this.resolvers = null;
  }

  /**
   * Removes the schema stored with this Schemata instance
   */
  clearSchema() {
    this.schema = null;
  }

  /**
   * Returns the underlying string passed or generated in the constructor when
   * inspected in the nodeJS REPL.
   *
   * @return {string} returns the underlying SDL/IDL string this Schemata
   * instance is based on.
   */
  [_util.default.inspect.custom]() {
    return this.sdl;
  }

  /**
   * The same as `inspect()`, `toString()`, and `valueOf()`. This method
   * returns the underlying string this class instance was created on.
   *
   * @return {string} returns the underlying SDL/IDL string this Schemata
   * instance is based on.
   */
  toString() {
    return this.sdl;
  }

  /**
   * The same as `inspect()`, `toString()`, and `valueOf()`. This method
   * returns the underlying string this class instance was created on.
   *
   * @return {string} returns the underlying SDL/IDL string this Schemata
   * instance is based on.
   */
  valueOf() {
    return this.sdl;
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
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {number} types a bitmask of one or more of the constants defined
   * above. These can be OR'ed together and default to TYPES.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachOf(fn, context, types, suppliedSchema = null) {
    let schema = suppliedSchema || this.schema;
    (0, _forEachOf.forEachOf)(schema, fn, context, types);
    return schema;
  }

  /**
   * Shortcut to `forEachOf()` specific to types.
   *
   * @see #forEachOf
   *
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this Schemata
   * @return {GraphQLSchema} a new schema is generated from this Schemata,
   * iterated over and returned.
   */
  forEachType(fn, context, suppliedSchema = null) {
    return this.forEachOf(fn, context, _forEachOf.TYPES, suppliedSchema);
  }

  /**
   * Shortcut to `forEachOf()` specific to input object types.
   *
   * @see #forEachOf
   *
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this Schemata
   * @return {GraphQLSchema} a new schema is generated from this Schemata,
   * iterated
   * over and returned.
   */
  forEachInputObjectType(fn, context, suppliedSchema = null) {
    return this.forEachOf(fn, context, INPUT_TYPES, suppliedSchema);
  }

  /**
   * Shortcut to `forEachOf()` specific to unions.
   *
   * @see #forEachOf
   *
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachUnion(fn, context, suppliedSchema = null) {
    return this.forEachOf(fn, context, _forEachOf.UNIONS, suppliedSchema);
  }

  /**
   * Shortcut to `forEachOf()` specific to enums.
   *
   * @see #forEachOf
   *
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachEnum(fn, context, suppliedSchema = null) {
    return this.forEachOf(fn, context, _forEachOf.ENUMS, suppliedSchema);
  }

  /**
   * Shortcut to `forEachOf()` specific to interfaces.
   *
   * @see #forEachOf
   *
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachInterface(fn, context, suppliedSchema = null) {
    return this.forEachOf(fn, context, _forEachOf.INTERFACES, suppliedSchema);
  }

  /**
   * Shortcut to `forEachOf()` specific to types.
   *
   * @see #forEachOf
   *
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL,
   * iterated over and returned.
   */
  forEachScalar(fn, context, suppliedSchema = null) {
    return this.forEachOf(fn, context, _forEachOf.SCALARS, suppliedSchema);
  }

  /**
   * Shortcut to `forEachOf()` specific to all root types; Query, Mutation and
   * Subscription that exist within the schema.
   *
   * @see #forEachOf
   *
   * @param {ForEachOfResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachRootType(fn, context, suppliedSchema = null) {
    return this.forEachOf(fn, context, _forEachOf.ROOT_TYPES, suppliedSchema);
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
   * Types, or BitmaskedType values, are defined as the following bitmask
   * constant values. They help the function understand which GraphQL subtype
   * should be iterated over. It defaults to ALL.
   *
   * const ALL = 1
   * const TYPES = 2
   * const INTERFACES = 4
   * const ENUMS = 8
   * const UNIONS = 16
   * const SCALARS = 32
   * const ROOT_TYPES = 64
   * const INPUT_TYPES = 128
   * const HIDDEN = 256
   *
   * @param {ForEachFieldResolver} fn a function with a signature defined above
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {BitmaskedType?} types one of the BitmaskedType values. See above.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
   * over and returned.
   */
  forEachField(fn, context, types = _forEachOf.ALL, suppliedSchema = null) {
    let schema = suppliedSchema || this.schema;
    (0, _forEachOf.forEachField)(schema, fn, context, types);
    return schema;
  }

  /**
   * `forEachField()` shortcut focusing on GraphQLObjectTypes specifically.
   *
   * @param {ForEachFieldResolver} fn a callback function that is invoked for
   * each field of any GraphQLObjectType found
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
   * to facilitate the task
   */
  forEachTypeField(fn, context, suppliedSchema = null) {
    let schema = suppliedSchema || this.schema;
    (0, _forEachOf.forEachField)(schema, fn, context, _forEachOf.TYPES);
    return schema;
  }

  /**
   * `forEachField()` shortcut focusing on GraphQLInterfaceType specifically.
   *
   * @param {ForEachFieldResolver} fn a callback function that is invoked for
   * each field of any GraphQLObjectType found
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
   * to facilitate the task
   */
  forEachInterfaceField(fn, context, suppliedSchema = null) {
    let schema = suppliedSchema || this.schema;
    (0, _forEachOf.forEachField)(schema, fn, context, _forEachOf.INTERFACES);
    return schema;
  }

  /**
   * `forEachField()` shortcut focusing on GraphQLInputObjectType specifically.
   *
   * @param {ForEachFieldResolver} fn a callback function that is invoked for
   * each field of any GraphQLObjectType found
   * @param {unknown} context usually an object but any mixed value the denotes
   * some shared context as is used with the schema during normal runtime.
   * @param {GraphQLSchema?} suppliedSchema an optional schema to use rather
   * than the one created or stored internally generated from this SDL
   * @return {GraphQLSchema} either the supplied GraphQLSchema or one generated
   * to facilitate the task
   */
  forEachInputObjectField(fn, context, suppliedSchema = null) {
    let schema = suppliedSchema || this.schema;
    (0, _forEachOf.forEachField)(schema, fn, context, INPUT_TYPES);
    return schema;
  }

  /**
   * Wrapper for `require('graphql').graphqlSync()` that automatically passes
   * in the internal `.schema` reference as the first parameter.
   * @template TSource the value being resolved. This is the object that needs
   * to be typed.
   * @template TArgs the type of the arguments passed to the field in the
   * GraphQL query.
   * @template TContext the context object passed to the resolver. This can
   * contain useful data like the current user or database connection.
   * @param {string|Source} query A GraphQL language formatted string
   * representing the requested operation.
   * @param {unknown?} contextValue a bit of shared context to pass to resolvers
   * @param {ObjMap?} variableValues A mapping of variable name to runtime value
   * to use for all variables defined in the requestString.
   * @param {ResolverMap?} rootValue provided as the first argument to
   * resolver functions on the top level type (e.g. the query object type).
   * @param {string?} operationName The name of the operation to use if
   * requestString contains multiple possible operations. Can be omitted if
   * requestString contains only one operation.
   * @param {GraphQLFieldResolver<TSource, TArgs, TContext>?} fieldResolver A
   * resolver function to use when one is not provided by the schema. If not
   * provided, the default field resolver is used (which looks for a value or
   * method on the source value with the field's name).
   * @param {GraphQLTypeResolver<TSource,TContext>?} typeResolver A resolver is
   * a function type used to determine the concrete type of an object when
   * resolving an interface or union type.
   * @return {ExecutionResult} the requested results. An error is thrown if
   * the results could not be fulfilled or invalid input/output was specified.
   */
  run(query, contextValue, variableValues, rootValue, operationName, fieldResolver, typeResolver) {
    return this.constructor.gql.graphqlSync({
      schema: this.schema,
      source: query,
      rootValue: this.resolvers || rootValue,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
      typeResolver
    });
  }

  /**
   * Wrapper for `require('graphql').graphql()` that automatically passes
   * in the internal `.schema` reference as the first parameter.
   *
   * @template TSource the value being resolved. This is the object that needs
   * to be typed.
   * @template TArgs the type of the arguments passed to the field in the
   * GraphQL query.
   * @template TContext the context object passed to the resolver. This can
   * contain useful data like the current user or database connection.
   * @param {string|Source} query A GraphQL language formatted string
   * representing the requested operation.
   * @param {unknown?} contextValue a bit of shared context to pass to resolvers
   * @param {Object?} variableValues A mapping of variable name to runtime value
   * to use for all variables defined in the requestString.
   * @param {ResolverMap?} The value provided as the first argument to
   * resolver functions on the top level type (e.g. the query object type).
   * @param {string?} operationName The name of the operation to use if
   * requestString contains multiple possible operations. Can be omitted if
   * requestString contains only one operation.
   * @param {GraphQLFieldResolver<TSource, TArgs, TContext>?} fieldResolver A
   * resolver function to use when one is not provided by the schema. If not
   * provided, the default field resolver is used (which looks for a value or
   * method on the source value with the field's name).
   * @param {GraphQLTypeResolver<TSource,TContext>?} typeResolver A resolver is
   * a function type used to determine the concrete type of an object when
   * resolving an interface or union type.
   * @return {Promise<ExecutionResult>} a Promise contianing the requested
   * results
   */
  async runAsync(query, contextValue, variableValues, rootValue, operationName, fieldResolver, typeResolver) {
    return this.constructor.gql.graphql({
      schema: this.schema,
      source: query,
      rootValue: this.resolvers || rootValue,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
      typeResolver
    });
  }

  /**
   * A little wrapper used to catch any errors thrown when building a schema
   * from the string SDL representation of a given instance.
   *
   * @param {SchemaSource} sdl an instance of Schemata, a string of SDL, a
   * Source instance of SDL, a GraphQLSchema or ASTNode that can be printed as
   * an SDL string
   * @param {boolean} [showError=false] true if the error should be thrown,
   * false if the error should be silently suppressed
   * @param {BuildSchemaOptions&ParseOptions} [schemaOpts=undefined] for
   * advanced users, passing through additional buildSchema() options can be
   * done here
   * @return {GraphQLSchema} null if an error occurs and errors are not
   * surfaced or a valid GraphQLSchema object otherwise
   */
  static buildSchema(sdl, showError = false, schemaOpts = undefined) {
    try {
      debug_log('[static buildSchema()] normalizing source');
      let source = normalizeSource(sdl);
      debug_log('[static buildSchema()] building schema');
      return this.gql.buildSchema(source, schemaOpts);
    } catch (e) {
      debug_log('[static buildSchema()] failed to build!');
      debug_trace('[static buildSchema()] ', e);
      if (showError) {
        throw e;
      }
      return null;
    }
  }

  /**
   * A little wrapper used to catch any errors thrown when parsing Schemata for
   * ASTNodes. If showError is true, any caught errors are thrown once again.
   *
   * @param {SchemaSource} sdl an instance of Schemata, a string of SDL, a
   * Source instance of SDL, a GraphQLSchema or ASTNode that can be printed as
   * an SDL string
   * @param {boolean} [showError=false] if true, any caught errors will be thrown once
   * again
   * @param {boolean} [enhance=true] a generator keyed with `Symbol.iterator` is set
   * on the resulting astNode object allowing the resulting `.ast` value to
   * be iterable. The code iterates over each definition of the resulting
   * DocumentNode. This behavior defaults to true and should not have any ill
   * effects on code expecting vanilla ASTNode objects
   * @return {ASTNode} null if an error occurs and errors are suppressed,
   * a top level Document ASTNode otherwise
   */
  static parse(sdl, showError = false, enhance = true) {
    try {
      debug_log('[static parse()] normalizing source');
      let source = normalizeSource(sdl);
      debug_log('[static parse()] parsing');
      let node = this.gql.parse(source);
      if (enhance) {
        debug_log('[static parse()] enhancing');
        node[Symbol.iterator] = function* () {
          for (let node of this.definitions) {
            yield node;
          }
        };
      }
      return node;
    } catch (e) {
      debug_log('[static parse()] failed to parse');
      debug_trace('[static parse()] ', e);
      if (showError) {
        throw e;
      }
      return null;
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
   * @param {boolean?} [showError=false] if true, any caught errors will be
   * thrown once again
   * @return {Schemata} null if an error occurs (and showError is false)
   * or an instance of Schemata wrapping the resulting SDL string from the
   * print operation
   */
  static print(ast, showError = false) {
    try {
      let source;
      if (ast instanceof _graphql.GraphQLSchema) {
        debug_log('[static print()] printing schema');
        source = this.gql.printSchema(ast);
      } else {
        debug_log('[static print()] printing ASTNode');
        source = this.gql.print(ast);
      }
      debug_log('[static print()] creating new Schemata from print');
      return Schemata.from(source);
    } catch (e) {
      debug_log('[static print()] failed to print');
      debug_trace('[static print()] ', e);
      if (showError) {
        throw e;
      }
      return null;
    }
  }

  /**
   * A simple pass thru used within the class to reference graphql methods
   * and classes.
   *
   * @return {object} the results of `require('graphql')`
   */
  static get gql() {
    return require('graphql');
  }

  /**
   * Shorthand way of invoking `new Schemata()`
   *
   * @param {SchemaSource} typeDefs an instance of Schemata, a string of SDL,
   * a Source instance of SDL, a GraphQLSchema or ASTNode that can be printed
   * as an SDL string
   * @param {ResolverMap} [resolvers=null] an object containing field resolvers
   * for for the schema represented with this string.
   * @param {boolean|string} [buildResolvers=false] if this flag is set to
   * true, build a set of resolvers after the rest of the instance is
   * initialized and set the results on the `.resolvers` property of the newly
   * created instance. If buildResolvers is the string "all", then a resolver
   * for each field not defined will be returned with a `defaultFieldResolver`
   * as its value
   * @param {boolean} [flattenResolvers=false] if true, and if `buildResolvers`
   * is true, then make an attempt to flatten the root types to the base of the
   * resolver map object.
   * @return {Schemata} an instance of Schemata
   */
  static from(typeDefs, resolvers = null, buildResolvers = false, flattenResolvers = false) {
    return new this(typeDefs, resolvers, buildResolvers, flattenResolvers);
  }

  /**
   * Shorthand way of invoking `new Schemata()` after the function reads the
   * contents of the file specified at the supplied path.
   *
   * @param {string} path path to the file to read the contents of
   * @return {Schemata} an instance of Schemata
   */
  static async fromContentsOf(path) {
    const resolved = (0, _path.resolve)(path);
    const contents = (await (0, _promises.readFile)(resolved))?.toString();
    return Schemata.from(contents);
  }

  /**
   * Walks a given directory and its subdirectories to find any files with the
   * `.graphql/.sdl/.type[dD]ef` extension were found. If an adjacent, or
   * otherwise specified, file with a `.js/.cjs/.mjs` extension is found,
   * and successfully read, then its resolvers are added to the final Schemata
   * output. A schema with any associated actionable resolver is returned as
   * and executable schema.
   *
   * @param {string} path a file path to the directory where scanning should
   * start to occur.
   * @param {Object} [options=undefined] an object that allows the developer
   * to configure how conflicts are resolved (rather than just taking the
   * latest value as an override to any previously existing resolver) as well
   * as a way to specify where resolver files of the same name as the
   * .graphql/.sdl/.typeDef file should exist; if not alongside the SDL file
   * itself.
   * @param {
   *   function(
   *     existingResolver: ResolverProperty,
   *     newResolver: ResolverProperty
   *   ): ResolverProperty
   * } [options.conflictResolver] - A function to resolve conflicts between
   * existing and new resolvers.
   * @param {string[]} [options.gqExts] - An array of extensions with a
   * preceding period, that will match the SDL files in the supplied directory.
   * This defaults to `['.graphql', '.gql', '.sdl', '.typedef']`
   * @param [string[]] [options.jsExts] - An array of extensions with a
   * preceding period, that will match the resolver JavaScript files. This
   * defaults to `['.js', '.cjs', '.mjs']`
   * @param {string|string[]} [options.resolversRoots] - The root directory, or
   * directories, where resolver files should exist. If this value is falsy,
   * the expected root is in the same directory as the SDL file.
   * @param {string} [options.projectRoot] - The root directory of the project,
   * relative to the nearest package.json if no value is supplied.
   * @returns {Schemata?} an instance of Schemata, optionally made executable
   * if adjacent or otherwise specified .js/.ts/.cjs/.mjs files were located
   */
  static async buildFromDir(path, options = {
    conflictResolver(_, newResolver) {
      return newResolver.value;
    },
    gqExts: ['.graphql', '.gql', '.sdl', '.typedef'],
    jsExts: ['.js', '.cjs', '.mjs'],
    resolversRoots: undefined,
    projectRoot: undefined
  }) {
    const parseAndRemoveExtension = path => ({
      // path.parse of fully resolved path string
      ...(0, _path.parse)((0, _path.resolve)(path)),
      // remove any existing extension and clear base so pathFormat works
      ...{
        base: '',
        ext: ''
      }
    });
    const isDirectory = async path => await (0, _utils.asyncTryCatch)(async () => (await (0, _promises.stat)(path)).isDirectory(), false);
    const rePathDir = (await isDirectory((0, _path.resolve)(path))) ? (0, _path.resolve)(path) : (0, _path.resolve)(parseAndRemoveExtension(path).dir);
    const rePath = rePathDir;
    const gqExts = options?.gqExts ?? ['.graphql', '.gql', '.sdl', '.typedef'];
    const jsExts = options?.jsExts ?? ['.js', '.cjs', '.mjs', '.ts'];
    const uniqueStems = [
    // Ensure unique file paths (sans extension)
    ...new Set(await [...(await (0, _promises.readdir)(rePath, {
      recursive: true
    }))].reduce(async (asyncPrevious, current) => {
      const previous = await asyncPrevious;
      const fullPath = (0, _path.resolve)((0, _path.join)(rePath, current));
      const isDir = await isDirectory(fullPath);
      console.log(previous, fullPath, isDir);
      try {
        if (!isDir) {
          previous.push((0, _path.format)(parseAndRemoveExtension(fullPath)));
        }
      } catch (skip) {}
      return previous;
    }, []))];
    const conflictResolver = options?.conflictResolver ?? ((_, n) => n.value);
    const projectRoot = options?.projectRoot ?? (await (0, _dynamicImport.guessProjectRoot)());
    const resolverRoots = options?.resolverRoots ? Array.isArray(options?.resolverRoots) ? options?.resolverRoots : [String(options?.resolverRoots)] : [rePath];
    const paths = {
      sdl: [],
      resolver: [],
      unknown: [],
      hasValues: false
    };
    console.log({
      uniqueStems,
      projectRoot,
      resolverRoots
    });
    for (const resolverRoot of resolverRoots) {
      for (const stem of uniqueStems) {
        const stemParsed = parseAndRemoveExtension(stem);
        const rootRelative = resolverRoot.includes(projectRoot) ? (0, _path.resolve)((0, _path.join)((0, _path.relative)(projectRoot, resolverRoot), stemParsed.name)) : (0, _path.resolve)((0, _path.join)(resolverRoot, stemParsed.name));
        const results = await (0, _GraphQLExtension.resolvedPaths)(rootRelative, [...gqExts, ...jsExts]);
        console.log({
          rootRelative,
          results
        });
        if (results.hasValues) {
          paths.sdl = paths.sdl.concat(results.sdl);
          paths.resolver = paths.resolver.concat(results.resolver);
          paths.unknown = paths.unknown.concat(results.unknown);
          paths.hasValues = paths.hasValues || results.hasValues;
        }
      }
    }
    console.log({
      paths
    });
    const {
      schemata
    } = await (0, _GraphQLExtension.importResolvedGraphQL)(paths, {
      conflictResolver
    });
    return schemata;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available type within the schema.
   *
   * @type {number}
   */
  static get ALL() {
    return _forEachOf.ALL;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available type within the schema.
   *
   * @type {number}
   */
  static get TYPES() {
    return _forEachOf.TYPES;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available interface within the schema.
   *
   * @type {number}
   */
  static get INTERFACES() {
    return _forEachOf.INTERFACES;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available enum within the schema.
   *
   * @type {number}
   */
  static get ENUMS() {
    return _forEachOf.ENUMS;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available union within the schema.
   *
   * @type {number}
   */
  static get UNIONS() {
    return _forEachOf.UNIONS;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available scalar within the schema.
   *
   * @type {number}
   */
  static get SCALARS() {
    return _forEachOf.SCALARS;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available root type; Query, Mutation and Subscription
   *
   * @type {number}
   */
  static get ROOT_TYPES() {
    return _forEachOf.ROOT_TYPES;
  }

  /**
   * Constant used with `forEachOf()` that signifies you wish to iterate
   * over every available GraphQLInputObjectType within the schema.
   *
   * @type {number}
   */
  static get INPUT_TYPES() {
    return INPUT_TYPES;
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
  static get HIDDEN() {
    return _forEachOf.HIDDEN;
  }

  /**
     * Returns a GraphQLSchema object. Note this will fail and throw an error
     * if there is not at least one Query, Subscription or Mutation type defined.
     * If there is no stored schema, and there are resolvers, an executable
     * schema is returned instead.
     *
     * @return {GraphQLSchema} an instance of GraphQLSchema if valid SDL
     */
  #generateSchema() {
    const Class = this.constructor;
    const resolvers = this.resolvers;
    let schema;

    // If we have a generated schema already and this instance has a
    // resolvers object that is not falsey, check to see if the object
    // has the executable schema flag set or not. If so, simply return
    // the pre-existing object rather than create a new one.
    if (this[MAP].get(wmkSchema)) {
      schema = this[MAP].get(wmkSchema);
      if (resolvers) {
        // check for the executable schema flag
        if (schema?.[EXE]) {
          return schema;
        }
      } else if (schema) {
        return schema;
      }
    }

    // Attempt to generate a schema using the SDL for this instance. Throw
    // an error if the SDL is insufficient to generate a GraphQLSchema object
    try {
      debug_log('[get .schema] creating schema from SDL');
      this[MAP].set(wmkSchema, schema = Class.buildSchema(this.sdl, true));

      // Now try to handle and ObjectTypeExtensions
      let ast = this.ast;
      ast.definitions = [].concat(ast.definitions.filter(i => i.kind == 'ObjectTypeExtension'));
      try {
        this[MAP].set(wmkSchema, schema = (0, _graphql.extendSchema)(schema, ast));
      } catch (error) {
        debug_log('[get .schema] failed to handle extended types');
        debug_trace('[get .schema] ERROR!', error);
      }
    } catch (error) {
      debug_log('[get .schema] failed to create schema');
      debug_trace('[get .schema] ERROR!', error);
      return null;
    }

    // Only iterate over the fields if there are resolvers set
    if (resolvers) {
      (0, _forEachOf.forEachField)(schema, (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) => {
        if (isRootType(type) && resolvers[fieldName]) {
          field.resolve = resolvers[fieldName];
          field.astNode.resolve = resolvers[fieldName];
        }
        if (resolvers?.[typeName]?.[fieldName]) {
          field.resolve = resolvers[typeName][fieldName];
          field.astNode.resolve = resolvers[typeName][fieldName];
        }
      });
      this.resolverInfo.forEach(resolverInfo => {
        resolverInfo.applyTo(schema);
      });
      schema[EXE] = true;
    }

    // Set the generated schema in the weak map using the weak map key
    this[MAP].set(wmkSchema, schema);
    return schema;
  }
}

/**
 * Given an type, determine if the type is a root type; i.e. one of Query,
 * Mutation or Subscription as defined in the `graphql` library.
 *
 * @param  {unknown} t a GraphQL AST or object type denoting a schema type
 * @return {Boolean} true if the type supplied is a root type; false otherwise
 */
exports.Schemata = Schemata;
const isRootType = t => {
  if (t === undefined || t === null || !t) {
    return false;
  }
  return t instanceof _graphql.GraphQLObjectType && ['Query', 'Mutation', 'Subscription'].includes(t.name);
};

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
exports.isRootType = isRootType;
function runInjectors(config, resolverArgs) {
  let args;
  if (!Array.isArray(config.resolverInjectors)) {
    config.resolverInjectors = [config.resolverInjectors];
  }
  for (let injector of config.resolverInjectors) {
    args = injector(resolverArgs);
  }
  return args;
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
function SchemaInjectorConfig(schema, extraConfig) {
  let baseConfig = {
    resolverInjectors: [function __schema_injector__({
      source,
      args,
      context,
      info
    }) {
      info.schema = schema || info.schema;
      return {
        source,
        args,
        context,
        info
      };
    }]
  };
  if (extraConfig) {
    if (extraConfig.resolverInjectors) {
      if (!Array.isArray(extraConfig.resolverInjectors)) {
        baseConfig.resolverInjectors.push(extraConfig.resolverInjectors);
      } else {
        baseConfig.resolverInjectors = baseConfig.resolverInjectors.concat(extraConfig.resolverInjectors);
      }
    }
  }
  return baseConfig;
}

/**
 * Walk the supplied GraphQLSchema instance and retrieve the resolvers stored
 * on it. These values are then returned with a [typeName][fieldName] pathing
 *
 * @param {GraphQLSchema} schema an instance of GraphQLSchema
 * @return {ResolverMap?} an object containing a mapping of typeName.fieldName
 * that links to the resolve() function it is associated within the supplied
 * schema
 */
function stripResolversFromSchema(schema) {
  let resolvers = {};
  if (!schema) {
    return null;
  }
  (0, _forEachOf.forEachField)(schema, (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, _schema, context) => {
    if (field.resolve) {
      resolvers[typeName] = resolvers[typeName] || {};
      resolvers[typeName][fieldName] = resolvers[typeName][fieldName] || {};
      resolvers[typeName][fieldName] = field.resolve;
    }
  });
  return resolvers;
}

/** @type {Symbol} a unique symbol used as a key to all instance sdl strings */
const TYPEDEFS_KEY = exports.TYPEDEFS_KEY = Symbol('internal-typedefs-key');

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
const GRAPHIQL_FLAG = exports.GRAPHIQL_FLAG = Symbol.for('internal-graphiql-key');

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
const SCHEMA_DIRECTIVES = exports.SCHEMA_DIRECTIVES = Symbol.for('internal-directives-key');

/** @type {Symbol} a unique symbol used as a key to all instance `WeakMap`s */
const MAP = exports.MAP = Symbol('internal-weak-map-key');

/** @type {Symbol} a key used to store the __executable__ flag on a schema */
const EXE = exports.EXE = Symbol('executable-schema');

/** @type {Object} a key used to store a resolver object in a WeakMap */
const wmkResolvers = Object(Symbol('GraphQL Resolvers storage key'));

/** @type {Object} a key used to store an internal schema in a WeakMap */
const wmkSchema = Object(Symbol('GraphQLSchema storage key'));

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
const wmkPreboundResolvers = Object(Symbol('Resolvers pre-merge-wrapped'));

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
function DefaultFieldMergeResolver(leftType, leftField, rightType, rightField) {
  return rightField;
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
function DefaultDirectiveMergeResolver(leftType, leftDirective, rightType, rightDirective) {
  return rightDirective;
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
function DefaultEnumMergeResolver(leftType, leftValue, rightType, rightValue) {
  return rightValue;
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
function DefaultUnionMergeResolver(leftType, leftUnion, rightType, rightUnion) {
  return rightUnion;
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
function DefaultScalarMergeResolver(leftScalar, leftConfig, rightScalar, rightConfig) {
  return (rightConfig || leftConfig) ?? null;
}

/**
 * In order to facilitate merging, there needs to be some contingency plan
 * for what to do when conflicts arise. This object specifies one of each
 * type of resolver. Each simply takes the right-hand value.
 *
 * @type {Object}
 */
const DefaultConflictResolvers = exports.DefaultConflictResolvers = {
  /** A handler for resolving fields in matching types */
  fieldMergeResolver: DefaultFieldMergeResolver,
  /** A handler for resolving directives in matching types */
  directiveMergeResolver: DefaultDirectiveMergeResolver,
  /** A handler for resolving conflicting enum values */
  enumValueMergeResolver: DefaultEnumMergeResolver,
  /** A handler for resolving type values in unions */
  typeValueMergeResolver: DefaultUnionMergeResolver,
  /** A handler for resolving scalar configs in custom scalars */
  scalarMergeResolver: DefaultScalarMergeResolver
};

/**
 * A `MergeOptionsConfig` object with an empty array of
 * `ResolverArgsTransformer` instances
 *
 * @type {MergeOptionsConfig}
 */
const DefaultMergeOptions = exports.DefaultMergeOptions = {
  conflictResolvers: DefaultConflictResolvers,
  resolverInjectors: [],
  injectMergedSchema: true,
  createMissingResolvers: false
};
const subTypeResolverMap = new Map();
subTypeResolverMap.set('fields', 'fieldMergeResolver');
subTypeResolverMap.set('directives', 'directiveMergeResolver');
subTypeResolverMap.set('values', 'enumValueMergeResolver');
subTypeResolverMap.set('types', 'typeValueMergeResolver');
subTypeResolverMap.set('scalars', 'scalarMergeResolver');

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
function combineTypeAndSubType(subTypeName, lType, rType, conflictResolvers = DefaultConflictResolvers) {
  if (rType[subTypeName]) {
    for (let rSubType of rType[subTypeName]) {
      let lSubType = lType[subTypeName].find(f => f.name.value == rSubType.name.value);
      if (!lSubType) {
        lType[subTypeName].push(rSubType);
        continue;
      }
      let resolver = subTypeResolverMap.get(subTypeName) || 'fieldMergeResolver';
      let resultingSubType = conflictResolvers[resolver](lType, lSubType, rType, rSubType);
      let index = lType.fields.indexOf(lSubType);
      lType[subTypeName].splice(index, 1, resultingSubType);
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
function pareTypeAndSubType(subTypeName, lType, rType, resolvers = {}) {
  for (let rSubType of rType[subTypeName]) {
    let lSubType = lType[subTypeName].find(f => f.name.value == rSubType.name.value);
    if (!lSubType) {
      continue;
    }
    let index = lType.fields.indexOf(lSubType);
    lType[subTypeName].splice(index, 1);
    if (resolvers?.[lType.name.value]?.[lSubType.name.value]) {
      delete resolvers[lType.name.value][lSubType.name.value];
    } else if (resolvers[lSubType.name.value]) {
      delete resolvers[lSubType.name.value];
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
function normalizeSource(typeDefs, wrap = false) {
  if (!typeDefs) {
    throw new Error((0, _neTagFns.inline)`
      normalizeSource(typeDefs): typeDefs was invalid when passed to the
      function \`normalizeSource\`. Please check your code and try again.

      (received: ${typeDefs})
    `);
  }
  if (typeDefs instanceof Schemata && typeDefs.valid && wrap) {
    return typeDefs;
  }
  let source = (typeDefs.body || typeDefs.sdl || typeof typeDefs === 'string' && typeDefs || typeof typeDefs === 'object' && Schemata.print(typeDefs) || (typeDefs instanceof _graphql.GraphQLSchema ? (0, _graphql.printSchema)(typeDefs) : typeDefs.toString())).toString().trim();
  return wrap ? Schemata.from(source) : source;
}
var _default = exports.default = Schemata;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcHJvbWlzZXMiLCJyZXF1aXJlIiwiX3BhdGgiLCJfZ3JhcGhxbCIsIl9HcmFwaFFMRXh0ZW5zaW9uIiwiX3V0aWxzIiwiX3Jlc29sdmVyd29yayIsIl9FeHRlbmRlZFJlc29sdmVyTWFwIiwiX0V4dGVuZGVkUmVzb2x2ZXIiLCJfbmVUYWdGbnMiLCJfd2Fsa1Jlc29sdmVyTWFwIiwiX2RlZXBtZXJnZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfdXRpbCIsIl9mb3JFYWNoT2YiLCJfZHluYW1pY0ltcG9ydCIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImRlYnVnX2xvZyIsImNvbnNvbGUiLCJsb2ciLCJiaW5kIiwiZGVidWdfdHJhY2UiLCJ0cmFjZSIsIlNjaGVtYXRhIiwiU3RyaW5nIiwiY29uc3RydWN0b3IiLCJ0eXBlRGVmcyIsInJlc29sdmVycyIsImJ1aWxkUmVzb2x2ZXJzIiwiZmxhdHRlblJlc29sdmVycyIsIm5vcm1hbGl6ZVNvdXJjZSIsIkdyYXBoUUxTY2hlbWEiLCJzdHJpcFJlc29sdmVyc0Zyb21TY2hlbWEiLCJHUkFQSElRTF9GTEFHIiwiVFlQRURFRlNfS0VZIiwiTUFQIiwiV2Vha01hcCIsInNldCIsIndta1NjaGVtYSIsIndta1Jlc29sdmVycyIsIndta1ByZWJvdW5kUmVzb2x2ZXJzIiwicHJldlJlc29sdmVyTWFwcyIsImdldCIsIkVYRSIsIlN5bWJvbCIsImZvciIsImJ1aWxkUmVzb2x2ZXJGb3JFYWNoRmllbGQiLCJzcGVjaWVzIiwiaXRlcmF0b3IiLCJ0b1N0cmluZyIsInRvU3RyaW5nVGFnIiwibmFtZSIsImFzdCIsInBhcnNlIiwic2RsIiwiZ3JhcGhpcWwiLCJ2YWx1ZSIsInNjaGVtYSIsImdlbmVyYXRlU2NoZW1hIiwiZGVsZXRlIiwic2NoZW1hUmVzb2x2ZXJzIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIm1lcmdlIiwic2NoZW1hRGlyZWN0aXZlcyIsIlNDSEVNQV9ESVJFQ1RJVkVTIiwibWFwcyIsImV4ZWN1dGFibGVTY2hlbWEiLCJmbGF0dGVuU0RMIiwicHJpbnRTY2hlbWEiLCJmbGF0U0RMIiwidHlwZXMiLCJmb3JFYWNoVHlwZUZpZWxkIiwidCIsInRuIiwidGQiLCJmIiwiZm4iLCJmYSIsImZkIiwiYyIsInByaW50VHlwZSIsImRlZmluaXRpb25zIiwiZmllbGRBU1QiLCJmaWVsZHMiLCJmaWx0ZXIiLCJvIiwiaSIsImEiLCJmaWVsZFR5cGUiLCJ0eXBlRnJvbUFTVCIsInR5cGUiLCJhcmdzIiwicHVzaCIsInJvb3RWYWx1ZSIsInJlc29sdmVySW5mbyIsImV4dHJhY3RSZXNvbHZlckluZm8iLCJzY2hlbWFSZXNvbHZlckZvciIsImZpZWxkIiwidmFsaWQiLCJfdHlwZSIsImdldFR5cGUiLCJfZmllbGQiLCJnZXRGaWVsZHMiLCJyZXNvbHZlIiwic2NoZW1hRmllbGRCeU5hbWUiLCJ2YWxpZFNjaGVtYSIsImFzdFR5cGVCeU5hbWUiLCJ2YWxpZFNETCIsImZpbmQiLCJhc3RGaWVsZEJ5TmFtZSIsImhhc0ZsYXR0ZW5lZFJlc29sdmVycyIsImFzdHMiLCJxdWVyeSIsIm11dGF0aW9uIiwic3Vic2NyaXB0aW9uIiwibWVyZ2VTREwiLCJzY2hlbWFMYW5ndWFnZSIsImNvbmZsaWN0UmVzb2x2ZXJzIiwiRGVmYXVsdENvbmZsaWN0UmVzb2x2ZXJzIiwic291cmNlIiwiRXJyb3IiLCJpbmxpbmUiLCJsQVNUIiwickFTVCIsIl9zY2FsYXJGbnMiLCJyVHlwZSIsImxUeXBlIiwia2luZCIsImVuZHNXaXRoIiwic3Vic3RyaW5nIiwiY29tYmluZVR5cGVBbmRTdWJUeXBlIiwibFNjYWxhciIsImxTY2FsYXJDb25maWciLCJyU2NhbGFyIiwiclNjYWxhckNvbmZpZyIsInJlc29sdmVyIiwiX3NjYWxhckNvbmZpZyIsInNjYWxhck1lcmdlUmVzb2x2ZXIiLCJtZXJnZWQiLCJmcm9tIiwiZ3FsIiwicHJpbnQiLCJ0eXBlTmFtZSIsInBhcmVTREwiLCJyZXNvbHZlck1hcCIsImxlbiIsInBhcmVUeXBlQW5kU3ViVHlwZSIsInZhbHVlcyIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsInJlc3VsdCIsImNvbmZpZyIsIkRlZmF1bHRNZXJnZU9wdGlvbnMiLCJtZXJnZWRDb25maWciLCJsZWZ0IiwidW5kZWZpbmVkIiwicmlnaHQiLCJwcmV2TWFwcyIsImNvbmNhdCIsIkV4dGVuZGVkUmVzb2x2ZXJNYXAiLCJtZXJnZVJlc29sdmVycyIsInJlZHVjZSIsInAiLCJjcmVhdGVNaXNzaW5nUmVzb2x2ZXJzIiwiY2xlYXJTY2hlbWEiLCJpbmplY3RNZXJnZWRTY2hlbWEiLCJmb3JFYWNoRmllbGQiLCJ0eXBlRGlyZWN0aXZlcyIsImZpZWxkTmFtZSIsImZpZWxkQXJncyIsImZpZWxkRGlyZWN0aXZlcyIsImNvbnRleHQiLCJFeHRlbmRlZFJlc29sdmVyIiwiU2NoZW1hSW5qZWN0b3IiLCJtZXJnZVNjaGVtYSIsImZsYXR0ZW5Sb290UmVzb2x2ZXJzT3JGaXJzdFBhcmFtIiwiZXh0ZW5kV2l0aCIsInNjaGVtYXRhIiwicm9vdFR5cGUiLCJlcnJvciIsIml0ZW0iLCJpbnRlcmltIiwiciIsImRlZmF1bHRGaWVsZFJlc29sdmVyIiwiaGFzQW5FeGVjdXRhYmxlU2NoZW1hIiwiY2xlYXJSZXNvbHZlcnMiLCJVdGlsIiwiaW5zcGVjdCIsImN1c3RvbSIsInZhbHVlT2YiLCJmb3JFYWNoT2YiLCJzdXBwbGllZFNjaGVtYSIsImZvckVhY2hUeXBlIiwiVFlQRVMiLCJmb3JFYWNoSW5wdXRPYmplY3RUeXBlIiwiSU5QVVRfVFlQRVMiLCJmb3JFYWNoVW5pb24iLCJVTklPTlMiLCJmb3JFYWNoRW51bSIsIkVOVU1TIiwiZm9yRWFjaEludGVyZmFjZSIsIklOVEVSRkFDRVMiLCJmb3JFYWNoU2NhbGFyIiwiU0NBTEFSUyIsImZvckVhY2hSb290VHlwZSIsIlJPT1RfVFlQRVMiLCJBTEwiLCJmb3JFYWNoSW50ZXJmYWNlRmllbGQiLCJmb3JFYWNoSW5wdXRPYmplY3RGaWVsZCIsInJ1biIsImNvbnRleHRWYWx1ZSIsInZhcmlhYmxlVmFsdWVzIiwib3BlcmF0aW9uTmFtZSIsImZpZWxkUmVzb2x2ZXIiLCJ0eXBlUmVzb2x2ZXIiLCJncmFwaHFsU3luYyIsInJ1bkFzeW5jIiwiZ3JhcGhxbCIsImJ1aWxkU2NoZW1hIiwic2hvd0Vycm9yIiwic2NoZW1hT3B0cyIsImVuaGFuY2UiLCJub2RlIiwiZnJvbUNvbnRlbnRzT2YiLCJwYXRoIiwicmVzb2x2ZWQiLCJwYXRoUmVzb2x2ZSIsImNvbnRlbnRzIiwicmVhZEZpbGUiLCJidWlsZEZyb21EaXIiLCJvcHRpb25zIiwiY29uZmxpY3RSZXNvbHZlciIsIl8iLCJuZXdSZXNvbHZlciIsImdxRXh0cyIsImpzRXh0cyIsInJlc29sdmVyc1Jvb3RzIiwicHJvamVjdFJvb3QiLCJwYXJzZUFuZFJlbW92ZUV4dGVuc2lvbiIsInBhdGhQYXJzZSIsImJhc2UiLCJleHQiLCJpc0RpcmVjdG9yeSIsImFzeW5jVHJ5Q2F0Y2giLCJzdGF0IiwicmVQYXRoRGlyIiwiZGlyIiwicmVQYXRoIiwidW5pcXVlU3RlbXMiLCJTZXQiLCJyZWFkZGlyIiwicmVjdXJzaXZlIiwiYXN5bmNQcmV2aW91cyIsImN1cnJlbnQiLCJwcmV2aW91cyIsImZ1bGxQYXRoIiwicGF0aEpvaW4iLCJpc0RpciIsInBhdGhGb3JtYXQiLCJza2lwIiwibiIsImd1ZXNzUHJvamVjdFJvb3QiLCJyZXNvbHZlclJvb3RzIiwiQXJyYXkiLCJpc0FycmF5IiwicGF0aHMiLCJ1bmtub3duIiwiaGFzVmFsdWVzIiwicmVzb2x2ZXJSb290Iiwic3RlbSIsInN0ZW1QYXJzZWQiLCJyb290UmVsYXRpdmUiLCJpbmNsdWRlcyIsInBhdGhSZWxhdGl2ZSIsInJlc3VsdHMiLCJyZXNvbHZlZFBhdGhzIiwiaW1wb3J0UmVzb2x2ZWRHcmFwaFFMIiwiSElEREVOIiwiI2dlbmVyYXRlU2NoZW1hIiwiQ2xhc3MiLCJleHRlbmRTY2hlbWEiLCJpc1Jvb3RUeXBlIiwiYXN0Tm9kZSIsImZvckVhY2giLCJhcHBseVRvIiwiZXhwb3J0cyIsIkdyYXBoUUxPYmplY3RUeXBlIiwicnVuSW5qZWN0b3JzIiwicmVzb2x2ZXJBcmdzIiwicmVzb2x2ZXJJbmplY3RvcnMiLCJpbmplY3RvciIsIlNjaGVtYUluamVjdG9yQ29uZmlnIiwiZXh0cmFDb25maWciLCJiYXNlQ29uZmlnIiwiX19zY2hlbWFfaW5qZWN0b3JfXyIsImluZm8iLCJfc2NoZW1hIiwiRGVmYXVsdEZpZWxkTWVyZ2VSZXNvbHZlciIsImxlZnRUeXBlIiwibGVmdEZpZWxkIiwicmlnaHRUeXBlIiwicmlnaHRGaWVsZCIsIkRlZmF1bHREaXJlY3RpdmVNZXJnZVJlc29sdmVyIiwibGVmdERpcmVjdGl2ZSIsInJpZ2h0RGlyZWN0aXZlIiwiRGVmYXVsdEVudW1NZXJnZVJlc29sdmVyIiwibGVmdFZhbHVlIiwicmlnaHRWYWx1ZSIsIkRlZmF1bHRVbmlvbk1lcmdlUmVzb2x2ZXIiLCJsZWZ0VW5pb24iLCJyaWdodFVuaW9uIiwiRGVmYXVsdFNjYWxhck1lcmdlUmVzb2x2ZXIiLCJsZWZ0U2NhbGFyIiwibGVmdENvbmZpZyIsInJpZ2h0U2NhbGFyIiwicmlnaHRDb25maWciLCJmaWVsZE1lcmdlUmVzb2x2ZXIiLCJkaXJlY3RpdmVNZXJnZVJlc29sdmVyIiwiZW51bVZhbHVlTWVyZ2VSZXNvbHZlciIsInR5cGVWYWx1ZU1lcmdlUmVzb2x2ZXIiLCJzdWJUeXBlUmVzb2x2ZXJNYXAiLCJNYXAiLCJzdWJUeXBlTmFtZSIsInJTdWJUeXBlIiwibFN1YlR5cGUiLCJyZXN1bHRpbmdTdWJUeXBlIiwid3JhcCIsImJvZHkiLCJ0cmltIiwiX2RlZmF1bHQiXSwic291cmNlcyI6WyIuLi9zcmMvU2NoZW1hdGEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmNvbnN0IGRlYnVnX2xvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSlcbmNvbnN0IGRlYnVnX3RyYWNlID0gY29uc29sZS50cmFjZS5iaW5kKGNvbnNvbGUpXG5cbmltcG9ydCB7XG4gIHJlYWRkaXIsXG4gIHJlYWRGaWxlLFxuICBzdGF0XG59IGZyb20gJ2ZzL3Byb21pc2VzJ1xuXG5pbXBvcnQge1xuICBmb3JtYXQgYXMgcGF0aEZvcm1hdCxcbiAgcmVzb2x2ZSBhcyBwYXRoUmVzb2x2ZSxcbiAgam9pbiBhcyBwYXRoSm9pbixcbiAgcGFyc2UgYXMgcGF0aFBhcnNlLFxuICByZWxhdGl2ZSBhcyBwYXRoUmVsYXRpdmVcbn0gZnJvbSAncGF0aCdcblxuaW1wb3J0IHR5cGUge1xuICBBU1ROb2RlLFxuICBCdWlsZFNjaGVtYU9wdGlvbnMsXG4gIERpcmVjdGl2ZU5vZGUsXG4gIEVudW1WYWx1ZU5vZGUsXG4gIEV4ZWN1dGlvblJlc3VsdCxcbiAgRmllbGROb2RlLFxuICBHcmFwaFFMRmllbGRSZXNvbHZlcixcbiAgR3JhcGhRTFNjYWxhclR5cGVDb25maWcsXG4gIE5hbWVkVHlwZU5vZGUsXG4gIE9iak1hcCxcbiAgUGFyc2VPcHRpb25zLFxuICBTY2FsYXJUeXBlRGVmaW5pdGlvbk5vZGUsXG4gIFNvdXJjZSxcbn0gZnJvbSAnZ3JhcGhxbCdcblxuaW1wb3J0IHtcbiAgZGVmYXVsdEZpZWxkUmVzb2x2ZXIsXG4gIGV4dGVuZFNjaGVtYSxcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIHBhcnNlLFxuICBwcmludFNjaGVtYSxcbiAgcHJpbnRUeXBlLFxuICB0eXBlRnJvbUFTVCxcbn0gZnJvbSAnZ3JhcGhxbCdcblxuaW1wb3J0IHtcbiAgQWxsU2NoZW1hdGFFeHRlbnNpb25zLFxuICBpbXBvcnRHcmFwaFFMLFxuICBpbXBvcnRSZXNvbHZlZEdyYXBoUUwsXG4gIHJlc29sdmVkUGF0aHNcbn0gZnJvbSAnLi9HcmFwaFFMRXh0ZW5zaW9uJ1xuXG5pbXBvcnQgdHlwZSB7XG4gIENvbmZsaWN0UmVzb2x2ZXJzLFxuICBEaXJlY3RpdmVNZXJnZVJlc29sdmVyLFxuICBFbnVtTWVyZ2VSZXNvbHZlcixcbiAgRmllbGRNZXJnZVJlc29sdmVyLFxuICBNZXJnZU9wdGlvbnNDb25maWcsXG4gIFJlc29sdmVyQXJncyxcbiAgUmVzb2x2ZXJBcmdzVHJhbnNmb3JtZXIsXG4gIFJlc29sdmVySW5mbyxcbiAgUmVzb2x2ZXJNYXAsXG4gIFNjYWxhck1lcmdlUmVzb2x2ZXIsXG4gIFNjaGVtYVNvdXJjZSxcbiAgVW5pb25NZXJnZVJlc29sdmVyLFxufSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyBhc3luY1RyeUNhdGNoIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IGV4dHJhY3RSZXNvbHZlckluZm8gfSBmcm9tICcuL3V0aWxzL3Jlc29sdmVyd29yaydcbmltcG9ydCB7IEV4dGVuZGVkUmVzb2x2ZXJNYXAgfSBmcm9tICcuL0V4dGVuZGVkUmVzb2x2ZXJNYXAnXG5pbXBvcnQgeyBFeHRlbmRlZFJlc29sdmVyIH0gZnJvbSAnLi9FeHRlbmRlZFJlc29sdmVyJ1xuaW1wb3J0IHsgaW5saW5lIH0gZnJvbSAnbmUtdGFnLWZucydcbmltcG9ydCB7IG1lcmdlUmVzb2x2ZXJzLCBSZXNvbHZlclByb3BlcnR5IH0gZnJvbSAnLi93YWxrUmVzb2x2ZXJNYXAnXG5pbXBvcnQgbWVyZ2UgZnJvbSAnZGVlcG1lcmdlJ1xuaW1wb3J0IFV0aWwgZnJvbSAndXRpbCdcblxuaW1wb3J0IHtcbiAgZm9yRWFjaE9mLFxuICBmb3JFYWNoRmllbGQsXG4gIEFMTCxcbiAgVFlQRVMsXG4gIElOVEVSRkFDRVMsXG4gIEVOVU1TLFxuICBVTklPTlMsXG4gIFNDQUxBUlMsXG4gIFJPT1RfVFlQRVMsXG4gIEhJRERFTixcbn0gZnJvbSAnLi9mb3JFYWNoT2YnXG5pbXBvcnQgeyBmaWxlRXhpc3RzLCBmaW5kTmVhcmVzdFBhY2thZ2VKc29uLCBndWVzc1Byb2plY3RSb290IH0gZnJvbSAnLi9keW5hbWljSW1wb3J0J1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vZm9yRWFjaE9mJykuRm9yRWFjaE9mUmVzb2x2ZXJ9IEZvckVhY2hPZlJlc29sdmVyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2ZvckVhY2hPZicpLkZvckVhY2hGaWVsZFJlc29sdmVyfSBGb3JFYWNoRmllbGRSZXNvbHZlclxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9mb3JFYWNoT2YnKS5CaXRtYXNrZWRUeXBlfSBCaXRtYXNrZWRUeXBlXG4gKi9cblxuLyoqXG4gKiBBIHNtYWxsIGBTdHJpbmdgIGV4dGVuc2lvbiB0aGF0IG1ha2VzIHdvcmtpbmcgd2l0aCBTREwvSURMIHRleHQgZmFyIGVhc2llclxuICogaW4gYm90aCB5b3VyIG93biBsaWJyYXJpZXMgYXMgd2VsbCBhcyBpbiBhIG5vZGVKUyBSRVBMLiBCdWlsdC1pbiB0byB3aGF0XG4gKiBhcHBlYXJzIHRvIGJlIGEgbm9ybWFsIFN0cmluZyBmb3IgYWxsIGludGVudHMgYW5kIHB1cnBvc2VzLCBhcmUgdGhlIGFiaWxpdHlcbiAqIHRvIHRyYW5zZm9ybSB0aGUgc3RyaW5nIGludG8gYSBzZXQgb2YgQVNUIG5vZGVzLCBhIGJ1aWx0IHNjaGVtYSBvciBiYWNrIHRvXG4gKiB0aGUgU0RMIHN0cmluZy5cbiAqXG4gKiBAY2xhc3MgIFNjaGVtYXRhXG4gKi9cbmV4cG9ydCBjbGFzcyBTY2hlbWF0YSBleHRlbmRzIFN0cmluZyB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBTdHJpbmdgLCBwcmVzdW1hYmx5IG9mIFNETCBvciBJREwuIFRoZSBnZXR0ZXIgYC52YWxpZGBcbiAgICogd2lsbCBwcm92aWRlIHNvbWUgaW5kaWNhdGlvbiBhcyB0byB3aGV0aGVyIG9yIG5vdCB0aGUgY29kZSBpcyB2YWxpZC5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBtZW1iZXJPZiBTY2hlbWF0YVxuICAgKlxuICAgKiBAcGFyYW0ge1NjaGVtYVNvdXJjZX0gdHlwZURlZnMgYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGEsIGEgc3RyaW5nIG9mIFNETCxcbiAgICogYSBTb3VyY2UgaW5zdGFuY2Ugb2YgU0RMLCBhIEdyYXBoUUxTY2hlbWEgb3IgQVNUTm9kZSB0aGF0IGNhbiBiZSBwcmludGVkXG4gICAqIGFzIGFuIFNETCBzdHJpbmdcbiAgICogQHBhcmFtIHtSZXNvbHZlck1hcH0gcmVzb2x2ZXJzIGFuIG9iamVjdCBjb250YWluaW5nIGZpZWxkIHJlc29sdmVycyBmb3JcbiAgICogZm9yIHRoZSBzY2hlbWEgcmVwcmVzZW50ZWQgd2l0aCB0aGlzIHN0cmluZy4gW09wdGlvbmFsXVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJ1aWxkUmVzb2x2ZXJzIGlmIHRoaXMgZmxhZyBpcyBzZXQgdG8gdHJ1ZSwgYnVpbGQgYSBzZXRcbiAgICogb2YgcmVzb2x2ZXJzIGFmdGVyIHRoZSByZXN0IG9mIHRoZSBpbnN0YW5jZSBpcyBpbml0aWFsaXplZCBhbmQgc2V0IHRoZVxuICAgKiByZXN1bHRzIG9uIHRoZSBgLnJlc29sdmVyc2AgcHJvcGVydHkgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgaW5zdGFuY2UuIElmXG4gICAqIGJ1aWxkUmVzb2x2ZXJzIGlzIHRoZSBzdHJpbmcgXCJhbGxcIiwgdGhlbiBhIHJlc29sdmVyIGZvciBlYWNoIGZpZWxkIG5vdFxuICAgKiBkZWZpbmVkIHdpbGwgYmUgcmV0dXJuZWQgd2l0aCBhIGBkZWZhdWx0RmllbGRSZXNvbHZlcmAgYXMgaXRzIHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZmxhdHRlblJlc29sdmVycyBpZiB0cnVlLCBhbmQgaWYgYGJ1aWxkUmVzb2x2ZXJzYCBpcyB0cnVlLFxuICAgKiB0aGVuIG1ha2UgYW4gYXR0ZW1wdCB0byBmbGF0dGVuIHRoZSByb290IHR5cGVzIHRvIHRoZSBiYXNlIG9mIHRoZVxuICAgKiByZXNvbHZlciBtYXAgb2JqZWN0LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgdHlwZURlZnMsXG4gICAgcmVzb2x2ZXJzID0gbnVsbCxcbiAgICBidWlsZFJlc29sdmVycyA9IGZhbHNlLFxuICAgIGZsYXR0ZW5SZXNvbHZlcnMgPSBmYWxzZSxcbiAgKSB7XG4gICAgc3VwZXIobm9ybWFsaXplU291cmNlKHR5cGVEZWZzKSlcblxuICAgIHJlc29sdmVycyA9XG4gICAgICByZXNvbHZlcnMgfHxcbiAgICAgICh0eXBlRGVmcyBpbnN0YW5jZW9mIFNjaGVtYXRhICYmIHR5cGVEZWZzLnJlc29sdmVycykgfHxcbiAgICAgICh0eXBlRGVmcyBpbnN0YW5jZW9mIEdyYXBoUUxTY2hlbWEgJiZcbiAgICAgICAgc3RyaXBSZXNvbHZlcnNGcm9tU2NoZW1hKHR5cGVEZWZzKSkgfHxcbiAgICAgIG51bGxcblxuICAgIHRoaXNbR1JBUEhJUUxfRkxBR10gPSB0cnVlXG4gICAgdGhpc1tUWVBFREVGU19LRVldID0gbm9ybWFsaXplU291cmNlKHR5cGVEZWZzKVxuICAgIHRoaXNbTUFQXSA9IG5ldyBXZWFrTWFwKClcbiAgICB0aGlzW01BUF0uc2V0KFxuICAgICAgd21rU2NoZW1hLFxuICAgICAgdHlwZURlZnMgaW5zdGFuY2VvZiBHcmFwaFFMU2NoZW1hID8gdHlwZURlZnMgOiBudWxsXG4gICAgKVxuICAgIHRoaXNbTUFQXS5zZXQod21rUmVzb2x2ZXJzLCByZXNvbHZlcnMpXG4gICAgdGhpc1tNQVBdLnNldChcbiAgICAgIHdta1ByZWJvdW5kUmVzb2x2ZXJzLFxuICAgICAgdHlwZURlZnMgaW5zdGFuY2VvZiBTY2hlbWF0YSA/IHR5cGVEZWZzLnByZXZSZXNvbHZlck1hcHMgOiBbXVxuICAgIClcblxuICAgIC8vIE1hcmsgYSBzY2hlbWEgcGFzc2VkIHRvIHVzZSBpbiB0aGUgY29uc3RydWN0b3IgYXMgYW4gZXhlY3V0YWJsZSBzY2hlbWFcbiAgICAvLyB0byBwcmV2ZW50IGFueSByZXBsYWNlbWVudCBvZiB0aGUgdmFsdWUgYnkgZ2V0dGVycyB0aGF0IGdlbmVyYXRlIGFcbiAgICAvLyBzY2hlbWEgZnJvbSB0aGUgU0RMXG4gICAgaWYgKHRoaXNbTUFQXS5nZXQod21rU2NoZW1hKSkge1xuICAgICAgdGhpc1tNQVBdLmdldCh3bWtTY2hlbWEpW0VYRV0gPSB0cnVlXG4gICAgICB0aGlzW01BUF0uZ2V0KHdta1NjaGVtYSlbU3ltYm9sLmZvcignY29uc3RydWN0b3Itc3VwcGxpZWQtc2NoZW1hJyldID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIElmIGJ1aWxkUmVzb2x2ZXJzIGlzIHRydWUsIGFmdGVyIHRoZSByZXN0IGlzIGFscmVhZHkgc2V0IGFuZCBkb25lLCBnb1xuICAgIC8vIGFoZWFkIGFuZCBidWlsZCBhIG5ldyBzZXQgb2YgcmVzb2x2ZXIgZnVuY3Rpb25zIGZvciB0aGlzIGluc3RhbmNlXG4gICAgaWYgKGJ1aWxkUmVzb2x2ZXJzKSB7XG4gICAgICBpZiAoYnVpbGRSZXNvbHZlcnMgPT09ICdhbGwnKSB7XG4gICAgICAgIHRoaXNbTUFQXS5zZXQoXG4gICAgICAgICAgd21rUmVzb2x2ZXJzLFxuICAgICAgICAgIHRoaXMuYnVpbGRSZXNvbHZlckZvckVhY2hGaWVsZChmbGF0dGVuUmVzb2x2ZXJzKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpc1tNQVBdLnNldCh3bWtSZXNvbHZlcnMsIHRoaXMuYnVpbGRSZXNvbHZlcnMoZmxhdHRlblJlc29sdmVycykpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN5bWJvbC5zcGVjaWVzIGVuc3VyZXMgdGhhdCBhbnkgU3RyaW5nIG1ldGhvZHMgdXNlZCBvbiB0aGlzIGluc3RhbmNlIHdpbGxcbiAgICogcmVzdWx0IGluIGEgU2NoZW1hdGEgaW5zdGFuY2UgcmF0aGVyIHRoYW4gYSBTdHJpbmcuIE5PVEU6IHRoaXMgZG9lcyBub3RcbiAgICogd29yayBhcyBleHBlY3RlZCBpbiBjdXJyZW50IHZlcnNpb25zIG9mIG5vZGUuIFRoaXMgYml0IG9mIGNvZGUgaGVyZSBpc1xuICAgKiBiYXNpY2FsbHkgYSBiaXQgb2YgZnV0dXJlIHByb29maW5nIGZvciB3aGVuIFN5bWJvbC5zcGVjaWVzIHN0YXJ0cyB3b3JraW5nXG4gICAqIHdpdGggU3RyaW5nIGV4dGVuZGVkIGNsYXNzZXNcbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgc3RhdGljIGdldCBbU3ltYm9sLnNwZWNpZXNdKCkge1xuICAgIHJldHVybiBTY2hlbWF0YVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZGVmaW5lIHRoZSBpdGVyYXRvciBmb3IgU2NoZW1hdGEgaW5zdGFuY2VzIHNvIHRoYXQgdGhleSBzaW1wbHkgc2hvdyB0aGVcbiAgICogY29udGVudHMgb2YgdGhlIFNETC90eXBlRGVmcy5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiooKSB7XG4gICAgICB5aWVsZCB0aGlzLnRvU3RyaW5nKClcbiAgICB9LmJpbmQodGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoYXQgaW5zdGFuY2VzIG9mIFNjaGVtYXRhIHJlcG9ydCBpbnRlcm5hbGx5IGFzIFNjaGVtYXRhIG9iamVjdC5cbiAgICogU3BlY2lmaWNhbGx5IHVzaW5nIHRoaW5ncyBsaWtlIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQVNUIG5vZGVzIGZvciB0aGlzIHNuaXBwZXQgb2YgU0RMLiBJdCB3aWxsIHRocm93IGFuIGVycm9yXG4gICAqIGlmIHRoZSBzdHJpbmcgaXMgbm90IHZhbGlkIFNETC9JREwuXG4gICAqXG4gICAqIEByZXR1cm4ge0FTVE5vZGV9IGFueSB2YWxpZCBBU1ROb2RlIHN1cHBvcnRlZCBieSBHcmFwaFFMXG4gICAqL1xuICBnZXQgYXN0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnBhcnNlKHRoaXMuc2RsLCBmYWxzZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGBncmFwaGlxbGAgZmxhZywgd2hpY2ggZGVmYXVsdHMgdG8gdHJ1ZS4gVGhpcyBmbGFnIGNhblxuICAgKiBtYWtlIHNldHRpbmcgdXAgYW4gZW5kcG9pbnQgZnJvbSBhIFNjaGVtYXRhIGluc3RhbmNlIGVhc2llciB3aXRoXG4gICAqIGV4cHJlc3MtZ3JhcGhxbFxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBncmFwaGlxbCgpIHtcbiAgICByZXR1cm4gdGhpc1tHUkFQSElRTF9GTEFHXVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciB0byBhbHRlciB0aGUgZGVmYXVsdCAndHJ1ZScgZmxhZyB0byBtYWtlIGFuIFNjaGVtYXRhIGluc3RhbmNlIGFcbiAgICogdmFsaWQgc2luZ2xlIGFyZ3VtZW50IHRvIGZ1bmN0aW9ucyBsaWtlIGBncmFwaHFsSFRUUCgpYCBmcm9tIGV4cHJlc3NcbiAgICogR3JhcGhRTC5cbiAgICpcbiAgICogTk9URTogdGhpcyBmbGFnIG1lYW5zIG5vdGhpbmcgdG8gdGhlIFNjaGVtYXRhIGNsYXNzIGJ1dCBtaWdodCBiZSB1c2VmdWwgaW5cbiAgICogeW91ciBwcm9qZWN0LlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn0gdHJ1ZSBpZiBncmFwaGlxbCBzaG91bGQgYmUgc3RhcnRlZDsgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBzZXQgZ3JhcGhpcWwodmFsdWUpIHtcbiAgICB0aGlzW0dSQVBISVFMX0ZMQUddID0gdmFsdWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgR3JhcGhRTFNjaGVtYSBvYmplY3QuIE5vdGUgdGhpcyB3aWxsIGZhaWwgYW5kIHRocm93IGFuIGVycm9yXG4gICAqIGlmIHRoZXJlIGlzIG5vdCBhdCBsZWFzdCBvbmUgUXVlcnksIFN1YnNjcmlwdGlvbiBvciBNdXRhdGlvbiB0eXBlIGRlZmluZWQuXG4gICAqIElmIHRoZXJlIGlzIG5vIHN0b3JlZCBzY2hlbWEsIGFuZCB0aGVyZSBhcmUgcmVzb2x2ZXJzLCBhbiBleGVjdXRhYmxlXG4gICAqIHNjaGVtYSBpcyByZXR1cm5lZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhbiBpbnN0YW5jZSBvZiBHcmFwaFFMU2NoZW1hIGlmIHZhbGlkIFNETFxuICAgKi9cbiAgZ2V0IHNjaGVtYSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZ2VuZXJhdGVTY2hlbWEoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBHcmFwaFFMU2NoZW1hIG9iamVjdCBvbiB0aGUgaW50ZXJuYWwgd2VhayBtYXAgc3RvcmUuIElmIHRoZSB2YWx1ZVxuICAgKiBzdXBwbGllZCBpcyBub3QgdHJ1dGh5IChpLmUuIG51bGwsIHVuZGVmaW5lZCwgb3IgZXZlbiBmYWxzZSkgdGhlbiB0aGlzXG4gICAqIG1ldGhvZCBkZWxldGVzIGFueSBzdG9yZWQgc2NoZW1hIGluIHRoZSBpbnRlcm5hbCBtYXAuIE90aGVyd2lzZSwgdGhlXG4gICAqIHN1cHBsaWVkIHZhbHVlIGlzIHNldCBvbiB0aGUgbWFwIGFuZCBzdWJzZXF1ZW50IGdldCBjYWxscyB0byBgLnNjaGVtYWBcbiAgICogd2lsbCByZXR1cm4gdGhlIHZhbHVlIHN1cHBsaWVkLlxuICAgKlxuICAgKiBJZiB0aGVyZSBhcmUgYm91bmQgcmVzb2x2ZXJzIG9uIHRoZSBzdXBwbGllZCBzY2hlbWEsIGEgc3ltYm9sIGRlbm90aW5nXG4gICAqIHRoYXQgdGhlIHNjaGVtYSBpcyBhbiBleGVjdXRhYmxlIHNjaGVtYSB3aWxsIGJlIHNldCB0byBwcmV2ZW50IGl0IGZyb21cbiAgICogYmVpbmcgb3ZlcndyaXR0ZW4gb24gc3Vic2VxdWVudCBnZXQgb3BlcmF0aW9ucy4gVGhlIGJvdW5kIHJlc29sdmVycyB3aWxsXG4gICAqIGJlIG1lcmdlZCB3aXRoIHRoZSBTY2hlbWF0YSdzIHJlc29sdmVycyBvYmplY3QuXG4gICAqXG4gICAqIElmIHJlc29sdmVycyBhcmUgc3Vic2VxdWVudGx5IHNldCBvbiB0aGUgYFNjaGVtYXRhYCBpbnN0YW5jZSBhbmQgdGhlXG4gICAqIHN1cHBsaWVkIHNjaGVtYSBkb2VzIG5vdCBoYXZlIHJlc29sdmVycyBib3VuZCB0byBpdCwgc3Vic2VxdWVudCBnZXRcbiAgICogcmVxdWVzdHMgZm9yIHRoZSBpbnRlcm5hbCBgLnNjaGVtYWAgbWF5IGF1dG8tZ2VuZXJhdGUgYSBuZXcgb25lIHdpdGhcbiAgICogYm91bmQgcmVzb2x2ZXJzLiBZb3UgaGF2ZSBiZWVuIHdhcm5lZC4gPSlcbiAgICpcbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hfSBzY2hlbWEgYW4gaW5zdGFuY2Ugb2YgR3JhcGhRTFNjaGVtYSBpbnN0YW5jZSB0b1xuICAgKiBzdG9yZSBvbiB0aGUgaW50ZXJuYWwgd2VhayBtYXAuIEFueSBzY2hlbWEgc3RvcmVkIGhlcmUgd2lsbCBiZSBtb2RpZmllZFxuICAgKiBieSBtZXRob2RzIHRoYXQgZG8gc28uXG4gICAqL1xuICBzZXQgc2NoZW1hKHNjaGVtYSkge1xuICAgIGRlYnVnX2xvZygnW3NldCAuc2NoZW1hXTogJywgc2NoZW1hID8gJ3RydXRoeScgOiAnZmFsc2V5JylcbiAgICBkZWJ1Z190cmFjZSgnW3NldCAuc2NoZW1hXSAnLCBzY2hlbWEpXG5cbiAgICBpZiAoIXNjaGVtYSkge1xuICAgICAgdGhpc1tNQVBdLmRlbGV0ZSh3bWtTY2hlbWEpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHNjaGVtYVJlc29sdmVycyA9IHN0cmlwUmVzb2x2ZXJzRnJvbVNjaGVtYShzY2hlbWEpXG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhzY2hlbWFSZXNvbHZlcnMpLmxlbmd0aCkge1xuICAgICAgICBzY2hlbWFbRVhFXSA9IHRydWVcblxuICAgICAgICBtZXJnZSgodGhpcy5yZXNvbHZlcnMgPSB0aGlzLnJlc29sdmVycyB8fCB7fSksIHNjaGVtYVJlc29sdmVycylcbiAgICAgIH1cblxuICAgICAgdGhpc1tNQVBdLnNldCh3bWtTY2hlbWEsIHNjaGVtYSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBgc2NoZW1hRGlyZWN0aXZlc2AgdmFsdWUsIHdoaWNoIGRlZmF1bHRzIHRvIHRydWUuIFRoaXNcbiAgICogdmFsdWUgY2FuIG1ha2Ugc2V0dGluZyB1cCBhbiBlbmRwb2ludCBmcm9tIGEgU2NoZW1hdGEgaW5zdGFuY2UgZWFzaWVyXG4gICAqIHdpdGggYXBvbGxvLXNlcnZlciBvciBncmFwaHFsLXlvZ2Egb3IgY29tcGF0aWJsZSB2YXJpYW50cy4gU2VlXG4gICAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2RvY3MvZ3JhcGhxbC10b29scy9zY2hlbWEtZGlyZWN0aXZlcy5odG1sXG4gICAqIGlmIHlvdSBhcmUgdXNpbmcgdGhpcyB2YWx1ZSB3aXRoIGFwb2xsby1zZXJ2ZXIuXG4gICAqXG4gICAqIEB0eXBlIHt7W3N0cmluZ106IEZ1bmN0aW9ufX1cbiAgICovXG4gIGdldCBzY2hlbWFEaXJlY3RpdmVzKCkge1xuICAgIHJldHVybiB0aGlzW1NDSEVNQV9ESVJFQ1RJVkVTXVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgYHNjaGVtYURpcmVjdGl2ZXNgIHZhbHVlLCB3aGljaCBkZWZhdWx0cyB0byB0cnVlLiBUaGlzXG4gICAqIHZhbHVlIGNhbiBtYWtlIHNldHRpbmcgdXAgYW4gZW5kcG9pbnQgZnJvbSBhIFNjaGVtYXRhIGluc3RhbmNlIGVhc2llclxuICAgKiB3aXRoIGFwb2xsby1zZXJ2ZXIgb3IgZ3JhcGhxbC15b2dhIG9yIGNvbXBhdGlibGUgdmFyaWFudHMuIFNlZVxuICAgKiBodHRwczovL3RoZS1ndWlsZC5kZXYvZ3JhcGhxbC90b29scy9kb2NzL3NjaGVtYS1kaXJlY3RpdmVzXG4gICAqIGlmIHlvdSBhcmUgdXNpbmcgdGhpcyB2YWx1ZSB3aXRoIGFwb2xsby1zZXJ2ZXIuXG4gICAqXG4gICAqIEB0eXBlIHt7W3N0cmluZ106IEZ1bmN0aW9ufX1cbiAgICovXG4gIHNldCBzY2hlbWFEaXJlY3RpdmVzKHZhbHVlKSB7XG4gICAgdGhpc1tTQ0hFTUFfRElSRUNUSVZFU10gPSB2YWx1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gYSBTY2hlbWF0YSBpbnN0YW5jZSBpcyBtZXJnZWQgd2l0aCBhbm90aGVyIEdyYXBoUUxTY2hlbWEsIGl0c1xuICAgKiByZXNvbHZlcnMgZ2V0IHN0b3JlZCBiZWZvcmUgdGhleSBhcmUgd3JhcHBlZCBpbiBhIGZ1bmN0aW9uIHRoYXQgdXBkYXRlc1xuICAgKiB0aGUgc2NoZW1hIG9iamVjdCBpdCByZWNlaXZlcy4gVGhpcyBhbGxvd3MgdGhlbSB0byBiZSB3cmFwcGVkIHNhZmVseSBhdFxuICAgKiBhIGxhdGVyIGRhdGUgc2hvdWxkIHRoaXMgaW5zdGFuY2UgYmUgbWVyZ2VkIHdpdGggYW5vdGhlci5cbiAgICpcbiAgICogQHJldHVybiB7RXh0ZW5kZWRSZXNvbHZlck1hcFtdfSBhbiBhcnJheSBvZiBgRXh0ZW5kZWRSZXNvbHZlck1hcGBcbiAgICogb2JqZWN0IGluc3RhbmNlc1xuICAgKi9cbiAgZ2V0IHByZXZSZXNvbHZlck1hcHMoKSB7XG4gICAgcmV0dXJuIHRoaXNbTUFQXS5nZXQod21rUHJlYm91bmRSZXNvbHZlcnMpXG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcHJlLWJvdW5kIHJlc29sdmVyIG1hcCBvYmplY3RzIGFzIGFuIGFycmF5IG9mXG4gICAqIGBFeHRlbmRlZFJlc29sdmVyTWFwYCBvYmplY3QgaW5zdGFuY2VzIG9uIHRoaXMgaW5zdGFuY2Ugb2YgU2NoZW1hdGFcbiAgICpcbiAgICogQHBhcmFtIHtFeHRlbmRlZFJlc29sdmVyTWFwW119IG1hcHMgYW4gYXJyYXkgb2YgYEV4dGVuZGVkUmVzb2x2ZXJNYXBgXG4gICAqIG9iamVjdCBpbnN0YW5jZXNcbiAgICovXG4gIHNldCBwcmV2UmVzb2x2ZXJNYXBzKG1hcHMpIHtcbiAgICB0aGlzW01BUF0uc2V0KHdta1ByZWJvdW5kUmVzb2x2ZXJzLCBtYXBzKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBHcmFwaFFMU2NoZW1hIG9iamVjdCwgcHJlLWJvdW5kLCB0byB0aGUgYXNzb2NpYXRlZCByZXNvbHZlcnNcbiAgICogbWV0aG9kcyBpbiBgLnJlc29sdmVyc2AuIElmIHRoZXJlIGFyZSBubyByZXNvbHZlcnMsIHRoaXMgaXMgZXNzZW50aWFsbHlcbiAgICogdGhlIHNhbWUgYXMgYXNraW5nIGZvciBhIHNjaGVtYSBpbnN0YW5jZSB1c2luZyBgLnNjaGVtYWAuIElmIHRoZSBTRExcbiAgICogdGhpcyBpbnN0YW5jZSBpcyBidWlsdCBhcm91bmQgaXMgaW5zdWZmaWNpZW50IHRvIGdlbmVyYXRlIGEgR3JhcGhRTFNjaGVtYVxuICAgKiBpbnN0YW5jZSwgdGhlbiBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGAuc2NoZW1hYCBpbnN0ZWFkOyB0aGlzIHNpbXBseSBwcm94aWVzIHRvIHRoYXRcbiAgICogQHR5cGUge0dyYXBoUUxTY2hlbWF9XG4gICAqL1xuICBnZXQgZXhlY3V0YWJsZVNjaGVtYSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY2hlbWFcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdHJpbmcgdGhpcyBpbnN0YW5jZSB3YXMgZ2VuZXJhdGVkIHdpdGguXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2RsKCkge1xuICAgIHJldHVybiB0aGlzW1RZUEVERUZTX0tFWV1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXdyaXRlcyB0aGUgdHlwZURlZnMgb3IgU0RMIHdpdGhvdXQgYW55IGBleHRlbmQgdHlwZWAgZGVmaW5pdGlvbnNcbiAgICogYW5kIHJldHVybnMgdGhlIG1vZGlmaWVkIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7U2NoZW1hdGF9XG4gICAqL1xuICBmbGF0dGVuU0RMKCkge1xuICAgIGlmICh0aGlzLnNjaGVtYSkge1xuICAgICAgdGhpc1tUWVBFREVGU19LRVldID0gcHJpbnRTY2hlbWEodGhpcy5zY2hlbWEpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByZWdlbmVyYXRlZCBTREwgcmVwcmVzZW50aW5nIHRoZSBTY2hlbWEgb2JqZWN0IG9uIHRoaXNcbiAgICogU2NoZW1hdGEgaW5zdGFuY2UuIEl0IGRvZXMgbm90IG1vZGlmeSB0aGUgc2NoZW1hdGEgb2JqZWN0IGluc3RhbmNlXG4gICAqIGluIGFueSB3YXkuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZmxhdFNETCgpIHtcbiAgICBsZXQgc2RsID0gdGhpc1tUWVBFREVGU19LRVldXG5cbiAgICBpZiAodGhpcy5zY2hlbWEpIHtcbiAgICAgIHNkbCA9IHByaW50U2NoZW1hKHRoaXMuc2NoZW1hKVxuICAgIH1cblxuICAgIHJldHVybiBzZGxcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN5bm9ueW0gb3IgYWxpYXMgZm9yIGAuc2RsYC4gUGxhY2VkIGhlcmUgZm9yIHRoZSBleHByZXNzIHB1cnBvc2Ugb2ZcbiAgICogZGVzdHJ1Y3R1aW5nIHdoZW4gdXNlZCB3aXRoIEFwb2xsbydzIG1ha2VFeGVjdXRhYmxlU2NoZW1hIG9yIG90aGVyXG4gICAqIGxpYnJhcmllcyBleHBlY3RpbmcgdmFsdWVzIG9mIHRoZSBzYW1lIG5hbWVcbiAgICpcbiAgICogaS5lLlxuICAgKiAgIC8vIHNkbC50eXBlRGVmcyBhbmQgc2RsLnJlc29sdmVycyB3aWxsIGJlIHdoZXJlIHRoZSBmdW5jdGlvbiBleHBlY3RzXG4gICAqICAgbGV0IHNjaGVtYSA9IHJlcXVpcmUoJ2dyYXBocWwtdG9vbHMnKS5tYWtlRXhlY3V0YWJsZVNjaGVtYShzZGwpXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHlwZURlZnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2RsXG4gIH1cblxuICAvKipcbiAgICogV2Fsa3MgdGhlIHR5cGVzIGRlZmluZWQgaW4gdGhlIHNkbCBmb3IgdGhpcyBpbnN0YW5jZSBvZiBTY2hlbWF0YSBhbmRcbiAgICogcmV0dXJucyBhbiBvYmplY3QgbWFwcGluZyBmb3IgdGhvc2UgZGVmaW5pdGlvbnMuIEdpdmVuIGEgc2NoZW1hIHN1Y2ggYXNcbiAgICogYGBgXG4gICAqIHR5cGUgQSB7XG4gICAqICAgYTogU3RyaW5nXG4gICAqICAgYjogW1N0cmluZ11cbiAgICogICBjOiBbU3RyaW5nXSFcbiAgICogfVxuICAgKiB0eXBlIFF1ZXJ5IHtcbiAgICogICBBcyhuYW1lOiBTdHJpbmcpOiBbQV1cbiAgICogfVxuICAgKiBgYGBcbiAgICogYSBKYXZhU2NyaXB0IG9iamVjdCB3aXRoIHByb3BlcnRpZXMgc3VjaCBhcyB0aGUgZm9sbG93aW5nIHdpbGwgYmVcbiAgICogcmV0dXJuZWRcbiAgICogYGBgXG4gICAqIHtcbiAgICogICBRdWVyeToge1xuICAgKiAgICAgQXM6IHsgdHlwZTogJ1tBXScsIGFyZ3M6IFt7IG5hbWU6ICdTdHJpbmcnIH1dIH1cbiAgICogICB9LFxuICAgKiAgIEE6IHtcbiAgICogICAgIGE6IHsgdHlwZTogJ1N0cmluZycsIGFyZ3M6IFtdIH0sXG4gICAqICAgICBiOiB7IHR5cGU6ICdbU3RyaW5nXScsIGFyZ3M6IFtdIH0sXG4gICAqICAgICBjOiB7IHR5cGU6ICdbU3RyaW5nXSEnLCBhcmdzOiBbXSB9XG4gICAqICAgfVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0IHR5cGVzKCkge1xuICAgIGxldCB0eXBlcyA9IHt9XG5cbiAgICB0aGlzLmZvckVhY2hUeXBlRmllbGQoKHQsdG4sdGQsZixmbixmYSxmZCxzY2hlbWEsYykgPT4ge1xuICAgICAgbGV0IGFzdCA9IHBhcnNlKHByaW50VHlwZSh0KSkuZGVmaW5pdGlvbnNbMF1cbiAgICAgIGxldCBmaWVsZEFTVCA9IGFzdC5maWVsZHMuZmlsdGVyKChvLGksYSkgPT4gby5uYW1lLnZhbHVlID09IGZuKVxuICAgICAgbGV0IGZpZWxkVHlwZSA9IGZpZWxkQVNULmxlbmd0aCAmJiB0eXBlRnJvbUFTVChzY2hlbWEsIGZpZWxkQVNUWzBdLnR5cGUpXG4gICAgICBsZXQgYXJncyA9IFtdXG5cbiAgICAgIGlmIChmYT8ubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IHtuYW1lLCB0eXBlfSBvZiBmYSkge1xuICAgICAgICAgIGFyZ3MucHVzaCh7IFtuYW1lXTogdHlwZS50b1N0cmluZygpIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgKHR5cGVzW3RuXSA9IHR5cGVzW3RuXSB8fCB7fSlbZm5dID0ge1xuICAgICAgICB0eXBlOiBmaWVsZFR5cGUudG9TdHJpbmcoKSxcbiAgICAgICAgYXJnczogYXJnc1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gdHlwZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBpbnRlcm5hbCBjYWxsIHRvIGJ1aWxkUmVzb2x2ZXJzKHRydWUpLCB0aGVyZWJ5IHJlcXVlc3RpbmcgYSBmbGF0dGVuZWRcbiAgICogcmVzb2x2ZXIgbWFwIHdpdGggUXVlcnksIE11dGF0aW9uIGFuZCBTdWJzY3JpcHRpb24gZmllbGRzIGV4cG9zZWQgYXMgcm9vdFxuICAgKiBvYmplY3RzIHRoZSB3YXkgdGhlIEZhY2Vib29rIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbiBleHBlY3RzXG4gICAqXG4gICAqIEByZXR1cm4ge1Jlc29sdmVyTWFwfSBhbiBvYmplY3Qgb2YgZnVuY3Rpb25zIG9yIGFuIGVtcHR5IG9iamVjdCBvdGhlcndpc2VcbiAgICovXG4gIGdldCByb290VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGRSZXNvbHZlcnModHJ1ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFueSByZXNvbHZlcnMgZnVuY3Rpb24gb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtSZXNvbHZlck1hcH0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgZmllbGQgcmVzb2x2ZXJzIG9yIG51bGwgaWYgbm9uZVxuICAgKiBhcmUgc3RvcmVkIHdpdGhpblxuICAgKi9cbiAgZ2V0IHJlc29sdmVycygpIHtcbiAgICByZXR1cm4gdGhpc1tNQVBdLmdldCh3bWtSZXNvbHZlcnMpXG4gIH1cblxuICAvKipcbiAgICogUGFyc2VzIHRoZSByZXNvbHZlcnMgb2JqZWN0LCBpZiBwcmVzZW50LCBmb3IgYW55IGl0ZW1zIHRoYXQgbmVlZCB0b1xuICAgKiBiZSBhcHBsaWVkIGFmdGVyIHRoZSBzY2hlbWEgaXMgY29uc3RydWN0ZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge1Jlc29sdmVySW5mb1tdfSBhbiBhcnJheSBvZiBvYmplY3RzIHRvIHByb2Nlc3Mgb3IgYW4gZW1wdHlcbiAgICogYXJyYXkgaWYgdGhlcmUgaXMgbm90aGluZyB0byB3b3JrIG9uXG4gICAqL1xuICBnZXQgcmVzb2x2ZXJJbmZvKCkge1xuICAgIHJldHVybiBleHRyYWN0UmVzb2x2ZXJJbmZvKHRoaXMucmVzb2x2ZXJzKVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRvIGZldGNoIGEgcGFydGljdWxhciBmaWVsZCByZXNvbHZlciBmcm9tIHRoZSBzY2hlbWEgcmVwcmVzZW50ZWRcbiAgICogYnkgdGhpcyBTY2hlbWF0YSBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgdGhlIG5hbWUgb2YgdGhlIHR5cGUgZGVzaXJlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgdGhlIG5hbWUgb2YgdGhlIGZpZWxkIGNvbnRhaW5pbmcgdGhlIHJlc29sdmVyXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgZnVuY3Rpb24gcmVzb2x2ZXIgZm9yIHRoZSB0eXBlIGFuZCBmaWVsZCBpblxuICAgKiBxdWVzdGlvblxuICAgKi9cbiAgc2NoZW1hUmVzb2x2ZXJGb3IodHlwZSwgZmllbGQpIHtcbiAgICBpZiAoIXRoaXMucmVzb2x2ZXJzIHx8ICFPYmplY3Qua2V5cyh0aGlzLnJlc29sdmVycykubGVuZ3RoIHx8ICF0aGlzLnZhbGlkKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGxldCBfdHlwZSA9IHRoaXMuc2NoZW1hLmdldFR5cGUodHlwZSlcbiAgICBsZXQgX2ZpZWxkID0gKF90eXBlLmdldEZpZWxkcygpICYmIF90eXBlLmdldEZpZWxkcygpW2ZpZWxkXSkgfHwgbnVsbFxuICAgIGxldCByZXNvbHZlID0gKF9maWVsZD8ucmVzb2x2ZSkgfHwgbnVsbFxuXG4gICAgcmV0dXJuIHJlc29sdmVcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBzY2hlbWEgYmFzZWQgb24gdGhlIFNETCBpbiB0aGUgaW5zdGFuY2UgYW5kIHRoZW4gcGFyc2VzIGl0IHRvXG4gICAqIGZldGNoIGEgbmFtZWQgZmllbGQgaW4gYSBuYW1lZCB0eXBlLiBJZiBlaXRoZXIgdGhlIHR5cGUgb3IgZmllbGQgYXJlXG4gICAqIG1pc3Npbmcgb3IgaWYgdGhlIFNETCBjYW5ub3QgYmUgYnVpbHQgYXMgYSBzY2hlbWEsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIHRoZSBuYW1lIG9mIGEgdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgdGhlIG5hbWUgb2YgYSBmaWVsZCBjb250YWluZWQgaW4gdGhlIGFib3ZlIHR5cGVcbiAgICogQHJldHVybiB7RmllbGROb2RlfSB0aGUgZmllbGQgcmVmZXJlbmNlIGluIHRoZSB0eXBlIGFuZCBmaWVsZCBzdXBwbGllZFxuICAgKi9cbiAgc2NoZW1hRmllbGRCeU5hbWUodHlwZSwgZmllbGQpIHtcbiAgICBpZiAoIXRoaXMudmFsaWRTY2hlbWEgfHwgIXRoaXMuc2NoZW1hKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGxldCBfdHlwZSA9IHRoaXMuc2NoZW1hLmdldFR5cGUodHlwZSlcbiAgICBsZXQgX2ZpZWxkID0gKF90eXBlLmdldEZpZWxkcygpICYmIF90eXBlLmdldEZpZWxkcygpW2ZpZWxkXSkgfHwgbnVsbFxuXG4gICAgcmV0dXJuIF9maWVsZFxuICB9XG5cbiAgLyoqXG4gICAqIEZvciBTREwgdGhhdCBkb2Vzbid0IHByb3Blcmx5IGJ1aWxkIGludG8gYSBHcmFwaFFMU2NoZW1hLCBpdCBjYW4gc3RpbGwgYmVcbiAgICogcGFyc2VkIGFuZCBzZWFyY2hlZCBmb3IgYSB0eXBlIGJ5IG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIHRoZSBuYW1lIG9mIGEgdHlwZVxuICAgKiBAcmV0dXJuIHtBU1ROb2RlfSB0aGUgZmllbGQgcmVmZXJlbmNlIGluIHRoZSB0eXBlIGFuZCBmaWVsZCBzdXBwbGllZFxuICAgKi9cbiAgYXN0VHlwZUJ5TmFtZSh0eXBlKSB7XG4gICAgaWYgKCF0aGlzLnZhbGlkU0RMKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGxldCBfdHlwZSA9IHRoaXMuYXN0LmRlZmluaXRpb25zLmZpbmQoZiA9PiBmLm5hbWUudmFsdWUgPT09IHR5cGUpXG5cbiAgICByZXR1cm4gX3R5cGVcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgU0RMIHRoYXQgZG9lc24ndCBwcm9wZXJseSBidWlsZCBpbnRvIGEgR3JhcGhRTFNjaGVtYSwgaXQgY2FuIHN0aWxsIGJlXG4gICAqIHNlYXJjaGVkIGZvciBhIHR5cGUgYW5kIGZpZWxkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSB0aGUgbmFtZSBvZiBhIHR5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpZWxkIHRoZSBuYW1lIG9mIGEgZmllbGQgY29udGFpbmVkIGluIHRoZSBhYm92ZSB0eXBlXG4gICAqIEByZXR1cm4ge0ZpZWxkTm9kZX0gdGhlIGZpZWxkIHJlZmVyZW5jZSBpbiB0aGUgdHlwZSBhbmQgZmllbGQgc3VwcGxpZWRcbiAgICovXG4gIGFzdEZpZWxkQnlOYW1lKHR5cGUsIGZpZWxkKSB7XG4gICAgaWYgKCF0aGlzLnZhbGlkU0RMKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGxldCBfdHlwZSA9IHRoaXMuYXN0LmRlZmluaXRpb25zLmZpbmQoZiA9PiBmLm5hbWUudmFsdWUgPT09IHR5cGUpXG4gICAgbGV0IF9maWVsZCA9XG4gICAgICAoX3R5cGU/LmZpZWxkcy5maW5kKGYgPT4gZi5uYW1lLnZhbHVlID09PSBmaWVsZCkpIHx8IG51bGxcblxuICAgIHJldHVybiBfZmllbGRcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWxrcyB0aGUgQVNUIGZvciB0aGlzIFNETCBzdHJpbmcgYW5kIGNoZWNrcyBmb3IgdGhlIG5hbWVzIG9mIHRoZSBmaWVsZHNcbiAgICogb2YgZWFjaCBvZiB0aGUgcm9vdCB0eXBlczsgUXVlcnksIE11dGF0aW9uIGFuZCBTdWJzY3JpcHRpb24uIElmIHRoZXJlIGFyZVxuICAgKiBubyByb290IHR5cGVzIGRlZmluZWQsIGZhbHNlIGlzIHJldHVybmVkLlxuICAgKlxuICAgKiBJZiB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgcm9vdCB0eXBlICphbmQqIHNvbWUgcmVzb2x2ZXJzICphbmQqIGF0IGxlYXN0IG9uZVxuICAgKiBvZiB0aGUgZmllbGRzIG9mIGF0IGxlYXN0IG9uZSByb290IHR5cGUgaXMgcHJlc2VudCBpbiB0aGUgcm9vdCBvZiB0aGVcbiAgICogcmVzb2x2ZXJzIG1hcCwgdHJ1ZSBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlLCBmYWxzZS5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZGVmaW5lZCByZXNvbHZlcnMgaGF2ZSBhdCBsZWFzdCBvbmUgcm9vdFxuICAgKiB0eXBlIGZpZWxkIGFzIGEgcmVzb2x2ZXIgb24gdGhlIHJvb3Qgb2YgdGhlIHJlc29sdmVyIG1hcDsgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGhhc0ZsYXR0ZW5lZFJlc29sdmVycygpIHtcbiAgICBsZXQgYXN0cyA9ICh0aGlzLnZhbGlkU0RMICYmIHRoaXMuYXN0LmRlZmluaXRpb25zKSB8fCBudWxsXG5cbiAgICBpZiAoIWFzdHMgfHwgIXRoaXMucmVzb2x2ZXJzKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBsZXQgcXVlcnkgPSBhc3RzLmZpbmQoZiA9PiBmLm5hbWUudmFsdWUgPT0gJ1F1ZXJ5JylcbiAgICBsZXQgbXV0YXRpb24gPSBhc3RzLmZpbmQoZiA9PiBmLm5hbWUudmFsdWUgPT0gJ011dGF0aW9uJylcbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gYXN0cy5maW5kKGYgPT4gZi5uYW1lLnZhbHVlID09ICdTdWJzY3JpcHRpb24nKVxuICAgIGxldCByZXNvbHZlcnMgPSB0aGlzLnJlc29sdmVyc1xuXG4gICAgaWYgKCFxdWVyeSAmJiAhbXV0YXRpb24gJiYgIXN1YnNjcmlwdGlvbikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZm9yIChsZXQgdHlwZSBvZiBbcXVlcnksIG11dGF0aW9uLCBzdWJzY3JpcHRpb25dKSB7XG4gICAgICBpZiAoIXR5cGU/LmZpZWxkcykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBmaWVsZCBvZiB0eXBlLmZpZWxkcykge1xuICAgICAgICBpZiAoZmllbGQubmFtZS52YWx1ZSBpbiByZXNvbHZlcnMpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogTWVyZ2luZyBTY2hlbWF0YXMgYXJlIGEgY29tbW9uIGZlYXR1cmUgaW4gdGhlIG1vZGVybiB3b3JsZCBvZiBHcmFwaFFMLlxuICAgKiBFc3BlY2lhbGx5IHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIHRlYW1zIHdvcmtpbmcgaW4gdGFuZGVtLiBUaGlzIGZlYXR1cmVcbiAgICogc3VwcG9ydHMgbWVyZ2luZyBvZiB0eXBlcywgZXh0ZW5kZWQgdHlwZXMsIGludGVyZmFjZXMsIGVudW1zLCB1bmlvbnMsXG4gICAqIGlucHV0IG9iamVjdCB0eXBlcyBhbmQgZGlyZWN0aXZlcyBmb3IgYWxsIG9mIHRoZSBhYm92ZS5cbiAgICpcbiAgICogQHBhcmFtIHtTY2hlbWFTb3VyY2V9IHNjaGVtYUxhbmd1YWdlIGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhLCBhIHN0cmluZyBvZlxuICAgKiBTREwsIGEgU291cmNlIGluc3RhbmNlIG9mIFNETCwgYSBHcmFwaFFMU2NoZW1hIG9yIEFTVE5vZGUgdGhhdCBjYW4gYmVcbiAgICogcHJpbnRlZCBhcyBhbiBTREwgc3RyaW5nXG4gICAqIEBwYXJhbSB7Q29uZmxpY3RSZXNvbHZlcnN9IGNvbmZsaWN0UmVzb2x2ZXJzIGFuIG9iamVjdCBjb250YWluaW5nIHVwIHRvXG4gICAqIGZvdXIgbWV0aG9kcywgZWFjaCBkZXNjcmliaW5nIGhvdyB0byBoYW5kbGUgYSBjb25mbGljdCB3aGVuIGFuIGFzc29jaWF0ZWRcbiAgICogdHlwZSBvZiBjb25mbGljdCBvY2N1cnMuIElmIG5vIG9iamVjdCBvciBtZXRob2QgYXJlIHN1cHBsaWVkLCB0aGUgcmlnaHRcbiAgICogaGFuZGUgdmFsdWUgYWx3YXlzIHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0aGUgZXhpc3RpbmcgdmFsdWU7IHJlcGxhY2luZyBpdFxuICAgKiBAcmV0dXJuIHtTY2hlbWF0YX0gYSBuZXcgaW5zdGFuY2Ugb2YgU2NoZW1hdGFcbiAgICovXG4gIG1lcmdlU0RMKFxuICAgIHNjaGVtYUxhbmd1YWdlLFxuICAgIGNvbmZsaWN0UmVzb2x2ZXJzID0gRGVmYXVsdENvbmZsaWN0UmVzb2x2ZXJzXG4gICkge1xuICAgIGxldCBzb3VyY2UgPSBub3JtYWxpemVTb3VyY2Uoc2NoZW1hTGFuZ3VhZ2UsIHRydWUpXG5cbiAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGlubGluZWBcbiAgICAgICAgVGhlIGNhbGwgdG8gbWVyZ2VTREwoc2NoZW1hTGFuZ3VhZ2UsIGNvbmZsaWN0UmVzb2x2ZXJzKSByZWNlaXZlZCBhblxuICAgICAgICBpbnZhbGlkIHZhbHVlIGZvciBzY2hlbWFMYW5ndWFnZS4gUGxlYXNlIGNoZWNrIHlvdXIgY29kZSBhbmQgdHJ5IGFnYWluLlxuICAgICAgICBSZWNlaXZlZCAke3NjaGVtYUxhbmd1YWdlfS5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgbGV0IGxBU1QgPSB0aGlzLmFzdFxuICAgIGxldCByQVNUID0gc291cmNlLmFzdFxuICAgIGxldCBfc2NhbGFyRm5zID0ge31cblxuICAgIC8vIEVuc3VyZSB3ZSBoYXZlIGRlZmF1bHQgYmVoYXZpb3Igd2l0aCBhbnkgY3VzdG9tIGJlaGF2aW9yIGFzc2lnbmVkXG4gICAgLy8gYXRvcCB0aGUgZGVmYXVsdCBvbmVzIHNob3VsZCBvbmx5IGEgcGFydGlhbCBjdXN0b20gYmUgc3VwcGxpZWQuXG4gICAgY29uZmxpY3RSZXNvbHZlcnMgPSBtZXJnZShEZWZhdWx0Q29uZmxpY3RSZXNvbHZlcnMsIGNvbmZsaWN0UmVzb2x2ZXJzKVxuXG4gICAgZm9yIChsZXQgclR5cGUgb2YgckFTVC5kZWZpbml0aW9ucykge1xuICAgICAgbGV0IGxUeXBlID0gbEFTVC5kZWZpbml0aW9ucy5maW5kKGEgPT4gYS5uYW1lLnZhbHVlID09IHJUeXBlLm5hbWUudmFsdWUpXG5cbiAgICAgIGlmIChyVHlwZT8ua2luZD8uZW5kc1dpdGgoJ0V4dGVuc2lvbicpKSB7XG4gICAgICAgIHJUeXBlID0gbWVyZ2Uoe30sIHJUeXBlKVxuICAgICAgICByVHlwZS5raW5kID1cbiAgICAgICAgICByVHlwZS5raW5kLnN1YnN0cmluZygwLCByVHlwZS5raW5kLmxlbmd0aCAtIDkpICsgJ0RlZmluaXRpb24nXG4gICAgICB9XG5cbiAgICAgIGlmICghbFR5cGUpIHtcbiAgICAgICAgbEFTVC5kZWZpbml0aW9ucy5wdXNoKHJUeXBlKVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGxUeXBlLmtpbmQpIHtcbiAgICAgIGNhc2UgJ0VudW1UeXBlRGVmaW5pdGlvbic6XG4gICAgICAgIGNvbWJpbmVUeXBlQW5kU3ViVHlwZSgnZGlyZWN0aXZlcycsIGxUeXBlLCByVHlwZSwgY29uZmxpY3RSZXNvbHZlcnMpXG4gICAgICAgIGNvbWJpbmVUeXBlQW5kU3ViVHlwZSgndmFsdWVzJywgbFR5cGUsIHJUeXBlLCBjb25mbGljdFJlc29sdmVycylcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAnVW5pb25UeXBlRGVmaW5pdGlvbic6XG4gICAgICAgIGNvbWJpbmVUeXBlQW5kU3ViVHlwZSgnZGlyZWN0aXZlcycsIGxUeXBlLCByVHlwZSwgY29uZmxpY3RSZXNvbHZlcnMpXG4gICAgICAgIGNvbWJpbmVUeXBlQW5kU3ViVHlwZSgndHlwZXMnLCBsVHlwZSwgclR5cGUsIGNvbmZsaWN0UmVzb2x2ZXJzKVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICdTY2FsYXJUeXBlRGVmaW5pdGlvbk5vZGUnOiB7XG4gICAgICAgIGxldCBsU2NhbGFyXG4gICAgICAgIGxldCBsU2NhbGFyQ29uZmlnXG4gICAgICAgIGxldCByU2NhbGFyXG4gICAgICAgIGxldCByU2NhbGFyQ29uZmlnXG4gICAgICAgIGxldCByZXNvbHZlclxuXG4gICAgICAgIGNvbWJpbmVUeXBlQW5kU3ViVHlwZSgnZGlyZWN0aXZlcycsIGxUeXBlLCByVHlwZSwgY29uZmxpY3RSZXNvbHZlcnMpXG5cbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hKSB7XG4gICAgICAgICAgbFNjYWxhciA9IHRoaXMuc2NoZW1hLmdldFR5cGUobFR5cGUubmFtZS52YWx1ZSlcbiAgICAgICAgICBsU2NhbGFyQ29uZmlnID0gKGxTY2FsYXI/Ll9zY2FsYXJDb25maWcpIHx8IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzb3VyY2Uuc2NoZW1hKSB7XG4gICAgICAgICAgclNjYWxhciA9IHNvdXJjZS5zY2hlbWEuZ2V0VHlwZShyVHlwZS5uYW1lLnZhbHVlKVxuICAgICAgICAgIHJTY2FsYXJDb25maWcgPSAoclNjYWxhcj8uX3NjYWxhckNvbmZpZykgfHwgbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZXIgPSAoY29uZmxpY3RSZXNvbHZlcnMuc2NhbGFyTWVyZ2VSZXNvbHZlciB8fFxuICAgICAgICAgICAgRGVmYXVsdENvbmZsaWN0UmVzb2x2ZXJzLnNjYWxhck1lcmdlUmVzb2x2ZXIpKFxuICAgICAgICAgIGxUeXBlLFxuICAgICAgICAgIGxTY2FsYXJDb25maWcsXG4gICAgICAgICAgclR5cGUsXG4gICAgICAgICAgclNjYWxhckNvbmZpZ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgKHJlc29sdmVyKSB7XG4gICAgICAgICAgX3NjYWxhckZuc1tsVHlwZS5uYW1lLnZhbHVlXSA9IF9zY2FsYXJGbnNbbFR5cGUubmFtZS52YWx1ZV0gfHwge31cbiAgICAgICAgICBfc2NhbGFyRm5zW2xUeXBlLm5hbWUudmFsdWVdID0gcmVzb2x2ZXJcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlICdPYmplY3RUeXBlRGVmaW5pdGlvbic6XG4gICAgICBjYXNlICdPYmplY3RUeXBlRGVmaW5pdGlvbkV4dGVuc2lvbic6XG4gICAgICBjYXNlICdJbnRlcmZhY2VUeXBlRGVmaW5pdGlvbic6XG4gICAgICBjYXNlICdJbnRlcmZhY2VUeXBlRGVmaW5pdGlvbkV4dGVuc2lvbic6XG4gICAgICBjYXNlICdJbnB1dE9iamVjdFR5cGVEZWZpbml0aW9uJzpcbiAgICAgIGNhc2UgJ0lucHV0T2JqZWN0VHlwZURlZmluaXRpb25FeHRlbnNpb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29tYmluZVR5cGVBbmRTdWJUeXBlKCdkaXJlY3RpdmVzJywgbFR5cGUsIHJUeXBlLCBjb25mbGljdFJlc29sdmVycylcbiAgICAgICAgY29tYmluZVR5cGVBbmRTdWJUeXBlKCdmaWVsZHMnLCBsVHlwZSwgclR5cGUsIGNvbmZsaWN0UmVzb2x2ZXJzKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBtZXJnZWQgPSBTY2hlbWF0YS5mcm9tKHRoaXMuY29uc3RydWN0b3IuZ3FsLnByaW50KGxBU1QpKVxuXG4gICAgaWYgKE9iamVjdC5rZXlzKF9zY2FsYXJGbnMpLmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgdHlwZU5hbWUgb2YgT2JqZWN0LmtleXMoX3NjYWxhckZucykpIHtcbiAgICAgICAgbWVyZ2VkLnNjaGVtYS5nZXRUeXBlKHR5cGVOYW1lKS5fc2NhbGFyQ29uZmlnID0gX3NjYWxhckNvbmZpZ1t0eXBlTmFtZV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICAvKipcbiAgICogUGFyaW5nIGRvd24gU2NoZW1hdGFzIGNhbiBiZSBoYW5keSBmb3IgY2VydGFpbiB0eXBlcyBvZiBzY2hlbWEgc3RpdGNoaW5nLlxuICAgKiBUaGUgU0RMIHBhc3NlZCBpbiBhbmQgYW55IGFzc29jaWF0ZWQgcmVzb2x2ZXJzIHdpbGwgYmUgcmVtb3ZlZCBmcm9tXG4gICAqIGEgY29weSBvZiB0aGUgU0RMIGluIHRoaXMgU2NoZW1hdGEgaW5zdGFuY2UgcmVwcmVzZW50cyBhbmQgdGhlIHJlc29sdmVyXG4gICAqIG1hcCBwYXNzZWQgaW4uXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hU291cmNlfSBzY2hlbWFMYW5ndWFnZSBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSwgYSBzdHJpbmcgb2ZcbiAgICogU0RMLCBhIFNvdXJjZSBpbnN0YW5jZSBvZiBTREwsIGEgR3JhcGhRTFNjaGVtYSBvciBBU1ROb2RlIHRoYXQgY2FuIGJlXG4gICAqIHByaW50ZWQgYXMgYW4gU0RMIHN0cmluZ1xuICAgKiBAcGFyYW0ge1Jlc29sdmVyTWFwfSByZXNvbHZlck1hcCBhbiBvYmplY3QgY29udGFpbmluZyByZXNvbHZlciBmdW5jdGlvbnMsXG4gICAqIGZyb20gZWl0aGVyIHRob3NlIHNldCBvbiB0aGlzIGluc3RhbmNlIG9yIHRob3NlIGluIHRoZSByZXNvbHZlck1hcCBhZGRlZCBpblxuICAgKiBAcmV0dXJuIHtTY2hlbWF0YX0gYSBuZXcgU2NoZW1hdGEgaW5zdGFuY2Ugd2l0aCB0aGUgY2hhbmdlZCB2YWx1ZXMgc2V0XG4gICAqIG9uIGl0XG4gICAqL1xuICBwYXJlU0RMKFxuICAgIHNjaGVtYUxhbmd1YWdlLFxuICAgIHJlc29sdmVyTWFwID0gbnVsbFxuICApIHtcbiAgICBsZXQgc291cmNlID0gbm9ybWFsaXplU291cmNlKHNjaGVtYUxhbmd1YWdlLCB0cnVlKVxuICAgIGlmICghc291cmNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoaW5saW5lYFxuICAgICAgICBJbiB0aGUgY2FsbCB0byBwYXJlU0RMKHNjaGVtYUxhbmd1YWdlKSwgdGhlIHN1cHBsaWVkIHZhbHVlIGZvclxuICAgICAgICBcXGBzY2hlbWFMYW5ndWFnZVxcYCBjb3VsZCBub3QgYmUgcGFyc2VkLlxuICAgICAgYClcbiAgICB9XG5cbiAgICBpZiAoc2NoZW1hTGFuZ3VhZ2UgaW5zdGFuY2VvZiBHcmFwaFFMU2NoZW1hICYmICFyZXNvbHZlck1hcCkge1xuICAgICAgcmVzb2x2ZXJNYXAgPSBzdHJpcFJlc29sdmVyc0Zyb21TY2hlbWEoc2NoZW1hTGFuZ3VhZ2UpXG4gICAgfVxuXG4gICAgbGV0IHJlc29sdmVycyA9IG1lcmdlKHt9LCByZXNvbHZlck1hcCB8fCB0aGlzLnJlc29sdmVycyB8fCB7fSlcbiAgICBsZXQgbEFTVCA9IHRoaXMuYXN0XG4gICAgbGV0IHJBU1QgPSBzb3VyY2UuYXN0XG5cbiAgICBmb3IgKGxldCByVHlwZSBvZiByQVNULmRlZmluaXRpb25zKSB7XG4gICAgICBsZXQgbFR5cGUgPSBsQVNULmRlZmluaXRpb25zLmZpbmQoYSA9PiBhLm5hbWUudmFsdWUgPT0gclR5cGUubmFtZS52YWx1ZSlcblxuICAgICAgaWYgKHJUeXBlPy5raW5kPy5lbmRzV2l0aCgnRXh0ZW5zaW9uJykpIHtcbiAgICAgICAgbGV0IGxlbiA9ICdFeHRlbnNpb24nLmxlbmd0aFxuXG4gICAgICAgIHJUeXBlID0gbWVyZ2Uoe30sIHJUeXBlKVxuICAgICAgICByVHlwZS5raW5kID1cbiAgICAgICAgICByVHlwZS5raW5kLnN1YnN0cmluZygwLCByVHlwZS5raW5kLmxlbmd0aCAtIGxlbikgKyAnRGVmaW5pdGlvbidcbiAgICAgIH1cblxuICAgICAgaWYgKCFsVHlwZSkge1xuICAgICAgICBsQVNULmRlZmluaXRpb25zLnB1c2goclR5cGUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAobFR5cGUua2luZCkge1xuICAgICAgY2FzZSAnRW51bVR5cGVEZWZpbml0aW9uJzpcbiAgICAgICAgcGFyZVR5cGVBbmRTdWJUeXBlKCdkaXJlY3RpdmVzJywgbFR5cGUsIHJUeXBlLCByZXNvbHZlcnMpXG4gICAgICAgIHBhcmVUeXBlQW5kU3ViVHlwZSgndmFsdWVzJywgbFR5cGUsIHJUeXBlLCByZXNvbHZlcnMpXG5cbiAgICAgICAgaWYgKCFsVHlwZS52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGluZGV4ID0gbEFTVC5kZWZpbml0aW9ucy5pbmRleE9mKGxUeXBlKVxuXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgbEFTVC5kZWZpbml0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgJ1VuaW9uVHlwZURlZmluaXRpb24nOlxuICAgICAgICBwYXJlVHlwZUFuZFN1YlR5cGUoJ2RpcmVjdGl2ZXMnLCBsVHlwZSwgclR5cGUsIHJlc29sdmVycylcbiAgICAgICAgcGFyZVR5cGVBbmRTdWJUeXBlKCd0eXBlcycsIGxUeXBlLCByVHlwZSwgcmVzb2x2ZXJzKVxuXG4gICAgICAgIGlmICghbFR5cGUudHlwZXMubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGluZGV4ID0gbEFTVC5kZWZpbml0aW9ucy5pbmRleE9mKGxUeXBlKVxuXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgbEFTVC5kZWZpbml0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgJ1NjYWxhclR5cGVEZWZpbml0aW9uTm9kZSc6IHtcbiAgICAgICAgbGV0IGluZGV4ID0gbEFTVC5kZWZpbml0aW9ucy5pbmRleE9mKGxUeXBlKVxuXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBsQVNULmRlZmluaXRpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlICdPYmplY3RUeXBlRGVmaW5pdGlvbic6XG4gICAgICBjYXNlICdPYmplY3RUeXBlRGVmaW5pdGlvbkV4dGVuc2lvbic6XG4gICAgICBjYXNlICdJbnRlcmZhY2VUeXBlRGVmaW5pdGlvbic6XG4gICAgICBjYXNlICdJbnRlcmZhY2VUeXBlRGVmaW5pdGlvbkV4dGVuc2lvbic6XG4gICAgICBjYXNlICdJbnB1dE9iamVjdFR5cGVEZWZpbml0aW9uJzpcbiAgICAgIGNhc2UgJ0lucHV0T2JqZWN0VHlwZURlZmluaXRpb25FeHRlbnNpb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGFyZVR5cGVBbmRTdWJUeXBlKCdkaXJlY3RpdmVzJywgbFR5cGUsIHJUeXBlLCByZXNvbHZlcnMpXG4gICAgICAgIHBhcmVUeXBlQW5kU3ViVHlwZSgnZmllbGRzJywgbFR5cGUsIHJUeXBlLCByZXNvbHZlcnMpXG5cbiAgICAgICAgaWYgKCFsVHlwZS5maWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGluZGV4ID0gbEFTVC5kZWZpbml0aW9ucy5pbmRleE9mKGxUeXBlKVxuXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgbEFTVC5kZWZpbml0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCA9IFNjaGVtYXRhLmZyb20odGhpcy5jb25zdHJ1Y3Rvci5ncWwucHJpbnQobEFTVCksIHJlc29sdmVycylcbiAgICByZXN1bHQuI2dlbmVyYXRlU2NoZW1hKClcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG5ldyBTY2hlbWF0YSBvYmplY3QgaW5zdGFuY2Ugd2l0aCBtZXJnZWQgc2NoZW1hIGRlZmluaXRpb25zIGFzIGl0c1xuICAgKiBjb250ZW50cyBhcyB3ZWxsIGFzIG1lcmdlZCByZXNvbHZlcnMgYW5kIG5ld2x5IGJvdW5kIGV4ZWN1dGFibGUgc2NoZW1hIGFyZVxuICAgKiBhbGwgY3JlYXRlZCBpbiB0aGlzIHN0ZXAgYW5kIHBhc3NlZCBiYWNrLiBUaGUgb2JqZWN0IGluc3RhbmNlIGl0c2VsZiBpc1xuICAgKiBub3QgbW9kaWZpZWRcbiAgICpcbiAgICogUG9zdCBtZXJnZSwgdGhlIHByZXZpb3VzbHkgc3RvcmVkIGFuZCBtZXJnZWQgcmVzb2x2ZXJzIG1hcCBhcmUgYXJlIGFwcGxpZWRcbiAgICogYW5kIGEgbmV3IGV4ZWN1dGFibGUgc2NoZW1hIGlzIGJ1aWx0IGZyb20gdGhlIGFzaGVzIG9mIHRoZSBvbGQuXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hU291cmNlfSBzY2hlbWEgYW4gaW5zdGFuY2Ugb2YgR3JhcGhRTFNjaGVtYSB0byBtZXJnZVxuICAgKiBAcGFyYW0ge01lcmdlT3B0aW9uc0NvbmZpZ30gY29uZmlnIGFuIG9iamVjdCBkZWZpbmluZyBob3cgY29uZmxpY3RzIHNob3VsZFxuICAgKiBiZSByZXNvbHZlZC4gVGhpcyBkZWZhdWx0cyB0byBgRGVmYXVsdE1lcmdlT3B0aW9uc2AuXG4gICAqIEByZXR1cm4ge1NjaGVtYXRhfSBhIG5ldyBpbnN0YW5jZSBvZiBTY2hlbWF0YSB3aXRoIGEgbWVyZ2VkIHNjaGVtYSBzdHJpbmcsXG4gICAqIG1lcmdlZCByZXNvbHZlciBtYXAgYW5kIG5ld2x5IGJvdW5kIGV4ZWN1dGFibGUgc2NoZW1hIGF0dGFjaGVkIGFyZSBhbGxcbiAgICogaW5pdGlhdGVkXG4gICAqL1xuICBtZXJnZShcbiAgICBzY2hlbWEsXG4gICAgY29uZmlnID0gRGVmYXVsdE1lcmdlT3B0aW9uc1xuICApIHtcbiAgICBpZiAoIXNjaGVtYSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGlubGluZWBcbiAgICAgICAgSW4gdGhlIGNhbGwgdG8gbWVyZ2VTY2hlbWEoc2NoZW1hKSwgJHtzY2hlbWF9IHdhcyByZWNlaXZlZCBhcyBhIHZhbHVlXG4gICAgICAgIGFuZCB0aGUgY29kZSBjb3VsZCBub3QgcHJvY2VlZCBiZWNhdXNlIG9mIGl0LiBQbGVhc2UgY2hlY2sgeW91ciBjb2RlXG4gICAgICAgIGFuZCB0cnkgYWdhaW5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgLy8gU3RlcDA6IEVuc3VyZSB3ZSBoYXZlIGFsbCB0aGUgZGVmYXVsdHMgZm9yIGNvbmZpZyBhbmQgc2NoZW1hXG4gICAgc2NoZW1hID0gbm9ybWFsaXplU291cmNlKHNjaGVtYSwgdHJ1ZSlcblxuICAgIGlmIChjb25maWcgIT09IERlZmF1bHRNZXJnZU9wdGlvbnMpIHtcbiAgICAgIGxldCBtZXJnZWRDb25maWcgPSBtZXJnZSh7fSwgRGVmYXVsdE1lcmdlT3B0aW9ucylcbiAgICAgIGNvbmZpZyA9IG1lcmdlKG1lcmdlZENvbmZpZywgY29uZmlnKVxuICAgIH1cblxuICAgIC8vIFN0ZXAxOiBNZXJnZSBTREw7IHF1aXQgYXQgdGhpcyBwb2ludCBpZiB0aGVyZSBhcmUgbm8gcmVzb2x2ZXJzXG4gICAgbGV0IGxlZnQgPSBTY2hlbWF0YS5mcm9tKHRoaXMsIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBsZXQgcmlnaHQgPSBTY2hlbWF0YS5mcm9tKHNjaGVtYSwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGxldCBtZXJnZWQgPSBsZWZ0Lm1lcmdlU0RMKHJpZ2h0LCBjb25maWcuY29uZmxpY3RSZXNvbHZlcnMpXG5cbiAgICAvLyBJZiBuZWl0aGVyIHNjaGVtYXRhIGluc3RhbmNlIGhhcyBhIHJlc29sdmVyLCB0aGVyZSBpcyBubyByZWFzb25cbiAgICAvLyB0byBjb250aW51ZS4gUmV0dXJuIHRoZSBtZXJnZWQgc2NoZW1hcyBhbmQgY2FsbCBpdCBhIGRheS5cbiAgICBpZiAoXG4gICAgICAoIWxlZnQucmVzb2x2ZXJzIHx8ICFPYmplY3Qua2V5cyhsZWZ0LnJlc29sdmVycykubGVuZ3RoKSAmJlxuICAgICAgKCFyaWdodC5yZXNvbHZlcnMgfHwgIU9iamVjdC5rZXlzKHJpZ2h0LnJlc29sdmVycykubGVuZ3RoKVxuICAgICkge1xuICAgICAgcmV0dXJuIG1lcmdlZFxuICAgIH1cblxuICAgIC8vIFN0ZXAyOiBCYWNrdXAgcmVzb2x2ZXJzIGZyb20gbGVmdCwgcmlnaHQsIG9yIGJvdGhcbiAgICBsZXQgcHJldk1hcHMgPSAobGVmdC5wcmV2UmVzb2x2ZXJNYXBzIHx8IFtdKS5jb25jYXQoXG4gICAgICByaWdodC5wcmV2UmVzb2x2ZXJNYXBzIHx8IFtdLFxuICAgICAgRXh0ZW5kZWRSZXNvbHZlck1hcC5mcm9tKGxlZnQpLFxuICAgICAgRXh0ZW5kZWRSZXNvbHZlck1hcC5mcm9tKHJpZ2h0KVxuICAgIClcbiAgICBtZXJnZWQucHJldlJlc29sdmVyTWFwcyA9IHByZXZNYXBzXG5cbiAgICAvLyBTdGVwMzogTWVyZ2UgcmVzb2x2ZXJzXG4gICAgbGV0IG1lcmdlUmVzb2x2ZXJzID0ge31cblxuICAgIGlmIChwcmV2TWFwcz8ubGVuZ3RoKSB7XG4gICAgICBtZXJnZVJlc29sdmVycyA9IHByZXZNYXBzLnJlZHVjZSgocCwgYywgaSwgYSkgPT4ge1xuICAgICAgICByZXR1cm4gbWVyZ2UocCwgYy5yZXNvbHZlcnMgfHwge30pXG4gICAgICB9LCB7fSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBtZXJnZShtZXJnZVJlc29sdmVycywgbGVmdC5yZXNvbHZlcnMpXG4gICAgICBtZXJnZShtZXJnZVJlc29sdmVycywgcmlnaHQucmVzb2x2ZXJzKVxuICAgIH1cbiAgICBtZXJnZWQucmVzb2x2ZXJzID0gbWVyZ2VSZXNvbHZlcnNcblxuICAgIC8vIFN0ZXAgNDogVHJpZ2dlciBhIG5ldyBzY2hlbWEgY3JlYXRpb25cbiAgICBpZiAoY29uZmlnLmNyZWF0ZU1pc3NpbmdSZXNvbHZlcnMpIHtcbiAgICAgIG1lcmdlZC5yZXNvbHZlcnMgPSBtZXJnZWQuYnVpbGRSZXNvbHZlckZvckVhY2hGaWVsZCgpXG4gICAgfVxuICAgIG1lcmdlZC5jbGVhclNjaGVtYSgpXG4gICAgbWVyZ2VkLiNnZW5lcmF0ZVNjaGVtYSgpXG5cbiAgICAvLyBTdGVwNTogV3JhcCByZXNvbHZlcnNcbiAgICBpZiAoY29uZmlnLmluamVjdE1lcmdlZFNjaGVtYSkge1xuICAgICAgbWVyZ2VkLmZvckVhY2hGaWVsZChcbiAgICAgICAgKFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgdHlwZURpcmVjdGl2ZXMsXG4gICAgICAgICAgZmllbGQsXG4gICAgICAgICAgZmllbGROYW1lLFxuICAgICAgICAgIGZpZWxkQXJncyxcbiAgICAgICAgICBmaWVsZERpcmVjdGl2ZXMsXG4gICAgICAgICAgc2NoZW1hLFxuICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgaWYgKGZpZWxkLnJlc29sdmUpIHtcbiAgICAgICAgICAgIGZpZWxkLnJlc29sdmUgPSBFeHRlbmRlZFJlc29sdmVyLlNjaGVtYUluamVjdG9yKFxuICAgICAgICAgICAgICBmaWVsZC5yZXNvbHZlLFxuICAgICAgICAgICAgICBtZXJnZWQuc2NoZW1hXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmICghbWVyZ2VkLnJlc29sdmVyc1t0eXBlTmFtZV0pIHtcbiAgICAgICAgICAgICAgbWVyZ2VkLnJlc29sdmVyc1t0eXBlTmFtZV0gPSB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtZXJnZWQucmVzb2x2ZXJzW3R5cGVOYW1lXVtmaWVsZE5hbWVdID0gZmllbGQucmVzb2x2ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuXG4gICAgICAvLyBEbyB0aGlzIG9uY2UgbW9yZSB0byBlbnN1cmUgd2UgYXJlIHVzaW5nIHRoZSBtb2RpZmllZCByZXNvbHZlcnNcbiAgICAgIG1lcmdlZC5jbGVhclNjaGVtYSgpXG4gICAgICBtZXJnZWQuI2dlbmVyYXRlU2NoZW1hKClcbiAgICB9XG5cbiAgICAvLyBTdGVwNjogUmV0dXJuIGZpbmFsIG1lcmdlZCBwcm9kdWN0XG4gICAgcmV0dXJuIG1lcmdlZFxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IGZvciB0aGUgbWVyZ2UoKSBmdW5jdGlvbjsgbWVyZ2VTREwgc3RpbGwgZXhpc3RzIGFzIGFuIGVudGl0eSBvZlxuICAgKiBpdHNlbGYsIGJ1dCBtZXJnZSgpIHdpbGwgaW52b2tlIHRoYXQgZnVuY3Rpb24gYXMgbmVlZGVkIHRvIGRvIGl0cyBqb2IgYW5kXG4gICAqIGlmIHRoZXJlIGFyZW4ndCBhbnkgcmVzb2x2ZXJzIHRvIGNvbnNpZGVyLCB0aGUgZnVuY3Rpb25zIGFjdCBpZGVudGljYWxseS5cbiAgICpcbiAgICogQHNlZSBtZXJnZVxuICAgKlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWEgfCBTY2hlbWF0YX0gc2NoZW1hIGFuIGluc3RhbmNlIG9mIEdyYXBoUUxTY2hlbWEgdG9cbiAgICogbWVyZ2UuIENhbiBiZSBlaXRoZXIgYSBHcmFwaFFMU2NoZW1hIG9yIGEgU2NoZW1hdGEgaW5zdGFuY2VcbiAgICogQHBhcmFtIHtNZXJnZU9wdGlvbnNDb25maWd9IGNvbmZpZyBhbiBvYmplY3QgZGVmaW5pbmcgaG93IGNvbmZsaWN0cyBzaG91bGRcbiAgICogYmUgcmVzb2x2ZWQuIFRoaXMgZGVmYXVsdHMgdG8gYERlZmF1bHRNZXJnZU9wdGlvbnNgLlxuICAgKiBAcmV0dXJuIHtTY2hlbWF0YX0gYSBuZXcgaW5zdGFuY2Ugb2YgU2NoZW1hdGEgd2l0aCBhIG1lcmdlZCBzY2hlbWEgc3RyaW5nLFxuICAgKiBtZXJnZWQgcmVzb2x2ZXIgbWFwIGFuZCBuZXdseSBib3VuZCBleGVjdXRhYmxlIHNjaGVtYSBhdHRhY2hlZCBhcmUgYWxsXG4gICAqIGluaXRpYXRlZFxuICAgKi9cbiAgbWVyZ2VTY2hlbWEoXG4gICAgc2NoZW1hLFxuICAgIGNvbmZpZyA9IERlZmF1bHRNZXJnZU9wdGlvbnNcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2Uoc2NoZW1hLCBjb25maWcpXG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYSBzY2hlbWEsIGJhc2VkIG9uIHRoZSBTY2hlbWF0YSB0aGlzIG9iamVjdCBpcyBiYXNlZCBvbiwgd2FsayBpdCBhbmRcbiAgICogYnVpbGQgdXAgYSByZXNvbHZlciBtYXAuIFRoaXMgZnVuY3Rpb24gd2lsbCBhbHdheXMgcmV0dXJuIGEgbm9uLW51bGxcbiAgICogb2JqZWN0LiBJdCB3aWxsIGJlIGVtcHR5IGlmIHRoZXJlIGFyZSBlaXRoZXIgbm8gcmVzb2x2ZXJzIHRvIGJlIGZvdW5kXG4gICAqIGluIHRoZSBzY2hlbWEgb3IgaWYgYSB2YWxpZCBzY2hlbWEgY2Fubm90IGJlIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbnxSZXNvbHZlck1hcH0gZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0gaWYgdGhpc1xuICAgKiB2YWx1ZSBpcyBib29sZWFuLCBhbmQgaWYgdGhpcyB2YWx1ZSBpcyB0cnVlLCB0aGUgcmVzb2x2ZXJzIGZyb20gUXVlcnksXG4gICAqIE11dGF0aW9uIGFuZCBTdWJzY3JpcHRpb24gdHlwZXMgd2lsbCBiZSBmbGF0dGVuZWQgdG8gdGhlIHJvb3Qgb2YgdGhlXG4gICAqIG9iamVjdC4gSWYgdGhlIGZpcnN0IHBhcmFtZXRyIGlzIGFuIE9iamVjdCwgaXQgd2lsbCBiZSBtZXJnZWQgaW4gbm9ybWFsbHlcbiAgICogd2l0aCBtZXJnZS5cbiAgICogQHBhcmFtIHtSZXNvbHZlck1hcFtdfSBleHRlbmRXaXRoIGFuIHVubGltaXRlZCBhcnJheSBvZiBvYmplY3RzXG4gICAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gZXh0ZW5kIHRoZSBidWlsdCByZXNvbHZlciBtYXAuXG4gICAqIEByZXR1cm4ge1Jlc29sdmVyTWFwfSBhIHJlc29sdmVyIG1hcDsgaS5lLiBhbiBvYmplY3Qgb2YgcmVzb2x2ZXIgZnVuY3Rpb25zXG4gICAqL1xuICBidWlsZFJlc29sdmVycyhmbGF0dGVuUm9vdFJlc29sdmVyc09yRmlyc3RQYXJhbSwgLi4uZXh0ZW5kV2l0aCkge1xuICAgIGxldCBzY2hlbWF0YSA9IFNjaGVtYXRhLmZyb20odGhpcy5zZGwsIHRoaXMucmVzb2x2ZXJzKVxuICAgIGxldCByZXNvbHZlcnMgPSBtZXJnZShcbiAgICAgIHt9LFxuICAgICAgc3RyaXBSZXNvbHZlcnNGcm9tU2NoZW1hKHNjaGVtYXRhLnNjaGVtYSkgfHwgc2NoZW1hdGEucmVzb2x2ZXJzIHx8IHt9XG4gICAgKVxuXG4gICAgLy8gTmV4dCBjaGVjayB0byBzZWUgaWYgd2UgYXJlIGZsYXR0ZW5pbmcgb3Igc2ltcGx5IGV4dGVuZGluZ1xuICAgIGlmICh0eXBlb2YgZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0gPT09ICdib29sZWFuJykge1xuICAgICAgZm9yIChsZXQgcm9vdFR5cGUgb2YgWydRdWVyeScsICdNdXRhdGlvbicsICdTdWJzY3JpcHRpb24nXSkge1xuICAgICAgICBpZiAoZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0pIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZXJzW3Jvb3RUeXBlXSkge1xuICAgICAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgT2JqZWN0LmtleXMocmVzb2x2ZXJzW3Jvb3RUeXBlXSkpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZXJzW2ZpZWxkXSA9IHJlc29sdmVyc1tyb290VHlwZV1bZmllbGRdXG4gICAgICAgICAgICAgIGRlbGV0ZSByZXNvbHZlcnNbcm9vdFR5cGVdW2ZpZWxkXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWxldGUgcmVzb2x2ZXJzW3Jvb3RUeXBlXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBPYmplY3Qua2V5cyhyZXNvbHZlcnMpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBkZWJ1Z19sb2coJ1tidWlsZFJlc29sdmVycygpXSBmaW5kaW5nIGZpZWxkIGluIHNjaGVtYScpXG4gICAgICAgICAgICAgIGlmIChzY2hlbWF0YS5zY2hlbWFGaWVsZEJ5TmFtZShyb290VHlwZSwgZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJzW3Jvb3RUeXBlXSA9IHJlc29sdmVyc1tyb290VHlwZV0gfHwge31cbiAgICAgICAgICAgICAgICByZXNvbHZlcnNbcm9vdFR5cGVdW2ZpZWxkXSA9IHJlc29sdmVyc1tmaWVsZF1cbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzb2x2ZXJzW2ZpZWxkXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZGVidWdfbG9nKGlubGluZWBcbiAgICAgICAgICAgICAgICBbYnVpbGRSZXNvbHZlcnMoKV0gRmFsbGluZyBiYWNrIHRvIFxcYGFzdEZpZWxkQnlOYW1lKClcXGBcbiAgICAgICAgICAgICAgYClcbiAgICAgICAgICAgICAgZGVidWdfdHJhY2UoXG4gICAgICAgICAgICAgICAgaW5saW5lYFxuICAgICAgICAgICAgICAgIFtidWlsZFJlc29sdmVycygpXSBGYWxsaW5nIGJhY2sgdG8gXFxgYXN0RmllbGRCeU5hbWUoKVxcYCBkdWUgdG9cbiAgICAgICAgICAgICAgYCxcbiAgICAgICAgICAgICAgICBlcnJvclxuICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgICAgaWYgKHNjaGVtYXRhLmFzdEZpZWxkQnlOYW1lKHJvb3RUeXBlLCBmaWVsZCkpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlcnNbcm9vdFR5cGVdID0gcmVzb2x2ZXJzW3Jvb3RUeXBlXSB8fCB7fVxuICAgICAgICAgICAgICAgIHJlc29sdmVyc1tyb290VHlwZV1bZmllbGRdID0gcmVzb2x2ZXJzW2ZpZWxkXVxuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXNvbHZlcnNbZmllbGRdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvbHZlcnMgPSBtZXJnZShyZXNvbHZlcnMgfHwge30sIGZsYXR0ZW5Sb290UmVzb2x2ZXJzT3JGaXJzdFBhcmFtIHx8IHt9KVxuICAgIH1cblxuICAgIC8vIEZpbmFsbHkgZXh0ZW5kIHdpdGggYW55IHJlbWFpbmluZyBhcmd1bWVudHNcbiAgICBpZiAoZXh0ZW5kV2l0aC5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgZXh0ZW5kV2l0aCkge1xuICAgICAgICByZXNvbHZlcnMgPSBtZXJnZShyZXNvbHZlcnMgfHwge30sIGl0ZW0gfHwge30pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmVyc1xuICB9XG5cbiAgLyoqXG4gICAqIEZyb20gdGltZSB0byB0aW1lIGl0IG1ha2VzIG1vcmUgc2Vuc2UgdG8gd3JhcCBldmVyeSBwb3NzaWJsZSByZXNvbHZlclxuICAgKiBtYXBwaW5nIGluIGdpdmVuIHNjaGVtYS4gR2V0dGluZyBhIGhhbmRsZSB0byBlYWNoIGZpZWxkcyByZXNvbHZlciBhbmRcbiAgICogb3Igc3Vic3RpdHV0aW5nIG1pc3Npbmcgb25lcyB3aXRoIEdyYXBoUUwncyBkZWZhdWx0RmllbGRSZXNvbHZlciBjYW5cbiAgICogYmUgYSB0aXJlc29tZSBhZmZhaXIuIFRoaXMgbWV0aG9kIHdhbGtzIHRoZSBzY2hlbWEgZm9yIHlvdSBhbmQgcmV0dXJuc1xuICAgKiBhbnkgcHJldmlvdXNseSBkZWZpbmVkIHJlc29sdmVycyBhbG9uZ3NpZGUgZGVmYXVsdEZpZWxkUmVzb2x2ZXJzIGZvclxuICAgKiBlYWNoIHBvc3NpYmxlIGZpZWxkIG9mIGV2ZXJ5IHR5cGUgaW4gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogSWYgYSBzY2hlbWEgY2Fubm90IGJlIGdlbmVyYXRlZCBmcm9tIHRoZSBTREwgcmVwcmVzZW50ZWQgYnkgdGhlIGluc3RhbmNlXG4gICAqIG9mIFNjaGVtYXRhLCB0aGVuIGFuIGVycm9yIGlzIHRocm93bi5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufFJlc29sdmVyTWFwfSBmbGF0dGVuUm9vdFJlc29sdmVyc09yRmlyc3RQYXJhbSBpZiB0aGlzXG4gICAqIHZhbHVlIGlzIGJvb2xlYW4sIGFuZCBpZiB0aGlzIHZhbHVlIGlzIHRydWUsIHRoZSByZXNvbHZlcnMgZnJvbSBRdWVyeSxcbiAgICogTXV0YXRpb24gYW5kIFN1YnNjcmlwdGlvbiB0eXBlcyB3aWxsIGJlIGZsYXR0ZW5lZCB0byB0aGUgcm9vdCBvZiB0aGVcbiAgICogb2JqZWN0LiBJZiB0aGUgZmlyc3QgcGFyYW1ldHIgaXMgYW4gUmVzb2x2ZXJNYXAsIGl0IHdpbGwgYmUgbWVyZ2VkIGluXG4gICAqIG5vcm1hbGx5IHdpdGggbWVyZ2UuXG4gICAqIEBwYXJhbSB7UmVzb2x2ZXJNYXBbXX0gZXh0ZW5kV2l0aCBhbiB1bmxpbWl0ZWQgYXJyYXkgb2Ygb2JqZWN0c1xuICAgKiB0aGF0IGNhbiBiZSB1c2VkIHRvIGV4dGVuZCB0aGUgYnVpbHQgcmVzb2x2ZXIgbWFwLlxuICAgKiBAcmV0dXJuIHtSZXNvbHZlck1hcH0gYSByZXNvbHZlciBtYXA7IGkuZS4gYW4gb2JqZWN0IG9mIHJlc29sdmVyIGZ1bmN0aW9uc1xuICAgKi9cbiAgYnVpbGRSZXNvbHZlckZvckVhY2hGaWVsZChmbGF0dGVuUm9vdFJlc29sdmVyc09yRmlyc3RQYXJhbSwgLi4uZXh0ZW5kV2l0aCkge1xuICAgIGlmICghdGhpcy5zY2hlbWEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihpbmxpbmVgXG4gICAgICAgIGJ1aWxkUmVzb2x2ZXJGb3JFYWNoRmllbGQoKSBjYW5ub3QgYmUgY2FsbGVkIHVubGVzcyB0aGVyZSBpcyBlbm91Z2hcbiAgICAgICAgdmFsaWQgU0RMIGluIHRoZSBpbnN0YW5jZSB0byBjb25zdHJ1Y3QgYSBzY2hlbWEuIFBsZWFzZSBjaGVjayB5b3VyXG4gICAgICAgIGNvZGUhXG4gICAgICBgKVxuICAgIH1cblxuICAgIGxldCBpbnRlcmltID0gU2NoZW1hdGEuZnJvbSh0aGlzLnNkbCwgdGhpcy5yZXNvbHZlcnMpXG4gICAgbGV0IHIgPSB7fVxuXG4gICAgaW50ZXJpbS5mb3JFYWNoRmllbGQoXG4gICAgICAoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHR5cGVOYW1lLFxuICAgICAgICB0eXBlRGlyZWN0aXZlcyxcbiAgICAgICAgZmllbGQsXG4gICAgICAgIGZpZWxkTmFtZSxcbiAgICAgICAgZmllbGRBcmdzLFxuICAgICAgICBmaWVsZERpcmVjdGl2ZXMsXG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgY29udGV4dFxuICAgICAgKSA9PiB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGUgcGF0aCB0byB0aGUgdHlwZSBpbiBxdWVzdGlvbiBleGlzdHMgYmVmb3JlIGNvbnRpbnVpbmdcbiAgICAgICAgLy8gb253YXJkXG4gICAgICAgIChyW3R5cGVOYW1lXSA9IHJbdHlwZU5hbWVdIHx8IHt9KVtmaWVsZE5hbWVdID1cbiAgICAgICAgICAoclt0eXBlTmFtZV1bZmllbGROYW1lXSB8fCB7fSlcblxuICAgICAgICByW3R5cGVOYW1lXVtmaWVsZE5hbWVdID0gZmllbGQucmVzb2x2ZSB8fCBkZWZhdWx0RmllbGRSZXNvbHZlclxuICAgICAgfVxuICAgIClcblxuICAgIGludGVyaW0ucmVzb2x2ZXJzID0gclxuXG4gICAgcmV0dXJuIGludGVyaW0uYnVpbGRSZXNvbHZlcnMoXG4gICAgICBmbGF0dGVuUm9vdFJlc29sdmVyc09yRmlyc3RQYXJhbSxcbiAgICAgIC4uLmV4dGVuZFdpdGhcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdG8gZGV0ZXJtaW5lIGlmIGFuIGV4ZWN1dGFibGUgc2NoZW1hIGlzIGF0dGFjaGVkIHRvIHRoaXMgU2NoZW1hdGFcbiAgICogaW5zdGFuY2UuIEl0IGRvZXMgc28gYnkgd2Fsa2luZyB0aGUgc2NoZW1hIGZpZWxkcyB2aWEgYGJ1aWxkUmVzb2x2ZXJzKClgXG4gICAqIGFuZCByZXBvcnRpbmcgd2hldGhlciB0aGVyZSBpcyBhbnl0aGluZyBpbnNpZGUgdGhlIHJlc3VsdHMgb3Igbm90LlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBoYXNBbkV4ZWN1dGFibGVTY2hlbWEoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuYnVpbGRSZXNvbHZlcnMoKSkubGVuZ3RoID4gMFxuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBgLnNkbGAgcHJvcGVydHkgaXMgdmFsaWQgU0RML0lETCBhbmQgY2FuIGdlbmVyYXRlIHZhbGlkIEFTVCBub2Rlc1xuICAgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRydWUuIEl0IHdpbGwgcmV0dXJuIGZhbHNlIG90aGVyd2lzZS5cbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgdmFsaWRTREwoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IuZ3FsLnBhcnNlKHRoaXMuc2RsKVxuICAgICAgZGVidWdfbG9nKCdbZ2V0IC52YWxpZFNETF0gdHJ1ZScpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgZGVidWdfbG9nKCdbZ2V0IC52YWxpZFNETF0gZmFsc2UnKVxuICAgICAgZGVidWdfdHJhY2UoJ1tnZXQgLnZhbGlkU0RMXSAnLCBlKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBgLnNjaGVtYWAgcHJvcGVydHkgaXMgdmFsaWQgU0RML0lETCBhbmQgY2FuIGdlbmVyYXRlIGEgdmFsaWRcbiAgICogR3JhcGhRTFNjaGVtYSwgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0cnVlLiBJdCB3aWxsIHJldHVybiBmYWxzZVxuICAgKiBvdGhlcndpc2UuXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IHZhbGlkU2NoZW1hKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLiNnZW5lcmF0ZVNjaGVtYSgpXG4gICAgICBkZWJ1Z19sb2coJ1tnZXQgLnZhbGlkU2NoZW1hXSB0cnVlJylcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBkZWJ1Z19sb2coJ1tnZXQgLnZhbGlkU2NoZW1hXSBmYWxzZScpXG4gICAgICBkZWJ1Z190cmFjZSgnW2dldCAudmFsaWRTY2hlbWFdICcsIGUpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzdHJpbmcgdW5kZXJseWluZyB0aGlzIGluc3RhbmNlIHJlcHJlc2VudHMgdmFsaWQgU0RMXG4gICAqIHRoYXQgY2FuIGJlIGJvdGggY29udmVydGVkIHRvIEFTVCBub2RlcyBvciBhIHZhbGlkIEdyYXBoUUxTY2hlbWEgaW5zdGFuY2VcbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgdmFsaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRTREwgJiYgdGhpcy52YWxpZFNjaGVtYVxuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBpbnRlcm5hbCByZXNvbHZlcnMgb2JqZWN0IG5lZWRzIHRvIGJlIGNoYW5nZWQgYWZ0ZXIgY3JlYXRpb24sIHRoaXNcbiAgICogbWV0aG9kIGFsbG93cyBhIHdheSB0byBkbyBzby4gU2V0dGluZyB0aGUgdmFsdWUgdG8gYG51bGxgIGlzIGVxdWl2YWxlbnRcbiAgICogdG8gcmVtb3ZpbmcgYW55IHN0b3JlZCB2YWx1ZS4gRmluYWxseSB0aGUgY29udGVudHMgYXJlIHN0b3JlZCBpbiBhIHdlYWtcbiAgICogbWFwIHNvIGl0cyBjb250ZW50cyBhcmUgbm90IGd1YXJhbnRlZWQgb3ZlciBhIGxvbmcgcGVyaW9kIG9mIHRpbWUuXG4gICAqXG4gICAqIEB0eXBlIHtSZXNvbHZlck1hcH1cbiAgICovXG4gIHNldCByZXNvbHZlcnMocmVzb2x2ZXJzKSB7XG4gICAgdGhpc1tNQVBdLnNldCh3bWtSZXNvbHZlcnMsIHJlc29sdmVycylcbiAgICB0aGlzLmNsZWFyU2NoZW1hKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSByZXNvbHZlciBtYXAgYXNzb2NpYXRlZCB3aXRoIHRoaXMgU2NoZW1hdGEgaW5zdGFuY2VcbiAgICovXG4gIGNsZWFyUmVzb2x2ZXJzKCkge1xuICAgIHRoaXMucmVzb2x2ZXJzID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHNjaGVtYSBzdG9yZWQgd2l0aCB0aGlzIFNjaGVtYXRhIGluc3RhbmNlXG4gICAqL1xuICBjbGVhclNjaGVtYSgpIHtcbiAgICB0aGlzLnNjaGVtYSA9IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB1bmRlcmx5aW5nIHN0cmluZyBwYXNzZWQgb3IgZ2VuZXJhdGVkIGluIHRoZSBjb25zdHJ1Y3RvciB3aGVuXG4gICAqIGluc3BlY3RlZCBpbiB0aGUgbm9kZUpTIFJFUEwuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gcmV0dXJucyB0aGUgdW5kZXJseWluZyBTREwvSURMIHN0cmluZyB0aGlzIFNjaGVtYXRhXG4gICAqIGluc3RhbmNlIGlzIGJhc2VkIG9uLlxuICAgKi9cbiAgW1V0aWwuaW5zcGVjdC5jdXN0b21dKCkge1xuICAgIHJldHVybiB0aGlzLnNkbFxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzYW1lIGFzIGBpbnNwZWN0KClgLCBgdG9TdHJpbmcoKWAsIGFuZCBgdmFsdWVPZigpYC4gVGhpcyBtZXRob2RcbiAgICogcmV0dXJucyB0aGUgdW5kZXJseWluZyBzdHJpbmcgdGhpcyBjbGFzcyBpbnN0YW5jZSB3YXMgY3JlYXRlZCBvbi5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSByZXR1cm5zIHRoZSB1bmRlcmx5aW5nIFNETC9JREwgc3RyaW5nIHRoaXMgU2NoZW1hdGFcbiAgICogaW5zdGFuY2UgaXMgYmFzZWQgb24uXG4gICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zZGxcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2FtZSBhcyBgaW5zcGVjdCgpYCwgYHRvU3RyaW5nKClgLCBhbmQgYHZhbHVlT2YoKWAuIFRoaXMgbWV0aG9kXG4gICAqIHJldHVybnMgdGhlIHVuZGVybHlpbmcgc3RyaW5nIHRoaXMgY2xhc3MgaW5zdGFuY2Ugd2FzIGNyZWF0ZWQgb24uXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gcmV0dXJucyB0aGUgdW5kZXJseWluZyBTREwvSURMIHN0cmluZyB0aGlzIFNjaGVtYXRhXG4gICAqIGluc3RhbmNlIGlzIGJhc2VkIG9uLlxuICAgKi9cbiAgdmFsdWVPZigpIHtcbiAgICByZXR1cm4gdGhpcy5zZGxcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIHRoZSB2YWx1ZXMgY29udGFpbmVkIGluIGEgU2NoZW1hJ3MgdHlwZU1hcC4gSWYgYSBkZXNpcmVkXG4gICAqIHZhbHVlIGlzIGVuY291bnRlcmVkLCB0aGUgc3VwcGxpZWQgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkLiBUaGUgdmFsdWVzIGFyZVxuICAgKiB0aGUgY29uc3RhbnRzIEFMTCwgVFlQRVMsIElOVEVSRkFDRVMsIEVOVU1TLCBVTklPTlMgYW5kIFNDQUxBUlMuIE9wdGlvbmFsbHlcbiAgICogSElEREVOIGlzIGFub3RoZXIgdmFsdWUgdGhhdCBjYW4gYmUgYml0bWFza2VkIHRvZ2V0aGVyIGZvciBhIHZhcmllZCByZXN1bHQuXG4gICAqIEhJRERFTiBleHBvc2VzIHRoZSB2YWx1ZXMgaW4gdGhlIHNjaGVtYSB0eXBlbWFwIHRoYXQgYmVnaW4gd2l0aCBhIGRvdWJsZVxuICAgKiB1bmRlcnNjb3JlLlxuICAgKlxuICAgKiBUaGUgc2lnbmF0dXJlIGZvciB0aGUgZnVuY3Rpb24gY2FsbGJhY2sgaXMgYXMgZm9sbG93czpcbiAgICogKFxuICAgKiAgIHR5cGU6IHVua25vd24sXG4gICAqICAgdHlwZU5hbWU6IHN0cmluZyxcbiAgICogICB0eXBlRGlyZWN0aXZlczogQXJyYXk8R3JhcGhRTERpcmVjdGl2ZT5cbiAgICogICBzY2hlbWE6IEdyYXBoUUxTY2hlbWEsXG4gICAqICAgY29udGV4dDogdW5rbm93bixcbiAgICogKSA9PiB2b2lkXG4gICAqXG4gICAqIFdoZXJlOlxuICAgKiAgIGB0eXBlYCAgICAgICAgICAgLSB0aGUgb2JqZWN0IGluc3RhbmNlIGZyb20gd2l0aGluIHRoZSBgR3JhcGhRTFNjaGVtYWBcbiAgICogICBgdHlwZU5hbWVgICAgICAgIC0gdGhlIG5hbWUgb2YgdGhlIG9iamVjdDsgXCJRdWVyeVwiIGZvciB0eXBlIFF1ZXJ5IGFuZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICBzbyBvbi5cbiAgICogICBgdHlwZURpcmVjdGl2ZXNgIC0gYW4gYXJyYXkgb2YgZGlyZWN0aXZlcyBhcHBsaWVkIHRvIHRoZSBvYmplY3Qgb3IgYW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgZW1wdHkgYXJyYXkgaWYgdGhlcmUgYXJlIG5vbmUgYXBwbGllZC5cbiAgICogICBgc2NoZW1hYCAgICAgICAgIC0gYW4gaW5zdGFuY2Ugb2YgYEdyYXBoUUxTY2hlbWFgIG92ZXIgd2hpY2ggdG8gaXRlcmF0ZVxuICAgKiAgIGBjb250ZXh0YCAgICAgICAgLSB1c3VhbGx5IGFuIG9iamVjdCwgYW5kIHVzdWFsbHkgdGhlIHNhbWUgb2JqZWN0LFxuICAgKiAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgdG8gdGhlIGNhbGwgdG8gYG1ha2VFeGVjdXRhYmxlU2NoZW1hKClgXG4gICAqICAgICAgICAgICAgICAgICAgICAgIG9yIGBncmFwaHFsKClgXG4gICAqXG4gICAqIEBwYXJhbSB7Rm9yRWFjaE9mUmVzb2x2ZXJ9IGZuIGEgZnVuY3Rpb24gd2l0aCBhIHNpZ25hdHVyZSBkZWZpbmVkIGFib3ZlXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdHlwZXMgYSBiaXRtYXNrIG9mIG9uZSBvciBtb3JlIG9mIHRoZSBjb25zdGFudHMgZGVmaW5lZFxuICAgKiBhYm92ZS4gVGhlc2UgY2FuIGJlIE9SJ2VkIHRvZ2V0aGVyIGFuZCBkZWZhdWx0IHRvIFRZUEVTLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTREwsIGl0ZXJhdGVkXG4gICAqIG92ZXIgYW5kIHJldHVybmVkLlxuICAgKi9cbiAgZm9yRWFjaE9mKGZuLCBjb250ZXh0LCB0eXBlcywgc3VwcGxpZWRTY2hlbWEgPSBudWxsKSB7XG4gICAgbGV0IHNjaGVtYSA9IHN1cHBsaWVkU2NoZW1hIHx8IHRoaXMuc2NoZW1hXG5cbiAgICBmb3JFYWNoT2Yoc2NoZW1hLCBmbiwgY29udGV4dCwgdHlwZXMpXG5cbiAgICByZXR1cm4gc2NoZW1hXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgdG8gYGZvckVhY2hPZigpYCBzcGVjaWZpYyB0byB0eXBlcy5cbiAgICpcbiAgICogQHNlZSAjZm9yRWFjaE9mXG4gICAqXG4gICAqIEBwYXJhbSB7Rm9yRWFjaE9mUmVzb2x2ZXJ9IGZuIGEgZnVuY3Rpb24gd2l0aCBhIHNpZ25hdHVyZSBkZWZpbmVkIGFib3ZlXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNjaGVtYXRhXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGEgbmV3IHNjaGVtYSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNjaGVtYXRhLFxuICAgKiBpdGVyYXRlZCBvdmVyIGFuZCByZXR1cm5lZC5cbiAgICovXG4gIGZvckVhY2hUeXBlKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoT2YoZm4sIGNvbnRleHQsIFRZUEVTLCBzdXBwbGllZFNjaGVtYSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCB0byBgZm9yRWFjaE9mKClgIHNwZWNpZmljIHRvIGlucHV0IG9iamVjdCB0eXBlcy5cbiAgICpcbiAgICogQHNlZSAjZm9yRWFjaE9mXG4gICAqXG4gICAqIEBwYXJhbSB7Rm9yRWFjaE9mUmVzb2x2ZXJ9IGZuIGEgZnVuY3Rpb24gd2l0aCBhIHNpZ25hdHVyZSBkZWZpbmVkIGFib3ZlXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNjaGVtYXRhXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGEgbmV3IHNjaGVtYSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNjaGVtYXRhLFxuICAgKiBpdGVyYXRlZFxuICAgKiBvdmVyIGFuZCByZXR1cm5lZC5cbiAgICovXG4gIGZvckVhY2hJbnB1dE9iamVjdFR5cGUoZm4sIGNvbnRleHQsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmZvckVhY2hPZihmbiwgY29udGV4dCwgSU5QVVRfVFlQRVMsIHN1cHBsaWVkU2NoZW1hKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGBmb3JFYWNoT2YoKWAgc3BlY2lmaWMgdG8gdW5pb25zLlxuICAgKlxuICAgKiBAc2VlICNmb3JFYWNoT2ZcbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoT2ZSZXNvbHZlcn0gZm4gYSBmdW5jdGlvbiB3aXRoIGEgc2lnbmF0dXJlIGRlZmluZWQgYWJvdmVcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYT99IHN1cHBsaWVkU2NoZW1hIGFuIG9wdGlvbmFsIHNjaGVtYSB0byB1c2UgcmF0aGVyXG4gICAqIHRoYW4gdGhlIG9uZSBjcmVhdGVkIG9yIHN0b3JlZCBpbnRlcm5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGEgbmV3IHNjaGVtYSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETCwgaXRlcmF0ZWRcbiAgICogb3ZlciBhbmQgcmV0dXJuZWQuXG4gICAqL1xuICBmb3JFYWNoVW5pb24oZm4sIGNvbnRleHQsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmZvckVhY2hPZihmbiwgY29udGV4dCwgVU5JT05TLCBzdXBwbGllZFNjaGVtYSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCB0byBgZm9yRWFjaE9mKClgIHNwZWNpZmljIHRvIGVudW1zLlxuICAgKlxuICAgKiBAc2VlICNmb3JFYWNoT2ZcbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoT2ZSZXNvbHZlcn0gZm4gYSBmdW5jdGlvbiB3aXRoIGEgc2lnbmF0dXJlIGRlZmluZWQgYWJvdmVcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYT99IHN1cHBsaWVkU2NoZW1hIGFuIG9wdGlvbmFsIHNjaGVtYSB0byB1c2UgcmF0aGVyXG4gICAqIHRoYW4gdGhlIG9uZSBjcmVhdGVkIG9yIHN0b3JlZCBpbnRlcm5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGEgbmV3IHNjaGVtYSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETCwgaXRlcmF0ZWRcbiAgICogb3ZlciBhbmQgcmV0dXJuZWQuXG4gICAqL1xuICBmb3JFYWNoRW51bShmbiwgY29udGV4dCwgc3VwcGxpZWRTY2hlbWEgPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaE9mKGZuLCBjb250ZXh0LCBFTlVNUywgc3VwcGxpZWRTY2hlbWEpXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgdG8gYGZvckVhY2hPZigpYCBzcGVjaWZpYyB0byBpbnRlcmZhY2VzLlxuICAgKlxuICAgKiBAc2VlICNmb3JFYWNoT2ZcbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoT2ZSZXNvbHZlcn0gZm4gYSBmdW5jdGlvbiB3aXRoIGEgc2lnbmF0dXJlIGRlZmluZWQgYWJvdmVcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYT99IHN1cHBsaWVkU2NoZW1hIGFuIG9wdGlvbmFsIHNjaGVtYSB0byB1c2UgcmF0aGVyXG4gICAqIHRoYW4gdGhlIG9uZSBjcmVhdGVkIG9yIHN0b3JlZCBpbnRlcm5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGEgbmV3IHNjaGVtYSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETCwgaXRlcmF0ZWRcbiAgICogb3ZlciBhbmQgcmV0dXJuZWQuXG4gICAqL1xuICBmb3JFYWNoSW50ZXJmYWNlKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoT2YoZm4sIGNvbnRleHQsIElOVEVSRkFDRVMsIHN1cHBsaWVkU2NoZW1hKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGBmb3JFYWNoT2YoKWAgc3BlY2lmaWMgdG8gdHlwZXMuXG4gICAqXG4gICAqIEBzZWUgI2ZvckVhY2hPZlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hPZlJlc29sdmVyfSBmbiBhIGZ1bmN0aW9uIHdpdGggYSBzaWduYXR1cmUgZGVmaW5lZCBhYm92ZVxuICAgKiBAcGFyYW0ge3Vua25vd259IGNvbnRleHQgdXN1YWxseSBhbiBvYmplY3QgYnV0IGFueSBtaXhlZCB2YWx1ZSB0aGUgZGVub3Rlc1xuICAgKiBzb21lIHNoYXJlZCBjb250ZXh0IGFzIGlzIHVzZWQgd2l0aCB0aGUgc2NoZW1hIGR1cmluZyBub3JtYWwgcnVudGltZS5cbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hP30gc3VwcGxpZWRTY2hlbWEgYW4gb3B0aW9uYWwgc2NoZW1hIHRvIHVzZSByYXRoZXJcbiAgICogdGhhbiB0aGUgb25lIGNyZWF0ZWQgb3Igc3RvcmVkIGludGVybmFsbHkgZ2VuZXJhdGVkIGZyb20gdGhpcyBTRExcbiAgICogQHJldHVybiB7R3JhcGhRTFNjaGVtYX0gYSBuZXcgc2NoZW1hIGlzIGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMLFxuICAgKiBpdGVyYXRlZCBvdmVyIGFuZCByZXR1cm5lZC5cbiAgICovXG4gIGZvckVhY2hTY2FsYXIoZm4sIGNvbnRleHQsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmZvckVhY2hPZihmbiwgY29udGV4dCwgU0NBTEFSUywgc3VwcGxpZWRTY2hlbWEpXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgdG8gYGZvckVhY2hPZigpYCBzcGVjaWZpYyB0byBhbGwgcm9vdCB0eXBlczsgUXVlcnksIE11dGF0aW9uIGFuZFxuICAgKiBTdWJzY3JpcHRpb24gdGhhdCBleGlzdCB3aXRoaW4gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogQHNlZSAjZm9yRWFjaE9mXG4gICAqXG4gICAqIEBwYXJhbSB7Rm9yRWFjaE9mUmVzb2x2ZXJ9IGZuIGEgZnVuY3Rpb24gd2l0aCBhIHNpZ25hdHVyZSBkZWZpbmVkIGFib3ZlXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTREwsIGl0ZXJhdGVkXG4gICAqIG92ZXIgYW5kIHJldHVybmVkLlxuICAgKi9cbiAgZm9yRWFjaFJvb3RUeXBlKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoT2YoZm4sIGNvbnRleHQsIFJPT1RfVFlQRVMsIHN1cHBsaWVkU2NoZW1hKVxuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV4dGVuc2lvbiBvZiBgZm9yRWFjaE9mYCB0aGF0IHRhcmdldHMgdGhlIGZpZWxkcyBvZiB0aGUgdHlwZXMgaW4gdGhlXG4gICAqIHNjaGVtYSdzIHR5cGVNYXAuIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgbW9yZSBkZXRhaWwgYW5kIGFsbG93cyBncmVhdGVyXG4gICAqIGFjY2VzcyB0byBhbnkgYXNzb2NpYXRlZCBgY29udGV4dGAgdGhhbiB0aGUgZnVuY3Rpb24gb2YgdGhlIHNhbWUgbmFtZVxuICAgKiBwcm92aWRlZCBieSB0aGUgYGdyYXBocWwtdG9vbHNgIGxpYnJhcnkuXG4gICAqXG4gICAqIFRoZSBzaWduYXR1cmUgZm9yIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBpcyBhcyBmb2xsb3dzXG4gICAqXG4gICAqIChcbiAgICogICB0eXBlOiB1bmtub3duLFxuICAgKiAgIHR5cGVOYW1lOiBzdHJpbmcsXG4gICAqICAgdHlwZURpcmVjdGl2ZXM6IEFycmF5PEdyYXBoUUxEaXJlY3RpdmU+LFxuICAgKiAgIGZpZWxkOiB1bmtub3duLFxuICAgKiAgIGZpZWxkTmFtZTogc3RyaW5nLFxuICAgKiAgIGZpZWxkQXJnczogQXJyYXk8R3JhcGhRTEFyZ3VtZW50PixcbiAgICogICBmaWVsZERpcmVjdGl2ZXM6IEFycmF5PEdyYXBoUUxEaXJlY3RpdmU+LFxuICAgKiAgIHNjaGVtYTogR3JhcGhRTFNjaGVtYSxcbiAgICogICBjb250ZXh0OiB1bmtub3duXG4gICAqICkgPT4gdm9pZFxuICAgKlxuICAgKiBXaGVyZVxuICAgKlxuICAgKiBXaGVyZTpcbiAgICogICBgdHlwZWAgICAgICAgICAgIC0gdGhlIG9iamVjdCBpbnN0YW5jZSBmcm9tIHdpdGhpbiB0aGUgYEdyYXBoUUxTY2hlbWFgXG4gICAqICAgYHR5cGVOYW1lYCAgICAgICAtIHRoZSBuYW1lIG9mIHRoZSBvYmplY3Q7IFwiUXVlcnlcIiBmb3IgdHlwZSBRdWVyeSBhbmRcbiAgICogICAgICAgICAgICAgICAgICAgICAgc28gb25cbiAgICogICBgdHlwZURpcmVjdGl2ZXNgIC0gYW4gYXJyYXkgb2YgZGlyZWN0aXZlcyBhcHBsaWVkIHRvIHRoZSBvYmplY3Qgb3IgYW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgZW1wdHkgYXJyYXkgaWYgdGhlcmUgYXJlIG5vbmUgYXBwbGllZC5cbiAgICogICBgZmllbGRgICAgICAgICAgIC0gdGhlIGZpZWxkIGluIHF1ZXN0aW9uIGZyb20gdGhlIHR5cGVcbiAgICogICBgZmllbGROYW1lYCAgICAgIC0gdGhlIG5hbWUgb2YgdGhlIGZpZWxkIGFzIGEgc3RyaW5nXG4gICAqICAgYGZpZWxkQXJnc2AgICAgICAtIGFuIGFycmF5IG9mIGFyZ3VtZW50cyBmb3IgdGhlIGZpZWxkIGluIHF1ZXN0aW9uXG4gICAqICAgYGZpZWxkRGlyZWN0aXZlc2AtIGFuIGFycmF5IG9mIGRpcmVjdGl2ZXMgYXBwbGllZCB0byB0aGUgZmllbGQgb3IgYW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgZW1wdHkgYXJyYXkgc2hvdWxkIHRoZXJlIGJlIG5vIGFwcGxpZWQgZGlyZWN0aXZlc1xuICAgKiAgIGBzY2hlbWFgICAgICAgICAgLSBhbiBpbnN0YW5jZSBvZiBgR3JhcGhRTFNjaGVtYWAgb3ZlciB3aGljaCB0byBpdGVyYXRlXG4gICAqICAgYGNvbnRleHRgICAgICAgICAtIHVzdWFsbHkgYW4gb2JqZWN0LCBhbmQgdXN1YWxseSB0aGUgc2FtZSBvYmplY3QsIHBhc3NlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICB0byB0aGUgY2FsbCB0byBgbWFrZUV4ZWN1dGFibGVTY2hlbWEoKWAgb3IgYGdyYXBocWwoKWBcbiAgICpcbiAgICogVHlwZXMsIG9yIEJpdG1hc2tlZFR5cGUgdmFsdWVzLCBhcmUgZGVmaW5lZCBhcyB0aGUgZm9sbG93aW5nIGJpdG1hc2tcbiAgICogY29uc3RhbnQgdmFsdWVzLiBUaGV5IGhlbHAgdGhlIGZ1bmN0aW9uIHVuZGVyc3RhbmQgd2hpY2ggR3JhcGhRTCBzdWJ0eXBlXG4gICAqIHNob3VsZCBiZSBpdGVyYXRlZCBvdmVyLiBJdCBkZWZhdWx0cyB0byBBTEwuXG4gICAqXG4gICAqIGNvbnN0IEFMTCA9IDFcbiAgICogY29uc3QgVFlQRVMgPSAyXG4gICAqIGNvbnN0IElOVEVSRkFDRVMgPSA0XG4gICAqIGNvbnN0IEVOVU1TID0gOFxuICAgKiBjb25zdCBVTklPTlMgPSAxNlxuICAgKiBjb25zdCBTQ0FMQVJTID0gMzJcbiAgICogY29uc3QgUk9PVF9UWVBFUyA9IDY0XG4gICAqIGNvbnN0IElOUFVUX1RZUEVTID0gMTI4XG4gICAqIGNvbnN0IEhJRERFTiA9IDI1NlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hGaWVsZFJlc29sdmVyfSBmbiBhIGZ1bmN0aW9uIHdpdGggYSBzaWduYXR1cmUgZGVmaW5lZCBhYm92ZVxuICAgKiBAcGFyYW0ge3Vua25vd259IGNvbnRleHQgdXN1YWxseSBhbiBvYmplY3QgYnV0IGFueSBtaXhlZCB2YWx1ZSB0aGUgZGVub3Rlc1xuICAgKiBzb21lIHNoYXJlZCBjb250ZXh0IGFzIGlzIHVzZWQgd2l0aCB0aGUgc2NoZW1hIGR1cmluZyBub3JtYWwgcnVudGltZS5cbiAgICogQHBhcmFtIHtCaXRtYXNrZWRUeXBlP30gdHlwZXMgb25lIG9mIHRoZSBCaXRtYXNrZWRUeXBlIHZhbHVlcy4gU2VlIGFib3ZlLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTREwsIGl0ZXJhdGVkXG4gICAqIG92ZXIgYW5kIHJldHVybmVkLlxuICAgKi9cbiAgZm9yRWFjaEZpZWxkKGZuLCBjb250ZXh0LCB0eXBlcyA9IEFMTCwgc3VwcGxpZWRTY2hlbWEgPSBudWxsKTogR3JhcGhRTFNjaGVtYSB7XG4gICAgbGV0IHNjaGVtYSA9IHN1cHBsaWVkU2NoZW1hIHx8IHRoaXMuc2NoZW1hXG5cbiAgICBmb3JFYWNoRmllbGQoc2NoZW1hLCBmbiwgY29udGV4dCwgdHlwZXMpXG5cbiAgICByZXR1cm4gc2NoZW1hXG4gIH1cblxuICAvKipcbiAgICogYGZvckVhY2hGaWVsZCgpYCBzaG9ydGN1dCBmb2N1c2luZyBvbiBHcmFwaFFMT2JqZWN0VHlwZXMgc3BlY2lmaWNhbGx5LlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hGaWVsZFJlc29sdmVyfSBmbiBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBmb3JcbiAgICogZWFjaCBmaWVsZCBvZiBhbnkgR3JhcGhRTE9iamVjdFR5cGUgZm91bmRcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYT99IHN1cHBsaWVkU2NoZW1hIGFuIG9wdGlvbmFsIHNjaGVtYSB0byB1c2UgcmF0aGVyXG4gICAqIHRoYW4gdGhlIG9uZSBjcmVhdGVkIG9yIHN0b3JlZCBpbnRlcm5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGVpdGhlciB0aGUgc3VwcGxpZWQgR3JhcGhRTFNjaGVtYSBvciBvbmUgZ2VuZXJhdGVkXG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHRhc2tcbiAgICovXG4gIGZvckVhY2hUeXBlRmllbGQoZm4sIGNvbnRleHQsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCkge1xuICAgIGxldCBzY2hlbWEgPSBzdXBwbGllZFNjaGVtYSB8fCB0aGlzLnNjaGVtYVxuXG4gICAgZm9yRWFjaEZpZWxkKHNjaGVtYSwgZm4sIGNvbnRleHQsIFRZUEVTKVxuXG4gICAgcmV0dXJuIHNjaGVtYVxuICB9XG5cbiAgLyoqXG4gICAqIGBmb3JFYWNoRmllbGQoKWAgc2hvcnRjdXQgZm9jdXNpbmcgb24gR3JhcGhRTEludGVyZmFjZVR5cGUgc3BlY2lmaWNhbGx5LlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hGaWVsZFJlc29sdmVyfSBmbiBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBmb3JcbiAgICogZWFjaCBmaWVsZCBvZiBhbnkgR3JhcGhRTE9iamVjdFR5cGUgZm91bmRcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYT99IHN1cHBsaWVkU2NoZW1hIGFuIG9wdGlvbmFsIHNjaGVtYSB0byB1c2UgcmF0aGVyXG4gICAqIHRoYW4gdGhlIG9uZSBjcmVhdGVkIG9yIHN0b3JlZCBpbnRlcm5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGVpdGhlciB0aGUgc3VwcGxpZWQgR3JhcGhRTFNjaGVtYSBvciBvbmUgZ2VuZXJhdGVkXG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHRhc2tcbiAgICovXG4gIGZvckVhY2hJbnRlcmZhY2VGaWVsZChmbiwgY29udGV4dCwgc3VwcGxpZWRTY2hlbWEgPSBudWxsKSB7XG4gICAgbGV0IHNjaGVtYSA9IHN1cHBsaWVkU2NoZW1hIHx8IHRoaXMuc2NoZW1hXG5cbiAgICBmb3JFYWNoRmllbGQoc2NoZW1hLCBmbiwgY29udGV4dCwgSU5URVJGQUNFUylcblxuICAgIHJldHVybiBzY2hlbWFcbiAgfVxuXG4gIC8qKlxuICAgKiBgZm9yRWFjaEZpZWxkKClgIHNob3J0Y3V0IGZvY3VzaW5nIG9uIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgc3BlY2lmaWNhbGx5LlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hGaWVsZFJlc29sdmVyfSBmbiBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBmb3JcbiAgICogZWFjaCBmaWVsZCBvZiBhbnkgR3JhcGhRTE9iamVjdFR5cGUgZm91bmRcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYT99IHN1cHBsaWVkU2NoZW1hIGFuIG9wdGlvbmFsIHNjaGVtYSB0byB1c2UgcmF0aGVyXG4gICAqIHRoYW4gdGhlIG9uZSBjcmVhdGVkIG9yIHN0b3JlZCBpbnRlcm5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGVpdGhlciB0aGUgc3VwcGxpZWQgR3JhcGhRTFNjaGVtYSBvciBvbmUgZ2VuZXJhdGVkXG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHRhc2tcbiAgICovXG4gIGZvckVhY2hJbnB1dE9iamVjdEZpZWxkKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICBsZXQgc2NoZW1hID0gc3VwcGxpZWRTY2hlbWEgfHwgdGhpcy5zY2hlbWFcblxuICAgIGZvckVhY2hGaWVsZChzY2hlbWEsIGZuLCBjb250ZXh0LCBJTlBVVF9UWVBFUylcblxuICAgIHJldHVybiBzY2hlbWFcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciBgcmVxdWlyZSgnZ3JhcGhxbCcpLmdyYXBocWxTeW5jKClgIHRoYXQgYXV0b21hdGljYWxseSBwYXNzZXNcbiAgICogaW4gdGhlIGludGVybmFsIGAuc2NoZW1hYCByZWZlcmVuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlci5cbiAgICogQHRlbXBsYXRlIFRTb3VyY2UgdGhlIHZhbHVlIGJlaW5nIHJlc29sdmVkLiBUaGlzIGlzIHRoZSBvYmplY3QgdGhhdCBuZWVkc1xuICAgKiB0byBiZSB0eXBlZC5cbiAgICogQHRlbXBsYXRlIFRBcmdzIHRoZSB0eXBlIG9mIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBmaWVsZCBpbiB0aGVcbiAgICogR3JhcGhRTCBxdWVyeS5cbiAgICogQHRlbXBsYXRlIFRDb250ZXh0IHRoZSBjb250ZXh0IG9iamVjdCBwYXNzZWQgdG8gdGhlIHJlc29sdmVyLiBUaGlzIGNhblxuICAgKiBjb250YWluIHVzZWZ1bCBkYXRhIGxpa2UgdGhlIGN1cnJlbnQgdXNlciBvciBkYXRhYmFzZSBjb25uZWN0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ3xTb3VyY2V9IHF1ZXJ5IEEgR3JhcGhRTCBsYW5ndWFnZSBmb3JtYXR0ZWQgc3RyaW5nXG4gICAqIHJlcHJlc2VudGluZyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvbi5cbiAgICogQHBhcmFtIHt1bmtub3duP30gY29udGV4dFZhbHVlIGEgYml0IG9mIHNoYXJlZCBjb250ZXh0IHRvIHBhc3MgdG8gcmVzb2x2ZXJzXG4gICAqIEBwYXJhbSB7T2JqTWFwP30gdmFyaWFibGVWYWx1ZXMgQSBtYXBwaW5nIG9mIHZhcmlhYmxlIG5hbWUgdG8gcnVudGltZSB2YWx1ZVxuICAgKiB0byB1c2UgZm9yIGFsbCB2YXJpYWJsZXMgZGVmaW5lZCBpbiB0aGUgcmVxdWVzdFN0cmluZy5cbiAgICogQHBhcmFtIHtSZXNvbHZlck1hcD99IHJvb3RWYWx1ZSBwcm92aWRlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG9cbiAgICogcmVzb2x2ZXIgZnVuY3Rpb25zIG9uIHRoZSB0b3AgbGV2ZWwgdHlwZSAoZS5nLiB0aGUgcXVlcnkgb2JqZWN0IHR5cGUpLlxuICAgKiBAcGFyYW0ge3N0cmluZz99IG9wZXJhdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIG9wZXJhdGlvbiB0byB1c2UgaWZcbiAgICogcmVxdWVzdFN0cmluZyBjb250YWlucyBtdWx0aXBsZSBwb3NzaWJsZSBvcGVyYXRpb25zLiBDYW4gYmUgb21pdHRlZCBpZlxuICAgKiByZXF1ZXN0U3RyaW5nIGNvbnRhaW5zIG9ubHkgb25lIG9wZXJhdGlvbi5cbiAgICogQHBhcmFtIHtHcmFwaFFMRmllbGRSZXNvbHZlcjxUU291cmNlLCBUQXJncywgVENvbnRleHQ+P30gZmllbGRSZXNvbHZlciBBXG4gICAqIHJlc29sdmVyIGZ1bmN0aW9uIHRvIHVzZSB3aGVuIG9uZSBpcyBub3QgcHJvdmlkZWQgYnkgdGhlIHNjaGVtYS4gSWYgbm90XG4gICAqIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBmaWVsZCByZXNvbHZlciBpcyB1c2VkICh3aGljaCBsb29rcyBmb3IgYSB2YWx1ZSBvclxuICAgKiBtZXRob2Qgb24gdGhlIHNvdXJjZSB2YWx1ZSB3aXRoIHRoZSBmaWVsZCdzIG5hbWUpLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxUeXBlUmVzb2x2ZXI8VFNvdXJjZSxUQ29udGV4dD4/fSB0eXBlUmVzb2x2ZXIgQSByZXNvbHZlciBpc1xuICAgKiBhIGZ1bmN0aW9uIHR5cGUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGNvbmNyZXRlIHR5cGUgb2YgYW4gb2JqZWN0IHdoZW5cbiAgICogcmVzb2x2aW5nIGFuIGludGVyZmFjZSBvciB1bmlvbiB0eXBlLlxuICAgKiBAcmV0dXJuIHtFeGVjdXRpb25SZXN1bHR9IHRoZSByZXF1ZXN0ZWQgcmVzdWx0cy4gQW4gZXJyb3IgaXMgdGhyb3duIGlmXG4gICAqIHRoZSByZXN1bHRzIGNvdWxkIG5vdCBiZSBmdWxmaWxsZWQgb3IgaW52YWxpZCBpbnB1dC9vdXRwdXQgd2FzIHNwZWNpZmllZC5cbiAgICovXG4gIHJ1bihcbiAgICBxdWVyeSxcbiAgICBjb250ZXh0VmFsdWUsXG4gICAgdmFyaWFibGVWYWx1ZXMsXG4gICAgcm9vdFZhbHVlLFxuICAgIG9wZXJhdGlvbk5hbWUsXG4gICAgZmllbGRSZXNvbHZlcixcbiAgICB0eXBlUmVzb2x2ZXIsXG4gICkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmdxbC5ncmFwaHFsU3luYyh7XG4gICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hLFxuICAgICAgc291cmNlOiBxdWVyeSxcbiAgICAgIHJvb3RWYWx1ZTogdGhpcy5yZXNvbHZlcnMgfHwgcm9vdFZhbHVlLFxuICAgICAgY29udGV4dFZhbHVlLFxuICAgICAgdmFyaWFibGVWYWx1ZXMsXG4gICAgICBvcGVyYXRpb25OYW1lLFxuICAgICAgZmllbGRSZXNvbHZlcixcbiAgICAgIHR5cGVSZXNvbHZlclxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3IgYHJlcXVpcmUoJ2dyYXBocWwnKS5ncmFwaHFsKClgIHRoYXQgYXV0b21hdGljYWxseSBwYXNzZXNcbiAgICogaW4gdGhlIGludGVybmFsIGAuc2NoZW1hYCByZWZlcmVuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlci5cbiAgICpcbiAgICogQHRlbXBsYXRlIFRTb3VyY2UgdGhlIHZhbHVlIGJlaW5nIHJlc29sdmVkLiBUaGlzIGlzIHRoZSBvYmplY3QgdGhhdCBuZWVkc1xuICAgKiB0byBiZSB0eXBlZC5cbiAgICogQHRlbXBsYXRlIFRBcmdzIHRoZSB0eXBlIG9mIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBmaWVsZCBpbiB0aGVcbiAgICogR3JhcGhRTCBxdWVyeS5cbiAgICogQHRlbXBsYXRlIFRDb250ZXh0IHRoZSBjb250ZXh0IG9iamVjdCBwYXNzZWQgdG8gdGhlIHJlc29sdmVyLiBUaGlzIGNhblxuICAgKiBjb250YWluIHVzZWZ1bCBkYXRhIGxpa2UgdGhlIGN1cnJlbnQgdXNlciBvciBkYXRhYmFzZSBjb25uZWN0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ3xTb3VyY2V9IHF1ZXJ5IEEgR3JhcGhRTCBsYW5ndWFnZSBmb3JtYXR0ZWQgc3RyaW5nXG4gICAqIHJlcHJlc2VudGluZyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvbi5cbiAgICogQHBhcmFtIHt1bmtub3duP30gY29udGV4dFZhbHVlIGEgYml0IG9mIHNoYXJlZCBjb250ZXh0IHRvIHBhc3MgdG8gcmVzb2x2ZXJzXG4gICAqIEBwYXJhbSB7T2JqZWN0P30gdmFyaWFibGVWYWx1ZXMgQSBtYXBwaW5nIG9mIHZhcmlhYmxlIG5hbWUgdG8gcnVudGltZSB2YWx1ZVxuICAgKiB0byB1c2UgZm9yIGFsbCB2YXJpYWJsZXMgZGVmaW5lZCBpbiB0aGUgcmVxdWVzdFN0cmluZy5cbiAgICogQHBhcmFtIHtSZXNvbHZlck1hcD99IFRoZSB2YWx1ZSBwcm92aWRlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG9cbiAgICogcmVzb2x2ZXIgZnVuY3Rpb25zIG9uIHRoZSB0b3AgbGV2ZWwgdHlwZSAoZS5nLiB0aGUgcXVlcnkgb2JqZWN0IHR5cGUpLlxuICAgKiBAcGFyYW0ge3N0cmluZz99IG9wZXJhdGlvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIG9wZXJhdGlvbiB0byB1c2UgaWZcbiAgICogcmVxdWVzdFN0cmluZyBjb250YWlucyBtdWx0aXBsZSBwb3NzaWJsZSBvcGVyYXRpb25zLiBDYW4gYmUgb21pdHRlZCBpZlxuICAgKiByZXF1ZXN0U3RyaW5nIGNvbnRhaW5zIG9ubHkgb25lIG9wZXJhdGlvbi5cbiAgICogQHBhcmFtIHtHcmFwaFFMRmllbGRSZXNvbHZlcjxUU291cmNlLCBUQXJncywgVENvbnRleHQ+P30gZmllbGRSZXNvbHZlciBBXG4gICAqIHJlc29sdmVyIGZ1bmN0aW9uIHRvIHVzZSB3aGVuIG9uZSBpcyBub3QgcHJvdmlkZWQgYnkgdGhlIHNjaGVtYS4gSWYgbm90XG4gICAqIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBmaWVsZCByZXNvbHZlciBpcyB1c2VkICh3aGljaCBsb29rcyBmb3IgYSB2YWx1ZSBvclxuICAgKiBtZXRob2Qgb24gdGhlIHNvdXJjZSB2YWx1ZSB3aXRoIHRoZSBmaWVsZCdzIG5hbWUpLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxUeXBlUmVzb2x2ZXI8VFNvdXJjZSxUQ29udGV4dD4/fSB0eXBlUmVzb2x2ZXIgQSByZXNvbHZlciBpc1xuICAgKiBhIGZ1bmN0aW9uIHR5cGUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGNvbmNyZXRlIHR5cGUgb2YgYW4gb2JqZWN0IHdoZW5cbiAgICogcmVzb2x2aW5nIGFuIGludGVyZmFjZSBvciB1bmlvbiB0eXBlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPEV4ZWN1dGlvblJlc3VsdD59IGEgUHJvbWlzZSBjb250aWFuaW5nIHRoZSByZXF1ZXN0ZWRcbiAgICogcmVzdWx0c1xuICAgKi9cbiAgYXN5bmMgcnVuQXN5bmMoXG4gICAgcXVlcnksXG4gICAgY29udGV4dFZhbHVlLFxuICAgIHZhcmlhYmxlVmFsdWVzLFxuICAgIHJvb3RWYWx1ZSxcbiAgICBvcGVyYXRpb25OYW1lLFxuICAgIGZpZWxkUmVzb2x2ZXIsXG4gICAgdHlwZVJlc29sdmVyLFxuICApIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5ncWwuZ3JhcGhxbCh7XG4gICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hLFxuICAgICAgc291cmNlOiBxdWVyeSxcbiAgICAgIHJvb3RWYWx1ZTogdGhpcy5yZXNvbHZlcnMgfHwgcm9vdFZhbHVlLFxuICAgICAgY29udGV4dFZhbHVlLFxuICAgICAgdmFyaWFibGVWYWx1ZXMsXG4gICAgICBvcGVyYXRpb25OYW1lLFxuICAgICAgZmllbGRSZXNvbHZlcixcbiAgICAgIHR5cGVSZXNvbHZlclxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQSBsaXR0bGUgd3JhcHBlciB1c2VkIHRvIGNhdGNoIGFueSBlcnJvcnMgdGhyb3duIHdoZW4gYnVpbGRpbmcgYSBzY2hlbWFcbiAgICogZnJvbSB0aGUgc3RyaW5nIFNETCByZXByZXNlbnRhdGlvbiBvZiBhIGdpdmVuIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge1NjaGVtYVNvdXJjZX0gc2RsIGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhLCBhIHN0cmluZyBvZiBTREwsIGFcbiAgICogU291cmNlIGluc3RhbmNlIG9mIFNETCwgYSBHcmFwaFFMU2NoZW1hIG9yIEFTVE5vZGUgdGhhdCBjYW4gYmUgcHJpbnRlZCBhc1xuICAgKiBhbiBTREwgc3RyaW5nXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Nob3dFcnJvcj1mYWxzZV0gdHJ1ZSBpZiB0aGUgZXJyb3Igc2hvdWxkIGJlIHRocm93bixcbiAgICogZmFsc2UgaWYgdGhlIGVycm9yIHNob3VsZCBiZSBzaWxlbnRseSBzdXBwcmVzc2VkXG4gICAqIEBwYXJhbSB7QnVpbGRTY2hlbWFPcHRpb25zJlBhcnNlT3B0aW9uc30gW3NjaGVtYU9wdHM9dW5kZWZpbmVkXSBmb3JcbiAgICogYWR2YW5jZWQgdXNlcnMsIHBhc3NpbmcgdGhyb3VnaCBhZGRpdGlvbmFsIGJ1aWxkU2NoZW1hKCkgb3B0aW9ucyBjYW4gYmVcbiAgICogZG9uZSBoZXJlXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IG51bGwgaWYgYW4gZXJyb3Igb2NjdXJzIGFuZCBlcnJvcnMgYXJlIG5vdFxuICAgKiBzdXJmYWNlZCBvciBhIHZhbGlkIEdyYXBoUUxTY2hlbWEgb2JqZWN0IG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGJ1aWxkU2NoZW1hKHNkbCwgc2hvd0Vycm9yID0gZmFsc2UsIHNjaGVtYU9wdHMgPSB1bmRlZmluZWQpIHtcbiAgICB0cnkge1xuICAgICAgZGVidWdfbG9nKCdbc3RhdGljIGJ1aWxkU2NoZW1hKCldIG5vcm1hbGl6aW5nIHNvdXJjZScpXG4gICAgICBsZXQgc291cmNlID0gbm9ybWFsaXplU291cmNlKHNkbClcblxuICAgICAgZGVidWdfbG9nKCdbc3RhdGljIGJ1aWxkU2NoZW1hKCldIGJ1aWxkaW5nIHNjaGVtYScpXG4gICAgICByZXR1cm4gdGhpcy5ncWwuYnVpbGRTY2hlbWEoc291cmNlLCBzY2hlbWFPcHRzKVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgZGVidWdfbG9nKCdbc3RhdGljIGJ1aWxkU2NoZW1hKCldIGZhaWxlZCB0byBidWlsZCEnKVxuICAgICAgZGVidWdfdHJhY2UoJ1tzdGF0aWMgYnVpbGRTY2hlbWEoKV0gJywgZSlcbiAgICAgIGlmIChzaG93RXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBsaXR0bGUgd3JhcHBlciB1c2VkIHRvIGNhdGNoIGFueSBlcnJvcnMgdGhyb3duIHdoZW4gcGFyc2luZyBTY2hlbWF0YSBmb3JcbiAgICogQVNUTm9kZXMuIElmIHNob3dFcnJvciBpcyB0cnVlLCBhbnkgY2F1Z2h0IGVycm9ycyBhcmUgdGhyb3duIG9uY2UgYWdhaW4uXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hU291cmNlfSBzZGwgYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGEsIGEgc3RyaW5nIG9mIFNETCwgYVxuICAgKiBTb3VyY2UgaW5zdGFuY2Ugb2YgU0RMLCBhIEdyYXBoUUxTY2hlbWEgb3IgQVNUTm9kZSB0aGF0IGNhbiBiZSBwcmludGVkIGFzXG4gICAqIGFuIFNETCBzdHJpbmdcbiAgICogQHBhcmFtIHtib29sZWFufSBbc2hvd0Vycm9yPWZhbHNlXSBpZiB0cnVlLCBhbnkgY2F1Z2h0IGVycm9ycyB3aWxsIGJlIHRocm93biBvbmNlXG4gICAqIGFnYWluXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2VuaGFuY2U9dHJ1ZV0gYSBnZW5lcmF0b3Iga2V5ZWQgd2l0aCBgU3ltYm9sLml0ZXJhdG9yYCBpcyBzZXRcbiAgICogb24gdGhlIHJlc3VsdGluZyBhc3ROb2RlIG9iamVjdCBhbGxvd2luZyB0aGUgcmVzdWx0aW5nIGAuYXN0YCB2YWx1ZSB0b1xuICAgKiBiZSBpdGVyYWJsZS4gVGhlIGNvZGUgaXRlcmF0ZXMgb3ZlciBlYWNoIGRlZmluaXRpb24gb2YgdGhlIHJlc3VsdGluZ1xuICAgKiBEb2N1bWVudE5vZGUuIFRoaXMgYmVoYXZpb3IgZGVmYXVsdHMgdG8gdHJ1ZSBhbmQgc2hvdWxkIG5vdCBoYXZlIGFueSBpbGxcbiAgICogZWZmZWN0cyBvbiBjb2RlIGV4cGVjdGluZyB2YW5pbGxhIEFTVE5vZGUgb2JqZWN0c1xuICAgKiBAcmV0dXJuIHtBU1ROb2RlfSBudWxsIGlmIGFuIGVycm9yIG9jY3VycyBhbmQgZXJyb3JzIGFyZSBzdXBwcmVzc2VkLFxuICAgKiBhIHRvcCBsZXZlbCBEb2N1bWVudCBBU1ROb2RlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIHBhcnNlKHNkbCwgc2hvd0Vycm9yID0gZmFsc2UsIGVuaGFuY2UgPSB0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBwYXJzZSgpXSBub3JtYWxpemluZyBzb3VyY2UnKVxuICAgICAgbGV0IHNvdXJjZSA9IG5vcm1hbGl6ZVNvdXJjZShzZGwpXG5cbiAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBwYXJzZSgpXSBwYXJzaW5nJylcbiAgICAgIGxldCBub2RlID0gdGhpcy5ncWwucGFyc2Uoc291cmNlKVxuXG4gICAgICBpZiAoZW5oYW5jZSkge1xuICAgICAgICBkZWJ1Z19sb2coJ1tzdGF0aWMgcGFyc2UoKV0gZW5oYW5jaW5nJylcbiAgICAgICAgbm9kZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24qKCkge1xuICAgICAgICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgeWllbGQgbm9kZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgZGVidWdfbG9nKCdbc3RhdGljIHBhcnNlKCldIGZhaWxlZCB0byBwYXJzZScpXG4gICAgICBkZWJ1Z190cmFjZSgnW3N0YXRpYyBwYXJzZSgpXSAnLCBlKVxuICAgICAgaWYgKHNob3dFcnJvcikge1xuICAgICAgICB0aHJvdyBlXG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIGxpdHRsZSB3cmFwcGVyIHVzZWQgdG8gY2F0Y2ggYW55IGVycm9ycyB0aHJvd24gd2hlbiBwcmludGluZyBhbiBBU1ROb2RlXG4gICAqIHRvIHN0cmluZyBmb3JtIHVzaW5nIGByZXF1aXJlKCdncmFwaHFsJykucHJpbnQoKWAuIElmIGBzaG93RXJyb3JgIGlzIHRydWVcbiAgICogYW55IHRocm93biBlcnJvcnMgd2lsbCBiZSByZXRocm93biwgb3RoZXJ3aXNlIG51bGwgaXMgcmV0dXJuZWQgaW5zdGVhZC5cbiAgICpcbiAgICogU2hvdWxkIGFsbCBnbyBhcyBwbGFubmVkLCBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSB3cmFwcGVkIHdpdGggdGhlIHByaW50ZWRcbiAgICogU0RMIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjdcbiAgICpcbiAgICogQHBhcmFtIHtBU1ROb2RlfEdyYXBoUUxTY2hlbWF9IGFzdCBhbiBBU1ROb2RlLCB1c3VhbGx5IGFcbiAgICogRG9jdW1lbnROb2RlIGdlbmVyYXRlZCB3aXRoIHNvbWUgdmVyc2lvbiBvZiBgcmVxdWlyZSgnZ3JhcGhxbCcpLnBhcnNlKClgLlxuICAgKiBJZiBhbiBpbnN0YW5jZSBvZiBHcmFwaFFMU2NoZW1hIGlzIHN1cHBsaWVkLCBgcHJpbnRTY2hlbWEoKWAgaXMgdXNlZFxuICAgKiBpbnN0ZWFkIG9mIGBwcmludCgpYFxuICAgKiBAcGFyYW0ge2Jvb2xlYW4/fSBbc2hvd0Vycm9yPWZhbHNlXSBpZiB0cnVlLCBhbnkgY2F1Z2h0IGVycm9ycyB3aWxsIGJlXG4gICAqIHRocm93biBvbmNlIGFnYWluXG4gICAqIEByZXR1cm4ge1NjaGVtYXRhfSBudWxsIGlmIGFuIGVycm9yIG9jY3VycyAoYW5kIHNob3dFcnJvciBpcyBmYWxzZSlcbiAgICogb3IgYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGEgd3JhcHBpbmcgdGhlIHJlc3VsdGluZyBTREwgc3RyaW5nIGZyb20gdGhlXG4gICAqIHByaW50IG9wZXJhdGlvblxuICAgKi9cbiAgc3RhdGljIHByaW50KGFzdCwgc2hvd0Vycm9yID0gZmFsc2UpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IHNvdXJjZVxuXG4gICAgICBpZiAoYXN0IGluc3RhbmNlb2YgR3JhcGhRTFNjaGVtYSkge1xuICAgICAgICBkZWJ1Z19sb2coJ1tzdGF0aWMgcHJpbnQoKV0gcHJpbnRpbmcgc2NoZW1hJylcbiAgICAgICAgc291cmNlID0gdGhpcy5ncWwucHJpbnRTY2hlbWEoYXN0KVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBwcmludCgpXSBwcmludGluZyBBU1ROb2RlJylcbiAgICAgICAgc291cmNlID0gdGhpcy5ncWwucHJpbnQoYXN0KVxuICAgICAgfVxuXG4gICAgICBkZWJ1Z19sb2coJ1tzdGF0aWMgcHJpbnQoKV0gY3JlYXRpbmcgbmV3IFNjaGVtYXRhIGZyb20gcHJpbnQnKVxuICAgICAgcmV0dXJuIFNjaGVtYXRhLmZyb20oc291cmNlKVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgZGVidWdfbG9nKCdbc3RhdGljIHByaW50KCldIGZhaWxlZCB0byBwcmludCcpXG4gICAgICBkZWJ1Z190cmFjZSgnW3N0YXRpYyBwcmludCgpXSAnLCBlKVxuICAgICAgaWYgKHNob3dFcnJvcikge1xuICAgICAgICB0aHJvdyBlXG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNpbXBsZSBwYXNzIHRocnUgdXNlZCB3aXRoaW4gdGhlIGNsYXNzIHRvIHJlZmVyZW5jZSBncmFwaHFsIG1ldGhvZHNcbiAgICogYW5kIGNsYXNzZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gdGhlIHJlc3VsdHMgb2YgYHJlcXVpcmUoJ2dyYXBocWwnKWBcbiAgICovXG4gIHN0YXRpYyBnZXQgZ3FsKCkge1xuICAgIHJldHVybiByZXF1aXJlKCdncmFwaHFsJylcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgd2F5IG9mIGludm9raW5nIGBuZXcgU2NoZW1hdGEoKWBcbiAgICpcbiAgICogQHBhcmFtIHtTY2hlbWFTb3VyY2V9IHR5cGVEZWZzIGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhLCBhIHN0cmluZyBvZiBTREwsXG4gICAqIGEgU291cmNlIGluc3RhbmNlIG9mIFNETCwgYSBHcmFwaFFMU2NoZW1hIG9yIEFTVE5vZGUgdGhhdCBjYW4gYmUgcHJpbnRlZFxuICAgKiBhcyBhbiBTREwgc3RyaW5nXG4gICAqIEBwYXJhbSB7UmVzb2x2ZXJNYXB9IFtyZXNvbHZlcnM9bnVsbF0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgZmllbGQgcmVzb2x2ZXJzXG4gICAqIGZvciBmb3IgdGhlIHNjaGVtYSByZXByZXNlbnRlZCB3aXRoIHRoaXMgc3RyaW5nLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW58c3RyaW5nfSBbYnVpbGRSZXNvbHZlcnM9ZmFsc2VdIGlmIHRoaXMgZmxhZyBpcyBzZXQgdG9cbiAgICogdHJ1ZSwgYnVpbGQgYSBzZXQgb2YgcmVzb2x2ZXJzIGFmdGVyIHRoZSByZXN0IG9mIHRoZSBpbnN0YW5jZSBpc1xuICAgKiBpbml0aWFsaXplZCBhbmQgc2V0IHRoZSByZXN1bHRzIG9uIHRoZSBgLnJlc29sdmVyc2AgcHJvcGVydHkgb2YgdGhlIG5ld2x5XG4gICAqIGNyZWF0ZWQgaW5zdGFuY2UuIElmIGJ1aWxkUmVzb2x2ZXJzIGlzIHRoZSBzdHJpbmcgXCJhbGxcIiwgdGhlbiBhIHJlc29sdmVyXG4gICAqIGZvciBlYWNoIGZpZWxkIG5vdCBkZWZpbmVkIHdpbGwgYmUgcmV0dXJuZWQgd2l0aCBhIGBkZWZhdWx0RmllbGRSZXNvbHZlcmBcbiAgICogYXMgaXRzIHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZsYXR0ZW5SZXNvbHZlcnM9ZmFsc2VdIGlmIHRydWUsIGFuZCBpZiBgYnVpbGRSZXNvbHZlcnNgXG4gICAqIGlzIHRydWUsIHRoZW4gbWFrZSBhbiBhdHRlbXB0IHRvIGZsYXR0ZW4gdGhlIHJvb3QgdHlwZXMgdG8gdGhlIGJhc2Ugb2YgdGhlXG4gICAqIHJlc29sdmVyIG1hcCBvYmplY3QuXG4gICAqIEByZXR1cm4ge1NjaGVtYXRhfSBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YVxuICAgKi9cbiAgc3RhdGljIGZyb20oXG4gICAgdHlwZURlZnMsXG4gICAgcmVzb2x2ZXJzID0gbnVsbCxcbiAgICBidWlsZFJlc29sdmVycyA9IGZhbHNlLFxuICAgIGZsYXR0ZW5SZXNvbHZlcnMgPSBmYWxzZVxuICApIHtcbiAgICByZXR1cm4gbmV3IHRoaXModHlwZURlZnMsIHJlc29sdmVycywgYnVpbGRSZXNvbHZlcnMsIGZsYXR0ZW5SZXNvbHZlcnMpXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRoYW5kIHdheSBvZiBpbnZva2luZyBgbmV3IFNjaGVtYXRhKClgIGFmdGVyIHRoZSBmdW5jdGlvbiByZWFkcyB0aGVcbiAgICogY29udGVudHMgb2YgdGhlIGZpbGUgc3BlY2lmaWVkIGF0IHRoZSBzdXBwbGllZCBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBwYXRoIHRvIHRoZSBmaWxlIHRvIHJlYWQgdGhlIGNvbnRlbnRzIG9mXG4gICAqIEByZXR1cm4ge1NjaGVtYXRhfSBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YVxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGZyb21Db250ZW50c09mKHBhdGgpIHtcbiAgICBjb25zdCByZXNvbHZlZCA9IHBhdGhSZXNvbHZlKHBhdGgpXG4gICAgY29uc3QgY29udGVudHMgPSAoYXdhaXQgcmVhZEZpbGUocmVzb2x2ZWQpKT8udG9TdHJpbmcoKVxuXG4gICAgcmV0dXJuIFNjaGVtYXRhLmZyb20oY29udGVudHMpXG4gIH1cblxuICAvKipcbiAgICogV2Fsa3MgYSBnaXZlbiBkaXJlY3RvcnkgYW5kIGl0cyBzdWJkaXJlY3RvcmllcyB0byBmaW5kIGFueSBmaWxlcyB3aXRoIHRoZVxuICAgKiBgLmdyYXBocWwvLnNkbC8udHlwZVtkRF1lZmAgZXh0ZW5zaW9uIHdlcmUgZm91bmQuIElmIGFuIGFkamFjZW50LCBvclxuICAgKiBvdGhlcndpc2Ugc3BlY2lmaWVkLCBmaWxlIHdpdGggYSBgLmpzLy5janMvLm1qc2AgZXh0ZW5zaW9uIGlzIGZvdW5kLFxuICAgKiBhbmQgc3VjY2Vzc2Z1bGx5IHJlYWQsIHRoZW4gaXRzIHJlc29sdmVycyBhcmUgYWRkZWQgdG8gdGhlIGZpbmFsIFNjaGVtYXRhXG4gICAqIG91dHB1dC4gQSBzY2hlbWEgd2l0aCBhbnkgYXNzb2NpYXRlZCBhY3Rpb25hYmxlIHJlc29sdmVyIGlzIHJldHVybmVkIGFzXG4gICAqIGFuZCBleGVjdXRhYmxlIHNjaGVtYS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggYSBmaWxlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB3aGVyZSBzY2FubmluZyBzaG91bGRcbiAgICogc3RhcnQgdG8gb2NjdXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz11bmRlZmluZWRdIGFuIG9iamVjdCB0aGF0IGFsbG93cyB0aGUgZGV2ZWxvcGVyXG4gICAqIHRvIGNvbmZpZ3VyZSBob3cgY29uZmxpY3RzIGFyZSByZXNvbHZlZCAocmF0aGVyIHRoYW4ganVzdCB0YWtpbmcgdGhlXG4gICAqIGxhdGVzdCB2YWx1ZSBhcyBhbiBvdmVycmlkZSB0byBhbnkgcHJldmlvdXNseSBleGlzdGluZyByZXNvbHZlcikgYXMgd2VsbFxuICAgKiBhcyBhIHdheSB0byBzcGVjaWZ5IHdoZXJlIHJlc29sdmVyIGZpbGVzIG9mIHRoZSBzYW1lIG5hbWUgYXMgdGhlXG4gICAqIC5ncmFwaHFsLy5zZGwvLnR5cGVEZWYgZmlsZSBzaG91bGQgZXhpc3Q7IGlmIG5vdCBhbG9uZ3NpZGUgdGhlIFNETCBmaWxlXG4gICAqIGl0c2VsZi5cbiAgICogQHBhcmFtIHtcbiAgICogICBmdW5jdGlvbihcbiAgICogICAgIGV4aXN0aW5nUmVzb2x2ZXI6IFJlc29sdmVyUHJvcGVydHksXG4gICAqICAgICBuZXdSZXNvbHZlcjogUmVzb2x2ZXJQcm9wZXJ0eVxuICAgKiAgICk6IFJlc29sdmVyUHJvcGVydHlcbiAgICogfSBbb3B0aW9ucy5jb25mbGljdFJlc29sdmVyXSAtIEEgZnVuY3Rpb24gdG8gcmVzb2x2ZSBjb25mbGljdHMgYmV0d2VlblxuICAgKiBleGlzdGluZyBhbmQgbmV3IHJlc29sdmVycy5cbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gW29wdGlvbnMuZ3FFeHRzXSAtIEFuIGFycmF5IG9mIGV4dGVuc2lvbnMgd2l0aCBhXG4gICAqIHByZWNlZGluZyBwZXJpb2QsIHRoYXQgd2lsbCBtYXRjaCB0aGUgU0RMIGZpbGVzIGluIHRoZSBzdXBwbGllZCBkaXJlY3RvcnkuXG4gICAqIFRoaXMgZGVmYXVsdHMgdG8gYFsnLmdyYXBocWwnLCAnLmdxbCcsICcuc2RsJywgJy50eXBlZGVmJ11gXG4gICAqIEBwYXJhbSBbc3RyaW5nW11dIFtvcHRpb25zLmpzRXh0c10gLSBBbiBhcnJheSBvZiBleHRlbnNpb25zIHdpdGggYVxuICAgKiBwcmVjZWRpbmcgcGVyaW9kLCB0aGF0IHdpbGwgbWF0Y2ggdGhlIHJlc29sdmVyIEphdmFTY3JpcHQgZmlsZXMuIFRoaXNcbiAgICogZGVmYXVsdHMgdG8gYFsnLmpzJywgJy5janMnLCAnLm1qcyddYFxuICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gW29wdGlvbnMucmVzb2x2ZXJzUm9vdHNdIC0gVGhlIHJvb3QgZGlyZWN0b3J5LCBvclxuICAgKiBkaXJlY3Rvcmllcywgd2hlcmUgcmVzb2x2ZXIgZmlsZXMgc2hvdWxkIGV4aXN0LiBJZiB0aGlzIHZhbHVlIGlzIGZhbHN5LFxuICAgKiB0aGUgZXhwZWN0ZWQgcm9vdCBpcyBpbiB0aGUgc2FtZSBkaXJlY3RvcnkgYXMgdGhlIFNETCBmaWxlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucHJvamVjdFJvb3RdIC0gVGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoZSBwcm9qZWN0LFxuICAgKiByZWxhdGl2ZSB0byB0aGUgbmVhcmVzdCBwYWNrYWdlLmpzb24gaWYgbm8gdmFsdWUgaXMgc3VwcGxpZWQuXG4gICAqIEByZXR1cm5zIHtTY2hlbWF0YT99IGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhLCBvcHRpb25hbGx5IG1hZGUgZXhlY3V0YWJsZVxuICAgKiBpZiBhZGphY2VudCBvciBvdGhlcndpc2Ugc3BlY2lmaWVkIC5qcy8udHMvLmNqcy8ubWpzIGZpbGVzIHdlcmUgbG9jYXRlZFxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGJ1aWxkRnJvbURpcihcbiAgICBwYXRoLFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBjb25mbGljdFJlc29sdmVyKF8sIG5ld1Jlc29sdmVyKSB7IHJldHVybiBuZXdSZXNvbHZlci52YWx1ZSB9LFxuICAgICAgZ3FFeHRzOiBbJy5ncmFwaHFsJywgJy5ncWwnLCAnLnNkbCcsICcudHlwZWRlZiddLFxuICAgICAganNFeHRzOiBbJy5qcycsICcuY2pzJywgJy5tanMnXSxcbiAgICAgIHJlc29sdmVyc1Jvb3RzOiB1bmRlZmluZWQsXG4gICAgICBwcm9qZWN0Um9vdDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICkge1xuICAgIGNvbnN0IHBhcnNlQW5kUmVtb3ZlRXh0ZW5zaW9uID0gKHBhdGgpID0+ICh7XG4gICAgICAvLyBwYXRoLnBhcnNlIG9mIGZ1bGx5IHJlc29sdmVkIHBhdGggc3RyaW5nXG4gICAgICAuLi5wYXRoUGFyc2UocGF0aFJlc29sdmUocGF0aCkpLFxuXG4gICAgICAvLyByZW1vdmUgYW55IGV4aXN0aW5nIGV4dGVuc2lvbiBhbmQgY2xlYXIgYmFzZSBzbyBwYXRoRm9ybWF0IHdvcmtzXG4gICAgICAuLi57IGJhc2U6ICcnLCBleHQ6ICcnIH19XG4gICAgKVxuXG4gICAgY29uc3QgaXNEaXJlY3RvcnkgPSBhc3luYyBwYXRoID0+IGF3YWl0IGFzeW5jVHJ5Q2F0Y2goXG4gICAgICBhc3luYyAoKSA9PiAoYXdhaXQgc3RhdChwYXRoKSkuaXNEaXJlY3RvcnkoKSwgZmFsc2VcbiAgICApXG5cbiAgICBjb25zdCByZVBhdGhEaXIgPSAoKGF3YWl0IGlzRGlyZWN0b3J5KHBhdGhSZXNvbHZlKHBhdGgpKSlcbiAgICAgID8gcGF0aFJlc29sdmUocGF0aClcbiAgICAgIDogcGF0aFJlc29sdmUocGFyc2VBbmRSZW1vdmVFeHRlbnNpb24ocGF0aCkuZGlyKVxuICAgIClcbiAgICBjb25zdCByZVBhdGggPSByZVBhdGhEaXJcbiAgICBjb25zdCBncUV4dHMgPSBvcHRpb25zPy5ncUV4dHMgPz8gWycuZ3JhcGhxbCcsICcuZ3FsJywgJy5zZGwnLCAnLnR5cGVkZWYnXVxuICAgIGNvbnN0IGpzRXh0cyA9IG9wdGlvbnM/LmpzRXh0cyA/PyBbJy5qcycsICcuY2pzJywgJy5tanMnLCAnLnRzJ11cblxuICAgIGNvbnN0IHVuaXF1ZVN0ZW1zID0gW1xuICAgICAgLy8gRW5zdXJlIHVuaXF1ZSBmaWxlIHBhdGhzIChzYW5zIGV4dGVuc2lvbilcbiAgICAgIC4uLm5ldyBTZXQoYXdhaXQgKFxuICAgICAgICBbLi4uYXdhaXQgcmVhZGRpcihyZVBhdGgsIHsgcmVjdXJzaXZlOnRydWUgfSldLnJlZHVjZShcbiAgICAgICAgICBhc3luYyAoYXN5bmNQcmV2aW91cywgY3VycmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXMgPSBhd2FpdCBhc3luY1ByZXZpb3VzO1xuICAgICAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoUmVzb2x2ZShwYXRoSm9pbihyZVBhdGgsIGN1cnJlbnQpKTtcbiAgICAgICAgICAgIGNvbnN0IGlzRGlyID0gYXdhaXQgaXNEaXJlY3RvcnkoZnVsbFBhdGgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcmV2aW91cywgZnVsbFBhdGgsIGlzRGlyKVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoIWlzRGlyKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXMucHVzaChwYXRoRm9ybWF0KHBhcnNlQW5kUmVtb3ZlRXh0ZW5zaW9uKGZ1bGxQYXRoKSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChza2lwKSB7IH1cblxuICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzXG4gICAgICAgICAgfSwgW11cbiAgICAgICAgKVxuICAgICAgKSlcbiAgICBdXG5cbiAgICBjb25zdCBjb25mbGljdFJlc29sdmVyID0gb3B0aW9ucz8uY29uZmxpY3RSZXNvbHZlciA/PyAoKF8sbikgPT4gbi52YWx1ZSlcbiAgICBjb25zdCBwcm9qZWN0Um9vdCA9IG9wdGlvbnM/LnByb2plY3RSb290ID8/IGF3YWl0IGd1ZXNzUHJvamVjdFJvb3QoKVxuICAgIGNvbnN0IHJlc29sdmVyUm9vdHMgPSBvcHRpb25zPy5yZXNvbHZlclJvb3RzXG4gICAgICA/IChBcnJheS5pc0FycmF5KG9wdGlvbnM/LnJlc29sdmVyUm9vdHMpXG4gICAgICAgID8gb3B0aW9ucz8ucmVzb2x2ZXJSb290c1xuICAgICAgICA6IFtTdHJpbmcob3B0aW9ucz8ucmVzb2x2ZXJSb290cyldXG4gICAgICApXG4gICAgICA6IFtyZVBhdGhdXG5cblxuICAgIGNvbnN0IHBhdGhzID0ge1xuICAgICAgc2RsOiBbXSxcbiAgICAgIHJlc29sdmVyOiBbXSxcbiAgICAgIHVua25vd246IFtdLFxuICAgICAgaGFzVmFsdWVzOiBmYWxzZSxcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7dW5pcXVlU3RlbXMsIHByb2plY3RSb290LCByZXNvbHZlclJvb3RzfSlcblxuICAgIGZvciAoY29uc3QgcmVzb2x2ZXJSb290IG9mIHJlc29sdmVyUm9vdHMpIHtcbiAgICAgIGZvciAoY29uc3Qgc3RlbSBvZiB1bmlxdWVTdGVtcykge1xuICAgICAgICBjb25zdCBzdGVtUGFyc2VkID0gcGFyc2VBbmRSZW1vdmVFeHRlbnNpb24oc3RlbSlcbiAgICAgICAgY29uc3Qgcm9vdFJlbGF0aXZlID0gcmVzb2x2ZXJSb290LmluY2x1ZGVzKHByb2plY3RSb290KVxuICAgICAgICAgID8gcGF0aFJlc29sdmUocGF0aEpvaW4ocGF0aFJlbGF0aXZlKHByb2plY3RSb290LCByZXNvbHZlclJvb3QpLCBzdGVtUGFyc2VkLm5hbWUpKVxuICAgICAgICAgIDogcGF0aFJlc29sdmUocGF0aEpvaW4ocmVzb2x2ZXJSb290LCBzdGVtUGFyc2VkLm5hbWUpKVxuICAgICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgcmVzb2x2ZWRQYXRocyhyb290UmVsYXRpdmUsIFsuLi5ncUV4dHMsIC4uLmpzRXh0c10pXG4gICAgICAgIGNvbnNvbGUubG9nKHsgcm9vdFJlbGF0aXZlLCByZXN1bHRzIH0pXG5cbiAgICAgICAgaWYgKHJlc3VsdHMuaGFzVmFsdWVzKSB7XG4gICAgICAgICAgcGF0aHMuc2RsID0gcGF0aHMuc2RsLmNvbmNhdChyZXN1bHRzLnNkbClcbiAgICAgICAgICBwYXRocy5yZXNvbHZlciA9IHBhdGhzLnJlc29sdmVyLmNvbmNhdChyZXN1bHRzLnJlc29sdmVyKVxuICAgICAgICAgIHBhdGhzLnVua25vd24gPSBwYXRocy51bmtub3duLmNvbmNhdChyZXN1bHRzLnVua25vd24pXG4gICAgICAgICAgcGF0aHMuaGFzVmFsdWVzID0gcGF0aHMuaGFzVmFsdWVzIHx8IHJlc3VsdHMuaGFzVmFsdWVzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IHBhdGhzIH0pXG4gICAgY29uc3QgeyBzY2hlbWF0YSB9ID0gYXdhaXQgaW1wb3J0UmVzb2x2ZWRHcmFwaFFMKHBhdGhzLCB7IGNvbmZsaWN0UmVzb2x2ZXIgfSlcblxuICAgIHJldHVybiBzY2hlbWF0YVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0YW50IHVzZWQgd2l0aCBgZm9yRWFjaE9mKClgIHRoYXQgc2lnbmlmaWVzIHlvdSB3aXNoIHRvIGl0ZXJhdGVcbiAgICogb3ZlciBldmVyeSBhdmFpbGFibGUgdHlwZSB3aXRoaW4gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyBnZXQgQUxMKCkge1xuICAgIHJldHVybiBBTExcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdGFudCB1c2VkIHdpdGggYGZvckVhY2hPZigpYCB0aGF0IHNpZ25pZmllcyB5b3Ugd2lzaCB0byBpdGVyYXRlXG4gICAqIG92ZXIgZXZlcnkgYXZhaWxhYmxlIHR5cGUgd2l0aGluIHRoZSBzY2hlbWEuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IFRZUEVTKCkge1xuICAgIHJldHVybiBUWVBFU1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0YW50IHVzZWQgd2l0aCBgZm9yRWFjaE9mKClgIHRoYXQgc2lnbmlmaWVzIHlvdSB3aXNoIHRvIGl0ZXJhdGVcbiAgICogb3ZlciBldmVyeSBhdmFpbGFibGUgaW50ZXJmYWNlIHdpdGhpbiB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGdldCBJTlRFUkZBQ0VTKCkge1xuICAgIHJldHVybiBJTlRFUkZBQ0VTXG4gIH1cblxuICAvKipcbiAgICogQ29uc3RhbnQgdXNlZCB3aXRoIGBmb3JFYWNoT2YoKWAgdGhhdCBzaWduaWZpZXMgeW91IHdpc2ggdG8gaXRlcmF0ZVxuICAgKiBvdmVyIGV2ZXJ5IGF2YWlsYWJsZSBlbnVtIHdpdGhpbiB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGdldCBFTlVNUygpIHtcbiAgICByZXR1cm4gRU5VTVNcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdGFudCB1c2VkIHdpdGggYGZvckVhY2hPZigpYCB0aGF0IHNpZ25pZmllcyB5b3Ugd2lzaCB0byBpdGVyYXRlXG4gICAqIG92ZXIgZXZlcnkgYXZhaWxhYmxlIHVuaW9uIHdpdGhpbiB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGdldCBVTklPTlMoKSB7XG4gICAgcmV0dXJuIFVOSU9OU1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0YW50IHVzZWQgd2l0aCBgZm9yRWFjaE9mKClgIHRoYXQgc2lnbmlmaWVzIHlvdSB3aXNoIHRvIGl0ZXJhdGVcbiAgICogb3ZlciBldmVyeSBhdmFpbGFibGUgc2NhbGFyIHdpdGhpbiB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGdldCBTQ0FMQVJTKCkge1xuICAgIHJldHVybiBTQ0FMQVJTXG4gIH1cblxuICAvKipcbiAgICogQ29uc3RhbnQgdXNlZCB3aXRoIGBmb3JFYWNoT2YoKWAgdGhhdCBzaWduaWZpZXMgeW91IHdpc2ggdG8gaXRlcmF0ZVxuICAgKiBvdmVyIGV2ZXJ5IGF2YWlsYWJsZSByb290IHR5cGU7IFF1ZXJ5LCBNdXRhdGlvbiBhbmQgU3Vic2NyaXB0aW9uXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IFJPT1RfVFlQRVMoKSB7XG4gICAgcmV0dXJuIFJPT1RfVFlQRVNcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdGFudCB1c2VkIHdpdGggYGZvckVhY2hPZigpYCB0aGF0IHNpZ25pZmllcyB5b3Ugd2lzaCB0byBpdGVyYXRlXG4gICAqIG92ZXIgZXZlcnkgYXZhaWxhYmxlIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgd2l0aGluIHRoZSBzY2hlbWEuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IElOUFVUX1RZUEVTKCkge1xuICAgIHJldHVybiBJTlBVVF9UWVBFU1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0YW50IHVzZWQgd2l0aCBgZm9yRWFjaE9mKClgIHRoYXQgc2lnbmlmaWVzIHlvdSBhbHNvIHdpc2ggdG9cbiAgICogaXRlcmF0ZSBvdmVyIHRoZSBtZXRhIHR5cGVzLiBUaGVzZSBhcmUgZGVub3RlZCBieSBhIGxlYWRpbmcgZG91YmxlXG4gICAqIHVuZGVyc2NvcmUuXG4gICAqXG4gICAqIENhbiBiZSBPUidlZCB0b2dldGhlciBzdWNoIGFzIGBTY2hlbWF0YS5UWVBFUyB8IFNjaGVtYXRhLkhJRERFTmBcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyBnZXQgSElEREVOKCkge1xuICAgIHJldHVybiBISURERU5cbiAgfVxuXG4gIC8qKlxuICAgICAqIFJldHVybnMgYSBHcmFwaFFMU2NoZW1hIG9iamVjdC4gTm90ZSB0aGlzIHdpbGwgZmFpbCBhbmQgdGhyb3cgYW4gZXJyb3JcbiAgICAgKiBpZiB0aGVyZSBpcyBub3QgYXQgbGVhc3Qgb25lIFF1ZXJ5LCBTdWJzY3JpcHRpb24gb3IgTXV0YXRpb24gdHlwZSBkZWZpbmVkLlxuICAgICAqIElmIHRoZXJlIGlzIG5vIHN0b3JlZCBzY2hlbWEsIGFuZCB0aGVyZSBhcmUgcmVzb2x2ZXJzLCBhbiBleGVjdXRhYmxlXG4gICAgICogc2NoZW1hIGlzIHJldHVybmVkIGluc3RlYWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhbiBpbnN0YW5jZSBvZiBHcmFwaFFMU2NoZW1hIGlmIHZhbGlkIFNETFxuICAgICAqL1xuICAjZ2VuZXJhdGVTY2hlbWEoKSB7XG4gICAgY29uc3QgQ2xhc3MgPSB0aGlzLmNvbnN0cnVjdG9yXG4gICAgY29uc3QgcmVzb2x2ZXJzID0gdGhpcy5yZXNvbHZlcnNcbiAgICBsZXQgc2NoZW1hXG5cbiAgICAvLyBJZiB3ZSBoYXZlIGEgZ2VuZXJhdGVkIHNjaGVtYSBhbHJlYWR5IGFuZCB0aGlzIGluc3RhbmNlIGhhcyBhXG4gICAgLy8gcmVzb2x2ZXJzIG9iamVjdCB0aGF0IGlzIG5vdCBmYWxzZXksIGNoZWNrIHRvIHNlZSBpZiB0aGUgb2JqZWN0XG4gICAgLy8gaGFzIHRoZSBleGVjdXRhYmxlIHNjaGVtYSBmbGFnIHNldCBvciBub3QuIElmIHNvLCBzaW1wbHkgcmV0dXJuXG4gICAgLy8gdGhlIHByZS1leGlzdGluZyBvYmplY3QgcmF0aGVyIHRoYW4gY3JlYXRlIGEgbmV3IG9uZS5cbiAgICBpZiAodGhpc1tNQVBdLmdldCh3bWtTY2hlbWEpKSB7XG4gICAgICBzY2hlbWEgPSB0aGlzW01BUF0uZ2V0KHdta1NjaGVtYSlcblxuICAgICAgaWYgKHJlc29sdmVycykge1xuICAgICAgICAvLyBjaGVjayBmb3IgdGhlIGV4ZWN1dGFibGUgc2NoZW1hIGZsYWdcbiAgICAgICAgaWYgKHNjaGVtYT8uW0VYRV0pIHtcbiAgICAgICAgICByZXR1cm4gc2NoZW1hXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHNjaGVtYSkge1xuICAgICAgICByZXR1cm4gc2NoZW1hXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXR0ZW1wdCB0byBnZW5lcmF0ZSBhIHNjaGVtYSB1c2luZyB0aGUgU0RMIGZvciB0aGlzIGluc3RhbmNlLiBUaHJvd1xuICAgIC8vIGFuIGVycm9yIGlmIHRoZSBTREwgaXMgaW5zdWZmaWNpZW50IHRvIGdlbmVyYXRlIGEgR3JhcGhRTFNjaGVtYSBvYmplY3RcbiAgICB0cnkge1xuICAgICAgZGVidWdfbG9nKCdbZ2V0IC5zY2hlbWFdIGNyZWF0aW5nIHNjaGVtYSBmcm9tIFNETCcpXG4gICAgICB0aGlzW01BUF0uc2V0KHdta1NjaGVtYSwgKHNjaGVtYSA9IENsYXNzLmJ1aWxkU2NoZW1hKHRoaXMuc2RsLCB0cnVlKSkpXG5cbiAgICAgIC8vIE5vdyB0cnkgdG8gaGFuZGxlIGFuZCBPYmplY3RUeXBlRXh0ZW5zaW9uc1xuICAgICAgbGV0IGFzdCA9IHRoaXMuYXN0XG5cbiAgICAgIGFzdC5kZWZpbml0aW9ucyA9IFtdLmNvbmNhdChhc3QuZGVmaW5pdGlvbnMuZmlsdGVyKFxuICAgICAgICBpID0+IGkua2luZCA9PSAnT2JqZWN0VHlwZUV4dGVuc2lvbidcbiAgICAgICkpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXNbTUFQXS5zZXQod21rU2NoZW1hLCAoc2NoZW1hID0gZXh0ZW5kU2NoZW1hKHNjaGVtYSwgYXN0KSkpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZGVidWdfbG9nKCdbZ2V0IC5zY2hlbWFdIGZhaWxlZCB0byBoYW5kbGUgZXh0ZW5kZWQgdHlwZXMnKVxuICAgICAgICBkZWJ1Z190cmFjZSgnW2dldCAuc2NoZW1hXSBFUlJPUiEnLCBlcnJvcilcbiAgICAgIH1cblxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGRlYnVnX2xvZygnW2dldCAuc2NoZW1hXSBmYWlsZWQgdG8gY3JlYXRlIHNjaGVtYScpXG4gICAgICBkZWJ1Z190cmFjZSgnW2dldCAuc2NoZW1hXSBFUlJPUiEnLCBlcnJvcilcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgLy8gT25seSBpdGVyYXRlIG92ZXIgdGhlIGZpZWxkcyBpZiB0aGVyZSBhcmUgcmVzb2x2ZXJzIHNldFxuICAgIGlmIChyZXNvbHZlcnMpIHtcbiAgICAgIGZvckVhY2hGaWVsZChcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICAoXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICB0eXBlRGlyZWN0aXZlcyxcbiAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICBmaWVsZE5hbWUsXG4gICAgICAgICAgZmllbGRBcmdzLFxuICAgICAgICAgIGZpZWxkRGlyZWN0aXZlcyxcbiAgICAgICAgICBzY2hlbWEsXG4gICAgICAgICAgY29udGV4dFxuICAgICAgICApID0+IHtcbiAgICAgICAgICBpZiAoaXNSb290VHlwZSh0eXBlKSAmJiByZXNvbHZlcnNbZmllbGROYW1lXSkge1xuICAgICAgICAgICAgZmllbGQucmVzb2x2ZSA9IHJlc29sdmVyc1tmaWVsZE5hbWVdXG4gICAgICAgICAgICBmaWVsZC5hc3ROb2RlLnJlc29sdmUgPSByZXNvbHZlcnNbZmllbGROYW1lXVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyZXNvbHZlcnM/Llt0eXBlTmFtZV0/LltmaWVsZE5hbWVdKSB7XG4gICAgICAgICAgICBmaWVsZC5yZXNvbHZlID0gcmVzb2x2ZXJzW3R5cGVOYW1lXVtmaWVsZE5hbWVdXG4gICAgICAgICAgICBmaWVsZC5hc3ROb2RlLnJlc29sdmUgPSByZXNvbHZlcnNbdHlwZU5hbWVdW2ZpZWxkTmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcblxuICAgICAgdGhpcy5yZXNvbHZlckluZm8uZm9yRWFjaChyZXNvbHZlckluZm8gPT4ge1xuICAgICAgICByZXNvbHZlckluZm8uYXBwbHlUbyhzY2hlbWEpXG4gICAgICB9KVxuXG4gICAgICBzY2hlbWFbRVhFXSA9IHRydWVcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGdlbmVyYXRlZCBzY2hlbWEgaW4gdGhlIHdlYWsgbWFwIHVzaW5nIHRoZSB3ZWFrIG1hcCBrZXlcbiAgICB0aGlzW01BUF0uc2V0KHdta1NjaGVtYSwgc2NoZW1hKVxuXG4gICAgcmV0dXJuIHNjaGVtYVxuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYW4gdHlwZSwgZGV0ZXJtaW5lIGlmIHRoZSB0eXBlIGlzIGEgcm9vdCB0eXBlOyBpLmUuIG9uZSBvZiBRdWVyeSxcbiAqIE11dGF0aW9uIG9yIFN1YnNjcmlwdGlvbiBhcyBkZWZpbmVkIGluIHRoZSBgZ3JhcGhxbGAgbGlicmFyeS5cbiAqXG4gKiBAcGFyYW0gIHt1bmtub3dufSB0IGEgR3JhcGhRTCBBU1Qgb3Igb2JqZWN0IHR5cGUgZGVub3RpbmcgYSBzY2hlbWEgdHlwZVxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgdHlwZSBzdXBwbGllZCBpcyBhIHJvb3QgdHlwZTsgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmV4cG9ydCBjb25zdCBpc1Jvb3RUeXBlID0gdCA9PiB7XG4gIGlmICh0ID09PSB1bmRlZmluZWQgfHwgdCA9PT0gbnVsbCB8fCAhdCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICB0IGluc3RhbmNlb2YgR3JhcGhRTE9iamVjdFR5cGUgJiZcbiAgICBbJ1F1ZXJ5JywgJ011dGF0aW9uJywgJ1N1YnNjcmlwdGlvbiddLmluY2x1ZGVzKHQubmFtZSlcbiAgKVxufVxuXG4vKipcbiAqIExvb3BzIG92ZXIgdGhlIGByZXNvbHZlckluamVjdG9yc2AgaW4gdGhlIHN1cHBsaWVkIGNvbmZpZyBvYmplY3QgYW5kXG4gKiBsZXRzIGVhY2ggc3VwcGxpZWQgZnVuY3Rpb24gaGF2ZSBhIHBhc3MgdG8gaW5zcGVjdCBvciBtb2RpZnkgdGhlIHBhcmFtZXRlcnNcbiAqIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJpbmQgZnV0dXJlIHJlc29sdmVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge01lcmdlT3B0aW9uc0NvbmZpZ30gY29uZmlnIGEgY29uZmlnIG9iamVjdCB3aXRoIGFuIGFycmF5IG9mXG4gKiBgUmVzb2x2ZXJBcmdzVHJhbnNmb3JtZXJgIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtSZXNvbHZlckFyZ3N9IGFyZ3MgYW4gb2JqZWN0IHdpdGggYHNvdXJjZWAsIGBhcmdzYCwgYGNvbnRleHRgXG4gKiBhbmQgYGluZm9gXG4gKiBAcmV0dXJuIHtSZXNvbHZlckFyZ3N9IGEgcmVzdWx0aW5nIG9iamVjdCB3aXRoIGBzb3VyY2VgLCBgYXJnc2AsXG4gKiBgY29udGV4dGAgYW5kIGBpbmZvYFxuICovXG5leHBvcnQgZnVuY3Rpb24gcnVuSW5qZWN0b3JzKGNvbmZpZywgcmVzb2x2ZXJBcmdzKSB7XG4gIGxldCBhcmdzOiBSZXNvbHZlckFyZ3NcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoY29uZmlnLnJlc29sdmVySW5qZWN0b3JzKSkge1xuICAgIGNvbmZpZy5yZXNvbHZlckluamVjdG9ycyA9IFtjb25maWcucmVzb2x2ZXJJbmplY3RvcnNdXG4gIH1cblxuICBmb3IgKGxldCBpbmplY3RvciBvZiBjb25maWcucmVzb2x2ZXJJbmplY3RvcnMpIHtcbiAgICBhcmdzID0gaW5qZWN0b3IocmVzb2x2ZXJBcmdzKVxuICB9XG5cbiAgcmV0dXJuIGFyZ3Ncbn1cblxuLyoqXG4gKiBUaGUgbWVyZ2Ugb3B0aW9ucyBjb25maWcgdGFrZXMgdGhlIGFyZ3VtZW50cyBwYXNzZWQgaW50byBhIGdpdmVuIGByZXNvbHZlKClgXG4gKiBmdW5jdGlvbiwgYWxsb3dpbmcgdGhlIGltcGxlbWVudG9yIHRvIG1vZGlmeSB0aGUgdmFsdWVzIGJlZm9yZSBwYXNzaW5nIHRoZW1cbiAqIGJhY2sgb3V0LlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzY2hlbWEgdG8gaW5qZWN0IGludG8gdGhlIGluZm8gb2JqZWN0LCBvciBmb3VydGhcbiAqIHBhcmFtZXRlciwgcGFzc2VkIHRvIGFueSByZXNvbHZlci4gQW55IGBleHRyYUNvbmZpZ2Agb2JqZWN0IGFkZGVkIGluIHdpbGxcbiAqIGhhdmUgaXRzIHJlc29sdmVySW5qZWN0b3JzIGFkZGVkIHRvIHRoZSBsaXN0IHRvIGJlIHByb2Nlc3NlZC5cbiAqXG4gKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWF9IHNjaGVtYSB0aGUgR3JhcGhRTFNjaGVtYSBvYmplY3QgYmVpbmcgaW5zZXJ0ZWRcbiAqIEBwYXJhbSB7TWVyZ2VPcHRpb25zQ29uZmlnfSBleHRyYUNvbmZpZyBhbiBvcHRpb25hbCBleHRyYUNvbmZpZyBvcHRpb24gdG9cbiAqIG1lcmdlIHdpdGggdGhlIHJlc3VsdGluZyBvdXRwdXRcbiAqIEByZXR1cm4ge01lcmdlT3B0aW9uc0NvbmZpZ30gYSBNZXJnZU9wdGlvbnNDb25maWcgb2JqZWN0IHRoYXQgY29udGFpbnMgYXRcbiAqIGxlYXN0IGEgc2luZ2xlIGBSZXNvbHZlckFyZ3NUcmFuc2Zvcm1lcmAgd2hpY2ggaW5qZWN0cyB0aGUgc3VwcGxpZWQgYHNjaGVtYWBcbiAqIGludG8gdGhlIGBpbmZvYCBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTY2hlbWFJbmplY3RvckNvbmZpZyhzY2hlbWEsIGV4dHJhQ29uZmlnKSB7XG4gIGxldCBiYXNlQ29uZmlnID0ge1xuICAgIHJlc29sdmVySW5qZWN0b3JzOiBbXG4gICAgICBmdW5jdGlvbiBfX3NjaGVtYV9pbmplY3Rvcl9fKHsgc291cmNlLCBhcmdzLCBjb250ZXh0LCBpbmZvIH0pIHtcbiAgICAgICAgaW5mby5zY2hlbWEgPSBzY2hlbWEgfHwgaW5mby5zY2hlbWFcbiAgICAgICAgcmV0dXJuIHsgc291cmNlLCBhcmdzLCBjb250ZXh0LCBpbmZvIH1cbiAgICAgIH0sXG4gICAgXSxcbiAgfVxuXG4gIGlmIChleHRyYUNvbmZpZykge1xuICAgIGlmIChleHRyYUNvbmZpZy5yZXNvbHZlckluamVjdG9ycykge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV4dHJhQ29uZmlnLnJlc29sdmVySW5qZWN0b3JzKSkge1xuICAgICAgICBiYXNlQ29uZmlnLnJlc29sdmVySW5qZWN0b3JzLnB1c2goZXh0cmFDb25maWcucmVzb2x2ZXJJbmplY3RvcnMpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgYmFzZUNvbmZpZy5yZXNvbHZlckluamVjdG9ycyA9IGJhc2VDb25maWcucmVzb2x2ZXJJbmplY3RvcnMuY29uY2F0KFxuICAgICAgICAgIGV4dHJhQ29uZmlnLnJlc29sdmVySW5qZWN0b3JzXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYmFzZUNvbmZpZ1xufVxuXG4vKipcbiAqIFdhbGsgdGhlIHN1cHBsaWVkIEdyYXBoUUxTY2hlbWEgaW5zdGFuY2UgYW5kIHJldHJpZXZlIHRoZSByZXNvbHZlcnMgc3RvcmVkXG4gKiBvbiBpdC4gVGhlc2UgdmFsdWVzIGFyZSB0aGVuIHJldHVybmVkIHdpdGggYSBbdHlwZU5hbWVdW2ZpZWxkTmFtZV0gcGF0aGluZ1xuICpcbiAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYX0gc2NoZW1hIGFuIGluc3RhbmNlIG9mIEdyYXBoUUxTY2hlbWFcbiAqIEByZXR1cm4ge1Jlc29sdmVyTWFwP30gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBtYXBwaW5nIG9mIHR5cGVOYW1lLmZpZWxkTmFtZVxuICogdGhhdCBsaW5rcyB0byB0aGUgcmVzb2x2ZSgpIGZ1bmN0aW9uIGl0IGlzIGFzc29jaWF0ZWQgd2l0aGluIHRoZSBzdXBwbGllZFxuICogc2NoZW1hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpcFJlc29sdmVyc0Zyb21TY2hlbWEoc2NoZW1hKSB7XG4gIGxldCByZXNvbHZlcnMgPSB7fVxuXG4gIGlmICghc2NoZW1hKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGZvckVhY2hGaWVsZChcbiAgICBzY2hlbWEsXG4gICAgKFxuICAgICAgdHlwZSxcbiAgICAgIHR5cGVOYW1lLFxuICAgICAgdHlwZURpcmVjdGl2ZXMsXG4gICAgICBmaWVsZCxcbiAgICAgIGZpZWxkTmFtZSxcbiAgICAgIGZpZWxkQXJncyxcbiAgICAgIGZpZWxkRGlyZWN0aXZlcyxcbiAgICAgIF9zY2hlbWEsXG4gICAgICBjb250ZXh0XG4gICAgKSA9PiB7XG4gICAgICBpZiAoZmllbGQucmVzb2x2ZSkge1xuICAgICAgICByZXNvbHZlcnNbdHlwZU5hbWVdID0gcmVzb2x2ZXJzW3R5cGVOYW1lXSB8fCB7fVxuICAgICAgICByZXNvbHZlcnNbdHlwZU5hbWVdW2ZpZWxkTmFtZV0gPSByZXNvbHZlcnNbdHlwZU5hbWVdW2ZpZWxkTmFtZV0gfHwge31cbiAgICAgICAgcmVzb2x2ZXJzW3R5cGVOYW1lXVtmaWVsZE5hbWVdID0gZmllbGQucmVzb2x2ZVxuICAgICAgfVxuICAgIH1cbiAgKVxuXG4gIHJldHVybiByZXNvbHZlcnNcbn1cblxuLyoqIEB0eXBlIHtTeW1ib2x9IGEgdW5pcXVlIHN5bWJvbCB1c2VkIGFzIGEga2V5IHRvIGFsbCBpbnN0YW5jZSBzZGwgc3RyaW5ncyAqL1xuZXhwb3J0IGNvbnN0IFRZUEVERUZTX0tFWSA9IFN5bWJvbCgnaW50ZXJuYWwtdHlwZWRlZnMta2V5JylcblxuLyoqIEB0eXBlIHtTeW1ib2x9IGEgY29uc3RhbnQgc3ltYm9sIHVzZWQgYXMgYSBrZXkgdG8gYSBmbGFnIGZvciBleHByZXNzLWdxbCAqL1xuZXhwb3J0IGNvbnN0IEdSQVBISVFMX0ZMQUcgPSBTeW1ib2wuZm9yKCdpbnRlcm5hbC1ncmFwaGlxbC1rZXknKVxuXG4vKiogQHR5cGUge1N5bWJvbH0gYSBjb25zdGFudCBzeW1ib2wgdXNlZCBhcyBhIGtleSB0byBhIGZsYWcgZm9yIGV4cHJlc3MtZ3FsICovXG5leHBvcnQgY29uc3QgU0NIRU1BX0RJUkVDVElWRVMgPSBTeW1ib2wuZm9yKCdpbnRlcm5hbC1kaXJlY3RpdmVzLWtleScpXG5cbi8qKiBAdHlwZSB7U3ltYm9sfSBhIHVuaXF1ZSBzeW1ib2wgdXNlZCBhcyBhIGtleSB0byBhbGwgaW5zdGFuY2UgYFdlYWtNYXBgcyAqL1xuZXhwb3J0IGNvbnN0IE1BUCA9IFN5bWJvbCgnaW50ZXJuYWwtd2Vhay1tYXAta2V5JylcblxuLyoqIEB0eXBlIHtTeW1ib2x9IGEga2V5IHVzZWQgdG8gc3RvcmUgdGhlIF9fZXhlY3V0YWJsZV9fIGZsYWcgb24gYSBzY2hlbWEgKi9cbmV4cG9ydCBjb25zdCBFWEUgPSBTeW1ib2woJ2V4ZWN1dGFibGUtc2NoZW1hJylcblxuLyoqIEB0eXBlIHtPYmplY3R9IGEga2V5IHVzZWQgdG8gc3RvcmUgYSByZXNvbHZlciBvYmplY3QgaW4gYSBXZWFrTWFwICovXG5jb25zdCB3bWtSZXNvbHZlcnMgPSBPYmplY3QoU3ltYm9sKCdHcmFwaFFMIFJlc29sdmVycyBzdG9yYWdlIGtleScpKVxuXG4vKiogQHR5cGUge09iamVjdH0gYSBrZXkgdXNlZCB0byBzdG9yZSBhbiBpbnRlcm5hbCBzY2hlbWEgaW4gYSBXZWFrTWFwICovXG5jb25zdCB3bWtTY2hlbWEgPSBPYmplY3QoU3ltYm9sKCdHcmFwaFFMU2NoZW1hIHN0b3JhZ2Uga2V5JykpXG5cbi8qKlxuICogVGhpcyBpcyBhIGBTeW1ib2xgIGtleSB0byBhIGBXZWFrU2V0YCBvZiBgRXh0ZW5kZWRSZXNvbHZlck1hcGAgaW5zdGFuY2VzLFxuICogZWFjaCBvZiB3aGljaCBoYXZlIGF0IGxlYXN0IHRocmVlIHByb3BlcnRpZXM6XG4gKlxuICogIC0gc2NoZW1hXG4gKiAgLSBzZGxcbiAqICAtIHJlc29sdmVyc1xuICpcbiAqIE9uZSBvZiB0aGVzZSBhcmUgY3JlYXRlZCBhbmQgYWRkZWQgdG8gdGhlIHNldCB3aGVuZXZlciBhIG1lcmdlU2NoZW1hIGlzXG4gKiBwZXJmb3JtZWQuIE9uIGVhY2ggc3Vic2VxdWVudCBtZXJnZVNETC9TY2hlbWEgYSBuZXcgaW5zdGFuY2UgaXMgYWRkZWQgc3VjaFxuICogdGhhdCBuZXcgdmVyc2lvbnMgZXhpc3QgdG8gYmUgd3JhcHBlZCBhbmV3XG4gKlxuICogQHR5cGUge1t0eXBlXX1cbiAqL1xuY29uc3Qgd21rUHJlYm91bmRSZXNvbHZlcnMgPSBPYmplY3QoU3ltYm9sKCdSZXNvbHZlcnMgcHJlLW1lcmdlLXdyYXBwZWQnKSlcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmaWVsZCByZXNvbHZlciBibGluZGx5IHRha2VzIHJldHVybnMgdGhlIHJpZ2h0IGZpZWxkLiBUaGlzXG4gKiByZXNvbHZlciBpcyB1c2VkIHdoZW4gb25lIGlzIG5vdCBzcGVjaWZpZWQuXG4gKlxuICogQHBhcmFtIHtBU1ROb2RlfSBsZWZ0VHlwZSBUaGUgbWF0Y2hpbmcgbGVmdCB0eXBlIGluZGljYXRpbmcgY29uZmxpY3RcbiAqIEBwYXJhbSB7RmllbGROb2RlfSBsZWZ0RmllbGQgVGhlIGZpZWxkIGNhdXNpbmcgdGhlIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0FTVE5vZGV9IHJpZ2h0VHlwZSBUaGUgbWF0Y2hpbmcgcmlnaHQgdHlwZSBpbmRpY2F0aW5nIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0ZpZWxkTm9kZX0gcmlnaHRGaWVsZCB0aGUgZmllbGQgY2F1c2UgdGhlIGNvbmZsaWN0XG4gKlxuICogQHJldHVybiB7RmllbGROb2RlfSB0aGUgZmllbGQgdGhhdCBzaG91bGQgYmUgdXNlZCBhZnRlciByZXNvbHV0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEZWZhdWx0RmllbGRNZXJnZVJlc29sdmVyKFxuICBsZWZ0VHlwZSxcbiAgbGVmdEZpZWxkLFxuICByaWdodFR5cGUsXG4gIHJpZ2h0RmllbGRcbikge1xuICByZXR1cm4gcmlnaHRGaWVsZFxufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGRpcmVjdGl2ZSByZXNvbHZlciBibGluZGx5IHRha2VzIHJldHVybnMgdGhlIHJpZ2h0IGZpZWxkLiBUaGlzXG4gKiByZXNvbHZlciBpcyB1c2VkIHdoZW4gb25lIGlzIG5vdCBzcGVjaWZpZWQuXG4gKlxuICogQHBhcmFtIHtBU1ROb2RlfSBsZWZ0VHlwZSBUaGUgbWF0Y2hpbmcgbGVmdCB0eXBlIGluZGljYXRpbmcgY29uZmxpY3RcbiAqIEBwYXJhbSB7RGlyZWN0aXZlTm9kZX0gbGVmdERpcmVjdGl2ZSBUaGUgZmllbGQgY2F1c2luZyB0aGUgY29uZmxpY3RcbiAqIEBwYXJhbSB7QVNUTm9kZX0gcmlnaHRUeXBlIFRoZSBtYXRjaGluZyByaWdodCB0eXBlIGluZGljYXRpbmcgY29uZmxpY3RcbiAqIEBwYXJhbSB7RGlyZWN0aXZlTm9kZX0gcmlnaHREaXJlY3RpdmUgdGhlIGZpZWxkIGNhdXNlIHRoZSBjb25mbGljdFxuICpcbiAqIEByZXR1cm4ge0RpcmVjdGl2ZU5vZGV9IHRoZSBkaXJlY3RpdmUgdGhhdCBzaG91bGQgYmUgdXNlZCBhZnRlciByZXNvbHV0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEZWZhdWx0RGlyZWN0aXZlTWVyZ2VSZXNvbHZlcihcbiAgbGVmdFR5cGUsXG4gIGxlZnREaXJlY3RpdmUsXG4gIHJpZ2h0VHlwZSxcbiAgcmlnaHREaXJlY3RpdmUsXG4pIHtcbiAgcmV0dXJuIHJpZ2h0RGlyZWN0aXZlXG59XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZmllbGQgcmVzb2x2ZXIgYmxpbmRseSB0YWtlcyByZXR1cm5zIHRoZSByaWdodCBmaWVsZC4gVGhpc1xuICogcmVzb2x2ZXIgaXMgdXNlZCB3aGVuIG9uZSBpcyBub3Qgc3BlY2lmaWVkLlxuICpcbiAqIEBwYXJhbSB7QVNUTm9kZX0gbGVmdFR5cGUgVGhlIG1hdGNoaW5nIGxlZnQgdHlwZSBpbmRpY2F0aW5nIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0RpcmVjdGl2ZU5vZGV9IGxlZnREaXJlY3RpdmUgVGhlIGZpZWxkIGNhdXNpbmcgdGhlIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0FTVE5vZGV9IHJpZ2h0VHlwZSBUaGUgbWF0Y2hpbmcgcmlnaHQgdHlwZSBpbmRpY2F0aW5nIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0RpcmVjdGl2ZU5vZGV9IHJpZ2h0RGlyZWN0aXZlIHRoZSBmaWVsZCBjYXVzZSB0aGUgY29uZmxpY3RcbiAqXG4gKiBAcmV0dXJuIHtEaXJlY3RpdmVOb2RlfSB0aGUgZGlyZWN0aXZlIHRoYXQgc2hvdWxkIGJlIHVzZWQgYWZ0ZXIgcmVzb2x1dGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gRGVmYXVsdEVudW1NZXJnZVJlc29sdmVyKFxuICBsZWZ0VHlwZSxcbiAgbGVmdFZhbHVlLFxuICByaWdodFR5cGUsXG4gIHJpZ2h0VmFsdWVcbikge1xuICByZXR1cm4gcmlnaHRWYWx1ZVxufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHVuaW9uIHJlc29sdmVyIGJsaW5kbHkgdGFrZXMgcmV0dXJucyB0aGUgcmlnaHQgdHlwZS4gVGhpc1xuICogcmVzb2x2ZXIgaXMgdXNlZCB3aGVuIG9uZSBpcyBub3Qgc3BlY2lmaWVkLlxuICpcbiAqIEBwYXJhbSB7QVNUTm9kZX0gbGVmdFR5cGUgVGhlIG1hdGNoaW5nIGxlZnQgdHlwZSBpbmRpY2F0aW5nIGNvbmZsaWN0XG4gKiBAcGFyYW0ge05hbWVkVHlwZU5vZGV9IGxlZnRVbmlvbiBUaGUgbmFtZWQgbm9kZSBjYXVzaW5nIHRoZSBjb25mbGljdFxuICogQHBhcmFtIHtBU1ROb2RlfSByaWdodFR5cGUgVGhlIG1hdGNoaW5nIHJpZ2h0IHR5cGUgaW5kaWNhdGluZyBjb25mbGljdFxuICogQHBhcmFtIHtOYW1lZFR5cGVOb2RlfSByaWdodFVuaW9uIHRoZSBuYW1lZCBub2RlIGNhdXNlIHRoZSBjb25mbGljdFxuICpcbiAqIEByZXR1cm4ge05hbWVkVHlwZU5vZGV9IHRoZSBkaXJlY3RpdmUgdGhhdCBzaG91bGQgYmUgdXNlZCBhZnRlciByZXNvbHV0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEZWZhdWx0VW5pb25NZXJnZVJlc29sdmVyKFxuICBsZWZ0VHlwZSxcbiAgbGVmdFVuaW9uLFxuICByaWdodFR5cGUsXG4gIHJpZ2h0VW5pb25cbikge1xuICByZXR1cm4gcmlnaHRVbmlvblxufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHNjYWxhciBtZXJnZSByZXNvbHZlciByZXR1cm5zIHRoZSByaWdodCBjb25maWcgd2hlbiB0aGVyZSBpc1xuICogb25lLCBvdGhlcndpc2UgdGhlIGxlZnQgb25lIG9yIG51bGwgd2lsbCBiZSB0aGUgZGVmYXVsdCByZXN1bHQuIFRoaXMgaXNcbiAqIHNsaWdodGx5IGRpZmZlcmVudCBiZWhhdmlvciBzaW5jZSByZXNvbHZlcnMgZm9yIHNjYWxhcnMgYXJlIG5vdCBhbHdheXNcbiAqIGF2YWlsYWJsZS5cbiAqXG4gKiBAcGFyYW0ge0dyYXBoUUxTY2FsYXJUeXBlQ29uZmlnfSBsZWZ0Q29uZmlnICppZiogdGhlcmUgaXMgYSByZXNvbHZlciBkZWZpbmVkXG4gKiBmb3IgdGhlIGV4aXN0aW5nIFNjYWxhclR5cGVEZWZpbml0aW9uTm9kZSBpdCB3aWxsIGJlIHByb3ZpZGVkIGhlcmUuIElmIHRoaXNcbiAqIHZhbHVlIGlzIG51bGwsIHRoZXJlIGlzIG5vIGF2YWlsYWJlIGNvbmZpZyB3aXRoIHNlcmlhbGl6ZSgpLCBwYXJzZVZhbHVlKCkgb3JcbiAqIHBhcnNlTGl0ZXJhbCgpIHRvIHdvcmsgd2l0aC5cbiAqIEBwYXJhbSB7U2NhbGFyVHlwZURlZmluaXRpb25Ob2RlfSByaWdodFNjYWxhciB0aGUgZGVmaW5pdGlvbiBub2RlIGZvdW5kIHdoZW5cbiAqIHBhcnNpbmcgQVNUTm9kZXMuIFRoaXMgaXMgdG8gYmUgbWVyZ2VkIHZhbHVlIHRoYXQgY29uZmxpY3RzIHdpdGggdGhlXG4gKiBleGlzdGluZyB2YWx1ZVxuICogQHBhcmFtIHtHcmFwaFFMU2NhbGFyVHlwZUNvbmZpZ30gcmlnaHRDb25maWcgKmlmKiB0aGVyZSBpcyBhIHJlc29sdmVyXG4gKiBkZWZpbmVkIGZvciB0aGUgZXhpc3RpbmcgU2NhbGFyVHlwZURlZmluaXRpb25Ob2RlIGl0IHdpbGwgYmUgcHJvdmlkZWQgaGVyZS5cbiAqIElmIHRoaXMgdmFsdWUgaXMgbnVsbCwgdGhlcmUgaXMgbm8gYXZhaWxhYmUgY29uZmlnIHdpdGggc2VyaWFsaXplKCksXG4gKiBwYXJzZVZhbHVlKCkgb3IgcGFyc2VMaXRlcmFsKCkgdG8gd29yayB3aXRoLlxuICogQHJldHVybiB7R3JhcGhRTFNjYWxhclR5cGVDb25maWd9IHdoaWNoZXZlciB0eXBlIGNvbmZpZyBvciByZXNvbHZlciB3YXNcbiAqIGRlc2lyZWQgc2hvdWxkIGJlIHJldHVybmVkIGhlcmUuXG4gKlxuICogQHNlZSBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9kb2NzL2dyYXBocWwtdG9vbHMvc2NhbGFycy5odG1sXG4gKiBAc2VlIGh0dHA6Ly9ncmFwaHFsLm9yZy9ncmFwaHFsLWpzL3R5cGUvI2dyYXBocWxzY2FsYXJ0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEZWZhdWx0U2NhbGFyTWVyZ2VSZXNvbHZlcihcbiAgbGVmdFNjYWxhcixcbiAgbGVmdENvbmZpZyxcbiAgcmlnaHRTY2FsYXIsXG4gIHJpZ2h0Q29uZmlnXG4pIHtcbiAgcmV0dXJuIChyaWdodENvbmZpZyB8fCBsZWZ0Q29uZmlnKSA/PyBudWxsXG59XG5cbi8qKlxuICogSW4gb3JkZXIgdG8gZmFjaWxpdGF0ZSBtZXJnaW5nLCB0aGVyZSBuZWVkcyB0byBiZSBzb21lIGNvbnRpbmdlbmN5IHBsYW5cbiAqIGZvciB3aGF0IHRvIGRvIHdoZW4gY29uZmxpY3RzIGFyaXNlLiBUaGlzIG9iamVjdCBzcGVjaWZpZXMgb25lIG9mIGVhY2hcbiAqIHR5cGUgb2YgcmVzb2x2ZXIuIEVhY2ggc2ltcGx5IHRha2VzIHRoZSByaWdodC1oYW5kIHZhbHVlLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBEZWZhdWx0Q29uZmxpY3RSZXNvbHZlcnMgPSB7XG4gIC8qKiBBIGhhbmRsZXIgZm9yIHJlc29sdmluZyBmaWVsZHMgaW4gbWF0Y2hpbmcgdHlwZXMgKi9cbiAgZmllbGRNZXJnZVJlc29sdmVyOiBEZWZhdWx0RmllbGRNZXJnZVJlc29sdmVyLFxuXG4gIC8qKiBBIGhhbmRsZXIgZm9yIHJlc29sdmluZyBkaXJlY3RpdmVzIGluIG1hdGNoaW5nIHR5cGVzICovXG4gIGRpcmVjdGl2ZU1lcmdlUmVzb2x2ZXI6IERlZmF1bHREaXJlY3RpdmVNZXJnZVJlc29sdmVyLFxuXG4gIC8qKiBBIGhhbmRsZXIgZm9yIHJlc29sdmluZyBjb25mbGljdGluZyBlbnVtIHZhbHVlcyAqL1xuICBlbnVtVmFsdWVNZXJnZVJlc29sdmVyOiBEZWZhdWx0RW51bU1lcmdlUmVzb2x2ZXIsXG5cbiAgLyoqIEEgaGFuZGxlciBmb3IgcmVzb2x2aW5nIHR5cGUgdmFsdWVzIGluIHVuaW9ucyAqL1xuICB0eXBlVmFsdWVNZXJnZVJlc29sdmVyOiBEZWZhdWx0VW5pb25NZXJnZVJlc29sdmVyLFxuXG4gIC8qKiBBIGhhbmRsZXIgZm9yIHJlc29sdmluZyBzY2FsYXIgY29uZmlncyBpbiBjdXN0b20gc2NhbGFycyAqL1xuICBzY2FsYXJNZXJnZVJlc29sdmVyOiBEZWZhdWx0U2NhbGFyTWVyZ2VSZXNvbHZlcixcbn1cblxuLyoqXG4gKiBBIGBNZXJnZU9wdGlvbnNDb25maWdgIG9iamVjdCB3aXRoIGFuIGVtcHR5IGFycmF5IG9mXG4gKiBgUmVzb2x2ZXJBcmdzVHJhbnNmb3JtZXJgIGluc3RhbmNlc1xuICpcbiAqIEB0eXBlIHtNZXJnZU9wdGlvbnNDb25maWd9XG4gKi9cbmV4cG9ydCBjb25zdCBEZWZhdWx0TWVyZ2VPcHRpb25zID0ge1xuICBjb25mbGljdFJlc29sdmVyczogRGVmYXVsdENvbmZsaWN0UmVzb2x2ZXJzLFxuICByZXNvbHZlckluamVjdG9yczogW10sXG4gIGluamVjdE1lcmdlZFNjaGVtYTogdHJ1ZSxcbiAgY3JlYXRlTWlzc2luZ1Jlc29sdmVyczogZmFsc2UsXG59XG5cbmNvbnN0IHN1YlR5cGVSZXNvbHZlck1hcCA9IG5ldyBNYXAoKVxuc3ViVHlwZVJlc29sdmVyTWFwLnNldCgnZmllbGRzJywgJ2ZpZWxkTWVyZ2VSZXNvbHZlcicpXG5zdWJUeXBlUmVzb2x2ZXJNYXAuc2V0KCdkaXJlY3RpdmVzJywgJ2RpcmVjdGl2ZU1lcmdlUmVzb2x2ZXInKVxuc3ViVHlwZVJlc29sdmVyTWFwLnNldCgndmFsdWVzJywgJ2VudW1WYWx1ZU1lcmdlUmVzb2x2ZXInKVxuc3ViVHlwZVJlc29sdmVyTWFwLnNldCgndHlwZXMnLCAndHlwZVZhbHVlTWVyZ2VSZXNvbHZlcicpXG5zdWJUeXBlUmVzb2x2ZXJNYXAuc2V0KCdzY2FsYXJzJywgJ3NjYWxhck1lcmdlUmVzb2x2ZXInKVxuXG4vKipcbiAqIENvbXBhcmVzIGFuZCBjb21iaW5lcyBhIHN1YnNldCBvZiBBU1ROb2RlIGZpZWxkcy4gRGVzaWduZWQgdG8gd29yayBvbiBhbGxcbiAqIHRoZSB2YXJpb3VzIHR5cGVzIHRoYXQgbWlnaHQgaGF2ZSBhIG1lcmdlIGNvbmZsaWN0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdWJUeXBlTmFtZSB0aGUgbmFtZSBvZiB0aGUgZmllbGQgdHlwZTsgb25lIG9mIHRoZSBmb2xsb3dpbmdcbiAqIHZhbHVlczogJ2ZpZWxkcycsICdkaXJlY3RpdmVzJywgJ3ZhbHVlcycsICd0eXBlcydcbiAqIEBwYXJhbSB7QVNUTm9kZX0gbFR5cGUgdGhlIGxlZnRoYW5kIHR5cGUgY29udGFpbmluZyB0aGUgc3VidHlwZSB0byBjb21wYXJlXG4gKiBAcGFyYW0ge0FTVE5vZGV9IGxTdWJUeXBlIHRoZSBsZWZ0aGFuZCBzdWJ0eXBlOyBmaWVsZHMsIGRpcmVjdGl2ZSwgdmFsdWUgb3JcbiAqIG5hbWVkIHVuaW9uIHR5cGVcbiAqIEBwYXJhbSB7QVNUTm9kZX0gclR5cGUgdGhlIHJpZ2h0aGFuZCB0eXBlIGNvbnRhaW5pbmcgdGhlIHN1YnR5cGUgdG8gY29tcGFyZVxuICogQHBhcmFtIHtBU1ROb2RlfSByU3ViVHlwZSB0aGUgcmlnaHRoYW5kIHN1YnR5cGU7IGZpZWxkcywgZGlyZWN0aXZlLCB2YWx1ZSBvclxuICogbmFtZWQgdW5pb24gdHlwZVxuICovXG5mdW5jdGlvbiBjb21iaW5lVHlwZUFuZFN1YlR5cGUoXG4gIHN1YlR5cGVOYW1lLFxuICBsVHlwZSxcbiAgclR5cGUsXG4gIGNvbmZsaWN0UmVzb2x2ZXJzID0gRGVmYXVsdENvbmZsaWN0UmVzb2x2ZXJzXG4pIHtcbiAgaWYgKHJUeXBlW3N1YlR5cGVOYW1lXSkge1xuICAgIGZvciAobGV0IHJTdWJUeXBlIG9mIHJUeXBlW3N1YlR5cGVOYW1lXSkge1xuICAgICAgbGV0IGxTdWJUeXBlID0gbFR5cGVbc3ViVHlwZU5hbWVdLmZpbmQoXG4gICAgICAgIGYgPT4gZi5uYW1lLnZhbHVlID09IHJTdWJUeXBlLm5hbWUudmFsdWVcbiAgICAgIClcblxuICAgICAgaWYgKCFsU3ViVHlwZSkge1xuICAgICAgICBsVHlwZVtzdWJUeXBlTmFtZV0ucHVzaChyU3ViVHlwZSlcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgbGV0IHJlc29sdmVyID0gc3ViVHlwZVJlc29sdmVyTWFwLmdldChzdWJUeXBlTmFtZSkgfHwgJ2ZpZWxkTWVyZ2VSZXNvbHZlcidcbiAgICAgIGxldCByZXN1bHRpbmdTdWJUeXBlID0gY29uZmxpY3RSZXNvbHZlcnNbcmVzb2x2ZXJdKFxuICAgICAgICBsVHlwZSxcbiAgICAgICAgbFN1YlR5cGUsXG4gICAgICAgIHJUeXBlLFxuICAgICAgICByU3ViVHlwZVxuICAgICAgKVxuICAgICAgbGV0IGluZGV4ID0gbFR5cGUuZmllbGRzLmluZGV4T2YobFN1YlR5cGUpXG5cbiAgICAgIGxUeXBlW3N1YlR5cGVOYW1lXS5zcGxpY2UoaW5kZXgsIDEsIHJlc3VsdGluZ1N1YlR5cGUpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGFyZXMgYSBzdWJzZXQgb2YgQVNUTm9kZSBmaWVsZHMuIERlc2lnbmVkIHRvIHdvcmsgb24gYWxsIHRoZSB2YXJpb3VzXG4gKiB0eXBlcyB0aGF0IG1pZ2h0IGhhdmUgYSBtZXJnZSBjb25mbGljdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3ViVHlwZU5hbWUgdGhlIG5hbWUgb2YgdGhlIGZpZWxkIHR5cGU7IG9uZSBvZiB0aGUgZm9sbG93aW5nXG4gKiB2YWx1ZXM6ICdmaWVsZHMnLCAnZGlyZWN0aXZlcycsICd2YWx1ZXMnLCAndHlwZXMnXG4gKiBAcGFyYW0ge0FTVE5vZGV9IGxUeXBlIHRoZSBsZWZ0aGFuZCB0eXBlIGNvbnRhaW5pbmcgdGhlIHN1YnR5cGUgdG8gY29tcGFyZVxuICogQHBhcmFtIHtBU1ROb2RlfSBsU3ViVHlwZSB0aGUgbGVmdGhhbmQgc3VidHlwZTsgZmllbGRzLCBkaXJlY3RpdmUsIHZhbHVlIG9yXG4gKiBuYW1lZCB1bmlvbiB0eXBlXG4gKiBAcGFyYW0ge0FTVE5vZGV9IHJUeXBlIHRoZSByaWdodGhhbmQgdHlwZSBjb250YWluaW5nIHRoZSBzdWJ0eXBlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSB7QVNUTm9kZX0gclN1YlR5cGUgdGhlIHJpZ2h0aGFuZCBzdWJ0eXBlOyBmaWVsZHMsIGRpcmVjdGl2ZSwgdmFsdWUgb3JcbiAqIG5hbWVkIHVuaW9uIHR5cGVcbiAqL1xuZnVuY3Rpb24gcGFyZVR5cGVBbmRTdWJUeXBlKHN1YlR5cGVOYW1lLCBsVHlwZSwgclR5cGUsIHJlc29sdmVycyA9IHt9KSB7XG4gIGZvciAobGV0IHJTdWJUeXBlIG9mIHJUeXBlW3N1YlR5cGVOYW1lXSkge1xuICAgIGxldCBsU3ViVHlwZSA9IGxUeXBlW3N1YlR5cGVOYW1lXS5maW5kKFxuICAgICAgZiA9PiBmLm5hbWUudmFsdWUgPT0gclN1YlR5cGUubmFtZS52YWx1ZVxuICAgIClcblxuICAgIGlmICghbFN1YlR5cGUpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgbGV0IGluZGV4ID0gbFR5cGUuZmllbGRzLmluZGV4T2YobFN1YlR5cGUpXG4gICAgbFR5cGVbc3ViVHlwZU5hbWVdLnNwbGljZShpbmRleCwgMSlcblxuICAgIGlmIChyZXNvbHZlcnM/LltsVHlwZS5uYW1lLnZhbHVlXT8uW2xTdWJUeXBlLm5hbWUudmFsdWVdKSB7XG4gICAgICBkZWxldGUgcmVzb2x2ZXJzW2xUeXBlLm5hbWUudmFsdWVdW2xTdWJUeXBlLm5hbWUudmFsdWVdXG4gICAgfVxuICAgIGVsc2UgaWYgKHJlc29sdmVyc1tsU3ViVHlwZS5uYW1lLnZhbHVlXSkge1xuICAgICAgZGVsZXRlIHJlc29sdmVyc1tsU3ViVHlwZS5uYW1lLnZhbHVlXVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNtYWxsIGZ1bmN0aW9uIHRoYXQgc29ydHMgdGhyb3VnaCB0aGUgdHlwZURlZnMgdmFsdWUgc3VwcGxpZWQgd2hpY2ggY2FuIGJlXG4gKiBhbnkgb25lIG9mIGEgU2NoZW1hdGEgaW5zdGFuY2UsIEdyYXBoUUxTY2hlbWEgaW5zdGFuY2UsIFNvdXJjZSBpbnN0YW5jZSBvciBhXG4gKiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTY2hlbWFTb3VyY2V9IHR5cGVEZWZzIGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhLCBhIHN0cmluZyBvZiBTREwsXG4gKiBhIFNvdXJjZSBpbnN0YW5jZSBvZiBTREwsIGEgR3JhcGhRTFNjaGVtYSBvciBBU1ROb2RlIHRoYXQgY2FuIGJlIHByaW50ZWRcbiAqIGFzIGFuIFNETCBzdHJpbmdcbiAqIEByZXR1cm4ge3N0cmluZ30gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0aGluZyBzdXBwbGllZCBhcyB0eXBlRGVmc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplU291cmNlKHR5cGVEZWZzLCB3cmFwID0gZmFsc2UpIHtcbiAgaWYgKCF0eXBlRGVmcykge1xuICAgIHRocm93IG5ldyBFcnJvcihpbmxpbmVgXG4gICAgICBub3JtYWxpemVTb3VyY2UodHlwZURlZnMpOiB0eXBlRGVmcyB3YXMgaW52YWxpZCB3aGVuIHBhc3NlZCB0byB0aGVcbiAgICAgIGZ1bmN0aW9uIFxcYG5vcm1hbGl6ZVNvdXJjZVxcYC4gUGxlYXNlIGNoZWNrIHlvdXIgY29kZSBhbmQgdHJ5IGFnYWluLlxuXG4gICAgICAocmVjZWl2ZWQ6ICR7dHlwZURlZnN9KVxuICAgIGApXG4gIH1cblxuICBpZiAodHlwZURlZnMgaW5zdGFuY2VvZiBTY2hlbWF0YSAmJiB0eXBlRGVmcy52YWxpZCAmJiB3cmFwKSB7XG4gICAgcmV0dXJuIHR5cGVEZWZzXG4gIH1cblxuICBsZXQgc291cmNlID0gKFxuICAgIHR5cGVEZWZzLmJvZHkgfHxcbiAgICB0eXBlRGVmcy5zZGwgfHxcbiAgICAodHlwZW9mIHR5cGVEZWZzID09PSAnc3RyaW5nJyAmJiB0eXBlRGVmcykgfHxcbiAgICAodHlwZW9mIHR5cGVEZWZzID09PSAnb2JqZWN0JyAmJiBTY2hlbWF0YS5wcmludCh0eXBlRGVmcykpIHx8XG4gICAgKHR5cGVEZWZzIGluc3RhbmNlb2YgR3JhcGhRTFNjaGVtYVxuICAgICAgPyBwcmludFNjaGVtYSh0eXBlRGVmcylcbiAgICAgIDogdHlwZURlZnMudG9TdHJpbmcoKSlcbiAgKS50b1N0cmluZygpLnRyaW0oKVxuXG4gIHJldHVybiB3cmFwID8gU2NoZW1hdGEuZnJvbShzb3VyY2UpIDogc291cmNlXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVtYXRhXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQU1BLElBQUFDLEtBQUEsR0FBQUQsT0FBQTtBQXdCQSxJQUFBRSxRQUFBLEdBQUFGLE9BQUE7QUFXQSxJQUFBRyxpQkFBQSxH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
//# sourceMappingURL=Schemata.js.map