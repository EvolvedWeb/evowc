//************************************************************************************
// Auto generated code for <special-thing>
// Class: SpecialThingElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';

// Lookup table for lower case attributes to property names
const propLookup = {
  "num": 'num',
  "message": 'message',
  "show": 'show'
};

// Template string
const template = `<p class=thing js=el0></p> <p cond=show>You have <span js=el2></span> apples!</p> <button js=el3>Change</button>`;

// Styles string
const styles = `<style>.thing{background-color:#f0f8ff}</style>`;

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class SpecialThingElement extends DFElement {
  #els = {};
  #num;
  #message;
  #show;

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(template, styles, propLookup);

    // Get a reference to all of the relevant elements
    this.#getEls();
    this.num = 100;
    this.message = 'This \'is\' a test:';
    this.show = true;

  setupEventHandlers() {
    setTimeout(() => {
      this.#els.el3.addEventListener('click', (evt)=>this.#newNum(evt));
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
      this.#els.el3.addEventListener('click', (evt)=>this.#newNum(evt));
    }, 0);
  }

  // Properties
  get num() {
    return this.#num;
  }
  set num(value) {
    value = Math.floor(Number(value));
    if (value !== this.#num) {
      this.#num = value;
      this.#callUpdate();
      this.#els.el0.dataset.num = value;
      this.#els.el2.textContent = value;
    }
  }

  get message() {
    return this.#message;
  }
  set message(value) {
    value = ''+value;
    if (value !== this.#message) {
      this.#message = value;
      this.#callUpdate();
      this.#els.el0.innerHTML = value;
    }
  }

  get show() {
    return this.#show;
  }
  set show(value) {
    value = Boolean(value);
    if (value !== this.#show) {
      this.#show = value;
      this.#callUpdate();
      handleCondition(this.#els.el1, value );
      setAttr( this.#els.el0, 'show', value );
    }
  }


  //*******************************
  // Start of your code
  #newNum() {
    this.num = Math.abs(Math.random() * 100);
  }
  // End of your code
  //*******************************

}

customElements.define('special-thing', SpecialThingElement);
