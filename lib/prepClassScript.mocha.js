/* eslint-env mocha */
const expect = require('chai').expect;
const prepClassScript = require('./prepClassScript');

describe('prepClassScript conversion tests', function () {
  it('should properly handle null', () => {
    expect(prepClassScript(null)).to.equal('');
  });
  it('should properly handle empty string', () => {
    expect(prepClassScript('')).to.equal('');
  });
  it('should properly handle a string', () => {
    const classScript = `
    async read(fName) {
      return await this.server.readFile(fName);
    }

    stop() {
      this.cancel();
    }
`;
    const expected = `

  // --------------------------------------------------------
  // Start of your code${classScript}// End of your code
  // --------------------------------------------------------`;
    expect(prepClassScript(classScript)).to.equal(expected);
  });
});
