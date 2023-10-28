import { Schemata } from './Schemata'
import { readFileSync, existsSync } from 'fs'
import { extname, resolve } from 'path'

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
  let content = readFileSync(filename)
  let schemata = new Schemata(content.toString())
  let schema = schemata.schema
  let astNode = schemata.ast
  let resolvers
  let jsFilename
  let tsFilename
  let jsModule

  try {
    jsFilename = resolve(filename.replace(extname(filename), '.js'))
    if (existsSync(jsFilename)) {
      jsModule = require(jsFilename)
    }

    tsFilename = resolve(filename.replace(extname(filename), '.ts'))
    if (existsSync(tsFilename)) {
      jsModule = require(tsFilename)
    }

    resolvers = jsModule?.resolvers ?? (typeof jsModule == 'object' && jsModule)
  }
  catch (error) {
    console.error(error)

    process.nextTick(() => {
      delete require.cache[jsFilename]
      delete require.cache[tsFilename]
    })

    resolvers = null
  }

  // Assign the resolvers to the sdl string
  schemata.resolvers = resolvers
  if (schemata.resolvers) {
    schemata.clearSchema()
    schema = schemata.schema
  }

  // For all intents and purposes this is an object that can be treated like
  // a string but that also has three extra properties; sdl, ast and schema.
  // `ast` and `schema` invoke the functions `parse` and `buildSchema` from
  // the 'graphql' module, respectively
  module.exports = {
    astNode,
    default: schemata,
    resolvers,
    schema,
    sdl: schemata,
    schemata,
    typeDefs: schemata
  }
}

/**
 * Acts as a higher order function that wraps the .js extension handler. 
 */
export function jsExtensionWrapper() {
  if (require.originalJSExtensionHandler) { return }

  require.originalJSExtensionHandler = require.extensions['.js']

  /**
   * The handler will first check to see if there is a .graphql file with the same
   * name as the .js file. If there is, it will use the .graphql file instead
   * of the .js file by deferrring to the function graphQLExtensionHandler. The
   * original JS extension wrapper is stored such that unregister can be 
   * called to undo the changes. 
   */
  require.extensions['.js'] = function(module, filename) {
    const graphqlFilename = filename.replace(extname(filename), '.graphql')
    if (existsSync(graphqlFilename)) {
      return graphQLExtensionHandler(module, graphqlFilename)
    }
    return require.originalJSExtensionHandler(module, filename)
  }
}

/**
 * Registers the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files with
 * the same name.
 */
export function register() {
  require.extensions = require.extensions || {}

  if (!require.originalJSExtensionHandler) {
    jsExtensionWrapper()
  }
  require.extensions['.graphql'] = graphQLExtensionHandler
  require.extensions['.sdl'] = graphQLExtensionHandler
  require.extensions['.gql'] = graphQLExtensionHandler
}

/**
 * Deregisters the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and restores the original `.js` extension handler.
 */
export function deregister() {
  if (require.originalJSExtensionHandler) {
    require.extensions['.js'] = require.originalJSExtensionHandler
    delete require.originalJSExtensionHandler
  }

  delete require.extensions['.graphql']
  delete require.extensions['.sdl']
  delete require.extensions['.gql']
}

/**
 * Sets up custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files
 * with the same name.
 *
 * @type {Function}
 */
export default register
