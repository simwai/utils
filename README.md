# @simwai/utils

![npm version](https://img.shields.io/npm/v/@simwai/utils?color=purple)

```A comprehensive TypeScript utility library for robust logging and retry mechanisms.```

This library provides flexible logging capabilities and a powerful retry utility, ensuring reliable and efficient application development.

## Highlights

- Multiple logger types: Console Logger and File Logger.
- Different log levels with color-coded console output.
- Configurable retry mechanism with exponential backoff.
- Comprehensive unit and integration tests using ava.
- Type-safe implementations for enhanced reliability using neverthrow.
- Super simple to use with clean dependencies

## Why @simwai/utils?

@simwai/utils is designed with simplicity in mind. It provides essential logging and retry mechanisms that are commonly needed in many projects, saving you the time and effort of reimplementing these functionalities repeatedly. With a clean and minimal API, it's easy to integrate and use in your projects without unnecessary complexity.

## Install

Install the utils library in your project:

```sh
npm install @simwai/utils
```

## Usage

Utilize the Console Logger:

```ts
import { ConsoleLogger } from '@simwai/utils';

const logger = new ConsoleLogger({ isTimeEnabled: true });
logger.log('This is a log message');
```

Implement File Logging:

```ts
import { FileLogger } from '@simwai/utils';

const logger = new FileLogger({ logFilePath: './logs/app.log' });
logger.error('An error occurred');
```

Employ the Retry mechanism:

```ts
import { Retry } from '@simwai/utils';

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

## Error Handling

The Retry mechanism uses the `neverthrow` library to handle errors in a type-safe manner:

```typescript
import { Retry } from '@simwai/utils';

const result = await Retry.execute(
  async () => {
    // Your potentially failing operation
    if (Math.random() < 0.5) throw new Error('Random failure');
    return 'Success';
  },
  { timeout: 200, retries: 3 }
);

if (result.isOk()) {
  console.log('Operation succeeded:', result.value);
} else {
  console.error('Operation failed:', result.error);
}
```

## Browser Compatibility

@simwai/utils is primarily designed for Node.js environments. While the ConsoleLogger can work in modern browsers, the FileLogger is not suitable for browser use due to file system access restrictions. The Retry mechanism is compatible with both Node.js and browser environments.
