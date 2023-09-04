const { DATA_TYPES } = require("./enums");
/**
 * Convert an internal type into a JSDoc type
 * @param {string} type - The internal type
 * @param {string} objType - the Object type for Array and Object
 * @returns string
 */
function getDataType(type, objType) {
  let resp = DATA_TYPES[type] || 'any';
  if (objType) {
    if (resp === 'Array') {
      resp = `${objType}[]`;
    }
    else if (resp === 'Object') {
      resp = objType;
    }
  }

  return resp;
}

module.exports = getDataType;