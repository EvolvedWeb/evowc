//************************************************************************************
// Auto generated code for <alert-message>
// Class: AlertMessageElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement, setAttr, handleCondition } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'AlertMessageElement';

//************************************************************************************
// Template string
const template = `<div class=frame js=el0> <span js=el1></span> <div class=title js=el2></div> <div class=message js=el3></div> </div>`;

//************************************************************************************
// Styles string
const styles = `:host{display:block;height:fit-content;margin:2px 0;vertical-align:middle;--alert-box-bgcolor:#EFE;--alert-box-bordercolor:#6D6}.frame[state=info]{--alert-box-bgcolor:#DDF;--alert-box-bordercolor:#66D}.frame[state=warn],.frame[state=warning]{--alert-box-bgcolor:#FFD;--alert-box-bordercolor:#DD6}.frame[state=alert], .frame[state=error]{--alert-box-bgcolor:#FDD;--alert-box-bordercolor:#D66}.frame{background-color:var(--alert-box-bgcolor, #FFF);border:1px solid var(--alert-box-bordercolor, #000);border-radius:5px;font:16px var(--alert-box-font, Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif);padding:10px 25px 10px 10px;position:relative}`;

//************************************************************************************
// Define class AlertMessageElement for component <alert-message>
export class AlertMessageElement extends EvoElement() {
  #els = {};
  #message;
  #title;
  #icon;
  #state;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['message', 'title', 'icon', 'state'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el1_c = document.createComment(' el1 ');

    // Initialize with default values
    this.message = '';
    this.title = '';
    this.icon = '';
    this.state = 'alert';
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
      this.#els.el3.innerHTML = newVal;
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
      this.#els.el2.innerHTML = newVal;
      handleCondition(this.#els.el2, newVal, this.#els.el2_c );
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
      setAttr( this.#els.el1, 'icon', newVal );
      handleCondition(this.#els.el1, newVal, this.#els.el1_c );
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
}

// Define the custom element <alert-message>
customElements.define('alert-message', AlertMessageElement);
