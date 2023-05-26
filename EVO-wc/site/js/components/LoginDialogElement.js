//************************************************************************************
// Auto generated code for <login-dialog>
// Class: LoginDialogElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, cond, comment, ael, boolFromVal } from '../EvoElement.js';
import { DIALOG_BUTTONS } from './WcDialogElement.js';
import './WcSpinnerElement.js';

//************************************************************************************
// Name of this component
const componentName = 'LoginDialogElement';

//************************************************************************************
// Template string
const template = `<wc-dialog show-footer=false js=dialog> <section> <form js=el1> <input type=hidden name=token js=el2> <div class=error-message js=el3></div> <div> <label for=username js=el5></label> <input id=username name=username type=email required autocomplete=username autofocus aria-label=Username js=el6> </div> <div> <div class=password-block> <label for=password js=el9></label> <a class=forgot-pw js=el10></a> </div> <input id=password name=password maxlength=32 required autocomplete=current-password aria-label=Password js=el11> <button class=show-pw type=button is=wc-button small variant=link js=el12></button> </div> <div class=remember-me js=el13> <label><input type=checkbox value=1 js=el15> <span js=el16></span></label> </div> <button class=sign-in is=wc-button large js=el17></button> </form> <div class=sign-up js=el18><span js=el19></span> <a js=el20></a></div> </section> <div class=spinner-holder js=el21> <wc-spinner></wc-spinner> </div> </wc-dialog>`;

//************************************************************************************
// Styles string
const styles = `:host{--login-dialog-text-color:#334;--login-dialog-link-color:#33A;--login-dialog-font-size:18px;color:var(--login-dialog-text-color);font-size:var(--login-dialog-font-size);height:0;margin:0;padding:0;width:0}:host([size=small]){--login-dialog-font-size:14px}:host([size=large]){--login-dialog-font-size:24px}label, input, button{font:1em Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif}wc-dialog{--dialog-border:none;--dialog-border-radius:5px;--dialog-header-bgcolor:#fff;--dialog-header-font:bold 1.6em Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif;--dialog-header-justify:center;position:relative}section{margin:0;padding:8px;width:20em}form{margin:0;padding:0}input[type=text], input[type=email], input[type=password]{border-width:1px;box-sizing:border-box;display:block;margin:4px 0;padding:10px 8px;width:100%}div{position:relative}button.sign-in{margin-top:16px;width:100%}button.show-pw{color:var(--login-dialog-link-color);position:absolute;bottom:13px;right:7px}.password-block{align-items:baseline;display:flex;justify-content:space-between;margin-top:12px}.forgot-pw{font-size:clamp(10px, .75em, 16px);margin:0;padding:0}.sign-up{font-size:clamp(9px, .61em, 14px);margin-top:12px;text-align:center}.error-message{background-color:#F99;border:1px solid #E66;margin-bottom:12px;padding:6px;text-align:center}a{color:var(--login-dialog-link-color);text-decoration:none}a:hover{text-decoration:underline}.spinner-holder{align-items:center;background-color:#3335;display:flex;justify-content:center;position:absolute;top:0;left:0;right:0;bottom:0}`;

//************************************************************************************
// Define class LoginDialogElement for component <login-dialog>
export class LoginDialogElement extends EvoElement() {
  #els = {};
  #busy;
  #errorMessage;
  #forgotPwHref;
  #forgotPwText;
  #hideText;
  #notAMemberText;
  #passwordLabel;
  #rememberMeText;
  #showRememberMe;
  #showText;
  #signInHref;
  #signInMethod;
  #signInText;
  #signUpHref;
  #signUpText;
  #title;
  #usernameLabel;
  #_password;
  #_passwordType;
  #_rememberMe;
  #_toggleState;
  #_token;
  #_username;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['busy', 'error-message', 'forgot-pw-href', 'forgot-pw-text', 'hide-text', 'not-a-member-text', 'password-label', 'remember-me-text', 'show-remember-me', 'show-text', 'sign-in-href', 'sign-in-method', 'sign-in-text', 'sign-up-href', 'sign-up-text', 'title', 'username-label'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el21_c = comment(' el21 ', this.#els.el21);
    this.#els.el3_c = comment(' el3 ', this.#els.el3);
    this.#els.el10_c = comment(' el10 ', this.#els.el10);
    this.#els.el13_c = comment(' el13 ', this.#els.el13);
    this.#els.el18_c = comment(' el18 ', this.#els.el18);

    // Initialize with default values
    this.busy ??= false;
    this.errorMessage ??= '';
    this.forgotPwHref ??= '';
    this.forgotPwText ??= 'Forgot password?';
    this.hideText ??= 'hide';
    this.notAMemberText ??= 'Not a member yet?';
    this.passwordLabel ??= 'Password:';
    this.rememberMeText ??= 'Remember Me';
    this.showRememberMe ??= false;
    this.showText ??= 'show';
    this.signInHref ??= '';
    this.signInMethod ??= 'post';
    this.signInText ??= 'Sign in';
    this.signUpHref ??= '';
    this.signUpText ??= 'Sign Up';
    this.title ??= 'Sign Up';
    this.usernameLabel ??= 'Email:';
    this.#password ??= '';
    this.#passwordType ??= 'password';
    this.#rememberMe ??= false;
    this.#toggleState ??= 'show';
    this.#token ??= '';
    this.#username ??= '';

