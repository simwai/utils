import { ConsoleLogger } from './logger/console-logger.js'
import { FileLogger } from './logger/file-logger.js'
import { Retry } from './retry.js'

const consoleLogger = new ConsoleLogger({ isTimeEnabled: true })
const fileLogger = new FileLogger({ logFilePath: 'logs/my-log.log' })
const retry = new Retry()

export { ConsoleLogger, FileLogger, Retry }
export default { consoleLogger, retry, fileLogger }