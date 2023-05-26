//************************************************************************************
// Auto generated code for <alert-box>
// Class: AlertBoxElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, cond, comment, boolFromVal } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'AlertBoxElement';

//************************************************************************************
// Template string
const template = `<div class=frame js=el0> <button class=closer></button> <span js=el2></span> <div class=title js=el3></div> <div class=message js=el4></div> </div>`;

//************************************************************************************
// Styles string
const styles = `:host{display:block;height:fit-content;margin:2px 0;--alert-box-bgcolor:#EFE;--alert-box-bordercolor:#6D6}:host([popup]){display:inline-block;left:50%;position:fixed;top:50%;transform:translate(-50%, -50%)}.frame[state=info]{--alert-box-bgcolor:#DDF;--alert-box-bordercolor:#66D}.frame[state=warn],.frame[state=warning]{--alert-box-bgcolor:#FFD;--alert-box-bordercolor:#DD6}.frame[state=alert], .frame[state=error]{--alert-box-bgcolor:#FDD;--alert-box-bordercolor:#D66}.frame{background-color:var(--alert-box-bgcolor, #FFF);border:1px solid var(--alert-box-bordercolor, #000);border-radius:0;font:16px var(--alert-box-font, Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif);padding:10px 25px 10px 10px;position:relative}:host([popup]) .frame{border-radius:5px}.closer{display:none}:host([popup]) .closer{all:unset;border:1px solid transparent;border-radius:3px;display:inline-block;height:12px;position:absolute;right:3px;top:3px;width:12px}.closer:hover{background:#0001;border-color:var(--alert-box-bordercolor, #000);cursor:pointer}.closer::after, .closer::before{border-left:1px solid var(--alert-box-bordercolor, #000);content:'';display:inline-block;height:10px;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%) rotate(45deg);width:0}.closer::after{transform:translate(-50%, -50%) rotate(-45deg)}.closer:hover::after, .closer:hover::before{border-left-color:#0008}`;

//************************************************************************************
// Define class AlertBoxElement for component <alert-box>
export class AlertBoxElement extends EvoElement() {
  #els = {};
  #message;
  #title;
  #icon;
  #state;
  #popup;
  #disabled;
  #dogs;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['message', 'title', 'icon', 'state', 'popup', 'disabled', 'dogs'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el3_c = comment(' el3 ', this.#els.el3);
    this.#els.el2_c = comment(' el2 ', this.#els.el2);

    // Initialize with default values
    this.message ??= '';
    this.title ??= '';
    this.icon ??= '';
    this.state ??= 'alert';
    this.popup ??= false;
    this.disabled ??= false;
    this.dogs ??= [1,2,3,"a"];
  }

  //**********************************************************************************
  // This is called when any property is updated
  #callUpdate(field, oldVal, newVal) {
    this.isConnected && this.update && this.update(field, oldVal, newVal);
  }

  //**********************************************************************************
  // Properties
  get message() {
    return this.#message;
  }
  set message(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#message) {
      const oldVal = this.#message;
      this.#message = newVal;
      this.#els.el4.innerHTML = newVal;
      this.#callUpdate('message', oldVal, newVal);
    }
  }

  get title() {
    return this.#title;
  }
  set title(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#title) {
      const oldVal = this.#title;
      this.#title = newVal;
      this.#els.el3.innerHTML = newVal;
      cond(this.#els.el3, newVal, this.#els.el3_c );
      this.#callUpdate('title', oldVal, newVal);
    }
  }

  get icon() {
    return this.#icon;
  }
  set icon(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#icon) {
      const oldVal = this.#icon;
      this.#icon = newVal;
      setAttr( this.#els.el2, 'icon', newVal );
      cond(this.#els.el2, newVal, this.#els.el2_c );
      this.#callUpdate('icon', oldVal, newVal);
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
      setAttr( this.#els.el0, 'state', newVal );
      this.#callUpdate('state', oldVal, newVal);
    }
  }

  get popup() {
    return this.#popup;
  }
  set popup(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#popup) {
      const oldVal = this.#popup;
      this.#popup = newVal;
      setAttr( this.#els.el0, 'is-popup', newVal );
      this.#callUpdate('popup', oldVal, newVal);
    }
  }

  get disabled() {
    return this.#disabled;
  }
  set disabled(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#disabled) {
      const oldVal = this.#disabled;
      this.#disabled = newVal;
      this.#callUpdate('disabled', oldVal, newVal);
    }
  }

  get dogs() {
    return this.#dogs;
  }
  set dogs(newVal) {
    newVal = (typeof newVal === 'string' ? JSON.parse(newVal) : newVal);
    if (newVal !== this.#dogs) {
      const oldVal = this.#dogs;
      this.#dogs = newVal;
      this.#callUpdate('dogs', oldVal, newVal);
    }
  }
}

// Define the custom element <alert-box>
customElements.define('alert-box', AlertBoxElement);
