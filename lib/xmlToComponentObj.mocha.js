import { expect } from 'chai';
import { xmlToComponentObj } from './xmlToComponentObj.js';

describe('xmlToComponentObj tests', () => {
  it('should process a simple component', () => {
    const xml = `<component tag="test-me" :#count="int:0">
  <template>
    <p :text="#count"></p>
    <button .click="#onClick">Click Me</button>
  </template>
  <style>
    :host {
      display: inline-block;
      text-align: center;
    }
  </style>
  <script>
    #onClick(event, data) {
      this.#count++;
    }
  </script>
</component>
`;

    const expected = {
      "tag": "test-me",
      "className": "TestMeElement",
      "shadow": "open",
      "extendsTag": "",
      "extendsClass": "",
      "fileExt": null,
      "rootScript": "",
      "classScript": "\n    #onClick(event, data) {\n      this.#count++;\n    }\n  ",
      "style": "\n    :host {\n      display: inline-block;\n      text-align: center;\n    }\n  ",
      "attributes": {},
      "properties": {
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
                  "default": undefined,
                  "forLoopItem": {
                    "forElementName": "",
                    "indexName": "",
                    "itemName": "",
                    "loopItemHandlerName": ""
                  },
                  "prop": "textContent",
                  "inputSetter": undefined,
                  "pipes": undefined,
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
          "max": undefined,
          "min": undefined,
          "objType": "",
          "privatePropName": "#__count",
          "propName": "#count",
          "setHostAttr": false,
          "type": "int",
          "value": "int:0"
        }
      },
      "template": [
        "\n    ",
        {
          "tag": "p",
          "elementName": "el0",
          "element": "this.#els.el0",
          "elementStr": "<p :text=\"#count\">",
          "attrs": {},
          "key": undefined,
          "bindings": [
            {
              "add2WayBinding": false,
              "attribute": "text",
              "default": undefined,
              "inForLoop": false,
              "inputSetter": undefined,
              "pipes": undefined,
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
          "forLoopStack": [],
          "key": undefined
        },
        "\n  "
      ],
      "eventList": [
        "ael( this.#els.el1, 'click', (evt)=>this.#onClick(evt, {...evt.target.dataset}))"
      ],
      "inputHandlerList": []
    };

    const resp = xmlToComponentObj(xml);
    expect(resp).to.eql(expected);
  });

  it('should throw exception for more than one component', () => {
    const xml = `<component tag="test-me1"></component>
    <component tag="test-me2"></component>`;

    function doIt() {
      xmlToComponentObj(xml);
    }
    expect(doIt).to.throw('Only one component per source file is allowed.');
  });

  it('should throw exception for no components', () => {
    const xml = `<dog>`;

    function doIt() {
      xmlToComponentObj(xml);
    }
    expect(doIt).to.throw('Source File did not process correctly.');
  });
});
