"use strict";

require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.reflect.to-string-tag.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.InvalidPathError = void 0;
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.array.join.js");
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
 * The InvalidPathError class represents an error that occurs when an invalid
 * path is provided to the `at` or `atNicely` functions. This error provides
 * details about the path that caused the error.
 */
var InvalidPathError = exports.InvalidPathError = /*#__PURE__*/function (_BaseError) {
  (0, _inherits2["default"])(InvalidPathError, _BaseError);
  var _super = _createSuper(InvalidPathError);
  function InvalidPathError(path, message) {
    var _this;
    (0, _classCallCheck2["default"])(this, InvalidPathError);
    _this = _super.call(this, message || "Invalid path: ".concat(Array.isArray(path) ? path.join('.') : path));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "path", void 0);
    _this.path = path;
    return _this;
  }
  (0, _createClass2["default"])(InvalidPathError, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.constructor.name, ": ").concat(this.message, " (path: ") + "".concat(Array.isArray(this.path) ? this.path.join('.') : this.path, ")");
    }
  }]);
  return InvalidPathError;
}(_BaseError2["default"]);
var _default = exports["default"] = {
  InvalidPathError: InvalidPathError
};