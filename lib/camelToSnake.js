const CAMEL_RE = /[A-Z]/g;

/**
 * Convert a camel case name to a snake case name
 *
 * @param {string} str
 * @returns string
 */
const camelToSnake = (str) => str.replace(CAMEL_RE, (key) => `-${key.toLowerCase()}`);

module.exports = camelToSnake;