//************************************************************************************
// Auto generated code for <wc-rank>
// Class: WcRankElement
// Generated on: 05/09/2023
//************************************************************************************
import { EvoElement, setAttr, cond, comment, ael, boolFromVal } from '../EvoElement.js';
const DOG = "Woof Woof!"
const CAT = "Meow meow!"
function mine() {
  // This is a test
  if (10) {
    // Do something
  }
}

//************************************************************************************
// Name of this component
const componentName = 'WcRankElement';

//************************************************************************************
// Template string
const template = `<span class=container> <span class=stars js=span>☆☆☆☆☆<span js=el1>★★★★★</span></span> <span js=el2></span> </span>`;

//************************************************************************************
// Styles string
const styles = `:host, span{--wc-rank-outline-color:#DF8500;--wc-rank-overlay-color:orange;--wc-rank-select-color:blue;display:inline}:host([live]){cursor:pointer}.container{align-items:center;display:inline-flex;gap:4px;justify-content:center;width:fit-content}span{color:var(--wc-rank-outline-color);position:relative}:host([live]) .stars{color:var(--wc-rank-select-color)}:host([live]) .stars [style]{color:var(--wc-rank-select-color)}[style]{left:0;color:var(--wc-rank-overlay-color);overflow:hidden;position:absolute}`;

//************************************************************************************
// Define class WcRankElement for component <wc-rank>
export class WcRankElement extends EvoElement() {
  #els = {};
  #live;
  #rank;
  #showNum;
  #_style;
  #_val;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['live', 'rank', 'show-num'];
  }

  constructor() {
    super();
    this.#els = this.createDom({componentName,template,styles});
    //Conditional Comment Elements
    this.#els.el2_c = comment(' el2 ', this.#els.el2);

    // Initialize with default values
    this.live ??= false;
    this.rank ??= 0;
    this.showNum ??= false;
    this.#style ??= '';
    this.#val ??= '';

    // Event handlers
    ael(this.#els.span, 'mouseleave', (evt)=>this.#mouseLeave(evt, {...evt.target.dataset}));
    ael(this.#els.span, 'mousemove', (evt)=>this.#mouseMove(evt, {...evt.target.dataset}));
    ael(this.#els.span, 'click', (evt)=>this.#click(evt, {...evt.target.dataset}));

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
  get live() {
    return this.#live;
  }
  set live(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#live) {
      const oldVal = this.#live;
      this.#live = newVal;
      setAttr( this, 'live', newVal );
      this.#callUpdate('live', oldVal, newVal);
    }
  }

  get rank() {
    return this.#rank;
  }
  set rank(newVal) {
    newVal = Number(newVal);
    if (newVal < 0) newVal = 0;
    if (newVal > 5) newVal = 5;
    if (newVal !== this.#rank) {
      const oldVal = this.#rank;
      this.#rank = newVal;
      this.#callUpdate('rank', oldVal, newVal);
    }
  }

  get showNum() {
    return this.#showNum;
  }
  set showNum(newVal) {
    newVal = boolFromVal(newVal);
    if (newVal !== this.#showNum) {
      const oldVal = this.#showNum;
      this.#showNum = newVal;
      cond(this.#els.el2, newVal, this.#els.el2_c );
      this.#callUpdate('showNum', oldVal, newVal);
    }
  }

  get #style() {
    return this.#_style;
  }
  set #style(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_style) {
      const oldVal = this.#_style;
      this.#_style = newVal;
      setAttr( this.#els.el1, 'style', newVal );
      this.#callUpdate('#style', oldVal, newVal);
    }
  }

  get #val() {
    return this.#_val;
  }
  set #val(newVal) {
    newVal = newVal==null?null:''+newVal;
    if (newVal !== this.#_val) {
      const oldVal = this.#_val;
      this.#_val = newVal;
      this.#els.el2.textContent = newVal;
      this.#callUpdate('#val', oldVal, newVal);
    }
  }

  //**********************************************************************************
  // Start of your code
  update(key, oldVal, newVal) {
    if (key === 'rank') {
      this.#updateRateing(newVal);
    }
  }

  #updateRateing(rating) {
    const percent = Math.round(100 * (rating / 5));
    this.#style = `width:${percent}%`;
    this.#val = rating.toFixed(1).replace('.0', '');
    this.setAttribute('title', `${rating.toFixed(2)} / 5`);
  }

  #getRank(event) {
    const { offsetX } = event;
    const { offsetWidth, offsetLeft } = this.#els.span;
    return (Math.round((((offsetX - offsetLeft) / offsetWidth) * 50) / 5) / 2) || .5;
  }

  #mouseLeave(event, data) {
    this.#updateRateing(this.rank);
  }

  #mouseMove(event, data) {
    if(this.live) {
      const rank = this.#getRank(event);
      this.#updateRateing(rank);
      event.preventDefault();
    }
  }

  #click(event, data) {
    if (this.live) {
      this.rank = this.#getRank(event);
      this.live = false;
      event.preventDefault();
    }
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-rank>
customElements.define('wc-rank', WcRankElement);
