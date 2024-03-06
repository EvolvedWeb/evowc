import { expect } from 'chai';
import { decodeAttributeValue, encodeAttributeValue } from './attributeValue.js';

describe('decodeAttributeValue tests', function () {
  it('should decode names attributes', () => {
    expect(decodeAttributeValue('&amp;&lt;&gt;&quot;&apos;')).to.equal('&<>"\'');
  });

  it('should decode decimal attributes', () => {
    expect(decodeAttributeValue('&#64; &#65; &#66;')).to.equal('@ A B');
  });

  it('should decode hex attributes', () => {
    expect(decodeAttributeValue('&#x40; &#x41; &#x42;')).to.equal('@ A B');
  });

  it('should not decode non strings', () => {
    expect(decodeAttributeValue([1,2,3])).to.eql([1,2,3]);
    expect(decodeAttributeValue({a:1})).to.eql({a:1});
  });
});

describe('encodeAttributeValue tests', function () {
  it('should encode attributes', () => {
    expect(encodeAttributeValue('é&<>"\'ç')).to.equal('="é&amp;&lt;&gt;&quot;&apos;ç"');
  });

  it('should encode `true` to an empty string', () => {
    expect(encodeAttributeValue(true)).to.equal('');
  });

  it('should not encode non strings', () => {
    expect(encodeAttributeValue(undefined)).to.equal(undefined);
    expect(encodeAttributeValue({ a: 1 })).to.eql({ a: 1 });
  });
});
