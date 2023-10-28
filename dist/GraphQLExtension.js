"use strict";

require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.deregister = deregister;
exports.graphQLExtensionHandler = graphQLExtensionHandler;
exports.jsExtensionWrapper = jsExtensionWrapper;
exports.register = register;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _Schemata = require("./Schemata");
var _fs = require("fs");
var _path = require("path");
/**
 * Adds the ability to `require` or `import` files ending in a `.graphql`
 * extension. The exports returned from such an import consist of four
 * major values and one default value.
 *
 * values:
 *   astNode   - an ASTNode document object representing the SDL contents
 *               of the .graphql file contents. Null if the text is invalid
 *   resovlers - if there is an adjacent file with the same name, ending in
 *               .js and it exports either a `resolvers` key or an object by
 *               default, this value will be set on the sdl object as its set
 *               resolvers/rootObj
 *   schema    - a GraphQLSchema instance object if the contents of the .graphql
 *               file represent both valid SDL and contain at least one root
 *               type such as Query, Mutation or Subscription
 *   sdl       - the string of SDL wrapped in an instance of Schemata
 *   typeDefs  - the raw string used that `sdl` wraps
 *   default   - the sdl string wrapped in an instance of Schemata is the
 *               default export
 *
 * @param {Module} module a node JS Module instance
 * @param {string} filename a fully qualified path to the file being imported
 */
function graphQLExtensionHandler(module, filename) {
  var content = (0, _fs.readFileSync)(filename);
  var schemata = new _Schemata.Schemata(content.toString());
  var schema = schemata.schema;
  var astNode = schemata.ast;
  var resolvers;
  var jsFilename;
  var tsFilename;
  var jsModule;
  try {
    var _jsModule$resolvers, _jsModule;
    jsFilename = (0, _path.resolve)(filename.replace((0, _path.extname)(filename), '.js'));
    if ((0, _fs.existsSync)(jsFilename)) {
      jsModule = require(jsFilename);
    }
    tsFilename = (0, _path.resolve)(filename.replace((0, _path.extname)(filename), '.ts'));
    if ((0, _fs.existsSync)(tsFilename)) {
      jsModule = require(tsFilename);
    }
    resolvers = (_jsModule$resolvers = (_jsModule = jsModule) === null || _jsModule === void 0 ? void 0 : _jsModule.resolvers) !== null && _jsModule$resolvers !== void 0 ? _jsModule$resolvers : (0, _typeof2["default"])(jsModule) == 'object' && jsModule;
  } catch (error) {
    console.error(error);
    process.nextTick(function () {
      delete require.cache[jsFilename];
      delete require.cache[tsFilename];
    });
    resolvers = null;
  }

  // Assign the resolvers to the sdl string
  schemata.resolvers = resolvers;
  if (schemata.resolvers) {
    schemata.clearSchema();
    schema = schemata.schema;
  }

  // For all intents and purposes this is an object that can be treated like
  // a string but that also has three extra properties; sdl, ast and schema.
  // `ast` and `schema` invoke the functions `parse` and `buildSchema` from
  // the 'graphql' module, respectively
  module.exports = {
    astNode: astNode,
    "default": schemata,
    resolvers: resolvers,
    schema: schema,
    sdl: schemata,
    schemata: schemata,
    typeDefs: schemata
  };
}

/**
 * Acts as a higher order function that wraps the .js extension handler. 
 */
function jsExtensionWrapper() {
  if (require.originalJSExtensionHandler) {
    return;
  }
  require.originalJSExtensionHandler = require.extensions['.js'];

  /**
   * The handler will first check to see if there is a .graphql file with the same
   * name as the .js file. If there is, it will use the .graphql file instead
   * of the .js file by deferrring to the function graphQLExtensionHandler. The
   * original JS extension wrapper is stored such that unregister can be 
   * called to undo the changes. 
   */
  require.extensions['.js'] = function (module, filename) {
    var graphqlFilename = filename.replace((0, _path.extname)(filename), '.graphql');
    if ((0, _fs.existsSync)(graphqlFilename)) {
      return graphQLExtensionHandler(module, graphqlFilename);
    }
    return require.originalJSExtensionHandler(module, filename);
  };
}

/**
 * Registers the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files with
 * the same name.
 */
function register() {
  require.extensions = require.extensions || {};
  if (!require.originalJSExtensionHandler) {
    jsExtensionWrapper();
  }
  require.extensions['.graphql'] = graphQLExtensionHandler;
  require.extensions['.sdl'] = graphQLExtensionHandler;
  require.extensions['.gql'] = graphQLExtensionHandler;
}

/**
 * Deregisters the custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and restores the original `.js` extension handler.
 */
function deregister() {
  if (require.originalJSExtensionHandler) {
    require.extensions['.js'] = require.originalJSExtensionHandler;
    delete require.originalJSExtensionHandler;
  }
  delete require.extensions['.graphql'];
  delete require.extensions['.sdl'];
  delete require.extensions['.gql'];
}

/**
 * Sets up custom extension handlers for `.graphql`, `.sdl`, and `.gql` files,
 * and wraps the original `.js` extension handler to support `.graphql` files
 * with the same name.
 *
 * @type {Function}
 */
var _default = exports["default"] = register;