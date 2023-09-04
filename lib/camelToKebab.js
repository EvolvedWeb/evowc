const CAMEL_RE = /[A-Z]/g;

/**
 * Convert a camel case name to a kebab case name
 *
 * @param {string} str
 * @returns string
 */
const camelToKebab = (str) => str.replace(CAMEL_RE, (key) => `-${key.toLowerCase()}`);

module.exports = camelToKebab;