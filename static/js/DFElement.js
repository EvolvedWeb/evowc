export function setAttr(el, attr, value) {
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

export class DFElement extends HTMLElement {
  #propsLookup = {};
  isConnected = false;

  constructor(template, styles, propsLookup = {}) {
    super();
    this.isConnected = false;
    this.#propsLookup = propsLookup;
    this.attachShadow({ mode: "open" });

    // Styles must be put in the correct place if we are not using Shadow DOM
    const stylesEl = document.createElement('template');
    stylesEl.innerHTML = styles;
    this.shadowRoot.appendChild(stylesEl.content );

    // The Template must be added as a child after the constructor if we are not using Shadow DOM
    const templateEl = document.createElement('template');
    templateEl.innerHTML = template;
    this.shadowRoot.appendChild(templateEl.content);

    if (this.setupEventHandlers) {
      setTimeout(() => {
        this.setupEventHandlers();
      }, 2);
    }

    if(this.init) {
      // init needs to be called AFTER the parent constructor is finished.
      setTimeout(() => {
        this.init();
      }, 1);
    }
  }

  connectedCallback() {
    this.isConnected = true;
    this.update && this.update();
    this.connected && this.connected();
  }
  disconnectedCallback() {
    this.isConnected = false;
    this.disconnected && this.disconnected();
  }

  adoptedCallback() {
    console.log(`adoptedCallback ${this.constructor.name}(${this.id})`);
    this.adopted && this.adopted();
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    this.attrChanged && this.attrChanged(attr, oldVal, newVal);
    if (oldVal !== newVal) {
      const prop = this.#propsLookup[attr] || attr;
      this[prop] = newVal;
    }
  }
}