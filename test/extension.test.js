/**
 ** NOTE!!
 ** jest mocks up the require() hook entirely. Changes made to GraphQLExtension
 ** need to be reflected in the jestTransformer class or you will see strange
 ** errors crop up during testing.
 **
 ** Future self, you have been warned
 **/

import {
  astNode,
  resolvers,
  schema,
  sdl,
  typeDefs
} from './gql/person.graphql'

import { Schemata } from '../dist'

import { parse, print, buildSchema, printSchema } from 'graphql'

describe('check to see if requiring a .graphql works as expected', () => {
  it('should have a valid ASTNode', () => {
    expect(() => {
      print(astNode)
    }).not.toThrow()
  })

  it('should be that astNode and sdl.ast are the same', () => {
    expect(astNode).toEqual(sdl.ast)
  })

  it('should have a valid resolvers method', () => {
    expect(resolvers.peeps).toBeTruthy()
  })

  it('should be that sdl.resolvers and resolvers are the same', () => {
    expect(resolvers).toEqual(sdl.resolvers)
  })

  it('should be that sdl and typeDefs are the same', () => {
    expect(sdl.valueOf() === typeDefs.valueOf()).toBe(true)
    expect(sdl instanceof Schemata).toBe(true)
    expect(typeDefs instanceof Schemata).toBe(true)
    expect(sdl).toBe(typeDefs)
  })

  it('should be that a new GraphQLSchema is the same as sdl.schema', () => {
    let schema = buildSchema(sdl.sdl)

    // Comparison of a schema is hard due to the fact that new instances of
    // underlying data objects, despite their values being the same, have
    // different object references. So we normalize that by comparing JSON
    // representations
    expect(printSchema(schema)).toEqual(printSchema(sdl.schema))
  })

})