    // Event handlers
    ael(this.#els.el2, 'input', (evt)=>this.#_token_onInputHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el6, 'input', (evt)=>this.#_username_onInputHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el11, 'input', (evt)=>this.#_password_onInputHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el1, 'submit', (evt)=>this.#login(evt, {...evt.target.dataset}));
    ael(this.#els.el3, 'click', (evt)=>this.#clearError(evt, {...evt.target.dataset}));
    ael(this.#els.el10, 'click', (evt)=>this.#forgotPw(evt, {...evt.target.dataset}));
    ael(this.#els.el12, 'click', (evt)=>this.#toggle(evt, {...evt.target.dataset}));
    ael(this.#els.el15, 'input', (evt)=>this.#rememberMeHandler(evt, {...evt.target.dataset}));
    ael(this.#els.el20, 'click', (evt)=>this.#signUp(evt, {...evt.target.dataset}));

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
  #_username_onInputHandler(evt) {
    this.#username = evt.target.value;
    this.#clearError(evt, data);
  }
  #_password_onInputHandler(evt) {
    this.#password = evt.target.value;
    this.#clearError(evt, data);
  }

  //**********************************************************************************
  // Properties
  get busy() {
    return this.#busy;
  }
  set busy(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#busy) {
      const oldVal = this.#busy;
      this.#busy = newVal;
      cond(this.#els.el21, newVal, this.#els.el21_c );
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

  get forgotPwHref() {
    return this.#forgotPwHref;
  }
  set forgotPwHref(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#forgotPwHref) {
      const oldVal = this.#forgotPwHref;
      this.#forgotPwHref = newVal;
      this.#els.el10.href = newVal;
      cond(this.#els.el10, newVal, this.#els.el10_c );
      this.#callUpdate('forgotPwHref', oldVal, newVal);
    }
  }

  get forgotPwText() {
    return this.#forgotPwText;
  }
  set forgotPwText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#forgotPwText) {
      const oldVal = this.#forgotPwText;
      this.#forgotPwText = newVal;
      this.#els.el10.textContent = newVal;
      this.#callUpdate('forgotPwText', oldVal, newVal);
    }
  }

  get hideText() {
    return this.#hideText;
  }
  set hideText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#hideText) {
      const oldVal = this.#hideText;
      this.#hideText = newVal;
      this.#callUpdate('hideText', oldVal, newVal);
    }
  }

  get notAMemberText() {
    return this.#notAMemberText;
  }
  set notAMemberText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#notAMemberText) {
      const oldVal = this.#notAMemberText;
      this.#notAMemberText = newVal;
      this.#els.el19.textContent = newVal;
      this.#callUpdate('notAMemberText', oldVal, newVal);
    }
  }

