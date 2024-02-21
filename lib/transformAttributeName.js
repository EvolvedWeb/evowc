export const KEBAB_TO_CAMEL_RE = /-+([\p{L}\w])/gu; // Better international handling

/**
 * Convert from a kebab case attribute name to a camel case variable name
 * "my-left-foot" becomes "myLeftFoot"
 * @param {string} name - name of the attribute
 * @returns string
 */
export const transformAttributeName = name => name.replace(KEBAB_TO_CAMEL_RE, (match, p1) => p1.toUpperCase());
