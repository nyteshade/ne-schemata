import { Schemata } from './Schemata'
import jestTransformer from './jestTransformer'

export * from './Schemata'
export * from './dynamicImport'
export * from './GraphQLExtension'

export * from './ExtendedResolver'
export * from './ExtendedResolverMap'
export * from './gqlTagFn'
export * from './propAt'
export * from './walkResolverMap'
export * from './utils/signatures'
export * from './utils/typework'
export * from './utils/resolverwork'

export * from './BaseError'
export * from './errors'

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
