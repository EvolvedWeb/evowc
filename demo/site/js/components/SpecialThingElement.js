//************************************************************************************
// Auto generated code for <special-thing>
// Class: SpecialThingElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement, setAttr, handleCondition } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'SpecialThingElement';

//************************************************************************************
// Template string
const template = `<div class=thing js=el0></div> <number>0</number> <number>3</number> <p js=el3></p> <p js=el4>You have <span js=el5></span> apples!</p> <button js=el6>Change</button>`;

//************************************************************************************
// Styles string
const styles = `.thing > dog{background-color:aliceblue;padding:5px 0}`;

//************************************************************************************
// Define class SpecialThingElement for component <special-thing>
export class SpecialThingElement extends EvoElement() {
  #els = {};
  #today;
  #locale;
  #num;
  #message;
  #show;
  #_localeDate;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['today', 'locale', 'num', 'message', 'show'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el4_c = document.createComment(' el4 ');

    // Initialize with default values
    this.today = null;
    this.locale = 'en';
    this.num = 100;
    this.message = 'This \'is\' a test:';
    this.show = true;
    this.#localeDate = '';

    // Event handlers
    this.#els.el6.addEventListener('click', (evt)=>this.#newNum(evt));

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
  get today() {
    return this.#today;
  }
  set today(newVal) {
    newVal = (typeof newVal === 'string' ? new Date(newVal) : newVal);
    if (newVal !== this.#today) {
      const oldVal = this.#today;
      this.#today = newVal;
      this.#callUpdate('today', oldVal, newVal);
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
      this.#callUpdate('locale', oldVal, newVal);
    }
  }

  get num() {
    return this.#num;
  }
  set num(newVal) {
    newVal = parseInt(newVal, 10);
    if (newVal !== this.#num) {
      const oldVal = this.#num;
      this.#num = newVal;
      this.#els.el0.dataset.num = newVal;
      this.#els.el5.textContent = newVal;
      this.#callUpdate('num', oldVal, newVal);
    }
  }

  get message() {
    return this.#message;
  }
  set message(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#message) {
      const oldVal = this.#message;
      this.#message = newVal;
      setAttr( this.#els.el0, 'alt', newVal );
      this.#els.el0.innerHTML = newVal;
      this.#callUpdate('message', oldVal, newVal);
    }
  }

  get show() {
    return this.#show;
  }
  set show(newVal) {
    newVal = Boolean(newVal);
    if (newVal !== this.#show) {
      const oldVal = this.#show;
      this.#show = newVal;
      setAttr( this.#els.el0, 'show', newVal );
      handleCondition(this.#els.el4, newVal, this.#els.el4_c );
      this.#callUpdate('show', oldVal, newVal);
    }
  }

  get #localeDate() {
    return this.#_localeDate;
  }
  set #localeDate(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_localeDate) {
      const oldVal = this.#_localeDate;
      this.#_localeDate = newVal;
      this.#els.el3.textContent = newVal;
      this.#callUpdate('#localeDate', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  update() {
    const locale = this.locale || document.documentElement.lang || navigator.language;
    const format = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat(this.locale, format);
    this.#localeDate = formatter.format(this.timestamp);
    if (1 < 100) {
      console.log('wow')
    }
  }
  #newNum() {
    this.num = Math.abs(Math.random() * 100);
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <special-thing>
customElements.define('special-thing', SpecialThingElement);
