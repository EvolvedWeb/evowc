import { expect } from 'chai';
import { Component } from './Component.js';

describe('Component class tests', function () {
  it('should handle parsing bad tag name', () => {
    const attrs = { tag: 'myel' };

    function errorFunction() {
      return new Component(attrs)
    }

    expect(errorFunction).to.throw('Invalid element name "myel"');
    attrs.tag = 'font-face';
    expect(errorFunction).to.throw('Invalid element name "font-face"');
    attrs.tag = 'some--thing';
    expect(errorFunction).to.throw('Invalid element name "some--thing"');
    attrs.tag = 'No-Upper';
    expect(errorFunction).to.throw('Invalid element name "No-Upper"');
    attrs.tag = '-bad-name-';
    expect(errorFunction).to.throw('Invalid element name "-bad-name-"');
    attrs.tag = undefined;
    expect(errorFunction).to.throw('Invalid element name "undefined"');
  });

  it('should handle parsing with no children', () => {
    const attrs = {
      tag: 'my-el',
      shadow: 'dogs',
      ext: 'ts',
      ':message': true,
      ':title': true,
      ':show': 'bool:true',
      ':+state': 'string:alert',
      'my-attr': 'here'
    }

    const expected = {
      tag: 'my-el',
      attributes: {
        "my-attr": "here"
      },
      className: 'MyElElement',
      shadow: 'open',
      extendsTag: '',
      extendsClass: '',
      fileExt: '.ts',
      rootScript: '',
      classScript: '',
      style: '',
      properties: {
        message: {
          attrName: 'message',
          defaultValue: "''",
          elements: {},
          isPublic: true,
          objType: '',
          privatePropName: '#_message',
          propName: 'message',
          setHostAttr: false,
          type: 'str',
          value: true
        },
        title: {
          attrName: 'title',
          defaultValue: "''",
          elements: {},
          isPublic: true,
          objType: '',
          privatePropName: '#_title',
          propName: 'title',
          setHostAttr: false,
          type: 'str',
          value: true
        },
        show: {
          attrName: 'show',
          defaultValue: true,
          elements: {},
          isPublic: true,
          objType: '',
          privatePropName: '#_show',
          propName: 'show',
          setHostAttr: false,
          type: 'bool',
          value: 'bool:true'
        },
        state: {
          attrName: 'state',
          defaultValue: "'alert'",
          elements: {},
          isPublic: true,
          objType: '',
          privatePropName: '#_state',
          propName: 'state',
          setHostAttr: true,
          type: 'str',
          value: 'string:alert'
        }
      },
      template: [],
      eventList: [],
      inputHandlerList: []
    };

    const c = new Component(attrs);
    const data = c.toJSON();
    expect(data).to.eql(expected);
  });

  it('should handle attrs and children', () => {
    const { attrs, children, expected } = getSecondTestData();
    const c = new Component(attrs, children);
    const data = c.toJSON();
    expect(data).to.eql(expected);
  });
});

