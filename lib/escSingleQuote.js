/**
 * escape a single quote to be used in a string
 *
 * "\\" becomes "\\\\"
 * "'" becomes "\\\'"
 *
 * @param {string} str - The string to be escaped
 * @returns sring - The escaped string
 */
const escSingleQuote = (str) => str.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');

module.exports = escSingleQuote;