#!/usr/bin/env node

require('./register')

let { Schemata, gql } = require('.')
let { parse, print, printSchema } = require('graphql')
let { merge } = require('lodash')

let repl = require('repl')

// Patch Function.prototype to provide the signature in the REPL
Object.defineProperty(Function.prototype, 'signature', {get() {let source =
this.toString(); if (source.startsWith('class')) {let parts =
/constructor\((.*?)\)\s*\{/.exec(source); return
`class ${this.name}(${parts[1]})`; } return source.slice(0, this.toString()
.indexOf('{')).trim(); } } )

let context = merge(global, {
  Schemata, gql, parse, print, printSchema, merge, repl
});

Object.defineProperty(context, 'help', { get: () => {
console.log(`
Welcome to the Schemata string repl bootstrapping process, the
following objects are in scope for you to use

  Schemata      - the Schemata class
  gql           - template tag function for creating Schemata instances
  parse         - converts SDL/IDL strings into AST nodes
  print         - converts AST nodes into a SDL/IDL string
  printSchema   - converts a GraphQLSchema object into SDL/IDL
  merge         - underscore's merge() function
`)
}})

context.help

merge(repl.start('> ').context, context)
