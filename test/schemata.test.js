import { gql, Schemata, TYPEDEFS_KEY } from '..'
import { sdl, schema } from './gql/person.graphql'
import {
  parse,
  buildSchema,
  printSchema,
  GraphQLScalarType
} from 'graphql'

describe('testing Schemata', () => {
  let str = String(sdl)
  let ast = Schemata.parse(str)
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

  it('can be queried via run()', async () => {
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
      expect.arrayContaining(['Query', 'Person']),
    )
  })

  it('can have its fields iterated over', () => {
    let values = new Set()

    sdl.forEachField(
      (
        type,
        typeName,
        typeDirectives,
        field,
        fieldName,
        fieldArgs,
        fieldDirectives,
        schema,
        context,
      ) => {
        values.add(fieldName)
      },
    )

    expect(Array.from(values)).toEqual(
      expect.arrayContaining(['name', 'gender', 'peeps']),
    )
  })

  it('should return null if .schema is invoked with bad values', () => {
    let astNode = gql`
      type Something {
        fieldOf: Undefined
      }
    `
    let schema = astNode.schema

    expect(schema).toBe(null)
    expect(astNode).not.toBe(null)
  })

  it('should return null if .schema is used with bad values', () => {
    let astNode = gql`
      type Something {
        fieldOf: Undefined
      }
    `
    let schema = astNode.schema

    expect(schema).toBe(null)
    expect(astNode).not.toBe(null)
  })

  it('should be able to tell if a schema is executable or not', () => {
    expect(sdl.hasAnExecutableSchema).toBe(true)
    expect(
      gql`
        type Query {
          name: String
        }
      `.hasAnExecutableSchema,
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
        name(r, a, c, i) {
          return 'Sally'
        },
      },
    })

    expect(typeof resolvers.Person.name).toBe('function')
    expect(typeof resolvers.peeps).not.toBe('function')
    expect(typeof resolvers.Query.peeps).toBe('function')
  })

  it('requesting buildResolvers with flatten & extensions should work', () => {
    let resolvers = sdl.buildResolvers(true, {
      Person: {
        name(r, a, c, i) {
          return 'Sally'
        },
      },
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
      {
        peep() {
          return { name: 'Sally' }
        },
      },
    )
    let nestedSdl = Schemata.from(
      'type Person { name: String } type Query { peep: Person }',
      {
        Query: {
          peep() {
            return { name: 'Sally' }
          },
        },
      },
    )
    let invalidSdl = Schemata.from('I am not actually Schemata', {
      Query: {
        peep() {
          return { name: 'Sally' }
        },
      },
    })

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
    `.schemata

    let sdlB = gql`
      enum Gender {
        Male
        Female
      }

      type Person {
        gender: Gender
      }
    `.schemata

    let merged = sdlA.mergeSDL(sdlB)
    let schema = merged.schema

    expect(schema.getType('Person').getFields().gender).toBeTruthy()
    expect(schema.getType('Gender')).toBeTruthy()
    expect(schema.getType('Person').getFields().name).toBeTruthy()
  })

  it('test the schemaResolverFor() method', () => {
    let sdlA = Schemata.from(
      `type Box { faces: Int } type Query { box: Box }`,
      { Box: { faces() {} }, Query: { box() {} } },
    )

    expect(sdlA.schemaResolverFor('Box', 'faces')).toBeTruthy()
    expect(sdlA.schemaResolverFor('Query', 'box')).toBeTruthy()
  })

  it('should be able to merge schemas and wrap all merged fields', () => {
    let sdlA = Schemata.from(
      `
        type Box {
          faces: Int
          color: String
        }

        type Query {
          box: Box
        }
      `,
      {
        box() {
          return { faces: 6, color: 'tan' }
        },
      },
    )

    let sdlB = Schemata.from(
      `
        type Chest {
          goldBars: Int
        }

        type Query {
          pirateTreasure: [Chest]
        }
      `,
      {
        pirateTreasure() {
          return [{ goldBars: 23 }]
        },
      },
    )

    let merged = sdlA.merge(sdlB, { createMissingResolvers: true })
    let schema = merged.schema
    let isFn = f => typeof f === 'function'

    expect(schema.getType('Box').getFields().faces).toBeTruthy()
    expect(schema.getType('Box').getFields().color).toBeTruthy()
    expect(schema.getType('Chest').getFields().goldBars).toBeTruthy()
    expect(schema.getQueryType().getFields().box).toBeTruthy()
    expect(schema.getQueryType().getFields().pirateTreasure).toBeTruthy()

    expect(isFn(merged.resolvers.Query.box)).toBe(true)
    expect(isFn(merged.resolvers.Query.pirateTreasure)).toBe(true)
    expect(merged.prevResolverMaps.length).not.toBe(0)

    let prevMap0 = merged.prevResolverMaps[0]
    let prevMap1 = merged.prevResolverMaps[1]

    expect(prevMap0.resolvers.Query).toBeTruthy()
    expect(isFn(prevMap0.resolvers.Query.box)).toBe(true)
    expect(prevMap0.resolvers.Box).not.toBeTruthy()
    expect(prevMap1.resolvers.Query).toBeTruthy()
    expect(isFn(prevMap1.resolvers.Query.pirateTreasure)).toBe(true)

    expect(merged.resolvers.Query).toBeTruthy()
    expect(isFn(merged.resolvers.Query.pirateTreasure)).toBe(true)
    expect(isFn(merged.resolvers.Query.box)).toBe(true)
    expect(merged.resolvers.Chest).toBeTruthy()
    expect(isFn(merged.resolvers.Chest.goldBars)).toBe(true)
    expect(merged.resolvers.Box).toBeTruthy()
    expect(isFn(merged.resolvers.Box.faces)).toBe(true)
    expect(isFn(merged.resolvers.Box.color)).toBe(true)
  })

  it('should be able to work with the default conflict resolver', () => {
    let left = Schemata.from(
      'type Box { name: String } type Query { box: Box }',
    )
    let right = Schemata.from('type Query { box(color: String): Box }')
    let merged = left.mergeSDL(right)
    let field = merged.schemaFieldByName('Query', 'box')

    expect(field).toBeTruthy()
    expect(field.args.length).toBeTruthy()
    expect(field.args[0].name).toBe('color')
  })

  it('should be able to take a custom conflict resolver', () => {
    let ccr = {
      fieldMergeResolver(leftType, leftField, rightType, rightField) {
        return leftField
      },
    }
    let left = Schemata.from(
      'type Box { name: String } type Query { box: Box }',
    )
    let right = Schemata.from('type Query { box(color: String): Box }')
    let merged = left.mergeSDL(right, ccr)
    let field = merged.schemaFieldByName('Query', 'box')

    expect(field).toBeTruthy()
    expect(field.args.length).not.toBeTruthy()
    expect(() => {
      expect(field.args[0].name).toBe('color')
    }).toThrow()
  })

  it('should be able to merge custom scalars with resolvers', () => {
    let lScalarFn = new GraphQLScalarType({
      name: 'ContrivedScalar',
      description: 'Left hand scalar',
      serialize(value) {
        return value
      },
      parseValue(value) {
        return 24
      },
      parseLiteral(ast) {
        return ast
      },
    })

    let rScalarFn = new GraphQLScalarType({
      name: 'ContrivedScalar',
      description: 'Right hand scalar',
      serialize(value) {
        return value
      },
      parseValue(value) {
        return 42
      },
      parseLiteral(ast) {
        return ast
      },
    })

    let lSchemata = Schemata.from(
      `
      scalar ContrivedScalar

      type ContrivedType {
        value: ContrivedScalar
      }

      type Query {
        contrivances: ContrivedType
      }
    `,
      { ContrivedType: lScalarFn },
    )

    let rSchemata = Schemata.from(
      `
      scalar ContrivedScalar

      type Query {
        moreContrivances: ContrivedScalar
      }
    `,
      { ContrivedType: rScalarFn },
    )

    lSchemata.mergeSDL(rSchemata, {
      scalarMergeResolver(lS, lC, rS, rC) {
        expect(lS).toBeTruthy()
        expect(lC).toBeTruthy()
        expect(rS).toBeTruthy()
        expect(rC).toBeTruthy()

        expect(lC).toBe(lScalarFn)
        expect(rC).toBe(rScalarFn)

        return rC
      },
    })
  })

  it('should be able to pare down Schemata given Schemata as a guide', () => {
    let left = Schemata.from('type Query { box: Box boxes: [Box] }')
    let right = Schemata.from('type Query { boxes: [Box] }')
    let pared = left.pareSDL(right)

    expect(pared.astFieldByName('Query', 'box')).toBeTruthy()
    expect(pared.astFieldByName('Query', 'boxes')).not.toBeTruthy()
  })

  it('should have a resolver for each and every field defined', () => {
    let peep = (r, a, c, i) => {
      return { name: 'Brie', id: 5 }
    }
    let resolvers
    let schemata = Schemata.from(
      gql`
        type Person {
          name: String
          id: ID
        }

        type Query {
          peep: Person
        }
      `,
      { Query: { peep } },
    )

    resolvers = schemata.buildResolverForEachField()

    expect(resolvers.Person.name).toBeTruthy()
    expect(resolvers.Person.id).toBeTruthy()
    expect(resolvers.Query.peep).toBeTruthy()

    resolvers = schemata.buildResolverForEachField(true)

    expect(resolvers.Person.name).toBeTruthy()
    expect(resolvers.Person.id).toBeTruthy()
    expect(resolvers.peep).toBeTruthy()
  })

  it('should allow the setting and retrieval of a directives object', () => {
    let schemata = Schemata.from(gql`
      directive @sample on FIELD_DEFINITION | ENUM_VALUE

      type ExampleType {
        newField: String
        oldField: String @sample
      }
    `)

    class SampleDirective /* extends SchemaDirectiveVisitor */ {
      visitFieldDefinition(field) {
        field.isSample = true
        field.sampleReason = 'truth'
      }

      visitEnumValue(value) {
        value.isSample = true
        value.sampleReason = 'truth'
      }
    }

    expect(schemata.schemaDirectives).toBeUndefined()

    let directives = {
      sample: SampleDirective
    }

    schemata.schemaDirectives = directives

    expect(schemata.schemaDirectives).not.toBeUndefined()
    expect(schemata.schemaDirectives).toBe(directives)
  })

  it('should be able to provide a js representation of sdl for types', () => {
    let schema = gql`
      type Person {
        id: ID
        name: String
        friends: [Person]!
      }

      type Query {
        person(id: ID!): Person
        people: [Person]
      }
    `
    let types = schema.types

    expect(types).toMatchObject({
      Person: {
        id: { type: 'ID', args: [] },
        name: { type: 'String', args: [] },
        friends: { type: '[Person]!', args: [] }
      },
      Query: {
        person: { type: 'Person', args: [{ id: 'ID!'}] },
        people: { type: '[Person]', args: [] }
      }
    })
  })

  it('should support extend type', () => {
    let schemata = gql`
      type User {
        name: String
      }

      extend type User {
        age: Int
      }
    `.schemata
    let basicSchema = buildSchema(schemata.sdl)

    // Note that in some semi-recent build of GraphQL, they started to
    // natively support `extend type`. Therefore, buildSchema and the
    // ne-schemata schema code both work and exist here.

    expect(schemata.includes('extend')).toBe(true)
    expect(basicSchema._typeMap.User._fields.age).toBeTruthy()
    expect(schemata.schema._typeMap.User._fields.age).toBeTruthy()
  })

  it('.flatSDL should show a User with both age and name', () => {
    let schemata = gql`
      type User {
        name: String
      }

      extend type User {
        age: Int
      }
    `.schemata
    let flatSDL = schemata.flatSDL

    expect(schemata.includes('extend')).toBe(true)
    expect(flatSDL.includes('extend')).toBe(false)
  })

  it('should support flattenSDL()', () => {
    let schemata = gql`
      type User {
        name: String
      }

      extend type User {
        age: Int
      }
    `.schemata
    expect(schemata.includes('extend')).toBe(true)
    schemata.flattenSDL()
    expect(schemata.includes('extend')).toBe(false)
    expect(schemata.schema._typeMap.User._fields.age).toBeTruthy()
  })
})
