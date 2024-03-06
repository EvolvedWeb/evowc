import { expect } from 'chai';
import { getDataType } from './getDataType.js';

describe('getDataType tests', function () {
  it('should return proper types for primitives', () => {
    expect(getDataType('int', '' )).to.equal('number');
    expect(getDataType('num', '')).to.equal('number');
    expect(getDataType('null', '')).to.equal('null');
    expect(getDataType('str', '')).to.equal('string');
    expect(getDataType('bool', '')).to.equal('boolean');
    expect(getDataType('bigint', '')).to.equal('bigint');
    expect(getDataType('', '')).to.equal('any');
  });

  it('should throw exception for primitive with objType', () => {
    expect(() => getDataType('int', 'Person')).to.throw('Object Names are not valid for "int" data type.');
    expect(() => getDataType('str', 'Thing')).to.throw('Object Names are not valid for "str" data type.');
  });

  it('should return proper types for arrays', () => {
    expect(getDataType('arr', '')).to.equal('Array');
    expect(getDataType('arr', 'Person')).to.equal('Person[]');
  });

  it('should return proper types for objects', () => {
    expect(getDataType('obj', '')).to.equal('Object');
    expect(getDataType('obj', 'Person')).to.equal('Person');
  });
});
