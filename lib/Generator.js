// @ts-ignore
import * as fs from 'node:fs';
// @ts-ignore
import * as path from 'node:path';
import { UNPAIRED_TAGS, HTML_MIN_SETTINGS } from './enums.js';
import { encodeAttributeValue } from './attributeValue.js';
// @ts-ignore
import { minify as htmlMin } from 'html-minifier-terser';
import { formatDate } from './formatDate.js';
import { getTypeConversion } from './getTypeConversion.js';
import { getChangeComparison } from './getChangeComparison.js';
import { getDataType } from './getDataType.js';
import { prepRootScript } from './prepRootScript.js';
import { prepCommentEls } from './prepCommentEls.js';
import { processProperties } from './processProperties.js';
import { prepClassScript } from './prepClassScript.js';
import { getDomParams } from './getDomParams.js';
import { getObservables } from './getObservables.js';
import { getImports } from './getImports.js';
import { getForBindingLines } from './getForBindingLines.js';
import { getHtmlMinifySettings } from './getHtmlMinifySettings.js';
import { sortPropertyEntities } from './sortPropertyEntities.js';
import { hasLoopedEvents } from './hasLoopedEvents.js';
import { getBindingLines } from './getBindingLines.js';

const isObject = (val) => (typeof val === 'object' && !Array.isArray(val) && val !== null);

export class Generator {
  // @ts-ignore
  #options = {};
  #minHtml = false;
  #minCss = false;
  #noMinElements = [];
  // @ts-ignore
  #inputHandlerIndex = 1;

  async srcFromComponent(component, options, outputScriptPath) {
    this.#options = options;
    const {
      className,
      classScript,
      eventList,
      extendsClass,
      extendsTag,
      inputHandlerList,
      properties,
      rootScript,
      shadow,
      style,
      tag,
      template,
    } = component;

    const { minify, addDebug } = options;
    this.#minHtml = !!minify;
    this.#minCss = !!minify;
    if (isObject(minify)) {
      this.#minHtml = !!minify.html;
      this.#minCss = !!minify.css;
      this.#noMinElements = minify.noMinElements || [];
    }

    const html = await this.#buildTemplate(template);
    const css = await this.#buildCss(style);
    let eventHandlers = (eventList.length > 0)
      ? `\n\n    // Event handlers\n    ${eventList.join(';\n    ')};`
      : '';
    let inputHandlers = (inputHandlerList.length > 0)
      ? `\n\n  // Input handlers\n  ${inputHandlerList.join('\n\n  ')}`
      : '';


    const sourceParams = {
      addDebug,
      className,
      classScript: prepClassScript(classScript),
      css,
      eventHandlers,
      extendsTag,
      extendsClass,
      html,
      inputHandlers,
      properties,
      rootScript: prepRootScript(rootScript),
      shadow,
      tag
    };

    const sourceCode = this.#buildSourceCode(sourceParams, options, outputScriptPath);

    return sourceCode;
  }

