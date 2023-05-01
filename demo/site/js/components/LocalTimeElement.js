//************************************************************************************
// Auto generated code for <local-time>
// Class: LocalTimeElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement, setAttr } from '../EvoElement.js';
import "./WcButtonElement.js";

//************************************************************************************
// Name of this component
const componentName = 'LocalTimeElement';

//************************************************************************************
// Template string
const template = `<span js=el0></span> <button is=wc-button small data-locale=en js=el1>EN</button> <button is=wc-button small data-locale=fr js=el2>FR</button> <button is=wc-button small data-locale=ru js=el3>RU</button> <button is=wc-button small data-locale=ja js=el4>JA</button>`;

//************************************************************************************
// Define class LocalTimeElement for component <local-time>
export class LocalTimeElement extends EvoElement() {
  #els = {};
  #dog;
  #timestamp;
  #locale;
  #format;
  #_localetime;
  #_classes;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['dog', 'timestamp', 'locale', 'format'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,shadowMode: 'closed'});

    // Initialize with default values
    this.dog = [1,2,3,4];
    this.timestamp = null;
    this.locale = '';
    this.format = {weekday:'long',year:'numeric',month:'long',day:'numeric'};
    this.#localetime = '';
    this.#classes = '';

    // Event handlers
    this.#els.el1.addEventListener('click', (evt)=>this.#setLocale(evt));
    this.#els.el2.addEventListener('click', (evt)=>this.#setLocale(evt));
    this.#els.el3.addEventListener('click', (evt)=>this.#setLocale(evt));
    this.#els.el4.addEventListener('click', (evt)=>this.#setLocale(evt));

    // If your class has an init function then we call it.
    if(this.init) {
     this.init();
    }
  }

  //**********************************************************************************
  // This is called when any property is updated
  #callUpdate(field, oldVal, newVal) {
    this.isConnected && this.update && this.update(field, oldVal, newVal);
  }

  //**********************************************************************************
  // Properties
  get dog() {
    return this.#dog;
  }
  set dog(newVal) {
    newVal = (typeof newVal === 'string' ? JSON.parse(newVal) : newVal);
    if (newVal !== this.#dog) {
      const oldVal = this.#dog;
      this.#dog = newVal;
      this.#callUpdate('dog', oldVal, newVal);
    }
  }

  get timestamp() {
    return this.#timestamp;
  }
  set timestamp(newVal) {
    newVal = (typeof newVal === 'string' ? new Date(newVal) : newVal);
    if (newVal !== this.#timestamp) {
      const oldVal = this.#timestamp;
      this.#timestamp = newVal;
      this.#callUpdate('timestamp', oldVal, newVal);
    }
  }

  get locale() {
    return this.#locale;
  }
  set locale(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#locale) {
      const oldVal = this.#locale;
      this.#locale = newVal;
      setAttr( this.#els.el0, 'style', newVal );
      this.#callUpdate('locale', oldVal, newVal);
    }
  }

  get format() {
    return this.#format;
  }
  set format(newVal) {
    newVal = (typeof newVal === 'string' ? JSON.parse(newVal) : newVal);
    if (newVal !== this.#format) {
      const oldVal = this.#format;
      this.#format = newVal;
      this.#callUpdate('format', oldVal, newVal);
    }
  }

  get #localetime() {
    return this.#_localetime;
  }
  set #localetime(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_localetime) {
      const oldVal = this.#_localetime;
      this.#_localetime = newVal;
      this.#els.el0.textContent = newVal;
      this.#callUpdate('#localetime', oldVal, newVal);
    }
  }

  get #classes() {
    return this.#_classes;
  }
  set #classes(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_classes) {
      const oldVal = this.#_classes;
      this.#_classes = newVal;
      this.#els.el0.className = newVal;
      this.#callUpdate('#classes', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  update() {
    if (this.format != null && this.timestamp != null) {
      const locale = this.locale || document.documentElement.lang || navigator.language;
      const format = this.format || { month: '2-digit', day: '2-digit', year: 'numeric' };
      const formatter = new Intl.DateTimeFormat(locale, format);
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
  //**********************************************************************************
}

// Define the custom element <local-time>
customElements.define('local-time', LocalTimeElement);
