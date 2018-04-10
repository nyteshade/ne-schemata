# ne-schemata [![Build Status](https://travis-ci.org/nyteshade/ne-schemata.svg?branch=master)](https://travis-ci.org/nyteshade/ne-schemata) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) ![package version](https://img.shields.io/badge/dynamic/json.svg?label=version&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fnyteshade%2Fne-schemata%2Fmaster%2Fpackage.json&query=version&colorB=1d7ebe)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/graphql-logo.png)

GraphQL IDL/Schemata String class to make working with GraphQL easier

## Overview

Working with Schemata (Schema Definition Language), sometimes called IDL (Interface Definition Language) can occasionally be difficult. A schema definition is the most concise way to specify a schema in GraphQL.

Classes in programming languages are data structures that associated properties and functions designed to work with them. The provided `Schemata` class extends String and should be able to be used in most places in JavaScript where strings are used with no changes. This, however, is where things change.

Some of the most often applied tasks with SDL are building a schema object, building an executable schema object, parsing it into [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) objects. Occasionally a given bit of SDL is checked for validity.

The Schemata class does all this and more.

## Features

Biggest selling points of working with the Schemata class

- [x] Creation of bound or non-bound [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48) and [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) object
- [x] Storage of an associated `resolvers` map
- [x] Storage of an associated `schema` object for iteration and modification
- [x] Checking of the validity of SDL as a [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) as well as a [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48)
- [x] Merge SDL together via AST parsing
- [x] Merge multple GraphQLSchemas via AST parsing
- [x] Pare down one SDL/Schema using another as a guide

## Installation

Simply npm or yarn install the package

```sh
/Volumes/harddrive/path/to/your/project
$ npm install --save ne-schemata
```

## Usage

### Using `new`

Creating instances of Schemata can of course be done with typical JavaScript via the `new` keyword.

```js
let schemata = new Schemata('type Person { name: String } type Query { peep: Person }')
```

### Using `Schemata.from`

Creating instances of Schemata can also be done with a constant on the class itself called `.from()`.

```js
let schemata = Schemata.from('type Person { name: String } type Query { peep: Person }')
```

### From an existing instance of Schemata

Creating instances of Schemata from other instances of Schemata is also supported. In these cases, all the set values of note will be moved over. This includes schema and resolvers set on the original instance.

```js
let sdlA = Schemata.from(
  'type Person { name: String } type Query { peep: Person }',
  { Query: { peep() { return { name: 'Brielle' } } } }
)
let sdlB = Schemata.from(sdlA)

console.log(sdlB.resolvers) // { Query: { peep: [function peep()] } }
```

### From an instance of GraphQLSchema

You can also create a Schemata instance from an existing instance of GraphQLSchema. The typeDefs or SDL string will be generated using `printSchema()` from the base graphql module. The `.schema` value will be set explicitly to the value supplied in the case it is executable or has had other modifications performed on it. To prevent it being regenerated by `.executableSchema` should that property be accessed, a symbol property will be set on the schema to denote it should not be touched.

```js
import { makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

let link = new HttpLink({ uri: 'some uri', fetch })
let schema = makeRemoteExecutableSchema(await introspectSchema(link), link)
let schemata = new Schemata(schema) // or Schemata.from(schema)

console.log(schemata) // the SDL from the remote schema
```

### Using the `gql` template function

Alternatively, creating a Schemata string instance can be done using the `gql` template function. The function was named as many popular editors have a syntax highlighting theme that highlights GraphQL SDL. It seemed to make a lot of sense to add the resulting string from this as an instance of `Schemata`

```js
import { gql } from 'ne-schemata'

let schemata = gql`
  type Person {
    name: String
  }

  type Query {
    peep: Person
  }
`

let schema = schemata.schema
```

### Using require('file.graphql') with require extensions

The final way to create new instances of Schemata in a helpful and unobtrusive manner is to use the `'.graphql'` extension handler. This handler registers the `'.graphql'` extension with the `require()` function in your local nodeJS environment.

Once registered, `require()` and `import {} from` will now do several interesting things with `'.graphql'` imported text. First the resulting exported object has 5 different keys, with the default being a Schemata string wrapping the contents of the file itself.

The five exports of imported `'.graphql'` files are:

