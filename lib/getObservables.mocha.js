/* eslint-env mocha */
const expect = require('chai').expect;
const getObservables = require('./getObservables');

describe('getObservables tests', function () {
  it('should work with null passed in', () => {
    expect(getObservables(null)).to.eql('');
  });
  it('should work with false passed in', () => {
    expect(getObservables(false)).to.eql('');
  });
  it('should work with observables passed in', () => {
    const expected = `
  // The attributes this component watches for changes
  static get observedAttributes() {
    return [dog, cat];
  }
`;
    expect(getObservables('dog, cat')).to.eql(expected);
  });
});
