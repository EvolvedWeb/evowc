//************************************************************************************
// Auto generated code for <portfolio-img>
// Class: PortfolioImgElement
// Generated on: 02/06/2023
//************************************************************************************
import { DFElement, setAttr } from '../DFElement.js';

// Lookup table for lower case attributes to property names
const propLookup = {
  "title": 'title',
  "text": 'text',
  "dogs": 'dogs',
  "#thing": '#thing',
  "busy": 'busy'
};

// Template string
const template = `<div class=text-block js=el0> <div class=title js=el1>stuff</div> <div class=text js=el2></div> <input js=el3> <p js=el4></p> <p js=el5></p> <button js=el6>Inc</button> <button js=el7>Dec</button> </div>`;

// Styles string
const styles = `<style>:host{background-color:#eef;border:1px solid #99a;display:block;height:225px;overflow:hidden;width:400px}</style>`;

function handleCondition(el, condition) {
  console.log('---- handleCondition');
  console.log(el, condition);
  console.log('--------------------');
}

export class PortfolioImgElement extends DFElement {
  #els = {};
  #title;
  #text;
  #dogs;
  #_thing;
  #busy;

  static get observedAttributes() {
    return Object.keys(propLookup);
  }

  constructor() {
    super(template, styles, propLookup);

    // Get a reference to all of the relevant elements
    this.#getEls();
    this.title = '';
    this.text = '';
    this.dogs = '';
    this.#thing = 0;
    this.busy = true;

  setupEventHandlers() {
    setTimeout(() => {
      this.#els.el3.addEventListener('input', (evt)=>this.#dogs_onInputHandler(evt));
      this.#els.el6.addEventListener('click', (evt)=>this.#inc(evt));
      this.#els.el7.addEventListener('click', (evt)=>this.#dec(evt));
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
      this.#els.el3.addEventListener('input', (evt)=>this.#dogs_onInputHandler(evt));
      this.#els.el6.addEventListener('click', (evt)=>this.#inc(evt));
      this.#els.el7.addEventListener('click', (evt)=>this.#dec(evt));
    }, 0);
  }

  #dogs_onInputHandler(evt) {
    this.dogs = evt.target.value;
    this.#logIt(evt);
  }

  // Properties
  get title() {
    return this.#title;
  }
  set title(value) {
    value = ''+value;
    if (value !== this.#title) {
      this.#title = value;
      this.#callUpdate();
      this.#els.el1.innerHTML = value;
    }
  }

  get text() {
    return this.#text;
  }
  set text(value) {
    value = ''+value;
    if (value !== this.#text) {
      this.#text = value;
      this.#callUpdate();
      setAttr( this.#els.el0, 'dog', value );
      setAttr( this.#els.el0, 'cat', this.#reverse(this.#toUpper(value)) );
      this.#els.el2.textContent = value;
    }
  }

  get dogs() {
    return this.#dogs;
  }
  set dogs(value) {
    value = ''+value;
    if (value !== this.#dogs) {
      this.#dogs = value;
      this.#callUpdate();
      this.#els.el3.value = value;
      this.#els.el4.textContent = value;
    }
  }

  get #thing() {
    return this.#_thing;
  }
  set #thing(value) {
    value = Math.floor(Number(value));
    if (value !== this.#_thing) {
      this.#_thing = value;
      this.#callUpdate();
      setAttr( this.#els.el0, 'aa-bb-cc-dd', value );
      this.#els.el3.dataset.tacoBell = value;
      this.#els.el5.textContent = value;
    }
  }

  get busy() {
    return this.#busy;
  }
  set busy(value) {
    value = Boolean(value);
    if (value !== this.#busy) {
      this.#busy = value;
      this.#callUpdate();
      this.#els.el7.ariaBusy = value;
    }
  }


  //*******************************
  // Start of your code
  init() {
    this.#thing = 10;
  }

  #logIt(event) {
    console.log(event.target.value);
  }

  #toUpper(value) {
    return value.toUpperCase();
  }

  #reverse(value) {
    return [...value].reverse().join('');
  }

  #inc(evt) {
    this.#thing++;
  }

  #dec(evt) {
    this.#thing--;
  }
  // End of your code
  //*******************************

}

customElements.define('portfolio-img', PortfolioImgElement);
