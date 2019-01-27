# ne-schemata [![Build Status](https://travis-ci.org/nyteshade/ne-schemata.svg?branch=master)](https://travis-ci.org/nyteshade/ne-schemata) [![Greenkeeper badge](https://badges.greenkeeper.io/nyteshade/ne-schemata.svg)](https://greenkeeper.io/) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) ![package version](https://img.shields.io/badge/dynamic/json.svg?label=version&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fnyteshade%2Fne-schemata%2Fmaster%2Fpackage.json&query=version&colorB=1d7ebe)

![Logo](https://github.com/nyteshade/ne-schemata/raw/master/assets/graphql-logo.png)

GraphQL IDL/Schemata String class to make working with GraphQL easier

## Overview

Working with Schemata (Schema Definition Language), sometimes called IDL (Interface Definition Language) can occasionally be difficult. A schema definition is the most concise way to specify a schema in GraphQL.

Classes in programming languages are data structures that associated properties and functions designed to work with them. The provided `Schemata` class extends String and should be able to be used in most places in JavaScript where strings are used with no changes. This, however, is where things change.

Some of the most often applied tasks with SDL are building a schema object, building an executable schema object, parsing it into [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) objects. Occasionally a given bit of SDL is checked for validity.

The Schemata class does all this and more.

## Features

Biggest selling points of working with the Schemata class

* [x] Creation of bound or non-bound [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48) and [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) object
* [x] Storage of an associated `resolvers` map
* [x] Storage of an associated `schema` object for iteration and modification
* [x] Checking of the validity of SDL as a [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) as well as a [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48)
* [x] Merge SDL together via AST parsing
* [x] Merge multple GraphQLSchemas via AST parsing
* [x] Pare down one SDL/Schema using another as a guide

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
let schemata = new Schemata(
  'type Person { name: String } type Query { peep: Person }'
)
```

### Using `Schemata.from`

Creating instances of Schemata can also be done with a constant on the class itself called `.from()`.

```js
let schemata = Schemata.from(
  'type Person { name: String } type Query { peep: Person }'
)
```

### From an existing instance of Schemata

Creating instances of Schemata from other instances of Schemata is also supported. In these cases, all the set values of note will be moved over. This includes schema and resolvers set on the original instance.

```js
let sdlA = Schemata.from(
  'type Person { name: String } type Query { peep: Person }',
  {
    Query: {
      peep() {
        return { name: 'Brielle' }
      },
    },
  }
)
let sdlB = Schemata.from(sdlA)

console.log(sdlB.resolvers) // { Query: { peep: [function peep()] } }
```

### From an instance of GraphQLSchema

You can also create a Schemata instance from an existing instance of GraphQLSchema. The typeDefs or SDL string will be generated using `printSchema()` from the base graphql module. The `.schema` value will be set explicitly to the value supplied in the case it is executable or has had other modifications performed on it.

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

* [x] **astNode** an [`ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88) object representing the parsed contents of the file
* [x] **resolvers** _if_ there is an adjacent .js file of the same name, _and if_ that file exports `'resolvers'` _or if_ the exported results are an object and not a function, then that object is considered to be a resolvers map for the associated `.graphql` file.
* [x] **schema** generated from the contents of the Schemata string. If the resolvers object was successfully generated and imported, this will be an executableSchema instead.
* [x] **sdl** the Schemata string instance, also the **default** export
* [x] **typeDefs** keeping in line and adding compatibility with Apollo Server, the `typeDefs` export is simply a synonym for `sdl`.

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
const sdlA = gql`
  type Person {
    name: String
  }

  type Query {
    peep: Person
  }
`
const sdlB = gql`
  type Person {
    age: Int
  }

  type Query {
    peeps: [Person]
  }
`
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

app.use(
  '/graphql',
  graphqlHTTP({
    schema: sdlC.schema,
    graphiql: true,
  })
)

app.listen(4000)
```

#### Merging Concerns

_TLDR; Schemata has your back and you don't really need to read this_

Still here? Cool, let's learn what happens during merging. When merging multiple schemas, one of the problems that can occur, especially if one of the schemas being merged is a remote executable schema, is that the resolvers might be bound to an older version of a schema that is only a subset of the new merge.

Schemata helps to alleviate this problem by introducing a few interfaces of note. The immediate solution to this problem is to wrap the resolvers and have those resolvers point to a newly merged GraphQLSchema object rather than the one it was originally bound to.

The problem comes in when you try to merge more than once. Wrapping a previously wrapped version of a resolver will allow you to set it at the top, but the previous attempt to do will execute and override the changes you just made.

Schemata solves this problem by storing the older unbound methods with each bind. A reference to the schema, sdl and resolvers at the time of the merge are kept. When each subsequent merge occurs, these older unwrapped/unbound resolvers are used to apply the new schema rather than layering things like Russian nesting dolls.

Furthermore, when making a call to `.mergeSchema()` you may add your own resolver injectors which are simply objects containing a property called `'.resolverInjectors'` which are an array of `ResolverArgsTransformer` functions. These give you full acceess to the `source`, `args`, `context` and `info` parameters to modify to your hearts content before the original unwrapped resolver receives those parameters.

```js
import { Schemata } from 'ne-schemata'