  #processPropertyScript(properties) {
    // eslint-disable-next-line no-unused-vars
    let script = Object.entries(properties).sort(sortPropertyEntities).map(([_,prop]) => {
      const { attrName, propName, propDescription = '', privatePropName, type, objType, setHostAttr, elements = {}, min, max } = prop;
      let loopHandler = [];
      let loopingCode = [];
      let bindingList = [];

      Object.entries(elements).forEach(([elName, data]) => {
        const { forLoop } = data;
        bindingList = getBindingLines(elName, data, bindingList );
        if (forLoop) {
          const { forEventInfo, bindings, loopItemHandlerName, indexName, item: itemName } = forLoop;
          const usesEvents = forEventInfo.length > 0;
          const eventsArg = usesEvents ? ', events' : '';
          const elFieldName = elName.split('.').slice(-1)[0];

          loopingCode.push(`// Call looping code to generate DOM elements based on data in "propName"`);
          loopingCode.push(`this.forLoop('${elFieldName}', newVal, '${forLoop.key}', (els, idx, item, evts) => this.${loopItemHandlerName}(els, idx, item, evts));`);

          loopHandler.push(`/**`);
          loopHandler.push(` * Process the binding and adding of events to the various DOM elements`);
          loopHandler.push(` * for this instance of a looped array`);
          loopHandler.push(` * @param {object} els The DOM element for this instance of a loop`);
          loopHandler.push(` * @param {number} ${indexName} The index into the loop array`);
          loopHandler.push(` * @param {object} ${itemName} The data to bind to DOM elements`);
          loopHandler.push(` * @param {array} [events] An array of event handlers to add to the DOM element`);
          loopHandler.push(` */`);
          loopHandler.push(`${loopItemHandlerName}(els, ${indexName}, ${itemName}${eventsArg}) {`);
          loopHandler.push(`  // fill in attributes and properties`);
          // @ts-ignore
          const { has2WayBinding } = getForBindingLines(bindings, loopHandler); // eslint-disable-line no-unused-vars
          if (usesEvents) {
            loopHandler.push(`  // add event handlers`);
            loopHandler.push(`  if(events) {`);
            forEventInfo.forEach(eventStr => {
              loopHandler.push(`    events.push(${eventStr});`);
            })
            loopHandler.push(`  }`);
          }
          loopHandler.push(`  // Set the key on the looped element`);
          loopHandler.push(`  setAttr(${elName}, 'key', ${forLoop.item}.${forLoop.key});`);
          loopHandler.push(`}`);
        }
      });

      if (setHostAttr) {
        bindingList.push(`setAttr( this, '${attrName}', newVal );`);
      }

      // @ts-ignore
      loopHandler = loopHandler.length ? `\n  ${loopHandler.join('\n  ')}\n` : '';
      // @ts-ignore
      loopingCode = loopingCode.length ? `\n      ${loopingCode.join('\n      ')}` : '';
      // @ts-ignore
      bindingList = bindingList.length ? `\n      ${bindingList.join('\n      ')}` : '';

      const typeConversion = getTypeConversion(type, min, max);
      const dataType = getDataType(type, objType);
      const comparison = getChangeComparison(type);
      let returnValue = `this.${privatePropName}`;
      if( type === 'arr' || type === 'obj') {
        returnValue = `structuredClone(${returnValue})`;
      }
      if(type === 'date') {
        returnValue = `${returnValue} == null ? null : new Date(${returnValue})`;
      }

      return `${loopHandler}
  /** @type {${dataType}}${propDescription ? ` - ${propDescription}` : ''} */
  get ${propName}() {
    return ${returnValue};
  }
  set ${propName}(newVal) {${typeConversion}
    const oldVal = this.${privatePropName};
    if(${comparison}) {
      this.${privatePropName} = newVal;${bindingList}${loopingCode}
      this.#callUpdate('${propName}', oldVal, newVal);
    }
  }`;
    }).join('\n');

