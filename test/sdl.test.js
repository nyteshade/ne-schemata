import { gql, Schemata, TYPEDEFS_KEY } from '..'
import { parse, buildSchema, printSchema } from 'graphql'
import { sdl, schema } from './gql/person.graphql'

describe('testing Schemata', async () => {
  let str = sdl.sdl
  let ast = parse(str)
  let schema = buildSchema(str)

  it('checks to see if we can do string comparison', () => {
    expect(str == sdl).toBe(true)
  })

  it('proves that strings of the same value are not triple equal', () => {
    expect(str === sdl).not.toBe(true)
  })

  it('proves that valueOf() of a string and sdlstring are triple equal', () => {
    expect(str.valueOf() === sdl.valueOf()).toBe(true)
  })

  it('verifies astNode creation', () => {
    expect(sdl.ast).toEqual(ast)
  })

  it('verifies schema creation', () => {
    expect(printSchema(sdl.schema)).toEqual(printSchema(schema))
  })

  it('can be queried via run()', () => {
    let results = sdl.run('{ peeps { name gender } }')

    expect(results.data.peeps[0].name).toBe('Brielle')
    expect(results.data.peeps[0].gender).toBe('Female')
  })

  it('can be queried via runAsync()', async () => {
    let results = await sdl.runAsync('{ peeps { name gender } }')

    expect(results.data.peeps[1].name).toBe('Sally')
    expect(results.data.peeps[1].gender).toBe('Female')
  })

  it('can have its underlying data modified through effort', () => {
    let sdl2 = Schemata.from(sdl)
    let newSchemata = 'type Thing { id: ID }'

    sdl2[TYPEDEFS_KEY] = newSchemata

    expect(sdl2 == newSchemata).toBe(true)
    expect(sdl2 === newSchemata).not.toBe(true)
    expect(sdl2.valueOf() === newSchemata.valueOf()).toBe(true)
    expect(sdl2.valueOf() === newSchemata).toBe(true)
  })

  it('can have its types iterated over', () => {
    let types = new Set()

    sdl.forEachOf((type, typeName, directives, schema, context) => {
      types.add(typeName)
    })

    expect(Array.from(types)).toEqual(
      expect.arrayContaining(['Query', 'Person'])
    )
  })

  it('can have its fields iterated over', () => {
    let values = new Set()

    sdl.forEachField((
      type,
      typeName,
      typeDirectives,
      field,
      fieldName,
      fieldArgs,
      fieldDirectives,
      schema,
      context
    ) => {
      values.add(fieldName)
    })

    expect(Array.from(values)).toEqual(expect.arrayContaining([
      'name', 'gender', 'peeps'
    ]))
  })

  it('should return null if .schema is invoked with bad values', () => {
    let sdlString = gql`type Something { fieldOf: Undefined }`
    let astNode = sdlString.ast
    let schema = sdlString.schema

    expect(schema).toBe(null)
    expect(astNode).not.toBe(null)
  })

  it('should return null if .executableSchema is used with bad values', () => {
    let sdlString = gql`type Something { fieldOf: Undefined }`
    let astNode = sdlString.ast
    let schema = sdlString.executableSchema

    expect(schema).toBe(null)
    expect(astNode).not.toBe(null)
  })

  it('should be able to tell if a schema is executable or not', () => {
    expect(sdl.hasAnExecutableSchema).toBe(true)
    expect(
      gql`type Query { name: String }`.hasAnExecutableSchema
    ).not.toBe(true)
  })

  it('should be able to produce apollo style resolvers from the schema', () => {
    expect(() => {
      sdl.buildResolvers().Query.peeps
    }).not.toThrow()

    expect(typeof sdl.buildResolvers().Query.peeps).toBe('function')
    expect(typeof sdl.buildResolvers().Mutation.setPeep).toBe('function')
  })

  it('requesting buildResolvers with the flatten key should work', () => {
    expect(typeof sdl.buildResolvers(true).peeps).toBe('function')
    expect(typeof sdl.buildResolvers(true).setPeep).toBe('function')
  })

  it('requesting buildResolvers with extensions should work', () => {
    let resolvers = sdl.buildResolvers({
      Person: {
        name(r,a,c,i) {
          return 'Sally'
        }
      }
    })

    expect(typeof resolvers.Person.name).toBe('function')
    expect(typeof resolvers.peeps).not.toBe('function')
    expect(typeof resolvers.Query.peeps).toBe('function')
  })

  it('requesting buildResolvers with flatten & extensions should work', () => {
    let resolvers = sdl.buildResolvers(true, {
      Person: {
        name(r,a,c,i) {
          return 'Sally'
        }
      }
    })

    expect(typeof resolvers.Person.name).toBe('function')
    expect(typeof resolvers.peeps).toBe('function')
    expect(() => {
      expect(typeof resolvers.Query.peeps).not.toBe('function')
    }).toThrow()
  })

  it('should be able to identify when its resolvers are flattened', () => {
    let flatSdl = Schemata.from(
      'type Person { name: String } type Query { peep: Person }',
      { peep() { return { name: 'Sally' } } }
    )
    let nestedSdl = Schemata.from(
      'type Person { name: String } type Query { peep: Person }',
      { Query: { peep() { return { name: 'Sally' } } } }
    )
    let invalidSdl = Schemata.from(
      'I am not actually Schemata',
      { Query: { peep() { return { name: 'Sally' } } } }
    )

    expect(flatSdl.hasFlattenedResolvers).toBe(true)
    expect(nestedSdl.hasFlattenedResolvers).toBe(false)
    expect(invalidSdl.hasFlattenedResolvers).toBe(false)
    expect(invalidSdl.validSDL).toBe(false)
  })

  it('should be able to merge new Schemata with the bits in this instance', () => {
    let sdlA = gql`
      type Person {
        name: String
      }
    `

    let sdlB = gql`
      enum Gender { Male, Female }

      type Person {
        gender: Gender
      }
    `

    let merged = sdlA.mergeSDL(sdlB)
    let schema = merged.schema

    expect(schema.getType('Person').getFields().gender).toBeTruthy()
    expect(schema.getType('Gender')).toBeTruthy()
    expect(schema.getType('Person').getFields().name).toBeTruthy()
  })

  it('test the schemaResolverFor() method', () => {
    let sdlA = Schemata.from(
      `type Box { faces: Int } type Query { box: Box }`,
      { Box: { faces() {} }, Query: { box() { } } }
    )

    expect(sdlA.schemaResolverFor('Box', 'faces')).toBeTruthy()
    expect(sdlA.schemaResolverFor('Query', 'box')).toBeTruthy()
  })

  it('should be able to merge new GraphQLSchemas as easily', () => {
    let sdlA = Schemata.from(`
      type Box {
        faces: Int
        color: String
      }

      type Query {
        box: Box
      }
    `, { box() { return { faces: 6, color: 'tan' } } })

    let sdlB = Schemata.from(`
      type Chest {
        goldBars: Int
      }

      type Query {
        pirateTreasure: [Chest]
      }
    `, { pirateTreasure() { return [{ goldBars: 23 }] } })

    let merged = sdlA.mergeSchema(sdlB.executableSchema)
    let schema = merged.schema

    expect(schema.getQueryType().getFields().box).toBeTruthy()
    expect(schema.getQueryType().getFields().pirateTreasure).toBeTruthy()
  })

  it('should be able to work with the default conflict resolver', () => {
    let left = Schemata.from('type Box { name: String } type Query { box: Box }')
    let right = Schemata.from('type Query { box(color: String): Box }')
    let merged = left.mergeSDL(right)
    let field = merged.schemaFieldByName('Query', 'box')

    expect(field).toBeTruthy()
    expect(field.args.length).toBeTruthy()
    expect(field.args[0].name).toBe('color')
  })

  it('should be able to pare down Schemata given Schemata as a guide', () => {
    let left = Schemata.from('type Query { box: Box boxes: [Box] }')
    let right = Schemata.from('type Query { boxes: [Box] }')
    let pared = left.pareSDL(right)

    expect(pared.astFieldByName('Query', 'box')).toBeTruthy()
    expect(pared.astFieldByName('Query', 'boxes')).not.toBeTruthy()
  })
})
