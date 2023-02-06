//************************************************************************************
// Auto generated code for <some-face>
// Class: SomeFaceElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';

// Lookup table for lower case attributes to property names
const propLookup = {
  "state": 'state'
};

// Template string
const template = `<span js=el0> <span eye=left></span> <span eye=right></span> <span mouth></span> </span> <button data-locale=happy js=el4>Happy</button> <button data-locale=sad js=el5>Sad</button>`;

// Styles string
const styles = `<style>span[face]{background-color:#ff6;border:1px solid #990;border-radius:50%;display:inline-block;height:100px;margin:10px;position:relative;width:100px}span[eye]{background-color:#000;border-radius:50%;display:block;height:10px;position:absolute;top:30px;width:10px}span[eye=left]{left:27px}span[eye=right]{right:27px}span[mouth]{border-bottom:3px solid #000;border-radius:50%;bottom:15px;height:60px;left:20px;position:absolute;top:unset;width:60px}span[face=sad] span[mouth]{border:unset;border-top:3px solid #000;bottom:unset;top:50%}</style>`;

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class SomeFaceElement extends DFElement {
  #els = {};
  #state;

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(template, styles, propLookup);

    // Get a reference to all of the relevant elements
    this.#getEls();
    this.state = 'sad';

  setupEventHandlers() {
    setTimeout(() => {
      this.#els.el4.addEventListener('click', (evt)=>this.#setState(evt));
      this.#els.el5.addEventListener('click', (evt)=>this.#setState(evt));
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
      this.#els.el4.addEventListener('click', (evt)=>this.#setState(evt));
      this.#els.el5.addEventListener('click', (evt)=>this.#setState(evt));
    }, 0);
  }

  // Properties
  get state() {
    return this.#state;
  }
  set state(value) {
    value = ''+value;
    if (value !== this.#state) {
      this.#state = value;
      this.#callUpdate();
      setAttr( this.#els.el0, 'face', value );
    }
  }


  //*******************************
  // Start of your code
  #setState(event) {
    this.state = event.target.dataset.locale;
  }
  // End of your code
  //*******************************

}

customElements.define('some-face', SomeFaceElement);
