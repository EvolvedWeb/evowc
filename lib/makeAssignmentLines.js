const getPipedVal = require("./getPipedVal");

function makeAttrLine(line, elementStr, elName, binding, spacing = '') {
  line.push(`${spacing}// Call 'setAttr' for the element: ${elementStr}`);
  line.push(`${spacing}setAttr( ${elName}, '${binding.attribute}', ${getPipedVal(binding, elName)});`);
}

function makeAriaLine(line, elementStr, elName, binding, spacing = '') {
  line.push(`${spacing}// Call 'setAttr' for the element: ${elementStr}`);
  line.push(`${spacing}setAttr( ${elName}, 'aria-${binding.attribute}', ${getPipedVal(binding, elName)});`);
}

function makeDataLine(line, elementStr, elName, binding, spacing = '') {
  line.push(`${spacing}// Set 'dataset.${binding.prop}' for the element: ${elementStr}`);
  line.push(`${spacing}${elName}.dataset.${binding.prop} = ${getPipedVal(binding, elName)};`);
}

function makePropLine(line, elementStr, elName, binding, spacing = '') {
  line.push(`${spacing}// Set the property '${binding.prop}' for the element: ${elementStr}`);
  line.push(`${spacing}${elName}.${binding.prop} = ${getPipedVal(binding, elName)};`);
}

module.exports = {
  makeAttrLine,
  makeAriaLine,
  makeDataLine,
  makePropLine
}