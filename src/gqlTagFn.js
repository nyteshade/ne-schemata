import { Schemata } from './Schemata'
import { handleSubstitutions } from 'ne-tag-fns'

/**
 * A small wrapper that creates a Schemata instance when using template strings
 * by invoking the `gql` tag function in front of it.
 *
 * i.e.
 *   let sdl = gql`type Person { name: String }`
 *   console.log(sdl instanceof Schemata) // true
 *
 * @param {string} template   [description]
 * @param {Array<mixed>} substitutions [description]
 * @return {Schemata} an instance of Schemata wrapping the string in the
 * template
 */
export function gql(template, ...substitutions) {
  const string = handleSubstitutions(template, ...substitutions)
  const schemata = Schemata.from(string) 
  const ast = schemata.ast 
  const schemataProps = Object.getOwnPropertyNames(Schemata.prototype)
  
  return new Proxy(ast, {
    get(target, prop, receiver) {
      if (prop === "schemata")          { return schemata }    
      if (prop === "string")            { return string }      
      if (schemataProps.includes(prop)) { return schemata[prop] }
      
      return Reflect.get(target, prop, receiver)
    }
  })
  //return Schemata.from(handleSubstitutions(template, ...substitutions))
}

export default gql