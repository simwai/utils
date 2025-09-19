import { ConsoleLogger } from './logger/console-logger.js'
import { Retry } from './retry.js'

const logger = new ConsoleLogger({ isTimeEnabled: true })
const retry = new Retry()
const myExport = { logger, retry }
export default myExport

export { ConsoleLogger } from './logger/console-logger.js'
export { Retry } from './retry.js'

// Note: FileLogger is not available in browser builds as it requires Node.js file system APIs
