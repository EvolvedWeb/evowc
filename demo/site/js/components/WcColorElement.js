//************************************************************************************
// Auto generated code for <wc-color>
// Class: WcColorElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement, setAttr } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'WcColorElement';

//************************************************************************************
// Template string
const template = `<div class=color-selector js=sel> <div class=wt></div> <div class=bk></div> <span class=selector js=el2></span> </div>`;

//************************************************************************************
// Styles string
const styles = `:host{--wc-color-bg:#FF0000;border:1px solid black;display:inline-grid}.color-selector{background:var(--wc-color-bg, #FF0000);height:100%;min-height:256px;min-width:256px;position:relative;width:100%}.bk{background:linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 100%);height:100%;left:0;position:absolute;top:0;width:100%}.wt{background:linear-gradient(to right, white 0%, rgba(255,255,255,0) 100%);height:100%;left:0;position:absolute;top:0;width:100%}.selector{border:2px solid black;border-radius:50%;color:transparent;display:inline-block;height:3px;pointer-events:none;position:absolute;width:3px}.selctor::after{position:abs}`;

//************************************************************************************
// Define class WcColorElement for component <wc-color>
export class WcColorElement extends EvoElement() {
  #els = {};
  #color;
  #_selectorStyle;
  #_trackPointer;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['color'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});

    // Initialize with default values
    this.color = '#FF0000';
    this.#selectorStyle = '';
    this.#trackPointer = false;

    // Event handlers
    this.#els.sel.addEventListener('pointerdown', (evt)=>this.#pointerDownHandler(evt));
    this.#els.sel.addEventListener('pointermove', (evt)=>this.#pointerMoveHandler(evt));
    this.#els.sel.addEventListener('pointerup', (evt)=>this.#pointerUpHandler(evt));

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

  get #selectorStyle() {
    return this.#_selectorStyle;
  }
  set #selectorStyle(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_selectorStyle) {
      const oldVal = this.#_selectorStyle;
      this.#_selectorStyle = newVal;
      setAttr( this.#els.el2, 'style', newVal );
      this.#callUpdate('#selectorStyle', oldVal, newVal);
    }
  }

  get #trackPointer() {
    return this.#_trackPointer;
  }
  set #trackPointer(newVal) {
    newVal = Boolean(newVal);
    if (newVal !== this.#_trackPointer) {
      const oldVal = this.#_trackPointer;
      this.#_trackPointer = newVal;
      this.#callUpdate('#trackPointer', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  update() {
  }
  #pointerDownHandler(event) {
    this.#trackPointer = true;
    this.#els.sel.setPointerCapture(event.pointerId);
  }
  #pointerMoveHandler(event) {
    if (this.#trackPointer) {
      console.log(event);
      let x = event.layerX;
      let y = event.layerY;
      const h = this.#els.sel.clientHeight;
      const w = this.#els.sel.clientWidth;
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x >= w) {
        x = w-1;
      }
      if (y >= h) {
        y = h-1;
      }
      this.#selectorStyle = `left:${x-3}px;top:${y-3}px`;
    }
  }
  #pointerUpHandler(event) {
    this.#trackPointer = false;
    this.#els.sel.releasePointerCapture(event.pointerId);
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-color>
customElements.define('wc-color', WcColorElement);
