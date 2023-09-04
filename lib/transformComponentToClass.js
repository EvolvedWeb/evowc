const transformAttributeName = require('./transformAttributeName');

/**
 * converts a web component tag name to a web component class name
 *
 * my-thing becomes MyThingElement
 *
 * @param {string} name
 * @returns string
 */
function transformComponentToClass(name) {
  let temp = transformAttributeName(name);
  return temp[0].toUpperCase() + temp.slice(1) + 'Element';
}

module.exports = transformComponentToClass;