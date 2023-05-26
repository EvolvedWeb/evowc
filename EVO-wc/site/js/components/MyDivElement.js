//************************************************************************************
// Auto generated code for <my-div>
// Class: MyDivElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'MyDivElement';

//************************************************************************************
// Template string
const template = `<slot></slot>`;

//************************************************************************************
// Styles string
const styles = `:host{align-items:center;background-color:navy;border:1px solid #000;color:#FF0;display:flex;height:fit-content;justify-content:center;padding:10px;text-align:center;width:fit-content}`;

//************************************************************************************
// Define class MyDivElement for component <my-div>
export class MyDivElement extends EvoElement(HTMLDivElement) {
  constructor() {
    super();
    this.createDom({componentName,template,styles,shadowMode: 'closed'});

    // If your class has an init function then we call it.
    if(this.init) {
     this.init();
    }
  }

  //**********************************************************************************
  // Start of your code
  init() {
    this.id = Math.floor(Math.random()*1000);
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <my-div>
customElements.define('my-div', MyDivElement, { extends: 'div' });
