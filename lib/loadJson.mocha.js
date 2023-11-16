/* eslint-env mocha */
const fs = require('fs');
const expect = require('chai').expect;
const sinon = require("sinon");

const loadJson = require('./loadJson');

describe('loadJson tests', function () {
  let readFileSyncStub;

  beforeEach(function () {
    // Before each test, stub the fs.readFileSync function
    readFileSyncStub = sinon.stub(fs, 'readFileSync');
  });

  afterEach(function () {
    // After each test, restore the original function
    readFileSyncStub.restore();
  });

  it('should handle a simple string', () => {
    readFileSyncStub.returns('"dogs are fun"');
    const expected = 'dogs are fun';

    expect(loadJson('name')).to.eql(expected);
    // eslint-disable-next-line no-unused-expressions
    expect(readFileSyncStub.calledOnce).to.be.true;
  });

  it('should handle an object', () => {
    const expected = {
      shout: "Hi everyone",
      animals: {
        cat: 1,
        dog: 2,
      }
    };
    readFileSyncStub.returns(JSON.stringify(expected));

    expect(loadJson('name')).to.eql(expected);
    // eslint-disable-next-line no-unused-expressions
    expect(readFileSyncStub.calledOnce).to.be.true;
  });
});
