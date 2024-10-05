#!/usr/bin/env node

const {
  asyncWalkResolverMap,
  atNicely,
  ExtendedResolver,
  gql,
  Schemata,
  walkResolverMap,
} = await import('./dist/index.js')

const graphql = await import('graphql')
const { parse, print, printSchema } = graphql
const { createRepl } = await import('./bin/repl.basics.js')

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
  at              - useful function dynamically getting props of an object
  walkResolverMap - a function that walks over a resolver map and makes
                    changes. Callback is (key, value, path, map)
  asyncWalkResolverMap - \x1b[3masync version of the above\x1b[0m
  ExtendedResolver - the resolver wrapper class

  sdlA            - Schemata instance
  sdlB            - Schemata instance
  merged          - Merged schemas of sdlA and sdlB
  schema          - GraphQLSchema instance of merged

  .help           - See REPL dot commands
  info            - Show this menu again
`

const base = { configurable: true, enumerable: true }
const baseData = { ...base, writable: true }
const data = value => ({ value, ...baseData })
const accessor = (get, set) => ({ get, set, ...base })

createRepl({
  commands: [
    ['info', {
      action() {
        console.log(help);
        this?.displayPrompt()
      },
      help: 'Shows info about defined properties'
    }]
  ],
  exports: Object.defineProperties({}, {
    Schemata: data(Schemata),
    gql: data(gql),
    parse: data(parse),
    print: data(print),
    printSchema: data(printSchema),
    at: data(atNicely),
    walkResolverMap: data(walkResolverMap),
    asyncWalkResolverMap: data(asyncWalkResolverMap),
    ExtendedResolver: data(ExtendedResolver),
    graphql: data(graphql),
    sdlA: data(sdlA),
    sdlB: data(sdlB),
    merged: data(merged),
    schema: data(schema),
  }),
  onReady() {
    console.log(help)
  }
})