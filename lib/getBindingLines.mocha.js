import { expect } from 'chai';
import { getBindingLines } from './getBindingLines.js';

describe('getBindingLines tests', function () {
  it('should handle property', () => {
    const elName = 'this.#els.el3';
    const data = {
      elementName: 'el3',
        elementStr: '<div $if="title" class="title" :html="title">',
          binding: [
            {
              add2WayBinding: false,
              attribute: 'html',
              default: undefined,
              inForLoop: false,
              inputSetter: undefined,
              loopItemHandlerName: '',
              pipes: undefined,
              prop: 'innerHTML',
              setterProp: 'newVal',
              srcField: 'title',
              srcObj: 'this',
              srcVar: 'this.title',
              type: 'prop',
              indexName: null
            }
          ],
            conditional: { variable: 'title', value: true }
    };
    const bindingList = [];
    const expected = [
      `// Set the property 'innerHTML' for the element: <div $if="title" class="title" :html="title">`,
      'this.#els.el3.innerHTML = newVal ?? null;',
      'cond( this.#els.el3, this.#comments.el3, newVal, true );'
    ];

    expect(getBindingLines(elName, data, bindingList)).to.eql(expected);
  });

  it('should handle attribute', () => {
    const elName = 'this.#els.el3';
    const data = {
      elementName: 'el3',
      elementStr: '<div :attr.html="title">',
      binding: [
        {
          add2WayBinding: false,
          attribute: 'html',
          default: undefined,
          inForLoop: false,
          inputSetter: undefined,
          loopItemHandlerName: '',
          pipes: undefined,
          prop: '',
          setterProp: 'newVal',
          srcField: 'title',
          srcObj: 'this',
          srcVar: 'this.title',
          type: 'attr',
          indexName: null
        }
      ]
    };
    const bindingList = [];
    const expected = [
      "// Call 'setAttr' for the element: <div :attr.html=\"title\">",
      "setAttr( this.#els.el3, 'html', newVal ?? null);"
    ];

    expect(getBindingLines(elName, data, bindingList)).to.eql(expected);
  });

  it('should handle data', () => {
    const elName = 'this.#els.el3';
    const data = {
      elementName: 'el3',
      elementStr: '<div :data.html="title">',
      binding: [
        {
          add2WayBinding: false,
          attribute: 'html',
          default: undefined,
          inForLoop: false,
          inputSetter: undefined,
          loopItemHandlerName: '',
          pipes: undefined,
          prop: 'html',
          setterProp: 'newVal',
          srcField: 'title',
          srcObj: 'this',
          srcVar: 'this.title',
          type: 'data',
          indexName: null
        }
      ]
    };
    const bindingList = [];
    const expected = [
      "// Set 'dataset.html' for the element: <div :data.html=\"title\">",
      "this.#els.el3.dataset.html = newVal ?? null;"
    ];

    expect(getBindingLines(elName, data, bindingList)).to.eql(expected);
  });

  it('should handle aria', () => {
    const elName = 'this.#els.el3';
    const data = {
      elementName: 'el3',
      elementStr: '<div :aria.label="title">',
      binding: [
        {
          add2WayBinding: false,
          attribute: 'label',
          default: undefined,
          inForLoop: false,
          inputSetter: undefined,
          loopItemHandlerName: '',
          pipes: undefined,
          prop: 'label',
          setterProp: 'newVal',
          srcField: 'title',
          srcObj: 'this',
          srcVar: 'this.title',
          type: 'aria',
          indexName: null
        }
      ]
    };
    const bindingList = [];
    const expected = [
      "// Call 'setAttr' for the element: <div :aria.label=\"title\">",
      "setAttr( this.#els.el3, 'aria-label', newVal ?? null);"
    ];

    expect(getBindingLines(elName, data, bindingList)).to.eql(expected);
  });

  it('should handle an exception', () => {
    const elName = 'this.#els.el3';
    const data = {
      elementName: 'el3',
      elementStr: '<div :junk.label="title">',
      binding: [
        {
          add2WayBinding: false,
          attribute: 'label',
          default: undefined,
          inForLoop: false,
          inputSetter: undefined,
          loopItemHandlerName: '',
          pipes: undefined,
          prop: 'label',
          setterProp: 'newVal',
          srcField: 'title',
          srcObj: 'this',
          srcVar: 'this.title',
          type: 'just',
          indexName: null
        }
      ]
    };
    const bindingList = [];

    function doIt() {
      getBindingLines(elName, data, bindingList) 
    }
    expect(doIt).to.throw('Unknown property type "just"');
  });
});
