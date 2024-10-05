const repl = await import('node:repl');
const fs = await import('node:fs');
const project = JSON.parse(String(fs.readFileSync('./package.json')));

/**
 * Default prompt character used in the REPL.
 *
 * @constant {string} kDefaultPrompt
 * @default
 * @example
 * console.log(kDefaultPrompt) // Output: 'λ'
 */
const kDefaultPrompt = 'λ'

/**
 * Formats the given text in red color for terminal output.
 *
 * This function uses ANSI escape codes to colorize text. The default
 * additional character appended to the text is a space.
 *
 * @function
 * @param {string} text - The text to be colorized.
 * @param {string} [plus=' '] - An optional string to append after the text.
 * @returns {string} The colorized text with the appended string.
 * @example
 * console.log(red('Error')) // Output: '\x1b[31mError\x1b[1;39m\x1b[22m '
 */
const red = (text, plus = ' ') =>
  `\x1b[31m${text}\x1b[1;39m\x1b[22m${plus}`

/**
 * Formats the given text in green color for terminal output.
 *
 * This function uses ANSI escape codes to colorize text. The default
 * additional character appended to the text is a space.
 *
 * @function
 * @param {string} text - The text to be colorized.
 * @param {string} [plus=' '] - An optional string to append after the text.
 * @returns {string} The colorized text with the appended string.
 * @example
 * console.log(green('Success')) // Output: '\x1b[32mSuccess\x1b[1;39m\x1b[22m '
 */
const green = (text, plus = ' ') =>
  `\x1b[32m${text}\x1b[1;39m\x1b[22m${plus}`

/**
 * Default options for configuring the REPL (Read-Eval-Print Loop) environment.
 *
 * This object provides a set of default configurations that can be used to
 * initialize a REPL session. Each property in this object can be overridden
 * by providing a custom options object when creating a REPL instance.
 *
 * @constant {Object} replOpts
 * @property {Function|undefined} about - A function to display information
 * about the REPL or project. Defaults to undefined.
 * @property {boolean} allowInvocation - Determines if invocation of commands
 * is allowed. Defaults to true.
 * @property {boolean} allowDefaultCommands - Indicates if default commands
 * like 'clear' and 'about' should be available. Defaults to true.
 * @property {Array} commands - An array of custom command definitions to be
 * added to the REPL. Defaults to an empty array.
 * @property {Object} exports - An object containing variables or functions
 * to be exported to the REPL context. Defaults to an empty object.
 * @property {Function} onReady - A callback function that is executed when
 * the REPL is ready. Defaults to an empty function.
 * @property {string} prompt - The prompt string displayed in the REPL.
 * Defaults to the value of `kDefaultPrompt`.
 * @property {boolean} useGlobal - Specifies whether the REPL should use the
 * global context. Defaults to true.
 * @property {Object} replOpts - Additional options to be passed to the REPL
 * server. Defaults to an empty object.
 *
 * @example
 * // Creating a REPL with default options
 * const replInstance = createRepl()
 *
 * @example
 * // Overriding default options
 * const customRepl = createRepl({
 *   prompt: '> ',
 *   allowDefaultCommands: false
 * })
 */
const replOpts = {
  about: undefined,
  allowDefaultCommands: true,
  commands: [],
  exports: {},
  onReady: () => { },
  prompt: kDefaultPrompt,
  useGlobal: true,
  replOpts: {},
}

/**
 * Creates a REPL (Read-Eval-Print Loop) instance with customizable options.
 *
 * This function initializes a REPL environment using the provided options,
 * allowing for the execution of commands and scripts in a dynamic context.
 * It supports custom commands, prompt customization, and context exports.
 *
 * @function createRepl
 * @param {Object} [options] - Configuration options for the REPL instance.
 * @param {Function} [options.about] - Function to display information about
 *   the REPL or project.
 * @param {boolean} [options.allowDefaultCommands=true] - Indicates if default
 *   commands like 'clear' and 'about' should be available.
 * @param {Array} [options.commands] - Custom command definitions to be added
 *   to the REPL.
 * @param {Object} [options.exports] - Variables or functions to be exported
 *   to the REPL context.
 * @param {Function} [options.onReady] - Callback executed when the REPL is
 *   ready.
 * @param {string} [options.prompt=kDefaultPrompt] - The prompt string
 *   displayed in the REPL.
 * @param {boolean} [options.useGlobal=true] - Specifies whether the REPL
 *   should use the global context.
 * @param {Object} [options.replOpts] - Additional options for the REPL server.
 *
 * @example
 * // Creating a REPL with default options
 * const replInstance = createRepl()
 *
 * @example
 * // Overriding default options
 * const customRepl = createRepl({
 *   prompt: '> ',
 *   allowDefaultCommands: false
 * })
 */
