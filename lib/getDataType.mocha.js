/* eslint-env mocha */
const expect = require('chai').expect;
const getDataType = require('./getDataType');

describe('getDataType tests', function () {
  it('should return proper types for primatives', () => {
    expect(getDataType('int', '' )).to.equal('number');
    expect(getDataType('num', '')).to.equal('number');
    expect(getDataType('null', '')).to.equal('null');
    expect(getDataType('str', '')).to.equal('string');
    expect(getDataType('bool', '')).to.equal('boolean');
    expect(getDataType('bigint', '')).to.equal('bigint');
    expect(getDataType('', '')).to.equal('any');
  });

  it('should return proper types primative with objType', () => {
    expect(getDataType('int', 'Person')).to.equal('number');
  });

  it('should return proper types for arrays', () => {
    expect(getDataType('arr', '')).to.equal('Array');
    expect(getDataType('arr', 'Person')).to.equal('Person[]');
  });

  it('should return proper types for objects', () => {
    expect(getDataType('obj', '')).to.equal('Object');
    expect(getDataType('obj', 'Person')).to.equal('Person');
    expect(getDataType('int', 'Person')).to.equal('number');
  });
});
