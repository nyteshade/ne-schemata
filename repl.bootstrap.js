#!/usr/bin/env node

require('./register')

const {
  asyncWalkResolverMap,
  atNicely,
  ExtendedResolver,
  gql,
  Schemata,
  walkResolverMap,
} = require('.')
const { parse, print, printSchema } = require('graphql')
const { merge } = require('lodash')

let repl = require('repl')

// Patch Function.prototype to provide the signature in the REPL
Object.defineProperty(Function.prototype, 'signature', {
  get() {
    let source = this.toString()

    if (source.startsWith('class')) {
      let parts = /constructor\((.*?)\)\s*\{/.exec(source)

      return `class ${this.name}(${parts[1]})`
    }

    return source.slice(0, this.toString().indexOf('{')).trim()
  },
})
// End patching Function.prototype for 'signature'

let sdlA = Schemata.from(
  ` type Box { faces: Int color: String } type Query { box: Box } `,
  {
    box() {
      return { faces: 6, color: 'tan' }
    },
  },
)

let sdlB = Schemata.from(
  ` type Chest { goldBars: Int } type Query { pirateTreasure: [Chest] } `,
  {
    pirateTreasure() {
      return [{ goldBars: 23 }]
    },
  },
)

let merged = sdlA.merge(sdlB, { createMissingResolvers: true })
let schema = merged.schema

let context = merge(global, {
  Schemata,
  gql,
  parse,
  print,
  printSchema,
  merge,
  repl,
  at: atNicely,
  walkResolverMap,
  asyncWalkResolverMap,
  ExtendedResolver,
  graphql: require('graphql'),
  sdlA,
  sdlB,
  merged,
  schema,
})

const help = 
`
Welcome to the Schemata string repl bootstrapping process, the
following objects are in scope for you to use

  Schemata        - the Schemata class
  gql             - template tag function for creating Schemata instances
  graphql         - require('graphql')
  parse           - converts SDL/IDL strings into AST nodes
  print           - converts AST nodes into a SDL/IDL string
  printSchema     - converts a GraphQLSchema object into SDL/IDL
  merge           - underscore's merge() function
  at              - useful function dynamically getting props of an object
  walkResolverMap - a function that walks over a resolver map and makes
                    changes. Callback is (key, value, path, map)
  asyncWalkResolverMap - \x1b[3masync version of the above\x1b[0m
  ExtendedResolver - the resolver wrapper class

  sdlA            - Schemata instance
  sdlB            - Schemata instance
  merged          - Merged schemas of sdlA and sdlB
  schema          - GraphQLSchema instance of merged
`


Object.defineProperty(context, 'help', {
  get() {
    console.log(help,)
    return help
  },
})

console.log(help)

merge(repl.start('> ').context, context)
