import { access, readFile, stat } from 'fs/promises'
import { dirname, join, parse, resolve } from 'path'
import { resolvedPath } from './GraphQLExtension.js'

/**
 * Searches for the nearest package.json file by walking up the directory tree.
 *
 * @param {string} startDir - The directory to start the search from.
 * @returns {Promise<string|null>} - A promise that resolves to the path to the nearest package.json,
 * or null if not found.
 */
export async function findNearestPackageJson(startDir) {
  let dir = startDir;

  while (dir !== parse(dir).root) {
    const potentialPath = join(dir, 'package.json');

    try {
      await access(potentialPath);
      return potentialPath;
    } catch (error) {
      dir = dirname(dir);
    }
  }

  return null;
}

/**
 * Dynamically imports a module using require or await import() based on the module system in use.
 *
 * @param {string} modulePath - The path to the module to be imported.
 * @returns {Promise<any>} - A promise that resolves to the imported module.
 */
export async function dynamicImport(modulePath) {
  const packageJsonPath = await findNearestPackageJson(__dirname);

  if (packageJsonPath) {
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
    const isESM = packageJson.type === 'module';

    if (isESM) {
      return import(modulePath);
    } else {
      return Promise.resolve(require(modulePath));
    }
  } else {
    // Default to require if package.json is not found
    return Promise.resolve(require(modulePath));
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
