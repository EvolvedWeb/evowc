//************************************************************************************
// Auto generated code for <wc-calendar>
// Class: WcCalendarElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, cond, comment, ael, boolFromVal } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'WcCalendarElement';

//************************************************************************************
// Template string
const template = `<table> <thead> <tr class=top><th><button js=el4>❮</button></th><th colspan=5 js=el5></th><th><button js=el7>❯</button></th></tr> <tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr> </thead> <tbody> <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> <tr js=el57><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> </tbody> </table>`;

//************************************************************************************
// Styles string
const styles = `:host{background-color:#FFF;border:1px solid #888;border-radius:5px;display:inline-block;height:fit-content;width:fit-content}table{border-collapse:collapse;font:14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;height:100%;width:100%}th, td{box-sizing:border-box;height:3em;line-height:1em;max-height:3em;max-width:3em;min-height:3em;min-width:3em;padding:4px;width:3em}.top th{border-bottom:1px solid #999}td{position:relative;text-align:center;vertical-align:middle}td[selected] span{background:#ccc;border:4px solid white}button{all:unset;border:1px solid transparent}button, td[selected] span{align-items:center;border-radius:50%;box-sizing:border-box;display:flex;height:100%;justify-content:center;line-height:1em;width:100%}button:hover{background:#ccc}button::focus{border-color:#bbb}`;

//************************************************************************************
// Define class WcCalendarElement for component <wc-calendar>
export class WcCalendarElement extends EvoElement() {
  #els = {};
  #value;
  #locale;
  #_showLast;
  #_title;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['value', 'locale'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el57_c = comment(' el57 ', this.#els.el57);

    // Initialize with default values
    this.value ??= null;
    this.locale ??= '';
    this.#showLast ??= false;
    this.#title ??= '';

    // Event handlers
    ael(this.#els.el4, 'click', (evt)=>this.#prevMonth(evt, {...evt.target.dataset}));
    ael(this.#els.el7, 'click', (evt)=>this.#nextMonth(evt, {...evt.target.dataset}));

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
  get value() {
    return this.#value;
  }
  set value(newVal) {
    newVal = (typeof newVal === 'string' ? new Date(newVal) : newVal);
    if (newVal !== this.#value) {
      const oldVal = this.#value;
      this.#value = newVal;
      this.#callUpdate('value', oldVal, newVal);
    }
  }

  get locale() {
    return this.#locale;
  }
  set locale(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#locale) {
      const oldVal = this.#locale;
      this.#locale = newVal;
      this.#callUpdate('locale', oldVal, newVal);
    }
  }

  get #showLast() {
    return this.#_showLast;
  }
  set #showLast(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#_showLast) {
      const oldVal = this.#_showLast;
      this.#_showLast = newVal;
      cond(this.#els.el57, newVal, this.#els.el57_c );
      this.#callUpdate('#showLast', oldVal, newVal);
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
      this.#els.el5.textContent = newVal;
      this.#callUpdate('#title', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  init() {
    this.value = new Date();
    this.#setTitle();
  }

  update() {
    this.#setTitle();
  }

  #prevMonth() {
    const newDate = new Date(this.value);
    newDate.setMonth(newDate.getMonth() - 1);
    this.value = newDate;
  }

  #nextMonth() {
    const newDate = new Date(this.value);
    newDate.setMonth(newDate.getMonth() + 1);
    this.value = newDate;
  }

  #setTitle() {
    if (this.value) {
      const locale = this.locale || document.documentElement.lang || navigator.language;
      const format = { year: 'numeric', month: 'long' };
      const formatter = new Intl.DateTimeFormat(locale, format);
      this.#title = formatter.format(this.value);
      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      const thisDate = today.getDate();
      const temp = new Date(this.value);
      const showingMonth = temp.getMonth();
      const showingYear = temp.getFullYear();
      temp.setDate(1);
      let dow = temp.getDay();
      temp.setMonth(temp.getMonth()+1);
      temp.setDate(0);
      const lastDate = temp.getDate();
      const tds = [...(this.shadowRoot.querySelectorAll('td'))];
      let date = 1;
      this.#showLast = ((dow === 5 && lastDate === 31) || (dow === 6 && lastDate === 30));
      tds.forEach(td => {
        const isToday = showingYear === thisYear &&
                        showingMonth === thisMonth &&
                        date === thisDate;
        if (isToday && dow === 0) {
          td.setAttribute('selected', '');
        }
        else {
          td.removeAttribute('selected');
        }

        if (dow === 0) {
          if (isToday) {
            td.innerHTML = `<span>${date}</span>`;
          }
          else {
            td.textContent = (date > lastDate) ? '' : date;
          }
          date++;
        }
        else {
          td.textContent = '';
          dow--;
        }
      });
    }
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-calendar>
customElements.define('wc-calendar', WcCalendarElement);
