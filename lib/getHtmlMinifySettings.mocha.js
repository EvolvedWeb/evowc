/* eslint-env mocha */
const expect = require('chai').expect;
const getHtmlMinifySettings = require('./getHtmlMinifySettings');
const { HTML_MIN_SETTINGS } = require('./enums');

describe('getHtmlMinifySettings tests', function () {
  it('should handle no additional options', () => {
    expect(getHtmlMinifySettings([])).to.eql(HTML_MIN_SETTINGS);
  });
  it('should handle additional options', () => {
    const { canCollapseWhitespace, canTrimWhitespace, ...options}
      = getHtmlMinifySettings(['my-el', 'the-thing']);

    const expected = {...HTML_MIN_SETTINGS};
    // @ts-ignore
    delete expected.canCollapseWhitespace;
    // @ts-ignore
    delete expected.canTrimWhitespace;
    expect(options).to.eql(options);
    expect(canCollapseWhitespace('dog')).to.equal(true);
    expect(canCollapseWhitespace('script')).to.equal(false);
    expect(canCollapseWhitespace('style')).to.equal(false);
    expect(canCollapseWhitespace('pre')).to.equal(false);
    expect(canCollapseWhitespace('textarea')).to.equal(false);
    expect(canCollapseWhitespace('my-el')).to.equal(false);
    expect(canCollapseWhitespace('my-el2')).to.equal(true);
    expect(canCollapseWhitespace('the-thing')).to.equal(false);
    expect(canCollapseWhitespace('the-thing-')).to.equal(true);

    expect(canTrimWhitespace('dog')).to.equal(true);
    expect(canTrimWhitespace('script')).to.equal(true);
    expect(canTrimWhitespace('style')).to.equal(true);
    expect(canTrimWhitespace('pre')).to.equal(false);
    expect(canTrimWhitespace('textarea')).to.equal(false);
    expect(canTrimWhitespace('my-el')).to.equal(false);
    expect(canTrimWhitespace('my-el-thing')).to.equal(true);
    expect(canTrimWhitespace('the-thing')).to.equal(false);
    expect(canTrimWhitespace('this-thing')).to.equal(true);
  });
});


