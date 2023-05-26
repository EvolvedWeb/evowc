//************************************************************************************
// Auto generated code for <wc-dialog>
// Class: WcDialogElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, cond, comment, ael, boolFromVal } from '../EvoElement.js';
import './WcButtonElement.js';

export const DIALOG_BUTTONS = {
  OK: 'OK',
  CANCEL: 'CANCEL',
  CLOSE: 'CLOSE',
  ESCAPE: 'ESCAPE'
};

//************************************************************************************
// Name of this component
const componentName = 'WcDialogElement';

//************************************************************************************
// Template string
const template = `<dialog js=dialog> <header><div js=el1></div><button class=closeX js=el2></button></header> <section><slot></slot></section> <footer js=el5> <button autofocus is=wc-button js=el6></button> <button is=wc-button minor js=el7></button> </footer> </dialog>`;

//************************************************************************************
// Styles string
const styles = `:host{--dialog-border:1px solid #333;--dialog-border-radius:10px;--dialog-header-bgcolor:#dee6ff;--dialog-header-font:18px Tahoma;--dialog-header-justify:start;display:inline-block;height:fit-content;width:fit-content}dialog{border:var(--dialog-border);border-radius:var(--dialog-border-radius);left:50%;margin:0;padding:0;position:fixed;top:50%;transform:translate(-50%, -50%)}dialog[open]{display:flex;filter:drop-shadow(6px 6px 6px #0006);flex-direction:column}dialog::backdrop{background-color:#0006}header{align-items:center;background-color:var(--dialog-header-bgcolor, #dee6ff);background-image:linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));display:flex;font:var(--dialog-header-font, 18px Tahoma);height:fit-content;justify-content:var(--dialog-header-justify);padding:10px;position:relative}section{flex:2 1 auto;padding:10px}footer{border-top:1px solid #666;font:18px Tahoma;height:fit-content;padding:10px}.closeX{background:transparent;border-radius:3px;border:1px solid #0001;display:inline-block;height:25px;margin:-10px -5px 0 10px;padding:0;position:absolute;right:20px;top:20px;width:25px}.closeX::before{background-color:#000;content:'';display:inline-block;height:15px;left:11px;position:absolute;top:4px;transform:rotate(-45deg);width:1px}.closeX::after{background-color:#000;content:'';display:inline-block;height:15px;left:11px;position:absolute;top:4px;transform:rotate(45deg);width:1px}.closeX:hover{background:#FFF9}`;

//************************************************************************************
// Define class WcDialogElement for component <wc-dialog>
export class WcDialogElement extends EvoElement() {
  #els = {};
  #allowEsc;
  #title;
  #minWidth;
  #minHeight;
  #showX;
  #showCancel;
  #showFooter;
  #okButtonText;
  #cancelButtonText;
  #_resolve;
  #_dialogStyle;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['allow-esc', 'title', 'min-width', 'min-height', 'show-x', 'show-cancel', 'show-footer', 'ok-button-text', 'cancel-button-text'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el2_c = comment(' el2 ', this.#els.el2);
    this.#els.el7_c = comment(' el7 ', this.#els.el7);
    this.#els.el5_c = comment(' el5 ', this.#els.el5);

    // Initialize with default values
    this.allowEsc ??= true;
    this.title ??= '';
    this.minWidth ??= 150;
    this.minHeight ??= 100;
    this.showX ??= true;
    this.showCancel ??= true;
    this.showFooter ??= true;
    this.okButtonText ??= 'OK';
    this.cancelButtonText ??= 'Cancel';
    this.#resolve ??= null;
    this.#dialogStyle ??= '';

