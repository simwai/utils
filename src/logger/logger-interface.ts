import { LoggerOptionsType, LoggerResult } from './logger-types.js'

/**
 * Abstract class representing a logger interface.
 * @template T - The type of logger options.
 */
export abstract class LoggerInterface<T extends LoggerOptionsType> {
  /**
   * Indicates whether time logging is enabled.
   * @protected
   * @type {boolean}
   */
  protected _isTimeEnabled = false

  /**
   * The date format used for logging.
   * @protected
   * @type {string}
   */
  protected _dateFormat = 'dd-MM-yyyy HH:mm:ss'

  /**
   * Creates an instance of LoggerInterface.
   * @param {T} [options={}] - The logger options.
   */
  constructor(options: T = {} as T) {
    this._isTimeEnabled = options.isTimeEnabled ?? false
    this._dateFormat = options.dateFormat ?? 'dd-MM-yyyy HH:mm:ss'
  }

  /**
   * Logs a message.
   * @protected
   * @abstract
   * @param {string} type - The type of log message.
   * @param {...(string | Error)} content - The content of the log message.
   * @returns {LoggerResult<void>} - The logger result.
   */
  protected abstract _logMessage(type: string, ...content: Array<string | Error>): LoggerResult<void>
}
