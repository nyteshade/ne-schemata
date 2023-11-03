"use strict";

require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.InvalidObjectError = void 0;
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.function.name.js");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _BaseError2 = _interopRequireDefault(require("../BaseError"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * The InvalidObjectError class represents an error that occurs when a non-object
 * value is provided as the target object to the `at` or `atNicely` functions.
 * This error provides details about the type of the value that caused the error.
 */
var InvalidObjectError = exports.InvalidObjectError = /*#__PURE__*/function (_BaseError) {
  (0, _inherits2["default"])(InvalidObjectError, _BaseError);
  var _super = _createSuper(InvalidObjectError);
  function InvalidObjectError(valueType, message) {
    var _this;
    (0, _classCallCheck2["default"])(this, InvalidObjectError);
    _this = _super.call(this, message || "Invalid object: Received type ".concat(valueType));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "valueType", void 0);
    _this.valueType = valueType;
    return _this;
  }
  (0, _createClass2["default"])(InvalidObjectError, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.constructor.name, ": ").concat(this.message, " (type: ").concat(this.valueType, ")");
    }
  }]);
  return InvalidObjectError;
}(_BaseError2["default"]);
var _default = exports["default"] = {
  InvalidObjectError: InvalidObjectError
};