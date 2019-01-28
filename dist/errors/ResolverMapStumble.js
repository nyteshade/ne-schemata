"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ResolverMapStumble = void 0;

var _neTagFns = require("ne-tag-fns");

var _BaseError2 = require("../BaseError");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      This Error represents a scenario wherein while walking a resolver map\n      object, a key was found not to point to either a nested resolver map or\n      a resolver function. This is not allowed.\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * An error that can occur while walking a resolver map. ResolverMap types
 * are defined as `ResolverMap = { [name: string]: Function | ResolverMap }`.
 *
 * When a non-function and non-string based key are found, an error of this
 * type may be thrown based on walking parameters.
 *
 * @class ResolverMapStumble
 */
var ResolverMapStumble =
/*#__PURE__*/
function (_BaseError) {
  _inherits(ResolverMapStumble, _BaseError);

  function ResolverMapStumble() {
    _classCallCheck(this, ResolverMapStumble);

    return _possibleConstructorReturn(this, _getPrototypeOf(ResolverMapStumble).apply(this, arguments));
  }

  _createClass(ResolverMapStumble, [{
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
exports.default = _default;