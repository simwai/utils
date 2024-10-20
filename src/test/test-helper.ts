/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable unicorn/no-static-only-class */

import * as fs from 'fs';
import * as path from 'path';

/**
 * A utility class for test helpers.
 */
export class TestHelper {
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

  /**
   * Cleans up the test folder by removing all files and the folder itself.
   *
   * @param {object} t - The test context object.
   * @throws {Error} If the cleanup process fails.
   */
  static cleanUp = (testFolder: string ): void => {
    try {
      if (fs.existsSync(testFolder)) {
        const files = fs.readdirSync(testFolder)
        for (const file of files) {
          fs.unlinkSync(path.join(testFolder, file))
        }
        fs.rmdirSync(testFolder)
      }
    } catch (error: unknown) {
      console.error(`Failed to clean up the test folder: `, error)
      throw error // Re-throw the error to fail the test setup
    }
  }
}
