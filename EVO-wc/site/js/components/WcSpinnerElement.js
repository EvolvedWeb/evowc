//************************************************************************************
// Auto generated code for <wc-spinner>
// Class: WcSpinnerElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'WcSpinnerElement';

//************************************************************************************
// Template string
const template = `<span js=spinner> <svg xmlns=http:&#x2F;&#x2F;www.w3.org&#x2F;2000&#x2F;svg width=16 height=16 viewbox="0 0 16 16"> <path d="M8.938 1.125L8.5 4c-.042.276-.3.466-.576.424C7.7 4.39 7.534 4.214 7.5 4l-.438-2.875c-.08-.518.277-1 .795-1.08.518-.08 1 .277 1.08.795.015.095.014.194 0 .285z"></path> <path d="M5.375 1.577l1.06 2.708c.1.26-.028.553-.288.655-.212.083-.445.014-.58-.154L3.75 2.516c-.327-.41-.26-1.007.15-1.334.408-.328 1.005-.26 1.332.148.06.076.108.162.143.247z" opacity=.91></path> <path d="M2.515 3.75l2.27 1.816c.22.175.254.493.08.71-.142.18-.38.235-.58.157l-2.708-1.06c-.488-.19-.728-.74-.538-1.227.19-.488.74-.73 1.228-.54.09.037.175.087.247.144z" opacity=.82></path> <path d="M1.124 7.062L4 7.5c.275.042.465.3.423.576-.034.224-.21.39-.424.424l-2.876.437c-.518.08-1-.277-1.08-.795-.08-.518.277-1 .795-1.08.094-.015.193-.013.284 0z" opacity=.73></path> <path d="M1.576 10.625l2.71-1.06c.26-.1.553.028.654.288.083.21.013.444-.155.58l-2.27 1.817c-.41.327-1.007.26-1.334-.148s-.26-1.006.15-1.333c.075-.062.16-.11.246-.145z" opacity=.64></path> <path d="M3.75 13.485l1.816-2.27c.175-.22.493-.254.71-.08.178.142.234.378.156.58l-1.06 2.707c-.19.488-.74.73-1.228.538-.488-.19-.73-.74-.538-1.23.036-.087.086-.172.144-.245z" opacity=.55></path> <path d="M7.062 14.875L7.5 12c.04-.276.3-.466.575-.424.224.035.39.212.424.424l.437 2.875c.08.518-.277 1-.795 1.08-.518.08-1-.277-1.08-.795-.015-.095-.014-.194 0-.285z" opacity=.45></path> <path d="M10.625 14.423l-1.06-2.708c-.1-.26.028-.553.288-.655.21-.083.444-.013.58.155l1.815 2.27c.327.41.26 1.007-.148 1.334-.41.326-1.006.26-1.333-.15-.06-.075-.108-.16-.142-.247z" opacity=.36></path> <path d="M13.484 12.25l-2.27-1.816c-.22-.174-.254-.493-.08-.71.142-.178.378-.234.58-.156l2.708 1.06c.488.19.73.74.538 1.228s-.74.73-1.23.538c-.088-.036-.173-.086-.246-.144z" opacity=.27></path> <path d="M14.875 8.938L12 8.5c-.276-.04-.466-.3-.424-.575.034-.224.21-.39.424-.424l2.875-.437c.518-.08 1 .277 1.08.794.08.518-.277 1-.794 1.08-.095.016-.194.015-.285 0z" opacity=.18></path> <path d="M14.423 5.375l-2.708 1.06c-.26.1-.553-.028-.655-.288-.083-.21-.013-.444.155-.58l2.27-1.816c.41-.326 1.006-.26 1.334.15.327.408.26 1.005-.15 1.332-.075.06-.162.11-.247.143z" opacity=.09></path> </svg> </span>`;

//************************************************************************************
// Styles string
const styles = `:host{height:fit-content;width:fit-content}:host, span, svg{display:inline-block}span{--wc-spinner-color:#000;--wc-spinner-size:64px;--wc-spinner-speed:1s;height:var(--wc-spinner-size);width:var(--wc-spinner-size)}svg{animation:spinnerRotate var(--wc-spinner-speed) steps(12, end) infinite;height:100%;width:100%}path{fill:var(--wc-spinner-color)}@keyframes spinnerRotate{0%{transform:rotateZ(0deg)}100%{transform:rotateZ(360deg)}}`;

//************************************************************************************
// Define class WcSpinnerElement for component <wc-spinner>
export class WcSpinnerElement extends EvoElement() {
  #els = {};
  #size;
  #color;
  #speed;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['size', 'color', 'speed'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});

    // Initialize with default values
    this.size ??= 64;
    this.color ??= '#000';
    this.speed ??= '1s';

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
  get size() {
    return this.#size;
  }
  set size(newVal) {
    newVal = parseInt(newVal, 10);
    if (newVal !== this.#size) {
      const oldVal = this.#size;
      this.#size = newVal;
      this.#callUpdate('size', oldVal, newVal);
    }
  }

  get color() {
    return this.#color;
  }
  set color(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#color) {
      const oldVal = this.#color;
      this.#color = newVal;
      this.#callUpdate('color', oldVal, newVal);
    }
  }

  get speed() {
    return this.#speed;
  }
  set speed(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#speed) {
      const oldVal = this.#speed;
      this.#speed = newVal;
      this.#callUpdate('speed', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  #prop(prop, val) {
    this.#els.spinner.style.setProperty(prop, val);
  }
  update(param, oldVal, newVal) {
    if (param === 'size' && newVal > 11 && newVal < 65) {
      this.#prop('--wc-spinner-size', `${newVal}px`);
    }
    if (param === 'color') {
      this.#prop('--wc-spinner-color', newVal);
    }
    if (param === 'speed') {
      this.#prop('--wc-spinner-speed', newVal);
    }
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-spinner>
customElements.define('wc-spinner', WcSpinnerElement);
