//************************************************************************************
// Auto generated code for <wc-dialog>
// Class: WcDialogElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement, setAttr, handleCondition } from '../EvoElement.js';
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
const template = `<dialog js=dialog> <header><span js=el1></span><button class=closeX js=el2></button></header> <section><slot></slot></section> <footer js=el5> <button autofocus is=wc-button js=el6></button> <button is=wc-button minor js=el7></button> </footer> </dialog>`;

//************************************************************************************
// Styles string
const styles = `dialog{border:1px solid #333;border-radius:10px;left:50%;margin:0;padding:0;position:fixed;top:50%;transform:translate(-50%, -50%)}dialog[open]{display:flex;filter:drop-shadow(6px 6px 6px #0006);flex-direction:column}dialog::backdrop{background-color:#0006}header{align-items:center;background-color:#dee6ff;background-image:linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));display:flex;font:18px Tahoma;height:fit-content;justify-content:space-between;padding:10px}section{flex:2 1 auto;padding:10px}footer{border-top:1px solid #666;font:18px Tahoma;height:fit-content;padding:10px}.closeX{background:transparent;border-radius:3px;border:1px solid #0001;display:inline-block;height:25px;margin:-10px -5px 0 10px;padding:0;position:relative;width:25px}.closeX::before{background-color:#000;content:'';display:inline-block;height:15px;left:11px;position:absolute;top:4px;transform:rotate(-45deg);width:1px}.closeX::after{background-color:#000;content:'';display:inline-block;height:15px;left:11px;position:absolute;top:4px;transform:rotate(45deg);width:1px}.closeX:hover{background:#FFF9}`;

//************************************************************************************
// Define class WcDialogElement for component <wc-dialog>
export class WcDialogElement extends EvoElement() {
  #els = {};
  #title;
  #minWidth;
  #minHeight;
  #showX;
  #_showFooter;
  #_okButtonText;
  #_cancelButtonText;
  #_resolve;
  #_dialogStyle;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['title', 'min-width', 'min-height', 'show-x'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el5_c = document.createComment(' el5 ');

    // Initialize with default values
    this.title = '';
    this.minWidth = 150;
    this.minHeight = 100;
    this.showX = true;
    this.#showFooter = true;
    this.#okButtonText = 'OK';
    this.#cancelButtonText = 'Cancel';
    this.#resolve = null;
    this.#dialogStyle = '';

    // Event handlers
    this.#els.dialog.addEventListener('cancel', (evt)=>this.#dialogCancel(evt));
    this.#els.el2.addEventListener('click', (evt)=>this.#clickClose(evt));
    this.#els.el6.addEventListener('click', (evt)=>this.#clickOk(evt));
    this.#els.el7.addEventListener('click', (evt)=>this.#clickCancel(evt));

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
    newVal = Boolean(newVal);
    if (newVal !== this.#showX) {
      const oldVal = this.#showX;
      this.#showX = newVal;
      handleCondition(this.#els.el2, newVal, this.#els.el2_c );
      this.#callUpdate('showX', oldVal, newVal);
    }
  }

  get #showFooter() {
    return this.#_showFooter;
  }
  set #showFooter(newVal) {
    newVal = Boolean(newVal);
    if (newVal !== this.#_showFooter) {
      const oldVal = this.#_showFooter;
      this.#_showFooter = newVal;
      handleCondition(this.#els.el5, newVal, this.#els.el5_c );
      this.#callUpdate('#showFooter', oldVal, newVal);
    }
  }

  get #okButtonText() {
    return this.#_okButtonText;
  }
  set #okButtonText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_okButtonText) {
      const oldVal = this.#_okButtonText;
      this.#_okButtonText = newVal;
      this.#els.el6.textContent = newVal;
      this.#callUpdate('#okButtonText', oldVal, newVal);
    }
  }

  get #cancelButtonText() {
    return this.#_cancelButtonText;
  }
  set #cancelButtonText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_cancelButtonText) {
      const oldVal = this.#_cancelButtonText;
      this.#_cancelButtonText = newVal;
      this.#els.el7.textContent = newVal;
      this.#callUpdate('#cancelButtonText', oldVal, newVal);
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
    this.#closeDialog(DIALOG_BUTTONS.ESCAPE);
  }

  update(field, oldVal, newVal) {
    console.log({ field, oldVal, newVal });
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

  #closeDialog(button, data) {
    this.#els.dialog.close();
    this.#resolve({ button, data });
  }

  #clickOk(event) {
    this.#closeDialog(DIALOG_BUTTONS.OK);
  }

  #clickClose(event) {
    this.#closeDialog(DIALOG_BUTTONS.CLOSE);
  }

  #clickCancel(event) {
    this.#closeDialog(DIALOG_BUTTONS.CANCEL);
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-dialog>
customElements.define('wc-dialog', WcDialogElement);