    return script ? `
${script}` : script;
  }

  #buildSourceCode(data, options, outputScriptPath) {
    const {
      addDebug,
      className,
      classScript,
      css,
      eventHandlers,
      extendsTag,
      extendsClass,
      html,
      inputHandlers,
      properties,
      rootScript,
      shadow,
      tag
    } = data;

    const COMPILE_DATE = new Date();
    const COMPILE_DATE_ISO = COMPILE_DATE.toISOString();
    const COMPILE_DATE_STR = formatDate(COMPILE_DATE);
    // @ts-ignore
    const EVO_VERSION = options.version;
    // Try to locate EvoElement.js inside the versioned folder
    let importPath = path.resolve(options.paths.componentsRoot, `../Evo-${EVO_VERSION}/EvoElement.js`);
    if (!fs.existsSync(importPath)) {
      // If the versioned copy does not exist then use the copy in the js folder
      importPath = path.resolve(options.paths.componentsRoot, `../EvoElement.js`);
    }

    importPath = path.relative(outputScriptPath, importPath);

    const debugConstructor = addDebug ? `\nconsole.info('${className}.constructor called')` : '';
    const debugDefined = addDebug ? `
customElements.whenDefined('${tag}').then(() => {
  console.info('${tag} defined');
});

console.info('Loading file for ${tag}');
` : '';

    const createDomParams = getDomParams(html, css, shadow);
    const defineOptions = extendsTag && `, { extends: '${extendsTag}' }`;
    const hasProperties = Object.keys(properties).length > 0;
    const useEls = hasProperties || !!eventHandlers;
    const usesAel = !!eventHandlers || hasLoopedEvents(properties);

    const callUpdate = hasProperties ? `

  // --------------------------------------------------------
  // This is called when any CPA is updated
  // --------------------------------------------------------
  #callUpdate(cpa, oldVal, newVal) {
    // @ts-ignore
    if (this.isConnected && this.update) {
      this.update({cpa, oldVal, newVal});
    }
  }` : '';
    const commentElsStr = prepCommentEls(properties);
    const usesComments = !!commentElsStr;
    const { privateClassFields, setDefaultValues, observedAttributes } = processProperties(useEls, usesComments, properties);

    const observables = getObservables(observedAttributes);
    const elsConstructor = useEls ? 'this.#els = ' : '';
    const elsFreeze = useEls ? '\n    Object.freeze(this.#els);' : '';
    const propertyScript = this.#processPropertyScript(properties);
    const importList = getImports(properties, rootScript, classScript, usesAel);
    //const importPath = '../EvoElement.js';
    const callInit = classScript ? `

    // If your class has an init function then we call it.
    if(this.init) {
     this.init();
    }` : '';

    const sourceCode = `/* globals customElements */
//*****************************************************************
// Auto generated code for the <${tag}> component
// Class: ${className}
// Generated on: ${COMPILE_DATE_STR}
//*****************************************************************${debugDefined}
import { ${importList.join(', ')} } from '${importPath}';${rootScript}

// --------------------------------------------------------
// Component information variables
// --------------------------------------------------------
/** @type {string} - Class name of this component */
export const componentName = '${className}';

/** @type {string} - Tag name of this component */
export const tagName = '${tag}';${html}${css}

// --------------------------------------------------------
// Define the class ${className} for component <${tag}>
// --------------------------------------------------------
export class ${className} extends EvoElement(${extendsClass}) {${privateClassFields}${observables}
  constructor() {
    super();${debugConstructor}
    ${elsConstructor}this.createDom(${createDomParams});${elsFreeze}${commentElsStr}${setDefaultValues}${eventHandlers}${callInit}
  }${callUpdate}${inputHandlers}

  // --------------------------------------------------------
  // Properties
  // --------------------------------------------------------
  /** @type {Date} - When this component was built */
  get _buildDate() {
    return new Date('${COMPILE_DATE_ISO}');
  }

  /** @type {string} - The build version that generated this file */
  get _buildVersion() {
    return '${EVO_VERSION}';
  }${propertyScript}${classScript}
}

// Define the custom element <${tag}>
customElements.define(tagName, ${className}${defineOptions});
`;

    return sourceCode;
  }

  async #buildCss(css) {
    let temp = this.#minCss ? await htmlMin(css, HTML_MIN_SETTINGS) : css;
    return temp && `

/** @type {string} - CSS Styles string */
export const styles = \`${temp.replace(/`/g, '\\`') }\`;`
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
      const settings = getHtmlMinifySettings(this.#noMinElements)
      templateStr = (await htmlMin(templateStr, settings)).trim();
    }
    templateStr &&= `

/** @type {string} - HTML template string */
export const template = \`${templateStr.replace(/`/g, '\\`')}\`;`;

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
        const { tag, elementName, attrs, children } = el;
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
            // If there is only one child and that child is just white space then there are no children.
            if(children.length === 1 && typeof children[0] === 'string' && children[0].trim() === '') {
              elementTag += children[0];
            }
            else {
              throw new Error(`The tag "${tag}" is self closing and can not have children`);
            }
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
        elementTag += el;
      }
    });

    return elementTag;
  }
}
