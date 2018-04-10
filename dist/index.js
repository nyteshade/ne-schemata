'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPEDEFS_KEY = exports.stripResolversFromSchema = exports.SDL = exports.Schemata = exports.register = exports.jestTransformer = exports.gql = undefined;

var _Schemata = require('./Schemata');

var _GraphQLExtension = require('./GraphQLExtension');

var _gqlTagFn = require('./gqlTagFn');

var _jestTransformer = require('./jestTransformer');

const SDL = _Schemata.Schemata;

exports.gql = _gqlTagFn.gql;
exports.jestTransformer = _jestTransformer.jestTransformer;
exports.register = _GraphQLExtension.register;
exports.Schemata = _Schemata.Schemata;
exports.SDL = SDL;
exports.stripResolversFromSchema = _Schemata.stripResolversFromSchema;
exports.TYPEDEFS_KEY = _Schemata.TYPEDEFS_KEY;
exports.default = _Schemata.Schemata;
//# sourceMappingURL=index.js.map