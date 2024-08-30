import { ConsoleLogger } from './logger/console-logger.js'
import { FileLogger } from './logger/file-logger.js'
import { Retry } from './retry.js'

const logger = new ConsoleLogger({ isTimeEnabled: true })
const retry = new Retry()
const fileLogger = new FileLogger({ logFilePath: 'logs/my-log.log' })

export { ConsoleLogger, FileLogger, Retry }
export default { logger, retry, fileLogger }