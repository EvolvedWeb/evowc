/* eslint-env mocha */
const fs = require('fs');
const expect = require('chai').expect;
const sinon = require("sinon");

const globFileList = require('./globFileList');
const fakeRootFiles = [
  { name: 'one.html', isDirectory() { return false; } },
  { name: 'one.js', isDirectory() { return false; } },
  { name: 'one.css', isDirectory() { return false; } },
  { name: 'sub', isDirectory() { return true; } },
  { name: 'two.html', isDirectory() { return false; } },
  { name: 'two.js', isDirectory() { return false; } },
  { name: 'two.css', isDirectory() { return false; } },
  { name: 'ten.html', isDirectory() { return false; } },
  { name: 'ten.js', isDirectory() { return false; } },
  { name: 'ten.css', isDirectory() { return false; } },
  { name: 'six.html', isDirectory() { return false; } },
  { name: 'six.js', isDirectory() { return false; } },
  { name: 'six.ts', isDirectory() { return false; } },
  { name: 'six.css', isDirectory() { return false; } }
];
const fakeSubFiles = [
  { name: 'dog.html', isDirectory() { return false; } },
  { name: 'dog.js', isDirectory() { return false; } },
  { name: 'dog.css', isDirectory() { return false; } },
  { name: 'cat.html', isDirectory() { return false; } },
  { name: 'cat.js', isDirectory() { return false; } },
  { name: 'cat.css', isDirectory() { return false; } },
  { name: 'pig.html', isDirectory() { return false; } },
  { name: 'pig.js', isDirectory() { return false; } },
  { name: 'pig.css', isDirectory() { return false; } },
  { name: 'fly.html', isDirectory() { return false; } },
  { name: 'fly.js', isDirectory() { return false; } },
  { name: 'fly.css', isDirectory() { return false; } }
];

describe('globFileList tests', function () {
  let readdirSyncStub;

  beforeEach(function () {
    // Before each test, stub the fs.readdirSync function
    readdirSyncStub = sinon.stub(fs, 'readdirSync');
  });

  afterEach(function () {
    // After each test, restore the original function
    readdirSyncStub.restore();
  });

  it('should return correctly when there are no shallow files', () => {
    readdirSyncStub.returns([]);
    const expected = [];
    const resp = globFileList('', '*');

    // eslint-disable-next-line no-unused-expressions
    expect(readdirSyncStub.calledOnce).to.be.true;
    expect(resp).to.eql(expected);
  });

  it('should return correctly when there are no deep files', () => {
    readdirSyncStub.returns([]); // Stub returns an empty array
    const expected = [];
    const resp = globFileList('', '**/*');

    // eslint-disable-next-line no-unused-expressions
    expect(readdirSyncStub.calledOnce).to.be.true;
    expect(resp).to.eql(expected);
  });

  it('should return correctly when there are shallow files', () => {
    readdirSyncStub.returns(fakeRootFiles); // Stub returns an empty array
    const expected = [
      'one.html',
      'two.html',
      'ten.html',
      'six.html',
    ];
    const resp = globFileList('/cat', '*.html');

    // eslint-disable-next-line no-unused-expressions
    expect(readdirSyncStub.calledOnce).to.be.true;
    expect(resp).to.eql(expected);
  });

  it('should return correctly with shallow files and {,}', () => {
    readdirSyncStub.returns(fakeRootFiles); // Stub returns an empty array
    const expected = [
      'one.html',
      'one.js',
      'two.html',
      'two.js',
      'ten.html',
      'ten.js',
      'six.html',
      'six.js',
    ];
    const resp = globFileList('/cat', '*.{html,js}');

    // eslint-disable-next-line no-unused-expressions
    expect(readdirSyncStub.calledOnce).to.be.true;
    expect(resp).to.eql(expected);
  });

  it('should return correctly with shallow files and ?', () => {
    readdirSyncStub.returns(fakeRootFiles); // Stub returns an empty array
    const expected = [
      'one.js',
      'two.js',
      'ten.js',
      'six.js',
      'six.ts',
    ];
    const resp = globFileList('/cat', '*.?s');

    // eslint-disable-next-line no-unused-expressions
    expect(readdirSyncStub.calledOnce).to.be.true;
    expect(resp).to.eql(expected);
  });

  it('should return correctly when there are  deep files', () => {
    readdirSyncStub.callsFake((dir) => {
      if (dir === '/root') {
        return fakeRootFiles
      }

      return fakeSubFiles;
    });
    const expected = [
      'one.js',
      'one.css',
      'sub/dog.js',
      'sub/dog.css',
      'sub/cat.js',
      'sub/cat.css',
      'sub/pig.js',
      'sub/pig.css',
      'sub/fly.js',
      'sub/fly.css',
      'two.js',
      'two.css',
      'ten.js',
      'ten.css',
      'six.js',
      'six.ts',
      'six.css'
     ];
    const resp = globFileList('/root', '**/*s');

    // eslint-disable-next-line no-unused-expressions
    expect(resp).to.eql(expected);
  });
});


/*

*/