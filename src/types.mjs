/**
 * @fileoverview Type definitions for ne-schemata.
 *
 * This file uses JSDoc type annotations instead of TypeScript or Flow.
 * The types are used by IDEs and documentation generators.
 */

/**
 * The ResolverInfo type declares properties that will likely
 * need to be applied to schema after the executableSchema has
 * been created. This includes handlers for directives and custom scalars.
 *
 * @typedef {Object} ResolverInfo
 * @property {string} type - The GraphQL type name
 * @property {Function} [resolveType] - Function to resolve type for unions/interfaces
 * @property {Function} [isTypeOf] - Function to determine if an object is of this type
 * @property {Function} [description] - Getter function for dynamic description
 * @property {Object.<string, Function|string>} [fieldDescriptions] - Field descriptions
 * @property {Function} applyTo - Function to apply these settings to a schema
 * @property {boolean} [isDeprecated] - Whether this type is deprecated
 * @property {string} [deprecationReason] - Reason for deprecation
 * @property {string} [specifiedByURL] - URL to scalar specification
 */

/**
 * An object that specifies the various types of resolvers that might occur
 * during a given conflict resolution.
 *
 * @typedef {Object} ConflictResolvers
 * @property {FieldMergeResolver} [fieldMergeResolver] - Handler for field conflicts
 * @property {DirectiveMergeResolver} [directiveMergeResolver] - Handler for directive conflicts
 * @property {EnumMergeResolver} [enumValueMergeResolver] - Handler for enum value conflicts
 * @property {UnionMergeResolver} [typeValueMergeResolver] - Handler for union type conflicts
 * @property {ScalarMergeResolver} [scalarMergeResolver] - Handler for scalar conflicts
 */

/**
 * Callback for collision when a directive is being merged with an
 * existing directive.
 *
 * @callback DirectiveMergeResolver
 * @param {Object} leftType - The ASTNode, usually denoting a type, that will
 *   receive the merged type's directive from the right
 * @param {Object} leftDirective - The DirectiveNode denoting the value
 *   that should be modified or replaced
 * @param {Object} rightType - The ASTNode containing the directive to be merged
 * @param {Object} rightDirective - The DirectiveNode requesting to be
 *   merged and finding a conflicting value already present
 * @return {Object} The directive to merge into the existing schema layout.
 *   To ignore changes, returning the leftDirective is sufficient.
 *   The default behavior is to always take the right hand value.
 */

/**
 * Callback for collision when an enum value is being merged with an
 * existing enum value of the same name.
 *
 * @callback EnumMergeResolver
 * @param {Object} leftType - The ASTNode, usually denoting a type, that will
 *   receive the merged type's enum value from the right
 * @param {Object} leftValue - The EnumValueNode denoting the value
 *   that should be modified or replaced
 * @param {Object} rightType - The ASTNode containing the enum value to be merged
 * @param {Object} rightValue - The EnumValueNode requesting to be merged
 *   and finding a conflicting value already present
 * @return {Object} The enum value to merge into the existing schema layout.
 *   To ignore changes, returning the leftValue is sufficient.
 *   The default behavior is to always take the right hand value.
 */

/**
 * Callback for collision when a field is being merged with an existing field.
 *
 * @callback FieldMergeResolver
 * @param {Object} leftType - The ASTNode, usually denoting a type, that will
 *   receive the merged type's field from the right
 * @param {Object} leftField - The FieldNode denoting the value that should
 *   be modified or replaced
 * @param {Object} rightType - The ASTNode containing the field to be merged
 * @param {Object} rightField - The FieldNode requesting to be merged and
 *   finding a conflicting value already present
 * @return {Object} The field to merge into the existing schema layout. To
 *   ignore changes, returning the leftField is sufficient. The default
 *   behavior is to always take the right hand value, overwriting new with old.
 */

/**
 * An object defining how schema merging should be configured.
 *
 * The `resolverInjectors` property is an array of `ResolverArgsTransformer`
 * functions that allow you to modify the arguments being sent to the resolvers
 * in question.
 *
 * If `injectMergedSchema` is true, all existing resolvers will be wrapped
 * with an instance of `ExtendedResolver` that injects a reference to the newly
 * merged GraphQLSchema rather than any previously set elsewhere.
 *
 * If `createMissingResolvers` is true, every field that doesn't have a
 * resolver will be assigned the `defaultFieldResolver` before the injection of
 * any newly merged schema occurs.
 *
 * @typedef {Object} MergeOptionsConfig
 * @property {ConflictResolvers} conflictResolvers - Resolvers for conflicts
 * @property {ResolverArgsTransformer|Array<ResolverArgsTransformer>} resolverInjectors
 *   - Functions to transform resolver arguments
 * @property {boolean} injectMergedSchema - Whether to inject merged schema
 * @property {boolean} createMissingResolvers - Whether to create missing resolvers
 */

/**
 * A resolver map with string keys mapped to functions or nested ResolverMaps.
 *
 * @typedef {Object.<string, Function|ResolverMap>} ResolverMap
 */

