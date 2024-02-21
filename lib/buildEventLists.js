
/**
 * 
 */
const EVENT_HANDLER_OPTION_CODE = {
  p: 'evt.preventDefault()',
  s: 'evt.stopPropagation()',
  i: 'evt.stopImmediatePropagation()'
}
let inputHandlerIndex = 0;

/**
 * Handle the auto-generated event handler code and convert the string codes 'p', 's', 'i'
 * into the associated code for the event handler. See EVENT_HANDLER_OPTION_CODE for conversion
 * @param {string} psi - A string that can contain any and all characters 'p', 's', and/or 'i'
 * @returns string[] - The lines of code to add to the event handler
 */
export function getPSICode(func) {
  let preventsDefault = false;
  const alreadyUsed = {
    p: false,
    s: false,
    i: false
  };

  const [fn, psi] = func.split(':');
  const codeLines = [];
  if (psi) {
    codeLines.push(...psi.split('').map(option => {
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
    unique: false
  };
  let unique = false;

  options.split('').forEach(option => {
    if(option === 'c') {
      evtOptions.capture = true;
    }
    else if (option === 'p') {
      evtOptions.passive = true;
      unique = true;
    }
    else if (option === '1') {
      evtOptions.once = true;
      unique = true;
    }
  });

  evtOptions.unique = unique || !evtOptions.capture;

  return {
    evt,
    evtOptions
  }
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
export function generateList(events, element, bindings, eventList, inputHandlerList, elementStr, forLoopItem = null, forLoopIndex = null) {
  if (events == null && bindings == null) {
    return;
  }

  const has2WayBinding = bindings?.some(binding => binding.add2WayBinding) || false;
  let inputHandler = '';
  const forArgs = forLoopItem ? `, ${forLoopIndex || '_index'}, ${forLoopItem}` : '';
  const postEventHandlers = [];

  // Process all user created events for the current element
  Object.entries(events ?? {}).forEach(([event, func]) => {
    const { evt, evtOptions } = getCP1Code(event);

    // Get the auto generated lines of code for 'p', 's', 'i'
    const {fn, codeLines, preventsDefault} = getPSICode(func);
    // TODO: 2023-09-21 MGC - Use AST code to validate that this function `fn` exists in the `<script>` block

    // TODO: 2024-02-19 MGC - Use AST code see if this function calls preventDefault()
    if (evtOptions.passive && preventsDefault) {
      throw new Error(`A "passive" event handler can not call "preventDefault()" in ${elementStr}.` )
    }

    if (has2WayBinding && ['input','checked'].includes(evt) && !evtOptions.unique) {
      // This event handler is called from within a 2-way binding handler
      codeLines.push(`\n    this.${fn}(evt, data${forArgs})`);

      inputHandler = codeLines.length === 1 ? `${codeLines[0]};` : `\n    ${codeLines.join(';\n    ')};`;
    }
    else {
      let eventOptions = '';
      if (evtOptions.unique) {
        // eslint-disable-next-line no-unused-vars
        const { unique, ...temp } = evtOptions;
        eventOptions = `, ${JSON.stringify(temp)}`;
      }
      // This event handler is called directly
      codeLines.push(`this.${fn}(evt, {...evt.target.dataset}${forArgs})`);

      const evtCode = codeLines.length === 1 ? codeLines[0] : `{\n      ${codeLines.join(';\n      ')};\n    }`;
      const eh = `ael( ${element}, '${evt}', (evt)=>${evtCode}${eventOptions})`;
      if (has2WayBinding && evtOptions.unique) {
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
  let forLoopItem = '';
  let forLoopIndex = '';

  function build_For_EventList(elList) {
    elList.forEach(el => {
      if (typeof el === 'object') {
        let { element, events, bindings, children, elementStr } = el;
        const innerEventList = [];

        generateList(events, element, bindings, innerEventList, inputHandlerList, elementStr, forLoopItem, forLoopIndex);

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
        let { element, events, bindings, forLoop, children, elementStr } = el;
        if (forLoop) {
          forLoopItem = forLoop.item;
          forLoopIndex = forLoop.indexName;
          forEventInfo = [];
          build_For_EventList([el]);
          forLoop.forEventInfo = forEventInfo;
        }
        else {
          generateList(events, element, bindings, eventList, inputHandlerList, elementStr);
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
