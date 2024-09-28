import { Schemata } from './Schemata'
import { dynamicImport, supportsNativeTypeScript } from './dynamicImport'

import { exists as fsExists } from 'fs'
import { readFile } from 'fs/promises'
import { resolve, parse, format } from 'path'
import { promisify } from 'util'
import { asyncTryCatch, ifParsedPath } from './utils'

/**
 * Includes common Schema Definition Language file extensions. Typically they
 * are .graphql or .gql files, but less commonly are also .typedef or .sdl
 * files.
 *
 * @type {string[]}
 */
export const StandardSDLExtensions = ['.graphql', '.gql', '.typedef', '.sdl']

/**
 * Includes common JavaScript file extensions. Typically these include .js,
 * .mjs (Module or ESM JavaScript) and .cjs (CommonJS JavaScript).
 *
 * @type {string[]}
 */
export const StandardJSExtensions = ['.js', '.cjs', '.mjs']

/**
 * Includes common TypeScript file extensions supported by recent versions of
 * NodeJS. Typically these are .ts, .mts (Modele or ESM TypeScript) and
 * .cts (CommonJS TypeScript) files.
 *
 * @type {string[]}
 */
export const StandardTSExtensions = ['.ts', '.cts', '.mts']

/**
 * The combined arrays of `StandardJSExtensions` and `StandardTSExtensions`.
 *
 * @type {string[]}
 * @see {@link StandardJSExtensions}
 * @see {@link StandardTSExtensions}
 */
export const StandardResolverExtensions = [
  ...StandardJSExtensions,
  ...StandardTSExtensions,
]

/**
 * The combined arrays of `StandardJSExtensions` and `StandardTSExtensions` as
 * well as `StandardSDLExtensions`.
 *
 * @type {string[]}
 * @see {@link StandardJSExtensions}
 * @see {@link StandardTSExtensions}
 */
export const AllSchemataExtensions = [
  ...StandardSDLExtensions,
  ...StandardResolverExtensions,
]

/**
 * Resolves the given path to an existing set of file paths based on known
 * or specified extensions. A resulting object will always be returned, even
 * if no paths could be found.
 *
 * The function performs a series of checks and transformations on the
 * `givenPath` input to ascertain its validity and attempt to resolve it to an
 * existing file. Initially, it discerns whether `givenPath` already has a file
 * extension. If it does, and the file exists, it returns the resolved path.
 * If not, it iterates through a list of file extensions (provided in `tryExts`
 * or defaults to ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts']), appending
 * each extension to `givenPath`, checking the existence of the resultant file,
 * and returning the path upon successful resolution.
 *
 * Utilizes functions from the 'fs', 'fs/promises', and 'path' modules of
 * Node.js, as well as a custom `Schemata` import. It employs the `promisify`
 * utility to handle callback-based `fs` functions in a promise oriented manner.
 *
 * @note runtime loading of TypeScript modules is only supported in a few case;
 * 1. if the appropriate --experimental flags are present, 2. if a node wrapper
 * like `tsx` or `ts-node` are being used. The function
 * `supportsNativeTypeScript()` is used to check for this.
 *
 * @param {string|object} givenPath - The file path to be resolved. Should be
 * a string representing a relative or absolute path to a file, with or without
 * a file extension. Alternatively, if the output of a call to parse() from the
 * `node:path` library is supplied, it will be formatted to a string and used
 * that way.
 * @param {string[]?} [tryExts=AllSchemataExtensions] -
 * An optional array of string file extensions to attempt appending to
 * `givenPath` if it lacks an extension.
 * @param {boolean?} [doNotRemoveTsExtensions=false] should always be false
 * unless the Schemata library hasn't been upgraded and nodejs now allows
 * loading of TypeScript files without any flags or using non-experimental
 * flags.
 * @returns {Promise<object>} A promise that resolves to an object with three
 * properties: `sdl`, `resolver` and `unknown`. Each of these properties is
 * an array with 0 or more strings pointing to existing files that fall into
 * one of three categories. If the file is a known SDL extension type, it goes
 * into `.sdl`, likewise if it is any known resolver type (JS or TS), it goes
 * into `.resolver`, lastly, it goes into `.unknown` if the neither of the two
 * other categories are matched.
 * @throws Will throw an error if any of the filesystem operations fail, for
 * instance due to insufficient permissions.
 *
 * @see {@link StandardJSExtensions}
 * @see {@link StandardTSExtensions}
 * @see {@link StandardResolverExtensions}
 * @see {@link AllSchemataExtensions}
 *
 * @example
 * // Assume a file named 'example.js' exists in the current directory
 * // Outputs: {
 * //   sdl: [],
 * //   resolver: ['/absolute/path/to/example.js'],
 * //   unknown: [],
 * //   hasValues: true
 * // }
 * resolvedPaths('./example').then(resolved => console.log(resolved));
 *
 * // Assume a file named 'example.graphql' and 'example.js' exists in the
 * // current directory
 * // Outputs: {
 * //   sdl: ['/absolute/path/to/example.graphql'],
 * //   resolver: ['/absolute/path/to/example.js'],
 * //   unknown: [],
 * //   hasValues: true
 * // }
 * resolvedPaths('./example').then(resolved => console.log(resolved));
 */
