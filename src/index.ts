import { ConsoleLogger } from './logger/console-logger.js'
import { Retry } from './retry.js'

const logger = new ConsoleLogger({ isTimeEnabled: true })
const retry = new Retry()
const myExport = { logger, retry }
export default myExport

export { FileLogger } from './logger/file-logger.js'
export { ConsoleLogger } from './logger/console-logger.js'
export { Retry } from './retry.js'
