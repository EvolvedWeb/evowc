//************************************************************************************
// Auto generated code for <form-item>
// Class: FormItemElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';
import { dog } from 'something.js';

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
    this.label = '';
    this.value = '';
    this.type = '';

    // Event handlers
    this.#els.el1.addEventListener('input', (evt)=>this.#value_onInputHandler(evt));

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

  //**********************************************************************************
  // Start of your code
  ]]>
  // End of your code
  //**********************************************************************************
}

// Define the custom element <form-item>
customElements.define('form-item', FormItemElement);