export async function resolvedPaths(
  givenPath,
  tryExts = AllSchemataExtensions,
  doNotRemoveTsExtensions = false
) {
  if (!supportsNativeTypeScript() && !doNotRemoveTsExtensions) {
    for (const tsExt of StandardTSExtensions) {
      const indexOfTSExt = tryExts.indexOf(tsExt)

      if (~indexOfTSExt) {
        tryExts.splice(indexOfTSExt, 1)
      }
    }
  }

  const hasExt = filePath => !!(parse(String(filePath)).ext)
  const exists = promisify(fsExists)
  const resolved = resolve(ifParsedPath(givenPath, p => format(p), givenPath))

  // If we don't empty `base`, then format() will not take the new extension
  const parsed = { ...parse(resolved), ...{ base: '' } }

  // We want to capture any SDL extensions separate from any Resolver extensions
  const result = {
    sdl: [],
    resolver: [],
    unknown: [],
    hasValues: false,
  }

  if (parsed.ext && (await exists(resolved))) {
    if (StandardSDLExtensions.includes(parsed.ext)) {
      result.sdl.push(resolved)
    }
    else if (StandardResolverExtensions.includes(parsed.ext)) {
      result.resolver.push(resolved)
    }
    else {
      result.unknown.push(resolved)
    }

    const index = tryExts.indexOf(parsed.ext)
    if (~index) {
      tryExts.splice(index, 1)
    }

    result.hasValues = true;
  }

  for (let ext of tryExts) {
    let tryParsed = {...parsed, ...{ ext }}
    let tryPath = format(tryParsed)
    let tryTrue = await exists(tryPath)

    console.log(`Trying ${ext}...${tryPath}? ${tryTrue}`)

    if (tryTrue) {
      if (StandardSDLExtensions.includes(ext)) {
        result.sdl.push(tryPath)
      }
      else if (StandardResolverExtensions.includes(ext)) {
        result.resolver.push(tryPath)
      }
      else {
        result.unknown.push(tryPath)
      }

      result.hasValues = true
    }
  }

  return result
}

/**
 * Resolves the given path to an existing file path by attempting to append
 * provided or default file extensions, and returns the resolved file path. This
 * function actually calls {@link resolvedPaths} and returns the first SDL file
 * path, followed by the first resolver file path, followed by the first unknown
 * file path, in that order. If no file path could be found, undefined is
 * returned
 *
 * The function performs a series of checks and transformations on the
 * `givenPath` input to ascertain its validity and attempt to resolve it to an
 * existing file. Initially, it discerns whether `givenPath` already has a file
 * extension. If it does, and the file exists, it returns the resolved path.
 * If not, it iterates through a list of file extensions (provided in `tryExts`
 * or defaults to all known Schemata file type extensions), appending each
 * extension to `givenPath`, checking the existence of the resultant file,
 * and returning the path upon successful resolution.
 *
 * Utilizes functions from the 'fs', 'fs/promises', and 'path' modules of
 * Node.js, as well as a custom `Schemata` import. It employs the `promisify`
 * utility to handle callback-based `fs` functions in a promise oriented manner.
 *
 * @note runtime loading of TypeScript modules is only supported in a few case;
 * 1. if the appropriate --experimental flags are present, 2. if a node wrapper
 * like `tsx` or `ts-node` are being used. The function
 * `supportsNativeTypeScript()` is used to check for this.
 *
 * @param {string|object} givenPath - The file path to be resolved. Should be
 * a string representing a relative or absolute path to a file, with or without
 * a file extension. Alternatively, if the output of a call to parse() from the
 * `node:path` library is supplied, it will be formatted to a string and used
 * that way.
 * @param {string[]?} [tryExts=AllSchemataExtensions] -
 * An optional array of string file extensions to attempt appending to
 * `givenPath` if it lacks an extension.
 * @param {boolean?} [doNotRemoveTsExtensions=false] should always be false
 * unless the Schemata library hasn't been upgraded and nodejs now allows
 * loading of TypeScript files without any flags or using non-experimental
 * flags.
 * @returns {Promise<string>} A promise that resolves to a string
 * representing the path to an existing file, or undefined if no path could
 * be resolved. This will return the first found artifact from a call to
 * {@link resolvedPaths} in the following order:
 * `result?.[sdl|resolver|unknown]?.[0]`
 *
 * @throws Will throw an error if any of the filesystem operations fail, for
 * instance due to insufficient permissions.
 *
 * @see {@link StandardJSExtensions}
 * @see {@link StandardTSExtensions}
 * @see {@link StandardResolverExtensions}
 * @see {@link AllSchemataExtensions}
 *
 * @example
 * // Assume a file named 'example.js' exists in the current directory
 * // Outputs: '/absolute/path/to/example.js'
 * resolvedPath('./example').then(resolved => console.log(resolved));
 *
 * // Outputs: undefined (if 'example.ts' doesn't exist)
 * resolvedPath('./example.ts').then(resolved => console.log(resolved));
 */