function getSecondTestData() {
  const attrs = {
    tag: 'alert-box',
    ':message': true,
    ':title': true,
    ':icon': true,
    ':state': 'string:alert',
    ':popup': 'bool:false',
    ':disabled': 'bool:false'
  };

  const children = [
    { "$": "\n  " },
    {
      "template": [
        { "$": "\n    " },
        {
          "div": [
            { "$": "\n      " },
            {
              "button": [],
              ":@": { "class": "closer", ".click": "#handler:pi" }
            },
            { "$": "\n      " },
            {
              "span": [],
              ":@": { "$if": "icon", ":attr.icon": "icon" }
            },
            { "$": "\n      " },
            {
              "div": [],
              ":@": {
                "$if": "title",
                "class": "title",
                ":html": "title"
              }
            },
            { "$": "\n      " },
            {
              "div": [],
              ":@": { "class": "message", ":html": "message" }
            },
            { "$": "\n    " }
          ],
          ":@": { "class": "frame", ":attr.state": "state", ":attr.is-popup": "popup" }
        },
        { "$": "\n  " }
      ]
    },
    { "$": "\n  " },
    {
      "style": [ { "$": "\n    :host {\n      display: block;\n      height: fit-content;\n      margin: 2px 0;\n      --alert-box-bgcolor: #EFE;\n      --alert-box-bordercolor: #6D6;\n    }\n\n    :host([popup]) {\n      display: inline-block;\n      left: 50%;\n      position: fixed;\n      top: 50%;\n      transform: translate(-50%, -50%);\n    }\n\n    .frame[state=info] {\n      --alert-box-bgcolor: #DDF;\n      --alert-box-bordercolor: #66D;\n    }\n\n    .frame[state=warn],.frame[state=warning] {\n      --alert-box-bgcolor: #FFD;\n      --alert-box-bordercolor: #DD6;\n    }\n\n    .frame[state=alert], .frame[state=error] {\n      --alert-box-bgcolor: #FDD;\n      --alert-box-bordercolor: #D66;\n    }\n\n    .frame {\n      background-color: var(--alert-box-bgcolor, #FFF);\n      border: 1px solid var(--alert-box-bordercolor, #000);\n      border-radius: 0;\n      font: 16px var(--alert-box-font, Calibri, Candara, Segoe, \"Segoe UI\", Optima, Arial, sans-serif);\n      padding: 10px 25px 10px 10px;\n      position: relative;\n    }\n\n    :host([popup]) .frame {\n      border-radius: 5px;\n    }\n\n    .closer {\n      display: none;\n    }\n\n    :host([popup]) .closer {\n      all: unset;\n      border: 1px solid transparent;\n      border-radius: 3px;\n      display: inline-block;\n      height: 12px;\n      position: absolute;\n      right: 3px;\n      top: 3px;\n      width: 12px\n    }\n\n    .closer:hover {\n      background: #0001;\n      border-color: var(--alert-box-bordercolor, #000);\n      cursor: pointer;\n    }\n\n    .closer::after,\n    .closer::before {\n      border-left: 1px solid var(--alert-box-bordercolor, #000);\n      content: '';\n      display: inline-block;\n      height: 10px;\n      left: 50%;\n      position: absolute;\n      top: 50%;\n      transform: translate(-50%, -50%) rotate(45deg);\n      width: 0;\n    }\n\n    .closer::after {\n      transform: translate(-50%, -50%) rotate(-45deg);\n    }\n\n    .closer:hover::after,\n    .closer:hover::before {\n      border-left-color:#0008;\n    }\n  " } ]
    },
    { "$": "\n  " },
    {
      "script": [ { "$": "\n    #handler() {\n      console.log('clicked on it');\n    }\n  " } ]
    },
    { "$": "\n" }
  ];

  const expected = {
    "tag": "alert-box",
    "className": "AlertBoxElement",
    "shadow": "open",
    "extendsTag": "",
    "extendsClass": "",
    "fileExt": null,
    "rootScript": "",
    "classScript": "#handler() {\n      console.log('clicked on it');\n    }",
    "style": ":host {\n      display: block;\n      height: fit-content;\n      margin: 2px 0;\n      --alert-box-bgcolor: #EFE;\n      --alert-box-bordercolor: #6D6;\n    }\n\n    :host([popup]) {\n      display: inline-block;\n      left: 50%;\n      position: fixed;\n      top: 50%;\n      transform: translate(-50%, -50%);\n    }\n\n    .frame[state=info] {\n      --alert-box-bgcolor: #DDF;\n      --alert-box-bordercolor: #66D;\n    }\n\n    .frame[state=warn],.frame[state=warning] {\n      --alert-box-bgcolor: #FFD;\n      --alert-box-bordercolor: #DD6;\n    }\n\n    .frame[state=alert], .frame[state=error] {\n      --alert-box-bgcolor: #FDD;\n      --alert-box-bordercolor: #D66;\n    }\n\n    .frame {\n      background-color: var(--alert-box-bgcolor, #FFF);\n      border: 1px solid var(--alert-box-bordercolor, #000);\n      border-radius: 0;\n      font: 16px var(--alert-box-font, Calibri, Candara, Segoe, \"Segoe UI\", Optima, Arial, sans-serif);\n      padding: 10px 25px 10px 10px;\n      position: relative;\n    }\n\n    :host([popup]) .frame {\n      border-radius: 5px;\n    }\n\n    .closer {\n      display: none;\n    }\n\n    :host([popup]) .closer {\n      all: unset;\n      border: 1px solid transparent;\n      border-radius: 3px;\n      display: inline-block;\n      height: 12px;\n      position: absolute;\n      right: 3px;\n      top: 3px;\n      width: 12px\n    }\n\n    .closer:hover {\n      background: #0001;\n      border-color: var(--alert-box-bordercolor, #000);\n      cursor: pointer;\n    }\n\n    .closer::after,\n    .closer::before {\n      border-left: 1px solid var(--alert-box-bordercolor, #000);\n      content: '';\n      display: inline-block;\n      height: 10px;\n      left: 50%;\n      position: absolute;\n      top: 50%;\n      transform: translate(-50%, -50%) rotate(45deg);\n      width: 0;\n    }\n\n    .closer::after {\n      transform: translate(-50%, -50%) rotate(-45deg);\n    }\n\n    .closer:hover::after,\n    .closer:hover::before {\n      border-left-color:#0008;\n    }",
    "attributes": {},
    "properties": {
      "message": {
        "attrName": "message",
        "defaultValue": "''",
        "elements": {
          "this.#els.el4": {
            "elementName": "el4",
            "elementStr": "<div class=\"message\" :html=\"message\">",
            "binding": [
              {
                "add2WayBinding": false,
                "attribute": "html",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "innerHTML",
                "setterProp": "newVal",
                "srcField": "message",
                "srcObj": "this",
                "srcVar": "this.message",
                "type": "prop"
              }
            ]
          }
        },
        "isPublic": true,
        "objType": "",
        "privatePropName": "#_message",
        "propName": "message",
        "setHostAttr": false,
        "type": "str",
        "value": true
      },
      "title": {
        "attrName": "title",
        "defaultValue": "''",
        "elements": {
          "this.#els.el3": {
            "elementName": "el3",
            "elementStr": "<div $if=\"title\" class=\"title\" :html=\"title\">",
            "binding": [
              {
                "add2WayBinding": false,
                "attribute": "html",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "innerHTML",
                "setterProp": "newVal",
                "srcField": "title",
                "srcObj": "this",
                "srcVar": "this.title",
                "type": "prop"
              }
            ],
            "conditional": {
              "variable": "title",
              "value": true
            }
          }
        },
        "isPublic": true,
        "objType": "",
        "privatePropName": "#_title",
        "propName": "title",
        "setHostAttr": false,
        "type": "str",
        "value": true
      },
      "icon": {
        "attrName": "icon",
        "defaultValue": "''",
        "elements": {
          "this.#els.el2": {
            "elementName": "el2",
            "elementStr": "<span $if=\"icon\" :attr.icon=\"icon\">",
            "binding": [
              {
                "add2WayBinding": false,
                "attribute": "icon",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "icon",
                "setterProp": "newVal",
                "srcField": "icon",
                "srcObj": "this",
                "srcVar": "this.icon",
                "type": "attr"
              }
            ],
            "conditional": {
              "variable": "icon",
              "value": true
            }
          }
        },
        "isPublic": true,
        "objType": "",
        "privatePropName": "#_icon",
        "propName": "icon",
        "setHostAttr": false,
        "type": "str",
        "value": true
      },
      "state": {
        "attrName": "state",
        "defaultValue": "'alert'",
        "elements": {
          "this.#els.el0": {
            "elementName": "el0",
            "elementStr": "<div class=\"frame\" :attr.state=\"state\" :attr.is-popup=\"popup\">",
            "binding": [
              {
                "add2WayBinding": false,
                "attribute": "state",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "state",
                "setterProp": "newVal",
                "srcField": "state",
                "srcObj": "this",
                "srcVar": "this.state",
                "type": "attr"
              }
            ]
          }
        },
        "isPublic": true,
        "objType": "",
        "privatePropName": "#_state",
        "propName": "state",
        "setHostAttr": false,
        "type": "str",
        "value": "string:alert"
      },
      "popup": {
        "attrName": "popup",
        "defaultValue": false,
        "elements": {
          "this.#els.el0": {
            "elementName": "el0",
            "elementStr": "<div class=\"frame\" :attr.state=\"state\" :attr.is-popup=\"popup\">",
            "binding": [
              {
                "add2WayBinding": false,
                "attribute": "is-popup",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "isPopup",
                "setterProp": "newVal",
                "srcField": "popup",
                "srcObj": "this",
                "srcVar": "this.popup",
                "type": "attr"
              }
            ]
          }
        },
        "isPublic": true,
        "objType": "",
        "privatePropName": "#_popup",
        "propName": "popup",
        "setHostAttr": false,
        "type": "bool",
        "value": "bool:false"
      },
      "disabled": {
        "attrName": "disabled",
        "defaultValue": false,
        "elements": {},
        "isPublic": true,
        "objType": "",
        "privatePropName": "#_disabled",
        "propName": "disabled",
        "setHostAttr": false,
        "type": "bool",
        "value": "bool:false"
      }
    },
    "template": [
      "\n    ",
      {
        "tag": "div",
        "elementName": "el0",
        "element": "this.#els.el0",
        "elementStr": "<div class=\"frame\" :attr.state=\"state\" :attr.is-popup=\"popup\">",
        "attrs": {
          "class": "=\"frame\""
        },
        "bindings": [
          {
            "add2WayBinding": false,
            "attribute": "state",
            "default": undefined,
            "forLoopItem": {
              "forElementName": "",
              "indexName": "",
              "itemName": "",
              "loopItemHandlerName": ""
            },
            "inForLoop": false,
            "inputSetter": undefined,
            "pipes": undefined,
            "prop": "state",
            "setterProp": "newVal",
            "srcField": "state",
            "srcObj": "this",
            "srcVar": "this.state",
            "type": "attr"
          },
          {
            "add2WayBinding": false,
            "attribute": "is-popup",
            "default": undefined,
            "forLoopItem": {
              "forElementName": "",
              "indexName": "",
              "itemName": "",
              "loopItemHandlerName": ""
            },
            "inForLoop": false,
            "inputSetter": undefined,
            "pipes": undefined,
            "prop": "isPopup",
            "setterProp": "newVal",
            "srcField": "popup",
            "srcObj": "this",
            "srcVar": "this.popup",
            "type": "attr"
          }
        ],
        "conditional": null,
        "events": null,
        "availableVars": [
          "this",
          "this.message",
          "this.title",
          "this.icon",
          "this.state",
          "this.popup",
          "this.disabled"
        ],
        "forLoop": null,
        "key": undefined,
        "children": [
          "\n      ",
          {
            "tag": "button",
            "elementName": "el1",
            "element": "this.#els.el1",
            "elementStr": "<button class=\"closer\" .click=\"#handler:pi\">",
            "attrs": {
              "class": "=\"closer\""
            },
            "bindings": null,
            "conditional": null,
            "events": {
              "click": "#handler:pi"
            },
            "availableVars": [
              "this",
              "this.message",
              "this.title",
              "this.icon",
              "this.state",
              "this.popup",
              "this.disabled"
            ],
            "forLoop": null,
            "key": undefined,
            "children": [],
            "forLoopStack": []
          },
          "\n      ",
          {
            "tag": "span",
            "elementName": "el2",
            "element": "this.#els.el2",
            "elementStr": "<span $if=\"icon\" :attr.icon=\"icon\">",
            "attrs": {},
            "bindings": [
              {
                "add2WayBinding": false,
                "attribute": "icon",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "icon",
                "setterProp": "newVal",
                "srcField": "icon",
                "srcObj": "this",
                "srcVar": "this.icon",
                "type": "attr"
              }
            ],
            "conditional": {
              "variable": "icon",
              "value": true
            },
            "events": null,
            "availableVars": [
              "this",
              "this.message",
              "this.title",
              "this.icon",
              "this.state",
              "this.popup",
              "this.disabled"
            ],
            "forLoop": null,
            "key": undefined,
            "children": [],
            "forLoopStack": []
          },
          "\n      ",
          {
            "tag": "div",
            "elementName": "el3",
            "element": "this.#els.el3",
            "elementStr": "<div $if=\"title\" class=\"title\" :html=\"title\">",
            "attrs": {
              "class": "=\"title\""
            },
            "bindings": [
              {
                "add2WayBinding": false,
                "attribute": "html",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "innerHTML",
                "setterProp": "newVal",
                "srcField": "title",
                "srcObj": "this",
                "srcVar": "this.title",
                "type": "prop"
              }
            ],
            "conditional": {
              "variable": "title",
              "value": true
            },
            "events": null,
            "availableVars": [
              "this",
              "this.message",
              "this.title",
              "this.icon",
              "this.state",
              "this.popup",
              "this.disabled"
            ],
            "forLoop": null,
            "key": undefined,
            "children": [],
            "forLoopStack": []
          },
          "\n      ",
          {
            "tag": "div",
            "elementName": "el4",
            "element": "this.#els.el4",
            "elementStr": "<div class=\"message\" :html=\"message\">",
            "attrs": {
              "class": "=\"message\""
            },
            "bindings": [
              {
                "add2WayBinding": false,
                "attribute": "html",
                "default": undefined,
                "forLoopItem": {
                  "forElementName": "",
                  "indexName": "",
                  "itemName": "",
                  "loopItemHandlerName": ""
                },
                "inForLoop": false,
                "inputSetter": undefined,
                "pipes": undefined,
                "prop": "innerHTML",
                "setterProp": "newVal",
                "srcField": "message",
                "srcObj": "this",
                "srcVar": "this.message",
                "type": "prop"
              }
            ],
            "conditional": null,
            "events": null,
            "availableVars": [
              "this",
              "this.message",
              "this.title",
              "this.icon",
              "this.state",
              "this.popup",
              "this.disabled"
            ],
            "forLoop": null,
            "key": undefined,
            "children": [],
            "forLoopStack": []
          },
          "\n    "
        ],
        "forLoopStack": []
      },
      "\n  "
    ],
    "eventList": [
      "ael( this.#els.el1, 'click', (evt)=>{\n      evt.preventDefault();\n      evt.stopImmediatePropagation();\n      this.#handler(evt, {...evt.target.dataset});\n    })"
    ],
    "inputHandlerList": []
  };

  return { attrs, children, expected };
}