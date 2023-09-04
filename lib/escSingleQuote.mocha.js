/* eslint-env mocha */
const expect = require('chai').expect;
const escSingleQuote = require('./escSingleQuote.js')

describe('escSingleQuote tests', function () {
  it('should handle string with no single quotes', () => {
    const before = 'this is a test';
    const after = escSingleQuote(before);
    const expected = 'this is a test';
    expect(after).to.equal(expected);
  });

  it('should handle a string with a slash "\\"', () => {
    const before = 'This is \\';
    const after = escSingleQuote(before);
    const expected = 'This is \\\\';
    expect(after).to.equal(expected);
  });


  it('should handle a string with single quotes', () => {
    const before = "This is a 'test'";
    const after = escSingleQuote(before);
    const expected = "This is a \\'test\\'";
    expect(after).to.equal(expected);
  });
});
