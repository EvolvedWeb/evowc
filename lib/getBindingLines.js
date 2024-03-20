import { getPipedVal } from './getPipedVal.js';
import { makePropLine, makeDataLine, makeAriaLine, makeAttrLine } from './makeAssignmentLines.js';
import { PROPERTY_TYPES } from './parseBinding.js';

export function getBindingLines(elName, data, bindingList) {
  const { binding, conditional, elementName, elementStr } = data;
  const resp = structuredClone(bindingList);
  // TODO: 2023-05-29 Optimize the inForLoop code to put everything possible into one forEach
  binding?.forEach(bind => {
    const line = [];
    const b = {
      ...bind,
      element: elName, //`this.#els.${elementName}`,
      elementStr
    }

    switch (b.type) {
      case PROPERTY_TYPES.ATTR:
        if (b.inForLoop) {
          line.push(`// Call 'setAttr' for all of the loop generated elements: ${elementStr}`);
          line.push(`this.allEls('${elementName}').forEach(el => setAttr( el, '${b.attribute}', ${getPipedVal(b, 'el')}));`);
        }
        else {
          makeAttrLine(line, b);
        }
        break;

      case PROPERTY_TYPES.ARIA:
        if (b.inForLoop) {
          line.push(`// Call 'setAttr' for all of the loop generated elements: ${elementStr}`);
          line.push(`this.allEls('${elementName}').forEach(el => setAttr( el, 'aria-${b.attribute}', ${getPipedVal(b, 'el')}));`);
        }
        else {
          makeAriaLine(line, b);
        }
        break;

      case PROPERTY_TYPES.DATA:
        if (b.inForLoop) {
          line.push(`// Set 'dataset.${b.prop}' for all of the loop generated elements: ${elementStr}`);
          line.push(`this.allEls('${elementName}').forEach(el => {el.dataset.${b.prop} = ${getPipedVal(b, 'el')}});`);
        }
        else {
          makeDataLine(line, b);
        }
        break;

      case PROPERTY_TYPES.PROP:
        if (b.inForLoop) {
          line.push(`// Set the property '${b.prop}' for all of the loop generated elements: ${elementStr}`);
          line.push(`this.allEls('${elementName}').forEach(el => {el.${b.prop} = ${getPipedVal(b, 'el')}});`);
        }
        else {
          makePropLine(line, b);
        }
        break;

      default:
        throw new Error(`Unknown property type "${b.type}"`);
    }

    if (line.length > 0) {
      resp.push(...line);
    }
  });

  if (conditional) {
    const commentName = elName.replace('.#els.', '.#comments.')
    if (conditional.min != null || conditional.max != null) {
      resp.push(`cond( ${elName}, ${commentName}, newVal, [${conditional.negative},${conditional.min ?? ''},${conditional.max ?? ''}] );`);
    }
    else {
      resp.push(`cond( ${elName}, ${commentName}, newVal, ${conditional.value} );`);
    }
  }

  return resp;
}
