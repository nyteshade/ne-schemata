(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.production.min.js
  var require_react_production_min = __commonJS({
    "node_modules/react/cjs/react.production.min.js"(exports) {
      "use strict";
      var l7 = Symbol.for("react.element");
      var n12 = Symbol.for("react.portal");
      var p14 = Symbol.for("react.fragment");
      var q = Symbol.for("react.strict_mode");
      var r25 = Symbol.for("react.profiler");
      var t15 = Symbol.for("react.provider");
      var u5 = Symbol.for("react.context");
      var v3 = Symbol.for("react.forward_ref");
      var w = Symbol.for("react.suspense");
      var x2 = Symbol.for("react.memo");
      var y = Symbol.for("react.lazy");
      var z = Symbol.iterator;
      function A2(a16) {
        if (null === a16 || "object" !== typeof a16) return null;
        a16 = z && a16[z] || a16["@@iterator"];
        return "function" === typeof a16 ? a16 : null;
      }
      var B2 = { isMounted: function() {
        return false;
      }, enqueueForceUpdate: function() {
      }, enqueueReplaceState: function() {
      }, enqueueSetState: function() {
      } };
      var C = Object.assign;
      var D2 = {};
      function E2(a16, b2, e24) {
        this.props = a16;
        this.context = b2;
        this.refs = D2;
        this.updater = e24 || B2;
      }
      E2.prototype.isReactComponent = {};
      E2.prototype.setState = function(a16, b2) {
        if ("object" !== typeof a16 && "function" !== typeof a16 && null != a16) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, a16, b2, "setState");
      };
      E2.prototype.forceUpdate = function(a16) {
        this.updater.enqueueForceUpdate(this, a16, "forceUpdate");
      };
      function F() {
      }
      F.prototype = E2.prototype;
      function G(a16, b2, e24) {
        this.props = a16;
        this.context = b2;
        this.refs = D2;
        this.updater = e24 || B2;
      }
      var H2 = G.prototype = new F();
      H2.constructor = G;
      C(H2, E2.prototype);
      H2.isPureReactComponent = true;
      var I2 = Array.isArray;
      var J = Object.prototype.hasOwnProperty;
      var K = { current: null };
      var L = { key: true, ref: true, __self: true, __source: true };
      function M(a16, b2, e24) {
        var d8, c4 = {}, k = null, h = null;
        if (null != b2) for (d8 in void 0 !== b2.ref && (h = b2.ref), void 0 !== b2.key && (k = "" + b2.key), b2) J.call(b2, d8) && !L.hasOwnProperty(d8) && (c4[d8] = b2[d8]);
        var g3 = arguments.length - 2;
        if (1 === g3) c4.children = e24;
        else if (1 < g3) {
          for (var f11 = Array(g3), m6 = 0; m6 < g3; m6++) f11[m6] = arguments[m6 + 2];
          c4.children = f11;
        }
        if (a16 && a16.defaultProps) for (d8 in g3 = a16.defaultProps, g3) void 0 === c4[d8] && (c4[d8] = g3[d8]);
        return { $$typeof: l7, type: a16, key: k, ref: h, props: c4, _owner: K.current };
      }
      function N2(a16, b2) {
        return { $$typeof: l7, type: a16.type, key: b2, ref: a16.ref, props: a16.props, _owner: a16._owner };
      }
      function O(a16) {
        return "object" === typeof a16 && null !== a16 && a16.$$typeof === l7;
      }
      function escape(a16) {
        var b2 = { "=": "=0", ":": "=2" };
        return "$" + a16.replace(/[=:]/g, function(a17) {
          return b2[a17];
        });
      }
      var P3 = /\/+/g;
      function Q(a16, b2) {
        return "object" === typeof a16 && null !== a16 && null != a16.key ? escape("" + a16.key) : b2.toString(36);
      }
      function R4(a16, b2, e24, d8, c4) {
        var k = typeof a16;
        if ("undefined" === k || "boolean" === k) a16 = null;
        var h = false;
        if (null === a16) h = true;
        else switch (k) {
          case "string":
          case "number":
            h = true;
            break;
          case "object":
            switch (a16.$$typeof) {
              case l7:
              case n12:
                h = true;
            }
        }
        if (h) return h = a16, c4 = c4(h), a16 = "" === d8 ? "." + Q(h, 0) : d8, I2(c4) ? (e24 = "", null != a16 && (e24 = a16.replace(P3, "$&/") + "/"), R4(c4, b2, e24, "", function(a17) {
          return a17;
        })) : null != c4 && (O(c4) && (c4 = N2(c4, e24 + (!c4.key || h && h.key === c4.key ? "" : ("" + c4.key).replace(P3, "$&/") + "/") + a16)), b2.push(c4)), 1;
        h = 0;
        d8 = "" === d8 ? "." : d8 + ":";
        if (I2(a16)) for (var g3 = 0; g3 < a16.length; g3++) {
          k = a16[g3];
          var f11 = d8 + Q(k, g3);
          h += R4(k, b2, e24, f11, c4);
        }
        else if (f11 = A2(a16), "function" === typeof f11) for (a16 = f11.call(a16), g3 = 0; !(k = a16.next()).done; ) k = k.value, f11 = d8 + Q(k, g3++), h += R4(k, b2, e24, f11, c4);
        else if ("object" === k) throw b2 = String(a16), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a16).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
        return h;
      }
      function S2(a16, b2, e24) {
        if (null == a16) return a16;
        var d8 = [], c4 = 0;
        R4(a16, d8, "", "", function(a17) {
          return b2.call(e24, a17, c4++);
        });
        return d8;
      }
      function T2(a16) {
        if (-1 === a16._status) {
          var b2 = a16._result;
          b2 = b2();
          b2.then(function(b3) {
            if (0 === a16._status || -1 === a16._status) a16._status = 1, a16._result = b3;
          }, function(b3) {
            if (0 === a16._status || -1 === a16._status) a16._status = 2, a16._result = b3;
          });
          -1 === a16._status && (a16._status = 0, a16._result = b2);
        }
        if (1 === a16._status) return a16._result.default;
        throw a16._result;
      }
      var U = { current: null };
      var V = { transition: null };
      var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
      function X() {
        throw Error("act(...) is not supported in production builds of React.");
      }
      exports.Children = { map: S2, forEach: function(a16, b2, e24) {
        S2(a16, function() {
          b2.apply(this, arguments);
        }, e24);
      }, count: function(a16) {
        var b2 = 0;
        S2(a16, function() {
          b2++;
        });
        return b2;
      }, toArray: function(a16) {
        return S2(a16, function(a17) {
          return a17;
        }) || [];
      }, only: function(a16) {
        if (!O(a16)) throw Error("React.Children.only expected to receive a single React element child.");
        return a16;
      } };
      exports.Component = E2;
      exports.Fragment = p14;
      exports.Profiler = r25;
      exports.PureComponent = G;
      exports.StrictMode = q;
      exports.Suspense = w;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
      exports.act = X;
      exports.cloneElement = function(a16, b2, e24) {
        if (null === a16 || void 0 === a16) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a16 + ".");
        var d8 = C({}, a16.props), c4 = a16.key, k = a16.ref, h = a16._owner;
        if (null != b2) {
          void 0 !== b2.ref && (k = b2.ref, h = K.current);
          void 0 !== b2.key && (c4 = "" + b2.key);
          if (a16.type && a16.type.defaultProps) var g3 = a16.type.defaultProps;
          for (f11 in b2) J.call(b2, f11) && !L.hasOwnProperty(f11) && (d8[f11] = void 0 === b2[f11] && void 0 !== g3 ? g3[f11] : b2[f11]);
        }
        var f11 = arguments.length - 2;
        if (1 === f11) d8.children = e24;
        else if (1 < f11) {
          g3 = Array(f11);
          for (var m6 = 0; m6 < f11; m6++) g3[m6] = arguments[m6 + 2];
          d8.children = g3;
        }
        return { $$typeof: l7, type: a16.type, key: c4, ref: k, props: d8, _owner: h };
      };
      exports.createContext = function(a16) {
        a16 = { $$typeof: u5, _currentValue: a16, _currentValue2: a16, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
        a16.Provider = { $$typeof: t15, _context: a16 };
        return a16.Consumer = a16;
      };
      exports.createElement = M;
      exports.createFactory = function(a16) {
        var b2 = M.bind(null, a16);
        b2.type = a16;
        return b2;
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(a16) {
        return { $$typeof: v3, render: a16 };
      };
      exports.isValidElement = O;
      exports.lazy = function(a16) {
        return { $$typeof: y, _payload: { _status: -1, _result: a16 }, _init: T2 };
      };
      exports.memo = function(a16, b2) {
        return { $$typeof: x2, type: a16, compare: void 0 === b2 ? null : b2 };
      };
      exports.startTransition = function(a16) {
        var b2 = V.transition;
        V.transition = {};
        try {
          a16();
        } finally {
          V.transition = b2;
        }
      };
      exports.unstable_act = X;
      exports.useCallback = function(a16, b2) {
        return U.current.useCallback(a16, b2);
      };
      exports.useContext = function(a16) {
        return U.current.useContext(a16);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(a16) {
        return U.current.useDeferredValue(a16);
      };
      exports.useEffect = function(a16, b2) {
        return U.current.useEffect(a16, b2);
      };
      exports.useId = function() {
        return U.current.useId();
      };
      exports.useImperativeHandle = function(a16, b2, e24) {
        return U.current.useImperativeHandle(a16, b2, e24);
      };
      exports.useInsertionEffect = function(a16, b2) {
        return U.current.useInsertionEffect(a16, b2);
      };
      exports.useLayoutEffect = function(a16, b2) {
        return U.current.useLayoutEffect(a16, b2);
      };
      exports.useMemo = function(a16, b2) {
        return U.current.useMemo(a16, b2);
      };
      exports.useReducer = function(a16, b2, e24) {
        return U.current.useReducer(a16, b2, e24);
      };
      exports.useRef = function(a16) {
        return U.current.useRef(a16);
      };
      exports.useState = function(a16) {
        return U.current.useState(a16);
      };
      exports.useSyncExternalStore = function(a16, b2, e24) {
        return U.current.useSyncExternalStore(a16, b2, e24);
      };
      exports.useTransition = function() {
        return U.current.useTransition();
      };
      exports.version = "18.3.1";
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/scheduler/cjs/scheduler.production.min.js
  var require_scheduler_production_min = __commonJS({
    "node_modules/scheduler/cjs/scheduler.production.min.js"(exports) {
      "use strict";
      function f11(a16, b2) {
        var c4 = a16.length;
        a16.push(b2);
        a: for (; 0 < c4; ) {
          var d8 = c4 - 1 >>> 1, e24 = a16[d8];
          if (0 < g3(e24, b2)) a16[d8] = b2, a16[c4] = e24, c4 = d8;
          else break a;
        }
      }
      function h(a16) {
        return 0 === a16.length ? null : a16[0];
      }
      function k(a16) {
        if (0 === a16.length) return null;
        var b2 = a16[0], c4 = a16.pop();
        if (c4 !== b2) {
          a16[0] = c4;
          a: for (var d8 = 0, e24 = a16.length, w = e24 >>> 1; d8 < w; ) {
            var m6 = 2 * (d8 + 1) - 1, C = a16[m6], n12 = m6 + 1, x2 = a16[n12];
            if (0 > g3(C, c4)) n12 < e24 && 0 > g3(x2, C) ? (a16[d8] = x2, a16[n12] = c4, d8 = n12) : (a16[d8] = C, a16[m6] = c4, d8 = m6);
            else if (n12 < e24 && 0 > g3(x2, c4)) a16[d8] = x2, a16[n12] = c4, d8 = n12;
            else break a;
          }
        }
        return b2;
      }
      function g3(a16, b2) {
        var c4 = a16.sortIndex - b2.sortIndex;
        return 0 !== c4 ? c4 : a16.id - b2.id;
      }
      if ("object" === typeof performance && "function" === typeof performance.now) {
        l7 = performance;
        exports.unstable_now = function() {
          return l7.now();
        };
      } else {
        p14 = Date, q = p14.now();
        exports.unstable_now = function() {
          return p14.now() - q;
        };
      }
      var l7;
      var p14;
      var q;
      var r25 = [];
      var t15 = [];
      var u5 = 1;
      var v3 = null;
      var y = 3;
      var z = false;
      var A2 = false;
      var B2 = false;
      var D2 = "function" === typeof setTimeout ? setTimeout : null;
      var E2 = "function" === typeof clearTimeout ? clearTimeout : null;
      var F = "undefined" !== typeof setImmediate ? setImmediate : null;
      "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function G(a16) {
        for (var b2 = h(t15); null !== b2; ) {
          if (null === b2.callback) k(t15);
          else if (b2.startTime <= a16) k(t15), b2.sortIndex = b2.expirationTime, f11(r25, b2);
          else break;
          b2 = h(t15);
        }
      }
      function H2(a16) {
        B2 = false;
        G(a16);
        if (!A2) if (null !== h(r25)) A2 = true, I2(J);
        else {
          var b2 = h(t15);
          null !== b2 && K(H2, b2.startTime - a16);
        }
      }
      function J(a16, b2) {
        A2 = false;
        B2 && (B2 = false, E2(L), L = -1);
        z = true;
        var c4 = y;
        try {
          G(b2);
          for (v3 = h(r25); null !== v3 && (!(v3.expirationTime > b2) || a16 && !M()); ) {
            var d8 = v3.callback;
            if ("function" === typeof d8) {
              v3.callback = null;
              y = v3.priorityLevel;
              var e24 = d8(v3.expirationTime <= b2);
              b2 = exports.unstable_now();
              "function" === typeof e24 ? v3.callback = e24 : v3 === h(r25) && k(r25);
              G(b2);
            } else k(r25);
            v3 = h(r25);
          }
          if (null !== v3) var w = true;
          else {
            var m6 = h(t15);
            null !== m6 && K(H2, m6.startTime - b2);
            w = false;
          }
          return w;
        } finally {
          v3 = null, y = c4, z = false;
        }
      }
      var N2 = false;
      var O = null;
      var L = -1;
      var P3 = 5;
      var Q = -1;
      function M() {
        return exports.unstable_now() - Q < P3 ? false : true;
      }
      function R4() {
        if (null !== O) {
          var a16 = exports.unstable_now();
          Q = a16;
          var b2 = true;
          try {
            b2 = O(true, a16);
          } finally {
            b2 ? S2() : (N2 = false, O = null);
          }
        } else N2 = false;
      }
      var S2;
      if ("function" === typeof F) S2 = function() {
        F(R4);
      };
      else if ("undefined" !== typeof MessageChannel) {
        T2 = new MessageChannel(), U = T2.port2;
        T2.port1.onmessage = R4;
        S2 = function() {
          U.postMessage(null);
        };
      } else S2 = function() {
        D2(R4, 0);
      };
      var T2;
      var U;
      function I2(a16) {
        O = a16;
        N2 || (N2 = true, S2());
      }
      function K(a16, b2) {
        L = D2(function() {
          a16(exports.unstable_now());
        }, b2);
      }
      exports.unstable_IdlePriority = 5;
      exports.unstable_ImmediatePriority = 1;
      exports.unstable_LowPriority = 4;
      exports.unstable_NormalPriority = 3;
      exports.unstable_Profiling = null;
      exports.unstable_UserBlockingPriority = 2;
      exports.unstable_cancelCallback = function(a16) {
        a16.callback = null;
      };
      exports.unstable_continueExecution = function() {
        A2 || z || (A2 = true, I2(J));
      };
      exports.unstable_forceFrameRate = function(a16) {
        0 > a16 || 125 < a16 ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P3 = 0 < a16 ? Math.floor(1e3 / a16) : 5;
      };
      exports.unstable_getCurrentPriorityLevel = function() {
        return y;
      };
      exports.unstable_getFirstCallbackNode = function() {
        return h(r25);
      };
      exports.unstable_next = function(a16) {
        switch (y) {
          case 1:
          case 2:
          case 3:
            var b2 = 3;
            break;
          default:
            b2 = y;
        }
        var c4 = y;
        y = b2;
        try {
          return a16();
        } finally {
          y = c4;
        }
      };
      exports.unstable_pauseExecution = function() {
      };
      exports.unstable_requestPaint = function() {
      };
      exports.unstable_runWithPriority = function(a16, b2) {
        switch (a16) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            a16 = 3;
        }
        var c4 = y;
        y = a16;
        try {
          return b2();
        } finally {
          y = c4;
        }
      };
      exports.unstable_scheduleCallback = function(a16, b2, c4) {
        var d8 = exports.unstable_now();
        "object" === typeof c4 && null !== c4 ? (c4 = c4.delay, c4 = "number" === typeof c4 && 0 < c4 ? d8 + c4 : d8) : c4 = d8;
        switch (a16) {
          case 1:
            var e24 = -1;
            break;
          case 2:
            e24 = 250;
            break;
          case 5:
            e24 = 1073741823;
            break;
          case 4:
            e24 = 1e4;
            break;
          default:
            e24 = 5e3;
        }
        e24 = c4 + e24;
        a16 = { id: u5++, callback: b2, priorityLevel: a16, startTime: c4, expirationTime: e24, sortIndex: -1 };
        c4 > d8 ? (a16.sortIndex = c4, f11(t15, a16), null === h(r25) && a16 === h(t15) && (B2 ? (E2(L), L = -1) : B2 = true, K(H2, c4 - d8))) : (a16.sortIndex = e24, f11(r25, a16), A2 || z || (A2 = true, I2(J)));
        return a16;
      };
      exports.unstable_shouldYield = M;
      exports.unstable_wrapCallback = function(a16) {
        var b2 = y;
        return function() {
          var c4 = y;
          y = b2;
          try {
            return a16.apply(this, arguments);
          } finally {
            y = c4;
          }
        };
      };
    }
  });

  // node_modules/scheduler/index.js
  var require_scheduler = __commonJS({
    "node_modules/scheduler/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_scheduler_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react-dom/cjs/react-dom.production.min.js
  var require_react_dom_production_min = __commonJS({
    "node_modules/react-dom/cjs/react-dom.production.min.js"(exports) {
      "use strict";
      var aa = require_react();
      var ca = require_scheduler();
      function p14(a16) {
        for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a16, c4 = 1; c4 < arguments.length; c4++) b2 += "&args[]=" + encodeURIComponent(arguments[c4]);
        return "Minified React error #" + a16 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var da = /* @__PURE__ */ new Set();
      var ea = {};
      function fa(a16, b2) {
        ha(a16, b2);
        ha(a16 + "Capture", b2);
      }
      function ha(a16, b2) {
        ea[a16] = b2;
        for (a16 = 0; a16 < b2.length; a16++) da.add(b2[a16]);
      }
      var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
      var ja = Object.prototype.hasOwnProperty;
      var ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
      var la = {};
      var ma = {};
      function oa(a16) {
        if (ja.call(ma, a16)) return true;
        if (ja.call(la, a16)) return false;
        if (ka.test(a16)) return ma[a16] = true;
        la[a16] = true;
        return false;
      }
      function pa(a16, b2, c4, d8) {
        if (null !== c4 && 0 === c4.type) return false;
        switch (typeof b2) {
          case "function":
          case "symbol":
            return true;
          case "boolean":
            if (d8) return false;
            if (null !== c4) return !c4.acceptsBooleans;
            a16 = a16.toLowerCase().slice(0, 5);
            return "data-" !== a16 && "aria-" !== a16;
          default:
            return false;
        }
      }
      function qa(a16, b2, c4, d8) {
        if (null === b2 || "undefined" === typeof b2 || pa(a16, b2, c4, d8)) return true;
        if (d8) return false;
        if (null !== c4) switch (c4.type) {
          case 3:
            return !b2;
          case 4:
            return false === b2;
          case 5:
            return isNaN(b2);
          case 6:
            return isNaN(b2) || 1 > b2;
        }
        return false;
      }
      function v3(a16, b2, c4, d8, e24, f11, g3) {
        this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
        this.attributeName = d8;
        this.attributeNamespace = e24;
        this.mustUseProperty = c4;
        this.propertyName = a16;
        this.type = b2;
        this.sanitizeURL = f11;
        this.removeEmptyString = g3;
      }
      var z = {};
      "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a16) {
        z[a16] = new v3(a16, 0, false, a16, null, false, false);
      });
      [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a16) {
        var b2 = a16[0];
        z[b2] = new v3(b2, 1, false, a16[1], null, false, false);
      });
      ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a16) {
        z[a16] = new v3(a16, 2, false, a16.toLowerCase(), null, false, false);
      });
      ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a16) {
        z[a16] = new v3(a16, 2, false, a16, null, false, false);
      });
      "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a16) {
        z[a16] = new v3(a16, 3, false, a16.toLowerCase(), null, false, false);
      });
      ["checked", "multiple", "muted", "selected"].forEach(function(a16) {
        z[a16] = new v3(a16, 3, true, a16, null, false, false);
      });
      ["capture", "download"].forEach(function(a16) {
        z[a16] = new v3(a16, 4, false, a16, null, false, false);
      });
      ["cols", "rows", "size", "span"].forEach(function(a16) {
        z[a16] = new v3(a16, 6, false, a16, null, false, false);
      });
      ["rowSpan", "start"].forEach(function(a16) {
        z[a16] = new v3(a16, 5, false, a16.toLowerCase(), null, false, false);
      });
      var ra = /[\-:]([a-z])/g;
      function sa(a16) {
        return a16[1].toUpperCase();
      }
      "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a16) {
        var b2 = a16.replace(
          ra,
          sa
        );
        z[b2] = new v3(b2, 1, false, a16, null, false, false);
      });
      "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a16) {
        var b2 = a16.replace(ra, sa);
        z[b2] = new v3(b2, 1, false, a16, "http://www.w3.org/1999/xlink", false, false);
      });
      ["xml:base", "xml:lang", "xml:space"].forEach(function(a16) {
        var b2 = a16.replace(ra, sa);
        z[b2] = new v3(b2, 1, false, a16, "http://www.w3.org/XML/1998/namespace", false, false);
      });
      ["tabIndex", "crossOrigin"].forEach(function(a16) {
        z[a16] = new v3(a16, 1, false, a16.toLowerCase(), null, false, false);
      });
      z.xlinkHref = new v3("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
      ["src", "href", "action", "formAction"].forEach(function(a16) {
        z[a16] = new v3(a16, 1, false, a16.toLowerCase(), null, true, true);
      });
      function ta(a16, b2, c4, d8) {
        var e24 = z.hasOwnProperty(b2) ? z[b2] : null;
        if (null !== e24 ? 0 !== e24.type : d8 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1]) qa(b2, c4, e24, d8) && (c4 = null), d8 || null === e24 ? oa(b2) && (null === c4 ? a16.removeAttribute(b2) : a16.setAttribute(b2, "" + c4)) : e24.mustUseProperty ? a16[e24.propertyName] = null === c4 ? 3 === e24.type ? false : "" : c4 : (b2 = e24.attributeName, d8 = e24.attributeNamespace, null === c4 ? a16.removeAttribute(b2) : (e24 = e24.type, c4 = 3 === e24 || 4 === e24 && true === c4 ? "" : "" + c4, d8 ? a16.setAttributeNS(d8, b2, c4) : a16.setAttribute(b2, c4)));
      }
      var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      var va = Symbol.for("react.element");
      var wa = Symbol.for("react.portal");
      var ya = Symbol.for("react.fragment");
      var za = Symbol.for("react.strict_mode");
      var Aa = Symbol.for("react.profiler");
      var Ba = Symbol.for("react.provider");
      var Ca = Symbol.for("react.context");
      var Da = Symbol.for("react.forward_ref");
      var Ea = Symbol.for("react.suspense");
      var Fa = Symbol.for("react.suspense_list");
      var Ga = Symbol.for("react.memo");
      var Ha = Symbol.for("react.lazy");
      Symbol.for("react.scope");
      Symbol.for("react.debug_trace_mode");
      var Ia = Symbol.for("react.offscreen");
      Symbol.for("react.legacy_hidden");
      Symbol.for("react.cache");
      Symbol.for("react.tracing_marker");
      var Ja = Symbol.iterator;
      function Ka(a16) {
        if (null === a16 || "object" !== typeof a16) return null;
        a16 = Ja && a16[Ja] || a16["@@iterator"];
        return "function" === typeof a16 ? a16 : null;
      }
      var A2 = Object.assign;
      var La;
      function Ma(a16) {
        if (void 0 === La) try {
          throw Error();
        } catch (c4) {
          var b2 = c4.stack.trim().match(/\n( *(at )?)/);
          La = b2 && b2[1] || "";
        }
        return "\n" + La + a16;
      }
      var Na = false;
      function Oa(a16, b2) {
        if (!a16 || Na) return "";
        Na = true;
        var c4 = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
          if (b2) if (b2 = function() {
            throw Error();
          }, Object.defineProperty(b2.prototype, "props", { set: function() {
            throw Error();
          } }), "object" === typeof Reflect && Reflect.construct) {
            try {
              Reflect.construct(b2, []);
            } catch (l7) {
              var d8 = l7;
            }
            Reflect.construct(a16, [], b2);
          } else {
            try {
              b2.call();
            } catch (l7) {
              d8 = l7;
            }
            a16.call(b2.prototype);
          }
          else {
            try {
              throw Error();
            } catch (l7) {
              d8 = l7;
            }
            a16();
          }
        } catch (l7) {
          if (l7 && d8 && "string" === typeof l7.stack) {
            for (var e24 = l7.stack.split("\n"), f11 = d8.stack.split("\n"), g3 = e24.length - 1, h = f11.length - 1; 1 <= g3 && 0 <= h && e24[g3] !== f11[h]; ) h--;
            for (; 1 <= g3 && 0 <= h; g3--, h--) if (e24[g3] !== f11[h]) {
              if (1 !== g3 || 1 !== h) {
                do
                  if (g3--, h--, 0 > h || e24[g3] !== f11[h]) {
                    var k = "\n" + e24[g3].replace(" at new ", " at ");
                    a16.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a16.displayName));
                    return k;
                  }
                while (1 <= g3 && 0 <= h);
              }
              break;
            }
          }
        } finally {
          Na = false, Error.prepareStackTrace = c4;
        }
        return (a16 = a16 ? a16.displayName || a16.name : "") ? Ma(a16) : "";
      }
      function Pa(a16) {
        switch (a16.tag) {
          case 5:
            return Ma(a16.type);
          case 16:
            return Ma("Lazy");
          case 13:
            return Ma("Suspense");
          case 19:
            return Ma("SuspenseList");
          case 0:
          case 2:
          case 15:
            return a16 = Oa(a16.type, false), a16;
          case 11:
            return a16 = Oa(a16.type.render, false), a16;
          case 1:
            return a16 = Oa(a16.type, true), a16;
          default:
            return "";
        }
      }
      function Qa(a16) {
        if (null == a16) return null;
        if ("function" === typeof a16) return a16.displayName || a16.name || null;
        if ("string" === typeof a16) return a16;
        switch (a16) {
          case ya:
            return "Fragment";
          case wa:
            return "Portal";
          case Aa:
            return "Profiler";
          case za:
            return "StrictMode";
          case Ea:
            return "Suspense";
          case Fa:
            return "SuspenseList";
        }
        if ("object" === typeof a16) switch (a16.$$typeof) {
          case Ca:
            return (a16.displayName || "Context") + ".Consumer";
          case Ba:
            return (a16._context.displayName || "Context") + ".Provider";
          case Da:
            var b2 = a16.render;
            a16 = a16.displayName;
            a16 || (a16 = b2.displayName || b2.name || "", a16 = "" !== a16 ? "ForwardRef(" + a16 + ")" : "ForwardRef");
            return a16;
          case Ga:
            return b2 = a16.displayName || null, null !== b2 ? b2 : Qa(a16.type) || "Memo";
          case Ha:
            b2 = a16._payload;
            a16 = a16._init;
            try {
              return Qa(a16(b2));
            } catch (c4) {
            }
        }
        return null;
      }
      function Ra(a16) {
        var b2 = a16.type;
        switch (a16.tag) {
          case 24:
            return "Cache";
          case 9:
            return (b2.displayName || "Context") + ".Consumer";
          case 10:
            return (b2._context.displayName || "Context") + ".Provider";
          case 18:
            return "DehydratedFragment";
          case 11:
            return a16 = b2.render, a16 = a16.displayName || a16.name || "", b2.displayName || ("" !== a16 ? "ForwardRef(" + a16 + ")" : "ForwardRef");
          case 7:
            return "Fragment";
          case 5:
            return b2;
          case 4:
            return "Portal";
          case 3:
            return "Root";
          case 6:
            return "Text";
          case 16:
            return Qa(b2);
          case 8:
            return b2 === za ? "StrictMode" : "Mode";
          case 22:
            return "Offscreen";
          case 12:
            return "Profiler";
          case 21:
            return "Scope";
          case 13:
            return "Suspense";
          case 19:
            return "SuspenseList";
          case 25:
            return "TracingMarker";
          case 1:
          case 0:
          case 17:
          case 2:
          case 14:
          case 15:
            if ("function" === typeof b2) return b2.displayName || b2.name || null;
            if ("string" === typeof b2) return b2;
        }
        return null;
      }
      function Sa(a16) {
        switch (typeof a16) {
          case "boolean":
          case "number":
          case "string":
          case "undefined":
            return a16;
          case "object":
            return a16;
          default:
            return "";
        }
      }
      function Ta(a16) {
        var b2 = a16.type;
        return (a16 = a16.nodeName) && "input" === a16.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
      }
      function Ua(a16) {
        var b2 = Ta(a16) ? "checked" : "value", c4 = Object.getOwnPropertyDescriptor(a16.constructor.prototype, b2), d8 = "" + a16[b2];
        if (!a16.hasOwnProperty(b2) && "undefined" !== typeof c4 && "function" === typeof c4.get && "function" === typeof c4.set) {
          var e24 = c4.get, f11 = c4.set;
          Object.defineProperty(a16, b2, { configurable: true, get: function() {
            return e24.call(this);
          }, set: function(a17) {
            d8 = "" + a17;
            f11.call(this, a17);
          } });
          Object.defineProperty(a16, b2, { enumerable: c4.enumerable });
          return { getValue: function() {
            return d8;
          }, setValue: function(a17) {
            d8 = "" + a17;
          }, stopTracking: function() {
            a16._valueTracker = null;
            delete a16[b2];
          } };
        }
      }
      function Va(a16) {
        a16._valueTracker || (a16._valueTracker = Ua(a16));
      }
      function Wa(a16) {
        if (!a16) return false;
        var b2 = a16._valueTracker;
        if (!b2) return true;
        var c4 = b2.getValue();
        var d8 = "";
        a16 && (d8 = Ta(a16) ? a16.checked ? "true" : "false" : a16.value);
        a16 = d8;
        return a16 !== c4 ? (b2.setValue(a16), true) : false;
      }
      function Xa(a16) {
        a16 = a16 || ("undefined" !== typeof document ? document : void 0);
        if ("undefined" === typeof a16) return null;
        try {
          return a16.activeElement || a16.body;
        } catch (b2) {
          return a16.body;
        }
      }
      function Ya(a16, b2) {
        var c4 = b2.checked;
        return A2({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c4 ? c4 : a16._wrapperState.initialChecked });
      }
      function Za(a16, b2) {
        var c4 = null == b2.defaultValue ? "" : b2.defaultValue, d8 = null != b2.checked ? b2.checked : b2.defaultChecked;
        c4 = Sa(null != b2.value ? b2.value : c4);
        a16._wrapperState = { initialChecked: d8, initialValue: c4, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
      }
      function ab(a16, b2) {
        b2 = b2.checked;
        null != b2 && ta(a16, "checked", b2, false);
      }
      function bb(a16, b2) {
        ab(a16, b2);
        var c4 = Sa(b2.value), d8 = b2.type;
        if (null != c4) if ("number" === d8) {
          if (0 === c4 && "" === a16.value || a16.value != c4) a16.value = "" + c4;
        } else a16.value !== "" + c4 && (a16.value = "" + c4);
        else if ("submit" === d8 || "reset" === d8) {
          a16.removeAttribute("value");
          return;
        }
        b2.hasOwnProperty("value") ? cb(a16, b2.type, c4) : b2.hasOwnProperty("defaultValue") && cb(a16, b2.type, Sa(b2.defaultValue));
        null == b2.checked && null != b2.defaultChecked && (a16.defaultChecked = !!b2.defaultChecked);
      }
      function db(a16, b2, c4) {
        if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
          var d8 = b2.type;
          if (!("submit" !== d8 && "reset" !== d8 || void 0 !== b2.value && null !== b2.value)) return;
          b2 = "" + a16._wrapperState.initialValue;
          c4 || b2 === a16.value || (a16.value = b2);
          a16.defaultValue = b2;
        }
        c4 = a16.name;
        "" !== c4 && (a16.name = "");
        a16.defaultChecked = !!a16._wrapperState.initialChecked;
        "" !== c4 && (a16.name = c4);
      }
      function cb(a16, b2, c4) {
        if ("number" !== b2 || Xa(a16.ownerDocument) !== a16) null == c4 ? a16.defaultValue = "" + a16._wrapperState.initialValue : a16.defaultValue !== "" + c4 && (a16.defaultValue = "" + c4);
      }
      var eb = Array.isArray;
      function fb(a16, b2, c4, d8) {
        a16 = a16.options;
        if (b2) {
          b2 = {};
          for (var e24 = 0; e24 < c4.length; e24++) b2["$" + c4[e24]] = true;
          for (c4 = 0; c4 < a16.length; c4++) e24 = b2.hasOwnProperty("$" + a16[c4].value), a16[c4].selected !== e24 && (a16[c4].selected = e24), e24 && d8 && (a16[c4].defaultSelected = true);
        } else {
          c4 = "" + Sa(c4);
          b2 = null;
          for (e24 = 0; e24 < a16.length; e24++) {
            if (a16[e24].value === c4) {
              a16[e24].selected = true;
              d8 && (a16[e24].defaultSelected = true);
              return;
            }
            null !== b2 || a16[e24].disabled || (b2 = a16[e24]);
          }
          null !== b2 && (b2.selected = true);
        }
      }
      function gb(a16, b2) {
        if (null != b2.dangerouslySetInnerHTML) throw Error(p14(91));
        return A2({}, b2, { value: void 0, defaultValue: void 0, children: "" + a16._wrapperState.initialValue });
      }
      function hb(a16, b2) {
        var c4 = b2.value;
        if (null == c4) {
          c4 = b2.children;
          b2 = b2.defaultValue;
          if (null != c4) {
            if (null != b2) throw Error(p14(92));
            if (eb(c4)) {
              if (1 < c4.length) throw Error(p14(93));
              c4 = c4[0];
            }
            b2 = c4;
          }
          null == b2 && (b2 = "");
          c4 = b2;
        }
        a16._wrapperState = { initialValue: Sa(c4) };
      }
      function ib(a16, b2) {
        var c4 = Sa(b2.value), d8 = Sa(b2.defaultValue);
        null != c4 && (c4 = "" + c4, c4 !== a16.value && (a16.value = c4), null == b2.defaultValue && a16.defaultValue !== c4 && (a16.defaultValue = c4));
        null != d8 && (a16.defaultValue = "" + d8);
      }
      function jb(a16) {
        var b2 = a16.textContent;
        b2 === a16._wrapperState.initialValue && "" !== b2 && null !== b2 && (a16.value = b2);
      }
      function kb(a16) {
        switch (a16) {
          case "svg":
            return "http://www.w3.org/2000/svg";
          case "math":
            return "http://www.w3.org/1998/Math/MathML";
          default:
            return "http://www.w3.org/1999/xhtml";
        }
      }
      function lb(a16, b2) {
        return null == a16 || "http://www.w3.org/1999/xhtml" === a16 ? kb(b2) : "http://www.w3.org/2000/svg" === a16 && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a16;
      }
      var mb;
      var nb = (function(a16) {
        return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c4, d8, e24) {
          MSApp.execUnsafeLocalFunction(function() {
            return a16(b2, c4, d8, e24);
          });
        } : a16;
      })(function(a16, b2) {
        if ("http://www.w3.org/2000/svg" !== a16.namespaceURI || "innerHTML" in a16) a16.innerHTML = b2;
        else {
          mb = mb || document.createElement("div");
          mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
          for (b2 = mb.firstChild; a16.firstChild; ) a16.removeChild(a16.firstChild);
          for (; b2.firstChild; ) a16.appendChild(b2.firstChild);
        }
      });
      function ob(a16, b2) {
        if (b2) {
          var c4 = a16.firstChild;
          if (c4 && c4 === a16.lastChild && 3 === c4.nodeType) {
            c4.nodeValue = b2;
            return;
          }
        }
        a16.textContent = b2;
      }
      var pb = {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridArea: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };
      var qb = ["Webkit", "ms", "Moz", "O"];
      Object.keys(pb).forEach(function(a16) {
        qb.forEach(function(b2) {
          b2 = b2 + a16.charAt(0).toUpperCase() + a16.substring(1);
          pb[b2] = pb[a16];
        });
      });
      function rb(a16, b2, c4) {
        return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c4 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a16) && pb[a16] ? ("" + b2).trim() : b2 + "px";
      }
      function sb(a16, b2) {
        a16 = a16.style;
        for (var c4 in b2) if (b2.hasOwnProperty(c4)) {
          var d8 = 0 === c4.indexOf("--"), e24 = rb(c4, b2[c4], d8);
          "float" === c4 && (c4 = "cssFloat");
          d8 ? a16.setProperty(c4, e24) : a16[c4] = e24;
        }
      }
      var tb = A2({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
      function ub(a16, b2) {
        if (b2) {
          if (tb[a16] && (null != b2.children || null != b2.dangerouslySetInnerHTML)) throw Error(p14(137, a16));
          if (null != b2.dangerouslySetInnerHTML) {
            if (null != b2.children) throw Error(p14(60));
            if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML)) throw Error(p14(61));
          }
          if (null != b2.style && "object" !== typeof b2.style) throw Error(p14(62));
        }
      }
      function vb(a16, b2) {
        if (-1 === a16.indexOf("-")) return "string" === typeof b2.is;
        switch (a16) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return false;
          default:
            return true;
        }
      }
      var wb = null;
      function xb(a16) {
        a16 = a16.target || a16.srcElement || window;
        a16.correspondingUseElement && (a16 = a16.correspondingUseElement);
        return 3 === a16.nodeType ? a16.parentNode : a16;
      }
      var yb = null;
      var zb = null;
      var Ab = null;
      function Bb(a16) {
        if (a16 = Cb(a16)) {
          if ("function" !== typeof yb) throw Error(p14(280));
          var b2 = a16.stateNode;
          b2 && (b2 = Db(b2), yb(a16.stateNode, a16.type, b2));
        }
      }
      function Eb(a16) {
        zb ? Ab ? Ab.push(a16) : Ab = [a16] : zb = a16;
      }
      function Fb() {
        if (zb) {
          var a16 = zb, b2 = Ab;
          Ab = zb = null;
          Bb(a16);
          if (b2) for (a16 = 0; a16 < b2.length; a16++) Bb(b2[a16]);
        }
      }
      function Gb(a16, b2) {
        return a16(b2);
      }
      function Hb() {
      }
      var Ib = false;
      function Jb(a16, b2, c4) {
        if (Ib) return a16(b2, c4);
        Ib = true;
        try {
          return Gb(a16, b2, c4);
        } finally {
          if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
        }
      }
      function Kb(a16, b2) {
        var c4 = a16.stateNode;
        if (null === c4) return null;
        var d8 = Db(c4);
        if (null === d8) return null;
        c4 = d8[b2];
        a: switch (b2) {
          case "onClick":
          case "onClickCapture":
          case "onDoubleClick":
          case "onDoubleClickCapture":
          case "onMouseDown":
          case "onMouseDownCapture":
          case "onMouseMove":
          case "onMouseMoveCapture":
          case "onMouseUp":
          case "onMouseUpCapture":
          case "onMouseEnter":
            (d8 = !d8.disabled) || (a16 = a16.type, d8 = !("button" === a16 || "input" === a16 || "select" === a16 || "textarea" === a16));
            a16 = !d8;
            break a;
          default:
            a16 = false;
        }
        if (a16) return null;
        if (c4 && "function" !== typeof c4) throw Error(p14(231, b2, typeof c4));
        return c4;
      }
      var Lb = false;
      if (ia) try {
        Mb = {};
        Object.defineProperty(Mb, "passive", { get: function() {
          Lb = true;
        } });
        window.addEventListener("test", Mb, Mb);
        window.removeEventListener("test", Mb, Mb);
      } catch (a16) {
        Lb = false;
      }
      var Mb;
      function Nb(a16, b2, c4, d8, e24, f11, g3, h, k) {
        var l7 = Array.prototype.slice.call(arguments, 3);
        try {
          b2.apply(c4, l7);
        } catch (m6) {
          this.onError(m6);
        }
      }
      var Ob = false;
      var Pb = null;
      var Qb = false;
      var Rb = null;
      var Sb = { onError: function(a16) {
        Ob = true;
        Pb = a16;
      } };
      function Tb(a16, b2, c4, d8, e24, f11, g3, h, k) {
        Ob = false;
        Pb = null;
        Nb.apply(Sb, arguments);
      }
      function Ub(a16, b2, c4, d8, e24, f11, g3, h, k) {
        Tb.apply(this, arguments);
        if (Ob) {
          if (Ob) {
            var l7 = Pb;
            Ob = false;
            Pb = null;
          } else throw Error(p14(198));
          Qb || (Qb = true, Rb = l7);
        }
      }
      function Vb(a16) {
        var b2 = a16, c4 = a16;
        if (a16.alternate) for (; b2.return; ) b2 = b2.return;
        else {
          a16 = b2;
          do
            b2 = a16, 0 !== (b2.flags & 4098) && (c4 = b2.return), a16 = b2.return;
          while (a16);
        }
        return 3 === b2.tag ? c4 : null;
      }
      function Wb(a16) {
        if (13 === a16.tag) {
          var b2 = a16.memoizedState;
          null === b2 && (a16 = a16.alternate, null !== a16 && (b2 = a16.memoizedState));
          if (null !== b2) return b2.dehydrated;
        }
        return null;
      }
      function Xb(a16) {
        if (Vb(a16) !== a16) throw Error(p14(188));
      }
      function Yb(a16) {
        var b2 = a16.alternate;
        if (!b2) {
          b2 = Vb(a16);
          if (null === b2) throw Error(p14(188));
          return b2 !== a16 ? null : a16;
        }
        for (var c4 = a16, d8 = b2; ; ) {
          var e24 = c4.return;
          if (null === e24) break;
          var f11 = e24.alternate;
          if (null === f11) {
            d8 = e24.return;
            if (null !== d8) {
              c4 = d8;
              continue;
            }
            break;
          }
          if (e24.child === f11.child) {
            for (f11 = e24.child; f11; ) {
              if (f11 === c4) return Xb(e24), a16;
              if (f11 === d8) return Xb(e24), b2;
              f11 = f11.sibling;
            }
            throw Error(p14(188));
          }
          if (c4.return !== d8.return) c4 = e24, d8 = f11;
          else {
            for (var g3 = false, h = e24.child; h; ) {
              if (h === c4) {
                g3 = true;
                c4 = e24;
                d8 = f11;
                break;
              }
              if (h === d8) {
                g3 = true;
                d8 = e24;
                c4 = f11;
                break;
              }
              h = h.sibling;
            }
            if (!g3) {
              for (h = f11.child; h; ) {
                if (h === c4) {
                  g3 = true;
                  c4 = f11;
                  d8 = e24;
                  break;
                }
                if (h === d8) {
                  g3 = true;
                  d8 = f11;
                  c4 = e24;
                  break;
                }
                h = h.sibling;
              }
              if (!g3) throw Error(p14(189));
            }
          }
          if (c4.alternate !== d8) throw Error(p14(190));
        }
        if (3 !== c4.tag) throw Error(p14(188));
        return c4.stateNode.current === c4 ? a16 : b2;
      }
      function Zb(a16) {
        a16 = Yb(a16);
        return null !== a16 ? $b(a16) : null;
      }
      function $b(a16) {
        if (5 === a16.tag || 6 === a16.tag) return a16;
        for (a16 = a16.child; null !== a16; ) {
          var b2 = $b(a16);
          if (null !== b2) return b2;
          a16 = a16.sibling;
        }
        return null;
      }
      var ac = ca.unstable_scheduleCallback;
      var bc = ca.unstable_cancelCallback;
      var cc = ca.unstable_shouldYield;
      var dc = ca.unstable_requestPaint;
      var B2 = ca.unstable_now;
      var ec = ca.unstable_getCurrentPriorityLevel;
      var fc = ca.unstable_ImmediatePriority;
      var gc = ca.unstable_UserBlockingPriority;
      var hc = ca.unstable_NormalPriority;
      var ic = ca.unstable_LowPriority;
      var jc = ca.unstable_IdlePriority;
      var kc = null;
      var lc = null;
      function mc(a16) {
        if (lc && "function" === typeof lc.onCommitFiberRoot) try {
          lc.onCommitFiberRoot(kc, a16, void 0, 128 === (a16.current.flags & 128));
        } catch (b2) {
        }
      }
      var oc = Math.clz32 ? Math.clz32 : nc;
      var pc = Math.log;
      var qc = Math.LN2;
      function nc(a16) {
        a16 >>>= 0;
        return 0 === a16 ? 32 : 31 - (pc(a16) / qc | 0) | 0;
      }
      var rc = 64;
      var sc = 4194304;
      function tc(a16) {
        switch (a16 & -a16) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 4:
            return 4;
          case 8:
            return 8;
          case 16:
            return 16;
          case 32:
            return 32;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return a16 & 4194240;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return a16 & 130023424;
          case 134217728:
            return 134217728;
          case 268435456:
            return 268435456;
          case 536870912:
            return 536870912;
          case 1073741824:
            return 1073741824;
          default:
            return a16;
        }
      }
      function uc(a16, b2) {
        var c4 = a16.pendingLanes;
        if (0 === c4) return 0;
        var d8 = 0, e24 = a16.suspendedLanes, f11 = a16.pingedLanes, g3 = c4 & 268435455;
        if (0 !== g3) {
          var h = g3 & ~e24;
          0 !== h ? d8 = tc(h) : (f11 &= g3, 0 !== f11 && (d8 = tc(f11)));
        } else g3 = c4 & ~e24, 0 !== g3 ? d8 = tc(g3) : 0 !== f11 && (d8 = tc(f11));
        if (0 === d8) return 0;
        if (0 !== b2 && b2 !== d8 && 0 === (b2 & e24) && (e24 = d8 & -d8, f11 = b2 & -b2, e24 >= f11 || 16 === e24 && 0 !== (f11 & 4194240))) return b2;
        0 !== (d8 & 4) && (d8 |= c4 & 16);
        b2 = a16.entangledLanes;
        if (0 !== b2) for (a16 = a16.entanglements, b2 &= d8; 0 < b2; ) c4 = 31 - oc(b2), e24 = 1 << c4, d8 |= a16[c4], b2 &= ~e24;
        return d8;
      }
      function vc(a16, b2) {
        switch (a16) {
          case 1:
          case 2:
          case 4:
            return b2 + 250;
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return b2 + 5e3;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return -1;
          case 134217728:
          case 268435456:
          case 536870912:
          case 1073741824:
            return -1;
          default:
            return -1;
        }
      }
      function wc(a16, b2) {
        for (var c4 = a16.suspendedLanes, d8 = a16.pingedLanes, e24 = a16.expirationTimes, f11 = a16.pendingLanes; 0 < f11; ) {
          var g3 = 31 - oc(f11), h = 1 << g3, k = e24[g3];
          if (-1 === k) {
            if (0 === (h & c4) || 0 !== (h & d8)) e24[g3] = vc(h, b2);
          } else k <= b2 && (a16.expiredLanes |= h);
          f11 &= ~h;
        }
      }
      function xc(a16) {
        a16 = a16.pendingLanes & -1073741825;
        return 0 !== a16 ? a16 : a16 & 1073741824 ? 1073741824 : 0;
      }
      function yc() {
        var a16 = rc;
        rc <<= 1;
        0 === (rc & 4194240) && (rc = 64);
        return a16;
      }
      function zc(a16) {
        for (var b2 = [], c4 = 0; 31 > c4; c4++) b2.push(a16);
        return b2;
      }
      function Ac(a16, b2, c4) {
        a16.pendingLanes |= b2;
        536870912 !== b2 && (a16.suspendedLanes = 0, a16.pingedLanes = 0);
        a16 = a16.eventTimes;
        b2 = 31 - oc(b2);
        a16[b2] = c4;
      }
      function Bc(a16, b2) {
        var c4 = a16.pendingLanes & ~b2;
        a16.pendingLanes = b2;
        a16.suspendedLanes = 0;
        a16.pingedLanes = 0;
        a16.expiredLanes &= b2;
        a16.mutableReadLanes &= b2;
        a16.entangledLanes &= b2;
        b2 = a16.entanglements;
        var d8 = a16.eventTimes;
        for (a16 = a16.expirationTimes; 0 < c4; ) {
          var e24 = 31 - oc(c4), f11 = 1 << e24;
          b2[e24] = 0;
          d8[e24] = -1;
          a16[e24] = -1;
          c4 &= ~f11;
        }
      }
      function Cc(a16, b2) {
        var c4 = a16.entangledLanes |= b2;
        for (a16 = a16.entanglements; c4; ) {
          var d8 = 31 - oc(c4), e24 = 1 << d8;
          e24 & b2 | a16[d8] & b2 && (a16[d8] |= b2);
          c4 &= ~e24;
        }
      }
      var C = 0;
      function Dc(a16) {
        a16 &= -a16;
        return 1 < a16 ? 4 < a16 ? 0 !== (a16 & 268435455) ? 16 : 536870912 : 4 : 1;
      }
      var Ec;
      var Fc;
      var Gc;
      var Hc;
      var Ic;
      var Jc = false;
      var Kc = [];
      var Lc = null;
      var Mc = null;
      var Nc = null;
      var Oc = /* @__PURE__ */ new Map();
      var Pc = /* @__PURE__ */ new Map();
      var Qc = [];
      var Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
      function Sc(a16, b2) {
        switch (a16) {
          case "focusin":
          case "focusout":
            Lc = null;
            break;
          case "dragenter":
          case "dragleave":
            Mc = null;
            break;
          case "mouseover":
          case "mouseout":
            Nc = null;
            break;
          case "pointerover":
          case "pointerout":
            Oc.delete(b2.pointerId);
            break;
          case "gotpointercapture":
          case "lostpointercapture":
            Pc.delete(b2.pointerId);
        }
      }
      function Tc(a16, b2, c4, d8, e24, f11) {
        if (null === a16 || a16.nativeEvent !== f11) return a16 = { blockedOn: b2, domEventName: c4, eventSystemFlags: d8, nativeEvent: f11, targetContainers: [e24] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a16;
        a16.eventSystemFlags |= d8;
        b2 = a16.targetContainers;
        null !== e24 && -1 === b2.indexOf(e24) && b2.push(e24);
        return a16;
      }
      function Uc(a16, b2, c4, d8, e24) {
        switch (b2) {
          case "focusin":
            return Lc = Tc(Lc, a16, b2, c4, d8, e24), true;
          case "dragenter":
            return Mc = Tc(Mc, a16, b2, c4, d8, e24), true;
          case "mouseover":
            return Nc = Tc(Nc, a16, b2, c4, d8, e24), true;
          case "pointerover":
            var f11 = e24.pointerId;
            Oc.set(f11, Tc(Oc.get(f11) || null, a16, b2, c4, d8, e24));
            return true;
          case "gotpointercapture":
            return f11 = e24.pointerId, Pc.set(f11, Tc(Pc.get(f11) || null, a16, b2, c4, d8, e24)), true;
        }
        return false;
      }
      function Vc(a16) {
        var b2 = Wc(a16.target);
        if (null !== b2) {
          var c4 = Vb(b2);
          if (null !== c4) {
            if (b2 = c4.tag, 13 === b2) {
              if (b2 = Wb(c4), null !== b2) {
                a16.blockedOn = b2;
                Ic(a16.priority, function() {
                  Gc(c4);
                });
                return;
              }
            } else if (3 === b2 && c4.stateNode.current.memoizedState.isDehydrated) {
              a16.blockedOn = 3 === c4.tag ? c4.stateNode.containerInfo : null;
              return;
            }
          }
        }
        a16.blockedOn = null;
      }
      function Xc(a16) {
        if (null !== a16.blockedOn) return false;
        for (var b2 = a16.targetContainers; 0 < b2.length; ) {
          var c4 = Yc(a16.domEventName, a16.eventSystemFlags, b2[0], a16.nativeEvent);
          if (null === c4) {
            c4 = a16.nativeEvent;
            var d8 = new c4.constructor(c4.type, c4);
            wb = d8;
            c4.target.dispatchEvent(d8);
            wb = null;
          } else return b2 = Cb(c4), null !== b2 && Fc(b2), a16.blockedOn = c4, false;
          b2.shift();
        }
        return true;
      }
      function Zc(a16, b2, c4) {
        Xc(a16) && c4.delete(b2);
      }
      function $c() {
        Jc = false;
        null !== Lc && Xc(Lc) && (Lc = null);
        null !== Mc && Xc(Mc) && (Mc = null);
        null !== Nc && Xc(Nc) && (Nc = null);
        Oc.forEach(Zc);
        Pc.forEach(Zc);
      }
      function ad(a16, b2) {
        a16.blockedOn === b2 && (a16.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
      }
      function bd(a16) {
        function b2(b3) {
          return ad(b3, a16);
        }
        if (0 < Kc.length) {
          ad(Kc[0], a16);
          for (var c4 = 1; c4 < Kc.length; c4++) {
            var d8 = Kc[c4];
            d8.blockedOn === a16 && (d8.blockedOn = null);
          }
        }
        null !== Lc && ad(Lc, a16);
        null !== Mc && ad(Mc, a16);
        null !== Nc && ad(Nc, a16);
        Oc.forEach(b2);
        Pc.forEach(b2);
        for (c4 = 0; c4 < Qc.length; c4++) d8 = Qc[c4], d8.blockedOn === a16 && (d8.blockedOn = null);
        for (; 0 < Qc.length && (c4 = Qc[0], null === c4.blockedOn); ) Vc(c4), null === c4.blockedOn && Qc.shift();
      }
      var cd = ua.ReactCurrentBatchConfig;
      var dd = true;
      function ed(a16, b2, c4, d8) {
        var e24 = C, f11 = cd.transition;
        cd.transition = null;
        try {
          C = 1, fd(a16, b2, c4, d8);
        } finally {
          C = e24, cd.transition = f11;
        }
      }
      function gd(a16, b2, c4, d8) {
        var e24 = C, f11 = cd.transition;
        cd.transition = null;
        try {
          C = 4, fd(a16, b2, c4, d8);
        } finally {
          C = e24, cd.transition = f11;
        }
      }
      function fd(a16, b2, c4, d8) {
        if (dd) {
          var e24 = Yc(a16, b2, c4, d8);
          if (null === e24) hd(a16, b2, d8, id, c4), Sc(a16, d8);
          else if (Uc(e24, a16, b2, c4, d8)) d8.stopPropagation();
          else if (Sc(a16, d8), b2 & 4 && -1 < Rc.indexOf(a16)) {
            for (; null !== e24; ) {
              var f11 = Cb(e24);
              null !== f11 && Ec(f11);
              f11 = Yc(a16, b2, c4, d8);
              null === f11 && hd(a16, b2, d8, id, c4);
              if (f11 === e24) break;
              e24 = f11;
            }
            null !== e24 && d8.stopPropagation();
          } else hd(a16, b2, d8, null, c4);
        }
      }
      var id = null;
      function Yc(a16, b2, c4, d8) {
        id = null;
        a16 = xb(d8);
        a16 = Wc(a16);
        if (null !== a16) if (b2 = Vb(a16), null === b2) a16 = null;
        else if (c4 = b2.tag, 13 === c4) {
          a16 = Wb(b2);
          if (null !== a16) return a16;
          a16 = null;
        } else if (3 === c4) {
          if (b2.stateNode.current.memoizedState.isDehydrated) return 3 === b2.tag ? b2.stateNode.containerInfo : null;
          a16 = null;
        } else b2 !== a16 && (a16 = null);
        id = a16;
        return null;
      }
      function jd(a16) {
        switch (a16) {
          case "cancel":
          case "click":
          case "close":
          case "contextmenu":
          case "copy":
          case "cut":
          case "auxclick":
          case "dblclick":
          case "dragend":
          case "dragstart":
          case "drop":
          case "focusin":
          case "focusout":
          case "input":
          case "invalid":
          case "keydown":
          case "keypress":
          case "keyup":
          case "mousedown":
          case "mouseup":
          case "paste":
          case "pause":
          case "play":
          case "pointercancel":
          case "pointerdown":
          case "pointerup":
          case "ratechange":
          case "reset":
          case "resize":
          case "seeked":
          case "submit":
          case "touchcancel":
          case "touchend":
          case "touchstart":
          case "volumechange":
          case "change":
          case "selectionchange":
          case "textInput":
          case "compositionstart":
          case "compositionend":
          case "compositionupdate":
          case "beforeblur":
          case "afterblur":
          case "beforeinput":
          case "blur":
          case "fullscreenchange":
          case "focus":
          case "hashchange":
          case "popstate":
          case "select":
          case "selectstart":
            return 1;
          case "drag":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "mousemove":
          case "mouseout":
          case "mouseover":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "scroll":
          case "toggle":
          case "touchmove":
          case "wheel":
          case "mouseenter":
          case "mouseleave":
          case "pointerenter":
          case "pointerleave":
            return 4;
          case "message":
            switch (ec()) {
              case fc:
                return 1;
              case gc:
                return 4;
              case hc:
              case ic:
                return 16;
              case jc:
                return 536870912;
              default:
                return 16;
            }
          default:
            return 16;
        }
      }
      var kd = null;
      var ld = null;
      var md = null;
      function nd() {
        if (md) return md;
        var a16, b2 = ld, c4 = b2.length, d8, e24 = "value" in kd ? kd.value : kd.textContent, f11 = e24.length;
        for (a16 = 0; a16 < c4 && b2[a16] === e24[a16]; a16++) ;
        var g3 = c4 - a16;
        for (d8 = 1; d8 <= g3 && b2[c4 - d8] === e24[f11 - d8]; d8++) ;
        return md = e24.slice(a16, 1 < d8 ? 1 - d8 : void 0);
      }
      function od(a16) {
        var b2 = a16.keyCode;
        "charCode" in a16 ? (a16 = a16.charCode, 0 === a16 && 13 === b2 && (a16 = 13)) : a16 = b2;
        10 === a16 && (a16 = 13);
        return 32 <= a16 || 13 === a16 ? a16 : 0;
      }
      function pd() {
        return true;
      }
      function qd() {
        return false;
      }
      function rd(a16) {
        function b2(b3, d8, e24, f11, g3) {
          this._reactName = b3;
          this._targetInst = e24;
          this.type = d8;
          this.nativeEvent = f11;
          this.target = g3;
          this.currentTarget = null;
          for (var c4 in a16) a16.hasOwnProperty(c4) && (b3 = a16[c4], this[c4] = b3 ? b3(f11) : f11[c4]);
          this.isDefaultPrevented = (null != f11.defaultPrevented ? f11.defaultPrevented : false === f11.returnValue) ? pd : qd;
          this.isPropagationStopped = qd;
          return this;
        }
        A2(b2.prototype, { preventDefault: function() {
          this.defaultPrevented = true;
          var a17 = this.nativeEvent;
          a17 && (a17.preventDefault ? a17.preventDefault() : "unknown" !== typeof a17.returnValue && (a17.returnValue = false), this.isDefaultPrevented = pd);
        }, stopPropagation: function() {
          var a17 = this.nativeEvent;
          a17 && (a17.stopPropagation ? a17.stopPropagation() : "unknown" !== typeof a17.cancelBubble && (a17.cancelBubble = true), this.isPropagationStopped = pd);
        }, persist: function() {
        }, isPersistent: pd });
        return b2;
      }
      var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a16) {
        return a16.timeStamp || Date.now();
      }, defaultPrevented: 0, isTrusted: 0 };
      var td = rd(sd);
      var ud = A2({}, sd, { view: 0, detail: 0 });
      var vd = rd(ud);
      var wd;
      var xd;
      var yd;
      var Ad = A2({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a16) {
        return void 0 === a16.relatedTarget ? a16.fromElement === a16.srcElement ? a16.toElement : a16.fromElement : a16.relatedTarget;
      }, movementX: function(a16) {
        if ("movementX" in a16) return a16.movementX;
        a16 !== yd && (yd && "mousemove" === a16.type ? (wd = a16.screenX - yd.screenX, xd = a16.screenY - yd.screenY) : xd = wd = 0, yd = a16);
        return wd;
      }, movementY: function(a16) {
        return "movementY" in a16 ? a16.movementY : xd;
      } });
      var Bd = rd(Ad);
      var Cd = A2({}, Ad, { dataTransfer: 0 });
      var Dd = rd(Cd);
      var Ed = A2({}, ud, { relatedTarget: 0 });
      var Fd = rd(Ed);
      var Gd = A2({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Hd = rd(Gd);
      var Id = A2({}, sd, { clipboardData: function(a16) {
        return "clipboardData" in a16 ? a16.clipboardData : window.clipboardData;
      } });
      var Jd = rd(Id);
      var Kd = A2({}, sd, { data: 0 });
      var Ld = rd(Kd);
      var Md = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
      };
      var Nd = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
      };
      var Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
      function Pd(a16) {
        var b2 = this.nativeEvent;
        return b2.getModifierState ? b2.getModifierState(a16) : (a16 = Od[a16]) ? !!b2[a16] : false;
      }
      function zd() {
        return Pd;
      }
      var Qd = A2({}, ud, { key: function(a16) {
        if (a16.key) {
          var b2 = Md[a16.key] || a16.key;
          if ("Unidentified" !== b2) return b2;
        }
        return "keypress" === a16.type ? (a16 = od(a16), 13 === a16 ? "Enter" : String.fromCharCode(a16)) : "keydown" === a16.type || "keyup" === a16.type ? Nd[a16.keyCode] || "Unidentified" : "";
      }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a16) {
        return "keypress" === a16.type ? od(a16) : 0;
      }, keyCode: function(a16) {
        return "keydown" === a16.type || "keyup" === a16.type ? a16.keyCode : 0;
      }, which: function(a16) {
        return "keypress" === a16.type ? od(a16) : "keydown" === a16.type || "keyup" === a16.type ? a16.keyCode : 0;
      } });
      var Rd = rd(Qd);
      var Sd = A2({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 });
      var Td = rd(Sd);
      var Ud = A2({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd });
      var Vd = rd(Ud);
      var Wd = A2({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Xd = rd(Wd);
      var Yd = A2({}, Ad, {
        deltaX: function(a16) {
          return "deltaX" in a16 ? a16.deltaX : "wheelDeltaX" in a16 ? -a16.wheelDeltaX : 0;
        },
        deltaY: function(a16) {
          return "deltaY" in a16 ? a16.deltaY : "wheelDeltaY" in a16 ? -a16.wheelDeltaY : "wheelDelta" in a16 ? -a16.wheelDelta : 0;
        },
        deltaZ: 0,
        deltaMode: 0
      });
      var Zd = rd(Yd);
      var $d = [9, 13, 27, 32];
      var ae = ia && "CompositionEvent" in window;
      var be = null;
      ia && "documentMode" in document && (be = document.documentMode);
      var ce = ia && "TextEvent" in window && !be;
      var de = ia && (!ae || be && 8 < be && 11 >= be);
      var ee = String.fromCharCode(32);
      var fe = false;
      function ge(a16, b2) {
        switch (a16) {
          case "keyup":
            return -1 !== $d.indexOf(b2.keyCode);
          case "keydown":
            return 229 !== b2.keyCode;
          case "keypress":
          case "mousedown":
          case "focusout":
            return true;
          default:
            return false;
        }
      }
      function he(a16) {
        a16 = a16.detail;
        return "object" === typeof a16 && "data" in a16 ? a16.data : null;
      }
      var ie = false;
      function je(a16, b2) {
        switch (a16) {
          case "compositionend":
            return he(b2);
          case "keypress":
            if (32 !== b2.which) return null;
            fe = true;
            return ee;
          case "textInput":
            return a16 = b2.data, a16 === ee && fe ? null : a16;
          default:
            return null;
        }
      }
      function ke(a16, b2) {
        if (ie) return "compositionend" === a16 || !ae && ge(a16, b2) ? (a16 = nd(), md = ld = kd = null, ie = false, a16) : null;
        switch (a16) {
          case "paste":
            return null;
          case "keypress":
            if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
              if (b2.char && 1 < b2.char.length) return b2.char;
              if (b2.which) return String.fromCharCode(b2.which);
            }
            return null;
          case "compositionend":
            return de && "ko" !== b2.locale ? null : b2.data;
          default:
            return null;
        }
      }
      var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
      function me(a16) {
        var b2 = a16 && a16.nodeName && a16.nodeName.toLowerCase();
        return "input" === b2 ? !!le[a16.type] : "textarea" === b2 ? true : false;
      }
      function ne(a16, b2, c4, d8) {
        Eb(d8);
        b2 = oe(b2, "onChange");
        0 < b2.length && (c4 = new td("onChange", "change", null, c4, d8), a16.push({ event: c4, listeners: b2 }));
      }
      var pe = null;
      var qe = null;
      function re(a16) {
        se(a16, 0);
      }
      function te(a16) {
        var b2 = ue(a16);
        if (Wa(b2)) return a16;
      }
      function ve(a16, b2) {
        if ("change" === a16) return b2;
      }
      var we = false;
      if (ia) {
        if (ia) {
          ye = "oninput" in document;
          if (!ye) {
            ze = document.createElement("div");
            ze.setAttribute("oninput", "return;");
            ye = "function" === typeof ze.oninput;
          }
          xe = ye;
        } else xe = false;
        we = xe && (!document.documentMode || 9 < document.documentMode);
      }
      var xe;
      var ye;
      var ze;
      function Ae() {
        pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
      }
      function Be(a16) {
        if ("value" === a16.propertyName && te(qe)) {
          var b2 = [];
          ne(b2, qe, a16, xb(a16));
          Jb(re, b2);
        }
      }
      function Ce(a16, b2, c4) {
        "focusin" === a16 ? (Ae(), pe = b2, qe = c4, pe.attachEvent("onpropertychange", Be)) : "focusout" === a16 && Ae();
      }
      function De(a16) {
        if ("selectionchange" === a16 || "keyup" === a16 || "keydown" === a16) return te(qe);
      }
      function Ee(a16, b2) {
        if ("click" === a16) return te(b2);
      }
      function Fe(a16, b2) {
        if ("input" === a16 || "change" === a16) return te(b2);
      }
      function Ge(a16, b2) {
        return a16 === b2 && (0 !== a16 || 1 / a16 === 1 / b2) || a16 !== a16 && b2 !== b2;
      }
      var He = "function" === typeof Object.is ? Object.is : Ge;
      function Ie(a16, b2) {
        if (He(a16, b2)) return true;
        if ("object" !== typeof a16 || null === a16 || "object" !== typeof b2 || null === b2) return false;
        var c4 = Object.keys(a16), d8 = Object.keys(b2);
        if (c4.length !== d8.length) return false;
        for (d8 = 0; d8 < c4.length; d8++) {
          var e24 = c4[d8];
          if (!ja.call(b2, e24) || !He(a16[e24], b2[e24])) return false;
        }
        return true;
      }
      function Je(a16) {
        for (; a16 && a16.firstChild; ) a16 = a16.firstChild;
        return a16;
      }
      function Ke(a16, b2) {
        var c4 = Je(a16);
        a16 = 0;
        for (var d8; c4; ) {
          if (3 === c4.nodeType) {
            d8 = a16 + c4.textContent.length;
            if (a16 <= b2 && d8 >= b2) return { node: c4, offset: b2 - a16 };
            a16 = d8;
          }
          a: {
            for (; c4; ) {
              if (c4.nextSibling) {
                c4 = c4.nextSibling;
                break a;
              }
              c4 = c4.parentNode;
            }
            c4 = void 0;
          }
          c4 = Je(c4);
        }
      }
      function Le(a16, b2) {
        return a16 && b2 ? a16 === b2 ? true : a16 && 3 === a16.nodeType ? false : b2 && 3 === b2.nodeType ? Le(a16, b2.parentNode) : "contains" in a16 ? a16.contains(b2) : a16.compareDocumentPosition ? !!(a16.compareDocumentPosition(b2) & 16) : false : false;
      }
      function Me() {
        for (var a16 = window, b2 = Xa(); b2 instanceof a16.HTMLIFrameElement; ) {
          try {
            var c4 = "string" === typeof b2.contentWindow.location.href;
          } catch (d8) {
            c4 = false;
          }
          if (c4) a16 = b2.contentWindow;
          else break;
          b2 = Xa(a16.document);
        }
        return b2;
      }
      function Ne(a16) {
        var b2 = a16 && a16.nodeName && a16.nodeName.toLowerCase();
        return b2 && ("input" === b2 && ("text" === a16.type || "search" === a16.type || "tel" === a16.type || "url" === a16.type || "password" === a16.type) || "textarea" === b2 || "true" === a16.contentEditable);
      }
      function Oe(a16) {
        var b2 = Me(), c4 = a16.focusedElem, d8 = a16.selectionRange;
        if (b2 !== c4 && c4 && c4.ownerDocument && Le(c4.ownerDocument.documentElement, c4)) {
          if (null !== d8 && Ne(c4)) {
            if (b2 = d8.start, a16 = d8.end, void 0 === a16 && (a16 = b2), "selectionStart" in c4) c4.selectionStart = b2, c4.selectionEnd = Math.min(a16, c4.value.length);
            else if (a16 = (b2 = c4.ownerDocument || document) && b2.defaultView || window, a16.getSelection) {
              a16 = a16.getSelection();
              var e24 = c4.textContent.length, f11 = Math.min(d8.start, e24);
              d8 = void 0 === d8.end ? f11 : Math.min(d8.end, e24);
              !a16.extend && f11 > d8 && (e24 = d8, d8 = f11, f11 = e24);
              e24 = Ke(c4, f11);
              var g3 = Ke(
                c4,
                d8
              );
              e24 && g3 && (1 !== a16.rangeCount || a16.anchorNode !== e24.node || a16.anchorOffset !== e24.offset || a16.focusNode !== g3.node || a16.focusOffset !== g3.offset) && (b2 = b2.createRange(), b2.setStart(e24.node, e24.offset), a16.removeAllRanges(), f11 > d8 ? (a16.addRange(b2), a16.extend(g3.node, g3.offset)) : (b2.setEnd(g3.node, g3.offset), a16.addRange(b2)));
            }
          }
          b2 = [];
          for (a16 = c4; a16 = a16.parentNode; ) 1 === a16.nodeType && b2.push({ element: a16, left: a16.scrollLeft, top: a16.scrollTop });
          "function" === typeof c4.focus && c4.focus();
          for (c4 = 0; c4 < b2.length; c4++) a16 = b2[c4], a16.element.scrollLeft = a16.left, a16.element.scrollTop = a16.top;
        }
      }
      var Pe = ia && "documentMode" in document && 11 >= document.documentMode;
      var Qe = null;
      var Re = null;
      var Se = null;
      var Te = false;
      function Ue(a16, b2, c4) {
        var d8 = c4.window === c4 ? c4.document : 9 === c4.nodeType ? c4 : c4.ownerDocument;
        Te || null == Qe || Qe !== Xa(d8) || (d8 = Qe, "selectionStart" in d8 && Ne(d8) ? d8 = { start: d8.selectionStart, end: d8.selectionEnd } : (d8 = (d8.ownerDocument && d8.ownerDocument.defaultView || window).getSelection(), d8 = { anchorNode: d8.anchorNode, anchorOffset: d8.anchorOffset, focusNode: d8.focusNode, focusOffset: d8.focusOffset }), Se && Ie(Se, d8) || (Se = d8, d8 = oe(Re, "onSelect"), 0 < d8.length && (b2 = new td("onSelect", "select", null, b2, c4), a16.push({ event: b2, listeners: d8 }), b2.target = Qe)));
      }
      function Ve(a16, b2) {
        var c4 = {};
        c4[a16.toLowerCase()] = b2.toLowerCase();
        c4["Webkit" + a16] = "webkit" + b2;
        c4["Moz" + a16] = "moz" + b2;
        return c4;
      }
      var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") };
      var Xe = {};
      var Ye = {};
      ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
      function Ze(a16) {
        if (Xe[a16]) return Xe[a16];
        if (!We[a16]) return a16;
        var b2 = We[a16], c4;
        for (c4 in b2) if (b2.hasOwnProperty(c4) && c4 in Ye) return Xe[a16] = b2[c4];
        return a16;
      }
      var $e = Ze("animationend");
      var af = Ze("animationiteration");
      var bf = Ze("animationstart");
      var cf = Ze("transitionend");
      var df = /* @__PURE__ */ new Map();
      var ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
      function ff(a16, b2) {
        df.set(a16, b2);
        fa(b2, [a16]);
      }
      for (gf = 0; gf < ef.length; gf++) {
        hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
        ff(jf, "on" + kf);
      }
      var hf;
      var jf;
      var kf;
      var gf;
      ff($e, "onAnimationEnd");
      ff(af, "onAnimationIteration");
      ff(bf, "onAnimationStart");
      ff("dblclick", "onDoubleClick");
      ff("focusin", "onFocus");
      ff("focusout", "onBlur");
      ff(cf, "onTransitionEnd");
      ha("onMouseEnter", ["mouseout", "mouseover"]);
      ha("onMouseLeave", ["mouseout", "mouseover"]);
      ha("onPointerEnter", ["pointerout", "pointerover"]);
      ha("onPointerLeave", ["pointerout", "pointerover"]);
      fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
      fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
      fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
      fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
      var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
      var mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
      function nf(a16, b2, c4) {
        var d8 = a16.type || "unknown-event";
        a16.currentTarget = c4;
        Ub(d8, b2, void 0, a16);
        a16.currentTarget = null;
      }
      function se(a16, b2) {
        b2 = 0 !== (b2 & 4);
        for (var c4 = 0; c4 < a16.length; c4++) {
          var d8 = a16[c4], e24 = d8.event;
          d8 = d8.listeners;
          a: {
            var f11 = void 0;
            if (b2) for (var g3 = d8.length - 1; 0 <= g3; g3--) {
              var h = d8[g3], k = h.instance, l7 = h.currentTarget;
              h = h.listener;
              if (k !== f11 && e24.isPropagationStopped()) break a;
              nf(e24, h, l7);
              f11 = k;
            }
            else for (g3 = 0; g3 < d8.length; g3++) {
              h = d8[g3];
              k = h.instance;
              l7 = h.currentTarget;
              h = h.listener;
              if (k !== f11 && e24.isPropagationStopped()) break a;
              nf(e24, h, l7);
              f11 = k;
            }
          }
        }
        if (Qb) throw a16 = Rb, Qb = false, Rb = null, a16;
      }
      function D2(a16, b2) {
        var c4 = b2[of];
        void 0 === c4 && (c4 = b2[of] = /* @__PURE__ */ new Set());
        var d8 = a16 + "__bubble";
        c4.has(d8) || (pf(b2, a16, 2, false), c4.add(d8));
      }
      function qf(a16, b2, c4) {
        var d8 = 0;
        b2 && (d8 |= 4);
        pf(c4, a16, d8, b2);
      }
      var rf = "_reactListening" + Math.random().toString(36).slice(2);
      function sf(a16) {
        if (!a16[rf]) {
          a16[rf] = true;
          da.forEach(function(b3) {
            "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a16), qf(b3, true, a16));
          });
          var b2 = 9 === a16.nodeType ? a16 : a16.ownerDocument;
          null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
        }
      }
      function pf(a16, b2, c4, d8) {
        switch (jd(b2)) {
          case 1:
            var e24 = ed;
            break;
          case 4:
            e24 = gd;
            break;
          default:
            e24 = fd;
        }
        c4 = e24.bind(null, b2, c4, a16);
        e24 = void 0;
        !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e24 = true);
        d8 ? void 0 !== e24 ? a16.addEventListener(b2, c4, { capture: true, passive: e24 }) : a16.addEventListener(b2, c4, true) : void 0 !== e24 ? a16.addEventListener(b2, c4, { passive: e24 }) : a16.addEventListener(b2, c4, false);
      }
      function hd(a16, b2, c4, d8, e24) {
        var f11 = d8;
        if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d8) a: for (; ; ) {
          if (null === d8) return;
          var g3 = d8.tag;
          if (3 === g3 || 4 === g3) {
            var h = d8.stateNode.containerInfo;
            if (h === e24 || 8 === h.nodeType && h.parentNode === e24) break;
            if (4 === g3) for (g3 = d8.return; null !== g3; ) {
              var k = g3.tag;
              if (3 === k || 4 === k) {
                if (k = g3.stateNode.containerInfo, k === e24 || 8 === k.nodeType && k.parentNode === e24) return;
              }
              g3 = g3.return;
            }
            for (; null !== h; ) {
              g3 = Wc(h);
              if (null === g3) return;
              k = g3.tag;
              if (5 === k || 6 === k) {
                d8 = f11 = g3;
                continue a;
              }
              h = h.parentNode;
            }
          }
          d8 = d8.return;
        }
        Jb(function() {
          var d9 = f11, e25 = xb(c4), g4 = [];
          a: {
            var h2 = df.get(a16);
            if (void 0 !== h2) {
              var k2 = td, n12 = a16;
              switch (a16) {
                case "keypress":
                  if (0 === od(c4)) break a;
                case "keydown":
                case "keyup":
                  k2 = Rd;
                  break;
                case "focusin":
                  n12 = "focus";
                  k2 = Fd;
                  break;
                case "focusout":
                  n12 = "blur";
                  k2 = Fd;
                  break;
                case "beforeblur":
                case "afterblur":
                  k2 = Fd;
                  break;
                case "click":
                  if (2 === c4.button) break a;
                case "auxclick":
                case "dblclick":
                case "mousedown":
                case "mousemove":
                case "mouseup":
                case "mouseout":
                case "mouseover":
                case "contextmenu":
                  k2 = Bd;
                  break;
                case "drag":
                case "dragend":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "dragstart":
                case "drop":
                  k2 = Dd;
                  break;
                case "touchcancel":
                case "touchend":
                case "touchmove":
                case "touchstart":
                  k2 = Vd;
                  break;
                case $e:
                case af:
                case bf:
                  k2 = Hd;
                  break;
                case cf:
                  k2 = Xd;
                  break;
                case "scroll":
                  k2 = vd;
                  break;
                case "wheel":
                  k2 = Zd;
                  break;
                case "copy":
                case "cut":
                case "paste":
                  k2 = Jd;
                  break;
                case "gotpointercapture":
                case "lostpointercapture":
                case "pointercancel":
                case "pointerdown":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "pointerup":
                  k2 = Td;
              }
              var t15 = 0 !== (b2 & 4), J = !t15 && "scroll" === a16, x2 = t15 ? null !== h2 ? h2 + "Capture" : null : h2;
              t15 = [];
              for (var w = d9, u5; null !== w; ) {
                u5 = w;
                var F = u5.stateNode;
                5 === u5.tag && null !== F && (u5 = F, null !== x2 && (F = Kb(w, x2), null != F && t15.push(tf(w, F, u5))));
                if (J) break;
                w = w.return;
              }
              0 < t15.length && (h2 = new k2(h2, n12, null, c4, e25), g4.push({ event: h2, listeners: t15 }));
            }
          }
          if (0 === (b2 & 7)) {
            a: {
              h2 = "mouseover" === a16 || "pointerover" === a16;
              k2 = "mouseout" === a16 || "pointerout" === a16;
              if (h2 && c4 !== wb && (n12 = c4.relatedTarget || c4.fromElement) && (Wc(n12) || n12[uf])) break a;
              if (k2 || h2) {
                h2 = e25.window === e25 ? e25 : (h2 = e25.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
                if (k2) {
                  if (n12 = c4.relatedTarget || c4.toElement, k2 = d9, n12 = n12 ? Wc(n12) : null, null !== n12 && (J = Vb(n12), n12 !== J || 5 !== n12.tag && 6 !== n12.tag)) n12 = null;
                } else k2 = null, n12 = d9;
                if (k2 !== n12) {
                  t15 = Bd;
                  F = "onMouseLeave";
                  x2 = "onMouseEnter";
                  w = "mouse";
                  if ("pointerout" === a16 || "pointerover" === a16) t15 = Td, F = "onPointerLeave", x2 = "onPointerEnter", w = "pointer";
                  J = null == k2 ? h2 : ue(k2);
                  u5 = null == n12 ? h2 : ue(n12);
                  h2 = new t15(F, w + "leave", k2, c4, e25);
                  h2.target = J;
                  h2.relatedTarget = u5;
                  F = null;
                  Wc(e25) === d9 && (t15 = new t15(x2, w + "enter", n12, c4, e25), t15.target = u5, t15.relatedTarget = J, F = t15);
                  J = F;
                  if (k2 && n12) b: {
                    t15 = k2;
                    x2 = n12;
                    w = 0;
                    for (u5 = t15; u5; u5 = vf(u5)) w++;
                    u5 = 0;
                    for (F = x2; F; F = vf(F)) u5++;
                    for (; 0 < w - u5; ) t15 = vf(t15), w--;
                    for (; 0 < u5 - w; ) x2 = vf(x2), u5--;
                    for (; w--; ) {
                      if (t15 === x2 || null !== x2 && t15 === x2.alternate) break b;
                      t15 = vf(t15);
                      x2 = vf(x2);
                    }
                    t15 = null;
                  }
                  else t15 = null;
                  null !== k2 && wf(g4, h2, k2, t15, false);
                  null !== n12 && null !== J && wf(g4, J, n12, t15, true);
                }
              }
            }
            a: {
              h2 = d9 ? ue(d9) : window;
              k2 = h2.nodeName && h2.nodeName.toLowerCase();
              if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve;
              else if (me(h2)) if (we) na = Fe;
              else {
                na = De;
                var xa = Ce;
              }
              else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
              if (na && (na = na(a16, d9))) {
                ne(g4, na, c4, e25);
                break a;
              }
              xa && xa(a16, h2, d9);
              "focusout" === a16 && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
            }
            xa = d9 ? ue(d9) : window;
            switch (a16) {
              case "focusin":
                if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d9, Se = null;
                break;
              case "focusout":
                Se = Re = Qe = null;
                break;
              case "mousedown":
                Te = true;
                break;
              case "contextmenu":
              case "mouseup":
              case "dragend":
                Te = false;
                Ue(g4, c4, e25);
                break;
              case "selectionchange":
                if (Pe) break;
              case "keydown":
              case "keyup":
                Ue(g4, c4, e25);
            }
            var $a;
            if (ae) b: {
              switch (a16) {
                case "compositionstart":
                  var ba = "onCompositionStart";
                  break b;
                case "compositionend":
                  ba = "onCompositionEnd";
                  break b;
                case "compositionupdate":
                  ba = "onCompositionUpdate";
                  break b;
              }
              ba = void 0;
            }
            else ie ? ge(a16, c4) && (ba = "onCompositionEnd") : "keydown" === a16 && 229 === c4.keyCode && (ba = "onCompositionStart");
            ba && (de && "ko" !== c4.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e25, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d9, ba), 0 < xa.length && (ba = new Ld(ba, a16, null, c4, e25), g4.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c4), null !== $a && (ba.data = $a))));
            if ($a = ce ? je(a16, c4) : ke(a16, c4)) d9 = oe(d9, "onBeforeInput"), 0 < d9.length && (e25 = new Ld("onBeforeInput", "beforeinput", null, c4, e25), g4.push({ event: e25, listeners: d9 }), e25.data = $a);
          }
          se(g4, b2);
        });
      }
      function tf(a16, b2, c4) {
        return { instance: a16, listener: b2, currentTarget: c4 };
      }
      function oe(a16, b2) {
        for (var c4 = b2 + "Capture", d8 = []; null !== a16; ) {
          var e24 = a16, f11 = e24.stateNode;
          5 === e24.tag && null !== f11 && (e24 = f11, f11 = Kb(a16, c4), null != f11 && d8.unshift(tf(a16, f11, e24)), f11 = Kb(a16, b2), null != f11 && d8.push(tf(a16, f11, e24)));
          a16 = a16.return;
        }
        return d8;
      }
      function vf(a16) {
        if (null === a16) return null;
        do
          a16 = a16.return;
        while (a16 && 5 !== a16.tag);
        return a16 ? a16 : null;
      }
      function wf(a16, b2, c4, d8, e24) {
        for (var f11 = b2._reactName, g3 = []; null !== c4 && c4 !== d8; ) {
          var h = c4, k = h.alternate, l7 = h.stateNode;
          if (null !== k && k === d8) break;
          5 === h.tag && null !== l7 && (h = l7, e24 ? (k = Kb(c4, f11), null != k && g3.unshift(tf(c4, k, h))) : e24 || (k = Kb(c4, f11), null != k && g3.push(tf(c4, k, h))));
          c4 = c4.return;
        }
        0 !== g3.length && a16.push({ event: b2, listeners: g3 });
      }
      var xf = /\r\n?/g;
      var yf = /\u0000|\uFFFD/g;
      function zf(a16) {
        return ("string" === typeof a16 ? a16 : "" + a16).replace(xf, "\n").replace(yf, "");
      }
      function Af(a16, b2, c4) {
        b2 = zf(b2);
        if (zf(a16) !== b2 && c4) throw Error(p14(425));
      }
      function Bf() {
      }
      var Cf = null;
      var Df = null;
      function Ef(a16, b2) {
        return "textarea" === a16 || "noscript" === a16 || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
      }
      var Ff = "function" === typeof setTimeout ? setTimeout : void 0;
      var Gf = "function" === typeof clearTimeout ? clearTimeout : void 0;
      var Hf = "function" === typeof Promise ? Promise : void 0;
      var Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a16) {
        return Hf.resolve(null).then(a16).catch(If);
      } : Ff;
      function If(a16) {
        setTimeout(function() {
          throw a16;
        });
      }
      function Kf(a16, b2) {
        var c4 = b2, d8 = 0;
        do {
          var e24 = c4.nextSibling;
          a16.removeChild(c4);
          if (e24 && 8 === e24.nodeType) if (c4 = e24.data, "/$" === c4) {
            if (0 === d8) {
              a16.removeChild(e24);
              bd(b2);
              return;
            }
            d8--;
          } else "$" !== c4 && "$?" !== c4 && "$!" !== c4 || d8++;
          c4 = e24;
        } while (c4);
        bd(b2);
      }
      function Lf(a16) {
        for (; null != a16; a16 = a16.nextSibling) {
          var b2 = a16.nodeType;
          if (1 === b2 || 3 === b2) break;
          if (8 === b2) {
            b2 = a16.data;
            if ("$" === b2 || "$!" === b2 || "$?" === b2) break;
            if ("/$" === b2) return null;
          }
        }
        return a16;
      }
      function Mf(a16) {
        a16 = a16.previousSibling;
        for (var b2 = 0; a16; ) {
          if (8 === a16.nodeType) {
            var c4 = a16.data;
            if ("$" === c4 || "$!" === c4 || "$?" === c4) {
              if (0 === b2) return a16;
              b2--;
            } else "/$" === c4 && b2++;
          }
          a16 = a16.previousSibling;
        }
        return null;
      }
      var Nf = Math.random().toString(36).slice(2);
      var Of = "__reactFiber$" + Nf;
      var Pf = "__reactProps$" + Nf;
      var uf = "__reactContainer$" + Nf;
      var of = "__reactEvents$" + Nf;
      var Qf = "__reactListeners$" + Nf;
      var Rf = "__reactHandles$" + Nf;
      function Wc(a16) {
        var b2 = a16[Of];
        if (b2) return b2;
        for (var c4 = a16.parentNode; c4; ) {
          if (b2 = c4[uf] || c4[Of]) {
            c4 = b2.alternate;
            if (null !== b2.child || null !== c4 && null !== c4.child) for (a16 = Mf(a16); null !== a16; ) {
              if (c4 = a16[Of]) return c4;
              a16 = Mf(a16);
            }
            return b2;
          }
          a16 = c4;
          c4 = a16.parentNode;
        }
        return null;
      }
      function Cb(a16) {
        a16 = a16[Of] || a16[uf];
        return !a16 || 5 !== a16.tag && 6 !== a16.tag && 13 !== a16.tag && 3 !== a16.tag ? null : a16;
      }
      function ue(a16) {
        if (5 === a16.tag || 6 === a16.tag) return a16.stateNode;
        throw Error(p14(33));
      }
      function Db(a16) {
        return a16[Pf] || null;
      }
      var Sf = [];
      var Tf = -1;
      function Uf(a16) {
        return { current: a16 };
      }
      function E2(a16) {
        0 > Tf || (a16.current = Sf[Tf], Sf[Tf] = null, Tf--);
      }
      function G(a16, b2) {
        Tf++;
        Sf[Tf] = a16.current;
        a16.current = b2;
      }
      var Vf = {};
      var H2 = Uf(Vf);
      var Wf = Uf(false);
      var Xf = Vf;
      function Yf(a16, b2) {
        var c4 = a16.type.contextTypes;
        if (!c4) return Vf;
        var d8 = a16.stateNode;
        if (d8 && d8.__reactInternalMemoizedUnmaskedChildContext === b2) return d8.__reactInternalMemoizedMaskedChildContext;
        var e24 = {}, f11;
        for (f11 in c4) e24[f11] = b2[f11];
        d8 && (a16 = a16.stateNode, a16.__reactInternalMemoizedUnmaskedChildContext = b2, a16.__reactInternalMemoizedMaskedChildContext = e24);
        return e24;
      }
      function Zf(a16) {
        a16 = a16.childContextTypes;
        return null !== a16 && void 0 !== a16;
      }
      function $f() {
        E2(Wf);
        E2(H2);
      }
      function ag(a16, b2, c4) {
        if (H2.current !== Vf) throw Error(p14(168));
        G(H2, b2);
        G(Wf, c4);
      }
      function bg(a16, b2, c4) {
        var d8 = a16.stateNode;
        b2 = b2.childContextTypes;
        if ("function" !== typeof d8.getChildContext) return c4;
        d8 = d8.getChildContext();
        for (var e24 in d8) if (!(e24 in b2)) throw Error(p14(108, Ra(a16) || "Unknown", e24));
        return A2({}, c4, d8);
      }
      function cg(a16) {
        a16 = (a16 = a16.stateNode) && a16.__reactInternalMemoizedMergedChildContext || Vf;
        Xf = H2.current;
        G(H2, a16);
        G(Wf, Wf.current);
        return true;
      }
      function dg(a16, b2, c4) {
        var d8 = a16.stateNode;
        if (!d8) throw Error(p14(169));
        c4 ? (a16 = bg(a16, b2, Xf), d8.__reactInternalMemoizedMergedChildContext = a16, E2(Wf), E2(H2), G(H2, a16)) : E2(Wf);
        G(Wf, c4);
      }
      var eg = null;
      var fg = false;
      var gg = false;
      function hg(a16) {
        null === eg ? eg = [a16] : eg.push(a16);
      }
      function ig(a16) {
        fg = true;
        hg(a16);
      }
      function jg() {
        if (!gg && null !== eg) {
          gg = true;
          var a16 = 0, b2 = C;
          try {
            var c4 = eg;
            for (C = 1; a16 < c4.length; a16++) {
              var d8 = c4[a16];
              do
                d8 = d8(true);
              while (null !== d8);
            }
            eg = null;
            fg = false;
          } catch (e24) {
            throw null !== eg && (eg = eg.slice(a16 + 1)), ac(fc, jg), e24;
          } finally {
            C = b2, gg = false;
          }
        }
        return null;
      }
      var kg = [];
      var lg = 0;
      var mg = null;
      var ng = 0;
      var og = [];
      var pg = 0;
      var qg = null;
      var rg = 1;
      var sg = "";
      function tg(a16, b2) {
        kg[lg++] = ng;
        kg[lg++] = mg;
        mg = a16;
        ng = b2;
      }
      function ug(a16, b2, c4) {
        og[pg++] = rg;
        og[pg++] = sg;
        og[pg++] = qg;
        qg = a16;
        var d8 = rg;
        a16 = sg;
        var e24 = 32 - oc(d8) - 1;
        d8 &= ~(1 << e24);
        c4 += 1;
        var f11 = 32 - oc(b2) + e24;
        if (30 < f11) {
          var g3 = e24 - e24 % 5;
          f11 = (d8 & (1 << g3) - 1).toString(32);
          d8 >>= g3;
          e24 -= g3;
          rg = 1 << 32 - oc(b2) + e24 | c4 << e24 | d8;
          sg = f11 + a16;
        } else rg = 1 << f11 | c4 << e24 | d8, sg = a16;
      }
      function vg(a16) {
        null !== a16.return && (tg(a16, 1), ug(a16, 1, 0));
      }
      function wg(a16) {
        for (; a16 === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
        for (; a16 === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
      }
      var xg = null;
      var yg = null;
      var I2 = false;
      var zg = null;
      function Ag(a16, b2) {
        var c4 = Bg(5, null, null, 0);
        c4.elementType = "DELETED";
        c4.stateNode = b2;
        c4.return = a16;
        b2 = a16.deletions;
        null === b2 ? (a16.deletions = [c4], a16.flags |= 16) : b2.push(c4);
      }
      function Cg(a16, b2) {
        switch (a16.tag) {
          case 5:
            var c4 = a16.type;
            b2 = 1 !== b2.nodeType || c4.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
            return null !== b2 ? (a16.stateNode = b2, xg = a16, yg = Lf(b2.firstChild), true) : false;
          case 6:
            return b2 = "" === a16.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a16.stateNode = b2, xg = a16, yg = null, true) : false;
          case 13:
            return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c4 = null !== qg ? { id: rg, overflow: sg } : null, a16.memoizedState = { dehydrated: b2, treeContext: c4, retryLane: 1073741824 }, c4 = Bg(18, null, null, 0), c4.stateNode = b2, c4.return = a16, a16.child = c4, xg = a16, yg = null, true) : false;
          default:
            return false;
        }
      }
      function Dg(a16) {
        return 0 !== (a16.mode & 1) && 0 === (a16.flags & 128);
      }
      function Eg(a16) {
        if (I2) {
          var b2 = yg;
          if (b2) {
            var c4 = b2;
            if (!Cg(a16, b2)) {
              if (Dg(a16)) throw Error(p14(418));
              b2 = Lf(c4.nextSibling);
              var d8 = xg;
              b2 && Cg(a16, b2) ? Ag(d8, c4) : (a16.flags = a16.flags & -4097 | 2, I2 = false, xg = a16);
            }
          } else {
            if (Dg(a16)) throw Error(p14(418));
            a16.flags = a16.flags & -4097 | 2;
            I2 = false;
            xg = a16;
          }
        }
      }
      function Fg(a16) {
        for (a16 = a16.return; null !== a16 && 5 !== a16.tag && 3 !== a16.tag && 13 !== a16.tag; ) a16 = a16.return;
        xg = a16;
      }
      function Gg(a16) {
        if (a16 !== xg) return false;
        if (!I2) return Fg(a16), I2 = true, false;
        var b2;
        (b2 = 3 !== a16.tag) && !(b2 = 5 !== a16.tag) && (b2 = a16.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a16.type, a16.memoizedProps));
        if (b2 && (b2 = yg)) {
          if (Dg(a16)) throw Hg(), Error(p14(418));
          for (; b2; ) Ag(a16, b2), b2 = Lf(b2.nextSibling);
        }
        Fg(a16);
        if (13 === a16.tag) {
          a16 = a16.memoizedState;
          a16 = null !== a16 ? a16.dehydrated : null;
          if (!a16) throw Error(p14(317));
          a: {
            a16 = a16.nextSibling;
            for (b2 = 0; a16; ) {
              if (8 === a16.nodeType) {
                var c4 = a16.data;
                if ("/$" === c4) {
                  if (0 === b2) {
                    yg = Lf(a16.nextSibling);
                    break a;
                  }
                  b2--;
                } else "$" !== c4 && "$!" !== c4 && "$?" !== c4 || b2++;
              }
              a16 = a16.nextSibling;
            }
            yg = null;
          }
        } else yg = xg ? Lf(a16.stateNode.nextSibling) : null;
        return true;
      }
      function Hg() {
        for (var a16 = yg; a16; ) a16 = Lf(a16.nextSibling);
      }
      function Ig() {
        yg = xg = null;
        I2 = false;
      }
      function Jg(a16) {
        null === zg ? zg = [a16] : zg.push(a16);
      }
      var Kg = ua.ReactCurrentBatchConfig;
      function Lg(a16, b2, c4) {
        a16 = c4.ref;
        if (null !== a16 && "function" !== typeof a16 && "object" !== typeof a16) {
          if (c4._owner) {
            c4 = c4._owner;
            if (c4) {
              if (1 !== c4.tag) throw Error(p14(309));
              var d8 = c4.stateNode;
            }
            if (!d8) throw Error(p14(147, a16));
            var e24 = d8, f11 = "" + a16;
            if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f11) return b2.ref;
            b2 = function(a17) {
              var b3 = e24.refs;
              null === a17 ? delete b3[f11] : b3[f11] = a17;
            };
            b2._stringRef = f11;
            return b2;
          }
          if ("string" !== typeof a16) throw Error(p14(284));
          if (!c4._owner) throw Error(p14(290, a16));
        }
        return a16;
      }
      function Mg(a16, b2) {
        a16 = Object.prototype.toString.call(b2);
        throw Error(p14(31, "[object Object]" === a16 ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a16));
      }
      function Ng(a16) {
        var b2 = a16._init;
        return b2(a16._payload);
      }
      function Og(a16) {
        function b2(b3, c5) {
          if (a16) {
            var d9 = b3.deletions;
            null === d9 ? (b3.deletions = [c5], b3.flags |= 16) : d9.push(c5);
          }
        }
        function c4(c5, d9) {
          if (!a16) return null;
          for (; null !== d9; ) b2(c5, d9), d9 = d9.sibling;
          return null;
        }
        function d8(a17, b3) {
          for (a17 = /* @__PURE__ */ new Map(); null !== b3; ) null !== b3.key ? a17.set(b3.key, b3) : a17.set(b3.index, b3), b3 = b3.sibling;
          return a17;
        }
        function e24(a17, b3) {
          a17 = Pg(a17, b3);
          a17.index = 0;
          a17.sibling = null;
          return a17;
        }
        function f11(b3, c5, d9) {
          b3.index = d9;
          if (!a16) return b3.flags |= 1048576, c5;
          d9 = b3.alternate;
          if (null !== d9) return d9 = d9.index, d9 < c5 ? (b3.flags |= 2, c5) : d9;
          b3.flags |= 2;
          return c5;
        }
        function g3(b3) {
          a16 && null === b3.alternate && (b3.flags |= 2);
          return b3;
        }
        function h(a17, b3, c5, d9) {
          if (null === b3 || 6 !== b3.tag) return b3 = Qg(c5, a17.mode, d9), b3.return = a17, b3;
          b3 = e24(b3, c5);
          b3.return = a17;
          return b3;
        }
        function k(a17, b3, c5, d9) {
          var f12 = c5.type;
          if (f12 === ya) return m6(a17, b3, c5.props.children, d9, c5.key);
          if (null !== b3 && (b3.elementType === f12 || "object" === typeof f12 && null !== f12 && f12.$$typeof === Ha && Ng(f12) === b3.type)) return d9 = e24(b3, c5.props), d9.ref = Lg(a17, b3, c5), d9.return = a17, d9;
          d9 = Rg(c5.type, c5.key, c5.props, null, a17.mode, d9);
          d9.ref = Lg(a17, b3, c5);
          d9.return = a17;
          return d9;
        }
        function l7(a17, b3, c5, d9) {
          if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c5.containerInfo || b3.stateNode.implementation !== c5.implementation) return b3 = Sg(c5, a17.mode, d9), b3.return = a17, b3;
          b3 = e24(b3, c5.children || []);
          b3.return = a17;
          return b3;
        }
        function m6(a17, b3, c5, d9, f12) {
          if (null === b3 || 7 !== b3.tag) return b3 = Tg(c5, a17.mode, d9, f12), b3.return = a17, b3;
          b3 = e24(b3, c5);
          b3.return = a17;
          return b3;
        }
        function q(a17, b3, c5) {
          if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3) return b3 = Qg("" + b3, a17.mode, c5), b3.return = a17, b3;
          if ("object" === typeof b3 && null !== b3) {
            switch (b3.$$typeof) {
              case va:
                return c5 = Rg(b3.type, b3.key, b3.props, null, a17.mode, c5), c5.ref = Lg(a17, null, b3), c5.return = a17, c5;
              case wa:
                return b3 = Sg(b3, a17.mode, c5), b3.return = a17, b3;
              case Ha:
                var d9 = b3._init;
                return q(a17, d9(b3._payload), c5);
            }
            if (eb(b3) || Ka(b3)) return b3 = Tg(b3, a17.mode, c5, null), b3.return = a17, b3;
            Mg(a17, b3);
          }
          return null;
        }
        function r25(a17, b3, c5, d9) {
          var e25 = null !== b3 ? b3.key : null;
          if ("string" === typeof c5 && "" !== c5 || "number" === typeof c5) return null !== e25 ? null : h(a17, b3, "" + c5, d9);
          if ("object" === typeof c5 && null !== c5) {
            switch (c5.$$typeof) {
              case va:
                return c5.key === e25 ? k(a17, b3, c5, d9) : null;
              case wa:
                return c5.key === e25 ? l7(a17, b3, c5, d9) : null;
              case Ha:
                return e25 = c5._init, r25(
                  a17,
                  b3,
                  e25(c5._payload),
                  d9
                );
            }
            if (eb(c5) || Ka(c5)) return null !== e25 ? null : m6(a17, b3, c5, d9, null);
            Mg(a17, c5);
          }
          return null;
        }
        function y(a17, b3, c5, d9, e25) {
          if ("string" === typeof d9 && "" !== d9 || "number" === typeof d9) return a17 = a17.get(c5) || null, h(b3, a17, "" + d9, e25);
          if ("object" === typeof d9 && null !== d9) {
            switch (d9.$$typeof) {
              case va:
                return a17 = a17.get(null === d9.key ? c5 : d9.key) || null, k(b3, a17, d9, e25);
              case wa:
                return a17 = a17.get(null === d9.key ? c5 : d9.key) || null, l7(b3, a17, d9, e25);
              case Ha:
                var f12 = d9._init;
                return y(a17, b3, c5, f12(d9._payload), e25);
            }
            if (eb(d9) || Ka(d9)) return a17 = a17.get(c5) || null, m6(b3, a17, d9, e25, null);
            Mg(b3, d9);
          }
          return null;
        }
        function n12(e25, g4, h2, k2) {
          for (var l8 = null, m7 = null, u5 = g4, w = g4 = 0, x2 = null; null !== u5 && w < h2.length; w++) {
            u5.index > w ? (x2 = u5, u5 = null) : x2 = u5.sibling;
            var n13 = r25(e25, u5, h2[w], k2);
            if (null === n13) {
              null === u5 && (u5 = x2);
              break;
            }
            a16 && u5 && null === n13.alternate && b2(e25, u5);
            g4 = f11(n13, g4, w);
            null === m7 ? l8 = n13 : m7.sibling = n13;
            m7 = n13;
            u5 = x2;
          }
          if (w === h2.length) return c4(e25, u5), I2 && tg(e25, w), l8;
          if (null === u5) {
            for (; w < h2.length; w++) u5 = q(e25, h2[w], k2), null !== u5 && (g4 = f11(u5, g4, w), null === m7 ? l8 = u5 : m7.sibling = u5, m7 = u5);
            I2 && tg(e25, w);
            return l8;
          }
          for (u5 = d8(e25, u5); w < h2.length; w++) x2 = y(u5, e25, w, h2[w], k2), null !== x2 && (a16 && null !== x2.alternate && u5.delete(null === x2.key ? w : x2.key), g4 = f11(x2, g4, w), null === m7 ? l8 = x2 : m7.sibling = x2, m7 = x2);
          a16 && u5.forEach(function(a17) {
            return b2(e25, a17);
          });
          I2 && tg(e25, w);
          return l8;
        }
        function t15(e25, g4, h2, k2) {
          var l8 = Ka(h2);
          if ("function" !== typeof l8) throw Error(p14(150));
          h2 = l8.call(h2);
          if (null == h2) throw Error(p14(151));
          for (var u5 = l8 = null, m7 = g4, w = g4 = 0, x2 = null, n13 = h2.next(); null !== m7 && !n13.done; w++, n13 = h2.next()) {
            m7.index > w ? (x2 = m7, m7 = null) : x2 = m7.sibling;
            var t16 = r25(e25, m7, n13.value, k2);
            if (null === t16) {
              null === m7 && (m7 = x2);
              break;
            }
            a16 && m7 && null === t16.alternate && b2(e25, m7);
            g4 = f11(t16, g4, w);
            null === u5 ? l8 = t16 : u5.sibling = t16;
            u5 = t16;
            m7 = x2;
          }
          if (n13.done) return c4(
            e25,
            m7
          ), I2 && tg(e25, w), l8;
          if (null === m7) {
            for (; !n13.done; w++, n13 = h2.next()) n13 = q(e25, n13.value, k2), null !== n13 && (g4 = f11(n13, g4, w), null === u5 ? l8 = n13 : u5.sibling = n13, u5 = n13);
            I2 && tg(e25, w);
            return l8;
          }
          for (m7 = d8(e25, m7); !n13.done; w++, n13 = h2.next()) n13 = y(m7, e25, w, n13.value, k2), null !== n13 && (a16 && null !== n13.alternate && m7.delete(null === n13.key ? w : n13.key), g4 = f11(n13, g4, w), null === u5 ? l8 = n13 : u5.sibling = n13, u5 = n13);
          a16 && m7.forEach(function(a17) {
            return b2(e25, a17);
          });
          I2 && tg(e25, w);
          return l8;
        }
        function J(a17, d9, f12, h2) {
          "object" === typeof f12 && null !== f12 && f12.type === ya && null === f12.key && (f12 = f12.props.children);
          if ("object" === typeof f12 && null !== f12) {
            switch (f12.$$typeof) {
              case va:
                a: {
                  for (var k2 = f12.key, l8 = d9; null !== l8; ) {
                    if (l8.key === k2) {
                      k2 = f12.type;
                      if (k2 === ya) {
                        if (7 === l8.tag) {
                          c4(a17, l8.sibling);
                          d9 = e24(l8, f12.props.children);
                          d9.return = a17;
                          a17 = d9;
                          break a;
                        }
                      } else if (l8.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l8.type) {
                        c4(a17, l8.sibling);
                        d9 = e24(l8, f12.props);
                        d9.ref = Lg(a17, l8, f12);
                        d9.return = a17;
                        a17 = d9;
                        break a;
                      }
                      c4(a17, l8);
                      break;
                    } else b2(a17, l8);
                    l8 = l8.sibling;
                  }
                  f12.type === ya ? (d9 = Tg(f12.props.children, a17.mode, h2, f12.key), d9.return = a17, a17 = d9) : (h2 = Rg(f12.type, f12.key, f12.props, null, a17.mode, h2), h2.ref = Lg(a17, d9, f12), h2.return = a17, a17 = h2);
                }
                return g3(a17);
              case wa:
                a: {
                  for (l8 = f12.key; null !== d9; ) {
                    if (d9.key === l8) if (4 === d9.tag && d9.stateNode.containerInfo === f12.containerInfo && d9.stateNode.implementation === f12.implementation) {
                      c4(a17, d9.sibling);
                      d9 = e24(d9, f12.children || []);
                      d9.return = a17;
                      a17 = d9;
                      break a;
                    } else {
                      c4(a17, d9);
                      break;
                    }
                    else b2(a17, d9);
                    d9 = d9.sibling;
                  }
                  d9 = Sg(f12, a17.mode, h2);
                  d9.return = a17;
                  a17 = d9;
                }
                return g3(a17);
              case Ha:
                return l8 = f12._init, J(a17, d9, l8(f12._payload), h2);
            }
            if (eb(f12)) return n12(a17, d9, f12, h2);
            if (Ka(f12)) return t15(a17, d9, f12, h2);
            Mg(a17, f12);
          }
          return "string" === typeof f12 && "" !== f12 || "number" === typeof f12 ? (f12 = "" + f12, null !== d9 && 6 === d9.tag ? (c4(a17, d9.sibling), d9 = e24(d9, f12), d9.return = a17, a17 = d9) : (c4(a17, d9), d9 = Qg(f12, a17.mode, h2), d9.return = a17, a17 = d9), g3(a17)) : c4(a17, d9);
        }
        return J;
      }
      var Ug = Og(true);
      var Vg = Og(false);
      var Wg = Uf(null);
      var Xg = null;
      var Yg = null;
      var Zg = null;
      function $g() {
        Zg = Yg = Xg = null;
      }
      function ah(a16) {
        var b2 = Wg.current;
        E2(Wg);
        a16._currentValue = b2;
      }
      function bh(a16, b2, c4) {
        for (; null !== a16; ) {
          var d8 = a16.alternate;
          (a16.childLanes & b2) !== b2 ? (a16.childLanes |= b2, null !== d8 && (d8.childLanes |= b2)) : null !== d8 && (d8.childLanes & b2) !== b2 && (d8.childLanes |= b2);
          if (a16 === c4) break;
          a16 = a16.return;
        }
      }
      function ch(a16, b2) {
        Xg = a16;
        Zg = Yg = null;
        a16 = a16.dependencies;
        null !== a16 && null !== a16.firstContext && (0 !== (a16.lanes & b2) && (dh = true), a16.firstContext = null);
      }
      function eh(a16) {
        var b2 = a16._currentValue;
        if (Zg !== a16) if (a16 = { context: a16, memoizedValue: b2, next: null }, null === Yg) {
          if (null === Xg) throw Error(p14(308));
          Yg = a16;
          Xg.dependencies = { lanes: 0, firstContext: a16 };
        } else Yg = Yg.next = a16;
        return b2;
      }
      var fh = null;
      function gh(a16) {
        null === fh ? fh = [a16] : fh.push(a16);
      }
      function hh(a16, b2, c4, d8) {
        var e24 = b2.interleaved;
        null === e24 ? (c4.next = c4, gh(b2)) : (c4.next = e24.next, e24.next = c4);
        b2.interleaved = c4;
        return ih(a16, d8);
      }
      function ih(a16, b2) {
        a16.lanes |= b2;
        var c4 = a16.alternate;
        null !== c4 && (c4.lanes |= b2);
        c4 = a16;
        for (a16 = a16.return; null !== a16; ) a16.childLanes |= b2, c4 = a16.alternate, null !== c4 && (c4.childLanes |= b2), c4 = a16, a16 = a16.return;
        return 3 === c4.tag ? c4.stateNode : null;
      }
      var jh = false;
      function kh(a16) {
        a16.updateQueue = { baseState: a16.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
      }
      function lh(a16, b2) {
        a16 = a16.updateQueue;
        b2.updateQueue === a16 && (b2.updateQueue = { baseState: a16.baseState, firstBaseUpdate: a16.firstBaseUpdate, lastBaseUpdate: a16.lastBaseUpdate, shared: a16.shared, effects: a16.effects });
      }
      function mh(a16, b2) {
        return { eventTime: a16, lane: b2, tag: 0, payload: null, callback: null, next: null };
      }
      function nh(a16, b2, c4) {
        var d8 = a16.updateQueue;
        if (null === d8) return null;
        d8 = d8.shared;
        if (0 !== (K & 2)) {
          var e24 = d8.pending;
          null === e24 ? b2.next = b2 : (b2.next = e24.next, e24.next = b2);
          d8.pending = b2;
          return ih(a16, c4);
        }
        e24 = d8.interleaved;
        null === e24 ? (b2.next = b2, gh(d8)) : (b2.next = e24.next, e24.next = b2);
        d8.interleaved = b2;
        return ih(a16, c4);
      }
      function oh(a16, b2, c4) {
        b2 = b2.updateQueue;
        if (null !== b2 && (b2 = b2.shared, 0 !== (c4 & 4194240))) {
          var d8 = b2.lanes;
          d8 &= a16.pendingLanes;
          c4 |= d8;
          b2.lanes = c4;
          Cc(a16, c4);
        }
      }
      function ph(a16, b2) {
        var c4 = a16.updateQueue, d8 = a16.alternate;
        if (null !== d8 && (d8 = d8.updateQueue, c4 === d8)) {
          var e24 = null, f11 = null;
          c4 = c4.firstBaseUpdate;
          if (null !== c4) {
            do {
              var g3 = { eventTime: c4.eventTime, lane: c4.lane, tag: c4.tag, payload: c4.payload, callback: c4.callback, next: null };
              null === f11 ? e24 = f11 = g3 : f11 = f11.next = g3;
              c4 = c4.next;
            } while (null !== c4);
            null === f11 ? e24 = f11 = b2 : f11 = f11.next = b2;
          } else e24 = f11 = b2;
          c4 = { baseState: d8.baseState, firstBaseUpdate: e24, lastBaseUpdate: f11, shared: d8.shared, effects: d8.effects };
          a16.updateQueue = c4;
          return;
        }
        a16 = c4.lastBaseUpdate;
        null === a16 ? c4.firstBaseUpdate = b2 : a16.next = b2;
        c4.lastBaseUpdate = b2;
      }
      function qh(a16, b2, c4, d8) {
        var e24 = a16.updateQueue;
        jh = false;
        var f11 = e24.firstBaseUpdate, g3 = e24.lastBaseUpdate, h = e24.shared.pending;
        if (null !== h) {
          e24.shared.pending = null;
          var k = h, l7 = k.next;
          k.next = null;
          null === g3 ? f11 = l7 : g3.next = l7;
          g3 = k;
          var m6 = a16.alternate;
          null !== m6 && (m6 = m6.updateQueue, h = m6.lastBaseUpdate, h !== g3 && (null === h ? m6.firstBaseUpdate = l7 : h.next = l7, m6.lastBaseUpdate = k));
        }
        if (null !== f11) {
          var q = e24.baseState;
          g3 = 0;
          m6 = l7 = k = null;
          h = f11;
          do {
            var r25 = h.lane, y = h.eventTime;
            if ((d8 & r25) === r25) {
              null !== m6 && (m6 = m6.next = {
                eventTime: y,
                lane: 0,
                tag: h.tag,
                payload: h.payload,
                callback: h.callback,
                next: null
              });
              a: {
                var n12 = a16, t15 = h;
                r25 = b2;
                y = c4;
                switch (t15.tag) {
                  case 1:
                    n12 = t15.payload;
                    if ("function" === typeof n12) {
                      q = n12.call(y, q, r25);
                      break a;
                    }
                    q = n12;
                    break a;
                  case 3:
                    n12.flags = n12.flags & -65537 | 128;
                  case 0:
                    n12 = t15.payload;
                    r25 = "function" === typeof n12 ? n12.call(y, q, r25) : n12;
                    if (null === r25 || void 0 === r25) break a;
                    q = A2({}, q, r25);
                    break a;
                  case 2:
                    jh = true;
                }
              }
              null !== h.callback && 0 !== h.lane && (a16.flags |= 64, r25 = e24.effects, null === r25 ? e24.effects = [h] : r25.push(h));
            } else y = { eventTime: y, lane: r25, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m6 ? (l7 = m6 = y, k = q) : m6 = m6.next = y, g3 |= r25;
            h = h.next;
            if (null === h) if (h = e24.shared.pending, null === h) break;
            else r25 = h, h = r25.next, r25.next = null, e24.lastBaseUpdate = r25, e24.shared.pending = null;
          } while (1);
          null === m6 && (k = q);
          e24.baseState = k;
          e24.firstBaseUpdate = l7;
          e24.lastBaseUpdate = m6;
          b2 = e24.shared.interleaved;
          if (null !== b2) {
            e24 = b2;
            do
              g3 |= e24.lane, e24 = e24.next;
            while (e24 !== b2);
          } else null === f11 && (e24.shared.lanes = 0);
          rh |= g3;
          a16.lanes = g3;
          a16.memoizedState = q;
        }
      }
      function sh(a16, b2, c4) {
        a16 = b2.effects;
        b2.effects = null;
        if (null !== a16) for (b2 = 0; b2 < a16.length; b2++) {
          var d8 = a16[b2], e24 = d8.callback;
          if (null !== e24) {
            d8.callback = null;
            d8 = c4;
            if ("function" !== typeof e24) throw Error(p14(191, e24));
            e24.call(d8);
          }
        }
      }
      var th = {};
      var uh = Uf(th);
      var vh = Uf(th);
      var wh = Uf(th);
      function xh(a16) {
        if (a16 === th) throw Error(p14(174));
        return a16;
      }
      function yh(a16, b2) {
        G(wh, b2);
        G(vh, a16);
        G(uh, th);
        a16 = b2.nodeType;
        switch (a16) {
          case 9:
          case 11:
            b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
            break;
          default:
            a16 = 8 === a16 ? b2.parentNode : b2, b2 = a16.namespaceURI || null, a16 = a16.tagName, b2 = lb(b2, a16);
        }
        E2(uh);
        G(uh, b2);
      }
      function zh() {
        E2(uh);
        E2(vh);
        E2(wh);
      }
      function Ah(a16) {
        xh(wh.current);
        var b2 = xh(uh.current);
        var c4 = lb(b2, a16.type);
        b2 !== c4 && (G(vh, a16), G(uh, c4));
      }
      function Bh(a16) {
        vh.current === a16 && (E2(uh), E2(vh));
      }
      var L = Uf(0);
      function Ch(a16) {
        for (var b2 = a16; null !== b2; ) {
          if (13 === b2.tag) {
            var c4 = b2.memoizedState;
            if (null !== c4 && (c4 = c4.dehydrated, null === c4 || "$?" === c4.data || "$!" === c4.data)) return b2;
          } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
            if (0 !== (b2.flags & 128)) return b2;
          } else if (null !== b2.child) {
            b2.child.return = b2;
            b2 = b2.child;
            continue;
          }
          if (b2 === a16) break;
          for (; null === b2.sibling; ) {
            if (null === b2.return || b2.return === a16) return null;
            b2 = b2.return;
          }
          b2.sibling.return = b2.return;
          b2 = b2.sibling;
        }
        return null;
      }
      var Dh = [];
      function Eh() {
        for (var a16 = 0; a16 < Dh.length; a16++) Dh[a16]._workInProgressVersionPrimary = null;
        Dh.length = 0;
      }
      var Fh = ua.ReactCurrentDispatcher;
      var Gh = ua.ReactCurrentBatchConfig;
      var Hh = 0;
      var M = null;
      var N2 = null;
      var O = null;
      var Ih = false;
      var Jh = false;
      var Kh = 0;
      var Lh = 0;
      function P3() {
        throw Error(p14(321));
      }
      function Mh(a16, b2) {
        if (null === b2) return false;
        for (var c4 = 0; c4 < b2.length && c4 < a16.length; c4++) if (!He(a16[c4], b2[c4])) return false;
        return true;
      }
      function Nh(a16, b2, c4, d8, e24, f11) {
        Hh = f11;
        M = b2;
        b2.memoizedState = null;
        b2.updateQueue = null;
        b2.lanes = 0;
        Fh.current = null === a16 || null === a16.memoizedState ? Oh : Ph;
        a16 = c4(d8, e24);
        if (Jh) {
          f11 = 0;
          do {
            Jh = false;
            Kh = 0;
            if (25 <= f11) throw Error(p14(301));
            f11 += 1;
            O = N2 = null;
            b2.updateQueue = null;
            Fh.current = Qh;
            a16 = c4(d8, e24);
          } while (Jh);
        }
        Fh.current = Rh;
        b2 = null !== N2 && null !== N2.next;
        Hh = 0;
        O = N2 = M = null;
        Ih = false;
        if (b2) throw Error(p14(300));
        return a16;
      }
      function Sh() {
        var a16 = 0 !== Kh;
        Kh = 0;
        return a16;
      }
      function Th() {
        var a16 = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
        null === O ? M.memoizedState = O = a16 : O = O.next = a16;
        return O;
      }
      function Uh() {
        if (null === N2) {
          var a16 = M.alternate;
          a16 = null !== a16 ? a16.memoizedState : null;
        } else a16 = N2.next;
        var b2 = null === O ? M.memoizedState : O.next;
        if (null !== b2) O = b2, N2 = a16;
        else {
          if (null === a16) throw Error(p14(310));
          N2 = a16;
          a16 = { memoizedState: N2.memoizedState, baseState: N2.baseState, baseQueue: N2.baseQueue, queue: N2.queue, next: null };
          null === O ? M.memoizedState = O = a16 : O = O.next = a16;
        }
        return O;
      }
      function Vh(a16, b2) {
        return "function" === typeof b2 ? b2(a16) : b2;
      }
      function Wh(a16) {
        var b2 = Uh(), c4 = b2.queue;
        if (null === c4) throw Error(p14(311));
        c4.lastRenderedReducer = a16;
        var d8 = N2, e24 = d8.baseQueue, f11 = c4.pending;
        if (null !== f11) {
          if (null !== e24) {
            var g3 = e24.next;
            e24.next = f11.next;
            f11.next = g3;
          }
          d8.baseQueue = e24 = f11;
          c4.pending = null;
        }
        if (null !== e24) {
          f11 = e24.next;
          d8 = d8.baseState;
          var h = g3 = null, k = null, l7 = f11;
          do {
            var m6 = l7.lane;
            if ((Hh & m6) === m6) null !== k && (k = k.next = { lane: 0, action: l7.action, hasEagerState: l7.hasEagerState, eagerState: l7.eagerState, next: null }), d8 = l7.hasEagerState ? l7.eagerState : a16(d8, l7.action);
            else {
              var q = {
                lane: m6,
                action: l7.action,
                hasEagerState: l7.hasEagerState,
                eagerState: l7.eagerState,
                next: null
              };
              null === k ? (h = k = q, g3 = d8) : k = k.next = q;
              M.lanes |= m6;
              rh |= m6;
            }
            l7 = l7.next;
          } while (null !== l7 && l7 !== f11);
          null === k ? g3 = d8 : k.next = h;
          He(d8, b2.memoizedState) || (dh = true);
          b2.memoizedState = d8;
          b2.baseState = g3;
          b2.baseQueue = k;
          c4.lastRenderedState = d8;
        }
        a16 = c4.interleaved;
        if (null !== a16) {
          e24 = a16;
          do
            f11 = e24.lane, M.lanes |= f11, rh |= f11, e24 = e24.next;
          while (e24 !== a16);
        } else null === e24 && (c4.lanes = 0);
        return [b2.memoizedState, c4.dispatch];
      }
      function Xh(a16) {
        var b2 = Uh(), c4 = b2.queue;
        if (null === c4) throw Error(p14(311));
        c4.lastRenderedReducer = a16;
        var d8 = c4.dispatch, e24 = c4.pending, f11 = b2.memoizedState;
        if (null !== e24) {
          c4.pending = null;
          var g3 = e24 = e24.next;
          do
            f11 = a16(f11, g3.action), g3 = g3.next;
          while (g3 !== e24);
          He(f11, b2.memoizedState) || (dh = true);
          b2.memoizedState = f11;
          null === b2.baseQueue && (b2.baseState = f11);
          c4.lastRenderedState = f11;
        }
        return [f11, d8];
      }
      function Yh() {
      }
      function Zh(a16, b2) {
        var c4 = M, d8 = Uh(), e24 = b2(), f11 = !He(d8.memoizedState, e24);
        f11 && (d8.memoizedState = e24, dh = true);
        d8 = d8.queue;
        $h(ai.bind(null, c4, d8, a16), [a16]);
        if (d8.getSnapshot !== b2 || f11 || null !== O && O.memoizedState.tag & 1) {
          c4.flags |= 2048;
          bi(9, ci.bind(null, c4, d8, e24, b2), void 0, null);
          if (null === Q) throw Error(p14(349));
          0 !== (Hh & 30) || di(c4, b2, e24);
        }
        return e24;
      }
      function di(a16, b2, c4) {
        a16.flags |= 16384;
        a16 = { getSnapshot: b2, value: c4 };
        b2 = M.updateQueue;
        null === b2 ? (b2 = { lastEffect: null, stores: null }, M.updateQueue = b2, b2.stores = [a16]) : (c4 = b2.stores, null === c4 ? b2.stores = [a16] : c4.push(a16));
      }
      function ci(a16, b2, c4, d8) {
        b2.value = c4;
        b2.getSnapshot = d8;
        ei(b2) && fi(a16);
      }
      function ai(a16, b2, c4) {
        return c4(function() {
          ei(b2) && fi(a16);
        });
      }
      function ei(a16) {
        var b2 = a16.getSnapshot;
        a16 = a16.value;
        try {
          var c4 = b2();
          return !He(a16, c4);
        } catch (d8) {
          return true;
        }
      }
      function fi(a16) {
        var b2 = ih(a16, 1);
        null !== b2 && gi(b2, a16, 1, -1);
      }
      function hi(a16) {
        var b2 = Th();
        "function" === typeof a16 && (a16 = a16());
        b2.memoizedState = b2.baseState = a16;
        a16 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a16 };
        b2.queue = a16;
        a16 = a16.dispatch = ii.bind(null, M, a16);
        return [b2.memoizedState, a16];
      }
      function bi(a16, b2, c4, d8) {
        a16 = { tag: a16, create: b2, destroy: c4, deps: d8, next: null };
        b2 = M.updateQueue;
        null === b2 ? (b2 = { lastEffect: null, stores: null }, M.updateQueue = b2, b2.lastEffect = a16.next = a16) : (c4 = b2.lastEffect, null === c4 ? b2.lastEffect = a16.next = a16 : (d8 = c4.next, c4.next = a16, a16.next = d8, b2.lastEffect = a16));
        return a16;
      }
      function ji() {
        return Uh().memoizedState;
      }
      function ki(a16, b2, c4, d8) {
        var e24 = Th();
        M.flags |= a16;
        e24.memoizedState = bi(1 | b2, c4, void 0, void 0 === d8 ? null : d8);
      }
      function li(a16, b2, c4, d8) {
        var e24 = Uh();
        d8 = void 0 === d8 ? null : d8;
        var f11 = void 0;
        if (null !== N2) {
          var g3 = N2.memoizedState;
          f11 = g3.destroy;
          if (null !== d8 && Mh(d8, g3.deps)) {
            e24.memoizedState = bi(b2, c4, f11, d8);
            return;
          }
        }
        M.flags |= a16;
        e24.memoizedState = bi(1 | b2, c4, f11, d8);
      }
      function mi(a16, b2) {
        return ki(8390656, 8, a16, b2);
      }
      function $h(a16, b2) {
        return li(2048, 8, a16, b2);
      }
      function ni(a16, b2) {
        return li(4, 2, a16, b2);
      }
      function oi(a16, b2) {
        return li(4, 4, a16, b2);
      }
      function pi(a16, b2) {
        if ("function" === typeof b2) return a16 = a16(), b2(a16), function() {
          b2(null);
        };
        if (null !== b2 && void 0 !== b2) return a16 = a16(), b2.current = a16, function() {
          b2.current = null;
        };
      }
      function qi(a16, b2, c4) {
        c4 = null !== c4 && void 0 !== c4 ? c4.concat([a16]) : null;
        return li(4, 4, pi.bind(null, b2, a16), c4);
      }
      function ri() {
      }
      function si(a16, b2) {
        var c4 = Uh();
        b2 = void 0 === b2 ? null : b2;
        var d8 = c4.memoizedState;
        if (null !== d8 && null !== b2 && Mh(b2, d8[1])) return d8[0];
        c4.memoizedState = [a16, b2];
        return a16;
      }
      function ti(a16, b2) {
        var c4 = Uh();
        b2 = void 0 === b2 ? null : b2;
        var d8 = c4.memoizedState;
        if (null !== d8 && null !== b2 && Mh(b2, d8[1])) return d8[0];
        a16 = a16();
        c4.memoizedState = [a16, b2];
        return a16;
      }
      function ui(a16, b2, c4) {
        if (0 === (Hh & 21)) return a16.baseState && (a16.baseState = false, dh = true), a16.memoizedState = c4;
        He(c4, b2) || (c4 = yc(), M.lanes |= c4, rh |= c4, a16.baseState = true);
        return b2;
      }
      function vi(a16, b2) {
        var c4 = C;
        C = 0 !== c4 && 4 > c4 ? c4 : 4;
        a16(true);
        var d8 = Gh.transition;
        Gh.transition = {};
        try {
          a16(false), b2();
        } finally {
          C = c4, Gh.transition = d8;
        }
      }
      function wi() {
        return Uh().memoizedState;
      }
      function xi(a16, b2, c4) {
        var d8 = yi(a16);
        c4 = { lane: d8, action: c4, hasEagerState: false, eagerState: null, next: null };
        if (zi(a16)) Ai(b2, c4);
        else if (c4 = hh(a16, b2, c4, d8), null !== c4) {
          var e24 = R4();
          gi(c4, a16, d8, e24);
          Bi(c4, b2, d8);
        }
      }
      function ii(a16, b2, c4) {
        var d8 = yi(a16), e24 = { lane: d8, action: c4, hasEagerState: false, eagerState: null, next: null };
        if (zi(a16)) Ai(b2, e24);
        else {
          var f11 = a16.alternate;
          if (0 === a16.lanes && (null === f11 || 0 === f11.lanes) && (f11 = b2.lastRenderedReducer, null !== f11)) try {
            var g3 = b2.lastRenderedState, h = f11(g3, c4);
            e24.hasEagerState = true;
            e24.eagerState = h;
            if (He(h, g3)) {
              var k = b2.interleaved;
              null === k ? (e24.next = e24, gh(b2)) : (e24.next = k.next, k.next = e24);
              b2.interleaved = e24;
              return;
            }
          } catch (l7) {
          } finally {
          }
          c4 = hh(a16, b2, e24, d8);
          null !== c4 && (e24 = R4(), gi(c4, a16, d8, e24), Bi(c4, b2, d8));
        }
      }
      function zi(a16) {
        var b2 = a16.alternate;
        return a16 === M || null !== b2 && b2 === M;
      }
      function Ai(a16, b2) {
        Jh = Ih = true;
        var c4 = a16.pending;
        null === c4 ? b2.next = b2 : (b2.next = c4.next, c4.next = b2);
        a16.pending = b2;
      }
      function Bi(a16, b2, c4) {
        if (0 !== (c4 & 4194240)) {
          var d8 = b2.lanes;
          d8 &= a16.pendingLanes;
          c4 |= d8;
          b2.lanes = c4;
          Cc(a16, c4);
        }
      }
      var Rh = { readContext: eh, useCallback: P3, useContext: P3, useEffect: P3, useImperativeHandle: P3, useInsertionEffect: P3, useLayoutEffect: P3, useMemo: P3, useReducer: P3, useRef: P3, useState: P3, useDebugValue: P3, useDeferredValue: P3, useTransition: P3, useMutableSource: P3, useSyncExternalStore: P3, useId: P3, unstable_isNewReconciler: false };
      var Oh = { readContext: eh, useCallback: function(a16, b2) {
        Th().memoizedState = [a16, void 0 === b2 ? null : b2];
        return a16;
      }, useContext: eh, useEffect: mi, useImperativeHandle: function(a16, b2, c4) {
        c4 = null !== c4 && void 0 !== c4 ? c4.concat([a16]) : null;
        return ki(
          4194308,
          4,
          pi.bind(null, b2, a16),
          c4
        );
      }, useLayoutEffect: function(a16, b2) {
        return ki(4194308, 4, a16, b2);
      }, useInsertionEffect: function(a16, b2) {
        return ki(4, 2, a16, b2);
      }, useMemo: function(a16, b2) {
        var c4 = Th();
        b2 = void 0 === b2 ? null : b2;
        a16 = a16();
        c4.memoizedState = [a16, b2];
        return a16;
      }, useReducer: function(a16, b2, c4) {
        var d8 = Th();
        b2 = void 0 !== c4 ? c4(b2) : b2;
        d8.memoizedState = d8.baseState = b2;
        a16 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a16, lastRenderedState: b2 };
        d8.queue = a16;
        a16 = a16.dispatch = xi.bind(null, M, a16);
        return [d8.memoizedState, a16];
      }, useRef: function(a16) {
        var b2 = Th();
        a16 = { current: a16 };
        return b2.memoizedState = a16;
      }, useState: hi, useDebugValue: ri, useDeferredValue: function(a16) {
        return Th().memoizedState = a16;
      }, useTransition: function() {
        var a16 = hi(false), b2 = a16[0];
        a16 = vi.bind(null, a16[1]);
        Th().memoizedState = a16;
        return [b2, a16];
      }, useMutableSource: function() {
      }, useSyncExternalStore: function(a16, b2, c4) {
        var d8 = M, e24 = Th();
        if (I2) {
          if (void 0 === c4) throw Error(p14(407));
          c4 = c4();
        } else {
          c4 = b2();
          if (null === Q) throw Error(p14(349));
          0 !== (Hh & 30) || di(d8, b2, c4);
        }
        e24.memoizedState = c4;
        var f11 = { value: c4, getSnapshot: b2 };
        e24.queue = f11;
        mi(ai.bind(
          null,
          d8,
          f11,
          a16
        ), [a16]);
        d8.flags |= 2048;
        bi(9, ci.bind(null, d8, f11, c4, b2), void 0, null);
        return c4;
      }, useId: function() {
        var a16 = Th(), b2 = Q.identifierPrefix;
        if (I2) {
          var c4 = sg;
          var d8 = rg;
          c4 = (d8 & ~(1 << 32 - oc(d8) - 1)).toString(32) + c4;
          b2 = ":" + b2 + "R" + c4;
          c4 = Kh++;
          0 < c4 && (b2 += "H" + c4.toString(32));
          b2 += ":";
        } else c4 = Lh++, b2 = ":" + b2 + "r" + c4.toString(32) + ":";
        return a16.memoizedState = b2;
      }, unstable_isNewReconciler: false };
      var Ph = {
        readContext: eh,
        useCallback: si,
        useContext: eh,
        useEffect: $h,
        useImperativeHandle: qi,
        useInsertionEffect: ni,
        useLayoutEffect: oi,
        useMemo: ti,
        useReducer: Wh,
        useRef: ji,
        useState: function() {
          return Wh(Vh);
        },
        useDebugValue: ri,
        useDeferredValue: function(a16) {
          var b2 = Uh();
          return ui(b2, N2.memoizedState, a16);
        },
        useTransition: function() {
          var a16 = Wh(Vh)[0], b2 = Uh().memoizedState;
          return [a16, b2];
        },
        useMutableSource: Yh,
        useSyncExternalStore: Zh,
        useId: wi,
        unstable_isNewReconciler: false
      };
      var Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
        return Xh(Vh);
      }, useDebugValue: ri, useDeferredValue: function(a16) {
        var b2 = Uh();
        return null === N2 ? b2.memoizedState = a16 : ui(b2, N2.memoizedState, a16);
      }, useTransition: function() {
        var a16 = Xh(Vh)[0], b2 = Uh().memoizedState;
        return [a16, b2];
      }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
      function Ci(a16, b2) {
        if (a16 && a16.defaultProps) {
          b2 = A2({}, b2);
          a16 = a16.defaultProps;
          for (var c4 in a16) void 0 === b2[c4] && (b2[c4] = a16[c4]);
          return b2;
        }
        return b2;
      }
      function Di(a16, b2, c4, d8) {
        b2 = a16.memoizedState;
        c4 = c4(d8, b2);
        c4 = null === c4 || void 0 === c4 ? b2 : A2({}, b2, c4);
        a16.memoizedState = c4;
        0 === a16.lanes && (a16.updateQueue.baseState = c4);
      }
      var Ei = { isMounted: function(a16) {
        return (a16 = a16._reactInternals) ? Vb(a16) === a16 : false;
      }, enqueueSetState: function(a16, b2, c4) {
        a16 = a16._reactInternals;
        var d8 = R4(), e24 = yi(a16), f11 = mh(d8, e24);
        f11.payload = b2;
        void 0 !== c4 && null !== c4 && (f11.callback = c4);
        b2 = nh(a16, f11, e24);
        null !== b2 && (gi(b2, a16, e24, d8), oh(b2, a16, e24));
      }, enqueueReplaceState: function(a16, b2, c4) {
        a16 = a16._reactInternals;
        var d8 = R4(), e24 = yi(a16), f11 = mh(d8, e24);
        f11.tag = 1;
        f11.payload = b2;
        void 0 !== c4 && null !== c4 && (f11.callback = c4);
        b2 = nh(a16, f11, e24);
        null !== b2 && (gi(b2, a16, e24, d8), oh(b2, a16, e24));
      }, enqueueForceUpdate: function(a16, b2) {
        a16 = a16._reactInternals;
        var c4 = R4(), d8 = yi(a16), e24 = mh(c4, d8);
        e24.tag = 2;
        void 0 !== b2 && null !== b2 && (e24.callback = b2);
        b2 = nh(a16, e24, d8);
        null !== b2 && (gi(b2, a16, d8, c4), oh(b2, a16, d8));
      } };
      function Fi(a16, b2, c4, d8, e24, f11, g3) {
        a16 = a16.stateNode;
        return "function" === typeof a16.shouldComponentUpdate ? a16.shouldComponentUpdate(d8, f11, g3) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie(c4, d8) || !Ie(e24, f11) : true;
      }
      function Gi(a16, b2, c4) {
        var d8 = false, e24 = Vf;
        var f11 = b2.contextType;
        "object" === typeof f11 && null !== f11 ? f11 = eh(f11) : (e24 = Zf(b2) ? Xf : H2.current, d8 = b2.contextTypes, f11 = (d8 = null !== d8 && void 0 !== d8) ? Yf(a16, e24) : Vf);
        b2 = new b2(c4, f11);
        a16.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
        b2.updater = Ei;
        a16.stateNode = b2;
        b2._reactInternals = a16;
        d8 && (a16 = a16.stateNode, a16.__reactInternalMemoizedUnmaskedChildContext = e24, a16.__reactInternalMemoizedMaskedChildContext = f11);
        return b2;
      }
      function Hi(a16, b2, c4, d8) {
        a16 = b2.state;
        "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c4, d8);
        "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c4, d8);
        b2.state !== a16 && Ei.enqueueReplaceState(b2, b2.state, null);
      }
      function Ii(a16, b2, c4, d8) {
        var e24 = a16.stateNode;
        e24.props = c4;
        e24.state = a16.memoizedState;
        e24.refs = {};
        kh(a16);
        var f11 = b2.contextType;
        "object" === typeof f11 && null !== f11 ? e24.context = eh(f11) : (f11 = Zf(b2) ? Xf : H2.current, e24.context = Yf(a16, f11));
        e24.state = a16.memoizedState;
        f11 = b2.getDerivedStateFromProps;
        "function" === typeof f11 && (Di(a16, b2, f11, c4), e24.state = a16.memoizedState);
        "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e24.getSnapshotBeforeUpdate || "function" !== typeof e24.UNSAFE_componentWillMount && "function" !== typeof e24.componentWillMount || (b2 = e24.state, "function" === typeof e24.componentWillMount && e24.componentWillMount(), "function" === typeof e24.UNSAFE_componentWillMount && e24.UNSAFE_componentWillMount(), b2 !== e24.state && Ei.enqueueReplaceState(e24, e24.state, null), qh(a16, c4, e24, d8), e24.state = a16.memoizedState);
        "function" === typeof e24.componentDidMount && (a16.flags |= 4194308);
      }
      function Ji(a16, b2) {
        try {
          var c4 = "", d8 = b2;
          do
            c4 += Pa(d8), d8 = d8.return;
          while (d8);
          var e24 = c4;
        } catch (f11) {
          e24 = "\nError generating stack: " + f11.message + "\n" + f11.stack;
        }
        return { value: a16, source: b2, stack: e24, digest: null };
      }
      function Ki(a16, b2, c4) {
        return { value: a16, source: null, stack: null != c4 ? c4 : null, digest: null != b2 ? b2 : null };
      }
      function Li(a16, b2) {
        try {
          console.error(b2.value);
        } catch (c4) {
          setTimeout(function() {
            throw c4;
          });
        }
      }
      var Mi = "function" === typeof WeakMap ? WeakMap : Map;
      function Ni(a16, b2, c4) {
        c4 = mh(-1, c4);
        c4.tag = 3;
        c4.payload = { element: null };
        var d8 = b2.value;
        c4.callback = function() {
          Oi || (Oi = true, Pi = d8);
          Li(a16, b2);
        };
        return c4;
      }
      function Qi(a16, b2, c4) {
        c4 = mh(-1, c4);
        c4.tag = 3;
        var d8 = a16.type.getDerivedStateFromError;
        if ("function" === typeof d8) {
          var e24 = b2.value;
          c4.payload = function() {
            return d8(e24);
          };
          c4.callback = function() {
            Li(a16, b2);
          };
        }
        var f11 = a16.stateNode;
        null !== f11 && "function" === typeof f11.componentDidCatch && (c4.callback = function() {
          Li(a16, b2);
          "function" !== typeof d8 && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
          var c5 = b2.stack;
          this.componentDidCatch(b2.value, { componentStack: null !== c5 ? c5 : "" });
        });
        return c4;
      }
      function Si(a16, b2, c4) {
        var d8 = a16.pingCache;
        if (null === d8) {
          d8 = a16.pingCache = new Mi();
          var e24 = /* @__PURE__ */ new Set();
          d8.set(b2, e24);
        } else e24 = d8.get(b2), void 0 === e24 && (e24 = /* @__PURE__ */ new Set(), d8.set(b2, e24));
        e24.has(c4) || (e24.add(c4), a16 = Ti.bind(null, a16, b2, c4), b2.then(a16, a16));
      }
      function Ui(a16) {
        do {
          var b2;
          if (b2 = 13 === a16.tag) b2 = a16.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
          if (b2) return a16;
          a16 = a16.return;
        } while (null !== a16);
        return null;
      }
      function Vi(a16, b2, c4, d8, e24) {
        if (0 === (a16.mode & 1)) return a16 === b2 ? a16.flags |= 65536 : (a16.flags |= 128, c4.flags |= 131072, c4.flags &= -52805, 1 === c4.tag && (null === c4.alternate ? c4.tag = 17 : (b2 = mh(-1, 1), b2.tag = 2, nh(c4, b2, 1))), c4.lanes |= 1), a16;
        a16.flags |= 65536;
        a16.lanes = e24;
        return a16;
      }
      var Wi = ua.ReactCurrentOwner;
      var dh = false;
      function Xi(a16, b2, c4, d8) {
        b2.child = null === a16 ? Vg(b2, null, c4, d8) : Ug(b2, a16.child, c4, d8);
      }
      function Yi(a16, b2, c4, d8, e24) {
        c4 = c4.render;
        var f11 = b2.ref;
        ch(b2, e24);
        d8 = Nh(a16, b2, c4, d8, f11, e24);
        c4 = Sh();
        if (null !== a16 && !dh) return b2.updateQueue = a16.updateQueue, b2.flags &= -2053, a16.lanes &= ~e24, Zi(a16, b2, e24);
        I2 && c4 && vg(b2);
        b2.flags |= 1;
        Xi(a16, b2, d8, e24);
        return b2.child;
      }
      function $i(a16, b2, c4, d8, e24) {
        if (null === a16) {
          var f11 = c4.type;
          if ("function" === typeof f11 && !aj(f11) && void 0 === f11.defaultProps && null === c4.compare && void 0 === c4.defaultProps) return b2.tag = 15, b2.type = f11, bj(a16, b2, f11, d8, e24);
          a16 = Rg(c4.type, null, d8, b2, b2.mode, e24);
          a16.ref = b2.ref;
          a16.return = b2;
          return b2.child = a16;
        }
        f11 = a16.child;
        if (0 === (a16.lanes & e24)) {
          var g3 = f11.memoizedProps;
          c4 = c4.compare;
          c4 = null !== c4 ? c4 : Ie;
          if (c4(g3, d8) && a16.ref === b2.ref) return Zi(a16, b2, e24);
        }
        b2.flags |= 1;
        a16 = Pg(f11, d8);
        a16.ref = b2.ref;
        a16.return = b2;
        return b2.child = a16;
      }
      function bj(a16, b2, c4, d8, e24) {
        if (null !== a16) {
          var f11 = a16.memoizedProps;
          if (Ie(f11, d8) && a16.ref === b2.ref) if (dh = false, b2.pendingProps = d8 = f11, 0 !== (a16.lanes & e24)) 0 !== (a16.flags & 131072) && (dh = true);
          else return b2.lanes = a16.lanes, Zi(a16, b2, e24);
        }
        return cj(a16, b2, c4, d8, e24);
      }
      function dj(a16, b2, c4) {
        var d8 = b2.pendingProps, e24 = d8.children, f11 = null !== a16 ? a16.memoizedState : null;
        if ("hidden" === d8.mode) if (0 === (b2.mode & 1)) b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c4;
        else {
          if (0 === (c4 & 1073741824)) return a16 = null !== f11 ? f11.baseLanes | c4 : c4, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a16, cachePool: null, transitions: null }, b2.updateQueue = null, G(ej, fj), fj |= a16, null;
          b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
          d8 = null !== f11 ? f11.baseLanes : c4;
          G(ej, fj);
          fj |= d8;
        }
        else null !== f11 ? (d8 = f11.baseLanes | c4, b2.memoizedState = null) : d8 = c4, G(ej, fj), fj |= d8;
        Xi(a16, b2, e24, c4);
        return b2.child;
      }
      function gj(a16, b2) {
        var c4 = b2.ref;
        if (null === a16 && null !== c4 || null !== a16 && a16.ref !== c4) b2.flags |= 512, b2.flags |= 2097152;
      }
      function cj(a16, b2, c4, d8, e24) {
        var f11 = Zf(c4) ? Xf : H2.current;
        f11 = Yf(b2, f11);
        ch(b2, e24);
        c4 = Nh(a16, b2, c4, d8, f11, e24);
        d8 = Sh();
        if (null !== a16 && !dh) return b2.updateQueue = a16.updateQueue, b2.flags &= -2053, a16.lanes &= ~e24, Zi(a16, b2, e24);
        I2 && d8 && vg(b2);
        b2.flags |= 1;
        Xi(a16, b2, c4, e24);
        return b2.child;
      }
      function hj(a16, b2, c4, d8, e24) {
        if (Zf(c4)) {
          var f11 = true;
          cg(b2);
        } else f11 = false;
        ch(b2, e24);
        if (null === b2.stateNode) ij(a16, b2), Gi(b2, c4, d8), Ii(b2, c4, d8, e24), d8 = true;
        else if (null === a16) {
          var g3 = b2.stateNode, h = b2.memoizedProps;
          g3.props = h;
          var k = g3.context, l7 = c4.contextType;
          "object" === typeof l7 && null !== l7 ? l7 = eh(l7) : (l7 = Zf(c4) ? Xf : H2.current, l7 = Yf(b2, l7));
          var m6 = c4.getDerivedStateFromProps, q = "function" === typeof m6 || "function" === typeof g3.getSnapshotBeforeUpdate;
          q || "function" !== typeof g3.UNSAFE_componentWillReceiveProps && "function" !== typeof g3.componentWillReceiveProps || (h !== d8 || k !== l7) && Hi(b2, g3, d8, l7);
          jh = false;
          var r25 = b2.memoizedState;
          g3.state = r25;
          qh(b2, d8, g3, e24);
          k = b2.memoizedState;
          h !== d8 || r25 !== k || Wf.current || jh ? ("function" === typeof m6 && (Di(b2, c4, m6, d8), k = b2.memoizedState), (h = jh || Fi(b2, c4, h, d8, r25, k, l7)) ? (q || "function" !== typeof g3.UNSAFE_componentWillMount && "function" !== typeof g3.componentWillMount || ("function" === typeof g3.componentWillMount && g3.componentWillMount(), "function" === typeof g3.UNSAFE_componentWillMount && g3.UNSAFE_componentWillMount()), "function" === typeof g3.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g3.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d8, b2.memoizedState = k), g3.props = d8, g3.state = k, g3.context = l7, d8 = h) : ("function" === typeof g3.componentDidMount && (b2.flags |= 4194308), d8 = false);
        } else {
          g3 = b2.stateNode;
          lh(a16, b2);
          h = b2.memoizedProps;
          l7 = b2.type === b2.elementType ? h : Ci(b2.type, h);
          g3.props = l7;
          q = b2.pendingProps;
          r25 = g3.context;
          k = c4.contextType;
          "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c4) ? Xf : H2.current, k = Yf(b2, k));
          var y = c4.getDerivedStateFromProps;
          (m6 = "function" === typeof y || "function" === typeof g3.getSnapshotBeforeUpdate) || "function" !== typeof g3.UNSAFE_componentWillReceiveProps && "function" !== typeof g3.componentWillReceiveProps || (h !== q || r25 !== k) && Hi(b2, g3, d8, k);
          jh = false;
          r25 = b2.memoizedState;
          g3.state = r25;
          qh(b2, d8, g3, e24);
          var n12 = b2.memoizedState;
          h !== q || r25 !== n12 || Wf.current || jh ? ("function" === typeof y && (Di(b2, c4, y, d8), n12 = b2.memoizedState), (l7 = jh || Fi(b2, c4, l7, d8, r25, n12, k) || false) ? (m6 || "function" !== typeof g3.UNSAFE_componentWillUpdate && "function" !== typeof g3.componentWillUpdate || ("function" === typeof g3.componentWillUpdate && g3.componentWillUpdate(d8, n12, k), "function" === typeof g3.UNSAFE_componentWillUpdate && g3.UNSAFE_componentWillUpdate(d8, n12, k)), "function" === typeof g3.componentDidUpdate && (b2.flags |= 4), "function" === typeof g3.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g3.componentDidUpdate || h === a16.memoizedProps && r25 === a16.memoizedState || (b2.flags |= 4), "function" !== typeof g3.getSnapshotBeforeUpdate || h === a16.memoizedProps && r25 === a16.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d8, b2.memoizedState = n12), g3.props = d8, g3.state = n12, g3.context = k, d8 = l7) : ("function" !== typeof g3.componentDidUpdate || h === a16.memoizedProps && r25 === a16.memoizedState || (b2.flags |= 4), "function" !== typeof g3.getSnapshotBeforeUpdate || h === a16.memoizedProps && r25 === a16.memoizedState || (b2.flags |= 1024), d8 = false);
        }
        return jj(a16, b2, c4, d8, f11, e24);
      }
      function jj(a16, b2, c4, d8, e24, f11) {
        gj(a16, b2);
        var g3 = 0 !== (b2.flags & 128);
        if (!d8 && !g3) return e24 && dg(b2, c4, false), Zi(a16, b2, f11);
        d8 = b2.stateNode;
        Wi.current = b2;
        var h = g3 && "function" !== typeof c4.getDerivedStateFromError ? null : d8.render();
        b2.flags |= 1;
        null !== a16 && g3 ? (b2.child = Ug(b2, a16.child, null, f11), b2.child = Ug(b2, null, h, f11)) : Xi(a16, b2, h, f11);
        b2.memoizedState = d8.state;
        e24 && dg(b2, c4, true);
        return b2.child;
      }
      function kj(a16) {
        var b2 = a16.stateNode;
        b2.pendingContext ? ag(a16, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a16, b2.context, false);
        yh(a16, b2.containerInfo);
      }
      function lj(a16, b2, c4, d8, e24) {
        Ig();
        Jg(e24);
        b2.flags |= 256;
        Xi(a16, b2, c4, d8);
        return b2.child;
      }
      var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
      function nj(a16) {
        return { baseLanes: a16, cachePool: null, transitions: null };
      }
      function oj(a16, b2, c4) {
        var d8 = b2.pendingProps, e24 = L.current, f11 = false, g3 = 0 !== (b2.flags & 128), h;
        (h = g3) || (h = null !== a16 && null === a16.memoizedState ? false : 0 !== (e24 & 2));
        if (h) f11 = true, b2.flags &= -129;
        else if (null === a16 || null !== a16.memoizedState) e24 |= 1;
        G(L, e24 & 1);
        if (null === a16) {
          Eg(b2);
          a16 = b2.memoizedState;
          if (null !== a16 && (a16 = a16.dehydrated, null !== a16)) return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a16.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
          g3 = d8.children;
          a16 = d8.fallback;
          return f11 ? (d8 = b2.mode, f11 = b2.child, g3 = { mode: "hidden", children: g3 }, 0 === (d8 & 1) && null !== f11 ? (f11.childLanes = 0, f11.pendingProps = g3) : f11 = pj(g3, d8, 0, null), a16 = Tg(a16, d8, c4, null), f11.return = b2, a16.return = b2, f11.sibling = a16, b2.child = f11, b2.child.memoizedState = nj(c4), b2.memoizedState = mj, a16) : qj(b2, g3);
        }
        e24 = a16.memoizedState;
        if (null !== e24 && (h = e24.dehydrated, null !== h)) return rj(a16, b2, g3, d8, h, e24, c4);
        if (f11) {
          f11 = d8.fallback;
          g3 = b2.mode;
          e24 = a16.child;
          h = e24.sibling;
          var k = { mode: "hidden", children: d8.children };
          0 === (g3 & 1) && b2.child !== e24 ? (d8 = b2.child, d8.childLanes = 0, d8.pendingProps = k, b2.deletions = null) : (d8 = Pg(e24, k), d8.subtreeFlags = e24.subtreeFlags & 14680064);
          null !== h ? f11 = Pg(h, f11) : (f11 = Tg(f11, g3, c4, null), f11.flags |= 2);
          f11.return = b2;
          d8.return = b2;
          d8.sibling = f11;
          b2.child = d8;
          d8 = f11;
          f11 = b2.child;
          g3 = a16.child.memoizedState;
          g3 = null === g3 ? nj(c4) : { baseLanes: g3.baseLanes | c4, cachePool: null, transitions: g3.transitions };
          f11.memoizedState = g3;
          f11.childLanes = a16.childLanes & ~c4;
          b2.memoizedState = mj;
          return d8;
        }
        f11 = a16.child;
        a16 = f11.sibling;
        d8 = Pg(f11, { mode: "visible", children: d8.children });
        0 === (b2.mode & 1) && (d8.lanes = c4);
        d8.return = b2;
        d8.sibling = null;
        null !== a16 && (c4 = b2.deletions, null === c4 ? (b2.deletions = [a16], b2.flags |= 16) : c4.push(a16));
        b2.child = d8;
        b2.memoizedState = null;
        return d8;
      }
      function qj(a16, b2) {
        b2 = pj({ mode: "visible", children: b2 }, a16.mode, 0, null);
        b2.return = a16;
        return a16.child = b2;
      }
      function sj(a16, b2, c4, d8) {
        null !== d8 && Jg(d8);
        Ug(b2, a16.child, null, c4);
        a16 = qj(b2, b2.pendingProps.children);
        a16.flags |= 2;
        b2.memoizedState = null;
        return a16;
      }
      function rj(a16, b2, c4, d8, e24, f11, g3) {
        if (c4) {
          if (b2.flags & 256) return b2.flags &= -257, d8 = Ki(Error(p14(422))), sj(a16, b2, g3, d8);
          if (null !== b2.memoizedState) return b2.child = a16.child, b2.flags |= 128, null;
          f11 = d8.fallback;
          e24 = b2.mode;
          d8 = pj({ mode: "visible", children: d8.children }, e24, 0, null);
          f11 = Tg(f11, e24, g3, null);
          f11.flags |= 2;
          d8.return = b2;
          f11.return = b2;
          d8.sibling = f11;
          b2.child = d8;
          0 !== (b2.mode & 1) && Ug(b2, a16.child, null, g3);
          b2.child.memoizedState = nj(g3);
          b2.memoizedState = mj;
          return f11;
        }
        if (0 === (b2.mode & 1)) return sj(a16, b2, g3, null);
        if ("$!" === e24.data) {
          d8 = e24.nextSibling && e24.nextSibling.dataset;
          if (d8) var h = d8.dgst;
          d8 = h;
          f11 = Error(p14(419));
          d8 = Ki(f11, d8, void 0);
          return sj(a16, b2, g3, d8);
        }
        h = 0 !== (g3 & a16.childLanes);
        if (dh || h) {
          d8 = Q;
          if (null !== d8) {
            switch (g3 & -g3) {
              case 4:
                e24 = 2;
                break;
              case 16:
                e24 = 8;
                break;
              case 64:
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
              case 67108864:
                e24 = 32;
                break;
              case 536870912:
                e24 = 268435456;
                break;
              default:
                e24 = 0;
            }
            e24 = 0 !== (e24 & (d8.suspendedLanes | g3)) ? 0 : e24;
            0 !== e24 && e24 !== f11.retryLane && (f11.retryLane = e24, ih(a16, e24), gi(d8, a16, e24, -1));
          }
          tj();
          d8 = Ki(Error(p14(421)));
          return sj(a16, b2, g3, d8);
        }
        if ("$?" === e24.data) return b2.flags |= 128, b2.child = a16.child, b2 = uj.bind(null, a16), e24._reactRetry = b2, null;
        a16 = f11.treeContext;
        yg = Lf(e24.nextSibling);
        xg = b2;
        I2 = true;
        zg = null;
        null !== a16 && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a16.id, sg = a16.overflow, qg = b2);
        b2 = qj(b2, d8.children);
        b2.flags |= 4096;
        return b2;
      }
      function vj(a16, b2, c4) {
        a16.lanes |= b2;
        var d8 = a16.alternate;
        null !== d8 && (d8.lanes |= b2);
        bh(a16.return, b2, c4);
      }
      function wj(a16, b2, c4, d8, e24) {
        var f11 = a16.memoizedState;
        null === f11 ? a16.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d8, tail: c4, tailMode: e24 } : (f11.isBackwards = b2, f11.rendering = null, f11.renderingStartTime = 0, f11.last = d8, f11.tail = c4, f11.tailMode = e24);
      }
      function xj(a16, b2, c4) {
        var d8 = b2.pendingProps, e24 = d8.revealOrder, f11 = d8.tail;
        Xi(a16, b2, d8.children, c4);
        d8 = L.current;
        if (0 !== (d8 & 2)) d8 = d8 & 1 | 2, b2.flags |= 128;
        else {
          if (null !== a16 && 0 !== (a16.flags & 128)) a: for (a16 = b2.child; null !== a16; ) {
            if (13 === a16.tag) null !== a16.memoizedState && vj(a16, c4, b2);
            else if (19 === a16.tag) vj(a16, c4, b2);
            else if (null !== a16.child) {
              a16.child.return = a16;
              a16 = a16.child;
              continue;
            }
            if (a16 === b2) break a;
            for (; null === a16.sibling; ) {
              if (null === a16.return || a16.return === b2) break a;
              a16 = a16.return;
            }
            a16.sibling.return = a16.return;
            a16 = a16.sibling;
          }
          d8 &= 1;
        }
        G(L, d8);
        if (0 === (b2.mode & 1)) b2.memoizedState = null;
        else switch (e24) {
          case "forwards":
            c4 = b2.child;
            for (e24 = null; null !== c4; ) a16 = c4.alternate, null !== a16 && null === Ch(a16) && (e24 = c4), c4 = c4.sibling;
            c4 = e24;
            null === c4 ? (e24 = b2.child, b2.child = null) : (e24 = c4.sibling, c4.sibling = null);
            wj(b2, false, e24, c4, f11);
            break;
          case "backwards":
            c4 = null;
            e24 = b2.child;
            for (b2.child = null; null !== e24; ) {
              a16 = e24.alternate;
              if (null !== a16 && null === Ch(a16)) {
                b2.child = e24;
                break;
              }
              a16 = e24.sibling;
              e24.sibling = c4;
              c4 = e24;
              e24 = a16;
            }
            wj(b2, true, c4, null, f11);
            break;
          case "together":
            wj(b2, false, null, null, void 0);
            break;
          default:
            b2.memoizedState = null;
        }
        return b2.child;
      }
      function ij(a16, b2) {
        0 === (b2.mode & 1) && null !== a16 && (a16.alternate = null, b2.alternate = null, b2.flags |= 2);
      }
      function Zi(a16, b2, c4) {
        null !== a16 && (b2.dependencies = a16.dependencies);
        rh |= b2.lanes;
        if (0 === (c4 & b2.childLanes)) return null;
        if (null !== a16 && b2.child !== a16.child) throw Error(p14(153));
        if (null !== b2.child) {
          a16 = b2.child;
          c4 = Pg(a16, a16.pendingProps);
          b2.child = c4;
          for (c4.return = b2; null !== a16.sibling; ) a16 = a16.sibling, c4 = c4.sibling = Pg(a16, a16.pendingProps), c4.return = b2;
          c4.sibling = null;
        }
        return b2.child;
      }
      function yj(a16, b2, c4) {
        switch (b2.tag) {
          case 3:
            kj(b2);
            Ig();
            break;
          case 5:
            Ah(b2);
            break;
          case 1:
            Zf(b2.type) && cg(b2);
            break;
          case 4:
            yh(b2, b2.stateNode.containerInfo);
            break;
          case 10:
            var d8 = b2.type._context, e24 = b2.memoizedProps.value;
            G(Wg, d8._currentValue);
            d8._currentValue = e24;
            break;
          case 13:
            d8 = b2.memoizedState;
            if (null !== d8) {
              if (null !== d8.dehydrated) return G(L, L.current & 1), b2.flags |= 128, null;
              if (0 !== (c4 & b2.child.childLanes)) return oj(a16, b2, c4);
              G(L, L.current & 1);
              a16 = Zi(a16, b2, c4);
              return null !== a16 ? a16.sibling : null;
            }
            G(L, L.current & 1);
            break;
          case 19:
            d8 = 0 !== (c4 & b2.childLanes);
            if (0 !== (a16.flags & 128)) {
              if (d8) return xj(a16, b2, c4);
              b2.flags |= 128;
            }
            e24 = b2.memoizedState;
            null !== e24 && (e24.rendering = null, e24.tail = null, e24.lastEffect = null);
            G(L, L.current);
            if (d8) break;
            else return null;
          case 22:
          case 23:
            return b2.lanes = 0, dj(a16, b2, c4);
        }
        return Zi(a16, b2, c4);
      }
      var zj;
      var Aj;
      var Bj;
      var Cj;
      zj = function(a16, b2) {
        for (var c4 = b2.child; null !== c4; ) {
          if (5 === c4.tag || 6 === c4.tag) a16.appendChild(c4.stateNode);
          else if (4 !== c4.tag && null !== c4.child) {
            c4.child.return = c4;
            c4 = c4.child;
            continue;
          }
          if (c4 === b2) break;
          for (; null === c4.sibling; ) {
            if (null === c4.return || c4.return === b2) return;
            c4 = c4.return;
          }
          c4.sibling.return = c4.return;
          c4 = c4.sibling;
        }
      };
      Aj = function() {
      };
      Bj = function(a16, b2, c4, d8) {
        var e24 = a16.memoizedProps;
        if (e24 !== d8) {
          a16 = b2.stateNode;
          xh(uh.current);
          var f11 = null;
          switch (c4) {
            case "input":
              e24 = Ya(a16, e24);
              d8 = Ya(a16, d8);
              f11 = [];
              break;
            case "select":
              e24 = A2({}, e24, { value: void 0 });
              d8 = A2({}, d8, { value: void 0 });
              f11 = [];
              break;
            case "textarea":
              e24 = gb(a16, e24);
              d8 = gb(a16, d8);
              f11 = [];
              break;
            default:
              "function" !== typeof e24.onClick && "function" === typeof d8.onClick && (a16.onclick = Bf);
          }
          ub(c4, d8);
          var g3;
          c4 = null;
          for (l7 in e24) if (!d8.hasOwnProperty(l7) && e24.hasOwnProperty(l7) && null != e24[l7]) if ("style" === l7) {
            var h = e24[l7];
            for (g3 in h) h.hasOwnProperty(g3) && (c4 || (c4 = {}), c4[g3] = "");
          } else "dangerouslySetInnerHTML" !== l7 && "children" !== l7 && "suppressContentEditableWarning" !== l7 && "suppressHydrationWarning" !== l7 && "autoFocus" !== l7 && (ea.hasOwnProperty(l7) ? f11 || (f11 = []) : (f11 = f11 || []).push(l7, null));
          for (l7 in d8) {
            var k = d8[l7];
            h = null != e24 ? e24[l7] : void 0;
            if (d8.hasOwnProperty(l7) && k !== h && (null != k || null != h)) if ("style" === l7) if (h) {
              for (g3 in h) !h.hasOwnProperty(g3) || k && k.hasOwnProperty(g3) || (c4 || (c4 = {}), c4[g3] = "");
              for (g3 in k) k.hasOwnProperty(g3) && h[g3] !== k[g3] && (c4 || (c4 = {}), c4[g3] = k[g3]);
            } else c4 || (f11 || (f11 = []), f11.push(
              l7,
              c4
            )), c4 = k;
            else "dangerouslySetInnerHTML" === l7 ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f11 = f11 || []).push(l7, k)) : "children" === l7 ? "string" !== typeof k && "number" !== typeof k || (f11 = f11 || []).push(l7, "" + k) : "suppressContentEditableWarning" !== l7 && "suppressHydrationWarning" !== l7 && (ea.hasOwnProperty(l7) ? (null != k && "onScroll" === l7 && D2("scroll", a16), f11 || h === k || (f11 = [])) : (f11 = f11 || []).push(l7, k));
          }
          c4 && (f11 = f11 || []).push("style", c4);
          var l7 = f11;
          if (b2.updateQueue = l7) b2.flags |= 4;
        }
      };
      Cj = function(a16, b2, c4, d8) {
        c4 !== d8 && (b2.flags |= 4);
      };
      function Dj(a16, b2) {
        if (!I2) switch (a16.tailMode) {
          case "hidden":
            b2 = a16.tail;
            for (var c4 = null; null !== b2; ) null !== b2.alternate && (c4 = b2), b2 = b2.sibling;
            null === c4 ? a16.tail = null : c4.sibling = null;
            break;
          case "collapsed":
            c4 = a16.tail;
            for (var d8 = null; null !== c4; ) null !== c4.alternate && (d8 = c4), c4 = c4.sibling;
            null === d8 ? b2 || null === a16.tail ? a16.tail = null : a16.tail.sibling = null : d8.sibling = null;
        }
      }
      function S2(a16) {
        var b2 = null !== a16.alternate && a16.alternate.child === a16.child, c4 = 0, d8 = 0;
        if (b2) for (var e24 = a16.child; null !== e24; ) c4 |= e24.lanes | e24.childLanes, d8 |= e24.subtreeFlags & 14680064, d8 |= e24.flags & 14680064, e24.return = a16, e24 = e24.sibling;
        else for (e24 = a16.child; null !== e24; ) c4 |= e24.lanes | e24.childLanes, d8 |= e24.subtreeFlags, d8 |= e24.flags, e24.return = a16, e24 = e24.sibling;
        a16.subtreeFlags |= d8;
        a16.childLanes = c4;
        return b2;
      }
      function Ej(a16, b2, c4) {
        var d8 = b2.pendingProps;
        wg(b2);
        switch (b2.tag) {
          case 2:
          case 16:
          case 15:
          case 0:
          case 11:
          case 7:
          case 8:
          case 12:
          case 9:
          case 14:
            return S2(b2), null;
          case 1:
            return Zf(b2.type) && $f(), S2(b2), null;
          case 3:
            d8 = b2.stateNode;
            zh();
            E2(Wf);
            E2(H2);
            Eh();
            d8.pendingContext && (d8.context = d8.pendingContext, d8.pendingContext = null);
            if (null === a16 || null === a16.child) Gg(b2) ? b2.flags |= 4 : null === a16 || a16.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Fj(zg), zg = null));
            Aj(a16, b2);
            S2(b2);
            return null;
          case 5:
            Bh(b2);
            var e24 = xh(wh.current);
            c4 = b2.type;
            if (null !== a16 && null != b2.stateNode) Bj(a16, b2, c4, d8, e24), a16.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
            else {
              if (!d8) {
                if (null === b2.stateNode) throw Error(p14(166));
                S2(b2);
                return null;
              }
              a16 = xh(uh.current);
              if (Gg(b2)) {
                d8 = b2.stateNode;
                c4 = b2.type;
                var f11 = b2.memoizedProps;
                d8[Of] = b2;
                d8[Pf] = f11;
                a16 = 0 !== (b2.mode & 1);
                switch (c4) {
                  case "dialog":
                    D2("cancel", d8);
                    D2("close", d8);
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D2("load", d8);
                    break;
                  case "video":
                  case "audio":
                    for (e24 = 0; e24 < lf.length; e24++) D2(lf[e24], d8);
                    break;
                  case "source":
                    D2("error", d8);
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D2(
                      "error",
                      d8
                    );
                    D2("load", d8);
                    break;
                  case "details":
                    D2("toggle", d8);
                    break;
                  case "input":
                    Za(d8, f11);
                    D2("invalid", d8);
                    break;
                  case "select":
                    d8._wrapperState = { wasMultiple: !!f11.multiple };
                    D2("invalid", d8);
                    break;
                  case "textarea":
                    hb(d8, f11), D2("invalid", d8);
                }
                ub(c4, f11);
                e24 = null;
                for (var g3 in f11) if (f11.hasOwnProperty(g3)) {
                  var h = f11[g3];
                  "children" === g3 ? "string" === typeof h ? d8.textContent !== h && (true !== f11.suppressHydrationWarning && Af(d8.textContent, h, a16), e24 = ["children", h]) : "number" === typeof h && d8.textContent !== "" + h && (true !== f11.suppressHydrationWarning && Af(
                    d8.textContent,
                    h,
                    a16
                  ), e24 = ["children", "" + h]) : ea.hasOwnProperty(g3) && null != h && "onScroll" === g3 && D2("scroll", d8);
                }
                switch (c4) {
                  case "input":
                    Va(d8);
                    db(d8, f11, true);
                    break;
                  case "textarea":
                    Va(d8);
                    jb(d8);
                    break;
                  case "select":
                  case "option":
                    break;
                  default:
                    "function" === typeof f11.onClick && (d8.onclick = Bf);
                }
                d8 = e24;
                b2.updateQueue = d8;
                null !== d8 && (b2.flags |= 4);
              } else {
                g3 = 9 === e24.nodeType ? e24 : e24.ownerDocument;
                "http://www.w3.org/1999/xhtml" === a16 && (a16 = kb(c4));
                "http://www.w3.org/1999/xhtml" === a16 ? "script" === c4 ? (a16 = g3.createElement("div"), a16.innerHTML = "<script><\/script>", a16 = a16.removeChild(a16.firstChild)) : "string" === typeof d8.is ? a16 = g3.createElement(c4, { is: d8.is }) : (a16 = g3.createElement(c4), "select" === c4 && (g3 = a16, d8.multiple ? g3.multiple = true : d8.size && (g3.size = d8.size))) : a16 = g3.createElementNS(a16, c4);
                a16[Of] = b2;
                a16[Pf] = d8;
                zj(a16, b2, false, false);
                b2.stateNode = a16;
                a: {
                  g3 = vb(c4, d8);
                  switch (c4) {
                    case "dialog":
                      D2("cancel", a16);
                      D2("close", a16);
                      e24 = d8;
                      break;
                    case "iframe":
                    case "object":
                    case "embed":
                      D2("load", a16);
                      e24 = d8;
                      break;
                    case "video":
                    case "audio":
                      for (e24 = 0; e24 < lf.length; e24++) D2(lf[e24], a16);
                      e24 = d8;
                      break;
                    case "source":
                      D2("error", a16);
                      e24 = d8;
                      break;
                    case "img":
                    case "image":
                    case "link":
                      D2(
                        "error",
                        a16
                      );
                      D2("load", a16);
                      e24 = d8;
                      break;
                    case "details":
                      D2("toggle", a16);
                      e24 = d8;
                      break;
                    case "input":
                      Za(a16, d8);
                      e24 = Ya(a16, d8);
                      D2("invalid", a16);
                      break;
                    case "option":
                      e24 = d8;
                      break;
                    case "select":
                      a16._wrapperState = { wasMultiple: !!d8.multiple };
                      e24 = A2({}, d8, { value: void 0 });
                      D2("invalid", a16);
                      break;
                    case "textarea":
                      hb(a16, d8);
                      e24 = gb(a16, d8);
                      D2("invalid", a16);
                      break;
                    default:
                      e24 = d8;
                  }
                  ub(c4, e24);
                  h = e24;
                  for (f11 in h) if (h.hasOwnProperty(f11)) {
                    var k = h[f11];
                    "style" === f11 ? sb(a16, k) : "dangerouslySetInnerHTML" === f11 ? (k = k ? k.__html : void 0, null != k && nb(a16, k)) : "children" === f11 ? "string" === typeof k ? ("textarea" !== c4 || "" !== k) && ob(a16, k) : "number" === typeof k && ob(a16, "" + k) : "suppressContentEditableWarning" !== f11 && "suppressHydrationWarning" !== f11 && "autoFocus" !== f11 && (ea.hasOwnProperty(f11) ? null != k && "onScroll" === f11 && D2("scroll", a16) : null != k && ta(a16, f11, k, g3));
                  }
                  switch (c4) {
                    case "input":
                      Va(a16);
                      db(a16, d8, false);
                      break;
                    case "textarea":
                      Va(a16);
                      jb(a16);
                      break;
                    case "option":
                      null != d8.value && a16.setAttribute("value", "" + Sa(d8.value));
                      break;
                    case "select":
                      a16.multiple = !!d8.multiple;
                      f11 = d8.value;
                      null != f11 ? fb(a16, !!d8.multiple, f11, false) : null != d8.defaultValue && fb(
                        a16,
                        !!d8.multiple,
                        d8.defaultValue,
                        true
                      );
                      break;
                    default:
                      "function" === typeof e24.onClick && (a16.onclick = Bf);
                  }
                  switch (c4) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      d8 = !!d8.autoFocus;
                      break a;
                    case "img":
                      d8 = true;
                      break a;
                    default:
                      d8 = false;
                  }
                }
                d8 && (b2.flags |= 4);
              }
              null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
            }
            S2(b2);
            return null;
          case 6:
            if (a16 && null != b2.stateNode) Cj(a16, b2, a16.memoizedProps, d8);
            else {
              if ("string" !== typeof d8 && null === b2.stateNode) throw Error(p14(166));
              c4 = xh(wh.current);
              xh(uh.current);
              if (Gg(b2)) {
                d8 = b2.stateNode;
                c4 = b2.memoizedProps;
                d8[Of] = b2;
                if (f11 = d8.nodeValue !== c4) {
                  if (a16 = xg, null !== a16) switch (a16.tag) {
                    case 3:
                      Af(d8.nodeValue, c4, 0 !== (a16.mode & 1));
                      break;
                    case 5:
                      true !== a16.memoizedProps.suppressHydrationWarning && Af(d8.nodeValue, c4, 0 !== (a16.mode & 1));
                  }
                }
                f11 && (b2.flags |= 4);
              } else d8 = (9 === c4.nodeType ? c4 : c4.ownerDocument).createTextNode(d8), d8[Of] = b2, b2.stateNode = d8;
            }
            S2(b2);
            return null;
          case 13:
            E2(L);
            d8 = b2.memoizedState;
            if (null === a16 || null !== a16.memoizedState && null !== a16.memoizedState.dehydrated) {
              if (I2 && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128)) Hg(), Ig(), b2.flags |= 98560, f11 = false;
              else if (f11 = Gg(b2), null !== d8 && null !== d8.dehydrated) {
                if (null === a16) {
                  if (!f11) throw Error(p14(318));
                  f11 = b2.memoizedState;
                  f11 = null !== f11 ? f11.dehydrated : null;
                  if (!f11) throw Error(p14(317));
                  f11[Of] = b2;
                } else Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
                S2(b2);
                f11 = false;
              } else null !== zg && (Fj(zg), zg = null), f11 = true;
              if (!f11) return b2.flags & 65536 ? b2 : null;
            }
            if (0 !== (b2.flags & 128)) return b2.lanes = c4, b2;
            d8 = null !== d8;
            d8 !== (null !== a16 && null !== a16.memoizedState) && d8 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a16 || 0 !== (L.current & 1) ? 0 === T2 && (T2 = 3) : tj()));
            null !== b2.updateQueue && (b2.flags |= 4);
            S2(b2);
            return null;
          case 4:
            return zh(), Aj(a16, b2), null === a16 && sf(b2.stateNode.containerInfo), S2(b2), null;
          case 10:
            return ah(b2.type._context), S2(b2), null;
          case 17:
            return Zf(b2.type) && $f(), S2(b2), null;
          case 19:
            E2(L);
            f11 = b2.memoizedState;
            if (null === f11) return S2(b2), null;
            d8 = 0 !== (b2.flags & 128);
            g3 = f11.rendering;
            if (null === g3) if (d8) Dj(f11, false);
            else {
              if (0 !== T2 || null !== a16 && 0 !== (a16.flags & 128)) for (a16 = b2.child; null !== a16; ) {
                g3 = Ch(a16);
                if (null !== g3) {
                  b2.flags |= 128;
                  Dj(f11, false);
                  d8 = g3.updateQueue;
                  null !== d8 && (b2.updateQueue = d8, b2.flags |= 4);
                  b2.subtreeFlags = 0;
                  d8 = c4;
                  for (c4 = b2.child; null !== c4; ) f11 = c4, a16 = d8, f11.flags &= 14680066, g3 = f11.alternate, null === g3 ? (f11.childLanes = 0, f11.lanes = a16, f11.child = null, f11.subtreeFlags = 0, f11.memoizedProps = null, f11.memoizedState = null, f11.updateQueue = null, f11.dependencies = null, f11.stateNode = null) : (f11.childLanes = g3.childLanes, f11.lanes = g3.lanes, f11.child = g3.child, f11.subtreeFlags = 0, f11.deletions = null, f11.memoizedProps = g3.memoizedProps, f11.memoizedState = g3.memoizedState, f11.updateQueue = g3.updateQueue, f11.type = g3.type, a16 = g3.dependencies, f11.dependencies = null === a16 ? null : { lanes: a16.lanes, firstContext: a16.firstContext }), c4 = c4.sibling;
                  G(L, L.current & 1 | 2);
                  return b2.child;
                }
                a16 = a16.sibling;
              }
              null !== f11.tail && B2() > Gj && (b2.flags |= 128, d8 = true, Dj(f11, false), b2.lanes = 4194304);
            }
            else {
              if (!d8) if (a16 = Ch(g3), null !== a16) {
                if (b2.flags |= 128, d8 = true, c4 = a16.updateQueue, null !== c4 && (b2.updateQueue = c4, b2.flags |= 4), Dj(f11, true), null === f11.tail && "hidden" === f11.tailMode && !g3.alternate && !I2) return S2(b2), null;
              } else 2 * B2() - f11.renderingStartTime > Gj && 1073741824 !== c4 && (b2.flags |= 128, d8 = true, Dj(f11, false), b2.lanes = 4194304);
              f11.isBackwards ? (g3.sibling = b2.child, b2.child = g3) : (c4 = f11.last, null !== c4 ? c4.sibling = g3 : b2.child = g3, f11.last = g3);
            }
            if (null !== f11.tail) return b2 = f11.tail, f11.rendering = b2, f11.tail = b2.sibling, f11.renderingStartTime = B2(), b2.sibling = null, c4 = L.current, G(L, d8 ? c4 & 1 | 2 : c4 & 1), b2;
            S2(b2);
            return null;
          case 22:
          case 23:
            return Hj(), d8 = null !== b2.memoizedState, null !== a16 && null !== a16.memoizedState !== d8 && (b2.flags |= 8192), d8 && 0 !== (b2.mode & 1) ? 0 !== (fj & 1073741824) && (S2(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S2(b2), null;
          case 24:
            return null;
          case 25:
            return null;
        }
        throw Error(p14(156, b2.tag));
      }
      function Ij(a16, b2) {
        wg(b2);
        switch (b2.tag) {
          case 1:
            return Zf(b2.type) && $f(), a16 = b2.flags, a16 & 65536 ? (b2.flags = a16 & -65537 | 128, b2) : null;
          case 3:
            return zh(), E2(Wf), E2(H2), Eh(), a16 = b2.flags, 0 !== (a16 & 65536) && 0 === (a16 & 128) ? (b2.flags = a16 & -65537 | 128, b2) : null;
          case 5:
            return Bh(b2), null;
          case 13:
            E2(L);
            a16 = b2.memoizedState;
            if (null !== a16 && null !== a16.dehydrated) {
              if (null === b2.alternate) throw Error(p14(340));
              Ig();
            }
            a16 = b2.flags;
            return a16 & 65536 ? (b2.flags = a16 & -65537 | 128, b2) : null;
          case 19:
            return E2(L), null;
          case 4:
            return zh(), null;
          case 10:
            return ah(b2.type._context), null;
          case 22:
          case 23:
            return Hj(), null;
          case 24:
            return null;
          default:
            return null;
        }
      }
      var Jj = false;
      var U = false;
      var Kj = "function" === typeof WeakSet ? WeakSet : Set;
      var V = null;
      function Lj(a16, b2) {
        var c4 = a16.ref;
        if (null !== c4) if ("function" === typeof c4) try {
          c4(null);
        } catch (d8) {
          W(a16, b2, d8);
        }
        else c4.current = null;
      }
      function Mj(a16, b2, c4) {
        try {
          c4();
        } catch (d8) {
          W(a16, b2, d8);
        }
      }
      var Nj = false;
      function Oj(a16, b2) {
        Cf = dd;
        a16 = Me();
        if (Ne(a16)) {
          if ("selectionStart" in a16) var c4 = { start: a16.selectionStart, end: a16.selectionEnd };
          else a: {
            c4 = (c4 = a16.ownerDocument) && c4.defaultView || window;
            var d8 = c4.getSelection && c4.getSelection();
            if (d8 && 0 !== d8.rangeCount) {
              c4 = d8.anchorNode;
              var e24 = d8.anchorOffset, f11 = d8.focusNode;
              d8 = d8.focusOffset;
              try {
                c4.nodeType, f11.nodeType;
              } catch (F) {
                c4 = null;
                break a;
              }
              var g3 = 0, h = -1, k = -1, l7 = 0, m6 = 0, q = a16, r25 = null;
              b: for (; ; ) {
                for (var y; ; ) {
                  q !== c4 || 0 !== e24 && 3 !== q.nodeType || (h = g3 + e24);
                  q !== f11 || 0 !== d8 && 3 !== q.nodeType || (k = g3 + d8);
                  3 === q.nodeType && (g3 += q.nodeValue.length);
                  if (null === (y = q.firstChild)) break;
                  r25 = q;
                  q = y;
                }
                for (; ; ) {
                  if (q === a16) break b;
                  r25 === c4 && ++l7 === e24 && (h = g3);
                  r25 === f11 && ++m6 === d8 && (k = g3);
                  if (null !== (y = q.nextSibling)) break;
                  q = r25;
                  r25 = q.parentNode;
                }
                q = y;
              }
              c4 = -1 === h || -1 === k ? null : { start: h, end: k };
            } else c4 = null;
          }
          c4 = c4 || { start: 0, end: 0 };
        } else c4 = null;
        Df = { focusedElem: a16, selectionRange: c4 };
        dd = false;
        for (V = b2; null !== V; ) if (b2 = V, a16 = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a16) a16.return = b2, V = a16;
        else for (; null !== V; ) {
          b2 = V;
          try {
            var n12 = b2.alternate;
            if (0 !== (b2.flags & 1024)) switch (b2.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (null !== n12) {
                  var t15 = n12.memoizedProps, J = n12.memoizedState, x2 = b2.stateNode, w = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t15 : Ci(b2.type, t15), J);
                  x2.__reactInternalSnapshotBeforeUpdate = w;
                }
                break;
              case 3:
                var u5 = b2.stateNode.containerInfo;
                1 === u5.nodeType ? u5.textContent = "" : 9 === u5.nodeType && u5.documentElement && u5.removeChild(u5.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p14(163));
            }
          } catch (F) {
            W(b2, b2.return, F);
          }
          a16 = b2.sibling;
          if (null !== a16) {
            a16.return = b2.return;
            V = a16;
            break;
          }
          V = b2.return;
        }
        n12 = Nj;
        Nj = false;
        return n12;
      }
      function Pj(a16, b2, c4) {
        var d8 = b2.updateQueue;
        d8 = null !== d8 ? d8.lastEffect : null;
        if (null !== d8) {
          var e24 = d8 = d8.next;
          do {
            if ((e24.tag & a16) === a16) {
              var f11 = e24.destroy;
              e24.destroy = void 0;
              void 0 !== f11 && Mj(b2, c4, f11);
            }
            e24 = e24.next;
          } while (e24 !== d8);
        }
      }
      function Qj(a16, b2) {
        b2 = b2.updateQueue;
        b2 = null !== b2 ? b2.lastEffect : null;
        if (null !== b2) {
          var c4 = b2 = b2.next;
          do {
            if ((c4.tag & a16) === a16) {
              var d8 = c4.create;
              c4.destroy = d8();
            }
            c4 = c4.next;
          } while (c4 !== b2);
        }
      }
      function Rj(a16) {
        var b2 = a16.ref;
        if (null !== b2) {
          var c4 = a16.stateNode;
          switch (a16.tag) {
            case 5:
              a16 = c4;
              break;
            default:
              a16 = c4;
          }
          "function" === typeof b2 ? b2(a16) : b2.current = a16;
        }
      }
      function Sj(a16) {
        var b2 = a16.alternate;
        null !== b2 && (a16.alternate = null, Sj(b2));
        a16.child = null;
        a16.deletions = null;
        a16.sibling = null;
        5 === a16.tag && (b2 = a16.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
        a16.stateNode = null;
        a16.return = null;
        a16.dependencies = null;
        a16.memoizedProps = null;
        a16.memoizedState = null;
        a16.pendingProps = null;
        a16.stateNode = null;
        a16.updateQueue = null;
      }
      function Tj(a16) {
        return 5 === a16.tag || 3 === a16.tag || 4 === a16.tag;
      }
      function Uj(a16) {
        a: for (; ; ) {
          for (; null === a16.sibling; ) {
            if (null === a16.return || Tj(a16.return)) return null;
            a16 = a16.return;
          }
          a16.sibling.return = a16.return;
          for (a16 = a16.sibling; 5 !== a16.tag && 6 !== a16.tag && 18 !== a16.tag; ) {
            if (a16.flags & 2) continue a;
            if (null === a16.child || 4 === a16.tag) continue a;
            else a16.child.return = a16, a16 = a16.child;
          }
          if (!(a16.flags & 2)) return a16.stateNode;
        }
      }
      function Vj(a16, b2, c4) {
        var d8 = a16.tag;
        if (5 === d8 || 6 === d8) a16 = a16.stateNode, b2 ? 8 === c4.nodeType ? c4.parentNode.insertBefore(a16, b2) : c4.insertBefore(a16, b2) : (8 === c4.nodeType ? (b2 = c4.parentNode, b2.insertBefore(a16, c4)) : (b2 = c4, b2.appendChild(a16)), c4 = c4._reactRootContainer, null !== c4 && void 0 !== c4 || null !== b2.onclick || (b2.onclick = Bf));
        else if (4 !== d8 && (a16 = a16.child, null !== a16)) for (Vj(a16, b2, c4), a16 = a16.sibling; null !== a16; ) Vj(a16, b2, c4), a16 = a16.sibling;
      }
      function Wj(a16, b2, c4) {
        var d8 = a16.tag;
        if (5 === d8 || 6 === d8) a16 = a16.stateNode, b2 ? c4.insertBefore(a16, b2) : c4.appendChild(a16);
        else if (4 !== d8 && (a16 = a16.child, null !== a16)) for (Wj(a16, b2, c4), a16 = a16.sibling; null !== a16; ) Wj(a16, b2, c4), a16 = a16.sibling;
      }
      var X = null;
      var Xj = false;
      function Yj(a16, b2, c4) {
        for (c4 = c4.child; null !== c4; ) Zj(a16, b2, c4), c4 = c4.sibling;
      }
      function Zj(a16, b2, c4) {
        if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
          lc.onCommitFiberUnmount(kc, c4);
        } catch (h) {
        }
        switch (c4.tag) {
          case 5:
            U || Lj(c4, b2);
          case 6:
            var d8 = X, e24 = Xj;
            X = null;
            Yj(a16, b2, c4);
            X = d8;
            Xj = e24;
            null !== X && (Xj ? (a16 = X, c4 = c4.stateNode, 8 === a16.nodeType ? a16.parentNode.removeChild(c4) : a16.removeChild(c4)) : X.removeChild(c4.stateNode));
            break;
          case 18:
            null !== X && (Xj ? (a16 = X, c4 = c4.stateNode, 8 === a16.nodeType ? Kf(a16.parentNode, c4) : 1 === a16.nodeType && Kf(a16, c4), bd(a16)) : Kf(X, c4.stateNode));
            break;
          case 4:
            d8 = X;
            e24 = Xj;
            X = c4.stateNode.containerInfo;
            Xj = true;
            Yj(a16, b2, c4);
            X = d8;
            Xj = e24;
            break;
          case 0:
          case 11:
          case 14:
          case 15:
            if (!U && (d8 = c4.updateQueue, null !== d8 && (d8 = d8.lastEffect, null !== d8))) {
              e24 = d8 = d8.next;
              do {
                var f11 = e24, g3 = f11.destroy;
                f11 = f11.tag;
                void 0 !== g3 && (0 !== (f11 & 2) ? Mj(c4, b2, g3) : 0 !== (f11 & 4) && Mj(c4, b2, g3));
                e24 = e24.next;
              } while (e24 !== d8);
            }
            Yj(a16, b2, c4);
            break;
          case 1:
            if (!U && (Lj(c4, b2), d8 = c4.stateNode, "function" === typeof d8.componentWillUnmount)) try {
              d8.props = c4.memoizedProps, d8.state = c4.memoizedState, d8.componentWillUnmount();
            } catch (h) {
              W(c4, b2, h);
            }
            Yj(a16, b2, c4);
            break;
          case 21:
            Yj(a16, b2, c4);
            break;
          case 22:
            c4.mode & 1 ? (U = (d8 = U) || null !== c4.memoizedState, Yj(a16, b2, c4), U = d8) : Yj(a16, b2, c4);
            break;
          default:
            Yj(a16, b2, c4);
        }
      }
      function ak(a16) {
        var b2 = a16.updateQueue;
        if (null !== b2) {
          a16.updateQueue = null;
          var c4 = a16.stateNode;
          null === c4 && (c4 = a16.stateNode = new Kj());
          b2.forEach(function(b3) {
            var d8 = bk.bind(null, a16, b3);
            c4.has(b3) || (c4.add(b3), b3.then(d8, d8));
          });
        }
      }
      function ck(a16, b2) {
        var c4 = b2.deletions;
        if (null !== c4) for (var d8 = 0; d8 < c4.length; d8++) {
          var e24 = c4[d8];
          try {
            var f11 = a16, g3 = b2, h = g3;
            a: for (; null !== h; ) {
              switch (h.tag) {
                case 5:
                  X = h.stateNode;
                  Xj = false;
                  break a;
                case 3:
                  X = h.stateNode.containerInfo;
                  Xj = true;
                  break a;
                case 4:
                  X = h.stateNode.containerInfo;
                  Xj = true;
                  break a;
              }
              h = h.return;
            }
            if (null === X) throw Error(p14(160));
            Zj(f11, g3, e24);
            X = null;
            Xj = false;
            var k = e24.alternate;
            null !== k && (k.return = null);
            e24.return = null;
          } catch (l7) {
            W(e24, b2, l7);
          }
        }
        if (b2.subtreeFlags & 12854) for (b2 = b2.child; null !== b2; ) dk(b2, a16), b2 = b2.sibling;
      }
      function dk(a16, b2) {
        var c4 = a16.alternate, d8 = a16.flags;
        switch (a16.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            ck(b2, a16);
            ek(a16);
            if (d8 & 4) {
              try {
                Pj(3, a16, a16.return), Qj(3, a16);
              } catch (t15) {
                W(a16, a16.return, t15);
              }
              try {
                Pj(5, a16, a16.return);
              } catch (t15) {
                W(a16, a16.return, t15);
              }
            }
            break;
          case 1:
            ck(b2, a16);
            ek(a16);
            d8 & 512 && null !== c4 && Lj(c4, c4.return);
            break;
          case 5:
            ck(b2, a16);
            ek(a16);
            d8 & 512 && null !== c4 && Lj(c4, c4.return);
            if (a16.flags & 32) {
              var e24 = a16.stateNode;
              try {
                ob(e24, "");
              } catch (t15) {
                W(a16, a16.return, t15);
              }
            }
            if (d8 & 4 && (e24 = a16.stateNode, null != e24)) {
              var f11 = a16.memoizedProps, g3 = null !== c4 ? c4.memoizedProps : f11, h = a16.type, k = a16.updateQueue;
              a16.updateQueue = null;
              if (null !== k) try {
                "input" === h && "radio" === f11.type && null != f11.name && ab(e24, f11);
                vb(h, g3);
                var l7 = vb(h, f11);
                for (g3 = 0; g3 < k.length; g3 += 2) {
                  var m6 = k[g3], q = k[g3 + 1];
                  "style" === m6 ? sb(e24, q) : "dangerouslySetInnerHTML" === m6 ? nb(e24, q) : "children" === m6 ? ob(e24, q) : ta(e24, m6, q, l7);
                }
                switch (h) {
                  case "input":
                    bb(e24, f11);
                    break;
                  case "textarea":
                    ib(e24, f11);
                    break;
                  case "select":
                    var r25 = e24._wrapperState.wasMultiple;
                    e24._wrapperState.wasMultiple = !!f11.multiple;
                    var y = f11.value;
                    null != y ? fb(e24, !!f11.multiple, y, false) : r25 !== !!f11.multiple && (null != f11.defaultValue ? fb(
                      e24,
                      !!f11.multiple,
                      f11.defaultValue,
                      true
                    ) : fb(e24, !!f11.multiple, f11.multiple ? [] : "", false));
                }
                e24[Pf] = f11;
              } catch (t15) {
                W(a16, a16.return, t15);
              }
            }
            break;
          case 6:
            ck(b2, a16);
            ek(a16);
            if (d8 & 4) {
              if (null === a16.stateNode) throw Error(p14(162));
              e24 = a16.stateNode;
              f11 = a16.memoizedProps;
              try {
                e24.nodeValue = f11;
              } catch (t15) {
                W(a16, a16.return, t15);
              }
            }
            break;
          case 3:
            ck(b2, a16);
            ek(a16);
            if (d8 & 4 && null !== c4 && c4.memoizedState.isDehydrated) try {
              bd(b2.containerInfo);
            } catch (t15) {
              W(a16, a16.return, t15);
            }
            break;
          case 4:
            ck(b2, a16);
            ek(a16);
            break;
          case 13:
            ck(b2, a16);
            ek(a16);
            e24 = a16.child;
            e24.flags & 8192 && (f11 = null !== e24.memoizedState, e24.stateNode.isHidden = f11, !f11 || null !== e24.alternate && null !== e24.alternate.memoizedState || (fk = B2()));
            d8 & 4 && ak(a16);
            break;
          case 22:
            m6 = null !== c4 && null !== c4.memoizedState;
            a16.mode & 1 ? (U = (l7 = U) || m6, ck(b2, a16), U = l7) : ck(b2, a16);
            ek(a16);
            if (d8 & 8192) {
              l7 = null !== a16.memoizedState;
              if ((a16.stateNode.isHidden = l7) && !m6 && 0 !== (a16.mode & 1)) for (V = a16, m6 = a16.child; null !== m6; ) {
                for (q = V = m6; null !== V; ) {
                  r25 = V;
                  y = r25.child;
                  switch (r25.tag) {
                    case 0:
                    case 11:
                    case 14:
                    case 15:
                      Pj(4, r25, r25.return);
                      break;
                    case 1:
                      Lj(r25, r25.return);
                      var n12 = r25.stateNode;
                      if ("function" === typeof n12.componentWillUnmount) {
                        d8 = r25;
                        c4 = r25.return;
                        try {
                          b2 = d8, n12.props = b2.memoizedProps, n12.state = b2.memoizedState, n12.componentWillUnmount();
                        } catch (t15) {
                          W(d8, c4, t15);
                        }
                      }
                      break;
                    case 5:
                      Lj(r25, r25.return);
                      break;
                    case 22:
                      if (null !== r25.memoizedState) {
                        gk(q);
                        continue;
                      }
                  }
                  null !== y ? (y.return = r25, V = y) : gk(q);
                }
                m6 = m6.sibling;
              }
              a: for (m6 = null, q = a16; ; ) {
                if (5 === q.tag) {
                  if (null === m6) {
                    m6 = q;
                    try {
                      e24 = q.stateNode, l7 ? (f11 = e24.style, "function" === typeof f11.setProperty ? f11.setProperty("display", "none", "important") : f11.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g3 = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g3));
                    } catch (t15) {
                      W(a16, a16.return, t15);
                    }
                  }
                } else if (6 === q.tag) {
                  if (null === m6) try {
                    q.stateNode.nodeValue = l7 ? "" : q.memoizedProps;
                  } catch (t15) {
                    W(a16, a16.return, t15);
                  }
                } else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a16) && null !== q.child) {
                  q.child.return = q;
                  q = q.child;
                  continue;
                }
                if (q === a16) break a;
                for (; null === q.sibling; ) {
                  if (null === q.return || q.return === a16) break a;
                  m6 === q && (m6 = null);
                  q = q.return;
                }
                m6 === q && (m6 = null);
                q.sibling.return = q.return;
                q = q.sibling;
              }
            }
            break;
          case 19:
            ck(b2, a16);
            ek(a16);
            d8 & 4 && ak(a16);
            break;
          case 21:
            break;
          default:
            ck(
              b2,
              a16
            ), ek(a16);
        }
      }
      function ek(a16) {
        var b2 = a16.flags;
        if (b2 & 2) {
          try {
            a: {
              for (var c4 = a16.return; null !== c4; ) {
                if (Tj(c4)) {
                  var d8 = c4;
                  break a;
                }
                c4 = c4.return;
              }
              throw Error(p14(160));
            }
            switch (d8.tag) {
              case 5:
                var e24 = d8.stateNode;
                d8.flags & 32 && (ob(e24, ""), d8.flags &= -33);
                var f11 = Uj(a16);
                Wj(a16, f11, e24);
                break;
              case 3:
              case 4:
                var g3 = d8.stateNode.containerInfo, h = Uj(a16);
                Vj(a16, h, g3);
                break;
              default:
                throw Error(p14(161));
            }
          } catch (k) {
            W(a16, a16.return, k);
          }
          a16.flags &= -3;
        }
        b2 & 4096 && (a16.flags &= -4097);
      }
      function hk(a16, b2, c4) {
        V = a16;
        ik(a16, b2, c4);
      }
      function ik(a16, b2, c4) {
        for (var d8 = 0 !== (a16.mode & 1); null !== V; ) {
          var e24 = V, f11 = e24.child;
          if (22 === e24.tag && d8) {
            var g3 = null !== e24.memoizedState || Jj;
            if (!g3) {
              var h = e24.alternate, k = null !== h && null !== h.memoizedState || U;
              h = Jj;
              var l7 = U;
              Jj = g3;
              if ((U = k) && !l7) for (V = e24; null !== V; ) g3 = V, k = g3.child, 22 === g3.tag && null !== g3.memoizedState ? jk(e24) : null !== k ? (k.return = g3, V = k) : jk(e24);
              for (; null !== f11; ) V = f11, ik(f11, b2, c4), f11 = f11.sibling;
              V = e24;
              Jj = h;
              U = l7;
            }
            kk(a16, b2, c4);
          } else 0 !== (e24.subtreeFlags & 8772) && null !== f11 ? (f11.return = e24, V = f11) : kk(a16, b2, c4);
        }
      }
      function kk(a16) {
        for (; null !== V; ) {
          var b2 = V;
          if (0 !== (b2.flags & 8772)) {
            var c4 = b2.alternate;
            try {
              if (0 !== (b2.flags & 8772)) switch (b2.tag) {
                case 0:
                case 11:
                case 15:
                  U || Qj(5, b2);
                  break;
                case 1:
                  var d8 = b2.stateNode;
                  if (b2.flags & 4 && !U) if (null === c4) d8.componentDidMount();
                  else {
                    var e24 = b2.elementType === b2.type ? c4.memoizedProps : Ci(b2.type, c4.memoizedProps);
                    d8.componentDidUpdate(e24, c4.memoizedState, d8.__reactInternalSnapshotBeforeUpdate);
                  }
                  var f11 = b2.updateQueue;
                  null !== f11 && sh(b2, f11, d8);
                  break;
                case 3:
                  var g3 = b2.updateQueue;
                  if (null !== g3) {
                    c4 = null;
                    if (null !== b2.child) switch (b2.child.tag) {
                      case 5:
                        c4 = b2.child.stateNode;
                        break;
                      case 1:
                        c4 = b2.child.stateNode;
                    }
                    sh(b2, g3, c4);
                  }
                  break;
                case 5:
                  var h = b2.stateNode;
                  if (null === c4 && b2.flags & 4) {
                    c4 = h;
                    var k = b2.memoizedProps;
                    switch (b2.type) {
                      case "button":
                      case "input":
                      case "select":
                      case "textarea":
                        k.autoFocus && c4.focus();
                        break;
                      case "img":
                        k.src && (c4.src = k.src);
                    }
                  }
                  break;
                case 6:
                  break;
                case 4:
                  break;
                case 12:
                  break;
                case 13:
                  if (null === b2.memoizedState) {
                    var l7 = b2.alternate;
                    if (null !== l7) {
                      var m6 = l7.memoizedState;
                      if (null !== m6) {
                        var q = m6.dehydrated;
                        null !== q && bd(q);
                      }
                    }
                  }
                  break;
                case 19:
                case 17:
                case 21:
                case 22:
                case 23:
                case 25:
                  break;
                default:
                  throw Error(p14(163));
              }
              U || b2.flags & 512 && Rj(b2);
            } catch (r25) {
              W(b2, b2.return, r25);
            }
          }
          if (b2 === a16) {
            V = null;
            break;
          }
          c4 = b2.sibling;
          if (null !== c4) {
            c4.return = b2.return;
            V = c4;
            break;
          }
          V = b2.return;
        }
      }
      function gk(a16) {
        for (; null !== V; ) {
          var b2 = V;
          if (b2 === a16) {
            V = null;
            break;
          }
          var c4 = b2.sibling;
          if (null !== c4) {
            c4.return = b2.return;
            V = c4;
            break;
          }
          V = b2.return;
        }
      }
      function jk(a16) {
        for (; null !== V; ) {
          var b2 = V;
          try {
            switch (b2.tag) {
              case 0:
              case 11:
              case 15:
                var c4 = b2.return;
                try {
                  Qj(4, b2);
                } catch (k) {
                  W(b2, c4, k);
                }
                break;
              case 1:
                var d8 = b2.stateNode;
                if ("function" === typeof d8.componentDidMount) {
                  var e24 = b2.return;
                  try {
                    d8.componentDidMount();
                  } catch (k) {
                    W(b2, e24, k);
                  }
                }
                var f11 = b2.return;
                try {
                  Rj(b2);
                } catch (k) {
                  W(b2, f11, k);
                }
                break;
              case 5:
                var g3 = b2.return;
                try {
                  Rj(b2);
                } catch (k) {
                  W(b2, g3, k);
                }
            }
          } catch (k) {
            W(b2, b2.return, k);
          }
          if (b2 === a16) {
            V = null;
            break;
          }
          var h = b2.sibling;
          if (null !== h) {
            h.return = b2.return;
            V = h;
            break;
          }
          V = b2.return;
        }
      }
      var lk = Math.ceil;
      var mk = ua.ReactCurrentDispatcher;
      var nk = ua.ReactCurrentOwner;
      var ok = ua.ReactCurrentBatchConfig;
      var K = 0;
      var Q = null;
      var Y = null;
      var Z = 0;
      var fj = 0;
      var ej = Uf(0);
      var T2 = 0;
      var pk = null;
      var rh = 0;
      var qk = 0;
      var rk = 0;
      var sk = null;
      var tk = null;
      var fk = 0;
      var Gj = Infinity;
      var uk = null;
      var Oi = false;
      var Pi = null;
      var Ri = null;
      var vk = false;
      var wk = null;
      var xk = 0;
      var yk = 0;
      var zk = null;
      var Ak = -1;
      var Bk = 0;
      function R4() {
        return 0 !== (K & 6) ? B2() : -1 !== Ak ? Ak : Ak = B2();
      }
      function yi(a16) {
        if (0 === (a16.mode & 1)) return 1;
        if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
        if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
        a16 = C;
        if (0 !== a16) return a16;
        a16 = window.event;
        a16 = void 0 === a16 ? 16 : jd(a16.type);
        return a16;
      }
      function gi(a16, b2, c4, d8) {
        if (50 < yk) throw yk = 0, zk = null, Error(p14(185));
        Ac(a16, c4, d8);
        if (0 === (K & 2) || a16 !== Q) a16 === Q && (0 === (K & 2) && (qk |= c4), 4 === T2 && Ck(a16, Z)), Dk(a16, d8), 1 === c4 && 0 === K && 0 === (b2.mode & 1) && (Gj = B2() + 500, fg && jg());
      }
      function Dk(a16, b2) {
        var c4 = a16.callbackNode;
        wc(a16, b2);
        var d8 = uc(a16, a16 === Q ? Z : 0);
        if (0 === d8) null !== c4 && bc(c4), a16.callbackNode = null, a16.callbackPriority = 0;
        else if (b2 = d8 & -d8, a16.callbackPriority !== b2) {
          null != c4 && bc(c4);
          if (1 === b2) 0 === a16.tag ? ig(Ek.bind(null, a16)) : hg(Ek.bind(null, a16)), Jf(function() {
            0 === (K & 6) && jg();
          }), c4 = null;
          else {
            switch (Dc(d8)) {
              case 1:
                c4 = fc;
                break;
              case 4:
                c4 = gc;
                break;
              case 16:
                c4 = hc;
                break;
              case 536870912:
                c4 = jc;
                break;
              default:
                c4 = hc;
            }
            c4 = Fk(c4, Gk.bind(null, a16));
          }
          a16.callbackPriority = b2;
          a16.callbackNode = c4;
        }
      }
      function Gk(a16, b2) {
        Ak = -1;
        Bk = 0;
        if (0 !== (K & 6)) throw Error(p14(327));
        var c4 = a16.callbackNode;
        if (Hk() && a16.callbackNode !== c4) return null;
        var d8 = uc(a16, a16 === Q ? Z : 0);
        if (0 === d8) return null;
        if (0 !== (d8 & 30) || 0 !== (d8 & a16.expiredLanes) || b2) b2 = Ik(a16, d8);
        else {
          b2 = d8;
          var e24 = K;
          K |= 2;
          var f11 = Jk();
          if (Q !== a16 || Z !== b2) uk = null, Gj = B2() + 500, Kk(a16, b2);
          do
            try {
              Lk();
              break;
            } catch (h) {
              Mk(a16, h);
            }
          while (1);
          $g();
          mk.current = f11;
          K = e24;
          null !== Y ? b2 = 0 : (Q = null, Z = 0, b2 = T2);
        }
        if (0 !== b2) {
          2 === b2 && (e24 = xc(a16), 0 !== e24 && (d8 = e24, b2 = Nk(a16, e24)));
          if (1 === b2) throw c4 = pk, Kk(a16, 0), Ck(a16, d8), Dk(a16, B2()), c4;
          if (6 === b2) Ck(a16, d8);
          else {
            e24 = a16.current.alternate;
            if (0 === (d8 & 30) && !Ok(e24) && (b2 = Ik(a16, d8), 2 === b2 && (f11 = xc(a16), 0 !== f11 && (d8 = f11, b2 = Nk(a16, f11))), 1 === b2)) throw c4 = pk, Kk(a16, 0), Ck(a16, d8), Dk(a16, B2()), c4;
            a16.finishedWork = e24;
            a16.finishedLanes = d8;
            switch (b2) {
              case 0:
              case 1:
                throw Error(p14(345));
              case 2:
                Pk(a16, tk, uk);
                break;
              case 3:
                Ck(a16, d8);
                if ((d8 & 130023424) === d8 && (b2 = fk + 500 - B2(), 10 < b2)) {
                  if (0 !== uc(a16, 0)) break;
                  e24 = a16.suspendedLanes;
                  if ((e24 & d8) !== d8) {
                    R4();
                    a16.pingedLanes |= a16.suspendedLanes & e24;
                    break;
                  }
                  a16.timeoutHandle = Ff(Pk.bind(null, a16, tk, uk), b2);
                  break;
                }
                Pk(a16, tk, uk);
                break;
              case 4:
                Ck(a16, d8);
                if ((d8 & 4194240) === d8) break;
                b2 = a16.eventTimes;
                for (e24 = -1; 0 < d8; ) {
                  var g3 = 31 - oc(d8);
                  f11 = 1 << g3;
                  g3 = b2[g3];
                  g3 > e24 && (e24 = g3);
                  d8 &= ~f11;
                }
                d8 = e24;
                d8 = B2() - d8;
                d8 = (120 > d8 ? 120 : 480 > d8 ? 480 : 1080 > d8 ? 1080 : 1920 > d8 ? 1920 : 3e3 > d8 ? 3e3 : 4320 > d8 ? 4320 : 1960 * lk(d8 / 1960)) - d8;
                if (10 < d8) {
                  a16.timeoutHandle = Ff(Pk.bind(null, a16, tk, uk), d8);
                  break;
                }
                Pk(a16, tk, uk);
                break;
              case 5:
                Pk(a16, tk, uk);
                break;
              default:
                throw Error(p14(329));
            }
          }
        }
        Dk(a16, B2());
        return a16.callbackNode === c4 ? Gk.bind(null, a16) : null;
      }
      function Nk(a16, b2) {
        var c4 = sk;
        a16.current.memoizedState.isDehydrated && (Kk(a16, b2).flags |= 256);
        a16 = Ik(a16, b2);
        2 !== a16 && (b2 = tk, tk = c4, null !== b2 && Fj(b2));
        return a16;
      }
      function Fj(a16) {
        null === tk ? tk = a16 : tk.push.apply(tk, a16);
      }
      function Ok(a16) {
        for (var b2 = a16; ; ) {
          if (b2.flags & 16384) {
            var c4 = b2.updateQueue;
            if (null !== c4 && (c4 = c4.stores, null !== c4)) for (var d8 = 0; d8 < c4.length; d8++) {
              var e24 = c4[d8], f11 = e24.getSnapshot;
              e24 = e24.value;
              try {
                if (!He(f11(), e24)) return false;
              } catch (g3) {
                return false;
              }
            }
          }
          c4 = b2.child;
          if (b2.subtreeFlags & 16384 && null !== c4) c4.return = b2, b2 = c4;
          else {
            if (b2 === a16) break;
            for (; null === b2.sibling; ) {
              if (null === b2.return || b2.return === a16) return true;
              b2 = b2.return;
            }
            b2.sibling.return = b2.return;
            b2 = b2.sibling;
          }
        }
        return true;
      }
      function Ck(a16, b2) {
        b2 &= ~rk;
        b2 &= ~qk;
        a16.suspendedLanes |= b2;
        a16.pingedLanes &= ~b2;
        for (a16 = a16.expirationTimes; 0 < b2; ) {
          var c4 = 31 - oc(b2), d8 = 1 << c4;
          a16[c4] = -1;
          b2 &= ~d8;
        }
      }
      function Ek(a16) {
        if (0 !== (K & 6)) throw Error(p14(327));
        Hk();
        var b2 = uc(a16, 0);
        if (0 === (b2 & 1)) return Dk(a16, B2()), null;
        var c4 = Ik(a16, b2);
        if (0 !== a16.tag && 2 === c4) {
          var d8 = xc(a16);
          0 !== d8 && (b2 = d8, c4 = Nk(a16, d8));
        }
        if (1 === c4) throw c4 = pk, Kk(a16, 0), Ck(a16, b2), Dk(a16, B2()), c4;
        if (6 === c4) throw Error(p14(345));
        a16.finishedWork = a16.current.alternate;
        a16.finishedLanes = b2;
        Pk(a16, tk, uk);
        Dk(a16, B2());
        return null;
      }
      function Qk(a16, b2) {
        var c4 = K;
        K |= 1;
        try {
          return a16(b2);
        } finally {
          K = c4, 0 === K && (Gj = B2() + 500, fg && jg());
        }
      }
      function Rk(a16) {
        null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
        var b2 = K;
        K |= 1;
        var c4 = ok.transition, d8 = C;
        try {
          if (ok.transition = null, C = 1, a16) return a16();
        } finally {
          C = d8, ok.transition = c4, K = b2, 0 === (K & 6) && jg();
        }
      }
      function Hj() {
        fj = ej.current;
        E2(ej);
      }
      function Kk(a16, b2) {
        a16.finishedWork = null;
        a16.finishedLanes = 0;
        var c4 = a16.timeoutHandle;
        -1 !== c4 && (a16.timeoutHandle = -1, Gf(c4));
        if (null !== Y) for (c4 = Y.return; null !== c4; ) {
          var d8 = c4;
          wg(d8);
          switch (d8.tag) {
            case 1:
              d8 = d8.type.childContextTypes;
              null !== d8 && void 0 !== d8 && $f();
              break;
            case 3:
              zh();
              E2(Wf);
              E2(H2);
              Eh();
              break;
            case 5:
              Bh(d8);
              break;
            case 4:
              zh();
              break;
            case 13:
              E2(L);
              break;
            case 19:
              E2(L);
              break;
            case 10:
              ah(d8.type._context);
              break;
            case 22:
            case 23:
              Hj();
          }
          c4 = c4.return;
        }
        Q = a16;
        Y = a16 = Pg(a16.current, null);
        Z = fj = b2;
        T2 = 0;
        pk = null;
        rk = qk = rh = 0;
        tk = sk = null;
        if (null !== fh) {
          for (b2 = 0; b2 < fh.length; b2++) if (c4 = fh[b2], d8 = c4.interleaved, null !== d8) {
            c4.interleaved = null;
            var e24 = d8.next, f11 = c4.pending;
            if (null !== f11) {
              var g3 = f11.next;
              f11.next = e24;
              d8.next = g3;
            }
            c4.pending = d8;
          }
          fh = null;
        }
        return a16;
      }
      function Mk(a16, b2) {
        do {
          var c4 = Y;
          try {
            $g();
            Fh.current = Rh;
            if (Ih) {
              for (var d8 = M.memoizedState; null !== d8; ) {
                var e24 = d8.queue;
                null !== e24 && (e24.pending = null);
                d8 = d8.next;
              }
              Ih = false;
            }
            Hh = 0;
            O = N2 = M = null;
            Jh = false;
            Kh = 0;
            nk.current = null;
            if (null === c4 || null === c4.return) {
              T2 = 1;
              pk = b2;
              Y = null;
              break;
            }
            a: {
              var f11 = a16, g3 = c4.return, h = c4, k = b2;
              b2 = Z;
              h.flags |= 32768;
              if (null !== k && "object" === typeof k && "function" === typeof k.then) {
                var l7 = k, m6 = h, q = m6.tag;
                if (0 === (m6.mode & 1) && (0 === q || 11 === q || 15 === q)) {
                  var r25 = m6.alternate;
                  r25 ? (m6.updateQueue = r25.updateQueue, m6.memoizedState = r25.memoizedState, m6.lanes = r25.lanes) : (m6.updateQueue = null, m6.memoizedState = null);
                }
                var y = Ui(g3);
                if (null !== y) {
                  y.flags &= -257;
                  Vi(y, g3, h, f11, b2);
                  y.mode & 1 && Si(f11, l7, b2);
                  b2 = y;
                  k = l7;
                  var n12 = b2.updateQueue;
                  if (null === n12) {
                    var t15 = /* @__PURE__ */ new Set();
                    t15.add(k);
                    b2.updateQueue = t15;
                  } else n12.add(k);
                  break a;
                } else {
                  if (0 === (b2 & 1)) {
                    Si(f11, l7, b2);
                    tj();
                    break a;
                  }
                  k = Error(p14(426));
                }
              } else if (I2 && h.mode & 1) {
                var J = Ui(g3);
                if (null !== J) {
                  0 === (J.flags & 65536) && (J.flags |= 256);
                  Vi(J, g3, h, f11, b2);
                  Jg(Ji(k, h));
                  break a;
                }
              }
              f11 = k = Ji(k, h);
              4 !== T2 && (T2 = 2);
              null === sk ? sk = [f11] : sk.push(f11);
              f11 = g3;
              do {
                switch (f11.tag) {
                  case 3:
                    f11.flags |= 65536;
                    b2 &= -b2;
                    f11.lanes |= b2;
                    var x2 = Ni(f11, k, b2);
                    ph(f11, x2);
                    break a;
                  case 1:
                    h = k;
                    var w = f11.type, u5 = f11.stateNode;
                    if (0 === (f11.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u5 && "function" === typeof u5.componentDidCatch && (null === Ri || !Ri.has(u5)))) {
                      f11.flags |= 65536;
                      b2 &= -b2;
                      f11.lanes |= b2;
                      var F = Qi(f11, h, b2);
                      ph(f11, F);
                      break a;
                    }
                }
                f11 = f11.return;
              } while (null !== f11);
            }
            Sk(c4);
          } catch (na) {
            b2 = na;
            Y === c4 && null !== c4 && (Y = c4 = c4.return);
            continue;
          }
          break;
        } while (1);
      }
      function Jk() {
        var a16 = mk.current;
        mk.current = Rh;
        return null === a16 ? Rh : a16;
      }
      function tj() {
        if (0 === T2 || 3 === T2 || 2 === T2) T2 = 4;
        null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
      }
      function Ik(a16, b2) {
        var c4 = K;
        K |= 2;
        var d8 = Jk();
        if (Q !== a16 || Z !== b2) uk = null, Kk(a16, b2);
        do
          try {
            Tk();
            break;
          } catch (e24) {
            Mk(a16, e24);
          }
        while (1);
        $g();
        K = c4;
        mk.current = d8;
        if (null !== Y) throw Error(p14(261));
        Q = null;
        Z = 0;
        return T2;
      }
      function Tk() {
        for (; null !== Y; ) Uk(Y);
      }
      function Lk() {
        for (; null !== Y && !cc(); ) Uk(Y);
      }
      function Uk(a16) {
        var b2 = Vk(a16.alternate, a16, fj);
        a16.memoizedProps = a16.pendingProps;
        null === b2 ? Sk(a16) : Y = b2;
        nk.current = null;
      }
      function Sk(a16) {
        var b2 = a16;
        do {
          var c4 = b2.alternate;
          a16 = b2.return;
          if (0 === (b2.flags & 32768)) {
            if (c4 = Ej(c4, b2, fj), null !== c4) {
              Y = c4;
              return;
            }
          } else {
            c4 = Ij(c4, b2);
            if (null !== c4) {
              c4.flags &= 32767;
              Y = c4;
              return;
            }
            if (null !== a16) a16.flags |= 32768, a16.subtreeFlags = 0, a16.deletions = null;
            else {
              T2 = 6;
              Y = null;
              return;
            }
          }
          b2 = b2.sibling;
          if (null !== b2) {
            Y = b2;
            return;
          }
          Y = b2 = a16;
        } while (null !== b2);
        0 === T2 && (T2 = 5);
      }
      function Pk(a16, b2, c4) {
        var d8 = C, e24 = ok.transition;
        try {
          ok.transition = null, C = 1, Wk(a16, b2, c4, d8);
        } finally {
          ok.transition = e24, C = d8;
        }
        return null;
      }
      function Wk(a16, b2, c4, d8) {
        do
          Hk();
        while (null !== wk);
        if (0 !== (K & 6)) throw Error(p14(327));
        c4 = a16.finishedWork;
        var e24 = a16.finishedLanes;
        if (null === c4) return null;
        a16.finishedWork = null;
        a16.finishedLanes = 0;
        if (c4 === a16.current) throw Error(p14(177));
        a16.callbackNode = null;
        a16.callbackPriority = 0;
        var f11 = c4.lanes | c4.childLanes;
        Bc(a16, f11);
        a16 === Q && (Y = Q = null, Z = 0);
        0 === (c4.subtreeFlags & 2064) && 0 === (c4.flags & 2064) || vk || (vk = true, Fk(hc, function() {
          Hk();
          return null;
        }));
        f11 = 0 !== (c4.flags & 15990);
        if (0 !== (c4.subtreeFlags & 15990) || f11) {
          f11 = ok.transition;
          ok.transition = null;
          var g3 = C;
          C = 1;
          var h = K;
          K |= 4;
          nk.current = null;
          Oj(a16, c4);
          dk(c4, a16);
          Oe(Df);
          dd = !!Cf;
          Df = Cf = null;
          a16.current = c4;
          hk(c4, a16, e24);
          dc();
          K = h;
          C = g3;
          ok.transition = f11;
        } else a16.current = c4;
        vk && (vk = false, wk = a16, xk = e24);
        f11 = a16.pendingLanes;
        0 === f11 && (Ri = null);
        mc(c4.stateNode, d8);
        Dk(a16, B2());
        if (null !== b2) for (d8 = a16.onRecoverableError, c4 = 0; c4 < b2.length; c4++) e24 = b2[c4], d8(e24.value, { componentStack: e24.stack, digest: e24.digest });
        if (Oi) throw Oi = false, a16 = Pi, Pi = null, a16;
        0 !== (xk & 1) && 0 !== a16.tag && Hk();
        f11 = a16.pendingLanes;
        0 !== (f11 & 1) ? a16 === zk ? yk++ : (yk = 0, zk = a16) : yk = 0;
        jg();
        return null;
      }
      function Hk() {
        if (null !== wk) {
          var a16 = Dc(xk), b2 = ok.transition, c4 = C;
          try {
            ok.transition = null;
            C = 16 > a16 ? 16 : a16;
            if (null === wk) var d8 = false;
            else {
              a16 = wk;
              wk = null;
              xk = 0;
              if (0 !== (K & 6)) throw Error(p14(331));
              var e24 = K;
              K |= 4;
              for (V = a16.current; null !== V; ) {
                var f11 = V, g3 = f11.child;
                if (0 !== (V.flags & 16)) {
                  var h = f11.deletions;
                  if (null !== h) {
                    for (var k = 0; k < h.length; k++) {
                      var l7 = h[k];
                      for (V = l7; null !== V; ) {
                        var m6 = V;
                        switch (m6.tag) {
                          case 0:
                          case 11:
                          case 15:
                            Pj(8, m6, f11);
                        }
                        var q = m6.child;
                        if (null !== q) q.return = m6, V = q;
                        else for (; null !== V; ) {
                          m6 = V;
                          var r25 = m6.sibling, y = m6.return;
                          Sj(m6);
                          if (m6 === l7) {
                            V = null;
                            break;
                          }
                          if (null !== r25) {
                            r25.return = y;
                            V = r25;
                            break;
                          }
                          V = y;
                        }
                      }
                    }
                    var n12 = f11.alternate;
                    if (null !== n12) {
                      var t15 = n12.child;
                      if (null !== t15) {
                        n12.child = null;
                        do {
                          var J = t15.sibling;
                          t15.sibling = null;
                          t15 = J;
                        } while (null !== t15);
                      }
                    }
                    V = f11;
                  }
                }
                if (0 !== (f11.subtreeFlags & 2064) && null !== g3) g3.return = f11, V = g3;
                else b: for (; null !== V; ) {
                  f11 = V;
                  if (0 !== (f11.flags & 2048)) switch (f11.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(9, f11, f11.return);
                  }
                  var x2 = f11.sibling;
                  if (null !== x2) {
                    x2.return = f11.return;
                    V = x2;
                    break b;
                  }
                  V = f11.return;
                }
              }
              var w = a16.current;
              for (V = w; null !== V; ) {
                g3 = V;
                var u5 = g3.child;
                if (0 !== (g3.subtreeFlags & 2064) && null !== u5) u5.return = g3, V = u5;
                else b: for (g3 = w; null !== V; ) {
                  h = V;
                  if (0 !== (h.flags & 2048)) try {
                    switch (h.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Qj(9, h);
                    }
                  } catch (na) {
                    W(h, h.return, na);
                  }
                  if (h === g3) {
                    V = null;
                    break b;
                  }
                  var F = h.sibling;
                  if (null !== F) {
                    F.return = h.return;
                    V = F;
                    break b;
                  }
                  V = h.return;
                }
              }
              K = e24;
              jg();
              if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
                lc.onPostCommitFiberRoot(kc, a16);
              } catch (na) {
              }
              d8 = true;
            }
            return d8;
          } finally {
            C = c4, ok.transition = b2;
          }
        }
        return false;
      }
      function Xk(a16, b2, c4) {
        b2 = Ji(c4, b2);
        b2 = Ni(a16, b2, 1);
        a16 = nh(a16, b2, 1);
        b2 = R4();
        null !== a16 && (Ac(a16, 1, b2), Dk(a16, b2));
      }
      function W(a16, b2, c4) {
        if (3 === a16.tag) Xk(a16, a16, c4);
        else for (; null !== b2; ) {
          if (3 === b2.tag) {
            Xk(b2, a16, c4);
            break;
          } else if (1 === b2.tag) {
            var d8 = b2.stateNode;
            if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d8.componentDidCatch && (null === Ri || !Ri.has(d8))) {
              a16 = Ji(c4, a16);
              a16 = Qi(b2, a16, 1);
              b2 = nh(b2, a16, 1);
              a16 = R4();
              null !== b2 && (Ac(b2, 1, a16), Dk(b2, a16));
              break;
            }
          }
          b2 = b2.return;
        }
      }
      function Ti(a16, b2, c4) {
        var d8 = a16.pingCache;
        null !== d8 && d8.delete(b2);
        b2 = R4();
        a16.pingedLanes |= a16.suspendedLanes & c4;
        Q === a16 && (Z & c4) === c4 && (4 === T2 || 3 === T2 && (Z & 130023424) === Z && 500 > B2() - fk ? Kk(a16, 0) : rk |= c4);
        Dk(a16, b2);
      }
      function Yk(a16, b2) {
        0 === b2 && (0 === (a16.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
        var c4 = R4();
        a16 = ih(a16, b2);
        null !== a16 && (Ac(a16, b2, c4), Dk(a16, c4));
      }
      function uj(a16) {
        var b2 = a16.memoizedState, c4 = 0;
        null !== b2 && (c4 = b2.retryLane);
        Yk(a16, c4);
      }
      function bk(a16, b2) {
        var c4 = 0;
        switch (a16.tag) {
          case 13:
            var d8 = a16.stateNode;
            var e24 = a16.memoizedState;
            null !== e24 && (c4 = e24.retryLane);
            break;
          case 19:
            d8 = a16.stateNode;
            break;
          default:
            throw Error(p14(314));
        }
        null !== d8 && d8.delete(b2);
        Yk(a16, c4);
      }
      var Vk;
      Vk = function(a16, b2, c4) {
        if (null !== a16) if (a16.memoizedProps !== b2.pendingProps || Wf.current) dh = true;
        else {
          if (0 === (a16.lanes & c4) && 0 === (b2.flags & 128)) return dh = false, yj(a16, b2, c4);
          dh = 0 !== (a16.flags & 131072) ? true : false;
        }
        else dh = false, I2 && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
        b2.lanes = 0;
        switch (b2.tag) {
          case 2:
            var d8 = b2.type;
            ij(a16, b2);
            a16 = b2.pendingProps;
            var e24 = Yf(b2, H2.current);
            ch(b2, c4);
            e24 = Nh(null, b2, d8, a16, e24, c4);
            var f11 = Sh();
            b2.flags |= 1;
            "object" === typeof e24 && null !== e24 && "function" === typeof e24.render && void 0 === e24.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d8) ? (f11 = true, cg(b2)) : f11 = false, b2.memoizedState = null !== e24.state && void 0 !== e24.state ? e24.state : null, kh(b2), e24.updater = Ei, b2.stateNode = e24, e24._reactInternals = b2, Ii(b2, d8, a16, c4), b2 = jj(null, b2, d8, true, f11, c4)) : (b2.tag = 0, I2 && f11 && vg(b2), Xi(null, b2, e24, c4), b2 = b2.child);
            return b2;
          case 16:
            d8 = b2.elementType;
            a: {
              ij(a16, b2);
              a16 = b2.pendingProps;
              e24 = d8._init;
              d8 = e24(d8._payload);
              b2.type = d8;
              e24 = b2.tag = Zk(d8);
              a16 = Ci(d8, a16);
              switch (e24) {
                case 0:
                  b2 = cj(null, b2, d8, a16, c4);
                  break a;
                case 1:
                  b2 = hj(null, b2, d8, a16, c4);
                  break a;
                case 11:
                  b2 = Yi(null, b2, d8, a16, c4);
                  break a;
                case 14:
                  b2 = $i(null, b2, d8, Ci(d8.type, a16), c4);
                  break a;
              }
              throw Error(p14(
                306,
                d8,
                ""
              ));
            }
            return b2;
          case 0:
            return d8 = b2.type, e24 = b2.pendingProps, e24 = b2.elementType === d8 ? e24 : Ci(d8, e24), cj(a16, b2, d8, e24, c4);
          case 1:
            return d8 = b2.type, e24 = b2.pendingProps, e24 = b2.elementType === d8 ? e24 : Ci(d8, e24), hj(a16, b2, d8, e24, c4);
          case 3:
            a: {
              kj(b2);
              if (null === a16) throw Error(p14(387));
              d8 = b2.pendingProps;
              f11 = b2.memoizedState;
              e24 = f11.element;
              lh(a16, b2);
              qh(b2, d8, null, c4);
              var g3 = b2.memoizedState;
              d8 = g3.element;
              if (f11.isDehydrated) if (f11 = { element: d8, isDehydrated: false, cache: g3.cache, pendingSuspenseBoundaries: g3.pendingSuspenseBoundaries, transitions: g3.transitions }, b2.updateQueue.baseState = f11, b2.memoizedState = f11, b2.flags & 256) {
                e24 = Ji(Error(p14(423)), b2);
                b2 = lj(a16, b2, d8, c4, e24);
                break a;
              } else if (d8 !== e24) {
                e24 = Ji(Error(p14(424)), b2);
                b2 = lj(a16, b2, d8, c4, e24);
                break a;
              } else for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I2 = true, zg = null, c4 = Vg(b2, null, d8, c4), b2.child = c4; c4; ) c4.flags = c4.flags & -3 | 4096, c4 = c4.sibling;
              else {
                Ig();
                if (d8 === e24) {
                  b2 = Zi(a16, b2, c4);
                  break a;
                }
                Xi(a16, b2, d8, c4);
              }
              b2 = b2.child;
            }
            return b2;
          case 5:
            return Ah(b2), null === a16 && Eg(b2), d8 = b2.type, e24 = b2.pendingProps, f11 = null !== a16 ? a16.memoizedProps : null, g3 = e24.children, Ef(d8, e24) ? g3 = null : null !== f11 && Ef(d8, f11) && (b2.flags |= 32), gj(a16, b2), Xi(a16, b2, g3, c4), b2.child;
          case 6:
            return null === a16 && Eg(b2), null;
          case 13:
            return oj(a16, b2, c4);
          case 4:
            return yh(b2, b2.stateNode.containerInfo), d8 = b2.pendingProps, null === a16 ? b2.child = Ug(b2, null, d8, c4) : Xi(a16, b2, d8, c4), b2.child;
          case 11:
            return d8 = b2.type, e24 = b2.pendingProps, e24 = b2.elementType === d8 ? e24 : Ci(d8, e24), Yi(a16, b2, d8, e24, c4);
          case 7:
            return Xi(a16, b2, b2.pendingProps, c4), b2.child;
          case 8:
            return Xi(a16, b2, b2.pendingProps.children, c4), b2.child;
          case 12:
            return Xi(a16, b2, b2.pendingProps.children, c4), b2.child;
          case 10:
            a: {
              d8 = b2.type._context;
              e24 = b2.pendingProps;
              f11 = b2.memoizedProps;
              g3 = e24.value;
              G(Wg, d8._currentValue);
              d8._currentValue = g3;
              if (null !== f11) if (He(f11.value, g3)) {
                if (f11.children === e24.children && !Wf.current) {
                  b2 = Zi(a16, b2, c4);
                  break a;
                }
              } else for (f11 = b2.child, null !== f11 && (f11.return = b2); null !== f11; ) {
                var h = f11.dependencies;
                if (null !== h) {
                  g3 = f11.child;
                  for (var k = h.firstContext; null !== k; ) {
                    if (k.context === d8) {
                      if (1 === f11.tag) {
                        k = mh(-1, c4 & -c4);
                        k.tag = 2;
                        var l7 = f11.updateQueue;
                        if (null !== l7) {
                          l7 = l7.shared;
                          var m6 = l7.pending;
                          null === m6 ? k.next = k : (k.next = m6.next, m6.next = k);
                          l7.pending = k;
                        }
                      }
                      f11.lanes |= c4;
                      k = f11.alternate;
                      null !== k && (k.lanes |= c4);
                      bh(
                        f11.return,
                        c4,
                        b2
                      );
                      h.lanes |= c4;
                      break;
                    }
                    k = k.next;
                  }
                } else if (10 === f11.tag) g3 = f11.type === b2.type ? null : f11.child;
                else if (18 === f11.tag) {
                  g3 = f11.return;
                  if (null === g3) throw Error(p14(341));
                  g3.lanes |= c4;
                  h = g3.alternate;
                  null !== h && (h.lanes |= c4);
                  bh(g3, c4, b2);
                  g3 = f11.sibling;
                } else g3 = f11.child;
                if (null !== g3) g3.return = f11;
                else for (g3 = f11; null !== g3; ) {
                  if (g3 === b2) {
                    g3 = null;
                    break;
                  }
                  f11 = g3.sibling;
                  if (null !== f11) {
                    f11.return = g3.return;
                    g3 = f11;
                    break;
                  }
                  g3 = g3.return;
                }
                f11 = g3;
              }
              Xi(a16, b2, e24.children, c4);
              b2 = b2.child;
            }
            return b2;
          case 9:
            return e24 = b2.type, d8 = b2.pendingProps.children, ch(b2, c4), e24 = eh(e24), d8 = d8(e24), b2.flags |= 1, Xi(a16, b2, d8, c4), b2.child;
          case 14:
            return d8 = b2.type, e24 = Ci(d8, b2.pendingProps), e24 = Ci(d8.type, e24), $i(a16, b2, d8, e24, c4);
          case 15:
            return bj(a16, b2, b2.type, b2.pendingProps, c4);
          case 17:
            return d8 = b2.type, e24 = b2.pendingProps, e24 = b2.elementType === d8 ? e24 : Ci(d8, e24), ij(a16, b2), b2.tag = 1, Zf(d8) ? (a16 = true, cg(b2)) : a16 = false, ch(b2, c4), Gi(b2, d8, e24), Ii(b2, d8, e24, c4), jj(null, b2, d8, true, a16, c4);
          case 19:
            return xj(a16, b2, c4);
          case 22:
            return dj(a16, b2, c4);
        }
        throw Error(p14(156, b2.tag));
      };
      function Fk(a16, b2) {
        return ac(a16, b2);
      }
      function $k(a16, b2, c4, d8) {
        this.tag = a16;
        this.key = c4;
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
        this.index = 0;
        this.ref = null;
        this.pendingProps = b2;
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
        this.mode = d8;
        this.subtreeFlags = this.flags = 0;
        this.deletions = null;
        this.childLanes = this.lanes = 0;
        this.alternate = null;
      }
      function Bg(a16, b2, c4, d8) {
        return new $k(a16, b2, c4, d8);
      }
      function aj(a16) {
        a16 = a16.prototype;
        return !(!a16 || !a16.isReactComponent);
      }
      function Zk(a16) {
        if ("function" === typeof a16) return aj(a16) ? 1 : 0;
        if (void 0 !== a16 && null !== a16) {
          a16 = a16.$$typeof;
          if (a16 === Da) return 11;
          if (a16 === Ga) return 14;
        }
        return 2;
      }
      function Pg(a16, b2) {
        var c4 = a16.alternate;
        null === c4 ? (c4 = Bg(a16.tag, b2, a16.key, a16.mode), c4.elementType = a16.elementType, c4.type = a16.type, c4.stateNode = a16.stateNode, c4.alternate = a16, a16.alternate = c4) : (c4.pendingProps = b2, c4.type = a16.type, c4.flags = 0, c4.subtreeFlags = 0, c4.deletions = null);
        c4.flags = a16.flags & 14680064;
        c4.childLanes = a16.childLanes;
        c4.lanes = a16.lanes;
        c4.child = a16.child;
        c4.memoizedProps = a16.memoizedProps;
        c4.memoizedState = a16.memoizedState;
        c4.updateQueue = a16.updateQueue;
        b2 = a16.dependencies;
        c4.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
        c4.sibling = a16.sibling;
        c4.index = a16.index;
        c4.ref = a16.ref;
        return c4;
      }
      function Rg(a16, b2, c4, d8, e24, f11) {
        var g3 = 2;
        d8 = a16;
        if ("function" === typeof a16) aj(a16) && (g3 = 1);
        else if ("string" === typeof a16) g3 = 5;
        else a: switch (a16) {
          case ya:
            return Tg(c4.children, e24, f11, b2);
          case za:
            g3 = 8;
            e24 |= 8;
            break;
          case Aa:
            return a16 = Bg(12, c4, b2, e24 | 2), a16.elementType = Aa, a16.lanes = f11, a16;
          case Ea:
            return a16 = Bg(13, c4, b2, e24), a16.elementType = Ea, a16.lanes = f11, a16;
          case Fa:
            return a16 = Bg(19, c4, b2, e24), a16.elementType = Fa, a16.lanes = f11, a16;
          case Ia:
            return pj(c4, e24, f11, b2);
          default:
            if ("object" === typeof a16 && null !== a16) switch (a16.$$typeof) {
              case Ba:
                g3 = 10;
                break a;
              case Ca:
                g3 = 9;
                break a;
              case Da:
                g3 = 11;
                break a;
              case Ga:
                g3 = 14;
                break a;
              case Ha:
                g3 = 16;
                d8 = null;
                break a;
            }
            throw Error(p14(130, null == a16 ? a16 : typeof a16, ""));
        }
        b2 = Bg(g3, c4, b2, e24);
        b2.elementType = a16;
        b2.type = d8;
        b2.lanes = f11;
        return b2;
      }
      function Tg(a16, b2, c4, d8) {
        a16 = Bg(7, a16, d8, b2);
        a16.lanes = c4;
        return a16;
      }
      function pj(a16, b2, c4, d8) {
        a16 = Bg(22, a16, d8, b2);
        a16.elementType = Ia;
        a16.lanes = c4;
        a16.stateNode = { isHidden: false };
        return a16;
      }
      function Qg(a16, b2, c4) {
        a16 = Bg(6, a16, null, b2);
        a16.lanes = c4;
        return a16;
      }
      function Sg(a16, b2, c4) {
        b2 = Bg(4, null !== a16.children ? a16.children : [], a16.key, b2);
        b2.lanes = c4;
        b2.stateNode = { containerInfo: a16.containerInfo, pendingChildren: null, implementation: a16.implementation };
        return b2;
      }
      function al(a16, b2, c4, d8, e24) {
        this.tag = b2;
        this.containerInfo = a16;
        this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
        this.timeoutHandle = -1;
        this.callbackNode = this.pendingContext = this.context = null;
        this.callbackPriority = 0;
        this.eventTimes = zc(0);
        this.expirationTimes = zc(-1);
        this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
        this.entanglements = zc(0);
        this.identifierPrefix = d8;
        this.onRecoverableError = e24;
        this.mutableSourceEagerHydrationData = null;
      }
      function bl(a16, b2, c4, d8, e24, f11, g3, h, k) {
        a16 = new al(a16, b2, c4, h, k);
        1 === b2 ? (b2 = 1, true === f11 && (b2 |= 8)) : b2 = 0;
        f11 = Bg(3, null, null, b2);
        a16.current = f11;
        f11.stateNode = a16;
        f11.memoizedState = { element: d8, isDehydrated: c4, cache: null, transitions: null, pendingSuspenseBoundaries: null };
        kh(f11);
        return a16;
      }
      function cl(a16, b2, c4) {
        var d8 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return { $$typeof: wa, key: null == d8 ? null : "" + d8, children: a16, containerInfo: b2, implementation: c4 };
      }
      function dl(a16) {
        if (!a16) return Vf;
        a16 = a16._reactInternals;
        a: {
          if (Vb(a16) !== a16 || 1 !== a16.tag) throw Error(p14(170));
          var b2 = a16;
          do {
            switch (b2.tag) {
              case 3:
                b2 = b2.stateNode.context;
                break a;
              case 1:
                if (Zf(b2.type)) {
                  b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
                  break a;
                }
            }
            b2 = b2.return;
          } while (null !== b2);
          throw Error(p14(171));
        }
        if (1 === a16.tag) {
          var c4 = a16.type;
          if (Zf(c4)) return bg(a16, c4, b2);
        }
        return b2;
      }
      function el(a16, b2, c4, d8, e24, f11, g3, h, k) {
        a16 = bl(c4, d8, true, a16, e24, f11, g3, h, k);
        a16.context = dl(null);
        c4 = a16.current;
        d8 = R4();
        e24 = yi(c4);
        f11 = mh(d8, e24);
        f11.callback = void 0 !== b2 && null !== b2 ? b2 : null;
        nh(c4, f11, e24);
        a16.current.lanes = e24;
        Ac(a16, e24, d8);
        Dk(a16, d8);
        return a16;
      }
      function fl(a16, b2, c4, d8) {
        var e24 = b2.current, f11 = R4(), g3 = yi(e24);
        c4 = dl(c4);
        null === b2.context ? b2.context = c4 : b2.pendingContext = c4;
        b2 = mh(f11, g3);
        b2.payload = { element: a16 };
        d8 = void 0 === d8 ? null : d8;
        null !== d8 && (b2.callback = d8);
        a16 = nh(e24, b2, g3);
        null !== a16 && (gi(a16, e24, g3, f11), oh(a16, e24, g3));
        return g3;
      }
      function gl(a16) {
        a16 = a16.current;
        if (!a16.child) return null;
        switch (a16.child.tag) {
          case 5:
            return a16.child.stateNode;
          default:
            return a16.child.stateNode;
        }
      }
      function hl(a16, b2) {
        a16 = a16.memoizedState;
        if (null !== a16 && null !== a16.dehydrated) {
          var c4 = a16.retryLane;
          a16.retryLane = 0 !== c4 && c4 < b2 ? c4 : b2;
        }
      }
      function il(a16, b2) {
        hl(a16, b2);
        (a16 = a16.alternate) && hl(a16, b2);
      }
      function jl() {
        return null;
      }
      var kl = "function" === typeof reportError ? reportError : function(a16) {
        console.error(a16);
      };
      function ll(a16) {
        this._internalRoot = a16;
      }
      ml.prototype.render = ll.prototype.render = function(a16) {
        var b2 = this._internalRoot;
        if (null === b2) throw Error(p14(409));
        fl(a16, b2, null, null);
      };
      ml.prototype.unmount = ll.prototype.unmount = function() {
        var a16 = this._internalRoot;
        if (null !== a16) {
          this._internalRoot = null;
          var b2 = a16.containerInfo;
          Rk(function() {
            fl(null, a16, null, null);
          });
          b2[uf] = null;
        }
      };
      function ml(a16) {
        this._internalRoot = a16;
      }
      ml.prototype.unstable_scheduleHydration = function(a16) {
        if (a16) {
          var b2 = Hc();
          a16 = { blockedOn: null, target: a16, priority: b2 };
          for (var c4 = 0; c4 < Qc.length && 0 !== b2 && b2 < Qc[c4].priority; c4++) ;
          Qc.splice(c4, 0, a16);
          0 === c4 && Vc(a16);
        }
      };
      function nl(a16) {
        return !(!a16 || 1 !== a16.nodeType && 9 !== a16.nodeType && 11 !== a16.nodeType);
      }
      function ol(a16) {
        return !(!a16 || 1 !== a16.nodeType && 9 !== a16.nodeType && 11 !== a16.nodeType && (8 !== a16.nodeType || " react-mount-point-unstable " !== a16.nodeValue));
      }
      function pl() {
      }
      function ql(a16, b2, c4, d8, e24) {
        if (e24) {
          if ("function" === typeof d8) {
            var f11 = d8;
            d8 = function() {
              var a17 = gl(g3);
              f11.call(a17);
            };
          }
          var g3 = el(b2, d8, a16, 0, null, false, false, "", pl);
          a16._reactRootContainer = g3;
          a16[uf] = g3.current;
          sf(8 === a16.nodeType ? a16.parentNode : a16);
          Rk();
          return g3;
        }
        for (; e24 = a16.lastChild; ) a16.removeChild(e24);
        if ("function" === typeof d8) {
          var h = d8;
          d8 = function() {
            var a17 = gl(k);
            h.call(a17);
          };
        }
        var k = bl(a16, 0, false, null, null, false, false, "", pl);
        a16._reactRootContainer = k;
        a16[uf] = k.current;
        sf(8 === a16.nodeType ? a16.parentNode : a16);
        Rk(function() {
          fl(b2, k, c4, d8);
        });
        return k;
      }
      function rl(a16, b2, c4, d8, e24) {
        var f11 = c4._reactRootContainer;
        if (f11) {
          var g3 = f11;
          if ("function" === typeof e24) {
            var h = e24;
            e24 = function() {
              var a17 = gl(g3);
              h.call(a17);
            };
          }
          fl(b2, g3, a16, e24);
        } else g3 = ql(c4, b2, a16, e24, d8);
        return gl(g3);
      }
      Ec = function(a16) {
        switch (a16.tag) {
          case 3:
            var b2 = a16.stateNode;
            if (b2.current.memoizedState.isDehydrated) {
              var c4 = tc(b2.pendingLanes);
              0 !== c4 && (Cc(b2, c4 | 1), Dk(b2, B2()), 0 === (K & 6) && (Gj = B2() + 500, jg()));
            }
            break;
          case 13:
            Rk(function() {
              var b3 = ih(a16, 1);
              if (null !== b3) {
                var c5 = R4();
                gi(b3, a16, 1, c5);
              }
            }), il(a16, 1);
        }
      };
      Fc = function(a16) {
        if (13 === a16.tag) {
          var b2 = ih(a16, 134217728);
          if (null !== b2) {
            var c4 = R4();
            gi(b2, a16, 134217728, c4);
          }
          il(a16, 134217728);
        }
      };
      Gc = function(a16) {
        if (13 === a16.tag) {
          var b2 = yi(a16), c4 = ih(a16, b2);
          if (null !== c4) {
            var d8 = R4();
            gi(c4, a16, b2, d8);
          }
          il(a16, b2);
        }
      };
      Hc = function() {
        return C;
      };
      Ic = function(a16, b2) {
        var c4 = C;
        try {
          return C = a16, b2();
        } finally {
          C = c4;
        }
      };
      yb = function(a16, b2, c4) {
        switch (b2) {
          case "input":
            bb(a16, c4);
            b2 = c4.name;
            if ("radio" === c4.type && null != b2) {
              for (c4 = a16; c4.parentNode; ) c4 = c4.parentNode;
              c4 = c4.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
              for (b2 = 0; b2 < c4.length; b2++) {
                var d8 = c4[b2];
                if (d8 !== a16 && d8.form === a16.form) {
                  var e24 = Db(d8);
                  if (!e24) throw Error(p14(90));
                  Wa(d8);
                  bb(d8, e24);
                }
              }
            }
            break;
          case "textarea":
            ib(a16, c4);
            break;
          case "select":
            b2 = c4.value, null != b2 && fb(a16, !!c4.multiple, b2, false);
        }
      };
      Gb = Qk;
      Hb = Rk;
      var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] };
      var tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
      var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a16) {
        a16 = Zb(a16);
        return null === a16 ? null : a16.stateNode;
      }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
      if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
        vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!vl.isDisabled && vl.supportsFiber) try {
          kc = vl.inject(ul), lc = vl;
        } catch (a16) {
        }
      }
      var vl;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
      exports.createPortal = function(a16, b2) {
        var c4 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!nl(b2)) throw Error(p14(200));
        return cl(a16, b2, null, c4);
      };
      exports.createRoot = function(a16, b2) {
        if (!nl(a16)) throw Error(p14(299));
        var c4 = false, d8 = "", e24 = kl;
        null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c4 = true), void 0 !== b2.identifierPrefix && (d8 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e24 = b2.onRecoverableError));
        b2 = bl(a16, 1, false, null, null, c4, false, d8, e24);
        a16[uf] = b2.current;
        sf(8 === a16.nodeType ? a16.parentNode : a16);
        return new ll(b2);
      };
      exports.findDOMNode = function(a16) {
        if (null == a16) return null;
        if (1 === a16.nodeType) return a16;
        var b2 = a16._reactInternals;
        if (void 0 === b2) {
          if ("function" === typeof a16.render) throw Error(p14(188));
          a16 = Object.keys(a16).join(",");
          throw Error(p14(268, a16));
        }
        a16 = Zb(b2);
        a16 = null === a16 ? null : a16.stateNode;
        return a16;
      };
      exports.flushSync = function(a16) {
        return Rk(a16);
      };
      exports.hydrate = function(a16, b2, c4) {
        if (!ol(b2)) throw Error(p14(200));
        return rl(null, a16, b2, true, c4);
      };
      exports.hydrateRoot = function(a16, b2, c4) {
        if (!nl(a16)) throw Error(p14(405));
        var d8 = null != c4 && c4.hydratedSources || null, e24 = false, f11 = "", g3 = kl;
        null !== c4 && void 0 !== c4 && (true === c4.unstable_strictMode && (e24 = true), void 0 !== c4.identifierPrefix && (f11 = c4.identifierPrefix), void 0 !== c4.onRecoverableError && (g3 = c4.onRecoverableError));
        b2 = el(b2, null, a16, 1, null != c4 ? c4 : null, e24, false, f11, g3);
        a16[uf] = b2.current;
        sf(a16);
        if (d8) for (a16 = 0; a16 < d8.length; a16++) c4 = d8[a16], e24 = c4._getVersion, e24 = e24(c4._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c4, e24] : b2.mutableSourceEagerHydrationData.push(
          c4,
          e24
        );
        return new ml(b2);
      };
      exports.render = function(a16, b2, c4) {
        if (!ol(b2)) throw Error(p14(200));
        return rl(null, a16, b2, false, c4);
      };
      exports.unmountComponentAtNode = function(a16) {
        if (!ol(a16)) throw Error(p14(40));
        return a16._reactRootContainer ? (Rk(function() {
          rl(null, null, a16, false, function() {
            a16._reactRootContainer = null;
            a16[uf] = null;
          });
        }), true) : false;
      };
      exports.unstable_batchedUpdates = Qk;
      exports.unstable_renderSubtreeIntoContainer = function(a16, b2, c4, d8) {
        if (!ol(c4)) throw Error(p14(200));
        if (null == a16 || void 0 === a16._reactInternals) throw Error(p14(38));
        return rl(a16, b2, c4, false, d8);
      };
      exports.version = "18.3.1-next-f1338f8080-20240426";
    }
  });

  // node_modules/react-dom/index.js
  var require_react_dom = __commonJS({
    "node_modules/react-dom/index.js"(exports, module) {
      "use strict";
      function checkDCE() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
          return;
        }
        if (false) {
          throw new Error("^_^");
        }
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
          console.error(err);
        }
      }
      if (true) {
        checkDCE();
        module.exports = require_react_dom_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react-dom/client.js
  var require_client = __commonJS({
    "node_modules/react-dom/client.js"(exports) {
      "use strict";
      var m6 = require_react_dom();
      if (true) {
        exports.createRoot = m6.createRoot;
        exports.hydrateRoot = m6.hydrateRoot;
      } else {
        i6 = m6.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        exports.createRoot = function(c4, o21) {
          i6.usingClientEntryPoint = true;
          try {
            return m6.createRoot(c4, o21);
          } finally {
            i6.usingClientEntryPoint = false;
          }
        };
        exports.hydrateRoot = function(c4, h, o21) {
          i6.usingClientEntryPoint = true;
          try {
            return m6.hydrateRoot(c4, h, o21);
          } finally {
            i6.usingClientEntryPoint = false;
          }
        };
      }
      var i6;
    }
  });

  // node_modules/react/cjs/react-jsx-runtime.production.min.js
  var require_react_jsx_runtime_production_min = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.production.min.js"(exports) {
      "use strict";
      var f11 = require_react();
      var k = Symbol.for("react.element");
      var l7 = Symbol.for("react.fragment");
      var m6 = Object.prototype.hasOwnProperty;
      var n12 = f11.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
      var p14 = { key: true, ref: true, __self: true, __source: true };
      function q(c4, a16, g3) {
        var b2, d8 = {}, e24 = null, h = null;
        void 0 !== g3 && (e24 = "" + g3);
        void 0 !== a16.key && (e24 = "" + a16.key);
        void 0 !== a16.ref && (h = a16.ref);
        for (b2 in a16) m6.call(a16, b2) && !p14.hasOwnProperty(b2) && (d8[b2] = a16[b2]);
        if (c4 && c4.defaultProps) for (b2 in a16 = c4.defaultProps, a16) void 0 === d8[b2] && (d8[b2] = a16[b2]);
        return { $$typeof: k, type: c4, key: e24, ref: h, props: d8, _owner: n12.current };
      }
      exports.Fragment = l7;
      exports.jsx = q;
      exports.jsxs = q;
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_jsx_runtime_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/classnames/index.js
  var require_classnames = __commonJS({
    "node_modules/classnames/index.js"(exports, module) {
      (function() {
        "use strict";
        var hasOwn = {}.hasOwnProperty;
        function classNames() {
          var classes = "";
          for (var i6 = 0; i6 < arguments.length; i6++) {
            var arg = arguments[i6];
            if (arg) {
              classes = appendClass(classes, parseValue(arg));
            }
          }
          return classes;
        }
        function parseValue(arg) {
          if (typeof arg === "string" || typeof arg === "number") {
            return arg;
          }
          if (typeof arg !== "object") {
            return "";
          }
          if (Array.isArray(arg)) {
            return classNames.apply(null, arg);
          }
          if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
            return arg.toString();
          }
          var classes = "";
          for (var key in arg) {
            if (hasOwn.call(arg, key) && arg[key]) {
              classes = appendClass(classes, key);
            }
          }
          return classes;
        }
        function appendClass(value, newClass) {
          if (!newClass) {
            return value;
          }
          if (value) {
            return value + " " + newClass;
          }
          return value + newClass;
        }
        if (typeof module !== "undefined" && module.exports) {
          classNames.default = classNames;
          module.exports = classNames;
        } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
          define("classnames", [], function() {
            return classNames;
          });
        } else {
          window.classNames = classNames;
        }
      })();
    }
  });

  // node_modules/highlight.js/lib/core.js
  var require_core = __commonJS({
    "node_modules/highlight.js/lib/core.js"(exports, module) {
      function deepFreeze(obj) {
        if (obj instanceof Map) {
          obj.clear = obj.delete = obj.set = function() {
            throw new Error("map is read-only");
          };
        } else if (obj instanceof Set) {
          obj.add = obj.clear = obj.delete = function() {
            throw new Error("set is read-only");
          };
        }
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach((name) => {
          const prop = obj[name];
          const type = typeof prop;
          if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
            deepFreeze(prop);
          }
        });
        return obj;
      }
      var Response = class {
        /**
         * @param {CompiledMode} mode
         */
        constructor(mode) {
          if (mode.data === void 0) mode.data = {};
          this.data = mode.data;
          this.isMatchIgnored = false;
        }
        ignoreMatch() {
          this.isMatchIgnored = true;
        }
      };
      function escapeHTML(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
      }
      function inherit$1(original, ...objects) {
        const result = /* @__PURE__ */ Object.create(null);
        for (const key in original) {
          result[key] = original[key];
        }
        objects.forEach(function(obj) {
          for (const key in obj) {
            result[key] = obj[key];
          }
        });
        return (
          /** @type {T} */
          result
        );
      }
      var SPAN_CLOSE = "</span>";
      var emitsWrappingTags = (node) => {
        return !!node.scope;
      };
      var scopeToCSSClass = (name, { prefix }) => {
        if (name.startsWith("language:")) {
          return name.replace("language:", "language-");
        }
        if (name.includes(".")) {
          const pieces = name.split(".");
          return [
            `${prefix}${pieces.shift()}`,
            ...pieces.map((x2, i6) => `${x2}${"_".repeat(i6 + 1)}`)
          ].join(" ");
        }
        return `${prefix}${name}`;
      };
      var HTMLRenderer = class {
        /**
         * Creates a new HTMLRenderer
         *
         * @param {Tree} parseTree - the parse tree (must support `walk` API)
         * @param {{classPrefix: string}} options
         */
        constructor(parseTree, options) {
          this.buffer = "";
          this.classPrefix = options.classPrefix;
          parseTree.walk(this);
        }
        /**
         * Adds texts to the output stream
         *
         * @param {string} text */
        addText(text) {
          this.buffer += escapeHTML(text);
        }
        /**
         * Adds a node open to the output stream (if needed)
         *
         * @param {Node} node */
        openNode(node) {
          if (!emitsWrappingTags(node)) return;
          const className = scopeToCSSClass(
            node.scope,
            { prefix: this.classPrefix }
          );
          this.span(className);
        }
        /**
         * Adds a node close to the output stream (if needed)
         *
         * @param {Node} node */
        closeNode(node) {
          if (!emitsWrappingTags(node)) return;
          this.buffer += SPAN_CLOSE;
        }
        /**
         * returns the accumulated buffer
        */
        value() {
          return this.buffer;
        }
        // helpers
        /**
         * Builds a span element
         *
         * @param {string} className */
        span(className) {
          this.buffer += `<span class="${className}">`;
        }
      };
      var newNode = (opts = {}) => {
        const result = { children: [] };
        Object.assign(result, opts);
        return result;
      };
      var TokenTree = class _TokenTree {
        constructor() {
          this.rootNode = newNode();
          this.stack = [this.rootNode];
        }
        get top() {
          return this.stack[this.stack.length - 1];
        }
        get root() {
          return this.rootNode;
        }
        /** @param {Node} node */
        add(node) {
          this.top.children.push(node);
        }
        /** @param {string} scope */
        openNode(scope) {
          const node = newNode({ scope });
          this.add(node);
          this.stack.push(node);
        }
        closeNode() {
          if (this.stack.length > 1) {
            return this.stack.pop();
          }
          return void 0;
        }
        closeAllNodes() {
          while (this.closeNode()) ;
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4);
        }
        /**
         * @typedef { import("./html_renderer").Renderer } Renderer
         * @param {Renderer} builder
         */
        walk(builder) {
          return this.constructor._walk(builder, this.rootNode);
        }
        /**
         * @param {Renderer} builder
         * @param {Node} node
         */
        static _walk(builder, node) {
          if (typeof node === "string") {
            builder.addText(node);
          } else if (node.children) {
            builder.openNode(node);
            node.children.forEach((child) => this._walk(builder, child));
            builder.closeNode(node);
          }
          return builder;
        }
        /**
         * @param {Node} node
         */
        static _collapse(node) {
          if (typeof node === "string") return;
          if (!node.children) return;
          if (node.children.every((el) => typeof el === "string")) {
            node.children = [node.children.join("")];
          } else {
            node.children.forEach((child) => {
              _TokenTree._collapse(child);
            });
          }
        }
      };
      var TokenTreeEmitter = class extends TokenTree {
        /**
         * @param {*} options
         */
        constructor(options) {
          super();
          this.options = options;
        }
        /**
         * @param {string} text
         */
        addText(text) {
          if (text === "") {
            return;
          }
          this.add(text);
        }
        /** @param {string} scope */
        startScope(scope) {
          this.openNode(scope);
        }
        endScope() {
          this.closeNode();
        }
        /**
         * @param {Emitter & {root: DataNode}} emitter
         * @param {string} name
         */
        __addSublanguage(emitter, name) {
          const node = emitter.root;
          if (name) node.scope = `language:${name}`;
          this.add(node);
        }
        toHTML() {
          const renderer = new HTMLRenderer(this, this.options);
          return renderer.value();
        }
        finalize() {
          this.closeAllNodes();
          return true;
        }
      };
      function source(re) {
        if (!re) return null;
        if (typeof re === "string") return re;
        return re.source;
      }
      function lookahead(re) {
        return concat("(?=", re, ")");
      }
      function anyNumberOfTimes(re) {
        return concat("(?:", re, ")*");
      }
      function optional(re) {
        return concat("(?:", re, ")?");
      }
      function concat(...args) {
        const joined = args.map((x2) => source(x2)).join("");
        return joined;
      }
      function stripOptionsFromArgs(args) {
        const opts = args[args.length - 1];
        if (typeof opts === "object" && opts.constructor === Object) {
          args.splice(args.length - 1, 1);
          return opts;
        } else {
          return {};
        }
      }
      function either(...args) {
        const opts = stripOptionsFromArgs(args);
        const joined = "(" + (opts.capture ? "" : "?:") + args.map((x2) => source(x2)).join("|") + ")";
        return joined;
      }
      function countMatchGroups(re) {
        return new RegExp(re.toString() + "|").exec("").length - 1;
      }
      function startsWith(re, lexeme) {
        const match = re && re.exec(lexeme);
        return match && match.index === 0;
      }
      var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      function _rewriteBackreferences(regexps, { joinWith }) {
        let numCaptures = 0;
        return regexps.map((regex) => {
          numCaptures += 1;
          const offset4 = numCaptures;
          let re = source(regex);
          let out = "";
          while (re.length > 0) {
            const match = BACKREF_RE.exec(re);
            if (!match) {
              out += re;
              break;
            }
            out += re.substring(0, match.index);
            re = re.substring(match.index + match[0].length);
            if (match[0][0] === "\\" && match[1]) {
              out += "\\" + String(Number(match[1]) + offset4);
            } else {
              out += match[0];
              if (match[0] === "(") {
                numCaptures++;
              }
            }
          }
          return out;
        }).map((re) => `(${re})`).join(joinWith);
      }
      var MATCH_NOTHING_RE = /\b\B/;
      var IDENT_RE3 = "[a-zA-Z]\\w*";
      var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
      var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
      var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
      var BINARY_NUMBER_RE = "\\b(0b[01]+)";
      var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
      var SHEBANG = (opts = {}) => {
        const beginShebang = /^#![ ]*\//;
        if (opts.binary) {
          opts.begin = concat(
            beginShebang,
            /.*\b/,
            opts.binary,
            /\b.*/
          );
        }
        return inherit$1({
          scope: "meta",
          begin: beginShebang,
          end: /$/,
          relevance: 0,
          /** @type {ModeCallback} */
          "on:begin": (m6, resp) => {
            if (m6.index !== 0) resp.ignoreMatch();
          }
        }, opts);
      };
      var BACKSLASH_ESCAPE = {
        begin: "\\\\[\\s\\S]",
        relevance: 0
      };
      var APOS_STRING_MODE = {
        scope: "string",
        begin: "'",
        end: "'",
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var QUOTE_STRING_MODE = {
        scope: "string",
        begin: '"',
        end: '"',
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var PHRASAL_WORDS_MODE = {
        begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
      };
      var COMMENT = function(begin, end, modeOptions = {}) {
        const mode = inherit$1(
          {
            scope: "comment",
            begin,
            end,
            contains: []
          },
          modeOptions
        );
        mode.contains.push({
          scope: "doctag",
          // hack to avoid the space from being included. the space is necessary to
          // match here to prevent the plain text rule below from gobbling up doctags
          begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
          end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
          excludeBegin: true,
          relevance: 0
        });
        const ENGLISH_WORD = either(
          // list of common 1 and 2 letter words in English
          "I",
          "a",
          "is",
          "so",
          "us",
          "to",
          "at",
          "if",
          "in",
          "it",
          "on",
          // note: this is not an exhaustive list of contractions, just popular ones
          /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
          // contractions - can't we'd they're let's, etc
          /[A-Za-z]+[-][a-z]+/,
          // `no-way`, etc.
          /[A-Za-z][a-z]{2,}/
          // allow capitalized words at beginning of sentences
        );
        mode.contains.push(
          {
            // TODO: how to include ", (, ) without breaking grammars that use these for
            // comment delimiters?
            // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
            // ---
            // this tries to find sequences of 3 english words in a row (without any
            // "programming" type syntax) this gives us a strong signal that we've
            // TRULY found a comment - vs perhaps scanning with the wrong language.
            // It's possible to find something that LOOKS like the start of the
            // comment - but then if there is no readable text - good chance it is a
            // false match and not a comment.
            //
            // for a visual example please see:
            // https://github.com/highlightjs/highlight.js/issues/2827
            begin: concat(
              /[ ]+/,
              // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
              "(",
              ENGLISH_WORD,
              /[.]?[:]?([.][ ]|[ ])/,
              "){3}"
            )
            // look for 3 words in a row
          }
        );
        return mode;
      };
      var C_LINE_COMMENT_MODE = COMMENT("//", "$");
      var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
      var HASH_COMMENT_MODE = COMMENT("#", "$");
      var NUMBER_MODE = {
        scope: "number",
        begin: NUMBER_RE,
        relevance: 0
      };
      var C_NUMBER_MODE = {
        scope: "number",
        begin: C_NUMBER_RE,
        relevance: 0
      };
      var BINARY_NUMBER_MODE = {
        scope: "number",
        begin: BINARY_NUMBER_RE,
        relevance: 0
      };
      var REGEXP_MODE = {
        scope: "regexp",
        begin: /\/(?=[^/\n]*\/)/,
        end: /\/[gimuy]*/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      };
      var TITLE_MODE = {
        scope: "title",
        begin: IDENT_RE3,
        relevance: 0
      };
      var UNDERSCORE_TITLE_MODE = {
        scope: "title",
        begin: UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var METHOD_GUARD = {
        // excludes method names from keyword processing
        begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var END_SAME_AS_BEGIN = function(mode) {
        return Object.assign(
          mode,
          {
            /** @type {ModeCallback} */
            "on:begin": (m6, resp) => {
              resp.data._beginMatch = m6[1];
            },
            /** @type {ModeCallback} */
            "on:end": (m6, resp) => {
              if (resp.data._beginMatch !== m6[1]) resp.ignoreMatch();
            }
          }
        );
      };
      var MODES2 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        APOS_STRING_MODE,
        BACKSLASH_ESCAPE,
        BINARY_NUMBER_MODE,
        BINARY_NUMBER_RE,
        COMMENT,
        C_BLOCK_COMMENT_MODE,
        C_LINE_COMMENT_MODE,
        C_NUMBER_MODE,
        C_NUMBER_RE,
        END_SAME_AS_BEGIN,
        HASH_COMMENT_MODE,
        IDENT_RE: IDENT_RE3,
        MATCH_NOTHING_RE,
        METHOD_GUARD,
        NUMBER_MODE,
        NUMBER_RE,
        PHRASAL_WORDS_MODE,
        QUOTE_STRING_MODE,
        REGEXP_MODE,
        RE_STARTERS_RE,
        SHEBANG,
        TITLE_MODE,
        UNDERSCORE_IDENT_RE,
        UNDERSCORE_TITLE_MODE
      });
      function skipIfHasPrecedingDot(match, response) {
        const before = match.input[match.index - 1];
        if (before === ".") {
          response.ignoreMatch();
        }
      }
      function scopeClassName(mode, _parent) {
        if (mode.className !== void 0) {
          mode.scope = mode.className;
          delete mode.className;
        }
      }
      function beginKeywords(mode, parent) {
        if (!parent) return;
        if (!mode.beginKeywords) return;
        mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
        mode.__beforeBegin = skipIfHasPrecedingDot;
        mode.keywords = mode.keywords || mode.beginKeywords;
        delete mode.beginKeywords;
        if (mode.relevance === void 0) mode.relevance = 0;
      }
      function compileIllegal(mode, _parent) {
        if (!Array.isArray(mode.illegal)) return;
        mode.illegal = either(...mode.illegal);
      }
      function compileMatch(mode, _parent) {
        if (!mode.match) return;
        if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");
        mode.begin = mode.match;
        delete mode.match;
      }
      function compileRelevance(mode, _parent) {
        if (mode.relevance === void 0) mode.relevance = 1;
      }
      var beforeMatchExt = (mode, parent) => {
        if (!mode.beforeMatch) return;
        if (mode.starts) throw new Error("beforeMatch cannot be used with starts");
        const originalMode = Object.assign({}, mode);
        Object.keys(mode).forEach((key) => {
          delete mode[key];
        });
        mode.keywords = originalMode.keywords;
        mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
        mode.starts = {
          relevance: 0,
          contains: [
            Object.assign(originalMode, { endsParent: true })
          ]
        };
        mode.relevance = 0;
        delete originalMode.beforeMatch;
      };
      var COMMON_KEYWORDS = [
        "of",
        "and",
        "for",
        "in",
        "not",
        "or",
        "if",
        "then",
        "parent",
        // common variable name
        "list",
        // common variable name
        "value"
        // common variable name
      ];
      var DEFAULT_KEYWORD_SCOPE = "keyword";
      function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
        const compiledKeywords = /* @__PURE__ */ Object.create(null);
        if (typeof rawKeywords === "string") {
          compileList(scopeName, rawKeywords.split(" "));
        } else if (Array.isArray(rawKeywords)) {
          compileList(scopeName, rawKeywords);
        } else {
          Object.keys(rawKeywords).forEach(function(scopeName2) {
            Object.assign(
              compiledKeywords,
              compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
            );
          });
        }
        return compiledKeywords;
        function compileList(scopeName2, keywordList) {
          if (caseInsensitive) {
            keywordList = keywordList.map((x2) => x2.toLowerCase());
          }
          keywordList.forEach(function(keyword) {
            const pair = keyword.split("|");
            compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
          });
        }
      }
      function scoreForKeyword(keyword, providedScore) {
        if (providedScore) {
          return Number(providedScore);
        }
        return commonKeyword(keyword) ? 0 : 1;
      }
      function commonKeyword(keyword) {
        return COMMON_KEYWORDS.includes(keyword.toLowerCase());
      }
      var seenDeprecations = {};
      var error = (message) => {
        console.error(message);
      };
      var warn = (message, ...args) => {
        console.log(`WARN: ${message}`, ...args);
      };
      var deprecated = (version2, message) => {
        if (seenDeprecations[`${version2}/${message}`]) return;
        console.log(`Deprecated as of ${version2}. ${message}`);
        seenDeprecations[`${version2}/${message}`] = true;
      };
      var MultiClassError = new Error();
      function remapScopeNames(mode, regexes, { key }) {
        let offset4 = 0;
        const scopeNames = mode[key];
        const emit = {};
        const positions = {};
        for (let i6 = 1; i6 <= regexes.length; i6++) {
          positions[i6 + offset4] = scopeNames[i6];
          emit[i6 + offset4] = true;
          offset4 += countMatchGroups(regexes[i6 - 1]);
        }
        mode[key] = positions;
        mode[key]._emit = emit;
        mode[key]._multi = true;
      }
      function beginMultiClass(mode) {
        if (!Array.isArray(mode.begin)) return;
        if (mode.skip || mode.excludeBegin || mode.returnBegin) {
          error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
          error("beginScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.begin, { key: "beginScope" });
        mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
      }
      function endMultiClass(mode) {
        if (!Array.isArray(mode.end)) return;
        if (mode.skip || mode.excludeEnd || mode.returnEnd) {
          error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.endScope !== "object" || mode.endScope === null) {
          error("endScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.end, { key: "endScope" });
        mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
      }
      function scopeSugar(mode) {
        if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
          mode.beginScope = mode.scope;
          delete mode.scope;
        }
      }
      function MultiClass(mode) {
        scopeSugar(mode);
        if (typeof mode.beginScope === "string") {
          mode.beginScope = { _wrap: mode.beginScope };
        }
        if (typeof mode.endScope === "string") {
          mode.endScope = { _wrap: mode.endScope };
        }
        beginMultiClass(mode);
        endMultiClass(mode);
      }
      function compileLanguage(language) {
        function langRe(value, global) {
          return new RegExp(
            source(value),
            "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
          );
        }
        class MultiRegex {
          constructor() {
            this.matchIndexes = {};
            this.regexes = [];
            this.matchAt = 1;
            this.position = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            opts.position = this.position++;
            this.matchIndexes[this.matchAt] = opts;
            this.regexes.push([opts, re]);
            this.matchAt += countMatchGroups(re) + 1;
          }
          compile() {
            if (this.regexes.length === 0) {
              this.exec = () => null;
            }
            const terminators = this.regexes.map((el) => el[1]);
            this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
            this.lastIndex = 0;
          }
          /** @param {string} s */
          exec(s11) {
            this.matcherRe.lastIndex = this.lastIndex;
            const match = this.matcherRe.exec(s11);
            if (!match) {
              return null;
            }
            const i6 = match.findIndex((el, i7) => i7 > 0 && el !== void 0);
            const matchData = this.matchIndexes[i6];
            match.splice(0, i6);
            return Object.assign(match, matchData);
          }
        }
        class ResumableMultiRegex {
          constructor() {
            this.rules = [];
            this.multiRegexes = [];
            this.count = 0;
            this.lastIndex = 0;
            this.regexIndex = 0;
          }
          // @ts-ignore
          getMatcher(index2) {
            if (this.multiRegexes[index2]) return this.multiRegexes[index2];
            const matcher = new MultiRegex();
            this.rules.slice(index2).forEach(([re, opts]) => matcher.addRule(re, opts));
            matcher.compile();
            this.multiRegexes[index2] = matcher;
            return matcher;
          }
          resumingScanAtSamePosition() {
            return this.regexIndex !== 0;
          }
          considerAll() {
            this.regexIndex = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            this.rules.push([re, opts]);
            if (opts.type === "begin") this.count++;
          }
          /** @param {string} s */
          exec(s11) {
            const m6 = this.getMatcher(this.regexIndex);
            m6.lastIndex = this.lastIndex;
            let result = m6.exec(s11);
            if (this.resumingScanAtSamePosition()) {
              if (result && result.index === this.lastIndex) ;
              else {
                const m22 = this.getMatcher(0);
                m22.lastIndex = this.lastIndex + 1;
                result = m22.exec(s11);
              }
            }
            if (result) {
              this.regexIndex += result.position + 1;
              if (this.regexIndex === this.count) {
                this.considerAll();
              }
            }
            return result;
          }
        }
        function buildModeRegex(mode) {
          const mm = new ResumableMultiRegex();
          mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
          if (mode.terminatorEnd) {
            mm.addRule(mode.terminatorEnd, { type: "end" });
          }
          if (mode.illegal) {
            mm.addRule(mode.illegal, { type: "illegal" });
          }
          return mm;
        }
        function compileMode(mode, parent) {
          const cmode = (
            /** @type CompiledMode */
            mode
          );
          if (mode.isCompiled) return cmode;
          [
            scopeClassName,
            // do this early so compiler extensions generally don't have to worry about
            // the distinction between match/begin
            compileMatch,
            MultiClass,
            beforeMatchExt
          ].forEach((ext) => ext(mode, parent));
          language.compilerExtensions.forEach((ext) => ext(mode, parent));
          mode.__beforeBegin = null;
          [
            beginKeywords,
            // do this later so compiler extensions that come earlier have access to the
            // raw array if they wanted to perhaps manipulate it, etc.
            compileIllegal,
            // default to 1 relevance if not specified
            compileRelevance
          ].forEach((ext) => ext(mode, parent));
          mode.isCompiled = true;
          let keywordPattern = null;
          if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
            mode.keywords = Object.assign({}, mode.keywords);
            keywordPattern = mode.keywords.$pattern;
            delete mode.keywords.$pattern;
          }
          keywordPattern = keywordPattern || /\w+/;
          if (mode.keywords) {
            mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
          }
          cmode.keywordPatternRe = langRe(keywordPattern, true);
          if (parent) {
            if (!mode.begin) mode.begin = /\B|\b/;
            cmode.beginRe = langRe(cmode.begin);
            if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
            if (mode.end) cmode.endRe = langRe(cmode.end);
            cmode.terminatorEnd = source(cmode.end) || "";
            if (mode.endsWithParent && parent.terminatorEnd) {
              cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
            }
          }
          if (mode.illegal) cmode.illegalRe = langRe(
            /** @type {RegExp | string} */
            mode.illegal
          );
          if (!mode.contains) mode.contains = [];
          mode.contains = [].concat(...mode.contains.map(function(c4) {
            return expandOrCloneMode(c4 === "self" ? mode : c4);
          }));
          mode.contains.forEach(function(c4) {
            compileMode(
              /** @type Mode */
              c4,
              cmode
            );
          });
          if (mode.starts) {
            compileMode(mode.starts, parent);
          }
          cmode.matcher = buildModeRegex(cmode);
          return cmode;
        }
        if (!language.compilerExtensions) language.compilerExtensions = [];
        if (language.contains && language.contains.includes("self")) {
          throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        }
        language.classNameAliases = inherit$1(language.classNameAliases || {});
        return compileMode(
          /** @type Mode */
          language
        );
      }
      function dependencyOnParent(mode) {
        if (!mode) return false;
        return mode.endsWithParent || dependencyOnParent(mode.starts);
      }
      function expandOrCloneMode(mode) {
        if (mode.variants && !mode.cachedVariants) {
          mode.cachedVariants = mode.variants.map(function(variant) {
            return inherit$1(mode, { variants: null }, variant);
          });
        }
        if (mode.cachedVariants) {
          return mode.cachedVariants;
        }
        if (dependencyOnParent(mode)) {
          return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
        }
        if (Object.isFrozen(mode)) {
          return inherit$1(mode);
        }
        return mode;
      }
      var version = "11.11.1";
      var HTMLInjectionError = class extends Error {
        constructor(reason, html) {
          super(reason);
          this.name = "HTMLInjectionError";
          this.html = html;
        }
      };
      var escape = escapeHTML;
      var inherit = inherit$1;
      var NO_MATCH = Symbol("nomatch");
      var MAX_KEYWORD_HITS = 7;
      var HLJS = function(hljs) {
        const languages = /* @__PURE__ */ Object.create(null);
        const aliases = /* @__PURE__ */ Object.create(null);
        const plugins = [];
        let SAFE_MODE = true;
        const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
        const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
        let options = {
          ignoreUnescapedHTML: false,
          throwUnescapedHTML: false,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          // beta configuration options, subject to change, welcome to discuss
          // https://github.com/highlightjs/highlight.js/issues/1086
          __emitter: TokenTreeEmitter
        };
        function shouldNotHighlight(languageName) {
          return options.noHighlightRe.test(languageName);
        }
        function blockLanguage(block) {
          let classes = block.className + " ";
          classes += block.parentNode ? block.parentNode.className : "";
          const match = options.languageDetectRe.exec(classes);
          if (match) {
            const language = getLanguage(match[1]);
            if (!language) {
              warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
              warn("Falling back to no-highlight mode for this block.", block);
            }
            return language ? match[1] : "no-highlight";
          }
          return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
        }
        function highlight2(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
          let code = "";
          let languageName = "";
          if (typeof optionsOrCode === "object") {
            code = codeOrLanguageName;
            ignoreIllegals = optionsOrCode.ignoreIllegals;
            languageName = optionsOrCode.language;
          } else {
            deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
            deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
            languageName = codeOrLanguageName;
            code = optionsOrCode;
          }
          if (ignoreIllegals === void 0) {
            ignoreIllegals = true;
          }
          const context = {
            code,
            language: languageName
          };
          fire("before:highlight", context);
          const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
          result.code = context.code;
          fire("after:highlight", result);
          return result;
        }
        function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
          const keywordHits = /* @__PURE__ */ Object.create(null);
          function keywordData(mode, matchText) {
            return mode.keywords[matchText];
          }
          function processKeywords() {
            if (!top.keywords) {
              emitter.addText(modeBuffer);
              return;
            }
            let lastIndex = 0;
            top.keywordPatternRe.lastIndex = 0;
            let match = top.keywordPatternRe.exec(modeBuffer);
            let buf = "";
            while (match) {
              buf += modeBuffer.substring(lastIndex, match.index);
              const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
              const data = keywordData(top, word);
              if (data) {
                const [kind, keywordRelevance] = data;
                emitter.addText(buf);
                buf = "";
                keywordHits[word] = (keywordHits[word] || 0) + 1;
                if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
                if (kind.startsWith("_")) {
                  buf += match[0];
                } else {
                  const cssClass = language.classNameAliases[kind] || kind;
                  emitKeyword(match[0], cssClass);
                }
              } else {
                buf += match[0];
              }
              lastIndex = top.keywordPatternRe.lastIndex;
              match = top.keywordPatternRe.exec(modeBuffer);
            }
            buf += modeBuffer.substring(lastIndex);
            emitter.addText(buf);
          }
          function processSubLanguage() {
            if (modeBuffer === "") return;
            let result2 = null;
            if (typeof top.subLanguage === "string") {
              if (!languages[top.subLanguage]) {
                emitter.addText(modeBuffer);
                return;
              }
              result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
              continuations[top.subLanguage] = /** @type {CompiledMode} */
              result2._top;
            } else {
              result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
            }
            if (top.relevance > 0) {
              relevance += result2.relevance;
            }
            emitter.__addSublanguage(result2._emitter, result2.language);
          }
          function processBuffer() {
            if (top.subLanguage != null) {
              processSubLanguage();
            } else {
              processKeywords();
            }
            modeBuffer = "";
          }
          function emitKeyword(keyword, scope) {
            if (keyword === "") return;
            emitter.startScope(scope);
            emitter.addText(keyword);
            emitter.endScope();
          }
          function emitMultiClass(scope, match) {
            let i6 = 1;
            const max2 = match.length - 1;
            while (i6 <= max2) {
              if (!scope._emit[i6]) {
                i6++;
                continue;
              }
              const klass = language.classNameAliases[scope[i6]] || scope[i6];
              const text = match[i6];
              if (klass) {
                emitKeyword(text, klass);
              } else {
                modeBuffer = text;
                processKeywords();
                modeBuffer = "";
              }
              i6++;
            }
          }
          function startNewMode(mode, match) {
            if (mode.scope && typeof mode.scope === "string") {
              emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
            }
            if (mode.beginScope) {
              if (mode.beginScope._wrap) {
                emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
                modeBuffer = "";
              } else if (mode.beginScope._multi) {
                emitMultiClass(mode.beginScope, match);
                modeBuffer = "";
              }
            }
            top = Object.create(mode, { parent: { value: top } });
            return top;
          }
          function endOfMode(mode, match, matchPlusRemainder) {
            let matched = startsWith(mode.endRe, matchPlusRemainder);
            if (matched) {
              if (mode["on:end"]) {
                const resp = new Response(mode);
                mode["on:end"](match, resp);
                if (resp.isMatchIgnored) matched = false;
              }
              if (matched) {
                while (mode.endsParent && mode.parent) {
                  mode = mode.parent;
                }
                return mode;
              }
            }
            if (mode.endsWithParent) {
              return endOfMode(mode.parent, match, matchPlusRemainder);
            }
          }
          function doIgnore(lexeme) {
            if (top.matcher.regexIndex === 0) {
              modeBuffer += lexeme[0];
              return 1;
            } else {
              resumeScanAtSamePosition = true;
              return 0;
            }
          }
          function doBeginMatch(match) {
            const lexeme = match[0];
            const newMode = match.rule;
            const resp = new Response(newMode);
            const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
            for (const cb of beforeCallbacks) {
              if (!cb) continue;
              cb(match, resp);
              if (resp.isMatchIgnored) return doIgnore(lexeme);
            }
            if (newMode.skip) {
              modeBuffer += lexeme;
            } else {
              if (newMode.excludeBegin) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (!newMode.returnBegin && !newMode.excludeBegin) {
                modeBuffer = lexeme;
              }
            }
            startNewMode(newMode, match);
            return newMode.returnBegin ? 0 : lexeme.length;
          }
          function doEndMatch(match) {
            const lexeme = match[0];
            const matchPlusRemainder = codeToHighlight.substring(match.index);
            const endMode = endOfMode(top, match, matchPlusRemainder);
            if (!endMode) {
              return NO_MATCH;
            }
            const origin = top;
            if (top.endScope && top.endScope._wrap) {
              processBuffer();
              emitKeyword(lexeme, top.endScope._wrap);
            } else if (top.endScope && top.endScope._multi) {
              processBuffer();
              emitMultiClass(top.endScope, match);
            } else if (origin.skip) {
              modeBuffer += lexeme;
            } else {
              if (!(origin.returnEnd || origin.excludeEnd)) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (origin.excludeEnd) {
                modeBuffer = lexeme;
              }
            }
            do {
              if (top.scope) {
                emitter.closeNode();
              }
              if (!top.skip && !top.subLanguage) {
                relevance += top.relevance;
              }
              top = top.parent;
            } while (top !== endMode.parent);
            if (endMode.starts) {
              startNewMode(endMode.starts, match);
            }
            return origin.returnEnd ? 0 : lexeme.length;
          }
          function processContinuations() {
            const list = [];
            for (let current = top; current !== language; current = current.parent) {
              if (current.scope) {
                list.unshift(current.scope);
              }
            }
            list.forEach((item) => emitter.openNode(item));
          }
          let lastMatch = {};
          function processLexeme(textBeforeMatch, match) {
            const lexeme = match && match[0];
            modeBuffer += textBeforeMatch;
            if (lexeme == null) {
              processBuffer();
              return 0;
            }
            if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
              modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
              if (!SAFE_MODE) {
                const err = new Error(`0 width match regex (${languageName})`);
                err.languageName = languageName;
                err.badRule = lastMatch.rule;
                throw err;
              }
              return 1;
            }
            lastMatch = match;
            if (match.type === "begin") {
              return doBeginMatch(match);
            } else if (match.type === "illegal" && !ignoreIllegals) {
              const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
              err.mode = top;
              throw err;
            } else if (match.type === "end") {
              const processed = doEndMatch(match);
              if (processed !== NO_MATCH) {
                return processed;
              }
            }
            if (match.type === "illegal" && lexeme === "") {
              modeBuffer += "\n";
              return 1;
            }
            if (iterations > 1e5 && iterations > match.index * 3) {
              const err = new Error("potential infinite loop, way more iterations than matches");
              throw err;
            }
            modeBuffer += lexeme;
            return lexeme.length;
          }
          const language = getLanguage(languageName);
          if (!language) {
            error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
            throw new Error('Unknown language: "' + languageName + '"');
          }
          const md = compileLanguage(language);
          let result = "";
          let top = continuation || md;
          const continuations = {};
          const emitter = new options.__emitter(options);
          processContinuations();
          let modeBuffer = "";
          let relevance = 0;
          let index2 = 0;
          let iterations = 0;
          let resumeScanAtSamePosition = false;
          try {
            if (!language.__emitTokens) {
              top.matcher.considerAll();
              for (; ; ) {
                iterations++;
                if (resumeScanAtSamePosition) {
                  resumeScanAtSamePosition = false;
                } else {
                  top.matcher.considerAll();
                }
                top.matcher.lastIndex = index2;
                const match = top.matcher.exec(codeToHighlight);
                if (!match) break;
                const beforeMatch = codeToHighlight.substring(index2, match.index);
                const processedCount = processLexeme(beforeMatch, match);
                index2 = match.index + processedCount;
              }
              processLexeme(codeToHighlight.substring(index2));
            } else {
              language.__emitTokens(codeToHighlight, emitter);
            }
            emitter.finalize();
            result = emitter.toHTML();
            return {
              language: languageName,
              value: result,
              relevance,
              illegal: false,
              _emitter: emitter,
              _top: top
            };
          } catch (err) {
            if (err.message && err.message.includes("Illegal")) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: true,
                relevance: 0,
                _illegalBy: {
                  message: err.message,
                  index: index2,
                  context: codeToHighlight.slice(index2 - 100, index2 + 100),
                  mode: err.mode,
                  resultSoFar: result
                },
                _emitter: emitter
              };
            } else if (SAFE_MODE) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: false,
                relevance: 0,
                errorRaised: err,
                _emitter: emitter,
                _top: top
              };
            } else {
              throw err;
            }
          }
        }
        function justTextHighlightResult(code) {
          const result = {
            value: escape(code),
            illegal: false,
            relevance: 0,
            _top: PLAINTEXT_LANGUAGE,
            _emitter: new options.__emitter(options)
          };
          result._emitter.addText(code);
          return result;
        }
        function highlightAuto(code, languageSubset) {
          languageSubset = languageSubset || options.languages || Object.keys(languages);
          const plaintext = justTextHighlightResult(code);
          const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
            (name) => _highlight(name, code, false)
          );
          results.unshift(plaintext);
          const sorted = results.sort((a16, b2) => {
            if (a16.relevance !== b2.relevance) return b2.relevance - a16.relevance;
            if (a16.language && b2.language) {
              if (getLanguage(a16.language).supersetOf === b2.language) {
                return 1;
              } else if (getLanguage(b2.language).supersetOf === a16.language) {
                return -1;
              }
            }
            return 0;
          });
          const [best, secondBest] = sorted;
          const result = best;
          result.secondBest = secondBest;
          return result;
        }
        function updateClassName(element, currentLang, resultLang) {
          const language = currentLang && aliases[currentLang] || resultLang;
          element.classList.add("hljs");
          element.classList.add(`language-${language}`);
        }
        function highlightElement(element) {
          let node = null;
          const language = blockLanguage(element);
          if (shouldNotHighlight(language)) return;
          fire(
            "before:highlightElement",
            { el: element, language }
          );
          if (element.dataset.highlighted) {
            console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
            return;
          }
          if (element.children.length > 0) {
            if (!options.ignoreUnescapedHTML) {
              console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
              console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
              console.warn("The element with unescaped HTML:");
              console.warn(element);
            }
            if (options.throwUnescapedHTML) {
              const err = new HTMLInjectionError(
                "One of your code blocks includes unescaped HTML.",
                element.innerHTML
              );
              throw err;
            }
          }
          node = element;
          const text = node.textContent;
          const result = language ? highlight2(text, { language, ignoreIllegals: true }) : highlightAuto(text);
          element.innerHTML = result.value;
          element.dataset.highlighted = "yes";
          updateClassName(element, language, result.language);
          element.result = {
            language: result.language,
            // TODO: remove with version 11.0
            re: result.relevance,
            relevance: result.relevance
          };
          if (result.secondBest) {
            element.secondBest = {
              language: result.secondBest.language,
              relevance: result.secondBest.relevance
            };
          }
          fire("after:highlightElement", { el: element, result, text });
        }
        function configure(userOptions) {
          options = inherit(options, userOptions);
        }
        const initHighlighting = () => {
          highlightAll();
          deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
        };
        function initHighlightingOnLoad() {
          highlightAll();
          deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
        }
        let wantsHighlight = false;
        function highlightAll() {
          function boot() {
            highlightAll();
          }
          if (document.readyState === "loading") {
            if (!wantsHighlight) {
              window.addEventListener("DOMContentLoaded", boot, false);
            }
            wantsHighlight = true;
            return;
          }
          const blocks = document.querySelectorAll(options.cssSelector);
          blocks.forEach(highlightElement);
        }
        function registerLanguage(languageName, languageDefinition) {
          let lang = null;
          try {
            lang = languageDefinition(hljs);
          } catch (error$1) {
            error("Language definition for '{}' could not be registered.".replace("{}", languageName));
            if (!SAFE_MODE) {
              throw error$1;
            } else {
              error(error$1);
            }
            lang = PLAINTEXT_LANGUAGE;
          }
          if (!lang.name) lang.name = languageName;
          languages[languageName] = lang;
          lang.rawDefinition = languageDefinition.bind(null, hljs);
          if (lang.aliases) {
            registerAliases(lang.aliases, { languageName });
          }
        }
        function unregisterLanguage(languageName) {
          delete languages[languageName];
          for (const alias of Object.keys(aliases)) {
            if (aliases[alias] === languageName) {
              delete aliases[alias];
            }
          }
        }
        function listLanguages() {
          return Object.keys(languages);
        }
        function getLanguage(name) {
          name = (name || "").toLowerCase();
          return languages[name] || languages[aliases[name]];
        }
        function registerAliases(aliasList, { languageName }) {
          if (typeof aliasList === "string") {
            aliasList = [aliasList];
          }
          aliasList.forEach((alias) => {
            aliases[alias.toLowerCase()] = languageName;
          });
        }
        function autoDetection(name) {
          const lang = getLanguage(name);
          return lang && !lang.disableAutodetect;
        }
        function upgradePluginAPI(plugin) {
          if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
            plugin["before:highlightElement"] = (data) => {
              plugin["before:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
          if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
            plugin["after:highlightElement"] = (data) => {
              plugin["after:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
        }
        function addPlugin(plugin) {
          upgradePluginAPI(plugin);
          plugins.push(plugin);
        }
        function removePlugin(plugin) {
          const index2 = plugins.indexOf(plugin);
          if (index2 !== -1) {
            plugins.splice(index2, 1);
          }
        }
        function fire(event, args) {
          const cb = event;
          plugins.forEach(function(plugin) {
            if (plugin[cb]) {
              plugin[cb](args);
            }
          });
        }
        function deprecateHighlightBlock(el) {
          deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
          deprecated("10.7.0", "Please use highlightElement now.");
          return highlightElement(el);
        }
        Object.assign(hljs, {
          highlight: highlight2,
          highlightAuto,
          highlightAll,
          highlightElement,
          // TODO: Remove with v12 API
          highlightBlock: deprecateHighlightBlock,
          configure,
          initHighlighting,
          initHighlightingOnLoad,
          registerLanguage,
          unregisterLanguage,
          listLanguages,
          getLanguage,
          registerAliases,
          autoDetection,
          inherit,
          addPlugin,
          removePlugin
        });
        hljs.debugMode = function() {
          SAFE_MODE = false;
        };
        hljs.safeMode = function() {
          SAFE_MODE = true;
        };
        hljs.versionString = version;
        hljs.regex = {
          concat,
          lookahead,
          either,
          optional,
          anyNumberOfTimes
        };
        for (const key in MODES2) {
          if (typeof MODES2[key] === "object") {
            deepFreeze(MODES2[key]);
          }
        }
        Object.assign(hljs, MODES2);
        return hljs;
      };
      var highlight = HLJS({});
      highlight.newInstance = () => HLJS({});
      module.exports = highlight;
      highlight.HighlightJS = highlight;
      highlight.default = highlight;
    }
  });

  // src/index.jsx
  var import_react8 = __toESM(require_react());
  var import_client = __toESM(require_client());

  // src/App.jsx
  var import_react7 = __toESM(require_react());

  // node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
  var dist_exports2 = {};
  __export(dist_exports2, {
    Root: () => Root,
    VISUALLY_HIDDEN_STYLES: () => VISUALLY_HIDDEN_STYLES,
    VisuallyHidden: () => VisuallyHidden
  });
  var React4 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-primitive/dist/index.mjs
  var React3 = __toESM(require_react(), 1);
  var ReactDOM = __toESM(require_react_dom(), 1);

  // node_modules/@radix-ui/react-slot/dist/index.mjs
  var dist_exports = {};
  __export(dist_exports, {
    Root: () => Slot,
    Slot: () => Slot,
    Slottable: () => Slottable,
    createSlot: () => createSlot,
    createSlottable: () => createSlottable
  });
  var React2 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-compose-refs/dist/index.mjs
  var React = __toESM(require_react(), 1);
  function setRef(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs(...refs) {
    return (node) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef(ref, node);
        if (!hasCleanup && typeof cleanup == "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i6 = 0; i6 < cleanups.length; i6++) {
            const cleanup = cleanups[i6];
            if (typeof cleanup == "function") {
              cleanup();
            } else {
              setRef(refs[i6], null);
            }
          }
        };
      }
    };
  }
  function useComposedRefs(...refs) {
    return React.useCallback(composeRefs(...refs), refs);
  }

  // node_modules/@radix-ui/react-slot/dist/index.mjs
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
  // @__NO_SIDE_EFFECTS__
  function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot22 = React2.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      const childrenArray = React2.Children.toArray(children);
      const slottable = childrenArray.find(isSlottable);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (React2.Children.count(newElement) > 1) return React2.Children.only(null);
            return React2.isValidElement(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: React2.isValidElement(newElement) ? React2.cloneElement(newElement, void 0, newChildren) : null });
      }
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot22.displayName = `${ownerName}.Slot`;
    return Slot22;
  }
  var Slot = /* @__PURE__ */ createSlot("Slot");
  // @__NO_SIDE_EFFECTS__
  function createSlotClone(ownerName) {
    const SlotClone = React2.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      if (React2.isValidElement(children)) {
        const childrenRef = getElementRef(children);
        const props2 = mergeProps(slotProps, children.props);
        if (children.type !== React2.Fragment) {
          props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }
        return React2.cloneElement(children, props2);
      }
      return React2.Children.count(children) > 1 ? React2.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
  // @__NO_SIDE_EFFECTS__
  function createSlottable(ownerName) {
    const Slottable22 = ({ children }) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
    };
    Slottable22.displayName = `${ownerName}.Slottable`;
    Slottable22.__radixId = SLOTTABLE_IDENTIFIER;
    return Slottable22;
  }
  var Slottable = /* @__PURE__ */ createSlottable("Slottable");
  function isSlottable(child) {
    return React2.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
  }
  function mergeProps(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }

  // node_modules/@radix-ui/react-primitive/dist/index.mjs
  var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
  var NODES = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ];
  var Primitive = NODES.reduce((primitive, node) => {
    const Slot3 = createSlot(`Primitive.${node}`);
    const Node2 = React3.forwardRef((props, forwardedRef) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? Slot3 : node;
      if (typeof window !== "undefined") {
        window[Symbol.for("radix-ui")] = true;
      }
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
    });
    Node2.displayName = `Primitive.${node}`;
    return { ...primitive, [node]: Node2 };
  }, {});
  function dispatchDiscreteCustomEvent(target, event) {
    if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
  }

  // node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
  var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
  var VISUALLY_HIDDEN_STYLES = Object.freeze({
    // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
    position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal"
  });
  var NAME = "VisuallyHidden";
  var VisuallyHidden = React4.forwardRef(
    (props, forwardedRef) => {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Primitive.span,
        {
          ...props,
          ref: forwardedRef,
          style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
        }
      );
    }
  );
  VisuallyHidden.displayName = NAME;
  var Root = VisuallyHidden;

  // node_modules/@radix-ui/react-context/dist/index.mjs
  var React5 = __toESM(require_react(), 1);
  var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
  function createContext2(rootComponentName, defaultContext) {
    const Context = React5.createContext(defaultContext);
    const Provider3 = (props) => {
      const { children, ...context } = props;
      const value = React5.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Context.Provider, { value, children });
    };
    Provider3.displayName = rootComponentName + "Provider";
    function useContext22(consumerName) {
      const context = React5.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider3, useContext22];
  }
  function createContextScope(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function createContext32(rootComponentName, defaultContext) {
      const BaseContext = React5.createContext(defaultContext);
      const index2 = defaultContexts.length;
      defaultContexts = [...defaultContexts, defaultContext];
      const Provider3 = (props) => {
        const { scope, children, ...context } = props;
        const Context = scope?.[scopeName]?.[index2] || BaseContext;
        const value = React5.useMemo(() => context, Object.values(context));
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Context.Provider, { value, children });
      };
      Provider3.displayName = rootComponentName + "Provider";
      function useContext22(consumerName, scope) {
        const Context = scope?.[scopeName]?.[index2] || BaseContext;
        const context = React5.useContext(Context);
        if (context) return context;
        if (defaultContext !== void 0) return defaultContext;
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      return [Provider3, useContext22];
    }
    const createScope = () => {
      const scopeContexts = defaultContexts.map((defaultContext) => {
        return React5.createContext(defaultContext);
      });
      return function useScope(scope) {
        const contexts = scope?.[scopeName] || scopeContexts;
        return React5.useMemo(
          () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
          [scope, contexts]
        );
      };
    };
    createScope.scopeName = scopeName;
    return [createContext32, composeContextScopes(createScope, ...createContextScopeDeps)];
  }
  function composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1) return baseScope;
    const createScope = () => {
      const scopeHooks = scopes.map((createScope2) => ({
        useScope: createScope2(),
        scopeName: createScope2.scopeName
      }));
      return function useComposedScopes(overrideScopes) {
        const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes2, ...currentScope };
        }, {});
        return React5.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
      };
    };
    createScope.scopeName = baseScope.scopeName;
    return createScope;
  }

  // node_modules/@radix-ui/primitive/dist/index.mjs
  var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
      originalEventHandler?.(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented) {
        return ourEventHandler?.(event);
      }
    };
  }

  // node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
  var React7 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
  var React6 = __toESM(require_react(), 1);
  var useLayoutEffect2 = globalThis?.document ? React6.useLayoutEffect : () => {
  };

  // node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
  var React22 = __toESM(require_react(), 1);
  var useInsertionEffect = React7[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
  function useControllableState({
    prop,
    defaultProp,
    onChange = () => {
    },
    caller
  }) {
    const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
      defaultProp,
      onChange
    });
    const isControlled = prop !== void 0;
    const value = isControlled ? prop : uncontrolledProp;
    if (true) {
      const isControlledRef = React7.useRef(prop !== void 0);
      React7.useEffect(() => {
        const wasControlled = isControlledRef.current;
        if (wasControlled !== isControlled) {
          const from = wasControlled ? "controlled" : "uncontrolled";
          const to = isControlled ? "controlled" : "uncontrolled";
          console.warn(
            `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
          );
        }
        isControlledRef.current = isControlled;
      }, [isControlled, caller]);
    }
    const setValue = React7.useCallback(
      (nextValue) => {
        if (isControlled) {
          const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
          if (value2 !== prop) {
            onChangeRef.current?.(value2);
          }
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, onChangeRef]
    );
    return [value, setValue];
  }
  function useUncontrolledState({
    defaultProp,
    onChange
  }) {
    const [value, setValue] = React7.useState(defaultProp);
    const prevValueRef = React7.useRef(value);
    const onChangeRef = React7.useRef(onChange);
    useInsertionEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);
    React7.useEffect(() => {
      if (prevValueRef.current !== value) {
        onChangeRef.current?.(value);
        prevValueRef.current = value;
      }
    }, [value, prevValueRef]);
    return [value, setValue, onChangeRef];
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  var SYNC_STATE = Symbol("RADIX:SYNC_STATE");

  // node_modules/@radix-ui/react-presence/dist/index.mjs
  var React23 = __toESM(require_react(), 1);
  var React8 = __toESM(require_react(), 1);
  function useStateMachine(initialState, machine) {
    return React8.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState);
  }
  var Presence = (props) => {
    const { present, children } = props;
    const presence = usePresence(present);
    const child = typeof children === "function" ? children({ present: presence.isPresent }) : React23.Children.only(children);
    const ref = useComposedRefs(presence.ref, getElementRef2(child));
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? React23.cloneElement(child, { ref }) : null;
  };
  Presence.displayName = "Presence";
  function usePresence(present) {
    const [node, setNode] = React23.useState();
    const stylesRef = React23.useRef(null);
    const prevPresentRef = React23.useRef(present);
    const prevAnimationNameRef = React23.useRef("none");
    const initialState = present ? "mounted" : "unmounted";
    const [state, send] = useStateMachine(initialState, {
      mounted: {
        UNMOUNT: "unmounted",
        ANIMATION_OUT: "unmountSuspended"
      },
      unmountSuspended: {
        MOUNT: "mounted",
        ANIMATION_END: "unmounted"
      },
      unmounted: {
        MOUNT: "mounted"
      }
    });
    React23.useEffect(() => {
      const currentAnimationName = getAnimationName(stylesRef.current);
      prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
    }, [state]);
    useLayoutEffect2(() => {
      const styles = stylesRef.current;
      const wasPresent = prevPresentRef.current;
      const hasPresentChanged = wasPresent !== present;
      if (hasPresentChanged) {
        const prevAnimationName = prevAnimationNameRef.current;
        const currentAnimationName = getAnimationName(styles);
        if (present) {
          send("MOUNT");
        } else if (currentAnimationName === "none" || styles?.display === "none") {
          send("UNMOUNT");
        } else {
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (wasPresent && isAnimating) {
            send("ANIMATION_OUT");
          } else {
            send("UNMOUNT");
          }
        }
        prevPresentRef.current = present;
      }
    }, [present, send]);
    useLayoutEffect2(() => {
      if (node) {
        let timeoutId;
        const ownerWindow = node.ownerDocument.defaultView ?? window;
        const handleAnimationEnd = (event) => {
          const currentAnimationName = getAnimationName(stylesRef.current);
          const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
          if (event.target === node && isCurrentAnimation) {
            send("ANIMATION_END");
            if (!prevPresentRef.current) {
              const currentFillMode = node.style.animationFillMode;
              node.style.animationFillMode = "forwards";
              timeoutId = ownerWindow.setTimeout(() => {
                if (node.style.animationFillMode === "forwards") {
                  node.style.animationFillMode = currentFillMode;
                }
              });
            }
          }
        };
        const handleAnimationStart = (event) => {
          if (event.target === node) {
            prevAnimationNameRef.current = getAnimationName(stylesRef.current);
          }
        };
        node.addEventListener("animationstart", handleAnimationStart);
        node.addEventListener("animationcancel", handleAnimationEnd);
        node.addEventListener("animationend", handleAnimationEnd);
        return () => {
          ownerWindow.clearTimeout(timeoutId);
          node.removeEventListener("animationstart", handleAnimationStart);
          node.removeEventListener("animationcancel", handleAnimationEnd);
          node.removeEventListener("animationend", handleAnimationEnd);
        };
      } else {
        send("ANIMATION_END");
      }
    }, [node, send]);
    return {
      isPresent: ["mounted", "unmountSuspended"].includes(state),
      ref: React23.useCallback((node2) => {
        stylesRef.current = node2 ? getComputedStyle(node2) : null;
        setNode(node2);
      }, [])
    };
  }
  function getAnimationName(styles) {
    return styles?.animationName || "none";
  }
  function getElementRef2(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }

  // node_modules/@radix-ui/react-id/dist/index.mjs
  var React9 = __toESM(require_react(), 1);
  var useReactId = React9[" useId ".trim().toString()] || (() => void 0);
  var count = 0;
  function useId(deterministicId) {
    const [id, setId] = React9.useState(useReactId());
    useLayoutEffect2(() => {
      if (!deterministicId) setId((reactId) => reactId ?? String(count++));
    }, [deterministicId]);
    return deterministicId || (id ? `radix-${id}` : "");
  }

  // node_modules/@radix-ui/react-direction/dist/index.mjs
  var dist_exports3 = {};
  __export(dist_exports3, {
    DirectionProvider: () => DirectionProvider,
    Provider: () => Provider,
    useDirection: () => useDirection
  });
  var React10 = __toESM(require_react(), 1);
  var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
  var DirectionContext = React10.createContext(void 0);
  var DirectionProvider = (props) => {
    const { dir, children } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DirectionContext.Provider, { value: dir, children });
  };
  function useDirection(localDir) {
    const globalDir = React10.useContext(DirectionContext);
    return localDir || globalDir || "ltr";
  }
  var Provider = DirectionProvider;

  // node_modules/@radix-ui/react-dialog/dist/index.mjs
  var dist_exports4 = {};
  __export(dist_exports4, {
    Close: () => Close,
    Content: () => Content,
    Description: () => Description,
    Dialog: () => Dialog,
    DialogClose: () => DialogClose,
    DialogContent: () => DialogContent,
    DialogDescription: () => DialogDescription,
    DialogOverlay: () => DialogOverlay,
    DialogPortal: () => DialogPortal,
    DialogTitle: () => DialogTitle,
    DialogTrigger: () => DialogTrigger,
    Overlay: () => Overlay,
    Portal: () => Portal2,
    Root: () => Root2,
    Title: () => Title,
    Trigger: () => Trigger,
    WarningProvider: () => WarningProvider,
    createDialogScope: () => createDialogScope
  });
  var React26 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
  var React13 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
  var React11 = __toESM(require_react(), 1);
  function useCallbackRef(callback) {
    const callbackRef = React11.useRef(callback);
    React11.useEffect(() => {
      callbackRef.current = callback;
    });
    return React11.useMemo(() => (...args) => callbackRef.current?.(...args), []);
  }

  // node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
  var React12 = __toESM(require_react(), 1);
  function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
    const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);
    React12.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onEscapeKeyDown(event);
        }
      };
      ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
      return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [onEscapeKeyDown, ownerDocument]);
  }

  // node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
  var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
  var DISMISSABLE_LAYER_NAME = "DismissableLayer";
  var CONTEXT_UPDATE = "dismissableLayer.update";
  var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
  var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
  var originalBodyPointerEvents;
  var DismissableLayerContext = React13.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  });
  var DismissableLayer = React13.forwardRef(
    (props, forwardedRef) => {
      const {
        disableOutsidePointerEvents = false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        onDismiss,
        ...layerProps
      } = props;
      const context = React13.useContext(DismissableLayerContext);
      const [node, setNode] = React13.useState(null);
      const ownerDocument = node?.ownerDocument ?? globalThis?.document;
      const [, force] = React13.useState({});
      const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
      const layers = Array.from(context.layers);
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
      const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
      const index2 = node ? layers.indexOf(node) : -1;
      const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
      const isPointerEventsEnabled = index2 >= highestLayerWithOutsidePointerEventsDisabledIndex;
      const pointerDownOutside = usePointerDownOutside((event) => {
        const target = event.target;
        const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
        if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
        onPointerDownOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      }, ownerDocument);
      const focusOutside = useFocusOutside((event) => {
        const target = event.target;
        const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
        if (isFocusInBranch) return;
        onFocusOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      }, ownerDocument);
      useEscapeKeydown((event) => {
        const isHighestLayer = index2 === context.layers.size - 1;
        if (!isHighestLayer) return;
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented && onDismiss) {
          event.preventDefault();
          onDismiss();
        }
      }, ownerDocument);
      React13.useEffect(() => {
        if (!node) return;
        if (disableOutsidePointerEvents) {
          if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
            originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = "none";
          }
          context.layersWithOutsidePointerEventsDisabled.add(node);
        }
        context.layers.add(node);
        dispatchUpdate();
        return () => {
          if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
            ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
          }
        };
      }, [node, ownerDocument, disableOutsidePointerEvents, context]);
      React13.useEffect(() => {
        return () => {
          if (!node) return;
          context.layers.delete(node);
          context.layersWithOutsidePointerEventsDisabled.delete(node);
          dispatchUpdate();
        };
      }, [node, context]);
      React13.useEffect(() => {
        const handleUpdate = () => force({});
        document.addEventListener(CONTEXT_UPDATE, handleUpdate);
        return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
      }, []);
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Primitive.div,
        {
          ...layerProps,
          ref: composedRefs,
          style: {
            pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
            ...props.style
          },
          onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
          onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
          onPointerDownCapture: composeEventHandlers(
            props.onPointerDownCapture,
            pointerDownOutside.onPointerDownCapture
          )
        }
      );
    }
  );
  DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
  var BRANCH_NAME = "DismissableLayerBranch";
  var DismissableLayerBranch = React13.forwardRef((props, forwardedRef) => {
    const context = React13.useContext(DismissableLayerContext);
    const ref = React13.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    React13.useEffect(() => {
      const node = ref.current;
      if (node) {
        context.branches.add(node);
        return () => {
          context.branches.delete(node);
        };
      }
    }, [context.branches]);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Primitive.div, { ...props, ref: composedRefs });
  });
  DismissableLayerBranch.displayName = BRANCH_NAME;
  function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
    const handlePointerDownOutside = useCallbackRef(onPointerDownOutside);
    const isPointerInsideReactTreeRef = React13.useRef(false);
    const handleClickRef = React13.useRef(() => {
    });
    React13.useEffect(() => {
      const handlePointerDown = (event) => {
        if (event.target && !isPointerInsideReactTreeRef.current) {
          let handleAndDispatchPointerDownOutsideEvent2 = function() {
            handleAndDispatchCustomEvent(
              POINTER_DOWN_OUTSIDE,
              handlePointerDownOutside,
              eventDetail,
              { discrete: true }
            );
          };
          var handleAndDispatchPointerDownOutsideEvent = handleAndDispatchPointerDownOutsideEvent2;
          const eventDetail = { originalEvent: event };
          if (event.pointerType === "touch") {
            ownerDocument.removeEventListener("click", handleClickRef.current);
            handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
            ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
          } else {
            handleAndDispatchPointerDownOutsideEvent2();
          }
        } else {
          ownerDocument.removeEventListener("click", handleClickRef.current);
        }
        isPointerInsideReactTreeRef.current = false;
      };
      const timerId = window.setTimeout(() => {
        ownerDocument.addEventListener("pointerdown", handlePointerDown);
      }, 0);
      return () => {
        window.clearTimeout(timerId);
        ownerDocument.removeEventListener("pointerdown", handlePointerDown);
        ownerDocument.removeEventListener("click", handleClickRef.current);
      };
    }, [ownerDocument, handlePointerDownOutside]);
    return {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
    };
  }
  function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
    const handleFocusOutside = useCallbackRef(onFocusOutside);
    const isFocusInsideReactTreeRef = React13.useRef(false);
    React13.useEffect(() => {
      const handleFocus = (event) => {
        if (event.target && !isFocusInsideReactTreeRef.current) {
          const eventDetail = { originalEvent: event };
          handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
            discrete: false
          });
        }
      };
      ownerDocument.addEventListener("focusin", handleFocus);
      return () => ownerDocument.removeEventListener("focusin", handleFocus);
    }, [ownerDocument, handleFocusOutside]);
    return {
      onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
      onBlurCapture: () => isFocusInsideReactTreeRef.current = false
    };
  }
  function dispatchUpdate() {
    const event = new CustomEvent(CONTEXT_UPDATE);
    document.dispatchEvent(event);
  }
  function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
    if (handler) target.addEventListener(name, handler, { once: true });
    if (discrete) {
      dispatchDiscreteCustomEvent(target, event);
    } else {
      target.dispatchEvent(event);
    }
  }

  // node_modules/@radix-ui/react-focus-scope/dist/index.mjs
  var React14 = __toESM(require_react(), 1);
  var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
  var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  var EVENT_OPTIONS = { bubbles: false, cancelable: true };
  var FOCUS_SCOPE_NAME = "FocusScope";
  var FocusScope = React14.forwardRef((props, forwardedRef) => {
    const {
      loop = false,
      trapped = false,
      onMountAutoFocus: onMountAutoFocusProp,
      onUnmountAutoFocus: onUnmountAutoFocusProp,
      ...scopeProps
    } = props;
    const [container, setContainer] = React14.useState(null);
    const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
    const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
    const lastFocusedElementRef = React14.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
    const focusScope = React14.useRef({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    React14.useEffect(() => {
      if (trapped) {
        let handleFocusIn2 = function(event) {
          if (focusScope.paused || !container) return;
          const target = event.target;
          if (container.contains(target)) {
            lastFocusedElementRef.current = target;
          } else {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleFocusOut2 = function(event) {
          if (focusScope.paused || !container) return;
          const relatedTarget = event.relatedTarget;
          if (relatedTarget === null) return;
          if (!container.contains(relatedTarget)) {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleMutations2 = function(mutations) {
          const focusedElement = document.activeElement;
          if (focusedElement !== document.body) return;
          for (const mutation of mutations) {
            if (mutation.removedNodes.length > 0) focus(container);
          }
        };
        var handleFocusIn = handleFocusIn2, handleFocusOut = handleFocusOut2, handleMutations = handleMutations2;
        document.addEventListener("focusin", handleFocusIn2);
        document.addEventListener("focusout", handleFocusOut2);
        const mutationObserver = new MutationObserver(handleMutations2);
        if (container) mutationObserver.observe(container, { childList: true, subtree: true });
        return () => {
          document.removeEventListener("focusin", handleFocusIn2);
          document.removeEventListener("focusout", handleFocusOut2);
          mutationObserver.disconnect();
        };
      }
    }, [trapped, container, focusScope.paused]);
    React14.useEffect(() => {
      if (container) {
        focusScopesStack.add(focusScope);
        const previouslyFocusedElement = document.activeElement;
        const hasFocusedCandidate = container.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
          const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          container.dispatchEvent(mountEvent);
          if (!mountEvent.defaultPrevented) {
            focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
            if (document.activeElement === previouslyFocusedElement) {
              focus(container);
            }
          }
        }
        return () => {
          container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          setTimeout(() => {
            const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
            container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            container.dispatchEvent(unmountEvent);
            if (!unmountEvent.defaultPrevented) {
              focus(previouslyFocusedElement ?? document.body, { select: true });
            }
            container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            focusScopesStack.remove(focusScope);
          }, 0);
        };
      }
    }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
    const handleKeyDown = React14.useCallback(
      (event) => {
        if (!loop && !trapped) return;
        if (focusScope.paused) return;
        const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
        const focusedElement = document.activeElement;
        if (isTabKey && focusedElement) {
          const container2 = event.currentTarget;
          const [first, last] = getTabbableEdges(container2);
          const hasTabbableElementsInside = first && last;
          if (!hasTabbableElementsInside) {
            if (focusedElement === container2) event.preventDefault();
          } else {
            if (!event.shiftKey && focusedElement === last) {
              event.preventDefault();
              if (loop) focus(first, { select: true });
            } else if (event.shiftKey && focusedElement === first) {
              event.preventDefault();
              if (loop) focus(last, { select: true });
            }
          }
        }
      },
      [loop, trapped, focusScope.paused]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
  });
  FocusScope.displayName = FOCUS_SCOPE_NAME;
  function focusFirst(candidates, { select = false } = {}) {
    const previouslyFocusedElement = document.activeElement;
    for (const candidate of candidates) {
      focus(candidate, { select });
      if (document.activeElement !== previouslyFocusedElement) return;
    }
  }
  function getTabbableEdges(container) {
    const candidates = getTabbableCandidates(container);
    const first = findVisible(candidates, container);
    const last = findVisible(candidates.reverse(), container);
    return [first, last];
  }
  function getTabbableCandidates(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }
  function findVisible(elements, container) {
    for (const element of elements) {
      if (!isHidden(element, { upTo: container })) return element;
    }
  }
  function isHidden(node, { upTo }) {
    if (getComputedStyle(node).visibility === "hidden") return true;
    while (node) {
      if (upTo !== void 0 && node === upTo) return false;
      if (getComputedStyle(node).display === "none") return true;
      node = node.parentElement;
    }
    return false;
  }
  function isSelectableInput(element) {
    return element instanceof HTMLInputElement && "select" in element;
  }
  function focus(element, { select = false } = {}) {
    if (element && element.focus) {
      const previouslyFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
        element.select();
    }
  }
  var focusScopesStack = createFocusScopesStack();
  function createFocusScopesStack() {
    let stack = [];
    return {
      add(focusScope) {
        const activeFocusScope = stack[0];
        if (focusScope !== activeFocusScope) {
          activeFocusScope?.pause();
        }
        stack = arrayRemove(stack, focusScope);
        stack.unshift(focusScope);
      },
      remove(focusScope) {
        stack = arrayRemove(stack, focusScope);
        stack[0]?.resume();
      }
    };
  }
  function arrayRemove(array, item) {
    const updatedArray = [...array];
    const index2 = updatedArray.indexOf(item);
    if (index2 !== -1) {
      updatedArray.splice(index2, 1);
    }
    return updatedArray;
  }
  function removeLinks(items) {
    return items.filter((item) => item.tagName !== "A");
  }

  // node_modules/@radix-ui/react-portal/dist/index.mjs
  var React15 = __toESM(require_react(), 1);
  var import_react_dom = __toESM(require_react_dom(), 1);
  var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
  var PORTAL_NAME = "Portal";
  var Portal = React15.forwardRef((props, forwardedRef) => {
    const { container: containerProp, ...portalProps } = props;
    const [mounted, setMounted] = React15.useState(false);
    useLayoutEffect2(() => setMounted(true), []);
    const container = containerProp || mounted && globalThis?.document?.body;
    return container ? import_react_dom.default.createPortal(/* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
  });
  Portal.displayName = PORTAL_NAME;

  // node_modules/@radix-ui/react-focus-guards/dist/index.mjs
  var React16 = __toESM(require_react(), 1);
  var count2 = 0;
  function useFocusGuards() {
    React16.useEffect(() => {
      const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
      document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
      document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
      count2++;
      return () => {
        if (count2 === 1) {
          document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
        }
        count2--;
      };
    }, []);
  }
  function createFocusGuard() {
    const element = document.createElement("span");
    element.setAttribute("data-radix-focus-guard", "");
    element.tabIndex = 0;
    element.style.outline = "none";
    element.style.opacity = "0";
    element.style.position = "fixed";
    element.style.pointerEvents = "none";
    return element;
  }

  // node_modules/tslib/tslib.es6.mjs
  var __assign = function() {
    __assign = Object.assign || function __assign2(t15) {
      for (var s11, i6 = 1, n12 = arguments.length; i6 < n12; i6++) {
        s11 = arguments[i6];
        for (var p14 in s11) if (Object.prototype.hasOwnProperty.call(s11, p14)) t15[p14] = s11[p14];
      }
      return t15;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s11, e24) {
    var t15 = {};
    for (var p14 in s11) if (Object.prototype.hasOwnProperty.call(s11, p14) && e24.indexOf(p14) < 0)
      t15[p14] = s11[p14];
    if (s11 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i6 = 0, p14 = Object.getOwnPropertySymbols(s11); i6 < p14.length; i6++) {
        if (e24.indexOf(p14[i6]) < 0 && Object.prototype.propertyIsEnumerable.call(s11, p14[i6]))
          t15[p14[i6]] = s11[p14[i6]];
      }
    return t15;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i6 = 0, l7 = from.length, ar; i6 < l7; i6++) {
      if (ar || !(i6 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i6);
        ar[i6] = from[i6];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  // node_modules/react-remove-scroll/dist/es2015/Combination.js
  var React25 = __toESM(require_react());

  // node_modules/react-remove-scroll/dist/es2015/UI.js
  var React19 = __toESM(require_react());

  // node_modules/react-remove-scroll-bar/dist/es2015/constants.js
  var zeroRightClassName = "right-scroll-bar-position";
  var fullWidthClassName = "width-before-scroll-bar";
  var noScrollbarsClassName = "with-scroll-bars-hidden";
  var removedBarSizeVariable = "--removed-body-scroll-bar-size";

  // node_modules/use-callback-ref/dist/es2015/assignRef.js
  function assignRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
    return ref;
  }

  // node_modules/use-callback-ref/dist/es2015/useRef.js
  var import_react = __toESM(require_react());
  function useCallbackRef2(initialValue, callback) {
    var ref = (0, import_react.useState)(function() {
      return {
        // value
        value: initialValue,
        // last callback
        callback,
        // "memoized" public interface
        facade: {
          get current() {
            return ref.value;
          },
          set current(value) {
            var last = ref.value;
            if (last !== value) {
              ref.value = value;
              ref.callback(value, last);
            }
          }
        }
      };
    })[0];
    ref.callback = callback;
    return ref.facade;
  }

  // node_modules/use-callback-ref/dist/es2015/useMergeRef.js
  var React17 = __toESM(require_react());
  var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React17.useLayoutEffect : React17.useEffect;
  var currentValues = /* @__PURE__ */ new WeakMap();
  function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef2(defaultValue || null, function(newValue) {
      return refs.forEach(function(ref) {
        return assignRef(ref, newValue);
      });
    });
    useIsomorphicLayoutEffect(function() {
      var oldValue = currentValues.get(callbackRef);
      if (oldValue) {
        var prevRefs_1 = new Set(oldValue);
        var nextRefs_1 = new Set(refs);
        var current_1 = callbackRef.current;
        prevRefs_1.forEach(function(ref) {
          if (!nextRefs_1.has(ref)) {
            assignRef(ref, null);
          }
        });
        nextRefs_1.forEach(function(ref) {
          if (!prevRefs_1.has(ref)) {
            assignRef(ref, current_1);
          }
        });
      }
      currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
  }

  // node_modules/use-sidecar/dist/es2015/medium.js
  function ItoI(a16) {
    return a16;
  }
  function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
      middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
      read: function() {
        if (assigned) {
          throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        }
        if (buffer.length) {
          return buffer[buffer.length - 1];
        }
        return defaults;
      },
      useMedium: function(data) {
        var item = middleware(data, assigned);
        buffer.push(item);
        return function() {
          buffer = buffer.filter(function(x2) {
            return x2 !== item;
          });
        };
      },
      assignSyncMedium: function(cb) {
        assigned = true;
        while (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
        }
        buffer = {
          push: function(x2) {
            return cb(x2);
          },
          filter: function() {
            return buffer;
          }
        };
      },
      assignMedium: function(cb) {
        assigned = true;
        var pendingQueue = [];
        if (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
          pendingQueue = buffer;
        }
        var executeQueue = function() {
          var cbs2 = pendingQueue;
          pendingQueue = [];
          cbs2.forEach(cb);
        };
        var cycle = function() {
          return Promise.resolve().then(executeQueue);
        };
        cycle();
        buffer = {
          push: function(x2) {
            pendingQueue.push(x2);
            cycle();
          },
          filter: function(filter) {
            pendingQueue = pendingQueue.filter(filter);
            return buffer;
          }
        };
      }
    };
    return medium;
  }
  function createSidecarMedium(options) {
    if (options === void 0) {
      options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
  }

  // node_modules/use-sidecar/dist/es2015/exports.js
  var React18 = __toESM(require_react());
  var SideCar = function(_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
      throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    }
    var Target = sideCar.read();
    if (!Target) {
      throw new Error("Sidecar medium not found");
    }
    return React18.createElement(Target, __assign({}, rest));
  };
  SideCar.isSideCarExport = true;
  function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar;
  }

  // node_modules/react-remove-scroll/dist/es2015/medium.js
  var effectCar = createSidecarMedium();

  // node_modules/react-remove-scroll/dist/es2015/UI.js
  var nothing = function() {
    return;
  };
  var RemoveScroll = React19.forwardRef(function(props, parentRef) {
    var ref = React19.useRef(null);
    var _a = React19.useState({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return React19.createElement(
      React19.Fragment,
      null,
      enabled && React19.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noRelative, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
      forwardProps ? React19.cloneElement(React19.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React19.createElement(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
    );
  });
  RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
  };

  // node_modules/react-remove-scroll/dist/es2015/SideEffect.js
  var React24 = __toESM(require_react());

  // node_modules/react-remove-scroll-bar/dist/es2015/component.js
  var React21 = __toESM(require_react());

  // node_modules/react-style-singleton/dist/es2015/hook.js
  var React20 = __toESM(require_react());

  // node_modules/get-nonce/dist/es2015/index.js
  var currentNonce;
  var getNonce = function() {
    if (currentNonce) {
      return currentNonce;
    }
    if (typeof __webpack_nonce__ !== "undefined") {
      return __webpack_nonce__;
    }
    return void 0;
  };

  // node_modules/react-style-singleton/dist/es2015/singleton.js
  function makeStyleTag() {
    if (!document)
      return null;
    var tag = document.createElement("style");
    tag.type = "text/css";
    var nonce = getNonce();
    if (nonce) {
      tag.setAttribute("nonce", nonce);
    }
    return tag;
  }
  function injectStyles(tag, css2) {
    if (tag.styleSheet) {
      tag.styleSheet.cssText = css2;
    } else {
      tag.appendChild(document.createTextNode(css2));
    }
  }
  function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(tag);
  }
  var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
      add: function(style) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style);
            insertStyleTag(stylesheet);
          }
        }
        counter++;
      },
      remove: function() {
        counter--;
        if (!counter && stylesheet) {
          stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
          stylesheet = null;
        }
      }
    };
  };

  // node_modules/react-style-singleton/dist/es2015/hook.js
  var styleHookSingleton = function() {
    var sheet = stylesheetSingleton();
    return function(styles, isDynamic) {
      React20.useEffect(function() {
        sheet.add(styles);
        return function() {
          sheet.remove();
        };
      }, [styles && isDynamic]);
    };
  };

  // node_modules/react-style-singleton/dist/es2015/component.js
  var styleSingleton = function() {
    var useStyle = styleHookSingleton();
    var Sheet = function(_a) {
      var styles = _a.styles, dynamic = _a.dynamic;
      useStyle(styles, dynamic);
      return null;
    };
    return Sheet;
  };

  // node_modules/react-remove-scroll-bar/dist/es2015/utils.js
  var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  };
  var parse = function(x2) {
    return parseInt(x2 || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse(left), parse(top), parse(right)];
  };
  var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    if (typeof window === "undefined") {
      return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
      left: offsets[0],
      top: offsets[1],
      right: offsets[2],
      gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
  };

  // node_modules/react-remove-scroll-bar/dist/es2015/component.js
  var Style = styleSingleton();
  var lockAttribute = "data-scroll-locked";
  var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
      allowRelative && "position: relative ".concat(important, ";"),
      gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
      gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
    return isFinite(counter) ? counter : 0;
  };
  var useLockAttribute = function() {
    React21.useEffect(function() {
      document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
      return function() {
        var newCounter = getCurrentUseCounter() - 1;
        if (newCounter <= 0) {
          document.body.removeAttribute(lockAttribute);
        } else {
          document.body.setAttribute(lockAttribute, newCounter.toString());
        }
      };
    }, []);
  };
  var RemoveScrollBar = function(_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
    useLockAttribute();
    var gap = React21.useMemo(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return React21.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
  };

  // node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
  var passiveSupported = false;
  if (typeof window !== "undefined") {
    try {
      options = Object.defineProperty({}, "passive", {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (err) {
      passiveSupported = false;
    }
  }
  var options;
  var nonPassive = passiveSupported ? { passive: false } : false;

  // node_modules/react-remove-scroll/dist/es2015/handleScroll.js
  var alwaysContainsScroll = function(node) {
    return node.tagName === "TEXTAREA";
  };
  var elementCanBeScrolled = function(node, overflow) {
    if (!(node instanceof Element)) {
      return false;
    }
    var styles = window.getComputedStyle(node);
    return (
      // not-not-scrollable
      styles[overflow] !== "hidden" && // contains scroll inside self
      !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
    );
  };
  var elementCouldBeVScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowY");
  };
  var elementCouldBeHScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowX");
  };
  var locationCouldBeScrolled = function(axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
      if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
        if (scrollHeight > clientHeight) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
  };
  var getVScrollVariables = function(_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
      scrollTop,
      scrollHeight,
      clientHeight
    ];
  };
  var getHScrollVariables = function(_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
      scrollLeft,
      scrollWidth,
      clientWidth
    ];
  };
  var elementCouldBeScrolled = function(axis, node) {
    return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
  };
  var getScrollVariables = function(axis, node) {
    return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
  };
  var getDirectionFactor = function(axis, direction) {
    return axis === "h" && direction === "rtl" ? -1 : 1;
  };
  var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
      if (!target) {
        break;
      }
      var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position;
      if (position || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position;
        }
      }
      var parent_1 = target.parentNode;
      target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
    } while (
      // portaled content
      !targetInLock && target !== document.body || // self content
      targetInLock && (endTarget.contains(target) || endTarget === target)
    );
    if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) {
      shouldCancelScroll = true;
    }
    return shouldCancelScroll;
  };

  // node_modules/react-remove-scroll/dist/es2015/SideEffect.js
  var getTouchXY = function(event) {
    return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
  };
  var getDeltaXY = function(event) {
    return [event.deltaX, event.deltaY];
  };
  var extractRef = function(ref) {
    return ref && "current" in ref ? ref.current : ref;
  };
  var deltaCompare = function(x2, y) {
    return x2[0] === y[0] && x2[1] === y[1];
  };
  var generateStyle = function(id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
  };
  var idCounter = 0;
  var lockStack = [];
  function RemoveScrollSideCar(props) {
    var shouldPreventQueue = React24.useRef([]);
    var touchStartRef = React24.useRef([0, 0]);
    var activeAxis = React24.useRef();
    var id = React24.useState(idCounter++)[0];
    var Style2 = React24.useState(styleSingleton)[0];
    var lastProps = React24.useRef(props);
    React24.useEffect(function() {
      lastProps.current = props;
    }, [props]);
    React24.useEffect(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
        allow_1.forEach(function(el) {
          return el.classList.add("allow-interactivity-".concat(id));
        });
        return function() {
          document.body.classList.remove("block-interactivity-".concat(id));
          allow_1.forEach(function(el) {
            return el.classList.remove("allow-interactivity-".concat(id));
          });
        };
      }
      return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = React24.useCallback(function(event, parent) {
      if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
        return !lastProps.current.allowPinchZoom;
      }
      var touch = getTouchXY(event);
      var touchStart = touchStartRef.current;
      var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
      var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
      var currentAxis;
      var target = event.target;
      var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
      if ("touches" in event && moveDirection === "h" && target.type === "range") {
        return false;
      }
      var selection = window.getSelection();
      var anchorNode = selection && selection.anchorNode;
      var isTouchingSelection = anchorNode ? anchorNode === target || anchorNode.contains(target) : false;
      if (isTouchingSelection) {
        return false;
      }
      var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      if (!canBeScrolledInMainDirection) {
        return true;
      }
      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === "v" ? "h" : "v";
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      }
      if (!canBeScrolledInMainDirection) {
        return false;
      }
      if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }
      if (!currentAxis) {
        return true;
      }
      var cancelingAxis = activeAxis.current || currentAxis;
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = React24.useCallback(function(_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
        return;
      }
      var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function(e24) {
        return e24.name === event.type && (e24.target === event.target || event.target === e24.shadowParent) && deltaCompare(e24.delta, delta);
      })[0];
      if (sourceEvent && sourceEvent.should) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      if (!sourceEvent) {
        var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
          return node.contains(event.target);
        });
        var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
        if (shouldStop) {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      }
    }, []);
    var shouldCancel = React24.useCallback(function(name, delta, target, should) {
      var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e24) {
          return e24 !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = React24.useCallback(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = React24.useCallback(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = React24.useCallback(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    React24.useEffect(function() {
      lockStack.push(Style2);
      props.setCallbacks({
        onScrollCapture: scrollWheel,
        onWheelCapture: scrollWheel,
        onTouchMoveCapture: scrollTouchMove
      });
      document.addEventListener("wheel", shouldPrevent, nonPassive);
      document.addEventListener("touchmove", shouldPrevent, nonPassive);
      document.addEventListener("touchstart", scrollTouchStart, nonPassive);
      return function() {
        lockStack = lockStack.filter(function(inst) {
          return inst !== Style2;
        });
        document.removeEventListener("wheel", shouldPrevent, nonPassive);
        document.removeEventListener("touchmove", shouldPrevent, nonPassive);
        document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
      };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return React24.createElement(
      React24.Fragment,
      null,
      inert ? React24.createElement(Style2, { styles: generateStyle(id) }) : null,
      removeScrollBar ? React24.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null
    );
  }
  function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
      if (node instanceof ShadowRoot) {
        shadowParent = node.host;
        node = node.host;
      }
      node = node.parentNode;
    }
    return shadowParent;
  }

  // node_modules/react-remove-scroll/dist/es2015/sidecar.js
  var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);

  // node_modules/react-remove-scroll/dist/es2015/Combination.js
  var ReactRemoveScroll = React25.forwardRef(function(props, ref) {
    return React25.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: sidecar_default }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
  var Combination_default = ReactRemoveScroll;

  // node_modules/aria-hidden/dist/es2015/index.js
  var getDefaultParent = function(originalTarget) {
    if (typeof document === "undefined") {
      return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
  };
  var counterMap = /* @__PURE__ */ new WeakMap();
  var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
  var markerMap = {};
  var lockCount = 0;
  var unwrapHost = function(node) {
    return node && (node.host || unwrapHost(node.parentNode));
  };
  var correctTargets = function(parent, targets) {
    return targets.map(function(target) {
      if (parent.contains(target)) {
        return target;
      }
      var correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
      return null;
    }).filter(function(x2) {
      return Boolean(x2);
    });
  };
  var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
      markerMap[markerName] = /* @__PURE__ */ new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = /* @__PURE__ */ new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
      if (!el || elementsToKeep.has(el)) {
        return;
      }
      elementsToKeep.add(el);
      keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
      if (!parent || elementsToStop.has(parent)) {
        return;
      }
      Array.prototype.forEach.call(parent.children, function(node) {
        if (elementsToKeep.has(node)) {
          deep(node);
        } else {
          try {
            var attr = node.getAttribute(controlAttribute);
            var alreadyHidden = attr !== null && attr !== "false";
            var counterValue = (counterMap.get(node) || 0) + 1;
            var markerValue = (markerCounter.get(node) || 0) + 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            hiddenNodes.push(node);
            if (counterValue === 1 && alreadyHidden) {
              uncontrolledNodes.set(node, true);
            }
            if (markerValue === 1) {
              node.setAttribute(markerName, "true");
            }
            if (!alreadyHidden) {
              node.setAttribute(controlAttribute, "true");
            }
          } catch (e24) {
            console.error("aria-hidden: cannot operate on ", node, e24);
          }
        }
      });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function() {
      hiddenNodes.forEach(function(node) {
        var counterValue = counterMap.get(node) - 1;
        var markerValue = markerCounter.get(node) - 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        if (!counterValue) {
          if (!uncontrolledNodes.has(node)) {
            node.removeAttribute(controlAttribute);
          }
          uncontrolledNodes.delete(node);
        }
        if (!markerValue) {
          node.removeAttribute(markerName);
        }
      });
      lockCount--;
      if (!lockCount) {
        counterMap = /* @__PURE__ */ new WeakMap();
        counterMap = /* @__PURE__ */ new WeakMap();
        uncontrolledNodes = /* @__PURE__ */ new WeakMap();
        markerMap = {};
      }
    };
  };
  var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
      markerName = "data-aria-hidden";
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function() {
        return null;
      };
    }
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
    return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
  };

  // node_modules/@radix-ui/react-dialog/dist/index.mjs
  var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
  var DIALOG_NAME = "Dialog";
  var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
  var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
  var Dialog = (props) => {
    const {
      __scopeDialog,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = true
    } = props;
    const triggerRef = React26.useRef(null);
    const contentRef = React26.useRef(null);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: DIALOG_NAME
    });
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      DialogProvider,
      {
        scope: __scopeDialog,
        triggerRef,
        contentRef,
        contentId: useId(),
        titleId: useId(),
        descriptionId: useId(),
        open,
        onOpenChange: setOpen,
        onOpenToggle: React26.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        modal,
        children
      }
    );
  };
  Dialog.displayName = DIALOG_NAME;
  var TRIGGER_NAME = "DialogTrigger";
  var DialogTrigger = React26.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...triggerProps } = props;
      const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
      const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        Primitive.button,
        {
          type: "button",
          "aria-haspopup": "dialog",
          "aria-expanded": context.open,
          "aria-controls": context.contentId,
          "data-state": getState(context.open),
          ...triggerProps,
          ref: composedTriggerRef,
          onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
        }
      );
    }
  );
  DialogTrigger.displayName = TRIGGER_NAME;
  var PORTAL_NAME2 = "DialogPortal";
  var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME2, {
    forceMount: void 0
  });
  var DialogPortal = (props) => {
    const { __scopeDialog, forceMount, children, container } = props;
    const context = useDialogContext(PORTAL_NAME2, __scopeDialog);
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PortalProvider, { scope: __scopeDialog, forceMount, children: React26.Children.map(children, (child) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Portal, { asChild: true, container, children: child }) })) });
  };
  DialogPortal.displayName = PORTAL_NAME2;
  var OVERLAY_NAME = "DialogOverlay";
  var DialogOverlay = React26.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
      const { forceMount = portalContext.forceMount, ...overlayProps } = props;
      const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
      return context.modal ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
    }
  );
  DialogOverlay.displayName = OVERLAY_NAME;
  var Slot2 = createSlot("DialogOverlay.RemoveScroll");
  var DialogOverlayImpl = React26.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...overlayProps } = props;
      const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
      return (
        // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
        // ie. when `Overlay` and `Content` are siblings
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Combination_default, { as: Slot2, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          Primitive.div,
          {
            "data-state": getState(context.open),
            ...overlayProps,
            ref: forwardedRef,
            style: { pointerEvents: "auto", ...overlayProps.style }
          }
        ) })
      );
    }
  );
  var CONTENT_NAME = "DialogContent";
  var DialogContent = React26.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
      const { forceMount = portalContext.forceMount, ...contentProps } = props;
      const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
    }
  );
  DialogContent.displayName = CONTENT_NAME;
  var DialogContentModal = React26.forwardRef(
    (props, forwardedRef) => {
      const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
      const contentRef = React26.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
      React26.useEffect(() => {
        const content = contentRef.current;
        if (content) return hideOthers(content);
      }, []);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        DialogContentImpl,
        {
          ...props,
          ref: composedRefs,
          trapFocus: context.open,
          disableOutsidePointerEvents: true,
          onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
            event.preventDefault();
            context.triggerRef.current?.focus();
          }),
          onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            if (isRightClick) event.preventDefault();
          }),
          onFocusOutside: composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault()
          )
        }
      );
    }
  );
  var DialogContentNonModal = React26.forwardRef(
    (props, forwardedRef) => {
      const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
      const hasInteractedOutsideRef = React26.useRef(false);
      const hasPointerDownOutsideRef = React26.useRef(false);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        DialogContentImpl,
        {
          ...props,
          ref: forwardedRef,
          trapFocus: false,
          disableOutsidePointerEvents: false,
          onCloseAutoFocus: (event) => {
            props.onCloseAutoFocus?.(event);
            if (!event.defaultPrevented) {
              if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
              event.preventDefault();
            }
            hasInteractedOutsideRef.current = false;
            hasPointerDownOutsideRef.current = false;
          },
          onInteractOutside: (event) => {
            props.onInteractOutside?.(event);
            if (!event.defaultPrevented) {
              hasInteractedOutsideRef.current = true;
              if (event.detail.originalEvent.type === "pointerdown") {
                hasPointerDownOutsideRef.current = true;
              }
            }
            const target = event.target;
            const targetIsTrigger = context.triggerRef.current?.contains(target);
            if (targetIsTrigger) event.preventDefault();
            if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
              event.preventDefault();
            }
          }
        }
      );
    }
  );
  var DialogContentImpl = React26.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
      const context = useDialogContext(CONTENT_NAME, __scopeDialog);
      const contentRef = React26.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, contentRef);
      useFocusGuards();
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          FocusScope,
          {
            asChild: true,
            loop: true,
            trapped: trapFocus,
            onMountAutoFocus: onOpenAutoFocus,
            onUnmountAutoFocus: onCloseAutoFocus,
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              DismissableLayer,
              {
                role: "dialog",
                id: context.contentId,
                "aria-describedby": context.descriptionId,
                "aria-labelledby": context.titleId,
                "data-state": getState(context.open),
                ...contentProps,
                ref: composedRefs,
                onDismiss: () => context.onOpenChange(false)
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TitleWarning, { titleId: context.titleId }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
        ] })
      ] });
    }
  );
  var TITLE_NAME = "DialogTitle";
  var DialogTitle = React26.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...titleProps } = props;
      const context = useDialogContext(TITLE_NAME, __scopeDialog);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
    }
  );
  DialogTitle.displayName = TITLE_NAME;
  var DESCRIPTION_NAME = "DialogDescription";
  var DialogDescription = React26.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...descriptionProps } = props;
      const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
    }
  );
  DialogDescription.displayName = DESCRIPTION_NAME;
  var CLOSE_NAME = "DialogClose";
  var DialogClose = React26.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...closeProps } = props;
      const context = useDialogContext(CLOSE_NAME, __scopeDialog);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        Primitive.button,
        {
          type: "button",
          ...closeProps,
          ref: forwardedRef,
          onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
        }
      );
    }
  );
  DialogClose.displayName = CLOSE_NAME;
  function getState(open) {
    return open ? "open" : "closed";
  }
  var TITLE_WARNING_NAME = "DialogTitleWarning";
  var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
    contentName: CONTENT_NAME,
    titleName: TITLE_NAME,
    docsSlug: "dialog"
  });
  var TitleWarning = ({ titleId }) => {
    const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
    const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
    React26.useEffect(() => {
      if (titleId) {
        const hasTitle = document.getElementById(titleId);
        if (!hasTitle) console.error(MESSAGE);
      }
    }, [MESSAGE, titleId]);
    return null;
  };
  var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
  var DescriptionWarning = ({ contentRef, descriptionId }) => {
    const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
    const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
    React26.useEffect(() => {
      const describedById = contentRef.current?.getAttribute("aria-describedby");
      if (descriptionId && describedById) {
        const hasDescription = document.getElementById(descriptionId);
        if (!hasDescription) console.warn(MESSAGE);
      }
    }, [MESSAGE, contentRef, descriptionId]);
    return null;
  };
  var Root2 = Dialog;
  var Trigger = DialogTrigger;
  var Portal2 = DialogPortal;
  var Overlay = DialogOverlay;
  var Content = DialogContent;
  var Title = DialogTitle;
  var Description = DialogDescription;
  var Close = DialogClose;

  // node_modules/@radix-ui/react-use-size/dist/index.mjs
  var React27 = __toESM(require_react(), 1);
  function useSize(element) {
    const [size4, setSize] = React27.useState(void 0);
    useLayoutEffect2(() => {
      if (element) {
        setSize({ width: element.offsetWidth, height: element.offsetHeight });
        const resizeObserver = new ResizeObserver((entries) => {
          if (!Array.isArray(entries)) {
            return;
          }
          if (!entries.length) {
            return;
          }
          const entry = entries[0];
          let width;
          let height;
          if ("borderBoxSize" in entry) {
            const borderSizeEntry = entry["borderBoxSize"];
            const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
            width = borderSize["inlineSize"];
            height = borderSize["blockSize"];
          } else {
            width = element.offsetWidth;
            height = element.offsetHeight;
          }
          setSize({ width, height });
        });
        resizeObserver.observe(element, { box: "border-box" });
        return () => resizeObserver.unobserve(element);
      } else {
        setSize(void 0);
      }
    }, [element]);
    return size4;
  }

  // node_modules/@radix-ui/react-popper/dist/index.mjs
  var React30 = __toESM(require_react(), 1);

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
  var sides = ["top", "right", "bottom", "left"];
  var min = Math.min;
  var max = Math.max;
  var round = Math.round;
  var floor = Math.floor;
  var createCoords = (v3) => ({
    x: v3,
    y: v3
  });
  var oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    const firstChar = placement[0];
    return firstChar === "t" || firstChar === "b" ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
  }
  var lrPlacement = ["left", "right"];
  var rlPlacement = ["right", "left"];
  var tbPlacement = ["top", "bottom"];
  var btPlacement = ["bottom", "top"];
  function getSideList(side, isStart, rtl) {
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rlPlacement : lrPlacement;
        return isStart ? lrPlacement : rlPlacement;
      case "left":
      case "right":
        return isStart ? tbPlacement : btPlacement;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    const side = getSide(placement);
    return oppositeSideMap[side] + placement.slice(side.length);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x: x2,
      y,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y,
      left: x2,
      right: x2 + width,
      bottom: y + height,
      x: x2,
      y
    };
  }

  // node_modules/@floating-ui/core/dist/floating-ui.core.mjs
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x: x2,
      y,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x: x2,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  var MAX_RESET_COUNT = 50;
  var computePosition = async (reference, floating, config) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config;
    const platformWithDetectOverflow = platform2.detectOverflow ? platform2 : {
      ...platform2,
      detectOverflow
    };
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x: x2,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let resetCount = 0;
    const middlewareData = {};
    for (let i6 = 0; i6 < middleware.length; i6++) {
      const currentMiddleware = middleware[i6];
      if (!currentMiddleware) {
        continue;
      }
      const {
        name,
        fn
      } = currentMiddleware;
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x: x2,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platformWithDetectOverflow,
        elements: {
          reference,
          floating
        }
      });
      x2 = nextX != null ? nextX : x2;
      y = nextY != null ? nextY : y;
      middlewareData[name] = {
        ...middlewareData[name],
        ...data
      };
      if (reset && resetCount < MAX_RESET_COUNT) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x: x2,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i6 = -1;
      }
    }
    return {
      x: x2,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  var arrow = (options) => ({
    name: "arrow",
    options,
    async fn(state) {
      const {
        x: x2,
        y,
        placement,
        rects,
        platform: platform2,
        elements,
        middlewareData
      } = state;
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x: x2,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform2.getDimensions(element);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max2 = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset4 = clamp(min$1, center, max2);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset4 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset4,
          centerOffset: center - offset4 - alignmentOffset,
          ...shouldAddOffset && {
            alignmentOffset
          }
        },
        reset: shouldAddOffset
      };
    }
  });
  var flip = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements2 = [initialPlacement, ...fallbackPlacements];
        const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements2[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
            // overflows the main axis.
            overflowsData.every((d8) => getSideAxis(d8.placement) === initialSideAxis ? d8.overflows[0] > 0 : true)) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d8) => d8.overflows[0] <= 0).sort((a16, b2) => a16.overflows[1] - b2.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d8) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d8.placement);
                    return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === "y";
                  }
                  return true;
                }).map((d8) => [d8.placement, d8.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a16, b2) => a16[1] - b2[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getSideOffsets(overflow, rect) {
    return {
      top: overflow.top - rect.height,
      right: overflow.right - rect.width,
      bottom: overflow.bottom - rect.height,
      left: overflow.left - rect.width
    };
  }
  function isAnySideFullyClipped(overflow) {
    return sides.some((side) => overflow[side] >= 0);
  }
  var hide = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "hide",
      options,
      async fn(state) {
        const {
          rects,
          platform: platform2
        } = state;
        const {
          strategy = "referenceHidden",
          ...detectOverflowOptions
        } = evaluate(options, state);
        switch (strategy) {
          case "referenceHidden": {
            const overflow = await platform2.detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: "reference"
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
          case "escaped": {
            const overflow = await platform2.detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
          default: {
            return {};
          }
        }
      }
    };
  };
  var originSides = /* @__PURE__ */ new Set(["left", "top"]);
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  var offset = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x: x2,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x2 + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  var shift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options,
      async fn(state) {
        const {
          x: x2,
          y,
          placement,
          platform: platform2
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x3,
                y: y2
              } = _ref;
              return {
                x: x3,
                y: y2
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x: x2,
          y
        };
        const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x2,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };
  var limitShift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      options,
      fn(state) {
        const {
          x: x2,
          y,
          placement,
          rects,
          middlewareData
        } = state;
        const {
          offset: offset4 = 0,
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true
        } = evaluate(options, state);
        const coords = {
          x: x2,
          y
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset4, state);
        const computedOffset = typeof rawOffset === "number" ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === "y" ? "height" : "width";
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === "y" ? "width" : "height";
          const isOriginSide = originSides.has(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };
  var size = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "size",
      options,
      async fn(state) {
        var _state$middlewareData, _state$middlewareData2;
        const {
          placement,
          rects,
          platform: platform2,
          elements
        } = state;
        const {
          apply = () => {
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth,
          availableHeight
        });
        const nextDimensions = await platform2.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle2(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
  }
  function isTableElement(element) {
    return /^(table|td|th)$/.test(getNodeName(element));
  }
  function isTopLayer(element) {
    try {
      if (element.matches(":popover-open")) {
        return true;
      }
    } catch (_e) {
    }
    try {
      return element.matches(":modal");
    } catch (_e) {
      return false;
    }
  }
  var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
  var containRe = /paint|layout|strict|content/;
  var isNotNone = (value) => !!value && value !== "none";
  var isWebKitValue;
  function isContainingBlock(elementOrCss) {
    const css2 = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
    return isNotNone(css2.transform) || isNotNone(css2.translate) || isNotNone(css2.scale) || isNotNone(css2.rotate) || isNotNone(css2.perspective) || !isWebKit() && (isNotNone(css2.backdropFilter) || isNotNone(css2.filter)) || willChangeRe.test(css2.willChange || "") || containRe.test(css2.contain || "");
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (isWebKitValue == null) {
      isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
    }
    return isWebKitValue;
  }
  function isLastTraversableNode(node) {
    return /^(html|body|#document)$/.test(getNodeName(node));
  }
  function getComputedStyle2(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot || // DOM Element detected.
      node.parentNode || // ShadowRoot detected.
      isShadowRoot(node) && node.host || // Fallback.
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    } else {
      return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
    }
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }

  // node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
  function getCssDimensions(element) {
    const css2 = getComputedStyle2(element);
    let width = parseFloat(css2.width) || 0;
    let height = parseFloat(css2.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x2 = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;
    if (!x2 || !Number.isFinite(x2)) {
      x2 = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x: x2,
      y
    };
  }
  var noOffsets = /* @__PURE__ */ createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x2 = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css2 = getComputedStyle2(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css2.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css2.paddingTop)) * iframeScale.y;
        x2 *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x2 += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x: x2,
      y
    });
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x2 = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y = htmlRect.top + scroll.scrollTop;
    return {
      x: x2,
      y
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle2(body).direction === "rtl") {
      x2 += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x: x2,
      y
    };
  }
  var SCROLLBAR_MAX = 25;
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x2 = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x2 = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    if (windowScrollbarX <= 0) {
      const doc = html.ownerDocument;
      const body = doc.body;
      const bodyStyles = getComputedStyle(body);
      const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
      if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
        width -= clippingStableScrollbarWidth;
      }
    } else if (windowScrollbarX <= SCROLLBAR_MAX) {
      width += windowScrollbarX;
    }
    return {
      width,
      height,
      x: x2,
      y
    };
  }
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x2 = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x: x2,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle2(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle2(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
    let top = firstRect.top;
    let right = firstRect.right;
    let bottom = firstRect.bottom;
    let left = firstRect.left;
    for (let i6 = 1; i6 < clippingAncestors.length; i6++) {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i6], strategy);
      top = max(rect.top, top);
      right = min(rect.right, right);
      bottom = min(rect.bottom, bottom);
      left = max(rect.left, left);
    }
    return {
      width: right - left,
      height: bottom - top,
      x: left,
      y: top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x: x2,
      y,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle2(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  var getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle2(element).direction === "rtl";
  }
  var platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };
  function rectsAreEqual(a16, b2) {
    return a16.x === b2.x && a16.y === b2.y && a16.width === b2.width && a16.height === b2.height;
  }
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root2 = getDocumentElement(element);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const elementRectForRootMargin = element.getBoundingClientRect();
      const {
        left,
        top,
        width,
        height
      } = elementRectForRootMargin;
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root2.clientWidth - (left + width));
      const insetBottom = floor(root2.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
          refresh();
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root2.ownerDocument
        });
      } catch (_e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      if (floating) {
        resizeObserver.observe(floating);
      }
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update);
        ancestorResize && ancestor.removeEventListener("resize", update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  var offset2 = offset;
  var shift2 = shift;
  var flip2 = flip;
  var size2 = size;
  var hide2 = hide;
  var arrow2 = arrow;
  var limitShift2 = limitShift;
  var computePosition2 = (reference, floating, options) => {
    const cache = /* @__PURE__ */ new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

  // node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
  var React28 = __toESM(require_react(), 1);
  var import_react2 = __toESM(require_react(), 1);
  var ReactDOM3 = __toESM(require_react_dom(), 1);
  var isClient = typeof document !== "undefined";
  var noop = function noop2() {
  };
  var index = isClient ? import_react2.useLayoutEffect : noop;
  function deepEqual(a16, b2) {
    if (a16 === b2) {
      return true;
    }
    if (typeof a16 !== typeof b2) {
      return false;
    }
    if (typeof a16 === "function" && a16.toString() === b2.toString()) {
      return true;
    }
    let length;
    let i6;
    let keys;
    if (a16 && b2 && typeof a16 === "object") {
      if (Array.isArray(a16)) {
        length = a16.length;
        if (length !== b2.length) return false;
        for (i6 = length; i6-- !== 0; ) {
          if (!deepEqual(a16[i6], b2[i6])) {
            return false;
          }
        }
        return true;
      }
      keys = Object.keys(a16);
      length = keys.length;
      if (length !== Object.keys(b2).length) {
        return false;
      }
      for (i6 = length; i6-- !== 0; ) {
        if (!{}.hasOwnProperty.call(b2, keys[i6])) {
          return false;
        }
      }
      for (i6 = length; i6-- !== 0; ) {
        const key = keys[i6];
        if (key === "_owner" && a16.$$typeof) {
          continue;
        }
        if (!deepEqual(a16[key], b2[key])) {
          return false;
        }
      }
      return true;
    }
    return a16 !== a16 && b2 !== b2;
  }
  function getDPR(element) {
    if (typeof window === "undefined") {
      return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
  }
  function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
  }
  function useLatestRef(value) {
    const ref = React28.useRef(value);
    index(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2,
      elements: {
        reference: externalReference,
        floating: externalFloating
      } = {},
      transform = true,
      whileElementsMounted,
      open
    } = options;
    const [data, setData] = React28.useState({
      x: 0,
      y: 0,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = React28.useState(middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
      setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = React28.useState(null);
    const [_floating, _setFloating] = React28.useState(null);
    const setReference = React28.useCallback((node) => {
      if (node !== referenceRef.current) {
        referenceRef.current = node;
        _setReference(node);
      }
    }, []);
    const setFloating = React28.useCallback((node) => {
      if (node !== floatingRef.current) {
        floatingRef.current = node;
        _setFloating(node);
      }
    }, []);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = React28.useRef(null);
    const floatingRef = React28.useRef(null);
    const dataRef = React28.useRef(data);
    const hasWhileElementsMounted = whileElementsMounted != null;
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform2);
    const openRef = useLatestRef(open);
    const update = React28.useCallback(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config.platform = platformRef.current;
      }
      computePosition2(referenceRef.current, floatingRef.current, config).then((data2) => {
        const fullData = {
          ...data2,
          // The floating element's position may be recomputed while it's closed
          // but still mounted (such as when transitioning out). To ensure
          // `isPositioned` will be `false` initially on the next open, avoid
          // setting it to `true` when `open === false` (must be specified).
          isPositioned: openRef.current !== false
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          ReactDOM3.flushSync(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef, openRef]);
    index(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData((data2) => ({
          ...data2,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = React28.useRef(false);
    index(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index(() => {
      if (referenceEl) referenceRef.current = referenceEl;
      if (floatingEl) floatingRef.current = floatingEl;
      if (referenceEl && floatingEl) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(referenceEl, floatingEl, update);
        }
        update();
      }
    }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
    const refs = React28.useMemo(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = React28.useMemo(() => ({
      reference: referenceEl,
      floating: floatingEl
    }), [referenceEl, floatingEl]);
    const floatingStyles = React28.useMemo(() => {
      const initialStyles = {
        position: strategy,
        left: 0,
        top: 0
      };
      if (!elements.floating) {
        return initialStyles;
      }
      const x2 = roundByDPR(elements.floating, data.x);
      const y = roundByDPR(elements.floating, data.y);
      if (transform) {
        return {
          ...initialStyles,
          transform: "translate(" + x2 + "px, " + y + "px)",
          ...getDPR(elements.floating) >= 1.5 && {
            willChange: "transform"
          }
        };
      }
      return {
        position: strategy,
        left: x2,
        top: y
      };
    }, [strategy, transform, elements.floating, data.x, data.y]);
    return React28.useMemo(() => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }), [data, update, refs, elements, floatingStyles]);
  }
  var arrow$1 = (options) => {
    function isRef(value) {
      return {}.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options,
      fn(state) {
        const {
          element,
          padding
        } = typeof options === "function" ? options(state) : options;
        if (element && isRef(element)) {
          if (element.current != null) {
            return arrow2({
              element: element.current,
              padding
            }).fn(state);
          }
          return {};
        }
        if (element) {
          return arrow2({
            element,
            padding
          }).fn(state);
        }
        return {};
      }
    };
  };
  var offset3 = (options, deps) => {
    const result = offset2(options);
    return {
      name: result.name,
      fn: result.fn,
      options: [options, deps]
    };
  };
  var shift3 = (options, deps) => {
    const result = shift2(options);
    return {
      name: result.name,
      fn: result.fn,
      options: [options, deps]
    };
  };
  var limitShift3 = (options, deps) => {
    const result = limitShift2(options);
    return {
      fn: result.fn,
      options: [options, deps]
    };
  };
  var flip3 = (options, deps) => {
    const result = flip2(options);
    return {
      name: result.name,
      fn: result.fn,
      options: [options, deps]
    };
  };
  var size3 = (options, deps) => {
    const result = size2(options);
    return {
      name: result.name,
      fn: result.fn,
      options: [options, deps]
    };
  };
  var hide3 = (options, deps) => {
    const result = hide2(options);
    return {
      name: result.name,
      fn: result.fn,
      options: [options, deps]
    };
  };
  var arrow3 = (options, deps) => {
    const result = arrow$1(options);
    return {
      name: result.name,
      fn: result.fn,
      options: [options, deps]
    };
  };

  // node_modules/@radix-ui/react-arrow/dist/index.mjs
  var React29 = __toESM(require_react(), 1);
  var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
  var NAME2 = "Arrow";
  var Arrow = React29.forwardRef((props, forwardedRef) => {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      Primitive.svg,
      {
        ...arrowProps,
        ref: forwardedRef,
        width,
        height,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: props.asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  });
  Arrow.displayName = NAME2;
  var Root3 = Arrow;

  // node_modules/@radix-ui/react-popper/dist/index.mjs
  var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
  var POPPER_NAME = "Popper";
  var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
  var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
  var Popper = (props) => {
    const { __scopePopper, children } = props;
    const [anchor, setAnchor] = React30.useState(null);
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
  };
  Popper.displayName = POPPER_NAME;
  var ANCHOR_NAME = "PopperAnchor";
  var PopperAnchor = React30.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopper, virtualRef, ...anchorProps } = props;
      const context = usePopperContext(ANCHOR_NAME, __scopePopper);
      const ref = React30.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const anchorRef = React30.useRef(null);
      React30.useEffect(() => {
        const previousAnchor = anchorRef.current;
        anchorRef.current = virtualRef?.current || ref.current;
        if (previousAnchor !== anchorRef.current) {
          context.onAnchorChange(anchorRef.current);
        }
      });
      return virtualRef ? null : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Primitive.div, { ...anchorProps, ref: composedRefs });
    }
  );
  PopperAnchor.displayName = ANCHOR_NAME;
  var CONTENT_NAME2 = "PopperContent";
  var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME2);
  var PopperContent = React30.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopePopper,
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "partial",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        ...contentProps
      } = props;
      const context = usePopperContext(CONTENT_NAME2, __scopePopper);
      const [content, setContent] = React30.useState(null);
      const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
      const [arrow4, setArrow] = React30.useState(null);
      const arrowSize = useSize(arrow4);
      const arrowWidth = arrowSize?.width ?? 0;
      const arrowHeight = arrowSize?.height ?? 0;
      const desiredPlacement = side + (align !== "center" ? "-" + align : "");
      const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
      const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
      const hasExplicitBoundaries = boundary.length > 0;
      const detectOverflowOptions = {
        padding: collisionPadding,
        boundary: boundary.filter(isNotNull),
        // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
        altBoundary: hasExplicitBoundaries
      };
      const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
        // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
        strategy: "fixed",
        placement: desiredPlacement,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: updatePositionStrategy === "always"
          });
          return cleanup;
        },
        elements: {
          reference: context.anchor
        },
        middleware: [
          offset3({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
          avoidCollisions && shift3({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === "partial" ? limitShift3() : void 0,
            ...detectOverflowOptions
          }),
          avoidCollisions && flip3({ ...detectOverflowOptions }),
          size3({
            ...detectOverflowOptions,
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } = rects.reference;
              const contentStyle = elements.floating.style;
              contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
              contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
              contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
              contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
            }
          }),
          arrow4 && arrow3({ element: arrow4, padding: arrowPadding }),
          transformOrigin({ arrowWidth, arrowHeight }),
          hideWhenDetached && hide3({ strategy: "referenceHidden", ...detectOverflowOptions })
        ]
      });
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const handlePlaced = useCallbackRef(onPlaced);
      useLayoutEffect2(() => {
        if (isPositioned) {
          handlePlaced?.();
        }
      }, [isPositioned, handlePlaced]);
      const arrowX = middlewareData.arrow?.x;
      const arrowY = middlewareData.arrow?.y;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const [contentZIndex, setContentZIndex] = React30.useState();
      useLayoutEffect2(() => {
        if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
      }, [content]);
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "div",
        {
          ref: refs.setFloating,
          "data-radix-popper-content-wrapper": "",
          style: {
            ...floatingStyles,
            transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
            // keep off the page when measuring
            minWidth: "max-content",
            zIndex: contentZIndex,
            ["--radix-popper-transform-origin"]: [
              middlewareData.transformOrigin?.x,
              middlewareData.transformOrigin?.y
            ].join(" "),
            // hide the content if using the hide middleware and should be hidden
            // set visibility to hidden and disable pointer events so the UI behaves
            // as if the PopperContent isn't there at all
            ...middlewareData.hide?.referenceHidden && {
              visibility: "hidden",
              pointerEvents: "none"
            }
          },
          dir: props.dir,
          children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            PopperContentProvider,
            {
              scope: __scopePopper,
              placedSide,
              onArrowChange: setArrow,
              arrowX,
              arrowY,
              shouldHideArrow: cannotCenterArrow,
              children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                Primitive.div,
                {
                  "data-side": placedSide,
                  "data-align": placedAlign,
                  ...contentProps,
                  ref: composedRefs,
                  style: {
                    ...contentProps.style,
                    // if the PopperContent hasn't been placed yet (not all measurements done)
                    // we prevent animations so that users's animation don't kick in too early referring wrong sides
                    animation: !isPositioned ? "none" : void 0
                  }
                }
              )
            }
          )
        }
      );
    }
  );
  PopperContent.displayName = CONTENT_NAME2;
  var ARROW_NAME = "PopperArrow";
  var OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  var PopperArrow = React30.forwardRef(function PopperArrow2(props, forwardedRef) {
    const { __scopePopper, ...arrowProps } = props;
    const contentContext = useContentContext(ARROW_NAME, __scopePopper);
    const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "span",
        {
          ref: contentContext.onArrowChange,
          style: {
            position: "absolute",
            left: contentContext.arrowX,
            top: contentContext.arrowY,
            [baseSide]: 0,
            transformOrigin: {
              top: "",
              right: "0 0",
              bottom: "center 0",
              left: "100% 0"
            }[contentContext.placedSide],
            transform: {
              top: "translateY(100%)",
              right: "translateY(50%) rotate(90deg) translateX(-50%)",
              bottom: `rotate(180deg)`,
              left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[contentContext.placedSide],
            visibility: contentContext.shouldHideArrow ? "hidden" : void 0
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            Root3,
            {
              ...arrowProps,
              ref: forwardedRef,
              style: {
                ...arrowProps.style,
                // ensures the element can be measured correctly (mostly for if SVG)
                display: "block"
              }
            }
          )
        }
      )
    );
  });
  PopperArrow.displayName = ARROW_NAME;
  function isNotNull(value) {
    return value !== null;
  }
  var transformOrigin = (options) => ({
    name: "transformOrigin",
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
      let x2 = "";
      let y = "";
      if (placedSide === "bottom") {
        x2 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x2 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x2 = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x2 = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x: x2, y } };
    }
  });
  function getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
  }
  var Root22 = Popper;
  var Anchor = PopperAnchor;
  var Content2 = PopperContent;
  var Arrow2 = PopperArrow;

  // node_modules/@radix-ui/number/dist/index.mjs
  function clamp2(value, [min2, max2]) {
    return Math.min(max2, Math.max(min2, value));
  }

  // node_modules/@radix-ui/react-scroll-area/dist/index.mjs
  var dist_exports6 = {};
  __export(dist_exports6, {
    Corner: () => Corner,
    Root: () => Root4,
    ScrollArea: () => ScrollArea,
    ScrollAreaCorner: () => ScrollAreaCorner,
    ScrollAreaScrollbar: () => ScrollAreaScrollbar,
    ScrollAreaThumb: () => ScrollAreaThumb,
    ScrollAreaViewport: () => ScrollAreaViewport,
    Scrollbar: () => Scrollbar,
    Thumb: () => Thumb,
    Viewport: () => Viewport,
    createScrollAreaScope: () => createScrollAreaScope
  });
  var React210 = __toESM(require_react(), 1);
  var React31 = __toESM(require_react(), 1);
  var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
  function useStateMachine2(initialState, machine) {
    return React31.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState);
  }
  var SCROLL_AREA_NAME = "ScrollArea";
  var [createScrollAreaContext, createScrollAreaScope] = createContextScope(SCROLL_AREA_NAME);
  var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
  var ScrollArea = React210.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeScrollArea,
        type = "hover",
        dir,
        scrollHideDelay = 600,
        ...scrollAreaProps
      } = props;
      const [scrollArea, setScrollArea] = React210.useState(null);
      const [viewport, setViewport] = React210.useState(null);
      const [content, setContent] = React210.useState(null);
      const [scrollbarX, setScrollbarX] = React210.useState(null);
      const [scrollbarY, setScrollbarY] = React210.useState(null);
      const [cornerWidth, setCornerWidth] = React210.useState(0);
      const [cornerHeight, setCornerHeight] = React210.useState(0);
      const [scrollbarXEnabled, setScrollbarXEnabled] = React210.useState(false);
      const [scrollbarYEnabled, setScrollbarYEnabled] = React210.useState(false);
      const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
      const direction = useDirection(dir);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        ScrollAreaProvider,
        {
          scope: __scopeScrollArea,
          type,
          dir: direction,
          scrollHideDelay,
          scrollArea,
          viewport,
          onViewportChange: setViewport,
          content,
          onContentChange: setContent,
          scrollbarX,
          onScrollbarXChange: setScrollbarX,
          scrollbarXEnabled,
          onScrollbarXEnabledChange: setScrollbarXEnabled,
          scrollbarY,
          onScrollbarYChange: setScrollbarY,
          scrollbarYEnabled,
          onScrollbarYEnabledChange: setScrollbarYEnabled,
          onCornerWidthChange: setCornerWidth,
          onCornerHeightChange: setCornerHeight,
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            Primitive.div,
            {
              dir: direction,
              ...scrollAreaProps,
              ref: composedRefs,
              style: {
                position: "relative",
                // Pass corner sizes as CSS vars to reduce re-renders of context consumers
                ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
                ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
                ...props.style
              }
            }
          )
        }
      );
    }
  );
  ScrollArea.displayName = SCROLL_AREA_NAME;
  var VIEWPORT_NAME = "ScrollAreaViewport";
  var ScrollAreaViewport = React210.forwardRef(
    (props, forwardedRef) => {
      const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
      const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
      const ref = React210.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "style",
          {
            dangerouslySetInnerHTML: {
              __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
            },
            nonce
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          Primitive.div,
          {
            "data-radix-scroll-area-viewport": "",
            ...viewportProps,
            ref: composedRefs,
            style: {
              /**
               * We don't support `visible` because the intention is to have at least one scrollbar
               * if this component is used and `visible` will behave like `auto` in that case
               * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
               *
               * We don't handle `auto` because the intention is for the native implementation
               * to be hidden if using this component. We just want to ensure the node is scrollable
               * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
               * the browser from having to work out whether to render native scrollbars or not,
               * we tell it to with the intention of hiding them in CSS.
               */
              overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
              overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
              ...props.style
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
          }
        )
      ] });
    }
  );
  ScrollAreaViewport.displayName = VIEWPORT_NAME;
  var SCROLLBAR_NAME = "ScrollAreaScrollbar";
  var ScrollAreaScrollbar = React210.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...scrollbarProps } = props;
      const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
      const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
      const isHorizontal = props.orientation === "horizontal";
      React210.useEffect(() => {
        isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
        return () => {
          isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
        };
      }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
      return context.type === "hover" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
    }
  );
  ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
  var ScrollAreaScrollbarHover = React210.forwardRef((props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [visible, setVisible] = React210.useState(false);
    React210.useEffect(() => {
      const scrollArea = context.scrollArea;
      let hideTimer = 0;
      if (scrollArea) {
        const handlePointerEnter = () => {
          window.clearTimeout(hideTimer);
          setVisible(true);
        };
        const handlePointerLeave = () => {
          hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
        };
        scrollArea.addEventListener("pointerenter", handlePointerEnter);
        scrollArea.addEventListener("pointerleave", handlePointerLeave);
        return () => {
          window.clearTimeout(hideTimer);
          scrollArea.removeEventListener("pointerenter", handlePointerEnter);
          scrollArea.removeEventListener("pointerleave", handlePointerLeave);
        };
      }
    }, [context.scrollArea, context.scrollHideDelay]);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Presence, { present: forceMount || visible, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ScrollAreaScrollbarAuto,
      {
        "data-state": visible ? "visible" : "hidden",
        ...scrollbarProps,
        ref: forwardedRef
      }
    ) });
  });
  var ScrollAreaScrollbarScroll = React210.forwardRef((props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const isHorizontal = props.orientation === "horizontal";
    const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
    const [state, send] = useStateMachine2("hidden", {
      hidden: {
        SCROLL: "scrolling"
      },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    });
    React210.useEffect(() => {
      if (state === "idle") {
        const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
        return () => window.clearTimeout(hideTimer);
      }
    }, [state, context.scrollHideDelay, send]);
    React210.useEffect(() => {
      const viewport = context.viewport;
      const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
      if (viewport) {
        let prevScrollPos = viewport[scrollDirection];
        const handleScroll2 = () => {
          const scrollPos = viewport[scrollDirection];
          const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
          if (hasScrollInDirectionChanged) {
            send("SCROLL");
            debounceScrollEnd();
          }
          prevScrollPos = scrollPos;
        };
        viewport.addEventListener("scroll", handleScroll2);
        return () => viewport.removeEventListener("scroll", handleScroll2);
      }
    }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ScrollAreaScrollbarVisible,
      {
        "data-state": state === "hidden" ? "hidden" : "visible",
        ...scrollbarProps,
        ref: forwardedRef,
        onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
      }
    ) });
  });
  var ScrollAreaScrollbarAuto = React210.forwardRef((props, forwardedRef) => {
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { forceMount, ...scrollbarProps } = props;
    const [visible, setVisible] = React210.useState(false);
    const isHorizontal = props.orientation === "horizontal";
    const handleResize = useDebounceCallback(() => {
      if (context.viewport) {
        const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
        const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
        setVisible(isHorizontal ? isOverflowX : isOverflowY);
      }
    }, 10);
    useResizeObserver(context.viewport, handleResize);
    useResizeObserver(context.content, handleResize);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Presence, { present: forceMount || visible, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ScrollAreaScrollbarVisible,
      {
        "data-state": visible ? "visible" : "hidden",
        ...scrollbarProps,
        ref: forwardedRef
      }
    ) });
  });
  var ScrollAreaScrollbarVisible = React210.forwardRef((props, forwardedRef) => {
    const { orientation = "vertical", ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const thumbRef = React210.useRef(null);
    const pointerOffsetRef = React210.useRef(0);
    const [sizes, setSizes] = React210.useState({
      content: 0,
      viewport: 0,
      scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
    });
    const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
    const commonProps = {
      ...scrollbarProps,
      sizes,
      onSizesChange: setSizes,
      hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
      onThumbChange: (thumb) => thumbRef.current = thumb,
      onThumbPointerUp: () => pointerOffsetRef.current = 0,
      onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
    };
    function getScrollPosition(pointerPos, dir) {
      return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
    }
    if (orientation === "horizontal") {
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        ScrollAreaScrollbarX,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollLeft;
              const offset4 = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
              thumbRef.current.style.transform = `translate3d(${offset4}px, 0, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollLeft = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) {
              context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
            }
          }
        }
      );
    }
    if (orientation === "vertical") {
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        ScrollAreaScrollbarY,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollTop;
              const offset4 = getThumbOffsetFromScroll(scrollPos, sizes);
              thumbRef.current.style.transform = `translate3d(0, ${offset4}px, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollTop = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
          }
        }
      );
    }
    return null;
  });
  var ScrollAreaScrollbarX = React210.forwardRef((props, forwardedRef) => {
    const { sizes, onSizesChange, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React210.useState();
    const ref = React210.useRef(null);
    const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
    React210.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ScrollAreaScrollbarImpl,
      {
        "data-orientation": "horizontal",
        ...scrollbarProps,
        ref: composeRefs2,
        sizes,
        style: {
          bottom: 0,
          left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
          right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
          ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
          ...props.style
        },
        onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
        onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
        onWheelScroll: (event, maxScrollPos) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollLeft + event.deltaX;
            props.onWheelScroll(scrollPos);
            if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        },
        onResize: () => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollWidth,
              viewport: context.viewport.offsetWidth,
              scrollbar: {
                size: ref.current.clientWidth,
                paddingStart: toInt(computedStyle.paddingLeft),
                paddingEnd: toInt(computedStyle.paddingRight)
              }
            });
          }
        }
      }
    );
  });
  var ScrollAreaScrollbarY = React210.forwardRef((props, forwardedRef) => {
    const { sizes, onSizesChange, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React210.useState();
    const ref = React210.useRef(null);
    const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
    React210.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ScrollAreaScrollbarImpl,
      {
        "data-orientation": "vertical",
        ...scrollbarProps,
        ref: composeRefs2,
        sizes,
        style: {
          top: 0,
          right: context.dir === "ltr" ? 0 : void 0,
          left: context.dir === "rtl" ? 0 : void 0,
          bottom: "var(--radix-scroll-area-corner-height)",
          ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
          ...props.style
        },
        onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
        onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
        onWheelScroll: (event, maxScrollPos) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollTop + event.deltaY;
            props.onWheelScroll(scrollPos);
            if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        },
        onResize: () => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollHeight,
              viewport: context.viewport.offsetHeight,
              scrollbar: {
                size: ref.current.clientHeight,
                paddingStart: toInt(computedStyle.paddingTop),
                paddingEnd: toInt(computedStyle.paddingBottom)
              }
            });
          }
        }
      }
    );
  });
  var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
  var ScrollAreaScrollbarImpl = React210.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea,
      sizes,
      hasThumb,
      onThumbChange,
      onThumbPointerUp,
      onThumbPointerDown,
      onThumbPositionChange,
      onDragScroll,
      onWheelScroll,
      onResize,
      ...scrollbarProps
    } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
    const [scrollbar, setScrollbar] = React210.useState(null);
    const composeRefs2 = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
    const rectRef = React210.useRef(null);
    const prevWebkitUserSelectRef = React210.useRef("");
    const viewport = context.viewport;
    const maxScrollPos = sizes.content - sizes.viewport;
    const handleWheelScroll = useCallbackRef(onWheelScroll);
    const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
    const handleResize = useDebounceCallback(onResize, 10);
    function handleDragScroll(event) {
      if (rectRef.current) {
        const x2 = event.clientX - rectRef.current.left;
        const y = event.clientY - rectRef.current.top;
        onDragScroll({ x: x2, y });
      }
    }
    React210.useEffect(() => {
      const handleWheel = (event) => {
        const element = event.target;
        const isScrollbarWheel = scrollbar?.contains(element);
        if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
      };
      document.addEventListener("wheel", handleWheel, { passive: false });
      return () => document.removeEventListener("wheel", handleWheel, { passive: false });
    }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
    React210.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
    useResizeObserver(scrollbar, handleResize);
    useResizeObserver(context.content, handleResize);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ScrollbarProvider,
      {
        scope: __scopeScrollArea,
        scrollbar,
        hasThumb,
        onThumbChange: useCallbackRef(onThumbChange),
        onThumbPointerUp: useCallbackRef(onThumbPointerUp),
        onThumbPositionChange: handleThumbPositionChange,
        onThumbPointerDown: useCallbackRef(onThumbPointerDown),
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          Primitive.div,
          {
            ...scrollbarProps,
            ref: composeRefs2,
            style: { position: "absolute", ...scrollbarProps.style },
            onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
              const mainPointer = 0;
              if (event.button === mainPointer) {
                const element = event.target;
                element.setPointerCapture(event.pointerId);
                rectRef.current = scrollbar.getBoundingClientRect();
                prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
                document.body.style.webkitUserSelect = "none";
                if (context.viewport) context.viewport.style.scrollBehavior = "auto";
                handleDragScroll(event);
              }
            }),
            onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
            onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
              const element = event.target;
              if (element.hasPointerCapture(event.pointerId)) {
                element.releasePointerCapture(event.pointerId);
              }
              document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
              if (context.viewport) context.viewport.style.scrollBehavior = "";
              rectRef.current = null;
            })
          }
        )
      }
    );
  });
  var THUMB_NAME = "ScrollAreaThumb";
  var ScrollAreaThumb = React210.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...thumbProps } = props;
      const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
    }
  );
  var ScrollAreaThumbImpl = React210.forwardRef(
    (props, forwardedRef) => {
      const { __scopeScrollArea, style, ...thumbProps } = props;
      const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
      const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
      const { onThumbPositionChange } = scrollbarContext;
      const composedRef = useComposedRefs(
        forwardedRef,
        (node) => scrollbarContext.onThumbChange(node)
      );
      const removeUnlinkedScrollListenerRef = React210.useRef(void 0);
      const debounceScrollEnd = useDebounceCallback(() => {
        if (removeUnlinkedScrollListenerRef.current) {
          removeUnlinkedScrollListenerRef.current();
          removeUnlinkedScrollListenerRef.current = void 0;
        }
      }, 100);
      React210.useEffect(() => {
        const viewport = scrollAreaContext.viewport;
        if (viewport) {
          const handleScroll2 = () => {
            debounceScrollEnd();
            if (!removeUnlinkedScrollListenerRef.current) {
              const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
              removeUnlinkedScrollListenerRef.current = listener;
              onThumbPositionChange();
            }
          };
          onThumbPositionChange();
          viewport.addEventListener("scroll", handleScroll2);
          return () => viewport.removeEventListener("scroll", handleScroll2);
        }
      }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Primitive.div,
        {
          "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
          ...thumbProps,
          ref: composedRef,
          style: {
            width: "var(--radix-scroll-area-thumb-width)",
            height: "var(--radix-scroll-area-thumb-height)",
            ...style
          },
          onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
            const thumb = event.target;
            const thumbRect = thumb.getBoundingClientRect();
            const x2 = event.clientX - thumbRect.left;
            const y = event.clientY - thumbRect.top;
            scrollbarContext.onThumbPointerDown({ x: x2, y });
          }),
          onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
        }
      );
    }
  );
  ScrollAreaThumb.displayName = THUMB_NAME;
  var CORNER_NAME = "ScrollAreaCorner";
  var ScrollAreaCorner = React210.forwardRef(
    (props, forwardedRef) => {
      const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
      const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
      const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
      return hasCorner ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
    }
  );
  ScrollAreaCorner.displayName = CORNER_NAME;
  var ScrollAreaCornerImpl = React210.forwardRef((props, forwardedRef) => {
    const { __scopeScrollArea, ...cornerProps } = props;
    const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
    const [width, setWidth] = React210.useState(0);
    const [height, setHeight] = React210.useState(0);
    const hasSize = Boolean(width && height);
    useResizeObserver(context.scrollbarX, () => {
      const height2 = context.scrollbarX?.offsetHeight || 0;
      context.onCornerHeightChange(height2);
      setHeight(height2);
    });
    useResizeObserver(context.scrollbarY, () => {
      const width2 = context.scrollbarY?.offsetWidth || 0;
      context.onCornerWidthChange(width2);
      setWidth(width2);
    });
    return hasSize ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      Primitive.div,
      {
        ...cornerProps,
        ref: forwardedRef,
        style: {
          width,
          height,
          position: "absolute",
          right: context.dir === "ltr" ? 0 : void 0,
          left: context.dir === "rtl" ? 0 : void 0,
          bottom: 0,
          ...props.style
        }
      }
    ) : null;
  });
  function toInt(value) {
    return value ? parseInt(value, 10) : 0;
  }
  function getThumbRatio(viewportSize, contentSize) {
    const ratio = viewportSize / contentSize;
    return isNaN(ratio) ? 0 : ratio;
  }
  function getThumbSize(sizes) {
    const ratio = getThumbRatio(sizes.viewport, sizes.content);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
    return Math.max(thumbSize, 18);
  }
  function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes);
    const thumbCenter = thumbSizePx / 2;
    const offset4 = pointerOffset || thumbCenter;
    const thumbOffsetFromEnd = thumbSizePx - offset4;
    const minPointerPos = sizes.scrollbar.paddingStart + offset4;
    const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
    const maxScrollPos = sizes.content - sizes.viewport;
    const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
    return interpolate(pointerPos);
  }
  function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const scrollbar = sizes.scrollbar.size - scrollbarPadding;
    const maxScrollPos = sizes.content - sizes.viewport;
    const maxThumbPos = scrollbar - thumbSizePx;
    const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const scrollWithoutMomentum = clamp2(scrollPos, scrollClampRange);
    const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
    return interpolate(scrollWithoutMomentum);
  }
  function linearScale(input, output) {
    return (value) => {
      if (input[0] === input[1] || output[0] === output[1]) return output[0];
      const ratio = (output[1] - output[0]) / (input[1] - input[0]);
      return output[0] + ratio * (value - input[0]);
    };
  }
  function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
    return scrollPos > 0 && scrollPos < maxScrollPos;
  }
  var addUnlinkedScrollListener = (node, handler = () => {
  }) => {
    let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
    let rAF = 0;
    (function loop() {
      const position = { left: node.scrollLeft, top: node.scrollTop };
      const isHorizontalScroll = prevPosition.left !== position.left;
      const isVerticalScroll = prevPosition.top !== position.top;
      if (isHorizontalScroll || isVerticalScroll) handler();
      prevPosition = position;
      rAF = window.requestAnimationFrame(loop);
    })();
    return () => window.cancelAnimationFrame(rAF);
  };
  function useDebounceCallback(callback, delay) {
    const handleCallback = useCallbackRef(callback);
    const debounceTimerRef = React210.useRef(0);
    React210.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
    return React210.useCallback(() => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(handleCallback, delay);
    }, [handleCallback, delay]);
  }
  function useResizeObserver(element, onResize) {
    const handleResize = useCallbackRef(onResize);
    useLayoutEffect2(() => {
      let rAF = 0;
      if (element) {
        const resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(rAF);
          rAF = window.requestAnimationFrame(handleResize);
        });
        resizeObserver.observe(element);
        return () => {
          window.cancelAnimationFrame(rAF);
          resizeObserver.unobserve(element);
        };
      }
    }, [element, handleResize]);
  }
  var Root4 = ScrollArea;
  var Viewport = ScrollAreaViewport;
  var Scrollbar = ScrollAreaScrollbar;
  var Thumb = ScrollAreaThumb;
  var Corner = ScrollAreaCorner;

  // node_modules/@radix-ui/react-tooltip/dist/index.mjs
  var dist_exports7 = {};
  __export(dist_exports7, {
    Arrow: () => Arrow22,
    Content: () => Content22,
    Portal: () => Portal3,
    Provider: () => Provider2,
    Root: () => Root32,
    Tooltip: () => Tooltip,
    TooltipArrow: () => TooltipArrow,
    TooltipContent: () => TooltipContent,
    TooltipPortal: () => TooltipPortal,
    TooltipProvider: () => TooltipProvider,
    TooltipTrigger: () => TooltipTrigger,
    Trigger: () => Trigger2,
    createTooltipScope: () => createTooltipScope
  });
  var React32 = __toESM(require_react(), 1);
  var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
  var [createTooltipContext, createTooltipScope] = createContextScope("Tooltip", [
    createPopperScope
  ]);
  var usePopperScope = createPopperScope();
  var PROVIDER_NAME = "TooltipProvider";
  var DEFAULT_DELAY_DURATION = 700;
  var TOOLTIP_OPEN = "tooltip.open";
  var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
  var TooltipProvider = (props) => {
    const {
      __scopeTooltip,
      delayDuration = DEFAULT_DELAY_DURATION,
      skipDelayDuration = 300,
      disableHoverableContent = false,
      children
    } = props;
    const isOpenDelayedRef = React32.useRef(true);
    const isPointerInTransitRef = React32.useRef(false);
    const skipDelayTimerRef = React32.useRef(0);
    React32.useEffect(() => {
      const skipDelayTimer = skipDelayTimerRef.current;
      return () => window.clearTimeout(skipDelayTimer);
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      TooltipProviderContextProvider,
      {
        scope: __scopeTooltip,
        isOpenDelayedRef,
        delayDuration,
        onOpen: React32.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          isOpenDelayedRef.current = false;
        }, []),
        onClose: React32.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => isOpenDelayedRef.current = true,
            skipDelayDuration
          );
        }, [skipDelayDuration]),
        isPointerInTransitRef,
        onPointerInTransitChange: React32.useCallback((inTransit) => {
          isPointerInTransitRef.current = inTransit;
        }, []),
        disableHoverableContent,
        children
      }
    );
  };
  TooltipProvider.displayName = PROVIDER_NAME;
  var TOOLTIP_NAME = "Tooltip";
  var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
  var Tooltip = (props) => {
    const {
      __scopeTooltip,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      disableHoverableContent: disableHoverableContentProp,
      delayDuration: delayDurationProp
    } = props;
    const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const [trigger, setTrigger] = React32.useState(null);
    const contentId = useId();
    const openTimerRef = React32.useRef(0);
    const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
    const delayDuration = delayDurationProp ?? providerContext.delayDuration;
    const wasOpenDelayedRef = React32.useRef(false);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: (open2) => {
        if (open2) {
          providerContext.onOpen();
          document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
        } else {
          providerContext.onClose();
        }
        onOpenChange?.(open2);
      },
      caller: TOOLTIP_NAME
    });
    const stateAttribute = React32.useMemo(() => {
      return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
    }, [open]);
    const handleOpen = React32.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = 0;
      wasOpenDelayedRef.current = false;
      setOpen(true);
    }, [setOpen]);
    const handleClose = React32.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = 0;
      setOpen(false);
    }, [setOpen]);
    const handleDelayedOpen = React32.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = window.setTimeout(() => {
        wasOpenDelayedRef.current = true;
        setOpen(true);
        openTimerRef.current = 0;
      }, delayDuration);
    }, [delayDuration, setOpen]);
    React32.useEffect(() => {
      return () => {
        if (openTimerRef.current) {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      };
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Root22, { ...popperScope, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      TooltipContextProvider,
      {
        scope: __scopeTooltip,
        contentId,
        open,
        stateAttribute,
        trigger,
        onTriggerChange: setTrigger,
        onTriggerEnter: React32.useCallback(() => {
          if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
          else handleOpen();
        }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
        onTriggerLeave: React32.useCallback(() => {
          if (disableHoverableContent) {
            handleClose();
          } else {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = 0;
          }
        }, [handleClose, disableHoverableContent]),
        onOpen: handleOpen,
        onClose: handleClose,
        disableHoverableContent,
        children
      }
    ) });
  };
  Tooltip.displayName = TOOLTIP_NAME;
  var TRIGGER_NAME2 = "TooltipTrigger";
  var TooltipTrigger = React32.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...triggerProps } = props;
      const context = useTooltipContext(TRIGGER_NAME2, __scopeTooltip);
      const providerContext = useTooltipProviderContext(TRIGGER_NAME2, __scopeTooltip);
      const popperScope = usePopperScope(__scopeTooltip);
      const ref = React32.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
      const isPointerDownRef = React32.useRef(false);
      const hasPointerMoveOpenedRef = React32.useRef(false);
      const handlePointerUp = React32.useCallback(() => isPointerDownRef.current = false, []);
      React32.useEffect(() => {
        return () => document.removeEventListener("pointerup", handlePointerUp);
      }, [handlePointerUp]);
      return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        Primitive.button,
        {
          "aria-describedby": context.open ? context.contentId : void 0,
          "data-state": context.stateAttribute,
          ...triggerProps,
          ref: composedRefs,
          onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
            if (event.pointerType === "touch") return;
            if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
              context.onTriggerEnter();
              hasPointerMoveOpenedRef.current = true;
            }
          }),
          onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          }),
          onPointerDown: composeEventHandlers(props.onPointerDown, () => {
            if (context.open) {
              context.onClose();
            }
            isPointerDownRef.current = true;
            document.addEventListener("pointerup", handlePointerUp, { once: true });
          }),
          onFocus: composeEventHandlers(props.onFocus, () => {
            if (!isPointerDownRef.current) context.onOpen();
          }),
          onBlur: composeEventHandlers(props.onBlur, context.onClose),
          onClick: composeEventHandlers(props.onClick, context.onClose)
        }
      ) });
    }
  );
  TooltipTrigger.displayName = TRIGGER_NAME2;
  var PORTAL_NAME3 = "TooltipPortal";
  var [PortalProvider2, usePortalContext2] = createTooltipContext(PORTAL_NAME3, {
    forceMount: void 0
  });
  var TooltipPortal = (props) => {
    const { __scopeTooltip, forceMount, children, container } = props;
    const context = useTooltipContext(PORTAL_NAME3, __scopeTooltip);
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(PortalProvider2, { scope: __scopeTooltip, forceMount, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Portal, { asChild: true, container, children }) }) });
  };
  TooltipPortal.displayName = PORTAL_NAME3;
  var CONTENT_NAME3 = "TooltipContent";
  var TooltipContent = React32.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext2(CONTENT_NAME3, props.__scopeTooltip);
      const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
      const context = useTooltipContext(CONTENT_NAME3, props.__scopeTooltip);
      return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
    }
  );
  var TooltipContentHoverable = React32.forwardRef((props, forwardedRef) => {
    const context = useTooltipContext(CONTENT_NAME3, props.__scopeTooltip);
    const providerContext = useTooltipProviderContext(CONTENT_NAME3, props.__scopeTooltip);
    const ref = React32.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [pointerGraceArea, setPointerGraceArea] = React32.useState(null);
    const { trigger, onClose } = context;
    const content = ref.current;
    const { onPointerInTransitChange } = providerContext;
    const handleRemoveGraceArea = React32.useCallback(() => {
      setPointerGraceArea(null);
      onPointerInTransitChange(false);
    }, [onPointerInTransitChange]);
    const handleCreateGraceArea = React32.useCallback(
      (event, hoverTarget) => {
        const currentTarget = event.currentTarget;
        const exitPoint = { x: event.clientX, y: event.clientY };
        const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
        const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
        const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
        const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
        setPointerGraceArea(graceArea);
        onPointerInTransitChange(true);
      },
      [onPointerInTransitChange]
    );
    React32.useEffect(() => {
      return () => handleRemoveGraceArea();
    }, [handleRemoveGraceArea]);
    React32.useEffect(() => {
      if (trigger && content) {
        const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
        const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
        trigger.addEventListener("pointerleave", handleTriggerLeave);
        content.addEventListener("pointerleave", handleContentLeave);
        return () => {
          trigger.removeEventListener("pointerleave", handleTriggerLeave);
          content.removeEventListener("pointerleave", handleContentLeave);
        };
      }
    }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
    React32.useEffect(() => {
      if (pointerGraceArea) {
        const handleTrackPointerGrace = (event) => {
          const target = event.target;
          const pointerPosition = { x: event.clientX, y: event.clientY };
          const hasEnteredTarget = trigger?.contains(target) || content?.contains(target);
          const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
          if (hasEnteredTarget) {
            handleRemoveGraceArea();
          } else if (isPointerOutsideGraceArea) {
            handleRemoveGraceArea();
            onClose();
          }
        };
        document.addEventListener("pointermove", handleTrackPointerGrace);
        return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
      }
    }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipContentImpl, { ...props, ref: composedRefs });
  });
  var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
  var Slottable2 = createSlottable("TooltipContent");
  var TooltipContentImpl = React32.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeTooltip,
        children,
        "aria-label": ariaLabel,
        onEscapeKeyDown,
        onPointerDownOutside,
        ...contentProps
      } = props;
      const context = useTooltipContext(CONTENT_NAME3, __scopeTooltip);
      const popperScope = usePopperScope(__scopeTooltip);
      const { onClose } = context;
      React32.useEffect(() => {
        document.addEventListener(TOOLTIP_OPEN, onClose);
        return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
      }, [onClose]);
      React32.useEffect(() => {
        if (context.trigger) {
          const handleScroll2 = (event) => {
            const target = event.target;
            if (target?.contains(context.trigger)) onClose();
          };
          window.addEventListener("scroll", handleScroll2, { capture: true });
          return () => window.removeEventListener("scroll", handleScroll2, { capture: true });
        }
      }, [context.trigger, onClose]);
      return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        DismissableLayer,
        {
          asChild: true,
          disableOutsidePointerEvents: false,
          onEscapeKeyDown,
          onPointerDownOutside,
          onFocusOutside: (event) => event.preventDefault(),
          onDismiss: onClose,
          children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
            Content2,
            {
              "data-state": context.stateAttribute,
              ...popperScope,
              ...contentProps,
              ref: forwardedRef,
              style: {
                ...contentProps.style,
                // re-namespace exposed content custom properties
                ...{
                  "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
                }
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Slottable2, { children }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Root, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
              ]
            }
          )
        }
      );
    }
  );
  TooltipContent.displayName = CONTENT_NAME3;
  var ARROW_NAME2 = "TooltipArrow";
  var TooltipArrow = React32.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...arrowProps } = props;
      const popperScope = usePopperScope(__scopeTooltip);
      const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
        ARROW_NAME2,
        __scopeTooltip
      );
      return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  TooltipArrow.displayName = ARROW_NAME2;
  function getExitSideFromRect(point, rect) {
    const top = Math.abs(rect.top - point.y);
    const bottom = Math.abs(rect.bottom - point.y);
    const right = Math.abs(rect.right - point.x);
    const left = Math.abs(rect.left - point.x);
    switch (Math.min(top, bottom, right, left)) {
      case left:
        return "left";
      case right:
        return "right";
      case top:
        return "top";
      case bottom:
        return "bottom";
      default:
        throw new Error("unreachable");
    }
  }
  function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
    const paddedExitPoints = [];
    switch (exitSide) {
      case "top":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y + padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "bottom":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y - padding }
        );
        break;
      case "left":
        paddedExitPoints.push(
          { x: exitPoint.x + padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "right":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x - padding, y: exitPoint.y + padding }
        );
        break;
    }
    return paddedExitPoints;
  }
  function getPointsFromRect(rect) {
    const { top, right, bottom, left } = rect;
    return [
      { x: left, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom }
    ];
  }
  function isPointInPolygon(point, polygon) {
    const { x: x2, y } = point;
    let inside = false;
    for (let i6 = 0, j = polygon.length - 1; i6 < polygon.length; j = i6++) {
      const ii = polygon[i6];
      const jj = polygon[j];
      const xi = ii.x;
      const yi = ii.y;
      const xj = jj.x;
      const yj = jj.y;
      const intersect = yi > y !== yj > y && x2 < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  function getHull(points) {
    const newPoints = points.slice();
    newPoints.sort((a16, b2) => {
      if (a16.x < b2.x) return -1;
      else if (a16.x > b2.x) return 1;
      else if (a16.y < b2.y) return -1;
      else if (a16.y > b2.y) return 1;
      else return 0;
    });
    return getHullPresorted(newPoints);
  }
  function getHullPresorted(points) {
    if (points.length <= 1) return points.slice();
    const upperHull = [];
    for (let i6 = 0; i6 < points.length; i6++) {
      const p14 = points[i6];
      while (upperHull.length >= 2) {
        const q = upperHull[upperHull.length - 1];
        const r25 = upperHull[upperHull.length - 2];
        if ((q.x - r25.x) * (p14.y - r25.y) >= (q.y - r25.y) * (p14.x - r25.x)) upperHull.pop();
        else break;
      }
      upperHull.push(p14);
    }
    upperHull.pop();
    const lowerHull = [];
    for (let i6 = points.length - 1; i6 >= 0; i6--) {
      const p14 = points[i6];
      while (lowerHull.length >= 2) {
        const q = lowerHull[lowerHull.length - 1];
        const r25 = lowerHull[lowerHull.length - 2];
        if ((q.x - r25.x) * (p14.y - r25.y) >= (q.y - r25.y) * (p14.x - r25.x)) lowerHull.pop();
        else break;
      }
      lowerHull.push(p14);
    }
    lowerHull.pop();
    if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
      return upperHull;
    } else {
      return upperHull.concat(lowerHull);
    }
  }
  var Provider2 = TooltipProvider;
  var Root32 = Tooltip;
  var Trigger2 = TooltipTrigger;
  var Portal3 = TooltipPortal;
  var Content22 = TooltipContent;
  var Arrow22 = TooltipArrow;

  // node_modules/@radix-ui/themes/dist/esm/props/as-child.prop.js
  var o = { asChild: { type: "boolean" } };

  // node_modules/@radix-ui/themes/dist/esm/props/width.props.js
  var t = { width: { type: "string", className: "rt-r-w", customProperties: ["--width"], responsive: true }, minWidth: { type: "string", className: "rt-r-min-w", customProperties: ["--min-width"], responsive: true }, maxWidth: { type: "string", className: "rt-r-max-w", customProperties: ["--max-width"], responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/props/height.props.js
  var e = { height: { type: "string", className: "rt-r-h", customProperties: ["--height"], responsive: true }, minHeight: { type: "string", className: "rt-r-min-h", customProperties: ["--min-height"], responsive: true }, maxHeight: { type: "string", className: "rt-r-max-h", customProperties: ["--max-height"], responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/components/dialog.props.js
  var r = ["1", "2", "3", "4"];
  var s = { ...o, align: { type: "enum", className: "rt-r-align", values: ["start", "center"], default: "center" }, size: { type: "enum", className: "rt-r-size", values: r, default: "3", responsive: true }, width: t.width, minWidth: t.minWidth, maxWidth: { ...t.maxWidth, default: "600px" }, ...e };

  // node_modules/@radix-ui/themes/dist/esm/components/heading.js
  var o5 = __toESM(require_react(), 1);
  var import_classnames2 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/props/color.prop.js
  var o2 = ["gray", "gold", "bronze", "brown", "yellow", "amber", "orange", "tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", "cyan", "teal", "jade", "green", "grass", "lime", "mint", "sky"];
  var e2 = ["auto", "gray", "mauve", "slate", "sage", "olive", "sand"];
  var r2 = { color: { type: "enum", values: o2, default: void 0 } };
  var s2 = { color: { type: "enum", values: o2, default: "" } };

  // node_modules/@radix-ui/themes/dist/esm/props/high-contrast.prop.js
  var o3 = { highContrast: { type: "boolean", className: "rt-high-contrast", default: void 0 } };

  // node_modules/@radix-ui/themes/dist/esm/props/leading-trim.prop.js
  var e3 = ["normal", "start", "end", "both"];
  var r3 = { trim: { type: "enum", className: "rt-r-lt", values: e3, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/props/text-align.prop.js
  var e4 = ["left", "center", "right"];
  var t2 = { align: { type: "enum", className: "rt-r-ta", values: e4, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/props/text-wrap.prop.js
  var e5 = ["wrap", "nowrap", "pretty", "balance"];
  var r4 = { wrap: { type: "enum", className: "rt-r-tw", values: e5, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/props/truncate.prop.js
  var e6 = { truncate: { type: "boolean", className: "rt-truncate" } };

  // node_modules/@radix-ui/themes/dist/esm/props/weight.prop.js
  var e7 = ["light", "regular", "medium", "bold"];
  var t3 = { weight: { type: "enum", className: "rt-r-weight", values: e7, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/components/heading.props.js
  var m = ["h1", "h2", "h3", "h4", "h5", "h6"];
  var a = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var n = { as: { type: "enum", values: m, default: "h1" }, ...o, size: { type: "enum", className: "rt-r-size", values: a, default: "6", responsive: true }, ...t3, ...t2, ...r3, ...e6, ...r4, ...r2, ...o3 };

  // node_modules/@radix-ui/themes/dist/esm/helpers/extract-props.js
  var import_classnames = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/props/prop-def.js
  var e8 = ["initial", "xs", "sm", "md", "lg", "xl"];
  var r5 = new Set(e8);

  // node_modules/@radix-ui/themes/dist/esm/helpers/has-own-property.js
  function e9(n12, r25) {
    return Object.prototype.hasOwnProperty.call(n12, r25);
  }

  // node_modules/@radix-ui/themes/dist/esm/helpers/is-responsive-object.js
  function r6(e24) {
    return typeof e24 == "object" && e24 !== null && Object.keys(e24).some((s11) => r5.has(s11));
  }

  // node_modules/@radix-ui/themes/dist/esm/helpers/get-responsive-styles.js
  function R({ className: r25, customProperties: s11, ...i6 }) {
    const p14 = g({ allowArbitraryValues: true, className: r25, ...i6 }), n12 = m2({ customProperties: s11, ...i6 });
    return [p14, n12];
  }
  function g({ allowArbitraryValues: r25, value: s11, className: i6, propValues: p14, parseValue: n12 = (e24) => e24 }) {
    const e24 = [];
    if (s11) {
      if (typeof s11 == "string" && p14.includes(s11)) return l(i6, s11, n12);
      if (r6(s11)) {
        const t15 = s11;
        for (const o21 in t15) {
          if (!e9(t15, o21) || !r5.has(o21)) continue;
          const u5 = t15[o21];
          if (u5 !== void 0) {
            if (p14.includes(u5)) {
              const f11 = l(i6, u5, n12), v3 = o21 === "initial" ? f11 : `${o21}:${f11}`;
              e24.push(v3);
            } else if (r25) {
              const f11 = o21 === "initial" ? i6 : `${o21}:${i6}`;
              e24.push(f11);
            }
          }
        }
        return e24.join(" ");
      }
      if (r25) return i6;
    }
  }
  function l(r25, s11, i6) {
    const p14 = r25 ? "-" : "", n12 = i6(s11), e24 = n12?.startsWith("-"), t15 = e24 ? "-" : "", o21 = e24 ? n12?.substring(1) : n12;
    return `${t15}${r25}${p14}${o21}`;
  }
  function m2({ customProperties: r25, value: s11, propValues: i6, parseValue: p14 = (n12) => n12 }) {
    let n12 = {};
    if (!(!s11 || typeof s11 == "string" && i6.includes(s11))) {
      if (typeof s11 == "string" && (n12 = Object.fromEntries(r25.map((e24) => [e24, s11]))), r6(s11)) {
        const e24 = s11;
        for (const t15 in e24) {
          if (!e9(e24, t15) || !r5.has(t15)) continue;
          const o21 = e24[t15];
          if (!i6.includes(o21)) for (const u5 of r25) n12 = { [t15 === "initial" ? u5 : `${u5}-${t15}`]: o21, ...n12 };
        }
      }
      for (const e24 in n12) {
        const t15 = n12[e24];
        t15 !== void 0 && (n12[e24] = p14(t15));
      }
      return n12;
    }
  }

  // node_modules/@radix-ui/themes/dist/esm/helpers/merge-styles.js
  function l2(...t15) {
    let e24 = {};
    for (const n12 of t15) n12 && (e24 = { ...e24, ...n12 });
    return Object.keys(e24).length ? e24 : void 0;
  }

  // node_modules/@radix-ui/themes/dist/esm/helpers/extract-props.js
  function N(...r25) {
    return Object.assign({}, ...r25);
  }
  function v(r25, ...m6) {
    let t15, l7;
    const a16 = { ...r25 }, f11 = N(...m6);
    for (const n12 in f11) {
      let s11 = a16[n12];
      const e24 = f11[n12];
      if (e24.default !== void 0 && s11 === void 0 && (s11 = e24.default), e24.type === "enum" && ![e24.default, ...e24.values].includes(s11) && !r6(s11) && (s11 = e24.default), a16[n12] = s11, "className" in e24 && e24.className) {
        delete a16[n12];
        const u5 = "responsive" in e24;
        if (!s11 || r6(s11) && !u5) continue;
        if (r6(s11) && (e24.default !== void 0 && s11.initial === void 0 && (s11.initial = e24.default), e24.type === "enum" && ([e24.default, ...e24.values].includes(s11.initial) || (s11.initial = e24.default))), e24.type === "enum") {
          const i6 = g({ allowArbitraryValues: false, value: s11, className: e24.className, propValues: e24.values, parseValue: e24.parseValue });
          t15 = (0, import_classnames.default)(t15, i6);
          continue;
        }
        if (e24.type === "string" || e24.type === "enum | string") {
          const i6 = e24.type === "string" ? [] : e24.values, [d8, y] = R({ className: e24.className, customProperties: e24.customProperties, propValues: i6, parseValue: e24.parseValue, value: s11 });
          l7 = l2(l7, y), t15 = (0, import_classnames.default)(t15, d8);
          continue;
        }
        if (e24.type === "boolean" && s11) {
          t15 = (0, import_classnames.default)(t15, e24.className);
          continue;
        }
      }
    }
    return a16.className = (0, import_classnames.default)(t15, r25.className), a16.style = l2(l7, r25.style), a16;
  }

  // node_modules/@radix-ui/themes/dist/esm/props/margin.props.js
  var e10 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9"];
  var r7 = { m: { type: "enum | string", values: e10, responsive: true, className: "rt-r-m", customProperties: ["--m"] }, mx: { type: "enum | string", values: e10, responsive: true, className: "rt-r-mx", customProperties: ["--ml", "--mr"] }, my: { type: "enum | string", values: e10, responsive: true, className: "rt-r-my", customProperties: ["--mt", "--mb"] }, mt: { type: "enum | string", values: e10, responsive: true, className: "rt-r-mt", customProperties: ["--mt"] }, mr: { type: "enum | string", values: e10, responsive: true, className: "rt-r-mr", customProperties: ["--mr"] }, mb: { type: "enum | string", values: e10, responsive: true, className: "rt-r-mb", customProperties: ["--mb"] }, ml: { type: "enum | string", values: e10, responsive: true, className: "rt-r-ml", customProperties: ["--ml"] } };

  // node_modules/@radix-ui/themes/dist/esm/components/heading.js
  var r8 = o5.forwardRef((p14, t15) => {
    const { children: e24, className: s11, asChild: a16, as: n12 = "h1", color: i6, ...m6 } = v(p14, n, r7);
    return o5.createElement(dist_exports.Root, { "data-accent-color": i6, ...m6, ref: t15, className: (0, import_classnames2.default)("rt-Heading", s11) }, a16 ? e24 : o5.createElement(n12, null, e24));
  });
  r8.displayName = "Heading";

  // node_modules/@radix-ui/themes/dist/esm/components/text.js
  var o6 = __toESM(require_react(), 1);
  var import_classnames3 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/text.props.js
  var m3 = ["span", "div", "label", "p"];
  var a2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var n2 = { as: { type: "enum", values: m3, default: "span" }, ...o, size: { type: "enum", className: "rt-r-size", values: a2, responsive: true }, ...t3, ...t2, ...r3, ...e6, ...r4, ...r2, ...o3 };

  // node_modules/@radix-ui/themes/dist/esm/components/text.js
  var p = o6.forwardRef((t15, r25) => {
    const { children: e24, className: s11, asChild: m6, as: a16 = "span", color: n12, ...P3 } = v(t15, n2, r7);
    return o6.createElement(dist_exports.Root, { "data-accent-color": n12, ...P3, ref: r25, className: (0, import_classnames3.default)("rt-Text", s11) }, m6 ? e24 : o6.createElement(a16, null, e24));
  });
  p.displayName = "Text";

  // node_modules/@radix-ui/themes/dist/esm/components/theme.js
  var e12 = __toESM(require_react(), 1);
  var import_classnames4 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/helpers/get-matching-gray-color.js
  function a3(e24) {
    switch (e24) {
      case "tomato":
      case "red":
      case "ruby":
      case "crimson":
      case "pink":
      case "plum":
      case "purple":
      case "violet":
        return "mauve";
      case "iris":
      case "indigo":
      case "blue":
      case "sky":
      case "cyan":
        return "slate";
      case "teal":
      case "jade":
      case "mint":
      case "green":
        return "sage";
      case "grass":
      case "lime":
        return "olive";
      case "yellow":
      case "amber":
      case "orange":
      case "brown":
      case "gold":
      case "bronze":
        return "sand";
      case "gray":
        return "gray";
    }
  }

  // node_modules/@radix-ui/themes/dist/esm/props/radius.prop.js
  var e11 = ["none", "small", "medium", "large", "full"];
  var r9 = { radius: { type: "enum", values: e11, default: void 0 } };

  // node_modules/@radix-ui/themes/dist/esm/components/theme.props.js
  var p2 = ["inherit", "light", "dark"];
  var t4 = ["solid", "translucent"];
  var n3 = ["90%", "95%", "100%", "105%", "110%"];
  var s3 = { ...o, hasBackground: { type: "boolean", default: true }, appearance: { type: "enum", values: p2, default: "inherit" }, accentColor: { type: "enum", values: o2, default: "indigo" }, grayColor: { type: "enum", values: e2, default: "auto" }, panelBackground: { type: "enum", values: t4, default: "translucent" }, radius: { type: "enum", values: e11, default: "medium" }, scaling: { type: "enum", values: n3, default: "100%" } };

  // node_modules/@radix-ui/themes/dist/esm/components/theme.js
  var d2 = () => {
  };
  var P = e12.createContext(void 0);
  var R2 = e12.forwardRef((a16, s11) => e12.useContext(P) === void 0 ? e12.createElement(dist_exports7.Provider, { delayDuration: 200 }, e12.createElement(dist_exports3.Provider, { dir: "ltr" }, e12.createElement(I, { ...a16, ref: s11 }))) : e12.createElement(A, { ...a16, ref: s11 }));
  R2.displayName = "Theme";
  var I = e12.forwardRef((a16, s11) => {
    const { appearance: r25 = s3.appearance.default, accentColor: c4 = s3.accentColor.default, grayColor: l7 = s3.grayColor.default, panelBackground: p14 = s3.panelBackground.default, radius: n12 = s3.radius.default, scaling: t15 = s3.scaling.default, hasBackground: i6 = s3.hasBackground.default, ...u5 } = a16, [h, m6] = e12.useState(r25);
    e12.useEffect(() => m6(r25), [r25]);
    const [y, g3] = e12.useState(c4);
    e12.useEffect(() => g3(c4), [c4]);
    const [v3, C] = e12.useState(l7);
    e12.useEffect(() => C(l7), [l7]);
    const [k, f11] = e12.useState(p14);
    e12.useEffect(() => f11(p14), [p14]);
    const [B2, x2] = e12.useState(n12);
    e12.useEffect(() => x2(n12), [n12]);
    const [T2, b2] = e12.useState(t15);
    return e12.useEffect(() => b2(t15), [t15]), e12.createElement(A, { ...u5, ref: s11, isRoot: true, hasBackground: i6, appearance: h, accentColor: y, grayColor: v3, panelBackground: k, radius: B2, scaling: T2, onAppearanceChange: m6, onAccentColorChange: g3, onGrayColorChange: C, onPanelBackgroundChange: f11, onRadiusChange: x2, onScalingChange: b2 });
  });
  I.displayName = "ThemeRoot";
  var A = e12.forwardRef((a16, s11) => {
    const r25 = e12.useContext(P), { asChild: c4, isRoot: l7, hasBackground: p14, appearance: n12 = r25?.appearance ?? s3.appearance.default, accentColor: t15 = r25?.accentColor ?? s3.accentColor.default, grayColor: i6 = r25?.resolvedGrayColor ?? s3.grayColor.default, panelBackground: u5 = r25?.panelBackground ?? s3.panelBackground.default, radius: h = r25?.radius ?? s3.radius.default, scaling: m6 = r25?.scaling ?? s3.scaling.default, onAppearanceChange: y = d2, onAccentColorChange: g3 = d2, onGrayColorChange: v3 = d2, onPanelBackgroundChange: C = d2, onRadiusChange: k = d2, onScalingChange: f11 = d2, ...B2 } = a16, x2 = c4 ? dist_exports.Root : "div", T2 = i6 === "auto" ? a3(t15) : i6, b2 = a16.appearance === "light" || a16.appearance === "dark", S2 = p14 === void 0 ? l7 || b2 : p14;
    return e12.createElement(P.Provider, { value: e12.useMemo(() => ({ appearance: n12, accentColor: t15, grayColor: i6, resolvedGrayColor: T2, panelBackground: u5, radius: h, scaling: m6, onAppearanceChange: y, onAccentColorChange: g3, onGrayColorChange: v3, onPanelBackgroundChange: C, onRadiusChange: k, onScalingChange: f11 }), [n12, t15, i6, T2, u5, h, m6, y, g3, v3, C, k, f11]) }, e12.createElement(x2, { "data-is-root-theme": l7 ? "true" : "false", "data-accent-color": t15, "data-gray-color": T2, "data-has-background": S2 ? "true" : "false", "data-panel-background": u5, "data-radius": h, "data-scaling": m6, ref: s11, ...B2, className: (0, import_classnames4.default)("radix-themes", { light: n12 === "light", dark: n12 === "dark" }, B2.className) }));
  });
  A.displayName = "ThemeImpl";

  // node_modules/@radix-ui/themes/dist/esm/helpers/require-react-element.js
  var o7 = __toESM(require_react(), 1);
  var a4 = (t15) => {
    if (!o7.isValidElement(t15)) throw Error(`Expected a single React Element child, but got: ${o7.Children.toArray(t15).map((e24) => typeof e24 == "object" && "type" in e24 && typeof e24.type == "string" ? e24.type : typeof e24).join(", ")}`);
    return t15;
  };

  // node_modules/@radix-ui/themes/dist/esm/helpers/get-subtree.js
  var a5 = __toESM(require_react(), 1);
  function d3(i6, e24) {
    const { asChild: r25, children: c4 } = i6;
    if (!r25) return typeof e24 == "function" ? e24(c4) : e24;
    const t15 = a5.Children.only(c4);
    return a5.cloneElement(t15, { children: typeof e24 == "function" ? e24(t15.props.children) : e24 });
  }

  // node_modules/@radix-ui/themes/dist/esm/components/badge.js
  var o8 = __toESM(require_react(), 1);
  var import_classnames5 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/badge.props.js
  var t5 = ["1", "2", "3"];
  var a6 = ["solid", "soft", "surface", "outline"];
  var p3 = { ...o, size: { type: "enum", className: "rt-r-size", values: t5, default: "1", responsive: true }, variant: { type: "enum", className: "rt-variant", values: a6, default: "soft" }, ...s2, ...o3, ...r9 };

  // node_modules/@radix-ui/themes/dist/esm/components/badge.js
  var e13 = o8.forwardRef((r25, p14) => {
    const { asChild: t15, className: s11, color: a16, radius: m6, ...n12 } = v(r25, p3, r7), d8 = t15 ? dist_exports.Root : "span";
    return o8.createElement(d8, { "data-accent-color": a16, "data-radius": m6, ...n12, ref: p14, className: (0, import_classnames5.default)("rt-reset", "rt-Badge", s11) });
  });
  e13.displayName = "Badge";

  // node_modules/@radix-ui/themes/dist/esm/components/box.js
  var o10 = __toESM(require_react(), 1);
  var import_classnames6 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/slot.js
  var l3 = dist_exports.Root;
  var e14 = dist_exports.Root;
  var r10 = dist_exports.Slottable;

  // node_modules/@radix-ui/themes/dist/esm/components/box.props.js
  var s4 = ["div", "span"];
  var o9 = ["none", "inline", "inline-block", "block", "contents"];
  var p4 = { as: { type: "enum", values: s4, default: "div" }, ...o, display: { type: "enum", className: "rt-r-display", values: o9, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/props/padding.props.js
  var e15 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var p5 = { p: { type: "enum | string", className: "rt-r-p", customProperties: ["--p"], values: e15, responsive: true }, px: { type: "enum | string", className: "rt-r-px", customProperties: ["--pl", "--pr"], values: e15, responsive: true }, py: { type: "enum | string", className: "rt-r-py", customProperties: ["--pt", "--pb"], values: e15, responsive: true }, pt: { type: "enum | string", className: "rt-r-pt", customProperties: ["--pt"], values: e15, responsive: true }, pr: { type: "enum | string", className: "rt-r-pr", customProperties: ["--pr"], values: e15, responsive: true }, pb: { type: "enum | string", className: "rt-r-pb", customProperties: ["--pb"], values: e15, responsive: true }, pl: { type: "enum | string", className: "rt-r-pl", customProperties: ["--pl"], values: e15, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/props/layout.props.js
  var r11 = ["visible", "hidden", "clip", "scroll", "auto"];
  var i = ["static", "relative", "absolute", "fixed", "sticky"];
  var e16 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9"];
  var p6 = ["0", "1"];
  var n4 = ["0", "1"];
  var a7 = ["start", "center", "end", "baseline", "stretch"];
  var u = ["start", "center", "end", "baseline", "stretch"];
  var l4 = { ...p5, ...t, ...e, position: { type: "enum", className: "rt-r-position", values: i, responsive: true }, inset: { type: "enum | string", className: "rt-r-inset", customProperties: ["--inset"], values: e16, responsive: true }, top: { type: "enum | string", className: "rt-r-top", customProperties: ["--top"], values: e16, responsive: true }, right: { type: "enum | string", className: "rt-r-right", customProperties: ["--right"], values: e16, responsive: true }, bottom: { type: "enum | string", className: "rt-r-bottom", customProperties: ["--bottom"], values: e16, responsive: true }, left: { type: "enum | string", className: "rt-r-left", customProperties: ["--left"], values: e16, responsive: true }, overflow: { type: "enum", className: "rt-r-overflow", values: r11, responsive: true }, overflowX: { type: "enum", className: "rt-r-ox", values: r11, responsive: true }, overflowY: { type: "enum", className: "rt-r-oy", values: r11, responsive: true }, flexBasis: { type: "string", className: "rt-r-fb", customProperties: ["--flex-basis"], responsive: true }, flexShrink: { type: "enum | string", className: "rt-r-fs", customProperties: ["--flex-shrink"], values: p6, responsive: true }, flexGrow: { type: "enum | string", className: "rt-r-fg", customProperties: ["--flex-grow"], values: n4, responsive: true }, gridArea: { type: "string", className: "rt-r-ga", customProperties: ["--grid-area"], responsive: true }, gridColumn: { type: "string", className: "rt-r-gc", customProperties: ["--grid-column"], responsive: true }, gridColumnStart: { type: "string", className: "rt-r-gcs", customProperties: ["--grid-column-start"], responsive: true }, gridColumnEnd: { type: "string", className: "rt-r-gce", customProperties: ["--grid-column-end"], responsive: true }, gridRow: { type: "string", className: "rt-r-gr", customProperties: ["--grid-row"], responsive: true }, gridRowStart: { type: "string", className: "rt-r-grs", customProperties: ["--grid-row-start"], responsive: true }, gridRowEnd: { type: "string", className: "rt-r-gre", customProperties: ["--grid-row-end"], responsive: true }, alignSelf: { type: "enum", className: "rt-r-as", values: a7, responsive: true }, justifySelf: { type: "enum", className: "rt-r-js", values: u, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/components/box.js
  var p7 = o10.forwardRef((r25, s11) => {
    const { className: t15, asChild: e24, as: m6 = "div", ...a16 } = v(r25, p4, l4, r7);
    return o10.createElement(e24 ? e14 : m6, { ...a16, ref: s11, className: (0, import_classnames6.default)("rt-Box", t15) });
  });
  p7.displayName = "Box";

  // node_modules/@radix-ui/themes/dist/esm/components/_internal/base-button.js
  var o13 = __toESM(require_react(), 1);
  var import_classnames9 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/_internal/base-button.props.js
  var t6 = ["1", "2", "3", "4"];
  var a8 = ["classic", "solid", "soft", "surface", "outline", "ghost"];
  var i2 = { ...o, size: { type: "enum", className: "rt-r-size", values: t6, default: "2", responsive: true }, variant: { type: "enum", className: "rt-variant", values: a8, default: "solid" }, ...s2, ...o3, ...r9, loading: { type: "boolean", className: "rt-loading", default: false } };

  // node_modules/@radix-ui/themes/dist/esm/components/flex.js
  var o12 = __toESM(require_react(), 1);
  var import_classnames7 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/props/gap.props.js
  var e17 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var p8 = { gap: { type: "enum | string", className: "rt-r-gap", customProperties: ["--gap"], values: e17, responsive: true }, gapX: { type: "enum | string", className: "rt-r-cg", customProperties: ["--column-gap"], values: e17, responsive: true }, gapY: { type: "enum | string", className: "rt-r-rg", customProperties: ["--row-gap"], values: e17, responsive: true } };

  // node_modules/@radix-ui/themes/dist/esm/components/flex.props.js
  var t7 = ["div", "span"];
  var p9 = ["none", "inline-flex", "flex"];
  var a9 = ["row", "column", "row-reverse", "column-reverse"];
  var o11 = ["start", "center", "end", "baseline", "stretch"];
  var n6 = ["start", "center", "end", "between"];
  var l5 = ["nowrap", "wrap", "wrap-reverse"];
  var u2 = { as: { type: "enum", values: t7, default: "div" }, ...o, display: { type: "enum", className: "rt-r-display", values: p9, responsive: true }, direction: { type: "enum", className: "rt-r-fd", values: a9, responsive: true }, align: { type: "enum", className: "rt-r-ai", values: o11, responsive: true }, justify: { type: "enum", className: "rt-r-jc", values: n6, parseValue: f2, responsive: true }, wrap: { type: "enum", className: "rt-r-fw", values: l5, responsive: true }, ...p8 };
  function f2(e24) {
    return e24 === "between" ? "space-between" : e24;
  }

  // node_modules/@radix-ui/themes/dist/esm/components/flex.js
  var p10 = o12.forwardRef((r25, e24) => {
    const { className: s11, asChild: t15, as: m6 = "div", ...l7 } = v(r25, u2, l4, r7);
    return o12.createElement(t15 ? e14 : m6, { ...l7, ref: e24, className: (0, import_classnames7.default)("rt-Flex", s11) });
  });
  p10.displayName = "Flex";

  // node_modules/@radix-ui/themes/dist/esm/components/spinner.js
  var n7 = __toESM(require_react(), 1);
  var import_classnames8 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/spinner.props.js
  var e18 = ["1", "2", "3"];
  var s5 = { size: { type: "enum", className: "rt-r-size", values: e18, default: "2", responsive: true }, loading: { type: "boolean", default: true } };

  // node_modules/@radix-ui/themes/dist/esm/components/spinner.js
  var s6 = n7.forwardRef((i6, o21) => {
    const { className: a16, children: e24, loading: t15, ...m6 } = v(i6, s5, r7);
    if (!t15) return e24;
    const r25 = n7.createElement("span", { ...m6, ref: o21, className: (0, import_classnames8.default)("rt-Spinner", a16) }, n7.createElement("span", { className: "rt-SpinnerLeaf" }), n7.createElement("span", { className: "rt-SpinnerLeaf" }), n7.createElement("span", { className: "rt-SpinnerLeaf" }), n7.createElement("span", { className: "rt-SpinnerLeaf" }), n7.createElement("span", { className: "rt-SpinnerLeaf" }), n7.createElement("span", { className: "rt-SpinnerLeaf" }), n7.createElement("span", { className: "rt-SpinnerLeaf" }), n7.createElement("span", { className: "rt-SpinnerLeaf" }));
    return e24 === void 0 ? r25 : n7.createElement(p10, { asChild: true, position: "relative", align: "center", justify: "center" }, n7.createElement("span", null, n7.createElement("span", { "aria-hidden": true, style: { display: "contents", visibility: "hidden" }, inert: void 0 }, e24), n7.createElement(p10, { asChild: true, align: "center", justify: "center", position: "absolute", inset: "0" }, n7.createElement("span", null, r25))));
  });
  s6.displayName = "Spinner";

  // node_modules/@radix-ui/themes/dist/esm/components/visually-hidden.js
  var d4 = dist_exports2.Root;
  var e19 = dist_exports2.Root;

  // node_modules/@radix-ui/themes/dist/esm/helpers/map-prop-values.js
  function s7(e24, t15) {
    if (e24 !== void 0) return typeof e24 == "string" ? t15(e24) : Object.fromEntries(Object.entries(e24).map(([n12, o21]) => [n12, t15(o21)]));
  }
  function r12(e24) {
    switch (e24) {
      case "1":
        return "1";
      case "2":
      case "3":
        return "2";
      case "4":
        return "3";
    }
  }

  // node_modules/@radix-ui/themes/dist/esm/components/_internal/base-button.js
  var n8 = o13.forwardRef((t15, p14) => {
    const { size: i6 = i2.size.default } = t15, { className: a16, children: e24, asChild: m6, color: d8, radius: l7, disabled: s11 = t15.loading, ...u5 } = v(t15, i2, r7), f11 = m6 ? dist_exports.Root : "button";
    return o13.createElement(f11, { "data-disabled": s11 || void 0, "data-accent-color": d8, "data-radius": l7, ...u5, ref: p14, className: (0, import_classnames9.default)("rt-reset", "rt-BaseButton", a16), disabled: s11 }, t15.loading ? o13.createElement(o13.Fragment, null, o13.createElement("span", { style: { display: "contents", visibility: "hidden" }, "aria-hidden": true }, e24), o13.createElement(d4, null, e24), o13.createElement(p10, { asChild: true, align: "center", justify: "center", position: "absolute", inset: "0" }, o13.createElement("span", null, o13.createElement(s6, { size: s7(i6, r12) })))) : e24);
  });
  n8.displayName = "BaseButton";

  // node_modules/@radix-ui/themes/dist/esm/components/card.js
  var r14 = __toESM(require_react(), 1);
  var import_classnames10 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/card.props.js
  var e20 = ["1", "2", "3", "4", "5"];
  var r13 = ["surface", "classic", "ghost"];
  var a11 = { ...o, size: { type: "enum", className: "rt-r-size", values: e20, default: "1", responsive: true }, variant: { type: "enum", className: "rt-variant", values: r13, default: "surface" } };

  // node_modules/@radix-ui/themes/dist/esm/components/card.js
  var o14 = r14.forwardRef((p14, e24) => {
    const { asChild: t15, className: s11, ...a16 } = v(p14, a11, r7), m6 = t15 ? dist_exports.Root : "div";
    return r14.createElement(m6, { ref: e24, ...a16, className: (0, import_classnames10.default)("rt-reset", "rt-BaseCard", "rt-Card", s11) });
  });
  o14.displayName = "Card";

  // node_modules/radix-ui/dist/internal.mjs
  var Primitive2 = Primitive;
  Primitive2.dispatchDiscreteCustomEvent = dispatchDiscreteCustomEvent;
  Primitive2.Root = Primitive;

  // node_modules/@radix-ui/themes/dist/esm/components/code.js
  var r15 = __toESM(require_react(), 1);
  var import_classnames11 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/code.props.js
  var a12 = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var i3 = ["solid", "soft", "outline", "ghost"];
  var f4 = { ...o, size: { type: "enum", className: "rt-r-size", values: a12, responsive: true }, variant: { type: "enum", className: "rt-variant", values: i3, default: "soft" }, ...t3, ...s2, ...o3, ...e6, ...r4 };

  // node_modules/@radix-ui/themes/dist/esm/components/code.js
  var p11 = r15.forwardRef((o21, t15) => {
    const { asChild: s11, className: m6, color: e24, ...d8 } = v(o21, f4, r7), n12 = o21.variant === "ghost" ? e24 || void 0 : e24, a16 = s11 ? dist_exports.Root : "code";
    return r15.createElement(a16, { "data-accent-color": n12, ...d8, ref: t15, className: (0, import_classnames11.default)("rt-reset", "rt-Code", m6) });
  });
  p11.displayName = "Code";

  // node_modules/@radix-ui/themes/dist/esm/components/scroll-area.js
  var r18 = __toESM(require_react(), 1);
  var import_classnames13 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/scroll-area.props.js
  var r16 = ["1", "2", "3"];
  var o15 = ["vertical", "horizontal", "both"];
  var t8 = { ...o, size: { type: "enum", className: "rt-r-size", values: r16, default: "1", responsive: true }, ...r9, scrollbars: { type: "enum", values: o15, default: "both" } };

  // node_modules/@radix-ui/themes/dist/esm/helpers/extract-margin-props.js
  function a13(r25) {
    const { m: t15, mx: m6, my: o21, mt: p14, mr: n12, mb: s11, ml: e24, ...i6 } = r25;
    return { m: t15, mx: m6, my: o21, mt: p14, mr: n12, mb: s11, ml: e24, rest: i6 };
  }

  // node_modules/@radix-ui/themes/dist/esm/helpers/get-margin-styles.js
  var import_classnames12 = __toESM(require_classnames(), 1);
  var r17 = r7.m.values;
  function S(s11) {
    const [e24, t15] = R({ className: "rt-r-m", customProperties: ["--margin"], propValues: r17, value: s11.m }), [a16, o21] = R({ className: "rt-r-mx", customProperties: ["--margin-left", "--margin-right"], propValues: r17, value: s11.mx }), [l7, i6] = R({ className: "rt-r-my", customProperties: ["--margin-top", "--margin-bottom"], propValues: r17, value: s11.my }), [p14, u5] = R({ className: "rt-r-mt", customProperties: ["--margin-top"], propValues: r17, value: s11.mt }), [n12, c4] = R({ className: "rt-r-mr", customProperties: ["--margin-right"], propValues: r17, value: s11.mr }), [g3, P3] = R({ className: "rt-r-mb", customProperties: ["--margin-bottom"], propValues: r17, value: s11.mb }), [N2, C] = R({ className: "rt-r-ml", customProperties: ["--margin-left"], propValues: r17, value: s11.ml });
    return [(0, import_classnames12.default)(e24, a16, l7, p14, n12, g3, N2), l2(t15, o21, i6, u5, c4, P3, C)];
  }

  // node_modules/@radix-ui/themes/dist/esm/components/scroll-area.js
  var c = r18.forwardRef((n12, S2) => {
    const { rest: f11, ...P3 } = a13(n12), [u5, A2] = S(P3), { asChild: a16, children: d8, className: y, style: v3, type: t15, scrollHideDelay: N2 = t15 !== "scroll" ? 0 : void 0, dir: V, size: i6 = t8.size.default, radius: p14 = t8.radius.default, scrollbars: l7 = t8.scrollbars.default, ...b2 } = f11;
    return r18.createElement(dist_exports6.Root, { type: t15, scrollHideDelay: N2, className: (0, import_classnames13.default)("rt-ScrollAreaRoot", u5, y), style: l2(A2, v3), asChild: a16 }, d3({ asChild: a16, children: d8 }, (g3) => r18.createElement(r18.Fragment, null, r18.createElement(dist_exports6.Viewport, { ...b2, ref: S2, className: "rt-ScrollAreaViewport" }, g3), r18.createElement("div", { className: "rt-ScrollAreaViewportFocusRing" }), l7 !== "vertical" ? r18.createElement(dist_exports6.Scrollbar, { "data-radius": p14, orientation: "horizontal", className: (0, import_classnames13.default)("rt-ScrollAreaScrollbar", g({ className: "rt-r-size", value: i6, propValues: t8.size.values })) }, r18.createElement(dist_exports6.Thumb, { className: "rt-ScrollAreaThumb" })) : null, l7 !== "horizontal" ? r18.createElement(dist_exports6.Scrollbar, { "data-radius": p14, orientation: "vertical", className: (0, import_classnames13.default)("rt-ScrollAreaScrollbar", g({ className: "rt-r-size", value: i6, propValues: t8.size.values })) }, r18.createElement(dist_exports6.Thumb, { className: "rt-ScrollAreaThumb" })) : null, l7 === "both" ? r18.createElement(dist_exports6.Corner, { className: "rt-ScrollAreaCorner" }) : null)));
  });
  c.displayName = "ScrollArea";

  // node_modules/@radix-ui/themes/dist/esm/components/dialog.js
  var dialog_exports = {};
  __export(dialog_exports, {
    Close: () => D,
    Content: () => p12,
    Description: () => m4,
    Root: () => s9,
    Title: () => g2,
    Trigger: () => n9
  });
  var o16 = __toESM(require_react(), 1);
  var import_classnames14 = __toESM(require_classnames(), 1);
  var s9 = (e24) => o16.createElement(dist_exports4.Root, { ...e24, modal: true });
  s9.displayName = "Dialog.Root";
  var n9 = o16.forwardRef(({ children: e24, ...i6 }, r25) => o16.createElement(dist_exports4.Trigger, { ...i6, ref: r25, asChild: true }, a4(e24)));
  n9.displayName = "Dialog.Trigger";
  var p12 = o16.forwardRef(({ align: e24, ...i6 }, r25) => {
    const { align: P3, ...f11 } = s, { className: C } = v({ align: e24 }, { align: P3 }), { className: d8, forceMount: c4, container: y, ...T2 } = v(i6, f11);
    return o16.createElement(dist_exports4.Portal, { container: y, forceMount: c4 }, o16.createElement(R2, { asChild: true }, o16.createElement(dist_exports4.Overlay, { className: "rt-BaseDialogOverlay rt-DialogOverlay" }, o16.createElement("div", { className: "rt-BaseDialogScroll rt-DialogScroll" }, o16.createElement("div", { className: `rt-BaseDialogScrollPadding rt-DialogScrollPadding ${C}` }, o16.createElement(dist_exports4.Content, { ...T2, ref: r25, className: (0, import_classnames14.default)("rt-BaseDialogContent", "rt-DialogContent", d8) }))))));
  });
  p12.displayName = "Dialog.Content";
  var g2 = o16.forwardRef((e24, i6) => o16.createElement(dist_exports4.Title, { asChild: true }, o16.createElement(r8, { size: "5", mb: "3", trim: "start", ...e24, asChild: false, ref: i6 })));
  g2.displayName = "Dialog.Title";
  var m4 = o16.forwardRef((e24, i6) => o16.createElement(dist_exports4.Description, { asChild: true }, o16.createElement(p, { as: "p", size: "3", ...e24, asChild: false, ref: i6 })));
  m4.displayName = "Dialog.Description";
  var D = o16.forwardRef(({ children: e24, ...i6 }, r25) => o16.createElement(dist_exports4.Close, { ...i6, ref: r25, asChild: true }, a4(e24)));
  D.displayName = "Dialog.Close";

  // node_modules/@radix-ui/themes/dist/esm/components/icon-button.js
  var t9 = __toESM(require_react(), 1);
  var import_classnames15 = __toESM(require_classnames(), 1);
  var o17 = t9.forwardRef(({ className: e24, ...n12 }, r25) => t9.createElement(n8, { ...n12, ref: r25, className: (0, import_classnames15.default)("rt-IconButton", e24) }));
  o17.displayName = "IconButton";

  // node_modules/@radix-ui/themes/dist/esm/components/kbd.js
  var o18 = __toESM(require_react(), 1);
  var import_classnames16 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/kbd.props.js
  var e21 = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var r19 = ["classic", "soft"];
  var t10 = { ...o, size: { type: "enum", className: "rt-r-size", values: e21, responsive: true }, variant: { type: "enum", className: "rt-variant", values: r19, default: "classic" } };

  // node_modules/@radix-ui/themes/dist/esm/components/kbd.js
  var r20 = o18.forwardRef((p14, e24) => {
    const { asChild: t15, className: s11, ...m6 } = v(p14, t10, r7), d8 = t15 ? dist_exports.Root : "kbd";
    return o18.createElement(d8, { ...m6, ref: e24, className: (0, import_classnames16.default)("rt-reset", "rt-Kbd", s11) });
  });
  r20.displayName = "Kbd";

  // node_modules/@radix-ui/themes/dist/esm/components/separator.js
  var r22 = __toESM(require_react(), 1);
  var import_classnames17 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/separator.props.js
  var e22 = ["horizontal", "vertical"];
  var r21 = ["1", "2", "3", "4"];
  var t11 = { orientation: { type: "enum", className: "rt-r-orientation", values: e22, default: "horizontal", responsive: true }, size: { type: "enum", className: "rt-r-size", values: r21, default: "1", responsive: true }, color: { ...r2.color, default: "gray" }, decorative: { type: "boolean", default: true } };

  // node_modules/@radix-ui/themes/dist/esm/components/separator.js
  var o19 = r22.forwardRef((p14, e24) => {
    const { className: t15, color: a16, decorative: s11, ...m6 } = v(p14, t11, r7);
    return r22.createElement("span", { "data-accent-color": a16, role: s11 ? void 0 : "separator", ...m6, ref: e24, className: (0, import_classnames17.default)("rt-Separator", t15) });
  });
  o19.displayName = "Separator";

  // node_modules/@radix-ui/themes/dist/esm/components/table.js
  var table_exports = {};
  __export(table_exports, {
    Body: () => b,
    Cell: () => T,
    ColumnHeaderCell: () => f9,
    Header: () => d6,
    Root: () => m5,
    Row: () => P2,
    RowHeaderCell: () => R3
  });
  var e23 = __toESM(require_react(), 1);
  var import_classnames18 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/table.props.js
  var r23 = ["1", "2", "3"];
  var a14 = ["surface", "ghost"];
  var o20 = ["auto", "fixed"];
  var n11 = { size: { type: "enum", className: "rt-r-size", values: r23, default: "2", responsive: true }, variant: { type: "enum", className: "rt-variant", values: a14, default: "ghost" }, layout: { type: "enum", className: "rt-r-tl", values: o20, responsive: true } };
  var i4 = ["start", "center", "end", "baseline"];
  var u3 = { align: { type: "enum", className: "rt-r-va", values: i4, parseValue: l6, responsive: true } };
  function l6(e24) {
    return { baseline: "baseline", start: "top", center: "middle", end: "bottom" }[e24];
  }
  var p13 = ["start", "center", "end"];
  var f8 = { justify: { type: "enum", className: "rt-r-ta", values: p13, parseValue: c2, responsive: true }, ...t, ...p5 };
  function c2(e24) {
    return { start: "left", center: "center", end: "right" }[e24];
  }

  // node_modules/@radix-ui/themes/dist/esm/components/table.js
  var m5 = e23.forwardRef((o21, l7) => {
    const { layout: a16, ...r25 } = n11, { className: C, children: c4, layout: y, ...i6 } = v(o21, r25, r7), w = g({ value: y, className: n11.layout.className, propValues: n11.layout.values });
    return e23.createElement("div", { ref: l7, className: (0, import_classnames18.default)("rt-TableRoot", C), ...i6 }, e23.createElement(c, null, e23.createElement("table", { className: (0, import_classnames18.default)("rt-TableRootTable", w) }, c4)));
  });
  m5.displayName = "Table.Root";
  var d6 = e23.forwardRef(({ className: o21, ...l7 }, a16) => e23.createElement("thead", { ...l7, ref: a16, className: (0, import_classnames18.default)("rt-TableHeader", o21) }));
  d6.displayName = "Table.Header";
  var b = e23.forwardRef(({ className: o21, ...l7 }, a16) => e23.createElement("tbody", { ...l7, ref: a16, className: (0, import_classnames18.default)("rt-TableBody", o21) }));
  b.displayName = "Table.Body";
  var P2 = e23.forwardRef((o21, l7) => {
    const { className: a16, ...r25 } = v(o21, u3);
    return e23.createElement("tr", { ...r25, ref: l7, className: (0, import_classnames18.default)("rt-TableRow", a16) });
  });
  P2.displayName = "Table.Row";
  var T = e23.forwardRef((o21, l7) => {
    const { className: a16, ...r25 } = v(o21, f8);
    return e23.createElement("td", { className: (0, import_classnames18.default)("rt-TableCell", a16), ref: l7, ...r25 });
  });
  T.displayName = "Table.Cell";
  var f9 = e23.forwardRef((o21, l7) => {
    const { className: a16, ...r25 } = v(o21, f8);
    return e23.createElement("th", { className: (0, import_classnames18.default)("rt-TableCell", "rt-TableColumnHeaderCell", a16), scope: "col", ref: l7, ...r25 });
  });
  f9.displayName = "Table.ColumnHeaderCell";
  var R3 = e23.forwardRef((o21, l7) => {
    const { className: a16, ...r25 } = v(o21, f8);
    return e23.createElement("th", { className: (0, import_classnames18.default)("rt-TableCell", "rt-TableRowHeaderCell", a16), scope: "row", ref: l7, ...r25 });
  });
  R3.displayName = "Table.RowHeaderCell";

  // node_modules/@radix-ui/themes/dist/esm/components/text-field.js
  var text_field_exports = {};
  __export(text_field_exports, {
    Root: () => u4,
    Slot: () => c3
  });
  var t14 = __toESM(require_react(), 1);
  var import_classnames19 = __toESM(require_classnames(), 1);

  // node_modules/@radix-ui/themes/dist/esm/components/text-field.props.js
  var r24 = ["1", "2", "3"];
  var t13 = ["classic", "surface", "soft"];
  var f10 = { size: { type: "enum", className: "rt-r-size", values: r24, default: "2", responsive: true }, variant: { type: "enum", className: "rt-variant", values: t13, default: "surface" }, ...r2, ...r9 };
  var a15 = ["left", "right"];
  var i5 = { side: { type: "enum", values: a15 }, ...r2, gap: u2.gap, px: p5.px, pl: p5.pl, pr: p5.pr };

  // node_modules/@radix-ui/themes/dist/esm/components/text-field.js
  var u4 = t14.forwardRef((r25, s11) => {
    const e24 = t14.useRef(null), { children: l7, className: i6, color: p14, radius: f11, style: x2, ...P3 } = v(r25, f10, r7);
    return t14.createElement("div", { "data-accent-color": p14, "data-radius": f11, style: x2, className: (0, import_classnames19.default)("rt-TextFieldRoot", i6), onPointerDown: (T2) => {
      const n12 = T2.target;
      if (n12.closest("input, button, a")) return;
      const o21 = e24.current;
      if (!o21) return;
      const a16 = n12.closest(`
            .rt-TextFieldSlot[data-side='right'],
            .rt-TextFieldSlot:not([data-side='right']) ~ .rt-TextFieldSlot:not([data-side='left'])
          `) ? o21.value.length : 0;
      requestAnimationFrame(() => {
        try {
          o21.setSelectionRange(a16, a16);
        } catch {
        }
        o21.focus();
      });
    } }, t14.createElement("input", { spellCheck: "false", ...P3, ref: composeRefs(e24, s11), className: "rt-reset rt-TextFieldInput" }), l7);
  });
  u4.displayName = "TextField.Root";
  var c3 = t14.forwardRef((r25, s11) => {
    const { className: e24, color: l7, side: i6, ...p14 } = v(r25, i5);
    return t14.createElement("div", { "data-accent-color": l7, "data-side": i6, ...p14, ref: s11, className: (0, import_classnames19.default)("rt-TextFieldSlot", e24) });
  });
  c3.displayName = "TextField.Slot";

  // src/Layout.jsx
  var import_react4 = __toESM(require_react());

  // node_modules/@radix-ui/react-icons/dist/react-icons.esm.js
  var import_react3 = __toESM(require_react());
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i6;
    for (i6 = 0; i6 < sourceKeys.length; i6++) {
      key = sourceKeys[i6];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  var _excluded$W = ["color"];
  var ChevronDownIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$W);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$Y = ["color"];
  var ChevronRightIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$Y);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$1q = ["color"];
  var Cross1Icon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$1q);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$2s = ["color"];
  var HamburgerMenuIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$2s);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$2z = ["color"];
  var HomeIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$2z);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$33 = ["color"];
  var MagnifyingGlassIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$33);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$3e = ["color"];
  var MoonIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$3e);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8885C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.8891 5.82642C13.8213 5.56709 13.7382 5.31398 13.6409 5.06881L13.5279 4.80132L13.4507 4.63542L13.3766 4.48666C13.2178 4.17773 13.0353 3.88295 12.8312 3.60423L12.6782 3.40352L12.4793 3.16432L12.3157 2.98361L12.1961 2.85951L12.0355 2.70246L11.8134 2.50184L11.4925 2.24191L11.2483 2.06498L10.9562 1.87446L10.6346 1.68894L10.3073 1.52378L10.1938 1.47176L9.95488 1.3706L9.67791 1.2669L9.42566 1.1846L9.10075 1.09489L8.83599 1.03486L8.54406 0.98184ZM10.4032 5.30023C10.4032 4.27588 10.2002 3.29829 9.83244 2.40604C11.7623 3.28995 13.1032 5.23862 13.1032 7.50023C13.1032 10.593 10.596 13.1002 7.50322 13.1002C6.63646 13.1002 5.81597 12.9036 5.08355 12.5522C6.5419 12.0941 7.81081 11.2082 8.74322 10.0416C8.87963 10.2284 9.10028 10.3497 9.34928 10.3497C9.76349 10.3497 10.0993 10.0139 10.0993 9.59971C10.0993 9.24256 9.84965 8.94373 9.51535 8.86816C9.57741 8.75165 9.63653 8.63334 9.6926 8.51332C9.88358 8.63163 10.1088 8.69993 10.35 8.69993C11.0403 8.69993 11.6 8.14028 11.6 7.44993C11.6 6.75976 11.0406 6.20024 10.3505 6.19993C10.3853 5.90487 10.4032 5.60464 10.4032 5.30023Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$3H = ["color"];
  var RocketIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$3H);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M6.85357 3.85355L7.65355 3.05353C8.2981 2.40901 9.42858 1.96172 10.552 1.80125C11.1056 1.72217 11.6291 1.71725 12.0564 1.78124C12.4987 1.84748 12.7698 1.97696 12.8965 2.10357C13.0231 2.23018 13.1526 2.50125 13.2188 2.94357C13.2828 3.37086 13.2779 3.89439 13.1988 4.44801C13.0383 5.57139 12.591 6.70188 11.9464 7.34645L7.49999 11.7929L6.35354 10.6465C6.15827 10.4512 5.84169 10.4512 5.64643 10.6465C5.45117 10.8417 5.45117 11.1583 5.64643 11.3536L7.14644 12.8536C7.34171 13.0488 7.65829 13.0488 7.85355 12.8536L8.40073 12.3064L9.57124 14.2572C9.65046 14.3893 9.78608 14.4774 9.9389 14.4963C10.0917 14.5151 10.2447 14.4624 10.3535 14.3536L12.3535 12.3536C12.4648 12.2423 12.5172 12.0851 12.495 11.9293L12.0303 8.67679L12.6536 8.05355C13.509 7.19808 14.0117 5.82855 14.1887 4.58943C14.2784 3.9618 14.2891 3.33847 14.2078 2.79546C14.1287 2.26748 13.9519 1.74482 13.6035 1.39645C13.2552 1.04809 12.7325 0.871332 12.2045 0.792264C11.6615 0.710945 11.0382 0.721644 10.4105 0.8113C9.17143 0.988306 7.80189 1.491 6.94644 2.34642L6.32322 2.96968L3.07071 2.50504C2.91492 2.48278 2.75773 2.53517 2.64645 2.64646L0.646451 4.64645C0.537579 4.75533 0.484938 4.90829 0.50375 5.0611C0.522563 5.21391 0.61073 5.34954 0.742757 5.42876L2.69364 6.59928L2.14646 7.14645C2.0527 7.24022 2.00002 7.3674 2.00002 7.50001C2.00002 7.63261 2.0527 7.75979 2.14646 7.85356L3.64647 9.35356C3.84173 9.54883 4.15831 9.54883 4.35357 9.35356C4.54884 9.1583 4.54884 8.84172 4.35357 8.64646L3.20712 7.50001L3.85357 6.85356L6.85357 3.85355ZM10.0993 13.1936L9.12959 11.5775L11.1464 9.56067L11.4697 11.8232L10.0993 13.1936ZM3.42251 5.87041L5.43935 3.85356L3.17678 3.53034L1.80638 4.90074L3.42251 5.87041ZM2.35356 10.3535C2.54882 10.1583 2.54882 9.8417 2.35356 9.64644C2.1583 9.45118 1.84171 9.45118 1.64645 9.64644L0.646451 10.6464C0.451188 10.8417 0.451188 11.1583 0.646451 11.3535C0.841713 11.5488 1.1583 11.5488 1.35356 11.3535L2.35356 10.3535ZM3.85358 11.8536C4.04884 11.6583 4.04885 11.3417 3.85359 11.1465C3.65833 10.9512 3.34175 10.9512 3.14648 11.1465L1.14645 13.1464C0.95119 13.3417 0.951187 13.6583 1.14645 13.8535C1.34171 14.0488 1.65829 14.0488 1.85355 13.8536L3.85358 11.8536ZM5.35356 13.3535C5.54882 13.1583 5.54882 12.8417 5.35356 12.6464C5.1583 12.4512 4.84171 12.4512 4.64645 12.6464L3.64645 13.6464C3.45119 13.8417 3.45119 14.1583 3.64645 14.3535C3.84171 14.5488 4.1583 14.5488 4.35356 14.3535L5.35356 13.3535ZM9.49997 6.74881C10.1897 6.74881 10.7488 6.1897 10.7488 5.5C10.7488 4.8103 10.1897 4.25118 9.49997 4.25118C8.81026 4.25118 8.25115 4.8103 8.25115 5.5C8.25115 6.1897 8.81026 6.74881 9.49997 6.74881Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$4i = ["color"];
  var SunIcon = /* @__PURE__ */ (0, import_react3.forwardRef)(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$4i);
    return (0, import_react3.createElement)("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), (0, import_react3.createElement)("path", {
      d: "M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });

  // src/constants.js
  var KIND_COLORS = {
    class: "red",
    interface: "orange",
    mixin: "plum",
    namespace: "green",
    function: "green",
    object: "cyan",
    constant: "blue",
    property: "blue",
    typedef: "orange",
    event: "plum"
  };

  // src/Layout.jsx
  var import_jsx_runtime14 = __toESM(require_jsx_runtime());
  var MIN_SIDEBAR = 200;
  var MAX_SIDEBAR = 480;
  var DEFAULT_SIDEBAR = 280;
  function truncateHtml(html, maxLen) {
    const plain = html.replace(/<[^>]*>/g, "");
    return plain.length > maxLen ? plain.slice(0, maxLen) + "\u2026" : plain;
  }
  function Layout({ docs: docs2, currentSlug, onNavigate, appearance, onToggleAppearance, children }) {
    const [searchOpen, setSearchOpen] = (0, import_react4.useState)(false);
    const [searchQuery, setSearchQuery] = (0, import_react4.useState)("");
    const [activeIndex, setActiveIndex] = (0, import_react4.useState)(0);
    const [mobileOpen, setMobileOpen] = (0, import_react4.useState)(false);
    const [sidebarWidth, setSidebarWidth] = (0, import_react4.useState)(() => {
      try {
        const saved = localStorage.getItem("jsdoc-sidebar-width");
        if (saved) return Math.min(Math.max(Number(saved), MIN_SIDEBAR), MAX_SIDEBAR);
      } catch (_) {
      }
      return DEFAULT_SIDEBAR;
    });
    const [isResizing, setIsResizing] = (0, import_react4.useState)(false);
    const searchInputRef = (0, import_react4.useRef)(null);
    const sidebarScrollRef = (0, import_react4.useRef)(null);
    (0, import_react4.useEffect)(() => {
      try {
        localStorage.setItem("jsdoc-sidebar-width", String(sidebarWidth));
      } catch (_) {
      }
    }, [sidebarWidth]);
    const handleResizeStart = (0, import_react4.useCallback)((e24) => {
      e24.preventDefault();
      setIsResizing(true);
      const startX = e24.clientX;
      const startWidth = sidebarWidth;
      const onMouseMove = (e25) => {
        const newWidth = Math.min(Math.max(startWidth + (e25.clientX - startX), MIN_SIDEBAR), MAX_SIDEBAR);
        setSidebarWidth(newWidth);
      };
      const onMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }, [sidebarWidth]);
    (0, import_react4.useEffect)(() => {
      const handler = (e24) => {
        if ((e24.metaKey || e24.ctrlKey) && e24.key === "k") {
          e24.preventDefault();
          setSearchOpen(true);
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, []);
    const searchResults = (0, import_react4.useMemo)(() => {
      if (!searchQuery.trim()) return [];
      return docs2.search(searchQuery).slice(0, 15);
    }, [searchQuery, docs2]);
    const handleSearchKeyDown = (0, import_react4.useCallback)((e24) => {
      if (e24.key === "ArrowDown") {
        e24.preventDefault();
        setActiveIndex((i6) => Math.min(i6 + 1, searchResults.length - 1));
      } else if (e24.key === "ArrowUp") {
        e24.preventDefault();
        setActiveIndex((i6) => Math.max(i6 - 1, 0));
      } else if (e24.key === "Enter" && searchResults[activeIndex]) {
        const result = searchResults[activeIndex];
        onNavigate(result.pageSlug);
        setSearchOpen(false);
        setSearchQuery("");
        if (result.anchor) {
          setTimeout(() => {
            document.getElementById(result.anchor)?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    }, [searchResults, activeIndex, onNavigate]);
    const handleNavClick = (0, import_react4.useCallback)((slug) => {
      onNavigate(slug);
      setMobileOpen(false);
    }, [onNavigate]);
    const scrollToSection = (0, import_react4.useCallback)((title) => {
      const el = document.getElementById("nav-section-" + title.replace(/\s+/g, "-"));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, []);
    (0, import_react4.useEffect)(() => {
      if (!currentSlug || currentSlug === "home") return;
      const el = document.getElementById("nav-item-" + currentSlug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, [currentSlug]);
    const sectionTitles = (0, import_react4.useMemo)(() => {
      return docs2.nav.map((g3) => g3.title);
    }, [docs2.nav]);
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p10, { className: `app-layout ${isResizing ? "app-layout--resizing" : ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        o17,
        {
          className: "mobile-toggle",
          variant: "ghost",
          color: "gray",
          size: "3",
          onClick: () => setMobileOpen(!mobileOpen),
          children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Cross1Icon, {}) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(HamburgerMenuIcon, {})
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
        p7,
        {
          className: `sidebar ${mobileOpen ? "sidebar--open" : ""}`,
          style: { width: sidebarWidth, minWidth: sidebarWidth },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p10, { direction: "column", height: "100%", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p10, { className: "sidebar-brand", align: "center", justify: "between", p: "4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p10, { align: "center", gap: "3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p7, { className: "sidebar-logo", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p10, { direction: "column", gap: "0", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "2", weight: "bold", className: "sidebar-title", children: docs2.packageInfo?.name || "API Docs" }),
                    docs2.packageInfo?.version && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "1", color: "gray", children: docs2.packageInfo.version })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                  o17,
                  {
                    variant: "ghost",
                    color: "gray",
                    size: "2",
                    onClick: onToggleAppearance,
                    title: appearance === "dark" ? "Switch to light mode" : "Switch to dark mode",
                    className: "theme-toggle",
                    children: appearance === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SunIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MoonIcon, {})
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p7, { px: "3", pb: "3", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                "button",
                {
                  className: "search-trigger",
                  onClick: () => setSearchOpen(true),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MagnifyingGlassIcon, {}),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: "Search docs..." }),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(r20, { size: "1", children: "\u2318K" })
                  ]
                }
              ) }),
              sectionTitles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p7, { px: "3", pb: "2", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p10, { wrap: "wrap", gap: "1", children: sectionTitles.map((title) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                "button",
                {
                  className: "section-jump",
                  onClick: () => scrollToSection(title),
                  children: title.toUpperCase()
                },
                title
              )) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(o19, { size: "4" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(c, { className: "sidebar-scroll", ref: sidebarScrollRef, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p7, { p: "3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                  "a",
                  {
                    href: "#home",
                    className: `nav-link ${currentSlug === "home" ? "nav-link--active" : ""}`,
                    onClick: (e24) => {
                      e24.preventDefault();
                      handleNavClick("home");
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(HomeIcon, {}),
                      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "2", children: "Overview" })
                    ]
                  }
                ),
                docs2.nav.map((group) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p7, { mt: "4", id: "nav-section-" + group.title.replace(/\s+/g, "-"), children: [
                  /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "nav-group-title", children: [
                    group.title,
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "nav-group-count", children: group.items.length })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p10, { direction: "column", gap: "0", mt: "1", children: group.items.map((item) => {
                    const isActive = currentSlug === item.slug;
                    return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      "a",
                      {
                        id: `nav-item-${item.slug}`,
                        href: `#${item.slug}`,
                        className: `nav-link ${isActive ? "nav-link--active" : ""}`,
                        onClick: (e24) => {
                          e24.preventDefault();
                          handleNavClick(item.slug);
                        },
                        children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "2", children: item.name })
                      },
                      item.slug
                    );
                  }) })
                ] }, group.title))
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "div",
              {
                className: "sidebar-resize-handle",
                onMouseDown: handleResizeStart,
                onDoubleClick: () => setSidebarWidth(DEFAULT_SIDEBAR)
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p7, { className: "main-content", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(c, { className: "main-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p7, { className: "content-inner", p: "5", pb: "9", children }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(dialog_exports.Root, { open: searchOpen, onOpenChange: setSearchOpen, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(dialog_exports.Content, { className: "search-dialog", size: "3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p10, { align: "center", gap: "2", className: "search-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MagnifyingGlassIcon, { width: "18", height: "18" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            text_field_exports.Root,
            {
              ref: searchInputRef,
              placeholder: "Search documentation...",
              value: searchQuery,
              onChange: (e24) => {
                setSearchQuery(e24.target.value);
                setActiveIndex(0);
              },
              onKeyDown: handleSearchKeyDown,
              size: "3",
              variant: "surface",
              className: "search-input"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(r20, { size: "1", children: "esc" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(o19, { size: "4" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p7, { className: "search-results", py: "2", children: !searchQuery.trim() ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "2", color: "gray", align: "center", className: "search-hint", children: "Type to search across all documentation..." }) : searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "2", color: "gray", align: "center", className: "search-hint", children: "No results found." }) : searchResults.map((result, i6) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
          "a",
          {
            href: `#${result.pageSlug}`,
            className: `search-result ${i6 === activeIndex ? "search-result--active" : ""}`,
            onClick: (e24) => {
              e24.preventDefault();
              onNavigate(result.pageSlug);
              setSearchOpen(false);
              setSearchQuery("");
              if (result.anchor) {
                setTimeout(() => {
                  document.getElementById(result.anchor)?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            },
            onMouseEnter: () => setActiveIndex(i6),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(p10, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                  e13,
                  {
                    variant: "surface",
                    color: KIND_COLORS[result.entry.kind] || "gray",
                    size: "1",
                    children: result.entry.kind
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "2", weight: "medium", children: result.entry.name })
              ] }),
              result.entry.description && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(p, { size: "1", color: "gray", className: "search-result-desc", children: truncateHtml(result.entry.description, 100) })
            ]
          },
          `${result.pageSlug}-${result.entry.name}-${i6}`
        )) })
      ] }) })
    ] });
  }

  // src/HomePage.jsx
  var import_jsx_runtime15 = __toESM(require_jsx_runtime());
  function HomePage({ readme, packageInfo }) {
    const title = packageInfo?.name || "API Documentation";
    const version = packageInfo?.version;
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(p7, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(p7, { className: "hero-section", mb: "6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(p10, { align: "center", gap: "3", mb: "2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(p7, { className: "hero-icon", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(RocketIcon, { width: "24", height: "24" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(r8, { size: "8", weight: "bold", className: "hero-title", children: title }),
          version && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(e13, { variant: "surface", color: "red", size: "2", children: version })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(p, { size: "3", color: "gray", className: "hero-subtitle", children: "API Reference & Documentation" })
      ] }),
      readme ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(p7, { className: "readme-content", dangerouslySetInnerHTML: { __html: readme } }) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(p7, { className: "empty-state", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(p, { size: "3", color: "gray", children: "Use the sidebar to navigate through the API documentation." }) })
    ] });
  }

  // src/EntityPage.jsx
  var import_react6 = __toESM(require_react());

  // node_modules/highlight.js/es/core.js
  var import_core2 = __toESM(require_core(), 1);
  var core_default = import_core2.default;

  // node_modules/highlight.js/es/languages/javascript.js
  var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
  var KEYWORDS = [
    "as",
    // for exports
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    // JS handles these with a special rule
    // "get",
    // "set",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
    // It's reached stage 3, which is "recommended for implementation":
    "using"
  ];
  var LITERALS = [
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity"
  ];
  var TYPES = [
    // Fundamental objects
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    // numbers and dates
    "Math",
    "Date",
    "Number",
    "BigInt",
    // text
    "String",
    "RegExp",
    // Indexed collections
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    // Keyed collections
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    // Structured data
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    // Control abstraction objects
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    // Reflection
    "Reflect",
    "Proxy",
    // Internationalization
    "Intl",
    // WebAssembly
    "WebAssembly"
  ];
  var ERROR_TYPES = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError"
  ];
  var BUILT_IN_GLOBALS = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape"
  ];
  var BUILT_IN_VARIABLES = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "module",
    "global"
    // Node.js
  ];
  var BUILT_INS = [].concat(
    BUILT_IN_GLOBALS,
    TYPES,
    ERROR_TYPES
  );
  function javascript(hljs) {
    const regex = hljs.regex;
    const hasClosingTag = (match, { after }) => {
      const tag = "</" + match[0].slice(1);
      const pos = match.input.indexOf(tag, after);
      return pos !== -1;
    };
    const IDENT_RE$1 = IDENT_RE;
    const FRAGMENT = {
      begin: "<>",
      end: "</>"
    };
    const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
    const XML_TAG = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      /**
       * @param {RegExpMatchArray} match
       * @param {CallbackResponse} response
       */
      isTrulyOpeningTag: (match, response) => {
        const afterMatchIndex = match[0].length + match.index;
        const nextChar = match.input[afterMatchIndex];
        if (
          // HTML should not include another raw `<` inside a tag
          // nested type?
          // `<Array<Array<number>>`, etc.
          nextChar === "<" || // the , gives away that this is not HTML
          // `<T, A extends keyof T, V>`
          nextChar === ","
        ) {
          response.ignoreMatch();
          return;
        }
        if (nextChar === ">") {
          if (!hasClosingTag(match, { after: afterMatchIndex })) {
            response.ignoreMatch();
          }
        }
        let m6;
        const afterMatch = match.input.substring(afterMatchIndex);
        if (m6 = afterMatch.match(/^\s*=/)) {
          response.ignoreMatch();
          return;
        }
        if (m6 = afterMatch.match(/^\s+extends\s+/)) {
          if (m6.index === 0) {
            response.ignoreMatch();
            return;
          }
        }
      }
    };
    const KEYWORDS$1 = {
      $pattern: IDENT_RE,
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: BUILT_INS,
      "variable.language": BUILT_IN_VARIABLES
    };
    const decimalDigits = "[0-9](_?[0-9])*";
    const frac = `\\.(${decimalDigits})`;
    const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
    const NUMBER = {
      className: "number",
      variants: [
        // DecimalLiteral
        { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
        { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
        // DecimalBigIntegerLiteral
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        // NonDecimalIntegerLiteral
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        // LegacyOctalIntegerLiteral (does not include underscore separators)
        // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
        { begin: "\\b0[0-7]+n?\\b" }
      ],
      relevance: 0
    };
    const SUBST = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: KEYWORDS$1,
      contains: []
      // defined later
    };
    const HTML_TEMPLATE = {
      begin: ".?html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "xml"
      }
    };
    const CSS_TEMPLATE = {
      begin: ".?css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "css"
      }
    };
    const GRAPHQL_TEMPLATE = {
      begin: ".?gql`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "graphql"
      }
    };
    const TEMPLATE_STRING = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ]
    };
    const JSDOC_COMMENT = hljs.COMMENT(
      /\/\*\*(?!\/)/,
      "\\*/",
      {
        relevance: 0,
        contains: [
          {
            begin: "(?=@[A-Za-z]+)",
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              },
              {
                className: "type",
                begin: "\\{",
                end: "\\}",
                excludeEnd: true,
                excludeBegin: true,
                relevance: 0
              },
              {
                className: "variable",
                begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                endsParent: true,
                relevance: 0
              },
              // eat spaces (not newlines) so we can find
              // types or variables
              {
                begin: /(?=[^\n])\s/,
                relevance: 0
              }
            ]
          }
        ]
      }
    );
    const COMMENT = {
      className: "comment",
      variants: [
        JSDOC_COMMENT,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_LINE_COMMENT_MODE
      ]
    };
    const SUBST_INTERNALS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER
      // This is intentional:
      // See https://github.com/highlightjs/highlight.js/issues/3288
      // hljs.REGEXP_MODE
    ];
    SUBST.contains = SUBST_INTERNALS.concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
    const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
    const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
      // eat recursive parens in sub expressions
      {
        begin: /(\s*)\(/,
        end: /\)/,
        keywords: KEYWORDS$1,
        contains: ["self"].concat(SUBST_AND_COMMENTS)
      }
    ]);
    const PARAMS = {
      className: "params",
      // convert this to negative lookbehind in v12
      begin: /(\s*)\(/,
      // to match the parms with
      end: /\)/,
      excludeBegin: true,
      excludeEnd: true,
      keywords: KEYWORDS$1,
      contains: PARAMS_CONTAINS
    };
    const CLASS_OR_EXTENDS = {
      variants: [
        // class Car extends vehicle
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1,
            /\s+/,
            /extends/,
            /\s+/,
            regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited"
          }
        },
        // class Car
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        }
      ]
    };
    const CLASS_REFERENCE = {
      relevance: 0,
      match: regex.either(
        // Hard coded exceptions
        /\bJSON/,
        // Float32Array, OutT
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        // CSSFactory, CSSFactoryT
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        // FPs, FPsT
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
        // P
        // single letters are not highlighted
        // BLAH
        // this will be flagged as a UPPER_CASE_CONSTANT instead
      ),
      className: "title.class",
      keywords: {
        _: [
          // se we still get relevance credit for JS library classes
          ...TYPES,
          ...ERROR_TYPES
        ]
      }
    };
    const USE_STRICT = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    };
    const FUNCTION_DEFINITION = {
      variants: [
        {
          match: [
            /function/,
            /\s+/,
            IDENT_RE$1,
            /(?=\s*\()/
          ]
        },
        // anonymous function
        {
          match: [
            /function/,
            /\s*(?=\()/
          ]
        }
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      label: "func.def",
      contains: [PARAMS],
      illegal: /%/
    };
    const UPPER_CASE_CONSTANT = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    };
    function noneOf(list) {
      return regex.concat("(?!", list.join("|"), ")");
    }
    const FUNCTION_CALL = {
      match: regex.concat(
        /\b/,
        noneOf([
          ...BUILT_IN_GLOBALS,
          "super",
          "import"
        ].map((x2) => `${x2}\\s*\\(`)),
        IDENT_RE$1,
        regex.lookahead(/\s*\(/)
      ),
      className: "title.function",
      relevance: 0
    };
    const PROPERTY_ACCESS = {
      begin: regex.concat(/\./, regex.lookahead(
        regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
      )),
      end: IDENT_RE$1,
      excludeBegin: true,
      keywords: "prototype",
      className: "property",
      relevance: 0
    };
    const GETTER_OR_SETTER = {
      match: [
        /get|set/,
        /\s+/,
        IDENT_RE$1,
        /(?=\()/
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        {
          // eat to avoid empty params
          begin: /\(\)/
        },
        PARAMS
      ]
    };
    const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
    const FUNCTION_VARIABLE = {
      match: [
        /const|var|let/,
        /\s+/,
        IDENT_RE$1,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        // async is optional
        regex.lookahead(FUNC_LEAD_IN_RE)
      ],
      keywords: "async",
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        PARAMS
      ]
    };
    return {
      name: "JavaScript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: KEYWORDS$1,
      // this will be extended by TypeScript
      exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
      illegal: /#(?![$_A-z])/,
      contains: [
        hljs.SHEBANG({
          label: "shebang",
          binary: "node",
          relevance: 5
        }),
        USE_STRICT,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        GRAPHQL_TEMPLATE,
        TEMPLATE_STRING,
        COMMENT,
        // Skip numbers when they are part of a variable name
        { match: /\$\d+/ },
        NUMBER,
        CLASS_REFERENCE,
        {
          scope: "attr",
          match: IDENT_RE$1 + regex.lookahead(":"),
          relevance: 0
        },
        FUNCTION_VARIABLE,
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            COMMENT,
            hljs.REGEXP_MODE,
            {
              className: "function",
              // we have to count the parens to make sure we actually have the
              // correct bounding ( ) before the =>.  There could be any number of
              // sub-expressions inside also surrounded by parens.
              begin: FUNC_LEAD_IN_RE,
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: hljs.UNDERSCORE_IDENT_RE,
                      relevance: 0
                    },
                    {
                      className: null,
                      begin: /\(\s*\)/,
                      skip: true
                    },
                    {
                      begin: /(\s*)\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS$1,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // could be a comma delimited list of params to a function call
              begin: /,/,
              relevance: 0
            },
            {
              match: /\s+/,
              relevance: 0
            },
            {
              // JSX
              variants: [
                { begin: FRAGMENT.begin, end: FRAGMENT.end },
                { match: XML_SELF_CLOSING },
                {
                  begin: XML_TAG.begin,
                  // we carefully check the opening tag to see if it truly
                  // is a tag and not a false positive
                  "on:begin": XML_TAG.isTrulyOpeningTag,
                  end: XML_TAG.end
                }
              ],
              subLanguage: "xml",
              contains: [
                {
                  begin: XML_TAG.begin,
                  end: XML_TAG.end,
                  skip: true,
                  contains: ["self"]
                }
              ]
            }
          ]
        },
        FUNCTION_DEFINITION,
        {
          // prevent this from getting swallowed up by function
          // since they appear "function like"
          beginKeywords: "while if switch catch for"
        },
        {
          // we have to count the parens to make sure we actually have the correct
          // bounding ( ).  There could be any number of sub-expressions inside
          // also surrounded by parens.
          begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          // end parens
          returnBegin: true,
          label: "func.def",
          contains: [
            PARAMS,
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
          ]
        },
        // catch ... so it won't trigger the property rule below
        {
          match: /\.\.\./,
          relevance: 0
        },
        PROPERTY_ACCESS,
        // hack: prevents detection of keywords in some circumstances
        // .keyword()
        // $keyword = x
        {
          match: "\\$" + IDENT_RE$1,
          relevance: 0
        },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [PARAMS]
        },
        FUNCTION_CALL,
        UPPER_CASE_CONSTANT,
        CLASS_OR_EXTENDS,
        GETTER_OR_SETTER,
        {
          match: /\$[(.]/
          // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/typescript.js
  var IDENT_RE2 = "[A-Za-z$_][0-9A-Za-z$_]*";
  var KEYWORDS2 = [
    "as",
    // for exports
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    // JS handles these with a special rule
    // "get",
    // "set",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
    // It's reached stage 3, which is "recommended for implementation":
    "using"
  ];
  var LITERALS2 = [
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity"
  ];
  var TYPES2 = [
    // Fundamental objects
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    // numbers and dates
    "Math",
    "Date",
    "Number",
    "BigInt",
    // text
    "String",
    "RegExp",
    // Indexed collections
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    // Keyed collections
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    // Structured data
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    // Control abstraction objects
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    // Reflection
    "Reflect",
    "Proxy",
    // Internationalization
    "Intl",
    // WebAssembly
    "WebAssembly"
  ];
  var ERROR_TYPES2 = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError"
  ];
  var BUILT_IN_GLOBALS2 = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape"
  ];
  var BUILT_IN_VARIABLES2 = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "module",
    "global"
    // Node.js
  ];
  var BUILT_INS2 = [].concat(
    BUILT_IN_GLOBALS2,
    TYPES2,
    ERROR_TYPES2
  );
  function javascript2(hljs) {
    const regex = hljs.regex;
    const hasClosingTag = (match, { after }) => {
      const tag = "</" + match[0].slice(1);
      const pos = match.input.indexOf(tag, after);
      return pos !== -1;
    };
    const IDENT_RE$1 = IDENT_RE2;
    const FRAGMENT = {
      begin: "<>",
      end: "</>"
    };
    const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
    const XML_TAG = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      /**
       * @param {RegExpMatchArray} match
       * @param {CallbackResponse} response
       */
      isTrulyOpeningTag: (match, response) => {
        const afterMatchIndex = match[0].length + match.index;
        const nextChar = match.input[afterMatchIndex];
        if (
          // HTML should not include another raw `<` inside a tag
          // nested type?
          // `<Array<Array<number>>`, etc.
          nextChar === "<" || // the , gives away that this is not HTML
          // `<T, A extends keyof T, V>`
          nextChar === ","
        ) {
          response.ignoreMatch();
          return;
        }
        if (nextChar === ">") {
          if (!hasClosingTag(match, { after: afterMatchIndex })) {
            response.ignoreMatch();
          }
        }
        let m6;
        const afterMatch = match.input.substring(afterMatchIndex);
        if (m6 = afterMatch.match(/^\s*=/)) {
          response.ignoreMatch();
          return;
        }
        if (m6 = afterMatch.match(/^\s+extends\s+/)) {
          if (m6.index === 0) {
            response.ignoreMatch();
            return;
          }
        }
      }
    };
    const KEYWORDS$1 = {
      $pattern: IDENT_RE2,
      keyword: KEYWORDS2,
      literal: LITERALS2,
      built_in: BUILT_INS2,
      "variable.language": BUILT_IN_VARIABLES2
    };
    const decimalDigits = "[0-9](_?[0-9])*";
    const frac = `\\.(${decimalDigits})`;
    const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
    const NUMBER = {
      className: "number",
      variants: [
        // DecimalLiteral
        { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
        { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
        // DecimalBigIntegerLiteral
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        // NonDecimalIntegerLiteral
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        // LegacyOctalIntegerLiteral (does not include underscore separators)
        // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
        { begin: "\\b0[0-7]+n?\\b" }
      ],
      relevance: 0
    };
    const SUBST = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: KEYWORDS$1,
      contains: []
      // defined later
    };
    const HTML_TEMPLATE = {
      begin: ".?html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "xml"
      }
    };
    const CSS_TEMPLATE = {
      begin: ".?css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "css"
      }
    };
    const GRAPHQL_TEMPLATE = {
      begin: ".?gql`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "graphql"
      }
    };
    const TEMPLATE_STRING = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ]
    };
    const JSDOC_COMMENT = hljs.COMMENT(
      /\/\*\*(?!\/)/,
      "\\*/",
      {
        relevance: 0,
        contains: [
          {
            begin: "(?=@[A-Za-z]+)",
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              },
              {
                className: "type",
                begin: "\\{",
                end: "\\}",
                excludeEnd: true,
                excludeBegin: true,
                relevance: 0
              },
              {
                className: "variable",
                begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                endsParent: true,
                relevance: 0
              },
              // eat spaces (not newlines) so we can find
              // types or variables
              {
                begin: /(?=[^\n])\s/,
                relevance: 0
              }
            ]
          }
        ]
      }
    );
    const COMMENT = {
      className: "comment",
      variants: [
        JSDOC_COMMENT,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_LINE_COMMENT_MODE
      ]
    };
    const SUBST_INTERNALS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER
      // This is intentional:
      // See https://github.com/highlightjs/highlight.js/issues/3288
      // hljs.REGEXP_MODE
    ];
    SUBST.contains = SUBST_INTERNALS.concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
    const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
    const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
      // eat recursive parens in sub expressions
      {
        begin: /(\s*)\(/,
        end: /\)/,
        keywords: KEYWORDS$1,
        contains: ["self"].concat(SUBST_AND_COMMENTS)
      }
    ]);
    const PARAMS = {
      className: "params",
      // convert this to negative lookbehind in v12
      begin: /(\s*)\(/,
      // to match the parms with
      end: /\)/,
      excludeBegin: true,
      excludeEnd: true,
      keywords: KEYWORDS$1,
      contains: PARAMS_CONTAINS
    };
    const CLASS_OR_EXTENDS = {
      variants: [
        // class Car extends vehicle
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1,
            /\s+/,
            /extends/,
            /\s+/,
            regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited"
          }
        },
        // class Car
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        }
      ]
    };
    const CLASS_REFERENCE = {
      relevance: 0,
      match: regex.either(
        // Hard coded exceptions
        /\bJSON/,
        // Float32Array, OutT
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        // CSSFactory, CSSFactoryT
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        // FPs, FPsT
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
        // P
        // single letters are not highlighted
        // BLAH
        // this will be flagged as a UPPER_CASE_CONSTANT instead
      ),
      className: "title.class",
      keywords: {
        _: [
          // se we still get relevance credit for JS library classes
          ...TYPES2,
          ...ERROR_TYPES2
        ]
      }
    };
    const USE_STRICT = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    };
    const FUNCTION_DEFINITION = {
      variants: [
        {
          match: [
            /function/,
            /\s+/,
            IDENT_RE$1,
            /(?=\s*\()/
          ]
        },
        // anonymous function
        {
          match: [
            /function/,
            /\s*(?=\()/
          ]
        }
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      label: "func.def",
      contains: [PARAMS],
      illegal: /%/
    };
    const UPPER_CASE_CONSTANT = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    };
    function noneOf(list) {
      return regex.concat("(?!", list.join("|"), ")");
    }
    const FUNCTION_CALL = {
      match: regex.concat(
        /\b/,
        noneOf([
          ...BUILT_IN_GLOBALS2,
          "super",
          "import"
        ].map((x2) => `${x2}\\s*\\(`)),
        IDENT_RE$1,
        regex.lookahead(/\s*\(/)
      ),
      className: "title.function",
      relevance: 0
    };
    const PROPERTY_ACCESS = {
      begin: regex.concat(/\./, regex.lookahead(
        regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
      )),
      end: IDENT_RE$1,
      excludeBegin: true,
      keywords: "prototype",
      className: "property",
      relevance: 0
    };
    const GETTER_OR_SETTER = {
      match: [
        /get|set/,
        /\s+/,
        IDENT_RE$1,
        /(?=\()/
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        {
          // eat to avoid empty params
          begin: /\(\)/
        },
        PARAMS
      ]
    };
    const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
    const FUNCTION_VARIABLE = {
      match: [
        /const|var|let/,
        /\s+/,
        IDENT_RE$1,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        // async is optional
        regex.lookahead(FUNC_LEAD_IN_RE)
      ],
      keywords: "async",
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        PARAMS
      ]
    };
    return {
      name: "JavaScript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: KEYWORDS$1,
      // this will be extended by TypeScript
      exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
      illegal: /#(?![$_A-z])/,
      contains: [
        hljs.SHEBANG({
          label: "shebang",
          binary: "node",
          relevance: 5
        }),
        USE_STRICT,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        GRAPHQL_TEMPLATE,
        TEMPLATE_STRING,
        COMMENT,
        // Skip numbers when they are part of a variable name
        { match: /\$\d+/ },
        NUMBER,
        CLASS_REFERENCE,
        {
          scope: "attr",
          match: IDENT_RE$1 + regex.lookahead(":"),
          relevance: 0
        },
        FUNCTION_VARIABLE,
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            COMMENT,
            hljs.REGEXP_MODE,
            {
              className: "function",
              // we have to count the parens to make sure we actually have the
              // correct bounding ( ) before the =>.  There could be any number of
              // sub-expressions inside also surrounded by parens.
              begin: FUNC_LEAD_IN_RE,
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: hljs.UNDERSCORE_IDENT_RE,
                      relevance: 0
                    },
                    {
                      className: null,
                      begin: /\(\s*\)/,
                      skip: true
                    },
                    {
                      begin: /(\s*)\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS$1,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // could be a comma delimited list of params to a function call
              begin: /,/,
              relevance: 0
            },
            {
              match: /\s+/,
              relevance: 0
            },
            {
              // JSX
              variants: [
                { begin: FRAGMENT.begin, end: FRAGMENT.end },
                { match: XML_SELF_CLOSING },
                {
                  begin: XML_TAG.begin,
                  // we carefully check the opening tag to see if it truly
                  // is a tag and not a false positive
                  "on:begin": XML_TAG.isTrulyOpeningTag,
                  end: XML_TAG.end
                }
              ],
              subLanguage: "xml",
              contains: [
                {
                  begin: XML_TAG.begin,
                  end: XML_TAG.end,
                  skip: true,
                  contains: ["self"]
                }
              ]
            }
          ]
        },
        FUNCTION_DEFINITION,
        {
          // prevent this from getting swallowed up by function
          // since they appear "function like"
          beginKeywords: "while if switch catch for"
        },
        {
          // we have to count the parens to make sure we actually have the correct
          // bounding ( ).  There could be any number of sub-expressions inside
          // also surrounded by parens.
          begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          // end parens
          returnBegin: true,
          label: "func.def",
          contains: [
            PARAMS,
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
          ]
        },
        // catch ... so it won't trigger the property rule below
        {
          match: /\.\.\./,
          relevance: 0
        },
        PROPERTY_ACCESS,
        // hack: prevents detection of keywords in some circumstances
        // .keyword()
        // $keyword = x
        {
          match: "\\$" + IDENT_RE$1,
          relevance: 0
        },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [PARAMS]
        },
        FUNCTION_CALL,
        UPPER_CASE_CONSTANT,
        CLASS_OR_EXTENDS,
        GETTER_OR_SETTER,
        {
          match: /\$[(.]/
          // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        }
      ]
    };
  }
  function typescript(hljs) {
    const regex = hljs.regex;
    const tsLanguage = javascript2(hljs);
    const IDENT_RE$1 = IDENT_RE2;
    const TYPES3 = [
      "any",
      "void",
      "number",
      "boolean",
      "string",
      "object",
      "never",
      "symbol",
      "bigint",
      "unknown"
    ];
    const NAMESPACE = {
      begin: [
        /namespace/,
        /\s+/,
        hljs.IDENT_RE
      ],
      beginScope: {
        1: "keyword",
        3: "title.class"
      }
    };
    const INTERFACE = {
      beginKeywords: "interface",
      end: /\{/,
      excludeEnd: true,
      keywords: {
        keyword: "interface extends",
        built_in: TYPES3
      },
      contains: [tsLanguage.exports.CLASS_REFERENCE]
    };
    const USE_STRICT = {
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use strict['"]/
    };
    const TS_SPECIFIC_KEYWORDS = [
      "type",
      // "namespace",
      "interface",
      "public",
      "private",
      "protected",
      "implements",
      "declare",
      "abstract",
      "readonly",
      "enum",
      "override",
      "satisfies"
    ];
    const KEYWORDS$1 = {
      $pattern: IDENT_RE2,
      keyword: KEYWORDS2.concat(TS_SPECIFIC_KEYWORDS),
      literal: LITERALS2,
      built_in: BUILT_INS2.concat(TYPES3),
      "variable.language": BUILT_IN_VARIABLES2
    };
    const DECORATOR = {
      className: "meta",
      begin: "@" + IDENT_RE$1
    };
    const swapMode = (mode, label, replacement) => {
      const indx = mode.contains.findIndex((m6) => m6.label === label);
      if (indx === -1) {
        throw new Error("can not find mode to replace");
      }
      mode.contains.splice(indx, 1, replacement);
    };
    Object.assign(tsLanguage.keywords, KEYWORDS$1);
    tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
    const ATTRIBUTE_HIGHLIGHT = tsLanguage.contains.find((c4) => c4.scope === "attr");
    const OPTIONAL_KEY_OR_ARGUMENT = Object.assign(
      {},
      ATTRIBUTE_HIGHLIGHT,
      { match: regex.concat(IDENT_RE$1, regex.lookahead(/\s*\?:/)) }
    );
    tsLanguage.exports.PARAMS_CONTAINS.push([
      tsLanguage.exports.CLASS_REFERENCE,
      // class reference for highlighting the params types
      ATTRIBUTE_HIGHLIGHT,
      // highlight the params key
      OPTIONAL_KEY_OR_ARGUMENT
      // Added for optional property assignment highlighting
    ]);
    tsLanguage.contains = tsLanguage.contains.concat([
      DECORATOR,
      NAMESPACE,
      INTERFACE,
      OPTIONAL_KEY_OR_ARGUMENT
      // Added for optional property assignment highlighting
    ]);
    swapMode(tsLanguage, "shebang", hljs.SHEBANG());
    swapMode(tsLanguage, "use_strict", USE_STRICT);
    const functionDeclaration = tsLanguage.contains.find((m6) => m6.label === "func.def");
    functionDeclaration.relevance = 0;
    Object.assign(tsLanguage, {
      name: "TypeScript",
      aliases: [
        "ts",
        "tsx",
        "mts",
        "cts"
      ]
    });
    return tsLanguage;
  }

  // node_modules/highlight.js/es/languages/json.js
  function json(hljs) {
    const ATTRIBUTE = {
      className: "attr",
      begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
      relevance: 1.01
    };
    const PUNCTUATION = {
      match: /[{}[\],:]/,
      className: "punctuation",
      relevance: 0
    };
    const LITERALS3 = [
      "true",
      "false",
      "null"
    ];
    const LITERALS_MODE = {
      scope: "literal",
      beginKeywords: LITERALS3.join(" ")
    };
    return {
      name: "JSON",
      aliases: ["jsonc"],
      keywords: {
        literal: LITERALS3
      },
      contains: [
        ATTRIBUTE,
        PUNCTUATION,
        hljs.QUOTE_STRING_MODE,
        LITERALS_MODE,
        hljs.C_NUMBER_MODE,
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ],
      illegal: "\\S"
    };
  }

  // node_modules/highlight.js/es/languages/xml.js
  function xml(hljs) {
    const regex = hljs.regex;
    const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
    const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
    const XML_ENTITIES = {
      className: "symbol",
      begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
    };
    const XML_META_KEYWORDS = {
      begin: /\s/,
      contains: [
        {
          className: "keyword",
          begin: /#?[a-z_][a-z1-9_-]+/,
          illegal: /\n/
        }
      ]
    };
    const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
      begin: /\(/,
      end: /\)/
    });
    const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: "string" });
    const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: "string" });
    const TAG_INTERNALS = {
      endsWithParent: true,
      illegal: /</,
      relevance: 0,
      contains: [
        {
          className: "attr",
          begin: XML_IDENT_RE,
          relevance: 0
        },
        {
          begin: /=\s*/,
          relevance: 0,
          contains: [
            {
              className: "string",
              endsParent: true,
              variants: [
                {
                  begin: /"/,
                  end: /"/,
                  contains: [XML_ENTITIES]
                },
                {
                  begin: /'/,
                  end: /'/,
                  contains: [XML_ENTITIES]
                },
                { begin: /[^\s"'=<>`]+/ }
              ]
            }
          ]
        }
      ]
    };
    return {
      name: "HTML, XML",
      aliases: [
        "html",
        "xhtml",
        "rss",
        "atom",
        "xjb",
        "xsd",
        "xsl",
        "plist",
        "wsf",
        "svg"
      ],
      case_insensitive: true,
      unicodeRegex: true,
      contains: [
        {
          className: "meta",
          begin: /<![a-z]/,
          end: />/,
          relevance: 10,
          contains: [
            XML_META_KEYWORDS,
            QUOTE_META_STRING_MODE,
            APOS_META_STRING_MODE,
            XML_META_PAR_KEYWORDS,
            {
              begin: /\[/,
              end: /\]/,
              contains: [
                {
                  className: "meta",
                  begin: /<![a-z]/,
                  end: />/,
                  contains: [
                    XML_META_KEYWORDS,
                    XML_META_PAR_KEYWORDS,
                    QUOTE_META_STRING_MODE,
                    APOS_META_STRING_MODE
                  ]
                }
              ]
            }
          ]
        },
        hljs.COMMENT(
          /<!--/,
          /-->/,
          { relevance: 10 }
        ),
        {
          begin: /<!\[CDATA\[/,
          end: /\]\]>/,
          relevance: 10
        },
        XML_ENTITIES,
        // xml processing instructions
        {
          className: "meta",
          end: /\?>/,
          variants: [
            {
              begin: /<\?xml/,
              relevance: 10,
              contains: [
                QUOTE_META_STRING_MODE
              ]
            },
            {
              begin: /<\?[a-z][a-z0-9]+/
            }
          ]
        },
        {
          className: "tag",
          /*
          The lookahead pattern (?=...) ensures that 'begin' only matches
          '<style' as a single word, followed by a whitespace or an
          ending bracket.
          */
          begin: /<style(?=\s|>)/,
          end: />/,
          keywords: { name: "style" },
          contains: [TAG_INTERNALS],
          starts: {
            end: /<\/style>/,
            returnEnd: true,
            subLanguage: [
              "css",
              "xml"
            ]
          }
        },
        {
          className: "tag",
          // See the comment in the <style tag about the lookahead pattern
          begin: /<script(?=\s|>)/,
          end: />/,
          keywords: { name: "script" },
          contains: [TAG_INTERNALS],
          starts: {
            end: /<\/script>/,
            returnEnd: true,
            subLanguage: [
              "javascript",
              "handlebars",
              "xml"
            ]
          }
        },
        // we need this for now for jSX
        {
          className: "tag",
          begin: /<>|<\/>/
        },
        // open tag
        {
          className: "tag",
          begin: regex.concat(
            /</,
            regex.lookahead(regex.concat(
              TAG_NAME_RE,
              // <tag/>
              // <tag>
              // <tag ...
              regex.either(/\/>/, />/, /\s/)
            ))
          ),
          end: /\/?>/,
          contains: [
            {
              className: "name",
              begin: TAG_NAME_RE,
              relevance: 0,
              starts: TAG_INTERNALS
            }
          ]
        },
        // close tag
        {
          className: "tag",
          begin: regex.concat(
            /<\//,
            regex.lookahead(regex.concat(
              TAG_NAME_RE,
              />/
            ))
          ),
          contains: [
            {
              className: "name",
              begin: TAG_NAME_RE,
              relevance: 0
            },
            {
              begin: />/,
              relevance: 0,
              endsParent: true
            }
          ]
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/css.js
  var MODES = (hljs) => {
    return {
      IMPORTANT: {
        scope: "meta",
        begin: "!important"
      },
      BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
      HEXCOLOR: {
        scope: "number",
        begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
      },
      FUNCTION_DISPATCH: {
        className: "built_in",
        begin: /[\w-]+(?=\()/
      },
      ATTRIBUTE_SELECTOR_MODE: {
        scope: "selector-attr",
        begin: /\[/,
        end: /\]/,
        illegal: "$",
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
      CSS_NUMBER_MODE: {
        scope: "number",
        begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0
      },
      CSS_VARIABLE: {
        className: "attr",
        begin: /--[A-Za-z_][A-Za-z0-9_-]*/
      }
    };
  };
  var HTML_TAGS = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "optgroup",
    "option",
    "p",
    "picture",
    "q",
    "quote",
    "samp",
    "section",
    "select",
    "source",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video"
  ];
  var SVG_TAGS = [
    "defs",
    "g",
    "marker",
    "mask",
    "pattern",
    "svg",
    "switch",
    "symbol",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feFlood",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMorphology",
    "feOffset",
    "feSpecularLighting",
    "feTile",
    "feTurbulence",
    "linearGradient",
    "radialGradient",
    "stop",
    "circle",
    "ellipse",
    "image",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
    "text",
    "use",
    "textPath",
    "tspan",
    "foreignObject",
    "clipPath"
  ];
  var TAGS = [
    ...HTML_TAGS,
    ...SVG_TAGS
  ];
  var MEDIA_FEATURES = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    // TODO: find a better solution?
    "min-width",
    "max-width",
    "min-height",
    "max-height"
  ].sort().reverse();
  var PSEUDO_CLASSES = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    // dir()
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    // has()
    "host",
    // host or host()
    "host-context",
    // host-context()
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    // is()
    "lang",
    // lang()
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    // not()
    "nth-child",
    // nth-child()
    "nth-col",
    // nth-col()
    "nth-last-child",
    // nth-last-child()
    "nth-last-col",
    // nth-last-col()
    "nth-last-of-type",
    //nth-last-of-type()
    "nth-of-type",
    //nth-of-type()
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where"
    // where()
  ].sort().reverse();
  var PSEUDO_ELEMENTS = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error"
  ].sort().reverse();
  var ATTRIBUTES = [
    "accent-color",
    "align-content",
    "align-items",
    "align-self",
    "alignment-baseline",
    "all",
    "anchor-name",
    "animation",
    "animation-composition",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-range",
    "animation-range-end",
    "animation-range-start",
    "animation-timeline",
    "animation-timing-function",
    "appearance",
    "aspect-ratio",
    "backdrop-filter",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "baseline-shift",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-start-end-radius",
    "border-start-start-radius",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-align",
    "box-decoration-break",
    "box-direction",
    "box-flex",
    "box-flex-group",
    "box-lines",
    "box-ordinal-group",
    "box-orient",
    "box-pack",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "color-scheme",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "contain-intrinsic-block-size",
    "contain-intrinsic-height",
    "contain-intrinsic-inline-size",
    "contain-intrinsic-size",
    "contain-intrinsic-width",
    "container",
    "container-name",
    "container-type",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "counter-set",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "cx",
    "cy",
    "direction",
    "display",
    "dominant-baseline",
    "empty-cells",
    "enable-background",
    "field-sizing",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flood-color",
    "flood-opacity",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-optical-sizing",
    "font-palette",
    "font-size",
    "font-size-adjust",
    "font-smooth",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-synthesis-position",
    "font-synthesis-small-caps",
    "font-synthesis-style",
    "font-synthesis-weight",
    "font-variant",
    "font-variant-alternates",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-emoji",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "forced-color-adjust",
    "gap",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphenate-character",
    "hyphenate-limit-chars",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "initial-letter",
    "initial-letter-align",
    "inline-size",
    "inset",
    "inset-area",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "isolation",
    "justify-content",
    "justify-items",
    "justify-self",
    "kerning",
    "left",
    "letter-spacing",
    "lighting-color",
    "line-break",
    "line-height",
    "line-height-step",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "margin-trim",
    "marker",
    "marker-end",
    "marker-mid",
    "marker-start",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "masonry-auto-flow",
    "math-depth",
    "math-shift",
    "math-style",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-margin",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "overlay",
    "overscroll-behavior",
    "overscroll-behavior-block",
    "overscroll-behavior-inline",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "paint-order",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "place-content",
    "place-items",
    "place-self",
    "pointer-events",
    "position",
    "position-anchor",
    "position-visibility",
    "print-color-adjust",
    "quotes",
    "r",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "rotate",
    "row-gap",
    "ruby-align",
    "ruby-position",
    "scale",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scroll-timeline",
    "scroll-timeline-axis",
    "scroll-timeline-name",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "shape-rendering",
    "speak",
    "speak-as",
    "src",
    // @font-face
    "stop-color",
    "stop-opacity",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-anchor",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-skip",
    "text-decoration-skip-ink",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-size-adjust",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "text-wrap",
    "text-wrap-mode",
    "text-wrap-style",
    "timeline-scope",
    "top",
    "touch-action",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-behavior",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "translate",
    "unicode-bidi",
    "user-modify",
    "user-select",
    "vector-effect",
    "vertical-align",
    "view-timeline",
    "view-timeline-axis",
    "view-timeline-inset",
    "view-timeline-name",
    "view-transition-name",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "white-space-collapse",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "x",
    "y",
    "z-index",
    "zoom"
  ].sort().reverse();
  function css(hljs) {
    const regex = hljs.regex;
    const modes = MODES(hljs);
    const VENDOR_PREFIX = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ };
    const AT_MODIFIERS = "and or not only";
    const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/;
    const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
    const STRINGS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ];
    return {
      name: "CSS",
      case_insensitive: true,
      illegal: /[=|'\$]/,
      keywords: { keyframePosition: "from to" },
      classNameAliases: {
        // for visual continuity with `tag {}` and because we
        // don't have a great class for this?
        keyframePosition: "selector-tag"
      },
      contains: [
        modes.BLOCK_COMMENT,
        VENDOR_PREFIX,
        // to recognize keyframe 40% etc which are outside the scope of our
        // attribute value mode
        modes.CSS_NUMBER_MODE,
        {
          className: "selector-id",
          begin: /#[A-Za-z0-9_-]+/,
          relevance: 0
        },
        {
          className: "selector-class",
          begin: "\\." + IDENT_RE3,
          relevance: 0
        },
        modes.ATTRIBUTE_SELECTOR_MODE,
        {
          className: "selector-pseudo",
          variants: [
            { begin: ":(" + PSEUDO_CLASSES.join("|") + ")" },
            { begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")" }
          ]
        },
        // we may actually need this (12/2020)
        // { // pseudo-selector params
        //   begin: /\(/,
        //   end: /\)/,
        //   contains: [ hljs.CSS_NUMBER_MODE ]
        // },
        modes.CSS_VARIABLE,
        {
          className: "attribute",
          begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
        },
        // attribute values
        {
          begin: /:/,
          end: /[;}{]/,
          contains: [
            modes.BLOCK_COMMENT,
            modes.HEXCOLOR,
            modes.IMPORTANT,
            modes.CSS_NUMBER_MODE,
            ...STRINGS,
            // needed to highlight these as strings and to avoid issues with
            // illegal characters that might be inside urls that would tigger the
            // languages illegal stack
            {
              begin: /(url|data-uri)\(/,
              end: /\)/,
              relevance: 0,
              // from keywords
              keywords: { built_in: "url data-uri" },
              contains: [
                ...STRINGS,
                {
                  className: "string",
                  // any character other than `)` as in `url()` will be the start
                  // of a string, which ends with `)` (from the parent mode)
                  begin: /[^)]/,
                  endsWithParent: true,
                  excludeEnd: true
                }
              ]
            },
            modes.FUNCTION_DISPATCH
          ]
        },
        {
          begin: regex.lookahead(/@/),
          end: "[{;]",
          relevance: 0,
          illegal: /:/,
          // break on Less variables @var: ...
          contains: [
            {
              className: "keyword",
              begin: AT_PROPERTY_RE
            },
            {
              begin: /\s/,
              endsWithParent: true,
              excludeEnd: true,
              relevance: 0,
              keywords: {
                $pattern: /[a-z-]+/,
                keyword: AT_MODIFIERS,
                attribute: MEDIA_FEATURES.join(" ")
              },
              contains: [
                {
                  begin: /[a-z-]+(?=:)/,
                  className: "attribute"
                },
                ...STRINGS,
                modes.CSS_NUMBER_MODE
              ]
            }
          ]
        },
        {
          className: "selector-tag",
          begin: "\\b(" + TAGS.join("|") + ")\\b"
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/bash.js
  function bash(hljs) {
    const regex = hljs.regex;
    const VAR = {};
    const BRACED_VAR = {
      begin: /\$\{/,
      end: /\}/,
      contains: [
        "self",
        {
          begin: /:-/,
          contains: [VAR]
        }
        // default values
      ]
    };
    Object.assign(VAR, {
      className: "variable",
      variants: [
        { begin: regex.concat(
          /\$[\w\d#@][\w\d_]*/,
          // negative look-ahead tries to avoid matching patterns that are not
          // Perl at all like $ident$, @ident@, etc.
          `(?![\\w\\d])(?![$])`
        ) },
        BRACED_VAR
      ]
    });
    const SUBST = {
      className: "subst",
      begin: /\$\(/,
      end: /\)/,
      contains: [hljs.BACKSLASH_ESCAPE]
    };
    const COMMENT = hljs.inherit(
      hljs.COMMENT(),
      {
        match: [
          /(^|\s)/,
          /#.*$/
        ],
        scope: {
          2: "comment"
        }
      }
    );
    const HERE_DOC = {
      begin: /<<-?\s*(?=\w+)/,
      starts: { contains: [
        hljs.END_SAME_AS_BEGIN({
          begin: /(\w+)/,
          end: /(\w+)/,
          className: "string"
        })
      ] }
    };
    const QUOTE_STRING = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        VAR,
        SUBST
      ]
    };
    SUBST.contains.push(QUOTE_STRING);
    const ESCAPED_QUOTE = {
      match: /\\"/
    };
    const APOS_STRING = {
      className: "string",
      begin: /'/,
      end: /'/
    };
    const ESCAPED_APOS = {
      match: /\\'/
    };
    const ARITHMETIC = {
      begin: /\$?\(\(/,
      end: /\)\)/,
      contains: [
        {
          begin: /\d+#[0-9a-f]+/,
          className: "number"
        },
        hljs.NUMBER_MODE,
        VAR
      ]
    };
    const SH_LIKE_SHELLS = [
      "fish",
      "bash",
      "zsh",
      "sh",
      "csh",
      "ksh",
      "tcsh",
      "dash",
      "scsh"
    ];
    const KNOWN_SHEBANG = hljs.SHEBANG({
      binary: `(${SH_LIKE_SHELLS.join("|")})`,
      relevance: 10
    });
    const FUNCTION = {
      className: "function",
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: true,
      contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
      relevance: 0
    };
    const KEYWORDS3 = [
      "if",
      "then",
      "else",
      "elif",
      "fi",
      "time",
      "for",
      "while",
      "until",
      "in",
      "do",
      "done",
      "case",
      "esac",
      "coproc",
      "function",
      "select"
    ];
    const LITERALS3 = [
      "true",
      "false"
    ];
    const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
    const SHELL_BUILT_INS = [
      "break",
      "cd",
      "continue",
      "eval",
      "exec",
      "exit",
      "export",
      "getopts",
      "hash",
      "pwd",
      "readonly",
      "return",
      "shift",
      "test",
      "times",
      "trap",
      "umask",
      "unset"
    ];
    const BASH_BUILT_INS = [
      "alias",
      "bind",
      "builtin",
      "caller",
      "command",
      "declare",
      "echo",
      "enable",
      "help",
      "let",
      "local",
      "logout",
      "mapfile",
      "printf",
      "read",
      "readarray",
      "source",
      "sudo",
      "type",
      "typeset",
      "ulimit",
      "unalias"
    ];
    const ZSH_BUILT_INS = [
      "autoload",
      "bg",
      "bindkey",
      "bye",
      "cap",
      "chdir",
      "clone",
      "comparguments",
      "compcall",
      "compctl",
      "compdescribe",
      "compfiles",
      "compgroups",
      "compquote",
      "comptags",
      "comptry",
      "compvalues",
      "dirs",
      "disable",
      "disown",
      "echotc",
      "echoti",
      "emulate",
      "fc",
      "fg",
      "float",
      "functions",
      "getcap",
      "getln",
      "history",
      "integer",
      "jobs",
      "kill",
      "limit",
      "log",
      "noglob",
      "popd",
      "print",
      "pushd",
      "pushln",
      "rehash",
      "sched",
      "setcap",
      "setopt",
      "stat",
      "suspend",
      "ttyctl",
      "unfunction",
      "unhash",
      "unlimit",
      "unsetopt",
      "vared",
      "wait",
      "whence",
      "where",
      "which",
      "zcompile",
      "zformat",
      "zftp",
      "zle",
      "zmodload",
      "zparseopts",
      "zprof",
      "zpty",
      "zregexparse",
      "zsocket",
      "zstyle",
      "ztcp"
    ];
    const GNU_CORE_UTILS = [
      "chcon",
      "chgrp",
      "chown",
      "chmod",
      "cp",
      "dd",
      "df",
      "dir",
      "dircolors",
      "ln",
      "ls",
      "mkdir",
      "mkfifo",
      "mknod",
      "mktemp",
      "mv",
      "realpath",
      "rm",
      "rmdir",
      "shred",
      "sync",
      "touch",
      "truncate",
      "vdir",
      "b2sum",
      "base32",
      "base64",
      "cat",
      "cksum",
      "comm",
      "csplit",
      "cut",
      "expand",
      "fmt",
      "fold",
      "head",
      "join",
      "md5sum",
      "nl",
      "numfmt",
      "od",
      "paste",
      "ptx",
      "pr",
      "sha1sum",
      "sha224sum",
      "sha256sum",
      "sha384sum",
      "sha512sum",
      "shuf",
      "sort",
      "split",
      "sum",
      "tac",
      "tail",
      "tr",
      "tsort",
      "unexpand",
      "uniq",
      "wc",
      "arch",
      "basename",
      "chroot",
      "date",
      "dirname",
      "du",
      "echo",
      "env",
      "expr",
      "factor",
      // "false", // keyword literal already
      "groups",
      "hostid",
      "id",
      "link",
      "logname",
      "nice",
      "nohup",
      "nproc",
      "pathchk",
      "pinky",
      "printenv",
      "printf",
      "pwd",
      "readlink",
      "runcon",
      "seq",
      "sleep",
      "stat",
      "stdbuf",
      "stty",
      "tee",
      "test",
      "timeout",
      // "true", // keyword literal already
      "tty",
      "uname",
      "unlink",
      "uptime",
      "users",
      "who",
      "whoami",
      "yes"
    ];
    return {
      name: "Bash",
      aliases: [
        "sh",
        "zsh"
      ],
      keywords: {
        $pattern: /\b[a-z][a-z0-9._-]+\b/,
        keyword: KEYWORDS3,
        literal: LITERALS3,
        built_in: [
          ...SHELL_BUILT_INS,
          ...BASH_BUILT_INS,
          // Shell modifiers
          "set",
          "shopt",
          ...ZSH_BUILT_INS,
          ...GNU_CORE_UTILS
        ]
      },
      contains: [
        KNOWN_SHEBANG,
        // to catch known shells and boost relevancy
        hljs.SHEBANG(),
        // to catch unknown shells but still highlight the shebang
        FUNCTION,
        ARITHMETIC,
        COMMENT,
        HERE_DOC,
        PATH_MODE,
        QUOTE_STRING,
        ESCAPED_QUOTE,
        APOS_STRING,
        ESCAPED_APOS,
        VAR
      ]
    };
  }

  // src/DocEntry.jsx
  var import_jsx_runtime16 = __toESM(require_jsx_runtime());
  core_default.registerLanguage("javascript", javascript);
  core_default.registerLanguage("js", javascript);
  core_default.registerLanguage("typescript", typescript);
  core_default.registerLanguage("ts", typescript);
  core_default.registerLanguage("json", json);
  core_default.registerLanguage("xml", xml);
  core_default.registerLanguage("html", xml);
  core_default.registerLanguage("css", css);
  core_default.registerLanguage("bash", bash);
  core_default.registerLanguage("shell", bash);
  function highlightCode(code, lang) {
    try {
      if (lang && core_default.getLanguage(lang)) {
        return core_default.highlight(code, { language: lang }).value;
      }
      return core_default.highlightAuto(code).value;
    } catch (_) {
      return code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }
  function getSignatureData(doclet) {
    if (doclet.signature) {
      return {
        params: doclet.signature.params || [],
        returns: doclet.signature.returns || [],
        exceptions: doclet.signature.exceptions || [],
        async: doclet.signature.async || false,
        generator: doclet.signature.generator || false
      };
    }
    return {
      params: doclet.params || [],
      returns: doclet.returns || [],
      exceptions: doclet.exceptions || [],
      async: doclet.async || false,
      generator: doclet.generator || false
    };
  }
  function Signature({ doclet, isConstructor }) {
    const sig = getSignatureData(doclet);
    const isCallable = doclet.kind === "function" || isConstructor || doclet.signature;
    if (!isCallable) return null;
    const params = sig.params.filter((p14) => p14.name && !p14.name.includes(".")).map((p14) => {
      let str = "";
      if (p14.variable) str += "...";
      str += p14.name;
      if (p14.optional) str += "?";
      if (p14.type) str += ": " + p14.type.join(" | ");
      return str;
    });
    const name = isConstructor ? `new ${doclet.name}` : doclet.name;
    const ret = sig.returns?.[0]?.type ? ` \u2192 ${sig.returns[0].type.join(" | ")}` : "";
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p7, { className: "signature-block", my: "3", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p11, { size: "2", className: "signature-code", children: [
      name,
      "(",
      params.join(", "),
      ")",
      ret
    ] }) });
  }
  function ParamsTable({ params }) {
    if (!params || params.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { mt: "3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", weight: "medium", color: "gray", mb: "2", className: "subsection-label", children: "Parameters" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(table_exports.Root, { variant: "surface", size: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.ColumnHeaderCell, { children: "Name" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.ColumnHeaderCell, { children: "Type" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.ColumnHeaderCell, { children: "Default" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.ColumnHeaderCell, { children: "Description" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Body, { children: params.map((p14, i6) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p10, { align: "center", gap: "1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p11, { size: "1", variant: "ghost", children: p14.name }),
            p14.optional && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { size: "1", variant: "surface", color: "gray", children: "opt" }),
            p14.variable && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { size: "1", variant: "surface", color: "plum", children: "rest" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Cell, { children: p14.type ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p10, { gap: "1", wrap: "wrap", children: p14.type.map((t15, j) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "soft", color: "iris", size: "1", children: t15 }, j)) }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", color: "gray", children: "*" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Cell, { children: p14.defaultvalue ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p11, { size: "1", variant: "ghost", children: p14.defaultvalue }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", color: "gray", children: "\u2014" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Cell, { children: p14.description ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", dangerouslySetInnerHTML: { __html: p14.description } }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", color: "gray", children: "\u2014" }) })
        ] }, p14.name + "-" + i6)) })
      ] })
    ] });
  }
  function PropertiesTable({ properties }) {
    if (!properties || properties.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { mt: "3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", weight: "medium", color: "gray", mb: "2", className: "subsection-label", children: "Properties" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(table_exports.Root, { variant: "surface", size: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.ColumnHeaderCell, { children: "Name" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.ColumnHeaderCell, { children: "Type" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.ColumnHeaderCell, { children: "Description" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Body, { children: properties.map((p14, i6) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p11, { size: "1", variant: "ghost", children: p14.name }) }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Cell, { children: p14.type ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p10, { gap: "1", wrap: "wrap", children: p14.type.map((t15, j) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "soft", color: "iris", size: "1", children: t15 }, j)) }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", color: "gray", children: "*" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(table_exports.Cell, { children: p14.description ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", dangerouslySetInnerHTML: { __html: p14.description } }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", color: "gray", children: "\u2014" }) })
        ] }, p14.name + "-" + i6)) })
      ] })
    ] });
  }
  function Returns({ returns }) {
    if (!returns || returns.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { mt: "3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", weight: "medium", color: "gray", mb: "1", className: "subsection-label", children: "Returns" }),
      returns.map((r25, i6) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p10, { gap: "2", align: "center", mt: "1", children: [
        r25.type && r25.type.map((t15, j) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "soft", color: "green", size: "1", children: t15 }, j)),
        r25.description && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", dangerouslySetInnerHTML: { __html: r25.description } })
      ] }, i6))
    ] });
  }
  function Throws({ exceptions }) {
    if (!exceptions || exceptions.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { mt: "3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", weight: "medium", color: "gray", mb: "1", className: "subsection-label", children: "Throws" }),
      exceptions.map((e24, i6) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p10, { gap: "2", align: "center", mt: "1", children: [
        e24.type && e24.type.map((t15, j) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "soft", color: "red", size: "1", children: t15 }, j)),
        e24.description && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", dangerouslySetInnerHTML: { __html: e24.description } })
      ] }, i6))
    ] });
  }
  function Examples({ examples }) {
    if (!examples || examples.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { mt: "3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", weight: "medium", color: "gray", mb: "2", className: "subsection-label", children: "Examples" }),
      examples.map((ex, i6) => {
        let caption = null;
        let code = ex;
        const match = ex.match(/^\s*<caption>(.*?)<\/caption>\s*([\s\S]*)/);
        if (match) {
          caption = match[1];
          code = match[2];
        }
        const highlighted = highlightCode(code.trim(), "javascript");
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { className: "code-block-wrap", mt: "2", children: [
          caption && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", color: "gray", className: "code-caption", children: caption }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("pre", { className: "code-block", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("code", { dangerouslySetInnerHTML: { __html: highlighted } }) })
        ] }, i6);
      })
    ] });
  }
  function MetaBadges({ doclet }) {
    const sig = doclet.signature || {};
    const badges = [];
    if (doclet.access && doclet.access !== "public") {
      badges.push(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "surface", color: doclet.access === "private" ? "red" : "orange", size: "1", children: doclet.access }, "access"));
    }
    if (doclet.scope === "static") {
      badges.push(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "surface", color: "blue", size: "1", children: "static" }, "static"));
    }
    if (sig.async || doclet.async) {
      badges.push(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "surface", color: "cyan", size: "1", children: "async" }, "async"));
    }
    if (sig.generator || doclet.generator) {
      badges.push(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "surface", color: "plum", size: "1", children: "generator" }, "gen"));
    }
    if (doclet.readonly) {
      badges.push(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "surface", color: "gray", size: "1", children: "readonly" }, "ro"));
    }
    if (doclet.typeMeta?.opaque) {
      badges.push(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "surface", color: "amber", size: "1", children: "opaque" }, "opaque"));
    }
    if (doclet.since) {
      badges.push(/* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(e13, { variant: "outline", color: "gray", size: "1", children: [
        "since ",
        doclet.since
      ] }, "since"));
    }
    return badges.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p10, { gap: "1", children: badges }) : null;
  }
  function TypeMetaBlock({ typeMeta }) {
    if (!typeMeta) return null;
    const parts = [];
    if (typeMeta.typeParams) parts.push(typeMeta.typeParams);
    if (typeMeta.type) parts.push("= " + typeMeta.type);
    if (typeMeta.enumValues && typeMeta.enumValues.length > 0) {
      parts.push("{ " + typeMeta.enumValues.join(", ") + " }");
    }
    if (parts.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { mt: "2", className: "flow-type-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", color: "gray", weight: "medium", className: "subsection-label", children: "Flow Type" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p7, { mt: "1", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p11, { size: "2", className: "flow-type-code", children: parts.join(" ") }) })
    ] });
  }
  function SeeAlso({ see }) {
    if (!see || see.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p7, { mt: "3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", weight: "medium", color: "gray", mb: "1", className: "subsection-label", children: "See also" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("ul", { className: "see-list", children: see.map((s11, i6) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "2", dangerouslySetInnerHTML: { __html: s11 } }) }, i6)) })
    ] });
  }
  function DocEntry({ doclet, isConstructor = false, onViewSource }) {
    const sig = getSignatureData(doclet);
    const isCallable = doclet.kind === "function" || isConstructor || doclet.signature != null;
    const isTypedef = doclet.kind === "typedef";
    const isEvent = doclet.kind === "event";
    const source = doclet.source || doclet.meta;
    const sourceFile = source ? source.file || source.filename : null;
    const sourceLine = source ? source.line || source.lineno : null;
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(o14, { className: "doc-entry", variant: "surface", "data-entry": doclet.name, children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p10, { justify: "between", align: "start", mb: "2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p10, { direction: "column", gap: "1", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p10, { align: "center", gap: "2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MetaBadges, { doclet }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "3", weight: "bold", className: "entry-name", children: doclet.name }),
          !isCallable && doclet.type && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p10, { gap: "1", children: doclet.type.map((t15, i6) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(e13, { variant: "soft", color: "iris", size: "1", children: t15 }, i6)) })
        ] }) }),
        sourceFile && onViewSource ? /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
          "button",
          {
            className: "source-ref-link",
            onClick: () => onViewSource(sourceFile, sourceLine),
            title: "View source",
            children: [
              sourceFile,
              sourceLine ? `:${sourceLine}` : ""
            ]
          }
        ) : sourceFile ? /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p, { size: "1", color: "gray", className: "source-ref", children: [
          sourceFile,
          sourceLine ? `:${sourceLine}` : ""
        ] }) : null
      ] }),
      doclet.deprecated && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p7, { className: "deprecated-notice", mb: "2", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p, { size: "2", color: "red", children: [
        "Deprecated",
        typeof doclet.deprecated === "string" ? `: ${doclet.deprecated}` : ""
      ] }) }),
      isCallable && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Signature, { doclet, isConstructor }),
      doclet.description && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p7, { className: "entry-description", mt: "2", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { dangerouslySetInnerHTML: { __html: doclet.description } }) }),
      isCallable && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ParamsTable, { params: sig.params }),
      isTypedef && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(TypeMetaBlock, { typeMeta: doclet.typeMeta }),
      isTypedef && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PropertiesTable, { properties: doclet.properties }),
      isTypedef && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ParamsTable, { params: sig.params }),
      isEvent && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ParamsTable, { params: sig.params }),
      !isCallable && !isTypedef && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PropertiesTable, { properties: doclet.properties }),
      isCallable && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Returns, { returns: sig.returns }),
      isCallable && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Throws, { exceptions: sig.exceptions }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Examples, { examples: doclet.examples }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(SeeAlso, { see: doclet.see }),
      doclet.defaultvalue && !isCallable && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(p10, { mt: "2", gap: "2", align: "center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p, { size: "1", weight: "medium", color: "gray", children: "Default:" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(p11, { size: "1", children: doclet.defaultvalue })
      ] })
    ] });
  }

  // src/SourceView.jsx
  var import_react5 = __toESM(require_react());
  var import_jsx_runtime17 = __toESM(require_jsx_runtime());
  function SourceView({ open, onClose, file, highlightedHtml, targetLine }) {
    const scrollRef = (0, import_react5.useRef)(null);
    const targetCallbackRef = (0, import_react5.useCallback)((node) => {
      if (node) {
        requestAnimationFrame(() => {
          node.scrollIntoView({ block: "center" });
        });
      }
    }, []);
    if (!open) return null;
    const lines = highlightedHtml ? highlightedHtml.split(/\r?\n/) : null;
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(dialog_exports.Root, { open, onOpenChange: (v3) => {
      if (!v3) onClose();
    }, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(dialog_exports.Content, { className: "source-dialog", size: "4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(p10, { justify: "between", align: "center", className: "source-dialog-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(p10, { align: "center", gap: "2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(e13, { variant: "surface", color: "gray", size: "1", children: "source" }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(p, { size: "2", weight: "bold", className: "source-dialog-filename", children: file }),
          targetLine && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(p, { size: "1", color: "gray", children: [
            "line ",
            targetLine
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(o17, { variant: "ghost", color: "gray", size: "1", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Cross1Icon, {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(p7, { className: "source-dialog-body", ref: scrollRef, children: lines ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("table", { className: "source-table", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("tbody", { children: lines.map((lineHtml, i6) => {
        const lineNum = i6 + 1;
        const isTarget = lineNum === targetLine;
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
          "tr",
          {
            ref: isTarget ? targetCallbackRef : void 0,
            className: `source-line ${isTarget ? "source-line--target" : ""}`,
            id: `source-L${lineNum}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("td", { className: "source-line-num", children: lineNum }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                "td",
                {
                  className: "source-line-code",
                  dangerouslySetInnerHTML: { __html: lineHtml || "&nbsp;" }
                }
              )
            ]
          },
          lineNum
        );
      }) }) }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(p10, { align: "center", justify: "center", py: "9", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(p, { size: "2", color: "gray", children: "Source not available for this file." }) }) })
    ] }) });
  }
  function SourceRef({ file, line, onClick }) {
    if (!file) return null;
    const label = line ? `${file}:${line}` : file;
    const handleClick = (0, import_react5.useCallback)((e24) => {
      e24.preventDefault();
      e24.stopPropagation();
      if (onClick) onClick(file, line);
    }, [file, line, onClick]);
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { className: "source-ref-link", onClick: handleClick, title: "View source", children: label });
  }

  // src/EntityPage.jsx
  var import_jsx_runtime18 = __toESM(require_jsx_runtime());
  function Section({ id, title, items, onViewSource }) {
    if (!items || items.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p7, { className: "doc-section", mt: "6", id, children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(r8, { size: "4", mb: "4", className: "section-title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p10, { direction: "column", gap: "3", children: items.map((item, i6) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { id: item.name, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DocEntry, { doclet: item, onViewSource }) }, item.longname || item.name + "-" + i6)) })
    ] });
  }
  function PageToc({ sections, activeMember, siblings, currentSlug, onNavigate }) {
    const [collapsed, setCollapsed] = (0, import_react6.useState)({});
    const toggleSection = (0, import_react6.useCallback)((id) => {
      setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);
    const scrollTo = (0, import_react6.useCallback)((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, []);
    if (sections.length === 0 && siblings.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p7, { className: "page-toc", children: [
      sections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p, { size: "1", weight: "bold", className: "page-toc-title", children: "ON THIS PAGE" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p10, { direction: "column", gap: "0", mt: "2", children: sections.map(({ id, title, items }) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p7, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
            "button",
            {
              className: "page-toc-section",
              onClick: () => toggleSection(id),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p10, { align: "center", gap: "1", children: [
                  collapsed[id] ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ChevronRightIcon, { width: "12", height: "12" }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ChevronDownIcon, { width: "12", height: "12" }),
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "page-toc-section-text", children: title })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "page-toc-count", children: items.length })
              ]
            }
          ),
          !collapsed[id] && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p10, { direction: "column", gap: "0", className: "page-toc-items", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "button",
            {
              className: `page-toc-item ${activeMember === item.name ? "page-toc-item--active" : ""}`,
              onClick: () => scrollTo(item.name),
              children: item.name
            },
            item.name
          )) })
        ] }, id)) })
      ] }),
      siblings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p, { size: "1", weight: "bold", className: "page-toc-title", mt: sections.length > 0 ? "4" : "0", children: "ALSO IN THIS FILE" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p10, { direction: "column", gap: "0", mt: "2", className: "page-toc-items", children: siblings.map((sib) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
          "a",
          {
            href: `#${sib.slug}`,
            className: `page-toc-sibling ${sib.slug === currentSlug ? "page-toc-sibling--current" : ""}`,
            onClick: (e24) => {
              e24.preventDefault();
              if (onNavigate) onNavigate(sib.slug);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                e13,
                {
                  variant: "surface",
                  color: KIND_COLORS[sib.kind] || "gray",
                  size: "1",
                  style: { flexShrink: 0 },
                  children: sib.kind === "function" ? "fn" : sib.kind === "constant" ? "const" : sib.kind.slice(0, 3)
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "page-toc-sibling-name", children: sib.name })
            ]
          },
          sib.slug
        )) })
      ] })
    ] });
  }
  function EntityPage({ entry, docs: docs2, onNavigate }) {
    const m6 = entry.members || {};
    const kindColor = KIND_COLORS[entry.kind] || "gray";
    const kindLabel = entry.kind.charAt(0).toUpperCase() + entry.kind.slice(1);
    const [activeMember, setActiveMember] = (0, import_react6.useState)(null);
    const contentRef = (0, import_react6.useRef)(null);
    const [sourceViewFile, setSourceViewFile] = (0, import_react6.useState)(null);
    const [sourceViewLine, setSourceViewLine] = (0, import_react6.useState)(null);
    const handleViewSource = (0, import_react6.useCallback)((file, line) => {
      setSourceViewFile(file);
      setSourceViewLine(line || null);
    }, []);
    const handleCloseSource = (0, import_react6.useCallback)(() => {
      setSourceViewFile(null);
      setSourceViewLine(null);
    }, []);
    const sections = (0, import_react6.useMemo)(() => {
      const result = [];
      const add = (id, title, items) => {
        if (items && items.length > 0) result.push({ id, title, items });
      };
      add("section-properties", "Properties", m6.properties);
      add("section-static-properties", "Static Properties", m6.staticProperties);
      add("section-methods", "Methods", m6.methods);
      add("section-static-methods", "Static Methods", m6.staticMethods);
      add("section-events", "Events", m6.events);
      add("section-typedefs", "Type Definitions", m6.typedefs);
      add("section-classes", "Classes", m6.classes);
      return result;
    }, [m6]);
    const siblings = (0, import_react6.useMemo)(() => {
      if (!docs2 || !entry.source || !entry.source.file) return [];
      const file = entry.source.file;
      const result = [];
      const slugs = Object.keys(docs2.pages);
      for (let i6 = 0; i6 < slugs.length; i6++) {
        const page = docs2.pages[slugs[i6]];
        if (page.kind === "home") continue;
        if (page.source && page.source.file === file) {
          result.push({ name: page.name, slug: page.slug, kind: page.kind });
        }
      }
      result.sort((a16, b2) => a16.name.localeCompare(b2.name));
      return result;
    }, [docs2, entry]);
    (0, import_react6.useEffect)(() => {
      const allItems = sections.flatMap((s11) => s11.items);
      if (allItems.length === 0) return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const e24 of entries) {
            if (e24.isIntersecting) {
              setActiveMember(e24.target.id);
              break;
            }
          }
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      for (const item of allItems) {
        const el = document.getElementById(item.name);
        if (el) observer.observe(el);
      }
      return () => observer.disconnect();
    }, [sections]);
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p10, { className: "entity-page-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p7, { className: "entity-page-content", ref: contentRef, children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p10, { align: "center", gap: "3", mb: "2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(e13, { variant: "solid", color: kindColor, size: "2", children: kindLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(r8, { size: "7", className: "entity-title", children: entry.name })
        ] }),
        entry.source && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          SourceRef,
          {
            file: entry.source.file,
            line: entry.source.line,
            onClick: handleViewSource
          }
        ),
        entry.augments && entry.augments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p10, { gap: "2", mt: "2", align: "center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p, { size: "2", color: "gray", children: "extends" }),
          entry.augments.map((a16) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(e13, { variant: "outline", color: "gray", children: a16 }, a16))
        ] }),
        entry.implements && entry.implements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p10, { gap: "2", mt: "2", align: "center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p, { size: "2", color: "gray", children: "implements" }),
          entry.implements.map((i6) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(e13, { variant: "outline", color: "gray", children: i6 }, i6))
        ] }),
        entry.deprecated && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p7, { className: "deprecated-notice", mt: "3", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p, { size: "2", weight: "medium", color: "red", children: [
          "Deprecated",
          typeof entry.deprecated === "string" ? `: ${entry.deprecated}` : ""
        ] }) }),
        entry.description && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p7, { className: "entity-description", mt: "4", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { dangerouslySetInnerHTML: { __html: entry.description } }) }),
        entry.typeMeta && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(p7, { mt: "4", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TypeMetaBlock, { typeMeta: entry.typeMeta }) }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(o19, { size: "4", my: "5" }),
        entry.signature && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(p7, { className: "doc-section", mt: "2", children: [
          entry.kind === "class" && entry.signature.params?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(r8, { size: "4", mb: "4", className: "section-title", children: "Constructor" }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DocEntry, { doclet: entry, isConstructor: entry.kind === "class", onViewSource: handleViewSource })
        ] }),
        sections.map(({ id, title, items }) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Section, { id, title, items, onViewSource: handleViewSource }, id))
      ] }),
      (sections.length > 0 || siblings.length > 1) && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        PageToc,
        {
          sections,
          activeMember,
          siblings: siblings.length > 1 ? siblings : [],
          currentSlug: entry.slug,
          onNavigate
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        SourceView,
        {
          open: !!sourceViewFile,
          onClose: handleCloseSource,
          file: sourceViewFile,
          highlightedHtml: sourceViewFile && docs2 ? docs2.source(sourceViewFile) : null,
          targetLine: sourceViewLine
        }
      )
    ] });
  }

  // src/App.jsx
  var import_jsx_runtime19 = __toESM(require_jsx_runtime());
  function getHash() {
    return window.location.hash.slice(1) || "home";
  }
  function getInitialAppearance() {
    try {
      const saved = localStorage.getItem("jsdoc-appearance");
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }
  function App({ docs: docs2 }) {
    const [currentSlug, setCurrentSlug] = (0, import_react7.useState)(getHash);
    const [appearance, setAppearance] = (0, import_react7.useState)(getInitialAppearance);
    (0, import_react7.useEffect)(() => {
      const handler = () => setCurrentSlug(getHash());
      window.addEventListener("hashchange", handler);
      return () => window.removeEventListener("hashchange", handler);
    }, []);
    (0, import_react7.useEffect)(() => {
      try {
        localStorage.setItem("jsdoc-appearance", appearance);
      } catch (_) {
      }
    }, [appearance]);
    const toggleAppearance = (0, import_react7.useCallback)(() => {
      setAppearance((a16) => a16 === "dark" ? "light" : "dark");
    }, []);
    const navigate = (0, import_react7.useCallback)((slug) => {
      window.location.hash = slug;
    }, []);
    const currentPage = docs2.page(currentSlug) || docs2.page("home");
    const content = !currentPage || currentPage.kind === "home" ? /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(HomePage, { readme: docs2.readme, packageInfo: docs2.packageInfo }) : /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(EntityPage, { entry: currentPage, docs: docs2, onNavigate: navigate }, currentSlug);
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      R2,
      {
        appearance,
        accentColor: "iris",
        grayColor: "slate",
        radius: "medium",
        scaling: "100%",
        children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          Layout,
          {
            docs: docs2,
            currentSlug,
            onNavigate: navigate,
            appearance,
            onToggleAppearance: toggleAppearance,
            children: content
          }
        )
      }
    );
  }

  // src/index.jsx
  var import_jsx_runtime20 = __toESM(require_jsx_runtime());
  var docs = globalThis[Symbol.for("jsdoc.content")];
  var root = (0, import_client.createRoot)(document.getElementById("root"));
  root.render(
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_react8.default.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(App, { docs }) })
  );
})();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

classnames/index.js:
  (*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  *)
*/
//# sourceMappingURL=index.js.map
