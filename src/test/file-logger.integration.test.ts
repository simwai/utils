import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import test, { TestFn } from 'ava'
import { FileLogger } from '../logger/file-logger.js'

type MyTestContext = {
  testFolder: string
  testFile: string
  logFilePath: string
}

const testWithContext: TestFn<MyTestContext> = test as unknown as TestFn<MyTestContext>

testWithContext.beforeEach((t) => {
  t.context.testFolder = 'test-logs'
  t.context.testFile = 'test.log'
  t.context.logFilePath = path.join(process.cwd(), t.context.testFolder, t.context.testFile)

  if (fs.existsSync(t.context.testFolder)) {
    fs.rmSync(t.context.testFolder, { recursive: true, force: true })
  }
})

testWithContext.afterEach((t) => {
  if (fs.existsSync(t.context.testFolder)) {
    fs.rmSync(t.context.testFolder, { recursive: true, force: true })
  }
})

testWithContext('FileLogger should log info messages to a file', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const message = 'Info message'
  const result = logger.log(message)

  t.true(result.isOk())
  
  const logContent = fs.readFileSync(t.context.logFilePath, 'utf-8')
  t.regex(logContent, /\[LOG]: Info message/)
})

testWithContext('FileLogger should log error messages to a file', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const error = new Error('Error message')
  const result = logger.error(error)

  t.true(result.isOk())

  const logContent = fs.readFileSync(t.context.logFilePath, 'utf-8')
  t.regex(logContent, /\[ERROR]: Error message(.*)/)
})

testWithContext('FileLogger should handle multiple messages', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const messages = ['Message 1', 'Message 2']
  const result = logger.log(...messages)

  t.true(result.isOk())

  const logContent = fs.readFileSync(t.context.logFilePath, 'utf-8')
  t.regex(logContent, /\[LOG]: Message 1 Message 2(.*)/)
})

testWithContext('FileLogger should create log file in specified path', async (t) => {
  const logger = new FileLogger({ logFilePath: t.context.logFilePath })
  const message = 'Test path message'
  const result = logger.log(message)

  t.true(result.isOk())
  t.true(fs.existsSync(t.context.logFilePath))
})
