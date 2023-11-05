"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.RESOLVE_TYPE = exports.IS_TYPE_OF = exports.FIELD_DESCRIPTIONS = exports.DESCRIPTION = void 0;
exports.extractResolverInfo = extractResolverInfo;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.object.entries.js");
require("core-js/modules/es.reflect.has.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.push.js");
var _typework = require("./typework");
/**
 * This constant type when applied to a ResolverMap object, will be picked up
 * by `extractResolverInfo` and be applied to the type on the executableSchema
 * type's `isTypeOf` property
 *
 * @type {Symbol}
 */
var IS_TYPE_OF = exports.IS_TYPE_OF = Symbol["for"]('Resolver.isTypeOf');

/**
 * This constant type when applied to a ResolverMap object, will be picked up
 * by `extractResolverInfo` and be applied to the type on the executableSchema
 * type's `resolveType` property
 *
 * @type {Symbol}
 */
var RESOLVE_TYPE = exports.RESOLVE_TYPE = Symbol["for"]('Resolver.resolveType');

/**
 * A programmatic way to define a description outside of SDL. This is handy
 * when provided as a getter on the schema's type object. The getter gets invoked
 * each time the description field is accessed allowing dynamic content to be
 * presented instead of static content. Note that long running function work
 * here can slow down all items viewing the description
 *
 * @type {Symbol}
 */
var DESCRIPTION = exports.DESCRIPTION = Symbol["for"]('Resolver.description');

/**
 * Unlike `DESCRIPTION` which defines the description of the type, this symbol
 * should always point to an object whose keys are the field names and whose
 * values are the descriptions. String constant values will be converted to a
 * function that returns the constant.
 *
 * @type {Symbol}
 */
var FIELD_DESCRIPTIONS = exports.FIELD_DESCRIPTIONS = Symbol["for"]('Resolver.fieldDescriptions');

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
    if (resolver[IS_TYPE_OF] || resolver.__isTypeOf) {
      item.isTypeOf = resolver[IS_TYPE_OF] || resolver.__isTypeOf;
      include = true;
      if (deleteFields) {
        delete resolver[IS_TYPE_OF];
        delete resolver.__isTypeOf;
      }
    }

    // Check for resolveType or __resolveType function
    if (resolver[RESOLVE_TYPE] || resolver.__resolveType) {
      item.resolveType = resolver[RESOLVE_TYPE] || resolver.__resolveType;
      include = true;
      if (deleteFields) {
        delete resolver[RESOLVE_TYPE];
        delete resolver.__resolveType;
      }
    }

    // Check for description field
    if (resolver[DESCRIPTION]) {
      item.description = typeof resolver[DESCRIPTION] === 'string' ? function () {
        return resolver[DESCRIPTION];
      } : resolver[DESCRIPTION];
      include = true;
      if (deleteFields) {
        delete resolver[DESCRIPTION];
      }
    }

    // Check for the field descriptions field
    if (resolver[FIELD_DESCRIPTIONS] && (0, _typework.protoChain)(resolver[FIELD_DESCRIPTIONS]).isa(Object)) {
      item.fieldDescriptions = resolver[FIELD_DESCRIPTIONS];
      include = true;
      if (deleteFields) {
        delete resolver[FIELD_DESCRIPTIONS];
      }
    }

    // Only add item to result if it has more than just the type property
    if (include) {
      item.applyTo = function applyTo(schema) {
        var overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (Reflect.has(schema._typeMap, this.type)) {
          var resolveType = this.resolveType,
            isTypeOf = this.isTypeOf,
            description = this.description,
            fieldDescriptions = this.fieldDescriptions;
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
          if (fieldDescriptions && Reflect.has(_type, '_fields')) {
            Object.entries(fieldDescriptions).forEach(function (_ref) {
              var _type$_fields$field;
              var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                field = _ref2[0],
                description = _ref2[1];
              if (!((_type$_fields$field = _type._fields[field]) !== null && _type$_fields$field !== void 0 && _type$_fields$field.description) || overwrite) {
                var getter = (0, _typework.protoChain)(description).isa(Function) ? description : function () {
                  return description;
                };
                Object.defineProperty(_type._fields[field], 'description', {
                  get: getter,
                  configurable: true,
                  enumerable: true
                });
              }
            });
          }
        }
      };
      result.push(item);
    }
  };
  for (var _i = 0, _Object$entries = Object.entries(resolvers); _i < _Object$entries.length; _i++) {
    _loop();
  }
  if (result.length) {
    result.applyTo = function applyTo(schema) {
      var overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      result.forEach(function (info) {
        return info.applyTo(schema, overwrite);
      });
    };
  }
  return result;
}
var _default = exports["default"] = extractResolverInfo;