//************************************************************************************
// Auto generated code for <wc-button-group>
// Class: WcButtonGroupElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'WcButtonGroupElement';

//************************************************************************************
// Styles string
const styles = `wc-button-group{ background:rgba(0, 0, 0, .1);border-bottom:1px solid rgba(0, 0, 0, .1);border-radius:5px;display:inline-flex;flex-direction:row;margin:0;padding:7px;width:fit-content;zoom:1}wc-button-group button:not(:first-child){ border-bottom-left-radius:0;border-top-left-radius:0;margin-left:-1px}wc-button-group button:not(:last-child){ border-bottom-right-radius:0;border-top-right-radius:0}`;

//************************************************************************************
// Define class WcButtonGroupElement for component <wc-button-group>
export class WcButtonGroupElement extends EvoElement() {
  constructor() {
    super();
    this.createDom({componentName,styles,shadowMode: 'none'});
  }
}

// Define the custom element <wc-button-group>
customElements.define('wc-button-group', WcButtonGroupElement);
