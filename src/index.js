import { Schemata } from './Schemata'
import jestTransformer from './jestTransformer'

export {
  DefaultConflictResolvers,
  DefaultDirectiveMergeResolver,
  DefaultEnumMergeResolver,
  DefaultFieldMergeResolver,
  DefaultMergeOptions,
  DefaultScalarMergeResolver,
  DefaultUnionMergeResolver,
  isRootType,
  normalizeSource,
  runInjectors,
  SchemaInjectorConfig,
  stripResolversFromSchema,
  TYPEDEFS_KEY
} from './Schemata'

export { ExtendedResolver } from './ExtendedResolver'
export { ExtendedResolverMap } from './ExtendedResolverMap'
export { register, graphQLExtensionHandler } from './GraphQLExtension'
export { gql } from './gqlTagFn'
export { at, atNicely } from './propAt'
export {
  walkResolverMap,
  asyncWalkResolverMap,
  DefaultEntryInspector,
  DefaultAsyncEntryInspector,
} from './walkResolverMap'

export { BaseError } from './BaseError'
export {
  ResolverMapStumble,
  WrappedResolverExecutionError,
  ResolverResultsPatcherError,
} from './errors'

export type {
  AsyncEntryInspector,
  ConflictResolvers,
  DirectiveMergeResolver,
  EntryInspector,
  EnumMergeResolver,
  FieldMergeResolver,
  MergeOptionsConfig,
  ResolverArgs,
  ResolverArgsTransformer,
  ResolverMap,
  ResolverResultsPatcher,
  ScalarMergeResolver,
  SchemaSource,
  UnionMergeResolver,
} from './types'

const SDL = Schemata

export {
  // Exported Schemata.js types
  Schemata,

  // An object containing a `.process` function used with jest in order to
  // simulate require/import extension in the highly mocked jest test
  // environment.
  jestTransformer,

  // For backwards compatibility
  SDL,
}

export default Schemata
