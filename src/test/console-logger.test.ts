import test, { TestFn } from 'ava'
import { SinonStub, stub } from 'sinon'
import { ConsoleLogger } from '../logger/console-logger.js'
import { TestHelpers as helper } from './test-helpers.js' // eslint-disable-line ava/no-import-test-files

type MyTestContext = {
  consoleLogStub: SinonStub
  consoleErrorStub: SinonStub
  consoleWarnStub: SinonStub
  consoleTraceStub: SinonStub
}

const testWithContext: TestFn<MyTestContext> = test as unknown as TestFn<MyTestContext>

testWithContext.before((t) => {
  t.context.consoleLogStub = stub(console, 'log')
  t.context.consoleErrorStub = stub(console, 'error')
  t.context.consoleWarnStub = stub(console, 'warn')
  t.context.consoleTraceStub = stub(console, 'trace')
})

testWithContext.afterEach((t) => {
  t.context.consoleLogStub.restore()
  t.context.consoleErrorStub.restore()
  t.context.consoleWarnStub.restore()
  t.context.consoleTraceStub.restore()
})

testWithContext('ConsoleLogger.log should log messages with correct color', (t) => {
  const logger = new ConsoleLogger()
  const message = 'Hello, world!'
  const result = logger.log(message)
  t.true(result.isOk())

  const stubbedCall = t.context.consoleLogStub.firstCall
  t.truthy(stubbedCall)

  if (stubbedCall) {
    const loggedMessage = stubbedCall.args[0] as string
    t.regex(loggedMessage, /\[LOG]: Hello, world!/)
    t.true(helper.hasAnsiColor(loggedMessage, '#f8f8f2'), 'Log message should be colored with #f8f8f2')
  }
})

testWithContext('ConsoleLogger.error should log errors with correct color', (t) => {
  const logger = new ConsoleLogger()
  const error = new Error('Something went wrong!')
  const result = logger.error(error)
  t.true(result.isOk())

  const stubbedCall = t.context.consoleErrorStub.firstCall
  t.truthy(stubbedCall)

  if (stubbedCall) {
    const loggedMessage = stubbedCall.args[0] as string
    t.regex(loggedMessage, /\[ERROR]:.*Something went wrong!/)
    t.true(helper.hasAnsiColor(loggedMessage, '#ff5555'), 'Error message should be colored with #ff5555')
  }
})

testWithContext('ConsoleLogger.warn should log warnings with correct color', (t) => {
  const logger = new ConsoleLogger()
  const warning = 'This is a warning!'
  const result = logger.warn(warning)
  t.true(result.isOk())

  const stubbedCall = t.context.consoleWarnStub.firstCall
  t.truthy(stubbedCall)

  if (stubbedCall) {
    const loggedMessage = stubbedCall.args[0] as string
    t.regex(loggedMessage, /\[WARN]: This is a warning!/)
    t.true(helper.hasAnsiColor(loggedMessage, '#f1fa8c'), 'Warning message should be colored with #f1fa8c')
  }
})

testWithContext('ConsoleLogger.trace should log trace messages with correct color', (t) => {
  const logger = new ConsoleLogger()
  const traceMessage = 'Trace message'
  const result = logger.trace(traceMessage)
  t.true(result.isOk())

  const stubbedCall = t.context.consoleTraceStub.firstCall
  t.truthy(stubbedCall)

  if (stubbedCall) {
    const loggedMessage = stubbedCall.args[0] as string
    t.regex(loggedMessage, /\[TRACE]: Trace message/)
    t.true(helper.hasAnsiColor(loggedMessage, '#bd93f9'), 'Trace message should be colored with #bd93f9')
  }
})

testWithContext('ConsoleLogger should handle multiple messages', (t) => {
  const logger = new ConsoleLogger()
  const messages = ['Message 1', 'Message 2']
  const result = logger.log(...messages)
  t.true(result.isOk())

  const stubbedCall = t.context.consoleLogStub.firstCall
  t.truthy(stubbedCall)

  if (stubbedCall) {
    const loggedMessage = stubbedCall.args[0] as string

    t.regex(loggedMessage, /(.*)\[LOG]: Hello, world(.*)/)
    t.true(helper.hasAnsiColor(loggedMessage, '#f8f8f2'), 'Log message should be colored with #f8f8f2')
  }
})
