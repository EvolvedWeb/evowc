//************************************************************************************
// Auto generated code for <round-progress>
// Class: RoundProgressElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement, setAttr } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'RoundProgressElement';

//************************************************************************************
// Template string
const template = `<section js=el0> <div class=solid-part></div> <div class=moving-part js=el2></div> <div class=cover></div> <div class=text js=el4>&nbsp;</div> </section>`;

//************************************************************************************
// Styles string
const styles = `:host{display:inline-block;height:var(--round-progress-height, 200px);margin:0;min-height:100px;min-width:100px;padding:10px;width:var(--round-progress-width, 200px)}section{height:100%;position:relative;width:100%}.solid-part, .moving-part, .cover{border:40px solid transparent;border-radius:50%;box-sizing:border-box;height:100%;left:0;position:absolute;top:0;width:100%}.solid-part{background-color:var(--round-progress-bgcolor, white);border:40px solid #EEE}.moving-part{border-bottom-color:var(--round-progress-color, #446688)}[range="1"] .solid-part{border-left-color:var(--round-progress-color, #446688)}[range="2"] .solid-part{border-top-color:var(--round-progress-color, #446688);border-left-color:var(--round-progress-color, #446688)}.text{font:36px Tahoma;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.cover{border-bottom:45px solid var(--round-progress-bgcolor, white);height:calc(100% + 1px);width:calc(100% + 1px)}`;

//************************************************************************************
// Define class RoundProgressElement for component <round-progress>
export class RoundProgressElement extends EvoElement() {
  #els = {};
  #value;
  #decimals;
  #lineColor;
  #_range;
  #_moving;
  #_colorStyle;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['value', 'decimals', 'line-color'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});

    // Initialize with default values
    this.value = 0;
    this.decimals = 0;
    this.lineColor = '#446688';
    this.#range = '0';
    this.#moving = '';
    this.#colorStyle = '';

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
    newVal = Number(newVal);
    if (newVal !== this.#value) {
      const oldVal = this.#value;
      this.#value = newVal;
      this.#els.el4.textContent = this.#toFixed(newVal);
      this.#callUpdate('value', oldVal, newVal);
    }
  }

  get decimals() {
    return this.#decimals;
  }
  set decimals(newVal) {
    newVal = parseInt(newVal, 10);
    if (newVal !== this.#decimals) {
      const oldVal = this.#decimals;
      this.#decimals = newVal;
      this.#callUpdate('decimals', oldVal, newVal);
    }
  }

  get lineColor() {
    return this.#lineColor;
  }
  set lineColor(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#lineColor) {
      const oldVal = this.#lineColor;
      this.#lineColor = newVal;
      this.#callUpdate('lineColor', oldVal, newVal);
    }
  }

  get #range() {
    return this.#_range;
  }
  set #range(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_range) {
      const oldVal = this.#_range;
      this.#_range = newVal;
      setAttr( this.#els.el0, 'range', newVal );
      this.#callUpdate('#range', oldVal, newVal);
    }
  }

  get #moving() {
    return this.#_moving;
  }
  set #moving(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_moving) {
      const oldVal = this.#_moving;
      this.#_moving = newVal;
      setAttr( this.#els.el2, 'style', newVal );
      this.#callUpdate('#moving', oldVal, newVal);
    }
  }

  get #colorStyle() {
    return this.#_colorStyle;
  }
  set #colorStyle(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_colorStyle) {
      const oldVal = this.#_colorStyle;
      this.#_colorStyle = newVal;
      setAttr( this.#els.el0, 'style', newVal );
      this.#callUpdate('#colorStyle', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  #toFixed(val) {
    return (+val).toFixed(this.decimals);
  }

  #getHostBG(el) {
    const styles = window.getComputedStyle(el);
    let bgColor = styles.backgroundColor;
    if (bgColor === 'rgba(0, 0, 0, 0)') {
      const parent = el.parentNode;
      if (parent !== document) {
        bgColor = this.#getHostBG(parent);
      }
      else {
        bgColor = 'white';
      }
    }

    return bgColor;
  }

  update(field, oldVal, newVal) {
    switch (field) {
      case 'value':
        const rot = this.value * 2.70;
        this.#range = (rot > 180) ? 2 : (rot > 90) ? 1 : 0;
        this.#moving = `transform:rotate(${rot}deg)`;
        break;

      case 'lineColor':
        const bgColor = this.#getHostBG(this);
        this.#colorStyle = `--round-progress-color:${this.lineColor};--round-progress-bgcolor:${bgColor}`;
        break;
    }
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <round-progress>
customElements.define('round-progress', RoundProgressElement);
