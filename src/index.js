import { Schemata } from './Schemata'

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

export * from './errors/BaseError'
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

  // For backwards compatibility
  SDL,
}

export default Schemata
