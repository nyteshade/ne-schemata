"use strict";

require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ResolverMapStumble = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _neTagFns = require("ne-tag-fns");
var _BaseError2 = require("../BaseError");
var _templateObject;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * An error that can occur while walking a resolver map. ResolverMap types
 * are defined as `ResolverMap = { [name: string]: Function | ResolverMap }`.
 *
 * When a non-function and non-string based key are found, an error of this
 * type may be thrown based on walking parameters.
 *
 * @class ResolverMapStumble
 */
var ResolverMapStumble = exports.ResolverMapStumble = /*#__PURE__*/function (_BaseError) {
  (0, _inherits2["default"])(ResolverMapStumble, _BaseError);
  var _super = _createSuper(ResolverMapStumble);
  function ResolverMapStumble() {
    (0, _classCallCheck2["default"])(this, ResolverMapStumble);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(ResolverMapStumble, [{
    key: "toString",
    value:
    /**
     * Description of the ResolverMapStumble error and likely cause and fix.
     *
     * @return {string} a string denoting the purpose/cause of this error class
     */
    function toString() {
      return (0, _neTagFns.inline)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n      This Error represents a scenario wherein while walking a resolver map\n      object, a key was found not to point to either a nested resolver map or\n      a resolver function. This is not allowed.\n    "])));
    }
  }]);
  return ResolverMapStumble;
}(_BaseError2.BaseError);
var _default = exports["default"] = ResolverMapStumble;