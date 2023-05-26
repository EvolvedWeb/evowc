export const propFromAttr = attr => attr.replace(/-[a-z]/g, (key) => key[1].toUpperCase());

export const boolFromVal = (val) => ['', 'true', '1'].includes(val) ? true : ['false', '0'].includes(val) ? false : Boolean(val);

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

export function compObjs(newVal, oldVal) {

}

export function compArrays(newVal, oldVal) {

}

export function compDates(newVal, oldVal) {

}

export function cond(el, condition, commentEl) {
  if (el && commentEl) {
    if (condition) {
      commentEl.after(el);
    }
    else {
      el.remove();
    }
  }
}

export function ael(element, evt, fn) {
  element.addEventListener(evt, fn);
  return () => element.removeEventListener(evt, fn);
}

export function comment(key, srcEl) {
  const c = document.createComment(key);
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
    const els = [...root.querySelectorAll('[js]')].reduce((o, el) => (o[el.getAttribute('js')] = el, o), {});
    if(checkRoot) {
      const key = root.getAttribute('js');
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

      /**************************************************************************\
        TODO: 2023-05-08 - Depending on the speed of how this routine works:
        Figure out which elements need to be changed, created, moved or deleted
      \**************************************************************************/
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
    5. Use key to reduce re - rendering
*/