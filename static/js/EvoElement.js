/* eslint-env browser */
// RegExp to find any tag that has the `el` attribute so we can add the `_cid` attribute on a per component basis
const CID_RE = /(<\b[^>]*\b(?:el\s*=\s*(?:"[^"]*"|'[^']*'|[^ \t\n>]+)))/gi;

/**
 * Convert a kebab case attribute name to a Camel Case property name. Mainly
 * used by the `attributeChangedCallback` method.
 *
 * @param {string} attr - Kebab case attribute name
 * @returns {string} - Camel case property name
 */
export const propFromAttr = attr => attr.replace(/-[a-z]/g, (key) => key[1].toUpperCase());

/**
 * Check to see if the passed in value is an object and not null
 * @param {any} value - value to be checked
 * @returns {boolean} - `true` is the value is an object and not null
 */
export const isObject = value => !!(value && typeof value === 'object');

/**
 * Convert an attribute value to a boolean value.
 * Returns `null` if the attribute is defined as `null` or `undefined`
 * Returns `true` if the attribute is defined with no value, 'true', '1' or can be coerced to `true`.
 * Returns `false` if the attribute is defined with a value of 'false', '0' or can be coerced to `false`.
 *
 * @param {any} val - Attribute value to be checked.
 * @returns {boolean | null} - Boolean version of the attribute value.
 */
export const boolFromVal = (val) => {
  // Explicitly handle the most common representations of true and false
  if (['', 'true', '1'].includes(val)) {
    return true;
  }
  else if (['false', '0'].includes(val)) {
    return false;
  }
  else if (val == null) {
    return null;
  }

  // Convert any other value to its boolean equivalent
  return Boolean(val);
};

/**
 * Set an attribute on the DOM element `el`. If the value passed in
 * is `true`, then the attribute will be set with no value.
 * If the value passed in is `false`, `null`, or `undefined`, then
 * the attribute will be removed from `el`.
 *
 * @param {HTMLElement} el - The DOM element to be affected.
 * @param {string} attr - The name of the attribute.
 * @param {string | boolean | null | undefined} value - The value to set for the attribute.
 * @throws {Error} If `el` is not a valid HTMLElement.
 */
export function setAttr(el, attr, value) {
  if (!(el instanceof HTMLElement)) {
    throw new Error('Invalid element provided to setAttr');
  }

  if (value === false || value == null) {
    el.removeAttribute(attr);
  }
  else if (value === true) {
    el.setAttribute(attr, '');
  }
  else {
    el.setAttribute(attr, value.toString());
  }
}

/**
 * Compare two objects for deep equality.
 *
 * @param {object} obj1 - The first object to compare.
 * @param {object} obj2 - The second object to compare.
 * @returns {boolean} - `true` if the objects have the same content.
 */
export function sameObjs(obj1, obj2) {
  // If both are exactly the same reference, they are equal
  if (obj1 === obj2) {
    return true;
  }

  // If either is not an object or if either is null, compare directly
  if (!isObject(obj1) || !isObject(obj2)) {
    return false
  }

  const entries1 = Object.entries(obj1);
  const len2 = Object.keys(obj2).length;

  // Check if both objects have the same number of properties and all properties are equal
  return entries1.length === len2 && entries1.every(([key, val1]) => {
    const val2 = obj2[key];
    // If both values are objects (and not null), compare them recursively
    if (isObject(val1) && isObject(val2)) {
      return sameObjs(val1, val2);
    }
    // Direct comparison for non-object values or null
    return val1 === val2;
  });
}

/**
 * Compare if two dates are equal.
 * @param {Date} date1 - First date to compare.
 * @param {Date} date2 - Second date to compare.
 * @returns {boolean} - `true` if both date1 and date2 are Date objects and they both have the same value, `false` otherwise.
 */
export function sameDates(date1, date2) {
  // Check if both arguments are Date objects
  const areBothDates = date1 instanceof Date && date2 instanceof Date;

  // Ensure both dates are valid Date objects and compare their valueOf() results
  return areBothDates && date1.valueOf() === date2.valueOf();
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
      // eslint-disable-next-line
      isValid = (value == compare); // Do not use === here
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
 * Adds an event listener to an element with options for once, passive, and capture.
 * Returns a function to remove the event listener.
 *
 * @param {EventTarget} element - The target element to attach the event listener to.
 * @param {string} type - The type of event to listen for.
 * @param {(evt: Event) => void} listener - The callback function for the event. It takes an Event object as its argument and returns nothing.
 * @param {Object} [options={}] - Optional parameters for the event listener (once, passive, capture).
 * @returns {() => void} A function to remove the attached event listener.
 */
export function ael(element, type, listener, options = {}) {
  if (!(element instanceof EventTarget) || !type || typeof listener !== 'function' || typeof options !== 'object') {
    throw new Error('Please provide proper arguments when calling ael(element, type, listener, options)');
  }
  const addOptions = {
    once: !!options.once,
    passive: !!options.passive,
    capture: !!options.capture
  }

  // @ts-ignore
  element.addEventListener(type, listener, addOptions);
  const removeOptions = { capture: addOptions.capture};
  return () => {
    // @ts-ignore
    element.removeEventListener(type, listener, removeOptions);
  }
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

let componentIndex = 0n;
export const EvoElement = (baseClass = HTMLElement) => class extends baseClass {
  /** @type {DocumentFragment|ShadowRoot|HTMLElement|null}*/#rootDom = null;
  #componentId = '0';
  #domAttached = false;
  #usingShadow = true;
  #styles = '';
  #componentName = '';
  #forList = {};
  #loopedEls = {};

  createDom({ template='', styles='', shadowMode='open', componentName }) {
    this.#componentId = (++componentIndex).toString(36);
    if (shadowMode === 'none') {
      this.#usingShadow = false;
      this.#rootDom = document.createDocumentFragment();
    }
    else {
      this.#usingShadow = true;
      // @ts-ignore
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
      tempEl.setAttribute('style', 'visibility:hidden;width:0;height:0;overflow:hidden;');
      // TODO: 2023-04-23 MGC - WARNING, Need to research: Putting everything into the DOM may have adverse effects
      document.body.appendChild(tempEl)
      // Insert the template that is modified to tag all elements with this components id (issue #17)
      tempEl.innerHTML = template.replace(CID_RE, `$1 _cid="${this.#componentId}"`);
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

    return this.getEls();
  }

  /**
   * Get a handle to all of the dynamic elements
   */
  getEls(root) {
    const checkRoot = !!root;
    root ??= this.#rootDom;

    // Find all elements that are bindable, looped, or conditional that belong to this component only. (issue #17)
    const selector = `[el][_cid="${this.#componentId}"]`;
    // eslint-disable-next-line no-return-assign, no-sequences
    const els = [...root.querySelectorAll(selector)].reduce((o, el) => (o[el.getAttribute('el')] = el, o), {});
    if(checkRoot) {
      const key = root.getAttribute('el');
      if (key) {
        els[key] = root;
      }
    }
    return els;
  }

  allEls(key) {
    const selector = `[el="${key}"][_cid="${this.#componentId}"]`;
    return [...this.#rootDom.querySelectorAll(selector)];
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

      const { comment: commentEl, srcEl/*, item, index*/ } = forInfo;
      const loopedEls = this.#loopedEls[loopElementKey] || [];

      // Create new elements
      const newEls = data.map((item, index) => {
        // TODO: Check to see if element by this itemKey already exists in this.#loopedEls[loopElementKey]
        let el = null;
        if (!item.hasOwnProperty(itemKeyName)) {
          console.error(`item does not have a key property named "${itemKeyName}"`);
        }
        const itemKey = item[itemKeyName];
        if(itemKey && loopedEls.length) {
          loopedEls.some(loopedEl => {
            if (loopedEl.itemKey === itemKey) {
              el = loopedEl.el;
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
      loopedEls.forEach(loopedEl => {
        loopedEl.events.forEach(rmEvt => rmEvt()); // remove event handlers
        loopedEl.el.remove(); // Remove the element from DOM

        // Clean up to prevent memory leaks
        loopedEl.itemKey = null;
        loopedEl.events = null;
        loopedEl.el = null;
        loopedEl = null;
      })

      this.#loopedEls[loopElementKey] = newEls;
      // Insert all of the new elements
      commentEl.after(...(newEls.map(newEl => newEl.el)));
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
    // @ts-ignore
    if(this.update) this.update({});
    // @ts-ignore
    if(this.connected) this.connected();
  }

  disconnectedCallback() {
    // @ts-ignore
    if(this.disconnected) this.disconnected();
  }

  adoptedCallback() {
    // @ts-ignore
    if(this.adopted) this.adopted();
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal !== newVal) {
      // @ts-ignore
      if (this.attrChanged) this.attrChanged(attr, oldVal, newVal);
      const prop = propFromAttr(attr);
      setTimeout(() => {
        this[prop] = newVal;
      }, 1);
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
      // @ts-ignore
      if (!doc.querySelector(`style[component="${this.#componentName}"]`)) {
        // Add this style tag into the DOM
        doc.appendChild(styleEl);
      }
    }
  }
}
/*
  For possible future use:
  hasSetter(propName) {
    let obj = this;
    while (obj) {
      const proto = obj.constructor.prototype;
      let descriptor = Object.getOwnPropertyDescriptor(proto, propName);
      if (descriptor) {
        return typeof descriptor.set === 'function';
      }
      // Traverse the prototype chain
      obj = Object.getPrototypeOf(proto);
    }
    return false;
  }
*/