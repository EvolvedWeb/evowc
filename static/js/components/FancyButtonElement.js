//************************************************************************************
// Auto generated code for <fancy-button>
// Class: FancyButtonElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class FancyButtonElement extends DFElement {
  #els = {};

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super('', '');

    // Get a reference to all of the relevant elements
    this.#getEls();
  }

  #getEls() {
    this.#els = [...this.shadowRoot.querySelectorAll('[js]')]
      .reduce((o, el) => (o[el.getAttribute('js')] = el, o), {});
  }

  #callUpdate() {
    this.isConnected && this.update && this.update();
  }

  // Properties


  //*******************************
  // Start of your code
  onClick(evt) {
    // Do fancy stuff
  }
  // End of your code
  //*******************************

}

customElements.define('fancy-button', FancyButtonElement);
