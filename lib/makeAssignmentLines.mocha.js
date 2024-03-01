import { expect } from 'chai';
import { makeAttrLine, makeAriaLine, makeDataLine, makePropLine } from './makeAssignmentLines.js';

describe('makeAssignmentLines tests', () => {
  describe('makeAttrLine tests', () => {
    it('should handle attributes with no pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :attr.dog="title">',
        element: 'el0',
        attribute: 'dog',
        pipes: null,
        setterProp: 'newVal',
        defaultVal: 'null'
      };
      const expected = [
        `// Call 'setAttr' for the element: <some :attr.dog="title">`,
        "setAttr( el0, 'dog', newVal ?? null);"
      ];
      makeAttrLine(line, binding);
      expect(line).to.eql(expected);
    });

    it('should handle attributes with pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :attr.fish="title">',
        element: 'el12',
        attribute: 'fish',
        pipes: ['one','two'],
        setterProp: 'this.title',
        defaultVal: '"blank"'
      };
      const expected = [
        `// Call 'setAttr' for the element: <some :attr.fish="title">`,
        "setAttr( el12, 'fish', two(one(structuredClone(this.title ?? \"blank\"), el12.dataset), el12.dataset));"
      ];
      makeAttrLine(line, binding);
      expect(line).to.eql(expected);
    });
  });

  describe('makeAriaLine tests', () => {
    it('should handle ARIA attributes with no pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :aria.dog="title">',
        element: 'el0',
        attribute: 'dog',
        pipes: null,
        setterProp: 'newVal',
        defaultVal: 'null'
      };
      const expected = [
        `  // Call 'setAttr' for the element: <some :aria.dog="title">`,
        "  setAttr( el0, 'aria-dog', newVal ?? null);"
      ];
      makeAriaLine(line, binding, '  ');
      expect(line).to.eql(expected);
    });

    it('should handle ARIA attributes with pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :aria.fish="title">',
        element: 'el12',
        attribute: 'fish',
        pipes: ['one', 'two'],
        setterProp: 'this.title',
        defaultVal: '"blank"'
      };
      const expected = [
        `    // Call 'setAttr' for the element: <some :aria.fish="title">`,
        "    setAttr( el12, 'aria-fish', two(one(structuredClone(this.title ?? \"blank\"), el12.dataset), el12.dataset));"
      ];
      makeAriaLine(line, binding, '    ');
      expect(line).to.eql(expected);
    });
  });

  describe('makeDataLine tests', () => {
    it('should handle DATA property with no pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :data.dog="title">',
        element: 'el0',
        prop: 'dog',
        pipes: null,
        setterProp: 'newVal',
        defaultVal: 'null'
      };
      const expected = [
        `// Set 'dataset.dog' for the element: <some :data.dog="title">`,
        `el0.dataset.dog = newVal ?? null;`
      ];
      makeDataLine(line, binding, '');
      expect(line).to.eql(expected);
    });

    it('should handle DATA property with pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :data.fish="title">',
        element: 'el12',
        prop: 'fish',
        pipes: ['one', 'two'],
        setterProp: 'this.title',
        defaultVal: '"blank"'
      };
      const expected = [
        `// Set 'dataset.fish' for the element: <some :data.fish="title">`,
        `el12.dataset.fish = two(one(structuredClone(this.title ?? \"blank\"), el12.dataset), el12.dataset);`
      ];
      makeDataLine(line, binding);
      expect(line).to.eql(expected);
    });
  });

  describe('makePropLine tests', () => {
    it('should handle property with no pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :dog="title">',
        element: 'el0',
        prop: 'dog',
        pipes: null,
        setterProp: 'newVal',
        defaultVal: 'null'
      };
      const expected = [
        `// Set the property 'dog' for the element: <some :dog="title">`,
        `el0.dog = newVal ?? null;`
      ];
      makePropLine(line, binding, '');
      expect(line).to.eql(expected);
    });

    it('should handle property with pipes', () => {
      const line = [];
      const binding = {
        elementStr: '<some :fish="title">',
        element: 'el12',
        prop: 'fish',
        pipes: ['one', 'two'],
        setterProp: 'this.title',
        defaultVal: '"blank"'
      };
      const expected = [
        `// Set the property 'fish' for the element: <some :fish="title">`,
        `el12.fish = two(one(structuredClone(this.title ?? \"blank\"), el12.dataset), el12.dataset);`
      ];
      makePropLine(line, binding);
      expect(line).to.eql(expected);
    });
  });
});
