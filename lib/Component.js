const camelToKebab = require('./camelToKebab');
const { encodeAttributeValue, decodeAttributeValue } = require('./attributeValue');
const fixLeftSpacing = require('./fixLeftSpacing');
const parseBinding = require('./parseBinding');
const parseCpa = require('./parseCpa');
//const transformAttributeName = require('./transformAttributeName');
const transformComponentToClass = require('./transformComponentToClass');
const buildEventLists = require('./buildEventLists');

const ATTR_KEY = ':@';
const BINDING_NAME_RE = /^(?:(?<isAttr>attr\.)|(?<isData>data\.)|(?<isAria>aria\.))?(?<attribute>\w[\-\d\w]+)$/;
const BINDING_PREFIX = ':';
const CONDITIONAL_PREFIX = '$';
const BAD_ELEMENT_RE = /^[^-]+-.*-+$/;
const ELEMENT_NAME_RE = /^[a-z](?:.*)-(?:.*)$/;
const EVENT_PREFIX = '.';
const FOR_VAR_RE = /^\s*(?<variable>#?\w[\w\d]+)?\s+as\s+(?<item>\w[\w\d]+)?\.(?<key>#?\w[\w\d]+)?\s*/;
const LIST_OF_ITEMS_FORMATTER = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
const SWITCH_VAR_RE = /^\s*(?<negative>!)?(?<variable>[^:]+)\s*:\s*(?:(?:(?<min>\d+)\s*,\s*(?<max>\d+)\s*)?|(?<value>[^\n]+))$/;
const CPA_PREFIX = ':';
const CPA_ALSO_SET_ATTR_PREFIX = '+';
const INVALID_EL_ID = /^f?el\d+$/;
const VALID_EL_ID = /^[a-z]\w+$/;

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
 * @prop {boolean} add2WayBinding `true` if we are doing 2-way binding
 * @prop {string} attribute Name of attribute to bind to
 * @prop {string} default The deafult value to use for this 
 * @prop {boolean} inForLoop `true` if the element this binding is related to is part of a for loop
 * @prop {string[]} [pipes] An optional list of pipes to use on this binding
 * @prop {string} prop Name of property to bind to
 * @prop {string} srcField The field of the data we are using in this binding
 * @prop {string} srcObj The object for this binding: `this` or what is defined by a for loop
 * @prop {string} srcVar The entire variable: {strObj}.{srcField} Like `this.firstName`
 * @prop {string} type The type of binding: `aria`, `attr`, `data`, `prop`
 *
 * @typedef ComponentConditional
 * @prop {string} variable
 * @prop {string} value
 * @prop {boolean} negative
 *
 * @typedef ComponentElement
 * @prop {object} attrs
 * @prop {string[]} availableVars
 * @prop {null|ComponentBinding[]} bindings
 * @prop {null|Array<string|ComponentElement>} children
 * @prop {null|ComponentConditional} conditional
 * @prop {string} element
 * @prop {string} elementName
 * @prop {string} elementStr
 * @prop {object} events
 * @prop {null|object} forLoop
 * @prop {string} tag
 */

/**
 * Return a valid shadow type based on what is passed in.
 * @param {string} shadow - Original shadow type may be incorrect
 * @returns string - A valid shadow type. `open` is the default if an invalid type was passed in.
 */
function getValidShadow(shadow = 'open') {
  shadow = shadow.toLowerCase();
  return VALID_SHADOWS.includes(shadow) ? shadow : 'open';
}

/**
 * Incidates if the element name <component tag> is valid or not.
 *
 * @param {string} name 
 * @returns string
 */
const isValidElementName = name => {
  if (name == null || name !== name.toLowerCase() || name.includes('--') || INVALID_ELEMENT_NAMES.includes(name)) {
    return false;
  }

  if (BAD_ELEMENT_RE.test(name)) {
    return false;
  }

  return ELEMENT_NAME_RE.test(name);
}

/**
 * @class
 * @classdesc Top level component class
 */
class Component {
  /** @type {string} */ #tag = ''; // The html element tag name for this component
  /** @type {string} */#className = ''; // The JavaScript class name for this component
  /** @type {any[]} */#template = [];
  #eventList = [];
  #inputHandlerList = [];
  /** @type {string} */#extendsTag = ''; // Tag of the HTML Element class this component extends
  /** @type {string} */#extendsClass = ''; // Class of the HTML Element class this component extends
  #fileExt = null; // The user defined output file extension
  /** @type {string} */#shadow = ''; // Which type of ShadowDOM will this component use
  #properties = {}; // List of all of the properties this component supports
  #attributes = {}; // Attributes for this component - May not be used??
  /** @type {string} */#style = '';
  /** @type {string} */#classScript = '';
  /** @type {string} */#rootScript = '';
  /** @type {bigint} */#elementIndex = 0n;

  /**
   * Constructor
   * @param {object} attrs 
   * @param {null|object[]} children 
   */
  constructor(attrs, children) {
    this.#tag = attrs.tag;
    if (!isValidElementName(this.#tag)) {
      throw new Error(`Invalid element name "${this.#tag}"`);
    }

    // Figure out if this component extends something other than HTMLElement
    let temp = (attrs.extends || '').trim();
    if (temp) {
      temp = temp.split(',').map(v => v.trim());
      if (temp.length !== 2 || !temp[0] || !temp[1]) {
        throw new Error('Improperly formated extends. Must be extends="tag,class"')
      }
      this.#extendsTag = temp[0];
      this.#extendsClass = temp[1]
    }

    // Figure out if this component wants a file extention other than '.js'
    temp = (attrs.ext || '').trim();
    if (temp) {
      if (temp[0] !== '.') {
        temp = `.${temp}`;
      }

      this.#fileExt = temp;
    }

    this.#className = transformComponentToClass(this.#tag);
    this.#elementIndex = 0n;
    this.#shadow = getValidShadow(attrs.shadow);

    // TODO: 2023-07-22 MGC - Need to add support for delegatesFocus and slotAssignment
    // temp = (attrs.delegatesFocus || 'false').trim().toLowerCase() === 'true';
    // delegatesFocus Optional
    //   A boolean that, when set to true, specifies behavior that mitigates custom element issues around focusability. When a non-focusable part of the shadow DOM is clicked, the first focusable part is given focus, and the shadow host is given any available :focus styling. Its default value is false.
    // temp = (attrs.delegatesFocus || 'named').trim();
    // slotAssignment Optional
    //   A string specifying the slot assignment mode for the shadow DOM tree. This can be one of:
    //   named  - Elements are automatically assigned to <slot> elements within this shadow root. Any descendants of the host with a slot attribute which matches the name attribute of a <slot> within this shadow root will be assigned to that slot. Any top-level children of the host with no slot attribute will be assigned to a <slot> with no name attribute (the "default slot") if one is present.
    //   manual - Elements are not automatically assigned to <slot> elements. Instead, they must be manually assigned with HTMLSlotElement.assign().
    //            Its default value is named.

    this.#processComponentAttrs(attrs);
    const availableVars = ['this', ...Object.keys(this.#properties).map(k => `this.${k}`)];
    this.#processComponentParts(children, availableVars);
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
      fileExt: this.#fileExt,
      rootScript: fixLeftSpacing(this.#rootScript, 0),
      classScript: fixLeftSpacing(this.#classScript, 2),
      style: this.#style,
      attributes: structuredClone(this.#attributes),
      properties: structuredClone(this.#properties),
      template: structuredClone(this.#template),
      eventList: structuredClone(this.#eventList),
      inputHandlerList: structuredClone(this.#inputHandlerList)
    };
  }

  /**
   * Convert the atribute object into a valid set of
   * @param {object} attrs A set of name:value pairs of attributes
   */
  #processComponentAttrs(attrs) {
    Object.entries(attrs).forEach(([attr, value]) => {
      if (RESERVED_COMPONENT_ATTRS.includes(attr)) {
        return;
      }

      if (attr[0] === CPA_PREFIX) {
        let attrName = attr.slice(1);
        let alsoSetAttr = false;
        if (attrName[0] === CPA_ALSO_SET_ATTR_PREFIX) {
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
          const snakeName = camelToKebab(attr);
          throw new Error(`\x1B[91mThe public CPA \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${this.#tag}"\x1B[91m is invalid.\nAll public CPAs must be lower snake-case. Try using \x1B[93m "${snakeName}" \x1B[39m`);
        }


        const cpa = parseCpa(attrName, value, alsoSetAttr, isPublic, this.#tag);
        this.#properties[cpa.propName] = cpa;
      }
      else {
        // TODO: 2023-02-01 Should we allow built in attributes?
        // If not then we need to remove this conditional and this #attributes
        this.#attributes[attr] = value;
      }
    });
  }

  #processComponentParts(children, availableVars) {
    /*
    const attrNames = Object.keys(this.#attributes).map(val => transformAttributeName(val));
    const propNames = Object.keys(this.#properties).map(val => transformAttributeName(val));
    */
    const { template, style, classScript, rootScript } = this.#parseComponentParts(children, availableVars);
    const { eventList, inputHandlerList } = buildEventLists(template);

    this.#rootScript = rootScript;
    this.#classScript = classScript;
    this.#style = style;
    this.#template = template;
    this.#eventList = eventList;
    this.#inputHandlerList = inputHandlerList;
  }

  #getForInfo(element) {
    const forInfo = {
      bindings: [],
      events: {}
    };

    function getForInfo(el) {
      if (typeof el === 'object') {
        const { element: fullElementName, elementName, elementStr, bindings, events, children } = el
        if (bindings) {
          bindings.forEach(fb => {
            if (fb.inForLoop) {
              forInfo.bindings.push({ ...fb, elementName, element: fullElementName, elementStr });
            }
          });
        }

        if (events) {
          // Only copy the valid events for the looped section
          let newEvents = { ...(forInfo.events[fullElementName] || {}) };

          Object.entries(events).forEach(([evt, handler]) => {
            if ( newEvents[evt] ) {
              throw new Error(`Event "${evt}" already existing in the event list for "${fullElementName}"`);
            }
            newEvents[evt] = handler;
          });

          forInfo.events[fullElementName] = newEvents;
        }

        if (children) {
          children.forEach(child => getForInfo(child));
        }
      }
    }

    getForInfo(element)

    return forInfo;
  }
  /**
   * Handle loop bindings and events by adding them to the appropriate forLoop section
   *
   * @param {object[]} template 
   */
  #processForLoopDataInPlace(template) {
    template.forEach(t => {
      if(typeof t === 'object') {
        if(t.forLoop) {
          const forInfo = this.#getForInfo(t);
          t.forLoop.bindings = forInfo.bindings;
          t.forLoop.events = forInfo.events;
        }
        else if (t.children) {
          this.#processForLoopDataInPlace(t.children);
        }
      }
    })
  }


  #parseComponentParts(children, availableVars) {
    /** @type {string[]} */ let template = [];
    /** @type {string[]} */ let style = [];
    const scripts = {
      /** @type {string[]} */ classScript: [],
      /** @type {string[]} */ rootScript: []
    };

    children.forEach(child => {
      if (child.style) {
        style.push(child.style[0].$);
      }
      else if (child.script) {
        const root = child[ATTR_KEY]?.root;
        scripts[root?'rootScript':'classScript'].push(child.script[0].$);
      }
      else if (child.template) {
        template = this.#parseTemplate(child.template, availableVars);
        this.#processForLoopDataInPlace(template);
      }
    });

    //console.log(JSON.stringify(template, 0, 2));

    const resp = {
      /** @type {any[]} */ template,
      /** @type {string} */ style: fixLeftSpacing(style.join('\n').replace(/( *\n){3,}/g, '\n')),
      /** @type {string} */ rootScript: fixLeftSpacing(scripts.rootScript.join('\n').replace(/( *\n){3,}/g, '\n'), 0),
      /** @type {string} */ classScript: fixLeftSpacing(scripts.classScript.join('\n').replace(/( *\n){3,}/g, '\n'))
    }

    return resp;
  }

  #parseTemplate(template, availableVars, inForLoop = false, forElementName = '', loopItemHandlerName='') {
    return (template || []).map(el => {
      if (el.$) {
        return el.$;
      }
      const newForInfo = {};

      const tag = Object.keys(el).filter(k => k !== ATTR_KEY)[0]
      const childrenSrc = el[tag];
      const { attrs, bindings, conditional, element, elementName, elementStr,
        events, forElementName: fen, forLoop, key, subAvailableVars } = this.#parseTemplateAttrs(tag, el[ATTR_KEY], newForInfo, availableVars, inForLoop, forElementName, loopItemHandlerName);
      if (inForLoop && forLoop) {
        throw new Error(`You may not nest $for loop in a single component. ${elementStr}\nCreate a sub element for the inner $for loop.`)
      }
      this.#addBindingsToProperty(element, elementName, elementStr, subAvailableVars, bindings);
      this.#addConditionalToProperty(element, elementName, elementStr, conditional);
      this.#addForLoopToProperty(element, elementName, elementStr, forLoop, el);
      const children = childrenSrc.length > 0 ? this.#parseTemplate(childrenSrc, subAvailableVars, inForLoop || !!forLoop, forElementName || fen, loopItemHandlerName || forLoop?.loopItemHandlerName || '') : [];

      bindings?.forEach(binding => {
        if (!subAvailableVars.includes(binding.srcObj)) {
          let objs = subAvailableVars.map(obj => obj === 'this' ? '""' : `"${obj}"`);
          const objStr = LIST_OF_ITEMS_FORMATTER.format(objs);
          const verb = objs.length === 1 ? 'is' : 'are';
          throw new Error(`Invalid binding object "${binding.srcVar}" on ${elementStr}.\nAvailable objects at this point ${verb}: ${objStr}`)
        }
      })

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
        availableVars: subAvailableVars,
        forLoop,
        children,
      };
    })
  }

  #addBindingsToProperty(element, elementName, elementStr, availableVars, bindings) {
    const validCPAs = Object.keys(this.#properties);

    bindings?.forEach(binding => {
      if (binding.srcObj === 'this') {
        const field = binding.srcField.split('.')[0];
        const prop = this.#properties[field];
        if (!prop) {
          if (!availableVars.includes(binding.Obj)) {
            const f = (field[0] === '#' ? field.slice(1) : field).toLowerCase();
            const possibleCPAs = validCPAs.filter(cpa => cpa.toLowerCase().includes(f));
            const didYouMean = possibleCPAs.length > 0 ? `\nDid you mean: \x1B[97m${possibleCPAs.join(', ')}\x1B[91m ?` : '';
            throw new Error(`\x1B[91mAttempting to access an undefined CPA \x1B[41m\x1B[97m"${field}"\x1B[91m\x1B[49m in \x1B[93m${elementStr}\x1B[91m${didYouMean}\x1B[39m`);
          }
          return;
        }
        if (!prop.elements[element]) {
          prop.elements[element] = { elementName, elementStr };
        }

        if (!Array.isArray(prop.elements[element].binding)) {
          prop.elements[element].binding = [];
        }

        prop.elements[element].binding.push({ ...binding });
      }
    });
  }

  #addConditionalToProperty(element, elementName, elementStr, conditional) {
    if (conditional) {
      const prop = this.#properties[conditional.variable];
      if (!prop) {
        throw new Error(`Unable to have conditional for undefined property ${conditional.variable}`)
      }

      if (!prop.elements[element]) {
        prop.elements[element] = { elementName, elementStr };
      }

      prop.elements[element].conditional = conditional;
    }
  }

  #addForLoopToProperty(element, elementName, elementStr, forLoop) {
    if (forLoop) {
      const prop = this.#properties[forLoop.variable];

      if (!prop.elements[element]) {
        prop.elements[element] = { elementName, elementStr };
      }

      prop.elements[element].forLoop = forLoop;
    }
  }

  /**
   * 
   * @param {string} tag 
   * @param {object} attributes 
   * @param {object} newForInfo 
   * @param {string[]} availableVars 
   * @returns 
   */
  #parseTemplateAttrs(tag, attributes, newForInfo, availableVars, inForLoop, forElementName, loopItemHandlerName) {
    const attrs = {};
    let bindings = null;
    let events = null;
    let conditional = null;
    let forLoop = null;
    let keepElementName = false;
    const subAvailableVars = [...availableVars];
    attributes = { ...attributes };
    const elementStr = `<${tag} ${Object.entries(attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}>`;

    const forCommand = attributes.$for;
    delete attributes.$for;
    if (forCommand) {
      const parts = FOR_VAR_RE.exec(forCommand||'');
      if (parts == null) {
        throw new Error(`For statements must be formatted like "variable as item.key" in ${elementStr}`);
      }

      const { variable, item, key } = parts.groups;
      if (newForInfo[item]) {
        throw new Error(`Duplicate item name "${item}" in $for command "${forCommand}" in ${elementStr}`);
      }

      forLoop = newForInfo[item] = { variable, item, key, bindings: null, events: null, loopItemHandlerName: `#loopItemHandler_${this.#elementIndex}` };
      const varType = this.#properties[variable].type;
      if (varType !== 'arr') {
        throw new TypeError(`Unable to perform a $for loop using the CPA "${variable}" in ${elementStr}.\nThe type of "${variable}" is defined as "${varType}" and must be an "array".`);
      }
      subAvailableVars.push(item);
      keepElementName = true;
      inForLoop = true;
    }

    let elementName = inForLoop ? `fel${this.#elementIndex}` : `el${this.#elementIndex}`;
    this.#elementIndex++;
    if (attributes.el) {
      elementName = decodeAttributeValue(attributes.el.trim());
      if( !elementName) {
        throw new Error(`You can not use an empty hard-coded element name on ${elementStr}.`);
      }
      if (INVALID_EL_ID.exec(elementName) || !VALID_EL_ID.exec(elementName)) {
        throw new Error(`Invalid hard-coded element name "${elementName}" on ${elementStr}.`);
      }
      delete attributes.el;
      keepElementName = true;
    }

    if (forLoop) {
      loopItemHandlerName = `#loopItemHandler_${this.#elementIndex}`;
      forElementName = elementName;
      attributes._loop = elementName;
      attributes._key = `${forLoop.item}.${forLoop.key}`;
    }

    let element = inForLoop ? `els.${elementName}` : `this.#els.${elementName}`;

    // Parse attributes, event, bindings, forLoops and conditionals
    /**
     * @param {string} attr
     * @param {string} val
     */
    Object.entries(attributes).forEach(([attr, val]) => {
      if (attr !== attr.toLowerCase()) {
        throw new Error(`\x1B[91mThe property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m is invalid.\nAll property definition attributes must be lower snake-case. Try using \x1B[93m "${camelToKebab(attr) }" \x1B[39m`);
      }

      val = decodeAttributeValue(val);

      const attrType = attr[0];
      const attrLower = attr.slice(1).toLowerCase();

      //****************************************************
      // Conditional Commands
      // $if="title", $if="!title", $if="num:10"
      // $switch="num:1", $switch="num:2,5"
      // $for="data as item:key"
      if (attrType === CONDITIONAL_PREFIX) {
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
        }
        keepElementName = true;
      }
      //****************************************************
      // Binding Commands
      // :title="titleVar"
      else if (attrType === BINDING_PREFIX) {
        const resp = BINDING_NAME_RE.exec(attrLower);
        if (!resp) {
          throw new Error(`Invalid property format "${attrLower}" in ${elementStr}`)
        }
        let { isAttr, isData, isAria, attribute } = resp.groups;
        const type = isAttr ? 'attr' : isData ? 'data' : isAria ? 'aria' : 'prop';
        const binding = parseBinding(val, element, attribute, type, subAvailableVars, inForLoop, forElementName, loopItemHandlerName);
        //binding.fieldType = this.#properties[binding.srcField]?.type ?? 'unknown';
        bindings ??= [];
        bindings.push(binding);
        keepElementName = true;
      }
      //****************************************************
      // Event Commands
      // .click="#clickHandler"
      // .mousedown="mouseDownHandler"
      else if (attrType === EVENT_PREFIX) {
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
      attrs,
      bindings,
      conditional,
      element,
      elementName,
      elementStr,
      events,
      forElementName,
      forLoop,
      inForLoop,
      loopItemHandlerName,
      subAvailableVars
    };
  }

  #validate() {
    // TODO: Validate that all CPAs are properly defined and
    // that all variables in the template were defined CPAs.
  }
}

module.exports = Component;