- [x] **astNode** an [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) object representing the parsed contents of the file
- [x] **resolvers** *if* there is an adjacent .js file of the same name, *and if* that file exports `'resolvers'` *or if* the exported results are an object and not a function, then that object is considered to be a resolvers map for the associated `.graphql` file.
- [x] **schema** generated from the contents of the Schemata string. If the resolvers object was successfully generated and imported, this will be an executableSchema instead.
- [x] **sdl** the Schemata string instance, also the **default** export
- [x] **typeDefs** keeping in line and adding compatibility with Apollo Server, the `typeDefs` export is simply a synonym for `sdl`.

How do you use the extension? Somewhere, typically early on in the project entry script, make a call to `register()` and then subsequently `import/require` your `'.graphql'` files.

```js
require('ne-schemata/register')

import { sdl, schema, resolvers } from './graphql/Person.graphql'

// or alternatively
require('ne-schemata').register('graphql') // or simply register() as .graphql is the default

import { sdl, schema, resolvers } from './graphql/Person.graphql'
```

### Schemata Merging (both strings and GraphQLSchema objects)

AST merging of multiple SDL files and resolver maps. This will allow you to do something like the following. Merging schemas is just as easy. A new instance of GraphQLSchema will be created and stored on the instance but the pre-existing resolvers will be deeply merged with the supplied resolvers on the schema to be merged and all will be applied and bound to the newly generated schema.

```js
import graphqlHTTP from 'express-graphql'
import Express from 'express'
import { gql } from 'ne-schemata'

const app = Express()
const sdlA = gql`type Person { name: String } type Query { peep: Person }`
const sdlB = gql`type Person { age: Int } type Query { peeps: [Person] }`
const sdlC = sdlA.mergeSDL(sdlB)

/*
sdlC.schema would evaluate to something like the following:

type Person {
  name: String
  age: Int
}

type Query {
  peep: Person
  peeps: [Person]
}
*/

app.use('/graphql', graphqlHTTP({
  schema: sdlC.schema,
  graphiql: true
}))

app.listen(4000)
```

### <a name="contents"></a>Schemata Class Properties and Methods

