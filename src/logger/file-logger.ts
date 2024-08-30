import path from 'node:path'
import fs from 'node:fs'
import process from 'node:process'
import { ok, err } from 'neverthrow'
import { FileLoggerOptionsType, LoggerResult, LogType } from './logger-types.js'
import { BaseLogger } from './base-logger.js'

/**
 * FileLogger class for logging messages to a file.
 * Extends the BaseLogger class with file-specific logging functionality.
 */
export class FileLogger extends BaseLogger<FileLoggerOptionsType> {
  private readonly _logFilePath: string

  /**
   * Constructs a new FileLogger instance.
   * @param {FileLoggerOptionsType} [options={}] - Configuration options for the file logger.
   */
  constructor(options: FileLoggerOptionsType = {}) {
    super(options)

    this._logFilePath = options.logFilePath ?? path.join(process.cwd(), 'logs', 'my-log.log')
    this._createFolder()
  }

  /**
   * Creates the folder for the log file if it does not already exist.
   * This method ensures that the directory structure is created recursively.
   * @private
   */
  private _createFolder() {
    const directory = path.dirname(this._logFilePath)
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
  }

  /**
   * Logs a message to the file.
   * @param {LogType} type - The type of log message (e.g., info, error).
   * @param {...(string | Error)} content - The content of the log message.
   * @returns {LoggerResult<void>} - The result of the logging operation.
   * @protected
   */
  protected _logMessage(type: LogType, ...content: Array<string | Error>): LoggerResult<void> {
    const formatResult = this.formatMessage(type, ...content)

    if (formatResult.isErr()) {
      return err(formatResult.error)
    }

    try {
      fs.appendFileSync(this._logFilePath, formatResult.value)
      return ok(undefined)
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to log message'))
    }
  }
}
