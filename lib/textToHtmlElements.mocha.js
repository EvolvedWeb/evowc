/* eslint-env mocha */
const expect = require('chai').expect;
const textToHtmlElements = require('./textToHtmlElements.js')

describe('textToHtmlElements tests', function () {
  it('should handle empty string', () => {
    expect(textToHtmlElements('')).to.equal('');
  });
  it('should handle no args', () => {
    expect(textToHtmlElements()).to.equal('');
  });
  it('should handle one entity', () => {
    expect(textToHtmlElements('>')).to.equal('&gt;');
  });
  it('should handle all entities', () => {
    expect(textToHtmlElements(`before&<>"\'/after`)).to.equal('before&amp;&lt;&gt;&quot;&apos;&#x2F;after');
  });
});
