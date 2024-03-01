import { expect } from 'chai';
import { prepRootScript } from './prepRootScript.js';

describe('prepRootScript conversion tests', function () {
  it('should properly handle null', () => {
    expect(prepRootScript(null)).to.eql('');
  });
  it('should properly handle empty string', () => {
    expect(prepRootScript('')).to.eql('');
  });
  it('should properly handle string', () => {
    const rootScript = '@import "dogs.js";'
    const expected = `\n// --------------------------------------------------------\n// Start of your root script code\n${rootScript}\n// End of your root script code\n// --------------------------------------------------------`;
    expect(prepRootScript(rootScript)).to.eql(expected);
  });
});
