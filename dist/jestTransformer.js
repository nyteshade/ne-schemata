'use strict';

const { resolve } = require('path');

module.exports = {
  process: function jestTransformer(sourceText, sourcePath, config, options) {
    let source = sourceText.replace(/\'/gm, "\\'").replace(/\r?\n/gm, ' ');

    return `
      let { resolve, extname } = require('path')
      let { Schemata } = require('../../dist')

      let content = '${source}'
      let schemata = new Schemata(content)
      let schema = schemata.schema
      let astNode = schemata.ast
      let resolvers
      let filename = "${sourcePath}"
      let jsFilename
      let jsModule

      try {
        jsFilename = filename.replace(extname(filename), '.js')
        jsModule = require(resolve(jsFilename))
        resolvers = (
          jsModule.resolvers || typeof jsModule == 'object' && jsModule
        )
      }
      catch (error) {
        console.error(error)

        process.nextTick(() => {
          delete require.cache[resolve(jsFilename)]
        })

        resolvers = null
      }

      schemata.resolvers = resolvers

      module.exports = {
        astNode,
        default: schemata,
        resolvers,
        schema,
        sdl: schemata,
        typeDefs: schemata
      }
    `;
  }
};
//# sourceMappingURL=jestTransformer.js.map