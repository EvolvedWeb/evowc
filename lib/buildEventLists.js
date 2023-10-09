const EVENT_HANDLER_OPTION_CODE = {
  p: 'evt.preventDefault()',
  s: 'evt.stopPropagation()',
  i: 'evt.stopImmediatePropagation()'
}
let inputHandlerIndex = 0;

function getPSICode(psi) {
  const lines = [];
  if (psi) {
    lines.push(...psi.split('').map(option => {
      option = option.trim();
      const code = EVENT_HANDLER_OPTION_CODE[option];
      if (!code) {
        throw new TypeError(`Invalid event handler option "${option}". Valid options are "p" (preventDefault), "s" (stopPropagation), and "i" (stopImmediatePropagation)`)
      }

      return code;
    }));
  }

  return lines;
}

function generateList(events, element, bindings, eventList, inputHandlerList, forLoopItem) {
  const has2WayBinding = bindings?.some(binding => binding.add2WayBinding) || false;
  let inputHandler = '';
  const forArgs = forLoopItem ? `, _index, ${forLoopItem}` : '';

  // Process all user created events
  Object.entries(events ?? {}).forEach(([evt, func]) => {
    // Code to handle P,S,I
    const [fn, psi] = func.split(':');
    // TODO: 2023-09-21 - Validate that this function `fn` exists in the `<script>` block

    // Get the auto generated lines of code for PSI (EVENT_HANDLER_OPTION_CODE)
    const codeLines = getPSICode(psi);

    if (evt === 'input' && has2WayBinding) {
      // This event handler is within a 2-way binding
      codeLines.push(`\n    this.${fn}(evt, data${forArgs})`);

      inputHandler = codeLines.length === 1 ? `${codeLines[0]};` : `\n    ${codeLines.join(';\n    ')};`;
    }
    else {
      // This event handler is not in a 2-way biding
      codeLines.push(`this.${fn}(evt, {...evt.target.dataset}${forArgs})`);

      const evtCode = codeLines.length === 1 ? codeLines[0] : `{\n      ${codeLines.join(';\n      ')};\n    }`;
      eventList.push(`ael( ${element}, '${evt}', (evt)=>${evtCode})`);
    }
  });

  // Process 2-way binding automatic events
  bindings?.forEach(binding => {
    if (binding.add2WayBinding) {
      const fnName = `#${binding.srcField}_onInputHandler_${inputHandlerIndex++}`.replace(/##/g, '#_').replace(/\./g, '_');
      let inputHandlerStr = `/**
   * Input handler for ${forLoopItem ? 'the loop variable' : 'the class property'} "${binding.srcVar}"
   * @param {KeyboardEvent} evt - The "input" KeyboardEvent
   * @param {object} data - The values for "evt.target.dataset"
   `;
      if( forLoopItem ) {
        eventList.push(`ael( ${element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}${forArgs}))`);
        inputHandlerStr += `* @param {number} index - The current index from the ${binding.prop} array for this ${binding.srcObj}
   * @param {object} ${binding.srcObj} - The current ${binding.srcObj} from the ${binding.prop} array
   `;
      }
      else {
        eventList.push(`ael( ${element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}))`);
      }
      inputHandlerStr += `*/
  ${fnName}(evt, data${forArgs}) {
    // @ts-ignore
    ${binding.inputSetter}${inputHandler}
  }`;
      inputHandlerList.push(inputHandlerStr);
    }
  });
}

function buildEventLists(elementList) {
  const eventList = []
  const inputHandlerList = [];
  let forEventInfo = [];
  let forLoopItem = '';

  function build_For_EventList(elList) {
    elList.forEach(el => {
      if (typeof el === 'object') {
        let { element, events, bindings, children } = el;
        const innerEventList = [];

        generateList(events, element, bindings, innerEventList, inputHandlerList, forLoopItem);

        if (innerEventList.length > 0) {
          forEventInfo.push(...innerEventList);
        }

        if (children.length > 0) {
          build_For_EventList(children);
        }

        // Clean up memory to avoid stack overflow
        element = events = bindings = children = null;
      }
    });
  }

  function build_Regular_EventList(elList) {
    elList.forEach(el => {
      if (typeof el === 'object') {
        let { element, events, bindings, forLoop, children } = el;
        if (forLoop) {
          forLoopItem = forLoop.item;
          forEventInfo = [];
          build_For_EventList([el]);
          forLoop.forEventInfo = forEventInfo;
        }
        else {
          generateList(events, element, bindings, eventList, inputHandlerList);
          if (children.length > 0) {
            build_Regular_EventList(children);
          }
        }

        // Clean up memory to avoid stack overflow
        element = events = bindings = forLoop = children = null;
      }
    });
  }

  build_Regular_EventList(elementList);

  // Clean up memory to avoid stack overflow
  elementList = null;
  return { eventList, inputHandlerList };
}

module.exports = buildEventLists;
