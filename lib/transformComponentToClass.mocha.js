import { expect } from 'chai';
import { transformComponentToClass } from './transformComponentToClass.js';

describe('transformComponentToClass tests', function () {
  it('should handle kebab case strings', () => {
    expect(transformComponentToClass('this-is-a-test')).to.eql('ThisIsATestElement');
    expect(transformComponentToClass('inner-h-t-m-l')).to.eql('InnerHTMLElement');
  });
});
