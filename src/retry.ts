/* eslint-disable n/prefer-global/process */
import { Result, ok, err } from 'neverthrow'

/**
 * Function that can be synchronous or asynchronous.
 */
type Invocation = () => any | Promise<any>

/**
 * Configuration options for retry behavior.
 */
type RetryOptions = {
  /** Delay in milliseconds between retry attempts. @defaultValue 125 */
  timeout?: number
  /** Maximum number of retry attempts. @defaultValue 4 */
  retries?: number
  /** Whether to use exponential backoff for delays. @defaultValue true */
  isExponential?: boolean
}

/**
 * Cross-platform delay function that works in both Node.js and browser environments.
 * @param ms - Delay duration in milliseconds
 * @returns Promise that resolves after the specified delay
 * @internal
 */
async function delay(ms: number): Promise<void> {
  const isNode = typeof globalThis !== 'undefined' && globalThis.process?.versions?.node !== undefined

  if (isNode) {
    try {
      const { setTimeout } = await import('node:timers/promises')
      await setTimeout(ms)
      return
    } catch {
      // Fallback to browser setTimeout
    }
  }

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

/**
 * A robust retry mechanism with configurable timeout, retry count, and exponential backoff.
 *
 * @example
 * ```
 * const retry = new Retry({ retries: 3, timeout: 1000 });
 *
 * const result = await retry.execute(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * });
 *
 * if (result.isOk()) {
 *   console.log('Success:', result.value);
 * } else {
 *   console.error('Failed after retries:', result.error);
 * }
 * ```
 */
export class Retry {
  private readonly _timeout: number
  private readonly _retries: number
  private readonly _isExponential: boolean

  /**
   * Creates a new Retry instance with specified options.
   *
   * @param options - Configuration options for retry behavior
   * @param options.timeout - Delay between retries in milliseconds (default: 125)
   * @param options.retries - Maximum number of retry attempts (default: 4)
   * @param options.isExponential - Enable exponential backoff (default: true)
   *
   * @example
   * ```
   * // Create with default options
   * const retry = new Retry();
   *
   * // Create with custom options
   * const customRetry = new Retry({
   *   timeout: 500,
   *   retries: 5,
   *   isExponential: false
   * });
   * ```
   */
  constructor(options: RetryOptions = {}) {
    this._timeout = options.timeout ?? 125
    this._retries = options.retries ?? 4
    this._isExponential = options.isExponential ?? true
  }

  /**
   * Executes a function with retry logic, returning a Result object.
   *
   * @param invocation - The function to execute with retry logic
   * @param overrideOptions - Options to override instance settings for this execution
   * @returns Promise resolving to Result containing either success value or error
   *
   * @remarks
   * The function will retry on any thrown error, with configurable delay and exponential backoff.
   * If all retry attempts fail, returns an error Result with the last encountered error.
   *
   * @example
   * ```
   * const retry = new Retry();
   *
   * // Execute with instance settings
   * const result = await retry.execute(() => riskyOperation());
   *
   * // Execute with override settings
   * const result2 = await retry.execute(
   *   () => anotherOperation(),
   *   { retries: 2, timeout: 1000 }
   * );
   * ```
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

        await delay(_timeout)
        if (isExponential) _timeout *= 2
      }
    }

    if (lastError !== undefined) {
      return err(lastError)
    }

    throw new Error('Unexpected error occurred')
  }
}
