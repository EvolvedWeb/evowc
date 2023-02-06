/*
 2023-02-04: Need to add DEBUG mode to create debug info in compiled components
*/
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const { minify: htmlMin } = require('html-minifier-terser');
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
const FORMAT_DATE = (dateObj) => (dateObj ? DATE_FORMATTER.format(dateObj) : null);

const NL_RE = /\n  /g;
const COMPILE_DATE = FORMAT_DATE(new Date());
const ELEMENT_NAME_RE = /^[a-z](?:.*)-(?:.*)$/;
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
const ATTRIBUTE_RS = RegExp(Object.keys(ATTRIBUTE_ENCODING).join(''), 'g');
const PROPS_NAME_TRANSFORM = {
  'class': 'className',
};
const ATTRIBUTE_BASED_PROPS = ['style', 'accept'];
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
const VALID_TYPES = [
  'number',
  'int',
  'bool',
  'string',
  'object',
  'array',
  'date'
];
const RESERVED_COMPONENT_ATTRS = ['tag', 'shadow'];
const VALID_SHADOWS = [
  'open',
  'closed',
  'none'
];
const RESERVED_CLASS_FIELDS = ['constructor', '#els', '#updateTimer', '#getEls', '#callUpdate'];
const SNAKE_TO_INTRA_RE = /\-[\w]/g;
const FILE_OPTIONS = {
  encoding: 'utf8'
}
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
  if (name !== name.toLowerCase() || INVALID_ELEMENT_NAMES.includes(name)) {
    return false;
  }

  return ELEMENT_NAME_RE.test(name);
}

function attrSafe(attr) {
  return attr === true
    ? ''
    : `="${attr.replace(ATTRIBUTE_RS, key => ATTRIBUTE_ENCODING[key])}"`;
}

const PARSER_OPTIONS = {
  allowBooleanAttributes: true,
  attributeNamePrefix: "",
  ignoreAttributes: false,
  preserveOrder: true,
  textNodeName: "$",
  //transformAttributeName,
  trimValues: false,
  unpairedTags: UNPAIRED_TAGS,
  removeComments: true
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
// <div :alt="title" .click="test" class="something">hi</div>
// becomes: {
//   name: 'div',
//   bindings: { alt: 'title' },
//   events: { click: 'test' },
//   attributes: { class: 'something' },
//   text: 'hi',
//   children: []
// }
function processTag(item) {
  const tag = {
    name: null,
    text: null,
    bindings: {},
    events: {},
    attributes: {},
    children: []
  };

  Object.entries(item).forEach(([tagName, value]) => {
    if (tagName === '$') {
      tag.text = value;
      return;
    }

    if (tagName === ':@') {
      let eventName;
      // Process attributes and bindings
      Object.entries(value).forEach(([attr, val]) => {
        const attrType = attr[0];
        const attrLower = attr.slice(1).toLowerCase();

        if (attrType === ':') {
          // TODO: Error if duplicate
          tag.bindings[attr.slice(1)] = val;
        }
        else if (attrType === '.') {
          // TODO: Error if duplicate
          tag.events[attrLower] = val;
        }
        /*
        else if (attrType === '|') {
          // TODO: Error if duplicate
          tag.filters[attrLower] = val;
        }
        */
        else {
          // TODO: Error if duplicate
          tag.attributes[attr] = val;
        }
      });
      return;
    }

    // Save the tagname
    tag.name = tagName;

    // Handle the tag's children
    tag.children = value.map(child => processTag(child));
  });

  return tag;
}

function processTemplate(template) {
  return template.map(tag => processTag(tag));
}

function processComponent(component) {
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

      resp.template = processTemplate(item.template);
      return;
    }

    if (item.import) {
      item.import.map(item => resp.imports.push(item['$'].trim()));
    }

    if (item.style) {
      // TODO: 2023-01-28 - Handle <style src=""></style>
      const styles = item.style.map(item => item['$']);
      resp.style = `<style>${styles.join('\n').trim()}</style>`;
    }

    if (item.script) {
      // TODO: 2023-01-28 - Handle <script src=""></s>
      const scripts = item.script.map(item => item['$']);
      resp.script = scripts.join('\n').trim();
    }
  });

  return resp;
}

