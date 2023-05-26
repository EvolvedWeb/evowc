//************************************************************************************
// Auto generated code for <has-switch>
// Class: HasSwitchElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, cond, comment, ael } from '../EvoElement.js';
import "./WcButtonElement.js";

//************************************************************************************
// Name of this component
const componentName = 'HasSwitchElement';

//************************************************************************************
// Template string
const template = `<button is=wc-button data-val=0 js=el0>Zero</button> <button is=wc-button data-val=1 js=el1>One</button> <button is=wc-button data-val=2 js=el2>Two</button> <hr> <p js=el4>Hello world - This is ZERO</p> <div js=el5> <h1>This is number 1</h1> <div> <wc-calendar></wc-calendar> </div> </div> <div js=el9> <h2>Hello world 2</h2> <p>This is a second element inside a switch.</p> </div>`;

//************************************************************************************
// Define class HasSwitchElement for component <has-switch>
export class HasSwitchElement extends EvoElement() {
  #els = {};
  #dogFood;
  #catFood;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['dog-food', 'cat-food'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template});
    //Conditional Comment Elements
    this.#els.el4_c = comment(' el4 ', this.#els.el4);
    this.#els.el5_c = comment(' el5 ', this.#els.el5);
    this.#els.el9_c = comment(' el9 ', this.#els.el9);

    // Initialize with default values
    this.dogFood ??= 0;
    this.catFood ??= 0;

    // Event handlers
    ael(this.#els.el0, 'click', (evt)=>this.#setDogFood(evt, {...evt.target.dataset}));
    ael(this.#els.el1, 'click', (evt)=>this.#setDogFood(evt, {...evt.target.dataset}));
    ael(this.#els.el2, 'click', (evt)=>this.#setDogFood(evt, {...evt.target.dataset}));

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
  get dogFood() {
    return this.#dogFood;
  }
  set dogFood(newVal) {
    newVal = Number(newVal);
    if (newVal !== this.#dogFood) {
      const oldVal = this.#dogFood;
      this.#dogFood = newVal;
      cond(this.#els.el4, newVal === 0, this.#els.el4_c );
      cond(this.#els.el5, newVal === 1, this.#els.el5_c );
      cond(this.#els.el9, newVal === 2, this.#els.el9_c );
      setAttr( this, 'dog-food', newVal );
      this.#callUpdate('dogFood', oldVal, newVal);
    }
  }

  get catFood() {
    return this.#catFood;
  }
  set catFood(newVal) {
    newVal = Number(newVal);
    if (newVal !== this.#catFood) {
      const oldVal = this.#catFood;
      this.#catFood = newVal;
      setAttr( this, 'cat-food', newVal );
      this.#callUpdate('catFood', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  #setDogFood(event) {
    this.dogFood = event.target.dataset.val;
    this.catFood++;
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <has-switch>
customElements.define('has-switch', HasSwitchElement);
