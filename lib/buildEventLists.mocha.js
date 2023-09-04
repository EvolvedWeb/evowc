/* eslint-env mocha */
const expect = require('chai').expect;
const buildEventLists = require('./buildEventLists.js')

describe('buildEventLists tests', function () {
  it('should process no bindings, events, children or foorLoops', () => {
    const list = [
      {
        bindings: [],
        children: [],
        element: 'el0',
        events: [],
        forLoop: null
      }
    ];
    const expected = {
      eventList: [],
      inputHandlerList: []
    };
    const resp = buildEventLists(list)
    expect(resp).to.eql(expected);
  });

  it('should process just text', () => {
    const list = [
      "This is a test"
    ];
    const expected = {
      eventList: [],
      inputHandlerList: []
    };
    const resp = buildEventLists(list)
    expect(resp).to.eql(expected);
  });

  it('should process just events', () => {
    const list = [
      {
        bindings: [],
        children: [],
        element: 'el0',
        events: {
          "submit": "#changePw"
        },
        forLoop: null
      },
      {
        bindings: [],
        children: [],
        element: 'el1',
        events: {
          "click": "#clickme"
        },
        forLoop: null
      }
    ];

    const expected = {
      eventList: [
        "ael( el0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}) );",
        "ael( el1, 'click', (evt)=>this.#clickme(evt, {...evt.target.dataset}) );"
      ],
      inputHandlerList: []
    };
    const resp = buildEventLists(list)
    expect(resp).to.eql(expected);
  });

  it('should process just events and children', () => {
    const list = [
      {
        bindings: [],
        children: [
          {
            bindings: [],
            children: [],
            element: 'el1',
            events: {
              "click": "#clickme"
            },
            forLoop: null
          }
        ],
        element: 'el0',
        events: {
          "submit": "#changePw"
        },
        forLoop: null
      }
    ];

    const expected = {
      eventList: [
        "ael( el0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}) );",
        "ael( el1, 'click', (evt)=>this.#clickme(evt, {...evt.target.dataset}) );"
      ],
      inputHandlerList: []
    };
    const resp = buildEventLists(list)
    expect(resp).to.eql(expected);
  });

  it.skip('should process just bindings', () => {
    const list = [
      {
        bindings: [
          {
            "add2WayBinding": true,
            "attribute": "text",
            "inForLoop": false,
            "loopItemHandlerName": "#loopItemHandler_1",
            "prop": "textContent",
            "setterProp": "newVal",
            "srcField": "reverseButtonText",
            "srcObj": "this",
            "srcVar": "this.reverseButtonText",
            "type": "prop"
          }
        ],
        children: [
          {
            bindings: [
              {
                "add2WayBinding": true,
                "attribute": "label",
                "inForLoop": true,
                "loopItemHandlerName": "#loopItemHandler_2",
                "prop": "label",
                "setterProp": "this.title",
                "srcField": "title",
                "srcObj": "this",
                "srcVar": "this.title",
                "type": "attr"
              }
            ],
            children: [
              {
                bindings: [
                  {
                    "add2WayBinding": true,
                    "attribute": "value",
                    "inForLoop": true,
                    "loopItemHandlerName": "#loopItemHandler_3",
                    "prop": "value",
                    "setterProp": "this.title",
                    "srcField": "title",
                    "srcObj": "this",
                    "srcVar": "this.title",
                    "type": "prop"
                  }
                ],
                children: [],
                element: 'el2',
                events: null,
                forLoop: null
              }
            ],
            element: 'el1',
            events: null,
            forLoop: null
          }
        ],
        element: 'el0',
        events: null,
        forLoop: null
      }
    ];

    const expected = {
      eventList: [
        "ael( el0, 'input', (evt)=>this.#reverseButtonText_onInputHandler_0(evt, {...evt.target.dataset}) );",
        "ael( el2, 'input', (evt)=>this.#title_onInputHandler_1(evt, {...evt.target.dataset}) );"
      ],
      inputHandlerList: [
        "/**\n   * Input handler for the class property \"this.reverseButtonText\"\n   * @param {KeyboardEvent} evt - The \"input\" KeyboardEvent\n   * @param {object} data - The values for \"evt.target.dataset\"\n   */\n  #reverseButtonText_onInputHandler_0(evt, data) {\n    // @ts-ignore\n    undefined\n  }",
        "/**\n   * Input handler for the class property \"this.title\"\n   * @param {KeyboardEvent} evt - The \"input\" KeyboardEvent\n   * @param {object} data - The values for \"evt.target.dataset\"\n   */\n  #title_onInputHandler_1(evt, data) {\n    // @ts-ignore\n    undefined\n  }"
      ]
    };
    const resp = buildEventLists(list);
    console.log(JSON.stringify(resp,0,2));
    expect(resp).to.eql(expected);
  });
});
