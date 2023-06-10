const transformAttributeName = require('./transformAttributeName');

const BINDING_PARSE_RE = /^\s*(?<srcVar>(?<srcObj>[^\.|]+)(?:\.(?<srcField>[^|]+))?)(?:\s*\|\s*(?<pipes>[^\n]+))?\s*$/;
const PROPERTY_TYPES = {
  ARIA: 'aria',
  ATTR: 'attr',
  DATA: 'data',
  PROP: 'prop'
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

let loopHandlerIndex = 0;

/**
 * 
 * @param {string} val 
 * @param {object} element 
 * @param {string} attribute 
 * @param {string} type The type of binding
 * @param {string[]} availableVars The available variables for this element
 * @param {string} inForLoop
 * @param {string} forElementName
 * @returns 
 */
function parseBinding(val, element, attribute, type, availableVars, inForLoop, forElementName, loopItemHandlerName) {
  let property = transformAttributeName(attribute);
  const resp = BINDING_PARSE_RE.exec(val);
  if (!resp) {
    throw new Error(`Invalid binding value "${val}"`);
  }

  let { srcVar, srcObj, srcField, pipes } = resp.groups;

  if (srcVar === srcObj && srcField == null) {
    srcField = srcVar;
    srcObj = null;
  }
  if(!srcObj) {
    srcObj = 'this';
  }
  let inputSetter;
  let setterProp = 'newVal';

  if (!availableVars.includes(srcObj) && srcObj !== 'this') {
    setterProp = `newVal.${srcField}`;
    srcField = `${srcObj}.${srcField}`;
    srcObj = 'this';
  }
  srcVar = `${srcObj}.${srcField}`;

  if (inForLoop) {
    setterProp = srcVar;
  }

  if (property === 'value') {
    inputSetter = `${srcVar} = evt.target.value;`;
    if (srcObj === 'this') {
      if (srcField.includes('.')) {
        const [valueObj, valueProp, valueField] = srcVar.split('.');
        inputSetter = `this.${valueProp} = { ...${valueObj}.${valueProp}, ${valueField}: evt.target.value };`;
      }
      else {
        inputSetter = `${srcVar} = evt.target.value;`;
      }
    }
    else {
      inputSetter = `${srcVar} = evt.target.value;`;
      inputSetter += `\n    const els = this.loopItemEls('${forElementName}', index);`;
      inputSetter += `\n    this.${loopItemHandlerName}(els, index, item);`;
    }
  }

  if(pipes) {
    // @ts-ignore
    pipes = pipes.split('|').map(i => {
      if (i[0] === '^') {
        // This is an imported pipe function name
        return i.slice(1).trim();
      }

      // This is a class based pipe function name
      return `this.${i.trim()}`;
    });
  }

  if (type === PROPERTY_TYPES.PROP) {
    // Check to see if we need to translate the property name
    if (PROPERTY_NAME_TRANSLATE_KEYS.includes(property)) {
      // Change the property name: class --> className, etc.
      property = PROPERTY_NAME_TRANSLATE[property];
    }
    else if (ATTRIBUTE_BASED_PROPS.includes(property)) {
      type = PROPERTY_TYPES.ATTR;
    }
  }

  let add2WayBinding = (type === PROPERTY_TYPES.PROP && property === 'value');

  const types = Object.values(PROPERTY_TYPES);
  if (!types.includes(type)) {
      throw new Error(`Invalid Data Type "${type}". Valid types are: "${types.join('","')}"`);
  }

  // TODO: Figure out is this needs to change based on either `type` or `prop`
  let defaultVal = undefined;

  let binding = {
    add2WayBinding,
    attribute,
    default: defaultVal,
    inForLoop,
    inputSetter,
    loopItemHandlerName,
    pipes,
    prop: property,
    setterProp,
    srcField,
    srcObj,
    srcVar,
    type
  };
  //console.log(binding);
  return binding;
}

module.exports = parseBinding;
module.exports.PROPERTY_TYPES = PROPERTY_TYPES;