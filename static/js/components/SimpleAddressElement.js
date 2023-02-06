//************************************************************************************
// Auto generated code for <simple-address>
// Class: SimpleAddressElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';

// Lookup table for lower case attributes to property names
const propLookup = {
  "firstname": 'firstName',
  "lastname": 'lastName',
  "address": 'address',
  "city": 'city',
  "state": 'state',
  "zip": 'zip'
};

// Template string
const template = `<div class=next-to> <div> <div> <label>First Name: </label><br> <input autofocus js=el5> </div> <div> <label>Last Name: </label><br> <input js=el9> </div> <div> <label>Address: </label><br> <input js=el13> </div> <div> <label>City: </label><br> <input js=el17> </div> <div> <label>State: </label><br> <input js=el21> </div> <div> <label>Zip: </label><br> <input js=el25> </div> <div><button js=btn>Submit</button></div> </div> <div> <span js=el28></span> <span js=el29></span><br> <span js=el31></span><br> <span js=el33></span>. <span js=el34></span> <span js=el35></span> </div> </div>`;

// Styles string
const styles = `<style>.next-to{display:flex;flex-direction:row}.next-to>div{margin-right:20px}</style>`;

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class SimpleAddressElement extends DFElement {
  #els = {};
  #firstName;
  #lastName;
  #address;
  #city;
  #state;
  #zip;

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(template, styles, propLookup);

    // Get a reference to all of the relevant elements
    this.#getEls();
    this.firstName = 'Michael';
    this.lastName = 'Collins';
    this.address = '561 S 1020 W';
    this.city = 'Orem';
    this.state = 'UT';
    this.zip = '84058';

  setupEventHandlers() {
    setTimeout(() => {
      this.#els.el5.addEventListener('input', (evt)=>this.#firstName_onInputHandler(evt));
      this.#els.el9.addEventListener('input', (evt)=>this.#lastName_onInputHandler(evt));
      this.#els.el13.addEventListener('input', (evt)=>this.#address_onInputHandler(evt));
      this.#els.el17.addEventListener('input', (evt)=>this.#city_onInputHandler(evt));
      this.#els.el21.addEventListener('input', (evt)=>this.#state_onInputHandler(evt));
      this.#els.el25.addEventListener('input', (evt)=>this.#zip_onInputHandler(evt));
      this.#els.btn.addEventListener('click', (evt)=>this.#submit(evt));
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
      this.#els.el5.addEventListener('input', (evt)=>this.#firstName_onInputHandler(evt));
      this.#els.el9.addEventListener('input', (evt)=>this.#lastName_onInputHandler(evt));
      this.#els.el13.addEventListener('input', (evt)=>this.#address_onInputHandler(evt));
      this.#els.el17.addEventListener('input', (evt)=>this.#city_onInputHandler(evt));
      this.#els.el21.addEventListener('input', (evt)=>this.#state_onInputHandler(evt));
      this.#els.el25.addEventListener('input', (evt)=>this.#zip_onInputHandler(evt));
      this.#els.btn.addEventListener('click', (evt)=>this.#submit(evt));
    }, 0);
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

  // Properties
  get firstName() {
    return this.#firstName;
  }
  set firstName(value) {
    value = ''+value;
    if (value !== this.#firstName) {
      this.#firstName = value;
      this.#callUpdate();
      this.#els.el5.value = value;
      this.#els.el28.textContent = value;
    }
  }

  get lastName() {
    return this.#lastName;
  }
  set lastName(value) {
    value = ''+value;
    if (value !== this.#lastName) {
      this.#lastName = value;
      this.#callUpdate();
      this.#els.el9.value = value;
      this.#els.el29.textContent = value;
    }
  }

  get address() {
    return this.#address;
  }
  set address(value) {
    value = ''+value;
    if (value !== this.#address) {
      this.#address = value;
      this.#callUpdate();
      this.#els.el13.value = value;
      this.#els.el31.textContent = value;
    }
  }

  get city() {
    return this.#city;
  }
  set city(value) {
    value = ''+value;
    if (value !== this.#city) {
      this.#city = value;
      this.#callUpdate();
      this.#els.el17.value = value;
      this.#els.el33.textContent = value;
    }
  }

  get state() {
    return this.#state;
  }
  set state(value) {
    value = ''+value;
    if (value !== this.#state) {
      this.#state = value;
      this.#callUpdate();
      this.#els.el21.value = value;
      this.#els.el34.textContent = value;
    }
  }

  get zip() {
    return this.#zip;
  }
  set zip(value) {
    value = ''+value;
    if (value !== this.#zip) {
      this.#zip = value;
      this.#callUpdate();
      this.#els.el25.value = value;
      this.#els.el35.textContent = value;
    }
  }


  //*******************************
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
  //*******************************

}

customElements.define('simple-address', SimpleAddressElement);
