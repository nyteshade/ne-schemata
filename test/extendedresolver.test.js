import {
  ExtendedResolver,
  gql,
  ResolverResultsPatcherError,
  Schemata,
  WrappedResolverExecutionError
} from '..'

describe('Extending a resolver', () => {
  let resolver = function(source, { id }, context, info) {
    return {id: id || 456, name: 'Brielle', gender: 'Female'}
  }

  it('should allow us to mix async and non-async functions', async () => {
    let er = ExtendedResolver.wrap(resolver, [async (r, a, c, i) => {
      return new Promise((resolve, reject) => {
        let timings = { started: Date.now() }

        if (a.id) {
          a.id = 123
        }

        process.stdout.write('started...')
        setTimeout(() => {
          process.stdout.write('done\n')

          resolve(Object.assign(timings, { stopped: Date.now() }))
        })
      })
    }])

    let result = await er(null, { id: 789 });

    // Ensure that we have a result
    expect(result).toBeTruthy()

    // Our id value is modified within the async function. It should be the
    // 123 value and not the 456 or 789 numbers.
    expect(result.id).toBe(123)

    // Ensure we have both start and stop timings
    expect(result.started).toBeTruthy()
    expect(result.stopped).toBeTruthy()

    // Ensure that the timer is within 15ms of the setTimeout()
    expect((result.stopped - result.started) >= 0).toBe(true)
    expect((result.stopped - result.started) < 30).toBe(true)
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