    // Event handlers
    ael(this.#els.dialog, 'cancel', (evt)=>this.#dialogCancel(evt, {...evt.target.dataset}));
    ael(this.#els.el2, 'click', (evt)=>this.#clickClose(evt, {...evt.target.dataset}));
    ael(this.#els.el6, 'click', (evt)=>this.#clickOk(evt, {...evt.target.dataset}));
    ael(this.#els.el7, 'click', (evt)=>this.#clickCancel(evt, {...evt.target.dataset}));

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
  get allowEsc() {
    return this.#allowEsc;
  }
  set allowEsc(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#allowEsc) {
      const oldVal = this.#allowEsc;
      this.#allowEsc = newVal;
      this.#callUpdate('allowEsc', oldVal, newVal);
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
      this.#els.el1.innerHTML = newVal;
      this.#callUpdate('title', oldVal, newVal);
    }
  }

  get minWidth() {
    return this.#minWidth;
  }
  set minWidth(newVal) {
    newVal = parseInt(newVal, 10);
    if (newVal !== this.#minWidth) {
      const oldVal = this.#minWidth;
      this.#minWidth = newVal;
      this.#callUpdate('minWidth', oldVal, newVal);
    }
  }

  get minHeight() {
    return this.#minHeight;
  }
  set minHeight(newVal) {
    newVal = parseInt(newVal, 10);
    if (newVal !== this.#minHeight) {
      const oldVal = this.#minHeight;
      this.#minHeight = newVal;
      this.#callUpdate('minHeight', oldVal, newVal);
    }
  }

  get showX() {
    return this.#showX;
  }
  set showX(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#showX) {
      const oldVal = this.#showX;
      this.#showX = newVal;
      cond(this.#els.el2, newVal, this.#els.el2_c );
      this.#callUpdate('showX', oldVal, newVal);
    }
  }

  get showCancel() {
    return this.#showCancel;
  }
  set showCancel(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#showCancel) {
      const oldVal = this.#showCancel;
      this.#showCancel = newVal;
      cond(this.#els.el7, newVal, this.#els.el7_c );
      this.#callUpdate('showCancel', oldVal, newVal);
    }
  }

  get showFooter() {
    return this.#showFooter;
  }
  set showFooter(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#showFooter) {
      const oldVal = this.#showFooter;
      this.#showFooter = newVal;
      setAttr( this.#els.dialog, 'show-footer', newVal );
      cond(this.#els.el5, newVal, this.#els.el5_c );
      this.#callUpdate('showFooter', oldVal, newVal);
    }
  }

  get okButtonText() {
    return this.#okButtonText;
  }
  set okButtonText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#okButtonText) {
      const oldVal = this.#okButtonText;
      this.#okButtonText = newVal;
      this.#els.el6.textContent = newVal;
      this.#callUpdate('okButtonText', oldVal, newVal);
    }
  }

  get cancelButtonText() {
    return this.#cancelButtonText;
  }
  set cancelButtonText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#cancelButtonText) {
      const oldVal = this.#cancelButtonText;
      this.#cancelButtonText = newVal;
      this.#els.el7.textContent = newVal;
      this.#callUpdate('cancelButtonText', oldVal, newVal);
    }
  }

  get #resolve() {
    return this.#_resolve;
  }
  set #resolve(newVal) {
    if (newVal !== this.#_resolve) {
      const oldVal = this.#_resolve;
      this.#_resolve = newVal;
      this.#callUpdate('#resolve', oldVal, newVal);
    }
  }

  get #dialogStyle() {
    return this.#_dialogStyle;
  }
  set #dialogStyle(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_dialogStyle) {
      const oldVal = this.#_dialogStyle;
      this.#_dialogStyle = newVal;
      setAttr( this.#els.dialog, 'style', newVal );
      this.#callUpdate('#dialogStyle', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  #dialogCancel(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if(this.allowEsc) {
      this.closeDialog(DIALOG_BUTTONS.ESCAPE);
    }
  }

  open(data) {
    return new Promise((resolve, reject) => {
      if (this.#els.dialog.open) {
        return reject('ALREADY_OPEN');
      }
      this.#resolve = resolve;
      this.#dialogStyle = `min-height:${this.minHeight}px;min-width:${this.minWidth}px`;
      this.#els.dialog.showModal();
    });
  }

  closeDialog(button, data) {
    this.#els.dialog.close();
    this.#resolve({ button, data });
  }

  #clickOk(event) {
    this.closeDialog(DIALOG_BUTTONS.OK);
  }

  #clickClose(event) {
    this.closeDialog(DIALOG_BUTTONS.CLOSE);
  }

  #clickCancel(event) {
    this.closeDialog(DIALOG_BUTTONS.CANCEL);
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-dialog>
customElements.define('wc-dialog', WcDialogElement);
