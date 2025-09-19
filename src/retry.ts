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
  private readonly _timeout: number
  private readonly _retries: number
  private readonly _isExponential: boolean

  /**
   * Constructs a new Retry instance.
   * @param {RetryOptions} [options] - The retry options.
   */
  constructor(options: RetryOptions = {}) {
    this._timeout = options.timeout ?? 125
    this._retries = options.retries ?? 4
    this._isExponential = options.isExponential ?? true
  }

  /**
   * Execute the given invocation with retry logic.
   * @param {Invocation} invocation - The function to be executed.
   * @param {RetryOptions} [overrideOptions] - Options to override the instance settings.
   * @returns {Promise<Result<any, Error>>} The result of the invocation wrapped in a Result object.
   */
  public async execute(invocation: Invocation, overrideOptions: RetryOptions = {}): Promise<Result<any, Error>> {
    const timeout = overrideOptions.timeout ?? this._timeout
    const retries = overrideOptions.retries ?? this._retries
    const isExponential = overrideOptions.isExponential ?? this._isExponential

    let _timeout = timeout
    let lastError: Error | undefined

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

    if (lastError !== undefined) {
      return err(lastError)
    }

    throw new Error('Unexpected error occurred')
  }
}
