/* eslint-env mocha */
import { expect } from 'chai';
import { formatDate } from './formatDate.js';

describe('formatDate tests', function () {
  it('should handle an invalid date', () => {
    let date = new Date('invalid');
    const dateStr = formatDate(date);
    const expected = null;
    expect(dateStr).to.equal(expected);
  });
  it('should handle a null date', () => {
    const date = new Date(null);
    const dateStr = formatDate(date);
    const expected = `12/31/1969`;
    expect(dateStr).to.equal(expected);
  });
  it('should handle a date', () => {
    const date = new Date("Jan 5, 2023");
    const dateStr = formatDate(date);
    const expected = `01/05/2023`;
    expect(dateStr).to.equal(expected);
  });
});
