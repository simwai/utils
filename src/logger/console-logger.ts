import { ok, err } from 'neverthrow'
import { DraculaColorPalette as colors } from './dracula-color-palette.js'
import { LoggerOptionsType, LoggerResult, LogType } from './logger-types.js'
import { BaseLogger } from './base-logger.js'

/**
 * ConsoleLogger is a specialized logger that outputs formatted log messages to the console.
 * It extends the BaseLogger class and uses the Dracula color palette for styling log messages.
 */
export class ConsoleLogger extends BaseLogger<LoggerOptionsType> {
  /**
   * Constructs a new ConsoleLogger instance with the given options.
   * @param {LoggerOptionsType} [options={}] - Configuration options for the logger.
   */
  constructor(options: LoggerOptionsType = {}) {
    super(options)
  }

  /**
   * Logs a message to the console with the specified log type and content.
   * Formats the message using the Dracula color palette and handles any errors that occur during logging.
   * @param {LogType} type - The type of log message (e.g., 'info', 'error').
   * @param {...(string|Error)} content - The content to log, which can be strings or Error objects.
   * @returns {LoggerResult<void>} - A Logger result indicating success or failure.
   */
  protected _logMessage(type: LogType, ...content: Array<string | Error>): LoggerResult<void> {
    const formatResult = this.formatMessage(type, ...content)

    if (formatResult.isErr()) {
      return err(formatResult.error)
    }

    try {
      console[type](colors[type](formatResult.value))
      return ok(undefined)
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to log message'))
    }
  }
}

export default ConsoleLogger
