import { Writable } from 'node:stream'
import { EventEmitter } from 'node:events'
import { accessor, as, data, isDescriptor } from '@nejs/basic-extensions/utils'

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
export class StreamTap extends Writable {
  /**
   * The instance of buffer that contains the content written to this stream.
   * It is reassigned on each new write.
   */
  buffer = Buffer.alloc(0)

  /**
   * Event map for function references on listened to events on the tapped
   * stream. These can be used to manually stop listening to an event handler
   * on the tapped stream.
   */
  eventMap = new Map()

  /**
   * By default, all EventEmitter actions are passthrough by default. Meaning
   * they are not applied to the tap, but actually applied to the tapped
   * element. Other modes are Mirror and Proxy. Where Mirror mode applies all
   * actions equally to both the Tap and Target and Proxy mode writes all
   * changes to the Tap only but continues to read content from the Target.
   */
  #tapMode = StreamTap.kPassthrough

  /**
   * A {@link WeakRef} wrapper around `globalThis.process` by default. Though
   * if another owning process is specified this wrapper will wrap that instead
   */
  processRef = new WeakRef(globalThis?.process)

  /**
   * Instance of Writable to be wrapped.
   */
  streamRef = undefined

  /**
   * When creating a new custom Writable, it is stored here and referenced
   * using the streamRef param.
   */
  #stream = undefined

  /**
   * When tapping the process.stdout in a way that takes it offline, it can
   * be temporarily stored here as needed.
   */
  #strongStreamRef = undefined

  constructor(stream, options) {
    for (const eventName of [
      ...StreamTap.kWritableStreamEvents,
      ...StreamTap.kReadableStreamEvents,
      ...StreamTap.kStreamTapEvents,
    ]) {
      if (!this.eventMap.has(eventName))
        this.eventMap.set(eventName, [])
    }

    for (const [property, value] of Object.entries(EventEmitter.prototype)) {
      if (String(property).startsWith('_'))
        continue


    }

    if ([process.stdout, process.stderr].some(s => s === stream)) {
      this.tapTTY(process, stream)
    }

    super(options)
  }

  _write(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    callback();
  }

  #tapTTY(streamOwningProcess, streamToTap) {
    this.streamRef = new WeakRef(streamToTap)
    this.process = streamOwningProcess

    for (const eventName of StreamTap.kWritableStreamEvents) {
      streamToTap.on(eventName, function(event) {

      })
    }
  }

  static get TapMode() {
    return {
      Passthrough: StreamTap.kPassthrough,
      Mirror: StreamTap.kMirror,
      Proxy: StreamTap.kProxy,
      get [Symbol.toStringTag]() { return 'Enum' },
      get [Symbol.for('enum.name')]() { return 'TapMode' },
    }
  }

  /**
   * When a StreamTap is in Passthrough mode, all changes, event handler adds
   * and so on, are applies to the tapped target only.
   *
   * @type {string}
   */
  static get kPassthrough() { return 'StreamTap Passthrough Mode' }

  /**
   * When a StreamTap is in Mirror mode, all changes are applied to both the
   * tap and the underlying tapped target.
   *
   * @type {string}
   */
  static get kMirror() { return 'SteamTap Mirror Mode' }

  /**
   * When a StreamTap is in Proxy mode, all writes are sent to the StreamTap
   * and all reads are received from both the tap and the target.
   *
   * @type {string}
   */
  static get kProxy() { return 'StreamTap Proxy Mode' }

  /**
   * This constant returns an array of the stream event names for
   * Writable streams
   *
   * @type {string[]}
   */
  static get kWritableStreamEvents() {
    return ['close', 'drain', 'error', 'finish', 'pipe', 'unpipe']
  }

  /**
   * This constant returns an array of the stream event names for
   * Readable streams
   *
   * @type {string[]}
   */
  static get kReadableStreamEvents() {
    return ['close', 'data', 'end', 'error', 'pause', 'readable', 'resume']
  }

  /**
   * This constant returns and array of the stream event names for
   * StreamTap specific streams
   *
   * @type {string[]}
   */
  static get kStreamTapEvents() {
    return ['_write', '_writeev', '_final']
  }
}

