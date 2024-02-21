// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';

const SPLIT_RE = /\*+/;
const REPLACE1_RE = /([.+^$()|[\]\\])/g;
const REPLACE2_RE = /\{([^\}]+)\}/g;

/**
 * Get all files in the given directory and sub-directories that match the given pattern.
 * @param {string} cwd - The current working directory.
 * @param {string} pattern - The glob-like pattern to match files against.
 * @returns {string[]} - An array of file paths that match the pattern.
 */
 // pattern only supports the following
 // • An optional "**/" at the beginning
 // • "*" to represent zero or more of any character
 // • "?" to represent one of any character
 // • "{,}" to represent a comma separated list of options.
 //   • "*.{htm,html}" will find files with an extension of either "htm" or "html"
export function globFileList(cwd, pattern) {
  const isDeep = pattern.startsWith('**/');
  if (isDeep) {
    pattern = pattern.slice(3);
  }
  let regexPattern = pattern.split(SPLIT_RE).map(p => p.replace(REPLACE1_RE, '\\$1')).join('.*')
    .replace('?', '.')
    // @ts-ignore
    .replace(REPLACE2_RE, (match, options) => `(${options.split(',').join('|')})`);
  const patternRe = new RegExp('^' + regexPattern + '$');
  let files = [];

  // Helper function to recursively find files that match the pattern
  function findFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (isDeep) {
          findFiles(fullPath);
        }
      } else if (patternRe.test(entry.name.replace(/\\/g, '/'))) {
        files.push(path.relative(cwd, fullPath));
      }
    }
  }

  findFiles(cwd);
  return files;
}
