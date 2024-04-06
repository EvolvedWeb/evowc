/* eslint-env mocha */
import { expect } from 'chai';
import { fixPath } from './fixPath.js';

describe('fixPath tests', function () {
  it('should handle empty string and null', () => {
    expect(fixPath('')).to.equal('');
    expect(fixPath(null)).to.equal(null);
  });
  it('should handle a non string', () => {
    expect(fixPath(10)).to.equal(10);
    expect(fixPath(true)).to.equal(true);
  });
  it('should handle forward slash "/"', () => {
    const val = "a/b/c/d/e";
    expect(fixPath(val)).to.equal(val);
  });
  it('should handle back slash "\\"', () => {
    const val = "a\\b\\c\\d\\e";
    const expected = "a/b/c/d/e";
    expect(fixPath(val)).to.equal(expected);
  });
});
