/**
 * Convert an attribute name to a property name. Mainly
 * used by the `attributeChangedCallback` method.
 *
 * @param {string} attr - Snake case attribute name
 * @returns string - Camel case property name
 */
export const propFromAttr = attr => attr.replace(/-[a-z]/g, (key) => key[1].toUpperCase());

/**
 * Check to see if the passesd in value is an object and not null
 * @param {any} value - value to be checked
 * @returns boolean - `true` is the value is an object and not null
 */
export const isObject = value => !!(value && typeof value === 'object');

/**
 * Convert an attribute value to a boolean value.
 * If the attribute is defined with no value or if the value is
 * either 'true' or '1' then this function returns `true` otherwise
 * this function returns false.
 *
 * @param {string} val - Attribute value to be checked
 * @returns boolean - boolean version of the attribute value
 */
export const boolFromVal = (val) => ['', 'true', '1'].includes(val) ? true : ['false', '0'].includes(val) ? false : Boolean(val);

/**
 * Set an attribute on the DOM element `el`. If the value passed in
 * is `true` then the attribute will be set with no value.
 * If the value passed in is `false`, `null`, or `undefined` then
 * the atribute will be removed from `el`.
 *
 * @param {HTMLElement} el - The DOM element to be affected
 * @param {string} attr - The name of the attribute
 * @param {string|boolean} value - The value to set for the attribute
 */
export function setAttr(el, attr, value) {
  if(el instanceof Element) {
    if (value == null || value === false) {
      el.removeAttribute(attr);
    }
    else if (value === true) {
      el.setAttribute(attr, '');
    }
    else {
      el.setAttribute(attr, value);
    }
  }
  else {
    console.error(`Invalid element when calling setAttr:`);
    console.info(el);
  }
}

/**
 * Compare two objects deeply equal
 *
 * @param {object} obj1 - first object to compare
 * @param {object} obj2 - second object to compare
 * @returns boolean - `true` if the objects have the same content
 */
export function compObjs(obj1, obj2) {
  if(!obj1 || !obj2) {
    return false;
  }
  const newEs = Object.entries(obj1);
  const oldlen = Object.keys(obj2).length;
  return (newEs.length === oldlen) && newEs.every(([k,nv]) => {
    const ov = obj2[k];
    if (isObject(nv) && isObject(ov)) {
      return compObjs(nv, ov);
    }

    return nv === ov;
  });
}

/**
 * Compare if two arrays are deeply equal
 * @param {Array} arr1 First array to compare
 * @param {Array} arr2 Second array to compare
 * @returns boolean - `true` if the arrays have the same content
 */
export function compArrays(arr1, arr2) {
  return (Array.isArray(arr1) || Array.isArray(arr2)) &&
    compObjs(arr1, arr2);
}

/**
 * Compare if two dates are equal
 * @param {Array} date1 First date to compare
 * @param {Array} date1 Second date to compare
 * @returns boolean - `true` if the dates have the same value
 */
export function compDates(date1, date2) {
  return (date1?.valueOf && date2?.valueOf) &&
    date1.valueOf() !== date2.valueOf();
}

export function cond(el, commentEl, value, compare ) {
  if (el && commentEl) {
    let isValid = false;
    if (Array.isArray(compare)) {
      const [ neg, min, max ] = compare;
      if (max == null) {
        isValid = (value >= min);
      }
      else if (min == null) {
        isValid = (value <= max);
      }
      else {
        isValid = (value >= min && value <= max);
      }

      if (neg) {
        isValid = !isValid;
      }
    }
    else {
      isValid = (value === compare);
    }

    if (isValid) {
      commentEl.after(el);
    }
    else {
      el.remove();
    }
  }
}

/**
 * Addan event handler to `el`
 * @param {HTMLElement} el The DOM element to monitor
 * @param {string} evt - The event name to attach to `el`
 * @param {*} fn - The event handler function
 * @returns function - The function to remove this event handler
 */
export function ael(el, evt, fn) {
  el.addEventListener(evt, fn);
  return () => el.removeEventListener(evt, fn);
}

/**
 * Create a Comment and place it in the DOM just before `srcEl`
 *
 * @param {string} message - The message to place in the Comment
 * @param {HTML} srcEl - The Comment will be inserted into the DOM just before this element
 * @returns Comment - The HTML Comment element
 */
export function comment(message, srcEl) {
  const c = document.createComment(`  ${message}  `);
  srcEl.before(c);
  return c;
}

