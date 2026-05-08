/**
 * @fileoverview CJS Register - CommonJS entry point for require.extensions
 *
 * This file provides backward compatibility for CommonJS environments that
 * want to use require.extensions for .graphql files. Note that this feature
 * is deprecated in Node.js.
 *
 * WARNING: require.extensions is deprecated and disabled in ESM contexts.
 * This module only works in CommonJS (CJS) mode.
 *
 * @example
 * // CommonJS require hook (deprecated but supported)
 * require('@nejs/schemata/register')
 */

const { readFileSync } = require('fs')
const { parse } = require('graphql')

/**
 * Synchronously reads and parses a GraphQL SDL file.
 *
 * @param {string} filename - The full path to the .graphql file
 * @return {Object} An object with sdl, ast, and schemata properties
 */
function readAndParseGraphQL(filename) {
  const content = readFileSync(filename, 'utf-8')
  const ast = parse(content)

  return {
    sdl: content,
    ast,
    typeDefs: content,
    default: content
  }
}

/**
 * Custom extension handler for .graphql, .gql, and .sdl files.
 *
 * @param {Object} module - Node.js Module instance
 * @param {string} filename - Full path to the file
 */
function graphQLExtensionHandler(module, filename) {
  try {
    module.exports = readAndParseGraphQL(filename)
  }
  catch (error) {
    delete require.cache[filename]
    throw error
  }
}

/**
 * Registers the custom extension handlers for .graphql, .sdl, and .gql files.
 *
 * IMPORTANT: This only works in CommonJS contexts. In ESM (type: module),
 * this function is disabled because require.extensions doesn't exist.
 */
function register() {
  if (typeof require === 'undefined' || !require.extensions) {
    console.warn(
      '[ne-schemata] register() requires CommonJS context. ' +
      'require.extensions is not available in ESM.'
    )
    return
  }

  require.extensions['.graphql'] = graphQLExtensionHandler
  require.extensions['.sdl'] = graphQLExtensionHandler
  require.extensions['.gql'] = graphQLExtensionHandler

  console.log('[ne-schemata] Registered .graphql, .gql, .sdl extensions for require()')
}

/**
 * Deregisters the custom extension handlers.
 */
function deregister() {
  if (typeof require === 'undefined' || !require.extensions) {
    return
  }

  delete require.extensions['.graphql']
  delete require.extensions['.sdl']
  delete require.extensions['.gql']
}

module.exports = { register, deregister }

// Auto-register if this file is required directly
if (require.main === module) {
  register()
}
