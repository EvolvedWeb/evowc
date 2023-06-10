const LOOP_HANDLER_NAME = '$$LOOP_HANDLER$$';

let inputHandlerIndex = 0;
function generateList(events, element, bindings, eventList, inputHandlerList, forLoopItem) {
  const has2WayBinding = bindings?.some(binding => binding.add2WayBinding) || false;
  let inputHandler = '';
  const forArgs = forLoopItem ? `, index, ${forLoopItem}` : '';

  Object.entries(events ?? {}).forEach(([evt, fn]) => {
    if (evt === 'input' && has2WayBinding) {
      inputHandler = `\n    this.${fn}(evt, data${forArgs});`;
    }
    else {
      if (forLoopItem) {
        eventList.push(`ael( ${element}, '${evt}', (evt)=>this.${fn}(evt, {...evt.target.dataset}, index, ${forLoopItem}))`);
      }
      else {
        eventList.push(`ael( ${element}, '${evt}', (evt)=>this.${fn}(evt, {...evt.target.dataset}) );`);
      }
    }
  });

  bindings?.forEach(binding => {
    if (binding.add2WayBinding) {
      const fnName = `#${binding.srcField}_onInputHandler_${inputHandlerIndex++}`.replace(/##/g, '#_').replace(/\./g, '_');
      let inputHandlerStr = `/**
   * Input handler for ${forLoopItem ? 'the loop variable' : 'the class property'} "${binding.srcVar}"
   * @param {KeyboardEvent} evt - The "input" KeyboardEvent
   * @param {object} data - The values for "evt.target.dataset"
   `;
      if( forLoopItem ) {
        eventList.push(`ael( ${element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}, index, ${forLoopItem}))`);
        inputHandlerStr += `* @param {number} index - The current index from the ${binding.prop} array for this ${binding.srcObj}
   * @param {object} ${binding.srcObj} - The current ${binding.srcObj} from the ${binding.prop} array
   `;
      }
      else {
        eventList.push(`ael( ${element}, 'input', (evt)=>this.${fnName}(evt, {...evt.target.dataset}) );`);
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

  function buildForEventList(elementList) {
    elementList.forEach(el => {
      if (typeof el === 'object') {
        let { element, elementName, events, bindings, children } = el;
        const innerEventList = [];

        generateList(events, element, bindings, innerEventList, inputHandlerList, forLoopItem);

        if (innerEventList.length > 0) {
          forEventInfo.push(...innerEventList);
        }

        if (children.length > 0) {
          buildForEventList(children);
        }

        // Clean up memory to avoid stack overflow
        element = elementName = events, bindings = children = null;
      }
    });
  }

  function buildRegularEventList(elementList) {
    elementList.forEach(el => {
      if (typeof el === 'object') {
        let { element, events, bindings, forLoop, children } = el;
        if (forLoop) {
          forLoopItem = forLoop.item;
          forEventInfo = [];
          buildForEventList([el]);
          forLoop.forEventInfo = forEventInfo;
        }
        else {
          generateList(events, element, bindings, eventList, inputHandlerList);
          if (children.length > 0) {
            buildRegularEventList(children);
          }
        }

        // Clean up memory to avoid stack overflow
        element = events = bindings = forLoop = children = null;
      }
    });
  }

  buildRegularEventList(elementList);

  // Clean up memory to avoid stack overflow
  elementList = null;
  return { eventList, inputHandlerList };
}

module.exports = buildEventLists;
