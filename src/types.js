import type { Schemata } from './Schemata'
import type { Source, GraphQLSchema, ASTNode } from 'graphql'

/**
 * The ResolverInfo type declares the properties that will likely
 * need to be applied to schema after the executableSchema has
 * been created. This needs to be expanded to also include handlers
 * for directives and custom scalars.
 *
 * @type {ResolverInfo}
 */
export type ResolverInfo = {
  type: string,
  resolveType?: (obj, contextValue, info) => string,
  isTypeOf?: (obj, context, info) => boolean,
  description?: () => string
}

/**
 * An object that specifies the various types of resolvers that might occur
 * during a given conflict resolution
 */
export type ConflictResolvers = {
  /** A handler for resolving fields in matching types */
  fieldMergeResolver?: FieldMergeResolver,

  /** A handler for resolving directives in matching types */
  directiveMergeResolver?: DirectiveMergeResolver,

  /** A handler for resolving conflicting enum values */
  enumValueMergeResolver?: EnumMergeResolver,

  /** A handler for resolving type values in unions */
  typeValueMergeResolver?: UnionMergeResolver,

  /** A handler for resolving scalar config conflicts in custom scalars */
  scalarMergeResolver?: ScalarMergeResolver
}

/**
 * The callback for collision when a directive is trying to be merged with an
 * existing directive.
 *
 * @param {ASTNode} leftType the ASTNode, usually denoting a type, that will
 * receive the merged type's directive from the right
 * @param {DirectiveNode} leftDirective the DirectiveNode denoting the value
 * that should be modified or replaced
 * @param {ASTNode} rightType the ASTNode containing the directive to be merged
 * @param {DirectiveNode} rightDirective the DirectiveNode requesting to be
 * merged and finding a conflicting value already present
 * @return {DirectiveNode} the directive to merge into the existing schema
 * layout. To ignore changes, returning the leftDirective is sufficient enough.
 * The default behavior is to always take the right hand value, overwriting
 * new with old
 */
export type DirectiveMergeResolver = (
  leftType: ASTNode,
  leftDirective: DirectiveNode,
  rightType: ASTNode,
  rightDirective: DirectiveNode
) => DirectiveNode

/**
 * The callback for collision when a enum value is trying to be merged with an
 * existing enum value of the same name.
 *
 * @param {ASTNode} leftType the ASTNode, usually denoting a type, that will
 * receive the merged type's enum value from the right
 * @param {EnumValueNode} leftValue the EnumValueNode denoting the value
 * that should be modified or replaced
 * @param {ASTNode} rightType the ASTNode containing the enum value to be
 * merged
 * @param {EnumValueNode} rightValue the EnumValueNode requesting to be
 * merged and finding a conflicting value already present
 * @return {EnumValueNode} the enum value to merge into the existing schema
 * layout. To ignore changes, returning the leftValue is sufficient enough.
 * The default behavior is to always take the right hand value, overwriting
 * new with old
 */
export type EnumMergeResolver = (
  leftType: ASTNode,
  leftValue: EnumValueNode,
  rightType: ASTNode,
  rightValue: EnumValueNode
) => EnumValueNode

/**
 * The callback for collision when a field is trying to be merged with an
 * existing field.
 *
 * @param {ASTNode} leftType the ASTNode, usually denoting a type, that will
 * receive the merged type's field from the right
 * @param {FieldNode} leftField the FieldNode denoting the value that should
 * be modified or replaced
 * @param {ASTNode} rightType the ASTNode containing the field to be merged
 * @param {FieldNode} rightField the FieldNode requesting to be merged and
 * finding a conflicting value already present
 * @return {FieldNode} the field to merge into the existing schema layout. To
 * ignore changes, returning the leftField is sufficient enough. The default
 * behavior is to always take the right hand value, overwriting new with old
 */
export type FieldMergeResolver = (
  leftType: ASTNode,
  leftField: FieldNode,
  rightType: ASTNode,
  rightField: FieldNode
) => FieldNode

/**
 * A flow type definition of an object containing one or more resolver
 * injector functions.
 *
 * The `.resolverInjectors` property is an array of `ResolverArgsTransformer`
 * functions that allow you to modify the arguments being sent to the resolvers
 * in question.
 *
 * If `.injectMergedSchema` is true, all existing resolvers will be wrapped
 * with an instance of `ExtendedResolver` that injects a reference to the newly
 * merged GraphQLSchema rather than any previously set elsewhere.
 *
 * If `.createMissingResolvers` is true, every field that doesn't have a
 * resolver will be assigned the `defaultFieldResolver` before the injection of
 * any newly merged schema occurs.
 *
 * @see ResolverArgsTransformer
 * @type {MergeOptionsConfig}
 */
export type MergeOptionsConfig = {
  conflictResolvers: ConflictResolvers,
  resolverInjectors: ResolverArgsTransformer | Array<ResolverArgsTransformer>,
  injectMergedSchema: boolean,
  createMissingResolvers: boolean
}

/**
 * To complete the ResolverMap type, we define a string key mapped to either
 * a function or a nested `ResolverMap`.
 *
 * @type {ResolverMap}
 */
export type ResolverMap = { [string]: Function | ResolverMap }

