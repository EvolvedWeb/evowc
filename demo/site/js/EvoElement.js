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

export function handleCondition(el, condition, commentEl) {
  if (el && commentEl) {
    if (condition) {
      if (!el.isConnected) {
        const parent = commentEl.parentNode;
        if(parent) {
          parent.insertBefore(el, commentEl);
          commentEl.remove();
        }
      }
    }
    else {
      if (el.isConnected) {
        const parent = el.parentNode;
        if (parent) {
          parent.insertBefore(commentEl, el);
          el.remove();
        }
      }
    }
  }
}

export const propFromAttr = attr => attr.replace(/-[a-z]/g, (key) => key[1].toUpperCase());

export const EvoElement = (baseClass = HTMLElement) => class extends baseClass {
  #domAttached = false;
  #rootDom;

  createDom({ template='', styles='', shadowMode='open', componentName }) {
    if (shadowMode === 'none') {
      this.#rootDom = document.createDocumentFragment();
    }
    else {
      this.#rootDom = this.attachShadow({ mode: shadowMode });
      // Indicate that the template is already in the shadow DOM
      this.#domAttached = true;
    }

    if (styles) {
      // Determine the correct place to add our styles
      // The location will be different based on if we are or are not in Shadow DOM
      const styleEl = document.createElement('style');
      styleEl.textContent = styles;
      if (this.#domAttached) {
        this.#rootDom.appendChild(styleEl);
      }
      else {
        let doc;
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

        // If the CSS for the component is not in the correct place then add it.
        // See if there is a style tag with our component name in the component attribute
        if (!doc.querySelector(`style[component="${componentName}"]`)) {
          // Add out component name into the component attribute
          styleEl.setAttribute('component', componentName);
          // Add this style tag into the dom
          doc.appendChild(styleEl);
        }
      }
    }

    // Add the Template to the `#rootDom`
    // If we are not using our own shadow DOM then `#rootDom` is put in a fragment
    //  that will be appended to this element once `connectedCallback` us called
    const templateEl = document.createElement('template');
    templateEl.innerHTML = template;
    this.#rootDom.appendChild(templateEl.content);

    return this.getEls();
  }

  //**********************************************************************************
  // Get a handle to all of the dynamic elements
  getEls() {
    return [...this.#rootDom.querySelectorAll('[js]')]
      .reduce((o, el) => (o[el.getAttribute('js')] = el, o), {});
  }

  connectedCallback() {
    if (!this.#domAttached) {
      this.appendChild(this.#rootDom);
      this.#rootDom = this;
      this.#domAttached = true;
    }
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