/**
 * All resolvers are passed four parameters. This object contains all four
 * of those parameters.
 *
 * @typedef {Object} ResolverArgs
 * @property {*} source - The source/parent object being resolved
 * @property {Object} args - The arguments passed to the field
 * @property {*} context - The shared context object
 * @property {Object} info - The GraphQL resolve info object
 */

/**
 * A function that takes and returns ResolverArgs, allowing modification
 * of resolver arguments before they are passed to the actual resolver.
 *
 * @callback ResolverArgsTransformer
 * @param {ResolverArgs} args - The resolver arguments
 * @return {ResolverArgs} The transformed arguments
 */

/**
 * A callback for resolving merge conflicts with custom scalar types.
 *
 * @callback ScalarMergeResolver
 * @param {Object} leftScalar - The definition node found when parsing ASTNodes.
 *   This is the existing value that conflicts with the to-be-merged value.
 * @param {Object|null} leftConfig - If there is a resolver defined for the
 *   existing ScalarTypeDefinitionNode it will be provided here. If this
 *   value is null, there is no available config with serialize(), parseValue()
 *   or parseLiteral() to work with.
 * @param {Object} rightScalar - The definition node found when parsing ASTNodes.
 *   This is the to-be-merged value that conflicts with the existing value.
 * @param {Object|null} rightConfig - If there is a resolver defined for the
 *   to-be-merged ScalarTypeDefinitionNode it will be provided here.
 * @return {Object|null} Whichever type config or resolver was desired.
 *
 * @see https://www.apollographql.com/docs/graphql-tools/scalars.html
 * @see http://graphql.org/graphql-js/type/#graphqlscalartype
 */

/**
 * Callback for collision when a union type is being merged with an
 * existing union type of the same name.
 *
 * @callback UnionMergeResolver
 * @param {Object} leftType - The ASTNode, usually denoting a type, that will
 *   receive the merged type's union type from the right
 * @param {Object} leftValue - The NamedTypeNode denoting the value
 *   that should be modified or replaced
 * @param {Object} rightType - The ASTNode containing the union type to be merged
 * @param {Object} rightValue - The NamedTypeNode requesting to be merged
 *   and finding a conflicting value already present
 * @return {Object} The union type to merge into the existing schema layout.
 *   To ignore changes, returning the leftUnion is sufficient.
 *   The default behavior is to always take the right hand value.
 */

/**
 * Represents the various types of inputs that can be used to construct
 * an instance of `Schemata`.
 *
 * @typedef {string|Object} SchemaSource
 * Can be:
 * - A string of SDL
 * - A Source instance from graphql-js
 * - A Schemata instance
 * - A GraphQLSchema instance
 * - An ASTNode/DocumentNode
 */

/**
 * Parameters for creating a new instance of `ExtendedResolverMap`.
 *
 * @typedef {Object} ExtendedResolverMapConfig
 * @property {Object} [schema] - A GraphQLSchema instance
 * @property {string|Object} [sdl] - SDL string or Schemata instance
 * @property {Object} resolvers - The resolver map object
 */

/**
 * A union type representing either the ExtendedResolverMapConfig or
 * an instance of Schemata.
 *
 * @typedef {ExtendedResolverMapConfig|Object} SchemataConfigUnion
 */

/**
 * An asynchronous function that receives the final value of all the extended
 * resolvers combined work as a parameter. The results of this function will
 * be the final value returned to the GraphQL engine.
 *
 * @callback ResolverResultsPatcher
 * @param {*} results - The results from resolver execution
 * @param {*} source - The source object
 * @param {Object} args - Field arguments
 * @param {*} context - Context object
 * @param {Object} info - GraphQL resolve info
 * @return {Promise<*>|*} The patched results
 */

/**
 * A function passed to `walkResolverMap` that is invoked for each
 * encountered pair along the way as it traverses the `ResolverMap`.
 *
 * If false, null or undefined is returned instead of an object with a string
 * mapping to a Function, then that property will not be included in the final
 * results of `walkResolverMap`.
 *
 * @callback EntryInspector
 * @param {string} key - The key at the current position
 * @param {Function} value - The value at the current position
 * @param {Array<string>} path - Path to the current position
 * @param {ResolverMap} map - The map being walked
 * @return {Object.<string, Function>|null|undefined} The entry to include,
 *   or falsy to exclude
 */

/**
 * An async function passed to `asyncWalkResolverMap` that is invoked for
 * each encountered pair along the way.
 *
 * @callback AsyncEntryInspector
 * @param {string} key - The key at the current position
 * @param {Function} value - The value at the current position
 * @param {Array<string>} path - Path to the current position
 * @param {ResolverMap} map - The map being walked
 * @return {Promise<Object.<string, Function>|null|undefined>} The entry to
 *   include, or falsy to exclude
 */

/**
 * Property descriptor for a resolver property within a ResolverMap.
 *
 * @typedef {Object} ResolverProperty
 * @property {string} name - The property name
 * @property {*} value - The property value
 * @property {Array<string>} path - Path to this property
 * @property {Object} object - The parent object containing this property
 */