export const EvoElement = (baseClass = HTMLElement) => class extends baseClass {
  #domAttached = false;
  #rootDom;
  #usingShadow;
  #styles;
  #componentName;
  #forList = {};
  #loopedEls = {};

  createDom({ template='', styles='', shadowMode='open', componentName }) {
    if (shadowMode === 'none') {
      this.#usingShadow = false;
      this.#rootDom = document.createDocumentFragment();
    }
    else {
      this.#usingShadow = true;
      this.#rootDom = this.attachShadow({ mode: shadowMode });
      // Indicate that the template is already in the shadow DOM
      this.#domAttached = true;
    }

    this.#componentName = componentName;
    this.#styles = styles;
    this.#insertStyles()

    // Add the Template to the `#rootDom`
    // If we are not using our own shadow DOM then `#rootDom` is put in a fragment
    // that will be appended to this element once `connectedCallback` is called
    // We place everything into the real DOM to get all of the components to upgrade.
    if (template) {
      let tempEl = document.createElement('div');
      tempEl.setAttribute('style', 'visible:hidden;width:0;height:0;');
      // TODO: 2023-04-23 MGC - WARNING: Putting everything into the DOM may have adverse effects
      document.body.appendChild(tempEl)
      tempEl.innerHTML = template;
      [...tempEl.children].forEach(el => this.#rootDom.appendChild(el));
      tempEl.remove();
      tempEl = null;

      // Prep for the $for elements
      this.#rootDom.querySelectorAll('[_loop]').forEach(el => {
        const key = el.getAttribute('_loop');
        const [item, index] = el.getAttribute('_item').split('.');
        el.removeAttribute('_loop');
        el.removeAttribute('_item');
        const commentEl = comment(key, el);
        const info = { key, comment: commentEl, srcEl: el, item, index };
        this.#forList[key] = info;
        el.remove();
      });

      //console.log(this.#forList);
    }

    return this.getEls();
  }

  //**********************************************************************************
  // Get a handle to all of the dynamic elements
  getEls(root) {
    const checkRoot = !!root;
    root ??= this.#rootDom;
    const els = [...root.querySelectorAll('[el]')].reduce((o, el) => (o[el.getAttribute('el')] = el, o), {});
    if(checkRoot) {
      const key = root.getAttribute('el');
      if (key) {
        els[key] = root;
      }
    }
    return els;
  }
  allEls(key) {
    return [...this.#rootDom.querySelectorAll(`[js="${key}"]`)];
  }
  forLoop(loopItemKey, data, itemKeyName, bindCb) {
    const forInfo = this.#forList[loopItemKey];
    if(!Array.isArray(data)) {
      throw new TypeError(`The 'data' must be an array of all the data to render`);
    }
    if (forInfo) {
      const { comment, srcEl, item, index } = forInfo;
      const loopedEls = this.#loopedEls[loopItemKey] || [];

      // Create new elements
      const newEls = data.map((item, idx) => {
        // TODO: Check to see if element by this itemKey already exists in this.#loopedEls[loopItemKey]
        let el = null;
        const itemKey = item[itemKeyName];
        if(itemKey && loopedEls.length) {
          loopedEls.some((item, i) => {
            if (item.itemKey === itemKey) {
              el = item.el;
              return true;
            }
          });
        }

        el ??= srcEl.cloneNode(true);
        const els = this.getEls(el);
        const events = [];

        // Call the code to set all values and create all event handlers
        bindCb(els, item, events);

        return { itemKey, el, events };
      }, {});

      // remove previous elements and event handlers
      loopedEls.forEach(item => {
        item.events.forEach(rmEvt => rmEvt()); // remove event handlers
        item.el.remove(); // Remove the element from DOM

        // Clean up to prevent memory leaks
        item.itemKey = null;
        item.events = null;
        item.el = null;
        item = null;
      })

      this.#loopedEls[loopItemKey] = newEls;
      // Insert all of the new elements
      comment.after(...(newEls.map(item => item.el)));
    }
    else {
      console.error(`No $for information for the loopItemKey "${loopItemKey}"`);
    }
  }
  dispatch(name, {detail = null, bubbles = false, cancelable = true, composed = false } = {}) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new TypeError('name must be defined');
    }

    const event = new CustomEvent(name, { detail, bubbles, cancelable, composed });
    this.dispatchEvent(event);
    return event;
  }
  connectedCallback() {
    if (!this.#domAttached) {
      this.appendChild(this.#rootDom);
      this.#rootDom = this;
      this.#domAttached = true;
    }
    this.#insertStyles()
    this.update && this.update();
    this.connected && this.connected();
  }
  disconnectedCallback() {
    this.disconnected && this.disconnected();
  }
  adoptedCallback() {
    this.adopted && this.adopted();
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    this.attrChanged && this.attrChanged(attr, oldVal, newVal);
    if (oldVal !== newVal) {
      const prop = propFromAttr(attr);
      this[prop] = newVal;
    }
  }
  #insertStyles() {
    if (this.#styles) {
      // Determine the correct place to add our styles
      // The location will be different based on if we are or are not in Shadow DOM
      const styleEl = document.createElement('style');
      // Add out component name into the component attribute
      styleEl.setAttribute('component', this.#componentName);
      styleEl.textContent = this.#styles;
      let doc;
      if (this.#usingShadow) {
        doc = this.#rootDom;
      }
      else {
        let el = this;
        if (el.getRootNode) {
          doc = el.getRootNode();
          if (doc === document) {
            doc = document.head;
          }
        }
        else {
          doc = document.head; // Shadow DOM isn't supported so place it in `<head>`
        }
      }

      // If the CSS for the component is not in the correct place then add it.
      // See if there is a style tag with our component name in the component attribute
      if (!doc.querySelector(`style[component="${this.#componentName}"]`)) {
        // Add this style tag into the dom
        doc.appendChild(styleEl);
      }
    }
  }
}
/*
  Get a handle to the looped element and remove it from the DOM

  As the array changes:
    1. Remove all previously generated DOM for this looped item.
    2. Generate a new set of DOM for the looped item based on the array.
    3. Temporarily ignoire non-array varaible and the key.
    4. Non-array variables that are used in a $for will need a function to set all values in an array
    5. Use key to reduce re-rendering
*/