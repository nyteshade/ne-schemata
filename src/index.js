import {
  Schemata,
  normalizeSource,
  stripResolversFromSchema,
  TYPEDEFS_KEY
} from './Schemata'
import { register, graphQLExtensionHandler } from './GraphQLExtension'
import { gql } from './gqlTagFn'
import jestTransformer from './jestTransformer'

const SDL = Schemata

export {
  // A template tag function that returns an instance of Schemata rather than a
  // basic String object. Should work with `babel` syntax highlighting in
  // Sublime Text, Atom and Visual Studio Code
  gql,

  // An object containing a `.process` function used with jest in order to
  // simulate require/import extension in the highly mocked jest test
  // environment.
  jestTransformer,

  // Function that, when called, registers '.graphql' as an extension that
  // `import {} from` and `require` both understand how to load
  register,

  // The Schemata class itself
  Schemata,

  // For backwards compatibility
  SDL,

  // Nice utility function
  stripResolversFromSchema,

  // Convert varied types of input to a string
  normalizeSource,

  // Used to make modifications to the string wrapped in an Schemata instance
  TYPEDEFS_KEY,
}

export default Schemata