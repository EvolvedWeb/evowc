const { TYPE_NORMALIZE, VALID_TYPES } = require("./enums");
const escSingleQuote = require("./escSingleQuote");
const transformAttributeName = require("./transformAttributeName");
const TYPE_PARTS_RE = /^(?<type>\w+)(?:\(\s*(?<min>[^\s,)]+)?\s*(?:\s*,\s*(?<max>[^\s)]+)\s*)?\s*\))?\s*$/;

/**
 * @typedef iPda
 * @prop {string} value - The default value for this propery
 * @prop {string} type - The type of this property
 * @prop {string} propName - The name of this property
 * @prop {string} privatePropName - The name of the private property
 * @prop {string} attrName - The name of this as an attribute
 * @prop {boolean} setHostAttr - `true` if the component attribute is also set when the property changes
 * @prop {object} elements - Holds all element related bindings, events and conditionals.
 * @prop {boolean} isPublic - Indicates if this propery is public or not.
 * @prop {number} [min] - Optional minumum value for types `int` and `num`
 * @prop {number} [max] - Optional maximum value for types `int` and `num`
 */

/**
 * 
 * @param {string} attrName 
 * @param {string} value 
 * @param {boolean} setHostAttr 
 * @param {string} tag - The name of the tag being processed for error output
 * @returns iPda
 */
function parsePda(attrName, value, setHostAttr, isPublic, tag) {
  const propName = transformAttributeName(attrName);
  const privatePropName = isPublic ? `#${propName}` : propName.replace(/#/, '#_');
  //console.log({ isPublic, attrName, propName, privatePropName });
  /** @type iPda */
  const pda = {
    attrName: isPublic ? attrName : false,
    propName,
    privatePropName,
    defaultValue: "''",
    type: 'str',
    setHostAttr,
    elements: {},
    isPublic
  };

  if (value !== true) {
    let [type1, ...rest] = value.split(':');
    const isVar = (rest[0] === 'var');
    if (isVar) {
      rest.shift();
    }
    const resp = TYPE_PARTS_RE.exec(type1);
    let { type, min, max } = resp.groups;
    //console.log({ type, min, max });
    let val = decodeURIComponent(rest.join(':'));
    if (!VALID_TYPES.includes(type)) {
      throw new TypeError(`\x1B[91mThe property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was given an invalid type: \x1B[41m\x1B[97m"${type}"\x1B[91m\x1B[49m.\nValid types are: \x1B[93m${VALID_TYPES.map(t => `${t}`).join(', ')} \x1B[39m`);
    }
    if (isVar && val.length === 0) {
      throw new TypeError(`\x1B[91mThe property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was not given a variable name.\x1B[39m`)
    }

    type = TYPE_NORMALIZE[type];

    if (!isVar) {
      const origVal = val;
      switch (type) {
        case 'num':
          val = Number(val ?? 0);
          if (Number.isNaN(val)) {
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been a number.\x1B[39m`);
          }
          break;

        case 'int':
          val = parseInt(val ?? 0, 10);
          let temp = Number(origVal);
          if (Number.isNaN(val) || val !== temp) {
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been an integer.\x1B[39m`);
          }
          break;

        case 'bigint':
          // TODO: 2023-04-06: Check for invalid values
          val = BigInt(val);
          break;

        case 'bool':
          val = val.toLowerCase();
          val = ['true', '1'].includes(val) ? true : ['false', '0'].includes(val) ? false : null;
          if (val == null) {
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been either \x1B[97mtrue\x1B[91m or \x1B[97mfalse\x1B[91m.\x1B[39m`);
          }
          break

        case 'obj':
          val = val.trim();
          val = (val.length > 0) ? val : '{}';
          if (val[0] != '{' || val.slice(-1) != '}') {
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been an object.\x1B[39m`);
          }
          break;

        case 'arr':
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
            throw new TypeError(`\x1B[91mThe value \x1B[97m(${origVal})\x1B[91m for the property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was invalid and should have been an array.\x1B[39m`);
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
          throw new Error(`Invalid property type "${type}" for "${attr}".`);
      }
    }

    pda.type = type;
    pda.defaultValue = (!isVar && type === 'str') ? `'${escSingleQuote(val)}'` : val;
    if (['num', 'int'].includes(type)) {
      pda.min = min;
      pda.max = max;
    }
  }

  return pda;
}

module.exports = parsePda;