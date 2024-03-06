import { expect } from 'chai';
import esmock from 'esmock';

const data = {
  dog: {
    bark: 'loud',
    bite: 5
  }
}

const mockFs = {
  readFileSync(fName) {
    if (fName === 'simple') {
      return '"dogs are fun"';
    }

    return JSON.stringify(data,0,2);
  }
};

const modulePath = './loadJson.js';
let loadJson;


describe('loadJson tests', function () {
  before(async () => {
    const module = await esmock(modulePath, {
      'fs': mockFs,
    });
    loadJson = module.loadJson;
  })

  it('should handle a simple string', () => {
    const expected = 'dogs are fun';
    expect(loadJson('simple')).to.eql(expected);
  });

  it('should handle an object', () => {
    expect(loadJson('complex')).to.eql(data);
  });
});
