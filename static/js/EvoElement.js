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
export function sameObjs(obj1, obj2) {
  // If both objects are null then they are the same
  if (obj1 == null && obj2 == null) {
    return true;
  }

  // If either of these value are not objects the compare them
  if(typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }

  const entries = Object.entries(obj1);
  const len2 = Object.keys(obj2).length;
  return (entries.length === len2) && entries.every(([k,nv]) => {
    const ov = obj2[k];
    if (isObject(nv) && isObject(ov)) {
      return sameObjs(nv, ov);
    }

    return nv === ov;
  });
}

/**
 * Compare if two dates are equal
 * @param {Array} date1 First date to compare
 * @param {Array} date1 Second date to compare
 * @returns boolean - `true` if the dates have the same value
 */
export function sameDates(date1, date2) {
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
 * Add an event listener to `element`
 * @param {HTMLElement} element The DOM element to monitor
 * @param {string} type - The event type to attach to `element`
 * @param {*} listener - The event listener function
 * @returns function - The function to remove this event listener
 */
export function ael(element, type, listener) {
  if (!element || !type || typeof listener !== 'function') {
    throw new Error('Please provide proper arguments when calling ael(element, type, listener');
  }
  element.addEventListener(type, listener);
  return () => element.removeEventListener(type, listener);
}

/**
 * Create a Comment and place it in the DOM just before `srcEl`
 *
 * @param {string} message - The message to place in the Comment
 * @param {HTMLElement} srcEl - The Comment will be inserted into the DOM just before this element
 * @returns {Comment} - The HTML Comment element
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

  createDom({ template='', styles='', shadowMode='open', componentName, commentEls = [] }) {
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
      [...tempEl.childNodes].forEach(el => this.#rootDom.appendChild(el));
      tempEl.remove();
      tempEl = null;

      // Prep for the $for elements
      this.#rootDom.querySelectorAll('[_loop]').forEach(el => {
        const key = el.getAttribute('_loop');
        const [item, index] = el.getAttribute('_key').split('.');
        el.removeAttribute('_loop');
        el.removeAttribute('_key');
        const commentEl = comment(key, el);
        const info = { key, comment: commentEl, srcEl: el, item, index };
        this.#forList[key] = info;
        el.remove();
      });
    }

    const els = this.getEls();

    commentEls.forEach(name => {
      els[`${name}_c`] = comment(name, els[name]);
    });

    return els;
  }

  /**
   * Get a handle to all of the dynamic elements
   */
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
    return [...this.#rootDom.querySelectorAll(`[el="${key}"]`)];
  }

  loopItemEls(loopElementKey, idx) {
    let els = {};
    const loopedEls = this.#loopedEls[loopElementKey] || [];
    const elItem = loopedEls && loopedEls[idx];
    if (elItem) {
      els = this.getEls(elItem.el);
    }

    return els;
  }

  forLoop(loopElementKey, data, itemKeyName, bindCb) {
    const forInfo = this.#forList[loopElementKey];
    if (forInfo) {
      if (!Array.isArray(data)) {
        throw new TypeError(`The 'data' must be an array of all the data to render`);
      }

      const { comment, srcEl, item, index } = forInfo;
      const loopedEls = this.#loopedEls[loopElementKey] || [];

      // Create new elements
      const newEls = data.map((item, index) => {
        // TODO: Check to see if element by this itemKey already exists in this.#loopedEls[loopElementKey]
        let el = null;
        if (!item.hasOwnProperty(itemKeyName)) {
          console.log(`item does not have a key property called "${itemKeyName}"`);
        }
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
        bindCb(els, index, item, events);

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

      this.#loopedEls[loopElementKey] = newEls;
      // Insert all of the new elements
      comment.after(...(newEls.map(item => item.el)));
    }
    else {
      console.error(`No $for information for the loopElementKey "${loopElementKey}"`);
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

  /**
   * Figure out where to place the CSS based on if this component is using shadow DOM or not.
   * If this component is not using shadow DOM then we need to place it in the shadow DOM of
   * the component that is containing this one. If this component is not is any shadow DOM then
   * then CSS is placed into the <head></head>
   */
  #insertStyles() {
    if (this.#styles) {
      // Determine the correct place to add our styles
      // The location will be different based on if we are or are not in Shadow DOM
      const styleEl = document.createElement('style');

      // Add this component name into the component attribute
      styleEl.setAttribute('component', this.#componentName);
      styleEl.textContent = this.#styles;

      let doc;
      if (this.#usingShadow) {
        // If we are using shadow DOM then the css belongs in this shadow DOM.
        doc = this.#rootDom;
      }
      else {
        let el = this;
        if (el.getRootNode) {
          // Find the shadow DOM wherein this component lives.
          doc = el.getRootNode();
          if (doc === document) {
            // If the root node is the document then we place the CSS in `<head>`
            doc = document.head;
          }
        }
        else {
          doc = document.head; // Shadow DOM isn't supported so place the CSS in `<head>`
        }
      }

      // If the CSS for the component is not in the correct place then add it.
      // See if there is a style tag with our component name in the component attribute
      // We use the component attribute as a way to track our CSS files.
      if (!doc.querySelector(`style[component="${this.#componentName}"]`)) {
        // Add this style tag into the DOM
        doc.appendChild(styleEl);
      }
    }
  }
}