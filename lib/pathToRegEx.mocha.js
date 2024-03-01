import { expect } from 'chai';
import { pathToRegex } from './pathToRegex.js';

describe('pathToRegex conversion tests', function () {
  it('should properly handle "/"', () => {
    const expected = /^\/\/?$/;
    expect(pathToRegex('/')).to.eql(expected, '/');
  });

  it('should properly handle "/js/dog"', () => {
    const expected = /^\/js\/dog\/?$/;
    expect(pathToRegex('/js/dog')).to.eql(expected, '/js/dog');
  });

  it('should properly handle "/js/[dog]"', () => {
    const expected = /^\/js\/\[dog\]\/?$/;
    expect(pathToRegex('/js/[dog]')).to.eql(expected, '/js/[dog]');
  });

  it('should properly handle "/path/:id"', () => {
    const expected = /^\/path\/(?<id>(?:[^\/\n]+)?)\/?$/;
    expect(pathToRegex('/path/:id')).to.eql(expected, '/path/:id');
  });

  it('should properly handle "/path/img-:id"', () => {
    const expected = /^\/path\/img-(?<id>(?:[^\/\n]+)?)\/?$/;
    expect(pathToRegex('/path/img-:id')).to.eql(expected, '/path/img-:id');
  });

  it('should properly handle "/path/img-:id.jpg"', () => {
    const expected = /^\/path\/img-(?<id>(?:[^\/\n.]+))\.jpg\/?$/;
    expect(pathToRegex('/path/img-:id.jpg')).to.eql(expected, '/path/img-:id.jpg');
  });

  it('should properly handle "/path/img-:id].jpg"', () => {
    const expected = /^\/path\/img-(?<id>(?:[^\/\n\]]+))\]\.jpg\/?$/;
    expect(pathToRegex('/path/img-:id].jpg')).to.eql(expected, '/path/img-:id].jpg');
  });

  it('should properly handle "/thing/(\\d{2,4})"', () => {
    const expected = /^\/thing\/(?<re1>(?:\d{2,4}))\/?$/;
    expect(pathToRegex('/thing/(\\d{2,4})')).to.eql(expected, '/thing/(\\d{2,4})');
  });

  it('should properly handle "/thing/(\\d{2,4})?"', () => {
    const expected = /^\/thing\/(?<re1>(?:\d{2,4}))\?\/?$/;
    expect(pathToRegex('/thing/(\\d{2,4})?')).to.eql(expected, '/thing/(\\d{2,4})?');
  });

  it('should properly handle "/testing/one/a.b"', () => {
    const expected = /^\/testing\/one\/a\.b\/?$/;
    expect(pathToRegex('/testing/one/a.b')).to.eql(expected, '/testing/one/a.b');
  });

  it('should properly handle "/:size/:color?"', () => {
    const expected = /^\/(?<size>(?:[^\/\n]+))\/?(?<color>(?:[^\/\n]+\/?)?)\/?$/;
    expect(pathToRegex('/:size/:color?')).to.eql(expected, '/:size/:color?');
  });

  it('should properly handle "/kb/:path*"', () => {
    const expected = /^\/kb\/?(?<path>(?:[^\/\n]+\/?)*)\/?$/;
    expect(pathToRegex('/kb/:path*')).to.eql(expected, '/kb/:path*');
  });

  it('should properly handle "/image.(jpg|jpeg)"', () => {
    const expected = /^\/image\.(?<re1>(?:jpg|jpeg))\/?$/;
    expect(pathToRegex('/image.(jpg|jpeg)')).to.eql(expected, '/image.(jpg|jpeg)');
  });

  it('should properly handle "/image.:id?"', () => {
    const expected = /^\/image\.(?<id>(?:[^\/\n]+)?)\/?$/;
    expect(pathToRegex('/image.:id?')).to.eql(expected, '/image.:id?');
  });

  it('should properly handle "/image-:size(\\d+)px"', () => {
    const expected = /^\/image-(?<size>(?<re1>(?:\d+)))px\/?$/;
    expect(pathToRegex('/image-:size(\\d+)px')).to.eql(expected, '/image-:size(\\d+)px');
  });
/*
  it('should to throw and error', () => {
    expect(() => pathToRegex('}{{][])(\\//')).to.throw();
  });
*/
});

