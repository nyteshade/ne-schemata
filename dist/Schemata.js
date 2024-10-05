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
var _debug = _interopRequireDefault(require("debug"));
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

const debug_log = (0, _debug.default)('Schemata:log');
const debug_trace = (0, _debug.default)('Schemata:trace');
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
              debug_log((0, _neTagFns.dedent)`
                [buildResolvers()] Falling back to \`astFieldByName()\`
                  rootType  %O
                  field     %O
                  resolvers %O
              `, rootType, field, resolvers);
              debug_trace((0, _neTagFns.dedent)`
                [buildResolvers()] Falling back to \`astFieldByName()\` due to
                  rootType  %O
                  field     %O
                  resolvers %O
                  error     %O
              `, rootType, field, resolvers, error);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGVidWciLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9taXNlcyIsIl9wYXRoIiwiX2dyYXBocWwiLCJfR3JhcGhRTEV4dGVuc2lvbiIsIl91dGlscyIsIl9yZXNvbHZlcndvcmsiLCJfRXh0ZW5kZWRSZXNvbHZlck1hcCIsIl9FeHRlbmRlZFJlc29sdmVyIiwiX25lVGFnRm5zIiwiX3dhbGtSZXNvbHZlck1hcCIsIl9kZWVwbWVyZ2UiLCJfdXRpbCIsIl9mb3JFYWNoT2YiLCJfZHluYW1pY0ltcG9ydCIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImRlYnVnX2xvZyIsImRlYnVnIiwiZGVidWdfdHJhY2UiLCJTY2hlbWF0YSIsIlN0cmluZyIsImNvbnN0cnVjdG9yIiwidHlwZURlZnMiLCJyZXNvbHZlcnMiLCJidWlsZFJlc29sdmVycyIsImZsYXR0ZW5SZXNvbHZlcnMiLCJub3JtYWxpemVTb3VyY2UiLCJHcmFwaFFMU2NoZW1hIiwic3RyaXBSZXNvbHZlcnNGcm9tU2NoZW1hIiwiR1JBUEhJUUxfRkxBRyIsIlRZUEVERUZTX0tFWSIsIk1BUCIsIldlYWtNYXAiLCJzZXQiLCJ3bWtTY2hlbWEiLCJ3bWtSZXNvbHZlcnMiLCJ3bWtQcmVib3VuZFJlc29sdmVycyIsInByZXZSZXNvbHZlck1hcHMiLCJnZXQiLCJFWEUiLCJTeW1ib2wiLCJmb3IiLCJidWlsZFJlc29sdmVyRm9yRWFjaEZpZWxkIiwic3BlY2llcyIsIml0ZXJhdG9yIiwidG9TdHJpbmciLCJiaW5kIiwidG9TdHJpbmdUYWciLCJuYW1lIiwiYXN0IiwicGFyc2UiLCJzZGwiLCJncmFwaGlxbCIsInZhbHVlIiwic2NoZW1hIiwiZ2VuZXJhdGVTY2hlbWEiLCJkZWxldGUiLCJzY2hlbWFSZXNvbHZlcnMiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwibWVyZ2UiLCJzY2hlbWFEaXJlY3RpdmVzIiwiU0NIRU1BX0RJUkVDVElWRVMiLCJtYXBzIiwiZXhlY3V0YWJsZVNjaGVtYSIsImZsYXR0ZW5TREwiLCJwcmludFNjaGVtYSIsImZsYXRTREwiLCJ0eXBlcyIsImZvckVhY2hUeXBlRmllbGQiLCJ0IiwidG4iLCJ0ZCIsImYiLCJmbiIsImZhIiwiZmQiLCJjIiwicHJpbnRUeXBlIiwiZGVmaW5pdGlvbnMiLCJmaWVsZEFTVCIsImZpZWxkcyIsImZpbHRlciIsIm8iLCJpIiwiYSIsImZpZWxkVHlwZSIsInR5cGVGcm9tQVNUIiwidHlwZSIsImFyZ3MiLCJwdXNoIiwicm9vdFZhbHVlIiwicmVzb2x2ZXJJbmZvIiwiZXh0cmFjdFJlc29sdmVySW5mbyIsInNjaGVtYVJlc29sdmVyRm9yIiwiZmllbGQiLCJ2YWxpZCIsIl90eXBlIiwiZ2V0VHlwZSIsIl9maWVsZCIsImdldEZpZWxkcyIsInJlc29sdmUiLCJzY2hlbWFGaWVsZEJ5TmFtZSIsInZhbGlkU2NoZW1hIiwiYXN0VHlwZUJ5TmFtZSIsInZhbGlkU0RMIiwiZmluZCIsImFzdEZpZWxkQnlOYW1lIiwiaGFzRmxhdHRlbmVkUmVzb2x2ZXJzIiwiYXN0cyIsInF1ZXJ5IiwibXV0YXRpb24iLCJzdWJzY3JpcHRpb24iLCJtZXJnZVNETCIsInNjaGVtYUxhbmd1YWdlIiwiY29uZmxpY3RSZXNvbHZlcnMiLCJEZWZhdWx0Q29uZmxpY3RSZXNvbHZlcnMiLCJzb3VyY2UiLCJFcnJvciIsImlubGluZSIsImxBU1QiLCJyQVNUIiwiX3NjYWxhckZucyIsInJUeXBlIiwibFR5cGUiLCJraW5kIiwiZW5kc1dpdGgiLCJzdWJzdHJpbmciLCJjb21iaW5lVHlwZUFuZFN1YlR5cGUiLCJsU2NhbGFyIiwibFNjYWxhckNvbmZpZyIsInJTY2FsYXIiLCJyU2NhbGFyQ29uZmlnIiwicmVzb2x2ZXIiLCJfc2NhbGFyQ29uZmlnIiwic2NhbGFyTWVyZ2VSZXNvbHZlciIsIm1lcmdlZCIsImZyb20iLCJncWwiLCJwcmludCIsInR5cGVOYW1lIiwicGFyZVNETCIsInJlc29sdmVyTWFwIiwibGVuIiwicGFyZVR5cGVBbmRTdWJUeXBlIiwidmFsdWVzIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwicmVzdWx0IiwiY29uZmlnIiwiRGVmYXVsdE1lcmdlT3B0aW9ucyIsIm1lcmdlZENvbmZpZyIsImxlZnQiLCJ1bmRlZmluZWQiLCJyaWdodCIsInByZXZNYXBzIiwiY29uY2F0IiwiRXh0ZW5kZWRSZXNvbHZlck1hcCIsIm1lcmdlUmVzb2x2ZXJzIiwicmVkdWNlIiwicCIsImNyZWF0ZU1pc3NpbmdSZXNvbHZlcnMiLCJjbGVhclNjaGVtYSIsImluamVjdE1lcmdlZFNjaGVtYSIsImZvckVhY2hGaWVsZCIsInR5cGVEaXJlY3RpdmVzIiwiZmllbGROYW1lIiwiZmllbGRBcmdzIiwiZmllbGREaXJlY3RpdmVzIiwiY29udGV4dCIsIkV4dGVuZGVkUmVzb2x2ZXIiLCJTY2hlbWFJbmplY3RvciIsIm1lcmdlU2NoZW1hIiwiZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0iLCJleHRlbmRXaXRoIiwic2NoZW1hdGEiLCJyb290VHlwZSIsImVycm9yIiwiZGVkZW50IiwiaXRlbSIsImludGVyaW0iLCJyIiwiZGVmYXVsdEZpZWxkUmVzb2x2ZXIiLCJoYXNBbkV4ZWN1dGFibGVTY2hlbWEiLCJjbGVhclJlc29sdmVycyIsIlV0aWwiLCJpbnNwZWN0IiwiY3VzdG9tIiwidmFsdWVPZiIsImZvckVhY2hPZiIsInN1cHBsaWVkU2NoZW1hIiwiZm9yRWFjaFR5cGUiLCJUWVBFUyIsImZvckVhY2hJbnB1dE9iamVjdFR5cGUiLCJJTlBVVF9UWVBFUyIsImZvckVhY2hVbmlvbiIsIlVOSU9OUyIsImZvckVhY2hFbnVtIiwiRU5VTVMiLCJmb3JFYWNoSW50ZXJmYWNlIiwiSU5URVJGQUNFUyIsImZvckVhY2hTY2FsYXIiLCJTQ0FMQVJTIiwiZm9yRWFjaFJvb3RUeXBlIiwiUk9PVF9UWVBFUyIsIkFMTCIsImZvckVhY2hJbnRlcmZhY2VGaWVsZCIsImZvckVhY2hJbnB1dE9iamVjdEZpZWxkIiwicnVuIiwiY29udGV4dFZhbHVlIiwidmFyaWFibGVWYWx1ZXMiLCJvcGVyYXRpb25OYW1lIiwiZmllbGRSZXNvbHZlciIsInR5cGVSZXNvbHZlciIsImdyYXBocWxTeW5jIiwicnVuQXN5bmMiLCJncmFwaHFsIiwiYnVpbGRTY2hlbWEiLCJzaG93RXJyb3IiLCJzY2hlbWFPcHRzIiwiZW5oYW5jZSIsIm5vZGUiLCJmcm9tQ29udGVudHNPZiIsInBhdGgiLCJyZXNvbHZlZCIsInBhdGhSZXNvbHZlIiwiY29udGVudHMiLCJyZWFkRmlsZSIsImJ1aWxkRnJvbURpciIsIm9wdGlvbnMiLCJjb25mbGljdFJlc29sdmVyIiwiXyIsIm5ld1Jlc29sdmVyIiwiZ3FFeHRzIiwianNFeHRzIiwicmVzb2x2ZXJzUm9vdHMiLCJwcm9qZWN0Um9vdCIsInBhcnNlQW5kUmVtb3ZlRXh0ZW5zaW9uIiwicGF0aFBhcnNlIiwiYmFzZSIsImV4dCIsImlzRGlyZWN0b3J5IiwiYXN5bmNUcnlDYXRjaCIsInN0YXQiLCJyZVBhdGhEaXIiLCJkaXIiLCJyZVBhdGgiLCJ1bmlxdWVTdGVtcyIsIlNldCIsInJlYWRkaXIiLCJyZWN1cnNpdmUiLCJhc3luY1ByZXZpb3VzIiwiY3VycmVudCIsInByZXZpb3VzIiwiZnVsbFBhdGgiLCJwYXRoSm9pbiIsImlzRGlyIiwiY29uc29sZSIsImxvZyIsInBhdGhGb3JtYXQiLCJza2lwIiwibiIsImd1ZXNzUHJvamVjdFJvb3QiLCJyZXNvbHZlclJvb3RzIiwiQXJyYXkiLCJpc0FycmF5IiwicGF0aHMiLCJ1bmtub3duIiwiaGFzVmFsdWVzIiwicmVzb2x2ZXJSb290Iiwic3RlbSIsInN0ZW1QYXJzZWQiLCJyb290UmVsYXRpdmUiLCJpbmNsdWRlcyIsInBhdGhSZWxhdGl2ZSIsInJlc3VsdHMiLCJyZXNvbHZlZFBhdGhzIiwiaW1wb3J0UmVzb2x2ZWRHcmFwaFFMIiwiSElEREVOIiwiI2dlbmVyYXRlU2NoZW1hIiwiQ2xhc3MiLCJleHRlbmRTY2hlbWEiLCJpc1Jvb3RUeXBlIiwiYXN0Tm9kZSIsImZvckVhY2giLCJhcHBseVRvIiwiZXhwb3J0cyIsIkdyYXBoUUxPYmplY3RUeXBlIiwicnVuSW5qZWN0b3JzIiwicmVzb2x2ZXJBcmdzIiwicmVzb2x2ZXJJbmplY3RvcnMiLCJpbmplY3RvciIsIlNjaGVtYUluamVjdG9yQ29uZmlnIiwiZXh0cmFDb25maWciLCJiYXNlQ29uZmlnIiwiX19zY2hlbWFfaW5qZWN0b3JfXyIsImluZm8iLCJfc2NoZW1hIiwiRGVmYXVsdEZpZWxkTWVyZ2VSZXNvbHZlciIsImxlZnRUeXBlIiwibGVmdEZpZWxkIiwicmlnaHRUeXBlIiwicmlnaHRGaWVsZCIsIkRlZmF1bHREaXJlY3RpdmVNZXJnZVJlc29sdmVyIiwibGVmdERpcmVjdGl2ZSIsInJpZ2h0RGlyZWN0aXZlIiwiRGVmYXVsdEVudW1NZXJnZVJlc29sdmVyIiwibGVmdFZhbHVlIiwicmlnaHRWYWx1ZSIsIkRlZmF1bHRVbmlvbk1lcmdlUmVzb2x2ZXIiLCJsZWZ0VW5pb24iLCJyaWdodFVuaW9uIiwiRGVmYXVsdFNjYWxhck1lcmdlUmVzb2x2ZXIiLCJsZWZ0U2NhbGFyIiwibGVmdENvbmZpZyIsInJpZ2h0U2NhbGFyIiwicmlnaHRDb25maWciLCJmaWVsZE1lcmdlUmVzb2x2ZXIiLCJkaXJlY3RpdmVNZXJnZVJlc29sdmVyIiwiZW51bVZhbHVlTWVyZ2VSZXNvbHZlciIsInR5cGVWYWx1ZU1lcmdlUmVzb2x2ZXIiLCJzdWJUeXBlUmVzb2x2ZXJNYXAiLCJNYXAiLCJzdWJUeXBlTmFtZSIsInJTdWJUeXBlIiwibFN1YlR5cGUiLCJyZXN1bHRpbmdTdWJUeXBlIiwid3JhcCIsImJvZHkiLCJ0cmltIiwiX2RlZmF1bHQiXSwic291cmNlcyI6WyIuLi9zcmMvU2NoZW1hdGEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCB7IGRlZmF1bHQgYXMgZGVidWcgfSBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWdfbG9nID0gZGVidWcoJ1NjaGVtYXRhOmxvZycpXG5jb25zdCBkZWJ1Z190cmFjZSA9IGRlYnVnKCdTY2hlbWF0YTp0cmFjZScpXG5cbmltcG9ydCB7XG4gIHJlYWRkaXIsXG4gIHJlYWRGaWxlLFxuICBzdGF0XG59IGZyb20gJ2ZzL3Byb21pc2VzJ1xuXG5pbXBvcnQge1xuICBmb3JtYXQgYXMgcGF0aEZvcm1hdCxcbiAgcmVzb2x2ZSBhcyBwYXRoUmVzb2x2ZSxcbiAgam9pbiBhcyBwYXRoSm9pbixcbiAgcGFyc2UgYXMgcGF0aFBhcnNlLFxuICByZWxhdGl2ZSBhcyBwYXRoUmVsYXRpdmVcbn0gZnJvbSAncGF0aCdcblxuaW1wb3J0IHR5cGUge1xuICBBU1ROb2RlLFxuICBCdWlsZFNjaGVtYU9wdGlvbnMsXG4gIERpcmVjdGl2ZU5vZGUsXG4gIEVudW1WYWx1ZU5vZGUsXG4gIEV4ZWN1dGlvblJlc3VsdCxcbiAgRmllbGROb2RlLFxuICBHcmFwaFFMRmllbGRSZXNvbHZlcixcbiAgR3JhcGhRTFNjYWxhclR5cGVDb25maWcsXG4gIE5hbWVkVHlwZU5vZGUsXG4gIE9iak1hcCxcbiAgUGFyc2VPcHRpb25zLFxuICBTY2FsYXJUeXBlRGVmaW5pdGlvbk5vZGUsXG4gIFNvdXJjZSxcbn0gZnJvbSAnZ3JhcGhxbCdcblxuaW1wb3J0IHtcbiAgZGVmYXVsdEZpZWxkUmVzb2x2ZXIsXG4gIGV4dGVuZFNjaGVtYSxcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIHBhcnNlLFxuICBwcmludFNjaGVtYSxcbiAgcHJpbnRUeXBlLFxuICB0eXBlRnJvbUFTVCxcbn0gZnJvbSAnZ3JhcGhxbCdcblxuaW1wb3J0IHtcbiAgQWxsU2NoZW1hdGFFeHRlbnNpb25zLFxuICBpbXBvcnRHcmFwaFFMLFxuICBpbXBvcnRSZXNvbHZlZEdyYXBoUUwsXG4gIHJlc29sdmVkUGF0aHNcbn0gZnJvbSAnLi9HcmFwaFFMRXh0ZW5zaW9uJ1xuXG5pbXBvcnQgdHlwZSB7XG4gIENvbmZsaWN0UmVzb2x2ZXJzLFxuICBEaXJlY3RpdmVNZXJnZVJlc29sdmVyLFxuICBFbnVtTWVyZ2VSZXNvbHZlcixcbiAgRmllbGRNZXJnZVJlc29sdmVyLFxuICBNZXJnZU9wdGlvbnNDb25maWcsXG4gIFJlc29sdmVyQXJncyxcbiAgUmVzb2x2ZXJBcmdzVHJhbnNmb3JtZXIsXG4gIFJlc29sdmVySW5mbyxcbiAgUmVzb2x2ZXJNYXAsXG4gIFNjYWxhck1lcmdlUmVzb2x2ZXIsXG4gIFNjaGVtYVNvdXJjZSxcbiAgVW5pb25NZXJnZVJlc29sdmVyLFxufSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyBhc3luY1RyeUNhdGNoIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IGV4dHJhY3RSZXNvbHZlckluZm8gfSBmcm9tICcuL3V0aWxzL3Jlc29sdmVyd29yaydcbmltcG9ydCB7IEV4dGVuZGVkUmVzb2x2ZXJNYXAgfSBmcm9tICcuL0V4dGVuZGVkUmVzb2x2ZXJNYXAnXG5pbXBvcnQgeyBFeHRlbmRlZFJlc29sdmVyIH0gZnJvbSAnLi9FeHRlbmRlZFJlc29sdmVyJ1xuaW1wb3J0IHsgaW5saW5lLCBkZWRlbnQgfSBmcm9tICduZS10YWctZm5zJ1xuaW1wb3J0IHsgbWVyZ2VSZXNvbHZlcnMsIFJlc29sdmVyUHJvcGVydHkgfSBmcm9tICcuL3dhbGtSZXNvbHZlck1hcCdcbmltcG9ydCBtZXJnZSBmcm9tICdkZWVwbWVyZ2UnXG5pbXBvcnQgVXRpbCBmcm9tICd1dGlsJ1xuXG5pbXBvcnQge1xuICBmb3JFYWNoT2YsXG4gIGZvckVhY2hGaWVsZCxcbiAgQUxMLFxuICBUWVBFUyxcbiAgSU5URVJGQUNFUyxcbiAgRU5VTVMsXG4gIFVOSU9OUyxcbiAgU0NBTEFSUyxcbiAgUk9PVF9UWVBFUyxcbiAgSElEREVOLFxufSBmcm9tICcuL2ZvckVhY2hPZidcbmltcG9ydCB7IGZpbGVFeGlzdHMsIGZpbmROZWFyZXN0UGFja2FnZUpzb24sIGd1ZXNzUHJvamVjdFJvb3QgfSBmcm9tICcuL2R5bmFtaWNJbXBvcnQnXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9mb3JFYWNoT2YnKS5Gb3JFYWNoT2ZSZXNvbHZlcn0gRm9yRWFjaE9mUmVzb2x2ZXJcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vZm9yRWFjaE9mJykuRm9yRWFjaEZpZWxkUmVzb2x2ZXJ9IEZvckVhY2hGaWVsZFJlc29sdmVyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2ZvckVhY2hPZicpLkJpdG1hc2tlZFR5cGV9IEJpdG1hc2tlZFR5cGVcbiAqL1xuXG4vKipcbiAqIEEgc21hbGwgYFN0cmluZ2AgZXh0ZW5zaW9uIHRoYXQgbWFrZXMgd29ya2luZyB3aXRoIFNETC9JREwgdGV4dCBmYXIgZWFzaWVyXG4gKiBpbiBib3RoIHlvdXIgb3duIGxpYnJhcmllcyBhcyB3ZWxsIGFzIGluIGEgbm9kZUpTIFJFUEwuIEJ1aWx0LWluIHRvIHdoYXRcbiAqIGFwcGVhcnMgdG8gYmUgYSBub3JtYWwgU3RyaW5nIGZvciBhbGwgaW50ZW50cyBhbmQgcHVycG9zZXMsIGFyZSB0aGUgYWJpbGl0eVxuICogdG8gdHJhbnNmb3JtIHRoZSBzdHJpbmcgaW50byBhIHNldCBvZiBBU1Qgbm9kZXMsIGEgYnVpbHQgc2NoZW1hIG9yIGJhY2sgdG9cbiAqIHRoZSBTREwgc3RyaW5nLlxuICpcbiAqIEBjbGFzcyAgU2NoZW1hdGFcbiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVtYXRhIGV4dGVuZHMgU3RyaW5nIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFN0cmluZ2AsIHByZXN1bWFibHkgb2YgU0RMIG9yIElETC4gVGhlIGdldHRlciBgLnZhbGlkYFxuICAgKiB3aWxsIHByb3ZpZGUgc29tZSBpbmRpY2F0aW9uIGFzIHRvIHdoZXRoZXIgb3Igbm90IHRoZSBjb2RlIGlzIHZhbGlkLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQG1lbWJlck9mIFNjaGVtYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hU291cmNlfSB0eXBlRGVmcyBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSwgYSBzdHJpbmcgb2YgU0RMLFxuICAgKiBhIFNvdXJjZSBpbnN0YW5jZSBvZiBTREwsIGEgR3JhcGhRTFNjaGVtYSBvciBBU1ROb2RlIHRoYXQgY2FuIGJlIHByaW50ZWRcbiAgICogYXMgYW4gU0RMIHN0cmluZ1xuICAgKiBAcGFyYW0ge1Jlc29sdmVyTWFwfSByZXNvbHZlcnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgZmllbGQgcmVzb2x2ZXJzIGZvclxuICAgKiBmb3IgdGhlIHNjaGVtYSByZXByZXNlbnRlZCB3aXRoIHRoaXMgc3RyaW5nLiBbT3B0aW9uYWxdXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYnVpbGRSZXNvbHZlcnMgaWYgdGhpcyBmbGFnIGlzIHNldCB0byB0cnVlLCBidWlsZCBhIHNldFxuICAgKiBvZiByZXNvbHZlcnMgYWZ0ZXIgdGhlIHJlc3Qgb2YgdGhlIGluc3RhbmNlIGlzIGluaXRpYWxpemVkIGFuZCBzZXQgdGhlXG4gICAqIHJlc3VsdHMgb24gdGhlIGAucmVzb2x2ZXJzYCBwcm9wZXJ0eSBvZiB0aGUgbmV3bHkgY3JlYXRlZCBpbnN0YW5jZS4gSWZcbiAgICogYnVpbGRSZXNvbHZlcnMgaXMgdGhlIHN0cmluZyBcImFsbFwiLCB0aGVuIGEgcmVzb2x2ZXIgZm9yIGVhY2ggZmllbGQgbm90XG4gICAqIGRlZmluZWQgd2lsbCBiZSByZXR1cm5lZCB3aXRoIGEgYGRlZmF1bHRGaWVsZFJlc29sdmVyYCBhcyBpdHMgdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmbGF0dGVuUmVzb2x2ZXJzIGlmIHRydWUsIGFuZCBpZiBgYnVpbGRSZXNvbHZlcnNgIGlzIHRydWUsXG4gICAqIHRoZW4gbWFrZSBhbiBhdHRlbXB0IHRvIGZsYXR0ZW4gdGhlIHJvb3QgdHlwZXMgdG8gdGhlIGJhc2Ugb2YgdGhlXG4gICAqIHJlc29sdmVyIG1hcCBvYmplY3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICB0eXBlRGVmcyxcbiAgICByZXNvbHZlcnMgPSBudWxsLFxuICAgIGJ1aWxkUmVzb2x2ZXJzID0gZmFsc2UsXG4gICAgZmxhdHRlblJlc29sdmVycyA9IGZhbHNlLFxuICApIHtcbiAgICBzdXBlcihub3JtYWxpemVTb3VyY2UodHlwZURlZnMpKVxuXG4gICAgcmVzb2x2ZXJzID1cbiAgICAgIHJlc29sdmVycyB8fFxuICAgICAgKHR5cGVEZWZzIGluc3RhbmNlb2YgU2NoZW1hdGEgJiYgdHlwZURlZnMucmVzb2x2ZXJzKSB8fFxuICAgICAgKHR5cGVEZWZzIGluc3RhbmNlb2YgR3JhcGhRTFNjaGVtYSAmJlxuICAgICAgICBzdHJpcFJlc29sdmVyc0Zyb21TY2hlbWEodHlwZURlZnMpKSB8fFxuICAgICAgbnVsbFxuXG4gICAgdGhpc1tHUkFQSElRTF9GTEFHXSA9IHRydWVcbiAgICB0aGlzW1RZUEVERUZTX0tFWV0gPSBub3JtYWxpemVTb3VyY2UodHlwZURlZnMpXG4gICAgdGhpc1tNQVBdID0gbmV3IFdlYWtNYXAoKVxuICAgIHRoaXNbTUFQXS5zZXQoXG4gICAgICB3bWtTY2hlbWEsXG4gICAgICB0eXBlRGVmcyBpbnN0YW5jZW9mIEdyYXBoUUxTY2hlbWEgPyB0eXBlRGVmcyA6IG51bGxcbiAgICApXG4gICAgdGhpc1tNQVBdLnNldCh3bWtSZXNvbHZlcnMsIHJlc29sdmVycylcbiAgICB0aGlzW01BUF0uc2V0KFxuICAgICAgd21rUHJlYm91bmRSZXNvbHZlcnMsXG4gICAgICB0eXBlRGVmcyBpbnN0YW5jZW9mIFNjaGVtYXRhID8gdHlwZURlZnMucHJldlJlc29sdmVyTWFwcyA6IFtdXG4gICAgKVxuXG4gICAgLy8gTWFyayBhIHNjaGVtYSBwYXNzZWQgdG8gdXNlIGluIHRoZSBjb25zdHJ1Y3RvciBhcyBhbiBleGVjdXRhYmxlIHNjaGVtYVxuICAgIC8vIHRvIHByZXZlbnQgYW55IHJlcGxhY2VtZW50IG9mIHRoZSB2YWx1ZSBieSBnZXR0ZXJzIHRoYXQgZ2VuZXJhdGUgYVxuICAgIC8vIHNjaGVtYSBmcm9tIHRoZSBTRExcbiAgICBpZiAodGhpc1tNQVBdLmdldCh3bWtTY2hlbWEpKSB7XG4gICAgICB0aGlzW01BUF0uZ2V0KHdta1NjaGVtYSlbRVhFXSA9IHRydWVcbiAgICAgIHRoaXNbTUFQXS5nZXQod21rU2NoZW1hKVtTeW1ib2wuZm9yKCdjb25zdHJ1Y3Rvci1zdXBwbGllZC1zY2hlbWEnKV0gPSB0cnVlXG4gICAgfVxuXG4gICAgLy8gSWYgYnVpbGRSZXNvbHZlcnMgaXMgdHJ1ZSwgYWZ0ZXIgdGhlIHJlc3QgaXMgYWxyZWFkeSBzZXQgYW5kIGRvbmUsIGdvXG4gICAgLy8gYWhlYWQgYW5kIGJ1aWxkIGEgbmV3IHNldCBvZiByZXNvbHZlciBmdW5jdGlvbnMgZm9yIHRoaXMgaW5zdGFuY2VcbiAgICBpZiAoYnVpbGRSZXNvbHZlcnMpIHtcbiAgICAgIGlmIChidWlsZFJlc29sdmVycyA9PT0gJ2FsbCcpIHtcbiAgICAgICAgdGhpc1tNQVBdLnNldChcbiAgICAgICAgICB3bWtSZXNvbHZlcnMsXG4gICAgICAgICAgdGhpcy5idWlsZFJlc29sdmVyRm9yRWFjaEZpZWxkKGZsYXR0ZW5SZXNvbHZlcnMpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzW01BUF0uc2V0KHdta1Jlc29sdmVycywgdGhpcy5idWlsZFJlc29sdmVycyhmbGF0dGVuUmVzb2x2ZXJzKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3ltYm9sLnNwZWNpZXMgZW5zdXJlcyB0aGF0IGFueSBTdHJpbmcgbWV0aG9kcyB1c2VkIG9uIHRoaXMgaW5zdGFuY2Ugd2lsbFxuICAgKiByZXN1bHQgaW4gYSBTY2hlbWF0YSBpbnN0YW5jZSByYXRoZXIgdGhhbiBhIFN0cmluZy4gTk9URTogdGhpcyBkb2VzIG5vdFxuICAgKiB3b3JrIGFzIGV4cGVjdGVkIGluIGN1cnJlbnQgdmVyc2lvbnMgb2Ygbm9kZS4gVGhpcyBiaXQgb2YgY29kZSBoZXJlIGlzXG4gICAqIGJhc2ljYWxseSBhIGJpdCBvZiBmdXR1cmUgcHJvb2ZpbmcgZm9yIHdoZW4gU3ltYm9sLnNwZWNpZXMgc3RhcnRzIHdvcmtpbmdcbiAgICogd2l0aCBTdHJpbmcgZXh0ZW5kZWQgY2xhc3Nlc1xuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBzdGF0aWMgZ2V0IFtTeW1ib2wuc3BlY2llc10oKSB7XG4gICAgcmV0dXJuIFNjaGVtYXRhXG4gIH1cblxuICAvKipcbiAgICogUmVkZWZpbmUgdGhlIGl0ZXJhdG9yIGZvciBTY2hlbWF0YSBpbnN0YW5jZXMgc28gdGhhdCB0aGV5IHNpbXBseSBzaG93IHRoZVxuICAgKiBjb250ZW50cyBvZiB0aGUgU0RML3R5cGVEZWZzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKigpIHtcbiAgICAgIHlpZWxkIHRoaXMudG9TdHJpbmcoKVxuICAgIH0uYmluZCh0aGlzKVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZXMgdGhhdCBpbnN0YW5jZXMgb2YgU2NoZW1hdGEgcmVwb3J0IGludGVybmFsbHkgYXMgU2NoZW1hdGEgb2JqZWN0LlxuICAgKiBTcGVjaWZpY2FsbHkgdXNpbmcgdGhpbmdzIGxpa2UgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBBU1Qgbm9kZXMgZm9yIHRoaXMgc25pcHBldCBvZiBTREwuIEl0IHdpbGwgdGhyb3cgYW4gZXJyb3JcbiAgICogaWYgdGhlIHN0cmluZyBpcyBub3QgdmFsaWQgU0RML0lETC5cbiAgICpcbiAgICogQHJldHVybiB7QVNUTm9kZX0gYW55IHZhbGlkIEFTVE5vZGUgc3VwcG9ydGVkIGJ5IEdyYXBoUUxcbiAgICovXG4gIGdldCBhc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IucGFyc2UodGhpcy5zZGwsIGZhbHNlKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgYGdyYXBoaXFsYCBmbGFnLCB3aGljaCBkZWZhdWx0cyB0byB0cnVlLiBUaGlzIGZsYWcgY2FuXG4gICAqIG1ha2Ugc2V0dGluZyB1cCBhbiBlbmRwb2ludCBmcm9tIGEgU2NoZW1hdGEgaW5zdGFuY2UgZWFzaWVyIHdpdGhcbiAgICogZXhwcmVzcy1ncmFwaHFsXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGdyYXBoaXFsKCkge1xuICAgIHJldHVybiB0aGlzW0dSQVBISVFMX0ZMQUddXG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIHRvIGFsdGVyIHRoZSBkZWZhdWx0ICd0cnVlJyBmbGFnIHRvIG1ha2UgYW4gU2NoZW1hdGEgaW5zdGFuY2UgYVxuICAgKiB2YWxpZCBzaW5nbGUgYXJndW1lbnQgdG8gZnVuY3Rpb25zIGxpa2UgYGdyYXBocWxIVFRQKClgIGZyb20gZXhwcmVzc1xuICAgKiBHcmFwaFFMLlxuICAgKlxuICAgKiBOT1RFOiB0aGlzIGZsYWcgbWVhbnMgbm90aGluZyB0byB0aGUgU2NoZW1hdGEgY2xhc3MgYnV0IG1pZ2h0IGJlIHVzZWZ1bCBpblxuICAgKiB5b3VyIHByb2plY3QuXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufSB0cnVlIGlmIGdyYXBoaXFsIHNob3VsZCBiZSBzdGFydGVkOyBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIHNldCBncmFwaGlxbCh2YWx1ZSkge1xuICAgIHRoaXNbR1JBUEhJUUxfRkxBR10gPSB2YWx1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBHcmFwaFFMU2NoZW1hIG9iamVjdC4gTm90ZSB0aGlzIHdpbGwgZmFpbCBhbmQgdGhyb3cgYW4gZXJyb3JcbiAgICogaWYgdGhlcmUgaXMgbm90IGF0IGxlYXN0IG9uZSBRdWVyeSwgU3Vic2NyaXB0aW9uIG9yIE11dGF0aW9uIHR5cGUgZGVmaW5lZC5cbiAgICogSWYgdGhlcmUgaXMgbm8gc3RvcmVkIHNjaGVtYSwgYW5kIHRoZXJlIGFyZSByZXNvbHZlcnMsIGFuIGV4ZWN1dGFibGVcbiAgICogc2NoZW1hIGlzIHJldHVybmVkIGluc3RlYWQuXG4gICAqXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGFuIGluc3RhbmNlIG9mIEdyYXBoUUxTY2hlbWEgaWYgdmFsaWQgU0RMXG4gICAqL1xuICBnZXQgc2NoZW1hKCkge1xuICAgIHJldHVybiB0aGlzLiNnZW5lcmF0ZVNjaGVtYSgpXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIEdyYXBoUUxTY2hlbWEgb2JqZWN0IG9uIHRoZSBpbnRlcm5hbCB3ZWFrIG1hcCBzdG9yZS4gSWYgdGhlIHZhbHVlXG4gICAqIHN1cHBsaWVkIGlzIG5vdCB0cnV0aHkgKGkuZS4gbnVsbCwgdW5kZWZpbmVkLCBvciBldmVuIGZhbHNlKSB0aGVuIHRoaXNcbiAgICogbWV0aG9kIGRlbGV0ZXMgYW55IHN0b3JlZCBzY2hlbWEgaW4gdGhlIGludGVybmFsIG1hcC4gT3RoZXJ3aXNlLCB0aGVcbiAgICogc3VwcGxpZWQgdmFsdWUgaXMgc2V0IG9uIHRoZSBtYXAgYW5kIHN1YnNlcXVlbnQgZ2V0IGNhbGxzIHRvIGAuc2NoZW1hYFxuICAgKiB3aWxsIHJldHVybiB0aGUgdmFsdWUgc3VwcGxpZWQuXG4gICAqXG4gICAqIElmIHRoZXJlIGFyZSBib3VuZCByZXNvbHZlcnMgb24gdGhlIHN1cHBsaWVkIHNjaGVtYSwgYSBzeW1ib2wgZGVub3RpbmdcbiAgICogdGhhdCB0aGUgc2NoZW1hIGlzIGFuIGV4ZWN1dGFibGUgc2NoZW1hIHdpbGwgYmUgc2V0IHRvIHByZXZlbnQgaXQgZnJvbVxuICAgKiBiZWluZyBvdmVyd3JpdHRlbiBvbiBzdWJzZXF1ZW50IGdldCBvcGVyYXRpb25zLiBUaGUgYm91bmQgcmVzb2x2ZXJzIHdpbGxcbiAgICogYmUgbWVyZ2VkIHdpdGggdGhlIFNjaGVtYXRhJ3MgcmVzb2x2ZXJzIG9iamVjdC5cbiAgICpcbiAgICogSWYgcmVzb2x2ZXJzIGFyZSBzdWJzZXF1ZW50bHkgc2V0IG9uIHRoZSBgU2NoZW1hdGFgIGluc3RhbmNlIGFuZCB0aGVcbiAgICogc3VwcGxpZWQgc2NoZW1hIGRvZXMgbm90IGhhdmUgcmVzb2x2ZXJzIGJvdW5kIHRvIGl0LCBzdWJzZXF1ZW50IGdldFxuICAgKiByZXF1ZXN0cyBmb3IgdGhlIGludGVybmFsIGAuc2NoZW1hYCBtYXkgYXV0by1nZW5lcmF0ZSBhIG5ldyBvbmUgd2l0aFxuICAgKiBib3VuZCByZXNvbHZlcnMuIFlvdSBoYXZlIGJlZW4gd2FybmVkLiA9KVxuICAgKlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWF9IHNjaGVtYSBhbiBpbnN0YW5jZSBvZiBHcmFwaFFMU2NoZW1hIGluc3RhbmNlIHRvXG4gICAqIHN0b3JlIG9uIHRoZSBpbnRlcm5hbCB3ZWFrIG1hcC4gQW55IHNjaGVtYSBzdG9yZWQgaGVyZSB3aWxsIGJlIG1vZGlmaWVkXG4gICAqIGJ5IG1ldGhvZHMgdGhhdCBkbyBzby5cbiAgICovXG4gIHNldCBzY2hlbWEoc2NoZW1hKSB7XG4gICAgZGVidWdfbG9nKCdbc2V0IC5zY2hlbWFdOiAnLCBzY2hlbWEgPyAndHJ1dGh5JyA6ICdmYWxzZXknKVxuICAgIGRlYnVnX3RyYWNlKCdbc2V0IC5zY2hlbWFdICcsIHNjaGVtYSlcblxuICAgIGlmICghc2NoZW1hKSB7XG4gICAgICB0aGlzW01BUF0uZGVsZXRlKHdta1NjaGVtYSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgc2NoZW1hUmVzb2x2ZXJzID0gc3RyaXBSZXNvbHZlcnNGcm9tU2NoZW1hKHNjaGVtYSlcblxuICAgICAgaWYgKE9iamVjdC5rZXlzKHNjaGVtYVJlc29sdmVycykubGVuZ3RoKSB7XG4gICAgICAgIHNjaGVtYVtFWEVdID0gdHJ1ZVxuXG4gICAgICAgIG1lcmdlKCh0aGlzLnJlc29sdmVycyA9IHRoaXMucmVzb2x2ZXJzIHx8IHt9KSwgc2NoZW1hUmVzb2x2ZXJzKVxuICAgICAgfVxuXG4gICAgICB0aGlzW01BUF0uc2V0KHdta1NjaGVtYSwgc2NoZW1hKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGBzY2hlbWFEaXJlY3RpdmVzYCB2YWx1ZSwgd2hpY2ggZGVmYXVsdHMgdG8gdHJ1ZS4gVGhpc1xuICAgKiB2YWx1ZSBjYW4gbWFrZSBzZXR0aW5nIHVwIGFuIGVuZHBvaW50IGZyb20gYSBTY2hlbWF0YSBpbnN0YW5jZSBlYXNpZXJcbiAgICogd2l0aCBhcG9sbG8tc2VydmVyIG9yIGdyYXBocWwteW9nYSBvciBjb21wYXRpYmxlIHZhcmlhbnRzLiBTZWVcbiAgICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vZG9jcy9ncmFwaHFsLXRvb2xzL3NjaGVtYS1kaXJlY3RpdmVzLmh0bWxcbiAgICogaWYgeW91IGFyZSB1c2luZyB0aGlzIHZhbHVlIHdpdGggYXBvbGxvLXNlcnZlci5cbiAgICpcbiAgICogQHR5cGUge3tbc3RyaW5nXTogRnVuY3Rpb259fVxuICAgKi9cbiAgZ2V0IHNjaGVtYURpcmVjdGl2ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXNbU0NIRU1BX0RJUkVDVElWRVNdXG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBgc2NoZW1hRGlyZWN0aXZlc2AgdmFsdWUsIHdoaWNoIGRlZmF1bHRzIHRvIHRydWUuIFRoaXNcbiAgICogdmFsdWUgY2FuIG1ha2Ugc2V0dGluZyB1cCBhbiBlbmRwb2ludCBmcm9tIGEgU2NoZW1hdGEgaW5zdGFuY2UgZWFzaWVyXG4gICAqIHdpdGggYXBvbGxvLXNlcnZlciBvciBncmFwaHFsLXlvZ2Egb3IgY29tcGF0aWJsZSB2YXJpYW50cy4gU2VlXG4gICAqIGh0dHBzOi8vdGhlLWd1aWxkLmRldi9ncmFwaHFsL3Rvb2xzL2RvY3Mvc2NoZW1hLWRpcmVjdGl2ZXNcbiAgICogaWYgeW91IGFyZSB1c2luZyB0aGlzIHZhbHVlIHdpdGggYXBvbGxvLXNlcnZlci5cbiAgICpcbiAgICogQHR5cGUge3tbc3RyaW5nXTogRnVuY3Rpb259fVxuICAgKi9cbiAgc2V0IHNjaGVtYURpcmVjdGl2ZXModmFsdWUpIHtcbiAgICB0aGlzW1NDSEVNQV9ESVJFQ1RJVkVTXSA9IHZhbHVlXG4gIH1cblxuICAvKipcbiAgICogV2hlbiBhIFNjaGVtYXRhIGluc3RhbmNlIGlzIG1lcmdlZCB3aXRoIGFub3RoZXIgR3JhcGhRTFNjaGVtYSwgaXRzXG4gICAqIHJlc29sdmVycyBnZXQgc3RvcmVkIGJlZm9yZSB0aGV5IGFyZSB3cmFwcGVkIGluIGEgZnVuY3Rpb24gdGhhdCB1cGRhdGVzXG4gICAqIHRoZSBzY2hlbWEgb2JqZWN0IGl0IHJlY2VpdmVzLiBUaGlzIGFsbG93cyB0aGVtIHRvIGJlIHdyYXBwZWQgc2FmZWx5IGF0XG4gICAqIGEgbGF0ZXIgZGF0ZSBzaG91bGQgdGhpcyBpbnN0YW5jZSBiZSBtZXJnZWQgd2l0aCBhbm90aGVyLlxuICAgKlxuICAgKiBAcmV0dXJuIHtFeHRlbmRlZFJlc29sdmVyTWFwW119IGFuIGFycmF5IG9mIGBFeHRlbmRlZFJlc29sdmVyTWFwYFxuICAgKiBvYmplY3QgaW5zdGFuY2VzXG4gICAqL1xuICBnZXQgcHJldlJlc29sdmVyTWFwcygpIHtcbiAgICByZXR1cm4gdGhpc1tNQVBdLmdldCh3bWtQcmVib3VuZFJlc29sdmVycylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwcmUtYm91bmQgcmVzb2x2ZXIgbWFwIG9iamVjdHMgYXMgYW4gYXJyYXkgb2ZcbiAgICogYEV4dGVuZGVkUmVzb2x2ZXJNYXBgIG9iamVjdCBpbnN0YW5jZXMgb24gdGhpcyBpbnN0YW5jZSBvZiBTY2hlbWF0YVxuICAgKlxuICAgKiBAcGFyYW0ge0V4dGVuZGVkUmVzb2x2ZXJNYXBbXX0gbWFwcyBhbiBhcnJheSBvZiBgRXh0ZW5kZWRSZXNvbHZlck1hcGBcbiAgICogb2JqZWN0IGluc3RhbmNlc1xuICAgKi9cbiAgc2V0IHByZXZSZXNvbHZlck1hcHMobWFwcykge1xuICAgIHRoaXNbTUFQXS5zZXQod21rUHJlYm91bmRSZXNvbHZlcnMsIG1hcHMpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIEdyYXBoUUxTY2hlbWEgb2JqZWN0LCBwcmUtYm91bmQsIHRvIHRoZSBhc3NvY2lhdGVkIHJlc29sdmVyc1xuICAgKiBtZXRob2RzIGluIGAucmVzb2x2ZXJzYC4gSWYgdGhlcmUgYXJlIG5vIHJlc29sdmVycywgdGhpcyBpcyBlc3NlbnRpYWxseVxuICAgKiB0aGUgc2FtZSBhcyBhc2tpbmcgZm9yIGEgc2NoZW1hIGluc3RhbmNlIHVzaW5nIGAuc2NoZW1hYC4gSWYgdGhlIFNETFxuICAgKiB0aGlzIGluc3RhbmNlIGlzIGJ1aWx0IGFyb3VuZCBpcyBpbnN1ZmZpY2llbnQgdG8gZ2VuZXJhdGUgYSBHcmFwaFFMU2NoZW1hXG4gICAqIGluc3RhbmNlLCB0aGVuIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYC5zY2hlbWFgIGluc3RlYWQ7IHRoaXMgc2ltcGx5IHByb3hpZXMgdG8gdGhhdFxuICAgKiBAdHlwZSB7R3JhcGhRTFNjaGVtYX1cbiAgICovXG4gIGdldCBleGVjdXRhYmxlU2NoZW1hKCkge1xuICAgIHJldHVybiB0aGlzLnNjaGVtYVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0cmluZyB0aGlzIGluc3RhbmNlIHdhcyBnZW5lcmF0ZWQgd2l0aC5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGdldCBzZGwoKSB7XG4gICAgcmV0dXJuIHRoaXNbVFlQRURFRlNfS0VZXVxuICB9XG5cbiAgLyoqXG4gICAqIFJld3JpdGVzIHRoZSB0eXBlRGVmcyBvciBTREwgd2l0aG91dCBhbnkgYGV4dGVuZCB0eXBlYCBkZWZpbml0aW9uc1xuICAgKiBhbmQgcmV0dXJucyB0aGUgbW9kaWZpZWQgaW5zdGFuY2UuXG4gICAqXG4gICAqIEB0eXBlIHtTY2hlbWF0YX1cbiAgICovXG4gIGZsYXR0ZW5TREwoKSB7XG4gICAgaWYgKHRoaXMuc2NoZW1hKSB7XG4gICAgICB0aGlzW1RZUEVERUZTX0tFWV0gPSBwcmludFNjaGVtYSh0aGlzLnNjaGVtYSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJlZ2VuZXJhdGVkIFNETCByZXByZXNlbnRpbmcgdGhlIFNjaGVtYSBvYmplY3Qgb24gdGhpc1xuICAgKiBTY2hlbWF0YSBpbnN0YW5jZS4gSXQgZG9lcyBub3QgbW9kaWZ5IHRoZSBzY2hlbWF0YSBvYmplY3QgaW5zdGFuY2VcbiAgICogaW4gYW55IHdheS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGdldCBmbGF0U0RMKCkge1xuICAgIGxldCBzZGwgPSB0aGlzW1RZUEVERUZTX0tFWV1cblxuICAgIGlmICh0aGlzLnNjaGVtYSkge1xuICAgICAgc2RsID0gcHJpbnRTY2hlbWEodGhpcy5zY2hlbWEpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNkbFxuICB9XG5cbiAgLyoqXG4gICAqIEEgc3lub255bSBvciBhbGlhcyBmb3IgYC5zZGxgLiBQbGFjZWQgaGVyZSBmb3IgdGhlIGV4cHJlc3MgcHVycG9zZSBvZlxuICAgKiBkZXN0cnVjdHVpbmcgd2hlbiB1c2VkIHdpdGggQXBvbGxvJ3MgbWFrZUV4ZWN1dGFibGVTY2hlbWEgb3Igb3RoZXJcbiAgICogbGlicmFyaWVzIGV4cGVjdGluZyB2YWx1ZXMgb2YgdGhlIHNhbWUgbmFtZVxuICAgKlxuICAgKiBpLmUuXG4gICAqICAgLy8gc2RsLnR5cGVEZWZzIGFuZCBzZGwucmVzb2x2ZXJzIHdpbGwgYmUgd2hlcmUgdGhlIGZ1bmN0aW9uIGV4cGVjdHNcbiAgICogICBsZXQgc2NoZW1hID0gcmVxdWlyZSgnZ3JhcGhxbC10b29scycpLm1ha2VFeGVjdXRhYmxlU2NoZW1hKHNkbClcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGdldCB0eXBlRGVmcygpIHtcbiAgICByZXR1cm4gdGhpcy5zZGxcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWxrcyB0aGUgdHlwZXMgZGVmaW5lZCBpbiB0aGUgc2RsIGZvciB0aGlzIGluc3RhbmNlIG9mIFNjaGVtYXRhIGFuZFxuICAgKiByZXR1cm5zIGFuIG9iamVjdCBtYXBwaW5nIGZvciB0aG9zZSBkZWZpbml0aW9ucy4gR2l2ZW4gYSBzY2hlbWEgc3VjaCBhc1xuICAgKiBgYGBcbiAgICogdHlwZSBBIHtcbiAgICogICBhOiBTdHJpbmdcbiAgICogICBiOiBbU3RyaW5nXVxuICAgKiAgIGM6IFtTdHJpbmddIVxuICAgKiB9XG4gICAqIHR5cGUgUXVlcnkge1xuICAgKiAgIEFzKG5hbWU6IFN0cmluZyk6IFtBXVxuICAgKiB9XG4gICAqIGBgYFxuICAgKiBhIEphdmFTY3JpcHQgb2JqZWN0IHdpdGggcHJvcGVydGllcyBzdWNoIGFzIHRoZSBmb2xsb3dpbmcgd2lsbCBiZVxuICAgKiByZXR1cm5lZFxuICAgKiBgYGBcbiAgICoge1xuICAgKiAgIFF1ZXJ5OiB7XG4gICAqICAgICBBczogeyB0eXBlOiAnW0FdJywgYXJnczogW3sgbmFtZTogJ1N0cmluZycgfV0gfVxuICAgKiAgIH0sXG4gICAqICAgQToge1xuICAgKiAgICAgYTogeyB0eXBlOiAnU3RyaW5nJywgYXJnczogW10gfSxcbiAgICogICAgIGI6IHsgdHlwZTogJ1tTdHJpbmddJywgYXJnczogW10gfSxcbiAgICogICAgIGM6IHsgdHlwZTogJ1tTdHJpbmddIScsIGFyZ3M6IFtdIH1cbiAgICogICB9XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqL1xuICBnZXQgdHlwZXMoKSB7XG4gICAgbGV0IHR5cGVzID0ge31cblxuICAgIHRoaXMuZm9yRWFjaFR5cGVGaWVsZCgodCx0bix0ZCxmLGZuLGZhLGZkLHNjaGVtYSxjKSA9PiB7XG4gICAgICBsZXQgYXN0ID0gcGFyc2UocHJpbnRUeXBlKHQpKS5kZWZpbml0aW9uc1swXVxuICAgICAgbGV0IGZpZWxkQVNUID0gYXN0LmZpZWxkcy5maWx0ZXIoKG8saSxhKSA9PiBvLm5hbWUudmFsdWUgPT0gZm4pXG4gICAgICBsZXQgZmllbGRUeXBlID0gZmllbGRBU1QubGVuZ3RoICYmIHR5cGVGcm9tQVNUKHNjaGVtYSwgZmllbGRBU1RbMF0udHlwZSlcbiAgICAgIGxldCBhcmdzID0gW11cblxuICAgICAgaWYgKGZhPy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChsZXQge25hbWUsIHR5cGV9IG9mIGZhKSB7XG4gICAgICAgICAgYXJncy5wdXNoKHsgW25hbWVdOiB0eXBlLnRvU3RyaW5nKCkgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAodHlwZXNbdG5dID0gdHlwZXNbdG5dIHx8IHt9KVtmbl0gPSB7XG4gICAgICAgIHR5cGU6IGZpZWxkVHlwZS50b1N0cmluZygpLFxuICAgICAgICBhcmdzOiBhcmdzXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiB0eXBlc1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGludGVybmFsIGNhbGwgdG8gYnVpbGRSZXNvbHZlcnModHJ1ZSksIHRoZXJlYnkgcmVxdWVzdGluZyBhIGZsYXR0ZW5lZFxuICAgKiByZXNvbHZlciBtYXAgd2l0aCBRdWVyeSwgTXV0YXRpb24gYW5kIFN1YnNjcmlwdGlvbiBmaWVsZHMgZXhwb3NlZCBhcyByb290XG4gICAqIG9iamVjdHMgdGhlIHdheSB0aGUgRmFjZWJvb2sgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uIGV4cGVjdHNcbiAgICpcbiAgICogQHJldHVybiB7UmVzb2x2ZXJNYXB9IGFuIG9iamVjdCBvZiBmdW5jdGlvbnMgb3IgYW4gZW1wdHkgb2JqZWN0IG90aGVyd2lzZVxuICAgKi9cbiAgZ2V0IHJvb3RWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5idWlsZFJlc29sdmVycyh0cnVlKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW55IHJlc29sdmVycyBmdW5jdGlvbiBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoaXMgaW5zdGFuY2UuXG4gICAqXG4gICAqIEByZXR1cm4ge1Jlc29sdmVyTWFwfSBhbiBvYmplY3QgY29udGFpbmluZyBmaWVsZCByZXNvbHZlcnMgb3IgbnVsbCBpZiBub25lXG4gICAqIGFyZSBzdG9yZWQgd2l0aGluXG4gICAqL1xuICBnZXQgcmVzb2x2ZXJzKCkge1xuICAgIHJldHVybiB0aGlzW01BUF0uZ2V0KHdta1Jlc29sdmVycylcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgdGhlIHJlc29sdmVycyBvYmplY3QsIGlmIHByZXNlbnQsIGZvciBhbnkgaXRlbXMgdGhhdCBuZWVkIHRvXG4gICAqIGJlIGFwcGxpZWQgYWZ0ZXIgdGhlIHNjaGVtYSBpcyBjb25zdHJ1Y3RlZC5cbiAgICpcbiAgICogQHJldHVybiB7UmVzb2x2ZXJJbmZvW119IGFuIGFycmF5IG9mIG9iamVjdHMgdG8gcHJvY2VzcyBvciBhbiBlbXB0eVxuICAgKiBhcnJheSBpZiB0aGVyZSBpcyBub3RoaW5nIHRvIHdvcmsgb25cbiAgICovXG4gIGdldCByZXNvbHZlckluZm8oKSB7XG4gICAgcmV0dXJuIGV4dHJhY3RSZXNvbHZlckluZm8odGhpcy5yZXNvbHZlcnMpXG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdG8gZmV0Y2ggYSBwYXJ0aWN1bGFyIGZpZWxkIHJlc29sdmVyIGZyb20gdGhlIHNjaGVtYSByZXByZXNlbnRlZFxuICAgKiBieSB0aGlzIFNjaGVtYXRhIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSB0aGUgbmFtZSBvZiB0aGUgdHlwZSBkZXNpcmVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCB0aGUgbmFtZSBvZiB0aGUgZmllbGQgY29udGFpbmluZyB0aGUgcmVzb2x2ZXJcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBmdW5jdGlvbiByZXNvbHZlciBmb3IgdGhlIHR5cGUgYW5kIGZpZWxkIGluXG4gICAqIHF1ZXN0aW9uXG4gICAqL1xuICBzY2hlbWFSZXNvbHZlckZvcih0eXBlLCBmaWVsZCkge1xuICAgIGlmICghdGhpcy5yZXNvbHZlcnMgfHwgIU9iamVjdC5rZXlzKHRoaXMucmVzb2x2ZXJzKS5sZW5ndGggfHwgIXRoaXMudmFsaWQpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgbGV0IF90eXBlID0gdGhpcy5zY2hlbWEuZ2V0VHlwZSh0eXBlKVxuICAgIGxldCBfZmllbGQgPSAoX3R5cGUuZ2V0RmllbGRzKCkgJiYgX3R5cGUuZ2V0RmllbGRzKClbZmllbGRdKSB8fCBudWxsXG4gICAgbGV0IHJlc29sdmUgPSAoX2ZpZWxkPy5yZXNvbHZlKSB8fCBudWxsXG5cbiAgICByZXR1cm4gcmVzb2x2ZVxuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIHNjaGVtYSBiYXNlZCBvbiB0aGUgU0RMIGluIHRoZSBpbnN0YW5jZSBhbmQgdGhlbiBwYXJzZXMgaXQgdG9cbiAgICogZmV0Y2ggYSBuYW1lZCBmaWVsZCBpbiBhIG5hbWVkIHR5cGUuIElmIGVpdGhlciB0aGUgdHlwZSBvciBmaWVsZCBhcmVcbiAgICogbWlzc2luZyBvciBpZiB0aGUgU0RMIGNhbm5vdCBiZSBidWlsdCBhcyBhIHNjaGVtYSwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgdGhlIG5hbWUgb2YgYSB0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCB0aGUgbmFtZSBvZiBhIGZpZWxkIGNvbnRhaW5lZCBpbiB0aGUgYWJvdmUgdHlwZVxuICAgKiBAcmV0dXJuIHtGaWVsZE5vZGV9IHRoZSBmaWVsZCByZWZlcmVuY2UgaW4gdGhlIHR5cGUgYW5kIGZpZWxkIHN1cHBsaWVkXG4gICAqL1xuICBzY2hlbWFGaWVsZEJ5TmFtZSh0eXBlLCBmaWVsZCkge1xuICAgIGlmICghdGhpcy52YWxpZFNjaGVtYSB8fCAhdGhpcy5zY2hlbWEpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgbGV0IF90eXBlID0gdGhpcy5zY2hlbWEuZ2V0VHlwZSh0eXBlKVxuICAgIGxldCBfZmllbGQgPSAoX3R5cGUuZ2V0RmllbGRzKCkgJiYgX3R5cGUuZ2V0RmllbGRzKClbZmllbGRdKSB8fCBudWxsXG5cbiAgICByZXR1cm4gX2ZpZWxkXG4gIH1cblxuICAvKipcbiAgICogRm9yIFNETCB0aGF0IGRvZXNuJ3QgcHJvcGVybHkgYnVpbGQgaW50byBhIEdyYXBoUUxTY2hlbWEsIGl0IGNhbiBzdGlsbCBiZVxuICAgKiBwYXJzZWQgYW5kIHNlYXJjaGVkIGZvciBhIHR5cGUgYnkgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgdGhlIG5hbWUgb2YgYSB0eXBlXG4gICAqIEByZXR1cm4ge0FTVE5vZGV9IHRoZSBmaWVsZCByZWZlcmVuY2UgaW4gdGhlIHR5cGUgYW5kIGZpZWxkIHN1cHBsaWVkXG4gICAqL1xuICBhc3RUeXBlQnlOYW1lKHR5cGUpIHtcbiAgICBpZiAoIXRoaXMudmFsaWRTREwpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgbGV0IF90eXBlID0gdGhpcy5hc3QuZGVmaW5pdGlvbnMuZmluZChmID0+IGYubmFtZS52YWx1ZSA9PT0gdHlwZSlcblxuICAgIHJldHVybiBfdHlwZVxuICB9XG5cbiAgLyoqXG4gICAqIEZvciBTREwgdGhhdCBkb2Vzbid0IHByb3Blcmx5IGJ1aWxkIGludG8gYSBHcmFwaFFMU2NoZW1hLCBpdCBjYW4gc3RpbGwgYmVcbiAgICogc2VhcmNoZWQgZm9yIGEgdHlwZSBhbmQgZmllbGQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIHRoZSBuYW1lIG9mIGEgdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgdGhlIG5hbWUgb2YgYSBmaWVsZCBjb250YWluZWQgaW4gdGhlIGFib3ZlIHR5cGVcbiAgICogQHJldHVybiB7RmllbGROb2RlfSB0aGUgZmllbGQgcmVmZXJlbmNlIGluIHRoZSB0eXBlIGFuZCBmaWVsZCBzdXBwbGllZFxuICAgKi9cbiAgYXN0RmllbGRCeU5hbWUodHlwZSwgZmllbGQpIHtcbiAgICBpZiAoIXRoaXMudmFsaWRTREwpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgbGV0IF90eXBlID0gdGhpcy5hc3QuZGVmaW5pdGlvbnMuZmluZChmID0+IGYubmFtZS52YWx1ZSA9PT0gdHlwZSlcbiAgICBsZXQgX2ZpZWxkID1cbiAgICAgIChfdHlwZT8uZmllbGRzLmZpbmQoZiA9PiBmLm5hbWUudmFsdWUgPT09IGZpZWxkKSkgfHwgbnVsbFxuXG4gICAgcmV0dXJuIF9maWVsZFxuICB9XG5cbiAgLyoqXG4gICAqIFdhbGtzIHRoZSBBU1QgZm9yIHRoaXMgU0RMIHN0cmluZyBhbmQgY2hlY2tzIGZvciB0aGUgbmFtZXMgb2YgdGhlIGZpZWxkc1xuICAgKiBvZiBlYWNoIG9mIHRoZSByb290IHR5cGVzOyBRdWVyeSwgTXV0YXRpb24gYW5kIFN1YnNjcmlwdGlvbi4gSWYgdGhlcmUgYXJlXG4gICAqIG5vIHJvb3QgdHlwZXMgZGVmaW5lZCwgZmFsc2UgaXMgcmV0dXJuZWQuXG4gICAqXG4gICAqIElmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSByb290IHR5cGUgKmFuZCogc29tZSByZXNvbHZlcnMgKmFuZCogYXQgbGVhc3Qgb25lXG4gICAqIG9mIHRoZSBmaWVsZHMgb2YgYXQgbGVhc3Qgb25lIHJvb3QgdHlwZSBpcyBwcmVzZW50IGluIHRoZSByb290IG9mIHRoZVxuICAgKiByZXNvbHZlcnMgbWFwLCB0cnVlIGlzIHJldHVybmVkLiBPdGhlcndpc2UsIGZhbHNlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBkZWZpbmVkIHJlc29sdmVycyBoYXZlIGF0IGxlYXN0IG9uZSByb290XG4gICAqIHR5cGUgZmllbGQgYXMgYSByZXNvbHZlciBvbiB0aGUgcm9vdCBvZiB0aGUgcmVzb2x2ZXIgbWFwOyBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgaGFzRmxhdHRlbmVkUmVzb2x2ZXJzKCkge1xuICAgIGxldCBhc3RzID0gKHRoaXMudmFsaWRTREwgJiYgdGhpcy5hc3QuZGVmaW5pdGlvbnMpIHx8IG51bGxcblxuICAgIGlmICghYXN0cyB8fCAhdGhpcy5yZXNvbHZlcnMpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGxldCBxdWVyeSA9IGFzdHMuZmluZChmID0+IGYubmFtZS52YWx1ZSA9PSAnUXVlcnknKVxuICAgIGxldCBtdXRhdGlvbiA9IGFzdHMuZmluZChmID0+IGYubmFtZS52YWx1ZSA9PSAnTXV0YXRpb24nKVxuICAgIGxldCBzdWJzY3JpcHRpb24gPSBhc3RzLmZpbmQoZiA9PiBmLm5hbWUudmFsdWUgPT0gJ1N1YnNjcmlwdGlvbicpXG4gICAgbGV0IHJlc29sdmVycyA9IHRoaXMucmVzb2x2ZXJzXG5cbiAgICBpZiAoIXF1ZXJ5ICYmICFtdXRhdGlvbiAmJiAhc3Vic2NyaXB0aW9uKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBmb3IgKGxldCB0eXBlIG9mIFtxdWVyeSwgbXV0YXRpb24sIHN1YnNjcmlwdGlvbl0pIHtcbiAgICAgIGlmICghdHlwZT8uZmllbGRzKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGZpZWxkIG9mIHR5cGUuZmllbGRzKSB7XG4gICAgICAgIGlmIChmaWVsZC5uYW1lLnZhbHVlIGluIHJlc29sdmVycykge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnaW5nIFNjaGVtYXRhcyBhcmUgYSBjb21tb24gZmVhdHVyZSBpbiB0aGUgbW9kZXJuIHdvcmxkIG9mIEdyYXBoUUwuXG4gICAqIEVzcGVjaWFsbHkgd2hlbiB0aGVyZSBhcmUgbXVsdGlwbGUgdGVhbXMgd29ya2luZyBpbiB0YW5kZW0uIFRoaXMgZmVhdHVyZVxuICAgKiBzdXBwb3J0cyBtZXJnaW5nIG9mIHR5cGVzLCBleHRlbmRlZCB0eXBlcywgaW50ZXJmYWNlcywgZW51bXMsIHVuaW9ucyxcbiAgICogaW5wdXQgb2JqZWN0IHR5cGVzIGFuZCBkaXJlY3RpdmVzIGZvciBhbGwgb2YgdGhlIGFib3ZlLlxuICAgKlxuICAgKiBAcGFyYW0ge1NjaGVtYVNvdXJjZX0gc2NoZW1hTGFuZ3VhZ2UgYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGEsIGEgc3RyaW5nIG9mXG4gICAqIFNETCwgYSBTb3VyY2UgaW5zdGFuY2Ugb2YgU0RMLCBhIEdyYXBoUUxTY2hlbWEgb3IgQVNUTm9kZSB0aGF0IGNhbiBiZVxuICAgKiBwcmludGVkIGFzIGFuIFNETCBzdHJpbmdcbiAgICogQHBhcmFtIHtDb25mbGljdFJlc29sdmVyc30gY29uZmxpY3RSZXNvbHZlcnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdXAgdG9cbiAgICogZm91ciBtZXRob2RzLCBlYWNoIGRlc2NyaWJpbmcgaG93IHRvIGhhbmRsZSBhIGNvbmZsaWN0IHdoZW4gYW4gYXNzb2NpYXRlZFxuICAgKiB0eXBlIG9mIGNvbmZsaWN0IG9jY3Vycy4gSWYgbm8gb2JqZWN0IG9yIG1ldGhvZCBhcmUgc3VwcGxpZWQsIHRoZSByaWdodFxuICAgKiBoYW5kZSB2YWx1ZSBhbHdheXMgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHRoZSBleGlzdGluZyB2YWx1ZTsgcmVwbGFjaW5nIGl0XG4gICAqIEByZXR1cm4ge1NjaGVtYXRhfSBhIG5ldyBpbnN0YW5jZSBvZiBTY2hlbWF0YVxuICAgKi9cbiAgbWVyZ2VTREwoXG4gICAgc2NoZW1hTGFuZ3VhZ2UsXG4gICAgY29uZmxpY3RSZXNvbHZlcnMgPSBEZWZhdWx0Q29uZmxpY3RSZXNvbHZlcnNcbiAgKSB7XG4gICAgbGV0IHNvdXJjZSA9IG5vcm1hbGl6ZVNvdXJjZShzY2hlbWFMYW5ndWFnZSwgdHJ1ZSlcblxuICAgIGlmICghc291cmNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoaW5saW5lYFxuICAgICAgICBUaGUgY2FsbCB0byBtZXJnZVNETChzY2hlbWFMYW5ndWFnZSwgY29uZmxpY3RSZXNvbHZlcnMpIHJlY2VpdmVkIGFuXG4gICAgICAgIGludmFsaWQgdmFsdWUgZm9yIHNjaGVtYUxhbmd1YWdlLiBQbGVhc2UgY2hlY2sgeW91ciBjb2RlIGFuZCB0cnkgYWdhaW4uXG4gICAgICAgIFJlY2VpdmVkICR7c2NoZW1hTGFuZ3VhZ2V9LlxuICAgICAgYClcbiAgICB9XG5cbiAgICBsZXQgbEFTVCA9IHRoaXMuYXN0XG4gICAgbGV0IHJBU1QgPSBzb3VyY2UuYXN0XG4gICAgbGV0IF9zY2FsYXJGbnMgPSB7fVxuXG4gICAgLy8gRW5zdXJlIHdlIGhhdmUgZGVmYXVsdCBiZWhhdmlvciB3aXRoIGFueSBjdXN0b20gYmVoYXZpb3IgYXNzaWduZWRcbiAgICAvLyBhdG9wIHRoZSBkZWZhdWx0IG9uZXMgc2hvdWxkIG9ubHkgYSBwYXJ0aWFsIGN1c3RvbSBiZSBzdXBwbGllZC5cbiAgICBjb25mbGljdFJlc29sdmVycyA9IG1lcmdlKERlZmF1bHRDb25mbGljdFJlc29sdmVycywgY29uZmxpY3RSZXNvbHZlcnMpXG5cbiAgICBmb3IgKGxldCByVHlwZSBvZiByQVNULmRlZmluaXRpb25zKSB7XG4gICAgICBsZXQgbFR5cGUgPSBsQVNULmRlZmluaXRpb25zLmZpbmQoYSA9PiBhLm5hbWUudmFsdWUgPT0gclR5cGUubmFtZS52YWx1ZSlcblxuICAgICAgaWYgKHJUeXBlPy5raW5kPy5lbmRzV2l0aCgnRXh0ZW5zaW9uJykpIHtcbiAgICAgICAgclR5cGUgPSBtZXJnZSh7fSwgclR5cGUpXG4gICAgICAgIHJUeXBlLmtpbmQgPVxuICAgICAgICAgIHJUeXBlLmtpbmQuc3Vic3RyaW5nKDAsIHJUeXBlLmtpbmQubGVuZ3RoIC0gOSkgKyAnRGVmaW5pdGlvbidcbiAgICAgIH1cblxuICAgICAgaWYgKCFsVHlwZSkge1xuICAgICAgICBsQVNULmRlZmluaXRpb25zLnB1c2goclR5cGUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAobFR5cGUua2luZCkge1xuICAgICAgY2FzZSAnRW51bVR5cGVEZWZpbml0aW9uJzpcbiAgICAgICAgY29tYmluZVR5cGVBbmRTdWJUeXBlKCdkaXJlY3RpdmVzJywgbFR5cGUsIHJUeXBlLCBjb25mbGljdFJlc29sdmVycylcbiAgICAgICAgY29tYmluZVR5cGVBbmRTdWJUeXBlKCd2YWx1ZXMnLCBsVHlwZSwgclR5cGUsIGNvbmZsaWN0UmVzb2x2ZXJzKVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICdVbmlvblR5cGVEZWZpbml0aW9uJzpcbiAgICAgICAgY29tYmluZVR5cGVBbmRTdWJUeXBlKCdkaXJlY3RpdmVzJywgbFR5cGUsIHJUeXBlLCBjb25mbGljdFJlc29sdmVycylcbiAgICAgICAgY29tYmluZVR5cGVBbmRTdWJUeXBlKCd0eXBlcycsIGxUeXBlLCByVHlwZSwgY29uZmxpY3RSZXNvbHZlcnMpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgJ1NjYWxhclR5cGVEZWZpbml0aW9uTm9kZSc6IHtcbiAgICAgICAgbGV0IGxTY2FsYXJcbiAgICAgICAgbGV0IGxTY2FsYXJDb25maWdcbiAgICAgICAgbGV0IHJTY2FsYXJcbiAgICAgICAgbGV0IHJTY2FsYXJDb25maWdcbiAgICAgICAgbGV0IHJlc29sdmVyXG5cbiAgICAgICAgY29tYmluZVR5cGVBbmRTdWJUeXBlKCdkaXJlY3RpdmVzJywgbFR5cGUsIHJUeXBlLCBjb25mbGljdFJlc29sdmVycylcblxuICAgICAgICBpZiAodGhpcy5zY2hlbWEpIHtcbiAgICAgICAgICBsU2NhbGFyID0gdGhpcy5zY2hlbWEuZ2V0VHlwZShsVHlwZS5uYW1lLnZhbHVlKVxuICAgICAgICAgIGxTY2FsYXJDb25maWcgPSAobFNjYWxhcj8uX3NjYWxhckNvbmZpZykgfHwgbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNvdXJjZS5zY2hlbWEpIHtcbiAgICAgICAgICByU2NhbGFyID0gc291cmNlLnNjaGVtYS5nZXRUeXBlKHJUeXBlLm5hbWUudmFsdWUpXG4gICAgICAgICAgclNjYWxhckNvbmZpZyA9IChyU2NhbGFyPy5fc2NhbGFyQ29uZmlnKSB8fCBudWxsXG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlciA9IChjb25mbGljdFJlc29sdmVycy5zY2FsYXJNZXJnZVJlc29sdmVyIHx8XG4gICAgICAgICAgICBEZWZhdWx0Q29uZmxpY3RSZXNvbHZlcnMuc2NhbGFyTWVyZ2VSZXNvbHZlcikoXG4gICAgICAgICAgbFR5cGUsXG4gICAgICAgICAgbFNjYWxhckNvbmZpZyxcbiAgICAgICAgICByVHlwZSxcbiAgICAgICAgICByU2NhbGFyQ29uZmlnXG4gICAgICAgIClcblxuICAgICAgICBpZiAocmVzb2x2ZXIpIHtcbiAgICAgICAgICBfc2NhbGFyRm5zW2xUeXBlLm5hbWUudmFsdWVdID0gX3NjYWxhckZuc1tsVHlwZS5uYW1lLnZhbHVlXSB8fCB7fVxuICAgICAgICAgIF9zY2FsYXJGbnNbbFR5cGUubmFtZS52YWx1ZV0gPSByZXNvbHZlclxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ09iamVjdFR5cGVEZWZpbml0aW9uJzpcbiAgICAgIGNhc2UgJ09iamVjdFR5cGVEZWZpbml0aW9uRXh0ZW5zaW9uJzpcbiAgICAgIGNhc2UgJ0ludGVyZmFjZVR5cGVEZWZpbml0aW9uJzpcbiAgICAgIGNhc2UgJ0ludGVyZmFjZVR5cGVEZWZpbml0aW9uRXh0ZW5zaW9uJzpcbiAgICAgIGNhc2UgJ0lucHV0T2JqZWN0VHlwZURlZmluaXRpb24nOlxuICAgICAgY2FzZSAnSW5wdXRPYmplY3RUeXBlRGVmaW5pdGlvbkV4dGVuc2lvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb21iaW5lVHlwZUFuZFN1YlR5cGUoJ2RpcmVjdGl2ZXMnLCBsVHlwZSwgclR5cGUsIGNvbmZsaWN0UmVzb2x2ZXJzKVxuICAgICAgICBjb21iaW5lVHlwZUFuZFN1YlR5cGUoJ2ZpZWxkcycsIGxUeXBlLCByVHlwZSwgY29uZmxpY3RSZXNvbHZlcnMpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG1lcmdlZCA9IFNjaGVtYXRhLmZyb20odGhpcy5jb25zdHJ1Y3Rvci5ncWwucHJpbnQobEFTVCkpXG5cbiAgICBpZiAoT2JqZWN0LmtleXMoX3NjYWxhckZucykubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCB0eXBlTmFtZSBvZiBPYmplY3Qua2V5cyhfc2NhbGFyRm5zKSkge1xuICAgICAgICBtZXJnZWQuc2NoZW1hLmdldFR5cGUodHlwZU5hbWUpLl9zY2FsYXJDb25maWcgPSBfc2NhbGFyQ29uZmlnW3R5cGVOYW1lXVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtZXJnZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJpbmcgZG93biBTY2hlbWF0YXMgY2FuIGJlIGhhbmR5IGZvciBjZXJ0YWluIHR5cGVzIG9mIHNjaGVtYSBzdGl0Y2hpbmcuXG4gICAqIFRoZSBTREwgcGFzc2VkIGluIGFuZCBhbnkgYXNzb2NpYXRlZCByZXNvbHZlcnMgd2lsbCBiZSByZW1vdmVkIGZyb21cbiAgICogYSBjb3B5IG9mIHRoZSBTREwgaW4gdGhpcyBTY2hlbWF0YSBpbnN0YW5jZSByZXByZXNlbnRzIGFuZCB0aGUgcmVzb2x2ZXJcbiAgICogbWFwIHBhc3NlZCBpbi5cbiAgICpcbiAgICogQHBhcmFtIHtTY2hlbWFTb3VyY2V9IHNjaGVtYUxhbmd1YWdlIGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhLCBhIHN0cmluZyBvZlxuICAgKiBTREwsIGEgU291cmNlIGluc3RhbmNlIG9mIFNETCwgYSBHcmFwaFFMU2NoZW1hIG9yIEFTVE5vZGUgdGhhdCBjYW4gYmVcbiAgICogcHJpbnRlZCBhcyBhbiBTREwgc3RyaW5nXG4gICAqIEBwYXJhbSB7UmVzb2x2ZXJNYXB9IHJlc29sdmVyTWFwIGFuIG9iamVjdCBjb250YWluaW5nIHJlc29sdmVyIGZ1bmN0aW9ucyxcbiAgICogZnJvbSBlaXRoZXIgdGhvc2Ugc2V0IG9uIHRoaXMgaW5zdGFuY2Ugb3IgdGhvc2UgaW4gdGhlIHJlc29sdmVyTWFwIGFkZGVkIGluXG4gICAqIEByZXR1cm4ge1NjaGVtYXRhfSBhIG5ldyBTY2hlbWF0YSBpbnN0YW5jZSB3aXRoIHRoZSBjaGFuZ2VkIHZhbHVlcyBzZXRcbiAgICogb24gaXRcbiAgICovXG4gIHBhcmVTREwoXG4gICAgc2NoZW1hTGFuZ3VhZ2UsXG4gICAgcmVzb2x2ZXJNYXAgPSBudWxsXG4gICkge1xuICAgIGxldCBzb3VyY2UgPSBub3JtYWxpemVTb3VyY2Uoc2NoZW1hTGFuZ3VhZ2UsIHRydWUpXG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihpbmxpbmVgXG4gICAgICAgIEluIHRoZSBjYWxsIHRvIHBhcmVTREwoc2NoZW1hTGFuZ3VhZ2UpLCB0aGUgc3VwcGxpZWQgdmFsdWUgZm9yXG4gICAgICAgIFxcYHNjaGVtYUxhbmd1YWdlXFxgIGNvdWxkIG5vdCBiZSBwYXJzZWQuXG4gICAgICBgKVxuICAgIH1cblxuICAgIGlmIChzY2hlbWFMYW5ndWFnZSBpbnN0YW5jZW9mIEdyYXBoUUxTY2hlbWEgJiYgIXJlc29sdmVyTWFwKSB7XG4gICAgICByZXNvbHZlck1hcCA9IHN0cmlwUmVzb2x2ZXJzRnJvbVNjaGVtYShzY2hlbWFMYW5ndWFnZSlcbiAgICB9XG5cbiAgICBsZXQgcmVzb2x2ZXJzID0gbWVyZ2Uoe30sIHJlc29sdmVyTWFwIHx8IHRoaXMucmVzb2x2ZXJzIHx8IHt9KVxuICAgIGxldCBsQVNUID0gdGhpcy5hc3RcbiAgICBsZXQgckFTVCA9IHNvdXJjZS5hc3RcblxuICAgIGZvciAobGV0IHJUeXBlIG9mIHJBU1QuZGVmaW5pdGlvbnMpIHtcbiAgICAgIGxldCBsVHlwZSA9IGxBU1QuZGVmaW5pdGlvbnMuZmluZChhID0+IGEubmFtZS52YWx1ZSA9PSByVHlwZS5uYW1lLnZhbHVlKVxuXG4gICAgICBpZiAoclR5cGU/LmtpbmQ/LmVuZHNXaXRoKCdFeHRlbnNpb24nKSkge1xuICAgICAgICBsZXQgbGVuID0gJ0V4dGVuc2lvbicubGVuZ3RoXG5cbiAgICAgICAgclR5cGUgPSBtZXJnZSh7fSwgclR5cGUpXG4gICAgICAgIHJUeXBlLmtpbmQgPVxuICAgICAgICAgIHJUeXBlLmtpbmQuc3Vic3RyaW5nKDAsIHJUeXBlLmtpbmQubGVuZ3RoIC0gbGVuKSArICdEZWZpbml0aW9uJ1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxUeXBlKSB7XG4gICAgICAgIGxBU1QuZGVmaW5pdGlvbnMucHVzaChyVHlwZSlcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChsVHlwZS5raW5kKSB7XG4gICAgICBjYXNlICdFbnVtVHlwZURlZmluaXRpb24nOlxuICAgICAgICBwYXJlVHlwZUFuZFN1YlR5cGUoJ2RpcmVjdGl2ZXMnLCBsVHlwZSwgclR5cGUsIHJlc29sdmVycylcbiAgICAgICAgcGFyZVR5cGVBbmRTdWJUeXBlKCd2YWx1ZXMnLCBsVHlwZSwgclR5cGUsIHJlc29sdmVycylcblxuICAgICAgICBpZiAoIWxUeXBlLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgaW5kZXggPSBsQVNULmRlZmluaXRpb25zLmluZGV4T2YobFR5cGUpXG5cbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBsQVNULmRlZmluaXRpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAnVW5pb25UeXBlRGVmaW5pdGlvbic6XG4gICAgICAgIHBhcmVUeXBlQW5kU3ViVHlwZSgnZGlyZWN0aXZlcycsIGxUeXBlLCByVHlwZSwgcmVzb2x2ZXJzKVxuICAgICAgICBwYXJlVHlwZUFuZFN1YlR5cGUoJ3R5cGVzJywgbFR5cGUsIHJUeXBlLCByZXNvbHZlcnMpXG5cbiAgICAgICAgaWYgKCFsVHlwZS50eXBlcy5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgaW5kZXggPSBsQVNULmRlZmluaXRpb25zLmluZGV4T2YobFR5cGUpXG5cbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBsQVNULmRlZmluaXRpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAnU2NhbGFyVHlwZURlZmluaXRpb25Ob2RlJzoge1xuICAgICAgICBsZXQgaW5kZXggPSBsQVNULmRlZmluaXRpb25zLmluZGV4T2YobFR5cGUpXG5cbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIGxBU1QuZGVmaW5pdGlvbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ09iamVjdFR5cGVEZWZpbml0aW9uJzpcbiAgICAgIGNhc2UgJ09iamVjdFR5cGVEZWZpbml0aW9uRXh0ZW5zaW9uJzpcbiAgICAgIGNhc2UgJ0ludGVyZmFjZVR5cGVEZWZpbml0aW9uJzpcbiAgICAgIGNhc2UgJ0ludGVyZmFjZVR5cGVEZWZpbml0aW9uRXh0ZW5zaW9uJzpcbiAgICAgIGNhc2UgJ0lucHV0T2JqZWN0VHlwZURlZmluaXRpb24nOlxuICAgICAgY2FzZSAnSW5wdXRPYmplY3RUeXBlRGVmaW5pdGlvbkV4dGVuc2lvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBwYXJlVHlwZUFuZFN1YlR5cGUoJ2RpcmVjdGl2ZXMnLCBsVHlwZSwgclR5cGUsIHJlc29sdmVycylcbiAgICAgICAgcGFyZVR5cGVBbmRTdWJUeXBlKCdmaWVsZHMnLCBsVHlwZSwgclR5cGUsIHJlc29sdmVycylcblxuICAgICAgICBpZiAoIWxUeXBlLmZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgaW5kZXggPSBsQVNULmRlZmluaXRpb25zLmluZGV4T2YobFR5cGUpXG5cbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBsQVNULmRlZmluaXRpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0gU2NoZW1hdGEuZnJvbSh0aGlzLmNvbnN0cnVjdG9yLmdxbC5wcmludChsQVNUKSwgcmVzb2x2ZXJzKVxuICAgIHJlc3VsdC4jZ2VuZXJhdGVTY2hlbWEoKVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIEEgbmV3IFNjaGVtYXRhIG9iamVjdCBpbnN0YW5jZSB3aXRoIG1lcmdlZCBzY2hlbWEgZGVmaW5pdGlvbnMgYXMgaXRzXG4gICAqIGNvbnRlbnRzIGFzIHdlbGwgYXMgbWVyZ2VkIHJlc29sdmVycyBhbmQgbmV3bHkgYm91bmQgZXhlY3V0YWJsZSBzY2hlbWEgYXJlXG4gICAqIGFsbCBjcmVhdGVkIGluIHRoaXMgc3RlcCBhbmQgcGFzc2VkIGJhY2suIFRoZSBvYmplY3QgaW5zdGFuY2UgaXRzZWxmIGlzXG4gICAqIG5vdCBtb2RpZmllZFxuICAgKlxuICAgKiBQb3N0IG1lcmdlLCB0aGUgcHJldmlvdXNseSBzdG9yZWQgYW5kIG1lcmdlZCByZXNvbHZlcnMgbWFwIGFyZSBhcmUgYXBwbGllZFxuICAgKiBhbmQgYSBuZXcgZXhlY3V0YWJsZSBzY2hlbWEgaXMgYnVpbHQgZnJvbSB0aGUgYXNoZXMgb2YgdGhlIG9sZC5cbiAgICpcbiAgICogQHBhcmFtIHtTY2hlbWFTb3VyY2V9IHNjaGVtYSBhbiBpbnN0YW5jZSBvZiBHcmFwaFFMU2NoZW1hIHRvIG1lcmdlXG4gICAqIEBwYXJhbSB7TWVyZ2VPcHRpb25zQ29uZmlnfSBjb25maWcgYW4gb2JqZWN0IGRlZmluaW5nIGhvdyBjb25mbGljdHMgc2hvdWxkXG4gICAqIGJlIHJlc29sdmVkLiBUaGlzIGRlZmF1bHRzIHRvIGBEZWZhdWx0TWVyZ2VPcHRpb25zYC5cbiAgICogQHJldHVybiB7U2NoZW1hdGF9IGEgbmV3IGluc3RhbmNlIG9mIFNjaGVtYXRhIHdpdGggYSBtZXJnZWQgc2NoZW1hIHN0cmluZyxcbiAgICogbWVyZ2VkIHJlc29sdmVyIG1hcCBhbmQgbmV3bHkgYm91bmQgZXhlY3V0YWJsZSBzY2hlbWEgYXR0YWNoZWQgYXJlIGFsbFxuICAgKiBpbml0aWF0ZWRcbiAgICovXG4gIG1lcmdlKFxuICAgIHNjaGVtYSxcbiAgICBjb25maWcgPSBEZWZhdWx0TWVyZ2VPcHRpb25zXG4gICkge1xuICAgIGlmICghc2NoZW1hKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoaW5saW5lYFxuICAgICAgICBJbiB0aGUgY2FsbCB0byBtZXJnZVNjaGVtYShzY2hlbWEpLCAke3NjaGVtYX0gd2FzIHJlY2VpdmVkIGFzIGEgdmFsdWVcbiAgICAgICAgYW5kIHRoZSBjb2RlIGNvdWxkIG5vdCBwcm9jZWVkIGJlY2F1c2Ugb2YgaXQuIFBsZWFzZSBjaGVjayB5b3VyIGNvZGVcbiAgICAgICAgYW5kIHRyeSBhZ2FpblxuICAgICAgYClcbiAgICB9XG5cbiAgICAvLyBTdGVwMDogRW5zdXJlIHdlIGhhdmUgYWxsIHRoZSBkZWZhdWx0cyBmb3IgY29uZmlnIGFuZCBzY2hlbWFcbiAgICBzY2hlbWEgPSBub3JtYWxpemVTb3VyY2Uoc2NoZW1hLCB0cnVlKVxuXG4gICAgaWYgKGNvbmZpZyAhPT0gRGVmYXVsdE1lcmdlT3B0aW9ucykge1xuICAgICAgbGV0IG1lcmdlZENvbmZpZyA9IG1lcmdlKHt9LCBEZWZhdWx0TWVyZ2VPcHRpb25zKVxuICAgICAgY29uZmlnID0gbWVyZ2UobWVyZ2VkQ29uZmlnLCBjb25maWcpXG4gICAgfVxuXG4gICAgLy8gU3RlcDE6IE1lcmdlIFNETDsgcXVpdCBhdCB0aGlzIHBvaW50IGlmIHRoZXJlIGFyZSBubyByZXNvbHZlcnNcbiAgICBsZXQgbGVmdCA9IFNjaGVtYXRhLmZyb20odGhpcywgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGxldCByaWdodCA9IFNjaGVtYXRhLmZyb20oc2NoZW1hLCB1bmRlZmluZWQsIHRydWUpXG4gICAgbGV0IG1lcmdlZCA9IGxlZnQubWVyZ2VTREwocmlnaHQsIGNvbmZpZy5jb25mbGljdFJlc29sdmVycylcblxuICAgIC8vIElmIG5laXRoZXIgc2NoZW1hdGEgaW5zdGFuY2UgaGFzIGEgcmVzb2x2ZXIsIHRoZXJlIGlzIG5vIHJlYXNvblxuICAgIC8vIHRvIGNvbnRpbnVlLiBSZXR1cm4gdGhlIG1lcmdlZCBzY2hlbWFzIGFuZCBjYWxsIGl0IGEgZGF5LlxuICAgIGlmIChcbiAgICAgICghbGVmdC5yZXNvbHZlcnMgfHwgIU9iamVjdC5rZXlzKGxlZnQucmVzb2x2ZXJzKS5sZW5ndGgpICYmXG4gICAgICAoIXJpZ2h0LnJlc29sdmVycyB8fCAhT2JqZWN0LmtleXMocmlnaHQucmVzb2x2ZXJzKS5sZW5ndGgpXG4gICAgKSB7XG4gICAgICByZXR1cm4gbWVyZ2VkXG4gICAgfVxuXG4gICAgLy8gU3RlcDI6IEJhY2t1cCByZXNvbHZlcnMgZnJvbSBsZWZ0LCByaWdodCwgb3IgYm90aFxuICAgIGxldCBwcmV2TWFwcyA9IChsZWZ0LnByZXZSZXNvbHZlck1hcHMgfHwgW10pLmNvbmNhdChcbiAgICAgIHJpZ2h0LnByZXZSZXNvbHZlck1hcHMgfHwgW10sXG4gICAgICBFeHRlbmRlZFJlc29sdmVyTWFwLmZyb20obGVmdCksXG4gICAgICBFeHRlbmRlZFJlc29sdmVyTWFwLmZyb20ocmlnaHQpXG4gICAgKVxuICAgIG1lcmdlZC5wcmV2UmVzb2x2ZXJNYXBzID0gcHJldk1hcHNcblxuICAgIC8vIFN0ZXAzOiBNZXJnZSByZXNvbHZlcnNcbiAgICBsZXQgbWVyZ2VSZXNvbHZlcnMgPSB7fVxuXG4gICAgaWYgKHByZXZNYXBzPy5sZW5ndGgpIHtcbiAgICAgIG1lcmdlUmVzb2x2ZXJzID0gcHJldk1hcHMucmVkdWNlKChwLCBjLCBpLCBhKSA9PiB7XG4gICAgICAgIHJldHVybiBtZXJnZShwLCBjLnJlc29sdmVycyB8fCB7fSlcbiAgICAgIH0sIHt9KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1lcmdlKG1lcmdlUmVzb2x2ZXJzLCBsZWZ0LnJlc29sdmVycylcbiAgICAgIG1lcmdlKG1lcmdlUmVzb2x2ZXJzLCByaWdodC5yZXNvbHZlcnMpXG4gICAgfVxuICAgIG1lcmdlZC5yZXNvbHZlcnMgPSBtZXJnZVJlc29sdmVyc1xuXG4gICAgLy8gU3RlcCA0OiBUcmlnZ2VyIGEgbmV3IHNjaGVtYSBjcmVhdGlvblxuICAgIGlmIChjb25maWcuY3JlYXRlTWlzc2luZ1Jlc29sdmVycykge1xuICAgICAgbWVyZ2VkLnJlc29sdmVycyA9IG1lcmdlZC5idWlsZFJlc29sdmVyRm9yRWFjaEZpZWxkKClcbiAgICB9XG4gICAgbWVyZ2VkLmNsZWFyU2NoZW1hKClcbiAgICBtZXJnZWQuI2dlbmVyYXRlU2NoZW1hKClcblxuICAgIC8vIFN0ZXA1OiBXcmFwIHJlc29sdmVyc1xuICAgIGlmIChjb25maWcuaW5qZWN0TWVyZ2VkU2NoZW1hKSB7XG4gICAgICBtZXJnZWQuZm9yRWFjaEZpZWxkKFxuICAgICAgICAoXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICB0eXBlRGlyZWN0aXZlcyxcbiAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICBmaWVsZE5hbWUsXG4gICAgICAgICAgZmllbGRBcmdzLFxuICAgICAgICAgIGZpZWxkRGlyZWN0aXZlcyxcbiAgICAgICAgICBzY2hlbWEsXG4gICAgICAgICAgY29udGV4dFxuICAgICAgICApID0+IHtcbiAgICAgICAgICBpZiAoZmllbGQucmVzb2x2ZSkge1xuICAgICAgICAgICAgZmllbGQucmVzb2x2ZSA9IEV4dGVuZGVkUmVzb2x2ZXIuU2NoZW1hSW5qZWN0b3IoXG4gICAgICAgICAgICAgIGZpZWxkLnJlc29sdmUsXG4gICAgICAgICAgICAgIG1lcmdlZC5zY2hlbWFcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKCFtZXJnZWQucmVzb2x2ZXJzW3R5cGVOYW1lXSkge1xuICAgICAgICAgICAgICBtZXJnZWQucmVzb2x2ZXJzW3R5cGVOYW1lXSA9IHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1lcmdlZC5yZXNvbHZlcnNbdHlwZU5hbWVdW2ZpZWxkTmFtZV0gPSBmaWVsZC5yZXNvbHZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG5cbiAgICAgIC8vIERvIHRoaXMgb25jZSBtb3JlIHRvIGVuc3VyZSB3ZSBhcmUgdXNpbmcgdGhlIG1vZGlmaWVkIHJlc29sdmVyc1xuICAgICAgbWVyZ2VkLmNsZWFyU2NoZW1hKClcbiAgICAgIG1lcmdlZC4jZ2VuZXJhdGVTY2hlbWEoKVxuICAgIH1cblxuICAgIC8vIFN0ZXA2OiBSZXR1cm4gZmluYWwgbWVyZ2VkIHByb2R1Y3RcbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgZm9yIHRoZSBtZXJnZSgpIGZ1bmN0aW9uOyBtZXJnZVNETCBzdGlsbCBleGlzdHMgYXMgYW4gZW50aXR5IG9mXG4gICAqIGl0c2VsZiwgYnV0IG1lcmdlKCkgd2lsbCBpbnZva2UgdGhhdCBmdW5jdGlvbiBhcyBuZWVkZWQgdG8gZG8gaXRzIGpvYiBhbmRcbiAgICogaWYgdGhlcmUgYXJlbid0IGFueSByZXNvbHZlcnMgdG8gY29uc2lkZXIsIHRoZSBmdW5jdGlvbnMgYWN0IGlkZW50aWNhbGx5LlxuICAgKlxuICAgKiBAc2VlIG1lcmdlXG4gICAqXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYSB8IFNjaGVtYXRhfSBzY2hlbWEgYW4gaW5zdGFuY2Ugb2YgR3JhcGhRTFNjaGVtYSB0b1xuICAgKiBtZXJnZS4gQ2FuIGJlIGVpdGhlciBhIEdyYXBoUUxTY2hlbWEgb3IgYSBTY2hlbWF0YSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01lcmdlT3B0aW9uc0NvbmZpZ30gY29uZmlnIGFuIG9iamVjdCBkZWZpbmluZyBob3cgY29uZmxpY3RzIHNob3VsZFxuICAgKiBiZSByZXNvbHZlZC4gVGhpcyBkZWZhdWx0cyB0byBgRGVmYXVsdE1lcmdlT3B0aW9uc2AuXG4gICAqIEByZXR1cm4ge1NjaGVtYXRhfSBhIG5ldyBpbnN0YW5jZSBvZiBTY2hlbWF0YSB3aXRoIGEgbWVyZ2VkIHNjaGVtYSBzdHJpbmcsXG4gICAqIG1lcmdlZCByZXNvbHZlciBtYXAgYW5kIG5ld2x5IGJvdW5kIGV4ZWN1dGFibGUgc2NoZW1hIGF0dGFjaGVkIGFyZSBhbGxcbiAgICogaW5pdGlhdGVkXG4gICAqL1xuICBtZXJnZVNjaGVtYShcbiAgICBzY2hlbWEsXG4gICAgY29uZmlnID0gRGVmYXVsdE1lcmdlT3B0aW9uc1xuICApIHtcbiAgICByZXR1cm4gdGhpcy5tZXJnZShzY2hlbWEsIGNvbmZpZylcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIHNjaGVtYSwgYmFzZWQgb24gdGhlIFNjaGVtYXRhIHRoaXMgb2JqZWN0IGlzIGJhc2VkIG9uLCB3YWxrIGl0IGFuZFxuICAgKiBidWlsZCB1cCBhIHJlc29sdmVyIG1hcC4gVGhpcyBmdW5jdGlvbiB3aWxsIGFsd2F5cyByZXR1cm4gYSBub24tbnVsbFxuICAgKiBvYmplY3QuIEl0IHdpbGwgYmUgZW1wdHkgaWYgdGhlcmUgYXJlIGVpdGhlciBubyByZXNvbHZlcnMgdG8gYmUgZm91bmRcbiAgICogaW4gdGhlIHNjaGVtYSBvciBpZiBhIHZhbGlkIHNjaGVtYSBjYW5ub3QgYmUgY3JlYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufFJlc29sdmVyTWFwfSBmbGF0dGVuUm9vdFJlc29sdmVyc09yRmlyc3RQYXJhbSBpZiB0aGlzXG4gICAqIHZhbHVlIGlzIGJvb2xlYW4sIGFuZCBpZiB0aGlzIHZhbHVlIGlzIHRydWUsIHRoZSByZXNvbHZlcnMgZnJvbSBRdWVyeSxcbiAgICogTXV0YXRpb24gYW5kIFN1YnNjcmlwdGlvbiB0eXBlcyB3aWxsIGJlIGZsYXR0ZW5lZCB0byB0aGUgcm9vdCBvZiB0aGVcbiAgICogb2JqZWN0LiBJZiB0aGUgZmlyc3QgcGFyYW1ldHIgaXMgYW4gT2JqZWN0LCBpdCB3aWxsIGJlIG1lcmdlZCBpbiBub3JtYWxseVxuICAgKiB3aXRoIG1lcmdlLlxuICAgKiBAcGFyYW0ge1Jlc29sdmVyTWFwW119IGV4dGVuZFdpdGggYW4gdW5saW1pdGVkIGFycmF5IG9mIG9iamVjdHNcbiAgICogdGhhdCBjYW4gYmUgdXNlZCB0byBleHRlbmQgdGhlIGJ1aWx0IHJlc29sdmVyIG1hcC5cbiAgICogQHJldHVybiB7UmVzb2x2ZXJNYXB9IGEgcmVzb2x2ZXIgbWFwOyBpLmUuIGFuIG9iamVjdCBvZiByZXNvbHZlciBmdW5jdGlvbnNcbiAgICovXG4gIGJ1aWxkUmVzb2x2ZXJzKGZsYXR0ZW5Sb290UmVzb2x2ZXJzT3JGaXJzdFBhcmFtLCAuLi5leHRlbmRXaXRoKSB7XG4gICAgbGV0IHNjaGVtYXRhID0gU2NoZW1hdGEuZnJvbSh0aGlzLnNkbCwgdGhpcy5yZXNvbHZlcnMpXG4gICAgbGV0IHJlc29sdmVycyA9IG1lcmdlKHt9LFxuICAgICAgc3RyaXBSZXNvbHZlcnNGcm9tU2NoZW1hKHNjaGVtYXRhLnNjaGVtYSkgfHwgc2NoZW1hdGEucmVzb2x2ZXJzIHx8IHt9XG4gICAgKVxuXG4gICAgLy8gTmV4dCBjaGVjayB0byBzZWUgaWYgd2UgYXJlIGZsYXR0ZW5pbmcgb3Igc2ltcGx5IGV4dGVuZGluZ1xuICAgIGlmICh0eXBlb2YgZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0gPT09ICdib29sZWFuJykge1xuICAgICAgZm9yIChsZXQgcm9vdFR5cGUgb2YgWydRdWVyeScsICdNdXRhdGlvbicsICdTdWJzY3JpcHRpb24nXSkge1xuICAgICAgICBpZiAoZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0pIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZXJzW3Jvb3RUeXBlXSkge1xuICAgICAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgT2JqZWN0LmtleXMocmVzb2x2ZXJzW3Jvb3RUeXBlXSkpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZXJzW2ZpZWxkXSA9IHJlc29sdmVyc1tyb290VHlwZV1bZmllbGRdXG4gICAgICAgICAgICAgIGRlbGV0ZSByZXNvbHZlcnNbcm9vdFR5cGVdW2ZpZWxkXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWxldGUgcmVzb2x2ZXJzW3Jvb3RUeXBlXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBPYmplY3Qua2V5cyhyZXNvbHZlcnMpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBkZWJ1Z19sb2coJ1tidWlsZFJlc29sdmVycygpXSBmaW5kaW5nIGZpZWxkIGluIHNjaGVtYScpXG4gICAgICAgICAgICAgIGlmIChzY2hlbWF0YS5zY2hlbWFGaWVsZEJ5TmFtZShyb290VHlwZSwgZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJzW3Jvb3RUeXBlXSA9IHJlc29sdmVyc1tyb290VHlwZV0gfHwge31cbiAgICAgICAgICAgICAgICByZXNvbHZlcnNbcm9vdFR5cGVdW2ZpZWxkXSA9IHJlc29sdmVyc1tmaWVsZF1cbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzb2x2ZXJzW2ZpZWxkXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZGVidWdfbG9nKGRlZGVudGBcbiAgICAgICAgICAgICAgICBbYnVpbGRSZXNvbHZlcnMoKV0gRmFsbGluZyBiYWNrIHRvIFxcYGFzdEZpZWxkQnlOYW1lKClcXGBcbiAgICAgICAgICAgICAgICAgIHJvb3RUeXBlICAlT1xuICAgICAgICAgICAgICAgICAgZmllbGQgICAgICVPXG4gICAgICAgICAgICAgICAgICByZXNvbHZlcnMgJU9cbiAgICAgICAgICAgICAgYCwgcm9vdFR5cGUsIGZpZWxkLCByZXNvbHZlcnMpXG4gICAgICAgICAgICAgIGRlYnVnX3RyYWNlKGRlZGVudGBcbiAgICAgICAgICAgICAgICBbYnVpbGRSZXNvbHZlcnMoKV0gRmFsbGluZyBiYWNrIHRvIFxcYGFzdEZpZWxkQnlOYW1lKClcXGAgZHVlIHRvXG4gICAgICAgICAgICAgICAgICByb290VHlwZSAgJU9cbiAgICAgICAgICAgICAgICAgIGZpZWxkICAgICAlT1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZXJzICVPXG4gICAgICAgICAgICAgICAgICBlcnJvciAgICAgJU9cbiAgICAgICAgICAgICAgYCxcbiAgICAgICAgICAgICAgICByb290VHlwZSxcbiAgICAgICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICAgICByZXNvbHZlcnMsXG4gICAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgIGlmIChzY2hlbWF0YS5hc3RGaWVsZEJ5TmFtZShyb290VHlwZSwgZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJzW3Jvb3RUeXBlXSA9IHJlc29sdmVyc1tyb290VHlwZV0gfHwge31cbiAgICAgICAgICAgICAgICByZXNvbHZlcnNbcm9vdFR5cGVdW2ZpZWxkXSA9IHJlc29sdmVyc1tmaWVsZF1cbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzb2x2ZXJzW2ZpZWxkXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVzb2x2ZXJzID0gbWVyZ2UocmVzb2x2ZXJzIHx8IHt9LCBmbGF0dGVuUm9vdFJlc29sdmVyc09yRmlyc3RQYXJhbSB8fCB7fSlcbiAgICB9XG5cbiAgICAvLyBGaW5hbGx5IGV4dGVuZCB3aXRoIGFueSByZW1haW5pbmcgYXJndW1lbnRzXG4gICAgaWYgKGV4dGVuZFdpdGgubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGV4dGVuZFdpdGgpIHtcbiAgICAgICAgcmVzb2x2ZXJzID0gbWVyZ2UocmVzb2x2ZXJzIHx8IHt9LCBpdGVtIHx8IHt9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXNvbHZlcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBGcm9tIHRpbWUgdG8gdGltZSBpdCBtYWtlcyBtb3JlIHNlbnNlIHRvIHdyYXAgZXZlcnkgcG9zc2libGUgcmVzb2x2ZXJcbiAgICogbWFwcGluZyBpbiBnaXZlbiBzY2hlbWEuIEdldHRpbmcgYSBoYW5kbGUgdG8gZWFjaCBmaWVsZHMgcmVzb2x2ZXIgYW5kXG4gICAqIG9yIHN1YnN0aXR1dGluZyBtaXNzaW5nIG9uZXMgd2l0aCBHcmFwaFFMJ3MgZGVmYXVsdEZpZWxkUmVzb2x2ZXIgY2FuXG4gICAqIGJlIGEgdGlyZXNvbWUgYWZmYWlyLiBUaGlzIG1ldGhvZCB3YWxrcyB0aGUgc2NoZW1hIGZvciB5b3UgYW5kIHJldHVybnNcbiAgICogYW55IHByZXZpb3VzbHkgZGVmaW5lZCByZXNvbHZlcnMgYWxvbmdzaWRlIGRlZmF1bHRGaWVsZFJlc29sdmVycyBmb3JcbiAgICogZWFjaCBwb3NzaWJsZSBmaWVsZCBvZiBldmVyeSB0eXBlIGluIHRoZSBzY2hlbWEuXG4gICAqXG4gICAqIElmIGEgc2NoZW1hIGNhbm5vdCBiZSBnZW5lcmF0ZWQgZnJvbSB0aGUgU0RMIHJlcHJlc2VudGVkIGJ5IHRoZSBpbnN0YW5jZVxuICAgKiBvZiBTY2hlbWF0YSwgdGhlbiBhbiBlcnJvciBpcyB0aHJvd24uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbnxSZXNvbHZlck1hcH0gZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0gaWYgdGhpc1xuICAgKiB2YWx1ZSBpcyBib29sZWFuLCBhbmQgaWYgdGhpcyB2YWx1ZSBpcyB0cnVlLCB0aGUgcmVzb2x2ZXJzIGZyb20gUXVlcnksXG4gICAqIE11dGF0aW9uIGFuZCBTdWJzY3JpcHRpb24gdHlwZXMgd2lsbCBiZSBmbGF0dGVuZWQgdG8gdGhlIHJvb3Qgb2YgdGhlXG4gICAqIG9iamVjdC4gSWYgdGhlIGZpcnN0IHBhcmFtZXRyIGlzIGFuIFJlc29sdmVyTWFwLCBpdCB3aWxsIGJlIG1lcmdlZCBpblxuICAgKiBub3JtYWxseSB3aXRoIG1lcmdlLlxuICAgKiBAcGFyYW0ge1Jlc29sdmVyTWFwW119IGV4dGVuZFdpdGggYW4gdW5saW1pdGVkIGFycmF5IG9mIG9iamVjdHNcbiAgICogdGhhdCBjYW4gYmUgdXNlZCB0byBleHRlbmQgdGhlIGJ1aWx0IHJlc29sdmVyIG1hcC5cbiAgICogQHJldHVybiB7UmVzb2x2ZXJNYXB9IGEgcmVzb2x2ZXIgbWFwOyBpLmUuIGFuIG9iamVjdCBvZiByZXNvbHZlciBmdW5jdGlvbnNcbiAgICovXG4gIGJ1aWxkUmVzb2x2ZXJGb3JFYWNoRmllbGQoZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0sIC4uLmV4dGVuZFdpdGgpIHtcbiAgICBpZiAoIXRoaXMuc2NoZW1hKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoaW5saW5lYFxuICAgICAgICBidWlsZFJlc29sdmVyRm9yRWFjaEZpZWxkKCkgY2Fubm90IGJlIGNhbGxlZCB1bmxlc3MgdGhlcmUgaXMgZW5vdWdoXG4gICAgICAgIHZhbGlkIFNETCBpbiB0aGUgaW5zdGFuY2UgdG8gY29uc3RydWN0IGEgc2NoZW1hLiBQbGVhc2UgY2hlY2sgeW91clxuICAgICAgICBjb2RlIVxuICAgICAgYClcbiAgICB9XG5cbiAgICBsZXQgaW50ZXJpbSA9IFNjaGVtYXRhLmZyb20odGhpcy5zZGwsIHRoaXMucmVzb2x2ZXJzKVxuICAgIGxldCByID0ge31cblxuICAgIGludGVyaW0uZm9yRWFjaEZpZWxkKFxuICAgICAgKFxuICAgICAgICB0eXBlLFxuICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgdHlwZURpcmVjdGl2ZXMsXG4gICAgICAgIGZpZWxkLFxuICAgICAgICBmaWVsZE5hbWUsXG4gICAgICAgIGZpZWxkQXJncyxcbiAgICAgICAgZmllbGREaXJlY3RpdmVzLFxuICAgICAgICBzY2hlbWEsXG4gICAgICAgIGNvbnRleHRcbiAgICAgICkgPT4ge1xuICAgICAgICAvLyBFbnN1cmUgdGhlIHBhdGggdG8gdGhlIHR5cGUgaW4gcXVlc3Rpb24gZXhpc3RzIGJlZm9yZSBjb250aW51aW5nXG4gICAgICAgIC8vIG9ud2FyZFxuICAgICAgICAoclt0eXBlTmFtZV0gPSByW3R5cGVOYW1lXSB8fCB7fSlbZmllbGROYW1lXSA9XG4gICAgICAgICAgKHJbdHlwZU5hbWVdW2ZpZWxkTmFtZV0gfHwge30pXG5cbiAgICAgICAgclt0eXBlTmFtZV1bZmllbGROYW1lXSA9IGZpZWxkLnJlc29sdmUgfHwgZGVmYXVsdEZpZWxkUmVzb2x2ZXJcbiAgICAgIH1cbiAgICApXG5cbiAgICBpbnRlcmltLnJlc29sdmVycyA9IHJcblxuICAgIHJldHVybiBpbnRlcmltLmJ1aWxkUmVzb2x2ZXJzKFxuICAgICAgZmxhdHRlblJvb3RSZXNvbHZlcnNPckZpcnN0UGFyYW0sXG4gICAgICAuLi5leHRlbmRXaXRoXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRvIGRldGVybWluZSBpZiBhbiBleGVjdXRhYmxlIHNjaGVtYSBpcyBhdHRhY2hlZCB0byB0aGlzIFNjaGVtYXRhXG4gICAqIGluc3RhbmNlLiBJdCBkb2VzIHNvIGJ5IHdhbGtpbmcgdGhlIHNjaGVtYSBmaWVsZHMgdmlhIGBidWlsZFJlc29sdmVycygpYFxuICAgKiBhbmQgcmVwb3J0aW5nIHdoZXRoZXIgdGhlcmUgaXMgYW55dGhpbmcgaW5zaWRlIHRoZSByZXN1bHRzIG9yIG5vdC5cbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgaGFzQW5FeGVjdXRhYmxlU2NoZW1hKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmJ1aWxkUmVzb2x2ZXJzKCkpLmxlbmd0aCA+IDBcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgYC5zZGxgIHByb3BlcnR5IGlzIHZhbGlkIFNETC9JREwgYW5kIGNhbiBnZW5lcmF0ZSB2YWxpZCBBU1Qgbm9kZXNcbiAgICogdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0cnVlLiBJdCB3aWxsIHJldHVybiBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IHZhbGlkU0RMKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yLmdxbC5wYXJzZSh0aGlzLnNkbClcbiAgICAgIGRlYnVnX2xvZygnW2dldCAudmFsaWRTRExdIHRydWUnKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnX2xvZygnW2dldCAudmFsaWRTRExdIGZhbHNlJylcbiAgICAgIGRlYnVnX3RyYWNlKCdbZ2V0IC52YWxpZFNETF0gJywgZSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgYC5zY2hlbWFgIHByb3BlcnR5IGlzIHZhbGlkIFNETC9JREwgYW5kIGNhbiBnZW5lcmF0ZSBhIHZhbGlkXG4gICAqIEdyYXBoUUxTY2hlbWEsIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdHJ1ZS4gSXQgd2lsbCByZXR1cm4gZmFsc2VcbiAgICogb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCB2YWxpZFNjaGVtYSgpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy4jZ2VuZXJhdGVTY2hlbWEoKVxuICAgICAgZGVidWdfbG9nKCdbZ2V0IC52YWxpZFNjaGVtYV0gdHJ1ZScpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgZGVidWdfbG9nKCdbZ2V0IC52YWxpZFNjaGVtYV0gZmFsc2UnKVxuICAgICAgZGVidWdfdHJhY2UoJ1tnZXQgLnZhbGlkU2NoZW1hXSAnLCBlKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3RyaW5nIHVuZGVybHlpbmcgdGhpcyBpbnN0YW5jZSByZXByZXNlbnRzIHZhbGlkIFNETFxuICAgKiB0aGF0IGNhbiBiZSBib3RoIGNvbnZlcnRlZCB0byBBU1Qgbm9kZXMgb3IgYSB2YWxpZCBHcmFwaFFMU2NoZW1hIGluc3RhbmNlXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IHZhbGlkKCkge1xuICAgIHJldHVybiB0aGlzLnZhbGlkU0RMICYmIHRoaXMudmFsaWRTY2hlbWFcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgaW50ZXJuYWwgcmVzb2x2ZXJzIG9iamVjdCBuZWVkcyB0byBiZSBjaGFuZ2VkIGFmdGVyIGNyZWF0aW9uLCB0aGlzXG4gICAqIG1ldGhvZCBhbGxvd3MgYSB3YXkgdG8gZG8gc28uIFNldHRpbmcgdGhlIHZhbHVlIHRvIGBudWxsYCBpcyBlcXVpdmFsZW50XG4gICAqIHRvIHJlbW92aW5nIGFueSBzdG9yZWQgdmFsdWUuIEZpbmFsbHkgdGhlIGNvbnRlbnRzIGFyZSBzdG9yZWQgaW4gYSB3ZWFrXG4gICAqIG1hcCBzbyBpdHMgY29udGVudHMgYXJlIG5vdCBndWFyYW50ZWVkIG92ZXIgYSBsb25nIHBlcmlvZCBvZiB0aW1lLlxuICAgKlxuICAgKiBAdHlwZSB7UmVzb2x2ZXJNYXB9XG4gICAqL1xuICBzZXQgcmVzb2x2ZXJzKHJlc29sdmVycykge1xuICAgIHRoaXNbTUFQXS5zZXQod21rUmVzb2x2ZXJzLCByZXNvbHZlcnMpXG4gICAgdGhpcy5jbGVhclNjaGVtYSgpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgcmVzb2x2ZXIgbWFwIGFzc29jaWF0ZWQgd2l0aCB0aGlzIFNjaGVtYXRhIGluc3RhbmNlXG4gICAqL1xuICBjbGVhclJlc29sdmVycygpIHtcbiAgICB0aGlzLnJlc29sdmVycyA9IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBzY2hlbWEgc3RvcmVkIHdpdGggdGhpcyBTY2hlbWF0YSBpbnN0YW5jZVxuICAgKi9cbiAgY2xlYXJTY2hlbWEoKSB7XG4gICAgdGhpcy5zY2hlbWEgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdW5kZXJseWluZyBzdHJpbmcgcGFzc2VkIG9yIGdlbmVyYXRlZCBpbiB0aGUgY29uc3RydWN0b3Igd2hlblxuICAgKiBpbnNwZWN0ZWQgaW4gdGhlIG5vZGVKUyBSRVBMLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHJldHVybnMgdGhlIHVuZGVybHlpbmcgU0RML0lETCBzdHJpbmcgdGhpcyBTY2hlbWF0YVxuICAgKiBpbnN0YW5jZSBpcyBiYXNlZCBvbi5cbiAgICovXG4gIFtVdGlsLmluc3BlY3QuY3VzdG9tXSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZGxcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2FtZSBhcyBgaW5zcGVjdCgpYCwgYHRvU3RyaW5nKClgLCBhbmQgYHZhbHVlT2YoKWAuIFRoaXMgbWV0aG9kXG4gICAqIHJldHVybnMgdGhlIHVuZGVybHlpbmcgc3RyaW5nIHRoaXMgY2xhc3MgaW5zdGFuY2Ugd2FzIGNyZWF0ZWQgb24uXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gcmV0dXJucyB0aGUgdW5kZXJseWluZyBTREwvSURMIHN0cmluZyB0aGlzIFNjaGVtYXRhXG4gICAqIGluc3RhbmNlIGlzIGJhc2VkIG9uLlxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2RsXG4gIH1cblxuICAvKipcbiAgICogVGhlIHNhbWUgYXMgYGluc3BlY3QoKWAsIGB0b1N0cmluZygpYCwgYW5kIGB2YWx1ZU9mKClgLiBUaGlzIG1ldGhvZFxuICAgKiByZXR1cm5zIHRoZSB1bmRlcmx5aW5nIHN0cmluZyB0aGlzIGNsYXNzIGluc3RhbmNlIHdhcyBjcmVhdGVkIG9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHJldHVybnMgdGhlIHVuZGVybHlpbmcgU0RML0lETCBzdHJpbmcgdGhpcyBTY2hlbWF0YVxuICAgKiBpbnN0YW5jZSBpcyBiYXNlZCBvbi5cbiAgICovXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2RsXG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciB0aGUgdmFsdWVzIGNvbnRhaW5lZCBpbiBhIFNjaGVtYSdzIHR5cGVNYXAuIElmIGEgZGVzaXJlZFxuICAgKiB2YWx1ZSBpcyBlbmNvdW50ZXJlZCwgdGhlIHN1cHBsaWVkIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZC4gVGhlIHZhbHVlcyBhcmVcbiAgICogdGhlIGNvbnN0YW50cyBBTEwsIFRZUEVTLCBJTlRFUkZBQ0VTLCBFTlVNUywgVU5JT05TIGFuZCBTQ0FMQVJTLiBPcHRpb25hbGx5XG4gICAqIEhJRERFTiBpcyBhbm90aGVyIHZhbHVlIHRoYXQgY2FuIGJlIGJpdG1hc2tlZCB0b2dldGhlciBmb3IgYSB2YXJpZWQgcmVzdWx0LlxuICAgKiBISURERU4gZXhwb3NlcyB0aGUgdmFsdWVzIGluIHRoZSBzY2hlbWEgdHlwZW1hcCB0aGF0IGJlZ2luIHdpdGggYSBkb3VibGVcbiAgICogdW5kZXJzY29yZS5cbiAgICpcbiAgICogVGhlIHNpZ25hdHVyZSBmb3IgdGhlIGZ1bmN0aW9uIGNhbGxiYWNrIGlzIGFzIGZvbGxvd3M6XG4gICAqIChcbiAgICogICB0eXBlOiB1bmtub3duLFxuICAgKiAgIHR5cGVOYW1lOiBzdHJpbmcsXG4gICAqICAgdHlwZURpcmVjdGl2ZXM6IEFycmF5PEdyYXBoUUxEaXJlY3RpdmU+XG4gICAqICAgc2NoZW1hOiBHcmFwaFFMU2NoZW1hLFxuICAgKiAgIGNvbnRleHQ6IHVua25vd24sXG4gICAqICkgPT4gdm9pZFxuICAgKlxuICAgKiBXaGVyZTpcbiAgICogICBgdHlwZWAgICAgICAgICAgIC0gdGhlIG9iamVjdCBpbnN0YW5jZSBmcm9tIHdpdGhpbiB0aGUgYEdyYXBoUUxTY2hlbWFgXG4gICAqICAgYHR5cGVOYW1lYCAgICAgICAtIHRoZSBuYW1lIG9mIHRoZSBvYmplY3Q7IFwiUXVlcnlcIiBmb3IgdHlwZSBRdWVyeSBhbmRcbiAgICogICAgICAgICAgICAgICAgICAgICAgc28gb24uXG4gICAqICAgYHR5cGVEaXJlY3RpdmVzYCAtIGFuIGFycmF5IG9mIGRpcmVjdGl2ZXMgYXBwbGllZCB0byB0aGUgb2JqZWN0IG9yIGFuXG4gICAqICAgICAgICAgICAgICAgICAgICAgIGVtcHR5IGFycmF5IGlmIHRoZXJlIGFyZSBub25lIGFwcGxpZWQuXG4gICAqICAgYHNjaGVtYWAgICAgICAgICAtIGFuIGluc3RhbmNlIG9mIGBHcmFwaFFMU2NoZW1hYCBvdmVyIHdoaWNoIHRvIGl0ZXJhdGVcbiAgICogICBgY29udGV4dGAgICAgICAgIC0gdXN1YWxseSBhbiBvYmplY3QsIGFuZCB1c3VhbGx5IHRoZSBzYW1lIG9iamVjdCxcbiAgICogICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIHRvIHRoZSBjYWxsIHRvIGBtYWtlRXhlY3V0YWJsZVNjaGVtYSgpYFxuICAgKiAgICAgICAgICAgICAgICAgICAgICBvciBgZ3JhcGhxbCgpYFxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hPZlJlc29sdmVyfSBmbiBhIGZ1bmN0aW9uIHdpdGggYSBzaWduYXR1cmUgZGVmaW5lZCBhYm92ZVxuICAgKiBAcGFyYW0ge3Vua25vd259IGNvbnRleHQgdXN1YWxseSBhbiBvYmplY3QgYnV0IGFueSBtaXhlZCB2YWx1ZSB0aGUgZGVub3Rlc1xuICAgKiBzb21lIHNoYXJlZCBjb250ZXh0IGFzIGlzIHVzZWQgd2l0aCB0aGUgc2NoZW1hIGR1cmluZyBub3JtYWwgcnVudGltZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGVzIGEgYml0bWFzayBvZiBvbmUgb3IgbW9yZSBvZiB0aGUgY29uc3RhbnRzIGRlZmluZWRcbiAgICogYWJvdmUuIFRoZXNlIGNhbiBiZSBPUidlZCB0b2dldGhlciBhbmQgZGVmYXVsdCB0byBUWVBFUy5cbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hP30gc3VwcGxpZWRTY2hlbWEgYW4gb3B0aW9uYWwgc2NoZW1hIHRvIHVzZSByYXRoZXJcbiAgICogdGhhbiB0aGUgb25lIGNyZWF0ZWQgb3Igc3RvcmVkIGludGVybmFsbHkgZ2VuZXJhdGVkIGZyb20gdGhpcyBTRExcbiAgICogQHJldHVybiB7R3JhcGhRTFNjaGVtYX0gYSBuZXcgc2NoZW1hIGlzIGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMLCBpdGVyYXRlZFxuICAgKiBvdmVyIGFuZCByZXR1cm5lZC5cbiAgICovXG4gIGZvckVhY2hPZihmbiwgY29udGV4dCwgdHlwZXMsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCkge1xuICAgIGxldCBzY2hlbWEgPSBzdXBwbGllZFNjaGVtYSB8fCB0aGlzLnNjaGVtYVxuXG4gICAgZm9yRWFjaE9mKHNjaGVtYSwgZm4sIGNvbnRleHQsIHR5cGVzKVxuXG4gICAgcmV0dXJuIHNjaGVtYVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGBmb3JFYWNoT2YoKWAgc3BlY2lmaWMgdG8gdHlwZXMuXG4gICAqXG4gICAqIEBzZWUgI2ZvckVhY2hPZlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hPZlJlc29sdmVyfSBmbiBhIGZ1bmN0aW9uIHdpdGggYSBzaWduYXR1cmUgZGVmaW5lZCBhYm92ZVxuICAgKiBAcGFyYW0ge3Vua25vd259IGNvbnRleHQgdXN1YWxseSBhbiBvYmplY3QgYnV0IGFueSBtaXhlZCB2YWx1ZSB0aGUgZGVub3Rlc1xuICAgKiBzb21lIHNoYXJlZCBjb250ZXh0IGFzIGlzIHVzZWQgd2l0aCB0aGUgc2NoZW1hIGR1cmluZyBub3JtYWwgcnVudGltZS5cbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hP30gc3VwcGxpZWRTY2hlbWEgYW4gb3B0aW9uYWwgc2NoZW1hIHRvIHVzZSByYXRoZXJcbiAgICogdGhhbiB0aGUgb25lIGNyZWF0ZWQgb3Igc3RvcmVkIGludGVybmFsbHkgZ2VuZXJhdGVkIGZyb20gdGhpcyBTY2hlbWF0YVxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTY2hlbWF0YSxcbiAgICogaXRlcmF0ZWQgb3ZlciBhbmQgcmV0dXJuZWQuXG4gICAqL1xuICBmb3JFYWNoVHlwZShmbiwgY29udGV4dCwgc3VwcGxpZWRTY2hlbWEgPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaE9mKGZuLCBjb250ZXh0LCBUWVBFUywgc3VwcGxpZWRTY2hlbWEpXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgdG8gYGZvckVhY2hPZigpYCBzcGVjaWZpYyB0byBpbnB1dCBvYmplY3QgdHlwZXMuXG4gICAqXG4gICAqIEBzZWUgI2ZvckVhY2hPZlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hPZlJlc29sdmVyfSBmbiBhIGZ1bmN0aW9uIHdpdGggYSBzaWduYXR1cmUgZGVmaW5lZCBhYm92ZVxuICAgKiBAcGFyYW0ge3Vua25vd259IGNvbnRleHQgdXN1YWxseSBhbiBvYmplY3QgYnV0IGFueSBtaXhlZCB2YWx1ZSB0aGUgZGVub3Rlc1xuICAgKiBzb21lIHNoYXJlZCBjb250ZXh0IGFzIGlzIHVzZWQgd2l0aCB0aGUgc2NoZW1hIGR1cmluZyBub3JtYWwgcnVudGltZS5cbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hP30gc3VwcGxpZWRTY2hlbWEgYW4gb3B0aW9uYWwgc2NoZW1hIHRvIHVzZSByYXRoZXJcbiAgICogdGhhbiB0aGUgb25lIGNyZWF0ZWQgb3Igc3RvcmVkIGludGVybmFsbHkgZ2VuZXJhdGVkIGZyb20gdGhpcyBTY2hlbWF0YVxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTY2hlbWF0YSxcbiAgICogaXRlcmF0ZWRcbiAgICogb3ZlciBhbmQgcmV0dXJuZWQuXG4gICAqL1xuICBmb3JFYWNoSW5wdXRPYmplY3RUeXBlKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoT2YoZm4sIGNvbnRleHQsIElOUFVUX1RZUEVTLCBzdXBwbGllZFNjaGVtYSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCB0byBgZm9yRWFjaE9mKClgIHNwZWNpZmljIHRvIHVuaW9ucy5cbiAgICpcbiAgICogQHNlZSAjZm9yRWFjaE9mXG4gICAqXG4gICAqIEBwYXJhbSB7Rm9yRWFjaE9mUmVzb2x2ZXJ9IGZuIGEgZnVuY3Rpb24gd2l0aCBhIHNpZ25hdHVyZSBkZWZpbmVkIGFib3ZlXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTREwsIGl0ZXJhdGVkXG4gICAqIG92ZXIgYW5kIHJldHVybmVkLlxuICAgKi9cbiAgZm9yRWFjaFVuaW9uKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoT2YoZm4sIGNvbnRleHQsIFVOSU9OUywgc3VwcGxpZWRTY2hlbWEpXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgdG8gYGZvckVhY2hPZigpYCBzcGVjaWZpYyB0byBlbnVtcy5cbiAgICpcbiAgICogQHNlZSAjZm9yRWFjaE9mXG4gICAqXG4gICAqIEBwYXJhbSB7Rm9yRWFjaE9mUmVzb2x2ZXJ9IGZuIGEgZnVuY3Rpb24gd2l0aCBhIHNpZ25hdHVyZSBkZWZpbmVkIGFib3ZlXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTREwsIGl0ZXJhdGVkXG4gICAqIG92ZXIgYW5kIHJldHVybmVkLlxuICAgKi9cbiAgZm9yRWFjaEVudW0oZm4sIGNvbnRleHQsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmZvckVhY2hPZihmbiwgY29udGV4dCwgRU5VTVMsIHN1cHBsaWVkU2NoZW1hKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGBmb3JFYWNoT2YoKWAgc3BlY2lmaWMgdG8gaW50ZXJmYWNlcy5cbiAgICpcbiAgICogQHNlZSAjZm9yRWFjaE9mXG4gICAqXG4gICAqIEBwYXJhbSB7Rm9yRWFjaE9mUmVzb2x2ZXJ9IGZuIGEgZnVuY3Rpb24gd2l0aCBhIHNpZ25hdHVyZSBkZWZpbmVkIGFib3ZlXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTREwsIGl0ZXJhdGVkXG4gICAqIG92ZXIgYW5kIHJldHVybmVkLlxuICAgKi9cbiAgZm9yRWFjaEludGVyZmFjZShmbiwgY29udGV4dCwgc3VwcGxpZWRTY2hlbWEgPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaE9mKGZuLCBjb250ZXh0LCBJTlRFUkZBQ0VTLCBzdXBwbGllZFNjaGVtYSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCB0byBgZm9yRWFjaE9mKClgIHNwZWNpZmljIHRvIHR5cGVzLlxuICAgKlxuICAgKiBAc2VlICNmb3JFYWNoT2ZcbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoT2ZSZXNvbHZlcn0gZm4gYSBmdW5jdGlvbiB3aXRoIGEgc2lnbmF0dXJlIGRlZmluZWQgYWJvdmVcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7R3JhcGhRTFNjaGVtYT99IHN1cHBsaWVkU2NoZW1hIGFuIG9wdGlvbmFsIHNjaGVtYSB0byB1c2UgcmF0aGVyXG4gICAqIHRoYW4gdGhlIG9uZSBjcmVhdGVkIG9yIHN0b3JlZCBpbnRlcm5hbGx5IGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMXG4gICAqIEByZXR1cm4ge0dyYXBoUUxTY2hlbWF9IGEgbmV3IHNjaGVtYSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETCxcbiAgICogaXRlcmF0ZWQgb3ZlciBhbmQgcmV0dXJuZWQuXG4gICAqL1xuICBmb3JFYWNoU2NhbGFyKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoT2YoZm4sIGNvbnRleHQsIFNDQUxBUlMsIHN1cHBsaWVkU2NoZW1hKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGBmb3JFYWNoT2YoKWAgc3BlY2lmaWMgdG8gYWxsIHJvb3QgdHlwZXM7IFF1ZXJ5LCBNdXRhdGlvbiBhbmRcbiAgICogU3Vic2NyaXB0aW9uIHRoYXQgZXhpc3Qgd2l0aGluIHRoZSBzY2hlbWEuXG4gICAqXG4gICAqIEBzZWUgI2ZvckVhY2hPZlxuICAgKlxuICAgKiBAcGFyYW0ge0ZvckVhY2hPZlJlc29sdmVyfSBmbiBhIGZ1bmN0aW9uIHdpdGggYSBzaWduYXR1cmUgZGVmaW5lZCBhYm92ZVxuICAgKiBAcGFyYW0ge3Vua25vd259IGNvbnRleHQgdXN1YWxseSBhbiBvYmplY3QgYnV0IGFueSBtaXhlZCB2YWx1ZSB0aGUgZGVub3Rlc1xuICAgKiBzb21lIHNoYXJlZCBjb250ZXh0IGFzIGlzIHVzZWQgd2l0aCB0aGUgc2NoZW1hIGR1cmluZyBub3JtYWwgcnVudGltZS5cbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hP30gc3VwcGxpZWRTY2hlbWEgYW4gb3B0aW9uYWwgc2NoZW1hIHRvIHVzZSByYXRoZXJcbiAgICogdGhhbiB0aGUgb25lIGNyZWF0ZWQgb3Igc3RvcmVkIGludGVybmFsbHkgZ2VuZXJhdGVkIGZyb20gdGhpcyBTRExcbiAgICogQHJldHVybiB7R3JhcGhRTFNjaGVtYX0gYSBuZXcgc2NoZW1hIGlzIGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMLCBpdGVyYXRlZFxuICAgKiBvdmVyIGFuZCByZXR1cm5lZC5cbiAgICovXG4gIGZvckVhY2hSb290VHlwZShmbiwgY29udGV4dCwgc3VwcGxpZWRTY2hlbWEgPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaE9mKGZuLCBjb250ZXh0LCBST09UX1RZUEVTLCBzdXBwbGllZFNjaGVtYSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBleHRlbnNpb24gb2YgYGZvckVhY2hPZmAgdGhhdCB0YXJnZXRzIHRoZSBmaWVsZHMgb2YgdGhlIHR5cGVzIGluIHRoZVxuICAgKiBzY2hlbWEncyB0eXBlTWFwLiBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVzIG1vcmUgZGV0YWlsIGFuZCBhbGxvd3MgZ3JlYXRlclxuICAgKiBhY2Nlc3MgdG8gYW55IGFzc29jaWF0ZWQgYGNvbnRleHRgIHRoYW4gdGhlIGZ1bmN0aW9uIG9mIHRoZSBzYW1lIG5hbWVcbiAgICogcHJvdmlkZWQgYnkgdGhlIGBncmFwaHFsLXRvb2xzYCBsaWJyYXJ5LlxuICAgKlxuICAgKiBUaGUgc2lnbmF0dXJlIGZvciB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgYXMgZm9sbG93c1xuICAgKlxuICAgKiAoXG4gICAqICAgdHlwZTogdW5rbm93bixcbiAgICogICB0eXBlTmFtZTogc3RyaW5nLFxuICAgKiAgIHR5cGVEaXJlY3RpdmVzOiBBcnJheTxHcmFwaFFMRGlyZWN0aXZlPixcbiAgICogICBmaWVsZDogdW5rbm93bixcbiAgICogICBmaWVsZE5hbWU6IHN0cmluZyxcbiAgICogICBmaWVsZEFyZ3M6IEFycmF5PEdyYXBoUUxBcmd1bWVudD4sXG4gICAqICAgZmllbGREaXJlY3RpdmVzOiBBcnJheTxHcmFwaFFMRGlyZWN0aXZlPixcbiAgICogICBzY2hlbWE6IEdyYXBoUUxTY2hlbWEsXG4gICAqICAgY29udGV4dDogdW5rbm93blxuICAgKiApID0+IHZvaWRcbiAgICpcbiAgICogV2hlcmVcbiAgICpcbiAgICogV2hlcmU6XG4gICAqICAgYHR5cGVgICAgICAgICAgICAtIHRoZSBvYmplY3QgaW5zdGFuY2UgZnJvbSB3aXRoaW4gdGhlIGBHcmFwaFFMU2NoZW1hYFxuICAgKiAgIGB0eXBlTmFtZWAgICAgICAgLSB0aGUgbmFtZSBvZiB0aGUgb2JqZWN0OyBcIlF1ZXJ5XCIgZm9yIHR5cGUgUXVlcnkgYW5kXG4gICAqICAgICAgICAgICAgICAgICAgICAgIHNvIG9uXG4gICAqICAgYHR5cGVEaXJlY3RpdmVzYCAtIGFuIGFycmF5IG9mIGRpcmVjdGl2ZXMgYXBwbGllZCB0byB0aGUgb2JqZWN0IG9yIGFuXG4gICAqICAgICAgICAgICAgICAgICAgICAgIGVtcHR5IGFycmF5IGlmIHRoZXJlIGFyZSBub25lIGFwcGxpZWQuXG4gICAqICAgYGZpZWxkYCAgICAgICAgICAtIHRoZSBmaWVsZCBpbiBxdWVzdGlvbiBmcm9tIHRoZSB0eXBlXG4gICAqICAgYGZpZWxkTmFtZWAgICAgICAtIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCBhcyBhIHN0cmluZ1xuICAgKiAgIGBmaWVsZEFyZ3NgICAgICAgLSBhbiBhcnJheSBvZiBhcmd1bWVudHMgZm9yIHRoZSBmaWVsZCBpbiBxdWVzdGlvblxuICAgKiAgIGBmaWVsZERpcmVjdGl2ZXNgLSBhbiBhcnJheSBvZiBkaXJlY3RpdmVzIGFwcGxpZWQgdG8gdGhlIGZpZWxkIG9yIGFuXG4gICAqICAgICAgICAgICAgICAgICAgICAgIGVtcHR5IGFycmF5IHNob3VsZCB0aGVyZSBiZSBubyBhcHBsaWVkIGRpcmVjdGl2ZXNcbiAgICogICBgc2NoZW1hYCAgICAgICAgIC0gYW4gaW5zdGFuY2Ugb2YgYEdyYXBoUUxTY2hlbWFgIG92ZXIgd2hpY2ggdG8gaXRlcmF0ZVxuICAgKiAgIGBjb250ZXh0YCAgICAgICAgLSB1c3VhbGx5IGFuIG9iamVjdCwgYW5kIHVzdWFsbHkgdGhlIHNhbWUgb2JqZWN0LCBwYXNzZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgdG8gdGhlIGNhbGwgdG8gYG1ha2VFeGVjdXRhYmxlU2NoZW1hKClgIG9yIGBncmFwaHFsKClgXG4gICAqXG4gICAqIFR5cGVzLCBvciBCaXRtYXNrZWRUeXBlIHZhbHVlcywgYXJlIGRlZmluZWQgYXMgdGhlIGZvbGxvd2luZyBiaXRtYXNrXG4gICAqIGNvbnN0YW50IHZhbHVlcy4gVGhleSBoZWxwIHRoZSBmdW5jdGlvbiB1bmRlcnN0YW5kIHdoaWNoIEdyYXBoUUwgc3VidHlwZVxuICAgKiBzaG91bGQgYmUgaXRlcmF0ZWQgb3Zlci4gSXQgZGVmYXVsdHMgdG8gQUxMLlxuICAgKlxuICAgKiBjb25zdCBBTEwgPSAxXG4gICAqIGNvbnN0IFRZUEVTID0gMlxuICAgKiBjb25zdCBJTlRFUkZBQ0VTID0gNFxuICAgKiBjb25zdCBFTlVNUyA9IDhcbiAgICogY29uc3QgVU5JT05TID0gMTZcbiAgICogY29uc3QgU0NBTEFSUyA9IDMyXG4gICAqIGNvbnN0IFJPT1RfVFlQRVMgPSA2NFxuICAgKiBjb25zdCBJTlBVVF9UWVBFUyA9IDEyOFxuICAgKiBjb25zdCBISURERU4gPSAyNTZcbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoRmllbGRSZXNvbHZlcn0gZm4gYSBmdW5jdGlvbiB3aXRoIGEgc2lnbmF0dXJlIGRlZmluZWQgYWJvdmVcbiAgICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAgICogc29tZSBzaGFyZWQgY29udGV4dCBhcyBpcyB1c2VkIHdpdGggdGhlIHNjaGVtYSBkdXJpbmcgbm9ybWFsIHJ1bnRpbWUuXG4gICAqIEBwYXJhbSB7Qml0bWFza2VkVHlwZT99IHR5cGVzIG9uZSBvZiB0aGUgQml0bWFza2VkVHlwZSB2YWx1ZXMuIFNlZSBhYm92ZS5cbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hP30gc3VwcGxpZWRTY2hlbWEgYW4gb3B0aW9uYWwgc2NoZW1hIHRvIHVzZSByYXRoZXJcbiAgICogdGhhbiB0aGUgb25lIGNyZWF0ZWQgb3Igc3RvcmVkIGludGVybmFsbHkgZ2VuZXJhdGVkIGZyb20gdGhpcyBTRExcbiAgICogQHJldHVybiB7R3JhcGhRTFNjaGVtYX0gYSBuZXcgc2NoZW1hIGlzIGdlbmVyYXRlZCBmcm9tIHRoaXMgU0RMLCBpdGVyYXRlZFxuICAgKiBvdmVyIGFuZCByZXR1cm5lZC5cbiAgICovXG4gIGZvckVhY2hGaWVsZChmbiwgY29udGV4dCwgdHlwZXMgPSBBTEwsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCk6IEdyYXBoUUxTY2hlbWEge1xuICAgIGxldCBzY2hlbWEgPSBzdXBwbGllZFNjaGVtYSB8fCB0aGlzLnNjaGVtYVxuXG4gICAgZm9yRWFjaEZpZWxkKHNjaGVtYSwgZm4sIGNvbnRleHQsIHR5cGVzKVxuXG4gICAgcmV0dXJuIHNjaGVtYVxuICB9XG5cbiAgLyoqXG4gICAqIGBmb3JFYWNoRmllbGQoKWAgc2hvcnRjdXQgZm9jdXNpbmcgb24gR3JhcGhRTE9iamVjdFR5cGVzIHNwZWNpZmljYWxseS5cbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoRmllbGRSZXNvbHZlcn0gZm4gYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yXG4gICAqIGVhY2ggZmllbGQgb2YgYW55IEdyYXBoUUxPYmplY3RUeXBlIGZvdW5kXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBlaXRoZXIgdGhlIHN1cHBsaWVkIEdyYXBoUUxTY2hlbWEgb3Igb25lIGdlbmVyYXRlZFxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0YXNrXG4gICAqL1xuICBmb3JFYWNoVHlwZUZpZWxkKGZuLCBjb250ZXh0LCBzdXBwbGllZFNjaGVtYSA9IG51bGwpIHtcbiAgICBsZXQgc2NoZW1hID0gc3VwcGxpZWRTY2hlbWEgfHwgdGhpcy5zY2hlbWFcblxuICAgIGZvckVhY2hGaWVsZChzY2hlbWEsIGZuLCBjb250ZXh0LCBUWVBFUylcblxuICAgIHJldHVybiBzY2hlbWFcbiAgfVxuXG4gIC8qKlxuICAgKiBgZm9yRWFjaEZpZWxkKClgIHNob3J0Y3V0IGZvY3VzaW5nIG9uIEdyYXBoUUxJbnRlcmZhY2VUeXBlIHNwZWNpZmljYWxseS5cbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoRmllbGRSZXNvbHZlcn0gZm4gYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yXG4gICAqIGVhY2ggZmllbGQgb2YgYW55IEdyYXBoUUxPYmplY3RUeXBlIGZvdW5kXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBlaXRoZXIgdGhlIHN1cHBsaWVkIEdyYXBoUUxTY2hlbWEgb3Igb25lIGdlbmVyYXRlZFxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0YXNrXG4gICAqL1xuICBmb3JFYWNoSW50ZXJmYWNlRmllbGQoZm4sIGNvbnRleHQsIHN1cHBsaWVkU2NoZW1hID0gbnVsbCkge1xuICAgIGxldCBzY2hlbWEgPSBzdXBwbGllZFNjaGVtYSB8fCB0aGlzLnNjaGVtYVxuXG4gICAgZm9yRWFjaEZpZWxkKHNjaGVtYSwgZm4sIGNvbnRleHQsIElOVEVSRkFDRVMpXG5cbiAgICByZXR1cm4gc2NoZW1hXG4gIH1cblxuICAvKipcbiAgICogYGZvckVhY2hGaWVsZCgpYCBzaG9ydGN1dCBmb2N1c2luZyBvbiBHcmFwaFFMSW5wdXRPYmplY3RUeXBlIHNwZWNpZmljYWxseS5cbiAgICpcbiAgICogQHBhcmFtIHtGb3JFYWNoRmllbGRSZXNvbHZlcn0gZm4gYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yXG4gICAqIGVhY2ggZmllbGQgb2YgYW55IEdyYXBoUUxPYmplY3RUeXBlIGZvdW5kXG4gICAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gICAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWE/fSBzdXBwbGllZFNjaGVtYSBhbiBvcHRpb25hbCBzY2hlbWEgdG8gdXNlIHJhdGhlclxuICAgKiB0aGFuIHRoZSBvbmUgY3JlYXRlZCBvciBzdG9yZWQgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGlzIFNETFxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBlaXRoZXIgdGhlIHN1cHBsaWVkIEdyYXBoUUxTY2hlbWEgb3Igb25lIGdlbmVyYXRlZFxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0YXNrXG4gICAqL1xuICBmb3JFYWNoSW5wdXRPYmplY3RGaWVsZChmbiwgY29udGV4dCwgc3VwcGxpZWRTY2hlbWEgPSBudWxsKSB7XG4gICAgbGV0IHNjaGVtYSA9IHN1cHBsaWVkU2NoZW1hIHx8IHRoaXMuc2NoZW1hXG5cbiAgICBmb3JFYWNoRmllbGQoc2NoZW1hLCBmbiwgY29udGV4dCwgSU5QVVRfVFlQRVMpXG5cbiAgICByZXR1cm4gc2NoZW1hXG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3IgYHJlcXVpcmUoJ2dyYXBocWwnKS5ncmFwaHFsU3luYygpYCB0aGF0IGF1dG9tYXRpY2FsbHkgcGFzc2VzXG4gICAqIGluIHRoZSBpbnRlcm5hbCBgLnNjaGVtYWAgcmVmZXJlbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIuXG4gICAqIEB0ZW1wbGF0ZSBUU291cmNlIHRoZSB2YWx1ZSBiZWluZyByZXNvbHZlZC4gVGhpcyBpcyB0aGUgb2JqZWN0IHRoYXQgbmVlZHNcbiAgICogdG8gYmUgdHlwZWQuXG4gICAqIEB0ZW1wbGF0ZSBUQXJncyB0aGUgdHlwZSBvZiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgZmllbGQgaW4gdGhlXG4gICAqIEdyYXBoUUwgcXVlcnkuXG4gICAqIEB0ZW1wbGF0ZSBUQ29udGV4dCB0aGUgY29udGV4dCBvYmplY3QgcGFzc2VkIHRvIHRoZSByZXNvbHZlci4gVGhpcyBjYW5cbiAgICogY29udGFpbiB1c2VmdWwgZGF0YSBsaWtlIHRoZSBjdXJyZW50IHVzZXIgb3IgZGF0YWJhc2UgY29ubmVjdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd8U291cmNlfSBxdWVyeSBBIEdyYXBoUUwgbGFuZ3VhZ2UgZm9ybWF0dGVkIHN0cmluZ1xuICAgKiByZXByZXNlbnRpbmcgdGhlIHJlcXVlc3RlZCBvcGVyYXRpb24uXG4gICAqIEBwYXJhbSB7dW5rbm93bj99IGNvbnRleHRWYWx1ZSBhIGJpdCBvZiBzaGFyZWQgY29udGV4dCB0byBwYXNzIHRvIHJlc29sdmVyc1xuICAgKiBAcGFyYW0ge09iak1hcD99IHZhcmlhYmxlVmFsdWVzIEEgbWFwcGluZyBvZiB2YXJpYWJsZSBuYW1lIHRvIHJ1bnRpbWUgdmFsdWVcbiAgICogdG8gdXNlIGZvciBhbGwgdmFyaWFibGVzIGRlZmluZWQgaW4gdGhlIHJlcXVlc3RTdHJpbmcuXG4gICAqIEBwYXJhbSB7UmVzb2x2ZXJNYXA/fSByb290VmFsdWUgcHJvdmlkZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvXG4gICAqIHJlc29sdmVyIGZ1bmN0aW9ucyBvbiB0aGUgdG9wIGxldmVsIHR5cGUgKGUuZy4gdGhlIHF1ZXJ5IG9iamVjdCB0eXBlKS5cbiAgICogQHBhcmFtIHtzdHJpbmc/fSBvcGVyYXRpb25OYW1lIFRoZSBuYW1lIG9mIHRoZSBvcGVyYXRpb24gdG8gdXNlIGlmXG4gICAqIHJlcXVlc3RTdHJpbmcgY29udGFpbnMgbXVsdGlwbGUgcG9zc2libGUgb3BlcmF0aW9ucy4gQ2FuIGJlIG9taXR0ZWQgaWZcbiAgICogcmVxdWVzdFN0cmluZyBjb250YWlucyBvbmx5IG9uZSBvcGVyYXRpb24uXG4gICAqIEBwYXJhbSB7R3JhcGhRTEZpZWxkUmVzb2x2ZXI8VFNvdXJjZSwgVEFyZ3MsIFRDb250ZXh0Pj99IGZpZWxkUmVzb2x2ZXIgQVxuICAgKiByZXNvbHZlciBmdW5jdGlvbiB0byB1c2Ugd2hlbiBvbmUgaXMgbm90IHByb3ZpZGVkIGJ5IHRoZSBzY2hlbWEuIElmIG5vdFxuICAgKiBwcm92aWRlZCwgdGhlIGRlZmF1bHQgZmllbGQgcmVzb2x2ZXIgaXMgdXNlZCAod2hpY2ggbG9va3MgZm9yIGEgdmFsdWUgb3JcbiAgICogbWV0aG9kIG9uIHRoZSBzb3VyY2UgdmFsdWUgd2l0aCB0aGUgZmllbGQncyBuYW1lKS5cbiAgICogQHBhcmFtIHtHcmFwaFFMVHlwZVJlc29sdmVyPFRTb3VyY2UsVENvbnRleHQ+P30gdHlwZVJlc29sdmVyIEEgcmVzb2x2ZXIgaXNcbiAgICogYSBmdW5jdGlvbiB0eXBlIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBjb25jcmV0ZSB0eXBlIG9mIGFuIG9iamVjdCB3aGVuXG4gICAqIHJlc29sdmluZyBhbiBpbnRlcmZhY2Ugb3IgdW5pb24gdHlwZS5cbiAgICogQHJldHVybiB7RXhlY3V0aW9uUmVzdWx0fSB0aGUgcmVxdWVzdGVkIHJlc3VsdHMuIEFuIGVycm9yIGlzIHRocm93biBpZlxuICAgKiB0aGUgcmVzdWx0cyBjb3VsZCBub3QgYmUgZnVsZmlsbGVkIG9yIGludmFsaWQgaW5wdXQvb3V0cHV0IHdhcyBzcGVjaWZpZWQuXG4gICAqL1xuICBydW4oXG4gICAgcXVlcnksXG4gICAgY29udGV4dFZhbHVlLFxuICAgIHZhcmlhYmxlVmFsdWVzLFxuICAgIHJvb3RWYWx1ZSxcbiAgICBvcGVyYXRpb25OYW1lLFxuICAgIGZpZWxkUmVzb2x2ZXIsXG4gICAgdHlwZVJlc29sdmVyLFxuICApIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5ncWwuZ3JhcGhxbFN5bmMoe1xuICAgICAgc2NoZW1hOiB0aGlzLnNjaGVtYSxcbiAgICAgIHNvdXJjZTogcXVlcnksXG4gICAgICByb290VmFsdWU6IHRoaXMucmVzb2x2ZXJzIHx8IHJvb3RWYWx1ZSxcbiAgICAgIGNvbnRleHRWYWx1ZSxcbiAgICAgIHZhcmlhYmxlVmFsdWVzLFxuICAgICAgb3BlcmF0aW9uTmFtZSxcbiAgICAgIGZpZWxkUmVzb2x2ZXIsXG4gICAgICB0eXBlUmVzb2x2ZXJcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIGByZXF1aXJlKCdncmFwaHFsJykuZ3JhcGhxbCgpYCB0aGF0IGF1dG9tYXRpY2FsbHkgcGFzc2VzXG4gICAqIGluIHRoZSBpbnRlcm5hbCBgLnNjaGVtYWAgcmVmZXJlbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEB0ZW1wbGF0ZSBUU291cmNlIHRoZSB2YWx1ZSBiZWluZyByZXNvbHZlZC4gVGhpcyBpcyB0aGUgb2JqZWN0IHRoYXQgbmVlZHNcbiAgICogdG8gYmUgdHlwZWQuXG4gICAqIEB0ZW1wbGF0ZSBUQXJncyB0aGUgdHlwZSBvZiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgZmllbGQgaW4gdGhlXG4gICAqIEdyYXBoUUwgcXVlcnkuXG4gICAqIEB0ZW1wbGF0ZSBUQ29udGV4dCB0aGUgY29udGV4dCBvYmplY3QgcGFzc2VkIHRvIHRoZSByZXNvbHZlci4gVGhpcyBjYW5cbiAgICogY29udGFpbiB1c2VmdWwgZGF0YSBsaWtlIHRoZSBjdXJyZW50IHVzZXIgb3IgZGF0YWJhc2UgY29ubmVjdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd8U291cmNlfSBxdWVyeSBBIEdyYXBoUUwgbGFuZ3VhZ2UgZm9ybWF0dGVkIHN0cmluZ1xuICAgKiByZXByZXNlbnRpbmcgdGhlIHJlcXVlc3RlZCBvcGVyYXRpb24uXG4gICAqIEBwYXJhbSB7dW5rbm93bj99IGNvbnRleHRWYWx1ZSBhIGJpdCBvZiBzaGFyZWQgY29udGV4dCB0byBwYXNzIHRvIHJlc29sdmVyc1xuICAgKiBAcGFyYW0ge09iamVjdD99IHZhcmlhYmxlVmFsdWVzIEEgbWFwcGluZyBvZiB2YXJpYWJsZSBuYW1lIHRvIHJ1bnRpbWUgdmFsdWVcbiAgICogdG8gdXNlIGZvciBhbGwgdmFyaWFibGVzIGRlZmluZWQgaW4gdGhlIHJlcXVlc3RTdHJpbmcuXG4gICAqIEBwYXJhbSB7UmVzb2x2ZXJNYXA/fSBUaGUgdmFsdWUgcHJvdmlkZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvXG4gICAqIHJlc29sdmVyIGZ1bmN0aW9ucyBvbiB0aGUgdG9wIGxldmVsIHR5cGUgKGUuZy4gdGhlIHF1ZXJ5IG9iamVjdCB0eXBlKS5cbiAgICogQHBhcmFtIHtzdHJpbmc/fSBvcGVyYXRpb25OYW1lIFRoZSBuYW1lIG9mIHRoZSBvcGVyYXRpb24gdG8gdXNlIGlmXG4gICAqIHJlcXVlc3RTdHJpbmcgY29udGFpbnMgbXVsdGlwbGUgcG9zc2libGUgb3BlcmF0aW9ucy4gQ2FuIGJlIG9taXR0ZWQgaWZcbiAgICogcmVxdWVzdFN0cmluZyBjb250YWlucyBvbmx5IG9uZSBvcGVyYXRpb24uXG4gICAqIEBwYXJhbSB7R3JhcGhRTEZpZWxkUmVzb2x2ZXI8VFNvdXJjZSwgVEFyZ3MsIFRDb250ZXh0Pj99IGZpZWxkUmVzb2x2ZXIgQVxuICAgKiByZXNvbHZlciBmdW5jdGlvbiB0byB1c2Ugd2hlbiBvbmUgaXMgbm90IHByb3ZpZGVkIGJ5IHRoZSBzY2hlbWEuIElmIG5vdFxuICAgKiBwcm92aWRlZCwgdGhlIGRlZmF1bHQgZmllbGQgcmVzb2x2ZXIgaXMgdXNlZCAod2hpY2ggbG9va3MgZm9yIGEgdmFsdWUgb3JcbiAgICogbWV0aG9kIG9uIHRoZSBzb3VyY2UgdmFsdWUgd2l0aCB0aGUgZmllbGQncyBuYW1lKS5cbiAgICogQHBhcmFtIHtHcmFwaFFMVHlwZVJlc29sdmVyPFRTb3VyY2UsVENvbnRleHQ+P30gdHlwZVJlc29sdmVyIEEgcmVzb2x2ZXIgaXNcbiAgICogYSBmdW5jdGlvbiB0eXBlIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBjb25jcmV0ZSB0eXBlIG9mIGFuIG9iamVjdCB3aGVuXG4gICAqIHJlc29sdmluZyBhbiBpbnRlcmZhY2Ugb3IgdW5pb24gdHlwZS5cbiAgICogQHJldHVybiB7UHJvbWlzZTxFeGVjdXRpb25SZXN1bHQ+fSBhIFByb21pc2UgY29udGlhbmluZyB0aGUgcmVxdWVzdGVkXG4gICAqIHJlc3VsdHNcbiAgICovXG4gIGFzeW5jIHJ1bkFzeW5jKFxuICAgIHF1ZXJ5LFxuICAgIGNvbnRleHRWYWx1ZSxcbiAgICB2YXJpYWJsZVZhbHVlcyxcbiAgICByb290VmFsdWUsXG4gICAgb3BlcmF0aW9uTmFtZSxcbiAgICBmaWVsZFJlc29sdmVyLFxuICAgIHR5cGVSZXNvbHZlcixcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZ3FsLmdyYXBocWwoe1xuICAgICAgc2NoZW1hOiB0aGlzLnNjaGVtYSxcbiAgICAgIHNvdXJjZTogcXVlcnksXG4gICAgICByb290VmFsdWU6IHRoaXMucmVzb2x2ZXJzIHx8IHJvb3RWYWx1ZSxcbiAgICAgIGNvbnRleHRWYWx1ZSxcbiAgICAgIHZhcmlhYmxlVmFsdWVzLFxuICAgICAgb3BlcmF0aW9uTmFtZSxcbiAgICAgIGZpZWxkUmVzb2x2ZXIsXG4gICAgICB0eXBlUmVzb2x2ZXJcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbGl0dGxlIHdyYXBwZXIgdXNlZCB0byBjYXRjaCBhbnkgZXJyb3JzIHRocm93biB3aGVuIGJ1aWxkaW5nIGEgc2NoZW1hXG4gICAqIGZyb20gdGhlIHN0cmluZyBTREwgcmVwcmVzZW50YXRpb24gb2YgYSBnaXZlbiBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtTY2hlbWFTb3VyY2V9IHNkbCBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSwgYSBzdHJpbmcgb2YgU0RMLCBhXG4gICAqIFNvdXJjZSBpbnN0YW5jZSBvZiBTREwsIGEgR3JhcGhRTFNjaGVtYSBvciBBU1ROb2RlIHRoYXQgY2FuIGJlIHByaW50ZWQgYXNcbiAgICogYW4gU0RMIHN0cmluZ1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtzaG93RXJyb3I9ZmFsc2VdIHRydWUgaWYgdGhlIGVycm9yIHNob3VsZCBiZSB0aHJvd24sXG4gICAqIGZhbHNlIGlmIHRoZSBlcnJvciBzaG91bGQgYmUgc2lsZW50bHkgc3VwcHJlc3NlZFxuICAgKiBAcGFyYW0ge0J1aWxkU2NoZW1hT3B0aW9ucyZQYXJzZU9wdGlvbnN9IFtzY2hlbWFPcHRzPXVuZGVmaW5lZF0gZm9yXG4gICAqIGFkdmFuY2VkIHVzZXJzLCBwYXNzaW5nIHRocm91Z2ggYWRkaXRpb25hbCBidWlsZFNjaGVtYSgpIG9wdGlvbnMgY2FuIGJlXG4gICAqIGRvbmUgaGVyZVxuICAgKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBudWxsIGlmIGFuIGVycm9yIG9jY3VycyBhbmQgZXJyb3JzIGFyZSBub3RcbiAgICogc3VyZmFjZWQgb3IgYSB2YWxpZCBHcmFwaFFMU2NoZW1hIG9iamVjdCBvdGhlcndpc2VcbiAgICovXG4gIHN0YXRpYyBidWlsZFNjaGVtYShzZGwsIHNob3dFcnJvciA9IGZhbHNlLCBzY2hlbWFPcHRzID0gdW5kZWZpbmVkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBidWlsZFNjaGVtYSgpXSBub3JtYWxpemluZyBzb3VyY2UnKVxuICAgICAgbGV0IHNvdXJjZSA9IG5vcm1hbGl6ZVNvdXJjZShzZGwpXG5cbiAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBidWlsZFNjaGVtYSgpXSBidWlsZGluZyBzY2hlbWEnKVxuICAgICAgcmV0dXJuIHRoaXMuZ3FsLmJ1aWxkU2NoZW1hKHNvdXJjZSwgc2NoZW1hT3B0cylcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBidWlsZFNjaGVtYSgpXSBmYWlsZWQgdG8gYnVpbGQhJylcbiAgICAgIGRlYnVnX3RyYWNlKCdbc3RhdGljIGJ1aWxkU2NoZW1hKCldICcsIGUpXG4gICAgICBpZiAoc2hvd0Vycm9yKSB7XG4gICAgICAgIHRocm93IGVcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbGl0dGxlIHdyYXBwZXIgdXNlZCB0byBjYXRjaCBhbnkgZXJyb3JzIHRocm93biB3aGVuIHBhcnNpbmcgU2NoZW1hdGEgZm9yXG4gICAqIEFTVE5vZGVzLiBJZiBzaG93RXJyb3IgaXMgdHJ1ZSwgYW55IGNhdWdodCBlcnJvcnMgYXJlIHRocm93biBvbmNlIGFnYWluLlxuICAgKlxuICAgKiBAcGFyYW0ge1NjaGVtYVNvdXJjZX0gc2RsIGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhLCBhIHN0cmluZyBvZiBTREwsIGFcbiAgICogU291cmNlIGluc3RhbmNlIG9mIFNETCwgYSBHcmFwaFFMU2NoZW1hIG9yIEFTVE5vZGUgdGhhdCBjYW4gYmUgcHJpbnRlZCBhc1xuICAgKiBhbiBTREwgc3RyaW5nXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Nob3dFcnJvcj1mYWxzZV0gaWYgdHJ1ZSwgYW55IGNhdWdodCBlcnJvcnMgd2lsbCBiZSB0aHJvd24gb25jZVxuICAgKiBhZ2FpblxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtlbmhhbmNlPXRydWVdIGEgZ2VuZXJhdG9yIGtleWVkIHdpdGggYFN5bWJvbC5pdGVyYXRvcmAgaXMgc2V0XG4gICAqIG9uIHRoZSByZXN1bHRpbmcgYXN0Tm9kZSBvYmplY3QgYWxsb3dpbmcgdGhlIHJlc3VsdGluZyBgLmFzdGAgdmFsdWUgdG9cbiAgICogYmUgaXRlcmFibGUuIFRoZSBjb2RlIGl0ZXJhdGVzIG92ZXIgZWFjaCBkZWZpbml0aW9uIG9mIHRoZSByZXN1bHRpbmdcbiAgICogRG9jdW1lbnROb2RlLiBUaGlzIGJlaGF2aW9yIGRlZmF1bHRzIHRvIHRydWUgYW5kIHNob3VsZCBub3QgaGF2ZSBhbnkgaWxsXG4gICAqIGVmZmVjdHMgb24gY29kZSBleHBlY3RpbmcgdmFuaWxsYSBBU1ROb2RlIG9iamVjdHNcbiAgICogQHJldHVybiB7QVNUTm9kZX0gbnVsbCBpZiBhbiBlcnJvciBvY2N1cnMgYW5kIGVycm9ycyBhcmUgc3VwcHJlc3NlZCxcbiAgICogYSB0b3AgbGV2ZWwgRG9jdW1lbnQgQVNUTm9kZSBvdGhlcndpc2VcbiAgICovXG4gIHN0YXRpYyBwYXJzZShzZGwsIHNob3dFcnJvciA9IGZhbHNlLCBlbmhhbmNlID0gdHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICBkZWJ1Z19sb2coJ1tzdGF0aWMgcGFyc2UoKV0gbm9ybWFsaXppbmcgc291cmNlJylcbiAgICAgIGxldCBzb3VyY2UgPSBub3JtYWxpemVTb3VyY2Uoc2RsKVxuXG4gICAgICBkZWJ1Z19sb2coJ1tzdGF0aWMgcGFyc2UoKV0gcGFyc2luZycpXG4gICAgICBsZXQgbm9kZSA9IHRoaXMuZ3FsLnBhcnNlKHNvdXJjZSlcblxuICAgICAgaWYgKGVuaGFuY2UpIHtcbiAgICAgICAgZGVidWdfbG9nKCdbc3RhdGljIHBhcnNlKCldIGVuaGFuY2luZycpXG4gICAgICAgIG5vZGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuZGVmaW5pdGlvbnMpIHtcbiAgICAgICAgICAgIHlpZWxkIG5vZGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBwYXJzZSgpXSBmYWlsZWQgdG8gcGFyc2UnKVxuICAgICAgZGVidWdfdHJhY2UoJ1tzdGF0aWMgcGFyc2UoKV0gJywgZSlcbiAgICAgIGlmIChzaG93RXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBsaXR0bGUgd3JhcHBlciB1c2VkIHRvIGNhdGNoIGFueSBlcnJvcnMgdGhyb3duIHdoZW4gcHJpbnRpbmcgYW4gQVNUTm9kZVxuICAgKiB0byBzdHJpbmcgZm9ybSB1c2luZyBgcmVxdWlyZSgnZ3JhcGhxbCcpLnByaW50KClgLiBJZiBgc2hvd0Vycm9yYCBpcyB0cnVlXG4gICAqIGFueSB0aHJvd24gZXJyb3JzIHdpbGwgYmUgcmV0aHJvd24sIG90aGVyd2lzZSBudWxsIGlzIHJldHVybmVkIGluc3RlYWQuXG4gICAqXG4gICAqIFNob3VsZCBhbGwgZ28gYXMgcGxhbm5lZCwgYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGEgd3JhcHBlZCB3aXRoIHRoZSBwcmludGVkXG4gICAqIFNETCB3aWxsIGJlIHJldHVybmVkLlxuICAgKlxuICAgKiBAc2luY2UgMS43XG4gICAqXG4gICAqIEBwYXJhbSB7QVNUTm9kZXxHcmFwaFFMU2NoZW1hfSBhc3QgYW4gQVNUTm9kZSwgdXN1YWxseSBhXG4gICAqIERvY3VtZW50Tm9kZSBnZW5lcmF0ZWQgd2l0aCBzb21lIHZlcnNpb24gb2YgYHJlcXVpcmUoJ2dyYXBocWwnKS5wYXJzZSgpYC5cbiAgICogSWYgYW4gaW5zdGFuY2Ugb2YgR3JhcGhRTFNjaGVtYSBpcyBzdXBwbGllZCwgYHByaW50U2NoZW1hKClgIGlzIHVzZWRcbiAgICogaW5zdGVhZCBvZiBgcHJpbnQoKWBcbiAgICogQHBhcmFtIHtib29sZWFuP30gW3Nob3dFcnJvcj1mYWxzZV0gaWYgdHJ1ZSwgYW55IGNhdWdodCBlcnJvcnMgd2lsbCBiZVxuICAgKiB0aHJvd24gb25jZSBhZ2FpblxuICAgKiBAcmV0dXJuIHtTY2hlbWF0YX0gbnVsbCBpZiBhbiBlcnJvciBvY2N1cnMgKGFuZCBzaG93RXJyb3IgaXMgZmFsc2UpXG4gICAqIG9yIGFuIGluc3RhbmNlIG9mIFNjaGVtYXRhIHdyYXBwaW5nIHRoZSByZXN1bHRpbmcgU0RMIHN0cmluZyBmcm9tIHRoZVxuICAgKiBwcmludCBvcGVyYXRpb25cbiAgICovXG4gIHN0YXRpYyBwcmludChhc3QsIHNob3dFcnJvciA9IGZhbHNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBzb3VyY2VcblxuICAgICAgaWYgKGFzdCBpbnN0YW5jZW9mIEdyYXBoUUxTY2hlbWEpIHtcbiAgICAgICAgZGVidWdfbG9nKCdbc3RhdGljIHByaW50KCldIHByaW50aW5nIHNjaGVtYScpXG4gICAgICAgIHNvdXJjZSA9IHRoaXMuZ3FsLnByaW50U2NoZW1hKGFzdClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWJ1Z19sb2coJ1tzdGF0aWMgcHJpbnQoKV0gcHJpbnRpbmcgQVNUTm9kZScpXG4gICAgICAgIHNvdXJjZSA9IHRoaXMuZ3FsLnByaW50KGFzdClcbiAgICAgIH1cblxuICAgICAgZGVidWdfbG9nKCdbc3RhdGljIHByaW50KCldIGNyZWF0aW5nIG5ldyBTY2hlbWF0YSBmcm9tIHByaW50JylcbiAgICAgIHJldHVybiBTY2hlbWF0YS5mcm9tKHNvdXJjZSlcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnX2xvZygnW3N0YXRpYyBwcmludCgpXSBmYWlsZWQgdG8gcHJpbnQnKVxuICAgICAgZGVidWdfdHJhY2UoJ1tzdGF0aWMgcHJpbnQoKV0gJywgZSlcbiAgICAgIGlmIChzaG93RXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBzaW1wbGUgcGFzcyB0aHJ1IHVzZWQgd2l0aGluIHRoZSBjbGFzcyB0byByZWZlcmVuY2UgZ3JhcGhxbCBtZXRob2RzXG4gICAqIGFuZCBjbGFzc2VzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IHRoZSByZXN1bHRzIG9mIGByZXF1aXJlKCdncmFwaHFsJylgXG4gICAqL1xuICBzdGF0aWMgZ2V0IGdxbCgpIHtcbiAgICByZXR1cm4gcmVxdWlyZSgnZ3JhcGhxbCcpXG4gIH1cblxuICAvKipcbiAgICogU2hvcnRoYW5kIHdheSBvZiBpbnZva2luZyBgbmV3IFNjaGVtYXRhKClgXG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZW1hU291cmNlfSB0eXBlRGVmcyBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSwgYSBzdHJpbmcgb2YgU0RMLFxuICAgKiBhIFNvdXJjZSBpbnN0YW5jZSBvZiBTREwsIGEgR3JhcGhRTFNjaGVtYSBvciBBU1ROb2RlIHRoYXQgY2FuIGJlIHByaW50ZWRcbiAgICogYXMgYW4gU0RMIHN0cmluZ1xuICAgKiBAcGFyYW0ge1Jlc29sdmVyTWFwfSBbcmVzb2x2ZXJzPW51bGxdIGFuIG9iamVjdCBjb250YWluaW5nIGZpZWxkIHJlc29sdmVyc1xuICAgKiBmb3IgZm9yIHRoZSBzY2hlbWEgcmVwcmVzZW50ZWQgd2l0aCB0aGlzIHN0cmluZy5cbiAgICogQHBhcmFtIHtib29sZWFufHN0cmluZ30gW2J1aWxkUmVzb2x2ZXJzPWZhbHNlXSBpZiB0aGlzIGZsYWcgaXMgc2V0IHRvXG4gICAqIHRydWUsIGJ1aWxkIGEgc2V0IG9mIHJlc29sdmVycyBhZnRlciB0aGUgcmVzdCBvZiB0aGUgaW5zdGFuY2UgaXNcbiAgICogaW5pdGlhbGl6ZWQgYW5kIHNldCB0aGUgcmVzdWx0cyBvbiB0aGUgYC5yZXNvbHZlcnNgIHByb3BlcnR5IG9mIHRoZSBuZXdseVxuICAgKiBjcmVhdGVkIGluc3RhbmNlLiBJZiBidWlsZFJlc29sdmVycyBpcyB0aGUgc3RyaW5nIFwiYWxsXCIsIHRoZW4gYSByZXNvbHZlclxuICAgKiBmb3IgZWFjaCBmaWVsZCBub3QgZGVmaW5lZCB3aWxsIGJlIHJldHVybmVkIHdpdGggYSBgZGVmYXVsdEZpZWxkUmVzb2x2ZXJgXG4gICAqIGFzIGl0cyB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmbGF0dGVuUmVzb2x2ZXJzPWZhbHNlXSBpZiB0cnVlLCBhbmQgaWYgYGJ1aWxkUmVzb2x2ZXJzYFxuICAgKiBpcyB0cnVlLCB0aGVuIG1ha2UgYW4gYXR0ZW1wdCB0byBmbGF0dGVuIHRoZSByb290IHR5cGVzIHRvIHRoZSBiYXNlIG9mIHRoZVxuICAgKiByZXNvbHZlciBtYXAgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtTY2hlbWF0YX0gYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGFcbiAgICovXG4gIHN0YXRpYyBmcm9tKFxuICAgIHR5cGVEZWZzLFxuICAgIHJlc29sdmVycyA9IG51bGwsXG4gICAgYnVpbGRSZXNvbHZlcnMgPSBmYWxzZSxcbiAgICBmbGF0dGVuUmVzb2x2ZXJzID0gZmFsc2VcbiAgKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHR5cGVEZWZzLCByZXNvbHZlcnMsIGJ1aWxkUmVzb2x2ZXJzLCBmbGF0dGVuUmVzb2x2ZXJzKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCB3YXkgb2YgaW52b2tpbmcgYG5ldyBTY2hlbWF0YSgpYCBhZnRlciB0aGUgZnVuY3Rpb24gcmVhZHMgdGhlXG4gICAqIGNvbnRlbnRzIG9mIHRoZSBmaWxlIHNwZWNpZmllZCBhdCB0aGUgc3VwcGxpZWQgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggcGF0aCB0byB0aGUgZmlsZSB0byByZWFkIHRoZSBjb250ZW50cyBvZlxuICAgKiBAcmV0dXJuIHtTY2hlbWF0YX0gYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGFcbiAgICovXG4gIHN0YXRpYyBhc3luYyBmcm9tQ29udGVudHNPZihwYXRoKSB7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSBwYXRoUmVzb2x2ZShwYXRoKVxuICAgIGNvbnN0IGNvbnRlbnRzID0gKGF3YWl0IHJlYWRGaWxlKHJlc29sdmVkKSk/LnRvU3RyaW5nKClcblxuICAgIHJldHVybiBTY2hlbWF0YS5mcm9tKGNvbnRlbnRzKVxuICB9XG5cbiAgLyoqXG4gICAqIFdhbGtzIGEgZ2l2ZW4gZGlyZWN0b3J5IGFuZCBpdHMgc3ViZGlyZWN0b3JpZXMgdG8gZmluZCBhbnkgZmlsZXMgd2l0aCB0aGVcbiAgICogYC5ncmFwaHFsLy5zZGwvLnR5cGVbZERdZWZgIGV4dGVuc2lvbiB3ZXJlIGZvdW5kLiBJZiBhbiBhZGphY2VudCwgb3JcbiAgICogb3RoZXJ3aXNlIHNwZWNpZmllZCwgZmlsZSB3aXRoIGEgYC5qcy8uY2pzLy5tanNgIGV4dGVuc2lvbiBpcyBmb3VuZCxcbiAgICogYW5kIHN1Y2Nlc3NmdWxseSByZWFkLCB0aGVuIGl0cyByZXNvbHZlcnMgYXJlIGFkZGVkIHRvIHRoZSBmaW5hbCBTY2hlbWF0YVxuICAgKiBvdXRwdXQuIEEgc2NoZW1hIHdpdGggYW55IGFzc29jaWF0ZWQgYWN0aW9uYWJsZSByZXNvbHZlciBpcyByZXR1cm5lZCBhc1xuICAgKiBhbmQgZXhlY3V0YWJsZSBzY2hlbWEuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIGEgZmlsZSBwYXRoIHRvIHRoZSBkaXJlY3Rvcnkgd2hlcmUgc2Nhbm5pbmcgc2hvdWxkXG4gICAqIHN0YXJ0IHRvIG9jY3VyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9dW5kZWZpbmVkXSBhbiBvYmplY3QgdGhhdCBhbGxvd3MgdGhlIGRldmVsb3BlclxuICAgKiB0byBjb25maWd1cmUgaG93IGNvbmZsaWN0cyBhcmUgcmVzb2x2ZWQgKHJhdGhlciB0aGFuIGp1c3QgdGFraW5nIHRoZVxuICAgKiBsYXRlc3QgdmFsdWUgYXMgYW4gb3ZlcnJpZGUgdG8gYW55IHByZXZpb3VzbHkgZXhpc3RpbmcgcmVzb2x2ZXIpIGFzIHdlbGxcbiAgICogYXMgYSB3YXkgdG8gc3BlY2lmeSB3aGVyZSByZXNvbHZlciBmaWxlcyBvZiB0aGUgc2FtZSBuYW1lIGFzIHRoZVxuICAgKiAuZ3JhcGhxbC8uc2RsLy50eXBlRGVmIGZpbGUgc2hvdWxkIGV4aXN0OyBpZiBub3QgYWxvbmdzaWRlIHRoZSBTREwgZmlsZVxuICAgKiBpdHNlbGYuXG4gICAqIEBwYXJhbSB7XG4gICAqICAgZnVuY3Rpb24oXG4gICAqICAgICBleGlzdGluZ1Jlc29sdmVyOiBSZXNvbHZlclByb3BlcnR5LFxuICAgKiAgICAgbmV3UmVzb2x2ZXI6IFJlc29sdmVyUHJvcGVydHlcbiAgICogICApOiBSZXNvbHZlclByb3BlcnR5XG4gICAqIH0gW29wdGlvbnMuY29uZmxpY3RSZXNvbHZlcl0gLSBBIGZ1bmN0aW9uIHRvIHJlc29sdmUgY29uZmxpY3RzIGJldHdlZW5cbiAgICogZXhpc3RpbmcgYW5kIG5ldyByZXNvbHZlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLmdxRXh0c10gLSBBbiBhcnJheSBvZiBleHRlbnNpb25zIHdpdGggYVxuICAgKiBwcmVjZWRpbmcgcGVyaW9kLCB0aGF0IHdpbGwgbWF0Y2ggdGhlIFNETCBmaWxlcyBpbiB0aGUgc3VwcGxpZWQgZGlyZWN0b3J5LlxuICAgKiBUaGlzIGRlZmF1bHRzIHRvIGBbJy5ncmFwaHFsJywgJy5ncWwnLCAnLnNkbCcsICcudHlwZWRlZiddYFxuICAgKiBAcGFyYW0gW3N0cmluZ1tdXSBbb3B0aW9ucy5qc0V4dHNdIC0gQW4gYXJyYXkgb2YgZXh0ZW5zaW9ucyB3aXRoIGFcbiAgICogcHJlY2VkaW5nIHBlcmlvZCwgdGhhdCB3aWxsIG1hdGNoIHRoZSByZXNvbHZlciBKYXZhU2NyaXB0IGZpbGVzLiBUaGlzXG4gICAqIGRlZmF1bHRzIHRvIGBbJy5qcycsICcuY2pzJywgJy5tanMnXWBcbiAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IFtvcHRpb25zLnJlc29sdmVyc1Jvb3RzXSAtIFRoZSByb290IGRpcmVjdG9yeSwgb3JcbiAgICogZGlyZWN0b3JpZXMsIHdoZXJlIHJlc29sdmVyIGZpbGVzIHNob3VsZCBleGlzdC4gSWYgdGhpcyB2YWx1ZSBpcyBmYWxzeSxcbiAgICogdGhlIGV4cGVjdGVkIHJvb3QgaXMgaW4gdGhlIHNhbWUgZGlyZWN0b3J5IGFzIHRoZSBTREwgZmlsZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnByb2plY3RSb290XSAtIFRoZSByb290IGRpcmVjdG9yeSBvZiB0aGUgcHJvamVjdCxcbiAgICogcmVsYXRpdmUgdG8gdGhlIG5lYXJlc3QgcGFja2FnZS5qc29uIGlmIG5vIHZhbHVlIGlzIHN1cHBsaWVkLlxuICAgKiBAcmV0dXJucyB7U2NoZW1hdGE/fSBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSwgb3B0aW9uYWxseSBtYWRlIGV4ZWN1dGFibGVcbiAgICogaWYgYWRqYWNlbnQgb3Igb3RoZXJ3aXNlIHNwZWNpZmllZCAuanMvLnRzLy5janMvLm1qcyBmaWxlcyB3ZXJlIGxvY2F0ZWRcbiAgICovXG4gIHN0YXRpYyBhc3luYyBidWlsZEZyb21EaXIoXG4gICAgcGF0aCxcbiAgICBvcHRpb25zID0ge1xuICAgICAgY29uZmxpY3RSZXNvbHZlcihfLCBuZXdSZXNvbHZlcikgeyByZXR1cm4gbmV3UmVzb2x2ZXIudmFsdWUgfSxcbiAgICAgIGdxRXh0czogWycuZ3JhcGhxbCcsICcuZ3FsJywgJy5zZGwnLCAnLnR5cGVkZWYnXSxcbiAgICAgIGpzRXh0czogWycuanMnLCAnLmNqcycsICcubWpzJ10sXG4gICAgICByZXNvbHZlcnNSb290czogdW5kZWZpbmVkLFxuICAgICAgcHJvamVjdFJvb3Q6IHVuZGVmaW5lZCxcbiAgICB9LFxuICApIHtcbiAgICBjb25zdCBwYXJzZUFuZFJlbW92ZUV4dGVuc2lvbiA9IChwYXRoKSA9PiAoe1xuICAgICAgLy8gcGF0aC5wYXJzZSBvZiBmdWxseSByZXNvbHZlZCBwYXRoIHN0cmluZ1xuICAgICAgLi4ucGF0aFBhcnNlKHBhdGhSZXNvbHZlKHBhdGgpKSxcblxuICAgICAgLy8gcmVtb3ZlIGFueSBleGlzdGluZyBleHRlbnNpb24gYW5kIGNsZWFyIGJhc2Ugc28gcGF0aEZvcm1hdCB3b3Jrc1xuICAgICAgLi4ueyBiYXNlOiAnJywgZXh0OiAnJyB9fVxuICAgIClcblxuICAgIGNvbnN0IGlzRGlyZWN0b3J5ID0gYXN5bmMgcGF0aCA9PiBhd2FpdCBhc3luY1RyeUNhdGNoKFxuICAgICAgYXN5bmMgKCkgPT4gKGF3YWl0IHN0YXQocGF0aCkpLmlzRGlyZWN0b3J5KCksIGZhbHNlXG4gICAgKVxuXG4gICAgY29uc3QgcmVQYXRoRGlyID0gKChhd2FpdCBpc0RpcmVjdG9yeShwYXRoUmVzb2x2ZShwYXRoKSkpXG4gICAgICA/IHBhdGhSZXNvbHZlKHBhdGgpXG4gICAgICA6IHBhdGhSZXNvbHZlKHBhcnNlQW5kUmVtb3ZlRXh0ZW5zaW9uKHBhdGgpLmRpcilcbiAgICApXG4gICAgY29uc3QgcmVQYXRoID0gcmVQYXRoRGlyXG4gICAgY29uc3QgZ3FFeHRzID0gb3B0aW9ucz8uZ3FFeHRzID8/IFsnLmdyYXBocWwnLCAnLmdxbCcsICcuc2RsJywgJy50eXBlZGVmJ11cbiAgICBjb25zdCBqc0V4dHMgPSBvcHRpb25zPy5qc0V4dHMgPz8gWycuanMnLCAnLmNqcycsICcubWpzJywgJy50cyddXG5cbiAgICBjb25zdCB1bmlxdWVTdGVtcyA9IFtcbiAgICAgIC8vIEVuc3VyZSB1bmlxdWUgZmlsZSBwYXRocyAoc2FucyBleHRlbnNpb24pXG4gICAgICAuLi5uZXcgU2V0KGF3YWl0IChcbiAgICAgICAgWy4uLmF3YWl0IHJlYWRkaXIocmVQYXRoLCB7IHJlY3Vyc2l2ZTp0cnVlIH0pXS5yZWR1Y2UoXG4gICAgICAgICAgYXN5bmMgKGFzeW5jUHJldmlvdXMsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzID0gYXdhaXQgYXN5bmNQcmV2aW91cztcbiAgICAgICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aFJlc29sdmUocGF0aEpvaW4ocmVQYXRoLCBjdXJyZW50KSk7XG4gICAgICAgICAgICBjb25zdCBpc0RpciA9IGF3YWl0IGlzRGlyZWN0b3J5KGZ1bGxQYXRoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocHJldmlvdXMsIGZ1bGxQYXRoLCBpc0RpcilcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKCFpc0Rpcikge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzLnB1c2gocGF0aEZvcm1hdChwYXJzZUFuZFJlbW92ZUV4dGVuc2lvbihmdWxsUGF0aCkpKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoc2tpcCkgeyB9XG5cbiAgICAgICAgICAgIHJldHVybiBwcmV2aW91c1xuICAgICAgICAgIH0sIFtdXG4gICAgICAgIClcbiAgICAgICkpXG4gICAgXVxuXG4gICAgY29uc3QgY29uZmxpY3RSZXNvbHZlciA9IG9wdGlvbnM/LmNvbmZsaWN0UmVzb2x2ZXIgPz8gKChfLG4pID0+IG4udmFsdWUpXG4gICAgY29uc3QgcHJvamVjdFJvb3QgPSBvcHRpb25zPy5wcm9qZWN0Um9vdCA/PyBhd2FpdCBndWVzc1Byb2plY3RSb290KClcbiAgICBjb25zdCByZXNvbHZlclJvb3RzID0gb3B0aW9ucz8ucmVzb2x2ZXJSb290c1xuICAgICAgPyAoQXJyYXkuaXNBcnJheShvcHRpb25zPy5yZXNvbHZlclJvb3RzKVxuICAgICAgICA/IG9wdGlvbnM/LnJlc29sdmVyUm9vdHNcbiAgICAgICAgOiBbU3RyaW5nKG9wdGlvbnM/LnJlc29sdmVyUm9vdHMpXVxuICAgICAgKVxuICAgICAgOiBbcmVQYXRoXVxuXG5cbiAgICBjb25zdCBwYXRocyA9IHtcbiAgICAgIHNkbDogW10sXG4gICAgICByZXNvbHZlcjogW10sXG4gICAgICB1bmtub3duOiBbXSxcbiAgICAgIGhhc1ZhbHVlczogZmFsc2UsXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coe3VuaXF1ZVN0ZW1zLCBwcm9qZWN0Um9vdCwgcmVzb2x2ZXJSb290c30pXG5cbiAgICBmb3IgKGNvbnN0IHJlc29sdmVyUm9vdCBvZiByZXNvbHZlclJvb3RzKSB7XG4gICAgICBmb3IgKGNvbnN0IHN0ZW0gb2YgdW5pcXVlU3RlbXMpIHtcbiAgICAgICAgY29uc3Qgc3RlbVBhcnNlZCA9IHBhcnNlQW5kUmVtb3ZlRXh0ZW5zaW9uKHN0ZW0pXG4gICAgICAgIGNvbnN0IHJvb3RSZWxhdGl2ZSA9IHJlc29sdmVyUm9vdC5pbmNsdWRlcyhwcm9qZWN0Um9vdClcbiAgICAgICAgICA/IHBhdGhSZXNvbHZlKHBhdGhKb2luKHBhdGhSZWxhdGl2ZShwcm9qZWN0Um9vdCwgcmVzb2x2ZXJSb290KSwgc3RlbVBhcnNlZC5uYW1lKSlcbiAgICAgICAgICA6IHBhdGhSZXNvbHZlKHBhdGhKb2luKHJlc29sdmVyUm9vdCwgc3RlbVBhcnNlZC5uYW1lKSlcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHJlc29sdmVkUGF0aHMocm9vdFJlbGF0aXZlLCBbLi4uZ3FFeHRzLCAuLi5qc0V4dHNdKVxuICAgICAgICBjb25zb2xlLmxvZyh7IHJvb3RSZWxhdGl2ZSwgcmVzdWx0cyB9KVxuXG4gICAgICAgIGlmIChyZXN1bHRzLmhhc1ZhbHVlcykge1xuICAgICAgICAgIHBhdGhzLnNkbCA9IHBhdGhzLnNkbC5jb25jYXQocmVzdWx0cy5zZGwpXG4gICAgICAgICAgcGF0aHMucmVzb2x2ZXIgPSBwYXRocy5yZXNvbHZlci5jb25jYXQocmVzdWx0cy5yZXNvbHZlcilcbiAgICAgICAgICBwYXRocy51bmtub3duID0gcGF0aHMudW5rbm93bi5jb25jYXQocmVzdWx0cy51bmtub3duKVxuICAgICAgICAgIHBhdGhzLmhhc1ZhbHVlcyA9IHBhdGhzLmhhc1ZhbHVlcyB8fCByZXN1bHRzLmhhc1ZhbHVlc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBwYXRocyB9KVxuICAgIGNvbnN0IHsgc2NoZW1hdGEgfSA9IGF3YWl0IGltcG9ydFJlc29sdmVkR3JhcGhRTChwYXRocywgeyBjb25mbGljdFJlc29sdmVyIH0pXG5cbiAgICByZXR1cm4gc2NoZW1hdGFcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdGFudCB1c2VkIHdpdGggYGZvckVhY2hPZigpYCB0aGF0IHNpZ25pZmllcyB5b3Ugd2lzaCB0byBpdGVyYXRlXG4gICAqIG92ZXIgZXZlcnkgYXZhaWxhYmxlIHR5cGUgd2l0aGluIHRoZSBzY2hlbWEuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IEFMTCgpIHtcbiAgICByZXR1cm4gQUxMXG4gIH1cblxuICAvKipcbiAgICogQ29uc3RhbnQgdXNlZCB3aXRoIGBmb3JFYWNoT2YoKWAgdGhhdCBzaWduaWZpZXMgeW91IHdpc2ggdG8gaXRlcmF0ZVxuICAgKiBvdmVyIGV2ZXJ5IGF2YWlsYWJsZSB0eXBlIHdpdGhpbiB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGdldCBUWVBFUygpIHtcbiAgICByZXR1cm4gVFlQRVNcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdGFudCB1c2VkIHdpdGggYGZvckVhY2hPZigpYCB0aGF0IHNpZ25pZmllcyB5b3Ugd2lzaCB0byBpdGVyYXRlXG4gICAqIG92ZXIgZXZlcnkgYXZhaWxhYmxlIGludGVyZmFjZSB3aXRoaW4gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyBnZXQgSU5URVJGQUNFUygpIHtcbiAgICByZXR1cm4gSU5URVJGQUNFU1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0YW50IHVzZWQgd2l0aCBgZm9yRWFjaE9mKClgIHRoYXQgc2lnbmlmaWVzIHlvdSB3aXNoIHRvIGl0ZXJhdGVcbiAgICogb3ZlciBldmVyeSBhdmFpbGFibGUgZW51bSB3aXRoaW4gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyBnZXQgRU5VTVMoKSB7XG4gICAgcmV0dXJuIEVOVU1TXG4gIH1cblxuICAvKipcbiAgICogQ29uc3RhbnQgdXNlZCB3aXRoIGBmb3JFYWNoT2YoKWAgdGhhdCBzaWduaWZpZXMgeW91IHdpc2ggdG8gaXRlcmF0ZVxuICAgKiBvdmVyIGV2ZXJ5IGF2YWlsYWJsZSB1bmlvbiB3aXRoaW4gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyBnZXQgVU5JT05TKCkge1xuICAgIHJldHVybiBVTklPTlNcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdGFudCB1c2VkIHdpdGggYGZvckVhY2hPZigpYCB0aGF0IHNpZ25pZmllcyB5b3Ugd2lzaCB0byBpdGVyYXRlXG4gICAqIG92ZXIgZXZlcnkgYXZhaWxhYmxlIHNjYWxhciB3aXRoaW4gdGhlIHNjaGVtYS5cbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIHN0YXRpYyBnZXQgU0NBTEFSUygpIHtcbiAgICByZXR1cm4gU0NBTEFSU1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0YW50IHVzZWQgd2l0aCBgZm9yRWFjaE9mKClgIHRoYXQgc2lnbmlmaWVzIHlvdSB3aXNoIHRvIGl0ZXJhdGVcbiAgICogb3ZlciBldmVyeSBhdmFpbGFibGUgcm9vdCB0eXBlOyBRdWVyeSwgTXV0YXRpb24gYW5kIFN1YnNjcmlwdGlvblxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGdldCBST09UX1RZUEVTKCkge1xuICAgIHJldHVybiBST09UX1RZUEVTXG4gIH1cblxuICAvKipcbiAgICogQ29uc3RhbnQgdXNlZCB3aXRoIGBmb3JFYWNoT2YoKWAgdGhhdCBzaWduaWZpZXMgeW91IHdpc2ggdG8gaXRlcmF0ZVxuICAgKiBvdmVyIGV2ZXJ5IGF2YWlsYWJsZSBHcmFwaFFMSW5wdXRPYmplY3RUeXBlIHdpdGhpbiB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGdldCBJTlBVVF9UWVBFUygpIHtcbiAgICByZXR1cm4gSU5QVVRfVFlQRVNcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdGFudCB1c2VkIHdpdGggYGZvckVhY2hPZigpYCB0aGF0IHNpZ25pZmllcyB5b3UgYWxzbyB3aXNoIHRvXG4gICAqIGl0ZXJhdGUgb3ZlciB0aGUgbWV0YSB0eXBlcy4gVGhlc2UgYXJlIGRlbm90ZWQgYnkgYSBsZWFkaW5nIGRvdWJsZVxuICAgKiB1bmRlcnNjb3JlLlxuICAgKlxuICAgKiBDYW4gYmUgT1InZWQgdG9nZXRoZXIgc3VjaCBhcyBgU2NoZW1hdGEuVFlQRVMgfCBTY2hlbWF0YS5ISURERU5gXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IEhJRERFTigpIHtcbiAgICByZXR1cm4gSElEREVOXG4gIH1cblxuICAvKipcbiAgICAgKiBSZXR1cm5zIGEgR3JhcGhRTFNjaGVtYSBvYmplY3QuIE5vdGUgdGhpcyB3aWxsIGZhaWwgYW5kIHRocm93IGFuIGVycm9yXG4gICAgICogaWYgdGhlcmUgaXMgbm90IGF0IGxlYXN0IG9uZSBRdWVyeSwgU3Vic2NyaXB0aW9uIG9yIE11dGF0aW9uIHR5cGUgZGVmaW5lZC5cbiAgICAgKiBJZiB0aGVyZSBpcyBubyBzdG9yZWQgc2NoZW1hLCBhbmQgdGhlcmUgYXJlIHJlc29sdmVycywgYW4gZXhlY3V0YWJsZVxuICAgICAqIHNjaGVtYSBpcyByZXR1cm5lZCBpbnN0ZWFkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7R3JhcGhRTFNjaGVtYX0gYW4gaW5zdGFuY2Ugb2YgR3JhcGhRTFNjaGVtYSBpZiB2YWxpZCBTRExcbiAgICAgKi9cbiAgI2dlbmVyYXRlU2NoZW1hKCkge1xuICAgIGNvbnN0IENsYXNzID0gdGhpcy5jb25zdHJ1Y3RvclxuICAgIGNvbnN0IHJlc29sdmVycyA9IHRoaXMucmVzb2x2ZXJzXG4gICAgbGV0IHNjaGVtYVxuXG4gICAgLy8gSWYgd2UgaGF2ZSBhIGdlbmVyYXRlZCBzY2hlbWEgYWxyZWFkeSBhbmQgdGhpcyBpbnN0YW5jZSBoYXMgYVxuICAgIC8vIHJlc29sdmVycyBvYmplY3QgdGhhdCBpcyBub3QgZmFsc2V5LCBjaGVjayB0byBzZWUgaWYgdGhlIG9iamVjdFxuICAgIC8vIGhhcyB0aGUgZXhlY3V0YWJsZSBzY2hlbWEgZmxhZyBzZXQgb3Igbm90LiBJZiBzbywgc2ltcGx5IHJldHVyblxuICAgIC8vIHRoZSBwcmUtZXhpc3Rpbmcgb2JqZWN0IHJhdGhlciB0aGFuIGNyZWF0ZSBhIG5ldyBvbmUuXG4gICAgaWYgKHRoaXNbTUFQXS5nZXQod21rU2NoZW1hKSkge1xuICAgICAgc2NoZW1hID0gdGhpc1tNQVBdLmdldCh3bWtTY2hlbWEpXG5cbiAgICAgIGlmIChyZXNvbHZlcnMpIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIHRoZSBleGVjdXRhYmxlIHNjaGVtYSBmbGFnXG4gICAgICAgIGlmIChzY2hlbWE/LltFWEVdKSB7XG4gICAgICAgICAgcmV0dXJuIHNjaGVtYVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChzY2hlbWEpIHtcbiAgICAgICAgcmV0dXJuIHNjaGVtYVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF0dGVtcHQgdG8gZ2VuZXJhdGUgYSBzY2hlbWEgdXNpbmcgdGhlIFNETCBmb3IgdGhpcyBpbnN0YW5jZS4gVGhyb3dcbiAgICAvLyBhbiBlcnJvciBpZiB0aGUgU0RMIGlzIGluc3VmZmljaWVudCB0byBnZW5lcmF0ZSBhIEdyYXBoUUxTY2hlbWEgb2JqZWN0XG4gICAgdHJ5IHtcbiAgICAgIGRlYnVnX2xvZygnW2dldCAuc2NoZW1hXSBjcmVhdGluZyBzY2hlbWEgZnJvbSBTREwnKVxuICAgICAgdGhpc1tNQVBdLnNldCh3bWtTY2hlbWEsIChzY2hlbWEgPSBDbGFzcy5idWlsZFNjaGVtYSh0aGlzLnNkbCwgdHJ1ZSkpKVxuXG4gICAgICAvLyBOb3cgdHJ5IHRvIGhhbmRsZSBhbmQgT2JqZWN0VHlwZUV4dGVuc2lvbnNcbiAgICAgIGxldCBhc3QgPSB0aGlzLmFzdFxuXG4gICAgICBhc3QuZGVmaW5pdGlvbnMgPSBbXS5jb25jYXQoYXN0LmRlZmluaXRpb25zLmZpbHRlcihcbiAgICAgICAgaSA9PiBpLmtpbmQgPT0gJ09iamVjdFR5cGVFeHRlbnNpb24nXG4gICAgICApKVxuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzW01BUF0uc2V0KHdta1NjaGVtYSwgKHNjaGVtYSA9IGV4dGVuZFNjaGVtYShzY2hlbWEsIGFzdCkpKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGRlYnVnX2xvZygnW2dldCAuc2NoZW1hXSBmYWlsZWQgdG8gaGFuZGxlIGV4dGVuZGVkIHR5cGVzJylcbiAgICAgICAgZGVidWdfdHJhY2UoJ1tnZXQgLnNjaGVtYV0gRVJST1IhJywgZXJyb3IpXG4gICAgICB9XG5cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBkZWJ1Z19sb2coJ1tnZXQgLnNjaGVtYV0gZmFpbGVkIHRvIGNyZWF0ZSBzY2hlbWEnKVxuICAgICAgZGVidWdfdHJhY2UoJ1tnZXQgLnNjaGVtYV0gRVJST1IhJywgZXJyb3IpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIC8vIE9ubHkgaXRlcmF0ZSBvdmVyIHRoZSBmaWVsZHMgaWYgdGhlcmUgYXJlIHJlc29sdmVycyBzZXRcbiAgICBpZiAocmVzb2x2ZXJzKSB7XG4gICAgICBmb3JFYWNoRmllbGQoXG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgKFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgdHlwZURpcmVjdGl2ZXMsXG4gICAgICAgICAgZmllbGQsXG4gICAgICAgICAgZmllbGROYW1lLFxuICAgICAgICAgIGZpZWxkQXJncyxcbiAgICAgICAgICBmaWVsZERpcmVjdGl2ZXMsXG4gICAgICAgICAgc2NoZW1hLFxuICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgaWYgKGlzUm9vdFR5cGUodHlwZSkgJiYgcmVzb2x2ZXJzW2ZpZWxkTmFtZV0pIHtcbiAgICAgICAgICAgIGZpZWxkLnJlc29sdmUgPSByZXNvbHZlcnNbZmllbGROYW1lXVxuICAgICAgICAgICAgZmllbGQuYXN0Tm9kZS5yZXNvbHZlID0gcmVzb2x2ZXJzW2ZpZWxkTmFtZV1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmVzb2x2ZXJzPy5bdHlwZU5hbWVdPy5bZmllbGROYW1lXSkge1xuICAgICAgICAgICAgZmllbGQucmVzb2x2ZSA9IHJlc29sdmVyc1t0eXBlTmFtZV1bZmllbGROYW1lXVxuICAgICAgICAgICAgZmllbGQuYXN0Tm9kZS5yZXNvbHZlID0gcmVzb2x2ZXJzW3R5cGVOYW1lXVtmaWVsZE5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG5cbiAgICAgIHRoaXMucmVzb2x2ZXJJbmZvLmZvckVhY2gocmVzb2x2ZXJJbmZvID0+IHtcbiAgICAgICAgcmVzb2x2ZXJJbmZvLmFwcGx5VG8oc2NoZW1hKVxuICAgICAgfSlcblxuICAgICAgc2NoZW1hW0VYRV0gPSB0cnVlXG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBnZW5lcmF0ZWQgc2NoZW1hIGluIHRoZSB3ZWFrIG1hcCB1c2luZyB0aGUgd2VhayBtYXAga2V5XG4gICAgdGhpc1tNQVBdLnNldCh3bWtTY2hlbWEsIHNjaGVtYSlcblxuICAgIHJldHVybiBzY2hlbWFcbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGFuIHR5cGUsIGRldGVybWluZSBpZiB0aGUgdHlwZSBpcyBhIHJvb3QgdHlwZTsgaS5lLiBvbmUgb2YgUXVlcnksXG4gKiBNdXRhdGlvbiBvciBTdWJzY3JpcHRpb24gYXMgZGVmaW5lZCBpbiB0aGUgYGdyYXBocWxgIGxpYnJhcnkuXG4gKlxuICogQHBhcmFtICB7dW5rbm93bn0gdCBhIEdyYXBoUUwgQVNUIG9yIG9iamVjdCB0eXBlIGRlbm90aW5nIGEgc2NoZW1hIHR5cGVcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHR5cGUgc3VwcGxpZWQgaXMgYSByb290IHR5cGU7IGZhbHNlIG90aGVyd2lzZVxuICovXG5leHBvcnQgY29uc3QgaXNSb290VHlwZSA9IHQgPT4ge1xuICBpZiAodCA9PT0gdW5kZWZpbmVkIHx8IHQgPT09IG51bGwgfHwgIXQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgdCBpbnN0YW5jZW9mIEdyYXBoUUxPYmplY3RUeXBlICYmXG4gICAgWydRdWVyeScsICdNdXRhdGlvbicsICdTdWJzY3JpcHRpb24nXS5pbmNsdWRlcyh0Lm5hbWUpXG4gIClcbn1cblxuLyoqXG4gKiBMb29wcyBvdmVyIHRoZSBgcmVzb2x2ZXJJbmplY3RvcnNgIGluIHRoZSBzdXBwbGllZCBjb25maWcgb2JqZWN0IGFuZFxuICogbGV0cyBlYWNoIHN1cHBsaWVkIGZ1bmN0aW9uIGhhdmUgYSBwYXNzIHRvIGluc3BlY3Qgb3IgbW9kaWZ5IHRoZSBwYXJhbWV0ZXJzXG4gKiB0aGF0IHdpbGwgYmUgdXNlZCB0byBiaW5kIGZ1dHVyZSByZXNvbHZlciBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtNZXJnZU9wdGlvbnNDb25maWd9IGNvbmZpZyBhIGNvbmZpZyBvYmplY3Qgd2l0aCBhbiBhcnJheSBvZlxuICogYFJlc29sdmVyQXJnc1RyYW5zZm9ybWVyYCBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7UmVzb2x2ZXJBcmdzfSBhcmdzIGFuIG9iamVjdCB3aXRoIGBzb3VyY2VgLCBgYXJnc2AsIGBjb250ZXh0YFxuICogYW5kIGBpbmZvYFxuICogQHJldHVybiB7UmVzb2x2ZXJBcmdzfSBhIHJlc3VsdGluZyBvYmplY3Qgd2l0aCBgc291cmNlYCwgYGFyZ3NgLFxuICogYGNvbnRleHRgIGFuZCBgaW5mb2BcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJ1bkluamVjdG9ycyhjb25maWcsIHJlc29sdmVyQXJncykge1xuICBsZXQgYXJnczogUmVzb2x2ZXJBcmdzXG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbmZpZy5yZXNvbHZlckluamVjdG9ycykpIHtcbiAgICBjb25maWcucmVzb2x2ZXJJbmplY3RvcnMgPSBbY29uZmlnLnJlc29sdmVySW5qZWN0b3JzXVxuICB9XG5cbiAgZm9yIChsZXQgaW5qZWN0b3Igb2YgY29uZmlnLnJlc29sdmVySW5qZWN0b3JzKSB7XG4gICAgYXJncyA9IGluamVjdG9yKHJlc29sdmVyQXJncylcbiAgfVxuXG4gIHJldHVybiBhcmdzXG59XG5cbi8qKlxuICogVGhlIG1lcmdlIG9wdGlvbnMgY29uZmlnIHRha2VzIHRoZSBhcmd1bWVudHMgcGFzc2VkIGludG8gYSBnaXZlbiBgcmVzb2x2ZSgpYFxuICogZnVuY3Rpb24sIGFsbG93aW5nIHRoZSBpbXBsZW1lbnRvciB0byBtb2RpZnkgdGhlIHZhbHVlcyBiZWZvcmUgcGFzc2luZyB0aGVtXG4gKiBiYWNrIG91dC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc2NoZW1hIHRvIGluamVjdCBpbnRvIHRoZSBpbmZvIG9iamVjdCwgb3IgZm91cnRoXG4gKiBwYXJhbWV0ZXIsIHBhc3NlZCB0byBhbnkgcmVzb2x2ZXIuIEFueSBgZXh0cmFDb25maWdgIG9iamVjdCBhZGRlZCBpbiB3aWxsXG4gKiBoYXZlIGl0cyByZXNvbHZlckluamVjdG9ycyBhZGRlZCB0byB0aGUgbGlzdCB0byBiZSBwcm9jZXNzZWQuXG4gKlxuICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hfSBzY2hlbWEgdGhlIEdyYXBoUUxTY2hlbWEgb2JqZWN0IGJlaW5nIGluc2VydGVkXG4gKiBAcGFyYW0ge01lcmdlT3B0aW9uc0NvbmZpZ30gZXh0cmFDb25maWcgYW4gb3B0aW9uYWwgZXh0cmFDb25maWcgb3B0aW9uIHRvXG4gKiBtZXJnZSB3aXRoIHRoZSByZXN1bHRpbmcgb3V0cHV0XG4gKiBAcmV0dXJuIHtNZXJnZU9wdGlvbnNDb25maWd9IGEgTWVyZ2VPcHRpb25zQ29uZmlnIG9iamVjdCB0aGF0IGNvbnRhaW5zIGF0XG4gKiBsZWFzdCBhIHNpbmdsZSBgUmVzb2x2ZXJBcmdzVHJhbnNmb3JtZXJgIHdoaWNoIGluamVjdHMgdGhlIHN1cHBsaWVkIGBzY2hlbWFgXG4gKiBpbnRvIHRoZSBgaW5mb2Agb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gU2NoZW1hSW5qZWN0b3JDb25maWcoc2NoZW1hLCBleHRyYUNvbmZpZykge1xuICBsZXQgYmFzZUNvbmZpZyA9IHtcbiAgICByZXNvbHZlckluamVjdG9yczogW1xuICAgICAgZnVuY3Rpb24gX19zY2hlbWFfaW5qZWN0b3JfXyh7IHNvdXJjZSwgYXJncywgY29udGV4dCwgaW5mbyB9KSB7XG4gICAgICAgIGluZm8uc2NoZW1hID0gc2NoZW1hIHx8IGluZm8uc2NoZW1hXG4gICAgICAgIHJldHVybiB7IHNvdXJjZSwgYXJncywgY29udGV4dCwgaW5mbyB9XG4gICAgICB9LFxuICAgIF0sXG4gIH1cblxuICBpZiAoZXh0cmFDb25maWcpIHtcbiAgICBpZiAoZXh0cmFDb25maWcucmVzb2x2ZXJJbmplY3RvcnMpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShleHRyYUNvbmZpZy5yZXNvbHZlckluamVjdG9ycykpIHtcbiAgICAgICAgYmFzZUNvbmZpZy5yZXNvbHZlckluamVjdG9ycy5wdXNoKGV4dHJhQ29uZmlnLnJlc29sdmVySW5qZWN0b3JzKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGJhc2VDb25maWcucmVzb2x2ZXJJbmplY3RvcnMgPSBiYXNlQ29uZmlnLnJlc29sdmVySW5qZWN0b3JzLmNvbmNhdChcbiAgICAgICAgICBleHRyYUNvbmZpZy5yZXNvbHZlckluamVjdG9yc1xuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJhc2VDb25maWdcbn1cblxuLyoqXG4gKiBXYWxrIHRoZSBzdXBwbGllZCBHcmFwaFFMU2NoZW1hIGluc3RhbmNlIGFuZCByZXRyaWV2ZSB0aGUgcmVzb2x2ZXJzIHN0b3JlZFxuICogb24gaXQuIFRoZXNlIHZhbHVlcyBhcmUgdGhlbiByZXR1cm5lZCB3aXRoIGEgW3R5cGVOYW1lXVtmaWVsZE5hbWVdIHBhdGhpbmdcbiAqXG4gKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWF9IHNjaGVtYSBhbiBpbnN0YW5jZSBvZiBHcmFwaFFMU2NoZW1hXG4gKiBAcmV0dXJuIHtSZXNvbHZlck1hcD99IGFuIG9iamVjdCBjb250YWluaW5nIGEgbWFwcGluZyBvZiB0eXBlTmFtZS5maWVsZE5hbWVcbiAqIHRoYXQgbGlua3MgdG8gdGhlIHJlc29sdmUoKSBmdW5jdGlvbiBpdCBpcyBhc3NvY2lhdGVkIHdpdGhpbiB0aGUgc3VwcGxpZWRcbiAqIHNjaGVtYVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaXBSZXNvbHZlcnNGcm9tU2NoZW1hKHNjaGVtYSkge1xuICBsZXQgcmVzb2x2ZXJzID0ge31cblxuICBpZiAoIXNjaGVtYSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBmb3JFYWNoRmllbGQoXG4gICAgc2NoZW1hLFxuICAgIChcbiAgICAgIHR5cGUsXG4gICAgICB0eXBlTmFtZSxcbiAgICAgIHR5cGVEaXJlY3RpdmVzLFxuICAgICAgZmllbGQsXG4gICAgICBmaWVsZE5hbWUsXG4gICAgICBmaWVsZEFyZ3MsXG4gICAgICBmaWVsZERpcmVjdGl2ZXMsXG4gICAgICBfc2NoZW1hLFxuICAgICAgY29udGV4dFxuICAgICkgPT4ge1xuICAgICAgaWYgKGZpZWxkLnJlc29sdmUpIHtcbiAgICAgICAgcmVzb2x2ZXJzW3R5cGVOYW1lXSA9IHJlc29sdmVyc1t0eXBlTmFtZV0gfHwge31cbiAgICAgICAgcmVzb2x2ZXJzW3R5cGVOYW1lXVtmaWVsZE5hbWVdID0gcmVzb2x2ZXJzW3R5cGVOYW1lXVtmaWVsZE5hbWVdIHx8IHt9XG4gICAgICAgIHJlc29sdmVyc1t0eXBlTmFtZV1bZmllbGROYW1lXSA9IGZpZWxkLnJlc29sdmVcbiAgICAgIH1cbiAgICB9XG4gIClcblxuICByZXR1cm4gcmVzb2x2ZXJzXG59XG5cbi8qKiBAdHlwZSB7U3ltYm9sfSBhIHVuaXF1ZSBzeW1ib2wgdXNlZCBhcyBhIGtleSB0byBhbGwgaW5zdGFuY2Ugc2RsIHN0cmluZ3MgKi9cbmV4cG9ydCBjb25zdCBUWVBFREVGU19LRVkgPSBTeW1ib2woJ2ludGVybmFsLXR5cGVkZWZzLWtleScpXG5cbi8qKiBAdHlwZSB7U3ltYm9sfSBhIGNvbnN0YW50IHN5bWJvbCB1c2VkIGFzIGEga2V5IHRvIGEgZmxhZyBmb3IgZXhwcmVzcy1ncWwgKi9cbmV4cG9ydCBjb25zdCBHUkFQSElRTF9GTEFHID0gU3ltYm9sLmZvcignaW50ZXJuYWwtZ3JhcGhpcWwta2V5JylcblxuLyoqIEB0eXBlIHtTeW1ib2x9IGEgY29uc3RhbnQgc3ltYm9sIHVzZWQgYXMgYSBrZXkgdG8gYSBmbGFnIGZvciBleHByZXNzLWdxbCAqL1xuZXhwb3J0IGNvbnN0IFNDSEVNQV9ESVJFQ1RJVkVTID0gU3ltYm9sLmZvcignaW50ZXJuYWwtZGlyZWN0aXZlcy1rZXknKVxuXG4vKiogQHR5cGUge1N5bWJvbH0gYSB1bmlxdWUgc3ltYm9sIHVzZWQgYXMgYSBrZXkgdG8gYWxsIGluc3RhbmNlIGBXZWFrTWFwYHMgKi9cbmV4cG9ydCBjb25zdCBNQVAgPSBTeW1ib2woJ2ludGVybmFsLXdlYWstbWFwLWtleScpXG5cbi8qKiBAdHlwZSB7U3ltYm9sfSBhIGtleSB1c2VkIHRvIHN0b3JlIHRoZSBfX2V4ZWN1dGFibGVfXyBmbGFnIG9uIGEgc2NoZW1hICovXG5leHBvcnQgY29uc3QgRVhFID0gU3ltYm9sKCdleGVjdXRhYmxlLXNjaGVtYScpXG5cbi8qKiBAdHlwZSB7T2JqZWN0fSBhIGtleSB1c2VkIHRvIHN0b3JlIGEgcmVzb2x2ZXIgb2JqZWN0IGluIGEgV2Vha01hcCAqL1xuY29uc3Qgd21rUmVzb2x2ZXJzID0gT2JqZWN0KFN5bWJvbCgnR3JhcGhRTCBSZXNvbHZlcnMgc3RvcmFnZSBrZXknKSlcblxuLyoqIEB0eXBlIHtPYmplY3R9IGEga2V5IHVzZWQgdG8gc3RvcmUgYW4gaW50ZXJuYWwgc2NoZW1hIGluIGEgV2Vha01hcCAqL1xuY29uc3Qgd21rU2NoZW1hID0gT2JqZWN0KFN5bWJvbCgnR3JhcGhRTFNjaGVtYSBzdG9yYWdlIGtleScpKVxuXG4vKipcbiAqIFRoaXMgaXMgYSBgU3ltYm9sYCBrZXkgdG8gYSBgV2Vha1NldGAgb2YgYEV4dGVuZGVkUmVzb2x2ZXJNYXBgIGluc3RhbmNlcyxcbiAqIGVhY2ggb2Ygd2hpY2ggaGF2ZSBhdCBsZWFzdCB0aHJlZSBwcm9wZXJ0aWVzOlxuICpcbiAqICAtIHNjaGVtYVxuICogIC0gc2RsXG4gKiAgLSByZXNvbHZlcnNcbiAqXG4gKiBPbmUgb2YgdGhlc2UgYXJlIGNyZWF0ZWQgYW5kIGFkZGVkIHRvIHRoZSBzZXQgd2hlbmV2ZXIgYSBtZXJnZVNjaGVtYSBpc1xuICogcGVyZm9ybWVkLiBPbiBlYWNoIHN1YnNlcXVlbnQgbWVyZ2VTREwvU2NoZW1hIGEgbmV3IGluc3RhbmNlIGlzIGFkZGVkIHN1Y2hcbiAqIHRoYXQgbmV3IHZlcnNpb25zIGV4aXN0IHRvIGJlIHdyYXBwZWQgYW5ld1xuICpcbiAqIEB0eXBlIHtbdHlwZV19XG4gKi9cbmNvbnN0IHdta1ByZWJvdW5kUmVzb2x2ZXJzID0gT2JqZWN0KFN5bWJvbCgnUmVzb2x2ZXJzIHByZS1tZXJnZS13cmFwcGVkJykpXG5cbi8qKlxuICogVGhlIGRlZmF1bHQgZmllbGQgcmVzb2x2ZXIgYmxpbmRseSB0YWtlcyByZXR1cm5zIHRoZSByaWdodCBmaWVsZC4gVGhpc1xuICogcmVzb2x2ZXIgaXMgdXNlZCB3aGVuIG9uZSBpcyBub3Qgc3BlY2lmaWVkLlxuICpcbiAqIEBwYXJhbSB7QVNUTm9kZX0gbGVmdFR5cGUgVGhlIG1hdGNoaW5nIGxlZnQgdHlwZSBpbmRpY2F0aW5nIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0ZpZWxkTm9kZX0gbGVmdEZpZWxkIFRoZSBmaWVsZCBjYXVzaW5nIHRoZSBjb25mbGljdFxuICogQHBhcmFtIHtBU1ROb2RlfSByaWdodFR5cGUgVGhlIG1hdGNoaW5nIHJpZ2h0IHR5cGUgaW5kaWNhdGluZyBjb25mbGljdFxuICogQHBhcmFtIHtGaWVsZE5vZGV9IHJpZ2h0RmllbGQgdGhlIGZpZWxkIGNhdXNlIHRoZSBjb25mbGljdFxuICpcbiAqIEByZXR1cm4ge0ZpZWxkTm9kZX0gdGhlIGZpZWxkIHRoYXQgc2hvdWxkIGJlIHVzZWQgYWZ0ZXIgcmVzb2x1dGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gRGVmYXVsdEZpZWxkTWVyZ2VSZXNvbHZlcihcbiAgbGVmdFR5cGUsXG4gIGxlZnRGaWVsZCxcbiAgcmlnaHRUeXBlLFxuICByaWdodEZpZWxkXG4pIHtcbiAgcmV0dXJuIHJpZ2h0RmllbGRcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBkaXJlY3RpdmUgcmVzb2x2ZXIgYmxpbmRseSB0YWtlcyByZXR1cm5zIHRoZSByaWdodCBmaWVsZC4gVGhpc1xuICogcmVzb2x2ZXIgaXMgdXNlZCB3aGVuIG9uZSBpcyBub3Qgc3BlY2lmaWVkLlxuICpcbiAqIEBwYXJhbSB7QVNUTm9kZX0gbGVmdFR5cGUgVGhlIG1hdGNoaW5nIGxlZnQgdHlwZSBpbmRpY2F0aW5nIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0RpcmVjdGl2ZU5vZGV9IGxlZnREaXJlY3RpdmUgVGhlIGZpZWxkIGNhdXNpbmcgdGhlIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0FTVE5vZGV9IHJpZ2h0VHlwZSBUaGUgbWF0Y2hpbmcgcmlnaHQgdHlwZSBpbmRpY2F0aW5nIGNvbmZsaWN0XG4gKiBAcGFyYW0ge0RpcmVjdGl2ZU5vZGV9IHJpZ2h0RGlyZWN0aXZlIHRoZSBmaWVsZCBjYXVzZSB0aGUgY29uZmxpY3RcbiAqXG4gKiBAcmV0dXJuIHtEaXJlY3RpdmVOb2RlfSB0aGUgZGlyZWN0aXZlIHRoYXQgc2hvdWxkIGJlIHVzZWQgYWZ0ZXIgcmVzb2x1dGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gRGVmYXVsdERpcmVjdGl2ZU1lcmdlUmVzb2x2ZXIoXG4gIGxlZnRUeXBlLFxuICBsZWZ0RGlyZWN0aXZlLFxuICByaWdodFR5cGUsXG4gIHJpZ2h0RGlyZWN0aXZlLFxuKSB7XG4gIHJldHVybiByaWdodERpcmVjdGl2ZVxufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZpZWxkIHJlc29sdmVyIGJsaW5kbHkgdGFrZXMgcmV0dXJucyB0aGUgcmlnaHQgZmllbGQuIFRoaXNcbiAqIHJlc29sdmVyIGlzIHVzZWQgd2hlbiBvbmUgaXMgbm90IHNwZWNpZmllZC5cbiAqXG4gKiBAcGFyYW0ge0FTVE5vZGV9IGxlZnRUeXBlIFRoZSBtYXRjaGluZyBsZWZ0IHR5cGUgaW5kaWNhdGluZyBjb25mbGljdFxuICogQHBhcmFtIHtEaXJlY3RpdmVOb2RlfSBsZWZ0RGlyZWN0aXZlIFRoZSBmaWVsZCBjYXVzaW5nIHRoZSBjb25mbGljdFxuICogQHBhcmFtIHtBU1ROb2RlfSByaWdodFR5cGUgVGhlIG1hdGNoaW5nIHJpZ2h0IHR5cGUgaW5kaWNhdGluZyBjb25mbGljdFxuICogQHBhcmFtIHtEaXJlY3RpdmVOb2RlfSByaWdodERpcmVjdGl2ZSB0aGUgZmllbGQgY2F1c2UgdGhlIGNvbmZsaWN0XG4gKlxuICogQHJldHVybiB7RGlyZWN0aXZlTm9kZX0gdGhlIGRpcmVjdGl2ZSB0aGF0IHNob3VsZCBiZSB1c2VkIGFmdGVyIHJlc29sdXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIERlZmF1bHRFbnVtTWVyZ2VSZXNvbHZlcihcbiAgbGVmdFR5cGUsXG4gIGxlZnRWYWx1ZSxcbiAgcmlnaHRUeXBlLFxuICByaWdodFZhbHVlXG4pIHtcbiAgcmV0dXJuIHJpZ2h0VmFsdWVcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCB1bmlvbiByZXNvbHZlciBibGluZGx5IHRha2VzIHJldHVybnMgdGhlIHJpZ2h0IHR5cGUuIFRoaXNcbiAqIHJlc29sdmVyIGlzIHVzZWQgd2hlbiBvbmUgaXMgbm90IHNwZWNpZmllZC5cbiAqXG4gKiBAcGFyYW0ge0FTVE5vZGV9IGxlZnRUeXBlIFRoZSBtYXRjaGluZyBsZWZ0IHR5cGUgaW5kaWNhdGluZyBjb25mbGljdFxuICogQHBhcmFtIHtOYW1lZFR5cGVOb2RlfSBsZWZ0VW5pb24gVGhlIG5hbWVkIG5vZGUgY2F1c2luZyB0aGUgY29uZmxpY3RcbiAqIEBwYXJhbSB7QVNUTm9kZX0gcmlnaHRUeXBlIFRoZSBtYXRjaGluZyByaWdodCB0eXBlIGluZGljYXRpbmcgY29uZmxpY3RcbiAqIEBwYXJhbSB7TmFtZWRUeXBlTm9kZX0gcmlnaHRVbmlvbiB0aGUgbmFtZWQgbm9kZSBjYXVzZSB0aGUgY29uZmxpY3RcbiAqXG4gKiBAcmV0dXJuIHtOYW1lZFR5cGVOb2RlfSB0aGUgZGlyZWN0aXZlIHRoYXQgc2hvdWxkIGJlIHVzZWQgYWZ0ZXIgcmVzb2x1dGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gRGVmYXVsdFVuaW9uTWVyZ2VSZXNvbHZlcihcbiAgbGVmdFR5cGUsXG4gIGxlZnRVbmlvbixcbiAgcmlnaHRUeXBlLFxuICByaWdodFVuaW9uXG4pIHtcbiAgcmV0dXJuIHJpZ2h0VW5pb25cbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBzY2FsYXIgbWVyZ2UgcmVzb2x2ZXIgcmV0dXJucyB0aGUgcmlnaHQgY29uZmlnIHdoZW4gdGhlcmUgaXNcbiAqIG9uZSwgb3RoZXJ3aXNlIHRoZSBsZWZ0IG9uZSBvciBudWxsIHdpbGwgYmUgdGhlIGRlZmF1bHQgcmVzdWx0LiBUaGlzIGlzXG4gKiBzbGlnaHRseSBkaWZmZXJlbnQgYmVoYXZpb3Igc2luY2UgcmVzb2x2ZXJzIGZvciBzY2FsYXJzIGFyZSBub3QgYWx3YXlzXG4gKiBhdmFpbGFibGUuXG4gKlxuICogQHBhcmFtIHtHcmFwaFFMU2NhbGFyVHlwZUNvbmZpZ30gbGVmdENvbmZpZyAqaWYqIHRoZXJlIGlzIGEgcmVzb2x2ZXIgZGVmaW5lZFxuICogZm9yIHRoZSBleGlzdGluZyBTY2FsYXJUeXBlRGVmaW5pdGlvbk5vZGUgaXQgd2lsbCBiZSBwcm92aWRlZCBoZXJlLiBJZiB0aGlzXG4gKiB2YWx1ZSBpcyBudWxsLCB0aGVyZSBpcyBubyBhdmFpbGFiZSBjb25maWcgd2l0aCBzZXJpYWxpemUoKSwgcGFyc2VWYWx1ZSgpIG9yXG4gKiBwYXJzZUxpdGVyYWwoKSB0byB3b3JrIHdpdGguXG4gKiBAcGFyYW0ge1NjYWxhclR5cGVEZWZpbml0aW9uTm9kZX0gcmlnaHRTY2FsYXIgdGhlIGRlZmluaXRpb24gbm9kZSBmb3VuZCB3aGVuXG4gKiBwYXJzaW5nIEFTVE5vZGVzLiBUaGlzIGlzIHRvIGJlIG1lcmdlZCB2YWx1ZSB0aGF0IGNvbmZsaWN0cyB3aXRoIHRoZVxuICogZXhpc3RpbmcgdmFsdWVcbiAqIEBwYXJhbSB7R3JhcGhRTFNjYWxhclR5cGVDb25maWd9IHJpZ2h0Q29uZmlnICppZiogdGhlcmUgaXMgYSByZXNvbHZlclxuICogZGVmaW5lZCBmb3IgdGhlIGV4aXN0aW5nIFNjYWxhclR5cGVEZWZpbml0aW9uTm9kZSBpdCB3aWxsIGJlIHByb3ZpZGVkIGhlcmUuXG4gKiBJZiB0aGlzIHZhbHVlIGlzIG51bGwsIHRoZXJlIGlzIG5vIGF2YWlsYWJlIGNvbmZpZyB3aXRoIHNlcmlhbGl6ZSgpLFxuICogcGFyc2VWYWx1ZSgpIG9yIHBhcnNlTGl0ZXJhbCgpIHRvIHdvcmsgd2l0aC5cbiAqIEByZXR1cm4ge0dyYXBoUUxTY2FsYXJUeXBlQ29uZmlnfSB3aGljaGV2ZXIgdHlwZSBjb25maWcgb3IgcmVzb2x2ZXIgd2FzXG4gKiBkZXNpcmVkIHNob3VsZCBiZSByZXR1cm5lZCBoZXJlLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vZG9jcy9ncmFwaHFsLXRvb2xzL3NjYWxhcnMuaHRtbFxuICogQHNlZSBodHRwOi8vZ3JhcGhxbC5vcmcvZ3JhcGhxbC1qcy90eXBlLyNncmFwaHFsc2NhbGFydHlwZVxuICovXG5leHBvcnQgZnVuY3Rpb24gRGVmYXVsdFNjYWxhck1lcmdlUmVzb2x2ZXIoXG4gIGxlZnRTY2FsYXIsXG4gIGxlZnRDb25maWcsXG4gIHJpZ2h0U2NhbGFyLFxuICByaWdodENvbmZpZ1xuKSB7XG4gIHJldHVybiAocmlnaHRDb25maWcgfHwgbGVmdENvbmZpZykgPz8gbnVsbFxufVxuXG4vKipcbiAqIEluIG9yZGVyIHRvIGZhY2lsaXRhdGUgbWVyZ2luZywgdGhlcmUgbmVlZHMgdG8gYmUgc29tZSBjb250aW5nZW5jeSBwbGFuXG4gKiBmb3Igd2hhdCB0byBkbyB3aGVuIGNvbmZsaWN0cyBhcmlzZS4gVGhpcyBvYmplY3Qgc3BlY2lmaWVzIG9uZSBvZiBlYWNoXG4gKiB0eXBlIG9mIHJlc29sdmVyLiBFYWNoIHNpbXBseSB0YWtlcyB0aGUgcmlnaHQtaGFuZCB2YWx1ZS5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgRGVmYXVsdENvbmZsaWN0UmVzb2x2ZXJzID0ge1xuICAvKiogQSBoYW5kbGVyIGZvciByZXNvbHZpbmcgZmllbGRzIGluIG1hdGNoaW5nIHR5cGVzICovXG4gIGZpZWxkTWVyZ2VSZXNvbHZlcjogRGVmYXVsdEZpZWxkTWVyZ2VSZXNvbHZlcixcblxuICAvKiogQSBoYW5kbGVyIGZvciByZXNvbHZpbmcgZGlyZWN0aXZlcyBpbiBtYXRjaGluZyB0eXBlcyAqL1xuICBkaXJlY3RpdmVNZXJnZVJlc29sdmVyOiBEZWZhdWx0RGlyZWN0aXZlTWVyZ2VSZXNvbHZlcixcblxuICAvKiogQSBoYW5kbGVyIGZvciByZXNvbHZpbmcgY29uZmxpY3RpbmcgZW51bSB2YWx1ZXMgKi9cbiAgZW51bVZhbHVlTWVyZ2VSZXNvbHZlcjogRGVmYXVsdEVudW1NZXJnZVJlc29sdmVyLFxuXG4gIC8qKiBBIGhhbmRsZXIgZm9yIHJlc29sdmluZyB0eXBlIHZhbHVlcyBpbiB1bmlvbnMgKi9cbiAgdHlwZVZhbHVlTWVyZ2VSZXNvbHZlcjogRGVmYXVsdFVuaW9uTWVyZ2VSZXNvbHZlcixcblxuICAvKiogQSBoYW5kbGVyIGZvciByZXNvbHZpbmcgc2NhbGFyIGNvbmZpZ3MgaW4gY3VzdG9tIHNjYWxhcnMgKi9cbiAgc2NhbGFyTWVyZ2VSZXNvbHZlcjogRGVmYXVsdFNjYWxhck1lcmdlUmVzb2x2ZXIsXG59XG5cbi8qKlxuICogQSBgTWVyZ2VPcHRpb25zQ29uZmlnYCBvYmplY3Qgd2l0aCBhbiBlbXB0eSBhcnJheSBvZlxuICogYFJlc29sdmVyQXJnc1RyYW5zZm9ybWVyYCBpbnN0YW5jZXNcbiAqXG4gKiBAdHlwZSB7TWVyZ2VPcHRpb25zQ29uZmlnfVxuICovXG5leHBvcnQgY29uc3QgRGVmYXVsdE1lcmdlT3B0aW9ucyA9IHtcbiAgY29uZmxpY3RSZXNvbHZlcnM6IERlZmF1bHRDb25mbGljdFJlc29sdmVycyxcbiAgcmVzb2x2ZXJJbmplY3RvcnM6IFtdLFxuICBpbmplY3RNZXJnZWRTY2hlbWE6IHRydWUsXG4gIGNyZWF0ZU1pc3NpbmdSZXNvbHZlcnM6IGZhbHNlLFxufVxuXG5jb25zdCBzdWJUeXBlUmVzb2x2ZXJNYXAgPSBuZXcgTWFwKClcbnN1YlR5cGVSZXNvbHZlck1hcC5zZXQoJ2ZpZWxkcycsICdmaWVsZE1lcmdlUmVzb2x2ZXInKVxuc3ViVHlwZVJlc29sdmVyTWFwLnNldCgnZGlyZWN0aXZlcycsICdkaXJlY3RpdmVNZXJnZVJlc29sdmVyJylcbnN1YlR5cGVSZXNvbHZlck1hcC5zZXQoJ3ZhbHVlcycsICdlbnVtVmFsdWVNZXJnZVJlc29sdmVyJylcbnN1YlR5cGVSZXNvbHZlck1hcC5zZXQoJ3R5cGVzJywgJ3R5cGVWYWx1ZU1lcmdlUmVzb2x2ZXInKVxuc3ViVHlwZVJlc29sdmVyTWFwLnNldCgnc2NhbGFycycsICdzY2FsYXJNZXJnZVJlc29sdmVyJylcblxuLyoqXG4gKiBDb21wYXJlcyBhbmQgY29tYmluZXMgYSBzdWJzZXQgb2YgQVNUTm9kZSBmaWVsZHMuIERlc2lnbmVkIHRvIHdvcmsgb24gYWxsXG4gKiB0aGUgdmFyaW91cyB0eXBlcyB0aGF0IG1pZ2h0IGhhdmUgYSBtZXJnZSBjb25mbGljdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3ViVHlwZU5hbWUgdGhlIG5hbWUgb2YgdGhlIGZpZWxkIHR5cGU7IG9uZSBvZiB0aGUgZm9sbG93aW5nXG4gKiB2YWx1ZXM6ICdmaWVsZHMnLCAnZGlyZWN0aXZlcycsICd2YWx1ZXMnLCAndHlwZXMnXG4gKiBAcGFyYW0ge0FTVE5vZGV9IGxUeXBlIHRoZSBsZWZ0aGFuZCB0eXBlIGNvbnRhaW5pbmcgdGhlIHN1YnR5cGUgdG8gY29tcGFyZVxuICogQHBhcmFtIHtBU1ROb2RlfSBsU3ViVHlwZSB0aGUgbGVmdGhhbmQgc3VidHlwZTsgZmllbGRzLCBkaXJlY3RpdmUsIHZhbHVlIG9yXG4gKiBuYW1lZCB1bmlvbiB0eXBlXG4gKiBAcGFyYW0ge0FTVE5vZGV9IHJUeXBlIHRoZSByaWdodGhhbmQgdHlwZSBjb250YWluaW5nIHRoZSBzdWJ0eXBlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSB7QVNUTm9kZX0gclN1YlR5cGUgdGhlIHJpZ2h0aGFuZCBzdWJ0eXBlOyBmaWVsZHMsIGRpcmVjdGl2ZSwgdmFsdWUgb3JcbiAqIG5hbWVkIHVuaW9uIHR5cGVcbiAqL1xuZnVuY3Rpb24gY29tYmluZVR5cGVBbmRTdWJUeXBlKFxuICBzdWJUeXBlTmFtZSxcbiAgbFR5cGUsXG4gIHJUeXBlLFxuICBjb25mbGljdFJlc29sdmVycyA9IERlZmF1bHRDb25mbGljdFJlc29sdmVyc1xuKSB7XG4gIGlmIChyVHlwZVtzdWJUeXBlTmFtZV0pIHtcbiAgICBmb3IgKGxldCByU3ViVHlwZSBvZiByVHlwZVtzdWJUeXBlTmFtZV0pIHtcbiAgICAgIGxldCBsU3ViVHlwZSA9IGxUeXBlW3N1YlR5cGVOYW1lXS5maW5kKFxuICAgICAgICBmID0+IGYubmFtZS52YWx1ZSA9PSByU3ViVHlwZS5uYW1lLnZhbHVlXG4gICAgICApXG5cbiAgICAgIGlmICghbFN1YlR5cGUpIHtcbiAgICAgICAgbFR5cGVbc3ViVHlwZU5hbWVdLnB1c2goclN1YlR5cGUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGxldCByZXNvbHZlciA9IHN1YlR5cGVSZXNvbHZlck1hcC5nZXQoc3ViVHlwZU5hbWUpIHx8ICdmaWVsZE1lcmdlUmVzb2x2ZXInXG4gICAgICBsZXQgcmVzdWx0aW5nU3ViVHlwZSA9IGNvbmZsaWN0UmVzb2x2ZXJzW3Jlc29sdmVyXShcbiAgICAgICAgbFR5cGUsXG4gICAgICAgIGxTdWJUeXBlLFxuICAgICAgICByVHlwZSxcbiAgICAgICAgclN1YlR5cGVcbiAgICAgIClcbiAgICAgIGxldCBpbmRleCA9IGxUeXBlLmZpZWxkcy5pbmRleE9mKGxTdWJUeXBlKVxuXG4gICAgICBsVHlwZVtzdWJUeXBlTmFtZV0uc3BsaWNlKGluZGV4LCAxLCByZXN1bHRpbmdTdWJUeXBlKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmVzIGEgc3Vic2V0IG9mIEFTVE5vZGUgZmllbGRzLiBEZXNpZ25lZCB0byB3b3JrIG9uIGFsbCB0aGUgdmFyaW91c1xuICogdHlwZXMgdGhhdCBtaWdodCBoYXZlIGEgbWVyZ2UgY29uZmxpY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN1YlR5cGVOYW1lIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCB0eXBlOyBvbmUgb2YgdGhlIGZvbGxvd2luZ1xuICogdmFsdWVzOiAnZmllbGRzJywgJ2RpcmVjdGl2ZXMnLCAndmFsdWVzJywgJ3R5cGVzJ1xuICogQHBhcmFtIHtBU1ROb2RlfSBsVHlwZSB0aGUgbGVmdGhhbmQgdHlwZSBjb250YWluaW5nIHRoZSBzdWJ0eXBlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSB7QVNUTm9kZX0gbFN1YlR5cGUgdGhlIGxlZnRoYW5kIHN1YnR5cGU7IGZpZWxkcywgZGlyZWN0aXZlLCB2YWx1ZSBvclxuICogbmFtZWQgdW5pb24gdHlwZVxuICogQHBhcmFtIHtBU1ROb2RlfSByVHlwZSB0aGUgcmlnaHRoYW5kIHR5cGUgY29udGFpbmluZyB0aGUgc3VidHlwZSB0byBjb21wYXJlXG4gKiBAcGFyYW0ge0FTVE5vZGV9IHJTdWJUeXBlIHRoZSByaWdodGhhbmQgc3VidHlwZTsgZmllbGRzLCBkaXJlY3RpdmUsIHZhbHVlIG9yXG4gKiBuYW1lZCB1bmlvbiB0eXBlXG4gKi9cbmZ1bmN0aW9uIHBhcmVUeXBlQW5kU3ViVHlwZShzdWJUeXBlTmFtZSwgbFR5cGUsIHJUeXBlLCByZXNvbHZlcnMgPSB7fSkge1xuICBmb3IgKGxldCByU3ViVHlwZSBvZiByVHlwZVtzdWJUeXBlTmFtZV0pIHtcbiAgICBsZXQgbFN1YlR5cGUgPSBsVHlwZVtzdWJUeXBlTmFtZV0uZmluZChcbiAgICAgIGYgPT4gZi5uYW1lLnZhbHVlID09IHJTdWJUeXBlLm5hbWUudmFsdWVcbiAgICApXG5cbiAgICBpZiAoIWxTdWJUeXBlKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGxldCBpbmRleCA9IGxUeXBlLmZpZWxkcy5pbmRleE9mKGxTdWJUeXBlKVxuICAgIGxUeXBlW3N1YlR5cGVOYW1lXS5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICBpZiAocmVzb2x2ZXJzPy5bbFR5cGUubmFtZS52YWx1ZV0/LltsU3ViVHlwZS5uYW1lLnZhbHVlXSkge1xuICAgICAgZGVsZXRlIHJlc29sdmVyc1tsVHlwZS5uYW1lLnZhbHVlXVtsU3ViVHlwZS5uYW1lLnZhbHVlXVxuICAgIH1cbiAgICBlbHNlIGlmIChyZXNvbHZlcnNbbFN1YlR5cGUubmFtZS52YWx1ZV0pIHtcbiAgICAgIGRlbGV0ZSByZXNvbHZlcnNbbFN1YlR5cGUubmFtZS52YWx1ZV1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTbWFsbCBmdW5jdGlvbiB0aGF0IHNvcnRzIHRocm91Z2ggdGhlIHR5cGVEZWZzIHZhbHVlIHN1cHBsaWVkIHdoaWNoIGNhbiBiZVxuICogYW55IG9uZSBvZiBhIFNjaGVtYXRhIGluc3RhbmNlLCBHcmFwaFFMU2NoZW1hIGluc3RhbmNlLCBTb3VyY2UgaW5zdGFuY2Ugb3IgYVxuICogc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U2NoZW1hU291cmNlfSB0eXBlRGVmcyBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSwgYSBzdHJpbmcgb2YgU0RMLFxuICogYSBTb3VyY2UgaW5zdGFuY2Ugb2YgU0RMLCBhIEdyYXBoUUxTY2hlbWEgb3IgQVNUTm9kZSB0aGF0IGNhbiBiZSBwcmludGVkXG4gKiBhcyBhbiBTREwgc3RyaW5nXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdGhpbmcgc3VwcGxpZWQgYXMgdHlwZURlZnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVNvdXJjZSh0eXBlRGVmcywgd3JhcCA9IGZhbHNlKSB7XG4gIGlmICghdHlwZURlZnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5saW5lYFxuICAgICAgbm9ybWFsaXplU291cmNlKHR5cGVEZWZzKTogdHlwZURlZnMgd2FzIGludmFsaWQgd2hlbiBwYXNzZWQgdG8gdGhlXG4gICAgICBmdW5jdGlvbiBcXGBub3JtYWxpemVTb3VyY2VcXGAuIFBsZWFzZSBjaGVjayB5b3VyIGNvZGUgYW5kIHRyeSBhZ2Fpbi5cblxuICAgICAgKHJlY2VpdmVkOiAke3R5cGVEZWZzfSlcbiAgICBgKVxuICB9XG5cbiAgaWYgKHR5cGVEZWZzIGluc3RhbmNlb2YgU2NoZW1hdGEgJiYgdHlwZURlZnMudmFsaWQgJiYgd3JhcCkge1xuICAgIHJldHVybiB0eXBlRGVmc1xuICB9XG5cbiAgbGV0IHNvdXJjZSA9IChcbiAgICB0eXBlRGVmcy5ib2R5IHx8XG4gICAgdHlwZURlZnMuc2RsIHx8XG4gICAgKHR5cGVvZiB0eXBlRGVmcyA9PT0gJ3N0cmluZycgJiYgdHlwZURlZnMpIHx8XG4gICAgKHR5cGVvZiB0eXBlRGVmcyA9PT0gJ29iamVjdCcgJiYgU2NoZW1hdGEucHJpbnQodHlwZURlZnMpKSB8fFxuICAgICh0eXBlRGVmcyBpbnN0YW5jZW9mIEdyYXBoUUxTY2hlbWFcbiAgICAgID8gcHJpbnRTY2hlbWEodHlwZURlZnMpXG4gICAgICA6IHR5cGVEZWZzLnRvU3RyaW5nKCkpXG4gICkudG9TdHJpbmcoKS50cmltKClcblxuICByZXR1cm4gd3JhcCA/IFNjaGVtYXRhLmZyb20oc291cmNlKSA6IHNvdXJjZVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY2hlbWF0YVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFLQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFNQSxJQUFBRSxLQUFBLEdBQUFGLE9BQUE7QUF3QkEsSUFBQUcsUUFBQSxHQUFBSCxPQUFBO0FBV0EsSUFBQUksaUJBQUEsR0FBQUosT0FBQTtBQXNCQSxJQUFBSyxNQUFBLEdBQUFMLE9BQUE7QUFDQSxJQUFBTSxhQUFBLEdBQUFOLE9BQUE7QUFDQSxJQUFBTyxvQkFBQSxHQUFBUCxPQUFBO0FBQ0EsSUFBQVEsaUJBQUEsR0FBQVIsT0FBQTtBQUNBLElBQUFTLFNBQUEsR0FBQVQsT0FBQTtBQUNBLElBQUFVLGdCQUFBLEdBQUFWLE9BQUE7QUFDQSxJQUFBVyxVQUFBLEdBQUFaLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBWSxLQUFBLEdBQUFiLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBYSxVQUFBLEdBQUFiLE9BQUE7QUFZQSxJQUFBYyxjQUFBLEdBQUFkLE9BQUE7QUFBc0YsU0FBQUQsdUJBQUFnQixDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBM0Z0Rjs7QUFJQSxNQUFNRyxTQUFTLEdBQUcsSUFBQUMsY0FBSyxFQUFDLGNBQWMsQ0FBQztBQUN2QyxNQUFNQyxXQUFXLEdBQUcsSUFBQUQsY0FBSyxFQUFDLGdC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
//# sourceMappingURL=Schemata.js.map