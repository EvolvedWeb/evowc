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
    console.log(`Invalid element when calling setAttr:`);
    console.log(el);
  }
}

export function cond(el, condition, commentEl) {
  if (el && commentEl) {
    if (condition) {
      commentEl.parentNode.insertBefore(el, commentEl);
    }
    else {
      el.remove();
    }
  }
}

export const propFromAttr = attr => attr.replace(/-[a-z]/g, (key) => key[1].toUpperCase());
export const ael = (element, evt, fn ) => element.addEventListener(evt, fn);
export const boolFromVal = (val) => ['true', '1'].includes(val) ? true : ['false', '0'].includes(val) ? false : Boolean(val);

export function comment(key, srcEl) {
  const c = document.createComment(key);
  const parent = srcEl.parentNode;
  parent.insertBefore(c, srcEl);
  return c;
}

export const EvoElement = (baseClass = HTMLElement) => class extends baseClass {
  #domAttached = false;
  #rootDom;
  #usingShadow;
  #styles;
  #componentName;

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
    //  that will be appended to this element once `connectedCallback` us called
    // We place everything into the real DOM to get all of the components to upgrade.
    // TODO: 2023-04-23 MGC - Putting everything into the DOM may have adverse effects
    if (template) {
      let tempEl = document.createElement('div');
      tempEl.setAttribute('style', 'visible:hidden;width:0;height:0;');
      document.body.appendChild(tempEl)
      tempEl.innerHTML = template;
      [...tempEl.children].forEach(el => this.#rootDom.appendChild(el));
      tempEl.remove();
      tempEl = null;
    }

    return this.getEls();
  }

  //**********************************************************************************
  // Get a handle to all of the dynamic elements
  getEls() {
    return [...this.#rootDom.querySelectorAll('[js]')]
      .reduce((o, el) => (o[el.getAttribute('js')] = el, o), {});
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
}