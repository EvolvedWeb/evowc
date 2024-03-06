import { expect } from 'chai';
import esmock from 'esmock';

const fakeRootFiles = [
  { isDirectory() { return false; }, name: 'one.html' },
  { isDirectory() { return false; }, name: 'one.js' },
  { isDirectory() { return false; }, name: 'one.css' },
  { isDirectory() { return true; }, name: 'sub' },
  { isDirectory() { return false; }, name: 'two.html' },
  { isDirectory() { return false; }, name: 'two.js' },
  { isDirectory() { return false; }, name: 'two.css' },
  { isDirectory() { return false; }, name: 'ten.html' },
  { isDirectory() { return false; }, name: 'ten.js' },
  { isDirectory() { return false; }, name: 'ten.css' },
  { isDirectory() { return false; }, name: 'six.html' },
  { isDirectory() { return false; }, name: 'six.js' },
  { isDirectory() { return false; }, name: 'six.ts' },
  { isDirectory() { return false; }, name: 'six.css' }
];
const fakeSubFiles = [
  { isDirectory() { return false; }, name: 'dog.html' },
  { isDirectory() { return false; }, name: 'dog.js' },
  { isDirectory() { return false; }, name: 'dog.css' },
  { isDirectory() { return false; }, name: 'cat.html' },
  { isDirectory() { return false; }, name: 'cat.js' },
  { isDirectory() { return false; }, name: 'cat.css' },
  { isDirectory() { return false; }, name: 'pig.html' },
  { isDirectory() { return false; }, name: 'pig.js' },
  { isDirectory() { return false; }, name: 'pig.css' },
  { isDirectory() { return false; }, name: 'fly.html' },
  { isDirectory() { return false; }, name: 'fly.js' },
  { isDirectory() { return false; }, name: 'fly.css' }
];


const mockFs = {
  /**
   * 
   * @param {string} folder 
   * @param {*} options 
   * @returns 
   */
  // eslint-disable-next-line no-unused-vars
  readdirSync(folder, options = null) {
    if (folder === 'empty') {
      return [];
    }

    if (folder.endsWith('/sub')) {
      return fakeSubFiles;
    }

    return fakeRootFiles;
  }
};

const modulePath = './globFileList.js';
let globFileList;

describe('globFileList tests', function () {
  before(async () => {
    const module = await esmock(modulePath, {
      'fs': mockFs,
    });
    globFileList = module.globFileList;
  })

  it('should return correctly when there are no shallow files', () => {
    const expected = [];
    const resp = globFileList('empty', '*');

    expect(resp).to.eql(expected);
  });

  it('should return correctly when there are no deep files', () => {
    const expected = [];
    const resp = globFileList('empty', '**/*');

    expect(resp).to.eql(expected);
  });

  it('should return correctly when there are shallow files', () => {
    const expected = [
      'one.html',
      'two.html',
      'ten.html',
      'six.html',
    ];
    const resp = globFileList('/cat', '*.html');

    expect(resp).to.eql(expected);
  });

  it('should return correctly with shallow files and {,}', () => {
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

    expect(resp).to.eql(expected);
  });

  it('should return correctly with shallow files and ?', () => {
    const expected = [
      'one.js',
      'two.js',
      'ten.js',
      'six.js',
      'six.ts',
    ];
    const resp = globFileList('/cat', '*.?s');

    expect(resp).to.eql(expected);
  });

  it('should return correctly when there are  deep files', () => {
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

    expect(resp).to.eql(expected);
  });
});


/*

*/