"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StandardTSExtensions = exports.StandardSDLExtensions = exports.StandardResolverExtensions = exports.StandardJSExtensions = exports.AllSchemataExtensions = void 0;
exports.deregister = deregister;
exports.graphQLExtensionHandler = graphQLExtensionHandler;
exports.importGraphQL = importGraphQL;
exports.importResolvedGraphQL = importResolvedGraphQL;
exports.register = register;
exports.resolvedPath = resolvedPath;
exports.resolvedPaths = resolvedPaths;
var _Schemata = require("./Schemata");
var _dynamicImport = require("./dynamicImport");
var _fs = require("fs");
var _promises = require("fs/promises");
var _path = require("path");
var _util = require("util");
var _utils = require("./utils");
/**
 * Includes common Schema Definition Language file extensions. Typically they
 * are .graphql or .gql files, but less commonly are also .typedef or .sdl
 * files.
 *
 * @type {string[]}
 */
const StandardSDLExtensions = exports.StandardSDLExtensions = ['.graphql', '.gql', '.typedef', '.sdl'];

/**
 * Includes common JavaScript file extensions. Typically these include .js,
 * .mjs (Module or ESM JavaScript) and .cjs (CommonJS JavaScript).
 *
 * @type {string[]}
 */
const StandardJSExtensions = exports.StandardJSExtensions = ['.js', '.cjs', '.mjs'];

/**
 * Includes common TypeScript file extensions supported by recent versions of
 * NodeJS. Typically these are .ts, .mts (Modele or ESM TypeScript) and
 * .cts (CommonJS TypeScript) files.
 *
 * @type {string[]}
 */
const StandardTSExtensions = exports.StandardTSExtensions = ['.ts', '.cts', '.mts'];

/**
 * The combined arrays of `StandardJSExtensions` and `StandardTSExtensions`.
 *
 * @type {string[]}
 * @see {@link StandardJSExtensions}
 * @see {@link StandardTSExtensions}
 */
const StandardResolverExtensions = exports.StandardResolverExtensions = [...StandardJSExtensions, ...StandardTSExtensions];

/**
 * The combined arrays of `StandardJSExtensions` and `StandardTSExtensions` as
 * well as `StandardSDLExtensions`.
 *
 * @type {string[]}
 * @see {@link StandardJSExtensions}
 * @see {@link StandardTSExtensions}
 */
