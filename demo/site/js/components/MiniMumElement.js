//************************************************************************************
// Auto generated code for <mini-mum>
// Class: MiniMumElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'MiniMumElement';

//************************************************************************************
// Template string
const template = `<p>Hello world</p>`;

//************************************************************************************
// Define class MiniMumElement for component <mini-mum>
export class MiniMumElement extends EvoElement() {
  constructor() {
    super();
    this.createDom({componentName,template});
  }
}

// Define the custom element <mini-mum>
customElements.define('mini-mum', MiniMumElement);
