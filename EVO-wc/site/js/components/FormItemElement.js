//************************************************************************************
// Auto generated code for <form-item>
// Class: FormItemElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, ael } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'FormItemElement';

//************************************************************************************
// Template string
const template = `<label for=field js=el0></label> <input id=field js=el1>`;

//************************************************************************************
// Define class FormItemElement for component <form-item>
export class FormItemElement extends EvoElement() {
  #els = {};
  #label;
  #value;
  #type;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['label', 'value', 'type'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template});

    // Initialize with default values
    this.label ??= '';
    this.value ??= '';
    this.type ??= '';

    // Event handlers
    ael(this.#els.el1, 'input', (evt)=>this.#value_onInputHandler(evt, {...evt.target.dataset}));
  }

  //**********************************************************************************
  // This is called when any property is updated
  #callUpdate(field, oldVal, newVal) {
    this.isConnected && this.update && this.update(field, oldVal, newVal);
  }

  #value_onInputHandler(evt) {
    this.value = evt.target.value;
  }

  //**********************************************************************************
  // Properties
  get label() {
    return this.#label;
  }
  set label(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#label) {
      const oldVal = this.#label;
      this.#label = newVal;
      this.#els.el0.innerHTML = newVal;
      this.#callUpdate('label', oldVal, newVal);
    }
  }

  get value() {
    return this.#value;
  }
  set value(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#value) {
      const oldVal = this.#value;
      this.#value = newVal;
      this.#els.el1.value = newVal;
      this.#callUpdate('value', oldVal, newVal);
    }
  }

  get type() {
    return this.#type;
  }
  set type(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#type) {
      const oldVal = this.#type;
      this.#type = newVal;
      this.#els.el1.type = newVal;
      this.#callUpdate('type', oldVal, newVal);
    }
  }
}

// Define the custom element <form-item>
customElements.define('form-item', FormItemElement);
