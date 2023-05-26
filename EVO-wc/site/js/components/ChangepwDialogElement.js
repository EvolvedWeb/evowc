//************************************************************************************
// Auto generated code for <changepw-dialog>
// Class: ChangepwDialogElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, cond, comment, ael, boolFromVal } from '../EvoElement.js';
import { DIALOG_BUTTONS } from './WcDialogElement.js';
import './WcSpinnerElement.js';

const STATE_HIDE = 'hide';
const STATE_SHOW = 'show';

//************************************************************************************
// Name of this component
const componentName = 'ChangepwDialogElement';

//************************************************************************************
// Template string
const template = `<wc-dialog title="Change Password" show-footer=false js=dialog> <section> <form js=el1> <input type=hidden name=token js=el2> <div class=error-message js=el3></div> <div> <div class=prev-password-block> <label for=prev-password>Current Password:</label> </div> <input id=prev-password name=prev-password maxlength=32 required autofocus autocomplete=current-password aria-label=Password js=el7> <button class=show-pw type=button is=wc-button small variant=link js=el8></button> </div> <div> <div class=password-block> <label for=password>New Password:</label> </div> <input id=newpassword name=newpassword maxlength=32 required autocomplete=new-password aria-label=Password js=el12> <button class=show-pw type=button is=wc-button small variant=link js=el13></button> </div> <button class=change-pw is=wc-button large aria-label="Change Password">Change Password</button> </form> </section> <div class=spinner-holder js=el15> <wc-spinner></wc-spinner> </div> </wc-dialog>`;

//************************************************************************************
// Styles string
const styles = `:host{--login-dialog-text-color:#334;--login-dialog-link-color:#33A;--login-dialog-font-size:18px;color:var(--login-dialog-text-color);font-size:var(--login-dialog-font-size);height:0;margin:0;padding:0;width:0}:host([size=small]){--login-dialog-font-size:14px}:host([size=large]){--login-dialog-font-size:24px}label, input, button{font:1em Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif}wc-dialog{--dialog-border:none;--dialog-border-radius:5px;--dialog-header-bgcolor:#fff;--dialog-header-font:bold 1.6em Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif;--dialog-header-justify:center;position:relative}section{margin:0;padding:8px;width:20em}form{margin:0;padding:0}input[type=text], input[type=email], input[type=password]{border-width:1px;box-sizing:border-box;display:block;margin:4px 0;padding:10px 8px;width:100%}div{position:relative}button.change-pw{margin-top:16px;width:100%}button.show-pw{color:var(--login-dialog-link-color);position:absolute;bottom:13px;right:7px}.password-block{align-items:baseline;display:flex;justify-content:space-between;margin-top:12px}.error-message{background-color:#F99;border:1px solid #E66;margin-bottom:12px;padding:6px;text-align:center}a{color:var(--login-dialog-link-color);text-decoration:none}a:hover{text-decoration:underline}.spinner-holder{align-items:center;background-color:#3335;display:flex;justify-content:center;position:absolute;top:0;left:0;right:0;bottom:0}`;

//************************************************************************************
// Define class ChangepwDialogElement for component <changepw-dialog>
export class ChangepwDialogElement extends EvoElement() {
  #els = {};
  #changePwHref;
  #changePwMethod;
  #busy;
  #errorMessage;
  #_username;
  #_currentPassword;
  #_newPassword;
  #_token;
  #_passwordType1;
  #_passwordType2;
  #_toggleState1;
  #_toggleState2;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['change-pw-href', 'change-pw-method', 'busy', 'error-message'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el15_c = comment(' el15 ', this.#els.el15);
    this.#els.el3_c = comment(' el3 ', this.#els.el3);

    // Initialize with default values
    this.changePwHref ??= '';
    this.changePwMethod ??= 'post';
    this.busy ??= false;
    this.errorMessage ??= '';
    this.#username ??= '';
    this.#currentPassword ??= '';
    this.#newPassword ??= '';
    this.#token ??= '';
    this.#passwordType1 ??= 'password';
    this.#passwordType2 ??= 'password';
    this.#toggleState1 ??= STATE_SHOW;
    this.#toggleState2 ??= STATE_SHOW;

    // Event handlers
    ael(this.#els.el2, 'input', (evt)=>this.#_token_onInputHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el7, 'input', (evt)=>this.#_currentPassword_onInputHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el12, 'input', (evt)=>this.#_newPassword_onInputHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el1, 'submit', (evt)=>this.#changePw(evt, {...evt.target.dataset}));
    ael(this.#els.el3, 'click', (evt)=>this.#clearError(evt, {...evt.target.dataset}));
    ael(this.#els.el8, 'click', (evt)=>this.#toggle1(evt, {...evt.target.dataset}));
    ael(this.#els.el13, 'click', (evt)=>this.#toggle2(evt, {...evt.target.dataset}));

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

  #_token_onInputHandler(evt) {
    this.#token = evt.target.value;
  }
  #_currentPassword_onInputHandler(evt) {
    this.#currentPassword = evt.target.value;
    this.#clearError(evt, data);
  }
  #_newPassword_onInputHandler(evt) {
    this.#newPassword = evt.target.value;
    this.#clearError(evt, data);
  }

  //**********************************************************************************
  // Properties
  get changePwHref() {
    return this.#changePwHref;
  }
  set changePwHref(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#changePwHref) {
      const oldVal = this.#changePwHref;
      this.#changePwHref = newVal;
      this.#els.el1.action = newVal;
      this.#callUpdate('changePwHref', oldVal, newVal);
    }
  }

