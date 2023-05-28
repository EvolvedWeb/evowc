const camelToSnake = require('./camelToSnake');
const { encodeAttributeValue, decodeAttributeValue } = require('./attributeValue');
const fixLeftSpacing = require('./fixLeftSpacing');
const parseBinding = require('./parseBinding');
const parsePda = require('./parsePda');
const transformAttributeName = require('./transformAttributeName');
const transformComponentToClass = require('./transformComponentToClass');

const ATTR_KEY = ':@';
const BINDING_NAME_RE = /^(?:(?<isAttr>attr\.)|(?<isData>data-))?(?<attribute>\w[\-\d\w]+)$/;
const BINDING_PREFIX = ':';
const CONDITIONAL_PREFIX = '$';
const ELEMENT_NAME_RE = /^[a-z](?:.*)-(?:.*)$/;
const EVENT_PREFIX = '.';
const FOR_VAR_RE = /^\s*(?<variable>#?\w[\w\d]+)?\s+as\s+(?<item>\w[\w\d]+)?\.(?<key>#?\w[\w\d]+)?\s*/;
const SWITCH_VAR_RE = /^\s*(?<negative>!)?(?<variable>[^:]+)\s*:\s*(?:(?:(?<min>\d+)\s*,\s*(?<max>\d+)\s*)?|(?<value>[^\n]+))$/;
const PDA_PREFIX = ':';
const PDA_ALSO_SET_ATTR_PREFIX = '+';
const ROOT_SCRIPT = 'root';
const INVALID_EL_ID = /^el\d+$/;

const INVALID_ELEMENT_NAMES = [
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph'
];

/**
 * Reserved property and method names from a component.
 * The user can not use these names in their component class code
 */
const RESERVED_CLASS_FIELDS = [
  '#callUpdate',
  '#els',
  '#getEls',
  'constructor',
];

/**
 * Reserved attribute names for the `<component>` tag
 * The user may not use these
 */
const RESERVED_COMPONENT_ATTRS = [
  'extends',
  'shadow',
  'tag',
];

/**
 * Valid options for the `shadow` attribute on the `<component>` tag
 */
const VALID_SHADOWS = [
  'closed',
  'none',
  'open',
];

/**
 * @typedef ComponentBinding
 * @prop {string} prop
 * @prop {string} srcVar
 * @prop {string} srcObj
 * @prop {string} srcField
 * @prop {string} type
 * @prop {boolean} add2WayBinding
 * @prop {string[]} [pipes]
 *
 * @typedef ComponentConditional
 * @prop {string} variable
 * @prop {string} value
 * @prop {boolean} negative
 *
 * @typedef ComponentElement
 * @prop {string} tag
 * @prop {string} elementName
 * @prop {string} element
 * @prop {object} attrs
 * @prop {string} key
 * @prop {ComponentBinding[]} bindings
 * @prop {null|ComponentConditional} conditional
 * @prop {object} events
 * @prop {null|object} forLoop
 * @prop {Array<string|ComponentElement>} children
 */

function getValidShadow(shadow = 'open') {
  shadow = shadow.toLowerCase();
  return VALID_SHADOWS.includes(shadow) ? shadow : 'open';
}

const isValidElementName = name => {
  if (name == null || name !== name.toLowerCase() || INVALID_ELEMENT_NAMES.includes(name)) {
    return false;
  }

  return ELEMENT_NAME_RE.test(name);
}

/**
 * @class
 * @classdesc Top level component class
 * @param {Object} attrs
 * @param {Array} children
 */
class Component {
  #tag = ''; // The html element tag name for this component
  #className = ''; // The JavaScript class name for this component
  #template = '';
  #extendsTag = ''; // Tag of the HTML Element class this component extends
  #extendsClass = ''; // Class of the HTML Element class this component extends
  #shadow = ''; // Which type of ShadowDOM will this component use
  #properties = {}; // List of all of the properties this component supports
  #attributes = {}; // Attributes for this component - May not be used??
  #style = '';
  #classScript = '';
  #rootScript = '';
  elementIndex = 0n;

  constructor(attrs, children) {
    this.#tag = attrs.tag;
    if (!isValidElementName(this.#tag)) {
      throw new Error(`Invalid element name "${this.#tag}"`);
    }

    let temp = (attrs.extends || '').trim();
    if (temp) {
      temp = temp.split(',').map(v => v.trim());
      if (temp.length !== 2 || !temp[0] || !temp[1]) {
        throw new Error('Improperly formated extends. Must be extends="tag,class"')
      }
      this.#extendsTag = temp[0];
      this.#extendsClass = temp[1]
    }
    this.#className = transformComponentToClass(this.#tag);
    this.elementIndex = 0n;
    this.#shadow = getValidShadow(attrs.shadow);
    this.#processComponentAttrs(attrs);
    this.#processComponentParts(children);
    this.#validate();
  }

  /**
   * Convert the component to a JSON representation
   *
   * @returns ComponentElement
   */
  toJSON() {
    return {
      tag: this.#tag,
      className: this.#className,
      shadow: this.#shadow,
      extendsTag: this.#extendsTag,
      extendsClass: this.#extendsClass,
      rootScript: fixLeftSpacing(this.#rootScript, 0),
      classScript: fixLeftSpacing(this.#classScript, 2),
      style: this.#style,
      attributes: structuredClone(this.#attributes),
      properties: structuredClone(this.#properties),
      template: structuredClone(this.#template),
    };
  }

  #processComponentAttrs(attrs) {
    Object.entries(attrs).forEach(([attr, value]) => {
      if (RESERVED_COMPONENT_ATTRS.includes(attr)) {
        return;
      }

      if (attr[0] === PDA_PREFIX) {
        let attrName = attr.slice(1);
        let alsoSetAttr = false;
        if (attrName[0] === PDA_ALSO_SET_ATTR_PREFIX) {
          attrName = attrName.slice(1);
          alsoSetAttr = true;
        }

        const isPublic = attrName[0] !== '#';
        if(!isPublic && alsoSetAttr) {
          throw new Error(`\x1B[91mThe private class field of \x1B[41m\x1B[97m"${attrName}"\x1B[91m\x1B[49m can not be used to set an attribute on the component \x1B[97m"${this.#tag}"\x1B[91m.\x1B[39m`);
        }
        if (RESERVED_CLASS_FIELDS.includes(attrName)) {
          throw new Error(`You can not use the reserved class field of "${attrName}"`);
        }
        if (isPublic && attrName !== attrName.toLowerCase()) {
          const snakeName = camelToSnake(attr);
          throw new Error(`\x1B[91mThe public PDA \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${this.#tag}"\x1B[91m is invalid.\nAll public PDA must be lower snake-case. Try using \x1B[93m "${snakeName}" \x1B[39m`);
        }


        const pda = parsePda(attrName, value, alsoSetAttr, isPublic, this.#tag);
        this.#properties[pda.propName] = pda;
      }
      else {
        // TODO: 2023-02-01 Should we allow built in attributes?
        // If not then we need to remove this conditional and this #attributes
        this.#attributes[attr] = value;
      }
    });
  }

  #processComponentParts(children) {
    const attrNames = Object.keys(this.#attributes).map(val => transformAttributeName(val));
    const propNames = Object.keys(this.#properties).map(val => transformAttributeName(val));
    debugger
    const { template, style, classScript, rootScript } = this.#parseComponentParts(children);
    this.#rootScript = rootScript;
    this.#classScript = classScript;
    this.#style = style;
    this.#template = template;
  }

  #parseComponentParts(children) {
    const parts = {
      template: [],
      style: [],
      classScript: [],
      rootScript: []
    };

    children.forEach(child => {
      if (child.style) {
        parts.style.push(child.style[0]['$']);
      }
      else if (child.script) {
        const location = child[ATTR_KEY]?.location;
        if (location) {
          if (location === ROOT_SCRIPT) {
            parts.rootScript.push(child.script[0]['$']);
            return;
          }

          throw new Error(`\x1B[91mThe location \x1B[41m\x1B[97m"${location}"\x1B[91m\x1B[49m for the script tag is invalid.\x1B[39m`);
        }

        parts.classScript.push(child.script[0]['$']);
      }
      else if (child.template) {
        parts.template = this.#parseTemplate(child.template);
      }
    });

    parts.style = fixLeftSpacing(parts.style.join('\n').replace(/( *\n){3,}/g, '\n'));
    parts.rootScript = fixLeftSpacing(parts.rootScript.join('\n').replace(/( *\n){3,}/g, '\n'), 0);
    parts.classScript = fixLeftSpacing(parts.classScript.join('\n').replace(/( *\n){3,}/g, '\n'));

    return parts;
  }

  #parseTemplate(template) {
    return (template || []).map(el => {
      if (el['$']) {
        return el['$'];
      }
      const newForInfo = {};

      const tag = Object.keys(el).filter(k => k != ATTR_KEY)[0]
      const childrenSrc = el[tag];
      const children = childrenSrc.length > 0 ? this.#parseTemplate(childrenSrc) : [];
      const { elementName, element, elementStr, attrs, bindings, events, conditional, forLoop, key } = this.#parseTemplateAttrs(tag, el[ATTR_KEY], newForInfo);
      this.#addBindingsToProperty(element, bindings);
      this.#addConditionalToProperty(element, conditional);
      this.#addForLoopToProperty(element, forLoop);
      return {
        tag,
        elementName,
        element,
        elementStr,
        attrs,
        key,
        bindings,
        conditional,
        events,
        forLoop,
        children,
      };
    })
  }

  #addBindingsToProperty(element, bindings) {
    const validPDAs = Object.keys(this.#properties);

    bindings?.forEach(binding => {
      //console.log(binding.srcVar);
      if (binding.srcObj === 'this') {
        const field = binding.srcField;
        const prop = this.#properties[field];
        //console.log(prop);
        if (!prop) {
          const f = field[0] === '#' ? field.slice(1) : field;
          const possiblePDAs = validPDAs.filter(pda => pda.includes(f));
          const didYouMean = possiblePDAs.length > 0 ? `\nDid you mean: \x1B[97m${possiblePDAs.join(', ')}\x1B[91m ?` : '';
          //throw new Error(`\x1B[91mAttempting to access an undefined PDA \x1B[41m\x1B[97m"${field}"\x1B[91m\x1B[49m in \x1B[93m${elementStr}\x1B[91m${didYouMean}\x1B[39m`);
          return;
        }
        if (!prop.elements[element]) {
          prop.elements[element] = {};
        }

        if (!Array.isArray(prop.elements[element].binding)) {
          prop.elements[element].binding = [];
        }

        prop.elements[element].binding.push({ ...binding });
      }
    });
  }

  #addConditionalToProperty(element, conditional) {
    if (conditional) {
      const prop = this.#properties[conditional.variable];
      if (!prop) {
        throw new Error(`Unable to have conditional for undefined property ${conditional.variable}`)
      }

      if (!prop.elements[element]) {
        prop.elements[element] = {};
      }

      prop.elements[element].conditional = conditional;
    }
  }

  #addForLoopToProperty(element, forLoop) {
    if (forLoop) {
      const prop = this.#properties[forLoop.variable];

      if (!prop.elements[element]) {
        prop.elements[element] = {};
      }

      prop.elements[element].forLoop = forLoop;
    }
  }

  #parseTemplateAttrs(tag, attributes, newForInfo) {
    const attrs = {};
    let bindings = null;
    let events = null;
    let conditional = null;
    let forLoop = null;
    let keepElementName = false;
    let elementName = `el${this.elementIndex++}`;

    attributes = { ...attributes };
    const elementStr = `<${tag} ${Object.entries(attributes).map(([k,v]) => `${k}="${v}"`).join(' ')}>`;
    if (attributes.el) {
      elementName = decodeAttributeValue(attributes.el.trim());
      if( !elementName) {
        throw new Error(`You can not use an empty hard-coded element name on ${elementStr}.`);
      }
      if (INVALID_EL_ID.exec(elementName) !== null) {
        throw new Error(`Invalid hard-coded element name "${elementName}" on ${elementStr}.`);
      }
      delete attributes.el;
      keepElementName = true;
    }

    let element = `this.#els.${elementName}`;

    let eventName;
    // Parse attributes, event, bindings, forLoops and conditionals
    Object.entries(attributes).forEach(([attr, val]) => {
      if (attr !== attr.toLowerCase()) {
        throw new Error(`\x1B[91mThe property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m is invalid.\nAll property definition attributes must be lower snake-case. Try using \x1B[93m "${camelToSnake(attr) }" \x1B[39m`);
      }

      //console.log('==============================================================');
      //console.log('before:', val);
      val = decodeAttributeValue(val);
      //console.log(' after:', val);
      //console.log('--------------------------------------------------------------');

      const attrType = attr[0];
      const attrLower = attr.slice(1).toLowerCase();

      //****************************************************
      // Conditional Commands
      // $if="title", $if="!title", $if="num:10"
      // $switch="num:1", $switch="num:2,5"
      // $for="data as item:key"
      if (attrType === CONDITIONAL_PREFIX) {
        //console.log(`Conditional "${attr}" - "${val}"`);
        if (attrLower === 'if') {
          if (conditional) {
            throw new Error('You can not have two conditionals on one tag');
          }

          let value = true;
          if (val[0] === '!') {
            val = val.slice(1);
            value = false;
          }
          conditional = {
            variable: val,
            value
          };
        }
        else if (attrLower === 'switch') {
          if (conditional) {
            throw new Error('You can not have two conditionals on one tag');
          }

          conditional = {...SWITCH_VAR_RE.exec(val).groups};
          conditional.negative = (conditional.negative === '!');
          //console.log(conditional);
        }
        else if (attrLower === 'for') {
          if (forLoop) {
            throw new Error('You can not have two $for commands on one tag');
          }

          const parts = FOR_VAR_RE.exec(val);

          if (val == null) {
            throw new Error('For statements must be formatted like "variable as item.key"');
          }

          const { variable, item, key } = parts.groups;
          if (newForInfo[item]) {
            throw new Error(`Duplicate item name "${item}" in $for command "${val}"`);
          }

          forLoop = newForInfo[item] = { variable, item, key };
        }
        keepElementName = true;
      }
      //****************************************************
      // Binding Commands
      // :title="titleVar"
      else if (attrType === BINDING_PREFIX) {
        //console.log(`Binding "${attrLower}" - "${val}"`);
        const resp = BINDING_NAME_RE.exec(attrLower);
        //console.log(resp);
        const { isAttr, isData, attribute } = resp.groups;
        const type = isAttr ? 'attr' : isData ? 'data' : 'prop';
        bindings ??= [];
        bindings.push(parseBinding(val, element, attribute, type));
        keepElementName = true;
      }
      //****************************************************
      // Event Commands
      // .click="#clickHandler"
      // .mousedown="mouseDownHandler"
      else if (attrType === EVENT_PREFIX) {
        //console.log(`Event "${attr}" - "${val}"`);
        events ??= {};
        events[attrLower] = val;
        keepElementName = true;
      }
      //****************************************************
      // Standard Attributes
      // title="This is the title"
      else {
        attrs[attr] = encodeAttributeValue(val);
      }
    });

    if (!keepElementName) {
      element = elementName = undefined;
    }

    return {
      elementName,
      element,
      elementStr,
      attrs,
      bindings,
      events,
      conditional,
      forLoop
    };
  }

  #validate() {
    // TODO: Validate that all PDAs are properly defined and
    // that all variables in the template were defeind as PDAs.
  }
}

module.exports = Component;