/* eslint-env mocha */
const expect = require('chai').expect;
var proxyquire = require('proxyquire').noCallThru();

let compare;
const fixEvoVersionInExampleFiles = proxyquire('./fixEvoVersionInExampleFiles', {
  './getFileArrayFromGlob.js': function (templateRoot, evoVersion) {
    return [
      'somefile.js'
    ]
  },
  'fs': {
    promises: {
      async readFile(fName) {
        return `import "./dogs.js";
import "../EvoElement.js";
import "../EvoRouter.js";
`;
      },
      async writeFile(fName, content) {
        compare(fName, content)
      }
    }
  }
});

describe('fixEvoVersionInExampleFiles tests', function () {

  beforeEach(function () {
  });

  afterEach(function () {
    compare = null;
  });

  it('should handle a simple string', async () => {
    let called = false;
    compare = (fName, content) => {
      called = true;
      const expected = 'import "./dogs.js";\nimport "../Evo-1.2.3/EvoElement.js";\nimport "../Evo-1.2.3/EvoRouter.js";\n';
      expect(content).to.equal(expected);
    }

    await fixEvoVersionInExampleFiles('/name', '1.2.3');
    expect(called).to.equal(true);
  });
});
