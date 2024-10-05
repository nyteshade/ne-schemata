"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Enum = Enum;
exports.StreamTap = void 0;
exports.captureStdout = captureStdout;
var _nodeStream = require("node:stream");
var _nodeEvents = require("node:events");
var _utils = require("@nejs/basic-extensions/utils");
/**
 * A StreamTap creates a reference to a stream like `stdout` or `stderr` and
 * provides some options around its logging capabilities. Given that there is
 * only one of each input and output streams per process, special casing is
 * afforded those two items.
 *
 * The stream, once tapped, can be be halted, recorded, redirected or both. It
 * can also be mirrored to multiple output locations. If the supplied stream
 * object is not equivalent to `process.stdout` or `process.stderr`, less
 * framework and conditions are put in place around its tapping.
 */
class StreamTap extends _nodeStream.Writable {
  /**
   * The instance of buffer that contains the content written to this stream.
   * It is reassigned on each new write.
   */
  buffer = Buffer.alloc(0);

  /**
   * Event map for function references on listened to events on the tapped
   * stream. These can be used to manually stop listening to an event handler
   * on the tapped stream.
   */
  eventMap = new Map();

  /**
   * By default, all EventEmitter actions are passthrough by default. Meaning
   * they are not applied to the tap, but actually applied to the tapped
   * element. Other modes are Mirror and Proxy. Where Mirror mode applies all
   * actions equally to both the Tap and Target and Proxy mode writes all
   * changes to the Tap only but continues to read content from the Target.
   */
  #tapMode = StreamTap.kPassthrough;

  /**
   * A {@link WeakRef} wrapper around `globalThis.process` by default. Though
   * if another owning process is specified this wrapper will wrap that instead
   */
  processRef = new WeakRef(globalThis?.process);

  /**
   * Instance of Writable to be wrapped.
   */
  streamRef = undefined;

  /**
   * When creating a new custom Writable, it is stored here and referenced
   * using the streamRef param.
   */
  #stream = undefined;

