import { expect } from 'chai';
import { fixLeftSpacing } from './fixLeftSpacing.js';

describe('fixLeftSpacing tests', function () {
  it('should handle an indent', () => {
    const text = `this is a test`;
    const indented = fixLeftSpacing(text);
    const expected = `this is a test`;
    expect(indented).to.equal(expected);
  });
  it('should handle an indent of 4', () => {
    const text = `
  this is a test
  {
    line 2
  }`;
    const indented = fixLeftSpacing(text);
    const expected = `
    this is a test
    {
      line 2
    }`;
    expect(indented).to.equal(expected);
  });
  it('should handle an indent of 8', () => {
    const text = `
  this is a test
  {
    line 2
  }
  `;
    const indented = fixLeftSpacing(text, 8);
    const expected = `
        this is a test
        {
          line 2
        }
        `;
    expect(indented).to.equal(expected);
  });
  it('should handle an indent of 0', () => {
    const text = `
  this is a test
  {
    line 2
  }`;
    const indented = fixLeftSpacing(text, 0);
    const expected = `this is a test
{
  line 2
}`;
    expect(indented).to.equal(expected);
  });
});