export async function resolvedPath(
 givenPath,
 tryExts = AllSchemataExtensions,
 doNotRemoveTsExtensions = false
) {
  const paths = resolvedPaths(givenPath, tryExts, doNotRemoveTsExtensions)

  return paths.sdl?.[0] ?? paths.resolver?.[0] ?? paths.unknown?.[0]
}

/**
 * Adds the ability to `require` or `import` files ending in a `.graphql`
 * extension. The exports returned from such an import consist of four
 * major values and one default value.
 *
 * values:
 *   astNode   - an ASTNode document object representing the SDL contents
 *               of the .graphql file contents. Null if the text is invalid
 *   resovlers - if there is an adjacent file with the same name, ending in
 *               .js and it exports either a `resolvers` key or an object by
 *               default, this value will be set on the sdl object as its set
 *               resolvers/rootObj
 *   schema    - a GraphQLSchema instance object if the contents of the .graphql
 *               file represent both valid SDL and contain at least one root
 *               type such as Query, Mutation or Subscription
 *   sdl       - the string of SDL wrapped in an instance of Schemata
 *   typeDefs  - the raw string used that `sdl` wraps
 *   default   - the sdl string wrapped in an instance of Schemata is the
 *               default export
 *
 * @param {Module} module a node JS Module instance
 * @param {string} filename a fully qualified path to the file being imported
 */
export function graphQLExtensionHandler(module, filename) {
  (async function() {
    try {
      module.exports = await importGraphQL(filename)
    }
    catch (error) {
      console.error(error)

      const path = await resolvedPath(filename, ['.graphql', '.gql', '.sdl'])
      process.nextTick(() => {
        if (path) {
          delete require.cache[path]
        }
      })

      module.exports = undefined
    }
  })()
}

/**
 * Registers the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files with
 * the same name.
 */
export function register() {
  require.extensions = require.extensions || {}
  require.extensions['.graphql'] = graphQLExtensionHandler
  require.extensions['.sdl'] = graphQLExtensionHandler
  require.extensions['.gql'] = graphQLExtensionHandler
}

/**
 * Deregisters the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and restores the original `.js` extension handler.
 */
export function deregister() {
  delete require.extensions['.graphql']
  delete require.extensions['.sdl']
  delete require.extensions['.gql']
}

/**
 * Asynchronously imports and resolves a GraphQL schema and its resolvers from
 * given paths. Supports custom conflict resolution for resolver properties.
 *
 * @async
 * @function importResolvedGraphQL
 * @param {Object} paths - An object containing paths to SDL and resolver files.
 * @param {Object} [options] - Configuration options for importing the schema.
 * @param {(
 *   existingResolver: ResolverProperty,
 *   conflictingResolver: ResolverProperty,
 * ) => Function
 * } [options.conflictResolver]
 *   - A function to resolve conflicts between existing and new resolvers.
 *   Defaults to returning the new resolver.
 * @returns {Promise<Object|null>} The imported GraphQL schema and resolvers,
 *   or null if no valid paths are provided.
 *
 * @example
 * const paths = {
 *   sdl: ['schema.graphql'],
 *   resolver: ['resolvers.js']
 * }
 * const schema = await importResolvedGraphQL(paths)
 *
 * @example
 * const paths = {
 *   sdl: ['schema.graphql'],
 *   resolver: ['resolvers.js']
 * }
 * const options = {
 *   conflictResolver: (prev, next) => {
 *     // Custom conflict resolution logic
 *     return next.value
 *   }
 * }
 * const schema = await importResolvedGraphQL(paths, options)
 */