  get passwordLabel() {
    return this.#passwordLabel;
  }
  set passwordLabel(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#passwordLabel) {
      const oldVal = this.#passwordLabel;
      this.#passwordLabel = newVal;
      this.#els.el9.textContent = newVal;
      this.#callUpdate('passwordLabel', oldVal, newVal);
    }
  }

  get rememberMeText() {
    return this.#rememberMeText;
  }
  set rememberMeText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#rememberMeText) {
      const oldVal = this.#rememberMeText;
      this.#rememberMeText = newVal;
      this.#els.el16.textContent = newVal;
      this.#callUpdate('rememberMeText', oldVal, newVal);
    }
  }

  get showRememberMe() {
    return this.#showRememberMe;
  }
  set showRememberMe(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#showRememberMe) {
      const oldVal = this.#showRememberMe;
      this.#showRememberMe = newVal;
      cond(this.#els.el13, newVal, this.#els.el13_c );
      this.#callUpdate('showRememberMe', oldVal, newVal);
    }
  }

  get showText() {
    return this.#showText;
  }
  set showText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#showText) {
      const oldVal = this.#showText;
      this.#showText = newVal;
      this.#callUpdate('showText', oldVal, newVal);
    }
  }

  get signInHref() {
    return this.#signInHref;
  }
  set signInHref(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#signInHref) {
      const oldVal = this.#signInHref;
      this.#signInHref = newVal;
      this.#els.el1.action = newVal;
      this.#callUpdate('signInHref', oldVal, newVal);
    }
  }

  get signInMethod() {
    return this.#signInMethod;
  }
  set signInMethod(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#signInMethod) {
      const oldVal = this.#signInMethod;
      this.#signInMethod = newVal;
      this.#els.el1.method = this.#toLower(newVal);
      this.#callUpdate('signInMethod', oldVal, newVal);
    }
  }

  get signInText() {
    return this.#signInText;
  }
  set signInText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#signInText) {
      const oldVal = this.#signInText;
      this.#signInText = newVal;
      this.#els.el17.ariaLabel = newVal;
      this.#els.el17.textContent = newVal;
      this.#callUpdate('signInText', oldVal, newVal);
    }
  }

  get signUpHref() {
    return this.#signUpHref;
  }
  set signUpHref(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#signUpHref) {
      const oldVal = this.#signUpHref;
      this.#signUpHref = newVal;
      this.#els.el20.href = newVal;
      cond(this.#els.el18, newVal, this.#els.el18_c );
      this.#callUpdate('signUpHref', oldVal, newVal);
    }
  }

  get signUpText() {
    return this.#signUpText;
  }
  set signUpText(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#signUpText) {
      const oldVal = this.#signUpText;
      this.#signUpText = newVal;
      this.#els.el20.textContent = newVal;
      this.#callUpdate('signUpText', oldVal, newVal);
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
      this.#els.dialog.title = newVal;
      this.#callUpdate('title', oldVal, newVal);
    }
  }

  get usernameLabel() {
    return this.#usernameLabel;
  }
  set usernameLabel(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#usernameLabel) {
      const oldVal = this.#usernameLabel;
      this.#usernameLabel = newVal;
      this.#els.el5.textContent = newVal;
      this.#callUpdate('usernameLabel', oldVal, newVal);
    }
  }

  get #password() {
    return this.#_password;
  }
  set #password(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_password) {
      const oldVal = this.#_password;
      this.#_password = newVal;
      this.#els.el11.value = newVal;
      this.#callUpdate('#password', oldVal, newVal);
    }
  }

  get #passwordType() {
    return this.#_passwordType;
  }
  set #passwordType(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_passwordType) {
      const oldVal = this.#_passwordType;
      this.#_passwordType = newVal;
      this.#els.el11.type = newVal;
      this.#callUpdate('#passwordType', oldVal, newVal);
    }
  }

  get #rememberMe() {
    return this.#_rememberMe;
  }
  set #rememberMe(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#_rememberMe) {
      const oldVal = this.#_rememberMe;
      this.#_rememberMe = newVal;
      this.#els.el15.checked = newVal;
      this.#callUpdate('#rememberMe', oldVal, newVal);
    }
  }

  get #toggleState() {
    return this.#_toggleState;
  }
  set #toggleState(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_toggleState) {
      const oldVal = this.#_toggleState;
      this.#_toggleState = newVal;
      setAttr( this.#els.el12, 'aria-label', newVal );
      this.#els.el12.textContent = newVal;
      this.#callUpdate('#toggleState', oldVal, newVal);
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

  get #username() {
    return this.#_username;
  }
  set #username(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_username) {
      const oldVal = this.#_username;
      this.#_username = newVal;
      this.#els.el6.value = newVal;
      this.#callUpdate('#username', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  open() {
    this.#username = this.#password = '';
    this.#rememberMe = false;
    setTimeout(() => {
      this.#getToken();
    }, 1);
    return this.#els.dialog.open();
  }

  update(key, oldVal, newVal) {
    if(['showText', 'hideText'].includes(key)) {
      if (this.#passwordType === 'text') {
        this.#toggleState = this.hideText;
      }
      else {
        this.#toggleState = this.showText;
      }
    }
  }
  #toLower(str) {
    return str.toLowerCase();
  }
  #rememberMeHandler(event) {
    this.#rememberMe = event.target.checked;
  }
  #toggle(event) {
    if (this.#passwordType === 'text') {
      this.#toggleState = this.showText;
      console.log(this.#toggleState);
      this.#passwordType = 'password';
    }
    else {
      this.#toggleState = this.hideText;
      console.log(this.#toggleState);
      this.#passwordType = 'text';
    }
  }

  #clearError() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  //******************************************
  // Events
  #getToken() {
    const getTokenEvent = this.dispatch('gettoken', {detail: { token: '' }});
    this.#token = '' + getTokenEvent.detail.token || '';
  }
  #forgotPw(event) {
    const forgotPwEvent = this.dispatch('forgotpw');
    if (forgotPwEvent.defaultPrevented) {
      event.preventDefault();
    }
  }
  #signUp(event) {
    const signUpEvent = this.dispatch('signup');
    if (signUpEvent.defaultPrevented) {
      event.preventDefault();
    }
  }
  #login(event) {
    const data  = {
      username: this.#username,
      password: this.#password,
    };

    if (this.#showRememberMe) {
      data.rememberMe = this.#rememberMe;
    }
    if(this.#token) {
      data.token = this.#token;
    }

    const signInEvent = this.dispatch('signin', {detail: data});
    if (signInEvent.defaultPrevented) {
      event.preventDefault();
      return;
    }

    if (!this.signInHref) {
      this.#els.dialog.closeDialog(DIALOG_BUTTONS.OK, data);
      event.preventDefault();
      return;
    }
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <login-dialog>
customElements.define('login-dialog', LoginDialogElement);
