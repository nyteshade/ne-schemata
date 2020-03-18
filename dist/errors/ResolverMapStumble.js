"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ResolverMapStumble = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _neTagFns = require("ne-tag-fns");

var _BaseError2 = require("../BaseError");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n      This Error represents a scenario wherein while walking a resolver map\n      object, a key was found not to point to either a nested resolver map or\n      a resolver function. This is not allowed.\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/**
 * An error that can occur while walking a resolver map. ResolverMap types
 * are defined as `ResolverMap = { [name: string]: Function | ResolverMap }`.
 *
 * When a non-function and non-string based key are found, an error of this
 * type may be thrown based on walking parameters.
 *
 * @class ResolverMapStumble
 */
var ResolverMapStumble = /*#__PURE__*/function (_BaseError) {
  (0, _inherits2["default"])(ResolverMapStumble, _BaseError);

  function ResolverMapStumble() {
    (0, _classCallCheck2["default"])(this, ResolverMapStumble);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ResolverMapStumble).apply(this, arguments));
  }

  (0, _createClass2["default"])(ResolverMapStumble, [{
    key: "toString",

    /**
     * Description of the ResolverMapStumble error and likely cause and fix.
     *
     * @return {string} a string denoting the purpose/cause of this error class
     */
    value: function toString() {
      return (0, _neTagFns.inline)(_templateObject());
    }
  }]);
  return ResolverMapStumble;
}(_BaseError2.BaseError);

exports.ResolverMapStumble = ResolverMapStumble;
var _default = ResolverMapStumble;
exports["default"] = _default;