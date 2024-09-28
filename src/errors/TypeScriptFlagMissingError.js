// @ts-check

import BaseError from './BaseError.js'

/**
 * The InvalidPathError class represents an error that occurs when an invalid
 * path is provided to the `at` or `atNicely` functions. This error provides
 * details about the path that caused the error.
 */
export class TypeScriptFlagMissingError extends BaseError {
  /**
   * The path to the TypeScript file or files in question.
   *
   * @type {string|string[]}
   */
  path;

  /**
   * The executable arguments supplied to the running node.js process.
   *
   * @type {}
   */
  flags;

  /**
   * Given a path or paths to for which this error was thrown, it indicates
   * that a dynamicImport() of files ending with a `.ts` extension was attempted
   * but that this cannot be parsed at runtime due to this node process not
   * having been started with the `--typescript` flag.
   *
   * @param {string|string[]} path the path or paths to the files in question
   * @param {string?} message an optional message. If not supplied, it defaults
   * to a message indicating you must run the node process with the
   * `--typescript` flag supplied.
   */
  constructor(path, message) {
    const defaultMessage = [
      'Node was started without the `--typescript` flag. The flags supplied to',
      `this node process were: ${process.execArgv}`
    ].join(' ')

    super(message || defaultMessage)

    this.flags = process.execArgv.filter(flag => flag.startsWith('-'))
    this.path = path
  }

  /**
   * A friendly readable variant of this error message
   *
   * @returns {string}
   */
  toString() {
    return (
      `${this.constructor.name}: ${this.message} (path(s): ` +
      `${Array.isArray(this.path) ? this.path.join(', ') : this.path}, ` +
      `flags: ${this.flags})`
    )
  }
}

export default TypeScriptFlagMissingError
