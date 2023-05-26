const { UNPAIRED_TAGS, HTML_MIN_SETTINGS } = require('./enums');
const { encodeAttributeValue } = require('./attributeValue');
const cssMin = require('./cssMin');
const { minify: htmlMin } = require('html-minifier-terser');
const formatDate = require('./formatDate');
const getTypeConversion = require('./getTypeConversion');
const getChangeComparison = require('./getChangeComparison');
const isObject = (val) => (typeof val === 'object' && !Array.isArray(val) && val !== null);
const COMPILE_DATE = formatDate(new Date());

/**
 * A list of attributes to not process when creating the template
 */
const ATTRS_TO_NOT_PROCESS = [
  'el'
];

class Generator {
  #options = {};
  #minHtml = false;
  #minCss = false;

  async srcFromComponent(component, options) {
    this.#options = options;
    const {
      tag,
      className,
      shadow,
      extendsName,
      rootScript,
      classScript,
      template,
      style,
      properties
    } = component;
    const { minify, addDebug } = options;
    this.#minHtml = !!minify;
    this.#minCss = !!minify;
    if (isObject(minify)) {
      this.#minHtml = !!minify.html;
      this.#minCss = !!minify.css;
    }

    const html = await this.#buildTemplate(template);
    const css = await this.#buildCss(style);
    const [eventHandlers, inputHandlers] = await this.#buildEventList(template);

    const sourceParams = {
      addDebug,
      className,
      classScript: this.#prepClassScript(classScript),
      css,
      eventHandlers,
      extendsName,
      html,
      inputHandlers,
      properties,
      rootScript: this.#prepRootScript(rootScript),
      shadow,
      tag
    };

    const sourceCode = this.#buildSourceCode(sourceParams);

    return sourceCode;
  }

  #prepCommentEls(properties) {
    const commentEls = [];

    Object.values(properties).map(prop => {
      const { elements = {} } = prop;
      Object.entries(elements).forEach(([elName, data]) => {
        const { conditional, forLoop } = data;
        if (conditional || forLoop ) {
          const element = elName.split('.').slice(-1);
          commentEls.push(`'${element}'`);
        }
      })
    })

    if(commentEls.length > 0) {
      return `\n    // Conditional Comment Elements\n    [${commentEls.join(',')}].forEach(name => {
      this.#els[\`\${name}_c\`] = comment(\`  \${name}  \`, this.els[name]);
    });`;
    }

