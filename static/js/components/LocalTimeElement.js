//************************************************************************************
// Auto generated code for <local-time>
// Class: LocalTimeElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';

// Lookup table for lower case attributes to property names
const propLookup = {
  "dog": 'dog',
  "timestamp": 'timestamp',
  "locale": 'locale',
  "format": 'format',
  "#localetime": '#localetime',
  "#classes": '#classes'
};

// Template string
const template = `<span js=el0></span> <button data-locale=en js=el1>EN</button> <button data-locale=fr js=el2>FR</button> <button data-locale=ru js=el3>RU</button> <button data-locale=ja js=el4>JA</button>`;

// Styles string
const styles = `<style></style>`;

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class LocalTimeElement extends DFElement {
  #els = {};
  #dog;
  #timestamp;
  #locale;
  #format;
  #_localetime;
  #_classes;

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(template, styles, propLookup);

    // Get a reference to all of the relevant elements
    this.#getEls();
    this.dog = [1,2,3,4];
    this.timestamp = new Date('Dec 25 1990');
    this.locale = 'en-US';
    this.format = {weekday:'long',year:'numeric',month:'long',day:'numeric'};
    this.#localetime = '';
    this.#classes = '';

  setupEventHandlers() {
    setTimeout(() => {
      this.#els.el1.addEventListener('click', (evt)=>this.#setLocale(evt));
      this.#els.el2.addEventListener('click', (evt)=>this.#setLocale(evt));
      this.#els.el3.addEventListener('click', (evt)=>this.#setLocale(evt));
      this.#els.el4.addEventListener('click', (evt)=>this.#setLocale(evt));
    }, 0);
  }
  }

  #getEls() {
    this.#els = [...this.shadowRoot.querySelectorAll('[js]')]
      .reduce((o, el) => (o[el.getAttribute('js')] = el, o), {});
  }

  #callUpdate() {
    this.isConnected && this.update && this.update();
  }

  setupEventHandlers() {
    setTimeout(() => {
      this.#els.el1.addEventListener('click', (evt)=>this.#setLocale(evt));
      this.#els.el2.addEventListener('click', (evt)=>this.#setLocale(evt));
      this.#els.el3.addEventListener('click', (evt)=>this.#setLocale(evt));
      this.#els.el4.addEventListener('click', (evt)=>this.#setLocale(evt));
    }, 0);
  }

  // Properties
  get dog() {
    return this.#dog;
  }
  set dog(value) {
    value = (typeof value === 'string' ? JSON.parse(value) : value);
    if (value !== this.#dog) {
      this.#dog = value;
      this.#callUpdate();
    }
  }

  get timestamp() {
    return this.#timestamp;
  }
  set timestamp(value) {
    value = (typeof value === 'string' ? new Date(value) : value);
    if (value !== this.#timestamp) {
      this.#timestamp = value;
      this.#callUpdate();
    }
  }

  get locale() {
    return this.#locale;
  }
  set locale(value) {
    value = ''+value;
    if (value !== this.#locale) {
      this.#locale = value;
      this.#callUpdate();
      setAttr( this.#els.el0, 'style', value );
    }
  }

  get format() {
    return this.#format;
  }
  set format(value) {
    value = (typeof value === 'string' ? JSON.parse(value) : value);
    if (value !== this.#format) {
      this.#format = value;
      this.#callUpdate();
    }
  }

  get #localetime() {
    return this.#_localetime;
  }
  set #localetime(value) {
    value = ''+value;
    if (value !== this.#_localetime) {
      this.#_localetime = value;
      this.#callUpdate();
      this.#els.el0.textContent = value;
    }
  }

  get #classes() {
    return this.#_classes;
  }
  set #classes(value) {
    value = ''+value;
    if (value !== this.#_classes) {
      this.#_classes = value;
      this.#callUpdate();
      this.#els.el0.className = value;
    }
  }


  //*******************************
  // Start of your code
  update() {
    if (this.format != null && this.timestamp != null) {
      const format = this.format || { month: '2-digit', day: '2-digit', year: 'numeric' };
      const formatter = new Intl.DateTimeFormat(this.locale, format);
      const newStr = formatter.format(this.timestamp);
      if (this.#localetime !== newStr) {
        this.#localetime = newStr;
      }
    }
  }

  #setLocale(event) {
    this.locale = event.target.dataset.locale;
  }

  toString() {
    this.update();
    return this.#localetime;
  }
  // End of your code
  //*******************************

}

customElements.define('local-time', LocalTimeElement);
