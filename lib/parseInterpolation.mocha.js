import { expect } from 'chai';
import { parseInterpolation } from './parseInterpolation.js';

describe('parseInterpolation tests', function () {
  it('should properly handle simple text for textContent', () => {
    const expected = {
      "original": "simple text",
      "parts": [
        { "type": "TXT", "value": "simple text" }
      ]
    };
    expect(parseInterpolation("simple text", false)).to.eql(expected, 'simple text, false');
  });

  it('should properly handle {variable} for textContent', () => {
    const expected = {
      "original": "{variable}",
      "parts": [
        { "type": "EXP", "value": "variable" }
      ]
    };
    expect(parseInterpolation("{variable}", false)).to.eql(expected, '{variable}, false');
  });

  it('should properly handle simple CPA var', () => {
    const expected = {
      "original": "cpaVar",
      "parts": [
        { "type": "EXP", "value": "cpaVar" }
      ]
    };
    expect(parseInterpolation("cpaVar", true)).to.eql(expected, 'cpaVar, true');
  });

  it('should properly handle an equation as a CPA var', () => {
    const expected = {
      "original": "#name.length === 0 || #age < 18",
      "parts": [
        { "type": "EXP", "value": "#name.length === 0 || #age < 18" }
      ]
    };
    expect(parseInterpolation("#name.length === 0 || #age < 18", true)).to.eql(expected, '"#name.length === 0 || #age < 18", true');
  });

  it('should properly handle multiple {} as a CPA var', () => {
    const expected = {
      "original": "{name}{age}",
      "parts": [
        { "type": "EXP", "value": "name" },
        { "type": "EXP", "value": "age" }
      ]
    };
    expect(parseInterpolation("{name}{age}", true)).to.eql(expected, '"{name}{age}", true');
  });

  it('should properly handle multiple {} as textContent', () => {
    const expected = {
      "original": "{name}{age}",
      "parts": [
        { "type": "EXP", "value": "name" },
        { "type": "EXP", "value": "age" }
      ]
    };
    expect(parseInterpolation("{name}{age}", false)).to.eql(expected, '"{name}{age}", false');
  });

  it('should properly handle multiple {} as textContent', () => {
    const expected = {
      "original": "Name: {name}, age: {age}",
      "parts": [
        { "type": "TXT", "value": "Name: " },
        { "type": "EXP", "value": "name" },
        { "type": "TXT", "value": ", age: " },
        { "type": "EXP", "value": "age" }
      ]
    };
    expect(parseInterpolation("Name: {name}, age: {age}")).to.eql(expected, '"Name: {name}, age: {age}"');
  });

  it('should properly handle an equation as textContent', () => {
    const expected = {
      "original": "{index + 1}",
      "parts": [
        { "type": "EXP", "value": "index + 1" }
      ]
    };
    expect(parseInterpolation("{index + 1}", false)).to.eql(expected, '"{index + 1}", false');
  });

  it('should properly handle escaped {} as textContent', () => {
    const expected = {
      "original": "\\{This is \\\\ escaped\\}",
      "parts": [
        { "type": "TXT", "value": "{This is \\ escaped}" },
      ]
    };
    expect(parseInterpolation("\\{This is \\\\ escaped\\}", false)).to.eql(expected, '"\\{This is \\\\ escaped\\}", false');
  });

  it('should properly handle escaped {} as as a CPA var', () => {
    const expected = {
      "original": "\\{This is \\\\ escaped\\}",
      "parts": [
        { "type": "EXP", "value": "{This is \\ escaped}" },
      ]
    };
    expect(parseInterpolation("\\{This is \\\\ escaped\\}", true)).to.eql(expected, '"\\{This is \\\\ escaped\\}", true');
  });

  it('should properly handle escaped {} as textContent', () => {
    const expected = {
      "original": "\\{This is \\\\ escaped\\} and {not_escaped} now",
      "parts": [
        { "type": "TXT", "value": "{This is \\ escaped} and " },
        { "type": "EXP", "value": "not_escaped" },
        { "type": "TXT", "value": " now" }
      ]
    };
    expect(parseInterpolation("\\{This is \\\\ escaped\\} and {not_escaped} now", false)).to.eql(expected, '"\\{This is \\\\ escaped\\} and {not_escaped} now", false');
  });

  it('should properly handle escaped {} as as a CPA var', () => {
    const expected = {
      "original": "\\{This is \\\\ escaped\\} and {not_escaped} now",
      "parts": [
        { "type": "TXT", "value": "{This is \\ escaped} and " },
        { "type": "EXP", "value": "not_escaped" },
        { "type": "TXT", "value": " now" }
      ]
    };
    expect(parseInterpolation("\\{This is \\\\ escaped\\} and {not_escaped} now", true)).to.eql(expected, '"\\{This is \\\\ escaped\\} and {not_escaped} now", true');
  });
});
