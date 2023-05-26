//************************************************************************************
// Auto generated code for <wc-loop>
// Class: WcLoopElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, cond, comment, ael } from '../EvoElement.js';
const enCollator = new Intl.Collator('en');

//************************************************************************************
// Name of this component
const componentName = 'WcLoopElement';

//************************************************************************************
// Template string
const template = `<div class=main> <h2>Testing For Loops</h2> <div attr.key=item.key> <span text=title></span> <button text=item.name data-key=item.key js=el4></button> <span text=item.age></span> <div js=el6> <h1>Testing</h1> <p>This is a test</p> </div> </div> <button js=el9>Reverse</button> <button js=el10>Sort</button> </div>`;

//************************************************************************************
// Styles string
const styles = `:host{display:block;height:fit-content}.main{ background:#DDD;border:1px solid #000;margin:10px;padding:10px}`;

//************************************************************************************
// Define class WcLoopElement for component <wc-loop>
export class WcLoopElement extends EvoElement() {
  #els = {};
  #things;
  #title;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['things', 'title'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el6_c = comment(' el6 ', this.#els.el6);

    // Initialize with default values
    this.things ??= [];
    this.title ??= '';

    // Event handlers
    ael(this.#els.el4, 'click', (evt)=>this.#clickItem(evt, {...evt.target.dataset}));
    ael(this.#els.el9, 'click', (evt)=>this.#reverse(evt, {...evt.target.dataset}));
    ael(this.#els.el10, 'click', (evt)=>this.#sort(evt, {...evt.target.dataset}));

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
  get things() {
    return this.#things;
  }
  set things(newVal) {
    newVal = (typeof newVal === 'string' ? JSON.parse(newVal) : newVal);
    if (newVal !== this.#things) {
      const oldVal = this.#things;
      this.#things = newVal;
      cond(this.#els.el6, newVal, this.#els.el6_c );
      this.#callUpdate('things', oldVal, newVal);
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
      this.#callUpdate('title', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  init() {
      this.things = [
        { name: 'Iron Man', age: 54, key: 1 },
        { name: 'Alloy', age: 18, key: 2 },
        { name: 'Bugs Bunny', age: 32, key: 3 },
        { name: 'John Smith', age: 12, key: 4 },
        { name: 'Fred Flinstone', age: 32, key: 5 },
        { name: 'Flash Gordon', age: 4, key: 'flash' },
        { name: 'Pen Gillet', age: 62, key: 55 },
        { name: 'Daffy Duck', age: 12, key: 33 },
        { name: 'Jane Doe', age: 32, key: 44 },
        { name: 'Barney Rubble', age: 32, key: 125 },
      ];
  }
  #clickItem(event, data) {
    console.log(data);
  }
  #reverse(event, data) {
    this.things = this.things.reverse();
  }
  #sort(event, data) {
    this.things = [...this.things].sort((a, b) => enCollator.compare(a.name, b.name));
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-loop>
customElements.define('wc-loop', WcLoopElement);
