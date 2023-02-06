//************************************************************************************
// Auto generated code for <if-one>
// Class: IfOneElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';

// Lookup table for lower case attributes to property names
const propLookup = {
  "state": 'state'
};

// Template string
const template = `<div cond=!state>TRUE</div> <div cond=state>FALSE</div> <button js=el2>Toggle</button>`;

// Styles string
const styles = `<style>div{background-color:red;margin:20px;padding:20px}</style>`;

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class IfOneElement extends DFElement {
  #els = {};
  #state;

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(template, styles, propLookup);

    // Get a reference to all of the relevant elements
    this.#getEls();
    this.state = true;

  setupEventHandlers() {
    setTimeout(() => {
      this.#els.el2.addEventListener('click', (evt)=>this.#toggleState(evt));
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
      this.#els.el2.addEventListener('click', (evt)=>this.#toggleState(evt));
    }, 0);
  }

  // Properties
  get state() {
    return this.#state;
  }
  set state(value) {
    value = Boolean(value);
    if (value !== this.#state) {
      this.#state = value;
      this.#callUpdate();
      handleCondition(this.#els.el0, !value );
      handleCondition(this.#els.el1, value );
    }
  }


  //*******************************
  // Start of your code
  #toggleState(event) {
    this.state = !this.state;
  }
  // End of your code
  //*******************************

}

customElements.define('if-one', IfOneElement);
