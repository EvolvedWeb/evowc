const { TYPE_NORMALIZE, VALID_TYPES } = require("./enums");
const { decodeAttributeValue } = require("./attributeValue");
const escSingleQuote = require("./escSingleQuote");
const transformAttributeName = require("./transformAttributeName");
const TYPE_PARTS_RE = /^(?<type>\w+)(?:\<(?<objType>[a-zA-Z]\w+)\>)?(?:\(\s*(?<min>[^\s,)]+)?\s*,?\s*(?:\s*\s*(?<max>[^\s)]+)\s*)?\s*\))?\s*$/;

/**
 * @typedef Cpa
 * @prop {string | boolean} attrName - The name of this as an attribute
 * @prop {string} defaultValue - The default value for this CPA
 * @prop {object} elements - Holds all element related bindings, events and conditionals.
 * @prop {boolean} isPublic - Indicates if this propery is public or not.
 * @prop {number} [max] - Optional maximum value for types `int` and `num`
 * @prop {number} [min] - Optional minumum value for types `int` and `num`
 * @prop {string} objType - The type of Arrays and Objects
 * @prop {string} privatePropName - The name of the private property
 * @prop {string} propName - The name of this property
 * @prop {boolean} setHostAttr - `true` if the component attribute is also set when the property changes
 * @prop {string} type - The type of this property
 * @prop {string | boolean} value - The default value for this propery
 */

/**
 *
 * @param {string} attrName
 * @param {string} value
 * @param {boolean} setHostAttr
 * @param {string} tag - The name of the tag being processed for error output
 * @returns Cpa
 */
// eslint-disable-next-line complexity
function parseCpa(attrName, value, setHostAttr, isPublic, tag) {
  const propName = transformAttributeName(attrName);
  const privatePropName = isPublic ? `#_${propName}` : propName.replace(/#/, '#__');
  //console.log({ isPublic, attrName, propName, privatePropName });
  /** @type Cpa */
  const cpa = {
    attrName: isPublic ? attrName : false,
    defaultValue: "''",
    elements: {},
    isPublic,
    objType: '',
    privatePropName,
    propName,
    setHostAttr,
    type: 'str',
    value,
  };

  // @ts-ignore
  if (value !== true) {
    let [type1, ...rest] = value.split(':');
    const isVar = (rest[0] === 'var');
    if (isVar) {
      rest.shift();
    }
    const resp = TYPE_PARTS_RE.exec(type1);
    let { type, min, max, objType } = resp.groups;
    //console.log({ type, min, max });
    /** @type {*} */
    let val = decodeAttributeValue(rest.join(':'));
    if (!VALID_TYPES.includes(type)) {
      throw new TypeError(`\x1B[91mThe CPA \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was given an invalid type: \x1B[41m\x1B[97m"${type}"\x1B[91m\x1B[49m.\nValid types are: \x1B[93m${VALID_TYPES.map(t => `${t}`).join(', ')} \x1B[39m`);
    }
    if (isVar && val.length === 0) {
      throw new TypeError(`\x1B[91mThe CPA \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was not given a variable name.\x1B[39m`)
    }

    type = TYPE_NORMALIZE[type];

    if (!isVar) {
      /** @type {*} */
      let origVal = val;
      switch (type) {
        case 'num':
          origVal ||= 0;
          val = Number(origVal);
          if (Number.isNaN(val)) {
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the CPA \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been a number.\x1B[39m`);
          }
          break;

        case 'int':
          {
            origVal ||= '0';
            val = parseInt(origVal, 10);
            let temp = Number(origVal);
            if (Number.isNaN(val) || val !== temp) {
              throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the CPA \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been an integer.\x1B[39m`);
            }
          }
          break;

        case 'bigint':
          // TODO: 2023-04-06: Check for invalid values
          // eslint-disable-next-line
          val = BigInt(val);
          break;

        case 'bool':
          val = val.toLowerCase();
          val = ['true', '1'].includes(val) ? true : ['false', '0'].includes(val) ? false : null;
          if (val == null) {
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the CPA \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been either \x1B[97mtrue\x1B[91m or \x1B[97mfalse\x1B[91m.\x1B[39m`);
          }
          break

        case 'obj':
          val = val.trim();
          val = (val.length > 0) ? val : '{}';
          if (val[0] !== '{' || val.slice(-1) !== '}') {
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the CPA \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been an object.\x1B[39m`);
          }
          if (objType) {
            cpa.objType = objType
          }
          break;

        case 'arr':
          {
            val = (val.length > 0) ? val : '[]';
            let failed = false;
            try {
              const arr = JSON.parse(val)
              failed = !Array.isArray(arr);
            }

            catch (ex) {
              failed = true;
            }
            if (failed) {
              throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the CPA \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been an array.\x1B[39m`);
            }

            if (objType) {
              cpa.objType = objType
            }
          }
          break;

        case 'date':
          val = (val.length > 0) ? (isVar ? val : `new Date('${val}')`) : 'null';
          break;

        case 'str':
          val ??= '';
          break;

        case 'null':
          val = null;
          break;

        default:
          throw new Error(`Invalid property type "${type}" for "${attrName}".`);
      }
    }

    cpa.type = type;
    cpa.defaultValue = (!isVar && type === 'str') ? `'${escSingleQuote(val)}'` : val;
    if (['num', 'int'].includes(type)) {
      cpa.min = min;
      cpa.max = max;
    }
  }

  return cpa;
}

module.exports = parseCpa;