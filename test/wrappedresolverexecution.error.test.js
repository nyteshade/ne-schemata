import { WrappedResolverExecutionError, ExtendedResolver } from '..'
import { dropLowest } from 'ne-tag-fns'

describe('Ensure wrapped resolver execution error works as expected', () => {
  const baseError = new Error('I am a contrived error')
  const baseResolver = (root, args, context, info) => ({ name: 'Brielle' })
  const resolver = ExtendedResolver.wrap(baseError, baseResolver)
  const index = 1
  const args = []
  const context = { contrived: 'context' }
  const results = undefined

  let wreError

  function createError() {
    return new WrappedResolverExecutionError(
      baseError,
      resolver,
      index,
      args,
      context, 
      results
    )
  }

  it('should not throw an error when invoking toString()', () => {
    expect(() => {
      wreError = createError() 

      console.log('Sample Error')
      console.log(wreError.toString())
    }).not.toThrow()
  })

  it('should have matching toString() and valueOf()', () => {
    wreError = createError()      

    expect(wreError.toString()).toEqual('' + wreError)
  })
})