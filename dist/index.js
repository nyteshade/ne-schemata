"use strict";

require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.keys.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SDL: true,
  Schemata: true,
  jestTransformer: true
};
exports.SDL = void 0;
Object.defineProperty(exports, "Schemata", {
  enumerable: true,
  get: function get() {
    return _Schemata.Schemata;
  }
});
exports["default"] = void 0;
Object.defineProperty(exports, "jestTransformer", {
  enumerable: true,
  get: function get() {
    return _jestTransformer["default"];
  }
});
var _Schemata = require("./Schemata");
Object.keys(_Schemata).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _Schemata[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Schemata[key];
    }
  });
});
var _jestTransformer = _interopRequireDefault(require("./jestTransformer"));
var _dynamicImport = require("./dynamicImport");
Object.keys(_dynamicImport).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _dynamicImport[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dynamicImport[key];
    }
  });
});
var _GraphQLExtension = require("./GraphQLExtension");
Object.keys(_GraphQLExtension).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _GraphQLExtension[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GraphQLExtension[key];
    }
  });
});
var _ExtendedResolver = require("./ExtendedResolver");
Object.keys(_ExtendedResolver).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ExtendedResolver[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ExtendedResolver[key];
    }
  });
});
var _ExtendedResolverMap = require("./ExtendedResolverMap");
Object.keys(_ExtendedResolverMap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ExtendedResolverMap[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ExtendedResolverMap[key];
    }
  });
});
var _gqlTagFn = require("./gqlTagFn");
Object.keys(_gqlTagFn).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _gqlTagFn[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gqlTagFn[key];
    }
  });
});
var _propAt = require("./propAt");
Object.keys(_propAt).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _propAt[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _propAt[key];
    }
  });
});
var _walkResolverMap = require("./walkResolverMap");
Object.keys(_walkResolverMap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _walkResolverMap[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _walkResolverMap[key];
    }
  });
});
var _signatures = require("./utils/signatures");
Object.keys(_signatures).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _signatures[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _signatures[key];
    }
  });
});
var _typework = require("./utils/typework");
Object.keys(_typework).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _typework[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _typework[key];
    }
  });
});
var _resolverwork = require("./utils/resolverwork");
Object.keys(_resolverwork).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _resolverwork[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _resolverwork[key];
    }
  });
});
var _BaseError = require("./BaseError");
Object.keys(_BaseError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _BaseError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _BaseError[key];
    }
  });
});
var _errors = require("./errors");
Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _errors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _errors[key];
    }
  });
});
var SDL = exports.SDL = _Schemata.Schemata;
var _default = exports["default"] = _Schemata.Schemata;