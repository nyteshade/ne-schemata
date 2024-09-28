"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TypeScriptFlagMissingError = void 0;
var _BaseError = _interopRequireDefault(require("./BaseError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// @ts-check

/**
 * The InvalidPathError class represents an error that occurs when an invalid
 * path is provided to the `at` or `atNicely` functions. This error provides
 * details about the path that caused the error.
 */
class TypeScriptFlagMissingError extends _BaseError.default {
  /**
   * The path to the TypeScript file or files in question.
   *
   * @type {string|string[]}
   */

  /**
   * The executable arguments supplied to the running node.js process.
   *
   * @type {}
   */

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
    const defaultMessage = ['Node was started without the `--typescript` flag. The flags supplied to', `this node process were: ${process.execArgv}`].join(' ');
    super(message || defaultMessage);
    this.flags = process.execArgv.filter(flag => flag.startsWith('-'));
    this.path = path;
  }

  /**
   * A friendly readable variant of this error message
   *
   * @returns {string}
   */
  toString() {
    return `${this.constructor.name}: ${this.message} (path(s): ` + `${Array.isArray(this.path) ? this.path.join(', ') : this.path}, ` + `flags: ${this.flags})`;
  }
}
exports.TypeScriptFlagMissingError = TypeScriptFlagMissingError;
var _default = exports.default = TypeScriptFlagMissingError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfQmFzZUVycm9yIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJUeXBlU2NyaXB0RmxhZ01pc3NpbmdFcnJvciIsIkJhc2VFcnJvciIsImNvbnN0cnVjdG9yIiwicGF0aCIsIm1lc3NhZ2UiLCJkZWZhdWx0TWVzc2FnZSIsInByb2Nlc3MiLCJleGVjQXJndiIsImpvaW4iLCJmbGFncyIsImZpbHRlciIsImZsYWciLCJzdGFydHNXaXRoIiwidG9TdHJpbmciLCJuYW1lIiwiQXJyYXkiLCJpc0FycmF5IiwiZXhwb3J0cyIsIl9kZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9UeXBlU2NyaXB0RmxhZ01pc3NpbmdFcnJvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IEJhc2VFcnJvciBmcm9tICcuL0Jhc2VFcnJvci5qcydcblxuLyoqXG4gKiBUaGUgSW52YWxpZFBhdGhFcnJvciBjbGFzcyByZXByZXNlbnRzIGFuIGVycm9yIHRoYXQgb2NjdXJzIHdoZW4gYW4gaW52YWxpZFxuICogcGF0aCBpcyBwcm92aWRlZCB0byB0aGUgYGF0YCBvciBgYXROaWNlbHlgIGZ1bmN0aW9ucy4gVGhpcyBlcnJvciBwcm92aWRlc1xuICogZGV0YWlscyBhYm91dCB0aGUgcGF0aCB0aGF0IGNhdXNlZCB0aGUgZXJyb3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBUeXBlU2NyaXB0RmxhZ01pc3NpbmdFcnJvciBleHRlbmRzIEJhc2VFcnJvciB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgVHlwZVNjcmlwdCBmaWxlIG9yIGZpbGVzIGluIHF1ZXN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfHN0cmluZ1tdfVxuICAgKi9cbiAgcGF0aDtcblxuICAvKipcbiAgICogVGhlIGV4ZWN1dGFibGUgYXJndW1lbnRzIHN1cHBsaWVkIHRvIHRoZSBydW5uaW5nIG5vZGUuanMgcHJvY2Vzcy5cbiAgICpcbiAgICogQHR5cGUge31cbiAgICovXG4gIGZsYWdzO1xuXG4gIC8qKlxuICAgKiBHaXZlbiBhIHBhdGggb3IgcGF0aHMgdG8gZm9yIHdoaWNoIHRoaXMgZXJyb3Igd2FzIHRocm93biwgaXQgaW5kaWNhdGVzXG4gICAqIHRoYXQgYSBkeW5hbWljSW1wb3J0KCkgb2YgZmlsZXMgZW5kaW5nIHdpdGggYSBgLnRzYCBleHRlbnNpb24gd2FzIGF0dGVtcHRlZFxuICAgKiBidXQgdGhhdCB0aGlzIGNhbm5vdCBiZSBwYXJzZWQgYXQgcnVudGltZSBkdWUgdG8gdGhpcyBub2RlIHByb2Nlc3Mgbm90XG4gICAqIGhhdmluZyBiZWVuIHN0YXJ0ZWQgd2l0aCB0aGUgYC0tdHlwZXNjcmlwdGAgZmxhZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBhdGggdGhlIHBhdGggb3IgcGF0aHMgdG8gdGhlIGZpbGVzIGluIHF1ZXN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nP30gbWVzc2FnZSBhbiBvcHRpb25hbCBtZXNzYWdlLiBJZiBub3Qgc3VwcGxpZWQsIGl0IGRlZmF1bHRzXG4gICAqIHRvIGEgbWVzc2FnZSBpbmRpY2F0aW5nIHlvdSBtdXN0IHJ1biB0aGUgbm9kZSBwcm9jZXNzIHdpdGggdGhlXG4gICAqIGAtLXR5cGVzY3JpcHRgIGZsYWcgc3VwcGxpZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXRoLCBtZXNzYWdlKSB7XG4gICAgY29uc3QgZGVmYXVsdE1lc3NhZ2UgPSBbXG4gICAgICAnTm9kZSB3YXMgc3RhcnRlZCB3aXRob3V0IHRoZSBgLS10eXBlc2NyaXB0YCBmbGFnLiBUaGUgZmxhZ3Mgc3VwcGxpZWQgdG8nLFxuICAgICAgYHRoaXMgbm9kZSBwcm9jZXNzIHdlcmU6ICR7cHJvY2Vzcy5leGVjQXJndn1gXG4gICAgXS5qb2luKCcgJylcblxuICAgIHN1cGVyKG1lc3NhZ2UgfHwgZGVmYXVsdE1lc3NhZ2UpXG5cbiAgICB0aGlzLmZsYWdzID0gcHJvY2Vzcy5leGVjQXJndi5maWx0ZXIoZmxhZyA9PiBmbGFnLnN0YXJ0c1dpdGgoJy0nKSlcbiAgICB0aGlzLnBhdGggPSBwYXRoXG4gIH1cblxuICAvKipcbiAgICogQSBmcmllbmRseSByZWFkYWJsZSB2YXJpYW50IG9mIHRoaXMgZXJyb3IgbWVzc2FnZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX06ICR7dGhpcy5tZXNzYWdlfSAocGF0aChzKTogYCArXG4gICAgICBgJHtBcnJheS5pc0FycmF5KHRoaXMucGF0aCkgPyB0aGlzLnBhdGguam9pbignLCAnKSA6IHRoaXMucGF0aH0sIGAgK1xuICAgICAgYGZsYWdzOiAke3RoaXMuZmxhZ3N9KWBcbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHlwZVNjcmlwdEZsYWdNaXNzaW5nRXJyb3JcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBQUEsVUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQXNDLFNBQUFELHVCQUFBRSxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBRnRDOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNRywwQkFBMEIsU0FBU0Msa0JBQVMsQ0FBQztFQUN4RDtBQUNGO0FBQ0E7QUFDQTtBQUNBOztFQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0VBR0U7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFQyxXQUFXQSxDQUFDQyxJQUFJLEVBQUVDLE9BQU8sRUFBRTtJQUN6QixNQUFNQyxjQUFjLEdBQUcsQ0FDckIseUVBQXlFLEVBQ3pFLDJCQUEyQkMsT0FBTyxDQUFDQyxRQUFRLEVBQUUsQ0FDOUMsQ0FBQ0MsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUVYLEtBQUssQ0FBQ0osT0FBTyxJQUFJQyxjQUFjLENBQUM7SUFFaEMsSUFBSSxDQUFDSSxLQUFLLEdBQUdILE9BQU8sQ0FBQ0MsUUFBUSxDQUFDRyxNQUFNLENBQUNDLElBQUksSUFBSUEsSUFBSSxDQUFDQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEUsSUFBSSxDQUFDVCxJQUFJLEdBQUdBLElBQUk7RUFDbEI7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUNFVSxRQUFRQSxDQUFBLEVBQUc7SUFDVCxPQUNFLEdBQUcsSUFBSSxDQUFDWCxXQUFXLENBQUNZLElBQUksS0FBSyxJQUFJLENBQUNWLE9BQU8sYUFBYSxHQUN0RCxHQUFHVyxLQUFLLENBQUNDLE9BQU8sQ0FBQyxJQUFJLENBQUNiLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQ0EsSUFBSSxDQUFDSyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDTCxJQUFJLElBQUksR0FDbEUsVUFBVSxJQUFJLENBQUNNLEtBQUssR0FBRztFQUUzQjtBQUNGO0FBQUNRLE9BQUEsQ0FBQWpCLDBCQUFBLEdBQUFBLDBCQUFBO0FBQUEsSUFBQWtCLFFBQUEsR0FBQUQsT0FBQSxDQUFBbEIsT0FBQSxHQUVjQywwQkFBMEIiLCJpZ25vcmVMaXN0IjpbXX0=
//# sourceMappingURL=TypeScriptFlagMissingError.js.map