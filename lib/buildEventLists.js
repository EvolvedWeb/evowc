const EVENT_HANDLER_OPTION_CODE = {
  p: 'evt.preventDefault()',
  s: 'evt.stopPropagation()',
  i: 'evt.stopImmediatePropagation()'
}
let inputHandlerIndex = 0;

/**
 * The following function is only for testing.
 * It resets `inputHandlerIndex` to 0 so all tests evaluate correctly.
 */
export function ResetInputHandlerIndex() {
  inputHandlerIndex = 0;
}

/**
 * Handle the auto-generated event handler code and convert the string codes 'p', 's', 'i'
 * into the associated code for the event handler. See EVENT_HANDLER_OPTION_CODE for conversion
 * @param {string} funcName - A string that can contain any and all characters 'p', 's', and/or 'i'
 * @returns string[] - The lines of code to add to the event handler
 */
export function getPSICode(funcName) {
  let preventsDefault = false;
  const alreadyUsed = {
    p: false,
    s: false,
    i: false
  };

  const [fn, psi] = funcName.split(':');
  const codeLines = [];
  if (psi) {
    codeLines.push(...psi.toLowerCase().split('').map(option => {
      const code = EVENT_HANDLER_OPTION_CODE[option];
      if (!code) {
        throw new TypeError(`Invalid event handler option "${option}". Valid options are "p" (preventDefault), "s" (stopPropagation), and "i" (stopImmediatePropagation)`)
      }

      // Prevent the same option from being used twice
      if (alreadyUsed[option]) {
        throw new TypeError(`Duplicate event handler option "${option}".`)
      }
      if (option === 'p') {
        preventsDefault = true;
      }
      alreadyUsed[option] = true;

      return code;
    }));
  }

  return {
    fn,
    codeLines,
    preventsDefault
  };
}

export function getCP1Code(event) {
  const [evt, options = ''] = event.split(':');
  const evtOptions = {
    unique: false,
    uniqueFor2WayBinding: false
  };

  options.split('').forEach(option => {
    if(option === 'c') {
      evtOptions.capture = true;
    }
    else if (option === 'p') {
      evtOptions.passive = true;
    }
    else if (option === '1') {
      evtOptions.once = true;
    }
    else {
      throw new Error(`Unsupported option "${option}". Valid options are "c" (capture), "p" (passive), and "1" (once).`);
    }
  });

  evtOptions.unique = evtOptions.passive || evtOptions.once || evtOptions.capture;
  evtOptions.uniqueFor2WayBinding = evtOptions.passive || evtOptions.once || !evtOptions.capture;

  return {
    evt,
    evtOptions
  }
}

function isEmpty(arr) {
  return arr == null || Object.keys(arr).length === 0;
}

/**
 * Process all event handlers for a specific element
 * @param {Object.<string, string>} events - Object of events
 * @param {string} element 
 * @param {object[]} bindings 
 * @param {*} eventList 
 * @param {*} inputHandlerList 
 * @param {*} forLoopItem 
 * @param {*} forLoopIndex 
 */
