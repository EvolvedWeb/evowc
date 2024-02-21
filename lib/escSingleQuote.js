/**
 * escape a single quote to be used in a string
 *
 * "\\" becomes "\\\\"
 * "'" becomes "\\\'"
 *
 * @param {string} str - The string to be escaped
 * @returns string - The escaped string
 */
export const escSingleQuote = (str) => str.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
