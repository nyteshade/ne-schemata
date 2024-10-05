"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UNIONS = exports.TypeMap = exports.TYPES = exports.SCALARS = exports.ROOT_TYPES = exports.INTERFACES = exports.INPUT_TYPES = exports.HIDDEN = exports.ENUMS = exports.ALL = void 0;
exports.forEachField = forEachField;
exports.forEachOf = forEachOf;
var _graphql = require("graphql");
// @ts-check

/**
 * @typedef {(
 *   type: unknown,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>,
 *   schema: GraphQLSchema,
 *   context: unknown
 * ) => void} ForEachOfResolver
 */

/**
 * @typedef {(
 *   type: unknown,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>,
 *   field: unknown,
 *   fieldName: string,
 *   fieldArgs: Array<GraphQLArgument>,
 *   fieldDirectives: Array<GraphQLDirective>,
 *   schema: GraphQLSchema,
 *   context: unknown
 *  ) => void} ForEachFieldResolver
 */

// Create constants for each of the types allowed, over which one might
// iterate. These can be bitmasked to include multiple types; i.e. for both
// type and enums, pass TYPES | ENUMS for the types parameter. It
// defaults to simply types.
const ALL = exports.ALL = 1;
const TYPES = exports.TYPES = 2;
const INTERFACES = exports.INTERFACES = 4;
const ENUMS = exports.ENUMS = 8;
const UNIONS = exports.UNIONS = 16;
const SCALARS = exports.SCALARS = 32;
const ROOT_TYPES = exports.ROOT_TYPES = 64;
const INPUT_TYPES = exports.INPUT_TYPES = 128;
const HIDDEN = exports.HIDDEN = 256;
const Masks = [ALL, TYPES, INTERFACES, UNIONS, ENUMS, SCALARS, ROOT_TYPES, INPUT_TYPES];
// Create a mapping from the constant to the GraphQL type class.
const TypeMap = exports.TypeMap = new Map();
TypeMap.set(TYPES, _graphql.GraphQLObjectType);
TypeMap.set(ROOT_TYPES, _graphql.GraphQLObjectType);
TypeMap.set(INTERFACES, _graphql.GraphQLInterfaceType);
TypeMap.set(INPUT_TYPES, _graphql.GraphQLInputObjectType);
TypeMap.set(ENUMS, _graphql.GraphQLEnumType);
TypeMap.set(UNIONS, _graphql.GraphQLUnionType);
TypeMap.set(SCALARS, _graphql.GraphQLScalarType);

/**
 * Iterates over the values contained in a Schema's typeMap. If a desired
 * value is encountered, the supplied callback will be invoked. The values are
 * the constants ALL, TYPES, INTERFACES, ENUMS, UNIONS and SCALARS. Optionally
 * HIDDEN is another value that can be bitmasked together for a varied result.
 * HIDDEN exposes the values in the schema typemap that begin with a double
 * underscore.
 *
 * The signature for the function callback is as follows:
 * (
 *   type: unknown,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>
 *   schema: GraphQLSchema,
 *   context: unknown,
 * ) => void
 *
 * Where:
 *   `type`           - the object instance from within the `GraphQLSchema`
 *   `typeName`       - the name of the object; "Query" for type Query and
 *                      so on.
 *   `typeDirectives` - an array of directives applied to the object or an
 *                      empty array if there are none applied.
 *   `schema`         - an instance of `GraphQLSchema` over which to iterate
 *   `context`        - usually an object, and usually the same object,
 *                      passed to the call to `makeExecutableSchema()`
 *                      or `graphql()`
 *
 * @param {GraphQLSchema} schema the schema to parse
 * @param {ForEachOfResolver} fn a function with a signature defined above
 * @param {unknown} context usually an object but any mixed value the denotes
 * some shared context as is used with the schema during normal runtime.
 * @param {number} types a bitmask of one or more of the constants defined
 * above. These can be OR'ed together and default to TYPES.
 * @return {GraphQLSchema} a new schema is generated from this SDL, iterated
 * over and returned.
 */
