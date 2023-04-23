//************************************************************************************
// Auto generated code for <simple-address>
// Class: SimpleAddressElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'SimpleAddressElement';

//************************************************************************************
// Template string
const template = `<div class=next-to> <div> <div> <label>First Name: </label><br> <input autofocus js=el5> </div> <div> <label>Last Name: </label><br> <input js=el9> </div> <div> <label>Address: </label><br> <input js=el13> </div> <div> <label>City: </label><br> <input js=el17> </div> <div> <label>State: </label><br> <input js=el21> </div> <div> <label>Zip: </label><br> <input js=el25> </div> <div><button js=btn>Submit</button></div> </div> <div> <span js=el28></span> <span js=el29></span><br> <span js=el31></span><br> <span js=el33></span>, <span js=el34></span> <span js=el35></span> </div> </div>`;

//************************************************************************************
// Styles string
const styles = `.next-to{display:flex;flex-direction:row}.next-to > div{margin-right:20px}`;

//************************************************************************************
// Define class SimpleAddressElement for component <simple-address>
export class SimpleAddressElement extends EvoElement() {
  #els = {};
  #firstName;
  #lastName;
  #address;
  #city;
  #state;
  #zip;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['first-name', 'last-name', 'address', 'city', 'state', 'zip'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});

    // Initialize with default values
    this.firstName = 'Han';
    this.lastName = 'Solo';
    this.address = 'Docking Bay 94';
    this.city = 'Mos Eisley';
    this.state = 'Tatooine';
    this.zip = '12345';

    // Event handlers
    this.#els.el5.addEventListener('input', (evt)=>this.#firstName_onInputHandler(evt));
    this.#els.el9.addEventListener('input', (evt)=>this.#lastName_onInputHandler(evt));
    this.#els.el13.addEventListener('input', (evt)=>this.#address_onInputHandler(evt));
    this.#els.el17.addEventListener('input', (evt)=>this.#city_onInputHandler(evt));
    this.#els.el21.addEventListener('input', (evt)=>this.#state_onInputHandler(evt));
    this.#els.el25.addEventListener('input', (evt)=>this.#zip_onInputHandler(evt));
    this.#els.btn.addEventListener('click', (evt)=>this.#submit(evt));

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

  #firstName_onInputHandler(evt) {
    this.firstName = evt.target.value;
  }
  #lastName_onInputHandler(evt) {
    this.lastName = evt.target.value;
  }
  #address_onInputHandler(evt) {
    this.address = evt.target.value;
  }
  #city_onInputHandler(evt) {
    this.city = evt.target.value;
  }
  #state_onInputHandler(evt) {
    this.state = evt.target.value;
    this.#toUpper(evt);
  }
  #zip_onInputHandler(evt) {
    this.zip = evt.target.value;
  }

  //**********************************************************************************
  // Properties
  get firstName() {
    return this.#firstName;
  }
  set firstName(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#firstName) {
      const oldVal = this.#firstName;
      this.#firstName = newVal;
      this.#els.el5.value = newVal;
      this.#els.el28.textContent = newVal;
      this.#callUpdate('firstName', oldVal, newVal);
    }
  }

  get lastName() {
    return this.#lastName;
  }
  set lastName(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#lastName) {
      const oldVal = this.#lastName;
      this.#lastName = newVal;
      this.#els.el9.value = newVal;
      this.#els.el29.textContent = newVal;
      this.#callUpdate('lastName', oldVal, newVal);
    }
  }

  get address() {
    return this.#address;
  }
  set address(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#address) {
      const oldVal = this.#address;
      this.#address = newVal;
      this.#els.el13.value = newVal;
      this.#els.el31.textContent = newVal;
      this.#callUpdate('address', oldVal, newVal);
    }
  }

  get city() {
    return this.#city;
  }
  set city(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#city) {
      const oldVal = this.#city;
      this.#city = newVal;
      this.#els.el17.value = newVal;
      this.#els.el33.textContent = newVal;
      this.#callUpdate('city', oldVal, newVal);
    }
  }

  get state() {
    return this.#state;
  }
  set state(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#state) {
      const oldVal = this.#state;
      this.#state = newVal;
      this.#els.el21.value = newVal;
      this.#els.el34.textContent = newVal;
      this.#callUpdate('state', oldVal, newVal);
    }
  }

  get zip() {
    return this.#zip;
  }
  set zip(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#zip) {
      const oldVal = this.#zip;
      this.#zip = newVal;
      this.#els.el25.value = newVal;
      this.#els.el35.textContent = newVal;
      this.#callUpdate('zip', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  #submit(event) {
    console.log(this.value);
  }

  #toUpper(evt) {
    this.state = this.state.toUpperCase();
  }

  get value() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip
    }
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <simple-address>
customElements.define('simple-address', SimpleAddressElement);