describe('pathToRegex execution tests', function () {
  it('should properly handle "/"', () => {
    const re = pathToRegex('/');
    expect(re.test('/')).to.equal(true, '/');
    expect(re.test('/a')).to.equal(false, '/a');
  });

  it('should properly handle "/js/dog"', () => {
    const re = pathToRegex('/js/dog');
    expect(re.test('/js/dog')).to.equal(true, '/js/dog');
    expect(re.test('/js/dogs')).to.equal(false, '/js/dogs');
    expect(re.test('/js/do')).to.equal(false, '/js/do');
  });

  it('should properly handle "/js/[dog]"', () => {
    const re = pathToRegex('/js/[dog]');
    expect(re.test('/js/[dog]')).to.equal(true, '/js/[dog]');
    expect(re.test('/js/[dog]s')).to.equal(false, '/js/[dog]s');
    expect(re.test('/js/[do]')).to.equal(false, '/js/[do]');
  });

  it('should properly handle "/path/:id"', () => {
    const re = pathToRegex('/path/:id');
    expect(re.test('/path/1')).to.equal(true, '/path/1');
    expect(re.test('/path/dogs')).to.equal(true, '/path/dogs');
    expect(re.test('/path/fish')).to.equal(true, '/path/fish');
    expect(re.test('/path/dogs/one')).to.equal(false, '/path/dogs/one');
    expect(re.test('/path/')).to.equal(true, '/path/');
    expect(re.test('/path')).to.equal(false, '/path');
    let expected = { id: '123' };
    expect('/path/123'.match(re).groups).to.eql(expected, '/path/123');
    expected = { id: 'fish' };
    expect('/path/fish'.match(re).groups).to.eql(expected, '/path/fish');
    expect('/path/fish/sticks'.match(re)).to.equal(null, '/path/fish/sticks');
  });

  it('should properly handle "/path/img-:id"', () => {
    const re = pathToRegex('/path/img-:id');
    expect(re.test('/path/img-32')).to.equal(true, '/path/img-32');
    expect(re.test('/path/img-one.jpg')).to.equal(true, '/path/img-one.jpg');
    expect(re.test('/path/image-one.jpg')).to.equal(false, '/path/image-one.jpg');
    let expected = { id: 'one.jpg' };
    expect('/path/img-one.jpg'.match(re).groups).to.eql(expected, '/path/img-one.jpg');
    expected = { id: '' };
    expect('/path/img-'.match(re).groups).to.eql(expected, '/path/img-');
    expect('/path/img-er/sticks'.match(re)).to.equal(null, '/path/img-er/sticks');
  });

  it('should properly handle "/image.:id?"', () => {
    const re = pathToRegex('/image.:id?');
    expect(re.test('/image.')).to.equal(true, '/image.');
    expect(re.test('/image.32')).to.equal(true, '/image.32');
    expect(re.test('/image.dog')).to.equal(true, '/image.dog');
    expect(re.test('/image.cat/')).to.equal(true, '/image.cat/');
  });

  it('should properly handle "/path/img-:id.jpg"', () => {
    const re = pathToRegex('/path/img-:id.jpg');
    expect(re.test('/path/img-32.jpg')).to.equal(true, '/path/img-32.jpg');
    expect(re.test('/path/img-one.jpg')).to.equal(true, '/path/img-one.jpg');
    expect(re.test('/path/image-one.jpg')).to.equal(false, '/path/image-one.jpg');
    let expected = { id: 'one' };
    expect('/path/img-one.jpg'.match(re).groups).to.eql(expected, '/path/img-one.jpg');
    expect('/path/img-.jpg'.match(re)).to.equal(null, '/path/img-.jpg');
    expect('/path/img-er'.match(re)).to.equal(null, '/path/img-er');
  });

  it('should properly handle "/thing/(\\d{2,4})"', () => {
    const re = pathToRegex('/thing/(\\d{2,4})');
    expect(re.test('/thing/')).to.equal(false, '/thing/');
    expect(re.test('/thing/1')).to.equal(false, '/thing/1');
    expect(re.test('/thing/12')).to.equal(true, '/thing/12');
    expect(re.test('/thing/123')).to.equal(true, '/thing/123');
    expect(re.test('/thing/1234')).to.equal(true, '/thing/1234');
    expect(re.test('/thing/12345')).to.equal(false, '/thing/12345');
    expect(re.test('/thing/12d')).to.equal(false, '/thing/12d');
    let expected = { re1: '123' };
    expect('/thing/123'.match(re).groups).to.eql(expected, '/thing/123');
    expected = { re1: '8765' };
    expect('/thing/8765'.match(re).groups).to.eql(expected, '/thing/8765');
  });

  it('should properly handle "/testing/one/a.b"', () => {
    const re = pathToRegex('/testing/one/a.b');
    expect(re.test('/testing/one/a.')).to.equal(false, '/testing/one/a.');
    expect(re.test('/testing/one/a.b')).to.equal(true, '/testing/one/a.b');
    expect(re.test('/testing/one/a.bc')).to.equal(false, '/testing/one/a.bc');
  });

  it('should properly handle "/:size/:color?"', () => {
    const re = pathToRegex('/:size/:color?');
    expect(re.test('/large')).to.equal(true, '/large');
    expect(re.test('/large/')).to.equal(true, '/large/');
    expect(re.test('/large/blue')).to.equal(true, '/large/blue');
    expect(re.test('//blue')).to.equal(false, '//blue');
    expect(re.test('/large/blue/new')).to.equal(false, '/large/blue/new');
    let expected = { size: 'large', color: 'blue' };
    expect('/large/blue'.match(re).groups).to.eql(expected, '/large/blue');
    expected = { size: 'large', color: '' };
    expect('/large/'.match(re).groups).to.eql(expected, '/large/');
  });

  it('should properly handle "/kb/:path*"', () => {
    const re = pathToRegex('/kb/:path*');
    expect(re.test('/kb')).to.equal(true, '/kb');
    expect(re.test('/kb/one')).to.equal(true, '/kb/one');
    expect(re.test('/kb/one/two')).to.equal(true, '/kb/one/two');
    expect(re.test('/kb/one/two/three')).to.equal(true, '/kb/one/two/three');
  });

  it('should properly handle "/kb/:path*"', () => {
    const re = pathToRegex('/kb/:path*');
    expect(re.test('/kb')).to.equal(true, '/kb');
    expect(re.test('/kb/one')).to.equal(true, '/kb/one');
    expect(re.test('/kb/one/two')).to.equal(true, '/kb/one/two');
    expect(re.test('/kb/one/two/three')).to.equal(true, '/kb/one/two/three');
  });

  it('should properly handle "/kb/:path?"', () => {
    const re = pathToRegex('/kb/:path?');
    expect(re.test('/kb')).to.equal(true, '/kb');
    expect(re.test('/kb/one')).to.equal(true, '/kb/one');
    expect(re.test('/kb/one/two')).to.equal(false, '/kb/one/two');
    expect(re.test('/kb/one/two/three')).to.equal(false, '/kb/one/two/three');
  });

  it('should properly handle "/kb/:path+"', () => {
    const re = pathToRegex('/kb/:path+');
    expect(re.test('/kb')).to.equal(false, '/kb');
    expect(re.test('/kb/one')).to.equal(true, '/kb/one');
    expect(re.test('/kb/one/two')).to.equal(true, '/kb/one/two');
    expect(re.test('/kb/one/two/three')).to.equal(true, '/kb/one/two/three');
  });

  it('should properly handle "/image.(jpg|jpeg)"', () => {
    const re = pathToRegex('/image.(jpg|jpeg)');
    expect(re.test('/image.jpeg')).to.equal(true, '/image.jpeg');
    expect(re.test('/image.jpg')).to.equal(true, '/image.jpg');
    expect(re.test('/image.jpgs')).to.equal(false, '/image.jpgs');
    expect(re.test('/image.gif')).to.equal(false, '/image.gif');
    expect(re.test('/image.')).to.equal(false, '/image.');
    expect(re.test('/image-jpg')).to.equal(false, '/image-jpg');
  });

  it('should properly handle "/image-:size(\\d+)px.jpg"', () => {
    const re = pathToRegex('/image-:size(\\d+)px.jpg');
    expect(re.test('/image-px.jpg')).to.equal(false, '/image-px.jpg');
    expect(re.test('/image-10px.jpg')).to.equal(true, '/image-10px.jpg');
    expect(re.test('/image-543537635634534px.jpg')).to.equal(true, '/image-543537635634534px.jpg');
    expect(re.test('/image-1s2.jpg')).to.equal(false, '/image-1s2.jpg');
    let expected = { size: '10', re1: '10' };
    expect('/image-10px.jpg'.match(re).groups).to.eql(expected, '/image-10px.jpg');
  });
});
