/**
 * Encode and Decode attribute values
 */
import { ATTRIBUTE_ENCODE_RE, ATTRIBUTE_ENCODING_LIST, ATTRIBUTE_DECODING_LIST } from './enums.js';
const ENTITY_RE = /&[#\w\d]+;/g;
/**
 * Convert the value of an attribute into either an empty string (for `true`) or into a
 * properly encoded attribute value
 *
 * @param {string} attrVal - the value of an attribute
 * @returns string - the decoded attribute value
 */
export function decodeAttributeValue(attrVal) {
  if (typeof attrVal === 'string') {
    attrVal = attrVal.replace(ENTITY_RE, (key) => {
      key = key.toLowerCase();
      let val;
      if (key.startsWith('&#x')) {
        val = parseInt(key.slice(3, -1), 16);
      }
      else if (key.startsWith('&#')) {
        val = parseInt(key.slice(2, -1), 10);
      }
      else {
        return ATTRIBUTE_DECODING_LIST[key];
      }

      return String.fromCharCode(val);
    });
  }

  return attrVal;
}
/**
 * Convert the value of an attribute into either an empty string (for `true`) or into a
 * properly encoded attribute value
 *
 * @param {string | boolean} attrVal - the value of an attribute
 * @returns string - The encoded attribute value
 */
export function encodeAttributeValue(attrVal) {
  if(attrVal === true) {
    return '';
  }
  if (typeof attrVal === 'string') {
    return `="${attrVal.replace(ATTRIBUTE_ENCODE_RE, key => ATTRIBUTE_ENCODING_LIST[key])}"`;
  }

  return attrVal;
}
