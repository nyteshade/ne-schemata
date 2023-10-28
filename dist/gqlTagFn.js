"use strict";

require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.gql = gql;
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.object.get-own-property-names.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.reflect.get.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.to-string-tag.js");
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
  var string = _neTagFns.handleSubstitutions.apply(void 0, [template].concat(substitutions));
  var schemata = _Schemata.Schemata.from(string);
  var ast = schemata.ast;
  var schemataProps = Object.getOwnPropertyNames(_Schemata.Schemata.prototype);
  return new Proxy(ast, {
    get: function get(target, prop, receiver) {
      if (prop === "schemata") {
        return schemata;
      }
      if (prop === "string") {
        return String(schemata);
      }
      if (schemataProps.includes(prop)) {
        var targetProps = Object.getOwnPropertyNames(target);
        if (!targetProps.includes(prop)) {
          return schemata[prop];
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  //return Schemata.from(handleSubstitutions(template, ...substitutions))
}
var _default = exports["default"] = gql;