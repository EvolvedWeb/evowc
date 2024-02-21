import { getDataType } from './getDataType.js';

export function processProperties(useEls, usesComments, properties) {
  let privateClassFields = '';
  let setDefaultValues = '';
  let observedAttributes = '';

  if (useEls) {
    privateClassFields += `
  /** @type {Object<string, HTMLElement>} */ #els = {};`;
  }
  if (usesComments) {
    privateClassFields += `
  /** @type {Object<string, Comment>} */ #comments = {};`;
  }

  const props = Object.values(properties);
  if (props.length > 0) {
    privateClassFields += '\n';
    privateClassFields += props.map(item => `  /** @type {${getDataType(item.type, item.objType)}} */ ${item.privatePropName};`).join('\n');

    setDefaultValues = '\n\n    // Initialize component with default values\n' +
      props.map(item => `    this.${item.propName} ??= ${item.defaultValue};`).join('\n');

    observedAttributes =
      props.filter(item => item.isPublic).map(item => `'${item.attrName}'`).join(', ');
  }

  privateClassFields &&= `\n  // Internal properties${privateClassFields}\n`

  return {
    privateClassFields,
    setDefaultValues,
    observedAttributes
  };
}
