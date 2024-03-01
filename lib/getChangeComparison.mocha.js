import { expect } from 'chai';
import { getChangeComparison } from './getChangeComparison.js';

describe('getChangeComparison tests', function () {
  it('should handle `arr`', () => {
    expect(getChangeComparison('arr')).to.equal('!sameObjs(oldVal, newVal)');
  });
  it('should handle `obj`', () => {
    expect(getChangeComparison('obj')).to.equal('!sameObjs(oldVal, newVal)');
  });
  it('should handle `date`', () => {
    expect(getChangeComparison('date')).to.equal('!sameDates(oldVal, newVal)');
  });
  it('should handle `str`', () => {
    expect(getChangeComparison('str')).to.equal('oldVal !== newVal');
  });
});
