/* eslint-env mocha */
const expect = require('chai').expect;
const processProperties = require('./processProperties.js')

describe('processProperties tests', function () {
  it('should handle usesEls and usesComments', () => {
    const useEls = true;
    const usesComments = true;
    const properties = {};
    const test = processProperties(useEls, usesComments, properties);
    const expected = {
      privateClassFields: `
  // Internal properties
  /** @type {Object<string, HTMLElement>} */ #els = {};
  /** @type {Object<string, Comment>} */ #comments = {};
`,
      setDeafultValues: ``,
      observedAttributes: ``
    };

    expect(test).to.eql(expected);
  });
  it('should handle just properties', () => {
    const useEls = false;
    const usesComments = false;
    const properties = {
      int: {
        attrName: 'age',
        defaultValue: 21,
        isPublic: true,
        objType: null,
        privatePropName: '#_age',
        propName: 'age',
        type: 'int'
      },
      str: {
        attrName: 'name',
        defaultValue: "''",
        isPublic: true,
        objType: null,
        privatePropName: '#_name',
        propName: 'name',
        type: 'str'
      }
    };
    const test = processProperties(useEls, usesComments, properties);
    const expected = {
      privateClassFields: `
  // Internal properties
  /** @type {number} */ #_age;
  /** @type {string} */ #_name;
`,
      setDeafultValues: `

    // Initialize component with default values
    this.age ??= 21;
    this.name ??= '';`,
      observedAttributes: "'age', 'name'"
    };

    expect(test).to.eql(expected);
  });
  it('should handle a private property object and public array', () => {
    const useEls = false;
    const usesComments = false;
    const properties = {
      obj: {
        attrName: null,
        defaultValue: '{}',
        isPublic: false,
        objType: '<Person>',
        privatePropName: '#__person',
        propName: '#person',
        type: 'obj'
      },
      arr: {
        attrName: 'car',
        defaultValue: "{}",
        isPublic: true,
        objType: '<Auto>',
        privatePropName: '#_car',
        propName: 'car',
        type: 'arr'
      }
    };
    const test = processProperties(useEls, usesComments, properties);
    const expected = {
      privateClassFields: `
  // Internal properties
  /** @type {<Person>} */ #__person;
  /** @type {<Auto>[]} */ #_car;
`,
      setDeafultValues: `

    // Initialize component with default values
    this.#person ??= {};
    this.car ??= {};`,
      observedAttributes: "'car'"
    };

    expect(test).to.eql(expected);
  });
  it('should throw an exception for objType with invalid data type', () => {
    const useEls = false;
    const usesComments = false;
    const properties = {
      int: {
        attrName: null,
        defaultValue: '{}',
        isPublic: false,
        objType: '<Person>',
        privatePropName: '#__person',
        propName: '#person',
        type: 'int'
      }
    };
    expect(() => processProperties(useEls, usesComments, properties)).to.throw('Object Names are not valid for "int" data type.');
  });
});
