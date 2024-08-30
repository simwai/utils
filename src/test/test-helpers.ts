/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable unicorn/no-static-only-class */

/**
 * A utility class for test helpers.
 */
export class TestHelpers {
  /**
   * Checks if a given string contains an ANSI color code for a specified hex color.
   *
   * @param {string} string_ - The string to check for the ANSI color code.
   * @param {string} hexColor - The hex color code to look for in the string.
   * @returns {boolean} - Returns true if the string contains the ANSI color code, otherwise false.
   */
  static hasAnsiColor(string_: string, hexColor: string): boolean {
    const [r, g, b] = hexColor.match(/\w\w/g)!.map((x) => Number.parseInt(x, 16))
    const ansiColorCode = `\u001B[38;2;${r};${g};${b}m`
    return string_.includes(ansiColorCode)
  }
}
