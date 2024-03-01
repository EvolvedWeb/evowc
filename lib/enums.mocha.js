import { expect } from 'chai';
import * as enums from './enums.js';

describe('enums tests', () => {
  it('should should export all needed properties', () => {
    expect(!!enums.ATTRIBUTE_DECODING_LIST).to.equal(true);
    expect(!!enums.ATTRIBUTE_DECODE_KEYS).to.equal(true);
    expect(!!enums.ATTRIBUTE_DECODE_RE).to.equal(true);
    expect(!!enums.ATTRIBUTE_ENCODING_LIST).to.equal(true);
    expect(!!enums.ATTRIBUTE_ENCODE_KEYS).to.equal(true);
    expect(!!enums.ATTRIBUTE_ENCODE_RE).to.equal(true);
    expect(!!enums.HTML_ENTITIES_RE).to.equal(true);
    expect(!!enums.BOOLEAN_ATTRIBUTES).to.equal(true);
    expect(!!enums.INVALID_ELEMENT_NAMES).to.equal(true);
    expect(!!enums.VALID_FILTER_TAGS).to.equal(true);
    expect(!!enums.TYPE_NORMALIZE).to.equal(true);
    expect(!!enums.VALID_TYPES).to.equal(true);
    expect(!!enums.DATA_TYPES).to.equal(true);
    expect(!!enums.UNPAIRED_TAGS).to.equal(true);
    expect(!!enums.HTML_MIN_SETTINGS).to.equal(true);
  });
});
