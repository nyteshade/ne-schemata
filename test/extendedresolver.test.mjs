import { describe, it, expect } from 'vitest'

import {
  ExtendedResolver,
  gql,
  ResolverResultsPatcherError,
  Schemata,
  WrappedResolverExecutionError
} from '../src/index.mjs'

describe('Extending a resolver', () => {
  let resolver = function(source, { id }, context, info) {
    return {id: id || 456, name: 'Brielle', gender: 'Female'}
  }

  it('should allow async prepended resolvers to short-circuit', async () => {
    // With the new middleware pattern, returning a value short-circuits the chain
    let er = ExtendedResolver.wrap(resolver, [async (r, a, c, i) => {
      return new Promise((resolve) => {
        let timings = { started: Date.now() }

        if (a.id) {
          a.id = 123
        }

        setTimeout(() => {
          // This return value short-circuits and prevents the original resolver
          // from running. The new middleware pattern: return value = stop here.
          resolve(Object.assign(timings, { stopped: Date.now(), id: a.id }))
        })
      })
    }])

    let result = await er(null, { id: 789 });

    // Ensure that we have a result
    expect(result).toBeTruthy()

    // The prepended resolver modified a.id to 123 and returned it
    expect(result.id).toBe(123)

    // Ensure we have both start and stop timings (from prepended resolver)
    expect(result.started).toBeTruthy()
    expect(result.stopped).toBeTruthy()

    // Ensure that the timer is within reasonable range
    expect((result.stopped - result.started) >= 0).toBe(true)
  })

  it('should fall through to original resolver when prepended returns undefined', async () => {
    // When prepended resolvers return undefined/null, the chain continues
    let modifiedId = null
    let er = ExtendedResolver.wrap(resolver, [async (r, a, c, i) => {
      modifiedId = a.id
      // Return undefined to continue to the original resolver
      return undefined
    }])

    let result = await er(null, { id: 789 });

    // The original resolver was called (prepended returned undefined)
    expect(result.id).toBe(789) // Original resolver uses the id from args
    expect(modifiedId).toBe(789) // Prepended saw the original value
  })

  it('throws a ResolverResultsPatcherError for a bad patcher', () => {
    let er = ExtendedResolver.wrap(() => 42, [], [],
      (results) => { throw new Error('contrived') }
    )

    er().catch(error => {
      expect(error instanceof ResolverResultsPatcherError).toBeTruthy()
    })
  })

  it('throws a WrappedResolverExecutionError for a bad patcher', () => {
    let er = ExtendedResolver.wrap(
      () => 42,
      (results) => { throw new Error('contrived') }
    )

    er().catch(error => {
      expect(error instanceof WrappedResolverExecutionError).toBeTruthy()
    })
  })

})