/**
 * All resolvers are passed four parameters. This object contains all four
 * of those parameters.
 *
 * @type {ResolverArgs}
 */
export type ResolverArgs = {
  source: mixed,
  args: mixed,
  context: mixed,
  info: GraphQLResolveInfo
}

/**
 * A function that takes an option that conforms to `ResolverArgs`. The values
 * passed in must be passed back, or variations of the same type. The idea is
 * to allow the values to be modified, viewed or parsed before merged resolvers
 * are bound with these values.
 *
 * @param  {ResolverArgs} args an object with the four arguments passed to each
 * resolver so that they can be modified before used to wrap existing resolvers
 * after a merge.
 * @return {ResolverArgs} see above
 */
export type ResolverArgsTransformer = (args: ResolverArgs) => ResolverArgs

/**
 * A callback for to resolve merge conflicts with custom scalar types defined
 * by the user.
 *
 * @param {ScalarTypeDefinitionNode} leftScalar the definition node found when
 * parsing ASTNodes. This is the existing value that conflicts with the to be
 * merged value
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
export type ScalarMergeResolver = (
  leftScalar: ScalarTypeDefinitionNode,
  leftConfig: GraphQLScalarTypeConfig,
  rightScalar: ScalarTypeDefinitionNode,
  rightConfig: GraphQLScalarTypeConfig
) => GraphQLScalarTypeConfig

/**
 * The callback for collision when a union type is trying to be merged with an
 * existing union type of the same name.
 *
 * @param {ASTNode} leftType the ASTNode, usually denoting a type, that will
 * receive the merged type's union type from the right
 * @param {NamedTypeNode} leftValue the NamedTypeNode denoting the value
 * that should be modified or replaced
 * @param {ASTNode} rightType the ASTNode containing the union type to be
 * merged
 * @param {NamedTypeNode} rightValue the NamedTypeNode requesting to be
 * merged and finding a conflicting value already present
 * @return {NamedTypeNode} the union type to merge into the existing schema
 * layout. To ignore changes, returning the leftUnion is sufficient enough.
 * The default behavior is to always take the right hand value, overwriting
 * new with old
 */
export type UnionMergeResolver = (
  leftType: ASTNode,
  leftUnion: NamedTypeNode,
  rightType: ASTNode,
  rightUnion: NamedTypeNode
) => NamedTypeNode

/**
 * A flow type that represents the various types of inputs that can often
 * be used to construct an instance of `Schemata`.
 *
 * @type {SchemaSource}
 */
export type SchemaSource = string
  | Source
  | Schemata
  | GraphQLSchema
  | ASTNodes;

/**
 * A flow type defining the parameters for creating a new instance of
 * `ExtendedResolverMap`. At least the resolver map is required, but ideally
 * a `.schema` or `.sdl` value are desired
 *
 * @type {ExtendedResolverMapConfig}
 */
export type ExtendedResolverMapConfig = {
  schema?: ?GraphQLSchema,
  sdl?: string | Schemata,
  resolvers: { [string]: string },
}

/**
 * A union of types representing either the ExtendedResolverMapConfig type or
 * an instance of Schemata.
 *
 * @type {SchemataConfigUnion}
 */
export type SchemataConfigUnion = ExtendedResolverMapConfig | Schemata

/**
 * The ResolverResultsPatcher is an asynchronous function, or a function that
 * returns a promise, which receives the final value of all the extended
 * resolvers combined work as a parameter. The results of this function will
 * be the final value returned to the GraphQL engine.
 *
 * @type {AsyncFunction}
 */
export type ResolverResultsPatcher = (results: mixed) => Promise<mixed>

/**
 * An `EntryInspector` is a function passed to `walkResolverMap` that is
 * invoked for each encountered pair along the way as it traverses the
 * `ResolverMap` in question. The default behavior is to simply return the
 * supplied entry back.
 *
 * If false, null or undefined is returned instead of an object with a string
 * mapping to a Function, then that property will not be included in the final
 * results of `walkResolverMap`.
 *
 * @type {Function}
 *
 * @param {{[string]: Function}} entry the key value pair supplied on each call
 * @param {[string]} path an array of strings indicating the path currently
 * being executed
 * @param {ResolverMap} map the map in question should it be needed
 */
export type EntryInspector = (
  key: string,
  value: Function,
  path: Array<string>,
  map: ResolverMap
) => ?{ [string]: Function }

/**
 * An `AsyncEntryInspector` is a function passed to `asyncWalkResolverMap`
 * that is invoked for each encountered pair along the way as it traverses the
 * `ResolverMap` in question. The default behavior is to simply return the
 * supplied entry back.
 *
 * If false, null or undefined is returned instead of an object with a string
 * mapping to a Function, then that property will not be included in the final
 * results of `asyncWalkResolverMap`.
 *
 * @type {Function}
 *
 * @param {{[string]: Function}} entry the key value pair supplied on each call
 * @param {[string]} path an array of strings indicating the path currently
 * being executed
 * @param {ResolverMap} map the map in question should it be needed
 */
export type AsyncEntryInspector = (
  key: string,
  value: Function,
  path: Array<string>,
  map: ResolverMap
) => ?Promise<{ [string]: Function }>
