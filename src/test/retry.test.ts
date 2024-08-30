import test from 'ava'
import sinon from 'sinon'
import { Retry } from '../retry.js'
const retry = Retry.execute

test('retry succeeds on first try', async (t) => {
  const result = await retry(() => 'success')
  t.true(result.isOk())
  t.is(result._unsafeUnwrap(), 'success')
})

test('retry retries and succeeds', async (t) => {
  const stub = sinon.stub()
  stub.onFirstCall().throws(new Error('Fail'))
  stub.onSecondCall().returns('success')

  const result = await retry(stub, { timeout: 10, retries: 3 })
  t.true(result.isOk())
  t.is(result._unsafeUnwrap(), 'success')
  t.is(stub.callCount, 2)
})

test('retry fails after all retries', async (t) => {
  const stub = sinon.stub().throws(new Error('Persistent failure'))

  const result = await retry(stub, { timeout: 10, retries: 2 })
  t.true(result.isErr())
  t.is(stub.callCount, 2)
})

test('retry uses exponential backoff', async (t) => {
  const clock = sinon.useFakeTimers()
  const stub = sinon.stub()
  stub.onThirdCall().returns('success')

  const executePromise = retry(stub, { timeout: 100, retries: 3, isExponential: true })
  await clock.tickAsync(100)
  await clock.tickAsync(200)
  await clock.tickAsync(400)
  const result = await executePromise

  t.true(result.isOk())
  t.is(stub.callCount, 1)
  clock.restore()
})
