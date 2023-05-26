//************************************************************************************
// Auto generated code for <system-dialog>
// Class: SystemDialogElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, cond, comment, ael, boolFromVal } from '../EvoElement.js';
import { DIALOG_BUTTONS } from './WcDialogElement.js';
const sleep = (time) => new Promise((resolve) => setTimeout(() => {resolve()}, time));
window.alertwc = async (message, title) => {
  let dlg = document.createElement('system-dialog');
  document.body.appendChild(dlg);
  const data = {
    message,
    title: title ?? "Alert",
    showCancel: false,
    showInput: false
  };
  await dlg.open(data);
  dlg.remove();
  dlg = null;
}

window.promptwc = async (message, title) => {
  let dlg = document.createElement('system-dialog');
  document.body.appendChild(dlg);
  const data = {
    message,
    title: title ?? "Prompt",
    showCancel: true,
    showInput: true
  };
  const resp = await dlg.open(data);
  dlg.remove();
  dlg = null;
  return resp.data;
}

window.confirmwc = async (message, title) => {
  let dlg = document.createElement('system-dialog');
  document.body.appendChild(dlg);
  const data = {
    message,
    title: title ?? "Confirm",
    showCancel: true,
    showInput: false
  };
  const resp = await dlg.open(data);
  dlg.remove();
  dlg = null;
  return resp.button === DIALOG_BUTTONS.OK;
}

//************************************************************************************
// Name of this component
const componentName = 'SystemDialogElement';

//************************************************************************************
// Template string
const template = `<wc-dialog show-x=false allow-esc=false js=dialog> <div js=el0></div> <textarea autofocus js=el1></textarea> </wc-dialog>`;

//************************************************************************************
// Styles string
const styles = `:host{--system-dialog-z:999999;--system-dialog-min-width:400px;height:0;margin:0;padding:0;width:0;z-index:var(--system-dialog-z)}div{min-width:var(--system-dialog-min-width);padding:12px 0}textarea{box-sizing:border-box;font:inherit;height:6em;padding:4px;resize:none;width:100%}`;

//************************************************************************************
// Define class SystemDialogElement for component <system-dialog>
export class SystemDialogElement extends EvoElement() {
  #els = {};
  #_message;
  #_title;
  #_showInput;
  #_showCancel;
  #_answer;

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el1_c = comment(' el1 ', this.#els.el1);

    // Initialize with default values
    this.#message ??= '';
    this.#title ??= '';
    this.#showInput ??= true;
    this.#showCancel ??= true;
    this.#answer ??= '';

    // Event handlers
    ael(this.#els.el1, 'input', (evt)=>this.#_answer_onInputHandler(evt, {...evt.target.dataset}));

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

  #_answer_onInputHandler(evt) {
    this.#answer = evt.target.value;
  }

  //**********************************************************************************
  // Properties
  get #message() {
    return this.#_message;
  }
  set #message(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_message) {
      const oldVal = this.#_message;
      this.#_message = newVal;
      this.#els.el0.innerHTML = newVal;
      this.#callUpdate('#message', oldVal, newVal);
    }
  }

  get #title() {
    return this.#_title;
  }
  set #title(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_title) {
      const oldVal = this.#_title;
      this.#_title = newVal;
      this.#els.dialog.title = newVal;
      this.#callUpdate('#title', oldVal, newVal);
    }
  }

  get #showInput() {
    return this.#_showInput;
  }
  set #showInput(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#_showInput) {
      const oldVal = this.#_showInput;
      this.#_showInput = newVal;
      cond(this.#els.el1, newVal, this.#els.el1_c );
      this.#callUpdate('#showInput', oldVal, newVal);
    }
  }

  get #showCancel() {
    return this.#_showCancel;
  }
  set #showCancel(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#_showCancel) {
      const oldVal = this.#_showCancel;
      this.#_showCancel = newVal;
      this.#els.dialog.showCancel = newVal;
      this.#callUpdate('#showCancel', oldVal, newVal);
    }
  }

  get #answer() {
    return this.#_answer;
  }
  set #answer(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_answer) {
      const oldVal = this.#_answer;
      this.#_answer = newVal;
      this.#els.el1.value = newVal;
      this.#callUpdate('#answer', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  open({ message, title, showCancel, showInput } = {}) {
    this.#message = message;
    this.#title = title;
    this.#showCancel = showCancel;
    this.#showInput = showInput
    return this.#els.dialog.open().then(resp => {
      resp.data = resp.button === DIALOG_BUTTONS.OK ? this.#answer : false;
      return resp;
    });
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <system-dialog>
customElements.define('system-dialog', SystemDialogElement);
