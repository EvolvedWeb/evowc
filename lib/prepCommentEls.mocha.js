/* eslint-env mocha */
const expect = require('chai').expect;
const prepCommentEls = require('./prepCommentEls');

describe('prepCommentEls conversion tests', function () {
  it('should properly handle null', () => {
    expect(prepCommentEls(null)).to.equal('');
  });
  it('should properly handle empty object', () => {
    expect(prepCommentEls({})).to.equal('');
  });
  it('should properly handle properties', () => {
    const properties = {
      one: {
        elements: {
          cond1: {
            conditional: true
          },
          nocond1: {
            conditional: false
          },
          cond2: {
            conditional: true
          },
          nocond2: {
            conditional: false
          },
        }
      },
      two: {
        stuff: {}
      },
      three: {

      }
    };
    const expected = `\n    // Conditional & For Loop Comment Elements
      ['cond1','cond2'].forEach(name => {
        this.#comments[name] = comment(name, this.#els[name]);
      });
      Object.freeze(this.#comments);`;
    expect(prepCommentEls(properties)).to.equal(expected);
  });
});
