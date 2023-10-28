"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
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
exports.isRootType = exports["default"] = exports.TYPEDEFS_KEY = exports.Schemata = void 0;
exports.normalizeSource = normalizeSource;
exports.runInjectors = runInjectors;
exports.stripResolversFromSchema = stripResolversFromSchema;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));
var _graphql = require("graphql");
var _ExtendedResolverMap = require("./ExtendedResolverMap");
var _ExtendedResolver = require("./ExtendedResolver");
var _neTagFns = require("ne-tag-fns");
var _deepmerge = _interopRequireDefault(require("deepmerge"));
var _util = _interopRequireDefault(require("util"));
var _forEachOf2 = require("./forEachOf");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var debug_log = require('debug')('schemata:normal');
var debug_trace = require('debug')('schemata:trace');
/**
 * A small `String` extension that makes working with SDL/IDL text far easier
 * in both your own libraries as well as in a nodeJS REPL. Built-in to what
 * appears to be a normal String for all intents and purposes, are the ability
 * to transform the string into a set of AST nodes, a built schema or back to
 * the SDL string.
 *
 * @class  Schemata
 */
var Schemata = exports.Schemata = /*#__PURE__*/function (_String, _Symbol$species, _Symbol$iterator, _Symbol$toStringTag, _Util$inspect$custom) {
  (0, _inherits2["default"])(Schemata, _String);
  var _super = _createSuper(Schemata);
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
  function Schemata(typeDefs) {
    var _this;
    var resolvers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var buildResolvers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var flattenResolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    (0, _classCallCheck2["default"])(this, Schemata);
    _this = _super.call(this, normalizeSource(typeDefs));
    resolvers = resolvers || typeDefs instanceof Schemata && typeDefs.resolvers || typeDefs instanceof _graphql.GraphQLSchema && stripResolversFromSchema(typeDefs) || null;
    _this[GRAPHIQL_FLAG] = true;
    _this[TYPEDEFS_KEY] = normalizeSource(typeDefs);
    _this[MAP] = new WeakMap();
    _this[MAP].set(wmkSchema, typeDefs instanceof _graphql.GraphQLSchema ? typeDefs : null);
    _this[MAP].set(wmkResolvers, resolvers);
    _this[MAP].set(wmkPreboundResolvers, typeDefs instanceof Schemata ? typeDefs.prevResolverMaps : []);

    // Mark a schema passed to use in the constructor as an executable schema
    // to prevent any replacement of the value by getters that generate a
    // schema from the SDL
    if (_this[MAP].get(wmkSchema)) {
      _this[MAP].get(wmkSchema)[EXE] = true;
      _this[MAP].get(wmkSchema)[Symbol["for"]('constructor-supplied-schema')] = true;
    }

    // If buildResolvers is true, after the rest is already set and done, go
    // ahead and build a new set of resolver functions for this instance
    if (buildResolvers) {
      if (buildResolvers === 'all') {
        _this[MAP].set(wmkResolvers, _this.buildResolverForEachField(flattenResolvers));
      } else {
        _this[MAP].set(wmkResolvers, _this.buildResolvers(flattenResolvers));
      }
    }
    return _this;
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
  (0, _createClass2["default"])(Schemata, [{
    key: _Symbol$iterator,
    get:
    /**
     * Redefine the iterator for Schemata instances so that they simply show the
     * contents of the SDL/typeDefs.
     *
     * @type {Function}
     */
    function get() {
      return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.toString();
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }).bind(this);
    }

    /**
     * Ensures that instances of Schemata report internally as Schemata object.
     * Specifically using things like `Object.prototype.toString`.
     *
     * @type {string}
     */
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    }

    /**
     * Returns the AST nodes for this snippet of SDL. It will throw an error
     * if the string is not valid SDL/IDL.
     *
     * @return {ASTNode} any valid ASTNode supported by GraphQL
     */
  }, {
    key: "ast",
    get: function get() {
      return this.constructor.parse(this.sdl, false);
    }

    /**
     * Retrieves the `graphiql` flag, which defaults to true. This flag can
     * make setting up an endpoint from a Schemata instance easier with
     * express-graphql
     *
     * @type {boolean}
     */
  }, {
    key: "graphiql",
    get: function get() {
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
  }, {
    key: "graphiql",
    set: function set(value) {
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
  }, {
    key: "schema",
    get: function get() {
      var Class = this.constructor;
      var resolvers = this.resolvers;
      var schema;

      // If we have a generated schema already and this instance has a
      // resolvers object that is not falsey, check to see if the object
      // has the executable schema flag set or not. If so, simply return
      // the pre-existing object rather than create a new one.
      if (this[MAP].get(wmkSchema)) {
        schema = this[MAP].get(wmkSchema);
        if (resolvers) {
          // check for the executable schema flag
          if (schema && schema[EXE]) {
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
        var ast = this.ast;
        ast.definitions = [].concat(ast.definitions.filter(function (i) {
          return i.kind == 'ObjectTypeExtension';
        }));
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
        (0, _forEachOf2.forEachField)(schema, function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) {
          if (!resolvers) {
            return;
          }
          if (isRootType(type) && resolvers[fieldName]) {
            field.resolve = resolvers[fieldName];
            field.astNode.resolve = resolvers[fieldName];
          }
          if (resolvers[typeName] && resolvers[typeName][fieldName]) {
            field.resolve = resolvers[typeName][fieldName];
            field.astNode.resolve = resolvers[typeName][fieldName];
          }
        });
        schema[EXE] = true;
      }

      // Set the generated schema in the weak map using the weak map key
      this[MAP].set(wmkSchema, schema);
      return schema;
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
  }, {
    key: "schema",
    set: function set(schema) {
      debug_log('[set .schema]: ', schema ? 'truthy' : 'falsey');
      debug_trace('[set .schema] ', schema);
      if (!schema) {
        this[MAP]["delete"](wmkSchema);
      } else {
        var schemaResolvers = stripResolversFromSchema(schema);
        if (Object.keys(schemaResolvers).length) {
          schema[EXE] = true;
          (0, _deepmerge["default"])(this.resolvers = this.resolvers || {}, schemaResolvers);
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
     * @type {Object}
     */
  }, {
    key: "schemaDirectives",
    get: function get() {
      return this[SCHEMA_DIRECTIVES];
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
  }, {
    key: "schemaDirectives",
    set: function set(value) {
      this[SCHEMA_DIRECTIVES] = value;
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
  }, {
    key: "prevResolverMaps",
    get: function get() {
      return this[MAP].get(wmkPreboundResolvers);
    }

    /**
     * Sets the pre-bound resolver map objects as an array of
     * `ExtendedResolverMap` object instances on this instance of Schemata
     *
     * @param {Array<ExtendedResolverMap>} maps an array of `ExtendedResolverMap`
     * object instances
     */
  }, {
    key: "prevResolverMaps",
    set: function set(maps) {
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
     * @return {GraphQLSchema} an instance of GraphQLSchema with pre-bound
     * resolvers
     */
  }, {
    key: "executableSchema",
    get: function get() {
      return this.schema;
    }

    /**
     * Returns the string this instance was generated with.
     *
     * @return {string} the string this class instance represents
     */
  }, {
    key: "sdl",
    get: function get() {
      return this[TYPEDEFS_KEY];
    }

    /**
     * Rewrites the typeDefs or SDL without any `extend type` definitions
     * and returns the modified instance.
     *
     * @return {Schemata} the instance of Schemata this method was called
     * on with modified typeDefs in place.
     */
  }, {
    key: "flattenSDL",
    value: function flattenSDL() {
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
     * @return {String} the regenerated schema SDL from the actual
     * schema object on this schemata instance.
     */
  }, {
    key: "flatSDL",
    get: function get() {
      var sdl = this[TYPEDEFS_KEY];
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
     * @return {string} a string of SDL/IDL for use with graphql
     */
  }, {
    key: "typeDefs",
    get: function get() {
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
     */
  }, {
    key: "types",
    get: function get() {
      var types = {};
      this.forEachTypeField(function (t, tn, td, f, fn, fa, fd, schema, c) {
        var ast = (0, _graphql.parse)((0, _graphql.printType)(t)).definitions[0];
        var fieldAST = ast.fields.filter(function (o, i, a) {
          return o.name.value == fn;
        });
        var fieldType = fieldAST.length && (0, _graphql.typeFromAST)(schema, fieldAST[0].type);
        var args = [];
        if (fa && fa.length) {
          var _iterator = _createForOfIteratorHelper(fa),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _step$value = _step.value,
                name = _step$value.name,
                type = _step$value.type;
              args.push((0, _defineProperty2["default"])({}, name, type.toString()));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
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
     * @return {Object} an object of functions or an empty object otherwise
     */
  }, {
    key: "rootValue",
    get: function get() {
      return this.buildResolvers(true);
    }

    /**
     * Returns any resolvers function object associated with this instance.
     *
     * @return {Object} an object containing field resolvers or null if none
     * are stored within
     */
  }, {
    key: "resolvers",
    get: function get() {
      return this[MAP].get(wmkResolvers);
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
  }, {
    key: "schemaResolverFor",
    value: function schemaResolverFor(type, field) {
      if (!this.resolvers || !Object.keys(this.resolvers).length || !this.valid) {
        return null;
      }
      var _type = this.schema.getType(type);
      var _field = _type.getFields() && _type.getFields()[field] || null;
      var resolve = _field && _field.resolve || null;
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
  }, {
    key: "schemaFieldByName",
    value: function schemaFieldByName(type, field) {
      if (!this.validSchema || !this.schema) {
        return null;
      }
      var _type = this.schema.getType(type);
      var _field = _type.getFields() && _type.getFields()[field] || null;
      return _field;
    }

    /**
     * For SDL that doesn't properly build into a GraphQLSchema, it can still be
     * parsed and searched for a type by name.
     *
     * @param {string} type the name of a type
     * @return {FieldNode} the field reference in the type and field supplied
     */
  }, {
    key: "astTypeByName",
    value: function astTypeByName(type) {
      if (!this.validSDL) {
        return null;
      }
      var _type = this.ast.definitions.find(function (f) {
        return f.name.value === type;
      });
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
  }, {
    key: "astFieldByName",
    value: function astFieldByName(type, field) {
      if (!this.validSDL) {
        return null;
      }
      var _type = this.ast.definitions.find(function (f) {
        return f.name.value === type;
      });
      var _field = _type && _type.fields.find(function (f) {
        return f.name.value === field;
      }) || null;
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
  }, {
    key: "hasFlattenedResolvers",
    get: function get() {
      var asts = this.validSDL && this.ast.definitions || null;
      if (!asts || !this.resolvers) {
        return false;
      }
      var query = asts.find(function (f) {
        return f.name.value == 'Query';
      });
      var mutation = asts.find(function (f) {
        return f.name.value == 'Mutation';
      });
      var subscription = asts.find(function (f) {
        return f.name.value == 'Subscription';
      });
      var resolvers = this.resolvers;
      if (!query && !mutation && !subscription) {
        return false;
      }
      for (var _i = 0, _arr = [query, mutation, subscription]; _i < _arr.length; _i++) {
        var type = _arr[_i];
        if (!type || !type.fields) {
          continue;
        }
        var _iterator2 = _createForOfIteratorHelper(type.fields),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var field = _step2.value;
            if (field.name.value in resolvers) {
              return true;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
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
  }, {
    key: "mergeSDL",
    value: function mergeSDL(schemaLanguage) {
      var _this2 = this;
      var conflictResolvers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultConflictResolvers;
      var source = normalizeSource(schemaLanguage, true);
      if (!source) {
        throw new Error((0, _neTagFns.inline)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n        The call to mergeSDL(schemaLanguage, conflictResolvers) received an\n        invalid value for schemaLanguage. Please check your code and try again.\n        Received ", ".\n      "])), schemaLanguage));
      }
      var lAST = this.ast;
      var rAST = source.ast;
      var _scalarFns = {};

      // Ensure we have default behavior with any custom behavior assigned
      // atop the default ones should only a partial custom be supplied.
      conflictResolvers = (0, _deepmerge["default"])(DefaultConflictResolvers, conflictResolvers);
      var _iterator3 = _createForOfIteratorHelper(rAST.definitions),
        _step3;
      try {
        var _loop = function _loop() {
          var rType = _step3.value;
          var lType = lAST.definitions.find(function (a) {
            return a.name.value == rType.name.value;
          });
          if (rType.kind && rType.kind.endsWith && rType.kind.endsWith('Extension')) {
            rType = (0, _deepmerge["default"])({}, rType);
            rType.kind = rType.kind.substring(0, rType.kind.length - 9) + 'Definition';
          }
          if (!lType) {
            lAST.definitions.push(rType);
            return 1; // continue
          }
          switch (lType.kind) {
            default:
            case 'ObjectTypeDefinition':
            case 'ObjectTypeDefinitionExtension':
            case 'InterfaceTypeDefinition':
            case 'InterfaceTypeDefinitionExtension':
            case 'InputObjectTypeDefinition':
            case 'InputObjectTypeDefinitionExtension':
              combineTypeAndSubType('directives', lType, rType, conflictResolvers);
              combineTypeAndSubType('fields', lType, rType, conflictResolvers);
              break;
            case 'EnumTypeDefinition':
              combineTypeAndSubType('directives', lType, rType, conflictResolvers);
              combineTypeAndSubType('values', lType, rType, conflictResolvers);
              break;
            case 'UnionTypeDefinition':
              combineTypeAndSubType('directives', lType, rType, conflictResolvers);
              combineTypeAndSubType('types', lType, rType, conflictResolvers);
              break;
            case 'ScalarTypeDefinitionNode':
              var lScalar, lScalarConfig, rScalar, rScalarConfig, resolver;
              combineTypeAndSubType('directives', lType, rType, conflictResolvers);
              if (_this2.schema) {
                lScalar = _this2.schema.getType(lType.name.value);
                lScalarConfig = lScalar && lScalar._scalarConfig || null;
              }
              if (source.schema) {
                rScalar = source.schema.getType(rType.name.value);
                rScalarConfig = rScalar && rScalar._scalarConfig || null;
              }
              resolver = (conflictResolvers.scalarMergeResolver || DefaultConflictResolvers.scalarMergeResolver)(lType, lScalarConfig, rType, rScalarConfig);
              if (resolver) {
                _scalarFns[lType.name.value] = _scalarFns[lType.name.value] || {};
                _scalarFns[lType.name.value] = resolver;
              }
              break;
          }
        };
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          if (_loop()) continue;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var merged = Schemata.from(this.constructor.gql.print(lAST));
      if (Object.keys(_scalarFns).length) {
        for (var _i2 = 0, _Object$keys = Object.keys(_scalarFns); _i2 < _Object$keys.length; _i2++) {
          var typeName = _Object$keys[_i2];
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
  }, {
    key: "pareSDL",
    value: function pareSDL(schemaLanguage) {
      var resolverMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var source = normalizeSource(schemaLanguage, true);
      if (!source) {
        throw new Error((0, _neTagFns.inline)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n        In the call to pareSDL(schemaLanguage), the supplied value for\n        `schemaLanguage` could not be parsed.\n      "], ["\n        In the call to pareSDL(schemaLanguage), the supplied value for\n        \\`schemaLanguage\\` could not be parsed.\n      "]))));
      }
      if (schemaLanguage instanceof _graphql.GraphQLSchema && !resolverMap) {
        resolverMap = stripResolversFromSchema(schemaLanguage);
      }
      var resolvers = (0, _deepmerge["default"])({}, resolverMap || this.resolvers || {});
      var lAST = this.ast;
      var rAST = source.ast;
      var _iterator4 = _createForOfIteratorHelper(rAST.definitions),
        _step4;
      try {
        var _loop2 = function _loop2() {
          var rType = _step4.value;
          var lType = lAST.definitions.find(function (a) {
            return a.name.value == rType.name.value;
          });
          if (rType.kind && rType.kind.endsWith && rType.kind.endsWith('Extension')) {
            var len = 'Extension'.length;
            rType = (0, _deepmerge["default"])({}, rType);
            rType.kind = rType.kind.substring(0, rType.kind.length - len) + 'Definition';
          }
          if (!lType) {
            lAST.definitions.push(rType);
            return 1; // continue
          }
          switch (lType.kind) {
            default:
            case 'ObjectTypeDefinition':
            case 'ObjectTypeDefinitionExtension':
            case 'InterfaceTypeDefinition':
            case 'InterfaceTypeDefinitionExtension':
            case 'InputObjectTypeDefinition':
            case 'InputObjectTypeDefinitionExtension':
              pareTypeAndSubType('directives', lType, rType, resolvers);
              pareTypeAndSubType('fields', lType, rType, resolvers);
              if (!lType.fields.length) {
                var _index = lAST.definitions.indexOf(lType);
                if (_index !== -1) {
                  lAST.definitions.splice(_index, 1);
                }
              }
              break;
            case 'EnumTypeDefinition':
              pareTypeAndSubType('directives', lType, rType, resolvers);
              pareTypeAndSubType('values', lType, rType, resolvers);
              if (!lType.values.length) {
                var _index2 = lAST.definitions.indexOf(lType);
                if (_index2 !== -1) {
                  lAST.definitions.splice(_index2, 1);
                }
              }
              break;
            case 'UnionTypeDefinition':
              pareTypeAndSubType('directives', lType, rType, resolvers);
              pareTypeAndSubType('types', lType, rType, resolvers);
              if (!lType.types.length) {
                var _index3 = lAST.definitions.indexOf(lType);
                if (_index3 !== -1) {
                  lAST.definitions.splice(_index3, 1);
                }
              }
              break;
            case 'ScalarTypeDefinitionNode':
              var index = lAST.definitions.indexOf(lType);
              if (index !== -1) {
                lAST.definitions.splice(index, 1);
              }
              break;
          }
        };
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          if (_loop2()) continue;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      var result = Schemata.from(this.constructor.gql.print(lAST), resolvers);
      result.schema;
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
     * @param {GraphQLSchema} schema an instance of GraphQLSchema to merge
     * @param {ConflictResolvers} conflictResolvers an object containing up to
     * four methods, each describing how to handle a conflict when an associated
     * type of conflict occurs. If no object or method are supplied, the right
     * hande value always takes precedence over the existing value; replacing it
     * @return {Schemata} a new instance of Schemata with a merged schema string,
     * merged resolver map and newly bound executable schema attached are all
     * initiated
     */
  }, {
    key: "merge",
    value: function merge(schema) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultMergeOptions;
      if (!schema) {
        throw new Error((0, _neTagFns.inline)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n        In the call to mergeSchema(schema), ", " was received as a value\n        and the code could not proceed because of it. Please check your code\n        and try again\n      "])), schema));
      }

      // Step0: Ensure we have all the defaults for config and schema
      schema = normalizeSource(schema, true);
      if (config !== DefaultMergeOptions) {
        var mergedConfig = (0, _deepmerge["default"])({}, DefaultMergeOptions);
        config = (0, _deepmerge["default"])(mergedConfig, config);
      }

      // Step1: Merge SDL; quit at this point if there are no resolvers
      var left = Schemata.from(this, undefined, true);
      var right = Schemata.from(schema, undefined, true);
      var merged = left.mergeSDL(right, config.conflictResolvers);

      // If neither schemata instance has a resolver, there is no reason
      // to continue. Return the merged schemas and call it a day.
      if ((!left.resolvers || !Object.keys(left.resolvers).length) && (!right.resolvers || !Object.keys(right.resolvers).length)) {
        return merged;
      }

      // Step2: Backup resolvers from left, right, or both
      var lResolvers = left.resolvers;
      var rResolvers = right.resolvers;
      var prevMaps = (left.prevResolverMaps || []).concat(right.prevResolverMaps || [], _ExtendedResolverMap.ExtendedResolverMap.from(left), _ExtendedResolverMap.ExtendedResolverMap.from(right));
      merged.prevResolverMaps = prevMaps;

      // Step3: Merge resolvers
      var mergeResolvers = {};
      if (prevMaps && prevMaps.length) {
        mergeResolvers = prevMaps.reduce(function (p, c, i, a) {
          return (0, _deepmerge["default"])(p, c.resolvers || {});
        }, {});
      } else {
        (0, _deepmerge["default"])(mergeResolvers, left.resolvers);
        (0, _deepmerge["default"])(mergeResolvers, right.resolvers);
      }
      merged.resolvers = mergeResolvers;

      // Step 4: Trigger a new schema creation
      if (config.createMissingResolvers) {
        merged.resolvers = merged.buildResolverForEachField();
      }
      merged.clearSchema();
      merged.schema;

      // Step5: Wrap resolvers
      if (config.injectMergedSchema) {
        merged.forEachField(function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) {
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
        merged.schema;
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
     * @param {GraphQLSchema} schema an instance of GraphQLSchema to merge
     * @param {ConflictResolvers} conflictResolvers an object containing up to
     * four methods, each describing how to handle a conflict when an associated
     * type of conflict occurs. If no object or method are supplied, the right
     * hande value always takes precedence over the existing value; replacing it
     * @return {Schemata} a new instance of Schemata with a merged schema string,
     * merged resolver map and newly bound executable schema attached are all
     * initiated
     */
  }, {
    key: "mergeSchema",
    value: function mergeSchema(schema) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultMergeOptions;
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
     * @param {Array<ResolverMap>} ...extendWith an unlimited array of objects
     * that can be used to extend the built resolver map.
     * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
     */
  }, {
    key: "buildResolvers",
    value: function buildResolvers(flattenRootResolversOrFirstParam) {
      var schemata = Schemata.from(this.sdl, this.resolvers);
      var resolvers = (0, _deepmerge["default"])({}, stripResolversFromSchema(schemata.schema) || schemata.resolvers || {});

      // Next check to see if we are flattening or simply extending
      if (typeof flattenRootResolversOrFirstParam === 'boolean') {
        for (var _i3 = 0, _arr2 = ['Query', 'Mutation', 'Subscription']; _i3 < _arr2.length; _i3++) {
          var rootType = _arr2[_i3];
          if (flattenRootResolversOrFirstParam) {
            if (resolvers[rootType]) {
              for (var _i4 = 0, _Object$keys2 = Object.keys(resolvers[rootType]); _i4 < _Object$keys2.length; _i4++) {
                var field = _Object$keys2[_i4];
                resolvers[field] = resolvers[rootType][field];
                delete resolvers[rootType][field];
              }
              delete resolvers[rootType];
            }
          } else {
            for (var _i5 = 0, _Object$keys3 = Object.keys(resolvers); _i5 < _Object$keys3.length; _i5++) {
              var _field2 = _Object$keys3[_i5];
              try {
                debug_log('[buildResolvers()] finding field in schema');
                if (schemata.schemaFieldByName(rootType, _field2)) {
                  resolvers[rootType] = resolvers[rootType] || {};
                  resolvers[rootType][_field2] = resolvers[_field2];
                  delete resolvers[_field2];
                }
              } catch (error) {
                debug_log((0, _neTagFns.inline)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n                [buildResolvers()] Falling back to `astFieldByName()`\n              "], ["\n                [buildResolvers()] Falling back to \\`astFieldByName()\\`\n              "]))));
                debug_trace((0, _neTagFns.inline)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n                [buildResolvers()] Falling back to `astFieldByName()` due to\n              "], ["\n                [buildResolvers()] Falling back to \\`astFieldByName()\\` due to\n              "]))), error);
                if (schemata.astFieldByName(rootType, _field2)) {
                  resolvers[rootType] = resolvers[rootType] || {};
                  resolvers[rootType][_field2] = resolvers[_field2];
                  delete resolvers[_field2];
                }
              }
            }
          }
        }
      } else {
        resolvers = (0, _deepmerge["default"])(resolvers || {}, flattenRootResolversOrFirstParam || {});
      }

      // Finally extend with any remaining arguments
      for (var _len = arguments.length, extendWith = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        extendWith[_key - 1] = arguments[_key];
      }
      if (extendWith.length) {
        var _iterator5 = _createForOfIteratorHelper(extendWith),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var item = _step5.value;
            resolvers = (0, _deepmerge["default"])(resolvers || {}, item || {});
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
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
     * @param {Array<ResolverMap>} ...extendWith an unlimited array of objects
     * that can be used to extend the built resolver map.
     * @return {ResolverMap} a resolver map; i.e. an object of resolver functions
     */
  }, {
    key: "buildResolverForEachField",
    value: function buildResolverForEachField(flattenRootResolversOrFirstParam) {
      if (!this.schema) {
        throw new Error((0, _neTagFns.inline)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n        buildResolverForEachField() cannot be called unless there is enough\n        valid SDL in the instance to construct a schema. Please check your\n        code!\n      "]))));
      }
      var interim = Schemata.from(this.sdl, this.resolvers);
      var r = {};
      interim.forEachField(function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, schema, context) {
        // Ensure the path to the type in question exists before continuing
        // onward
        (r[typeName] = r[typeName] || {})[fieldName] = r[typeName][fieldName] || {};
        r[typeName][fieldName] = field.resolve || _graphql.defaultFieldResolver;
      });
      interim.resolvers = r;
      for (var _len2 = arguments.length, extendWith = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        extendWith[_key2 - 1] = arguments[_key2];
      }
      return interim.buildResolvers.apply(interim, [flattenRootResolversOrFirstParam].concat(extendWith));
    }

    /**
     * A method to determine if an executable schema is attached to this Schemata
     * instance. It does so by walking the schema fields via `buildResolvers()`
     * and reporting whether there is anything inside the results or not.
     *
     * @return {boolean} true if there is at least one resolver on at least one
     * field of a type in this Schemata instance's schema.
     */
  }, {
    key: "hasAnExecutableSchema",
    get: function get() {
      return Object.keys(this.buildResolvers()).length > 0;
    }

    /**
     * If the `.sdl` property is valid SDL/IDL and can generate valid AST nodes
     * this function will return true. It will return false otherwise.
     *
     * @return {boolean} true if the string can be parsed; false otherwise
     */
  }, {
    key: "validSDL",
    get: function get() {
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
     * @return {boolean} true if the string can be parsed into a schema; false
     * otherwise
     */
  }, {
    key: "validSchema",
    get: function get() {
      try {
        this.schema;
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
     * @return {boolean} true if it is valid for both `parse()` as well as the
     * `buildSchema()` function
     */
  }, {
    key: "valid",
    get: function get() {
      return this.validSDL && this.validSchema;
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
  }, {
    key: "resolvers",
    set: function set(resolvers) {
      this[MAP].set(wmkResolvers, resolvers);
      this.clearSchema();
    }

    /**
     * Removes the resolver map associated with this Schemata instance
     */
  }, {
    key: "clearResolvers",
    value: function clearResolvers() {
      this.resolvers = null;
    }

    /**
     * Removes the schema stored with this Schemata instance
     */
  }, {
    key: "clearSchema",
    value: function clearSchema() {
      this.schema = null;
    }

    /**
     * Returns the underlying string passed or generated in the constructor when
     * inspected in the nodeJS REPL.
     *
     * @return {string} the SDL/IDL string this class was created on
     */
  }, {
    key: _Util$inspect$custom,
    value: function value(depth, options) {
      return this.sdl;
    }

    /**
     * The same as `inspect()`, `toString()`, and `valueOf()`. This method
     * returns the underlying string this class instance was created on.
     *
     * @return {string} [description]
     */
  }, {
    key: "toString",
    value: function toString() {
      return this.sdl;
    }

    /**
     * The same as `inspect()`, `toString()`, and `valueOf()`. This method
     * returns the underlying string this class instance was created on.
     *
     * @return {string} [description]
     */
  }, {
    key: "valueOf",
    value: function valueOf() {
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
  }, {
    key: "forEachOf",
    value: function forEachOf(fn, context) {
      var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _forEachOf2.TYPES;
      var suppliedSchema = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachOf)(schema, fn, context, types);
      return schema;
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
  }, {
    key: "forEachType",
    value: function forEachType(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.TYPES, suppliedSchema);
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
  }, {
    key: "forEachInputObjectType",
    value: function forEachInputObjectType(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, INPUT_TYPES, suppliedSchema);
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
  }, {
    key: "forEachUnion",
    value: function forEachUnion(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.UNIONS, suppliedSchema);
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
  }, {
    key: "forEachEnum",
    value: function forEachEnum(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.ENUMS, suppliedSchema);
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
  }, {
    key: "forEachInterface",
    value: function forEachInterface(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.INTERFACES, suppliedSchema);
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
  }, {
    key: "forEachScalar",
    value: function forEachScalar(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.SCALARS, suppliedSchema);
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
  }, {
    key: "forEachRootType",
    value: function forEachRootType(fn, context, suppliedSchema) {
      return this.forEachOf(fn, context, _forEachOf2.ROOT_TYPES, suppliedSchema);
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
  }, {
    key: "forEachField",
    value: function forEachField(fn, context) {
      var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _forEachOf2.ALL;
      var suppliedSchema = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, types);
      return schema;
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
  }, {
    key: "forEachTypeField",
    value: function forEachTypeField(fn, context) {
      var suppliedSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, _forEachOf2.TYPES);
      return schema;
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
  }, {
    key: "forEachInterfaceField",
    value: function forEachInterfaceField(fn, context) {
      var suppliedSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, _forEachOf2.INTERFACES);
      return schema;
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
  }, {
    key: "forEachInputObjectField",
    value: function forEachInputObjectField(fn, context) {
      var suppliedSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var schema = suppliedSchema || this.schema;
      (0, _forEachOf2.forEachField)(schema, fn, context, INPUT_TYPES);
      return schema;
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
  }, {
    key: "run",
    value: function run(query, contextValue, variableValues, rootValue, operationName, fieldResolver, typeResolver) {
      return this.constructor.gql.graphqlSync({
        schema: this.schema,
        source: query,
        rootValue: this.resolvers || rootValue,
        contextValue: contextValue,
        variableValues: variableValues,
        operationName: operationName,
        fieldResolver: fieldResolver,
        typeResolver: typeResolver
      });
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
  }, {
    key: "runAsync",
    value: function () {
      var _runAsync = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(query, contextValue, variableValues, rootValue, operationName, fieldResolver, typeResolver) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", this.constructor.gql.graphql({
                schema: this.schema,
                source: query,
                rootValue: this.resolvers || rootValue,
                contextValue: contextValue,
                variableValues: variableValues,
                operationName: operationName,
                fieldResolver: fieldResolver,
                typeResolver: typeResolver
              }));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function runAsync(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
        return _runAsync.apply(this, arguments);
      }
      return runAsync;
    }()
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
  }], [{
    key: _Symbol$species,
    get: function get() {
      return Schemata;
    }
  }, {
    key: "buildSchema",
    value: function buildSchema(sdl) {
      var showError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var schemaOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      try {
        debug_log('[static buildSchema()] normalizing source');
        var source = normalizeSource(sdl);
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
  }, {
    key: "parse",
    value: function parse(sdl) {
      var showError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var enhance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      try {
        debug_log('[static parse()] normalizing source');
        var source = normalizeSource(sdl);
        debug_log('[static parse()] parsing');
        var node = this.gql.parse(source);
        if (enhance) {
          debug_log('[static parse()] enhancing');
          node[Symbol.iterator] = /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
            var _iterator6, _step6, _node;
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  _iterator6 = _createForOfIteratorHelper(this.definitions);
                  _context3.prev = 1;
                  _iterator6.s();
                case 3:
                  if ((_step6 = _iterator6.n()).done) {
                    _context3.next = 9;
                    break;
                  }
                  _node = _step6.value;
                  _context3.next = 7;
                  return _node;
                case 7:
                  _context3.next = 3;
                  break;
                case 9:
                  _context3.next = 14;
                  break;
                case 11:
                  _context3.prev = 11;
                  _context3.t0 = _context3["catch"](1);
                  _iterator6.e(_context3.t0);
                case 14:
                  _context3.prev = 14;
                  _iterator6.f();
                  return _context3.finish(14);
                case 17:
                case "end":
                  return _context3.stop();
              }
            }, _callee3, this, [[1, 11, 14, 17]]);
          });
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
     * @param {boolean} showError if true, any caught errors will be thrown once
     * again
     * @return {Schemata|null} null if an error occurs (and showError is false)
     * or an instance of Schemata wrapping the resulting SDL string from the
     * print operation
     */
  }, {
    key: "print",
    value: function print(ast) {
      var showError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      try {
        var source;
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
     * @return {mixed} the results of `require('graphql')`
     */
  }, {
    key: "gql",
    get: function get() {
      return require('graphql');
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
  }, {
    key: "from",
    value: function from(typeDefs) {
      var resolvers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var buildResolvers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var flattenResolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      return new this(typeDefs, resolvers, buildResolvers, flattenResolvers);
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available type within the schema.
     *
     * @type {number}
     */
  }, {
    key: "ALL",
    get: function get() {
      return _forEachOf2.ALL;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available type within the schema.
     *
     * @type {number}
     */
  }, {
    key: "TYPES",
    get: function get() {
      return _forEachOf2.TYPES;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available interface within the schema.
     *
     * @type {number}
     */
  }, {
    key: "INTERFACES",
    get: function get() {
      return _forEachOf2.INTERFACES;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available enum within the schema.
     *
     * @type {number}
     */
  }, {
    key: "ENUMS",
    get: function get() {
      return _forEachOf2.ENUMS;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available union within the schema.
     *
     * @type {number}
     */
  }, {
    key: "UNIONS",
    get: function get() {
      return _forEachOf2.UNIONS;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available scalar within the schema.
     *
     * @type {number}
     */
  }, {
    key: "SCALARS",
    get: function get() {
      return _forEachOf2.SCALARS;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available root type; Query, Mutation and Subscription
     *
     * @type {number}
     */
  }, {
    key: "ROOT_TYPES",
    get: function get() {
      return _forEachOf2.ROOT_TYPES;
    }

    /**
     * Constant used with `forEachOf()` that signifies you wish to iterate
     * over every available GraphQLInputObjectType within the schema.
     *
     * @type {number}
     */
  }, {
    key: "INPUT_TYPES",
    get: function get() {
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
  }, {
    key: "HIDDEN",
    get: function get() {
      return _forEachOf2.HIDDEN;
    }
  }]);
  return Schemata;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(String), Symbol.species, Symbol.iterator, Symbol.toStringTag, _util["default"].inspect.custom);
/**
 * Given an type, determine if the type is a root type; i.e. one of Query,
 * Mutation or Subscription as defined in the `graphql` library.
 *
 * @param  {mixed} t a GraphQL AST or object type denoting a schema type
 * @return {Boolean} true if the type supplied is a root type; false otherwise
 */
var isRootType = exports.isRootType = function isRootType(t) {
  if (t === undefined || t === null || !t) {
    return false;
  }
  var name = typeof t.name === 'string' ? t.name : t.name.value;
  return t instanceof _graphql.GraphQLObjectType && (t.name === 'Query' || t.name === 'Mutation' || t.name === 'Subscription');
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
function runInjectors(config, resolverArgs) {
  var args;
  if (!Array.isArray(config.resolverInjectors)) {
    config.resolverInjectors = [config.resolverInjectors];
  }
  var _iterator7 = _createForOfIteratorHelper(config.resolverInjectors),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var injector = _step7.value;
      args = injector(resolverArgs);
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
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
  var baseConfig = {
    resolverInjectors: [function __schema_injector__(_ref) {
      var source = _ref.source,
        args = _ref.args,
        context = _ref.context,
        info = _ref.info;
      info.schema = schema || info.schema;
      return {
        source: source,
        args: args,
        context: context,
        info: info
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
 * @return {ResolverMap} an object containing a mapping of typeName.fieldName
 * that links to the resolve() function it is associated within the supplied
 * schema
 */
function stripResolversFromSchema(schema) {
  var resolvers = {};
  if (!schema) {
    return null;
  }
  (0, _forEachOf2.forEachField)(schema, function (type, typeName, typeDirectives, field, fieldName, fieldArgs, fieldDirectives, _schema, context) {
    if (field.resolve) {
      resolvers[typeName] = resolvers[typeName] || {};
      resolvers[typeName][fieldName] = resolvers[typeName][fieldName] || {};
      resolvers[typeName][fieldName] = field.resolve;
    }
  });
  return resolvers;
}

/** @type {Symbol} a unique symbol used as a key to all instance sdl strings */
var TYPEDEFS_KEY = exports.TYPEDEFS_KEY = Symbol('internal-typedefs-key');

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
var GRAPHIQL_FLAG = exports.GRAPHIQL_FLAG = Symbol["for"]('internal-graphiql-key');

/** @type {Symbol} a constant symbol used as a key to a flag for express-gql */
var SCHEMA_DIRECTIVES = exports.SCHEMA_DIRECTIVES = Symbol["for"]('internal-directives-key');

/** @type {Symbol} a unique symbol used as a key to all instance `WeakMap`s */
var MAP = exports.MAP = Symbol('internal-weak-map-key');

/** @type {Symbol} a key used to store the __executable__ flag on a schema */
var EXE = exports.EXE = Symbol('executable-schema');

/** @type {Object} a key used to store a resolver object in a WeakMap */
var wmkResolvers = Object(Symbol('GraphQL Resolvers storage key'));

/** @type {Object} a key used to store an internal schema in a WeakMap */
var wmkSchema = Object(Symbol('GraphQLSchema storage key'));

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
var wmkPreboundResolvers = Object(Symbol('Resolvers pre-merge-wrapped'));

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
  return rightConfig ? rightConfig : leftConfig || null;
}

/**
 * In order to facilitate merging, there needs to be some contingency plan
 * for what to do when conflicts arise. This object specifies one of each
 * type of resolver. Each simply takes the right-hand value.
 *
 * @type {Object}
 */
var DefaultConflictResolvers = exports.DefaultConflictResolvers = {
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
var DefaultMergeOptions = exports.DefaultMergeOptions = {
  conflictResolvers: DefaultConflictResolvers,
  resolverInjectors: [],
  injectMergedSchema: true,
  createMissingResolvers: false
};
var subTypeResolverMap = new Map();
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
function combineTypeAndSubType(subTypeName, lType, rType) {
  var conflictResolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DefaultConflictResolvers;
  if (rType[subTypeName]) {
    var _iterator8 = _createForOfIteratorHelper(rType[subTypeName]),
      _step8;
    try {
      var _loop3 = function _loop3() {
        var rSubType = _step8.value;
        var lSubType = lType[subTypeName].find(function (f) {
          return f.name.value == rSubType.name.value;
        });
        if (!lSubType) {
          lType[subTypeName].push(rSubType);
          return 1; // continue
        }
        var resolver = subTypeResolverMap.get(subTypeName) || 'fieldMergeResolver';
        var resultingSubType = conflictResolvers[resolver](lType, lSubType, rType, rSubType);
        var index = lType.fields.indexOf(lSubType);
        lType[subTypeName].splice(index, 1, resultingSubType);
      };
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        if (_loop3()) continue;
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
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
function pareTypeAndSubType(subTypeName, lType, rType) {
  var resolvers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _iterator9 = _createForOfIteratorHelper(rType[subTypeName]),
    _step9;
  try {
    var _loop4 = function _loop4() {
      var rSubType = _step9.value;
      var lSubType = lType[subTypeName].find(function (f) {
        return f.name.value == rSubType.name.value;
      });
      if (!lSubType) {
        return 1; // continue
      }
      var index = lType.fields.indexOf(lSubType);
      lType[subTypeName].splice(index, 1);
      if (resolvers[lType.name.value] && resolvers[lType.name.value][lSubType.name.value]) {
        delete resolvers[lType.name.value][lSubType.name.value];
      } else if (resolvers[lSubType.name.value]) {
        delete resolvers[lSubType.name.value];
      }
    };
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      if (_loop4()) continue;
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
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
function normalizeSource(typeDefs) {
  var wrap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!typeDefs) {
    throw new Error((0, _neTagFns.inline)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n      normalizeSource(typeDefs): typeDefs was invalid when passed to the\n      function `normalizeSource`. Please check your code and try again.\n\n      (received: ", ")\n    "], ["\n      normalizeSource(typeDefs): typeDefs was invalid when passed to the\n      function \\`normalizeSource\\`. Please check your code and try again.\n\n      (received: ", ")\n    "])), typeDefs));
  }
  if (typeDefs instanceof Schemata && typeDefs.valid && wrap) {
    return typeDefs;
  }
  var source = (typeDefs.body || typeDefs.sdl || typeof typeDefs === 'string' && typeDefs || (0, _typeof2["default"])(typeDefs) === 'object' && Schemata.print(typeDefs) || (typeDefs instanceof _graphql.GraphQLSchema ? (0, _graphql.printSchema)(typeDefs) : typeDefs.toString())).toString().trim();
  return wrap ? Schemata.from(source) : source;
}
var _default = exports["default"] = Schemata;