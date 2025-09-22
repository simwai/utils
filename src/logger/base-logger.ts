import { DateTime } from 'luxon'
import { ok, err, Result } from 'neverthrow'
import { LoggerInterface } from './logger-interface.js'
import { LoggerOptionsType, LoggerResult, LogType } from './logger-types.js'

/**
 * Abstract base class for logging functionality.
 *
 * @template T - The type of logger options.
 */
export abstract class BaseLogger<T extends LoggerOptionsType> extends LoggerInterface<T> {
  /**
   * Logs a message with 'log' level.
   *
   * @param {...(string | Error)} content - The content to log.
   * @returns {LoggerResult<void>} The result of the logging operation.
   */
  public log(...content: Array<string | Error>): LoggerResult<void> {
    return this._logMessage('log', ...content)
  }

  /**
   * Logs a message with 'error' level.
   *
   * @param {...(string | Error)} content - The content to log.
   * @returns {LoggerResult<void>} The result of the logging operation.
   */
  public error(...content: Array<string | Error>): LoggerResult<void> {
    return this._logMessage('error', ...content)
  }

  /**
   * Logs a message with 'warn' level.
   *
   * @param {...string} content - The content to log.
   * @returns {LoggerResult<void>} The result of the logging operation.
   */
  public warn(...content: string[]): LoggerResult<void> {
    return this._logMessage('warn', ...content)
  }

  /**
   * Logs a message with 'trace' level.
   *
   * @param {...string} content - The content to log.
   * @returns {LoggerResult<void>} The result of the logging operation.
   */
  public trace(...content: Array<string | Error>): LoggerResult<void> {
    return this._logMessage('trace', ...content)
  }

  /**
   * Formats a log message.
   *
   * @param {LogType} type - The type of log message.
   * @param {...(string | Error)} content - The content to format.
   * @returns {Result<string, Error>} The formatted message or an error.
   */
  protected formatMessage(type: LogType, ...content: Array<string | Error>): Result<string, Error> {
    try {
      const formattedContent: string = content
        .map((item) => {
          if (item instanceof Error) {
            return item.stack?.replace('Error:', '').trim() ?? item.message
          }

          return item
        })
        .join(' ')

      const now: DateTime = DateTime.now()
      const timestamp = `[${now.toFormat(this._dateFormat)}]`
      const logType = `[${type.toUpperCase()}]:`
      const message = `${formattedContent}\n`

      return ok(`${this._isTimeEnabled ? timestamp : ''}${logType} ${message}`)
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Unknown error occurred while formatting message'))
    }
  }
}
