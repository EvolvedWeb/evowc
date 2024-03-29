import { DATA_TYPES } from './enums.js';
/**
 * Convert an internal type into a JSDoc type
 * @param {string} type - The internal type
 * @param {string} objType - the Object type for Array and Object
 * @returns string
 */
export function getDataType(type, objType) {
  let resp = DATA_TYPES[type] || 'any';
  if (objType) {
    if (resp === 'Array') {
      resp = `${objType}[]`;
    }
    else if (resp === 'Object') {
      resp = objType;
    }
    else {
      throw new Error(`Object Names are not valid for "${type}" data type.`);
    }
  }

  return resp;
}