export async function importResolvedGraphQL(
  paths,
  options = {
    conflictResolver(prevResolver, newResolver) {
      return newResolver.value
    }
  }
) {
  if (!(paths?.hasValues))
    return null

  const content = []
  let { conflictResolver } = options?.conflictResolver ?? ((_, n) => n.value)

  // Wrap the received conflict resolver in an async function if it is not
  // already asynchronous (support everything!)
  if (!({}).toString.apply(conflictResolver).includes('AsyncFunction')) {
    const syncConflictResolver = conflictResolver ?? ((_, n) => n.value)

    async function conflictResolverHoF(prev, conf) {
      return syncConflictResolver(prev, conf)
    }

    conflictResolver = conflictResolverHoF
  }

  for (const sdlPath of paths.sdl) {
    content.push((await readFile(sdlPath)).toString())
  }

  const schemata = new Schemata(content.join('\n'))
  const astNode = schemata.ast
  let schema = schemata.schema

  let resolversPath = null
  let resolvers = {}

  for (const resolverPath of paths.resolver) {
    const module = await asyncTryCatch(
      async () => await dynamicImport(resolverPath),
      async (error) => {
        console.error(`Failed to load module ${resolverPath}`, error)
        return {}
      }
    )

    // Asynchronously check for conflicts in resolver properties
    // Recursive merge for object properties
    const mergeResolvers = async (target, source, pathSoFar = []) => {
      for (const [key, value] of Object.entries(source)) {
        pathSoFar.push(key)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (!target[key]) {
            target[key] = {}
          }
          await mergeResolvers(target[key], value, pathSoFar)
        } else {
          const existingResolver = {
            name: key,
            value: target[key],
            path: pathSoFar,
            object: resolvers,
          }

          const conflictingResolver = {
            name: key,
            value,
            path: pathSoFar,
            object: module,
          }

          target[key] = await conflictResolver(
            existingResolver,
            conflictingResolver
          )
        }
      }
    }

    await mergeResolvers(resolvers, module)
  }

  if (Object.keys(resolvers).length) {
    schemata.clearSchema()
    schemata.resolvers = resolvers
    schemata.schema
  }
  else {
    resolvers = null
  }

  // For all intents and purposes this is an object that can be treated like
  // a string but that also has three extra properties; sdl, ast and schema.
  // `ast` and `schema` invoke the functions `parse` and `buildSchema` from
  // the 'graphql' module, respectively
  return {
    astNode,
    resolvers,
    schema,
    sdl: schemata.sdl,
    schemata,
    typeDefs: schemata,
    resolversPath,
  }
}

/**
 * Asynchronously imports a GraphQL schema and its resolvers from a given file.
 *
 * This function attempts to resolve the provided filename with various
 * extensions and then imports the resolved GraphQL schema and its resolvers.
 * It supports custom conflict resolution for resolver properties.
 *
 * @async
 * @function importGraphQL
 * @param {string} filename - The base filename to resolve and import.
 * @param {string[]} [tryExts=AllSchemataExtensions] - An array of extensions
 *   to try when resolving the filename.
 * @param {Object} [options] - Configuration options for importing the schema.
 * @param {function(Object, Object, string): Object} [options.conflictResolver]
 *   - A function to resolve conflicts between existing and new resolvers.
 *   Defaults to returning the new resolver.
 * @returns {Promise<Object>} The imported GraphQL schema and resolvers.
 *
 * @example
 * // Import a GraphQL schema from 'schema.graphql' with default extensions
 * const schema = await importGraphQL('schema.graphql')
 *
 * @example
 * // Import a GraphQL schema with custom conflict resolution
 * const schema = await importGraphQL('schema.graphql', ['.graphql', '.gql'], {
 *   conflictResolver: (prev, next, name) => {
 *     // Custom conflict resolution logic
 *     return next
 *   }
 * })
 */
export async function importGraphQL(
  filename,
  tryExts = AllSchemataExtensions,
  options = {
    conflictResolver(prevResolver, newResolver, resolverName) {
      return newResolver
    }
  }
) {
  const remext = fn => format({...parse(fn), ...{base: '', ext: ''}})
  const paths = await resolvedPaths(filename, tryExts)

  return await importResolvedGraphQL(paths, options)
}

/**
 * Sets up custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files
 * with the same name.
 *
 * @type {Function}
 */
export default register