function generateList(events, element, bindings, elementStr, eventList, inputHandlerList, forLoopItem = null, forLoopIndex = null) {
  // TODO: 2024-02-23 MGC - If we will support multiple for loops then we will need
  //                        to change forLoopItem and forLoopIndex into an array
  if (isEmpty(events) && isEmpty(bindings)) {
    return;
  }

  
  const has2WayBinding = bindings?.some(binding => binding.add2WayBinding) || false;
  let inputHandler = '';
  // TODO: 2024-02-23 MGC - If we will support multiple for loops then we will need
  //                        to change how forArgs is calculated. Probably an object
  //                        that contains all values of forLoopItem and forLoopIndex
  const forArgs = forLoopItem ? `, ${forLoopIndex}, ${forLoopItem}` : '';
  const postEventHandlers = [];

  // Process all user created events for the current element
  Object.entries(events ?? {}).forEach(([event, func]) => {
    const { evt, evtOptions } = getCP1Code(event);

    // Get the auto generated lines of code for 'p', 's', 'i'
    const {fn, codeLines, preventsDefault} = getPSICode(func);
    // TODO: 2023-09-21 MGC - Use AST code to validate that this function `fn` exists in the `<script>` block

    // TODO: 2024-02-19 MGC - Use AST code see if a passive event handler function calls preventDefault()
    if (evtOptions.passive && preventsDefault) {
      throw new Error(`A "passive" event handler can not call "preventDefault()" in ${elementStr}.` )
    }

    if (has2WayBinding && ['input', 'checked'].includes(evt) && !evtOptions.uniqueFor2WayBinding) {
      // This event handler is called from within a 2-way binding handler
      codeLines.push(`\n    this.${fn}(evt, data${forArgs})`);

      inputHandler = codeLines.length === 1 ? `${codeLines[0]};` : `\n    ${codeLines.join(';\n    ')};`;
    }
    else {
      let eventOptions = '';
      if (evtOptions.unique) {
        // eslint-disable-next-line no-unused-vars
        const { unique, uniqueFor2WayBinding, ...temp } = evtOptions;
        eventOptions = (Object.keys(temp).length === 0) ? '' : `, ${JSON.stringify(temp)}`;
      }
      // This event handler is called directly
      codeLines.push(`this.${fn}(evt, {...evt.target.dataset}${forArgs})`);

      const evtCode = codeLines.length === 1 ? codeLines[0] : `{\n      ${codeLines.join(';\n      ')};\n    }`;
      const eh = `ael( ${element}, '${evt}', (evt)=>${evtCode}${eventOptions})`;
      if (has2WayBinding && evtOptions.uniqueFor2WayBinding) {
        postEventHandlers.push(eh);
      }
      else {
        eventList.push(eh);
      }
    }
  });

  // Process the automatic 2-way binding event handlers
  bindings?.forEach(binding => {
    if (binding.add2WayBinding) {
      const fnName = `#${binding.srcField}_onInputHandler_${inputHandlerIndex++}`.replace(/##/g, '#_').replace(/\./g, '_');
      let inputHandlerStr = `/**
   * Input handler for ${forLoopItem ? 'the loop variable' : 'the class property'} "${binding.srcVar}"
   * @param {InputEvent} evt - The "input" InputEvent
   * @param {object} data - The values for "evt.target.dataset"
   `;
      if( forLoopItem ) {
        eventList.push(`ael( ${element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}${forArgs}), {capture: true})`);
        inputHandlerStr += `* @param {number} index - The current index from the ${binding.prop} array for this ${binding.srcObj}
   * @param {object} ${binding.srcObj} - The current ${binding.srcObj} from the ${binding.prop} array
   `;
      }
      else {
        eventList.push(`ael( ${element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}), {capture: true})`);
      }
      inputHandlerStr += `*/
  ${fnName}(evt, data${forArgs}) {
    // @ts-ignore
    ${binding.inputSetter}${inputHandler}
  }`;
      inputHandlerList.push(inputHandlerStr);
    }
  });

  if (postEventHandlers.length > 0) {
    eventList.push(...postEventHandlers);
  }
}

/**
 * 
 * @param {*} elementList 
 * @returns 
 */
export function buildEventLists(elementList) {
  const eventList = []
  const inputHandlerList = [];
  let forEventInfo = [];
  // TODO: 2024-02-23 MGC - If we will support multiple for loops then we will need
  //                        to change forLoopItem and forLoopIndex into an array
  let forLoopItem = '';
  let forLoopIndex = '';

  function build_For_EventList(elList) {
    elList.forEach(el => {
      if (typeof el === 'object') {
        let { events, element, bindings, children, elementStr } = el;
        // TODO: 2024-02-23 MGC - If we will support multiple for loops then we will need
        //                        to add this level's forLoop info here
        const innerEventList = [];

        generateList(events, element, bindings, elementStr, innerEventList, inputHandlerList, forLoopItem, forLoopIndex);

        if (innerEventList.length > 0) {
          forEventInfo.push(...innerEventList);
        }

        if (children.length > 0) {
          build_For_EventList(children);
        }
      }
    });
  }

  function build_Regular_EventList(elList) {
    elList.forEach(el => {
      if (typeof el === 'object') {
        let { element, events, bindings, forLoop, children, elementStr } = el;
        if (forLoop) {
          forLoopItem = forLoop.item;
          forLoopIndex = forLoop.indexName;
          forEventInfo = [];
          build_For_EventList([el]);
          forLoop.forEventInfo = forEventInfo;
        }
        else {
          generateList(events, element, bindings, elementStr, eventList, inputHandlerList);
          if (children.length > 0) {
            build_Regular_EventList(children);
          }
        }
      }
    });
  }

  build_Regular_EventList(elementList);

  return { eventList, inputHandlerList };
}