function forEachOf(schema, fn, context, types = ALL) {
  [_graphql.GraphQLObjectType, _graphql.GraphQLInterfaceType, _graphql.GraphQLEnumType, _graphql.GraphQLUnionType, _graphql.GraphQLScalarType].forEach(t => {
    if (!t) return;
    if (!Object.getOwnPropertySymbols(t.prototype).includes(Symbol.toStringTag)) {
      Object.defineProperties(t.prototype, {
        [Symbol.toStringTag]: {
          get() {
            return this.constructor.name;
          }
        }
      });
    }
  });
  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];
    const hidden = (0, _graphql.getNamedType)(type).name.startsWith('__');
    const showHidden = (types & HIDDEN) === HIDDEN;
    const directives = type && type.astNode && type.astNode.directives || [];
    let doIt = (types & ALL) === ALL;
    Masks.forEach(mask => {
      if (doIt) {
        return;
      } else if ((mask & ROOT_TYPES) === ROOT_TYPES && (type === schema.getQueryType() || type === schema.getSubscriptionType() || type === schema.getMutationType())) {
        doIt = true;
        return;
      } else {
        doIt = (types & mask) === mask && type instanceof TypeMap.get(mask);
      }
    });

    // Prevent hidden items from being shown unless asked for
    doIt = doIt && (!hidden || hidden && showHidden);
    if (doIt) fn(type, typeName, directives, schema, context);
  });
}

/**
 * An extension of `forEachOf` that targets the fields of the types in the
 * schema's typeMap. This function provides more detail and allows greater
 * access to any associated `context` than the function of the same name
 * provided by the `graphql-tools` library.
 *
 * The signature for the callback function is as follows
 *
 * (
 *   type: unknown,
 *   typeName: string,
 *   typeDirectives: Array<GraphQLDirective>,
 *   field: unknown,
 *   fieldName: string,
 *   fieldArgs: Array<GraphQLArgument>,
 *   fieldDirectives: Array<GraphQLDirective>,
 *   schema: GraphQLSchema,
 *   context: unknown
 * ) => void
 *
 * Where
 *
 * Where:
 *   `type`           - the object instance from within the `GraphQLSchema`
 *   `typeName`       - the name of the object; "Query" for type Query and so on
 *   `typeDirectives` - an array of directives applied to the object or an empty
 *                      array if there are none applied.
 *   `field`          - the field in question from the type
 *   `fieldName`      - the name of the field as a string
 *   `fieldArgs`      - an array of arguments for the field in question
 *   `fieldDirectives`- an array of directives applied to the field or an empty
 *                      array should there be no applied directives
 *   `schema`         - an instance of `GraphQLSchema` over which to iterate
 *   `context`        - usually an object, and usually the same object, passed
 *                      to the call to `makeExecutableSchema()` or `graphql()`
 *
 * @param {GraphQLSchema} schema
 * @param {ForEachFieldResolver} fn a function with a signature defined above
 * @param {unknown} context usually an object but any mixed value the denotes
 * some shared context as is used with the schema during normal runtime.
 */
