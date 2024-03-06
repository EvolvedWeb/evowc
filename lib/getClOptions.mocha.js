import { expect } from 'chai';
import { getClOptions } from './getClOptions.js';

describe('getClOptions tests', function () {
  it('should handle init only', () => {
    const testing = getClOptions(['init'], '1.2.3');
    const expected = {
      command: 'init',
      initServer: 'EXPRESS',
      outputRoot: 'public',
      srcRoot: 'src',
      version: '1.2.3'
    };
    expect(testing).to.eql(expected);
  });
  it('should handle all valid parameters', () => {
    const testing = getClOptions('cats -r dogs -o static -s -f'.split(/\s/g));
    const expected = {
      command: 'cats',
      force: true,
      initServer: 'EXPRESS',
      outputRoot: 'static',
      srcRoot: 'dogs',
      version: undefined
    };
    expect(testing).to.eql(expected);
  });
  it('should throw for invalid parameters', () => {
    expect(() => getClOptions(['-z failme'])).to.throw('Unknown command line parameter "-z failme"');
  });
});
