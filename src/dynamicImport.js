import { access, readFile, stat } from 'fs/promises'
import { dirname, join, parse, resolve } from 'path'
import { Module } from 'module'

import { TypeScriptFlagMissingError } from './errors/TypeScriptFlagMissingError';
import { InvalidPathError } from './errors/InvalidPathError';
import { StandardTSExtensions } from './GraphQLExtension';

/**
 * Combines any environmental NODE_OPTIONS and execArgv parameters and checks
 * for the existence of the new TypeScript stripping flags or if the process
 * is running through `tsx` or `ts-node` wrappers. If any of these things are
 * true, then dynamically import()'ing a .ts/.tsx file is likely to succedd.
 *
 * @returns {boolean} true if sufficient runtime TypeScript loading support
 * is present and available; false otherwise
 */
export function supportsNativeTypeScript() {
  const node_opts = [
    ...((process.env?.NODE_OPTIONS ?? '').split(' ')),
    ...process.execArgv,
  ]

  return (
    node_opts.includes('--experimental-transform-types') ||
    node_opts.includes('--experimental-strip-types') ||
    node_opts.includes('node_modules/tsx') ||
    node_opts.includes('node_modules/ts-node')
  )
}

/**
 *
 * @param {string} pathToFile string path to where, hopefully, a file might
 * exist.
 * @param {boolean} [mustNotBeDirectory=true] a flag to indicate that false
 * should be returned if the file is a directory, even if it does exist on
 * the file system. This behavior defaults to true.
 * @returns {Promise<boolean>} true if a file exists (see mustNotBeDirectory),
 * and false otherwise
 */
export async function fileExists(pathToFile, mustNotBeDirectory = true) {
  try {
    const stats = await stat(pathToFile)

    // We only make it here if the result of calling stat() did not throw an
    // error. If isDirectory() is true and mustNotBeDirectory, then we return
    // the opposite of true which is false.
    return mustNotBeDirectory ? !stats.isDirectory() : true;
  }
  catch (ignore) {
    return false
  }
}

/**
 * Searches for the nearest package.json file by walking up the directory tree.
 *
 * @param {string} startDir - The directory to start the search from. If this
 * is a falsy value, `process.cwd()` is used instead.
 * @returns {Promise<string|null>} - A promise that resolves to the path to the
 * nearest package.json, or null if not found.
 */
export async function findNearestPackageJson(startDir) {
  if (!startDir)
    startDir = process.cwd()

  let dir = startDir;

  while (dir !== parse(dir).root) {
    const potentialPath = join(dir, 'package.json');

    try {
      await access(potentialPath);
      return resolve(potentialPath);
    } catch (error) {
      dir = dirname(dir);
    }
  }

  return null;
}

/**
 * Searches for the nearest package.json file by walking up the directory tree.
 * If a package json file is found, the path to that file is assumed to be the
 * root directory.
 *
 * @param {string} startDir - The directory to start the search from. If this
 * is a falsy value, `process.cwd()` is used instead.
 * @param {string?} useIfNotFound - An optional string, defaults to undefined,
 * that will be substituted if not package.json file was found while walking
 * up the directory tree.
 * @returns {Promise<string>} - A promise that resolves to the path to the
 * nearest package.json, or the value of `useIfNotFound` which defaults to
 * undefined.
 */
export async function guessProjectRoot(startDir, useIfNotFound) {
  const nearestPackageJson = await findNearestPackageJson(startDir)

  if (nearestPackageJson) {
    // if undefined or an empty string, default to useIfNotFound or undefined
    return parse(nearestPackageJson)?.dir || useIfNotFound
  }

  return useIfNotFound
}

/**
 * Attempts to use `await import()` to grab the JavaScript module content from
 * the specified file dynamically. If this fails, an empty Module exports object
 * is returned.
 *
 * @note files that end in known TypeScript file extensions will cause an error
 * to be thrown if native typescript support is not available. See this function
 * {@link supportsNativeTypeScript} for more information.
 *
 * @param {string} modulePath - The path to the module to be imported.
 * @param {boolean?} [errorOnMissing=true] - if false, and the file at
 * modulePath does not exist, return an empty Module's exports. Defaults to true
 * @returns {Promise<object>} - A promise that resolves to the imported module.
 *
 * @throws {TypeScriptFlagMissingError} if the appropriate measures haven't been
 * taken to allow for dynamic runtime TypeScript import support.
 */
export async function dynamicImport(modulePath, errorOnMissing = true) {
  const packageJsonPath = await findNearestPackageJson(__dirname);
  const parsedPath = pathParse(modulePath)

  if (
    !supportsNativeTypeScript() &&
    StandardTSExtensions.includes(parsedPath.ext)
  ) {
    throw new TypeScriptFlagMissingError(modulePath)
  }

  if (!fileExists(modulePath, false)) {
    throw new InvalidPathError(modulePath, `Cannot import ${modulePath}; missing`)
  }

  try {
    return await import(modulePath)
  }
  catch (ignore) {
    return new Module().exports
  }
}

/**
 * Asynchronously parses a given file or directory path to provide detailed path information along with
 * the resolved full path and a directory indicator.
 *
 * This function receives a single string argument representing a file or directory path, which it
 * subsequently resolves to an absolute path using Node.js's `path.resolve`. It then parses the
 * resolved path using `path.parse` to extract path components such as the root, directory, base,
 * extension, and name. Additionally, it performs a filesystem stat operation on the resolved path
 * using `fs.promises.stat` to determine whether the path represents a directory. The function
 * amalgamates these pieces of information into a single object, which it returns.
 *
 * The returned object extends the object returned by `path.parse` with three additional properties:
 * - `base`: Overridden to an empty string.
 * - `fullPath`: The absolute, resolved path.
 * - `isDir`: A boolean indicating whether the path represents a directory.
 *
 * This function is asynchronous and returns a promise that resolves to the aforementioned object.
 *
 * @param {string} path - The file or directory path to be parsed. Accepts both relative and absolute paths.
 * @returns {Promise<Object>} A promise that resolves to an object encapsulating detailed path information,
 * the resolved full path, and a directory indicator.
 * @throws Will throw an error if the filesystem stat operation fails, for instance due to insufficient
 * permissions or a nonexistent path.
 *
 * @example
 * pathParse('./someDir')
 *   .then(info => console.log(info))
 *   .catch(error => console.error('An error occurred:', error));
 */
export async function pathParse(path) {
  const fullPath = resolve(path)
  const baseParsed = parse(fullPath)
  const pathStat = await stat(fullPath)

  return { ...baseParsed, ...{base: '', fullPath, isDir: pathStat.isDirectory() } }
}
