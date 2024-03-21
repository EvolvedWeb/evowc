import { expect } from 'chai';
import { getPSICode, getCP1Code, buildEventLists, ResetInputHandlerIndex } from './buildEventLists.js';

describe('buildEventLists.js tests', () => {
  describe('getCP1Code tests', () => {
    it('should handle no CP1 codes', () => {
      const resp = getCP1Code('click');
      const expected = {
        evt: 'click',
        evtOptions: {
          unique: false,
          uniqueFor2WayBinding: true
        }
      }
      expect(resp).to.eql(expected);
    });

    it('should handle the C code', () => {
      const resp = getCP1Code('click:c');
      const expected = {
        evt: 'click',
        evtOptions: {
          capture: true,
          unique: true,
          uniqueFor2WayBinding: false
        }
      };
      expect(resp).to.eql(expected);
    });

    it('should handle the P code', () => {
      const resp = getCP1Code('click:p');
      const expected = {
        evt: 'click',
        evtOptions: {
          passive: true,
          unique: true,
          uniqueFor2WayBinding: true
        }
      };
      expect(resp).to.eql(expected);
    });

    it('should handle the 1 code', () => {
      const resp = getCP1Code('click:1');
      const expected = {
        evt: 'click',
        evtOptions: {
          once: true,
          unique: true,
          uniqueFor2WayBinding: true
        }
      };
      expect(resp).to.eql(expected);
    });

    it('should handle the CP1 codes', () => {
      let resp = getCP1Code('click:cp1');
      let expected = {
        evt: 'click',
        evtOptions: {
          capture: true,
          passive: true,
          once: true,
          unique: true,
          uniqueFor2WayBinding: true
        }
      };
      resp = getCP1Code('click:1cp');
      expected = {
        evt: 'click',
        evtOptions: {
          capture: true,
          passive: true,
          once: true,
          unique: true,
          uniqueFor2WayBinding: true,
        }
      };
      expect(resp).to.eql(expected);
    });

    it('should fail properly with an invalid code', () => {
      function errorFunction() {
        getCP1Code('click:z');
      }

      expect(errorFunction).to.throw('Unsupported option "z". Valid options are "c" (capture), "p" (passive), and "1" (once).');
    });
  });

  describe('getPSICode tests', () => {
    it('should handle no PSI codes', () => {
      const resp = getPSICode('myFunc');
      expect(resp).to.eql({ fn: 'myFunc', codeLines: [], preventsDefault: false });
    });

    it('should handle the P code', () => {
      const resp = getPSICode('#myFunc:p');
      expect(resp).to.eql({
        fn: '#myFunc', codeLines: [
          'evt.preventDefault()'
        ], preventsDefault: true
      });
    });

    it('should handle the S code', () => {
      const resp = getPSICode('#myFunc:S');
      expect(resp).to.eql({
        fn: '#myFunc',
        codeLines: ['evt.stopPropagation()'],
        preventsDefault: false
      });
    });

    it('should handle the I code', () => {
      const resp = getPSICode('#newFunction:i');
      expect(resp).to.eql({
        fn: '#newFunction',
        codeLines: ['evt.stopImmediatePropagation()'],
        preventsDefault: false
      });
    });

    it('should handle the PS codes', () => {
      const resp = getPSICode('#myFunc:pS');
      expect(resp).to.eql({
        fn: '#myFunc',
        codeLines: [
          'evt.preventDefault()',
          'evt.stopPropagation()'
        ],
        preventsDefault: true
      });
    });

    it('should handle the IS codes', () => {
      const resp = getPSICode('#myFunc:is');
      expect(resp).to.eql({
        fn: '#myFunc',
        codeLines: [
          'evt.stopImmediatePropagation()',
          'evt.stopPropagation()'
        ],
        preventsDefault: false
      });
    });

    it('should handle the PSI codes', () => {
      let resp = getPSICode('#myFunc:psi');
      expect(resp).to.eql({
        fn: '#myFunc',
        codeLines: [
          'evt.preventDefault()',
          'evt.stopPropagation()',
          'evt.stopImmediatePropagation()'
        ],
        preventsDefault: true
      });
      resp = getPSICode('#myFunc:isp');
      expect(resp).to.eql({
        fn: '#myFunc',
        codeLines: [
          'evt.stopImmediatePropagation()',
          'evt.stopPropagation()',
          'evt.preventDefault()'
        ],
        preventsDefault: true
      });
    });

    it('should fail properly with a duplicate codes', () => {
      function errorFunction() {
        getPSICode('#myFunc:pip');
      }

      expect(errorFunction).to.throw('Duplicate event handler option "p".');
    });
  });

  describe('buildEventLists tests', () => {
    afterEach(() => {
      ResetInputHandlerIndex();
    })

    it('should process no bindings, events, children or forLoops', () => {
      const list = [
        {
          bindings: [],
          children: [],
          element: 'el0',
          elementStr: '<div el="el0">',
          events: null,
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

    it('should process error for passive/preventDefault events', () => {
      const list = [
        {
          bindings: [],
          children: [],
          element: 'el0',
          elementStr: '<form el="el0" .submit:p="#changePw:p">',
          events: {
            "submit:p": "#changePw:p"
          },
          forLoop: null
        }
      ];

      function doit() {
        buildEventLists(list);
      }

      expect(doit).to.throw('A "passive" event handler can not call "preventDefault()" in <form el="el0" .submit:p="#changePw:p">.');
    });

    it('should process handle input event and 2-way binding', () => {
      const list = [
        {
          bindings: [
            {
              "add2WayBinding": true,
              "attribute": "value",
              "inForLoop": false,
              "inputSetter": "this.title = evt.target.value;",
              "prop": "value",
              "setterProp": "newVal",
              "srcField": "title",
              "srcObj": "this",
              "srcVar": "this.title",
              "type": "prop"
            }
          ],
          children: [],
          element: 'el0',
          elementStr: '<input :value="title" .input="doInput">',
          events: {
            "input": "doInput"
          },
          forLoop: null
        },
        {
          bindings: [
            {
              "add2WayBinding": true,
              "attribute": "value",
              "inForLoop": false,
              "inputSetter": "this.title = evt.target.value;",
              "prop": "value",
              "setterProp": "newVal",
              "srcField": "title",
              "srcObj": "this",
              "srcVar": "this.title",
              "type": "prop"
            }
          ],
          children: [],
          element: 'el1',
          elementStr: '<input :value="title" .input="doInput">',
          events: {
            "input:c": "doInput"
          },
          forLoop: null
        }
      ];

      const expected = {
        eventList: [
          "ael( el0, 'input', (evt)=>this.#title_onInputHandler_0(evt, {...evt.target.dataset}), {capture: true})",
          "ael( el0, 'input', (evt)=>this.doInput(evt, {...evt.target.dataset}))",
          "ael( el1, 'input', (evt)=>this.#title_onInputHandler_1(evt, {...evt.target.dataset}), {capture: true})"
        ],
        inputHandlerList: [
          '/**\n   * Input handler for the class property "this.title"\n   * @param {InputEvent} evt - The "input" InputEvent\n   * @param {object} data - The values for "evt.target.dataset"\n   */\n  #title_onInputHandler_0(evt, data) {\n    // @ts-ignore\n    this.title = evt.target.value;\n  }',
          '/**\n   * Input handler for the class property "this.title"\n   * @param {InputEvent} evt - The "input" InputEvent\n   * @param {object} data - The values for "evt.target.dataset"\n   */\n  #title_onInputHandler_1(evt, data) {\n    // @ts-ignore\n    this.title = evt.target.value;\n    this.doInput(evt, data);\n  }'
        ]
      };
      const resp = buildEventLists(list);
      expect(resp).to.eql(expected);
    });

    describe('not inside a for loop', () => {
      it('should process just events', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<form el="el0" .submit="#changePw">',
            events: {
              "submit": "#changePw"
            },
            forLoop: null
          },
          {
            bindings: [],
            children: [],
            element: 'el1',
            elementStr: '<div el="el1" .click="#clickMe">',
            events: {
              "click": "#clickMe"
            },
            forLoop: null
          }
        ];

        const expected = {
          eventList: [
            "ael( el0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}))",
            "ael( el1, 'click', (evt)=>this.#clickMe(evt, {...evt.target.dataset}))"
          ],
          inputHandlerList: []
        };
        const resp = buildEventLists(list);
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
                elementStr: '<div el="el1" .click="#clickMe">',
                events: {
                  "click": "#clickMe"
                },
                forLoop: null
              }
            ],
            element: 'el0',
            elementStr: '<form el="el0" .submit="#changePw">',
            events: {
              "submit": "#changePw"
            },
            forLoop: null
          }
        ];

        const expected = {
          eventList: [
            "ael( el0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}))",
            "ael( el1, 'click', (evt)=>this.#clickMe(evt, {...evt.target.dataset}))"
          ],
          inputHandlerList: []
        };
        const resp = buildEventLists(list)
        expect(resp).to.eql(expected);
      });

      it('should process just bindings', () => {
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
                    elementStr: '<input :value="title" />',
                    events: null,
                    forLoop: null
                  }
                ],
                element: 'el1',
                elementStr: '<div :attr.label="title">',
                events: null,
                forLoop: null
              }
            ],
            element: 'el0',
            elementStr: '<div :text="reverseButtonText">',
            events: null,
            forLoop: null
          }
        ];

        const expected = {
          eventList: [
            "ael( el0, 'input', (evt)=>this.#reverseButtonText_onInputHandler_0(evt, {...evt.target.dataset}), {capture: true})",
            "ael( el1, 'input', (evt)=>this.#title_onInputHandler_1(evt, {...evt.target.dataset}), {capture: true})",
            "ael( el2, 'input', (evt)=>this.#title_onInputHandler_2(evt, {...evt.target.dataset}), {capture: true})"
          ],
          inputHandlerList: [
            '/**\n   * Input handler for the class property "this.reverseButtonText"\n   * @param {InputEvent} evt - The "input" InputEvent\n   * @param {object} data - The values for "evt.target.dataset"\n   */\n  #reverseButtonText_onInputHandler_0(evt, data) {\n    // @ts-ignore\n    undefined\n  }',
            '/**\n   * Input handler for the class property "this.title"\n   * @param {InputEvent} evt - The "input" InputEvent\n   * @param {object} data - The values for "evt.target.dataset"\n   */\n  #title_onInputHandler_1(evt, data) {\n    // @ts-ignore\n    undefined\n  }',
            '/**\n   * Input handler for the class property "this.title"\n   * @param {InputEvent} evt - The "input" InputEvent\n   * @param {object} data - The values for "evt.target.dataset"\n   */\n  #title_onInputHandler_2(evt, data) {\n    // @ts-ignore\n    undefined\n  }'
          ]
        };
        const resp = buildEventLists(list);
        expect(resp).to.eql(expected);
      });

      it('should process PSI on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit="#changePw:p">',
            events: {
              "submit": "#changePw:p"
            },
            forLoop: null
          },
          {
            bindings: [],
            children: [],
            element: 'el1',
            elementStr: '<div .click="#clickMe:si">',
            events: {
              "click": "#clickMe:si"
            },
            forLoop: null
          }
        ];

        const expected = {
          eventList: [
            "ael( el0, 'submit', (evt)=>{\n      evt.preventDefault();\n      this.#changePw(evt, {...evt.target.dataset});\n    })",
            "ael( el1, 'click', (evt)=>{\n      evt.stopPropagation();\n      evt.stopImmediatePropagation();\n      this.#clickMe(evt, {...evt.target.dataset});\n    })"
          ],
          inputHandlerList: []
        };
        const resp = buildEventLists(list)
        expect(resp).to.eql(expected);
      });

      it('should fail while processing Invalid PSI on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit="#changePw:x">',
            events: {
              "submit": "#changePw:x"
            },
            forLoop: null
          }
        ];

        const expected = 'Invalid event handler option "x". Valid options are "p" (preventDefault), "s" (stopPropagation), and "i" (stopImmediatePropagation)';
        function doIt() {
          buildEventLists(list)
        }
        expect(doIt).to.throw(expected);
      });

      it('should process CP1 on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit:c="#changePw">',
            events: {
              "submit:c": "#changePw"
            },
            forLoop: null
          },
          {
            bindings: [],
            children: [],
            element: 'el1',
            elementStr: '<div .click:1pc="#clickMe">',
            events: {
              "click:1pc": "#clickMe"
            },
            forLoop: null
          }
        ];

        const expected = {
          eventList: [
            "ael( el0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}), {\"capture\":true})",
            "ael( el1, 'click', (evt)=>this.#clickMe(evt, {...evt.target.dataset}), {\"once\":true,\"passive\":true,\"capture\":true})"
          ],
          inputHandlerList: []
        };
        const resp = buildEventLists(list)
        expect(resp).to.eql(expected);
      });

      it('should fail while processing Invalid CP1 on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit:x="#changePw">',
            events: {
              "submit:x": "#changePw"
            },
            forLoop: null
          }
        ];

        const expected = 'Unsupported option "x". Valid options are "c" (capture), "p" (passive), and "1" (once).';
        function doIt() {
          buildEventLists(list)
        }
        expect(doIt).to.throw(expected);
      });
    });

    describe('inside a for loop', () => {
      it('should process just events', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<form el="el0" .submit="#changePw">',
            events: {
              "submit": "#changePw"
            },
            forLoop: {
              item: 'person',
              indexName: 'idx'
            }
          },
          {
            bindings: [],
            children: [],
            element: 'el1',
            elementStr: '<div el="el1" .click="#clickMe">',
            events: {
              "click": "#clickMe"
            },
            forLoop: {
              item: 'thing',
              indexName: 'i'
            }
          }
        ];

        const expectedResp = {
          eventList: [],
          inputHandlerList: []
        };
        const expectedFor0 = [
          "ael( el0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}, idx, person))"
        ];
        const expectedFor1 = [
          "ael( el1, 'click', (evt)=>this.#clickMe(evt, {...evt.target.dataset}, i, thing))"
        ];
        const resp = buildEventLists(list);
        expect(resp).to.eql(expectedResp);
        expect(list[0].forLoop.forEventInfo).to.eql(expectedFor0)
        expect(list[1].forLoop.forEventInfo).to.eql(expectedFor1)
      });

      it('should process just events and children', () => {
        const list = [
          {
            elementName: "fel0",
            element: "els.fel0",
            elementStr: `<form $for="#dogs as dog.key,i" .submit="#changePw">`,
            bindings: null,
            conditional: null,
            events: {
              submit: "#changePw"
            },
            forLoop: {
              variable: "#dogs",
              item: "dog",
              key: "key",
              indexName: "i",
              loopItemHandlerName: "#loopItemHandler_0",
              bindings: [],
              events: {
                'els.fel0': {
                  submit: "#changePw"
                },
                'els.el1': {
                  click: "#clickMe"
                }
              },
            },
            children: [
              "\n      ",
              {
                elementName: "el1",
                element: "els.el1",
                elementStr: "<div .click=\"#clickMe\">",
                bindings: null,
                conditional: null,
                events: {
                  click: "#clickMe"
                },
                forLoop: null,
                children: [],
              },
              "\n    "
            ]
          }
        ];

        const expectedResp = {
          eventList: [],
          inputHandlerList: []
        };
        const expectedFor0 = [
          "ael( els.fel0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}, i, dog))",
          "ael( els.el1, 'click', (evt)=>this.#clickMe(evt, {...evt.target.dataset}, i, dog))"
        ];
        const resp = buildEventLists(list);
        expect(resp).to.eql(expectedResp);
        expect(list[0].forLoop.forEventInfo).to.eql(expectedFor0)
      });

      it('should process just bindings', () => {
        const list = [
          {
            "element": "fel0",
            "elementStr": "<div $for=\"items as item.key\" :text=\"reverseButtonText\">",
            "events": null,
            "bindings": [
              {
                "add2WayBinding": false,
                "inForLoop": true,
                "prop": "textContent",
                "srcField": "reverseButtonText",
                "srcObj": "this",
                "srcVar": "this.reverseButtonText"
              }
            ],
            "forLoop": {
              "item": "item",
              "indexName": "_index",
            },
            "children": [
              {
                "element": "el1",
                "elementStr": "<div :attr.label=\"item.title\">",
                "events": null,

                "bindings": [
                  {
                    "add2WayBinding": false,
                    "inForLoop": true,
                    "prop": "label",
                    "srcField": "title",
                    "srcObj": "item",
                    "srcVar": "item.title"
                  }
                ],
                "forLoop": null,
                "children": [
                  {
                    "element": "el2",
                    "elementStr": "<input :value=\"item.value\">",
                    "events": null,
                    "bindings": [
                      {
                        "add2WayBinding": true,
                        "inForLoop": true,
                        "inputSetter": "/* do stuff*/",
                        "prop": "value",
                        "srcField": "value",
                        "srcObj": "item",
                        "srcVar": "item.value"
                      }
                    ],
                    "forLoop": null,
                    "children": []
                  }
                ]
              }
            ]
          }
        ];

        const expectedResp = {
          "eventList": [],
          "inputHandlerList": [
            '/**\n   * Input handler for the loop variable "item.value"\n   * @param {InputEvent} evt - The "input" InputEvent\n   * @param {object} data - The values for "evt.target.dataset"\n   * @param {number} index - The current index from the value array for this item\n   * @param {object} item - The current item from the value array\n   */\n  #value_onInputHandler_0(evt, data, _index, item) {\n    // @ts-ignore\n    /* do stuff*/\n  }'
          ]
        };
        const expectedFor0 = [
          "ael( el2, 'input', (evt)=>this.#value_onInputHandler_0(evt, {...evt.target.dataset}, _index, item), {capture: true})"
        ];
        const resp = buildEventLists(list);
        expect(resp).to.eql(expectedResp);
        expect(list[0].forLoop.forEventInfo).to.eql(expectedFor0);
      });

      it('should process PSI on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit="#changePw:ps">',
            events: {
              "submit": "#changePw:ps"
            },
            forLoop: {
              item: 'item',
              indexName: 'idx'
            }
          },
          {
            bindings: [],
            children: [],
            element: 'el1',
            elementStr: '<div .click="#clickMe:si">',
            events: {
              "click": "#clickMe:si"
            },
            forLoop: null
          }
        ];

        const expectedResp = {
          eventList: [
            "ael( el1, 'click', (evt)=>{\n      evt.stopPropagation();\n      evt.stopImmediatePropagation();\n      this.#clickMe(evt, {...evt.target.dataset});\n    })"
          ],
          inputHandlerList: []
        };
        const expectedFor0 = [
          "ael( el0, 'submit', (evt)=>{\n      evt.preventDefault();\n      evt.stopPropagation();\n      this.#changePw(evt, {...evt.target.dataset}, idx, item);\n    })"
        ];
        const resp = buildEventLists(list);
        expect(resp).to.eql(expectedResp);
        expect(list[0].forLoop.forEventInfo).to.eql(expectedFor0)
      });

      it('should fail while processing Invalid PSI on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit="#changePw:x">',
            events: {
              "submit": "#changePw:x"
            },
            forLoop: {
              item: 'item',
              indexName: 'idx'
            }
          }
        ];

        const expected = 'Invalid event handler option "x". Valid options are "p" (preventDefault), "s" (stopPropagation), and "i" (stopImmediatePropagation)';
        function doIt() {
          buildEventLists(list)
        }
        expect(doIt).to.throw(expected);
      });

      it('should process CP1 on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit:c="#changePw">',
            events: {
              "submit:c": "#changePw"
            },
            forLoop: {
              item: 'item',
              indexName: 'idx'
            }
          },
          {
            bindings: [],
            children: [],
            element: 'el1',
            elementStr: '<div .click:1pc="#clickMe">',
            events: {
              "click:1pc": "#clickMe"
            },
            forLoop: null
          }
        ];

        const expectedResp = {
          eventList: [
            "ael( el1, 'click', (evt)=>this.#clickMe(evt, {...evt.target.dataset}), {\"once\":true,\"passive\":true,\"capture\":true})"
          ],
          inputHandlerList: []
        };
        const expectedFor = [
          "ael( el0, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}, idx, item), {\"capture\":true})",
        ]
        const resp = buildEventLists(list)
        expect(resp).to.eql(expectedResp);
        expect(list[0].forLoop.forEventInfo).to.eql(expectedFor)
      });

      it('should fail while processing Invalid CP1 on an event', () => {
        const list = [
          {
            bindings: [],
            children: [],
            element: 'el0',
            elementStr: '<div .submit:x="#changePw">',
            events: {
              "submit:x": "#changePw"
            },
            forLoop: {
              item: 'item',
              indexName: 'idx'
            }
          }
        ];

        const expected = 'Unsupported option "x". Valid options are "c" (capture), "p" (passive), and "1" (once).';
        function doIt() {
          buildEventLists(list)
        }
        expect(doIt).to.throw(expected);
      });
    });
  });
});