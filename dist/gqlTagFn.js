"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.gql = gql;
var _Schemata = require("./Schemata");
var _neTagFns = require("ne-tag-fns");
/**
 * A small wrapper that creates a Schemata instance when using template strings
 * by invoking the `gql` tag function in front of it.
 *
 * i.e.
 *   let sdl = gql`type Person { name: String }`
 *   console.log(sdl instanceof Schemata) // true
 *
 * @param {string} template   [description]
 * @param {Array<mixed>} substitutions [description]
 * @return {Schemata} an instance of Schemata wrapping the string in the
 * template
 */
function gql(template) {
  for (var _len = arguments.length, substitutions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    substitutions[_key - 1] = arguments[_key];
  }
  return _Schemata.Schemata.from(_neTagFns.handleSubstitutions.apply(void 0, [template].concat(substitutions)));
}
var _default = exports["default"] = gql;