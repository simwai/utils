import { Result } from 'neverthrow'

/**
 * Options for configuring the logger.
 * @typedef {Object} LoggerOptionsType
 * @property {boolean} [isTimeEnabled] - Flag to enable or disable timestamp in logs.
 * @property {string} [dateFormat] - Format for the date in logs.
 */
export type LoggerOptionsType = {
  isTimeEnabled?: boolean
  dateFormat?: string
}

/**
 * Options for configuring the file logger.
 * @typedef {Object} FileLoggerOptionsType
 * @extends LoggerOptionsType
 * @property {string} [logFilePath] - Path to the log file.
 */
export type FileLoggerOptionsType = LoggerOptionsType & {
  logFilePath?: string
}

/**
 * Result type for logger operations.
 * @typedef {Result<T, Error>} LoggerResult
 * @template T
 */
export type LoggerResult<T> = Result<T, Error>

/**
 * Type of log messages.
 * @typedef {'log' | 'warn' | 'error' | 'trace'} LogType
 */
export type LogType = 'log' | 'warn' | 'error' | 'trace'
