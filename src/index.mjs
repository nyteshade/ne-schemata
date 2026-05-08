import { Schemata } from './Schemata.mjs'

export * from './Schemata.mjs'
export * from './dynamicImport.mjs'
export * from './GraphQLExtension.mjs'

export * from './ExtendedResolver.mjs'
export * from './ExtendedResolverMap.mjs'
export * from './gqlTagFn.mjs'
export * from './propAt.mjs'
export * from './walkResolverMap.mjs'
export * from './utils/signatures.mjs'
export * from './utils/typework.mjs'
export * from './utils/resolverwork.mjs'

export * from './errors/BaseError.mjs'
export * from './errors/index.mjs'

// Re-export type definitions for JSDoc/IDE support
// These are not runtime values, just type exports for documentation
export * from './types.mjs'

const SDL = Schemata

export {
  // Exported Schemata.js class
  Schemata,

  // For backwards compatibility
  SDL,
}

export default Schemata
