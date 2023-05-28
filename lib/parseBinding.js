const transformAttributeName = require('./transformAttributeName');

const BINDING_PARSE_RE = /^\s*(?<srcVar>(?<srcObj>[^\.|]+)(?:\.(?<srcField>[^|]+))?)(?:\s*\|\s*(?<pipes>[^\n]+))?\s*$/;
const DATA_TYPES = {
  PROP: 'prop',
  ATTR: 'attr',
  DATA: 'data'
}
const PROPERTY_NAME_TRANSLATE = {
  'class': 'className',
  'text': 'textContent',
  'html': 'innerHTML'
};
const PROPERTY_NAME_TRANSLATE_KEYS = Object.keys(PROPERTY_NAME_TRANSLATE);
const ATTRIBUTE_BASED_PROPS = [ // TODO: Need to define all of these
  'accept',
  'for',
  'style'
];

/**
 * 
 * @param {string} val 
 * @param {object} element 
 * @param {string} property 
 * @param {string} type 
 * @returns 
 */
function parseBinding(val, element, attribute, type) {
  property = transformAttributeName(attribute);
  const resp = BINDING_PARSE_RE.exec(val);
  if (!resp) {
    throw new Error(`Invlid binding value "${val}"`);
  }

  let { srcVar, srcObj, srcField, pipes } = resp.groups;
  if (srcVar === srcObj && srcField == null) {
    srcField = srcVar;
    srcObj = null;
  }
  if(!srcObj) {
    srcObj = 'this';
  }
  srcVar = `${srcObj}.${srcField}`;

  if(pipes) {
    pipes = pipes.split('|').map(i => {
      if (i[0] === '^') {
        // This is an imported pipe function name
        return i.slice(1).trim();
      }

      // This is a class based pipe function name
      return `this.${i.trim()}`;
    });
  }

  if (type === DATA_TYPES.PROP) {
    // Check to see if we need to translate the property name
    if (PROPERTY_NAME_TRANSLATE_KEYS.includes(property)) {
      // Change the property name: class --> className, etc.
      property = PROPERTY_NAME_TRANSLATE[property];
    }
    else if (ATTRIBUTE_BASED_PROPS.includes(property)) {
      type = DATA_TYPES.ATTR;
    }
  }

  let add2WayBinding = (type === DATA_TYPES.PROP && property === 'value');

  const types = Object.values(DATA_TYPES);
  if (!types.includes(type)) {
      throw new Error(`Invalid Data Type "${type}". Valid types are: "${types.join('","')}"`);
  }
  return { attribute, prop: property, srcVar, srcObj, srcField, type, add2WayBinding, pipes };
}

module.exports = parseBinding;
module.exports.DATA_TYPES = DATA_TYPES;