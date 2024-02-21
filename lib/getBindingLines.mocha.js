/* eslint-env mocha */
const expect = require('chai').expect;
const getBindingLines = require('./getBindingLines.js')

describe('getBindingLines tests', function () {
  it('should handle `arr`', () => {
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
});
