import { expect } from 'chai';
import { transformAttributeName } from './transformAttributeName.js';

describe('transformAttributeName tests', function () {
  it('should handle kebab case strings', () => {
    expect(transformAttributeName('this-is-a-test')).to.eql('thisIsATest');
    expect(transformAttributeName('inner-h-t-m-l')).to.eql('innerHTML');
  });

  it('should handle camel case strings', () => {
    expect(transformAttributeName('thisIsATest')).to.eql('thisIsATest');
  });
});
