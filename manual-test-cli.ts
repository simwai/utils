import inquirer from 'inquirer'
import { ConsoleLogger } from './src/logger/console-logger.js'
import { FileLogger } from './src/logger/file-logger.js'
import { Retry } from './src/retry.js'

export class ManualTestCli {
  private _isRunning: boolean

  constructor(
    private readonly _consoleLogger: ConsoleLogger,
    private readonly _fileLogger?: FileLogger,
    private readonly _retry?: Retry
  ) {
    this._isRunning = false
  }

  public async start(): Promise<void> {
    this._consoleLogger.log('🚀 Utils Manual Test CLI - Type "help" for commands or "exit" to quit\n')

    this._isRunning = true
    while (this._isRunning) {
      try {
        const { command } = await inquirer.prompt<{ command: string }>([
          {
            type: 'input',
            name: 'command',
            message: 'utils-cli$',
            validate: (input: string) => input.trim().length > 0 || 'Please enter a command (or "help" for available commands)',
          },
        ])

        const trimmedCommand = command.trim()
        if (trimmedCommand) {
          const [commandName, ...arguments_] = trimmedCommand.split(' ')

          await this._handleCommand(commandName!, arguments_)
        }

        if (this._isRunning) {
          this._consoleLogger.log('')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown prompt error'
        this._consoleLogger.log(`❌ Prompt error: ${errorMessage}`)
        break
      }
    }

    this._consoleLogger.log('👋 Goodbye!')
  }

  public stop(): void {
    this._isRunning = false
  }

  private async _handleCommand(command: string, arguments_: string[]): Promise<void> {
    switch (command) {
      case 'unified-color-test': {
        await this._handleUnifiedColorTest()
        break
      }

      case 'log': {
        this._handleLog(arguments_)
        break
      }

      case 'warn': {
        this._handleWarn(arguments_)
        break
      }

      case 'error': {
        this._handleError(arguments_)
        break
      }

      case 'trace': {
        this._handleTrace(arguments_)
        break
      }

      case 'file-log': {
        this._handleFileLog(arguments_)
        break
      }

      case 'retry-test': {
        await this._handleRetryTest(arguments_)
        break
      }

      case 'retry-config': {
        await this._handleRetryConfig(arguments_)
        break
      }

      case 'interactive': {
        await this._handleInteractiveMode()
        break
      }

      case 'clear': {
        console.clear()
        this._consoleLogger.log('🚀 Utils Manual Test CLI - Type "help" for commands or "exit" to quit\n')
        break
      }

      case 'help': {
        this._showHelp()
        break
      }

      case 'exit': {
        this.stop()
        break
      }

      case '': {
        break
      }

      default: {
        this._consoleLogger.log(`❌ Unknown command: ${command}`)
        this._consoleLogger.log('💡 Type "help" to see available commands')
        break
      }
    }
  }

  // Seems like each major terminal supports 256-bit ANSI colors (on Windows)
  private async _handleUnifiedColorTest(): Promise<void> {
    this._consoleLogger.log('🎨 Comprehensive Color Test - ConsoleLogger vs Direct Console\n')

    try {
      const testMessages = {
        log: 'This is a LOG message',
        warn: 'This is a WARN message',
        error: 'This is an ERROR message',
        trace: 'This is a TRACE message',
      }
      const testError = new Error("I'm a TestError")

      this._consoleLogger.log('📝 Test 1: ConsoleLogger Output')
      this._consoleLogger.log('='.repeat(50))

      this._consoleLogger.log(testMessages.log)
      this._consoleLogger.warn(testMessages.warn)
      this._consoleLogger.error(testMessages.error, testError)
      this._consoleLogger.trace(testMessages.trace, testError)

      console.log('\n🌈 Test 2: Console ANSI Verification')
      console.log('='.repeat(50))
      console.log('Red (31): \u001B[31mThis should be red\u001B[0m')
      console.log('Yellow (33): \u001B[33mThis should be yellow\u001B[0m')
      console.log('Green (32): \u001B[32mThis should be green\u001B[0m')
      console.log('Bright Red (91): \u001B[91mThis should be bright red\u001B[0m')
      console.log('Bright Yellow (93): \u001B[93mThis should be bright yellow\u001B[0m')
      console.log('Purple (35): \u001B[35mThis should be purple\u001B[0m')

      this._consoleLogger.log('\n✅ Unified color test completed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown color test error'
      this._consoleLogger.error(`❌ Unified color test failed: ${errorMessage}`)
    }
  }

  private _handleLog(arguments_: string[]): void {
    const message = arguments_.join(' ')
    if (!message) {
      this._consoleLogger.log('❌ Please provide a message to log')
      return
    }

    const result = this._consoleLogger.log(message)
    this._consoleLogger.log(result.isOk() ? '✅ Console log success' : `❌ Console log error: ${result.error.message}`)
  }

  private _handleWarn(arguments_: string[]): void {
    const message = arguments_.join(' ')
    if (!message) {
      this._consoleLogger.log('❌ Please provide a message to warn')
      return
    }

    const result = this._consoleLogger.warn(message)
    this._consoleLogger.log(result.isOk() ? '⚠️ Console warn success' : `❌ Console warn error: ${result.error.message}`)
  }

  private _handleError(arguments_: string[]): void {
    const message = arguments_.join(' ')
    if (!message) {
      this._consoleLogger.log('❌ Please provide a message to error')
      return
    }

    const result = this._consoleLogger.error(message)
    this._consoleLogger.log(result.isOk() ? '🔥 Console error success' : `❌ Console error failed: ${result.error.message}`)
  }

  private _handleTrace(arguments_: string[]): void {
    const message = arguments_.join(' ')
    if (!message) {
      this._consoleLogger.log('❌ Please provide a message to trace')
      return
    }

    const result = this._consoleLogger.trace(message)
    this._consoleLogger.log(result.isOk() ? '🔍 Console trace success' : `❌ Console trace error: ${result.error.message}`)
  }

  private _handleFileLog(arguments_: string[]): void {
    const message = arguments_.join(' ')
    if (!message) {
      this._consoleLogger.log('❌ Please provide a message to log to file')
      return
    }

    if (!this._fileLogger) {
      this._consoleLogger.log('❌ File logger not available')
      return
    }

    const result = this._fileLogger.log(message)
    this._consoleLogger.log(result.isOk() ? '📄 File log success' : `❌ File log error: ${result.error.message}`)
  }

  private async _handleRetryTest(arguments_: string[]): Promise<void> {
    if (!this._retry) {
      this._consoleLogger.log('❌ Retry instance not available')
      return
    }

    const failureCount = arguments_[0] ? Number.parseInt(arguments_[0], 10) : 2

    if (Number.isNaN(failureCount) || failureCount < 0) {
      this._consoleLogger.log('❌ Invalid failure count. Use: retry-test [number]')
      return
    }

    this._consoleLogger.log(`🧪 Testing retry mechanism with ${failureCount} initial failures...\n`)
    let attemptCount = 0
    const testFunction = async (): Promise<string> => {
      attemptCount++
      this._consoleLogger.log(`🔄 Attempt ${attemptCount}`)

      if (attemptCount <= failureCount) {
        throw new Error(`Simulated failure on attempt ${attemptCount}`)
      }

      return `Success after ${attemptCount} attempts!`
    }

    try {
      const result = await this._retry.execute(testFunction)

      if (result.isOk()) {
        this._consoleLogger.log(`✅ ${result.value}`)
      } else {
        this._consoleLogger.log(`❌ Retry failed: ${result.error.message}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown retry error'
      this._consoleLogger.log(`❌ Retry test error: ${errorMessage}`)
    }
  }

  private async _handleRetryConfig(arguments_: string[]): Promise<void> {
    const retries = arguments_[0] ? Number.parseInt(arguments_[0], 10) : 3
    const timeout = arguments_[1] ? Number.parseInt(arguments_[1], 10) : 500
    const isExponential = arguments_[2] !== 'false'

    this._consoleLogger.log(`🔧 Testing retry with: ${retries} retries, ${timeout}ms timeout, exponential: ${isExponential}\n`)

    const customRetry = new Retry({ retries, timeout, isExponential })
    let attemptCount = 0

    const testFunction = async (): Promise<string> => {
      attemptCount++
      this._consoleLogger.log(`🔄 Custom retry attempt ${attemptCount}`)

      if (attemptCount < 2) {
        throw new Error(`Custom retry failure on attempt ${attemptCount}`)
      }

      return `Custom retry success after ${attemptCount} attempts!`
    }

    const result = await customRetry.execute(testFunction)

    if (result.isOk()) {
      this._consoleLogger.log(`✅ ${result.value}`)
    } else {
      this._consoleLogger.log(`❌ Custom retry failed: ${result.error.message}`)
    }
  }

  private async _handleInteractiveMode(): Promise<void> {
    this._consoleLogger.log('🎮 Interactive Mode - Guided testing experience\n')

    try {
      const { feature } = await inquirer.prompt<{ feature: string }>([
        {
          type: 'list',
          name: 'feature',
          message: 'Which feature would you like to test?',
          choices: [
            { name: '📝 Console Logging', value: 'console' },
            { name: '📄 File Logging', value: 'file' },
            { name: '🔄 Retry Mechanism', value: 'retry' },
            { name: '⚙️ Custom Retry Configuration', value: 'custom-retry' },
            { name: '🎨 Color Testing', value: 'color' },
            { name: '🔙 Back to Command Mode', value: 'back' },
          ],
        },
      ])

      switch (feature) {
        case 'console': {
          await this._interactiveConsoleLogging()
          break
        }

        case 'file': {
          await this._interactiveFileLogging()
          break
        }

        case 'retry': {
          await this._interactiveRetryTesting()
          break
        }

        case 'custom-retry': {
          await this._interactiveCustomRetry()
          break
        }

        case 'color': {
          await this._handleUnifiedColorTest()
          break
        }

        case 'back': {
          this._consoleLogger.log('Returning to command mode...')
          break
        }

        default: {
          this._consoleLogger.log('Unknown feature selection')
          break
        }
      }
    } catch {
      this._consoleLogger.log('Interactive mode cancelled')
    }
  }

  private async _interactiveConsoleLogging(): Promise<void> {
    const { logLevel, message } = await inquirer.prompt<{ logLevel: string; message: string }>([
      {
        type: 'list',
        name: 'logLevel',
        message: 'Select log level:',
        choices: ['log', 'warn', 'error', 'trace'],
      },
      {
        type: 'input',
        name: 'message',
        message: 'Enter your message:',
        validate: (input: string) => input.trim().length > 0 || 'Please enter a message',
      },
    ])

    await this._handleCommand(logLevel, [message])
  }

  private async _interactiveFileLogging(): Promise<void> {
    const { message } = await inquirer.prompt<{ message: string }>([
      {
        type: 'input',
        name: 'message',
        message: 'Enter message to log to file:',
        validate: (input: string) => input.trim().length > 0 || 'Please enter a message',
      },
    ])

    this._handleFileLog([message])
  }

  private async _interactiveRetryTesting(): Promise<void> {
    const { failures } = await inquirer.prompt<{ failures: string }>([
      {
        type: 'input',
        name: 'failures',
        message: 'How many failures before success? (default: 2):',
        default: '2',
        validate(input: string) {
          const number_ = Number.parseInt(input, 10)
          return (!Number.isNaN(number_) && number_ >= 0) || 'Please enter a valid number'
        },
      },
    ])

    await this._handleRetryTest([failures])
  }

  private async _interactiveCustomRetry(): Promise<void> {
    const { retries, timeout, exponential } = await inquirer.prompt<{
      retries: string
      timeout: string
      exponential: boolean
    }>([
      {
        type: 'input',
        name: 'retries',
        message: 'Number of retries:',
        default: '3',
        validate(input: string) {
          const number_ = Number.parseInt(input, 10)
          return (!Number.isNaN(number_) && number_ > 0) || 'Please enter a positive number'
        },
      },
      {
        type: 'input',
        name: 'timeout',
        message: 'Timeout between retries (ms):',
        default: '500',
        validate(input: string) {
          const number_ = Number.parseInt(input, 10)
          return (!Number.isNaN(number_) && number_ > 0) || 'Please enter a positive number'
        },
      },
      {
        type: 'confirm',
        name: 'exponential',
        message: 'Use exponential backoff?',
        default: true,
      },
    ])

    await this._handleRetryConfig([retries, timeout, exponential.toString()])
  }

  private _showHelp(): void {
    this._consoleLogger.log('📚 Available commands:')
    this._consoleLogger.log('  unified-color-test         - Comprehensive color comparison test')
    this._consoleLogger.log('  log <message>              - Test console logging')
    this._consoleLogger.log('  warn <message>             - Test console warning')
    this._consoleLogger.log('  error <message>            - Test console error')
    this._consoleLogger.log('  trace <message>            - Test console trace')
    this._consoleLogger.log('  file-log <message>         - Test file logging')
    this._consoleLogger.log('  retry-test [failures]      - Test retry mechanism (default: 2 failures)')
    this._consoleLogger.log('  retry-config <r> <t> <e>   - Test custom retry (retries, timeout, exponential)')
    this._consoleLogger.log('  interactive                - Enter guided interactive mode')
    this._consoleLogger.log('  clear                      - Clear the screen')
    this._consoleLogger.log('  help                       - Show this help')
    this._consoleLogger.log('  exit                       - Exit CLI')
    this._consoleLogger.log('')
    this._consoleLogger.log('💡 Examples:')
    this._consoleLogger.log('  unified-color-test')
    this._consoleLogger.log('  log Hello world!')
    this._consoleLogger.log('  retry-test 3')
    this._consoleLogger.log('  retry-config 5 200 false')
    this._consoleLogger.log('  interactive')
  }
}

const logger = new ConsoleLogger({ isLogTypeEnabled: true })
const fileLogger = new FileLogger({ logFilePath: './repl-test.log' })
const retry = new Retry({ retries: 3, timeout: 1000, isExponential: true })
const cli = new ManualTestCli(logger, fileLogger, retry)

try {
  await cli.start()
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown startup error'
  console.error(`Failed to start CLI: ${errorMessage}`)
  throw new Error(`CLI startup failed: ${errorMessage}`)
}