export function createRepl(options) {
  options = {
    ...replOpts,
    ...((options && typeof options === 'object' && options) || {})
  }

  const prompt = green(options?.prompt ?? kDefaultPrompt)
  const replServer = new repl.REPLServer({
    useGlobal: options?.useGlobal ?? false,
    prompt: options?.prompt ?? kDefaultPrompt,
    ...(options?.replOpts ?? {})
  })

  const aboutFn = options?.about ?? defaultAbout.bind(replServer)
  const state = {
    allowInvocation: true
  }

  const clearFn = (displayPrompt = true) => {
    clear(state)

    if (displayPrompt)
      replServer.displayPrompt()
  }

  let commands = [
    ...(options?.allowDefaultCommands === false ? [] : [
      ['cls', { action: () => clearFn(false), help: 'Clears the screen' }],
      ['clear', { action: () => clearFn(false), help: 'Clears the screen' }],
      ['about', { action: () => aboutFn(false), help: 'Shows info about this project' }],
      ['state', {
        action() {
          printStateString(options?.exports ?? replServer.context, state)
        },
        help: 'Generates state about this REPL context'
      }]
    ]),
    ...(Array.isArray(options?.commands) ? options.commands : [])
  ]

  for (const [command, options] of commands) {
    const { action, help, overridable } = options

    replServer.defineCommand(command, { action, help })

    if (overridable !== false) {
      overridableGlobal(replServer, command, action)
    }
  }

  Object.assign(replServer.context,
    options?.exports ?? {},
    {
      [Symbol.for('repl.prompt')]: prompt,
      replServer
    },
  )

  Object.defineProperty(replServer, '_initialPrompt', {
    get() {
      const _prompt = replServer.context[Symbol.for('repl.prompt')]
      const isRed = !globalThis?._

      return isRed ? red(_prompt) : green(_prompt)
    }
  })

  replServer.setupHistory('repl.history', function(err, repl) {
    clearFn(false)
    aboutFn(false)
    options?.onReady?.call(replServer)
    replServer.displayPrompt()
  })

  return replServer
}

/**
 * Displays information about the current project in the REPL.
 *
 * This function outputs the project's name, version, description, and author
 * to the console using ANSI escape codes for color formatting. It attempts to
 * display the REPL prompt after printing the information.
 *
 * The function uses optional chaining to check if `this` context has a
 * `displayPrompt` method. If not, it defaults to using the `replServer`
 * instance to display the prompt.
 *
 * @function defaultAbout
 * @example
 * // Outputs project information in the REPL
 * defaultAbout()
 */
function defaultAbout(displayPrompt = true) {
  console.log(`\x1b[32m${project.name}\x1b[39m v\x1b[1m${project.version}\x1b[22m`);
  console.log(`\x1b[3m${project.description}\x1b[23m`);
  console.log(`Written by \x1b[34m${project.author ?? 'Jane Doe'}\x1b[39m.`);

  if (displayPrompt) {
    console.log('')
    return this?.displayPrompt() ?? replServer.displayPrompt();
  }
}

/**
 * Clears the terminal screen if invocation is allowed.
 *
 * This function uses ANSI escape codes to reset the cursor position and
 * clear the terminal screen. It is typically used to refresh the display
 * in a REPL environment.
 *
 * @function clear
 * @param {boolean} [replState.allowInvocation] - A flag indicating whether the
 * screen clearing is permitted. Defaults to true.
 * @example
 * // Clears the screen if invocation is allowed
 * clear()
 */
function clear(replState) {
  if (replState.allowInvocation) {
    process.stdout.write('\x1b[3;0f\x1b[2J')
  }
}

