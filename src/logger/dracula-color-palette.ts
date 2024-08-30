import chalk from 'chalk'

// Dracula-inspired color shades
enum DraculaColors {
  Log = '#f8f8f2', // Light foreground
  Warn = '#f1fa8c', // Yellow
  Error = '#ff5555', // Red
  Trace = '#bd93f9', // Purple
}

export const DraculaColorPalette = {
  log: chalk.hex(DraculaColors.Log),
  warn: chalk.hex(DraculaColors.Warn),
  error: chalk.hex(DraculaColors.Error),
  trace: chalk.hex(DraculaColors.Trace),
}
