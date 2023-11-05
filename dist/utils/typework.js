"use strict";

require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFn = exports.getType = void 0;
exports.protoChain = protoChain;
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
// Internal shorthand for the magic toString() function
var _toString = Object.prototype.toString;

/**
 * Leverages JavaScript's internal type system which can be accessed by
 * either using `call` or `apply` on the `Object.prototype.toString`
 * function.
 *
 * @param {mixed} obj - any object or value
 *
 * @return {string} the name of the class or function used for the type
 * of object internally. Note that while null and undefined have actual
 * types internally there is no accessible `Null` or `Undefined` class
 */
var getType = exports.getType = function getType(obj) {
  var _exec;
  return (_exec = /t (\w+)/.exec(_toString.call(obj))) === null || _exec === void 0 ? void 0 : _exec[1];
};

/**
 * Fetches the internal type of the object in question and then returns
 * true if that is literally equivalent to `Function.name`
 *
 * @param {mixed} obj - any object or value
 *
 * @returns {boolean}  - true if the internal type of the object matches
 * `Function.name`
 */
var isFn = exports.isFn = function isFn(obj) {
  return Function.name === getType(obj);
};

/**
 * Given an input of any type, `protoChain` constructs an array representing
 * the prototype chain of the input. This array consists of constructor names
 * for each type in the chain. The resulting array also includes a non-standard
 * `isa` method that checks if a given constructor name is part of the chain.
 * Additionally, an `actual` getter is defined to attempt evaluation of the
 * prototype chain names to their actual type references, where possible.
 *
 * 
 * @param {mixed} object - The input value for which the prototype chain is
 * desired.
 * @returns {Array<string> & { isa: Function, actual: Array<any> }} An
 * array of constructor names
 *          with appended `isa` method and `actual` getter.
 *
 * @note The `isa` method allows checking if a given type name is in the
 * prototype chain. The `actual` getter attempts to convert type names back
 * to their evaluated types.
 */
function protoChain(object) {
  if (object === null || object === undefined) {
    return [getType(object)];
  }
  var chain = [Object.getPrototypeOf(object)];
  var current = chain[0];
  while (current != null) {
    current = Object.getPrototypeOf(current);
    chain.push(current);
  }
  var results = chain.map(function (c) {
    var _c$constructor;
    return (c === null || c === void 0 ? void 0 : (_c$constructor = c.constructor) === null || _c$constructor === void 0 ? void 0 : _c$constructor.name) || c;
  }).filter(function (c) {
    return !!c;
  });
  Object.defineProperties(results, {
    isa: {
      value: function isa(type) {
        var derived = getType(type);
        switch (derived) {
          case [Function.name]:
            derived = type.name;
            break;
          default:
            break;
        }
        return this.includes(derived) || (type === null || type === void 0 ? void 0 : type.name) && this.includes(type.name);
      }
    },
    actual: {
      get: function get() {
        var evalOrBust = function evalOrBust(o) {
          try {
            return eval(o);
          } catch (_unused) {
            return o;
          }
        };
        var revert = function revert(o) {
          switch (o) {
            case 'Null':
              return null;
            case 'Undefined':
              return undefined;
            default:
              return o;
          }
        };
        return this.map(revert).map(evalOrBust);
      }
    }
  });
  return results;
}