export function captureStdout(callback, args, thisArg) {
  let captured = '';
  const originalWrite = process.stdout.write;

  if (typeof callback !== 'function') {
    let newArgs = [callback]
    if (thisArg) {
      newArgs.push(thisArg)
    }
    newArgs = newArgs.concat(args)

    callback = function () {
      console.log(...newArgs)
    }
    thisArg = console
    args = []
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

export function Enum(name, values, properties) {
  const enumeration = Object.create({}, {
    [Symbol.toStringTag]: accessor('Enum', false, true, false),
    [Symbol.for('Enum.name')]: accessor(name, false, true, false),
    toString: data(function() {
      return `Enum(${name})`
    }, false, true, false)
  })

  if (!Array.isArray(values)) {
    values = [values]
  }

  for (const value of values) {
    const valueType = Array.isArray(value) ? 'array' : typeof value
    let property = undefined
    let response = undefined

    let fromPrimitive = (value) => {
      let valueType = typeof value

      switch (valueType) {
        case 'string':
          case 'number':
          case 'bigint':
          case 'boolean':
          default:
            return [String(value), value]
          case 'symbol':
            return [value.description, value]
          case 'function':
            return [value.name, value]
          case 'object': {
            const str = as.string(value, {
              description: true,
              stringTag: true,
            })
            return [str, str]
          }
      }
    }

    switch (valueType) {
      default:
        ([property, response] = fromPrimitive(value))
        break

      case 'array': {
        let elements = value
        let storage = new Map()

        if (value.length >= 1) {
          ([property, response] = fromPrimitive(elements[0]))

          let realValue = accessor(response, false, { storage, key: property })

          let associatedKey = String(property) + '.associated'
          let associatedOpts = { storage, key: associatedKey }
          let associatedValue = value.length === 1
            ? accessor(undefined, true, associatedOpts)
            : accessor(value?.[1], value?.[2] ?? true, associatedOpts);

          response = new Proxy(Object(property), {
            get(target, _property, receiver) {
              if (_property === 'value')
                return associatedValue.get();

              else
                return realValue.get();
            },
            has(target, _property) {
              return ['real', 'value'].includes(_property)
            },
            ownKeys(target) {
              return ['real', 'value']
            },
            set(target, _property, value, receiver) {
              if (_property === 'value')
                return associatedValue.set(value);

              return false
            }
          })
        }
      }
    }

    Object.defineProperty(enumeration, property, accessor(response, false))
  }

  if (properties) {
    if (Array.isArray(properties)) {
      const entries = properties.filter(e => Array.isArray(e) && e.length === 2)

      if (entries.length)
        properties = new Map(entries)
      else
        properties = {}
    }

    if (properties instanceof Map) {
      const applyPropertiesOf = (object, baseDescriptor) => {
        const property = {
          configurable: baseDescriptor?.configurable ?? true,
          enumerable: baseDescriptor?.enumerable ?? true,
          writable: baseDescriptor?.writable ?? true,
        }

        for (const [key, subvalue] of Object.entries(object)) {
          if ((stats = isDescriptor(subvalue)).isValid) {
            if (stats.isAccessor || stats.isData)
              Object.defineProperty(enumeration, key, subvalue)
          }
          else
            Object.defineProperty(enumeration, key, data(subvalue, property))
        }
      }

      let stats = {}

      for (const [property, value] of properties.entries()) {
        if (isDescriptor(property)) {
          applyPropertiesOf(value, property)
        }
        else {
          enumeration[property] = value
        }
      }
    }
    else if (typeof properties === 'object') {
      applyPropertiesOf(value)
    }
  }

  return enumeration
}