/* eslint-env mocha */
import { expect } from 'chai';
import { getDomParams } from './getDomParams.js';

describe('getDomParams tests', () => {
  it('should return properly for just html', () => {
    expect(getDomParams(true, false, false)).to.equal('{template,componentName}');
  });

  it('should return properly for just css', () => {
    expect(getDomParams(false, true, false)).to.equal('{styles,componentName}');
  });

  it('should return properly for just shadow closed', () => {
    expect(getDomParams(false, false, 'closed')).to.equal('{shadowMode:\'closed\',componentName}');
  });

  it('should return properly for just shadow open', () => {
    expect(getDomParams(false, false, 'open')).to.equal('{componentName}');
  });

  it('should return properly for all three', () => {
    expect(getDomParams(true, true, 'none')).to.equal('{template,styles,shadowMode:\'none\',componentName}');
  });
});