const AllSchemataExtensions = exports.AllSchemataExtensions = [...StandardSDLExtensions, ...StandardResolverExtensions];

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
async function resolvedPaths(givenPath, tryExts = AllSchemataExtensions, doNotRemoveTsExtensions = false) {
  if (!(0, _dynamicImport.supportsNativeTypeScript)() && !doNotRemoveTsExtensions) {
    for (const tsExt of StandardTSExtensions) {
      const indexOfTSExt = tryExts.indexOf(tsExt);
      if (~indexOfTSExt) {
        tryExts.splice(indexOfTSExt, 1);
      }
    }
  }
  const hasExt = filePath => !!(0, _path.parse)(String(filePath)).ext;
  const exists = (0, _util.promisify)(_fs.exists);
  const resolved = (0, _path.resolve)((0, _utils.ifParsedPath)(givenPath, p => (0, _path.format)(p), givenPath));

  // If we don't empty `base`, then format() will not take the new extension
  const parsed = {
    ...(0, _path.parse)(resolved),
    ...{
      base: ''
    }
  };

  // We want to capture any SDL extensions separate from any Resolver extensions
  const result = {
    sdl: [],
    resolver: [],
    unknown: [],
    hasValues: false
  };
  if (parsed.ext && (await exists(resolved))) {
    if (StandardSDLExtensions.includes(parsed.ext)) {
      result.sdl.push(resolved);
    } else if (StandardResolverExtensions.includes(parsed.ext)) {
      result.resolver.push(resolved);
    } else {
      result.unknown.push(resolved);
    }
    const index = tryExts.indexOf(parsed.ext);
    if (~index) {
      tryExts.splice(index, 1);
    }
    result.hasValues = true;
  }
  for (let ext of tryExts) {
    let tryParsed = {
      ...parsed,
      ...{
        ext
      }
    };
    let tryPath = (0, _path.format)(tryParsed);
    let tryTrue = await exists(tryPath);
    console.log(`Trying ${ext}...${tryPath}? ${tryTrue}`);
    if (tryTrue) {
      if (StandardSDLExtensions.includes(ext)) {
        result.sdl.push(tryPath);
      } else if (StandardResolverExtensions.includes(ext)) {
        result.resolver.push(tryPath);
      } else {
        result.unknown.push(tryPath);
      }
      result.hasValues = true;
    }
  }
  return result;
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
async function resolvedPath(givenPath, tryExts = AllSchemataExtensions, doNotRemoveTsExtensions = false) {
  const paths = resolvedPaths(givenPath, tryExts, doNotRemoveTsExtensions);
  return paths.sdl?.[0] ?? paths.resolver?.[0] ?? paths.unknown?.[0];
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
function graphQLExtensionHandler(module, filename) {
  (async function () {
    try {
      module.exports = await importGraphQL(filename);
    } catch (error) {
      console.error(error);
      const path = await resolvedPath(filename, ['.graphql', '.gql', '.sdl']);
      process.nextTick(() => {
        if (path) {
          delete require.cache[path];
        }
      });
      module.exports = undefined;
    }
  })();
}

/**
 * Registers the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files with
 * the same name.
 */
function register() {
  require.extensions = require.extensions || {};
  require.extensions['.graphql'] = graphQLExtensionHandler;
  require.extensions['.sdl'] = graphQLExtensionHandler;
  require.extensions['.gql'] = graphQLExtensionHandler;
}

/**
 * Deregisters the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and restores the original `.js` extension handler.
 */
function deregister() {
  delete require.extensions['.graphql'];
  delete require.extensions['.sdl'];
  delete require.extensions['.gql'];
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
async function importResolvedGraphQL(paths, options = {
  conflictResolver(prevResolver, newResolver) {
    return newResolver.value;
  }
}) {
  if (!paths?.hasValues) return null;
  const content = [];
  let {
    conflictResolver
  } = options?.conflictResolver ?? ((_, n) => n.value);

  // Wrap the received conflict resolver in an async function if it is not
  // already asynchronous (support everything!)
  if (!{}.toString.apply(conflictResolver).includes('AsyncFunction')) {
    const syncConflictResolver = conflictResolver ?? ((_, n) => n.value);
    async function conflictResolverHoF(prev, conf) {
      return syncConflictResolver(prev, conf);
    }
    conflictResolver = conflictResolverHoF;
  }
  for (const sdlPath of paths.sdl) {
    content.push((await (0, _promises.readFile)(sdlPath)).toString());
  }
  const schemata = new _Schemata.Schemata(content.join('\n'));
  const astNode = schemata.ast;
  let schema = schemata.schema;
  let resolversPath = null;
  let resolvers = {};
  for (const resolverPath of paths.resolver) {
    const module = await (0, _utils.asyncTryCatch)(async () => await (0, _dynamicImport.dynamicImport)(resolverPath), async error => {
      console.error(`Failed to load module ${resolverPath}`, error);
      return {};
    });

    // Asynchronously check for conflicts in resolver properties
    // Recursive merge for object properties
    const mergeResolvers = async (target, source, pathSoFar = []) => {
      for (const [key, value] of Object.entries(source)) {
        pathSoFar.push(key);
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (!target[key]) {
            target[key] = {};
          }
          await mergeResolvers(target[key], value, pathSoFar);
        } else {
          const existingResolver = {
            name: key,
            value: target[key],
            path: pathSoFar,
            object: resolvers
          };
          const conflictingResolver = {
            name: key,
            value,
            path: pathSoFar,
            object: module
          };
          target[key] = await conflictResolver(existingResolver, conflictingResolver);
        }
      }
    };
    await mergeResolvers(resolvers, module);
  }
  if (Object.keys(resolvers).length) {
    schemata.clearSchema();
    schemata.resolvers = resolvers;
    schemata.schema;
  } else {
    resolvers = null;
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
    resolversPath
  };
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
async function importGraphQL(filename, tryExts = AllSchemataExtensions, options = {
  conflictResolver(prevResolver, newResolver, resolverName) {
    return newResolver;
  }
}) {
  const remext = fn => (0, _path.format)({
    ...(0, _path.parse)(fn),
    ...{
      base: '',
      ext: ''
    }
  });
  const paths = await resolvedPaths(filename, tryExts);
  return await importResolvedGraphQL(paths, options);
}

/**
 * Sets up custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files
 * with the same name.
 *
 * @type {Function}
 */
var _default = exports.default = register;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfU2NoZW1hdGEiLCJyZXF1aXJlIiwiX2R5bmFtaWNJbXBvcnQiLCJfZnMiLCJfcHJvbWlzZXMiLCJfcGF0aCIsIl91dGlsIiwiX3V0aWxzIiwiU3RhbmRhcmRTRExFeHRlbnNpb25zIiwiZXhwb3J0cyIsIlN0YW5kYXJkSlNFeHRlbnNpb25zIiwiU3RhbmRhcmRUU0V4dGVuc2lvbnMiLCJTdGFuZGFyZFJlc29sdmVyRXh0ZW5zaW9ucyIsIkFsbFNjaGVtYXRhRXh0ZW5zaW9ucyIsInJlc29sdmVkUGF0aHMiLCJnaXZlblBhdGgiLCJ0cnlFeHRzIiwiZG9Ob3RSZW1vdmVUc0V4dGVuc2lvbnMiLCJzdXBwb3J0c05hdGl2ZVR5cGVTY3JpcHQiLCJ0c0V4dCIsImluZGV4T2ZUU0V4dCIsImluZGV4T2YiLCJzcGxpY2UiLCJoYXNFeHQiLCJmaWxlUGF0aCIsInBhcnNlIiwiU3RyaW5nIiwiZXh0IiwiZXhpc3RzIiwicHJvbWlzaWZ5IiwiZnNFeGlzdHMiLCJyZXNvbHZlZCIsInJlc29sdmUiLCJpZlBhcnNlZFBhdGgiLCJwIiwiZm9ybWF0IiwicGFyc2VkIiwiYmFzZSIsInJlc3VsdCIsInNkbCIsInJlc29sdmVyIiwidW5rbm93biIsImhhc1ZhbHVlcyIsImluY2x1ZGVzIiwicHVzaCIsImluZGV4IiwidHJ5UGFyc2VkIiwidHJ5UGF0aCIsInRyeVRydWUiLCJjb25zb2xlIiwibG9nIiwicmVzb2x2ZWRQYXRoIiwicGF0aHMiLCJncmFwaFFMRXh0ZW5zaW9uSGFuZGxlciIsIm1vZHVsZSIsImZpbGVuYW1lIiwiaW1wb3J0R3JhcGhRTCIsImVycm9yIiwicGF0aCIsInByb2Nlc3MiLCJuZXh0VGljayIsImNhY2hlIiwidW5kZWZpbmVkIiwicmVnaXN0ZXIiLCJleHRlbnNpb25zIiwiZGVyZWdpc3RlciIsImltcG9ydFJlc29sdmVkR3JhcGhRTCIsIm9wdGlvbnMiLCJjb25mbGljdFJlc29sdmVyIiwicHJldlJlc29sdmVyIiwibmV3UmVzb2x2ZXIiLCJ2YWx1ZSIsImNvbnRlbnQiLCJfIiwibiIsInRvU3RyaW5nIiwiYXBwbHkiLCJzeW5jQ29uZmxpY3RSZXNvbHZlciIsImNvbmZsaWN0UmVzb2x2ZXJIb0YiLCJwcmV2IiwiY29uZiIsInNkbFBhdGgiLCJyZWFkRmlsZSIsInNjaGVtYXRhIiwiU2NoZW1hdGEiLCJqb2luIiwiYXN0Tm9kZSIsImFzdCIsInNjaGVtYSIsInJlc29sdmVyc1BhdGgiLCJyZXNvbHZlcnMiLCJyZXNvbHZlclBhdGgiLCJhc3luY1RyeUNhdGNoIiwiZHluYW1pY0ltcG9ydCIsIm1lcmdlUmVzb2x2ZXJzIiwidGFyZ2V0Iiwic291cmNlIiwicGF0aFNvRmFyIiwia2V5IiwiT2JqZWN0IiwiZW50cmllcyIsIkFycmF5IiwiaXNBcnJheSIsImV4aXN0aW5nUmVzb2x2ZXIiLCJuYW1lIiwib2JqZWN0IiwiY29uZmxpY3RpbmdSZXNvbHZlciIsImtleXMiLCJsZW5ndGgiLCJjbGVhclNjaGVtYSIsInR5cGVEZWZzIiwicmVzb2x2ZXJOYW1lIiwicmVtZXh0IiwiZm4iLCJfZGVmYXVsdCIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi9zcmMvR3JhcGhRTEV4dGVuc2lvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlbWF0YSB9IGZyb20gJy4vU2NoZW1hdGEnXG5pbXBvcnQgeyBkeW5hbWljSW1wb3J0LCBzdXBwb3J0c05hdGl2ZVR5cGVTY3JpcHQgfSBmcm9tICcuL2R5bmFtaWNJbXBvcnQnXG5cbmltcG9ydCB7IGV4aXN0cyBhcyBmc0V4aXN0cyB9IGZyb20gJ2ZzJ1xuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcy9wcm9taXNlcydcbmltcG9ydCB7IHJlc29sdmUsIHBhcnNlLCBmb3JtYXQgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcbmltcG9ydCB7IGFzeW5jVHJ5Q2F0Y2gsIGlmUGFyc2VkUGF0aCB9IGZyb20gJy4vdXRpbHMnXG5cbi8qKlxuICogSW5jbHVkZXMgY29tbW9uIFNjaGVtYSBEZWZpbml0aW9uIExhbmd1YWdlIGZpbGUgZXh0ZW5zaW9ucy4gVHlwaWNhbGx5IHRoZXlcbiAqIGFyZSAuZ3JhcGhxbCBvciAuZ3FsIGZpbGVzLCBidXQgbGVzcyBjb21tb25seSBhcmUgYWxzbyAudHlwZWRlZiBvciAuc2RsXG4gKiBmaWxlcy5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKi9cbmV4cG9ydCBjb25zdCBTdGFuZGFyZFNETEV4dGVuc2lvbnMgPSBbJy5ncmFwaHFsJywgJy5ncWwnLCAnLnR5cGVkZWYnLCAnLnNkbCddXG5cbi8qKlxuICogSW5jbHVkZXMgY29tbW9uIEphdmFTY3JpcHQgZmlsZSBleHRlbnNpb25zLiBUeXBpY2FsbHkgdGhlc2UgaW5jbHVkZSAuanMsXG4gKiAubWpzIChNb2R1bGUgb3IgRVNNIEphdmFTY3JpcHQpIGFuZCAuY2pzIChDb21tb25KUyBKYXZhU2NyaXB0KS5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKi9cbmV4cG9ydCBjb25zdCBTdGFuZGFyZEpTRXh0ZW5zaW9ucyA9IFsnLmpzJywgJy5janMnLCAnLm1qcyddXG5cbi8qKlxuICogSW5jbHVkZXMgY29tbW9uIFR5cGVTY3JpcHQgZmlsZSBleHRlbnNpb25zIHN1cHBvcnRlZCBieSByZWNlbnQgdmVyc2lvbnMgb2ZcbiAqIE5vZGVKUy4gVHlwaWNhbGx5IHRoZXNlIGFyZSAudHMsIC5tdHMgKE1vZGVsZSBvciBFU00gVHlwZVNjcmlwdCkgYW5kXG4gKiAuY3RzIChDb21tb25KUyBUeXBlU2NyaXB0KSBmaWxlcy5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKi9cbmV4cG9ydCBjb25zdCBTdGFuZGFyZFRTRXh0ZW5zaW9ucyA9IFsnLnRzJywgJy5jdHMnLCAnLm10cyddXG5cbi8qKlxuICogVGhlIGNvbWJpbmVkIGFycmF5cyBvZiBgU3RhbmRhcmRKU0V4dGVuc2lvbnNgIGFuZCBgU3RhbmRhcmRUU0V4dGVuc2lvbnNgLlxuICpcbiAqIEB0eXBlIHtzdHJpbmdbXX1cbiAqIEBzZWUge0BsaW5rIFN0YW5kYXJkSlNFeHRlbnNpb25zfVxuICogQHNlZSB7QGxpbmsgU3RhbmRhcmRUU0V4dGVuc2lvbnN9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGFuZGFyZFJlc29sdmVyRXh0ZW5zaW9ucyA9IFtcbiAgLi4uU3RhbmRhcmRKU0V4dGVuc2lvbnMsXG4gIC4uLlN0YW5kYXJkVFNFeHRlbnNpb25zLFxuXVxuXG4vKipcbiAqIFRoZSBjb21iaW5lZCBhcnJheXMgb2YgYFN0YW5kYXJkSlNFeHRlbnNpb25zYCBhbmQgYFN0YW5kYXJkVFNFeHRlbnNpb25zYCBhc1xuICogd2VsbCBhcyBgU3RhbmRhcmRTRExFeHRlbnNpb25zYC5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKiBAc2VlIHtAbGluayBTdGFuZGFyZEpTRXh0ZW5zaW9uc31cbiAqIEBzZWUge0BsaW5rIFN0YW5kYXJkVFNFeHRlbnNpb25zfVxuICovXG5leHBvcnQgY29uc3QgQWxsU2NoZW1hdGFFeHRlbnNpb25zID0gW1xuICAuLi5TdGFuZGFyZFNETEV4dGVuc2lvbnMsXG4gIC4uLlN0YW5kYXJkUmVzb2x2ZXJFeHRlbnNpb25zLFxuXVxuXG4vKipcbiAqIFJlc29sdmVzIHRoZSBnaXZlbiBwYXRoIHRvIGFuIGV4aXN0aW5nIHNldCBvZiBmaWxlIHBhdGhzIGJhc2VkIG9uIGtub3duXG4gKiBvciBzcGVjaWZpZWQgZXh0ZW5zaW9ucy4gQSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYWx3YXlzIGJlIHJldHVybmVkLCBldmVuXG4gKiBpZiBubyBwYXRocyBjb3VsZCBiZSBmb3VuZC5cbiAqXG4gKiBUaGUgZnVuY3Rpb24gcGVyZm9ybXMgYSBzZXJpZXMgb2YgY2hlY2tzIGFuZCB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlXG4gKiBgZ2l2ZW5QYXRoYCBpbnB1dCB0byBhc2NlcnRhaW4gaXRzIHZhbGlkaXR5IGFuZCBhdHRlbXB0IHRvIHJlc29sdmUgaXQgdG8gYW5cbiAqIGV4aXN0aW5nIGZpbGUuIEluaXRpYWxseSwgaXQgZGlzY2VybnMgd2hldGhlciBgZ2l2ZW5QYXRoYCBhbHJlYWR5IGhhcyBhIGZpbGVcbiAqIGV4dGVuc2lvbi4gSWYgaXQgZG9lcywgYW5kIHRoZSBmaWxlIGV4aXN0cywgaXQgcmV0dXJucyB0aGUgcmVzb2x2ZWQgcGF0aC5cbiAqIElmIG5vdCwgaXQgaXRlcmF0ZXMgdGhyb3VnaCBhIGxpc3Qgb2YgZmlsZSBleHRlbnNpb25zIChwcm92aWRlZCBpbiBgdHJ5RXh0c2BcbiAqIG9yIGRlZmF1bHRzIHRvIFsnLmpzJywgJy5janMnLCAnLm1qcycsICcudHMnLCAnLmN0cycsICcubXRzJ10pLCBhcHBlbmRpbmdcbiAqIGVhY2ggZXh0ZW5zaW9uIHRvIGBnaXZlblBhdGhgLCBjaGVja2luZyB0aGUgZXhpc3RlbmNlIG9mIHRoZSByZXN1bHRhbnQgZmlsZSxcbiAqIGFuZCByZXR1cm5pbmcgdGhlIHBhdGggdXBvbiBzdWNjZXNzZnVsIHJlc29sdXRpb24uXG4gKlxuICogVXRpbGl6ZXMgZnVuY3Rpb25zIGZyb20gdGhlICdmcycsICdmcy9wcm9taXNlcycsIGFuZCAncGF0aCcgbW9kdWxlcyBvZlxuICogTm9kZS5qcywgYXMgd2VsbCBhcyBhIGN1c3RvbSBgU2NoZW1hdGFgIGltcG9ydC4gSXQgZW1wbG95cyB0aGUgYHByb21pc2lmeWBcbiAqIHV0aWxpdHkgdG8gaGFuZGxlIGNhbGxiYWNrLWJhc2VkIGBmc2AgZnVuY3Rpb25zIGluIGEgcHJvbWlzZSBvcmllbnRlZCBtYW5uZXIuXG4gKlxuICogQG5vdGUgcnVudGltZSBsb2FkaW5nIG9mIFR5cGVTY3JpcHQgbW9kdWxlcyBpcyBvbmx5IHN1cHBvcnRlZCBpbiBhIGZldyBjYXNlO1xuICogMS4gaWYgdGhlIGFwcHJvcHJpYXRlIC0tZXhwZXJpbWVudGFsIGZsYWdzIGFyZSBwcmVzZW50LCAyLiBpZiBhIG5vZGUgd3JhcHBlclxuICogbGlrZSBgdHN4YCBvciBgdHMtbm9kZWAgYXJlIGJlaW5nIHVzZWQuIFRoZSBmdW5jdGlvblxuICogYHN1cHBvcnRzTmF0aXZlVHlwZVNjcmlwdCgpYCBpcyB1c2VkIHRvIGNoZWNrIGZvciB0aGlzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gZ2l2ZW5QYXRoIC0gVGhlIGZpbGUgcGF0aCB0byBiZSByZXNvbHZlZC4gU2hvdWxkIGJlXG4gKiBhIHN0cmluZyByZXByZXNlbnRpbmcgYSByZWxhdGl2ZSBvciBhYnNvbHV0ZSBwYXRoIHRvIGEgZmlsZSwgd2l0aCBvciB3aXRob3V0XG4gKiBhIGZpbGUgZXh0ZW5zaW9uLiBBbHRlcm5hdGl2ZWx5LCBpZiB0aGUgb3V0cHV0IG9mIGEgY2FsbCB0byBwYXJzZSgpIGZyb20gdGhlXG4gKiBgbm9kZTpwYXRoYCBsaWJyYXJ5IGlzIHN1cHBsaWVkLCBpdCB3aWxsIGJlIGZvcm1hdHRlZCB0byBhIHN0cmluZyBhbmQgdXNlZFxuICogdGhhdCB3YXkuXG4gKiBAcGFyYW0ge3N0cmluZ1tdP30gW3RyeUV4dHM9QWxsU2NoZW1hdGFFeHRlbnNpb25zXSAtXG4gKiBBbiBvcHRpb25hbCBhcnJheSBvZiBzdHJpbmcgZmlsZSBleHRlbnNpb25zIHRvIGF0dGVtcHQgYXBwZW5kaW5nIHRvXG4gKiBgZ2l2ZW5QYXRoYCBpZiBpdCBsYWNrcyBhbiBleHRlbnNpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBbZG9Ob3RSZW1vdmVUc0V4dGVuc2lvbnM9ZmFsc2VdIHNob3VsZCBhbHdheXMgYmUgZmFsc2VcbiAqIHVubGVzcyB0aGUgU2NoZW1hdGEgbGlicmFyeSBoYXNuJ3QgYmVlbiB1cGdyYWRlZCBhbmQgbm9kZWpzIG5vdyBhbGxvd3NcbiAqIGxvYWRpbmcgb2YgVHlwZVNjcmlwdCBmaWxlcyB3aXRob3V0IGFueSBmbGFncyBvciB1c2luZyBub24tZXhwZXJpbWVudGFsXG4gKiBmbGFncy5cbiAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIG9iamVjdCB3aXRoIHRocmVlXG4gKiBwcm9wZXJ0aWVzOiBgc2RsYCwgYHJlc29sdmVyYCBhbmQgYHVua25vd25gLiBFYWNoIG9mIHRoZXNlIHByb3BlcnRpZXMgaXNcbiAqIGFuIGFycmF5IHdpdGggMCBvciBtb3JlIHN0cmluZ3MgcG9pbnRpbmcgdG8gZXhpc3RpbmcgZmlsZXMgdGhhdCBmYWxsIGludG9cbiAqIG9uZSBvZiB0aHJlZSBjYXRlZ29yaWVzLiBJZiB0aGUgZmlsZSBpcyBhIGtub3duIFNETCBleHRlbnNpb24gdHlwZSwgaXQgZ29lc1xuICogaW50byBgLnNkbGAsIGxpa2V3aXNlIGlmIGl0IGlzIGFueSBrbm93biByZXNvbHZlciB0eXBlIChKUyBvciBUUyksIGl0IGdvZXNcbiAqIGludG8gYC5yZXNvbHZlcmAsIGxhc3RseSwgaXQgZ29lcyBpbnRvIGAudW5rbm93bmAgaWYgdGhlIG5laXRoZXIgb2YgdGhlIHR3b1xuICogb3RoZXIgY2F0ZWdvcmllcyBhcmUgbWF0Y2hlZC5cbiAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhbnkgb2YgdGhlIGZpbGVzeXN0ZW0gb3BlcmF0aW9ucyBmYWlsLCBmb3JcbiAqIGluc3RhbmNlIGR1ZSB0byBpbnN1ZmZpY2llbnQgcGVybWlzc2lvbnMuXG4gKlxuICogQHNlZSB7QGxpbmsgU3RhbmRhcmRKU0V4dGVuc2lvbnN9XG4gKiBAc2VlIHtAbGluayBTdGFuZGFyZFRTRXh0ZW5zaW9uc31cbiAqIEBzZWUge0BsaW5rIFN0YW5kYXJkUmVzb2x2ZXJFeHRlbnNpb25zfVxuICogQHNlZSB7QGxpbmsgQWxsU2NoZW1hdGFFeHRlbnNpb25zfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBBc3N1bWUgYSBmaWxlIG5hbWVkICdleGFtcGxlLmpzJyBleGlzdHMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5XG4gKiAvLyBPdXRwdXRzOiB7XG4gKiAvLyAgIHNkbDogW10sXG4gKiAvLyAgIHJlc29sdmVyOiBbJy9hYnNvbHV0ZS9wYXRoL3RvL2V4YW1wbGUuanMnXSxcbiAqIC8vICAgdW5rbm93bjogW10sXG4gKiAvLyAgIGhhc1ZhbHVlczogdHJ1ZVxuICogLy8gfVxuICogcmVzb2x2ZWRQYXRocygnLi9leGFtcGxlJykudGhlbihyZXNvbHZlZCA9PiBjb25zb2xlLmxvZyhyZXNvbHZlZCkpO1xuICpcbiAqIC8vIEFzc3VtZSBhIGZpbGUgbmFtZWQgJ2V4YW1wbGUuZ3JhcGhxbCcgYW5kICdleGFtcGxlLmpzJyBleGlzdHMgaW4gdGhlXG4gKiAvLyBjdXJyZW50IGRpcmVjdG9yeVxuICogLy8gT3V0cHV0czoge1xuICogLy8gICBzZGw6IFsnL2Fic29sdXRlL3BhdGgvdG8vZXhhbXBsZS5ncmFwaHFsJ10sXG4gKiAvLyAgIHJlc29sdmVyOiBbJy9hYnNvbHV0ZS9wYXRoL3RvL2V4YW1wbGUuanMnXSxcbiAqIC8vICAgdW5rbm93bjogW10sXG4gKiAvLyAgIGhhc1ZhbHVlczogdHJ1ZVxuICogLy8gfVxuICogcmVzb2x2ZWRQYXRocygnLi9leGFtcGxlJykudGhlbihyZXNvbHZlZCA9PiBjb25zb2xlLmxvZyhyZXNvbHZlZCkpO1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb2x2ZWRQYXRocyhcbiAgZ2l2ZW5QYXRoLFxuICB0cnlFeHRzID0gQWxsU2NoZW1hdGFFeHRlbnNpb25zLFxuICBkb05vdFJlbW92ZVRzRXh0ZW5zaW9ucyA9IGZhbHNlXG4pIHtcbiAgaWYgKCFzdXBwb3J0c05hdGl2ZVR5cGVTY3JpcHQoKSAmJiAhZG9Ob3RSZW1vdmVUc0V4dGVuc2lvbnMpIHtcbiAgICBmb3IgKGNvbnN0IHRzRXh0IG9mIFN0YW5kYXJkVFNFeHRlbnNpb25zKSB7XG4gICAgICBjb25zdCBpbmRleE9mVFNFeHQgPSB0cnlFeHRzLmluZGV4T2YodHNFeHQpXG5cbiAgICAgIGlmICh+aW5kZXhPZlRTRXh0KSB7XG4gICAgICAgIHRyeUV4dHMuc3BsaWNlKGluZGV4T2ZUU0V4dCwgMSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBoYXNFeHQgPSBmaWxlUGF0aCA9PiAhIShwYXJzZShTdHJpbmcoZmlsZVBhdGgpKS5leHQpXG4gIGNvbnN0IGV4aXN0cyA9IHByb21pc2lmeShmc0V4aXN0cylcbiAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKGlmUGFyc2VkUGF0aChnaXZlblBhdGgsIHAgPT4gZm9ybWF0KHApLCBnaXZlblBhdGgpKVxuXG4gIC8vIElmIHdlIGRvbid0IGVtcHR5IGBiYXNlYCwgdGhlbiBmb3JtYXQoKSB3aWxsIG5vdCB0YWtlIHRoZSBuZXcgZXh0ZW5zaW9uXG4gIGNvbnN0IHBhcnNlZCA9IHsgLi4ucGFyc2UocmVzb2x2ZWQpLCAuLi57IGJhc2U6ICcnIH0gfVxuXG4gIC8vIFdlIHdhbnQgdG8gY2FwdHVyZSBhbnkgU0RMIGV4dGVuc2lvbnMgc2VwYXJhdGUgZnJvbSBhbnkgUmVzb2x2ZXIgZXh0ZW5zaW9uc1xuICBjb25zdCByZXN1bHQgPSB7XG4gICAgc2RsOiBbXSxcbiAgICByZXNvbHZlcjogW10sXG4gICAgdW5rbm93bjogW10sXG4gICAgaGFzVmFsdWVzOiBmYWxzZSxcbiAgfVxuXG4gIGlmIChwYXJzZWQuZXh0ICYmIChhd2FpdCBleGlzdHMocmVzb2x2ZWQpKSkge1xuICAgIGlmIChTdGFuZGFyZFNETEV4dGVuc2lvbnMuaW5jbHVkZXMocGFyc2VkLmV4dCkpIHtcbiAgICAgIHJlc3VsdC5zZGwucHVzaChyZXNvbHZlZClcbiAgICB9XG4gICAgZWxzZSBpZiAoU3RhbmRhcmRSZXNvbHZlckV4dGVuc2lvbnMuaW5jbHVkZXMocGFyc2VkLmV4dCkpIHtcbiAgICAgIHJlc3VsdC5yZXNvbHZlci5wdXNoKHJlc29sdmVkKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlc3VsdC51bmtub3duLnB1c2gocmVzb2x2ZWQpXG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSB0cnlFeHRzLmluZGV4T2YocGFyc2VkLmV4dClcbiAgICBpZiAofmluZGV4KSB7XG4gICAgICB0cnlFeHRzLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG5cbiAgICByZXN1bHQuaGFzVmFsdWVzID0gdHJ1ZTtcbiAgfVxuXG4gIGZvciAobGV0IGV4dCBvZiB0cnlFeHRzKSB7XG4gICAgbGV0IHRyeVBhcnNlZCA9IHsuLi5wYXJzZWQsIC4uLnsgZXh0IH19XG4gICAgbGV0IHRyeVBhdGggPSBmb3JtYXQodHJ5UGFyc2VkKVxuICAgIGxldCB0cnlUcnVlID0gYXdhaXQgZXhpc3RzKHRyeVBhdGgpXG5cbiAgICBjb25zb2xlLmxvZyhgVHJ5aW5nICR7ZXh0fS4uLiR7dHJ5UGF0aH0/ICR7dHJ5VHJ1ZX1gKVxuXG4gICAgaWYgKHRyeVRydWUpIHtcbiAgICAgIGlmIChTdGFuZGFyZFNETEV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICByZXN1bHQuc2RsLnB1c2godHJ5UGF0aClcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKFN0YW5kYXJkUmVzb2x2ZXJFeHRlbnNpb25zLmluY2x1ZGVzKGV4dCkpIHtcbiAgICAgICAgcmVzdWx0LnJlc29sdmVyLnB1c2godHJ5UGF0aClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQudW5rbm93bi5wdXNoKHRyeVBhdGgpXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5oYXNWYWx1ZXMgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vKipcbiAqIFJlc29sdmVzIHRoZSBnaXZlbiBwYXRoIHRvIGFuIGV4aXN0aW5nIGZpbGUgcGF0aCBieSBhdHRlbXB0aW5nIHRvIGFwcGVuZFxuICogcHJvdmlkZWQgb3IgZGVmYXVsdCBmaWxlIGV4dGVuc2lvbnMsIGFuZCByZXR1cm5zIHRoZSByZXNvbHZlZCBmaWxlIHBhdGguIFRoaXNcbiAqIGZ1bmN0aW9uIGFjdHVhbGx5IGNhbGxzIHtAbGluayByZXNvbHZlZFBhdGhzfSBhbmQgcmV0dXJucyB0aGUgZmlyc3QgU0RMIGZpbGVcbiAqIHBhdGgsIGZvbGxvd2VkIGJ5IHRoZSBmaXJzdCByZXNvbHZlciBmaWxlIHBhdGgsIGZvbGxvd2VkIGJ5IHRoZSBmaXJzdCB1bmtub3duXG4gKiBmaWxlIHBhdGgsIGluIHRoYXQgb3JkZXIuIElmIG5vIGZpbGUgcGF0aCBjb3VsZCBiZSBmb3VuZCwgdW5kZWZpbmVkIGlzXG4gKiByZXR1cm5lZFxuICpcbiAqIFRoZSBmdW5jdGlvbiBwZXJmb3JtcyBhIHNlcmllcyBvZiBjaGVja3MgYW5kIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGVcbiAqIGBnaXZlblBhdGhgIGlucHV0IHRvIGFzY2VydGFpbiBpdHMgdmFsaWRpdHkgYW5kIGF0dGVtcHQgdG8gcmVzb2x2ZSBpdCB0byBhblxuICogZXhpc3RpbmcgZmlsZS4gSW5pdGlhbGx5LCBpdCBkaXNjZXJucyB3aGV0aGVyIGBnaXZlblBhdGhgIGFscmVhZHkgaGFzIGEgZmlsZVxuICogZXh0ZW5zaW9uLiBJZiBpdCBkb2VzLCBhbmQgdGhlIGZpbGUgZXhpc3RzLCBpdCByZXR1cm5zIHRoZSByZXNvbHZlZCBwYXRoLlxuICogSWYgbm90LCBpdCBpdGVyYXRlcyB0aHJvdWdoIGEgbGlzdCBvZiBmaWxlIGV4dGVuc2lvbnMgKHByb3ZpZGVkIGluIGB0cnlFeHRzYFxuICogb3IgZGVmYXVsdHMgdG8gYWxsIGtub3duIFNjaGVtYXRhIGZpbGUgdHlwZSBleHRlbnNpb25zKSwgYXBwZW5kaW5nIGVhY2hcbiAqIGV4dGVuc2lvbiB0byBgZ2l2ZW5QYXRoYCwgY2hlY2tpbmcgdGhlIGV4aXN0ZW5jZSBvZiB0aGUgcmVzdWx0YW50IGZpbGUsXG4gKiBhbmQgcmV0dXJuaW5nIHRoZSBwYXRoIHVwb24gc3VjY2Vzc2Z1bCByZXNvbHV0aW9uLlxuICpcbiAqIFV0aWxpemVzIGZ1bmN0aW9ucyBmcm9tIHRoZSAnZnMnLCAnZnMvcHJvbWlzZXMnLCBhbmQgJ3BhdGgnIG1vZHVsZXMgb2ZcbiAqIE5vZGUuanMsIGFzIHdlbGwgYXMgYSBjdXN0b20gYFNjaGVtYXRhYCBpbXBvcnQuIEl0IGVtcGxveXMgdGhlIGBwcm9taXNpZnlgXG4gKiB1dGlsaXR5IHRvIGhhbmRsZSBjYWxsYmFjay1iYXNlZCBgZnNgIGZ1bmN0aW9ucyBpbiBhIHByb21pc2Ugb3JpZW50ZWQgbWFubmVyLlxuICpcbiAqIEBub3RlIHJ1bnRpbWUgbG9hZGluZyBvZiBUeXBlU2NyaXB0IG1vZHVsZXMgaXMgb25seSBzdXBwb3J0ZWQgaW4gYSBmZXcgY2FzZTtcbiAqIDEuIGlmIHRoZSBhcHByb3ByaWF0ZSAtLWV4cGVyaW1lbnRhbCBmbGFncyBhcmUgcHJlc2VudCwgMi4gaWYgYSBub2RlIHdyYXBwZXJcbiAqIGxpa2UgYHRzeGAgb3IgYHRzLW5vZGVgIGFyZSBiZWluZyB1c2VkLiBUaGUgZnVuY3Rpb25cbiAqIGBzdXBwb3J0c05hdGl2ZVR5cGVTY3JpcHQoKWAgaXMgdXNlZCB0byBjaGVjayBmb3IgdGhpcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IGdpdmVuUGF0aCAtIFRoZSBmaWxlIHBhdGggdG8gYmUgcmVzb2x2ZWQuIFNob3VsZCBiZVxuICogYSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgcmVsYXRpdmUgb3IgYWJzb2x1dGUgcGF0aCB0byBhIGZpbGUsIHdpdGggb3Igd2l0aG91dFxuICogYSBmaWxlIGV4dGVuc2lvbi4gQWx0ZXJuYXRpdmVseSwgaWYgdGhlIG91dHB1dCBvZiBhIGNhbGwgdG8gcGFyc2UoKSBmcm9tIHRoZVxuICogYG5vZGU6cGF0aGAgbGlicmFyeSBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSBmb3JtYXR0ZWQgdG8gYSBzdHJpbmcgYW5kIHVzZWRcbiAqIHRoYXQgd2F5LlxuICogQHBhcmFtIHtzdHJpbmdbXT99IFt0cnlFeHRzPUFsbFNjaGVtYXRhRXh0ZW5zaW9uc10gLVxuICogQW4gb3B0aW9uYWwgYXJyYXkgb2Ygc3RyaW5nIGZpbGUgZXh0ZW5zaW9ucyB0byBhdHRlbXB0IGFwcGVuZGluZyB0b1xuICogYGdpdmVuUGF0aGAgaWYgaXQgbGFja3MgYW4gZXh0ZW5zaW9uLlxuICogQHBhcmFtIHtib29sZWFuP30gW2RvTm90UmVtb3ZlVHNFeHRlbnNpb25zPWZhbHNlXSBzaG91bGQgYWx3YXlzIGJlIGZhbHNlXG4gKiB1bmxlc3MgdGhlIFNjaGVtYXRhIGxpYnJhcnkgaGFzbid0IGJlZW4gdXBncmFkZWQgYW5kIG5vZGVqcyBub3cgYWxsb3dzXG4gKiBsb2FkaW5nIG9mIFR5cGVTY3JpcHQgZmlsZXMgd2l0aG91dCBhbnkgZmxhZ3Mgb3IgdXNpbmcgbm9uLWV4cGVyaW1lbnRhbFxuICogZmxhZ3MuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHN0cmluZ1xuICogcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIGFuIGV4aXN0aW5nIGZpbGUsIG9yIHVuZGVmaW5lZCBpZiBubyBwYXRoIGNvdWxkXG4gKiBiZSByZXNvbHZlZC4gVGhpcyB3aWxsIHJldHVybiB0aGUgZmlyc3QgZm91bmQgYXJ0aWZhY3QgZnJvbSBhIGNhbGwgdG9cbiAqIHtAbGluayByZXNvbHZlZFBhdGhzfSBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuICogYHJlc3VsdD8uW3NkbHxyZXNvbHZlcnx1bmtub3duXT8uWzBdYFxuICpcbiAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhbnkgb2YgdGhlIGZpbGVzeXN0ZW0gb3BlcmF0aW9ucyBmYWlsLCBmb3JcbiAqIGluc3RhbmNlIGR1ZSB0byBpbnN1ZmZpY2llbnQgcGVybWlzc2lvbnMuXG4gKlxuICogQHNlZSB7QGxpbmsgU3RhbmRhcmRKU0V4dGVuc2lvbnN9XG4gKiBAc2VlIHtAbGluayBTdGFuZGFyZFRTRXh0ZW5zaW9uc31cbiAqIEBzZWUge0BsaW5rIFN0YW5kYXJkUmVzb2x2ZXJFeHRlbnNpb25zfVxuICogQHNlZSB7QGxpbmsgQWxsU2NoZW1hdGFFeHRlbnNpb25zfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBBc3N1bWUgYSBmaWxlIG5hbWVkICdleGFtcGxlLmpzJyBleGlzdHMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5XG4gKiAvLyBPdXRwdXRzOiAnL2Fic29sdXRlL3BhdGgvdG8vZXhhbXBsZS5qcydcbiAqIHJlc29sdmVkUGF0aCgnLi9leGFtcGxlJykudGhlbihyZXNvbHZlZCA9PiBjb25zb2xlLmxvZyhyZXNvbHZlZCkpO1xuICpcbiAqIC8vIE91dHB1dHM6IHVuZGVmaW5lZCAoaWYgJ2V4YW1wbGUudHMnIGRvZXNuJ3QgZXhpc3QpXG4gKiByZXNvbHZlZFBhdGgoJy4vZXhhbXBsZS50cycpLnRoZW4ocmVzb2x2ZWQgPT4gY29uc29sZS5sb2cocmVzb2x2ZWQpKTtcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVkUGF0aChcbiBnaXZlblBhdGgsXG4gdHJ5RXh0cyA9IEFsbFNjaGVtYXRhRXh0ZW5zaW9ucyxcbiBkb05vdFJlbW92ZVRzRXh0ZW5zaW9ucyA9IGZhbHNlXG4pIHtcbiAgY29uc3QgcGF0aHMgPSByZXNvbHZlZFBhdGhzKGdpdmVuUGF0aCwgdHJ5RXh0cywgZG9Ob3RSZW1vdmVUc0V4dGVuc2lvbnMpXG5cbiAgcmV0dXJuIHBhdGhzLnNkbD8uWzBdID8/IHBhdGhzLnJlc29sdmVyPy5bMF0gPz8gcGF0aHMudW5rbm93bj8uWzBdXG59XG5cbi8qKlxuICogQWRkcyB0aGUgYWJpbGl0eSB0byBgcmVxdWlyZWAgb3IgYGltcG9ydGAgZmlsZXMgZW5kaW5nIGluIGEgYC5ncmFwaHFsYFxuICogZXh0ZW5zaW9uLiBUaGUgZXhwb3J0cyByZXR1cm5lZCBmcm9tIHN1Y2ggYW4gaW1wb3J0IGNvbnNpc3Qgb2YgZm91clxuICogbWFqb3IgdmFsdWVzIGFuZCBvbmUgZGVmYXVsdCB2YWx1ZS5cbiAqXG4gKiB2YWx1ZXM6XG4gKiAgIGFzdE5vZGUgICAtIGFuIEFTVE5vZGUgZG9jdW1lbnQgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgU0RMIGNvbnRlbnRzXG4gKiAgICAgICAgICAgICAgIG9mIHRoZSAuZ3JhcGhxbCBmaWxlIGNvbnRlbnRzLiBOdWxsIGlmIHRoZSB0ZXh0IGlzIGludmFsaWRcbiAqICAgcmVzb3ZsZXJzIC0gaWYgdGhlcmUgaXMgYW4gYWRqYWNlbnQgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUsIGVuZGluZyBpblxuICogICAgICAgICAgICAgICAuanMgYW5kIGl0IGV4cG9ydHMgZWl0aGVyIGEgYHJlc29sdmVyc2Aga2V5IG9yIGFuIG9iamVjdCBieVxuICogICAgICAgICAgICAgICBkZWZhdWx0LCB0aGlzIHZhbHVlIHdpbGwgYmUgc2V0IG9uIHRoZSBzZGwgb2JqZWN0IGFzIGl0cyBzZXRcbiAqICAgICAgICAgICAgICAgcmVzb2x2ZXJzL3Jvb3RPYmpcbiAqICAgc2NoZW1hICAgIC0gYSBHcmFwaFFMU2NoZW1hIGluc3RhbmNlIG9iamVjdCBpZiB0aGUgY29udGVudHMgb2YgdGhlIC5ncmFwaHFsXG4gKiAgICAgICAgICAgICAgIGZpbGUgcmVwcmVzZW50IGJvdGggdmFsaWQgU0RMIGFuZCBjb250YWluIGF0IGxlYXN0IG9uZSByb290XG4gKiAgICAgICAgICAgICAgIHR5cGUgc3VjaCBhcyBRdWVyeSwgTXV0YXRpb24gb3IgU3Vic2NyaXB0aW9uXG4gKiAgIHNkbCAgICAgICAtIHRoZSBzdHJpbmcgb2YgU0RMIHdyYXBwZWQgaW4gYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGFcbiAqICAgdHlwZURlZnMgIC0gdGhlIHJhdyBzdHJpbmcgdXNlZCB0aGF0IGBzZGxgIHdyYXBzXG4gKiAgIGRlZmF1bHQgICAtIHRoZSBzZGwgc3RyaW5nIHdyYXBwZWQgaW4gYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGEgaXMgdGhlXG4gKiAgICAgICAgICAgICAgIGRlZmF1bHQgZXhwb3J0XG4gKlxuICogQHBhcmFtIHtNb2R1bGV9IG1vZHVsZSBhIG5vZGUgSlMgTW9kdWxlIGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgYSBmdWxseSBxdWFsaWZpZWQgcGF0aCB0byB0aGUgZmlsZSBiZWluZyBpbXBvcnRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JhcGhRTEV4dGVuc2lvbkhhbmRsZXIobW9kdWxlLCBmaWxlbmFtZSkge1xuICAoYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gYXdhaXQgaW1wb3J0R3JhcGhRTChmaWxlbmFtZSlcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuXG4gICAgICBjb25zdCBwYXRoID0gYXdhaXQgcmVzb2x2ZWRQYXRoKGZpbGVuYW1lLCBbJy5ncmFwaHFsJywgJy5ncWwnLCAnLnNkbCddKVxuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbcGF0aF1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSB1bmRlZmluZWRcbiAgICB9XG4gIH0pKClcbn1cblxuLyoqXG4gKiBSZWdpc3RlcnMgdGhlIGN1c3RvbSBleHRlbnNpb24gaGFuZGxlcnMgZm9yIGAuZ3JhcGhxbGAsIGAuc2RsYCwgYW5kIGAuZ3FsYCBmaWxlcyxcbiAqIGFuZCB3cmFwcyB0aGUgb3JpZ2luYWwgYC5qc2AgZXh0ZW5zaW9uIGhhbmRsZXIgdG8gc3VwcG9ydCBgLmdyYXBocWxgIGZpbGVzIHdpdGhcbiAqIHRoZSBzYW1lIG5hbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlcigpIHtcbiAgcmVxdWlyZS5leHRlbnNpb25zID0gcmVxdWlyZS5leHRlbnNpb25zIHx8IHt9XG4gIHJlcXVpcmUuZXh0ZW5zaW9uc1snLmdyYXBocWwnXSA9IGdyYXBoUUxFeHRlbnNpb25IYW5kbGVyXG4gIHJlcXVpcmUuZXh0ZW5zaW9uc1snLnNkbCddID0gZ3JhcGhRTEV4dGVuc2lvbkhhbmRsZXJcbiAgcmVxdWlyZS5leHRlbnNpb25zWycuZ3FsJ10gPSBncmFwaFFMRXh0ZW5zaW9uSGFuZGxlclxufVxuXG4vKipcbiAqIERlcmVnaXN0ZXJzIHRoZSBjdXN0b20gZXh0ZW5zaW9uIGhhbmRsZXJzIGZvciBgLmdyYXBocWxgLCBgLnNkbGAsIGFuZCBgLmdxbGAgZmlsZXMsXG4gKiBhbmQgcmVzdG9yZXMgdGhlIG9yaWdpbmFsIGAuanNgIGV4dGVuc2lvbiBoYW5kbGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVyZWdpc3RlcigpIHtcbiAgZGVsZXRlIHJlcXVpcmUuZXh0ZW5zaW9uc1snLmdyYXBocWwnXVxuICBkZWxldGUgcmVxdWlyZS5leHRlbnNpb25zWycuc2RsJ11cbiAgZGVsZXRlIHJlcXVpcmUuZXh0ZW5zaW9uc1snLmdxbCddXG59XG5cbi8qKlxuICogQXN5bmNocm9ub3VzbHkgaW1wb3J0cyBhbmQgcmVzb2x2ZXMgYSBHcmFwaFFMIHNjaGVtYSBhbmQgaXRzIHJlc29sdmVycyBmcm9tXG4gKiBnaXZlbiBwYXRocy4gU3VwcG9ydHMgY3VzdG9tIGNvbmZsaWN0IHJlc29sdXRpb24gZm9yIHJlc29sdmVyIHByb3BlcnRpZXMuXG4gKlxuICogQGFzeW5jXG4gKiBAZnVuY3Rpb24gaW1wb3J0UmVzb2x2ZWRHcmFwaFFMXG4gKiBAcGFyYW0ge09iamVjdH0gcGF0aHMgLSBBbiBvYmplY3QgY29udGFpbmluZyBwYXRocyB0byBTREwgYW5kIHJlc29sdmVyIGZpbGVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgaW1wb3J0aW5nIHRoZSBzY2hlbWEuXG4gKiBAcGFyYW0geyhcbiAqICAgZXhpc3RpbmdSZXNvbHZlcjogUmVzb2x2ZXJQcm9wZXJ0eSxcbiAqICAgY29uZmxpY3RpbmdSZXNvbHZlcjogUmVzb2x2ZXJQcm9wZXJ0eSxcbiAqICkgPT4gRnVuY3Rpb25cbiAqIH0gW29wdGlvbnMuY29uZmxpY3RSZXNvbHZlcl1cbiAqICAgLSBBIGZ1bmN0aW9uIHRvIHJlc29sdmUgY29uZmxpY3RzIGJldHdlZW4gZXhpc3RpbmcgYW5kIG5ldyByZXNvbHZlcnMuXG4gKiAgIERlZmF1bHRzIHRvIHJldHVybmluZyB0aGUgbmV3IHJlc29sdmVyLlxuICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0fG51bGw+fSBUaGUgaW1wb3J0ZWQgR3JhcGhRTCBzY2hlbWEgYW5kIHJlc29sdmVycyxcbiAqICAgb3IgbnVsbCBpZiBubyB2YWxpZCBwYXRocyBhcmUgcHJvdmlkZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHBhdGhzID0ge1xuICogICBzZGw6IFsnc2NoZW1hLmdyYXBocWwnXSxcbiAqICAgcmVzb2x2ZXI6IFsncmVzb2x2ZXJzLmpzJ11cbiAqIH1cbiAqIGNvbnN0IHNjaGVtYSA9IGF3YWl0IGltcG9ydFJlc29sdmVkR3JhcGhRTChwYXRocylcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGF0aHMgPSB7XG4gKiAgIHNkbDogWydzY2hlbWEuZ3JhcGhxbCddLFxuICogICByZXNvbHZlcjogWydyZXNvbHZlcnMuanMnXVxuICogfVxuICogY29uc3Qgb3B0aW9ucyA9IHtcbiAqICAgY29uZmxpY3RSZXNvbHZlcjogKHByZXYsIG5leHQpID0+IHtcbiAqICAgICAvLyBDdXN0b20gY29uZmxpY3QgcmVzb2x1dGlvbiBsb2dpY1xuICogICAgIHJldHVybiBuZXh0LnZhbHVlXG4gKiAgIH1cbiAqIH1cbiAqIGNvbnN0IHNjaGVtYSA9IGF3YWl0IGltcG9ydFJlc29sdmVkR3JhcGhRTChwYXRocywgb3B0aW9ucylcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGltcG9ydFJlc29sdmVkR3JhcGhRTChcbiAgcGF0aHMsXG4gIG9wdGlvbnMgPSB7XG4gICAgY29uZmxpY3RSZXNvbHZlcihwcmV2UmVzb2x2ZXIsIG5ld1Jlc29sdmVyKSB7XG4gICAgICByZXR1cm4gbmV3UmVzb2x2ZXIudmFsdWVcbiAgICB9XG4gIH1cbikge1xuICBpZiAoIShwYXRocz8uaGFzVmFsdWVzKSlcbiAgICByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IGNvbnRlbnQgPSBbXVxuICBsZXQgeyBjb25mbGljdFJlc29sdmVyIH0gPSBvcHRpb25zPy5jb25mbGljdFJlc29sdmVyID8/ICgoXywgbikgPT4gbi52YWx1ZSlcblxuICAvLyBXcmFwIHRoZSByZWNlaXZlZCBjb25mbGljdCByZXNvbHZlciBpbiBhbiBhc3luYyBmdW5jdGlvbiBpZiBpdCBpcyBub3RcbiAgLy8gYWxyZWFkeSBhc3luY2hyb25vdXMgKHN1cHBvcnQgZXZlcnl0aGluZyEpXG4gIGlmICghKHt9KS50b1N0cmluZy5hcHBseShjb25mbGljdFJlc29sdmVyKS5pbmNsdWRlcygnQXN5bmNGdW5jdGlvbicpKSB7XG4gICAgY29uc3Qgc3luY0NvbmZsaWN0UmVzb2x2ZXIgPSBjb25mbGljdFJlc29sdmVyID8/ICgoXywgbikgPT4gbi52YWx1ZSlcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGNvbmZsaWN0UmVzb2x2ZXJIb0YocHJldiwgY29uZikge1xuICAgICAgcmV0dXJuIHN5bmNDb25mbGljdFJlc29sdmVyKHByZXYsIGNvbmYpXG4gICAgfVxuXG4gICAgY29uZmxpY3RSZXNvbHZlciA9IGNvbmZsaWN0UmVzb2x2ZXJIb0ZcbiAgfVxuXG4gIGZvciAoY29uc3Qgc2RsUGF0aCBvZiBwYXRocy5zZGwpIHtcbiAgICBjb250ZW50LnB1c2goKGF3YWl0IHJlYWRGaWxlKHNkbFBhdGgpKS50b1N0cmluZygpKVxuICB9XG5cbiAgY29uc3Qgc2NoZW1hdGEgPSBuZXcgU2NoZW1hdGEoY29udGVudC5qb2luKCdcXG4nKSlcbiAgY29uc3QgYXN0Tm9kZSA9IHNjaGVtYXRhLmFzdFxuICBsZXQgc2NoZW1hID0gc2NoZW1hdGEuc2NoZW1hXG5cbiAgbGV0IHJlc29sdmVyc1BhdGggPSBudWxsXG4gIGxldCByZXNvbHZlcnMgPSB7fVxuXG4gIGZvciAoY29uc3QgcmVzb2x2ZXJQYXRoIG9mIHBhdGhzLnJlc29sdmVyKSB7XG4gICAgY29uc3QgbW9kdWxlID0gYXdhaXQgYXN5bmNUcnlDYXRjaChcbiAgICAgIGFzeW5jICgpID0+IGF3YWl0IGR5bmFtaWNJbXBvcnQocmVzb2x2ZXJQYXRoKSxcbiAgICAgIGFzeW5jIChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gbG9hZCBtb2R1bGUgJHtyZXNvbHZlclBhdGh9YCwgZXJyb3IpXG4gICAgICAgIHJldHVybiB7fVxuICAgICAgfVxuICAgIClcblxuICAgIC8vIEFzeW5jaHJvbm91c2x5IGNoZWNrIGZvciBjb25mbGljdHMgaW4gcmVzb2x2ZXIgcHJvcGVydGllc1xuICAgIC8vIFJlY3Vyc2l2ZSBtZXJnZSBmb3Igb2JqZWN0IHByb3BlcnRpZXNcbiAgICBjb25zdCBtZXJnZVJlc29sdmVycyA9IGFzeW5jICh0YXJnZXQsIHNvdXJjZSwgcGF0aFNvRmFyID0gW10pID0+IHtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcbiAgICAgICAgcGF0aFNvRmFyLnB1c2goa2V5KVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIGF3YWl0IG1lcmdlUmVzb2x2ZXJzKHRhcmdldFtrZXldLCB2YWx1ZSwgcGF0aFNvRmFyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUmVzb2x2ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgICB2YWx1ZTogdGFyZ2V0W2tleV0sXG4gICAgICAgICAgICBwYXRoOiBwYXRoU29GYXIsXG4gICAgICAgICAgICBvYmplY3Q6IHJlc29sdmVycyxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBjb25mbGljdGluZ1Jlc29sdmVyID0ge1xuICAgICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBwYXRoOiBwYXRoU29GYXIsXG4gICAgICAgICAgICBvYmplY3Q6IG1vZHVsZSxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0YXJnZXRba2V5XSA9IGF3YWl0IGNvbmZsaWN0UmVzb2x2ZXIoXG4gICAgICAgICAgICBleGlzdGluZ1Jlc29sdmVyLFxuICAgICAgICAgICAgY29uZmxpY3RpbmdSZXNvbHZlclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IG1lcmdlUmVzb2x2ZXJzKHJlc29sdmVycywgbW9kdWxlKVxuICB9XG5cbiAgaWYgKE9iamVjdC5rZXlzKHJlc29sdmVycykubGVuZ3RoKSB7XG4gICAgc2NoZW1hdGEuY2xlYXJTY2hlbWEoKVxuICAgIHNjaGVtYXRhLnJlc29sdmVycyA9IHJlc29sdmVyc1xuICAgIHNjaGVtYXRhLnNjaGVtYVxuICB9XG4gIGVsc2Uge1xuICAgIHJlc29sdmVycyA9IG51bGxcbiAgfVxuXG4gIC8vIEZvciBhbGwgaW50ZW50cyBhbmQgcHVycG9zZXMgdGhpcyBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdHJlYXRlZCBsaWtlXG4gIC8vIGEgc3RyaW5nIGJ1dCB0aGF0IGFsc28gaGFzIHRocmVlIGV4dHJhIHByb3BlcnRpZXM7IHNkbCwgYXN0IGFuZCBzY2hlbWEuXG4gIC8vIGBhc3RgIGFuZCBgc2NoZW1hYCBpbnZva2UgdGhlIGZ1bmN0aW9ucyBgcGFyc2VgIGFuZCBgYnVpbGRTY2hlbWFgIGZyb21cbiAgLy8gdGhlICdncmFwaHFsJyBtb2R1bGUsIHJlc3BlY3RpdmVseVxuICByZXR1cm4ge1xuICAgIGFzdE5vZGUsXG4gICAgcmVzb2x2ZXJzLFxuICAgIHNjaGVtYSxcbiAgICBzZGw6IHNjaGVtYXRhLnNkbCxcbiAgICBzY2hlbWF0YSxcbiAgICB0eXBlRGVmczogc2NoZW1hdGEsXG4gICAgcmVzb2x2ZXJzUGF0aCxcbiAgfVxufVxuXG4vKipcbiAqIEFzeW5jaHJvbm91c2x5IGltcG9ydHMgYSBHcmFwaFFMIHNjaGVtYSBhbmQgaXRzIHJlc29sdmVycyBmcm9tIGEgZ2l2ZW4gZmlsZS5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIHJlc29sdmUgdGhlIHByb3ZpZGVkIGZpbGVuYW1lIHdpdGggdmFyaW91c1xuICogZXh0ZW5zaW9ucyBhbmQgdGhlbiBpbXBvcnRzIHRoZSByZXNvbHZlZCBHcmFwaFFMIHNjaGVtYSBhbmQgaXRzIHJlc29sdmVycy5cbiAqIEl0IHN1cHBvcnRzIGN1c3RvbSBjb25mbGljdCByZXNvbHV0aW9uIGZvciByZXNvbHZlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBhc3luY1xuICogQGZ1bmN0aW9uIGltcG9ydEdyYXBoUUxcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIFRoZSBiYXNlIGZpbGVuYW1lIHRvIHJlc29sdmUgYW5kIGltcG9ydC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IFt0cnlFeHRzPUFsbFNjaGVtYXRhRXh0ZW5zaW9uc10gLSBBbiBhcnJheSBvZiBleHRlbnNpb25zXG4gKiAgIHRvIHRyeSB3aGVuIHJlc29sdmluZyB0aGUgZmlsZW5hbWUuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciBpbXBvcnRpbmcgdGhlIHNjaGVtYS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LCBPYmplY3QsIHN0cmluZyk6IE9iamVjdH0gW29wdGlvbnMuY29uZmxpY3RSZXNvbHZlcl1cbiAqICAgLSBBIGZ1bmN0aW9uIHRvIHJlc29sdmUgY29uZmxpY3RzIGJldHdlZW4gZXhpc3RpbmcgYW5kIG5ldyByZXNvbHZlcnMuXG4gKiAgIERlZmF1bHRzIHRvIHJldHVybmluZyB0aGUgbmV3IHJlc29sdmVyLlxuICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gVGhlIGltcG9ydGVkIEdyYXBoUUwgc2NoZW1hIGFuZCByZXNvbHZlcnMuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEltcG9ydCBhIEdyYXBoUUwgc2NoZW1hIGZyb20gJ3NjaGVtYS5ncmFwaHFsJyB3aXRoIGRlZmF1bHQgZXh0ZW5zaW9uc1xuICogY29uc3Qgc2NoZW1hID0gYXdhaXQgaW1wb3J0R3JhcGhRTCgnc2NoZW1hLmdyYXBocWwnKVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBJbXBvcnQgYSBHcmFwaFFMIHNjaGVtYSB3aXRoIGN1c3RvbSBjb25mbGljdCByZXNvbHV0aW9uXG4gKiBjb25zdCBzY2hlbWEgPSBhd2FpdCBpbXBvcnRHcmFwaFFMKCdzY2hlbWEuZ3JhcGhxbCcsIFsnLmdyYXBocWwnLCAnLmdxbCddLCB7XG4gKiAgIGNvbmZsaWN0UmVzb2x2ZXI6IChwcmV2LCBuZXh0LCBuYW1lKSA9PiB7XG4gKiAgICAgLy8gQ3VzdG9tIGNvbmZsaWN0IHJlc29sdXRpb24gbG9naWNcbiAqICAgICByZXR1cm4gbmV4dFxuICogICB9XG4gKiB9KVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW1wb3J0R3JhcGhRTChcbiAgZmlsZW5hbWUsXG4gIHRyeUV4dHMgPSBBbGxTY2hlbWF0YUV4dGVuc2lvbnMsXG4gIG9wdGlvbnMgPSB7XG4gICAgY29uZmxpY3RSZXNvbHZlcihwcmV2UmVzb2x2ZXIsIG5ld1Jlc29sdmVyLCByZXNvbHZlck5hbWUpIHtcbiAgICAgIHJldHVybiBuZXdSZXNvbHZlclxuICAgIH1cbiAgfVxuKSB7XG4gIGNvbnN0IHJlbWV4dCA9IGZuID0+IGZvcm1hdCh7Li4ucGFyc2UoZm4pLCAuLi57YmFzZTogJycsIGV4dDogJyd9fSlcbiAgY29uc3QgcGF0aHMgPSBhd2FpdCByZXNvbHZlZFBhdGhzKGZpbGVuYW1lLCB0cnlFeHRzKVxuXG4gIHJldHVybiBhd2FpdCBpbXBvcnRSZXNvbHZlZEdyYXBoUUwocGF0aHMsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogU2V0cyB1cCBjdXN0b20gZXh0ZW5zaW9uIGhhbmRsZXJzIGZvciBgLmdyYXBocWxgLCBgLnNkbGAsIGFuZCBgLmdxbGAgZmlsZXMsXG4gKiBhbmQgd3JhcHMgdGhlIG9yaWdpbmFsIGAuanNgIGV4dGVuc2lvbiBoYW5kbGVyIHRvIHN1cHBvcnQgYC5ncmFwaHFsYCBmaWxlc1xuICogd2l0aCB0aGUgc2FtZSBuYW1lLlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgcmVnaXN0ZXJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUNBLElBQUFDLGNBQUEsR0FBQUQsT0FBQTtBQUVBLElBQUFFLEdBQUEsR0FBQUYsT0FBQTtBQUNBLElBQUFHLFNBQUEsR0FBQUgsT0FBQTtBQUNBLElBQUFJLEtBQUEsR0FBQUosT0FBQTtBQUNBLElBQUFLLEtBQUEsR0FBQUwsT0FBQTtBQUNBLElBQUFNLE1BQUEsR0FBQU4sT0FBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTU8scUJBQXFCLEdBQUFDLE9BQUEsQ0FBQUQscUJBQUEsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQzs7QUFFN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTUUsb0JBQW9CLEdBQUFELE9BQUEsQ0FBQUMsb0JBQUEsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDOztBQUUzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1DLG9CQUFvQixHQUFBRixPQUFBLENBQUFFLG9CQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQzs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNQywwQkFBMEIsR0FBQUgsT0FBQSxDQUFBRywwQkFBQSxHQUFHLENBQ3hDLEdBQUdGLG9CQUFvQixFQUN2QixHQUFHQyxvQkFBb0IsQ0FDeEI7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1FLHFCQUFxQixHQUFBSixPQUFBLENB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
//# sourceMappingURL=GraphQLExtension.js.map