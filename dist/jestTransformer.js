"use strict";

const {
  resolve
} = require('path');
module.exports = {
  process: function jestTransformer(sourceText, sourcePath, config, options) {
    let source = sourceText.replace(/\'/gm, "\\'").replace(/\r?\n/gm, ' ');
    return {
      code: `
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
    `
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZXNvbHZlIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJwcm9jZXNzIiwiamVzdFRyYW5zZm9ybWVyIiwic291cmNlVGV4dCIsInNvdXJjZVBhdGgiLCJjb25maWciLCJvcHRpb25zIiwic291cmNlIiwicmVwbGFjZSIsImNvZGUiXSwic291cmNlcyI6WyIuLi9zcmMvamVzdFRyYW5zZm9ybWVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgcmVzb2x2ZSB9ID0gcmVxdWlyZSgncGF0aCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwcm9jZXNzOiBmdW5jdGlvbiBqZXN0VHJhbnNmb3JtZXIoXG4gICAgc291cmNlVGV4dCxcbiAgICBzb3VyY2VQYXRoLFxuICAgIGNvbmZpZyxcbiAgICBvcHRpb25zLFxuICApIHtcbiAgICBsZXQgc291cmNlID0gc291cmNlVGV4dC5yZXBsYWNlKC9cXCcvZ20sIFwiXFxcXCdcIikucmVwbGFjZSgvXFxyP1xcbi9nbSwgJyAnKVxuXG4gICAgcmV0dXJuIHsgY29kZTogYFxuICAgICAgbGV0IHsgcmVzb2x2ZSwgZXh0bmFtZSB9ID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICBsZXQgeyBTY2hlbWF0YSB9ID0gcmVxdWlyZSgnLi4vLi4vZGlzdCcpXG5cbiAgICAgIGxldCBjb250ZW50ID0gJyR7c291cmNlfSdcbiAgICAgIGxldCBzY2hlbWF0YSA9IG5ldyBTY2hlbWF0YShjb250ZW50KVxuICAgICAgbGV0IHNjaGVtYSA9IHNjaGVtYXRhLnNjaGVtYVxuICAgICAgbGV0IGFzdE5vZGUgPSBzY2hlbWF0YS5hc3RcbiAgICAgIGxldCByZXNvbHZlcnNcbiAgICAgIGxldCBmaWxlbmFtZSA9IFwiJHtzb3VyY2VQYXRofVwiXG4gICAgICBsZXQganNGaWxlbmFtZVxuICAgICAgbGV0IGpzTW9kdWxlXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGpzRmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKGV4dG5hbWUoZmlsZW5hbWUpLCAnLmpzJylcbiAgICAgICAganNNb2R1bGUgPSByZXF1aXJlKHJlc29sdmUoanNGaWxlbmFtZSkpXG4gICAgICAgIHJlc29sdmVycyA9IChcbiAgICAgICAgICBqc01vZHVsZS5yZXNvbHZlcnMgfHwgdHlwZW9mIGpzTW9kdWxlID09ICdvYmplY3QnICYmIGpzTW9kdWxlXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuXG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIGRlbGV0ZSByZXF1aXJlLmNhY2hlW3Jlc29sdmUoanNGaWxlbmFtZSldXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVzb2x2ZXJzID0gbnVsbFxuICAgICAgfVxuXG4gICAgICBzY2hlbWF0YS5yZXNvbHZlcnMgPSByZXNvbHZlcnNcblxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgIGFzdE5vZGUsXG4gICAgICAgIGRlZmF1bHQ6IHNjaGVtYXRhLFxuICAgICAgICByZXNvbHZlcnMsXG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgc2RsOiBzY2hlbWF0YSxcbiAgICAgICAgdHlwZURlZnM6IHNjaGVtYXRhXG4gICAgICB9XG4gICAgYH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU07RUFBRUE7QUFBUSxDQUFDLEdBQUdDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFFbkNDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHO0VBQ2ZDLE9BQU8sRUFBRSxTQUFTQyxlQUFlQSxDQUMvQkMsVUFBVSxFQUNWQyxVQUFVLEVBQ1ZDLE1BQU0sRUFDTkMsT0FBTyxFQUNQO0lBQ0EsSUFBSUMsTUFBTSxHQUFHSixVQUFVLENBQUNLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUNBLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDO0lBRXRFLE9BQU87TUFBRUMsSUFBSSxFQUFFO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QkYsTUFBTTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QkgsVUFBVTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUFLLENBQUM7RUFDSjtBQUNGLENBQUMiLCJpZ25vcmVMaXN0IjpbXX0=
//# sourceMappingURL=jestTransformer.js.map