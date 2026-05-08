import { Schemata } from '../../src/index.mjs'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const graphqlFile = join(__dirname, 'person.graphql')
const sdlString = readFileSync(graphqlFile, 'utf-8')

export const sdl = new Schemata(sdlString, {
  Query: {
    peeps
  },
  Mutation: {
    setPeep
  }
})

export const typeDefs = sdl
export const astNode = sdl.ast
export const schema = sdl.schema

export function peeps() {
  return [
    { name: 'Brielle', gender: 'Female' },
    { name: 'Sally', gender: 'Female' },
    { name: 'Randal', gender: 'TransMale' }
  ]
}

export function setPeep(r, { name, gender }, c, i) {
  return { name, gender }
}
