/* eslint-env mocha */
import { expect } from 'chai';
import { getFileArrayFromGlob } from './getFileArrayFromGlob.js';

describe('getFileArrayFromGlob tests', function () {
  it('should handle all JS files', () => {
    const load = '**/*.js';
    const testing = getFileArrayFromGlob('test/globTest', load);
    const expected = [
      'file1.js',
      'folder2/fun3.js',
      'folder2/fun2.js',
      'folder2/fun1.js',
      'folder2/sub/sub1.js'
    ];
    expect(testing).to.eql(expected);
  });
  it('should handle specific files', () => {
    const load = ['file1.js', './file1.html'];
    const testing = getFileArrayFromGlob('test/globTest', load);
    const expected = [
      'file1.js',
      './file1.html'
    ];
    expect(testing).to.eql(expected);
  });
  it('should handle all CSS and HTML files', () => {
    const load = ['**/*.css', '**/*.html'];
    const testing = getFileArrayFromGlob('test/globTest', load);
    const expected = [
      'file2.css',
      'folder2/fun3.css',
      'folder2/fun1.css',
      'folder2/sub/sub2.css',
      'file2.html',
      'file1.html',
      'folder2/fun3.html',
      'folder2/sub/sub2.html',
      'folder2/sub/sub1.html'
    ];
    expect(testing).to.eql(expected);
  });
  it('should handle all files and skip HTML files', () => {
    const load = ['**/*.*', '!**/*.html'];
    const testing = getFileArrayFromGlob('test/globTest', load);
    const expected = [
      'file2.css',
      'file1.js',
      'folder2/fun3.js',
      'folder2/fun3.css',
      'folder2/fun2.js',
      'folder2/fun1.js',
      'folder2/fun1.css',
      'folder2/sub/sub2.css',
      'folder2/sub/sub1.js'
    ];
    expect(testing).to.eql(expected);
  });
});
