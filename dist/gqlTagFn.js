'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gql = gql;

var _Schemata = require('./Schemata');

var _neTagFns = require('ne-tag-fns');

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
function gql(template, ...substitutions) {
  return _Schemata.Schemata.from((0, _neTagFns.handleSubstitutions)(template, ...substitutions));
}

exports.default = gql;
//# sourceMappingURL=gqlTagFn.js.map