/**
 * Creates an overridable global property within a given context, allowing
 * dynamic reassignment and restoration of its default behavior.
 *
 * This function defines a property on the specified context that can be
 * overridden by an expression assignment. It also registers a REPL command
 * to restore the property to its default state. The property is initially
 * set to execute a provided action function, and upon reassignment, it
 * stores the new value and logs a message indicating the change.
 *
 * @function overridableGlobal
 * @param {Object} replServer - The REPL server instance to define commands on.
 * @param {string} property - The name of the property to be made overridable.
 * @param {Function} action - The default function to execute when the property
 * is accessed before being overridden.
 * @param {string} [changeText='Expression assignment to "@X", previous function now disabled.'] -
 * The message to log when the property is overridden. The placeholder "@X" is
 * replaced with the property name.
 * @param {Object} [context=globalThis] - The context in which to define the
 * property. Defaults to the global object.
 *
 * @example
 * // Define an overridable global property 'myProp' in the REPL
 * overridableGlobal(replServer, 'myProp', () => 'default value')
 */
function overridableGlobal(
  replServer,
  property,
  action,
  changeText = 'Expression assignment to "@X", previous function now disabled.',
  context = globalThis,
) {
  const message = changeText.replaceAll(/\@X/g, property)

  let changed = false
  let storage = undefined

  const makeDescriptor = () => ({
    get() {
      if (changed === false) {
        return action()
      }

      return storage
    },
    set(value) {
      if (changed === false) {
        console.log(message)
        changed = true
      }

      storage = value
    },
    configurable: true,
    get enumerable() { return changed }
  })

  replServer.defineCommand(
    `restore${property.charAt(0).toUpperCase()}${property.substring(1,property.length)}`,
    {
      action() {
        changed = false
        storage = undefined

        Object.defineProperty(context, property, makeDescriptor())
        console.log(this.help)
      },
      help: `Restores ${property} to default REPL custom state.`
    }
  )

  Object.defineProperty(context, property, makeDescriptor())
}

/**
 * Generates a snapshot of the current REPL state, categorizing global objects
 * into classes, functions, properties, symbols, and descriptors. This function
 * is designed to capture and organize the current state for inspection or
 * modification purposes. It temporarily disables invocation to safely enumerate
 * global objects, capturing their descriptors and categorizing them accordingly.
 * If invocation is already disabled, it returns the current state without
 * modification. Skipped properties during enumeration are tracked but not
 * processed further.
 *
 * @returns {Object} An object representing the current REPL state, with
 * properties for classes, functions, properties, symbols, and descriptors
 * (further divided into accessors and data descriptors). Each category is an
 * object with keys as the global identifiers and values containing the key,
 * value, and descriptor of the item.
 */
function generateState(forObject = globalThis, _state) {
  const replState = {
    classes: {},
    functions: {},
    properties: {},
    symbols: {},
    descriptors: {
      accessors: {},
      data: {},
    },
  };

  if (!_state.allowInvocation) {
    return replState;
  }

  let skipped = [];

  _state.allowInvocation = false;
  Reflect.ownKeys(forObject).forEach(key => {
    try {
      const value = forObject[key];
      const descriptor = Object.getOwnPropertyDescriptor(forObject, key);

      if (String(value).startsWith('class')) {
        replState.classes[key] = {key, value, descriptor};
      }
      else if (typeof value === 'function') {
        replState.functions[key] = {key, value, descriptor};
      }
      else {
        replState.properties[key] = {key, value, descriptor};
      }

      if (typeof key === 'symbol') {
        replState.symbols[key] = { key, value, descriptor };
      }

      if (Reflect.has(descriptor, 'get') || Reflect.has(descriptor, 'set')) {
        replState.descriptors.accessors[key] = { key, descriptor };
      }
      else if (Reflect.has(descriptor, 'value')) {
        replState.descriptors.data[key] = { key, descriptor };
      }
    }
    catch (ignored) {
      skipped.push(String(key));
    }
  });
  _state.allowInvocation = true;

  return replState;
}

/**
 * Prints a formatted string representation of the state of an object.
 *
 * This function generates a state object for the given `forObject` and
 * prints its classes, functions, properties, and descriptors in a
 * human-readable format. The output is styled using ANSI escape codes
 * for terminal display.
 *
 * @param {Object} [forObject=globalThis] - The object to generate the
 * state from. Defaults to the global object.
 *
 * @example
 * // Prints the state of the global object
 * printStateString()
 *
 * @example
 * // Prints the state of a custom object without allowing invocation
 * const myObject = { a: 1, b: function() {}, c: class {} }
 * printStateString(myObject, false)
 */