let a = Schemata.from('type Query { me: String }', {
  me(s, a, c, i) {
    return 'Brielle'
  },
})

let b = Schemata.from('type Query { her: String }', {
  her(s, a, c, i) {
    return 'Stacy'
  },
})

let ab = a.mergeSchema(b)

console.log(ab.prevMergeResolvers)
// [{schema:..., sdl:..., resolvers:...}, ...] <-- unwrapped
console.log(ab.resolvers)
// { me(), her() }     <-- wrapped to new schema

let c = Schemata.from('type Polygon { sides: Int }', {
  Polygon: {
    sides(s, a, c, i) {
      return 6
    },
  },
})

let abc = ab.mergeSchema(c)
console.log(abc.prevMergeResolvers)
// [{schema:..., sdl:..., resolvers:...}, ...] <-- unwrapped
console.log(abc.resolvers)
// { me(), her(), Polygon: { sides() } } <-- wrapped to new schema
```

Even this example has difficulty explaining properly what is happening and why it's important, but as each merge happens the previous unwrapped resolvers are passed along and newly introduced schemas' resolvers are added to this list.

### <a name="contents"></a>Schemata Class Properties and Methods

* [Constructor](#instance-constructor)
* [Instance properties](#instance-properties)
  * [.ast](#inst-ast): [`?ASTNode`](https://github.com/graphql/graphql-js/blob/master/src/language/ast.js#L88)
  * [.executableSchema](#inst-executable-schema): [`?GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48)
  * [.graphiql](#inst-graphiql): `boolean`
  * [.schemaDirectives](#inst-schema-directives): `Object`
  * [.hasAnExecutableSchema](#inst-has-an-executable-schema): `boolean`
  * [.hasFlattenedResolvers](#inst-has-flattened-resolvers): `boolean`
  * [.prevResolverMaps](#inst-prev-resolver-maps): `Array<ExtendedResolverMap>`
  * [.resolvers](#inst-resolvers): `?ResolverMap`
  * [.rootValue](#inst-root-value): `?ResolverMap`
  * [.schema](#inst-schema): [`?GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48)
  * [.schemaDirectives](#inst-schema-directives): `Object`
  * [.sdl](#inst-sdl): `string`
  * [.types](#inst-types): `Object`
  * [.typeDefs](#inst-type-defs): `string`
  * [.valid](#inst-valid): `boolean`
  * [.validSchema](#inst-valid-schema): `boolean`
  * [.validSDL](#inst-valid-sdl): `boolean`
* [Instance methods](#instance-methods)
  * [astFieldByName](#ast-field-by-name)
  * [astTypeByName](#ast-type-by-name)
  * [buildResolverForEachField](#build-resolver-for-each-field)
  * [buildResolvers](#build-resolvers)
  * [clearResolvers](#clear-resolvers)
  * [clearSchema](#clear-schema)
  * [forEachEnum](#for-each-enum)
  * [forEachField](#for-each-field)
  * [forEachInputObjectField](#for-each-input-object-field)
  * [forEachInputObjectType](#for-each-input-object-type)
  * [forEachInterface](#for-each-interface)
  * [forEachInterfaceField](#for-each-interface-field)
  * [forEachOf](#for-each-of)
  * [forEachRootType](#for-each-root-type)
  * [forEachScalar](#for-each-scalar)
  * [forEachType](#for-each-type)
  * [forEachTypeField](#for-each-type-field)
  * [forEachUnion](#for-each-union)
  * [merge](#merge)
  * [mergeSchema](#merge-schema)
  * [mergeSDL](#merge-sdl)
  * [pareSDL](#pare-sdl)
  * [run](#run)
  * [runAsync](#run-async)
  * [schemaFieldByName](#schema-field-by-name)
  * [schemaResolverFor](#schema-resolver-for)
* [Static properties](#static-properties)
  * [.ALL](#const-all):`Number`
  * [.ENUMS](#const-enums):`Number`
  * [.gql](#const-gql):`Module`
  * [.HIDDEN](#const-hidden):`Number`
  * [.INPUT_TYPES](#const-input-types):`Number`
  * [.INTERFACES](#const-interfaces):`Number`
  * [.ROOT_TYPES](#const-root-types):`Number`
  * [.SCALARS](#const-scalars):`Number`
  * [.TYPES](#const-types):`Number`
  * [.UNIONS](#const-unions):`Number`
* [Symbols](#symbols)
  * [.species](#symbol-species)
  * [.iterator](#symbol-iterator)
  * [.toStringTag](#symbol-to-string-tag)
* [Static methods](#static-methods)
  * [buildSchema()](#fn-buildSchema)
  * [from()](#fn-from)
  * [parse()](#fn-parse)
  * [print()](#fn-print)
* [Exported types](#exported-types)
  * [AsyncEntryInspector](#type-async-entry-inspector)
  * [ConflictResolvers](#type-conflict-resolvers)
  * [DirectiveMergeResolver](#type-directive-merge-resolver)
  * [EntryInspector](#type-entry-inspector)
  * [EnumMergeResolver](#type-enum-merge-resolver)
  * [FieldMergeResolver](#type-field-merge-resolver)
  * [ForEachFieldResolver](#type-for-each-field-resolver)
  * [ForEachOfResolver](#type-for-each-of-resolver)
  * [MergeOptionsConfig](#type-merge-options-config)
  * [ResolverArgs](#type-resolver-args)
  * [ResolverArgsTransformer](#type-resolver-args-transformer)
  * [ResolverMap](#type-resolver-map)
  * [ResolverResultsPatcher](#type-resolver-results-patcher)
  * [ScalarMergeResolver](#type-scalar-merge-resolver)
  * [SchemaSource](#type-schema-source)
  * [UnionMergeResolver](#type-union-enum-merge-resolver)
* [External Functions](#external-functions)
  * [isRootType](#etype-is-root-type)
  * [normalizeSource](#etype-normalize-source)
  * [runInjectors](#etype-run-injectors)
  * [SchemaInjectorConfig](#etype-schema-injector-config)
  * [stripResolversFromSchema](#etype-strip-resolvers-from-schema)
* [Default Functions](#default-function-handlers)
  * [DefaultAsyncEntryInspector](#dtype-default-async-entry-inspector)
  * [DefaultDirectiveMergeResolver](#dtype-default-directive-merge-resolver)
  * [DefaultEntryInspector](#dtype-default-entry-inspector)
  * [DefaultEnumMergeResolver](#dtype-default-enum-merge-resolver)
  * [DefaultFieldMergeResolver](#dtype-default-field-merge-resolver)
  * [DefaultScalarMergeResolver](#dtype-default-scalar-merge-resolver)
  * [DefaultUnionMergeResolver](#dtype-default-union-merge-resolver)
* [Additional Goodies](#goodies)
  * [asyncWalkResolverMap](#goodie-fn-async-walk-resolver-map)
  * [at](#goodie-fn-at)
  * [atNicely](#goodie-fn-at-nicely)
  * [gql](#goodie-gql-tag-fn)
  * [register](#goodie-fn-extension-register)
  * [walkResolverMap](#goodie-fn-walk-resolver-map)

## <a name="instance-constructor"></a>Constructor [✯](#contents)

```js
constructor(
  typeDefs: SchemaSource,
  resolvers: ResolverMap = null,
  buildResolvers: boolean | string = false,
  flattenResolvers: boolean = false
): Schemata
```

Schemata instances are versatile and can be created through a variety of sources. Typically anything that can be converted to a string of SDL can be used to create a new Schemata instance. Everything from a GraphQL `Source` instance, previously instantiated `Schemata` instance, a `GraphQLSchema` object or even an `ASTNode`. Of course, basic strings of SDL can also be used.

An object with resolver functions can be supplied as the second parameter allowing executable schemas to be generated from the source SDL.

The final two parameters are for the case where the Schemata instance is initialized with a GraphQLSchema instance or with an older instance of Schemata.

* The first causes a programmatic attempt to generate and set an object containing resolvers from the executable schema represented by either eligible object. If the string 'all' is supplied than a resolver for each field not defined will receive GraphQL's `defaultFieldResolver` as its resolver.
* The second causes the generated resolver map to be in the flattened style with root fields exposed at the root of the resolver map. By default the Apollo style resolver map with fields under their respective type names is the default

## <a name="instance-properties"></a>Instance properties [✯](#contents)

#### <a name="inst-ast"></a>.ast [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) generates ASTNodes that the internal string would generate when passed to `require('graphql').parse()`

#### <a name="inst-schema"></a>.schema [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves any internally stored [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48) instance generated thus far; if one does not exist, one will be generated
![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) sets the value of the internal [`GraphQLSchema`](https://github.com/graphql/graphql-js/blob/master/src/type/schema.js#L48) storage variable

#### <a name="inst-executable-schema"></a>.executableSchema [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves the internally stored executable schema, if one exists, or it creates one if the `.resolvers` value has been set and if there is valid `.sdl`. This getter is now deprecated. All functionality has been integrated in the single `.schema` property without any loss of functionality. Please use that instead.

#### <a name="inst-graphiql"></a>.graphiql [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves the `.graphiql` flag which defaults to true. This might be used by express-graphql. Schemata **does not** use this flag internally, but rather stores it as a convenience property.<br/>
![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) sets the internal graphiql flag to a value other than true. Remember that this field is not used internally by Schemata other than storage and retrieval.

#### <a name="inst-has-an-executable-schema"></a>.hasAnExecutableSchema [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) A getter to determine if an executable schema is attached to this Schemata instance. It does so by walking the schema fields via `buildResolvers()` and reporting whether there is anything inside the results or not.

#### <a name="inst-has-flattened-resolvers"></a>.hasFlattenedResolvers [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) Determines if the internal resolver map has at least one defined root type resolver (Query, Mutation, Subscription) or not. If not, including if there are no root resolvers (yet), this property will evaluate to false

#### <a name="inst-prev-resolver-maps"></a>.prevResolverMaps [✯](#contents)

When a Schemata instance is merged with another GraphQLSchema, its resolvers get stored before they are wrapped in a function that updates the schema object it receives. This allows them to be wrapped safely at a later date should this instance be merged with another.

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves any internally stored resolver maps
![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) sets the internally stored resolver maps

#### <a name="inst-schema-directives"></a>.schemaDirectives [✯](#contents)

Schemata is designed to be used with various GraphQL JavaScript engines. In
many cases, it is simply used as a variable to store configuration for more
specific calls to things like `makeExecutableSchema` from `graphql-tools` or
`GraphQLServer` and the like. For more information on Apollo's usage of
this property, see this page:
https://www.apollographql.com/docs/graphql-tools/schema-directives.html

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) An object containing the name to function mapping for schema directive classes when used with apollo-server or graphql-yoga.

![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) Internally sets the instance variable for the schemaDirectives object used with apollo-server or graphql-yoga


#### <a name="inst-sdl"></a>.sdl [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) the same value as the string this instance represents

#### <a name="inst-type"></a>.types [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) calculates a JavaScript object based on the schema where type names are sub-objects, and their keys are field names with values containing objects with two keys. Those keys are `type` and `args`. The `type` field will evaluate to the SDL type of the field in question and the `args` field will evaluate to an order specific set of objects with an argument `name` key and SDL argument type value.

For clarity, given a schema such as the following:
```graphql
type A {
a: String
b: [String]
c: [String]!
}
type Query {
As(name: String): [A]
}
```

One can expect a return type like this:
```js
{
  Query: {
    As: { type: '[A]', args: [ { name: 'String' } ] }
  },
  A: {
    a: { type: 'String', args: [] },
    b: { type: '[String]', args: [] },
    c: { type: '[String]!', args: [] }
  }
}
```

#### <a name="inst-type-defs"></a>.typeDefs [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) a synonym for `.schemata`, ideal for use with Apollo and other librariees that expect this nomenclature

#### <a name="inst-root-value"></a>.rootValue [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) a synonym for `.resolvers`, ideal for use with express-graphql or other libraries that expect this nomenclature. _Note: that the format of this object is slightly different for Apollo than the Facebook reference implementation_

#### <a name="inst-resolvers"></a>.resolvers [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) retrieves any internally store resolvers map
![setter](https://github.com/nyteshade/ne-schemata/raw/master/assets/set-right-arrow-24.png) sets the internally stored resolvers map

#### <a name="inst-valid-sdl"></a>.validSDL [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) if the SDL this string represents can be parsed without error, true will be returned; false otherwise

#### <a name="inst-valid-schema"></a>.validSchema [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) if the SDL this string represents can be used to build a schema without error, true will be returned; false otherwise

#### <a name="inst-valid"></a>.valid [✯](#contents)

![getter](https://github.com/nyteshade/ne-schemata/raw/master/assets/get-left-arrow-24.png) returns true if both `.validSDL` and `.validSchema` are both true

## <a name="instance-methods"></a>Instance methods [✯](#contents)

#### <a name="ast-field-by-name"></a>astFieldByName [✯](#contents)

```js
astFieldByName(type: string, field: string): FieldNode
```

For SDL that doesn't properly build into a GraphQLSchema, it can still be searched for a type and field.

#### <a name="ast-type-by-name"></a>astTypeByName [✯](#contents)

```js
astTypeByName(type: string): ASTNode
```

For SDL that doesn't properly build into a GraphQLSchema, it can still be parsed and searched for a type by name.

#### <a name="build-resolvers"></a>buildResolvers [✯](#contents)

```js
buildResolvers(
  flattenRootResolversOrFirstParam: boolean | ResolverMap,
  ...extendWith: Array<ResolverMap>
): ResolverMap
```

In the case where Schemata instance was created with a GraphQLSchema, especially one that is an executableSchema or somehow has resolvers in it already, `buildResolvers()` will walk the schema fields and build up a resolvers object of those `resolve()` functions on each field. If true is supplied as the first parameter, the resolver functions from Query, Mutation and Subscription will appear in the root of the returned object rather than under their aforementioned parent types.

#### <a name="build-resolver-for-each-field"></a>buildResolverForEachField [✯](#contents)

```js
buildResolverForEachField(
  flattenRootResolversOrFirstParam: boolean | ResolverMap,
  ...extendWith: Array<ResolverMap>
): ResolverMap
```

From time to time it makes more sense to wrap every possible resolver mapping in given schema. Getting a handle to each fields resolver and or substituting missing ones with GraphQL's defaultFieldResolver can be a tiresome affair. This method walks the schema for you and returns any previously defined resolvers alongside defaultFieldResolvers for each possible field of every type in the schema.

_If a schema cannot be generated from the SDL represented by the instance of Schemata, then an error is thrown._

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

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-type"></a>forEachType [✯](#contents)

```js
forEachType(
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
): GraphQLSchema
```

Iterates over all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-input-object-type"></a>forEachInputObjectType [✯](#contents)

```js
forEachInputObjectType(
  fn: ForEachOfResolver,
  context: mixed,
  suppliedSchema: ?GraphQLSchema
): GraphQLSchema
```

Iterates over all input types on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-union"></a>forEachUnion [✯](#contents)

```js
forEachUnion(
  (fn: ForEachOfResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema)
)
```

Iterates over all the unions on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-enum"></a>forEachEnum [✯](#contents)

```js
forEachEnum(
  (fn: ForEachOfResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema)
)
```

Iterates over all enums on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-interface"></a>forEachInterface [✯](#contents)

```js
forEachInterface(
  (fn: ForEachOfResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema)
)
```

Iterates over all interfaces on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-scalar"></a>forEachScalar [✯](#contents)

```js
forEachScalar(
  (fn: ForEachOfResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema)
)
```

Iterates over all scalars on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-root-type"></a>forEachRootType [✯](#contents)

```js
forEachRootType(
  (fn: ForEachOfResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema)
)
```

Iterates over the three root types (Query, Mutation and Subscription) on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachOfResolver`](#type-for-each-of-resolver) callback signature_

#### <a name="for-each-field"></a>forEachField [✯](#contents)

```js
forEachField(
  (fn: ForEachFieldResolver),
  (context: mixed),
  (types: number = ALL),
  (suppliedSchema: ?GraphQLSchema = null)
)
```

Iterates over all fields on all types on either the internal schema or one created from the Schemata string this instance represents and then stored for later use. See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature. `types` is a bitmask made up of at least one of the constant properties on Schemata such as `Schemata.ALL` or `Schemata.TYPES` and optionally augmented with `Schemata.HIDDEN`

_See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature_

#### <a name="for-each-type-field"></a>forEachTypeField [✯](#contents)

```js
forEachTypeField(
  (fn: ForEachFieldResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema = null)
)
```

Iterates over all type fields on all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use.

_See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature_

#### <a name="for-each-interface-field"></a>forEachInterfaceField [✯](#contents)

```js
forEachInterfaceField(
  (fn: ForEachFieldResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema = null)
)
```

Iterates over all interface fields on all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use

_See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature_

#### <a name="for-each-input-object-field"></a>forEachInputObjectField [✯](#contents)

```js
forEachInputObjectField(
  (fn: ForEachFieldResolver),
  (context: mixed),
  (suppliedSchema: ?GraphQLSchema = null)
)
```

Iterates over all input object fields on all types on either the internal schema or one created from the SDL string this instance represents and then stored for later use.

_See above for the definition of the [`ForEachFieldResolver`](#type-for-each-field-resolver) callback signature_

#### <a name="merge"></a>merge [✯](#contents)

```js
merge(
  schema: SchemaSource,
  config?: MergeOptionsConfig = DefaultMergeOptions
): Schemata
```

A new Schemata object instance with merged schema definitions as its contents as well as merged resolvers and newly bound executable schema are all created in this step and passed back. The object instance itself is not modified

Post merge, the previously stored and merged resolvers map are are applied and a new executable schema is built from the ashes of the old.

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
  resolverMap: ?ResolverMap = null
): Schemata
```

Given a string of Schema Definition Language (or SDL) or a Schemata instance itself or any of the other initialization sources, the function will proceed to remove the items using the derived SDL as a guide. If the internal instance has resolvers set or one can be built from the Schema stored on the instance, or if a set is supplied as the second parameter, the resolvers will also be pared down for any removed types and fields. Types stripped of all fields will themselves be removed.

#### <a name="merge-schema"></a>mergeSchema [✯](#contents)

```js
mergeSchema(
  schema: GraphQLSchema | Schemata,
  config?: MergeOptionsConfig = DefaultMergeOptions
): Schemata
```

Shortcut for the `merge()` function; mergeSDL still exists as an entity of itself, but `merge()` will invoke that function as needed to do its job and if there aren't any resolvers to consider, the functions act identically.

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

#### <a name="schema-field-by-name"></a>schemaFieldByName [✯](#contents)

```js
schemaFieldByName(type: string, field: string): FieldNode
```

Builds a schema based on the SDL in the instance and then parses it to fetch a named field in a named type. If either the type or field are missing or if the SDL cannot be built as a schema, null is returned.

#### <a name="schema-resolver-for"></a>schemaResolverFor [✯](#contents)

```js
schemaResolverFor(type: string, field: string): ?Function
```

A method to fetch a particular field resolver from the schema represented by this Schemata instance.

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

## <a name="symbols"></a>Symbols [✯](#contents)

#### <a name="symbol-iterator"></a>.iterator [✯](#contents)

```js
get [Symbol.iterator](): Function
```

Redefine the iterator for Schemata instances so that they simply iterate over the contents of the SDL/typeDefs.

#### <a name="symbol-species"></a>.species [✯](#contents)

```js
get [Symbol.species](): Function
```

Symbol.species ensures that any String methods used on this instance will result in a Schemata instance rather than a String. _NOTE: this does not work as expected in current versions of node. This bit of code here is basically a bit of future proofing for when Symbol.species starts working with String extended classes_

#### <a name="symbol-to-string-tag"></a>.toStringTag [✯](#contents)

```js
get [Symbol.toStringTag](): Function
```

Ensures that instances of Schemata report internally as `Schemata` object. Specifically using things like `Object.prototype.toString`.

## <a name="static-methods"></a>Static methods [✯](#contents)

#### <a name="fn-buildSchema"></a>buildSchema [✯](#contents)

```js
static buildSchema(
  sdl: string | Source | Schemata | GraphQLSchema,
  showError: boolean = false,
  schemaOpts: BuildSchemaOptions & ParseOptions = undefined
): ?GraphQLSchema
```

Using the Facebook reference implementation's call to `buildSchema()` is made. If an error is thrown and `showError` is not true, the exception will be swallowed and null will be returned instead. `schemaOpts` is the optional second parameter taken by `require('graphql').buildSchema()`

#### <a name="fn-parse"></a>parse [✯](#contents)

```js
static parse(
  sdl: string | Schemata | Source | GraphQLSchema,
  showError: boolean = false
): ?ASTNode
```

Using the Facebook reference implementation's call to `parse()` is made. The resulting `AstNode` objects will be returned. If the `sdl` is not valid, an error will be thrown if showError is truthy

#### <a name="fn-print"></a>print [✯](#contents)

```js
static print(
  ast: ASTNode,
  showError: boolean = false
): ?Schemata
```

A little wrapper used to catch any errors thrown when printing an ASTNode
to string form using `require('graphql').print()`. If `showError` is true
any thrown errors will be rethrown, otherwise null is returned instead.
Should all go as planned, an instance of Schemata wrapped with the printed
SDL will be returned.

_Since version 1.7_

#### <a name="fn-from"></a>from [✯](#contents)

```js
static from(
  typeDefs: string
    | Source
    | Schemata
    | GraphQLSchema
    | ASTNode,
  resolvers: ?ResolverMap = null,
  buildResolvers: boolean | string = false,
  flattenResolvers: boolean = false,
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
  scalarMergeResolver?: ScalarMergeResolver,
}
```

The `ConflictResolvers` is simply an object that defines one or more of the handler functions mentioned above. FieldMergeResolvers are the most common types, however the others can be useful in schema and Schemata merging as well. If no resolvers are supplied, the default ones are used. These simply overrite the lefthand (instance) value with the righthand (supplied) value

#### <a name="type-async-entry-inspector"></a>AsyncEntryInspector [✯](#contents)

```js
type AsyncEntryInspector = (
  key: string,
  value: Function,
  path: Array<string>,
  map: ResolverMap
) => ?Promise<{ [string]: Function }>
```

An `AsyncEntryInspector` is a function passed to `asyncWalkResolverMap` that is invoked for each encountered pair along the way as it traverses the `ResolverMap` in question. The default behavior is to simply return the supplied entry back.

If undefined is returned instead of an object with a string mapping to a Function, then that property will not be included in the final results of `asyncWalkResolverMap`.

#### <a name="type-entry-inspector"></a>EntryInspector [✯](#contents)

```js
type EntryInspector = (
  key: string,
  value: Function,
  path: Array<string>,
  map: ResolverMap
) => { [string]: Function }
```

An `EntryInspector` is a function passed to `walkResolverMap` that is invoked for each encountered pair along the way as it traverses the `ResolverMap` in question. The default behavior is to simply return the supplied entry back.

If undefined is returned instead of an object with a string mapping to a Function, then that property will not be included in the final results of `walkResolverMap`.

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

#### <a name="type-resolver-args"></a>ResolverArgs [✯](#contents)

```js
export type ResolverArgs = {
  source: mixed,
  args: mixed,
  context: mixed,
  info: GraphQLResolveInfo,
}
```

Resolver functions receive four arguments when they execute. This type represents and object with the same four argument types within. Used by `ResolverArgsTransformer` and, indirectly by, `MergeOptionsConfig` objects.

#### <a name="type-resolver-args-transformer"></a>ResolverArgsTransformer [✯](#contents)

```js
export type ResolverArgsTransformer = (args: ResolverArgs) => ResolverArgs
```

A function that takes a [`ResolverArgs`](#type-resolver-args) object and returns a [`ResolverArgs`](#type-resolver-args)

#### <a name="type-resolver-map"></a>ResolverMap [✯](#contents)

```js
export type ResolverMap = { [string]: Function | ResolverMap }
```

A resolver map is either a flat string/Function mapping or nested version of itself. Each string key should either point to a object map of string/Function pairs or Function.

#### <a name="type-schema-source"></a>SchemaSource [✯](#contents)

```js
type SchemaSource = string | Source | Schemata | GraphQLSchema | ASTNodes
```

A flow type that represents the various types of inputs that can often be used to construct an instance of `Schemata`.

#### <a name="type-merge-options-config"></a>MergeOptionsConfig [✯](#contents)

```js
export type MergeOptionsConfig = {
  resolverInjectors: ResolverArgsTransformer | Array<ResolverArgsTransformer>,
}
```

A `MergeOptionsConfig` is a way to configure the arguments that are bound to each resolver during a call to [`mergeSchema`](#merge-schema). The functions set as `resolverInjectors` can be either a single function or an array of functions.

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

The `ScalarMergeResolver` is a function that takes both left and right scalars that are colliding and their custom resolver configs _if available_. Scalars definitions are a not always available, but if they are they will be provided. Therefore the default resolver for custom scalars will take whichever `GraphQLScalarTypeConfig` object is availabe starting with right, moving to left and then null.

## <a name="external-functions"></a>External Functions [✯](#contents)

#### <a name="etype-is-root-type"></a>isRootType() [✯](#contents)

```js
const isRootType = t => boolean
```

Given a AST type node from parsed SDL, return true if the type represents a root type; i.e. Query, Mutation or Subscription

#### <a name="etype-normalize-source"></a>normalizeSource() [✯](#contents)

```js
export function normalizeSource(
  typeDefs: string | Source | Schemata | GraphQLSchema | ASTNode,
  wrap: boolean = false
): (string | Schemata)
```

A function that takes the various types of input that `Schemata` takes as a constructor and converts the results into either a `string` or `Schemata` instance if `wrap` is set to true.

#### <a name="etype-run-injectors"></a>runInjectors() [✯](#contents)

```js
export function runInjectors(
  config: MergeOptionsConfig,
  resolverArgs: ResolverArgs
): ResolverArgs
```

Given an initial set of arguments passed to a resolver function and a [`MergeOptionsConfig`](#type-merge-options-config) setup, it generates a new set of [`ResolverArgs`](#type-resolver-args) that, post-modification, can finally be passed to the resolver when wrapped.

#### <a name="etype-schema-injector-config"></a>SchemaInjectorConfig() [✯](#contents)

```js
export function SchemaInjectorConfig(
  schema: GraphQLSchema,
  extraConfig?: MergeOptionsConfig
): MergeOptionsConfig
```

The merge options config takes the arguments passed into a given `resolve()` function, allowing the implementor to modify the values before passing them back out.

This function takes a schema to inject into the info object, or fourth parameter, passed to any resolver. Any `extraConfig` object added in will have its resolverInjectors added to the list to be processed.

#### <a name="etype-strip-resolvers-from-schema"></a>stripResolversFromSchema() [✯](#contents)

```js
export function stripResolversFromSchema(
  schema: GraphQLSchema
): ?ResolverMap
```

Walk the supplied GraphQLSchema instance and retrieve the resolvers stored on it. These values are then returned with a `[typeName][fieldName]` pathing

## <a name="default-function-handlers"></a>Default Functions [✯](#contents)

#### <a name="dtype-default-directive-merge-resolver"></a>DefaultDirectiveMergeResolver() [✯](#contents)

```js
function DefaultDirectiveMergeResolver(
  leftType: ASTNode,
  leftDirective: DirectiveNode,
  rightType: ASTNode,
  rightDirective: DirectiveNode
): DirectiveNode
```

The default directive resolver blindly takes returns the right field. This
resolver is used when one is not specified.

#### <a name="dtype-default-async-entry-inspector"></a>DefaultAsyncEntryInspector() [✯](#contents)

```js
const DefaultAsyncEntryInspector: AsyncEntryInspector = (key, value, path, map) => ?Promise<{
  [string]: Function
}>
```

A default implementation of the EntryInspector type for use as a default to `asyncWalkResolverMap`. While not immediately useful, a default implementation causes `asyncWalkResolverMap` to wrap any non-function and non-object values with a function that returns the non-compliant value and therefore has some intrinsic value.

#### <a name="dtype-default-entry-inspector"></a>DefaultEntryInspector() [✯](#contents)

```js
const DefaultEntryInspector: EntryInspector = (key, value, path, map) => ?{
  [string]: Function
}
```

A default implementation of the EntryInspector type for use as a default to `walkResolverMap`. While not immediately useful, a default implementation causes `walkResolverMap` to wrap any non-function and non-object values with a function that returns the non-compliant value and therefore has some intrinsic value.

#### <a name="dtype-default-enum-merge-resolver"></a>DefaultEnumMergeResolver() [✯](#contents)

```js
function DefaultEnumMergeResolver(
  leftType: ASTNode,
  leftValue: EnumValueNode,
  rightType: ASTNode,
  rightValue: EnumValueNode
): EnumValueNode
```

The default field resolver blindly takes returns the right field. This resolver is used when one is not specified.

#### <a name="dtype-default-field-merge-resolver"></a>DefaultFieldMergeResolver() [✯](#contents)

```js
function DefaultFieldMergeResolver(
  leftType: ASTNode,
  leftField: FieldNode,
  rightType: ASTNode,
  rightField: FieldNode
): FieldNode
```

The default field resolver blindly takes returns the right field. This resolver is used when one is not specified.

#### <a name="dtype-default-scalar-merge-resolver"></a>DefaultScalarMergeResolver() [✯](#contents)

```js
function DefaultScalarMergeResolver(
  leftScalar: ScalarTypeDefinitionNode,
  leftConfig: GraphQLScalarTypeConfig,
  rightScalar: ScalarTypeDefinitionNode,
  rightConfig: GraphQLScalarTypeConfig
): GraphQLScalarTypeConfig
```

The default scalar merge resolver returns the right config when there is one, otherwise the left one or null will be the default result. This is slightly different behavior since resolvers for scalars are not always available.

#### <a name="dtype-default-union-merge-resolver"></a>DefaultUnionMergeResolver() [✯](#contents)

```js
function DefaultUnionMergeResolver(
  leftType: ASTNode,
  leftUnion: NamedTypeNode,
  rightType: ASTNode,
  rightUnion: NamedTypeNode
): NamedTypeNode
```

The default union resolver blindly takes returns the right type. This resolver is used when one is not specified.

## <a name="goodies"></a>Additional Goodies [✯](#contents)

#### <a name="goodie-fn-at"></a>at() [✯](#contents)

```js
function at(
  object: Object,
  path: string | Array<string>,
  setTo?: mixed,
  playNice?: boolean = false
): mixed
```

This function takes an array of values that are used with `eval` to dynamically, and programmatically, access the value of an object in a nested fashion. It can take either a string with values separated by periods (including array indices as numbers) or an array equivalent were `.split('.')` to have been called on said string.

Examples:

```js
  // Calling `at` with either set of arguments below results in the same
  // values.
  let object = { cats: [{ name: 'Sally' }, { name: 'Rose' }] }
  at(object, 'cats.1.name') => Rose
  at(object, ['cats', 1, 'name']) => Rose
  // Values can be altered using the same notation
  at(object, 'cats.1.name', 'Brie') => Brie
  // Values cannot normally be accessed beyond existence. The following
  // will throw an error. A message to console.error will be written showing
  // the attempted path before the error is again rethrown
  at(object, 'I.do.not.exist') => ERROR
  // However, if you want the function to play nice, `undefined` can be
  // returned instead of throwing an error if true is specified as the
  // fourth parameter
  at(object, 'I.do.not.exist', undefined, true) => undefined
```

#### <a name="goodie-fn-at-nicely"></a>atNicely() [✯](#contents)

```js
function atNicely(
  object: Object,
  path: string | Array<string>,
  setTo?: mixed
): mixed
```

`atNicely()` is a shorthand version of calling `at()` but specifying `true` for the argument `playNice`. This can make reads normally performed with calls to `at()` where you want to prevent errors from being thrown with invalid paths

#### <a name="goodie-gql-tag-fn"></a>gql() [✯](#contents)

```js
function gql(template, ...substitutions)
```

The `gql` template tag function takes the contents of a given template string and returns a Schemata instance using the string as a parameter to the constructor

```js
// i.e.
let sdl = gql`
  type Person {
    name: String
  }
`
console.log(sdl instanceof Schemata) // true
```

#### <a name="goodie-fn-extension-register"></a>register() [✯](#contents)

```js
function register(extension = '.graphql')
```

This function takes an optional string denoting the extension string in which you store your SDL typeDefs in your project. Usually these are `.graphql` files. Regardless, once this function is invoked, you may then on in your project call `require('/path/to/my/typeDef.graphql')` and the resulting value would be an object with the following keys and values:

**Named Exports**

* **astNode** the AST document for the contents of the typeDefs.graphql file
* **resolvers** if there is an adjacent file with a .js extension and the same name, an attempt to load its contents as a module will occur. If successful this object will be the results of that `require()`
* **schema** an instance of `GraphQLSchema` based on the contents of the `.graphql` file
* **schemata** a `Schemata` instance built around the SDL, and JS resolvers if any
* **typeDefs** an alias for _schemata_

The **default** export is the same as the _schemata_ export

#### <a name="goodie-fn-walk-resolver-map"></a>walkResolverMap() [✯](#contents)

```js
function walkResolverMap(
  object: ResolverMap,
  inspector: EntryInspector = DefaultEntryInspector,
  wrap: boolean = true,
  path: Array<string> = []
): ResolverMap
```

Given a `ResolverMap` object, walk its properties and allow execution with each key, value pair. If the supplied function for handling a given entry returns null instead of an object with the format `{key: value}` then that entry will not be included in the final output.

Paths here are somewhat interesting and bear a moments discussion. A `path` of `['job', 'responsibilities']` would indicate that the entry in question is located at `object.job.responsibilities[entry.key]`.

* **object** an object containing string keys mapping to functions or objects nesting the same
* **inspector** a function handler that takes a `key`, a `value`, a `path` which is an array of values from the top of the resolver map leading to the current entry and a reference to the resolver `map` itself.
* **wrap** a boolean object, which defaults to true, and denotes that should a non-function, non-object, value be located then it should be wrapped in a function that returns that value instead
* **path** an array of path strings; predominantly for re-entrant internal usage. See above

#### <a name="goodie-fn-async-walk-resolver-map"></a>asyncWalkResolverMap() [✯](#contents)

```js
function asyncWalkResolverMap(
  object: ResolverMap,
  inspector: AsyncEntryInspector = DefaultAsyncEntryInspector,
  wrap: boolean = true,
  path: Array<string> = []
): ResolverMap
```

Given a `ResolverMap` object, walk its properties and allow execution with each key, value pair. If the supplied function for handling a given entry returns null instead of an object with the format `{key: value}` then that entry will not be included in the final output.

Paths here are somewhat interesting and bear a moments discussion. A `path` of `['job', 'responsibilities']` would indicate that the entry in question is located at `object.job.responsibilities[entry.key]`.

* **object** an object containing string keys mapping to functions or objects nesting the same
* **inspector** a function handler that takes a `key`, a `value`, a `path` which is an array of values from the top of the resolver map leading to the current entry and a reference to the resolver `map` itself.
* **wrap** a boolean object, which defaults to true, and denotes that should a non-function, non-object, value be located then it should be wrapped in a function that returns that value instead
* **path** an array of path strings; predominantly for re-entrant internal usage. See above
