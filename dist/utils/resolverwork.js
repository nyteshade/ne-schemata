"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.extractResolverInfo = extractResolverInfo;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require("core-js/modules/es.object.entries.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.reflect.has.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.array.push.js");
/**
 * Walks a resolvers object and returns an array of objects with specific properties.
 *
 * @param {Object} resolvers - The resolvers object to walk.
 * @param {boolean} [deleteFields=false] - Whether to delete fields that are collected.
 * @returns {Array} - The array of objects with specified properties.
 */
function extractResolverInfo(resolvers) {
  var deleteFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var result = [];
  var _loop = function _loop() {
    var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
      type = _Object$entries$_i[0],
      resolver = _Object$entries$_i[1];
    var item = {
      type: type
    };
    var include = false;

    // Check for isTypeOf or __isTypeOf function
    if (resolver.isTypeOf || resolver.__isTypeOf) {
      item.isTypeOf = resolver.isTypeOf || resolver.__isTypeOf;
      include = true;
      if (deleteFields) {
        delete resolver.isTypeOf;
        delete resolver.__isTypeOf;
      }
    }

    // Check for resolveType or __resolveType function
    if (resolver.resolveType || resolver.__resolveType) {
      item.resolveType = resolver.resolveType || resolver.__resolveType;
      include = true;
      if (deleteFields) {
        delete resolver.resolveType;
        delete resolver.__resolveType;
      }
    }

    // Check for description field
    if (resolver.description) {
      item.description = typeof resolver.description === 'string' ? function () {
        return resolver.description;
      } : resolver.description;
      include = true;
      if (deleteFields) {
        delete resolver.description;
      }
    }

    // Only add item to result if it has more than just the type property
    if (include) {
      item.applyTo = function applyTo(schema) {
        var overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (Reflect.has(schema._typeMap, this.type)) {
          var resolveType = this.resolveType,
            isTypeOf = this.isTypeOf,
            description = this.description;
          var _type = schema._typeMap[this.type];
          if (resolveType && Reflect.has(_type, 'resolveType')) {
            if (!_type.resolveType || overwrite) {
              _type.resolveType = resolveType;
            }
          }
          if (isTypeOf && Reflect.has(_type, 'isTypeOf')) {
            if (!_type.isTypeOf || overwrite) {
              _type.isTypeOf = isTypeOf;
            }
          }
          if (description && Reflect.has(_type, 'description')) {
            if (!_type.description || overwrite) {
              Object.defineProperty(_type, 'description', {
                get: description,
                configurable: true,
                enumerable: true
              });
            }
          }
        }
      };
      result.push(item);
    }
  };
  for (var _i = 0, _Object$entries = Object.entries(resolvers); _i < _Object$entries.length; _i++) {
    _loop();
  }
  return result;
}
var _default = exports["default"] = extractResolverInfo;