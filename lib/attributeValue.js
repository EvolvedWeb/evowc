const { ATTRIBUTE_ENCODE_RE, ATTRIBUTE_ENCODING_LIST, ATTRIBUTE_DECODE_RE, ATTRIBUTE_DECODING_LIST } = require("./enums");
const ENTITY_RE = /&[#\w\d]+;/g;
/**
 * Convert the value of an attribute into either an empty string (for `true`) or into a
 * properly encoded attribute value
 *
 * @param {string} attrVal - the value of an attribute
 * @returns string
 */
function decodeAttributeValue(attrVal) {
  if (attrVal) {
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
 * @param {string} attrVal - the value of an attribute
 * @returns string
 */
function encodeAttributeValue(attrVal) {
  return attrVal === true
    ? ''
    : `="${attrVal.replace(ATTRIBUTE_ENCODE_RE, key => ATTRIBUTE_ENCODING_LIST[key])}"`;
}

module.exports = {
  decodeAttributeValue,
  encodeAttributeValue
};