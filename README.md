# ts-template

> A comprehensive TypeScript utility library for robust logging and retry mechanisms.

This library provides flexible logging capabilities and a powerful retry utility, ensuring reliable and efficient application development.

## Highlights

- Multiple logger types: Console Logger and File Logger.
- Customizable log levels with color-coded console output.
- Configurable retry mechanism with exponential backoff.
- Comprehensive unit and integration tests using ava.
- Type-safe implementations for enhanced reliability using neverthrow.
- Super simple to use with clean dependencies

## Install

Install the utils library in your project:

```sh
npm install @simwai/ts-utils
```

## Usage

Utilize the Console Logger:

```ts
import { ConsoleLogger } from '@simwai/ts-utils';

const logger = new ConsoleLogger({ isTimeEnabled: true });
logger.log('This is a log message');
```

Implement File Logging:

```ts
import { FileLogger } from '@simwai/ts-utils';

const logger = new FileLogger({ logFilePath: './logs/app.log' });
logger.error('An error occurred');
```

Employ the Retry mechanism:

```ts
import { Retry } from '@simwai/ts-utils';

// Async operation
const asyncResult = await Retry.execute(
  async () => { /* Your async operation */ },
  { timeout: 200, retries: 3 }
);

// Sync operation
const syncResult = await Retry.execute(
  () => { /* Your sync operation */ },
  { timeout: 200, retries: 3 }
);

// Results are wrapped in a neverthrow Result object
if (asyncResult.isOk()) {
  console.log('Operation succeeded:', asyncResult.value);
} else {
  console.error('Operation failed:', asyncResult.error);
}
```
