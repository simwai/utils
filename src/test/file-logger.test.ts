import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import test, { TestFn } from 'ava'
import { SinonStub, stub } from 'sinon'
import { FileLogger } from '../logger/file-logger.js'
import { TestHelper } from './test-helper.js'

type MyTestContext = {
  logFilePath: string
  fsAppendFileStub: SinonStub
  testFolder: string
  testFile: string
}

const testWithContext: TestFn<MyTestContext> = test as unknown as TestFn<MyTestContext>

testWithContext.before((t) => {
  t.context.testFolder = 'test-logs'
  t.context.testFile = 'test.log'

  t.context.logFilePath = path.join(process.cwd(), t.context.testFolder, t.context.testFile)
  t.context.fsAppendFileStub = stub(fs, 'appendFileSync')
})

testWithContext.after.always((t) => {
  TestHelper.cleanUp(t.context.testFolder)
})

testWithContext.serial('FileLogger should log info messages to a file', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const message = 'Info message'
  const result = logger.log(message)

  t.true(result.isOk())
  t.true(t.context.fsAppendFileStub.called);

  const loggedMessage = t.context.fsAppendFileStub.firstCall.args[1] as string
  t.regex(loggedMessage, /\[LOG]: Info message/)
})

testWithContext.serial('FileLogger should log error messages to a file', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath });
  const error = new Error('Error message');
  const result = logger.error(error);

  t.true(result.isOk());
  t.true(t.context.fsAppendFileStub.called);

  // Retrieve the logged message from the first call to fs.appendFileSync
  const loggedMessage = t.context.fsAppendFileStub.lastCall.args[1] as string;
  t.regex(loggedMessage, /\[ERROR]: Error message(.*)/);
})

testWithContext.serial('FileLogger should handle multiple messages', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const messages = ['Message 1', 'Message 2']
  const result = logger.log(...messages)

  t.true(result.isOk())
  t.true(t.context.fsAppendFileStub.called);

  const loggedMessage = t.context.fsAppendFileStub.lastCall.args[1] as string
  t.regex(loggedMessage, /\[LOG]: Message 1 Message 2(.*)/)
})

testWithContext.serial('FileLogger should create log file in specified path', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const message = 'Test path message'
  const result = logger.log(message)

  t.true(result.isOk())
  t.true(t.context.fsAppendFileStub.called);

  const loggedFilePath = t.context.fsAppendFileStub.lastCall.args[0] as string
  t.is(loggedFilePath, t.context.logFilePath)
})

testWithContext.serial('FileLogger should handle logging errors gracefully', async (t) => {
  t.context.fsAppendFileStub.throws(new Error('Write error'))

  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const message = 'This will fail'

  const result = logger.log(message)
  t.true(result.isErr())
})
