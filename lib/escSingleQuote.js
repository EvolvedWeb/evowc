/**
 * escape a single quote to be used in a string
 *
 * "'" becomes "\\\'"
 *
 * @param {string} str - The string to be escaped
 * @returns sring
 */
const escSingleQuote = (str) => str.replace(/'/g, '\\\'');

module.exports = escSingleQuote;