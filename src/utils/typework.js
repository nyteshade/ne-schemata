// @ts-check

// Internal shorthand for the magic toString() function
const _toString = Object.prototype.toString

/**
 * Leverages JavaScript's internal type system which can be accessed by
 * either using `call` or `apply` on the `Object.prototype.toString`
 * function.
 *
 * @param {mixed} obj - any object or value
 *
 * @return {string} the name of the class or function used for the type
 * of object internally. Note that while null and undefined have actual
 * types internally there is no accessible `Null` or `Undefined` class
 */
export const getType = obj => /t (\w+)/.exec(_toString.call(obj))?.[1]

/**
 * Fetches the internal type of the object in question and then returns
 * true if that is literally equivalent to `Function.name`
 *
 * @param {mixed} obj - any object or value
 *
 * @returns {boolean}  - true if the internal type of the object matches
 * `Function.name`
 */
export const isFn = obj => Function.name === getType(obj)

/**
 * Given an input of any type, `protoChain` constructs an array representing
 * the prototype chain of the input. This array consists of constructor names
 * for each type in the chain. The resulting array also includes a non-standard
 * `isa` method that checks if a given constructor name is part of the chain.
 * Additionally, an `actual` getter is defined to attempt evaluation of the
 * prototype chain names to their actual type references, where possible.
 *
 * @flow
 * @param {mixed} object - The input value for which the prototype chain is
 * desired.
 * @returns {Array<string> & { isa: Function, actual: Array<any> }} An
 * array of constructor names
 *          with appended `isa` method and `actual` getter.
 *
 * @note The `isa` method allows checking if a given type name is in the
 * prototype chain. The `actual` getter attempts to convert type names back
 * to their evaluated types.
 */
export function protoChain(object: unknown): Array<string> {
  if (object === null || object === undefined) { return [getType(object)] }

  let chain = [ Object.getPrototypeOf(object) ]
  let current = chain[0]

  while(current != null) {
    current = Object.getPrototypeOf(current)
    chain.push(current)
  }

  const results = chain
    .map(c => c?.constructor?.name || c)
    .filter(c => !!c)

  Object.defineProperties(results, {
    isa: {
      value: function isa(type) {
        let derived = getType(type)
        switch(derived) {
          case [Function.name]:
            derived = type.name
            break
          default:
            break
        }

        return (
          this.includes(derived) ||
          type?.name && this.includes(type.name)
        )
      }
    },

    actual: {
      get: function() {
        let evalOrBust = o => { try { return (eval(o)) } catch { return o } }
        let revert = o => {
          switch(o) {
            case 'Null': return null
            case 'Undefined': return undefined
            default: return o
        }}
        return this.map(revert).map(evalOrBust)
      }
    }
  })

  return results
}
