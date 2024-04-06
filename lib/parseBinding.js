import { transformAttributeName } from './transformAttributeName.js';

export const BINDING_PARSE_RE = /^\s*(?<srcVar>(?<srcObj>[^\.|]+)(?:\.(?<srcField>[^|]+))?)(?:\s*\|\s*(?<pipes>[^\n]+))?\s*$/;
export const PROPERTY_TYPES = {
  ARIA: 'aria',
  ATTR: 'attr',
  DATA: 'data',
  PROP: 'prop'
}
export const PROPERTY_NAME_TRANSLATE = {
  'class': 'className',
  'text': 'textContent',
  'html': 'innerHTML'
};
export const PROPERTY_NAME_TRANSLATE_KEYS = Object.keys(PROPERTY_NAME_TRANSLATE);
export const ATTRIBUTE_BASED_PROPS = [ // TODO: Need to define all of these
  'accept',
  'for',
  'style'
];

/**
 *
 * @param {string} val
 * @param {object} element
 * @param {string} attribute
 * @param {string} type The type of binding
 * @param {string[]} availableVars The available variables for this element
 * @param {import('./Component.js').ForLoopStackItem[]} forLoopStack - The event to add the person to.
 * @returns
 */
export function parseBinding(val, element, attribute, type, availableVars, forLoopStack) {
  const inForLoop = !!forLoopStack.length;
  let property = transformAttributeName(attribute);
  let forLoopItem = forLoopStack[0] || {
    forElementName: '',
    indexName: '',
    itemName: '',
    loopItemHandlerName: ''
  };
  const resp = BINDING_PARSE_RE.exec(val);
  if (!resp) {
    throw new Error(`Invalid binding value "${val}"`);
  }

  /** @type {string[]} */
  const forVariables = forLoopStack.reduce((acc, item) => {
    acc.push(item.indexName, item.itemName);
    return acc;
  }, []);

  let { srcVar, srcObj, srcField, pipes } = resp.groups;

  if (srcVar === srcObj && srcField == null) {
    srcField = srcVar;
    srcObj = null;
  }

  let inputSetter;
  let setterProp = 'newVal';

  if (forVariables.includes(srcField)) {
    srcVar = srcObj = srcField;
    forLoopItem = forLoopStack.find(item => [item.indexName, item.itemName].includes(srcField));
  }
  else {
    if(!srcObj) {
      srcObj = 'this';
    }

    if (!availableVars.includes(srcObj) && srcObj !== 'this') {
      setterProp = `newVal.${srcField}`;
      srcField = `${srcObj}.${srcField}`;
      srcObj = 'this';
    }
    srcVar = `${srcObj}.${srcField}`;
    const srcCompare = `${srcObj}.${srcField.split('.')[0]}`;

    // Make sure that this variable is available for use.
    if (srcObj === 'this') {
      if (!availableVars.includes(srcCompare)) {
        return false;
      }
    }
    else {
      if (!availableVars.includes(srcObj)) {
        return false;
      }
    }
  }

  if (inForLoop) {
    setterProp = srcVar;
  }

  if (property === 'checked') {
    inputSetter = `${srcVar} = evt.target.checked;`;
    if (srcObj === 'this') {
      if (srcField.includes('.')) {
        const [valueObj, valueProp, valueField] = srcVar.split('.');
        // May need structuredClone here
        inputSetter = `this.${valueProp} = { ...${valueObj}.${valueProp}, ${valueField}: evt.target.checked };`;
      }
    }
    else {
      inputSetter += `\n    const els = this.loopItemEls('${forLoopItem.forElementName}', ${forLoopItem.indexName});`;
      inputSetter += `\n    this.${forLoopItem.loopItemHandlerName}(els, ${forLoopItem.indexName}, ${forLoopItem.itemName});`;
    }
  }
  else if (property === 'value') {
    inputSetter = `${srcVar} = evt.target.value;`;
    if (srcObj === 'this') {
      if (srcField.includes('.')) {
        const [valueObj, valueProp, valueField] = srcVar.split('.');
        // May need structuredClone here
        inputSetter = `this.${valueProp} = { ...${valueObj}.${valueProp}, ${valueField}: evt.target.value };`;
      }
    }
    else {
      inputSetter += `\n    const els = this.loopItemEls('${forLoopItem.forElementName}', ${forLoopItem.indexName});`;
      inputSetter += `\n    this.${forLoopItem.loopItemHandlerName}(els, ${forLoopItem.indexName}, ${forLoopItem.itemName});`;
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

  let add2WayBinding = (type === PROPERTY_TYPES.PROP && ['value', 'checked'].includes(property));

  const types = Object.values(PROPERTY_TYPES);
  if (!types.includes(type)) {
      throw new Error(`Invalid Data Type "${type}". Valid types are: "${types.join('","')}"`);
  }

  // TODO: Figure out is this needs to change based on either `type` or `prop`
  let defaultVal;

  let binding = {
    add2WayBinding,
    attribute,
    default: defaultVal,
    inForLoop,
    inputSetter,
    forLoopItem,
    pipes,
    prop: property,
    setterProp,
    srcField,
    srcObj,
    srcVar,
    type
  };
  return binding;
}
