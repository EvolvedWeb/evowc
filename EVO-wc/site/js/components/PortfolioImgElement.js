//************************************************************************************
// Auto generated code for <portfolio-img>
// Class: PortfolioImgElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, ael, boolFromVal } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'PortfolioImgElement';

//************************************************************************************
// Template string
const template = `<div class=text-block js=el0> <div class=title js=el1>stuff</div> <div class=text js=el2></div> <input js=el3> <p js=el4></p> <p js=el5></p> <button js=el6>Inc</button> <button js=el7>Dec</button> </div>`;

//************************************************************************************
// Styles string
const styles = `:host{background-color:#EEF;border:1px solid #99A;display:block;height:225px;overflow:hidden;width:400px}`;

//************************************************************************************
// Define class PortfolioImgElement for component <portfolio-img>
export class PortfolioImgElement extends EvoElement() {
  #els = {};
  #title;
  #text;
  #dogs;
  #_thing;
  #busy;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['title', 'text', 'dogs', 'busy'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});

    // Initialize with default values
    this.title ??= '';
    this.text ??= '';
    this.dogs ??= '';
    this.#thing ??= 0;
    this.busy ??= true;

    // Event handlers
    ael(this.#els.el3, 'input', (evt)=>this.#dogs_onInputHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el6, 'click', (evt)=>this.#inc(evt, {...evt.target.dataset}));
    ael(this.#els.el7, 'click', (evt)=>this.#dec(evt, {...evt.target.dataset}));

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

  #dogs_onInputHandler(evt) {
    this.dogs = evt.target.value;
    this.#logIt(evt, data);
  }

  //**********************************************************************************
  // Properties
  get title() {
    return this.#title;
  }
  set title(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#title) {
      const oldVal = this.#title;
      this.#title = newVal;
      this.#els.el1.innerHTML = newVal;
      setAttr( this, 'title', newVal );
      this.#callUpdate('title', oldVal, newVal);
    }
  }

  get text() {
    return this.#text;
  }
  set text(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#text) {
      const oldVal = this.#text;
      this.#text = newVal;
      setAttr( this.#els.el0, 'dog', newVal );
      setAttr( this.#els.el0, 'cat', this.#reverse(this.#toUpper(newVal)) );
      this.#els.el2.textContent = newVal;
      this.#callUpdate('text', oldVal, newVal);
    }
  }

  get dogs() {
    return this.#dogs;
  }
  set dogs(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#dogs) {
      const oldVal = this.#dogs;
      this.#dogs = newVal;
      this.#els.el3.value = newVal;
      this.#els.el4.textContent = newVal;
      this.#callUpdate('dogs', oldVal, newVal);
    }
  }

  get #thing() {
    return this.#_thing;
  }
  set #thing(newVal) {
    newVal = parseInt(newVal, 10);
    if (newVal !== this.#_thing) {
      const oldVal = this.#_thing;
      this.#_thing = newVal;
      setAttr( this.#els.el0, 'aa-bb-cc-dd', newVal );
      this.#els.el0.aaBbCcDd = newVal;
      this.#els.el3.dataset.tacoBell = newVal;
      this.#els.el5.textContent = newVal;
      this.#callUpdate('#thing', oldVal, newVal);
    }
  }

  get busy() {
    return this.#busy;
  }
  set busy(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#busy) {
      const oldVal = this.#busy;
      this.#busy = newVal;
      this.#els.el7.ariaBusy = newVal;
      this.#callUpdate('busy', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  init() {
    this.#thing = 10;
  }

  // Event Handlers
  #logIt(event) {
    console.log(event.target.value);
  }

  #inc(evt) {
    this.#thing++;
  }

  #dec(evt) {
    this.#thing--;
  }

  // Pipes
  #toUpper(value) {
    return value.toUpperCase();
  }

  #reverse(value) {
    return [...value].reverse().join('');
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <portfolio-img>
customElements.define('portfolio-img', PortfolioImgElement);
