const enCollator = new Intl.Collator('en');

/**
 * Sort the keys of an Object.entries call
 * a and b are the result of Object.entries.
 * a[0] and b[0] are the keys
 * a[1] and b[1] are the values
 * This routine only sorts based on key name
 * @param {[string, any]} param0
 * @param {[string, any]} param1
 * @returns number
 */
export function sortPropertyEntities([a], [b]) {
  a = a[0] === '#' ? a.slice(1) : a;
  b = b[0] === '#' ? b.slice(1) : b;
  return enCollator.compare(a, b)
}