    return '';
  }

  #processProperties(useEls, properties) {
    let privateClassFields = '';
    let setDeafultValues = '';
    let observedAttributes = '';

    if (useEls) {
      privateClassFields += `\n  #els = {};`;
    }

    const props = Object.values(properties);
    if (props.length > 0) {
      console.log(props);

      privateClassFields += '\n';
      privateClassFields += props.map(item => `  ${item.privatePropName};`).join('\n');

      setDeafultValues = '\n\n    // Initialize component with default values\n' +
        props.map(item => `    this.${item.propName} ??= ${item.defaultValue};`).join('\n');

      observedAttributes =
        props.filter(item => item.isPublic).map(item => `'${item.propName}'`).join(',');
    }

    privateClassFields = privateClassFields && `\n  // Internal properties${privateClassFields}\n`

    return {
      privateClassFields,
      setDeafultValues,
      observedAttributes
    };
  }

  #prepRootScript(rootScript) {
    return rootScript && `\n${rootScript}`;
  }

  #prepClassScript(classScript) {
    return classScript && `

  //**********************************************************************************
  // Start of your code${classScript}// End of your code
  //**********************************************************************************`;
  }

  #getDomParams(html, css, shadow, className) {
    let ret = '{';
    ret += html && `template,`;
    ret += css && `styles,`;
    ret += (shadow && shadow !== 'open') ? `shadowMode:'${shadow}',` : '';
    ret += 'componentName}';
    return ret;
  }

  #getObservables(observedAttributes) {
    return (observedAttributes) ? `
  //**********************************************************************************
  // The attributes this component watches for changes
  static get observedAttributes() {
    return [${observedAttributes}];
  }
` : ''; 
  }

  #getPipedVal(pipes) {
    if (pipes) {
      return [...pipes].reverse().join('(') + '(newVal' + pipes.map(p => ')').join('');
    }

    return 'newVal';
  }

  /**
   * Get the list of import items based on the code
   * @param {*} properties 
   * @returns Array
   */
  #getImports(properties, rootScript, classScript) {
    const script = `${rootScript}
${classScript}`;
    let usesArrays = script.includes('compArrays');
    let usesBool = script.includes('boolFromVal');
    let usesComments = script.includes('comment');
    let usesConditional = script.includes('cond');
    let usesDates = script.includes('compDates');
    let usesEvents = script.includes('ael');
    let usesObjects = script.includes('compObjs');
    let usesSetAttr = script.includes('setAttr');

    Object.values(properties).forEach(prop => {
      const { type, setHostAttr, elements = {} } = prop;
      usesBool ||= (type === 'bool');
      usesArrays ||= (type === 'arr');
      usesObjects ||= (type === 'obj');
      usesDates ||= (type === 'date');
      usesSetAttr ||= !!setHostAttr;
      Object.values(elements).forEach(data => {
        const { binding, conditional, forLoop } = data;
        usesComments ||= !!conditional || forLoop;
        usesConditional ||= !!conditional;
        if (!usesSetAttr) {
          binding?.forEach(b => {
            if (b.type === 'attr') {
              usesSetAttr = true;
            }
          });
        }
      });

    });

    const imports = ['EvoElement'];
    usesBool && imports.push('boolFromVal');
    usesSetAttr && imports.push('setAttr');
    usesConditional && imports.push('cond');
    usesArrays && imports.push('compArrays');
    usesObjects && imports.push('compObjs');
    usesDates && imports.push('compDates');
    usesComments && imports.push('comment');
    usesEvents && imports.push('ael');
    return imports;
  }

  #processPropertyScript(properties) {
    let script = Object.entries(properties).sort((a,b) => a>b?1:-1).map(([drop,prop]) => {
      const { attrName, propName, privatePropName, type, setHostAttr, elements = {}, min, max } = prop;
      let bindingList = [];
      Object.entries(elements).forEach(([elName, data]) => {
        const { binding, conditional, forLoop } = data;
        binding?.forEach(b => {
          let line = false;
          switch(b.type) {
            case 'attr':
              line = `setAttr(${elName}, '${b.prop}', ${this.#getPipedVal(b.pipes)});`;
              break;

            case 'data':
              line = `${elName}.dataset.${b.prop} = ${this.#getPipedVal(b.pipes)};`;
              break;

            case 'prop':
              line = `${elName}.${b.prop} = ${this.#getPipedVal(b.pipes)};`;
            default:
          }

          if (line) {
            bindingList.push(line);
          }
        });

        if (conditional) {
          if (conditional.min != null || conditional.max != null) {
            bindingList.push(`cond(${elName}, ${elName}_c, newVal, [${conditional.negative},${conditional.min??''},${conditional.max??''}] );`);
          }
          else {
            bindingList.push(`cond(${elName}, ${elName}_c, newVal, ${conditional.value});`);
          }
        };
      });

      if (setHostAttr) {
        bindingList.push(`setAttr(this, '${attrName}', val);`);
      }

      bindingList = bindingList.length ? `\n      ${bindingList.join('\n      ')}` : '';
      const typeConversion = getTypeConversion(type, min, max);
      const comparison = getChangeComparison(type);
      return `
  get ${propName}() {
    return this.${privatePropName};
  }
  set ${propName}(newVal) {${typeConversion}
    const oldVal = this.${privatePropName};
    if(${comparison}) {
      this.${privatePropName} = newVal;${bindingList}
      this.#callUpdate('${propName}', oldVal, newVal);
    }
  }`;
    }).join('\n');

    return script ? `\n\n  //**********************************************************************************
  // Properties${script}` : script;
  }

  #buildSourceCode(data) {
    const {
      addDebug,
      className,
      classScript,
      css,
      eventHandlers,
      extendsName,
      html,
      inputHandlers,
      properties,
      rootScript,
      shadow,
      tag
    } = data;

    const debugConstructor = addDebug ? `\nconsole.log('${className}.constructor called')` : '';
    const debugDefined = addDebug ? `
customElements.whenDefined('${tag}').then(() => {
  console.log('${tag} defined');
});

console.log('Loading file for ${tag}');
` : '';

    const createDomParams = this.#getDomParams(html, css, shadow, className);
    const defineOptions = extendsName && `, { extends: '${extendsName}' }`;
    const useEls = true;

    let callUpdate = '';
    const { privateClassFields, setDeafultValues, observedAttributes } = this.#processProperties(useEls, properties);

    const observables = this.#getObservables(observedAttributes);
    const elsConstructor = useEls ? 'this.#els = ' : ''
    const commentElsStr = this.#prepCommentEls(properties);
    const propertyScript = this.#processPropertyScript(properties);
    const importList = this.#getImports(properties, rootScript, classScript);
    const callInit = classScript ? `

    // If your class has an init function then we call it.
    if(this.init) {
     this.init();
    }` : '';

    const sourceCode = `//************************************************************************************
// Auto generated code for <${tag}>
// Class: ${className}
// Generated on: ${COMPILE_DATE}
//************************************************************************************${debugDefined}
import { ${importList.join(', ')} } from '../EvoElement.js';${rootScript}

//************************************************************************************
// Name of this component
const componentName = '${className}';${html}${css}

//************************************************************************************
// Define class ${className} for component <${tag}>
export class ${className} extends EvoElement(${extendsName}) {${privateClassFields}${observables}
  constructor() {
    super();${debugConstructor}
    ${elsConstructor}this.createDom(${createDomParams});${commentElsStr}${setDeafultValues}${eventHandlers}${callInit}
  }${callUpdate}${inputHandlers}${propertyScript}${classScript}
}

// Define the custom element <${tag}>
customElements.define('${tag}', ${className}${defineOptions});
`;

    return sourceCode;
  }

  async #buildCss(css) {
    let temp = this.#minCss ? cssMin(await htmlMin(css, HTML_MIN_SETTINGS)) : css;
    return temp && `

//************************************************************************************
// Styles string
const styles = \`${temp}\`;`
  }

  #buildEventList(elementList) {
    let inputHandlerIndex = 1;
    let eventList = []
    let inputHandlerList = [];

    elementList.forEach(el => {
      if (typeof el === 'object') {
        const { element, events = {}, bindings, forLoop, children } = el;
        const has2WayBinding = bindings.some(binding => binding.add2WayBinding);

        let inputHandler = '';

        Object.entries(events).forEach(([evt, fn]) => {
          if (evt === 'input' && has2WayBinding) {
            inputHandler = `\n    this.${fn}(evt, data);`;
          }
          else {
            eventList.push(`ael(${element}, '${evt}', (evt)=>this.${fn}(evt, {...evt.target.dataset}));`);
          }
        })

        bindings.forEach(binding => {
          if (binding.add2WayBinding) {
            const fnName = `#${binding.srcField}_onInputHandler${inputHandlerIndex++}`.replace(/##/g, '#_');
            inputHandlerList.push(`${fnName}(evt, data) {\n    ${binding.srcVar} = evt.target.value;${inputHandler}\n  }`);
            eventList.push(`ael(${element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}));`);
          }
        })

        if (children.length > 0) {
          //TODO: Should looped event be treated differntly?
          const [moreEventList, moreInputList] = this.#buildEventList(children)
          eventList.push(...moreEventList);
          inputHandlerList.push(...moreInputList);
        }
      }
    });

    let eventHandlers = (eventList.length > 0)
      ? `\n\n    // Event handlers\n    ${eventList.join('\n    ')}`
      : '';
    let inputHandlers = (inputHandlerList.length > 0)
      ? `\n\n  // Input handlers\n  ${inputHandlerList.join('\n  ')}`
      : '';

    return [eventHandlers, inputHandlers];
  }

  /**
   * Build the template string from the template array.
   *
   * @param {Array<object>} elementList - Array of element objects with the template to build.
   * @returns string - HTML template for the component. It is minified it this.#minHtml is `true`
   */
  async #buildTemplate(elementList) {
    let templateStr = this.#buildTemplateFromArrayOfElements(elementList);
    if (this.#minHtml && templateStr) {
      templateStr = (await htmlMin(templateStr, HTML_MIN_SETTINGS)).trim();

      templateStr &&= `

//************************************************************************************
// HTML template string
const template = \`${templateStr}\`;`;
    }

    return templateStr;
  }

  /**
   * Convert the element list into a string that represents the HTML template.
   *
   * @param {object[]} elementList - List of element objects to build the template string.
   * @returns string - HTML template for the component.
   */
  #buildTemplateFromArrayOfElements(elementList) {
    let elementTag = '';
    elementList.forEach(el => {
      if (typeof el === 'object') {
        const { tag, elementName, element, attrs, bindings, conditional, events, forLoop, children } = el;
        const allAttrs = { ...attrs };
        // Add the `el` attribute if needed
        if (elementName) {
          allAttrs.el = encodeAttributeValue(elementName);
        }

        let attrsForTag = Object.entries(allAttrs).map(([attr, value]) => `${attr}${value}`).join(' ');
        if (attrsForTag) {
          attrsForTag = ` ${attrsForTag}`;
        }
        const isSelfClosing = UNPAIRED_TAGS.includes(tag);

        if(isSelfClosing) {
          attrsForTag += '/';
        }

        elementTag += `<${tag}${attrsForTag ? attrsForTag : ''}>`;

        if (isSelfClosing ) {
          if (children.length > 0) {
            throw new Error(`The tag "${tag}" is self closing and can not have children`);
          }
        }
        else {
          if (children.length > 0) {
            elementTag += this.#buildTemplateFromArrayOfElements(children);
          }

          elementTag += `</${tag}>`;
        }
      }
      else {
        //console.log(el);
        elementTag += el;
      }
    });

    return elementTag;
  }
}

module.exports = Generator;