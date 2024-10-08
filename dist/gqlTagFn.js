"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.gql = gql;
var _Schemata = require("./Schemata");
var _neTagFns = require("ne-tag-fns");
/**
 * A small wrapper that creates a Schemata instance when using template strings
 * by invoking the `gql` tag function in front of it.
 *
 * i.e.
 *   let sdl = gql`type Person { name: String }`
 *   console.log(sdl instanceof Schemata) // true
 *
 * @param {string} template   [description]
 * @param {Array<mixed>} substitutions [description]
 * @return {Schemata} an instance of Schemata wrapping the string in the
 * template
 */
function gql(template, ...substitutions) {
  const string = (0, _neTagFns.handleSubstitutions)(template, ...substitutions);
  const schemata = _Schemata.Schemata.from(string);
  const ast = schemata.ast;
  const schemataProps = Object.getOwnPropertyNames(_Schemata.Schemata.prototype);
  return new Proxy(ast, {
    get(target, prop, receiver) {
      if (prop === "schemata") {
        return schemata;
      }
      if (prop === "string") {
        return String(schemata);
      }
      if (schemataProps.includes(prop)) {
        const targetProps = Object.getOwnPropertyNames(target);
        if (!targetProps.includes(prop)) {
          return schemata[prop];
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  //return Schemata.from(handleSubstitutions(template, ...substitutions))
}
var _default = exports.default = gql;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfU2NoZW1hdGEiLCJyZXF1aXJlIiwiX25lVGFnRm5zIiwiZ3FsIiwidGVtcGxhdGUiLCJzdWJzdGl0dXRpb25zIiwic3RyaW5nIiwiaGFuZGxlU3Vic3RpdHV0aW9ucyIsInNjaGVtYXRhIiwiU2NoZW1hdGEiLCJmcm9tIiwiYXN0Iiwic2NoZW1hdGFQcm9wcyIsIk9iamVjdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJwcm90b3R5cGUiLCJQcm94eSIsImdldCIsInRhcmdldCIsInByb3AiLCJyZWNlaXZlciIsIlN0cmluZyIsImluY2x1ZGVzIiwidGFyZ2V0UHJvcHMiLCJSZWZsZWN0IiwiX2RlZmF1bHQiLCJleHBvcnRzIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uL3NyYy9ncWxUYWdGbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlbWF0YSB9IGZyb20gJy4vU2NoZW1hdGEnXG5pbXBvcnQgeyBoYW5kbGVTdWJzdGl0dXRpb25zIH0gZnJvbSAnbmUtdGFnLWZucydcblxuLyoqXG4gKiBBIHNtYWxsIHdyYXBwZXIgdGhhdCBjcmVhdGVzIGEgU2NoZW1hdGEgaW5zdGFuY2Ugd2hlbiB1c2luZyB0ZW1wbGF0ZSBzdHJpbmdzXG4gKiBieSBpbnZva2luZyB0aGUgYGdxbGAgdGFnIGZ1bmN0aW9uIGluIGZyb250IG9mIGl0LlxuICpcbiAqIGkuZS5cbiAqICAgbGV0IHNkbCA9IGdxbGB0eXBlIFBlcnNvbiB7IG5hbWU6IFN0cmluZyB9YFxuICogICBjb25zb2xlLmxvZyhzZGwgaW5zdGFuY2VvZiBTY2hlbWF0YSkgLy8gdHJ1ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZSAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7QXJyYXk8bWl4ZWQ+fSBzdWJzdGl0dXRpb25zIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1NjaGVtYXRhfSBhbiBpbnN0YW5jZSBvZiBTY2hlbWF0YSB3cmFwcGluZyB0aGUgc3RyaW5nIGluIHRoZVxuICogdGVtcGxhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdxbCh0ZW1wbGF0ZSwgLi4uc3Vic3RpdHV0aW9ucykge1xuICBjb25zdCBzdHJpbmcgPSBoYW5kbGVTdWJzdGl0dXRpb25zKHRlbXBsYXRlLCAuLi5zdWJzdGl0dXRpb25zKVxuICBjb25zdCBzY2hlbWF0YSA9IFNjaGVtYXRhLmZyb20oc3RyaW5nKSBcbiAgY29uc3QgYXN0ID0gc2NoZW1hdGEuYXN0IFxuICBjb25zdCBzY2hlbWF0YVByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoU2NoZW1hdGEucHJvdG90eXBlKVxuICBcbiAgcmV0dXJuIG5ldyBQcm94eShhc3QsIHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgaWYgKHByb3AgPT09IFwic2NoZW1hdGFcIikgICAgICAgICAgeyByZXR1cm4gc2NoZW1hdGEgfSAgICBcbiAgICAgIGlmIChwcm9wID09PSBcInN0cmluZ1wiKSAgICAgICAgICAgIHsgcmV0dXJuIFN0cmluZyhzY2hlbWF0YSkgfSAgICAgIFxuICAgICAgaWYgKHNjaGVtYXRhUHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0UHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAgIGlmICghdGFyZ2V0UHJvcHMuaW5jbHVkZXMocHJvcCkpIHsgXG4gICAgICAgICAgcmV0dXJuIHNjaGVtYXRhW3Byb3BdIFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKVxuICAgIH1cbiAgfSlcbiAgLy9yZXR1cm4gU2NoZW1hdGEuZnJvbShoYW5kbGVTdWJzdGl0dXRpb25zKHRlbXBsYXRlLCAuLi5zdWJzdGl0dXRpb25zKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ3FsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsSUFBQUEsU0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRCxPQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTRSxHQUFHQSxDQUFDQyxRQUFRLEVBQUUsR0FBR0MsYUFBYSxFQUFFO0VBQzlDLE1BQU1DLE1BQU0sR0FBRyxJQUFBQyw2QkFBbUIsRUFBQ0gsUUFBUSxFQUFFLEdBQUdDLGFBQWEsQ0FBQztFQUM5RCxNQUFNRyxRQUFRLEdBQUdDLGtCQUFRLENBQUNDLElBQUksQ0FBQ0osTUFBTSxDQUFDO0VBQ3RDLE1BQU1LLEdBQUcsR0FBR0gsUUFBUSxDQUFDRyxHQUFHO0VBQ3hCLE1BQU1DLGFBQWEsR0FBR0MsTUFBTSxDQUFDQyxtQkFBbUIsQ0FBQ0wsa0JBQVEsQ0FBQ00sU0FBUyxDQUFDO0VBRXBFLE9BQU8sSUFBSUMsS0FBSyxDQUFDTCxHQUFHLEVBQUU7SUFDcEJNLEdBQUdBLENBQUNDLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxRQUFRLEVBQUU7TUFDMUIsSUFBSUQsSUFBSSxLQUFLLFVBQVUsRUFBVztRQUFFLE9BQU9YLFFBQVE7TUFBQztNQUNwRCxJQUFJVyxJQUFJLEtBQUssUUFBUSxFQUFhO1FBQUUsT0FBT0UsTUFBTSxDQUFDYixRQUFRLENBQUM7TUFBQztNQUM1RCxJQUFJSSxhQUFhLENBQUNVLFFBQVEsQ0FBQ0gsSUFBSSxDQUFDLEVBQUU7UUFDaEMsTUFBTUksV0FBVyxHQUFHVixNQUFNLENBQUNDLG1CQUFtQixDQUFDSSxNQUFNLENBQUM7UUFDdEQsSUFBSSxDQUFDSyxXQUFXLENBQUNELFFBQVEsQ0FBQ0gsSUFBSSxDQUFDLEVBQUU7VUFDL0IsT0FBT1gsUUFBUSxDQUFDVyxJQUFJLENBQUM7UUFDdkI7TUFDRjtNQUVBLE9BQU9LLE9BQU8sQ0FBQ1AsR0FBRyxDQUFDQyxNQUFNLEVBQUVDLElBQUksRUFBRUMsUUFBUSxDQUFDO0lBQzVDO0VBQ0YsQ0FBQyxDQUFDO0VBQ0Y7QUFDRjtBQUFDLElBQUFLLFFBQUEsR0FBQUMsT0FBQSxDQUFBQyxPQUFBLEdBRWN4QixHQUFHIiwiaWdub3JlTGlzdCI6W119
//# sourceMappingURL=gqlTagFn.js.map