/* eslint-env mocha */
const expect = require('chai').expect;
const getForBindingLines = require('./getForBindingLines.js')
const { PROPERTY_TYPES } = require("./parseBinding");

describe('getForBindingLines tests', function () {
  it('should handle attributes', () => {
    const bindings = [
      {
        elementStr: '<wow>',
        element: 'el1',
        add2WayBinding: false,
        attribute: 'my-dog',
        prop: 'myDog',
        type: PROPERTY_TYPES.ATTR
      },
      {
        elementStr: '<div>',
        element: 'el2',
        add2WayBinding: false,
        attribute: 'fat-cat',
        prop: 'fatCat',
        type: PROPERTY_TYPES.ATTR
      }
    ];
    const lines = [];
    const { has2WayBinding } = getForBindingLines(bindings, lines);
    const expected = [
      "  // Call 'setAttr' for the element: <wow>",
      "  setAttr( el1, 'my-dog', undefined ?? null);",
      "  // Call 'setAttr' for the element: <div>",
      "  setAttr( el2, 'fat-cat', undefined ?? null);"
    ];
    expect(has2WayBinding).to.equal(false);
    expect(lines).to.eql(expected);
  });
  it('should handle ARIA attributes', () => {
    const bindings = [
      {
        elementStr: '<wow>',
        element: 'el1',
        add2WayBinding: false,
        attribute: 'label',
        prop: 'label',
        setterProp: 'fruit',
        type: PROPERTY_TYPES.ARIA
      },
      {
        elementStr: '<div>',
        element: 'el2',
        add2WayBinding: false,
        attribute: 'describedby',
        prop: 'describedby',
        setterProp: 'veggie',
        type: PROPERTY_TYPES.ARIA
      }
    ];
    const lines = [];
    const { has2WayBinding } = getForBindingLines(bindings, lines);
    const expected = [
      "  // Call 'setAttr' for the element: <wow>",
      "  setAttr( el1, 'aria-label', fruit ?? null);",
      "  // Call 'setAttr' for the element: <div>",
      "  setAttr( el2, 'aria-describedby', veggie ?? null);"
    ];
    expect(has2WayBinding).to.equal(false);
    expect(lines).to.eql(expected);
  });
  it('should handle DATA attributes with a pipe', () => {
    const bindings = [
      {
        elementStr: '<wow>',
        element: 'el1',
        add2WayBinding: false,
        attribute: 'name',
        prop: 'name',
        type: PROPERTY_TYPES.DATA,
        pipes: [
          'this.#toUpper',
          'reverse'
        ],
        setterProp: 'fruit',
        defaultVal: "''"
      },
      {
        elementStr: '<div>',
        element: 'el2',
        add2WayBinding: false,
        attribute: 'age',
        prop: 'age',
        setterProp: 'this.dogs',
        type: PROPERTY_TYPES.DATA
      }
    ];
    const lines = [];
    const { has2WayBinding } = getForBindingLines(bindings, lines);
    const expected = [
      "  // Set 'dataset.name' for the element: <wow>",
      "  el1.dataset.name = reverse(this.#toUpper(structuredClone(fruit ?? ''), el1.dataset), el1.dataset);",
      "  // Set 'dataset.age' for the element: <div>",
      "  el2.dataset.age = this.dogs ?? null;"
    ];
    expect(has2WayBinding).to.equal(false);
    expect(lines).to.eql(expected);
  });
  it('should handle properties', () => {
    const bindings = [
      {
        elementStr: '<wow>',
        element: 'el1',
        add2WayBinding: false,
        attribute: 'label',
        prop: 'label',
        setterProp: 'fruit',
        type: PROPERTY_TYPES.PROP
      },
      {
        elementStr: '<div>',
        element: 'el2',
        add2WayBinding: false,
        attribute: 'describedby',
        prop: 'describedby',
        setterProp: 'veggie',
        type: PROPERTY_TYPES.PROP
      }
    ];
    const lines = [];
    const { has2WayBinding } = getForBindingLines(bindings, lines);
    const expected = [
      "  // Set the property 'label' for the element: <wow>",
      "  el1.label = fruit ?? null;",
      "  // Set the property 'describedby' for the element: <div>",
      "  el2.describedby = veggie ?? null;"
    ];
    expect(has2WayBinding).to.equal(false);
    expect(lines).to.eql(expected);
  });
  it('should handle an invalid type', () => {
    const bindings = [
      {
        elementStr: '<wow>',
        element: 'el1',
        add2WayBinding: false,
        attribute: 'label',
        prop: 'label',
        type: 'INVALID'
      }
    ];
    const lines = [];
    expect(() => getForBindingLines(bindings, lines)).to.throw('Unknown property type "INVALID"');
  });
});