function forEachField(schema, fn, context, types = ALL) {
  forEachOf(schema, (type, typeName, _, context, directives) => {
    if (!type._fields) {
      return;
    }
    Object.keys(type._fields).forEach(fieldName => {
      let field = type._fields[fieldName];
      let fieldDirectives = field.astNode && field.astNode.directives || [];
      let fieldArgs = field.args || [];
      fn(type, typeName, directives, field, fieldName, fieldArgs, fieldDirectives, schema, context);
    });
  }, context, types);
}
var _default = exports.default = forEachOf;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZ3JhcGhxbCIsInJlcXVpcmUiLCJBTEwiLCJleHBvcnRzIiwiVFlQRVMiLCJJTlRFUkZBQ0VTIiwiRU5VTVMiLCJVTklPTlMiLCJTQ0FMQVJTIiwiUk9PVF9UWVBFUyIsIklOUFVUX1RZUEVTIiwiSElEREVOIiwiTWFza3MiLCJUeXBlTWFwIiwiTWFwIiwic2V0IiwiR3JhcGhRTE9iamVjdFR5cGUiLCJHcmFwaFFMSW50ZXJmYWNlVHlwZSIsIkdyYXBoUUxJbnB1dE9iamVjdFR5cGUiLCJHcmFwaFFMRW51bVR5cGUiLCJHcmFwaFFMVW5pb25UeXBlIiwiR3JhcGhRTFNjYWxhclR5cGUiLCJmb3JFYWNoT2YiLCJzY2hlbWEiLCJmbiIsImNvbnRleHQiLCJ0eXBlcyIsImZvckVhY2giLCJ0IiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwicHJvdG90eXBlIiwiaW5jbHVkZXMiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImRlZmluZVByb3BlcnRpZXMiLCJnZXQiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJ0eXBlTWFwIiwiZ2V0VHlwZU1hcCIsImtleXMiLCJ0eXBlTmFtZSIsInR5cGUiLCJoaWRkZW4iLCJnZXROYW1lZFR5cGUiLCJzdGFydHNXaXRoIiwic2hvd0hpZGRlbiIsImRpcmVjdGl2ZXMiLCJhc3ROb2RlIiwiZG9JdCIsIm1hc2siLCJnZXRRdWVyeVR5cGUiLCJnZXRTdWJzY3JpcHRpb25UeXBlIiwiZ2V0TXV0YXRpb25UeXBlIiwiZm9yRWFjaEZpZWxkIiwiXyIsIl9maWVsZHMiLCJmaWVsZE5hbWUiLCJmaWVsZCIsImZpZWxkRGlyZWN0aXZlcyIsImZpZWxkQXJncyIsImFyZ3MiLCJfZGVmYXVsdCIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi9zcmMvZm9yRWFjaE9mLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1jaGVja1xuXG5pbXBvcnQge1xuICBnZXROYW1lZFR5cGUsXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMSW50ZXJmYWNlVHlwZSxcbiAgR3JhcGhRTElucHV0T2JqZWN0VHlwZSxcbiAgR3JhcGhRTEVudW1UeXBlLFxuICBHcmFwaFFMVW5pb25UeXBlLFxuICBHcmFwaFFMU2NhbGFyVHlwZSxcbiAgR3JhcGhRTFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG59IGZyb20gJ2dyYXBocWwnXG5cbi8qKlxuICogQHR5cGVkZWYgeyhcbiAqICAgdHlwZTogdW5rbm93bixcbiAqICAgdHlwZU5hbWU6IHN0cmluZyxcbiAqICAgdHlwZURpcmVjdGl2ZXM6IEFycmF5PEdyYXBoUUxEaXJlY3RpdmU+LFxuICogICBzY2hlbWE6IEdyYXBoUUxTY2hlbWEsXG4gKiAgIGNvbnRleHQ6IHVua25vd25cbiAqICkgPT4gdm9pZH0gRm9yRWFjaE9mUmVzb2x2ZXJcbiAqL1xuXG4gLyoqXG4gICogQHR5cGVkZWYgeyhcbiAgKiAgIHR5cGU6IHVua25vd24sXG4gICogICB0eXBlTmFtZTogc3RyaW5nLFxuICAqICAgdHlwZURpcmVjdGl2ZXM6IEFycmF5PEdyYXBoUUxEaXJlY3RpdmU+LFxuICAqICAgZmllbGQ6IHVua25vd24sXG4gICogICBmaWVsZE5hbWU6IHN0cmluZyxcbiAgKiAgIGZpZWxkQXJnczogQXJyYXk8R3JhcGhRTEFyZ3VtZW50PixcbiAgKiAgIGZpZWxkRGlyZWN0aXZlczogQXJyYXk8R3JhcGhRTERpcmVjdGl2ZT4sXG4gICogICBzY2hlbWE6IEdyYXBoUUxTY2hlbWEsXG4gICogICBjb250ZXh0OiB1bmtub3duXG4gICogICkgPT4gdm9pZH0gRm9yRWFjaEZpZWxkUmVzb2x2ZXJcbiAgKi9cblxuLy8gQ3JlYXRlIGNvbnN0YW50cyBmb3IgZWFjaCBvZiB0aGUgdHlwZXMgYWxsb3dlZCwgb3ZlciB3aGljaCBvbmUgbWlnaHRcbi8vIGl0ZXJhdGUuIFRoZXNlIGNhbiBiZSBiaXRtYXNrZWQgdG8gaW5jbHVkZSBtdWx0aXBsZSB0eXBlczsgaS5lLiBmb3IgYm90aFxuLy8gdHlwZSBhbmQgZW51bXMsIHBhc3MgVFlQRVMgfCBFTlVNUyBmb3IgdGhlIHR5cGVzIHBhcmFtZXRlci4gSXRcbi8vIGRlZmF1bHRzIHRvIHNpbXBseSB0eXBlcy5cbmNvbnN0IEFMTCA9IDFcbmNvbnN0IFRZUEVTID0gMlxuY29uc3QgSU5URVJGQUNFUyA9IDRcbmNvbnN0IEVOVU1TID0gOFxuY29uc3QgVU5JT05TID0gMTZcbmNvbnN0IFNDQUxBUlMgPSAzMlxuY29uc3QgUk9PVF9UWVBFUyA9IDY0XG5jb25zdCBJTlBVVF9UWVBFUyA9IDEyOFxuY29uc3QgSElEREVOID0gMjU2XG5jb25zdCBNYXNrcyA9IFtcbiAgQUxMLCBUWVBFUywgSU5URVJGQUNFUywgVU5JT05TLCBFTlVNUywgU0NBTEFSUyxcbiAgUk9PVF9UWVBFUywgSU5QVVRfVFlQRVNcbl1cbmV4cG9ydCB0eXBlIEJpdG1hc2tlZFR5cGUgPVxuICBBTEwgfCBUWVBFUyB8IElOVEVSRkFDRVMgfCBFTlVNUyB8IFVOSU9OUyB8IFNDQUxBUlMgfCBST09UX1RZUEVTIHwgSU5QVVRfVFlQRVMgfCBISURERU5cblxuLy8gQ3JlYXRlIGEgbWFwcGluZyBmcm9tIHRoZSBjb25zdGFudCB0byB0aGUgR3JhcGhRTCB0eXBlIGNsYXNzLlxuY29uc3QgVHlwZU1hcDogTWFwPG51bWJlciwgR3JhcGhRTFR5cGU+ID0gbmV3IE1hcCgpXG5UeXBlTWFwLnNldChUWVBFUywgR3JhcGhRTE9iamVjdFR5cGUpXG5UeXBlTWFwLnNldChST09UX1RZUEVTLCBHcmFwaFFMT2JqZWN0VHlwZSlcblR5cGVNYXAuc2V0KElOVEVSRkFDRVMsIEdyYXBoUUxJbnRlcmZhY2VUeXBlKVxuVHlwZU1hcC5zZXQoSU5QVVRfVFlQRVMsIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUpXG5UeXBlTWFwLnNldChFTlVNUywgR3JhcGhRTEVudW1UeXBlKVxuVHlwZU1hcC5zZXQoVU5JT05TLCBHcmFwaFFMVW5pb25UeXBlKVxuVHlwZU1hcC5zZXQoU0NBTEFSUywgR3JhcGhRTFNjYWxhclR5cGUpXG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciB0aGUgdmFsdWVzIGNvbnRhaW5lZCBpbiBhIFNjaGVtYSdzIHR5cGVNYXAuIElmIGEgZGVzaXJlZFxuICogdmFsdWUgaXMgZW5jb3VudGVyZWQsIHRoZSBzdXBwbGllZCBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQuIFRoZSB2YWx1ZXMgYXJlXG4gKiB0aGUgY29uc3RhbnRzIEFMTCwgVFlQRVMsIElOVEVSRkFDRVMsIEVOVU1TLCBVTklPTlMgYW5kIFNDQUxBUlMuIE9wdGlvbmFsbHlcbiAqIEhJRERFTiBpcyBhbm90aGVyIHZhbHVlIHRoYXQgY2FuIGJlIGJpdG1hc2tlZCB0b2dldGhlciBmb3IgYSB2YXJpZWQgcmVzdWx0LlxuICogSElEREVOIGV4cG9zZXMgdGhlIHZhbHVlcyBpbiB0aGUgc2NoZW1hIHR5cGVtYXAgdGhhdCBiZWdpbiB3aXRoIGEgZG91YmxlXG4gKiB1bmRlcnNjb3JlLlxuICpcbiAqIFRoZSBzaWduYXR1cmUgZm9yIHRoZSBmdW5jdGlvbiBjYWxsYmFjayBpcyBhcyBmb2xsb3dzOlxuICogKFxuICogICB0eXBlOiB1bmtub3duLFxuICogICB0eXBlTmFtZTogc3RyaW5nLFxuICogICB0eXBlRGlyZWN0aXZlczogQXJyYXk8R3JhcGhRTERpcmVjdGl2ZT5cbiAqICAgc2NoZW1hOiBHcmFwaFFMU2NoZW1hLFxuICogICBjb250ZXh0OiB1bmtub3duLFxuICogKSA9PiB2b2lkXG4gKlxuICogV2hlcmU6XG4gKiAgIGB0eXBlYCAgICAgICAgICAgLSB0aGUgb2JqZWN0IGluc3RhbmNlIGZyb20gd2l0aGluIHRoZSBgR3JhcGhRTFNjaGVtYWBcbiAqICAgYHR5cGVOYW1lYCAgICAgICAtIHRoZSBuYW1lIG9mIHRoZSBvYmplY3Q7IFwiUXVlcnlcIiBmb3IgdHlwZSBRdWVyeSBhbmRcbiAqICAgICAgICAgICAgICAgICAgICAgIHNvIG9uLlxuICogICBgdHlwZURpcmVjdGl2ZXNgIC0gYW4gYXJyYXkgb2YgZGlyZWN0aXZlcyBhcHBsaWVkIHRvIHRoZSBvYmplY3Qgb3IgYW5cbiAqICAgICAgICAgICAgICAgICAgICAgIGVtcHR5IGFycmF5IGlmIHRoZXJlIGFyZSBub25lIGFwcGxpZWQuXG4gKiAgIGBzY2hlbWFgICAgICAgICAgLSBhbiBpbnN0YW5jZSBvZiBgR3JhcGhRTFNjaGVtYWAgb3ZlciB3aGljaCB0byBpdGVyYXRlXG4gKiAgIGBjb250ZXh0YCAgICAgICAgLSB1c3VhbGx5IGFuIG9iamVjdCwgYW5kIHVzdWFsbHkgdGhlIHNhbWUgb2JqZWN0LFxuICogICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIHRvIHRoZSBjYWxsIHRvIGBtYWtlRXhlY3V0YWJsZVNjaGVtYSgpYFxuICogICAgICAgICAgICAgICAgICAgICAgb3IgYGdyYXBocWwoKWBcbiAqXG4gKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWF9IHNjaGVtYSB0aGUgc2NoZW1hIHRvIHBhcnNlXG4gKiBAcGFyYW0ge0ZvckVhY2hPZlJlc29sdmVyfSBmbiBhIGZ1bmN0aW9uIHdpdGggYSBzaWduYXR1cmUgZGVmaW5lZCBhYm92ZVxuICogQHBhcmFtIHt1bmtub3dufSBjb250ZXh0IHVzdWFsbHkgYW4gb2JqZWN0IGJ1dCBhbnkgbWl4ZWQgdmFsdWUgdGhlIGRlbm90ZXNcbiAqIHNvbWUgc2hhcmVkIGNvbnRleHQgYXMgaXMgdXNlZCB3aXRoIHRoZSBzY2hlbWEgZHVyaW5nIG5vcm1hbCBydW50aW1lLlxuICogQHBhcmFtIHtudW1iZXJ9IHR5cGVzIGEgYml0bWFzayBvZiBvbmUgb3IgbW9yZSBvZiB0aGUgY29uc3RhbnRzIGRlZmluZWRcbiAqIGFib3ZlLiBUaGVzZSBjYW4gYmUgT1InZWQgdG9nZXRoZXIgYW5kIGRlZmF1bHQgdG8gVFlQRVMuXG4gKiBAcmV0dXJuIHtHcmFwaFFMU2NoZW1hfSBhIG5ldyBzY2hlbWEgaXMgZ2VuZXJhdGVkIGZyb20gdGhpcyBTREwsIGl0ZXJhdGVkXG4gKiBvdmVyIGFuZCByZXR1cm5lZC5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaE9mKHNjaGVtYSwgZm4sIGNvbnRleHQsIHR5cGVzID0gQUxMKSB7XG4gIFtcbiAgICBHcmFwaFFMT2JqZWN0VHlwZSwgR3JhcGhRTEludGVyZmFjZVR5cGUsIEdyYXBoUUxFbnVtVHlwZSxcbiAgICBHcmFwaFFMVW5pb25UeXBlLCBHcmFwaFFMU2NhbGFyVHlwZVxuICBdLmZvckVhY2godCA9PiB7XG4gICAgaWYgKCF0KSByZXR1cm47XG5cbiAgICBpZiAoXG4gICAgICAhT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0LnByb3RvdHlwZSkuaW5jbHVkZXMoU3ltYm9sLnRvU3RyaW5nVGFnKVxuICAgICkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModC5wcm90b3R5cGUsIHtcbiAgICAgICAgW1N5bWJvbC50b1N0cmluZ1RhZ106IHsgZ2V0KCkgeyByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lIH0gfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgY29uc3QgdHlwZU1hcCA9IHNjaGVtYS5nZXRUeXBlTWFwKCk7XG5cbiAgT2JqZWN0LmtleXModHlwZU1hcCkuZm9yRWFjaCh0eXBlTmFtZSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVNYXBbdHlwZU5hbWVdO1xuICAgIGNvbnN0IGhpZGRlbiA9IGdldE5hbWVkVHlwZSh0eXBlKS5uYW1lLnN0YXJ0c1dpdGgoJ19fJylcbiAgICBjb25zdCBzaG93SGlkZGVuID0gKHR5cGVzICYgSElEREVOKSA9PT0gSElEREVOXG4gICAgY29uc3QgZGlyZWN0aXZlcyA9IHR5cGUgJiYgdHlwZS5hc3ROb2RlICYmIHR5cGUuYXN0Tm9kZS5kaXJlY3RpdmVzIHx8IFtdXG4gICAgbGV0IGRvSXQgPSAodHlwZXMgJiBBTEwpID09PSBBTExcblxuICAgIE1hc2tzLmZvckVhY2gobWFzayA9PiB7XG4gICAgICBpZiAoZG9JdCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKFxuICAgICAgICAobWFzayAmIFJPT1RfVFlQRVMpID09PSBST09UX1RZUEVTXG4gICAgICAgICYmXG4gICAgICAgIChcbiAgICAgICAgICB0eXBlID09PSBzY2hlbWEuZ2V0UXVlcnlUeXBlKClcbiAgICAgICAgICB8fCB0eXBlID09PSBzY2hlbWEuZ2V0U3Vic2NyaXB0aW9uVHlwZSgpXG4gICAgICAgICAgfHwgdHlwZSA9PT0gc2NoZW1hLmdldE11dGF0aW9uVHlwZSgpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBkb0l0ID0gdHJ1ZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkb0l0ID1cbiAgICAgICAgICAoKHR5cGVzICYgbWFzaykgPT09IG1hc2spICYmXG4gICAgICAgICAgdHlwZSBpbnN0YW5jZW9mIFR5cGVNYXAuZ2V0KG1hc2spXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFByZXZlbnQgaGlkZGVuIGl0ZW1zIGZyb20gYmVpbmcgc2hvd24gdW5sZXNzIGFza2VkIGZvclxuICAgIGRvSXQgPSBkb0l0ICYmICghaGlkZGVuIHx8IChoaWRkZW4gJiYgc2hvd0hpZGRlbikpXG5cbiAgICBpZiAoZG9JdClcbiAgICAgIGZuKHR5cGUsIHR5cGVOYW1lLCBkaXJlY3RpdmVzLCBzY2hlbWEsIGNvbnRleHQpXG4gIH0pO1xufVxuXG4vKipcbiAqIEFuIGV4dGVuc2lvbiBvZiBgZm9yRWFjaE9mYCB0aGF0IHRhcmdldHMgdGhlIGZpZWxkcyBvZiB0aGUgdHlwZXMgaW4gdGhlXG4gKiBzY2hlbWEncyB0eXBlTWFwLiBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVzIG1vcmUgZGV0YWlsIGFuZCBhbGxvd3MgZ3JlYXRlclxuICogYWNjZXNzIHRvIGFueSBhc3NvY2lhdGVkIGBjb250ZXh0YCB0aGFuIHRoZSBmdW5jdGlvbiBvZiB0aGUgc2FtZSBuYW1lXG4gKiBwcm92aWRlZCBieSB0aGUgYGdyYXBocWwtdG9vbHNgIGxpYnJhcnkuXG4gKlxuICogVGhlIHNpZ25hdHVyZSBmb3IgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGFzIGZvbGxvd3NcbiAqXG4gKiAoXG4gKiAgIHR5cGU6IHVua25vd24sXG4gKiAgIHR5cGVOYW1lOiBzdHJpbmcsXG4gKiAgIHR5cGVEaXJlY3RpdmVzOiBBcnJheTxHcmFwaFFMRGlyZWN0aXZlPixcbiAqICAgZmllbGQ6IHVua25vd24sXG4gKiAgIGZpZWxkTmFtZTogc3RyaW5nLFxuICogICBmaWVsZEFyZ3M6IEFycmF5PEdyYXBoUUxBcmd1bWVudD4sXG4gKiAgIGZpZWxkRGlyZWN0aXZlczogQXJyYXk8R3JhcGhRTERpcmVjdGl2ZT4sXG4gKiAgIHNjaGVtYTogR3JhcGhRTFNjaGVtYSxcbiAqICAgY29udGV4dDogdW5rbm93blxuICogKSA9PiB2b2lkXG4gKlxuICogV2hlcmVcbiAqXG4gKiBXaGVyZTpcbiAqICAgYHR5cGVgICAgICAgICAgICAtIHRoZSBvYmplY3QgaW5zdGFuY2UgZnJvbSB3aXRoaW4gdGhlIGBHcmFwaFFMU2NoZW1hYFxuICogICBgdHlwZU5hbWVgICAgICAgIC0gdGhlIG5hbWUgb2YgdGhlIG9iamVjdDsgXCJRdWVyeVwiIGZvciB0eXBlIFF1ZXJ5IGFuZCBzbyBvblxuICogICBgdHlwZURpcmVjdGl2ZXNgIC0gYW4gYXJyYXkgb2YgZGlyZWN0aXZlcyBhcHBsaWVkIHRvIHRoZSBvYmplY3Qgb3IgYW4gZW1wdHlcbiAqICAgICAgICAgICAgICAgICAgICAgIGFycmF5IGlmIHRoZXJlIGFyZSBub25lIGFwcGxpZWQuXG4gKiAgIGBmaWVsZGAgICAgICAgICAgLSB0aGUgZmllbGQgaW4gcXVlc3Rpb24gZnJvbSB0aGUgdHlwZVxuICogICBgZmllbGROYW1lYCAgICAgIC0gdGhlIG5hbWUgb2YgdGhlIGZpZWxkIGFzIGEgc3RyaW5nXG4gKiAgIGBmaWVsZEFyZ3NgICAgICAgLSBhbiBhcnJheSBvZiBhcmd1bWVudHMgZm9yIHRoZSBmaWVsZCBpbiBxdWVzdGlvblxuICogICBgZmllbGREaXJlY3RpdmVzYC0gYW4gYXJyYXkgb2YgZGlyZWN0aXZlcyBhcHBsaWVkIHRvIHRoZSBmaWVsZCBvciBhbiBlbXB0eVxuICogICAgICAgICAgICAgICAgICAgICAgYXJyYXkgc2hvdWxkIHRoZXJlIGJlIG5vIGFwcGxpZWQgZGlyZWN0aXZlc1xuICogICBgc2NoZW1hYCAgICAgICAgIC0gYW4gaW5zdGFuY2Ugb2YgYEdyYXBoUUxTY2hlbWFgIG92ZXIgd2hpY2ggdG8gaXRlcmF0ZVxuICogICBgY29udGV4dGAgICAgICAgIC0gdXN1YWxseSBhbiBvYmplY3QsIGFuZCB1c3VhbGx5IHRoZSBzYW1lIG9iamVjdCwgcGFzc2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICB0byB0aGUgY2FsbCB0byBgbWFrZUV4ZWN1dGFibGVTY2hlbWEoKWAgb3IgYGdyYXBocWwoKWBcbiAqXG4gKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWF9IHNjaGVtYVxuICogQHBhcmFtIHtGb3JFYWNoRmllbGRSZXNvbHZlcn0gZm4gYSBmdW5jdGlvbiB3aXRoIGEgc2lnbmF0dXJlIGRlZmluZWQgYWJvdmVcbiAqIEBwYXJhbSB7dW5rbm93bn0gY29udGV4dCB1c3VhbGx5IGFuIG9iamVjdCBidXQgYW55IG1peGVkIHZhbHVlIHRoZSBkZW5vdGVzXG4gKiBzb21lIHNoYXJlZCBjb250ZXh0IGFzIGlzIHVzZWQgd2l0aCB0aGUgc2NoZW1hIGR1cmluZyBub3JtYWwgcnVudGltZS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaEZpZWxkKHNjaGVtYSwgZm4sIGNvbnRleHQsIHR5cGVzID0gQUxMKSB7XG4gIGZvckVhY2hPZihcbiAgICBzY2hlbWEsXG4gICAgKHR5cGUsIHR5cGVOYW1lLCBfLCBjb250ZXh0LCBkaXJlY3RpdmVzKSA9PiB7XG4gICAgICBpZiAoIXR5cGUuX2ZpZWxkcykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmtleXModHlwZS5fZmllbGRzKS5mb3JFYWNoKGZpZWxkTmFtZSA9PiB7XG4gICAgICAgIGxldCBmaWVsZCA9IHR5cGUuX2ZpZWxkc1tmaWVsZE5hbWVdXG4gICAgICAgIGxldCBmaWVsZERpcmVjdGl2ZXMgPSBmaWVsZC5hc3ROb2RlICYmIGZpZWxkLmFzdE5vZGUuZGlyZWN0aXZlcyB8fCBbXVxuICAgICAgICBsZXQgZmllbGRBcmdzID0gZmllbGQuYXJncyB8fCBbXVxuXG4gICAgICAgIGZuKFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgZGlyZWN0aXZlcyxcbiAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICBmaWVsZE5hbWUsXG4gICAgICAgICAgZmllbGRBcmdzLFxuICAgICAgICAgIGZpZWxkRGlyZWN0aXZlcyxcbiAgICAgICAgICBzY2hlbWEsXG4gICAgICAgICAgY29udGV4dFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0sXG4gICAgY29udGV4dCxcbiAgICB0eXBlc1xuICApXG59XG5cbmV4cG9ydCB7XG4gIEFMTCxcbiAgVFlQRVMsXG4gIElOVEVSRkFDRVMsXG4gIEVOVU1TLFxuICBVTklPTlMsXG4gIFNDQUxBUlMsXG4gIFJPT1RfVFlQRVMsXG4gIElOUFVUX1RZUEVTLFxuICBISURERU4sXG5cbiAgVHlwZU1hcCxcblxuICBmb3JFYWNoT2YsXG4gIGZvckVhY2hGaWVsZFxufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JFYWNoT2ZcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQSxJQUFBQSxRQUFBLEdBQUFDLE9BQUE7QUFGQTs7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQyxHQUFHLEdBQUFDLE9BQUEsQ0FBQUQsR0FBQSxHQUFHLENBQUM7QUFDYixNQUFNRSxLQUFLLEdBQUFELE9BQUEsQ0FBQUMsS0FBQSxHQUFHLENBQUM7QUFDZixNQUFNQyxVQUFVLEdBQUFGLE9BQUEsQ0FBQUUs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
//# sourceMappingURL=forEachOf.js.map