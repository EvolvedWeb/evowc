const { PROPERTY_TYPES } = require("./parseBinding");
const { makeAttrLine, makeAriaLine, makeDataLine, makePropLine } = require("./makeAssignmentLines");

function getForBindingLines(bindings, line) {
  let has2WayBinding = false;
  bindings?.forEach(binding => {
    const { elementStr, element: elName, add2WayBinding } = binding;
    has2WayBinding ||= add2WayBinding;
    switch (binding.type) {
      case PROPERTY_TYPES.ATTR:
        makeAttrLine(line, elementStr, elName, binding, '  ');
        break;

      case PROPERTY_TYPES.ARIA:
        makeAriaLine(line, elementStr, elName, binding, '  ');
        break;

      case PROPERTY_TYPES.DATA:
        makeDataLine(line, elementStr, elName, binding, '  ');
        break;

      case PROPERTY_TYPES.PROP:
        makePropLine(line, elementStr, elName, binding, '  ');
        break;

      default:
        throw new Error(`Unknown property type "${binding.type}"`);
    }
  });

  // TODO: 2023-06-03 MGC - Support Conditionals Within a loop
  // if (conditional) {
  //   const commentName = elName.replace('.#els.', '.#comments.')
  //   if (conditional.min != null || conditional.max != null) {
  //     bindingList.push(`cond( ${elName}, ${commentName}, newVal, [${conditional.negative},${conditional.min ?? ''},${conditional.max ?? ''}] );`);
  //   }
  //   else {
  //     bindingList.push(`cond( ${elName}, ${commentName}, newVal, ${conditional.value} );`);
  //   }
  // };

  return { has2WayBinding };
}

module.exports = getForBindingLines;