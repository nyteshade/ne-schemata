import { ResolverResultsPatcherError } from '..'
import { dropLowest } from 'ne-tag-fns'
import { create } from 'domain';

describe('Ensure resolver results patcher error works as expected', () => {
  const baseError = new Error('I am a contrived error')
  const patcher = async function samplePatcher(results) {
    console.log('I am a contrived ResolverResultsPatcher')
    return results 
  }
  const context = { sample: 'Context' }
  const results = undefined
  let rrpError

  function createError() {
    return new ResolverResultsPatcherError(
      baseError, 
      patcher, 
      context, 
      results
    )
  }

  it('should not throw an error when invoking toString()', () => {
    expect(() => {
      rrpError = createError()      

      console.log('Sample Error')
      console.log(rrpError.toString())
    }).not.toThrow()
  })

  it('should have matching toString() and valueOf()', () => {
    rrpError = createError()      

    expect(rrpError.toString()).toEqual('' + rrpError)
  })
})