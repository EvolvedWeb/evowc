/* eslint-env mocha */
const expect = require('chai').expect;
const getTypeConversion = require('./getTypeConversion');

describe('getTypeConversion tests', function () {
  it('should return proper types for numbers with no min or max', () => {
    expect(getTypeConversion('num')).to.equal('\n    newVal = Number(newVal);');
    expect(getTypeConversion('int')).to.equal('\n    newVal = parseInt(newVal, 10);');
    expect(getTypeConversion('bigint')).to.equal('\n    newVal = BigInt(newVal);');
  });

  it('should return proper types for numbers with min and no max', () => {
    expect(getTypeConversion('num', 0.1)).to.equal('\n    newVal = Number(newVal);\n    if (newVal < 0.1) newVal = 0.1;');
    expect(getTypeConversion('int', 0)).to.equal('\n    newVal = parseInt(newVal, 10);\n    if (newVal < 0) newVal = 0;');
    expect(getTypeConversion('bigint', 0n)).to.equal('\n    newVal = BigInt(newVal);\n    if (newVal < 0n) newVal = 0n;');
  });

  it('should return proper types for numbers with min and no max', () => {
    expect(getTypeConversion('num', null, 12.34)).to.equal('\n    newVal = Number(newVal);\n    if (newVal > 12.34) newVal = 12.34;');
    expect(getTypeConversion('int', null, 54)).to.equal('\n    newVal = parseInt(newVal, 10);\n    if (newVal > 54) newVal = 54;');
    expect(getTypeConversion('bigint', null, 1234567890987654321n)).to.equal('\n    newVal = BigInt(newVal);\n    if (newVal > 1234567890987654321n) newVal = 1234567890987654321n;');
  });

  it('should return proper types for Booleans', () => {
    expect(getTypeConversion('bool')).to.equal('\n    newVal = boolFromVal(newVal);');
    expect(getTypeConversion('bool', 1, 10)).to.equal('\n    newVal = boolFromVal(newVal);');
  });

  it('should return proper types for Objects', () => {
    expect(getTypeConversion('obj')).to.equal('\n    newVal = (typeof newVal === \'string\' ? JSON.parse(newVal) : newVal);');
    expect(getTypeConversion('obj', 1, 10)).to.equal('\n    newVal = (typeof newVal === \'string\' ? JSON.parse(newVal) : newVal);');
  });

  it('should return proper types for Arrays', () => {
    expect(getTypeConversion('arr')).to.equal('\n    newVal = (typeof newVal === \'string\' ? JSON.parse(newVal) : newVal);');
    expect(getTypeConversion('arr', 1, 10)).to.equal('\n    newVal = (typeof newVal === \'string\' ? JSON.parse(newVal) : newVal);');
  });

  it('should return proper types for Dates', () => {
    expect(getTypeConversion('date')).to.equal('\n    newVal = (typeof newVal === \'string\' ? new Date(newVal) : newVal) ?? null;');
    expect(getTypeConversion('date', 1, 10)).to.equal('\n    newVal = (typeof newVal === \'string\' ? new Date(newVal) : newVal) ?? null;');
  });

  it('should return proper types for Strings', () => {
    expect(getTypeConversion('str')).to.equal('\n    newVal = newVal == null ? null : \'\'+newVal;');
    expect(getTypeConversion('str', 1, 10)).to.equal('\n    newVal = newVal == null ? null : \'\'+newVal;');
  });

  it('should return proper types for null', () => {
    expect(getTypeConversion('null')).to.equal('');
    expect(getTypeConversion('null', 1, 10)).to.equal('');
  });
});
