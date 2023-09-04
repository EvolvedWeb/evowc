/* eslint-env mocha */
const expect = require('chai').expect;
const camelToKebab = require('./camelToKebab.js')

describe('camelToKebab tests', function () {
  it('should handle camel case strings', () => {
    expect(camelToKebab('thisIsATest')).to.eql('this-is-a-test');
    expect(camelToKebab('innerHTML')).to.eql('inner-h-t-m-l');
  });

  it('should handle snake case strings', () => {
    expect(camelToKebab('this-is-a-test')).to.eql('this-is-a-test');
  });
});
