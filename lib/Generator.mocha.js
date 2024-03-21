/* eslint-env mocha */
import { expect } from 'chai';
import { Generator } from './Generator.js';

describe('Generator tests', () => {
  it('should handle no template, no css and no script', async () => {
    const component = {
      className: 'TestClassElement',
      classScript: '',
      eventList: [],
      extendsClass: '',
      extendsTag: '',
      inputHandlerList: [],
      properties: {},
      rootScript: '',
      shadow: 'open',
      style: '',
      tag: 'test-class',
      template: [],
    };
    const options = {
      minify: true,
      addDebug: false,
      paths: {
        componentsRoot: './dogs'
      },
      version: '1.2.3'
    };
    const outputScriptPath = '';

    const generator = new Generator();
    const resp = await generator.srcFromComponent(component, options, outputScriptPath);
    expect(resp.includes(`// Start of your root script code`)).to.equal(false);
    expect(resp.includes(`export const styles`)).to.equal(false);
    expect(resp.includes(`export const template`)).to.equal(false);
    expect(resp.includes(`import { EvoElement } from 'EvoElement.js';`)).to.equal(true);
    expect(resp.includes(`export const componentName = '${component.className}';`)).to.equal(true);
    expect(resp.includes(`export const tagName = '${component.tag}';`)).to.equal(true);
    expect(resp.includes(`export class ${component.className} extends EvoElement() {`)).to.equal(true);
    expect(resp.includes(`customElements.define(tagName, ${component.className});`)).to.equal(true);
    expect(resp.includes(`// Start of your code`)).to.equal(false);
  });

  it('should handle css and script but no template', async () => {
    const component = {
      className: 'SomeThingElement',
      classScript: 'init() {\n    // Hi there\n  }',
      eventList: [],
      extendsClass: '',
      extendsTag: '',
      inputHandlerList: [],
      properties: {},
      rootScript: 'import from \'./SomethingElse.js\';',
      shadow: 'open',
      style: `.thing {
  background:white;
}`,
      tag: 'some-thing',
      template: [],
    };
    const options = {
      minify: {
        html: true,
        css: false
      },
      addDebug: false,
      paths: {
        componentsRoot: './dogs/cats'
      },
      version: '1.2.3'
    };
    const outputScriptPath = '';

    const generator = new Generator();
    const resp = await generator.srcFromComponent(component, options, outputScriptPath);
    expect(resp.includes(`// Start of your root script code\n${component.rootScript}\n// End of your root script code`)).to.equal(true);
    expect(resp.includes(`import { EvoElement, createStyles } from 'dogs/EvoElement.js';`)).to.equal(true, `import { EvoElement } from 'dogs/EvoElement.js';`);
    expect(resp.includes(`export const styles = \`${component.style}\`;`)).to.equal(true, `export const styles = \`${component.style}\`;`);
    expect(resp.includes(`export const template`)).to.equal(false, `export const template`);
    expect(resp.includes(`export const componentName = '${component.className}';`)).to.equal(true, `export const componentName = '${component.className}';`);
    expect(resp.includes(`export const tagName = '${component.tag}';`)).to.equal(true, `export const tagName = '${component.tag}';`);
    expect(resp.includes(`export class ${component.className} extends EvoElement() {`)).to.equal(true, `export class ${component.className} extends EvoElement() {`);
    expect(resp.includes(`customElements.define(tagName, ${component.className});`)).to.equal(true, `customElements.define(tagName, ${component.className});`);
    expect(resp.includes(`  // Start of your code\n  ${component.classScript}\n  // End of your code`)).to.equal(true, `  // Start of your code${component.classScript}// End of your code`);
  });

  it('should handle a simple minified template', async () => {
    const component = {
      className: 'SimpleTemplateElement',
      classScript: '',
      eventList: [],
      extendsClass: '',
      extendsTag: '',
      inputHandlerList: [],
      properties: {},
      rootScript: '',
      shadow: 'closed',
      style: '',
      tag: 'simple-template',
      template: [
        "\n    ",
        {
          "tag": "div",
          "elementName": "el0",
          "element": "this.#els.el0",
          "elementStr": "<div class=\"frame\">",
          "attrs": {
            "class": "=\"frame\""
          },
          "bindings": [],
          "conditional": null,
          "events": null,
          "availableVars": [
            "this"
          ],
          "forLoop": null,
          "children": [
            "\n      Hi\n    "
          ],
          "forLoopStack": []
        },
        "\n  "
      ],
    };
    const options = {
      minify: {
        html: true,
        css: true
      },
      addDebug: false,
      paths: {
        componentsRoot: './components'
      },
      version: '3.1.8'
    };
    const outputScriptPath = '';

    const generator = new Generator();
    const resp = await generator.srcFromComponent(component, options, outputScriptPath);
    expect(resp.includes(`// Start of your root script code`)).to.equal(false);
    expect(resp.includes(`export const styles`)).to.equal(false);
    expect(resp.includes(`  // Start of your code`)).to.equal(false);
    expect(resp.includes(`export const template = \`<div class=frame el=el0> Hi </div>\`;`)).to.equal(true);
    expect(resp.includes(`import { EvoElement } from 'EvoElement.js';`)).to.equal(true);
    expect(resp.includes(`export const componentName = '${component.className}';`)).to.equal(true);
    expect(resp.includes(`export const tagName = '${component.tag}';`)).to.equal(true);
    expect(resp.includes(`export class ${component.className} extends EvoElement() {`)).to.equal(true);
    expect(resp.includes(`customElements.define(tagName, ${component.className});`)).to.equal(true);
    expect(resp.includes(`  get _buildVersion() {
    return '3.1.8';
  }
`)).to.equal(true);
  });

  it('should handle a simple NON-minified template and event handlers', async () => {
    const component = {
      className: 'SimpleTemplateElement',
      classScript: `#onClick(evt, data) {\n  }`,
      eventList: [
        "ael( this.#els.el0, 'click', (evt)=>this.#onClick(evt, {...evt.target.dataset}))"
      ],
      extendsClass: '',
      extendsTag: '',
      inputHandlerList: [],
      properties: {},
      rootScript: '',
      shadow: 'closed',
      style: '',
      tag: 'simple-template',
      template: [
        "\n    ",
        {
          "tag": "div",
          "elementName": "el0",
          "element": "this.#els.el0",
          "elementStr": "<div class=\"frame\" .click=\"#onClick\">",
          "attrs": {
            "class": "=\"frame\""
          },
          "bindings": [],
          "conditional": null,
          "events": null,
          "availableVars": [
            "this"
          ],
          "forLoop": null,
          "children": [
            "\n      Hi",
            {
              "tag": "br",
              "elementName": "",
              "element": "",
              "elementStr": "<br>",
              "attrs": {},
              "bindings": [],
              "conditional": null,
              "events": null,
              "availableVars": [
                "this"
              ],
              "forLoop": null,
              "children": [],
              "forLoopStack": []
            },
            {
              "tag": "br",
              "elementName": "",
              "element": "",
              "elementStr": "<br>",
              "attrs": {},
              "bindings": [],
              "conditional": null,
              "events": null,
              "availableVars": [
                "this"
              ],
              "forLoop": null,
              "children": [
                ' '
              ],
              "forLoopStack": []
            },
            "\n    "
          ],
          "forLoopStack": []
        },
        "\n  "
      ],
    };
    const options = {
      minify: {
        html: false,
        css: true
      },
      addDebug: true,
      paths: {
        componentsRoot: './components'
      },
      version: '3.1.8'
    };
    const outputScriptPath = '';

    const generator = new Generator();
    const resp = await generator.srcFromComponent(component, options, outputScriptPath);
    expect(resp.includes(`// Start of your root script code`)).to.equal(false);
    expect(resp.includes(`export const styles`)).to.equal(false);
    expect(resp.includes(`// Start of your code
  #onClick(evt, data) {
  }
  // End of your code
`)).to.equal(true);
    expect(resp.includes(`export const template = \`
    <div class="frame" el="el0">
      Hi<br/><br/>
    </div>
  \`;`)).to.equal(true);
    expect(resp.includes(`import { EvoElement, ael } from 'EvoElement.js';`)).to.equal(true, `import { EvoElement, ael } from 'EvoElement.js';`);
    expect(resp.includes(`export const componentName = '${component.className}';`)).to.equal(true, `export const componentName = '${component.className}';`);
    expect(resp.includes(`export const tagName = '${component.tag}';`)).to.equal(true, `export const tagName = '${component.tag}';`);
    expect(resp.includes(`export class ${component.className} extends EvoElement() {`)).to.equal(true, `export class ${component.className} extends EvoElement() {`);
    expect(resp.includes(`customElements.define(tagName, ${component.className});`)).to.equal(true, `customElements.define(tagName, ${component.className});`);
    expect(resp.includes(`console.info('SimpleTemplateElement.constructor called')
    this.#els = this.createDom({template,shadowMode:'closed',componentName});
    Object.freeze(this.#els);

    // Event handlers
    ael( this.#els.el0, 'click', (evt)=>this.#onClick(evt, {...evt.target.dataset}));
`)).to.equal(true);
    expect(resp.includes(`customElements.whenDefined('simple-template').then(() => {
  console.info('simple-template defined');
})`)).to.equal(true);
    expect(resp.includes(`  get _buildVersion() {
    return '3.1.8';
  }
`)).to.equal(true);
  });


  it('should handle properties and template', async () => {
    const component = {
      className: 'SomeThingElement',
      classScript: '',
      eventList: [],
      extendsClass: '',
      extendsTag: '',
      inputHandlerList: [],
      properties: {
        "#count": {
          "attrName": false,
          "defaultValue": 0,
          "elements": {
            "this.#els.el0": {
              "elementName": "el0",
              "elementStr": "<p :text=\"#count\">",
              "binding": [
                {
                  "add2WayBinding": false,
                  "attribute": "text",
                  "inForLoop": false,
                  "forLoopItem": {
                    "forElementName": "",
                    "indexName": "",
                    "itemName": "",
                    "loopItemHandlerName": ""
                  },
                  "prop": "textContent",
                  "setterProp": "newVal",
                  "srcField": "#count",
                  "srcObj": "this",
                  "srcVar": "this.#count",
                  "type": "prop"
                }
              ]
            }
          },
          "isPublic": false,
          "objType": "",
          "privatePropName": "#__count",
          "propName": "#count",
          "setHostAttr": false,
          "type": "int",
          "value": "int:0"
        }
      },
      rootScript: '',
      shadow: 'open',
      style: ``,
      tag: 'some-thing',
      template: [
        "\n    ",
        {
          "tag": "p",
          "elementName": "el0",
          "element": "this.#els.el0",
          "elementStr": "<p :text=\"#count\">",
          "attrs": {},
          "bindings": [
            {
              "add2WayBinding": false,
              "attribute": "text",
              "inForLoop": false,
              "forLoopItem": {
                "forElementName": "",
                "indexName": "",
                "itemName": "",
                "loopItemHandlerName": ""
              },
              "prop": "textContent",
              "setterProp": "newVal",
              "srcField": "#count",
              "srcObj": "this",
              "srcVar": "this.#count",
              "type": "prop"
            }
          ],
          "conditional": null,
          "events": null,
          "availableVars": [
            "this",
            "this.#count"
          ],
          "forLoop": null,
          "children": [],
          "forLoopStack": []
        },
        "\n    ",
        {
          "tag": "button",
          "elementName": "el1",
          "element": "this.#els.el1",
          "elementStr": "<button .click=\"#onClick\">",
          "attrs": {},
          "bindings": null,
          "conditional": null,
          "events": {
            "click": "#onClick"
          },
          "availableVars": [
            "this",
            "this.#count"
          ],
          "forLoop": null,
          "children": [
            "Click Me"
          ],
          "forLoopStack": []
        },
        "\n  "
      ],
    };
    const options = {
      minify: {
        html: true,
        css: false
      },
      addDebug: false,
      paths: {
        componentsRoot: './dogs/cats'
      },
      version: '1.2.3'
    };
    const outputScriptPath = '';

    const generator = new Generator();
    const resp = await generator.srcFromComponent(component, options, outputScriptPath);
    expect(resp.includes(`// Start of your root script code`)).to.equal(false);
    expect(resp.includes(`import { EvoElement } from 'dogs/EvoElement.js';`)).to.equal(true);
    expect(resp.includes(`export const styles`)).to.equal(false);
    expect(resp.includes(`export const template`)).to.equal(true);
    expect(resp.includes(`export const componentName = '${component.className}';`)).to.equal(true);
    expect(resp.includes(`export const tagName = '${component.tag}';`)).to.equal(true);
    expect(resp.includes(`export class ${component.className} extends EvoElement() {`)).to.equal(true);
    expect(resp.includes(`customElements.define(tagName, ${component.className});`)).to.equal(true);
    expect(resp.includes(`  // Start of your code`)).to.equal(false);
    expect(resp.includes(`  /** @type {number} */
  get #count() {
    return this.#__count;
  }
  set #count(newVal) {
    newVal = parseInt(newVal, 10);
    const oldVal = this.#__count;
    if(oldVal !== newVal) {
      this.#__count = newVal;
      // Set the property 'textContent' for the element: <p :text="#count">
      this.#els.el0.textContent = newVal ?? null;
      this.callUpdate({cpa: '#count', oldVal, newVal});
    }
  }
`)).to.equal(true);
  });

  /*
  Need to add the following tests:
  * Looping
  * Extending other element
  * Input Handlers
  * Set host Attr
  */
});