- [Instance properties](#instance-properties)
  - [.ast](#inst-ast): [`?ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88)
  - [.executableSchema](#inst-executable-schema): [`?GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48)
  - [.graphiql](#inst-graphiql): `boolean`
  - [.hasAnExecutableSchema](#inst-has-an-executable-schema): `boolean`
  - [.hasFlattenedResolvers](#inst-has-flattened-resolvers): `boolean`
  - [.resolvers](#inst-resolvers): `?Object`
  - [.rootValue](#inst-root-value): `?Object`
  - [.schema](#inst-schema): [`?GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48)
  - [.sdl](#inst-sdl): `string`
  - [.typeDefs](#inst-type-defs): `string`
  - [.valid](#inst-valid): `boolean`
  - [.validSchema](#inst-valid-schema): `boolean`
  - [.validSDL](#inst-valid-sdl): `boolean`
- [Instance methods](#instance-methods)
  - [buildResolvers](#build-resolvers)
  - [clearResolvers](#clear-resolvers)
  - [clearSchema](#clear-schema)
  - [forEachEnum](#for-each-enum)
  - [forEachField](#for-each-field)
  - [forEachInputObjectField](#for-each-input-object-field)
  - [forEachInputObjectType](#for-each-input-object-type)
  - [forEachInterface](#for-each-interface)
  - [forEachInterfaceField](#for-each-interface-field)
  - [forEachOf](#for-each-of)
  - [forEachRootType](#for-each-root-type)
  - [forEachScalar](#for-each-scalar)
  - [forEachType](#for-each-type)
  - [forEachTypeField](#for-each-type-field)
  - [forEachUnion](#for-each-union)
  - [mergeSchema](#merge-schema)
  - [mergeSDL](#merge-sdl)
  - [pareSDL](#pare-sdl)
  - [run](#run)
  - [runAsync](#run-async)
- [Static properties](#static-properties)
  - [.ALL](#const-all):`Number`
  - [.ENUMS](#const-enums):`Number`
  - [.gql](#const-gql):`Module`
  - [.HIDDEN](#const-hidden):`Number`
  - [.INPUT_TYPES](#const-input-types):`Number`
  - [.INTERFACES](#const-interfaces):`Number`
  - [.ROOT_TYPES](#const-root-types):`Number`
  - [.SCALARS](#const-scalars):`Number`
  - [.TYPES](#const-types):`Number`
  - [.UNIONS](#const-unions):`Number`
- [Static methods](#static-methods)
  - [buildSchema()](#fn-buildSchema)
  - [from()](#fn-from)
  - [parse()](#fn-parse)
- [Exported types](#exported-types)
  - [ConflictResolvers](#type-conflict-resolvers)
  - [DirectiveMergeResolver](#type-directive-merge-resolver)
  - [EnumMergeResolver](#type-enum-merge-resolver)
  - [FieldMergeResolver](#type-field-merge-resolver)
  - [ForEachFieldResolver](#type-for-each-field-resolver)
  - [ForEachOfResolver](#type-for-each-of-resolver)
  - [ScalarMergeResolver](#type-scalar-merge-resolver)
  - [UnionMergeResolver](#type-union-enum-merge-resolver)

## <a name="instance-properties"></a>Instance properties [✯](#contents)

#### <a name="inst-ast"></a>.ast [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) generates ASTNodes that the internal string would generate when passed to `require('graphql').parse()`

#### <a name="inst-schema"></a>.schema [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves any internally stored [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48) instance generated thus far; if one does not exist, one will be generated
![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) sets the value of the internal [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48) storage variable

#### <a name="inst-executable-schema"></a>.executableSchema [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves the internally stored executable schema, if one exists, or it creates one if the `.resolvers` value has been set and if there is valid `.sdl`

#### <a name="inst-graphiql"></a>.graphiql [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves the `.graphiql` flag which defaults to true. This might be used by express-graphql. Schemata **does not** use this flag internally, but rather stores it as a convenience property.<br/>
![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) sets the internal graphiql flag to a value other than true. Remember that this field is not used internally by Schemata other than storage and retrieval.

#### <a name="inst-has-an-executable-schema"></a>.hasAnExecutableSchema [✯](#contents)
![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) A getter to determine if an executable schema is attached to this Schemata instance. It does so by walking the schema fields via `buildResolvers()` and reporting whether there is anything inside the results or not.

#### <a name="inst-has-flattened-resolvers"></a>.hasFlattenedResolvers [✯](#contents)
![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) Determines if the internal resolver map has at least one defined root type resolver (Query, Mutation, Subscription) or not. If not, including if there are no root resolvers (yet), this property will evaluate to false

#### <a name="inst-sdl"></a>.sdl [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) the same value as the string this instance represents

#### <a name="inst-type-defs"></a>.typeDefs [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) a synonym for `.schemata`, ideal for use with Apollo and other librariees that expect this nomenclature

#### <a name="inst-root-value"></a>.rootValue [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) a synonym for `.resolvers`, ideal for use with express-graphql or other libraries that expect this nomenclature. *Note: that the format of this object is slightly different for Apollo than the Facebook reference implementation*

#### <a name="inst-resolvers"></a>.resolvers [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves any internaly store resolvers map
![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) sets the internally stored resolvers map

#### <a name="inst-valid-sdl"></a>.validSDL [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) if the SDL this string represents can be parsed without error, true will be returned; false otherwise

#### <a name="inst-valid-schema"></a>.validSchema [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) if the SDL this string represents can be used to build a schema without error, true will be returned; false otherwise

#### <a name="inst-valid"></a>.valid [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) returns true if both `.validSDL` and `.validSchema` are both true

## <a name="instance-methods"></a>Instance methods [✯](#contents)

#### <a name="build-resolvers"></a>buildResolvers [✯](#contents)
```js
buildResolvers(
  flattenRootResolversOrFirstParam: boolean|Object,
  ...extendWith: Array<Object>
): Object
```
In the case where Schemata instance was created with a GraphQLSchema, especially one that is an executableSchema or somehow has resolvers in it already, `buildResolvers()` will walk the schema fields and build up a resolvers object of those `resolve()` functions on each field. If true is supplied as the first parameter, the resolver functions from Query, Mutation and Subscription will appear in the root of the returned object rather than under their aforementioned parent types.

#### <a name="clear-resolvers"></a>clearResolvers [✯](#contents)
```js
clearResolvers()
```
Removes any existing `.resolvers` map that might have been assigned to the object instance. This is identical to calling `.resolvers = null`, and only exists here as a semantic method that may have future functionality added to it.

#### <a name="clear-schema"></a>clearResolvers [✯](#contents)
```js
clearSchema()
```
Removes any existing `.schema` GraphQLSchema instance that might have been assigned to the object instance. This is identical to calling `.schema = null`, and only exists here as a semantic method that may have future functionality added to it.

#### <a name="for-each-of"></a>forEachOf [✯](#contents)
```js
forEachOf(
  fn: ForEachOfResolver,
  context: mixed,
  types: number = Schemata.TYPES,
  suppliedSchema: ?GraphQLSchema = null
): GraphQLSchema
```
Iterates over the type map of either the internal schema or one created from the SDL string this instance represents and then stored for later use. See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature. `types` is a bitmask made up of at least one of the constant properties on Schemata such as `Schemata.ALL` or `Schemata.TYPES` and optionally augmented with `Schemata.HIDDEN`

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-type"></a>forEachType [✯](#contents)
```js
forEachType(
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
): GraphQLSchema
```

Iterates over all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-input-object-type"></a>forEachInputObjectType [✯](#contents)
```js
forEachInputObjectType(
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
): GraphQLSchema
```

Iterates over all input types on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-union"></a>forEachUnion [✯](#contents)
```js
forEachUnion (
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
)
```

Iterates over all the unions on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-enum"></a>forEachEnum [✯](#contents)
```js
forEachEnum (
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
)
```

Iterates over all enums on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-interface"></a>forEachInterface [✯](#contents)
```js
forEachInterface (
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
)
```

Iterates over all interfaces on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-scalar"></a>forEachScalar [✯](#contents)
```js
forEachScalar (
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
)
```

Iterates over all scalars on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-root-type"></a>forEachRootType [✯](#contents)
```js
forEachRootType (
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
)
```

Iterates over the three root types (Query, Mutation and Subscription) on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature*

#### <a name="for-each-field"></a>forEachField [✯](#contents)
```js
forEachField (
  fn: ForEachFieldResolver,
  context: mixed,
  types: number = ALL,
  suppliedSchema: ?GraphQLSchema = null
)
```

Iterates over all fields on all types on either the internal schema or one created from the Schemata string this instance represents and then stored for later use. See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature. `types` is a bitmask made up of at least one of the constant properties on Schemata such as `Schemata.ALL` or `Schemata.TYPES` and optionally augmented with `Schemata.HIDDEN`

*See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature*

#### <a name="for-each-type-field"></a>forEachTypeField [✯](#contents)
```js
forEachTypeField (
  fn: ForEachFieldResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema = null
)
```

Iterates over all type fields on all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use.

*See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature*

#### <a name="for-each-interface-field"></a>forEachInterfaceField [✯](#contents)
```js
forEachInterfaceField (
  fn: ForEachFieldResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema = null
)
```

Iterates over all interface fields on all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use

*See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature*

#### <a name="for-each-input-object-field"></a>forEachInputObjectField [✯](#contents)
```js
forEachInputObjectField (
  fn: ForEachFieldResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema = null
)
```

Iterates over all input object fields on all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use.

*See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature*

#### <a name="merge-sdl"></a>mergeSDL [✯](#contents)
```js
mergeSDL(
  schemaLanguage: string | Schemata | Source | GraphQLSchema,
  conflictResolvers: ?ConflictResolvers = DefaultConflictResolvers
): Schemata
```

Given a string of Schema Definition Language (or SDL) or a Schemata instance itself or any of the other initialization sources, the function will proceed to blend the derived SDL with the one of the instance. In the case of conflicts, either the default resolver, which simply takes the newer right hand value, or a function of your own devising will be called to decide. See the [`ConflictResolvers`](#type-conflict-resolvers) type for more info

#### <a name="pare-sdl"></a>pareSDL [✯](#contents)
```js
pareSDL(
  schemaLanguage: string | Schemata | Source | GraphQLSchema,
  resolverMap: ?Object = null
): Schemata
```

Given a string of Schema Definition Language (or SDL) or a Schemata instance itself or any of the other initialization sources, the function will proceed to remove the items using the derived SDL as a guide. If the internal instance has resolvers set or one can be built from the Schema stored on the instance, or if a set is supplied as the second parameter, the resolvers will also be pared down for any removed types and fields. Types stripped of all fields will themselves be removed.

#### <a name="merge-sdl"></a>mergeSchema [✯](#contents)
```js
mergeSchema(
  schema: GraphQLSchema,
  conflictResolvers: ?ConflictResolvers = DefaultConflictResolvers
): Schemata
```

This process stores the resolvers of the internal schema as well as those of the supplied schema. The supplied schema is then converted to Schemata and the mergeSDL() function is applied. Post merge, the previously stored and merged resolvers map are are applied and a new executable schema is built from the ashes of the old. See the [`ConflictResolvers`](#type-conflict-resolvers) type for more info

#### <a name="run"></a>run [✯](#contents)
```js
run (
  query: string | Source,
  contextValue?: mixed,
  variableValues?: ?ObjMap<mixed>,
  rootValue?: mixed,
  operationName?: ?string,
  fieldResolver?: ?GraphQLFieldResolver<any,any>
)
```

A convenient pass-thru to `graphqlSync()` to query the schema in a synchronous manner. The schema used is built from the contents of the Schemata string itself. If there is a `.resolvers` map set on the instance, it will be passed for the root object/value parameter.

#### <a name="run-async"></a>runAsync [✯](#contents)
```js
async runAsync(
  query: string | Source,
  contextValue?: mixed,
  variableValues?: ?ObjMap<mixed>,
  rootValue?: mixed,
  operationName?: ?string,
  fieldResolver?: ?GraphQLFieldResolver<any,any>
)
```
A convenient pass-thru to `graphql()` to query the schema in an asynchronous manner. The schema used is built from the contents of the Schemata string itself. If there is a `.resolvers` map set on the instance, it will be passed for the root object/value parameter.

## <a name="static-properties"></a>Static properties [✯](#contents)

#### <a name="const-gql"></a>`.gql` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) a reference to the results of `require('graphql')`

#### <a name="const-all"></a>`.ALL` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all `GraphQLType`s should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-types"></a>`.TYPES` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all types should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-interfaces"></a>`.INTERFACES` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all interfaces should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-enums"></a>`.ENUMS` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all enums should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-unions"></a>`.UNIONS` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all unions should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-scalars"></a>`.SCALARS` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all scalars should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-root-types"></a>`.ROOT_TYPES` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all root types (Query, Mutation, Subscription) should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-input-types"></a>`.INPUT_TYPES` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()` methods to denote that all input object types should be iterated over. Can be combined with bit-wise OR'ing.

#### <a name="const-hidden"></a>`.HIDDEN` [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) used with `forEachOf/forEachField()`. When iterating the internal meta types that start with underscores are not iterated over. By combining this flag via bit-wise OR'ing, the internal meta types will be included

## <a name="static-methods"></a>Static methods [✯](#contents)

#### <a name="fn-buildSchema"></a>buildSchema [✯](#contents)
```js
static buildSchema(
  sdl: string | Source | Schemata | GraphQLSchema,
  showError: boolean = false,
  schemaOpts: BuildSchemaOptions & ParseOptions = undefined
): ?GraphQLSchema
```
Using the Facebook reference implementation's call to `buildSchema()` is made. If an error is thrown and `showError` is not true, the exception will be swallowed and null will be returned instead.
schemaOpts is the optional second parameter taken by `require('graphql').buildSchema()`

#### <a name="fn-parse"></a>parse [✯](#contents)
```js
static parse(
  sdl: string | Schemata | Source | GraphQLSchema,
  showError: boolean = false
): ?ASTNode
```
Using the Facebook reference implementation's call to `parse()` is made. The resulting `AstNode` objects will be returned. If the `sdl` is not valid, an error will be thrown if showError is truthy

#### <a name="fn-from"></a>from [✯](#contents)
```js
static from(
  typeDefs: string | Source | Schemata | GraphQLSchema,
  resolvers: ?Object
): Schemata
```
An alterate way of creating a new instance of `Schemata`. Effectively equivalent to `new Schemata(...)`

## <a name="exported-types"></a>Exported Types [✯](#contents)

#### <a name="type-conflict-resolvers"></a>ConflictResolvers [✯](#contents)
```js
export type ConflictResolvers = {
  /** A handler for resolving fields in matching types */
  fieldMergeResolver?: FieldMergeResolver,

  /** A handler for resolving directives in matching types */
  directiveMergeResolver?: DirectiveMergeResolver,

  /** A handler for resolving conflicting enum values */
  enumValueMergeResolver?: EnumMergeResolver,

  /** A handler for resolving type values in unions */
  typeValueMergeResolver?: UnionMergeResolver,

  /** A handler for resolving scalar config conflicts in custom scalars */
  scalarMergeResolver?: ScalarMergeResolver
}
```
The `ConflictResolvers` is simply an object that defines one or more of the handler functions mentioned above. FieldMergeResolvers are the most common types, however the others can be useful in schema and Schemata merging as well. If no resolvers are supplied, the default ones are used. These simply overrite the lefthand (instance) value with the righthand (supplied) value

#### <a name="type-directive-merge-resolver"></a>DirectiveMergeResolver [✯](#contents)
```js
export type DirectiveMergeResolver = (
  leftType: ASTNode,
  leftDirective: DirectiveNode,
  rightType: ASTNode,
  rightDirective: DirectiveNode
) => DirectiveNode
```
The `DirectiveMergeResolver` is a function that takes both left and right types as well as left and right directives. The function decides which directive to return and does so.

#### <a name="type-enum-merge-resolver"></a>EnumMergeResolver [✯](#contents)
```js
export type EnumMergeResolver = (
  leftType: ASTNode,
  leftValue: EnumValueNode,
  rightType: ASTNode,
  rightValue: EnumValueNode
) => EnumValueNode
```
The `EnumMergeResolver` is a function that takes both left and right types as well as left and right enum values. The function decides which enum value to return and does so.

#### <a name="type-field-merge-resolver"></a>FieldMergeResolver [✯](#contents)
```js
export type FieldMergeResolver = (
  leftType: ASTNode,
  leftField: FieldNode,
  rightType: ASTNode,
  rightField: FieldNode
) => FieldNode
```
The `FieldMergeResolver` is a function that takes both left and right types as well as left and right field values. The function decides which field value to return and does so.

#### <a name="type-for-each-field-resolver"></a>ForEachFieldResolver [✯](#contents)
```js
export type ForEachFieldResolver = (
  type: mixed,
  typeName: string,
  typeDirectives: Array<GraphQLDirective>,
  field: mixed,
  fieldName: string,
  fieldArgs: Array<GraphQLArgument>,
  fieldDirectives: Array<GraphQLDirective>,
  schema: GraphQLSchema,
  context: mixed
) => void
```
The [`ForEachFieldResolver`](#type-for-each-field-resolver) function definition is about a function that takes a callback that receives the type object, the type object name, an array of directives if any, the field object, the field object name, any field arguments, any field directives, the schema and any supplied context to use in the iteration and looping over the types defined in the Schematas schema representation. If an internal store of a schema is not availabe, one is created

#### <a name="type-for-each-of-resolver"></a>ForEachOfResolver [✯](#contents)
```js
export type ForEachOfResolver = (
  type: mixed,
  typeName: string,
  typeDirectives: Array<GraphQLDirective>,
  schema: GraphQLSchema,
  context: mixed
) => void
```
The [`ForEachOfResolver`](#type-for-each-of-resolver) function definition is about a function that takes a callback that receives the type object, the type object name, an array of directives if any, the schema and any supplied context to use in the iteration and looping over the types defined in the Schematas schema representation. If an internal store of a schema is not availabe, one is created

#### <a name="type-union-merge-resolver"></a>UnionMergeResolver [✯](#contents)
```js
export type UnionMergeResolver = (
  leftType: ASTNode,
  leftUnion: NamedTypeNode,
  rightType: ASTNode,
  rightUnion: NamedTypeNode
) => NamedTypeNode
```
The `UnionMergeResolver` is a function that takes both left and right types as well as left and right union types. The function decides which union type to return and does so.

#### <a name="type-scalar-merge-resolver"></a>ScalarMergeResolver [✯](#contents)
```js
export type ScalarMergeResolver = (
  leftScalar: ScalarTypeDefinitionNode,
  leftConfig: GraphQLScalarTypeConfig,
  rightScalar: ScalarTypeDefinitionNode,
  rightConfig: GraphQLScalarTypeConfig
) => GraphQLScalarTypeConfig
```
The `ScalarMergeResolver` is a function that takes both left and right scalars that are colliding and their custom resolver configs *if available*. Scalars definitions are a not always available, but if they are they will be provided. Therefore the default resolver for custom scalars will take whichever `GraphQLScalarTypeConfig` object is availabe starting with right, moving to left and then null.
