//************************************************************************************
// Auto generated code for <wc-button>
// Class: WcButtonElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'WcButtonElement';

//************************************************************************************
// Styles string
const styles = `[is="wc-button"], [is="wc-button"][variant="primary"]{--wc-button-bg:#269CE9;--wc-button-border:#398BC1;--wc-button-fg:#fff;--wc-button-shadow:#0005}[is="wc-button"][variant="secondary"]{--wc-button-bg:#6c757d;--wc-button-border:#6c757d}[is="wc-button"][variant="success"]{--wc-button-bg:#198754;--wc-button-border:#198754}[is="wc-button"][variant="info"]{--wc-button-bg:#0dcaf0;--wc-button-border:#0dcaf0}[is="wc-button"][variant="warning"]{--wc-button-bg:#ffc107;--wc-button-border:#ffc107;--wc-button-fg:#000;--wc-button-shadow:#FFFE}[is="wc-button"][variant="danger"]{--wc-button-bg:#dc3545;--wc-button-border:#dc3545}[is="wc-button"][variant="light"]{--wc-button-bg:#f8f9fa;--wc-button-border:#f8f9fa;--wc-button-fg:#000;--wc-button-shadow:#FFFE}[is="wc-button"][variant="dark"]{--wc-button-bg:#212529;--wc-button-border:#212529}[is="wc-button"]{ background-clip:padding-box;background-color:var(--wc-button-bg);background-image:linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));border-radius:4px;border:1px solid var(--wc-button-border);box-shadow:0 1px 0 rgba(0, 0, 0, .3), 0 2px 2px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;color:var(--wc-button-fg);display:inline-block;font:bold 13px arial, helvetica, sans-serif;margin:0;overflow:visible;padding:6px 20px;text-decoration:none;text-shadow:0 1px 0 var(--wc-button-shadow);transition:background-color .2s ease-out;user-select:none;white-space:nowrap;width:fit-content;zoom:1}[is="wc-button"]:not([disabled]):hover{ cursor:pointer;filter:brightness(1.2)}[is="wc-button"]:not([disabled]):active{ box-shadow:0 1px 1px #0004 inset;filter:brightness(1);position:relative;text-shadow:none;top:1px}[is="wc-button"][small]{ padding:3px 10px}[is="wc-button"][large]{ padding:12px 30px;text-transform:uppercase}[is="wc-button"][large]:not([disabled]):active{ top:2px}[is="wc-button"][disabled], [is="wc-button"][disabled]:hover, [is="wc-button"][disabled]:active{ filter:opacity(.9) contrast(.6);cursor:default;box-shadow:none !important;text-shadow:none !important}`;

//************************************************************************************
// Define class WcButtonElement for component <wc-button>
export class WcButtonElement extends EvoElement(HTMLButtonElement) {
  constructor() {
    super();
    this.createDom({componentName,styles,shadowMode: 'none'});
  }
}

// Define the custom element <wc-button>
customElements.define('wc-button', WcButtonElement, { extends: 'button' });