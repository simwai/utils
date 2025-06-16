import { ConsoleLogger } from './logger/console-logger.js'
import { FileLogger } from './logger/file-logger.js'
import { Retry } from './retry.js'

const logger = new ConsoleLogger({ isTimeEnabled: true })
const retry = new Retry()

export { ConsoleLogger, FileLogger, Retry }
export default { logger, retry }