function printStateString(forObject = globalThis, _state) {
  const state = generateState(forObject, _state);
  const b = (s) => `\x1b[1m${s}\x1b[22m`;
  const i = (s) => `\x1b[3m${s}\x1b[23m`;
  const j = ', ';

  state.classes = [...Object.keys(state.classes)].map(k => String(k));
  state.functions = [...Object.keys(state.functions)].map(k => String(k));
  state.properties = [...Object.keys(state.properties)].map(k => String(k));

  state.descriptors.accessors = [...Object.keys(state.descriptors.accessors)]
    .map(k => String(k));

  state.descriptors.data = [...Object.keys(state.descriptors.data)]
    .map(k => String(k));

  if (state.classes.length)
    console.log(`${b('Classes')}\n${wrapContent(state.classes, i, j)}`);

  if (state.functions.length)
    console.log(`${b('Functions')}\n${wrapContent(state.functions, i, j)}`);

  if (state.properties.length)
    console.log(`${b('Properties')}\n${wrapContent(state.properties, i, j)}`);

  if (state.descriptors.accessors.length)
    console.log(`${b('Accessors')}\n${wrapContent(state.descriptors.accessors, i, j)}`);

  console.log('')
}

/**
 * Formats a string or array of values into lines with specified indentation and line width.
 * @param {string|array} input - The input string or array of strings to be formatted.
 * @param {number} nCols - The maximum number of columns per line (default 80).
 * @param {number} nSpaceIndents - The number of spaces for indentation (default 2).
 * @returns {string} The formatted string.
 */
function formatValues(input, transform, nCols = 80, nSpaceIndents = 2) {
  // Split the string into an array if input is a string
  const values = typeof input === 'string' ? input.split(', ') : input;
  let line = ''.padStart(nSpaceIndents, ' ');
  let result = [];

  values.forEach((value, index) => {
    // Transform value if a transform function is supplied.
    if (transform && typeof transform === 'function') {
      value = transform(value);
    }

    // Check if adding the next value exceeds the column limit
    if (line.length + value.length + 2 > nCols && line.trim().length > 0) {
      // If it does, push the line to the result and start a new line
      result.push(line);
      line = ''.padStart(nSpaceIndents, ' ');
    }

    // Add the value to the line, followed by ", " if it's not the last value
    line += value + (index < values.length - 1 ? ', ' : '');
  });

  // Add the last line if it's not empty
  if (line.trim().length > 0) {
    result.push(line);
  }

  return result.join('\n');
}

/**
 * Wraps a long string or array of strings into lines with specified
 * indentation and line width.
 *
 * This function processes the input by splitting it into lines, applying
 * optional transformations, and wrapping the content to fit within a
 * specified width. It handles ANSI escape codes to ensure accurate
 * length calculations for terminal output.
 *
 * @function wrapContent
 * @param {string|Array} longString - The input string or array of strings
 *   to be wrapped.
 * @param {Function} [transform] - An optional function to transform each
 *   element before wrapping.
 * @param {string} [joinOn=' '] - The string used to join elements in a line.
 * @param {number} [indent=2] - The number of spaces for indentation.
 * @param {number} [wrapAt=80] - The maximum line width for wrapping.
 * @returns {string} The wrapped content as a single string with lines
 *   separated by newlines.
 * @example
 * // Wraps a long string with default settings
 * const wrapped = wrapContent('This is a very long string that needs to be wrapped.')
 * console.log(wrapped)
 */
function wrapContent(
  longString,
  transform,
  joinOn = ' ',
  indent = 2,
  wrapAt = 80
) {
  let asArray = Array.isArray(longString)
    ? longString
    : String(longString).replaceAll(/\r\n/g, '\n').split('\n')

  asArray = asArray.map(element => String(element).trim())

  let lines = []
  let maxLen = wrapAt - indent
  let curLine = []
  let sgrLength = (s) => s.replaceAll(/\x1b\[?\d+(;\d+)*[a-zA-Z]/g, '').length

  for (let element of asArray) {
    if (typeof transform === 'function') {
      element = String(transform(element)).trim()
    }

    let curLength = sgrLength(curLine.join(joinOn))
    let elementLength = sgrLength(String(element) + joinOn)

    if (curLength + elementLength > maxLen) {
      let leading = indent > 0 ? ' '.repeat(indent) : ''
      lines.push(`${leading}${curLine.join(joinOn)}`)
      curLine = []
    }

    curLine.push(String(element))
  }

  if (curLine.length) {
    let leading = indent > 0 ? ' '.repeat(indent) : ''
    lines.push(`${leading}${curLine.join(joinOn)}`)
  }

  return lines.join('\n')
}
