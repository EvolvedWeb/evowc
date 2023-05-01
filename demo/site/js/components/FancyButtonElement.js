//************************************************************************************
// Auto generated code for <fancy-button>
// Class: FancyButtonElement
// Generated on: 03/13/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Define class FancyButtonElement for component <fancy-button>
export class FancyButtonElement extends EvoElement(HTMLButtonElement) {
  constructor() {
    super();
    this.createDom({componentName:'FancyButtonElement'});

    // If your class has an init function then we call it.
    if(this.init) {
     this.init();
    }
  }

  //**********************************************************************************
  // Start of your code
  onClick(evt) {
    // Do fancy stuff
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <fancy-button>
customElements.define('fancy-button', FancyButtonElement, { extends: 'button' });