  get changePwMethod() {
    return this.#changePwMethod;
  }
  set changePwMethod(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#changePwMethod) {
      const oldVal = this.#changePwMethod;
      this.#changePwMethod = newVal;
      this.#els.el1.method = this.#toLower(newVal);
      this.#callUpdate('changePwMethod', oldVal, newVal);
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
      cond(this.#els.el15, newVal, this.#els.el15_c );
      this.#callUpdate('busy', oldVal, newVal);
    }
  }

  get errorMessage() {
    return this.#errorMessage;
  }
  set errorMessage(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#errorMessage) {
      const oldVal = this.#errorMessage;
      this.#errorMessage = newVal;
      this.#els.el3.textContent = newVal;
      cond(this.#els.el3, newVal, this.#els.el3_c );
      this.#callUpdate('errorMessage', oldVal, newVal);
    }
  }

  get #username() {
    return this.#_username;
  }
  set #username(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_username) {
      const oldVal = this.#_username;
      this.#_username = newVal;
      this.#callUpdate('#username', oldVal, newVal);
    }
  }

  get #currentPassword() {
    return this.#_currentPassword;
  }
  set #currentPassword(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_currentPassword) {
      const oldVal = this.#_currentPassword;
      this.#_currentPassword = newVal;
      this.#els.el7.value = newVal;
      this.#callUpdate('#currentPassword', oldVal, newVal);
    }
  }

  get #newPassword() {
    return this.#_newPassword;
  }
  set #newPassword(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_newPassword) {
      const oldVal = this.#_newPassword;
      this.#_newPassword = newVal;
      this.#els.el12.value = newVal;
      this.#callUpdate('#newPassword', oldVal, newVal);
    }
  }

  get #token() {
    return this.#_token;
  }
  set #token(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_token) {
      const oldVal = this.#_token;
      this.#_token = newVal;
      this.#els.el2.value = newVal;
      this.#callUpdate('#token', oldVal, newVal);
    }
  }

  get #passwordType1() {
    return this.#_passwordType1;
  }
  set #passwordType1(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_passwordType1) {
      const oldVal = this.#_passwordType1;
      this.#_passwordType1 = newVal;
      this.#els.el7.type = newVal;
      this.#callUpdate('#passwordType1', oldVal, newVal);
    }
  }

  get #passwordType2() {
    return this.#_passwordType2;
  }
  set #passwordType2(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_passwordType2) {
      const oldVal = this.#_passwordType2;
      this.#_passwordType2 = newVal;
      this.#els.el12.type = newVal;
      this.#callUpdate('#passwordType2', oldVal, newVal);
    }
  }

  get #toggleState1() {
    return this.#_toggleState1;
  }
  set #toggleState1(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_toggleState1) {
      const oldVal = this.#_toggleState1;
      this.#_toggleState1 = newVal;
      setAttr( this.#els.el8, 'aria-label', newVal );
      this.#els.el8.textContent = newVal;
      this.#callUpdate('#toggleState1', oldVal, newVal);
    }
  }

  get #toggleState2() {
    return this.#_toggleState2;
  }
  set #toggleState2(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_toggleState2) {
      const oldVal = this.#_toggleState2;
      this.#_toggleState2 = newVal;
      setAttr( this.#els.el13, 'aria-label', newVal );
      this.#els.el13.textContent = newVal;
      this.#callUpdate('#toggleState2', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  open() {
    this.#username = '';
    this.#currentPassword = '';
    this.#newPassword = '';
    this.busy = false;
    setTimeout(() => {
      this.#getToken();
    }, 1);
    return this.#els.dialog.open();
  }
  #toLower(str) {
    return str.toLowerCase();
  }
  //******************************************
  // Events
  #toggle1(event) {
    if (this.#toggleState1 === STATE_HIDE) {
      this.#toggleState1 = STATE_SHOW;
      this.#passwordType1 = 'password';
    }
    else {
      this.#toggleState1 = STATE_HIDE;
      this.#passwordType1 = 'text';
    }
  }
  #toggle2(event) {
    if (this.#toggleState2 === STATE_HIDE) {
      this.#toggleState2 = STATE_SHOW;
      this.#passwordType2 = 'password';
    }
    else {
      this.#toggleState2 = STATE_HIDE;
      this.#passwordType2 = 'text';
    }
  }
  #clearError() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
  #dispatch(name, { detail = null, bubbles = false, cancelable = true, composed = false } = {}) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new TypeError('name must be defined');
    }

    const event = new CustomEvent(name, { detail, bubbles, cancelable, composed });
    this.dispatchEvent(event);
    return event;
  }
  #getToken() {
    const getTokenEvent = this.#dispatch('gettoken', {
      detail: { token: '' },
      cancelable: false
    });
    this.#token = '' + getTokenEvent.detail.token || '';
  }
  #changePw(event) {
    if (this.#currentPassword == this.#newPassword) {
      event.preventDefault();
      this.errorMessage = `'Current Password' and 'New Password' must be different.`;
      return;
    }
    const data  = {
      currentPassword: this.#currentPassword,
      newPassword: this.#newPassword
    };
    if(this.#token) {
      data.token = this.#token;
    }

    const changePwEvent = this.#dispatch('changepw', {detail: data});
    if (changePwEvent.defaultPrevented) {
      event.preventDefault();
      return;
    }

    if (!this.changePwHref) {
      this.#els.dialog.closeDialog(DIALOG_BUTTONS.OK, data);
      event.preventDefault();
      return;
    }
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <changepw-dialog>
customElements.define('changepw-dialog', ChangepwDialogElement);