  /**
   * When tapping the process.stdout in a way that takes it offline, it can
   * be temporarily stored here as needed.
   */
  #strongStreamRef = undefined;
  constructor(stream, options) {
    for (const eventName of [...StreamTap.kWritableStreamEvents, ...StreamTap.kReadableStreamEvents, ...StreamTap.kStreamTapEvents]) {
      if (!this.eventMap.has(eventName)) this.eventMap.set(eventName, []);
    }
    for (const [property, value] of Object.entries(_nodeEvents.EventEmitter.prototype)) {
      if (String(property).startsWith('_')) continue;
    }
    if ([process.stdout, process.stderr].some(s => s === stream)) {
      this.tapTTY(process, stream);
    }
    super(options);
  }
  _write(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    callback();
  }
  #tapTTY(streamOwningProcess, streamToTap) {
    this.streamRef = new WeakRef(streamToTap);
    this.process = streamOwningProcess;
    for (const eventName of StreamTap.kWritableStreamEvents) {
      streamToTap.on(eventName, function (event) {});
    }
  }
  static get TapMode() {
    return {
      Passthrough: StreamTap.kPassthrough,
      Mirror: StreamTap.kMirror,
      Proxy: StreamTap.kProxy,
      get [Symbol.toStringTag]() {
        return 'Enum';
      },
      get [Symbol.for('enum.name')]() {
        return 'TapMode';
      }
    };
  }

  /**
   * When a StreamTap is in Passthrough mode, all changes, event handler adds
   * and so on, are applies to the tapped target only.
   *
   * @type {string}
   */
  static get kPassthrough() {
    return 'StreamTap Passthrough Mode';
  }

  /**
   * When a StreamTap is in Mirror mode, all changes are applied to both the
   * tap and the underlying tapped target.
   *
   * @type {string}
   */
  static get kMirror() {
    return 'SteamTap Mirror Mode';
  }

  /**
   * When a StreamTap is in Proxy mode, all writes are sent to the StreamTap
   * and all reads are received from both the tap and the target.
   *
   * @type {string}
   */
  static get kProxy() {
    return 'StreamTap Proxy Mode';
  }

  /**
   * This constant returns an array of the stream event names for
   * Writable streams
   *
   * @type {string[]}
   */
  static get kWritableStreamEvents() {
    return ['close', 'drain', 'error', 'finish', 'pipe', 'unpipe'];
  }

  /**
   * This constant returns an array of the stream event names for
   * Readable streams
   *
   * @type {string[]}
   */
  static get kReadableStreamEvents() {
    return ['close', 'data', 'end', 'error', 'pause', 'readable', 'resume'];
  }

  /**
   * This constant returns and array of the stream event names for
   * StreamTap specific streams
   *
   * @type {string[]}
   */
  static get kStreamTapEvents() {
    return ['_write', '_writeev', '_final'];
  }
}
exports.StreamTap = StreamTap;
function captureStdout(callback, args, thisArg) {
  let captured = '';
  const originalWrite = process.stdout.write;
  if (typeof callback !== 'function') {
    let newArgs = [callback];
    if (thisArg) {
      newArgs.push(thisArg);
    }
    newArgs = newArgs.concat(args);
    callback = function () {
      console.log(...newArgs);
    };
    thisArg = console;
    args = [];
  }

  // Override process.stdout.write
  process.stdout.write = (chunk, encoding, fd) => {
    captured += chunk; // Append output to the string instead of printing it
  };
  try {
    callback.apply(thisArg, args); // Call the function that would print to stdout
  } finally {
    // Restore the original process.stdout.write
    process.stdout.write = originalWrite;
  }
  return captured.substring(0, captured.length - 1);
}
function Enum(name, values, properties) {
  const enumeration = Object.create({}, {
    [Symbol.toStringTag]: (0, _utils.accessor)('Enum', false, true, false),
    [Symbol.for('Enum.name')]: (0, _utils.accessor)(name, false, true, false),
    toString: (0, _utils.data)(function () {
      return `Enum(${name})`;
    }, false, true, false)
  });
  if (!Array.isArray(values)) {
    values = [values];
  }
  for (const value of values) {
    const valueType = Array.isArray(value) ? 'array' : typeof value;
    let property = undefined;
    let response = undefined;
    let fromPrimitive = value => {
      let valueType = typeof value;
      switch (valueType) {
        case 'string':
        case 'number':
        case 'bigint':
        case 'boolean':
        default:
          return [String(value), value];
        case 'symbol':
          return [value.description, value];
        case 'function':
          return [value.name, value];
        case 'object':
          {
            const str = _utils.as.string(value, {
              description: true,
              stringTag: true
            });
            return [str, str];
          }
      }
    };
    switch (valueType) {
      default:
        [property, response] = fromPrimitive(value);
        break;
      case 'array':
        {
          let elements = value;
          let storage = new Map();
          if (value.length >= 1) {
            [property, response] = fromPrimitive(elements[0]);
            let realValue = (0, _utils.accessor)(response, false, {
              storage,
              key: property
            });
            let associatedKey = String(property) + '.associated';
            let associatedOpts = {
              storage,
              key: associatedKey
            };
            let associatedValue = value.length === 1 ? (0, _utils.accessor)(undefined, true, associatedOpts) : (0, _utils.accessor)(value?.[1], value?.[2] ?? true, associatedOpts);
            response = new Proxy(Object(property), {
              get(target, _property, receiver) {
                if (_property === 'value') return associatedValue.get();else return realValue.get();
              },
              has(target, _property) {
                return ['real', 'value'].includes(_property);
              },
              ownKeys(target) {
                return ['real', 'value'];
              },
              set(target, _property, value, receiver) {
                if (_property === 'value') return associatedValue.set(value);
                return false;
              }
            });
          }
        }
    }
    Object.defineProperty(enumeration, property, (0, _utils.accessor)(response, false));
  }
  if (properties) {
    if (Array.isArray(properties)) {
      const entries = properties.filter(e => Array.isArray(e) && e.length === 2);
      if (entries.length) properties = new Map(entries);else properties = {};
    }
    if (properties instanceof Map) {
      const applyPropertiesOf = (object, baseDescriptor) => {
        const property = {
          configurable: baseDescriptor?.configurable ?? true,
          enumerable: baseDescriptor?.enumerable ?? true,
          writable: baseDescriptor?.writable ?? true
        };
        for (const [key, subvalue] of Object.entries(object)) {
          if ((stats = (0, _utils.isDescriptor)(subvalue)).isValid) {
            if (stats.isAccessor || stats.isData) Object.defineProperty(enumeration, key, subvalue);
          } else Object.defineProperty(enumeration, key, (0, _utils.data)(subvalue, property));
        }
      };
      let stats = {};
      for (const [property, value] of properties.entries()) {
        if ((0, _utils.isDescriptor)(property)) {
          applyPropertiesOf(value, property);
        } else {
          enumeration[property] = value;
        }
      }
    } else if (typeof properties === 'object') {
      applyPropertiesOf(value);
    }
  }
  return enumeration;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbm9kZVN0cmVhbSIsInJlcXVpcmUiLCJfbm9kZUV2ZW50cyIsIl91dGlscyIsIlN0cmVhbVRhcCIsIldyaXRhYmxlIiwiYnVmZmVyIiwiQnVmZmVyIiwiYWxsb2MiLCJldmVudE1hcCIsIk1hcCIsInRhcE1vZGUiLCJrUGFzc3Rocm91Z2giLCJwcm9jZXNzUmVmIiwiV2Vha1JlZiIsImdsb2JhbFRoaXMiLCJwcm9jZXNzIiwic3RyZWFtUmVmIiwidW5kZWZpbmVkIiwic3RyZWFtIiwic3Ryb25nU3RyZWFtUmVmIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiZXZlbnROYW1lIiwia1dyaXRhYmxlU3RyZWFtRXZlbnRzIiwia1JlYWRhYmxlU3RyZWFtRXZlbnRzIiwia1N0cmVhbVRhcEV2ZW50cyIsImhhcyIsInNldCIsInByb3BlcnR5IiwidmFsdWUiLCJPYmplY3QiLCJlbnRyaWVzIiwiRXZlbnRFbWl0dGVyIiwicHJvdG90eXBlIiwiU3RyaW5nIiwic3RhcnRzV2l0aCIsInN0ZG91dCIsInN0ZGVyciIsInNvbWUiLCJzIiwidGFwVFRZIiwiX3dyaXRlIiwiY2h1bmsiLCJlbmNvZGluZyIsImNhbGxiYWNrIiwiY29uY2F0IiwiI3RhcFRUWSIsInN0cmVhbU93bmluZ1Byb2Nlc3MiLCJzdHJlYW1Ub1RhcCIsIm9uIiwiZXZlbnQiLCJUYXBNb2RlIiwiUGFzc3Rocm91Z2giLCJNaXJyb3IiLCJrTWlycm9yIiwiUHJveHkiLCJrUHJveHkiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImZvciIsImV4cG9ydHMiLCJjYXB0dXJlU3Rkb3V0IiwiYXJncyIsInRoaXNBcmciLCJjYXB0dXJlZCIsIm9yaWdpbmFsV3JpdGUiLCJ3cml0ZSIsIm5ld0FyZ3MiLCJwdXNoIiwiY29uc29sZSIsImxvZyIsImZkIiwiYXBwbHkiLCJzdWJzdHJpbmciLCJsZW5ndGgiLCJFbnVtIiwibmFtZSIsInZhbHVlcyIsInByb3BlcnRpZXMiLCJlbnVtZXJhdGlvbiIsImNyZWF0ZSIsImFjY2Vzc29yIiwidG9TdHJpbmciLCJkYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwidmFsdWVUeXBlIiwicmVzcG9uc2UiLCJmcm9tUHJpbWl0aXZlIiwiZGVzY3JpcHRpb24iLCJzdHIiLCJhcyIsInN0cmluZyIsInN0cmluZ1RhZyIsImVsZW1lbnRzIiwic3RvcmFnZSIsInJlYWxWYWx1ZSIsImtleSIsImFzc29jaWF0ZWRLZXkiLCJhc3NvY2lhdGVkT3B0cyIsImFzc29jaWF0ZWRWYWx1ZSIsImdldCIsInRhcmdldCIsIl9wcm9wZXJ0eSIsInJlY2VpdmVyIiwiaW5jbHVkZXMiLCJvd25LZXlzIiwiZGVmaW5lUHJvcGVydHkiLCJmaWx0ZXIiLCJlIiwiYXBwbHlQcm9wZXJ0aWVzT2YiLCJvYmplY3QiLCJiYXNlRGVzY3JpcHRvciIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsInN1YnZhbHVlIiwic3RhdHMiLCJpc0Rlc2NyaXB0b3IiLCJpc1ZhbGlkIiwiaXNBY2Nlc3NvciIsImlzRGF0YSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zbG9nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdyaXRhYmxlIH0gZnJvbSAnbm9kZTpzdHJlYW0nXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdub2RlOmV2ZW50cydcbmltcG9ydCB7IGFjY2Vzc29yLCBhcywgZGF0YSwgaXNEZXNjcmlwdG9yIH0gZnJvbSAnQG5lanMvYmFzaWMtZXh0ZW5zaW9ucy91dGlscydcblxuLyoqXG4gKiBBIFN0cmVhbVRhcCBjcmVhdGVzIGEgcmVmZXJlbmNlIHRvIGEgc3RyZWFtIGxpa2UgYHN0ZG91dGAgb3IgYHN0ZGVycmAgYW5kXG4gKiBwcm92aWRlcyBzb21lIG9wdGlvbnMgYXJvdW5kIGl0cyBsb2dnaW5nIGNhcGFiaWxpdGllcy4gR2l2ZW4gdGhhdCB0aGVyZSBpc1xuICogb25seSBvbmUgb2YgZWFjaCBpbnB1dCBhbmQgb3V0cHV0IHN0cmVhbXMgcGVyIHByb2Nlc3MsIHNwZWNpYWwgY2FzaW5nIGlzXG4gKiBhZmZvcmRlZCB0aG9zZSB0d28gaXRlbXMuXG4gKlxuICogVGhlIHN0cmVhbSwgb25jZSB0YXBwZWQsIGNhbiBiZSBiZSBoYWx0ZWQsIHJlY29yZGVkLCByZWRpcmVjdGVkIG9yIGJvdGguIEl0XG4gKiBjYW4gYWxzbyBiZSBtaXJyb3JlZCB0byBtdWx0aXBsZSBvdXRwdXQgbG9jYXRpb25zLiBJZiB0aGUgc3VwcGxpZWQgc3RyZWFtXG4gKiBvYmplY3QgaXMgbm90IGVxdWl2YWxlbnQgdG8gYHByb2Nlc3Muc3Rkb3V0YCBvciBgcHJvY2Vzcy5zdGRlcnJgLCBsZXNzXG4gKiBmcmFtZXdvcmsgYW5kIGNvbmRpdGlvbnMgYXJlIHB1dCBpbiBwbGFjZSBhcm91bmQgaXRzIHRhcHBpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW1UYXAgZXh0ZW5kcyBXcml0YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgYnVmZmVyIHRoYXQgY29udGFpbnMgdGhlIGNvbnRlbnQgd3JpdHRlbiB0byB0aGlzIHN0cmVhbS5cbiAgICogSXQgaXMgcmVhc3NpZ25lZCBvbiBlYWNoIG5ldyB3cml0ZS5cbiAgICovXG4gIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKVxuXG4gIC8qKlxuICAgKiBFdmVudCBtYXAgZm9yIGZ1bmN0aW9uIHJlZmVyZW5jZXMgb24gbGlzdGVuZWQgdG8gZXZlbnRzIG9uIHRoZSB0YXBwZWRcbiAgICogc3RyZWFtLiBUaGVzZSBjYW4gYmUgdXNlZCB0byBtYW51YWxseSBzdG9wIGxpc3RlbmluZyB0byBhbiBldmVudCBoYW5kbGVyXG4gICAqIG9uIHRoZSB0YXBwZWQgc3RyZWFtLlxuICAgKi9cbiAgZXZlbnRNYXAgPSBuZXcgTWFwKClcblxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgYWxsIEV2ZW50RW1pdHRlciBhY3Rpb25zIGFyZSBwYXNzdGhyb3VnaCBieSBkZWZhdWx0LiBNZWFuaW5nXG4gICAqIHRoZXkgYXJlIG5vdCBhcHBsaWVkIHRvIHRoZSB0YXAsIGJ1dCBhY3R1YWxseSBhcHBsaWVkIHRvIHRoZSB0YXBwZWRcbiAgICogZWxlbWVudC4gT3RoZXIgbW9kZXMgYXJlIE1pcnJvciBhbmQgUHJveHkuIFdoZXJlIE1pcnJvciBtb2RlIGFwcGxpZXMgYWxsXG4gICAqIGFjdGlvbnMgZXF1YWxseSB0byBib3RoIHRoZSBUYXAgYW5kIFRhcmdldCBhbmQgUHJveHkgbW9kZSB3cml0ZXMgYWxsXG4gICAqIGNoYW5nZXMgdG8gdGhlIFRhcCBvbmx5IGJ1dCBjb250aW51ZXMgdG8gcmVhZCBjb250ZW50IGZyb20gdGhlIFRhcmdldC5cbiAgICovXG4gICN0YXBNb2RlID0gU3RyZWFtVGFwLmtQYXNzdGhyb3VnaFxuXG4gIC8qKlxuICAgKiBBIHtAbGluayBXZWFrUmVmfSB3cmFwcGVyIGFyb3VuZCBgZ2xvYmFsVGhpcy5wcm9jZXNzYCBieSBkZWZhdWx0LiBUaG91Z2hcbiAgICogaWYgYW5vdGhlciBvd25pbmcgcHJvY2VzcyBpcyBzcGVjaWZpZWQgdGhpcyB3cmFwcGVyIHdpbGwgd3JhcCB0aGF0IGluc3RlYWRcbiAgICovXG4gIHByb2Nlc3NSZWYgPSBuZXcgV2Vha1JlZihnbG9iYWxUaGlzPy5wcm9jZXNzKVxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBvZiBXcml0YWJsZSB0byBiZSB3cmFwcGVkLlxuICAgKi9cbiAgc3RyZWFtUmVmID0gdW5kZWZpbmVkXG5cbiAgLyoqXG4gICAqIFdoZW4gY3JlYXRpbmcgYSBuZXcgY3VzdG9tIFdyaXRhYmxlLCBpdCBpcyBzdG9yZWQgaGVyZSBhbmQgcmVmZXJlbmNlZFxuICAgKiB1c2luZyB0aGUgc3RyZWFtUmVmIHBhcmFtLlxuICAgKi9cbiAgI3N0cmVhbSA9IHVuZGVmaW5lZFxuXG4gIC8qKlxuICAgKiBXaGVuIHRhcHBpbmcgdGhlIHByb2Nlc3Muc3Rkb3V0IGluIGEgd2F5IHRoYXQgdGFrZXMgaXQgb2ZmbGluZSwgaXQgY2FuXG4gICAqIGJlIHRlbXBvcmFyaWx5IHN0b3JlZCBoZXJlIGFzIG5lZWRlZC5cbiAgICovXG4gICNzdHJvbmdTdHJlYW1SZWYgPSB1bmRlZmluZWRcblxuICBjb25zdHJ1Y3RvcihzdHJlYW0sIG9wdGlvbnMpIHtcbiAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBvZiBbXG4gICAgICAuLi5TdHJlYW1UYXAua1dyaXRhYmxlU3RyZWFtRXZlbnRzLFxuICAgICAgLi4uU3RyZWFtVGFwLmtSZWFkYWJsZVN0cmVhbUV2ZW50cyxcbiAgICAgIC4uLlN0cmVhbVRhcC5rU3RyZWFtVGFwRXZlbnRzLFxuICAgIF0pIHtcbiAgICAgIGlmICghdGhpcy5ldmVudE1hcC5oYXMoZXZlbnROYW1lKSlcbiAgICAgICAgdGhpcy5ldmVudE1hcC5zZXQoZXZlbnROYW1lLCBbXSlcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKEV2ZW50RW1pdHRlci5wcm90b3R5cGUpKSB7XG4gICAgICBpZiAoU3RyaW5nKHByb3BlcnR5KS5zdGFydHNXaXRoKCdfJykpXG4gICAgICAgIGNvbnRpbnVlXG5cblxuICAgIH1cblxuICAgIGlmIChbcHJvY2Vzcy5zdGRvdXQsIHByb2Nlc3Muc3RkZXJyXS5zb21lKHMgPT4gcyA9PT0gc3RyZWFtKSkge1xuICAgICAgdGhpcy50YXBUVFkocHJvY2Vzcywgc3RyZWFtKVxuICAgIH1cblxuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBfd3JpdGUoY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICAgIHRoaXMuYnVmZmVyID0gQnVmZmVyLmNvbmNhdChbdGhpcy5idWZmZXIsIGNodW5rXSk7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxuXG4gICN0YXBUVFkoc3RyZWFtT3duaW5nUHJvY2Vzcywgc3RyZWFtVG9UYXApIHtcbiAgICB0aGlzLnN0cmVhbVJlZiA9IG5ldyBXZWFrUmVmKHN0cmVhbVRvVGFwKVxuICAgIHRoaXMucHJvY2VzcyA9IHN0cmVhbU93bmluZ1Byb2Nlc3NcblxuICAgIGZvciAoY29uc3QgZXZlbnROYW1lIG9mIFN0cmVhbVRhcC5rV3JpdGFibGVTdHJlYW1FdmVudHMpIHtcbiAgICAgIHN0cmVhbVRvVGFwLm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0IFRhcE1vZGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFBhc3N0aHJvdWdoOiBTdHJlYW1UYXAua1Bhc3N0aHJvdWdoLFxuICAgICAgTWlycm9yOiBTdHJlYW1UYXAua01pcnJvcixcbiAgICAgIFByb3h5OiBTdHJlYW1UYXAua1Byb3h5LFxuICAgICAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkgeyByZXR1cm4gJ0VudW0nIH0sXG4gICAgICBnZXQgW1N5bWJvbC5mb3IoJ2VudW0ubmFtZScpXSgpIHsgcmV0dXJuICdUYXBNb2RlJyB9LFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGEgU3RyZWFtVGFwIGlzIGluIFBhc3N0aHJvdWdoIG1vZGUsIGFsbCBjaGFuZ2VzLCBldmVudCBoYW5kbGVyIGFkZHNcbiAgICogYW5kIHNvIG9uLCBhcmUgYXBwbGllcyB0byB0aGUgdGFwcGVkIHRhcmdldCBvbmx5LlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBrUGFzc3Rocm91Z2goKSB7IHJldHVybiAnU3RyZWFtVGFwIFBhc3N0aHJvdWdoIE1vZGUnIH1cblxuICAvKipcbiAgICogV2hlbiBhIFN0cmVhbVRhcCBpcyBpbiBNaXJyb3IgbW9kZSwgYWxsIGNoYW5nZXMgYXJlIGFwcGxpZWQgdG8gYm90aCB0aGVcbiAgICogdGFwIGFuZCB0aGUgdW5kZXJseWluZyB0YXBwZWQgdGFyZ2V0LlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBrTWlycm9yKCkgeyByZXR1cm4gJ1N0ZWFtVGFwIE1pcnJvciBNb2RlJyB9XG5cbiAgLyoqXG4gICAqIFdoZW4gYSBTdHJlYW1UYXAgaXMgaW4gUHJveHkgbW9kZSwgYWxsIHdyaXRlcyBhcmUgc2VudCB0byB0aGUgU3RyZWFtVGFwXG4gICAqIGFuZCBhbGwgcmVhZHMgYXJlIHJlY2VpdmVkIGZyb20gYm90aCB0aGUgdGFwIGFuZCB0aGUgdGFyZ2V0LlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBrUHJveHkoKSB7IHJldHVybiAnU3RyZWFtVGFwIFByb3h5IE1vZGUnIH1cblxuICAvKipcbiAgICogVGhpcyBjb25zdGFudCByZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBzdHJlYW0gZXZlbnQgbmFtZXMgZm9yXG4gICAqIFdyaXRhYmxlIHN0cmVhbXNcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgKi9cbiAgc3RhdGljIGdldCBrV3JpdGFibGVTdHJlYW1FdmVudHMoKSB7XG4gICAgcmV0dXJuIFsnY2xvc2UnLCAnZHJhaW4nLCAnZXJyb3InLCAnZmluaXNoJywgJ3BpcGUnLCAndW5waXBlJ11cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGNvbnN0YW50IHJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHN0cmVhbSBldmVudCBuYW1lcyBmb3JcbiAgICogUmVhZGFibGUgc3RyZWFtc1xuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAqL1xuICBzdGF0aWMgZ2V0IGtSZWFkYWJsZVN0cmVhbUV2ZW50cygpIHtcbiAgICByZXR1cm4gWydjbG9zZScsICdkYXRhJywgJ2VuZCcsICdlcnJvcicsICdwYXVzZScsICdyZWFkYWJsZScsICdyZXN1bWUnXVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgY29uc3RhbnQgcmV0dXJucyBhbmQgYXJyYXkgb2YgdGhlIHN0cmVhbSBldmVudCBuYW1lcyBmb3JcbiAgICogU3RyZWFtVGFwIHNwZWNpZmljIHN0cmVhbXNcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgKi9cbiAgc3RhdGljIGdldCBrU3RyZWFtVGFwRXZlbnRzKCkge1xuICAgIHJldHVybiBbJ193cml0ZScsICdfd3JpdGVldicsICdfZmluYWwnXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlU3Rkb3V0KGNhbGxiYWNrLCBhcmdzLCB0aGlzQXJnKSB7XG4gIGxldCBjYXB0dXJlZCA9ICcnO1xuICBjb25zdCBvcmlnaW5hbFdyaXRlID0gcHJvY2Vzcy5zdGRvdXQud3JpdGU7XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCBuZXdBcmdzID0gW2NhbGxiYWNrXVxuICAgIGlmICh0aGlzQXJnKSB7XG4gICAgICBuZXdBcmdzLnB1c2godGhpc0FyZylcbiAgICB9XG4gICAgbmV3QXJncyA9IG5ld0FyZ3MuY29uY2F0KGFyZ3MpXG5cbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKC4uLm5ld0FyZ3MpXG4gICAgfVxuICAgIHRoaXNBcmcgPSBjb25zb2xlXG4gICAgYXJncyA9IFtdXG4gIH1cblxuICAvLyBPdmVycmlkZSBwcm9jZXNzLnN0ZG91dC53cml0ZVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZSA9IChjaHVuaywgZW5jb2RpbmcsIGZkKSA9PiB7XG4gICAgY2FwdHVyZWQgKz0gY2h1bms7IC8vIEFwcGVuZCBvdXRwdXQgdG8gdGhlIHN0cmluZyBpbnN0ZWFkIG9mIHByaW50aW5nIGl0XG4gIH07XG5cbiAgdHJ5IHtcbiAgICBjYWxsYmFjay5hcHBseSh0aGlzQXJnLCBhcmdzKTsgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdGhhdCB3b3VsZCBwcmludCB0byBzdGRvdXRcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBwcm9jZXNzLnN0ZG91dC53cml0ZVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlID0gb3JpZ2luYWxXcml0ZTtcbiAgfVxuXG4gIHJldHVybiBjYXB0dXJlZC5zdWJzdHJpbmcoMCwgY2FwdHVyZWQubGVuZ3RoIC0gMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbnVtKG5hbWUsIHZhbHVlcywgcHJvcGVydGllcykge1xuICBjb25zdCBlbnVtZXJhdGlvbiA9IE9iamVjdC5jcmVhdGUoe30sIHtcbiAgICBbU3ltYm9sLnRvU3RyaW5nVGFnXTogYWNjZXNzb3IoJ0VudW0nLCBmYWxzZSwgdHJ1ZSwgZmFsc2UpLFxuICAgIFtTeW1ib2wuZm9yKCdFbnVtLm5hbWUnKV06IGFjY2Vzc29yKG5hbWUsIGZhbHNlLCB0cnVlLCBmYWxzZSksXG4gICAgdG9TdHJpbmc6IGRhdGEoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYEVudW0oJHtuYW1lfSlgXG4gICAgfSwgZmFsc2UsIHRydWUsIGZhbHNlKVxuICB9KVxuXG4gIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgdmFsdWVzID0gW3ZhbHVlc11cbiAgfVxuXG4gIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgY29uc3QgdmFsdWVUeXBlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyAnYXJyYXknIDogdHlwZW9mIHZhbHVlXG4gICAgbGV0IHByb3BlcnR5ID0gdW5kZWZpbmVkXG4gICAgbGV0IHJlc3BvbnNlID0gdW5kZWZpbmVkXG5cbiAgICBsZXQgZnJvbVByaW1pdGl2ZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgbGV0IHZhbHVlVHlwZSA9IHR5cGVvZiB2YWx1ZVxuXG4gICAgICBzd2l0Y2ggKHZhbHVlVHlwZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgY2FzZSAnYmlnaW50JzpcbiAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFtTdHJpbmcodmFsdWUpLCB2YWx1ZV1cbiAgICAgICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICAgICAgcmV0dXJuIFt2YWx1ZS5kZXNjcmlwdGlvbiwgdmFsdWVdXG4gICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgcmV0dXJuIFt2YWx1ZS5uYW1lLCB2YWx1ZV1cbiAgICAgICAgICBjYXNlICdvYmplY3QnOiB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSBhcy5zdHJpbmcodmFsdWUsIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRydWUsXG4gICAgICAgICAgICAgIHN0cmluZ1RhZzogdHJ1ZSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gW3N0ciwgc3RyXVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKHZhbHVlVHlwZSkge1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgKFtwcm9wZXJ0eSwgcmVzcG9uc2VdID0gZnJvbVByaW1pdGl2ZSh2YWx1ZSkpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgJ2FycmF5Jzoge1xuICAgICAgICBsZXQgZWxlbWVudHMgPSB2YWx1ZVxuICAgICAgICBsZXQgc3RvcmFnZSA9IG5ldyBNYXAoKVxuXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gMSkge1xuICAgICAgICAgIChbcHJvcGVydHksIHJlc3BvbnNlXSA9IGZyb21QcmltaXRpdmUoZWxlbWVudHNbMF0pKVxuXG4gICAgICAgICAgbGV0IHJlYWxWYWx1ZSA9IGFjY2Vzc29yKHJlc3BvbnNlLCBmYWxzZSwgeyBzdG9yYWdlLCBrZXk6IHByb3BlcnR5IH0pXG5cbiAgICAgICAgICBsZXQgYXNzb2NpYXRlZEtleSA9IFN0cmluZyhwcm9wZXJ0eSkgKyAnLmFzc29jaWF0ZWQnXG4gICAgICAgICAgbGV0IGFzc29jaWF0ZWRPcHRzID0geyBzdG9yYWdlLCBrZXk6IGFzc29jaWF0ZWRLZXkgfVxuICAgICAgICAgIGxldCBhc3NvY2lhdGVkVmFsdWUgPSB2YWx1ZS5sZW5ndGggPT09IDFcbiAgICAgICAgICAgID8gYWNjZXNzb3IodW5kZWZpbmVkLCB0cnVlLCBhc3NvY2lhdGVkT3B0cylcbiAgICAgICAgICAgIDogYWNjZXNzb3IodmFsdWU/LlsxXSwgdmFsdWU/LlsyXSA/PyB0cnVlLCBhc3NvY2lhdGVkT3B0cyk7XG5cbiAgICAgICAgICByZXNwb25zZSA9IG5ldyBQcm94eShPYmplY3QocHJvcGVydHkpLCB7XG4gICAgICAgICAgICBnZXQodGFyZ2V0LCBfcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICAgIGlmIChfcHJvcGVydHkgPT09ICd2YWx1ZScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzc29jaWF0ZWRWYWx1ZS5nZXQoKTtcblxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWxWYWx1ZS5nZXQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoYXModGFyZ2V0LCBfcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFsncmVhbCcsICd2YWx1ZSddLmluY2x1ZGVzKF9wcm9wZXJ0eSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvd25LZXlzKHRhcmdldCkge1xuICAgICAgICAgICAgICByZXR1cm4gWydyZWFsJywgJ3ZhbHVlJ11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQodGFyZ2V0LCBfcHJvcGVydHksIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgICAgICAgICBpZiAoX3Byb3BlcnR5ID09PSAndmFsdWUnKVxuICAgICAgICAgICAgICAgIHJldHVybiBhc3NvY2lhdGVkVmFsdWUuc2V0KHZhbHVlKTtcblxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVudW1lcmF0aW9uLCBwcm9wZXJ0eSwgYWNjZXNzb3IocmVzcG9uc2UsIGZhbHNlKSlcbiAgfVxuXG4gIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcGVydGllcykpIHtcbiAgICAgIGNvbnN0IGVudHJpZXMgPSBwcm9wZXJ0aWVzLmZpbHRlcihlID0+IEFycmF5LmlzQXJyYXkoZSkgJiYgZS5sZW5ndGggPT09IDIpXG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aClcbiAgICAgICAgcHJvcGVydGllcyA9IG5ldyBNYXAoZW50cmllcylcbiAgICAgIGVsc2VcbiAgICAgICAgcHJvcGVydGllcyA9IHt9XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGNvbnN0IGFwcGx5UHJvcGVydGllc09mID0gKG9iamVjdCwgYmFzZURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiBiYXNlRGVzY3JpcHRvcj8uY29uZmlndXJhYmxlID8/IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogYmFzZURlc2NyaXB0b3I/LmVudW1lcmFibGUgPz8gdHJ1ZSxcbiAgICAgICAgICB3cml0YWJsZTogYmFzZURlc2NyaXB0b3I/LndyaXRhYmxlID8/IHRydWUsXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHN1YnZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XG4gICAgICAgICAgaWYgKChzdGF0cyA9IGlzRGVzY3JpcHRvcihzdWJ2YWx1ZSkpLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIGlmIChzdGF0cy5pc0FjY2Vzc29yIHx8IHN0YXRzLmlzRGF0YSlcbiAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVudW1lcmF0aW9uLCBrZXksIHN1YnZhbHVlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW51bWVyYXRpb24sIGtleSwgZGF0YShzdWJ2YWx1ZSwgcHJvcGVydHkpKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBzdGF0cyA9IHt9XG5cbiAgICAgIGZvciAoY29uc3QgW3Byb3BlcnR5LCB2YWx1ZV0gb2YgcHJvcGVydGllcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgaWYgKGlzRGVzY3JpcHRvcihwcm9wZXJ0eSkpIHtcbiAgICAgICAgICBhcHBseVByb3BlcnRpZXNPZih2YWx1ZSwgcHJvcGVydHkpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZW51bWVyYXRpb25bcHJvcGVydHldID0gdmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFwcGx5UHJvcGVydGllc09mKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbnVtZXJhdGlvblxufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFBQSxXQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxXQUFBLEdBQUFELE9BQUE7QUFDQSxJQUFBRSxNQUFBLEdBQUFGLE9BQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTUcsU0FBUyxTQUFTQyxvQkFBUSxDQUFDO0VBQ3RDO0FBQ0Y7QUFDQTtBQUNBO0VBQ0VDLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztFQUV4QjtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBQ0VDLFFBQVEsR0FBRyxJQUFJQyxHQUFHLENBQUMsQ0FBQzs7RUFFcEI7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDRSxDQUFDQyxPQUFPLEdBQUdQLFNBQVMsQ0FBQ1EsWUFBWTs7RUFFakM7QUFDRjtBQUNBO0FBQ0E7RUFDRUMsVUFBVSxHQUFHLElBQUlDLE9BQU8sQ0FBQ0MsVUFBVSxFQUFFQyxPQUFPLENBQUM7O0VBRTdDO0FBQ0Y7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
//# sourceMappingURL=slog.js.map