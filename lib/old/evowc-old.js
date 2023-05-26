/*
 2023-02-04: Need to add DEBUG mode to create debug info in compiled components
*/
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const { minify: htmlMin } = require('html-minifier-terser');

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
const FORMAT_DATE = (dateObj) => (dateObj ? DATE_FORMATTER.format(dateObj) : null);

const NL_RE = /\n  /g;
const COMPILE_DATE = FORMAT_DATE(new Date());
const ELEMENT_NAME_RE = /^[a-z](?:.*)-(?:.*)$/;
const TYPE_PARTS_RE = /^(?<type>\w+)(?:\(\s*(?<min>[^\s,)]+)?\s*(?:\s*,\s*(?<max>[^\s)]+)\s*)?\s*\))?\s*$/;
const SCRIPT_WHITESPACE_RE = /^\n*(?<whiteSpace>\s*)\w/;
const FOR_VAR_RE = /^\s*(?<variable>#?\w[\w\d]+)?\s+as\s+(?<item>\w[\w\d]+)?\.(?<key>#?\w[\w\d]+)?\s*/;
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
const ATTRIBUTE_ENCODING = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
  '/': '&#x2F;'
};
const ATTRIBUTE_RS = RegExp(`[${Object.keys(ATTRIBUTE_ENCODING).join('')}]`, 'g');
const HTML_ENTITIES_RS = RegExp(`[${Object.keys(ATTRIBUTE_ENCODING).join('')}]`, 'gm');
const PROPS_NAME_TRANSFORM = {
  'class': 'className',
  'text': 'textContent',
  'html': 'innerHTML'
};
const ATTRIBUTE_BASED_PROPS = [ // TODO: Need to define all of these
  'accept',
  'alt',
  'for',
  'style'
];
const BOOLEAN_ATTRIBUTES = [
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
];
const ATTRS_TO_NOT_PROCESS = ['js'];
const UNPAIRED_TAGS = ['br', 'hr', 'img', 'input', 'meta'];
const VALID_FILTER_TAGS = ['input', 'textarea'];
const HTML_MIN_SETTINGS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
};
const TYPE_NORMALIZE = {
  'arr': 'arr',
  'array': 'arr',
  'bigint': 'bigint',
  'bool': 'bool',
  'boolean': 'bool',
  'date': 'date',
  'int': 'int',
  'null': 'null',
  'num': 'num',
  'number': 'num',
  'obj': 'obj',
  'object': 'obj',
  'str': 'str',
  'string': 'str'
};
const VALID_TYPES = Object.keys(TYPE_NORMALIZE);
const RESERVED_COMPONENT_ATTRS = ['tag', 'shadow', 'extends'];
const VALID_SHADOWS = [
  'open',
  'closed',
  'none'
];
const RESERVED_CLASS_FIELDS = ['constructor', '#els', '#getEls', '#callUpdate'];
const SNAKE_TO_INTRA_RE = /\-[\w]/g;
let jsIndex = 0;

const isObject = (val) => (typeof val === 'object' && !Array.isArray(val) && val !== null);
const transformAttributeName = name => name.replace(SNAKE_TO_INTRA_RE, val => val[1].toUpperCase());
const escSingleQuote = (str) => str.replace(/'/g, '\\\'');
function transformComponentToClass(name) {
  let temp = transformAttributeName(name);
  return temp[0].toUpperCase()+temp.slice(1)+'Element';
};

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

const textToHtmlElements = (str) => (''+str).replace(HTML_ENTITIES_RS, (key) => ATTRIBUTE_ENCODING[key]);

function escAttrValue(attr) {
  return attr === true
    ? ''
    : `="${attr.replace(ATTRIBUTE_RS, key => ATTRIBUTE_ENCODING[key])}"`;
}

const PARSER_OPTIONS = {
  allowBooleanAttributes: true,
  attributeNamePrefix: "",
  ignoreAttributes: false,
  parseTagValue: false,
  preserveOrder: true,
  processEntities: false,
  removeComments: true,
  textNodeName: "$",
  trimValues: false,
  unpairedTags: UNPAIRED_TAGS,
};

