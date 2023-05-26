//************************************************************************************
// Auto generated code for <some-face>
// Class: SomeFaceElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, ael } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'SomeFaceElement';

//************************************************************************************
// Template string
const template = `<span js=el0> <span eye=left></span> <span eye=right></span> <span mouth></span> </span> <button data-locale=happy js=el4>Happy</button> <button data-locale=sad js=el5>Sad</button>`;

//************************************************************************************
// Styles string
const styles = `span[face]{background-color:#FFFF66;border:1px solid #999900;border-radius:50%;display:inline-block;height:100px;margin:10px;position:relative;width:100px}span[eye]{background-color:black;border-radius:50%;display:block;height:10px;position:absolute;top:30px;width:10px}span[eye=left]{left:27px}span[eye=right]{right:27px}span[mouth]{border-bottom:3px solid black;border-radius:50%;bottom:15px;height:60px;left:20px;position:absolute;top:unset;width:60px}span[face=sad] span[mouth]{border:unset;border-top:3px solid black;bottom:unset;top:50%}`;

//************************************************************************************
// Define class SomeFaceElement for component <some-face>
export class SomeFaceElement extends EvoElement() {
  #els = {};
  #state;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});

    // Initialize with default values
    this.state ??= 'sad';

    // Event handlers
    ael(this.#els.el4, 'click', (evt)=>this.#setState(evt, {...evt.target.dataset}));
    ael(this.#els.el5, 'click', (evt)=>this.#setState(evt, {...evt.target.dataset}));

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
  get state() {
    return this.#state;
  }
  set state(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#state) {
      const oldVal = this.#state;
      this.#state = newVal;
      setAttr( this.#els.el0, 'face', newVal );
      this.#callUpdate('state', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  #setState(event) {
    this.state = event.target.dataset.locale;
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <some-face>
customElements.define('some-face', SomeFaceElement);
