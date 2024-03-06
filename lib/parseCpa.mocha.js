import { expect } from 'chai';
import { parseCpa } from './parseCpa.js';

describe('parseCpa tests', function () {
  it('should support a string CPA with no type:default', () => {
    const expected = {
      attrName: 'name',
      defaultValue: "''",
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_name',
      propName: 'name',
      setHostAttr: false,
      type: 'str',
      value: true,
    }
    expect(parseCpa('name', true, false, true, 'p')).to.eql(expected);
    expected.attrName = false;
    expected.isPublic = false;
    expected.privatePropName = 'name';

    expect(parseCpa('name', true, false, false, 'p')).to.eql(expected);
  });

  it('should support a string CPA with type:default', () => {
    const expected = {
      attrName: 'food',
      defaultValue: "'tacos'",
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_food',
      propName: 'food',
      setHostAttr: false,
      type: 'str',
      value: 'str:tacos',
    }
    expect(parseCpa('food', 'str:tacos', false, true, 'p')).to.eql(expected);
    expected.attrName = false;
    expected.defaultValue = "'pizza'";
    expected.isPublic = false;
    expected.privatePropName = 'food';
    expected.value = 'str:pizza';

    expect(parseCpa('food', 'str:pizza', false, false, 'p')).to.eql(expected);
  });

  it('should support a number CPA', () => {
    const expected = {
      attrName: 'total-amount',
      defaultValue: 10.56,
      elements: {},
      isPublic: true,
      min: undefined,
      max: undefined,
      objType: '',
      privatePropName: '#_totalAmount',
      propName: 'totalAmount',
      setHostAttr: false,
      type: 'num',
      value: 'num:10.56',
    }
    expect(parseCpa('total-amount', 'num:10.56', false, true, 'p')).to.eql(expected);
    expected.attrName = false;
    expected.defaultValue = 1234.56;
    expected.isPublic = false;
    expected.propName = 'income';
    expected.privatePropName = 'income';
    expected.value = 'num:1234.56';

    expect(parseCpa('income', 'num:1234.56', false, false, 'p')).to.eql(expected);
  });

  it('should support an integer CPA', () => {
    const expected = {
      attrName: 'age',
      defaultValue: 34,
      elements: {},
      isPublic: true,
      min: undefined,
      max: undefined,
      objType: '',
      privatePropName: '#_age',
      propName: 'age',
      setHostAttr: false,
      type: 'int',
      value: 'int:34',
    }
    expect(parseCpa('age', 'int:34', false, true, 'p')).to.eql(expected);
    expected.attrName = false;
    expected.defaultValue = 4;
    expected.isPublic = false;
    expected.propName = 'tires';
    expected.privatePropName = 'tires';
    expected.value = 'int:4';

    expect(parseCpa('tires', 'int:4', false, false, 'p')).to.eql(expected);
  });

  it('should support a BigInt CPA', () => {
    const expected = {
      attrName: 'age',
      defaultValue: 34n,
      elements: {},
      isPublic: true,
      min: undefined,
      max: undefined,
      objType: '',
      privatePropName: '#_age',
      propName: 'age',
      setHostAttr: false,
      type: 'bigint',
      value: 'bigint:34',
    }
    expect(parseCpa('age', 'bigint:34', false, true, 'p')).to.eql(expected);
    expected.attrName = false;
    expected.defaultValue = 4n;
    expected.isPublic = false;
    expected.propName = 'tires';
    expected.privatePropName = 'tires';
    expected.value = 'bigint:4n';

    expect(parseCpa('tires', 'bigint:4n', false, false, 'p')).to.eql(expected);
  });

  it('should support a boolean CPA', () => {
    const expected = {
      attrName: 'show',
      defaultValue: true,
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_show',
      propName: 'show',
      setHostAttr: false,
      type: 'bool',
      value: 'bool:true',
    }
    expect(parseCpa('show', 'bool:true', false, true, 'p')).to.eql(expected);
    expected.attrName = false;
    expected.isPublic = false;
    expected.privatePropName = 'show';
    expect(parseCpa('show', 'bool:true', false, false, 'p')).to.eql(expected);

    expected.setHostAttr = true
    expected.defaultValue = false;
    expected.value = 'bool:false';
    expect(parseCpa('show', 'bool:false', true, false, 'p')).to.eql(expected);
    expected.attrName = 'show';
    expected.isPublic = true;
    expected.privatePropName = '#_show';
    expect(parseCpa('show', 'bool:false', true, true, 'p')).to.eql(expected);
  });

  it('should support a null CPA', () => {
    const expected = {
      attrName: 'thing',
      defaultValue: null,
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_thing',
      propName: 'thing',
      setHostAttr: false,
      type: 'null',
      value: 'null',
    }
    expect(parseCpa('thing', 'null', false, true, 'p')).to.eql(expected);
  });

  it('should support a date CPA', () => {
    const expected = {
      attrName: 'now',
      defaultValue: 'null',
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_now',
      propName: 'now',
      setHostAttr: false,
      type: 'date',
      value: 'date',
    }
    expect(parseCpa('now', 'date', false, true, 'p')).to.eql(expected);
    expected.defaultValue = 'new Date(\'March 5, 1965\')';
    expected.value = 'date:March 5, 1965';
    expect(parseCpa('now', 'date:March 5, 1965', false, true, 'p')).to.eql(expected);
  });

  it('should support a date using a var CPA', () => {
    const expected = {
      attrName: 'now',
      defaultValue: 'new Date()',
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_now',
      propName: 'now',
      setHostAttr: false,
      type: 'date',
      value: 'date:var:new Date()',
    }
    expect(parseCpa('now', 'date:var:new Date()', false, true, 'p')).to.eql(expected);
  });

  it('should support an object CPA', () => {
    const expected = {
      attrName: 'pets',
      defaultValue: '{count:3,animal:"dogs"}',
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_pets',
      propName: 'pets',
      setHostAttr: false,
      type: 'obj',
      value: 'obj:{count:3,animal:"dogs"}',
    }
    expect(parseCpa('pets', 'obj:{count:3,animal:"dogs"}', false, true, 'p')).to.eql(expected);
  });

  it('should support an object CPA with no default', () => {
    const expected = {
      attrName: 'pets',
      defaultValue: '{}',
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_pets',
      propName: 'pets',
      setHostAttr: false,
      type: 'obj',
      value: 'obj',
    }
    expect(parseCpa('pets', 'obj', false, true, 'p')).to.eql(expected);
  });

  it('should support an object CPA with Object type', () => {
    const expected = {
      attrName: 'pets',
      defaultValue: '{count:3,animal:"dogs"}',
      elements: {},
      isPublic: true,
      objType: 'Animal',
      privatePropName: '#_pets',
      propName: 'pets',
      setHostAttr: false,
      type: 'obj',
      value: 'obj<Animal>:{count:3,animal:"dogs"}',
    }
    expect(parseCpa('pets', 'obj<Animal>:{count:3,animal:"dogs"}', false, true, 'p')).to.eql(expected);
  });

  it('should support an array CPA', () => {
    const expected = {
      attrName: 'stuff',
      defaultValue: '[1,2,"three"]',
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_stuff',
      propName: 'stuff',
      setHostAttr: false,
      type: 'arr',
      value: 'arr:[1,2,"three"]',
    }
    expect(parseCpa('stuff', 'arr:[1,2,"three"]', false, true, 'p')).to.eql(expected);
  });

  it('should support an array CPA with no default', () => {
    const expected = {
      attrName: 'stuff',
      defaultValue: '[]',
      elements: {},
      isPublic: true,
      objType: '',
      privatePropName: '#_stuff',
      propName: 'stuff',
      setHostAttr: false,
      type: 'arr',
      value: 'arr',
    }
    expect(parseCpa('stuff', 'arr', false, true, 'p')).to.eql(expected);
  });

  it('should support an array CPA with Object type', () => {
    const expected = {
      attrName: 'stuff',
      defaultValue: '[1,2,"three"]',
      elements: {},
      isPublic: true,
      objType: 'Something',
      privatePropName: '#_stuff',
      propName: 'stuff',
      setHostAttr: false,
      type: 'arr',
      value: 'arr<Something>:[1,2,"three"]',
    }
    expect(parseCpa('stuff', 'arr<Something>:[1,2,"three"]', false, true, 'p')).to.eql(expected);
  });
});
