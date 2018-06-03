import { ExtendedResolver, Schemata, gql } from '..'

describe('Extending a resolver', () => {
  let resolver = function(source, args, context, info) {
    return {id: 123, name: 'Brielle', gender: 'Female'}
  }

  let schema = gql`
    type Person {
      id: ID
      name: String
      gender: String
    }

    type Query {
      peep: Person
    }
  `

  let resolversNormal = { peep: resolver }
  let resolversExtended = { peep: ExtendedResolver.from(resolver) }

  it('should work with plain resolvers', () => {
    let s = Schemata.from(schema)
    
  })
})
