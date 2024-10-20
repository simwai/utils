import test, { TestFn } from 'ava'
import { Retry } from '../retry.js'

type MyTestContext = {
  retryInstance: Retry
}

const testWithContext: TestFn<MyTestContext> = test as unknown as TestFn<MyTestContext>

testWithContext.beforeEach((t) => {
  t.context.retryInstance = new Retry()
})

testWithContext('retry succeeds with real async operation', async (t) => {
  const result = await t.context.retryInstance.execute(async () => {
    return new Promise((resolve) => setTimeout(() => resolve('success'), 100))
  })
  t.true(result.isOk())
  t.is(result._unsafeUnwrap(), 'success')
})

testWithContext('retry retries with real failing operation', async (t) => {
  let attempts = 0
  const result = await t.context.retryInstance.execute(async () => {
    attempts++
    if (attempts < 3) {
      throw new Error('Temporary failure')
    }
    return 'success after retries'
  }, { timeout: 100, retries: 3 })
  t.true(result.isOk())
  t.is(result._unsafeUnwrap(), 'success after retries')
  t.is(attempts, 3)
})

testWithContext('retry fails with persistent real error', async (t) => {
  const result = await t.context.retryInstance.execute(async () => {
    throw new Error('Persistent failure')
  }, { timeout: 100, retries: 2 })
  t.true(result.isErr())
})

testWithContext('retry handles non-Error throws', async (t) => {
  const result = await t.context.retryInstance.execute(() => {
    throw 'string error' // eslint-disable-line no-throw-literal
  }, { timeout: 100, retries: 1 })
  t.true(result.isErr())
  t.is(result._unsafeUnwrapErr().message, 'Unknown error')
})
