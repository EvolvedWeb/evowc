import { getPipedVal } from './getPipedVal.js';

export function makeAttrLine(line, binding, spacing = '') {
  const { elementStr, element, attribute } = binding;
  line.push(`${spacing}// Call 'setAttr' for the element: ${elementStr}`);
  line.push(`${spacing}setAttr( ${element}, '${attribute}', ${getPipedVal(binding, element)});`);
}

export function makeAriaLine(line, binding, spacing = '') {
  const { elementStr, element, attribute } = binding;
  line.push(`${spacing}// Call 'setAttr' for the element: ${elementStr}`);
  line.push(`${spacing}setAttr( ${element}, 'aria-${attribute}', ${getPipedVal(binding, element)});`);
}

export function makeDataLine(line, binding, spacing = '') {
  const { elementStr, element, prop } = binding;
  line.push(`${spacing}// Set 'dataset.${prop}' for the element: ${elementStr}`);
  line.push(`${spacing}${element}.dataset.${prop} = ${getPipedVal(binding, element)};`);
}

export function makePropLine(line, binding, spacing = '') {
  const { elementStr, element, prop } = binding;
  // console.log(binding);
  line.push(`${spacing}// Set the property '${prop}' for the element: ${elementStr}`);
  line.push(`${spacing}${element}.${prop} = ${getPipedVal(binding, element)};`);
}
