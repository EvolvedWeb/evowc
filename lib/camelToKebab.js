const CAMEL_RE = /\p{Lu}/gu; // As international as I can make it
// const CAMEL_RE = /[A-Z]/g; // Just English letters

/**
 * Convert a camel case name to a kebab case name
 *
 * @param {string} str
 * @returns string
 */
export const camelToKebab = (str) => str.replace(CAMEL_RE, (key) => `-${key.toLowerCase()}`);
