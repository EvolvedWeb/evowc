const SNAKE_TO_INTRA_RE = /\-[\w]/g;

/**
 * Convert from a snake case attribute name to a camel case variable name
 * 
 * my-left-foot becomes myLeftFoot
 * 
 * @param {string} name 
 * @returns string
 */
const transformAttributeName = name => name.replace(SNAKE_TO_INTRA_RE, val => val[1].toUpperCase());

module.exports = transformAttributeName;