const xmlParser = new XMLParser(PARSER_OPTIONS);

function processEvent(item) {
  const event = {
    name: '',
    attributes: {},
    params: []
  };

  Object.entries(item[':@']??{}).forEach(([attr, value]) => {
    if (attr === 'name') {
      event.name = value;
      return;
    }

    event.attributes[attr] = value;
  });

  item.event.forEach(child => {
    if (child.param) {
      event.params.push(child[':@']);
    }
  });

  return event;
}

// Convert a tag into an object. For example:
//
// <div $if="showing" :alt="title" .click="test" class="something">hi</div>
//
// becomes: {
//   name: 'div',
//   attributes: { class: 'something' },
//   bindings: { alt: 'title' },
//   children: [{
//      name: null,
//      attributes: {},
//      bindings: {},
//      children: [],
//      conditional: null,
//      events: {},
//      text: 'hi',
//   }],
//   conditional: {
//      variable: 'showing'
//   },
//   events: { click: 'test' },
//   for: null;
//   text: null,
// }
//
// <div $for="things as item.key"><span :text="item.name" .click="#doit"></span></div>
//
// becomes: {
//   name: 'div',
//   attributes: {},
//   bindings: {},
//   children: [{
//      name: 'span',
//      attributes: {},
//      bindings: { text: 'item.name' },
//      children: [],
//      conditional: null,
//      events: { click: 'doit' },
//      text: null,
//   }],
//   conditional: null,
//   events: {},
//   for: {
//      variable: 'things',
//      item: 'item',
//      key: 'key'
//   },
//   text: null,
// }
function processTag(item, attributes, properties, forInfo = {}) {
  console.log('\n==============================================================');
  console.log(forInfo);
  const newForInfo = {...forInfo};
  const forProperties = Object.keys(newForInfo);
  const tag = {
    name: null,
    attributes: {},
    bindings: {},
    children: [],
    conditional: null,
    events: {},
    for: null,
    key: null,
    text: null
  };

  let value = item[':@'];
  if (value) {
    let eventName;
    // Process attributes and bindings
    Object.entries(value).forEach(([attr, val]) => {
      //val = val.trim();
      console.log({attr,val});
      if (attr !== attr.toLowerCase()) {
        const snakeName = attr.replace(/[A-Z]/g, (key) => `-${key.toLowerCase()}`);
        throw new Error(`\x1B[91mThe property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m is invalid.\nAll property definition attributes must be lowercase. Try using \x1B[93m "${snakeName}" \x1B[39m`);
      }

      const attrType = attr[0];
      const attrLower = attr.slice(1).toLowerCase();

      // Check for conditional commands
      if (attrType === '$') {
        if (attrLower === 'if') {
          if (tag.conditional) {
            // TODO: Error if duplicates
          }

          tag.conditional = {
            variable: val
          };
          const val2 = transformAttributeName(val.split('|')[0]).replace(/!/g, '');
          if (!forProperties.includes(val2.split('.')[0])) {
            if (!properties.includes(val2)) {
              const val3 = val2.replace(/#/g, '');
              const possible = properties.filter(prop => prop.includes(val3));

              let meant = possible.length > 0 ? ` Did you mean to use "${possible.join('", "')}"` : '';
              throw new Error(`Undefined PDA in $if="${val}".${meant}`)
            }
          }
        }
        else if (attrLower === 'switch') {
          const parts = val.split(':').map(p => p.trim()).filter(p => !!p);
          if (parts.length !== 2) {
            throw new Error('Switch statements must be "variable:value"');
          }
          if (tag.conditional) {
            // TODO: Error if duplicates
          }

          tag.conditional = {
            variable: parts[0],
            value: parts[1]
          };
          const val2 = transformAttributeName(parts[0].split('|')[0]);
          if (!forProperties.includes(val2.split('.')[0])) {
            if (!properties.includes(val2)) {
              const val3 = val2.replace(/#/g, '');
              const possible = properties.filter(prop => prop.includes(val3));

              let meant = possible.length > 0 ? ` Did you mean to use "${possible.join('", "')}"` : '';
              throw new Error(`Undefined PDA in $switch="${val}".${meant}`)
            }
          }
        }
        else if (attrLower === 'for') {
          const parts = FOR_VAR_RE.exec(val);

          if (val == null) {
            throw new Error('For statements must be formatted like "variable as item.key"');
          }

          const { variable, item, key } = parts.groups;
          console.log('---- for', { variable, item, key });
          if (newForInfo[item]) {
            throw new Error(`Duplicate item name "${item}" in for statement`);
          }

          tag.for = newForInfo[item] = { variable, item, key };
        }
      }
      // Check for bindings
      else if (attrType === ':') {
        // TODO: Error if duplicate
        const val2 = transformAttributeName(val.split('|')[0]);
        if (!forProperties.includes(val2.split('.')[0])) {
          if (!properties.includes(val2)) {
            const val3 = val2.replace(/#/g, '');
            const possible = properties.filter(prop => prop.includes(val3));

            let meant = possible.length > 0 ? ` Did you mean to use "${possible.join('", "')}"` : '';
            throw new Error(`Undefined PDA ${attr}="${val}".${meant}`)
          }
        }
        tag.bindings[attr.slice(1)] = val;
      }
      // Check for events
      else if (attrType === '.') {
        // TODO: Error if duplicate
        tag.events[attrLower] = val;
        // TODO: Add error checking to validate that a function exists.
      }
      else {
        // TODO: Error if duplicate
        tag.attributes[attr] = val;
        // No need to check for existing propery since this is a raw attribute
      }
    });
  }

  Object.entries(item).forEach(([tagName, value]) => {
    if (tagName === '$') {
      tag.text = value;
      return;
    }

    if (tagName === ':@') {
      return;
    }

    // Save the tagname
    tag.name = tagName;

    // Handle the tag's children
    tag.children = value.map(child => processTag(child, attributes, properties, newForInfo));
  });

  return tag;
}

function processTemplate(template, attributes, properties) {
  return template.map(tag => processTag(tag, attributes, properties));
}

function processComponent(component, attributes, properties) {
  const resp = {events: [], template: [], script: '', style: '', imports: []};

  component.forEach(item => {
    if (item.event) {
      resp.events.push(processEvent(item));
      return;
    }

    if (item.template) {
      if (resp.template.length > 0) {
        throw new Error('More than one template provided. Only one allowed.');
      }

      resp.template = processTemplate(item.template, attributes, properties);
      return;
    }

    if (item.import) {
      throw new Error(`\x1B[91mThe \x1B[41m\x1B[97m<import>\x1B[91m\x1B[49m tag is no longer valid. Use \x1B[41m\x1B[97m<script location="root">\x1B[91m\x1B[49m instead.\x1B[39m`);
    }

    if (item.style) {
      // TODO: 2023-01-28 - Handle <style src=""></style>
      const styles = item.style.map(item => item['$']);
      resp.style += styles.join('\n').trim();
    }

    if (item.script) {
      // TODO: 2023-01-28 - Handle <script src=""></s>
      const location = item[':@']?.location;
      if (location === 'root') {
        item.script.forEach(item => {
          let script = item['$'] || '';
          const exec = SCRIPT_WHITESPACE_RE.exec(script);
          let { whiteSpace = '' } = exec.groups;
          if (whiteSpace.length) {
            const wsRe = new RegExp(`\n${whiteSpace}`, 'g');
            script = script.replace(wsRe, '\n');
          }
          resp.imports.push(script.trim());
        });
      }
      else if (!location) {
        const scripts = item.script.map(item => item['$']);
        resp.script += scripts.join('\n').trim();
      }
      else {
        throw new Error(`\x1B[91mThe location \x1B[41m\x1B[97m"${location}"\x1B[91m\x1B[49m for the script tag is invalid.\x1B[39m`);
      }
    }
  });

  return resp;
}

function parsePda(attr, value, setAttr, tag) {
  const pda = {
    value: "''",
    type: 'string',
    setAttr
  };

  if (value !== true) {
    let [type1, ...rest] = value.split(':');
    const isVar = (rest[0] === 'var');
    if(isVar) {
      rest.shift();
    }
    const resp = TYPE_PARTS_RE.exec(type1);
    let { type, min, max } = resp.groups;
    //console.log({ type, min, max });
    let val = decodeURIComponent(rest.join(':'));
    if (!VALID_TYPES.includes(type)) {
      throw new TypeError(`\x1B[91mThe property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m was given an invalid type: \x1B[41m\x1B[97m"${type}"\x1B[91m\x1B[49m.\nValid types are: \x1B[93m${VALID_TYPES.map(t => `${t}`).join(', ')} \x1B[39m`);
    }
    if(isVar && val.length === 0) {
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
          val = ['true','1'].includes(val) ? true : ['false','0'].includes(val) ? false : null;
          if(val == null) {
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

          catch(ex) {
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
    pda.value = (!isVar && type === 'str') ? `'${escSingleQuote(val)}'` : val;
    if (['num','int'].includes(type)) {
      pda.min = min;
      pda.max = max;
    }
  }

  return pda;
}

// Convert the XML data into one, or more component objects
function processComponents(sourceObj) {
  return sourceObj.map(topElement => {
    const attrs = topElement[':@'] ?? {};
    const tag = attrs.tag;
    if (!isValidElementName(tag)) {
      //console.log(topElement);
      throw new Error(`Invalid element name "${tag}"`);
    }
    const shadow = getValidShadow(attrs.shadow);
    let extendsName = attrs.extends;
    const className = transformComponentToClass(tag);
    const properties = {};
    const attributes = {};

    console.info(` * \x1B[32mTranspiling component \x1B[93m"${tag}"\x1B[32m to class \x1B[93m"${className}"\x1B[39m`);
    Object.entries(attrs).forEach(([attr, value]) => {
      if (RESERVED_COMPONENT_ATTRS.includes(attr)) {
        return;
      }

      if (attr[0] === ':') {
        let propName = attr.slice(1);
        if (RESERVED_CLASS_FIELDS.includes(propName)) {
          throw new Error(`You can not use the reserved class field of "${propName}"`);
        }
        if(propName !== propName.toLowerCase()) {
          const snakeName = attr.replace(/[A-Z]/g, (key) => `-${key.toLowerCase()}`);
          throw new Error(`\x1B[91mThe property definition attribute \x1B[41m\x1B[97m"${attr}"\x1B[91m\x1B[49m for the component \x1B[97m"${tag}"\x1B[91m is invalid.\nAll property definition attributes must be lowercase. Try using \x1B[93m "${snakeName}" \x1B[39m`);
        }

        let setAttr = false;
        if(propName[0] === '+') {
          propName = propName.slice(1);
          setAttr = true;
        }

        properties[propName] = parsePda(propName, value, setAttr, tag);
      }
      else {
        // TODO: 2023-02-01 Should we allow built in attributes?
        // If not then we need to remove this conditional
        attributes[attr] = value;
      }
    });

    const attrNames = Object.keys(attributes).map(val => transformAttributeName(val));
    const propNames = Object.keys(properties).map(val => transformAttributeName(val));
    const component = processComponent(topElement.component, attrNames, propNames);

    return {
      tag,
      shadow,
      extendsName,
      properties,
      attributes,
      className,
      component
    }
  });
}

function getLocalBindings(srcBindings, element) {
  const bindings = {};

  Object.entries(srcBindings).forEach(([prop, variable]) => {
    //console.log({ prop, variable });
    if(variable === true) {
      throw new Error(`Variable name was not provided for "${prop}"`);
    }
    let setAttr = false;
    const [varName, ...pipes] = variable.split('|').map(i => i.trim());
    const binding = {
      prop: transformAttributeName(prop),
      pipes: pipes.reverse(),
      element
    };

    if (prop === 'value') {
      binding.prop = 'value';
      binding.addInputHandler = true;
    }
    else if (prop.startsWith('attr.')) {
      binding.attr = prop.slice(5);
    }
    else if (PROPS_NAME_TRANSFORM.hasOwnProperty(prop)) {
      binding.prop = PROPS_NAME_TRANSFORM[prop];
    }
    else if (ATTRIBUTE_BASED_PROPS.includes(prop)) {
      binding.attr = prop;
    }
    else if (prop.startsWith('data-')) {
      binding.prop = `dataset.${transformAttributeName(prop.slice(5))}`;
    }

    if (!bindings[varName]) {
      bindings[varName] = [];
    }
    bindings[varName].push(binding);
  });

  return bindings;
}

function buildElement(elData = {}) {
  const bindings = {};
  let conditionals = {};
  let events = {};
  let element = '';
  let addJsName = false;
  //console.log(elData);

  if (elData.name) {
    let attrs = Object.entries(elData.attributes);
    attrs = attrs.filter(([attr, value]) => !ATTRS_TO_NOT_PROCESS.includes(attr)).map(([attr, value ]) => `${attr}${escAttrValue(value)}`).join(' ');
    let jsName = elData.attributes.js || `el${jsIndex++}`;
    let localBinds = getLocalBindings(elData.bindings, jsName);
    Object.entries(localBinds).forEach(([key, bindingList]) => {
      bindingList.forEach(value => {
        if (!bindings[key]) {
          bindings[key] = [];
        }

        bindings[key].push(value);
      });
    });

    if (Object.keys(elData.events).length > 0) {
      events[jsName] = elData.events;
    }

   addJsName = elData.attributes.js || Object.keys(localBinds).length || Object.keys(events).length;

    if (elData.conditional?.variable) {
      if (elData.conditional.value) {
        addJsName = true;
        conditionals[jsName] = {
          value: elData.conditional.value,
          variable: elData.conditional.variable
        };

      }
      else {
        const isTruthy = elData.conditional.variable[0] !== '!';
        const variable = isTruthy ? elData.conditional.variable : elData.conditional.variable.slice(1);
        addJsName = true;
        conditionals[jsName] = {
          isTruthy,
          variable
        };
      }
    }

    const js = addJsName ? ` js="${jsName}"` : '';
    //console.log(js);
    element += `<${elData.name}${attrs?` ${attrs}`:''}${js}>`;

    if(elData.children) {
      elData.children.forEach(el => {
        const { bindings: binds, element: elStr, events: subEvents, conditionals: subConditionals, addJsName: subAddJsName } = buildElement(el);
        element += elStr;
        events = { ...events, ...subEvents };
        conditionals = { ...conditionals, ...subConditionals };
        if (subAddJsName) {
          addJsName = true;
        }
        Object.entries(binds).forEach(([key, value]) => {
          if (!bindings[key]) {
            bindings[key] = [];
          }

          bindings[key].push(...value);
        });

      });
    }

    if (!UNPAIRED_TAGS.includes(elData.name)) {
      element += `</${elData.name}>`
    }
  }
  else {
    //TODO: 2023-02-27 - edData.text can be a number with the current XML parser
    element += (elData.text || '');
    //element += textToHtmlElements(elData.text || '');
  }

  return { bindings, element, events, conditionals, addJsName };
}

function buildTemplate(templateObj) {
  // TODO: 2023-01-28 - Finish
  const allBindings = {};
  let allEvents = {};
  let allConditionals = {};
  let template = '';
  let hasJsName = false;

  if (templateObj) {
    templateObj.forEach(el => {
      const { bindings, element, events, conditionals, addJsName } = buildElement(el);
      if (addJsName) {
        hasJsName = true;
      }
      template += element;
      Object.entries(bindings).forEach(([key, value]) => {
        if (!allBindings[key]) {
          allBindings[key] = [];
        }

        allBindings[key].push(...value);
      });
      allConditionals = { ...allConditionals, ...conditionals };
      Object.entries(events).forEach(([key, value]) => {
        allEvents[key] = value;
      });
    });
  }

  return { events: allEvents, template: template.trim(), bindings: allBindings, conditionals: allConditionals, hasJsName };
}

function cssMin(css) {
  return css.replace(/\s{\s/g, '{').replace(/\s}\s/g, '}').replace(/:\s/g, ':').replace(/;\s/g, ';').replace(/;}/g, '}');
}

async function componentToSrc(component, minify, addDebug = false) {
  jsIndex = 0; // Reset since each component will have their own indexes.

  const props = Object.entries(component.properties);
  const { template, bindings, events: allEvents, conditionals, hasJsName } = buildTemplate(component.component.template);
  const useEls = props.length || hasJsName;
  const privateMembers = useEls ? '\n  #els = {};\n' + props.map(([prop]) => `  #${transformAttributeName(prop)};`.replace(/##/, '#_')).join('\n')+'\n' : '';
  const privateMemberInit = props.length ? '\n\n    // Initialize with default values\n' + props.map(([prop, details]) => `    this.${transformAttributeName(prop)} ??= ${details.value};`).join('\n') : '';
  const elsConstructor = useEls ? 'this.#els = ' : '';

  let usesSetAttr = false;
  let usesHandleCondition = false;
  let usesCreateComment = false;
  let usesEventHandlers = false;
  let usesBoolFromVal = false;

  const inputHandlers = {};
  let eventHandlers = [];

  Object.entries(bindings).forEach(([variable, bindingList]) => {
    bindingList.forEach(binding => {
      if (binding.addInputHandler) {
        const fnName = `#${variable}_onInputHandler`.replace(/##/g, '#_');
        inputHandlers[binding.element] = {
          fnName,
          setter: `this.${variable} = evt.target.value;`,
          extra: ''
        };

        usesEventHandlers = true;
        eventHandlers.push(`ael(this.#els.${binding.element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}));`);
      }
    })
  });

  Object.entries(allEvents).forEach(([element, events]) => {
    Object.entries(events).map(([event, fn]) => {
      if (inputHandlers[element] && event === 'input') {
        inputHandlers[element].extra = `\n    this.${fn}(evt, data);`
      }
      else {
        usesEventHandlers = true;
        eventHandlers.push(`ael(this.#els.${element}, '${event}', (evt)=>this.${fn}(evt, {...evt.target.dataset}));`);
      }
    });
  })


  if(eventHandlers.length > 0) {
    eventHandlers = `\n\n    // Event handlers
    ${eventHandlers.join('\n    ')}`;
  }
  else {
    eventHandlers = '';
  }
  let minHtml = !!minify;
  let minCss = !!minify;
  if (isObject(minify)) {
    minHtml = !!minify.html;
    minCss = !!minify.css;
  }

  let inputHandlerStr = '';
  const handlers = Object.values(inputHandlers);
  if (handlers.length > 0) {
    inputHandlerStr = '\n\n  ' + handlers.map(handler => `${handler.fnName}(evt) {
    ${handler.setter}${handler.extra}
  }`).join('\n  ')
  }
  let htmlTemplate = minHtml ? (await htmlMin(template, HTML_MIN_SETTINGS)) : template;
  let cssTemplate = minCss ? cssMin(await htmlMin(component.component.style, HTML_MIN_SETTINGS)) : component.component.style;

  if (htmlTemplate) {
    htmlTemplate = `

//************************************************************************************
// Template string
const template = \`${htmlTemplate}\`;`;
  }

  if (cssTemplate) {
    cssTemplate = `

//************************************************************************************
// Styles string
const styles = \`${cssTemplate}\`;`;
  }

  let imports = component.component.imports.join('\n');
  if (imports) {
    imports = `\n${imports}`;
  }

  // propLookup only needs the public properties that are also attributes
  // So we filter out the private properties.
  let propTemp = props.filter(([prop]) => !prop.startsWith('#')).map(([prop]) => `'${prop.toLowerCase()}'`).join(', ');
  let observables = '';
  if (propTemp) {
    observables = `
  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return [${propTemp}];
  }
`
  }

  let commentElsStr = '';
  let properties = '';
  let callUpdate = '';
  let commentEls = [];

  if(props.length > 0) {
    callUpdate = `

  //**********************************************************************************
  // This is called when any property is updated
  #callUpdate(field, oldVal, newVal) {${addDebug ? `
    console.log('${component.className}.#callUpdate called', field, oldVal, newVal)`:''}
    this.isConnected && this.update && this.update(field, oldVal, newVal);
  }`;

    properties = `\n\n  //**********************************************************************************
  // Properties\n`+ props.map(([prop, details]) => {
    const transProp = transformAttributeName(prop);
    let updaters = beforeType = condHandlers = '';

    let conditionalHandlers = [];
    Object.entries(conditionals).forEach(([element, conditional]) => {
      //console.log(element, conditional.variable, prop, transProp);
      if ([prop, transProp].includes(conditional.variable)) {
        //console.log(conditional.variable, prop, transProp);
        usesCreateComment = true;
        commentEls.push(`this.#els.${element}_c = comment(' ${element} ', this.#els.${element});`);
        //console.log(commentEls);
        if (conditional.value) {
          // TODO: 2023-02-27 - Fix switch to handle all of them with one comment and support default
          let val = conditional.value; // TODO: 2023-02-27 - Handle proper variable types
          conditionalHandlers.push(`cond(this.#els.${element}, newVal === ${val}, this.#els.${element}_c );`);
        }
        else {
          conditionalHandlers.push(`cond(this.#els.${element}, ${conditional.isTruthy ? 'newVal' : '!newVal'}, this.#els.${element}_c );`);
        }
        usesHandleCondition = true;
      }
    });

    if (commentEls.length > 0) {
      commentElsStr = `\n    //Conditional Comment Elements\n    ${commentEls.join('\n    ')}`;
    }

    if (conditionalHandlers.length > 0) {
      condHandlers = `\n      ${conditionalHandlers.join('\n      ')}`;
    }

    if (details.setAttr) {
      usesSetAttr = true;
      condHandlers += `\n      setAttr( this, '${prop}', newVal );`
    }

    const minMax = [];

    //console.log(prop, details);
    switch (details.type) {
      case 'num':
        beforeType = `Number(newVal)`;
        if (details.min != null) {
          minMax.push(`if (newVal < ${details.min}) newVal = ${details.min};`);
        }
        if (details.max != null) {
          minMax.push(`if (newVal > ${details.max}) newVal = ${details.max};`);
        }
        break;

      case 'int':
        beforeType = `parseInt(newVal, 10)`;
        if (details.min != null) {
          minMax.push(`if (newVal < ${details.min}) newVal = ${details.min};`);
        }
        if (details.max != null) {
          minMax.push(`if (newVal > ${details.max}) newVal = ${details.max};`);
        }
        break;

      case 'bigint':
        beforeType = `BigInt(newVal);`
        break;

      case 'bool':
        beforeType = `boolFromVal(newVal)`;
        usesBoolFromVal = true;
        break;

      case 'obj':
        beforeType = `(typeof newVal === 'string' ? JSON.parse(newVal) : newVal)`;
        // TODO: Need to make sure newVal is an Object
        break;

      case 'arr':
        beforeType = `(typeof newVal === 'string' ? JSON.parse(newVal) : newVal)`;
        // TODO: Need to make sure newVal is an Array
        break;

      case 'date':
        beforeType = `(typeof newVal === 'string' ? new Date(newVal) : newVal)`;
        // TODO: Need to make sure newVal is a Date
        break;

      case 'null':
        beforeType = null;
        break;

      case 'str':
      default:
        beforeType = `newVal==null?null:''+newVal`;
    }

    if (bindings[transProp]) {
      updaters = `\n      ${bindings[transProp].map(item => {
        let pipedValue = 'newVal';
        if (item.pipes.length) {
          pipedValue = item.pipes.map(i => `this.${i}(`).join('') + 'newVal' + item.pipes.map(i => ')').join('')
        }

        if (item.attr) {
          usesSetAttr = true;
          return `setAttr( this.#els.${item.element}, '${item.attr}', ${pipedValue} );`;
        }

        return `this.#els.${item.element}.${item.prop} = ${pipedValue};`;
      }).join('\n      ')}`;
    }
    return `  get ${transProp}() {
    return this.#${transProp.replace(/#/, '_')};
  }
  set ${transProp}(newVal) {${beforeType != null ? `
    newVal = ${beforeType};` : ''}${minMax.length ? `\n    ${minMax.join('\n    ')}`:''}
    if (newVal !== this.#${transProp.replace(/#/, '_') }) {
      const oldVal = this.#${transProp.replace(/#/, '_')};
      this.#${transProp.replace(/#/, '_')} = newVal;${updaters}${condHandlers}
      this.#callUpdate('${transProp}', oldVal, newVal);
    }
  }`;
    }).join('\n\n');
  }

  const extendsName = component.extendsName || '';
  const baseClass = extendsName && `HTML${extendsName[0].toUpperCase() + extendsName.slice(1)}Element`;

  if (component.component.script.includes('setAttr(')) {
    usesSetAttr = true;
  }
  if (component.component.script.includes('cond(')) {
    usesHandleCondition = true;
  }
  if (component.component.script.includes('boolFromVal(')) {
    usesBoolFromVal = true;
  }

  const importList = [
    'EvoElement'
  ];
  if (usesSetAttr) {
    importList.push('setAttr');
  }
  if (usesHandleCondition) {
    importList.push('cond');
  }
  if (usesCreateComment) {
    importList.push('comment');
  }
  if (usesEventHandlers) {
    importList.push('ael');
  }
  if (usesBoolFromVal) {
    importList.push('boolFromVal');
  }
  const params = [
    `componentName`
  ];
  if (htmlTemplate) params.push('template');
  if (cssTemplate) params.push('styles');
  if (component.shadow !== 'open') params.push(`shadowMode: \'${component.shadow}\'`);
  let createDomParams = `{${params.join(',')}}`;
  const callInit = component.component.script ? `

    // If your class has an init function then we call it.
    if(this.init) {
     this.init();
    }` : '';

  const debugDefined = addDebug ? `
customElements.whenDefined('${component.tag}').then(() => {
  console.log('${component.tag} defined');
});

console.log('Loading file for ${component.tag}');
` : '';

  const debugConstructor = addDebug ? `
console.log('${component.className}.constructor called')` : '';

  let html = `//************************************************************************************
// Auto generated code for <${component.tag}>
// Class: ${component.className}
// Generated on: ${COMPILE_DATE}
//************************************************************************************${debugDefined}
import { ${importList.join(', ')} } from '../EvoElement.js';${imports}

//************************************************************************************
// Name of this component
const componentName = '${component.className}';${htmlTemplate}${cssTemplate}

//************************************************************************************
// Define class ${component.className} for component <${component.tag}>
export class ${component.className} extends EvoElement(${baseClass}) {${privateMembers}${observables}
  constructor() {
    super();${debugConstructor}
    ${elsConstructor}this.createDom(${createDomParams});${commentElsStr}${privateMemberInit}${eventHandlers}${callInit}
  }${callUpdate}${inputHandlerStr}${properties}
`;

if (component.component.script) {
  html += `
  //**********************************************************************************
  // Start of your code
  ${component.component.script.replace(NL_RE, '\n')}
  // End of your code
  //**********************************************************************************
`;
}

  const options = extendsName && `, { extends: '${extendsName}' }`;
  html += `}

// Define the custom element <${component.tag}>
customElements.define('${component.tag}', ${component.className}${options});
`;

  return html;
}

async function createComponentFile(components, minify, addDebug) {
  if (typeof addDebug !== 'boolean') {
    if (!Array.isArray(addDebug)) {
      addDebug = [addDebug];
    }

    addDebug = (addDebug.includes(component.className));
  }
  const promises = components.map(component => componentToSrc(component, minify, addDebug));
  return (await Promise.all(promises)).join('\n\n');
}

async function evowc(source, options = {}) {
  // Force the Style and Script sections to be in a CDATA block
  source = source.replace(/(<script[^>]*>|<style[^>]*>)/g, '$1<![CDATA[').replace(/(<\/script>|<\/style>)/g, ']]>$1');
  // Parse the XML file
  const sourceObj = xmlParser.parse(source);
  if (!Array.isArray(sourceObj)) {
    throw new Error("Source File did not process correctly.");
  }

  // Process all of the components
  const components = processComponents(sourceObj);
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    let addDebug = options.addDebug || false;
    if (typeof addDebug !== 'boolean') {
      if (!Array.isArray(addDebug)) {
        addDebug = [addDebug];
      }

      addDebug = (addDebug.includes(component.className));
    }

    component.html = await componentToSrc(component, options.minify, addDebug);
  }

  return components;
}

module.exports = evowc;
