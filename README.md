# @simwai/utils

<p align="center">
  <img src="https://img.shields.io/npm/v/%40simwai/utils?color=%237945f7" />
  <img src="https://img.shields.io/node/v/%40simwai/utils?color=%237945f7" />
  <img src="https://img.shields.io/bundlephobia/minzip/%40simwai/utils?color=%237945f7" />
  <img src="https://img.shields.io/badge/code_style-XO-%237945f7?logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/built_with-unbuild-%237945f7" />
  <img src="https://img.shields.io/badge/language-TypeScript-%237945f7?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/ide-VS%20Code-%237945f7?logo=visualstudiocode&logoColor=white" />
</p>

Stop reinventing error handling and logging. Get type-safe, battle-tested utilities that work everywhere.

## 🚀 Quick Start

```ts
import utils from '@simwai/utils'

// Beautiful logging with colors and timestamps
utils.logger.log('Application started')
utils.logger.error('Something went wrong')

// Resilient operations with automatic retries
const result = await utils.retry.execute(async () => {
  const response = await fetch('/api/data')
  if (!response.ok) throw new Error('API failed')
  return response.json()
})

if (result.isOk()) {
  console.log('Success:', result.value)
} else {
  console.log('Failed after retries:', result.error)
}
```

## Problems @simwai/utils Solves

❌ **Manual retry logic** scattered across your codebase

❌ **Inconsistent error handling** for async operations

❌ **Plain console.log** lacks context, colors, and timestamps

❌ **Environment-specific bugs** between Node.js and browser code

✅ **Standardized utilities** with exponential backoff and type safety

✅ **Universal compatibility** - one import works everywhere

✅ **Beautiful output** with Dracula-inspired colors

✅ **Zero configuration** - works perfectly out of the box

## 📦 Installation

```sh
npm install @simwai/utils
```

## 🎯 Core Features

### Cross-Platform Logging

```ts
import { ConsoleLogger } from '@simwai/utils'

const logger = new ConsoleLogger({ isTimeEnabled: true })
logger.log('Info message')     // Light gray with timestamp
logger.warn('Warning')         // Yellow
logger.error('Error occurred') // Red
```

### File Logging (Node.js only)

```ts
import { FileLogger } from '@simwai/utils'

const fileLogger = new FileLogger({ logFilePath: './logs/app.log' })
fileLogger.error('Persistent error logging')
```

### Intelligent Retry with Type Safety

```ts
import { Retry } from '@simwai/utils'

const retry = new Retry({
  timeout: 1000,      // Start with 1 second
  retries: 3,         // Try 3 times
  isExponential: true // 1s → 2s → 4s
})

// Type-safe results with neverthrow
const result = await retry.execute(async () => {
  // Your potentially failing operation
  return await riskyApiCall()
})
```

## 🌐 Browser Compatibility

**Supported Environments:**

- ✅ Node.js 18+
- ✅ Modern browsers (Chrome 80+, Firefox 72+, Safari 13+, Edge 80+)
- ✅ ES2020+ environments
- ❌ Internet Explorer (uses modern timer APIs)

**Automatic Environment Detection:**

- **Node.js**: Uses native timers, includes FileLogger (~44KB + external deps)
- **Browser**: Uses setTimeout, excludes FileLogger (~330KB self-contained)

## 📚 API Reference

### ConsoleLogger

```ts
interface ConsoleLoggerOptions {
  isTimeEnabled?: boolean  // Show timestamps (default: false)
}

const logger = new ConsoleLogger({ isTimeEnabled: true })
logger.log('message')    // Info level
logger.warn('message')   // Warning level
logger.error('message')  // Error level
logger.trace('message')  // Debug level
```

### Retry

```ts
interface RetryOptions {
  timeout?: number        // Delay between retries (default: 125ms)
  retries?: number        // Max retry attempts (default: 4)
  isExponential?: boolean // Use exponential backoff (default: true)
}

const retry = new Retry(options)
const result = await retry.execute(operation, overrideOptions?)
```

### Type-Safe Error Handling

```ts
// Results use neverthrow's Result type
if (result.isOk()) {
  // TypeScript knows this is your success type
  console.log(result.value)
} else {
  // TypeScript knows this is an Error
  console.error(result.error.message)
}
```

## 🎨 Dracula Color Palette

Consistent, beautiful colors across all environments:

- 🤍 **Log**: `#f8f8f2` (Light foreground)
- 🟡 **Warn**: `#f1fa8c` (Yellow)
- 🔴 **Error**: `#ff5555` (Red)
- 🟣 **Trace**: `#bd93f9` (Purple)

## Bundle Size Considerations

| Environment | Size | Dependencies | Justification |
|-------------|------|--------------|---------------|
| **Node.js** | ~44KB | External | Optimal - deps installed separately |
| **Browser** | ~330KB | Bundled | Includes Luxon (dates) + Chalk (colors) |

**Why 330KB for browser?**

- Luxon (~200KB): Full-featured DateTime with timezone support
- Chalk (~30KB): Cross-platform color support
- **Alternative**: Use basic `console.log` if bundle size is critical

## When to Use vs Alternatives

### ✅ Use @simwai/utils when

- Building libraries that work in Node.js AND browsers
- Need consistent retry logic across projects
- Want type-safe error handling
- Prefer beautiful, structured logging

### 🤔 Consider alternatives when

- Bundle size is absolutely critical (<50KB total)
- Only need basic `console.log` functionality
- Working in a single environment only
- Have existing logging infrastructure

<details>
<summary>🏗️ Advanced: Cross-Platform Architecture</summary>

### Intelligent Build System

@simwai/utils uses **unbuild** to create environment-specific builds:

```
build/
├── node/           # Node.js optimized
│   ├── index.cjs   # CommonJS format
│   ├── index.mjs   # ESM format
│   └── index.d.ts  # TypeScript definitions
└── browser/        # Browser optimized
    ├── index.mjs   # ESM only
    └── index.d.ts  # Browser-specific types
```

**Package.json Conditional Exports:**

```json
{
  "exports": {
    ".": {
      "browser": "./build/browser/index.mjs",
      "node": {
        "require": "./build/node/index.cjs",
        "import": "./build/node/index.mjs"
      }
    }
  }
}
```

**Runtime Detection:**

- Uses `node:timers/promises` in Node.js for optimal performance
- Falls back to `setTimeout` in browsers automatically
- FileLogger completely excluded from browser builds

</details>

<details>
<summary>🔧 Development Stack</summary>

Built with modern tooling for quality and maintainability:

- **🎨 XO**: Strict linting with Prettier integration
- **📦 unbuild**: Cross-platform bundling with Rollup
- **🔷 TypeScript**: Full type safety and modern features
- **🧪 Ava**: Fast test runner with TypeScript support
- **📋 neverthrow**: Functional error handling without exceptions

</details>

---

**Ready to eliminate boilerplate and build more reliable applications?**

```sh
npm install @simwai/utils
```

*Built with ❤️ for developers who value reliability and great developer experience.*