function processComponents(sourceObj) {
  return sourceObj.map(topElement => {
    const attrs = topElement[':@'];
    const tag = attrs.tag;
    if (!isValidElementName(tag)) {
      throw new Error(`Invalid element name "${tag}"`);
    }
    const shadow = getValidShadow(attrs.shadow);
    const className = transformComponentToClass(tag);
    const properties = {};
    const attributes = {};

    console.info(`Processing component "${tag}" and creating class "${className}"`);
    const component = processComponent(topElement.component);

    Object.entries(attrs).forEach(([attr, value]) => {
      if (RESERVED_COMPONENT_ATTRS.includes(attr)) {
        return;
      }

      if (attr[0] === ':') {
        const propName = attr.slice(1);
        //console.log({ propName });
        if (RESERVED_CLASS_FIELDS.includes(propName)) {
          throw new Error(`You can not use the reserved class field of "${propName}"`);
        }

        const data = {
          value: "''",
          type: 'string'
        };

        if (value !== true) {
          const [type, ...rest] = value.split(':');
          let val = rest.join(':');
          if (!VALID_TYPES.includes(type)) {
            throw new Error(`Invalid property type "${type}" for "${attr}".`);
          }

          switch (type) {
            case 'number':
              // TODO: 2023-02-01 Validate that a number is a valid number
              val = Number(val ?? 0);
              break;

            case 'int':
              // TODO: 2023-02-01 Validate that an int is a valid int
              val = parseInt(val ?? 0, 10);
              break;

            case 'bool':
              val = (val === 'true') ? true : false;
              break

            case 'object':
            case 'array':
              val = (val.length > 0) ? val : 'null';
              break;

            case 'date':
              val = (val.length > 0) ? `new Date('${val}')` : 'null';
              break;

            default:
              val ??= '';
              break;
          }

          data.type = type;
          data.value = type === 'string' ? `'${escSingleQuote(val)}'` : val;
        }

        properties[propName] = data;
      }
      else {
        // TODO: 2023-02-01 Should we allow built in attributes?
        // If not then we need to remove this conditional
        attributes[attr] = value;
      }
    });

    return {
      tag,
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
    const [varName, ...pipes] = variable.split('|').map(i => i.trim());
    const binding = {
      prop: transformAttributeName(prop),
      pipes: pipes.reverse(),
      element
    };

    if(prop === ':html') {
      binding.prop = 'innerHTML'
    }
    else if (prop === ':text') {
      binding.prop = 'textContent';
    }
    else if (prop === ':value') {
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

function buildElement(elData) {
  const bindings = {};
  let events = {};
  let element = '';
  //console.log(elData);

  if (elData.name) {
    let attrs = Object.entries(elData.attributes);
    attrs = attrs.filter(([attr, value]) => attr != 'js').map(([attr, value ]) => `${attr}${attrSafe(value)}`).join(' ');
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

    const addJsName = Object.keys(localBinds).length || Object.keys(events).length;
    const js = addJsName ? ` js="${jsName}"` : '';
    element += `<${elData.name}${attrs?` ${attrs}`:''}${js}>`;

    if(elData.children) {
      elData.children.forEach(el => {
        const { bindings: binds, element: elStr, events: subEvents } = buildElement(el);
        element += elStr;
        events = { ...events, ...subEvents };
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
    element += elData.text || '';
  }

  return { bindings, element, events };
}

function buildTemplate(templateObj) {
  // TODO: 2023-01-28 - Finish
  const allBindings = {};
  let allEvents = {};
  let template = '';

  if (templateObj) {
    templateObj.forEach(el => {
      const { bindings, element, events } = buildElement(el);
      template += element;
      Object.entries(bindings).forEach(([key, value]) => {
        if (!allBindings[key]) {
          allBindings[key] = [];
        }

        allBindings[key].push(...value);
      });
      Object.entries(events).forEach(([key, value]) => {
        allEvents[key] = value;
      });
    });
  }

  return { events: allEvents, template: template.trim(), bindings: allBindings };
}

async function componentToSrc(component, minify) {
  jsIndex = 0; // Reset since each component will have their own indexes.

  const props = Object.entries(component.properties);
  //console.log(props);
  const privateMembers = props.length ? '\n'+props.map(([prop]) => `  #${prop};`.replace(/##/, '#_')).join('\n') : '';
  const privateMemberInit = props.length ? '\n\n    //Initialize properties\n' + props.map(([prop, details]) => `    this.${prop} = ${details.value};`).join('\n') : '';
  const { template, bindings, events: allEvents } = buildTemplate(component.component.template);
  // console.log('-------------------------------------------------------------- events');
  // console.log(JSON.stringify(allEvents,0,2));

  const inputHandlers = {};
  let eventHandlers = [];

  Object.entries(bindings).forEach(([variable, bindings]) => {
    bindings.forEach(binding => {
      if (binding.addInputHandler) {
        const fnName = `#${variable}_onInputHandler`;
        inputHandlers[binding.element] = {
          fnName,
          setter: `this.${variable} = evt.target.value;`,
          extra: ''
        };

        eventHandlers.push(`this.#els.${binding.element}.addEventListener('input', (evt)=>this.${fnName}(evt));`);
      }
    })
  });

  Object.entries(allEvents).forEach(([element, events]) => {
    Object.entries(events).map(([event, fn]) => {
      if (inputHandlers[element] && event === 'input') {
        inputHandlers[element].extra = `\n    this.${fn}(evt);`
      }
      else {
        eventHandlers.push(`this.#els.${element}.addEventListener('${event}', (evt)=>this.${fn}(evt));`);
      }
    });
  })


  if(eventHandlers.length > 0) {
    eventHandlers = `\n\n    // Event Handlers\n    ${eventHandlers.join('\n    ')}`;
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
  let cssTemplate = minCss ? (await htmlMin(component.component.style, HTML_MIN_SETTINGS)) : component.component.style;

  if (htmlTemplate) {
    htmlTemplate = `

// Template string
const template = \`${htmlTemplate}\`;`;
  }

  if (cssTemplate) {
    cssTemplate = `

// Styles string
const styles = \`${cssTemplate}\`;`;
  }

  let imports = component.component.imports.join('\n');
  if (imports) {
    imports = `\n${imports}`;
  }

  let propTemp = props.map(([prop, value]) => `"${prop.toLowerCase()}": '${prop}'`).join(',\n  ');
  let propLookup = '';
  if (propTemp) {
    propLookup = `

// Lookup table for lower case attributes to property names
const propLookup = {
  ${propTemp}
};`;
  }

  let properties = `\n\n  // Properties
`+ props.map(([prop, details]) => {
    let updaters = beforeType = '';

    switch (details.type) {
      case 'number':
        beforeType = `Number(value)`;
        break;
      case 'int':
        beforeType = `Math.floor(Number(value))`;
        break;
      case 'bool':
        beforeType = `Boolean(value)`;
        break;
      case 'object':
      case 'array':
        beforeType = `(typeof value === 'string' ? JSON.parse(value) : value)`;
        break;

      case 'date':
        beforeType = `(typeof value === 'string' ? new Date(value) : value)`;
        break;

      case 'string':
      default:
        beforeType = `''+value`;
    }

    if (bindings[prop]) {
      updaters = `\n      ${bindings[prop].map(item => {
        let pipedValue = 'value';
        if (item.pipes.length) {
          pipedValue = item.pipes.map(i => `this.${i}(`).join('') + 'value' + item.pipes.map(i => ')').join('')
        }

        if (item.attr) {
          return `setAttr( this.#els.${item.element}, '${item.attr}', ${pipedValue} );`;
          //return `value==null ? this.#els.${item.element}.removeAttribute('${item.attr}') : this.#els.${item.element}.setAttribute('${item.attr}', ${pipedValue});`;
        }

        return `this.#els.${item.element}.${item.prop} = ${pipedValue};`;
      }).join('\n      ')}`;
    }
    return `  get ${prop}() {
    return this.#${prop.replace(/#/, '_')};
  }
  set ${prop}(value) {
    value = ${beforeType};
    if (value !== this.#${prop.replace(/#/, '_') }) {
      this.#${prop.replace(/#/, '_') } = value;
      this.#callUpdate();${updaters}
    }
  }
`;
  }).join('\n');

  let html = `//************************************************************************************
// Auto generated code for <${component.tag}>
// Class: ${component.className}
// Generated on: ${COMPILE_DATE}
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';${imports}${propLookup}${htmlTemplate}${cssTemplate}

export class ${component.className} extends DFElement {
  #els = {};
  #updateTimer = null;${privateMembers}

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(${htmlTemplate ? 'template' : "''"}, ${cssTemplate ? 'styles' : "''"}${propTemp?', propLookup':''});

    // Get a reference to all of the relevant elements
    this.#getEls();${privateMemberInit}${eventHandlers}
  }

  #getEls() {
    this.#els = [...this.shadowRoot.querySelectorAll('[js]')]
      .reduce((o, el) => (o[el.getAttribute('js')] = el, o), {});
  }

  #callUpdate() {
    this.connected && this.update && this.update();
  }${inputHandlerStr}${properties}
`;

if (component.component.script) {
  html += `
  //*******************************
  // Start of your code
  ${component.component.script.replace(NL_RE, '\n')}
  // End of your code
  //*******************************

`;
}

html += `}

customElements.define('${component.tag}', ${component.className});
`;

  return html;
}

async function createComponentFile(components, minify) {
  const promises = components.map(component => componentToSrc(component, minify));
  return (await Promise.all(promises)).join('\n\n');
}

async function evowc(componentFileName, outputScriptName, options = {}) {
  console.info(`\nProcessing Component:\n    "${componentFileName}"\nto  "${outputScriptName}"`);
  const source = await fs.readFileSync(componentFileName, FILE_OPTIONS);
  const sourceObj = xmlParser.parse(source);
  if (!Array.isArray(sourceObj)) {
    console.error("Source File did not process correctly.");
    return;
  }

  const components = processComponents(sourceObj);
  const html = await createComponentFile(components, options.minify);

  await fsp.writeFile(outputScriptName, html, FILE_OPTIONS)

  let scriptOutput = JSON.stringify(components,0,2);
  await fsp.writeFile(outputScriptName + '.json', scriptOutput, FILE_OPTIONS)

  scriptOutput = JSON.stringify(sourceObj, 0, 2);
  await fsp.writeFile(outputScriptName + '.orig.json', scriptOutput, FILE_OPTIONS)
}
