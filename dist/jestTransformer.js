"use strict";

require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.array.concat.js");
var _require = require('path'),
  resolve = _require.resolve;
module.exports = {
  process: function jestTransformer(sourceText, sourcePath, config, options) {
    var source = sourceText.replace(/\'/gm, "\\'").replace(/\r?\n/gm, ' ');
    return {
      code: "\n      let { resolve, extname } = require('path')\n      let { Schemata } = require('../../dist')\n\n      let content = '".concat(source, "'\n      let schemata = new Schemata(content)\n      let schema = schemata.schema\n      let astNode = schemata.ast\n      let resolvers\n      let filename = \"").concat(sourcePath, "\"\n      let jsFilename\n      let jsModule\n\n      try {\n        jsFilename = filename.replace(extname(filename), '.js')\n        jsModule = require(resolve(jsFilename))\n        resolvers = (\n          jsModule.resolvers || typeof jsModule == 'object' && jsModule\n        )\n      }\n      catch (error) {\n        console.error(error)\n\n        process.nextTick(() => {\n          delete require.cache[resolve(jsFilename)]\n        })\n\n        resolvers = null\n      }\n\n      schemata.resolvers = resolvers\n\n      module.exports = {\n        astNode,\n        default: schemata,\n        resolvers,\n        schema,\n        sdl: schemata,\n        typeDefs: schemata\n      }\n    ")
    };
  }
};