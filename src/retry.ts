import { setTimeout } from 'node:timers/promises'
import { Result, ok, err } from 'neverthrow'

type Invocation = () => any | Promise<any>

type RetryOptions = {
  timeout?: number
  retries?: number
  isExponential?: boolean
}

/**
 * Class representing a retry mechanism.
 */
export class Retry {
  /**
   * Execute the given invocation with retry logic.
   * @param {Invocation} invocation - The function to be executed.
   * @param {RetryOptions} [options] - The retry options.
   * @param {number} [options.timeout=125] - The initial timeout in milliseconds.
   * @param {number} [options.retries=4] - The number of retry attempts.
   * @param {boolean} [options.isExponential=true] - Whether to use exponential backoff.
   * @returns {Promise<Result<any, Error>>} The result of the invocation wrapped in a Result object.
   */
  public static async execute(invocation: Invocation, options: RetryOptions = {}): Promise<Result<any, Error>> {
    const { timeout = 125, retries = 4, isExponential = true } = options
    let _timeout = timeout
    let lastError: Error | null = null

    for (let i = 0; i < retries; i++) {
      try {
        const result = invocation() // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        if (result instanceof Promise) {
          return ok(await result)
        }

        return ok(result)
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        await setTimeout(_timeout)
        if (isExponential) _timeout *= 2
      }
    }

    if (lastError !== null) {
      return err(lastError)
    }

    throw new Error('Unexpected error occurred')
  }
}