"use strict";

require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.keys.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _resolverwork = require("./resolverwork");
Object.keys(_resolverwork).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _resolverwork[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _resolverwork[key];
    }
  });
});
var _signatures = require("./signatures");
Object.keys(_signatures).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _signatures[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _signatures[key];
    }
  });
});
var _typework = require("./typework");
Object.keys(_typework).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _typework[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _typework[key];
    }
  });
});