//************************************************************************************
// Auto generated code for <if-one>
// Class: IfOneElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement, handleCondition } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'IfOneElement';

//************************************************************************************
// Template string
const template = `<div>this.state is currently set to <span js=el1></span></div> <button js=el2>Toggle</button> <div class=red js=el3>TRUE - This shows if this.state is set to true. <p>Go watch a fun movie!</p> </div> <div class=blue js=el5>FALSE - If this.state is set to false then this shows. <p>Listen to an audio book.</p> </div>`;

//************************************************************************************
// Styles string
const styles = `.red{background-color:#F00;margin:20px;padding:20px}.blue{background-color:#00F;color:#FFF;margin:20px;padding:20px}`;

//************************************************************************************
// Define class IfOneElement for component <if-one>
export class IfOneElement extends EvoElement() {
  #els = {};
  #state;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el3_c = document.createComment(' el3 ');
    this.#els.el5_c = document.createComment(' el5 ');

    // Initialize with default values
    this.state = true;

    // Event handlers
    this.#els.el2.addEventListener('click', (evt)=>this.#toggleState(evt));

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
  get state() {
    return this.#state;
  }
  set state(newVal) {
    newVal = Boolean(newVal);
    if (newVal !== this.#state) {
      const oldVal = this.#state;
      this.#state = newVal;
      this.#els.el1.textContent = newVal;
      handleCondition(this.#els.el3, newVal, this.#els.el3_c );
      handleCondition(this.#els.el5, !newVal, this.#els.el5_c );
      this.#callUpdate('state', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  #toggleState(event) {
    this.state = !this.state;
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <if-one>
customElements.define('if-one', IfOneElement);
