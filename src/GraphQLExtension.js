import { Schemata } from './Schemata'
import { dynamicImport } from './dynamicImport'

import { exists as fsExists } from 'fs'
import { readFile } from 'fs/promises'
import { resolve, parse, format } from 'path'
import { promisify } from 'util'

/**
 * Resolves the given path to an existing file by attempting to append provided or
 * default file extensions, and returns the resolved file path.
 *
 * The function performs a series of checks and transformations on the `givenPath`
 * input to ascertain its validity and attempt to resolve it to an existing file.
 * Initially, it discerns whether `givenPath` already has a file extension. If it
 * does, and the file exists, it returns the resolved path. If not, it iterates
 * through a list of file extensions (provided in `tryExts` or defaults to
 * ['.js', '.ts']), appending each extension to `givenPath`, checking the existence
 * of the resultant file, and returning the path upon successful resolution.
 *
 * Utilizes functions from the 'fs', 'fs/promises', and 'path' modules of Node.js,
 * as well as a custom `Schemata` import. It employs the `promisify` utility to
 * handle callback-based `fs` functions in a promise oriented manner.
 *
 * @param {string} givenPath - The file path to be resolved. Should be a string
 * representing a relative or absolute path to a file, with or without a file extension.
 * @param {Array<string>} [tryExts=['.js', '.ts']] - An optional array of string
 * file extensions to attempt appending to `givenPath` if it lacks an extension.
 * Defaults to ['.js', '.ts'].
 * @returns {Promise<string|null>} A promise that resolves to a string representing
 * the path to an existing file, or null if no file could be resolved.
 * @throws Will throw an error if any of the filesystem operations fail, for instance
 * due to insufficient permissions.
 *
 * @example
 * // Assume a file named 'example.js' exists in the current directory
 * // Outputs: '/absolute/path/to/example.js'
 * resolvedPath('./example').then(resolved => console.log(resolved));
 *
 * // Outputs: null (if 'example.ts' doesn't exist)
 * resolvedPath('./example.ts').then(resolved => console.log(resolved));
 */
export async function resolvedPath(givenPath, tryExts = ['.js', '.ts']) {
  const hasext = filepath => !!parse(String(filepath)).ext
  const exists = promisify(fsExists)
  const nopath = fp => { let parsed = parse(fp); return !!(parsed.root || parsed.dir) }

  let resolved = resolve(givenPath)
  let parsed = { ...parse(resolved), ...{ base: '' } }
  let useFilepath = null

  if (hasext(resolved) && (await exists(resolved))) {
    useFilepath = resolved
  }
  else {
    for (let ext of tryExts) {
      let tryPath = format({...parsed, ...{ ext }})
      let tryTrue = await exists(tryPath)
      if (tryTrue) {
        return tryPath
      }
    }
  }

  return useFilepath
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

export async function importGraphQL(filename, tryExts = ['.graphql', '.gql', '.sdl']) {
  const remext = fn => format({...parse(fn), ...{base: '', ext: ''}})

  const filepath = await resolvedPath(filename, tryExts)
  if (!filepath) { return null }

  const content = (await readFile(filepath)).toString()
  const schemata = new Schemata(content)
  const astNode = schemata.ast
  let schema = schemata.schema

  let resolversPath = null
  let resolvers = null

  try {
    resolversPath = await resolvedPath(remext(filepath))
    if (resolversPath) {
      const jsModule = await dynamicImport(resolversPath)
      schemata.resolvers = resolvers = jsModule?.resolvers ?? (typeof jsModule == 'object' && jsModule)
      if (schemata.resolvers) {
        schemata.clearSchema()
        schema = schemata.schema
      }
    }
  }
  catch (ignore) { console.error(ignore) }

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
    filePath: filepath,
    resolversPath,
  }
}

/**
 * Sets up custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files
 * with the same name.
 *
 * @type {Function}
 */
export default register
