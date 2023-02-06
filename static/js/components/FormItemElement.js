//************************************************************************************
// Auto generated code for <form-item>
// Class: FormItemElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';
import { dog } from 'something.js';

// Lookup table for lower case attributes to property names
const propLookup = {
  "label": 'label',
  "value": 'value',
  "type": 'type'
};

// Template string
const template = `<label for=field js=el0></label> <input id=field js=el1>`;

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class FormItemElement extends DFElement {
  #els = {};
  #label;
  #value;
  #type;

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(template, '', propLookup);

    // Get a reference to all of the relevant elements
    this.#getEls();
    this.label = '';
    this.value = '';
    this.type = '';
  }

  #getEls() {
    this.#els = [...this.shadowRoot.querySelectorAll('[js]')]
      .reduce((o, el) => (o[el.getAttribute('js')] = el, o), {});
  }

  #callUpdate() {
    this.isConnected && this.update && this.update();
  }

  // Properties
  get label() {
    return this.#label;
  }
  set label(value) {
    value = ''+value;
    if (value !== this.#label) {
      this.#label = value;
      this.#callUpdate();
      this.#els.el0.innerHTML = value;
    }
  }

  get value() {
    return this.#value;
  }
  set value(value) {
    value = ''+value;
    if (value !== this.#value) {
      this.#value = value;
      this.#callUpdate();
      this.#els.el1.value = value;
    }
  }

  get type() {
    return this.#type;
  }
  set type(value) {
    value = ''+value;
    if (value !== this.#type) {
      this.#type = value;
      this.#callUpdate();
      this.#els.el1.type = value;
    }
  }

}

customElements.define('form-item', FormItemElement);
